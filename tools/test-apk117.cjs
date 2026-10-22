// Isolated browser tests. All external traffic is blocked; generation and TTS are mocked.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
    const root = path.resolve(__dirname, '..');
    const server = require('node:http').createServer((req, res) => {
        let file = path.join(
            root,
            decodeURIComponent(new URL(req.url, 'http://localhost').pathname),
        );
        try {
            if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
            res.setHeader(
                'Content-Type',
                { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[
                    path.extname(file)
                ] || 'application/octet-stream',
            );
            if (path.relative(root, file) === 'js/library.js') {
                let source = fs.readFileSync(file, 'utf8');
                source = source.replace(
                    '    window.libraryApp = {',
                    '    window.__playback117={state,audio,start:handleAction_166,toggle:togglePlayback,setResolver:fn=>handleAction_164=fn};\n    window.libraryApp = {',
                );
                res.end(source);
            } else fs.createReadStream(file).pipe(res);
        } catch {
            res.statusCode = 404;
            res.end();
        }
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const browser = await chromium.launch({
        headless: true,
        executablePath: process.env.CHROMIUM_PATH || undefined,
        args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
    });
    const context = await browser.newContext({
        viewport: { width: 820, height: 1148 },
        hasTouch: true,
        isMobile: true,
        userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/26.1 Safari/605.1.15',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => {
        errors.push(error.stack);
        console.error('PAGE ERROR', error.message);
    });
    page.on('console', (message) => {
        if (message.type() === 'error') console.error('BROWSER', message.text().slice(0, 700));
    });
    await page.route('**/*', (route) =>
        new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort(),
    );
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'maxTouchPoints', { value: 5 });
        Object.defineProperty(navigator, 'standalone', { value: true });
    });
    const passed = [];
    async function check(name, fn) {
        let timer;
        const value = await Promise.race([
            page.evaluate(fn),
            new Promise((_, reject) => {
                timer = setTimeout(() => reject(new Error('Timeout: ' + name)), 20000);
            }),
        ]).finally(() => clearTimeout(timer));
        assert.equal(value, true, name + ': ' + JSON.stringify(value));
        passed.push(name);
        console.log('PASS', name);
    }
    try {
        await page.goto('http://127.0.0.1:' + server.address().port, { waitUntil: 'load' });
        await page.evaluate(() => window.appStorage.ready);
        await page.waitForFunction(
            () => window.shoppingApp && window.imChat?.openChatTab && window.libraryApp,
        );
        await page.evaluate(async () => {
            await window.imApp.ensureDataReady();
            await window.globalDataReadyPromise;
            document.getElementById('u2-login-screen')?.remove();
            document.body.classList.remove('u2-login-locked');
            window.__originalToast = window.showToast;
            window.__toasts = [];
            window.showToast = (text) => window.__toasts.push(text);
            window
                .getAccounts()
                .push(
                    { id: '117-account', name: 'Shared User', avatarUrl: 'assets/moren-thumb.jpg' },
                    {
                        id: '117-other-account',
                        name: 'Other ID',
                        avatarUrl: 'assets/moren-thumb.jpg',
                    },
                );
            await window.saveGlobalData();
            await window.imApp.commitFriendsChange(() => {
                window.imData.friends.push(
                    {
                        id: '117-char',
                        type: 'char',
                        nickname: 'Test Char',
                        messages: [],
                        boundAccountId: '117-account',
                        hasLovesSpace: true,
                        lovesSpaceStartTime: new Date(2026, 9, 20).getTime(),
                        lovesData: {},
                    },
                    {
                        id: '117-other',
                        type: 'char',
                        nickname: 'Other Char',
                        messages: [],
                        boundAccountId: '117-account',
                    },
                );
            });
            window.openView(document.getElementById('imessage-view'));
            await window.imChat.openChatTab(window.imApp.getFriendById('117-char'));
        });
        await check(
            'new UI is unique; web keeps native iOS features gated; Quantity focus frame removed',
            () => {
                for (const id of [
                    'bind-account-separate-avatar-toggle',
                    'chat-auto-reply-delay-row',
                    'chat-auto-reply-delay-seconds',
                    'online-prompt-living-vibe-toggle',
                    'lovers-together-date-card',
                    'ios-icloud-backup-group',
                ]) {
                    if (document.querySelectorAll('#' + id).length !== 1) return id;
                }
                if (
                    window.u2NativeBridge.isNativeIOS() ||
                    window.u2IosNavigation ||
                    !document.getElementById('ios-icloud-backup-group').hidden
                )
                    return 'native leaked';
                const input = document.getElementById('shopping-search-count');
                input.focus();
                const style = getComputedStyle(input);
                return style.outlineStyle === 'none' && style.boxShadow === 'none';
            },
        );
        await check(
            'separate User avatar UI saves per chat and account without changing shared ID',
            async () => {
                const app = window.imApp,
                    friend = app.getFriendById('117-char');
                app.openChatSettingsForFriend(friend);
                document.getElementById('chat-bind-id-btn').click();
                const toggle = document.getElementById('bind-account-separate-avatar-toggle');
                toggle.checked = true;
                toggle.dispatchEvent(new Event('change'));
                for (let i = 0; i < 100 && toggle.disabled; i++)
                    await new Promise((r) => setTimeout(r, 10));
                if (!app.getFriendById(friend.id).separateUserAvatarEnabled) return 'toggle';
                window.readImageAsCompressedDataUrl = async () => 'data:image/png;base64,aGVsbG8=';
                const upload = document.getElementById('bind-account-detail-avatar-upload');
                const transfer = new DataTransfer();
                transfer.items.add(new File(['avatar'], 'avatar.png', { type: 'image/png' }));
                upload.files = transfer.files;
                upload.dispatchEvent(new Event('change'));
                await new Promise((r) => setTimeout(r, 30));
                document.getElementById('bind-account-detail-save-btn').click();
                for (
                    let i = 0;
                    i < 100 && !app.getFriendById(friend.id).userAvatarsByAccount?.['117-account'];
                    i++
                )
                    await new Promise((r) => setTimeout(r, 10));
                const saved = app.getFriendById(friend.id);
                if (app.getChatUserAvatarUrl(saved) !== 'data:image/png;base64,aGVsbG8=')
                    return 'override missing';
                if (
                    app.getChatUserAvatarUrl(app.getFriendById('117-other')) !==
                    'assets/moren-thumb.jpg'
                )
                    return 'other chat changed';
                if (
                    window.getAccounts().find((a) => a.id === '117-account').avatarUrl !==
                    'assets/moren-thumb.jpg'
                )
                    return 'shared ID changed';
                if (
                    app.getChatUserAvatarUrl({ ...saved, boundAccountId: '117-other-account' }) !==
                    'assets/moren-thumb.jpg'
                )
                    return 'other ID changed';
                toggle.checked = false;
                toggle.dispatchEvent(new Event('change'));
                for (let i = 0; i < 100 && toggle.disabled; i++)
                    await new Promise((r) => setTimeout(r, 10));
                if (
                    app.getChatUserAvatarUrl(app.getFriendById(friend.id)) !==
                    'assets/moren-thumb.jpg'
                )
                    return 'off ignored';
                toggle.checked = true;
                toggle.dispatchEvent(new Event('change'));
                for (let i = 0; i < 100 && toggle.disabled; i++)
                    await new Promise((r) => setTimeout(r, 10));
                return true;
            },
        );
        await check('late avatar compression cannot overwrite a different chat', async () => {
            const app = window.imApp;
            app.openChatSettingsForFriend(app.getFriendById('117-char'));
            document.getElementById('chat-bind-id-btn').click();
            let finish;
            window.readImageAsCompressedDataUrl = () => new Promise((r) => (finish = r));
            const upload = document.getElementById('bind-account-detail-avatar-upload'),
                data = new DataTransfer();
            data.items.add(new File(['late'], 'late.png', { type: 'image/png' }));
            upload.files = data.files;
            upload.dispatchEvent(new Event('change'));
            app.openChatSettingsForFriend(app.getFriendById('117-other'));
            document.getElementById('chat-bind-id-btn').click();
            finish('data:image/png;base64,bGF0ZQ==');
            await new Promise((r) => setTimeout(r, 20));
            return (
                document.getElementById('bind-account-detail-avatar-img').getAttribute('src') ===
                'assets/moren-thumb.jpg'
            );
        });
        await check(
            'delay settings save and reject invalid seconds; disabling auto reply cancels pending work',
            async () => {
                const app = window.imApp;
                app.openChatSettingsForFriend(app.getFriendById('117-char'));
                const auto = document.getElementById('chat-auto-reply-toggle');
                auto.checked = true;
                auto.dispatchEvent(new Event('change'));
                for (let i = 0; i < 100 && auto.disabled; i++)
                    await new Promise((r) => setTimeout(r, 10));
                if (document.getElementById('chat-auto-reply-delay-row').hidden)
                    return 'row hidden';
                const delay = document.getElementById('chat-auto-reply-delay-toggle');
                delay.checked = true;
                delay.dispatchEvent(new Event('change'));
                for (let i = 0; i < 100 && delay.disabled; i++)
                    await new Promise((r) => setTimeout(r, 10));
                const seconds = document.getElementById('chat-auto-reply-delay-seconds');
                seconds.value = '1';
                seconds.dispatchEvent(new Event('change'));
                for (let i = 0; i < 100 && seconds.disabled; i++)
                    await new Promise((r) => setTimeout(r, 10));
                seconds.value = '0';
                seconds.dispatchEvent(new Event('change'));
                if (seconds.value !== '1') return 'invalid accepted';
                const old = window.imChat.handleAiReply;
                let calls = 0;
                window.imChat.handleAiReply = async () => {
                    calls++;
                };
                try {
                    window.imChat.maybeAutoReplyAfterUserMessage(
                        app.getFriendById('117-char'),
                        null,
                        { role: 'user' },
                    );
                    auto.checked = false;
                    auto.dispatchEvent(new Event('change'));
                    for (let i = 0; i < 100 && auto.disabled; i++)
                        await new Promise((r) => setTimeout(r, 10));
                    await new Promise((r) => setTimeout(r, 1150));
                    return (
                        calls === 0 && document.getElementById('chat-auto-reply-delay-row').hidden
                    );
                } finally {
                    window.imChat.handleAiReply = old;
                }
            },
        );
        // A fake browser clock verifies deadline behavior without waiting real seconds.
        await page.clock.install();
        await check(
            'delay uses first message deadline and rechecks live role/block state at expiry',
            async () => {
                const app = window.imApp;
                await app.commitFriendChange('117-char', (f) => {
                    f.autoReplyEnabled = true;
                    f.autoReplyDelayEnabled = true;
                    f.autoReplyDelaySeconds = 3;
                });
                window.__aiOriginal = window.imChat.handleAiReply;
                window.__aiCalls = [];
                window.imChat.handleAiReply = async (friend, container, button, options) =>
                    window.__aiCalls.push({ id: friend.id, source: options.source });
                const message = { role: 'user' };
                return (
                    window.imChat.maybeAutoReplyAfterUserMessage(
                        app.getFriendById('117-char'),
                        null,
                        message,
                    ) === true
                );
            },
        );
        await page.clock.fastForward(2000);
        await page.evaluate(() =>
            window.imChat.maybeAutoReplyAfterUserMessage(
                window.imApp.getFriendById('117-char'),
                null,
                { role: 'user' },
            ),
        );
        await page.clock.fastForward(1001);
        assert.equal(
            await page.evaluate(() => window.__aiCalls.length),
            1,
            'repeated sends must not postpone first deadline',
        );
        await page.evaluate(() => {
            window.imChat.maybeAutoReplyAfterUserMessage(
                window.imApp.getFriendById('117-char'),
                null,
                { role: 'user' },
            );
            window.imApp.getFriendById('117-char').blockState = { charBlocksUser: true };
        });
        await page.clock.fastForward(3001);
        assert.equal(
            await page.evaluate(() => window.__aiCalls.length),
            1,
            'blocked char cannot fire pending reply',
        );
        await page.evaluate(() => {
            const f = window.imApp.getFriendById('117-char');
            f.blockState = {};
            window.imChat.maybeAutoReplyAfterUserMessage(f, null, { role: 'user' });
            f.type = 'npc';
        });
        await page.clock.fastForward(3001);
        assert.equal(
            await page.evaluate(() => window.__aiCalls.length),
            1,
            'NPC cannot fire old char timer',
        );
        await page.evaluate(() => {
            window.imApp.getFriendById('117-char').type = 'char';
            window.imChat.handleAiReply = window.__aiOriginal;
        });
        await page.clock.resume();
        await check(
            'living-vibe is isolated per chat; prompt confirmations save/discard/cancel and backdrop work',
            async () => {
                const app = window.imApp,
                    store = app.onlinePrompts,
                    f = app.getFriendById('117-char');
                await app.openOnlinePromptSettings(f);
                const toggle = document.getElementById('online-prompt-living-vibe-toggle');
                toggle.checked = false;
                toggle.dispatchEvent(new Event('change'));
                for (let i = 0; i < 100 && toggle.disabled; i++)
                    await new Promise((r) => setTimeout(r, 10));
                if (
                    app.getFriendById(f.id).builtinLivingVibeEnabled !== false ||
                    app.getFriendById('117-other').builtinLivingVibeEnabled === false
                )
                    return 'setting leaked';
                const original = window.getBuiltinWorldBookContext;
                window.getBuiltinWorldBookContext = () => 'BUILTIN_TEST';
                try {
                    const on = app.getWorldBookContextForFriendByPosition('before_role', f, '', {
                        includeBuiltin: true,
                    });
                    const off = app.getWorldBookContextForFriendByPosition('before_role', f, '', {
                        includeBuiltin: false,
                    });
                    if (!on.includes('BUILTIN_TEST') || off.includes('BUILTIN_TEST'))
                        return 'worldbook gate';
                } finally {
                    window.getBuiltinWorldBookContext = original;
                }
                document.querySelector('[data-prompt-action="new"]').click();
                await new Promise((r) => setTimeout(r, 50));
                const input = document.querySelector('.online-prompt-field input');
                if (!input) return 'new preset';
                input.value = 'Unsaved 117';
                input.dispatchEvent(new Event('input'));
                document.querySelector('[data-prompt-action="close"]').click();
                await new Promise((r) => setTimeout(r, 30));
                const overlay = document.querySelector('.online-prompt-decision'),
                    card = document.querySelector('.online-prompt-decision-card');
                if (
                    overlay.hidden ||
                    card.getAttribute('role') !== 'alertdialog' ||
                    !card.querySelector('[data-decision="discard"]')
                )
                    return 'dialog';
                overlay.click();
                await new Promise((r) => setTimeout(r, 30));
                if (
                    !overlay.hidden ||
                    !document
                        .getElementById('chat-online-prompt-sheet')
                        .classList.contains('active')
                )
                    return 'cancel backdrop';
                document.querySelector('[data-prompt-action="close"]').click();
                await new Promise((r) => setTimeout(r, 30));
                card.querySelector('[data-decision="discard"]').click();
                await new Promise((r) => setTimeout(r, 30));
                if (
                    document.getElementById('chat-online-prompt-sheet').classList.contains('active')
                )
                    return 'discard';
                // Store-level failure must roll back the switch, even after a mutating failed write.
                const commit = app.commitScopedFriendChange;
                app.commitScopedFriendChange = async (id, mutate) => {
                    mutate(app.getFriendById(id));
                    return false;
                };
                try {
                    await store.setBuiltinLivingVibeEnabled(f.id, true);
                    return 'failed write accepted';
                } catch {
                } finally {
                    app.commitScopedFriendChange = commit;
                }
                return app.getFriendById(f.id).builtinLivingVibeEnabled === false;
            },
        );
        await check(
            'actual manual reply cancels delay and sends living-vibe flag through all worldbook positions',
            async () => {
                const app = window.imApp,
                    f = app.getFriendById('117-char');
                await window.imChat.openChatTab(f);
                await app.appendFriendMessage(
                    f.id,
                    {
                        id: '117-request',
                        role: 'user',
                        type: 'text',
                        content: 'Hello',
                        timestamp: Date.now(),
                    },
                    { silent: true },
                );
                const original = {
                    fetch: window.fetch,
                    config: window.getApiConfig,
                    api: window.u2Api,
                    worldbook: app.getWorldBookContextForFriendByPosition,
                };
                window.__requestTest = { original, requests: 0, positions: [], prompts: [] };
                const test = window.__requestTest;
                window.getApiConfig = () => ({
                    endpoint: 'https://test.invalid/v1',
                    apiKey: 'test',
                    model: 'test',
                    temperature: 0.7,
                });
                const reply =
                    '<chat_json>' +
                    JSON.stringify([{ type: 'text', text: 'Hello back.', translation: '' }]) +
                    '</chat_json>';
                window.fetch = async (url, options) => {
                    if (!String(url).startsWith('https://test.invalid'))
                        return original.fetch(url, options);
                    test.requests++;
                    const body =
                        typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
                    test.prompts.push(JSON.stringify(body.messages));
                    if (body.stream)
                        return new Response(
                            'data: ' +
                                JSON.stringify({ choices: [{ delta: { content: reply } }] }) +
                                '\n\ndata: [DONE]\n\n',
                            { headers: { 'content-type': 'text/event-stream' } },
                        );
                    return new Response(
                        JSON.stringify({ choices: [{ message: { content: reply } }] }),
                        { headers: { 'content-type': 'application/json' } },
                    );
                };
                window.u2Api = { ...original.api, fetchChatCompletion: window.fetch };
                app.getWorldBookContextForFriendByPosition = (position, friend, text, options) => {
                    test.positions.push({ position, includeBuiltin: options?.includeBuiltin });
                    return (
                        'USER_WORLD_' +
                        position +
                        (options?.includeBuiltin === false ? '' : ' BUILTIN_SHOULD_BE_ABSENT')
                    );
                };
                window.imChat.maybeAutoReplyAfterUserMessage(app.getFriendById(f.id), null, {
                    role: 'user',
                });
                await window.imChat.handleAiReply(
                    app.getFriendById(f.id),
                    document.querySelector('#chat-interface-117-char .ins-chat-messages'),
                    null,
                    { source: 'manual', silent: true },
                );
                test.afterManual = test.requests;
                return (
                    test.requests > 0 &&
                    ['system_depth', 'before_role', 'after_role'].every((p) =>
                        test.positions.some((x) => x.position === p && x.includeBuiltin === false),
                    ) &&
                    test.prompts.some((p) => p.includes('USER_WORLD_')) &&
                    !test.prompts.some((p) => p.includes('BUILTIN_SHOULD_BE_ABSENT'))
                );
            },
        );
        await page.clock.fastForward(3500);
        assert.equal(
            await page.evaluate(() => window.__requestTest.requests),
            await page.evaluate(() => window.__requestTest.afterManual),
            'manual reply must cancel pending automatic reply',
        );
        await page.evaluate(() => {
            const old = window.__requestTest.original;
            window.fetch = old.fetch;
            window.getApiConfig = old.config;
            window.u2Api = old.api;
            window.imApp.getWorldBookContextForFriendByPosition = old.worldbook;
        });
        await check(
            'ordinary centered notices delete persistently; failed delete retains row and re-enables control',
            async () => {
                const app = window.imApp,
                    f = app.getFriendById('117-char');
                const msg = {
                    id: '117-notice',
                    type: 'system_notice',
                    noticeKind: 'narration',
                    text: 'Test notice',
                    timestamp: Date.now(),
                    role: 'system',
                };
                await app.appendFriendMessage(f.id, msg);
                await window.imChat.openChatTab(app.getFriendById(f.id));
                let row = document.querySelector('[data-message-id="117-notice"]'),
                    button = row?.querySelector('.chat-notice-delete');
                if (!button) return 'missing delete';
                const remove = app.removeFriendMessages;
                app.removeFriendMessages = async () => false;
                button.click();
                await new Promise((r) => setTimeout(r, 30));
                app.removeFriendMessages = remove;
                if (!row.isConnected || button.disabled) return 'failure';
                button.click();
                for (
                    let i = 0;
                    i < 100 && app.getFriendById(f.id).messages.some((m) => m.id === msg.id);
                    i++
                )
                    await new Promise((r) => setTimeout(r, 10));
                return !app.getFriendById(f.id).messages.some((m) => m.id === msg.id);
            },
        );
        await check(
            'favorite/recall dismissal hides presentation and keeps saved content',
            async () => {
                const app = window.imApp,
                    f = app.getFriendById('117-char'),
                    container = document.querySelector(
                        '#chat-interface-117-char .ins-chat-messages',
                    );
                window.imChat.showFavoriteSavedNotice(f, container, 'run-117');
                const button = container.querySelector(
                    '.favorite-saved-narration .chat-notice-delete',
                );
                if (!button) return 'favorite control';
                button.click();
                for (
                    let i = 0;
                    i < 100 &&
                    !app.isChatNoticeDismissed(app.getFriendById(f.id), 'favorite:run-117');
                    i++
                )
                    await new Promise((r) => setTimeout(r, 10));
                if (
                    window.imChat.showFavoriteSavedNotice(
                        app.getFriendById(f.id),
                        container,
                        'run-117',
                    ) !== false
                )
                    return 'dismissed favorite returned';
                if (!app.isChatNoticeDismissed(app.getFriendById(f.id), 'favorite:run-117'))
                    return 'favorite not saved';
                await app.commitFriendChange(f.id, (friend) => {
                    friend.memory = {
                        ...friend.memory,
                        longTermEntries: [
                            {
                                id: '117-memory',
                                title: 'Kept memory',
                                content: 'Never delete this memory',
                            },
                        ],
                    };
                });
                const recall = window.imChat.resolveActiveMemoryRecall(
                    app.getFriendById(f.id),
                    'context',
                );
                window.imChat.showMemoryRecallNotice(
                    app.getFriendById(f.id),
                    recall,
                    container,
                    null,
                    'run-117',
                );
                const recallButton = container.querySelector(
                    '.memory-recall-narration:not(.favorite-saved-narration) .chat-notice-delete',
                );
                if (!recallButton) return 'recall control';
                recallButton.click();
                for (
                    let i = 0;
                    i < 100 &&
                    !app.isChatNoticeDismissed(app.getFriendById(f.id), 'recall:run-117');
                    i++
                )
                    await new Promise((r) => setTimeout(r, 10));
                window.imChat.showMemoryRecallNotice(
                    app.getFriendById(f.id),
                    recall,
                    container,
                    null,
                    'run-117',
                );
                return (
                    !container.querySelector(
                        '.memory-recall-narration:not(.favorite-saved-narration)',
                    ) &&
                    app
                        .getFriendById(f.id)
                        .memory.longTermEntries.some((e) => e.id === '117-memory')
                );
            },
        );
        await check(
            'Loves date UI sets day count, clears to opening date, validates and rolls back failure',
            async () => {
                const app = window.lovesApp,
                    f = window.imApp.getFriendById('117-char');
                app.currentFriend = f;
                app.enterLovesSpace(f);
                app.openAnniversaryView();
                document.getElementById('lovers-together-date-card').click();
                const form = document.getElementById('lovers-anniversary-form'),
                    date = document.getElementById('lovers-anniversary-date');
                if (form.dataset.anniversaryId !== 'together-date' || date.required)
                    return 'editor';
                date.value = '2026-10-01';
                await app.saveAnniversary();
                let live = window.imApp.getFriendById(f.id);
                if (
                    live.lovesData.togetherDate !== '2026-10-01' ||
                    app.getLovesDaysCount(live, new Date(2026, 9, 22)) !== 22
                )
                    return 'save/count';
                app.openAnniversaryEditor('together-date');
                await app.deleteAnniversary();
                live = window.imApp.getFriendById(f.id);
                if (
                    live.lovesData.togetherDate !== '' ||
                    app.getLovesDaysCount(live, new Date(2026, 9, 22)) !== 3
                )
                    return 'clear';
                await app.saveTogetherDate('bad-date');
                if (window.imApp.getFriendById(f.id).lovesData.togetherDate !== '')
                    return 'invalid';
                const persist = app.persistFriendState;
                app.persistFriendState = async (friend, options) => {
                    options.mutate(friend);
                    return false;
                };
                try {
                    await app.saveTogetherDate('2020-01-01');
                } finally {
                    app.persistFriendState = persist;
                }
                if (window.imApp.getFriendById(f.id).lovesData.togetherDate !== '')
                    return 'failure rollback';
                await app.saveTogetherDate('2026-10-01');
                return true;
            },
        );
        await check('offline speech uses APK wave keyframes and respects reduced motion', () => {
            const el = document.createElement('div');
            el.className = 'offline-speech-wave is-playing';
            el.innerHTML = '<span></span>';
            document.body.appendChild(el);
            const animation = getComputedStyle(el.firstChild).animationName;
            const frames = [...document.styleSheets]
                .filter((s) => s.href?.includes('/css/imessage.css'))
                .flatMap((s) => [...s.cssRules])
                .find((r) => r.name === 'offline-speech-wave-pulse');
            el.remove();
            return animation === 'offline-speech-wave-pulse' && !!frames;
        });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await check('reduced motion stops offline waveform', () => {
            const el = document.createElement('div');
            el.className = 'offline-speech-wave is-playing';
            el.innerHTML = '<span></span>';
            document.body.appendChild(el);
            const name = getComputedStyle(el.firstChild).animationName;
            el.remove();
            return name === 'none';
        });
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await check(
            'late music URLs and play errors cannot replace or report errors for a newer track',
            async () => {
                const t = window.__playback117,
                    audio = t.audio,
                    state = t.state;
                audio.load = () => {};
                audio.play = async () => {};
                let resolvers = {};
                t.setResolver(
                    (track) =>
                        new Promise(
                            (resolve, reject) => (resolvers[track.id] = { resolve, reject }),
                        ),
                );
                const a = { id: 'late-a' },
                    b = { id: 'current-b' };
                state.currentTrack = a;
                const pendingA = t.start(a);
                state.currentTrack = b;
                const pendingB = t.start(b);
                resolvers[b.id].resolve('https://example.invalid/b.mp3');
                if (!(await pendingB)) return 'new play';
                resolvers[a.id].resolve('https://example.invalid/a.mp3');
                if ((await pendingA) || !audio.src.endsWith('/b.mp3'))
                    return 'late URL replaced track';
                state.pendingPlayStatTrackId = b.id;
                window.__toasts = [];
                const c = { id: 'late-c' },
                    d = { id: 'current-d' };
                state.currentTrack = c;
                const pc = t.start(c);
                state.currentTrack = d;
                const pd = t.start(d);
                resolvers[d.id].resolve('https://example.invalid/d.mp3');
                await pd;
                state.pendingPlayStatTrackId = d.id;
                resolvers[c.id].reject(new Error('stale failure'));
                await pc;
                if (
                    window.__toasts.length ||
                    state.pendingPlayStatTrackId !== d.id ||
                    state.playbackStartingAttemptId !== 0
                )
                    return 'stale failure mutated state';
                const e = { id: 'late-play-e' },
                    f = { id: 'current-f' };
                state.currentTrack = e;
                let rejectPlay;
                audio.play = () => new Promise((resolve, reject) => (rejectPlay = reject));
                const pe = t.start(e);
                resolvers[e.id].resolve('https://example.invalid/e.mp3');
                await Promise.resolve();
                await Promise.resolve();
                audio.play = async () => {};
                state.currentTrack = f;
                const pf = t.start(f);
                resolvers[f.id].resolve('https://example.invalid/f.mp3');
                await pf;
                rejectPlay(new Error('old play failed'));
                await pe;
                return !window.__toasts.length && audio.src.endsWith('/f.mp3');
            },
        );
        await page.reload({ waitUntil: 'load' });
        await page.evaluate(() => window.appStorage.ready);
        await page.waitForFunction(
            () => window.imChat?.openChatTab && window.imApp.getFriendById('117-char'),
        );
        await check(
            'new per-chat metadata, Loves date and dismissed notices survive reload',
            () => {
                const app = window.imApp,
                    f = app.getFriendById('117-char');
                return (
                    f.separateUserAvatarEnabled === true &&
                    f.userAvatarsByAccount['117-account'] === 'data:image/png;base64,aGVsbG8=' &&
                    f.autoReplyDelayEnabled === true &&
                    f.builtinLivingVibeEnabled === false &&
                    f.lovesData.togetherDate === '2026-10-01' &&
                    app.isChatNoticeDismissed(f, 'favorite:run-117') &&
                    !f.messages.some((m) => m.id === '117-notice')
                );
            },
        );
        if (process.env.QA_DIR) {
            await page.waitForFunction(
                () =>
                    typeof window.imApp.openChatSettingsForFriend === 'function' &&
                    typeof window.imApp.openOnlinePromptSettings === 'function' &&
                    typeof window.updateAccountById === 'function' &&
                    window.getAccounts().some((a) => a.id === '117-account'),
            );
            fs.mkdirSync(process.env.QA_DIR, { recursive: true });
            await page.evaluate(() => {
                document.getElementById('u2-login-screen')?.remove();
                document.body.classList.remove('u2-login-locked');
                window.imApp.openChatSettingsForFriend(window.imApp.getFriendById('117-char'));
                document.getElementById('chat-bind-id-btn').click();
            });
            await page.screenshot({ path: path.join(process.env.QA_DIR, 'avatar-tablet.png') });
            await page.evaluate(async () => {
                window.closeView(document.getElementById('bind-account-detail-sheet'));
                await window.imApp.openOnlinePromptSettings(window.imApp.getFriendById('117-char'));
                document.querySelector('[data-prompt-action="new"]').click();
            });
            await page.waitForTimeout(100);
            await page.evaluate(() => {
                const input = document.querySelector('.online-prompt-field input');
                input.value = 'Unsaved';
                input.dispatchEvent(new Event('input'));
                document.querySelector('[data-prompt-action="close"]').click();
            });
            await page.waitForTimeout(100);
            await page.screenshot({
                path: path.join(process.env.QA_DIR, 'prompt-confirm-tablet.png'),
            });
        }
        assert.deepEqual(errors, [], 'uncaught browser errors');
        console.log('RESULT', JSON.stringify({ passed, errors }, null, 2));
    } finally {
        await browser.close();
        await new Promise((resolve) => server.close(resolve));
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
