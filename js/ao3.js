(function () {
    'use strict';

    const text_2 = 'ao3',
        schemaVersion_2 = 5,
        text_3 = 'before-the-tide-arrives',
        count_4 = 10000,
        count_5 = 200,
        count_6 = 10000,
        freeze_7 = Object.freeze({
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
</writing_style>`,
            style_green_apple: `<writing_style name="文风-青苹果">
一、基调
温柔清透，留白感强。心动靠细节和沉默传递，不靠直白告白或浓烈抒情。舞台多为日常场景：教室、放学路、屋顶、便利店、雨天共伞。

二、句子节奏
短句为主，长短交错；关键瞬间用短句甚至单句成段"定格"。多用"……"表现欲言又止。对话与描写穿插，避免大段连续叙述。

三、描写重点
- 环境：光线、季节、声音（风声、脚步声）点到为止，做情绪的"容器"，不堆砌辞藻。
- 动作：小动作最出彩——耳朵发红、绞衣角、视线飘忽、欲靠近又退开半步。
- 心理：用陌生化比喻代替直说，避免"心如撞鹿""脸红如苹果"式老套修辞。

四、对话风格
口语化、简短，害羞时有短暂沉默或话题被岔开。拌嘴、反差萌制造心动，少用"喜欢"之类直白词汇。

五、甜度把控
一次互动只放大1个心动瞬间，不堆叠高糖桥段。结尾常留白或转移话题，不把情绪说满。

六、禁忌
不用夸张比喻、不堆砌形容词、不写大段爱意宣言，不写狗血冲突或突兀的剧烈情绪转折。

七、技巧参考（仿写示范，非引用原文）
- 环境即情绪（新海诚式）：
　雨伞骨架滴着水，屋檐下的光线被切成一格一格。她没说话，我也没问。
- 轻语气藏重量（住野夜式）：
　"如果明天世界毁灭，你会先做什么？"
　"先把作业写完吧，不然很亏。"
- 短句定格（时间暂停感）：
　风停了。她的头发还在动。我盯着那一秒，没敢眨眼。
- 拌嘴式反差萌（有川浩式）：
　"你干嘛看我。"
　"没看你，看你后面的猫。"
　"这里哪来的猫。"
</writing_style>`,
        }),
        freeze_8 = Object.freeze({
            style_baimiao: {
                name: '白开水',
                text: freeze_7.style_baimiao,
            },
            style_green_apple: {
                name: '青苹果',
                text: freeze_7.style_green_apple,
            },
        });
    let message_9 = null,
        value_10 = handleAction_39(),
        options = {
            name: 'home',
            params: {},
        },
        items = [],
        value_11 = null,
        result_12 = Promise.resolve(),
        avatarUrl_2 = '',
        value_14 = null,
        value_15 = null,
        value_16 = null,
        value_17 = null,
        value_18 = null;
    const value_19 = new Set();
    function handleAction_20(value_174, value_175 = '', value_176 = 500) {
        const slice_177 = String(value_174 == null ? '' : value_174)
            .trim()
            .slice(0, value_176);
        return slice_177 || value_175;
    }
    function handleAction_21(value_178, value_179 = '') {
        const trim_180 = String(value_178 == null ? '' : value_178).trim();
        return trim_180 || value_179;
    }
    function handleAction_22(value_181) {
        const trim_182 = String(value_181 || '').trim();
        if (!trim_182) return '';
        return /^(?:data:image\/(?:png|jpe?g|webp|gif);base64,|blob:|https?:\/\/)/i.test(trim_182)
            ? trim_182
            : '';
    }
    function handleAction_23(value_183) {
        return String(value_183 == null ? '' : value_183)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    function handleAction_24(value_184) {
        return JSON.parse(JSON.stringify(value_184));
    }
    function handleAction_25() {
        const value_185 = new Date();
        return (
            value_185.getFullYear() +
            '-' +
            String(value_185.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(value_185.getDate()).padStart(2, '0')
        );
    }
    function handleAction_26(value_186, value_187 = new Date().toISOString()) {
        return Number.isFinite(Date.parse(value_186))
            ? new Date(value_186).toISOString()
            : value_187;
    }
    function handleAction_27(value_188, value_189 = 40, value_190 = 160) {
        const items_191 = Array.isArray(value_188)
            ? value_188
            : String(value_188 || '').split(/[,，\n]/);
        return items_191
            .map((value_192) => handleAction_20(value_192, '', value_190))
            .filter(
                (value_193, value_194, value_195) =>
                    value_193 && value_195.indexOf(value_193) === value_194,
            )
            .slice(0, value_189);
    }
    function handleAction_28() {
        const contact =
            typeof window.getUserState === 'function'
                ? window.getUserState()
                : window.userState || {};
        return {
            pseud: handleAction_20(contact?.name, 'MoonlitArchivist', 40),
            avatarUrl: handleAction_22(contact?.avatarUrl || contact?.avatar),
            bio: handleAction_20(
                contact?.signature || contact?.persona,
                '收藏故事，也在等待写下自己的故事。',
                800,
            ),
            joinedAt: handleAction_25(),
        };
    }
    function handleAction_29(contact_196, value_197 = 0) {
        if (typeof contact_196 === 'string')
            return {
                name: handleAction_20(contact_196, '角色 ' + (value_197 + 1), 80),
                gender: '未设定',
                persona: '',
            };
        if (!contact_196 || typeof contact_196 !== 'object') return null;
        const name_2 = handleAction_20(contact_196.name, '', 80);
        return name_2
            ? {
                  name: name_2,
                  gender: handleAction_20(contact_196.gender, '未设定', 40),
                  persona: handleAction_21(contact_196.persona),
              }
            : null;
    }
    function handleAction_30(message_199, value_200 = 0) {
        if (!message_199 || typeof message_199 !== 'object') return null;
        const content_2 = handleAction_89(
            handleAction_20(
                message_199.content ||
                    (Array.isArray(message_199.paragraphs)
                        ? message_199.paragraphs.join(`

`)
                        : ''),
                '',
                200000,
            ),
        ).join(`

`);
        if (!content_2) return null;
        return {
            id: handleAction_20(message_199.id, 'chapter-' + (value_200 + 1), 100),
            title: handleAction_20(message_199.title, '第 ' + (value_200 + 1) + ' 章', 160),
            content: content_2,
            summary: handleAction_20(message_199.summary || message_199.chapterSummary, '', 4000),
            notes: handleAction_20(message_199.notes, '', 4000),
            relationships: handleAction_27(
                message_199.relationships || message_199.cpRelationships || [],
                30,
                160,
            ),
            targetWords: Math.min(
                count_6,
                Math.max(count_5, Math.trunc(Number(message_199.targetWords) || 800)),
            ),
            usedContinuation: message_199.usedContinuation === true,
            createdAt: handleAction_26(message_199.createdAt),
        };
    }
    function handleAction_31(value_202, value_203 = 0) {
        if (!value_202 || typeof value_202 !== 'object') return null;
        const id_2 = handleAction_20(value_202.id, 'ao3-work-' + (value_203 + 1), 120),
            chapters_2 = (Array.isArray(value_202.chapters) ? value_202.chapters : [])
                .map(handleAction_30)
                .filter(Boolean)
                .slice(0, 500);
        if (!id_2 || !chapters_2.length) return null;
        const characters_2 = (Array.isArray(value_202.characters) ? value_202.characters : [])
                .map(handleAction_29)
                .filter(Boolean)
                .slice(0, 50),
            value_207 =
                value_202.writingStyle && typeof value_202.writingStyle === 'object'
                    ? value_202.writingStyle
                    : {},
            value_208 =
                value_202.baseStats && typeof value_202.baseStats === 'object'
                    ? value_202.baseStats
                    : {};
        return {
            id: id_2,
            title: handleAction_20(value_202.title, '未命名作品', 160),
            authorPseud: handleAction_20(value_202.authorPseud, '', 40),
            fandom: handleAction_20(value_202.fandom, 'Original Work / 原创作品', 240),
            relationship: handleAction_20(value_202.relationship, '', 400),
            characters: characters_2,
            tags: handleAction_27(value_202.tags || [], 40, 160),
            rating: handleAction_20(value_202.rating, 'Not Rated', 100),
            warning: handleAction_20(
                value_202.warning,
                'Creator Chose Not To Use Archive Warnings',
                160,
            ),
            category: handleAction_20(value_202.category, 'Gen', 40),
            language: handleAction_20(value_202.language, '中文-普通话 國語', 80),
            series: handleAction_20(value_202.series, '', 160),
            published: /^\d{4}-\d{2}-\d{2}$/.test(String(value_202.published || ''))
                ? value_202.published
                : handleAction_25(),
            updatedAt: handleAction_26(value_202.updatedAt),
            summary: handleAction_20(value_202.summary, '暂无简介。', 2000),
            worldBookIds: handleAction_27(value_202.worldBookIds || [], 100, 120),
            writingStyle: {
                key: handleAction_20(value_207.key, 'style_baimiao', 100),
                name: handleAction_20(value_207.name, '白开水', 100),
                text: handleAction_20(value_207.text, freeze_8.style_baimiao.text, 50000),
            },
            baseStats: {
                kudos: Math.max(0, Math.trunc(Number(value_208.kudos) || 0)),
                bookmarks: Math.max(0, Math.trunc(Number(value_208.bookmarks) || 0)),
                hits: Math.max(0, Math.trunc(Number(value_208.hits) || 0)),
            },
            chapters: chapters_2,
        };
    }
    function handleAction_32(value_209, value_210 = 0) {
        if (!value_209 || typeof value_209 !== 'object') return null;
        const text_4 = handleAction_20(value_209.text || value_209.comment, '', count_4);
        if (!text_4) return null;
        return {
            id: handleAction_20(value_209.id, 'reply-' + (value_210 + 1), 100),
            pseud: handleAction_20(value_209.pseud || value_209.name, 'Anonymous', 40),
            text: text_4,
            translationZh: handleAction_20(value_209.translationZh, '', count_4),
            createdAt: handleAction_26(value_209.createdAt),
            generated: value_209.generated === true,
        };
    }
    function handleAction_33(value_212, value_213 = 0) {
        if (!value_212 || typeof value_212 !== 'object') return null;
        const text_5 = handleAction_20(value_212.text, '', count_4);
        return text_5
            ? {
                  id: handleAction_20(value_212.id, 'comment-' + (value_213 + 1), 100),
                  pseud: handleAction_20(value_212.pseud, 'Anonymous', 40),
                  text: text_5,
                  translationZh: handleAction_20(value_212.translationZh, '', count_4),
                  createdAt: handleAction_26(value_212.createdAt),
                  chapterId: handleAction_20(value_212.chapterId, '', 100),
                  generated: value_212.generated === true,
              }
            : null;
    }
    function handleAction_34(value_215, value_216 = 0) {
        if (!value_215 || typeof value_215 !== 'object') return null;
        const character_2 = handleAction_29(
                value_215.character ||
                    (Array.isArray(value_215.characters) ? value_215.characters[0] : null),
                value_216,
            ),
            name_3 = handleAction_20(value_215.name, character_2?.name || '', 60),
            userPersona_2 = handleAction_21(value_215.userPersona || value_215.user?.persona);
        return name_3 && character_2
            ? {
                  id: handleAction_20(value_215.id, 'character-preset-' + (value_216 + 1), 100),
                  name: name_3,
                  character: character_2,
                  userPersona: userPersona_2,
              }
            : null;
    }
    function handleAction_35(value_220) {
        const items_221 = [];
        return (
            (Array.isArray(value_220) ? value_220 : []).forEach((value_222, value_223) => {
                const items_224 = Array.isArray(value_222?.characters)
                    ? value_222.characters
                    : [value_222?.character];
                items_224
                    .map(handleAction_29)
                    .filter(Boolean)
                    .forEach((character_3, value_226) => {
                        const handleAction_34_227 = handleAction_34(
                            {
                                id:
                                    value_226 === 0
                                        ? value_222?.id
                                        : handleAction_20(
                                              value_222?.id,
                                              'character-preset-' + (value_223 + 1),
                                              80,
                                          ) +
                                          '-' +
                                          (value_226 + 1),
                                name: character_3.name || value_222?.name,
                                character: character_3,
                                userPersona: value_222?.userPersona || value_222?.user?.persona,
                            },
                            items_221.length,
                        );
                        if (
                            handleAction_34_227 &&
                            !items_221.some(
                                (value_228) =>
                                    value_228.id === handleAction_34_227.id ||
                                    value_228.name === handleAction_34_227.name,
                            )
                        )
                            items_221.push(handleAction_34_227);
                    });
            }),
            items_221.slice(0, 100)
        );
    }
    function handleAction_36(value_229, value_230 = 0) {
        if (!value_229 || typeof value_229 !== 'object') return null;
        const relationship_2 = handleAction_20(
            value_229.relationship || value_229.value || value_229.name,
            '',
            160,
        );
        if (!relationship_2) return null;
        return {
            id: handleAction_20(value_229.id, 'cp-preset-' + (value_230 + 1), 100),
            name: handleAction_20(value_229.name, relationship_2, 160),
            relationship: relationship_2,
        };
    }
    function handleAction_37(value_232) {
        const items_233 = [];
        return (
            (Array.isArray(value_232) ? value_232 : []).forEach((value_234, value_235) => {
                const handleAction_36_236 = handleAction_36(value_234, value_235);
                if (
                    handleAction_36_236 &&
                    !items_233.some(
                        (value_237) =>
                            value_237.id === handleAction_36_236.id ||
                            value_237.relationship === handleAction_36_236.relationship,
                    )
                )
                    items_233.push(handleAction_36_236);
            }),
            items_233.slice(0, 100)
        );
    }
    function handleAction_38(value_238, value_239 = 0) {
        if (!value_238 || typeof value_238 !== 'object') return null;
        const name_4 = handleAction_20(value_238.name, '', 60),
            text_6 = handleAction_20(value_238.text, '', 2000);
        return name_4 && text_6
            ? {
                  id: handleAction_20(value_238.id, 'style-preset-' + (value_239 + 1), 100),
                  name: name_4,
                  text: text_6,
              }
            : null;
    }
    function handleAction_39() {
        return {
            schemaVersion: schemaVersion_2,
            profileInitialized: true,
            profile: handleAction_28(),
            works: [],
            characterPresets: [],
            cpPresets: [],
            stylePresets: [],
            kudosByWork: {},
            commentsByWork: {},
            repliesByComment: {},
            deletedCommentIdsByWork: {},
            history: [],
            lastChapterByWork: {},
        };
    }
    function handleAction_40(value_242) {
        const value_243 = value_242 && typeof value_242 === 'object' ? value_242 : {},
            handleAction_28_244 = handleAction_28(),
            value_245 =
                value_243.profile && typeof value_243.profile === 'object' ? value_243.profile : {},
            works_2 = (Array.isArray(value_243.works) ? value_243.works : [])
                .filter(
                    (value_254) =>
                        String(value_254?.id || '') !== text_3 && value_254?.isSeed !== true,
                )
                .map(handleAction_31)
                .filter(Boolean)
                .slice(0, 300),
            value_247 = new Set(works_2.map((value_255) => value_255.id)),
            commentsByWork_2 = {},
            repliesByComment_2 = {},
            deletedCommentIdsByWork_2 = {},
            kudosByWork_2 = {},
            lastChapterByWork_2 = {};
        works_2.forEach((value_256) => {
            const items_257 = Array.isArray(value_243.commentsByWork?.[value_256.id])
                    ? value_243.commentsByWork[value_256.id]
                    : [],
                value_258 = new Set(value_256.chapters.map((value_261) => value_261.id));
            commentsByWork_2[value_256.id] = items_257
                .map(handleAction_33)
                .filter(Boolean)
                .map((value_262) => ({
                    ...value_262,
                    chapterId: value_258.has(value_262.chapterId)
                        ? value_262.chapterId
                        : value_256.chapters[0].id,
                }))
                .slice(-200);
            const items_259 = new Set(
                    commentsByWork_2[value_256.id].map((value_263) => value_263.id),
                ),
                value_260 =
                    value_243.repliesByComment?.[value_256.id] &&
                    typeof value_243.repliesByComment[value_256.id] === 'object'
                        ? value_243.repliesByComment[value_256.id]
                        : {};
            repliesByComment_2[value_256.id] = {};
            items_259.forEach((value_264) => {
                const result_265 = items_257.find(
                        (value_268) => String(value_268?.id || '') === String(value_264),
                    ),
                    items_266 = Array.isArray(value_260[value_264])
                        ? value_260[value_264]
                        : Array.isArray(result_265?.replies)
                          ? result_265.replies
                          : [],
                    slice_267 = items_266.map(handleAction_32).filter(Boolean).slice(-100);
                if (slice_267.length) repliesByComment_2[value_256.id][value_264] = slice_267;
            });
            deletedCommentIdsByWork_2[value_256.id] = handleAction_27(
                value_243.deletedCommentIdsByWork?.[value_256.id] || [],
                300,
                100,
            ).filter((value_269) => items_259.has(value_269));
            kudosByWork_2[value_256.id] = value_243.kudosByWork?.[value_256.id] === true;
            lastChapterByWork_2[value_256.id] = Math.min(
                value_256.chapters.length,
                Math.max(1, Math.trunc(Number(value_243.lastChapterByWork?.[value_256.id]) || 1)),
            );
        });
        const history_2 = (Array.isArray(value_243.history) ? value_243.history : [])
            .filter((value_270) => value_247.has(String(value_270?.workId || '')))
            .slice(-100)
            .map((value_271) => {
                const result_272 = works_2.find(
                    (value_273) => value_273.id === String(value_271.workId),
                );
                return {
                    workId: result_272.id,
                    chapter: Math.min(
                        result_272.chapters.length,
                        Math.max(1, Math.trunc(Number(value_271.chapter) || 1)),
                    ),
                    visitedAt: handleAction_26(value_271.visitedAt),
                };
            });
        return {
            schemaVersion: schemaVersion_2,
            profileInitialized: value_243.profileInitialized !== false,
            profile: {
                pseud: handleAction_20(value_245.pseud, handleAction_28_244.pseud, 40),
                avatarUrl: handleAction_22(value_245.avatarUrl || handleAction_28_244.avatarUrl),
                bio: handleAction_20(value_245.bio, handleAction_28_244.bio, 800),
                joinedAt: /^\d{4}-\d{2}-\d{2}$/.test(String(value_245.joinedAt || ''))
                    ? value_245.joinedAt
                    : handleAction_28_244.joinedAt,
            },
            works: works_2,
            characterPresets: handleAction_35(value_243.characterPresets),
            cpPresets: handleAction_37(value_243.cpPresets || value_243.relationshipPresets),
            stylePresets: (Array.isArray(value_243.stylePresets) ? value_243.stylePresets : [])
                .map(handleAction_38)
                .filter(Boolean)
                .slice(0, 100),
            kudosByWork: kudosByWork_2,
            commentsByWork: commentsByWork_2,
            repliesByComment: repliesByComment_2,
            deletedCommentIdsByWork: deletedCommentIdsByWork_2,
            history: history_2,
            lastChapterByWork: lastChapterByWork_2,
        };
    }
    function handleAction_41(value_274, value_275) {
        return (
            value_274?.works?.find((value_276) => value_276.id === String(value_275 || '')) || null
        );
    }
    function handleAction_42(value_277 = options.params.workId || '') {
        return handleAction_41(value_10, value_277) || null;
    }
    function handleAction_43(value_278, value_279 = null) {
        const value_280 = typeof value_279 === 'string' ? handleAction_42(value_279) : value_279;
        return Math.min(
            Math.max(1, value_280?.chapters?.length || 1),
            Math.max(1, Math.trunc(Number(value_278) || 1)),
        );
    }
    function handleAction_44(value_281, value_282) {
        const state_2 = handleAction_40(value_281),
            string = String(value_282 || '');
        if (!handleAction_41(state_2, string) || state_2.kudosByWork[string])
            return {
                state: state_2,
                added: false,
            };
        return (
            (state_2.kudosByWork[string] = true),
            {
                state: state_2,
                added: true,
            }
        );
    }
    function handleAction_45(value_284, value_285, value_286, value_287) {
        const state_3 = handleAction_40(value_284),
            string_289 = String(value_285 || ''),
            handleAction_41_290 = handleAction_41(state_3, string_289);
        if (!handleAction_41_290)
            return {
                state: state_3,
                added: false,
            };
        const chapterId_2 = String(value_286 || '');
        if (!handleAction_41_290.chapters.some((value_293) => value_293.id === chapterId_2))
            return {
                state: state_3,
                added: false,
            };
        const handleAction_33_292 = handleAction_33(
            {
                ...value_287,
                chapterId: chapterId_2,
            },
            state_3.commentsByWork[string_289]?.length || 0,
        );
        if (!handleAction_33_292)
            return {
                state: state_3,
                added: false,
            };
        return (
            (state_3.commentsByWork[string_289] = [
                ...(state_3.commentsByWork[string_289] || []),
                handleAction_33_292,
            ].slice(-200)),
            {
                state: state_3,
                added: true,
            }
        );
    }
    function handleAction_46(value_294, value_295, value_296, value_297) {
        const state_4 = handleAction_40(value_294),
            string_299 = String(value_295 || ''),
            string_300 = String(value_296 || '');
        if (!handleAction_71(string_299, state_4).some((value_302) => value_302.id === string_300))
            return {
                state: state_4,
                added: false,
            };
        const handleAction_32_301 = handleAction_32(
            value_297,
            handleAction_73(string_299, string_300, state_4).length,
        );
        if (!handleAction_32_301)
            return {
                state: state_4,
                added: false,
            };
        if (!state_4.repliesByComment[string_299]) state_4.repliesByComment[string_299] = {};
        return (
            (state_4.repliesByComment[string_299][string_300] = [
                ...handleAction_73(string_299, string_300, state_4),
                handleAction_32_301,
            ].slice(-100)),
            {
                state: state_4,
                added: true,
            }
        );
    }
    function handleAction_47(value_303, value_304, value_305) {
        const state_5 = handleAction_40(value_303),
            string_307 = String(value_304 || ''),
            string_308 = String(value_305 || '');
        if (!handleAction_71(string_307, state_5).some((value_310) => value_310.id === string_308))
            return {
                state: state_5,
                deleted: false,
            };
        const value_309 = state_5.commentsByWork[string_307]?.length || 0;
        state_5.commentsByWork[string_307] = (state_5.commentsByWork[string_307] || []).filter(
            (value_311) => value_311.id !== string_308,
        );
        if ((state_5.commentsByWork[string_307]?.length || 0) === value_309)
            state_5.deletedCommentIdsByWork[string_307] = handleAction_27(
                [...(state_5.deletedCommentIdsByWork[string_307] || []), string_308],
                300,
                100,
            );
        if (state_5.repliesByComment[string_307])
            delete state_5.repliesByComment[string_307][string_308];
        return {
            state: state_5,
            deleted: true,
        };
    }
    function handleAction_48(value_312, value_313, value_314, value_315) {
        const state_6 = handleAction_40(value_312),
            string_317 = String(value_313 || ''),
            string_318 = String(value_314 || ''),
            string_319 = String(value_315 || ''),
            handleAction_73_320 = handleAction_73(string_317, string_318, state_6),
            filter_321 = handleAction_73_320.filter((value_322) => value_322.id !== string_319);
        if (filter_321.length === handleAction_73_320.length)
            return {
                state: state_6,
                deleted: false,
            };
        if (!state_6.repliesByComment[string_317]) state_6.repliesByComment[string_317] = {};
        return (
            (state_6.repliesByComment[string_317][string_318] = filter_321),
            {
                state: state_6,
                deleted: true,
            }
        );
    }
    function handleAction_49(value_323, value_324, value_325) {
        const state_7 = handleAction_40(value_323),
            handleAction_41_327 = handleAction_41(state_7, value_324),
            string_328 = String(value_325 || '');
        if (!handleAction_41_327 || handleAction_41_327.chapters.length <= 1)
            return {
                state: state_7,
                deleted: false,
            };
        const index = handleAction_41_327.chapters.findIndex(
            (value_331) => value_331.id === string_328,
        );
        if (index < 0)
            return {
                state: state_7,
                deleted: false,
            };
        const items_329 = new Set(
            (state_7.commentsByWork[handleAction_41_327.id] || [])
                .filter((value_332) => value_332.chapterId === string_328)
                .map((value_333) => value_333.id),
        );
        handleAction_41_327.chapters.splice(index, 1);
        handleAction_41_327.updatedAt = new Date().toISOString();
        state_7.commentsByWork[handleAction_41_327.id] = (
            state_7.commentsByWork[handleAction_41_327.id] || []
        ).filter((value_334) => value_334.chapterId !== string_328);
        items_329.forEach((value_335) => {
            if (state_7.repliesByComment[handleAction_41_327.id])
                delete state_7.repliesByComment[handleAction_41_327.id][value_335];
        });
        const value_330 = index + 1;
        return (
            (state_7.lastChapterByWork[handleAction_41_327.id] = Math.min(
                handleAction_41_327.chapters.length,
                Math.max(1, value_330),
            )),
            (state_7.history = state_7.history.map((value_336) =>
                value_336.workId !== handleAction_41_327.id
                    ? value_336
                    : {
                          ...value_336,
                          chapter: Math.min(
                              handleAction_41_327.chapters.length,
                              value_336.chapter > value_330
                                  ? value_336.chapter - 1
                                  : value_336.chapter,
                          ),
                      },
            )),
            {
                state: state_7,
                deleted: true,
                chapter: state_7.lastChapterByWork[handleAction_41_327.id],
            }
        );
    }
    function handleAction_50(value_337, value_338) {
        const state_8 = handleAction_40(value_337),
            string_340 = String(value_338 || ''),
            length_341 = state_8.works.length;
        state_8.works = state_8.works.filter((value_342) => value_342.id !== string_340);
        if (state_8.works.length === length_341)
            return {
                state: state_8,
                deleted: false,
            };
        return (
            delete state_8.commentsByWork[string_340],
            delete state_8.repliesByComment[string_340],
            delete state_8.deletedCommentIdsByWork[string_340],
            delete state_8.kudosByWork[string_340],
            delete state_8.lastChapterByWork[string_340],
            (state_8.history = state_8.history.filter(
                (value_343) => value_343.workId !== string_340,
            )),
            {
                state: state_8,
                deleted: true,
            }
        );
    }
    function handleAction_51(value_344, value_345) {
        return [
            value_344.title,
            value_344.authorPseud || value_345?.pseud,
            value_344.fandom,
            value_344.relationship,
            ...value_344.characters.map(
                (contact_346) =>
                    contact_346.name + ' ' + contact_346.gender + ' ' + contact_346.persona,
            ),
            ...value_344.tags,
            value_344.summary,
        ]
            .join(' ')
            .toLocaleLowerCase('zh-CN');
    }
    function handleAction_52(value_347, value_348 = value_10.profile, value_349 = value_10) {
        const toLocaleLowerCase_350 = String(value_347 || '')
                .trim()
                .toLocaleLowerCase('zh-CN'),
            items_351 = Array.isArray(value_349?.works) ? value_349.works : [];
        return !toLocaleLowerCase_350
            ? items_351
            : items_351.filter((value_352) =>
                  handleAction_51(value_352, value_348).includes(toLocaleLowerCase_350),
              );
    }
    function handleAction_53(value_353) {
        return {
            name: value_353?.name || 'home',
            params: {
                ...(value_353?.params || {}),
            },
        };
    }
    function handleAction_54() {
        message_9 = {
            view: document.getElementById('ao3-view'),
            scroll: document.getElementById('ao3-site-scroll'),
            content: document.getElementById('ao3-page-content'),
            historyBack: document.getElementById('ao3-history-back'),
            profileName: document.getElementById('ao3-header-profile-name'),
            headerSearch: document.getElementById('ao3-header-search'),
            headerSearchInput: document.getElementById('ao3-header-search-input'),
            profileOverlay: document.getElementById('ao3-profile-edit-overlay'),
            profileForm: document.getElementById('ao3-profile-edit-form'),
            profilePseud: document.getElementById('ao3-profile-pseud-input'),
            profileBio: document.getElementById('ao3-profile-bio-input'),
            profileAvatarInput: document.getElementById('ao3-profile-avatar-input'),
            profileAvatarPreview: document.getElementById('ao3-profile-avatar-preview'),
            profileError: document.getElementById('ao3-profile-edit-error'),
            composerOverlay: document.getElementById('ao3-composer-overlay'),
            composerForm: document.getElementById('ao3-composer-form'),
            composerTitle: document.getElementById('ao3-composer-title'),
            composerSubtitle: document.getElementById('ao3-composer-subtitle'),
            composerError: document.getElementById('ao3-composer-error'),
            generating: document.getElementById('ao3-generating'),
            composerSubmit: document.getElementById('ao3-composer-submit'),
            toast: document.getElementById('ao3-toast'),
        };
    }
    function handleAction_55(value_354) {
        if (typeof window.mobileInputCompat?.isSendEnter === 'function')
            return window.mobileInputCompat.isSendEnter(value_354);
        return (
            value_354?.key === 'Enter' &&
            !value_354.isComposing &&
            value_354.keyCode !== 229 &&
            !value_354.shiftKey &&
            !value_354.ctrlKey &&
            !value_354.metaKey &&
            !value_354.altKey
        );
    }
    function handleAction_56(value_355) {
        const activeElement_356 = document.activeElement;
        if (
            activeElement_356 &&
            value_355?.contains(activeElement_356) &&
            typeof activeElement_356.blur === 'function'
        )
            activeElement_356.blur();
    }
    function handleAction_57(value_357, element = message_9?.view) {
        if (!value_357 || !element) return null;
        if (value_357.closest?.('#ao3-composer-overlay'))
            return element.querySelector('.ao3-composer-scroll');
        if (value_357.closest?.('#ao3-profile-edit-overlay'))
            return element.querySelector('.ao3-profile-edit-card');
        if (value_357.closest?.('.ao3-site-header')) return null;
        return element.querySelector('.ao3-site-scroll');
    }
    function handleAction_58(value_358, value_359 = handleAction_57(value_358)) {
        if (!value_358 || value_358.disabled) return;
        value_358.focus?.({
            preventScroll: true,
        });
        if (!value_359) return;
        requestAnimationFrame(() => {
            if (!value_358.isConnected || !value_359.isConnected) return;
            const boundingClientRect = value_359.getBoundingClientRect(),
                boundingClientRect_360 = value_358.getBoundingClientRect(),
                count_361 = 16;
            if (boundingClientRect_360.top < boundingClientRect.top + count_361)
                value_359.scrollTop +=
                    boundingClientRect_360.top - boundingClientRect.top - count_361;
            else {
                if (boundingClientRect_360.bottom > boundingClientRect.bottom - count_361)
                    value_359.scrollTop +=
                        boundingClientRect_360.bottom - boundingClientRect.bottom + count_361;
            }
        });
    }
    function handleAction_59(event) {
        if (event.target !== message_9?.profilePseud || !handleAction_55(event)) return;
        event.preventDefault();
        handleAction_58(message_9.profileBio, message_9.profileForm);
    }
    function handleAction_60(event_362) {
        const target_363 = event_362.target;
        if (
            !handleAction_55(event_362) ||
            !target_363?.matches?.(
                'input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="hidden"])',
            )
        )
            return;
        event_362.preventDefault();
        const filter_364 = [
                ...message_9.composerForm.querySelectorAll(
                    'input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="hidden"]), textarea, select',
                ),
            ].filter((value_366) => !value_366.disabled && !value_366.closest('[hidden]')),
            value_365 = filter_364[filter_364.indexOf(target_363) + 1];
        if (value_365) handleAction_58(value_365, handleAction_57(value_365));
    }
    function handleAction_61() {
        if (value_18 || typeof window.mobileInputCompat?.registerFocusScope !== 'function') return;
        value_18 = window.mobileInputCompat.registerFocusScope({
            selector: '#ao3-view.active',
            priority: 30,
            preferFocusScope: true,
            resolveScrollContainer: (value_367, value_368) => handleAction_57(value_367, value_368),
            scrollBehavior: 'focus',
            viewportClassName: 'u2-android-ao3-viewport-sized',
            viewportHeightCssVariable: '--u2-android-ao3-viewport-height',
            viewportTopCssVariable: '--u2-android-ao3-viewport-top',
        });
    }
    function handleAction_62(reason_2 = 'ao3-update') {
        if (!window.appStorage?.commitDomain) return Promise.resolve(false);
        const handleAction_40_370 = handleAction_40(value_10);
        return (
            (result_12 = result_12['catch'](() => undefined)
                .then(() =>
                    window.appStorage.commitDomain(text_2, handleAction_40_370, {
                        critical: true,
                        reason: reason_2,
                    }),
                )
                ['catch']((value_371) => {
                    return (
                        console.warn('[AO3] Failed to persist state.', value_371),
                        handleAction_100('Save failed / 保存失败'),
                        false
                    );
                })),
            result_12
        );
    }
    async function handleAction_63() {
        if (!window.appStorage) return;
        try {
            await window.appStorage.ready;
            const domain = window.appStorage.readDomain(text_2, null);
            value_10 =
                domain && typeof domain === 'object' ? handleAction_40(domain) : handleAction_39();
            if (!domain) await handleAction_62('ao3-initialize');
            else {
                if (Number(domain.schemaVersion) !== schemaVersion_2)
                    await handleAction_62('ao3-migrate-v5');
            }
            handleAction_64();
            if (message_9?.view?.classList.contains('active'))
                handleAction_94({
                    resetScroll: false,
                });
        } catch (value_372) {
            console.warn('[AO3] Failed to hydrate state.', value_372);
        }
    }
    function handleAction_64() {
        if (message_9?.profileName) message_9.profileName.textContent = value_10.profile.pseud;
    }
    function handleAction_65(value_373, value_374, value_375 = 'span') {
        return (
            '<' +
            value_375 +
            ' class="ao3-bilingual"><span>' +
            handleAction_23(value_373) +
            '</span><small>' +
            handleAction_23(value_374) +
            '</small></' +
            value_375 +
            '>'
        );
    }
    function handleAction_66(value_376, value_377) {
        return (
            handleAction_23(value_376) +
            '<small class="ao3-inline-translation">' +
            handleAction_23(value_377) +
            '</small>'
        );
    }
    function handleAction_67(value_378) {
        return (
            {
                'General Audiences': '全年龄',
                'Teen And Up Audiences': '青少年及以上',
                Mature: '成人',
                Explicit: '限制级',
                'Not Rated': '未分级',
            }[value_378] || value_378
        );
    }
    function handleAction_68(value_379) {
        return (
            {
                'Creator Chose Not To Use Archive Warnings': '作者选择不使用作品警告',
                'No Archive Warnings Apply': '无作品警告适用',
                'Graphic Depictions Of Violence': '露骨暴力描写',
                'Major Character Death': '主要角色死亡',
                'Rape/Non-Con': '强暴或非自愿性行为',
                Underage: '未成年性行为',
            }[value_379] || value_379
        );
    }
    function handleAction_69(value_380) {
        return (
            {
                Gen: '无配对或非恋爱关系',
                'F/F': '女性与女性',
                'F/M': '女性与男性',
                'M/M': '男性与男性',
                Multi: '多种配对',
                Other: '其他',
            }[value_380] || value_380
        );
    }
    function handleAction_70(value_381) {
        return value_381.authorPseud || value_10.profile.pseud;
    }
    function handleAction_71(value_382, value_383 = value_10) {
        const value_384 = new Set(value_383.deletedCommentIdsByWork?.[value_382] || []);
        return (value_383.commentsByWork?.[value_382] || []).filter(
            (value_385) => !value_384.has(value_385.id),
        );
    }
    function handleAction_72(value_386, value_387, value_388 = value_10) {
        return handleAction_71(value_386, value_388).filter(
            (value_389) => value_389.chapterId === String(value_387 || ''),
        );
    }
    function handleAction_73(value_390, value_391, value_392 = value_10) {
        return value_392.repliesByComment?.[value_390]?.[value_391] || [];
    }
    function handleAction_74(value_393) {
        const string_394 = String(value_393 || '');
        return (
            (string_394.match(/[\u3400-\u9fff]/g) || []).length +
            (
                string_394
                    .replace(/[\u3400-\u9fff]/g, ' ')
                    .match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []
            ).length
        );
    }
    function handleAction_75(value_395) {
        return {
            words: value_395.chapters.reduce(
                (value_396, message_397) => value_396 + handleAction_74(message_397.content),
                0,
            ),
            chapters: value_395.chapters.length,
            comments: handleAction_71(value_395.id).length,
            kudos: (value_395.baseStats?.kudos || 0) + (value_10.kudosByWork[value_395.id] ? 1 : 0),
            bookmarks: value_395.baseStats?.bookmarks || 0,
            hits: value_395.baseStats?.hits || 0,
        };
    }
    function handleAction_76(value_398) {
        const handleAction_75_399 = handleAction_75(value_398);
        return (
            '<dl class="ao3-work-stats"><div><dt>Words <small class="ao3-inline-translation">字数</small></dt><dd>' +
            handleAction_75_399.words.toLocaleString() +
            '</dd></div><div><dt>Chapters <small class="ao3-inline-translation">章节</small></dt><dd>' +
            handleAction_75_399.chapters +
            '/' +
            handleAction_75_399.chapters +
            '</dd></div><div><dt>Comments <small class="ao3-inline-translation">评论</small></dt><dd>' +
            handleAction_75_399.comments +
            '</dd></div><div><dt>Kudos <small class="ao3-inline-translation">推荐</small></dt><dd>' +
            handleAction_75_399.kudos +
            '</dd></div><div><dt>Bookmarks <small class="ao3-inline-translation">书签</small></dt><dd>' +
            handleAction_75_399.bookmarks +
            '</dd></div><div><dt>Hits <small class="ao3-inline-translation">阅读</small></dt><dd>' +
            handleAction_75_399.hits.toLocaleString() +
            '</dd></div></dl>'
        );
    }
    function handleAction_77(value_400) {
        const map_401 = value_400.characters.map((value_402) => value_402.name);
        return (
            '<article class="ao3-work-card"><div class="ao3-rating-symbols" aria-hidden="true"><span>' +
            handleAction_23(value_400.rating.charAt(0) || '?') +
            '</span><span>!</span><span>' +
            handleAction_23(value_400.category) +
            '</span><span>AO3</span></div><header class="ao3-work-card-header"><h2><button type="button" class="ao3-text-link" data-ao3-open-work="' +
            handleAction_23(value_400.id) +
            '">' +
            handleAction_23(value_400.title) +
            '</button></h2><p class="ao3-work-byline">by <button type="button" class="ao3-text-link" data-ao3-route="profile">' +
            handleAction_23(handleAction_70(value_400)) +
            '</button> <small class="ao3-inline-translation">作者</small></p></header><div class="ao3-work-tags"><button type="button" class="ao3-tag-link" data-ao3-search="' +
            handleAction_23(value_400.rating) +
            '">' +
            handleAction_23(value_400.rating) +
            ' · ' +
            handleAction_23(handleAction_67(value_400.rating)) +
            '</button><button type="button" class="ao3-tag-link" data-ao3-search="' +
            handleAction_23(value_400.fandom) +
            '">' +
            handleAction_23(value_400.fandom) +
            '</button>' +
            (value_400.relationship
                ? '<button type="button" class="ao3-tag-link" data-ao3-search="' +
                  handleAction_23(value_400.relationship) +
                  '">' +
                  handleAction_23(value_400.relationship) +
                  '</button>'
                : '') +
            map_401
                .map(
                    (value_403) =>
                        '<button type="button" class="ao3-tag-link" data-ao3-search="' +
                        handleAction_23(value_403) +
                        '">' +
                        handleAction_23(value_403) +
                        '</button>',
                )
                .join('') +
            value_400.tags
                .map(
                    (value_404) =>
                        '<button type="button" class="ao3-tag-link" data-ao3-search="' +
                        handleAction_23(value_404) +
                        '">' +
                        handleAction_23(value_404) +
                        '</button>',
                )
                .join('') +
            '</div><p class="ao3-work-summary">' +
            handleAction_23(value_400.summary) +
            '</p>' +
            handleAction_76(value_400) +
            '</article>'
        );
    }
    function handleAction_78() {
        const value_405 = value_10.works[value_10.works.length - 1] || value_10.works[0],
            value_406 = value_405
                ? handleAction_77(value_405)
                : '<div class="ao3-empty-state"><strong>No works yet.</strong><br><small>还没有作品，前往用户主页新建第一篇作品。</small></div>';
        return (
            '<section class="ao3-page ao3-home-page" aria-labelledby="ao3-home-title"><h1 class="ao3-home-intro" id="ao3-home-title">A non-profit, non-commercial archive for transformative fanworks; created by and for fans of books, music, art, games, shows, movies, real-person fiction (RPF), and other fandoms.<small>一个非营利、非商业性的衍生作品档案馆，由书籍、音乐、艺术、游戏、剧集、电影、真人同人及其他作品圈的爱好者共同创建。</small></h1><p class="ao3-site-stats">more than <strong>82,390</strong> fandoms | <strong>11,510,000</strong> users | <strong>' +
            (18320000 + value_10.works.length).toLocaleString() +
            '</strong> works<br><small>超过 82,390 个作品圈｜11,510,000 位用户｜' +
            (18320000 + value_10.works.length).toLocaleString() +
            ' 篇作品</small></p><p class="ao3-site-project">The Archive of Our Own (AO3) is a fan-made archive for this U2phone prototype.<br><small>Archive of Our Own（AO3）在本原型中作为本地同人作品档案馆。</small></p><section class="ao3-account-card"><h2>With an AO3 account, you can:<small class="ao3-inline-translation">拥有 AO3 账号后，你可以：</small></h2><ul><li>Share your own fanworks <small class="ao3-inline-translation">分享自己的同人作品</small></li><li>Create new chapters with AI <small class="ao3-inline-translation">使用 AI 创作新章节</small></li><li>Leave kudos and join conversations <small class="ao3-inline-translation">留下推荐并参与评论</small></li></ul><div class="ao3-card-action"><button type="button" class="ao3-bevel-button" data-ao3-route="profile">' +
            handleAction_65('View My Dashboard', '查看我的主页') +
            '</button></div></section><h2 class="ao3-section-title">Find your favorites<small>寻找你喜欢的作品</small></h2><div class="ao3-fandom-grid"><button type="button" class="ao3-fandom-link" data-ao3-route="fandoms"><span>All Fandoms</span><small>所有作品圈</small></button><button type="button" class="ao3-fandom-link" data-ao3-search="Anime Manga"><span>Anime &amp; Manga</span><small>动漫</small></button><button type="button" class="ao3-fandom-link" data-ao3-search="Books Literature"><span>Books &amp; Literature</span><small>书籍与文学</small></button><button type="button" class="ao3-fandom-link" data-ao3-search="Movies"><span>Movies</span><small>电影</small></button></div><h2 class="ao3-section-title">Featured Work<small>推荐作品</small></h2>' +
            value_406 +
            '</section>'
        );
    }
    function handleAction_79() {
        const value_407 = new Map();
        return (
            value_10.works.forEach((value_408) =>
                value_407.set(value_408.fandom, (value_407.get(value_408.fandom) || 0) + 1),
            ),
            '<section class="ao3-page" aria-labelledby="ao3-fandoms-title"><header class="ao3-page-heading"><h1 id="ao3-fandoms-title">Fandoms<small>作品圈</small></h1><small>' +
                value_10.works.length +
                ' works in this local archive<br>本地档案馆共 ' +
                value_10.works.length +
                ' 篇作品</small></header><div class="ao3-fandom-grid">' +
                [...value_407]
                    .map(
                        ([value_409, value_410]) =>
                            '<button type="button" class="ao3-fandom-link" data-ao3-search="' +
                            handleAction_23(value_409) +
                            '"><span>' +
                            handleAction_23(value_409) +
                            '</span><small>' +
                            value_410 +
                            ' work' +
                            (value_410 === 1 ? '' : 's') +
                            ' / ' +
                            value_410 +
                            ' 篇</small></button>',
                    )
                    .join('') +
                '<button type="button" class="ao3-fandom-link" data-ao3-route="browse"><span>All Works</span><small>全部作品</small></button></div>' +
                value_10.works.map(handleAction_77).join('') +
                '</section>'
        );
    }
    function handleAction_80() {
        return (
            '<section class="ao3-page" aria-labelledby="ao3-browse-title"><header class="ao3-page-heading"><h1 id="ao3-browse-title">Browse Works<small>浏览作品</small></h1><small>Newest local works first<br>本地新作优先</small></header><p class="ao3-result-summary">' +
            value_10.works.length +
            ' Works Found <small class="ao3-inline-translation">找到 ' +
            value_10.works.length +
            ' 篇作品</small></p>' +
            [...value_10.works].reverse().map(handleAction_77).join('') +
            '</section>'
        );
    }
    function handleAction_81(value_411 = '') {
        const handleAction_52_412 = handleAction_52(value_411);
        return (
            '<section class="ao3-page" aria-labelledby="ao3-search-title"><header class="ao3-page-heading"><h1 id="ao3-search-title">Search Works<small>搜索作品</small></h1><small>Title, author, fandom, relationship, characters, or tags<br>可搜索标题、作者、作品圈、关系、角色或标签</small></header><form class="ao3-search-panel" id="ao3-page-search-form"><input type="search" id="ao3-page-search-input" value="' +
            handleAction_23(value_411) +
            '" maxlength="120" enterkeyhint="search" aria-label="Search works / 搜索作品" placeholder="Search works / 搜索作品"><button type="submit" class="ao3-bevel-button">' +
            handleAction_65('Search', '搜索') +
            '</button></form><p class="ao3-result-summary">' +
            handleAction_52_412.length +
            ' Result' +
            (handleAction_52_412.length === 1 ? '' : 's') +
            ' <small class="ao3-inline-translation">' +
            handleAction_52_412.length +
            ' 条结果</small></p>' +
            (handleAction_52_412.length
                ? handleAction_52_412.map(handleAction_77).join('')
                : '<div class="ao3-empty-state"><strong>No works found.</strong><br><small>没有找到匹配的作品。</small></div>') +
            '</section>'
        );
    }
    function handleAction_82(value_413, value_414, value_415, value_416 = {}) {
        return (
            '<div class="ao3-meta-row' +
            (value_416.warning ? ' is-warning' : '') +
            '"><dt>' +
            handleAction_66(value_413, value_414) +
            ':</dt><dd>' +
            value_415 +
            '</dd></div>'
        );
    }
    function handleAction_83(value_417) {
        const value_418 = new Date(value_417);
        if (!Number.isFinite(value_418.getTime())) return '';
        try {
            return new Intl.DateTimeFormat('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            }).format(value_418);
        } catch (value_419) {
            return value_418.toISOString().slice(0, 16).replace('T', ' ');
        }
    }
    function handleAction_84(value_420) {
        if (!value_420.translationZh) return '';
        return (
            '<button type="button" class="ao3-comment-link" data-ao3-toggle-translation aria-expanded="false">Translate<small>翻译</small></button><p class="ao3-comment-translation" data-ao3-translation hidden>' +
            handleAction_23(value_420.translationZh) +
            '</p>'
        );
    }
    function handleAction_85(value_421, value_422, value_423) {
        return (
            '<article class="ao3-comment-reply" data-reply-id="' +
            handleAction_23(value_423.id) +
            '"><header><strong>' +
            handleAction_23(value_423.pseud) +
            '</strong><time datetime="' +
            handleAction_23(value_423.createdAt) +
            '">' +
            handleAction_23(handleAction_83(value_423.createdAt)) +
            '</time></header><p class="ao3-comment-text">' +
            handleAction_23(value_423.text) +
            '</p><div class="ao3-comment-tools">' +
            handleAction_84(value_423) +
            '<button type="button" class="ao3-comment-link is-delete" data-ao3-delete-reply="' +
            handleAction_23(value_423.id) +
            '" data-comment-id="' +
            handleAction_23(value_422) +
            '" data-work-id="' +
            handleAction_23(value_421) +
            '">Delete<small>删除</small></button></div></article>'
        );
    }
    function handleAction_86(value_424, value_425) {
        const handleAction_73_426 = handleAction_73(value_424.id, value_425.id);
        return (
            '<article class="ao3-comment" data-comment-id="' +
            handleAction_23(value_425.id) +
            '"><header><strong>' +
            handleAction_23(value_425.pseud) +
            '</strong><time datetime="' +
            handleAction_23(value_425.createdAt) +
            '">' +
            handleAction_23(handleAction_83(value_425.createdAt)) +
            '</time></header><p class="ao3-comment-text">' +
            handleAction_23(value_425.text) +
            '</p><div class="ao3-comment-tools">' +
            handleAction_84(value_425) +
            '<button type="button" class="ao3-comment-link" data-ao3-toggle-reply>Reply<small>回复</small></button><button type="button" class="ao3-comment-link is-delete" data-ao3-delete-comment="' +
            handleAction_23(value_425.id) +
            '" data-work-id="' +
            handleAction_23(value_424.id) +
            '">Delete<small>删除</small></button></div>' +
            (handleAction_73_426.length
                ? '<div class="ao3-comment-replies">' +
                  handleAction_73_426
                      .map((value_427) => handleAction_85(value_424.id, value_425.id, value_427))
                      .join('') +
                  '</div>'
                : '') +
            '<form class="ao3-reply-form" data-ao3-reply-form data-comment-id="' +
            handleAction_23(value_425.id) +
            '" hidden><label>Reply as ' +
            handleAction_23(value_10.profile.pseud) +
            '<small>以此用户名回复</small><textarea name="reply-text" maxlength="' +
            count_4 +
            '" enterkeyhint="enter" required aria-label="Reply / 回复"></textarea></label><div class="ao3-form-error" data-ao3-reply-error role="alert"></div><div class="ao3-reply-form-actions"><button type="button" class="ao3-bevel-button" data-ao3-cancel-reply>' +
            handleAction_65('Cancel', '取消') +
            '</button><button type="submit" class="ao3-bevel-button">' +
            handleAction_65('Reply', '发表回复') +
            '</button></div></form></article>'
        );
    }
    function handleAction_87(value_428, value_429) {
        const handleAction_72_430 = handleAction_72(value_428.id, value_429.id),
            value_431 = value_428.id + ':' + value_429.id,
            has_432 = value_19.has(value_431);
        return (
            '<section class="ao3-comments-section" id="ao3-comments-section" aria-labelledby="ao3-comments-title"><h2 class="ao3-comments-heading" id="ao3-comments-title"><button type="button" data-ao3-toggle-comment-section aria-expanded="' +
            String(!has_432) +
            '"><span>Comments (' +
            handleAction_72_430.length +
            ')<small class="ao3-inline-translation">评论（' +
            handleAction_72_430.length +
            '）</small></span><i class="fas fa-chevron-' +
            (has_432 ? 'down' : 'up') +
            '" aria-hidden="true"></i></button></h2><div class="ao3-comments-content"' +
            (has_432 ? ' hidden' : '') +
            '><div class="ao3-comment-list">' +
            handleAction_72_430.map((value_433) => handleAction_86(value_428, value_433)).join('') +
            '</div><form class="ao3-comment-form" id="ao3-comment-form"><p>All fields are required. Your comment is stored only on this device.<br><small>所有字段均为必填项，你的评论只会保存在当前设备。</small></p><div class="ao3-comment-identity">Comment as <strong>' +
            handleAction_23(value_10.profile.pseud) +
            '</strong> <small class="ao3-inline-translation">以此用户名评论</small></div><label for="ao3-comment-input">Comment<small>评论内容</small></label><textarea id="ao3-comment-input" maxlength="' +
            count_4 +
            '" enterkeyhint="enter" required aria-describedby="ao3-comment-counter ao3-comment-error"></textarea><div class="ao3-form-error" id="ao3-comment-error" role="alert"></div><div class="ao3-comment-form-footer"><span class="ao3-comment-count" id="ao3-comment-counter">' +
            count_4 +
            ' characters left / 剩余 ' +
            count_4 +
            ' 字符</span><button type="submit" class="ao3-bevel-button">' +
            handleAction_65('Comment', '发表评论') +
            '</button></div></form></div></section>'
        );
    }
    function handleAction_88(value_434) {
        const trim_435 = String(value_434 || '').trim();
        if (trim_435.length <= 180) return trim_435 ? [trim_435] : [];
        const items_436 = trim_435.match(/[^。！？!?…]+(?:[。！？!?]+|…{1,2}|$)/g) || [trim_435],
            items_437 = [];
        let text_438 = '';
        items_436.forEach((value_439) => {
            const trim_440 = ('' + text_438 + value_439).trim();
            if (text_438 && trim_440.length > 150 && text_438.length >= 70) {
                items_437.push(text_438.trim());
                text_438 = value_439;
            } else text_438 = trim_440;
        });
        if (text_438.trim()) items_437.push(text_438.trim());
        return items_437;
    }
    function handleAction_89(value_441) {
        const filter_442 = String(value_441 || '')
            .replace(
                /\r\n?/g,
                `
`,
            )
            .split(/\n+/)
            .map((value_443) => value_443.trim())
            .filter(Boolean);
        return filter_442.flatMap(handleAction_88);
    }
    function handleAction_90(value_444, value_445) {
        const handleAction_42_446 = handleAction_42(value_444);
        if (!handleAction_42_446)
            return '<section class="ao3-page"><div class="ao3-empty-state">Work not found. / 作品不存在。</div></section>';
        const handleAction_43_447 = handleAction_43(
                value_445 || value_10.lastChapterByWork[handleAction_42_446.id],
                handleAction_42_446,
            ),
            value_448 = handleAction_42_446.chapters[handleAction_43_447 - 1],
            handleAction_72_449 = handleAction_72(handleAction_42_446.id, value_448.id),
            value_450 = value_10.kudosByWork[handleAction_42_446.id],
            handleAction_75_451 = handleAction_75(handleAction_42_446),
            items_452 = ['cxcairlay', 'cylafee', 'Burningfield', 'Straworld', 'Radixx', 'Nimloth'];
        if (value_450) items_452.unshift(value_10.profile.pseud);
        const value_453 = handleAction_42_446.relationship
                ? '<button type="button" class="ao3-tag-link" data-ao3-search="' +
                  handleAction_23(handleAction_42_446.relationship) +
                  '">' +
                  handleAction_23(handleAction_42_446.relationship) +
                  '</button>'
                : 'None / 无',
            value_454 = value_448.notes
                ? '<section class="ao3-preface-section ao3-chapter-notes"><h2>Notes<small class="ao3-inline-translation">本章注释</small></h2><p>' +
                  handleAction_23(value_448.notes) +
                  '</p></section>'
                : '';
        return (
            '<article class="ao3-page ao3-work-page" aria-labelledby="ao3-work-title"><div class="ao3-work-toolbar"><button type="button" class="ao3-bevel-button" data-ao3-generate-comments>' +
            handleAction_65('Comments (' + handleAction_72_449.length + ')', '生成 10 条本章评论') +
            '</button><button type="button" class="ao3-bevel-button" data-ao3-download>' +
            handleAction_65('Download ↓', '下载') +
            '</button><button type="button" class="ao3-bevel-button ao3-danger-button" data-ao3-delete-chapter="' +
            handleAction_23(value_448.id) +
            '"' +
            (handleAction_42_446.chapters.length <= 1
                ? ' disabled title="Only one chapter; delete the whole work instead. / 仅有一章，请删除整篇。"'
                : '') +
            '>' +
            handleAction_65('Delete Chapter', '删除本章') +
            '</button><button type="button" class="ao3-bevel-button ao3-danger-button" data-ao3-delete-work="' +
            handleAction_23(handleAction_42_446.id) +
            '">' +
            handleAction_65('Delete Work', '删除整篇') +
            '</button></div><dl class="ao3-meta-card">' +
            handleAction_82(
                'Rating',
                '分级',
                '<button type="button" class="ao3-tag-link" data-ao3-search="' +
                    handleAction_23(handleAction_42_446.rating) +
                    '">' +
                    handleAction_23(handleAction_42_446.rating) +
                    ' / ' +
                    handleAction_23(handleAction_67(handleAction_42_446.rating)) +
                    '</button>',
            ) +
            handleAction_82(
                'Archive Warning',
                '作品警告',
                '<button type="button" class="ao3-tag-link" data-ao3-search="' +
                    handleAction_23(handleAction_42_446.warning) +
                    '">' +
                    handleAction_23(handleAction_42_446.warning) +
                    ' / ' +
                    handleAction_23(handleAction_68(handleAction_42_446.warning)) +
                    '</button>',
                {
                    warning: true,
                },
            ) +
            handleAction_82(
                'Category',
                '分类',
                handleAction_23(handleAction_42_446.category) +
                    ' / ' +
                    handleAction_23(handleAction_69(handleAction_42_446.category)),
            ) +
            handleAction_82(
                'Fandom',
                '作品圈',
                '<button type="button" class="ao3-tag-link" data-ao3-search="' +
                    handleAction_23(handleAction_42_446.fandom) +
                    '">' +
                    handleAction_23(handleAction_42_446.fandom) +
                    '</button>',
            ) +
            handleAction_82('Relationship', '关系', value_453) +
            handleAction_82(
                'Characters',
                '角色',
                handleAction_42_446.characters
                    .map(
                        (value_455) =>
                            '<button type="button" class="ao3-tag-link" data-ao3-search="' +
                            handleAction_23(value_455.name) +
                            '">' +
                            handleAction_23(value_455.name) +
                            '</button>',
                    )
                    .join('、') || 'None / 无',
            ) +
            handleAction_82(
                'Additional Tags',
                '附加标签',
                handleAction_42_446.tags
                    .map(
                        (value_456) =>
                            '<button type="button" class="ao3-tag-link" data-ao3-search="' +
                            handleAction_23(value_456) +
                            '">' +
                            handleAction_23(value_456) +
                            '</button>',
                    )
                    .join('、') || 'None / 无',
            ) +
            handleAction_82('Language', '语言', handleAction_23(handleAction_42_446.language)) +
            (handleAction_42_446.series
                ? handleAction_82('Series', '系列', handleAction_23(handleAction_42_446.series))
                : '') +
            '<div class="ao3-meta-row"><dt>' +
            handleAction_66('Stats', '数据') +
            ':</dt><dd class="ao3-meta-stats"><span><strong>Published / 发布:</strong>' +
            handleAction_23(handleAction_42_446.published) +
            '</span><span><strong>Words / 字数:</strong>' +
            handleAction_75_451.words.toLocaleString() +
            '</span><span><strong>Chapters / 章节:</strong>' +
            handleAction_75_451.chapters +
            '/' +
            handleAction_75_451.chapters +
            '</span><span><strong>Comments / 评论:</strong>' +
            handleAction_75_451.comments +
            '</span><span><strong>Kudos / 推荐:</strong>' +
            handleAction_75_451.kudos +
            '</span><span><strong>Bookmarks / 书签:</strong>' +
            handleAction_75_451.bookmarks +
            '</span><span><strong>Hits / 阅读:</strong>' +
            handleAction_75_451.hits.toLocaleString() +
            '</span></dd></div></dl><header class="ao3-work-title-block"><h1 id="ao3-work-title">' +
            handleAction_23(handleAction_42_446.title) +
            '</h1><p class="ao3-author">by <button type="button" class="ao3-text-link" data-ao3-route="profile">' +
            handleAction_23(handleAction_70(handleAction_42_446)) +
            '</button> <small class="ao3-inline-translation">作者</small></p></header><div class="ao3-work-preface"><section class="ao3-preface-section"><h2>Summary<small class="ao3-inline-translation">摘要</small></h2><p>' +
            handleAction_23(handleAction_42_446.summary) +
            '</p></section></div><header class="ao3-chapter-heading"><span class="ao3-chapter-kicker">Chapter ' +
            handleAction_43_447 +
            ' of ' +
            handleAction_42_446.chapters.length +
            ' / 第 ' +
            handleAction_43_447 +
            ' 章，共 ' +
            handleAction_42_446.chapters.length +
            ' 章</span><h2>' +
            handleAction_23(value_448.title) +
            '</h2></header>' +
            value_454 +
            '<div class="ao3-chapter-body">' +
            handleAction_89(value_448.content)
                .map((value_457) => '<p>' + handleAction_23(value_457) + '</p>')
                .join('') +
            '</div><nav class="ao3-chapter-pagination" aria-label="Chapter navigation / 章节导航"><button type="button" class="ao3-bevel-button" data-ao3-chapter="' +
            (handleAction_43_447 - 1) +
            '"' +
            (handleAction_43_447 <= 1 ? ' disabled' : '') +
            '>' +
            handleAction_65('← Previous Chapter', '上一章') +
            '</button>' +
            (handleAction_43_447 < handleAction_42_446.chapters.length
                ? '<button type="button" class="ao3-bevel-button" data-ao3-chapter="' +
                  (handleAction_43_447 + 1) +
                  '">' +
                  handleAction_65('Next Chapter →', '下一章') +
                  '</button>'
                : '<button type="button" class="ao3-bevel-button ao3-next-create" data-ao3-new-chapter="' +
                  handleAction_23(handleAction_42_446.id) +
                  '">' +
                  handleAction_65('Next Chapter →', '创作下一章') +
                  '</button>') +
            '</nav><div class="ao3-reader-actions"><button type="button" class="ao3-bevel-button" data-ao3-top>' +
            handleAction_65('↑ Top', '回到顶部') +
            '</button><button type="button" class="ao3-bevel-button ao3-kudos-button' +
            (value_450 ? ' is-given' : '') +
            '" data-ao3-kudos>' +
            handleAction_65(
                value_450 ? 'Kudos Given ♥' : 'Kudos ♥',
                value_450 ? '已推荐' : '推荐',
            ) +
            '</button><button type="button" class="ao3-bevel-button" data-ao3-generate-comments>' +
            handleAction_65('Comments (' + handleAction_72_449.length + ')', '生成 10 条本章评论') +
            '</button></div><div class="ao3-kudos-banner"><span class="ao3-kudos-heart" aria-hidden="true">♡</span><p><span class="ao3-kudos-names">' +
            items_452.map(handleAction_23).join(', ') +
            '</span> and ' +
            Math.max(0, 24 - (value_450 ? 1 : 0)) +
            ' guests left kudos on this work!<br><small>以及 ' +
            Math.max(0, 24 - (value_450 ? 1 : 0)) +
            ' 位访客为这篇作品留下了推荐。</small></p></div>' +
            handleAction_87(handleAction_42_446, value_448) +
            '</article>'
        );
    }
    function handleAction_91(value_458 = value_10.profile, value_459 = '') {
        const handleAction_22_460 = handleAction_22(value_458.avatarUrl),
            toUpperCase_461 = handleAction_20(value_458.pseud, 'A', 40).slice(0, 1).toUpperCase();
        return (
            '<span class="ao3-profile-avatar"' +
            (value_459 ? ' id="' + value_459 + '"' : '') +
            '>' +
            (handleAction_22_460
                ? '<img src="' + handleAction_23(handleAction_22_460) + '" alt="">'
                : handleAction_23(toUpperCase_461)) +
            '</span>'
        );
    }
    function handleAction_92(value_462) {
        const value_463 = ['works', 'bookmarks', 'history'].includes(value_462)
            ? value_462
            : 'works';
        let value_464 = value_10.works.length
            ? value_10.works.map(handleAction_77).join('')
            : '<div class="ao3-profile-empty"><strong>No works yet.</strong><br><small>还没有作品，点击“新建作品”开始创作。</small></div>';
        if (value_463 === 'bookmarks')
            value_464 =
                '<div class="ao3-profile-empty"><strong>No bookmarks yet.</strong><br><small>还没有收藏作品。</small></div>';
        if (value_463 === 'history') {
            const value_465 = new Map();
            [...value_10.history].reverse().forEach((value_466) => {
                if (!value_465.has(value_466.workId)) value_465.set(value_466.workId, value_466);
            });
            value_464 = value_465.size
                ? [...value_465.values()]
                      .map((value_467) => {
                          const handleAction_42_468 = handleAction_42(value_467.workId);
                          return handleAction_42_468
                              ? '<p class="ao3-result-summary">Last visited Chapter ' +
                                    value_467.chapter +
                                    ' on ' +
                                    handleAction_23(handleAction_83(value_467.visitedAt)) +
                                    '. <small class="ao3-inline-translation">最近阅读到第 ' +
                                    value_467.chapter +
                                    ' 章。</small></p>' +
                                    handleAction_77(handleAction_42_468)
                              : '';
                      })
                      .join('')
                : '<div class="ao3-profile-empty"><strong>No reading history yet.</strong><br><small>还没有阅读记录。</small></div>';
        }
        return (
            '<section class="ao3-page" aria-labelledby="ao3-profile-title"><header class="ao3-page-heading"><h1 id="ao3-profile-title">Dashboard<small>用户主页</small></h1><small>Local AO3 profile<br>本地 AO3 资料</small></header><section class="ao3-profile-card">' +
            handleAction_91() +
            '<div class="ao3-profile-copy"><h2>' +
            handleAction_23(value_10.profile.pseud) +
            '</h2><p>' +
            handleAction_23(value_10.profile.bio) +
            '</p><div class="ao3-profile-meta">Joined ' +
            handleAction_23(value_10.profile.joinedAt) +
            ' <small class="ao3-inline-translation">加入日期</small> · ' +
            value_10.works.length +
            ' Works <small class="ao3-inline-translation">' +
            value_10.works.length +
            ' 篇作品</small></div><div class="ao3-profile-actions"><button type="button" class="ao3-bevel-button" data-ao3-edit-profile>' +
            handleAction_65('Edit Profile', '编辑资料') +
            '</button><button type="button" class="ao3-bevel-button ao3-new-work-button" data-ao3-new-work>' +
            handleAction_65('New Work', '新建作品') +
            '</button></div></div></section><nav class="ao3-profile-tabs" aria-label="Profile sections / 主页分区">' +
            ['works', 'bookmarks', 'history']
                .map(
                    (items_469) =>
                        '<button type="button" class="ao3-profile-tab' +
                        (value_463 === items_469 ? ' is-active' : '') +
                        '" data-ao3-profile-tab="' +
                        items_469 +
                        '"><span>' +
                        (items_469[0].toUpperCase() + items_469.slice(1)) +
                        '</span><small>' +
                        {
                            works: '作品',
                            bookmarks: '收藏',
                            history: '历史',
                        }[items_469] +
                        '</small></button>',
                )
                .join('') +
            '</nav><div class="ao3-profile-panel">' +
            value_464 +
            '</div></section>'
        );
    }
    function handleAction_93() {
        return (
            '<section class="ao3-page" aria-labelledby="ao3-about-title"><header class="ao3-page-heading"><h1 id="ao3-about-title">About the Archive<small>关于本站</small></h1><small>Local prototype<br>本地原型</small></header><div class="ao3-about-copy"><p>This interface recreates the calm, information-rich reading experience of a classic fanwork archive. It is entirely local and does not connect to archiveofourown.org.<small>本界面复刻经典同人作品档案馆安静、信息密集的阅读体验，不会连接真实 AO3。</small></p><p>New works and chapters can be created with the API configured in system settings.<small>新作品与章节可以调用系统设置中配置的 API 进行创作。</small></p></div><h2 class="ao3-section-title">Archive Status<small>档案状态</small></h2><section class="ao3-account-card"><ul><li>' +
            value_10.works.length +
            ' local works <small class="ao3-inline-translation">' +
            value_10.works.length +
            ' 篇本地作品</small></li><li>AI chapter creation with summaries <small class="ao3-inline-translation">AI 正文与本章总结生成</small></li><li>Local profile and interaction storage <small class="ao3-inline-translation">本地资料与互动存储</small></li></ul></section></section>'
        );
    }
    function handleAction_94(value_470 = {}) {
        if (!message_9?.content) return;
        let innerHTML_2 = '';
        switch (options.name) {
            case 'fandoms':
                innerHTML_2 = handleAction_79();
                break;
            case 'browse':
                innerHTML_2 = handleAction_80();
                break;
            case 'search':
                innerHTML_2 = handleAction_81(options.params.query || '');
                break;
            case 'work':
                innerHTML_2 = handleAction_90(options.params.workId, options.params.chapter);
                break;
            case 'profile':
                innerHTML_2 = handleAction_92(options.params.tab);
                break;
            case 'about':
                innerHTML_2 = handleAction_93();
                break;
            default:
                options = {
                    name: 'home',
                    params: {},
                };
                innerHTML_2 = handleAction_78();
        }
        message_9.content.innerHTML = innerHTML_2;
        handleAction_64();
        if (message_9.historyBack) message_9.historyBack.hidden = items.length === 0;
        if (value_470.resetScroll !== false && message_9.scroll) message_9.scroll.scrollTop = 0;
        if (options.name === 'search')
            requestAnimationFrame(() =>
                document.getElementById('ao3-page-search-input')?.focus?.({
                    preventScroll: true,
                }),
            );
    }
    function handleAction_95(value_472, value_473) {
        const handleAction_42_474 = handleAction_42(value_472);
        if (!handleAction_42_474) return;
        const chapter_2 = handleAction_43(value_473, handleAction_42_474);
        value_10.lastChapterByWork[handleAction_42_474.id] = chapter_2;
        value_10.history = [
            ...value_10.history,
            {
                workId: handleAction_42_474.id,
                chapter: chapter_2,
                visitedAt: new Date().toISOString(),
            },
        ].slice(-100);
        void handleAction_62('ao3-reading-progress');
    }
    function navigate_2(value_476, value_477 = {}, value_478 = {}) {
        const value_479 = new Set([
                'home',
                'fandoms',
                'browse',
                'search',
                'work',
                'profile',
                'about',
            ]),
            name_5 = value_479.has(String(value_476 || '')) ? String(value_476) : 'home';
        if (value_478.replace !== true) items.push(handleAction_53(options));
        options = {
            name: name_5,
            params: {
                ...value_477,
            },
        };
        if (name_5 === 'work') {
            const handleAction_42_481 = handleAction_42(value_477.workId);
            !handleAction_42_481
                ? (options = {
                      name: 'profile',
                      params: {
                          tab: 'works',
                      },
                  })
                : ((options.params.workId = handleAction_42_481.id),
                  (options.params.chapter = handleAction_43(
                      value_477.chapter || value_10.lastChapterByWork[handleAction_42_481.id],
                      handleAction_42_481,
                  )),
                  handleAction_95(handleAction_42_481.id, options.params.chapter));
        }
        return (
            handleAction_94({
                resetScroll: value_478.resetScroll !== false,
            }),
            handleAction_53(options)
        );
    }
    function handleAction_97() {
        if (!items.length) return close_2();
        options = items.pop();
        handleAction_94();
    }
    function open_2() {
        if (!message_9?.view) return;
        options = {
            name: 'home',
            params: {},
        };
        items = [];
        handleAction_94();
        message_9.view.inert = false;
        message_9.view.setAttribute('aria-hidden', 'false');
        if (typeof window.openView === 'function') window.openView(message_9.view);
        else message_9.view.classList.add('active');
    }
    function close_2() {
        if (!message_9?.view) return;
        handleAction_149({
            abort: true,
            preserve: true,
        });
        handleAction_126();
        if (value_16) value_16.abort();
        value_16 = null;
        if (value_17) value_17.abort();
        value_17 = null;
        const activeElement_482 = document.activeElement;
        if (
            activeElement_482 &&
            message_9.view.contains(activeElement_482) &&
            typeof activeElement_482.blur === 'function'
        )
            activeElement_482.blur();
        options = {
            name: 'home',
            params: {},
        };
        items = [];
        message_9.view.inert = true;
        message_9.view.setAttribute('aria-hidden', 'true');
        if (typeof window.closeView === 'function') window.closeView(message_9.view);
        else message_9.view.classList.remove('active');
        document.getElementById('app-ao3-btn')?.focus?.({
            preventScroll: true,
        });
    }
    function handleAction_100(textContent_2) {
        if (!message_9?.toast) return;
        window.clearTimeout(value_11);
        message_9.toast.textContent = textContent_2;
        message_9.toast.classList.add('is-visible');
        value_11 = window.setTimeout(() => message_9?.toast?.classList.remove('is-visible'), 2400);
    }
    function handleAction_101() {
        document.getElementById('ao3-comments-section')?.scrollIntoView?.({
            behavior: 'smooth',
            block: 'start',
        });
    }
    function handleAction_102() {
        return handleAction_42(options.params.workId);
    }
    function handleAction_103() {
        const handleAction_102_484 = handleAction_102();
        if (!handleAction_102_484) return;
        const handleAction_44_485 = handleAction_44(value_10, handleAction_102_484.id);
        value_10 = handleAction_44_485.state;
        if (!handleAction_44_485.added)
            return handleAction_100('You have already left kudos here. / 你已经推荐过这篇作品');
        void handleAction_62('ao3-kudos');
        handleAction_94({
            resetScroll: false,
        });
        handleAction_100('Kudos left! / 已留下推荐');
    }
    function handleAction_104(element_486) {
        const handleAction_102_487 = handleAction_102(),
            value_488 =
                handleAction_102_487?.chapters?.[
                    handleAction_43(options.params.chapter, handleAction_102_487) - 1
                ];
        if (!handleAction_102_487 || !value_488 || value_17) return;
        const ao3CommentInputElement = element_486?.querySelector('#ao3-comment-input'),
            ao3CommentErrorElement = element_486?.querySelector('#ao3-comment-error'),
            text_7 = handleAction_20(ao3CommentInputElement?.value, '', count_4);
        if (!text_7) {
            if (ao3CommentErrorElement)
                ao3CommentErrorElement.textContent = 'Please enter a comment. / 请输入评论内容。';
            ao3CommentInputElement?.focus?.();
            return;
        }
        handleAction_56(element_486);
        const id_3 = 'comment-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
            handleAction_45_491 = handleAction_45(value_10, handleAction_102_487.id, value_488.id, {
                id: id_3,
                pseud: value_10.profile.pseud,
                text: text_7,
                createdAt: new Date().toISOString(),
            });
        if (!handleAction_45_491.added) return;
        value_10 = handleAction_45_491.state;
        void handleAction_62('ao3-comment');
        handleAction_94({
            resetScroll: false,
        });
        handleAction_100(
            'Comment posted; generating reader responses… / 评论已发布，正在生成读者回应…',
        );
        void handleAction_119(handleAction_102_487.id, value_488.id, id_3, text_7);
    }
    function handleAction_105(element_492) {
        const handleAction_102_493 = handleAction_102(),
            value_494 =
                handleAction_102_493?.chapters?.[
                    handleAction_43(options.params.chapter, handleAction_102_493) - 1
                ];
        if (!handleAction_102_493 || !value_494 || value_17) return;
        const value_495 = element_492?.dataset.commentId || '',
            nameReplyTextElement = element_492?.querySelector('[name="reply-text"]'),
            dataAo3ReplyErrorElement = element_492?.querySelector('[data-ao3-reply-error]'),
            text_8 = handleAction_20(nameReplyTextElement?.value, '', count_4);
        if (!text_8) {
            if (dataAo3ReplyErrorElement)
                dataAo3ReplyErrorElement.textContent = 'Please enter a reply. / 请输入回复内容。';
            nameReplyTextElement?.focus?.();
            return;
        }
        handleAction_56(element_492);
        const handleAction_46_497 = handleAction_46(value_10, handleAction_102_493.id, value_495, {
            id: 'reply-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
            pseud: value_10.profile.pseud,
            text: text_8,
            createdAt: new Date().toISOString(),
        });
        if (!handleAction_46_497.added)
            return handleAction_100('Comment no longer exists. / 该评论已不存在');
        value_10 = handleAction_46_497.state;
        void handleAction_62('ao3-comment-reply');
        handleAction_94({
            resetScroll: false,
        });
        handleAction_100(
            'Reply posted; generating reader responses… / 回复已发布，正在生成读者回应…',
        );
        void handleAction_119(handleAction_102_493.id, value_494.id, value_495, text_8);
    }
    function handleAction_106(value_498, value_499) {
        const handleAction_47_500 = handleAction_47(value_10, value_498, value_499);
        if (!handleAction_47_500.deleted) return;
        value_10 = handleAction_47_500.state;
        void handleAction_62('ao3-comment-delete');
        handleAction_94({
            resetScroll: false,
        });
        handleAction_100('Comment deleted. / 评论已删除');
    }
    function handleAction_107(value_501, value_502, value_503) {
        const handleAction_48_504 = handleAction_48(value_10, value_501, value_502, value_503);
        if (!handleAction_48_504.deleted) return;
        value_10 = handleAction_48_504.state;
        void handleAction_62('ao3-reply-delete');
        handleAction_94({
            resetScroll: false,
        });
        handleAction_100('Reply deleted. / 回复已删除');
    }
    async function handleAction_108(value_505) {
        const handleAction_102_506 = handleAction_102();
        if (
            !handleAction_102_506 ||
            !handleAction_102_506.chapters.some((value_508) => value_508.id === value_505)
        )
            return;
        if (handleAction_102_506.chapters.length <= 1)
            return handleAction_100(
                'This is the only chapter; delete the whole work instead. / 这是唯一章节，请删除整篇作品',
            );
        if (
            typeof window.confirm === 'function' &&
            !window.confirm(`Delete this chapter and all of its comments?
删除本章节及其全部评论？`)
        )
            return;
        const handleAction_49_507 = handleAction_49(value_10, handleAction_102_506.id, value_505);
        if (!handleAction_49_507.deleted) return;
        value_10 = handleAction_49_507.state;
        options.params.chapter = handleAction_49_507.chapter;
        await handleAction_62('ao3-delete-chapter');
        handleAction_94();
        handleAction_100('Chapter deleted. / 本章节已删除');
    }
    async function handleAction_109(value_509) {
        const handleAction_42_510 = handleAction_42(value_509);
        if (!handleAction_42_510) return;
        if (
            typeof window.confirm === 'function' &&
            !window.confirm(
                'Delete “' +
                    handleAction_42_510.title +
                    `” and all chapters and comments?
删除《` +
                    handleAction_42_510.title +
                    '》及其全部章节和评论？',
            )
        )
            return;
        const handleAction_50_511 = handleAction_50(value_10, handleAction_42_510.id);
        if (!handleAction_50_511.deleted) return;
        value_10 = handleAction_50_511.state;
        items = [];
        options = {
            name: 'profile',
            params: {
                tab: 'works',
            },
        };
        await handleAction_62('ao3-delete-work');
        handleAction_94();
        handleAction_100('Work deleted. / 整篇作品已删除');
    }
    function handleAction_110(element_512) {
        const handleAction_102_513 = handleAction_102(),
            value_514 =
                handleAction_102_513?.chapters?.[
                    handleAction_43(options.params.chapter, handleAction_102_513) - 1
                ],
            closest_515 = element_512?.closest('.ao3-comments-section'),
            ao3CommentsContentElement = closest_515?.querySelector('.ao3-comments-content');
        if (!handleAction_102_513 || !value_514 || !ao3CommentsContentElement) return;
        const hidden_2 = !ao3CommentsContentElement.hidden;
        ao3CommentsContentElement.hidden = hidden_2;
        element_512.setAttribute('aria-expanded', String(!hidden_2));
        const iElement = element_512.querySelector('i');
        if (iElement) iElement.className = 'fas fa-chevron-' + (hidden_2 ? 'down' : 'up');
        const value_517 = handleAction_102_513.id + ':' + value_514.id;
        if (hidden_2) value_19.add(value_517);
        else value_19['delete'](value_517);
    }
    function handleAction_111(element_518) {
        const dataAo3TranslationElement = element_518
            ?.closest('.ao3-comment-tools')
            ?.querySelector('[data-ao3-translation]');
        if (!dataAo3TranslationElement) return;
        dataAo3TranslationElement.hidden = !dataAo3TranslationElement.hidden;
        element_518.setAttribute('aria-expanded', String(!dataAo3TranslationElement.hidden));
        const smallElement = element_518.querySelector('small');
        if (smallElement)
            smallElement.textContent = dataAo3TranslationElement.hidden ? '翻译' : '收起翻译';
    }
    function handleAction_112(value_519, value_520 = false) {
        const closest_521 = value_519?.closest('.ao3-comment'),
            dataAo3ReplyFormElement = closest_521?.querySelector('[data-ao3-reply-form]');
        if (!dataAo3ReplyFormElement) return;
        dataAo3ReplyFormElement.hidden = value_520 ? true : !dataAo3ReplyFormElement.hidden;
        if (!dataAo3ReplyFormElement.hidden)
            requestAnimationFrame(() =>
                dataAo3ReplyFormElement.querySelector('textarea')?.focus?.({
                    preventScroll: true,
                }),
            );
    }
    function handleAction_113(value_522, message_523, value_524, value_525 = '') {
        const value_526 =
                value_522.characters
                    .map((value_528) => value_528.name)
                    .filter(Boolean)
                    .join('、') || '未指定',
            handleAction_20_527 = handleAction_20(message_523.content, '', 24000);
        return (
            `你正在模拟 AO3 国际同人作品平台的真实读者评论区。请只针对当前章节生成恰好 10 条顶层评论，允许部分评论带有楼中楼回复。

【作品】
标题：` +
            value_522.title +
            `
作品圈：` +
            value_522.fandom +
            `
配对：` +
            (value_522.relationship || '未指定') +
            `
角色：` +
            value_526 +
            `
标签：` +
            (value_522.tags.join('、') || '无') +
            `

【当前章节】
第 ` +
            value_524 +
            ' 章：' +
            message_523.title +
            `
` +
            handleAction_20_527 +
            (value_525
                ? `

【世界书背景，仅用于理解人物、关系与作品设定】
` + value_525
                : '') +
            `

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
严格结构：{"comments":[{"pseud":"读者昵称","text":"评论原文","translationZh":"非中文原文的简体中文翻译，中文则为空字符串","replies":[{"pseud":"回复者昵称","text":"回复原文","translationZh":"非中文原文的简体中文翻译，中文则为空字符串"}]}]}`
        );
    }
    function handleAction_114(value_529, value_530 = '') {
        const string_531 = String(value_530 || ''),
            items_532 = [],
            value_533 = typeof window.getGlobalWorldBookContext === 'function';
        if (value_533)
            try {
                const handleAction_20_537 = handleAction_20(
                    window.getGlobalWorldBookContext(string_531),
                    '',
                    50000,
                );
                if (handleAction_20_537) items_532.push(handleAction_20_537);
            } catch (value_538) {
                console.warn('[AO3] Failed to collect global world books for comments.', value_538);
            }
        const handleAction_145_534 = handleAction_145(),
            filter_535 = (
                Array.isArray(value_529?.worldBookIds) ? value_529.worldBookIds : []
            ).filter((value_539) => {
                if (!value_533) return true;
                const result_540 = handleAction_145_534.find(
                    (value_541) => String(value_541?.id) === String(value_539),
                );
                return !result_540?.isGlobal;
            }),
            handleAction_159_536 = handleAction_159(filter_535, string_531);
        if (handleAction_159_536)
            items_532.push(
                `Mounted AO3 World Books / AO3 作品挂载世界书：
` + handleAction_159_536,
            );
        if (!value_533) {
            const map_542 = handleAction_145_534
                    .filter((value_544) => value_544?.isGlobal)
                    .map((value_545) => String(value_545.id)),
                handleAction_159_543 = handleAction_159(map_542, string_531);
            if (handleAction_159_543)
                items_532.push(
                    `Global World Books / 全局世界书：
` + handleAction_159_543,
                );
            typeof window.getBuiltinWorldBookContext === 'function' &&
                ['system_depth', 'before_role', 'after_role'].forEach((value_546) => {
                    try {
                        const handleAction_20_547 = handleAction_20(
                            window.getBuiltinWorldBookContext(value_546, string_531),
                            '',
                            50000,
                        );
                        if (handleAction_20_547) items_532.push(handleAction_20_547);
                    } catch (value_548) {
                        console.warn(
                            '[AO3] Failed to collect builtin world books for comments.',
                            value_548,
                        );
                    }
                });
        }
        return items_532
            .filter(Boolean)
            .join(
                `

`,
            )
            .trim();
    }
    function handleAction_115(value_549) {
        const trim_550 = String(value_549 || '')
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();
        let value_551;
        try {
            value_551 = JSON.parse(trim_550);
        } catch (value_556) {
            const indexOf_557 = trim_550.indexOf('{'),
                lastIndexOf_558 = trim_550.lastIndexOf('}');
            if (indexOf_557 < 0 || lastIndexOf_558 <= indexOf_557)
                throw new Error('AI 返回的评论不是有效 JSON');
            value_551 = JSON.parse(trim_550.slice(indexOf_557, lastIndexOf_558 + 1));
        }
        const value_552 = (value_559, value_560, value_561) => ({
                pseud: handleAction_20(
                    value_559?.pseud || value_559?.name,
                    value_561 + '_' + (value_560 + 1),
                    40,
                ),
                text: handleAction_20(value_559?.text || value_559?.comment, '', count_4),
                translationZh: handleAction_20(value_559?.translationZh, '', count_4),
            }),
            value_553 = (value_562) =>
                !/[\u3400-\u9fff]/u.test(value_562) && /\p{L}/u.test(value_562),
            filter_554 = (Array.isArray(value_551?.comments) ? value_551.comments : [])
                .map((value_563, value_564) => {
                    const value_552_565 = value_552(value_563, value_564, 'reader');
                    return (
                        (value_552_565.replies = (
                            Array.isArray(value_563?.replies) ? value_563.replies : []
                        )
                            .map((value_566, value_567) => value_552(value_566, value_567, 'reply'))
                            .filter((value_568) => value_568.text)
                            .slice(0, 20)),
                        value_552_565
                    );
                })
                .filter((value_569) => value_569.text);
        if (filter_554.length !== 10) throw new Error('AI 必须返回恰好 10 条有效评论');
        const some_555 = filter_554.some(
            (value_570) =>
                (value_553(value_570.text) && !value_570.translationZh) ||
                value_570.replies.some(
                    (value_571) => value_553(value_571.text) && !value_571.translationZh,
                ),
        );
        if (some_555) throw new Error('AI 返回的非中文评论或回复缺少中文翻译');
        return filter_554;
    }
    function handleAction_116(
        value_572,
        message_573,
        value_574,
        value_575,
        value_576 = '',
        value_577 = '',
    ) {
        return (
            `你正在模拟 AO3 国际同人作品平台的真实评论区。作品作者刚刚在评论区发言，请生成恰好 10 条读者对作者这句发言的楼中楼回应。

【作品】
标题：` +
            value_572.title +
            `
作品圈：` +
            value_572.fandom +
            `
配对：` +
            (value_572.relationship || '未指定') +
            `

【当前章节】
第 ` +
            value_574 +
            ' 章：' +
            message_573.title +
            `
` +
            handleAction_20(message_573.content, '', 18000) +
            `

【当前评论线程】
` +
            handleAction_20(value_576, '暂无其他发言', 12000) +
            `

【作者最新发言，十条回复必须直接回应这句话】
` +
            handleAction_20(value_575, '', count_4) +
            (value_577
                ? `

【世界书背景，仅用于理解人物、关系与作品设定】
` + value_577
                : '') +
            `

【语气要求】
- 这是国际平台，中文、英文、日文、韩文或中外文夹杂都可以自然出现。
- 像真实同人女一样回应作者，可按需使用太太、妈咪、老师、肾疼、刀子、嗑生嗑死、kswl、很IC、蹲更、催肉三连、女孩你是天使、见到神了等表达，但不要机械复读。
- 有时候不需要评价剧情，只需自然接住作者的话、尖叫、玩梗、感谢投喂、催更或表达被作者回复后的激动。真人不会十个人都单拎一段剧情做书面分析。
- 回复长短和语气必须不同；允许一句话和表情，也允许少量较长回应。不要冒充作者，不要替作者继续解释。

【输出要求】
1. replies 必须恰好 10 条，全部作为同一个评论线程的楼中楼回复；这是 5–10 条楼中楼范围的上限。
2. text 保存回复原文。主要为非中文时必须提供自然完整的 translationZh；中文回复的 translationZh 为空字符串。
3. 只返回合法 JSON，不要 Markdown 或额外解释。
严格结构：{"replies":[{"pseud":"读者昵称","text":"对作者的回复原文","translationZh":"非中文回复的简体中文翻译，中文则为空字符串"}]}`
        );
    }
    function handleAction_117(value_578) {
        const trim_579 = String(value_578 || '')
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();
        let value_580;
        try {
            value_580 = JSON.parse(trim_579);
        } catch (value_583) {
            const indexOf_584 = trim_579.indexOf('{'),
                lastIndexOf_585 = trim_579.lastIndexOf('}');
            if (indexOf_584 < 0 || lastIndexOf_585 <= indexOf_584)
                throw new Error('AI 返回的作者回应不是有效 JSON');
            value_580 = JSON.parse(trim_579.slice(indexOf_584, lastIndexOf_585 + 1));
        }
        const filter_581 = (Array.isArray(value_580?.replies) ? value_580.replies : [])
            .map((value_586, value_587) => ({
                pseud: handleAction_20(
                    value_586?.pseud || value_586?.name,
                    'reader_' + (value_587 + 1),
                    40,
                ),
                text: handleAction_20(value_586?.text || value_586?.comment, '', count_4),
                translationZh: handleAction_20(value_586?.translationZh, '', count_4),
            }))
            .filter((value_588) => value_588.text);
        if (filter_581.length !== 10) throw new Error('AI 必须返回恰好 10 条作者回应');
        const value_582 = (value_589) =>
            !/[\u3400-\u9fff]/u.test(value_589) && /\p{L}/u.test(value_589);
        if (filter_581.some((value_590) => value_582(value_590.text) && !value_590.translationZh))
            throw new Error('AI 返回的非中文作者回应缺少中文翻译');
        return filter_581;
    }
    function handleAction_118(value_591) {
        message_9?.content
            ?.querySelectorAll(
                '#ao3-comment-form button[type="submit"], [data-ao3-reply-form] button[type="submit"]',
            )
            .forEach((value_592) => {
                value_592.disabled = !!value_591;
                value_592.setAttribute('aria-busy', String(!!value_591));
            });
    }
    async function handleAction_119(value_593, value_594, value_595, value_596) {
        if (value_17) return;
        const handleAction_42_597 = handleAction_42(value_593),
            value_598 =
                handleAction_42_597?.chapters?.findIndex(
                    (value_605) => value_605.id === value_594,
                ) + 1,
            value_599 = handleAction_42_597?.chapters?.[value_598 - 1],
            value_600 =
                handleAction_42_597 && value_599
                    ? handleAction_72(handleAction_42_597.id, value_599.id).find(
                          (value_606) => value_606.id === value_595,
                      )
                    : null;
        if (!handleAction_42_597 || !value_599 || !value_600) return;
        const join_601 = [
                value_600.pseud + ': ' + value_600.text,
                ...handleAction_73(handleAction_42_597.id, value_600.id).map(
                    (value_607) => value_607.pseud + ': ' + value_607.text,
                ),
            ].join(`
`),
            join_602 = [
                handleAction_42_597.title,
                handleAction_42_597.fandom,
                handleAction_42_597.relationship,
                handleAction_42_597.tags.join(' '),
                value_599.title,
                value_599.content,
                join_601,
                value_596,
            ].join(`
`),
            handleAction_114_603 = handleAction_114(handleAction_42_597, join_602),
            value_604 = new AbortController();
        value_17 = value_604;
        handleAction_118(true);
        try {
            const value_608 = await handleAction_164(
                    handleAction_116(
                        handleAction_42_597,
                        value_599,
                        value_598,
                        value_596,
                        join_601,
                        handleAction_114_603,
                    ),
                    value_604.signal,
                    '你是熟悉 AO3 评论生态与同人文化的读者互动模拟器，只输出要求的合法 JSON。',
                    1,
                ),
                handleAction_117_609 = handleAction_117(value_608),
                handleAction_40_610 = handleAction_40(value_10);
            if (
                !handleAction_72(handleAction_42_597.id, value_599.id, handleAction_40_610).some(
                    (value_613) => value_613.id === value_600.id,
                )
            )
                return;
            const now_611 = Date.now();
            if (!handleAction_40_610.repliesByComment[handleAction_42_597.id])
                handleAction_40_610.repliesByComment[handleAction_42_597.id] = {};
            const filter_612 = handleAction_117_609
                .map((value_614, value_615) =>
                    handleAction_32(
                        {
                            id: 'ai-author-reply-' + now_611 + '-' + (value_615 + 1),
                            pseud: value_614.pseud,
                            text: value_614.text,
                            translationZh: value_614.translationZh,
                            createdAt: new Date(now_611 + value_615 * 250).toISOString(),
                            generated: true,
                        },
                        value_615,
                    ),
                )
                .filter(Boolean);
            handleAction_40_610.repliesByComment[handleAction_42_597.id][value_600.id] = [
                ...handleAction_73(handleAction_42_597.id, value_600.id, handleAction_40_610),
                ...filter_612,
            ].slice(-100);
            value_10 = handleAction_40_610;
            await handleAction_62('ao3-author-comment-responses');
            value_17 = null;
            handleAction_94({
                resetScroll: false,
            });
            handleAction_100('10 reader responses generated. / 已生成 10 条读者回应');
        } catch (value_616) {
            if (value_604.signal.aborted || value_616?.name === 'AbortError') return;
            handleAction_100(
                window.u2Api?.isRequestError?.(value_616)
                    ? '读者回应生成失败 / 作者评论已保留，可稍后重试'
                    : (value_616?.message || '读者回应生成失败') + ' / 作者评论已保留，可稍后重试',
            );
        } finally {
            if (value_17 === value_604) value_17 = null;
            handleAction_118(false);
        }
    }
    function handleAction_120(value_617) {
        const handleAction_102_618 = handleAction_102(),
            value_619 =
                handleAction_102_618?.chapters?.[
                    handleAction_43(options.params.chapter, handleAction_102_618) - 1
                ];
        message_9?.content
            ?.querySelectorAll('[data-ao3-generate-comments]')
            .forEach((element_620) => {
                element_620.disabled = !!value_617;
                element_620.innerHTML = value_617
                    ? handleAction_65('Generating…', '正在生成 10 条评论')
                    : handleAction_65(
                          'Comments (' +
                              (handleAction_102_618 && value_619
                                  ? handleAction_72(handleAction_102_618.id, value_619.id).length
                                  : 0) +
                              ')',
                          '生成 10 条本章评论',
                      );
                element_620.setAttribute('aria-busy', String(!!value_617));
            });
    }
    async function handleAction_121() {
        const handleAction_102_621 = handleAction_102();
        if (!handleAction_102_621 || value_16) return;
        const handleAction_43_622 = handleAction_43(
                options.params.chapter || value_10.lastChapterByWork[handleAction_102_621.id],
                handleAction_102_621,
            ),
            value_623 = handleAction_102_621.chapters[handleAction_43_622 - 1],
            join_624 = [
                handleAction_102_621.title,
                handleAction_102_621.fandom,
                handleAction_102_621.relationship,
                handleAction_102_621.tags.join(' '),
                ...handleAction_102_621.characters.flatMap((contact_627) => [
                    contact_627.name,
                    contact_627.persona,
                ]),
                value_623.title,
                value_623.content,
            ].join(`
`),
            handleAction_114_625 = handleAction_114(handleAction_102_621, join_624),
            value_626 = new AbortController();
        value_16 = value_626;
        handleAction_120(true);
        try {
            const value_628 = await handleAction_164(
                    handleAction_113(
                        handleAction_102_621,
                        value_623,
                        handleAction_43_622,
                        handleAction_114_625,
                    ),
                    value_626.signal,
                    '你是熟悉中文同人文化、AO3 评论生态与圈内语感的读者评论模拟器。你会严格区分正文事实、世界书背景与读者推测，只输出要求的合法 JSON。',
                    1,
                ),
                handleAction_115_629 = handleAction_115(value_628),
                handleAction_40_630 = handleAction_40(value_10),
                now_631 = Date.now(),
                items_632 = [];
            handleAction_115_629.forEach((value_633, value_634) => {
                const id_4 = 'ai-comment-' + now_631 + '-' + (value_634 + 1),
                    handleAction_33_636 = handleAction_33(
                        {
                            id: id_4,
                            pseud: value_633.pseud,
                            text: value_633.text,
                            translationZh: value_633.translationZh,
                            createdAt: new Date(now_631 + value_634 * 1000).toISOString(),
                            chapterId: value_623.id,
                            generated: true,
                        },
                        value_634,
                    );
                if (!handleAction_33_636) return;
                items_632.push(handleAction_33_636);
                if (value_633.replies.length)
                    handleAction_40_630.repliesByComment[handleAction_102_621.id][id_4] =
                        value_633.replies
                            .map((value_637, value_638) =>
                                handleAction_32(
                                    {
                                        id:
                                            'ai-reply-' +
                                            now_631 +
                                            '-' +
                                            (value_634 + 1) +
                                            '-' +
                                            (value_638 + 1),
                                        pseud: value_637.pseud,
                                        text: value_637.text,
                                        translationZh: value_637.translationZh,
                                        createdAt: new Date(
                                            now_631 + value_634 * 1000 + (value_638 + 1) * 100,
                                        ).toISOString(),
                                        generated: true,
                                    },
                                    value_638,
                                ),
                            )
                            .filter(Boolean);
            });
            handleAction_40_630.commentsByWork[handleAction_102_621.id] = [
                ...(handleAction_40_630.commentsByWork[handleAction_102_621.id] || []),
                ...items_632,
            ].slice(-200);
            value_10 = handleAction_40_630;
            await handleAction_62('ao3-generate-comments');
            value_16 = null;
            handleAction_94({
                resetScroll: false,
            });
            handleAction_100('10 comments generated. / 已生成 10 条本章评论');
        } catch (value_639) {
            if (value_626.signal.aborted || value_639?.name === 'AbortError') return;
            if (window.u2Api?.isRequestError?.(value_639))
                window.u2Api.reportError(value_639, {
                    operation: '本章评论生成',
                    signal: value_626.signal,
                });
            else handleAction_100((value_639?.message || '评论生成失败') + ' / 请重试');
        } finally {
            if (value_16 === value_626) value_16 = null;
            handleAction_120(false);
        }
    }
    function handleAction_122(value_640, value_641 = value_10.profile) {
        const value_642 = value_640 && Array.isArray(value_640.chapters) ? value_640 : null;
        if (!value_642) return '';
        const items_643 = [
            value_642.title,
            'by ' + (value_642.authorPseud || value_641.pseud),
            '',
            'Rating / 分级: ' + value_642.rating + ' / ' + handleAction_67(value_642.rating),
            'Archive Warning / 作品警告: ' +
                value_642.warning +
                ' / ' +
                handleAction_68(value_642.warning),
            'Fandom / 作品圈: ' + value_642.fandom,
            'Relationship / 关系: ' + value_642.relationship,
            'Characters / 角色: ' +
                value_642.characters.map((value_644) => value_644.name).join('、'),
            'Tags / 标签: ' + value_642.tags.join('、'),
            '',
            `Summary / 摘要:
` + value_642.summary,
        ];
        return (
            value_642.chapters.forEach((message_645, value_646) => {
                items_643.push(
                    '',
                    'Chapter ' + (value_646 + 1) + ' / 第 ' + (value_646 + 1) + ' 章',
                    message_645.title,
                );
                if (message_645.relationships?.length)
                    items_643.push(
                        '',
                        'Chapter CP Relationships / 本章 CP 关系: ' +
                            message_645.relationships.join('、'),
                    );
                if (message_645.notes)
                    items_643.push(
                        '',
                        `Notes / 本章注释:
` + message_645.notes,
                    );
                items_643.push('', message_645.content);
            }),
            items_643.join(`
`)
        );
    }
    async function handleAction_123() {
        const handleAction_102_647 = handleAction_102();
        if (!handleAction_102_647) return;
        if (typeof window.u2ExportFile !== 'function')
            return handleAction_100('Download is unavailable. / 下载功能未加载');
        const value_648 = await window.u2ExportFile({
            blob: new Blob([handleAction_122(handleAction_102_647)], {
                type: 'text/plain;charset=utf-8',
            }),
            fileName: handleAction_102_647.title + '.txt',
            title: handleAction_102_647.title,
        });
        if (value_648 === 'downloaded' || value_648 === 'shared')
            handleAction_100('Download ready. / 文件已准备好');
        else {
            if (value_648 !== 'cancelled') handleAction_100('Download failed. / 下载失败');
        }
    }
    function handleAction_124() {
        if (!message_9?.profileAvatarPreview) return;
        message_9.profileAvatarPreview.outerHTML = handleAction_91(
            {
                ...value_10.profile,
                avatarUrl: avatarUrl_2,
            },
            'ao3-profile-avatar-preview',
        );
        message_9.profileAvatarPreview = document.getElementById('ao3-profile-avatar-preview');
    }
    function handleAction_125() {
        if (!message_9?.profileOverlay) return;
        avatarUrl_2 = value_10.profile.avatarUrl;
        message_9.profilePseud.value = value_10.profile.pseud;
        message_9.profileBio.value = value_10.profile.bio;
        if (message_9.profileError) message_9.profileError.textContent = '';
        handleAction_124();
        message_9.profileOverlay.hidden = false;
        message_9.profileOverlay.inert = false;
        requestAnimationFrame(() =>
            message_9?.profilePseud?.focus?.({
                preventScroll: true,
            }),
        );
    }
    function handleAction_126() {
        if (!message_9?.profileOverlay || message_9.profileOverlay.hidden) return;
        const activeElement_649 = document.activeElement;
        if (
            activeElement_649 &&
            message_9.profileOverlay.contains(activeElement_649) &&
            typeof activeElement_649.blur === 'function'
        )
            activeElement_649.blur();
        message_9.profileOverlay.hidden = true;
        message_9.profileOverlay.inert = true;
        avatarUrl_2 = '';
        if (message_9.profileAvatarInput) message_9.profileAvatarInput.value = '';
    }
    function handleAction_127(value_650) {
        return new Promise((value_651, value_652) => {
            const value_653 = new FileReader();
            value_653.onload = () => value_651(String(value_653.result || ''));
            value_653.onerror = () => value_652(value_653.error || new Error('File read failed'));
            value_653.readAsDataURL(value_650);
        });
    }
    async function handleAction_128(value_654) {
        if (!value_654 || !String(value_654.type || '').startsWith('image/')) return;
        try {
            avatarUrl_2 =
                typeof window.readImageAsCompressedDataUrl === 'function'
                    ? await window.readImageAsCompressedDataUrl(value_654, {
                          maxWidth: 320,
                          maxHeight: 320,
                          quality: 0.78,
                      })
                    : await handleAction_127(value_654);
            handleAction_124();
        } catch (value_655) {
            if (message_9?.profileError)
                message_9.profileError.textContent = 'Image could not be loaded. / 图片读取失败。';
        }
    }
    function handleAction_129() {
        const pseud_2 = handleAction_20(message_9?.profilePseud?.value, '', 40),
            handleAction_20_657 = handleAction_20(message_9?.profileBio?.value, '', 800);
        if (!pseud_2) {
            if (message_9?.profileError)
                message_9.profileError.textContent = 'Pseud is required. / 用户名不能为空。';
            message_9?.profilePseud?.focus?.();
            return;
        }
        value_10.profile = {
            ...value_10.profile,
            pseud: pseud_2,
            bio: handleAction_20_657 || '暂无简介。',
            avatarUrl: handleAction_22(avatarUrl_2),
        };
        value_10.profileInitialized = true;
        void handleAction_62('ao3-profile');
        handleAction_126();
        handleAction_94({
            resetScroll: false,
        });
        handleAction_100('Profile saved. / 资料已保存');
    }
    function handleAction_130(mode_2 = 'new-work', value_659 = null) {
        const userPersona_3 = handleAction_21(
            typeof window.getUserState === 'function'
                ? window.getUserState()?.persona
                : window.userState?.persona,
        );
        if (mode_2 === 'next-chapter' && value_659)
            return {
                mode: mode_2,
                workId: value_659.id,
                title: value_659.title,
                summary: value_659.summary,
                rating: value_659.rating,
                warning: value_659.warning,
                category: value_659.category,
                fandom: value_659.fandom,
                relationship: value_659.relationship,
                tags: value_659.tags.join(', '),
                characters: handleAction_24(value_659.characters),
                chapterRelationships: [
                    ...(value_659.chapters[value_659.chapters.length - 1]?.relationships || []),
                ],
                worldBookIds: [...value_659.worldBookIds],
                userPersona: userPersona_3,
                styleKey: value_659.writingStyle.key || 'custom',
                styleName: value_659.writingStyle.name || '',
                styleText: value_659.writingStyle.text || '',
                targetWords: 800,
                chapterNotes: '',
                plot: '',
                continuation: true,
            };
        return {
            mode: 'new-work',
            workId: '',
            title: '',
            summary: '',
            rating: 'General Audiences',
            warning: 'Creator Chose Not To Use Archive Warnings',
            category: 'Gen',
            fandom: '',
            relationship: '',
            tags: '',
            userPersona: userPersona_3,
            characters: [
                {
                    name: '',
                    gender: '',
                    persona: '',
                },
            ],
            chapterRelationships: [],
            worldBookIds: [],
            styleKey: 'style_baimiao',
            styleName: freeze_8.style_baimiao.name,
            styleText: freeze_8.style_baimiao.text,
            targetWords: 800,
            chapterNotes: '',
            plot: '',
            continuation: false,
        };
    }
    function handleAction_131(value_661) {
        return document.getElementById(value_661);
    }
    function handleAction_132() {
        const items_662 = Array.isArray(window.imData?.friends) ? window.imData.friends : [],
            value_663 = new Set();
        return items_662
            .filter((value_664) => {
                if (value_664?.type !== 'char') return false;
                const string_665 = String(value_664.id || '');
                if (!string_665 || value_663.has(string_665)) return false;
                return (value_663.add(string_665), true);
            })
            .map((contact_666) => ({
                id: String(contact_666.id),
                name: handleAction_20(
                    contact_666.nickname || contact_666.realName || contact_666.name,
                    '未命名角色',
                    80,
                ),
                gender: handleAction_20(contact_666.gender, '未设定', 40),
                persona: handleAction_21(
                    contact_666.persona || contact_666.signature || contact_666.description,
                ),
            }));
    }
    function handleAction_133(value_667 = '') {
        const handleAction_131_668 = handleAction_131('ao3-imessage-character-select');
        if (!handleAction_131_668) return;
        const handleAction_132_669 = handleAction_132();
        handleAction_131_668.innerHTML =
            '<option value="">iMessage Characters / iMessage 角色</option>' +
            handleAction_132_669
                .map(
                    (value_670) =>
                        '<option value="' +
                        handleAction_23(value_670.id) +
                        '">' +
                        handleAction_23(value_670.name) +
                        '</option>',
                )
                .join('');
        handleAction_131_668.value = handleAction_132_669.some(
            (value_671) => value_671.id === value_667,
        )
            ? value_667
            : '';
    }
    function handleAction_134() {
        const value_672 = handleAction_131('ao3-imessage-character-select')?.value || '',
            result_673 = handleAction_132().find((value_676) => value_676.id === value_672);
        if (!result_673) return;
        handleAction_137(false);
        const options_674 = {
                name: result_673.name,
                gender: result_673.gender,
                persona: result_673.persona,
            },
            index_675 = value_14.characters.findIndex(
                (contact_677) => !contact_677.name && !contact_677.persona,
            );
        if (index_675 >= 0) value_14.characters[index_675] = options_674;
        else value_14.characters.push(options_674);
        handleAction_139();
        handleAction_100(
            result_673.persona
                ? 'Char persona selected. / 已选择 Char 人设'
                : 'Char selected. / 已选择角色',
        );
    }
    function handleAction_135() {
        return [...(document.querySelectorAll('#ao3-character-list .ao3-character-row') || [])]
            .map((element_678) => ({
                name: handleAction_20(
                    element_678.querySelector('[data-character-name]')?.value,
                    '',
                    80,
                ),
                gender: handleAction_20(
                    element_678.querySelector('[data-character-gender]')?.value,
                    '未设定',
                    40,
                ),
                persona: handleAction_21(
                    element_678.querySelector('[data-character-persona]')?.value,
                ),
            }))
            .filter((contact_679) => contact_679.name || contact_679.persona);
    }
    function handleAction_136() {
        return [...(document.querySelectorAll('#ao3-cp-list .ao3-cp-row') || [])]
            .map((element_680) =>
                handleAction_20(
                    element_680.querySelector('[data-cp-relationship]')?.value,
                    '',
                    160,
                ),
            )
            .slice(0, 30);
    }
    function handleAction_137(value_681 = false) {
        if (!value_14) return null;
        const options_682 = {
            ...value_14,
            title: handleAction_20(handleAction_131('ao3-work-title-input')?.value, '', 160),
            summary: handleAction_20(handleAction_131('ao3-work-summary-input')?.value, '', 2000),
            rating: handleAction_20(
                handleAction_131('ao3-work-rating-input')?.value,
                'General Audiences',
                100,
            ),
            warning: handleAction_20(
                handleAction_131('ao3-work-warning-input')?.value,
                'Creator Chose Not To Use Archive Warnings',
                160,
            ),
            category: handleAction_20(
                handleAction_131('ao3-work-category-input')?.value,
                'Gen',
                40,
            ),
            fandom: handleAction_20(handleAction_131('ao3-work-fandom-input')?.value, '', 240),
            relationship: handleAction_20(
                handleAction_131('ao3-work-relationship-input')?.value,
                '',
                400,
            ),
            tags: handleAction_20(handleAction_131('ao3-work-tags-input')?.value, '', 800),
            userPersona: handleAction_21(handleAction_131('ao3-user-persona-input')?.value),
            characters: handleAction_135(),
            chapterRelationships: handleAction_136(),
            styleKey: handleAction_20(
                handleAction_131('ao3-style-preset-select')?.value,
                'custom',
                100,
            ),
            styleName: handleAction_20(
                handleAction_131('ao3-style-preset-name')?.value,
                value_14.styleName || '自定义文风',
                60,
            ),
            styleText: handleAction_20(handleAction_131('ao3-style-input')?.value, '', 2000),
            targetWords: Math.min(
                count_6,
                Math.max(
                    count_5,
                    Math.trunc(Number(handleAction_131('ao3-word-count-input')?.value) || 800),
                ),
            ),
            chapterNotes: handleAction_20(
                handleAction_131('ao3-chapter-notes-input')?.value,
                '',
                4000,
            ),
            plot: handleAction_20(handleAction_131('ao3-plot-input')?.value, '', 10000),
            continuation:
                value_14.mode === 'next-chapter' &&
                handleAction_131('ao3-continuation-input')?.checked === true,
        };
        value_14 = options_682;
        if (!value_681) return options_682;
        const items_683 = [
                [
                    !options_682.title,
                    'Please enter a title. / 请输入作品标题。',
                    'ao3-work-title-input',
                ],
                [
                    !options_682.fandom,
                    'Please enter a fandom. / 请输入作品圈。',
                    'ao3-work-fandom-input',
                ],
                [
                    !options_682.characters.length ||
                        options_682.characters.some((value_685) => !value_685.name),
                    'Every character needs a name. / 每个角色都需要名字。',
                    'ao3-character-list',
                ],
                [
                    !options_682.styleText,
                    'Please enter a writing style. / 请输入文风。',
                    'ao3-style-input',
                ],
            ],
            result_684 = items_683.find((value_686) => value_686[0]);
        if (result_684) {
            if (message_9.composerError) message_9.composerError.textContent = result_684[1];
            const handleAction_131_687 = handleAction_131(result_684[2]);
            return (
                handleAction_58(handleAction_131_687, handleAction_57(handleAction_131_687)),
                null
            );
        }
        return options_682;
    }
    function handleAction_138(contact_688 = {}, value_689 = 0) {
        return (
            '<article class="ao3-character-row" data-character-index="' +
            value_689 +
            '"><div class="ao3-character-row-head"><strong>Character ' +
            (value_689 + 1) +
            '<small>角色 ' +
            (value_689 + 1) +
            '</small></strong><div class="ao3-character-row-actions"><button type="button" class="ao3-character-save" data-ao3-save-character-preset="' +
            value_689 +
            '">Save Character<small>保存角色（含 User 人设）</small></button><button type="button" data-ao3-remove-character="' +
            value_689 +
            '" aria-label="Remove character / 删除角色"><i class="fas fa-xmark"></i></button></div></div><div class="ao3-character-fields"><label>Name<small>名字</small><input type="text" maxlength="80" enterkeyhint="next" data-character-name value="' +
            handleAction_23(contact_688.name || '') +
            '"></label><label>Gender<small>性别</small><input type="text" maxlength="40" enterkeyhint="next" data-character-gender value="' +
            handleAction_23(contact_688.gender || '') +
            '" placeholder="女 / 男 / 非二元 / 自定义"></label></div><label>Persona<small>人设（不限字数）</small><textarea enterkeyhint="enter" data-character-persona>' +
            handleAction_23(contact_688.persona || '') +
            '</textarea></label></article>'
        );
    }
    function handleAction_139() {
        const handleAction_131_690 = handleAction_131('ao3-character-list');
        if (!handleAction_131_690 || !value_14) return;
        if (!value_14.characters.length)
            value_14.characters.push({
                name: '',
                gender: '',
                persona: '',
            });
        handleAction_131_690.innerHTML = value_14.characters.map(handleAction_138).join('');
    }
    function handleAction_140(value_691 = '') {
        const handleAction_131_692 = handleAction_131('ao3-character-preset-select');
        if (!handleAction_131_692) return;
        handleAction_131_692.innerHTML =
            '<option value="">Saved Characters / 已保存角色</option>' +
            value_10.characterPresets
                .map(
                    (value_693) =>
                        '<option value="' +
                        handleAction_23(value_693.id) +
                        '">' +
                        handleAction_23(value_693.name) +
                        ' · ' +
                        handleAction_23(value_693.character.gender || '未设定') +
                        '</option>',
                )
                .join('');
        handleAction_131_692.value = value_10.characterPresets.some(
            (value_694) => value_694.id === value_691,
        )
            ? value_691
            : '';
    }
    function handleAction_141(value_695 = '', value_696 = 0) {
        return (
            '<article class="ao3-cp-row" data-cp-index="' +
            value_696 +
            '"><div class="ao3-cp-row-head"><strong>CP Relationship ' +
            (value_696 + 1) +
            '<small>本章 CP 关系 ' +
            (value_696 + 1) +
            '</small></strong><div class="ao3-cp-row-actions"><button type="button" class="ao3-cp-save" data-ao3-save-cp-preset="' +
            value_696 +
            '">Save Relationship<small>保存关系</small></button><button type="button" data-ao3-remove-cp="' +
            value_696 +
            '" aria-label="Remove CP relationship / 删除 CP 关系"><i class="fas fa-xmark"></i></button></div></div><label>Relationship<small>填写本章出现人物之间的 CP 关系</small><input type="text" maxlength="160" enterkeyhint="next" data-cp-relationship value="' +
            handleAction_23(value_695) +
            '" placeholder="角色 A/角色 B · 对手变恋人"></label></article>'
        );
    }
    function handleAction_142() {
        const handleAction_131_697 = handleAction_131('ao3-cp-list');
        if (!handleAction_131_697 || !value_14) return;
        handleAction_131_697.innerHTML = (
            Array.isArray(value_14.chapterRelationships) ? value_14.chapterRelationships : []
        )
            .map(handleAction_141)
            .join('');
    }
    function handleAction_143(value_698 = '') {
        const handleAction_131_699 = handleAction_131('ao3-cp-preset-select');
        if (!handleAction_131_699) return;
        handleAction_131_699.innerHTML =
            '<option value="">Saved CP Relationships / 已保存 CP 关系</option>' +
            value_10.cpPresets
                .map(
                    (value_700) =>
                        '<option value="' +
                        handleAction_23(value_700.id) +
                        '">' +
                        handleAction_23(value_700.name) +
                        '</option>',
                )
                .join('');
        handleAction_131_699.value = value_10.cpPresets.some(
            (value_701) => value_701.id === value_698,
        )
            ? value_698
            : '';
    }
    function handleAction_144(value_702 = '') {
        const handleAction_131_703 = handleAction_131('ao3-style-preset-select');
        if (!handleAction_131_703) return;
        handleAction_131_703.innerHTML =
            Object.entries(freeze_8)
                .map(
                    ([value_704, value_705]) =>
                        '<option value="' +
                        value_704 +
                        '">' +
                        handleAction_23(value_705.name) +
                        '</option>',
                )
                .join('') +
            '<option value="custom">自定义</option>' +
            value_10.stylePresets
                .map(
                    (value_706) =>
                        '<option value="' +
                        handleAction_23(value_706.id) +
                        '">' +
                        handleAction_23(value_706.name) +
                        ' · 已保存</option>',
                )
                .join('');
        handleAction_131_703.value = [
            ...Object.keys(freeze_8),
            'custom',
            ...value_10.stylePresets.map((value_707) => value_707.id),
        ].includes(value_702)
            ? value_702
            : 'custom';
    }
    function handleAction_145() {
        try {
            return typeof window.getWorldBooks === 'function' &&
                Array.isArray(window.getWorldBooks())
                ? window.getWorldBooks()
                : [];
        } catch (value_708) {
            return [];
        }
    }
    function handleAction_146() {
        const handleAction_131_709 = handleAction_131('ao3-worldbook-count'),
            handleAction_131_710 = handleAction_131('ao3-mounted-books');
        if (!value_14 || !handleAction_131_709 || !handleAction_131_710) return;
        const handleAction_145_711 = handleAction_145();
        value_14.worldBookIds = value_14.worldBookIds.filter((value_713) =>
            handleAction_145_711.some((value_714) => String(value_714.id) === String(value_713)),
        );
        const filter_712 = value_14.worldBookIds
            .map((value_715) =>
                handleAction_145_711.find(
                    (value_716) => String(value_716.id) === String(value_715),
                ),
            )
            .filter(Boolean);
        handleAction_131_709.textContent =
            filter_712.length + ' selected / 已选 ' + filter_712.length + ' 项';
        handleAction_131_710.innerHTML = filter_712.length
            ? filter_712
                  .map(
                      (value_717) =>
                          '<span><i class="fas fa-book"></i>' +
                          handleAction_23(value_717.name || '未命名世界书') +
                          '</span>',
                  )
                  .join('')
            : '<small>No world books mounted. / 尚未挂载世界书。</small>';
    }
    function handleAction_147() {
        if (!value_14) return;
        message_9.composerTitle.textContent =
            value_14.mode === 'next-chapter' ? 'New Chapter' : 'New Work';
        message_9.composerSubtitle.textContent =
            value_14.mode === 'next-chapter'
                ? '为《' + value_14.title + '》创作下一章'
                : '新建作品';
        const options_718 = {
            'ao3-work-title-input': value_14.title,
            'ao3-work-summary-input': value_14.summary,
            'ao3-work-rating-input': value_14.rating,
            'ao3-work-warning-input': value_14.warning,
            'ao3-work-category-input': value_14.category,
            'ao3-work-fandom-input': value_14.fandom,
            'ao3-work-relationship-input': value_14.relationship,
            'ao3-work-tags-input': value_14.tags,
            'ao3-user-persona-input': value_14.userPersona,
            'ao3-style-preset-name': value_14.styleName,
            'ao3-style-input': value_14.styleText,
            'ao3-word-count-input': value_14.targetWords,
            'ao3-chapter-notes-input': value_14.chapterNotes,
            'ao3-plot-input': value_14.plot,
        };
        Object.entries(options_718).forEach(([value_721, value_722]) => {
            const handleAction_131_723 = handleAction_131(value_721);
            if (handleAction_131_723)
                handleAction_131_723.value = value_722 == null ? '' : value_722;
        });
        const handleAction_131_719 = handleAction_131('ao3-continuation-row');
        if (handleAction_131_719) handleAction_131_719.hidden = value_14.mode !== 'next-chapter';
        const handleAction_131_720 = handleAction_131('ao3-continuation-input');
        if (handleAction_131_720) handleAction_131_720.checked = value_14.continuation !== false;
        handleAction_139();
        handleAction_140();
        handleAction_133();
        handleAction_142();
        handleAction_143();
        handleAction_144(value_14.styleKey);
        handleAction_146();
        if (message_9.composerError) message_9.composerError.textContent = '';
    }
    function openComposer_2(value_724 = {}) {
        if (!message_9?.composerOverlay) return false;
        const value_725 = value_724.mode === 'next-chapter' ? 'next-chapter' : 'new-work',
            value_726 = value_725 === 'next-chapter' ? handleAction_42(value_724.workId) : null;
        if (value_725 === 'next-chapter' && !value_726)
            return (handleAction_100('Work not found. / 作品不存在'), false);
        return (
            (value_14 = handleAction_130(value_725, value_726)),
            handleAction_147(),
            handleAction_150(false),
            (message_9.composerOverlay.hidden = false),
            (message_9.composerOverlay.inert = false),
            requestAnimationFrame(() =>
                handleAction_131(
                    value_725 === 'new-work' ? 'ao3-work-title-input' : 'ao3-plot-input',
                )?.focus?.({
                    preventScroll: true,
                }),
            ),
            true
        );
    }
    function handleAction_149(value_727 = {}) {
        if (!message_9?.composerOverlay || message_9.composerOverlay.hidden) return;
        if (value_727.preserve !== false) handleAction_137(false);
        if (value_727.abort !== false && value_15) value_15.abort();
        value_15 = null;
        handleAction_150(false);
        handleAction_56(message_9.composerOverlay);
        message_9.composerOverlay.hidden = true;
        message_9.composerOverlay.inert = true;
    }
    function handleAction_150(value_728) {
        if (!message_9?.composerForm) return;
        message_9.composerForm.classList.toggle('is-generating', !!value_728);
        message_9.composerForm
            .querySelectorAll('input, textarea, select, button')
            .forEach((value_729) => {
                value_729.disabled =
                    !!value_728 &&
                    !['ao3-composer-close', 'ao3-composer-cancel'].includes(value_729.id);
            });
        if (message_9.generating) message_9.generating.hidden = !value_728;
        if (message_9.composerSubmit)
            message_9.composerSubmit.setAttribute('aria-busy', String(!!value_728));
    }
    function handleAction_151(value_730) {
        const handleAction_137_731 = handleAction_137(false),
            max_732 = Math.max(0, Math.trunc(Number(value_730) || 0)),
            handleAction_29_733 = handleAction_29(
                handleAction_137_731.characters[max_732],
                max_732,
            );
        if (!handleAction_29_733?.name) {
            if (message_9.composerError)
                message_9.composerError.textContent =
                    "Enter this character's name first. / 请先填写这个角色的名字。";
            return;
        }
        const result_734 = value_10.characterPresets.find(
                (value_736) => value_736.name === handleAction_29_733.name,
            ),
            options_735 = {
                id: result_734?.id || 'character-preset-' + Date.now(),
                name: handleAction_29_733.name,
                character: handleAction_24(handleAction_29_733),
                userPersona: handleAction_21(handleAction_137_731.userPersona),
            };
        value_10.characterPresets = result_734
            ? value_10.characterPresets.map((value_737) =>
                  value_737.id === result_734.id ? options_735 : value_737,
              )
            : [...value_10.characterPresets, options_735];
        void handleAction_62('ao3-character-preset');
        handleAction_140(options_735.id);
        handleAction_100(
            result_734
                ? 'Character preset updated. / 角色预设已覆盖'
                : 'Character saved. / 角色已保存',
        );
    }
    function handleAction_152() {
        const value_738 = handleAction_131('ao3-character-preset-select')?.value || '',
            result_739 = value_10.characterPresets.find((value_742) => value_742.id === value_738);
        if (!result_739)
            return handleAction_100('Choose a saved character first. / 请先选择已保存角色');
        handleAction_137(false);
        const handleAction_24_740 = handleAction_24(result_739.character);
        if (result_739.userPersona) {
            value_14.userPersona = result_739.userPersona;
            const handleAction_131_743 = handleAction_131('ao3-user-persona-input');
            if (handleAction_131_743) handleAction_131_743.value = result_739.userPersona;
        }
        const index_741 = value_14.characters.findIndex(
            (contact_744) => !contact_744.name && !contact_744.persona,
        );
        if (index_741 >= 0) value_14.characters[index_741] = handleAction_24_740;
        else value_14.characters.push(handleAction_24_740);
        handleAction_139();
        handleAction_100('Character added. / 已添加角色');
    }
    function handleAction_153() {
        const value_745 = handleAction_131('ao3-character-preset-select')?.value || '';
        if (!value_745) return handleAction_100('Choose a preset first. / 请先选择预设');
        value_10.characterPresets = value_10.characterPresets.filter(
            (value_746) => value_746.id !== value_745,
        );
        void handleAction_62('ao3-character-preset-delete');
        handleAction_140();
        handleAction_100('Character preset deleted. / 角色预设已删除');
    }
    function handleAction_154(value_747) {
        const handleAction_137_748 = handleAction_137(false),
            max_749 = Math.max(0, Math.trunc(Number(value_747) || 0)),
            handleAction_20_750 = handleAction_20(
                handleAction_137_748.chapterRelationships[max_749],
                '',
                160,
            );
        if (!handleAction_20_750) {
            if (message_9.composerError)
                message_9.composerError.textContent =
                    'Enter this CP relationship first. / 请先填写这条 CP 关系。';
            return;
        }
        const result_751 = value_10.cpPresets.find(
                (value_753) =>
                    value_753.relationship === handleAction_20_750 ||
                    value_753.name === handleAction_20_750,
            ),
            options_752 = {
                id: result_751?.id || 'cp-preset-' + Date.now(),
                name: handleAction_20_750,
                relationship: handleAction_20_750,
            };
        value_10.cpPresets = result_751
            ? value_10.cpPresets.map((value_754) =>
                  value_754.id === result_751.id ? options_752 : value_754,
              )
            : [...value_10.cpPresets, options_752];
        void handleAction_62('ao3-cp-preset');
        handleAction_143(options_752.id);
        handleAction_100(
            result_751
                ? 'CP relationship preset updated. / CP 关系预设已覆盖'
                : 'CP relationship saved. / CP 关系已保存',
        );
    }
    function handleAction_155() {
        const value_755 = handleAction_131('ao3-cp-preset-select')?.value || '',
            result_756 = value_10.cpPresets.find((value_757) => value_757.id === value_755);
        if (!result_756)
            return handleAction_100(
                'Choose a saved CP relationship first. / 请先选择已保存的 CP 关系',
            );
        handleAction_137(false);
        if (!value_14.chapterRelationships.includes(result_756.relationship))
            value_14.chapterRelationships.push(result_756.relationship);
        handleAction_142();
        handleAction_100('CP relationship added. / 已添加 CP 关系');
    }
    function handleAction_156() {
        const value_758 = handleAction_131('ao3-cp-preset-select')?.value || '';
        if (!value_758) return handleAction_100('Choose a CP preset first. / 请先选择 CP 关系预设');
        value_10.cpPresets = value_10.cpPresets.filter((value_759) => value_759.id !== value_758);
        void handleAction_62('ao3-cp-preset-delete');
        handleAction_143();
        handleAction_100('CP relationship preset deleted. / CP 关系预设已删除');
    }
    function handleAction_157() {
        const handleAction_137_760 = handleAction_137(false),
            name_6 = handleAction_20(handleAction_131('ao3-style-preset-name')?.value, '', 60);
        if (!name_6 || !handleAction_137_760.styleText) {
            message_9.composerError.textContent =
                'Enter a preset name and writing style. / 请输入预设名称和文风。';
            return;
        }
        const value_762 = handleAction_131('ao3-style-preset-select')?.value || '',
            result_763 = value_10.stylePresets.find(
                (value_765) => value_765.id === value_762 || value_765.name === name_6,
            ),
            options_764 = {
                id: result_763?.id || 'style-preset-' + Date.now(),
                name: name_6,
                text: handleAction_137_760.styleText,
            };
        value_10.stylePresets = result_763
            ? value_10.stylePresets.map((value_766) =>
                  value_766.id === result_763.id ? options_764 : value_766,
              )
            : [...value_10.stylePresets, options_764];
        value_14.styleKey = options_764.id;
        value_14.styleName = options_764.name;
        void handleAction_62('ao3-style-preset');
        handleAction_144(options_764.id);
        handleAction_100('Writing style saved. / 文风预设已保存');
    }
    function handleAction_158() {
        const value_767 = handleAction_131('ao3-style-preset-select')?.value || '';
        if (!value_10.stylePresets.some((value_768) => value_768.id === value_767))
            return handleAction_100('Choose a saved preset first. / 请先选择已保存的预设');
        value_10.stylePresets = value_10.stylePresets.filter(
            (value_769) => value_769.id !== value_767,
        );
        value_14.styleKey = 'custom';
        void handleAction_62('ao3-style-preset-delete');
        handleAction_144('custom');
        handleAction_100('Preset deleted. / 预设已删除');
    }
    function handleAction_159(value_770, value_771 = '') {
        const value_772 = new Set((Array.isArray(value_770) ? value_770 : []).map(String)),
            items_773 = [];
        return (
            handleAction_145()
                .filter((value_774) => value_772.has(String(value_774.id)))
                .forEach((value_775) => {
                    const sort_776 = (Array.isArray(value_775.entries) ? value_775.entries : [])
                        .map((value_777) =>
                            window.normalizeWorldBookEntry
                                ? window.normalizeWorldBookEntry(value_777 || {})
                                : value_777 || {},
                        )
                        .filter((message_778) => {
                            if (
                                message_778.enabled === false ||
                                !handleAction_20(message_778.content, '', 50000)
                            )
                                return false;
                            if (message_778.triggerMode !== 'keyword') return true;
                            if (typeof window.worldBookKeywordMatched === 'function')
                                return window.worldBookKeywordMatched(message_778, value_771);
                            return handleAction_27(message_778.keyword || '', 30, 100).some(
                                (value_779) => String(value_771).includes(value_779),
                            );
                        })
                        .sort(
                            (value_780, value_781) =>
                                Number(value_780.order || 100) - Number(value_781.order || 100),
                        );
                    if (!sort_776.length) return;
                    items_773.push(
                        '〔' +
                            (value_775.name || '未命名世界书') +
                            `〕
` +
                            sort_776.map((message_782) =>
                                window.formatWorldBookEntryForPrompt
                                    ? window.formatWorldBookEntryForPrompt(message_782)
                                    : '【' +
                                      (message_782.title || message_782.name || '词条') +
                                      `】
` +
                                      message_782.content,
                            ).join(`

`),
                    );
                }),
            items_773
                .join(
                    `

`,
                )
                .trim()
        );
    }
    function handleAction_160(value_783, value_784 = '', value_785 = '') {
        value_783 = {
            ...value_783,
            styleText:
                `【文学指导（AO3 独立副本）】
` +
                freeze_7.style_creative_guidance +
                `

【选定文风】
` +
                value_783.styleText +
                `

【正文分段硬性要求】
正文必须分段输出。每段约100至150字，段落之间必须保留一个空行，不要把所有文字挤在同一个长段落里。
如果包含对白，仍要让叙述段落和对白自然分开，保持阅读呼吸感。`,
        };
        const join_786 = value_783.characters.map(
                (contact_790, value_791) =>
                    value_791 +
                    1 +
                    '. 姓名：' +
                    contact_790.name +
                    `
性别：` +
                    (contact_790.gender || '未设定') +
                    `
人设：` +
                    (contact_790.persona || '未填写'),
            ).join(`

`),
            handleAction_27_787 = handleAction_27(value_783.chapterRelationships || [], 30, 160),
            value_788 = handleAction_27_787.length
                ? handleAction_27_787.map(
                      (value_792, value_793) => value_793 + 1 + '. ' + value_792,
                  ).join(`
`)
                : '未指定，请依据角色人设与作品关系自然处理。',
            value_789 =
                value_783.mode === 'next-chapter' && value_783.continuation && value_785
                    ? `
【上一章总结，仅用于承接】
` +
                      value_785 +
                      `
`
                    : '';
        return (
            `你是一位中文同人小说作者。请根据用户给出的设定创作一章完整小说，同时生成便于下一章承接的简洁总结。

【作品资料】
标题：` +
            value_783.title +
            `
简介：` +
            (value_783.summary || '未填写') +
            `
分级：` +
            value_783.rating +
            `
作品警告：` +
            value_783.warning +
            `
分类：` +
            value_783.category +
            `
作品圈：` +
            value_783.fandom +
            `
关系：` +
            (value_783.relationship || '未指定') +
            `
附加标签：` +
            (value_783.tags || '无') +
            `

【角色】
` +
            join_786 +
            `

【本章 CP 关系】
` +
            value_788 +
            `
以上关系仅约束本章实际出现人物之间的 CP 互动，不要擅自合并、替换或遗漏用户指定的关系。

【文风】
` +
            value_783.styleText +
            `

【目标长度】
正文约 ` +
            value_783.targetWords +
            ` 字，允许自然浮动，但不要明显短于要求。

【本章剧情】
` +
            (value_783.plot ||
                '用户没有指定剧情。请基于作品资料、角色人设、关系、文风与世界书自由创作自然完整的一章。') +
            `
` +
            value_789 +
            (value_784
                ? `
【挂载世界书，必须遵守】
` +
                  value_784 +
                  `
`
                : '') +
            `
【输出规则】
1. 使用简体中文创作，保持角色人设、关系、分级和作品警告一致。
2. content 只放小说正文，不要写创作说明、字数统计或 Markdown 标题。
3. chapterSummary 用一段简洁文字记录本章事件、关系变化、未解决线索和结尾状态，供下一章续写。
4. 只返回合法 JSON，不要 Markdown 代码块，不要额外解释。
严格结构：{"chapterTitle":"章节标题","content":"完整正文","chapterSummary":"本章总结"}`
        );
    }
    function handleAction_161(value_794) {
        const trim_795 = String(value_794 || '')
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();
        let message_796;
        try {
            message_796 = JSON.parse(trim_795);
        } catch (value_800) {
            const indexOf_801 = trim_795.indexOf('{'),
                lastIndexOf_802 = trim_795.lastIndexOf('}');
            if (indexOf_801 < 0 || lastIndexOf_802 <= indexOf_801)
                throw new Error('AI 返回内容不是有效 JSON');
            message_796 = JSON.parse(trim_795.slice(indexOf_801, lastIndexOf_802 + 1));
        }
        const chapterTitle_2 = handleAction_20(message_796?.chapterTitle, '', 160),
            content_3 = handleAction_89(handleAction_20(message_796?.content, '', 200000)).join(`

`),
            chapterSummary_2 = handleAction_20(message_796?.chapterSummary, '', 4000);
        if (!chapterTitle_2 || !content_3 || !chapterSummary_2)
            throw new Error('AI 返回缺少章节标题、正文或本章总结');
        return {
            chapterTitle: chapterTitle_2,
            content: content_3,
            chapterSummary: chapterSummary_2,
        };
    }
    function handleAction_162(value_803, value_804, message_805, value_806 = value_803.profile) {
        const state_9 = handleAction_40(value_803),
            toISOString_808 = new Date().toISOString(),
            value_809 = 'ao3-work-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
            handleAction_31_810 = handleAction_31(
                {
                    id: value_809,
                    title: value_804.title,
                    authorPseud: value_806.pseud,
                    fandom: value_804.fandom,
                    relationship: value_804.relationship,
                    characters: value_804.characters,
                    tags: handleAction_27(value_804.tags),
                    rating: value_804.rating,
                    warning: value_804.warning,
                    category: value_804.category,
                    language: '中文-普通话 國語',
                    published: handleAction_25(),
                    updatedAt: toISOString_808,
                    summary: value_804.summary || '暂无简介。',
                    worldBookIds: value_804.worldBookIds,
                    writingStyle: {
                        key: value_804.styleKey,
                        name: value_804.styleName,
                        text: value_804.styleText,
                    },
                    baseStats: {
                        kudos: 0,
                        bookmarks: 0,
                        hits: 0,
                    },
                    chapters: [
                        {
                            id: 'chapter-' + Date.now() + '-1',
                            title: message_805.chapterTitle,
                            content: message_805.content,
                            summary: message_805.chapterSummary,
                            notes: value_804.chapterNotes || '',
                            relationships: handleAction_27(
                                value_804.chapterRelationships || [],
                                30,
                                160,
                            ),
                            targetWords: value_804.targetWords,
                            usedContinuation: false,
                            createdAt: toISOString_808,
                        },
                    ],
                },
                state_9.works.length,
            );
        return (
            state_9.works.push(handleAction_31_810),
            (state_9.commentsByWork[value_809] = []),
            (state_9.repliesByComment[value_809] = {}),
            (state_9.deletedCommentIdsByWork[value_809] = []),
            (state_9.kudosByWork[value_809] = false),
            (state_9.lastChapterByWork[value_809] = 1),
            {
                state: state_9,
                workId: value_809,
                chapter: 1,
            }
        );
    }
    function handleAction_163(value_811, value_812, value_813, message_814) {
        const state_10 = handleAction_40(value_811),
            handleAction_41_816 = handleAction_41(state_10, value_812);
        if (!handleAction_41_816) throw new Error('要续写的作品不存在');
        const updatedAt_2 = new Date().toISOString();
        return (
            (handleAction_41_816.title = value_813.title),
            (handleAction_41_816.summary = value_813.summary || handleAction_41_816.summary),
            (handleAction_41_816.fandom = value_813.fandom),
            (handleAction_41_816.relationship = value_813.relationship),
            (handleAction_41_816.rating = value_813.rating),
            (handleAction_41_816.warning = value_813.warning),
            (handleAction_41_816.category = value_813.category),
            (handleAction_41_816.tags = handleAction_27(value_813.tags)),
            (handleAction_41_816.characters = value_813.characters
                .map(handleAction_29)
                .filter(Boolean)),
            (handleAction_41_816.worldBookIds = [...value_813.worldBookIds]),
            (handleAction_41_816.writingStyle = {
                key: value_813.styleKey,
                name: value_813.styleName,
                text: value_813.styleText,
            }),
            (handleAction_41_816.updatedAt = updatedAt_2),
            handleAction_41_816.chapters.push({
                id: 'chapter-' + Date.now() + '-' + (handleAction_41_816.chapters.length + 1),
                title: message_814.chapterTitle,
                content: message_814.content,
                summary: message_814.chapterSummary,
                notes: value_813.chapterNotes || '',
                relationships: handleAction_27(value_813.chapterRelationships || [], 30, 160),
                targetWords: value_813.targetWords,
                usedContinuation: value_813.continuation === true,
                createdAt: updatedAt_2,
            }),
            (state_10.lastChapterByWork[handleAction_41_816.id] =
                handleAction_41_816.chapters.length),
            {
                state: state_10,
                workId: handleAction_41_816.id,
                chapter: handleAction_41_816.chapters.length,
            }
        );
    }
    async function handleAction_164(
        content_5,
        signal_2,
        content_4 = '你是严谨的小说创作助手，只输出要求的合法 JSON。',
        value_821 = 0.8,
    ) {
        const apiConfig_2 =
            typeof window.getApiConfig === 'function'
                ? window.getApiConfig()
                : window.apiConfig || {};
        if (!apiConfig_2?.endpoint || !apiConfig_2?.apiKey || !apiConfig_2?.model)
            throw new Error('请先在系统设置中完成 API 配置');
        const value_823 = window.u2Api?.normalizeApiEndpoint
            ? window.u2Api.normalizeApiEndpoint(apiConfig_2.endpoint, apiConfig_2.provider)
            : window.u2Api?.resolveChatCompletionsEndpoint?.(apiConfig_2.endpoint);
        if (!value_823) throw new Error('API 地址无效');
        const headers_2 = window.u2Api?.buildApiHeaders
                ? window.u2Api.buildApiHeaders(apiConfig_2, {
                      'X-U2-Silent-Errors': '1',
                  })
                : {
                      'Content-Type': 'application/json',
                      Authorization: 'Bearer ' + apiConfig_2.apiKey,
                      'X-U2-Silent-Errors': '1',
                  },
            body_2 = {
                model: apiConfig_2.model,
                messages: [
                    {
                        role: 'system',
                        content: content_4,
                    },
                    {
                        role: 'user',
                        content: content_5,
                    },
                ],
                temperature: Number.isFinite(Number(value_821)) ? Number(value_821) : 0.8,
                response_format: {
                    type: 'json_object',
                },
            },
            fetchChatCompletion_826 = window.u2Api?.fetchChatCompletion,
            value_827 = fetchChatCompletion_826
                ? await fetchChatCompletion_826(value_823, {
                      method: 'POST',
                      headers: headers_2,
                      apiConfig: apiConfig_2,
                      body: body_2,
                      signal: signal_2,
                  })
                : await window.fetch(value_823, {
                      method: 'POST',
                      headers: headers_2,
                      body: JSON.stringify(body_2),
                      signal: signal_2,
                  });
        if (!value_827.ok) {
            const value_830 = window.u2Api?.readApiError
                ? await window.u2Api.readApiError(value_827)
                : null;
            throw (
                window.u2Api?.createHttpError?.(value_827, value_830) ||
                Object.assign(
                    new Error(
                        value_830?.message || 'API 请求失败（HTTP ' + value_827.status + '）',
                    ),
                    {
                        status: value_827.status,
                    },
                )
            );
        }
        const value_828 = await value_827.json(),
            items_829 =
                value_828?.choices?.[0]?.message?.content ?? value_828?.choices?.[0]?.text ?? '';
        return Array.isArray(items_829)
            ? items_829.map((value_831) => value_831?.text || value_831 || '').join('')
            : String(items_829 || '');
    }
    function handleAction_165(value_832, value_833) {
        return handleAction_164(value_832, value_833);
    }
    async function handleAction_166() {
        const handleAction_137_834 = handleAction_137(true);
        if (!handleAction_137_834 || value_15) return;
        const value_835 =
                handleAction_137_834.mode === 'next-chapter'
                    ? handleAction_42(handleAction_137_834.workId)
                    : null,
            value_836 =
                handleAction_137_834.continuation && value_835
                    ? value_835.chapters[value_835.chapters.length - 1]?.summary || ''
                    : '',
            join_837 = [
                handleAction_137_834.title,
                handleAction_137_834.summary,
                handleAction_137_834.relationship,
                handleAction_137_834.tags,
                handleAction_137_834.plot,
                ...(handleAction_137_834.chapterRelationships || []),
                ...handleAction_137_834.characters.flatMap((contact_841) => [
                    contact_841.name,
                    contact_841.persona,
                ]),
                value_836,
            ].join(`
`),
            handleAction_159_838 = handleAction_159(handleAction_137_834.worldBookIds, join_837),
            handleAction_160_839 = handleAction_160(
                handleAction_137_834,
                handleAction_159_838,
                value_836,
            );
        value_15 = new AbortController();
        const value_840 = value_15;
        handleAction_150(true);
        if (message_9.composerError) message_9.composerError.textContent = '';
        try {
            const value_842 = await handleAction_165(handleAction_160_839, value_840.signal),
                handleAction_161_843 = handleAction_161(value_842),
                value_844 =
                    handleAction_137_834.mode === 'next-chapter'
                        ? handleAction_163(
                              value_10,
                              handleAction_137_834.workId,
                              handleAction_137_834,
                              handleAction_161_843,
                          )
                        : handleAction_162(
                              value_10,
                              handleAction_137_834,
                              handleAction_161_843,
                              value_10.profile,
                          );
            value_10 = value_844.state;
            await handleAction_62(
                handleAction_137_834.mode === 'next-chapter'
                    ? 'ao3-generate-chapter'
                    : 'ao3-generate-work',
            );
            value_15 = null;
            handleAction_149({
                abort: false,
                preserve: false,
            });
            navigate_2('work', {
                workId: value_844.workId,
                chapter: value_844.chapter,
            });
            handleAction_100(
                handleAction_137_834.mode === 'next-chapter'
                    ? 'Chapter published. / 新章节已发布'
                    : 'Work published. / 新作品已发布',
            );
        } catch (value_845) {
            if (value_840.signal.aborted || value_845?.name === 'AbortError') return;
            if (window.u2Api?.isRequestError?.(value_845))
                window.u2Api.reportError(value_845, {
                    operation:
                        handleAction_137_834.mode === 'next-chapter' ? '章节生成' : '作品生成',
                    signal: value_840.signal,
                });
            else {
                if (message_9.composerError)
                    message_9.composerError.textContent =
                        (value_845?.message || '生成失败，请重试') +
                        ' / Creation failed; please retry.';
            }
        } finally {
            if (value_15 === value_840) value_15 = null;
            if (!message_9?.composerOverlay?.hidden) handleAction_150(false);
        }
    }
    function handleAction_167(event_846) {
        const closest_847 = event_846.target.closest('[data-ao3-remove-character]');
        if (closest_847) {
            handleAction_137(false);
            value_14.characters.splice(Number(closest_847.dataset.ao3RemoveCharacter), 1);
            handleAction_139();
            return;
        }
        if (event_846.target.closest('[data-ao3-add-character]')) {
            handleAction_137(false);
            value_14.characters.push({
                name: '',
                gender: '',
                persona: '',
            });
            handleAction_139();
            return;
        }
        const closest_848 = event_846.target.closest('[data-ao3-save-character-preset]');
        if (closest_848) return handleAction_151(closest_848.dataset.ao3SaveCharacterPreset);
        if (event_846.target.closest('[data-ao3-use-character-preset]')) return handleAction_152();
        if (event_846.target.closest('[data-ao3-delete-character-preset]'))
            return handleAction_153();
        const closest_849 = event_846.target.closest('[data-ao3-remove-cp]');
        if (closest_849) {
            handleAction_137(false);
            value_14.chapterRelationships.splice(Number(closest_849.dataset.ao3RemoveCp), 1);
            handleAction_142();
            return;
        }
        if (event_846.target.closest('[data-ao3-add-cp]')) {
            handleAction_137(false);
            value_14.chapterRelationships.push('');
            handleAction_142();
            return;
        }
        const closest_850 = event_846.target.closest('[data-ao3-save-cp-preset]');
        if (closest_850) return handleAction_154(closest_850.dataset.ao3SaveCpPreset);
        if (event_846.target.closest('[data-ao3-use-cp-preset]')) return handleAction_155();
        if (event_846.target.closest('[data-ao3-delete-cp-preset]')) return handleAction_156();
        if (event_846.target.closest('[data-ao3-save-style-preset]')) return handleAction_157();
        if (event_846.target.closest('[data-ao3-delete-style-preset]')) return handleAction_158();
        if (event_846.target.closest('[data-ao3-select-worldbooks]')) {
            handleAction_137(false);
            if (typeof window.renderWorldBookSelector !== 'function')
                return handleAction_100('World books are unavailable. / 世界书功能未加载');
            window.renderWorldBookSelector(value_14.worldBookIds, (items_851) => {
                if (!value_14) return;
                value_14.worldBookIds = items_851.map(String);
                handleAction_146();
            });
        }
    }
    function handleAction_168(event_852) {
        if (event_852.target.id === 'ao3-imessage-character-select') return handleAction_134();
        if (event_852.target.id === 'ao3-style-preset-select') {
            const value_853 = freeze_8[event_852.target.value],
                result_854 = value_10.stylePresets.find(
                    (value_855) => value_855.id === event_852.target.value,
                );
            if (value_853) {
                value_14.styleKey = event_852.target.value;
                value_14.styleName = value_853.name;
                value_14.styleText = value_853.text;
            } else
                result_854
                    ? ((value_14.styleKey = result_854.id),
                      (value_14.styleName = result_854.name),
                      (value_14.styleText = result_854.text))
                    : ((value_14.styleKey = 'custom'),
                      (value_14.styleName = ''),
                      (value_14.styleText = ''));
            handleAction_131('ao3-style-preset-name').value = value_14.styleName;
            handleAction_131('ao3-style-input').value = value_14.styleText;
        }
    }
    function handleAction_169(event_856) {
        const closest_857 = event_856.target.closest('[data-ao3-toggle-comment-section]');
        if (closest_857) return handleAction_110(closest_857);
        const closest_858 = event_856.target.closest('[data-ao3-toggle-translation]');
        if (closest_858) return handleAction_111(closest_858);
        const closest_859 = event_856.target.closest('[data-ao3-toggle-reply]');
        if (closest_859) return handleAction_112(closest_859);
        const closest_860 = event_856.target.closest('[data-ao3-cancel-reply]');
        if (closest_860) return handleAction_112(closest_860, true);
        const closest_861 = event_856.target.closest('[data-ao3-delete-reply]');
        if (closest_861)
            return handleAction_107(
                closest_861.dataset.workId,
                closest_861.dataset.commentId,
                closest_861.dataset.ao3DeleteReply,
            );
        const closest_862 = event_856.target.closest('[data-ao3-delete-comment]');
        if (closest_862)
            return handleAction_106(
                closest_862.dataset.workId,
                closest_862.dataset.ao3DeleteComment,
            );
        const closest_863 = event_856.target.closest('[data-ao3-delete-chapter]');
        if (closest_863 && !closest_863.disabled)
            return void handleAction_108(closest_863.dataset.ao3DeleteChapter);
        const closest_864 = event_856.target.closest('[data-ao3-delete-work]');
        if (closest_864) return void handleAction_109(closest_864.dataset.ao3DeleteWork);
        const closest_865 = event_856.target.closest('[data-ao3-route]');
        if (closest_865) return navigate_2(closest_865.dataset.ao3Route, {});
        const closest_866 = event_856.target.closest('[data-ao3-open-work]');
        if (closest_866) {
            const workId_2 = closest_866.dataset.ao3OpenWork;
            return navigate_2('work', {
                workId: workId_2,
                chapter: value_10.lastChapterByWork[workId_2] || 1,
            });
        }
        const closest_867 = event_856.target.closest('[data-ao3-search]');
        if (closest_867)
            return navigate_2('search', {
                query: closest_867.dataset.ao3Search || '',
            });
        const closest_868 = event_856.target.closest('[data-ao3-chapter]');
        if (closest_868 && !closest_868.disabled) {
            const handleAction_102_872 = handleAction_102();
            return navigate_2('work', {
                workId: handleAction_102_872.id,
                chapter: handleAction_43(closest_868.dataset.ao3Chapter, handleAction_102_872),
            });
        }
        const closest_869 = event_856.target.closest('[data-ao3-new-chapter]');
        if (closest_869)
            return openComposer_2({
                mode: 'next-chapter',
                workId: closest_869.dataset.ao3NewChapter,
            });
        if (event_856.target.closest('[data-ao3-new-work]'))
            return openComposer_2({
                mode: 'new-work',
            });
        if (event_856.target.closest('[data-ao3-top]'))
            return message_9?.scroll?.scrollTo?.({
                top: 0,
                behavior: 'smooth',
            });
        if (event_856.target.closest('[data-ao3-generate-comments]'))
            return void handleAction_121();
        if (event_856.target.closest('[data-ao3-kudos]')) return handleAction_103();
        if (event_856.target.closest('[data-ao3-download]')) return void handleAction_123();
        if (event_856.target.closest('[data-ao3-edit-profile]')) return handleAction_125();
        const closest_870 = event_856.target.closest('[data-ao3-profile-tab]');
        if (closest_870)
            navigate_2('profile', {
                tab: closest_870.dataset.ao3ProfileTab,
            });
    }
    function handleAction_170(event_873) {
        if (event_873.target.id === 'ao3-page-search-form')
            return (
                event_873.preventDefault(),
                navigate_2(
                    'search',
                    {
                        query:
                            event_873.target.querySelector('#ao3-page-search-input')?.value || '',
                    },
                    {
                        replace: true,
                    },
                )
            );
        event_873.target.id === 'ao3-comment-form' &&
            (event_873.preventDefault(), handleAction_104(event_873.target));
        event_873.target.matches('[data-ao3-reply-form]') &&
            (event_873.preventDefault(), handleAction_105(event_873.target));
    }
    function handleAction_171(event_874) {
        if (event_874.target.matches('[name="reply-text"]')) {
            const dataAo3ReplyErrorElement_877 = event_874.target
                .closest('[data-ao3-reply-form]')
                ?.querySelector('[data-ao3-reply-error]');
            if (dataAo3ReplyErrorElement_877) dataAo3ReplyErrorElement_877.textContent = '';
            return;
        }
        if (event_874.target.id !== 'ao3-comment-input') return;
        const max_875 = Math.max(0, count_4 - event_874.target.value.length),
            ao3CommentCounterElement = document.getElementById('ao3-comment-counter');
        if (ao3CommentCounterElement)
            ao3CommentCounterElement.textContent =
                max_875 + ' characters left / 剩余 ' + max_875 + ' 字符';
        const ao3CommentErrorElement_876 = document.getElementById('ao3-comment-error');
        if (ao3CommentErrorElement_876) ao3CommentErrorElement_876.textContent = '';
    }
    function handleAction_172() {
        if (!message_9?.view || message_9.view.dataset.ao3Bound === 'true') return;
        message_9.view.dataset.ao3Bound = 'true';
        document.getElementById('ao3-exit-button')?.addEventListener('click', close_2);
        message_9.historyBack?.addEventListener('click', handleAction_97);
        document
            .getElementById('ao3-wordmark-button')
            ?.addEventListener('click', () => navigate_2('home'));
        document
            .getElementById('ao3-header-profile-button')
            ?.addEventListener('click', () => navigate_2('profile'));
        document
            .querySelectorAll('[data-ao3-header-route]')
            .forEach((value_878) =>
                value_878.addEventListener('click', () =>
                    navigate_2(value_878.dataset.ao3HeaderRoute),
                ),
            );
        message_9.headerSearch?.addEventListener('submit', (event_879) => {
            event_879.preventDefault();
            navigate_2('search', {
                query: message_9.headerSearchInput?.value || '',
            });
        });
        message_9.content?.addEventListener('click', handleAction_169);
        message_9.content?.addEventListener('submit', handleAction_170);
        message_9.content?.addEventListener('input', handleAction_171);
        document
            .getElementById('ao3-profile-avatar-button')
            ?.addEventListener('click', () => message_9.profileAvatarInput?.click());
        message_9.profileAvatarInput?.addEventListener('change', () => {
            const value_880 = message_9.profileAvatarInput.files?.[0];
            message_9.profileAvatarInput.value = '';
            if (value_880) void handleAction_128(value_880);
        });
        document
            .getElementById('ao3-profile-edit-cancel')
            ?.addEventListener('click', handleAction_126);
        message_9.profileForm?.addEventListener('submit', (event_881) => {
            event_881.preventDefault();
            handleAction_129();
        });
        message_9.profileForm?.addEventListener('keydown', handleAction_59);
        message_9.profileOverlay?.addEventListener('click', (event_882) => {
            if (event_882.target === message_9.profileOverlay) handleAction_126();
        });
        document.getElementById('ao3-composer-close')?.addEventListener('click', () =>
            handleAction_149({
                abort: true,
                preserve: true,
            }),
        );
        document.getElementById('ao3-composer-cancel')?.addEventListener('click', () =>
            handleAction_149({
                abort: true,
                preserve: true,
            }),
        );
        message_9.composerOverlay?.addEventListener('click', (event_883) => {
            if (event_883.target === message_9.composerOverlay)
                handleAction_149({
                    abort: true,
                    preserve: true,
                });
            else handleAction_167(event_883);
        });
        message_9.composerOverlay?.addEventListener('change', handleAction_168);
        message_9.composerOverlay?.addEventListener('input', () => {
            if (message_9.composerError) message_9.composerError.textContent = '';
        });
        message_9.composerForm?.addEventListener('keydown', handleAction_60);
        message_9.composerForm?.addEventListener('submit', (event_884) => {
            event_884.preventDefault();
            void handleAction_166();
        });
        message_9.view.addEventListener('keydown', (value_885) => {
            if (value_885.key !== 'Escape') return;
            if (!message_9.composerOverlay?.hidden)
                handleAction_149({
                    abort: true,
                    preserve: true,
                });
            else {
                if (!message_9.profileOverlay?.hidden) handleAction_126();
                else handleAction_97();
            }
        });
        window.addEventListener('u2:worldbooks-updated', () => {
            if (!message_9.composerOverlay?.hidden) handleAction_146();
        });
        document.addEventListener('imessage-data-ready', () => {
            if (!message_9.composerOverlay?.hidden) handleAction_133();
        });
    }
    function handleDOMContentLoaded() {
        handleAction_54();
        if (!message_9.view) return;
        value_10 = handleAction_39();
        handleAction_64();
        handleAction_94();
        handleAction_172();
        handleAction_61();
        void handleAction_63();
    }
    window.ao3App = {
        open: open_2,
        close: close_2,
        navigate: navigate_2,
        openComposer: openComposer_2,
        getState: () => handleAction_40(value_10),
    };
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', handleDOMContentLoaded, {
            once: true,
        });
    else handleDOMContentLoaded();
})();
