(function () {
  'use strict';

  const NETEASE_REDIRECT_API = "https://music.znnu.com/api/redirect",
    NETEASE_METING_API = "https://api.injahow.cn/meting/",
    value_4 = NETEASE_METING_API,
    NETEASE_PLAYLIST_MAX_ATTEMPTS = 3,
    NETEASE_PLAYLIST_RETRY_DELAYS = [400, 1200],
    NETEASE_PLAYLIST_REQUEST_TIMEOUT = 12000,
    text_7 = "u2_netease_session_v1",
    text_8 = "libraryNeteaseAccount",
    source_6 = "netease_account",
    count_10 = 18000,
    BOOK_WORKER_URL = "js/library_book_worker.js?v=20260715-reader-worker-v1",
    READER_CHUNK_TARGET_CHARS = 16000,
    count_13 = 3,
    TABS = ["books", "music", "overview"],
    DEFAULT_PREFERENCES = {
      activeTab: "books",
      readerFontSize: 18,
      readerLineHeight: 1.85,
      readerTheme: "light",
      rankingRange: "week",
      togetherFloatSide: "right",
      togetherFloatY: 1
    },
    BOOK_PALETTES = [["linear-gradient(145deg, #b9c1ad, #929d87)", "#273029"], ["linear-gradient(145deg, #c6b5aa, #a69287)", "#352b27"], ["linear-gradient(145deg, #aebdca, #8f9eac)", "#27323d"], ["linear-gradient(145deg, #c6aca8, #a88e8a)", "#382a29"], ["linear-gradient(145deg, #c2ba9d, #a69d80)", "#363329"], ["linear-gradient(145deg, #adbbb5, #8d9d97)", "#293532"], ["linear-gradient(145deg, #b8b0c3, #9c93ad)", "#302c39"], ["linear-gradient(145deg, #c4bbb0, #a79d91)", "#342f2a"]],
    state = {
      ready: false,
      books: [],
      playlists: [],
      tracks: [],
      stats: [],
      preferences: {
        ...DEFAULT_PREFERENCES
      },
      activeTab: "books",
      currentBook: null,
      detailBook: null,
      currentPlaylist: null,
      currentTrack: null,
      queue: [],
      queueIndex: -1,
      chapters: [],
      lyrics: [],
      lyricIndex: -1,
      lyricsStatus: "idle",
      lyricsTrackId: null,
      lyricsRequestId: 0,
      playerShowsLyrics: false,
      together: null,
      togetherListening: null,
      togetherPicker: null,
      playerReturnToChatFriendId: null,
      readerPage: 0,
      readerPageCount: 1,
      readerMetrics: null,
      readerContent: null,
      readerChunkIndex: 0,
      readerChunkStart: 0,
      readerChunkEnd: 0,
      readerOpenRequestId: 0,
      readerPointerStart: null,
      readerLastPointerEventAt: 0,
      readerLastActivityAt: 0,
      readerProgressSaveTimer: null,
      readerProgressSaveBook: null,
      readerSelection: null,
      readerCommentLoading: false,
      togetherFloatDrag: null,
      pendingReadingSeconds: 0,
      pendingListeningSeconds: 0,
      lastMediaTime: 0,
      playbackAttemptId: 0,
      playbackStartingAttemptId: 0,
      neteasePlaybackRetryCount: 0,
      neteaseSessionToken: "",
      neteaseAccount: null,
      neteaseSyncing: false,
      neteaseQrPollTimer: null,
      neteaseQrKey: "",
      neteaseQrImage: "",
      neteaseQrExpiresAt: 0,
      neteaseQrPollPending: false,
      pendingPlayStatTrackId: null,
      isSeeking: false,
      navDragging: false,
      navMouseDragging: false,
      navPointerId: null
    },
    dom = {},
    audio = new Audio();
  audio.preload = "metadata";
  audio.playsInline = true;
  let togetherListeningEventTimer = null,
    lastTogetherListeningEventAt = 0,
    value_17 = null;
  const readerChunkHtmlCache = new Map(),
    readerChunkHtmlCache_2 = new Map(),
    readerChunkHtmlCache_3 = new Map();
  let bookWorker = null,
    count_21 = 0;
  const bookWorkerRequests = new Map();
  function $(id_2) {
    return document.getElementById(id_2);
  }
  function handleAction_22() {
    ["library-view", "library-back-btn", "library-header-action", "library-main", "library-books-page", "library-music-page", "library-overview-page", "library-book-upload-btn", "library-book-file-input", "library-book-count", "library-book-grid", "library-books-empty", "library-import-netease-btn", "library-netease-account", "library-netease-avatar", "library-netease-name", "library-netease-status", "library-netease-sync-progress", "library-netease-login-btn", "library-netease-refresh-btn", "library-netease-logout-btn", "library-add-track-btn", "library-music-add-btn", "library-playlist-count", "library-playlist-list", "library-music-empty", "library-floating-nav", "library-mini-player", "library-mini-open", "library-mini-art", "library-mini-title", "library-mini-artist", "library-mini-play", "library-mini-next", "library-mini-progress", "library-reader-view", "library-reader-back", "library-reader-title", "library-reader-progress-label", "library-reader-settings", "library-reader-toc-button", "library-reader-together", "library-reader-toc", "library-reader-toc-close", "library-reader-toc-list", "library-reader-scroll", "library-reader-content", "library-reader-loading", "library-reader-panel", "library-playlist-view", "library-reader-comment-action", "library-reader-comments-backdrop", "library-reader-comments-close", "library-reader-comments-quote", "library-reader-comments-list", "library-playlist-back", "library-playlist-delete", "library-playlist-cover", "library-playlist-title", "library-playlist-meta", "library-play-all", "library-track-list", "library-player-view", "library-player-close", "library-player-wash", "library-player-art", "library-player-title", "library-player-stage", "library-player-artist", "library-player-progress", "library-player-current", "library-player-duration", "library-player-prev", "library-player-play", "library-player-next", "library-lyrics", "library-import-modal", "library-netease-login-modal", "library-netease-qr", "library-netease-qr-status", "library-netease-qr-message", "library-netease-qr-save", "library-netease-qr-check", "library-netease-qr-retry", "library-import-form", "library-netease-input", "library-track-modal", "library-track-form", "library-track-name", "library-track-artist", "library-track-url", "library-track-cover-url", "library-track-lyric-url", "library-book-detail-modal", "library-book-detail-cover", "library-book-detail-name", "library-book-detail-author", "library-book-detail-progress", "library-book-detail-progress-bar", "library-book-detail-synopsis", "library-book-detail-start", "library-book-detail-edit", "library-book-detail-delete", "library-book-detail-actions", "library-book-edit-form", "library-book-edit-title", "library-book-edit-author", "library-book-edit-cover-url", "library-book-edit-synopsis", "library-book-edit-cancel", "library-char-picker-modal", "library-char-picker-list", "library-char-picker-empty", "library-today-reading", "library-today-listening", "library-week-total", "library-week-chart", "library-ranking-list"].forEach(id_3 => {
      dom[id_3.replace(/^library-/, "").replace(/-/g, "_")] = $(id_3);
    });
  }
  function storage() {
    if (!window.appStorage) throw new Error("App storage is unavailable.");
    return window.appStorage;
  }
  function toast(message_2) {
    if (window.showToast) window.showToast(message_2);else console.info("[Library]", message_2);
  }
  function escapeHtml(value_2) {
    return String(value_2 ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function safeHttpUrl(value_3) {
    try {
      const url_2 = new URL(String(value_3 || "").trim());
      return ["http:", "https:"].includes(url_2.protocol) ? url_2.href : "";
    } catch (error_2) {
      return "";
    }
  }
  function handleAction_23() {
    const metaNameU2NeteaseGatewayElement = document.querySelector("meta[name=\"u2-netease-gateway\"]"),
      value_184 = window.u2NativeBridge?.isNativeAndroid?.() === true,
      trim_185 = String((value_184 ? metaNameU2NeteaseGatewayElement?.dataset?.android : "") || metaNameU2NeteaseGatewayElement?.content || "auto").trim();
    if (!trim_185 || trim_185.toLowerCase() === "auto") {
      if (location.protocol === "file:") return "http://localhost:3001";
      if (!["http:", "https:"].includes(location.protocol)) return "";
      const toLowerCase_186 = String(location.hostname || "").toLowerCase(),
        map_187 = toLowerCase_186.split(".").map(Number),
        value_188 = map_187.length === 4 && map_187.every(value_190 => Number.isInteger(value_190) && value_190 >= 0 && value_190 <= 255) && (map_187[0] === 10 || map_187[0] === 172 && map_187[1] >= 16 && map_187[1] <= 31 || map_187[0] === 192 && map_187[1] === 168),
        value_189 = location.protocol === "http:" && location.port && location.port !== "3001" && (["localhost", "127.0.0.1", "[::1]"].includes(toLowerCase_186) || value_188);
      if (value_189) {
        const value_191 = new URL(location.origin);
        return value_191.port = "3001", value_191.href.replace(/\/+$/, "");
      }
      return location.origin.replace(/\/+$/, "");
    }
    try {
      const value_192 = new URL(trim_185, location.href),
        includes_193 = ["localhost", "127.0.0.1"].includes(value_192.hostname),
        value_194 = location.protocol === "http:" && !["localhost", "127.0.0.1"].includes(location.hostname);
      if (includes_193 && value_194) value_192.hostname = location.hostname;
      return value_192.href.replace(/\/+$/, "");
    } catch (value_195) {
      return trim_185.replace(/\/+$/, "");
    }
  }
  function handleAction_24(value_196) {
    const buffer_2 = handleAction_23();
    if ([404, 405].includes(Number(value_196?.status)) && buffer_2 === location.origin.replace(/\/+$/, "")) return "当前站点尚未部署网易云 Pages Function，请重新发布包含 functions 目录的版本。";
    if (Number(value_196?.status) >= 400 && value_196?.message) return String(value_196.message);
    try {
      const bytes = new URL(buffer_2),
        value_199 = location.protocol === "http:" && !["localhost", "127.0.0.1"].includes(location.hostname);
      if (location.protocol === "https:" && bytes.protocol === "http:") return "当前网页使用 HTTPS，无法连接 HTTP 网易云网关。请配置 HTTPS 网关地址。";
      if (value_199 && bytes.hostname === location.hostname) return "无法连接网易云网关。请确认网关已启动，并在 gateway/.env 中开启 ALLOW_PRIVATE_NETWORK_ORIGINS=true。";
      if (bytes.origin === location.origin && !["localhost", "127.0.0.1"].includes(bytes.hostname)) return "无法连接网易云服务，请稍后再试。";
    } catch (value_200) {}
    if (value_196?.name === "AbortError") return "网易云网关连接超时，请确认网关已启动。";
    if (value_196 instanceof TypeError && /failed to fetch/i.test(String(value_196.message || ""))) return "无法连接网易云网关（" + buffer_2 + "）。请先运行 npm run netease:gateway。";
    return value_196?.message || "请确认网易云网关已经启动";
  }
  function handleAction_25() {
    return String(state.neteaseSessionToken || "").trim();
  }
  async function handleAction_26(resourceId) {
    state.neteaseSessionToken = String(resourceId || "").trim();
    if (state.neteaseSessionToken) await storage().setPrivateSession(text_7, state.neteaseSessionToken);else await storage().deletePrivateSession(text_7);
  }
  function handleAction_27(track_2) {
    return track_2?.source === source_6 && /^\d+$/.test(String(track_2.neteaseId || ""));
  }
  async function handleAction_28(value_203, value_204 = {}) {
    const value_205 = window.u2NativeBridge?.isNativeAndroid?.() === true,
      controller = new AbortController(),
      setTimeout_206 = setTimeout(() => controller.abort(), Number(value_204.timeoutMs) || count_10),
      headers_2 = {
        Accept: "application/json",
        ...(value_204.headers || {})
      };
    if (value_204.auth !== false) {
      const handleAction_25_208 = handleAction_25();
      if (!handleAction_25_208) {
        const value_209 = new Error("请先扫码登录网易云音乐");
        value_209.code = "SESSION_REQUIRED";
        throw value_209;
      }
      headers_2["X-Netease-Session"] = handleAction_25_208;
    }
    if (value_204.body !== undefined) headers_2["Content-Type"] = "application/json";
    try {
      const url_5 = "" + handleAction_23() + value_203;
      let status_3, value_212;
      if (value_205) {
        const requestNetEaseGateway_213 = window.u2NativeBridge?.requestNetEaseGateway;
        if (typeof requestNetEaseGateway_213 !== "function") throw new Error("安卓原生网络模块尚未就绪，请重启应用");
        const value_214 = await requestNetEaseGateway_213({
          url: url_5,
          method: value_204.method || "GET",
          headers: headers_2,
          body: value_204.body,
          timeoutMs: Number(value_204.timeoutMs) || count_10
        });
        status_3 = Number(value_214?.status) || 0;
        value_212 = value_214?.data;
        if (typeof value_212 === "string") try {
          value_212 = JSON.parse(value_212);
        } catch (value_215) {
          value_212 = {};
        }
        if (!value_212 || typeof value_212 !== "object") value_212 = {};
      } else {
        const value_216 = await fetch(url_5, {
          method: value_204.method || "GET",
          headers: headers_2,
          body: value_204.body === undefined ? undefined : JSON.stringify(value_204.body),
          signal: controller.signal,
          mode: "cors",
          credentials: "omit"
        });
        status_3 = value_216.status;
        try {
          value_212 = await value_216.json();
        } catch (value_217) {
          value_212 = {};
        }
      }
      if (status_3 < 200 || status_3 >= 300) {
        const value_218 = new Error(value_212?.error?.message || "网易云网关请求失败 (" + status_3 + ")");
        value_218.code = value_212?.error?.code || "GATEWAY_ERROR";
        value_218.status = status_3;
        status_3 === 401 && (await handleAction_26(""), handleAction_127());
        throw value_218;
      }
      return value_212;
    } finally {
      clearTimeout(setTimeout_206);
    }
  }
  function safeImageSource(value_5) {
    const source_2 = String(value_5 || "").trim();
    if (/^https?:\/\//i.test(source_2)) return safeHttpUrl(source_2);
    if (/^data:image\/(?:png|jpe?g|gif|webp|avif);base64,/i.test(source_2)) return source_2;
    if (/^blob:/i.test(source_2) || /^(?:\.\/)?assets\//i.test(source_2)) return source_2;
    return "";
  }
  function handleAction_29(track_3) {
    const safeHttpUrl_222 = safeHttpUrl(track_3?.coverUrl),
      value_223 = "<small>" + escapeHtml(String(track_3?.sourceType || "TEXT").toUpperCase()) + "</small><strong>" + escapeHtml(track_3?.title || "未命名") + "</strong>";
    return safeHttpUrl_222 ? value_223 + "<img class=\"library-book-cover-image\" src=\"" + escapeHtml(safeHttpUrl_222) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\" onerror=\"this.remove()\">" : value_223;
  }
  function extractNetEaseResourceId(resourceId_2) {
    const source_3 = String(resourceId_2 || "").trim();
    if (!source_3) return "";
    try {
      const value_227 = new URL(source_3),
        result = value_227.searchParams.get("id");
      if (/^\d+$/.test(result || "")) return result;
    } catch (value_228) {}
    const pathId = source_3.match(/\/(\d{8,})(?:\.[a-z0-9]+)?(?:[?#]|$)/i);
    return pathId ? pathId[1] : "";
  }
  function buildNetEaseResourceUrl(value_229, resourceId_3, value_231 = "") {
    const trim_232 = String(resourceId_3 || "").trim();
    if (!trim_232) return "";
    const value_233 = value_231 ? "&_=" + encodeURIComponent(value_231) : "";
    return value_4 + "?server=netease&type=" + encodeURIComponent(value_229) + "&id=" + encodeURIComponent(trim_232) + value_233;
  }
  function normalizeNetEaseTrackResources(track_4) {
    if (!track_4 || track_4.source !== "netease") return track_4;
    const currentMedia = safeHttpUrl(track_4.mediaUrl),
      currentCover = safeHttpUrl(track_4.coverUrl),
      currentLyric_2 = safeHttpUrl(track_4.lyricUrl),
      songId = String(track_4.neteaseId || extractNetEaseResourceId(currentMedia) || "").trim();
    if (!songId) return track_4;
    const picId = String(track_4.neteasePicId || extractNetEaseResourceId(currentCover) || "").trim(),
      lyricId = String(track_4.neteaseLyricId || extractNetEaseResourceId(currentLyric_2) || songId).trim(),
      mediaUrl_2 = buildNetEaseResourceUrl("url", songId) || currentMedia;
    return {
      ...track_4,
      neteaseId: songId,
      neteasePicId: picId,
      neteaseLyricId: lyricId,
      mediaUrl: mediaUrl_2,
      coverUrl: currentCover || buildNetEaseResourceUrl("pic", picId),
      lyricUrl: currentLyric_2 || buildNetEaseResourceUrl("lrc", lyricId),
      available: !!mediaUrl_2
    };
  }
  function uid(value_242) {
    if (window.crypto?.randomUUID) return value_242 + "_" + window.crypto.randomUUID();
    return value_242 + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
  }
  function hashString(value_6) {
    let hash_2 = 0;
    for (const char of String(value_6 || "")) hash_2 = (hash_2 << 5) - hash_2 + char.charCodeAt(0) | 0;
    return Math.abs(hash_2);
  }
  function localDateKey(date_2 = new Date()) {
    const fullYear = date_2.getFullYear(),
      month_2 = String(date_2.getMonth() + 1).padStart(2, "0"),
      day_2 = String(date_2.getDate()).padStart(2, "0");
    return fullYear + "-" + month_2 + "-" + day_2;
  }
  function lastSevenDays() {
    const result_2 = [],
      value_249 = new Date();
    value_249.setHours(12, 0, 0, 0);
    for (let offset_2 = 6; offset_2 >= 0; offset_2 -= 1) {
      const date_3 = new Date(value_249);
      date_3.setDate(value_249.getDate() - offset_2);
      result_2.push({
        key: localDateKey(date_3),
        label: ["日", "一", "二", "三", "四", "五", "六"][date_3.getDay()]
      });
    }
    return result_2;
  }
  function formatDuration(seconds_2, value_253 = false) {
    const safe = Math.max(0, Math.round(Number(seconds_2) || 0));
    if (safe < 60) return value_253 ? safe + "秒" : "0分钟";
    const floor_255 = Math.floor(safe / 60);
    if (floor_255 < 60) return floor_255 + "分钟";
    const floor_256 = Math.floor(floor_255 / 60),
      value_257 = floor_255 % 60;
    return value_257 ? floor_256 + "小时" + value_257 + "分" : floor_256 + "小时";
  }
  function formatClock(seconds_3) {
    const safe_2 = Math.max(0, Number.isFinite(Number(seconds_3)) ? Number(seconds_3) : 0),
      floor_260 = Math.floor(safe_2 / 60),
      floor_261 = Math.floor(safe_2 % 60);
    return floor_260 + ":" + String(floor_261).padStart(2, "0");
  }
  function setArtwork(element, value_262, value_263 = "fa-music") {
    if (!element) return;
    const safeHttpUrl_264 = safeHttpUrl(value_262);
    element.innerHTML = safeHttpUrl_264 ? "<img src=\"" + escapeHtml(safeHttpUrl_264) + "\" alt=\"\" referrerpolicy=\"no-referrer\">" : "<i class=\"fas " + value_263 + "\"></i>";
  }
  function getTrack(trackId_2) {
    return state.tracks.find(track_5 => track_5.id === trackId_2) || null;
  }
  function getPlaylist(playlistId_2) {
    return state.playlists.find(playlist_2 => playlist_2.id === playlistId_2) || null;
  }
  async function handleAction_38() {
    const repo = storage(),
      [value_270, playlists_2, tracks_2, stats_2, preferences_2, value_275, value_276] = await Promise.all([repo.loadLibraryBooks(), repo.loadLibraryPlaylists(), repo.loadLibraryTracks(), repo.loadLibraryDailyStats(), repo.getSetting("libraryPreferences", DEFAULT_PREFERENCES), repo.getSetting(text_8, null), repo.getPrivateSession(text_7)]);
    state.books = (Array.isArray(value_270) ? value_270 : []).map(book_2 => ({
      ...book_2,
      author: String(book_2?.author || "").trim() || "未知作者",
      synopsis: String(book_2?.synopsis || "").trim() || "暂无简介",
      coverUrl: safeHttpUrl(book_2?.coverUrl)
    }));
    state.tracks = (Array.isArray(tracks_2) ? tracks_2 : []).map(normalizeNetEaseTrackResources);
    state.playlists = (Array.isArray(playlists_2) ? playlists_2 : []).map(playlist_3 => {
      if (playlist_3?.source !== "netease") return playlist_3;
      const firstCover = (playlist_3.trackIds || []).map(trackId_3 => state.tracks.find(track_6 => track_6.id === trackId_3)?.coverUrl || "").find(Boolean);
      return firstCover ? {
        ...playlist_3,
        coverUrl: firstCover
      } : playlist_3;
    });
    state.stats = Array.isArray(stats_2) ? stats_2 : [];
    state.preferences = {
      ...DEFAULT_PREFERENCES,
      ...(preferences_2 || {})
    };
    state.neteaseAccount = value_275 && typeof value_275 === "object" ? value_275 : null;
    state.neteaseSessionToken = String(value_276 || "");
    state.activeTab = TABS.includes(state.preferences.activeTab) ? state.preferences.activeTab : "books";
  }
  async function savePreferences() {
    state.preferences.activeTab = state.activeTab;
    await storage().setSetting("libraryPreferences", state.preferences);
  }
  function setLibraryViewHidden(hidden_2) {
    if (!dom.view) return;
    hidden_2 && dom.view.contains(document.activeElement) && document.activeElement?.blur?.();
    dom.view.toggleAttribute("inert", !!hidden_2);
    dom.view.setAttribute("aria-hidden", hidden_2 ? "true" : "false");
  }
  function openApp(tab) {
    if (!state.ready) return;
    if (TABS.includes(tab)) switchTab(tab, false);
    dom.view.classList.add("active");
    setLibraryViewHidden(false);
  }
  function close_2() {
    if (dom.reader_view.classList.contains("active")) closeReader();
    dom.playlist_view.classList.remove("active");
    dom.player_view.classList.remove("active");
    state.playerReturnToChatFriendId = null;
    closeAllModals();
    dom.view.classList.remove("active");
    setLibraryViewHidden(true);
    savePreferences()["catch"](console.error);
  }
  function switchTab(tab_2, value_283 = true) {
    if (!TABS.includes(tab_2)) return;
    state.activeTab = tab_2;
    const index_2 = TABS.indexOf(tab_2);
    dom.view.style.setProperty("--library-nav-index", String(index_2));
    dom.view.querySelectorAll("[data-library-page]").forEach(page_2 => {
      page_2.classList.toggle("active", page_2.dataset.libraryPage === tab_2);
    });
    dom.floating_nav.querySelectorAll("[data-library-tab]").forEach(button_2 => {
      button_2.classList.toggle("active", button_2.dataset.libraryTab === tab_2);
    });
    dom.header_action.style.visibility = tab_2 === "overview" ? "hidden" : "visible";
    if (tab_2 === "overview") renderOverview();
    if (value_283) savePreferences()["catch"](console.error);
  }
  function renderBooks() {
    const sorted = [...state.books].sort((a_2, b_2) => Number(b_2.updatedAt || 0) - Number(a_2.updatedAt || 0));
    dom.book_count.textContent = sorted.length + " " + (sorted.length === 1 ? "BOOK" : "BOOKS");
    dom.books_empty.hidden = sorted.length > 0;
    dom.book_grid.hidden = sorted.length === 0;
    dom.book_grid.innerHTML = sorted.map(value_290 => {
      const value_291 = BOOK_PALETTES[hashString(value_290.id) % BOOK_PALETTES.length];
      return "\n                <article class=\"library-book-card\" data-book-id=\"" + escapeHtml(value_290.id) + "\">\n                    <button class=\"library-book-open\" type=\"button\" data-book-action=\"details\" aria-label=\"查看《" + escapeHtml(value_290.title || "未命名") + "》详情\">\n                        <span class=\"library-book-cover\" style=\"background:" + value_291[0] + ";color:" + value_291[1] + "\">\n                            " + handleAction_29(value_290) + "\n                        </span>\n                    </button>\n                </article>";
    }).join("");
  }
  function fileBaseName(name_2) {
    return String(name_2 || "未命名书籍").replace(/\.[^/.]+$/, "") || "未命名书籍";
  }
  function decodeTextFile(buffer_3) {
    const bytes_2 = new Uint8Array(buffer_3);
    if (bytes_2[0] === 239 && bytes_2[1] === 187 && bytes_2[2] === 191) return new TextDecoder("utf-8").decode(bytes_2.subarray(3));
    if (bytes_2[0] === 255 && bytes_2[1] === 254) return new TextDecoder("utf-16le").decode(bytes_2.subarray(2));
    if (bytes_2[0] === 254 && bytes_2[1] === 255) return new TextDecoder("utf-16be").decode(bytes_2.subarray(2));
    try {
      return new TextDecoder("utf-8", {
        fatal: true
      }).decode(bytes_2);
    } catch (value_295) {
      try {
        return new TextDecoder("gb18030").decode(bytes_2);
      } catch (value_296) {
        return new TextDecoder("utf-8").decode(bytes_2);
      }
    }
  }
  function parseLibraryXml(text_4, value_298) {
    const doc_2 = new DOMParser().parseFromString(String(text_4 || ""), "application/xml"),
      parserError = doc_2.getElementsByTagName("parsererror")[0];
    if (parserError) throw new Error((value_298 || "XML") + " 解析失败");
    return doc_2;
  }
  function getXmlElementsByLocalName(doc, localName_2) {
    return [...doc.getElementsByTagName("*")].filter(node => node.localName === localName_2);
  }
  function getFirstXmlText(doc_3, localNames) {
    const names = new Set((Array.isArray(localNames) ? localNames : [localNames]).map(String)),
      match_2 = [...doc_3.getElementsByTagName("*")].find(node_2 => names.has(node_2.localName));
    return String(match_2?.textContent || "").trim();
  }
  function cleanBookPlainText(text_5) {
    return String(text_5 || "").replace(/\u00a0/g, " ").replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  }
  function handleAction_43(path) {
    const normalized = String(path || "").replace(/\\/g, "/"),
      index_3 = normalized.lastIndexOf("/");
    return index_3 >= 0 ? normalized.slice(0, index_3 + 1) : "";
  }
  function resolveZipPath(value_309, value_310) {
    let safeHref = String(value_310 || "");
    try {
      safeHref = decodeURIComponent(safeHref);
    } catch (value_312) {}
    const parts = ("" + (value_309 || "") + safeHref).replace(/\\/g, "/").split("/"),
      resolved = [];
    return parts.forEach(part => {
      if (!part || part === ".") return;
      if (part === "..") resolved.pop();else resolved.push(part);
    }), resolved.join("/");
  }
  async function readZipText(value_313, value_314, value_315) {
    const file_316 = value_313.file(value_314);
    if (!file_316) throw new Error((value_315 || value_314) + " 缺失");
    return file_316.async("string");
  }
  function htmlNodeToPlainText(node_3) {
    if (!node_3) return "";
    if (node_3.nodeType === Node.TEXT_NODE) return node_3.nodeValue || "";
    if (node_3.nodeType !== Node.ELEMENT_NODE && node_3.nodeType !== Node.DOCUMENT_NODE) return "";
    const tag = node_3.nodeType === Node.ELEMENT_NODE ? node_3.tagName.toLowerCase() : "";
    if (["script", "style", "svg", "head", "nav"].includes(tag)) return "";
    if (tag === "br") return "\n";
    const text_6 = [...node_3.childNodes].map(htmlNodeToPlainText).join("");
    if (["address", "article", "aside", "blockquote", "body", "div", "dl", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "li", "main", "ol", "p", "pre", "section", "table", "tr", "ul"].includes(tag)) return "\n" + text_6 + "\n";
    return text_6;
  }
  function extractEpubHtmlChapter(html, fallbackTitle) {
    const doc_4 = new DOMParser().parseFromString(String(html || ""), "text/html"),
      title_2 = String(doc_4.querySelector("h1,h2,h3,title")?.textContent || fallbackTitle || "").trim(),
      rawText = htmlNodeToPlainText(doc_4.body || doc_4.documentElement);
    return {
      title: title_2,
      text: cleanBookPlainText(rawText)
    };
  }
  async function handleAction_48(file_2) {
    await window.u2LoadVendorLibrary?.("jszip");
    if (!window.JSZip?.loadAsync) throw new Error("EPUB 解析组件未加载，请检查网络后重试");
    const zip = await window.JSZip.loadAsync(await file_2.arrayBuffer()),
      containerText = await readZipText(zip, "META-INF/container.xml", "EPUB container.xml"),
      containerXml = parseLibraryXml(containerText, "EPUB container.xml"),
      rootfilePath = getXmlElementsByLocalName(containerXml, "rootfile")[0]?.getAttribute("full-path");
    if (!rootfilePath) throw new Error("EPUB 缺少 OPF 入口");
    const opfText = await readZipText(zip, rootfilePath, "EPUB OPF"),
      opfXml = parseLibraryXml(opfText, "EPUB OPF"),
      opfDir = handleAction_43(rootfilePath),
      title_3 = getFirstXmlText(opfXml, "title") || fileBaseName(file_2.name),
      author_2 = getFirstXmlText(opfXml, "creator") || "未知作者",
      synopsis_2 = getFirstXmlText(opfXml, "description") || "暂无简介",
      manifest = new Map();
    getXmlElementsByLocalName(opfXml, "item").forEach(item_2 => {
      const id_4 = item_2.getAttribute("id"),
        href_2 = item_2.getAttribute("href");
      if (!id_4 || !href_2) return;
      manifest.set(id_4, {
        href: href_2,
        mediaType: item_2.getAttribute("media-type") || "",
        properties: item_2.getAttribute("properties") || ""
      });
    });
    const spineItems = getXmlElementsByLocalName(opfXml, "itemref").map(itemref => manifest.get(itemref.getAttribute("idref") || "")).filter(item => item && (/application\/xhtml\+xml|text\/html/i.test(item.mediaType) || /\.x?html?$/i.test(item.href)));
    if (!spineItems.length) throw new Error("EPUB 缺少可读取章节");
    const chapters_2 = [];
    for (const item_3 of spineItems) {
      const chapterPath = resolveZipPath(opfDir, item_3.href),
        chapterHtml = await readZipText(zip, chapterPath, chapterPath),
        chapter_2 = extractEpubHtmlChapter(chapterHtml, fileBaseName(item_3.href));
      if (chapter_2.text) chapters_2.push(chapter_2);
    }
    if (!chapters_2.length) throw new Error("EPUB 没有可读取正文");
    const text_10 = cleanBookPlainText(chapters_2.map(chapter_3 => {
      const heading = chapter_3.title ? "# " + chapter_3.title : "";
      return [heading, chapter_3.text].filter(Boolean).join("\n\n");
    }).join("\n\n"));
    if (!text_10) throw new Error("EPUB 解析后正文为空");
    return {
      text: text_10,
      sourceType: "EPUB",
      title: title_3,
      author: author_2,
      synopsis: synopsis_2
    };
  }
  async function handleAction_49(file_3) {
    const lower = String(file_3.name || "").toLowerCase();
    if (lower.endsWith(".epub")) return handleAction_48(file_3);
    if (lower.endsWith(".docx")) {
      await window.u2LoadVendorLibrary?.("mammoth");
      if (!window.mammoth?.extractRawText) throw new Error("DOCX 解析组件未加载，请检查网络后重试");
      const result_3 = await window.mammoth.extractRawText({
        arrayBuffer: await file_3.arrayBuffer()
      });
      return {
        text: String(result_3?.value || "").replace(/\r\n/g, "\n"),
        sourceType: "DOCX",
        title: fileBaseName(file_3.name),
        author: "未知作者",
        synopsis: "暂无简介"
      };
    }
    return {
      text: decodeTextFile(await file_3.arrayBuffer()).replace(/\r\n/g, "\n").replace(/\u0000/g, ""),
      sourceType: "TXT",
      title: fileBaseName(file_3.name),
      author: "未知作者",
      synopsis: "暂无简介"
    };
  }
  function handleAction_50() {
    if (bookWorker) return bookWorker;
    if (typeof Worker !== "function") return null;
    try {
      return bookWorker = new Worker(BOOK_WORKER_URL), bookWorker.addEventListener("message", event_2 => {
        const pending_2 = bookWorkerRequests.get(event_2.data?.id);
        if (!pending_2) return;
        bookWorkerRequests["delete"](event_2.data.id);
        if (event_2.data.ok) pending_2.resolve(event_2.data.book);else pending_2.reject(new Error(event_2.data.error || "书籍解析失败"));
      }), bookWorker.addEventListener("error", event => {
        const error_3 = new Error(event.message || "书籍解析 Worker 运行失败");
        bookWorkerRequests.forEach(pending => pending.reject(error_3));
        bookWorkerRequests.clear();
        bookWorker?.terminate();
        bookWorker = null;
      }), bookWorker;
    } catch (value_353) {
      return bookWorker = null, null;
    }
  }
  function parseBookInWorker(file_4) {
    const worker = handleAction_50();
    if (!worker) return Promise.reject(new Error("BOOK_WORKER_UNAVAILABLE"));
    return file_4.arrayBuffer().then(buffer_4 => new Promise((resolve_9, reject_2) => {
      const id_5 = "book-worker-" + Date.now() + "-" + ++count_21;
      bookWorkerRequests.set(id_5, {
        resolve: resolve_9,
        reject: reject_2
      });
      worker.postMessage({
        id: id_5,
        type: "parse-book",
        name: file_4.name,
        buffer: buffer_4
      }, [buffer_4]);
    }));
  }
  function indexReaderContentInWorker(text_12) {
    const worker_2 = handleAction_50();
    if (!worker_2) return Promise.reject(new Error("BOOK_WORKER_UNAVAILABLE"));
    return new Promise((resolve_10, reject_3) => {
      const id_6 = "book-index-" + Date.now() + "-" + ++count_21;
      bookWorkerRequests.set(id_6, {
        resolve: resolve_10,
        reject: reject_3
      });
      worker_2.postMessage({
        id: id_6,
        type: "index-content",
        text: String(text_12 || "")
      });
    });
  }
  function buildReaderContentIndex(value_365) {
    const source_4 = String(value_365 || ""),
      chapters_3 = [{
        title: "开始阅读",
        start: 0
      }];
    let start_2 = 0;
    source_4.split("\n").forEach(line_2 => {
      start_2 > 0 && isChapterHeading(line_2) && chapters_3.push({
        title: line_2.trim().replace(/^#{1,3}\s*/, ""),
        start: start_2
      });
      start_2 += line_2.length + 1;
    });
    const chapterIndex_2 = chapters_3.map((chapter, index) => ({
        ...chapter,
        end: index + 1 < chapters_3.length ? chapters_3[index + 1].start : source_4.length
      })),
      chunks_2 = [];
    let start_3 = 0;
    while (start_3 < source_4.length) {
      const target_2 = Math.min(source_4.length, start_3 + READER_CHUNK_TARGET_CHARS);
      let end_2 = target_2;
      if (target_2 < source_4.length) {
        const nextChapter = chapterIndex_2.find(chapter_4 => chapter_4.start > start_3 + 4000 && chapter_4.start <= target_2 + 4000);
        if (nextChapter) end_2 = nextChapter.start;else {
          const paragraphBreak = source_4.lastIndexOf("\n\n", target_2),
            lineBreak = source_4.lastIndexOf("\n", target_2),
            candidate = paragraphBreak > start_3 + 8000 ? paragraphBreak + 2 : lineBreak + 1;
          if (candidate > start_3 + 4000) end_2 = candidate;
        }
      }
      if (end_2 <= start_3) end_2 = Math.min(source_4.length, start_3 + READER_CHUNK_TARGET_CHARS);
      chunks_2.push({
        start: start_3,
        end: end_2
      });
      start_3 = end_2;
    }
    return {
      chapterIndex: chapterIndex_2,
      chunks: chunks_2.length ? chunks_2 : [{
        start: 0,
        end: 0
      }]
    };
  }
  async function handleAction_54(file_5) {
    try {
      return await parseBookInWorker(file_5);
    } catch (workerError) {
      console.warn("[Library] Worker parsing unavailable, using main-thread fallback.", workerError);
      const parsed = await handleAction_49(file_5),
        text_13 = String(parsed?.text || "");
      return {
        ...parsed,
        ...buildReaderContentIndex(text_13)
      };
    }
  }
  async function importBook(file_6) {
    if (!file_6) return;
    const lower_2 = String(file_6.name || "").toLowerCase();
    if (!lower_2.endsWith(".txt") && !lower_2.endsWith(".text") && !lower_2.endsWith(".docx") && !lower_2.endsWith(".epub")) {
      toast("仅支持 TXT、DOCX 和 EPUB 文件");
      return;
    }
    toast("正在整理书籍…");
    try {
      const parsedBook = await handleAction_54(file_6),
        text_14 = String(parsedBook?.text || "");
      if (!text_14.trim()) throw new Error("文件内容为空");
      const now_388 = Date.now(),
        book_3 = {
          id: uid("book"),
          title: String(parsedBook.title || fileBaseName(file_6.name)).slice(0, 100),
          sourceType: parsedBook.sourceType || (lower_2.endsWith(".docx") ? "DOCX" : lower_2.endsWith(".epub") ? "EPUB" : "TXT"),
          author: String(parsedBook.author || "未知作者").slice(0, 80),
          synopsis: String(parsedBook.synopsis || "暂无简介").slice(0, 2000),
          coverUrl: "",
          progress: 0,
          createdAt: now_388,
          updatedAt: now_388,
          lastOpenedAt: 0,
          text: text_14,
          chapterIndex: parsedBook.chapterIndex || [],
          chunks: parsedBook.chunks || []
        },
        savedBook = await storage().saveLibraryBook(book_3);
      rememberReaderContent(savedBook.id, {
        id: savedBook.id,
        text: text_14,
        chapterIndex: book_3.chapterIndex,
        chunks: book_3.chunks,
        updatedAt: savedBook.updatedAt
      });
      state.books.push(savedBook);
      renderBooks();
      toast("书籍已放入书架");
    } catch (error_4) {
      console.error("[Library] Book import failed:", error_4);
      toast(error_4?.message || "书籍导入失败");
    } finally {
      dom.book_file_input.value = "";
    }
  }
  function handleAction_55(book_4) {
    if (!book_4) return;
    if (window.showCustomModal) {
      window.showCustomModal({
        type: "prompt",
        title: "重命名书籍",
        message: "输入新的书名",
        placeholder: "书名",
        defaultValue: book_4.title || "",
        confirmText: "保存",
        onConfirm: async value_7 => {
          const title_4 = String(value_7 || "").trim();
          if (!title_4) return toast("书名不能为空");
          book_4.title = title_4.slice(0, 100);
          book_4.updatedAt = Date.now();
          await storage().saveLibraryBook(book_4);
          renderBooks();
        }
      });
      return;
    }
    const title_5 = window.prompt("输入新的书名", book_4.title || "");
    title_5?.trim() && (book_4.title = title_5.trim().slice(0, 100), book_4.updatedAt = Date.now(), storage().saveLibraryBook(book_4).then(renderBooks));
  }
  function requestDeleteBook(book_5) {
    if (!book_5) return;
    const onConfirm_2 = async () => {
      if (state.currentBook?.id === book_5.id) closeReader();
      await storage().deleteLibraryBook(book_5.id);
      state.books = state.books.filter(item_4 => item_4.id !== book_5.id);
      if (state.detailBook?.id === book_5.id) {
        state.detailBook = null;
        if (dom.book_detail_modal) dom.book_detail_modal.hidden = true;
      }
      renderBooks();
      toast("书籍已删除");
    };
    if (window.showCustomModal) window.showCustomModal({
      title: "删除书籍",
      message: "确定删除《" + book_5.title + "》吗？",
      confirmText: "删除",
      isDestructive: true,
      onConfirm: onConfirm_2
    });else {
      if (window.confirm("确定删除《" + book_5.title + "》吗？")) onConfirm_2();
    }
  }
  function setBookDetailEditing(editing) {
    if (!dom.book_edit_form) return;
    dom.book_edit_form.hidden = !editing;
    dom.book_detail_actions?.toggleAttribute("hidden", editing);
    if (editing) requestAnimationFrame(() => dom.book_edit_title?.focus());
  }
  function renderBookDetail() {
    const book_6 = state.detailBook;
    if (!book_6) return;
    const palette = BOOK_PALETTES[hashString(book_6.id) % BOOK_PALETTES.length],
      progress_2 = Math.round(Math.max(0, Math.min(1, Number(book_6.progress) || 0)) * 100);
    dom.book_detail_cover.style.background = palette[0];
    dom.book_detail_cover.style.color = palette[1];
    dom.book_detail_cover.innerHTML = handleAction_29(book_6);
    dom.book_detail_name.textContent = book_6.title || "未命名";
    dom.book_detail_author.textContent = book_6.author || "未知作者";
    dom.book_detail_progress.textContent = progress_2 + "%";
    dom.book_detail_progress_bar.style.width = progress_2 + "%";
    dom.book_detail_synopsis.textContent = book_6.synopsis || "暂无简介";
    dom.book_detail_start.textContent = progress_2 > 0 ? "继续阅读" : "开始阅读";
    dom.book_edit_title.value = book_6.title || "";
    dom.book_edit_author.value = book_6.author === "未知作者" ? "" : book_6.author || "";
    dom.book_edit_cover_url.value = safeHttpUrl(book_6.coverUrl);
    dom.book_edit_synopsis.value = book_6.synopsis === "暂无简介" ? "" : book_6.synopsis || "";
  }
  function openBookDetail(detailBook_2) {
    if (!detailBook_2) return;
    state.detailBook = detailBook_2;
    renderBookDetail();
    setBookDetailEditing(false);
    openModal(dom.book_detail_modal, {
      focus: false
    });
  }
  async function handleBook_edit_formSubmit(event_403) {
    event_403.preventDefault();
    const book_7 = state.detailBook;
    if (!book_7) return;
    const title_6 = dom.book_edit_title.value.trim();
    if (!title_6) return toast("书名不能为空");
    const trim_406 = dom.book_edit_cover_url.value.trim(),
      coverUrl_4 = trim_406 ? safeHttpUrl(trim_406) : "";
    if (trim_406 && !coverUrl_4) return toast("封面 URL 无效");
    book_7.title = title_6.slice(0, 100);
    book_7.author = dom.book_edit_author.value.trim().slice(0, 80) || "未知作者";
    book_7.coverUrl = coverUrl_4;
    book_7.synopsis = dom.book_edit_synopsis.value.trim().slice(0, 2000) || "暂无简介";
    book_7.updatedAt = Date.now();
    try {
      await storage().saveLibraryBook(book_7);
      renderBooks();
      renderBookDetail();
      setBookDetailEditing(false);
      toast("书籍资料已保存");
    } catch (error_5) {
      console.error("[Library] Book detail save failed:", error_5);
      toast("书籍资料保存失败");
    }
  }
  function handleAction_58() {
    const readerFontSize_2 = Math.max(14, Math.min(28, Number(state.preferences.readerFontSize) || 18)),
      readerLineHeight_2 = Math.max(1.4, Math.min(2.4, Number(state.preferences.readerLineHeight) || 1.85)),
      theme = ["light", "paper", "dark"].includes(state.preferences.readerTheme) ? state.preferences.readerTheme : "light";
    state.preferences.readerFontSize = readerFontSize_2;
    state.preferences.readerLineHeight = readerLineHeight_2;
    state.preferences.readerTheme = theme;
    dom.reader_view.style.setProperty("--reader-font", readerFontSize_2 + "px");
    dom.reader_view.style.setProperty("--reader-line", String(readerLineHeight_2));
    dom.reader_view.classList.toggle("theme-paper", theme === "paper");
    dom.reader_view.classList.toggle("theme-dark", theme === "dark");
    dom.reader_panel.querySelectorAll("[data-reader-theme]").forEach(button_3 => {
      button_3.classList.toggle("active", button_3.dataset.readerTheme === theme);
    });
    invalidateReaderMetrics();
  }
  function clampReaderValue(value_8, min_2, max_2) {
    return Math.max(min_2, Math.min(max_2, value_8));
  }
  function clampReaderProgress(value_9) {
    return clampReaderValue(Number(value_9) || 0, 0, 1);
  }
  function invalidateReaderMetrics() {
    state.readerMetrics = null;
  }
  function readReaderPixelValue(value_10) {
    const number = parseFloat(value_10);
    return Number.isFinite(number) ? number : 0;
  }
  function handleAction_59() {
    if (!dom.reader_scroll || typeof getComputedStyle !== "function") return {
      left: 0,
      right: 0,
      horizontal: 0
    };
    const style_2 = getComputedStyle(dom.reader_scroll),
      left_2 = readReaderPixelValue(style_2.paddingLeft),
      right_2 = readReaderPixelValue(style_2.paddingRight);
    return {
      left: left_2,
      right: right_2,
      horizontal: left_2 + right_2
    };
  }
  function handleAction_60() {
    if (!dom.reader_scroll) return {
      pageWidth: 1,
      columnWidth: 1,
      pageGap: 0,
      pageStep: 1,
      paddingLeft: 0
    };
    const pageWidth_2 = Math.max(1, Math.round(dom.reader_scroll.clientWidth || 1)),
      padding = handleAction_59(),
      pageGap_2 = Math.max(0, Math.round(padding.horizontal)),
      columnWidth_2 = Math.max(1, pageWidth_2 - pageGap_2),
      pageStep_2 = columnWidth_2 + pageGap_2;
    return dom.reader_view.style.setProperty("--reader-page-width", pageWidth_2 + "px"), dom.reader_view.style.setProperty("--reader-column-width", columnWidth_2 + "px"), dom.reader_view.style.setProperty("--reader-page-gap", pageGap_2 + "px"), dom.reader_view.style.setProperty("--reader-page-step", pageStep_2 + "px"), {
      pageWidth: pageWidth_2,
      columnWidth: columnWidth_2,
      pageGap: pageGap_2,
      pageStep: pageStep_2,
      paddingLeft: padding.left
    };
  }
  function updateReaderPageWidth() {
    return invalidateReaderMetrics(), handleAction_60().pageStep;
  }
  function getReaderPageMetrics(options_2 = {}) {
    if (!options_2.force && state.readerMetrics) return state.readerMetrics;
    const geometry = handleAction_60();
    dom.reader_view.style.setProperty("--reader-content-width", geometry.columnWidth + "px");
    const articleWidth = Math.max(geometry.columnWidth, Math.ceil(dom.reader_content?.scrollWidth || 0), Math.ceil(dom.reader_content?.getBoundingClientRect?.().width || 0)),
      pageCount_2 = Math.max(1, Math.ceil((articleWidth + geometry.pageGap) / geometry.pageStep - 0.01)),
      contentWidth_2 = Math.max(geometry.columnWidth, (pageCount_2 - 1) * geometry.pageStep + geometry.columnWidth);
    dom.reader_view.style.setProperty("--reader-content-width", contentWidth_2 + "px");
    const maxOffset_2 = Math.max(0, (pageCount_2 - 1) * geometry.pageStep);
    return state.readerMetrics = {
      ...geometry,
      contentWidth: contentWidth_2,
      maxOffset: maxOffset_2,
      pageCount: pageCount_2
    }, state.readerMetrics;
  }
  function getReaderPageFromOffset(metrics = getReaderPageMetrics(), offset = state.readerPage * metrics.pageStep) {
    return clampReaderValue(Math.round(offset / metrics.pageStep), 0, metrics.pageCount - 1);
  }
  function formatReaderProgressLabel(progress_3, page_3, pageCount_3) {
    const safePageCount = Math.max(1, pageCount_3),
      safePage = clampReaderValue(page_3, 0, safePageCount - 1) + 1;
    return safePage + "/" + safePageCount + " " + String.fromCharCode(183) + " " + Math.round(clampReaderProgress(progress_3) * 100) + "%";
  }
  function saveReaderProgress(readerProgressSaveBook_2, value_436 = false) {
    if (!readerProgressSaveBook_2) return Promise.resolve();
    state.readerProgressSaveTimer && (clearTimeout(state.readerProgressSaveTimer), state.readerProgressSaveTimer = null);
    if (value_436) return state.readerProgressSaveBook = null, storage().saveLibraryBook(readerProgressSaveBook_2)["catch"](console.error);
    return state.readerProgressSaveBook = readerProgressSaveBook_2, state.readerProgressSaveTimer = setTimeout(() => {
      state.readerProgressSaveTimer = null;
      const pendingBook_2 = state.readerProgressSaveBook;
      state.readerProgressSaveBook = null;
      if (pendingBook_2) storage().saveLibraryBook(pendingBook_2)["catch"](console.error);
    }, 600), Promise.resolve();
  }
  function flushReaderProgressSave() {
    const pendingBook = state.readerProgressSaveBook || state.currentBook;
    return saveReaderProgress(pendingBook, true);
  }
  function rememberReaderContent(value_438, content_2) {
    const key_2 = String(value_438 || "");
    if (!key_2 || !content_2) return content_2;
    readerChunkHtmlCache["delete"](key_2);
    readerChunkHtmlCache.set(key_2, content_2);
    while (readerChunkHtmlCache.size > count_13) {
      readerChunkHtmlCache["delete"](readerChunkHtmlCache.keys().next().value);
    }
    return content_2;
  }
  async function handleAction_63(book_8) {
    const key_3 = String(book_8?.id || "");
    if (!key_3) throw new Error("书籍不存在");
    if (readerChunkHtmlCache.has(key_3)) {
      const html_2 = readerChunkHtmlCache.get(key_3);
      return html_2.annotations = Array.isArray(html_2.annotations) ? html_2.annotations : [], rememberReaderContent(key_3, html_2);
    }
    let content_3 = await storage().loadLibraryBookContent(key_3);
    !content_3 && typeof book_8.text === "string" && (content_3 = {
      id: key_3,
      text: book_8.text,
      chapterIndex: book_8.chapterIndex || [],
      chunks: book_8.chunks || []
    });
    if (!content_3 || typeof content_3.text !== "string") throw new Error("书籍正文不存在");
    if (!Array.isArray(content_3.chapterIndex) || !content_3.chapterIndex.length || !Array.isArray(content_3.chunks) || !content_3.chunks.length) {
      let index_4;
      try {
        index_4 = await indexReaderContentInWorker(content_3.text);
      } catch (workerError_2) {
        console.warn("[Library] Worker indexing unavailable, using main-thread fallback.", workerError_2);
        index_4 = buildReaderContentIndex(content_3.text);
      }
      content_3 = {
        ...content_3,
        ...index_4,
        updatedAt: Number(book_8.updatedAt) || Date.now()
      };
      await storage().saveLibraryBook({
        ...book_8,
        text: content_3.text,
        chapterIndex: content_3.chapterIndex,
        chunks: content_3.chunks
      });
    }
    return content_3.annotations = Array.isArray(content_3.annotations) ? content_3.annotations : [], rememberReaderContent(key_3, content_3);
  }
  function getCurrentReaderChunk() {
    return state.readerContent?.chunks?.[state.readerChunkIndex] || {
      start: 0,
      end: state.readerContent?.text?.length || 0
    };
  }
  function estimateReaderPagePosition(progress_4, value_448, pageCount_4) {
    const chunkCount = Math.max(1, state.readerContent?.chunks?.length || 1),
      estimatedTotal = Math.max(1, pageCount_4 * chunkCount),
      page_4 = clampReaderValue(Math.round(progress_4 * (estimatedTotal - 1)), 0, estimatedTotal - 1);
    return {
      page: page_4,
      pageCount: estimatedTotal
    };
  }
  function updateReaderProgress(save_2 = false, forcedPage = null, options_3 = {}) {
    const book_9 = state.currentBook;
    if (!book_9 || !dom.reader_scroll) return;
    const metrics_2 = getReaderPageMetrics(),
      page_5 = clampReaderValue(forcedPage == null ? state.readerPage : forcedPage, 0, metrics_2.pageCount - 1),
      chunk_2 = getCurrentReaderChunk(),
      localProgress = metrics_2.pageCount > 1 ? clampReaderProgress(page_5 / (metrics_2.pageCount - 1)) : 0,
      textLength = Math.max(1, state.readerContent?.text?.length || chunk_2.end || 1),
      progress_5 = clampReaderProgress((chunk_2.start + (chunk_2.end - chunk_2.start) * localProgress) / textLength);
    state.readerPage = page_5;
    state.readerPageCount = metrics_2.pageCount;
    book_9.progress = progress_5;
    book_9.updatedAt = Date.now();
    const display = estimateReaderPagePosition(progress_5, page_5, metrics_2.pageCount);
    dom.reader_progress_label.textContent = formatReaderProgressLabel(progress_5, display.page, display.pageCount);
    if (save_2) saveReaderProgress(book_9, !!options_3.immediate);
  }
  function setReaderPage(page_6, options_4 = {}) {
    if (!dom.reader_scroll || !dom.reader_content) return;
    const metrics_3 = getReaderPageMetrics(),
      nextPage = clampReaderValue(Math.round(Number(page_6) || 0), 0, metrics_3.pageCount - 1),
      scrollLeft_2 = Math.min(metrics_3.maxOffset, nextPage * metrics_3.pageStep);
    state.readerPage = nextPage;
    state.readerPageCount = metrics_3.pageCount;
    dom.reader_scroll.scrollLeft = scrollLeft_2;
    dom.reader_scroll.scrollTop = 0;
    if (options_4.updateProgress !== false) updateReaderProgress(!!options_4.save, nextPage);
  }
  function restoreReaderProgress(value_467 = state.currentBook?.progress || 0) {
    if (!state.readerContent) return;
    const safeProgress = clampReaderProgress(value_467),
      targetOffset = Math.round(safeProgress * state.readerContent.text.length),
      chunkIndex = Math.max(0, state.readerContent.chunks.findIndex((chunk, index_5) => targetOffset < chunk.end || index_5 === state.readerContent.chunks.length - 1)),
      chunk_3 = state.readerContent.chunks[chunkIndex],
      localProgress_2 = chunk_3.end > chunk_3.start ? clampReaderProgress((targetOffset - chunk_3.start) / (chunk_3.end - chunk_3.start)) : 0;
    renderReaderChunk(chunkIndex, localProgress_2);
  }
  function handleAction_67(element_2) {
    if (!element_2 || !dom.reader_scroll) return state.readerPage;
    const rect_2 = element_2.getClientRects()[0] || element_2.getBoundingClientRect(),
      viewport_2 = dom.reader_scroll.getBoundingClientRect(),
      metrics_4 = getReaderPageMetrics(),
      currentOffset = Math.max(0, Math.round(Number(dom.reader_scroll.scrollLeft) || state.readerPage * metrics_4.pageStep)),
      left_3 = rect_2.left - viewport_2.left - metrics_4.paddingLeft + currentOffset;
    return getReaderPageFromOffset(metrics_4, left_3);
  }
  function turnReaderPage(delta, options_5 = {}) {
    const metrics_5 = getReaderPageMetrics(),
      nextPage_2 = state.readerPage + delta;
    if (nextPage_2 >= metrics_5.pageCount && state.readerChunkIndex < (state.readerContent?.chunks?.length || 1) - 1) {
      renderReaderChunk(state.readerChunkIndex + 1, 0);
      if (options_5.save !== false) updateReaderProgress(true, 0);
      return;
    }
    if (nextPage_2 < 0 && state.readerChunkIndex > 0) {
      renderReaderChunk(state.readerChunkIndex - 1, 1);
      if (options_5.save !== false) updateReaderProgress(true, state.readerPage);
      return;
    }
    setReaderPage(nextPage_2, {
      animate: true,
      save: options_5.save !== false
    });
  }
  function markReaderActivity() {
    state.readerLastActivityAt = Date.now();
  }
  function isChapterHeading(line) {
    const value_11 = String(line || "").trim();
    if (!value_11 || value_11.length > 80) return false;
    return /^(?:第[0-9零一二三四五六七八九十百千万两〇○]+[章节卷部篇回]|chapter\s+[0-9ivxlcdm]+\b|#{1,3}\s+|\d{1,3}[、.．]\s*\S+)/i.test(value_11);
  }
  function isReaderChapterHeading(line_3) {
    const value_12 = String(line_3 || "").trim();
    if (!value_12 || value_12.length > 80) return false;
    return /^(?:第[0-9零一二三四五六七八九十百千万两〇]+[章节卷部篇回]|chapter\s+[0-9ivxlcdm]+\b|#{1,3}\s+|\d{1,3}[、.．]\s*\S+)/i.test(value_12);
  }
  function handleAction_69() {
    if (!state.readerContent) return [];
    if (!Array.isArray(state.readerContent.annotations)) state.readerContent.annotations = [];
    return state.readerContent.annotations;
  }
  function buildNetEaseMetingEndpoint(items_485, value_486, value_487) {
    const sort_488 = handleAction_69().filter(value_491 => Number(value_491?.end) > value_486 && Number(value_491?.start) < value_487).sort((value_492, value_493) => Number(value_492.start) - Number(value_493.start));
    if (!sort_488.length) return escapeHtml(items_485) || "&#8203;";
    let value_489 = value_486,
      text_490 = "";
    return sort_488.forEach(value_494 => {
      const clampReaderValue_495 = clampReaderValue(Number(value_494.start) || 0, value_486, value_487),
        clampReaderValue_496 = clampReaderValue(Number(value_494.end) || 0, value_486, value_487);
      if (clampReaderValue_496 <= clampReaderValue_495 || clampReaderValue_495 < value_489) return;
      text_490 += escapeHtml(items_485.slice(value_489 - value_486, clampReaderValue_495 - value_486));
      text_490 += "<span class=\"library-reader-annotation\" role=\"button\" tabindex=\"0\" data-library-annotation-id=\"" + escapeHtml(value_494.id) + "\">" + escapeHtml(items_485.slice(clampReaderValue_495 - value_486, clampReaderValue_496 - value_486)) + "</span>";
      value_489 = clampReaderValue_496;
    }), text_490 += escapeHtml(items_485.slice(value_489 - value_486)), text_490 || "&#8203;";
  }
  function buildReaderChunkHtml(text_15, offset_3 = 0) {
    let textOffset = Number(offset_3) || 0;
    return String(text_15 || "").split("\n").map((NETEASE_METING_API_2, value_501) => {
      const playlistId_3 = textOffset,
        cacheBust = playlistId_3 + NETEASE_METING_API_2.length;
      textOffset = cacheBust + 1;
      let endpoint_2 = buildNetEaseMetingEndpoint(NETEASE_METING_API_2, playlistId_3, cacheBust);
      return isReaderChapterHeading(NETEASE_METING_API_2) && (endpoint_2 = "<span class=\"library-reader-chapter\" id=\"library-reader-offset-" + playlistId_3 + "\">" + endpoint_2 + "</span>"), "<span class=\"library-reader-line\" data-reader-line=\"" + value_501 + "\" data-text-start=\"" + playlistId_3 + "\" data-text-end=\"" + cacheBust + "\">" + endpoint_2 + "</span>";
    }).join("");
  }
  function handleAction_72(value_505 = false) {
    if (dom.reader_comment_action) dom.reader_comment_action.hidden = true;
    value_505 && (state.readerSelection = null, window.getSelection?.()?.removeAllRanges?.());
  }
  function handleAction_73(value_506, value_507) {
    const value_508 = value_506?.nodeType === Node.ELEMENT_NODE ? value_506 : value_506?.parentElement,
      closest_509 = value_508?.closest?.("[data-reader-line]");
    if (!closest_509 || !dom.reader_content.contains(closest_509)) return null;
    const range_510 = document.createRange();
    range_510.selectNodeContents(closest_509);
    try {
      range_510.setEnd(value_506, value_507);
    } catch (value_511) {
      return null;
    }
    return (Number(closest_509.dataset.textStart) || 0) + range_510.toString().length;
  }
  function handleAction_74() {
    if (!isReaderActive() || state.readerCommentLoading) return null;
    const selection = window.getSelection?.();
    if (!selection || selection.rangeCount < 1 || selection.isCollapsed) return null;
    const rangeAt = selection.getRangeAt(0),
      value_512 = rangeAt.commonAncestorContainer?.nodeType === Node.ELEMENT_NODE ? rangeAt.commonAncestorContainer : rangeAt.commonAncestorContainer?.parentElement;
    if (!value_512 || !dom.reader_content.contains(value_512)) return null;
    const handleAction_73_513 = handleAction_73(rangeAt.startContainer, rangeAt.startOffset),
      handleAction_73_514 = handleAction_73(rangeAt.endContainer, rangeAt.endOffset);
    if (!Number.isFinite(handleAction_73_513) || !Number.isFinite(handleAction_73_514)) return null;
    const start_6 = Math.min(handleAction_73_513, handleAction_73_514),
      end_3 = Math.max(handleAction_73_513, handleAction_73_514),
      quote_2 = String(state.readerContent?.text || "").slice(start_6, end_3);
    if (!quote_2.trim() || quote_2.length > 2000) return null;
    return {
      start: start_6,
      end: end_3,
      quote: quote_2,
      range: rangeAt.cloneRange()
    };
  }
  function handleAction_75(value_518) {
    if (!value_518 || !dom.reader_comment_action) return;
    const filter_519 = [...value_518.range.getClientRects()].filter(value_525 => value_525.width || value_525.height),
      value_520 = filter_519[0] || value_518.range.getBoundingClientRect(),
      boundingClientRect_521 = dom.reader_view.getBoundingClientRect(),
      value_522 = clampReaderValue(value_520.left + value_520.width / 2, boundingClientRect_521.left + 42, boundingClientRect_521.right - 42) - boundingClientRect_521.left,
      value_523 = value_520.top - 8,
      value_524 = (value_523 > boundingClientRect_521.top + 46 ? value_523 : value_520.bottom + 42) - boundingClientRect_521.top;
    if (!state.readerCommentLoading) dom.reader_comment_action.textContent = "点评";
    dom.reader_comment_action.style.left = value_522 + "px";
    dom.reader_comment_action.style.top = value_524 + "px";
    dom.reader_comment_action.hidden = false;
  }
  function handleAction_76() {
    if (!isReaderActive() || !dom.reader_comments_backdrop.hidden) return handleAction_72(false);
    const readerSelection_2 = handleAction_74();
    if (!readerSelection_2) return handleAction_72(false);
    state.readerSelection = readerSelection_2;
    handleAction_75(readerSelection_2);
  }
  function handleAction_77(value_527) {
    if (!value_527 || !dom.reader_comments_backdrop) return;
    handleAction_72(true);
    dom.reader_comments_quote.textContent = value_527.quote || "";
    dom.reader_comments_list.innerHTML = (value_527.comments || []).map(value_528 => "\n            <article class=\"library-reader-comment-row\">\n                <strong>" + escapeHtml(value_528.nickname || "读者") + "</strong>\n                <p>" + escapeHtml(value_528.text || "") + "</p>\n            </article>").join("");
    dom.reader_comments_backdrop.hidden = false;
  }
  function handleReader_comments_closeClick() {
    if (dom.reader_comments_backdrop) dom.reader_comments_backdrop.hidden = true;
  }
  function handleAction_79(value_529) {
    let trim_530 = String(value_529 || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    const indexOf_531 = trim_530.indexOf("{"),
      lastIndexOf_532 = trim_530.lastIndexOf("}");
    if (indexOf_531 >= 0 && lastIndexOf_532 > indexOf_531) trim_530 = trim_530.slice(indexOf_531, lastIndexOf_532 + 1);
    const result_533 = JSON.parse(trim_530),
      comments_2 = (Array.isArray(result_533?.comments) ? result_533.comments : []).map(value_535 => ({
        nickname: String(value_535?.nickname || "").trim().slice(0, 30),
        text: String(value_535?.text || "").trim().slice(0, 1000)
      })).filter(value_536 => value_536.nickname && value_536.text).slice(0, 12);
    if (comments_2.length < 10) throw new Error("点评数量不足 10 条");
    return {
      comments: comments_2
    };
  }
  function buildNetEaseMetingEndpoint_2(value_537, value_538, value_539) {
    if (typeof window.getGlobalWorldBookContext !== "function") return "";
    const join_540 = ["书名：" + (value_537?.title || "未命名"), "作者：" + (value_537?.author || "未知作者"), "简介：" + (value_537?.synopsis || "暂无简介"), "选中原文：" + (value_538?.quote || ""), "相邻正文：" + (value_539 || "")].join("\n");
    return String(window.getGlobalWorldBookContext(join_540) || "").trim();
  }
  function handleAction_81(value_541) {
    const currentBook_542 = state.currentBook,
      fullText = String(state.readerContent?.text || ""),
      max_544 = Math.max(0, Number(value_541?.start) - 800),
      min_545 = Math.min(fullText.length, Number(value_541?.end) + 800);
    return ["书名：" + (currentBook_542?.title || "未命名"), "作者：" + (currentBook_542?.author || "未知作者"), "简介：" + (currentBook_542?.synopsis || "暂无简介"), "选中原文：" + (value_541?.quote || ""), "相邻正文：" + fullText.slice(max_544, min_545)].join("\n");
  }
  function handleAction_82(value_546) {
    const currentBook_547 = state.currentBook,
      fullText_2 = String(state.readerContent?.text || ""),
      max_549 = Math.max(0, Number(value_546?.start) - 800),
      min_550 = Math.min(fullText_2.length, Number(value_546?.end) + 800),
      promptXml = value_13 => String(value_13 || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return "【一起看书点评触发｜仅影响本轮单聊】\nUser 刚刚在你们正在共读的小说中选中了下面一段，并查看了读者点评。请以你自己的身份主动自然地发起这一轮单聊回应，直接聊这段文字带来的即时感受。\n- 这是一次共同阅读中的主动反应，不是 User 新发的一条聊天消息；不要说 User \"刚刚发来\"、不要复述本提示，也不要把它当成客服或文学鉴赏任务。\n- 优先结合选中原文与邻近正文中的具体人物、台词、动作或情绪；像坐在 User 身边边看边聊一样自然承接。\n- 只能根据给出的书籍资料、当前阅读内容与已注入的聊天上下文/世界书推断，不得假装看过后文或剧透。\n- 保持本轮原生单聊的全部角色、关系、记忆、世界书、COT、消息数量和输出格式要求。\n<reader_comment_context>\n<book_title>" + promptXml(currentBook_547?.title || "未命名") + "</book_title>\n<book_author>" + promptXml(currentBook_547?.author || "未知作者") + "</book_author>\n<book_synopsis>" + promptXml(currentBook_547?.synopsis || "暂无简介") + "</book_synopsis>\n<selected_quote>" + promptXml(value_546?.quote || "") + "</selected_quote>\n<nearby_text>" + promptXml(fullText_2.slice(max_549, min_550)) + "</nearby_text>\n</reader_comment_context>";
  }
  async function handleAction_83(value_553, value_554) {
    if (!value_553 || typeof window.imChat?.handleAiReply !== "function") throw new Error("iMessage 单聊组件未就绪");
    const elementById = document.getElementById("chat-interface-" + value_553.id),
      value_555 = elementById?.querySelector(".ins-chat-messages") || null;
    await window.imChat.handleAiReply(value_553, value_555, null, {
      source: "library_reader_comment",
      continueWithoutUser: true,
      worldBookTriggerText: handleAction_81(value_554),
      extraSystemPrompt: handleAction_82(value_554)
    });
  }
  function handleAction_84(value_556, value_557) {
    const value_558 = () => {
      if (!state.currentBook || String(state.currentBook.id) !== String(value_556) || !state.readerContent) return;
      readerChunkHtmlCache_2.clear();
      renderReaderChunk(state.readerChunkIndex, value_557);
    };
    typeof requestIdleCallback === "function" ? requestIdleCallback(value_558, {
      timeout: 700
    }) : setTimeout(value_558, 80);
  }
  async function handleAction_85(playlistId_4) {
    const value_560 = typeof window.getApiConfig === "function" ? window.getApiConfig() : window.apiConfig || {};
    if (!value_560?.endpoint || !value_560?.apiKey) throw new Error("请先在设置中配置 API");
    const value_561 = window.u2Api?.resolveChatCompletionsEndpoint ? window.u2Api.resolveChatCompletionsEndpoint(value_560.endpoint) : safeHttpUrl(value_560.endpoint);
    if (!value_561) throw new Error("API 地址无效");
    const NETEASE_METING_API_3 = state.currentBook,
      fullText_3 = String(state.readerContent?.text || ""),
      max_564 = Math.max(0, playlistId_4.start - 800),
      min_565 = Math.min(fullText_3.length, playlistId_4.end + 800),
      cacheBust_2 = fullText_3.slice(max_564, min_565),
      endpoint_3 = buildNetEaseMetingEndpoint_2(NETEASE_METING_API_3, playlistId_4, cacheBust_2),
      content_4 = "请围绕小说中选中的一段文字生成严格 JSON，不要输出 Markdown 或解释。\n\n书名：" + (NETEASE_METING_API_3?.title || "未命名") + "\n作者：" + (NETEASE_METING_API_3?.author || "未知作者") + "\n简介：" + (NETEASE_METING_API_3?.synopsis || "暂无简介") + "\n相邻正文：\n" + cacheBust_2 + "\n\n选中原文：\n" + playlistId_4.quote + "\n\n要求：\n1. comments 必须恰好 12 条，每条结构为 {\"nickname\":\"虚构读者昵称\",\"text\":\"针对该段的自然评论\"}。\n2. 12 位评论者必须是不同的非 User 虚构读者，观点、语气和切入角度有差异，不得冒充 User。\n3. 评论只能依据给出的原文、上下文和已注入世界书，不得剧透未知后文。\n\n返回结构：{\"comments\":[...]}",
      controller_569 = new AbortController(),
      setTimeout_570 = setTimeout(() => controller_569.abort(), 60000);
    try {
      const headers_3 = window.u2Api?.buildApiHeaders ? window.u2Api.buildApiHeaders(value_560, {
          "X-U2-Silent-Errors": "1"
        }) : {
          "Content-Type": "application/json",
          Authorization: "Bearer " + value_560.apiKey,
          "X-U2-Silent-Errors": "1"
        },
        value_572 = await fetch(value_561, {
          method: "POST",
          headers: headers_3,
          body: JSON.stringify({
            model: value_560.model || "",
            messages: [{
              role: "system",
              content: ["你是小说阅读社区内容生成器，只能返回符合要求的合法 JSON。", endpoint_3 ? "以下是本次生成必须遵循的全局世界书：\n" + endpoint_3 : ""].filter(Boolean).join("\n\n")
            }, {
              role: "user",
              content: content_4
            }],
            temperature: Number.isFinite(Number(value_560.temperature)) ? Number(value_560.temperature) : 0.8,
            stream: false
          }),
          signal: controller_569.signal
        });
      if (!value_572.ok) {
        const value_575 = window.u2Api?.readApiError ? await window.u2Api.readApiError(value_572) : null;
        throw window.u2Api?.createHttpError?.(value_572, value_575) || Object.assign(new Error("API 请求失败（HTTP " + value_572.status + "）"), {
          status: value_572.status
        });
      }
      const value_573 = await value_572.json(),
        value_574 = value_573?.choices?.[0]?.message?.content || value_573?.choices?.[0]?.text || "";
      return handleAction_79(value_574);
    } catch (value_576) {
      if (value_576?.name === "AbortError") throw Object.assign(new Error("点评生成超时，请稍后重试"), {
        name: "TimeoutError"
      });
      throw value_576;
    } finally {
      clearTimeout(setTimeout_570);
    }
  }
  async function handleReader_comment_actionClick() {
    if (state.readerCommentLoading || !state.readerSelection || !state.readerContent || !state.currentBook) return;
    const readerSelection_577 = state.readerSelection,
      string_578 = String(state.currentBook.id),
      annotations_2 = handleAction_69(),
      result_580 = annotations_2.find(value_583 => Number(value_583.start) === readerSelection_577.start && Number(value_583.end) === readerSelection_577.end);
    if (result_580) return handleAction_77(result_580);
    const some_581 = annotations_2.some(value_584 => readerSelection_577.start < Number(value_584.end) && readerSelection_577.end > Number(value_584.start));
    if (some_581) return handleAction_72(true), toast("所选文字与已有点评重叠，请重新选择");
    const value_582 = state.together?.bookId === state.currentBook.id ? getTogetherFriend() : null;
    state.readerCommentLoading = true;
    dom.reader_comment_action.classList.add("is-loading");
    dom.reader_comment_action.textContent = "生成中…";
    try {
      const value_585 = await handleAction_85(readerSelection_577);
      if (!state.currentBook || String(state.currentBook.id) !== string_578 || !state.readerContent) throw new Error("书籍已关闭，点评未保存");
      const value_586 = value_582 && state.together?.bookId === state.currentBook.id && String(state.together.friendId) === String(value_582.id) ? getTogetherFriend() : null,
        options_587 = {
          id: uid("annotation"),
          start: readerSelection_577.start,
          end: readerSelection_577.end,
          quote: readerSelection_577.quote,
          comments: value_585.comments,
          createdAt: Date.now()
        };
      annotations_2.push(options_587);
      annotations_2.sort((value_590, value_591) => Number(value_590.start) - Number(value_591.start));
      await storage().saveLibraryBook({
        ...state.currentBook,
        text: state.readerContent.text,
        chapterIndex: state.readerContent.chapterIndex,
        chunks: state.readerContent.chunks,
        annotations: annotations_2
      });
      const readerPageMetrics_588 = getReaderPageMetrics(),
        value_589 = readerPageMetrics_588.pageCount > 1 ? state.readerPage / (readerPageMetrics_588.pageCount - 1) : 0;
      handleAction_77(options_587);
      handleAction_84(string_578, value_589);
      value_586 && void handleAction_83(value_586, readerSelection_577)["catch"](value_592 => {
        console.error("[Library] Together reader comment reply failed:", value_592);
        toast(value_592?.message || "Char 点评回复失败");
      });
      toast(value_586 ? "点评已生成，Char 正在回复" : "点评已生成");
    } catch (value_593) {
      console.error("[Library] Reader comment generation failed:", value_593);
      if (!window.u2Api?.isRequestError?.(value_593) || !window.u2Api.reportError(value_593, {
        operation: "点评生成"
      })) toast(value_593?.message || "点评生成失败");
    } finally {
      state.readerCommentLoading = false;
      dom.reader_comment_action.classList.remove("is-loading");
      dom.reader_comment_action.textContent = "点评";
      handleAction_72(false);
    }
  }
  function handleAction_87() {
    const chapters_4 = state.readerContent?.chapterIndex || [{
      title: "开始阅读",
      start: 0
    }];
    state.chapters = chapters_4;
    dom.reader_toc_list.innerHTML = chapters_4.map((chapter_5, value_596) => "\n            <button type=\"button\" data-chapter-offset=\"" + Math.max(0, Number(chapter_5.start) || 0) + "\">\n                <span>" + String(value_596 + 1).padStart(2, "0") + "</span>\n                <span>" + escapeHtml(chapter_5.title || "未命名章节") + "</span>\n            </button>").join("") + (chapters_4.length === 1 ? "<p class=\"library-reader-toc-empty\">未识别到明确章节标题。支持“第×章”、Chapter、Markdown 标题和数字标题。</p>" : "");
  }
  function handleAction_88(value_597) {
    const nextIndex_2 = value_597 + 1,
      next_2 = state.readerContent?.chunks?.[nextIndex_2];
    if (!next_2 || !state.currentBook) return;
    const key_4 = state.currentBook.id + ":" + (state.readerContent.updatedAt || state.currentBook.updatedAt || 0) + ":" + nextIndex_2;
    if (readerChunkHtmlCache_2.has(key_4)) return;
    const prepare = () => {
      if (!state.readerContent || readerChunkHtmlCache_2.has(key_4)) return;
      readerChunkHtmlCache_2.set(key_4, buildReaderChunkHtml(state.readerContent.text.slice(next_2.start, next_2.end), next_2.start));
      while (readerChunkHtmlCache_2.size > 12) readerChunkHtmlCache_2["delete"](readerChunkHtmlCache_2.keys().next().value);
    };
    if (typeof requestIdleCallback === "function") requestIdleCallback(prepare, {
      timeout: 500
    });else setTimeout(prepare, 40);
  }
  function renderReaderChunk(chunkIndex_2, localProgress_3 = 0) {
    if (!state.readerContent || !state.currentBook) return;
    const readerChunkIndex_2 = clampReaderValue(Math.round(Number(chunkIndex_2) || 0), 0, state.readerContent.chunks.length - 1),
      chunk_4 = state.readerContent.chunks[readerChunkIndex_2];
    state.readerChunkIndex = readerChunkIndex_2;
    state.readerChunkStart = chunk_4.start;
    state.readerChunkEnd = chunk_4.end;
    const cacheKey = state.currentBook.id + ":" + (state.readerContent.updatedAt || state.currentBook.updatedAt || 0) + ":" + readerChunkIndex_2;
    let html_3 = readerChunkHtmlCache_2.get(cacheKey);
    if (!html_3) {
      html_3 = buildReaderChunkHtml(state.readerContent.text.slice(chunk_4.start, chunk_4.end), chunk_4.start);
      readerChunkHtmlCache_2.set(cacheKey, html_3);
      while (readerChunkHtmlCache_2.size > 12) readerChunkHtmlCache_2["delete"](readerChunkHtmlCache_2.keys().next().value);
    }
    dom.reader_content.innerHTML = "<span id=\"library-reader-start\"></span>" + html_3;
    invalidateReaderMetrics();
    const metrics_6 = getReaderPageMetrics({
        force: true
      }),
      targetPage = Math.round(clampReaderProgress(localProgress_3) * (metrics_6.pageCount - 1));
    setReaderPage(targetPage, {
      animate: false,
      save: false,
      updateProgress: false
    });
    updateReaderProgress(false, targetPage);
    handleAction_88(readerChunkIndex_2);
  }
  function getVisibleReaderText() {
    const book_10 = state.currentBook;
    if (!book_10 || !dom.reader_scroll) return "";
    const viewport = dom.reader_scroll.getBoundingClientRect(),
      visibleLines = [...dom.reader_content.querySelectorAll("[data-reader-line]")].filter(line_4 => {
        return [...line_4.getClientRects()].some(rect => rect.right >= viewport.left && rect.left <= viewport.right && rect.bottom >= viewport.top && rect.top <= viewport.bottom);
      }),
      visibleText = visibleLines.map(line_5 => line_5.textContent || "").join("\n").trim();
    if (visibleText && visibleText.length <= 6000) return visibleText;
    if (visibleText && visibleLines.length > 1) return visibleText.slice(0, 6000);
    const fullText_4 = String(state.readerContent?.text || "");
    if (!fullText_4) return "";
    const metrics_7 = getReaderPageMetrics(),
      ratio = metrics_7.pageCount > 1 ? clampReaderProgress(state.readerPage / (metrics_7.pageCount - 1)) : 0,
      chunk_5 = getCurrentReaderChunk(),
      center = Math.round(chunk_5.start + (chunk_5.end - chunk_5.start) * ratio),
      start_4 = Math.max(0, Math.min(fullText_4.length - 6000, center - 3000));
    return fullText_4.slice(start_4, start_4 + 6000).trim();
  }
  function setReaderLoading(loading_2, textContent_2 = "准备正文与阅读位置…") {
    if (!dom.reader_loading) return;
    dom.reader_loading.hidden = !loading_2;
    const detail_2 = dom.reader_loading.querySelector("small");
    if (detail_2) detail_2.textContent = textContent_2;
  }
  async function openReaderAsync(book_11) {
    if (!book_11) return;
    const requestId = ++state.readerOpenRequestId,
      savedProgress = clampReaderProgress(Number(book_11.progress) || 0);
    state.currentBook = book_11;
    state.readerContent = null;
    book_11.lastOpenedAt = Date.now();
    dom.reader_title.textContent = book_11.title || "未命名";
    handleAction_58();
    dom.reader_view.classList.add("active");
    dom.reader_view.setAttribute("aria-hidden", "false");
    dom.reader_content.innerHTML = "";
    setReaderLoading(true);
    markReaderActivity();
    try {
      const readerContent_2 = await handleAction_63(book_11);
      if (requestId !== state.readerOpenRequestId || state.currentBook !== book_11) return;
      state.readerContent = readerContent_2;
      handleAction_87();
      await new Promise(resolve_2 => requestAnimationFrame(resolve_2));
      restoreReaderProgress(savedProgress);
      setReaderLoading(false);
    } catch (error_6) {
      console.error("[Library] Reader content load failed", error_6);
      if (requestId !== state.readerOpenRequestId) return;
      setReaderLoading(false);
      dom.reader_view.classList.remove("active");
      dom.reader_view.setAttribute("aria-hidden", "true");
      state.currentBook = null;
      state.readerContent = null;
      toast(error_6?.message || "书籍打开失败");
    }
  }
  async function handleAction_91() {
    const seconds_4 = state.pendingReadingSeconds,
      book_12 = state.currentBook;
    if (!book_12 || seconds_4 <= 0) return;
    state.pendingReadingSeconds = 0;
    await storage().incrementLibraryDailyStat({
      date: localDateKey(),
      kind: "reading",
      itemId: book_12.id,
      seconds: seconds_4
    });
  }
  function closeReader() {
    state.readerOpenRequestId += 1;
    setReaderLoading(false);
    if (!state.currentBook) {
      dom.reader_view.classList.remove("active");
      dom.reader_view.setAttribute("aria-hidden", "true");
      return;
    }
    stopTogether();
    handleReader_comments_closeClick();
    handleAction_72(true);
    if (state.readerContent) updateReaderProgress(true, null, {
      immediate: true
    });
    handleAction_91()["catch"](console.error);
    dom.reader_panel.hidden = true;
    dom.reader_toc.hidden = true;
    dom.reader_view.classList.remove("active");
    dom.reader_view.setAttribute("aria-hidden", "true");
    state.currentBook = null;
    state.readerContent = null;
    state.readerChunkIndex = 0;
    state.readerChunkStart = 0;
    state.readerChunkEnd = 0;
    renderBooks();
  }
  function isReaderActive() {
    return !!state.currentBook && dom.reader_view.classList.contains("active");
  }
  function repaginateReaderAtCurrentProgress() {
    if (!isReaderActive()) return;
    const progress_6 = Number(state.currentBook.progress) || 0;
    invalidateReaderMetrics();
    updateReaderPageWidth();
    requestAnimationFrame(() => restoreReaderProgress(progress_6));
  }
  function handleAction_92(event_633) {
    const event_634 = event_633.changedTouches?.[0] || event_633.touches?.[0],
      x_2 = Number.isFinite(event_633.clientX) ? event_633.clientX : event_634?.clientX,
      y_2 = Number.isFinite(event_633.clientY) ? event_633.clientY : event_634?.clientY;
    return Number.isFinite(x_2) && Number.isFinite(y_2) ? {
      x: x_2,
      y: y_2
    } : null;
  }
  function handleAction_93(event_637, source_5) {
    if (!isReaderActive()) return;
    if (event_637.target.closest?.("[data-library-annotation-id], .library-reader-comment-action")) {
      state.readerPointerStart = null;
      return;
    }
    const handleAction_92_639 = handleAction_92(event_637);
    if (!handleAction_92_639) return;
    state.readerPointerStart = {
      ...handleAction_92_639,
      page: state.readerPage,
      time: Date.now(),
      source: source_5
    };
  }
  function handleAction_94(value_640, value_641) {
    if (!isReaderActive() || !state.readerPointerStart || state.readerPointerStart.source !== value_641) return;
    const start_5 = state.readerPointerStart;
    state.readerPointerStart = null;
    const handleAction_92_643 = handleAction_92(value_640);
    if (!handleAction_92_643) return;
    const dx = handleAction_92_643.x - start_5.x,
      value_645 = handleAction_92_643.y - start_5.y,
      absX = Math.abs(dx),
      absY = Math.abs(value_645),
      elapsed = Date.now() - start_5.time;
    if (window.getSelection?.() && !window.getSelection().isCollapsed) {
      handleAction_76();
      return;
    }
    if (absX >= 45 && absX > absY * 1.2) {
      turnReaderPage(dx < 0 ? 1 : -1, {
        save: true
      });
      markReaderActivity();
      return;
    }
    if (absX <= 8 && absY <= 8 && elapsed <= 350) {
      const boundingClientRect_649 = dom.reader_scroll.getBoundingClientRect(),
        ratio_2 = (handleAction_92_643.x - boundingClientRect_649.left) / Math.max(1, boundingClientRect_649.width);
      turnReaderPage(ratio_2 < 0.5 ? -1 : 1, {
        save: true
      });
      markReaderActivity();
    }
  }
  function handleReader_scrollPointerdown(value_651) {
    state.readerLastPointerEventAt = Date.now();
    handleAction_93(value_651, "pointer");
  }
  function handleReader_scrollPointerup(value_652) {
    state.readerLastPointerEventAt = Date.now();
    handleAction_94(value_652, "pointer");
  }
  function handleReader_scrollPointercancel() {
    state.readerLastPointerEventAt = Date.now();
    if (state.readerPointerStart?.source === "pointer") state.readerPointerStart = null;
  }
  function handleAction_98() {
    return Date.now() - state.readerLastPointerEventAt < 750;
  }
  function handleReader_scrollTouchstart(value_653) {
    if (handleAction_98()) return;
    handleAction_93(value_653, "touch");
  }
  function handleReader_scrollTouchend(value_654) {
    if (handleAction_98()) return;
    handleAction_94(value_654, "touch");
  }
  function handleReader_scrollTouchcancel() {
    if (handleAction_98()) return;
    if (state.readerPointerStart?.source === "touch") state.readerPointerStart = null;
  }
  function handleKeydown(event_3) {
    if (!isReaderActive()) return;
    if (!dom.reader_comments_backdrop.hidden || window.getSelection?.() && !window.getSelection().isCollapsed) return;
    const tagName_2 = event_3.target?.tagName;
    if (tagName_2 === "INPUT" || tagName_2 === "TEXTAREA" || event_3.defaultPrevented || event_3.metaKey || event_3.ctrlKey || event_3.altKey) return;
    if (event_3.key === "ArrowRight" || event_3.key === "PageDown" || event_3.key === " ") {
      event_3.preventDefault();
      turnReaderPage(1, {
        save: true
      });
      markReaderActivity();
    } else (event_3.key === "ArrowLeft" || event_3.key === "PageUp") && (event_3.preventDefault(), turnReaderPage(-1, {
      save: true
    }), markReaderActivity());
  }
  function updateTogetherControls() {
    const active = !!state.together;
    dom.reader_together && (dom.reader_together.classList.toggle("is-active", active), dom.reader_together.innerHTML = active ? "<i class=\"fas fa-user-xmark\"></i>" : "<i class=\"fas fa-user-group\"></i>", dom.reader_together.setAttribute("aria-label", active ? "退出一起看" : "一起看小说"), dom.reader_together.setAttribute("title", active ? "退出一起看" : "一起看小说"));
  }
  function getTogetherFriend() {
    const friendId_2 = state.together?.friendId;
    if (!friendId_2) return null;
    return (window.imData?.friends || []).find(friend => String(friend.id) === String(friendId_2)) || null;
  }
  function handleAction_104(value_659) {
    const readerRect_2 = dom.reader_view.getBoundingClientRect(),
      boundingClientRect_661 = dom.reader_view.querySelector(".library-subview-header")?.getBoundingClientRect(),
      width_2 = value_659.offsetWidth || 58,
      height_2 = value_659.offsetHeight || 58,
      count_664 = 14,
      readerPixelValue_665 = readReaderPixelValue(getComputedStyle(dom.reader_view).getPropertyValue("--safe-bottom")),
      minX_2 = count_664,
      maxX_2 = Math.max(minX_2, readerRect_2.width - width_2 - count_664),
      minY_2 = Math.max(count_664, (boundingClientRect_661?.bottom || readerRect_2.top) - readerRect_2.top + 10),
      maxY_2 = Math.max(minY_2, readerRect_2.height - height_2 - Math.max(count_664, readerPixelValue_665 + 10));
    return {
      readerRect: readerRect_2,
      width: width_2,
      height: height_2,
      minX: minX_2,
      maxX: maxX_2,
      minY: minY_2,
      maxY: maxY_2
    };
  }
  function saveReaderProgress_2(element_670 = $("library-together-float"), value_671 = false) {
    if (!element_670 || element_670.hidden) return;
    const handleAction_104_672 = handleAction_104(element_670),
      value_673 = state.preferences.togetherFloatSide === "left" ? "left" : "right",
      clampReaderProgress_674 = clampReaderProgress(state.preferences.togetherFloatY == null ? 1 : state.preferences.togetherFloatY);
    element_670.classList.toggle("is-positioning", !!value_671);
    element_670.style.right = "auto";
    element_670.style.bottom = "auto";
    element_670.style.left = (value_673 === "left" ? handleAction_104_672.minX : handleAction_104_672.maxX) + "px";
    element_670.style.top = handleAction_104_672.minY + (handleAction_104_672.maxY - handleAction_104_672.minY) * clampReaderProgress_674 + "px";
    if (value_671) setTimeout(() => element_670.classList.remove("is-positioning"), 220);
  }
  function setTimeout_106(event_675, element_3) {
    if (event_675.pointerType === "mouse" && event_675.button !== 0) return;
    const bounds_2 = handleAction_104(element_3),
      boundingClientRect_678 = element_3.getBoundingClientRect();
    state.togetherFloatDrag = {
      pointerId: event_675.pointerId,
      startX: event_675.clientX,
      startY: event_675.clientY,
      offsetX: event_675.clientX - boundingClientRect_678.left,
      offsetY: event_675.clientY - boundingClientRect_678.top,
      moved: false,
      bounds: bounds_2
    };
    element_3.setPointerCapture?.(event_675.pointerId);
  }
  function setTimeout_107(event_679, element_680) {
    const togetherFloatDrag_681 = state.togetherFloatDrag;
    if (!togetherFloatDrag_681 || togetherFloatDrag_681.pointerId !== event_679.pointerId) return;
    if (!togetherFloatDrag_681.moved && Math.hypot(event_679.clientX - togetherFloatDrag_681.startX, event_679.clientY - togetherFloatDrag_681.startY) < 5) return;
    togetherFloatDrag_681.moved = true;
    event_679.preventDefault();
    element_680.classList.add("is-dragging");
    const clampReaderValue_682 = clampReaderValue(event_679.clientX - togetherFloatDrag_681.bounds.readerRect.left - togetherFloatDrag_681.offsetX, togetherFloatDrag_681.bounds.minX, togetherFloatDrag_681.bounds.maxX),
      clampReaderValue_683 = clampReaderValue(event_679.clientY - togetherFloatDrag_681.bounds.readerRect.top - togetherFloatDrag_681.offsetY, togetherFloatDrag_681.bounds.minY, togetherFloatDrag_681.bounds.maxY);
    element_680.style.right = "auto";
    element_680.style.bottom = "auto";
    element_680.style.left = clampReaderValue_682 + "px";
    element_680.style.top = clampReaderValue_683 + "px";
  }
  function setTimeout_108(value_684, pendingBook_3) {
    const togetherFloatDrag_686 = state.togetherFloatDrag;
    if (!togetherFloatDrag_686 || togetherFloatDrag_686.pointerId !== value_684.pointerId) return;
    state.togetherFloatDrag = null;
    pendingBook_3.releasePointerCapture?.(value_684.pointerId);
    pendingBook_3.classList.remove("is-dragging");
    if (!togetherFloatDrag_686.moved) return;
    pendingBook_3._librarySuppressClickUntil = Date.now() + 500;
    const value_687 = parseFloat(pendingBook_3.style.left) || togetherFloatDrag_686.bounds.minX,
      clampReaderValue_688 = clampReaderValue(parseFloat(pendingBook_3.style.top) || togetherFloatDrag_686.bounds.minY, togetherFloatDrag_686.bounds.minY, togetherFloatDrag_686.bounds.maxY);
    state.preferences.togetherFloatSide = value_687 + togetherFloatDrag_686.bounds.width / 2 < togetherFloatDrag_686.bounds.readerRect.width / 2 ? "left" : "right";
    state.preferences.togetherFloatY = togetherFloatDrag_686.bounds.maxY > togetherFloatDrag_686.bounds.minY ? clampReaderProgress((clampReaderValue_688 - togetherFloatDrag_686.bounds.minY) / (togetherFloatDrag_686.bounds.maxY - togetherFloatDrag_686.bounds.minY)) : 0;
    saveReaderProgress_2(pendingBook_3, true);
    savePreferences()["catch"](console.error);
  }
  function ensureTogetherFloat(friend_2) {
    let ms = $("library-together-float");
    !ms && (ms = document.createElement("button"), ms.id = "library-together-float", ms.className = "library-together-float", ms.type = "button", ms.hidden = true, ms.addEventListener("pointerdown", resolve_3 => setTimeout_106(resolve_3, ms)), ms.addEventListener("pointermove", resolve_4 => setTimeout_107(resolve_4, ms)), ms.addEventListener("pointerup", resolve_5 => setTimeout_108(resolve_5, ms)), ms.addEventListener("pointercancel", resolve_6 => setTimeout_108(resolve_6, ms)), ms.addEventListener("click", event_695 => {
      if (Date.now() < Number(ms._librarySuppressClickUntil || 0)) {
        event_695.preventDefault();
        return;
      }
      restoreTogetherPopup();
    }), dom.reader_view.appendChild(ms));
    const avatar = safeImageSource(friend_2?.avatarUrl);
    return ms.innerHTML = avatar ? "<img src=\"" + escapeHtml(avatar) + "\" alt=\"\">" : "<i class=\"fas fa-user\"></i>", ms.setAttribute("aria-label", "继续与 " + (friend_2?.nickname || "Char") + " 一起看"), requestAnimationFrame(() => saveReaderProgress_2(ms)), ms;
  }
  async function renderCharPicker() {
    if (window.imApp?.ensureDataReady) await window.imApp.ensureDataReady();
    const chars = (window.imData?.friends || []).filter(friend_3 => friend_3?.type === "char");
    dom.char_picker_empty.hidden = chars.length > 0;
    dom.char_picker_list.hidden = chars.length === 0;
    dom.char_picker_list.innerHTML = chars.map(friend_4 => {
      const avatar_2 = safeImageSource(friend_4.avatarUrl),
        subtitle = friend_4.signature || friend_4.realName || "点击邀请一起看";
      return "<button class=\"library-char-picker-item\" type=\"button\" data-library-char-id=\"" + escapeHtml(friend_4.id) + "\">\n                <span class=\"library-char-picker-avatar\">" + (avatar_2 ? "<img src=\"" + escapeHtml(avatar_2) + "\" alt=\"\">" : "<i class=\"fas fa-user\"></i>") + "</span>\n                <span class=\"library-char-picker-copy\"><strong>" + escapeHtml(friend_4.nickname || friend_4.realName || "Char") + "</strong><small>" + escapeHtml(subtitle) + "</small></span>\n                <i class=\"fas fa-chevron-right\"></i>\n            </button>";
    }).join("");
  }
  async function openCharPicker() {
    if (!state.currentBook) return;
    try {
      await renderCharPicker();
      openModal(dom.char_picker_modal, {
        focus: false
      });
    } catch (error_7) {
      console.error("[Library] Char picker failed:", error_7);
      toast("无法读取 iMessage Char");
    }
  }
  async function startTogether(friend_5) {
    if (!state.currentBook || !friend_5 || friend_5.type !== "char") return;
    const imessageView = $("imessage-view"),
      openChat = window.imChat?.openChatTab || window.imApp?.openChatTab;
    if (!imessageView || typeof openChat !== "function") {
      toast("iMessage 聊天组件未就绪");
      return;
    }
    stopTogether();
    const previousActiveFriendId_2 = window.imData?.currentActiveFriend?.id ?? null;
    state.together = {
      bookId: state.currentBook.id,
      friendId: String(friend_5.id),
      previousImessageActive: imessageView.classList.contains("active"),
      previousActiveFriendId: previousActiveFriendId_2
    };
    closeAllModals();
    try {
      await openChat(friend_5);
      imessageView.classList.add("active", "library-together-popup");
      imessageView.classList.remove("library-together-collapsed");
      imessageView.dataset.libraryTogether = "true";
      ensureTogetherFloat(friend_5).hidden = true;
      updateTogetherControls();
      toast("已邀请 " + (friend_5.nickname || "Char") + " 一起看");
    } catch (error_8) {
      console.error("[Library] Together reading start failed:", error_8);
      stopTogether();
      toast("一起看启动失败");
    }
  }
  function collapseTogetherPopup() {
    if (!state.together) return;
    const $_707 = $("imessage-view"),
      togetherFriend = getTogetherFriend();
    $_707?.classList.add("library-together-collapsed");
    const handleAction_109_708 = ensureTogetherFloat(togetherFriend);
    handleAction_109_708.hidden = false;
    requestAnimationFrame(() => saveReaderProgress_2(handleAction_109_708));
  }
  function restoreTogetherPopup() {
    if (!state.together) return;
    const friend_6 = getTogetherFriend();
    if (friend_6 && window.imData) window.imData.currentActiveFriend = friend_6;
    window.imChat?.updateChatsView?.();
    $("imessage-view")?.classList.remove("library-together-collapsed");
    const floatButton = $("library-together-float");
    if (floatButton) floatButton.hidden = true;
  }
  function stopTogether() {
    const session = state.together;
    if (!session) {
      updateTogetherControls();
      return;
    }
    state.together = null;
    const imessageView_2 = $("imessage-view");
    imessageView_2 && (imessageView_2.classList.remove("library-together-popup", "library-together-collapsed"), delete imessageView_2.dataset.libraryTogether);
    const $_711 = $("library-together-float");
    if ($_711) $_711.hidden = true;
    window.imData && (window.imData.currentActiveFriend = session.previousActiveFriendId == null ? null : (window.imData.friends || []).find(friend_7 => String(friend_7.id) === String(session.previousActiveFriendId)) || null);
    window.imChat?.updateChatsView?.();
    if (imessageView_2 && !session.previousImessageActive) imessageView_2.classList.remove("active");
    updateTogetherControls();
  }
  function getTogetherReadingContext_2(friendOrId_2) {
    const session_2 = state.together,
      friendId_3 = typeof friendOrId_2 === "object" ? friendOrId_2?.id : friendOrId_2,
      book_13 = state.currentBook;
    if (!session_2 || !book_13 || session_2.bookId !== book_13.id || String(session_2.friendId) !== String(friendId_3 ?? "")) return "";
    if (!dom.reader_view.classList.contains("active")) return "";
    const promptXml_2 = value_14 => String(value_14 || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      visibleText_2 = getVisibleReaderText() || "（当前页暂无可见文字）";
    return "<together_reading_context>\n<scene>\n你正和 User 同步读同一本小说，此刻两人都刚好看到 visible_page 中的内容。这是一次真正的“一起看书”，不是读后总结、文学鉴赏或客服问答。\n</scene>\n<co_reading_rules>\n- 把 visible_page 当作你们眼前同时看到的当前页，优先接住其中具体的台词、动作、情绪、人物或情节变化。\n- 像坐在 User 旁边边看边聊：可以即时吐槽、小声感叹、猜接下来会怎样、指出某句话或询问 User 此刻的感受。\n- 用符合角色人设和与 User 关系的自然短句交流，反应要有当下感，可以使用“刚看到这里”“这句”“先等一下”等共读语气。\n- 不要长篇复述原文，不要每次介绍书名和作者，不要机械声明“我们正在一起看书”。\n- 只能根据作品简介和当前页推测，不得捏造后续原文、假装已经看过后文或提前剧透。\n- 如果 User 正在说其他事，先自然回应 User，再视氛围决定是否带回当前页，不要强行转回书本。\n</co_reading_rules>\n<book_title>" + promptXml_2(book_13.title || "未命名") + "</book_title>\n<book_author>" + promptXml_2(book_13.author || "未知作者") + "</book_author>\n<book_synopsis>" + promptXml_2(book_13.synopsis || "暂无简介") + "</book_synopsis>\n<visible_page>" + promptXml_2(visibleText_2) + "</visible_page>\n</together_reading_context>";
  }
  function getTogetherListeningFriendId(friendOrId) {
    return String(typeof friendOrId === "object" ? friendOrId?.id ?? "" : friendOrId ?? "");
  }
  function isPlayableTrack(value_720) {
    return !!value_720 && value_720.available !== false && (handleAction_27(value_720) ? !!handleAction_25() : !!safeHttpUrl(value_720.mediaUrl));
  }
  function getTogetherListeningSnapshot_2(value_721) {
    const session_3 = state.togetherListening;
    if (!session_3) return null;
    const requestedFriendId_2 = getTogetherListeningFriendId(value_721);
    if (requestedFriendId_2 && String(session_3.friendId) !== requestedFriendId_2) return null;
    const track_7 = state.currentTrack,
      playlist_4 = getPlaylist(session_3.playlistId),
      duration_2 = Number.isFinite(audio.duration) ? audio.duration : 0,
      currentTime_2 = Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
      currentLyric_3 = state.lyricIndex >= 0 ? state.lyrics[state.lyricIndex] || null : null;
    return {
      friendId: String(session_3.friendId),
      playlistId: String(session_3.playlistId),
      playlistName: playlist_4?.name || "未命名歌单",
      queue: [...session_3.queue],
      trackId: track_7?.id || "",
      title: track_7?.name || "未知歌曲",
      artist: track_7?.artist || "未知歌手",
      coverUrl: safeImageSource(track_7?.coverUrl),
      isPlaying: !!track_7 && !audio.paused,
      currentTime: currentTime_2,
      duration: duration_2,
      progress: duration_2 > 0 ? Math.max(0, Math.min(1, currentTime_2 / duration_2)) : 0,
      lyricIndex: state.lyricIndex,
      currentLyric: currentLyric_3 ? {
        ...currentLyric_3
      } : null,
      lyricsStatus: state.lyricsStatus
    };
  }
  function resolveTogetherListeningInvitation_2(value_728, resourceId_4) {
    if (!state.ready || state.togetherListening) return null;
    const friendId_4 = getTogetherListeningFriendId(value_728),
      value_731 = typeof value_728 === "object" ? value_728 : (window.imData?.friends || []).find(value_735 => String(value_735?.id) === friendId_4);
    if (!value_731 || value_731.type !== "char" || !friendId_4) return null;
    const trackId_4 = String(resourceId_4 || "").trim(),
      value_733 = state.tracks.find(value_736 => String(value_736?.id) === trackId_4) || null;
    if (!trackId_4 || !isPlayableTrack(value_733)) return null;
    const value_734 = state.playlists.find(value_737 => String(value_737?.id) === String(value_733.playlistId || "") && (value_737.trackIds || []).some(id_7 => String(id_7) === trackId_4)) || state.playlists.find(value_739 => (value_739?.trackIds || []).some(id_8 => String(id_8) === trackId_4));
    if (!value_734) return null;
    return {
      friendId: friendId_4,
      playlistId: String(value_734.id),
      playlistName: String(value_734.name || "未命名歌单"),
      trackId: String(value_733.id),
      title: String(value_733.name || "未知歌曲"),
      artist: String(value_733.artist || "未知歌手"),
      coverUrl: safeImageSource(value_733.coverUrl)
    };
  }
  function getTogetherListeningInvitationContext_2(value_741, resourceId_5 = "") {
    if (!state.ready || state.togetherListening) return "";
    const togetherListeningFriendId_743 = getTogetherListeningFriendId(value_741),
      value_744 = typeof value_741 === "object" ? value_741 : (window.imData?.friends || []).find(value_755 => String(value_755?.id) === togetherListeningFriendId_743);
    if (!value_744 || value_744.type !== "char" || !togetherListeningFriendId_743) return "";
    const sort_745 = [...state.playlists].sort((value_756, value_757) => Number(value_757.updatedAt || 0) - Number(value_756.updatedAt || 0)),
      value_746 = new Set(),
      items_747 = [];
    sort_745.forEach(playlist_18 => {
      playlistTracks(playlist_18).forEach(track_33 => {
        const string_760 = String(track_33?.id || "");
        if (!string_760 || value_746.has(string_760) || !isPlayableTrack(track_33)) return;
        value_746.add(string_760);
        items_747.push({
          playlist: playlist_18,
          track: track_33
        });
      });
    });
    if (items_747.length === 0) return "";
    const toLocaleLowerCase_748 = String(resourceId_5 || "").trim().toLocaleLowerCase("zh-CN"),
      value_749 = ({
        track: track_34
      }) => {
        if (!toLocaleLowerCase_748) return false;
        const toLocaleLowerCase_762 = String(track_34?.name || "").trim().toLocaleLowerCase("zh-CN"),
          toLocaleLowerCase_763 = String(track_34?.artist || "").trim().toLocaleLowerCase("zh-CN");
        return !!(toLocaleLowerCase_762 && toLocaleLowerCase_748.includes(toLocaleLowerCase_762) || toLocaleLowerCase_763 && toLocaleLowerCase_748.includes(toLocaleLowerCase_763));
      },
      filter_750 = items_747.filter(value_749),
      value_751 = new Set(filter_750.map(({
        track: track_35
      }) => String(track_35.id))),
      slice_752 = [...filter_750, ...items_747.filter(({
        track: track_36
      }) => !value_751.has(String(track_36.id)))].slice(0, 120),
      xml = value_16 => String(value_16 ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"),
      join_754 = slice_752.map(({
        playlist: playlist_19,
        track: track_37
      }) => "<track id=\"" + xml(track_37.id) + "\" playlist_id=\"" + xml(playlist_19.id) + "\"><title>" + xml(track_37.name || "未知歌曲") + "</title><artist>" + xml(track_37.artist || "未知歌手") + "</artist><playlist>" + xml(playlist_19.name || "未命名歌单") + "</playlist></track>").join("\n");
    return "<together_listening_invitation_context>\n<scene>Char 可以在当前 iMessage 单聊中，从 User 的歌单里挑一首真实可播放的歌，向 User 发出一起听邀请卡片。</scene>\n<invitation_rules>\n- 根据 User 当前话里的语意、情绪和当下氛围自主判断：当 User 明确想听歌、想要音乐陪伴，或很自然地适合一起听时，才可以邀请；不要因为看到歌单就每轮邀请。\n- 想邀请时，在 <chat_json> 中最多输出一个可见卡片对象：{\"type\":\"music_invite\",\"trackId\":\"目录中的准确歌曲ID\"}。\n- trackId 必须逐字来自 available_user_playlist_tracks；不得自己编造歌名、歌手、歌单或 ID。\n- 卡片只是邀请，不能假定 User 已同意，也不得在发卡片时直接操作播放器。User 点击“一起听”后系统才会开始。\n- 选歌应贴合 User 的语意、情绪和角色自己的审美；没有合适歌曲或不想邀请时，完全不要输出 music_invite。\n</invitation_rules>\n<available_user_playlist_tracks total=\"" + items_747.length + "\" shown=\"" + slice_752.length + "\">\n" + join_754 + "\n</available_user_playlist_tracks>\n</together_listening_invitation_context>";
  }
  async function acceptTogetherListeningInvitation_2(track_8, attemptId) {
    const playbackUrl = resolveTogetherListeningInvitation_2(track_8, attemptId);
    if (!playbackUrl) return toast(state.togetherListening ? "已在一起听中" : "这首歌已不在可播放歌单中"), false;
    const value_772 = typeof track_8 === "object" ? track_8 : (window.imData?.friends || []).find(value_775 => String(value_775?.id) === playbackUrl.friendId),
      playlist_773 = getPlaylist(playbackUrl.playlistId),
      value_774 = state.tracks.find(value_776 => String(value_776?.id) === playbackUrl.trackId) || null;
    return handleAction_119(value_772, playlist_773, value_774);
  }
  function emitTogetherListeningChange(immediate_2 = false) {
    if (!immediate_2 && !state.togetherListening) return;
    const dispatch = () => {
        togetherListeningEventTimer = null;
        lastTogetherListeningEventAt = Date.now();
        const detail_3 = state.togetherListening ? getTogetherListeningSnapshot_2(state.togetherListening.friendId) : null;
        window.dispatchEvent(new CustomEvent("library:together-listening-change", {
          detail: detail_3
        }));
      },
      elapsed_2 = Date.now() - lastTogetherListeningEventAt;
    if (immediate_2 || elapsed_2 >= 750) {
      if (togetherListeningEventTimer) clearTimeout(togetherListeningEventTimer);
      dispatch();
      return;
    }
    if (!togetherListeningEventTimer) togetherListeningEventTimer = setTimeout(dispatch, 750 - elapsed_2);
  }
  function closeTogetherListeningPicker() {
    const $_781 = $("library-together-listening-picker");
    $_781 && ($_781.classList.remove("active"), $_781.setAttribute("aria-hidden", "true"));
    state.togetherPicker = null;
  }
  function renderTogetherListeningPlaylists() {
    const picker_2 = ensureTogetherListeningPicker(),
      list = picker_2.querySelector(".library-together-playlist-list"),
      empty = picker_2.querySelector(".library-together-empty"),
      sort_782 = [...state.playlists].sort((value_783, value_784) => Number(value_784.updatedAt || 0) - Number(value_783.updatedAt || 0));
    empty.hidden = sort_782.length > 0;
    list.hidden = sort_782.length === 0;
    list.innerHTML = sort_782.map(playlist_5 => {
      const tracks_3 = playlistTracks(playlist_5),
        cover_2 = safeImageSource(playlist_5.coverUrl || tracks_3.find(track_9 => track_9?.coverUrl)?.coverUrl),
        playableCount = tracks_3.filter(isPlayableTrack).length;
      return "<button class=\"library-together-playlist-item\" type=\"button\" data-together-playlist-id=\"" + escapeHtml(playlist_5.id) + "\">\n                <span class=\"library-together-picker-art\">" + (cover_2 ? "<img src=\"" + escapeHtml(cover_2) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\">" : "<i class=\"fas fa-music\"></i>") + "</span>\n                <span class=\"library-together-picker-copy\"><strong>" + escapeHtml(playlist_5.name || "未命名歌单") + "</strong><small>" + tracks_3.length + " 首歌曲 · " + playableCount + " 首可播放</small></span>\n                <i class=\"fas fa-chevron-right\"></i>\n            </button>";
    }).join("");
  }
  function renderTogetherListeningTracks() {
    const picker_3 = ensureTogetherListeningPicker(),
      pickerState = state.togetherPicker;
    if (!pickerState?.playlistId) return;
    const playlist_6 = getPlaylist(pickerState.playlistId),
      tracks_4 = playlistTracks(playlist_6),
      query_2 = String(pickerState.query || "").trim().toLocaleLowerCase("zh-CN"),
      filter_795 = tracks_4.filter(value_796 => !query_2 || ((value_796.name || "") + " " + (value_796.artist || "")).toLocaleLowerCase("zh-CN").includes(query_2)),
      list_2 = picker_3.querySelector(".library-together-track-list"),
      noResults = picker_3.querySelector(".library-together-no-results"),
      confirm_2 = picker_3.querySelector("[data-together-picker-action=\"confirm\"]"),
      selected = getTrack(pickerState.selectedTrackId);
    picker_3.querySelector(".library-together-picker-title").textContent = playlist_6?.name || "选择歌曲";
    noResults.hidden = filter_795.length > 0;
    list_2.hidden = filter_795.length === 0;
    list_2.innerHTML = filter_795.map((track_10, value_798) => {
      const playable = isPlayableTrack(track_10),
        safeImageSource_800 = safeImageSource(track_10.coverUrl),
        isSelected = playable && String(track_10.id) === String(pickerState.selectedTrackId);
      return "<button class=\"library-together-track-item" + (isSelected ? " selected" : "") + "\" type=\"button\" data-together-track-id=\"" + escapeHtml(track_10.id) + "\" " + (playable ? "" : "disabled") + ">\n                <span class=\"library-together-track-index\">" + (isSelected ? "<i class=\"fas fa-check\"></i>" : value_798 + 1) + "</span>\n                <span class=\"library-together-picker-art\">" + (safeImageSource_800 ? "<img src=\"" + escapeHtml(safeImageSource_800) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\">" : "<i class=\"fas fa-music\"></i>") + "</span>\n                <span class=\"library-together-picker-copy\"><strong>" + escapeHtml(track_10.name || "未知歌曲") + "</strong><small>" + escapeHtml(track_10.artist || "未知歌手") + (playable ? "" : " · 不可播放") + "</small></span>\n            </button>";
    }).join("");
    confirm_2.disabled = !isPlayableTrack(selected) || !tracks_4.some(track_11 => String(track_11.id) === String(selected?.id));
  }
  function showTogetherListeningPlaylistStep() {
    const picker = ensureTogetherListeningPicker();
    picker.classList.remove("show-tracks");
    picker.querySelector(".library-together-picker-title").textContent = "选择歌单";
    picker.querySelector(".library-together-picker-search").value = "";
    renderTogetherListeningPlaylists();
  }
  function showTogetherListeningTrackStep(value_803) {
    const playlist_7 = getPlaylist(value_803);
    if (!playlist_7 || !state.togetherPicker) return;
    const tracks_5 = playlistTracks(playlist_7),
      firstPlayable = tracks_5.find(isPlayableTrack) || null;
    state.togetherPicker.playlistId = String(playlist_7.id);
    state.togetherPicker.selectedTrackId = firstPlayable?.id || "";
    state.togetherPicker.query = "";
    const picker_4 = ensureTogetherListeningPicker();
    picker_4.classList.add("show-tracks");
    picker_4.querySelector(".library-together-picker-search").value = "";
    renderTogetherListeningTracks();
  }
  async function handleAction_119(friend_8, playlist_8, track_12) {
    if (!friend_8 || friend_8.type !== "char" || !playlist_8 || !isPlayableTrack(track_12)) return false;
    const queue_2 = playlistTracks(playlist_8).map(item_5 => item_5.id);
    return state.togetherListening = {
      friendId: String(friend_8.id),
      playlistId: String(playlist_8.id),
      queue: queue_2
    }, closeTogetherListeningPicker(), emitTogetherListeningChange(true), await playTrack(track_12, queue_2), toast("已和 " + (friend_8.nickname || friend_8.realName || "Char") + " 一起听"), true;
  }
  function stopTogetherListening_2(friendOrId_3, options_6 = {}) {
    const session_4 = state.togetherListening;
    if (!session_4) return false;
    const requestedFriendId = getTogetherListeningFriendId(friendOrId_3);
    if (requestedFriendId && requestedFriendId !== String(session_4.friendId)) return false;
    state.togetherListening = null;
    state.playerReturnToChatFriendId = null;
    emitTogetherListeningChange(true);
    if (!options_6.silent) toast("已退出一起听，音乐将继续播放");
    return true;
  }
  function ensureTogetherListeningPicker() {
    let picker_5 = $("library-together-listening-picker");
    if (picker_5) return picker_5;
    return picker_5 = document.createElement("section"), picker_5.id = "library-together-listening-picker", picker_5.className = "library-together-picker", picker_5.setAttribute("aria-hidden", "true"), picker_5.innerHTML = "\n            <div class=\"library-together-picker-backdrop\" data-together-picker-action=\"close\"></div>\n            <div class=\"library-together-picker-card\" role=\"dialog\" aria-modal=\"true\" aria-label=\"选择一起听的歌曲\">\n                <header>\n                    <button class=\"library-together-picker-back\" type=\"button\" data-together-picker-action=\"back\" aria-label=\"返回\"><i class=\"fas fa-chevron-left\"></i></button>\n                    <strong class=\"library-together-picker-title\">选择歌单</strong>\n                    <button type=\"button\" data-together-picker-action=\"close\" aria-label=\"关闭\"><i class=\"fas fa-times\"></i></button>\n                </header>\n                <div class=\"library-together-picker-playlists\">\n                    <div class=\"library-together-playlist-list\"></div>\n                    <div class=\"library-together-empty\" hidden>\n                        <i class=\"fas fa-music\"></i><strong>Library 还没有歌单</strong><span>先添加歌单或歌曲，再来和 Char 一起听。</span>\n                        <button type=\"button\" data-together-picker-action=\"open-library\">前往 Library 添加</button>\n                    </div>\n                </div>\n                <div class=\"library-together-picker-tracks\">\n                    <label class=\"library-together-search\"><i class=\"fas fa-search\"></i><input class=\"library-together-picker-search\" type=\"search\" placeholder=\"搜索歌曲或歌手\" autocomplete=\"off\"></label>\n                    <div class=\"library-together-track-list\"></div>\n                    <div class=\"library-together-no-results\" hidden>没有找到匹配的歌曲</div>\n                    <button class=\"library-together-confirm\" type=\"button\" data-together-picker-action=\"confirm\">确定并开始一起听</button>\n                </div>\n            </div>", ($("imessage-view") || document.body).appendChild(picker_5), picker_5.addEventListener("click", async event_4 => {
      const action_2 = event_4.target.closest("[data-together-picker-action]")?.dataset.togetherPickerAction;
      if (action_2 === "close") return closeTogetherListeningPicker();
      if (action_2 === "back") return showTogetherListeningPlaylistStep();
      if (action_2 === "open-library") {
        closeTogetherListeningPicker();
        openApp("music");
        return;
      }
      const playlistButton = event_4.target.closest("[data-together-playlist-id]");
      if (playlistButton) return showTogetherListeningTrackStep(playlistButton.dataset.togetherPlaylistId);
      const trackButton = event_4.target.closest("[data-together-track-id]");
      if (trackButton && !trackButton.disabled && state.togetherPicker) {
        state.togetherPicker.selectedTrackId = trackButton.dataset.togetherTrackId;
        renderTogetherListeningTracks();
        return;
      }
      if (action_2 === "confirm" && state.togetherPicker) {
        const friend_9 = (window.imData?.friends || []).find(item_6 => String(item_6.id) === String(state.togetherPicker.friendId)),
          playlist_9 = getPlaylist(state.togetherPicker.playlistId),
          track_13 = getTrack(state.togetherPicker.selectedTrackId);
        await handleAction_119(friend_9, playlist_9, track_13);
      }
    }), picker_5.querySelector(".library-together-picker-search").addEventListener("input", event_5 => {
      if (!state.togetherPicker) return;
      state.togetherPicker.query = event_5.target.value;
      renderTogetherListeningTracks();
    }), picker_5;
  }
  function openTogetherListeningPicker_2(friend_10) {
    if (!state.ready) return toast("Library 正在加载，请稍后再试");
    if (!friend_10 || friend_10.type !== "char") return toast("一起听仅支持 Char 单聊");
    if (getTogetherListeningSnapshot_2(friend_10)) {
      stopTogetherListening_2(friend_10);
      return;
    }
    state.togetherPicker = {
      friendId: String(friend_10.id),
      playlistId: "",
      selectedTrackId: "",
      query: ""
    };
    const picker_6 = ensureTogetherListeningPicker();
    showTogetherListeningPlaylistStep();
    picker_6.classList.add("active");
    picker_6.setAttribute("aria-hidden", "false");
  }
  async function controlTogetherListening_2(value_828, command = {}) {
    const snapshot = getTogetherListeningSnapshot_2(value_828);
    if (!snapshot) return false;
    const action_3 = String(command.action || "").trim().toLowerCase();
    if (action_3 === "toggle") return togglePlayback(), true;
    if (action_3 === "next" || action_3 === "previous") return state.queue = [...snapshot.queue], state.queueIndex = state.queue.findIndex(id_9 => String(id_9) === String(snapshot.trackId)), playQueueDirection(action_3 === "next" ? 1 : -1), true;
    if (action_3 !== "play_track") return false;
    const trackId_5 = String(command.trackId || "").trim();
    if (!trackId_5 || !snapshot.queue.some(id_10 => String(id_10) === trackId_5)) return false;
    const track_14 = getTrack(trackId_5);
    if (!isPlayableTrack(track_14) || String(track_14.playlistId) !== String(snapshot.playlistId)) return false;
    return await playTrack(track_14, snapshot.queue), true;
  }
  function openTogetherListeningPlayer_2(value_835) {
    const snapshot_2 = getTogetherListeningSnapshot_2(value_835);
    if (!snapshot_2 || !state.currentTrack) return false;
    return state.playerReturnToChatFriendId = snapshot_2.friendId, openApp("music"), openPlayer(), true;
  }
  function formatLrcTimestamp(seconds_5) {
    const safe_3 = Math.max(0, Number(seconds_5) || 0),
      floor_838 = Math.floor(safe_3 / 60),
      floor_839 = Math.floor(safe_3 % 60),
      hundredths = Math.floor((safe_3 - Math.floor(safe_3)) * 100);
    return String(floor_838).padStart(2, "0") + ":" + String(floor_839).padStart(2, "0") + "." + String(hundredths).padStart(2, "0");
  }
  function getTogetherListeningContext_2(value_841) {
    const snapshot_3 = getTogetherListeningSnapshot_2(value_841);
    if (!snapshot_3) return "";
    const session_5 = state.togetherListening,
      playlist_10 = getPlaylist(snapshot_3.playlistId),
      track_15 = state.currentTrack;
    if (!session_5 || !playlist_10 || !track_15) return "";
    const xml_2 = value_21 => String(value_21 ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"),
      lyricsStatusText = {
        loading: "歌词正在加载，当前不可用",
        unavailable: "歌曲没有歌词地址，歌词不可用",
        error: "歌词加载失败，歌词不可用",
        ready: "歌词已完整加载",
        idle: "歌词尚未加载"
      }[state.lyricsStatus] || "歌词状态未知",
      value_848 = state.lyrics.length ? state.lyrics.map((value_852, value_853) => (value_853 === state.lyricIndex ? "▶ " : "") + "[" + formatLrcTimestamp(value_852.time) + "] " + value_852.text).join("\n") : "（" + lyricsStatusText + "）",
      value_849 = snapshot_3.currentLyric ? "[" + formatLrcTimestamp(snapshot_3.currentLyric.time) + "] " + snapshot_3.currentLyric.text : "（尚未播放到第一句，或当前没有可用歌词）",
      join_850 = playlistTracks(playlist_10).map(value_854 => "<track id=\"" + xml_2(value_854.id) + "\" available=\"" + (isPlayableTrack(value_854) ? "true" : "false") + "\"><title>" + xml_2(value_854.name || "未知歌曲") + "</title><artist>" + xml_2(value_854.artist || "未知歌手") + "</artist></track>").join("\n");
    return "<together_listening_context>\n<scene>你正在和 User 同步听歌。以下播放状态是本次 API 请求发起时的实时快照。</scene>\n<listening_rules>\n- 你可以自然谈论当前歌曲、歌手、完整歌词和正在播放到的这一句，但不要机械复述全部歌词。\n- 歌词不可用时必须明确承认不知道歌词，绝对禁止编造歌词。\n- 只有 User 明确要求切歌或点歌时，才可以输出一个 music_control；不得主动切歌，每轮最多一个。\n- “下一首”使用 {\"type\":\"music_control\",\"action\":\"next\"}，“上一首”使用 {\"type\":\"music_control\",\"action\":\"previous\"}。\n- 指定歌曲只能从 available_playlist_tracks 中选择 available=true 的歌曲，并使用准确 ID：{\"type\":\"music_control\",\"action\":\"play_track\",\"trackId\":\"歌曲ID\"}。\n- 歌名有歧义、没有命中或歌曲不可播放时，不要输出 music_control，改为在普通聊天气泡中询问或说明。\n</listening_rules>\n<playlist id=\"" + xml_2(snapshot_3.playlistId) + "\">" + xml_2(snapshot_3.playlistName) + "</playlist>\n<current_track id=\"" + xml_2(snapshot_3.trackId) + "\"><title>" + xml_2(snapshot_3.title) + "</title><artist>" + xml_2(snapshot_3.artist) + "</artist></current_track>\n<playback_state>" + (snapshot_3.isPlaying ? "playing" : "paused") + "</playback_state>\n<position seconds=\"" + snapshot_3.currentTime.toFixed(2) + "\" duration=\"" + snapshot_3.duration.toFixed(2) + "\">" + xml_2(formatClock(snapshot_3.currentTime)) + " / " + xml_2(formatClock(snapshot_3.duration)) + "</position>\n<lyrics_status>" + xml_2(lyricsStatusText) + "</lyrics_status>\n<current_lyric index=\"" + snapshot_3.lyricIndex + "\">" + xml_2(value_849) + "</current_lyric>\n<available_playlist_tracks>\n" + join_850 + "\n</available_playlist_tracks>\n<full_timed_lyrics>\n" + xml_2(value_848) + "\n</full_timed_lyrics>\n</together_listening_context>";
  }
  function handleAction_126(offset_4) {
    const textOffset_2 = Number(offset_4) || 0;
    if (!textOffset_2) return "尚未同步";
    try {
      return "上次同步 " + new Date(textOffset_2).toLocaleString("zh-CN", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (value_857) {
      return "已同步";
    }
  }
  function handleAction_127() {
    if (!dom.netease_account) return;
    const handleAction_25_858 = handleAction_25(),
      value_859 = state.neteaseAccount?.profile || null,
      hidden_3 = !!handleAction_25_858 && !!value_859?.userId;
    setArtwork(dom.netease_avatar, hidden_3 ? value_859.avatarUrl : "", hidden_3 ? "fa-user" : "fa-music");
    dom.netease_name.textContent = hidden_3 ? value_859.nickname || "网易云用户" : "网易云音乐";
    dom.netease_status.textContent = state.neteaseSyncing ? state.neteaseAccount?.syncLabel || "正在同步音乐库…" : hidden_3 ? handleAction_126(state.neteaseAccount?.lastSyncAt) : "登录后同步你的歌单与喜欢";
    dom.netease_login_btn.hidden = hidden_3;
    dom.netease_refresh_btn.hidden = !hidden_3;
    dom.netease_logout_btn.hidden = !hidden_3;
    dom.netease_refresh_btn.disabled = state.neteaseSyncing;
    dom.netease_logout_btn.disabled = state.neteaseSyncing;
    dom.netease_sync_progress.hidden = !state.neteaseSyncing;
  }
  function handleAction_128(value_861, value_862, value_863) {
    const max_864 = Math.max(1, Number(value_862) || 1),
      max_865 = Math.max(0, Math.min(100, Number(value_861) / max_864 * 100));
    state.neteaseAccount = {
      ...(state.neteaseAccount || {}),
      syncLabel: value_863 || "正在同步 " + value_861 + "/" + value_862
    };
    dom.netease_sync_progress?.style.setProperty("--netease-sync-progress", max_865 + "%");
    handleAction_127();
  }
  function handleAction_129() {
    clearTimeout(state.neteaseQrPollTimer);
    state.neteaseQrPollTimer = null;
  }
  function handleAction_130() {
    const value_866 = !!state.neteaseQrKey && !!state.neteaseQrImage;
    dom.netease_qr_save && (dom.netease_qr_save.hidden = !value_866, dom.netease_qr_save.disabled = !value_866);
    dom.netease_qr_check && (dom.netease_qr_check.hidden = !value_866, dom.netease_qr_check.disabled = !value_866 || state.neteaseQrPollPending);
  }
  function handleAction_131() {
    handleAction_129();
    state.neteaseQrKey = "";
    state.neteaseQrImage = "";
    state.neteaseQrExpiresAt = 0;
    state.neteaseQrPollPending = false;
    handleAction_130();
  }
  function handleAction_132() {
    return state.neteaseQrExpiresAt > 0 && Date.now() >= state.neteaseQrExpiresAt;
  }
  function handleAction_133() {
    handleAction_131();
    handleAction_134("二维码已过期", "请重新生成二维码。", {
      retry: true
    });
  }
  function handleAction_134(textContent_3, textContent_4, value_869 = {}) {
    if (!dom.netease_qr_status) return;
    dom.netease_qr_status.textContent = textContent_3;
    dom.netease_qr_message.textContent = textContent_4;
    dom.netease_qr_retry.hidden = !value_869.retry;
  }
  function handleAction_135() {
    if (!state.neteaseQrImage) throw new Error("二维码尚未生成");
    const match_870 = state.neteaseQrImage.match(/^data:(image\/[a-z0-9.+-]+);base64,([a-z0-9+/=]+)$/i);
    if (!match_870) throw new Error("二维码图片无效");
    const atob_871 = atob(match_870[2]),
      value_872 = new Uint8Array(atob_871.length);
    for (let count_876 = 0; count_876 < atob_871.length; count_876 += 1) value_872[count_876] = atob_871.charCodeAt(count_876);
    const blob_2 = new Blob([value_872], {
        type: match_870[1]
      }),
      name_4 = "netease-login-qr-" + Date.now() + ".png",
      file_7 = typeof File === "function" ? new File([blob_2], name_4, {
        type: blob_2.type || "image/png"
      }) : null;
    return {
      blob: blob_2,
      file: file_7,
      name: name_4
    };
  }
  async function handleAction_136() {
    if (!state.neteaseQrImage || !state.neteaseQrKey) {
      toast("请先生成网易云登录二维码");
      return;
    }
    if (handleAction_132()) {
      handleAction_133();
      return;
    }
    try {
      const {
        blob: blob_3,
        file: file_8,
        name: download_2
      } = handleAction_135();
      if (window.u2NativeBridge?.isNativeAndroid?.() && typeof window.u2NativeBridge?.exportFile === "function") {
        const value_882 = await window.u2NativeBridge.exportFile({
          blob: file_8 || blob_3,
          fileName: download_2,
          title: "网易云登录二维码"
        });
        if (value_882 !== "cancelled") toast("保存后请在网易云音乐“扫一扫”中从相册选择二维码");
        return;
      }
      const value_880 = file_8 ? {
        files: [file_8],
        title: "网易云登录二维码"
      } : null;
      if (value_880 && typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare(value_880)) try {
        await navigator.share(value_880);
        toast("保存后请在网易云音乐“扫一扫”中从相册选择二维码");
        return;
      } catch (value_883) {
        if (value_883?.name === "AbortError") return;
      }
      const element_881 = document.createElement("a");
      element_881.href = state.neteaseQrImage;
      element_881.download = download_2;
      element_881.target = "_blank";
      element_881.rel = "noopener";
      document.body.appendChild(element_881);
      element_881.click();
      element_881.remove();
      toast("已发起保存；若没有下载，请长按二维码图片保存");
    } catch (value_884) {
      console.error("[Library] NetEase QR save failed:", value_884);
      toast("无法自动保存，请长按二维码图片保存");
    }
  }
  async function startNetEaseQrLogin_2() {
    handleAction_131();
    openModal(dom.netease_login_modal, {
      focus: false
    });
    dom.netease_qr.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i>";
    handleAction_134("正在生成二维码…", "请稍候。");
    try {
      const value_885 = await handleAction_28("/api/netease/qr/start", {
          method: "POST",
          auth: false
        }),
        neteaseQrImage_2 = safeImageSource(value_885?.qrImage);
      if (!value_885?.key || !neteaseQrImage_2) throw new Error("二维码生成失败");
      state.neteaseQrKey = String(value_885.key);
      state.neteaseQrImage = neteaseQrImage_2;
      state.neteaseQrExpiresAt = Number(value_885.expiresAt) || Date.now() + 240000;
      dom.netease_qr.innerHTML = "<img src=\"" + escapeHtml(neteaseQrImage_2) + "\" alt=\"网易云登录二维码\" title=\"长按保存二维码\">";
      handleAction_130();
      handleAction_134("等待扫码", "保存二维码后，打开网易云音乐 App，进入“扫一扫”并从相册选择二维码；确认后返回此页面。");
      handleAction_138(600);
    } catch (value_887) {
      console.error("[Library] NetEase QR start failed:", value_887);
      dom.netease_qr.innerHTML = "<i class=\"fas fa-triangle-exclamation\"></i>";
      handleAction_134("二维码生成失败", handleAction_24(value_887), {
        retry: true
      });
    }
  }
  function handleAction_138(value_888 = 1500) {
    handleAction_129();
    if (!state.neteaseQrKey || dom.netease_login_modal?.hidden || document.hidden) return;
    if (handleAction_132()) return handleAction_133();
    state.neteaseQrPollTimer = setTimeout(handleAction_139, value_888);
  }
  async function handleAction_139() {
    const neteaseQrKey_889 = state.neteaseQrKey;
    if (!neteaseQrKey_889 || dom.netease_login_modal?.hidden || document.hidden || state.neteaseQrPollPending) return;
    if (handleAction_132()) return handleAction_133();
    state.neteaseQrPollPending = true;
    handleAction_130();
    try {
      const value_890 = await handleAction_28("/api/netease/qr/status?key=" + encodeURIComponent(neteaseQrKey_889), {
        auth: false
      });
      if (neteaseQrKey_889 !== state.neteaseQrKey) return;
      if (value_890.status === "waiting") return handleAction_134("等待扫码", "请保存二维码，并在网易云音乐“扫一扫”中从相册选择。"), handleAction_138();
      if (value_890.status === "scanned") return handleAction_134("已扫码", "请在网易云音乐 App 中确认登录，然后返回此页面。"), handleAction_138();
      if (value_890.status === "expired") return handleAction_133();
      if (value_890.status !== "authorized" || !value_890.sessionToken || !value_890.profile?.userId) throw new Error("网易云没有返回有效登录状态");
      handleAction_131();
      await handleAction_26(value_890.sessionToken);
      state.neteaseAccount = {
        profile: value_890.profile,
        lastSyncAt: 0,
        syncLabel: ""
      };
      await storage().setSetting(text_8, state.neteaseAccount);
      handleAction_127();
      handleAction_134("登录成功", "正在同步你的音乐库…");
      const value_891 = await syncNetEaseAccountLibrary_2({
        closeLoginModal: true
      });
      !value_891 && !dom.netease_login_modal.hidden && handleAction_134("登录成功，同步失败", "账号已经连接，可以关闭窗口后点击刷新重试。");
    } catch (value_892) {
      console.error("[Library] NetEase QR check failed:", value_892);
      if (neteaseQrKey_889 === state.neteaseQrKey && !handleAction_132() && (value_892?.name === "AbortError" || value_892 instanceof TypeError)) {
        handleAction_134("连接暂时中断", "二维码仍然有效，请检查网络后点击“我已确认，立即检查”。");
        return;
      }
      handleAction_131();
      handleAction_134("登录失败", handleAction_24(value_892), {
        retry: true
      });
    } finally {
      neteaseQrKey_889 === state.neteaseQrKey && (state.neteaseQrPollPending = false, handleAction_130());
    }
  }
  function handlePageshow() {
    if (document.hidden) {
      handleAction_129();
      return;
    }
    if (!state.neteaseQrKey || dom.netease_login_modal?.hidden) return;
    if (handleAction_132()) return handleAction_133();
    handleAction_138(0);
  }
  async function handleAction_141(value_893, value_894, value_895) {
    const value_896 = new Array(value_893.length);
    let count_897 = 0;
    const from_898 = Array.from({
      length: Math.min(Math.max(1, value_894), Math.max(1, value_893.length))
    }, async () => {
      while (count_897 < value_893.length) {
        const value_899 = count_897;
        count_897 += 1;
        value_896[value_899] = await value_895(value_893[value_899], value_899);
      }
    });
    return await Promise.all(from_898), value_896;
  }
  async function handleAction_142(value_900) {
    const items_901 = [];
    let count_902 = 0;
    while (true) {
      const value_903 = await handleAction_28("/api/netease/playlists?uid=" + encodeURIComponent(value_900) + "&limit=1000&offset=" + count_902),
        value_904 = Array.isArray(value_903.playlists) ? value_903.playlists : [];
      items_901.push(...value_904);
      if (!value_903.more || value_904.length === 0) break;
      count_902 += value_904.length;
    }
    return items_901.filter(value_905 => /^\d+$/.test(String(value_905.id || "")));
  }
  async function handleAction_143(value_906) {
    const items_907 = [],
      max_908 = Math.max(0, Number(value_906.trackCount) || 0),
      count_909 = 1000;
    let count_910 = 0;
    do {
      const value_911 = await handleAction_28("/api/netease/playlists/" + encodeURIComponent(value_906.id) + "/tracks?limit=" + count_909 + "&offset=" + count_910),
        value_912 = Array.isArray(value_911.tracks) ? value_911.tracks : [];
      items_907.push(...value_912);
      count_910 += count_909;
      if (!max_908 && value_912.length < count_909) break;
    } while (!max_908 || count_910 < max_908);
    return items_907;
  }
  function handleAction_144(value_913, items_914, value_915, value_916, value_917) {
    const isLikedPlaylist_2 = String(value_913.id) === String(value_917),
      value_919 = isLikedPlaylist_2 ? "netease_account_liked_" + value_915 : "netease_account_playlist_" + value_913.id,
      playlist_920 = getPlaylist(value_919),
      value_921 = new Map((value_916 || []).map((value_925, value_926) => [String(value_925), value_926])),
      items_922 = isLikedPlaylist_2 && value_921.size ? items_914.filter(value_927 => value_921.has(String(value_927.id))).sort((value_928, value_929) => value_921.get(String(value_928.id)) - value_921.get(String(value_929.id))) : items_914,
      updatedAt_3 = Date.now(),
      tracks_6 = items_922.map(value_930 => ({
        id: "netease_account_track_" + value_913.id + "_" + value_930.id,
        playlistId: value_919,
        source: source_6,
        sourcePlaylistId: String(value_913.id),
        accountUserId: String(value_915),
        neteaseId: String(value_930.id),
        name: String(value_930.name || "未知歌曲").slice(0, 120),
        artist: String(value_930.artist || "未知歌手").slice(0, 120),
        album: String(value_930.album || "").slice(0, 120),
        coverUrl: safeHttpUrl(value_930.coverUrl),
        mediaUrl: "",
        lyricUrl: "",
        durationMs: Number(value_930.durationMs) || 0,
        fee: Number(value_930.fee) || 0,
        maxBitrate: Number(value_930.maxBitrate) || 0,
        available: value_930.available !== false,
        unavailableReason: String(value_930.reason || ""),
        liked: value_921.has(String(value_930.id)),
        createdAt: playlist_920?.createdAt || updatedAt_3,
        updatedAt: updatedAt_3
      }));
    return {
      playlist: {
        id: value_919,
        source: source_6,
        sourceId: String(value_913.id),
        accountUserId: String(value_915),
        isLikedPlaylist: isLikedPlaylist_2,
        name: isLikedPlaylist_2 ? "我喜欢的音乐" : String(value_913.name || "未命名歌单").slice(0, 120),
        coverUrl: safeHttpUrl(value_913.coverUrl) || tracks_6.find(track_16 => track_16.coverUrl)?.coverUrl || "",
        trackIds: tracks_6.map(value_932 => value_932.id),
        createdAt: playlist_920?.createdAt || updatedAt_3,
        updatedAt: updatedAt_3
      },
      tracks: tracks_6
    };
  }
  async function syncNetEaseAccountLibrary_2(value_933 = {}) {
    if (state.neteaseSyncing) return false;
    if (!handleAction_25()) return toast("请先扫码登录网易云音乐"), startNetEaseQrLogin_2(), false;
    state.neteaseSyncing = true;
    handleAction_128(0, 1, "正在读取网易云账号…");
    try {
      const value_934 = await handleAction_28("/api/netease/me"),
        profile_2 = value_934?.profile;
      if (!profile_2?.userId) throw new Error("网易云登录已失效，请重新扫码");
      const string_936 = String(profile_2.userId),
        [value_937, value_938] = await Promise.all([handleAction_142(string_936), handleAction_28("/api/netease/liked?uid=" + encodeURIComponent(string_936))]),
        value_939 = Array.isArray(value_938.ids) ? value_938.ids.map(String) : [],
        value_940 = value_937.find(value_946 => String(value_946.creatorUserId) === string_936) || null,
        max_941 = Math.max(1, value_937.length);
      let count_942 = 0;
      const items_943 = await handleAction_141(value_937, 3, async value_947 => {
          const value_948 = await handleAction_143(value_947);
          return count_942 += 1, handleAction_128(count_942, max_941, "正在同步 " + count_942 + "/" + max_941), handleAction_144(value_947, value_948, string_936, value_939, value_940?.id || "");
        }),
        value_944 = new Set(items_943.map(value_949 => value_949.playlist.id));
      for (const value_950 of items_943) {
        await storage().saveLibraryPlaylistBundle(value_950.playlist, value_950.tracks, {
          replaceTracks: true
        });
      }
      const filter_945 = state.playlists.filter(value_951 => value_951.source === source_6 && !value_944.has(value_951.id));
      for (const playlist_11 of filter_945) await storage().deleteLibraryPlaylist(playlist_11.id);
      state.playlists = await storage().loadLibraryPlaylists();
      state.tracks = (await storage().loadLibraryTracks()).map(normalizeNetEaseTrackResources);
      state.neteaseAccount = {
        profile: profile_2,
        lastSyncAt: Date.now(),
        syncLabel: ""
      };
      await storage().setSetting(text_8, state.neteaseAccount);
      handleAction_147();
      toast("已同步 " + items_943.length + " 个网易云歌单");
      if (value_933.closeLoginModal) closeAllModals();
      return true;
    } catch (value_953) {
      return console.error("[Library] NetEase account sync failed:", value_953), toast(handleAction_24(value_953)), false;
    } finally {
      state.neteaseSyncing = false;
      if (state.neteaseAccount) state.neteaseAccount.syncLabel = "";
      handleAction_127();
    }
  }
  async function logoutNetEaseAccount_2() {
    handleAction_131();
    handleAction_27(state.currentTrack) && (audio.pause(), audio.removeAttribute("src"), audio.load(), state.currentTrack = null, state.queue = [], state.queueIndex = -1, updatePlayerUi());
    await handleAction_26("");
    state.neteaseAccount = null;
    readerChunkHtmlCache_3.clear();
    await storage().setSetting(text_8, null);
    handleAction_127();
    toast("已退出网易云登录，本地歌单仍会保留");
  }
  function handleAction_147() {
    const sorted_2 = [...state.playlists].sort((value_955, value_956) => Number(value_956.updatedAt || 0) - Number(value_955.updatedAt || 0));
    dom.playlist_count.textContent = sorted_2.length + " " + (sorted_2.length === 1 ? "PLAYLIST" : "PLAYLISTS");
    dom.music_empty.hidden = sorted_2.length > 0;
    dom.playlist_list.hidden = sorted_2.length === 0;
    dom.playlist_list.innerHTML = sorted_2.map(playlist_12 => {
      const count_2 = Array.isArray(playlist_12.trackIds) ? playlist_12.trackIds.length : 0,
        safeHttpUrl_959 = safeHttpUrl(playlist_12.coverUrl);
      return "\n                <button class=\"library-playlist-card\" type=\"button\" data-playlist-id=\"" + escapeHtml(playlist_12.id) + "\">\n                    <span class=\"library-playlist-cover\">" + (safeHttpUrl_959 ? "<img src=\"" + escapeHtml(safeHttpUrl_959) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\">" : "<i class=\"fas fa-music\"></i>") + "</span>\n                    <span><strong>" + escapeHtml(playlist_12.name || "未命名歌单") + "</strong><small>" + count_2 + " 首歌曲 · " + escapeHtml([source_6, "netease"].includes(playlist_12.source) ? "网易云音乐" : "Library") + "</small></span>\n                    <i class=\"fas fa-chevron-right\"></i>\n                </button>";
    }).join("");
  }
  function playlistTracks(playlist_13) {
    return (playlist_13?.trackIds || []).map(getTrack).filter(Boolean);
  }
  function openPlaylist(currentPlaylist_2) {
    if (!currentPlaylist_2) return;
    state.currentPlaylist = currentPlaylist_2;
    const playlistTracks_962 = playlistTracks(currentPlaylist_2);
    dom.playlist_title.textContent = currentPlaylist_2.name || "未命名歌单";
    dom.playlist_meta.textContent = playlistTracks_962.length + " 首歌曲" + ([source_6, "netease"].includes(currentPlaylist_2.source) ? " · 网易云音乐" : "");
    setArtwork(dom.playlist_cover, currentPlaylist_2.coverUrl);
    dom.track_list.innerHTML = playlistTracks_962.map((track_17, value_964) => {
      const handleAction_112_965 = isPlayableTrack(track_17);
      return "\n            <button class=\"library-track-row" + (handleAction_112_965 ? "" : " unavailable") + "\" type=\"button\" data-track-id=\"" + escapeHtml(track_17.id) + "\">\n                <span class=\"library-track-art\">" + (safeHttpUrl(track_17.coverUrl) ? "<img src=\"" + escapeHtml(safeHttpUrl(track_17.coverUrl)) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\">" : "<i class=\"fas fa-music\"></i>") + "</span>\n                <span><strong>" + escapeHtml(track_17.name || "未知歌曲") + "</strong><small>" + escapeHtml(track_17.artist || "未知歌手") + "</small></span>\n                <span>" + (handleAction_112_965 ? String(value_964 + 1).padStart(2, "0") : handleAction_27(track_17) && !handleAction_25() ? "需登录" : "不可播放") + "</span>\n            </button>";
    }).join("");
    dom.playlist_view.classList.add("active");
    dom.playlist_view.setAttribute("aria-hidden", "false");
  }
  function closePlaylist() {
    dom.playlist_view.classList.remove("active");
    dom.playlist_view.setAttribute("aria-hidden", "true");
    state.currentPlaylist = null;
  }
  async function ensureManualPlaylist() {
    let playlist_14 = state.playlists.find(item_7 => item_7.id === "library_manual_playlist");
    if (playlist_14) return playlist_14;
    return playlist_14 = {
      id: "library_manual_playlist",
      name: "我的歌单",
      source: "manual",
      coverUrl: "",
      trackIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }, await storage().saveLibraryPlaylistBundle(playlist_14, []), state.playlists.push(playlist_14), playlist_14;
  }
  function openModal(modal, options_7 = {}) {
    closeAllModals();
    modal.hidden = false;
    if (options_7.focus !== false) requestAnimationFrame(() => modal.querySelector("input, textarea")?.focus());
  }
  function closeAllModals() {
    [dom.import_modal, dom.track_modal, dom.book_detail_modal, dom.char_picker_modal, dom.netease_login_modal].forEach(modal_2 => {
      if (modal_2) modal_2.hidden = true;
    });
    handleAction_131();
    if (dom.book_edit_form) setBookDetailEditing(false);
  }
  async function handleTrack_formSubmit(event_970) {
    event_970.preventDefault();
    const name_3 = dom.track_name.value.trim(),
      artist_2 = dom.track_artist.value.trim() || "未知歌手",
      mediaUrl_3 = safeHttpUrl(dom.track_url.value),
      coverUrl_2 = dom.track_cover_url.value.trim() ? safeHttpUrl(dom.track_cover_url.value) : "",
      lyricUrl_2 = dom.track_lyric_url.value.trim() ? safeHttpUrl(dom.track_lyric_url.value) : "";
    if (!name_3 || !mediaUrl_3) return toast("请填写歌曲名称和有效的音频 URL");
    if (dom.track_cover_url.value.trim() && !coverUrl_2) return toast("封面 URL 无效");
    if (dom.track_lyric_url.value.trim() && !lyricUrl_2) return toast("歌词 URL 无效");
    try {
      const playlist_15 = await ensureManualPlaylist(),
        updatedAt_2 = Date.now(),
        track_18 = {
          id: uid("track"),
          playlistId: playlist_15.id,
          source: "url",
          name: name_3,
          artist: artist_2,
          mediaUrl: mediaUrl_3,
          coverUrl: coverUrl_2,
          lyricUrl: lyricUrl_2,
          available: true,
          createdAt: updatedAt_2,
          updatedAt: updatedAt_2
        };
      playlist_15.trackIds = [...(playlist_15.trackIds || []), track_18.id];
      playlist_15.coverUrl = playlist_15.coverUrl || coverUrl_2;
      playlist_15.updatedAt = updatedAt_2;
      await storage().saveLibraryPlaylistBundle(playlist_15, [track_18]);
      state.tracks.push(track_18);
      handleAction_147();
      dom.track_form.reset();
      closeAllModals();
      toast("歌曲已添加到我的歌单");
    } catch (error_9) {
      console.error("[Library] Track save failed:", error_9);
      toast("歌曲保存失败");
    }
  }
  function handleAction_150(value_980, value_981) {
    const text_16 = String(value_980 || ""),
      quoted = text_16.match(/(?:歌单|分享)\s*[《「“"]([^》」”"\n]{1,80})[》」”"]/);
    if (quoted) return quoted[1].trim();
    const byLine = text_16.match(/分享歌单[:：]\s*([^\n]{1,80})/);
    if (byLine) {
      const sharedName = byLine[1].replace(/https?:\/\/.*$/, "").trim();
      if (sharedName) return sharedName;
    }
    return "网易云歌单 " + String(value_981).slice(-6);
  }
  async function fetchJson(url_3, timeoutMs_2 = 25000) {
    const controller_2 = new AbortController(),
      timer = setTimeout(() => controller_2.abort(), timeoutMs_2);
    try {
      const response = await fetch(url_3, {
        signal: controller_2.signal,
        mode: "cors",
        credentials: "omit"
      });
      if (!response.ok) {
        const error_10 = new Error("请求失败 (" + response.status + ")");
        error_10.httpStatus = response.status;
        throw error_10;
      }
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }
  function wait(ms_2) {
    return new Promise(resolve_7 => setTimeout(resolve_7, ms_2));
  }
  function extractNetEaseShareUrl(input) {
    const raw = String(input || "").trim();
    if (!raw) return "";
    const match_3 = raw.match(/https?:\/\/(?:(?:y\.)?music\.163\.com\/[^\s)）\]】}>]+|163cn\.tv\/+[a-zA-Z0-9]+)/i);
    return match_3 ? match_3[0].replace(/[.,，。!！?？;；:：'"”’]+$/g, "") : "";
  }
  function handleAction_152(resourceId_6) {
    const raw_2 = String(resourceId_6 || "").trim();
    if (!raw_2) return "";
    try {
      const url_4 = new URL(raw_2),
        result_999 = url_4.searchParams.get("id");
      if (/^\d+$/.test(result_999 || "")) return result_999;
      const hash_3 = String(url_4.hash || "").replace(/^#/, ""),
        hashQueryIndex = hash_3.indexOf("?");
      if (hashQueryIndex >= 0) {
        const hashId = new URLSearchParams(hash_3.slice(hashQueryIndex + 1)).get("id");
        if (/^\d+$/.test(hashId || "")) return hashId;
      }
      const pathMatch = url_4.pathname.match(/\/playlist\/(\d+)/i);
      if (pathMatch) return pathMatch[1];
    } catch (value_1004) {}
    const fallbackMatch = raw_2.match(/[?&#]id=(\d+)/i) || raw_2.match(/\/playlist\/(\d+)/i);
    return fallbackMatch ? fallbackMatch[1] : "";
  }
  async function handleAction_153(resourceId_7) {
    const raw_3 = String(resourceId_7 || "").trim();
    if (!raw_3) throw new Error("请粘贴网易云歌单链接");
    if (/^\d{5,}$/.test(raw_3)) return raw_3;
    let target_3 = extractNetEaseShareUrl(raw_3);
    if (!target_3) throw new Error("没有找到网易云歌单链接，请粘贴完整分享文字、歌单链接或歌单 ID");
    if (/^https?:\/\/163cn\.tv\/+/i.test(target_3)) {
      let result_4;
      try {
        result_4 = await fetchJson(NETEASE_REDIRECT_API + "?url=" + encodeURIComponent(target_3));
      } catch (value_1009) {
        if (value_1009?.name === "AbortError") throw value_1009;
        throw new Error("网易云短链接解析失败" + (value_1009?.message ? "：" + value_1009.message : ""));
      }
      if (result_4?.code !== 200 || !result_4.redirectUrl) throw new Error("网易云短链接解析失败，请尝试粘贴完整歌单链接");
      target_3 = String(result_4.redirectUrl).trim();
    }
    const playlistId_5 = handleAction_152(target_3);
    if (!playlistId_5) throw new Error("没有找到歌单 ID，请确认粘贴的是歌单链接");
    return playlistId_5;
  }
  function buildNetEaseMetingEndpoint_3(baseUrl, value_1011, value_1012 = "") {
    const separator = String(baseUrl).includes("?") ? "&" : "?",
      value_1014 = value_1012 ? "&_=" + encodeURIComponent(value_1012) : "";
    return "" + baseUrl + separator + "server=netease&type=playlist&id=" + encodeURIComponent(value_1011) + value_1014;
  }
  function isRetryableNetEasePlaylistError(error_11) {
    if (["NETEASE_EMPTY_RESPONSE", "NETEASE_INVALID_RESPONSE"].includes(error_11?.code)) return true;
    if (["AbortError", "SyntaxError", "TypeError"].includes(error_11?.name)) return true;
    const status_2 = Number(error_11?.httpStatus);
    return status_2 === 408 || status_2 === 425 || status_2 === 429 || status_2 >= 500;
  }
  function handleAction_155(error_12) {
    if (error_12?.code === "NETEASE_EMPTY_RESPONSE") return "接口返回空数组";
    if (error_12?.code === "NETEASE_INVALID_RESPONSE") return "接口返回格式异常" + (error_12.responseDescription ? " (" + error_12.responseDescription + ")" : "");
    if (error_12?.name === "AbortError") return "请求超时";
    return error_12?.message || "未知错误";
  }
  function describeJsonPayload(value_22) {
    if (value_22 === null) return "null";
    if (Array.isArray(value_22)) return "array:" + value_22.length;
    if (typeof value_22 === "object") {
      const keys_2 = Object.keys(value_22).slice(0, 8),
        message_3 = typeof value_22.message === "string" ? value_22.message.replace(/\s+/g, " ").slice(0, 120) : "";
      return "object:" + (keys_2.length ? keys_2.join(",") : "no-keys") + (message_3 ? ":" + message_3 : "");
    }
    return typeof value_22;
  }
  async function fetchNetEasePlaylistRows(playlistId_6) {
    let value_1022 = null;
    for (let attempt = 1; attempt <= NETEASE_PLAYLIST_MAX_ATTEMPTS; attempt += 1) {
      const cacheBust_3 = Date.now() + "-" + attempt,
        endpoint_4 = buildNetEaseMetingEndpoint_3(NETEASE_METING_API, playlistId_6, cacheBust_3);
      try {
        const rows = await fetchJson(endpoint_4, NETEASE_PLAYLIST_REQUEST_TIMEOUT);
        if (!Array.isArray(rows)) {
          const apiMessage = typeof rows?.message === "string" ? rows.message.trim().slice(0, 200) : "";
          if (apiMessage) {
            const error_13 = new Error("网易云歌单接口提示：" + apiMessage);
            error_13.code = "NETEASE_API_MESSAGE";
            throw error_13;
          }
          const error_14 = new Error("网易云歌单接口返回格式异常");
          error_14.code = "NETEASE_INVALID_RESPONSE";
          error_14.responseDescription = describeJsonPayload(rows);
          throw error_14;
        }
        if (rows.length === 0) {
          const error_15 = new Error("网易云歌单接口返回空数组");
          error_15.code = "NETEASE_EMPTY_RESPONSE";
          throw error_15;
        }
        return console.info("[Library] NetEase playlist " + playlistId_6 + ": attempt " + attempt + "/" + NETEASE_PLAYLIST_MAX_ATTEMPTS + ", " + rows.length + " rows"), rows;
      } catch (value_1031) {
        value_1022 = value_1031;
        const retryable = isRetryableNetEasePlaylistError(value_1031);
        console.warn("[Library] NetEase playlist " + playlistId_6 + ": attempt " + attempt + "/" + NETEASE_PLAYLIST_MAX_ATTEMPTS + " failed (" + handleAction_155(value_1031) + ")");
        if (!retryable || attempt === NETEASE_PLAYLIST_MAX_ATTEMPTS) break;
        await wait(NETEASE_PLAYLIST_RETRY_DELAYS[attempt - 1] || 0);
      }
    }
    if (value_1022?.code === "NETEASE_EMPTY_RESPONSE") throw new Error("网易云歌单接口连续 " + NETEASE_PLAYLIST_MAX_ATTEMPTS + " 次未返回歌曲，服务暂时异常或歌单当前不可访问");
    if (value_1022?.code === "NETEASE_INVALID_RESPONSE" || value_1022?.name === "SyntaxError") throw new Error("网易云歌单接口连续 " + NETEASE_PLAYLIST_MAX_ATTEMPTS + " 次返回格式异常，请稍后重试");
    if (value_1022?.name === "AbortError") throw new Error("网易云歌单接口连续 " + NETEASE_PLAYLIST_MAX_ATTEMPTS + " 次响应超时，请稍后重试");
    throw value_1022 || new Error("网易云歌单接口请求失败");
  }
  async function importNetEasePlaylist_2(value_1033) {
    const sourceId_2 = await handleAction_153(value_1033);
    let rows_2;
    try {
      rows_2 = await fetchNetEasePlaylistRows(sourceId_2);
    } catch (value_1041) {
      if (value_1041?.name === "AbortError") throw value_1041;
      throw new Error("网易云歌单读取失败" + (value_1041?.message ? "：" + value_1041.message : ""));
    }
    if (!Array.isArray(rows_2) || rows_2.length === 0) throw new Error("歌单为空、未公开或暂时无法解析");
    const updatedAt_4 = Date.now(),
      value_1037 = "netease_playlist_" + sourceId_2,
      tracks_7 = rows_2.map((row_2, value_1043) => {
        const sourceUrl_2 = safeHttpUrl(row_2?.url),
          songId_2 = String(row_2?.id || extractNetEaseResourceId(sourceUrl_2) || "").trim(),
          coverUrl_3 = safeHttpUrl(row_2?.pic || row_2?.cover),
          lyricUrl_3 = safeHttpUrl(row_2?.lrc || row_2?.lyric),
          handleAction_30_1048 = extractNetEaseResourceId(coverUrl_3),
          lyricId_2 = extractNetEaseResourceId(lyricUrl_3) || songId_2,
          id_12 = songId_2 ? "netease_track_" + sourceId_2 + "_" + songId_2 : "netease_track_" + sourceId_2 + "_" + value_1043;
        return normalizeNetEaseTrackResources({
          id: id_12,
          playlistId: value_1037,
          source: "netease",
          neteaseId: songId_2 || "",
          neteasePicId: handleAction_30_1048 || "",
          neteaseLyricId: lyricId_2 || "",
          name: String(row_2?.name || row_2?.title || "歌曲 " + (value_1043 + 1)).slice(0, 120),
          artist: String(row_2?.artist || row_2?.author || "未知歌手").slice(0, 120),
          mediaUrl: sourceUrl_2,
          coverUrl: coverUrl_3,
          lyricUrl: lyricUrl_3,
          available: !!sourceUrl_2,
          createdAt: updatedAt_4,
          updatedAt: updatedAt_4
        });
      });
    if (!tracks_7.some(track_19 => track_19.available)) throw new Error("歌单中没有可播放的歌曲");
    const playlist_1039 = getPlaylist(value_1037),
      playlist_16 = {
        id: value_1037,
        source: "netease",
        sourceId: sourceId_2,
        sourceUrl: "https://music.163.com/playlist?id=" + sourceId_2,
        name: playlist_1039?.name || handleAction_150(value_1033, sourceId_2),
        coverUrl: tracks_7.find(track_20 => track_20.coverUrl)?.coverUrl || "",
        trackIds: tracks_7.map(value_1053 => value_1053.id),
        createdAt: playlist_1039?.createdAt || updatedAt_4,
        updatedAt: updatedAt_4
      };
    return await storage().saveLibraryPlaylistBundle(playlist_16, tracks_7, {
      replaceTracks: true
    }), state.playlists = state.playlists.filter(value_1054 => value_1054.id !== playlist_16.id), state.playlists.push(playlist_16), state.tracks = state.tracks.filter(track_21 => track_21.playlistId !== playlist_16.id).concat(tracks_7), handleAction_147(), playlist_16;
  }
  async function handleImport_formSubmit(event_1056) {
    event_1056?.preventDefault();
    const input_2 = dom.netease_input.value.trim(),
      submit = dom.import_form.querySelector("[type=\"submit\"]");
    submit.disabled = true;
    submit.textContent = "正在读取歌单…";
    try {
      const value_1058 = await importNetEasePlaylist_2(input_2);
      dom.import_form.reset();
      closeAllModals();
      toast("已导入《" + value_1058.name + "》");
      openPlaylist(value_1058);
    } catch (error_16) {
      console.error("[Library] NetEase import failed:", error_16);
      toast(error_16?.name === "AbortError" ? "网易云服务响应超时，请稍后重试" : error_16?.message || "网易云歌单导入失败");
    } finally {
      submit.disabled = false;
      submit.textContent = "开始导入";
    }
  }
  function requestDeletePlaylist(playlist_17) {
    if (!playlist_17) return;
    const onConfirm_3 = async () => {
      const removingCurrent = state.currentTrack?.playlistId === playlist_17.id;
      removingCurrent && (audio.pause(), audio.removeAttribute("src"), state.currentTrack = null, state.queue = [], updatePlayerUi());
      await storage().deleteLibraryPlaylist(playlist_17.id);
      state.playlists = state.playlists.filter(value_1063 => value_1063.id !== playlist_17.id);
      state.tracks = state.tracks.filter(track_22 => track_22.playlistId !== playlist_17.id);
      closePlaylist();
      handleAction_147();
      toast("歌单已删除");
    };
    if (window.showCustomModal) window.showCustomModal({
      title: "删除歌单",
      message: "确定删除《" + playlist_17.name + "》及其中歌曲吗？",
      confirmText: "删除",
      isDestructive: true,
      onConfirm: onConfirm_3
    });else {
      if (window.confirm("确定删除《" + playlist_17.name + "》吗？")) onConfirm_3();
    }
  }
  function handleAction_161(text_17) {
    const lines = [];
    return String(text_17 || "").split(/\r?\n/).forEach(line_6 => {
      const tags = [...line_6.matchAll(/\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g)],
        text_18 = line_6.replace(/\[[^\]]+\]/g, "").trim();
      if (!text_18) return;
      tags.forEach(tag_2 => {
        const fractionRaw = tag_2[3] || "0",
          fraction = Number(fractionRaw) / (fractionRaw.length === 3 ? 1000 : 100);
        lines.push({
          time: Number(tag_2[1]) * 60 + Number(tag_2[2]) + fraction,
          text: text_18
        });
      });
    }), lines.sort((a, b) => a.time - b.time);
  }
  async function handleAction_162(track_23) {
    const requestId_2 = ++state.lyricsRequestId;
    state.lyrics = [];
    state.lyricIndex = -1;
    state.lyricsTrackId = track_23?.id || null;
    state.lyricsStatus = "loading";
    dom.lyrics.innerHTML = "<p class=\"active\">正在读取歌词…</p>";
    emitTogetherListeningChange(true);
    if (!track_23?.lyricUrl && !handleAction_27(track_23)) {
      state.lyricsStatus = "unavailable";
      dom.lyrics.innerHTML = "<p class=\"active\">这首歌暂时没有歌词</p>";
      emitTogetherListeningChange(true);
      return;
    }
    try {
      let text_1075 = "";
      if (handleAction_27(track_23)) {
        const value_1077 = await handleAction_28("/api/netease/songs/" + encodeURIComponent(track_23.neteaseId) + "/lyric");
        text_1075 = String(value_1077?.lyric || "");
      } else {
        const response_2 = await fetch(track_23.lyricUrl, {
          mode: "cors",
          credentials: "omit"
        });
        if (!response_2.ok) throw new Error("Lyric request failed");
        text_1075 = await response_2.text();
      }
      const lyrics_2 = handleAction_161(text_1075);
      if (requestId_2 !== state.lyricsRequestId || String(state.currentTrack?.id || "") !== String(track_23.id || "")) return;
      state.lyrics = lyrics_2;
      state.lyricsStatus = state.lyrics.length ? "ready" : "unavailable";
      dom.lyrics.innerHTML = state.lyrics.length ? state.lyrics.map((value_1079, value_1080) => "<p data-lyric-index=\"" + value_1080 + "\">" + escapeHtml(value_1079.text) + "</p>").join("") : "<p class=\"active\">这首歌暂时没有歌词</p>";
      updateLyrics(Number(audio.currentTime) || 0);
      emitTogetherListeningChange(true);
    } catch (error_17) {
      if (requestId_2 !== state.lyricsRequestId || String(state.currentTrack?.id || "") !== String(track_23?.id || "")) return;
      console.warn("[Library] Lyrics unavailable:", error_17);
      state.lyricsStatus = "error";
      dom.lyrics.innerHTML = "<p class=\"active\">歌词加载失败</p>";
      emitTogetherListeningChange(true);
    }
  }
  function handleAction_163(value_1082, behavior_2 = "smooth") {
    if (value_17 !== null) cancelAnimationFrame(value_17);
    value_17 = requestAnimationFrame(() => {
      value_17 = null;
      if (!state.playerShowsLyrics || state.lyricIndex !== value_1082) return;
      const querySelector_1084 = dom.lyrics.querySelector("[data-lyric-index=\"" + value_1082 + "\"]");
      if (!querySelector_1084) return;
      const top_2 = Math.max(0, querySelector_1084.offsetTop - dom.lyrics.clientHeight / 2);
      dom.lyrics.scrollTo({
        top: top_2,
        behavior: behavior_2
      });
    });
  }
  function setPlayerLyricsMode(showLyrics) {
    state.playerShowsLyrics = !!showLyrics;
    dom.player_stage.classList.toggle("is-lyrics", state.playerShowsLyrics);
    dom.lyrics.hidden = !state.playerShowsLyrics;
    dom.player_art.setAttribute("aria-label", state.playerShowsLyrics ? "显示封面" : "查看歌词");
    if (state.playerShowsLyrics && state.lyricIndex >= 0) handleAction_163(state.lyricIndex, "auto");else value_17 !== null && (cancelAnimationFrame(value_17), value_17 = null);
  }
  function updateLyrics(currentTime_3) {
    if (!state.lyrics.length) return;
    let nextIndex = -1;
    for (let index_6 = 0; index_6 < state.lyrics.length; index_6 += 1) {
      if (state.lyrics[index_6].time <= currentTime_3 + 0.05) nextIndex = index_6;else break;
    }
    if (nextIndex === state.lyricIndex) return;
    state.lyricIndex = nextIndex;
    dom.lyrics.querySelectorAll("p").forEach((line_7, index_7) => line_7.classList.toggle("active", index_7 === nextIndex));
    if (nextIndex >= 0 && state.playerShowsLyrics) handleAction_163(nextIndex);
  }
  function isNetEaseTrack(track_24) {
    return track_24?.source === "netease" && /^\d+$/.test(String(track_24.neteaseId || ""));
  }
  async function handleAction_164(track_25, value_1093) {
    if (handleAction_27(track_25)) {
      const cacheKey_2 = String(track_25.neteaseId),
        html_4 = readerChunkHtmlCache_3.get(cacheKey_2);
      if (html_4?.expiresAt > Date.now() && safeHttpUrl(html_4.url)) return html_4.url;
      const value_1096 = await handleAction_28("/api/netease/songs/" + encodeURIComponent(track_25.neteaseId) + "/url?level=exhigh"),
        value_1097 = value_1096?.song || {},
        url_6 = safeHttpUrl(value_1097.url);
      if (!url_6) {
        const options_1099 = {
            vip_required: "这首歌需要当前网易云账号具备会员权限",
            trial_only: "这首歌当前只能试听",
            unavailable: "这首歌因版权、地区或下架原因无法播放"
          },
          value_1100 = new Error(options_1099[value_1097.reason] || "网易云没有返回可播放地址");
        value_1100.code = String(value_1097.reason || "PLAYBACK_UNAVAILABLE").toUpperCase();
        throw value_1100;
      }
      return readerChunkHtmlCache_3.set(cacheKey_2, {
        url: url_6,
        expiresAt: Date.now() + 240000
      }), url_6;
    }
    if (isNetEaseTrack(track_25)) return buildNetEaseResourceUrl("url", track_25.neteaseId, Date.now() + "-" + value_1093);
    return safeHttpUrl(track_25?.mediaUrl);
  }
  function finishPlaybackFailure(value_1101, error_18) {
    state.pendingPlayStatTrackId = null;
    console.warn("[Library] Playback failed:", error_18);
    toast(error_18?.message || "当前歌曲暂时无法播放");
    updatePlayerUi();
    emitTogetherListeningChange(true);
  }
  async function handleAction_166(track_26) {
    const attemptId_2 = state.playbackAttemptId + 1;
    state.playbackAttemptId = attemptId_2;
    state.playbackStartingAttemptId = attemptId_2;
    let src_2 = "";
    try {
      src_2 = await handleAction_164(track_26, attemptId_2);
    } catch (value_1106) {
      return finishPlaybackFailure(track_26, value_1106), false;
    }
    if (!src_2) return finishPlaybackFailure(track_26, new Error("歌曲没有有效的播放地址")), false;
    audio.src = src_2;
    audio.load();
    try {
      return await audio.play(), attemptId_2 === state.playbackAttemptId && state.currentTrack?.id === track_26.id;
    } catch (value_1107) {
      if (attemptId_2 !== state.playbackAttemptId || state.currentTrack?.id !== track_26.id) return false;
      const value_1108 = (isNetEaseTrack(track_26) || handleAction_27(track_26)) && state.neteasePlaybackRetryCount < 1 && value_1107?.name !== "NotAllowedError";
      if (value_1108) {
        state.neteasePlaybackRetryCount += 1;
        if (handleAction_27(track_26)) readerChunkHtmlCache_3["delete"](String(track_26.neteaseId));
        return console.warn("[Library] NetEase playback retry " + state.neteasePlaybackRetryCount + "/1 for track " + track_26.neteaseId), handleAction_166(track_26);
      }
      return finishPlaybackFailure(track_26, value_1107), false;
    } finally {
      if (state.playbackStartingAttemptId === attemptId_2) state.playbackStartingAttemptId = 0;
    }
  }
  async function playTrack(track_27, queue_3) {
    if (!isPlayableTrack(track_27)) {
      if (handleAction_27(track_27) && !handleAction_25()) {
        toast("请先扫码登录网易云音乐");
        startNetEaseQrLogin_2();
      } else toast("这首歌暂时无法播放");
      return;
    }
    handleAction_170()["catch"](console.error);
    if (Array.isArray(queue_3) && queue_3.length) state.queue = queue_3.filter(id_11 => !!getTrack(id_11));
    if (!state.queue.includes(track_27.id)) state.queue = [track_27.id];
    state.queueIndex = state.queue.indexOf(track_27.id);
    state.currentTrack = track_27;
    state.lastMediaTime = 0;
    state.neteasePlaybackRetryCount = 0;
    state.pendingPlayStatTrackId = track_27.id;
    updatePlayerUi();
    emitTogetherListeningChange(true);
    handleAction_162(track_27);
    await handleAction_166(track_27);
  }
  function playQueueDirection(direction) {
    if (!state.queue.length) return;
    const total_2 = state.queue.length;
    for (let step = 1; step <= total_2; step += 1) {
      const queueIndex_2 = (state.queueIndex + direction * step + total_2) % total_2,
        track_28 = getTrack(state.queue[queueIndex_2]);
      if (isPlayableTrack(track_28)) {
        state.queueIndex = queueIndex_2;
        playTrack(track_28, state.queue);
        return;
      }
    }
    toast("歌单中没有可播放的歌曲");
  }
  function togglePlayback() {
    if (!state.currentTrack) {
      const first = state.tracks.find(isPlayableTrack);
      if (first) playTrack(first, [first.id]);else toast("还没有可播放的歌曲");
      return;
    }
    if (audio.paused) audio.play()["catch"](value_1118 => {
      if (handleAction_27(state.currentTrack)) {
        readerChunkHtmlCache_3["delete"](String(state.currentTrack.neteaseId));
        state.neteasePlaybackRetryCount = 0;
        handleAction_166(state.currentTrack);
      } else toast(value_1118?.message || "当前歌曲暂时无法播放");
    });else audio.pause();
  }
  function openPlayer() {
    if (!state.currentTrack) return;
    dom.player_view.classList.add("active");
    dom.player_view.setAttribute("aria-hidden", "false");
  }
  function handlePlayer_closeClick() {
    dom.player_view.classList.remove("active");
    dom.player_view.setAttribute("aria-hidden", "true");
    state.playerReturnToChatFriendId && (state.playerReturnToChatFriendId = null, dom.view.classList.remove("active"), setLibraryViewHidden(true), $("imessage-view")?.classList.add("active"));
  }
  function handleAction_169() {
    const duration_3 = Number.isFinite(audio.duration) ? audio.duration : 0,
      current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
      ratio_3 = duration_3 > 0 ? current / duration_3 : 0;
    dom.player_progress.value = String(Math.round(ratio_3 * 1000));
    dom.player_current.textContent = formatClock(current);
    dom.player_duration.textContent = formatClock(duration_3);
    dom.mini_progress.style.setProperty("--mini-progress", Math.max(0, Math.min(100, ratio_3 * 100)) + "%");
  }
  function updatePlayerUi() {
    const track_29 = state.currentTrack,
      hasTrack = !!track_29;
    dom.mini_player.hidden = !hasTrack;
    dom.view.classList.toggle("has-mini-player", hasTrack);
    if (!hasTrack) return;
    dom.mini_title.textContent = track_29.name || "未知歌曲";
    dom.mini_artist.textContent = track_29.artist || "未知歌手";
    dom.player_title.textContent = track_29.name || "未知歌曲";
    dom.player_artist.textContent = track_29.artist || "未知歌手";
    setArtwork(dom.mini_art, track_29.coverUrl);
    setArtwork(dom.player_art, track_29.coverUrl);
    const safeHttpUrl_1124 = safeHttpUrl(track_29.coverUrl);
    dom.player_wash.style.backgroundImage = safeHttpUrl_1124 ? "linear-gradient(rgba(229,234,230,.45),rgba(245,243,237,.82)),url(\"" + safeHttpUrl_1124.replace(/"/g, "%22") + "\")" : "";
    dom.player_wash.style.backgroundSize = "cover";
    dom.player_wash.style.backgroundPosition = "center";
    const icon = audio.paused ? "fa-play" : "fa-pause";
    dom.mini_play.innerHTML = "<i class=\"fas " + icon + "\"></i>";
    dom.player_play.innerHTML = "<i class=\"fas " + icon + "\"></i>";
    handleAction_169();
  }
  async function handleAction_170() {
    const seconds_6 = state.pendingListeningSeconds,
      track_30 = state.currentTrack;
    if (!track_30 || seconds_6 <= 0) return;
    state.pendingListeningSeconds = 0;
    await storage().incrementLibraryDailyStat({
      date: localDateKey(),
      kind: "listening",
      itemId: track_30.id,
      seconds: seconds_6
    });
  }
  async function renderOverview() {
    try {
      state.stats = await storage().loadLibraryDailyStats();
    } catch (error_19) {
      console.error("[Library] Stats load failed:", error_19);
    }
    const days = lastSevenDays(),
      today = localDateKey(),
      sum = (kind_2, date_4) => state.stats.filter(row => row.kind === kind_2 && (!date_4 || row.date === date_4)).reduce((total, row_3) => total + (Number(row_3.seconds) || 0), 0),
      todayReading = sum("reading", today),
      todayListening = sum("listening", today);
    dom.today_reading.textContent = formatDuration(todayReading);
    dom.today_listening.textContent = formatDuration(todayListening);
    const values = days.map(day_3 => ({
        ...day_3,
        reading: sum("reading", day_3.key),
        listening: sum("listening", day_3.key)
      })),
      max_3 = Math.max(60, ...values.flatMap(item_8 => [item_8.reading, item_8.listening])),
      weekTotal = values.reduce((total_3, item_9) => total_3 + item_9.reading + item_9.listening, 0);
    dom.week_total.textContent = formatDuration(weekTotal);
    dom.week_chart.innerHTML = values.map(item_10 => "\n            <div class=\"library-chart-day\">\n                <div class=\"library-chart-bars\">\n                    <i class=\"library-chart-bar\" style=\"height:" + Math.max(3, item_10.reading / max_3 * 100) + "%\" title=\"阅读 " + escapeHtml(formatDuration(item_10.reading, true)) + "\"></i>\n                    <i class=\"library-chart-bar listening\" style=\"height:" + Math.max(3, item_10.listening / max_3 * 100) + "%\" title=\"听歌 " + escapeHtml(formatDuration(item_10.listening, true)) + "\"></i>\n                </div>\n                <small>" + (item_10.key === today ? "今" : item_10.label) + "</small>\n            </div>").join("");
    handleAction_172();
  }
  function handleAction_172() {
    const range_2 = state.preferences.rankingRange === "all" ? "all" : "week",
      weekKeys = new Set(lastSevenDays().map(day_4 => day_4.key)),
      totals = new Map();
    state.stats.forEach(row_4 => {
      if (row_4.kind !== "play" || range_2 === "week" && !weekKeys.has(row_4.date)) return;
      totals.set(row_4.itemId, (totals.get(row_4.itemId) || 0) + (Number(row_4.count) || 0));
    });
    const ranked = [...totals.entries()].map(([trackId_6, count_3]) => ({
      track: getTrack(trackId_6),
      count: count_3
    })).filter(item_11 => item_11.track && item_11.count > 0).sort((a_3, b_3) => b_3.count - a_3.count || String(a_3.track.name || "").localeCompare(String(b_3.track.name || ""), "zh-CN")).slice(0, 8);
    dom.ranking_list.innerHTML = ranked.length ? ranked.map((item_12, value_1154) => "\n            <div class=\"library-ranking-row\">\n                <b>" + String(value_1154 + 1).padStart(2, "0") + "</b>\n                <span class=\"library-track-art\">" + (safeHttpUrl(item_12.track.coverUrl) ? "<img src=\"" + escapeHtml(safeHttpUrl(item_12.track.coverUrl)) + "\" alt=\"\" referrerpolicy=\"no-referrer\">" : "<i class=\"fas fa-music\"></i>") + "</span>\n                <div><strong>" + escapeHtml(item_12.track.name) + "</strong><small>" + escapeHtml(item_12.track.artist) + "</small></div>\n                <span>" + item_12.count + "次</span>\n            </div>").join("") : "<div class=\"library-ranking-empty\">开始播放歌曲后，这里会出现你的排行。</div>";
    dom.view.querySelectorAll("[data-range]").forEach(button_4 => {
      button_4.classList.toggle("active", button_4.dataset.range === range_2);
    });
  }
  function handleAction_173() {
    const selectAtClientX = clientX_2 => {
      const rect_3 = dom.floating_nav.getBoundingClientRect(),
        ratio_4 = Math.max(0, Math.min(0.999, (clientX_2 - rect_3.left) / rect_3.width));
      switchTab(TABS[Math.floor(ratio_4 * 3)], false);
    };
    dom.floating_nav.addEventListener("click", event_6 => {
      const button_5 = event_6.target.closest("[data-library-tab]");
      if (button_5) switchTab(button_5.dataset.libraryTab);
    });
    dom.floating_nav.addEventListener("pointerdown", event_7 => {
      state.navDragging = true;
      state.navPointerId = event_7.pointerId;
      dom.floating_nav.setPointerCapture?.(event_7.pointerId);
    });
    dom.floating_nav.addEventListener("pointermove", event_8 => {
      if (!state.navDragging || state.navPointerId !== event_8.pointerId) return;
      selectAtClientX(event_8.clientX);
    });
    const endDrag = event_9 => {
      if (state.navPointerId !== null && event_9.pointerId !== state.navPointerId) return;
      state.navDragging = false;
      state.navPointerId = null;
      savePreferences()["catch"](console.error);
    };
    dom.floating_nav.addEventListener("pointerup", endDrag);
    dom.floating_nav.addEventListener("pointercancel", endDrag);
    dom.floating_nav.addEventListener("mousedown", () => {
      state.navMouseDragging = true;
    });
    dom.floating_nav.addEventListener("mousemove", event_10 => {
      if (!state.navMouseDragging || event_10.buttons !== 1) return;
      selectAtClientX(event_10.clientX);
    });
    document.addEventListener("mouseup", () => {
      if (!state.navMouseDragging) return;
      state.navMouseDragging = false;
      savePreferences()["catch"](console.error);
    });
  }
  function handleAction_174() {
    $("app-phone-btn")?.addEventListener("click", () => openApp());
    dom.back_btn.addEventListener("click", close_2);
    dom.header_action.addEventListener("click", () => {
      if (state.activeTab === "books") dom.book_file_input.click();else {
        if (state.activeTab === "music") openModal(dom.track_modal);
      }
    });
    dom.book_upload_btn.addEventListener("click", () => dom.book_file_input.click());
    dom.books_empty.addEventListener("click", event_11 => {
      if (event_11.target.closest("[data-library-action=\"upload-book\"]")) dom.book_file_input.click();
    });
    dom.book_file_input.addEventListener("change", () => importBook(dom.book_file_input.files?.[0]));
    dom.book_grid.addEventListener("click", event_12 => {
      const card = event_12.target.closest("[data-book-id]"),
        action_4 = event_12.target.closest("[data-book-action]")?.dataset.bookAction;
      if (!card || !action_4) return;
      const book_14 = state.books.find(item_13 => item_13.id === card.dataset.bookId);
      if (action_4 === "details") openBookDetail(book_14);
    });
    dom.book_detail_start.addEventListener("click", () => {
      const book_15 = state.detailBook;
      if (!book_15) return;
      closeAllModals();
      openReaderAsync(book_15);
    });
    dom.book_detail_edit.addEventListener("click", () => setBookDetailEditing(true));
    dom.book_detail_delete.addEventListener("click", () => requestDeleteBook(state.detailBook));
    dom.book_edit_cancel.addEventListener("click", () => {
      renderBookDetail();
      setBookDetailEditing(false);
    });
    dom.book_edit_form.addEventListener("submit", handleBook_edit_formSubmit);
    dom.reader_back.addEventListener("click", closeReader);
    dom.reader_comment_action.addEventListener("pointerdown", event_1172 => event_1172.preventDefault());
    dom.reader_comment_action.addEventListener("click", handleReader_comment_actionClick);
    dom.reader_comments_close.addEventListener("click", handleReader_comments_closeClick);
    dom.reader_comments_backdrop.addEventListener("click", event_1173 => {
      if (event_1173.target === dom.reader_comments_backdrop) handleReader_comments_closeClick();
    });
    dom.reader_content.addEventListener("click", event_1174 => {
      const closest_1175 = event_1174.target.closest("[data-library-annotation-id]");
      if (!closest_1175) return;
      event_1174.preventDefault();
      event_1174.stopPropagation();
      const togetherListeningEventTimer_2 = handleAction_69().find(value_1177 => String(value_1177.id) === String(closest_1175.dataset.libraryAnnotationId));
      if (togetherListeningEventTimer_2) handleAction_77(togetherListeningEventTimer_2);
    });
    dom.reader_content.addEventListener("keydown", event_1178 => {
      if (event_1178.key !== "Enter" && event_1178.key !== " ") return;
      const closest_1179 = event_1178.target.closest("[data-library-annotation-id]");
      if (!closest_1179) return;
      event_1178.preventDefault();
      const togetherListeningEventTimer_3 = handleAction_69().find(value_1181 => String(value_1181.id) === String(closest_1179.dataset.libraryAnnotationId));
      if (togetherListeningEventTimer_3) handleAction_77(togetherListeningEventTimer_3);
    });
    dom.reader_together.addEventListener("click", () => {
      if (state.together) stopTogether();else openCharPicker();
    });
    dom.char_picker_list.addEventListener("click", event_13 => {
      const button_6 = event_13.target.closest("[data-library-char-id]");
      if (!button_6) return;
      const friend_11 = (window.imData?.friends || []).find(item_14 => String(item_14.id) === String(button_6.dataset.libraryCharId));
      startTogether(friend_11);
    });
    $("imessage-view")?.addEventListener("click", event_14 => {
      if (!state.together) return;
      if (event_14.target.closest(".chat-back-btn")) {
        event_14.preventDefault();
        event_14.stopImmediatePropagation();
        collapseTogetherPopup();
        return;
      }
      event_14.target.closest(".chat-call-btn, .chat-menu-btn") && (event_14.preventDefault(), event_14.stopImmediatePropagation(), toast("一起看模式下暂不支持电话和聊天设置"));
    }, true);
    dom.reader_settings.addEventListener("click", () => {
      dom.reader_toc.hidden = true;
      dom.reader_panel.hidden = !dom.reader_panel.hidden;
    });
    dom.reader_toc_button.addEventListener("click", () => {
      dom.reader_panel.hidden = true;
      dom.reader_toc.hidden = !dom.reader_toc.hidden;
    });
    dom.reader_toc_close.addEventListener("click", () => {
      dom.reader_toc.hidden = true;
    });
    dom.reader_toc_list.addEventListener("click", event_15 => {
      const button_7 = event_15.target.closest("[data-chapter-offset]");
      if (!button_7) return;
      const textLength_2 = Math.max(1, state.readerContent?.text?.length || 1),
        offset_5 = clampReaderValue(Number(button_7.dataset.chapterOffset) || 0, 0, textLength_2);
      dom.reader_toc.hidden = true;
      restoreReaderProgress(offset_5 / textLength_2);
      updateReaderProgress(true, state.readerPage);
      markReaderActivity();
    });
    dom.reader_panel.addEventListener("click", event_16 => {
      const font = event_16.target.closest("[data-reader-font]"),
        line_8 = event_16.target.closest("[data-reader-line]"),
        theme_2 = event_16.target.closest("[data-reader-theme]"),
        progress_7 = state.currentBook ? Number(state.currentBook.progress) || 0 : 0;
      if (font) state.preferences.readerFontSize = (Number(state.preferences.readerFontSize) || 18) + Number(font.dataset.readerFont);
      if (line_8) state.preferences.readerLineHeight = (Number(state.preferences.readerLineHeight) || 1.85) + Number(line_8.dataset.readerLine) * 0.15;
      if (theme_2) state.preferences.readerTheme = theme_2.dataset.readerTheme;
      handleAction_58();
      if (state.currentBook) requestAnimationFrame(() => restoreReaderProgress(progress_7));else updateReaderProgress(false);
      savePreferences()["catch"](console.error);
    });
    dom.reader_scroll.addEventListener("pointerdown", handleReader_scrollPointerdown, {
      passive: true
    });
    dom.reader_scroll.addEventListener("pointerup", handleReader_scrollPointerup, {
      passive: true
    });
    dom.reader_scroll.addEventListener("pointercancel", handleReader_scrollPointercancel, {
      passive: true
    });
    dom.reader_scroll.addEventListener("touchstart", handleReader_scrollTouchstart, {
      passive: true
    });
    dom.reader_scroll.addEventListener("touchend", handleReader_scrollTouchend, {
      passive: true
    });
    dom.reader_scroll.addEventListener("touchcancel", handleReader_scrollTouchcancel, {
      passive: true
    });
    ["pointerdown", "touchstart"].forEach(eventName => dom.reader_view.addEventListener(eventName, markReaderActivity, {
      passive: true
    }));
    document.addEventListener("selectionchange", () => requestAnimationFrame(handleAction_76));
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", repaginateReaderAtCurrentProgress);
    window.addEventListener("resize", () => saveReaderProgress_2());
    dom.import_netease_btn.addEventListener("click", () => openModal(dom.import_modal));
    dom.netease_login_btn.addEventListener("click", startNetEaseQrLogin_2);
    dom.netease_refresh_btn.addEventListener("click", () => syncNetEaseAccountLibrary_2());
    dom.netease_logout_btn.addEventListener("click", () => logoutNetEaseAccount_2()["catch"](console.error));
    dom.netease_qr_retry.addEventListener("click", startNetEaseQrLogin_2);
    dom.netease_qr_save.addEventListener("click", () => handleAction_136()["catch"](console.error));
    dom.netease_qr_check.addEventListener("click", () => {
      handleAction_129();
      void handleAction_139();
    });
    dom.music_add_btn.addEventListener("click", () => openModal(dom.track_modal));
    dom.add_track_btn.addEventListener("click", () => openModal(dom.track_modal));
    dom.import_form.addEventListener("submit", handleImport_formSubmit);
    dom.track_form.addEventListener("submit", handleTrack_formSubmit);
    dom.view.querySelectorAll("[data-close-library-modal]").forEach(button_8 => button_8.addEventListener("click", closeAllModals));
    [dom.import_modal, dom.track_modal, dom.book_detail_modal, dom.char_picker_modal].forEach(modal_3 => modal_3.addEventListener("click", event_17 => {
      if (event_17.target === modal_3) closeAllModals();
    }));
    dom.playlist_list.addEventListener("click", event_18 => {
      const card_2 = event_18.target.closest("[data-playlist-id]");
      if (card_2) openPlaylist(getPlaylist(card_2.dataset.playlistId));
    });
    dom.playlist_back.addEventListener("click", closePlaylist);
    dom.playlist_delete.addEventListener("click", () => requestDeletePlaylist(state.currentPlaylist));
    dom.play_all.addEventListener("click", () => {
      const tracks_8 = playlistTracks(state.currentPlaylist).filter(isPlayableTrack);
      if (tracks_8.length) playTrack(tracks_8[0], tracks_8.map(track_31 => track_31.id));else toast("歌单中没有可播放的歌曲");
    });
    dom.track_list.addEventListener("click", event_19 => {
      const row_5 = event_19.target.closest("[data-track-id]");
      if (!row_5) return;
      const tracks_9 = playlistTracks(state.currentPlaylist);
      playTrack(getTrack(row_5.dataset.trackId), tracks_9.map(track_32 => track_32.id));
    });
    dom.mini_open.addEventListener("click", openPlayer);
    dom.mini_play.addEventListener("click", togglePlayback);
    dom.mini_next.addEventListener("click", () => playQueueDirection(1));
    dom.player_close.addEventListener("click", handlePlayer_closeClick);
    dom.player_art.addEventListener("click", () => setPlayerLyricsMode(true));
    dom.lyrics.addEventListener("click", () => setPlayerLyricsMode(false));
    dom.player_play.addEventListener("click", togglePlayback);
    dom.player_prev.addEventListener("click", () => playQueueDirection(-1));
    dom.player_next.addEventListener("click", () => playQueueDirection(1));
    dom.player_progress.addEventListener("pointerdown", () => {
      state.isSeeking = true;
    });
    dom.player_progress.addEventListener("input", () => {
      if (!Number.isFinite(audio.duration)) return;
      const next_3 = Number(dom.player_progress.value) / 1000 * audio.duration;
      dom.player_current.textContent = formatClock(next_3);
    });
    dom.player_progress.addEventListener("change", () => {
      if (Number.isFinite(audio.duration)) audio.currentTime = Number(dom.player_progress.value) / 1000 * audio.duration;
      state.lastMediaTime = audio.currentTime;
      state.isSeeking = false;
    });
    dom.view.querySelectorAll("[data-range]").forEach(button_9 => button_9.addEventListener("click", () => {
      state.preferences.rankingRange = button_9.dataset.range;
      savePreferences()["catch"](console.error);
      handleAction_172();
    }));
    handleAction_173();
    audio.addEventListener("play", () => {
      updatePlayerUi();
      emitTogetherListeningChange(true);
      if (state.currentTrack && state.pendingPlayStatTrackId === state.currentTrack.id) {
        const itemId_2 = state.currentTrack.id;
        state.pendingPlayStatTrackId = null;
        storage().incrementLibraryDailyStat({
          date: localDateKey(),
          kind: "play",
          itemId: itemId_2,
          count: 1
        })["catch"](error_20 => {
          console.error("[Library] Play count update failed:", error_20);
        });
      }
    });
    audio.addEventListener("pause", () => {
      updatePlayerUi();
      emitTogetherListeningChange(true);
      handleAction_170()["catch"](console.error);
    });
    audio.addEventListener("loadedmetadata", () => {
      state.lastMediaTime = audio.currentTime || 0;
      updatePlayerUi();
      emitTogetherListeningChange(true);
    });
    audio.addEventListener("seeking", () => {
      state.isSeeking = true;
    });
    audio.addEventListener("seeked", () => {
      state.lastMediaTime = audio.currentTime || 0;
      state.isSeeking = false;
      updateLyrics(audio.currentTime || 0);
      emitTogetherListeningChange(true);
    });
    audio.addEventListener("timeupdate", () => {
      const lastMediaTime_2 = Number(audio.currentTime) || 0,
        pendingListeningSeconds_2 = lastMediaTime_2 - state.lastMediaTime;
      if (!state.isSeeking && !audio.paused && pendingListeningSeconds_2 > 0 && pendingListeningSeconds_2 <= 5) {
        state.pendingListeningSeconds += pendingListeningSeconds_2;
        if (state.pendingListeningSeconds >= 15) handleAction_170()["catch"](console.error);
      }
      state.lastMediaTime = lastMediaTime_2;
      handleAction_169();
      updateLyrics(lastMediaTime_2);
      emitTogetherListeningChange(false);
    });
    audio.addEventListener("ended", () => {
      handleAction_170()["catch"](console.error);
      playQueueDirection(1);
    });
    audio.addEventListener("error", () => {
      if (!state.currentTrack || !audio.src) return;
      if (state.playbackStartingAttemptId === state.playbackAttemptId) return;
      if (handleAction_27(state.currentTrack) && state.neteasePlaybackRetryCount < 1 && handleAction_25()) {
        state.neteasePlaybackRetryCount += 1;
        readerChunkHtmlCache_3["delete"](String(state.currentTrack.neteaseId));
        handleAction_166(state.currentTrack);
        return;
      }
      toast("当前歌曲暂时无法播放");
      updatePlayerUi();
      emitTogetherListeningChange(true);
    });
    window.addEventListener("pagehide", () => {
      handleAction_129();
      if (state.currentBook) updateReaderProgress(true, null, {
        immediate: true
      });else flushReaderProgressSave()["catch"](console.error);
      handleAction_91()["catch"](console.error);
      handleAction_170()["catch"](console.error);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        handleAction_129();
        if (state.currentBook) updateReaderProgress(true, null, {
          immediate: true
        });else flushReaderProgressSave()["catch"](console.error);
        handleAction_91()["catch"](console.error);
        handleAction_170()["catch"](console.error);
      } else handlePageshow();
    });
    window.addEventListener("pageshow", handlePageshow);
  }
  function handleAction_175() {
    setInterval(() => {
      const readingActive = !!state.currentBook && dom.reader_view.classList.contains("active") && !document.hidden && Date.now() - state.readerLastActivityAt <= 60000;
      if (readingActive) {
        state.pendingReadingSeconds += 5;
        if (state.pendingReadingSeconds >= 15) handleAction_91()["catch"](console.error);
      }
    }, 5000);
  }
  async function init() {
    handleAction_22();
    if (!dom.view) return;
    setLibraryViewHidden(!dom.view.classList.contains("active"));
    try {
      await handleAction_38();
      renderBooks();
      handleAction_147();
      handleAction_127();
      switchTab(state.activeTab, false);
      handleAction_174();
      handleAction_175();
      updatePlayerUi();
      setPlayerLyricsMode(false);
      updateTogetherControls();
      state.ready = true;
    } catch (error_21) {
      console.error("[Library] Initialization failed:", error_21);
      toast("Library 初始化失败");
    }
  }
  window.libraryApp = {
    open: resolve_8 => openApp(resolve_8),
    close: close_2,
    importNetEasePlaylist: importNetEasePlaylist_2,
    startNetEaseQrLogin: startNetEaseQrLogin_2,
    syncNetEaseAccountLibrary: syncNetEaseAccountLibrary_2,
    logoutNetEaseAccount: logoutNetEaseAccount_2,
    getTogetherReadingContext: getTogetherReadingContext_2,
    openTogetherListeningPicker: openTogetherListeningPicker_2,
    getTogetherListeningSnapshot: getTogetherListeningSnapshot_2,
    getTogetherListeningInvitationContext: getTogetherListeningInvitationContext_2,
    resolveTogetherListeningInvitation: resolveTogetherListeningInvitation_2,
    acceptTogetherListeningInvitation: acceptTogetherListeningInvitation_2,
    getTogetherListeningContext: getTogetherListeningContext_2,
    controlTogetherListening: controlTogetherListening_2,
    stopTogetherListening: stopTogetherListening_2,
    openTogetherListeningPlayer: openTogetherListeningPlayer_2
  };
  (window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(init);
})();
