(window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(() => {
  const avatarImg = document.getElementById("tk-profile-avatar-img"),
    avatarIcon = document.getElementById("tk-profile-avatar-icon"),
    statusBubble = document.getElementById("tk-profile-status-bubble"),
    nameEl = document.getElementById("tk-profile-name"),
    handleEl = document.getElementById("tk-profile-handle"),
    bioEl = document.getElementById("tk-profile-bio"),
    statFollowing = document.getElementById("tk-stat-following"),
    statFollowers = document.getElementById("tk-stat-followers"),
    statLikes = document.getElementById("tk-stat-likes"),
    editBtn = document.getElementById("tk-profile-edit-btn"),
    visitorsBtn = document.getElementById("tk-profile-visitors-btn"),
    profileSettingsBtn = document.getElementById("tk-profile-settings-btn"),
    profileBackBtn = document.getElementById("tk-profile-back-btn"),
    tkEditProfileSheetElement = document.getElementById("tk-edit-profile-sheet"),
    saveProfileBtn = document.getElementById("tk-save-profile-btn"),
    tiktokViewElement = document.getElementById("tiktok-view"),
    editCharSheet = document.getElementById("tk-edit-char-sheet"),
    subProfileEditTrigger = document.getElementById("tk-sub-profile-edit-trigger"),
    tkEditNameElement = document.getElementById("tk-edit-name"),
    tkEditHandleElement = document.getElementById("tk-edit-handle"),
    tkEditBioElement = document.getElementById("tk-edit-bio"),
    tkEditPersonaElement = document.getElementById("tk-edit-persona"),
    tkEditFollowingElement = document.getElementById("tk-edit-following"),
    tkEditFollowersElement = document.getElementById("tk-edit-followers"),
    tkEditLikesElement = document.getElementById("tk-edit-likes"),
    avatarBtn = document.getElementById("tk-profile-avatar-btn"),
    avatarUpload = document.getElementById("tk-profile-avatar-upload"),
    subProfileView = document.getElementById("tk-sub-profile-view"),
    subProfileBackBtn = document.getElementById("tk-sub-profile-back-btn"),
    subProfileAvatarImg = document.getElementById("tk-sub-profile-avatar-img"),
    subProfileAvatarIcon = document.getElementById("tk-sub-profile-avatar-icon"),
    subProfileStatusBubble = document.getElementById("tk-sub-profile-status-bubble"),
    subProfileName = document.getElementById("tk-sub-profile-name"),
    subProfileHandle = document.getElementById("tk-sub-profile-handle"),
    subStatFollowing = document.getElementById("tk-sub-stat-following"),
    subStatFollowers = document.getElementById("tk-sub-stat-followers"),
    subStatLikes = document.getElementById("tk-sub-stat-likes"),
    subProfileBio = document.getElementById("tk-sub-profile-bio"),
    subProfileFollowBtn = document.getElementById("tk-sub-profile-follow-btn"),
    subProfileMsgBtn = document.getElementById("tk-sub-profile-msg-btn"),
    subProfileApiBtn = document.getElementById("tk-sub-profile-api-btn"),
    tkSubProfileGridElement = document.getElementById("tk-sub-profile-grid");
  let currentSubCharId = null;
  function tkProfileFormatCount(value_2) {
    return window.tkFormatCount ? window.tkFormatCount(value_2) : String(value_2 || 0);
  }
  function tkProfileResolveAvatar(char) {
    if (!char) return "";
    return window.tkResolveAvatar ? window.tkResolveAvatar(char.id, char.name || char.handle, char.avatar) : char.avatar || "";
  }
  function tkProfileEscape(value_3) {
    return String(value_3 ?? "").replace(/[&<>"']/g, char_2 => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[char_2]);
  }
  function tkProfileToNumber(value_4) {
    const num = Number(value_4);
    return Number.isFinite(num) ? num : 0;
  }
  function handleAction_2(post) {
    const followerDelta_2 = Math.floor(Math.random() * 9) + 1,
      likeDelta_2 = Math.floor(Math.random() * 220) + 20;
    return tkState.profile.followers = tkProfileToNumber(tkState.profile.followers) + followerDelta_2, tkState.profile.likes = tkProfileToNumber(tkState.profile.likes) + likeDelta_2, post && (post.likes = tkProfileToNumber(post.likes) + likeDelta_2), {
      followerDelta: followerDelta_2,
      likeDelta: likeDelta_2
    };
  }
  function tkProfileGetBoundWorldBookIds() {
    if (!tkState.settings || typeof tkState.settings !== "object") tkState.settings = {};
    if (!Array.isArray(tkState.settings.boundWorldBookIds)) tkState.settings.boundWorldBookIds = [];
    return tkState.settings.boundWorldBookIds;
  }
  function tkProfileBoundWorldBookLabel() {
    const ids = new Set(tkProfileGetBoundWorldBookIds().map(id_2 => String(id_2)));
    if (!ids.size) return "未挂载";
    const books = typeof window.getWorldBooks === "function" ? window.getWorldBooks() : [],
      names = (Array.isArray(books) ? books : []).filter(book => book && ids.has(String(book.id))).map(book_2 => book_2.name || book_2.title || book_2.keyword || "世界书").filter(Boolean);
    if (!names.length) return ids.size + " 本";
    if (names.length <= 2) return names.join("、");
    return names.slice(0, 2).join("、") + " 等 " + names.length + " 本";
  }
  function tkProfileUpdateSettingsSheet(sheet) {
    const label = sheet?.querySelector("#tk-bound-worldbook-label");
    if (label) label.textContent = tkProfileBoundWorldBookLabel();
  }
  function tkEnsureProfileSettingsSheet() {
    let sheet_2 = document.getElementById("tk-profile-settings-sheet");
    if (sheet_2) return sheet_2;
    return sheet_2 = document.createElement("div"), sheet_2.id = "tk-profile-settings-sheet", sheet_2.className = "bottom-sheet-overlay detail-sheet-overlay", sheet_2.innerHTML = "\n            <div class=\"bottom-sheet\" style=\"background: #ffffff;\">\n                <div class=\"sheet-handle\"></div>\n                <div class=\"sheet-title\">TikTok 设置</div>\n                <div class=\"detail-sheet-content\" style=\"padding: 10px 16px 24px; background: #ffffff;\">\n                    <div class=\"settings-group fully-rounded\" style=\"margin:0;\">\n                        <div class=\"settings-item\" id=\"tk-bind-worldbook-btn\" style=\"border-bottom:none; cursor:pointer;\">\n                            <div class=\"settings-icon\" style=\"background-color:#1c1c1e;\"><i class=\"fas fa-book\"></i></div>\n                            <div class=\"settings-text\">挂载世界书</div>\n                            <div id=\"tk-bound-worldbook-label\" style=\"margin-left:auto; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#8e8e93; font-size:12px; text-align:right;\">未挂载</div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ", (document.getElementById("tiktok-view") || document.body).appendChild(sheet_2), sheet_2.addEventListener("click", event => {
      if (event.target === sheet_2) window.closeView(sheet_2);
    }), sheet_2.querySelector("#tk-bind-worldbook-btn")?.addEventListener("click", () => {
      if (typeof window.renderWorldBookSelector !== "function") {
        if (window.showToast) window.showToast("世界书选择器不可用");
        return;
      }
      window.renderWorldBookSelector(tkProfileGetBoundWorldBookIds(), selectedIds => {
        tkState.settings = tkState.settings || {};
        tkState.settings.boundWorldBookIds = Array.isArray(selectedIds) ? selectedIds.filter(Boolean).map(id_3 => String(id_3)) : [];
        if (window.tkPersistState) window.tkPersistState();
        tkProfileUpdateSettingsSheet(sheet_2);
        if (window.showToast) window.showToast("TikTok 世界书挂载已更新");
      });
    }), sheet_2;
  }
  function tkFormatVisitorTime(value_5) {
    const time = Number(value_5);
    if (!Number.isFinite(time) || time <= 0) return "刚刚访问";
    return new Date(time).toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  function handleAction_3(rawText) {
    if (window.tkParseAiJson) return window.tkParseAiJson(rawText);
    const raw = String(rawText || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    try {
      return JSON.parse(raw);
    } catch (error_2) {
      const start = Math.min(...[raw.indexOf("{"), raw.indexOf("[")].filter(index => index >= 0)),
        end = Math.max(raw.lastIndexOf("}"), raw.lastIndexOf("]"));
      if (!Number.isFinite(start) || start < 0 || end <= start) throw error_2;
      return JSON.parse(raw.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1"));
    }
  }
  function handleAction_4() {
    let sheet_3 = document.getElementById("tk-profile-visitors-sheet");
    if (sheet_3) return sheet_3;
    return sheet_3 = document.createElement("div"), sheet_3.id = "tk-profile-visitors-sheet", sheet_3.className = "bottom-sheet-overlay", sheet_3.innerHTML = "\n            <div class=\"bottom-sheet tk-visitors-sheet\">\n                <div class=\"sheet-handle\"></div>\n                <div class=\"sheet-title\">主页访客</div>\n                <div class=\"detail-sheet-content tk-visitors-list\" id=\"tk-profile-visitors-list\"></div>\n            </div>\n        ", (document.getElementById("tiktok-view") || document.body).appendChild(sheet_3), sheet_3.addEventListener("click", event_30 => {
      if (event_30.target === sheet_3) window.closeView(sheet_3);
    }), sheet_3;
  }
  function handleAction_5() {
    let sheet_4 = document.getElementById("tk-profile-visitor-thought-sheet");
    if (sheet_4) return sheet_4;
    return sheet_4 = document.createElement("div"), sheet_4.id = "tk-profile-visitor-thought-sheet", sheet_4.className = "bottom-sheet-overlay", sheet_4.innerHTML = "\n            <div class=\"bottom-sheet tk-visitor-thought-sheet\">\n                <div class=\"sheet-handle\"></div>\n                <div class=\"tk-visitor-thought-header\">\n                    <div class=\"tk-visitor-avatar tk-visitor-thought-avatar\" id=\"tk-visitor-thought-avatar\"></div>\n                    <div>\n                        <div class=\"tk-visitor-name\" id=\"tk-visitor-thought-name\">Visitor</div>\n                        <div class=\"tk-visitor-meta\" id=\"tk-visitor-thought-handle\">@visitor</div>\n                        <div class=\"tk-visitor-meta tk-visitor-thought-time\" id=\"tk-visitor-thought-time\">刚刚访问</div>\n                    </div>\n                </div>\n                <div class=\"tk-visitor-thought-text\" id=\"tk-visitor-thought-text\"></div>\n            </div>\n        ", (document.getElementById("tiktok-view") || document.body).appendChild(sheet_4), sheet_4.addEventListener("click", event_31 => {
      if (event_31.target === sheet_4) window.closeView(sheet_4);
    }), sheet_4;
  }
  function tkOpenVisitorThought(visitor_2) {
    const sheet_5 = handleAction_5(),
      avatarEl = sheet_5.querySelector("#tk-visitor-thought-avatar"),
      nameEl_2 = sheet_5.querySelector("#tk-visitor-thought-name"),
      handleEl_2 = sheet_5.querySelector("#tk-visitor-thought-handle"),
      timeEl = sheet_5.querySelector("#tk-visitor-thought-time"),
      textEl = sheet_5.querySelector("#tk-visitor-thought-text"),
      value_33 = visitor_2.avatar || "";
    avatarEl.innerHTML = value_33 ? "<img src=\"" + tkProfileEscape(value_33) + "\" alt=\"\">" : "<i class=\"fas fa-user\"></i>";
    nameEl_2.textContent = visitor_2.name || "Visitor";
    handleEl_2.textContent = "@" + (visitor_2.handle || visitor_2.id || "visitor");
    if (timeEl) timeEl.textContent = tkFormatVisitorTime(visitor_2.createdAt);
    textEl.textContent = visitor_2.thought || visitor_2.reason || "看完你的评论后，想来主页确认更多细节。";
    window.openView(sheet_5);
  }
  function handleAction_7() {
    const storedVisitors = tkState.profile && Array.isArray(tkState.profile.visitors) ? tkState.profile.visitors : [];
    return storedVisitors.filter(visitor => visitor && visitor.name).slice().sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0)).slice(0, 30).map(visitor_3 => ({
      ...visitor_3,
      avatar: window.tkResolveAvatar ? window.tkResolveAvatar(visitor_3.id, visitor_3.name, visitor_3.avatar) : visitor_3.avatar
    }));
    const seen = new Set(),
      visitors_2 = [],
      addVisitor = visitor_4 => {
        if (!visitor_4 || !visitor_4.name) return;
        const key = String(visitor_4.id || visitor_4.name);
        if (seen.has(key)) return;
        seen.add(key);
        visitors_2.push(visitor_4);
      };
    return (tkState.videos || []).forEach(value_37 => {
      (value_37.comments || []).forEach(comment => {
        const id_4 = comment.authorId || "visitor_" + comment.authorName;
        addVisitor({
          id: id_4,
          name: comment.authorName,
          handle: comment.authorName,
          avatar: window.tkResolveAvatar ? window.tkResolveAvatar(id_4, comment.authorName, comment.authorAvatar) : comment.authorAvatar,
          reason: "刚刚看过你的内容"
        });
      });
    }), (tkState.dms || []).forEach(dm => {
      const char_3 = window.tkGetChar(dm.charId);
      char_3 && addVisitor({
        id: char_3.id,
        name: char_3.name || char_3.handle,
        handle: char_3.handle || char_3.id,
        avatar: tkProfileResolveAvatar(char_3),
        reason: "来自私信互动"
      });
    }), (tkState.chars || []).filter(char_4 => char_4.isFollowed).forEach(char_5 => {
      addVisitor({
        id: char_5.id,
        name: char_5.name || char_5.handle,
        handle: char_5.handle || char_5.id,
        avatar: tkProfileResolveAvatar(char_5),
        reason: "关注了你的动态"
      });
    }), visitors_2.slice(0, 20);
  }
  window.tkOpenProfileVisitorsSheet = function () {
    const handleAction_4_44 = handleAction_4(),
      list = handleAction_4_44.querySelector("#tk-profile-visitors-list"),
      handleAction_7_45 = handleAction_7();
    !handleAction_7_45.length ? list.innerHTML = "<div class=\"tk-visitors-empty\">暂无访客</div>" : (list.innerHTML = handleAction_7_45.map(visitor_5 => "\n                <div class=\"tk-visitor-item\" data-id=\"" + tkProfileEscape(visitor_5.id) + "\" data-name=\"" + tkProfileEscape(visitor_5.name) + "\" data-handle=\"" + tkProfileEscape(visitor_5.handle || visitor_5.id || "user") + "\" data-avatar=\"" + tkProfileEscape(visitor_5.avatar) + "\" data-thought=\"" + tkProfileEscape(visitor_5.thought || visitor_5.reason || "") + "\" data-created-at=\"" + tkProfileEscape(visitor_5.createdAt || "") + "\">\n                    <div class=\"tk-visitor-avatar\">" + (visitor_5.avatar ? "<img src=\"" + tkProfileEscape(visitor_5.avatar) + "\" alt=\"\">" : "<i class=\"fas fa-user\"></i>") + "</div>\n                    <div class=\"tk-visitor-info\">\n                        <div class=\"tk-visitor-name\">" + tkProfileEscape(visitor_5.name || "User") + "</div>\n                        <div class=\"tk-visitor-meta\">@" + tkProfileEscape(visitor_5.handle || visitor_5.id || "user") + " · " + tkProfileEscape(visitor_5.reason || "访问了主页") + "</div>\n                    </div>\n                    <button type=\"button\" class=\"tk-visitor-delete-btn\" title=\"删除访客\"><i class=\"fas fa-chevron-right\"></i></button>\n                </div>\n            ").join(""), list.querySelectorAll(".tk-visitor-item").forEach(item => {
      item.addEventListener("click", event_2 => {
        if (event_2.target.closest(".tk-visitor-avatar")) return;
        if (event_2.target.closest(".tk-visitor-delete-btn")) return;
        tkOpenVisitorThought({
          id: item.dataset.id || "",
          name: item.dataset.name || "Visitor",
          handle: item.dataset.handle || "",
          avatar: item.dataset.avatar || "",
          thought: item.dataset.thought || "",
          createdAt: item.dataset.createdAt || ""
        });
        return;
        const id_5 = item.dataset.id || "visitor_" + Date.now(),
          name_4 = item.dataset.name || "User",
          avatar_2 = item.dataset.avatar || "";
        !window.tkGetChar(id_5) && window.tkSaveChar({
          id: id_5,
          name: name_4,
          handle: name_4.toLowerCase().replace(/\s+/g, "") || id_5,
          avatar: avatar_2,
          status: "",
          persona: "访问过主页的 " + name_4,
          isFollowed: false
        });
        window.closeView(handleAction_4_44);
        if (window.tkOpenSubProfile) window.tkOpenSubProfile(id_5);
      });
      const avatarBtn_2 = item.querySelector(".tk-visitor-avatar");
      avatarBtn_2 && avatarBtn_2.addEventListener("click", event_51 => {
        event_51.stopPropagation();
        const id_6 = item.dataset.id || "visitor_" + Date.now(),
          name_2 = item.dataset.name || "User",
          avatar_3 = item.dataset.avatar || "",
          handle_2 = item.dataset.handle || name_2.toLowerCase().replace(/\s+/g, "") || id_6;
        !window.tkGetChar(id_6) && window.tkSaveChar({
          id: id_6,
          name: name_2,
          handle: handle_2,
          avatar: avatar_3,
          status: "",
          persona: "访问过主页的 " + name_2,
          isFollowed: false
        });
        window.closeView(handleAction_4_44);
        if (window.tkOpenSubProfile) window.tkOpenSubProfile(id_6);
      });
      const deleteBtn = item.querySelector(".tk-visitor-delete-btn");
      deleteBtn && deleteBtn.addEventListener("click", event_56 => {
        event_56.stopPropagation();
        const id_7 = item.dataset.id || "",
          handle_3 = item.dataset.handle || "",
          name_3 = item.dataset.name || "";
        tkState.profile && Array.isArray(tkState.profile.visitors) && (tkState.profile.visitors = tkState.profile.visitors.filter(visitor_6 => {
          return String(visitor_6.id || "") !== String(id_7) && String(visitor_6.handle || "") !== String(handle_3) && String(visitor_6.name || "") !== String(name_3);
        }));
        if (window.tkPersistState) window.tkPersistState();
        window.tkOpenProfileVisitorsSheet();
      });
    }));
    window.openView(handleAction_4_44);
  };
  subProfileBackBtn && subProfileView && subProfileBackBtn.addEventListener("click", () => {
    subProfileView.classList.remove("active");
    currentSubCharId = null;
  });
  subProfileEditTrigger && subProfileEditTrigger.addEventListener("click", () => {
    if (currentSubCharId) {
      const tkCharSheetTitleElement = document.getElementById("tk-char-sheet-title");
      if (tkCharSheetTitleElement) tkCharSheetTitleElement.textContent = "编辑角色";
      const tkCharNameElement = document.getElementById("tk-char-name"),
        tkCharStatusElement = document.getElementById("tk-char-status"),
        tkCharPersonaElement = document.getElementById("tk-char-persona"),
        tkCharBioElement = document.getElementById("tk-char-bio"),
        tkCharFollowingElement = document.getElementById("tk-char-following"),
        tkCharFollowersElement = document.getElementById("tk-char-followers"),
        tkCharLikesElement = document.getElementById("tk-char-likes"),
        tkDeleteCharBtnElement = document.getElementById("tk-delete-char-btn"),
        tkCharAvatarImgElement = document.getElementById("tk-char-avatar-img"),
        tkCharAvatarPreviewIElement = document.querySelector("#tk-char-avatar-preview i"),
        tkGetChar_61 = window.tkGetChar(currentSubCharId);
      if (tkGetChar_61) {
        if (tkCharNameElement) tkCharNameElement.value = tkGetChar_61.name || "";
        if (tkCharStatusElement) tkCharStatusElement.value = tkGetChar_61.status || "";
        if (tkCharPersonaElement) tkCharPersonaElement.value = tkGetChar_61.persona || "";
        if (tkCharBioElement) tkCharBioElement.value = tkGetChar_61.bio || "";
        if (tkCharFollowingElement) tkCharFollowingElement.value = tkGetChar_61.following || 0;
        if (tkCharFollowersElement) tkCharFollowersElement.value = tkGetChar_61.followers || 0;
        if (tkCharLikesElement) tkCharLikesElement.value = tkGetChar_61.likes || 0;
        if (tkDeleteCharBtnElement) tkDeleteCharBtnElement.style.display = "block";
        const src_3 = tkProfileResolveAvatar(tkGetChar_61);
        if (src_3) {
          tkCharAvatarImgElement && (tkCharAvatarImgElement.src = src_3, tkCharAvatarImgElement.style.display = "block");
          if (tkCharAvatarPreviewIElement) tkCharAvatarPreviewIElement.style.display = "none";
        } else {
          tkCharAvatarImgElement && (tkCharAvatarImgElement.src = "", tkCharAvatarImgElement.style.display = "none");
          if (tkCharAvatarPreviewIElement) tkCharAvatarPreviewIElement.style.display = "block";
        }
      }
      window.tkOpenEditChar ? window.tkOpenEditChar(currentSubCharId) : window.openView(editCharSheet);
    }
  });
  function handleAction_8(value_63) {
    if (!subProfileFollowBtn || !value_63) return;
    if (value_63.isFollowed && value_63.isFollower) {
      subProfileFollowBtn.textContent = "互相关注";
      subProfileFollowBtn.className = "tk-btn-secondary";
    } else {
      if (value_63.isFollowed) {
        subProfileFollowBtn.textContent = "已关注";
        subProfileFollowBtn.className = "tk-btn-secondary";
      } else value_63.isFollower ? (subProfileFollowBtn.textContent = "回关", subProfileFollowBtn.className = "tk-btn-primary") : (subProfileFollowBtn.textContent = "关注", subProfileFollowBtn.className = "tk-btn-primary");
    }
  }
  window.tkOpenSubProfile = function (currentTkSubProfileCharId_2) {
    const char_6 = window.tkGetChar(currentTkSubProfileCharId_2);
    if (!char_6 || !subProfileView) return;
    currentSubCharId = currentTkSubProfileCharId_2;
    window.currentTkSubProfileCharId = currentTkSubProfileCharId_2;
    subProfileName.textContent = char_6.name || "User";
    subProfileHandle.textContent = "@" + (char_6.handle || currentTkSubProfileCharId_2);
    subProfileBio.textContent = char_6.bio || "暂无简介";
    char_6.status ? (subProfileStatusBubble.style.display = "block", subProfileStatusBubble.textContent = char_6.status) : subProfileStatusBubble.style.display = "none";
    subStatFollowing.textContent = tkProfileFormatCount(char_6.following || 0);
    subStatFollowers.textContent = tkProfileFormatCount(char_6.followers || 0);
    subStatLikes.textContent = tkProfileFormatCount(char_6.likes || 0);
    const src_4 = tkProfileResolveAvatar(char_6);
    src_4 ? (subProfileAvatarImg.src = src_4, subProfileAvatarImg.style.display = "block", subProfileAvatarIcon.style.display = "none") : (subProfileAvatarImg.src = "", subProfileAvatarImg.style.display = "none", subProfileAvatarIcon.style.display = "block");
    handleAction_8(char_6);
    const activeTab = document.querySelector("#tk-sub-profile-view .tk-ptab.active"),
      value_67 = activeTab ? activeTab.getAttribute("data-target") : "videos";
    let charVideos = tkState.videos.filter(v_2 => v_2.authorId === currentTkSubProfileCharId_2),
      items_69 = [];
    char_6.likedVideoIds && (items_69 = tkState.videos.filter(value_71 => char_6.likedVideoIds.includes(value_71.id)));
    tkSubProfileGridElement && renderGrid(value_67, tkSubProfileGridElement, charVideos, items_69);
    subProfileView.classList.add("active");
  };
  subProfileFollowBtn && subProfileFollowBtn.addEventListener("click", () => {
    if (!currentSubCharId) return;
    const char_7 = window.tkGetChar(currentSubCharId);
    if (char_7) {
      char_7.isFollowed = !char_7.isFollowed;
      if (window.tkPersistState) window.tkPersistState();
      handleAction_8(char_7);
      char_7.isFollowed ? window.showToast("已关注") : window.showToast("已取消关注");
      if (window.tkRenderHome) window.tkRenderHome();
      if (window.tkRenderChat) window.tkRenderChat();
    }
  });
  subProfileApiBtn && (subProfileApiBtn.innerHTML = "<i class=\"fas fa-search\" style=\"color: #fff;\"></i>", subProfileApiBtn.title = "生成主页内容", subProfileApiBtn.addEventListener("click", () => {
    if (!currentSubCharId) return;
    window.tkGenerateCharVideos ? window.tkGenerateCharVideos(currentSubCharId, () => {
      window.tkOpenSubProfile(currentSubCharId);
    }) : window.showToast("生成功能未绑定");
  }));
  window.tkGenerateCharVideos = async function (charId_2, value_74) {
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
      window.showToast("请在系统设置中配置 API");
      return;
    }
    const char_8 = window.tkGetChar(charId_2);
    if (!char_8) return;
    window.showToast("正在生成角色主页内容...");
    let text_76 = "";
    if (window.getWorldBooks) {
      const allWb = window.getWorldBooks(),
        globalWb = allWb.filter(b_2 => b_2.isGlobal);
      globalWb.length > 0 && (text_76 += "世界观背景设定:\n", globalWb.forEach(value_84 => {
        value_84.entries.forEach(message_85 => {
          text_76 += "- " + message_85.keyword + ": " + message_85.content + "\n";
        });
      }), text_76 += "\n");
    }
    if (window.getBuiltinWorldBooks) {
      const builtinWb = window.getBuiltinWorldBooks().filter(b_3 => b_3.isGlobal);
      builtinWb.length > 0 && (text_76 += "内置设定:\n", builtinWb.forEach(value_88 => {
        value_88.entries.forEach(message_89 => {
          text_76 += "- " + message_89.keyword + ": " + message_89.content + "\n";
        });
      }), text_76 += "\n");
    }
    char_8.memories && char_8.memories.length > 0 && (text_76 += "角色记忆:\n", char_8.memories.forEach(value_90 => {
      text_76 += "- " + value_90.text + "\n";
    }), text_76 += "\n");
    const charContextText = (char_8.name || "") + " " + (char_8.handle || "") + " " + (char_8.persona || "") + " " + (char_8.bio || ""),
      modernWbContext = window.tkBuildWorldBookContext ? window.tkBuildWorldBookContext(charContextText) : "",
      worldActorPrompt = window.tkBuildWorldActorPrompt ? window.tkBuildWorldActorPrompt({
        includeUserIdentity: false,
        purpose: "角色 TikTok 主页视频与评论区生成",
        triggerText: charContextText
      }) : "你是这个世界观中的任何非 user 角色/路人/创作者；只有必要时才提到 user，禁止扮演 user。";
    modernWbContext && (text_76 = modernWbContext + (char_8.memories && char_8.memories.length > 0 ? "\n\n角色记忆:\n" + char_8.memories.map(value_91 => "- " + (value_91.text || value_91)).join("\n") + "\n" : ""));
    const value_80 = "\n你现在是一个 TikTok 视频内容生成器。请根据以下角色的设定和挂载的世界书/记忆，为该角色生成主页内容：至少 2 条发布的视频内容和至少 2 条点赞过的视频。\n角色名字：" + char_8.name + "\n角色设定：" + char_8.persona + "\n\n要求：\n1. 整体风格符合该角色的性格和人物设定，视频画面用文字描述，富有镜头感或气泡文字表现感，必须以第三人称视角描述简要的环境氛围、动作和语言描述，字数严格控制在 40-80 字之间。\n2. 符合世界观，仿真实tk网络视频，内容多样化，文案要具有“活人感”（例如碎碎念、吐槽、玩梗,也可以是一句摘抄的文学语录），切忌机器播报感。\n3. 务必为每个视频生成 3-5 条相关评论，且如果情景合适（比如@了朋友），请在评论中追加 `replies`（楼中楼回复）。\n4. 返回严格的 JSON 格式（不要有 markdown 代码块标记，不要多余文字），格式必须如下：\n{\n  \"posts\": [\n    {\n      \"desc\": \"视频文案（简短，带tag）\",\n      \"sceneText\": \"画面内容文字描述（气泡内容或镜头描述）\",\n      \"likes\": 1234,\n      \"commentsCount\": 5,\n      \"shares\": 12,\n      \"comments\": [\n        { \n          \"authorName\": \"评论者A\", \n          \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=c1\", \n          \"text\": \"评论内容\", \n          \"likes\": 12,\n          \"replies\": [\n            {\n              \"authorName\": \"回复者B\",\n              \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=c2\",\n              \"text\": \"回复内容（如果情景合适）\",\n              \"likes\": 3\n            }\n          ]\n        }\n      ]\n    }\n  ],\n  \"likedVideos\": [\n    {\n      \"authorName\": \"随机创作者名\",\n      \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=v1\",\n      \"desc\": \"点赞视频文案\",\n      \"sceneText\": \"点赞视频的画面内容\",\n      \"likes\": 5678,\n      \"commentsCount\": 30,\n      \"shares\": 20,\n      \"comments\": [\n        {\n          \"authorName\": \"评论者A\",\n          \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=c3\",\n          \"text\": \"好有趣的视频！\",\n          \"likes\": 100,\n          \"replies\": []\n        }\n      ]\n    }\n  ]\n}\n\n" + text_76 + "\n";
    let content_2 = value_80 + "\n\n新版补充要求（必须覆盖旧格式）：\n角色名字：" + (char_8.name || "User") + "\n角色 handle：" + (char_8.handle || charId_2) + "\n角色设定：" + (char_8.persona || "普通 TikTok 用户") + "\n1. posts 生成 2-5 条，likedVideos 生成 2-5 条；每条内容必须包含 mediaType，值为 \"video\" 或 \"image\"。\n2. image 内容必须额外包含 imagePrompt，描述图片主体、构图、光线、质感；可选 bgImage、cover 或 imageUrl，没有真实 URL 就留空。\n3. 每条内容必须包含 opening、middle、ending 三段，每段 30-50 个字符；sceneText 可省略；如果原文不是中文，必须提供对应中文翻译字段。\n4. posts 和 likedVideos 中每条内容都必须包含至少 10 条顶层 comments；每条评论必须包含 replies 数组，楼中楼按情境可为空或自然生成。\n5. comments 和 replies 的每一项都必须带 authorName、authorAvatar、text、likes。\n6. 返回 JSON 对象时，posts 和 likedVideos 中的内容都使用同一套字段：mediaType、desc、imagePrompt、opening、middle、ending、likes、shares、comments。\n";
    try {
      const endpoint_2 = window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint);
      content_2 = "\nYou are generating a TikTok character profile. Return strict valid JSON only.\nYou may write as any non-user account/person inside this world view. Do not impersonate user.\n\n" + worldActorPrompt + "\n\nCharacter:\n" + JSON.stringify({
        id: charId_2,
        name: char_8.name || "User",
        handle: char_8.handle || charId_2,
        persona: char_8.persona || "",
        bio: char_8.bio || "",
        status: char_8.status || "",
        memories: Array.isArray(char_8.memories) ? char_8.memories.map(m => m.text || m).slice(0, 12) : []
      }, null, 2) + "\n\nWorld book and memory context:\n" + (text_76 || "No extra world book context.") + "\n\nHard requirements:\n1. Return one JSON object only. No markdown, no comments, no prose, no trailing commas.\n2. Include \"profileStats\" with numeric \"following\", \"followers\", and \"likes\".\n3. Include \"posts\": 2-5 items. Include \"likedVideos\": 1-3 items.\n4. Every post and likedVideo must include \"mediaType\" (\"video\" or \"image\"), \"desc\", \"imagePrompt\", \"opening\", \"middle\", \"ending\", \"likes\", \"shares\", and \"comments\".\n5. Even when mediaType is \"video\", provide imagePrompt as a realistic cover frame description. If no real image URL exists, leave \"cover\", \"bgImage\", and \"imageUrl\" empty.\n6. opening, middle, and ending are each 30-50 characters and should read like immersive bubble-flow text. They may use any language that fits the character and world.\n7. Every video in posts and likedVideos must contain at least 10 top-level comments. Each comment must include authorName, authorAvatar, text, likes, and replies. replies is always an array and may be empty or contain natural nested replies when appropriate.\n8. The content must match the character persona and world book. Avoid generic influencer wording. 禁止扮演user的身份发抖音和评论，你只能是除了user以外的人。\n9. 如果评论或 replies 中出现本角色本人，请使用 Character.id 作为 authorId，并让 authorName 与 Character.name 一致，以便头像与主页视频头像同步。\n10. International translation rule: opening/middle/ending may use any language that fits the character and world. If a bubble field is not Chinese, fill openingTranslationZh/middleTranslationZh/endingTranslationZh with a natural Chinese translation. If it is Chinese, the matching translation field must be an empty string. If any comment or reply text is not Chinese, fill translationZh with a natural Chinese translation; if it is Chinese, translationZh must be an empty string.\n\nJSON shape:\n{\n  \"profileStats\": {\n    \"following\": 120,\n    \"followers\": 3400,\n    \"likes\": 28000\n  },\n  \"posts\": [\n    {\n      \"mediaType\": \"video\",\n      \"desc\": \"short TikTok caption with tags\",\n      \"imagePrompt\": \"realistic cover frame description\",\n      \"opening\": \"30-50 chars in the fitting language\",\n      \"openingTranslationZh\": \"\",\n      \"middle\": \"30-50 chars in the fitting language\",\n      \"middleTranslationZh\": \"\",\n      \"ending\": \"30-50 chars in the fitting language\",\n      \"endingTranslationZh\": \"\",\n      \"likes\": 1234,\n      \"shares\": 23,\n      \"comments\": [\n        {\n          \"authorName\": \"commenter\",\n          \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=commenter\",\n          \"text\": \"comment text\",\n          \"translationZh\": \"Chinese translation if comment text is not Chinese, otherwise empty string\",\n          \"likes\": 12,\n          \"replies\": [\n            {\n              \"authorName\": \"reply author\",\n              \"authorAvatar\": \"\",\n              \"text\": \"reply text\",\n              \"translationZh\": \"Chinese translation if reply text is not Chinese, otherwise empty string\",\n              \"likes\": 3\n            }\n          ]\n        }\n      ]\n    }\n  ],\n  \"likedVideos\": [\n    {\n      \"mediaType\": \"image\",\n      \"authorName\": \"another creator\",\n      \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=creator\",\n      \"desc\": \"liked content caption\",\n      \"imagePrompt\": \"realistic image or cover frame description\",\n      \"opening\": \"30-50 chars in the fitting language\",\n      \"openingTranslationZh\": \"\",\n      \"middle\": \"30-50 chars in the fitting language\",\n      \"middleTranslationZh\": \"\",\n      \"ending\": \"30-50 chars in the fitting language\",\n      \"endingTranslationZh\": \"\",\n      \"likes\": 5678,\n      \"shares\": 44,\n      \"comments\": []\n    }\n  ]\n}\n";
      const value_92 = await fetch(endpoint_2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.apiConfig.apiKey
        },
        body: JSON.stringify({
          model: window.apiConfig.model || "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "Return strict valid JSON only. Use double-quoted keys and strings. Do not use markdown, comments, prose, or trailing commas."
          }, {
            role: "user",
            content: content_2
          }],
          temperature: parseFloat(window.apiConfig.temperature) || 0.8
        })
      });
      if (!value_92.ok) throw window.u2Api?.createHttpError?.(value_92, await window.u2Api?.readApiError?.(value_92)) || Object.assign(new Error("HTTP " + value_92.status), {
        status: value_92.status
      });
      const data = await value_92.json();
      let aiReply = data.choices[0].message.content;
      const parsedData = handleAction_3(aiReply);
      let enabled = false;
      if (parsedData.profileStats && typeof parsedData.profileStats === "object") {
        const stats = parsedData.profileStats;
        if (Number.isFinite(Number(stats.following))) char_8.following = Number(stats.following);
        if (Number.isFinite(Number(stats.followers))) char_8.followers = Number(stats.followers);
        if (Number.isFinite(Number(stats.likes))) char_8.likes = Number(stats.likes);
      }
      parsedData.posts && Array.isArray(parsedData.posts) && (parsedData.posts.slice(0, 5).forEach(v => {
        const normalized = window.tkNormalizeVideoPayload ? window.tkNormalizeVideoPayload(v, {
          id: "v_" + Date.now() + Math.floor(Math.random() * 1000),
          authorId: charId_2,
          authorName: char_8.name,
          authorAvatar: tkProfileResolveAvatar(char_8) || null,
          isLiked: false
        }) : {
          id: "v_" + Date.now() + Math.floor(Math.random() * 1000),
          authorId: charId_2,
          authorName: char_8.name,
          authorAvatar: tkProfileResolveAvatar(char_8) || null,
          desc: v.desc || "",
          sceneText: v.sceneText || [v.opening, v.middle, v.ending].filter(Boolean).join(" "),
          sceneSegments: [v.opening, v.middle, v.ending].filter(Boolean),
          likes: v.likes || Math.floor(Math.random() * 1000),
          commentsCount: v.comments && v.comments.length || v.commentsCount || 0,
          shares: v.shares || Math.floor(Math.random() * 100),
          isLiked: false,
          comments: v.comments || []
        };
        tkState.videos.unshift(normalized);
      }), enabled = true);
      if (parsedData.likedVideos && Array.isArray(parsedData.likedVideos)) {
        if (!char_8.likedVideoIds) char_8.likedVideoIds = [];
        parsedData.likedVideos.slice(0, 3).forEach(v_3 => {
          const id_8 = "v_liked_" + Date.now() + Math.floor(Math.random() * 1000),
            normalized_2 = window.tkNormalizeVideoPayload ? window.tkNormalizeVideoPayload(v_3, {
              id: id_8,
              authorId: "user_" + Date.now() + Math.floor(Math.random() * 100),
              authorName: v_3.authorName || "User",
              authorAvatar: v_3.authorAvatar || null,
              isLiked: false
            }) : {
              id: id_8,
              authorId: "user_" + Date.now() + Math.floor(Math.random() * 100),
              authorName: v_3.authorName || "User",
              authorAvatar: v_3.authorAvatar || null,
              desc: v_3.desc || "",
              sceneText: v_3.sceneText || [v_3.opening, v_3.middle, v_3.ending].filter(Boolean).join(" "),
              sceneSegments: [v_3.opening, v_3.middle, v_3.ending].filter(Boolean),
              likes: v_3.likes || Math.floor(Math.random() * 10000),
              commentsCount: v_3.comments && v_3.comments.length || v_3.commentsCount || 0,
              shares: v_3.shares || Math.floor(Math.random() * 100),
              isLiked: false,
              comments: v_3.comments || []
            };
          tkState.videos.unshift(normalized_2);
          char_8.likedVideoIds.push(id_8);
        });
        enabled = true;
      }
      if (enabled) {
        if (window.tkPersistState) window.tkPersistState();
        if (window.tkRenderHome) window.tkRenderHome();
        window.showToast("生成成功");
        if (value_74) value_74();
      } else throw new Error("No posts or likedVideos array in JSON");
    } catch (error_3) {
      console.error("Gen Error:", error_3);
      if (!window.u2Api?.isRequestError?.(error_3) || !window.u2Api.reportError(error_3, {
        operation: "主页内容生成"
      })) window.showToast("生成失败，请检查 API 配置");
    }
  };
  window.tkRenderProfile = function () {
    const p = tkState.profile;
    if (nameEl) nameEl.textContent = p.name || "User";
    if (handleEl) handleEl.textContent = "@" + (p.handle || "user123");
    if (bioEl) bioEl.textContent = p.bio || "点击添加个人简介";
    if (p.status) statusBubble && (statusBubble.style.display = "block", statusBubble.textContent = p.status);else {
      if (statusBubble) statusBubble.style.display = "none";
    }
    statFollowing.textContent = tkProfileFormatCount(p.following || 0);
    statFollowers.textContent = tkProfileFormatCount(p.followers || 0);
    statLikes.textContent = tkProfileFormatCount(p.likes || 0);
    const src_2 = window.tkResolveAvatar ? window.tkResolveAvatar("profile", p.name || p.handle || "User", p.avatar) : p.avatar;
    src_2 ? (avatarImg.src = src_2, avatarImg.style.display = "block", avatarIcon.style.display = "none") : (avatarImg.src = "", avatarImg.style.display = "none", avatarIcon.style.display = "block");
    const activeTab_2 = document.querySelector("#tk-profile-tab .tk-ptab.active"),
      target_2 = activeTab_2 ? activeTab_2.getAttribute("data-target") : "videos";
    renderGrid(target_2, document.getElementById("tk-profile-grid"), tkState.profile.posts || [], tkState.videos.filter(v_4 => v_4.isLiked));
    document.getElementById("tk-profile-tab").dataset.tkRendered = "true";
  };
  statusBubble && statusBubble.addEventListener("click", event_105 => {
    event_105.stopPropagation();
    if (window.showCustomModal) window.showCustomModal({
      title: "设置状态",
      type: "prompt",
      placeholder: "输入你的当前状态...",
      defaultValue: tkState.profile.status,
      onConfirm: val => {
        tkState.profile.status = val;
        if (window.tkPersistState) window.tkPersistState();
        window.tkRenderProfile();
        if (window.tkRenderChat) window.tkRenderChat();
      }
    });else {
      const status_2 = prompt("输入你的当前状态:", tkState.profile.status);
      if (status_2 !== null) {
        tkState.profile.status = status_2;
        if (window.tkPersistState) window.tkPersistState();
        window.tkRenderProfile();
      }
    }
  });
  avatarBtn && avatarUpload && (avatarBtn.addEventListener("click", event_107 => {
    if (event_107.target === statusBubble || event_107.target.closest(".tk-avatar-plus")) {
      event_107.target.closest(".tk-avatar-plus") && avatarUpload.click();
      return;
    }
    avatarUpload.click();
  }), avatarUpload.addEventListener("change", event_108 => {
    const value_109 = event_108.target.files[0];
    if (value_109) {
      const value_110 = new FileReader();
      value_110.onload = event_3 => {
        tkState.profile.avatar = event_3.target.result;
        window.userState && (window.userState.avatarUrl = event_3.target.result);
        if (window.tkPersistState) window.tkPersistState();
        window.tkRenderProfile();
        if (window.tkRenderChat) window.tkRenderChat();
        window.showToast("头像已更新");
      };
      value_110.readAsDataURL(value_109);
    }
    event_108.target.value = "";
  }));
  profileBackBtn && profileBackBtn.addEventListener("click", () => {
    tiktokViewElement && window.closeView(tiktokViewElement);
  });
  !window.tkProfileDelegationBound && (window.tkProfileDelegationBound = true, document.addEventListener("click", e_2 => {
    const sheets = ["tk-edit-profile-sheet", "tk-upload-video-sheet", "tk-edit-char-sheet", "tk-create-action-sheet"];
    sheets.forEach(id_9 => {
      const sheet_6 = document.getElementById(id_9);
      sheet_6 && sheet_6.classList.contains("active") && e_2.target === sheet_6 && window.closeView(sheet_6);
    });
    if (e_2.target.closest("#tk-profile-edit-btn")) try {
      const p_2 = tkState.profile,
        tkEditNameElement_116 = document.getElementById("tk-edit-name");
      if (tkEditNameElement_116) tkEditNameElement_116.value = p_2.name || "";
      const elHandle = document.getElementById("tk-edit-handle");
      if (elHandle) elHandle.value = p_2.handle || "";
      const tkEditBioElement_118 = document.getElementById("tk-edit-bio");
      if (tkEditBioElement_118) tkEditBioElement_118.value = p_2.bio || "";
      const tkEditPersonaElement_119 = document.getElementById("tk-edit-persona");
      if (tkEditPersonaElement_119) tkEditPersonaElement_119.value = p_2.persona || "";
      const tkEditFollowingElement_120 = document.getElementById("tk-edit-following");
      if (tkEditFollowingElement_120) tkEditFollowingElement_120.value = p_2.following || 0;
      const tkEditFollowersElement_121 = document.getElementById("tk-edit-followers");
      if (tkEditFollowersElement_121) tkEditFollowersElement_121.value = p_2.followers || 0;
      const tkEditLikesElement_122 = document.getElementById("tk-edit-likes");
      if (tkEditLikesElement_122) tkEditLikesElement_122.value = p_2.likes || 0;
      const editCharSheet_2 = document.getElementById("tk-edit-profile-sheet");
      if (editCharSheet_2) window.openView(editCharSheet_2);else {
        if (window.showToast) window.showToast("无法找到编辑面板容器");
      }
    } catch (err) {
      console.error("打开编辑资料报错:", err);
      if (window.showToast) window.showToast("打开编辑失败:" + err.message);
    }
    if (e_2.target.closest("#tk-save-profile-btn")) {
      const elName = document.getElementById("tk-edit-name"),
        elHandle_2 = document.getElementById("tk-edit-handle"),
        elBio = document.getElementById("tk-edit-bio"),
        elPersona = document.getElementById("tk-edit-persona"),
        elFollowing = document.getElementById("tk-edit-following"),
        elFollowers = document.getElementById("tk-edit-followers"),
        elLikes = document.getElementById("tk-edit-likes");
      tkState.profile.name = elName ? elName.value.trim() : "User";
      tkState.profile.handle = elHandle_2 ? elHandle_2.value.trim() : "user123";
      tkState.profile.bio = elBio ? elBio.value.trim() : "";
      tkState.profile.persona = elPersona ? elPersona.value.trim() : "";
      if (elFollowing) tkState.profile.following = elFollowing.value || 0;
      if (elFollowers) tkState.profile.followers = elFollowers.value || 0;
      if (elLikes) tkState.profile.likes = elLikes.value || 0;
      window.userState && (window.userState.name = tkState.profile.name);
      if (window.tkPersistState) window.tkPersistState();
      window.tkRenderProfile();
      const createActionSheet = document.getElementById("tk-edit-profile-sheet");
      if (createActionSheet) window.closeView(createActionSheet);
      window.showToast("资料已保存");
    }
    if (e_2.target.closest("#tk-profile-tab .tk-btn-icon")) {
      const sheet_7 = document.getElementById("tk-create-action-sheet");
      if (sheet_7 && window.openView) window.openView(sheet_7);
    }
    if (e_2.target.closest("#tk-btn-open-upload-video")) {
      const createActionSheet_2 = document.getElementById("tk-create-action-sheet");
      if (createActionSheet_2) window.closeView(createActionSheet_2);
      const tkUploadDescInputElement = document.getElementById("tk-upload-desc-input"),
        tkUploadSceneInputElement = document.getElementById("tk-upload-scene-input"),
        tkUploadCoverImgElement_134 = document.getElementById("tk-upload-cover-img"),
        coverBtn = document.getElementById("tk-upload-cover-btn");
      if (tkUploadDescInputElement) tkUploadDescInputElement.value = "";
      if (tkUploadSceneInputElement) tkUploadSceneInputElement.value = "";
      tkUploadCoverImgElement_134 && (tkUploadCoverImgElement_134.src = "", tkUploadCoverImgElement_134.style.display = "none");
      if (coverBtn) {
        const div = coverBtn.querySelector("div");
        if (div) div.style.display = "flex";
      }
      const sheet_8 = document.getElementById("tk-upload-video-sheet");
      if (sheet_8) window.openView(sheet_8);
    }
    if (e_2.target.closest("#tk-confirm-upload-btn")) {
      const tkUploadDescInputElement_136 = document.getElementById("tk-upload-desc-input"),
        tkUploadSceneInputElement_137 = document.getElementById("tk-upload-scene-input"),
        coverImg = document.getElementById("tk-upload-cover-img"),
        desc_2 = tkUploadDescInputElement_136 ? tkUploadDescInputElement_136.value.trim() : "",
        sceneText_2 = tkUploadSceneInputElement_137 ? tkUploadSceneInputElement_137.value.trim() : "",
        cover_2 = coverImg ? coverImg.src : null;
      if (!tkState.profile.posts) tkState.profile.posts = [];
      const newPost = {
          id: "post_" + Date.now(),
          authorId: "profile",
          authorName: tkState.profile.name || "User",
          authorAvatar: null,
          mediaType: "video",
          desc: desc_2,
          sceneText: sceneText_2,
          cover: coverImg && coverImg.style.display === "block" ? cover_2 : null,
          likes: 0,
          savedCount: 0,
          saves: 0,
          shares: 0,
          commentsCount: 0,
          comments: []
        },
        handleAction_2_142 = handleAction_2(newPost);
      tkState.profile.posts.unshift(newPost);
      if (window.tkPersistState) window.tkPersistState();
      window.tkRenderProfile();
      const createActionSheet_3 = document.getElementById("tk-upload-video-sheet");
      if (createActionSheet_3) window.closeView(createActionSheet_3);
      window.showToast("视频已发布，粉丝 +" + handleAction_2_142.followerDelta + "，获赞 +" + handleAction_2_142.likeDelta);
      window.tkGenerateVideoInteractions && window.tkGenerateVideoInteractions(newPost.id, {
        isAuto: true
      });
    }
    if (e_2.target.closest("#tk-sub-profile-edit-trigger")) {
      const charId_3 = window.currentTkSubProfileCharId;
      if (charId_3) {
        const tkCharSheetTitleElement_145 = document.getElementById("tk-char-sheet-title");
        if (tkCharSheetTitleElement_145) tkCharSheetTitleElement_145.textContent = "编辑角色";
        const tkCharNameElement_146 = document.getElementById("tk-char-name"),
          tkCharStatusElement_147 = document.getElementById("tk-char-status"),
          tkCharPersonaElement_148 = document.getElementById("tk-char-persona"),
          tkCharBioElement_149 = document.getElementById("tk-char-bio"),
          tkCharFollowingElement_150 = document.getElementById("tk-char-following"),
          tkCharFollowersElement_151 = document.getElementById("tk-char-followers"),
          tkCharLikesElement_152 = document.getElementById("tk-char-likes"),
          tkDeleteCharBtnElement_153 = document.getElementById("tk-delete-char-btn"),
          tkCharAvatarImgElement_154 = document.getElementById("tk-char-avatar-img"),
          tkCharAvatarPreviewIElement_155 = document.querySelector("#tk-char-avatar-preview i"),
          tkGetChar_156 = window.tkGetChar(charId_3);
        if (tkGetChar_156) {
          if (tkCharNameElement_146) tkCharNameElement_146.value = tkGetChar_156.name || "";
          if (tkCharStatusElement_147) tkCharStatusElement_147.value = tkGetChar_156.status || "";
          if (tkCharPersonaElement_148) tkCharPersonaElement_148.value = tkGetChar_156.persona || "";
          if (tkCharBioElement_149) tkCharBioElement_149.value = tkGetChar_156.bio || "";
          if (tkCharFollowingElement_150) tkCharFollowingElement_150.value = tkGetChar_156.following || 0;
          if (tkCharFollowersElement_151) tkCharFollowersElement_151.value = tkGetChar_156.followers || 0;
          if (tkCharLikesElement_152) tkCharLikesElement_152.value = tkGetChar_156.likes || 0;
          if (tkDeleteCharBtnElement_153) tkDeleteCharBtnElement_153.style.display = "block";
          const src_5 = tkProfileResolveAvatar(tkGetChar_156);
          if (src_5) {
            tkCharAvatarImgElement_154 && (tkCharAvatarImgElement_154.src = src_5, tkCharAvatarImgElement_154.style.display = "block");
            if (tkCharAvatarPreviewIElement_155) tkCharAvatarPreviewIElement_155.style.display = "none";
          } else {
            tkCharAvatarImgElement_154 && (tkCharAvatarImgElement_154.src = "", tkCharAvatarImgElement_154.style.display = "none");
            if (tkCharAvatarPreviewIElement_155) tkCharAvatarPreviewIElement_155.style.display = "block";
          }
        }
        if (window.tkOpenEditChar) window.tkOpenEditChar(charId_3);else {
          const s = document.getElementById("tk-edit-char-sheet");
          if (s) window.openView(s);
        }
      }
    }
  }));
  visitorsBtn && (visitorsBtn.title = "主页访客", visitorsBtn.addEventListener("click", event_4 => {
    event_4.stopPropagation();
    if (window.tkOpenProfileVisitorsSheet) window.tkOpenProfileVisitorsSheet();
  }));
  profileSettingsBtn && (profileSettingsBtn.title = "TikTok 设置", profileSettingsBtn.addEventListener("click", event_5 => {
    event_5.stopPropagation();
    const sheet_9 = tkEnsureProfileSettingsSheet();
    tkProfileUpdateSettingsSheet(sheet_9);
    window.openView(sheet_9);
  }));
  const mainProfileTabs = document.querySelectorAll("#tk-profile-tab .tk-ptab"),
    mainIndicator = document.querySelector("#tk-profile-tab .tk-ptab-indicator"),
    mainGridContainer = document.getElementById("tk-profile-grid");
  mainProfileTabs.forEach((subProfileView_3, value_163) => {
    subProfileView_3.addEventListener("click", () => {
      mainProfileTabs.forEach(subProfileView_2 => subProfileView_2.classList.remove("active"));
      subProfileView_3.classList.add("active");
      mainIndicator.style.transform = "translateX(" + value_163 * 100 + "%)";
      const target_3 = subProfileView_3.getAttribute("data-target");
      renderGrid(target_3, mainGridContainer, tkState.profile.posts || [], tkState.videos.filter(v_5 => v_5.isLiked));
    });
  });
  const subProfileTabs = document.querySelectorAll("#tk-sub-profile-view .tk-ptab"),
    subIndicator = document.querySelector("#tk-sub-profile-view .tk-ptab-indicator"),
    tkSubProfileGridElement_9 = document.getElementById("tk-sub-profile-grid");
  subProfileTabs.forEach((subProfileView_5, value_167) => {
    subProfileView_5.addEventListener("click", () => {
      subProfileTabs.forEach(subProfileView_4 => subProfileView_4.classList.remove("active"));
      subProfileView_5.classList.add("active");
      subIndicator.style.transform = "translateX(" + value_167 * 100 + "%)";
      const attribute_168 = subProfileView_5.getAttribute("data-target");
      let charVideos_2 = [],
        items_170 = [];
      if (currentSubCharId) {
        const tkGetChar_172 = window.tkGetChar(currentSubCharId);
        charVideos_2 = tkState.videos.filter(v_6 => v_6.authorId === currentSubCharId);
        tkGetChar_172 && tkGetChar_172.likedVideoIds && (items_170 = tkState.videos.filter(value_174 => tkGetChar_172.likedVideoIds.includes(value_174.id)));
      }
      renderGrid(attribute_168, tkSubProfileGridElement_9, charVideos_2, items_170);
    });
  });
  function renderGrid(value_175 = "videos", container, value_177 = [], value_178 = []) {
    if (!container) return;
    container.innerHTML = "";
    let items_2 = [];
    if (value_175 === "videos") items_2 = value_177;else value_175 === "liked" && (items_2 = value_178);
    if (items_2.length === 0) {
      container.innerHTML = "<div style=\"grid-column: span 3; padding: 40px 0; text-align: center; color: #999; font-size: 13px;\">暂无内容</div>";
      return;
    }
    items_2.forEach(item_2 => {
      const el = document.createElement("div");
      el.className = "tk-grid-item";
      const mediaIcon = item_2.mediaType === "image" ? "fa-image" : "fa-play";
      if (item_2.cover || item_2.bgImage || item_2.imageUrl) {
        let imgUrl = item_2.cover || item_2.bgImage || item_2.imageUrl;
        el.innerHTML = "\n                    <img src=\"" + imgUrl + "\" loading=\"lazy\" decoding=\"async\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                    <div class=\"tk-grid-views\" style=\"text-shadow: none;\"><i class=\"fas " + mediaIcon + "\" style=\"text-shadow: none;\"></i> " + tkProfileFormatCount(item_2.likes || Math.floor(Math.random() * 1000)) + "</div>\n                ";
      } else {
        let bgStyleStr = item_2.bgColor ? item_2.bgColor : "#ffffff";
        el.innerHTML = "\n                    <div class=\"tk-grid-text\" style=\"position: relative; left: 0; top: 0; transform: none; background: " + bgStyleStr + "; color:#111111; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding: 8px; width: 100%; height: 100%; box-sizing: border-box; border: none;  text-shadow: none;\">\n                        " + (item_2.sceneText ? item_2.sceneText.substring(0, 15) + "..." : item_2.desc ? item_2.desc.substring(0, 15) + "..." : "视频") + "\n                    </div>\n                    <div class=\"tk-grid-views\" style=\"color: #fff; text-shadow: none;\"><i class=\"fas " + mediaIcon + "\" style=\"text-shadow: none;\"></i> " + tkProfileFormatCount(item_2.likes || Math.floor(Math.random() * 1000)) + "</div>\n                ";
      }
      el.addEventListener("click", () => {
        if (window.tkOpenFullscreenVideo) window.tkOpenFullscreenVideo(item_2.id);else {
          console.error("tkOpenFullscreenVideo 不存在");
          if (window.showToast) window.showToast("错误: 全屏视频组件未就绪");
        }
      });
      container.appendChild(el);
    });
  }
  const coverBtn_2 = document.getElementById("tk-upload-cover-btn"),
    coverInput = document.getElementById("tk-upload-cover-input"),
    coverImg_2 = document.getElementById("tk-upload-cover-img");
  coverBtn_2 && coverInput && (coverBtn_2.addEventListener("click", e => {
    if (e.target.tagName !== "INPUT") coverInput.click();
  }), coverInput.addEventListener("change", event_185 => {
    const value_186 = event_185.target.files[0];
    if (value_186) {
      const value_187 = new FileReader();
      value_187.onload = ev => {
        coverImg_2 && (coverImg_2.src = ev.target.result, coverImg_2.style.display = "block");
        const divElement_189 = coverBtn_2.querySelector("div");
        if (divElement_189) divElement_189.style.display = "none";
      };
      value_187.readAsDataURL(value_186);
    }
    event_185.target.value = "";
  }));
});
