(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    window.imChat = window.imChat || {};
    const imChat_3 = window.imChat,
        FAKE_LINK_CONTEXT_OPTIONS_KEY = 'u2_fakeLinkAiContextOptions',
        text_3 = 'picsum.photos',
        value_4 = new Set([text_3, 'fastly.picsum.photos']),
        DEFAULT_RECENT_CONTEXT_LIMIT = 10,
        MAX_RECENT_CONTEXT_LIMIT = 50,
        fakeLinkSessions = new Map();
    function cleanText(value_2, maxLength = 50000) {
        return String(value_2 == null ? '' : value_2)
            .replace(/\u0000/g, '')
            .trim()
            .slice(0, maxLength);
    }
    function escapeHtml(value_3) {
        return String(value_3 == null ? '' : value_3)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    function stripHtmlToPlainText(value_5, maxLength_2 = 20000) {
        return cleanText(value_5, 50000)
            .replace(
                /<\s*(script|style|iframe|object|embed|svg|canvas)[\s\S]*?<\s*\/\s*\1\s*>/gi,
                ' ',
            )
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')
            .replace(/&quot;/gi, '"')
            .replace(/&#039;/gi, "'")
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, maxLength_2);
    }
    function hashFakeLinkSeed(value_6) {
        const text_2 = String(value_6 == null ? '' : value_6);
        let hash = 2166136261;
        for (let i = 0; i < text_2.length; i += 1) {
            hash ^= text_2.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0).toString(36);
    }
    function buildRandomFakeLinkImageUrl_2(
        seedParts = [],
        index = 0,
        value_35 = 900,
        value_36 = 600,
    ) {
        const seed = hashFakeLinkSeed([].concat(seedParts, index).join('|')) || 'u2';
        return (
            'https://' + text_3 + '/seed/u2-' + seed + '-' + index + '/' + value_35 + '/' + value_36
        );
    }
    function isAllowedFakeLinkImageUrl_2(value_7) {
        try {
            const parsed_2 = new URL(String(value_7 || ''));
            return parsed_2.protocol === 'https:' && value_4.has(parsed_2.hostname);
        } catch (value_40) {
            return false;
        }
    }
    function injectRandomFakeLinkImages_2(html_2, options_2 = {}) {
        const sourceHtml = cleanText(html_2, 20000);
        if (!sourceHtml) return '';
        const seedParts_2 = [
            cleanText(options_2.domain || '', 180),
            cleanText(options_2.prompt || '', 1000),
            cleanText(options_2.siteName || '', 80),
        ];
        let imageIndex = 0;
        return sourceHtml.replace(/<img\b([^>]*)>/gi, (value_44, attrs = '') => {
            const srcMatch = String(attrs).match(/\s+src\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i),
                currentSrc = srcMatch ? srcMatch[1].replace(/^['"]|['"]$/g, '') : '',
                nextSrc = isAllowedFakeLinkImageUrl_2(currentSrc)
                    ? currentSrc
                    : buildRandomFakeLinkImageUrl_2(seedParts_2, imageIndex);
            imageIndex += 1;
            let nextAttrs = String(attrs)
                .replace(/\s+src\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
                .replace(/\s+srcset\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
                .replace(/\s+loading\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
            if (!/\salt\s*=/i.test(nextAttrs)) nextAttrs += ' alt=""';
            return '<img' + nextAttrs + ' src="' + escapeHtml(nextSrc) + '" loading="lazy">';
        });
    }
    function normalizeRecentContextLimit(value_8) {
        const parsed = Math.round(Number(value_8) || DEFAULT_RECENT_CONTEXT_LIMIT);
        return Math.min(MAX_RECENT_CONTEXT_LIMIT, Math.max(1, parsed));
    }
    function loadFakeLinkContextOptions() {
        const fallback = {
            includeCharPersona: false,
            includeUserPersona: false,
            includeRecentContext: false,
            recentContextLimit: DEFAULT_RECENT_CONTEXT_LIMIT,
        };
        try {
            const loaded =
                window.StorageManager && typeof window.StorageManager.load === 'function'
                    ? window.StorageManager.load(FAKE_LINK_CONTEXT_OPTIONS_KEY, fallback)
                    : null;
            return {
                includeCharPersona: !!loaded?.includeCharPersona,
                includeUserPersona: !!loaded?.includeUserPersona,
                includeRecentContext: !!loaded?.includeRecentContext,
                recentContextLimit: normalizeRecentContextLimit(loaded?.recentContextLimit),
            };
        } catch (_) {
            return fallback;
        }
    }
    function handleAction_8(options_3 = {}) {
        const normalized = {
            includeCharPersona: !!options_3.includeCharPersona,
            includeUserPersona: !!options_3.includeUserPersona,
            includeRecentContext: !!options_3.includeRecentContext,
            recentContextLimit: normalizeRecentContextLimit(options_3.recentContextLimit),
        };
        try {
            window.StorageManager &&
                typeof window.StorageManager.save === 'function' &&
                window.StorageManager.save(FAKE_LINK_CONTEXT_OPTIONS_KEY, normalized);
        } catch (value_52) {}
        return normalized;
    }
    function getFakeLinkAppContainer() {
        return document.getElementById('app') || document.body;
    }
    function focusFakeLinkControl(element) {
        if (!element || typeof element.focus !== 'function') return;
        try {
            element.focus({
                preventScroll: true,
            });
        } catch (__2) {
            element.focus();
        }
    }
    function resolveFakeLinkWorldBookContext(friend_2, contextText = '') {
        const positions = ['system_depth', 'before_role', 'after_role'],
            sections = [];
        return (
            positions.forEach((position) => {
                let text_4 = '';
                if (friend_2 && window.imApp?.getWorldBookContextForFriendByPosition)
                    text_4 =
                        window.imApp.getWorldBookContextForFriendByPosition(
                            position,
                            friend_2,
                            contextText,
                        ) || '';
                else
                    window.getGlobalWorldBookContextByPosition &&
                        (text_4 =
                            window.getGlobalWorldBookContextByPosition(position, contextText) ||
                            '');
                if (text_4)
                    sections.push(
                        position +
                            `:
` +
                            text_4,
                    );
            }),
            cleanText(
                sections.join(`

`),
                6000,
            )
        );
    }
    function handleAction_10(friend_3) {
        if (!friend_3 || typeof friend_3 !== 'object') return '';
        const name_2 = friend_3.realName || friend_3.nickname || friend_3.name || 'Char',
            persona_2 = cleanText(
                friend_3.persona || friend_3.signature || friend_3.description || '',
                2000,
            );
        return persona_2
            ? 'Char name: ' +
                  name_2 +
                  `
Char persona:
` +
                  persona_2
            : '';
    }
    function handleAction_11(friend_4) {
        const user = window.getUserState ? window.getUserState() : window.userState || {},
            name_3 = user.name || user.realName || 'User',
            persona_3 = cleanText(
                (window.imApp?.getEffectivePersonaForFriend
                    ? window.imApp.getEffectivePersonaForFriend(friend_4)
                    : '') ||
                    user.persona ||
                    user.signature ||
                    '',
                2000,
            );
        return persona_3
            ? 'User name: ' +
                  name_3 +
                  `
User persona:
` +
                  persona_3
            : '';
    }
    function resolveFakeLinkRecentChatContext_2(friend_5, value_67 = DEFAULT_RECENT_CONTEXT_LIMIT) {
        if (!friend_5 || typeof friend_5 !== 'object') return '';
        const safeLimit = normalizeRecentContextLimit(value_67),
            messages_2 = (Array.isArray(friend_5.messages) ? friend_5.messages : [])
                .filter(
                    (message_2) =>
                        message_2 && (message_2.role === 'user' || message_2.role === 'assistant'),
                )
                .slice(-safeLimit);
        let totalLength = 0;
        const lines = [];
        return (
            messages_2.forEach((message_3) => {
                let role_2 = message_3.role === 'assistant' ? 'Char' : 'User',
                    content_2 = '';
                if (window.imApp?.formatMessageForApiContext) {
                    const formatted = window.imApp.formatMessageForApiContext(message_3, friend_5, {
                        userName: window.getUserState?.()?.name || 'User',
                        expandLinkContent: false,
                        maxLinkBodyChars: 400,
                    });
                    if (formatted?.role === 'assistant') role_2 = 'Char';
                    if (formatted?.role === 'user') role_2 = 'User';
                    content_2 = formatted?.content || '';
                }
                !content_2 &&
                    (content_2 =
                        message_3.text ||
                        message_3.content ||
                        message_3.fakeLinkData?.summary ||
                        '');
                const remaining = 4000 - totalLength;
                if (remaining <= 0) return;
                const line = role_2 + ': ' + cleanText(content_2, Math.min(400, remaining));
                if (!line.replace(/^(User|Char):\s*$/, '').trim()) return;
                lines.push(line);
                totalLength += line.length + 1;
            }),
            cleanText(
                lines.join(`
`),
                4000,
            )
        );
    }
    function normalizeFakeLinkInput_2(value_79) {
        const raw = cleanText(value_79, 220);
        if (!raw || /[\u0000-\u001F\u007F]/.test(raw) || /[\s<>"'\x60\\]/.test(raw)) return null;
        if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) && !/^https?:\/\//i.test(raw)) return null;
        const value_81 = /^https?:\/\//i.test(raw) ? raw : 'https://' + raw;
        try {
            const parsed_3 = new URL(value_81);
            if (!['http:', 'https:'].includes(parsed_3.protocol) || !parsed_3.hostname) return null;
            const domain_2 = parsed_3.hostname.toLowerCase(),
                path_2 = parsed_3.pathname && parsed_3.pathname !== '/' ? parsed_3.pathname : '',
                search_2 = parsed_3.search || '',
                displayUrl_2 = ('' + domain_2 + path_2 + search_2).replace(/\/+$/, '');
            if (!displayUrl_2 || displayUrl_2.length > 180) return null;
            return {
                domain: domain_2,
                path: path_2,
                search: search_2,
                displayUrl: displayUrl_2,
                canonicalUrl: 'https://' + displayUrl_2,
            };
        } catch (value_87) {
            return null;
        }
    }
    function normalizeFakeLinkDomain_2(value_9) {
        return normalizeFakeLinkInput_2(value_9)?.displayUrl || '';
    }
    function resolveChatCompletionsEndpoint_2(config = {}) {
        const endpoint_2 = String(config.endpoint || '').trim();
        return endpoint_2 ? window.u2Api.resolveChatCompletionsEndpoint(endpoint_2) : '';
    }
    function handleAction_16(text_5) {
        const raw_2 = String(text_5 || '').trim();
        if (!raw_2) return null;
        const fenced = raw_2.match(/\x60\x60\x60(?:json)?\s*([\s\S]*?)\x60\x60\x60/i),
            candidate = fenced ? fenced[1].trim() : raw_2;
        try {
            return JSON.parse(candidate);
        } catch (value_94) {
            const start = candidate.indexOf('{'),
                end = candidate.lastIndexOf('}');
            if (start >= 0 && end > start)
                try {
                    return JSON.parse(candidate.slice(start, end + 1));
                } catch (value_97) {}
        }
        return null;
    }
    function sanitizeFakeLinkHtmlForStorage_2(value_10) {
        return cleanText(value_10, 20000)
            .replace(
                /<\s*(script|style|iframe|object|embed|link|meta|base)[\s\S]*?<\s*\/\s*\1\s*>/gi,
                '',
            )
            .replace(/<\s*\/?\s*(script|style|iframe|object|embed|link|meta|base)[^>]*>/gi, '')
            .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
            .replace(
                /\s+(href|action|formaction)\s*=\s*("https?:[^"]*"|'https?:[^']*'|https?:[^\s>]+)/gi,
                '',
            )
            .slice(0, 20000);
    }
    function sanitizeFakeLinkCssForStorage_2(value_11) {
        return cleanText(value_11, 16000)
            .replace(/@import[^;]+;/gi, '')
            .replace(/url\s*\([^)]*\)/gi, 'none')
            .replace(/expression\s*\([^)]*\)/gi, '')
            .replace(/javascript\s*:/gi, '')
            .replace(/behavior\s*:/gi, '')
            .replace(/-moz-binding\s*:/gi, '')
            .slice(0, 16000);
    }
    function sanitizeFakeLinkJsForStorage_2(value_12) {
        return cleanText(value_12, 12000)
            .replace(/<\/script/gi, '<\\/script')
            .slice(0, 12000);
    }
    function normalizeFakeLinkWebPage_2(source_2 = {}, fallback_2 = {}) {
        const safeSource = source_2 && typeof source_2 === 'object' ? source_2 : {},
            html_3 = sanitizeFakeLinkHtmlForStorage_2(
                injectRandomFakeLinkImages_2(safeSource.html || '', {
                    domain: fallback_2.domain || '',
                    prompt: fallback_2.prompt || '',
                    siteName: fallback_2.siteName || '',
                }),
            );
        return {
            html: html_3,
            css: sanitizeFakeLinkCssForStorage_2(safeSource.css || ''),
            js: sanitizeFakeLinkJsForStorage_2(safeSource.js || ''),
            source: cleanText(safeSource.source || fallback_2.source || 'ai', 30) || 'ai',
        };
    }
    function buildFakeLinkSandboxDocument_2(value_105 = {}) {
        const page_2 = normalizeFakeLinkWebPage_2(value_105),
            safeCss = page_2.css.replace(/<\/style/gi, '<\\/style'),
            safeJs = page_2.js.replace(/<\/script/gi, '<\\/script'),
            join_109 = [
                "default-src 'none'",
                'img-src https://picsum.photos https://fastly.picsum.photos data:',
                "style-src 'unsafe-inline'",
                "script-src 'unsafe-inline'",
                "connect-src 'none'",
                'font-src data:',
                "media-src 'none'",
                "object-src 'none'",
                "base-uri 'none'",
                "form-action 'none'",
            ].join('; ');
        return [
            '<!doctype html>',
            '<html><head><meta charset="utf-8">',
            '<meta http-equiv="Content-Security-Policy" content="' + escapeHtml(join_109) + '">',
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
            '<style>html,body{margin:0;min-height:100%;overflow-x:hidden}*,*::before,*::after{box-sizing:border-box}button,input,textarea,select{font:inherit}</style>',
            '<style>' + safeCss + '</style>',
            '</head><body>',
            page_2.html,
            '<script>"use strict";' + safeJs + '</script>',
            '</body></html>',
        ].join('');
    }
    function buildFakeLinkPrompt_2({
        domain: domain_4,
        prompt: prompt_3,
        worldBookContext = '',
        charPersonaContext = '',
        userPersonaContext = '',
        recentChatContext = '',
        includeCharPersona = false,
        includeUserPersona = false,
        includeRecentContext = false,
    }) {
        const contextLines = [
            '',
            '世界书上下文（只用于保持设定一致；为空则忽略）：',
            worldBookContext || '无',
        ];
        return (
            includeCharPersona &&
                charPersonaContext &&
                contextLines.push('', 'Char 人设：', charPersonaContext),
            includeUserPersona &&
                userPersonaContext &&
                contextLines.push('', 'User 人设：', userPersonaContext),
            includeRecentContext &&
                recentChatContext &&
                contextLines.push(
                    '',
                    '最近聊天上下文（把网页写成当前关系和剧情里自然出现的小剧场，不要逐句复述）：',
                    recentChatContext,
                ),
            [
                '你正在为站内 iMessage 的“链接小剧场”生成一个虚构但可信、可交互的网页。',
                '不要访问或声称读取真实网站；只根据域名、用户提示和提供的设定创作。',
                '只返回合法 JSON，不要 Markdown、代码围栏、注释或解释。',
                'JSON 顶层字段固定为：',
                '{"siteName":"站点名","title":"聊天卡片标题","summary":"聊天卡片摘要","webPage":{"html":"页面主体HTML片段","css":"页面CSS","js":"页面原生JavaScript"}}',
                'html、css、js 三个字段都必须是非空字符串。html 不要包含 html/head/body/style/script 外壳。',
                '页面应像一个完整的小剧场：内容与当前人物、关系或情境自然相关，并包含 1-3 个有意义的交互。',
                'JavaScript 必须是无需外部库即可运行的原生 JS；通过 DOM 查询绑定按钮、切换、计数、动画或面板。',
                '禁止 fetch、XMLHttpRequest、WebSocket、外链、登录、支付、账号密码采集、弹窗和父页面访问。',
                '不要使用 localStorage、sessionStorage、indexedDB、window.parent、window.top、window.opener 或 postMessage。',
                '代码保持紧凑：HTML 目标不超过 8KB，CSS 不超过 6KB，JS 不超过 4KB；不要大型网站、多页路由或框架。',
                '图片位置必须输出 <img>；src 可以留空或使用 https://picsum.photos/seed/...，系统会替换其他图片地址。',
                '',
                '域名：' + domain_4,
                '用户提示：' +
                    (prompt_3 ||
                        '生成一个与当前聊天情境自然相关、可读、精致且可交互的链接小剧场。'),
            ].concat(contextLines).join(`
`)
        );
    }
    async function requestFakeLinkAiContent({
        domain: domain_3,
        prompt: prompt_2,
        friend = null,
        includeCharPersona = false,
        includeUserPersona = false,
        includeRecentContext = false,
        recentContextLimit = DEFAULT_RECENT_CONTEXT_LIMIT,
    }) {
        const api = window.getApiConfig ? window.getApiConfig() : window.apiConfig || {},
            endpoint_3 = resolveChatCompletionsEndpoint_2(api);
        if (!endpoint_3 || !api.apiKey || !api.model) throw new Error('API_NOT_CONFIGURED');
        const contextText_2 = [domain_3, prompt_2 || ''].filter(Boolean).join(`
`),
            worldBookContext_2 = resolveFakeLinkWorldBookContext(friend, contextText_2),
            charPersonaContext_2 = includeCharPersona ? handleAction_10(friend) : '',
            userPersonaContext_2 = includeUserPersona ? handleAction_11(friend) : '',
            recentChatContext_2 = includeRecentContext
                ? resolveFakeLinkRecentChatContext_2(friend, recentContextLimit)
                : '',
            value_121 = await fetch(endpoint_3, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + api.apiKey,
                    'X-U2-Silent-Errors': '1',
                },
                body: JSON.stringify({
                    model: api.model,
                    temperature: Number.isFinite(Number(api.temperature))
                        ? Number(api.temperature)
                        : 0.72,
                    messages: [
                        {
                            role: 'system',
                            content:
                                '你是轻量交互网页生成器。只输出严格 JSON，并生成紧凑、无依赖的 HTML、CSS 和 JavaScript。',
                        },
                        {
                            role: 'user',
                            content: buildFakeLinkPrompt_2({
                                domain: domain_3,
                                prompt: prompt_2,
                                worldBookContext: worldBookContext_2,
                                charPersonaContext: charPersonaContext_2,
                                userPersonaContext: userPersonaContext_2,
                                recentChatContext: recentChatContext_2,
                                includeCharPersona: includeCharPersona,
                                includeUserPersona: includeUserPersona,
                                includeRecentContext: includeRecentContext,
                            }),
                        },
                    ],
                }),
            });
        if (!value_121.ok)
            throw (
                window.u2Api?.createHttpError?.(
                    value_121,
                    await window.u2Api?.readApiError?.(value_121),
                ) ||
                Object.assign(new Error('HTTP ' + value_121.status), {
                    status: value_121.status,
                })
            );
        const payload = await value_121.json()['catch'](() => null);
        if (!payload)
            throw Object.assign(new Error('接口返回内容格式不兼容'), {
                name: 'ApiResponseError',
            });
        const text_6 = payload.choices?.[0]?.message?.content || payload.choices?.[0]?.text || '',
            parsed_4 = handleAction_16(text_6);
        if (!parsed_4 || typeof parsed_4 !== 'object') throw new Error('INVALID_JSON');
        const siteName_2 = cleanText(parsed_4.siteName, 80),
            title_2 = cleanText(parsed_4.title, 180),
            summary_2 = cleanText(parsed_4.summary, 800),
            webPage_2 = normalizeFakeLinkWebPage_2(parsed_4.webPage, {
                source: 'ai',
                domain: domain_3,
                prompt: prompt_2,
                siteName: siteName_2,
            });
        if (!siteName_2 || !title_2 || !webPage_2.html || !webPage_2.css || !webPage_2.js)
            throw new Error('INVALID_PAGE_PACKAGE');
        return {
            siteName: siteName_2,
            title: title_2,
            summary: summary_2,
            bodyText: stripHtmlToPlainText(webPage_2.html, 20000),
            webPage: webPage_2,
        };
    }
    function createEmptySession(friendId_2) {
        const options_4 = loadFakeLinkContextOptions();
        return {
            friendId: String(friendId_2),
            domainInput: '',
            promptInput: '',
            ...options_4,
            status: 'idle',
            generatedData: null,
            errorMessage: '',
            promise: null,
            sending: false,
        };
    }
    function getFakeLinkSession(friendId_3) {
        const key = String(friendId_3 || '');
        if (!fakeLinkSessions.has(key)) fakeLinkSessions.set(key, createEmptySession(key));
        return fakeLinkSessions.get(key);
    }
    function createPreviewIframe(webPage_3, className_2) {
        const frame = document.createElement('iframe');
        return (
            (frame.className = className_2),
            frame.setAttribute('sandbox', 'allow-scripts'),
            frame.setAttribute('referrerpolicy', 'no-referrer'),
            frame.setAttribute('title', 'AI 生成的链接小剧场预览'),
            (frame.srcdoc = buildFakeLinkSandboxDocument_2(webPage_3)),
            frame
        );
    }
    function handleAction_25(_imFakeLinkPage_2) {
        const host = getFakeLinkAppContainer();
        let overlay = document.getElementById('im-fake-link-composer-overlay');
        if (overlay) {
            if (overlay.parentNode !== host) host.appendChild(overlay);
            return ((overlay._imFakeLinkPage = _imFakeLinkPage_2), overlay);
        }
        overlay = document.createElement('div');
        overlay.id = 'im-fake-link-composer-overlay';
        overlay.className = 'im-fake-link-composer-overlay';
        overlay.innerHTML = [
            '<div class="im-fake-link-composer-backdrop"></div>',
            '<section class="im-fake-link-composer-card" role="dialog" aria-modal="true" aria-label="发送链接">',
            '  <header class="im-fake-link-composer-header">',
            '    <button type="button" class="im-fake-link-composer-close" aria-label="关闭"><i class="fas fa-times"></i></button>',
            '    <strong>链接小剧场</strong>',
            '    <span></span>',
            '  </header>',
            '  <div class="im-fake-link-composer-body">',
            '    <label class="im-fake-link-field"><span>域名 / 地址</span><input class="im-fake-link-ai-domain-input" type="text" inputmode="url" autocomplete="off" placeholder="example.com/story"></label>',
            '    <label class="im-fake-link-field"><span>生成提示</span><textarea class="im-fake-link-ai-prompt-input" rows="4" placeholder="例如：生成一个和当前聊天剧情有关的互动网页，包含角色会看到的内容和自然的小互动"></textarea></label>',
            '    <div class="im-fake-link-context-options">',
            '      <label class="im-fake-link-context-toggle"><input class="im-fake-link-char-persona-toggle" type="checkbox"><span>挂载 Char 人设</span></label>',
            '      <label class="im-fake-link-context-toggle"><input class="im-fake-link-user-persona-toggle" type="checkbox"><span>挂载 User 人设</span></label>',
            '      <div class="im-fake-link-context-row">',
            '        <label class="im-fake-link-context-toggle"><input class="im-fake-link-recent-context-toggle" type="checkbox"><span>挂载最近聊天上下文</span></label>',
            '        <label class="im-fake-link-context-limit"><input class="im-fake-link-context-limit-input" type="number" min="1" max="50" value="10" inputmode="numeric"><span>条</span></label>',
            '      </div>',
            '    </div>',
            '    <div class="im-fake-link-generation-row">',
            '      <button type="button" class="im-fake-link-generate-btn" aria-label="调用 API 生成网页" title="调用 API 生成网页"><i class="fas fa-search"></i></button>',
            '      <span class="im-fake-link-status">填写地址和提示后生成链接小剧场</span>',
            '    </div>',
            '    <div class="im-fake-link-web-mini-preview" hidden>',
            '      <div class="im-fake-link-web-mini-label">生成结果</div>',
            '      <div class="im-fake-link-web-mini-frame"></div>',
            '    </div>',
            '  </div>',
            '  <footer class="im-fake-link-composer-actions">',
            '    <button type="button" class="im-fake-link-composer-cancel">取消</button>',
            '    <button type="button" class="im-fake-link-composer-send">发送</button>',
            '  </footer>',
            '</section>',
        ].join('');
        host.appendChild(overlay);
        overlay._imFakeLinkPage = _imFakeLinkPage_2;
        const domainInput_2 = overlay.querySelector('.im-fake-link-ai-domain-input'),
            promptInput_2 = overlay.querySelector('.im-fake-link-ai-prompt-input'),
            includeCharPersonaInput = overlay.querySelector('.im-fake-link-char-persona-toggle'),
            includeUserPersonaInput = overlay.querySelector('.im-fake-link-user-persona-toggle'),
            includeRecentContextInput = overlay.querySelector(
                '.im-fake-link-recent-context-toggle',
            ),
            recentContextLimitInput = overlay.querySelector('.im-fake-link-context-limit-input'),
            generateButton = overlay.querySelector('.im-fake-link-generate-btn'),
            statusText = overlay.querySelector('.im-fake-link-status'),
            preview = overlay.querySelector('.im-fake-link-web-mini-preview'),
            previewFrame = overlay.querySelector('.im-fake-link-web-mini-frame'),
            closeButton = overlay.querySelector('.im-fake-link-composer-close'),
            cancelButton = overlay.querySelector('.im-fake-link-composer-cancel'),
            sendButton = overlay.querySelector('.im-fake-link-composer-send'),
            backdrop = overlay.querySelector('.im-fake-link-composer-backdrop'),
            editableControls = [
                domainInput_2,
                promptInput_2,
                includeCharPersonaInput,
                includeUserPersonaInput,
                includeRecentContextInput,
                recentContextLimitInput,
            ];
        function getCurrentSession() {
            return getFakeLinkSession(overlay._imFakeLinkFriendId);
        }
        function setGenerateButtonLoading(isLoading) {
            const icon = generateButton.querySelector('i');
            if (icon) icon.className = isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-search';
            generateButton.setAttribute('aria-busy', String(!!isLoading));
        }
        function setStatus(message_4, status_2 = 'idle') {
            statusText.textContent = message_4 || '';
            statusText.dataset.status = status_2;
        }
        function syncSessionFromInputs({ invalidate = true } = {}) {
            const session_2 = getCurrentSession();
            if (session_2.status === 'generating') return session_2;
            return (
                (session_2.domainInput = domainInput_2.value),
                (session_2.promptInput = promptInput_2.value),
                (session_2.includeCharPersona = !!includeCharPersonaInput.checked),
                (session_2.includeUserPersona = !!includeUserPersonaInput.checked),
                (session_2.includeRecentContext = !!includeRecentContextInput.checked),
                (session_2.recentContextLimit = normalizeRecentContextLimit(
                    recentContextLimitInput.value,
                )),
                (recentContextLimitInput.value = String(session_2.recentContextLimit)),
                handleAction_8(session_2),
                invalidate &&
                    session_2.generatedData &&
                    ((session_2.generatedData = null),
                    (session_2.status = 'idle'),
                    (session_2.errorMessage = '')),
                session_2
            );
        }
        function renderComposerState() {
            const session_3 = getCurrentSession(),
                disabled_2 = session_3.status === 'generating';
            editableControls.forEach((control) => {
                control.disabled = disabled_2;
            });
            recentContextLimitInput.disabled = disabled_2 || !includeRecentContextInput.checked;
            generateButton.disabled = disabled_2;
            sendButton.disabled =
                disabled_2 || session_3.status !== 'ready' || !session_3.generatedData;
            setGenerateButtonLoading(disabled_2);
            preview.hidden = session_3.status !== 'ready' || !session_3.generatedData?.webPage;
            previewFrame.innerHTML = '';
            !preview.hidden &&
                previewFrame.appendChild(
                    createPreviewIframe(
                        session_3.generatedData.webPage,
                        'im-fake-link-preview-iframe',
                    ),
                );
            if (session_3.status === 'generating')
                setStatus('AI 正在生成链接小剧场，退出此界面也会继续…', 'loading');
            else {
                if (session_3.status === 'ready') setStatus('生成完成，可以预览或发送', 'ready');
                else
                    session_3.status === 'error'
                        ? setStatus(session_3.errorMessage || '生成失败，请重试', 'error')
                        : setStatus('填写地址和提示后生成链接小剧场', 'idle');
            }
        }
        function loadSessionIntoInputs(session) {
            domainInput_2.value = session.domainInput || '';
            promptInput_2.value = session.promptInput || '';
            includeCharPersonaInput.checked = !!session.includeCharPersona;
            includeUserPersonaInput.checked = !!session.includeUserPersona;
            includeRecentContextInput.checked = !!session.includeRecentContext;
            recentContextLimitInput.value = String(
                normalizeRecentContextLimit(session.recentContextLimit),
            );
            renderComposerState();
        }
        function handleClick() {
            const activeElement_2 = document.activeElement;
            activeElement_2 &&
                overlay.contains(activeElement_2) &&
                typeof activeElement_2.blur === 'function' &&
                activeElement_2.blur();
            overlay.classList.remove('active');
            setTimeout(() => {
                if (!overlay.classList.contains('active')) overlay.style.display = 'none';
            }, 220);
        }
        async function handleAction_139() {
            const session_4 = syncSessionFromInputs({
                    invalidate: true,
                }),
                normalized_2 = normalizeFakeLinkInput_2(session_4.domainInput);
            if (!normalized_2) {
                session_4.status = 'error';
                session_4.errorMessage = '请先输入有效域名或 http/https 地址';
                renderComposerState();
                focusFakeLinkControl(domainInput_2);
                return;
            }
            if (session_4.status === 'generating') return;
            const friendId_4 = String(overlay._imFakeLinkFriendId || ''),
                friend_6 =
                    (window.imData?.friends || []).find((item) => String(item.id) === friendId_4) ||
                    window.imData?.currentActiveFriend ||
                    null;
            session_4.domainInput = normalized_2.displayUrl;
            domainInput_2.value = normalized_2.displayUrl;
            session_4.status = 'generating';
            session_4.generatedData = null;
            session_4.errorMessage = '';
            const promise_2 = requestFakeLinkAiContent({
                domain: normalized_2.displayUrl,
                prompt: cleanText(session_4.promptInput, 1000),
                friend: friend_6,
                includeCharPersona: session_4.includeCharPersona,
                includeUserPersona: session_4.includeUserPersona,
                includeRecentContext: session_4.includeRecentContext,
                recentContextLimit: session_4.recentContextLimit,
            });
            session_4.promise = promise_2;
            renderComposerState();
            try {
                const generated = await promise_2;
                if (session_4.promise !== promise_2) return;
                session_4.generatedData = {
                    ...generated,
                    siteName: generated.siteName || normalized_2.domain,
                    title: generated.title || normalized_2.domain,
                    webPage: normalizeFakeLinkWebPage_2(generated.webPage, {
                        source: 'ai',
                        domain: normalized_2.displayUrl,
                        prompt: session_4.promptInput,
                        siteName: generated.siteName || normalized_2.domain,
                    }),
                };
                session_4.status = 'ready';
                session_4.errorMessage = '';
                const visibleHere =
                    overlay.classList.contains('active') &&
                    String(overlay._imFakeLinkFriendId) === friendId_4;
                if (!visibleHere && window.showToast) window.showToast('链接小剧场已生成');
            } catch (error) {
                if (session_4.promise !== promise_2) return;
                console.warn('[iMessage fake link] AI generation failed', error);
                session_4.status = 'error';
                session_4.errorMessage =
                    error?.message === 'API_NOT_CONFIGURED'
                        ? '未配置 API，请到设置中填写后再生成'
                        : error?.message === 'INVALID_PAGE_PACKAGE'
                          ? 'AI 返回的网页代码不完整，请重试'
                          : 'AI 生成失败，请重试';
                if (
                    !window.u2Api?.isRequestError?.(error) ||
                    !window.u2Api.reportError(error, {
                        operation: '链接小剧场生成',
                    })
                ) {
                    if (window.showToast) window.showToast(session_4.errorMessage);
                }
            } finally {
                if (session_4.promise === promise_2) session_4.promise = null;
                if (String(overlay._imFakeLinkFriendId) === friendId_4) renderComposerState();
            }
        }
        async function handleAction_140() {
            const session_5 = getCurrentSession();
            if (session_5.sending || session_5.status !== 'ready' || !session_5.generatedData)
                return;
            const normalized_3 = normalizeFakeLinkInput_2(session_5.domainInput);
            if (!normalized_3) {
                session_5.status = 'error';
                session_5.errorMessage = '请先输入有效域名';
                renderComposerState();
                return;
            }
            const friendId_5 = String(overlay._imFakeLinkFriendId || ''),
                friend_7 =
                    (window.imData?.friends || []).find(
                        (item_2) => String(item_2.id) === friendId_5,
                    ) || window.imData?.currentActiveFriend;
            if (!friend_7 || (friend_7.type === 'group' && Number(friend_7.leftGroupAt) > 0)) {
                if (window.showToast) window.showToast('当前聊天无法发送链接');
                return;
            }
            session_5.sending = true;
            sendButton.disabled = true;
            sendButton.textContent = '发送中…';
            const now_155 = Date.now(),
                generated_2 = session_5.generatedData,
                fakeLinkData_2 = {
                    domain: normalized_3.domain,
                    displayUrl: normalized_3.displayUrl,
                    canonicalUrl: normalized_3.canonicalUrl,
                    siteName: generated_2.siteName,
                    title: generated_2.title,
                    summary: generated_2.summary,
                    bodyText:
                        generated_2.bodyText ||
                        stripHtmlToPlainText(generated_2.webPage?.html, 20000),
                    prompt: cleanText(session_5.promptInput, 1000),
                    includeCharPersona: !!session_5.includeCharPersona,
                    includeUserPersona: !!session_5.includeUserPersona,
                    includeRecentContext: !!session_5.includeRecentContext,
                    recentContextLimit: normalizeRecentContextLimit(session_5.recentContextLimit),
                    generatedBy: 'ai',
                    webPage: normalizeFakeLinkWebPage_2(generated_2.webPage, {
                        source: 'ai',
                    }),
                    createdAt: now_155,
                },
                msgObj = {
                    id: imChat_3.createMessageId
                        ? imChat_3.createMessageId('fake-link')
                        : 'fake-link-' + now_155,
                    role: 'user',
                    type: 'fake_link',
                    content: fakeLinkData_2.displayUrl,
                    text: '[链接] ' + fakeLinkData_2.siteName + '：' + fakeLinkData_2.title,
                    fakeLinkData: fakeLinkData_2,
                    timestamp: now_155,
                };
            window.imApp.captureGroupUserIdentity?.(friend_7, msgObj);
            const saved = window.imApp.appendFriendMessage
                ? await window.imApp.appendFriendMessage(friend_7.id, msgObj, {
                      silent: true,
                  })
                : false;
            if (!saved) {
                if (window.showToast) window.showToast('链接消息保存失败');
                session_5.sending = false;
                sendButton.disabled = false;
                sendButton.textContent = '发送';
                return;
            }
            const activePage =
                    overlay._imFakeLinkPage ||
                    document.getElementById('chat-interface-' + friend_7.id) ||
                    _imFakeLinkPage_2,
                container = activePage?.querySelector('.ins-chat-messages');
            if (container) {
                const appended = imChat_3.appendMessageToContainer
                    ? imChat_3.appendMessageToContainer(friend_7, container, msgObj, {
                          scroll: true,
                      })
                    : false;
                !appended &&
                    imChat_3.rerenderChatContainer &&
                    imChat_3.rerenderChatContainer(friend_7, container, {
                        scroll: true,
                    });
            }
            fakeLinkSessions['delete'](friendId_5);
            handleClick();
            session_5.sending = false;
            sendButton.textContent = '发送';
        }
        return (
            editableControls.forEach((node) => {
                node.addEventListener('input', () => {
                    syncSessionFromInputs({
                        invalidate: true,
                    });
                    renderComposerState();
                });
                node.addEventListener('change', () => {
                    syncSessionFromInputs({
                        invalidate: true,
                    });
                    renderComposerState();
                });
            }),
            generateButton.addEventListener('click', () => void handleAction_139()),
            sendButton.addEventListener('click', () => void handleAction_140()),
            closeButton.addEventListener('click', handleClick),
            cancelButton.addEventListener('click', handleClick),
            backdrop.addEventListener('click', handleClick),
            (overlay._renderFakeLinkComposerState = renderComposerState),
            (overlay._openFakeLinkComposer = (friend_8, nextPage) => {
                overlay._imFakeLinkFriendId = String(friend_8.id);
                overlay._imFakeLinkPage = nextPage || _imFakeLinkPage_2;
                loadSessionIntoInputs(getFakeLinkSession(friend_8.id));
                sendButton.textContent = '发送';
                overlay.style.display = 'flex';
                void overlay.offsetWidth;
                overlay.classList.add('active');
            }),
            overlay
        );
    }
    function openFakeLinkComposer_2() {
        const friend_9 = window.imData.currentActiveFriend;
        if (!friend_9) return;
        const page_3 = document.getElementById('chat-interface-' + friend_9.id);
        if (!page_3) return;
        const overlay_2 = handleAction_25(page_3);
        overlay_2._openFakeLinkComposer(friend_9, page_3);
    }
    imChat_3.normalizeFakeLinkInput = normalizeFakeLinkInput_2;
    imChat_3.normalizeFakeLinkDomain = normalizeFakeLinkDomain_2;
    imChat_3.buildFakeLinkPrompt = buildFakeLinkPrompt_2;
    imChat_3.resolveFakeLinkRecentChatContext = resolveFakeLinkRecentChatContext_2;
    imChat_3.buildRandomFakeLinkImageUrl = buildRandomFakeLinkImageUrl_2;
    imChat_3.isAllowedFakeLinkImageUrl = isAllowedFakeLinkImageUrl_2;
    imChat_3.injectRandomFakeLinkImages = injectRandomFakeLinkImages_2;
    imChat_3.normalizeFakeLinkWebPage = normalizeFakeLinkWebPage_2;
    imChat_3.sanitizeFakeLinkHtmlForStorage = sanitizeFakeLinkHtmlForStorage_2;
    imChat_3.sanitizeFakeLinkCssForStorage = sanitizeFakeLinkCssForStorage_2;
    imChat_3.sanitizeFakeLinkJsForStorage = sanitizeFakeLinkJsForStorage_2;
    imChat_3.buildFakeLinkSandboxDocument = buildFakeLinkSandboxDocument_2;
    imChat_3.openFakeLinkComposer = openFakeLinkComposer_2;
});
