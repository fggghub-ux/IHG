const communityDetailView = document.getElementById("yt-community-detail-view"),
  communityDetailBackBtn = document.getElementById("yt-community-detail-back-btn"),
  communityDetailContent = document.getElementById("yt-community-detail-content"),
  postChatSend = document.getElementById("yt-community-chat-send"),
  postChatInput = document.getElementById("yt-community-chat-input"),
  communityDetailGenerateBtn = document.getElementById("yt-community-generate-comments-btn"),
  communityDetailDeletePostBtn = document.getElementById("yt-community-delete-post-btn");
let currentActivePost = null,
  currentPostReplyTarget = null,
  ytPostLikeGrowthTimer = null,
  ytPostCommentGenerationLocked = false;
const userPostComposeSheet = document.getElementById("yt-user-post-compose-sheet"),
  userPostContentInput = document.getElementById("yt-user-post-content-input"),
  userPostImageWrapper = document.getElementById("yt-user-post-image-wrapper"),
  userPostImagePreview = document.getElementById("yt-user-post-image-preview"),
  userPostImageAddBtn = document.getElementById("yt-user-post-image-add-btn"),
  userPostImageUpload = document.getElementById("yt-user-post-image-upload"),
  userPostImageRemoveBtn = document.getElementById("yt-user-post-image-remove-btn"),
  userPostImageDescriptionGroup = document.getElementById("yt-user-post-image-description-group"),
  userPostImageDescriptionInput = document.getElementById("yt-user-post-image-description-input"),
  userPostPublishBtn = document.getElementById("yt-user-post-publish-btn"),
  postReplyContext = document.getElementById("yt-community-reply-context"),
  postReplyContextText = document.getElementById("yt-community-reply-context-text"),
  postReplyCancel = document.getElementById("yt-community-reply-cancel");
function stopCommunityControlEvent(e) {
  if (!e) return;
  e.stopPropagation();
}
[communityDetailContent, postChatInput, postChatSend, communityDetailBackBtn, communityDetailGenerateBtn, communityDetailDeletePostBtn].filter(Boolean).forEach(value_2 => {
  value_2.addEventListener("click", stopCommunityControlEvent);
  value_2.addEventListener("pointerdown", stopCommunityControlEvent);
});
if (communityDetailContent) {
  let isDraggingDetail = false;
  communityDetailContent.addEventListener("touchstart", () => {
    isDraggingDetail = false;
  }, {
    passive: true
  });
  communityDetailContent.addEventListener("touchmove", () => {
    isDraggingDetail = true;
  }, {
    passive: true
  });
  communityDetailContent.addEventListener("touchend", () => {
    if (isDraggingDetail) {
      if (postChatInput && document.activeElement === postChatInput) postChatInput.blur();
    }
  });
  communityDetailContent.addEventListener("click", () => {
    if (postChatInput && document.activeElement === postChatInput) postChatInput.blur();
  });
}
communityDetailBackBtn && communityDetailBackBtn.addEventListener("click", () => {
  if (postChatInput && document.activeElement === postChatInput) postChatInput.blur();
  clearYtPostReplyTarget();
  stopYtPostLikeGrowthTimer();
  if (typeof window.releaseYtChatKeyboardLock === "function") window.releaseYtChatKeyboardLock();
});
postReplyCancel && postReplyCancel.addEventListener("click", event => {
  event.preventDefault();
  event.stopPropagation();
  clearYtPostReplyTarget();
});
postChatInput && (postChatInput.addEventListener("focus", () => {
  if (typeof window.setYtChatKeyboardLock === "function") window.setYtChatKeyboardLock(communityDetailView, true);else {
    if (communityDetailView) communityDetailView.classList.add("keyboard-open");
  }
}), postChatInput.addEventListener("blur", () => {
  if (typeof window.setYtChatKeyboardLock === "function") window.setYtChatKeyboardLock(communityDetailView, false);else {
    if (communityDetailView) communityDetailView.classList.remove("keyboard-open");
  }
  window.resetYtViewportOffset?.();
}));
function getCurrentYtCommunityUser() {
  if (typeof window.getYtEffectiveUserState === "function") return window.getYtEffectiveUserState() || {};
  return ytUserState || {};
}
function ytEscapeHtml(value_6) {
  return String(value_6 ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}
function formatYtPostText(value_7) {
  return ytEscapeHtml(value_7).replace(/\n/g, "<br>");
}
function parseYtPostLikeCount(value_9) {
  if (Number.isFinite(Number(value_9))) return Math.max(0, Math.round(Number(value_9)));
  const text_2 = String(value_9 || "").replace(/,/g, "").trim(),
    matched = text_2.match(/[\d.]+/);
  if (!matched) return 0;
  const number = Number(matched[0]);
  if (!Number.isFinite(number)) return 0;
  if (text_2.includes("万")) return Math.max(0, Math.round(number * 10000));
  return Math.max(0, Math.round(number));
}
function formatYtPostLikeCount(value_8) {
  const count_2 = parseYtPostLikeCount(value_8);
  if (count_2 >= 10000) {
    const formatted = (count_2 / 10000).toFixed(count_2 % 10000 === 0 ? 0 : 1).replace(/\.0$/, "");
    return formatted + "万";
  }
  return String(count_2);
}
function makeYtPostCommentId(value_10 = "yt_post_comment") {
  return value_10 + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}
function normalizeYtPostNameKey(value_14) {
  return String(value_14 || "").trim().toLowerCase();
}
function getYtPostAvailableChars() {
  const rawChars = typeof getYtImChars === "function" ? getYtImChars() : Array.isArray(window.imData?.friends) ? window.imData.friends.filter(friend => friend?.type === "char") : [];
  return (Array.isArray(rawChars) ? rawChars : []).map(friend_2 => {
    const normalized = window.imApp && typeof window.imApp.normalizeFriendData === "function" ? window.imApp.normalizeFriendData(friend_2) || friend_2 : friend_2,
      id_2 = String(normalized?.id ?? friend_2?.id ?? "").trim(),
      name_2 = String(normalized?.nickname || normalized?.realName || normalized?.name || friend_2?.nickname || friend_2?.realName || friend_2?.name || "").trim();
    if (!id_2 || !name_2) return null;
    return {
      id: id_2,
      name: name_2,
      avatar: normalized?.avatarUrl || normalized?.avatar || friend_2?.avatarUrl || friend_2?.avatar || "",
      persona: normalized?.persona || friend_2?.persona || friend_2?.bio || "",
      aliases: [normalized?.nickname, normalized?.realName, normalized?.name, friend_2?.nickname, friend_2?.realName, friend_2?.name].map(normalizeYtPostNameKey).filter(Boolean)
    };
  }).filter(Boolean);
}
function resolveYtPostCommentChar(comment_2) {
  const declaredType = String(comment_2?.speakerType || comment_2?.type || "").toLowerCase();
  if (declaredType === "user") return null;
  const chars_2 = getYtPostAvailableChars();
  if (chars_2.length === 0) return null;
  const speakerId_2 = String(comment_2?.speakerId || comment_2?.charId || comment_2?.imCharId || "").trim();
  if (speakerId_2) {
    const byId = chars_2.find(char_2 => char_2.id === speakerId_2);
    if (byId) return byId;
  }
  const ytPostNameKey = normalizeYtPostNameKey(comment_2?.name || comment_2?.speakerName);
  if (!ytPostNameKey) return null;
  if (declaredType === "char") return chars_2.find(value_22 => value_22.aliases.includes(ytPostNameKey)) || null;
  return chars_2.find(value_23 => value_23.aliases.includes(ytPostNameKey)) || null;
}
function normalizeYtPostCommentEntry(rawComment, value_25 = 0) {
  const source_2 = typeof rawComment === "string" ? {
      text: rawComment
    } : rawComment && typeof rawComment === "object" ? rawComment : {},
    resolvedChar = resolveYtPostCommentChar(source_2),
    fallbackName = "观众" + (value_25 + 1),
    text_3 = String(source_2.text ?? source_2.content ?? "").trim(),
    replies_2 = Array.isArray(source_2.replies) ? source_2.replies.map((reply_2, replyIndex_2) => normalizeYtPostCommentEntry(reply_2, replyIndex_2)).filter(reply_3 => reply_3.text) : [];
  return source_2.id = source_2.id || makeYtPostCommentId(), source_2.speakerId = resolvedChar ? resolvedChar.id : String(source_2.speakerId || source_2.charId || source_2.imCharId || "").trim(), source_2.speakerType = resolvedChar ? "char" : String(source_2.speakerType || source_2.type || "fan").trim(), source_2.name = resolvedChar ? resolvedChar.name : String(source_2.name || source_2.speakerName || fallbackName).trim(), source_2.avatar = resolvedChar ? resolvedChar.avatar : source_2.avatar || source_2.avatarUrl || "", source_2.text = text_3, source_2.translationZh = String(source_2.translationZh || source_2.translation || "").trim(), source_2.likes = Math.max(0, Math.round(Number(source_2.likes) || 0)), source_2.replyTo = source_2.replyTo ? String(source_2.replyTo).trim() : "", source_2.replies = replies_2, source_2;
}
function ensureYtPostCommentsShape(post_2) {
  if (!post_2 || typeof post_2 !== "object") return [];
  return post_2.comments = Array.isArray(post_2.comments) ? post_2.comments.map((comment_3, index_2) => normalizeYtPostCommentEntry(comment_3, index_2)).filter(comment_4 => comment_4.text) : [], post_2.commentsCount = post_2.comments.reduce((total, comment_5) => total + 1 + (Array.isArray(comment_5.replies) ? comment_5.replies.length : 0), 0), post_2.comments;
}
function countYtPostComments(post_3) {
  const comments_2 = ensureYtPostCommentsShape(post_3);
  return comments_2.reduce((total_2, comment_6) => total_2 + 1 + (Array.isArray(comment_6?.replies) ? comment_6.replies.length : 0), 0);
}
function syncYtPostLikeGrowth(post_4, persist = true) {
  if (!post_4 || typeof post_4 !== "object") return 0;
  const now_44 = Date.now(),
    currentLikes = parseYtPostLikeCount(post_4.likes),
    lastGrowthAt = Number(post_4.lastLikeGrowthAt);
  if (!Number.isFinite(lastGrowthAt) || lastGrowthAt <= 0) {
    post_4.likes = currentLikes;
    post_4.lastLikeGrowthAt = now_44;
    if (persist) saveYoutubeData();
    return currentLikes;
  }
  const elapsedSteps = Math.min(2880, Math.floor((now_44 - lastGrowthAt) / 30000));
  if (elapsedSteps <= 0) return currentLikes;
  const growthPerStep = Math.max(1, Math.ceil(countYtPostComments(post_4) * 0.08));
  post_4.likes = currentLikes + elapsedSteps * growthPerStep;
  post_4.lastLikeGrowthAt = lastGrowthAt + elapsedSteps * 30000;
  if (persist) saveYoutubeData();
  return post_4.likes;
}
window.syncYtPostLikeGrowth = syncYtPostLikeGrowth;
window.formatYtPostLikeCount = formatYtPostLikeCount;
window.countYtPostComments = countYtPostComments;
function clearYtPostReplyTarget() {
  currentPostReplyTarget = null;
  if (postReplyContext) postReplyContext.style.display = "none";
  if (postReplyContextText) postReplyContextText.textContent = "";
  if (postChatInput) postChatInput.placeholder = "发表评论...";
}
function setYtPostReplyTarget(rootComment_2, replyToName_2) {
  if (!rootComment_2) return;
  currentPostReplyTarget = {
    rootComment: rootComment_2,
    replyToName: String(replyToName_2 || rootComment_2.name || "评论者")
  };
  if (postReplyContext) postReplyContext.style.display = "flex";
  if (postReplyContextText) postReplyContextText.textContent = "回复 @" + currentPostReplyTarget.replyToName;
  postChatInput && (postChatInput.placeholder = "回复 @" + currentPostReplyTarget.replyToName + "...", postChatInput.focus());
}
function stopYtPostLikeGrowthTimer() {
  if (ytPostLikeGrowthTimer) clearInterval(ytPostLikeGrowthTimer);
  ytPostLikeGrowthTimer = null;
}
function startYtPostLikeGrowthTimer(post_5) {
  stopYtPostLikeGrowthTimer();
  if (!post_5) return;
  ytPostLikeGrowthTimer = setInterval(() => {
    if (currentActivePost !== post_5 || !communityDetailView?.classList.contains("active")) return;
    const growth = Math.max(1, Math.ceil(countYtPostComments(post_5) * 0.05));
    post_5.likes = parseYtPostLikeCount(post_5.likes) + growth;
    post_5.lastLikeGrowthAt = Date.now();
    saveYoutubeData();
    const likeCount = document.getElementById("yt-community-post-like-count");
    if (likeCount) likeCount.textContent = formatYtPostLikeCount(post_5.likes);
  }, 10000);
}
function setYtPostGenerateButtonLoading(isLoading) {
  ytPostCommentGenerationLocked = !!isLoading;
  if (!communityDetailGenerateBtn) return;
  communityDetailGenerateBtn.style.pointerEvents = isLoading ? "none" : "auto";
  communityDetailGenerateBtn.style.opacity = isLoading ? "0.65" : "1";
  communityDetailGenerateBtn.innerHTML = isLoading ? "<i class=\"fas fa-circle-notch fa-spin\"></i>" : "<i class=\"fas fa-search\"></i>";
  communityDetailGenerateBtn.setAttribute("aria-busy", String(!!isLoading));
}
function normalizeYtChatReply(value_15) {
  if (typeof normalizeYtGeneratedMessage === "function") return normalizeYtGeneratedMessage(value_15);
  if (typeof value_15 === "string") return {
    text: value_15.trim(),
    translationZh: ""
  };
  return {
    text: String(value_15?.text ?? value_15?.content ?? "").trim(),
    translationZh: String(value_15?.translationZh ?? value_15?.translation ?? "").trim()
  };
}
function getYtBubbleSpeakerKey(msg_2) {
  if (msg_2?.type === "system") return "system:" + (msg_2?.status || "");
  if (msg_2?.type === "user") return "user";
  if (msg_2?.type === "admin") return "admin:" + (msg_2?.speakerId || msg_2?.name || "");
  if (msg_2?.isOffer || msg_2?.type === "char") return "char:" + (msg_2?.name || currentSubChannelData?.name || "");
  return "fan:" + (msg_2?.name || "");
}
function getYtBubbleGroupState(value_54, previousSpeakerKey = null) {
  const speakerKey_2 = getYtBubbleSpeakerKey(value_54);
  if (previousSpeakerKey === null) previousSpeakerKey = groupChatContainer?.lastElementChild?.dataset?.ytSpeakerKey || "";
  return {
    speakerKey: speakerKey_2,
    isConsecutive: previousSpeakerKey === speakerKey_2
  };
}
function getYtBubbleTextMarkup(msg_3) {
  const text_4 = ytEscapeHtml(msg_3?.text || ""),
    trim_58 = String(msg_3?.translationZh || "").trim();
  return {
    className: trim_58 ? "yt-bubble-msg yt-bubble-translatable" : "yt-bubble-msg",
    attributes: trim_58 ? "role=\"button\" tabindex=\"0\" aria-expanded=\"false\" aria-label=\"展开中文翻译\"" : "",
    html: "" + text_4 + (trim_58 ? "<div class=\"yt-bubble-translation\">" + ytEscapeHtml(trim_58) + "</div>" : "")
  };
}
function bindYtBubbleTranslation(row) {
  const bubble = row?.querySelector(".yt-bubble-translatable");
  if (!bubble) return;
  const toggle_2 = () => {
    const isExpanded = bubble.classList.toggle("yt-translation-expanded");
    bubble.setAttribute("aria-expanded", String(isExpanded));
    bubble.setAttribute("aria-label", isExpanded ? "收起中文翻译" : "展开中文翻译");
  };
  bubble.addEventListener("click", event_2 => {
    event_2.stopPropagation();
    toggle_2();
  });
  bubble.addEventListener("keydown", event_3 => {
    if (event_3.key !== "Enter" && event_3.key !== " ") return;
    event_3.preventDefault();
    toggle_2();
  });
}
const YT_CHAT_GENERATION_STALE_MS = 120000,
  YT_CHAT_GENERATION_SOURCE = "yt-chat-api";
function createYtChatRuntimeId(value_62 = "yt_msg") {
  return value_62 + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
}
function getCurrentYtChatMode() {
  return groupChatTitle && currentSubChannelData && groupChatTitle.textContent === currentSubChannelData.name ? "dm" : "group";
}
function resolveYtChatThread(channelId_2, mode_2) {
  const value_65 = mode_2 === "dm" ? "dm" : "group",
    safeChannelId = String(channelId_2 || "");
  let channel_2 = null;
  channelState?.userCommunityChannel && String(channelState.userCommunityChannel.id) === safeChannelId && (channel_2 = channelState.userCommunityChannel);
  !channel_2 && Array.isArray(mockSubscriptions) && (channel_2 = mockSubscriptions.find(sub => String(sub?.id) === safeChannelId) || null);
  !channel_2 && currentSubChannelData && String(currentSubChannelData.id) === safeChannelId && (channel_2 = currentSubChannelData);
  if (!channel_2) return null;
  const historyKey_2 = value_65 === "dm" ? "dmHistory" : "groupChatHistory";
  if (!Array.isArray(channel_2[historyKey_2])) channel_2[historyKey_2] = [];
  return {
    channel: channel_2,
    channelId: String(channel_2.id || safeChannelId),
    mode: value_65,
    historyKey: historyKey_2,
    history: channel_2[historyKey_2]
  };
}
function getCurrentYtChatThreadRef() {
  if (!currentSubChannelData?.id) return null;
  return {
    channelId: String(currentSubChannelData.id),
    mode: getCurrentYtChatMode()
  };
}
function isCurrentYtChatThread(threadRef) {
  if (!threadRef || !currentSubChannelData?.id) return false;
  return String(currentSubChannelData.id) === String(threadRef.channelId) && getCurrentYtChatMode() === threadRef.mode;
}
function refreshYtChatThreadIfVisible(threadRef_2) {
  isCurrentYtChatThread(threadRef_2) && renderGroupChatHistory(threadRef_2.mode === "dm");
  if (typeof renderMessagesList === "function") renderMessagesList();
}
function getLatestYtNonSystemMessage(history_2) {
  for (let index = history_2.length - 1; index >= 0; index--) {
    if (history_2[index]?.type !== "system") return history_2[index];
  }
  return null;
}
function createYtGenerationPlaceholder(generationId_2) {
  return {
    type: "system",
    id: generationId_2,
    generationId: generationId_2,
    source: YT_CHAT_GENERATION_SOURCE,
    status: "generating",
    text: "生成中...",
    createdAt: Date.now()
  };
}
function markYtGenerationMessageFailed(message_2, updatedAt_2 = Date.now()) {
  if (!message_2 || message_2.type !== "system" || message_2.status !== "generating") return false;
  return message_2.status = "failed", message_2.text = "生成中断，请重新生成", message_2.updatedAt = updatedAt_2, true;
}
function cleanupStaleYtGeneratingMessages(history_3, now_2 = Date.now()) {
  if (!Array.isArray(history_3)) return false;
  let changed = false;
  return history_3.forEach(message_3 => {
    if (message_3?.type !== "system" || message_3.status !== "generating") return;
    const createdAt_2 = Number(message_3.createdAt) || 0;
    if (createdAt_2 > 0 && now_2 - createdAt_2 <= YT_CHAT_GENERATION_STALE_MS) return;
    changed = markYtGenerationMessageFailed(message_3, now_2) || changed;
  }), changed;
}
function cleanupAllStaleYtChatGenerations() {
  const channels = [];
  if (channelState?.userCommunityChannel) channels.push(channelState.userCommunityChannel);
  if (Array.isArray(mockSubscriptions)) channels.push(...mockSubscriptions.filter(Boolean));
  let changed_2 = false;
  const now_3 = Date.now();
  channels.forEach(channel_3 => {
    if (Array.isArray(channel_3.dmHistory)) changed_2 = cleanupStaleYtGeneratingMessages(channel_3.dmHistory, now_3) || changed_2;
    if (Array.isArray(channel_3.groupChatHistory)) changed_2 = cleanupStaleYtGeneratingMessages(channel_3.groupChatHistory, now_3) || changed_2;
  });
  if (changed_2) {
    saveYoutubeData();
    const currentRef = getCurrentYtChatThreadRef();
    if (currentRef) refreshYtChatThreadIfVisible(currentRef);
  }
  return changed_2;
}
function markYtChatGenerationFailed(value_79, value_80) {
  const ytChatThread = resolveYtChatThread(value_79?.channelId, value_79?.mode);
  if (!ytChatThread) return;
  const result_81 = ytChatThread.history.find(value_82 => value_82?.generationId === value_80);
  result_81 && (markYtGenerationMessageFailed(result_81), saveYoutubeData(), refreshYtChatThreadIfVisible(value_79));
}
function replaceYtChatGenerationWithReplies(value_83, generationId_3, replyMessages) {
  const thread = resolveYtChatThread(value_83?.channelId, value_83?.mode);
  if (!thread) return false;
  const messages_2 = Array.isArray(replyMessages) ? replyMessages.filter(message_4 => message_4?.text) : [];
  if (!messages_2.length) {
    const result_90 = thread.history.find(value_91 => value_91?.generationId === generationId_3);
    if (result_90) markYtGenerationMessageFailed(result_90);
    return saveYoutubeData(), refreshYtChatThreadIfVisible(value_83), false;
  }
  const placeholderIndex = thread.history.findIndex(message_5 => message_5?.generationId === generationId_3);
  if (placeholderIndex < 0) return false;
  return thread.history.splice(placeholderIndex, 1, ...messages_2), saveYoutubeData(), refreshYtChatThreadIfVisible(value_83), true;
}
function buildYtGeneratedChatMessage(item, index_3 = 0) {
  const normalizedReply = normalizeYtChatReply(item?.reply);
  if (!normalizedReply.text) return null;
  return {
    type: item.type,
    name: item.name,
    speakerId: item.speakerId,
    avatarUrl: item.avatarUrl,
    text: normalizedReply.text,
    translationZh: normalizedReply.translationZh,
    id: createYtChatRuntimeId("yt_reply"),
    source: YT_CHAT_GENERATION_SOURCE,
    createdAt: Date.now() + index_3
  };
}
window.addEventListener("pageshow", cleanupAllStaleYtChatGenerations);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") cleanupAllStaleYtChatGenerations();
});
communityDetailBackBtn && communityDetailBackBtn.addEventListener("click", () => {
  if (communityDetailView) communityDetailView.classList.remove("active");
});
function openPostDetail(value_94) {
  if (!communityDetailView || !communityDetailContent || !currentSubChannelData) return;
  if (typeof window.releaseYtChatKeyboardLock === "function") window.releaseYtChatKeyboardLock(communityDetailView);
  currentActivePost = value_94;
  clearYtPostReplyTarget();
  syncYtPostLikeGrowth(value_94);
  postChatInput && (postChatInput.value = "", postChatInput.placeholder = "发表评论...", postChatInput.setAttribute("enterkeyhint", "send"));
  const userAvatar = document.getElementById("yt-community-user-avatar"),
    userIcon = document.getElementById("yt-community-user-icon"),
    effectiveYtUser = getCurrentYtCommunityUser();
  if (effectiveYtUser.avatarUrl && userAvatar) {
    userAvatar.src = effectiveYtUser.avatarUrl;
    userAvatar.style.display = "block";
    if (userIcon) userIcon.style.display = "none";
  }
  renderPostComments();
  startYtPostLikeGrowthTimer(value_94);
  communityDetailView.classList.add("active");
}
function findYtActivePostList() {
  if (!currentActivePost) return null;
  const candidates = [];
  if (Array.isArray(channelState.communityPosts)) candidates.push(channelState.communityPosts);
  if (Array.isArray(currentSubChannelData?.generatedContent?.communityPosts)) candidates.push(currentSubChannelData.generatedContent.communityPosts);
  if (Array.isArray(currentSubChannelData?.communityPosts)) candidates.push(currentSubChannelData.communityPosts);
  return candidates.find(list => list.includes(currentActivePost)) || candidates.find(list_2 => list_2.some(post_6 => post_6?.id && post_6.id === currentActivePost.id)) || null;
}
function deleteYtActiveCommunityPost() {
  if (!currentActivePost) return;
  const list_3 = findYtActivePostList();
  if (!list_3) return;
  const index_4 = list_3.indexOf(currentActivePost),
    resolvedIndex = index_4 >= 0 ? index_4 : list_3.findIndex(post_7 => post_7?.id && post_7.id === currentActivePost.id);
  if (resolvedIndex < 0) return;
  list_3.splice(resolvedIndex, 1);
  const value_99 = currentActivePost;
  currentActivePost = null;
  clearYtPostReplyTarget();
  stopYtPostLikeGrowthTimer();
  saveYoutubeData();
  if (communityDetailView) communityDetailView.classList.remove("active");
  refreshYtUserCommunityPosts();
  if (typeof renderGeneratedContent === "function") try {
    renderGeneratedContent("community");
  } catch (value_101) {}
  if (typeof window.showToast === "function") window.showToast("贴文已删除");
  return value_99;
}
let renderedYtPost = null;
function renderPostComments() {
  if (!currentActivePost) return;
  const post_8 = currentActivePost,
    ytPostCommentsShape = ensureYtPostCommentsShape(post_8);
  let commentsHtml = "";
  ytPostCommentsShape.length > 0 ? commentsHtml = ytPostCommentsShape.map((c, value_112) => {
    const trim_113 = String(c?.translationZh || "").trim(),
      replies_3 = Array.isArray(c?.replies) ? c.replies : [],
      join_115 = replies_3.map((reply_4, value_118) => {
        const trim_119 = String(reply_4?.translationZh || "").trim(),
          value_120 = "yt-post-translation-" + value_112 + "-" + value_118;
        return "\n                        <div class=\"yt-community-comment-reply\" style=\"display:flex; gap:9px; margin-top:12px; padding:10px 10px 10px 12px; border-left:2px solid #e5e5ea; background:#fafafa; border-radius:0 12px 12px 0;\">\n                            <div class=\"yt-video-avatar\" style=\"width:24px; height:24px; flex-shrink:0; background:#e5e5ea; display:flex; justify-content:center; align-items:center; border-radius:50%; overflow:hidden;\">\n                                " + (reply_4.avatar ? "<img src=\"" + ytEscapeHtml(reply_4.avatar) + "\" style=\"width:100%;height:100%;object-fit:cover;\">" : "<span style=\"font-size:10px;font-weight:bold;color:#555;\">" + ytEscapeHtml(String(reply_4.name || "?").charAt(0).toUpperCase()) + "</span>") + "\n                            </div>\n                            <div style=\"flex:1;min-width:0;\">\n                                <div class=\"yt-post-comment-reply-target\" role=\"button\" tabindex=\"0\" data-root-index=\"" + value_112 + "\" data-reply-index=\"" + value_118 + "\" style=\"cursor:pointer;\">\n                                    <div style=\"font-size:12px;color:#606060;margin-bottom:3px;\">" + ytEscapeHtml(reply_4.name || "用户") + "</div>\n                                    <div style=\"font-size:13px;color:#0f0f0f;line-height:1.4;\">" + (reply_4.replyTo ? "<span style=\"color:#606060;\">回复 @" + ytEscapeHtml(reply_4.replyTo) + "：</span>" : "") + formatYtPostText(reply_4.text) + "</div>\n                                </div>\n                                <div style=\"font-size:12px;color:#8e8e93;margin-top:5px;display:flex;gap:14px;\">\n                                    <span class=\"yt-post-comment-reply-action\" role=\"button\" tabindex=\"0\" data-root-index=\"" + value_112 + "\" data-reply-index=\"" + value_118 + "\" style=\"font-weight:600;cursor:pointer;\">回复</span>\n                                    " + (trim_119 ? "<span class=\"yt-post-comment-translation-toggle\" role=\"button\" tabindex=\"0\" aria-expanded=\"false\" aria-controls=\"" + value_120 + "\" style=\"font-weight:600;cursor:pointer;\">翻译</span>" : "") + "\n                                    <span class=\"yt-post-comment-delete-btn\" role=\"button\" tabindex=\"0\" data-root-index=\"" + value_112 + "\" data-reply-index=\"" + value_118 + "\" style=\"color:#8e8e93;cursor:pointer;\">删除</span>\n                                </div>\n                                " + (trim_119 ? "<div class=\"yt-post-comment-translation is-reply\" id=\"" + value_120 + "\" hidden>" + formatYtPostText(trim_119) + "</div>" : "") + "\n                            </div>\n                        </div>\n                    ";
      }).join(""),
      value_116 = "yt-post-translation-" + value_112 + "-root";
    return "\n                <div class=\"yt-community-comment-item\">\n                    <div class=\"yt-video-avatar\" style=\"width:30px; height:30px; flex-shrink: 0; background-color: #f2f2f2; display: flex; justify-content: center; align-items: center; border-radius: 50%; overflow: hidden;\">\n                        " + (c.avatar ? "<img src=\"" + ytEscapeHtml(c.avatar) + "\" style=\"width:100%;height:100%;object-fit:cover;\">" : "<span style=\"font-size:12px; font-weight:bold; color:#555;\">" + ytEscapeHtml(c.name ? c.name[0].toUpperCase() : "?") + "</span>") + "\n                    </div>\n                    <div style=\"flex:1;min-width:0;\">\n                        <div class=\"yt-post-comment-reply-target\" role=\"button\" tabindex=\"0\" data-root-index=\"" + value_112 + "\" style=\"cursor:pointer;\">\n                            <div style=\"font-size: 13px; color: #606060; margin-bottom: 4px;\">" + ytEscapeHtml(c.name) + "</div>\n                            <div style=\"font-size: 14px; color: #0f0f0f; line-height: 1.4;\">" + formatYtPostText(c.text) + "</div>\n                        </div>\n                        <div style=\"font-size: 12px; color: #8e8e93; margin-top: 6px; display: flex; gap: 16px;\">\n                            <span><i class=\"far fa-thumbs-up\"></i> " + (Number.isFinite(Number(c.likes)) ? Math.max(0, Math.round(Number(c.likes))) : 0) + "</span>\n                            <span><i class=\"far fa-thumbs-down\"></i></span>\n                            <span class=\"yt-post-comment-reply-action\" role=\"button\" tabindex=\"0\" data-root-index=\"" + value_112 + "\" style=\"font-weight:600;cursor:pointer;\">回复</span>\n                            " + (trim_113 ? "<span class=\"yt-post-comment-translation-toggle\" role=\"button\" tabindex=\"0\" aria-expanded=\"false\" aria-controls=\"" + value_116 + "\" style=\"font-weight:600;cursor:pointer;\">翻译</span>" : "") + "\n                            <span class=\"yt-post-comment-delete-btn\" role=\"button\" tabindex=\"0\" data-root-index=\"" + value_112 + "\" style=\"color:#8e8e93;cursor:pointer;\">删除</span>\n                        </div>\n                        " + (trim_113 ? "<div class=\"yt-post-comment-translation is-root\" id=\"" + value_116 + "\" hidden>" + formatYtPostText(trim_113) + "</div>" : "") + "\n                        " + join_115 + "\n                    </div>\n                </div>\n            ";
  }).join("") : commentsHtml = "<div style=\"text-align:center; padding: 20px; color:#8e8e93; font-size:13px;\" id=\"yt-empty-post-comments\">暂无评论</div>";
  const innerHTML_2 = post_8.commentsStatus === "loading" ? "<div style=\"font-size:12px;color:#8e8e93;margin:0 0 12px;\"><i class=\"fas fa-circle-notch fa-spin\"></i> 评论生成中</div>" : post_8.commentsStatus === "failed" ? "<div style=\"font-size:12px;color:#ff3b30;margin:0 0 12px;\">评论生成失败，贴文已保留</div>" : "",
    postTranslationZh = String(post_8.translationZh || post_8.contentTranslationZh || post_8.translation || "").trim(),
    ytPostCommentsContainerElement = communityDetailContent.querySelector("#yt-post-comments-container"),
    value_106 = renderedYtPost === post_8 && !!ytPostCommentsContainerElement,
    scrollTop_2 = communityDetailContent.scrollTop,
    value_108 = value_106 ? new Set([...ytPostCommentsContainerElement.querySelectorAll(".yt-post-comment-translation:not([hidden])")].map(value_121 => value_121.id)) : new Set(),
    innerHTML_3 = "<div style=\"font-size: 14px; font-weight: 500; margin-bottom: 16px;\">评论</div>" + commentsHtml;
  if (value_106) {
    ytPostCommentsContainerElement.innerHTML = innerHTML_3;
    ytPostCommentsContainerElement.querySelectorAll(".yt-post-comment-translation").forEach(translation_2 => {
      if (value_108.has(translation_2.id)) {
        translation_2.removeAttribute("hidden");
        const querySelector_123 = ytPostCommentsContainerElement.querySelector("[aria-controls=\"" + translation_2.id + "\"]");
        querySelector_123 && (querySelector_123.textContent = "收起翻译", querySelector_123.setAttribute("aria-expanded", "true"));
      }
    });
    const ytCommunityPostCommentCountElement = communityDetailContent.querySelector("#yt-community-post-comment-count");
    if (ytCommunityPostCommentCountElement) ytCommunityPostCommentCountElement.textContent = String(countYtPostComments(post_8));
    const likeCount_2 = communityDetailContent.querySelector("#yt-community-post-like-count");
    if (likeCount_2) likeCount_2.textContent = formatYtPostLikeCount(post_8.likes);
    const ytCommunityPostStatusElement = communityDetailContent.querySelector("#yt-community-post-status");
    if (ytCommunityPostStatusElement) ytCommunityPostStatusElement.innerHTML = innerHTML_2;
  } else {
    communityDetailContent.innerHTML = "\n            <div style=\"display: flex; align-items: center; margin-bottom: 12px; gap: 10px;\">\n                <div class=\"yt-video-avatar\" style=\"width:40px; height:40px;\"><img src=\"" + (typeof resolveYtChannelAvatar === "function" ? resolveYtChannelAvatar(currentSubChannelData) : currentSubChannelData.avatar || "") + "\"></div>\n                <div style=\"flex:1;\">\n                    <div style=\"font-size:15px; font-weight:500;\">" + ytEscapeHtml(currentSubChannelData.name || "未知") + "</div>\n                    <div style=\"font-size:12px; color:#606060;\">" + (post_8.time || "刚刚") + "</div>\n                </div>\n            </div>\n            <div style=\"font-size: 15px; line-height: 1.5; color: #0f0f0f; margin-bottom: 16px;\">\n                " + formatYtPostText(post_8.content || "") + "\n            </div>\n            " + (postTranslationZh ? "\n                <span class=\"yt-community-content-translation-toggle\" role=\"button\" tabindex=\"0\" aria-expanded=\"false\" aria-controls=\"yt-community-detail-post-translation\">翻译</span>\n                <div class=\"yt-community-post-translation\" id=\"yt-community-detail-post-translation\" hidden>" + formatYtPostText(postTranslationZh) + "</div>\n            " : "") + "\n            " + (post_8.imageUrl ? "<img src=\"" + ytEscapeHtml(post_8.imageUrl) + "\" alt=\"贴文图片\" style=\"display:block;width:100%;max-height:420px;object-fit:cover;border-radius:16px;margin:0 0 16px;\">" : "") + "\n            <div id=\"yt-community-post-status\">" + innerHTML_2 + "</div>\n            <div style=\"display: flex; gap: 24px; color: #606060; font-size: 14px; padding-bottom: 16px;\">\n                <span><i class=\"far fa-thumbs-up\"></i> <span id=\"yt-community-post-like-count\">" + formatYtPostLikeCount(post_8.likes) + "</span></span>\n                <span><i class=\"far fa-thumbs-down\"></i></span>\n                <span><i class=\"far fa-comment\"></i> <span id=\"yt-community-post-comment-count\">" + countYtPostComments(post_8) + "</span></span>\n            </div>\n\n            <div class=\"yt-community-comments-section\" id=\"yt-post-comments-container\">\n                " + innerHTML_3 + "\n            </div>\n        ";
    renderedYtPost = post_8;
  }
  communityDetailContent.scrollTop = scrollTop_2;
  const communityDetailContent_2 = value_106 ? ytPostCommentsContainerElement : communityDetailContent;
  communityDetailContent_2.querySelectorAll(".yt-post-comment-translation-toggle, .yt-community-content-translation-toggle").forEach(button => {
    const toggleTranslation = event_124 => {
      event_124.stopPropagation();
      const translationId = button.getAttribute("aria-controls"),
        translation_3 = translationId ? document.getElementById(translationId) : button.nextElementSibling;
      if (!translation_3) return;
      const isExpanded_2 = translation_3.hasAttribute("hidden");
      if (isExpanded_2) translation_3.removeAttribute("hidden");else translation_3.setAttribute("hidden", "");
      button.textContent = isExpanded_2 ? "收起翻译" : "翻译";
      button.setAttribute("aria-expanded", String(isExpanded_2));
    };
    button.addEventListener("click", toggleTranslation);
    button.addEventListener("keydown", event_4 => {
      if (event_4.key !== "Enter" && event_4.key !== " ") return;
      event_4.preventDefault();
      toggleTranslation(event_4);
    });
  });
  communityDetailContent_2.querySelectorAll(".yt-post-comment-reply-target").forEach(value_128 => {
    const value_129 = () => {
      const number_130 = Number(value_128.dataset.rootIndex),
        value_131 = post_8.comments?.[number_130];
      if (!value_131) return;
      const value_132 = value_128.dataset.replyIndex === undefined ? -1 : Number(value_128.dataset.replyIndex),
        value_133 = value_132 >= 0 ? value_131.replies?.[value_132]?.name : value_131.name;
      setYtPostReplyTarget(value_131, value_133);
    };
    value_128.addEventListener("click", event_134 => {
      event_134.stopPropagation();
      value_129();
    });
    value_128.addEventListener("keydown", event_135 => {
      if (event_135.key !== "Enter" && event_135.key !== " ") return;
      event_135.preventDefault();
      value_129();
    });
  });
  communityDetailContent_2.querySelectorAll(".yt-post-comment-reply-action").forEach(value_136 => {
    const value_137 = () => {
      const number_138 = Number(value_136.dataset.rootIndex),
        value_139 = post_8.comments?.[number_138];
      if (!value_139) return;
      const value_140 = value_136.dataset.replyIndex === undefined ? -1 : Number(value_136.dataset.replyIndex),
        value_141 = value_140 >= 0 ? value_139.replies?.[value_140]?.name : value_139.name;
      setYtPostReplyTarget(value_139, value_141);
    };
    value_136.addEventListener("click", event_142 => {
      event_142.stopPropagation();
      value_137();
    });
    value_136.addEventListener("keydown", event_143 => {
      if (event_143.key !== "Enter" && event_143.key !== " ") return;
      event_143.preventDefault();
      value_137();
    });
  });
  communityDetailContent_2.querySelectorAll(".yt-post-comment-delete-btn").forEach(value_144 => {
    const value_145 = () => {
      const rootIndex_2 = Number(value_144.dataset.rootIndex);
      if (!Array.isArray(post_8.comments) || rootIndex_2 < 0 || rootIndex_2 >= post_8.comments.length) return;
      const rootComment_3 = post_8.comments[rootIndex_2],
        replyIndex_3 = value_144.dataset.replyIndex === undefined ? -1 : Number(value_144.dataset.replyIndex);
      if (replyIndex_3 >= 0) {
        if (!Array.isArray(rootComment_3.replies) || replyIndex_3 >= rootComment_3.replies.length) return;
        rootComment_3.replies.splice(replyIndex_3, 1);
      } else post_8.comments.splice(rootIndex_2, 1);
      if (currentPostReplyTarget?.rootComment === rootComment_3) clearYtPostReplyTarget();
      post_8.commentsCount = countYtPostComments(post_8);
      saveYoutubeData();
      renderPostComments();
      refreshYtUserCommunityPosts(true);
    };
    value_144.addEventListener("click", event_149 => {
      event_149.stopPropagation();
      value_145();
    });
    value_144.addEventListener("keydown", event_150 => {
      if (event_150.key !== "Enter" && event_150.key !== " ") return;
      event_150.preventDefault();
      value_145();
    });
  });
}
function resolveYtPostReplyRoot(replyTarget_2) {
  if (!replyTarget_2?.rootComment || !currentActivePost) return null;
  const comments_3 = ensureYtPostCommentsShape(currentActivePost);
  if (comments_3.includes(replyTarget_2.rootComment)) return replyTarget_2.rootComment;
  const targetId = replyTarget_2.rootComment.id;
  return targetId ? comments_3.find(comment_7 => comment_7.id === targetId) || null : null;
}
function addPostCommentMessage(name_3, text_5, isUser = false, translationZh_2 = "", options_2 = {}) {
  const ytPostCommentsContainerElement_159 = document.getElementById("yt-post-comments-container");
  if (!ytPostCommentsContainerElement_159) return;
  const emptyMsg = document.getElementById("yt-empty-post-comments");
  if (emptyMsg) emptyMsg.remove();
  if (!currentActivePost.comments) currentActivePost.comments = [];
  const effectiveYtUser_2 = getCurrentYtCommunityUser(),
    rawComment_2 = {
      id: makeYtPostCommentId(),
      name: name_3,
      text: text_5,
      speakerType: isUser ? "user" : "fan",
      avatar: isUser ? effectiveYtUser_2.avatarUrl || null : null,
      translationZh: isUser ? "" : String(translationZh_2 || "").trim()
    },
    ytPostCommentEntry = normalizeYtPostCommentEntry(rawComment_2, currentActivePost.comments.length),
    replyTarget_3 = options_2.replyTarget || currentPostReplyTarget,
    rootComment_7 = resolveYtPostReplyRoot(replyTarget_3),
    wasReply_2 = !!rootComment_7;
  wasReply_2 ? (rootComment_7.replies = Array.isArray(rootComment_7.replies) ? rootComment_7.replies : [], ytPostCommentEntry.replyTo = replyTarget_3.replyToName, rootComment_7.replies.push(ytPostCommentEntry)) : currentActivePost.comments.push(ytPostCommentEntry);
  currentActivePost.commentsCount = countYtPostComments(currentActivePost);
  if (isUser) currentActivePost.likes = parseYtPostLikeCount(currentActivePost.likes) + 1;
  if (options_2.clearReplyTarget !== false) clearYtPostReplyTarget();
  return saveYoutubeData(), renderPostComments(), refreshYtUserCommunityPosts(true), {
    comment: ytPostCommentEntry,
    rootComment: rootComment_7,
    wasReply: wasReply_2
  };
}
postChatSend && postChatInput && (postChatSend.addEventListener("click", async () => {
  const text_6 = postChatInput.value.trim();
  if (!text_6 || !currentActivePost) return;
  const effectiveYtUser_3 = getCurrentYtCommunityUser(),
    added = addPostCommentMessage(effectiveYtUser_3.name || "我", text_6, true);
  postChatInput.value = "";
  if (added?.wasReply) {
    const container = document.getElementById("yt-post-comments-container");
    let loadingId = null;
    if (container) {
      loadingId = "yt-post-thread-reply-loading";
      const loadingDiv = document.createElement("div");
      loadingDiv.id = loadingId;
      loadingDiv.style.textAlign = "center";
      loadingDiv.style.padding = "10px";
      loadingDiv.style.color = "#8e8e93";
      loadingDiv.style.fontSize = "12px";
      loadingDiv.innerHTML = "<i class=\"fas fa-circle-notch fa-spin\"></i> 楼中楼回复生成中...";
      container.appendChild(loadingDiv);
    }
    try {
      await generateYtPostThreadReplies(currentActivePost, added.rootComment, added.comment);
    } finally {
      if (loadingId) {
        const el = document.getElementById(loadingId);
        if (el) el.remove();
      }
    }
    return;
  }
  if (currentActivePost.isUserPost) return;
  const container_2 = document.getElementById("yt-post-comments-container");
  let id_3 = null;
  if (container_2) {
    id_3 = "yt-post-reply-loading";
    const loadingDiv_2 = document.createElement("div");
    loadingDiv_2.id = id_3;
    loadingDiv_2.style.textAlign = "center";
    loadingDiv_2.style.padding = "10px";
    loadingDiv_2.style.color = "#8e8e93";
    loadingDiv_2.style.fontSize = "12px";
    loadingDiv_2.innerHTML = "<i class=\"fas fa-circle-notch fa-spin\"></i> 回复生成中...";
    container_2.appendChild(loadingDiv_2);
  }
  try {
    const responseObj = await getVODResponse(text_6, currentActivePost.content, true);
    renderVODResponse(responseObj, true);
  } finally {
    if (id_3) {
      const emptyMsg_2 = document.getElementById(id_3);
      if (emptyMsg_2) emptyMsg_2.remove();
    }
  }
}), window.mobileInputCompat?.register({
  input: postChatInput,
  root: communityDetailView,
  scrollContainer: communityDetailContent,
  onSend: () => postChatSend.click(),
  allowEmpty: true,
  openClasses: ["keyboard-open", "yt-chat-keyboard-lock"]
}));
function refreshYtUserCommunityPosts(value_174 = false) {
  const profileMainTabsYtSlidingTabActiveDataTargetCommunityElement = document.querySelector("#profile-main-tabs .yt-sliding-tab.active[data-target=\"community\"]");
  if (profileMainTabsYtSlidingTabActiveDataTargetCommunityElement) profileMainTabsYtSlidingTabActiveDataTargetCommunityElement.click();
  if (!value_174 && currentActivePost?.isUserPost && communityDetailView?.classList.contains("active")) renderPostComments();
}
function resetYtUserPostComposer() {
  if (userPostContentInput) userPostContentInput.value = "";
  userPostImagePreview && (userPostImagePreview.src = "", userPostImagePreview.removeAttribute("data-image-ready"));
  if (userPostImageWrapper) userPostImageWrapper.style.display = "none";
  if (userPostImageDescriptionGroup) userPostImageDescriptionGroup.style.display = "none";
  if (userPostImageDescriptionInput) userPostImageDescriptionInput.value = "";
  if (userPostImageUpload) userPostImageUpload.value = "";
}
window.openYtUserPostComposer = function () {
  resetYtUserPostComposer();
  if (userPostComposeSheet) userPostComposeSheet.classList.add("active");
  setTimeout(() => {
    if (!userPostComposeSheet?.classList.contains("active")) return;
    userPostContentInput?.focus({
      preventScroll: true
    });
  }, 120);
};
window.openYtUserCommunityPost = function (post_9) {
  if (!post_9) return;
  const effectiveUser = getCurrentYtCommunityUser();
  currentSubChannelData = channelState.userCommunityChannel || {
    id: "user_channel_id",
    name: effectiveUser.name || "我的频道",
    avatar: effectiveUser.avatarUrl || "",
    desc: effectiveUser.persona || ""
  };
  openPostDetail(post_9);
};
userPostComposeSheet && userPostComposeSheet.addEventListener("mousedown", event_176 => {
  if (event_176.target === userPostComposeSheet) userPostComposeSheet.classList.remove("active");
});
userPostImageAddBtn && userPostImageUpload && (userPostImageAddBtn.addEventListener("click", () => userPostImageUpload.click()), userPostImageUpload.addEventListener("change", event_177 => {
  const value_178 = event_177.target.files?.[0];
  if (!value_178) return;
  const value_179 = new FileReader();
  value_179.onload = loadEvent => {
    const applyImage = src_2 => {
      userPostImagePreview && (userPostImagePreview.src = src_2, userPostImagePreview.setAttribute("data-image-ready", "true"));
      if (userPostImageWrapper) userPostImageWrapper.style.display = "block";
      if (userPostImageDescriptionGroup) userPostImageDescriptionGroup.style.display = "block";
    };
    if (window.compressImage) window.compressImage(loadEvent.target.result, 1280, 1280, applyImage);else applyImage(loadEvent.target.result);
  };
  value_179.readAsDataURL(value_178);
  event_177.target.value = "";
}));
userPostImageRemoveBtn && userPostImageRemoveBtn.addEventListener("click", event_183 => {
  event_183.preventDefault();
  userPostImagePreview && (userPostImagePreview.src = "", userPostImagePreview.removeAttribute("data-image-ready"));
  if (userPostImageWrapper) userPostImageWrapper.style.display = "none";
  if (userPostImageDescriptionGroup) userPostImageDescriptionGroup.style.display = "none";
  if (userPostImageDescriptionInput) userPostImageDescriptionInput.value = "";
});
function buildYtPostCommentContext(value_184, rootComment_4 = null) {
  const ytPostCommentsShape_186 = ensureYtPostCommentsShape(value_184);
  if (rootComment_4) {
    const replies_4 = Array.isArray(rootComment_4.replies) ? rootComment_4.replies : [];
    return ["根评论：" + (rootComment_4.name || "观众") + "：" + (rootComment_4.text || ""), "已有楼中楼：" + (replies_4.map(value_188 => "" + (value_188.name || "观众") + (value_188.replyTo ? " 回复 @" + value_188.replyTo : "") + "：" + (value_188.text || "")).join("\n") || "无")].join("\n");
  }
  return ytPostCommentsShape_186.slice(0, 30).map(value_189 => {
    const value_190 = Array.isArray(value_189.replies) && value_189.replies.length > 0 ? "\n  楼中楼：" + value_189.replies.map(value_191 => "" + (value_191.name || "观众") + (value_191.replyTo ? " 回复 @" + value_191.replyTo : "") + "：" + (value_191.text || "")).join(" | ") : "";
    return (value_189.name || "观众") + "：" + (value_189.text || "") + value_190;
  }).join("\n") || "无";
}
function buildYtPostCharPromptContext() {
  const chars = getYtPostAvailableChars();
  if (chars.length === 0) return "无可用 Char";
  return JSON.stringify(chars.slice(0, 30).map(char_3 => ({
    speakerId: char_3.id,
    name: char_3.name,
    persona: char_3.persona || ""
  })));
}
function normalizeYtGeneratedPostComments(rawComments, value_194 = 15) {
  const source_3 = Array.isArray(rawComments) ? rawComments : [];
  return source_3.slice(0, value_194).map((text_10, value_197) => {
    const raw = typeof text_10 === "string" ? {
        name: "观众" + (value_197 + 1),
        text: text_10
      } : text_10 && typeof text_10 === "object" ? text_10 : {},
      languageContext = typeof window.getYtChannelLanguageContext === "function" ? window.getYtChannelLanguageContext(currentSubChannelData) : null,
      localized = typeof window.normalizeYtLocalizedContent === "function" ? window.normalizeYtLocalizedContent(raw, languageContext) : {
        text: String(raw.text || raw.content || "").trim(),
        translationZh: String(raw.translationZh || raw.translation || "").trim()
      },
      text_11 = localized.text;
    if (!text_11) return null;
    return normalizeYtPostCommentEntry({
      id: makeYtPostCommentId(),
      speakerType: raw.speakerType || raw.type || "",
      speakerId: raw.speakerId || raw.charId || raw.imCharId || "",
      name: raw.name || raw.speakerName || "观众" + (value_197 + 1),
      avatar: raw.avatar || raw.avatarUrl || "",
      text: text_11,
      translationZh: localized.translationZh,
      likes: raw.likes
    }, value_197);
  }).filter(Boolean);
}
async function requestYtPostGeneratedComments({
  post: post_10,
  mode = "top",
  rootComment = null,
  userReply = null
} = {}) {
  if (!post_10) throw new Error("NO_POST");
  if (!window.apiConfig?.endpoint || !window.apiConfig?.apiKey) throw new Error("API_NOT_CONFIGURED");
  const currentYtCommunityUser_203 = getCurrentYtCommunityUser(),
    value_204 = window.getYtWorldBookContext ? window.getYtWorldBookContext((post_10.content || "") + "\n" + (rootComment?.text || "") + "\n" + (userReply?.text || "")) : "",
    imageContext = post_10.imageUrl ? post_10.imageDescription || "用户未填写图片描述" : "无图片",
    ytPostCommentContext = buildYtPostCommentContext(post_10, rootComment),
    ytPostCharPromptContext = buildYtPostCharPromptContext(),
    value_206 = mode === "thread" ? "你正在模拟 YouTube 社群贴文某条评论下的楼中楼讨论。用户刚刚回复了别人：" + (userReply?.name || currentYtCommunityUser_203.name || "User") + "：" + (userReply?.text || "") + "\n请在同一个楼中楼线程继续生成 10–15 条自然、有差异的后续回复，应该排在用户回复之后。可以有人回应用户、回应根评论、互相补充或跑题闲聊；不要冒充发布者或 User。" : "请为当前贴文继续生成 10–15 条新的顶层评论，参考已有评论但避免重复昵称、重复观点和机械复读。不要冒充发布者或 User。";
  let content_2 = "你要模拟真实 YouTube 社群贴文下的国际化评论区。\n发布者：" + (currentYtCommunityUser_203.name || "用户") + "\n发布者人设：" + (currentYtCommunityUser_203.persona || "未设置") + "\n贴文正文：" + post_10.content + "\n图片内容描述：" + imageContext + "\n世界书：" + (value_204 || "无") + "\n可用 Char 列表：" + ytPostCharPromptContext + "\n现有评论上下文：\n" + ytPostCommentContext + "\n\n" + value_206 + "\n\n输出规则：\n1. 评论者可以是普通国际观众，也可以是可用 Char 列表中的角色。\n2. 如果使用 Char，speakerType 必须是 \"char\"，speakerId 必须填写可用 Char 列表里的 speakerId；前端会用真实 Char 名字和头像展示。\n3. 普通观众 speakerType 填 \"fan\" 或留空，name 使用自然昵称。\n4. YouTube 是国际化平台：text 不是中文时 translationZh 必须提供自然中文翻译；text 是中文时 translationZh 必须为空字符串。\n5. 必须一次返回不少于 10 条，最多 15 条。\n只返回严格 JSON：{\"comments\":[{\"speakerType\":\"fan或char\",\"speakerId\":\"Char ID或空字符串\",\"name\":\"评论者昵称\",\"text\":\"评论内容\",\"translationZh\":\"中文翻译或空字符串\",\"likes\":0}]}。不要 Markdown。";
  typeof window.buildYtLocalizedJsonContract === "function" && (content_2 += window.buildYtLocalizedJsonContract(currentSubChannelData, "every generated comment and thread reply text field"));
  const chatCompletionsEndpoint = window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint),
    value_208 = await fetch(chatCompletionsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.apiConfig.apiKey
      },
      body: JSON.stringify({
        model: window.apiConfig.model || "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: content_2
        }],
        temperature: 0.9,
        response_format: {
          type: "json_object"
        }
      })
    });
  if (!value_208.ok) throw window.u2Api?.createHttpError?.(value_208, await window.u2Api?.readApiError?.(value_208)) || Object.assign(new Error("HTTP " + value_208.status), {
    status: value_208.status
  });
  const data = await value_208.json(),
    rawText = String(data?.choices?.[0]?.message?.content || "").replace(/```json/gi, "").replace(/```/g, "").trim(),
    parsed_2 = sanitizeObj(JSON.parse(rawText)),
    rawComments_2 = Array.isArray(parsed_2?.comments) ? parsed_2.comments : Array.isArray(parsed_2?.replies) ? parsed_2.replies : Array.isArray(parsed_2?.threadReplies) ? parsed_2.threadReplies : [],
    comments_4 = normalizeYtGeneratedPostComments(rawComments_2, 15);
  if (comments_4.length < 10) throw new Error("TOO_FEW_COMMENTS");
  return comments_4;
}
function appendYtPostTopLevelComments(post_11, comments_5) {
  if (!post_11 || !Array.isArray(comments_5)) return 0;
  ensureYtPostCommentsShape(post_11);
  comments_5.forEach(comment_8 => post_11.comments.push(comment_8));
  post_11.commentsCount = countYtPostComments(post_11);
  post_11.commentsStatus = "ready";
  saveYoutubeData();
  if (currentActivePost === post_11 && communityDetailView?.classList.contains("active")) renderPostComments();
  return refreshYtUserCommunityPosts(true), comments_5.length;
}
function appendYtPostThreadReplies(post_12, rootComment_5, comments_6, replyToName_3 = "") {
  if (!post_12 || !rootComment_5 || !Array.isArray(comments_6)) return 0;
  const resolvedRoot = resolveYtPostReplyRoot({
    rootComment: rootComment_5
  });
  if (!resolvedRoot) return 0;
  resolvedRoot.replies = Array.isArray(resolvedRoot.replies) ? resolvedRoot.replies : [];
  comments_6.forEach(comment_9 => {
    comment_9.replyTo = comment_9.replyTo || replyToName_3 || "";
    resolvedRoot.replies.push(comment_9);
  });
  post_12.commentsCount = countYtPostComments(post_12);
  saveYoutubeData();
  if (currentActivePost === post_12 && communityDetailView?.classList.contains("active")) renderPostComments();
  return refreshYtUserCommunityPosts(true), comments_6.length;
}
async function generateYtPostThreadReplies(post_13, rootComment_6, userReply_2) {
  try {
    const comments_7 = await requestYtPostGeneratedComments({
        post: post_13,
        mode: "thread",
        rootComment: rootComment_6,
        userReply: userReply_2
      }),
      added_2 = appendYtPostThreadReplies(post_13, rootComment_6, comments_7, userReply_2?.name || "");
    if (added_2 > 0 && window.showToast) window.showToast("已生成 " + added_2 + " 条楼中楼回复");
  } catch (error_2) {
    console.error("User community post thread replies failed:", error_2);
    window.showToast && window.showToast(error_2?.message === "API_NOT_CONFIGURED" ? "回复已发送，请先配置 API" : "回复已发送，后续评论生成失败");
  }
}
async function generateYtUserPostComments(post_16) {
  try {
    const value_228 = await requestYtPostGeneratedComments({
      post: post_16,
      mode: "top"
    });
    appendYtPostTopLevelComments(post_16, value_228);
  } catch (error_3) {
    console.error("User community post comments failed:", error_3);
    post_16.commentsStatus = "failed";
    saveYoutubeData();
    refreshYtUserCommunityPosts();
    window.showToast && window.showToast(error_3?.message === "API_NOT_CONFIGURED" ? "贴文已发布，请先配置 API" : "贴文已发布，评论生成失败");
  }
}
async function generateYtPostTopCommentsFromButton() {
  if (!currentActivePost || ytPostCommentGenerationLocked) return;
  const post_14 = currentActivePost;
  setYtPostGenerateButtonLoading(true);
  post_14.commentsStatus = "loading";
  saveYoutubeData();
  renderPostComments();
  try {
    const value_231 = await requestYtPostGeneratedComments({
        post: post_14,
        mode: "top"
      }),
      appendYtPostTopLevelComments_232 = appendYtPostTopLevelComments(post_14, value_231);
    if (window.showToast) window.showToast("已生成 " + appendYtPostTopLevelComments_232 + " 条评论");
  } catch (error_4) {
    console.error("Manual community post comments failed:", error_4);
    post_14.commentsStatus = "failed";
    saveYoutubeData();
    renderPostComments();
    refreshYtUserCommunityPosts(true);
    if (window.u2Api?.isRequestError?.(error_4) && window.u2Api.reportError(error_4, {
      operation: "评论生成"
    })) {} else window.showToast && window.showToast(error_4?.message === "API_NOT_CONFIGURED" ? "请先配置 API" : "评论生成失败");
  } finally {
    setYtPostGenerateButtonLoading(false);
  }
}
communityDetailGenerateBtn && communityDetailGenerateBtn.addEventListener("click", event_234 => {
  event_234.preventDefault();
  event_234.stopPropagation();
  generateYtPostTopCommentsFromButton();
});
communityDetailDeletePostBtn && communityDetailDeletePostBtn.addEventListener("click", event_235 => {
  event_235.preventDefault();
  event_235.stopPropagation();
  deleteYtActiveCommunityPost();
});
userPostPublishBtn && userPostPublishBtn.addEventListener("click", () => {
  const content_3 = userPostContentInput?.value.trim() || "";
  if (!content_3) {
    if (window.showToast) window.showToast("请输入贴文正文");
    return;
  }
  const hasImage = userPostImagePreview?.getAttribute("data-image-ready") === "true",
    post_15 = {
      id: "user_post_" + Date.now(),
      isUserPost: true,
      content: content_3,
      translationZh: "",
      imageUrl: hasImage ? userPostImagePreview.src : "",
      imageDescription: hasImage ? userPostImageDescriptionInput?.value.trim() || "" : "",
      time: "刚刚",
      createdAt: Date.now(),
      likes: 0,
      lastLikeGrowthAt: Date.now(),
      comments: [],
      commentsCount: 0,
      commentsStatus: "loading"
    };
  channelState.communityPosts = Array.isArray(channelState.communityPosts) ? channelState.communityPosts : [];
  channelState.communityPosts.unshift(post_15);
  saveYoutubeData();
  if (userPostComposeSheet) userPostComposeSheet.classList.remove("active");
  resetYtUserPostComposer();
  document.querySelector(".yt-nav-item[data-target=\"yt-profile-tab\"]")?.click();
  setTimeout(() => document.querySelector("#profile-main-tabs .yt-sliding-tab[data-target=\"community\"]")?.click(), 0);
  generateYtUserPostComments(post_15);
});
const groupChatView = document.getElementById("yt-bubble-chat-view"),
  groupChatBackBtn = document.getElementById("yt-bubble-chat-back-btn"),
  groupChatTitle = document.getElementById("yt-bubble-chat-title"),
  groupChatContainer = document.getElementById("yt-bubble-chat-container"),
  groupChatInput = document.getElementById("yt-bubble-chat-input"),
  groupChatApiBtn = document.getElementById("yt-bubble-chat-api-btn"),
  groupChatSendBtn = document.getElementById("yt-bubble-chat-send-btn"),
  groupChatSettingsBtn = document.getElementById("yt-bubble-chat-settings-btn"),
  groupSettingsSheet = document.getElementById("yt-group-settings-sheet"),
  groupNameInput = document.getElementById("yt-group-name-input"),
  groupOwnerInfo = document.getElementById("yt-group-owner-info"),
  groupSettingsSaveBtn = document.getElementById("yt-save-group-settings-btn"),
  groupMemberCount = document.getElementById("yt-group-member-count"),
  groupOwnerStatus = document.getElementById("yt-group-owner-status"),
  groupAdminSettingsGroup = document.getElementById("yt-group-admin-settings-group"),
  groupAdminManageBtn = document.getElementById("yt-group-admin-manage-btn"),
  groupAdminCount = document.getElementById("yt-group-admin-count");
let isGroupChatLoading = false;
function getCurrentYtFanGroup() {
  return currentSubChannelData?.generatedContent?.fanGroup || null;
}
function parseYtGroupMemberCount(value_16, fallback = 1) {
  if (Number.isFinite(Number(value_16))) return Math.max(1, Math.round(Number(value_16)));
  const match_2 = String(value_16 || "").replace(/,/g, "").match(/[\d.]+/);
  if (!match_2) return fallback;
  const parsed = Number(match_2[0]);
  if (!Number.isFinite(parsed)) return fallback;
  if (String(value_16).includes("万")) return Math.max(1, Math.round(parsed * 10000));
  return Math.max(1, Math.round(parsed));
}
function formatYtGroupMemberCount(value_18) {
  const count_3 = parseYtGroupMemberCount(value_18, 1);
  if (count_3 >= 10000) return (count_3 / 10000).toFixed(count_3 % 10000 === 0 ? 0 : 1) + "万人";
  return count_3 + "人";
}
window.applyYtUserCommunityLiveGrowth = function ({
  liveId: liveId_2,
  newSubs: newSubs_2,
  totalViews: totalViews_2
} = {}) {
  const fanGroup_2 = channelState.userCommunityChannel?.generatedContent?.fanGroup,
    trim_246 = String(liveId_2 || "").trim();
  if (!fanGroup_2 || !trim_246 || String(fanGroup_2.lastGrowthLiveId || "") === trim_246) return 0;
  const growth_2 = Math.max(1, Math.round((Number(newSubs_2) || 0) * 0.5 + (Number(totalViews_2) || 0) * 0.02));
  fanGroup_2.memberCount = parseYtGroupMemberCount(fanGroup_2.memberCount, 1) + growth_2;
  fanGroup_2.lastGrowthLiveId = trim_246;
  if (typeof renderMessagesList === "function") renderMessagesList();
  return currentSubChannelData?.isUserOwnedCommunity && groupChatTitle && (groupChatTitle.textContent = fanGroup_2.name + " (" + formatYtGroupMemberCount(fanGroup_2.memberCount) + ")"), currentSubChannelData?.isUserOwnedCommunity && groupMemberCount && (groupMemberCount.textContent = formatYtGroupMemberCount(fanGroup_2.memberCount)), growth_2;
};
[groupChatContainer, groupChatInput, groupChatSendBtn, groupChatApiBtn, groupChatBackBtn, groupChatSettingsBtn].filter(Boolean).forEach(value_248 => {
  value_248.addEventListener("click", stopCommunityControlEvent);
  value_248.addEventListener("pointerdown", stopCommunityControlEvent);
});
if (groupChatContainer) {
  let isDraggingGroupChat = false;
  groupChatContainer.addEventListener("touchstart", () => {
    isDraggingGroupChat = false;
  }, {
    passive: true
  });
  groupChatContainer.addEventListener("touchmove", () => {
    isDraggingGroupChat = true;
  }, {
    passive: true
  });
  groupChatContainer.addEventListener("touchend", () => {
    if (isDraggingGroupChat) {
      if (groupChatInput && document.activeElement === groupChatInput) groupChatInput.blur();
    }
  });
  groupChatContainer.addEventListener("click", () => {
    if (groupChatInput && document.activeElement === groupChatInput) groupChatInput.blur();
  });
}
groupChatBackBtn && groupChatBackBtn.addEventListener("click", () => {
  if (groupChatInput && document.activeElement === groupChatInput) groupChatInput.blur();
  if (typeof window.releaseYtChatKeyboardLock === "function") window.releaseYtChatKeyboardLock();
});
groupChatInput && (groupChatInput.addEventListener("focus", () => {
  if (typeof window.setYtChatKeyboardLock === "function") window.setYtChatKeyboardLock(groupChatView, true);else {
    if (groupChatView) groupChatView.classList.add("keyboard-open");
  }
}), groupChatInput.addEventListener("blur", () => {
  if (typeof window.setYtChatKeyboardLock === "function") window.setYtChatKeyboardLock(groupChatView, false);else {
    if (groupChatView) groupChatView.classList.remove("keyboard-open");
  }
  window.resetYtViewportOffset?.();
}));
function sendGroupChatMessageOnly(text_7) {
  if (!text_7 || !currentSubChannelData || !groupChatTitle) return false;
  const effectiveYtUser_4 = getCurrentYtCommunityUser(),
    userMsg = {
      type: "user",
      name: effectiveYtUser_4.name || "我",
      text: text_7
    },
    isDM = groupChatTitle.textContent === currentSubChannelData.name;
  if (isDM) {
    if (!currentSubChannelData.dmHistory) currentSubChannelData.dmHistory = [];
    currentSubChannelData.dmHistory.push(userMsg);
  } else {
    if (!currentSubChannelData.groupChatHistory) currentSubChannelData.groupChatHistory = [];
    currentSubChannelData.groupChatHistory.push(userMsg);
  }
  saveYoutubeData();
  addGroupChatMessageToUI(userMsg);
  if (groupChatInput) groupChatInput.value = "";
  return true;
}
groupChatBackBtn && groupChatBackBtn.addEventListener("click", () => {
  if (groupChatView) groupChatView.classList.remove("active");
  if (typeof renderMessagesList === "function") renderMessagesList();
});
const groupAvatarWrapper = document.getElementById("yt-group-avatar-wrapper"),
  groupAvatarUpload = document.getElementById("yt-group-avatar-upload"),
  groupAvatarImg = document.getElementById("yt-group-avatar-img"),
  groupAvatarIcon = document.getElementById("yt-group-avatar-icon"),
  clearGroupHistoryBtn = document.getElementById("yt-clear-group-history-btn"),
  exitGroupBtn = document.getElementById("yt-exit-group-btn"),
  userCommunityCreateSheet = document.getElementById("yt-user-community-create-sheet"),
  userCommunityAvatarWrapper = document.getElementById("yt-user-community-avatar-wrapper"),
  userCommunityAvatarUpload = document.getElementById("yt-user-community-avatar-upload"),
  userCommunityAvatarImg = document.getElementById("yt-user-community-avatar-img"),
  userCommunityAvatarIcon = document.getElementById("yt-user-community-avatar-icon"),
  userCommunityNameInput = document.getElementById("yt-user-community-name-input"),
  userCommunityConfirmBtn = document.getElementById("yt-user-community-confirm-btn"),
  userCommunityAdminSheet = document.getElementById("yt-user-community-admin-sheet"),
  userCommunityAdminList = document.getElementById("yt-user-community-admin-list"),
  userCommunityAdminSaveBtn = document.getElementById("yt-user-community-admin-save-btn");
let pendingUserCommunityAdminIds = new Set();
function getYtCommunityAdminSource() {
  const chars_3 = typeof getYtImChars === "function" ? getYtImChars() : typeof window.getImFriends === "function" ? window.getImFriends().filter(item_2 => item_2?.type === "char") : [];
  return Array.isArray(chars_3) ? chars_3 : [];
}
function resolveYtCommunityAdmin(adminSnapshot) {
  const source_4 = getYtCommunityAdminSource(),
    current = source_4.find(char_4 => String(char_4.id) === String(adminSnapshot?.charId));
  if (!current) return adminSnapshot || null;
  return {
    charId: current.id,
    name: current.nickname || current.realName || current.name || adminSnapshot?.name || "管理员",
    avatarUrl: current.avatarUrl || adminSnapshot?.avatarUrl || "",
    persona: current.persona || adminSnapshot?.persona || ""
  };
}
function findYtCommunityAdmin(speakerId_3, value_258) {
  const admins_2 = getCurrentYtFanGroup()?.admins || [],
    snapshot = admins_2.find(admin_2 => String(admin_2.charId) === String(speakerId_3 || "")) || admins_2.find(admin_3 => String(admin_3.name || "").trim() === String(value_258 || "").trim());
  return snapshot ? resolveYtCommunityAdmin(snapshot) : null;
}
function openOwnedYtCommunity() {
  const ownedChannel = channelState.userCommunityChannel,
    fanGroup_3 = ownedChannel?.generatedContent?.fanGroup;
  if (!ownedChannel || !fanGroup_3) return false;
  currentSubChannelData = ownedChannel;
  const ytNavItemDataTargetYtMessagesTabElement = document.querySelector(".yt-nav-item[data-target=\"yt-messages-tab\"]");
  if (ytNavItemDataTargetYtMessagesTabElement) ytNavItemDataTargetYtMessagesTabElement.click();
  const msgFilterCommunityElement = document.getElementById("msg-filter-community");
  if (msgFilterCommunityElement) msgFilterCommunityElement.click();
  return openFanGroupChat(fanGroup_3), true;
}
window.openYtUserCommunityCreator = function () {
  if (openOwnedYtCommunity()) return;
  const currentYtCommunityUser_265 = getCurrentYtCommunityUser();
  if (userCommunityNameInput) userCommunityNameInput.value = (currentYtCommunityUser_265.name || "我的") + "的社群";
  userCommunityAvatarImg && (userCommunityAvatarImg.src = "", userCommunityAvatarImg.style.display = "none");
  if (userCommunityAvatarIcon) userCommunityAvatarIcon.style.display = "block";
  if (userCommunityCreateSheet) userCommunityCreateSheet.classList.add("active");
};
userCommunityCreateSheet && userCommunityCreateSheet.addEventListener("mousedown", event_266 => {
  if (event_266.target === userCommunityCreateSheet) userCommunityCreateSheet.classList.remove("active");
});
userCommunityAvatarWrapper && userCommunityAvatarUpload && (userCommunityAvatarWrapper.addEventListener("click", () => userCommunityAvatarUpload.click()), userCommunityAvatarUpload.addEventListener("change", event_267 => {
  const value_268 = event_267.target.files?.[0];
  if (!value_268) return;
  const value_269 = new FileReader();
  value_269.onload = loadEvent_2 => {
    const applyAvatar = src_3 => {
      userCommunityAvatarImg && (userCommunityAvatarImg.src = src_3, userCommunityAvatarImg.style.display = "block");
      if (userCommunityAvatarIcon) userCommunityAvatarIcon.style.display = "none";
    };
    if (window.compressImage) window.compressImage(loadEvent_2.target.result, 320, 320, applyAvatar);else applyAvatar(loadEvent_2.target.result);
  };
  value_269.readAsDataURL(value_268);
  event_267.target.value = "";
}));
userCommunityConfirmBtn && userCommunityConfirmBtn.addEventListener("click", () => {
  if (channelState.userCommunityChannel) {
    if (userCommunityCreateSheet) userCommunityCreateSheet.classList.remove("active");
    openOwnedYtCommunity();
    return;
  }
  const name_4 = userCommunityNameInput?.value.trim();
  if (!name_4) {
    if (window.showToast) window.showToast("请输入社群名称");
    return;
  }
  const effectiveUser_2 = getCurrentYtCommunityUser(),
    avatar_2 = userCommunityAvatarImg?.style.display === "block" ? userCommunityAvatarImg.src : effectiveUser_2.avatarUrl || "";
  channelState.userCommunityChannel = {
    id: "user_community_channel",
    name: effectiveUser_2.name || "我的频道",
    avatar: avatar_2,
    isUserOwnedCommunity: true,
    isBusiness: false,
    dmHistory: [],
    groupChatHistory: [],
    generatedContent: {
      communityPosts: [],
      fanGroup: {
        id: "user_fan_group",
        name: name_4,
        avatar: null,
        memberCount: 1,
        admins: [],
        isJoined: true,
        isOwned: true,
        lastGrowthLiveId: null
      }
    }
  };
  saveYoutubeData();
  if (userCommunityCreateSheet) userCommunityCreateSheet.classList.remove("active");
  renderMessagesList();
  openOwnedYtCommunity();
  if (window.showToast) window.showToast("社群已创建");
});
function renderYtCommunityAdminPicker() {
  if (!userCommunityAdminList) return;
  const fanGroup_4 = getCurrentYtFanGroup(),
    currentAdmins = Array.isArray(fanGroup_4?.admins) ? fanGroup_4.admins : [];
  pendingUserCommunityAdminIds = new Set(currentAdmins.map(admin => String(admin.charId)));
  const chars_4 = getYtCommunityAdminSource();
  if (chars_4.length === 0) {
    userCommunityAdminList.innerHTML = "<div style=\"padding:40px 10px; text-align:center; color:#8e8e93; font-size:14px;\">暂无已添加的 Char</div>";
    return;
  }
  userCommunityAdminList.innerHTML = "";
  chars_4.forEach(char_5 => {
    const charId_2 = String(char_5.id),
      selected = pendingUserCommunityAdminIds.has(charId_2),
      name_5 = char_5.nickname || char_5.realName || char_5.name || "Char",
      row_2 = document.createElement("div");
    row_2.className = "account-card";
    row_2.dataset.charId = charId_2;
    row_2.style.cursor = "pointer";
    row_2.innerHTML = "\n                <div class=\"account-content\">\n                    <div class=\"account-avatar\">" + (char_5.avatarUrl ? "<img src=\"" + ytEscapeHtml(char_5.avatarUrl) + "\" style=\"width:100%;height:100%;object-fit:cover;border-radius:50%;\">" : "<i class=\"fas fa-user\"></i>") + "</div>\n                    <div class=\"account-info\">\n                        <div class=\"account-name\">" + ytEscapeHtml(name_5) + "</div>\n                        <div class=\"account-detail\">" + ytEscapeHtml(char_5.persona || char_5.signature || "已添加 Char") + "</div>\n                    </div>\n                    <i class=\"fas " + (selected ? "fa-check-circle" : "fa-circle") + "\" style=\"color:" + (selected ? "#34c759" : "#d1d1d6") + "; font-size:20px;\"></i>\n                </div>\n            ";
    row_2.addEventListener("click", () => {
      if (pendingUserCommunityAdminIds.has(charId_2)) pendingUserCommunityAdminIds["delete"](charId_2);else pendingUserCommunityAdminIds.add(charId_2);
      renderYtCommunityAdminPicker();
    });
    userCommunityAdminList.appendChild(row_2);
  });
}
groupAdminManageBtn && groupAdminManageBtn.addEventListener("click", () => {
  if (!currentSubChannelData?.isUserOwnedCommunity) return;
  renderYtCommunityAdminPicker();
  if (userCommunityAdminSheet) userCommunityAdminSheet.classList.add("active");
});
userCommunityAdminSheet && userCommunityAdminSheet.addEventListener("mousedown", event_282 => {
  if (event_282.target === userCommunityAdminSheet) userCommunityAdminSheet.classList.remove("active");
});
userCommunityAdminSaveBtn && userCommunityAdminSaveBtn.addEventListener("click", () => {
  const fanGroup_5 = getCurrentYtFanGroup();
  if (!fanGroup_5 || !currentSubChannelData?.isUserOwnedCommunity) return;
  const chars_5 = getYtCommunityAdminSource(),
    previousCount = Array.isArray(fanGroup_5.admins) ? fanGroup_5.admins.length : 0,
    nextAdmins = chars_5.filter(char_6 => pendingUserCommunityAdminIds.has(String(char_6.id))).map(char_7 => ({
      charId: char_7.id,
      name: char_7.nickname || char_7.realName || char_7.name || "管理员",
      avatarUrl: char_7.avatarUrl || "",
      persona: char_7.persona || ""
    }));
  fanGroup_5.admins = typeof window.normalizeYtAdminSnapshots === "function" ? window.normalizeYtAdminSnapshots(nextAdmins) : nextAdmins;
  fanGroup_5.memberCount = Math.max(1, parseYtGroupMemberCount(fanGroup_5.memberCount, 1) + fanGroup_5.admins.length - previousCount);
  saveYoutubeData();
  if (groupMemberCount) groupMemberCount.textContent = formatYtGroupMemberCount(fanGroup_5.memberCount);
  if (groupAdminCount) groupAdminCount.textContent = fanGroup_5.admins.length + "人";
  if (groupChatTitle) groupChatTitle.textContent = fanGroup_5.name + " (" + formatYtGroupMemberCount(fanGroup_5.memberCount) + ")";
  if (userCommunityAdminSheet) userCommunityAdminSheet.classList.remove("active");
  renderMessagesList();
  if (window.showToast) window.showToast("管理员已更新");
});
groupAvatarWrapper && groupAvatarUpload && (groupAvatarWrapper.addEventListener("click", () => groupAvatarUpload.click()), groupAvatarUpload.addEventListener("change", event_289 => {
  const value_290 = event_289.target.files[0];
  if (value_290) {
    const value_291 = new FileReader();
    value_291.onload = event_5 => {
      if (window.compressImage) window.compressImage(event_5.target.result, 300, 300, src_4 => {
        groupAvatarImg && (groupAvatarImg.src = src_4, groupAvatarImg.style.display = "block");
        if (groupAvatarIcon) groupAvatarIcon.style.display = "none";
        if (groupAvatarWrapper) groupAvatarWrapper.style.backgroundColor = "transparent";
      });else {
        groupAvatarImg && (groupAvatarImg.src = event_5.target.result, groupAvatarImg.style.display = "block");
        if (groupAvatarIcon) groupAvatarIcon.style.display = "none";
        if (groupAvatarWrapper) groupAvatarWrapper.style.backgroundColor = "transparent";
      }
    };
    value_291.readAsDataURL(value_290);
  }
}));
groupSettingsSheet && groupSettingsSheet.addEventListener("mousedown", event_294 => {
  if (event_294.target === groupSettingsSheet) groupSettingsSheet.classList.remove("active");
});
groupSettingsSaveBtn && groupSettingsSaveBtn.addEventListener("click", () => {
  if (!currentSubChannelData || !currentSubChannelData.generatedContent || !currentSubChannelData.generatedContent.fanGroup) return;
  const fanGroup_6 = currentSubChannelData.generatedContent.fanGroup;
  currentSubChannelData.isUserOwnedCommunity && groupNameInput && groupNameInput.value.trim() && (fanGroup_6.name = groupNameInput.value.trim());
  if (groupAvatarImg && groupAvatarImg.style.display === "block" && groupAvatarImg.src) {
    const charAvatarSrc = typeof resolveYtChannelAvatar === "function" ? resolveYtChannelAvatar(currentSubChannelData) : currentSubChannelData.avatar;
    fanGroup_6.avatar = groupAvatarImg.src === charAvatarSrc ? null : groupAvatarImg.src;
  }
  if (groupChatTitle) groupChatTitle.textContent = fanGroup_6.name + " (" + formatYtGroupMemberCount(fanGroup_6.memberCount) + ")";
  saveYoutubeData();
  if (currentSubChannelData.isUserOwnedCommunity) {
    const activeTab = document.querySelector("#profile-main-tabs .yt-sliding-tab.active");
    if (activeTab?.getAttribute("data-target") === "community") activeTab.click();
  } else renderGeneratedContent("community");
  renderMessagesList();
  if (window.showToast) window.showToast("群设置已修改");
  groupSettingsSheet.classList.remove("active");
});
clearGroupHistoryBtn && clearGroupHistoryBtn.addEventListener("click", () => {
  window.showCustomModal({
    title: "清空聊天记录",
    message: "确定要清空该群聊的所有历史记录吗？此操作无法撤销。",
    confirmText: "清空",
    cancelText: "取消",
    isDestructive: true,
    onConfirm: () => {
      if (currentSubChannelData) {
        currentSubChannelData.groupChatHistory = [];
        saveYoutubeData();
        renderGroupChatHistory(false);
        if (window.showToast) window.showToast("聊天记录已清空");
      }
      groupSettingsSheet.classList.remove("active");
    }
  });
});
exitGroupBtn && exitGroupBtn.addEventListener("click", () => {
  const isOwnedGroup = !!currentSubChannelData?.isUserOwnedCommunity;
  window.showCustomModal({
    title: isOwnedGroup ? "解散社群" : "退出群聊",
    message: isOwnedGroup ? "确定要解散自己的社群吗？社群和聊天记录将被删除。" : "确定要退出该粉丝群吗？退出后聊天记录将被删除。",
    confirmText: isOwnedGroup ? "解散" : "退出",
    cancelText: "取消",
    isDestructive: true,
    onConfirm: () => {
      if (currentSubChannelData && currentSubChannelData.generatedContent && currentSubChannelData.generatedContent.fanGroup) {
        if (currentSubChannelData.isUserOwnedCommunity) {
          channelState.userCommunityChannel = null;
          saveYoutubeData();
          groupSettingsSheet.classList.remove("active");
          if (groupChatView) groupChatView.classList.remove("active");
          renderMessagesList();
          if (window.showToast) window.showToast("社群已解散");
          return;
        }
        currentSubChannelData.generatedContent.fanGroup.isJoined = false;
        currentSubChannelData.groupChatHistory = [];
        saveYoutubeData();
        groupSettingsSheet.classList.remove("active");
        if (groupChatView) groupChatView.classList.remove("active");
        renderGeneratedContent("community");
        renderMessagesList();
        if (window.showToast) window.showToast("已退出群聊");
      }
    }
  });
});
groupOwnerInfo && groupOwnerInfo.addEventListener("click", () => {
  if (!currentSubChannelData) return;
  if (currentSubChannelData.isUserOwnedCommunity) {
    if (window.showToast) window.showToast("这是你的频道");
    return;
  }
  if (currentSubChannelData.isFriend) {
    if (window.showToast) window.showToast("已添加到私信");
    return;
  }
  window.showCustomModal({
    title: "添加私信",
    message: "是否将群主 " + currentSubChannelData.name + " 添加至私信列表？",
    confirmText: "添加",
    cancelText: "取消",
    onConfirm: () => {
      !currentSubChannelData.dmHistory && (currentSubChannelData.dmHistory = []);
      currentSubChannelData.isFriend = true;
      currentSubChannelData.isBusiness === undefined && (currentSubChannelData.isBusiness = false);
      currentSubChannelData.dmHistory.length === 0 && currentSubChannelData.dmHistory.push({
        type: "char",
        name: currentSubChannelData.name,
        text: "我已经通过了你的好友请求，现在我们可以开始聊天了。"
      });
      saveYoutubeData();
      renderMessagesList();
      groupOwnerStatus && (groupOwnerStatus.textContent = "已添加", groupOwnerStatus.style.color = "#34c759");
      if (window.showToast) window.showToast("已添加与 " + currentSubChannelData.name + " 的私信");
    }
  });
});
const dmSettingsSheet = document.getElementById("yt-dm-settings-sheet"),
  dmGoHomeBtn = document.getElementById("yt-dm-go-home-btn"),
  dmClearHistoryBtn = document.getElementById("yt-dm-clear-history-btn"),
  dmDeleteFriendBtn = document.getElementById("yt-dm-delete-friend-btn");
groupChatSettingsBtn && groupChatSettingsBtn.addEventListener("click", () => {
  if (!currentSubChannelData) return;
  const value_297 = groupChatTitle && groupChatTitle.textContent === currentSubChannelData.name;
  if (value_297) {
    if (dmDeleteFriendBtn) dmDeleteFriendBtn.style.display = "block";
    if (dmSettingsSheet) dmSettingsSheet.classList.add("active");
  } else {
    if (!currentSubChannelData.generatedContent || !currentSubChannelData.generatedContent.fanGroup) return;
    const fanGroup_7 = currentSubChannelData.generatedContent.fanGroup;
    groupNameInput && (groupNameInput.value = fanGroup_7.name || "", groupNameInput.readOnly = !currentSubChannelData.isUserOwnedCommunity, groupNameInput.style.color = currentSubChannelData.isUserOwnedCommunity ? "" : "#8e8e93");
    const src_5 = fanGroup_7.avatar || (typeof resolveYtChannelAvatar === "function" ? resolveYtChannelAvatar(currentSubChannelData) : currentSubChannelData.avatar);
    if (src_5 && groupAvatarImg) {
      groupAvatarImg.src = src_5;
      groupAvatarImg.style.display = "block";
      if (groupAvatarIcon) groupAvatarIcon.style.display = "none";
      if (groupAvatarWrapper) groupAvatarWrapper.style.backgroundColor = "transparent";
    } else {
      if (groupAvatarImg) groupAvatarImg.style.display = "none";
      if (groupAvatarIcon) groupAvatarIcon.style.display = "block";
      if (groupAvatarWrapper) groupAvatarWrapper.style.backgroundColor = "#f2f2f7";
    }
    const ownerName = document.getElementById("yt-group-owner-name"),
      ownerAvatar = document.getElementById("yt-group-owner-avatar");
    if (ownerName) ownerName.textContent = currentSubChannelData.name;
    ownerAvatar && (ownerAvatar.src = typeof resolveYtChannelAvatar === "function" ? resolveYtChannelAvatar(currentSubChannelData) : currentSubChannelData.avatar, ownerAvatar.style.display = "block");
    if (groupMemberCount) groupMemberCount.textContent = formatYtGroupMemberCount(fanGroup_7.memberCount);
    const isOwnedGroup_2 = !!currentSubChannelData.isUserOwnedCommunity;
    groupOwnerStatus && (groupOwnerStatus.textContent = isOwnedGroup_2 ? "我的频道" : currentSubChannelData.isFriend ? "已添加" : "添加", groupOwnerStatus.style.color = isOwnedGroup_2 || currentSubChannelData.isFriend ? "#34c759" : "#007aff");
    if (groupAdminSettingsGroup) groupAdminSettingsGroup.style.display = isOwnedGroup_2 ? "block" : "none";
    if (groupAdminCount) groupAdminCount.textContent = (Array.isArray(fanGroup_7.admins) ? fanGroup_7.admins.length : 0) + "人";
    if (exitGroupBtn) exitGroupBtn.textContent = isOwnedGroup_2 ? "解散社群" : "退出群聊";
    if (groupSettingsSheet) groupSettingsSheet.classList.add("active");
  }
});
dmSettingsSheet && dmSettingsSheet.addEventListener("mousedown", event_301 => {
  if (event_301.target === dmSettingsSheet) dmSettingsSheet.classList.remove("active");
});
dmGoHomeBtn && dmGoHomeBtn.addEventListener("click", () => {
  if (dmSettingsSheet) dmSettingsSheet.classList.remove("active");
  if (groupChatView) groupChatView.classList.remove("active");
  if (currentSubChannelData) {
    const homeNavBtn = document.querySelector(".yt-nav-item[data-target=\"yt-home-tab\"]");
    if (homeNavBtn) homeNavBtn.click();
    openSubChannelView(currentSubChannelData);
  }
});
dmClearHistoryBtn && dmClearHistoryBtn.addEventListener("click", () => {
  window.showCustomModal({
    title: "清空聊天记录",
    message: "确定要清空与该联系人的私信记录吗？",
    confirmText: "清空",
    cancelText: "取消",
    isDestructive: true,
    onConfirm: () => {
      if (currentSubChannelData) {
        currentSubChannelData.dmHistory = [];
        renderGroupChatHistory(true);
        renderMessagesList();
        saveYoutubeData();
        if (window.showToast) window.showToast("私信记录已清空");
      }
      if (dmSettingsSheet) dmSettingsSheet.classList.remove("active");
    }
  });
});
dmDeleteFriendBtn && dmDeleteFriendBtn.addEventListener("click", () => {
  window.showCustomModal({
    title: "删除私信",
    message: "确定要删除该私信吗？聊天记录将被清空。",
    confirmText: "删除",
    cancelText: "取消",
    isDestructive: true,
    onConfirm: () => {
      if (currentSubChannelData) {
        currentSubChannelData.dmHistory = [];
        currentSubChannelData.isFriend = false;
        saveYoutubeData();
        if (dmSettingsSheet) dmSettingsSheet.classList.remove("active");
        if (groupChatView) groupChatView.classList.remove("active");
        renderMessagesList();
        if (window.showToast) window.showToast("已删除私信");
      }
    }
  });
});
function openFanGroupChat(groupData) {
  if (!groupChatView || !currentSubChannelData) return;
  if (typeof window.releaseYtChatKeyboardLock === "function") window.releaseYtChatKeyboardLock(groupChatView);
  groupChatTitle && (groupChatTitle.textContent = groupData.name + " (" + formatYtGroupMemberCount(groupData.memberCount || 1) + ")");
  renderGroupChatHistory(false);
  groupChatView.classList.add("active");
  setTimeout(() => {
    if (groupChatContainer) groupChatContainer.scrollTop = groupChatContainer.scrollHeight;
  }, 100);
}
function openDMChat(value_303) {
  if (!groupChatView || !currentSubChannelData) return;
  if (typeof window.releaseYtChatKeyboardLock === "function") window.releaseYtChatKeyboardLock(groupChatView);
  groupChatTitle && (groupChatTitle.textContent = "" + value_303.name);
  renderGroupChatHistory(true);
  groupChatView.classList.add("active");
  setTimeout(() => {
    if (groupChatContainer) groupChatContainer.scrollTop = groupChatContainer.scrollHeight;
  }, 100);
}
function renderGroupChatHistory(isDM_2 = false) {
  if (!groupChatContainer) return;
  groupChatContainer.innerHTML = "";
  const items_305 = isDM_2 ? currentSubChannelData.dmHistory || [] : currentSubChannelData.groupChatHistory || [];
  if (isDM_2 && !currentSubChannelData.dmHistory) currentSubChannelData.dmHistory = items_305;else !isDM_2 && !currentSubChannelData.groupChatHistory && (currentSubChannelData.groupChatHistory = items_305);
  cleanupStaleYtGeneratingMessages(items_305) && saveYoutubeData();
  const generationId_4 = document.createDocumentFragment();
  let replyMessages_2 = "";
  items_305.forEach(threadRef_3 => {
    addGroupChatMessageToUI(threadRef_3, generationId_4, replyMessages_2);
    replyMessages_2 = getYtBubbleSpeakerKey(threadRef_3);
  });
  groupChatContainer.appendChild(generationId_4);
  groupChatContainer.scrollTop = groupChatContainer.scrollHeight;
}
function openOfferDetailSheet(msg) {
  let sheet = document.getElementById("yt-offer-detail-sheet");
  !sheet && (sheet = document.createElement("div"), sheet.id = "yt-offer-detail-sheet", sheet.className = "bottom-sheet-overlay detail-sheet-overlay", sheet.style.zIndex = "600", sheet.innerHTML = "\n                <div class=\"bottom-sheet\" style=\"height: auto; max-height: 80%;\">\n                    <div class=\"sheet-handle\"></div>\n                    <div class=\"sheet-title\">商单详情</div>\n                    <div class=\"detail-sheet-content\" id=\"yt-offer-detail-content\" style=\"padding-bottom: 30px;\">\n                    </div>\n                </div>\n            ", document.getElementById("app").appendChild(sheet), sheet.addEventListener("mousedown", event_313 => {
    if (event_313.target === sheet) sheet.classList.remove("active");
  }));
  const contentContainer = document.getElementById("yt-offer-detail-content"),
    value_308 = msg.offerStatus === "accepted",
    value_309 = msg.offerStatus === "rejected",
    value_310 = msg.offerStatus === "completed",
    value_311 = msg.offerStatus === "failed";
  let text_312 = "";
  if (value_310) text_312 = "<div style=\"text-align:center; padding: 12px; color: #8e8e93; font-size: 15px; background: #e8f5e9; border-radius: 12px; margin: 0 16px;\">商单已结算完成</div>";else {
    if (value_311) text_312 = "<div style=\"text-align:center; padding: 12px; color: #8e8e93; font-size: 15px; background: #ffebee; border-radius: 12px; margin: 0 16px;\">商单已违约取消</div>";else {
      if (value_308) text_312 = "\n                <div style=\"display: flex; gap: 12px; margin: 0 16px;\">\n                    <div id=\"offer-sheet-fail-btn\" style=\"flex: 1; padding: 12px; text-align: center; border-radius: 12px; background: #ffebee; color: #ff3b30; font-size: 15px; font-weight: 600; cursor: pointer;\">违约放弃</div>\n                    <div id=\"offer-sheet-complete-btn\" style=\"flex: 1; padding: 12px; text-align: center; border-radius: 12px; background: #e8f5e9; color: #388e3c; font-size: 15px; font-weight: 600; cursor: pointer;\">完成结单</div>\n                </div>\n            ";else value_309 ? text_312 = "<div style=\"text-align:center; padding: 12px; color: #8e8e93; font-size: 15px; background: #f2f2f2; border-radius: 12px; margin: 0 16px;\">已婉拒该商单</div>" : text_312 = "\n                <div style=\"display: flex; gap: 12px; margin: 0 16px;\">\n                    <div id=\"offer-sheet-reject-btn\" style=\"flex: 1; padding: 12px; text-align: center; border-radius: 12px; background: #ffebee; color: #ff3b30; font-size: 15px; font-weight: 600; cursor: pointer;\">婉拒</div>\n                    <div id=\"offer-sheet-accept-btn\" style=\"flex: 1; padding: 12px; text-align: center; border-radius: 12px; background: #e8f5e9; color: #388e3c; font-size: 15px; font-weight: 600; cursor: pointer;\">接取</div>\n                </div>\n            ";
    }
  }
  contentContainer.innerHTML = "\n            <div style=\"margin: 20px 16px; background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; padding: 20px;  position: relative; overflow: hidden;\">\n                <div style=\"position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 100px; pointer-events: none;\">\n                    <i class=\"fas fa-handshake\"></i>\n                </div>\n                <div style=\"display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px;\">\n                    <div style=\"font-size: 15px; color: #1c1c1e; line-height: 1.5; display: flex; flex-direction: column;\">\n                        <span style=\"color: #8e8e93; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;\">Subject 项目</span>\n                        <span style=\"font-weight: 500; font-size: 16px;\">" + (msg.offerData.title || "无") + " <span style=\"font-size: 11px; background: #e5e5ea; padding: 2px 6px; border-radius: 4px; color: #8e8e93;\">" + (msg.offerData.offerType || "未知") + "</span></span>\n                    </div>\n                    <div style=\"font-size: 15px; color: #1c1c1e; line-height: 1.5; display: flex; flex-direction: column; background: rgba(0,0,0,0.02); padding: 12px; border-radius: 8px;\">\n                        <span style=\"color: #8e8e93; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;\">Requirements 需求</span>\n                        <span style=\"white-space: pre-wrap;\">" + (msg.offerData.requirement || "无") + "</span>\n                    </div>\n                    <div style=\"display: flex; align-items: center; justify-content: space-between; margin-top: 4px;\">\n                        <div style=\"display: flex; align-items: baseline; gap: 8px;\">\n                            <span style=\"color: #8e8e93; font-size: 12px; text-transform: uppercase; font-weight: 600;\">Offer 报价</span>\n                            <span style=\"font-size: 22px; color: #ff3b30; font-weight: 700;\">" + (msg.offerData.price || "面议") + "</span>\n                        </div>\n                        <div style=\"display: flex; flex-direction: column; align-items: flex-end;\">\n                            <span style=\"color: #8e8e93; font-size: 11px; font-weight: 500;\">违约金</span>\n                            <span style=\"font-size: 14px; color: #000; font-weight: 600;\">" + (msg.offerData.penalty || "无") + "</span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            " + text_312 + "\n        ";
  if (!value_308 && !value_309 && !value_310 && !value_311) setTimeout(() => {
    const acceptBtn = document.getElementById("offer-sheet-accept-btn"),
      rejectBtn = document.getElementById("offer-sheet-reject-btn");
    acceptBtn && acceptBtn.addEventListener("click", () => {
      msg.offerStatus = "accepted";
      saveYoutubeData();
      sheet.classList.remove("active");
      renderGroupChatHistory(true);
      triggerGroupChatAPI("好的，我接下这个合作了，请发送具体合同或细则。");
    });
    rejectBtn && rejectBtn.addEventListener("click", () => {
      msg.offerStatus = "rejected";
      saveYoutubeData();
      sheet.classList.remove("active");
      renderGroupChatHistory(true);
      triggerGroupChatAPI("抱歉，近期档期较满，暂不接取该合作，感谢邀请。");
    });
  }, 0);else value_308 && setTimeout(() => {
    const completeBtn = document.getElementById("offer-sheet-complete-btn"),
      failBtn = document.getElementById("offer-sheet-fail-btn");
    completeBtn && completeBtn.addEventListener("click", () => {
      sheet.classList.remove("active");
      processOfferCompletion(msg, currentSubChannelData, "complete");
    });
    failBtn && failBtn.addEventListener("click", () => {
      sheet.classList.remove("active");
      processOfferCompletion(msg, currentSubChannelData, "fail");
    });
  }, 0);
  sheet.classList.add("active");
}
function processOfferCompletion(msg_4, sub_2, actionType) {
  const currentYtCommunityUser_317 = getCurrentYtCommunityUser();
  !sub_2.generatedContent && (sub_2.generatedContent = {
    pastVideos: [],
    communityPosts: [],
    currentLive: null,
    fanGroup: null
  });
  if (actionType === "complete") {
    msg_4.offerStatus = "completed";
    const commission_2 = msg_4.offerData.rmbAmount || parseFloat((msg_4.offerData.price || "0").replace(/[^0-9.]/g, "")) || 0;
    if (!channelState.dataCenter) channelState.dataCenter = {
      views: 0,
      sc: 0,
      subs: 0,
      commission: 0
    };
    if (!channelState.dataCenter.commission) channelState.dataCenter.commission = 0;
    channelState.dataCenter.commission += commission_2;
    const type_2 = msg_4.offerData.offerType || "video",
      title_2 = msg_4.offerData.title || "合作项目";
    if (type_2 === "video") {
      if (!sub_2.generatedContent.pastVideos) sub_2.generatedContent.pastVideos = [];
      sub_2.generatedContent.pastVideos.unshift({
        title: "【官方宣传】" + title_2 + " ft. " + (currentYtCommunityUser_317.name || "User"),
        views: Math.floor(Math.random() * 50) + 10 + "万 次观看",
        time: "刚刚",
        thumbnail: "https://picsum.photos/seed/" + Math.random() + "/320/180?grayscale",
        comments: [{
          name: currentYtCommunityUser_317.name || "我",
          text: "感谢官方的邀请！"
        }]
      });
      sub_2.dmHistory.push({
        type: "char",
        name: sub_2.name,
        text: "审片通过！视频已经在我们频道上线，反响很好，合作款已打入账户，期待下次合作！"
      });
    } else {
      if (type_2 === "live") {
        if (!sub_2.generatedContent.pastVideos) sub_2.generatedContent.pastVideos = [];
        sub_2.generatedContent.pastVideos.unshift({
          title: "【官方直播回放】" + title_2 + " 合作专场",
          views: Math.floor(Math.random() * 20) + 5 + "万 次观看",
          time: "刚刚",
          thumbnail: "https://picsum.photos/seed/" + Math.random() + "/320/180?grayscale",
          comments: [{
            name: currentYtCommunityUser_317.name || "我",
            text: "昨晚带货太有意思了！"
          }]
        });
        sub_2.dmHistory.push({
          type: "char",
          name: sub_2.name,
          text: "昨晚在您频道的直播效果爆炸！录播我们官方也同步发布了，感谢主播的热情带货！"
        });
      } else {
        if (type_2 === "post") {
          if (!sub_2.generatedContent.communityPosts) sub_2.generatedContent.communityPosts = [];
          sub_2.generatedContent.communityPosts.unshift({
            content: "非常荣幸能邀请到 @" + (currentYtCommunityUser_317.name || "User") + " 参与我们的 " + title_2 + " 活动！现场返图来啦~ #商业合作",
            translationZh: "",
            likes: Math.floor(Math.random() * 10) + 1 + "万",
            time: "刚刚"
          });
          sub_2.dmHistory.push({
            type: "char",
            name: sub_2.name,
            text: "社群动态已经看到了，互动率很高，感谢您的支持！"
          });
        } else {
          if (type_2 === "collab") {
            if (!channelState.pastVideos) channelState.pastVideos = [];
            const videoObj = {
              title: "【联动】" + title_2 + " ft. " + sub_2.name,
              views: Math.floor(Math.random() * 100) + 20 + "万 次观看",
              time: "刚刚",
              thumbnail: "https://picsum.photos/seed/" + Math.random() + "/320/180?grayscale",
              comments: [{
                name: sub_2.name,
                text: "太好玩了下次再来！"
              }]
            };
            channelState.pastVideos.unshift(videoObj);
            if (!sub_2.generatedContent.pastVideos) sub_2.generatedContent.pastVideos = [];
            sub_2.generatedContent.pastVideos.unshift(videoObj);
            if (!sub_2.generatedContent.communityPosts) sub_2.generatedContent.communityPosts = [];
            sub_2.generatedContent.communityPosts.unshift({
              content: "今天和 @" + (currentYtCommunityUser_317.name || "User") + " 合作了《" + title_2 + "》，真是太有趣了，快去看正片！",
              translationZh: "",
              likes: Math.floor(Math.random() * 5) + 1 + "万",
              time: "刚刚"
            });
            sub_2.dmHistory.push({
              type: "char",
              name: sub_2.name,
              text: "节目效果太棒了，动态我也发了，下次再一起玩！"
            });
          } else sub_2.dmHistory.push({
            type: "char",
            name: sub_2.name,
            text: "项目已验收，合作款已结清，期待下次合作！"
          });
        }
      }
    }
    if (window.showToast) window.showToast("结单成功，全网数据已同步！");
  } else {
    if (actionType === "fail") {
      msg_4.offerStatus = "failed";
      const value_323 = msg_4.offerData.rmbPenalty || parseFloat((msg_4.offerData.penalty || "0").replace(/[^0-9.]/g, "")) || 0;
      if (!channelState.dataCenter) channelState.dataCenter = {
        views: 0,
        sc: 0,
        subs: 0,
        commission: 0
      };
      if (!channelState.dataCenter.commission) channelState.dataCenter.commission = 0;
      channelState.dataCenter.commission -= value_323;
      sub_2.dmHistory.push({
        type: "char",
        name: sub_2.name,
        text: "由于您单方面违约，项目已终止，违约金已从总资产中扣除。希望下次合作能顺利。"
      });
      if (window.showToast) window.showToast("已违约放弃，扣除违约金");
    }
  }
  saveYoutubeData();
  renderGroupChatHistory(true);
  const dataCenterSheet = document.getElementById("yt-data-center-sheet");
  dataCenterSheet && dataCenterSheet.classList.contains("active") && renderDataCenter();
  const profileMainTabsYtSlidingTabActiveElement_318 = document.querySelector("#profile-main-tabs .yt-sliding-tab.active");
  profileMainTabsYtSlidingTabActiveElement_318 && profileMainTabsYtSlidingTabActiveElement_318.getAttribute("data-target") === "past" && profileMainTabsYtSlidingTabActiveElement_318.click();
}
function addGroupChatMessageToUI(msg_5, element_325 = groupChatContainer, value_326 = null) {
  if (!groupChatContainer) return;
  const row_3 = document.createElement("div"),
    groupState = getYtBubbleGroupState(msg_5, value_326),
    groupClass = groupState.isConsecutive ? "yt-bubble-compact" : "yt-bubble-group-start",
    avatarPlaceholder = "<div class=\"yt-bubble-avatar yt-bubble-avatar-placeholder\" aria-hidden=\"true\"></div>";
  row_3.dataset.ytSpeakerKey = groupState.speakerKey;
  if (msg_5.isOffer) {
    row_3.className = "yt-bubble-row left " + groupClass;
    const value_330 = msg_5.offerStatus === "accepted",
      value_331 = msg_5.offerStatus === "rejected",
      value_332 = msg_5.offerStatus === "completed",
      value_333 = msg_5.offerStatus === "failed";
    let text_334 = "待处理",
      text_335 = "#f57c00";
    if (value_330) {
      text_334 = "已接取";
      text_335 = "#388e3c";
    } else {
      if (value_331) {
        text_334 = "已婉拒";
        text_335 = "#ff3b30";
      } else {
        if (value_332) {
          text_334 = "已完成";
          text_335 = "#007aff";
        } else value_333 && (text_334 = "已违约", text_335 = "#8e8e93");
      }
    }
    row_3.innerHTML = "\n                " + (groupState.isConsecutive ? avatarPlaceholder : "<div class=\"yt-bubble-avatar\"><img src=\"" + (typeof resolveYtChannelAvatar === "function" ? resolveYtChannelAvatar(currentSubChannelData) : currentSubChannelData.avatar) + "\"></div>") + "\n                <div class=\"yt-bubble-content\" style=\"max-width: 80%;\">\n                    " + (groupState.isConsecutive ? "" : "<div class=\"yt-bubble-name\">" + ytEscapeHtml(msg_5.name || currentSubChannelData?.name || "") + "</div>") + "\n                    <div class=\"yt-offer-bubble\" style=\"background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 1px solid rgba(0,0,0,0.08); border-radius: 20px; padding: 12px; cursor: pointer; display: flex; align-items: center; gap: 10px;\">\n                        <div style=\"background: #007aff; color: #fff; width: 32px; height: 32px; border-radius: 8px; display: flex; justify-content: center; align-items: center;\">\n                            <i class=\"fas fa-file-signature\"></i>\n                        </div>\n                        <div style=\"flex: 1;\">\n                            <div style=\"font-size: 14px; font-weight: 600; color: #1c1c1e;\">商务合作邀请</div>\n                            <div style=\"font-size: 12px; color: " + text_335 + "; font-weight: 500; margin-top: 2px;\">状态: " + text_334 + "</div>\n                        </div>\n                    </div>\n                </div>\n            ";
    setTimeout(() => {
      const bubble_2 = row_3.querySelector(".yt-offer-bubble");
      bubble_2 && bubble_2.addEventListener("click", () => {
        openOfferDetailSheet(msg_5);
      });
    }, 0);
  } else {
    if (msg_5.type === "system") {
      row_3.className = "yt-bubble-row left " + groupClass;
      const isGenerating = msg_5.status === "generating",
        iconClass = isGenerating ? "fas fa-circle-notch fa-spin" : "fas fa-triangle-exclamation",
        text_8 = msg_5.text || (isGenerating ? "生成中..." : "生成中断，请重新生成");
      row_3.innerHTML = "\n                <div class=\"yt-bubble-avatar\"><i class=\"" + iconClass + "\" style=\"color:#8e8e93; font-size:16px; line-height:36px; text-align:center; width:100%;\"></i></div>\n                <div class=\"yt-bubble-content\">\n                    <div class=\"yt-bubble-msg\" style=\"background:#f2f2f7; color:#8e8e93; font-size:12px;\">" + ytEscapeHtml(text_8) + "</div>\n                </div>\n            ";
    } else {
      if (msg_5.type === "user") {
        row_3.className = "yt-bubble-row right " + groupClass;
        const effectiveYtUser_5 = getCurrentYtCommunityUser(),
          ytBubbleTextMarkup = getYtBubbleTextMarkup(msg_5);
        row_3.innerHTML = "\n                " + (groupState.isConsecutive ? avatarPlaceholder : "<div class=\"yt-bubble-avatar\"><img src=\"" + (effectiveYtUser_5.avatarUrl || "https://picsum.photos/100") + "\"></div>") + "\n                <div class=\"yt-bubble-content\">\n                    " + (groupState.isConsecutive ? "" : "<div class=\"yt-bubble-name\">" + ytEscapeHtml(msg_5.name || effectiveYtUser_5.name || "我") + "</div>") + "\n                    <div class=\"" + ytBubbleTextMarkup.className + "\" " + ytBubbleTextMarkup.attributes + ">" + ytBubbleTextMarkup.html + "</div>\n                </div>\n            ";
      } else {
        if (msg_5.type === "admin") {
          row_3.className = "yt-bubble-row left " + groupClass;
          const admin_4 = findYtCommunityAdmin(msg_5.speakerId, msg_5.name) || {
              charId: msg_5.speakerId,
              name: msg_5.name || "管理员",
              avatarUrl: msg_5.avatarUrl || ""
            },
            adminName = ytEscapeHtml(admin_4.name || msg_5.name || "管理员"),
            adminAvatar = admin_4.avatarUrl || msg_5.avatarUrl || "",
            ytBubbleTextMarkup_343 = getYtBubbleTextMarkup(msg_5);
          row_3.innerHTML = "\n                " + (groupState.isConsecutive ? avatarPlaceholder : "<div class=\"yt-bubble-avatar\">" + (adminAvatar ? "<img src=\"" + ytEscapeHtml(adminAvatar) + "\">" : "<i class=\"fas fa-user-shield\" style=\"color:#8e8e93;\"></i>") + "</div>") + "\n                <div class=\"yt-bubble-content\">\n                    " + (groupState.isConsecutive ? "" : "<div class=\"yt-bubble-name\" style=\"color:#1c1c1e; font-weight:500; display:flex; align-items:center;\">" + adminName + "<span style=\"font-size:10px; background:rgba(88,86,214,.1); color:#5856d6; padding:2px 6px; border-radius:6px; margin-left:6px; font-weight:600;\">管理员</span></div>") + "\n                    <div class=\"" + ytBubbleTextMarkup_343.className + "\" " + ytBubbleTextMarkup_343.attributes + ">" + ytBubbleTextMarkup_343.html + "</div>\n                </div>\n            ";
        } else {
          if (msg_5.type === "char") {
            row_3.className = "yt-bubble-row left " + groupClass;
            const value_344 = groupChatTitle && groupChatTitle.textContent === currentSubChannelData.name,
              safeName = ytEscapeHtml(msg_5.name || currentSubChannelData?.name || ""),
              value_346 = value_344 ? safeName : safeName + " <span style=\"font-size: 10px; background: rgba(0, 122, 255, 0.1); color: #007aff; padding: 2px 6px; border-radius: 6px; margin-left: 6px; font-weight: 600;\">群主</span>";
            let charAvatarSrc_2 = typeof resolveYtChannelAvatar === "function" ? resolveYtChannelAvatar(currentSubChannelData) : currentSubChannelData.avatar;
            const ytBubbleTextMarkup_348 = getYtBubbleTextMarkup(msg_5);
            row_3.innerHTML = "\n                " + (groupState.isConsecutive ? avatarPlaceholder : "<div class=\"yt-bubble-avatar\"><img src=\"" + charAvatarSrc_2 + "\"></div>") + "\n                <div class=\"yt-bubble-content\">\n                    " + (groupState.isConsecutive ? "" : "<div class=\"yt-bubble-name\" style=\"color: #1c1c1e; font-weight: 500; display: flex; align-items: center;\">" + value_346 + "</div>") + "\n                    <div class=\"" + ytBubbleTextMarkup_348.className + "\" " + ytBubbleTextMarkup_348.attributes + ">" + ytBubbleTextMarkup_348.html + "</div>\n                </div>\n            ";
          } else {
            row_3.className = "yt-bubble-row left " + groupClass;
            let hash = 0;
            const fanName = String(msg_5.name || "粉丝");
            for (let i = 0; i < fanName.length; i++) hash = fanName.charCodeAt(i) + ((hash << 5) - hash);
            const color_2 = "#" + (hash & 16777215).toString(16).padStart(6, "0"),
              ytBubbleTextMarkup_351 = getYtBubbleTextMarkup(msg_5);
            row_3.innerHTML = "\n                " + (groupState.isConsecutive ? avatarPlaceholder : "<div class=\"yt-bubble-avatar\" style=\"background-color: " + color_2 + "; display: flex; justify-content: center; align-items: center; color: white; font-size: 14px; font-weight: bold;\">" + ytEscapeHtml(fanName.substring(0, 1)) + "</div>") + "\n                <div class=\"yt-bubble-content\">\n                    " + (groupState.isConsecutive ? "" : "<div class=\"yt-bubble-name\">" + ytEscapeHtml(fanName) + "</div>") + "\n                    <div class=\"" + ytBubbleTextMarkup_351.className + "\" " + ytBubbleTextMarkup_351.attributes + ">" + ytBubbleTextMarkup_351.html + "</div>\n                </div>\n            ";
          }
        }
      }
    }
  }
  element_325.appendChild(row_3);
  bindYtBubbleTranslation(row_3);
  if (element_325 === groupChatContainer) groupChatContainer.scrollTop = groupChatContainer.scrollHeight;
}
groupChatSendBtn && groupChatInput && (groupChatSendBtn.addEventListener("click", () => {
  sendGroupChatMessageOnly(groupChatInput.value.trim());
}), groupChatSendBtn.addEventListener("keydown", event_353 => {
  if (event_353.key !== "Enter" && event_353.key !== " ") return;
  event_353.preventDefault();
  groupChatSendBtn.click();
}), window.mobileInputCompat?.register({
  input: groupChatInput,
  root: groupChatView,
  scrollContainer: groupChatContainer,
  onSend: () => sendGroupChatMessageOnly(groupChatInput.value.trim()),
  allowEmpty: true,
  openClasses: ["keyboard-open", "yt-chat-keyboard-lock"]
}));
groupChatApiBtn && groupChatInput && (groupChatApiBtn.addEventListener("click", () => {
  triggerGroupChatAPI("");
}), groupChatApiBtn.addEventListener("keydown", event_354 => {
  if (event_354.key !== "Enter" && event_354.key !== " ") return;
  event_354.preventDefault();
  groupChatApiBtn.click();
}));
async function triggerGroupChatAPI(text_9) {
  if (isGroupChatLoading || !currentSubChannelData) return;
  const threadRef_4 = getCurrentYtChatThreadRef(),
    thread_2 = threadRef_4 ? resolveYtChatThread(threadRef_4.channelId, threadRef_4.mode) : null;
  if (!thread_2) return;
  const isDM_3 = threadRef_4.mode === "dm",
    targetHistory = thread_2.history;
  cleanupStaleYtGeneratingMessages(targetHistory);
  let isUserMsg = false,
    userMsg_2 = null;
  if (text_9.length > 0) {
    isUserMsg = true;
    const effectiveYtUser_6 = getCurrentYtCommunityUser();
    userMsg_2 = {
      type: "user",
      name: effectiveYtUser_6.name || "我",
      text: text_9,
      id: createYtChatRuntimeId("yt_user"),
      source: "yt-chat-user",
      createdAt: Date.now()
    };
    targetHistory.push(userMsg_2);
    if (groupChatInput) groupChatInput.value = "";
  } else isUserMsg = getLatestYtNonSystemMessage(targetHistory)?.type === "user";
  isGroupChatLoading = true;
  const generationId_5 = createYtChatRuntimeId("yt_gen"),
    placeholder_2 = createYtGenerationPlaceholder(generationId_5);
  targetHistory.push(placeholder_2);
  saveYoutubeData();
  if (isCurrentYtChatThread(threadRef_4)) {
    if (userMsg_2) addGroupChatMessageToUI(userMsg_2);
    addGroupChatMessageToUI(placeholder_2);
  }
  try {
    const char_8 = thread_2.channel,
      effectiveYtUser_7 = getCurrentYtCommunityUser(),
      userPersona = effectiveYtUser_7.persona || "普通粉丝",
      promptHistory = targetHistory.filter(message_6 => message_6?.type !== "system"),
      join_365 = promptHistory.map(value_386 => (value_386?.name || "") + ": " + (value_386?.text || "")).join("\n"),
      wbContext = window.getYtWorldBookContext ? window.getYtWorldBookContext((char_8?.name || "") + "\n" + join_365) : "",
      fanGroup_8 = char_8?.generatedContent?.fanGroup || null,
      isOwnedGroup_3 = !isDM_3 && Boolean(char_8.isUserOwnedCommunity || fanGroup_8?.isOwned),
      resolvedAdmins = (fanGroup_8?.admins || []).map(resolveYtCommunityAdmin).filter(Boolean),
      findCapturedAdmin = (speakerId_4, name_6) => resolvedAdmins.find(admin_5 => String(admin_5.charId) === String(speakerId_4 || "")) || resolvedAdmins.find(admin_6 => String(admin_6.name || "").trim() === String(name_6 || "").trim()) || null,
      adminContext = resolvedAdmins.length > 0 ? resolvedAdmins.map(contact_391 => "- speakerId: " + contact_391.charId + "; 姓名: " + contact_391.name + "; 人设: " + (contact_391.persona || "未设置")).join("\n") : "无管理员",
      historyStr = promptHistory.map(value_392 => "" + (value_392.type || "fan") + (value_392.speakerId ? "(" + value_392.speakerId + ")" : "") + " " + value_392.name + ": " + value_392.text).join("\n");
    let instructionStr = isUserMsg ? "用户\"" + (effectiveYtUser_7.name || "我") + "\"刚刚发送了消息。请先生成其他粉丝的讨论或附和，然后你作为群主回复用户的消息（也可以带上其他粉丝）。" : "用户现在在潜水没有说话。请生成其他粉丝在聊天的内容，然后你作为群主偶尔插话或回复他们，展现群里的日常氛围。";
    if (isDM_3) {
      let text_393 = "";
      char_8.isBusiness && (text_393 = "\n注意：当前是商务私信，你扮演品牌方/赞助商（\"" + char_8.name + "\"）。如果用户刚刚接取了你的商单（发了同意接取之类的话），你需要表现出感谢并回复准备对接细节/合同；如果用户婉拒了，则礼貌回应。");
      const value_394 = char_8.preferredLanguage ? "优先保持联系人此前的惯用语言：" + char_8.preferredLanguage + "。" : "";
      instructionStr = "这是一对一私信。" + (isUserMsg ? "用户刚刚发送了消息，请自然承接最后一条内容。" : "用户没有发送新消息，请基于聊天上下文自然主动继续话题。") + "请你作为\"" + char_8.name + "\"，直接对用户\"" + (effectiveYtUser_7.name || "我") + "\"进行私信回复，保持真实活人的短消息节奏。" + value_394 + text_393;
    } else isOwnedGroup_3 && (instructionStr = "这是用户自己创建并担任群主的社群。用户群主名为\"" + (effectiveYtUser_7.name || "我") + "\"，你绝对不能代替、模仿或生成用户群主的发言。只能生成普通粉丝和上方管理员名单中的管理员发言。管理员发言必须使用真实 speakerId 并严格遵守对应人设；没有管理员时只能生成普通粉丝。" + (isUserMsg ? "请自然回应用户刚刚发送的消息。" : "请基于上下文自然延续社群日常聊天。"));
    function getYtDmVideoText(value_19) {
      if (value_19 && typeof value_19 === "object") return String(value_19.text || value_19.content || "").trim();
      return String(value_19 || "").trim();
    }
    function handleAction_373(videos, value_397) {
      const source_5 = Array.isArray(videos) ? videos.slice(0, 6) : [];
      if (source_5.length === 0) return value_397 + "：暂无往期视频。";
      return value_397 + "：\n" + source_5.map((video, value_400) => {
        const join_401 = (Array.isArray(video?.liveTranscript) ? video.liveTranscript : []).slice(-12).map(value_404 => "" + (value_404?.name ? value_404.name + "：" : "") + getYtDmVideoText(value_404)).filter(Boolean).join("｜"),
          initialBubbles_2 = (Array.isArray(video?.initialBubbles) ? video.initialBubbles : []).slice(-8).map(getYtDmVideoText).filter(Boolean).join("｜"),
          join_403 = (Array.isArray(video?.comments) ? video.comments : []).slice(-8).map(value_405 => (value_405?.name || "观众") + "：" + getYtDmVideoText(value_405)).filter(Boolean).join("｜");
        return value_400 + 1 + ". 标题：" + (video?.title || "无标题") + "\n简介：" + (video?.desc || "无") + "\n公开内容：" + (join_401 || initialBubbles_2 || "无可用发言记录") + "\n代表评论：" + (join_403 || "无");
      }).join("\n\n");
    }
    const value_374 = isDM_3 ? "【双方往期视频公开内容】\n" + handleAction_373(char_8?.generatedContent?.pastVideos, (char_8.name || "Char") + "自己的往期") + "\n\n" + handleAction_373(channelState?.pastVideos, (effectiveYtUser_7.name || "User") + "的往期") + "\n你可以在话题相关时自然回忆、评价或追问这些视频内容，但不能声称看过这里没有记录的内容。" : "";
    let promptStr = channelState.groupChatPrompt || defaultGroupChatPrompt;
    const charPersona = typeof window.getYtChannelPersonaWithRelationships === "function" ? window.getYtChannelPersonaWithRelationships(char_8) : char_8.desc || "未知";
    let content_4 = promptStr.replace(/{char}/g, char_8.name || "").replace(/{char_persona}/g, charPersona).replace(/{user}/g, effectiveYtUser_7.name || "我").replace(/{user_persona}/g, userPersona).replace(/{admins}/g, adminContext).replace(/{wb_context}/g, wbContext).replace(/{chat_history}/g, historyStr).replace(/{trigger_instruction}/g, instructionStr);
    if (isDM_3) content_4 += "\n\n" + value_374 + "\n\n【国际化输出协议｜不可省略】\n- 返回 {\"charReplies\":[{\"text\":\"原文\",\"translationZh\":\"中文翻译或空字符串\"}]}。\n- text 不是中文时必须提供自然中文翻译；text 是中文时 translationZh 为空字符串。\n- 只返回合法 JSON，不要 Markdown。";else {
      const allowedRoles = isOwnedGroup_3 ? "admin 或 fan，禁止 owner 和 user" : "owner 或 fan";
      content_4 += "\n\n【统一群聊输出协议｜不可省略】\n- 返回 {\"groupReplies\":[{\"role\":\"角色\",\"speakerId\":\"管理员ID或空字符串\",\"name\":\"显示名\",\"text\":\"原文\",\"translationZh\":\"中文翻译或空字符串\"}]}。\n- role 只能是 " + allowedRoles + "。\n- admin 只能从管理员名单选择，speakerId 必须完全一致；fan 使用自然的粉丝昵称。\n- text 不是中文时必须提供自然中文翻译；text 是中文时 translationZh 为空字符串。\n- 生成 2–6 条简短、自然、有连续性的消息。\n- 只返回合法 JSON，不要 Markdown。";
    }
    const chatCompletionsEndpoint_378 = window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint),
      value_379 = await fetch(chatCompletionsEndpoint_378, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.apiConfig.apiKey
        },
        body: JSON.stringify({
          model: window.apiConfig.model || "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: content_4
          }],
          temperature: 0.8,
          response_format: {
            type: "json_object"
          }
        })
      });
    if (!value_379.ok) throw window.u2Api?.createHttpError?.(value_379, await window.u2Api?.readApiError?.(value_379)) || Object.assign(new Error("HTTP " + value_379.status), {
      status: value_379.status
    });
    const data_2 = await value_379.json();
    let resultText = data_2.choices[0].message.content;
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    const responseObj_2 = sanitizeObj(JSON.parse(resultText)),
      scheduledReplies = [];
    if (isDM_3) {
      const items_407 = Array.isArray(responseObj_2.charReplies) ? responseObj_2.charReplies : responseObj_2.charReply ? [responseObj_2.charReply] : [];
      items_407.forEach(reply_9 => scheduledReplies.push({
        type: "char",
        name: char_8.name,
        reply: reply_9
      }));
    } else {
      if (Array.isArray(responseObj_2.groupReplies)) responseObj_2.groupReplies.forEach(reply_5 => {
        const role_2 = String(reply_5?.role || "").toLowerCase();
        if (role_2 === "admin") {
          if (!isOwnedGroup_3) return;
          const value_369_411 = findCapturedAdmin(reply_5?.speakerId || reply_5?.charId, reply_5?.name);
          if (!value_369_411) return;
          scheduledReplies.push({
            type: "admin",
            name: value_369_411.name,
            speakerId: value_369_411.charId,
            avatarUrl: value_369_411.avatarUrl,
            reply: reply_5
          });
        } else {
          if (role_2 === "fan" || role_2 === "otherfan" || role_2 === "other_fan") scheduledReplies.push({
            type: "fan",
            name: reply_5?.name || "粉丝",
            reply: reply_5
          });else !isOwnedGroup_3 && (role_2 === "owner" || role_2 === "char") && scheduledReplies.push({
            type: "char",
            name: char_8.name,
            reply: reply_5
          });
        }
      });else {
        const fanReplies = Array.isArray(responseObj_2.otherFansReplies) ? responseObj_2.otherFansReplies : [];
        fanReplies.forEach(reply_6 => scheduledReplies.push({
          type: "fan",
          name: reply_6?.name || "粉丝",
          reply: reply_6
        }));
        if (isOwnedGroup_3 && Array.isArray(responseObj_2.adminReplies)) responseObj_2.adminReplies.forEach(reply_7 => {
          const admin_7 = findCapturedAdmin(reply_7?.speakerId || reply_7?.charId, reply_7?.name);
          if (admin_7) scheduledReplies.push({
            type: "admin",
            name: admin_7.name,
            speakerId: admin_7.charId,
            avatarUrl: admin_7.avatarUrl,
            reply: reply_7
          });
        });else {
          if (!isOwnedGroup_3) {
            const ownerReplies = Array.isArray(responseObj_2.charReplies) ? responseObj_2.charReplies : responseObj_2.charReply ? [responseObj_2.charReply] : [];
            ownerReplies.forEach(reply_8 => scheduledReplies.push({
              type: "char",
              name: char_8.name,
              reply: reply_8
            }));
          }
        }
      }
    }
    const replyMessages_3 = scheduledReplies.map((item_3, index_5) => buildYtGeneratedChatMessage(item_3, index_5)).filter(Boolean);
    replaceYtChatGenerationWithReplies(threadRef_4, generationId_5, replyMessages_3);
  } catch (error_5) {
    console.error("Group Chat API Error:", error_5);
    markYtChatGenerationFailed(threadRef_4, generationId_5);
    if (!window.u2Api?.isRequestError?.(error_5) || !window.u2Api.reportError(error_5, {
      operation: "群聊回复生成"
    })) {
      if (window.showToast) window.showToast("网络错误，无法获取回复");
    }
  } finally {
    setTimeout(() => {
      isGroupChatLoading = false;
    }, 2000);
  }
}
const communityDetailSheet = document.getElementById("yt-community-detail-sheet");
communityDetailSheet && communityDetailSheet.addEventListener("mousedown", event_421 => {
  event_421.target === communityDetailSheet && communityDetailSheet.classList.remove("active");
});
