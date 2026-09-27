(function () {
  (window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(() => {
    const appButton = document.getElementById("app-x-btn"),
      view = document.getElementById("x-view"),
      mainContent = view ? view.querySelector(".x-main-content") : null,
      navItems = view ? Array.from(view.querySelectorAll(".x-nav-item[data-target]")) : [],
      tabs = view ? Array.from(view.querySelectorAll(".x-tab-content")) : [],
      indicator = document.getElementById("x-nav-indicator"),
      postDetailView = document.getElementById("x-post-detail-view"),
      postDetailBack = document.getElementById("x-post-detail-back"),
      topicDetailView = document.getElementById("x-topic-detail-view"),
      topicDetailBack = document.getElementById("x-topic-detail-back"),
      topicDetailGenerateBtn = document.getElementById("x-topic-detail-generate-btn"),
      topicDetailHeadline = document.getElementById("x-topic-detail-headline"),
      topicFeedPanel = document.getElementById("x-topic-feed-panel"),
      createTopicSheet = document.getElementById("x-create-topic-sheet"),
      createTopicCancelBtn = document.getElementById("x-create-topic-cancel-btn"),
      createTopicSaveBtn = document.getElementById("x-create-topic-save-btn"),
      createTopicBannerPreview = document.getElementById("x-create-topic-banner-preview"),
      createTopicBannerInput = document.getElementById("x-create-topic-banner-input"),
      createTopicAvatarPreview = document.getElementById("x-create-topic-avatar-preview"),
      createTopicAvatarInput = document.getElementById("x-create-topic-avatar-input"),
      createTopicNameInput = document.getElementById("x-create-topic-name-input"),
      createTopicFansInput = document.getElementById("x-create-topic-fans-input"),
      createTopicImportBtn = document.getElementById("x-topic-import-imessage-btn"),
      createTopicManualBtn = document.getElementById("x-topic-manual-char-btn"),
      createTopicImessageContainer = document.getElementById("x-topic-imessage-list-container"),
      createTopicManualContainer = document.getElementById("x-topic-manual-container"),
      createTopicCharsList = document.getElementById("x-topic-chars-list"),
      topicManualSaveBtn = document.getElementById("x-topic-manual-save-btn"),
      superUpdateBtn = document.getElementById("x-super-update-btn");
    let createTopicAvatarDraft = "",
      banner_2 = "",
      createTopicSelectedChars = [],
      editSuperTopicSheet = null,
      currentEditingSuperTopicId = null,
      editSuperTopicAvatarDraft = "",
      editSuperTopicBannerDraft = "",
      editSuperTopicSelectedChars = [];
    const editSheet = document.getElementById("x-edit-profile-sheet"),
      settingsSheet = document.getElementById("x-settings-sheet"),
      composeSheet = document.getElementById("x-compose-sheet"),
      xProfileSettingsBtnElement = document.getElementById("x-profile-settings-btn"),
      editCancelButton = document.getElementById("x-edit-cancel-btn"),
      editSaveButton = document.getElementById("x-edit-save-btn"),
      settingsCloseButton = document.getElementById("x-settings-close-btn"),
      settingsWorldBookButton = document.getElementById("x-settings-worldbook-btn"),
      composeCancelButton = document.getElementById("x-compose-cancel-btn"),
      composeSubmitButton = document.getElementById("x-compose-submit-btn"),
      composeTextInput = document.getElementById("x-compose-text-input"),
      composeTopicInput = document.getElementById("x-compose-topic-input"),
      composeSuperChip = document.getElementById("x-compose-super-chip"),
      composeSuperName = document.getElementById("x-compose-super-name"),
      composeImageButton = document.getElementById("x-compose-image-placeholder"),
      composeImageInput = document.getElementById("x-compose-image-input"),
      composeImagePreview = document.getElementById("x-compose-image-preview"),
      composeImageClearButton = document.getElementById("x-compose-image-clear-btn"),
      composeImageUrlInput = document.getElementById("x-compose-image-url-input"),
      composeImageUrlButton = document.getElementById("x-compose-image-url-btn"),
      editAvatarPreview = document.getElementById("x-edit-avatar-preview"),
      editAvatarInput = document.getElementById("x-edit-avatar-input"),
      editBannerPreview = document.getElementById("x-edit-banner-preview"),
      editBannerInput = document.getElementById("x-edit-banner-input"),
      editNameInput = document.getElementById("x-edit-name-input"),
      editHandleInput = document.getElementById("x-edit-handle-input"),
      editBioInput = document.getElementById("x-edit-bio-input"),
      editPersonaInput = document.getElementById("x-edit-persona-input"),
      editFollowingInput = document.getElementById("x-edit-following-input"),
      editFollowersInput = document.getElementById("x-edit-followers-input"),
      closeButtons = [document.getElementById("x-back-btn"), document.getElementById("x-profile-close-btn")].filter(Boolean);
    if (!view || !appButton || navItems.length === 0 || tabs.length === 0) return;
    const nextDayBtn = document.getElementById("x-next-day-btn"),
      trendList = document.getElementById("x-trend-list"),
      defaultProfile = {
        name: "User Name",
        handle: "@username",
        bio: "",
        persona: "",
        avatar: "",
        banner: "",
        following: 520,
        followers: 13100,
        profileStatsEdited: false
      },
      defaultTrends = [{
        id: "default-stage-style",
        title: "#黑白舞台造型",
        category: "Entertainment · Trending",
        heat: "52.8K",
        movement: "none"
      }, {
        id: "default-topic-host",
        title: "#超话主持人招募",
        category: "Community · Trending",
        heat: "18.2K",
        movement: "none"
      }, {
        id: "default-citywalk",
        title: "#周末Citywalk",
        category: "City · Rising",
        heat: "9.6K",
        movement: "none"
      }],
      defaultAdvancePreferences = {
        strangersEnabled: true,
        strangersCount: 5,
        trendsEnabled: true,
        trendsCount: 3,
        postsEnabled: true,
        postsCount: 3
      },
      defaultImessageContextMount = Object.freeze({
        enabled: true,
        limit: 20
      }),
      defaultXState = {
        xData: {
          ...defaultProfile,
          edited: false
        },
        xPlayerAccounts: [],
        activeXPlayerAccountId: "",
        xAccountSchemaVersion: 1,
        xCharIdentityMigrationVersion: 0,
        xCharProfileMediaMigrationVersion: 0,
        xTopics: [],
        boundWorldBookIds: [],
        xVisitors: [],
        xDirectMessages: [],
        xPostThreads: {},
        xGeneratedPosts: [],
        xAccounts: [],
        xTrends: defaultTrends.map(trend_2 => ({
          ...trend_2
        })),
        xAdvancePreferences: {
          ...defaultAdvancePreferences
        },
        xHomeBannerUrl: "",
        xSearchBannerUrl: ""
      },
      xImageCompressionPresets = Object.freeze({
        avatar: Object.freeze({
          maxWidth: 512,
          maxHeight: 512,
          quality: 0.82
        }),
        cover: Object.freeze({
          maxWidth: 1600,
          maxHeight: 900,
          quality: 0.82
        }),
        post: Object.freeze({
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82
        })
      }),
      xAcceptedImageTypes = new Set(["image/jpeg", "image/jpg", "image/png"]),
      maxXTrends = 15,
      xLandscapeAvatarImages = Object.freeze(["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=256&h=256&q=82&sat=-100", "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=256&h=256&q=82&sat=-100", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=256&h=256&q=82&sat=-100", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=256&h=256&q=82&sat=-100", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=256&h=256&q=82&sat=-100", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=256&h=256&q=82&sat=-100", "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=256&h=256&q=82&sat=-100", "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=256&h=256&q=82&sat=-100"]),
      postData = {
        island: {
          avatar: "林",
          name: "林屿 Island",
          handle: "@island · 12m",
          text: "首页信息流先按微博的阅读节奏排，保留热搜、转评赞和图文密度，但整体收进 X 的黑白系统里。",
          reposts: "46",
          likes: "3.2K",
          comments: "128",
          commentList: [{
            avatar: "A",
            name: "Akira",
            handle: "@akira · 4m",
            text: "这个层级更像微博，但底色和按钮都很 X。"
          }, {
            avatar: "M",
            name: "Mina",
            handle: "@mina · 2m",
            text: "评论区做成卡片之后，帖子详情就完整很多。"
          }, {
            avatar: "S",
            name: "Sora",
            handle: "@sora · now",
            text: "图片区域保留静态占位也够看排版了。"
          }]
        },
        "super": {
          avatar: "超",
          name: "超话精选",
          handle: "@super · 28m",
          text: "今日签到人数上涨 24%，热门讨论集中在舞台妆造、路透图和饭制剪辑。",
          reposts: "301",
          likes: "8.8K",
          comments: "89",
          commentList: [{
            avatar: "#",
            name: "Topic Bot",
            handle: "@topic · 9m",
            text: "年度舞台名场面已经进入超话热帖榜。"
          }, {
            avatar: "L",
            name: "Luna",
            handle: "@luna · 3m",
            text: "超话页和详情页之间的关系现在更明确。"
          }]
        },
        following: {
          avatar: "M",
          name: "Mina",
          handle: "@mina · 6m",
          text: "Following 里先放关注流的静态样式。后续接账号或角色关系时，可以直接把关注对象的帖子渲染进这里。",
          reposts: "9",
          likes: "642",
          comments: "18",
          commentList: [{
            avatar: "U",
            name: "User",
            handle: "@user · 1m",
            text: "关注页用静态占位就能先验证切换体验。"
          }]
        },
        profile: {
          avatar: "U",
          name: "User Name",
          handle: "@username · pinned",
          text: "个人主页内容卡片先保持静态，重点是排版、层级和底栏切换体验。",
          reposts: "12",
          likes: "520",
          comments: "34",
          commentList: [{
            avatar: "X",
            name: "X App",
            handle: "@xapp · now",
            text: "这条来自个人页 Posts 分栏。"
          }]
        }
      };
    let currentIndex = 0,
      touchStartX = 0,
      touchStartY = 0,
      isTouching = false,
      currentProfile = {
        ...defaultProfile
      },
      profileEditorMode = "edit",
      accountSwitchSheet = null,
      enabled_10 = false,
      avatarDraft = currentProfile.avatar || "",
      bannerDraft = currentProfile.banner || "",
      count_11 = 0,
      currentDetailPostId = null,
      replyTarget = null,
      visitorsSheet = null,
      visitorsList = null,
      addDmSheet = null,
      imessageCharList = null,
      dmList = null,
      manualCharNameInput = null,
      manualCharHandleInput = null,
      manualCharBioInput = null,
      manualCharPersonaInput = null,
      element_15 = null,
      element_16 = null,
      dmChatInput = null,
      dmSettingsSheet = null,
      dmProfileView = null,
      currentProfileIdentity = null,
      charEditSheet = null,
      currentEditingCharId = null,
      charEditAvatarDraft = "",
      coverSeed_3 = "",
      charEditCoverImageDraft = "",
      charProfileGenerateSheet = null,
      currentGeneratingCharId = null,
      charProfileGenerationInFlight = false,
      charProfileReferenceDraft = "",
      charProfileReferenceFileNameDraft = "",
      charProfileReferenceChanged = false,
      charProfilePresetDrafts = [],
      postForwardSheet = null,
      currentForwardPostId = null,
      currentDmId = null,
      searchGenerateSheet = null,
      searchGenerateInput = null,
      searchGenerateMode = "home",
      advanceSheet = null,
      advancePlotInput = null,
      imagePreviewOverlay = null,
      currentTopicContext = null,
      postSettingsSheet = null,
      currentActionPostId = null,
      currentComposeSuperId = null,
      composeImageDraft = "";
    const postVisionRuns = new Set();
    let enabled_20 = false,
      enabled_21 = false;
    const xHomeFeedInitialLimit = 20,
      xHomeFeedPageSize = 20;
    let xHomeFeedRenderLimit = xHomeFeedInitialLimit,
      xHomeFeedTotalPosts = 0,
      xHomeFeedRenderKey = "",
      value_22 = null,
      cachedNormalizedXRevision = -1,
      fallbackXStateRevision = 0,
      xOpenMaintenancePromise = null;
    function safeText(value_3, fallback = "") {
      const text_2 = String(value_3 == null ? "" : value_3).trim();
      return text_2 || fallback;
    }
    function escapeHtml(value_4) {
      return String(value_4 == null ? "" : value_4).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    function parseCompactCount(value_5) {
      const raw_2 = String(value_5 == null ? "0" : value_5).trim().replace(/,/g, ""),
        match_2 = raw_2.match(/^([\d.]+)\s*([Kk万])?$/);
      if (!match_2) return Number(raw_2) || 0;
      const number_2 = Number(match_2[1]) || 0;
      if (match_2[2] === "万") return Math.round(number_2 * 10000);
      if (match_2[2] && match_2[2].toLowerCase() === "k") return Math.round(number_2 * 1000);
      return Math.round(number_2);
    }
    function normalizeProfileCount(value_6, fallback_2 = 0) {
      const raw = String(value_6 == null ? "" : value_6).trim().replace(/,/g, "");
      if (!raw) return Math.max(0, Math.round(Number(fallback_2) || 0));
      const parsed = Number(raw);
      if (!Number.isFinite(parsed) || parsed < 0) return Math.max(0, Math.round(Number(fallback_2) || 0));
      return Math.min(Number.MAX_SAFE_INTEGER, Math.round(parsed));
    }
    function formatCompactCount(value_7) {
      const count_2 = Math.max(0, Number(value_7) || 0);
      if (count_2 >= 10000) return (count_2 / 10000).toFixed(count_2 >= 100000 ? 0 : 1).replace(/\.0$/, "") + "万";
      if (count_2 >= 1000) return (count_2 / 1000).toFixed(count_2 >= 10000 ? 0 : 1).replace(/\.0$/, "") + "K";
      return String(count_2);
    }
    function makeLocalId(value_205) {
      return value_205 + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    }
    function hashPostMetricSeed(value_9) {
      let hash = 2166136261;
      const text_3 = String(value_9 || "post");
      for (let index_2 = 0; index_2 < text_3.length; index_2 += 1) {
        hash ^= text_3.charCodeAt(index_2);
        hash = Math.imul(hash, 16777619);
      }
      return hash >>> 0;
    }
    function handleAction_27(value_209) {
      const likes_2 = 300 + hashPostMetricSeed(value_209 + ":likes") % 29701,
        repostLimit = Math.max(25, Math.floor(likes_2 * 0.24)),
        reposts_2 = 10 + hashPostMetricSeed(value_209 + ":reposts") % repostLimit;
      return {
        likes: likes_2,
        reposts: reposts_2
      };
    }
    function getStableLandscapeAvatar(value_213) {
      const value_214 = hashPostMetricSeed("x-avatar:" + safeText(value_213, "account")) % xLandscapeAvatarImages.length;
      return xLandscapeAvatarImages[value_214];
    }
    function handleAction_29(value_215, seed = "") {
      const avatar_2 = safeText(value_215),
        isImageSource = /^(?:data:image\/|blob:|https?:\/\/|\/|\.\.?\/|assets\/)/i.test(avatar_2) || /\.(?:avif|jpe?g|png|webp)(?:[?#].*)?$/i.test(avatar_2);
      return isImageSource ? avatar_2 : getStableLandscapeAvatar(seed || avatar_2 || "account");
    }
    function buildAvatarHtml(value_219, value_220 = "?") {
      const handleAction_29_221 = handleAction_29(value_219, value_220);
      return "<img src=\"" + escapeHtml(handleAction_29_221) + "\" alt=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer\">";
    }
    function buildAuthorAvatarButton(author_2 = {}, value_222 = "x-avatar") {
      const identity_2 = resolveXAuthorIdentity(author_2.authorId, author_2.handle, author_2.name, author_2.avatar);
      return "<button class=\"" + escapeHtml(value_222) + " x-author-avatar-btn\" type=\"button\" data-x-author-id=\"" + escapeHtml(identity_2.id) + "\" data-x-author-name=\"" + escapeHtml(identity_2.name) + "\" data-x-author-handle=\"" + escapeHtml(identity_2.handle) + "\" data-x-author-avatar=\"" + escapeHtml(identity_2.avatar) + "\" aria-label=\"查看 " + escapeHtml(identity_2.name) + " 的主页\">" + buildAvatarHtml(identity_2.avatar, identity_2.name) + "</button>";
    }
    function handleAction_31() {
      const name_2 = safeText(currentProfile.name, "Me");
      return {
        authorId: "me",
        avatar: handleAction_29(currentProfile.avatar, "me:" + (currentProfile.handle || name_2)),
        name: name_2,
        handle: (currentProfile.handle || "@me") + " · now"
      };
    }
    function normalizeApiEndpoint(config = {}) {
      const endpoint_2 = safeText(config.endpoint);
      return endpoint_2 ? window.u2Api.resolveChatCompletionsEndpoint(endpoint_2) : "";
    }
    function buildXUserBoundaryPrompt() {
      const profile_2 = currentProfile || {};
      return "HIGHEST-PRIORITY IDENTITY BOUNDARY:\nThe current User (" + safeText(profile_2.name, "User") + " " + safeText(profile_2.handle, "@user") + ") is controlled exclusively by the human. Treat the User profile, persona, posts, comments, replies, and chat messages as read-only context.\nNever generate or invent any outbound post, comment, reply, quote, private message, or other social action authored by the User. Never use the User's name, handle, avatar, account identity, or authorId \"me\" as the author of generated content.\nGenerate content only for explicitly requested non-User characters or accounts. When replying in private messages, speak only as the named Char or incoming stranger, never as the User. If a task requests reactions to User content, generate only other accounts reacting to it.\n\nINTERNATIONAL X CONTENT RULE:\nX is a global app. Non-User authors may write in the language that naturally fits their identity, location, persona and context; do not force everyone to write in Chinese. In every JSON object containing user-facing text, comment, reply, bio or private-message content, include a sibling \"translation\" field. If the original content is not Simplified Chinese, \"translation\" must be an accurate, natural Simplified Chinese translation. If the original is already Simplified Chinese, set \"translation\" to an empty string. Arrays of private messages must use objects shaped as {\"text\":\"\",\"translation\":\"\"}, not bare strings. Image descriptions may use Simplified Chinese for reliable rendering.";
    }
    async function requestXChatCompletion(messages_2, options_2 = {}) {
      const config_2 = typeof window.getApiConfig === "function" ? window.getApiConfig() : window.apiConfig || {},
        endpoint_3 = normalizeApiEndpoint(config_2);
      if (!endpoint_3 || !config_2.apiKey) throw new Error("API config missing");
      const value_229 = await fetch(endpoint_3, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + config_2.apiKey
        },
        body: JSON.stringify({
          model: config_2.model || "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: buildXUserBoundaryPrompt()
          }, ...(Array.isArray(messages_2) ? messages_2 : [])],
          temperature: parseFloat(config_2.temperature) || options_2.temperature || 0.8
        })
      });
      if (!value_229.ok) {
        const value_231 = await window.u2Api?.readApiError?.(value_229);
        throw window.u2Api?.createHttpError?.(value_229, value_231) || Object.assign(new Error("API HTTP " + value_229.status), {
          status: value_229.status
        });
      }
      const data = await value_229.json();
      return data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || "";
    }
    function parseJsonPayload(text_4) {
      const raw_3 = safeText(text_4);
      if (!raw_3) throw new Error("Empty API response");
      try {
        return JSON.parse(raw_3);
      } catch (error_2) {
        const match_3 = raw_3.match(/```(?:json)?\s*([\s\S]*?)```/) || raw_3.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (match_3) return JSON.parse(match_3[1]);
        throw error_2;
      }
    }
    function normalizeWorldBookIds(ids = []) {
      return (Array.isArray(ids) ? ids : []).map(String).filter((id_2, index_3, allIds) => id_2 && allIds.indexOf(id_2) === index_3);
    }
    function getCharacterBoundWorldBookIds(characters = []) {
      const list = Array.isArray(characters) ? characters : [characters],
        runtimeFriends = Array.isArray(window.imData?.friends) ? window.imData.friends : [];
      return normalizeWorldBookIds(list.flatMap(character => {
        if (!character || typeof character !== "object") return [];
        const sourceFriendId_2 = character.sourceFriendId || (character.origin === "imessage" ? character.id : null),
          sourceFriend = sourceFriendId_2 == null ? null : runtimeFriends.find(friend => String(friend?.id) === String(sourceFriendId_2));
        return [...(Array.isArray(character.boundBooks) ? character.boundBooks : []), ...(Array.isArray(character.boundWorldBookIds) ? character.boundWorldBookIds : []), ...(Array.isArray(sourceFriend?.boundBooks) ? sourceFriend.boundBooks : [])];
      }));
    }
    function getSelectedWorldBookContext(extraText = "", extraBookIds = []) {
      const state_2 = getXState(),
        selected = new Set(normalizeWorldBookIds([...(state_2.boundWorldBookIds || []), ...normalizeWorldBookIds(extraBookIds)])),
        items_246 = [];
      typeof window.getWorldBooks === "function" && window.getWorldBooks().forEach(book => {
        const isSelected = selected.has(String(book.id));
        if (!isSelected && !book.isGlobal) return;
        const filter_249 = (Array.isArray(book.entries) ? book.entries : []).filter(entry_2 => entry_2 && entry_2.enabled !== false).map(message_251 => "- " + (message_251.keyword || message_251.title || book.name) + ": " + (message_251.content || "")).filter(line => line.trim() !== "- :");
        if (filter_249.length) items_246.push("[WorldBook: " + (book.name || book.id) + "]\n" + filter_249.join("\n"));
      });
      if (typeof window.getBuiltinWorldBookEntries === "function") {
        const map_252 = window.getBuiltinWorldBookEntries().filter(entry_3 => entry_3 && entry_3.enabled !== false).filter(entry => !entry.keyword || !window.worldBookKeywordMatched || window.worldBookKeywordMatched(entry, extraText)).slice(0, 12).map(message_254 => "- " + (message_254.keyword || message_254.title || "builtin") + ": " + (message_254.content || ""));
        if (map_252.length) items_246.push("[Built-in WorldBook]\n" + map_252.join("\n"));
      }
      return items_246.join("\n\n");
    }
    function isCurrentXUserAuthor(raw_4 = {}) {
      const authorId_2 = safeText(raw_4.authorId || raw_4.accountId || raw_4.id).toLocaleLowerCase();
      if (authorId_2 === "me" || authorId_2 === "user:self" || authorId_2 === "current-user") return true;
      const candidateHandle = safeText(raw_4.handle || raw_4.authorHandle || raw_4.accountHandle),
        userHandle = safeText(currentProfile?.handle);
      if (candidateHandle && userHandle && canonicalAccountHandle(candidateHandle, raw_4.authorName || raw_4.name) === canonicalAccountHandle(userHandle, currentProfile?.name)) return true;
      const candidateName = safeText(raw_4.authorName || raw_4.name || raw_4.displayName).toLocaleLowerCase(),
        userName_2 = safeText(currentProfile?.name).toLocaleLowerCase();
      return !!candidateName && !!userName_2 && candidateName === userName_2;
    }
    function sanitizeApiGeneratedComment(rawComment) {
      if (!rawComment || typeof rawComment !== "object" || isCurrentXUserAuthor(rawComment)) return null;
      const options = {
        ...rawComment
      };
      return Array.isArray(rawComment.replies) && (options.replies = rawComment.replies.map(sanitizeApiGeneratedComment).filter(Boolean)), options;
    }
    function sanitizeApiGeneratedPost(rawPost_2, options_3 = {}) {
      if (!rawPost_2 || typeof rawPost_2 !== "object") return null;
      if (!options_3.forceOuterAuthor && isCurrentXUserAuthor(rawPost_2)) return null;
      const sanitized = {
        ...rawPost_2
      };
      Array.isArray(rawPost_2.comments) && (sanitized.comments = rawPost_2.comments.map(sanitizeApiGeneratedComment).filter(Boolean));
      Array.isArray(rawPost_2.commentList) && (sanitized.commentList = rawPost_2.commentList.map(sanitizeApiGeneratedComment).filter(Boolean));
      if (rawPost_2.refPost) sanitized.refPost = sanitizeApiGeneratedPost(rawPost_2.refPost);
      return sanitized;
    }
    function sanitizeApiGeneratedPosts(rawPosts, options_4 = {}) {
      return (Array.isArray(rawPosts) ? rawPosts : []).map(post_2 => sanitizeApiGeneratedPost(post_2, options_4)).filter(Boolean);
    }
    function sanitizeApiGeneratedAuthors(items_2 = []) {
      return (Array.isArray(items_2) ? items_2 : []).filter(item => item && !isCurrentXUserAuthor(item));
    }
    function reconcileTopicCharacterAuthors(rawPosts_2, topic_2, cloneAccountIds_2 = new Set()) {
      const topicChars = (Array.isArray(topic_2?.chars) ? topic_2.chars : []).map(char_2 => {
        const name_3 = safeText(char_2?.name || char_2?.nickname || char_2?.realName, "Char");
        return {
          id: String(char_2?.id || char_2?.sourceFriendId || ""),
          sourceFriendId: safeText(char_2?.sourceFriendId),
          name: name_3,
          handle: makeHandle(name_3, char_2?.handle || char_2?.realName || char_2?.signature || name_3),
          avatar: safeText(char_2?.avatar || char_2?.avatarUrl)
        };
      }).filter(char => char.id && char.name);
      if (!topicChars.length) return Array.isArray(rawPosts_2) ? rawPosts_2 : [];
      const uniqueNameCounts = topicChars.reduce((counts, char_3) => {
          const key_2 = char_3.name.toLocaleLowerCase();
          return counts.set(key_2, (counts.get(key_2) || 0) + 1), counts;
        }, new Map()),
        value_272 = raw_5 => {
          if (!raw_5 || typeof raw_5 !== "object") return null;
          const authorId_3 = safeText(raw_5.authorId || raw_5.accountId),
            authorName_2 = safeText(raw_5.authorName || raw_5.name || raw_5.displayName),
            authorHandle_2 = canonicalAccountHandle(raw_5.handle || raw_5.authorHandle, authorName_2);
          return topicChars.find(char_4 => authorId_3 && (authorId_3 === char_4.id || authorId_3 === char_4.sourceFriendId)) || topicChars.find(char_5 => authorHandle_2 && authorHandle_2 === canonicalAccountHandle(char_5.handle, char_5.name)) || topicChars.find(char_6 => {
            const key_3 = authorName_2.toLocaleLowerCase();
            return key_3 && uniqueNameCounts.get(key_3) === 1 && char_6.name.toLocaleLowerCase() === key_3;
          }) || null;
        },
        reconcileAuthor = raw_6 => {
          if (!raw_6 || typeof raw_6 !== "object") return raw_6;
          const matched = value_272(raw_6);
          if (matched) {
            const previousAuthorId = safeText(raw_6.authorId || raw_6.accountId);
            if (previousAuthorId && previousAuthorId !== matched.id) cloneAccountIds_2.add(previousAuthorId);
            raw_6.authorId = matched.id;
            delete raw_6.accountId;
            raw_6.authorName = matched.name;
            raw_6.name = matched.name;
            raw_6.handle = matched.handle;
            raw_6.authorHandle = matched.handle;
            matched.avatar && (raw_6.authorAvatar = matched.avatar, raw_6.avatar = matched.avatar);
          }
          const items_289 = Array.isArray(raw_6.comments) ? raw_6.comments : Array.isArray(raw_6.commentList) ? raw_6.commentList : [];
          items_289.forEach(reconcileAuthor);
          if (raw_6.refPost) reconcileAuthor(raw_6.refPost);
          return raw_6;
        };
      return (Array.isArray(rawPosts_2) ? rawPosts_2 : []).map(reconcileAuthor);
    }
    async function handleAction_36() {
      const state_3 = getXState();
      if (state_3.xCharIdentityMigrationVersion >= 1) return state_3;
      const cloneAccountIds = new Set(),
        topics = Array.isArray(state_3.xTopics) ? state_3.xTopics : [],
        posts_2 = (state_3.xGeneratedPosts || []).map(post_3 => ({
          ...post_3
        }));
      topics.forEach(topic_3 => {
        const topicPosts = posts_2.filter(post_4 => String(post_4.superTopicId || "") === String(topic_3.id || topic_3.name || "") || !post_4.superTopicId && safeText(post_4.superTopicName) === safeText(topic_3.name || topic_3.title));
        reconcileTopicCharacterAuthors(topicPosts, topic_3, cloneAccountIds);
      });
      const migrated = saveXState({
        ...state_3,
        xGeneratedPosts: posts_2,
        xAccounts: (state_3.xAccounts || []).filter(account_2 => !cloneAccountIds.has(String(account_2.id))),
        xCharIdentityMigrationVersion: 1
      });
      return await flushXStateNow("x-char-identity-migration"), migrated;
    }
    function isLegacyCharProfileRandomImage(image_2) {
      const url_2 = safeText(image_2?.url || image_2?.src || image_2?.imageUrl);
      return /^https:\/\/picsum\.photos\//i.test(url_2);
    }
    async function handleAction_37() {
      const state_4 = getXState();
      if (state_4.xCharProfileMediaMigrationVersion >= 2) return state_4;
      const normalizedDirectMessages = (state_4.xDirectMessages || []).map(item_2 => ({
          ...item_2,
          profilePosts: (item_2.profilePosts || []).map(post_5 => ({
            ...post_5,
            images: (Array.isArray(post_5.images) ? post_5.images : []).filter(image_3 => !isLegacyCharProfileRandomImage(image_3))
          }))
        })),
        existingProfilePosts = normalizedDirectMessages.flatMap(item_3 => item_3.profilePosts || []),
        migrated_2 = saveXState({
          ...state_4,
          xDirectMessages: normalizedDirectMessages,
          xGeneratedPosts: prependUniquePosts(state_4.xGeneratedPosts || [], existingProfilePosts),
          xCharProfileMediaMigrationVersion: 2
        });
      return await flushXStateNow("x-char-profile-media-migration"), migrated_2;
    }
    function getGeneratedTranslation(raw_7 = {}, originalText = "") {
      const translation_2 = safeText(raw_7.translation || raw_7.translationZh || raw_7.zhTranslation || raw_7.translatedText || raw_7.textZh || raw_7.chineseTranslation);
      return translation_2 && translation_2 !== safeText(originalText) ? translation_2 : "";
    }
    function normalizeGeneratedComment(comment_2, fallbackIndex = 0) {
      const text_5 = safeText(comment_2.text || comment_2.content);
      if (!text_5) return null;
      const name_4 = safeText(comment_2.authorName || comment_2.name || comment_2.handle);
      if (!name_4) return null;
      const identity_3 = resolveXAuthorIdentity(comment_2.authorId || comment_2.accountId, comment_2.handle, name_4, comment_2.authorAvatar || comment_2.avatar);
      return {
        id: String(comment_2.id || makeLocalId("comment")),
        authorId: identity_3.id,
        avatar: identity_3.avatar,
        name: identity_3.name,
        handle: identity_3.handle,
        text: text_5,
        translation: getGeneratedTranslation(comment_2, text_5),
        replies: (Array.isArray(comment_2.replies) ? comment_2.replies : []).map((reply, index_4) => {
          const replyText = safeText(reply.text || reply.content);
          if (!replyText) return null;
          const replyName_2 = safeText(reply.authorName || reply.name || reply.handle);
          if (!replyName_2) return null;
          const replyIdentity = resolveXAuthorIdentity(reply.authorId || reply.accountId, reply.handle, replyName_2, reply.authorAvatar || reply.avatar);
          return {
            id: String(reply.id || makeLocalId("reply")),
            authorId: replyIdentity.id,
            avatar: replyIdentity.avatar,
            name: replyIdentity.name,
            handle: replyIdentity.handle,
            text: replyText,
            translation: getGeneratedTranslation(reply, replyText),
            replies: []
          };
        }).filter(Boolean)
      };
    }
    function normalizeGeneratedPost(raw_8, value_319 = 0) {
      const authorName_3 = safeText(raw_8.authorName || raw_8.name || raw_8.handle || raw_8.authorHandle);
      if (!authorName_3) return null;
      const identity_4 = resolveXAuthorIdentity(raw_8.authorId || raw_8.accountId, raw_8.handle || raw_8.authorHandle, authorName_3, raw_8.authorAvatar || raw_8.avatar),
        id_3 = String(raw_8.id || makeLocalId("xgen")),
        frontendMetrics = handleAction_27(id_3),
        text_6 = safeText(raw_8.text || raw_8.desc || raw_8.content);
      if (!text_6 && !raw_8.isMoment) return null;
      const text_7 = safeText(raw_8.imageText || raw_8.imagePrompt || raw_8.image || raw_8.picture || raw_8.mediaDescription),
        rawImages = Array.isArray(raw_8.images) ? raw_8.images : [],
        images_2 = rawImages.length > 0 ? rawImages.map((image_4, value_330) => ({
          id: String(image_4.id || id_3 + "-image-" + value_330),
          text: safeText(image_4.text || image_4.prompt || image_4.description || image_4.alt || text_7),
          url: safeText(image_4.url || image_4.src || image_4.imageUrl),
          assetId: safeText(image_4.assetId || image_4.imageAssetId),
          imageSource: safeText(image_4.imageSource),
          imageProvider: safeText(image_4.imageProvider),
          imageModel: safeText(image_4.imageModel),
          imageSize: safeText(image_4.imageSize),
          faceReferenceUsed: image_4.faceReferenceUsed === true,
          vision: image_4?.vision && typeof image_4.vision === "object" ? {
            ...image_4.vision
          } : undefined
        })) : text_7 || raw_8.mediaType === "image" ? [{
          id: id_3 + "-image-0",
          text: text_7,
          url: ""
        }] : [],
        items_327 = Array.isArray(raw_8.comments) ? raw_8.comments : Array.isArray(raw_8.commentList) ? raw_8.commentList : [],
        comments_2 = items_327.map((value_331, value_332) => normalizeGeneratedComment(value_331, value_332)).filter(Boolean);
      return {
        id: id_3,
        authorId: identity_4.id,
        avatar: identity_4.avatar,
        name: identity_4.name,
        handle: identity_4.handle,
        text: text_6,
        translation: getGeneratedTranslation(raw_8, text_6),
        reposts: formatCompactCount(frontendMetrics.reposts),
        likes: formatCompactCount(frontendMetrics.likes),
        comments: formatCompactCount(Math.max(Number(raw_8.commentsCount) || 0, comments_2.length)),
        commentList: comments_2,
        images: images_2,
        generated: true,
        topicTag: raw_8.topicTag || "",
        superTopicId: safeText(raw_8.superTopicId),
        superTopicName: safeText(raw_8.superTopicName),
        isMoment: !!raw_8.isMoment,
        actionText: safeText(raw_8.actionText),
        refPost: raw_8.refPost ? normalizeGeneratedPost(raw_8.refPost, 0) : null,
        isFeatured: !!raw_8.isFeatured,
        profileOwnerId: safeText(raw_8.profileOwnerId),
        createdAt: raw_8.createdAt || Date.now()
      };
    }
    function getPostImages(post_6) {
      return (Array.isArray(post_6?.images) ? post_6.images : []).filter(image_5 => safeText(image_5?.url));
    }
    function renderPostImages(items_335 = []) {
      if (!items_335.length) return "";
      return "\n                <div class=\"x-generated-media-grid\">\n                    " + items_335.slice(0, 4).map(value_336 => "\n                        <button class=\"x-post-image-thumb\" type=\"button\" data-image-text=\"" + escapeHtml(value_336.text || "Image") + "\" data-image-url=\"" + escapeHtml(value_336.url || "") + "\">\n                            <img src=\"" + escapeHtml(value_336.url) + "\" alt=\"\" onerror=\"this.remove()\">\n                        </button>\n                    ").join("") + "\n                </div>\n            ";
    }
    function makeHandle(name_5, value_338) {
      const safeText_339 = safeText(value_338);
      if (safeText_339) return safeText_339.startsWith("@") ? safeText_339 : "@" + safeText_339;
      const base = safeText(name_5, "user").toLowerCase().replace(/[^a-z0-9_\u4e00-\u9fa5]+/gi, "");
      return "@" + (base || "user");
    }
    function canonicalAccountHandle(handle_2, name_6 = "") {
      const raw_9 = safeText(handle_2).split("·")[0].trim();
      return makeHandle(name_6, raw_9 || name_6).toLocaleLowerCase();
    }
    function handleAction_39(value_344 = getXState()) {
      const items_345 = [],
        value_346 = new Set();
      return (value_344.xTopics || []).forEach(value_347 => {
        (Array.isArray(value_347?.chars) ? value_347.chars : []).forEach(char_7 => {
          if (!char_7 || typeof char_7 !== "object") return;
          const name_7 = safeText(char_7.name || char_7.nickname || char_7.realName, "Char"),
            id_15 = String(char_7.id || char_7.sourceFriendId || (value_347.id || value_347.name) + ":" + name_7),
            value_351 = id_15 + "|" + canonicalAccountHandle(char_7.handle, name_7);
          if (value_346.has(value_351)) return;
          value_346.add(value_351);
          items_345.push({
            id: id_15,
            sourceFriendId: safeText(char_7.sourceFriendId),
            name: name_7,
            handle: makeHandle(name_7, char_7.handle || char_7.realName || char_7.signature || name_7),
            avatar: handleAction_29(char_7.avatar || char_7.avatarUrl, "topic-char:" + id_15),
            bio: safeText(char_7.bio || char_7.signature),
            persona: safeText(char_7.persona || char_7.characterPersona || char_7.systemPrompt),
            coverSeed: safeText(char_7.coverSeed, id_15 + "-cover"),
            coverImage: safeText(char_7.coverImage),
            kind: "topic-char"
          });
        });
      }), items_345;
    }
    function handleAction_40(value_352, value_353, value_354, value_355 = getXState()) {
      const requestedId = safeText(value_352),
        requestedHandle = canonicalAccountHandle(value_353, value_354),
        identities = handleAction_39(value_355);
      return identities.find(identity_5 => requestedId && (String(identity_5.id) === requestedId || String(identity_5.sourceFriendId || "") === requestedId)) || identities.find(identity_6 => requestedHandle && canonicalAccountHandle(identity_6.handle, identity_6.name) === requestedHandle) || null;
    }
    function makeAccountId(handle_3, name_8 = "") {
      const key_4 = canonicalAccountHandle(handle_3, name_8).replace(/^@/, "").replace(/[^a-z0-9_\u4e00-\u9fa5-]+/gi, "-");
      return "account:" + (key_4 || safeText(name_8, "user").toLocaleLowerCase());
    }
    function getStableExternalImage(seed_2, value_363 = 1200, value_364 = 480) {
      const safeSeed = encodeURIComponent(safeText(seed_2, "x-image").replace(/\s+/g, "-"));
      return "https://picsum.photos/seed/" + safeSeed + "/" + value_363 + "/" + value_364 + "?grayscale";
    }
    function normalizeXAccount(raw_10 = {}, value_367 = 0) {
      const name_9 = safeText(raw_10.name || raw_10.authorName || raw_10.handle, "X User"),
        handle_4 = makeHandle(name_9, raw_10.handle || raw_10.authorHandle || name_9),
        id_4 = String(raw_10.id || raw_10.authorId || makeAccountId(handle_4, name_9));
      return {
        id: id_4,
        name: name_9,
        handle: handle_4,
        avatar: handleAction_29(raw_10.avatar || raw_10.authorAvatar, id_4 + ":" + handle_4),
        bio: safeText(raw_10.bio || raw_10.signature, "暂无简介"),
        persona: safeText(raw_10.persona),
        coverSeed: safeText(raw_10.coverSeed, id_4 + "-" + value_367 + "-cover"),
        isFollowing: raw_10.isFollowing !== false,
        source: safeText(raw_10.source, "generated"),
        createdAt: Number(raw_10.createdAt) || Date.now()
      };
    }
    function normalizeXAccounts(value_371 = []) {
      const seen_2 = new Set();
      return (Array.isArray(value_371) ? value_371 : []).map((value_373, value_374) => normalizeXAccount(value_373, value_374)).filter(item_4 => {
        if (seen_2.has(item_4.id)) return false;
        return seen_2.add(item_4.id), true;
      });
    }
    function clampAdvanceCount(value_10, fallback_3, maximum = 20) {
      const parsed_2 = Number.parseInt(value_10, 10);
      if (!Number.isFinite(parsed_2)) return fallback_3;
      return Math.min(maximum, Math.max(1, parsed_2));
    }
    function normalizeAdvancePreferences(raw_11 = {}) {
      const source_2 = raw_11 && typeof raw_11 === "object" ? raw_11 : {};
      return {
        strangersEnabled: source_2.strangersEnabled !== false,
        strangersCount: clampAdvanceCount(source_2.strangersCount, defaultAdvancePreferences.strangersCount),
        trendsEnabled: source_2.trendsEnabled !== false,
        trendsCount: clampAdvanceCount(source_2.trendsCount, defaultAdvancePreferences.trendsCount, maxXTrends),
        postsEnabled: source_2.postsEnabled !== false,
        postsCount: clampAdvanceCount(source_2.postsCount, defaultAdvancePreferences.postsCount)
      };
    }
    function handleAction_45(raw_12 = {}, value_382 = 0) {
      let title_2 = safeText(raw_12.title || raw_12.topic || raw_12.name || raw_12.keyword);
      if (!title_2) return null;
      if (!title_2.startsWith("#")) title_2 = "#" + title_2.replace(/^#+/, "");
      const category_2 = safeText(raw_12.category || raw_12.label || raw_12.type, "Trending"),
        heatValue = raw_12.heat ?? raw_12.count ?? raw_12.score ?? raw_12.hotness,
        heat_2 = typeof heatValue === "number" ? formatCompactCount(heatValue) : safeText(heatValue, "Trending");
      return {
        id: String(raw_12.id || makeLocalId("trend-" + value_382)),
        title: title_2,
        category: category_2,
        heat: heat_2,
        movement: ["up", "down"].includes(raw_12.movement) ? raw_12.movement : "none"
      };
    }
    function normalizeTrendList(value_387 = []) {
      const value_388 = new Set();
      return (Array.isArray(value_387) ? value_387 : []).map((value_389, value_390) => handleAction_45(value_389, value_390)).filter(item_5 => {
        if (!item_5) return false;
        const key_5 = item_5.title.toLocaleLowerCase();
        if (value_388.has(key_5)) return false;
        return value_388.add(key_5), true;
      });
    }
    function normalizeXPlayerAccount(value_393 = {}, fallbackProfile = defaultProfile, value_395 = 0) {
      const profile_3 = value_393 && typeof value_393 === "object" ? value_393 : {},
        name_27 = safeText(profile_3.name, fallbackProfile.name || defaultProfile.name);
      return {
        id: String(profile_3.id || "x-account-" + (value_395 + 1)),
        name: name_27,
        handle: makeHandle(name_27, profile_3.handle || fallbackProfile.handle),
        avatar: safeText(profile_3.avatar || fallbackProfile.avatar),
        avatarAssetId: safeText(profile_3.avatarAssetId || fallbackProfile.avatarAssetId),
        createdAt: Number(profile_3.createdAt) || Date.now(),
        updatedAt: Number(profile_3.updatedAt) || Date.now()
      };
    }
    function normalizeXPlayerAccounts(items_4, xData_2 = {}) {
      const source_3 = Array.isArray(items_4) && items_4.length ? items_4 : [{
          id: "x-account-default",
          ...xData_2,
          createdAt: Date.now()
        }],
        seen_3 = new Set();
      return source_3.map((item_6, index_5) => normalizeXPlayerAccount(item_6, index_5 === 0 ? xData_2 : defaultProfile, index_5)).filter(account_3 => {
        if (!account_3.id || seen_3.has(account_3.id)) return false;
        return seen_3.add(account_3.id), true;
      });
    }
    function handleAction_48(state_5) {
      const activeId = String(state_5.activeXPlayerAccountId || ""),
        profile_4 = state_5.xData || defaultProfile;
      return state_5.xPlayerAccounts = normalizeXPlayerAccounts(state_5.xPlayerAccounts, profile_4).map(account => account.id === activeId ? {
        ...account,
        name: safeText(profile_4.name, account.name),
        handle: makeHandle(profile_4.name || account.name, profile_4.handle || account.handle),
        avatar: safeText(profile_4.avatar),
        avatarAssetId: safeText(profile_4.avatarAssetId),
        updatedAt: Date.now()
      } : account), state_5;
    }
    function handleAction_49(value_407) {
      const safe = value_407 && typeof value_407 === "object" ? value_407 : {},
        xData_3 = safe.xData && typeof safe.xData === "object" ? safe.xData : {},
        xPlayerAccounts_2 = normalizeXPlayerAccounts(safe.xPlayerAccounts, {
          ...defaultXState.xData,
          ...xData_3
        }),
        requestedActiveId = String(safe.activeXPlayerAccountId || ""),
        activeXPlayerAccountId_2 = xPlayerAccounts_2.some(account_4 => account_4.id === requestedActiveId) ? requestedActiveId : xPlayerAccounts_2[0].id,
        normalized_2 = {
          ...defaultXState,
          ...safe,
          xData: {
            ...defaultXState.xData,
            ...xData_3
          },
          xPlayerAccounts: xPlayerAccounts_2,
          activeXPlayerAccountId: activeXPlayerAccountId_2,
          xAccountSchemaVersion: Math.max(1, Number(safe.xAccountSchemaVersion) || 1),
          xCharIdentityMigrationVersion: Math.max(0, Number(safe.xCharIdentityMigrationVersion) || 0),
          xCharProfileMediaMigrationVersion: Math.max(0, Number(safe.xCharProfileMediaMigrationVersion) || 0),
          xTopics: Array.isArray(safe.xTopics) ? safe.xTopics : [],
          boundWorldBookIds: Array.isArray(safe.boundWorldBookIds) ? safe.boundWorldBookIds.map(String) : [],
          xVisitors: Array.isArray(safe.xVisitors) ? safe.xVisitors : [],
          xDirectMessages: Array.isArray(safe.xDirectMessages) ? safe.xDirectMessages : [],
          xPostThreads: safe.xPostThreads && typeof safe.xPostThreads === "object" && !Array.isArray(safe.xPostThreads) ? safe.xPostThreads : {},
          xGeneratedPosts: Array.isArray(safe.xGeneratedPosts) ? safe.xGeneratedPosts : [],
          xAccounts: normalizeXAccounts(safe.xAccounts),
          xTrends: Array.isArray(safe.xTrends) ? normalizeTrendList(safe.xTrends).slice(0, maxXTrends) : defaultTrends.map(trend_3 => ({
            ...trend_3
          })),
          xAdvancePreferences: normalizeAdvancePreferences(safe.xAdvancePreferences)
        };
      return delete normalized_2.xCurrentDate, normalized_2;
    }
    function getXState() {
      const value_416 = typeof window.getAppStateRevision === "function" ? window.getAppStateRevision("x") : fallbackXStateRevision;
      if (value_22 && cachedNormalizedXRevision === value_416) return value_22;
      const value_417 = typeof window.getAppState === "function" ? window.getAppState("x") : window.__xFallbackState;
      return value_22 = handleAction_49(value_417), cachedNormalizedXRevision = value_416, value_22;
    }
    function saveXState(value_418) {
      const __xFallbackState_2 = handleAction_48(handleAction_49(value_418));
      return typeof window.setAppState === "function" ? window.setAppState("x", __xFallbackState_2) : (window.__xFallbackState = __xFallbackState_2, fallbackXStateRevision += 1), value_22 = __xFallbackState_2, cachedNormalizedXRevision = typeof window.getAppStateRevision === "function" ? window.getAppStateRevision("x") : fallbackXStateRevision, __xFallbackState_2;
    }
    async function handleAction_50() {
      const raw_13 = typeof window.getAppState === "function" ? window.getAppState("x") : window.__xFallbackState,
        hasAccounts = Array.isArray(raw_13?.xPlayerAccounts) && raw_13.xPlayerAccounts.length > 0,
        hasActive = !!safeText(raw_13?.activeXPlayerAccountId);
      if (hasAccounts && hasActive) return getXState();
      const saveXState_423 = saveXState(handleAction_49(raw_13));
      return await flushXStateNow("x-account-migration"), saveXState_423;
    }
    function createBlankXWorld(profile_5) {
      return {
        ...JSON.parse(JSON.stringify(defaultXState)),
        xData: {
          ...defaultXState.xData,
          ...profile_5,
          edited: true,
          following: normalizeProfileCount(profile_5.following, 0),
          followers: normalizeProfileCount(profile_5.followers, 0),
          profileStatsEdited: true
        },
        xPlayerAccounts: [],
        activeXPlayerAccountId: "",
        xAccountSchemaVersion: 1,
        xCharIdentityMigrationVersion: 1,
        xCharProfileMediaMigrationVersion: 2
      };
    }
    function updateXState(value_425) {
      const previous = getXState(),
        draft_2 = {
          ...previous,
          xVisitors: [...(previous.xVisitors || [])],
          xDirectMessages: [...(previous.xDirectMessages || [])],
          xPostThreads: {
            ...(previous.xPostThreads || {})
          },
          xGeneratedPosts: [...(previous.xGeneratedPosts || [])],
          xPlayerAccounts: [...(previous.xPlayerAccounts || [])],
          xAccounts: [...(previous.xAccounts || [])],
          xTrends: [...(previous.xTrends || [])],
          xAdvancePreferences: {
            ...(previous.xAdvancePreferences || defaultAdvancePreferences)
          }
        };
      return value_425(draft_2), saveXState(draft_2);
    }
    function flushXStateNow(value_428 = "x-state") {
      if (typeof window.saveGlobalData !== "function") return Promise.resolve(false);
      return Promise.resolve(window.saveGlobalData())["catch"](value_429 => {
        return console.warn("[X] Failed to flush " + value_428, value_429), false;
      });
    }
    function resolveXAuthorIdentity(value_430, handle_5, name_10, value_433 = "") {
      const displayName_2 = safeText(name_10 || handle_5, "X User"),
        makeHandle_435 = makeHandle(displayName_2, safeText(handle_5).split("·")[0].trim() || displayName_2),
        safeText_436 = safeText(value_430),
        canonicalAccountHandle_437 = canonicalAccountHandle(currentProfile?.handle, currentProfile?.name);
      if (safeText_436 === "me" || canonicalAccountHandle(makeHandle_435, displayName_2) === canonicalAccountHandle_437) return {
        id: "me",
        name: safeText(currentProfile?.name, displayName_2),
        handle: makeHandle(currentProfile?.name || displayName_2, currentProfile?.handle || makeHandle_435),
        avatar: handleAction_29(currentProfile?.avatar || value_433, "me:" + (canonicalAccountHandle_437 || displayName_2)),
        kind: "me"
      };
      const state_6 = getXState(),
        chars_2 = Array.isArray(state_6.xDirectMessages) ? state_6.xDirectMessages : [],
        char_8 = chars_2.find(value_444 => safeText_436 && String(value_444.id) === safeText_436 || canonicalAccountHandle(value_444.handle, value_444.name) === canonicalAccountHandle(makeHandle_435, displayName_2));
      if (char_8) return {
        id: String(char_8.id),
        name: safeText(char_8.name || char_8.nickname, displayName_2),
        handle: makeHandle(char_8.name || displayName_2, char_8.handle || makeHandle_435),
        avatar: handleAction_29(char_8.avatar || char_8.avatarUrl || value_433, "char:" + (char_8.id || makeHandle_435)),
        kind: "char"
      };
      const handleAction_40_441 = handleAction_40(safeText_436, makeHandle_435, displayName_2, state_6);
      if (handleAction_40_441) return handleAction_40_441;
      const accounts = Array.isArray(state_6.xAccounts) ? state_6.xAccounts : [],
        account_5 = accounts.find(value_445 => safeText_436 && String(value_445.id) === safeText_436 || canonicalAccountHandle(value_445.handle, value_445.name) === canonicalAccountHandle(makeHandle_435, displayName_2));
      if (account_5) return {
        ...normalizeXAccount(account_5),
        kind: "account"
      };
      return {
        id: safeText_436 || makeAccountId(makeHandle_435, displayName_2),
        name: displayName_2,
        handle: makeHandle_435,
        avatar: handleAction_29(value_433, "account:" + (safeText_436 || makeHandle_435 || displayName_2)),
        kind: "unknown"
      };
    }
    function registerLightweightAccount(identity_7) {
      const normalized = normalizeXAccount({
        ...identity_7,
        source: "generated"
      });
      return updateXState(draft => {
        const index_6 = (draft.xAccounts || []).findIndex(account_6 => String(account_6.id) === String(normalized.id));
        if (index_6 >= 0) draft.xAccounts[index_6] = {
          ...draft.xAccounts[index_6],
          ...normalized
        };else draft.xAccounts.unshift(normalized);
      }), normalized;
    }
    function handleAction_51() {
      const state_7 = getXState(),
        chars_3 = (state_7.xDirectMessages || []).filter(item_7 => Number(item_7.profileGeneratedAt) > 0 || Array.isArray(item_7.profilePosts) && item_7.profilePosts.length > 0).map(item_8 => ({
          authorId: String(item_8.id),
          name: safeText(item_8.name || item_8.nickname, "Char"),
          handle: makeHandle(item_8.name || "Char", item_8.handle || item_8.name),
          bio: safeText(item_8.bio || item_8.signature),
          persona: safeText(item_8.persona)
        })),
        accounts_2 = normalizeXAccounts(state_7.xAccounts).map(account_7 => ({
          authorId: account_7.id,
          name: account_7.name,
          handle: account_7.handle,
          bio: account_7.bio,
          persona: account_7.persona
        }));
      return [...chars_3, ...accounts_2].slice(0, 30);
    }
    function setupSectionHeader(header, rightButtonLabel) {
      if (!header || header.dataset.xCentered === "true") return;
      const rightButton = header.querySelector(".x-header-button");
      if (!rightButton) return;
      rightButton.setAttribute("aria-label", rightButton.getAttribute("aria-label") || rightButtonLabel || "Action");
      header.innerHTML = "";
      const backButton = document.createElement("button");
      backButton.className = "x-header-button";
      backButton.type = "button";
      backButton.setAttribute("aria-label", "Back");
      backButton.setAttribute("data-x-close", "true");
      backButton.innerHTML = "<i class=\"fas fa-chevron-left\"></i>";
      const brand = document.createElement("div");
      brand.className = "x-brand-lockup x-section-brand";
      brand.innerHTML = "<i class=\"fa-brands fa-x-twitter\"></i>";
      header.classList.add("x-centered-header");
      header.append(backButton, brand, rightButton);
      header.dataset.xCentered = "true";
    }
    function renderTrends(state_8 = getXState()) {
      if (!trendList) return;
      const trends_2 = normalizeTrendList(state_8.xTrends || []).slice(0, maxXTrends);
      if (trends_2.length === 0) {
        trendList.innerHTML = "<div class=\"x-empty-state\">暂无热搜，点击右上角搜索生成。</div>";
        return;
      }
      trendList.innerHTML = trends_2.map(value_457 => "\n                <div class=\"x-trend-row\" role=\"button\" tabindex=\"0\" data-trend-title=\"" + escapeHtml(value_457.title) + "\">\n                    <div>\n                        <small>" + escapeHtml(value_457.category) + "</small>\n                        <strong>" + escapeHtml(value_457.title) + "</strong>\n                    </div>\n                    <span class=\"x-trend-rank-meta\">\n                        " + (value_457.movement === "up" ? "<i class=\"fas fa-arrow-up x-trend-up\" aria-label=\"上升\"></i>" : "") + "\n                        " + (value_457.movement === "down" ? "<i class=\"fas fa-arrow-down x-trend-down\" aria-label=\"下降\"></i>" : "") + "\n                        <span>" + escapeHtml(value_457.heat) + "</span>\n                    </span>\n                </div>\n            ").join("");
    }
    function handleAction_53() {
      if (enabled_20) return;
      enabled_20 = true;
      const superHeader = document.querySelector("#x-super-tab .x-section-header");
      setupSectionHeader(superHeader, "Create topic");
      const superCreateBtn = superHeader?.querySelector(".x-header-button[aria-label=\"Create topic\"]");
      superCreateBtn && superCreateBtn.addEventListener("click", handleClick);
      setupSectionHeader(document.querySelector("#x-discover-tab .x-section-header"), "Search");
      setupSectionHeader(document.querySelector("#x-messages-tab .x-section-header"), "New message");
      const messageHeaderButton = document.querySelector("#x-messages-tab .x-section-header .x-header-button:last-child");
      if (messageHeaderButton) messageHeaderButton.id = "x-add-dm-btn";
      const discoverSearchButton = document.querySelector("#x-discover-tab .x-section-header .x-header-button:last-child");
      discoverSearchButton && (discoverSearchButton.id = "x-discover-search-btn", discoverSearchButton.setAttribute("aria-label", "搜索并生成热搜"), discoverSearchButton.innerHTML = "<i class=\"fas fa-search\"></i>");
      const homeSearchButton = document.querySelector("#x-home-tab .x-header-actions .x-header-button:not(.x-compose-button)");
      if (homeSearchButton) homeSearchButton.id = "x-search-generate-btn";
      const firstSummaryLabel = document.querySelector("#x-messages-tab .x-message-summary div:first-child span");
      if (firstSummaryLabel) firstSummaryLabel.textContent = "新粉丝";
      const summaryLabels = document.querySelectorAll("#x-messages-tab .x-message-summary span"),
        summaryCopy = ["会话", "未读", "@我"];
      summaryLabels.forEach((label_2, index_7) => {
        label_2.textContent = summaryCopy[index_7] || label_2.textContent;
      });
      const profileActions = document.querySelector(".x-profile-cover-actions"),
        settingsBtn = document.getElementById("x-profile-settings-btn");
      if (profileActions && settingsBtn && !document.getElementById("x-profile-visitors-btn")) {
        const rightActions = document.createElement("div");
        rightActions.className = "x-profile-cover-right-actions";
        const visitorBtn = document.createElement("button");
        visitorBtn.className = "x-header-button";
        visitorBtn.id = "x-profile-visitors-btn";
        visitorBtn.type = "button";
        visitorBtn.setAttribute("aria-label", "Profile visitors");
        visitorBtn.innerHTML = "<i class=\"fas fa-user-clock\"></i>";
        settingsBtn.parentNode.insertBefore(rightActions, settingsBtn);
        rightActions.append(visitorBtn, settingsBtn);
      }
      handleAction_54();
      handleAction_55();
      handleAction_56();
      handleAction_57();
      handleAction_58();
      handleAction_59();
      handleAction_60();
      handleAction_61();
      handleAction_62();
      handleAction_63();
      handleAction_64();
      handleAction_65();
      handleAction_67();
      handleAction_66();
      dmList = document.getElementById("x-dm-list") || document.querySelector("#x-messages-tab .x-message-list");
      if (dmList) dmList.id = "x-dm-list";
      handleAction_87();
      handleAction_88();
    }
    function handleAction_54() {
      const composer = document.querySelector(".x-comment-composer");
      document.getElementById("x-detail-actions")?.remove();
      if (composer && !document.getElementById("x-reply-input")) {
        const context_2 = document.createElement("div");
        context_2.className = "x-reply-context";
        context_2.id = "x-reply-context";
        context_2.hidden = true;
        context_2.innerHTML = "\n                    <span id=\"x-reply-context-text\">Replying to post</span>\n                    <button id=\"x-reply-cancel-btn\" type=\"button\" aria-label=\"Cancel reply target\"><i class=\"fas fa-times\"></i></button>\n                ";
        composer.insertAdjacentElement("beforebegin", context_2);
        composer.innerHTML = "\n                    <div class=\"x-avatar x-avatar-dark\">X</div>\n                    <input id=\"x-reply-input\" type=\"text\" maxlength=\"180\" placeholder=\"Post your reply\">\n                    <button id=\"x-reply-submit-btn\" type=\"button\">Reply</button>\n                ";
      }
      const xReplyContextElement = document.getElementById("x-reply-context");
      postDetailView && xReplyContextElement && xReplyContextElement.parentElement !== postDetailView && postDetailView.appendChild(xReplyContextElement);
      postDetailView && composer && composer.parentElement !== postDetailView && postDetailView.appendChild(composer);
    }
    function handleAction_55() {
      visitorsSheet = document.getElementById("x-visitors-sheet");
      !visitorsSheet && (visitorsSheet = document.createElement("div"), visitorsSheet.className = "bottom-sheet-overlay detail-sheet-overlay x-visitors-overlay", visitorsSheet.id = "x-visitors-sheet", visitorsSheet.style.zIndex = "268", visitorsSheet.innerHTML = "\n                    <div class=\"bottom-sheet x-visitors-sheet\">\n                        <div class=\"sheet-handle\"></div>\n                        <div class=\"x-edit-sheet-header\">\n                            <button class=\"x-edit-sheet-text-btn\" id=\"x-visitors-close-btn\" type=\"button\">Close</button>\n                            <strong>主页访客</strong>\n                            <span class=\"x-settings-spacer\"></span>\n                        </div>\n                        <div class=\"x-visitors-list\" id=\"x-visitors-list\"></div>\n                    </div>\n                ", view.appendChild(visitorsSheet));
      visitorsList = document.getElementById("x-visitors-list");
    }
    function handleAction_56() {
      addDmSheet = document.getElementById("x-add-dm-sheet");
      !addDmSheet && (addDmSheet = document.createElement("div"), addDmSheet.className = "bottom-sheet-overlay detail-sheet-overlay x-add-dm-overlay", addDmSheet.id = "x-add-dm-sheet", addDmSheet.style.zIndex = "272", addDmSheet.innerHTML = "\n                    <div class=\"bottom-sheet x-add-dm-sheet\">\n                        <div class=\"sheet-handle\"></div>\n                        <div class=\"x-edit-sheet-header\">\n                            <button class=\"x-edit-sheet-text-btn\" id=\"x-add-dm-close-btn\" type=\"button\">关闭</button>\n                            <strong>添加私信</strong>\n                            <span class=\"x-settings-spacer\"></span>\n                        </div>\n                        <div class=\"x-add-dm-body\">\n                            <section class=\"x-add-dm-section\">\n                                <div class=\"x-add-dm-section-title\">从 iMessage 导入 Char</div>\n                                <div class=\"x-imessage-char-list\" id=\"x-imessage-char-list\">\n                                    <div class=\"x-empty-state\">加载 iMessage Char...</div>\n                                </div>\n                            </section>\n                            <section class=\"x-add-dm-section\">\n                                <div class=\"x-add-dm-section-title\">手动添加 Char</div>\n                                <label class=\"x-add-dm-field\">\n                                    <span>名称</span>\n                                    <input id=\"x-manual-char-name\" type=\"text\" maxlength=\"32\" placeholder=\"Char name\">\n                                </label>\n                                <label class=\"x-add-dm-field\">\n                                    <span>@账号</span>\n                                    <input id=\"x-manual-char-handle\" type=\"text\" maxlength=\"32\" placeholder=\"@char\">\n                                </label>\n                                <label class=\"x-add-dm-field\">\n                                    <span>简介</span>\n                                    <textarea id=\"x-manual-char-bio\" maxlength=\"120\" placeholder=\"输入角色简介或签名\"></textarea>\n                                </label>\n                                <label class=\"x-add-dm-field\">\n                                    <span>人设</span>\n                                    <textarea id=\"x-manual-char-persona\" maxlength=\"600\" placeholder=\"输入角色说话方式、性格、关系和背景设定\"></textarea>\n                                </label>\n                                <button class=\"x-add-dm-submit\" id=\"x-manual-char-add-btn\" type=\"button\">保存并添加</button>\n                            </section>\n                        </div>\n                    </div>\n                ", view.appendChild(addDmSheet));
      imessageCharList = document.getElementById("x-imessage-char-list");
      manualCharNameInput = document.getElementById("x-manual-char-name");
      manualCharHandleInput = document.getElementById("x-manual-char-handle");
      manualCharBioInput = document.getElementById("x-manual-char-bio");
      manualCharPersonaInput = document.getElementById("x-manual-char-persona");
    }
    function handleAction_57() {
      element_15 = document.getElementById("x-dm-chat-view");
      !element_15 && (element_15 = document.createElement("div"), element_15.className = "x-dm-chat-view", element_15.id = "x-dm-chat-view", element_15.setAttribute("aria-hidden", "true"), element_15.innerHTML = "\n                    <header class=\"x-dm-chat-header\">\n                        <button class=\"x-dm-chat-back\" id=\"x-dm-chat-back\" type=\"button\" aria-label=\"返回\">\n                            <i class=\"fas fa-chevron-left\"></i>\n                        </button>\n                        <div class=\"x-dm-chat-title\">\n                            <div class=\"x-avatar\" id=\"x-dm-chat-avatar\">X</div>\n                            <div class=\"x-dm-chat-name\">\n                                <strong id=\"x-dm-chat-name\">Char</strong>\n                                <span id=\"x-dm-chat-handle\">@char</span>\n                            </div>\n                        </div>\n                        <button class=\"x-dm-chat-menu\" id=\"x-dm-chat-menu-btn\" type=\"button\" aria-label=\"菜单\">\n                            <i class=\"fas fa-ellipsis-h\"></i>\n                        </button>\n                    </header>\n                    <main class=\"x-dm-chat-messages\" id=\"x-dm-chat-messages\"></main>\n                    <form class=\"x-dm-chat-composer\" id=\"x-dm-chat-composer\" autocomplete=\"off\">\n                        <div class=\"x-dm-chat-input-wrapper\">\n                            <input id=\"x-dm-chat-input\" type=\"text\" maxlength=\"280\" placeholder=\"发送消息...\">\n                            <button class=\"x-dm-chat-api\" id=\"x-dm-chat-api-btn\" type=\"button\" aria-label=\"接收/生成回复\"><i class=\"fas fa-arrow-down\"></i></button>\n                        </div>\n                        <button class=\"x-dm-chat-send\" id=\"x-dm-chat-send-btn\" type=\"submit\" aria-label=\"发送\"><i class=\"fas fa-paper-plane\"></i></button>\n                    </form>\n                ", view.appendChild(element_15));
      element_16 = document.getElementById("x-dm-chat-messages");
      dmChatInput = document.getElementById("x-dm-chat-input");
    }
    function handleAction_58() {
      dmSettingsSheet = document.getElementById("x-dm-settings-sheet");
      !dmSettingsSheet && (dmSettingsSheet = document.createElement("div"), dmSettingsSheet.className = "bottom-sheet-overlay detail-sheet-overlay x-dm-settings-overlay", dmSettingsSheet.id = "x-dm-settings-sheet", dmSettingsSheet.style.zIndex = "274", dmSettingsSheet.innerHTML = "\n                    <div class=\"bottom-sheet x-dm-settings-sheet\">\n                        <div class=\"sheet-handle\"></div>\n                        <div class=\"x-edit-sheet-header\">\n                            <button class=\"x-edit-sheet-text-btn\" id=\"x-dm-settings-close-btn\" type=\"button\">关闭</button>\n                            <strong>私信设置</strong>\n                            <span class=\"x-settings-spacer\"></span>\n                        </div>\n                        <div class=\"x-dm-settings-body\">\n                            <section class=\"x-dm-imessage-context-settings\" id=\"x-dm-imessage-context-settings\" hidden>\n                                <div class=\"x-dm-imessage-context-heading\">\n                                    <div>\n                                        <strong>iMessage 单聊上下文</strong>\n                                        <small id=\"x-dm-imessage-context-source\">生成回复时引用同一 Char 的 iMessage 单聊</small>\n                                    </div>\n                                    <label class=\"x-dm-imessage-context-switch\" aria-label=\"开启 iMessage 单聊上下文\">\n                                        <input id=\"x-dm-imessage-context-enabled\" type=\"checkbox\" checked>\n                                        <span aria-hidden=\"true\"></span>\n                                    </label>\n                                </div>\n                                <label class=\"x-dm-imessage-context-limit-row\" for=\"x-dm-imessage-context-limit\">\n                                    <span>上下文条数</span>\n                                    <span><input id=\"x-dm-imessage-context-limit\" type=\"number\" min=\"1\" max=\"50\" step=\"1\" inputmode=\"numeric\" value=\"20\" aria-label=\"iMessage 单聊上下文条数\"> 条</span>\n                                </label>\n                            </section>\n                            <button class=\"x-dm-settings-action\" id=\"x-dm-clear-chat-btn\" type=\"button\">\n                                <i class=\"fas fa-eraser\"></i>\n                                <span>清空聊天记录</span>\n                            </button>\n                            <button class=\"x-dm-settings-action danger\" id=\"x-dm-delete-chat-btn\" type=\"button\">\n                                <i class=\"far fa-trash-alt\"></i>\n                                <span>删除会话</span>\n                            </button>\n                        </div>\n                    </div>\n                ", view.appendChild(dmSettingsSheet));
    }
    function handleAction_59() {
      dmProfileView = document.getElementById("x-dm-profile-view");
      !dmProfileView && (dmProfileView = document.createElement("div"), dmProfileView.className = "x-dm-profile-view", dmProfileView.id = "x-dm-profile-view", dmProfileView.setAttribute("aria-hidden", "true"), dmProfileView.innerHTML = "\n                    <main class=\"x-dm-profile-body\" id=\"x-dm-profile-body\"></main>\n                ", view.appendChild(dmProfileView));
    }
    function handleAction_60() {
      charEditSheet = document.getElementById("x-char-edit-sheet");
      if (charEditSheet) return;
      charEditSheet = document.createElement("div");
      charEditSheet.className = "bottom-sheet-overlay detail-sheet-overlay x-char-edit-overlay";
      charEditSheet.id = "x-char-edit-sheet";
      charEditSheet.style.zIndex = "278";
      charEditSheet.innerHTML = "\n                <div class=\"bottom-sheet x-char-edit-sheet\">\n                    <div class=\"sheet-handle\"></div>\n                    <div class=\"x-edit-sheet-header\">\n                        <button class=\"x-edit-sheet-text-btn\" id=\"x-char-edit-close-btn\" type=\"button\">取消</button>\n                        <strong>Edit Char</strong>\n                        <button class=\"x-edit-sheet-save\" id=\"x-char-edit-save-btn\" type=\"button\">保存</button>\n                    </div>\n                    <div class=\"x-char-edit-body\">\n                        <div class=\"x-edit-avatar-row\">\n                            <button class=\"x-edit-avatar-preview\" id=\"x-char-edit-avatar-preview\" type=\"button\" aria-label=\"上传 Char 头像\"><span>C</span></button>\n                            <input type=\"file\" id=\"x-char-edit-avatar-input\" accept=\"image/jpeg,image/png\" style=\"display:none;\">\n                            <div><strong>Avatar</strong><p>仅修改 X 中的资料。</p></div>\n                        </div>\n                        <div class=\"x-edit-banner-row\">\n                            <button class=\"x-edit-banner-preview\" id=\"x-char-edit-cover-preview\" type=\"button\" aria-label=\"上传 Char 主页背景\"><span>Cover</span></button>\n                            <input type=\"file\" id=\"x-char-edit-cover-input\" accept=\"image/jpeg,image/png\" style=\"display:none;\">\n                            <div><strong>Background</strong><p>上传图片，或使用下方随机背景。</p></div>\n                        </div>\n                        <label class=\"x-edit-field\"><span>Name</span><input id=\"x-char-edit-name\" type=\"text\" maxlength=\"32\"></label>\n                        <label class=\"x-edit-field\"><span>@ Account</span><input id=\"x-char-edit-handle\" type=\"text\" maxlength=\"32\"></label>\n                        <label class=\"x-edit-field\"><span>Signature</span><textarea id=\"x-char-edit-bio\" maxlength=\"160\"></textarea></label>\n                        <label class=\"x-edit-field\"><span>Persona</span><textarea id=\"x-char-edit-persona\" maxlength=\"800\"></textarea></label>\n                        <label class=\"x-edit-field\"><span>Following</span><input id=\"x-char-edit-following\" type=\"number\" min=\"0\" step=\"1\" inputmode=\"numeric\"></label>\n                        <label class=\"x-edit-field\"><span>Followers</span><input id=\"x-char-edit-followers\" type=\"number\" min=\"0\" step=\"1\" inputmode=\"numeric\"></label>\n                        <button class=\"x-char-random-cover-btn\" id=\"x-char-random-cover-btn\" type=\"button\"><i class=\"fas fa-image\"></i> 更换随机背景</button>\n                    </div>\n                </div>\n            ";
      view.appendChild(charEditSheet);
    }
    function handleAction_61() {
      charProfileGenerateSheet = document.getElementById("x-char-profile-generate-sheet");
      if (charProfileGenerateSheet) return;
      charProfileGenerateSheet = document.createElement("div");
      charProfileGenerateSheet.className = "bottom-sheet-overlay detail-sheet-overlay x-char-profile-generate-overlay";
      charProfileGenerateSheet.id = "x-char-profile-generate-sheet";
      charProfileGenerateSheet.style.zIndex = "281";
      charProfileGenerateSheet.innerHTML = "\n                <div class=\"bottom-sheet x-char-profile-generate-sheet\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"x-char-profile-generate-title\">\n                    <div class=\"sheet-handle\"></div>\n                    <div class=\"x-edit-sheet-header\">\n                        <button class=\"x-edit-sheet-text-btn\" id=\"x-char-profile-generate-close-btn\" type=\"button\">取消</button>\n                        <strong id=\"x-char-profile-generate-title\">生成主页帖子</strong>\n                        <button class=\"x-edit-sheet-save\" id=\"x-char-profile-generate-run-btn\" type=\"button\">生成</button>\n                    </div>\n                    <div class=\"x-char-profile-generate-body\">\n                        <label class=\"x-char-profile-generate-row\">\n                            <span><strong>帖子数量</strong><small>每条至少包含 10 条评论</small></span>\n                            <input id=\"x-char-profile-generate-count\" type=\"number\" min=\"1\" max=\"10\" step=\"1\" inputmode=\"numeric\" value=\"3\">\n                        </label>\n                        <label class=\"x-char-profile-generate-row\">\n                            <span><strong>开启生图</strong><small>整批最多为一条帖子生成真实图片</small></span>\n                            <input id=\"x-char-profile-image-toggle\" type=\"checkbox\">\n                        </label>\n                        <section class=\"x-char-profile-image-options\" id=\"x-char-profile-image-options\" hidden>\n                            <label class=\"x-edit-field\">\n                                <span>提示词预设</span>\n                                <select id=\"x-char-profile-image-preset\"><option value=\"\">当前编辑内容</option></select>\n                            </label>\n                            <div class=\"x-char-profile-preset-actions\">\n                                <input id=\"x-char-profile-preset-name\" type=\"text\" maxlength=\"40\" placeholder=\"预设名称\">\n                                <button id=\"x-char-profile-preset-save\" type=\"button\">保存预设</button>\n                                <button id=\"x-char-profile-preset-delete\" type=\"button\">删除</button>\n                            </div>\n                            <label class=\"x-edit-field\"><span>正向提示词</span><textarea id=\"x-char-profile-image-prompt\" maxlength=\"4000\" placeholder=\"追加到帖子画面描述后的主体、场景或风格要求\"></textarea></label>\n                            <label class=\"x-edit-field\"><span>Char 外貌</span><textarea id=\"x-char-profile-char-appearance\" maxlength=\"4000\" placeholder=\"角色外貌约束\"></textarea></label>\n                            <label class=\"x-edit-field\"><span>User 外貌</span><textarea id=\"x-char-profile-user-appearance\" maxlength=\"4000\" placeholder=\"用户外貌约束\"></textarea></label>\n                            <label class=\"x-edit-field\"><span>画风提示词</span><textarea id=\"x-char-profile-artist-prompt\" maxlength=\"4000\" placeholder=\"画风、镜头、质感等\"></textarea></label>\n                            <label class=\"x-edit-field\"><span>负面提示词</span><textarea id=\"x-char-profile-negative-prompt\" maxlength=\"4000\" placeholder=\"不希望出现在图片中的内容\"></textarea></label>\n                            <div class=\"x-char-profile-reference-card\">\n                                <button class=\"x-char-profile-reference-preview\" id=\"x-char-profile-reference-preview\" type=\"button\" aria-label=\"上传参考脸\"><i class=\"fas fa-user\"></i></button>\n                                <input id=\"x-char-profile-reference-input\" type=\"file\" accept=\"image/jpeg,image/png\" hidden>\n                                <div><strong>Char 参考脸</strong><small id=\"x-char-profile-reference-status\">尚未上传</small></div>\n                                <button id=\"x-char-profile-reference-delete\" type=\"button\">移除</button>\n                            </div>\n                            <label class=\"x-char-profile-generate-row compact\">\n                                <span><strong>本次使用参考脸</strong><small>仅在已有参考脸时可用</small></span>\n                                <input id=\"x-char-profile-reference-toggle\" type=\"checkbox\">\n                            </label>\n                        </section>\n                        <p class=\"x-advance-note\">生图失败时仍会保留本次生成的文字帖子，不会使用随机外部图片。</p>\n                    </div>\n                </div>";
      view.appendChild(charProfileGenerateSheet);
    }
    function handleAction_62() {
      editSuperTopicSheet = document.getElementById("x-edit-super-topic-sheet");
      if (editSuperTopicSheet) return;
      editSuperTopicSheet = document.createElement("div");
      editSuperTopicSheet.className = "bottom-sheet-overlay detail-sheet-overlay x-edit-super-topic-overlay";
      editSuperTopicSheet.id = "x-edit-super-topic-sheet";
      editSuperTopicSheet.style.zIndex = "278";
      editSuperTopicSheet.innerHTML = "\n                <div class=\"bottom-sheet x-edit-super-topic-sheet\">\n                    <div class=\"sheet-handle\"></div>\n                    <div class=\"x-edit-sheet-header\">\n                        <button class=\"x-edit-sheet-text-btn\" id=\"x-edit-super-topic-close-btn\" type=\"button\">取消</button>\n                        <strong>编辑超话</strong>\n                        <button class=\"x-edit-sheet-save\" id=\"x-edit-super-topic-save-btn\" type=\"button\">保存</button>\n                    </div>\n                    <div class=\"x-topic-editor-body\">\n                        <div class=\"x-topic-editor-hero\">\n                            <button class=\"x-topic-editor-cover x-edit-banner-preview\" id=\"x-edit-super-topic-banner-preview\" type=\"button\" aria-label=\"上传超话封面\"><span>Cover</span></button>\n                            <input type=\"file\" id=\"x-edit-super-topic-banner-input\" accept=\"image/jpeg,image/png\" hidden>\n                            <button class=\"x-topic-editor-avatar x-edit-avatar-preview\" id=\"x-edit-super-topic-avatar-preview\" type=\"button\" aria-label=\"上传超话头像\"><span>超</span></button>\n                            <input type=\"file\" id=\"x-edit-super-topic-avatar-input\" accept=\"image/jpeg,image/png\" hidden>\n                        </div>\n                        <div class=\"x-topic-editor-card\">\n                            <label class=\"x-edit-field\"><span>超话名称</span><input id=\"x-edit-super-topic-name\" type=\"text\" maxlength=\"40\"></label>\n                            <label class=\"x-edit-field\"><span>粉丝数</span><input id=\"x-edit-super-topic-fans\" type=\"text\" maxlength=\"20\"></label>\n                        </div>\n                        <section class=\"x-topic-editor-card x-topic-roles-section\">\n                            <div class=\"x-topic-editor-card-title\">\n                                <div>\n                                    <strong>超话角色</strong>\n                                    <span>用于生成超话动态和互动时的人物来源。</span>\n                                </div>\n                            </div>\n                            <div class=\"x-topic-role-actions\">\n                                <button type=\"button\" id=\"x-edit-topic-import-imessage-btn\"><i class=\"far fa-comments\"></i> 从 iMessage 拉取</button>\n                                <button type=\"button\" id=\"x-edit-topic-manual-char-btn\"><i class=\"fas fa-user-plus\"></i> 手动添加</button>\n                            </div>\n                            <div class=\"x-topic-chars-list\" id=\"x-edit-topic-chars-list\"></div>\n                            <div class=\"x-topic-source-list\" id=\"x-edit-topic-imessage-list-container\" style=\"display:none;\"></div>\n                            <div class=\"x-topic-manual-card\" id=\"x-edit-topic-manual-container\" style=\"display:none;\">\n                                <input id=\"x-edit-topic-manual-name\" type=\"text\" placeholder=\"角色名称\">\n                                <input id=\"x-edit-topic-manual-handle\" type=\"text\" placeholder=\"@账号\">\n                                <textarea id=\"x-edit-topic-manual-bio\" placeholder=\"简介\"></textarea>\n                                <textarea id=\"x-edit-topic-manual-persona\" placeholder=\"人设\"></textarea>\n                                <button type=\"button\" id=\"x-edit-topic-manual-save-btn\">确认添加</button>\n                            </div>\n                        </section>\n                        <button class=\"x-topic-delete-btn\" id=\"x-edit-super-topic-delete-btn\" type=\"button\"><i class=\"fas fa-trash-alt\"></i> 删除此超话</button>\n                    </div>\n                </div>\n            ";
      view.appendChild(editSuperTopicSheet);
    }
    function handleAction_63() {
      postForwardSheet = document.getElementById("x-post-forward-sheet");
      if (postForwardSheet) return;
      postForwardSheet = document.createElement("div");
      postForwardSheet.className = "bottom-sheet-overlay detail-sheet-overlay x-post-forward-overlay";
      postForwardSheet.id = "x-post-forward-sheet";
      postForwardSheet.style.zIndex = "279";
      postForwardSheet.innerHTML = "\n                <div class=\"bottom-sheet x-post-forward-sheet\">\n                    <div class=\"sheet-handle\"></div>\n                    <div class=\"x-edit-sheet-header\">\n                        <button class=\"x-edit-sheet-text-btn\" id=\"x-post-forward-close-btn\" type=\"button\">取消</button>\n                        <strong>转发给私信</strong>\n                        <span class=\"x-settings-spacer\"></span>\n                    </div>\n                    <div class=\"x-post-forward-list\" id=\"x-post-forward-list\"></div>\n                </div>\n            ";
      view.appendChild(postForwardSheet);
    }
    function handleAction_64() {
      searchGenerateSheet = document.getElementById("x-search-generate-sheet");
      !searchGenerateSheet && (searchGenerateSheet = document.createElement("div"), searchGenerateSheet.className = "bottom-sheet-overlay detail-sheet-overlay x-search-generate-overlay", searchGenerateSheet.id = "x-search-generate-sheet", searchGenerateSheet.style.zIndex = "273", searchGenerateSheet.innerHTML = "\n                    <div class=\"bottom-sheet x-search-generate-sheet\">\n                        <div class=\"sheet-handle\"></div>\n                        <div class=\"x-edit-sheet-header\">\n                            <button class=\"x-edit-sheet-text-btn\" id=\"x-search-generate-close-btn\" type=\"button\">Close</button>\n                            <strong id=\"x-search-generate-title\">搜索/生成帖子</strong>\n                            <button class=\"x-edit-sheet-save\" id=\"x-search-generate-run-btn\" type=\"button\">Generate</button>\n                        </div>\n                        <div class=\"x-search-generate-body\">\n                            <label class=\"x-add-dm-field\">\n                                <span id=\"x-search-generate-label\">生成方向</span>\n                                <textarea id=\"x-search-generate-input\" maxlength=\"500\" placeholder=\"可留空，或输入想生成的帖子主题\"></textarea>\n                            </label>\n                        </div>\n                    </div>\n                ", view.appendChild(searchGenerateSheet));
      searchGenerateInput = document.getElementById("x-search-generate-input");
      searchGenerateSheet?.querySelectorAll(".x-settings-note").forEach(value_464 => value_464.remove());
    }
    function handleAction_65() {
      advanceSheet = document.getElementById("x-advance-sheet");
      !advanceSheet && (advanceSheet = document.createElement("div"), advanceSheet.className = "bottom-sheet-overlay detail-sheet-overlay x-advance-overlay", advanceSheet.id = "x-advance-sheet", advanceSheet.style.zIndex = "276", advanceSheet.innerHTML = "\n                    <div class=\"bottom-sheet x-advance-sheet\">\n                        <div class=\"sheet-handle\"></div>\n                        <div class=\"x-edit-sheet-header\">\n                            <button class=\"x-edit-sheet-text-btn\" id=\"x-advance-close-btn\" type=\"button\">关闭</button>\n                            <strong>推进到下一天</strong>\n                            <button class=\"x-edit-sheet-save\" id=\"x-advance-run-btn\" type=\"button\">生成</button>\n                        </div>\n                        <div class=\"x-advance-body\">\n                            <label class=\"x-advance-field\">\n                                <span>想推进的剧情</span>\n                                <textarea id=\"x-advance-plot-input\" maxlength=\"800\" placeholder=\"可留空，留空时将随机延续当前剧情\"></textarea>\n                            </label>\n                            <div class=\"x-advance-section-title\">生成内容</div>\n                            <div class=\"x-advance-options\">\n                                <label class=\"x-advance-option\">\n                                    <input id=\"x-advance-strangers-toggle\" type=\"checkbox\">\n                                    <span class=\"x-advance-option-copy\">\n                                        <strong>陌生人私信</strong>\n                                        <span>每人生成 2–5 条对方来信</span>\n                                    </span>\n                                    <input class=\"x-advance-count\" id=\"x-advance-strangers-count\" type=\"number\" min=\"1\" max=\"20\" inputmode=\"numeric\" aria-label=\"陌生人人数\">\n                                </label>\n                                <label class=\"x-advance-option\">\n                                    <input id=\"x-advance-trends-toggle\" type=\"checkbox\">\n                                    <span class=\"x-advance-option-copy\">\n                                        <strong>推进热搜</strong>\n                                        <span>新热搜置顶，旧热搜依次下移</span>\n                                    </span>\n                                    <input class=\"x-advance-count\" id=\"x-advance-trends-count\" type=\"number\" min=\"1\" max=\"15\" inputmode=\"numeric\" aria-label=\"热搜数量\">\n                                </label>\n                                <label class=\"x-advance-option\">\n                                    <input id=\"x-advance-posts-toggle\" type=\"checkbox\">\n                                    <span class=\"x-advance-option-copy\">\n                                        <strong>推进帖子</strong>\n                                        <span>每条新帖子至少生成 5 条评论</span>\n                                    </span>\n                                    <input class=\"x-advance-count\" id=\"x-advance-posts-count\" type=\"number\" min=\"1\" max=\"20\" inputmode=\"numeric\" aria-label=\"帖子数量\">\n                                </label>\n                            </div>\n                            <p class=\"x-advance-note\">将使用 X 已绑定的世界书和当前热搜、帖子作为剧情上下文。全部生成成功后才会保存。</p>\n                        </div>\n                    </div>\n                ", view.appendChild(advanceSheet));
      advancePlotInput = document.getElementById("x-advance-plot-input");
    }
    function handleAction_66() {
      postSettingsSheet = document.getElementById("x-post-settings-sheet");
      !postSettingsSheet && (postSettingsSheet = document.createElement("div"), postSettingsSheet.className = "bottom-sheet-overlay detail-sheet-overlay x-dm-settings-overlay", postSettingsSheet.id = "x-post-settings-sheet", postSettingsSheet.style.zIndex = "275", postSettingsSheet.innerHTML = "\n                    <div class=\"bottom-sheet x-dm-settings-sheet\">\n                        <div class=\"sheet-handle\"></div>\n                        <div class=\"x-edit-sheet-header\">\n                            <button class=\"x-edit-sheet-text-btn\" id=\"x-post-settings-close-btn\" type=\"button\">关闭</button>\n                            <strong>帖子设置</strong>\n                            <span class=\"x-settings-spacer\"></span>\n                        </div>\n                        <div class=\"x-dm-settings-body\">\n                            <button class=\"x-dm-settings-action\" id=\"x-post-advance-btn\" type=\"button\">\n                                <i class=\"fas fa-forward\"></i>\n                                <span>Advance post</span>\n                            </button>\n                            <button class=\"x-dm-settings-action danger\" id=\"x-post-delete-btn\" type=\"button\">\n                                <i class=\"far fa-trash-alt\"></i>\n                                <span>删除帖子</span>\n                            </button>\n                        </div>\n                    </div>\n                ", view.appendChild(postSettingsSheet));
    }
    function handleAction_67() {
      imagePreviewOverlay = document.getElementById("x-image-preview-overlay");
      !imagePreviewOverlay && (imagePreviewOverlay = document.createElement("div"), imagePreviewOverlay.className = "x-image-preview-overlay", imagePreviewOverlay.id = "x-image-preview-overlay", imagePreviewOverlay.setAttribute("aria-hidden", "true"), imagePreviewOverlay.innerHTML = "\n                    <button class=\"x-image-preview-close\" id=\"x-image-preview-close\" type=\"button\" aria-label=\"Close image\"><i class=\"fas fa-times\"></i></button>\n                    <div class=\"x-image-preview-card\" id=\"x-image-preview-card\">\n                        <img id=\"x-image-preview-img\" alt=\"\">\n                        <div id=\"x-image-preview-text\"></div>\n                    </div>\n                ", view.appendChild(imagePreviewOverlay));
    }
    function handleAction_68() {
      const accounts_3 = typeof window.getAccounts === "function" ? window.getAccounts() : [],
        currentAccountId = typeof window.getCurrentAccountId === "function" ? window.getCurrentAccountId() : null,
        currentAccount = Array.isArray(accounts_3) ? accounts_3.find(account_8 => String(account_8.id) === String(currentAccountId)) : null,
        runtimeUser = window.userState || {},
        source_4 = currentAccount || runtimeUser || {},
        name_11 = source_4.name || source_4.realName || runtimeUser.name || runtimeUser.realName || defaultProfile.name,
        bio_2 = source_4.signature || source_4.bio || source_4.persona || runtimeUser.signature || runtimeUser.persona || defaultProfile.bio;
      return {
        name: name_11,
        handle: makeHandle(name_11, source_4.handle || runtimeUser.handle),
        bio: bio_2,
        persona: source_4.persona || runtimeUser.persona || "",
        avatar: source_4.avatarUrl || source_4.avatar || runtimeUser.avatarUrl || runtimeUser.avatar || "",
        banner: source_4.banner || source_4.bannerUrl || ""
      };
    }
    function hasEditedXProfile(xData_4 = {}) {
      return Boolean(xData_4.edited || xData_4.avatar || xData_4.banner || xData_4.bio || xData_4.persona || xData_4.name && xData_4.name !== "User" || xData_4.handle && xData_4.handle !== "@user");
    }
    function resolveProfile(value_474 = getXState()) {
      const xState_2 = value_474 || defaultXState,
        fallback_4 = handleAction_68(),
        source_5 = hasEditedXProfile(xState_2.xData) ? xState_2.xData : fallback_4,
        name_28 = safeText(source_5.name, fallback_4.name || defaultProfile.name);
      return {
        name: name_28,
        handle: makeHandle(name_28, source_5.handle || fallback_4.handle),
        bio: safeText(source_5.bio || source_5.signature, fallback_4.bio || defaultProfile.bio),
        persona: safeText(source_5.persona, fallback_4.persona || ""),
        avatar: handleAction_29(source_5.avatar || source_5.avatarUrl || fallback_4.avatar, "me:" + (source_5.handle || fallback_4.handle || name_28)),
        banner: safeText(source_5.banner || source_5.bannerUrl, fallback_4.banner || ""),
        following: normalizeProfileCount(source_5.profileStatsEdited === true ? source_5.following : defaultProfile.following, defaultProfile.following),
        followers: normalizeProfileCount(source_5.profileStatsEdited === true ? source_5.followers : defaultProfile.followers, defaultProfile.followers),
        profileStatsEdited: source_5.profileStatsEdited === true
      };
    }
    function setAvatarNode(element_479, contact_480) {
      if (!element_479) return;
      const safeText_481 = safeText(contact_480.name, "User");
      element_479.innerHTML = buildAvatarHtml(contact_480.avatar, "me:" + (contact_480.handle || safeText_481));
    }
    function syncCurrentProfile(value_482 = getXState()) {
      return currentProfile = resolveProfile(value_482), setAvatarNode(document.getElementById("x-compose-author-avatar"), currentProfile), postData.profile.avatar = handleAction_29(currentProfile.avatar, "me:" + (currentProfile.handle || currentProfile.name)), postData.profile.name = currentProfile.name, postData.profile.handle = currentProfile.handle + " 路 pinned", currentProfile;
    }
    function buildUnifiedProfileContentHtml({
      identity: identity_12,
      posts = [],
      stats = [],
      actionsHtml = "",
      isSelf = false
    }) {
      const safeIdentity = identity_12 || {},
        name_12 = safeText(safeIdentity.name, "User"),
        handle_6 = makeHandle(name_12, safeIdentity.handle),
        bio_3 = safeText(safeIdentity.bio, "暂无简介"),
        avatarId = isSelf ? " id=\"x-profile-avatar\"" : "",
        nameId = isSelf ? " id=\"x-profile-name\"" : "",
        handleId = isSelf ? " id=\"x-profile-handle\"" : "",
        bioId = isSelf ? " id=\"x-profile-bio\"" : "",
        normalizedStats = (Array.isArray(stats) ? stats : []).slice(0, 3);
      return "\n                <div class=\"x-profile-card x-unified-profile-card\">\n                    <div class=\"x-profile-avatar\"" + avatarId + ">" + buildAvatarHtml(safeIdentity.avatar, (safeIdentity.id || handle_6) + ":" + name_12) + "</div>\n                    <div class=\"x-dm-profile-heading-row\">\n                        <div class=\"x-dm-profile-identity\">\n                            <div class=\"x-profile-account-name-row\">\n                                <h2" + nameId + ">" + escapeHtml(name_12) + "</h2>\n                                " + (isSelf ? "<button class=\"x-account-switch-trigger\" id=\"x-account-switch-trigger\" type=\"button\" aria-label=\"切换 X 账号\" aria-haspopup=\"dialog\"><i class=\"fas fa-chevron-down\"></i></button>" : "") + "\n                            </div>\n                            <span" + handleId + ">" + escapeHtml(handle_6) + "</span>\n                        </div>\n                        <div class=\"x-dm-profile-actions x-unified-profile-actions\">" + actionsHtml + "</div>\n                    </div>\n                    <p" + bioId + ">" + escapeHtml(bio_3) + "</p>\n                    <div class=\"x-profile-stats\">\n                        " + normalizedStats.map(value_493 => "<div><strong>" + escapeHtml(value_493.value) + "</strong><span>" + escapeHtml(value_493.label) + "</span></div>").join("") + "\n                    </div>\n                </div>\n                <div class=\"x-profile-tabs x-unified-profile-tabs\">\n                    <button class=\"active\" type=\"button\" data-x-profile-tab=\"posts\">Posts</button>\n                    <button type=\"button\" data-x-profile-tab=\"photos\">Photos</button>\n                </div>\n                <div class=\"x-profile-panel active x-profile-posts-panel\" data-x-profile-panel=\"posts\">" + handleAction_135(posts) + "</div>\n                <div class=\"x-profile-panel\" data-x-profile-panel=\"photos\">" + handleAction_136(posts) + "</div>\n            ";
    }
    function handleAction_72(value_494 = getXState()) {
      const profile_6 = syncCurrentProfile(value_494),
        coverEl = document.getElementById("x-profile-cover"),
        profileScroll = document.getElementById("x-profile-scroll");
      coverEl && (coverEl.style.backgroundImage = profile_6.banner ? "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.34)), url(\"" + profile_6.banner + "\")" : "");
      if (profileScroll) {
        const identity_8 = {
            id: "me",
            kind: "me",
            name: profile_6.name,
            handle: profile_6.handle,
            avatar: profile_6.avatar,
            bio: profile_6.bio
          },
          posts_3 = handleAction_134(identity_8, value_494);
        profileScroll.innerHTML = buildUnifiedProfileContentHtml({
          identity: identity_8,
          posts: posts_3,
          isSelf: true,
          actionsHtml: "<button class=\"x-profile-edit\" id=\"x-profile-edit-btn\" type=\"button\">Edit profile</button>",
          stats: [{
            value: posts_3.length,
            label: "Posts"
          }, {
            value: formatCompactCount(profile_6.followers),
            label: "Followers"
          }, {
            value: formatCompactCount(profile_6.following),
            label: "Following"
          }]
        });
        profileScroll.querySelectorAll(".x-profile-feed-card").forEach(bindPostCard);
      }
    }
    function handleAction_73() {
      accountSwitchSheet = document.getElementById("x-account-switch-sheet");
      if (accountSwitchSheet) return accountSwitchSheet;
      return accountSwitchSheet = document.createElement("div"), accountSwitchSheet.className = "bottom-sheet-overlay detail-sheet-overlay x-account-switch-overlay", accountSwitchSheet.id = "x-account-switch-sheet", accountSwitchSheet.style.zIndex = "282", accountSwitchSheet.innerHTML = "\n                <div class=\"bottom-sheet x-account-switch-sheet\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"x-account-switch-title\">\n                    <div class=\"sheet-handle\"></div>\n                    <div class=\"x-edit-sheet-header\">\n                        <button class=\"x-edit-sheet-text-btn\" id=\"x-account-switch-close-btn\" type=\"button\">关闭</button>\n                        <strong id=\"x-account-switch-title\">切换账号</strong>\n                        <span class=\"x-settings-spacer\"></span>\n                    </div>\n                    <div class=\"x-account-switch-list\" id=\"x-account-switch-list\"></div>\n                    <button class=\"x-account-add-btn\" id=\"x-account-add-btn\" type=\"button\"><i class=\"fas fa-plus\"></i><span>新增账号</span></button>\n                </div>", view.appendChild(accountSwitchSheet), accountSwitchSheet;
    }
    function handleAction_74(state_9 = getXState()) {
      handleAction_73();
      const list_2 = accountSwitchSheet?.querySelector("#x-account-switch-list");
      if (!list_2) return;
      list_2.innerHTML = (state_9.xPlayerAccounts || []).map(account_9 => {
        const active = account_9.id === state_9.activeXPlayerAccountId;
        return "<button class=\"x-account-switch-row" + (active ? " active" : "") + "\" type=\"button\" data-x-player-account-id=\"" + escapeHtml(account_9.id) + "\"" + (active ? " aria-current=\"true\"" : "") + ">\n                    <span class=\"x-account-switch-avatar\">" + buildAvatarHtml(account_9.avatar, account_9.name) + "</span>\n                    <span class=\"x-account-switch-copy\"><strong>" + escapeHtml(account_9.name) + "</strong><small>" + escapeHtml(account_9.handle) + "</small></span>\n                    " + (active ? "<i class=\"fas fa-check\" aria-label=\"当前账号\"></i>" : "<i class=\"fas fa-chevron-right\" aria-hidden=\"true\"></i>") + "\n                </button>";
      }).join("");
    }
    function openAccountSwitchSheet() {
      handleAction_74();
      if (typeof window.openView === "function") window.openView(accountSwitchSheet);else accountSwitchSheet?.classList.add("active");
    }
    function closeAccountSwitchSheet() {
      if (typeof window.closeView === "function") window.closeView(accountSwitchSheet);else accountSwitchSheet?.classList.remove("active");
    }
    function resetXRuntimeForAccountSwitch() {
      const staticPostIds = new Set(["island", "super", "following", "profile"]);
      Object.keys(postData).forEach(postId_2 => {
        if (!staticPostIds.has(postId_2)) delete postData[postId_2];
      });
      postVisionRuns.clear();
      currentActiveTopicId = null;
      currentEditingSuperTopicId = null;
      currentDetailPostId = null;
      currentDmId = null;
      currentProfileIdentity = null;
      replyTarget = null;
      xHomeFeedRenderLimit = xHomeFeedInitialLimit;
      xHomeFeedRenderKey = "";
      closeAccountSwitchSheet();
      closeEditProfile();
      closeTopicDetail();
      closePostDetail();
      closeComposer();
      closeVisitorsSheet();
      closeAddDmSheet();
      closeDmChat();
      closeDmSettingsSheet();
      closeDmProfile();
      closeSearchGenerateSheet();
      closeAdvanceSheet();
      closeCharEditSheet();
      closeCharProfileGenerateSheet();
      closeEditSuperTopicSheet();
      closePostForwardSheet();
      closeImagePreview();
    }
    async function activateXPlayerAccount(accountId_2, initialState = null) {
      const targetId_2 = String(accountId_2 || ""),
        xState_505 = getXState();
      if (!targetId_2 || targetId_2 === xState_505.activeXPlayerAccountId) return closeAccountSwitchSheet(), true;
      if (enabled_10) return false;
      if (charProfileGenerationInFlight) {
        if (typeof window.showToast === "function") window.showToast("请等待 Char 主页生成完成后再切换账号");
        return false;
      }
      enabled_10 = true;
      try {
        if (!window.appStorage?.switchXAccountWorld) throw new Error("X account storage is unavailable.");
        const durable = await flushXStateNow("x-account-before-switch");
        if (!durable) throw new Error("Current X account could not be saved.");
        const value_507 = await window.appStorage.switchXAccountWorld(targetId_2, initialState);
        if (typeof window.setAppState === "function") window.setAppState("x", value_507, {
          save: false
        });else window.__xFallbackState = value_507;
        await handleAction_36();
        await handleAction_37();
        resetXRuntimeForAccountSwitch();
        const state_10 = getXState();
        syncCurrentProfile(state_10);
        const meIndex_2 = navItems.findIndex(value_510 => value_510.getAttribute("data-target") === "x-me-tab");
        return switchTab(meIndex_2 >= 0 ? meIndex_2 : currentIndex, {
          state: state_10,
          resetHomeFeed: true
        }), renderWorldBookSummary(state_10), true;
      } finally {
        enabled_10 = false;
      }
    }
    async function createAndSwitchXPlayerAccount(profile_7) {
      const previous_2 = getXState(),
        accountId_3 = makeLocalId("x-account"),
        accountSummary = normalizeXPlayerAccount({
          id: accountId_3,
          name: profile_7.name,
          handle: profile_7.handle,
          avatar: profile_7.avatar,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }, profile_7, previous_2.xPlayerAccounts.length);
      saveXState({
        ...previous_2,
        xPlayerAccounts: [...previous_2.xPlayerAccounts, accountSummary]
      });
      try {
        const switched = await activateXPlayerAccount(accountId_3, createBlankXWorld(profile_7));
        if (!switched) throw new Error("Another X account switch is still running.");
        if (typeof window.showToast === "function") window.showToast("已创建并切换账号");
      } catch (error_3) {
        console.error("[X] Create account failed", error_3);
        const rollback = getXState();
        saveXState({
          ...rollback,
          xPlayerAccounts: (rollback.xPlayerAccounts || []).filter(account_10 => account_10.id !== accountId_3)
        });
        await flushXStateNow("x-account-create-rollback");
        if (typeof window.showToast === "function") window.showToast("账号创建失败，原账号未改变");
      }
    }
    async function switchXPlayerAccount(accountId_4) {
      try {
        await activateXPlayerAccount(accountId_4);
      } catch (error_4) {
        console.error("[X] Account switch failed", error_4);
        if (typeof window.showToast === "function") window.showToast("账号切换失败，已保留当前账号");
      }
    }
    function renderImagePreview(element_520, value_521, value_522) {
      if (!element_520) return;
      value_521 ? element_520.innerHTML = "<img src=\"" + escapeHtml(value_521) + "\" alt=\"\">" : element_520.innerHTML = "<span>" + escapeHtml(value_522) + "</span>";
    }
    function openEditProfile(mode_2 = "edit") {
      profileEditorMode = mode_2 === "create" ? "create" : "edit";
      currentProfile = resolveProfile();
      const sourceProfile = profileEditorMode === "create" ? {
        ...defaultProfile,
        name: "",
        handle: "",
        bio: "",
        persona: "",
        avatar: "",
        banner: "",
        following: 0,
        followers: 0,
        profileStatsEdited: true
      } : currentProfile;
      avatarDraft = sourceProfile.avatar || "";
      bannerDraft = sourceProfile.banner || "";
      if (editNameInput) editNameInput.value = sourceProfile.name;
      if (editHandleInput) editHandleInput.value = sourceProfile.handle;
      if (editBioInput) editBioInput.value = sourceProfile.bio;
      if (editPersonaInput) editPersonaInput.value = sourceProfile.persona;
      if (editFollowingInput) editFollowingInput.value = String(normalizeProfileCount(sourceProfile.following, 0));
      if (editFollowersInput) editFollowersInput.value = String(normalizeProfileCount(sourceProfile.followers, 0));
      const title_3 = editSheet?.querySelector(".x-edit-sheet-header strong");
      if (title_3) title_3.textContent = profileEditorMode === "create" ? "新增 X 账号" : "Edit profile";
      renderImagePreview(editAvatarPreview, avatarDraft, (sourceProfile.name || "U").slice(0, 1).toUpperCase());
      renderImagePreview(editBannerPreview, bannerDraft, "Cover");
      if (typeof window.openView === "function") window.openView(editSheet);else editSheet?.classList.add("active");
    }
    function closeEditProfile() {
      if (typeof window.closeView === "function") window.closeView(editSheet);else editSheet?.classList.remove("active");
      profileEditorMode = "edit";
    }
    async function handleAction_77() {
      const name_13 = safeText(editNameInput?.value);
      if (!name_13) {
        if (typeof window.showToast === "function") window.showToast("请输入账号名称");
        editNameInput?.focus();
        return;
      }
      const followingRaw = String(editFollowingInput?.value ?? "").trim(),
        followersRaw = String(editFollowersInput?.value ?? "").trim();
      if (followingRaw && (!/^\d+$/.test(followingRaw) || Number(followingRaw) > Number.MAX_SAFE_INTEGER) || followersRaw && (!/^\d+$/.test(followersRaw) || Number(followersRaw) > Number.MAX_SAFE_INTEGER)) {
        if (typeof window.showToast === "function") window.showToast("关注数和粉丝数请输入非负整数");
        return;
      }
      const nextProfile = {
        name: name_13,
        handle: makeHandle(name_13, editHandleInput?.value || currentProfile.handle),
        bio: safeText(editBioInput?.value, defaultProfile.bio),
        persona: safeText(editPersonaInput?.value),
        avatar: avatarDraft,
        banner: bannerDraft,
        following: normalizeProfileCount(followingRaw, 0),
        followers: normalizeProfileCount(followersRaw, 0),
        profileStatsEdited: true,
        edited: true,
        updatedAt: new Date().toISOString()
      };
      if (profileEditorMode === "create") {
        await createAndSwitchXPlayerAccount(nextProfile);
        return;
      }
      const previous_3 = getXState(),
        nextState = saveXState({
          ...previous_3,
          xData: {
            ...previous_3.xData,
            ...nextProfile
          }
        });
      currentProfile = nextProfile;
      handleAction_72(nextState);
      closeEditProfile();
    }
    function renderWorldBookSummary(value_531 = getXState()) {
      const countEl = document.getElementById("x-worldbook-count"),
        value_532 = value_531.boundWorldBookIds || [];
      if (countEl) countEl.textContent = value_532.length + " selected";
    }
    function handleAction_78() {
      renderWorldBookSummary();
      if (typeof window.openView === "function") window.openView(settingsSheet);else settingsSheet?.classList.add("active");
    }
    function closeXSettings() {
      if (typeof window.closeView === "function") window.closeView(settingsSheet);else settingsSheet?.classList.remove("active");
    }
    function handleAction_79() {
      showXConfirm({
        title: "清空当前 X 账号",
        message: "将清空当前账号内的帖子、超话、私信、热搜、主页资料和全部设置，其他 X 账号不受影响。此操作不可恢复。",
        confirmText: "清空当前账号",
        isDestructive: true,
        onConfirm: () => {
          const previous_4 = getXState(),
            freshState = JSON.parse(JSON.stringify(defaultXState));
          freshState.xPlayerAccounts = previous_4.xPlayerAccounts;
          freshState.activeXPlayerAccountId = previous_4.activeXPlayerAccountId;
          freshState.xAccountSchemaVersion = previous_4.xAccountSchemaVersion;
          freshState.xCharIdentityMigrationVersion = 1;
          saveXState(freshState);
          currentActiveTopicId = null;
          currentProfileIdentity = null;
          currentDmId = null;
          closeXSettings();
          closeComposer();
          closePostDetail();
          closeTopicDetail();
          closeDmChat();
          closeDmProfile();
          closePostForwardSheet();
          handleAction_72();
          renderWorldBookSummary();
          renderSuperFollowBar();
          renderGeneratedPosts();
          renderTrends();
          renderDirectMessages();
          handleAction_128();
          switchTab(0);
          if (typeof window.showToast === "function") window.showToast("当前 X 账号已恢复初始状态");
        }
      });
    }
    function handleAction_80() {
      const xState_535 = getXState(),
        selectedIds = xState_535.boundWorldBookIds || [];
      if (typeof window.renderWorldBookSelector !== "function") {
        if (typeof window.showToast === "function") window.showToast("世界书选择器不可用");
        return;
      }
      window.renderWorldBookSelector(selectedIds, nextIds => {
        saveXState({
          ...getXState(),
          boundWorldBookIds: Array.isArray(nextIds) ? nextIds.map(String) : []
        });
        renderWorldBookSummary();
      });
    }
    function normalizeComposeTopicTag(value_11) {
      const topic_4 = safeText(value_11).replace(/^#+/, "").trim();
      return topic_4 ? "#" + topic_4 : "";
    }
    function renderPostTextHtml(post_7 = {}) {
      const topicTag_2 = normalizeComposeTopicTag(post_7.topicTag);
      let text_8 = safeText(post_7.text);
      const hashtagPattern = /#[^\s#，。！？、,.!?;；:：]+/g,
        existingTags = text_8.match(hashtagPattern) || [],
        hasTopicTag = topicTag_2 && existingTags.some(tag => tag.toLocaleLowerCase() === topicTag_2.toLocaleLowerCase());
      if (topicTag_2 && !hasTopicTag) text_8 = "" + text_8 + (text_8 ? " " : "") + topicTag_2;
      let cursor_2 = 0,
        html = "";
      return text_8.replace(hashtagPattern, (value_547, offset) => {
        html += escapeHtml(text_8.slice(cursor_2, offset));
        const handleAction_81_549 = normalizeComposeTopicTag(value_547);
        return html += "<button class=\"x-post-topic-link\" type=\"button\" data-topic-tag=\"" + escapeHtml(handleAction_81_549) + "\">" + escapeHtml(value_547) + "</button>", cursor_2 = offset + value_547.length, value_547;
      }), html += escapeHtml(text_8.slice(cursor_2)), html;
    }
    function buildExpandableTranslationHtml(value_550, value_551 = "") {
      const safeText_552 = safeText(value_550);
      if (!safeText_552) return "";
      return "\n                <button class=\"x-translation-toggle " + escapeHtml(value_551) + "\" type=\"button\" aria-expanded=\"false\">翻译</button>\n                <p class=\"x-translation-text\" hidden>" + escapeHtml(safeText_552) + "</p>\n            ";
    }
    function renderComposeImageDraft() {
      const iElement = composeImageButton?.querySelector("i"),
        label_3 = composeImageButton?.querySelector(".x-compose-image-copy"),
        hidden_2 = !!composeImageDraft;
      composeImageButton?.classList.toggle("has-image", hidden_2);
      if (iElement) iElement.hidden = hidden_2;
      if (label_3) label_3.hidden = hidden_2;
      composeImagePreview && (composeImagePreview.hidden = !hidden_2, composeImagePreview.src = hidden_2 ? composeImageDraft : "");
      if (composeImageClearButton) composeImageClearButton.hidden = !hidden_2;
    }
    function addComposeImageUrl() {
      const url_3 = safeText(composeImageUrlInput?.value);
      if (!/^https?:\/\//i.test(url_3)) {
        if (typeof window.showToast === "function") window.showToast("请输入有效的 http(s) 图片 URL");
        return;
      }
      composeImageDraft = url_3;
      renderComposeImageDraft();
    }
    function openComposer(options_5 = {}) {
      const requestedSuperId = safeText(options_5?.superTopicId),
        topic_5 = requestedSuperId ? (getXState().xTopics || []).find(item_9 => String(item_9.id || item_9.name) === requestedSuperId) : null;
      currentComposeSuperId = topic_5 ? String(topic_5.id || topic_5.name) : null;
      composeImageDraft = "";
      if (composeImageInput) composeImageInput.value = "";
      if (composeImageUrlInput) composeImageUrlInput.value = "";
      if (composeTextInput) composeTextInput.value = "";
      if (composeTopicInput) composeTopicInput.value = "";
      if (composeSuperChip) composeSuperChip.hidden = !topic_5;
      if (composeSuperName) composeSuperName.textContent = topic_5 ? "超话：" + safeText(topic_5.name || topic_5.title, "超话") : "";
      renderComposeImageDraft();
      if (typeof window.openView === "function") window.openView(composeSheet);else composeSheet?.classList.add("active");
    }
    function closeComposer() {
      currentComposeSuperId = null;
      composeImageDraft = "";
      renderComposeImageDraft();
      if (typeof window.closeView === "function") window.closeView(composeSheet);else composeSheet?.classList.remove("active");
    }
    async function handleAction_84() {
      const text_9 = safeText(composeTextInput?.value, "新帖子草稿");
      count_11 += 1;
      const id_5 = "temp-" + Date.now() + "-" + count_11,
        superTopic = currentComposeSuperId ? (getXState().xTopics || []).find(item_10 => String(item_10.id || item_10.name) === String(currentComposeSuperId)) : null,
        topicTag_3 = normalizeComposeTopicTag(composeTopicInput?.value) || normalizeComposeTopicTag(superTopic?.name || superTopic?.title),
        rawPost_3 = {
          id: id_5,
          authorId: "me",
          authorAvatar: handleAction_29(currentProfile.avatar, "me:" + (currentProfile.handle || currentProfile.name)),
          authorName: currentProfile.name,
          handle: currentProfile.handle,
          text: text_9,
          topicTag: topicTag_3,
          superTopicId: superTopic ? String(superTopic.id || superTopic.name) : "",
          superTopicName: superTopic ? safeText(superTopic.name || superTopic.title, "超话") : "",
          reposts: 0,
          likes: 0,
          commentsCount: 0,
          comments: [],
          mediaType: composeImageDraft ? "image" : "text",
          images: composeImageDraft ? [{
            id: id_5 + "-image-0",
            text: "用户上传图片",
            url: composeImageDraft
          }] : [],
          createdAt: Date.now()
        },
        map_564 = rawPost_3.images.map(image_6 => ({
          id: String(image_6.id || ""),
          url: String(image_6.url || ""),
          mimeType: String(image_6.mimeType || "")
        })),
        added = appendGeneratedPosts([rawPost_3]);
      if (superTopic && added.length) updateSuperHomeCard(superTopic);
      closeComposer();
      if (added.length) {
        const durable_2 = await flushXStateNow("x-post-publish");
        if (!durable_2) {
          updateXState(draft_3 => {
            draft_3.xGeneratedPosts = (draft_3.xGeneratedPosts || []).filter(post_8 => String(post_8.id) !== String(id_5));
          });
          renderGeneratedPosts();
          if (typeof window.showToast === "function") window.showToast("帖子保存失败，已撤销发布");
          return;
        }
        if (typeof window.showToast === "function") window.showToast("Post published; generating engagement");
        generatePostPublishInteractions(added[0].id, {
          imageSources: map_564
        });
      }
    }
    function ensureCommentDepth(post_9) {
      const value_572 = Array.isArray(post_9.commentList) ? post_9.commentList : [];
      return post_9.commentList = value_572, post_9.comments = formatCompactCount(Math.max(parseCompactCount(post_9.comments), value_572.length)), post_9;
    }
    function handleAction_86(items_573 = []) {
      items_573.forEach(post_10 => {
        postData[post_10.id] = ensureCommentDepth(post_10);
        post_10.refPost && (postData[post_10.refPost.id] = ensureCommentDepth(post_10.refPost));
      });
    }
    function handleAction_87() {
      ["island", "super", "following"].forEach(value_575 => {
        view.querySelectorAll(".x-feed-card[data-post-id=\"" + value_575 + "\"]").forEach(value_576 => value_576.remove());
      });
    }
    function clearHomeEmptyState(panel) {
      panel?.querySelectorAll(".x-home-empty-state").forEach(node => node.remove());
    }
    function handleAction_88() {
      view.querySelectorAll("#x-home-tab .x-feed-panel").forEach(panel_2 => {
        clearHomeEmptyState(panel_2);
        !panel_2.querySelector(".x-feed-card") && (panel_2.innerHTML = "<div class=\"x-empty-state x-home-empty-state\">暂无内容，点击搜索生成帖子。</div>");
      });
    }
    function buildFeedCardHtml(post_11) {
      return "\n                " + buildAuthorAvatarButton(post_11, "x-feed-avatar x-avatar") + "\n                <div class=\"x-feed-body\">\n                    <div class=\"x-feed-meta\">\n                        <strong>" + escapeHtml(post_11.name) + "</strong>\n                        <span>" + escapeHtml(post_11.handle) + " · now</span>\n                    </div>\n                    <p>" + renderPostTextHtml(post_11) + "</p>\n                    " + renderPostImages(getPostImages(post_11)) + "\n                    <div class=\"x-feed-actions\">\n                        <span><i class=\"far fa-comment\"></i> " + escapeHtml(post_11.comments || "0") + "</span>\n                        <button class=\"x-feed-forward-btn\" type=\"button\" data-post-id=\"" + escapeHtml(post_11.id) + "\" aria-label=\"转发帖子\"><i class=\"fas fa-retweet\"></i> <span>" + escapeHtml(post_11.reposts || "0") + "</span></button>\n                        <span><i class=\"far fa-heart\"></i> " + escapeHtml(post_11.likes || "0") + "</span>\n                        <span><i class=\"far fa-share-square\"></i></span>\n                    </div>\n                </div>\n            ";
    }
    function buildSuperTopicFeedCardHtml(post_12, topicName_2 = "") {
      const topicLabel = normalizeComposeTopicTag(post_12.topicTag || topicName_2),
        textHtml = renderPostTextHtml({
          ...post_12,
          topicTag: ""
        });
      return "\n                " + buildAuthorAvatarButton(post_12, "x-feed-avatar x-avatar x-super-feed-avatar") + "\n                <div class=\"x-feed-body x-super-feed-body\">\n                    <div class=\"x-feed-meta x-super-feed-meta\">\n                        <div>\n                            <strong>" + escapeHtml(post_12.name) + "</strong>\n                            <span>" + escapeHtml(post_12.handle) + " · now</span>\n                        </div>\n                        " + (topicLabel ? "<button type=\"button\" class=\"x-super-topic-chip x-post-topic-link\" data-topic-tag=\"" + escapeHtml(topicLabel) + "\">" + escapeHtml(topicLabel) + "</button>" : "") + "\n                    </div>\n                    <p class=\"x-super-feed-text\">" + textHtml + "</p>\n                    " + renderPostImages(getPostImages(post_12)) + "\n                    <div class=\"x-feed-actions x-super-feed-actions\">\n                        <span><i class=\"far fa-comment\"></i> " + escapeHtml(post_12.comments || "0") + "</span>\n                        <button class=\"x-feed-forward-btn\" type=\"button\" data-post-id=\"" + escapeHtml(post_12.id) + "\" aria-label=\"转发帖子\"><i class=\"fas fa-retweet\"></i> <span>" + escapeHtml(post_12.reposts || "0") + "</span></button>\n                        <span><i class=\"far fa-heart\"></i> " + escapeHtml(post_12.likes || "0") + "</span>\n                        <span><i class=\"far fa-share-square\"></i></span>\n                    </div>\n                </div>\n            ";
    }
    function renderGeneratedPosts(state_11 = getXState(), options_6 = {}) {
      const recommendPanel = view.querySelector(".x-feed-panel[data-feed-panel=\"recommend\"]");
      if (!recommendPanel) return;
      if (options_6.resetLimit) xHomeFeedRenderLimit = xHomeFeedInitialLimit;
      const value_585 = typeof window.getAppStateRevision === "function" ? window.getAppStateRevision("x") : fallbackXStateRevision,
        renderKey = (state_11.activeXPlayerAccountId || "default") + ":" + value_585 + ":" + xHomeFeedRenderLimit;
      if (!options_6.force && xHomeFeedRenderKey === renderKey) return;
      handleAction_87();
      clearHomeEmptyState(recommendPanel);
      recommendPanel.querySelectorAll(".x-generated-feed-card").forEach(card_2 => card_2.remove());
      const rawFeedPosts = (state_11.xGeneratedPosts || []).filter(post_13 => !post_13?.isMoment);
      xHomeFeedTotalPosts = rawFeedPosts.length;
      const posts_4 = rawFeedPosts.slice(0, xHomeFeedRenderLimit).map((post_14, index_8) => normalizeGeneratedPost(post_14, index_8)).filter(Boolean).map(post_15 => ensureCommentDepth(post_15));
      handleAction_86(posts_4);
      posts_4.slice().reverse().forEach(post_16 => {
        clearHomeEmptyState(recommendPanel);
        const card = document.createElement("article");
        card.className = "x-feed-card x-generated-feed-card";
        card.setAttribute("data-post-id", post_16.id);
        card.setAttribute("tabindex", "0");
        card.innerHTML = buildFeedCardHtml(post_16);
        bindPostCard(card);
        recommendPanel.prepend(card);
        updatePostCountNodes(post_16.id, getPostThread(post_16.id, state_11));
      });
      handleAction_88();
      xHomeFeedRenderKey = renderKey;
    }
    function loadMoreHomeFeedPosts() {
      if (xHomeFeedRenderLimit >= xHomeFeedTotalPosts) return;
      xHomeFeedRenderLimit = Math.min(xHomeFeedRenderLimit + xHomeFeedPageSize, xHomeFeedTotalPosts);
      renderGeneratedPosts(getXState());
    }
    function renderTopicFeed(topic_6) {
      if (!topicFeedPanel) return;
      topicFeedPanel.innerHTML = "";
      const posts_5 = (getXState().xGeneratedPosts || []).filter(p_2 => p_2.topicTag === topic_6).map((post_17, index_9) => normalizeGeneratedPost(post_17, index_9)).filter(Boolean).map(post_18 => ensureCommentDepth(post_18));
      if (posts_5.length === 0) {
        topicFeedPanel.innerHTML = "<div class=\"x-empty-state\">暂无帖子，点击右上角生成</div>";
        return;
      }
      posts_5.slice().reverse().forEach((post_19, value_602, value_603) => {
        const value_604 = value_603.length - 1 - value_602,
          element_605 = document.createElement("article");
        element_605.className = "x-feed-card x-generated-feed-card";
        value_604 >= 10 && (element_605.style.display = "none", element_605.classList.add("x-hidden-page-2"));
        element_605.setAttribute("data-post-id", post_19.id);
        element_605.setAttribute("tabindex", "0");
        element_605.innerHTML = buildFeedCardHtml(post_19);
        bindPostCard(element_605);
        topicFeedPanel.prepend(element_605);
        updatePostCountNodes(post_19.id, getPostThread(post_19.id));
      });
    }
    function openTopicDetail(topicText) {
      currentTopicContext = topicText;
      if (topicDetailHeadline) topicDetailHeadline.textContent = topicText;
      renderTopicFeed(topicText);
      topicDetailView?.classList.add("active");
      topicDetailView?.setAttribute("aria-hidden", "false");
    }
    function closeTopicDetail() {
      topicDetailView?.contains(document.activeElement) && document.activeElement.blur();
      topicDetailView?.classList.remove("active");
      topicDetailView?.setAttribute("aria-hidden", "true");
      currentTopicContext = null;
    }
    async function handleAction_90() {
      if (!currentTopicContext || !topicDetailGenerateBtn) return;
      const topicTag_5 = currentTopicContext;
      topicDetailGenerateBtn.classList.add("loading");
      topicDetailGenerateBtn.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i>";
      try {
        const handleAction_35_607 = getSelectedWorldBookContext(topicTag_5 + " " + currentProfile.persona + " " + currentProfile.bio),
          handleAction_51_608 = handleAction_51(),
          content_10 = "Return strict JSON only. Generate 1 to 3 X/Twitter style posts for the user's feed specifically about the topic: \"" + topicTag_5 + "\".\nThe current User is context only. Every generated post, comment and reply must be authored by a distinct non-User account.\nImportant: Every post text MUST include the exact text \"" + topicTag_5 + "\" within it as a hashtag or text.\nEach post must include: authorName, handle, text, translation, likes, reposts, commentsCount, mediaType (\"text\" or \"image\"), optional imagePrompt/images, and comments. Every comment and reply must also include translation.\nEach post must have at least 10 comments. Across each post, replies inside comments must total at least 10.\nImages are text placeholders: describe the image content in imagePrompt or images[].text.\nAuthors may use any language that naturally fits their identity and context. For every non-Chinese post, comment or reply, provide an accurate Simplified Chinese translation in its translation field; use \"\" when the original is already Chinese. Keep imagePrompt descriptions in Simplified Chinese.\nX user: " + JSON.stringify(currentProfile) + "\nReusable existing authors (optional; when used, return their exact authorId): " + JSON.stringify(handleAction_51_608) + "\nWorldbook:\n" + (handleAction_35_607 || "None"),
          value_610 = await requestXChatCompletion([{
            role: "system",
            content: "You are a JSON generator for a fictional X feed. Output only valid JSON."
          }, {
            role: "user",
            content: content_10
          }], {
            temperature: 0.9
          }),
          jsonPayload = parseJsonPayload(value_610),
          sanitizeApiGeneratedPosts_611 = sanitizeApiGeneratedPosts(Array.isArray(jsonPayload) ? jsonPayload : Array.isArray(jsonPayload.posts) ? jsonPayload.posts : []);
        sanitizeApiGeneratedPosts_611.forEach(value_613 => {
          !value_613.text.includes(topicTag_5) && (value_613.text += " " + topicTag_5);
          value_613.topicTag = topicTag_5;
        });
        const handleAction_91_612 = appendGeneratedPosts(sanitizeApiGeneratedPosts_611);
        await flushXStateNow("x-topic-generation");
        renderTopicFeed(topicTag_5);
        if (typeof window.showToast === "function") window.showToast(handleAction_91_612.length ? "已生成 " + handleAction_91_612.length + " 条帖子" : "没有生成可用帖子");
      } catch (error_5) {
        console.error("[X] Generate topic posts failed", error_5);
        if (!window.u2Api?.isRequestError?.(error_5) || !window.u2Api.reportError(error_5, {
          operation: "话题内容生成"
        })) {
          if (typeof window.showToast === "function") window.showToast("生成失败，请检查 API 配置或返回格式");
        }
      } finally {
        topicDetailGenerateBtn.classList.remove("loading");
        topicDetailGenerateBtn.innerHTML = "<i class=\"fas fa-magic\"></i>";
      }
    }
    function appendGeneratedPosts(rawPosts_3) {
      const normalized_3 = (Array.isArray(rawPosts_3) ? rawPosts_3 : []).slice(0, 50).map((post_20, index_10) => normalizeGeneratedPost(post_20, index_10)).filter(Boolean).map(post_21 => ensureCommentDepth(post_21));
      if (normalized_3.length === 0) return [];
      return updateXState(draft_4 => {
        const existingIds_2 = new Set((draft_4.xGeneratedPosts || []).map(post_22 => String(post_22.id)));
        normalized_3.forEach(post_23 => {
          if (!existingIds_2.has(String(post_23.id))) draft_4.xGeneratedPosts.unshift(post_23);
        });
        const topicCounts = {};
        draft_4.xGeneratedPosts = draft_4.xGeneratedPosts.filter(post_24 => {
          if (!post_24.topicTag) return true;
          return topicCounts[post_24.topicTag] = (topicCounts[post_24.topicTag] || 0) + 1, topicCounts[post_24.topicTag] <= 20;
        });
      }), renderGeneratedPosts(), normalized_3;
    }
    function renderSuperFollowBar(state_12 = getXState()) {
      const listEl = document.getElementById("x-super-follow-list"),
        countEl_2 = document.getElementById("x-super-follow-count");
      if (!listEl) return;
      const topics_2 = (state_12.xTopics || []).filter(Boolean),
        homeCard = view.querySelector(".x-super-home-card"),
        contentTabs = document.getElementById("x-super-profile-tabs"),
        feedPanels = Array.from(view.querySelectorAll(".x-super-feed[data-super-panel]")),
        setTopicContentVisible = visible => {
          if (homeCard) homeCard.hidden = !visible;
          if (contentTabs) contentTabs.hidden = !visible;
          feedPanels.forEach(panel_3 => {
            panel_3.hidden = !visible;
          });
        };
      if (countEl_2) countEl_2.textContent = topics_2.length + " followed";
      if (topics_2.length === 0) {
        currentActiveTopicId = null;
        setTopicContentVisible(false);
        listEl.innerHTML = "<div class=\"x-super-empty-follow\">暂无关注</div>";
        return;
      }
      setTopicContentVisible(true);
      listEl.innerHTML = topics_2.map(topic_7 => {
        const name_14 = safeText(topic_7.name || topic_7.title, "超话"),
          topicId_2 = String(topic_7.id || name_14),
          avatar_3 = safeText(topic_7.avatar || topic_7.icon, name_14.slice(0, 1)),
          value_635 = avatar_3.startsWith("data:") || avatar_3.startsWith("http") ? "<img src=\"" + escapeHtml(avatar_3) + "\" alt=\"\">" : escapeHtml(avatar_3.slice(0, 1));
        return "\n                    <button class=\"x-super-follow-item " + (String(currentActiveTopicId) === topicId_2 ? "active" : "") + "\" type=\"button\" data-topic-id=\"" + escapeHtml(topicId_2) + "\" aria-label=\"" + escapeHtml(name_14) + "\">\n                        <div class=\"x-super-follow-avatar\">" + value_635 + "</div>\n                        <span>" + escapeHtml(name_14) + "</span>\n                    </button>\n                ";
      }).join("");
      listEl.querySelectorAll(".x-super-follow-item").forEach(item_11 => {
        item_11.addEventListener("click", () => {
          const topicId_3 = item_11.dataset.topicId,
            topic_8 = topics_2.find(t => String(t.id || t.name) === topicId_3);
          if (topic_8) {
            if (String(currentActiveTopicId) === String(topicId_3)) openEditSuperTopicSheet(topicId_3);else updateSuperHomeCard(topic_8);
          }
        });
      });
      const activeTopic = topics_2.find(topic_9 => String(topic_9.id || topic_9.name) === String(currentActiveTopicId)) || topics_2[0];
      updateSuperHomeCard(activeTopic, state_12);
    }
    let currentActiveTopicId = null;
    async function handleAction_92() {
      if (!currentActiveTopicId || !superUpdateBtn) return;
      const value_641 = getXState().xTopics || [],
        topic_10 = value_641.find(value_644 => String(value_644.id || value_644.name) === String(currentActiveTopicId));
      if (!topic_10) return;
      const topicName = topic_10.name || topic_10.title || "超话";
      let charsInfo = [];
      Array.isArray(topic_10.chars) && topic_10.chars.length > 0 && (charsInfo = topic_10.chars.map(char_9 => ({
        authorId: String(char_9.id || char_9.sourceFriendId || ""),
        sourceFriendId: safeText(char_9.sourceFriendId),
        name: safeText(char_9.name || char_9.nickname || char_9.realName, "Char"),
        handle: makeHandle(char_9.name || "Char", char_9.handle || char_9.realName || char_9.signature || char_9.name),
        persona: safeText(char_9.persona || char_9.bio || char_9.signature)
      })));
      superUpdateBtn.disabled = true;
      superUpdateBtn.setAttribute("aria-label", "更新中");
      superUpdateBtn.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i>";
      try {
        const handleAction_35_646 = getSelectedWorldBookContext(topicName + " " + JSON.stringify(charsInfo), getCharacterBoundWorldBookIds(topic_10.chars)),
          handleAction_51_647 = handleAction_51(),
          content_2 = "Return strict JSON only. Generate an update for a celebrity/entertainment community named \"" + topicName + "\" inside the international X app.\n\nPlease generate a JSON OBJECT containing the celebrity's online status and an array of 15 to 20 feed items.\nThe feed items should be a mix of fan posts, photo posts, featured high-quality posts, and moments.\nThe current User is context only and must never appear as the author of any post, comment, reply, moment, or nested refPost.\nThe Topic Characters below are canonical identities. If a Topic Character authors a post, comment, reply, moment or nested refPost, copy that character's authorId, name and handle EXACTLY. Never invent a duplicate, clone, alternate handle, lookalike celebrity account, or replacement identity for a Topic Character. Fan and passer-by accounts must be clearly distinct identities.\n\nJSON Format Requirements:\n{\n  \"onlineStatus\": {\n    \"isOnline\": boolean, // Is the celebrity online right now?\n    \"lastOnline\": \"String\" // e.g. \"刚刚\", \"10分钟前\", \"2小时前\", \"昨天\". Empty string \"\" if isOnline is true.\n  },\n  \"items\": [\n    // 1. \"Posts\" (帖子): Fan/entertainment text posts.\n    // Format: { \"authorName\": \"\", \"handle\": \"\", \"text\": \"\", \"translation\": \"\", \"likes\": 0, \"reposts\": 0, \"commentsCount\": 10, \"mediaType\": \"text\", \"comments\": [ {\"authorName\": \"\", \"text\": \"\", \"translation\": \"\"} ] }\n\n    // 2. \"Photos\" (图片): Posts containing images. \n    // Format: { \"authorName\": \"\", \"handle\": \"\", \"text\": \"\", \"translation\": \"\", \"likes\": 0, \"reposts\": 0, \"commentsCount\": 10, \"mediaType\": \"image\", \"imagePrompt\": \"简体中文图片描述\", \"comments\": [ {\"authorName\": \"\", \"text\": \"\", \"translation\": \"\"} ] }\n\n    // 3. \"Featured\" (精选): High-quality hot posts (can be text or image). MUST add \"isFeatured\": true.\n    // Format: { \"authorName\": \"\", \"handle\": \"\", \"text\": \"\", \"likes\": 5000, \"reposts\": 1000, \"commentsCount\": 50, \"mediaType\": \"text|image\", \"isFeatured\": true, \"comments\": [...] }\n\n    // 4. \"Moments\" (动态): Celebrity activity logs (名人互动动态). MUST add \"isMoment\": true.\n    // Represents the celebrity interacting with other posts (likes, comments, reposts).\n    // Format MUST include: \"actionText\" (e.g. \"点赞了这条帖子\", \"评论了这条帖子\"), and a nested \"refPost\" object representing the original post they interacted with.\n    // Format: { \"authorName\": \"Celebrity Name\", \"handle\": \"@celeb\", \"isMoment\": true, \"actionText\": \"点赞了这条帖子\", \"refPost\": { \"authorName\": \"Fan Account\", \"handle\": \"@fan\", \"text\": \"Post content...\", \"likes\": 200, \"commentsCount\": 10, \"mediaType\": \"text\", \"comments\": [ {\"authorName\": \"\", \"text\": \"\", \"replies\": []} ] } }\n  ]\n}\n\nCRITICAL REQUIREMENT: EVERY SINGLE POST (including normal feed items AND the nested \"refPost\" inside moments) MUST contain an array of \"comments\" with at least 10 valid comment objects. For nested \"replies\" inside comments, they also count towards the total of 10. If the moment actionText says the celebrity \"评论了这条帖子\" (commented on this post), YOU MUST include the celebrity's comment directly inside the refPost's \"comments\" array!\n\nEnsure the \"items\" array has at least 3 items with \"isFeatured\": true, at least 3 items with \"mediaType\": \"image\", and at least 3 items with \"isMoment\": true.\nAuthors may use any language natural to their identity and context. Every post, nested refPost, comment and reply must include translation: an accurate Simplified Chinese translation for non-Chinese originals, or \"\" for Chinese originals. Keep imagePrompt descriptions in Simplified Chinese.\n\nTopic Name: " + topicName + "\nCanonical Topic Characters (authorId, name and handle are immutable):\n" + (charsInfo.length ? JSON.stringify(charsInfo) : "None") + "\nReusable existing authors (optional; when used, return their exact authorId): " + JSON.stringify(handleAction_51_647) + "\nWorldbook context:\n" + (handleAction_35_646 || "None") + "\n",
          raw_14 = await requestXChatCompletion([{
            role: "system",
            content: "You are a JSON generator for a fictional social feed. Output only valid JSON object with onlineStatus and items array."
          }, {
            role: "user",
            content: content_2
          }], {
            temperature: 0.9
          }),
          parsed_3 = parseJsonPayload(raw_14);
        let allItems = [],
          onlineStatus_2 = {
            isOnline: false,
            lastOnline: "未知"
          };
        if (Array.isArray(parsed_3)) allItems = parsed_3;else {
          if (parsed_3 && typeof parsed_3 === "object") {
            parsed_3.onlineStatus && (onlineStatus_2 = {
              isOnline: !!parsed_3.onlineStatus.isOnline,
              lastOnline: parsed_3.onlineStatus.lastOnline || ""
            });
            if (Array.isArray(parsed_3.items)) allItems = allItems.concat(parsed_3.items);
            if (Array.isArray(parsed_3.posts)) allItems = allItems.concat(parsed_3.posts);
            Array.isArray(parsed_3.moments) && (parsed_3.moments.forEach(m => m.isMoment = true), allItems = allItems.concat(parsed_3.moments));
          }
        }
        updateXState(value_655 => {
          const result_656 = (value_655.xTopics || []).find(value_657 => String(value_657.id || value_657.name) === String(currentActiveTopicId));
          result_656 && (result_656.onlineStatus = onlineStatus_2);
        });
        allItems = sanitizeApiGeneratedPosts(allItems);
        const cloneAccountIds_3 = new Set();
        allItems = reconcileTopicCharacterAuthors(allItems, topic_10, cloneAccountIds_3);
        allItems.forEach(p => {
          p.topicTag = topicName;
          p.superTopicId = String(topic_10.id || topic_10.name);
          p.superTopicName = topicName;
        });
        topic_10.onlineStatus = onlineStatus_2;
        const handleAction_91_654 = appendGeneratedPosts(allItems);
        cloneAccountIds_3.size && updateXState(draft_5 => {
          draft_5.xAccounts = (draft_5.xAccounts || []).filter(account_11 => !cloneAccountIds_3.has(String(account_11.id)));
        });
        await flushXStateNow("x-super-topic-generation");
        handleAction_93(topic_10);
        typeof window.showToast === "function" && window.showToast("超话已更新，生成 " + handleAction_91_654.length + " 条内容");
      } catch (error_6) {
        console.error("[X] Generate super topic update failed", error_6);
        if (!window.u2Api?.isRequestError?.(error_6) || !window.u2Api.reportError(error_6, {
          operation: "超话更新"
        })) {
          if (typeof window.showToast === "function") window.showToast("更新失败，请检查 API 配置");
        }
      } finally {
        superUpdateBtn.disabled = false;
        superUpdateBtn.setAttribute("aria-label", "更新");
        superUpdateBtn.innerHTML = "<i class=\"fas fa-sync\"></i>";
      }
    }
    function handleAction_93(topic_11, state_13 = getXState()) {
      if (!topic_11) return;
      const topicName_3 = topic_11.name || topic_11.title || "",
        featuredPanel = view.querySelector(".x-super-feed[data-super-panel=\"featured\"]"),
        postsPanel = view.querySelector(".x-super-feed[data-super-panel=\"posts\"]"),
        photosPanel = view.querySelector(".x-super-feed[data-super-panel=\"photos\"]"),
        momentsPanel = view.querySelector(".x-super-feed[data-super-panel=\"moments\"]"),
        posts_6 = (state_13.xGeneratedPosts || []).filter(post_25 => {
          const topicId_4 = String(topic_11.id || topic_11.name);
          if (post_25.superTopicId) return String(post_25.superTopicId) === topicId_4;
          if (post_25.superTopicName) return safeText(post_25.superTopicName) === topicName_3;
          return post_25.topicTag === topicName_3;
        }).map((post_26, index_11) => normalizeGeneratedPost(post_26, index_11)).filter(Boolean).map(post_27 => ensureCommentDepth(post_27));
      if (featuredPanel) featuredPanel.innerHTML = "";
      if (postsPanel) postsPanel.innerHTML = "";
      if (photosPanel) photosPanel.innerHTML = "";
      if (momentsPanel) momentsPanel.innerHTML = "";
      let innerHTML_2 = "";
      if (topic_11.onlineStatus) {
        const onlineStatus_671 = topic_11.onlineStatus;
        if (onlineStatus_671.isOnline) innerHTML_2 = "\n                        <div class=\"x-online-status-banner online\">\n                            <div class=\"x-online-indicator online\"></div>\n                            <span class=\"x-online-text online\">明星当前在线</span>\n                        </div>\n                    ";else onlineStatus_671.lastOnline && (innerHTML_2 = "\n                        <div class=\"x-online-status-banner offline\">\n                            <div class=\"x-online-indicator offline\"></div>\n                            <span class=\"x-online-text offline\">离线 · 上次在线：" + escapeHtml(onlineStatus_671.lastOnline) + "</span>\n                        </div>\n                    ");
      }
      if (posts_6.length === 0) {
        if (featuredPanel) featuredPanel.innerHTML = "<div class=\"x-empty-state\">暂无精选，点击更新获取内容</div>";
        if (postsPanel) postsPanel.innerHTML = "<div class=\"x-empty-state\">暂无帖子</div>";
        if (photosPanel) photosPanel.innerHTML = "<div class=\"x-empty-state\">暂无图片</div>";
        momentsPanel && (momentsPanel.innerHTML = innerHTML_2 + "<div class=\"x-empty-state\">暂无动态</div>");
        return;
      }
      momentsPanel && innerHTML_2 && (momentsPanel.innerHTML = innerHTML_2);
      posts_6.slice().reverse().forEach((post_28, value_673, value_674) => {
        const value_675 = value_674.length - 1 - value_673,
          card_3 = document.createElement("article");
        card_3.className = "x-feed-card x-generated-feed-card x-super-feed-card";
        value_675 >= 10 && (card_3.style.display = "none", card_3.classList.add("x-hidden-page-2"));
        card_3.setAttribute("data-post-id", post_28.id);
        card_3.setAttribute("tabindex", "0");
        if (post_28.isMoment) {
          card_3.classList.add("is-moment", "x-super-moment-card");
          const actionText_2 = safeText(post_28.actionText, "更新了动态"),
            value_679 = post_28.refPost ? "\n                        <div class=\"x-ref-post x-super-moment-ref\" data-ref-id=\"" + escapeHtml(post_28.refPost.id) + "\">\n                            <div class=\"x-feed-meta\">\n                                <strong>" + escapeHtml(post_28.refPost.name) + "</strong>\n                                <span>" + escapeHtml(post_28.refPost.handle) + "</span>\n                            </div>\n                            <p>" + renderPostTextHtml(post_28.refPost) + "</p>\n                            " + renderPostImages(getPostImages(post_28.refPost)) + "\n                        </div>\n                    " : "<p class=\"x-super-feed-text\">" + renderPostTextHtml(post_28) + "</p>";
          card_3.innerHTML = "\n                        <div class=\"x-super-moment-shell\">\n                            <div class=\"x-moment-action x-super-moment-action\">\n                                " + buildAuthorAvatarButton(post_28, "x-avatar x-moment-avatar") + "\n                                <div>\n                                    <strong>" + escapeHtml(post_28.name) + "</strong>\n                                    <span>" + escapeHtml(actionText_2) + "</span>\n                                </div>\n                            </div>\n                            " + value_679 + "\n                        </div>\n                    ";
          if (momentsPanel) {
            const existingHeader = momentsPanel.querySelector(".x-online-status-banner");
            existingHeader ? existingHeader.insertAdjacentElement("afterend", card_3.cloneNode(true)) : momentsPanel.prepend(card_3.cloneNode(true));
          }
        } else {
          card_3.innerHTML = buildSuperTopicFeedCardHtml(post_28, topicName_3);
          if (postsPanel) postsPanel.prepend(card_3.cloneNode(true));
          post_28.isFeatured && featuredPanel && featuredPanel.prepend(card_3.cloneNode(true));
        }
        const addedCards = view.querySelectorAll(".x-feed-card[data-post-id=\"" + post_28.id + "\"]");
        addedCards.forEach(c => bindPostCard(c));
        updatePostCountNodes(post_28.id, getPostThread(post_28.id, state_13));
      });
      if (photosPanel) {
        const allImages = posts_6.flatMap(post_29 => {
          if (post_29.isMoment) return [];
          return getPostImages(post_29).map(img => ({
            ...img,
            postId: post_29.id
          }));
        });
        allImages.length === 0 ? photosPanel.innerHTML = "<div class=\"x-empty-state\">暂无图片</div>" : (photosPanel.innerHTML = "<div class=\"x-super-post-grid\">\n                        " + allImages.map((value_683, value_684) => "\n                            <div class=\"x-post-image-thumb " + (value_684 >= 12 ? "x-hidden-page-2" : "") + "\" style=\"" + (value_684 >= 12 ? "display:none;" : "") + "\" data-image-text=\"" + escapeHtml(value_683.text || "Image") + "\" data-image-url=\"" + escapeHtml(value_683.url || "") + "\" data-post-id=\"" + value_683.postId + "\">\n                                <img src=\"" + escapeHtml(value_683.url) + "\" alt=\"\" onerror=\"this.remove()\">\n                            </div>\n                        ").join("") + "\n                    </div>", photosPanel.querySelectorAll(".x-post-image-thumb").forEach(thumb => {
          thumb.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            openImagePreview(thumb.dataset.imageText || "Image", thumb.dataset.imageUrl || "");
          });
        }));
      }
      if (featuredPanel && featuredPanel.children.length === 0) featuredPanel.innerHTML = "<div class=\"x-empty-state\">暂无精选内容</div>";
      if (postsPanel && postsPanel.children.length === 0) postsPanel.innerHTML = "<div class=\"x-empty-state\">暂无帖子</div>";
      if (momentsPanel) {
        const hasCards = momentsPanel.querySelector(".x-feed-card");
        !hasCards && momentsPanel.insertAdjacentHTML("beforeend", "<div class=\"x-empty-state\">暂无动态</div>");
      }
    }
    function updateSuperHomeCard(topic_12, value_686 = getXState()) {
      currentActiveTopicId = topic_12.id || topic_12.name;
      view.querySelectorAll(".x-super-follow-item[data-topic-id]").forEach(item_12 => {
        item_12.classList.toggle("active", String(item_12.dataset.topicId) === String(currentActiveTopicId));
      });
      const homeCard_2 = view.querySelector("#x-super-tab .x-super-home-card"),
        coverEl_2 = homeCard_2?.querySelector(".x-super-cover"),
        avatarEl = homeCard_2?.querySelector(".x-super-topic-avatar"),
        titleEl = homeCard_2?.querySelector(".x-super-title-row h3"),
        statEl = homeCard_2?.querySelector(".x-super-title-row span"),
        signBtn = homeCard_2?.querySelector(".x-super-title-row button");
      coverEl_2 && (topic_12.banner ? (coverEl_2.style.backgroundImage = "url(" + topic_12.banner + ")", coverEl_2.style.backgroundSize = "cover", coverEl_2.style.backgroundPosition = "center", coverEl_2.innerHTML = "") : (coverEl_2.style.backgroundImage = "", coverEl_2.style.backgroundSize = "", coverEl_2.style.backgroundPosition = "", coverEl_2.innerHTML = "<div class=\"x-super-cover-mark\">#</div>"));
      if (avatarEl) {
        const textContent_2 = safeText(topic_12.avatar || topic_12.icon, safeText(topic_12.name || topic_12.title, "超").slice(0, 1));
        textContent_2.startsWith("data:") || textContent_2.startsWith("http") ? avatarEl.innerHTML = "<img src=\"" + escapeHtml(textContent_2) + "\" alt=\"\">" : avatarEl.textContent = textContent_2;
      }
      titleEl && (titleEl.textContent = safeText(topic_12.name || topic_12.title, "超话"));
      if (statEl) {
        const signDays_2 = topic_12.signDays || 0,
          fans_2 = safeText(topic_12.fans, "0");
        statEl.textContent = "超话 · " + fans_2 + " 粉丝 · 连续签到 " + signDays_2 + " 天";
      }
      if (signBtn) {
        const value_691 = new Date().toISOString().split("T")[0];
        topic_12.lastSignDate === value_691 ? (signBtn.textContent = "已签到", signBtn.disabled = true, signBtn.style.opacity = "0.5", signBtn.style.cursor = "default") : (signBtn.textContent = "签到", signBtn.disabled = false, signBtn.style.opacity = "1", signBtn.style.cursor = "pointer");
      }
      handleAction_93(topic_12, value_686);
    }
    function handleAction_95(value_692) {
      const targetId = safeText(value_692),
        topics_3 = getXState().xTopics || [],
        topic_13 = topics_3.find(item_13 => String(item_13.id || item_13.name) === targetId || safeText(item_13.name || item_13.title) === targetId);
      if (!topic_13) {
        if (typeof window.showToast === "function") window.showToast("对应超话不存在");
        return;
      }
      closePostDetail();
      closeTopicDetail();
      closeDmProfile();
      closeComposer();
      const superIndex = navItems.findIndex(item_14 => item_14.getAttribute("data-target") === "x-super-tab");
      if (superIndex >= 0) switchTab(superIndex);
      renderSuperFollowBar();
      updateSuperHomeCard(topic_13);
    }
    function handleTopicSign(value_698) {
      const lastSignDate_2 = new Date().toISOString().split("T")[0];
      updateXState(value_702 => {
        const topic_14 = (value_702.xTopics || []).find(value_704 => String(value_704.id || value_704.name) === String(value_698));
        topic_14 && topic_14.lastSignDate !== lastSignDate_2 && (topic_14.signDays = (topic_14.signDays || 0) + 1, topic_14.lastSignDate = lastSignDate_2);
      });
      const value_700 = getXState().xTopics || [],
        result_701 = value_700.find(value_705 => String(value_705.id || value_705.name) === String(value_698));
      result_701 && (updateSuperHomeCard(result_701), typeof window.showToast === "function" && window.showToast("签到成功！已连续签到 " + result_701.signDays + " 天"));
    }
    function openEditSuperTopicSheet(value_706) {
      const id_6 = safeText(value_706),
        topic_15 = (getXState().xTopics || []).find(item_15 => String(item_15.id || item_15.name) === id_6);
      if (!topic_15 || !editSuperTopicSheet) return;
      currentEditingSuperTopicId = String(topic_15.id || topic_15.name);
      editSuperTopicAvatarDraft = safeText(topic_15.avatar || topic_15.icon);
      editSuperTopicBannerDraft = safeText(topic_15.banner);
      editSuperTopicSelectedChars = cloneTopicChars(topic_15.chars || []);
      const nameInput = document.getElementById("x-edit-super-topic-name"),
        fansInput = document.getElementById("x-edit-super-topic-fans");
      if (nameInput) nameInput.value = safeText(topic_15.name || topic_15.title, "超话");
      if (fansInput) fansInput.value = safeText(topic_15.fans, "0");
      renderImagePreview(document.getElementById("x-edit-super-topic-avatar-preview"), editSuperTopicAvatarDraft, "超");
      renderImagePreview(document.getElementById("x-edit-super-topic-banner-preview"), editSuperTopicBannerDraft, "Cover");
      handleAction_109();
      const importContainer_2 = document.getElementById("x-edit-topic-imessage-list-container"),
        manualContainer_2 = document.getElementById("x-edit-topic-manual-container");
      if (importContainer_2) importContainer_2.style.display = "none";
      if (manualContainer_2) manualContainer_2.style.display = "none";
      if (typeof window.openView === "function") window.openView(editSuperTopicSheet);else editSuperTopicSheet.classList.add("active");
    }
    function closeEditSuperTopicSheet() {
      currentEditingSuperTopicId = null;
      editSuperTopicAvatarDraft = "";
      editSuperTopicBannerDraft = "";
      editSuperTopicSelectedChars = [];
      if (typeof window.closeView === "function") window.closeView(editSuperTopicSheet);else editSuperTopicSheet?.classList.remove("active");
    }
    function handleAction_98() {
      if (!currentEditingSuperTopicId) return;
      const topicId_5 = currentEditingSuperTopicId,
        name_15 = safeText(document.getElementById("x-edit-super-topic-name")?.value),
        fans_3 = safeText(document.getElementById("x-edit-super-topic-fans")?.value, "0");
      if (!name_15) {
        if (typeof window.showToast === "function") window.showToast("请输入超话名称");
        return;
      }
      let value_713 = null;
      const cloneAccountIds_4 = new Set();
      updateXState(draft_6 => {
        const topic_16 = (draft_6.xTopics || []).find(value_717 => String(value_717.id || value_717.name) === String(topicId_5));
        if (!topic_16) return;
        const previousName = safeText(topic_16.name || topic_16.title, "超话");
        topic_16.name = name_15;
        topic_16.title = name_15;
        topic_16.fans = fans_3;
        topic_16.avatar = editSuperTopicAvatarDraft;
        topic_16.banner = editSuperTopicBannerDraft;
        topic_16.chars = cloneTopicChars(editSuperTopicSelectedChars);
        value_713 = {
          ...topic_16
        };
        draft_6.xGeneratedPosts = (draft_6.xGeneratedPosts || []).map(post_30 => {
          const linked = String(post_30.superTopicId || "") === String(topicId_5) || !post_30.superTopicId && post_30.topicTag === previousName || post_30.superTopicName === previousName;
          if (!linked) return post_30;
          return {
            ...post_30,
            superTopicId: String(topicId_5),
            superTopicName: name_15,
            topicTag: post_30.topicTag === previousName ? name_15 : post_30.topicTag
          };
        });
        reconcileTopicCharacterAuthors(draft_6.xGeneratedPosts.filter(post_31 => String(post_31.superTopicId || "") === String(topicId_5)), topic_16, cloneAccountIds_4);
        cloneAccountIds_4.size && (draft_6.xAccounts = (draft_6.xAccounts || []).filter(value_720 => !cloneAccountIds_4.has(String(value_720.id))));
      });
      closeEditSuperTopicSheet();
      renderSuperFollowBar();
      renderGeneratedPosts();
      if (value_713) updateSuperHomeCard(value_713);
      if (typeof window.showToast === "function") window.showToast("超话信息已更新");
    }
    function handleAction_99() {
      if (!currentEditingSuperTopicId) return;
      const topicId_6 = currentEditingSuperTopicId,
        topic_17 = (getXState().xTopics || []).find(item_16 => String(item_16.id || item_16.name) === String(topicId_6));
      if (!topic_17) return;
      const topicName_4 = safeText(topic_17.name || topic_17.title, "超话");
      showXConfirm({
        title: "删除超话",
        message: "确定删除“" + topicName_4 + "”及其关联帖子吗？此操作不可恢复。",
        confirmText: "删除",
        isDestructive: true,
        onConfirm: () => {
          updateXState(draft_7 => {
            draft_7.xTopics = (draft_7.xTopics || []).filter(item_17 => String(item_17.id || item_17.name) !== String(topicId_6));
            const removedIds = new Set();
            draft_7.xGeneratedPosts = (draft_7.xGeneratedPosts || []).filter(post_32 => {
              const linked_2 = String(post_32.superTopicId || "") === String(topicId_6) || !post_32.superTopicId && post_32.topicTag === topicName_4 || post_32.superTopicName === topicName_4;
              if (linked_2) removedIds.add(String(post_32.id));
              return !linked_2;
            });
            removedIds.forEach(postId_3 => {
              delete draft_7.xPostThreads[postId_3];
            });
          });
          currentActiveTopicId = null;
          closeEditSuperTopicSheet();
          renderSuperFollowBar();
          renderGeneratedPosts();
          if (typeof window.showToast === "function") window.showToast("超话已删除");
        }
      });
    }
    function handleClick() {
      createTopicAvatarDraft = "";
      banner_2 = "";
      createTopicSelectedChars = [];
      if (createTopicNameInput) createTopicNameInput.value = "";
      if (createTopicFansInput) createTopicFansInput.value = "";
      renderImagePreview(createTopicAvatarPreview, "", "超");
      renderImagePreview(createTopicBannerPreview, "", "Cover");
      renderCreateTopicSelectedChars();
      if (createTopicImessageContainer) createTopicImessageContainer.style.display = "none";
      if (createTopicManualContainer) createTopicManualContainer.style.display = "none";
      if (typeof window.openView === "function") window.openView(createTopicSheet);else createTopicSheet?.classList.add("active");
    }
    function closeCreateTopicSheet() {
      if (typeof window.closeView === "function") window.closeView(createTopicSheet);else createTopicSheet?.classList.remove("active");
    }
    function handleAction_100() {
      const name_16 = safeText(createTopicNameInput?.value),
        fans_4 = safeText(createTopicFansInput?.value, "0");
      if (!name_16) {
        if (typeof window.showToast === "function") window.showToast("请输入超话名字");
        return;
      }
      const newTopic = {
        id: makeLocalId("topic"),
        name: name_16,
        fans: fans_4,
        avatar: createTopicAvatarDraft,
        banner: banner_2,
        chars: cloneTopicChars(createTopicSelectedChars),
        createdAt: Date.now()
      };
      updateXState(draft_8 => {
        draft_8.xTopics = draft_8.xTopics || [];
        draft_8.xTopics.unshift(newTopic);
      });
      currentActiveTopicId = String(newTopic.id || newTopic.name);
      renderSuperFollowBar();
      updateSuperHomeCard(newTopic);
      closeCreateTopicSheet();
      if (typeof window.showToast === "function") window.showToast("超话创建成功");
    }
    async function toggleTopicImportImessage() {
      if (createTopicManualContainer) createTopicManualContainer.style.display = "none";
      if (!createTopicImessageContainer) return;
      if (createTopicImessageContainer.style.display === "flex") createTopicImessageContainer.style.display = "none";else {
        createTopicImessageContainer.style.display = "flex";
        createTopicImessageContainer.innerHTML = "<div style=\"text-align:center; padding: 10px;\">加载中...</div>";
        const chars_4 = await handleAction_130();
        if (chars_4.length === 0) {
          createTopicImessageContainer.innerHTML = "<div style=\"text-align:center; padding: 10px;\">未找到可导入的角色</div>";
          return;
        }
        createTopicImessageContainer.innerHTML = chars_4.map(value_734 => {
          const dmChar = normalizeDmChar(stripImessageCharMessagesForXImport(value_734), "imessage");
          return "\n                        <div style=\"display:flex; justify-content:space-between; align-items:center; padding:5px 0; border-bottom:1px solid #eee;\">\n                            <div style=\"display:flex; align-items:center; gap:10px;\">\n                                <div style=\"width:30px; height:30px; border-radius:50%; overflow:hidden; background:#eee; display:flex; justify-content:center; align-items:center;\">\n                                    " + buildAvatarHtml(dmChar.avatar, dmChar.name) + "\n                                </div>\n                                <span>" + escapeHtml(dmChar.name) + "</span>\n                            </div>\n                            <button type=\"button\" data-char-id=\"" + dmChar.id + "\" class=\"x-topic-pick-char-btn\" style=\"padding:4px 10px; border-radius:4px; border:1px solid #ccc; background:#fff; cursor:pointer;\">添加</button>\n                        </div>\n                    ";
        }).join("");
        createTopicImessageContainer.querySelectorAll(".x-topic-pick-char-btn").forEach(value_735 => {
          value_735.addEventListener("click", () => {
            const charId_2 = value_735.dataset.charId,
              char_10 = chars_4.find(c_2 => String(c_2.id) === String(charId_2));
            if (char_10) {
              const normalized_4 = normalizeDmChar(stripImessageCharMessagesForXImport(char_10), "imessage");
              if (!createTopicSelectedChars.find(c_3 => c_3.id === normalized_4.id)) {
                createTopicSelectedChars.push(normalized_4);
                renderCreateTopicSelectedChars();
                if (typeof window.showToast === "function") window.showToast("已添加角色");
              } else {
                if (typeof window.showToast === "function") window.showToast("该角色已添加");
              }
            }
          });
        });
      }
    }
    function handleAction_101() {
      if (createTopicImessageContainer) createTopicImessageContainer.style.display = "none";
      if (!createTopicManualContainer) return;
      createTopicManualContainer.style.display === "flex" ? createTopicManualContainer.style.display = "none" : createTopicManualContainer.style.display = "flex";
    }
    function handleAction_102() {
      const nameInput_2 = document.getElementById("x-topic-manual-name"),
        handleInput = document.getElementById("x-topic-manual-handle"),
        bioInput = document.getElementById("x-topic-manual-bio"),
        personaInput = document.getElementById("x-topic-manual-persona"),
        name_17 = safeText(nameInput_2?.value);
      if (!name_17) {
        if (typeof window.showToast === "function") window.showToast("请输入角色名称");
        return;
      }
      const newChar = {
        id: makeLocalId("manual-char"),
        origin: "manual",
        name: name_17,
        handle: makeHandle(name_17, handleInput?.value),
        bio: safeText(bioInput?.value),
        persona: safeText(personaInput?.value),
        avatar: ""
      };
      createTopicSelectedChars.push(newChar);
      renderCreateTopicSelectedChars();
      if (nameInput_2) nameInput_2.value = "";
      if (handleInput) handleInput.value = "";
      if (bioInput) bioInput.value = "";
      if (personaInput) personaInput.value = "";
      if (typeof window.showToast === "function") window.showToast("已添加角色");
    }
    function renderCreateTopicSelectedChars() {
      if (!createTopicCharsList) return;
      if (createTopicSelectedChars.length === 0) {
        createTopicCharsList.innerHTML = "<div style=\"color: #888; font-size: 13px;\">暂未添加任何角色</div>";
        return;
      }
      createTopicCharsList.innerHTML = createTopicSelectedChars.map((contact_743, value_744) => "\n                <div style=\"display:flex; justify-content:space-between; align-items:center; background:#f0f0f0; padding:8px 12px; border-radius:8px;\">\n                    <div style=\"display:flex; align-items:center; gap:10px;\">\n                        <div style=\"width:24px; height:24px; border-radius:50%; overflow:hidden; background:#ccc; display:flex; justify-content:center; align-items:center; font-size:12px;\">\n                            " + buildAvatarHtml(contact_743.avatar, contact_743.name) + "\n                        </div>\n                        <span style=\"font-weight:bold;\">" + escapeHtml(contact_743.name) + "</span>\n                    </div>\n                    <i class=\"fas fa-times x-topic-remove-char\" data-index=\"" + value_744 + "\" style=\"color:#ff3b30; cursor:pointer;\"></i>\n                </div>\n            ").join("");
      createTopicCharsList.querySelectorAll(".x-topic-remove-char").forEach(value_745 => {
        value_745.addEventListener("click", () => {
          const idx = parseInt(value_745.dataset.index, 10);
          !isNaN(idx) && (createTopicSelectedChars.splice(idx, 1), renderCreateTopicSelectedChars());
        });
      });
    }
    function getTopicEditorConfig(mode_3 = "create") {
      const isEdit = mode_3 === "edit";
      return {
        mode: isEdit ? "edit" : "create",
        charsList: isEdit ? document.getElementById("x-edit-topic-chars-list") : createTopicCharsList,
        importContainer: isEdit ? document.getElementById("x-edit-topic-imessage-list-container") : createTopicImessageContainer,
        manualContainer: isEdit ? document.getElementById("x-edit-topic-manual-container") : createTopicManualContainer,
        manualNameId: isEdit ? "x-edit-topic-manual-name" : "x-topic-manual-name",
        manualHandleId: isEdit ? "x-edit-topic-manual-handle" : "x-topic-manual-handle",
        manualBioId: isEdit ? "x-edit-topic-manual-bio" : "x-topic-manual-bio",
        manualPersonaId: isEdit ? "x-edit-topic-manual-persona" : "x-topic-manual-persona"
      };
    }
    function getTopicEditorChars(mode_4 = "create") {
      return mode_4 === "edit" ? editSuperTopicSelectedChars : createTopicSelectedChars;
    }
    function getTopicCharKey(char_11 = {}) {
      const origin_2 = safeText(char_11.origin, "manual"),
        id_7 = safeText(char_11.sourceFriendId || char_11.id || char_11.name, char_11.name || origin_2);
      return (origin_2 + ":" + id_7).toLocaleLowerCase();
    }
    function cloneTopicChars(chars_5 = []) {
      return (Array.isArray(chars_5) ? chars_5 : []).map(char_12 => normalizeDmChar(char_12, char_12?.origin || "manual")).filter(char_13 => safeText(char_13.name));
    }
    function addTopicEditorChar(value_754, value_755) {
      const chars_6 = getTopicEditorChars(value_754),
        dmChar_756 = normalizeDmChar(value_755, value_755?.origin || "manual"),
        key_6 = getTopicCharKey(dmChar_756);
      if (chars_6.some(char_14 => getTopicCharKey(char_14) === key_6)) {
        if (typeof window.showToast === "function") window.showToast("该角色已添加");
        return false;
      }
      chars_6.push(dmChar_756);
      handleAction_104(value_754);
      if (typeof window.showToast === "function") window.showToast("已添加角色");
      return true;
    }
    function handleAction_104(value_759 = "create") {
      const config_3 = getTopicEditorConfig(value_759),
        listEl_2 = config_3.charsList;
      if (!listEl_2) return;
      const chars_7 = getTopicEditorChars(config_3.mode);
      if (chars_7.length === 0) {
        listEl_2.innerHTML = "<div class=\"x-topic-chars-empty\">暂未添加任何角色</div>";
        return;
      }
      listEl_2.innerHTML = chars_7.map((char_15, index_763) => {
        const originLabel = char_15.origin === "imessage" ? "iMessage" : "手动";
        return "<div class=\"x-topic-char-chip\"><div class=\"x-topic-char-avatar\">" + buildAvatarHtml(char_15.avatar, char_15.name) + "</div>" + "<div class=\"x-topic-char-copy\">" + "<strong>" + escapeHtml(char_15.name || "Char") + "</strong>" + "<span>" + escapeHtml(char_15.handle || originLabel) + "</span>" + "</div>" + "<em>" + escapeHtml(originLabel) + "</em>" + "<button type=\"button\" class=\"x-topic-remove-char\" data-index=\"" + index_763 + "\" aria-label=\"移除角色\"><i class=\"fas fa-times\"></i></button>" + "</div>";
      }).join("");
      listEl_2.querySelectorAll(".x-topic-remove-char").forEach(value_764 => {
        value_764.addEventListener("click", () => {
          const idx_2 = parseInt(value_764.dataset.index, 10);
          !Number.isNaN(idx_2) && (chars_7.splice(idx_2, 1), handleAction_104(config_3.mode));
        });
      });
    }
    async function toggleTopicEditorImport(value_766 = "create") {
      const config_4 = getTopicEditorConfig(value_766),
        importContainer_3 = config_4.importContainer,
        manualContainer_3 = config_4.manualContainer;
      if (manualContainer_3) manualContainer_3.style.display = "none";
      if (!importContainer_3) return;
      if (importContainer_3.style.display === "flex") {
        importContainer_3.style.display = "none";
        return;
      }
      importContainer_3.style.display = "flex";
      importContainer_3.innerHTML = "<div class=\"x-topic-source-empty\">加载 iMessage 角色中...</div>";
      const chars_8 = await handleAction_130();
      if (chars_8.length === 0) {
        importContainer_3.innerHTML = "<div class=\"x-topic-source-empty\">未找到可导入的角色</div>";
        return;
      }
      const normalizedChars = chars_8.map(char_16 => normalizeDmChar(stripImessageCharMessagesForXImport(char_16), "imessage"));
      importContainer_3.innerHTML = "<div class=\"x-topic-native-picker\"><select class=\"x-topic-imessage-select\" aria-label=\"选择 iMessage 角色\"><option value=\"\">选择要添加的角色</option>" + normalizedChars.map((item_18, index_12) => "<option value=\"" + index_12 + "\">" + escapeHtml(item_18.name) + " · " + escapeHtml(item_18.handle || "iMessage") + "</option>").join("") + "</select>" + "<button type=\"button\" class=\"x-topic-native-add-btn\">添加</button>" + "</div>";
      const selectEl = importContainer_3.querySelector(".x-topic-imessage-select");
      importContainer_3.querySelector(".x-topic-native-add-btn")?.addEventListener("click", () => {
        const selectedIndex = parseInt(selectEl?.value || "", 10);
        if (Number.isNaN(selectedIndex) || !normalizedChars[selectedIndex]) {
          if (typeof window.showToast === "function") window.showToast("请选择角色");
          return;
        }
        addTopicEditorChar(config_4.mode, normalizedChars[selectedIndex]) && selectEl && (selectEl.value = "");
      });
    }
    function toggleTopicEditorManual(mode_5 = "create") {
      const config_5 = getTopicEditorConfig(mode_5);
      if (config_5.importContainer) config_5.importContainer.style.display = "none";
      if (!config_5.manualContainer) return;
      config_5.manualContainer.style.display = config_5.manualContainer.style.display === "grid" ? "none" : "grid";
    }
    function handleAction_105(value_778 = "create") {
      const config_6 = getTopicEditorConfig(value_778),
        nameInput_3 = document.getElementById(config_6.manualNameId),
        handleInput_2 = document.getElementById(config_6.manualHandleId),
        bioInput_2 = document.getElementById(config_6.manualBioId),
        personaInput_2 = document.getElementById(config_6.manualPersonaId),
        name_18 = safeText(nameInput_3?.value);
      if (!name_18) {
        if (typeof window.showToast === "function") window.showToast("请输入角色名称");
        return;
      }
      addTopicEditorChar(config_6.mode, {
        id: makeLocalId("manual-char"),
        origin: "manual",
        name: name_18,
        handle: makeHandle(name_18, handleInput_2?.value),
        bio: safeText(bioInput_2?.value),
        persona: safeText(personaInput_2?.value),
        avatar: ""
      });
      if (nameInput_3) nameInput_3.value = "";
      if (handleInput_2) handleInput_2.value = "";
      if (bioInput_2) bioInput_2.value = "";
      if (personaInput_2) personaInput_2.value = "";
    }
    async function toggleTopicImportImessage() {
      return toggleTopicEditorImport("create");
    }
    function handleAction_101() {
      return toggleTopicEditorManual("create");
    }
    function handleAction_102() {
      return handleAction_105("create");
    }
    function renderCreateTopicSelectedChars() {
      return handleAction_104("create");
    }
    function handleAction_106() {
      return toggleTopicEditorImport("edit");
    }
    function handleAction_107() {
      return toggleTopicEditorManual("edit");
    }
    function handleAction_108() {
      return handleAction_105("edit");
    }
    function handleAction_109() {
      return handleAction_104("edit");
    }
    function handleAction_110(value_784) {
      const value_785 = postData[value_784] || postData.island,
        handleAction_27_786 = handleAction_27(value_784);
      return {
        likes: handleAction_27_786.likes,
        reposts: handleAction_27_786.reposts,
        commentsCount: parseCompactCount(value_785.comments),
        liked: false,
        reposted: false,
        frontendMetricVersion: 1,
        comments: (Array.isArray(value_785.commentList) ? value_785.commentList : []).map((contact_787, value_788) => ({
          id: contact_787.id || value_784 + "-comment-" + value_788,
          authorId: contact_787.authorId || makeAccountId(contact_787.handle, contact_787.name),
          avatar: contact_787.avatar || "?",
          name: contact_787.name || "User",
          handle: contact_787.handle || "@user",
          text: contact_787.text || "",
          translation: safeText(contact_787.translation),
          replies: Array.isArray(contact_787.replies) ? contact_787.replies : []
        }))
      };
    }
    function getPostThread(postId_4, state_14 = getXState()) {
      const base_2 = handleAction_110(postId_4),
        saved = state_14.xPostThreads?.[postId_4];
      if (!saved || typeof saved !== "object") return base_2;
      const useSavedMetrics = Number(saved.frontendMetricVersion) === 1;
      return {
        ...base_2,
        ...saved,
        comments: Array.isArray(saved.comments) ? saved.comments : base_2.comments,
        likes: useSavedMetrics && Number.isFinite(Number(saved.likes)) ? Number(saved.likes) : base_2.likes + (saved.liked ? 1 : 0),
        reposts: useSavedMetrics && Number.isFinite(Number(saved.reposts)) ? Number(saved.reposts) : base_2.reposts + (saved.reposted ? 1 : 0),
        commentsCount: Number.isFinite(Number(saved.commentsCount)) ? Number(saved.commentsCount) : base_2.commentsCount,
        liked: !!saved.liked,
        reposted: !!saved.reposted,
        frontendMetricVersion: 1
      };
    }
    function savePostThread(postId_5, thread) {
      updateXState(draft_9 => {
        draft_9.xPostThreads[postId_5] = thread;
      });
    }
    function escapeCssIdent(value_12) {
      if (window.CSS && typeof window.CSS.escape === "function") return CSS.escape(String(value_12));
      return String(value_12).replace(/["\\]/g, "\\$&");
    }
    function updatePostCountNodes(value_797, thread_2) {
      const post_33 = postData[value_797];
      post_33 && (post_33.likes = formatCompactCount(thread_2.likes), post_33.reposts = formatCompactCount(thread_2.reposts), post_33.comments = formatCompactCount(thread_2.commentsCount));
      view.querySelectorAll(".x-feed-card[data-post-id=\"" + escapeCssIdent(value_797) + "\"]").forEach(card_4 => {
        const actionItems = Array.from(card_4.querySelector(".x-feed-actions")?.children || []);
        if (actionItems[0]) actionItems[0].innerHTML = "<i class=\"far fa-comment\"></i> " + escapeHtml(formatCompactCount(thread_2.commentsCount));
        actionItems[1] && (actionItems[1].classList.toggle("active", !!thread_2.reposted), actionItems[1].innerHTML = "<i class=\"fas fa-retweet\"></i> <span>" + escapeHtml(formatCompactCount(thread_2.reposts)) + "</span>");
        actionItems[2] && (actionItems[2].classList.toggle("active", !!thread_2.liked), actionItems[2].innerHTML = "<i class=\"" + (thread_2.liked ? "fas" : "far") + " fa-heart\"></i> " + escapeHtml(formatCompactCount(thread_2.likes)));
      });
    }
    function handleAction_111(value_802) {
      const repostBtn = document.getElementById("x-detail-repost-btn"),
        likeBtn = document.getElementById("x-detail-like-btn");
      repostBtn?.classList.toggle("active", !!value_802.reposted);
      likeBtn?.classList.toggle("active", !!value_802.liked);
      const iElement_803 = likeBtn?.querySelector("i");
      if (iElement_803) iElement_803.className = (value_802.liked ? "fas" : "far") + " fa-heart";
    }
    function handleAction_112() {
      const context_3 = document.getElementById("x-reply-context"),
        textEl = document.getElementById("x-reply-context-text");
      if (!context_3 || !textEl) return;
      if (!replyTarget || !currentDetailPostId) {
        context_3.hidden = true;
        textEl.textContent = "Replying to post";
        return;
      }
      context_3.hidden = false;
      textEl.textContent = "Replying to " + (replyTarget.name || "comment");
    }
    function findCommentById(thread_3, commentId_2) {
      return (thread_3.comments || []).find(comment => String(comment.id) === String(commentId_2)) || null;
    }
    function findReplyById(comment_3, replyId_2) {
      return (Array.isArray(comment_3?.replies) ? comment_3.replies : []).find(reply_2 => String(reply_2.id) === String(replyId_2)) || null;
    }
    function deletePostComment(commentId_3, replyId_3 = "") {
      if (!currentDetailPostId || !commentId_3) return;
      const thread_4 = getPostThread(currentDetailPostId),
        commentById = findCommentById(thread_4, commentId_3);
      if (!commentById) return;
      let removedCount = 0;
      if (replyId_3) {
        const replies_2 = Array.isArray(commentById.replies) ? commentById.replies : [],
          index_814 = replies_2.findIndex(reply_3 => String(reply_3.id) === String(replyId_3));
        if (index_814 < 0) return;
        replies_2.splice(index_814, 1);
        commentById.replies = replies_2;
        removedCount = 1;
      } else {
        const commentIndex = thread_4.comments.findIndex(comment_4 => String(comment_4.id) === String(commentId_3));
        if (commentIndex < 0) return;
        removedCount = 1 + (Array.isArray(thread_4.comments[commentIndex].replies) ? thread_4.comments[commentIndex].replies.length : 0);
        thread_4.comments.splice(commentIndex, 1);
      }
      thread_4.commentsCount = Math.max(0, Number(thread_4.commentsCount) - removedCount);
      savePostThread(currentDetailPostId, thread_4);
      String(replyTarget?.commentId || "") === String(commentId_3) && (!replyId_3 || String(replyTarget?.replyId || "") === String(replyId_3)) && setReplyTarget(null);
      renderCommentsList(currentDetailPostId, thread_4);
      updatePostCountNodes(currentDetailPostId, thread_4);
      const xDetailCommentsElement = document.getElementById("x-detail-comments");
      if (xDetailCommentsElement) xDetailCommentsElement.textContent = formatCompactCount(thread_4.commentsCount);
    }
    function renderCommentsList(value_818, value_819) {
      const commentsList = document.getElementById("x-comments-list");
      if (!commentsList) return;
      commentsList.innerHTML = value_819.comments.map(value_820 => {
        const items_821 = Array.isArray(value_820.replies) ? value_820.replies : [],
          value_822 = items_821.length ? "<div class=\"x-comment-replies\">" + items_821.map(value_823 => "\n                        <div class=\"x-comment-reply\" data-comment-id=\"" + escapeHtml(value_820.id) + "\" data-reply-id=\"" + escapeHtml(value_823.id) + "\">\n                            " + buildAuthorAvatarButton(value_823, "x-avatar") + "\n                            <div>\n                                <strong>" + escapeHtml(value_823.name) + "</strong>\n                                <span>" + escapeHtml(value_823.handle) + "</span>\n                                <p>" + (value_823.replyToName ? "<b>回复 @" + escapeHtml(value_823.replyToName) + "</b> " : "") + escapeHtml(value_823.text) + "</p>\n                                <div class=\"x-comment-action-row\">\n                                    <button class=\"x-comment-reply-btn\" type=\"button\" data-comment-id=\"" + escapeHtml(value_820.id) + "\" data-reply-id=\"" + escapeHtml(value_823.id) + "\" data-reply-name=\"" + escapeHtml(value_823.name) + "\">回复</button>\n                                    " + (value_823.translation ? "<button class=\"x-translation-toggle x-comment-translation-toggle\" type=\"button\" aria-expanded=\"false\">翻译</button>" : "") + "\n                                    <button class=\"x-comment-delete-btn\" type=\"button\" data-comment-id=\"" + escapeHtml(value_820.id) + "\" data-reply-id=\"" + escapeHtml(value_823.id) + "\">删除</button>\n                                </div>\n                                " + (value_823.translation ? "<p class=\"x-translation-text\" hidden>" + escapeHtml(value_823.translation) + "</p>" : "") + "\n                            </div>\n                        </div>\n                    ").join("") + "</div>" : "";
        return "\n                    <div class=\"x-comment-row\" data-comment-id=\"" + escapeHtml(value_820.id) + "\">\n                        " + buildAuthorAvatarButton(value_820, "x-avatar") + "\n                        <div class=\"x-comment-main\">\n                            <strong>" + escapeHtml(value_820.name) + "</strong>\n                            <span>" + escapeHtml(value_820.handle) + "</span>\n                            <p>" + escapeHtml(value_820.text) + "</p>\n                            <div class=\"x-comment-action-row\">\n                                <button class=\"x-comment-reply-btn\" type=\"button\" data-comment-id=\"" + escapeHtml(value_820.id) + "\">回复</button>\n                                " + (value_820.translation ? "<button class=\"x-translation-toggle x-comment-translation-toggle\" type=\"button\" aria-expanded=\"false\">翻译</button>" : "") + "\n                                <button class=\"x-comment-delete-btn\" type=\"button\" data-comment-id=\"" + escapeHtml(value_820.id) + "\">删除</button>\n                            </div>\n                            " + (value_820.translation ? "<p class=\"x-translation-text\" hidden>" + escapeHtml(value_820.translation) + "</p>" : "") + "\n                            " + value_822 + "\n                        </div>\n                    </div>\n                ";
      }).join("");
    }
    function setReplyTarget(target_2 = null) {
      if (!target_2) replyTarget = null;else {
        if (typeof target_2 === "object") replyTarget = {
          commentId: String(target_2.commentId || ""),
          replyId: target_2.replyId ? String(target_2.replyId) : "",
          name: safeText(target_2.name, "comment")
        };else {
          const thread_5 = currentDetailPostId ? getPostThread(currentDetailPostId) : null,
            comment_5 = thread_5 ? findCommentById(thread_5, target_2) : null;
          replyTarget = {
            commentId: String(target_2),
            replyId: "",
            name: safeText(comment_5?.name, "comment")
          };
        }
      }
      handleAction_112();
      document.getElementById("x-reply-input")?.focus();
    }
    function handleAction_115() {
      if (!currentDetailPostId) return;
      const input_2 = document.getElementById("x-reply-input"),
        text_10 = safeText(input_2?.value);
      if (!text_10) {
        if (typeof window.showToast === "function") window.showToast("请输入回复内容");
        return;
      }
      const author_3 = handleAction_31(),
        thread_6 = getPostThread(currentDetailPostId);
      let text_830 = "",
        userReply = null,
        enabled_832 = false;
      if (replyTarget?.commentId) {
        const target_3 = findCommentById(thread_6, replyTarget.commentId);
        target_3 && (target_3.replies = Array.isArray(target_3.replies) ? target_3.replies : [], userReply = {
          id: makeLocalId("reply"),
          ...author_3,
          text: text_10,
          replyToId: replyTarget.replyId || "",
          replyToName: replyTarget.name || target_3.name || ""
        }, target_3.replies.push(userReply), text_830 = target_3.id, enabled_832 = true);
      }
      !enabled_832 && (userReply = {
        id: makeLocalId("comment"),
        ...author_3,
        text: text_10,
        replies: []
      }, thread_6.comments.unshift(userReply), text_830 = userReply.id);
      thread_6.commentsCount += 1;
      savePostThread(currentDetailPostId, thread_6);
      updatePostCountNodes(currentDetailPostId, thread_6);
      if (input_2) input_2.value = "";
      setReplyTarget(null);
      openPostDetail(currentDetailPostId);
      text_830 && userReply && handleAction_117(currentDetailPostId, text_830, userReply, enabled_832);
    }
    function normalizeEngagementReply(reply_4, value_835 = 0, value_836 = {}) {
      const text_11 = safeText(reply_4?.text || reply_4?.content),
        name_19 = safeText(reply_4?.authorName || reply_4?.name || reply_4?.handle);
      if (!text_11 || !name_19) return null;
      return {
        id: String(reply_4.id || makeLocalId("auto-reply")),
        avatar: handleAction_29(reply_4.authorAvatar || reply_4.avatar, "reply:" + (reply_4.authorId || reply_4.handle || name_19)),
        name: name_19,
        handle: makeHandle(name_19, reply_4.handle || name_19),
        text: text_11,
        translation: getGeneratedTranslation(reply_4, text_11),
        replyToId: value_836.id || "",
        replyToName: value_836.name || "",
        replies: []
      };
    }
    function handleAction_116(visitor_2, value_840 = 0) {
      const name_20 = safeText(visitor_2?.name || visitor_2?.authorName || visitor_2?.handle);
      if (!name_20) return null;
      return {
        id: String(visitor_2.id || makeLocalId("x-visitor")),
        avatar: handleAction_29(visitor_2.avatar || visitor_2.authorAvatar, "visitor:" + (visitor_2.id || visitor_2.handle || name_20)),
        name: name_20,
        handle: makeHandle(name_20, visitor_2.handle || name_20),
        bio: safeText(visitor_2.bio || visitor_2.reason || visitor_2.text),
        time: safeText(visitor_2.time, "now"),
        createdAt: Date.now()
      };
    }
    async function handleAction_117(postId_6, value_843, userReply_2, isNestedReply = false) {
      const post_34 = postData[postId_6] || {},
        postThread_847 = getPostThread(postId_6),
        rootComment = findCommentById(postThread_847, value_843);
      if (!rootComment || !userReply_2) return;
      try {
        const worldbook_2 = getSelectedWorldBookContext([post_34.name, post_34.text, rootComment.name, rootComment.text, userReply_2.text, currentProfile.persona].filter(Boolean).join(" ")),
          content_3 = "Return strict JSON only. A user just commented in an X/Twitter-style post detail page. Generate engagement around this user's exact comment.\nOutput JSON shape:\n{\n  \"replies\": [{\"authorName\":\"\", \"handle\":\"\", \"text\":\"\", \"translation\":\"\"}],\n  \"visitors\": [{\"name\":\"\", \"handle\":\"\", \"bio\":\"\", \"translation\":\"\", \"avatar\":\"\", \"time\":\"now\"}]\n}\nRules:\n- replies must contain at least 5 items.\n- visitors must contain 2 to 5 items.\n- Every generated reply and visitor must be a non-User identity. Never write another comment or reply as the current User.\n- Replies must directly respond to the user's comment, not to the whole post in general.\n- Keep replies short, social, varied, and realistic. Mix agreement, disagreement, teasing, clarification, and curiosity.\n- Each account may use the language natural to its identity. For non-Chinese reply or bio text, translation must contain Simplified Chinese; for Chinese originals use \"\".\n- Visitors are people who visited the user's profile because of this comment; bio should briefly explain the vibe or reason.\n- Do not include markdown or extra text.\n\nPost author: " + (post_34.name || "") + "\nPost text: " + (post_34.text || "") + "\nRoot comment author: " + (rootComment.name || "") + "\nRoot comment text: " + (rootComment.text || "") + "\nUser display name: " + currentProfile.name + " " + currentProfile.handle + "\nUser comment text: " + userReply_2.text + "\nUser comment type: " + (isNestedReply ? "reply inside a comment thread" : "top-level comment") + "\n\nWorldbook:\n" + (worldbook_2 || "None"),
          raw_15 = await requestXChatCompletion([{
            role: "system",
            content: "You generate strict JSON for social-feed replies and profile visitors."
          }, {
            role: "user",
            content: content_3
          }], {
            temperature: 0.9
          }),
          parsed_4 = parseJsonPayload(raw_15),
          rawReplies = sanitizeApiGeneratedAuthors(Array.isArray(parsed_4?.replies) ? parsed_4.replies : []),
          rawVisitors = sanitizeApiGeneratedAuthors(Array.isArray(parsed_4?.visitors) ? parsed_4.visitors : []),
          replyTo = isNestedReply ? {
            id: userReply_2.id,
            name: userReply_2.name
          } : {},
          generatedReplies = rawReplies.map((reply_5, index_13) => normalizeEngagementReply(reply_5, index_13, replyTo)).filter(Boolean),
          visitors_2 = rawVisitors.map((value_859, value_860) => handleAction_116(value_859, value_860)).filter(Boolean);
        if (generatedReplies.length) {
          const latestThread = getPostThread(postId_6),
            latestRoot = findCommentById(latestThread, value_843);
          if (latestRoot) {
            latestRoot.replies = Array.isArray(latestRoot.replies) ? latestRoot.replies : [];
            const existingIds_3 = new Set(latestRoot.replies.map(reply_6 => String(reply_6.id)));
            generatedReplies.forEach(reply_7 => {
              if (!existingIds_3.has(String(reply_7.id))) latestRoot.replies.push(reply_7);
            });
            latestThread.commentsCount += generatedReplies.length;
            savePostThread(postId_6, latestThread);
            updatePostCountNodes(postId_6, latestThread);
            if (String(currentDetailPostId) === String(postId_6)) {
              renderCommentsList(postId_6, latestThread);
              const commentsEl = document.getElementById("x-detail-comments");
              if (commentsEl) commentsEl.textContent = formatCompactCount(latestThread.commentsCount);
            }
          }
        }
        visitors_2.length && (updateXState(draft_10 => {
          const existingIds = new Set((draft_10.xVisitors || []).map(visitor => String(visitor.id)));
          visitors_2.slice(0, 5).reverse().forEach(visitor_3 => {
            if (!existingIds.has(String(visitor_3.id))) draft_10.xVisitors.unshift(visitor_3);
          });
        }), handleAction_128());
      } catch (error_7) {
        console.error("[X] Generate user reply engagement failed", error_7);
        if (typeof window.showToast === "function") window.showToast("回复生成失败");
      }
    }
    function toggleDetailAction(value_870) {
      if (!currentDetailPostId) return;
      const thread_7 = getPostThread(currentDetailPostId);
      if (value_870 === "like") {
        thread_7.liked = !thread_7.liked;
        thread_7.likes += thread_7.liked ? 1 : -1;
      } else value_870 === "repost" && (thread_7.reposted = !thread_7.reposted, thread_7.reposts += thread_7.reposted ? 1 : -1);
      thread_7.likes = Math.max(0, thread_7.likes);
      thread_7.reposts = Math.max(0, thread_7.reposts);
      savePostThread(currentDetailPostId, thread_7);
      updatePostCountNodes(currentDetailPostId, thread_7);
      openPostDetail(currentDetailPostId);
    }
    function normalizePostSnapshot(snapshot = {}) {
      const comments_3 = Array.isArray(snapshot.comments) ? snapshot.comments : [];
      return {
        id: String(snapshot.id || makeLocalId("shared-post")),
        authorId: safeText(snapshot.authorId),
        name: safeText(snapshot.name || snapshot.authorName, "X User"),
        handle: safeText(snapshot.handle || snapshot.authorHandle),
        avatar: safeText(snapshot.avatar || snapshot.authorAvatar),
        text: safeText(snapshot.text || snapshot.content),
        translation: getGeneratedTranslation(snapshot, snapshot.text || snapshot.content),
        topicTag: safeText(snapshot.topicTag),
        images: Array.isArray(snapshot.images) ? snapshot.images.slice(0, 4) : [],
        comments: comments_3.map(comment_6 => ({
          authorId: safeText(comment_6.authorId),
          avatar: safeText(comment_6.avatar || comment_6.authorAvatar),
          name: safeText(comment_6.name || comment_6.authorName, "User"),
          handle: safeText(comment_6.handle),
          text: safeText(comment_6.text || comment_6.content),
          translation: getGeneratedTranslation(comment_6, comment_6.text || comment_6.content),
          replies: (Array.isArray(comment_6.replies) ? comment_6.replies : []).map(reply_8 => ({
            authorId: safeText(reply_8.authorId),
            avatar: safeText(reply_8.avatar || reply_8.authorAvatar),
            name: safeText(reply_8.name || reply_8.authorName, "User"),
            handle: safeText(reply_8.handle),
            text: safeText(reply_8.text || reply_8.content),
            translation: getGeneratedTranslation(reply_8, reply_8.text || reply_8.content)
          })).filter(reply_9 => reply_9.text)
        })).filter(comment_7 => comment_7.text)
      };
    }
    function normalizeDmMessages(messages_3) {
      if (!Array.isArray(messages_3)) return [];
      return messages_3.map(message_2 => {
        const source_6 = message_2?.source || message_2?.sender,
          type_2 = message_2?.type === "post-card" ? "post-card" : "text";
        return {
          id: String(message_2?.id || makeLocalId("dm-msg")),
          source: source_6 === "user" ? "user" : "char",
          type: type_2,
          text: safeText(message_2?.text || message_2?.content || message_2?.message),
          postSnapshot: type_2 === "post-card" ? normalizePostSnapshot(message_2?.postSnapshot || message_2?.post) : null,
          translation: getGeneratedTranslation(message_2, message_2?.text || message_2?.content || message_2?.message),
          createdAt: Number(message_2?.createdAt || message_2?.timestamp || Date.now())
        };
      }).filter(message_3 => message_3.text || message_3.type === "post-card");
    }
    function normalizeImessageContextMount(mount) {
      const source_7 = mount && typeof mount === "object" && !Array.isArray(mount) ? mount : {},
        parsedLimit = Number(source_7.limit);
      return {
        enabled: source_7.enabled !== false,
        limit: Number.isFinite(parsedLimit) ? Math.max(1, Math.min(50, Math.floor(parsedLimit))) : defaultImessageContextMount.limit
      };
    }
    function isImessageImportedDm(item_19) {
      return Boolean(item_19 && item_19.origin === "imessage" && String(item_19.sourceFriendId || "").trim());
    }
    function getLinkedImessageCharForDm(item_20) {
      if (!isImessageImportedDm(item_20)) return null;
      const friendId = String(item_20.sourceFriendId || "").trim(),
        friend_2 = window.imApp?.getFriendById?.(friendId) || (Array.isArray(window.imData?.friends) ? window.imData.friends.find(candidate => String(candidate?.id) === friendId) : null);
      return friend_2?.type === "char" ? friend_2 : null;
    }
    function formatImessageContextTimestamp(value_887) {
      const value_888 = new Date(Number(value_887));
      if (Number.isNaN(value_888.getTime())) return "";
      const pad = value_13 => String(value_13).padStart(2, "0");
      return value_888.getFullYear() + "-" + pad(value_888.getMonth() + 1) + "-" + pad(value_888.getDate()) + " " + pad(value_888.getHours()) + ":" + pad(value_888.getMinutes());
    }
    function buildImessageSingleChatContextMessage(message_4, userName_3, charName_2) {
      if (!message_4 || message_4.role !== "user" && message_4.role !== "assistant") return "";
      const rawText = message_4.content || message_4.text || message_4.message || "",
        text_12 = String(rawText).replace(/[<>]/g, character_2 => character_2 === "<" ? "‹" : "›").replace(/\s+/g, " ").trim().slice(0, 800);
      if (!text_12) return "";
      const timestamp_2 = formatImessageContextTimestamp(message_4.timestamp),
        speaker = message_4.role === "user" ? userName_3 : charName_2;
      return "" + (timestamp_2 ? "[" + timestamp_2 + "] " : "") + speaker + ": " + text_12;
    }
    async function handleAction_122(item_21) {
      const mount_2 = normalizeImessageContextMount(item_21?.imessageContextMount);
      if (!mount_2.enabled) return "";
      const initialFriend = getLinkedImessageCharForDm(item_21);
      if (!initialFriend) return "";
      window.imApp?.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(initialFriend));
      const friend_3 = getLinkedImessageCharForDm(item_21);
      if (!friend_3) return "";
      const userName = safeText(currentProfile?.name, "User").replace(/[<>]/g, character_3 => character_3 === "<" ? "‹" : "›"),
        charName = safeText(friend_3.nickname || friend_3.realName || item_21.name, "Char").replace(/[<>]/g, character_4 => character_4 === "<" ? "‹" : "›"),
        recentMessages = (Array.isArray(friend_3.messages) ? friend_3.messages : []).filter(message_5 => message_5?.role === "user" || message_5?.role === "assistant").slice(-mount_2.limit).map(message_6 => buildImessageSingleChatContextMessage(message_6, userName, charName)).filter(Boolean);
      if (!recentMessages.length) return "";
      return "<mounted_imessage_single_chat_context>\nSource: prior iMessage one-to-one chat with the same Char. This is cross-platform continuity only, not a message in the current X conversation.\nUse it only to maintain continuity with User. Do not say it happened on X, do not repeat it as a new X message, and do not imply anyone else saw it.\nSame iMessage Char: " + charName + "\nRecent iMessage messages:\n" + recentMessages.join("\n") + "\n</mounted_imessage_single_chat_context>";
    }
    function stripImessageCharMessagesForXImport(source_8 = {}) {
      if (!source_8 || typeof source_8 !== "object") return source_8;
      const id_8 = source_8.id || source_8.sourceFriendId || makeLocalId("imessage");
      return {
        ...source_8,
        id: id_8,
        origin: "imessage",
        sourceFriendId: source_8.sourceFriendId || source_8.id || id_8,
        messages: []
      };
    }
    function handleAction_123(item_22) {
      const messages_4 = normalizeDmMessages(item_22?.messages);
      if (!messages_4.length) return safeText(item_22?.bio, "暂无签名");
      const last = messages_4[messages_4.length - 1];
      return last.type === "post-card" ? "[帖子] " + safeText(last.postSnapshot?.text, "分享了一条帖子") : last.text;
    }
    function getDmUnreadCount(item_23) {
      const lastReadAt_2 = Number(item_23?.lastReadAt) || 0;
      return normalizeDmMessages(item_23?.messages).filter(message_7 => message_7.source === "char" && message_7.createdAt > lastReadAt_2).length;
    }
    function getDmLatestIncomingAt(item_24) {
      return normalizeDmMessages(item_24?.messages).reduce((latest, message_8) => message_8.source === "char" ? Math.max(latest, message_8.createdAt) : latest, 0);
    }
    function formatDmTimestamp(value_917) {
      const date = new Date(Number(value_917));
      if (Number.isNaN(date.getTime())) return "";
      const now_2 = new Date(),
        time_2 = new Intl.DateTimeFormat("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }).format(date);
      if (date.toDateString() === now_2.toDateString()) return time_2;
      if (date.getFullYear() === now_2.getFullYear()) return date.getMonth() + 1 + "月" + date.getDate() + "日 " + time_2;
      return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日 " + time_2;
    }
    function handleAction_125(messages_5 = []) {
      const summaryValues = document.querySelectorAll("#x-messages-tab .x-message-summary strong"),
        unreadCount = messages_5.reduce((total_2, item_25) => total_2 + getDmUnreadCount(item_25), 0);
      if (summaryValues[0]) summaryValues[0].textContent = String(messages_5.length);
      if (summaryValues[1]) summaryValues[1].textContent = String(unreadCount);
      if (summaryValues[2]) summaryValues[2].textContent = "0";
      const messagesNavItem = navItems.find(item_26 => item_26.getAttribute("data-target") === "x-messages-tab");
      messagesNavItem && (messagesNavItem.classList.toggle("has-unread", unreadCount > 0), messagesNavItem.setAttribute("aria-label", unreadCount > 0 ? "Messages，" + unreadCount + " 条未读" : "Messages"));
    }
    function normalizeCharProfileImagePromptConfig(value_927 = {}) {
      const source_9 = value_927 && typeof value_927 === "object" ? value_927 : {},
        presets_2 = (Array.isArray(source_9.presets) ? source_9.presets : []).map((preset_2, value_932) => ({
          id: String(preset_2?.id || "x-char-image-preset-" + (value_932 + 1)),
          name: safeText(preset_2?.name, "预设 " + (value_932 + 1)),
          prompt: safeText(preset_2?.prompt),
          charAppearance: safeText(preset_2?.charAppearance),
          userAppearance: safeText(preset_2?.userAppearance),
          artistPrompt: safeText(preset_2?.artistPrompt),
          negativePrompt: safeText(preset_2?.negativePrompt)
        })),
        activePresetId_2 = presets_2.some(preset => preset.id === String(source_9.activePresetId || "")) ? String(source_9.activePresetId) : "";
      return {
        lastPrompt: safeText(source_9.lastPrompt),
        charAppearance: safeText(source_9.charAppearance),
        userAppearance: safeText(source_9.userAppearance),
        artistPrompt: safeText(source_9.artistPrompt),
        negativePrompt: safeText(source_9.negativePrompt),
        presets: presets_2,
        activePresetId: activePresetId_2,
        autoUseReferenceFace: source_9.autoUseReferenceFace === true
      };
    }
    function getDefaultCharSocialCounts(value_933 = {}) {
      const value_934 = (value_933.id || "") + ":" + (value_933.handle || value_933.name || "");
      return {
        followersCount: 1200 + hashPostMetricSeed("followers:" + value_934) % 198800,
        followingCount: 80 + hashPostMetricSeed("following:" + value_934) % 1920
      };
    }
    function normalizeDmChar(source_10 = {}, origin_3 = "manual") {
      const name_21 = safeText(source_10.nickname || source_10.name || source_10.realName, "Char"),
        handleSource = source_10.handle || source_10.realName || source_10.signature || name_21,
        id_9 = String(source_10.id || makeLocalId(origin_3)),
        handle_7 = makeHandle(name_21, handleSource),
        avatar_7 = handleAction_29(source_10.avatarUrl || source_10.avatar, "char:" + id_9 + ":" + handleSource),
        profilePosts_2 = (Array.isArray(source_10.profilePosts) ? source_10.profilePosts : []).map((post_35, index_14) => normalizeGeneratedPost({
          ...post_35,
          profileOwnerId: id_9,
          authorId: id_9
        }, index_14)).filter(Boolean),
        socialCounts = getDefaultCharSocialCounts({
          ...source_10,
          id: id_9,
          name: name_21,
          handle: handle_7
        });
      return {
        id: id_9,
        origin: origin_3,
        sourceFriendId: source_10.sourceFriendId || (origin_3 === "imessage" ? source_10.id : ""),
        name: name_21,
        handle: handle_7,
        bio: safeText(source_10.bio || source_10.signature, "暂无签名"),
        persona: safeText(source_10.persona || source_10.characterPersona || source_10.systemPrompt),
        avatar: avatar_7,
        boundBooks: getCharacterBoundWorldBookIds(source_10),
        messages: normalizeDmMessages(source_10.messages),
        imessageContextMount: origin_3 === "imessage" ? normalizeImessageContextMount(source_10.imessageContextMount) : null,
        isFollowing: typeof source_10.isFollowing === "boolean" ? source_10.isFollowing : origin_3 !== "generated",
        followingCount: normalizeProfileCount(source_10.followingCount ?? source_10.following, socialCounts.followingCount),
        followersCount: normalizeProfileCount(source_10.followersCount ?? source_10.followers, socialCounts.followersCount),
        coverSeed: safeText(source_10.coverSeed, id_9 + "-cover"),
        coverImage: safeText(source_10.coverImage),
        profileImagePromptConfig: normalizeCharProfileImagePromptConfig(source_10.profileImagePromptConfig),
        profileImageFaceReferenceAssetId: safeText(source_10.profileImageFaceReferenceAssetId),
        profileImageFaceReferenceUrl: safeText(source_10.profileImageFaceReferenceUrl),
        profileImageFaceReferenceFileName: safeText(source_10.profileImageFaceReferenceFileName),
        profilePosts: profilePosts_2,
        profileGeneratedAt: Number(source_10.profileGeneratedAt) || 0,
        addedAt: Number(source_10.addedAt) || Date.now(),
        lastReadAt: Number(source_10.lastReadAt) || 0
      };
    }
    function addDirectMessageChar(charItem) {
      const sourceItem = charItem?.origin === "imessage" ? stripImessageCharMessagesForXImport(charItem) : charItem,
        item_27 = normalizeDmChar(sourceItem, sourceItem?.origin || "manual");
      updateXState(draft_11 => {
        const existingIndex = draft_11.xDirectMessages.findIndex(entry_4 => String(entry_4.id) === String(item_27.id) || safeText(entry_4.name).toLowerCase() === item_27.name.toLowerCase());
        if (existingIndex >= 0) {
          const existing = normalizeDmChar(draft_11.xDirectMessages[existingIndex], draft_11.xDirectMessages[existingIndex].origin || item_27.origin),
            merged = {
              ...existing,
              ...item_27,
              messages: item_27.messages.length ? item_27.messages : existing.messages,
              imessageContextMount: existing.origin === "imessage" && String(existing.sourceFriendId || "") === String(item_27.sourceFriendId || "") ? existing.imessageContextMount : item_27.imessageContextMount,
              addedAt: existing.addedAt || item_27.addedAt,
              lastReadAt: Math.max(Number(existing.lastReadAt) || 0, Number(item_27.lastReadAt) || 0)
            };
          draft_11.xDirectMessages.splice(existingIndex, 1);
          draft_11.xDirectMessages.unshift(merged);
        } else draft_11.xDirectMessages.unshift(item_27);
      });
      renderDirectMessages();
      if (typeof window.showToast === "function") window.showToast("已添加到 X 私信");
    }
    function renderDirectMessages(state_15 = getXState()) {
      if (!dmList) dmList = document.getElementById("x-dm-list") || document.querySelector("#x-messages-tab .x-message-list");
      if (!dmList) return;
      const sort_955 = (state_15.xDirectMessages || []).map(item_28 => normalizeDmChar(item_28, item_28?.origin || "manual")).sort((value_957, value_958) => {
        const value_959 = value_957.messages[value_957.messages.length - 1]?.createdAt || value_957.addedAt || 0,
          value_960 = value_958.messages[value_958.messages.length - 1]?.createdAt || value_958.addedAt || 0;
        return value_960 - value_959;
      });
      handleAction_125(sort_955);
      if (sort_955.length === 0) {
        dmList.innerHTML = "\n                    <div class=\"x-empty-state x-dm-empty-state\">\n                        <strong>暂无私信</strong>\n                        <span>添加一个 Char 开始聊天吧</span>\n                        <button class=\"x-add-dm-submit x-empty-add-dm-btn\" type=\"button\">添加 Char</button>\n                    </div>\n                ";
        return;
      }
      dmList.innerHTML = sort_955.map(item_29 => {
        const dmUnreadCount = getDmUnreadCount(item_29);
        return "\n                <button class=\"x-message-row x-dm-row " + (dmUnreadCount > 0 ? "has-unread" : "") + "\" type=\"button\" data-dm-id=\"" + escapeHtml(item_29.id) + "\">\n                    <div class=\"x-avatar\">" + buildAvatarHtml(item_29.avatar, item_29.name) + "</div>\n                    <div>\n                        <strong>" + escapeHtml(item_29.name) + "</strong>\n                        <p>" + escapeHtml(handleAction_123(item_29)) + "</p>\n                    </div>\n                    <span class=\"x-dm-row-side\">\n                        <span>" + escapeHtml(item_29.origin === "imessage" ? "iMessage" : "X") + "</span>\n                        " + (dmUnreadCount > 0 ? "<i class=\"x-dm-unread-dot\" aria-label=\"" + dmUnreadCount + " 条未读\"></i>" : "") + "\n                    </span>\n                </button>\n            ";
      }).join("");
    }
    function handleAction_128() {
      if (!visitorsList) visitorsList = document.getElementById("x-visitors-list");
      if (!visitorsList) return;
      const visitors_3 = getXState().xVisitors || [];
      if (visitors_3.length === 0) {
        visitorsList.innerHTML = "<div class=\"x-empty-state\">暂无主页访客</div>";
        return;
      }
      visitorsList.innerHTML = visitors_3.map(item_30 => "\n                <div class=\"x-message-row\">\n                    <div class=\"x-avatar\">" + buildAvatarHtml(item_30.avatar, item_30.name) + "</div>\n                    <div>\n                        <strong>" + escapeHtml(item_30.name || "Visitor") + "</strong>\n                        <p>" + escapeHtml(item_30.bio || "最近访问了你的主页") + "</p>\n                    </div>\n                    <span>" + escapeHtml(item_30.time || "now") + "</span>\n                </div>\n            ").join("");
    }
    async function hydrateImessageCharAvatar(friend_4) {
      if (!friend_4 || typeof friend_4 !== "object") return friend_4;
      if (friend_4.avatarUrl || friend_4.avatar || !friend_4.avatarAssetId) return friend_4;
      if (!window.appStorage || typeof window.appStorage.getAssetUrl !== "function") return friend_4;
      try {
        const avatarUrl_2 = await window.appStorage.getAssetUrl(friend_4.avatarAssetId);
        return avatarUrl_2 ? {
          ...friend_4,
          avatarUrl: avatarUrl_2
        } : friend_4;
      } catch (error_8) {
        return console.warn("[X] Failed to hydrate iMessage char avatar", error_8), friend_4;
      }
    }
    async function handleAction_130() {
      const runtimeFriends_2 = Array.isArray(window.imData?.friends) ? window.imData.friends : [];
      if (runtimeFriends_2.length > 0) return Promise.all(runtimeFriends_2.filter(friend_5 => friend_5?.type === "char").map(friend_6 => hydrateImessageCharAvatar(friend_6)));
      if (window.imStorage && typeof window.imStorage.loadFriends === "function") try {
        const friends_2 = await window.imStorage.loadFriends();
        return Array.isArray(friends_2) ? Promise.all(friends_2.filter(friend_7 => friend_7?.type === "char").map(friend_8 => hydrateImessageCharAvatar(friend_8))) : [];
      } catch (error_9) {
        console.warn("[X] Failed to load iMessage chars", error_9);
      }
      return [];
    }
    async function renderImessageCharPicker() {
      if (!imessageCharList) imessageCharList = document.getElementById("x-imessage-char-list");
      if (!imessageCharList) return;
      imessageCharList.innerHTML = "<div class=\"x-empty-state\">加载 iMessage Char...</div>";
      const chars_9 = await handleAction_130();
      if (chars_9.length === 0) {
        imessageCharList.innerHTML = "<div class=\"x-empty-state\">未找到 iMessage Char</div>";
        return;
      }
      imessageCharList.innerHTML = chars_9.map(value_975 => {
        const dmChar_976 = normalizeDmChar(stripImessageCharMessagesForXImport(value_975), "imessage");
        return "\n                    <button class=\"x-char-pick-row\" type=\"button\" data-char-id=\"" + escapeHtml(dmChar_976.id) + "\">\n                        <div class=\"x-avatar\">" + buildAvatarHtml(dmChar_976.avatar, dmChar_976.name) + "</div>\n                        <div>\n                            <strong>" + escapeHtml(dmChar_976.name) + "</strong>\n                            <span>" + escapeHtml(dmChar_976.bio) + "</span>\n                        </div>\n                        <i class=\"fas fa-plus\"></i>\n                    </button>\n                ";
      }).join("");
      imessageCharList.querySelectorAll(".x-char-pick-row").forEach(button => {
        button.addEventListener("click", () => {
          const friend_9 = chars_9.find(item_31 => String(item_31.id) === String(button.dataset.charId));
          if (friend_9) addDirectMessageChar({
            ...friend_9,
            origin: "imessage"
          });
        });
      });
    }
    function handleAction_131() {
      handleAction_128();
      if (typeof window.openView === "function") window.openView(visitorsSheet);else visitorsSheet?.classList.add("active");
    }
    function closeVisitorsSheet() {
      if (typeof window.closeView === "function") window.closeView(visitorsSheet);else visitorsSheet?.classList.remove("active");
    }
    function openAddDmSheet() {
      if (manualCharNameInput) manualCharNameInput.value = "";
      if (manualCharHandleInput) manualCharHandleInput.value = "";
      if (manualCharBioInput) manualCharBioInput.value = "";
      if (manualCharPersonaInput) manualCharPersonaInput.value = "";
      if (typeof window.openView === "function") window.openView(addDmSheet);else addDmSheet?.classList.add("active");
      renderImessageCharPicker();
    }
    function closeAddDmSheet() {
      if (typeof window.closeView === "function") window.closeView(addDmSheet);else addDmSheet?.classList.remove("active");
    }
    function addManualChar() {
      const name_22 = safeText(manualCharNameInput?.value);
      if (!name_22) {
        if (typeof window.showToast === "function") window.showToast("请输入 Char 名称");
        return;
      }
      addDirectMessageChar({
        id: makeLocalId("x-char"),
        origin: "manual",
        name: name_22,
        handle: manualCharHandleInput?.value,
        bio: manualCharBioInput?.value,
        persona: manualCharPersonaInput?.value
      });
      closeAddDmSheet();
    }
    function getDirectMessageById(dmId_2) {
      const item_32 = (getXState().xDirectMessages || []).find(entry_5 => String(entry_5.id) === String(dmId_2));
      return item_32 ? normalizeDmChar(item_32, item_32.origin || "manual") : null;
    }
    function releaseFocusBeforeHide(container, fallbackSelector = "") {
      if (!container || !container.contains(document.activeElement)) return;
      const focused = document.activeElement;
      if (focused && typeof focused.blur === "function") focused.blur();
      requestAnimationFrame(() => {
        if (!fallbackSelector) return;
        const fallback_5 = view.querySelector(fallbackSelector);
        if (fallback_5 && typeof fallback_5.focus === "function") fallback_5.focus({
          preventScroll: true
        });
      });
    }
    function handleAction_133(item_33) {
      return "\n                <section class=\"x-dm-profile-intro\">\n                    <div class=\"x-avatar\">" + buildAvatarHtml(item_33.avatar, item_33.name) + "</div>\n                    <div>\n                        <strong>" + escapeHtml(item_33.name) + "</strong>\n                        <span>" + escapeHtml(item_33.handle || "@char") + "</span>\n                        <p>" + escapeHtml(item_33.bio || "暂无签名") + "</p>\n                    </div>\n                    <button class=\"x-dm-profile-home-btn\" type=\"button\" data-dm-profile-id=\"" + escapeHtml(item_33.id) + "\">主页</button>\n                </section>\n            ";
    }
    function handleAction_134(identity_9, state_16 = getXState()) {
      const posts_7 = [];
      if (identity_9.kind === "char") {
        const item_34 = getDirectMessageById(identity_9.id);
        posts_7.push(...(item_34?.profilePosts || []));
      }
      posts_7.push(...(state_16.xGeneratedPosts || []).filter(post_36 => {
        if (post_36.authorId && String(post_36.authorId) === String(identity_9.id)) return true;
        return canonicalAccountHandle(post_36.handle || post_36.authorHandle, post_36.name || post_36.authorName) === canonicalAccountHandle(identity_9.handle, identity_9.name);
      }));
      const seen_4 = new Set();
      return posts_7.map((value_990, value_991) => normalizeGeneratedPost(value_990, value_991)).filter(post_37 => {
        if (!post_37 || seen_4.has(post_37.id)) return false;
        return seen_4.add(post_37.id), postData[post_37.id] = ensureCommentDepth(post_37), true;
      });
    }
    function handleAction_135(posts_8) {
      if (!posts_8.length) return "<div class=\"x-empty-state\">暂无帖子</div>";
      return posts_8.map(value_994 => "\n                <article class=\"x-feed-card x-generated-feed-card x-profile-feed-card\" data-post-id=\"" + escapeHtml(value_994.id) + "\" tabindex=\"0\">\n                    " + buildFeedCardHtml(value_994) + "\n                </article>\n            ").join("");
    }
    function handleAction_136(posts_9) {
      const images_3 = posts_9.flatMap(post_38 => getPostImages(post_38).map(image_7 => ({
        ...image_7,
        postId: post_38.id
      })));
      if (!images_3.length) return "<div class=\"x-empty-state\">暂无照片</div>";
      return "<div class=\"x-super-post-grid x-profile-photo-grid\">" + images_3.map(value_999 => "\n                <button class=\"x-post-image-thumb\" type=\"button\" data-image-text=\"" + escapeHtml(value_999.text || "Image") + "\" data-image-url=\"" + escapeHtml(value_999.url || "") + "\" data-post-id=\"" + escapeHtml(value_999.postId) + "\">\n                    <img src=\"" + escapeHtml(value_999.url) + "\" alt=\"\" onerror=\"this.remove()\">\n                </button>\n            ").join("") + "</div>";
    }
    function renderIdentityProfile(identity_10, charItem_2 = null) {
      const body_2 = document.getElementById("x-dm-profile-body");
      if (!identity_10 || !body_2 || !dmProfileView) return;
      const isChar = identity_10.kind === "char" && !!charItem_2,
        isTopicChar = identity_10.kind === "topic-char",
        posts_10 = handleAction_134(identity_10),
        value_1005 = (identity_10.id || "") + ":" + (identity_10.handle || identity_10.name || ""),
        fallbackSocialCounts = getDefaultCharSocialCounts({
          id: identity_10.id,
          handle: identity_10.handle,
          name: identity_10.name
        }),
        followersCount_2 = isChar ? normalizeProfileCount(charItem_2.followersCount, fallbackSocialCounts.followersCount) : 1200 + hashPostMetricSeed("followers:" + value_1005) % 198800,
        followingCount_2 = isChar ? normalizeProfileCount(charItem_2.followingCount, fallbackSocialCounts.followingCount) : 80 + hashPostMetricSeed("following:" + value_1005) % 1920,
        coverSeed_2 = safeText(charItem_2?.coverSeed || identity_10.coverSeed, identity_10.id + "-cover"),
        coverUrl = safeText(charItem_2?.coverImage || identity_10.coverImage) || getStableExternalImage(coverSeed_2, 1200, 480),
        fallbackCover = safeText(currentProfile.banner),
        value_1012 = fallbackCover ? ",url('" + escapeHtml(fallbackCover) + "')" : "",
        following_2 = isChar ? charItem_2.isFollowing !== false : identity_10.isFollowing !== false;
      currentProfileIdentity = {
        ...identity_10,
        kind: isChar ? "char" : isTopicChar ? "topic-char" : "account"
      };
      const actionsHtml_2 = isTopicChar ? "" : "\n                <button class=\"x-profile-follow-btn " + (following_2 ? "active" : "") + "\" type=\"button\" data-profile-follow-id=\"" + escapeHtml(identity_10.id) + "\">" + (following_2 ? "已关注" : "关注") + "</button>\n                " + (isChar ? "<button class=\"x-profile-edit\" type=\"button\" data-profile-edit-id=\"" + escapeHtml(identity_10.id) + "\">Edit</button>" : "") + "\n            ",
        profileContentHtml = buildUnifiedProfileContentHtml({
          identity: identity_10,
          posts: posts_10,
          actionsHtml: actionsHtml_2,
          stats: [{
            value: posts_10.length,
            label: "Posts"
          }, {
            value: formatCompactCount(followersCount_2),
            label: "Followers"
          }, {
            value: formatCompactCount(followingCount_2),
            label: "Following"
          }]
        });
      body_2.innerHTML = "\n                <div class=\"x-dm-profile-page-scroll\">\n                    <div class=\"x-profile-cover x-dm-profile-cover\" style=\"background-image:linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.35))" + value_1012 + "\">\n                        <img class=\"x-dm-profile-cover-image\" src=\"" + escapeHtml(coverUrl) + "\" alt=\"\" onerror=\"this.remove()\">\n                        <div class=\"x-profile-cover-actions\">\n                            <button class=\"x-header-button\" id=\"x-dm-profile-back\" type=\"button\" aria-label=\"返回\"><i class=\"fas fa-chevron-left\"></i></button>\n                            " + (isChar ? "<button class=\"x-header-button\" id=\"x-char-profile-generate-btn\" type=\"button\" aria-label=\"生成 Char 主页内容\"><i class=\"fas fa-search\"></i></button>" : "<span></span>") + "\n                        </div>\n                    </div>\n                    <div class=\"x-profile-scroll x-dm-profile-scroll\">\n                        " + profileContentHtml + "\n                    </div>\n                </div>\n            ";
      body_2.querySelectorAll(".x-profile-feed-card").forEach(bindPostCard);
      dmProfileView.classList.add("active");
      dmProfileView.setAttribute("aria-hidden", "false");
    }
    function openDmProfile(dmId_3 = currentDmId) {
      const item_35 = dmId_3 ? getDirectMessageById(dmId_3) : null;
      if (!item_35) return;
      renderIdentityProfile({
        id: item_35.id,
        name: item_35.name,
        handle: item_35.handle,
        avatar: item_35.avatar,
        bio: item_35.bio,
        persona: item_35.persona,
        coverSeed: item_35.coverSeed,
        coverImage: item_35.coverImage,
        isFollowing: item_35.isFollowing,
        kind: "char"
      }, item_35);
    }
    function openAuthorProfile(authorId_4, name_23, handle_8, avatar_4) {
      const identity_11 = resolveXAuthorIdentity(authorId_4, handle_8, name_23, avatar_4);
      if (identity_11.kind === "me") {
        const meIndex = navItems.findIndex(item_36 => item_36.getAttribute("data-target") === "x-me-tab");
        if (meIndex >= 0) switchTab(meIndex);
        return;
      }
      if (identity_11.kind === "char") {
        openDmProfile(identity_11.id);
        return;
      }
      if (identity_11.kind === "topic-char") {
        renderIdentityProfile(identity_11);
        return;
      }
      const account_12 = identity_11.kind === "account" ? identity_11 : registerLightweightAccount(identity_11);
      renderIdentityProfile({
        ...account_12,
        kind: "account"
      });
    }
    function closeDmProfile() {
      releaseFocusBeforeHide(dmProfileView);
      currentProfileIdentity = null;
      dmProfileView?.classList.remove("active");
      dmProfileView?.setAttribute("aria-hidden", "true");
    }
    function toggleProfileFollow(value_1025) {
      const directMessageById_1026 = getDirectMessageById(value_1025);
      if (directMessageById_1026) {
        const handleAction_156_1028 = updateDirectMessage(value_1025, draft_12 => {
          return draft_12.isFollowing = draft_12.isFollowing === false, draft_12;
        });
        if (handleAction_156_1028) openDmProfile(value_1025);
        return;
      }
      let updatedAccount = null;
      updateXState(value_1030 => {
        value_1030.xAccounts = (value_1030.xAccounts || []).map(account_13 => {
          if (String(account_13.id) !== String(value_1025)) return account_13;
          return updatedAccount = {
            ...account_13,
            isFollowing: account_13.isFollowing === false
          }, updatedAccount;
        });
      });
      if (updatedAccount) renderIdentityProfile({
        ...normalizeXAccount(updatedAccount),
        kind: "account"
      });
    }
    function openCharEditSheet(value_1032) {
      const item_37 = getDirectMessageById(value_1032);
      if (!item_37 || !charEditSheet) return;
      currentEditingCharId = String(item_37.id);
      charEditAvatarDraft = item_37.avatar || "";
      coverSeed_3 = item_37.coverSeed || item_37.id + "-cover";
      charEditCoverImageDraft = item_37.coverImage || "";
      const xCharEditNameElement = document.getElementById("x-char-edit-name"),
        handleInput_3 = document.getElementById("x-char-edit-handle"),
        xCharEditBioElement = document.getElementById("x-char-edit-bio"),
        personaInput_3 = document.getElementById("x-char-edit-persona"),
        followingInput = document.getElementById("x-char-edit-following"),
        followersInput = document.getElementById("x-char-edit-followers");
      if (xCharEditNameElement) xCharEditNameElement.value = item_37.name;
      if (handleInput_3) handleInput_3.value = item_37.handle;
      if (xCharEditBioElement) xCharEditBioElement.value = item_37.bio;
      if (personaInput_3) personaInput_3.value = item_37.persona;
      if (followingInput) followingInput.value = String(item_37.followingCount);
      if (followersInput) followersInput.value = String(item_37.followersCount);
      renderImagePreview(document.getElementById("x-char-edit-avatar-preview"), charEditAvatarDraft, item_37.name.slice(0, 1).toUpperCase());
      renderImagePreview(document.getElementById("x-char-edit-cover-preview"), charEditCoverImageDraft || getStableExternalImage(coverSeed_3, 600, 240), "Cover");
      if (typeof window.openView === "function") window.openView(charEditSheet);else charEditSheet.classList.add("active");
    }
    function closeCharEditSheet() {
      currentEditingCharId = null;
      charEditCoverImageDraft = "";
      if (typeof window.closeView === "function") window.closeView(charEditSheet);else charEditSheet?.classList.remove("active");
    }
    function handleAction_139() {
      if (!currentEditingCharId) return;
      const previous_5 = getDirectMessageById(currentEditingCharId),
        name_24 = safeText(document.getElementById("x-char-edit-name")?.value, "Char"),
        followingRaw_2 = String(document.getElementById("x-char-edit-following")?.value ?? "").trim(),
        followersRaw_2 = String(document.getElementById("x-char-edit-followers")?.value ?? "").trim();
      if (followingRaw_2 && (!/^\d+$/.test(followingRaw_2) || Number(followingRaw_2) > Number.MAX_SAFE_INTEGER) || followersRaw_2 && (!/^\d+$/.test(followersRaw_2) || Number(followersRaw_2) > Number.MAX_SAFE_INTEGER)) {
        if (typeof window.showToast === "function") window.showToast("关注数和粉丝数请输入非负整数");
        return;
      }
      const updated = updateDirectMessage(currentEditingCharId, draft_13 => {
          return draft_13.name = name_24, draft_13.handle = makeHandle(name_24, document.getElementById("x-char-edit-handle")?.value), draft_13.bio = safeText(document.getElementById("x-char-edit-bio")?.value, "暂无签名"), draft_13.persona = safeText(document.getElementById("x-char-edit-persona")?.value), draft_13.avatar = charEditAvatarDraft, draft_13.coverSeed = coverSeed_3, draft_13.coverImage = charEditCoverImageDraft, draft_13.followingCount = normalizeProfileCount(followingRaw_2, previous_5?.followingCount || 0), draft_13.followersCount = normalizeProfileCount(followersRaw_2, previous_5?.followersCount || 0), draft_13;
        }),
        value_1039 = currentEditingCharId;
      if (updated) syncCharPostIdentity(updated, previous_5);
      closeCharEditSheet();
      renderDirectMessages();
      renderDmChat();
      renderGeneratedPosts();
      renderSuperFollowBar();
      if (updated) openDmProfile(value_1039);
    }
    function handleAction_140() {
      if (!currentEditingCharId) return;
      coverSeed_3 = currentEditingCharId + "-cover-" + Date.now();
      charEditCoverImageDraft = "";
      renderImagePreview(document.getElementById("x-char-edit-cover-preview"), getStableExternalImage(coverSeed_3, 600, 240), "Cover");
      if (typeof window.showToast === "function") window.showToast("已更换主页背景");
    }
    function getCharProfilePromptFieldValues() {
      return {
        lastPrompt: safeText(document.getElementById("x-char-profile-image-prompt")?.value),
        charAppearance: safeText(document.getElementById("x-char-profile-char-appearance")?.value),
        userAppearance: safeText(document.getElementById("x-char-profile-user-appearance")?.value),
        artistPrompt: safeText(document.getElementById("x-char-profile-artist-prompt")?.value),
        negativePrompt: safeText(document.getElementById("x-char-profile-negative-prompt")?.value)
      };
    }
    function setCharProfilePromptFieldValues(value_1041 = {}) {
      const normalized_5 = normalizeCharProfileImagePromptConfig(value_1041),
        values = {
          "x-char-profile-image-prompt": normalized_5.lastPrompt,
          "x-char-profile-char-appearance": normalized_5.charAppearance,
          "x-char-profile-user-appearance": normalized_5.userAppearance,
          "x-char-profile-artist-prompt": normalized_5.artistPrompt,
          "x-char-profile-negative-prompt": normalized_5.negativePrompt
        };
      Object.entries(values).forEach(([id_10, value_14]) => {
        const field = document.getElementById(id_10);
        if (field) field.value = value_14;
      });
    }
    function renderCharProfilePresetOptions(activePresetId_3 = "") {
      const select = document.getElementById("x-char-profile-image-preset");
      if (!select) return;
      select.innerHTML = "<option value=\"\">当前编辑内容</option>" + charProfilePresetDrafts.map(value_1047 => "<option value=\"" + escapeHtml(value_1047.id) + "\">" + escapeHtml(value_1047.name) + "</option>").join("");
      select.value = charProfilePresetDrafts.some(preset_3 => preset_3.id === activePresetId_3) ? activePresetId_3 : "";
    }
    function handleAction_143() {
      const value_1049 = document.getElementById("x-char-profile-image-toggle")?.checked === true,
        options_7 = document.getElementById("x-char-profile-image-options");
      if (options_7) options_7.hidden = !value_1049;
    }
    function renderCharProfileReferenceDraft() {
      const preview = document.getElementById("x-char-profile-reference-preview"),
        status_2 = document.getElementById("x-char-profile-reference-status"),
        removeButton = document.getElementById("x-char-profile-reference-delete"),
        toggle_2 = document.getElementById("x-char-profile-reference-toggle");
      preview && (preview.innerHTML = charProfileReferenceDraft ? "<img src=\"" + escapeHtml(charProfileReferenceDraft) + "\" alt=\"\">" : "<i class=\"fas fa-user\"></i>");
      if (status_2) status_2.textContent = charProfileReferenceDraft ? charProfileReferenceFileNameDraft || "已上传" : "尚未上传";
      if (removeButton) removeButton.hidden = !charProfileReferenceDraft;
      if (toggle_2) {
        toggle_2.disabled = !charProfileReferenceDraft;
        if (!charProfileReferenceDraft) toggle_2.checked = false;
      }
    }
    async function resolveCharProfileReferenceUrl(item_38) {
      if (item_38?.profileImageFaceReferenceUrl) return item_38.profileImageFaceReferenceUrl;
      if (item_38?.profileImageFaceReferenceAssetId && typeof window.appStorage?.getAssetUrl === "function") return window.appStorage.getAssetUrl(item_38.profileImageFaceReferenceAssetId)["catch"](() => "");
      return "";
    }
    async function openCharProfileGenerateSheet(value_1051) {
      const item_39 = getDirectMessageById(value_1051);
      if (!item_39 || !charProfileGenerateSheet || charProfileGenerationInFlight) return;
      currentGeneratingCharId = String(item_39.id);
      const config_7 = normalizeCharProfileImagePromptConfig(item_39.profileImagePromptConfig);
      charProfilePresetDrafts = config_7.presets.map(preset_4 => ({
        ...preset_4
      }));
      const countInput = document.getElementById("x-char-profile-generate-count"),
        imageToggle = document.getElementById("x-char-profile-image-toggle"),
        referenceToggle = document.getElementById("x-char-profile-reference-toggle"),
        xCharProfilePresetNameElement = document.getElementById("x-char-profile-preset-name");
      if (countInput) countInput.value = "3";
      if (imageToggle) imageToggle.checked = false;
      if (xCharProfilePresetNameElement) xCharProfilePresetNameElement.value = "";
      setCharProfilePromptFieldValues(config_7);
      renderCharProfilePresetOptions(config_7.activePresetId);
      charProfileReferenceDraft = await resolveCharProfileReferenceUrl(item_39);
      charProfileReferenceFileNameDraft = item_39.profileImageFaceReferenceFileName || "";
      charProfileReferenceChanged = false;
      if (referenceToggle) referenceToggle.checked = !!charProfileReferenceDraft && config_7.autoUseReferenceFace;
      renderCharProfileReferenceDraft();
      handleAction_143();
      if (typeof window.openView === "function") window.openView(charProfileGenerateSheet);else charProfileGenerateSheet.classList.add("active");
    }
    function closeCharProfileGenerateSheet() {
      if (charProfileGenerationInFlight) return;
      currentGeneratingCharId = null;
      charProfileReferenceDraft = "";
      charProfileReferenceFileNameDraft = "";
      charProfileReferenceChanged = false;
      charProfilePresetDrafts = [];
      const referenceInput = document.getElementById("x-char-profile-reference-input");
      if (referenceInput) referenceInput.value = "";
      if (typeof window.closeView === "function") window.closeView(charProfileGenerateSheet);else charProfileGenerateSheet?.classList.remove("active");
    }
    function handleAction_146() {
      const xCharProfilePresetNameElement_1056 = document.getElementById("x-char-profile-preset-name"),
        name_25 = safeText(xCharProfilePresetNameElement_1056?.value);
      if (!name_25) {
        if (typeof window.showToast === "function") window.showToast("请输入预设名称");
        xCharProfilePresetNameElement_1056?.focus();
        return;
      }
      const selectedId = String(document.getElementById("x-char-profile-image-preset")?.value || ""),
        values_2 = getCharProfilePromptFieldValues(),
        preset_5 = {
          id: selectedId || makeLocalId("x-char-image-preset"),
          name: name_25,
          prompt: values_2.lastPrompt,
          charAppearance: values_2.charAppearance,
          userAppearance: values_2.userAppearance,
          artistPrompt: values_2.artistPrompt,
          negativePrompt: values_2.negativePrompt
        },
        existingIndex_2 = charProfilePresetDrafts.findIndex(item_40 => item_40.id === preset_5.id);
      if (existingIndex_2 >= 0) charProfilePresetDrafts[existingIndex_2] = preset_5;else charProfilePresetDrafts.push(preset_5);
      renderCharProfilePresetOptions(preset_5.id);
      if (xCharProfilePresetNameElement_1056) xCharProfilePresetNameElement_1056.value = preset_5.name;
    }
    function handleAction_147() {
      const select_2 = document.getElementById("x-char-profile-image-preset"),
        id_11 = String(select_2?.value || "");
      if (!id_11) return;
      charProfilePresetDrafts = charProfilePresetDrafts.filter(preset_6 => preset_6.id !== id_11);
      renderCharProfilePresetOptions("");
      const xCharProfilePresetNameElement_1064 = document.getElementById("x-char-profile-preset-name");
      if (xCharProfilePresetNameElement_1064) xCharProfilePresetNameElement_1064.value = "";
    }
    function applyCharProfilePromptPreset(presetId) {
      const preset_7 = charProfilePresetDrafts.find(item_41 => item_41.id === String(presetId || "")),
        nameInput_4 = document.getElementById("x-char-profile-preset-name");
      if (!preset_7) {
        if (nameInput_4) nameInput_4.value = "";
        return;
      }
      setCharProfilePromptFieldValues({
        lastPrompt: preset_7.prompt,
        charAppearance: preset_7.charAppearance,
        userAppearance: preset_7.userAppearance,
        artistPrompt: preset_7.artistPrompt,
        negativePrompt: preset_7.negativePrompt
      });
      if (nameInput_4) nameInput_4.value = preset_7.name;
    }
    async function handleAction_148() {
      const superUpdateBtn_2 = document.getElementById("x-char-profile-reference-input"),
        file_2 = superUpdateBtn_2?.files?.[0];
      if (!file_2) return;
      superUpdateBtn_2.disabled = true;
      try {
        charProfileReferenceDraft = await compressXImageFile(file_2, {
          maxWidth: 1536,
          maxHeight: 1536,
          quality: 0.9
        });
        charProfileReferenceFileNameDraft = file_2.name || "reference.jpg";
        charProfileReferenceChanged = true;
        const toggle_3 = document.getElementById("x-char-profile-reference-toggle");
        if (toggle_3) toggle_3.checked = true;
        renderCharProfileReferenceDraft();
      } catch (error_10) {
        if (typeof window.showToast === "function") window.showToast(error_10?.message || "参考脸读取失败");
      } finally {
        superUpdateBtn_2.disabled = false;
        superUpdateBtn_2.value = "";
      }
    }
    function removeCharProfileReferenceDraft() {
      charProfileReferenceDraft = "";
      charProfileReferenceFileNameDraft = "";
      charProfileReferenceChanged = true;
      renderCharProfileReferenceDraft();
    }
    function normalizeCharProfilePosts(value_1072, item_42) {
      return (Array.isArray(value_1072) ? value_1072 : []).map((rawPost_4, index_15) => {
        const avatar_5 = handleAction_29(item_42.avatar, "char:" + item_42.id + ":" + (item_42.handle || item_42.name)),
          imageCandidatePrompt_2 = safeText(rawPost_4.imagePrompt || rawPost_4.imageText || rawPost_4.mediaDescription || (Array.isArray(rawPost_4.images) ? rawPost_4.images[0]?.text || rawPost_4.images[0]?.prompt : "")),
          post_39 = normalizeGeneratedPost({
            ...rawPost_4,
            mediaType: "text",
            imagePrompt: "",
            imageText: "",
            images: [],
            authorId: item_42.id,
            authorName: item_42.name,
            handle: item_42.handle,
            authorAvatar: avatar_5,
            profileOwnerId: item_42.id
          }, index_15);
        if (!post_39 || post_39.commentList.length < 10) return null;
        return post_39.avatar = avatar_5, post_39.images = [], post_39.imageCandidate = rawPost_4.imageCandidate === true || safeText(rawPost_4.imageCandidate).toLowerCase() === "true", post_39.imageCandidatePrompt = imageCandidatePrompt_2, ensureCommentDepth(post_39);
      }).filter(Boolean);
    }
    async function requestCharProfilePostBatch(item_43, value_1079, value_1080 = [], value_1081 = false) {
      const recentChat = normalizeDmMessages(item_43.messages).slice(-12).map(serializeDmMessageForAi).join("\n"),
        handleAction_35_1083 = getSelectedWorldBookContext(item_43.name + " " + item_43.bio + " " + item_43.persona + " " + currentProfile.persona, getCharacterBoundWorldBookIds(item_43)),
        content_4 = "Return strict JSON only: {\"posts\":[{\"authorName\":\"\",\"handle\":\"\",\"text\":\"\",\"translation\":\"\",\"likes\":0,\"reposts\":0,\"commentsCount\":10,\"imageCandidate\":false,\"imagePrompt\":\"\",\"comments\":[{\"authorName\":\"\",\"handle\":\"\",\"text\":\"\",\"translation\":\"\",\"replies\":[{\"authorName\":\"\",\"handle\":\"\",\"text\":\"\",\"translation\":\"\"}]}]}]}.\nGenerate exactly " + value_1079 + " new text-first X profile posts written by this Char. Every post MUST contain at least 10 distinct top-level comment objects in comments. Replies do not count toward the 10-comment minimum. Posts must feel like the Char's own public life and remain consistent with their persona, recent private conversation, User relationship and worldbook.\n" + (value_1081 ? "Mark exactly one visually suitable post with imageCandidate:true and provide a detailed Simplified Chinese imagePrompt that directly matches that post. All other posts use imageCandidate:false and imagePrompt:\"\"." : "Every post must use imageCandidate:false and imagePrompt:\"\". Do not create any image entry.") + "\nOnly the named Char may author the posts. All generated commenters and repliers must be non-User accounts; never write a comment or reply as the current User.\nThe Char and commenters may use any language natural to their identity and context. Every post, comment and reply must include translation: Simplified Chinese for non-Chinese originals, or \"\" for Chinese originals. Never return an image URL or external image.\nChar: " + JSON.stringify({
          id: item_43.id,
          name: item_43.name,
          handle: item_43.handle,
          bio: item_43.bio,
          persona: item_43.persona
        }) + "\nUser: " + JSON.stringify({
          name: currentProfile.name,
          handle: currentProfile.handle,
          bio: currentProfile.bio,
          persona: currentProfile.persona
        }) + "\nRecent private chat: " + (recentChat || "None") + "\nDo not repeat these post texts: " + (value_1080.length ? value_1080.join(" | ") : "None") + "\nWorldbook:\n" + (handleAction_35_1083 || "None"),
        raw_16 = await requestXChatCompletion([{
          role: "system",
          content: "Generate strict JSON for a fictional X character profile. Output JSON only."
        }, {
          role: "user",
          content: content_4
        }], {
          temperature: 0.9
        }),
        parsed_5 = parseJsonPayload(raw_16),
        posts_11 = sanitizeApiGeneratedPosts(Array.isArray(parsed_5) ? parsed_5 : Array.isArray(parsed_5?.posts) ? parsed_5.posts : [], {
          forceOuterAuthor: true
        });
      return normalizeCharProfilePosts(posts_11, item_43);
    }
    async function handleAction_151(item_44, profileImagePromptConfig_2) {
      const previousAssetId = safeText(item_44.profileImageFaceReferenceAssetId);
      let profileImageFaceReferenceAssetId_2 = previousAssetId,
        profileImageFaceReferenceUrl_2 = item_44.profileImageFaceReferenceUrl || "";
      if (charProfileReferenceChanged) {
        if (charProfileReferenceDraft) {
          if (!window.appStorage?.saveAssetFromDataUrl) throw new Error("图片存储服务不可用");
          const accountId_5 = safeText(getXState().activeXPlayerAccountId, "legacy").replace(/[^a-z0-9_-]+/gi, "-"),
            charId_3 = String(item_44.id).replace(/[^a-z0-9_-]+/gi, "-");
          profileImageFaceReferenceAssetId_2 = "x_account_" + accountId_5 + "_char_" + charId_3 + "_profile_face";
          await window.appStorage.saveAssetFromDataUrl(profileImageFaceReferenceAssetId_2, charProfileReferenceDraft, {
            ownerType: "x_char_profile_face",
            ownerId: String(item_44.id),
            accountId: accountId_5,
            fileName: charProfileReferenceFileNameDraft
          });
          profileImageFaceReferenceUrl_2 = "";
        } else {
          profileImageFaceReferenceAssetId_2 = "";
          profileImageFaceReferenceUrl_2 = "";
        }
      }
      const updated_2 = updateDirectMessage(item_44.id, draft_14 => {
        return draft_14.profileImagePromptConfig = profileImagePromptConfig_2, draft_14.profileImageFaceReferenceAssetId = profileImageFaceReferenceAssetId_2, draft_14.profileImageFaceReferenceUrl = profileImageFaceReferenceUrl_2, draft_14.profileImageFaceReferenceFileName = charProfileReferenceDraft ? charProfileReferenceFileNameDraft : "", draft_14;
      });
      if (!updated_2) throw new Error("Char 生图配置保存失败");
      return previousAssetId && previousAssetId !== profileImageFaceReferenceAssetId_2 && (await window.appStorage?.deleteAsset?.(previousAssetId)["catch"](() => undefined)), updated_2;
    }
    async function handleAction_152() {
      if (charProfileGenerationInFlight || !currentGeneratingCharId) return;
      const item_45 = getDirectMessageById(currentGeneratingCharId),
        xCharProfileGenerateRunBtnElement = document.getElementById("x-char-profile-generate-run-btn"),
        countInput_2 = document.getElementById("x-char-profile-generate-count");
      if (!item_45 || !xCharProfileGenerateRunBtnElement) return;
      const requestedCount = Math.min(10, Math.max(1, Number.parseInt(countInput_2?.value, 10) || 3));
      if (countInput_2) countInput_2.value = String(requestedCount);
      const imageEnabled = document.getElementById("x-char-profile-image-toggle")?.checked === true,
        activePresetId_4 = String(document.getElementById("x-char-profile-image-preset")?.value || ""),
        promptFields = getCharProfilePromptFieldValues(),
        promptConfig = normalizeCharProfileImagePromptConfig({
          ...promptFields,
          presets: charProfilePresetDrafts,
          activePresetId: activePresetId_4,
          autoUseReferenceFace: imageEnabled && document.getElementById("x-char-profile-reference-toggle")?.checked === true
        });
      charProfileGenerationInFlight = true;
      xCharProfileGenerateRunBtnElement.disabled = true;
      xCharProfileGenerateRunBtnElement.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i> 生成中";
      let completed = false;
      try {
        const collected = [],
          existingTexts = (item_45.profilePosts || []).map(post_40 => safeText(post_40.text)).filter(Boolean),
          value_1106 = new Set(existingTexts.map(text_13 => text_13.toLocaleLowerCase())),
          addPosts = items_1114 => items_1114.forEach(post_41 => {
            const toLocaleLowerCase_1116 = post_41.text.toLocaleLowerCase();
            collected.length < requestedCount && !value_1106.has(toLocaleLowerCase_1116) && (value_1106.add(toLocaleLowerCase_1116), collected.push(post_41));
          }),
          maxAttempts = Math.ceil(requestedCount / 3) + 3;
        let attempt = 0;
        while (collected.length < requestedCount && attempt < maxAttempts) {
          const batchCount = Math.min(3, requestedCount - collected.length);
          addPosts(await requestCharProfilePostBatch(item_45, batchCount, [...existingTexts, ...collected.map(post_42 => post_42.text)], imageEnabled && attempt === 0));
          attempt += 1;
        }
        if (collected.length !== requestedCount || collected.some(post_43 => post_43.commentList.length < 10)) throw new Error("Insufficient Char profile content");
        let generatedImage = null,
          value_1111 = null;
        if (imageEnabled) {
          const targetPost = collected.find(post_44 => post_44.imageCandidate) || collected[0],
            postPrompt = safeText(targetPost.imageCandidatePrompt, targetPost.text),
            finalPrompt = [postPrompt, promptConfig.lastPrompt].filter(Boolean).join("\n");
          try {
            if (!window.u2ImageGeneration?.generate) throw new Error("生图功能尚未加载，请刷新后重试");
            generatedImage = await window.u2ImageGeneration.generate(finalPrompt, {
              referenceImage: promptConfig.autoUseReferenceFace ? charProfileReferenceDraft : "",
              charAppearance: promptConfig.charAppearance,
              userAppearance: promptConfig.userAppearance,
              artistPrompt: promptConfig.artistPrompt,
              negativePrompt: promptConfig.negativePrompt
            });
            targetPost.images = [{
              id: targetPost.id + "-image-0",
              text: postPrompt,
              url: generatedImage.imageUrl,
              imageSource: "generated",
              imageProvider: generatedImage.provider || "",
              imageModel: generatedImage.model || "",
              imageSize: generatedImage.size || "",
              faceReferenceUsed: !!generatedImage.faceReferenceUsed
            }];
          } catch (error_11) {
            value_1111 = error_11;
            console.warn("[X] Char profile image generation failed", error_11);
          }
        }
        collected.forEach(post_45 => {
          delete post_45.imageCandidate;
          delete post_45.imageCandidatePrompt;
        });
        const latestItem = await handleAction_151(item_45, promptConfig);
        updateXState(draft_15 => {
          draft_15.xGeneratedPosts = prependUniquePosts(draft_15.xGeneratedPosts || [], collected);
          draft_15.xDirectMessages = (draft_15.xDirectMessages || []).map(entry_6 => {
            if (String(entry_6.id) !== String(item_45.id)) return entry_6;
            const normalized_6 = normalizeDmChar(entry_6, entry_6.origin || "manual");
            return {
              ...normalized_6,
              profileImagePromptConfig: latestItem.profileImagePromptConfig,
              profileImageFaceReferenceAssetId: latestItem.profileImageFaceReferenceAssetId,
              profileImageFaceReferenceUrl: latestItem.profileImageFaceReferenceUrl,
              profileImageFaceReferenceFileName: latestItem.profileImageFaceReferenceFileName,
              profilePosts: prependUniquePosts(normalized_6.profilePosts || [], collected),
              profileGeneratedAt: Date.now()
            };
          });
        });
        await flushXStateNow("x-char-profile-generation");
        renderGeneratedPosts(getXState(), {
          force: true
        });
        openDmProfile(item_45.id);
        completed = true;
        typeof window.showToast === "function" && window.showToast(value_1111 ? "已生成 " + collected.length + " 条帖子；" + (value_1111?.message || "生图失败，已保留文字帖") : "已生成 " + collected.length + " 条帖子" + (generatedImage ? "和 1 张图片" : ""));
      } catch (error_12) {
        console.error("[X] Generate Char profile failed", error_12);
        if (!window.u2Api?.isRequestError?.(error_12) || !window.u2Api.reportError(error_12, {
          operation: "主页生成"
        })) {
          if (typeof window.showToast === "function") window.showToast("主页生成失败，未修改现有内容");
        }
      } finally {
        charProfileGenerationInFlight = false;
        const superUpdateBtn_3 = document.getElementById("x-char-profile-generate-run-btn");
        superUpdateBtn_3 && (superUpdateBtn_3.disabled = false, superUpdateBtn_3.textContent = "生成");
      }
      if (completed) closeCharProfileGenerateSheet();
    }
    function showXConfirm(options_8 = {}) {
      if (typeof window.showCustomModal === "function") {
        window.showCustomModal(options_8);
        return;
      }
      window.confirm(options_8.message || options_8.title || "Confirm?") && options_8.onConfirm?.();
    }
    function openDmSettingsSheet() {
      if (!currentDmId || !getDirectMessageById(currentDmId)) return;
      renderDmSettingsImessageContext();
      if (typeof window.openView === "function") window.openView(dmSettingsSheet);else dmSettingsSheet?.classList.add("active");
    }
    function closeDmSettingsSheet() {
      if (typeof window.closeView === "function") window.closeView(dmSettingsSheet);else dmSettingsSheet?.classList.remove("active");
    }
    function renderDmSettingsImessageContext() {
      const section = document.getElementById("x-dm-imessage-context-settings"),
        enabledInput = document.getElementById("x-dm-imessage-context-enabled"),
        limitInput = document.getElementById("x-dm-imessage-context-limit"),
        sourceLabel = document.getElementById("x-dm-imessage-context-source"),
        item_46 = currentDmId ? getDirectMessageById(currentDmId) : null,
        linkedChar = getLinkedImessageCharForDm(item_46);
      if (!section || !enabledInput || !limitInput) return;
      if (!item_46 || !linkedChar) {
        section.hidden = true;
        return;
      }
      const mount_3 = normalizeImessageContextMount(item_46.imessageContextMount);
      section.hidden = false;
      enabledInput.checked = mount_3.enabled;
      limitInput.value = String(mount_3.limit);
      sourceLabel && (sourceLabel.textContent = "生成回复时引用 " + (linkedChar.nickname || linkedChar.realName || item_46.name) + " 的 iMessage 单聊");
    }
    function updateCurrentDmImessageContext(patch = {}) {
      const item_47 = currentDmId ? getDirectMessageById(currentDmId) : null;
      if (!item_47 || !getLinkedImessageCharForDm(item_47)) return null;
      const imessageContextMount_2 = normalizeImessageContextMount({
          ...item_47.imessageContextMount,
          ...patch
        }),
        handleAction_156_1138 = updateDirectMessage(item_47.id, draft_16 => {
          return draft_16.imessageContextMount = imessageContextMount_2, draft_16;
        });
      return renderDmSettingsImessageContext(), handleAction_156_1138;
    }
    function handleAction_154() {
      const value_1140 = currentDmId ? getDirectMessageById(currentDmId) : null;
      if (!value_1140) return;
      showXConfirm({
        title: "清空聊天记录",
        message: "确定清空与 " + value_1140.name + " 的聊天记录吗？此操作不可恢复。",
        confirmText: "清空",
        isDestructive: true,
        onConfirm: () => {
          updateDirectMessage(value_1140.id, value_1141 => {
            return value_1141.messages = [], value_1141;
          });
          closeDmSettingsSheet();
          renderDirectMessages();
          renderDmChat();
          if (typeof window.showToast === "function") window.showToast("已清空聊天记录");
        }
      });
    }
    function handleAction_155() {
      const item_48 = currentDmId ? getDirectMessageById(currentDmId) : null;
      if (!item_48) return;
      showXConfirm({
        title: "删除会话",
        message: "确定删除与 " + item_48.name + " 的私信会话吗？此操作不可恢复。",
        confirmText: "删除",
        isDestructive: true,
        onConfirm: () => {
          updateXState(draft_17 => {
            draft_17.xDirectMessages = (draft_17.xDirectMessages || []).filter(entry_7 => String(entry_7.id) !== String(item_48.id));
          });
          closeDmSettingsSheet();
          closeDmProfile();
          closeDmChat();
          renderDirectMessages();
          if (typeof window.showToast === "function") window.showToast("已删除会话");
        }
      });
    }
    function updateDirectMessage(value_1145, updater) {
      let value_1147 = null;
      return updateXState(value_1148 => {
        value_1148.xDirectMessages = (value_1148.xDirectMessages || []).map(value_1149 => {
          if (String(value_1149.id) !== String(value_1145)) return value_1149;
          const normalized_7 = normalizeDmChar(value_1149, value_1149.origin || "manual"),
            next = updater({
              ...normalized_7,
              messages: [...normalized_7.messages]
            }) || normalized_7;
          return value_1147 = next, next;
        });
      }), value_1147;
    }
    function syncCharPostIdentity(char_17, value_1153 = {}) {
      if (!char_17) return;
      const charId_4 = String(char_17.id || ""),
        currentHandle = canonicalAccountHandle(char_17.handle, char_17.name),
        previousHandle = canonicalAccountHandle(value_1153?.handle, value_1153?.name),
        avatar_6 = handleAction_29(char_17.avatar, "char:" + charId_4 + ":" + (char_17.handle || char_17.name)),
        matchesChar = (post_46 = {}) => {
          if (charId_4 && String(post_46.authorId || post_46.accountId || "") === charId_4) return true;
          const postHandle = canonicalAccountHandle(post_46.handle || post_46.authorHandle, post_46.name || post_46.authorName);
          return Boolean(postHandle && (postHandle === currentHandle || postHandle === previousHandle));
        },
        applyIdentity = (post_47 = {}, force_2 = false) => {
          const refPost_2 = post_47.refPost ? applyIdentity(post_47.refPost) : post_47.refPost;
          if (!force_2 && !matchesChar(post_47)) return refPost_2 === post_47.refPost ? post_47 : {
            ...post_47,
            refPost: refPost_2
          };
          return {
            ...post_47,
            refPost: refPost_2,
            authorId: charId_4,
            authorName: char_17.name,
            name: char_17.name,
            handle: char_17.handle,
            authorAvatar: avatar_6,
            avatar: avatar_6
          };
        };
      updateXState(draft_18 => {
        draft_18.xGeneratedPosts = (draft_18.xGeneratedPosts || []).map(post_48 => applyIdentity(post_48));
        draft_18.xDirectMessages = (draft_18.xDirectMessages || []).map(item_49 => ({
          ...item_49,
          profilePosts: String(item_49.id) === charId_4 ? (item_49.profilePosts || []).map(post_49 => applyIdentity(post_49, true)) : (item_49.profilePosts || []).map(post_50 => applyIdentity(post_50)),
          messages: (item_49.messages || []).map(message_9 => ({
            ...message_9,
            postSnapshot: message_9.postSnapshot ? applyIdentity(message_9.postSnapshot) : message_9.postSnapshot
          }))
        }));
      });
      Object.keys(postData).forEach(postId_7 => {
        const refreshed = applyIdentity(postData[postId_7]);
        if (refreshed !== postData[postId_7]) postData[postId_7] = refreshed;
      });
    }
    function appendDmMessage(dmId_4, source_11, value_1170, translation_3 = "") {
      const text_14 = safeText(value_1170);
      if (!text_14) return null;
      const value_1173 = source_11 !== "user",
        isOpenConversation = value_1173 && String(currentDmId || "") === String(dmId_4) && element_15?.classList.contains("active"),
        message_10 = {
          id: makeLocalId("dm-msg"),
          source: source_11 === "user" ? "user" : "char",
          text: text_14,
          translation: safeText(translation_3),
          createdAt: Date.now()
        };
      return updateDirectMessage(dmId_4, item_50 => {
        item_50.messages.push(message_10);
        if (isOpenConversation) item_50.lastReadAt = message_10.createdAt;
        return item_50;
      }), renderDirectMessages(), renderDmChat(), message_10;
    }
    function appendDmMessageBatch(dmId_5, value_1177, value_1178 = []) {
      const value_1179 = value_1177 !== "user",
        isOpenConversation_2 = value_1179 && String(currentDmId || "") === String(dmId_5) && element_15?.classList.contains("active"),
        now_1181 = Date.now(),
        messages_6 = (Array.isArray(value_1178) ? value_1178 : []).map((entry_8, value_1184) => {
          const text_15 = safeText(entry_8?.text || entry_8?.content || entry_8?.message);
          if (!text_15) return null;
          return {
            id: makeLocalId("dm-msg-" + value_1184),
            source: value_1177 === "user" ? "user" : "char",
            text: text_15,
            translation: getGeneratedTranslation(entry_8, text_15),
            createdAt: now_1181 + value_1184
          };
        }).filter(Boolean);
      if (!messages_6.length) return [];
      return updateDirectMessage(dmId_5, item_51 => {
        item_51.messages.push(...messages_6);
        if (isOpenConversation_2) item_51.lastReadAt = messages_6[messages_6.length - 1].createdAt;
        return item_51;
      }), renderDirectMessages(), renderDmChat(), messages_6;
    }
    function appendDmPostCard(dmId_6, postSnapshot_2) {
      const message_11 = {
        id: makeLocalId("dm-post"),
        source: "user",
        type: "post-card",
        text: "[转发帖子]",
        postSnapshot: normalizePostSnapshot(postSnapshot_2),
        createdAt: Date.now()
      };
      updateDirectMessage(dmId_6, value_1190 => {
        return value_1190.messages.push(message_11), value_1190;
      });
      renderDirectMessages();
      if (currentDmId && String(currentDmId) === String(dmId_6)) renderDmChat();
      return message_11;
    }
    function createPostSnapshot(postId_8) {
      const post_51 = postData[postId_8];
      if (!post_51) return null;
      const thread_8 = getPostThread(postId_8);
      return normalizePostSnapshot({
        id: postId_8,
        authorId: post_51.authorId,
        name: post_51.name,
        handle: post_51.handle,
        avatar: post_51.avatar,
        text: post_51.text,
        topicTag: post_51.topicTag,
        images: getPostImages(post_51).map(image_8 => ({
          ...image_8
        })),
        comments: (thread_8.comments || []).map(comment_8 => ({
          ...comment_8,
          replies: (comment_8.replies || []).map(reply_10 => ({
            ...reply_10
          }))
        }))
      });
    }
    function openPostForwardSheet(value_1197) {
      const postSnapshot_1198 = createPostSnapshot(value_1197),
        list_3 = document.getElementById("x-post-forward-list");
      if (!postSnapshot_1198 || !list_3 || !postForwardSheet) return;
      currentForwardPostId = String(value_1197);
      const recipients = (getXState().xDirectMessages || []).map(item_52 => normalizeDmChar(item_52, item_52?.origin || "manual")).filter(item_53 => item_53.isFollowing === true);
      list_3.innerHTML = recipients.length ? recipients.map(contact_1202 => "\n                    <button class=\"x-post-forward-recipient\" type=\"button\" data-forward-dm-id=\"" + escapeHtml(contact_1202.id) + "\">\n                        <span class=\"x-avatar\">" + buildAvatarHtml(contact_1202.avatar, contact_1202.name) + "</span>\n                        <span><strong>" + escapeHtml(contact_1202.name) + "</strong><small>" + escapeHtml(contact_1202.handle || "@char") + "</small></span>\n                        <i class=\"fas fa-paper-plane\"></i>\n                    </button>\n                ").join("") : "<div class=\"x-empty-state\">暂无已关注的 Char，请先进入 Char 主页关注。</div>";
      if (typeof window.openView === "function") window.openView(postForwardSheet);else postForwardSheet.classList.add("active");
    }
    function closePostForwardSheet() {
      currentForwardPostId = null;
      if (typeof window.closeView === "function") window.closeView(postForwardSheet);else postForwardSheet?.classList.remove("active");
    }
    function forwardPostToDm(value_1203) {
      const value_1204 = currentForwardPostId,
        recipient = getDirectMessageById(value_1203),
        snapshot_2 = value_1204 ? createPostSnapshot(value_1204) : null;
      if (!recipient || !snapshot_2) return;
      appendDmPostCard(recipient.id, snapshot_2);
      const thread_9 = getPostThread(value_1204);
      thread_9.reposts = Math.max(0, Number(thread_9.reposts) || 0) + 1;
      thread_9.reposted = true;
      savePostThread(value_1204, thread_9);
      updatePostCountNodes(value_1204, thread_9);
      closePostForwardSheet();
      postDetailView?.classList.contains("active") && String(currentDetailPostId) === String(value_1204) && openPostDetail(value_1204);
      if (typeof window.showToast === "function") window.showToast("已转发给 " + recipient.name);
    }
    function serializeDmMessageForAi(value_1208) {
      if (value_1208?.type !== "post-card") return (value_1208?.source === "user" ? currentProfile.name : "Char") + ": " + safeText(value_1208?.text);
      const postSnapshot_1209 = normalizePostSnapshot(value_1208.postSnapshot),
        contextLines = [];
      for (const value_1212 of postSnapshot_1209.comments) {
        if (contextLines.length >= 20) break;
        contextLines.push(value_1212.name + ": " + value_1212.text);
        for (const value_1213 of value_1212.replies) {
          if (contextLines.length >= 20) break;
          contextLines.push("↳ " + value_1213.name + ": " + value_1213.text);
        }
      }
      const comments_4 = contextLines.join("\n");
      return currentProfile.name + " 转发了一条帖子：\n作者：" + postSnapshot_1209.name + " " + postSnapshot_1209.handle + "\n正文：" + postSnapshot_1209.text + "\n话题：" + (postSnapshot_1209.topicTag || "无") + "\n评论：\n" + (comments_4 || "暂无评论");
    }
    function handleAction_163(value_1214) {
      const post_52 = normalizePostSnapshot(value_1214.postSnapshot),
        value_1216 = post_52.images[0];
      return "\n                <div class=\"x-dm-post-card\" data-shared-post-id=\"" + escapeHtml(post_52.id) + "\">\n                    <div class=\"x-dm-post-card-author\">\n                        <span class=\"x-avatar\">" + buildAvatarHtml(post_52.avatar, post_52.name) + "</span>\n                        <span><strong>" + escapeHtml(post_52.name) + "</strong><small>" + escapeHtml(post_52.handle) + "</small></span>\n                    </div>\n                    <p>" + renderPostTextHtml({
        ...post_52,
        text: post_52.text || "分享了一条帖子"
      }) + "</p>\n                    " + (value_1216 ? "<img src=\"" + escapeHtml(value_1216.url) + "\" alt=\"\" onerror=\"this.remove()\">" : "") + "\n                    <span class=\"x-dm-post-card-label\"><i class=\"fab fa-x-twitter\"></i> X Post</span>\n                </div>\n            ";
    }
    function openDmChat(value_1217) {
      currentDmId = String(value_1217);
      updateDirectMessage(currentDmId, item_54 => {
        return item_54.lastReadAt = Math.max(Number(item_54.lastReadAt) || 0, getDmLatestIncomingAt(item_54)), item_54;
      });
      renderDirectMessages();
      renderDmChat();
      element_15?.classList.add("active");
      element_15?.setAttribute("aria-hidden", "false");
    }
    function closeDmChat() {
      const value_1219 = currentDmId,
        value_1220 = value_1219 ? ".x-dm-row[data-dm-id=\"" + escapeCssIdent(value_1219) + "\"]" : "";
      releaseFocusBeforeHide(element_15, value_1220);
      currentDmId = null;
      element_15?.classList.remove("active");
      element_15?.setAttribute("aria-hidden", "true");
    }
    function renderDmChat() {
      const item_55 = currentDmId ? getDirectMessageById(currentDmId) : null;
      if (!item_55 || !element_15) return;
      const avatarEl_2 = document.getElementById("x-dm-chat-avatar"),
        nameEl = document.getElementById("x-dm-chat-name"),
        handleEl = document.getElementById("x-dm-chat-handle"),
        messages_7 = normalizeDmMessages(item_55.messages);
      if (avatarEl_2) avatarEl_2.innerHTML = buildAvatarHtml(item_55.avatar, item_55.name);
      if (nameEl) nameEl.textContent = item_55.name;
      if (handleEl) handleEl.textContent = item_55.handle || "@char";
      if (element_16) {
        const handleAction_133_1223 = handleAction_133(item_55),
          value_1224 = messages_7.length ? "<time class=\"x-dm-time-divider\" datetime=\"" + escapeHtml(new Date(messages_7[0].createdAt).toISOString()) + "\">" + escapeHtml(formatDmTimestamp(messages_7[0].createdAt)) + "</time>" : "";
        element_16.innerHTML = messages_7.length ? "" + handleAction_133_1223 + value_1224 + messages_7.map(value_1225 => "\n                        <div class=\"x-dm-chat-bubble-row " + (value_1225.source === "user" ? "user" : "char") + " " + (value_1225.type === "post-card" ? "post-card" : "") + "\">\n                            " + (value_1225.type === "post-card" ? handleAction_163(value_1225) : value_1225.translation ? "<button class=\"x-dm-chat-bubble x-dm-translation-bubble\" type=\"button\" aria-expanded=\"false\" title=\"点击展开翻译\"><span class=\"x-dm-original-text\">" + escapeHtml(value_1225.text) + "</span><span class=\"x-dm-expanded-translation\" hidden>" + escapeHtml(value_1225.translation) + "</span></button>" : "<div class=\"x-dm-chat-bubble\">" + escapeHtml(value_1225.text) + "</div>") + "\n                        </div>\n                    ").join("") : handleAction_133_1223 + "<div class=\"x-dm-chat-empty\">暂无消息</div>";
        element_16.scrollTop = element_16.scrollHeight;
      }
    }
    function onSend_2() {
      if (!currentDmId || !dmChatInput) return;
      const text_16 = safeText(dmChatInput.value);
      if (!text_16) {
        if (typeof window.showToast === "function") window.showToast("请输入消息内容");
        return;
      }
      dmChatInput.value = "";
      appendDmMessage(currentDmId, "user", text_16);
    }
    async function handleAction_166() {
      if (!currentDmId) return;
      const requestedDmId = String(currentDmId),
        directMessageById_1228 = getDirectMessageById(requestedDmId);
      if (!directMessageById_1228) return;
      const apiBtn = document.getElementById("x-dm-chat-api-btn");
      apiBtn?.classList.add("loading");
      apiBtn?.setAttribute("disabled", "true");
      try {
        const value_1229 = await handleAction_122(directMessageById_1228),
          join_1230 = normalizeDmMessages(directMessageById_1228.messages).slice(-12).map(value_1236 => value_1236.type === "post-card" ? serializeDmMessageForAi(value_1236) : (value_1236.source === "user" ? currentProfile.name : directMessageById_1228.name) + ": " + value_1236.text).join("\n"),
          handleAction_35_1231 = getSelectedWorldBookContext(directMessageById_1228.name + " " + directMessageById_1228.bio + " " + currentProfile.persona, getCharacterBoundWorldBookIds(directMessageById_1228)),
          value_1232 = await requestXChatCompletion([{
            role: "system",
            content: "You are generating an incoming direct-message reply in the X app. This is a one-to-one private conversation between the named Char and the human-controlled User account. Reply only as the named X private-message Char, never as the User. Return strict JSON only: {\"messages\":[{\"text\":\"\",\"translation\":\"\"}]}."
          }, {
            role: "user",
            content: "Character: " + directMessageById_1228.name + " " + (directMessageById_1228.handle || "") + "\nPersona: " + (directMessageById_1228.persona || "ordinary user") + "\nBio/signature: " + (directMessageById_1228.bio || "") + "\nUser profile: " + currentProfile.name + " " + currentProfile.handle + "\nUser persona: " + (currentProfile.persona || currentProfile.bio || "") + "\nConversation channel: this is a private one-to-one X app direct message between this Character and User.\nWorldbook:\n" + (handleAction_35_1231 || "None") + "\niMessage single-chat continuity:\n" + (value_1229 || "None") + "\nRecent chat:\n" + (join_1230 || "No previous chat.") + "\nGenerate between 3 and 8 natural incoming private-message bubbles from this Character.\nRules:\n- The messages array MUST contain 3 to 8 objects, inclusive.\n- Every message is authored by the Character. Never generate a message, action, narration or reply authored by the User.\n- Write one coherent conversational burst: each bubble should advance the thought or reaction, without repeating the same sentence.\n- Keep individual bubbles concise and realistic. Splitting a longer thought across multiple bubbles is encouraged.\n- Continue naturally from the most recent chat and respond to concrete details. If the latest context contains a forwarded post, react specifically to that post.\n- Do not prefix messages with a name, handle, role label or quotation marks. Do not include markdown or text outside the JSON object.\n- Each message object must contain text and translation. If text is not Simplified Chinese, translation must be an accurate Simplified Chinese translation; otherwise translation must be an empty string."
          }], {
            temperature: 0.85
          }),
          parsed_6 = parseJsonPayload(value_1232),
          rawReplies_2 = Array.isArray(parsed_6) ? parsed_6 : Array.isArray(parsed_6?.messages) ? parsed_6.messages : Array.isArray(parsed_6?.replies) ? parsed_6.replies : parsed_6?.text ? [parsed_6] : [],
          replies_3 = rawReplies_2.map(reply_11 => ({
            text: safeText(reply_11?.text || reply_11?.content || reply_11?.message),
            translation: getGeneratedTranslation(reply_11, reply_11?.text || reply_11?.content || reply_11?.message)
          })).filter(reply_12 => reply_12.text).slice(0, 8);
        if (replies_3.length < 3) throw new Error("DM reply batch must contain at least 3 messages");
        appendDmMessageBatch(requestedDmId, "char", replies_3);
      } catch (error_13) {
        console.error("[X] DM API reply failed", error_13);
        if (!window.u2Api?.isRequestError?.(error_13) || !window.u2Api.reportError(error_13, {
          operation: "私信回复生成"
        })) {
          if (typeof window.showToast === "function") window.showToast("API 调用失败，请稍后重试");
        }
      } finally {
        apiBtn?.classList.remove("loading");
        apiBtn?.removeAttribute("disabled");
      }
    }
    function openImagePreview(text_18, src_9 = "") {
      if (!imagePreviewOverlay) return;
      const textEl_2 = document.getElementById("x-image-preview-text"),
        imgEl = document.getElementById("x-image-preview-img");
      if (textEl_2) textEl_2.textContent = safeText(text_18, "Image");
      imgEl && (src_9 ? (imgEl.src = src_9, imgEl.style.display = "block") : (imgEl.removeAttribute("src"), imgEl.style.display = "none"));
      imagePreviewOverlay.classList.add("active");
      imagePreviewOverlay.setAttribute("aria-hidden", "false");
    }
    function closeImagePreview() {
      imagePreviewOverlay?.classList.remove("active");
      imagePreviewOverlay?.setAttribute("aria-hidden", "true");
    }
    function openPostSettingsSheet(postId_9) {
      currentActionPostId = postId_9;
      if (typeof window.openView === "function") window.openView(postSettingsSheet);else postSettingsSheet?.classList.add("active");
    }
    function closePostSettingsSheet() {
      if (typeof window.closeView === "function") window.closeView(postSettingsSheet);else postSettingsSheet?.classList.remove("active");
      setTimeout(() => {
        currentActionPostId = null;
      }, 300);
    }
    async function deleteXPost(postId_10) {
      const previousState = getXState();
      updateXState(draft_19 => {
        draft_19.xGeneratedPosts = (draft_19.xGeneratedPosts || []).filter(post_53 => String(post_53?.id) !== String(postId_10));
        draft_19.xDirectMessages = (draft_19.xDirectMessages || []).map(item_56 => ({
          ...item_56,
          profilePosts: (item_56.profilePosts || []).filter(post_54 => String(post_54?.id) !== String(postId_10))
        }));
        delete draft_19.xPostThreads[String(postId_10)];
      });
      delete postData[postId_10];
      const durable_3 = await flushXStateNow("x-post-delete");
      if (!durable_3) {
        saveXState(previousState);
        renderGeneratedPosts();
        if (typeof window.showToast === "function") window.showToast("帖子删除未保存，请重试");
        return false;
      }
      const cards = view.querySelectorAll(".x-feed-card[data-post-id=\"" + escapeCssIdent(postId_10) + "\"]");
      cards.forEach(card_5 => {
        card_5.style.opacity = "0";
        card_5.style.transform = "scale(0.95)";
        card_5.style.transition = "all 0.2s ease";
        setTimeout(() => card_5.remove(), 200);
      });
      closePostSettingsSheet();
      currentDetailPostId === postId_10 && closePostDetail();
      if (typeof window.showToast === "function") window.showToast("帖子已删除");
      return true;
    }
    function deleteTargetPost() {
      if (!currentActionPostId) return;
      const postId_11 = currentActionPostId;
      showXConfirm({
        title: "删除帖子",
        message: "确定要删除这条帖子吗？此操作不可恢复。",
        confirmText: "删除",
        isDestructive: true,
        onConfirm: () => {
          void deleteXPost(postId_11);
        }
      });
    }
    function prependUniquePosts(value_1253, value_1254) {
      const seen_5 = new Set();
      return [...(value_1254 || []), ...(value_1253 || [])].filter(char_18 => {
        if (!char_18) return false;
        const key_7 = String(char_18.id || "");
        if (!key_7 || seen_5.has(key_7)) return false;
        return seen_5.add(key_7), true;
      });
    }
    function openSearchGenerateSheet(mode_6 = "home") {
      searchGenerateMode = mode_6 === "discover" ? "discover" : "home";
      if (searchGenerateInput) searchGenerateInput.value = "";
      const title_4 = document.getElementById("x-search-generate-title"),
        label_4 = document.getElementById("x-search-generate-label"),
        runBtn = document.getElementById("x-search-generate-run-btn");
      if (searchGenerateMode === "discover") {
        if (title_4) title_4.textContent = "生成热搜";
        if (label_4) label_4.textContent = "想搜索什么";
        if (searchGenerateInput) searchGenerateInput.placeholder = "可留空，留空时随机生成热搜";
        if (runBtn) runBtn.textContent = "生成";
      } else {
        if (title_4) title_4.textContent = "搜索/生成帖子";
        if (label_4) label_4.textContent = "生成方向";
        if (searchGenerateInput) searchGenerateInput.placeholder = "可留空，或输入想生成的帖子主题";
        if (runBtn) runBtn.textContent = "Generate";
      }
      if (typeof window.openView === "function") window.openView(searchGenerateSheet);else searchGenerateSheet?.classList.add("active");
    }
    function closeSearchGenerateSheet() {
      if (typeof window.closeView === "function") window.closeView(searchGenerateSheet);else searchGenerateSheet?.classList.remove("active");
    }
    function normalizeDiscoverTrendEntries(payload_2) {
      const items_1260 = Array.isArray(payload_2) ? payload_2 : Array.isArray(payload_2?.trends) ? payload_2.trends : [];
      return items_1260.map((rawTrend, value_1262) => {
        const trend_4 = handleAction_45(rawTrend, value_1262);
        if (!trend_4) return null;
        const rawPosts_4 = sanitizeApiGeneratedPosts(Array.isArray(rawTrend?.posts) ? rawTrend.posts : []),
          posts_12 = rawPosts_4.slice(0, 3).map((rawPost, postIndex) => normalizeGeneratedPost({
            ...rawPost,
            topicTag: trend_4.title
          }, postIndex)).filter(Boolean).map(value_1266 => {
            return value_1266.topicTag = trend_4.title, ensureCommentDepth(value_1266);
          });
        if (posts_12.length < 1 || posts_12.length > 3) return null;
        return {
          trend: trend_4,
          posts: posts_12
        };
      }).filter(Boolean);
    }
    async function requestDiscoverTrendBatch(value_1267, value_1268, value_1269 = []) {
      const handleAction_35_1270 = getSelectedWorldBookContext(value_1267 + " " + currentProfile.bio + " " + currentProfile.persona),
        handleAction_51_1271 = handleAction_51(),
        content_5 = "Return strict JSON only in this shape: {\"trends\":[{\"title\":\"#Topic\",\"translation\":\"\",\"category\":\"Category · Trending\",\"heat\":\"12.3K\",\"posts\":[{\"authorName\":\"\",\"handle\":\"\",\"text\":\"\",\"translation\":\"\",\"likes\":0,\"reposts\":0,\"commentsCount\":0,\"mediaType\":\"text\",\"comments\":[{\"authorName\":\"\",\"handle\":\"\",\"text\":\"\",\"translation\":\"\"}]}]}]}.\nGenerate exactly " + value_1268 + " unique realistic global X hot-search topics. Each trend MUST contain 1 to 3 directly related posts. Do not return a trend without a valid post.\nThe current User is context only. Every generated post, comment and reply must use a non-User author.\nUse varied regions, languages, categories, account types, viewpoints and plausible heat values. Authors should use their natural language. Every non-Chinese post, comment and reply must include an accurate Simplified Chinese translation; Chinese originals use \"\". Avoid generic filler.\nSearch intent: " + (value_1267 || "随机发现内容") + "\nDo not repeat these trend titles: " + (value_1269.length ? value_1269.join("、") : "None") + "\nX user: " + JSON.stringify({
          name: currentProfile.name,
          handle: currentProfile.handle,
          bio: currentProfile.bio
        }) + "\nReusable existing authors (optional; when used for a post, return their exact authorId): " + JSON.stringify(handleAction_51_1271) + "\nWorldbook:\n" + (handleAction_35_1270 || "None"),
        raw_17 = await requestXChatCompletion([{
          role: "system",
          content: "You generate strict JSON for a fictional international X social feed. Output JSON only."
        }, {
          role: "user",
          content: content_5
        }], {
          temperature: 0.9
        });
      return normalizeDiscoverTrendEntries(parseJsonPayload(raw_17));
    }
    async function generateDiscoverSearchResults() {
      const topic_18 = safeText(searchGenerateInput?.value),
        entries_2 = [],
        seen = new Set(),
        addEntries = items_6 => {
          items_6.forEach(entry_9 => {
            const key_8 = entry_9.trend.title.toLocaleLowerCase();
            if (seen.has(key_8) || entries_2.length >= 10) return;
            seen.add(key_8);
            entries_2.push(entry_9);
          });
        };
      addEntries(await requestDiscoverTrendBatch(topic_18, 10));
      entries_2.length < 10 && addEntries(await requestDiscoverTrendBatch(topic_18, 10 - entries_2.length, entries_2.map(entry_10 => entry_10.trend.title)));
      if (entries_2.length < 10) throw new Error("API returned fewer than 10 valid trends");
      const state_17 = getXState(),
        newPosts = entries_2.flatMap(entry_11 => entry_11.posts);
      return saveXState({
        ...state_17,
        xTrends: entries_2.slice(0, 10).map(entry_12 => ({
          ...entry_12.trend,
          movement: "none"
        })),
        xGeneratedPosts: prependUniquePosts(state_17.xGeneratedPosts, newPosts)
      }), await flushXStateNow("x-discover-generation"), renderTrends(), renderGeneratedPosts(), "已生成 10 条热搜和 " + newPosts.length + " 条关联帖子";
    }
    async function generateHomeSearchPosts() {
      const safeText_1285 = safeText(searchGenerateInput?.value),
        handleAction_35_1286 = getSelectedWorldBookContext(safeText_1285 + " " + currentProfile.bio),
        searchUserProfile = {
          name: currentProfile.name,
          handle: currentProfile.handle,
          bio: currentProfile.bio
        },
        handleAction_51_1288 = handleAction_51(),
        content_11 = "Return strict JSON only. Generate 5 to 10 realistic Weibo/X-style posts for the user's feed.\nThe current User is context only. Never author a generated post, comment or reply as the User; use only distinct non-User accounts.\nMix account types: official brand/media accounts, personal accounts, fan accounts, passers-by, marketing accounts, and niche community accounts.\nMix tones: serious analysis, funny meme-style posts, subtle sarcasm, heated/controversial takes, recommendations, complaints, fan enthusiasm, and deliberately argument-starting opinions. Keep it plausible, not generic.\nEvery post must be grounded in the topic, minimal user profile, and worldbook context when available. Avoid template-like filler.\nEach post must include: authorName, handle, text, translation, likes, reposts, commentsCount, mediaType (\"text\" or \"image\"), comments, and optional imagePrompt/images only when mediaType is \"image\". Every comment and reply must include translation.\nPosts can be pure text. Prefer text posts unless an image clearly adds value.\nEach post must have at least 5 comments.\nComments should feel like a real international X feed: disagreements, jokes, memes, clarifications, fans defending someone, skeptical passers-by, and occasional heated replies are allowed.\nEvery comment must be directly related to its own post. It must reference at least one concrete detail from the post text, topic, author stance, event, character, imagePrompt, or images[].text. Do not write generic reactions such as \"interesting\", \"same\", \"nice\", or comments that could fit any post.\nReplies are optional. If replies are included, each reply must respond to the parent comment's concrete point and connect back to the post.\nIf mediaType is \"image\", describe the image subject, composition, light, mood, and relevant post detail in imagePrompt or images[].text. Do not invent inaccessible URLs.\nAuthors may use any language natural to their identity and context. For every non-Chinese post, comment or reply, translation must contain accurate Simplified Chinese; Chinese originals use \"\". Keep imagePrompt and images[].text descriptions in Simplified Chinese.\nTopic: " + (safeText_1285 || "open recommendation feed") + "\nUser profile: " + JSON.stringify(searchUserProfile) + "\nReusable existing authors (optional; when used, return their exact authorId): " + JSON.stringify(handleAction_51_1288) + "\nWorldbook:\n" + (handleAction_35_1286 || "None"),
        value_1290 = await requestXChatCompletion([{
          role: "system",
          content: "You are a JSON generator for a fictional X feed. Output only valid JSON."
        }, {
          role: "user",
          content: content_11
        }], {
          temperature: 0.9
        }),
        privateMessages_2 = parseJsonPayload(value_1290),
        sanitizeApiGeneratedPosts_1292 = sanitizeApiGeneratedPosts(Array.isArray(privateMessages_2) ? privateMessages_2 : Array.isArray(privateMessages_2.posts) ? privateMessages_2.posts : []),
        handleAction_91_1293 = appendGeneratedPosts(sanitizeApiGeneratedPosts_1292);
      return await flushXStateNow("x-search-generation"), handleAction_91_1293.length ? "已生成 " + handleAction_91_1293.length + " 条帖子" : "没有生成可用帖子";
    }
    async function handleAction_171() {
      const runBtn_2 = document.getElementById("x-search-generate-run-btn"),
        textContent_3 = searchGenerateMode === "discover" ? "生成" : "Generate";
      runBtn_2?.classList.add("loading");
      if (runBtn_2) runBtn_2.textContent = searchGenerateMode === "discover" ? "生成中..." : "Generating";
      try {
        const message_12 = searchGenerateMode === "discover" ? await generateDiscoverSearchResults() : await generateHomeSearchPosts();
        closeSearchGenerateSheet();
        if (typeof window.showToast === "function") window.showToast(message_12);
      } catch (error_14) {
        console.error("[X] Search generation failed", error_14);
        if (!window.u2Api?.isRequestError?.(error_14) || !window.u2Api.reportError(error_14, {
          operation: "搜索内容生成"
        })) {
          if (typeof window.showToast === "function") window.showToast("生成失败，请检查 API 配置或返回格式");
        }
      } finally {
        runBtn_2?.classList.remove("loading");
        if (runBtn_2) runBtn_2.textContent = textContent_3;
      }
    }
    function getAdvanceControls() {
      return {
        strangersToggle: document.getElementById("x-advance-strangers-toggle"),
        strangersCount: document.getElementById("x-advance-strangers-count"),
        trendsToggle: document.getElementById("x-advance-trends-toggle"),
        trendsCount: document.getElementById("x-advance-trends-count"),
        postsToggle: document.getElementById("x-advance-posts-toggle"),
        postsCount: document.getElementById("x-advance-posts-count"),
        runButton: document.getElementById("x-advance-run-btn")
      };
    }
    function readAdvancePreferences() {
      const controls = getAdvanceControls();
      return normalizeAdvancePreferences({
        strangersEnabled: !!controls.strangersToggle?.checked,
        strangersCount: controls.strangersCount?.value,
        trendsEnabled: !!controls.trendsToggle?.checked,
        trendsCount: controls.trendsCount?.value,
        postsEnabled: !!controls.postsToggle?.checked,
        postsCount: controls.postsCount?.value
      });
    }
    function syncAdvanceControls() {
      const controls_2 = getAdvanceControls();
      if (controls_2.strangersCount) controls_2.strangersCount.disabled = !controls_2.strangersToggle?.checked;
      if (controls_2.trendsCount) controls_2.trendsCount.disabled = !controls_2.trendsToggle?.checked;
      if (controls_2.postsCount) controls_2.postsCount.disabled = !controls_2.postsToggle?.checked;
      const hasSelection = !!(controls_2.strangersToggle?.checked || controls_2.trendsToggle?.checked || controls_2.postsToggle?.checked);
      if (controls_2.runButton && !controls_2.runButton.classList.contains("loading")) controls_2.runButton.disabled = !hasSelection;
    }
    function populateAdvanceControls() {
      const preferences_2 = normalizeAdvancePreferences(getXState().xAdvancePreferences),
        controls_3 = getAdvanceControls();
      if (controls_3.strangersToggle) controls_3.strangersToggle.checked = preferences_2.strangersEnabled;
      if (controls_3.strangersCount) controls_3.strangersCount.value = String(preferences_2.strangersCount);
      if (controls_3.trendsToggle) controls_3.trendsToggle.checked = preferences_2.trendsEnabled;
      if (controls_3.trendsCount) controls_3.trendsCount.value = String(preferences_2.trendsCount);
      if (controls_3.postsToggle) controls_3.postsToggle.checked = preferences_2.postsEnabled;
      if (controls_3.postsCount) controls_3.postsCount.value = String(preferences_2.postsCount);
      syncAdvanceControls();
    }
    function persistAdvancePreferences() {
      const xAdvancePreferences_2 = readAdvancePreferences();
      return updateXState(draft_20 => {
        draft_20.xAdvancePreferences = xAdvancePreferences_2;
      }), xAdvancePreferences_2;
    }
    function openAdvanceSheet() {
      if (advancePlotInput) advancePlotInput.value = "";
      populateAdvanceControls();
      if (typeof window.openView === "function") window.openView(advanceSheet);else advanceSheet?.classList.add("active");
    }
    function closeAdvanceSheet() {
      if (advanceSheet?.querySelector(".x-advance-sheet")?.classList.contains("is-loading")) return;
      if (typeof window.closeView === "function") window.closeView(advanceSheet);else advanceSheet?.classList.remove("active");
    }
    function handleAction_172(disabled_2) {
      const sheet_2 = advanceSheet?.querySelector(".x-advance-sheet"),
        runBtn_3 = document.getElementById("x-advance-run-btn");
      sheet_2?.classList.toggle("is-loading", disabled_2);
      runBtn_3?.classList.toggle("loading", disabled_2);
      runBtn_3 && (runBtn_3.disabled = disabled_2, runBtn_3.textContent = disabled_2 ? "生成中..." : "生成");
      if (!disabled_2) syncAdvanceControls();
    }
    function buildAdvanceStoryContext(state_18) {
      const recentPosts_2 = (state_18.xGeneratedPosts || []).slice(0, 20).map(post_55 => ({
        author: post_55.authorName || post_55.name || post_55.handle,
        topic: post_55.topicTag || "",
        text: post_55.text || post_55.content || "",
        comments: (Array.isArray(post_55.commentList) ? post_55.commentList : []).slice(0, 3).map(comment_9 => comment_9.text || comment_9.content || "")
      }));
      return JSON.stringify({
        user: {
          name: currentProfile.name,
          handle: currentProfile.handle,
          bio: currentProfile.bio,
          persona: currentProfile.persona
        },
        trends: normalizeTrendList(state_18.xTrends || []).slice(0, maxXTrends),
        recentPosts: recentPosts_2
      });
    }
    async function collectExactGeneratedItems({
      total: total_3,
      batchSize: batchSize_2,
      blockedKeys = [],
      getKey: getKey_2,
      requestBatch: requestBatch_2,
      label: label_5
    }) {
      const items_7 = [],
        seen_6 = new Set(blockedKeys.map(key_9 => String(key_9).toLocaleLowerCase())),
        addItems = batch => {
          (Array.isArray(batch) ? batch : []).forEach(item_57 => {
            const key_10 = safeText(getKey_2(item_57)).toLocaleLowerCase();
            if (!key_10 || seen_6.has(key_10) || items_7.length >= total_3) return;
            seen_6.add(key_10);
            items_7.push(item_57);
          });
        },
        batchCount_2 = Math.ceil(total_3 / batchSize_2);
      for (let count_1317 = 0; count_1317 < batchCount_2 && items_7.length < total_3; count_1317 += 1) {
        addItems(await requestBatch_2(Math.min(batchSize_2, total_3 - items_7.length), Array.from(seen_6)));
      }
      items_7.length < total_3 && addItems(await requestBatch_2(total_3 - items_7.length, Array.from(seen_6)));
      if (items_7.length < total_3) throw new Error(label_5 + " returned fewer than " + total_3 + " valid items");
      return items_7.slice(0, total_3);
    }
    function normalizeGeneratedStranger(raw_18 = {}, index_16 = 0) {
      const name_26 = safeText(raw_18.name || raw_18.nickname || raw_18.handle);
      if (!name_26) return null;
      const rawMessages_2 = Array.isArray(raw_18.messages) ? raw_18.messages : [],
        baseTime = Date.now() + index_16 * 10,
        messages_8 = rawMessages_2.map((message_13, messageIndex) => {
          const text_20 = safeText(typeof message_13 === "string" ? message_13 : message_13?.text || message_13?.content || message_13?.message);
          return {
            id: makeLocalId("dm-msg"),
            source: "char",
            text: text_20,
            translation: typeof message_13 === "object" ? getGeneratedTranslation(message_13, text_20) : "",
            createdAt: baseTime + messageIndex
          };
        }).filter(message_14 => message_14.text).slice(0, 5);
      if (messages_8.length < 2) return null;
      return normalizeDmChar({
        id: raw_18.id || makeLocalId("stranger"),
        origin: "generated",
        name: name_26,
        handle: raw_18.handle,
        bio: raw_18.bio || raw_18.signature,
        persona: raw_18.persona,
        avatar: raw_18.avatar,
        isFollowing: false,
        messages: messages_8,
        addedAt: baseTime
      }, "generated");
    }
    function countGeneratedCommentItems(item_58) {
      if (Array.isArray(item_58)) return item_58.reduce((total_4, child) => total_4 + countGeneratedCommentItems(child), 0);
      if (!item_58 || typeof item_58 !== "object") return 0;
      return 1 + countGeneratedCommentItems(item_58.replies || []);
    }
    function collectCommentIds(comments_5, ids_2 = new Set()) {
      return (Array.isArray(comments_5) ? comments_5 : []).forEach(comment_10 => {
        if (!comment_10 || typeof comment_10 !== "object") return;
        if (comment_10.id) ids_2.add(String(comment_10.id));
        collectCommentIds(comment_10.replies, ids_2);
      }), ids_2;
    }
    function ensureUniqueGeneratedCommentIds(comment_11, seenIds) {
      const next_2 = {
        ...comment_11,
        replies: Array.isArray(comment_11.replies) ? comment_11.replies : []
      };
      if (!next_2.id || seenIds.has(String(next_2.id))) next_2.id = makeLocalId("auto-comment");
      return seenIds.add(String(next_2.id)), next_2.replies = next_2.replies.map(reply_13 => {
        const normalizedReply = {
          ...reply_13,
          replies: []
        };
        return (!normalizedReply.id || seenIds.has(String(normalizedReply.id))) && (normalizedReply.id = makeLocalId("auto-reply")), seenIds.add(String(normalizedReply.id)), normalizedReply;
      }), next_2;
    }
    function normalizePostInteractionComments(payload = {}) {
      const rawComments = Array.isArray(payload) ? payload : Array.isArray(payload.comments) ? payload.comments : Array.isArray(payload.replies) ? payload.replies : [];
      return rawComments.map(comment_12 => sanitizeApiGeneratedComment(comment_12)).filter(Boolean).map((comment_13, index_17) => normalizeGeneratedComment(comment_13, index_17)).filter(Boolean);
    }
    function normalizePostInteractionPrivateMessages(payload_3 = {}) {
      const rawMessages = Array.isArray(payload_3?.privateMessages) ? payload_3.privateMessages : Array.isArray(payload_3?.dmConversations) ? payload_3.dmConversations : Array.isArray(payload_3?.dms) ? payload_3.dms : [];
      return sanitizeApiGeneratedAuthors(rawMessages).map((item_59, index_18) => normalizeGeneratedStranger(item_59, index_18)).filter(Boolean);
    }
    function getPostForInteraction(postId_12, state_19 = getXState()) {
      return (state_19.xGeneratedPosts || []).find(post_56 => String(post_56.id) === String(postId_12)) || postData[postId_12] || {};
    }
    function savePostImageVision(postId_13, imageId, vision_2) {
      updateXState(draft_21 => {
        draft_21.xGeneratedPosts = (draft_21.xGeneratedPosts || []).map(post_57 => {
          if (String(post_57?.id) !== String(postId_13)) return post_57;
          return {
            ...post_57,
            images: (Array.isArray(post_57.images) ? post_57.images : []).map(image_9 => String(image_9?.id) === String(imageId) ? {
              ...image_9,
              vision: {
                ...vision_2
              }
            } : image_9)
          };
        });
      });
    }
    function visionContextForImage(vision_3) {
      if (!vision_3 || typeof vision_3 !== "object") return null;
      if (vision_3.status !== "ready") return {
        status: String(vision_3.status || "unknown")
      };
      return {
        status: "ready",
        summary: safeText(vision_3.summary),
        visibleText: Array.isArray(vision_3.visibleText) ? vision_3.visibleText.map(item_60 => safeText(item_60)).filter(Boolean) : [],
        subjects: Array.isArray(vision_3.subjects) ? vision_3.subjects.map(item_61 => safeText(item_61)).filter(Boolean) : [],
        scene: safeText(vision_3.scene),
        mood: safeText(vision_3.mood),
        notableDetails: Array.isArray(vision_3.notableDetails) ? vision_3.notableDetails.map(item_62 => safeText(item_62)).filter(Boolean) : []
      };
    }
    async function enrichPublishedPostImages(postId_14, imageSources_2 = []) {
      const source_12 = (Array.isArray(imageSources_2) ? imageSources_2 : []).find(image_10 => image_10?.id && image_10?.url);
      if (!source_12) return;
      const visionApi = window.u2ImageUnderstanding;
      if (!visionApi?.isConfigured?.()) {
        savePostImageVision(postId_14, source_12.id, {
          status: "skipped",
          reason: "not-configured",
          analyzedAt: Date.now()
        });
        await flushXStateNow("x-post-image-vision-skipped");
        return;
      }
      try {
        const vision_4 = await visionApi.analyze({
          url: source_12.url,
          mimeType: source_12.mimeType
        });
        savePostImageVision(postId_14, source_12.id, vision_4);
        await flushXStateNow("x-post-image-vision");
      } catch (error_15) {
        console.warn("[X] Post image understanding failed", error_15);
        savePostImageVision(postId_14, source_12.id, {
          status: "failed",
          reason: "analysis-failed",
          analyzedAt: Date.now()
        });
        await flushXStateNow("x-post-image-vision-failed");
      }
    }
    function handleAction_177(id_12) {
      const state_20 = getXState(),
        post_58 = getPostForInteraction(id_12, state_20),
        thread_10 = getPostThread(id_12, state_20),
        existingComments_2 = (thread_10.comments || []).slice(0, 25).map(comment_14 => ({
          author: comment_14.name || comment_14.handle || "",
          text: comment_14.text || "",
          replies: (Array.isArray(comment_14.replies) ? comment_14.replies : []).slice(0, 5).map(reply_14 => ({
            author: reply_14.name || reply_14.handle || "",
            text: reply_14.text || ""
          }))
        })),
        images_4 = getPostImages(post_58).map(image_11 => ({
          text: image_11.text || image_11.description || "",
          vision: visionContextForImage(image_11.vision)
        }));
      return {
        user: {
          name: currentProfile.name,
          handle: currentProfile.handle,
          bio: currentProfile.bio,
          persona: currentProfile.persona
        },
        post: {
          id: id_12,
          author: post_58.name || post_58.authorName || "",
          handle: post_58.handle || post_58.authorHandle || "",
          text: post_58.text || post_58.content || "",
          topicTag: post_58.topicTag || "",
          translation: post_58.translation || "",
          images: images_4
        },
        existingComments: existingComments_2,
        existingDmContacts: (state_20.xDirectMessages || []).slice(0, 50).map(item_63 => ({
          name: item_63.name || item_63.nickname || "",
          handle: item_63.handle || ""
        }))
      };
    }
    async function requestPostInteractionBatch(value_1372, options_9 = {}) {
      const includePrivateMessages_2 = options_9.includePrivateMessages !== false,
        context_4 = handleAction_177(value_1372),
        contextText = JSON.stringify(context_4),
        handleAction_35_1377 = getSelectedWorldBookContext(context_4.post.text + " " + context_4.post.topicTag + " " + currentProfile.persona + " " + contextText),
        outputShape = includePrivateMessages_2 ? "{\"comments\":[{\"authorName\":\"\",\"handle\":\"\",\"text\":\"\",\"translation\":\"\",\"replies\":[{\"authorName\":\"\",\"handle\":\"\",\"text\":\"\",\"translation\":\"\"}]}],\"privateMessages\":[{\"name\":\"\",\"handle\":\"\",\"bio\":\"\",\"translation\":\"\",\"persona\":\"\",\"messages\":[{\"text\":\"\",\"translation\":\"\"},{\"text\":\"\",\"translation\":\"\"}]}]}" : "{\"comments\":[{\"authorName\":\"\",\"handle\":\"\",\"text\":\"\",\"translation\":\"\",\"replies\":[{\"authorName\":\"\",\"handle\":\"\",\"text\":\"\",\"translation\":\"\"}]}]}",
        content_6 = "Return strict JSON only in this shape: " + outputShape + ".\nGenerate engagement for this exact X post.\nMinimum requirements:\n- comments plus nested replies combined MUST contain at least 10 generated comment objects.\n- Comments and replies must react to concrete details from the post, image descriptions, topic, existing comments, User persona, or Worldbook.\n- When an image includes a ready vision object, use it as the only visual evidence. Do not invent visual details that are absent from that object.\n" + (includePrivateMessages_2 ? "- privateMessages MUST contain at least 2 new stranger private-message conversations.\n- Each privateMessages[].messages MUST contain 2 to 5 incoming message objects, and every message is authored by that stranger.\n- Private messages must be prompted by this specific User post and must not reuse existing DM contacts." : "- Do not include privateMessages or any private-message content.") + "\n- Never generate content authored by the current User. The User is context only.\n- Every generated author must be a non-User identity.\n- Every user-facing text object must include translation. If the original text is Simplified Chinese, translation must be \"\".\n- Do not include markdown, explanations, or text outside JSON.\n" + (options_9.retryReason ? "Retry reason: " + options_9.retryReason : "") + "\n\nUser profile/persona:\n" + JSON.stringify(context_4.user) + "\n\nPost context:\n" + contextText + "\n\nWorldbook:\n" + (handleAction_35_1377 || "None"),
        raw_19 = await requestXChatCompletion([{
          role: "system",
          content: "Generate strict JSON for fictional X post engagement. Output JSON only."
        }, {
          role: "user",
          content: content_6
        }], {
          temperature: 0.9
        }),
        parsed_7 = parseJsonPayload(raw_19);
      return {
        comments: normalizePostInteractionComments(parsed_7),
        privateMessages: includePrivateMessages_2 ? normalizePostInteractionPrivateMessages(parsed_7) : []
      };
    }
    async function requestPostInteractionsWithRetry(postId_15, options_10 = {}) {
      const minCommentItems_2 = Number(options_10.minCommentItems) || 10,
        minPrivateMessages_2 = options_10.includePrivateMessages === false ? 0 : Number(options_10.minPrivateMessages) || 2;
      let retryReason_2 = "",
        lastError = null;
      for (let count_1388 = 0; count_1388 < 2; count_1388 += 1) {
        try {
          const result_2 = await requestPostInteractionBatch(postId_15, {
              ...options_10,
              retryReason: retryReason_2
            }),
            commentCount = countGeneratedCommentItems(result_2.comments),
            dmCount = result_2.privateMessages.length;
          if (commentCount >= minCommentItems_2 && dmCount >= minPrivateMessages_2) return result_2;
          retryReason_2 = "Previous response produced " + commentCount + " comment/reply objects and " + dmCount + " private-message conversations; minimums are " + minCommentItems_2 + " comments/replies and " + minPrivateMessages_2 + " private-message conversations.";
          lastError = new Error(retryReason_2);
        } catch (value_1392) {
          lastError = value_1392;
          retryReason_2 = "Previous response failed validation: " + (value_1392?.message || value_1392);
        }
      }
      throw lastError || new Error("Post interaction generation failed");
    }
    function handleAction_180(value_1393, value_1394 = []) {
      const normalized_8 = (Array.isArray(value_1394) ? value_1394 : []).filter(Boolean);
      if (!normalized_8.length) return 0;
      const thread_11 = getPostThread(value_1393),
        seenIds_2 = collectCommentIds(thread_11.comments),
        nextComments = normalized_8.map(comment_15 => ensureUniqueGeneratedCommentIds(comment_15, seenIds_2)),
        addedCount = countGeneratedCommentItems(nextComments);
      thread_11.comments = [...nextComments, ...(thread_11.comments || [])];
      thread_11.commentsCount = Math.max(Number(thread_11.commentsCount) || 0, 0) + addedCount;
      savePostThread(value_1393, thread_11);
      updatePostCountNodes(value_1393, thread_11);
      if (String(currentDetailPostId) === String(value_1393)) {
        renderCommentsList(value_1393, thread_11);
        const xDetailCommentsElement_1400 = document.getElementById("x-detail-comments");
        if (xDetailCommentsElement_1400) xDetailCommentsElement_1400.textContent = formatCompactCount(thread_11.commentsCount);
      }
      return addedCount;
    }
    function prependGeneratedPrivateMessages(value_1401 = []) {
      const normalized_9 = (Array.isArray(value_1401) ? value_1401 : []).filter(Boolean);
      if (!normalized_9.length) return 0;
      return updateXState(draft_22 => {
        draft_22.xDirectMessages = [...normalized_9, ...(draft_22.xDirectMessages || [])];
      }), renderDirectMessages(), normalized_9.length;
    }
    async function generatePostPublishInteractions(postId_16, options_11 = {}) {
      const runKey = String(postId_16 || "");
      if (!runKey || postVisionRuns.has(runKey)) return;
      postVisionRuns.add(runKey);
      try {
        try {
          await enrichPublishedPostImages(postId_16, options_11.imageSources);
        } catch (error_16) {
          console.warn("[X] Post image understanding persistence failed", error_16);
        }
        const result_3 = await requestPostInteractionsWithRetry(postId_16, {
            includePrivateMessages: true,
            minCommentItems: 10,
            minPrivateMessages: 2
          }),
          handleAction_180_1408 = handleAction_180(postId_16, result_3.comments),
          addedDms = prependGeneratedPrivateMessages(result_3.privateMessages);
        await flushXStateNow("x-post-publish-interactions");
        typeof window.showToast === "function" && window.showToast("Generated " + handleAction_180_1408 + " replies and " + addedDms + " DMs");
      } catch (error_17) {
        console.error("[X] Post publish interaction generation failed", error_17);
        if (typeof window.showToast === "function") window.showToast("Post published, but API engagement generation failed");
      } finally {
        postVisionRuns["delete"](runKey);
      }
    }
    async function handleAction_183() {
      const postId_17 = currentActionPostId || currentDetailPostId;
      if (!postId_17) return;
      const button_2 = document.getElementById("x-post-advance-btn");
      if (button_2?.classList.contains("loading")) return;
      const buttonLabel = button_2?.querySelector("span"),
        textContent_4 = buttonLabel?.textContent || "Advance post";
      button_2?.classList.add("loading");
      button_2?.setAttribute("aria-busy", "true");
      if (button_2) button_2.disabled = true;
      if (buttonLabel) buttonLabel.textContent = "Generating...";
      if (typeof window.showToast === "function") window.showToast("Generating post engagement...");
      try {
        const result_4 = await requestPostInteractionsWithRetry(postId_17, {
            includePrivateMessages: false,
            minCommentItems: 10
          }),
          handleAction_180_1415 = handleAction_180(postId_17, result_4.comments);
        await flushXStateNow("x-post-advance-comments");
        closePostSettingsSheet();
        typeof window.showToast === "function" && window.showToast("Advanced post with " + handleAction_180_1415 + " new replies");
      } catch (error_18) {
        console.error("[X] Advance post comments failed", error_18);
        if (typeof window.showToast === "function") window.showToast("Advance post failed; existing content was unchanged");
      } finally {
        button_2?.classList.remove("loading");
        button_2?.removeAttribute("aria-busy");
        if (button_2) button_2.disabled = false;
        if (buttonLabel) buttonLabel.textContent = textContent_4;
      }
    }
    async function handleAction_184(value_1417, value_1418, value_1419, value_1420, value_1421) {
      const content_7 = "Return strict JSON only: {\"strangers\":[{\"name\":\"\",\"handle\":\"\",\"bio\":\"\",\"translation\":\"\",\"persona\":\"\",\"messages\":[{\"text\":\"\",\"translation\":\"\"},{\"text\":\"\",\"translation\":\"\"}]}]}.\nGenerate exactly " + value_1417 + " unique strangers who proactively send private messages to the X user. Each stranger must send 2 to 5 incoming messages; do not write messages for the user. Messages should form a natural short sequence related to the ongoing plot.\nEvery message is incoming from the named stranger. Never generate an outbound User message or reuse the User identity as a stranger.\nEvery stranger must have a concrete reason to contact this specific User. Their identity, opening topic, tone and message details MUST reference or logically derive from the User profile/persona below, not only from the general plot. Avoid generic greetings that could be sent to anyone.\nEach stranger may use the language natural to their identity. Every non-Chinese bio and message must include an accurate Simplified Chinese translation; Chinese originals use \"\".\nPlot direction: " + (value_1419 || "随机延续当前剧情") + "\nUser profile/persona: " + JSON.stringify({
          name: currentProfile.name,
          handle: currentProfile.handle,
          bio: currentProfile.bio,
          persona: currentProfile.persona
        }) + "\nDo not repeat these names or handles: " + (value_1418.length ? value_1418.join("、") : "None") + "\nCurrent story context: " + value_1420 + "\nWorldbook:\n" + (value_1421 || "None"),
        raw_20 = await requestXChatCompletion([{
          role: "system",
          content: "Generate strict JSON for fictional incoming X private messages. Output JSON only."
        }, {
          role: "user",
          content: content_7
        }], {
          temperature: 0.9
        }),
        parsed_8 = parseJsonPayload(raw_20),
        strangers_2 = sanitizeApiGeneratedAuthors(Array.isArray(parsed_8) ? parsed_8 : Array.isArray(parsed_8?.strangers) ? parsed_8.strangers : []);
      return strangers_2.map(normalizeGeneratedStranger).filter(Boolean);
    }
    async function requestAdvanceTrendBatch(value_1426, value_1427, value_1428, value_1429, value_1430) {
      const content_8 = "Return strict JSON only: {\"trends\":[{\"title\":\"#Topic\",\"translation\":\"\",\"category\":\"Category · Trending\",\"heat\":\"12.3K\"}]}.\nGenerate exactly " + value_1426 + " unique new global hot-search topics that continue and evolve the existing trends and posts. New trends must be relevant to the requested plot and feel like later developments, not paraphrases.\nTopics may originate from any region or language. For non-Chinese title/category text include accurate Simplified Chinese in translation; Chinese originals use \"\".\nPlot direction: " + (value_1428 || "随机延续当前剧情") + "\nDo not repeat these titles: " + (value_1427.length ? value_1427.join("、") : "None") + "\nCurrent story context: " + value_1429 + "\nWorldbook:\n" + (value_1430 || "None"),
        raw_21 = await requestXChatCompletion([{
          role: "system",
          content: "Generate strict JSON for fictional international X hot searches. Output JSON only."
        }, {
          role: "user",
          content: content_8
        }], {
          temperature: 0.9
        }),
        jsonPayload_1433 = parseJsonPayload(raw_21),
        value_1434 = Array.isArray(jsonPayload_1433) ? jsonPayload_1433 : Array.isArray(jsonPayload_1433?.trends) ? jsonPayload_1433.trends : [];
      return normalizeTrendList(value_1434);
    }
    function matchTrendTitle(value_15, availableTrends) {
      const target_4 = safeText(value_15).replace(/^#+/, "").toLocaleLowerCase();
      if (!target_4) return "";
      const match_4 = availableTrends.find(trend_5 => trend_5.title.replace(/^#+/, "").toLocaleLowerCase() === target_4);
      return match_4?.title || "";
    }
    async function requestAdvancePostBatch(value_1439, value_1440, value_1441, value_1442, value_1443, availableTrends_2, value_1445) {
      const topicTitles = availableTrends_2.map(trend_6 => trend_6.title),
        handleAction_51_1447 = handleAction_51(),
        content_9 = "Return strict JSON only: {\"posts\":[{\"authorName\":\"\",\"handle\":\"\",\"text\":\"\",\"translation\":\"\",\"topicTag\":\"#精确热搜名\",\"likes\":0,\"reposts\":0,\"commentsCount\":5,\"mediaType\":\"text\",\"comments\":[{\"authorName\":\"\",\"handle\":\"\",\"text\":\"\",\"translation\":\"\"}]}]}.\nGenerate exactly " + value_1439 + " new international X posts that advance the current plot. Every post must use one exact topicTag from the allowed trend list and contain at least 5 valid, concrete comments in its comments array. Comments must respond to details in their own post.\nNever use the current User as a generated post, comment or reply author. All generated authors must be non-User accounts.\nPrefer newly generated trends while still allowing continuation of older trends. Use varied countries, languages, authors and viewpoints. Every non-Chinese post, comment and reply must include an accurate Simplified Chinese translation; Chinese originals use \"\".\nPlot direction: " + (value_1441 || "随机延续当前剧情") + "\nAllowed trends: " + topicTitles.join("、") + "\nNew trends to prioritize: " + (value_1445.length ? value_1445.join("、") : "None") + "\nReusable existing authors (optional; when used, return their exact authorId): " + JSON.stringify(handleAction_51_1447) + "\nDo not repeat these post identifiers or summaries: " + (value_1440.length ? value_1440.join("、") : "None") + "\nCurrent story context: " + value_1442 + "\nWorldbook:\n" + (value_1443 || "None"),
        raw_22 = await requestXChatCompletion([{
          role: "system",
          content: "Generate strict JSON for fictional international X posts. Output JSON only."
        }, {
          role: "user",
          content: content_9
        }], {
          temperature: 0.9
        }),
        parsed_9 = parseJsonPayload(raw_22),
        posts_13 = sanitizeApiGeneratedPosts(Array.isArray(parsed_9) ? parsed_9 : Array.isArray(parsed_9?.posts) ? parsed_9.posts : []);
      return posts_13.map((rawPost_5, index_19) => {
        const topicTag_4 = matchTrendTitle(rawPost_5?.topicTag || rawPost_5?.topic || rawPost_5?.trend, availableTrends_2);
        if (!topicTag_4) return null;
        const post_59 = normalizeGeneratedPost({
          ...rawPost_5,
          topicTag: topicTag_4
        }, index_19);
        if (!post_59 || !Array.isArray(post_59.commentList) || post_59.commentList.length < 5) return null;
        return post_59.topicTag = topicTag_4, ensureCommentDepth(post_59);
      }).filter(Boolean);
    }
    async function handleAction_186() {
      const preferences_3 = persistAdvancePreferences();
      if (!preferences_3.strangersEnabled && !preferences_3.trendsEnabled && !preferences_3.postsEnabled) {
        if (typeof window.showToast === "function") window.showToast("请至少开启一项生成内容");
        return;
      }
      const plot = safeText(advancePlotInput?.value);
      handleAction_172(true);
      try {
        const state_21 = getXState(),
          storyContext = buildAdvanceStoryContext(state_21),
          worldbook = getSelectedWorldBookContext(plot + " " + currentProfile.bio + " " + currentProfile.persona),
          existingTrends = normalizeTrendList(state_21.xTrends || []);
        let newTrends = [],
          newPosts_2 = [],
          newStrangers = [];
        preferences_3.trendsEnabled && (newTrends = await collectExactGeneratedItems({
          total: preferences_3.trendsCount,
          batchSize: 10,
          blockedKeys: existingTrends.map(trend_7 => trend_7.title),
          getKey: trend_8 => trend_8.title,
          requestBatch: (count_3, excluded_2) => requestAdvanceTrendBatch(count_3, excluded_2, plot, storyContext, worldbook),
          label: "Trends"
        }), newTrends = newTrends.map(trend_9 => ({
          ...trend_9,
          movement: "up"
        })));
        const shiftedTrends = preferences_3.trendsEnabled ? existingTrends.map(trend_10 => ({
            ...trend_10,
            movement: "down"
          })) : existingTrends,
          availableTrends_3 = normalizeTrendList([...newTrends, ...shiftedTrends]).slice(0, maxXTrends);
        if (preferences_3.postsEnabled) {
          if (availableTrends_3.length === 0) throw new Error("No trends available for generated posts");
          newPosts_2 = await collectExactGeneratedItems({
            total: preferences_3.postsCount,
            batchSize: 5,
            getKey: value_1470 => value_1470.name + "|" + value_1470.text,
            requestBatch: (count_4, excluded) => requestAdvancePostBatch(count_4, excluded, plot, storyContext, worldbook, availableTrends_3, newTrends.map(trend_11 => trend_11.title)),
            label: "Posts"
          });
        }
        if (preferences_3.strangersEnabled) {
          const blockedKeys_2 = (state_21.xDirectMessages || []).map(value_1474 => safeText(value_1474.name) + "|" + safeText(value_1474.handle));
          newStrangers = await collectExactGeneratedItems({
            total: preferences_3.strangersCount,
            batchSize: 10,
            blockedKeys: blockedKeys_2,
            getKey: value_1475 => value_1475.name + "|" + value_1475.handle,
            requestBatch: (value_1476, value_1477) => handleAction_184(value_1476, value_1477, plot, storyContext, worldbook),
            label: "Strangers"
          });
        }
        saveXState({
          ...state_21,
          xAdvancePreferences: preferences_3,
          xTrends: availableTrends_3,
          xGeneratedPosts: prependUniquePosts(state_21.xGeneratedPosts, newPosts_2),
          xDirectMessages: [...newStrangers, ...(state_21.xDirectMessages || [])]
        });
        await flushXStateNow("x-advance-generation");
        renderTrends();
        renderGeneratedPosts();
        renderDirectMessages();
        handleAction_172(false);
        closeAdvanceSheet();
        typeof window.showToast === "function" && window.showToast("已生成 " + newStrangers.length + " 个陌生人、" + newTrends.length + " 条热搜、" + newPosts_2.length + " 条帖子");
      } catch (error_19) {
        console.error("[X] Advance generation failed", error_19);
        if (!window.u2Api?.isRequestError?.(error_19) || !window.u2Api.reportError(error_19, {
          operation: "内容推进"
        })) {
          if (typeof window.showToast === "function") window.showToast("推进失败，未修改现有内容");
        }
      } finally {
        handleAction_172(false);
      }
    }
    function updateIndicator(targetItem) {
      if (!indicator || !targetItem) return;
      const parentElement_1480 = targetItem.parentElement;
      if (!parentElement_1480) return;
      const boundingClientRect = parentElement_1480.getBoundingClientRect(),
        boundingClientRect_1481 = targetItem.getBoundingClientRect();
      indicator.style.left = boundingClientRect_1481.left - boundingClientRect.left + "px";
      indicator.style.width = boundingClientRect_1481.width + "px";
    }
    function renderVisibleXTab(index_20 = currentIndex, state_22 = getXState(), options_12 = {}) {
      syncCurrentProfile(state_22);
      const target_5 = navItems[index_20]?.getAttribute("data-target");
      if (target_5 === "x-home-tab") {
        renderGeneratedPosts(state_22, {
          resetLimit: !!options_12.resetHomeFeed,
          force: !!options_12.force
        });
        return;
      }
      if (target_5 === "x-super-tab") {
        renderSuperFollowBar(state_22);
        return;
      }
      if (target_5 === "x-discover-tab") {
        renderTrends(state_22);
        return;
      }
      if (target_5 === "x-messages-tab") {
        renderDirectMessages(state_22);
        return;
      }
      target_5 === "x-me-tab" && handleAction_72(state_22);
    }
    function switchTab(index_21, options_13 = {}) {
      if (index_21 < 0 || index_21 >= navItems.length) return;
      currentIndex = index_21;
      view.scrollTop = 0;
      const state_23 = options_13.state || getXState();
      navItems.forEach((item_64, itemIndex) => {
        item_64.classList.toggle("active", itemIndex === index_21);
      });
      tabs.forEach((element_1489, value_1490) => {
        element_1489.classList.toggle("active", value_1490 === index_21);
        element_1489.style.transform = "translateX(-" + index_21 * 100 + "%)";
      });
      updateIndicator(navItems[index_21]);
      renderVisibleXTab(index_21, state_23, options_13);
      closePostDetail();
    }
    function switchButtonTabs(buttons, panels, buttonAttr, panelAttr, nextValue) {
      buttons.forEach(button_3 => {
        button_3.classList.toggle("active", button_3.getAttribute(buttonAttr) === nextValue);
      });
      panels.forEach(panel_4 => {
        panel_4.classList.toggle("active", panel_4.getAttribute(panelAttr) === nextValue);
      });
    }
    function openPostDetail(value_1493) {
      const post_60 = postData[value_1493] || postData.island;
      currentDetailPostId = value_1493;
      const detailPost = document.getElementById("x-detail-post"),
        thread_12 = getPostThread(value_1493);
      detailPost && (detailPost.innerHTML = "\n                    <div class=\"x-detail-author\">\n                        " + buildAuthorAvatarButton(post_60, "x-avatar") + "\n                        <div>\n                            <strong>" + escapeHtml(post_60.name) + "</strong>\n                            <span>" + escapeHtml(post_60.handle) + "</span>\n                        </div>\n                    </div>\n                    <p class=\"x-detail-text\">" + renderPostTextHtml(post_60) + "</p>\n                    " + buildExpandableTranslationHtml(post_60.translation, "x-post-translation-toggle") + "\n                    " + renderPostImages(getPostImages(post_60)) + "\n                    <div class=\"x-detail-inline-actions\">\n                        <button id=\"x-detail-repost-btn\" type=\"button\" class=\"x-detail-inline-action " + (thread_12.reposted ? "active" : "") + "\" aria-label=\"Repost\">\n                            <i class=\"fas fa-retweet\"></i><span>" + escapeHtml(formatCompactCount(thread_12.reposts)) + "</span>\n                        </button>\n                        <button id=\"x-detail-like-btn\" type=\"button\" class=\"x-detail-inline-action " + (thread_12.liked ? "active" : "") + "\" aria-label=\"Like\">\n                            <i class=\"" + (thread_12.liked ? "fas" : "far") + " fa-heart\"></i><span>" + escapeHtml(formatCompactCount(thread_12.likes)) + "</span>\n                        </button>\n                    </div>\n                ");
      const repostsEl = document.getElementById("x-detail-reposts"),
        likesEl = document.getElementById("x-detail-likes"),
        xDetailCommentsElement_1496 = document.getElementById("x-detail-comments");
      if (repostsEl) repostsEl.textContent = formatCompactCount(thread_12.reposts);
      if (likesEl) likesEl.textContent = formatCompactCount(thread_12.likes);
      if (xDetailCommentsElement_1496) xDetailCommentsElement_1496.textContent = formatCompactCount(thread_12.commentsCount);
      handleAction_111(thread_12);
      handleAction_112();
      renderCommentsList(value_1493, thread_12);
      updatePostCountNodes(value_1493, thread_12);
      if (postDetailView) postDetailView.style.zIndex = topicDetailView?.classList.contains("active") ? "94" : "90";
      postDetailView?.classList.add("active");
      postDetailView?.setAttribute("aria-hidden", "false");
    }
    function closePostDetail() {
      postDetailView?.contains(document.activeElement) && document.activeElement.blur();
      postDetailView?.classList.remove("active");
      postDetailView?.setAttribute("aria-hidden", "true");
      if (postDetailView) postDetailView.style.zIndex = "90";
      currentDetailPostId = null;
      replyTarget = null;
    }
    function bindPostCard(card_6) {
      const postId_18 = card_6.getAttribute("data-post-id");
      if (!postId_18 || card_6.dataset.xBound === "true") return;
      card_6.dataset.xBound = "true";
      card_6.addEventListener("click", event => {
        if (event.target.closest(".x-post-image-thumb, .x-author-avatar-btn, .x-feed-forward-btn, .x-post-topic-link, .x-translation-toggle")) return;
        const ref = event.target.closest(".x-ref-post");
        if (ref) {
          event.stopPropagation();
          openPostDetail(ref.dataset.refId);
          return;
        }
        if (card_6.classList.contains("is-moment")) return;
        openPostDetail(postId_18);
      });
      card_6.addEventListener("keydown", event_2 => {
        if (event_2.key === "Enter" || event_2.key === " ") {
          event_2.preventDefault();
          if (card_6.classList.contains("is-moment")) return;
          openPostDetail(postId_18);
        }
      });
    }
    function scheduleXOpenMaintenance() {
      if (xOpenMaintenancePromise) return xOpenMaintenancePromise;
      const value_1500 = async () => {
        const value_1501 = typeof window.getAppStateRevision === "function" ? window.getAppStateRevision("x") : fallbackXStateRevision;
        await handleAction_50();
        await handleAction_36();
        await handleAction_37();
        const value_1502 = typeof window.getAppStateRevision === "function" ? window.getAppStateRevision("x") : fallbackXStateRevision;
        view.classList.contains("active") && value_1502 !== value_1501 && renderVisibleXTab(currentIndex, getXState(), {
          force: true
        });
      };
      return xOpenMaintenancePromise = new Promise(resolve_2 => {
        const start = () => value_1500()["catch"](error_20 => {
          console.warn("[X] Deferred open maintenance failed", error_20);
        })["finally"](() => {
          xOpenMaintenancePromise = null;
          resolve_2();
        });
        typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(start, {
          timeout: 750
        }) : setTimeout(start, 0);
      }), xOpenMaintenancePromise;
    }
    async function handleClick_2(event_3) {
      if (event_3) event_3.stopPropagation();
      if (window.isJiggleMode) return;
      if (window.globalDataReadyPromise) await window.globalDataReadyPromise;
      view.scrollTop = 0;
      view.classList.add("active");
      ensureXEventBindings();
      xHomeFeedRenderLimit = xHomeFeedInitialLimit;
      const state_24 = getXState();
      syncCurrentProfile(state_24);
      requestAnimationFrame(() => {
        switchTab(currentIndex, {
          state: state_24,
          resetHomeFeed: true
        });
        scheduleXOpenMaintenance();
      });
    }
    function closeXApp() {
      closeTopicDetail();
      closePostDetail();
      closeEditProfile();
      closeAccountSwitchSheet();
      closeCreateTopicSheet();
      closeXSettings();
      closeComposer();
      closeVisitorsSheet();
      closeAddDmSheet();
      closeDmChat();
      closeDmSettingsSheet();
      closeDmProfile();
      closeSearchGenerateSheet();
      closeAdvanceSheet();
      closeCharEditSheet();
      closeCharProfileGenerateSheet();
      closeEditSuperTopicSheet();
      closePostForwardSheet();
      closeImagePreview();
      view.classList.remove("active");
      flushXStateNow("x-close");
    }
    function readXImageFile(file) {
      return new Promise((resolve_3, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve_3(String(reader.result || ""));
        reader.onerror = () => reject(reader.error || new Error("读取图片失败"));
        reader.readAsDataURL(file);
      });
    }
    function loadXImage(dataUrl) {
      return new Promise((resolve_4, reject_2) => {
        const image_12 = new Image();
        image_12.onload = () => resolve_4(image_12);
        image_12.onerror = () => reject_2(new Error("解析图片失败"));
        image_12.src = dataUrl;
      });
    }
    async function compressXImageFile(file_3, options_14 = xImageCompressionPresets.post) {
      const declaredMimeType = String(file_3?.type || "").toLowerCase(),
        fileName_2 = String(file_3?.name || "").toLowerCase(),
        inferredMimeType = /\.png$/.test(fileName_2) ? "image/png" : /\.jpe?g$/.test(fileName_2) ? "image/jpeg" : "",
        sourceMimeType = declaredMimeType || inferredMimeType;
      if (!file_3 || !xAcceptedImageTypes.has(sourceMimeType)) throw new Error("仅支持 JPG、JPEG 或 PNG 图片");
      const value_1518 = await readXImageFile(file_3),
        image_13 = await loadXImage(value_1518),
        width_2 = image_13.naturalWidth || image_13.width || 0,
        height_2 = image_13.naturalHeight || image_13.height || 0;
      if (!width_2 || !height_2) throw new Error("无法读取图片尺寸");
      const scale = Math.min(1, options_14.maxWidth / width_2, options_14.maxHeight / height_2),
        width_3 = Math.max(1, Math.round(width_2 * scale)),
        height_3 = Math.max(1, Math.round(height_2 * scale)),
        canvas = document.createElement("canvas");
      canvas.width = width_3;
      canvas.height = height_3;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("当前浏览器无法压缩图片");
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image_13, 0, 0, width_3, height_3);
      const outputMimeType = sourceMimeType === "image/png" ? "image/png" : "image/jpeg",
        compressedDataUrl = outputMimeType === "image/png" ? canvas.toDataURL(outputMimeType) : canvas.toDataURL(outputMimeType, options_14.quality ?? 0.82);
      if (!compressedDataUrl.startsWith("data:" + outputMimeType)) throw new Error((outputMimeType === "image/png" ? "PNG" : "JPG") + " 压缩失败");
      return compressedDataUrl;
    }
    function bindFilePreview(input_3, value_1529, value_1530) {
      input_3?.addEventListener("change", async () => {
        const file_4 = input_3.files && input_3.files[0];
        if (!file_4) return;
        input_3.disabled = true;
        try {
          const value_1532 = await compressXImageFile(file_4, value_1529);
          value_1530(value_1532);
        } catch (error_21) {
          console.warn("[X] Image compression failed", error_21);
          typeof window.showToast === "function" && window.showToast(error_21?.message || "图片压缩失败，请重新选择");
        } finally {
          input_3.value = "";
          input_3.disabled = false;
        }
      });
    }
    appButton.addEventListener("click", handleClick_2);
    function ensureXEventBindings() {
      if (enabled_21) return;
      enabled_21 = true;
      handleAction_53();
      closeButtons.forEach(button_4 => button_4.addEventListener("click", closeXApp));
      navItems.forEach((item_65, index_22) => item_65.addEventListener("click", () => switchTab(index_22)));
      view.querySelectorAll(".x-feed-card[data-post-id]").forEach(bindPostCard);
      postDetailBack?.addEventListener("click", closePostDetail);
      topicDetailBack?.addEventListener("click", closeTopicDetail);
      topicDetailGenerateBtn?.addEventListener("click", handleAction_90);
      xProfileSettingsBtnElement?.addEventListener("click", handleAction_78);
      document.getElementById("x-profile-visitors-btn")?.addEventListener("click", handleAction_131);
      document.getElementById("x-visitors-close-btn")?.addEventListener("click", closeVisitorsSheet);
      document.getElementById("x-add-dm-btn")?.addEventListener("click", openAddDmSheet);
      document.getElementById("x-add-dm-close-btn")?.addEventListener("click", closeAddDmSheet);
      document.getElementById("x-manual-char-add-btn")?.addEventListener("click", addManualChar);
      nextDayBtn?.addEventListener("click", openAdvanceSheet);
      document.getElementById("x-search-generate-btn")?.addEventListener("click", () => openSearchGenerateSheet("home"));
      document.getElementById("x-discover-search-btn")?.addEventListener("click", () => openSearchGenerateSheet("discover"));
      document.getElementById("x-search-generate-close-btn")?.addEventListener("click", closeSearchGenerateSheet);
      document.getElementById("x-search-generate-run-btn")?.addEventListener("click", handleAction_171);
      document.getElementById("x-advance-close-btn")?.addEventListener("click", closeAdvanceSheet);
      document.getElementById("x-advance-run-btn")?.addEventListener("click", handleAction_186);
      ["x-advance-strangers-toggle", "x-advance-trends-toggle", "x-advance-posts-toggle"].forEach(id_13 => {
        document.getElementById(id_13)?.addEventListener("change", () => {
          syncAdvanceControls();
          persistAdvancePreferences();
        });
      });
      ["x-advance-strangers-count", "x-advance-trends-count", "x-advance-posts-count"].forEach(id_14 => {
        const input_4 = document.getElementById(id_14);
        input_4?.addEventListener("input", persistAdvancePreferences);
        input_4?.addEventListener("change", () => {
          persistAdvancePreferences();
          populateAdvanceControls();
        });
      });
      document.getElementById("x-post-settings-close-btn")?.addEventListener("click", closePostSettingsSheet);
      document.getElementById("x-post-advance-btn")?.addEventListener("click", handleAction_183);
      document.getElementById("x-post-delete-btn")?.addEventListener("click", deleteTargetPost);
      document.getElementById("x-post-detail-menu-btn")?.addEventListener("click", () => {
        if (currentDetailPostId) openPostSettingsSheet(currentDetailPostId);
      });
      document.getElementById("x-dm-chat-back")?.addEventListener("click", closeDmChat);
      document.getElementById("x-dm-chat-menu-btn")?.addEventListener("click", openDmSettingsSheet);
      document.getElementById("x-dm-settings-close-btn")?.addEventListener("click", closeDmSettingsSheet);
      document.getElementById("x-dm-imessage-context-enabled")?.addEventListener("change", event_4 => {
        updateCurrentDmImessageContext({
          enabled: event_4.target.checked
        });
      });
      document.getElementById("x-dm-imessage-context-limit")?.addEventListener("change", event_5 => {
        updateCurrentDmImessageContext({
          limit: event_5.target.value
        });
      });
      document.getElementById("x-dm-clear-chat-btn")?.addEventListener("click", handleAction_154);
      document.getElementById("x-dm-delete-chat-btn")?.addEventListener("click", handleAction_155);
      document.getElementById("x-dm-profile-back")?.addEventListener("click", closeDmProfile);
      document.getElementById("x-char-edit-close-btn")?.addEventListener("click", closeCharEditSheet);
      document.getElementById("x-char-edit-save-btn")?.addEventListener("click", handleAction_139);
      document.getElementById("x-char-random-cover-btn")?.addEventListener("click", handleAction_140);
      document.getElementById("x-char-edit-avatar-preview")?.addEventListener("click", () => document.getElementById("x-char-edit-avatar-input")?.click());
      document.getElementById("x-char-edit-cover-preview")?.addEventListener("click", () => document.getElementById("x-char-edit-cover-input")?.click());
      document.getElementById("x-char-profile-generate-close-btn")?.addEventListener("click", closeCharProfileGenerateSheet);
      document.getElementById("x-char-profile-generate-run-btn")?.addEventListener("click", handleAction_152);
      document.getElementById("x-char-profile-image-toggle")?.addEventListener("change", handleAction_143);
      document.getElementById("x-char-profile-image-preset")?.addEventListener("change", event_6 => applyCharProfilePromptPreset(event_6.target.value));
      document.getElementById("x-char-profile-preset-save")?.addEventListener("click", handleAction_146);
      document.getElementById("x-char-profile-preset-delete")?.addEventListener("click", handleAction_147);
      document.getElementById("x-char-profile-reference-preview")?.addEventListener("click", () => document.getElementById("x-char-profile-reference-input")?.click());
      document.getElementById("x-char-profile-reference-input")?.addEventListener("change", handleAction_148);
      document.getElementById("x-char-profile-reference-delete")?.addEventListener("click", removeCharProfileReferenceDraft);
      document.getElementById("x-edit-super-topic-close-btn")?.addEventListener("click", closeEditSuperTopicSheet);
      document.getElementById("x-edit-super-topic-save-btn")?.addEventListener("click", handleAction_98);
      document.getElementById("x-edit-super-topic-delete-btn")?.addEventListener("click", handleAction_99);
      document.getElementById("x-edit-super-topic-avatar-preview")?.addEventListener("click", () => document.getElementById("x-edit-super-topic-avatar-input")?.click());
      document.getElementById("x-edit-super-topic-banner-preview")?.addEventListener("click", () => document.getElementById("x-edit-super-topic-banner-input")?.click());
      document.getElementById("x-edit-topic-import-imessage-btn")?.addEventListener("click", handleAction_106);
      document.getElementById("x-edit-topic-manual-char-btn")?.addEventListener("click", handleAction_107);
      document.getElementById("x-edit-topic-manual-save-btn")?.addEventListener("click", handleAction_108);
      document.getElementById("x-post-forward-close-btn")?.addEventListener("click", closePostForwardSheet);
      document.getElementById("x-dm-chat-composer")?.addEventListener("submit", event_1543 => {
        event_1543.preventDefault();
        onSend_2();
      });
      document.getElementById("x-dm-chat-send-btn")?.addEventListener("click", event_1544 => {
        event_1544.preventDefault();
        onSend_2();
      });
      document.getElementById("x-dm-chat-api-btn")?.addEventListener("click", handleAction_166);
      window.mobileInputCompat?.register({
        input: document.getElementById("x-dm-chat-input"),
        root: element_15,
        scrollContainer: element_16,
        onSend: onSend_2,
        allowEmpty: true,
        blurAfterSend: true
      });
      document.getElementById("x-image-preview-close")?.addEventListener("click", closeImagePreview);
      document.getElementById("x-reply-submit-btn")?.addEventListener("click", handleAction_115);
      document.getElementById("x-reply-cancel-btn")?.addEventListener("click", () => setReplyTarget(null));
      document.getElementById("x-reply-input")?.addEventListener("keydown", event_1545 => {
        event_1545.key === "Enter" && !event_1545.shiftKey && !event_1545.ctrlKey && !event_1545.altKey && !event_1545.isComposing && event_1545.keyCode !== 229 && (event_1545.preventDefault(), handleAction_115(), event_1545.target.blur());
      });
      editCancelButton?.addEventListener("click", closeEditProfile);
      editSaveButton?.addEventListener("click", handleAction_77);
      settingsCloseButton?.addEventListener("click", closeXSettings);
      settingsWorldBookButton?.addEventListener("click", handleAction_80);
      document.getElementById("x-settings-clear-data-btn")?.addEventListener("click", handleAction_79);
      composeCancelButton?.addEventListener("click", closeComposer);
      composeSubmitButton?.addEventListener("click", handleAction_84);
      composeImageButton?.addEventListener("click", () => composeImageInput?.click());
      composeImageUrlButton?.addEventListener("click", addComposeImageUrl);
      composeImageUrlInput?.addEventListener("keydown", event_1546 => {
        event_1546.key === "Enter" && (event_1546.preventDefault(), addComposeImageUrl());
      });
      composeImageClearButton?.addEventListener("click", () => {
        composeImageDraft = "";
        if (composeImageInput) composeImageInput.value = "";
        if (composeImageUrlInput) composeImageUrlInput.value = "";
        renderComposeImageDraft();
      });
      document.querySelector(".x-compose-button")?.addEventListener("click", () => openComposer());
      document.querySelector(".x-post-button")?.addEventListener("click", () => openComposer());
      document.getElementById("x-super-compose-btn")?.addEventListener("click", () => {
        if (currentActiveTopicId) openComposer({
          superTopicId: currentActiveTopicId
        });
      });
      composeSuperChip?.addEventListener("click", () => {
        if (currentComposeSuperId) handleAction_95(currentComposeSuperId);
      });
      editAvatarPreview?.addEventListener("click", () => editAvatarInput?.click());
      editBannerPreview?.addEventListener("click", () => editBannerInput?.click());
      view.addEventListener("click", event_7 => {
        const translationToggle = event_7.target.closest(".x-translation-toggle");
        if (translationToggle) {
          event_7.preventDefault();
          event_7.stopPropagation();
          let translationText = translationToggle.nextElementSibling;
          !translationText?.classList.contains("x-translation-text") && (translationText = translationToggle.closest(".x-comment-action-row")?.nextElementSibling);
          if (!translationText?.classList.contains("x-translation-text")) return;
          const willExpand = translationText.hidden;
          translationText.hidden = !willExpand;
          translationToggle.setAttribute("aria-expanded", String(willExpand));
          translationToggle.textContent = willExpand ? "收起翻译" : "翻译";
          return;
        }
        const translationBubble = event_7.target.closest(".x-dm-translation-bubble");
        if (translationBubble) {
          event_7.preventDefault();
          event_7.stopPropagation();
          const translationText_2 = translationBubble.querySelector(".x-dm-expanded-translation");
          if (!translationText_2) return;
          const willExpand_2 = translationText_2.hidden;
          translationText_2.hidden = !willExpand_2;
          translationBubble.setAttribute("aria-expanded", String(willExpand_2));
          translationBubble.classList.toggle("translated", willExpand_2);
          translationBubble.title = willExpand_2 ? "点击收起翻译" : "点击展开翻译";
          return;
        }
        const topicLink = event_7.target.closest(".x-post-topic-link[data-topic-tag]");
        if (topicLink) {
          event_7.preventDefault();
          event_7.stopPropagation();
          closePostDetail();
          openTopicDetail(topicLink.dataset.topicTag);
          return;
        }
        const accountSwitchTrigger = event_7.target.closest("#x-account-switch-trigger");
        if (accountSwitchTrigger) {
          event_7.preventDefault();
          event_7.stopPropagation();
          openAccountSwitchSheet();
          return;
        }
        const accountSwitchClose = event_7.target.closest("#x-account-switch-close-btn");
        if (accountSwitchClose) {
          event_7.preventDefault();
          closeAccountSwitchSheet();
          return;
        }
        const addAccountButton = event_7.target.closest("#x-account-add-btn");
        if (addAccountButton) {
          event_7.preventDefault();
          closeAccountSwitchSheet();
          openEditProfile("create");
          return;
        }
        const accountRow = event_7.target.closest("[data-x-player-account-id]");
        if (accountRow) {
          event_7.preventDefault();
          void switchXPlayerAccount(accountRow.dataset.xPlayerAccountId);
          return;
        }
        const selfProfileEdit = event_7.target.closest("#x-profile-edit-btn");
        if (selfProfileEdit) {
          event_7.preventDefault();
          openEditProfile();
          return;
        }
        const authorButton = event_7.target.closest(".x-author-avatar-btn");
        if (authorButton) {
          event_7.preventDefault();
          event_7.stopPropagation();
          openAuthorProfile(authorButton.dataset.xAuthorId, authorButton.dataset.xAuthorName, authorButton.dataset.xAuthorHandle, authorButton.dataset.xAuthorAvatar);
          return;
        }
        const profileFollow = event_7.target.closest("[data-profile-follow-id]");
        if (profileFollow) {
          event_7.preventDefault();
          toggleProfileFollow(profileFollow.dataset.profileFollowId);
          return;
        }
        const profileEdit = event_7.target.closest("[data-profile-edit-id]");
        if (profileEdit) {
          event_7.preventDefault();
          openCharEditSheet(profileEdit.dataset.profileEditId);
          return;
        }
        const profileGenerate = event_7.target.closest("#x-char-profile-generate-btn");
        if (profileGenerate) {
          event_7.preventDefault();
          openCharProfileGenerateSheet(currentProfileIdentity?.id);
          return;
        }
        const forwardButton = event_7.target.closest(".x-feed-forward-btn");
        if (forwardButton) {
          event_7.preventDefault();
          event_7.stopPropagation();
          openPostForwardSheet(forwardButton.dataset.postId || forwardButton.closest("[data-post-id]")?.dataset.postId);
          return;
        }
        const forwardRecipient = event_7.target.closest(".x-post-forward-recipient[data-forward-dm-id]");
        if (forwardRecipient) {
          event_7.preventDefault();
          forwardPostToDm(forwardRecipient.dataset.forwardDmId);
          return;
        }
        const dmProfileBack = event_7.target.closest("#x-dm-profile-back");
        if (dmProfileBack) {
          event_7.preventDefault();
          closeDmProfile();
          return;
        }
        const profileTab = event_7.target.closest(".x-unified-profile-tabs button[data-x-profile-tab]");
        if (profileTab) {
          event_7.preventDefault();
          const nextTab = profileTab.getAttribute("data-x-profile-tab"),
            profileRoot = profileTab.closest("#x-profile-scroll, .x-dm-profile-scroll"),
            tabButtons = Array.from(profileRoot?.querySelectorAll(".x-unified-profile-tabs button[data-x-profile-tab]") || []),
            panels_2 = Array.from(profileRoot?.querySelectorAll(".x-profile-panel[data-x-profile-panel]") || []);
          switchButtonTabs(tabButtons, panels_2, "data-x-profile-tab", "data-x-profile-panel", nextTab);
          return;
        }
        const imageButton = event_7.target.closest(".x-post-image-thumb");
        if (imageButton) {
          event_7.preventDefault();
          event_7.stopPropagation();
          openImagePreview(imageButton.dataset.imageText || "Image", imageButton.dataset.imageUrl || "");
          return;
        }
        const detailLike = event_7.target.closest("#x-detail-like-btn");
        if (detailLike) {
          event_7.preventDefault();
          toggleDetailAction("like");
          return;
        }
        const detailRepost = event_7.target.closest("#x-detail-repost-btn");
        if (detailRepost) {
          event_7.preventDefault();
          openPostForwardSheet(currentDetailPostId);
          return;
        }
        const dmRow = event_7.target.closest(".x-dm-row[data-dm-id]");
        if (dmRow) {
          event_7.preventDefault();
          openDmChat(dmRow.dataset.dmId);
          return;
        }
        const emptyAddDmButton = event_7.target.closest(".x-empty-add-dm-btn");
        if (emptyAddDmButton) {
          event_7.preventDefault();
          openAddDmSheet();
          return;
        }
        const dmProfileButton = event_7.target.closest("[data-dm-profile-id]");
        if (dmProfileButton) {
          event_7.preventDefault();
          openDmProfile(dmProfileButton.dataset.dmProfileId);
          return;
        }
        const closeTrigger = event_7.target.closest("[data-x-close]");
        if (closeTrigger) {
          event_7.preventDefault();
          closeXApp();
          return;
        }
        const deleteCommentButton = event_7.target.closest(".x-comment-delete-btn");
        if (deleteCommentButton) {
          event_7.preventDefault();
          event_7.stopPropagation();
          deletePostComment(deleteCommentButton.dataset.commentId, deleteCommentButton.dataset.replyId || "");
          return;
        }
        const replyButton = event_7.target.closest(".x-comment-reply-btn");
        if (replyButton) {
          event_7.preventDefault();
          const commentId_4 = replyButton.dataset.commentId,
            replyId_4 = replyButton.dataset.replyId || "";
          let safeText_1584 = safeText(replyButton.dataset.replyName);
          if (!safeText_1584 && currentDetailPostId) {
            const postThread_1585 = getPostThread(currentDetailPostId),
              comment_16 = findCommentById(postThread_1585, commentId_4);
            safeText_1584 = replyId_4 ? safeText(findReplyById(comment_16, replyId_4)?.name, comment_16?.name || "comment") : safeText(comment_16?.name, "comment");
          }
          setReplyTarget({
            commentId: commentId_4,
            replyId: replyId_4,
            name: safeText_1584
          });
          return;
        }
        const trendRow_2 = event_7.target.closest(".x-trend-row");
        if (trendRow_2) {
          const topic_19 = trendRow_2.dataset.trendTitle || trendRow_2.querySelector("strong")?.textContent.trim();
          if (topic_19) openTopicDetail(topic_19);
          return;
        }
        const signBtn_2 = event_7.target.closest(".x-super-title-row button");
        if (signBtn_2 && !signBtn_2.disabled && currentActiveTopicId) {
          event_7.preventDefault();
          handleTopicSign(currentActiveTopicId);
          return;
        }
      });
      view.addEventListener("keydown", event_8 => {
        const trendRow = event_8.target.closest?.(".x-trend-row");
        if (!trendRow || event_8.key !== "Enter" && event_8.key !== " ") return;
        event_8.preventDefault();
        const topic_20 = trendRow.dataset.trendTitle || trendRow.querySelector("strong")?.textContent.trim();
        if (topic_20) openTopicDetail(topic_20);
      });
      [visitorsSheet, addDmSheet, dmSettingsSheet, searchGenerateSheet, advanceSheet, imagePreviewOverlay, createTopicSheet, postSettingsSheet, charEditSheet, editSuperTopicSheet, postForwardSheet].forEach(sheet => {
        sheet?.addEventListener("click", event_9 => {
          if (event_9.target === sheet) {
            if (sheet === visitorsSheet) closeVisitorsSheet();
            if (sheet === addDmSheet) closeAddDmSheet();
            if (sheet === dmSettingsSheet) closeDmSettingsSheet();
            if (sheet === searchGenerateSheet) closeSearchGenerateSheet();
            if (sheet === advanceSheet) closeAdvanceSheet();
            if (sheet === imagePreviewOverlay) closeImagePreview();
            if (sheet === createTopicSheet) closeCreateTopicSheet();
            if (sheet === postSettingsSheet) closePostSettingsSheet();
            if (sheet === charEditSheet) closeCharEditSheet();
            if (sheet === editSuperTopicSheet) closeEditSuperTopicSheet();
            if (sheet === postForwardSheet) closePostForwardSheet();
          }
        });
      });
      createTopicCancelBtn?.addEventListener("click", closeCreateTopicSheet);
      createTopicSaveBtn?.addEventListener("click", handleAction_100);
      createTopicImportBtn?.addEventListener("click", toggleTopicImportImessage);
      createTopicManualBtn?.addEventListener("click", handleAction_101);
      topicManualSaveBtn?.addEventListener("click", handleAction_102);
      superUpdateBtn?.addEventListener("click", handleAction_92);
      createTopicAvatarPreview?.addEventListener("click", () => createTopicAvatarInput?.click());
      bindFilePreview(createTopicAvatarInput, xImageCompressionPresets.avatar, src_2 => {
        createTopicAvatarDraft = src_2;
        renderImagePreview(createTopicAvatarPreview, src_2, "超");
      });
      createTopicBannerPreview?.addEventListener("click", () => createTopicBannerInput?.click());
      bindFilePreview(createTopicBannerInput, xImageCompressionPresets.cover, value_1592 => {
        banner_2 = value_1592;
        renderImagePreview(createTopicBannerPreview, value_1592, "Cover");
      });
      bindFilePreview(editAvatarInput, xImageCompressionPresets.avatar, src_3 => {
        avatarDraft = src_3;
        renderImagePreview(editAvatarPreview, avatarDraft, safeText(editNameInput?.value, "U").slice(0, 1).toUpperCase());
      });
      bindFilePreview(editBannerInput, xImageCompressionPresets.cover, value_1594 => {
        bannerDraft = value_1594;
        renderImagePreview(editBannerPreview, bannerDraft, "Cover");
      });
      bindFilePreview(document.getElementById("x-char-edit-avatar-input"), xImageCompressionPresets.avatar, src_4 => {
        charEditAvatarDraft = src_4;
        renderImagePreview(document.getElementById("x-char-edit-avatar-preview"), charEditAvatarDraft, safeText(document.getElementById("x-char-edit-name")?.value, "C").slice(0, 1).toUpperCase());
      });
      bindFilePreview(document.getElementById("x-char-edit-cover-input"), xImageCompressionPresets.cover, src_5 => {
        charEditCoverImageDraft = src_5;
        renderImagePreview(document.getElementById("x-char-edit-cover-preview"), src_5, "Cover");
      });
      bindFilePreview(document.getElementById("x-edit-super-topic-avatar-input"), xImageCompressionPresets.avatar, src_6 => {
        editSuperTopicAvatarDraft = src_6;
        renderImagePreview(document.getElementById("x-edit-super-topic-avatar-preview"), src_6, "超");
      });
      bindFilePreview(document.getElementById("x-edit-super-topic-banner-input"), xImageCompressionPresets.cover, src_7 => {
        editSuperTopicBannerDraft = src_7;
        renderImagePreview(document.getElementById("x-edit-super-topic-banner-preview"), src_7, "Cover");
      });
      bindFilePreview(composeImageInput, xImageCompressionPresets.post, src_8 => {
        composeImageDraft = src_8;
        renderComposeImageDraft();
      });
      const homeFeedButtons = Array.from(view.querySelectorAll(".x-home-feed-tabs button[data-feed]")),
        homeFeedPanels = Array.from(view.querySelectorAll(".x-feed-panel[data-feed-panel]"));
      homeFeedButtons.forEach(button_5 => {
        button_5.addEventListener("click", () => {
          switchButtonTabs(homeFeedButtons, homeFeedPanels, "data-feed", "data-feed-panel", button_5.getAttribute("data-feed"));
        });
      });
      const superTabButtons = Array.from(view.querySelectorAll("#x-super-profile-tabs button[data-super-tab]")),
        superPanels = Array.from(view.querySelectorAll(".x-super-feed[data-super-panel]"));
      superTabButtons.forEach(button_6 => {
        button_6.addEventListener("click", () => {
          switchButtonTabs(superTabButtons, superPanels, "data-super-tab", "data-super-panel", button_6.getAttribute("data-super-tab"));
        });
      });
      mainContent && (mainContent.addEventListener("touchstart", event_10 => {
        if (postDetailView?.classList.contains("active")) return;
        if (!event_10.touches || event_10.touches.length === 0) return;
        touchStartX = event_10.touches[0].clientX;
        touchStartY = event_10.touches[0].clientY;
        isTouching = true;
      }, {
        passive: true
      }), mainContent.addEventListener("touchend", event_11 => {
        if (!isTouching || !event_11.changedTouches || event_11.changedTouches.length === 0) return;
        isTouching = false;
        const endX = event_11.changedTouches[0].clientX,
          endY = event_11.changedTouches[0].clientY,
          diffX = touchStartX - endX,
          diffY = touchStartY - endY;
        if (Math.abs(diffX) < 52 || Math.abs(diffX) < Math.abs(diffY) * 1.25) return;
        diffX > 0 ? switchTab(Math.min(currentIndex + 1, navItems.length - 1)) : switchTab(Math.max(currentIndex - 1, 0));
      }, {
        passive: true
      }));
      window.addEventListener("resize", () => {
        if (!view.classList.contains("active")) return;
        updateIndicator(navItems[currentIndex]);
      });
      view.querySelectorAll(".x-scroll-area, .x-detail-scroll").forEach(area => {
        area.addEventListener("scroll", () => {
          if (area.scrollTop + area.clientHeight >= area.scrollHeight - 160) {
            area.closest("#x-home-tab") && loadMoreHomeFeedPosts();
            const hiddens = area.querySelectorAll(".x-hidden-page-2");
            hiddens.length > 0 && hiddens.forEach(el => {
              el.style.display = "";
              el.classList.remove("x-hidden-page-2");
            });
          }
        }, {
          passive: true
        });
      });
    }
  });
})();
