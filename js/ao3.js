(function () {
  "use strict";

  const scopeValue0 = "ao3",
    scopeValue1 = 6,
    scopeValue2 = "before-the-tide-arrives",
    scopeValue3 = 10000,
    scopeValue4 = 200,
    scopeValue5 = 10000,
    scopeValue6 = Object.freeze({
      style_creative_guidance: `<literary_guidance>
Literary Writing Guidance

I. Fundamental Logic

1. Narrative Principle
Summary and dramatized scene work should complement each other. Use concise narration to move through routine events, transitions, elapsed time, and background information. Fully dramatize emotional turns, character decisions, and other crucial moments through concrete scenes and detailed development; never rush past them.

2. Principle of Restraint
Reveal only a small portion of emotion and background information, leaving most of it beneath the surface. Imply emotion through actions, details, and contrasting scenery instead of directly stating that someone is sad or happy. What remains unsaid should carry more force than explanation.

3. Form Serves Content
Every description, figure of speech, and plot arrangement must shape character, advance conflict, or deepen theme. Remove ornamental language and showy description that do not serve the central story.

4. Narrative Distance
Deliberately adjust the emotional, moral, temporal, and cognitive distance between reader and character. Excessive closeness can erase suspense; excessive distance can flatten character. Control how much the reader knows and when that knowledge arrives.

5. Timeline
Anchor fragments of the past to concrete objects, sounds, and situations in the present so that memory arises naturally instead of entering as a forced flashback. Let past and present echo each other to deepen emotional history without interrupting narrative flow.

II. Language and Prose Rules

1. Diction
Prefer short, concrete words and active constructions. Remove unnecessary adverbs and clichés. Replace abstract emotion words with specific images and objects. Break this rule only for a deliberate artistic effect.

2. Rhythm
Use longer, flowing sentences in quiet or reflective scenes so the prose can breathe. Use short, fractured sentences in tense or confrontational scenes to create pressure and urgency. Alternate sentence lengths instead of maintaining one rhythm throughout.

3. Single-Sense Focus
When describing a scene, select one representative sensory detail rather than piling up adjectives to intensify the effect. Metaphors must arise from the character's own experience and viewpoint, never from the author's desire to display elegant language.

4. Minimalist Expression
Resist ornamental language. Let plain, everyday details carry emotional weight. Revise by subtraction: remove excess lines and repeated statements that express the same idea.

5. Emotion Through Scenery
In calm moments, let the environment harmonize with the character's state of mind. At emotional turns or breaking points, contrasting scenery may deepen the emotional layers.

6. Literary Reference and Emulation
Draw extensively on and emulate relevant literary classics.

III. Character, Dialogue, and Foreshadowing

1. Echoing Details
Objects, lines, and habits deliberately introduced earlier should later receive resolution or serve a purpose. Avoid useless incidental details, or keep them extremely brief.

2. Subtextual Dialogue
Characters rarely state their true thoughts directly. They conceal them through avoidance, testing questions, counterquestions, and changes of subject. Include pauses and interruptions so dialogue feels natural. Give every character distinct speaking logic and verbal habits; avoid making every voice sound alike. Use actions instead of emotional dialogue tags. Say less and do more.

3. Open-Ended Conclusions
Close with an incomplete sentence or a quiet image instead of explaining the emotion and theme in full. The emotional arc may move from repression, to a restrained release, and finally back into silence.
</literary_guidance>`,
      style_baimiao: `<writing_style name="文风-白描">
Use plain description. Prefer nouns and verbs over adjectives.
Show emotion through actions, objects, silence, distance, light, sound, smell, and touch.
Avoid ornate metaphors, abstract emotional labels, and author commentary.
Keep sentences clean and concrete. Let the reader infer what the characters feel from what they do.
</writing_style>`
    }),
    scopeValue7 = Object.freeze({
      style_baimiao: {
        name: "白开水",
        text: scopeValue6.style_baimiao
      }
    });
  let scopeValue8 = null,
    scopeValue9 = scopeValue41(),
    scopeValue10 = {
      name: "home",
      params: {}
    },
    scopeValue11 = [],
    scopeValue12 = null,
    scopeValue13 = Promise.resolve(),
    scopeValue14 = "",
    scopeValue15 = null,
    newScope16 = null,
    scopeValue16 = null,
    scopeValue17 = null,
    scopeValue18 = null,
    scopeValue19 = null;
  const scopeValue20 = new Set();
  function scopeValue21(scopeValue177, scopeValue178 = "", scopeValue179 = 500) {
    const scopeValue180 = String(scopeValue177 == null ? "" : scopeValue177).trim().slice(0, scopeValue179);
    return scopeValue180 || scopeValue178;
  }
  function scopeValue22(scopeValue181, scopeValue182 = "") {
    const scopeValue183 = String(scopeValue181 == null ? "" : scopeValue181).trim();
    return scopeValue183 || scopeValue182;
  }
  function scopeValue23(scopeValue184) {
    const scopeValue185 = String(scopeValue184 || "").trim();
    if (!scopeValue185) return "";
    return /^(?:data:image\/(?:png|jpe?g|webp|gif);base64,|blob:|https?:\/\/)/i.test(scopeValue185) ? scopeValue185 : "";
  }
  function scopeValue24(scopeValue186) {
    return String(scopeValue186 == null ? "" : scopeValue186).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function scopeValue25(scopeValue187) {
    return JSON.parse(JSON.stringify(scopeValue187));
  }
  function scopeValue26() {
    const scopeValue188 = new Date();
    return scopeValue188.getFullYear() + "-" + String(scopeValue188.getMonth() + 1).padStart(2, "0") + "-" + String(scopeValue188.getDate()).padStart(2, "0");
  }
  function scopeValue27(scopeValue189, scopeValue190 = new Date().toISOString()) {
    return Number.isFinite(Date.parse(scopeValue189)) ? new Date(scopeValue189).toISOString() : scopeValue190;
  }
  function scopeValue28(scopeValue191, scopeValue192 = 40, scopeValue193 = 160) {
    const scopeValue194 = Array.isArray(scopeValue191) ? scopeValue191 : String(scopeValue191 || "").split(/[,，\n]/);
    return scopeValue194.map(scopeValue195 => scopeValue21(scopeValue195, "", scopeValue193)).filter((scopeValue196, scopeValue197, scopeValue198) => scopeValue196 && scopeValue198.indexOf(scopeValue196) === scopeValue197).slice(0, scopeValue192);
  }
  function scopeValue29() {
    const scopeValue199 = typeof window.getUserState === "function" ? window.getUserState() : window.userState || {};
    return {
      pseud: scopeValue21(scopeValue199?.name, "MoonlitArchivist", 40),
      avatarUrl: scopeValue23(scopeValue199?.avatarUrl || scopeValue199?.avatar),
      bio: scopeValue21(scopeValue199?.signature || scopeValue199?.persona, "收藏故事，也在等待写下自己的故事。", 800),
      joinedAt: scopeValue26()
    };
  }
  function scopeValue30(scopeValue200, scopeValue201 = 0) {
    if (typeof scopeValue200 === "string") return {
      name: scopeValue21(scopeValue200, "角色 " + (scopeValue201 + 1), 80),
      gender: "未设定",
      persona: ""
    };
    if (!scopeValue200 || typeof scopeValue200 !== "object") return null;
    const scopeValue202 = scopeValue21(scopeValue200.name, "", 80);
    return scopeValue202 ? {
      name: scopeValue202,
      gender: scopeValue21(scopeValue200.gender, "未设定", 40),
      persona: scopeValue22(scopeValue200.persona)
    } : null;
  }
  function scopeValue31(scopeValue203, scopeValue204 = 0) {
    if (!scopeValue203 || typeof scopeValue203 !== "object") return null;
    const scopeValue205 = scopeValue203.contentEdited === true,
      newScope215 = String(scopeValue203.content || (Array.isArray(scopeValue203.paragraphs) ? scopeValue203.paragraphs.join("\n\n") : "")).replace(/\r\n?/g, "\n").slice(0, 200000),
      newScope216 = scopeValue205 ? newScope215 : scopeValue91(newScope215).join("\n\n");
    if (!newScope216.trim()) return null;
    return {
      id: scopeValue21(scopeValue203.id, "chapter-" + (scopeValue204 + 1), 100),
      title: scopeValue21(scopeValue203.title, "第 " + (scopeValue204 + 1) + " 章", 160),
      content: newScope216,
      contentEdited: scopeValue205,
      summary: scopeValue21(scopeValue203.summary || scopeValue203.chapterSummary, "", 4000),
      notes: scopeValue21(scopeValue203.notes, "", 4000),
      relationships: scopeValue28(scopeValue203.relationships || scopeValue203.cpRelationships || [], 30, 160),
      targetWords: Math.min(scopeValue5, Math.max(scopeValue4, Math.trunc(Number(scopeValue203.targetWords) || 800))),
      usedContinuation: scopeValue203.usedContinuation === true,
      createdAt: scopeValue27(scopeValue203.createdAt)
    };
  }
  function scopeValue32(scopeValue206) {
    return scopeValue206?.key === "style_green_apple" || scopeValue206?.id === "style_green_apple" || /<writing_style\b[^>]*\bname=["']文风-青苹果["']/.test(String(scopeValue206?.text || ""));
  }
  function scopeValue33(scopeValue207, scopeValue208 = 0) {
    if (!scopeValue207 || typeof scopeValue207 !== "object") return null;
    const scopeValue209 = scopeValue21(scopeValue207.id, "ao3-work-" + (scopeValue208 + 1), 120),
      scopeValue210 = (Array.isArray(scopeValue207.chapters) ? scopeValue207.chapters : []).map(scopeValue31).filter(Boolean).slice(0, 500);
    if (!scopeValue209 || !scopeValue210.length) return null;
    const scopeValue211 = (Array.isArray(scopeValue207.characters) ? scopeValue207.characters : []).map(scopeValue30).filter(Boolean).slice(0, 50),
      scopeValue212 = scopeValue207.writingStyle && typeof scopeValue207.writingStyle === "object" && !scopeValue32(scopeValue207.writingStyle) ? scopeValue207.writingStyle : {},
      scopeValue213 = scopeValue207.baseStats && typeof scopeValue207.baseStats === "object" ? scopeValue207.baseStats : {};
    return {
      id: scopeValue209,
      title: scopeValue21(scopeValue207.title, "未命名作品", 160),
      authorPseud: scopeValue21(scopeValue207.authorPseud, "", 40),
      fandom: scopeValue21(scopeValue207.fandom, "Original Work / 原创作品", 240),
      relationship: scopeValue21(scopeValue207.relationship, "", 400),
      characters: scopeValue211,
      tags: scopeValue28(scopeValue207.tags || [], 40, 160),
      rating: scopeValue21(scopeValue207.rating, "Not Rated", 100),
      warning: scopeValue21(scopeValue207.warning, "Creator Chose Not To Use Archive Warnings", 160),
      category: scopeValue21(scopeValue207.category, "Gen", 40),
      language: scopeValue21(scopeValue207.language, "中文-普通话 國語", 80),
      series: scopeValue21(scopeValue207.series, "", 160),
      published: /^\d{4}-\d{2}-\d{2}$/.test(String(scopeValue207.published || "")) ? scopeValue207.published : scopeValue26(),
      updatedAt: scopeValue27(scopeValue207.updatedAt),
      summary: scopeValue21(scopeValue207.summary, "暂无简介。", 2000),
      worldBookIds: scopeValue28(scopeValue207.worldBookIds || [], 100, 120),
      writingStyle: {
        key: scopeValue21(scopeValue212.key, "style_baimiao", 100),
        name: scopeValue21(scopeValue212.name, "白开水", 100),
        text: scopeValue21(scopeValue212.text, scopeValue7.style_baimiao.text, 50000)
      },
      baseStats: {
        kudos: Math.max(0, Math.trunc(Number(scopeValue213.kudos) || 0)),
        bookmarks: Math.max(0, Math.trunc(Number(scopeValue213.bookmarks) || 0)),
        hits: Math.max(0, Math.trunc(Number(scopeValue213.hits) || 0))
      },
      chapters: scopeValue210
    };
  }
  function scopeValue34(scopeValue214, scopeValue215 = 0) {
    if (!scopeValue214 || typeof scopeValue214 !== "object") return null;
    const scopeValue216 = scopeValue21(scopeValue214.text || scopeValue214.comment, "", scopeValue3);
    if (!scopeValue216) return null;
    return {
      id: scopeValue21(scopeValue214.id, "reply-" + (scopeValue215 + 1), 100),
      pseud: scopeValue21(scopeValue214.pseud || scopeValue214.name, "Anonymous", 40),
      text: scopeValue216,
      translationZh: scopeValue21(scopeValue214.translationZh, "", scopeValue3),
      createdAt: scopeValue27(scopeValue214.createdAt),
      generated: scopeValue214.generated === true
    };
  }
  function scopeValue35(scopeValue217, scopeValue218 = 0) {
    if (!scopeValue217 || typeof scopeValue217 !== "object") return null;
    const scopeValue219 = scopeValue21(scopeValue217.text, "", scopeValue3);
    return scopeValue219 ? {
      id: scopeValue21(scopeValue217.id, "comment-" + (scopeValue218 + 1), 100),
      pseud: scopeValue21(scopeValue217.pseud, "Anonymous", 40),
      text: scopeValue219,
      translationZh: scopeValue21(scopeValue217.translationZh, "", scopeValue3),
      createdAt: scopeValue27(scopeValue217.createdAt),
      chapterId: scopeValue21(scopeValue217.chapterId, "", 100),
      generated: scopeValue217.generated === true
    } : null;
  }
  function scopeValue36(scopeValue220, scopeValue221 = 0) {
    if (!scopeValue220 || typeof scopeValue220 !== "object") return null;
    const scopeValue222 = scopeValue30(scopeValue220.character || (Array.isArray(scopeValue220.characters) ? scopeValue220.characters[0] : null), scopeValue221),
      scopeValue223 = scopeValue21(scopeValue220.name, scopeValue222?.name || "", 60),
      scopeValue224 = scopeValue22(scopeValue220.userPersona || scopeValue220.user?.persona);
    return scopeValue223 && scopeValue222 ? {
      id: scopeValue21(scopeValue220.id, "character-preset-" + (scopeValue221 + 1), 100),
      name: scopeValue223,
      character: scopeValue222,
      userPersona: scopeValue224
    } : null;
  }
  function scopeValue37(scopeValue225) {
    const scopeValue226 = [];
    return (Array.isArray(scopeValue225) ? scopeValue225 : []).forEach((scopeValue227, scopeValue228) => {
      const scopeValue229 = Array.isArray(scopeValue227?.characters) ? scopeValue227.characters : [scopeValue227?.character];
      scopeValue229.map(scopeValue30).filter(Boolean).forEach((scopeValue230, scopeValue231) => {
        const scopeValue232 = scopeValue36({
          id: scopeValue231 === 0 ? scopeValue227?.id : scopeValue21(scopeValue227?.id, "character-preset-" + (scopeValue228 + 1), 80) + "-" + (scopeValue231 + 1),
          name: scopeValue230.name || scopeValue227?.name,
          character: scopeValue230,
          userPersona: scopeValue227?.userPersona || scopeValue227?.user?.persona
        }, scopeValue226.length);
        if (scopeValue232 && !scopeValue226.some(scopeValue233 => scopeValue233.id === scopeValue232.id || scopeValue233.name === scopeValue232.name)) scopeValue226.push(scopeValue232);
      });
    }), scopeValue226.slice(0, 100);
  }
  function scopeValue38(scopeValue234, scopeValue235 = 0) {
    if (!scopeValue234 || typeof scopeValue234 !== "object") return null;
    const scopeValue236 = scopeValue21(scopeValue234.relationship || scopeValue234.value || scopeValue234.name, "", 160);
    if (!scopeValue236) return null;
    return {
      id: scopeValue21(scopeValue234.id, "cp-preset-" + (scopeValue235 + 1), 100),
      name: scopeValue21(scopeValue234.name, scopeValue236, 160),
      relationship: scopeValue236
    };
  }
  function scopeValue39(scopeValue237) {
    const scopeValue238 = [];
    return (Array.isArray(scopeValue237) ? scopeValue237 : []).forEach((scopeValue239, scopeValue240) => {
      const scopeValue241 = scopeValue38(scopeValue239, scopeValue240);
      if (scopeValue241 && !scopeValue238.some(scopeValue242 => scopeValue242.id === scopeValue241.id || scopeValue242.relationship === scopeValue241.relationship)) scopeValue238.push(scopeValue241);
    }), scopeValue238.slice(0, 100);
  }
  function scopeValue40(scopeValue243, scopeValue244 = 0) {
    if (!scopeValue243 || typeof scopeValue243 !== "object" || scopeValue32(scopeValue243)) return null;
    const scopeValue245 = scopeValue21(scopeValue243.name, "", 60),
      scopeValue246 = scopeValue21(scopeValue243.text, "", 2000);
    return scopeValue245 && scopeValue246 ? {
      id: scopeValue21(scopeValue243.id, "style-preset-" + (scopeValue244 + 1), 100),
      name: scopeValue245,
      text: scopeValue246
    } : null;
  }
  function scopeValue41() {
    return {
      schemaVersion: scopeValue1,
      profileInitialized: true,
      profile: scopeValue29(),
      works: [],
      characterPresets: [],
      cpPresets: [],
      stylePresets: [],
      kudosByWork: {},
      commentsByWork: {},
      repliesByComment: {},
      deletedCommentIdsByWork: {},
      history: [],
      lastChapterByWork: {}
    };
  }
  function scopeValue42(scopeValue247) {
    const scopeValue248 = scopeValue247 && typeof scopeValue247 === "object" ? scopeValue247 : {},
      scopeValue249 = scopeValue29(),
      scopeValue250 = scopeValue248.profile && typeof scopeValue248.profile === "object" ? scopeValue248.profile : {},
      scopeValue251 = (Array.isArray(scopeValue248.works) ? scopeValue248.works : []).filter(scopeValue259 => String(scopeValue259?.id || "") !== scopeValue2 && scopeValue259?.isSeed !== true).map(scopeValue33).filter(Boolean).slice(0, 300),
      scopeValue252 = new Set(scopeValue251.map(scopeValue260 => scopeValue260.id)),
      scopeValue253 = {},
      scopeValue254 = {},
      scopeValue255 = {},
      scopeValue256 = {},
      scopeValue257 = {};
    scopeValue251.forEach(scopeValue261 => {
      const scopeValue262 = Array.isArray(scopeValue248.commentsByWork?.[scopeValue261.id]) ? scopeValue248.commentsByWork[scopeValue261.id] : [],
        scopeValue263 = new Set(scopeValue261.chapters.map(scopeValue266 => scopeValue266.id));
      scopeValue253[scopeValue261.id] = scopeValue262.map(scopeValue35).filter(Boolean).map(scopeValue267 => ({
        ...scopeValue267,
        chapterId: scopeValue263.has(scopeValue267.chapterId) ? scopeValue267.chapterId : scopeValue261.chapters[0].id
      })).slice(-200);
      const scopeValue264 = new Set(scopeValue253[scopeValue261.id].map(scopeValue268 => scopeValue268.id)),
        scopeValue265 = scopeValue248.repliesByComment?.[scopeValue261.id] && typeof scopeValue248.repliesByComment[scopeValue261.id] === "object" ? scopeValue248.repliesByComment[scopeValue261.id] : {};
      scopeValue254[scopeValue261.id] = {};
      scopeValue264.forEach(scopeValue269 => {
        const scopeValue270 = scopeValue262.find(scopeValue273 => String(scopeValue273?.id || "") === String(scopeValue269)),
          scopeValue271 = Array.isArray(scopeValue265[scopeValue269]) ? scopeValue265[scopeValue269] : Array.isArray(scopeValue270?.replies) ? scopeValue270.replies : [],
          scopeValue272 = scopeValue271.map(scopeValue34).filter(Boolean).slice(-100);
        if (scopeValue272.length) scopeValue254[scopeValue261.id][scopeValue269] = scopeValue272;
      });
      scopeValue255[scopeValue261.id] = scopeValue28(scopeValue248.deletedCommentIdsByWork?.[scopeValue261.id] || [], 300, 100).filter(scopeValue274 => scopeValue264.has(scopeValue274));
      scopeValue256[scopeValue261.id] = scopeValue248.kudosByWork?.[scopeValue261.id] === true;
      scopeValue257[scopeValue261.id] = Math.min(scopeValue261.chapters.length, Math.max(1, Math.trunc(Number(scopeValue248.lastChapterByWork?.[scopeValue261.id]) || 1)));
    });
    const scopeValue258 = (Array.isArray(scopeValue248.history) ? scopeValue248.history : []).filter(scopeValue275 => scopeValue252.has(String(scopeValue275?.workId || ""))).slice(-100).map(scopeValue276 => {
      const scopeValue277 = scopeValue251.find(scopeValue278 => scopeValue278.id === String(scopeValue276.workId));
      return {
        workId: scopeValue277.id,
        chapter: Math.min(scopeValue277.chapters.length, Math.max(1, Math.trunc(Number(scopeValue276.chapter) || 1))),
        visitedAt: scopeValue27(scopeValue276.visitedAt)
      };
    });
    return {
      schemaVersion: scopeValue1,
      profileInitialized: scopeValue248.profileInitialized !== false,
      profile: {
        pseud: scopeValue21(scopeValue250.pseud, scopeValue249.pseud, 40),
        avatarUrl: scopeValue23(scopeValue250.avatarUrl || scopeValue249.avatarUrl),
        bio: scopeValue21(scopeValue250.bio, scopeValue249.bio, 800),
        joinedAt: /^\d{4}-\d{2}-\d{2}$/.test(String(scopeValue250.joinedAt || "")) ? scopeValue250.joinedAt : scopeValue249.joinedAt
      },
      works: scopeValue251,
      characterPresets: scopeValue37(scopeValue248.characterPresets),
      cpPresets: scopeValue39(scopeValue248.cpPresets || scopeValue248.relationshipPresets),
      stylePresets: (Array.isArray(scopeValue248.stylePresets) ? scopeValue248.stylePresets : []).map(scopeValue40).filter(Boolean).slice(0, 100),
      kudosByWork: scopeValue256,
      commentsByWork: scopeValue253,
      repliesByComment: scopeValue254,
      deletedCommentIdsByWork: scopeValue255,
      history: scopeValue258,
      lastChapterByWork: scopeValue257
    };
  }
  function scopeValue43(scopeValue279, scopeValue280) {
    return scopeValue279?.works?.find(scopeValue281 => scopeValue281.id === String(scopeValue280 || "")) || null;
  }
  function scopeValue44(scopeValue282 = scopeValue10.params.workId || "") {
    return scopeValue43(scopeValue9, scopeValue282) || null;
  }
  function scopeValue45(scopeValue283, scopeValue284 = null) {
    const scopeValue285 = typeof scopeValue284 === "string" ? scopeValue44(scopeValue284) : scopeValue284;
    return Math.min(Math.max(1, scopeValue285?.chapters?.length || 1), Math.max(1, Math.trunc(Number(scopeValue283) || 1)));
  }
  function scopeValue46(scopeValue286, scopeValue287) {
    const scopeValue288 = scopeValue42(scopeValue286),
      scopeValue289 = String(scopeValue287 || "");
    if (!scopeValue43(scopeValue288, scopeValue289) || scopeValue288.kudosByWork[scopeValue289]) return {
      state: scopeValue288,
      added: false
    };
    return scopeValue288.kudosByWork[scopeValue289] = true, {
      state: scopeValue288,
      added: true
    };
  }
  function scopeValue47(scopeValue290, scopeValue291, scopeValue292, scopeValue293) {
    const scopeValue294 = scopeValue42(scopeValue290),
      scopeValue295 = String(scopeValue291 || ""),
      scopeValue296 = scopeValue43(scopeValue294, scopeValue295);
    if (!scopeValue296) return {
      state: scopeValue294,
      added: false
    };
    const scopeValue297 = String(scopeValue292 || "");
    if (!scopeValue296.chapters.some(scopeValue299 => scopeValue299.id === scopeValue297)) return {
      state: scopeValue294,
      added: false
    };
    const scopeValue298 = scopeValue35({
      ...scopeValue293,
      chapterId: scopeValue297
    }, scopeValue294.commentsByWork[scopeValue295]?.length || 0);
    if (!scopeValue298) return {
      state: scopeValue294,
      added: false
    };
    return scopeValue294.commentsByWork[scopeValue295] = [...(scopeValue294.commentsByWork[scopeValue295] || []), scopeValue298].slice(-200), {
      state: scopeValue294,
      added: true
    };
  }
  function scopeValue48(scopeValue300, scopeValue301, scopeValue302, scopeValue303) {
    const scopeValue304 = scopeValue42(scopeValue300),
      scopeValue305 = String(scopeValue301 || ""),
      scopeValue306 = String(scopeValue302 || "");
    if (!scopeValue73(scopeValue305, scopeValue304).some(scopeValue308 => scopeValue308.id === scopeValue306)) return {
      state: scopeValue304,
      added: false
    };
    const scopeValue307 = scopeValue34(scopeValue303, scopeValue75(scopeValue305, scopeValue306, scopeValue304).length);
    if (!scopeValue307) return {
      state: scopeValue304,
      added: false
    };
    if (!scopeValue304.repliesByComment[scopeValue305]) scopeValue304.repliesByComment[scopeValue305] = {};
    return scopeValue304.repliesByComment[scopeValue305][scopeValue306] = [...scopeValue75(scopeValue305, scopeValue306, scopeValue304), scopeValue307].slice(-100), {
      state: scopeValue304,
      added: true
    };
  }
  function scopeValue49(scopeValue309, scopeValue310, scopeValue311) {
    const scopeValue312 = scopeValue42(scopeValue309),
      scopeValue313 = String(scopeValue310 || ""),
      scopeValue314 = String(scopeValue311 || "");
    if (!scopeValue73(scopeValue313, scopeValue312).some(scopeValue316 => scopeValue316.id === scopeValue314)) return {
      state: scopeValue312,
      deleted: false
    };
    const scopeValue315 = scopeValue312.commentsByWork[scopeValue313]?.length || 0;
    scopeValue312.commentsByWork[scopeValue313] = (scopeValue312.commentsByWork[scopeValue313] || []).filter(scopeValue317 => scopeValue317.id !== scopeValue314);
    if ((scopeValue312.commentsByWork[scopeValue313]?.length || 0) === scopeValue315) scopeValue312.deletedCommentIdsByWork[scopeValue313] = scopeValue28([...(scopeValue312.deletedCommentIdsByWork[scopeValue313] || []), scopeValue314], 300, 100);
    if (scopeValue312.repliesByComment[scopeValue313]) delete scopeValue312.repliesByComment[scopeValue313][scopeValue314];
    return {
      state: scopeValue312,
      deleted: true
    };
  }
  function scopeValue50(scopeValue318, scopeValue319, scopeValue320, scopeValue321) {
    const scopeValue322 = scopeValue42(scopeValue318),
      scopeValue323 = String(scopeValue319 || ""),
      scopeValue324 = String(scopeValue320 || ""),
      scopeValue325 = String(scopeValue321 || ""),
      scopeValue326 = scopeValue75(scopeValue323, scopeValue324, scopeValue322),
      scopeValue327 = scopeValue326.filter(scopeValue328 => scopeValue328.id !== scopeValue325);
    if (scopeValue327.length === scopeValue326.length) return {
      state: scopeValue322,
      deleted: false
    };
    if (!scopeValue322.repliesByComment[scopeValue323]) scopeValue322.repliesByComment[scopeValue323] = {};
    return scopeValue322.repliesByComment[scopeValue323][scopeValue324] = scopeValue327, {
      state: scopeValue322,
      deleted: true
    };
  }
  function scopeValue51(scopeValue329, scopeValue330, scopeValue331) {
    const scopeValue332 = scopeValue42(scopeValue329),
      scopeValue333 = scopeValue43(scopeValue332, scopeValue330),
      scopeValue334 = String(scopeValue331 || "");
    if (!scopeValue333 || scopeValue333.chapters.length <= 1) return {
      state: scopeValue332,
      deleted: false
    };
    const scopeValue335 = scopeValue333.chapters.findIndex(scopeValue338 => scopeValue338.id === scopeValue334);
    if (scopeValue335 < 0) return {
      state: scopeValue332,
      deleted: false
    };
    const scopeValue336 = new Set((scopeValue332.commentsByWork[scopeValue333.id] || []).filter(scopeValue339 => scopeValue339.chapterId === scopeValue334).map(scopeValue340 => scopeValue340.id));
    scopeValue333.chapters.splice(scopeValue335, 1);
    scopeValue333.updatedAt = new Date().toISOString();
    scopeValue332.commentsByWork[scopeValue333.id] = (scopeValue332.commentsByWork[scopeValue333.id] || []).filter(scopeValue341 => scopeValue341.chapterId !== scopeValue334);
    scopeValue336.forEach(scopeValue342 => {
      if (scopeValue332.repliesByComment[scopeValue333.id]) delete scopeValue332.repliesByComment[scopeValue333.id][scopeValue342];
    });
    const scopeValue337 = scopeValue335 + 1;
    return scopeValue332.lastChapterByWork[scopeValue333.id] = Math.min(scopeValue333.chapters.length, Math.max(1, scopeValue337)), scopeValue332.history = scopeValue332.history.map(scopeValue343 => scopeValue343.workId !== scopeValue333.id ? scopeValue343 : {
      ...scopeValue343,
      chapter: Math.min(scopeValue333.chapters.length, scopeValue343.chapter > scopeValue337 ? scopeValue343.chapter - 1 : scopeValue343.chapter)
    }), {
      state: scopeValue332,
      deleted: true,
      chapter: scopeValue332.lastChapterByWork[scopeValue333.id]
    };
  }
  function scopeValue52(scopeValue344, scopeValue345) {
    const scopeValue346 = scopeValue42(scopeValue344),
      scopeValue347 = String(scopeValue345 || ""),
      scopeValue348 = scopeValue346.works.length;
    scopeValue346.works = scopeValue346.works.filter(scopeValue349 => scopeValue349.id !== scopeValue347);
    if (scopeValue346.works.length === scopeValue348) return {
      state: scopeValue346,
      deleted: false
    };
    return delete scopeValue346.commentsByWork[scopeValue347], delete scopeValue346.repliesByComment[scopeValue347], delete scopeValue346.deletedCommentIdsByWork[scopeValue347], delete scopeValue346.kudosByWork[scopeValue347], delete scopeValue346.lastChapterByWork[scopeValue347], scopeValue346.history = scopeValue346.history.filter(scopeValue350 => scopeValue350.workId !== scopeValue347), {
      state: scopeValue346,
      deleted: true
    };
  }
  function scopeValue53(scopeValue351, scopeValue352, newScope363, scopeValue354) {
    const scopeValue357 = String(scopeValue354.title || "").trim(),
      newScope366 = String(scopeValue354.content || "").replace(/\r\n?/g, "\n"),
      newScope367 = String(scopeValue354.notes || "").replace(/\r\n?/g, "\n").trim();
    if (!scopeValue357) throw new Error("章节标题不能为空。");
    if (!newScope366.trim()) throw new Error("正文不能为空。");
    if (scopeValue357.length > 160 || newScope366.length > 200000 || newScope367.length > 4000) throw new Error("标题、正文或注释超出字数上限。");
    const newScope368 = scopeValue42(scopeValue351),
      newScope369 = scopeValue43(newScope368, scopeValue352),
      newScope370 = newScope369?.["chapters"]["find"](newScope371 => newScope371.id === String(newScope363 || ""));
    if (!newScope370) throw new Error("要编辑的章节不存在。");
    return newScope370.contentEdited = newScope370.contentEdited || newScope366 !== newScope370.content, Object.assign(newScope370, {
      title: scopeValue357,
      content: newScope366,
      notes: newScope367
    }), newScope369.updatedAt = new Date().toISOString(), {
      state: newScope368,
      work: newScope369,
      chapter: newScope370
    };
  }
  function newScope54(newScope372, newScope373) {
    return [newScope372.title, newScope372.authorPseud || newScope373?.["pseud"], newScope372.fandom, newScope372.relationship, ...newScope372.characters.map(newScope374 => newScope374.name + " " + newScope374.gender + " " + newScope374.persona), ...newScope372.tags, newScope372.summary].join(" ").toLocaleLowerCase("zh-CN");
  }
  function scopeValue54(newScope375, newScope376 = scopeValue9.profile, newScope377 = scopeValue9) {
    const newScope378 = String(newScope375 || "").trim().toLocaleLowerCase("zh-CN"),
      newScope379 = Array.isArray(newScope377?.["works"]) ? newScope377.works : [];
    return !newScope378 ? newScope379 : newScope379.filter(newScope380 => newScope54(newScope380, newScope376).includes(newScope378));
  }
  function scopeValue55(newScope381) {
    return {
      name: newScope381?.["name"] || "home",
      params: {
        ...(newScope381?.["params"] || {})
      }
    };
  }
  function scopeValue56() {
    scopeValue8 = {
      view: document.getElementById("ao3-view"),
      scroll: document.getElementById("ao3-site-scroll"),
      content: document.getElementById("ao3-page-content"),
      historyBack: document.getElementById("ao3-history-back"),
      profileName: document.getElementById("ao3-header-profile-name"),
      headerSearch: document.getElementById("ao3-header-search"),
      headerSearchInput: document.getElementById("ao3-header-search-input"),
      profileOverlay: document.getElementById("ao3-profile-edit-overlay"),
      profileForm: document.getElementById("ao3-profile-edit-form"),
      profilePseud: document.getElementById("ao3-profile-pseud-input"),
      profileBio: document.getElementById("ao3-profile-bio-input"),
      profileAvatarInput: document.getElementById("ao3-profile-avatar-input"),
      profileAvatarPreview: document.getElementById("ao3-profile-avatar-preview"),
      profileError: document.getElementById("ao3-profile-edit-error"),
      composerOverlay: document.getElementById("ao3-composer-overlay"),
      composerForm: document.getElementById("ao3-composer-form"),
      composerTitle: document.getElementById("ao3-composer-title"),
      composerSubtitle: document.getElementById("ao3-composer-subtitle"),
      composerError: document.getElementById("ao3-composer-error"),
      chapterEditOverlay: document.getElementById("ao3-chapter-edit-overlay"),
      chapterEditForm: document.getElementById("ao3-chapter-edit-form"),
      chapterEditTitle: document.getElementById("ao3-chapter-edit-title-input"),
      chapterEditContent: document.getElementById("ao3-chapter-edit-content-input"),
      chapterEditNotes: document.getElementById("ao3-chapter-edit-notes-input"),
      chapterEditError: document.getElementById("ao3-chapter-edit-error"),
      generating: document.getElementById("ao3-generating"),
      composerSubmit: document.getElementById("ao3-composer-submit"),
      toast: document.getElementById("ao3-toast")
    };
  }
  function scopeValue57(scopeValue361) {
    if (typeof window.mobileInputCompat?.isSendEnter === "function") return window.mobileInputCompat.isSendEnter(scopeValue361);
    return scopeValue361?.key === "Enter" && !scopeValue361.isComposing && scopeValue361.keyCode !== 229 && !scopeValue361.shiftKey && !scopeValue361.ctrlKey && !scopeValue361.metaKey && !scopeValue361.altKey;
  }
  function scopeValue58(scopeValue362) {
    const scopeValue363 = document.activeElement;
    if (scopeValue363 && scopeValue362?.contains(scopeValue363) && typeof scopeValue363.blur === "function") scopeValue363.blur();
  }
  function scopeValue59(scopeValue364, scopeValue365 = scopeValue8?.view) {
    if (!scopeValue364 || !scopeValue365) return null;
    if (scopeValue364.closest?.("#ao3-chapter-edit-overlay")) return scopeValue365.querySelector(".ao3-chapter-edit-scroll");
    if (scopeValue364.closest?.("#ao3-composer-overlay")) return scopeValue365.querySelector(".ao3-composer-scroll");
    if (scopeValue364.closest?.("#ao3-profile-edit-overlay")) return scopeValue365.querySelector(".ao3-profile-edit-card");
    if (scopeValue364.closest?.(".ao3-site-header")) return null;
    return scopeValue365.querySelector(".ao3-site-scroll");
  }
  function scopeValue60(scopeValue366, scopeValue367 = scopeValue59(scopeValue366)) {
    if (!scopeValue366 || scopeValue366.disabled) return;
    scopeValue366.focus?.({
      preventScroll: true
    });
    if (!scopeValue367) return;
    requestAnimationFrame(() => {
      if (!scopeValue366.isConnected || !scopeValue367.isConnected) return;
      const scopeValue368 = scopeValue367.getBoundingClientRect(),
        scopeValue369 = scopeValue366.getBoundingClientRect(),
        scopeValue370 = 16;
      if (scopeValue366.closest?.("#ao3-chapter-edit-overlay") && scopeValue369.bottom - scopeValue369.top > scopeValue368.bottom - scopeValue368.top - scopeValue370 * 2) {
        const newScope392 = Math.min(scopeValue369.bottom, scopeValue368.bottom - scopeValue370) - Math.max(scopeValue369.top, scopeValue368.top + scopeValue370);
        if (newScope392 >= 24) return;
        scopeValue367.scrollTop += scopeValue369.top - scopeValue368.top - scopeValue370;
        return;
      }
      if (scopeValue369.top < scopeValue368.top + scopeValue370) scopeValue367.scrollTop += scopeValue369.top - scopeValue368.top - scopeValue370;else {
        if (scopeValue369.bottom > scopeValue368.bottom - scopeValue370) scopeValue367.scrollTop += scopeValue369.bottom - scopeValue368.bottom + scopeValue370;
      }
    });
  }
  function scopeValue61(scopeValue371) {
    if (scopeValue371.target !== scopeValue8?.profilePseud || !scopeValue57(scopeValue371)) return;
    scopeValue371.preventDefault();
    scopeValue60(scopeValue8.profileBio, scopeValue8.profileForm);
  }
  function scopeValue62(scopeValue372) {
    const scopeValue373 = scopeValue372.target;
    if (!scopeValue57(scopeValue372) || !scopeValue373?.matches?.("input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"file\"]):not([type=\"hidden\"])")) return;
    scopeValue372.preventDefault();
    const scopeValue374 = [...scopeValue8.composerForm.querySelectorAll("input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"file\"]):not([type=\"hidden\"]), textarea, select")].filter(scopeValue376 => !scopeValue376.disabled && !scopeValue376.closest("[hidden]")),
      scopeValue375 = scopeValue374[scopeValue374.indexOf(scopeValue373) + 1];
    if (scopeValue375) scopeValue60(scopeValue375, scopeValue59(scopeValue375));
  }
  function scopeValue63() {
    if (scopeValue19 || typeof window.mobileInputCompat?.registerFocusScope !== "function") return;
    scopeValue19 = window.mobileInputCompat.registerFocusScope({
      selector: "#ao3-view.active",
      priority: 30,
      preferFocusScope: true,
      resolveScrollContainer: (scopeValue377, scopeValue378) => scopeValue59(scopeValue377, scopeValue378),
      scrollBehavior: "focus",
      viewportClassName: "u2-android-ao3-viewport-sized",
      viewportHeightCssVariable: "--u2-android-ao3-viewport-height",
      viewportTopCssVariable: "--u2-android-ao3-viewport-top"
    }), window.mobileInputCompat.registerFocusScope({
      selector: "#ao3-view.active #ao3-chapter-edit-overlay:not([hidden])",
      priority: 40,
      preferFocusScope: true,
      preserveVisibleTarget: true,
      followViewportOrigin: true,
      resolveViewportRoot: () => scopeValue8.view,
      resolveScrollContainer: (newScope401, newScope402) => scopeValue59(newScope401, newScope402),
      scrollBehavior: "focus",
      viewportClassName: "u2-android-ao3-viewport-sized",
      viewportHeightCssVariable: "--u2-android-ao3-viewport-height",
      viewportTopCssVariable: "--u2-android-ao3-viewport-top"
    });
  }
  function scopeValue64(scopeValue379 = "ao3-update") {
    if (!window.appStorage?.["commitDomain"]) return Promise.resolve(false);
    return scopeValue13 = scopeValue13["catch"](() => undefined).then(() => window.appStorage.commitDomain(scopeValue0, scopeValue42(scopeValue9), {
      critical: true,
      reason: scopeValue379
    }))["catch"](scopeValue381 => {
      return console.warn("[AO3] Failed to persist state.", scopeValue381), scopeValue102("Save failed / 保存失败"), false;
    }), scopeValue13;
  }
  async function scopeValue65() {
    if (!window.appStorage) return;
    try {
      await window.appStorage.ready;
      const scopeValue382 = window.appStorage.readDomain(scopeValue0, null);
      scopeValue9 = scopeValue382 && typeof scopeValue382 === "object" ? scopeValue42(scopeValue382) : scopeValue41();
      if (!scopeValue382) await scopeValue64("ao3-initialize");else {
        if (Number(scopeValue382.schemaVersion) !== scopeValue1) await scopeValue64("ao3-migrate-v6");
      }
      scopeValue66();
      if (scopeValue8?.view?.classList.contains("active")) scopeValue96({
        resetScroll: false
      });
    } catch (scopeValue383) {
      console.warn("[AO3] Failed to hydrate state.", scopeValue383);
    }
  }
  function scopeValue66() {
    if (scopeValue8?.profileName) scopeValue8.profileName.textContent = scopeValue9.profile.pseud;
  }
  function scopeValue67(scopeValue384, scopeValue385, scopeValue386 = "span") {
    return "<" + scopeValue386 + " class=\"ao3-bilingual\"><span>" + scopeValue24(scopeValue384) + "</span><small>" + scopeValue24(scopeValue385) + "</small></" + scopeValue386 + ">";
  }
  function scopeValue68(scopeValue387, scopeValue388) {
    return scopeValue24(scopeValue387) + "<small class=\"ao3-inline-translation\">" + scopeValue24(scopeValue388) + "</small>";
  }
  function scopeValue69(scopeValue389) {
    return {
      "General Audiences": "全年龄",
      "Teen And Up Audiences": "青少年及以上",
      Mature: "成人",
      Explicit: "限制级",
      "Not Rated": "未分级"
    }[scopeValue389] || scopeValue389;
  }
  function scopeValue70(scopeValue390) {
    return {
      "Creator Chose Not To Use Archive Warnings": "作者选择不使用作品警告",
      "No Archive Warnings Apply": "无作品警告适用",
      "Graphic Depictions Of Violence": "露骨暴力描写",
      "Major Character Death": "主要角色死亡",
      "Rape/Non-Con": "强暴或非自愿性行为",
      Underage: "未成年性行为"
    }[scopeValue390] || scopeValue390;
  }
  function scopeValue71(scopeValue391) {
    return {
      Gen: "无配对或非恋爱关系",
      "F/F": "女性与女性",
      "F/M": "女性与男性",
      "M/M": "男性与男性",
      Multi: "多种配对",
      Other: "其他"
    }[scopeValue391] || scopeValue391;
  }
  function scopeValue72(scopeValue392) {
    return scopeValue392.authorPseud || scopeValue9.profile.pseud;
  }
  function scopeValue73(scopeValue393, scopeValue394 = scopeValue9) {
    const scopeValue395 = new Set(scopeValue394.deletedCommentIdsByWork?.[scopeValue393] || []);
    return (scopeValue394.commentsByWork?.[scopeValue393] || []).filter(scopeValue396 => !scopeValue395.has(scopeValue396.id));
  }
  function scopeValue74(scopeValue397, scopeValue398, scopeValue399 = scopeValue9) {
    return scopeValue73(scopeValue397, scopeValue399).filter(scopeValue400 => scopeValue400.chapterId === String(scopeValue398 || ""));
  }
  function scopeValue75(scopeValue401, scopeValue402, scopeValue403 = scopeValue9) {
    return scopeValue403.repliesByComment?.[scopeValue401]?.[scopeValue402] || [];
  }
  function scopeValue76(scopeValue404) {
    const scopeValue405 = String(scopeValue404 || "");
    return (scopeValue405.match(/[\u3400-\u9fff]/g) || []).length + (scopeValue405.replace(/[\u3400-\u9fff]/g, " ").match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
  }
  function scopeValue77(scopeValue406) {
    return {
      words: scopeValue406.chapters.reduce((scopeValue407, scopeValue408) => scopeValue407 + scopeValue76(scopeValue408.content), 0),
      chapters: scopeValue406.chapters.length,
      comments: scopeValue73(scopeValue406.id).length,
      kudos: (scopeValue406.baseStats?.kudos || 0) + (scopeValue9.kudosByWork[scopeValue406.id] ? 1 : 0),
      bookmarks: scopeValue406.baseStats?.bookmarks || 0,
      hits: scopeValue406.baseStats?.hits || 0
    };
  }
  function scopeValue78(scopeValue409) {
    const scopeValue410 = scopeValue77(scopeValue409);
    return "<dl class=\"ao3-work-stats\"><div><dt>Words <small class=\"ao3-inline-translation\">字数</small></dt><dd>" + scopeValue410.words.toLocaleString() + "</dd></div><div><dt>Chapters <small class=\"ao3-inline-translation\">章节</small></dt><dd>" + scopeValue410.chapters + "/" + scopeValue410.chapters + "</dd></div><div><dt>Comments <small class=\"ao3-inline-translation\">评论</small></dt><dd>" + scopeValue410.comments + "</dd></div><div><dt>Kudos <small class=\"ao3-inline-translation\">推荐</small></dt><dd>" + scopeValue410.kudos + "</dd></div><div><dt>Bookmarks <small class=\"ao3-inline-translation\">书签</small></dt><dd>" + scopeValue410.bookmarks + "</dd></div><div><dt>Hits <small class=\"ao3-inline-translation\">阅读</small></dt><dd>" + scopeValue410.hits.toLocaleString() + "</dd></div></dl>";
  }
  function scopeValue79(scopeValue411) {
    const scopeValue412 = scopeValue411.characters.map(scopeValue413 => scopeValue413.name);
    return "<article class=\"ao3-work-card\"><div class=\"ao3-rating-symbols\" aria-hidden=\"true\"><span>" + scopeValue24(scopeValue411.rating.charAt(0) || "?") + "</span><span>!</span><span>" + scopeValue24(scopeValue411.category) + "</span><span>AO3</span></div><header class=\"ao3-work-card-header\"><h2><button type=\"button\" class=\"ao3-text-link\" data-ao3-open-work=\"" + scopeValue24(scopeValue411.id) + "\">" + scopeValue24(scopeValue411.title) + "</button></h2><p class=\"ao3-work-byline\">by <button type=\"button\" class=\"ao3-text-link\" data-ao3-route=\"profile\">" + scopeValue24(scopeValue72(scopeValue411)) + "</button> <small class=\"ao3-inline-translation\">作者</small></p></header><div class=\"ao3-work-tags\"><button type=\"button\" class=\"ao3-tag-link\" data-ao3-search=\"" + scopeValue24(scopeValue411.rating) + "\">" + scopeValue24(scopeValue411.rating) + " · " + scopeValue24(scopeValue69(scopeValue411.rating)) + "</button><button type=\"button\" class=\"ao3-tag-link\" data-ao3-search=\"" + scopeValue24(scopeValue411.fandom) + "\">" + scopeValue24(scopeValue411.fandom) + "</button>" + (scopeValue411.relationship ? "<button type=\"button\" class=\"ao3-tag-link\" data-ao3-search=\"" + scopeValue24(scopeValue411.relationship) + "\">" + scopeValue24(scopeValue411.relationship) + "</button>" : "") + scopeValue412.map(scopeValue414 => "<button type=\"button\" class=\"ao3-tag-link\" data-ao3-search=\"" + scopeValue24(scopeValue414) + "\">" + scopeValue24(scopeValue414) + "</button>").join("") + scopeValue411.tags.map(scopeValue415 => "<button type=\"button\" class=\"ao3-tag-link\" data-ao3-search=\"" + scopeValue24(scopeValue415) + "\">" + scopeValue24(scopeValue415) + "</button>").join("") + "</div><p class=\"ao3-work-summary\">" + scopeValue24(scopeValue411.summary) + "</p>" + scopeValue78(scopeValue411) + "</article>";
  }
  function scopeValue80() {
    const scopeValue416 = scopeValue9.works[scopeValue9.works.length - 1] || scopeValue9.works[0],
      scopeValue417 = scopeValue416 ? scopeValue79(scopeValue416) : "<div class=\"ao3-empty-state\"><strong>No works yet.</strong><br><small>还没有作品，前往用户主页新建第一篇作品。</small></div>";
    return "<section class=\"ao3-page ao3-home-page\" aria-labelledby=\"ao3-home-title\"><h1 class=\"ao3-home-intro\" id=\"ao3-home-title\">A non-profit, non-commercial archive for transformative fanworks; created by and for fans of books, music, art, games, shows, movies, real-person fiction (RPF), and other fandoms.<small>一个非营利、非商业性的衍生作品档案馆，由书籍、音乐、艺术、游戏、剧集、电影、真人同人及其他作品圈的爱好者共同创建。</small></h1><p class=\"ao3-site-stats\">more than <strong>82,390</strong> fandoms | <strong>11,510,000</strong> users | <strong>" + (18320000 + scopeValue9.works.length).toLocaleString() + "</strong> works<br><small>超过 82,390 个作品圈｜11,510,000 位用户｜" + (18320000 + scopeValue9.works.length).toLocaleString() + " 篇作品</small></p><p class=\"ao3-site-project\">The Archive of Our Own (AO3) is a fan-made archive for this U2phone prototype.<br><small>Archive of Our Own（AO3）在本原型中作为本地同人作品档案馆。</small></p><section class=\"ao3-account-card\"><h2>With an AO3 account, you can:<small class=\"ao3-inline-translation\">拥有 AO3 账号后，你可以：</small></h2><ul><li>Share your own fanworks <small class=\"ao3-inline-translation\">分享自己的同人作品</small></li><li>Create new chapters with AI <small class=\"ao3-inline-translation\">使用 AI 创作新章节</small></li><li>Leave kudos and join conversations <small class=\"ao3-inline-translation\">留下推荐并参与评论</small></li></ul><div class=\"ao3-card-action\"><button type=\"button\" class=\"ao3-bevel-button\" data-ao3-route=\"profile\">" + scopeValue67("View My Dashboard", "查看我的主页") + "</button></div></section><h2 class=\"ao3-section-title\">Find your favorites<small>寻找你喜欢的作品</small></h2><div class=\"ao3-fandom-grid\"><button type=\"button\" class=\"ao3-fandom-link\" data-ao3-route=\"fandoms\"><span>All Fandoms</span><small>所有作品圈</small></button><button type=\"button\" class=\"ao3-fandom-link\" data-ao3-search=\"Anime Manga\"><span>Anime &amp; Manga</span><small>动漫</small></button><button type=\"button\" class=\"ao3-fandom-link\" data-ao3-search=\"Books Literature\"><span>Books &amp; Literature</span><small>书籍与文学</small></button><button type=\"button\" class=\"ao3-fandom-link\" data-ao3-search=\"Movies\"><span>Movies</span><small>电影</small></button></div><h2 class=\"ao3-section-title\">Featured Work<small>推荐作品</small></h2>" + scopeValue417 + "</section>";
  }
  function scopeValue81() {
    const scopeValue418 = new Map();
    return scopeValue9.works.forEach(scopeValue419 => scopeValue418.set(scopeValue419.fandom, (scopeValue418.get(scopeValue419.fandom) || 0) + 1)), "<section class=\"ao3-page\" aria-labelledby=\"ao3-fandoms-title\"><header class=\"ao3-page-heading\"><h1 id=\"ao3-fandoms-title\">Fandoms<small>作品圈</small></h1><small>" + scopeValue9.works.length + " works in this local archive<br>本地档案馆共 " + scopeValue9.works.length + " 篇作品</small></header><div class=\"ao3-fandom-grid\">" + [...scopeValue418].map(([scopeValue420, scopeValue421]) => "<button type=\"button\" class=\"ao3-fandom-link\" data-ao3-search=\"" + scopeValue24(scopeValue420) + "\"><span>" + scopeValue24(scopeValue420) + "</span><small>" + scopeValue421 + " work" + (scopeValue421 === 1 ? "" : "s") + " / " + scopeValue421 + " 篇</small></button>").join("") + "<button type=\"button\" class=\"ao3-fandom-link\" data-ao3-route=\"browse\"><span>All Works</span><small>全部作品</small></button></div>" + scopeValue9.works.map(scopeValue79).join("") + "</section>";
  }
  function scopeValue82() {
    return "<section class=\"ao3-page\" aria-labelledby=\"ao3-browse-title\"><header class=\"ao3-page-heading\"><h1 id=\"ao3-browse-title\">Browse Works<small>浏览作品</small></h1><small>Newest local works first<br>本地新作优先</small></header><p class=\"ao3-result-summary\">" + scopeValue9.works.length + " Works Found <small class=\"ao3-inline-translation\">找到 " + scopeValue9.works.length + " 篇作品</small></p>" + [...scopeValue9.works].reverse().map(scopeValue79).join("") + "</section>";
  }
  function scopeValue83(scopeValue422 = "") {
    const scopeValue423 = scopeValue54(scopeValue422);
    return "<section class=\"ao3-page\" aria-labelledby=\"ao3-search-title\"><header class=\"ao3-page-heading\"><h1 id=\"ao3-search-title\">Search Works<small>搜索作品</small></h1><small>Title, author, fandom, relationship, characters, or tags<br>可搜索标题、作者、作品圈、关系、角色或标签</small></header><form class=\"ao3-search-panel\" id=\"ao3-page-search-form\"><input type=\"search\" id=\"ao3-page-search-input\" value=\"" + scopeValue24(scopeValue422) + "\" maxlength=\"120\" enterkeyhint=\"search\" aria-label=\"Search works / 搜索作品\" placeholder=\"Search works / 搜索作品\"><button type=\"submit\" class=\"ao3-bevel-button\">" + scopeValue67("Search", "搜索") + "</button></form><p class=\"ao3-result-summary\">" + scopeValue423.length + " Result" + (scopeValue423.length === 1 ? "" : "s") + " <small class=\"ao3-inline-translation\">" + scopeValue423.length + " 条结果</small></p>" + (scopeValue423.length ? scopeValue423.map(scopeValue79).join("") : "<div class=\"ao3-empty-state\"><strong>No works found.</strong><br><small>没有找到匹配的作品。</small></div>") + "</section>";
  }
  function scopeValue84(scopeValue424, scopeValue425, scopeValue426, scopeValue427 = {}) {
    return "<div class=\"ao3-meta-row" + (scopeValue427.warning ? " is-warning" : "") + "\"><dt>" + scopeValue68(scopeValue424, scopeValue425) + ":</dt><dd>" + scopeValue426 + "</dd></div>";
  }
  function scopeValue85(scopeValue428) {
    const scopeValue429 = new Date(scopeValue428);
    if (!Number.isFinite(scopeValue429.getTime())) return "";
    try {
      return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(scopeValue429);
    } catch (scopeValue430) {
      return scopeValue429.toISOString().slice(0, 16).replace("T", " ");
    }
  }
  function scopeValue86(scopeValue431) {
    if (!scopeValue431.translationZh) return "";
    return "<button type=\"button\" class=\"ao3-comment-link\" data-ao3-toggle-translation aria-expanded=\"false\">Translate<small>翻译</small></button><p class=\"ao3-comment-translation\" data-ao3-translation hidden>" + scopeValue24(scopeValue431.translationZh) + "</p>";
  }
  function scopeValue87(scopeValue432, scopeValue433, scopeValue434) {
    return "<article class=\"ao3-comment-reply\" data-reply-id=\"" + scopeValue24(scopeValue434.id) + "\"><header><strong>" + scopeValue24(scopeValue434.pseud) + "</strong><time datetime=\"" + scopeValue24(scopeValue434.createdAt) + "\">" + scopeValue24(scopeValue85(scopeValue434.createdAt)) + "</time></header><p class=\"ao3-comment-text\">" + scopeValue24(scopeValue434.text) + "</p><div class=\"ao3-comment-tools\">" + scopeValue86(scopeValue434) + "<button type=\"button\" class=\"ao3-comment-link is-delete\" data-ao3-delete-reply=\"" + scopeValue24(scopeValue434.id) + "\" data-comment-id=\"" + scopeValue24(scopeValue433) + "\" data-work-id=\"" + scopeValue24(scopeValue432) + "\">Delete<small>删除</small></button></div></article>";
  }
  function scopeValue88(scopeValue435, scopeValue436) {
    const scopeValue437 = scopeValue75(scopeValue435.id, scopeValue436.id);
    return "<article class=\"ao3-comment\" data-comment-id=\"" + scopeValue24(scopeValue436.id) + "\"><header><strong>" + scopeValue24(scopeValue436.pseud) + "</strong><time datetime=\"" + scopeValue24(scopeValue436.createdAt) + "\">" + scopeValue24(scopeValue85(scopeValue436.createdAt)) + "</time></header><p class=\"ao3-comment-text\">" + scopeValue24(scopeValue436.text) + "</p><div class=\"ao3-comment-tools\">" + scopeValue86(scopeValue436) + "<button type=\"button\" class=\"ao3-comment-link\" data-ao3-toggle-reply>Reply<small>回复</small></button><button type=\"button\" class=\"ao3-comment-link is-delete\" data-ao3-delete-comment=\"" + scopeValue24(scopeValue436.id) + "\" data-work-id=\"" + scopeValue24(scopeValue435.id) + "\">Delete<small>删除</small></button></div>" + (scopeValue437.length ? "<div class=\"ao3-comment-replies\">" + scopeValue437.map(scopeValue438 => scopeValue87(scopeValue435.id, scopeValue436.id, scopeValue438)).join("") + "</div>" : "") + "<form class=\"ao3-reply-form\" data-ao3-reply-form data-comment-id=\"" + scopeValue24(scopeValue436.id) + "\" hidden><label>Reply as " + scopeValue24(scopeValue9.profile.pseud) + "<small>以此用户名回复</small><textarea name=\"reply-text\" maxlength=\"" + scopeValue3 + "\" enterkeyhint=\"enter\" required aria-label=\"Reply / 回复\"></textarea></label><div class=\"ao3-form-error\" data-ao3-reply-error role=\"alert\"></div><div class=\"ao3-reply-form-actions\"><button type=\"button\" class=\"ao3-bevel-button\" data-ao3-cancel-reply>" + scopeValue67("Cancel", "取消") + "</button><button type=\"submit\" class=\"ao3-bevel-button\">" + scopeValue67("Reply", "发表回复") + "</button></div></form></article>";
  }
  function scopeValue89(scopeValue439, scopeValue440) {
    const scopeValue441 = scopeValue74(scopeValue439.id, scopeValue440.id),
      scopeValue442 = scopeValue439.id + ":" + scopeValue440.id,
      scopeValue443 = scopeValue20.has(scopeValue442);
    return "<section class=\"ao3-comments-section\" id=\"ao3-comments-section\" aria-labelledby=\"ao3-comments-title\"><h2 class=\"ao3-comments-heading\" id=\"ao3-comments-title\"><button type=\"button\" data-ao3-toggle-comment-section aria-expanded=\"" + String(!scopeValue443) + "\"><span>Comments (" + scopeValue441.length + ")<small class=\"ao3-inline-translation\">评论（" + scopeValue441.length + "）</small></span><i class=\"fas fa-chevron-" + (scopeValue443 ? "down" : "up") + "\" aria-hidden=\"true\"></i></button></h2><div class=\"ao3-comments-content\"" + (scopeValue443 ? " hidden" : "") + "><div class=\"ao3-comment-list\">" + scopeValue441.map(scopeValue444 => scopeValue88(scopeValue439, scopeValue444)).join("") + "</div><form class=\"ao3-comment-form\" id=\"ao3-comment-form\"><p>All fields are required. Your comment is stored only on this device.<br><small>所有字段均为必填项，你的评论只会保存在当前设备。</small></p><div class=\"ao3-comment-identity\">Comment as <strong>" + scopeValue24(scopeValue9.profile.pseud) + "</strong> <small class=\"ao3-inline-translation\">以此用户名评论</small></div><label for=\"ao3-comment-input\">Comment<small>评论内容</small></label><textarea id=\"ao3-comment-input\" maxlength=\"" + scopeValue3 + "\" enterkeyhint=\"enter\" required aria-describedby=\"ao3-comment-counter ao3-comment-error\"></textarea><div class=\"ao3-form-error\" id=\"ao3-comment-error\" role=\"alert\"></div><div class=\"ao3-comment-form-footer\"><span class=\"ao3-comment-count\" id=\"ao3-comment-counter\">" + scopeValue3 + " characters left / 剩余 " + scopeValue3 + " 字符</span><button type=\"submit\" class=\"ao3-bevel-button\">" + scopeValue67("Comment", "发表评论") + "</button></div></form></div></section>";
  }
  function scopeValue90(scopeValue445) {
    const scopeValue446 = String(scopeValue445 || "").trim();
    if (scopeValue446.length <= 180) return scopeValue446 ? [scopeValue446] : [];
    const scopeValue447 = scopeValue446.match(/[^。！？!?…]+(?:[。！？!?]+|…{1,2}|$)/g) || [scopeValue446],
      scopeValue448 = [];
    let scopeValue449 = "";
    scopeValue447.forEach(scopeValue450 => {
      const scopeValue451 = ("" + scopeValue449 + scopeValue450).trim();
      if (scopeValue449 && scopeValue451.length > 150 && scopeValue449.length >= 70) {
        scopeValue448.push(scopeValue449.trim());
        scopeValue449 = scopeValue450;
      } else scopeValue449 = scopeValue451;
    });
    if (scopeValue449.trim()) scopeValue448.push(scopeValue449.trim());
    return scopeValue448;
  }
  function scopeValue91(scopeValue452) {
    const scopeValue453 = String(scopeValue452 || "").replace(/\r\n?/g, `
`).split(/\n+/).map(scopeValue454 => scopeValue454.trim()).filter(Boolean);
    return scopeValue453.flatMap(scopeValue90);
  }
  function scopeValue92(scopeValue455) {
    if (scopeValue455.contentEdited) return "<div class=\"ao3-chapter-body ao3-chapter-body-edited\">" + scopeValue24(scopeValue455.content) + "</div>";
    return "<div class=\"ao3-chapter-body\">" + scopeValue91(scopeValue455.content).map(newScope479 => "<p>" + scopeValue24(newScope479) + "</p>").join("") + "</div>";
  }
  function newScope94(newScope480, scopeValue456) {
    const scopeValue457 = scopeValue44(newScope480);
    if (!scopeValue457) return "<section class=\"ao3-page\"><div class=\"ao3-empty-state\">Work not found. / 作品不存在。</div></section>";
    const scopeValue458 = scopeValue45(scopeValue456 || scopeValue9.lastChapterByWork[scopeValue457.id], scopeValue457),
      scopeValue459 = scopeValue457.chapters[scopeValue458 - 1],
      scopeValue460 = scopeValue74(scopeValue457.id, scopeValue459.id),
      scopeValue461 = scopeValue9.kudosByWork[scopeValue457.id],
      scopeValue462 = scopeValue77(scopeValue457),
      scopeValue463 = ["cxcairlay", "cylafee", "Burningfield", "Straworld", "Radixx", "Nimloth"];
    if (scopeValue461) scopeValue463.unshift(scopeValue9.profile.pseud);
    const scopeValue464 = scopeValue457.relationship ? "<button type=\"button\" class=\"ao3-tag-link\" data-ao3-search=\"" + scopeValue24(scopeValue457.relationship) + "\">" + scopeValue24(scopeValue457.relationship) + "</button>" : "None / 无",
      scopeValue465 = scopeValue459.notes ? "<section class=\"ao3-preface-section ao3-chapter-notes\"><h2>Notes<small class=\"ao3-inline-translation\">本章注释</small></h2><p>" + scopeValue24(scopeValue459.notes) + "</p></section>" : "";
    return "<article class=\"ao3-page ao3-work-page\" aria-labelledby=\"ao3-work-title\"><div class=\"ao3-work-toolbar\"><button type=\"button\" class=\"ao3-bevel-button\" data-ao3-edit-chapter=\"" + scopeValue24(scopeValue459.id) + "\">" + scopeValue67("Edit Chapter", "编辑本章") + "</button><button type=\"button\" class=\"ao3-bevel-button\" data-ao3-generate-comments>" + scopeValue67("Comments (" + scopeValue460.length + ")", "生成 10 条本章评论") + "</button><button type=\"button\" class=\"ao3-bevel-button\" data-ao3-download>" + scopeValue67("Download ↓", "下载") + "</button><button type=\"button\" class=\"ao3-bevel-button ao3-danger-button\" data-ao3-delete-chapter=\"" + scopeValue24(scopeValue459.id) + "\"" + (scopeValue457.chapters.length <= 1 ? " disabled title=\"Only one chapter; delete the whole work instead. / 仅有一章，请删除整篇。\"" : "") + ">" + scopeValue67("Delete Chapter", "删除本章") + "</button><button type=\"button\" class=\"ao3-bevel-button ao3-danger-button\" data-ao3-delete-work=\"" + scopeValue24(scopeValue457.id) + "\">" + scopeValue67("Delete Work", "删除整篇") + "</button></div><dl class=\"ao3-meta-card\">" + scopeValue84("Rating", "分级", "<button type=\"button\" class=\"ao3-tag-link\" data-ao3-search=\"" + scopeValue24(scopeValue457.rating) + "\">" + scopeValue24(scopeValue457.rating) + " / " + scopeValue24(scopeValue69(scopeValue457.rating)) + "</button>") + scopeValue84("Archive Warning", "作品警告", "<button type=\"button\" class=\"ao3-tag-link\" data-ao3-search=\"" + scopeValue24(scopeValue457.warning) + "\">" + scopeValue24(scopeValue457.warning) + " / " + scopeValue24(scopeValue70(scopeValue457.warning)) + "</button>", {
      warning: true
    }) + scopeValue84("Category", "分类", scopeValue24(scopeValue457.category) + " / " + scopeValue24(scopeValue71(scopeValue457.category))) + scopeValue84("Fandom", "作品圈", "<button type=\"button\" class=\"ao3-tag-link\" data-ao3-search=\"" + scopeValue24(scopeValue457.fandom) + "\">" + scopeValue24(scopeValue457.fandom) + "</button>") + scopeValue84("Relationship", "关系", scopeValue464) + scopeValue84("Characters", "角色", scopeValue457.characters.map(scopeValue466 => "<button type=\"button\" class=\"ao3-tag-link\" data-ao3-search=\"" + scopeValue24(scopeValue466.name) + "\">" + scopeValue24(scopeValue466.name) + "</button>").join("、") || "None / 无") + scopeValue84("Additional Tags", "附加标签", scopeValue457.tags.map(scopeValue467 => "<button type=\"button\" class=\"ao3-tag-link\" data-ao3-search=\"" + scopeValue24(scopeValue467) + "\">" + scopeValue24(scopeValue467) + "</button>").join("、") || "None / 无") + scopeValue84("Language", "语言", scopeValue24(scopeValue457.language)) + (scopeValue457.series ? scopeValue84("Series", "系列", scopeValue24(scopeValue457.series)) : "") + "<div class=\"ao3-meta-row\"><dt>" + scopeValue68("Stats", "数据") + ":</dt><dd class=\"ao3-meta-stats\"><span><strong>Published / 发布:</strong>" + scopeValue24(scopeValue457.published) + "</span><span><strong>Words / 字数:</strong>" + scopeValue462.words.toLocaleString() + "</span><span><strong>Chapters / 章节:</strong>" + scopeValue462.chapters + "/" + scopeValue462.chapters + "</span><span><strong>Comments / 评论:</strong>" + scopeValue462.comments + "</span><span><strong>Kudos / 推荐:</strong>" + scopeValue462.kudos + "</span><span><strong>Bookmarks / 书签:</strong>" + scopeValue462.bookmarks + "</span><span><strong>Hits / 阅读:</strong>" + scopeValue462.hits.toLocaleString() + "</span></dd></div></dl><header class=\"ao3-work-title-block\"><h1 id=\"ao3-work-title\">" + scopeValue24(scopeValue457.title) + "</h1><p class=\"ao3-author\">by <button type=\"button\" class=\"ao3-text-link\" data-ao3-route=\"profile\">" + scopeValue24(scopeValue72(scopeValue457)) + "</button> <small class=\"ao3-inline-translation\">作者</small></p></header><div class=\"ao3-work-preface\"><section class=\"ao3-preface-section\"><h2>Summary<small class=\"ao3-inline-translation\">摘要</small></h2><p>" + scopeValue24(scopeValue457.summary) + "</p></section></div><header class=\"ao3-chapter-heading\"><span class=\"ao3-chapter-kicker\">Chapter " + scopeValue458 + " of " + scopeValue457.chapters.length + " / 第 " + scopeValue458 + " 章，共 " + scopeValue457.chapters.length + " 章</span><h2>" + scopeValue24(scopeValue459.title) + "</h2></header>" + scopeValue465 + scopeValue92(scopeValue459) + "<nav class=\"ao3-chapter-pagination\" aria-label=\"Chapter navigation / 章节导航\"><button type=\"button\" class=\"ao3-bevel-button\" data-ao3-chapter=\"" + (scopeValue458 - 1) + "\"" + (scopeValue458 <= 1 ? " disabled" : "") + ">" + scopeValue67("← Previous Chapter", "上一章") + "</button>" + (scopeValue458 < scopeValue457.chapters.length ? "<button type=\"button\" class=\"ao3-bevel-button\" data-ao3-chapter=\"" + (scopeValue458 + 1) + "\">" + scopeValue67("Next Chapter →", "下一章") + "</button>" : "<button type=\"button\" class=\"ao3-bevel-button ao3-next-create\" data-ao3-new-chapter=\"" + scopeValue24(scopeValue457.id) + "\">" + scopeValue67("Next Chapter →", "创作下一章") + "</button>") + "</nav><div class=\"ao3-reader-actions\"><button type=\"button\" class=\"ao3-bevel-button\" data-ao3-top>" + scopeValue67("↑ Top", "回到顶部") + "</button><button type=\"button\" class=\"ao3-bevel-button ao3-kudos-button" + (scopeValue461 ? " is-given" : "") + "\" data-ao3-kudos>" + scopeValue67(scopeValue461 ? "Kudos Given ♥" : "Kudos ♥", scopeValue461 ? "已推荐" : "推荐") + "</button><button type=\"button\" class=\"ao3-bevel-button\" data-ao3-generate-comments>" + scopeValue67("Comments (" + scopeValue460.length + ")", "生成 10 条本章评论") + "</button></div><div class=\"ao3-kudos-banner\"><span class=\"ao3-kudos-heart\" aria-hidden=\"true\">♡</span><p><span class=\"ao3-kudos-names\">" + scopeValue463.map(scopeValue24).join(", ") + "</span> and " + Math.max(0, 24 - (scopeValue461 ? 1 : 0)) + " guests left kudos on this work!<br><small>以及 " + Math.max(0, 24 - (scopeValue461 ? 1 : 0)) + " 位访客为这篇作品留下了推荐。</small></p></div>" + scopeValue89(scopeValue457, scopeValue459) + "</article>";
  }
  function scopeValue93(scopeValue469 = scopeValue9.profile, scopeValue470 = "") {
    const scopeValue471 = scopeValue23(scopeValue469.avatarUrl),
      scopeValue472 = scopeValue21(scopeValue469.pseud, "A", 40).slice(0, 1).toUpperCase();
    return "<span class=\"ao3-profile-avatar\"" + (scopeValue470 ? " id=\"" + scopeValue470 + "\"" : "") + ">" + (scopeValue471 ? "<img src=\"" + scopeValue24(scopeValue471) + "\" alt=\"\">" : scopeValue24(scopeValue472)) + "</span>";
  }
  function scopeValue94(scopeValue473) {
    const scopeValue474 = ["works", "bookmarks", "history"].includes(scopeValue473) ? scopeValue473 : "works";
    let scopeValue475 = scopeValue9.works.length ? scopeValue9.works.map(scopeValue79).join("") : "<div class=\"ao3-profile-empty\"><strong>No works yet.</strong><br><small>还没有作品，点击“新建作品”开始创作。</small></div>";
    if (scopeValue474 === "bookmarks") scopeValue475 = "<div class=\"ao3-profile-empty\"><strong>No bookmarks yet.</strong><br><small>还没有收藏作品。</small></div>";
    if (scopeValue474 === "history") {
      const scopeValue476 = new Map();
      [...scopeValue9.history].reverse().forEach(scopeValue477 => {
        if (!scopeValue476.has(scopeValue477.workId)) scopeValue476.set(scopeValue477.workId, scopeValue477);
      });
      scopeValue475 = scopeValue476.size ? [...scopeValue476.values()].map(scopeValue478 => {
        const scopeValue479 = scopeValue44(scopeValue478.workId);
        return scopeValue479 ? "<p class=\"ao3-result-summary\">Last visited Chapter " + scopeValue478.chapter + " on " + scopeValue24(scopeValue85(scopeValue478.visitedAt)) + ". <small class=\"ao3-inline-translation\">最近阅读到第 " + scopeValue478.chapter + " 章。</small></p>" + scopeValue79(scopeValue479) : "";
      }).join("") : "<div class=\"ao3-profile-empty\"><strong>No reading history yet.</strong><br><small>还没有阅读记录。</small></div>";
    }
    return "<section class=\"ao3-page\" aria-labelledby=\"ao3-profile-title\"><header class=\"ao3-page-heading\"><h1 id=\"ao3-profile-title\">Dashboard<small>用户主页</small></h1><small>Local AO3 profile<br>本地 AO3 资料</small></header><section class=\"ao3-profile-card\">" + scopeValue93() + "<div class=\"ao3-profile-copy\"><h2>" + scopeValue24(scopeValue9.profile.pseud) + "</h2><p>" + scopeValue24(scopeValue9.profile.bio) + "</p><div class=\"ao3-profile-meta\">Joined " + scopeValue24(scopeValue9.profile.joinedAt) + " <small class=\"ao3-inline-translation\">加入日期</small> · " + scopeValue9.works.length + " Works <small class=\"ao3-inline-translation\">" + scopeValue9.works.length + " 篇作品</small></div><div class=\"ao3-profile-actions\"><button type=\"button\" class=\"ao3-bevel-button\" data-ao3-edit-profile>" + scopeValue67("Edit Profile", "编辑资料") + "</button><button type=\"button\" class=\"ao3-bevel-button ao3-new-work-button\" data-ao3-new-work>" + scopeValue67("New Work", "新建作品") + "</button></div></div></section><nav class=\"ao3-profile-tabs\" aria-label=\"Profile sections / 主页分区\">" + ["works", "bookmarks", "history"].map(scopeValue480 => "<button type=\"button\" class=\"ao3-profile-tab" + (scopeValue474 === scopeValue480 ? " is-active" : "") + "\" data-ao3-profile-tab=\"" + scopeValue480 + "\"><span>" + (scopeValue480[0].toUpperCase() + scopeValue480.slice(1)) + "</span><small>" + {
      works: "作品",
      bookmarks: "收藏",
      history: "历史"
    }[scopeValue480] + "</small></button>").join("") + "</nav><div class=\"ao3-profile-panel\">" + scopeValue475 + "</div></section>";
  }
  function scopeValue95() {
    return "<section class=\"ao3-page\" aria-labelledby=\"ao3-about-title\"><header class=\"ao3-page-heading\"><h1 id=\"ao3-about-title\">About the Archive<small>关于本站</small></h1><small>Local prototype<br>本地原型</small></header><div class=\"ao3-about-copy\"><p>This interface recreates the calm, information-rich reading experience of a classic fanwork archive. It is entirely local and does not connect to archiveofourown.org.<small>本界面复刻经典同人作品档案馆安静、信息密集的阅读体验，不会连接真实 AO3。</small></p><p>New works and chapters can be created with the API configured in system settings.<small>新作品与章节可以调用系统设置中配置的 API 进行创作。</small></p></div><h2 class=\"ao3-section-title\">Archive Status<small>档案状态</small></h2><section class=\"ao3-account-card\"><ul><li>" + scopeValue9.works.length + " local works <small class=\"ao3-inline-translation\">" + scopeValue9.works.length + " 篇本地作品</small></li><li>AI chapter creation with summaries <small class=\"ao3-inline-translation\">AI 正文与本章总结生成</small></li><li>Local profile and interaction storage <small class=\"ao3-inline-translation\">本地资料与互动存储</small></li></ul></section></section>";
  }
  function scopeValue96(scopeValue481 = {}) {
    if (!scopeValue8?.content) return;
    let scopeValue482 = "";
    switch (scopeValue10.name) {
      case "fandoms":
        scopeValue482 = scopeValue81();
        break;
      case "browse":
        scopeValue482 = scopeValue82();
        break;
      case "search":
        scopeValue482 = scopeValue83(scopeValue10.params.query || "");
        break;
      case "work":
        scopeValue482 = newScope94(scopeValue10.params.workId, scopeValue10.params.chapter);
        break;
      case "profile":
        scopeValue482 = scopeValue94(scopeValue10.params.tab);
        break;
      case "about":
        scopeValue482 = scopeValue95();
        break;
      default:
        scopeValue10 = {
          name: "home",
          params: {}
        };
        scopeValue482 = scopeValue80();
    }
    scopeValue8.content.innerHTML = scopeValue482;
    scopeValue66();
    if (scopeValue8.historyBack) scopeValue8.historyBack.hidden = scopeValue11.length === 0;
    if (scopeValue481.resetScroll !== false && scopeValue8.scroll) scopeValue8.scroll.scrollTop = 0;
    if (scopeValue10.name === "search") requestAnimationFrame(() => document.getElementById("ao3-page-search-input")?.focus?.({
      preventScroll: true
    }));
  }
  function scopeValue97(scopeValue483, scopeValue484) {
    const scopeValue485 = scopeValue44(scopeValue483);
    if (!scopeValue485) return;
    const scopeValue486 = scopeValue45(scopeValue484, scopeValue485);
    scopeValue9.lastChapterByWork[scopeValue485.id] = scopeValue486;
    scopeValue9.history = [...scopeValue9.history, {
      workId: scopeValue485.id,
      chapter: scopeValue486,
      visitedAt: new Date().toISOString()
    }].slice(-100);
    void scopeValue64("ao3-reading-progress");
  }
  function scopeValue98(scopeValue487, scopeValue488 = {}, scopeValue489 = {}) {
    newScope135({
      force: true,
      restoreFocus: false
    });
    const scopeValue490 = new Set(["home", "fandoms", "browse", "search", "work", "profile", "about"]),
      scopeValue491 = scopeValue490.has(String(scopeValue487 || "")) ? String(scopeValue487) : "home";
    if (scopeValue489.replace !== true) scopeValue11.push(scopeValue55(scopeValue10));
    scopeValue10 = {
      name: scopeValue491,
      params: {
        ...scopeValue488
      }
    };
    if (scopeValue491 === "work") {
      const scopeValue492 = scopeValue44(scopeValue488.workId);
      !scopeValue492 ? scopeValue10 = {
        name: "profile",
        params: {
          tab: "works"
        }
      } : (scopeValue10.params.workId = scopeValue492.id, scopeValue10.params.chapter = scopeValue45(scopeValue488.chapter || scopeValue9.lastChapterByWork[scopeValue492.id], scopeValue492), scopeValue97(scopeValue492.id, scopeValue10.params.chapter));
    }
    return scopeValue96({
      resetScroll: scopeValue489.resetScroll !== false
    }), scopeValue55(scopeValue10);
  }
  function scopeValue99() {
    if (!scopeValue11.length) return scopeValue101();
    scopeValue10 = scopeValue11.pop();
    scopeValue96();
  }
  function scopeValue100() {
    if (!scopeValue8?.view) return;
    scopeValue10 = {
      name: "home",
      params: {}
    };
    scopeValue11 = [];
    scopeValue96();
    scopeValue8.view.inert = false;
    scopeValue8.view.setAttribute("aria-hidden", "false");
    if (typeof window.openView === "function") window.openView(scopeValue8.view);else scopeValue8.view.classList.add("active");
  }
  function scopeValue101() {
    if (!scopeValue8?.["view"]) return;
    newScope135({
      force: true,
      restoreFocus: false
    }), scopeValue151({
      abort: true,
      preserve: true
    });
    scopeValue128();
    if (scopeValue17) scopeValue17.abort();
    scopeValue17 = null;
    if (scopeValue18) scopeValue18.abort();
    scopeValue18 = null;
    const scopeValue493 = document.activeElement;
    if (scopeValue493 && scopeValue8.view.contains(scopeValue493) && typeof scopeValue493.blur === "function") scopeValue493.blur();
    scopeValue10 = {
      name: "home",
      params: {}
    };
    scopeValue11 = [];
    scopeValue8.view.inert = true;
    scopeValue8.view.setAttribute("aria-hidden", "true");
    if (typeof window.closeView === "function") window.closeView(scopeValue8.view);else scopeValue8.view.classList.remove("active");
    document.getElementById("app-ao3-btn")?.focus?.({
      preventScroll: true
    });
  }
  function scopeValue102(scopeValue494) {
    if (!scopeValue8?.toast) return;
    window.clearTimeout(scopeValue12);
    scopeValue8.toast.textContent = scopeValue494;
    scopeValue8.toast.classList.add("is-visible");
    scopeValue12 = window.setTimeout(() => scopeValue8?.toast?.classList.remove("is-visible"), 2400);
  }
  function scopeValue103() {
    document.getElementById("ao3-comments-section")?.scrollIntoView?.({
      behavior: "smooth",
      block: "start"
    });
  }
  function scopeValue104() {
    return scopeValue44(scopeValue10.params.workId);
  }
  function scopeValue105() {
    const scopeValue495 = scopeValue104();
    if (!scopeValue495) return;
    const scopeValue496 = scopeValue46(scopeValue9, scopeValue495.id);
    scopeValue9 = scopeValue496.state;
    if (!scopeValue496.added) return scopeValue102("You have already left kudos here. / 你已经推荐过这篇作品");
    void scopeValue64("ao3-kudos");
    scopeValue96({
      resetScroll: false
    });
    scopeValue102("Kudos left! / 已留下推荐");
  }
  function scopeValue106(scopeValue497) {
    const scopeValue498 = scopeValue104(),
      scopeValue499 = scopeValue498?.chapters?.[scopeValue45(scopeValue10.params.chapter, scopeValue498) - 1];
    if (!scopeValue498 || !scopeValue499 || scopeValue18) return;
    const scopeValue500 = scopeValue497?.querySelector("#ao3-comment-input"),
      scopeValue501 = scopeValue497?.querySelector("#ao3-comment-error"),
      scopeValue502 = scopeValue21(scopeValue500?.value, "", scopeValue3);
    if (!scopeValue502) {
      if (scopeValue501) scopeValue501.textContent = "Please enter a comment. / 请输入评论内容。";
      scopeValue500?.focus?.();
      return;
    }
    scopeValue58(scopeValue497);
    const scopeValue503 = "comment-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      scopeValue504 = scopeValue47(scopeValue9, scopeValue498.id, scopeValue499.id, {
        id: scopeValue503,
        pseud: scopeValue9.profile.pseud,
        text: scopeValue502,
        createdAt: new Date().toISOString()
      });
    if (!scopeValue504.added) return;
    scopeValue9 = scopeValue504.state;
    void scopeValue64("ao3-comment");
    scopeValue96({
      resetScroll: false
    });
    scopeValue102("Comment posted; generating reader responses… / 评论已发布，正在生成读者回应…");
    void scopeValue121(scopeValue498.id, scopeValue499.id, scopeValue503, scopeValue502);
  }
  function scopeValue107(scopeValue505) {
    const scopeValue506 = scopeValue104(),
      scopeValue507 = scopeValue506?.chapters?.[scopeValue45(scopeValue10.params.chapter, scopeValue506) - 1];
    if (!scopeValue506 || !scopeValue507 || scopeValue18) return;
    const scopeValue508 = scopeValue505?.dataset.commentId || "",
      scopeValue509 = scopeValue505?.querySelector("[name=\"reply-text\"]"),
      scopeValue510 = scopeValue505?.querySelector("[data-ao3-reply-error]"),
      scopeValue511 = scopeValue21(scopeValue509?.value, "", scopeValue3);
    if (!scopeValue511) {
      if (scopeValue510) scopeValue510.textContent = "Please enter a reply. / 请输入回复内容。";
      scopeValue509?.focus?.();
      return;
    }
    scopeValue58(scopeValue505);
    const scopeValue512 = scopeValue48(scopeValue9, scopeValue506.id, scopeValue508, {
      id: "reply-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      pseud: scopeValue9.profile.pseud,
      text: scopeValue511,
      createdAt: new Date().toISOString()
    });
    if (!scopeValue512.added) return scopeValue102("Comment no longer exists. / 该评论已不存在");
    scopeValue9 = scopeValue512.state;
    void scopeValue64("ao3-comment-reply");
    scopeValue96({
      resetScroll: false
    });
    scopeValue102("Reply posted; generating reader responses… / 回复已发布，正在生成读者回应…");
    void scopeValue121(scopeValue506.id, scopeValue507.id, scopeValue508, scopeValue511);
  }
  function scopeValue108(scopeValue513, scopeValue514) {
    const scopeValue515 = scopeValue49(scopeValue9, scopeValue513, scopeValue514);
    if (!scopeValue515.deleted) return;
    scopeValue9 = scopeValue515.state;
    void scopeValue64("ao3-comment-delete");
    scopeValue96({
      resetScroll: false
    });
    scopeValue102("Comment deleted. / 评论已删除");
  }
  function scopeValue109(scopeValue516, scopeValue517, scopeValue518) {
    const scopeValue519 = scopeValue50(scopeValue9, scopeValue516, scopeValue517, scopeValue518);
    if (!scopeValue519.deleted) return;
    scopeValue9 = scopeValue519.state;
    void scopeValue64("ao3-reply-delete");
    scopeValue96({
      resetScroll: false
    });
    scopeValue102("Reply deleted. / 回复已删除");
  }
  async function scopeValue110(scopeValue520) {
    const scopeValue521 = scopeValue104();
    if (!scopeValue521 || !scopeValue521.chapters.some(scopeValue523 => scopeValue523.id === scopeValue520)) return;
    if (scopeValue521.chapters.length <= 1) return scopeValue102("This is the only chapter; delete the whole work instead. / 这是唯一章节，请删除整篇作品");
    if (typeof window.confirm === "function" && !window.confirm(`Delete this chapter and all of its comments?
删除本章节及其全部评论？`)) return;
    const scopeValue522 = scopeValue51(scopeValue9, scopeValue521.id, scopeValue520);
    if (!scopeValue522.deleted) return;
    scopeValue9 = scopeValue522.state;
    scopeValue10.params.chapter = scopeValue522.chapter;
    await scopeValue64("ao3-delete-chapter");
    scopeValue96();
    scopeValue102("Chapter deleted. / 本章节已删除");
  }
  async function scopeValue111(scopeValue524) {
    const scopeValue525 = scopeValue44(scopeValue524);
    if (!scopeValue525) return;
    if (typeof window.confirm === "function" && !window.confirm("Delete “" + scopeValue525.title + `” and all chapters and comments?
删除《` + scopeValue525.title + "》及其全部章节和评论？")) return;
    const scopeValue526 = scopeValue52(scopeValue9, scopeValue525.id);
    if (!scopeValue526.deleted) return;
    scopeValue9 = scopeValue526.state;
    scopeValue11 = [];
    scopeValue10 = {
      name: "profile",
      params: {
        tab: "works"
      }
    };
    await scopeValue64("ao3-delete-work");
    scopeValue96();
    scopeValue102("Work deleted. / 整篇作品已删除");
  }
  function scopeValue112(scopeValue527) {
    const scopeValue528 = scopeValue104(),
      scopeValue529 = scopeValue528?.chapters?.[scopeValue45(scopeValue10.params.chapter, scopeValue528) - 1],
      scopeValue530 = scopeValue527?.closest(".ao3-comments-section"),
      scopeValue531 = scopeValue530?.querySelector(".ao3-comments-content");
    if (!scopeValue528 || !scopeValue529 || !scopeValue531) return;
    const scopeValue532 = !scopeValue531.hidden;
    scopeValue531.hidden = scopeValue532;
    scopeValue527.setAttribute("aria-expanded", String(!scopeValue532));
    const scopeValue533 = scopeValue527.querySelector("i");
    if (scopeValue533) scopeValue533.className = "fas fa-chevron-" + (scopeValue532 ? "down" : "up");
    const scopeValue534 = scopeValue528.id + ":" + scopeValue529.id;
    if (scopeValue532) scopeValue20.add(scopeValue534);else scopeValue20["delete"](scopeValue534);
  }
  function scopeValue113(scopeValue535) {
    const scopeValue536 = scopeValue535?.closest(".ao3-comment-tools")?.querySelector("[data-ao3-translation]");
    if (!scopeValue536) return;
    scopeValue536.hidden = !scopeValue536.hidden;
    scopeValue535.setAttribute("aria-expanded", String(!scopeValue536.hidden));
    const scopeValue537 = scopeValue535.querySelector("small");
    if (scopeValue537) scopeValue537.textContent = scopeValue536.hidden ? "翻译" : "收起翻译";
  }
  function scopeValue114(scopeValue538, scopeValue539 = false) {
    const scopeValue540 = scopeValue538?.closest(".ao3-comment"),
      scopeValue541 = scopeValue540?.querySelector("[data-ao3-reply-form]");
    if (!scopeValue541) return;
    scopeValue541.hidden = scopeValue539 ? true : !scopeValue541.hidden;
    if (!scopeValue541.hidden) requestAnimationFrame(() => scopeValue541.querySelector("textarea")?.focus?.({
      preventScroll: true
    }));
  }
  function scopeValue115(scopeValue542, scopeValue543, scopeValue544, scopeValue545 = "") {
    const scopeValue546 = scopeValue542.characters.map(scopeValue548 => scopeValue548.name).filter(Boolean).join("、") || "未指定",
      scopeValue547 = scopeValue21(scopeValue543.content, "", 24000);
    return `你正在模拟 AO3 国际同人作品平台的真实读者评论区。请只针对当前章节生成恰好 10 条顶层评论，允许部分评论带有楼中楼回复。

【作品】
标题：` + scopeValue542.title + `
作品圈：` + scopeValue542.fandom + `
配对：` + (scopeValue542.relationship || "未指定") + `
角色：` + scopeValue546 + `
标签：` + (scopeValue542.tags.join("、") || "无") + `

【当前章节】
第 ` + scopeValue544 + " 章：" + scopeValue543.title + `
` + scopeValue547 + (scopeValue545 ? `

【世界书背景，仅用于理解人物、关系与作品设定】
` + scopeValue545 : "") + `

【语言习惯】
- 这是一个国际性平台，中文外文夹杂是常态。
- 常用黑话（按需混用）：
  - “太太/妈咪/老师”（对作者尊称，即使是英文名也常这样叫）
  - “肾疼/心口疼”（心疼角色，谐音“肾”梗）
  - “刀子/刀已经收到 感谢投喂/刀刀见血”（形容虐情节）
  - “嗑生嗑死/磕死我了/kswl/遇到真情侣我们要说/含泪打出这对CP的黑话是……/xx之后要干嘛我不说”（喜欢这对CP）
  - “OOC了/很IC”（角色是否符合原设定）
  - “捞我”（求作者写喜欢的桥段或番外）
  - “蹲更/追更/某某平台难民来避难了”（连载文催更）
  - “留comment不留kudos”（AO3特有梗，表示只想评论不点赞，或反过来“点了kudos但词穷不知道怎么评论”）
  - “抓着作者的手不放/催肉三连”（求更/求继续写）
  - “be/he预警”“tag没写全”“打tag辛苦了”
  - “0.02毫升下头”（一点点不满但依然爱）
  - “女孩你是天使/火出圈了/见到神了”（夸赞作者/作品）
- 长评论中常见“分段式追更体验”：提到自己是“追更两年老粉”、回忆之前哪一章哪句台词让自己破防，带出连载阅读的时间感和陪伴感。

【评论长度与结构真实感】
- 有的只是一两句短评加表情符号堆砌，例如“啊啊我哭了 😭😭😭 kudos+comment走一个”。
- 有的是详细长评：分析某个场景的心理描写、描述某句台词带来的情绪冲击（不用还原具体文字）、猜测后续走向、期待下一章。
- 偶尔出现“回复作者 end notes”的互动感，比如回应作者在章末说的“这章写得我自己也哭了”；若当前内容没有对应 notes，不要凭空捏造具体作者留言。
- 可以有轻微争议或玩梗，比如吐槽某个角色发盒饭太快、催肉、玩“太太不要停”“我的心理阴影面积”梗。
- 偶尔有读者标注自己“non-native speaker 英语不好但还是想留言”的中英混杂尴尬感，增加真实感。
 有时候不需要评价剧情 只需要一句神来了/老师你说人生的意义是什么呢（特指写的太涩冲完后贤者时间）/震撼美味！/妈咪饭饭 即可表达对文章的喜爱 ，真人不会特地单拎出来说一段剧情，即使要点评剧情也要说老师也太会写了...简直是神来了/老师你照镜子看得见自己的脸吗/结尾太引人深思了.../堪比原著之类

【生成、楼中楼与翻译要求】
1. 顶层 comments 必须恰好 10 条，昵称互不重复；其中部分评论可带 1–2 条 replies，回复者可以回应原评论、补充分析或自然玩梗。
2. 十条中自然混入若干英文、日文、韩文或其他非中文评论，不要全部使用同一种语言；中文外文夹杂的评论也可以出现。
3. text 始终保存读者写下的原文。只要 text 主要是非中文，就必须在 translationZh 写自然、完整的简体中文翻译；中文评论的 translationZh 必须为空字符串。回复遵守同一翻译规则。
4. 长短、语气、标点和观点要明显不同；黑话按剧情自然混用，不要让十个人机械复读同一表达。
5. 结合本章的具体动作、情绪、意象或情节。世界书只用于正确理解背景，不得提到“世界书”“提示词”，也不得泄露本章读者不应知道的幕后信息。
6. 只返回合法 JSON，不要 Markdown，不要额外解释。
严格结构：{"comments":[{"pseud":"读者昵称","text":"评论原文","translationZh":"非中文原文的简体中文翻译，中文则为空字符串","replies":[{"pseud":"回复者昵称","text":"回复原文","translationZh":"非中文原文的简体中文翻译，中文则为空字符串"}]}]}`;
  }
  function scopeValue116(scopeValue549, scopeValue550 = "") {
    const scopeValue551 = String(scopeValue550 || ""),
      scopeValue552 = [],
      scopeValue553 = typeof window.getGlobalWorldBookContext === "function";
    if (scopeValue553) try {
      const scopeValue557 = scopeValue21(window.getGlobalWorldBookContext(scopeValue551), "", 50000);
      if (scopeValue557) scopeValue552.push(scopeValue557);
    } catch (scopeValue558) {
      console.warn("[AO3] Failed to collect global world books for comments.", scopeValue558);
    }
    const scopeValue554 = scopeValue147(),
      scopeValue555 = (Array.isArray(scopeValue549?.worldBookIds) ? scopeValue549.worldBookIds : []).filter(scopeValue559 => {
        if (!scopeValue553) return true;
        const scopeValue560 = scopeValue554.find(scopeValue561 => String(scopeValue561?.id) === String(scopeValue559));
        return !scopeValue560?.isGlobal;
      }),
      scopeValue556 = scopeValue161(scopeValue555, scopeValue551);
    if (scopeValue556) scopeValue552.push(`Mounted AO3 World Books / AO3 作品挂载世界书：
` + scopeValue556);
    if (!scopeValue553) {
      const scopeValue562 = scopeValue554.filter(scopeValue564 => scopeValue564?.isGlobal).map(scopeValue565 => String(scopeValue565.id)),
        scopeValue563 = scopeValue161(scopeValue562, scopeValue551);
      if (scopeValue563) scopeValue552.push(`Global World Books / 全局世界书：
` + scopeValue563);
      typeof window.getBuiltinWorldBookContext === "function" && ["system_depth", "before_role", "after_role"].forEach(scopeValue566 => {
        try {
          const scopeValue567 = scopeValue21(window.getBuiltinWorldBookContext(scopeValue566, scopeValue551), "", 50000);
          if (scopeValue567) scopeValue552.push(scopeValue567);
        } catch (scopeValue568) {
          console.warn("[AO3] Failed to collect builtin world books for comments.", scopeValue568);
        }
      });
    }
    return scopeValue552.filter(Boolean).join(`

`).trim();
  }
  function scopeValue117(scopeValue569) {
    const scopeValue570 = String(scopeValue569 || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    let scopeValue571;
    try {
      scopeValue571 = JSON.parse(scopeValue570);
    } catch (scopeValue576) {
      const scopeValue577 = scopeValue570.indexOf("{"),
        scopeValue578 = scopeValue570.lastIndexOf("}");
      if (scopeValue577 < 0 || scopeValue578 <= scopeValue577) throw new Error("AI 返回的评论不是有效 JSON");
      scopeValue571 = JSON.parse(scopeValue570.slice(scopeValue577, scopeValue578 + 1));
    }
    const scopeValue572 = (scopeValue579, scopeValue580, scopeValue581) => ({
        pseud: scopeValue21(scopeValue579?.pseud || scopeValue579?.name, scopeValue581 + "_" + (scopeValue580 + 1), 40),
        text: scopeValue21(scopeValue579?.text || scopeValue579?.comment, "", scopeValue3),
        translationZh: scopeValue21(scopeValue579?.translationZh, "", scopeValue3)
      }),
      scopeValue573 = scopeValue582 => !/[\u3400-\u9fff]/u.test(scopeValue582) && /\p{L}/u.test(scopeValue582),
      scopeValue574 = (Array.isArray(scopeValue571?.comments) ? scopeValue571.comments : []).map((scopeValue583, scopeValue584) => {
        const scopeValue585 = scopeValue572(scopeValue583, scopeValue584, "reader");
        return scopeValue585.replies = (Array.isArray(scopeValue583?.replies) ? scopeValue583.replies : []).map((scopeValue586, scopeValue587) => scopeValue572(scopeValue586, scopeValue587, "reply")).filter(scopeValue588 => scopeValue588.text).slice(0, 20), scopeValue585;
      }).filter(scopeValue589 => scopeValue589.text);
    if (scopeValue574.length !== 10) throw new Error("AI 必须返回恰好 10 条有效评论");
    const scopeValue575 = scopeValue574.some(scopeValue590 => scopeValue573(scopeValue590.text) && !scopeValue590.translationZh || scopeValue590.replies.some(scopeValue591 => scopeValue573(scopeValue591.text) && !scopeValue591.translationZh));
    if (scopeValue575) throw new Error("AI 返回的非中文评论或回复缺少中文翻译");
    return scopeValue574;
  }
  function scopeValue118(scopeValue592, scopeValue593, scopeValue594, scopeValue595, scopeValue596 = "", scopeValue597 = "") {
    return `你正在模拟 AO3 国际同人作品平台的真实评论区。作品作者刚刚在评论区发言，请生成恰好 10 条读者对作者这句发言的楼中楼回应。

【作品】
标题：` + scopeValue592.title + `
作品圈：` + scopeValue592.fandom + `
配对：` + (scopeValue592.relationship || "未指定") + `

【当前章节】
第 ` + scopeValue594 + " 章：" + scopeValue593.title + `
` + scopeValue21(scopeValue593.content, "", 18000) + `

【当前评论线程】
` + scopeValue21(scopeValue596, "暂无其他发言", 12000) + `

【作者最新发言，十条回复必须直接回应这句话】
` + scopeValue21(scopeValue595, "", scopeValue3) + (scopeValue597 ? `

【世界书背景，仅用于理解人物、关系与作品设定】
` + scopeValue597 : "") + `

【语气要求】
- 这是国际平台，中文、英文、日文、韩文或中外文夹杂都可以自然出现。
- 像真实同人女一样回应作者，可按需使用太太、妈咪、老师、肾疼、刀子、嗑生嗑死、kswl、很IC、蹲更、催肉三连、女孩你是天使、见到神了等表达，但不要机械复读。
- 有时候不需要评价剧情，只需自然接住作者的话、尖叫、玩梗、感谢投喂、催更或表达被作者回复后的激动。真人不会十个人都单拎一段剧情做书面分析。
- 回复长短和语气必须不同；允许一句话和表情，也允许少量较长回应。不要冒充作者，不要替作者继续解释。

【输出要求】
1. replies 必须恰好 10 条，全部作为同一个评论线程的楼中楼回复；这是 5–10 条楼中楼范围的上限。
2. text 保存回复原文。主要为非中文时必须提供自然完整的 translationZh；中文回复的 translationZh 为空字符串。
3. 只返回合法 JSON，不要 Markdown 或额外解释。
严格结构：{"replies":[{"pseud":"读者昵称","text":"对作者的回复原文","translationZh":"非中文回复的简体中文翻译，中文则为空字符串"}]}`;
  }
  function scopeValue119(scopeValue598) {
    const scopeValue599 = String(scopeValue598 || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    let scopeValue600;
    try {
      scopeValue600 = JSON.parse(scopeValue599);
    } catch (scopeValue603) {
      const scopeValue604 = scopeValue599.indexOf("{"),
        scopeValue605 = scopeValue599.lastIndexOf("}");
      if (scopeValue604 < 0 || scopeValue605 <= scopeValue604) throw new Error("AI 返回的作者回应不是有效 JSON");
      scopeValue600 = JSON.parse(scopeValue599.slice(scopeValue604, scopeValue605 + 1));
    }
    const scopeValue601 = (Array.isArray(scopeValue600?.replies) ? scopeValue600.replies : []).map((scopeValue606, scopeValue607) => ({
      pseud: scopeValue21(scopeValue606?.pseud || scopeValue606?.name, "reader_" + (scopeValue607 + 1), 40),
      text: scopeValue21(scopeValue606?.text || scopeValue606?.comment, "", scopeValue3),
      translationZh: scopeValue21(scopeValue606?.translationZh, "", scopeValue3)
    })).filter(scopeValue608 => scopeValue608.text);
    if (scopeValue601.length !== 10) throw new Error("AI 必须返回恰好 10 条作者回应");
    const scopeValue602 = scopeValue609 => !/[\u3400-\u9fff]/u.test(scopeValue609) && /\p{L}/u.test(scopeValue609);
    if (scopeValue601.some(scopeValue610 => scopeValue602(scopeValue610.text) && !scopeValue610.translationZh)) throw new Error("AI 返回的非中文作者回应缺少中文翻译");
    return scopeValue601;
  }
  function scopeValue120(scopeValue611) {
    scopeValue8?.content?.querySelectorAll("#ao3-comment-form button[type=\"submit\"], [data-ao3-reply-form] button[type=\"submit\"]").forEach(scopeValue612 => {
      scopeValue612.disabled = !!scopeValue611;
      scopeValue612.setAttribute("aria-busy", String(!!scopeValue611));
    });
  }
  async function scopeValue121(scopeValue613, scopeValue614, scopeValue615, scopeValue616) {
    if (scopeValue18) return;
    const scopeValue617 = scopeValue44(scopeValue613),
      scopeValue618 = scopeValue617?.chapters?.findIndex(scopeValue625 => scopeValue625.id === scopeValue614) + 1,
      scopeValue619 = scopeValue617?.chapters?.[scopeValue618 - 1],
      scopeValue620 = scopeValue617 && scopeValue619 ? scopeValue74(scopeValue617.id, scopeValue619.id).find(scopeValue626 => scopeValue626.id === scopeValue615) : null;
    if (!scopeValue617 || !scopeValue619 || !scopeValue620) return;
    const scopeValue621 = [scopeValue620.pseud + ": " + scopeValue620.text, ...scopeValue75(scopeValue617.id, scopeValue620.id).map(scopeValue627 => scopeValue627.pseud + ": " + scopeValue627.text)].join(`
`),
      scopeValue622 = [scopeValue617.title, scopeValue617.fandom, scopeValue617.relationship, scopeValue617.tags.join(" "), scopeValue619.title, scopeValue619.content, scopeValue621, scopeValue616].join(`
`),
      scopeValue623 = scopeValue116(scopeValue617, scopeValue622),
      scopeValue624 = new AbortController();
    scopeValue18 = scopeValue624;
    scopeValue120(true);
    try {
      const scopeValue628 = await scopeValue167(scopeValue118(scopeValue617, scopeValue619, scopeValue618, scopeValue616, scopeValue621, scopeValue623), scopeValue624.signal, "你是熟悉 AO3 评论生态与同人文化的读者互动模拟器，只输出要求的合法 JSON。", 1),
        scopeValue629 = scopeValue119(scopeValue628),
        scopeValue630 = scopeValue42(scopeValue9);
      if (!scopeValue74(scopeValue617.id, scopeValue619.id, scopeValue630).some(scopeValue633 => scopeValue633.id === scopeValue620.id)) return;
      const scopeValue631 = Date.now();
      if (!scopeValue630.repliesByComment[scopeValue617.id]) scopeValue630.repliesByComment[scopeValue617.id] = {};
      const scopeValue632 = scopeValue629.map((scopeValue634, scopeValue635) => scopeValue34({
        id: "ai-author-reply-" + scopeValue631 + "-" + (scopeValue635 + 1),
        pseud: scopeValue634.pseud,
        text: scopeValue634.text,
        translationZh: scopeValue634.translationZh,
        createdAt: new Date(scopeValue631 + scopeValue635 * 250).toISOString(),
        generated: true
      }, scopeValue635)).filter(Boolean);
      scopeValue630.repliesByComment[scopeValue617.id][scopeValue620.id] = [...scopeValue75(scopeValue617.id, scopeValue620.id, scopeValue630), ...scopeValue632].slice(-100);
      scopeValue9 = scopeValue630;
      await scopeValue64("ao3-author-comment-responses");
      scopeValue18 = null;
      scopeValue96({
        resetScroll: false
      });
      scopeValue102("10 reader responses generated. / 已生成 10 条读者回应");
    } catch (scopeValue636) {
      if (scopeValue624.signal.aborted || scopeValue636?.name === "AbortError") return;
      scopeValue102(window.u2Api?.isRequestError?.(scopeValue636) ? "读者回应生成失败 / 作者评论已保留，可稍后重试" : (scopeValue636?.message || "读者回应生成失败") + " / 作者评论已保留，可稍后重试");
    } finally {
      if (scopeValue18 === scopeValue624) scopeValue18 = null;
      scopeValue120(false);
    }
  }
  function scopeValue122(scopeValue637) {
    const scopeValue638 = scopeValue104(),
      scopeValue639 = scopeValue638?.chapters?.[scopeValue45(scopeValue10.params.chapter, scopeValue638) - 1];
    scopeValue8?.content?.querySelectorAll("[data-ao3-generate-comments]").forEach(scopeValue640 => {
      scopeValue640.disabled = !!scopeValue637;
      scopeValue640.innerHTML = scopeValue637 ? scopeValue67("Generating…", "正在生成 10 条评论") : scopeValue67("Comments (" + (scopeValue638 && scopeValue639 ? scopeValue74(scopeValue638.id, scopeValue639.id).length : 0) + ")", "生成 10 条本章评论");
      scopeValue640.setAttribute("aria-busy", String(!!scopeValue637));
    });
  }
  async function scopeValue123() {
    const scopeValue641 = scopeValue104();
    if (!scopeValue641 || scopeValue17) return;
    const scopeValue642 = scopeValue45(scopeValue10.params.chapter || scopeValue9.lastChapterByWork[scopeValue641.id], scopeValue641),
      scopeValue643 = scopeValue641.chapters[scopeValue642 - 1],
      scopeValue644 = [scopeValue641.title, scopeValue641.fandom, scopeValue641.relationship, scopeValue641.tags.join(" "), ...scopeValue641.characters.flatMap(scopeValue647 => [scopeValue647.name, scopeValue647.persona]), scopeValue643.title, scopeValue643.content].join(`
`),
      scopeValue645 = scopeValue116(scopeValue641, scopeValue644),
      scopeValue646 = new AbortController();
    scopeValue17 = scopeValue646;
    scopeValue122(true);
    try {
      const scopeValue648 = await scopeValue167(scopeValue115(scopeValue641, scopeValue643, scopeValue642, scopeValue645), scopeValue646.signal, "你是熟悉中文同人文化、AO3 评论生态与圈内语感的读者评论模拟器。你会严格区分正文事实、世界书背景与读者推测，只输出要求的合法 JSON。", 1),
        scopeValue649 = scopeValue117(scopeValue648),
        scopeValue650 = scopeValue42(scopeValue9),
        scopeValue651 = Date.now(),
        scopeValue652 = [];
      scopeValue649.forEach((scopeValue653, scopeValue654) => {
        const scopeValue655 = "ai-comment-" + scopeValue651 + "-" + (scopeValue654 + 1),
          scopeValue656 = scopeValue35({
            id: scopeValue655,
            pseud: scopeValue653.pseud,
            text: scopeValue653.text,
            translationZh: scopeValue653.translationZh,
            createdAt: new Date(scopeValue651 + scopeValue654 * 1000).toISOString(),
            chapterId: scopeValue643.id,
            generated: true
          }, scopeValue654);
        if (!scopeValue656) return;
        scopeValue652.push(scopeValue656);
        if (scopeValue653.replies.length) scopeValue650.repliesByComment[scopeValue641.id][scopeValue655] = scopeValue653.replies.map((scopeValue657, scopeValue658) => scopeValue34({
          id: "ai-reply-" + scopeValue651 + "-" + (scopeValue654 + 1) + "-" + (scopeValue658 + 1),
          pseud: scopeValue657.pseud,
          text: scopeValue657.text,
          translationZh: scopeValue657.translationZh,
          createdAt: new Date(scopeValue651 + scopeValue654 * 1000 + (scopeValue658 + 1) * 100).toISOString(),
          generated: true
        }, scopeValue658)).filter(Boolean);
      });
      scopeValue650.commentsByWork[scopeValue641.id] = [...(scopeValue650.commentsByWork[scopeValue641.id] || []), ...scopeValue652].slice(-200);
      scopeValue9 = scopeValue650;
      await scopeValue64("ao3-generate-comments");
      scopeValue17 = null;
      scopeValue96({
        resetScroll: false
      });
      scopeValue102("10 comments generated. / 已生成 10 条本章评论");
    } catch (scopeValue659) {
      if (scopeValue646.signal.aborted || scopeValue659?.name === "AbortError") return;
      if (window.u2Api?.isRequestError?.(scopeValue659)) window.u2Api.reportError(scopeValue659, {
        operation: "本章评论生成",
        signal: scopeValue646.signal
      });else scopeValue102((scopeValue659?.message || "评论生成失败") + " / 请重试");
    } finally {
      if (scopeValue17 === scopeValue646) scopeValue17 = null;
      scopeValue122(false);
    }
  }
  function scopeValue124(scopeValue660, scopeValue661 = scopeValue9.profile) {
    const scopeValue662 = scopeValue660 && Array.isArray(scopeValue660.chapters) ? scopeValue660 : null;
    if (!scopeValue662) return "";
    const scopeValue663 = [scopeValue662.title, "by " + (scopeValue662.authorPseud || scopeValue661.pseud), "", "Rating / 分级: " + scopeValue662.rating + " / " + scopeValue69(scopeValue662.rating), "Archive Warning / 作品警告: " + scopeValue662.warning + " / " + scopeValue70(scopeValue662.warning), "Fandom / 作品圈: " + scopeValue662.fandom, "Relationship / 关系: " + scopeValue662.relationship, "Characters / 角色: " + scopeValue662.characters.map(scopeValue664 => scopeValue664.name).join("、"), "Tags / 标签: " + scopeValue662.tags.join("、"), "", `Summary / 摘要:
` + scopeValue662.summary];
    return scopeValue662.chapters.forEach((scopeValue665, scopeValue666) => {
      scopeValue663.push("", "Chapter " + (scopeValue666 + 1) + " / 第 " + (scopeValue666 + 1) + " 章", scopeValue665.title);
      if (scopeValue665.relationships?.length) scopeValue663.push("", "Chapter CP Relationships / 本章 CP 关系: " + scopeValue665.relationships.join("、"));
      if (scopeValue665.notes) scopeValue663.push("", `Notes / 本章注释:
` + scopeValue665.notes);
      scopeValue663.push("", scopeValue665.content);
    }), scopeValue663.join(`
`);
  }
  async function scopeValue125() {
    const scopeValue667 = scopeValue104();
    if (!scopeValue667) return;
    if (typeof window.u2ExportFile !== "function") return scopeValue102("Download is unavailable. / 下载功能未加载");
    const scopeValue668 = await window.u2ExportFile({
      blob: new Blob([scopeValue124(scopeValue667)], {
        type: "text/plain;charset=utf-8"
      }),
      fileName: scopeValue667.title + ".txt",
      title: scopeValue667.title
    });
    if (scopeValue668 === "downloaded" || scopeValue668 === "shared") scopeValue102("Download ready. / 文件已准备好");else {
      if (scopeValue668 !== "cancelled") scopeValue102("Download failed. / 下载失败");
    }
  }
  function scopeValue126() {
    if (!scopeValue8?.profileAvatarPreview) return;
    scopeValue8.profileAvatarPreview.outerHTML = scopeValue93({
      ...scopeValue9.profile,
      avatarUrl: scopeValue14
    }, "ao3-profile-avatar-preview");
    scopeValue8.profileAvatarPreview = document.getElementById("ao3-profile-avatar-preview");
  }
  function scopeValue127() {
    if (!scopeValue8?.profileOverlay) return;
    scopeValue14 = scopeValue9.profile.avatarUrl;
    scopeValue8.profilePseud.value = scopeValue9.profile.pseud;
    scopeValue8.profileBio.value = scopeValue9.profile.bio;
    if (scopeValue8.profileError) scopeValue8.profileError.textContent = "";
    scopeValue126();
    scopeValue8.profileOverlay.hidden = false;
    scopeValue8.profileOverlay.inert = false;
    requestAnimationFrame(() => scopeValue8?.profilePseud?.focus?.({
      preventScroll: true
    }));
  }
  function scopeValue128() {
    if (!scopeValue8?.profileOverlay || scopeValue8.profileOverlay.hidden) return;
    const scopeValue669 = document.activeElement;
    if (scopeValue669 && scopeValue8.profileOverlay.contains(scopeValue669) && typeof scopeValue669.blur === "function") scopeValue669.blur();
    scopeValue8.profileOverlay.hidden = true;
    scopeValue8.profileOverlay.inert = true;
    scopeValue14 = "";
    if (scopeValue8.profileAvatarInput) scopeValue8.profileAvatarInput.value = "";
  }
  function scopeValue129(scopeValue670) {
    return new Promise((scopeValue671, scopeValue672) => {
      const scopeValue673 = new FileReader();
      scopeValue673.onload = () => scopeValue671(String(scopeValue673.result || ""));
      scopeValue673.onerror = () => scopeValue672(scopeValue673.error || new Error("File read failed"));
      scopeValue673.readAsDataURL(scopeValue670);
    });
  }
  async function scopeValue130(scopeValue674) {
    if (!scopeValue674 || !String(scopeValue674.type || "").startsWith("image/")) return;
    try {
      scopeValue14 = typeof window.readImageAsCompressedDataUrl === "function" ? await window.readImageAsCompressedDataUrl(scopeValue674, {
        maxWidth: 320,
        maxHeight: 320,
        quality: 0.78
      }) : await scopeValue129(scopeValue674);
      scopeValue126();
    } catch (scopeValue675) {
      if (scopeValue8?.profileError) scopeValue8.profileError.textContent = "Image could not be loaded. / 图片读取失败。";
    }
  }
  function scopeValue131() {
    const scopeValue676 = scopeValue21(scopeValue8?.profilePseud?.value, "", 40),
      scopeValue677 = scopeValue21(scopeValue8?.profileBio?.value, "", 800);
    if (!scopeValue676) {
      if (scopeValue8?.profileError) scopeValue8.profileError.textContent = "Pseud is required. / 用户名不能为空。";
      scopeValue8?.profilePseud?.focus?.();
      return;
    }
    scopeValue9.profile = {
      ...scopeValue9.profile,
      pseud: scopeValue676,
      bio: scopeValue677 || "暂无简介。",
      avatarUrl: scopeValue23(scopeValue14)
    };
    scopeValue9.profileInitialized = true;
    void scopeValue64("ao3-profile");
    scopeValue128();
    scopeValue96({
      resetScroll: false
    });
    scopeValue102("Profile saved. / 资料已保存");
  }
  function scopeValue132(scopeValue678) {
    const newScope703 = scopeValue104(),
      newScope704 = newScope703?.["chapters"]["find"](newScope707 => newScope707.id === String(scopeValue678 || ""));
    if (!newScope704 || !scopeValue8?.["chapterEditOverlay"] || newScope16?.["saving"]) return false;
    newScope135({
      restoreFocus: false
    }), scopeValue58(scopeValue8.view);
    const newScope705 = [scopeValue8.scroll, scopeValue8.view.querySelector(".ao3-site-header")].filter(Boolean);
    newScope16 = {
      workId: newScope703.id,
      chapterId: newScope704.id,
      saving: false,
      composing: false,
      backgrounds: newScope705.map(newScope708 => ({
        element: newScope708,
        inert: newScope708.inert
      }))
    }, newScope705.forEach(newScope709 => {
      newScope709.inert = true;
    }), scopeValue8.chapterEditTitle.value = newScope704.title, scopeValue8.chapterEditContent.value = newScope704.content, scopeValue8.chapterEditNotes.value = newScope704.notes, scopeValue8.chapterEditError.textContent = "", newScope136(false), scopeValue8.chapterEditOverlay.hidden = false, scopeValue8.chapterEditOverlay.inert = false, scopeValue8.chapterEditOverlay.querySelector(".ao3-chapter-edit-scroll").scrollTop = 0, scopeValue8.chapterEditContent.scrollTop = 0;
    const newScope706 = newScope16;
    return requestAnimationFrame(() => {
      if (newScope16 === newScope706) scopeValue60(scopeValue8.chapterEditTitle);
    }), true;
  }
  function newScope135(newScope710 = {}) {
    if (!scopeValue8?.["chapterEditOverlay"] || newScope16?.["saving"] && !newScope710.force) return;
    const newScope711 = newScope16;
    scopeValue58(scopeValue8.chapterEditOverlay), window.mobileInputCompat?.["releaseForOverlay"]?.(scopeValue8.chapterEditOverlay), scopeValue8.chapterEditOverlay.hidden = true, scopeValue8.chapterEditOverlay.inert = true, newScope711?.["backgrounds"]["forEach"](({
      element: newScope712,
      inert: newScope713
    }) => {
      newScope712.inert = newScope713;
    }), newScope16 = null, scopeValue8.chapterEditForm?.["reset"](), newScope136(false);
    if (newScope710.restoreFocus !== false && newScope711) [...scopeValue8.content.querySelectorAll("[data-ao3-edit-chapter]")].find(newScope714 => newScope714.dataset.ao3EditChapter === newScope711.chapterId)?.["focus"]?.({
      preventScroll: true
    });
  }
  function newScope136(newScope715) {
    if (!scopeValue8?.["chapterEditForm"]) return;
    scopeValue8.chapterEditForm.setAttribute("aria-busy", String(newScope715)), scopeValue8.chapterEditForm.querySelectorAll("input, textarea").forEach(newScope716 => {
      newScope716.readOnly = newScope715;
    }), scopeValue8.chapterEditForm.querySelectorAll("button").forEach(newScope717 => {
      newScope717.disabled = newScope715;
    });
  }
  function newScope137(newScope718, newScope719, newScope720) {
    if (!window.appStorage?.["commitDomain"]) return Promise.resolve(false);
    return scopeValue13 = scopeValue13["catch"](() => undefined).then(async () => {
      const newScope721 = scopeValue53(scopeValue9, newScope718, newScope719, newScope720),
        newScope722 = await window.appStorage.commitDomain(scopeValue0, newScope721.state, {
          critical: true,
          reason: "ao3-edit-chapter"
        });
      if (newScope722 === false) return false;
      const newScope723 = scopeValue44(newScope718),
        newScope724 = newScope723?.["chapters"]["find"](newScope729 => newScope729.id === newScope719);
      if (!newScope724) return false;
      const {
        title: newScope725,
        content: newScope726,
        notes: newScope727,
        contentEdited: newScope728
      } = newScope721.chapter;
      return Object.assign(newScope724, {
        title: newScope725,
        content: newScope726,
        notes: newScope727,
        contentEdited: newScope728
      }), newScope723.updatedAt = newScope721.work.updatedAt, true;
    })["catch"](newScope730 => {
      return console.warn("[AO3] Failed to save chapter.", newScope730), false;
    }), scopeValue13;
  }
  async function newScope138() {
    const newScope731 = newScope16;
    if (!newScope731 || newScope731.saving || newScope731.composing) return;
    const newScope732 = {
      title: scopeValue8.chapterEditTitle.value,
      content: scopeValue8.chapterEditContent.value,
      notes: scopeValue8.chapterEditNotes.value
    };
    try {
      scopeValue53(scopeValue9, newScope731.workId, newScope731.chapterId, newScope732);
    } catch (newScope734) {
      scopeValue8.chapterEditError.textContent = newScope734.message, scopeValue60(!newScope732.title.trim() ? scopeValue8.chapterEditTitle : scopeValue8.chapterEditContent);
      return;
    }
    newScope731.saving = true, newScope136(true), scopeValue8.chapterEditError.textContent = "";
    const newScope733 = await newScope137(newScope731.workId, newScope731.chapterId, newScope732);
    if (newScope16 !== newScope731) return;
    newScope731.saving = false, newScope136(false);
    if (!newScope733) {
      scopeValue8.chapterEditError.textContent = "保存失败，请重试。 / Save failed; please retry.";
      return;
    }
    newScope135({
      restoreFocus: false
    }), scopeValue96({
      resetScroll: false
    }), scopeValue8.content.querySelector("[data-ao3-edit-chapter]")?.["focus"]?.({
      preventScroll: true
    }), scopeValue102("Chapter saved. / 本章已保存");
  }
  function newScope139(newScope735) {
    newScope735.target === scopeValue8.chapterEditTitle && scopeValue57(newScope735) && (newScope735.preventDefault(), scopeValue60(scopeValue8.chapterEditContent));
    if (newScope735.key !== "Tab") return;
    const newScope736 = [...scopeValue8.chapterEditForm.querySelectorAll("input, textarea, button")].filter(newScope739 => !newScope739.disabled),
      newScope737 = newScope736[0],
      newScope738 = newScope736[newScope736.length - 1];
    if (newScope735.shiftKey && newScope735.target === newScope737) newScope735.preventDefault(), newScope738?.["focus"]?.({
      preventScroll: true
    });else !newScope735.shiftKey && newScope735.target === newScope738 && (newScope735.preventDefault(), newScope737?.["focus"]?.({
      preventScroll: true
    }));
  }
  function newScope140(newScope740 = "new-work", scopeValue679 = null) {
    const scopeValue680 = scopeValue22(typeof window.getUserState === "function" ? window.getUserState()?.["persona"] : window.userState?.["persona"]);
    if (newScope740 === "next-chapter" && scopeValue679) return {
      mode: newScope740,
      workId: scopeValue679.id,
      title: scopeValue679.title,
      summary: scopeValue679.summary,
      rating: scopeValue679.rating,
      warning: scopeValue679.warning,
      category: scopeValue679.category,
      fandom: scopeValue679.fandom,
      relationship: scopeValue679.relationship,
      tags: scopeValue679.tags.join(", "),
      characters: scopeValue25(scopeValue679.characters),
      chapterRelationships: [...(scopeValue679.chapters[scopeValue679.chapters.length - 1]?.relationships || [])],
      worldBookIds: [...scopeValue679.worldBookIds],
      userPersona: scopeValue680,
      styleKey: scopeValue679.writingStyle.key || "custom",
      styleName: scopeValue679.writingStyle.name || "",
      styleText: scopeValue679.writingStyle.text || "",
      targetWords: 800,
      chapterNotes: "",
      plot: "",
      continuation: true
    };
    return {
      mode: "new-work",
      workId: "",
      title: "",
      summary: "",
      rating: "General Audiences",
      warning: "Creator Chose Not To Use Archive Warnings",
      category: "Gen",
      fandom: "",
      relationship: "",
      tags: "",
      userPersona: scopeValue680,
      characters: [{
        name: "",
        gender: "",
        persona: ""
      }],
      chapterRelationships: [],
      worldBookIds: [],
      styleKey: "style_baimiao",
      styleName: scopeValue7.style_baimiao.name,
      styleText: scopeValue7.style_baimiao.text,
      targetWords: 800,
      chapterNotes: "",
      plot: "",
      continuation: false
    };
  }
  function scopeValue133(scopeValue681) {
    return document.getElementById(scopeValue681);
  }
  function scopeValue134() {
    const scopeValue682 = Array.isArray(window.imData?.friends) ? window.imData.friends : [],
      scopeValue683 = new Set();
    return scopeValue682.filter(scopeValue684 => {
      if (scopeValue684?.type !== "char") return false;
      const scopeValue685 = String(scopeValue684.id || "");
      if (!scopeValue685 || scopeValue683.has(scopeValue685)) return false;
      return scopeValue683.add(scopeValue685), true;
    }).map(scopeValue686 => ({
      id: String(scopeValue686.id),
      name: scopeValue21(scopeValue686.nickname || scopeValue686.realName || scopeValue686.name, "未命名角色", 80),
      gender: scopeValue21(scopeValue686.gender, "未设定", 40),
      persona: scopeValue22(scopeValue686.persona || scopeValue686.signature || scopeValue686.description)
    }));
  }
  function scopeValue135(scopeValue687 = "") {
    const scopeValue688 = scopeValue133("ao3-imessage-character-select");
    if (!scopeValue688) return;
    const scopeValue689 = scopeValue134();
    scopeValue688.innerHTML = "<option value=\"\">iMessage Characters / iMessage 角色</option>" + scopeValue689.map(scopeValue690 => "<option value=\"" + scopeValue24(scopeValue690.id) + "\">" + scopeValue24(scopeValue690.name) + "</option>").join("");
    scopeValue688.value = scopeValue689.some(scopeValue691 => scopeValue691.id === scopeValue687) ? scopeValue687 : "";
  }
  function scopeValue136() {
    const scopeValue692 = scopeValue133("ao3-imessage-character-select")?.value || "",
      scopeValue693 = scopeValue134().find(scopeValue696 => scopeValue696.id === scopeValue692);
    if (!scopeValue693) return;
    scopeValue139(false);
    const scopeValue694 = {
        name: scopeValue693.name,
        gender: scopeValue693.gender,
        persona: scopeValue693.persona
      },
      scopeValue695 = scopeValue15.characters.findIndex(scopeValue697 => !scopeValue697.name && !scopeValue697.persona);
    if (scopeValue695 >= 0) scopeValue15.characters[scopeValue695] = scopeValue694;else scopeValue15.characters.push(scopeValue694);
    scopeValue141();
    scopeValue102(scopeValue693.persona ? "Char persona selected. / 已选择 Char 人设" : "Char selected. / 已选择角色");
  }
  function scopeValue137() {
    return [...(document.querySelectorAll("#ao3-character-list .ao3-character-row") || [])].map(scopeValue698 => ({
      name: scopeValue21(scopeValue698.querySelector("[data-character-name]")?.value, "", 80),
      gender: scopeValue21(scopeValue698.querySelector("[data-character-gender]")?.value, "未设定", 40),
      persona: scopeValue22(scopeValue698.querySelector("[data-character-persona]")?.value)
    })).filter(scopeValue699 => scopeValue699.name || scopeValue699.persona);
  }
  function scopeValue138() {
    return [...(document.querySelectorAll("#ao3-cp-list .ao3-cp-row") || [])].map(scopeValue700 => scopeValue21(scopeValue700.querySelector("[data-cp-relationship]")?.value, "", 160)).slice(0, 30);
  }
  function scopeValue139(scopeValue701 = false) {
    if (!scopeValue15) return null;
    const scopeValue702 = {
      ...scopeValue15,
      title: scopeValue21(scopeValue133("ao3-work-title-input")?.value, "", 160),
      summary: scopeValue21(scopeValue133("ao3-work-summary-input")?.value, "", 2000),
      rating: scopeValue21(scopeValue133("ao3-work-rating-input")?.value, "General Audiences", 100),
      warning: scopeValue21(scopeValue133("ao3-work-warning-input")?.value, "Creator Chose Not To Use Archive Warnings", 160),
      category: scopeValue21(scopeValue133("ao3-work-category-input")?.value, "Gen", 40),
      fandom: scopeValue21(scopeValue133("ao3-work-fandom-input")?.value, "", 240),
      relationship: scopeValue21(scopeValue133("ao3-work-relationship-input")?.value, "", 400),
      tags: scopeValue21(scopeValue133("ao3-work-tags-input")?.value, "", 800),
      userPersona: scopeValue22(scopeValue133("ao3-user-persona-input")?.value),
      characters: scopeValue137(),
      chapterRelationships: scopeValue138(),
      styleKey: scopeValue21(scopeValue133("ao3-style-preset-select")?.value, "custom", 100),
      styleName: scopeValue21(scopeValue133("ao3-style-preset-name")?.value, scopeValue15.styleName || "自定义文风", 60),
      styleText: scopeValue21(scopeValue133("ao3-style-input")?.value, "", 2000),
      targetWords: Math.min(scopeValue5, Math.max(scopeValue4, Math.trunc(Number(scopeValue133("ao3-word-count-input")?.value) || 800))),
      chapterNotes: scopeValue21(scopeValue133("ao3-chapter-notes-input")?.value, "", 4000),
      plot: scopeValue21(scopeValue133("ao3-plot-input")?.value, "", 10000),
      continuation: scopeValue15.mode === "next-chapter" && scopeValue133("ao3-continuation-input")?.checked === true
    };
    scopeValue15 = scopeValue702;
    if (!scopeValue701) return scopeValue702;
    const scopeValue703 = [[!scopeValue702.title, "Please enter a title. / 请输入作品标题。", "ao3-work-title-input"], [!scopeValue702.fandom, "Please enter a fandom. / 请输入作品圈。", "ao3-work-fandom-input"], [!scopeValue702.characters.length || scopeValue702.characters.some(scopeValue705 => !scopeValue705.name), "Every character needs a name. / 每个角色都需要名字。", "ao3-character-list"], [!scopeValue702.styleText, "Please enter a writing style. / 请输入文风。", "ao3-style-input"]],
      scopeValue704 = scopeValue703.find(scopeValue706 => scopeValue706[0]);
    if (scopeValue704) {
      if (scopeValue8.composerError) scopeValue8.composerError.textContent = scopeValue704[1];
      const scopeValue707 = scopeValue133(scopeValue704[2]);
      return scopeValue60(scopeValue707, scopeValue59(scopeValue707)), null;
    }
    return scopeValue702;
  }
  function scopeValue140(scopeValue708 = {}, scopeValue709 = 0) {
    return "<article class=\"ao3-character-row\" data-character-index=\"" + scopeValue709 + "\"><div class=\"ao3-character-row-head\"><strong>Character " + (scopeValue709 + 1) + "<small>角色 " + (scopeValue709 + 1) + "</small></strong><div class=\"ao3-character-row-actions\"><button type=\"button\" class=\"ao3-character-save\" data-ao3-save-character-preset=\"" + scopeValue709 + "\">Save Character<small>保存角色（含 User 人设）</small></button><button type=\"button\" data-ao3-remove-character=\"" + scopeValue709 + "\" aria-label=\"Remove character / 删除角色\"><i class=\"fas fa-xmark\"></i></button></div></div><div class=\"ao3-character-fields\"><label>Name<small>名字</small><input type=\"text\" maxlength=\"80\" enterkeyhint=\"next\" data-character-name value=\"" + scopeValue24(scopeValue708.name || "") + "\"></label><label>Gender<small>性别</small><input type=\"text\" maxlength=\"40\" enterkeyhint=\"next\" data-character-gender value=\"" + scopeValue24(scopeValue708.gender || "") + "\" placeholder=\"女 / 男 / 非二元 / 自定义\"></label></div><label>Persona<small>人设（不限字数）</small><textarea enterkeyhint=\"enter\" data-character-persona>" + scopeValue24(scopeValue708.persona || "") + "</textarea></label></article>";
  }
  function scopeValue141() {
    const scopeValue710 = scopeValue133("ao3-character-list");
    if (!scopeValue710 || !scopeValue15) return;
    if (!scopeValue15.characters.length) scopeValue15.characters.push({
      name: "",
      gender: "",
      persona: ""
    });
    scopeValue710.innerHTML = scopeValue15.characters.map(scopeValue140).join("");
  }
  function scopeValue142(scopeValue711 = "") {
    const scopeValue712 = scopeValue133("ao3-character-preset-select");
    if (!scopeValue712) return;
    scopeValue712.innerHTML = "<option value=\"\">Saved Characters / 已保存角色</option>" + scopeValue9.characterPresets.map(scopeValue713 => "<option value=\"" + scopeValue24(scopeValue713.id) + "\">" + scopeValue24(scopeValue713.name) + " · " + scopeValue24(scopeValue713.character.gender || "未设定") + "</option>").join("");
    scopeValue712.value = scopeValue9.characterPresets.some(scopeValue714 => scopeValue714.id === scopeValue711) ? scopeValue711 : "";
  }
  function scopeValue143(scopeValue715 = "", scopeValue716 = 0) {
    return "<article class=\"ao3-cp-row\" data-cp-index=\"" + scopeValue716 + "\"><div class=\"ao3-cp-row-head\"><strong>CP Relationship " + (scopeValue716 + 1) + "<small>本章 CP 关系 " + (scopeValue716 + 1) + "</small></strong><div class=\"ao3-cp-row-actions\"><button type=\"button\" class=\"ao3-cp-save\" data-ao3-save-cp-preset=\"" + scopeValue716 + "\">Save Relationship<small>保存关系</small></button><button type=\"button\" data-ao3-remove-cp=\"" + scopeValue716 + "\" aria-label=\"Remove CP relationship / 删除 CP 关系\"><i class=\"fas fa-xmark\"></i></button></div></div><label>Relationship<small>填写本章出现人物之间的 CP 关系</small><input type=\"text\" maxlength=\"160\" enterkeyhint=\"next\" data-cp-relationship value=\"" + scopeValue24(scopeValue715) + "\" placeholder=\"角色 A/角色 B · 对手变恋人\"></label></article>";
  }
  function scopeValue144() {
    const scopeValue717 = scopeValue133("ao3-cp-list");
    if (!scopeValue717 || !scopeValue15) return;
    scopeValue717.innerHTML = (Array.isArray(scopeValue15.chapterRelationships) ? scopeValue15.chapterRelationships : []).map(scopeValue143).join("");
  }
  function scopeValue145(scopeValue718 = "") {
    const scopeValue719 = scopeValue133("ao3-cp-preset-select");
    if (!scopeValue719) return;
    scopeValue719.innerHTML = "<option value=\"\">Saved CP Relationships / 已保存 CP 关系</option>" + scopeValue9.cpPresets.map(scopeValue720 => "<option value=\"" + scopeValue24(scopeValue720.id) + "\">" + scopeValue24(scopeValue720.name) + "</option>").join("");
    scopeValue719.value = scopeValue9.cpPresets.some(scopeValue721 => scopeValue721.id === scopeValue718) ? scopeValue718 : "";
  }
  function scopeValue146(scopeValue722 = "") {
    const scopeValue723 = scopeValue133("ao3-style-preset-select");
    if (!scopeValue723) return;
    scopeValue723.innerHTML = Object.entries(scopeValue7).map(([scopeValue724, scopeValue725]) => "<option value=\"" + scopeValue724 + "\">" + scopeValue24(scopeValue725.name) + "</option>").join("") + "<option value=\"custom\">自定义</option>" + scopeValue9.stylePresets.map(scopeValue726 => "<option value=\"" + scopeValue24(scopeValue726.id) + "\">" + scopeValue24(scopeValue726.name) + " · 已保存</option>").join("");
    scopeValue723.value = [...Object.keys(scopeValue7), "custom", ...scopeValue9.stylePresets.map(scopeValue727 => scopeValue727.id)].includes(scopeValue722) ? scopeValue722 : "custom";
  }
  function scopeValue147() {
    try {
      return typeof window.getWorldBooks === "function" && Array.isArray(window.getWorldBooks()) ? window.getWorldBooks() : [];
    } catch (scopeValue728) {
      return [];
    }
  }
  function scopeValue148() {
    const scopeValue729 = scopeValue133("ao3-worldbook-count"),
      scopeValue730 = scopeValue133("ao3-mounted-books");
    if (!scopeValue15 || !scopeValue729 || !scopeValue730) return;
    const scopeValue731 = scopeValue147();
    scopeValue15.worldBookIds = scopeValue15.worldBookIds.filter(scopeValue733 => scopeValue731.some(scopeValue734 => String(scopeValue734.id) === String(scopeValue733)));
    const scopeValue732 = scopeValue15.worldBookIds.map(scopeValue735 => scopeValue731.find(scopeValue736 => String(scopeValue736.id) === String(scopeValue735))).filter(scopeValue737 => scopeValue737 && !scopeValue737.isGlobal);
    scopeValue729.textContent = scopeValue732.length + " selected / 已选 " + scopeValue732.length + " 项";
    scopeValue730.innerHTML = scopeValue732.length ? scopeValue732.map(scopeValue738 => "<span><i class=\"fas fa-book\"></i>" + scopeValue24(scopeValue738.name || "未命名世界书") + "</span>").join("") : "<small>No world books mounted. / 尚未挂载世界书。</small>";
  }
  function scopeValue149() {
    if (!scopeValue15) return;
    scopeValue8.composerTitle.textContent = scopeValue15.mode === "next-chapter" ? "New Chapter" : "New Work";
    scopeValue8.composerSubtitle.textContent = scopeValue15.mode === "next-chapter" ? "为《" + scopeValue15.title + "》创作下一章" : "新建作品";
    const scopeValue739 = {
      "ao3-work-title-input": scopeValue15.title,
      "ao3-work-summary-input": scopeValue15.summary,
      "ao3-work-rating-input": scopeValue15.rating,
      "ao3-work-warning-input": scopeValue15.warning,
      "ao3-work-category-input": scopeValue15.category,
      "ao3-work-fandom-input": scopeValue15.fandom,
      "ao3-work-relationship-input": scopeValue15.relationship,
      "ao3-work-tags-input": scopeValue15.tags,
      "ao3-user-persona-input": scopeValue15.userPersona,
      "ao3-style-preset-name": scopeValue15.styleName,
      "ao3-style-input": scopeValue15.styleText,
      "ao3-word-count-input": scopeValue15.targetWords,
      "ao3-chapter-notes-input": scopeValue15.chapterNotes,
      "ao3-plot-input": scopeValue15.plot
    };
    Object.entries(scopeValue739).forEach(([scopeValue742, scopeValue743]) => {
      const scopeValue744 = scopeValue133(scopeValue742);
      if (scopeValue744) scopeValue744.value = scopeValue743 == null ? "" : scopeValue743;
    });
    const scopeValue740 = scopeValue133("ao3-continuation-row");
    if (scopeValue740) scopeValue740.hidden = scopeValue15.mode !== "next-chapter";
    const scopeValue741 = scopeValue133("ao3-continuation-input");
    if (scopeValue741) scopeValue741.checked = scopeValue15.continuation !== false;
    scopeValue141();
    scopeValue142();
    scopeValue135();
    scopeValue144();
    scopeValue145();
    scopeValue146(scopeValue15.styleKey);
    scopeValue148();
    if (scopeValue8.composerError) scopeValue8.composerError.textContent = "";
  }
  function scopeValue150(scopeValue745 = {}) {
    if (!scopeValue8?.composerOverlay) return false;
    const scopeValue746 = scopeValue745.mode === "next-chapter" ? "next-chapter" : "new-work",
      scopeValue747 = scopeValue746 === "next-chapter" ? scopeValue44(scopeValue745.workId) : null;
    if (scopeValue746 === "next-chapter" && !scopeValue747) return scopeValue102("Work not found. / 作品不存在"), false;
    return scopeValue15 = newScope140(scopeValue746, scopeValue747), scopeValue149(), scopeValue152(false), scopeValue8.composerOverlay.hidden = false, scopeValue8.composerOverlay.inert = false, requestAnimationFrame(() => scopeValue133(scopeValue746 === "new-work" ? "ao3-work-title-input" : "ao3-plot-input")?.["focus"]?.({
      preventScroll: true
    })), true;
  }
  function scopeValue151(scopeValue748 = {}) {
    if (!scopeValue8?.composerOverlay || scopeValue8.composerOverlay.hidden) return;
    if (scopeValue748.preserve !== false) scopeValue139(false);
    if (scopeValue748.abort !== false && scopeValue16) scopeValue16.abort();
    scopeValue16 = null;
    scopeValue152(false);
    scopeValue58(scopeValue8.composerOverlay);
    scopeValue8.composerOverlay.hidden = true;
    scopeValue8.composerOverlay.inert = true;
  }
  function scopeValue152(scopeValue749) {
    if (!scopeValue8?.composerForm) return;
    scopeValue8.composerForm.classList.toggle("is-generating", !!scopeValue749);
    scopeValue8.composerForm.querySelectorAll("input, textarea, select, button").forEach(scopeValue750 => {
      scopeValue750.disabled = !!scopeValue749 && !["ao3-composer-close", "ao3-composer-cancel"].includes(scopeValue750.id);
    });
    if (scopeValue8.generating) scopeValue8.generating.hidden = !scopeValue749;
    if (scopeValue8.composerSubmit) scopeValue8.composerSubmit.setAttribute("aria-busy", String(!!scopeValue749));
  }
  function scopeValue153(scopeValue751) {
    const scopeValue752 = scopeValue139(false),
      scopeValue753 = Math.max(0, Math.trunc(Number(scopeValue751) || 0)),
      scopeValue754 = scopeValue30(scopeValue752.characters[scopeValue753], scopeValue753);
    if (!scopeValue754?.name) {
      if (scopeValue8.composerError) scopeValue8.composerError.textContent = "Enter this character's name first. / 请先填写这个角色的名字。";
      return;
    }
    const scopeValue755 = scopeValue9.characterPresets.find(scopeValue757 => scopeValue757.name === scopeValue754.name),
      scopeValue756 = {
        id: scopeValue755?.id || "character-preset-" + Date.now(),
        name: scopeValue754.name,
        character: scopeValue25(scopeValue754),
        userPersona: scopeValue22(scopeValue752.userPersona)
      };
    scopeValue9.characterPresets = scopeValue755 ? scopeValue9.characterPresets.map(scopeValue758 => scopeValue758.id === scopeValue755.id ? scopeValue756 : scopeValue758) : [...scopeValue9.characterPresets, scopeValue756];
    void scopeValue64("ao3-character-preset");
    scopeValue142(scopeValue756.id);
    scopeValue102(scopeValue755 ? "Character preset updated. / 角色预设已覆盖" : "Character saved. / 角色已保存");
  }
  function scopeValue154() {
    const scopeValue759 = scopeValue133("ao3-character-preset-select")?.value || "",
      scopeValue760 = scopeValue9.characterPresets.find(scopeValue763 => scopeValue763.id === scopeValue759);
    if (!scopeValue760) return scopeValue102("Choose a saved character first. / 请先选择已保存角色");
    scopeValue139(false);
    const scopeValue761 = scopeValue25(scopeValue760.character);
    if (scopeValue760.userPersona) {
      scopeValue15.userPersona = scopeValue760.userPersona;
      const scopeValue764 = scopeValue133("ao3-user-persona-input");
      if (scopeValue764) scopeValue764.value = scopeValue760.userPersona;
    }
    const scopeValue762 = scopeValue15.characters.findIndex(scopeValue765 => !scopeValue765.name && !scopeValue765.persona);
    if (scopeValue762 >= 0) scopeValue15.characters[scopeValue762] = scopeValue761;else scopeValue15.characters.push(scopeValue761);
    scopeValue141();
    scopeValue102("Character added. / 已添加角色");
  }
  function scopeValue155() {
    const scopeValue766 = scopeValue133("ao3-character-preset-select")?.value || "";
    if (!scopeValue766) return scopeValue102("Choose a preset first. / 请先选择预设");
    scopeValue9.characterPresets = scopeValue9.characterPresets.filter(scopeValue767 => scopeValue767.id !== scopeValue766);
    void scopeValue64("ao3-character-preset-delete");
    scopeValue142();
    scopeValue102("Character preset deleted. / 角色预设已删除");
  }
  function scopeValue156(scopeValue768) {
    const scopeValue769 = scopeValue139(false),
      scopeValue770 = Math.max(0, Math.trunc(Number(scopeValue768) || 0)),
      scopeValue771 = scopeValue21(scopeValue769.chapterRelationships[scopeValue770], "", 160);
    if (!scopeValue771) {
      if (scopeValue8.composerError) scopeValue8.composerError.textContent = "Enter this CP relationship first. / 请先填写这条 CP 关系。";
      return;
    }
    const scopeValue772 = scopeValue9.cpPresets.find(scopeValue774 => scopeValue774.relationship === scopeValue771 || scopeValue774.name === scopeValue771),
      scopeValue773 = {
        id: scopeValue772?.id || "cp-preset-" + Date.now(),
        name: scopeValue771,
        relationship: scopeValue771
      };
    scopeValue9.cpPresets = scopeValue772 ? scopeValue9.cpPresets.map(scopeValue775 => scopeValue775.id === scopeValue772.id ? scopeValue773 : scopeValue775) : [...scopeValue9.cpPresets, scopeValue773];
    void scopeValue64("ao3-cp-preset");
    scopeValue145(scopeValue773.id);
    scopeValue102(scopeValue772 ? "CP relationship preset updated. / CP 关系预设已覆盖" : "CP relationship saved. / CP 关系已保存");
  }
  function scopeValue157() {
    const scopeValue776 = scopeValue133("ao3-cp-preset-select")?.value || "",
      scopeValue777 = scopeValue9.cpPresets.find(scopeValue778 => scopeValue778.id === scopeValue776);
    if (!scopeValue777) return scopeValue102("Choose a saved CP relationship first. / 请先选择已保存的 CP 关系");
    scopeValue139(false);
    if (!scopeValue15.chapterRelationships.includes(scopeValue777.relationship)) scopeValue15.chapterRelationships.push(scopeValue777.relationship);
    scopeValue144();
    scopeValue102("CP relationship added. / 已添加 CP 关系");
  }
  function scopeValue158() {
    const scopeValue779 = scopeValue133("ao3-cp-preset-select")?.value || "";
    if (!scopeValue779) return scopeValue102("Choose a CP preset first. / 请先选择 CP 关系预设");
    scopeValue9.cpPresets = scopeValue9.cpPresets.filter(scopeValue780 => scopeValue780.id !== scopeValue779);
    void scopeValue64("ao3-cp-preset-delete");
    scopeValue145();
    scopeValue102("CP relationship preset deleted. / CP 关系预设已删除");
  }
  function scopeValue159() {
    const scopeValue781 = scopeValue139(false),
      scopeValue782 = scopeValue21(scopeValue133("ao3-style-preset-name")?.value, "", 60);
    if (!scopeValue782 || !scopeValue781.styleText) {
      scopeValue8.composerError.textContent = "Enter a preset name and writing style. / 请输入预设名称和文风。";
      return;
    }
    const scopeValue783 = scopeValue133("ao3-style-preset-select")?.value || "",
      scopeValue784 = scopeValue9.stylePresets.find(scopeValue786 => scopeValue786.id === scopeValue783 || scopeValue786.name === scopeValue782),
      scopeValue785 = {
        id: scopeValue784?.id || "style-preset-" + Date.now(),
        name: scopeValue782,
        text: scopeValue781.styleText
      };
    scopeValue9.stylePresets = scopeValue784 ? scopeValue9.stylePresets.map(scopeValue787 => scopeValue787.id === scopeValue784.id ? scopeValue785 : scopeValue787) : [...scopeValue9.stylePresets, scopeValue785];
    scopeValue15.styleKey = scopeValue785.id;
    scopeValue15.styleName = scopeValue785.name;
    void scopeValue64("ao3-style-preset");
    scopeValue146(scopeValue785.id);
    scopeValue102("Writing style saved. / 文风预设已保存");
  }
  function scopeValue160() {
    const scopeValue788 = scopeValue133("ao3-style-preset-select")?.value || "";
    if (!scopeValue9.stylePresets.some(scopeValue789 => scopeValue789.id === scopeValue788)) return scopeValue102("Choose a saved preset first. / 请先选择已保存的预设");
    scopeValue9.stylePresets = scopeValue9.stylePresets.filter(scopeValue790 => scopeValue790.id !== scopeValue788);
    scopeValue15.styleKey = "custom";
    void scopeValue64("ao3-style-preset-delete");
    scopeValue146("custom");
    scopeValue102("Preset deleted. / 预设已删除");
  }
  function scopeValue161(scopeValue791, scopeValue792 = "") {
    const scopeValue793 = new Set((Array.isArray(scopeValue791) ? scopeValue791 : []).map(String)),
      scopeValue794 = [];
    return scopeValue147().filter(scopeValue795 => scopeValue793.has(String(scopeValue795.id))).forEach(scopeValue796 => {
      const scopeValue797 = (Array.isArray(scopeValue796.entries) ? scopeValue796.entries : []).map(scopeValue798 => window.normalizeWorldBookEntry ? window.normalizeWorldBookEntry(scopeValue798 || {}) : scopeValue798 || {}).filter(scopeValue799 => {
        if (scopeValue799.enabled === false || !scopeValue21(scopeValue799.content, "", 50000)) return false;
        if (scopeValue799.triggerMode !== "keyword") return true;
        if (typeof window.worldBookKeywordMatched === "function") return window.worldBookKeywordMatched(scopeValue799, scopeValue792);
        return scopeValue28(scopeValue799.keyword || "", 30, 100).some(scopeValue800 => String(scopeValue792).includes(scopeValue800));
      }).sort((scopeValue801, scopeValue802) => Number(scopeValue801.order || 100) - Number(scopeValue802.order || 100));
      if (!scopeValue797.length) return;
      scopeValue794.push("〔" + (scopeValue796.name || "未命名世界书") + `〕
` + scopeValue797.map(scopeValue803 => window.formatWorldBookEntryForPrompt ? window.formatWorldBookEntryForPrompt(scopeValue803) : "【" + (scopeValue803.title || scopeValue803.name || "词条") + `】
` + scopeValue803.content).join(`

`));
    }), scopeValue794.join(`

`).trim();
  }
  function scopeValue162(scopeValue804, scopeValue805 = "") {
    const scopeValue806 = scopeValue147(),
      scopeValue807 = new Set(scopeValue806.filter(scopeValue810 => scopeValue810?.["isGlobal"]).map(scopeValue811 => String(scopeValue811.id))),
      newScope870 = (Array.isArray(scopeValue804) ? scopeValue804 : []).filter(scopeValue812 => !scopeValue807.has(String(scopeValue812))),
      newScope871 = scopeValue161(newScope870, scopeValue805),
      scopeValue809 = typeof window.getGlobalWorldBookContextByPosition === "function" ? ["system_depth", "before_role", "after_role"].map(scopeValue813 => window.getGlobalWorldBookContextByPosition(scopeValue813, scopeValue805, {
        includeBuiltin: false
      })).filter(Boolean).join("\n\n") : scopeValue161([...scopeValue807], scopeValue805);
    return [scopeValue809, newScope871].filter(Boolean).join("\n\n");
  }
  function scopeValue163(newScope877, scopeValue815) {
    const scopeValue820 = newScope877.mode === "next-chapter" && newScope877.continuation ? scopeValue815?.["chapters"][scopeValue815.chapters.length - 1] : null;
    if (!scopeValue820) return {
      text: "",
      edited: false
    };
    return scopeValue820.contentEdited ? {
      text: scopeValue820.title + "\n" + scopeValue820.content,
      edited: true
    } : {
      text: scopeValue820.summary || "",
      edited: false
    };
  }
  function newScope172(scopeValue814, newScope881 = "", newScope882 = "") {
    scopeValue814 = {
      ...scopeValue814,
      styleText: `【文学指导（AO3 独立副本）】
` + scopeValue6.style_creative_guidance + `

【选定文风】
` + scopeValue814.styleText + `

【正文分段硬性要求】
正文必须分段输出。每段约100至150字，段落之间必须保留一个空行，不要把所有文字挤在同一个长段落里。
如果包含对白，仍要让叙述段落和对白自然分开，保持阅读呼吸感。`
    };
    const scopeValue817 = scopeValue814.characters.map((newScope888, newScope889) => newScope889 + 1 + ". 姓名：" + newScope888.name + "\n性别：" + (newScope888.gender || "未设定") + "\n人设：" + (newScope888.persona || "未填写")).join("\n\n"),
      newScope884 = scopeValue28(scopeValue814.chapterRelationships || [], 30, 160),
      scopeValue819 = newScope884.length ? newScope884.map((newScope890, newScope891) => newScope891 + 1 + ". " + newScope890).join("\n") : "未指定，请依据角色人设与作品关系自然处理。",
      scopeValue816 = typeof newScope882 === "string" ? {
        text: newScope882,
        edited: false
      } : newScope882,
      newScope887 = scopeValue814.mode === "next-chapter" && scopeValue814.continuation && scopeValue816?.["text"] ? scopeValue816.edited ? "\n【上一章最新正文，以用户修改后的内容为准】\n" + scopeValue816.text + "\n请依据这份最新正文承接情节。\n" : "\n【上一章总结，仅用于承接】\n" + scopeValue816.text + "\n" : "";
    return "你是一位中文同人小说作者。请根据用户给出的设定创作一章完整小说，同时生成便于下一章承接的简洁总结。\n\n【作品资料】\n标题：" + scopeValue814.title + "\n简介：" + (scopeValue814.summary || "未填写") + "\n分级：" + scopeValue814.rating + "\n作品警告：" + scopeValue814.warning + "\n分类：" + scopeValue814.category + "\n作品圈：" + scopeValue814.fandom + "\n关系：" + (scopeValue814.relationship || "未指定") + "\n附加标签：" + (scopeValue814.tags || "无") + "\n\n【角色】\n" + scopeValue817 + "\n\n【本章 CP 关系】\n" + scopeValue819 + "\n以上关系仅约束本章实际出现人物之间的 CP 互动，不要擅自合并、替换或遗漏用户指定的关系。\n\n【文风】\n" + scopeValue814.styleText + "\n\n【目标长度】\n正文约 " + scopeValue814.targetWords + " 字，允许自然浮动，但不要明显短于要求。\n\n【本章剧情】\n" + (scopeValue814.plot || "用户没有指定剧情。请基于作品资料、角色人设、关系、文风与世界书自由创作自然完整的一章。") + "\n" + newScope887 + (newScope881 ? "\n【挂载世界书，必须遵守】\n" + newScope881 + "\n" : "") + "\n【输出规则】\n1. 使用简体中文创作，保持角色人设、关系、分级和作品警告一致。\n2. content 只放小说正文，不要写创作说明、字数统计或 Markdown 标题。\n3. chapterSummary 用一段简洁文字记录本章事件、关系变化、未解决线索和结尾状态，供下一章续写。\n4. 只返回合法 JSON，不要 Markdown 代码块，不要额外解释。\n严格结构：{\"chapterTitle\":\"章节标题\",\"content\":\"完整正文\",\"chapterSummary\":\"本章总结\"}";
  }
  function scopeValue164(scopeValue825) {
    const scopeValue826 = String(scopeValue825 || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    let scopeValue827;
    try {
      scopeValue827 = JSON.parse(scopeValue826);
    } catch (scopeValue831) {
      const scopeValue832 = scopeValue826.indexOf("{"),
        scopeValue833 = scopeValue826.lastIndexOf("}");
      if (scopeValue832 < 0 || scopeValue833 <= scopeValue832) throw new Error("AI 返回内容不是有效 JSON");
      scopeValue827 = JSON.parse(scopeValue826.slice(scopeValue832, scopeValue833 + 1));
    }
    const scopeValue828 = scopeValue21(scopeValue827?.chapterTitle, "", 160),
      scopeValue829 = scopeValue91(scopeValue21(scopeValue827?.content, "", 200000)).join(`

`),
      scopeValue830 = scopeValue21(scopeValue827?.chapterSummary, "", 4000);
    if (!scopeValue828 || !scopeValue829 || !scopeValue830) throw new Error("AI 返回缺少章节标题、正文或本章总结");
    return {
      chapterTitle: scopeValue828,
      content: scopeValue829,
      chapterSummary: scopeValue830
    };
  }
  function scopeValue165(scopeValue834, scopeValue835, scopeValue836, scopeValue837 = scopeValue834.profile) {
    const scopeValue838 = scopeValue42(scopeValue834),
      scopeValue839 = new Date().toISOString(),
      scopeValue840 = "ao3-work-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      scopeValue841 = scopeValue33({
        id: scopeValue840,
        title: scopeValue835.title,
        authorPseud: scopeValue837.pseud,
        fandom: scopeValue835.fandom,
        relationship: scopeValue835.relationship,
        characters: scopeValue835.characters,
        tags: scopeValue28(scopeValue835.tags),
        rating: scopeValue835.rating,
        warning: scopeValue835.warning,
        category: scopeValue835.category,
        language: "中文-普通话 國語",
        published: scopeValue26(),
        updatedAt: scopeValue839,
        summary: scopeValue835.summary || "暂无简介。",
        worldBookIds: scopeValue835.worldBookIds,
        writingStyle: {
          key: scopeValue835.styleKey,
          name: scopeValue835.styleName,
          text: scopeValue835.styleText
        },
        baseStats: {
          kudos: 0,
          bookmarks: 0,
          hits: 0
        },
        chapters: [{
          id: "chapter-" + Date.now() + "-1",
          title: scopeValue836.chapterTitle,
          content: scopeValue836.content,
          summary: scopeValue836.chapterSummary,
          notes: scopeValue835.chapterNotes || "",
          relationships: scopeValue28(scopeValue835.chapterRelationships || [], 30, 160),
          targetWords: scopeValue835.targetWords,
          usedContinuation: false,
          createdAt: scopeValue839
        }]
      }, scopeValue838.works.length);
    return scopeValue838.works.push(scopeValue841), scopeValue838.commentsByWork[scopeValue840] = [], scopeValue838.repliesByComment[scopeValue840] = {}, scopeValue838.deletedCommentIdsByWork[scopeValue840] = [], scopeValue838.kudosByWork[scopeValue840] = false, scopeValue838.lastChapterByWork[scopeValue840] = 1, {
      state: scopeValue838,
      workId: scopeValue840,
      chapter: 1
    };
  }
  function scopeValue166(scopeValue842, scopeValue843, scopeValue844, scopeValue845) {
    const scopeValue846 = scopeValue42(scopeValue842),
      scopeValue847 = scopeValue43(scopeValue846, scopeValue843);
    if (!scopeValue847) throw new Error("要续写的作品不存在");
    const scopeValue848 = new Date().toISOString();
    return scopeValue847.title = scopeValue844.title, scopeValue847.summary = scopeValue844.summary || scopeValue847.summary, scopeValue847.fandom = scopeValue844.fandom, scopeValue847.relationship = scopeValue844.relationship, scopeValue847.rating = scopeValue844.rating, scopeValue847.warning = scopeValue844.warning, scopeValue847.category = scopeValue844.category, scopeValue847.tags = scopeValue28(scopeValue844.tags), scopeValue847.characters = scopeValue844.characters.map(scopeValue30).filter(Boolean), scopeValue847.worldBookIds = [...scopeValue844.worldBookIds], scopeValue847.writingStyle = {
      key: scopeValue844.styleKey,
      name: scopeValue844.styleName,
      text: scopeValue844.styleText
    }, scopeValue847.updatedAt = scopeValue848, scopeValue847.chapters.push({
      id: "chapter-" + Date.now() + "-" + (scopeValue847.chapters.length + 1),
      title: scopeValue845.chapterTitle,
      content: scopeValue845.content,
      summary: scopeValue845.chapterSummary,
      notes: scopeValue844.chapterNotes || "",
      relationships: scopeValue28(scopeValue844.chapterRelationships || [], 30, 160),
      targetWords: scopeValue844.targetWords,
      usedContinuation: scopeValue844.continuation === true,
      createdAt: scopeValue848
    }), scopeValue846.lastChapterByWork[scopeValue847.id] = scopeValue847.chapters.length, {
      state: scopeValue846,
      workId: scopeValue847.id,
      chapter: scopeValue847.chapters.length
    };
  }
  async function scopeValue167(scopeValue849, scopeValue850, scopeValue851 = "你是严谨的小说创作助手，只输出要求的合法 JSON。", scopeValue852 = 0.8) {
    const scopeValue853 = typeof window.getApiConfig === "function" ? window.getApiConfig() : window.apiConfig || {};
    if (!scopeValue853?.endpoint || !scopeValue853?.apiKey || !scopeValue853?.model) throw new Error("请先在系统设置中完成 API 配置");
    const scopeValue854 = window.u2Api?.normalizeApiEndpoint ? window.u2Api.normalizeApiEndpoint(scopeValue853.endpoint, scopeValue853.provider) : window.u2Api?.resolveChatCompletionsEndpoint?.(scopeValue853.endpoint);
    if (!scopeValue854) throw new Error("API 地址无效");
    const scopeValue855 = window.u2Api?.buildApiHeaders ? window.u2Api.buildApiHeaders(scopeValue853, {
        "X-U2-Silent-Errors": "1"
      }) : {
        "Content-Type": "application/json",
        Authorization: "Bearer " + scopeValue853.apiKey,
        "X-U2-Silent-Errors": "1"
      },
      scopeValue856 = {
        model: scopeValue853.model,
        messages: [{
          role: "system",
          content: scopeValue851
        }, {
          role: "user",
          content: scopeValue849
        }],
        temperature: Number.isFinite(Number(scopeValue852)) ? Number(scopeValue852) : 0.8,
        response_format: {
          type: "json_object"
        }
      },
      scopeValue857 = window.u2Api?.fetchChatCompletion,
      scopeValue858 = scopeValue857 ? await scopeValue857(scopeValue854, {
        method: "POST",
        headers: scopeValue855,
        apiConfig: scopeValue853,
        body: scopeValue856,
        signal: scopeValue850
      }) : await window.fetch(scopeValue854, {
        method: "POST",
        headers: scopeValue855,
        body: JSON.stringify(scopeValue856),
        signal: scopeValue850
      });
    if (!scopeValue858.ok) {
      const scopeValue861 = window.u2Api?.readApiError ? await window.u2Api.readApiError(scopeValue858) : null;
      throw window.u2Api?.createHttpError?.(scopeValue858, scopeValue861) || Object.assign(new Error(scopeValue861?.message || "API 请求失败（HTTP " + scopeValue858.status + "）"), {
        status: scopeValue858.status
      });
    }
    const scopeValue859 = await scopeValue858.json(),
      scopeValue860 = scopeValue859?.choices?.[0]?.message?.content ?? scopeValue859?.choices?.[0]?.text ?? "";
    return Array.isArray(scopeValue860) ? scopeValue860.map(scopeValue862 => scopeValue862?.text || scopeValue862 || "").join("") : String(scopeValue860 || "");
  }
  function scopeValue168(scopeValue863, scopeValue864) {
    return scopeValue167(scopeValue863, scopeValue864);
  }
  async function scopeValue169() {
    const scopeValue865 = scopeValue139(true);
    if (!scopeValue865 || scopeValue16) return;
    const scopeValue866 = scopeValue865.mode === "next-chapter" ? scopeValue44(scopeValue865.workId) : null,
      scopeValue867 = scopeValue163(scopeValue865, scopeValue866),
      scopeValue868 = [scopeValue865.title, scopeValue865.summary, scopeValue865.relationship, scopeValue865.tags, scopeValue865.plot, ...(scopeValue865.chapterRelationships || []), ...scopeValue865.characters.flatMap(scopeValue872 => [scopeValue872.name, scopeValue872.persona]), scopeValue867.text].join("\n"),
      scopeValue869 = scopeValue162(scopeValue865.worldBookIds, scopeValue868),
      scopeValue870 = newScope172(scopeValue865, scopeValue869, scopeValue867);
    scopeValue16 = new AbortController();
    const scopeValue871 = scopeValue16;
    scopeValue152(true);
    if (scopeValue8.composerError) scopeValue8.composerError.textContent = "";
    try {
      const scopeValue873 = await scopeValue168(scopeValue870, scopeValue871.signal),
        scopeValue874 = scopeValue164(scopeValue873),
        scopeValue875 = scopeValue865.mode === "next-chapter" ? scopeValue166(scopeValue9, scopeValue865.workId, scopeValue865, scopeValue874) : scopeValue165(scopeValue9, scopeValue865, scopeValue874, scopeValue9.profile);
      scopeValue9 = scopeValue875.state;
      await scopeValue64(scopeValue865.mode === "next-chapter" ? "ao3-generate-chapter" : "ao3-generate-work");
      scopeValue16 = null;
      scopeValue151({
        abort: false,
        preserve: false
      });
      scopeValue98("work", {
        workId: scopeValue875.workId,
        chapter: scopeValue875.chapter
      });
      scopeValue102(scopeValue865.mode === "next-chapter" ? "Chapter published. / 新章节已发布" : "Work published. / 新作品已发布");
    } catch (scopeValue876) {
      if (scopeValue871.signal.aborted || scopeValue876?.name === "AbortError") return;
      if (window.u2Api?.isRequestError?.(scopeValue876)) window.u2Api.reportError(scopeValue876, {
        operation: scopeValue865.mode === "next-chapter" ? "章节生成" : "作品生成",
        signal: scopeValue871.signal
      });else {
        if (scopeValue8.composerError) scopeValue8.composerError.textContent = (scopeValue876?.message || "生成失败，请重试") + " / Creation failed; please retry.";
      }
    } finally {
      if (scopeValue16 === scopeValue871) scopeValue16 = null;
      if (!scopeValue8?.composerOverlay?.hidden) scopeValue152(false);
    }
  }
  function scopeValue170(scopeValue877) {
    const scopeValue878 = scopeValue877.target.closest("[data-ao3-remove-character]");
    if (scopeValue878) {
      scopeValue139(false);
      scopeValue15.characters.splice(Number(scopeValue878.dataset.ao3RemoveCharacter), 1);
      scopeValue141();
      return;
    }
    if (scopeValue877.target.closest("[data-ao3-add-character]")) {
      scopeValue139(false);
      scopeValue15.characters.push({
        name: "",
        gender: "",
        persona: ""
      });
      scopeValue141();
      return;
    }
    const scopeValue879 = scopeValue877.target.closest("[data-ao3-save-character-preset]");
    if (scopeValue879) return scopeValue153(scopeValue879.dataset.ao3SaveCharacterPreset);
    if (scopeValue877.target.closest("[data-ao3-use-character-preset]")) return scopeValue154();
    if (scopeValue877.target.closest("[data-ao3-delete-character-preset]")) return scopeValue155();
    const scopeValue880 = scopeValue877.target.closest("[data-ao3-remove-cp]");
    if (scopeValue880) {
      scopeValue139(false);
      scopeValue15.chapterRelationships.splice(Number(scopeValue880.dataset.ao3RemoveCp), 1);
      scopeValue144();
      return;
    }
    if (scopeValue877.target.closest("[data-ao3-add-cp]")) {
      scopeValue139(false);
      scopeValue15.chapterRelationships.push("");
      scopeValue144();
      return;
    }
    const scopeValue881 = scopeValue877.target.closest("[data-ao3-save-cp-preset]");
    if (scopeValue881) return scopeValue156(scopeValue881.dataset.ao3SaveCpPreset);
    if (scopeValue877.target.closest("[data-ao3-use-cp-preset]")) return scopeValue157();
    if (scopeValue877.target.closest("[data-ao3-delete-cp-preset]")) return scopeValue158();
    if (scopeValue877.target.closest("[data-ao3-save-style-preset]")) return scopeValue159();
    if (scopeValue877.target.closest("[data-ao3-delete-style-preset]")) return scopeValue160();
    if (scopeValue877.target.closest("[data-ao3-select-worldbooks]")) {
      scopeValue139(false);
      if (typeof window.renderWorldBookSelector !== "function") return scopeValue102("World books are unavailable. / 世界书功能未加载");
      window.renderWorldBookSelector(scopeValue15.worldBookIds, scopeValue882 => {
        if (!scopeValue15) return;
        scopeValue15.worldBookIds = scopeValue882.map(String);
        scopeValue148();
      });
    }
  }
  function scopeValue171(scopeValue883) {
    if (scopeValue883.target.id === "ao3-imessage-character-select") return scopeValue136();
    if (scopeValue883.target.id === "ao3-style-preset-select") {
      const scopeValue884 = scopeValue7[scopeValue883.target.value],
        scopeValue885 = scopeValue9.stylePresets.find(scopeValue886 => scopeValue886.id === scopeValue883.target.value);
      if (scopeValue884) {
        scopeValue15.styleKey = scopeValue883.target.value;
        scopeValue15.styleName = scopeValue884.name;
        scopeValue15.styleText = scopeValue884.text;
      } else scopeValue885 ? (scopeValue15.styleKey = scopeValue885.id, scopeValue15.styleName = scopeValue885.name, scopeValue15.styleText = scopeValue885.text) : (scopeValue15.styleKey = "custom", scopeValue15.styleName = "", scopeValue15.styleText = "");
      scopeValue133("ao3-style-preset-name").value = scopeValue15.styleName;
      scopeValue133("ao3-style-input").value = scopeValue15.styleText;
    }
  }
  function scopeValue172(scopeValue887) {
    const scopeValue888 = scopeValue887.target.closest("[data-ao3-edit-chapter]");
    if (scopeValue888) return scopeValue132(scopeValue888.dataset.ao3EditChapter);
    const newScope956 = scopeValue887.target.closest("[data-ao3-toggle-comment-section]");
    if (newScope956) return scopeValue112(newScope956);
    const scopeValue889 = scopeValue887.target.closest("[data-ao3-toggle-translation]");
    if (scopeValue889) return scopeValue113(scopeValue889);
    const scopeValue890 = scopeValue887.target.closest("[data-ao3-toggle-reply]");
    if (scopeValue890) return scopeValue114(scopeValue890);
    const scopeValue891 = scopeValue887.target.closest("[data-ao3-cancel-reply]");
    if (scopeValue891) return scopeValue114(scopeValue891, true);
    const scopeValue892 = scopeValue887.target.closest("[data-ao3-delete-reply]");
    if (scopeValue892) return scopeValue109(scopeValue892.dataset.workId, scopeValue892.dataset.commentId, scopeValue892.dataset.ao3DeleteReply);
    const scopeValue893 = scopeValue887.target.closest("[data-ao3-delete-comment]");
    if (scopeValue893) return scopeValue108(scopeValue893.dataset.workId, scopeValue893.dataset.ao3DeleteComment);
    const scopeValue894 = scopeValue887.target.closest("[data-ao3-delete-chapter]");
    if (scopeValue894 && !scopeValue894.disabled) return void scopeValue110(scopeValue894.dataset.ao3DeleteChapter);
    const scopeValue895 = scopeValue887.target.closest("[data-ao3-delete-work]");
    if (scopeValue895) return void scopeValue111(scopeValue895.dataset.ao3DeleteWork);
    const scopeValue896 = scopeValue887.target.closest("[data-ao3-route]");
    if (scopeValue896) return scopeValue98(scopeValue896.dataset.ao3Route, {});
    const scopeValue897 = scopeValue887.target.closest("[data-ao3-open-work]");
    if (scopeValue897) {
      const scopeValue902 = scopeValue897.dataset.ao3OpenWork;
      return scopeValue98("work", {
        workId: scopeValue902,
        chapter: scopeValue9.lastChapterByWork[scopeValue902] || 1
      });
    }
    const scopeValue898 = scopeValue887.target.closest("[data-ao3-search]");
    if (scopeValue898) return scopeValue98("search", {
      query: scopeValue898.dataset.ao3Search || ""
    });
    const scopeValue899 = scopeValue887.target.closest("[data-ao3-chapter]");
    if (scopeValue899 && !scopeValue899.disabled) {
      const scopeValue903 = scopeValue104();
      return scopeValue98("work", {
        workId: scopeValue903.id,
        chapter: scopeValue45(scopeValue899.dataset.ao3Chapter, scopeValue903)
      });
    }
    const scopeValue900 = scopeValue887.target.closest("[data-ao3-new-chapter]");
    if (scopeValue900) return scopeValue150({
      mode: "next-chapter",
      workId: scopeValue900.dataset.ao3NewChapter
    });
    if (scopeValue887.target.closest("[data-ao3-new-work]")) return scopeValue150({
      mode: "new-work"
    });
    if (scopeValue887.target.closest("[data-ao3-top]")) return scopeValue8?.scroll?.scrollTo?.({
      top: 0,
      behavior: "smooth"
    });
    if (scopeValue887.target.closest("[data-ao3-generate-comments]")) return void scopeValue123();
    if (scopeValue887.target.closest("[data-ao3-kudos]")) return scopeValue105();
    if (scopeValue887.target.closest("[data-ao3-download]")) return void scopeValue125();
    if (scopeValue887.target.closest("[data-ao3-edit-profile]")) return scopeValue127();
    const scopeValue901 = scopeValue887.target.closest("[data-ao3-profile-tab]");
    if (scopeValue901) scopeValue98("profile", {
      tab: scopeValue901.dataset.ao3ProfileTab
    });
  }
  function scopeValue173(scopeValue904) {
    if (scopeValue904.target.id === "ao3-page-search-form") return scopeValue904.preventDefault(), scopeValue98("search", {
      query: scopeValue904.target.querySelector("#ao3-page-search-input")?.value || ""
    }, {
      replace: true
    });
    scopeValue904.target.id === "ao3-comment-form" && (scopeValue904.preventDefault(), scopeValue106(scopeValue904.target));
    scopeValue904.target.matches("[data-ao3-reply-form]") && (scopeValue904.preventDefault(), scopeValue107(scopeValue904.target));
  }
  function scopeValue174(scopeValue905) {
    if (scopeValue905.target.matches("[name=\"reply-text\"]")) {
      const scopeValue909 = scopeValue905.target.closest("[data-ao3-reply-form]")?.querySelector("[data-ao3-reply-error]");
      if (scopeValue909) scopeValue909.textContent = "";
      return;
    }
    if (scopeValue905.target.id !== "ao3-comment-input") return;
    const scopeValue906 = Math.max(0, scopeValue3 - scopeValue905.target.value.length),
      scopeValue907 = document.getElementById("ao3-comment-counter");
    if (scopeValue907) scopeValue907.textContent = scopeValue906 + " characters left / 剩余 " + scopeValue906 + " 字符";
    const scopeValue908 = document.getElementById("ao3-comment-error");
    if (scopeValue908) scopeValue908.textContent = "";
  }
  function scopeValue175() {
    if (!scopeValue8?.view || scopeValue8.view.dataset.ao3Bound === "true") return;
    scopeValue8.view.dataset.ao3Bound = "true";
    document.getElementById("ao3-exit-button")?.addEventListener("click", scopeValue101);
    scopeValue8.historyBack?.addEventListener("click", scopeValue99);
    document.getElementById("ao3-wordmark-button")?.addEventListener("click", () => scopeValue98("home"));
    document.getElementById("ao3-header-profile-button")?.addEventListener("click", () => scopeValue98("profile"));
    document.querySelectorAll("[data-ao3-header-route]").forEach(scopeValue910 => scopeValue910.addEventListener("click", () => scopeValue98(scopeValue910.dataset.ao3HeaderRoute)));
    scopeValue8.headerSearch?.addEventListener("submit", scopeValue911 => {
      scopeValue911.preventDefault();
      scopeValue98("search", {
        query: scopeValue8.headerSearchInput?.value || ""
      });
    });
    scopeValue8.content?.addEventListener("click", scopeValue172);
    scopeValue8.content?.addEventListener("submit", scopeValue173);
    scopeValue8.content?.addEventListener("input", scopeValue174);
    document.getElementById("ao3-profile-avatar-button")?.addEventListener("click", () => scopeValue8.profileAvatarInput?.click());
    scopeValue8.profileAvatarInput?.addEventListener("change", () => {
      const scopeValue912 = scopeValue8.profileAvatarInput.files?.[0];
      scopeValue8.profileAvatarInput.value = "";
      if (scopeValue912) void scopeValue130(scopeValue912);
    });
    document.getElementById("ao3-profile-edit-cancel")?.addEventListener("click", scopeValue128);
    scopeValue8.profileForm?.addEventListener("submit", scopeValue913 => {
      scopeValue913.preventDefault();
      scopeValue131();
    });
    scopeValue8.profileForm?.addEventListener("keydown", scopeValue61);
    scopeValue8.profileOverlay?.addEventListener("click", scopeValue914 => {
      if (scopeValue914.target === scopeValue8.profileOverlay) scopeValue128();
    }), document.getElementById("ao3-chapter-edit-close")?.["addEventListener"]("click", () => newScope135()), document.getElementById("ao3-chapter-edit-cancel")?.["addEventListener"]("click", () => newScope135()), scopeValue8.chapterEditForm?.["addEventListener"]("submit", newScope983 => {
      newScope983.preventDefault(), void newScope138();
    }), scopeValue8.chapterEditForm?.["addEventListener"]("keydown", newScope139), scopeValue8.chapterEditForm?.["addEventListener"]("compositionstart", () => {
      if (newScope16) newScope16.composing = true;
    }), scopeValue8.chapterEditForm?.["addEventListener"]("compositionend", () => {
      if (newScope16) newScope16.composing = false;
    }), scopeValue8.chapterEditForm?.["addEventListener"]("input", () => {
      scopeValue8.chapterEditError.textContent = "";
    }), document.getElementById("ao3-composer-close")?.["addEventListener"]("click", () => scopeValue151({
      abort: true,
      preserve: true
    }));
    document.getElementById("ao3-composer-cancel")?.addEventListener("click", () => scopeValue151({
      abort: true,
      preserve: true
    }));
    scopeValue8.composerOverlay?.addEventListener("click", scopeValue915 => {
      if (scopeValue915.target === scopeValue8.composerOverlay) scopeValue151({
        abort: true,
        preserve: true
      });else scopeValue170(scopeValue915);
    });
    scopeValue8.composerOverlay?.addEventListener("change", scopeValue171);
    scopeValue8.composerOverlay?.addEventListener("input", () => {
      if (scopeValue8.composerError) scopeValue8.composerError.textContent = "";
    }), scopeValue8.composerForm?.["addEventListener"]("keydown", scopeValue62), scopeValue8.composerForm?.["addEventListener"]("submit", scopeValue916 => {
      scopeValue916.preventDefault(), void scopeValue169();
    }), scopeValue8.view.addEventListener("keydown", scopeValue917 => {
      if (scopeValue917.key !== "Escape" || scopeValue917.isComposing || scopeValue917.keyCode === 229 || newScope16?.["composing"]) return;
      if (!scopeValue8.chapterEditOverlay?.["hidden"]) scopeValue917.preventDefault(), newScope135();else {
        if (!scopeValue8.composerOverlay?.["hidden"]) scopeValue151({
          abort: true,
          preserve: true
        });else {
          if (!scopeValue8.profileOverlay?.["hidden"]) scopeValue128();else scopeValue99();
        }
      }
    });
    window.addEventListener("u2:worldbooks-updated", () => {
      if (!scopeValue8.composerOverlay?.hidden) scopeValue148();
    });
    document.addEventListener("imessage-data-ready", () => {
      if (!scopeValue8.composerOverlay?.hidden) scopeValue135();
    });
  }
  function scopeValue176() {
    scopeValue56();
    if (!scopeValue8.view) return;
    scopeValue9 = scopeValue41();
    scopeValue66();
    scopeValue96();
    scopeValue175();
    scopeValue63();
    void scopeValue65();
  }
  window.ao3App = {
    open: scopeValue100,
    close: scopeValue101,
    navigate: scopeValue98,
    openComposer: scopeValue150,
    getState: () => scopeValue42(scopeValue9)
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scopeValue176, {
    once: true
  });else scopeValue176();
})();
