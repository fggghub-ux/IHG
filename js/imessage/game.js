(function (root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.imGame = Object.assign(root.imGame || {}, api);
})(typeof window !== 'undefined' ? window : null, function (root_3) {
    'use strict';

    const MAX_BATCH_SIZE_2 = 10,
        DEFAULT_BATCH_SIZE_2 = 1,
        DEFAULT_CONTEXT_MESSAGE_COUNT_2 = 20,
        count_6 = 50,
        MAX_CONTEXT_CHARS = 36000;
    function cleanText(value_2) {
        return typeof value_2 === 'string' ? value_2.trim() : '';
    }
    function containsChinese(value_3) {
        return /[\u3400-\u9fff]/.test(String(value_3 || ''));
    }
    function clampBatchSize_2(value_23) {
        const int = Number.parseInt(value_23, 10);
        if (!Number.isFinite(int)) return DEFAULT_BATCH_SIZE_2;
        return Math.max(1, Math.min(MAX_BATCH_SIZE_2, int));
    }
    function clampContextMessageCount_2(value_24) {
        const int_25 = Number.parseInt(value_24, 10);
        if (!Number.isFinite(int_25)) return DEFAULT_CONTEXT_MESSAGE_COUNT_2;
        return Math.max(1, Math.min(count_6, int_25));
    }
    function normalizeAnonymousQaEntry_2(entry_2, value_27 = 0) {
        if (!entry_2 || typeof entry_2 !== 'object') return null;
        const question_2 = cleanText(entry_2.question),
            answer_2 = cleanText(entry_2.answer);
        if (!question_2 || !answer_2) return null;
        const createdAt_2 = Math.max(0, Number(entry_2.createdAt) || 0);
        return {
            id:
                cleanText(entry_2.id) ||
                'anonymous-qa-' + (createdAt_2 || Date.now()) + '-' + value_27,
            source: entry_2.source === 'generated' ? 'generated' : 'manual',
            question: question_2,
            answer: answer_2,
            answerTranslationZh:
                cleanText(entry_2.answerTranslationZh) === answer_2
                    ? ''
                    : cleanText(entry_2.answerTranslationZh),
            createdAt: createdAt_2 || Date.now(),
        };
    }
    function normalizeAnonymousQaData_2(value_4) {
        const source_2 = value_4 && typeof value_4 === 'object' ? value_4 : {};
        return {
            entries: (Array.isArray(source_2.entries) ? source_2.entries : [])
                .map(normalizeAnonymousQaEntry_2)
                .filter(Boolean)
                .sort((a, b) => a.createdAt - b.createdAt),
        };
    }
    function removeAnonymousQaEntry_2(value_33, value_34) {
        const normalized = normalizeAnonymousQaData_2(value_33),
            safeEntryId = cleanText(value_34),
            entries_2 = normalized.entries.filter((entry) => entry.id !== safeEntryId);
        return {
            data: {
                entries: entries_2,
            },
            removed: !!safeEntryId && entries_2.length !== normalized.entries.length,
        };
    }
    function getEligibleCharacters_2(friends_2) {
        return (Array.isArray(friends_2) ? friends_2 : []).filter(
            (friend_2) => friend_2 && friend_2.type === 'char',
        );
    }
    function extractResponseContent_2(data_2) {
        const choice = Array.isArray(data_2?.choices) ? data_2.choices[0] : null,
            content_2 = choice?.message?.content ?? choice?.text ?? choice?.delta?.content ?? '';
        return Array.isArray(content_2)
            ? content_2.map((item) => (typeof item === 'string' ? item : item?.text || '')).join('')
            : String(content_2 || '');
    }
    function handleAction_15(raw) {
        const text_2 = String(raw || '')
            .trim()
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();
        if (!text_2) throw new Error('API 没有返回匿名问答内容');
        try {
            return JSON.parse(text_2);
        } catch (value_42) {
            const arrayStart = text_2.indexOf('['),
                arrayEnd = text_2.lastIndexOf(']');
            if (arrayStart >= 0 && arrayEnd > arrayStart)
                return JSON.parse(text_2.slice(arrayStart, arrayEnd + 1));
            const objectStart = text_2.indexOf('{'),
                objectEnd = text_2.lastIndexOf('}');
            if (objectStart >= 0 && objectEnd > objectStart)
                return JSON.parse(text_2.slice(objectStart, objectEnd + 1));
            throw new Error('API 返回的匿名问答不是合法 JSON');
        }
    }
    function parseAnonymousQaResponse_2(value_47, options = {}) {
        const source_3 = options.source === 'generated' ? 'generated' : 'manual',
            expectedCount_2 =
                source_3 === 'generated' ? clampBatchSize_2(options.expectedCount) : 1,
            hasLanguageHint = cleanText(options.answerLanguage) !== '',
            answerUsesChinese = hasLanguageHint
                ? /^zh(?:-|_|$)/i.test(cleanText(options.answerLanguage))
                : null,
            parsed = handleAction_15(value_47),
            list = Array.isArray(parsed) ? parsed : [parsed];
        if (list.length !== expectedCount_2)
            throw new Error(
                'API 应返回 ' + expectedCount_2 + ' 条问答，实际返回 ' + list.length + ' 条',
            );
        const baseTime = Math.max(1, Number(options.now) || Date.now());
        return list.map((item_2, value_57) => {
            const question_3 =
                    source_3 === 'manual'
                        ? cleanText(options.question)
                        : cleanText(item_2?.question),
                answer_3 = cleanText(item_2?.answer);
            if (!question_3 || !answer_3)
                throw new Error('第 ' + (value_57 + 1) + ' 条问答缺少问题或回答');
            const anonymousQaEntry_10 = normalizeAnonymousQaEntry_2(
                    {
                        id: 'anonymous-qa-' + baseTime + '-' + value_57,
                        source: source_3,
                        question: question_3,
                        answer: answer_3,
                        answerTranslationZh:
                            answerUsesChinese === true ? '' : item_2?.answerTranslationZh,
                        createdAt: baseTime + value_57,
                    },
                    value_57,
                ),
                needsTranslation =
                    answerUsesChinese === false ||
                    (answerUsesChinese === null && !containsChinese(answer_3));
            if (needsTranslation && !anonymousQaEntry_10.answerTranslationZh)
                throw new Error('第 ' + (value_57 + 1) + ' 条非中文回答缺少中文翻译');
            return anonymousQaEntry_10;
        });
    }
    function escapeHtml(value_5) {
        return String(value_5 ?? '').replace(
            /[&<>"']/g,
            (character) =>
                ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                })[character],
        );
    }
    function entryText(entry_3) {
        if (typeof entry_3 === 'string') return entry_3.trim();
        if (!entry_3 || typeof entry_3 !== 'object') return '';
        return cleanText(
            entry_3.content ||
                entry_3.text ||
                entry_3.summary ||
                entry_3.note ||
                entry_3.description ||
                entry_3.title,
        );
    }
    function formatMemoryList(entries_3) {
        return (Array.isArray(entries_3) ? entries_3 : []).map(entryText).filter(Boolean).join(`
`);
    }
    function formatRecentMessages_2(
        friend_3,
        userName,
        value_66 = DEFAULT_CONTEXT_MESSAGE_COUNT_2,
    ) {
        const messages_2 = Array.isArray(friend_3?.messages) ? friend_3.messages : [],
            limit = clampContextMessageCount_2(value_66),
            charName = friend_3?.nickname || friend_3?.realName || 'Char';
        return messages_2
            .filter(
                (message_2) =>
                    message_2 && (message_2.role === 'user' || message_2.role === 'assistant'),
            )
            .slice(-limit)
            .map((message_3) => {
                const speaker = message_3.role === 'user' ? userName : charName,
                    value_73 =
                        message_3.type === 'image'
                            ? '[图片：' +
                              (message_3.description || message_3.text || '无描述') +
                              ']'
                            : cleanText(
                                  message_3.content || message_3.text || message_3.transcript,
                              );
                return value_73 ? speaker + ': ' + value_73 : '';
            })
            .filter(Boolean)
            .join(
                `
`,
            )
            .slice(-12000);
    }
    function buildAnonymousQaContext_2(friend_4, value_74 = {}) {
        const memory_2 =
                friend_4?.memory && typeof friend_4.memory === 'object' ? friend_4.memory : {},
            relationships_2 = (Array.isArray(memory_2.relationships) ? memory_2.relationships : [])
                .map((item_3) => {
                    if (!item_3 || typeof item_3 !== 'object') return '';
                    return [
                        item_3.name || item_3.nickname || item_3.personName || item_3.friendId,
                        item_3.relation || item_3.relationship,
                    ]
                        .filter(Boolean)
                        .join(': ');
                })
                .filter(Boolean).join(`
`),
            sections = [
                '角色姓名：' + (friend_4?.nickname || friend_4?.realName || 'Char'),
                '真实姓名：' + (friend_4?.realName || '未填写'),
                '角色默认语言：' + (friend_4?.language || 'zh'),
                `核心人设：
` + (friend_4?.persona || '未填写'),
                `与 User 的关系：
` + (friend_4?.relationship || '未填写'),
                `记忆概要：
` + (memory_2.overview || '无'),
                `长期记忆：
` + (memory_2.longTerm || formatMemoryList(memory_2.longTermEntries) || '无'),
                `短期记忆：
` + (formatMemoryList(memory_2.shortTermEntries) || '无'),
                `珍视记忆：
` + (memory_2.cherished || formatMemoryList(memory_2.cherishedEntries) || '无'),
                `关系网络：
` + (relationships_2 || '无'),
                `最近聊天（仅用于保持当前性格与剧情连续性）：
` + (value_74.recentChat || '无'),
                value_74.worldBookContext
                    ? `当前生效的世界书：
` + value_74.worldBookContext
                    : '',
            ].filter(Boolean);
        return sections
            .join(
                `

`,
            )
            .slice(0, MAX_CONTEXT_CHARS);
    }
    function createViewMarkup() {
        return `
            <section class="app-view im-anonymous-qa-view" id="im-anonymous-qa-view" aria-label="匿名问答">
                <header class="im-game-header">
                    <button type="button" class="im-game-back" id="im-anonymous-qa-back" aria-label="返回 App Store"><i class="fas fa-chevron-left"></i></button>
                    <div class="im-game-header-title">匿名问答</div>
                    <button type="button" class="im-game-add" id="im-anonymous-composer-open" aria-label="新建匿名问答" title="新建匿名问答"><i class="fas fa-plus"></i></button>
                </header>
                <main class="im-anonymous-qa-scroll">
                    <section class="im-anonymous-panel im-anonymous-character-panel">
                        <div class="im-anonymous-character-title">选择 Char</div>
                        <div class="im-anonymous-character-bar" id="im-anonymous-character-bar" role="listbox" aria-label="选择已有 Char"></div>
                    </section>
                    <div class="im-anonymous-status" id="im-anonymous-status" role="status" aria-live="polite"></div>
                    <section class="im-anonymous-history-section">
                        <div class="im-anonymous-history-heading"><h2>问答记录</h2><span id="im-anonymous-history-count">0</span></div>
                        <div class="im-anonymous-history" id="im-anonymous-history"></div>
                    </section>
                </main>
                <div class="im-anonymous-composer-overlay" id="im-anonymous-composer-overlay" aria-hidden="true">
                    <section class="im-anonymous-composer" role="dialog" aria-modal="true" aria-labelledby="im-anonymous-composer-title">
                        <header class="im-anonymous-composer-header">
                            <div><small>ANONYMOUS Q&amp;A</small><h2 id="im-anonymous-composer-title">新建匿名问答</h2></div>
                            <button type="button" id="im-anonymous-composer-close" aria-label="关闭"><i class="fas fa-times"></i></button>
                        </header>
                        <div class="im-anonymous-mode-tabs" role="tablist" aria-label="选择问答方式">
                            <button type="button" class="is-active" data-anonymous-mode="manual" role="tab" aria-selected="true">匿名提问</button>
                            <button type="button" data-anonymous-mode="generated" role="tab" aria-selected="false">生成匿名来信</button>
                        </div>
                        <div class="im-anonymous-context-control" id="im-anonymous-context-control">
                            <div class="im-anonymous-context-copy"><strong>挂载聊天上下文</strong><small>默认最近 20 条，世界书始终挂载</small></div>
                            <div class="im-anonymous-context-options">
                                <label class="im-anonymous-context-switch" for="im-anonymous-context-enabled" title="是否挂载最近聊天上下文">
                                    <input id="im-anonymous-context-enabled" type="checkbox" checked aria-label="挂载最近聊天上下文">
                                    <span aria-hidden="true"></span>
                                </label>
                                <label class="im-anonymous-context-count-field" for="im-anonymous-context-count"><input id="im-anonymous-context-count" type="number" inputmode="numeric" min="1" max="50" step="1" value="20" aria-label="挂载聊天上下文条数"><em>条</em></label>
                            </div>
                        </div>
                        <div class="im-anonymous-mode-panel is-active" data-anonymous-panel="manual" role="tabpanel">
                            <div class="im-anonymous-section-title"><span>写下问题</span><small>TA 不会知道提问者是你</small></div>
                            <textarea id="im-anonymous-question" maxlength="500" rows="4" placeholder="写下你想匿名问 TA 的问题…"></textarea>
                            <button type="button" class="im-anonymous-primary" id="im-anonymous-ask">匿名提问</button>
                        </div>
                        <div class="im-anonymous-mode-panel" data-anonymous-panel="generated" role="tabpanel" hidden>
                            <div class="im-anonymous-section-title"><span>生成匿名来信</span><small>模拟其他匿名访客向 TA 提问并生成回答</small></div>
                            <div class="im-anonymous-generate-row">
                                <label for="im-anonymous-count">数量</label>
                                <input id="im-anonymous-count" type="number" inputmode="numeric" min="1" max="10" step="1" value="1">
                            </div>
                            <button type="button" class="im-anonymous-primary" id="im-anonymous-generate">生成问答</button>
                        </div>
                        <div class="im-anonymous-modal-status" id="im-anonymous-modal-status" role="status" aria-live="polite"></div>
                    </section>
                </div>
            </section>`;
    }
    function initializeBrowserGame_2() {
        if (!root_3?.document || root_3.document.getElementById('im-anonymous-qa-view')) return;
        const app = root_3.document.getElementById('app');
        if (!app) return;
        app.insertAdjacentHTML('beforeend', createViewMarkup());
        const elements = {
                qaView: root_3.document.getElementById('im-anonymous-qa-view'),
                qaBack: root_3.document.getElementById('im-anonymous-qa-back'),
                composerOpen: root_3.document.getElementById('im-anonymous-composer-open'),
                composerOverlay: root_3.document.getElementById('im-anonymous-composer-overlay'),
                composerClose: root_3.document.getElementById('im-anonymous-composer-close'),
                modeButtons: Array.from(root_3.document.querySelectorAll('[data-anonymous-mode]')),
                modePanels: Array.from(root_3.document.querySelectorAll('[data-anonymous-panel]')),
                characterBar: root_3.document.getElementById('im-anonymous-character-bar'),
                question: root_3.document.getElementById('im-anonymous-question'),
                contextControl: root_3.document.getElementById('im-anonymous-context-control'),
                contextEnabled: root_3.document.getElementById('im-anonymous-context-enabled'),
                contextCount: root_3.document.getElementById('im-anonymous-context-count'),
                ask: root_3.document.getElementById('im-anonymous-ask'),
                count: root_3.document.getElementById('im-anonymous-count'),
                generate: root_3.document.getElementById('im-anonymous-generate'),
                status: root_3.document.getElementById('im-anonymous-status'),
                modalStatus: root_3.document.getElementById('im-anonymous-modal-status'),
                history: root_3.document.getElementById('im-anonymous-history'),
                historyCount: root_3.document.getElementById('im-anonymous-history-count'),
            },
            state = {
                selectedFriendId: '',
                inFlight: false,
                composerMode: 'manual',
            };
        function getCharacters() {
            return getEligibleCharacters_2(root_3.imData?.friends);
        }
        function getSelectedFriend() {
            return (
                getCharacters().find(
                    (friend_5) => String(friend_5.id) === String(state.selectedFriendId),
                ) || null
            );
        }
        function setStatus(textContent_2 = '', tone_2 = '') {
            elements.status.textContent = textContent_2;
            elements.status.dataset.tone = tone_2;
        }
        function setModalStatus(textContent_3 = '', tone_3 = '') {
            elements.modalStatus.textContent = textContent_3;
            elements.modalStatus.dataset.tone = tone_3;
        }
        function setComposerMode(mode) {
            state.composerMode = mode === 'generated' ? 'generated' : 'manual';
            elements.modeButtons.forEach((button) => {
                const active = button.dataset.anonymousMode === state.composerMode;
                button.classList.toggle('is-active', active);
                button.setAttribute('aria-selected', String(active));
            });
            elements.modePanels.forEach((panel) => {
                const active_2 = panel.dataset.anonymousPanel === state.composerMode;
                panel.classList.toggle('is-active', active_2);
                panel.hidden = !active_2;
            });
            setModalStatus('');
        }
        function openComposer_2() {
            if (state.inFlight) return;
            if (!getSelectedFriend()) return setStatus('请先添加并选择一个 Char', 'error');
            setComposerMode('manual');
            elements.composerOverlay.classList.add('is-active');
            elements.composerOverlay.setAttribute('aria-hidden', 'false');
            setStatus('');
            elements.question.focus({
                preventScroll: true,
            });
        }
        function closeComposer(force = false) {
            if (state.inFlight && !force) return;
            elements.composerOverlay.classList.remove('is-active');
            elements.composerOverlay.setAttribute('aria-hidden', 'true');
            setModalStatus('');
            elements.composerOpen.focus({
                preventScroll: true,
            });
        }
        function syncContextControlState() {
            const enabled = !!elements.contextEnabled.checked;
            elements.contextControl.classList.toggle('is-disabled', !enabled);
            elements.contextCount.disabled = state.inFlight || !enabled;
        }
        function setBusy(disabled_2, label = '') {
            state.inFlight = !!disabled_2;
            elements.composerOpen.disabled = disabled_2;
            elements.ask.disabled = disabled_2;
            elements.generate.disabled = disabled_2;
            elements.composerClose.disabled = disabled_2;
            elements.modeButtons.forEach((button_2) => {
                button_2.disabled = disabled_2;
            });
            elements.characterBar.dataset.busy = disabled_2 ? 'true' : 'false';
            elements.characterBar.querySelectorAll('button').forEach((button_3) => {
                button_3.disabled = disabled_2;
            });
            elements.count.disabled = disabled_2;
            elements.contextEnabled.disabled = disabled_2;
            syncContextControlState();
            elements.question.disabled = disabled_2;
            elements.ask.textContent = disabled_2 && label === 'manual' ? '正在回答…' : '匿名提问';
            elements.generate.textContent =
                disabled_2 && label === 'generated' ? '正在生成…' : '生成问答';
        }
        function renderHistory() {
            const friend_6 = getSelectedFriend();
            if (!friend_6) {
                elements.historyCount.textContent = '0';
                elements.history.innerHTML =
                    '<div class="im-anonymous-empty">添加 Char 后即可开始匿名问答</div>';
                return;
            }
            const entries_4 = normalizeAnonymousQaData_2(friend_6.anonymousQa)
                .entries.slice()
                .reverse();
            elements.historyCount.textContent = String(entries_4.length);
            if (!entries_4.length) {
                elements.history.innerHTML =
                    '<div class="im-anonymous-empty">还没有问答记录<br><span>发送第一封匿名来信吧</span></div>';
                return;
            }
            elements.history.innerHTML = entries_4
                .map((entry_4) => {
                    const date = new Date(entry_4.createdAt),
                        time = Number.isNaN(date.getTime())
                            ? ''
                            : date.toLocaleString('zh-CN', {
                                  month: 'numeric',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                              });
                    return (
                        `<article class="im-anonymous-entry">
                    <div class="im-anonymous-entry-meta">
                        <span><i class="fas fa-user-secret"></i> 匿名来信</span>
                        <div class="im-anonymous-entry-actions">
                            <time>` +
                        escapeHtml(time) +
                        `</time>
                            <button type="button" class="im-anonymous-delete" data-anonymous-delete-id="` +
                        escapeHtml(entry_4.id) +
                        `" aria-label="删除这条问答" title="删除"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                    <div class="im-anonymous-question-copy">` +
                        escapeHtml(entry_4.question) +
                        `</div>
                    <div class="im-anonymous-answer-label">` +
                        escapeHtml(friend_6.nickname || friend_6.realName || 'Char') +
                        ` 的回答</div>
                    <div class="im-anonymous-answer-copy">` +
                        escapeHtml(entry_4.answer) +
                        `</div>
                    ` +
                        (entry_4.answerTranslationZh
                            ? '<div class="im-anonymous-translation"><span>译</span>' +
                              escapeHtml(entry_4.answerTranslationZh) +
                              '</div>'
                            : '') +
                        `
                </article>`
                    );
                })
                .join('');
        }
        async function refreshCharacters() {
            if (root_3.imApp?.ensureDataReady && !root_3.imData?.ready)
                await root_3.imApp.ensureDataReady();
            const characters = getCharacters(),
                previous = String(state.selectedFriendId || ''),
                selected =
                    characters.find((friend_7) => String(friend_7.id) === previous) ||
                    characters[0] ||
                    null;
            state.selectedFriendId = selected ? String(selected.id) : '';
            elements.characterBar.innerHTML = characters.length
                ? characters
                      .map((friend_8) => {
                          const name_2 = friend_8.nickname || friend_8.realName || '未命名 Char',
                              isActive = String(friend_8.id) === state.selectedFriendId,
                              value_102 = friend_8.avatarUrl
                                  ? '<img src="' + escapeHtml(friend_8.avatarUrl) + '" alt="">'
                                  : '<span>' +
                                    escapeHtml(name_2.slice(0, 1).toUpperCase()) +
                                    '</span>';
                          return (
                              '<button type="button" class="im-anonymous-char-choice' +
                              (isActive ? ' is-active' : '') +
                              '" data-anonymous-char-id="' +
                              escapeHtml(friend_8.id) +
                              '" role="option" aria-selected="' +
                              isActive +
                              '" aria-label="选择 ' +
                              escapeHtml(name_2) +
                              '" ' +
                              (state.inFlight ? 'disabled' : '') +
                              `>
                        <span class="im-anonymous-char-ring"><span class="im-anonymous-char-avatar">` +
                              value_102 +
                              `</span></span>
                        <span class="im-anonymous-char-name">` +
                              escapeHtml(name_2) +
                              `</span>
                    </button>`
                          );
                      })
                      .join('')
                : '<div class="im-anonymous-empty-inline">暂无可用 Char，请先在 iMessage 添加 Char。</div>';
            elements.characterBar.dataset.busy = state.inFlight ? 'true' : 'false';
            elements.ask.disabled = state.inFlight || !characters.length;
            elements.generate.disabled = state.inFlight || !characters.length;
            renderHistory();
        }
        async function buildRequestContext(
            friend_9,
            seedText,
            contextMessageCount,
            includeRecentChat = true,
        ) {
            if (root_3.imApp?.ensureFriendMessagesLoaded)
                await root_3.imApp.ensureFriendMessagesLoaded(friend_9);
            const latestFriend = root_3.imApp?.getFriendById?.(friend_9.id) || friend_9,
                userState_2 = root_3.getUserState?.() || root_3.userState || {},
                recentChat_2 = includeRecentChat
                    ? formatRecentMessages_2(
                          latestFriend,
                          userState_2.name || 'User',
                          contextMessageCount,
                      )
                    : '',
                worldBookTriggerContext = [seedText, recentChat_2].filter(Boolean).join(`
`),
                worldBookContext_2 = ['before_role', 'after_role', 'system_depth']
                    .map(
                        (position) =>
                            root_3.getWorldBookContextForFriendByPosition?.(
                                position,
                                latestFriend,
                                worldBookTriggerContext,
                            ) || '',
                    )
                    .filter(Boolean).join(`

`);
            return {
                friend: latestFriend,
                context: buildAnonymousQaContext_2(latestFriend, {
                    recentChat: recentChat_2,
                    worldBookContext: worldBookContext_2,
                }),
            };
        }
        async function requestAnonymousQa(
            friend_10,
            mode_2,
            expectedCount_3,
            question_4,
            contextMessageCount_2,
            includeRecentChat_2 = true,
        ) {
            const apiConfig_2 = root_3.getApiConfig?.() || root_3.apiConfig || {},
                endpoint_2 = root_3.u2Api?.resolveChatCompletionsEndpoint?.(
                    apiConfig_2.endpoint || '',
                );
            if (!endpoint_2 || !apiConfig_2.apiKey || !apiConfig_2.model)
                throw new Error('请先在设置中完成 API 配置');
            const prepared = await buildRequestContext(
                    friend_10,
                    question_4 || '匿名问答',
                    contextMessageCount_2,
                    includeRecentChat_2,
                ),
                charName_2 = prepared.friend.nickname || prepared.friend.realName || 'Char',
                value_119 = prepared.friend.language || 'zh',
                value_120 =
                    mode_2 === 'manual'
                        ? '匿名访客提交的问题是：' +
                          question_4 +
                          `
只回答这个问题。返回一个 JSON 对象。question 字段原样写入该问题。`
                        : '生成恰好 ' +
                          expectedCount_3 +
                          ' 条来自不同匿名访客的问题，并由 ' +
                          charName_2 +
                          ' 分别回答。问题使用自然简体中文，避免重复。返回恰好 ' +
                          expectedCount_3 +
                          ' 个对象组成的 JSON 数组。',
                value_121 =
                    '你正在为匿名问答游戏扮演 ' +
                    charName_2 +
                    `。

` +
                    prepared.context +
                    `

规则：
1. 提问者是身份未知的匿名访客，绝对不能认定、暗示或猜测提问者就是 User。
2. 匿名问答不是聊天中已经发生的事件，不要把它写成对最近聊天的直接续句。最近聊天只用于保持性格、关系阶段和口吻一致。
3. 回答必须符合角色人设，使用角色默认语言 ` +
                    value_119 +
                    `。
4. question 必须使用简体中文。
5. answerTranslationZh：answer 非中文时填写自然准确的简体中文翻译；answer 为中文时必须为空字符串。
6. 只返回合法 JSON，不要 Markdown、代码围栏或解释。
7. 每个对象格式严格为 {"question":"问题","answer":"角色回答原文","answerTranslationZh":"中文翻译或空字符串"}。`,
                controller = new AbortController(),
                timeout = setTimeout(() => controller.abort(), 90000);
            try {
                const headers_2 = root_3.u2Api?.buildApiHeaders
                        ? root_3.u2Api.buildApiHeaders(apiConfig_2, {
                              'X-U2-Silent-Errors': '1',
                          })
                        : {
                              'Content-Type': 'application/json',
                              Authorization: 'Bearer ' + apiConfig_2.apiKey,
                              'X-U2-Silent-Errors': '1',
                          },
                    response = await fetch(endpoint_2, {
                        method: 'POST',
                        headers: headers_2,
                        body: JSON.stringify({
                            model: apiConfig_2.model,
                            temperature: Number.isFinite(Number(apiConfig_2.temperature))
                                ? Number(apiConfig_2.temperature)
                                : 0.8,
                            messages: [
                                {
                                    role: 'system',
                                    content: value_121,
                                },
                                {
                                    role: 'user',
                                    content: value_120,
                                },
                            ],
                        }),
                        signal: controller.signal,
                    });
                if (!response.ok) {
                    const detail = root_3.u2Api?.readApiError
                        ? await root_3.u2Api.readApiError(response)
                        : null;
                    throw (
                        root_3.u2Api?.createHttpError?.(response, detail) ||
                        Object.assign(
                            new Error(
                                detail?.message || 'API 请求失败（HTTP ' + response.status + '）',
                            ),
                            {
                                status: response.status,
                            },
                        )
                    );
                }
                const data_3 = await response.json();
                return parseAnonymousQaResponse_2(extractResponseContent_2(data_3), {
                    source: mode_2 === 'generated' ? 'generated' : 'manual',
                    expectedCount: expectedCount_3,
                    question: question_4,
                    answerLanguage: value_119,
                });
            } catch (value_127) {
                if (value_127?.name === 'AbortError')
                    throw Object.assign(new Error('匿名问答生成超时，请稍后重试'), {
                        name: 'TimeoutError',
                    });
                throw value_127;
            } finally {
                clearTimeout(timeout);
            }
        }
        async function persistEntries(friendId_2, entries_5) {
            if (!root_3.imApp?.commitFriendChange) throw new Error('匿名问答存储暂不可用');
            const saved = await root_3.imApp.commitFriendChange(
                friendId_2,
                (targetFriend) => {
                    if (!targetFriend || targetFriend.type !== 'char')
                        throw new Error('所选 Char 已不存在');
                    const current = normalizeAnonymousQaData_2(targetFriend.anonymousQa);
                    targetFriend.anonymousQa = {
                        entries: [...current.entries, ...entries_5],
                    };
                },
                {
                    metaOnly: true,
                    includeMessages: false,
                    silent: true,
                },
            );
            if (!saved) throw new Error('问答保存失败，本次结果未写入');
        }
        async function deleteEntry_2(entryId) {
            if (state.inFlight) return;
            const friend_11 = getSelectedFriend();
            if (!friend_11) return setStatus('所选 Char 已不存在', 'error');
            const runDelete = async () => {
                setBusy(true);
                setStatus('正在删除问答记录…', 'loading');
                try {
                    if (!root_3.imApp?.commitFriendChange) throw new Error('匿名问答存储暂不可用');
                    const saved_2 = await root_3.imApp.commitFriendChange(
                        friend_11.id,
                        (targetFriend_2) => {
                            if (!targetFriend_2 || targetFriend_2.type !== 'char')
                                throw new Error('所选 Char 已不存在');
                            const result = removeAnonymousQaEntry_2(
                                targetFriend_2.anonymousQa,
                                entryId,
                            );
                            if (!result.removed) throw new Error('这条问答记录已不存在');
                            targetFriend_2.anonymousQa = result.data;
                        },
                        {
                            metaOnly: true,
                            includeMessages: false,
                            silent: true,
                        },
                    );
                    if (!saved_2) throw new Error('删除保存失败，问答记录已恢复');
                    renderHistory();
                    setStatus('已删除这条问答记录', 'success');
                } catch (error_2) {
                    console.error('[iMessage Game] delete anonymous Q&A failed', error_2);
                    setStatus(error_2?.message || '问答记录删除失败', 'error');
                } finally {
                    setBusy(false);
                    await refreshCharacters();
                }
            };
            if (typeof root_3.showCustomModal === 'function') {
                root_3.showCustomModal({
                    title: '删除问答记录',
                    message: '确定删除这条匿名问答吗？删除后无法恢复。',
                    confirmText: '删除',
                    cancelText: '取消',
                    isDestructive: true,
                    onConfirm: runDelete,
                });
                return;
            }
            if (root_3.confirm?.('确定删除这条匿名问答吗？删除后无法恢复。')) await runDelete();
        }
        async function runGeneration(mode_3) {
            if (state.inFlight) return;
            const friend_12 = getSelectedFriend();
            if (!friend_12) return setModalStatus('请先添加并选择一个 Char', 'error');
            const question_5 = cleanText(elements.question.value);
            if (mode_3 === 'manual' && !question_5)
                return setModalStatus('请先输入匿名问题', 'error');
            const count_2 = mode_3 === 'generated' ? clampBatchSize_2(elements.count.value) : 1,
                contextMessageCount_3 = clampContextMessageCount_2(elements.contextCount.value),
                includeRecentChat_3 = elements.contextEnabled.checked;
            elements.count.value = String(count_2);
            elements.contextCount.value = String(contextMessageCount_3);
            setBusy(true, mode_3);
            setStatus('');
            setModalStatus(
                mode_3 === 'manual'
                    ? '匿名来信已送达，正在等待回答…'
                    : '正在生成 ' + count_2 + ' 条匿名问答…',
                'loading',
            );
            let succeeded = false;
            try {
                const entries_6 = await requestAnonymousQa(
                    friend_12,
                    mode_3,
                    count_2,
                    question_5,
                    contextMessageCount_3,
                    includeRecentChat_3,
                );
                await persistEntries(friend_12.id, entries_6);
                if (mode_3 === 'manual') elements.question.value = '';
                renderHistory();
                setStatus('已保存 ' + entries_6.length + ' 条匿名问答', 'success');
                succeeded = true;
            } catch (error_3) {
                console.error('[iMessage Game] anonymous Q&A failed', error_3);
                (!root_3.u2Api?.isRequestError?.(error_3) ||
                    !root_3.u2Api.reportError(error_3, {
                        operation: '匿名问答生成',
                    })) &&
                    setModalStatus(error_3?.message || '匿名问答生成失败，请稍后重试', 'error');
            } finally {
                setBusy(false);
                await refreshCharacters();
                if (succeeded) closeComposer(true);
            }
        }
        async function openAnonymousQa_2() {
            await refreshCharacters();
            setStatus('');
            root_3.openView?.(elements.qaView);
        }
        elements.qaBack.addEventListener('click', () => {
            closeComposer(true);
            root_3.closeView?.(elements.qaView);
        });
        elements.composerOpen.addEventListener('click', openComposer_2);
        elements.composerClose.addEventListener('click', () => closeComposer());
        elements.composerOverlay.addEventListener('click', (event) => {
            if (event.target === elements.composerOverlay) closeComposer();
        });
        elements.modeButtons.forEach((button_4) => {
            button_4.addEventListener('click', () =>
                setComposerMode(button_4.dataset.anonymousMode),
            );
        });
        elements.characterBar.addEventListener('click', (event_2) => {
            const button_5 = event_2.target.closest?.('[data-anonymous-char-id]');
            if (!button_5 || state.inFlight) return;
            state.selectedFriendId = button_5.dataset.anonymousCharId;
            setStatus('');
            void refreshCharacters();
        });
        elements.count.addEventListener('change', () => {
            elements.count.value = String(clampBatchSize_2(elements.count.value));
        });
        elements.contextCount.addEventListener('change', () => {
            elements.contextCount.value = String(
                clampContextMessageCount_2(elements.contextCount.value),
            );
        });
        elements.contextEnabled.addEventListener('change', syncContextControlState);
        elements.ask.addEventListener('click', () => void runGeneration('manual'));
        elements.generate.addEventListener('click', () => void runGeneration('generated'));
        elements.history.addEventListener('click', (event_3) => {
            const button_6 = event_3.target.closest?.('[data-anonymous-delete-id]');
            if (!button_6) return;
            event_3.preventDefault();
            void deleteEntry_2(button_6.dataset.anonymousDeleteId);
        });
        root_3.document.addEventListener('keydown', (event_4) => {
            if (
                event_4.key === 'Escape' &&
                elements.composerOverlay.classList.contains('is-active')
            )
                closeComposer();
        });
        Object.assign(root_3.imGame, {
            openAnonymousQa: openAnonymousQa_2,
            openComposer: openComposer_2,
            render: refreshCharacters,
            generate: runGeneration,
            deleteEntry: deleteEntry_2,
        });
    }
    if (root_3?.document) {
        const onStorageReady =
            root_3.u2OnStorageReady ||
            ((callback) => root_3.document.addEventListener('DOMContentLoaded', callback));
        onStorageReady(initializeBrowserGame_2);
    }
    return {
        MAX_BATCH_SIZE: MAX_BATCH_SIZE_2,
        DEFAULT_BATCH_SIZE: DEFAULT_BATCH_SIZE_2,
        DEFAULT_CONTEXT_MESSAGE_COUNT: DEFAULT_CONTEXT_MESSAGE_COUNT_2,
        clampBatchSize: clampBatchSize_2,
        clampContextMessageCount: clampContextMessageCount_2,
        normalizeAnonymousQaEntry: normalizeAnonymousQaEntry_2,
        normalizeAnonymousQaData: normalizeAnonymousQaData_2,
        removeAnonymousQaEntry: removeAnonymousQaEntry_2,
        getEligibleCharacters: getEligibleCharacters_2,
        extractResponseContent: extractResponseContent_2,
        parseAnonymousQaResponse: parseAnonymousQaResponse_2,
        buildAnonymousQaContext: buildAnonymousQaContext_2,
        formatRecentMessages: formatRecentMessages_2,
        initializeBrowserGame: initializeBrowserGame_2,
    };
});
