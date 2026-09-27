const subChannelBackBtn = document.getElementById("sub-channel-back-btn"),
  subChannelContent = document.getElementById("sub-channel-content"),
  subChannelSubscribeBtn = document.getElementById("sub-channel-subscribe-btn");
let currentSubChannelData = null;
function escapeYtChannelHtml(value_5) {
  return String(value_5 ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}
function openSubChannelView(sub) {
  try {
    if (!subChannelView) return;
    currentSubChannelData = sub;
    if (typeof window.ensureYtFixedCharFanGroup === "function" && !sub.isBusiness) {
      const previousGroup = sub.generatedContent?.fanGroup,
        name_8 = previousGroup?.name,
        previousCountSource = previousGroup?.memberCountSource,
        memberCountMigrationPending = previousGroup?._memberCountMigrationPending === true;
      window.ensureYtFixedCharFanGroup(sub);
      if (memberCountMigrationPending) delete sub.generatedContent.fanGroup._memberCountMigrationPending;
      (name_8 !== sub.generatedContent?.fanGroup?.name || previousCountSource !== "frontend" || memberCountMigrationPending) && typeof saveYoutubeData === "function" && (saveYoutubeData(), sub = mockSubscriptions.find(value_11 => value_11.id === sub.id) || sub, currentSubChannelData = sub);
    }
    const nameEl = document.getElementById("sub-channel-name");
    if (nameEl) nameEl.textContent = sub.name || "未知";
    const handleEl = document.getElementById("sub-channel-handle");
    if (handleEl) {
      const handleText = sub.handle || (sub.name ? sub.name.toLowerCase().replace(/\s+/g, "") : "unknown");
      handleEl.textContent = "@" + handleText;
    }
    const avatarEl = document.getElementById("sub-channel-avatar");
    avatarEl && (avatarEl.src = typeof resolveYtChannelAvatar === "function" ? resolveYtChannelAvatar(sub) : sub.avatar || "https://picsum.photos/80/80?grayscale", avatarEl.style.display = "block");
    const subBannerEl = document.getElementById("sub-channel-banner");
    subBannerEl && (sub.banner ? subBannerEl.style.backgroundImage = "url('" + sub.banner + "')" : subBannerEl.style.backgroundImage = "none");
    const value_3 = sub.subs || "1.2万",
      value_4 = sub.videos || "45",
      subsEl = document.getElementById("sub-channel-subs");
    if (subsEl) subsEl.textContent = value_3 + " 订阅者";
    const videosEl = document.getElementById("sub-channel-videos");
    if (videosEl) videosEl.textContent = value_4 + " 视频";
    if (subChannelContent) subChannelContent.innerHTML = "";
    const tabsContainer = document.getElementById("sub-channel-tabs");
    if (tabsContainer) {
      const tabs_2 = tabsContainer.querySelectorAll(".yt-sliding-tab");
      tabs_2.forEach(t => t.classList.remove("active"));
      if (tabs_2.length > 0) {
        tabs_2[0].classList.add("active");
        const indicator_2 = tabsContainer.querySelector(".yt-tab-indicator");
        if (indicator_2) updateSlidingIndicator(tabs_2[0], indicator_2);
      }
    }
    const foundSub = mockSubscriptions.find(s_2 => s_2.id === sub.id),
      isSubbed = foundSub && foundSub.isSubscribed !== false;
    subChannelSubscribeBtn && (isSubbed ? (subChannelSubscribeBtn.textContent = "已订阅", subChannelSubscribeBtn.classList.add("subscribed")) : (subChannelSubscribeBtn.textContent = "订阅", subChannelSubscribeBtn.classList.remove("subscribed")));
    if (typeof window.releaseYtChatKeyboardLock === "function") window.releaseYtChatKeyboardLock();
    subChannelView.classList.add("active");
    window.resetYtViewportOffset?.();
    sub.generatedContent ? renderGeneratedContent("live") : renderGeneratedContent("live");
    setTimeout(() => {
      const subVideoCards = subChannelContent.querySelectorAll(".yt-video-card");
      subVideoCards.forEach(card => {
        card.addEventListener("click", () => {
          const titleEl = card.querySelector(".yt-video-title");
          if (titleEl) {
            const video = mockVideos.find(v => v.title === titleEl.textContent && v.channelData && v.channelData.id === sub.id);
            if (video) openVideoPlayer(video);
          }
        });
      });
    }, 100);
  } catch (e_2) {
    console.error("Error opening sub channel view:", e_2);
    if (window.showToast) window.showToast("无法打开主页，出现异常");
  }
}
subChannelBackBtn && subChannelBackBtn.addEventListener("click", () => {
  if (typeof window.releaseYtChatKeyboardLock === "function") window.releaseYtChatKeyboardLock();
  if (subChannelView) subChannelView.classList.remove("active");
  window.resetYtViewportOffset?.();
});
subChannelSubscribeBtn && subChannelSubscribeBtn.addEventListener("click", function () {
  if (!currentSubChannelData) return;
  const subId = currentSubChannelData.id,
    existingIndex = mockSubscriptions.findIndex(s => s.id === subId);
  if (this.classList.contains("subscribed")) {
    this.classList.remove("subscribed");
    this.textContent = "订阅";
    if (existingIndex > -1) {
      mockSubscriptions[existingIndex].isSubscribed = false;
      const realSubs = mockSubscriptions.filter(s_3 => s_3.isSubscribed !== false);
      hasSubscriptions = realSubs.length > 0;
      renderSubscriptions();
      renderVideos();
    }
  } else {
    this.classList.add("subscribed");
    this.textContent = "已订阅";
    existingIndex === -1 ? (currentSubChannelData.isSubscribed = true, mockSubscriptions.push(currentSubChannelData)) : mockSubscriptions[existingIndex].isSubscribed = true;
    hasSubscriptions = true;
    renderSubscriptions();
    renderVideos();
  }
  saveYoutubeData();
});
function updateSlidingIndicator(value_17, element_18) {
  if (!value_17 || !element_18) return;
  element_18.style.width = value_17.offsetWidth + "px";
  element_18.style.transform = "translateX(" + value_17.offsetLeft + "px)";
}
function initSlidingTabs(containerId, onChangeCallback) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const tabs = container.querySelectorAll(".yt-sliding-tab"),
    indicator = container.querySelector(".yt-tab-indicator");
  setTimeout(() => {
    const active = container.querySelector(".yt-sliding-tab.active") || tabs[0];
    updateSlidingIndicator(active, indicator);
  }, 50);
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(element_22 => element_22.classList.remove("active"));
      tab.classList.add("active");
      updateSlidingIndicator(tab, indicator);
      onChangeCallback && onChangeCallback(tab.getAttribute("data-target") || tab.textContent.trim());
    });
  });
}
initSlidingTabs("profile-main-tabs", value_23 => {
  const ytProfileContentListElement = document.getElementById("yt-profile-content-list");
  if (!ytProfileContentListElement) return;
  ytProfileContentListElement.innerHTML = "";
  if (value_23 === "live") {
    const activeLive = mockVideos.find(v_2 => v_2.channelData && v_2.channelData.id === "user_channel_id");
    if (activeLive) {
      const el = document.createElement("div");
      el.innerHTML = "\n                    <div class=\"yt-video-card yt-live-pin-card\" style=\"margin: 16px;\">\n                        <div class=\"yt-video-thumbnail\">\n                            <img src=\"" + activeLive.thumbnail + "\" alt=\"Live\">\n                            <div class=\"yt-live-badge\"><i class=\"fas fa-broadcast-tower\" style=\"font-size: 10px;\"></i> LIVE</div>\n                        </div>\n                        <div class=\"yt-video-info\" style=\"padding: 12px;\">\n                            <div class=\"yt-video-details\">\n                                <h3 class=\"yt-video-title\">" + (activeLive.title || "无标题") + "</h3>\n                                <p class=\"yt-video-meta\">" + (activeLive.views || "正在观看") + "</p>\n                            </div>\n                        </div>\n                    </div>\n                ";
      el.querySelector(".yt-video-card").addEventListener("click", () => {
        if (typeof window.openYtUserLiveView === "function") window.openYtUserLiveView();else {
          const userLiveView = document.getElementById("yt-user-live-view");
          if (userLiveView) userLiveView.classList.add("active");
        }
      });
      ytProfileContentListElement.appendChild(el);
    } else ytProfileContentListElement.innerHTML = "\n                    <div style=\"display: flex; flex-direction: column; align-items: center; padding: 40px 20px; color: #8e8e93;\">\n                        <i class=\"fas fa-video-slash\" style=\"font-size: 40px; margin-bottom: 10px; color: #d1d1d6;\"></i>\n                        <p style=\"font-size: 14px;\">暂未开播</p>\n                    </div>\n                ";
  } else {
    if (value_23 === "past") {
      if (channelState.pastVideos && channelState.pastVideos.length > 0) {
        const listWrapper = document.createElement("div");
        listWrapper.className = "yt-history-list";
        listWrapper.style.padding = "16px";
        let upgradedUserReplays = false;
        channelState.pastVideos.forEach((video_2, value_29) => {
          !video_2.id && (video_2.id = "yt-user-replay-" + Date.now() + "-" + value_29 + "-" + Math.random().toString(36).slice(2, 7), upgradedUserReplays = true);
          video_2.isLiveReplay !== true && (video_2.isLiveReplay = true, upgradedUserReplays = true);
          !Number.isFinite(Number(video_2.realtimeCommentCount)) && (video_2.realtimeCommentCount = Array.isArray(video_2.comments) ? video_2.comments.length : 0, upgradedUserReplays = true);
          !Array.isArray(video_2.liveTranscript) && (video_2.liveTranscript = [], upgradedUserReplays = true);
        });
        if (upgradedUserReplays) saveYoutubeData();
        channelState.pastVideos.forEach((v_3, value_31) => {
          const item = document.createElement("div");
          item.className = "yt-history-item";
          item.style.position = "relative";
          item.innerHTML = "\n                        <div class=\"yt-history-thumb\">\n                            <img src=\"" + v_3.thumbnail + "\" alt=\"VOD\">\n                            <div class=\"yt-history-time\">" + (Math.floor(Math.random() * 2) + 1) + ":" + String(Math.floor(Math.random() * 60)).padStart(2, "0") + ":" + String(Math.floor(Math.random() * 60)).padStart(2, "0") + "</div>\n                        </div>\n                        <div class=\"yt-history-info\">\n                            <h3 class=\"yt-history-title\">" + (v_3.title || "无标题") + "</h3>\n                            <p class=\"yt-history-meta\">" + (v_3.views || "0 次观看") + " • " + (v_3.time || "刚刚") + "</p>\n                        </div>\n                    ";
          item.addEventListener("click", e => {
            openVideoPlayer({
              id: v_3.id,
              isLiveReplay: true,
              realtimeCommentCount: Number(v_3.realtimeCommentCount) || 0,
              liveTranscript: Array.isArray(v_3.liveTranscript) ? v_3.liveTranscript : [],
              time: v_3.time || "刚刚",
              title: v_3.title,
              views: v_3.views,
              thumbnail: v_3.thumbnail,
              isLive: false,
              guest: v_3.guest || null,
              channelData: {
                id: "user_channel_id",
                name: ytUserState ? ytUserState.name : "我",
                avatar: ytUserState ? ytUserState.avatarUrl : "https://picsum.photos/80/80?grayscale",
                subs: ytUserState ? ytUserState.subs : "0",
                desc: ytUserState ? ytUserState.persona : ""
              },
              comments: v_3.comments || []
            });
          });
          listWrapper.appendChild(item);
        });
        ytProfileContentListElement.appendChild(listWrapper);
      } else ytProfileContentListElement.innerHTML = "\n                    <div style=\"display: flex; flex-direction: column; align-items: center; padding: 40px 20px; color: #8e8e93;\">\n                        <i class=\"fas fa-film\" style=\"font-size: 40px; margin-bottom: 10px; color: #d1d1d6;\"></i>\n                        <p style=\"font-size: 14px;\">暂无往期视频</p>\n                    </div>\n                ";
    } else {
      if (value_23 === "community") {
        const posts = Array.isArray(channelState.communityPosts) ? channelState.communityPosts : [];
        if (posts.length === 0) {
          ytProfileContentListElement.innerHTML = "\n                    <div style=\"display: flex; flex-direction: column; align-items: center; padding: 40px 20px; color: #8e8e93;\">\n                        <i class=\"fas fa-users\" style=\"font-size: 40px; margin-bottom: 10px; color: #d1d1d6;\"></i>\n                        <p style=\"font-size: 14px;\">暂无社群动态</p>\n                    </div>\n                ";
          return;
        }
        const effectiveUser = typeof window.getYtEffectiveUserState === "function" ? window.getYtEffectiveUserState() : ytUserState || {};
        posts.forEach(post => {
          const syncedLikes = typeof window.syncYtPostLikeGrowth === "function" ? window.syncYtPostLikeGrowth(post) : Math.max(0, Number(post.likes) || 0),
            item_2 = document.createElement("div");
          item_2.className = "yt-community-post";
          item_2.style.cursor = "pointer";
          const status = post.commentsStatus === "loading" ? "<span style=\"color:#8e8e93;\"><i class=\"fas fa-circle-notch fa-spin\"></i> 评论生成中</span>" : post.commentsStatus === "failed" ? "<span style=\"color:#ff3b30;\">评论生成失败</span>" : "",
            commentCount = typeof window.countYtPostComments === "function" ? window.countYtPostComments(post) : Array.isArray(post.comments) ? post.comments.length : Number(post.commentsCount) || 0,
            likeCount = typeof window.formatYtPostLikeCount === "function" ? window.formatYtPostLikeCount(syncedLikes) : String(syncedLikes),
            postTranslationZh = String(post.translationZh || post.contentTranslationZh || post.translation || "").trim();
          item_2.innerHTML = "\n                    <div style=\"display:flex;align-items:center;margin-bottom:10px;gap:10px;\">\n                        <div class=\"yt-video-avatar\" style=\"width:36px;height:36px;\">" + (effectiveUser.avatarUrl ? "<img src=\"" + escapeYtChannelHtml(effectiveUser.avatarUrl) + "\">" : "<i class=\"fas fa-user\" style=\"color:#8e8e93;\"></i>") + "</div>\n                        <div style=\"flex:1;min-width:0;\">\n                            <div style=\"font-size:14px;font-weight:500;\">" + escapeYtChannelHtml(effectiveUser.name || "我的频道") + "</div>\n                            <div style=\"font-size:11px;color:#606060;\">" + escapeYtChannelHtml(post.time || "刚刚") + "</div>\n                        </div>\n                        <div style=\"font-size:11px;\">" + status + "</div>\n                    </div>\n                    <div class=\"yt-community-post-content\" style=\"white-space:pre-wrap;\">" + escapeYtChannelHtml(post.content || "") + "</div>\n                    " + (postTranslationZh ? "\n                        <button type=\"button\" class=\"yt-post-content-translation-btn\" aria-expanded=\"false\" style=\"border:none;background:transparent;color:#606060;padding:6px 0 0;font-size:12px;font-weight:600;cursor:pointer;\">翻译</button>\n                        <div class=\"yt-post-content-translation\" hidden style=\"margin:6px 0 0;padding:8px 10px;border-radius:10px;background:#f2f2f7;color:#3a3a3c;font-size:13px;line-height:1.45;\">" + escapeYtChannelHtml(postTranslationZh) + "</div>\n                    " : "") + "\n                    " + (post.imageUrl ? "<img src=\"" + escapeYtChannelHtml(post.imageUrl) + "\" alt=\"贴文图片\" style=\"display:block;width:100%;max-height:360px;object-fit:cover;border-radius:16px;margin-bottom:12px;\">" : "") + "\n                    <div class=\"yt-community-post-actions\">\n                        <div class=\"yt-community-post-action\"><i class=\"far fa-thumbs-up\"></i> " + likeCount + "</div>\n                        <div class=\"yt-community-post-action\"><i class=\"far fa-thumbs-down\"></i></div>\n                        <div class=\"yt-community-post-action\"><i class=\"far fa-comment\"></i> " + commentCount + "</div>\n                    </div>\n                ";
          item_2.querySelectorAll(".yt-post-content-translation-btn").forEach(button => {
            button.addEventListener("click", event => {
              event.stopPropagation();
              const translation_2 = button.nextElementSibling;
              if (!translation_2) return;
              const isExpanded = translation_2.hasAttribute("hidden");
              if (isExpanded) translation_2.removeAttribute("hidden");else translation_2.setAttribute("hidden", "");
              button.textContent = isExpanded ? "收起翻译" : "翻译";
              button.setAttribute("aria-expanded", String(isExpanded));
            });
          });
          item_2.addEventListener("click", () => window.openYtUserCommunityPost?.(post));
          ytProfileContentListElement.appendChild(item_2);
        });
      }
    }
  }
});
initSlidingTabs("sub-channel-tabs", target_2 => {
  renderGeneratedContent(target_2);
});
const addYtCharSheet = document.getElementById("add-yt-char-sheet"),
  ytCharAvatarWrapper = document.getElementById("yt-char-avatar-wrapper"),
  ytCharAvatarUpload = document.getElementById("yt-char-avatar-upload"),
  ytCharAvatarImg = document.getElementById("yt-char-avatar-img"),
  ytCharBannerBtn = document.getElementById("yt-char-banner-btn"),
  ytCharBannerUpload = document.getElementById("yt-char-banner-upload"),
  ytCharBannerImg = document.getElementById("yt-char-banner-img"),
  confirmAddYtCharBtn = document.getElementById("confirm-add-yt-char-btn"),
  charNameInput = document.getElementById("yt-char-name-input"),
  charHandleInput = document.getElementById("yt-char-handle-input"),
  charDescInput = document.getElementById("yt-char-desc-input"),
  charSubsInput = document.getElementById("yt-char-subs-input"),
  charVideosInput = document.getElementById("yt-char-videos-input"),
  charAvatarIcon = document.getElementById("yt-char-avatar-preview")?.querySelector("i"),
  imCharPickerSection = document.getElementById("yt-im-char-picker-section"),
  imCharPickerList = document.getElementById("yt-im-char-picker-list");
let isEditingChar = false,
  selectedImCharId = null;
function getImportableImChars() {
  const friends_2 = typeof window.getImFriends === "function" ? window.getImFriends() : window.imData && Array.isArray(window.imData.friends) ? window.imData.friends : [];
  return (Array.isArray(friends_2) ? friends_2 : []).filter(friend => friend && friend.type === "char");
}
function normalizeHandleFromName(name_2) {
  return String(name_2 || "channel").trim().replace(/^@/, "").replace(/\s+/g, "").replace(/[^\w\u4e00-\u9fa5.-]/g, "").toLowerCase() || "channel";
}
function findYtChannelByImCharId(imCharId_2, options = {}) {
  if (imCharId_2 === undefined || imCharId_2 === null || imCharId_2 === "") return null;
  const includeUnsubscribed_2 = !!options.includeUnsubscribed;
  return mockSubscriptions.find(sub_2 => {
    if (!sub_2 || String(sub_2.imCharId || "") !== String(imCharId_2)) return false;
    return includeUnsubscribed_2 || sub_2.isSubscribed !== false;
  }) || null;
}
function fillYtCharFormFromImChar(friend_2) {
  if (!friend_2) return;
  selectedImCharId = friend_2.id;
  const displayName = friend_2.nickname || friend_2.realName || friend_2.name || "Char";
  if (charNameInput) charNameInput.value = displayName;
  if (charHandleInput) charHandleInput.value = normalizeHandleFromName(displayName);
  if (charDescInput) charDescInput.value = friend_2.persona || friend_2.signature || "";
  if (friend_2.avatarUrl && ytCharAvatarImg) {
    ytCharAvatarImg.src = friend_2.avatarUrl;
    ytCharAvatarImg.style.display = "block";
    if (charAvatarIcon) charAvatarIcon.style.display = "none";
  }
}
function renderImCharPicker() {
  if (!imCharPickerSection || !imCharPickerList) return;
  const chars = getImportableImChars();
  imCharPickerList.innerHTML = "";
  if (chars.length === 0) {
    imCharPickerSection.style.display = "none";
    return;
  }
  imCharPickerSection.style.display = "block";
  chars.forEach(friend_3 => {
    const activeYtChannel = findYtChannelByImCharId(friend_3.id),
      isAlreadyAdded = !!activeYtChannel,
      item_3 = document.createElement("div");
    item_3.style.cssText = "width:64px; flex:0 0 64px; display:flex; flex-direction:column; align-items:center; gap:6px; cursor:" + (isAlreadyAdded ? "not-allowed" : "pointer") + "; opacity:" + (isAlreadyAdded ? "0.48" : "1") + ";";
    const textContent_2 = friend_3.nickname || friend_3.realName || friend_3.name || "Char";
    if (friend_3.avatarUrl) {
      const element_52 = document.createElement("img");
      element_52.src = friend_3.avatarUrl;
      element_52.style.cssText = "width:48px; height:48px; border-radius:50%; object-fit:cover; background:#f2f2f2; filter:" + (isAlreadyAdded ? "grayscale(1)" : "none") + ";";
      item_3.appendChild(element_52);
    } else {
      const fallback = document.createElement("div");
      fallback.style.cssText = "width:48px; height:48px; border-radius:50%; background:#f2f2f2; display:flex; align-items:center; justify-content:center; color:#8e8e93; font-weight:700; filter:" + (isAlreadyAdded ? "grayscale(1)" : "none") + ";";
      fallback.textContent = String(textContent_2).charAt(0);
      item_3.appendChild(fallback);
    }
    const label = document.createElement("div");
    label.style.cssText = "max-width:64px; font-size:11px; color:#0f0f0f; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
    label.textContent = textContent_2;
    item_3.appendChild(label);
    if (isAlreadyAdded) {
      const addedLabel = document.createElement("div");
      addedLabel.style.cssText = "font-size:10px; color:#8e8e93; line-height:1;";
      addedLabel.textContent = "已添加";
      item_3.appendChild(addedLabel);
      item_3.title = "该 Char 已有 YouTube 频道";
    }
    item_3.addEventListener("click", e_3 => {
      e_3.stopPropagation();
      if (isAlreadyAdded) return;
      fillYtCharFormFromImChar(friend_3);
    });
    imCharPickerList.appendChild(item_3);
  });
}
function openCustomCharSheet(charData = null) {
  if (addYtCharSheet) {
    renderImCharPicker();
    if (charData) {
      isEditingChar = true;
      selectedImCharId = charData.imCharId || null;
      const titleEl_2 = addYtCharSheet.querySelector(".sheet-title");
      if (titleEl_2) titleEl_2.textContent = "编辑频道角色";
      if (confirmAddYtCharBtn) confirmAddYtCharBtn.textContent = "保存修改";
      if (charNameInput) charNameInput.value = charData.name || "";
      if (charHandleInput) charHandleInput.value = charData.handle || charData.name.toLowerCase().replace(/\s+/g, "") || "";
      if (charDescInput) charDescInput.value = charData.desc || "";
      if (charSubsInput) charSubsInput.value = charData.subs || "";
      if (charVideosInput) charVideosInput.value = charData.videos || "";
      const src_2 = typeof resolveYtChannelAvatar === "function" ? resolveYtChannelAvatar(charData) : charData.avatar;
      if (ytCharAvatarImg && src_2) {
        ytCharAvatarImg.src = src_2;
        ytCharAvatarImg.style.display = "block";
        if (charAvatarIcon) charAvatarIcon.style.display = "none";
      }
      if (ytCharBannerImg && charData.banner) {
        ytCharBannerImg.src = charData.banner;
        ytCharBannerImg.style.display = "block";
      } else ytCharBannerImg && (ytCharBannerImg.style.display = "none");
    } else {
      isEditingChar = false;
      selectedImCharId = null;
      const titleEl_3 = addYtCharSheet.querySelector(".sheet-title");
      if (titleEl_3) titleEl_3.textContent = "自定义频道角色";
      if (confirmAddYtCharBtn) confirmAddYtCharBtn.textContent = "生成频道并开播";
      if (charNameInput) charNameInput.value = "";
      if (charHandleInput) charHandleInput.value = "";
      if (charDescInput) charDescInput.value = "";
      if (charSubsInput) charSubsInput.value = "";
      if (charVideosInput) charVideosInput.value = "";
      ytCharAvatarImg && (ytCharAvatarImg.src = "", ytCharAvatarImg.style.display = "none");
      if (charAvatarIcon) charAvatarIcon.style.display = "block";
      ytCharBannerImg && (ytCharBannerImg.src = "", ytCharBannerImg.style.display = "none");
    }
    addYtCharSheet.classList.add("active");
  }
}
const mainSearchBtn = document.getElementById("yt-main-search-btn"),
  mainSettingsBtn = document.getElementById("yt-main-settings-btn"),
  openCreateSheetHandler = e_4 => {
    e_4.stopPropagation();
    openCustomCharSheet(null);
  },
  openYoutubeSettingsHandler = event_59 => {
    event_59.stopPropagation();
    typeof updateYtBoundWorldBookLabel === "function" && updateYtBoundWorldBookLabel();
    const ytSettingsSheet = document.getElementById("yt-settings-sheet");
    if (ytSettingsSheet) ytSettingsSheet.classList.add("active");
  };
if (mainSearchBtn) mainSearchBtn.addEventListener("click", openCreateSheetHandler);
if (mainSettingsBtn) mainSettingsBtn.addEventListener("click", openYoutubeSettingsHandler);
const charEditBtn = document.getElementById("yt-char-edit-btn");
charEditBtn && charEditBtn.addEventListener("click", event_60 => {
  event_60.stopPropagation();
  currentSubChannelData && openCustomCharSheet(currentSubChannelData);
});
ytCharAvatarWrapper && ytCharAvatarUpload && (ytCharAvatarWrapper.addEventListener("click", event_61 => {
  event_61.target.tagName !== "INPUT" && (event_61.preventDefault(), ytCharAvatarUpload.click());
}), ytCharAvatarUpload.addEventListener("change", event_62 => {
  const value_63 = event_62.target.files[0];
  if (value_63) {
    const value_64 = new FileReader();
    value_64.onload = event_65 => {
      if (window.compressImage) window.compressImage(event_65.target.result, 300, 300, src_3 => {
        ytCharAvatarImg && (ytCharAvatarImg.src = src_3, ytCharAvatarImg.style.display = "block");
        if (charAvatarIcon) charAvatarIcon.style.display = "none";
      });else {
        ytCharAvatarImg && (ytCharAvatarImg.src = event_65.target.result, ytCharAvatarImg.style.display = "block");
        if (charAvatarIcon) charAvatarIcon.style.display = "none";
      }
    };
    value_64.readAsDataURL(value_63);
  }
}));
ytCharBannerBtn && ytCharBannerUpload && (ytCharBannerBtn.addEventListener("click", () => ytCharBannerUpload.click()), ytCharBannerUpload.addEventListener("change", event_67 => {
  const value_68 = event_67.target.files[0];
  if (value_68) {
    const value_69 = new FileReader();
    value_69.onload = event_70 => {
      window.compressImage ? window.compressImage(event_70.target.result, 800, 800, src_4 => {
        ytCharBannerImg && (ytCharBannerImg.src = src_4, ytCharBannerImg.style.display = "block");
      }) : ytCharBannerImg && (ytCharBannerImg.src = event_70.target.result, ytCharBannerImg.style.display = "block");
    };
    value_69.readAsDataURL(value_68);
  }
}));
confirmAddYtCharBtn && confirmAddYtCharBtn.addEventListener("click", async () => {
  const name_3 = charNameInput?.value.trim() || "神秘新星",
    handle_2 = charHandleInput?.value.trim() || name_3.toLowerCase().replace(/\s+/g, ""),
    desc_2 = charDescInput?.value.trim() || "这个频道很神秘，什么都没写...",
    subs_2 = charSubsInput?.value.trim() || "1.2万",
    videos_2 = charVideosInput?.value.trim() || "10";
  let avatar_2 = "https://picsum.photos/seed/" + Math.random() + "/80/80?grayscale";
  if (ytCharAvatarImg && ytCharAvatarImg.style.display === "block" && ytCharAvatarImg.src) avatar_2 = ytCharAvatarImg.src;else isEditingChar && currentSubChannelData && currentSubChannelData.avatar && (avatar_2 = currentSubChannelData.avatar);
  let banner_2 = null;
  if (ytCharBannerImg && ytCharBannerImg.style.display === "block" && ytCharBannerImg.src) banner_2 = ytCharBannerImg.src;else isEditingChar && currentSubChannelData && currentSubChannelData.banner && (banner_2 = currentSubChannelData.banner);
  if (isEditingChar && currentSubChannelData) {
    currentSubChannelData.name = name_3;
    currentSubChannelData.handle = handle_2;
    currentSubChannelData.desc = desc_2;
    currentSubChannelData.subs = subs_2;
    currentSubChannelData.videos = videos_2;
    currentSubChannelData.avatar = avatar_2;
    currentSubChannelData.banner = banner_2;
    currentSubChannelData.imCharId = selectedImCharId;
    const subIndex = mockSubscriptions.findIndex(s_4 => s_4.id === currentSubChannelData.id);
    subIndex > -1 && (mockSubscriptions[subIndex] = currentSubChannelData);
    renderSubscriptions();
    openSubChannelView(currentSubChannelData);
    if (window.showToast) window.showToast("角色信息已更新！");
  } else {
    const existingUnsubscribedChannel = selectedImCharId ? findYtChannelByImCharId(selectedImCharId, {
      includeUnsubscribed: true
    }) : null;
    if (existingUnsubscribedChannel && existingUnsubscribedChannel.isSubscribed !== false) {
      renderSubscriptions();
      openSubChannelView(existingUnsubscribedChannel);
      if (window.showToast) window.showToast("该 Char 已有 YouTube 频道");
    } else {
      if (existingUnsubscribedChannel && existingUnsubscribedChannel.isSubscribed === false) {
        existingUnsubscribedChannel.name = name_3;
        existingUnsubscribedChannel.handle = handle_2;
        existingUnsubscribedChannel.desc = desc_2;
        existingUnsubscribedChannel.subs = subs_2;
        existingUnsubscribedChannel.videos = videos_2;
        existingUnsubscribedChannel.avatar = avatar_2;
        existingUnsubscribedChannel.banner = banner_2;
        existingUnsubscribedChannel.imCharId = selectedImCharId;
        existingUnsubscribedChannel.isSubscribed = true;
        hasSubscriptions = true;
        renderSubscriptions();
        openSubChannelView(existingUnsubscribedChannel);
        if (window.showToast) window.showToast("已恢复该 Char 的 YouTube 频道！");
      } else {
        const newCharData = {
          id: "char_custom_" + Date.now(),
          name: name_3,
          handle: handle_2,
          avatar: avatar_2,
          banner: banner_2,
          imCharId: selectedImCharId,
          isLive: true,
          desc: desc_2,
          subs: subs_2,
          videos: videos_2,
          isFriend: false,
          isBusiness: false,
          isSubscribed: true
        };
        !mockSubscriptions.some(s_5 => s_5.id === newCharData.id) && (mockSubscriptions.push(newCharData), hasSubscriptions = true);
        renderSubscriptions();
        openSubChannelView(newCharData);
        if (window.showToast) window.showToast("频道已生成，默认已订阅！");
      }
    }
  }
  saveYoutubeData();
  if (addYtCharSheet) addYtCharSheet.classList.remove("active");
});
addYtCharSheet && addYtCharSheet.addEventListener("mousedown", event_84 => {
  event_84.target === addYtCharSheet && addYtCharSheet.classList.remove("active");
});
window.openSubChannelView = openSubChannelView;
window.openCustomCharSheet = openCustomCharSheet;
