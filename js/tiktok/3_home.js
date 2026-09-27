(window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(() => {
  const feedContainer = document.getElementById("tk-feed-container"),
    apiGenBtn = document.getElementById("tk-api-generate-btn");
  let currentEditingVideoId = null;
  const TK_COMMENT_RENDER_LIMIT = 50;
  let tkFeedWheelLocked = false,
    tkFeedTouchStart = null;
  function tkEscapeHtml(value_3) {
    return String(value_3 ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[char]);
  }
  function tkEscapeAttr(value_4) {
    return tkEscapeHtml(value_4);
  }
  function tkCleanTranslation(value_5) {
    return String(value_5 || "").trim();
  }
  function tkGetSceneTranslation(video_2 = {}, index_2 = 0) {
    const translations = Array.isArray(video_2.sceneSegmentTranslationsZh) ? video_2.sceneSegmentTranslationsZh : [],
      segmentTranslation = tkCleanTranslation(translations[index_2]);
    if (segmentTranslation) return segmentTranslation;
    const fieldNames = ["openingTranslationZh", "middleTranslationZh", "endingTranslationZh"],
      fieldTranslation = tkCleanTranslation(video_2[fieldNames[index_2]]);
    if (fieldTranslation) return fieldTranslation;
    return index_2 === 0 ? tkCleanTranslation(video_2.translationZh) : "";
  }
  function handleAction_4(value_35, value_36) {
    const tkCleanTranslation_37 = tkCleanTranslation(value_35);
    if (!tkCleanTranslation_37) return "";
    return "\n            <div class=\"tk-comment-translation\" id=\"" + tkEscapeAttr(value_36) + "\" style=\"display:none;\">\n                " + tkEscapeHtml(tkCleanTranslation_37) + "\n            </div>\n        ";
  }
  function tkSplitSceneText(value_38) {
    const clean = String(value_38 || "").trim();
    if (!clean) return [];
    const sentenceParts = clean.split(/(?<=[。！？!?；;])\s*/).map(part => part.trim()).filter(Boolean);
    if (sentenceParts.length >= 2) return sentenceParts.slice(0, 5);
    const targetSize = Math.max(30, Math.ceil(clean.length / 3)),
      parts = [];
    for (let i = 0; i < clean.length; i += targetSize) {
      parts.push(clean.slice(i, i + targetSize).trim());
    }
    return parts.filter(Boolean).slice(0, 5);
  }
  function tkGetSceneSegments(video_3 = {}) {
    const rawSegments = Array.isArray(video_3.sceneSegments) ? video_3.sceneSegments : [video_3.opening, video_3.middle, video_3.ending].filter(Boolean),
      segments_2 = rawSegments.map(part_2 => String(part_2 || "").trim()).filter(Boolean);
    if (segments_2.length) return segments_2.slice(0, 5);
    return tkSplitSceneText(video_3.sceneText);
  }
  function tkGetSceneText(video_4 = {}) {
    const segments = tkGetSceneSegments(video_4);
    return segments.length ? segments.join(" ") : String(video_4.sceneText || "").trim();
  }
  window.tkFormatCount = function (value_50) {
    const num = Number(value_50);
    if (!Number.isFinite(num)) return "0";
    const abs_2 = Math.abs(num);
    if (abs_2 >= 1000000) {
      const formatted = (num / 1000000).toFixed(abs_2 >= 10000000 ? 0 : 1).replace(/\.0$/, "");
      return formatted + "M";
    }
    if (abs_2 >= 1000) {
      const formatted_2 = (num / 1000).toFixed(abs_2 >= 10000 ? 0 : 1).replace(/\.0$/, "");
      return formatted_2 + "K";
    }
    return String(Math.round(num));
  };
  window.tkGetRandomAvatarUrl = function (value_54 = "") {
    const value_55 = String(value_54 || "tk_avatar_" + Math.floor(Math.random() * 1000000)).trim() || "tk_avatar";
    return "https://picsum.photos/seed/" + encodeURIComponent(value_55) + "/150/150";
  };
  window.tkResolveAvatar = function (id_2, name_2, value_58) {
    if (String(id_2 || "") === "profile") return tkState?.profile?.avatar || value_58 || window.tkGetRandomAvatarUrl("profile");
    const stableSeed = id_2 || name_2 || "tk_avatar_" + Math.floor(Math.random() * 1000000),
      tkChar = id_2 && window.tkGetChar ? window.tkGetChar(id_2) : null;
    if (tkChar) {
      if (tkChar.avatar) return tkChar.avatar;
      return window.tkGetRandomAvatarUrl((tkChar.id || id_2 || name_2) + "_deleted_or_empty_avatar");
    }
    if (value_58) return value_58;
    if (window.resolveYtLinkedImChar) {
      const imChar = window.resolveYtLinkedImChar({
        id: id_2,
        imCharId: id_2,
        handle: id_2,
        name: name_2
      });
      if (imChar && imChar.avatarUrl) return imChar.avatarUrl;
    }
    return window.tkGetRandomAvatarUrl(stableSeed);
  };
  function tkStableImageUrl(video_5 = {}) {
    const existing = video_5.imageUrl || video_5.cover || video_5.bgImage;
    if (existing) return existing;
    const seed = encodeURIComponent(video_5.imagePrompt || video_5.desc || video_5.authorName || video_5.id || "tiktok-image");
    return "https://picsum.photos/seed/" + seed + "/900/1200";
  }
  function tkGetMediaType(video_6 = {}) {
    if (video_6.mediaType === "image") return "image";
    if (video_6.mediaType === "video") return "video";
    const hasSegments = tkGetSceneSegments(video_6).length > 0 || Boolean(video_6.sceneText);
    if (video_6.imageUrl || video_6.imagePrompt || video_6.contentType === "image" || (video_6.cover || video_6.bgImage) && !hasSegments) return "image";
    return "video";
  }
  function tkCreateFeedProgressHtml_2(video_7 = {}) {
    if (tkGetMediaType(video_7) === "image") {
      const length_2 = Math.max(2, Math.min(5, tkGetSceneSegments(video_7).length || 3)),
        duration = Math.max(9000, length_2 * 3200);
      return "\n                <div class=\"tk-feed-progress tk-feed-progress-segments tk-feed-progress-count-" + length_2 + "\" style=\"--tk-segment-count:" + length_2 + "; --tk-progress-duration:" + duration + "ms;\" aria-hidden=\"true\">\n                    " + Array.from({
        length: length_2
      }).map((value_68, value_69) => "<span style=\"--tk-segment-index:" + value_69 + ";\"></span>").join("") + "\n                </div>\n            ";
    }
    return "\n            <div class=\"tk-feed-progress tk-feed-progress-video\" style=\"--tk-progress-duration:9500ms;\" aria-hidden=\"true\">\n                <span></span>\n            </div>\n        ";
  }
  window.tkCreateFeedProgressHtml = tkCreateFeedProgressHtml_2;
  window.tkHandleMention = function (name_3, event) {
    if (event) event.stopPropagation();
    let char_2 = tkState.chars.find(c => c.name === name_3 || c.handle === name_3);
    if (!char_2) {
      let imChar_2 = null;
      window.resolveYtLinkedImChar && (imChar_2 = window.resolveYtLinkedImChar({
        name: name_3
      }));
      const id_3 = "mention_" + Date.now();
      window.tkSaveChar({
        id: id_3,
        name: name_3,
        handle: name_3.toLowerCase().replace(/\s+/g, ""),
        avatar: imChar_2 ? imChar_2.avatarUrl : window.tkResolveAvatar(id_3, name_3),
        status: "",
        persona: "从评论区被艾特的 " + name_3,
        isFollowed: false
      });
      char_2 = window.tkGetChar(id_3);
    }
    if (char_2 && window.tkOpenSubProfile) {
      const detailSheet = document.getElementById("tk-video-detail-sheet");
      if (detailSheet) window.closeView(detailSheet);
      window.tkOpenSubProfile(char_2.id);
    }
  };
  function handleAction_9(rawName_2) {
    const normalized = String(rawName_2 || "").replace(/^@/, "").trim();
    if (!normalized) return rawName_2;
    const lower = normalized.toLowerCase(),
      char_3 = tkState.chars.find(c_2 => {
        return String(c_2.name || "").toLowerCase() === lower || String(c_2.handle || "").toLowerCase() === lower || String(c_2.id || "").toLowerCase() === lower;
      });
    return char_3 ? char_3.name || char_3.handle || normalized : normalized;
  }
  function handleAction_10(value_78) {
    if (!value_78) return "";
    const tkEscapeHtml_79 = tkEscapeHtml(value_78);
    return tkEscapeHtml_79.replace(/@([^\s，。！？]+)/g, (value_80, rawName_3) => {
      const handleAction_9_82 = handleAction_9(rawName_3);
      return "<span class=\"tk-comment-mention\" style=\"color: #ff4b4b; cursor: pointer;\" onclick=\"window.tkHandleMention(" + tkEscapeAttr(JSON.stringify(rawName_3)) + ", event)\">@" + tkEscapeHtml(handleAction_9_82) + "</span>";
    });
  }
  function tkCreateBubbleFlowHtml(video_8 = {}, options_2 = {}) {
    const segments_3 = tkGetSceneSegments(video_8);
    if (!segments_3.length) return "";
    const bubbleBg = options_2.background || (video_8.cover || video_8.bgImage ? "rgba(17,17,17,0.82)" : "#111111"),
      total_2 = Math.max(segments_3.length * 3.4, 6);
    return "\n            <div class=\"tk-bubble-flow\" style=\"--tk-flow-total:" + total_2 + "s;\">\n                " + segments_3.map((value_88, index_3) => "\n                    <div class=\"tk-bubble-flow-item\" style=\"--tk-flow-index:" + index_3 + "; --tk-flow-bg:" + bubbleBg + ";\">\n                        <div>" + tkEscapeHtml(value_88) + "</div>\n                        " + (tkGetSceneTranslation(video_8, index_3) ? "<div class=\"tk-bubble-translation\">" + tkEscapeHtml(tkGetSceneTranslation(video_8, index_3)) + "</div>" : "") + "\n                    </div>\n                ").join("") + "\n            </div>\n        ";
  }
  function tkNormalizeComments(comments_2 = []) {
    const safeComments = Array.isArray(comments_2) ? comments_2.slice(0, TK_COMMENT_RENDER_LIMIT) : [];
    return safeComments.map((comment_2, value_93) => ({
      id: comment_2.id || "cmt_" + Date.now() + "_" + value_93 + "_" + Math.floor(Math.random() * 1000),
      authorId: comment_2.authorId || "commenter_" + Date.now() + "_" + value_93 + "_" + Math.floor(Math.random() * 1000),
      authorName: comment_2.authorName || "User",
      authorAvatar: comment_2.authorAvatar || "",
      text: comment_2.text || "",
      translationZh: tkCleanTranslation(comment_2.translationZh || comment_2.translation || comment_2.zhTranslation),
      likes: Number.isFinite(Number(comment_2.likes)) ? Number(comment_2.likes) : 0,
      isLiked: Boolean(comment_2.isLiked),
      replies: Array.isArray(comment_2.replies) ? comment_2.replies.slice(0, TK_COMMENT_RENDER_LIMIT).map((value_94, value_95) => ({
        id: value_94.id || "reply_" + Date.now() + "_" + value_93 + "_" + value_95 + "_" + Math.floor(Math.random() * 1000),
        authorId: value_94.authorId || "reply_user_" + Date.now() + "_" + value_93 + "_" + value_95 + "_" + Math.floor(Math.random() * 1000),
        authorName: value_94.authorName || "User",
        authorAvatar: value_94.authorAvatar || "",
        text: value_94.text || "",
        translationZh: tkCleanTranslation(value_94.translationZh || value_94.translation || value_94.zhTranslation),
        likes: Number.isFinite(Number(value_94.likes)) ? Number(value_94.likes) : 0
      })) : []
    })).filter(value_96 => value_96.text);
  }
  window.tkNormalizeVideoPayload = function (payload = {}, overrides = {}) {
    const segments_4 = Array.isArray(payload.sceneSegments) ? payload.sceneSegments : [payload.opening, payload.middle, payload.ending].filter(Boolean),
      sceneSegments_2 = segments_4.map(part_3 => String(part_3 || "").trim()).filter(Boolean).slice(0, 5),
      rawSegmentTranslations = Array.isArray(payload.sceneSegmentTranslationsZh) ? payload.sceneSegmentTranslationsZh : [payload.openingTranslationZh, payload.middleTranslationZh, payload.endingTranslationZh],
      sceneSegmentTranslationsZh_2 = sceneSegments_2.map((_, index) => tkCleanTranslation(rawSegmentTranslations[index])),
      sceneText_2 = payload.sceneText || sceneSegments_2.join(" "),
      comments_3 = tkNormalizeComments(payload.comments),
      inferredMediaType = payload.mediaType === "image" || payload.contentType === "image" || payload.imageUrl || payload.imagePrompt || (payload.cover || payload.bgImage) && !sceneText_2 ? "image" : "video",
      mediaType_2 = overrides.mediaType || (payload.mediaType === "video" ? "video" : inferredMediaType),
      imagePrompt_2 = payload.imagePrompt || payload.visualPrompt || "",
      value_107 = mediaType_2 === "image" || imagePrompt_2 ? "https://picsum.photos/seed/" + encodeURIComponent(imagePrompt_2 || payload.desc || payload.authorName || payload.id || Date.now()) + "/900/1200" : null;
    return {
      id: overrides.id || payload.id || "v_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      authorId: overrides.authorId || payload.authorId || payload.handle || "user_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      authorName: overrides.authorName || payload.authorName || "User",
      authorAvatar: overrides.authorAvatar ?? payload.authorAvatar ?? null,
      mediaType: mediaType_2,
      imagePrompt: imagePrompt_2,
      imageUrl: payload.imageUrl || null,
      desc: payload.desc || "",
      opening: payload.opening || sceneSegments_2[0] || "",
      middle: payload.middle || sceneSegments_2[1] || "",
      ending: payload.ending || sceneSegments_2[2] || "",
      translationZh: tkCleanTranslation(payload.translationZh || payload.sceneTextTranslationZh || payload.translation),
      openingTranslationZh: tkCleanTranslation(payload.openingTranslationZh || sceneSegmentTranslationsZh_2[0]),
      middleTranslationZh: tkCleanTranslation(payload.middleTranslationZh || sceneSegmentTranslationsZh_2[1]),
      endingTranslationZh: tkCleanTranslation(payload.endingTranslationZh || sceneSegmentTranslationsZh_2[2]),
      sceneSegments: sceneSegments_2,
      sceneSegmentTranslationsZh: sceneSegmentTranslationsZh_2,
      sceneText: sceneText_2,
      likes: Number.isFinite(Number(payload.likes)) ? Number(payload.likes) : Math.floor(Math.random() * 1000),
      commentsCount: tkCountVideoComments({
        comments: comments_3
      }),
      shares: Number.isFinite(Number(payload.shares)) ? Number(payload.shares) : Math.floor(Math.random() * 100),
      isLiked: Boolean(payload.isLiked),
      comments: comments_3,
      cover: payload.cover || value_107,
      bgImage: payload.bgImage || null,
      bgColor: payload.bgColor || null,
      ...overrides
    };
  };
  window.tkBuildWorldBookContext = function (contextText = "", options_3 = {}) {
    const chunks = [],
      normalizeEntry = window.normalizeWorldBookEntry || (entry => entry),
      formatEntry = window.formatWorldBookEntryForPrompt || (entry_2 => {
        const title_2 = entry_2.title || entry_2.keyword || "World Book Entry";
        return ("【" + title_2 + "】\n" + (entry_2.content || "")).trim();
      }),
      keywordMatched = window.worldBookKeywordMatched || ((entry_3, text_2) => {
        if (!entry_3 || entry_3.triggerMode !== "keyword") return true;
        const keyword_2 = String(entry_3.keyword || "").trim();
        return keyword_2 ? String(text_2 || "").includes(keyword_2) : false;
      }),
      explicitBoundIds = Array.isArray(options_3.boundIds) ? options_3.boundIds : [],
      tkBoundIds = Array.isArray(tkState.settings?.boundWorldBookIds) ? tkState.settings.boundWorldBookIds : [],
      boundIdSet = new Set([...explicitBoundIds, ...tkBoundIds].filter(Boolean).map(id_4 => String(id_4)));
    if (window.getWorldBooks) {
      const books = window.getWorldBooks().filter(book => book && (book.isGlobal || boundIdSet.has(String(book.id)))),
        entries_2 = [];
      books.forEach(value_125 => {
        (Array.isArray(value_125.entries) ? value_125.entries : []).forEach(value_126 => {
          const value_112_127 = normalizeEntry(value_126);
          value_112_127 && value_112_127.enabled !== false && keywordMatched(value_112_127, contextText) && entries_2.push(value_112_127);
        });
      });
      entries_2.length && chunks.push("User World Book:\n" + entries_2.map(formatEntry).join("\n\n"));
    }
    if (window.getBuiltinWorldBookContext) {
      const builtin = window.getBuiltinWorldBookContext(null, contextText);
      if (builtin) chunks.push(builtin);
    }
    return chunks.join("\n\n").trim();
  };
  window.tkBuildWorldActorPrompt = function (options_4 = {}) {
    const includeUserIdentity_2 = Boolean(options_4.includeUserIdentity),
      purpose_2 = options_4.purpose || "TikTok 内容生成",
      triggerText_2 = String(options_4.triggerText || "").trim(),
      userProfile = {
        name: tkState.profile?.name || window.userState?.name || "",
        handle: tkState.profile?.handle || "",
        tiktokPersona: tkState.profile?.persona || "",
        tiktokBio: tkState.profile?.bio || "",
        basePersona: window.userState?.persona || ""
      },
      hasUserPersona = Object.values(userProfile).some(Boolean),
      value_132 = hasUserPersona ? includeUserIdentity_2 ? "必要时才可提到的 user 身份（只作为上下文，不得扮演）：" + JSON.stringify(userProfile, null, 2) : "user 人设关键词触发文本（只用于世界书/语境触发，不代表内容必须围绕 user；除非主题明确需要，否则不要提到 user）：" + JSON.stringify(userProfile, null, 2) : "没有显式 user 人设；不要自行编造 user 身份。";
    return ("\n世界观与 user 扮演规则（适用于 " + purpose_2 + "）：\n- 你是这个世界观中的任何一个非 user 的真实账号/路人/粉丝/创作者/评论者，而不是旁白机器。\n- 可以使用世界书、主题、角色人设和 user 人设关键词触发世界观信息，但不要强行让所有内容围绕 user。\n- 只有当主题、评论语境或世界书明确需要提到 user 时，才把 user 当作被提及对象；否则不要提到 user。\n- 即使必须提到 user，也只能从外部视角提及，禁止用第一人称替 user 说话，禁止让 user 发视频、发评论、点赞、关注或回复。\n- 所有作者、评论者、回复者、访客和互动者都必须是 user 以外的人。\n" + (triggerText_2 ? "当前触发文本：" + triggerText_2 : "") + "\n" + value_132 + "\n").trim();
  };
  function tkResolveApiEndpoint() {
    return window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint);
  }
  function tkParseAiJson_2(rawText) {
    const raw = String(rawText || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    if (!raw) throw new Error("AI returned empty content");
    try {
      return JSON.parse(raw);
    } catch (firstError) {
      const arrayStart = raw.indexOf("["),
        objectStart = raw.indexOf("{"),
        starts = [arrayStart, objectStart].filter(index_4 => index_4 >= 0);
      if (!starts.length) throw firstError;
      const start = Math.min(...starts),
        endChar = raw[start] === "[" ? "]" : "}",
        end = raw.lastIndexOf(endChar);
      if (end <= start) throw firstError;
      const extracted = raw.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1").trim();
      return JSON.parse(extracted);
    }
  }
  window.tkParseAiJson = tkParseAiJson_2;
  function tkSlugText(value_6) {
    return String(value_6 || "user").trim().toLowerCase().replace(/\s+/g, "_").replace(/[^\w\u4e00-\u9fa5-]/g, "").slice(0, 40) || "user";
  }
  function tkCountVideoComments(video_9) {
    if (!video_9 || !Array.isArray(video_9.comments)) return 0;
    return video_9.comments.reduce((total, comment) => {
      return total + 1 + (Array.isArray(comment.replies) ? comment.replies.length : 0);
    }, 0);
  }
  function tkNormalizeGeneratedReply(contact_146 = {}, value_147 = 0) {
    const authorName_6 = contact_146.authorName || contact_146.name || "User " + (value_147 + 1),
      authorId_4 = contact_146.authorId || contact_146.id || "reply_" + tkSlugText(authorName_6) + "_" + Date.now() + "_" + value_147,
      authorAvatar_4 = window.tkResolveAvatar(authorId_4, authorName_6, contact_146.authorAvatar || contact_146.avatar || "");
    return {
      id: contact_146.id || "reply_" + Date.now() + "_" + value_147 + "_" + Math.floor(Math.random() * 1000),
      authorId: authorId_4,
      authorName: authorName_6,
      authorAvatar: authorAvatar_4,
      text: String(contact_146.text || contact_146.content || "").trim(),
      translationZh: tkCleanTranslation(contact_146.translationZh || contact_146.translation || contact_146.zhTranslation),
      likes: Number.isFinite(Number(contact_146.likes)) ? Number(contact_146.likes) : Math.floor(Math.random() * 80)
    };
  }
  window.tkSaveProfileVisitors = function (items_151 = [], source = {}) {
    if (!tkState.profile || typeof tkState.profile !== "object") tkState.profile = {};
    const existing_2 = Array.isArray(tkState.profile.visitors) ? tkState.profile.visitors : [],
      nextVisitors = [],
      seenNew = new Set();
    items_151.slice(0, 5).forEach((visitor_2, index_5) => {
      const name_4 = visitor_2.authorName || visitor_2.name || "Visitor " + (index_5 + 1),
        handle_2 = visitor_2.handle || tkSlugText(name_4),
        id_5 = visitor_2.authorId || visitor_2.id || "visitor_" + handle_2 + "_" + Date.now() + "_" + index_5,
        thought_2 = String(visitor_2.thought || visitor_2.reason || visitor_2.text || "").trim().slice(0, 30),
        key_2 = String(handle_2 || id_5 || name_4).toLowerCase();
      if (!name_4 || seenNew.has(key_2)) return;
      seenNew.add(key_2);
      nextVisitors.push({
        id: id_5,
        name: name_4,
        handle: handle_2,
        avatar: window.tkResolveAvatar(id_5, name_4, visitor_2.authorAvatar || visitor_2.avatar || ""),
        thought: thought_2 || "看完你的评论后，想确认你主页里是不是还有同样真实的内容。",
        reason: thought_2 || "看完你的评论后访问了主页",
        sourceVideoId: source.videoId || "",
        sourceCommentId: source.commentId || "",
        createdAt: Date.now() - index_5
      });
    });
    const seenAll = new Set(nextVisitors.map(visitor => String(visitor.handle || visitor.id || visitor.name).toLowerCase()));
    tkState.profile.visitors = nextVisitors.concat(existing_2.filter(visitor_3 => {
      const key_3 = String(visitor_3.handle || visitor_3.id || visitor_3.name).toLowerCase();
      if (seenAll.has(key_3)) return false;
      return seenAll.add(key_3), true;
    })).slice(0, 50);
  };
  function tkInteractionSlug(value_7, fallback = "user") {
    const slug = tkSlugText(value_7 || fallback);
    return slug || fallback;
  }
  function tkEnsureFollowerChar(follower = {}, value_168 = 0) {
    const name_5 = String(follower.authorName || follower.name || "新粉丝" + (value_168 + 1)).trim(),
      handle_3 = tkInteractionSlug(follower.handle || follower.authorId || follower.id || name_5, "follower_" + (value_168 + 1)),
      id_6 = String(follower.authorId || follower.id || "follower_" + handle_3);
    let char_4 = window.tkGetChar ? window.tkGetChar(id_6) : null;
    const avatar_2 = window.tkResolveAvatar ? window.tkResolveAvatar(id_6, name_5, follower.authorAvatar || follower.avatar || "") : follower.authorAvatar || follower.avatar || "";
    if (!char_4 && window.tkSaveChar) {
      window.tkSaveChar({
        id: id_6,
        name: name_5,
        handle: handle_3,
        avatar: avatar_2,
        status: follower.status || "刚刚关注了你",
        persona: follower.persona || name_5 + " 是 TikTok 上刚关注 user 的粉丝。",
        bio: follower.bio || "来自新粉丝",
        isFollowed: false,
        isFollower: true
      });
      char_4 = window.tkGetChar ? window.tkGetChar(id_6) : null;
    } else {
      if (char_4) {
        char_4.isFollower = true;
        if (!char_4.name && name_5) char_4.name = name_5;
        if (!char_4.handle && handle_3) char_4.handle = handle_3;
        if (!char_4.avatar && avatar_2) char_4.avatar = avatar_2;
      }
    }
    return char_4;
  }
  function tkNormalizeGeneratedComment(comment_3 = {}, value_174 = 0) {
    const authorName_7 = comment_3.authorName || comment_3.name || "User " + (value_174 + 1),
      authorId_5 = comment_3.authorId || comment_3.id || "commenter_" + tkInteractionSlug(authorName_7) + "_" + Date.now() + "_" + value_174,
      authorAvatar_5 = window.tkResolveAvatar(authorId_5, authorName_7, comment_3.authorAvatar || comment_3.avatar || "");
    return {
      id: comment_3.id || "cmt_" + Date.now() + "_" + value_174 + "_" + Math.floor(Math.random() * 1000),
      authorId: authorId_5,
      authorName: authorName_7,
      authorAvatar: authorAvatar_5,
      text: String(comment_3.text || comment_3.content || "").trim(),
      translationZh: tkCleanTranslation(comment_3.translationZh || comment_3.translation || comment_3.zhTranslation),
      likes: Number.isFinite(Number(comment_3.likes)) ? Number(comment_3.likes) : Math.floor(Math.random() * 50),
      replies: Array.isArray(comment_3.replies) ? comment_3.replies.map((reply_2, replyIndex) => tkNormalizeGeneratedReply(reply_2, replyIndex)).filter(reply_3 => reply_3.text) : []
    };
  }
  function tkIsUserGeneratedActor(entry_4 = {}) {
    const ids = ["user", "profile", tkState.profile?.id, window.userState?.id].filter(Boolean).map(value_8 => String(value_8).toLowerCase()),
      names = [tkState.profile?.name, window.userState?.name, tkState.profile?.handle, window.userState?.realName].filter(Boolean).map(value_9 => String(value_9).trim().toLowerCase()),
      entryId = String(entry_4.authorId || entry_4.id || "").toLowerCase(),
      entryName = String(entry_4.authorName || entry_4.name || "").trim().toLowerCase();
    return entryId && ids.includes(entryId) || entryName && names.includes(entryName);
  }
  function tkRecordVideoActivity({
    followers = 0,
    followerEntries = [],
    likes = 0,
    saves = 0,
    comments = 0,
    commentEntries = [],
    video = null
  } = {}) {
    tkState.activity = {
      newFollowers: tkState.activity?.newFollowers || "暂无新粉丝",
      likesSaves: tkState.activity?.likesSaves || "互动消息",
      commentsMentions: tkState.activity?.commentsMentions || "互动消息",
      followers: Array.isArray(tkState.activity?.followers) ? tkState.activity.followers : [],
      likes: Array.isArray(tkState.activity?.likes) ? tkState.activity.likes : [],
      saves: Array.isArray(tkState.activity?.saves) ? tkState.activity.saves : [],
      comments: Array.isArray(tkState.activity?.comments) ? tkState.activity.comments : []
    };
    if (followers > 0) tkState.activity.newFollowers = followers + "人关注了你";
    if (Array.isArray(followerEntries) && followerEntries.length) {
      const followerItems = followerEntries.map((contact_190, value_191) => ({
        id: contact_190.id || contact_190.authorId || "follower_activity_" + Date.now() + "_" + value_191,
        name: contact_190.name || contact_190.authorName || "新粉丝" + (value_191 + 1),
        avatar: contact_190.avatar || contact_190.authorAvatar || "",
        text: "关注了你",
        createdAt: Date.now() - value_191
      }));
      tkState.activity.followers = followerItems.concat(tkState.activity.followers).slice(0, 50);
    }
    const likeSaveParts = [];
    if (likes > 0) likeSaveParts.push(likes + "人点赞了你");
    if (saves > 0) likeSaveParts.push(saves + "人收藏了你的视频");
    if (likeSaveParts.length) tkState.activity.likesSaves = likeSaveParts.join(" · ");
    likes > 0 && (tkState.activity.likes = [{
      id: "likes_" + (video?.id || "video") + "_" + Date.now(),
      icon: "fa-heart",
      title: "点赞",
      text: likes + "人点赞了你",
      videoId: video?.id || "",
      createdAt: Date.now()
    }].concat(tkState.activity.likes).slice(0, 50));
    saves > 0 && (tkState.activity.saves = [{
      id: "saves_" + (video?.id || "video") + "_" + Date.now(),
      icon: "fa-bookmark",
      title: "收藏",
      text: saves + "人收藏了你的视频",
      videoId: video?.id || "",
      createdAt: Date.now()
    }].concat(tkState.activity.saves).slice(0, 50));
    if (comments > 0) tkState.activity.commentsMentions = comments + "人评论了你的视频";
    if (Array.isArray(commentEntries) && commentEntries.length) {
      const commentItems = commentEntries.map((contact_193, value_194) => ({
        id: contact_193.id || "comment_activity_" + Date.now() + "_" + value_194,
        name: contact_193.authorName || contact_193.name || "评论者",
        avatar: contact_193.authorAvatar || contact_193.avatar || "",
        text: "评论了你的视频：" + (contact_193.text || ""),
        videoId: video?.id || "",
        commentId: contact_193.id || "",
        createdAt: Date.now() - value_194
      }));
      tkState.activity.comments = commentItems.concat(tkState.activity.comments).slice(0, 50);
    }
  }
  window.tkGenerateVideoInteractions = async function (value_195, options_5 = {}) {
    const found = window.findVideoGlobal ? window.findVideoGlobal(value_195) : {},
      video_10 = found.video,
      author_2 = found.author || tkState.profile || {},
      isAuto_2 = Boolean(options_5.isAuto);
    if (!video_10) return;
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
      if (window.showToast) window.showToast("请先在系统设置中配置 API");
      return;
    }
    if (window.showToast) window.showToast(isAuto_2 ? "AI 正在生成视频互动..." : "AI 正在生成互动数据...");
    const followedChars = (tkState.chars || []).filter(c_3 => c_3.isFollowed).slice(0, 6),
      value_202 = followedChars.length ? followedChars.map(contact_211 => "- CharID: " + contact_211.id + ", 名字: " + (contact_211.name || contact_211.handle) + ", 人设: " + (contact_211.persona || "")).join("\n") : "没有已关注好友。",
      isUserPost = String(video_10.authorId || "") === "profile" || String(author_2.id || "") === "profile" || tkState.profile?.handle && String(author_2.handle || "") === String(tkState.profile.handle),
      userTikTokProfileContext = {
        name: tkState.profile?.name || window.userState?.name || "User",
        handle: tkState.profile?.handle || "user",
        persona: tkState.profile?.persona || window.userState?.persona || "",
        bio: tkState.profile?.bio || "",
        basePersona: window.userState?.persona || ""
      },
      effectiveAuthorContext = isUserPost ? userTikTokProfileContext : {
        name: author_2.name || tkState.profile?.name || "User",
        handle: author_2.handle || "user",
        persona: author_2.persona || tkState.profile?.persona || window.userState?.persona || "",
        bio: author_2.bio || tkState.profile?.bio || "",
        basePersona: window.userState?.persona || ""
      },
      join_206 = [video_10.desc || "", video_10.sceneText || "", Array.isArray(video_10.sceneSegments) ? video_10.sceneSegments.join("\n") : "", effectiveAuthorContext.persona || "", effectiveAuthorContext.bio || "", effectiveAuthorContext.name || "", effectiveAuthorContext.handle || "", window.userState?.persona || ""].filter(Boolean).join("\n"),
      value_207 = window.tkBuildWorldBookContext ? window.tkBuildWorldBookContext(join_206) : "",
      worldActorPrompt = window.tkBuildWorldActorPrompt ? window.tkBuildWorldActorPrompt({
        includeUserIdentity: isUserPost,
        purpose: "视频发布后的评论、关注、点赞、收藏和主页访客互动",
        triggerText: join_206
      }) : "",
      content_4 = "\nCreator identity rule:\n" + (isUserPost ? "This video was posted by the current user. Treat the creator/blogger as the user TikTok account below, and use the TikTok profile persona as the authoritative persona for followers, likes, comments, and visitors." : "This video was posted by another TikTok creator. Use the creator context below, but still avoid impersonating the current user.") + "\nThe world book context was mounted with the video plus the user TikTok persona as trigger text.\n\n你是 TikTok 视频互动模拟器。请根据视频、博主人设、已关注好友和世界书，生成这条视频发布后的真实互动。\n\n" + worldActorPrompt + "\n\n硬性规则：\n1. 只返回严格 JSON 对象，不要 markdown，不要解释，不要尾逗号。\n2. 必须包含 newFollowers、newLikes、newSaves、newComments、visitors 五个字段。\n3. newFollowers 必须是 2-5 个新粉丝对象；每个对象含 authorId、authorName、authorAvatar、handle，可选 persona/status。\n4. newLikes 是点赞人数数字；newSaves 是收藏人数数字。\n5. newComments 必须是 2-5 条评论对象；每条含 authorId、authorName、authorAvatar、text、likes、replies。\n6. 评论可以自然 @ 好友或路人；如果 @ 引发对话，放进 replies 数组，replies 每条含 authorId、authorName、authorAvatar、text、likes。\n7. 禁止扮演user的身份发抖音和评论，你只能是除了user以外的人。严禁扮演、冒充或使用 user/博主本人发评论、点赞、收藏、关注；所有互动者必须是路人、粉丝、已关注好友或新访客。\n8. 评论要有活人感、网感和上下文，不要像公告；如果用了已关注好友，authorId 必须填该好友 CharID。\n9. 评论里的 @ 必须使用对方名字，不要使用账号、handle 或 id。\n10. visitors 必须是 1-3 个主页访客对象；每个对象含 authorName、authorAvatar、handle、thought，thought 是 20-35 个中文字符的心声。\n11. 国际化翻译规则：评论或 replies 的 text 如果不是中文，必须同时填写 translationZh，内容是自然中文翻译；如果 text 是中文，translationZh 必须是空字符串。\n\n视频：\n" + JSON.stringify({
        id: video_10.id,
        desc: video_10.desc || "",
        mediaType: tkGetMediaType(video_10),
        sceneText: tkGetSceneText(video_10),
        sceneSegments: tkGetSceneSegments(video_10),
        currentLikes: video_10.likes || 0,
        currentSaves: video_10.saves || video_10.savedCount || 0,
        currentComments: tkCountVideoComments(video_10)
      }, null, 2) + "\n\n博主：\n" + JSON.stringify({
        ...effectiveAuthorContext,
        isCurrentUserTikTokAccount: isUserPost
      }, null, 2) + "\n\n已关注好友：\n" + value_202 + "\n\n世界书：\n" + (value_207 || "无") + "\n\n返回格式：\n{\n  \"newFollowers\": [\n    {\n      \"authorId\": \"follower_unique_id\",\n      \"authorName\": \"新粉丝名\",\n      \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=follower\",\n      \"handle\": \"follower_handle\"\n    }\n  ],\n  \"newLikes\": 128,\n  \"newSaves\": 23,\n  \"newComments\": [\n    {\n      \"authorId\": \"commenter_id\",\n      \"authorName\": \"评论者\",\n      \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=commenter\",\n      \"text\": \"评论内容\",\n      \"translationZh\": \"\",\n      \"likes\": 12,\n      \"replies\": [\n        {\n          \"authorId\": \"reply_id\",\n          \"authorName\": \"回复者\",\n          \"authorAvatar\": \"\",\n          \"text\": \"reply text\",\n          \"translationZh\": \"回复文字的中文翻译\",\n          \"likes\": 5\n        }\n      ]\n    }\n  ],\n  \"visitors\": [\n    {\n      \"authorName\": \"访客名\",\n      \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=visitor\",\n      \"handle\": \"visitor_handle\",\n      \"thought\": \"这条视频的细节让我想点进主页看看\"\n    }\n  ]\n}\n";
    try {
      const value_212 = await fetch(tkResolveApiEndpoint(), {
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
            content: content_4
          }],
          temperature: parseFloat(window.apiConfig.temperature) || 0.8
        })
      });
      if (!value_212.ok) throw window.u2Api?.createHttpError?.(value_212, await window.u2Api?.readApiError?.(value_212)) || Object.assign(new Error("HTTP " + value_212.status), {
        status: value_212.status
      });
      const value_213 = await value_212.json(),
        parsed = tkParseAiJson_2(value_213.choices?.[0]?.message?.content || ""),
        followers_2 = Array.isArray(parsed.newFollowers) ? parsed.newFollowers.filter(entry_5 => !tkIsUserGeneratedActor(entry_5)).slice(0, 5) : [],
        comments_4 = Array.isArray(parsed.newComments) ? parsed.newComments.filter(entry_6 => !tkIsUserGeneratedActor(entry_6)).slice(0, 5) : [],
        visitors_2 = Array.isArray(parsed.visitors) ? parsed.visitors.filter(entry_7 => !tkIsUserGeneratedActor(entry_7)).slice(0, 3) : [],
        max_218 = Math.max(0, Number(parsed.newLikes) || 0),
        max_219 = Math.max(0, Number(parsed.newSaves) || 0);
      followers_2.forEach((follower_2, index_6) => tkEnsureFollowerChar(follower_2, index_6));
      video_10.likes = (Number(video_10.likes) || 0) + max_218;
      video_10.savedCount = (Number(video_10.savedCount || video_10.saves) || 0) + max_219;
      video_10.saves = video_10.savedCount;
      if (!Array.isArray(video_10.comments)) video_10.comments = [];
      comments_4.map(tkNormalizeGeneratedComment).filter(comment_4 => comment_4.text).reverse().forEach(comment_5 => video_10.comments.unshift(comment_5));
      visitors_2.length && window.tkSaveProfileVisitors && window.tkSaveProfileVisitors(visitors_2, {
        videoId: video_10.id
      });
      video_10.commentsCount = tkCountVideoComments(video_10);
      tkRecordVideoActivity({
        followers: followers_2.length,
        followerEntries: followers_2,
        likes: max_218,
        saves: max_219,
        comments: comments_4.length,
        commentEntries: comments_4,
        video: video_10
      });
      if (window.tkPersistState) window.tkPersistState();
      if (window.tkRenderHome) window.tkRenderHome();
      if (window.tkRenderProfile) window.tkRenderProfile();
      if (window.tkRenderChat) window.tkRenderChat();
      if (value_23 === video_10.id) handleAction_25(video_10);
      const tkFullscreenVideoViewElement = document.getElementById("tk-fullscreen-video-view");
      if (tkFullscreenVideoViewElement && tkFullscreenVideoViewElement.dataset.videoId === video_10.id) {
        const tkFsVideoLikesElement = document.getElementById("tk-fs-video-likes"),
          commentsEl = document.getElementById("tk-fs-video-comments");
        if (tkFsVideoLikesElement) tkFsVideoLikesElement.textContent = window.tkFormatCount(video_10.likes || 0);
        if (commentsEl) commentsEl.textContent = window.tkFormatCount(video_10.commentsCount || 0);
      }
      if (window.showToast) window.showToast("互动数据生成完毕");
    } catch (error_2) {
      console.error("Video Interaction Gen Error:", error_2);
      if (!window.u2Api?.isRequestError?.(error_2) || !window.u2Api.reportError(error_2, {
        operation: "视频互动生成"
      })) {
        if (window.showToast) window.showToast("生成互动失败，请检查 API");
      }
    }
  };
  async function tkGenerateUserCommentAftermath(video_11, targetComment, parentComment, value_231) {
    if (!video_11 || !targetComment || !value_231) return;
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) return;
    const videoContext = {
        desc: video_11.desc || "",
        mediaType: tkGetMediaType(video_11),
        sceneSegments: tkGetSceneSegments(video_11),
        authorName: video_11.authorName || "User"
      },
      join_233 = [window.userState && window.userState.persona ? "User persona: " + window.userState.persona : "", tkState.profile && tkState.profile.persona ? "TikTok profile persona: " + tkState.profile.persona : "", tkState.profile && tkState.profile.bio ? "TikTok profile bio: " + tkState.profile.bio : "", tkState.profile && tkState.profile.name ? "TikTok profile name: " + tkState.profile.name : ""].filter(Boolean).join("\n"),
      parentContext = parentComment ? {
        authorName: parentComment.authorName || "User",
        text: parentComment.text || ""
      } : null,
      value_235 = window.tkBuildWorldBookContext ? window.tkBuildWorldBookContext((video_11.desc || "") + "\n" + value_231 + "\n" + (parentContext ? parentContext.text : "") + "\n" + join_233) : "",
      value_236 = window.tkBuildWorldActorPrompt ? window.tkBuildWorldActorPrompt({
        includeUserIdentity: true,
        purpose: "user 发出评论后的楼中楼回复和主页访客",
        triggerText: (video_11.desc || "") + "\n" + value_231
      }) : "",
      content_5 = "\n你是 TikTok 评论区和主页访客模拟器。请根据当前视频、用户刚发出的评论，以及可选楼主评论，生成真实、有网感、符合上下文的互动。\n\n" + value_236 + "\n\n硬性规则：\n1. 只能返回严格 JSON，不要 markdown，不要解释文字，不要尾逗号，不要单引号。\n2. JSON 顶层必须是对象，且只包含 \"replies\" 和 \"visitors\" 两个数组。\n3. \"replies\" 必须生成 2-5 条相关楼中楼评论；如果用户是在回复楼主，回复内容必须包含楼主评论语境。\n4. \"visitors\" 必须生成 2-5 条主页访客；每条访客必须有 authorName、authorAvatar、handle、thought。\n5. thought 必须是 20-30 个中文字符，写清楚这个人为什么看 user 主页，像真实心声，不要像系统文案。\n6. 所有 key 必须使用英文双引号；所有数组和对象最后一项后面不能有逗号。\n7. 国际化翻译规则：每条 replies 的 text 如果不是中文，必须同时填写 translationZh，内容是自然中文翻译；如果 text 是中文，translationZh 必须是空字符串。\n8. 禁止扮演user的身份发抖音和评论，你只能是除了user以外的人。\n\n视频上下文：\n" + JSON.stringify(videoContext, null, 2) + "\n\nUser context:\n" + (join_233 || "No explicit user persona. Infer a normal TikTok user.") + "\n\n用户评论：\n" + JSON.stringify(value_231) + "\n\n" + (parentContext ? "用户回复的【目标评论】上下文：\n" + JSON.stringify(parentContext, null, 2) + "\n（注意：如果目标评论是楼主，请作为楼中楼互动；如果目标评论也是楼中楼，请延续他们的话题）" : "用户发的是新的根评论，没有上下文。") + "\n\n" + value_235 + "\n\n返回格式示例：\n{\n  \"replies\": [\n    {\n      \"authorName\": \"路人A\",\n      \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=a\",\n      \"text\": \"这句也太像我刚想说的了，尤其是后半句很准。\",\n      \"translationZh\": \"\",\n      \"likes\": 18\n    }\n  ],\n  \"visitors\": [\n    {\n      \"authorName\": \"小梨\",\n      \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=li\",\n      \"handle\": \"xiaoli\",\n      \"thought\": \"她评论太会抓重点了想看看主页\"\n    }\n  ]\n}\n";
    try {
      const value_238 = await fetch(tkResolveApiEndpoint(), {
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
            content: content_5
          }],
          temperature: parseFloat(window.apiConfig.temperature) || 0.8
        })
      });
      if (!value_238.ok) throw window.u2Api?.createHttpError?.(value_238, await window.u2Api?.readApiError?.(value_238)) || Object.assign(new Error("HTTP " + value_238.status), {
        status: value_238.status
      });
      const value_239 = await value_238.json(),
        parsed_2 = tkParseAiJson_2(value_239.choices?.[0]?.message?.content || ""),
        replies_2 = Array.isArray(parsed_2.replies) ? parsed_2.replies.slice(0, 5) : [],
        visitors_3 = Array.isArray(parsed_2.visitors) ? parsed_2.visitors.slice(0, 5) : [];
      if (!Array.isArray(targetComment.replies)) targetComment.replies = [];
      replies_2.map(tkNormalizeGeneratedReply).filter(reply_4 => reply_4.text).forEach(reply_5 => targetComment.replies.push(reply_5));
      window.tkSaveProfileVisitors && window.tkSaveProfileVisitors(visitors_3, {
        videoId: video_11.id,
        commentId: targetComment.id
      });
      video_11.commentsCount = tkCountVideoComments(video_11);
      if (window.tkPersistState) window.tkPersistState();
      if (value_23 === video_11.id) handleAction_25(video_11);
      window.tkRenderHome();
      if (visitors_3.length || replies_2.length) window.showToast("评论互动已更新");
    } catch (error_3) {
      console.error("Comment Followup Gen Error:", error_3);
    }
  }
  const bgBtn = document.getElementById("tk-edit-video-bg-btn"),
    bgUpload = document.getElementById("tk-edit-video-bg-upload"),
    bgImg = document.getElementById("tk-edit-video-bg-img");
  bgBtn && bgUpload && (bgBtn.addEventListener("click", e => {
    if (e.target.tagName !== "INPUT") bgUpload.click();
  }), bgUpload.addEventListener("change", e_2 => {
    const file = e_2.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        bgImg.src = ev.target.result;
        bgImg.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
    e_2.target.value = "";
  }));
  const resetBgBtn = document.getElementById("reset-tk-video-bg-btn");
  resetBgBtn && resetBgBtn.addEventListener("click", () => {
    bgImg && (bgImg.src = "", bgImg.style.display = "none");
  });
  const confirmEditVideoBtn = document.getElementById("tk-confirm-edit-video-btn");
  confirmEditVideoBtn && confirmEditVideoBtn.addEventListener("click", () => {
    if (!currentEditingVideoId) return;
    let targetVideo = null;
    if (window.findVideoGlobal) {
      const found_2 = window.findVideoGlobal(currentEditingVideoId);
      if (found_2) targetVideo = found_2.video;
    } else targetVideo = tkState.videos.find(value_248 => value_248.id === currentEditingVideoId);
    if (targetVideo) {
      targetVideo.cover !== undefined && targetVideo.cover !== null ? targetVideo.cover = bgImg && bgImg.style.display === "block" ? bgImg.src : null : targetVideo.bgImage = bgImg && bgImg.style.display === "block" ? bgImg.src : null;
      targetVideo.bgColor = null;
      targetVideo.desc = document.getElementById("tk-edit-video-desc-input").value.trim();
      targetVideo.sceneText = document.getElementById("tk-edit-video-scene-input").value.trim();
      targetVideo.sceneSegments = tkSplitSceneText(targetVideo.sceneText);
      targetVideo.opening = targetVideo.sceneSegments[0] || "";
      targetVideo.middle = targetVideo.sceneSegments[1] || "";
      targetVideo.ending = targetVideo.sceneSegments[2] || "";
      if (window.tkPersistState) window.tkPersistState();
      window.tkRenderHome();
      if (window.tkRenderProfile) window.tkRenderProfile();
      const tkFullscreenVideoViewElement_249 = document.getElementById("tk-fullscreen-video-view");
      tkFullscreenVideoViewElement_249 && tkFullscreenVideoViewElement_249.classList.contains("active") && tkFullscreenVideoViewElement_249.dataset.videoId === targetVideo.id && window.tkOpenFullscreenVideo(targetVideo.id);
      window.closeView(document.getElementById("tk-edit-single-video-sheet"));
      window.showToast("已保存修改");
    }
  });
  function tkGetFeedCards() {
    return feedContainer ? Array.from(feedContainer.querySelectorAll(".tk-video-card")) : [];
  }
  function handleAction_20(cards) {
    if (!feedContainer || cards.length === 0) return -1;
    let count_251 = 0,
      closestDistance = Number.POSITIVE_INFINITY;
    return cards.forEach((card, value_253) => {
      const distance = Math.abs(card.offsetTop - feedContainer.scrollTop);
      distance < closestDistance && (closestDistance = distance, count_251 = value_253);
    }), count_251;
  }
  function tkPageHomeFeed(direction) {
    const cards_2 = tkGetFeedCards(),
      currentIndex = handleAction_20(cards_2);
    if (currentIndex < 0) return false;
    const nextIndex = Math.min(cards_2.length - 1, Math.max(0, currentIndex + direction));
    if (nextIndex === currentIndex) return false;
    return feedContainer.scrollTo({
      top: cards_2[nextIndex].offsetTop,
      behavior: "smooth"
    }), true;
  }
  function handleAction_21() {
    if (!feedContainer || feedContainer.dataset.tkSingleStepPagingBound === "true") return;
    feedContainer.dataset.tkSingleStepPagingBound = "true";
    feedContainer.addEventListener("wheel", event_2 => {
      if (Math.abs(event_2.deltaY) <= Math.abs(event_2.deltaX) || event_2.deltaY === 0) return;
      if (tkGetFeedCards().length < 2) return;
      event_2.preventDefault();
      if (tkFeedWheelLocked) return;
      tkFeedWheelLocked = true;
      tkPageHomeFeed(event_2.deltaY > 0 ? 1 : -1);
      window.setTimeout(() => {
        tkFeedWheelLocked = false;
      }, 420);
    }, {
      passive: false
    });
    feedContainer.addEventListener("touchstart", event_3 => {
      const touch = event_3.touches[0];
      tkFeedTouchStart = touch ? {
        x: touch.clientX,
        y: touch.clientY
      } : null;
    }, {
      passive: true
    });
    feedContainer.addEventListener("touchmove", event_4 => {
      if (!tkFeedTouchStart) return;
      const value_262 = event_4.touches[0];
      if (!value_262) return;
      const deltaX_2 = value_262.clientX - tkFeedTouchStart.x,
        deltaY_2 = value_262.clientY - tkFeedTouchStart.y;
      if (Math.abs(deltaY_2) > 10 && Math.abs(deltaY_2) > Math.abs(deltaX_2)) event_4.preventDefault();
    }, {
      passive: false
    });
    feedContainer.addEventListener("touchend", event_5 => {
      if (!tkFeedTouchStart) return;
      const touch_2 = event_5.changedTouches[0],
        value_267 = tkFeedTouchStart;
      tkFeedTouchStart = null;
      if (!touch_2) return;
      const deltaX_3 = touch_2.clientX - value_267.x,
        deltaY_3 = touch_2.clientY - value_267.y;
      if (Math.abs(deltaY_3) < 42 || Math.abs(deltaY_3) <= Math.abs(deltaX_3)) return;
      tkPageHomeFeed(deltaY_3 < 0 ? 1 : -1);
    }, {
      passive: true
    });
  }
  function tkSetRecommendTopbarActive() {
    const tabs = Array.from(document.querySelectorAll(".tk-topbar-tab"));
    if (!tabs.length) return;
    tabs.forEach(tab => tab.classList.remove("active"));
    const recommendTab = tabs.find(tab_2 => String(tab_2.textContent || "").includes("推荐")) || tabs[1] || tabs[0];
    recommendTab.classList.add("active");
  }
  window.tkShowLatestGeneratedVideo = function (videoId_2) {
    const searchSheet = document.getElementById("tk-search-generate-sheet");
    if (searchSheet && window.closeView) window.closeView(searchSheet);
    const tkView = document.getElementById("tiktok-view");
    if (tkView) tkView.classList.add("active");
    tkSetRecommendTopbarActive();
    const homeNav = document.querySelector(".tk-bottom-nav .tk-nav-item[data-target=\"tk-home-tab\"]");
    if (homeNav) homeNav.click();else window.tkRenderHome && window.tkRenderHome();
    requestAnimationFrame(() => {
      const safeVideoId = videoId_2 && window.CSS && typeof CSS.escape === "function" ? CSS.escape(String(videoId_2)) : String(videoId_2 || "").replace(/"/g, "\\\""),
        card_2 = videoId_2 && feedContainer ? feedContainer.querySelector(".tk-video-card[data-video-id=\"" + safeVideoId + "\"]") : null;
      if (card_2 && card_2.scrollIntoView) card_2.scrollIntoView({
        block: "start"
      });else feedContainer && (feedContainer.scrollTop = 0);
    });
  };
  window.tkRenderHome = function (value_274 = {}) {
    if (!feedContainer) return;
    const activeTabEl = document.querySelector(".tk-topbar-tab.active"),
      isActiveTabFollowing = activeTabEl && activeTabEl.textContent === "关注";
    let displayVideos = [];
    isActiveTabFollowing ? displayVideos = tkState.videos.filter(v => {
      const char_5 = window.tkGetChar(v.authorId);
      return char_5 && char_5.isFollowed;
    }) : displayVideos = tkState.videos.filter(v_2 => {
      const char_6 = window.tkGetChar(v_2.authorId);
      return !char_6 || !char_6.isFollowed;
    });
    feedContainer.innerHTML = "";
    if (displayVideos.length === 0) {
      isActiveTabFollowing ? feedContainer.innerHTML = "<div class=\"tk-empty-feed\"><p style=\"color: #999; font-size: 14px;\">暂无关注的内容，快去探索吧</p></div>" : feedContainer.innerHTML = "\n                    <div class=\"tk-empty-feed\">\n                        <div class=\"tk-magic-btn-large\" id=\"tk-api-generate-btn-empty\" onclick=\"window.tkTriggerApiGenerate(event)\">\n                            <i class=\"fas fa-search\"></i>\n                            <span>生成内容</span>\n                        </div>\n                        <p style=\"color: #999; font-size: 13px; margin-top: 10px;\">点击搜索生成 TikTok 视频流</p>\n                    </div>\n                ";
      return;
    }
    const items_277 = displayVideos;
    items_277.forEach((video_12, value_282) => {
      const char_7 = window.tkGetChar(video_12.authorId),
        isFollowed_2 = char_7 ? char_7.isFollowed : false,
        authorName_2 = char_7 ? char_7.name || char_7.handle : video_12.authorName,
        finalAvatar = window.tkResolveAvatar(video_12.authorId, authorName_2, video_12.authorAvatar),
        value_287 = finalAvatar ? "<img src=\"" + finalAvatar + "\">" : "<i class=\"fas fa-user\"></i>";
      let formattedDesc = video_12.desc || "";
      formattedDesc = formattedDesc.replace(/#([\w\u4e00-\u9fa5]+)/g, "<span class=\"tk-hashtag\" onclick=\"window.tkOpenHashtag('$1', event)\">#$1</span>");
      const card_3 = document.createElement("div");
      card_3.className = "tk-video-card";
      card_3.dataset.videoId = video_12.id;
      let bgStyleStr = "background: #ffffff;",
        cardContentHtml = "";
      const mediaType_3 = tkGetMediaType(video_12),
        visualImageUrl = mediaType_3 === "image" ? tkStableImageUrl(video_12) : video_12.cover || video_12.bgImage;
      if (visualImageUrl) cardContentHtml += "\n                    <div class=\"tk-feed-visual " + (mediaType_3 === "image" ? "tk-feed-image-visual" : "") + "\">\n                        <img src=\"" + tkEscapeAttr(visualImageUrl) + "\" alt=\"\">\n                    </div>\n                ";else video_12.bgColor && (cardContentHtml += "\n                    <div style=\"width: 100%; aspect-ratio: 3/4; background: " + video_12.bgColor + "; position: absolute; top: 45%; transform: translateY(-50%);\"></div>\n                ");
      const bubbleFlowHtml = tkCreateBubbleFlowHtml(video_12);
      if (bubbleFlowHtml) cardContentHtml += bubbleFlowHtml;else {
        if (video_12.sceneText) {
          let textContainerBg = "#111111";
          if (video_12.cover || video_12.bgImage) textContainerBg = "rgba(17,17,17,0.8)";else video_12.bgColor && (textContainerBg = "#111111");
          cardContentHtml += "\n                    <div style=\"background: " + textContainerBg + "; color: #ffffff; padding: 20px 24px; border-radius: 20px; max-width: 85%; margin: 0 auto; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 16px; line-height: 1.6; word-break: break-word; font-weight: 500; position: relative; z-index: 2; transform: translateY(-5vh);\">\n                        " + video_12.sceneText + "\n                    </div>\n                ";
        } else !video_12.cover && !video_12.bgImage && !video_12.bgColor && (cardContentHtml += "\n                    <div style=\"background: #111111; color: #ffffff; padding: 20px 24px; border-radius: 20px; max-width: 85%; margin: 0 auto; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 16px; line-height: 1.6; word-break: break-word; font-weight: 500; position: relative; z-index: 2; transform: translateY(-5vh);\">\n                        暂无内容\n                    </div>\n                ");
      }
      card_3.innerHTML = "\n                <div class=\"tk-video-text-content\" style=\"" + bgStyleStr + " display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%; position: relative;\">\n                    " + cardContentHtml + "\n                </div>\n\n                <div class=\"tk-right-actions\">\n                    <div class=\"tk-avatar-action\" onclick=\"window.tkHandleProfileClick('" + video_12.authorId + "', event)\">\n                        " + value_287 + "\n                        <div class=\"tk-action-plus " + (isFollowed_2 ? "followed" : "") + "\" onclick=\"window.tkHandleFollow('" + video_12.authorId + "', event)\">\n                            <i class=\"fas fa-plus\"></i>\n                        </div>\n                    </div>\n                    \n                    <div class=\"tk-action-item " + (video_12.isLiked ? "liked" : "") + "\" onclick=\"window.tkHandleLike('" + video_12.id + "', this, event)\">\n                        <i class=\"fas fa-heart\"></i>\n                        <span>" + window.tkFormatCount(video_12.likes || 0) + "</span>\n                    </div>\n                    \n                    <div class=\"tk-action-item\" onclick=\"window.tkOpenComments('" + video_12.id + "', event)\">\n                        <i class=\"fas fa-comment-dots\"></i>\n                        <span>" + window.tkFormatCount(video_12.commentsCount || 0) + "</span>\n                    </div>\n                    \n            <div class=\"tk-action-item\" onclick=\"window.tkOpenShare('" + video_12.id + "', event)\">\n                <i class=\"fas fa-share\" style=\"transform: scaleX(-1);\"></i>\n                <span id=\"share-count-" + video_12.id + "\">" + window.tkFormatCount(video_12.shares || 0) + "</span>\n            </div>\n\n                    <div class=\"tk-music-disc\" onclick=\"window.tkOpenMusic(event)\">\n                        <i class=\"fas fa-music\"></i>\n                    </div>\n                </div>\n\n                " + tkCreateFeedProgressHtml_2(video_12) + "\n\n                <div class=\"tk-bottom-info\">\n                    <div class=\"tk-video-author\">@" + authorName_2 + "</div>\n                    <div class=\"tk-video-desc\">" + formattedDesc + "</div>\n                </div>\n            ";
      feedContainer.appendChild(card_3);
    });
  };
  setTimeout(() => {
    const fsMusicDisc = document.querySelector("#tk-fullscreen-video-view .tk-music-disc");
    if (fsMusicDisc) {
      const newDisc = fsMusicDisc.cloneNode(true);
      fsMusicDisc.parentNode.replaceChild(newDisc, fsMusicDisc);
      newDisc.addEventListener("click", e_3 => window.tkOpenMusic(e_3));
    }
  }, 500);
  const fsView = document.getElementById("tk-fullscreen-video-view"),
    backBtn = document.getElementById("tk-fs-video-back-btn"),
    magicBtn = document.getElementById("tk-fs-video-magic-btn");
  backBtn && fsView && backBtn.addEventListener("click", () => {
    fsView.classList.remove("active");
    const coverEl = document.getElementById("tk-fs-video-cover");
    if (coverEl) coverEl.style.display = "block";
    document.getElementById("tk-fs-video-container").style.background = "transparent";
  });
  window.findVideoGlobal = function (videoId_3) {
    let video_13 = null,
      author_3 = null,
      isUser_2 = false;
    tkState.profile && tkState.profile.posts && (video_13 = tkState.profile.posts.find(v_3 => v_3.id === videoId_3), video_13 && (author_3 = tkState.profile, isUser_2 = true));
    if (!video_13 && tkState.videos) {
      video_13 = tkState.videos.find(value_301 => value_301.id === videoId_3);
      if (video_13) {
        author_3 = window.tkGetChar(video_13.authorId);
        if (!author_3 && video_13.authorId && video_13.authorId.startsWith("user_")) author_3 = {
          handle: video_13.authorName || "user",
          persona: "一个未知的 TikTok 用户",
          avatar: video_13.authorAvatar
        };else !author_3 && (author_3 = {
          handle: video_13.authorName || "unknown",
          persona: "未知用户",
          avatar: video_13.authorAvatar || null
        });
      }
    }
    return {
      video: video_13,
      author: author_3,
      isUser: isUser_2
    };
  };
  window.currentShareVideoId = null;
  setTimeout(() => {
    const fsAvatarBtn = document.querySelector("#tk-fullscreen-video-view .tk-avatar-action");
    fsAvatarBtn && !fsAvatarBtn.dataset.bound && (fsAvatarBtn.dataset.bound = "true", fsAvatarBtn.addEventListener("click", e_4 => {
      const vid_2 = document.getElementById("tk-fullscreen-video-view").dataset.videoId;
      if (vid_2) {
        const {
          video: video_14
        } = window.findVideoGlobal(vid_2);
        video_14 && window.tkHandleProfileClick && window.tkHandleProfileClick(video_14.authorId, e_4);
      }
    }));
    const fsShareBtn = document.getElementById("tk-fs-video-share-btn");
    fsShareBtn && !fsShareBtn.dataset.bound && (fsShareBtn.dataset.bound = "true", fsShareBtn.addEventListener("click", e_5 => {
      const vid = document.getElementById("tk-fullscreen-video-view").dataset.videoId;
      if (window.tkOpenShare && vid) window.tkOpenShare(vid, e_5);
    }));
    const fsCommentBtn = document.getElementById("tk-fs-video-comment-btn");
    fsCommentBtn && !fsCommentBtn.dataset.bound && (fsCommentBtn.dataset.bound = "true", fsCommentBtn.addEventListener("click", value_306 => {
      const vid_3 = document.getElementById("tk-fullscreen-video-view").dataset.videoId;
      if (window.tkOpenComments && vid_3) {
        const {
          video: video_15,
          isUser: isUser_3
        } = window.findVideoGlobal(vid_3);
        if (video_15 && isUser_3) {
          const existing_3 = tkState.videos.find(v_4 => v_4.id === video_15.id);
          !existing_3 ? tkState.videos.push({
            id: video_15.id,
            comments: video_15.comments || [],
            commentsCount: tkCountVideoComments(video_15)
          }) : (existing_3.comments = video_15.comments, existing_3.commentsCount = tkCountVideoComments(video_15));
        }
        window.tkOpenComments(vid_3, value_306);
      }
    }));
    const fsLikeBtn = document.getElementById("tk-fs-video-like-btn");
    fsLikeBtn && !fsLikeBtn.dataset.bound && (fsLikeBtn.dataset.bound = "true", fsLikeBtn.addEventListener("click", e_6 => {
      const vid_4 = document.getElementById("tk-fullscreen-video-view").dataset.videoId;
      window.tkHandleLike && vid_4 && window.tkHandleLike(vid_4, fsLikeBtn, e_6);
    }));
  }, 500);
  window.tkHandleShareAction = function (value_314) {
    const tkShareSheetElement = document.getElementById("tk-share-sheet");
    window.closeView(tkShareSheetElement);
    if (!window.currentShareVideoId) return;
    const {
      video: video_16
    } = window.findVideoGlobal(window.currentShareVideoId);
    if (!video_16) return;
    if (value_314 === "save") {
      video_16.isSaved = !video_16.isSaved;
      if (window.tkPersistState) window.tkPersistState();
      window.showToast(video_16.isSaved ? "已收藏" : "已取消收藏");
    } else {
      if (value_314 === "edit") {
        currentEditingVideoId = window.currentShareVideoId;
        const avatarEl = document.getElementById("tk-edit-video-bg-img");
        if (avatarEl) {
          const src_2 = video_16.bgImage || video_16.cover;
          src_2 ? (avatarEl.src = src_2, avatarEl.style.display = "block") : (avatarEl.src = "", avatarEl.style.display = "none");
        }
        const descInput = document.getElementById("tk-edit-video-desc-input");
        if (descInput) descInput.value = video_16.desc || "";
        const sceneInput = document.getElementById("tk-edit-video-scene-input");
        if (sceneInput) sceneInput.value = video_16.sceneText || "";
        window.openView(document.getElementById("tk-edit-single-video-sheet"));
      } else {
        if (value_314 === "delete") {
          if (confirm("确定要彻底删除这个视频吗？")) {
            const vId = window.currentShareVideoId;
            tkState.videos = tkState.videos.filter(v_5 => v_5.id !== vId);
            tkState.profile && tkState.profile.posts && (tkState.profile.posts = tkState.profile.posts.filter(v_6 => v_6.id !== vId));
            tkState.chars.forEach(c_4 => {
              c_4.likedVideoIds && (c_4.likedVideoIds = c_4.likedVideoIds.filter(id_7 => id_7 !== vId));
            });
            if (window.tkPersistState) window.tkPersistState();
            window.tkRenderHome();
            if (window.tkRenderProfile) window.tkRenderProfile();
            const tkFullscreenVideoViewElement_317 = document.getElementById("tk-fullscreen-video-view");
            tkFullscreenVideoViewElement_317 && tkFullscreenVideoViewElement_317.classList.contains("active") && tkFullscreenVideoViewElement_317.dataset.videoId === vId && tkFullscreenVideoViewElement_317.classList.remove("active");
            window.showToast("已删除");
          }
        }
      }
    }
  };
  window.tkOpenFullscreenVideo = function (videoId_4) {
    let {
      video: video_17,
      author: author_4,
      isUser: isUser_4
    } = window.findVideoGlobal(videoId_4);
    if (!video_17) {
      console.error("tkOpenFullscreenVideo: Video not found for id", videoId_4);
      if (window.showToast) window.showToast("无法加载该视频");
      return;
    }
    !author_4 && (author_4 = {
      handle: "unknown",
      avatar: null
    });
    if (!fsView) {
      console.error("tkOpenFullscreenVideo: fsView not found");
      if (window.showToast) window.showToast("错误: 全屏视频容器未加载");
      return;
    }
    try {
      const coverEl_2 = document.getElementById("tk-fs-video-cover"),
        fsVideoContainer = document.getElementById("tk-fs-video-container");
      if (fsVideoContainer) {
        fsVideoContainer.querySelectorAll(".tk-fs-video-progress").forEach(el => el.remove());
        const innerHTML_2 = tkCreateFeedProgressHtml_2(video_17).trim();
        if (innerHTML_2) {
          const progressWrap = document.createElement("div");
          progressWrap.innerHTML = innerHTML_2;
          const progressEl = progressWrap.firstElementChild;
          progressEl && (progressEl.classList.add("tk-fs-video-progress"), fsVideoContainer.appendChild(progressEl));
        }
        let textBubble = document.getElementById("tk-fs-video-text-bubble");
        !textBubble && (textBubble = document.createElement("div"), textBubble.id = "tk-fs-video-text-bubble", textBubble.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; width: 100%; display: flex; justify-content: center; align-items: center;", fsVideoContainer.insertBefore(textBubble, fsVideoContainer.firstChild));
        coverEl_2 && (coverEl_2.style.objectFit = "contain", coverEl_2.style.boxShadow = "none");
        const src_3 = video_17.cover || video_17.bgImage || video_17.imageUrl || "";
        coverEl_2 && (src_3 ? (coverEl_2.src = src_3, coverEl_2.style.display = "block") : (coverEl_2.src = "", coverEl_2.style.display = "none"));
        fsVideoContainer.style.background = "#ffffff";
        const innerHTML_3 = tkCreateBubbleFlowHtml(video_17, {
          background: src_3 ? "rgba(17,17,17,0.82)" : video_17.bgColor ? "#111111" : "#111111"
        });
        innerHTML_3 ? (textBubble.innerHTML = innerHTML_3, textBubble.style.display = "flex", textBubble.style.justifyContent = "center", textBubble.style.alignItems = "center", textBubble.style.width = "100%", textBubble.style.height = "100%") : (textBubble.innerHTML = "", textBubble.style.display = "none");
      }
      const textContent_2 = video_17.desc ? video_17.desc : tkGetSceneText(video_17),
        descEl = document.getElementById("tk-fs-video-desc");
      descEl && (descEl.textContent = textContent_2, descEl.style.color = "#111111");
      const authorEl = document.getElementById("tk-fs-video-author");
      authorEl && (authorEl.textContent = "@" + (author_4.handle || author_4.id || "user"), authorEl.style.color = "#111111");
      const avatarEl_2 = document.getElementById("tk-fs-video-avatar"),
        iconEl = document.getElementById("tk-fs-video-avatar-icon"),
        src_4 = window.tkResolveAvatar(video_17.authorId, author_4.name || author_4.handle || video_17.authorName, author_4.avatar || video_17.authorAvatar);
      if (src_4) {
        avatarEl_2 && (avatarEl_2.src = src_4, avatarEl_2.style.display = "block");
        if (iconEl) iconEl.style.display = "none";
      } else {
        if (avatarEl_2) avatarEl_2.style.display = "none";
        if (iconEl) iconEl.style.display = "block";
      }
      const tkFsVideoLikesElement_328 = document.getElementById("tk-fs-video-likes");
      if (tkFsVideoLikesElement_328) tkFsVideoLikesElement_328.textContent = window.tkFormatCount(video_17.likes || 0);
      const fsRightActions = document.querySelectorAll("#tk-fullscreen-video-view .tk-action-item i, #tk-fullscreen-video-view .tk-action-item span");
      fsRightActions.forEach(el_2 => {
        (el_2.tagName === "SPAN" || !el_2.parentElement.classList.contains("liked")) && (el_2.style.color = "#111111", el_2.style.textShadow = "none");
      });
      const fsLikeBtn_2 = document.getElementById("tk-fs-video-like-btn");
      if (fsLikeBtn_2) {
        if (video_17.isLiked) {
          fsLikeBtn_2.classList.add("liked");
          const i_2 = fsLikeBtn_2.querySelector("i");
          if (i_2) i_2.style.color = "#ff4b4b";
        } else {
          fsLikeBtn_2.classList.remove("liked");
          const i_3 = fsLikeBtn_2.querySelector("i");
          if (i_3) i_3.style.color = "#111111";
        }
      }
      const commentsEl_2 = document.getElementById("tk-fs-video-comments");
      if (commentsEl_2) commentsEl_2.textContent = window.tkFormatCount(tkCountVideoComments(video_17) || video_17.commentsCount || 0);
      fsView.dataset.videoId = videoId_4;
      fsView.classList.add("active");
    } catch (e_7) {
      console.error("tkOpenFullscreenVideo DOM报错:", e_7);
      if (window.showToast) window.showToast("打开视频失败: " + e_7.message);
    }
  };
  magicBtn && magicBtn.addEventListener("click", async () => {
    const videoId_5 = fsView.dataset.videoId,
      {
        video: video_18,
        author: author_5,
        isUser: isUser_5
      } = window.findVideoGlobal(videoId_5);
    if (!video_18) return;
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
      window.showToast("请在系统设置中配置 API");
      return;
    }
    window.showToast("AI 正在生成互动数据...");
    let text_344 = "";
    if (isUser_5 && tkState && tkState.chars) {
      const friends = tkState.chars.filter(c_5 => c_5.isFollowed).slice(0, 3);
      friends.length > 0 && (text_344 = "\n博主(User)有以下几个已关注的好友（你可以安排他们中的1-2个来评论）：\n" + friends.map(contact_349 => "- CharID: " + contact_349.id + ", 名字: " + contact_349.name + ", 人设: " + contact_349.persona).join("\n") + "\n如果使用了好友的评论，请把他们的 CharID 填在 authorId 字段中，名字填在 authorName 字段。");
    }
    const value_345 = window.tkBuildWorldBookContext ? window.tkBuildWorldBookContext((video_18.desc || "") + "\n" + (video_18.scene || "") + "\n" + (video_18.sceneText || "") + "\n" + (author_5.persona || "")) : "",
      content_2 = "\n你现在是一个 TikTok 互动模拟器。\n用户（也就是发视频的博主）的人设是：" + (author_5.persona || "普通人") + "\n刚发布的视频内容或背景描述是：" + (video_18.scene || video_18.desc || video_18.sceneText || "一段有趣的日常视频") + "\n" + text_344 + "\n" + value_345 + "\n\n请为这个视频生成一些观众的互动数据。评论要具有活人感、网感，如果是朋友的评论要符合朋友的人设语气。\n重要：评论中可以带上艾特好友（@好友名字）或路人，增加互动真实感。艾特别人时，有几率触发被艾特的人在 `replies` 数组中进行楼中楼回复。\n国际化翻译规则：评论或 replies 的 text 如果不是中文，必须同时填写 translationZh，内容是自然中文翻译；如果 text 是中文，translationZh 必须是空字符串。\n要求返回严格的 JSON 格式（不要有多余文字或 markdown），格式如下：\n{\n  \"newLikes\": 850,\n  \"newComments\": [\n    { \n      \"authorId\": \"可能的话填入好友的CharID，否则留空\", \n      \"authorName\": \"观众A或好友名字\", \n      \"authorAvatar\": \"可以留空由系统自动生成\", \n      \"text\": \"太有趣了吧！ @某某\",\n      \"translationZh\": \"\",\n      \"replies\": [\n         { \"authorName\": \"某某\", \"authorAvatar\": \"\", \"text\": \"哈哈哈确实！\", \"translationZh\": \"\", \"likes\": 5 }\n      ]\n    }\n  ]\n}\n";
    try {
      const endpoint_2 = window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint),
        value_350 = await fetch(endpoint_2, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.apiConfig.apiKey
          },
          body: JSON.stringify({
            model: window.apiConfig.model || "gpt-3.5-turbo",
            messages: [{
              role: "system",
              content: "You are a JSON generator."
            }, {
              role: "user",
              content: content_2
            }],
            temperature: parseFloat(window.apiConfig.temperature) || 0.8
          })
        });
      if (!value_350.ok) throw window.u2Api?.createHttpError?.(value_350, await window.u2Api?.readApiError?.(value_350)) || Object.assign(new Error("HTTP " + value_350.status), {
        status: value_350.status
      });
      const data = await value_350.json();
      let aiReply = data.choices[0].message.content;
      const parsed_3 = tkParseAiJson_2(aiReply);
      video_18.likes = (video_18.likes || 0) + (parsed_3.newLikes || Math.floor(Math.random() * 500));
      if (!video_18.comments) video_18.comments = [];
      parsed_3.newComments && Array.isArray(parsed_3.newComments) && parsed_3.newComments.map((comment_6, commentIndex) => tkNormalizeGeneratedComment(comment_6, commentIndex)).filter(comment_7 => comment_7.text).forEach(comment_8 => video_18.comments.unshift(comment_8));
      video_18.commentsCount = tkCountVideoComments(video_18);
      if (window.tkPersistState) window.tkPersistState();
      document.getElementById("tk-fs-video-likes").textContent = window.tkFormatCount(video_18.likes);
      document.getElementById("tk-fs-video-comments").textContent = window.tkFormatCount(video_18.commentsCount || tkCountVideoComments(video_18));
      window.showToast("互动数据生成完毕！");
      if (window.tkRenderProfile) window.tkRenderProfile();
    } catch (value_358) {
      console.error(value_358);
      if (!window.u2Api?.isRequestError?.(value_358) || !window.u2Api.reportError(value_358, {
        operation: "视频互动生成"
      })) window.showToast("生成互动失败，请检查 API");
    }
  });
  if (magicBtn && magicBtn.parentNode) {
    const cloneNode_359 = magicBtn.cloneNode(true);
    magicBtn.parentNode.replaceChild(cloneNode_359, magicBtn);
    cloneNode_359.title = "生成互动";
    cloneNode_359.addEventListener("click", () => {
      const videoId_6 = fsView ? fsView.dataset.videoId : "";
      videoId_6 && window.tkGenerateVideoInteractions && window.tkGenerateVideoInteractions(videoId_6);
    });
  }
  window.tkHandleProfileClick = function (value_361, event_362) {
    event_362.stopPropagation();
    const tkGetChar_363 = window.tkGetChar(value_361);
    if (tkGetChar_363) window.tkOpenSubProfile && window.tkOpenSubProfile(value_361);else {
      const video_19 = tkState.videos.find(value_365 => value_365.authorId === value_361);
      video_19 && (window.tkSaveChar({
        id: value_361,
        name: video_19.authorName,
        handle: value_361,
        avatar: video_19.authorAvatar || null,
        status: "",
        persona: "谢谢你的关注",
        isFollowed: false
      }), window.tkOpenSubProfile && window.tkOpenSubProfile(value_361));
    }
  };
  window.tkHandleFollow = function (authorId_2, event_367) {
    event_367.stopPropagation();
    const char_8 = window.tkGetChar(authorId_2);
    if (char_8 && !char_8.isFollowed) {
      char_8.isFollowed = true;
      if (window.tkPersistState) window.tkPersistState();
      window.tkRenderHome();
      if (window.tkRenderChat) window.tkRenderChat();
      window.showToast("已关注");
    } else {
      if (!char_8) {
        const video_20 = tkState.videos.find(v_7 => v_7.authorId === authorId_2);
        if (video_20) {
          window.tkSaveChar({
            id: authorId_2,
            name: video_20.authorName,
            handle: authorId_2,
            avatar: video_20.authorAvatar || null,
            status: "刚刚发布了视频",
            persona: "谢谢你的关注",
            isFollowed: true
          });
          window.tkRenderHome();
          if (window.tkRenderChat) window.tkRenderChat();
          window.showToast("已关注");
        }
      }
    }
  };
  window.tkHandleLike = function (value_371, fsLikeBtn_3, event_6) {
    if (event_6) event_6.stopPropagation();
    const value_374 = window.findVideoGlobal ? window.findVideoGlobal(value_371) : {},
      video_21 = value_374.video || tkState.videos.find(value_376 => value_376.id === value_371);
    if (video_21) {
      video_21.likes = Number(video_21.likes) || 0;
      video_21.isLiked = !video_21.isLiked;
      video_21.likes = Math.max(0, video_21.likes + (video_21.isLiked ? 1 : -1));
      if (window.tkPersistState) window.tkPersistState();
      video_21.isLiked ? fsLikeBtn_3.classList.add("liked") : fsLikeBtn_3.classList.remove("liked");
      const countEl = fsLikeBtn_3.querySelector("span");
      if (countEl) countEl.textContent = window.tkFormatCount(video_21.likes);
      const tkFsVideoLikesElement_377 = document.getElementById("tk-fs-video-likes"),
        tkFullscreenVideoViewElement_378 = document.getElementById("tk-fullscreen-video-view");
      tkFsVideoLikesElement_377 && tkFullscreenVideoViewElement_378 && tkFullscreenVideoViewElement_378.dataset.videoId === value_371 && (tkFsVideoLikesElement_377.textContent = window.tkFormatCount(video_21.likes));
      if (window.tkRenderProfile) window.tkRenderProfile();
      if (window.tkRenderHome) window.tkRenderHome();
    }
  };
  function handleAction_22(entry_8 = {}, video_22 = {}) {
    const rawId = String(entry_8.authorId || entry_8.id || "").trim(),
      rawName = String(entry_8.authorName || entry_8.name || "").trim(),
      normalize = value_10 => String(value_10 || "").trim().replace(/^@/, "").toLowerCase();
    if (rawId === "profile") return {
      authorId: "profile",
      authorName: tkState.profile?.name || rawName || "User",
      authorAvatar: tkState.profile?.avatar || ""
    };
    const videoAuthorId = String(video_22.authorId || "").trim(),
      videoAuthorName = String(video_22.authorName || "").trim(),
      matchesVideoAuthor = videoAuthorId && (String(rawId) === videoAuthorId || rawName && normalize(rawName) === normalize(videoAuthorName));
    if (matchesVideoAuthor) {
      const char_9 = window.tkGetChar ? window.tkGetChar(videoAuthorId) : null,
        authorName_3 = char_9?.name || videoAuthorName || rawName || "User",
        authorAvatar_2 = window.tkResolveAvatar ? window.tkResolveAvatar(videoAuthorId, authorName_3, char_9?.avatar || video_22.authorAvatar || entry_8.authorAvatar || "") : char_9?.avatar || video_22.authorAvatar || entry_8.authorAvatar || "";
      return {
        authorId: videoAuthorId,
        authorName: authorName_3,
        authorAvatar: authorAvatar_2
      };
    }
    const linkedChar = (tkState.chars || []).find(char_10 => {
      if (!char_10) return false;
      return rawId && String(char_10.id) === rawId || rawId && String(char_10.imCharId || "") === rawId || rawName && normalize(char_10.name) === normalize(rawName) || rawName && normalize(char_10.handle) === normalize(rawName);
    });
    if (linkedChar) {
      const authorName_4 = linkedChar.name || linkedChar.handle || rawName || "User",
        authorAvatar_3 = window.tkResolveAvatar ? window.tkResolveAvatar(linkedChar.id, authorName_4, linkedChar.avatar || entry_8.authorAvatar || "") : linkedChar.avatar || entry_8.authorAvatar || "";
      return {
        authorId: linkedChar.id,
        authorName: authorName_4,
        authorAvatar: authorAvatar_3
      };
    }
    const value_385 = rawId || "commenter_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      value_386 = rawName || "User";
    return {
      authorId: value_385,
      authorName: value_386,
      authorAvatar: window.tkResolveAvatar ? window.tkResolveAvatar(value_385, value_386, entry_8.authorAvatar || "") : entry_8.authorAvatar || ""
    };
  }
  let value_23 = null,
    value_24 = null;
  function handleAction_25(video_23) {
    const list = document.getElementById("tk-comments-list"),
      title_3 = document.getElementById("tk-comments-title");
    if (!list || !title_3) return;
    let totalComments = video_23.comments ? video_23.comments.length : 0;
    video_23.comments && video_23.comments.forEach(c_6 => {
      if (c_6.replies) totalComments += c_6.replies.length;
    });
    title_3.textContent = "评论 (" + window.tkFormatCount(totalComments) + ")";
    list.innerHTML = "";
    video_23.comments && video_23.comments.length > 0 ? video_23.comments.forEach((c_7, index_7) => {
      if (!c_7.id) c_7.id = "cmt_" + Date.now() + "_" + index_7;
      const commentIdentity = handleAction_22(c_7, video_23);
      c_7.authorId = commentIdentity.authorId;
      c_7.authorName = commentIdentity.authorName;
      if (commentIdentity.authorId === "profile") c_7.authorAvatar = null;
      const authorId_3 = commentIdentity.authorId,
        authorName_5 = commentIdentity.authorName,
        authorAvatar_401 = commentIdentity.authorAvatar,
        value_402 = "tk-comment-translation-" + c_7.id,
        value_403 = tkCleanTranslation(c_7.translationZh) ? "<span class=\"tk-comment-translate-btn\" data-translation-target=\"" + tkEscapeAttr(value_402) + "\">翻译</span>" : "",
        value_404 = authorAvatar_401 ? "<img src=\"" + tkEscapeAttr(authorAvatar_401) + "\" style=\"width:100%; height:100%; border-radius:50%; object-fit:cover;\">" : "<i class=\"fas fa-user\"></i>",
        item = document.createElement("div");
      item.className = "tk-comment-item";
      item.innerHTML = "\n                    <div class=\"tk-avatar-small tk-comment-profile-link\" data-author-id=\"" + tkEscapeAttr(authorId_3) + "\" data-author-name=\"" + tkEscapeAttr(authorName_5) + "\" data-author-avatar=\"" + tkEscapeAttr(authorAvatar_401) + "\" style=\"cursor:pointer;\">" + value_404 + "</div>\n                    <div class=\"tk-comment-content\" style=\"cursor:pointer;\">\n                        <div class=\"tk-comment-name tk-comment-profile-link\" data-author-id=\"" + tkEscapeAttr(authorId_3) + "\" data-author-name=\"" + tkEscapeAttr(authorName_5) + "\" data-author-avatar=\"" + tkEscapeAttr(authorAvatar_401) + "\" style=\"cursor:pointer;\">" + tkEscapeHtml(authorName_5) + "</div>\n                        <div class=\"tk-comment-text\" onclick=\"window.tkReplyToComment('" + c_7.id + "', '" + c_7.id + "', '" + tkEscapeAttr(authorName_5) + "', event)\">" + handleAction_10(c_7.text) + "</div>\n                        " + handleAction_4(c_7.translationZh, value_402) + "\n                        <div class=\"tk-comment-meta\">\n                            <span>刚刚</span>\n                            <span onclick=\"window.tkReplyToComment('" + c_7.id + "', '" + c_7.id + "', '" + tkEscapeAttr(authorName_5) + "', event)\">回复</span>\n                            " + value_403 + "\n                        </div>\n                        \n                        <!-- Replies Container -->\n                        <div class=\"tk-comment-replies\" id=\"replies-" + c_7.id + "\" style=\"margin-top: 10px; display: none;\">\n                        </div>\n                        \n                        " + (c_7.replies && c_7.replies.length > 0 ? "\n                        <div class=\"tk-comment-expand\" onclick=\"window.tkToggleReplies('" + c_7.id + "', event)\" style=\"font-size: 12px; color: #888; margin-top: 8px; font-weight: 500;\">\n                            <span id=\"expand-text-" + c_7.id + "\">展开 " + window.tkFormatCount(c_7.replies.length) + " 条回复 <i class=\"fas fa-chevron-down\" style=\"font-size:10px;\"></i></span>\n                        </div>\n                        " : "") + "\n                    </div>\n                    <div class=\"tk-comment-like " + (c_7.isLiked ? "liked" : "") + "\" onclick=\"window.tkToggleCommentLike('" + video_23.id + "', '" + c_7.id + "', this, event)\">\n                        <i class=\"fas fa-heart\"></i>\n                        <span>" + window.tkFormatCount(c_7.likes || 0) + "</span>\n                    </div>\n                ";
      list.appendChild(item);
      item.querySelectorAll(".tk-comment-profile-link").forEach(link => {
        link.addEventListener("click", event_7 => {
          window.tkOpenCommentAuthorProfile(link.dataset.authorId, link.dataset.authorName, link.dataset.authorAvatar, event_7);
        });
      });
      item.querySelectorAll(".tk-comment-translate-btn").forEach(value_407 => {
        value_407.addEventListener("click", window.tkToggleCommentTranslation);
      });
      if (c_7.replies && c_7.replies.length > 0) {
        const querySelector_408 = item.querySelector("#replies-" + c_7.id);
        c_7.replies.forEach((reply, value_409) => {
          if (!reply.id) reply.id = "reply_" + c_7.id + "_" + value_409 + "_" + Date.now();
          const rItem = document.createElement("div");
          rItem.style.display = "flex";
          rItem.style.gap = "10px";
          rItem.style.marginBottom = "12px";
          const replyIdentity = handleAction_22(reply, video_23);
          reply.authorId = replyIdentity.authorId;
          reply.authorName = replyIdentity.authorName;
          if (replyIdentity.authorId === "profile") reply.authorAvatar = null;
          const rName = replyIdentity.authorName || "User",
            rAvatarUrl = replyIdentity.authorAvatar,
            value_412 = rAvatarUrl ? "<img src=\"" + tkEscapeAttr(rAvatarUrl) + "\" style=\"width:100%; height:100%; border-radius:50%; object-fit:cover;\">" : "<i class=\"fas fa-user\"></i>",
            value_413 = reply.text || "",
            value_414 = "tk-reply-translation-" + reply.id,
            value_415 = tkCleanTranslation(reply.translationZh) ? "<span class=\"tk-comment-translate-btn\" data-translation-target=\"" + tkEscapeAttr(value_414) + "\">翻译</span>" : "";
          rItem.innerHTML = "\n                            <div class=\"tk-avatar-small\" style=\"width: 24px; height: 24px; font-size: 12px;\">" + value_412 + "</div>\n                            <div style=\"flex:1;\">\n                                <div style=\"font-size:12px; color:#888; font-weight:500; margin-bottom:2px; cursor:pointer;\" class=\"tk-reply-profile-link\" data-author-name=\"" + tkEscapeAttr(rName) + "\">" + tkEscapeHtml(rName) + "</div>\n                                <div style=\"font-size:13px; color:#111; line-height:1.4; cursor:pointer;\" onclick=\"window.tkReplyToComment('" + c_7.id + "', '" + reply.id + "', '" + tkEscapeAttr(rName) + "', event)\">" + handleAction_10(value_413) + "</div>\n                                " + handleAction_4(reply.translationZh, value_414) + "\n                                <div class=\"tk-comment-meta tk-reply-meta\">\n                                    <span>刚刚</span>\n                                    <span onclick=\"window.tkReplyToComment('" + c_7.id + "', '" + reply.id + "', '" + tkEscapeAttr(rName) + "', event)\" style=\"cursor:pointer;\">回复</span>\n                                    " + value_415 + "\n                                </div>\n                            </div>\n                        ";
          const profileLink = rItem.querySelector(".tk-reply-profile-link");
          profileLink && profileLink.addEventListener("click", event_8 => {
            window.tkOpenCommentAuthorProfile(reply.authorId, rName, rAvatarUrl, event_8);
          });
          rItem.querySelectorAll(".tk-comment-translate-btn").forEach(value_417 => {
            value_417.addEventListener("click", window.tkToggleCommentTranslation);
          });
          querySelector_408.appendChild(rItem);
        });
      }
    }) : list.innerHTML = "<div style=\"text-align:center; padding: 40px; color: #999; font-size: 13px;\">暂无评论，快来抢沙发吧</div>";
  }
  window.tkOpenComments = function (value_418, event_9) {
    if (event_9) event_9.stopPropagation();
    value_23 = value_418;
    value_24 = null;
    window.currentReplyTargetId = null;
    const value_420 = window.findVideoGlobal ? window.findVideoGlobal(value_418) : {},
      value_421 = value_420.video || tkState.videos.find(value_424 => value_424.id === value_418);
    if (!value_421) return;
    const sheetOverlay = document.getElementById("tk-video-detail-sheet");
    if (!sheetOverlay) return;
    handleAction_25(value_421);
    const tkCommentInputElement = sheetOverlay.querySelector("#tk-comment-input");
    tkCommentInputElement && (tkCommentInputElement.value = "", tkCommentInputElement.placeholder = "留下你的精彩评论");
    window.openView(sheetOverlay);
    !sheetOverlay.dataset.boundClose && (sheetOverlay.dataset.boundClose = "true", sheetOverlay.addEventListener("click", event_425 => {
      event_425.target === sheetOverlay && (window.closeView(sheetOverlay), value_23 = null);
    }));
    const sendBtn = sheetOverlay.querySelector("#tk-comment-send-btn"),
      newInputEl = sheetOverlay.querySelector("#tk-comment-input");
    if (sendBtn && newInputEl) {
      const cloneNode_426 = sendBtn.cloneNode(true);
      sendBtn.parentNode.replaceChild(cloneNode_426, sendBtn);
      const sendBtnRef = cloneNode_426,
        handleClick = () => {
          const text_3 = newInputEl.value.trim();
          if (!text_3) return;
          const value_430 = window.findVideoGlobal ? window.findVideoGlobal(value_23) : {},
            vid_5 = value_430.video || tkState.videos.find(value_434 => value_434.id === value_23);
          if (!vid_5) return;
          if (!vid_5.comments) vid_5.comments = [];
          let targetThreadComment = null,
            parentContextComment = null;
          if (value_24) {
            const parentCmt = vid_5.comments.find(value_436 => value_436.id === value_24);
            if (parentCmt) {
              let actualTarget = parentCmt;
              window.currentReplyTargetId && window.currentReplyTargetId !== value_24 && parentCmt.replies && (actualTarget = parentCmt.replies.find(r => r.id === window.currentReplyTargetId) || parentCmt);
              if (!parentCmt.replies) parentCmt.replies = [];
              parentCmt.replies.push({
                id: "reply_" + parentCmt.id + "_" + Date.now(),
                authorId: "profile",
                authorName: window.userState ? window.userState.name : "我",
                authorAvatar: null,
                text: text_3,
                likes: 0
              });
              targetThreadComment = parentCmt;
              parentContextComment = actualTarget;
              setTimeout(() => {
                const elementById = document.getElementById("replies-" + value_24);
                if (elementById) {
                  elementById.style.display = "block";
                  const elementById_439 = document.getElementById("expand-text-" + value_24);
                  elementById_439 && (elementById_439.innerHTML = "收起 <i class=\"fas fa-chevron-up\" style=\"font-size:10px;\"></i>");
                }
              }, 50);
            }
          } else {
            vid_5.comments.unshift({
              id: "cmt_" + Date.now(),
              authorId: "profile",
              authorName: window.userState ? window.userState.name : "我",
              authorAvatar: null,
              text: text_3,
              likes: 0,
              replies: []
            });
            targetThreadComment = vid_5.comments[0];
          }
          vid_5.commentsCount = tkCountVideoComments(vid_5);
          if (window.tkPersistState) window.tkPersistState();
          handleAction_25(vid_5);
          window.tkRenderHome();
          targetThreadComment && tkGenerateUserCommentAftermath(vid_5, targetThreadComment, parentContextComment, text_3);
          newInputEl.value = "";
          newInputEl.placeholder = "留下你的精彩评论";
          value_24 = null;
          window.currentReplyTargetId = null;
          window.showToast("评论已发送");
        };
      sendBtnRef.addEventListener("click", handleClick);
      newInputEl.onkeydown = event_440 => {
        event_440.key === "Enter" && (event_440.preventDefault(), handleClick());
      };
    }
  };
  window.tkReplyToComment = function (rootCommentId, targetCommentId, value_443, event_10) {
    if (typeof targetCommentId === "string" && value_443 && value_443.type) {
      event_10 = value_443;
      value_443 = targetCommentId;
      targetCommentId = rootCommentId;
    } else !event_10 && value_443 && value_443.type && (event_10 = value_443, value_443 = targetCommentId, targetCommentId = rootCommentId);
    if (event_10) event_10.stopPropagation();
    value_24 = rootCommentId;
    window.currentReplyTargetId = targetCommentId || rootCommentId;
    const inputEl = document.getElementById("tk-comment-input");
    inputEl && (inputEl.placeholder = "回复 @" + value_443, inputEl.value = "@" + value_443 + " ", inputEl.focus());
  };
  window.tkToggleCommentLike = function (value_446, value_447, fsLikeBtn_4, event_11) {
    if (event_11) event_11.stopPropagation();
    const value_450 = window.findVideoGlobal ? window.findVideoGlobal(value_446) : {},
      video_24 = value_450.video || tkState.videos.find(value_453 => value_453.id === value_446);
    if (!video_24 || !video_24.comments) return;
    const cmt = video_24.comments.find(value_454 => value_454.id === value_447);
    if (cmt) {
      cmt.isLiked = !cmt.isLiked;
      cmt.likes = (cmt.likes || 0) + (cmt.isLiked ? 1 : -1);
      if (window.tkPersistState) window.tkPersistState();
      cmt.isLiked ? fsLikeBtn_4.classList.add("liked") : fsLikeBtn_4.classList.remove("liked");
      fsLikeBtn_4.querySelector("span").textContent = window.tkFormatCount(cmt.likes);
    }
  };
  window.tkToggleReplies = function (value_455, event_12) {
    if (event_12) event_12.stopPropagation();
    const container = document.getElementById("replies-" + value_455),
      elementById_458 = document.getElementById("expand-text-" + value_455);
    if (!container || !elementById_458) return;
    if (container.style.display === "none") {
      container.style.display = "block";
      elementById_458.innerHTML = "收起 <i class=\"fas fa-chevron-up\" style=\"font-size:10px;\"></i>";
    } else {
      container.style.display = "none";
      const count_2 = container.children.length;
      elementById_458.innerHTML = "展开 " + count_2 + " 条回复 <i class=\"fas fa-chevron-down\" style=\"font-size:10px;\"></i>";
    }
  };
  window.tkToggleCommentTranslation = function (event_13) {
    if (event_13) event_13.stopPropagation();
    const button = event_13?.currentTarget || event_13?.target,
      targetId = button?.dataset?.translationTarget;
    if (!targetId) return;
    const translationEl = document.getElementById(targetId);
    if (!translationEl) return;
    const isHidden = translationEl.style.display === "none" || !translationEl.style.display;
    translationEl.style.display = isHidden ? "block" : "none";
    button.textContent = isHidden ? "收起翻译" : "翻译";
  };
  window.tkOpenShare = function (currentShareVideoId_2, event_14) {
    if (event_14) event_14.stopPropagation();
    window.currentShareVideoId = currentShareVideoId_2;
    const shareSheet = document.getElementById("tk-share-sheet"),
      shareList = document.getElementById("tk-share-list");
    if (!shareSheet || !shareList) return;
    shareList.innerHTML = "";
    const followedChars_2 = tkState.chars.filter(c_8 => c_8.isFollowed);
    followedChars_2.length === 0 ? shareList.innerHTML = "<div style=\"padding: 10px 15px; color: #999; font-size: 13px;\">暂无好友可转发</div>" : followedChars_2.forEach(char_11 => {
      const item_2 = document.createElement("div");
      item_2.className = "tk-share-friend-item";
      const avatarUrl_2 = window.tkResolveAvatar(char_11.id, char_11.name || char_11.handle, char_11.avatar),
        value_473 = avatarUrl_2 ? "<img src=\"" + tkEscapeAttr(avatarUrl_2) + "\" style=\"width:100%; height:100%; border-radius:50%; object-fit:cover;\">" : "<i class=\"fas fa-user\"></i>";
      item_2.innerHTML = "\n                    <div class=\"tk-avatar-small\" style=\"width: 48px; height: 48px;\">" + value_473 + "</div>\n                    <span style=\"font-size: 11px; color: #555; text-align: center; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">" + (char_11.name || char_11.handle) + "</span>\n                ";
      item_2.addEventListener("click", () => {
        window.showToast("已转发给 " + (char_11.name || char_11.handle));
        window.closeView(document.getElementById("tk-share-sheet"));
        let dm = tkState.dms.find(d => d.charId === char_11.id);
        !dm && (dm = {
          charId: char_11.id,
          messages: []
        }, tkState.dms.push(dm));
        dm.messages.push({
          sender: "user",
          text: "[分享了视频]",
          sharedVideoId: window.currentShareVideoId
        });
        const {
          video: video_25
        } = window.findVideoGlobal(window.currentShareVideoId);
        if (video_25) {
          video_25.shares = (video_25.shares || 0) + 1;
          const shareCountEl = document.getElementById("share-count-" + video_25.id);
          shareCountEl && (shareCountEl.innerHTML = "已分享", shareCountEl.style.color = "#ffb300", shareCountEl.previousElementSibling.style.color = "#ffb300");
        }
        if (window.tkPersistState) window.tkPersistState();
        if (window.tkRenderChat) window.tkRenderChat();
        const chatTabBtn = document.querySelector(".tk-bottom-nav .tk-nav-item[data-target=\"tk-chat-tab\"]");
        if (chatTabBtn) chatTabBtn.click();
        setTimeout(() => {
          window.tkOpenChatView && window.tkOpenChatView(char_11.id);
        }, 300);
      });
      shareList.appendChild(item_2);
    });
    const actionsRow = document.querySelector(".tk-share-actions-row");
    actionsRow && (actionsRow.innerHTML = "\n                <div class=\"tk-share-action-item\" onclick=\"window.tkHandleShareAction('save')\">\n                    <div class=\"tk-share-action-icon\"><i class=\"fas fa-bookmark\" id=\"tk-share-save-icon\"></i></div>\n                    <span>收藏</span>\n                </div>\n                <div class=\"tk-share-action-item\" onclick=\"window.tkHandleShareAction('edit')\">\n                    <div class=\"tk-share-action-icon\"><i class=\"fas fa-pen\"></i></div>\n                    <span>编辑</span>\n                </div>\n                <div class=\"tk-share-action-item\" onclick=\"window.tkHandleShareAction('delete')\">\n                    <div class=\"tk-share-action-icon\" style=\"color: #ff3b30;\"><i class=\"fas fa-trash-alt\"></i></div>\n                    <span style=\"color: #ff3b30;\">删除</span>\n                </div>\n                <div class=\"tk-share-action-item\" onclick=\"window.showToast('链接已复制'); window.closeView(document.getElementById('tk-share-sheet'));\">\n                    <div class=\"tk-share-action-icon\"><i class=\"fas fa-link\"></i></div>\n                    <span>复制链接</span>\n                </div>\n            ");
    if (shareSheet && !shareSheet.dataset.boundActions) {
      shareSheet.dataset.boundActions = "true";
      shareSheet.addEventListener("click", event_478 => {
        if (event_478.target === shareSheet) window.closeView(shareSheet);
      });
      const closeBtn = shareSheet.querySelector("#tk-close-share-btn");
      closeBtn && closeBtn.addEventListener("click", () => window.closeView(shareSheet));
    }
    const saveIcon = document.getElementById("tk-share-save-icon");
    if (saveIcon && window.currentShareVideoId) {
      const {
        video: video_28
      } = window.findVideoGlobal(window.currentShareVideoId);
      video_28 && video_28.isSaved ? saveIcon.style.color = "#ffb300" : saveIcon.style.color = "";
    }
    window.openView(shareSheet);
  };
  window.tkOpenHashtag = function (tag, event_15) {
    if (event_15) event_15.stopPropagation();
    const hashtagView = document.getElementById("tk-hashtag-view"),
      titleEl = document.getElementById("tk-hashtag-title"),
      gridEl = document.getElementById("tk-hashtag-grid");
    if (!hashtagView || !titleEl || !gridEl) return;
    titleEl.textContent = "#" + tag;
    const tagVideos = tkState.videos.filter(v_8 => v_8.desc && v_8.desc.includes("#" + tag));
    gridEl.innerHTML = "";
    tagVideos.length > 0 ? tagVideos.forEach(value_483 => {
      const element_484 = document.createElement("div");
      element_484.className = "tk-grid-item";
      let text_485 = "#ffffff";
      if (value_483.bgImage) text_485 = "url('" + value_483.bgImage + "') center/cover no-repeat";else {
        if (value_483.bgColor) text_485 = value_483.bgColor;
      }
      element_484.innerHTML = "\n                    <div class=\"tk-grid-text\" style=\"position: relative; left: 0; top: 0; transform: none; background: " + text_485 + "; color:#111; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding: 8px; width: 100%; height: 100%; box-sizing: border-box; border: none; \">\n                        " + tkEscapeHtml(tkGetSceneText(value_483) ? tkGetSceneText(value_483).substring(0, 15) + "..." : "视频片段") + "\n                    </div>\n                    <div class=\"tk-grid-views\" style=\"color: #fff; text-shadow: none;\"><i class=\"fas fa-play\"></i> " + window.tkFormatCount(value_483.likes || Math.floor(Math.random() * 1000)) + "</div>\n                ";
      element_484.addEventListener("click", () => {
        if (window.tkOpenFullscreenVideo) window.tkOpenFullscreenVideo(value_483.id);
      });
      gridEl.appendChild(element_484);
    }) : gridEl.innerHTML = "<div style=\"grid-column: span 3; padding: 40px 0; text-align: center; color: #999; font-size: 13px;\">暂无相关视频</div>";
    window.openView(hashtagView);
    !hashtagView.dataset.boundClose && (hashtagView.dataset.boundClose = "true", hashtagView.addEventListener("click", event_486 => {
      if (event_486.target === hashtagView) window.closeView(hashtagView);
    }));
  };
  window.tkOpenMusic = function (event_16) {
    if (event_16) event_16.stopPropagation();
    const musicView = document.getElementById("tk-music-view"),
      gridEl_2 = document.getElementById("tk-music-grid");
    if (!musicView || !gridEl_2) return;
    const musicVideos = [...tkState.videos].sort(() => 0.5 - Math.random()).slice(0, 8);
    gridEl_2.innerHTML = "";
    musicVideos.length > 0 ? musicVideos.forEach(value_489 => {
      const element_490 = document.createElement("div");
      element_490.className = "tk-grid-item";
      let text_491 = "#ffffff";
      if (value_489.bgImage) text_491 = "url('" + value_489.bgImage + "') center/cover no-repeat";else {
        if (value_489.bgColor) text_491 = value_489.bgColor;
      }
      element_490.innerHTML = "\n                    <div class=\"tk-grid-text\" style=\"position: relative; left: 0; top: 0; transform: none; background: " + text_491 + "; color:#111; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding: 8px; width: 100%; height: 100%; box-sizing: border-box; border: none; \">\n                        " + tkEscapeHtml(tkGetSceneText(value_489) ? tkGetSceneText(value_489).substring(0, 15) + "..." : "视频片段") + "\n                    </div>\n                    <div class=\"tk-grid-views\" style=\"color: #fff; text-shadow: none;\"><i class=\"fas fa-play\"></i> " + window.tkFormatCount(value_489.likes || Math.floor(Math.random() * 1000)) + "</div>\n                ";
      element_490.addEventListener("click", () => {
        if (window.tkOpenFullscreenVideo) window.tkOpenFullscreenVideo(value_489.id);
      });
      gridEl_2.appendChild(element_490);
    }) : gridEl_2.innerHTML = "<div style=\"grid-column: span 3; padding: 40px 0; text-align: center; color: #999; font-size: 13px;\">暂无相关视频</div>";
    window.openView(musicView);
    !musicView.dataset.boundClose && (musicView.dataset.boundClose = "true", musicView.addEventListener("click", event_492 => {
      if (event_492.target === musicView) window.closeView(musicView);
    }));
  };
  window.tkOpenCommentAuthorProfile = function (value_493, value_494, avatar_3, event_17) {
    if (event_17) event_17.stopPropagation();
    const value_497 = value_493 || "commenter_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name_6 = value_494 || "User";
    window.closeView(document.getElementById("tk-video-detail-sheet"));
    let char_12 = window.tkGetChar(value_497);
    if (!char_12) {
      window.tkSaveChar({
        id: value_497,
        name: name_6,
        handle: value_497,
        avatar: avatar_3 || null,
        persona: name_6 + " 是从 TikTok 评论区进入主页的用户。",
        bio: "来自评论区",
        following: 0,
        followers: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 20000),
        isFollowed: false
      });
      char_12 = window.tkGetChar(value_497);
    } else {
      if (avatar_3 && !char_12.avatar) {
        char_12.avatar = avatar_3;
        if (window.tkPersistState) window.tkPersistState();
      }
    }
    if (window.tkOpenSubProfile) window.tkOpenSubProfile(value_497);
  };
  function tkEnsureSearchGenerateSheet() {
    let sheet = document.getElementById("tk-search-generate-sheet");
    if (sheet) return sheet;
    return sheet = document.createElement("div"), sheet.className = "bottom-sheet-overlay detail-sheet-overlay", sheet.id = "tk-search-generate-sheet", sheet.innerHTML = "\n            <div class=\"bottom-sheet tk-search-generate-sheet\">\n                <div class=\"sheet-handle\"></div>\n                <div class=\"sheet-title\">搜索生成视频</div>\n                <div class=\"detail-sheet-content tk-search-generate-content\">\n                    <div class=\"tk-search-generate-box\">\n                        <i class=\"fas fa-search\"></i>\n                        <input id=\"tk-search-generate-input\" type=\"text\" placeholder=\"想看什么？留空随机生成\">\n                    </div>\n                    <label class=\"tk-search-generate-count\" for=\"tk-search-generate-count-input\">\n                        <span>生成数量</span>\n                        <input id=\"tk-search-generate-count-input\" type=\"number\" min=\"1\" max=\"10\" step=\"1\" value=\"3\" inputmode=\"numeric\" aria-label=\"生成视频数量\">\n                    </label>\n                    <div class=\"sheet-action confirm-action\" id=\"tk-search-generate-confirm\">生成</div>\n                    <div class=\"sheet-action\" id=\"tk-search-generate-cancel\">取消</div>\n                </div>\n            </div>\n        ", document.getElementById("tiktok-view")?.appendChild(sheet), sheet.addEventListener("click", event_501 => {
      if (event_501.target === sheet) window.closeView(sheet);
    }), sheet.querySelector("#tk-search-generate-cancel")?.addEventListener("click", () => window.closeView(sheet)), sheet.querySelector("#tk-search-generate-confirm")?.addEventListener("click", () => {
      const query = sheet.querySelector("#tk-search-generate-input")?.value.trim() || "",
        countInput = sheet.querySelector("#tk-search-generate-count-input"),
        count_3 = Math.min(10, Math.max(1, Number.parseInt(countInput?.value, 10) || 3));
      if (countInput) countInput.value = String(count_3);
      window.closeView(sheet);
      window.tkGenerateSearchVideos(query, count_3);
    }), sheet.querySelectorAll("#tk-search-generate-input, #tk-search-generate-count-input").forEach(value_504 => value_504.addEventListener("keydown", event_505 => {
      event_505.key === "Enter" && (event_505.preventDefault(), sheet.querySelector("#tk-search-generate-confirm")?.click());
    })), sheet;
  }
  window.tkOpenSearchGenerateSheet = function (event_18) {
    if (event_18) event_18.stopPropagation();
    const sheet_2 = tkEnsureSearchGenerateSheet(),
      input = sheet_2.querySelector("#tk-search-generate-input"),
      countInput_2 = sheet_2.querySelector("#tk-search-generate-count-input");
    if (input) input.value = "";
    if (countInput_2) countInput_2.value = "3";
    window.openView(sheet_2);
    setTimeout(() => input?.focus(), 80);
  };
  window.tkTriggerApiGenerate = function (e_8) {
    window.tkOpenSearchGenerateSheet(e_8);
  };
  apiGenBtn && apiGenBtn.addEventListener("click", window.tkOpenSearchGenerateSheet);
  window.tkGenerateSearchVideos = async function (value_510 = "", requestedCount = 3) {
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
      window.showToast("请在系统设置中配置 API");
      return;
    }
    const topic = String(value_510 || "").trim(),
      targetCount = Math.min(10, Math.max(1, Number.parseInt(requestedCount, 10) || 3)),
      contextText_2 = topic || "随机 TikTok 视频流",
      value_515 = window.tkBuildWorldBookContext ? window.tkBuildWorldBookContext(contextText_2) : "",
      userPersonaContext = window.tkBuildWorldActorPrompt ? window.tkBuildWorldActorPrompt({
        includeUserIdentity: false,
        purpose: "TikTok For You 主页内容流",
        triggerText: topic || contextText_2
      }) : "",
      content_3 = "\n你是 TikTok For You 内容流 JSON 生成器。根据用户想看的主题、世界书和 user 人设关键词触发信息，一次生成恰好 " + targetCount + " 条完整 TikTok 内容，内容可以是短视频，也可以是图片帖。\n你可以是这个世界观里的任何非 user 创作者/路人/账号；只有主题确实需要时才提到 user，且永远不能扮演 user。\n\n用户主题：" + (topic || "留空，随机生成但要具体、有生活感") + "\n\n硬性要求：\n1. 返回严格 JSON 数组，数组长度必须恰好为 " + targetCount + "，不要 markdown，不要解释文字。\n2. 每条内容必须有 mediaType，值只能是 \"video\" 或 \"image\"；video 像真实短视频，image 像真实图片帖/随手拍/截图梗图。\n3. 每条内容必须有 opening、middle、ending 三段；每段不少于 40 个字符，建议 40-80 字，分别呈现开头、中间、结尾，适合在画面中央逐条气泡显示。原文可以使用符合作者国籍、世界观和内容语境的任意语言。\n4. image 内容必须额外提供 imagePrompt，描述图片主体、构图、光线、质感；可选 bgImage、cover 或 imageUrl，如果没有真实 URL 就留空。\n5. 每条内容必须有不少于 10 条 comments。每条评论必须有 authorName、authorAvatar、text、likes、replies。\n6. replies 必须保留为数组；每条视频的 replies 楼中楼回复总数不少于 10 条，可以分布在多条评论下；每条回复带 authorName、authorAvatar、text、likes。\n7. desc 要像真实 TikTok 文案，可带 0-3 个 tag。内容要有网感、活人感、镜头感，不要像新闻稿。\n8. 作者和评论头像可使用 https://picsum.photos/150/150?random=数字 或 https://api.dicebear.com/7.x/avataaars/svg?seed=名字。\n9. 国际化翻译规则：opening/middle/ending 如果不是中文，必须分别填写 openingTranslationZh/middleTranslationZh/endingTranslationZh；评论或 replies 的 text 如果不是中文，必须填写 translationZh；如果原文是中文，对应翻译字段必须是空字符串。\n10. 禁止扮演user的身份发抖音和评论，你只能是除了user以外的人。\n\nJSON 示例：\n[\n  {\n    \"mediaType\": \"image\",\n    \"authorName\": \"用户昵称\",\n    \"handle\": \"user_id\",\n    \"authorAvatar\": \"https://picsum.photos/150/150?random=101\",\n    \"desc\": \"刚刚发生的瞬间 #日常 #随手拍\",\n    \"imagePrompt\": \"夜晚便利店门口的暖光随手拍，玻璃反光里有人低头笑，手机纪实感\",\n    \"opening\": \"开头不少于40字，写环境、第一眼看到的动作和氛围，要像画面中央的长气泡文字。\",\n    \"openingTranslationZh\": \"\",\n    \"middle\": \"中间不少于40字，写人物反应、冲突或一句很真实的话，保持第三人称和镜头感。\",\n    \"middleTranslationZh\": \"\",\n    \"ending\": \"结尾不少于40字，写收束、反转、余味或下一秒发生什么，不要短于40字。\",\n    \"endingTranslationZh\": \"\",\n    \"likes\": 1234,\n    \"shares\": 12,\n    \"comments\": [\n      {\n        \"authorName\": \"评论者A\",\n        \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=a\",\n        \"text\": \"评论内容\",\n        \"translationZh\": \"\",\n        \"likes\": 12,\n        \"replies\": [\n          {\n            \"authorName\": \"回复者B\",\n            \"authorAvatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=b\",\n            \"text\": \"楼中楼回复\",\n            \"translationZh\": \"\",\n            \"likes\": 3\n          }\n        ]\n      }\n    ]\n  }\n]\n\n最终输出前请自检：\n- 顶层只能是 JSON 数组，或对象 { \"content\": [...] }。\n- 所有属性名必须是英文双引号。\n- 每条内容至少 10 条 comments，且 replies 总数至少 10 条。\n- opening、middle、ending 每个字段都不少于 40 个字符；如果不是中文，对应 TranslationZh 字段必须给出中文翻译。\n- 不允许尾逗号、注释、markdown 代码块、解释文字、中文引号作为 JSON 引号。\n- 如果不确定图片 URL，请把 imageUrl/bgImage/cover 留空，不要编造不可访问链接。\n\n" + value_515 + "\n" + userPersonaContext + "\n";
    try {
      window.showToast(topic ? "正在按搜索生成内容..." : "正在随机生成内容...");
      const value_518 = await fetch(tkResolveApiEndpoint(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.apiConfig.apiKey
        },
        body: JSON.stringify({
          model: window.apiConfig.model || "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "Return strict valid JSON only. Use double-quoted property names and string values. Do not include markdown, comments, prose, single-quoted strings, or trailing commas."
          }, {
            role: "user",
            content: content_3
          }],
          temperature: parseFloat(window.apiConfig.temperature) || 0.8
        })
      });
      if (!value_518.ok) throw window.u2Api?.createHttpError?.(value_518, await window.u2Api?.readApiError?.(value_518)) || Object.assign(new Error("HTTP " + value_518.status), {
        status: value_518.status
      });
      const data_2 = await value_518.json();
      let aiReply_2 = data_2.choices?.[0]?.message?.content || "";
      const parsed_4 = tkParseAiJson_2(aiReply_2),
        parsedVideos = Array.isArray(parsed_4) ? parsed_4 : Array.isArray(parsed_4.content) ? parsed_4.content : [];
      if (!Array.isArray(parsedVideos) || parsedVideos.length === 0) throw new Error("JSON content is not an array");
      const normalizedVideos = parsedVideos.slice(0, targetCount).map(video_26 => window.tkNormalizeVideoPayload(video_26));
      if (normalizedVideos.length < targetCount) throw new Error("Expected " + targetCount + " videos but received " + normalizedVideos.length);
      normalizedVideos.slice().reverse().forEach(video_27 => {
        tkState.videos.unshift(video_27);
      });
      const latestVideoId = normalizedVideos[0]?.id || null;
      if (window.tkPersistState) window.tkPersistState();
      window.tkShowLatestGeneratedVideo ? window.tkShowLatestGeneratedVideo(latestVideoId) : (window.tkRenderHome(), requestAnimationFrame(() => {
        if (feedContainer) feedContainer.scrollTop = 0;
      }));
      window.showToast("已生成内容");
    } catch (error_4) {
      console.error("Search Gen Error:", error_4);
      if (!window.u2Api?.isRequestError?.(error_4) || !window.u2Api.reportError(error_4, {
        operation: "视频内容生成"
      })) window.showToast("生成失败，请检查 API 或返回格式");
    }
  };
  setTimeout(() => {
    const topbarRight = document.querySelector(".tk-home-topbar .tk-topbar-right");
    topbarRight && (topbarRight.innerHTML = "<i class=\"fas fa-search\" style=\"color: #111; cursor: pointer; font-size: 20px;\"></i>", topbarRight.addEventListener("click", window.tkOpenSearchGenerateSheet));
  }, 100);
  const topTabs = document.querySelectorAll(".tk-topbar-tab");
  topTabs.forEach(tab_3 => {
    tab_3.addEventListener("click", () => {
      topTabs.forEach(t => t.classList.remove("active"));
      tab_3.classList.add("active");
      window.tkRenderHome();
    });
  });
  handleAction_21();
});
