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
                    '    window.__playbackTest={state,cyclePlaybackMode,resetShuffleHistory,playShuffleDirection,playQueueDirection,handleTrackEnded,setPlayTrack:fn=>playTrack=fn,getPlayTrack:()=>playTrack};\n    window.libraryApp = {',
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
            await window.shoppingDataReadyPromise;
            document.getElementById('u2-login-screen')?.remove();
            document.body.classList.remove('u2-login-locked');
            const char = {
                id: 'apk113-char',
                type: 'char',
                nickname: 'Gift sender',
                realName: 'Gift sender',
                persona: 'A thoughtful coffee enthusiast who speaks briefly.',
                avatarUrl: 'assets/moren-thumb.jpg',
                messages: [],
            };
            const npc = { id: 'apk113-npc', type: 'npc', nickname: 'NPC', messages: [] };
            const group = {
                id: 'apk113-group',
                type: 'group',
                nickname: 'Group',
                members: [char.id, npc.id],
                messages: [],
                memory: {
                    relationships: [{ targetId: char.id, targetType: 'char', relation: 'friend' }],
                },
            };
            await window.imApp.commitFriendsChange(() =>
                window.imData.friends.push(char, npc, group),
            );
            await window.imChat.openChatTab(window.imApp.getFriendById(char.id));
            window.openView(document.getElementById('imessage-view'));
        });
        await check('new controls, retained input guards and unique IDs', () => {
            const ids = [
                'library-player-mode',
                'library-mini-mode',
                'shopping-search-count',
                'shopping-manual-add-modal',
                'offline-speech-overlay',
                'desktop-preset-name',
                'desktop-preset-switch-dialog',
                'char-user-remark-detail-modal',
                'cphone-generation-status',
                'cphone-contact-delete',
            ];
            const duplicates = ids.filter((id) => document.querySelectorAll('#' + id).length !== 1);
            if (duplicates.length) return { duplicates };
            return (
                !!document
                    .querySelector('#library-player-mode')
                    ?.closest('.library-player-header') &&
                document.getElementById('shopping-search-count').value === '3' &&
                document
                    .getElementById('shopping-search-count')
                    .parentElement.textContent.replace(/\s/g, '') === 'Quantity1-10' &&
                !document
                    .querySelector('#cphone-sms-search')
                    .closest('label')
                    .contains(document.getElementById('cphone-generation-status')) &&
                !document.querySelector(
                    'script[src*="4_chat_ime_guard"],script[src*="4_chat_input_optimization"],script[src*="mobile_input_compat_patch"]',
                ) &&
                document.getElementById('delete-world-book-btn').textContent.trim() === '删除世界书'
            );
        });
        await check('identity and reply selectors have no blue focus frame', () => {
            const friend = window.imApp.getFriendById('apk113-char');
            window.imApp.openChatSettingsForFriend(friend);
            const identity = document.getElementById('chat-contact-type-select');
            identity.focus();
            const identityFocus = {
                outline: getComputedStyle(identity).outlineStyle,
                shadow: getComputedStyle(identity).boxShadow,
            };
            document.querySelector('#chat-settings-segment [data-tab="theme"]').click();
            const reply = document.getElementById('chat-reply-style-select');
            reply.focus();
            const replyStyle = getComputedStyle(reply);
            const replyFocus = {
                outline: replyStyle.outlineStyle,
                shadow: replyStyle.boxShadow,
                border: replyStyle.borderColor,
            };
            window.closeView(document.getElementById('chat-settings-sheet'));
            return (
                identityFocus.outline === 'none' &&
                identityFocus.shadow === 'none' &&
                replyFocus.outline === 'none' &&
                replyFocus.shadow === 'none' &&
                replyFocus.border === 'rgb(229, 229, 234)'
            );
        });
        await check('manual Food and Mall: English fields, validation and storage', async () => {
            const shop = window.shoppingApp;
            for (const tab of ['food', 'mall']) {
                shop.currentTab = tab;
                shop.openManualAdd();
                if (
                    document.getElementById('shopping-manual-add-title').textContent !==
                    (tab === 'food' ? 'ADD · FOOD' : 'ADD · MALL')
                )
                    return 'title';
                shop.manualNameInput.value = 'Manual ' + tab;
                shop.manualPriceInput.value = '12.50';
                shop.manualDescInput.value = 'Personal description';
                if (!shop.handleManualAdd()) return 'add failed';
                const stored = JSON.parse(
                    window.u2LegacyStorageFacade.getItem('shopping_manual_' + tab),
                );
                if (
                    stored.at(-1).name !== 'Manual ' + tab ||
                    stored.at(-1).desc !== 'Personal description'
                )
                    return stored;
            }
            const input = document.getElementById('shopping-manual-name');
            const modal = document.getElementById('shopping-manual-add-modal');
            modal.classList.add('active');
            input.focus();
            const style = getComputedStyle(input),
                resize = getComputedStyle(document.getElementById('shopping-manual-desc')).resize;
            modal.classList.remove('active');
            input.blur();
            return (
                input.placeholder === 'Enter item name' &&
                document.getElementById('shopping-manual-desc').placeholder ===
                    'Enter item description' &&
                !/255, 149, 0|255, 165, 0/.test(style.borderColor) &&
                resize === 'none' &&
                !document.querySelector(
                    '#shopping-delete-product-btn,#shopping-food-delete-product-btn',
                )
            );
        });
        await check(
            'Shop quantity reaches request; excess truncated; short result rejected',
            async () => {
                const shop = window.shoppingApp,
                    fetch = window.fetch,
                    config = window.getApiConfig;
                let count = 5,
                    prompt = '';
                window.getApiConfig = () => ({
                    endpoint: 'https://test.invalid/v1',
                    apiKey: 'test',
                    model: 'test',
                });
                window.fetch = async (url, options) => {
                    prompt = JSON.parse(options.body).messages[0].content;
                    return new Response(
                        JSON.stringify({
                            choices: [
                                {
                                    message: {
                                        content: JSON.stringify(
                                            Array.from({ length: count }, (_, i) => ({
                                                name: 'Generated ' + i,
                                                price: '$10.00',
                                                desc: 'mock',
                                                tags: [],
                                            })),
                                        ),
                                    },
                                },
                            ],
                        }),
                        { headers: { 'content-type': 'application/json' } },
                    );
                };
                try {
                    shop.currentTab = 'mall';
                    shop.searchCountInput.value = '2';
                    shop.searchInput.value = 'Coffee';
                    const key = 'shopping_generated_mall',
                        before = JSON.parse(
                            window.u2LegacyStorageFacade.getItem(key) || '[]',
                        ).length;
                    await shop.handleGenerateProducts();
                    const after = JSON.parse(
                        window.u2LegacyStorageFacade.getItem(key) || '[]',
                    ).length;
                    if (after - before !== 2 || !prompt.includes('恰好生成2个商品'))
                        return { before, after, prompt };
                    count = 1;
                    shop.searchCountInput.value = '3';
                    await shop.handleGenerateProducts();
                    const final = JSON.parse(
                        window.u2LegacyStorageFacade.getItem(key) || '[]',
                    ).length;
                    return final === after || { after, final };
                } finally {
                    window.fetch = fetch;
                    window.getApiConfig = config;
                }
            },
        );
        await check('order display and centered review preserve branch texts', () => {
            const shop = window.shoppingApp;
            shop.orders = [
                {
                    id: 'order-test',
                    items: [{ name: 'Manual food', priceVal: 12.5, mediaBg: '#fff', iconHtml: '' }],
                    method: 'pay for me (Long Payer Name)',
                    total: 17.5,
                    status: 'Paid',
                    gifted: true,
                    timestamp: Date.now() - 60000,
                },
            ];
            shop.renderOrders();
            const card = shop.ordersList.firstElementChild;
            if (
                card.querySelector('.shopping-order-method').textContent !== 'Pay' ||
                !card.querySelector('.shopping-order-gifted-icon i.fa-gift') ||
                shop.orders[0].method !== 'pay for me (Long Payer Name)'
            )
                return card.innerHTML;
            const giftButton = card.querySelector('.shopping-order-gifted-icon');
            const reviewButton = card.querySelector('.shopping-order-comment-btn');
            const giftStyle = getComputedStyle(giftButton);
            const reviewStyle = getComputedStyle(reviewButton);
            if (
                giftButton.getBoundingClientRect().width !==
                    reviewButton.getBoundingClientRect().width ||
                giftButton.getBoundingClientRect().height !==
                    reviewButton.getBoundingClientRect().height ||
                giftStyle.backgroundImage !== reviewStyle.backgroundImage ||
                giftStyle.backgroundColor !== reviewStyle.backgroundColor
            )
                return {
                    gift: giftButton.getBoundingClientRect().toJSON(),
                    review: reviewButton.getBoundingClientRect().toJSON(),
                    giftBackground: [giftStyle.backgroundImage, giftStyle.backgroundColor],
                    reviewBackground: [reviewStyle.backgroundImage, reviewStyle.backgroundColor],
                };
            card.querySelector('.shopping-order-comment-btn').click();
            const result =
                !!shop.ratingSheet.querySelector('.shopping-centered-card') &&
                document.getElementById('shopping-rating-title').textContent === 'REVIEWS' &&
                shop.ratingText.placeholder ===
                    'If you want to create something of value, be prepared to be judged.' &&
                shop.ratingSubmit.textContent === 'submit review';
            document.getElementById('shopping-rating-close').click();
            return result;
        });
        await check(
            'Char gift uses blue card and existing click-open detail; metadata persists',
            async () => {
                const a = window.imApp,
                    id = 'apk113-char';
                const gift = {
                    id: 'incoming-gift',
                    role: 'assistant',
                    type: 'gift',
                    giftName: 'Espresso',
                    giftValue: 32,
                    giftDescription: 'For our quiet morning together.',
                    giftStatus: 'received',
                    shopGift: {
                        itemName: 'Espresso',
                        price: 32,
                        senderRole: 'assistant',
                        senderName: 'Gift sender',
                        note: 'For our quiet morning together.',
                    },
                    timestamp: Date.now(),
                };
                if (!(await a.appendFriendMessage(id, gift, { silent: true }))) return 'save';
                const friend = a.getFriendById(id);
                await window.imChat.openChatTab(friend);
                const container = document.querySelector(
                    '#chat-interface-' + id + ' .ins-chat-messages',
                );
                window.imChat.rerenderChatContainer(friend, container, { scroll: false });
                const card = container.querySelector(
                    '[data-message-id="incoming-gift"] .gift-message-card',
                );
                if (!card) return container.innerHTML;
                card.click();
                const detail = document.querySelector('.gift-detail-card');
                const correct =
                    !!detail &&
                    detail.querySelector('.gift-detail-sender-name').textContent ===
                        'Gift sender' &&
                    detail.querySelector('.gift-detail-name').textContent === 'Espresso' &&
                    detail.querySelector('.gift-detail-value').textContent.includes('$32.00') &&
                    detail.textContent.includes('For our quiet morning together.') &&
                    !container.querySelector('.im-shop-gift-card');
                document.querySelector('.gift-detail-overlay')?.remove();
                const stored = await window.appStorage.withStore(
                    [window.appStorage.STORES.imMessages],
                    'readonly',
                    (stores) =>
                        window.appStorage.requestToPromise(
                            stores[window.appStorage.STORES.imMessages].get('incoming-gift'),
                        ),
                );
                return (
                    correct &&
                    stored.giftDescription === gift.giftDescription &&
                    stored.shopGift.note === gift.giftDescription
                );
            },
        );
        await check(
            'AI gift protocol parses, limits one gift and keeps the generated note',
            async () => {
                const oldFetch = window.fetch,
                    oldConfig = window.getApiConfig,
                    oldApi = window.u2Api;
                let requests = 0,
                    prompt = '';
                const reply =
                    '<chat_json>' +
                    JSON.stringify([
                        { type: 'text', text: 'A quiet coffee break for us.', translation: '' },
                        {
                            type: 'shop_gift',
                            itemName: 'Coffee beans',
                            price: 19.5,
                            note: 'For our next slow morning.',
                        },
                        {
                            type: 'shop_gift',
                            itemName: 'Duplicate',
                            price: 1,
                            note: 'Must be ignored.',
                        },
                        { type: 'text', text: 'I picked your favorite roast.', translation: '' },
                    ]) +
                    '</chat_json>';
                window.getApiConfig = () => ({
                    endpoint: 'https://test.invalid/v1',
                    apiKey: 'test',
                    model: 'test',
                    temperature: 0.7,
                });
                window.fetch = async (url, options) => {
                    if (!String(url).startsWith('https://test.invalid'))
                        return oldFetch(url, options);
                    requests++;
                    const body =
                        typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
                    prompt = JSON.stringify(body.messages);
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
                window.u2Api = { ...oldApi, fetchChatCompletion: window.fetch };
                try {
                    const a = window.imApp,
                        id = 'apk113-char',
                        friend = a.getFriendById(id);
                    await a.appendFriendMessage(
                        id,
                        {
                            id: 'gift-request',
                            role: 'user',
                            type: 'text',
                            content: 'Could you pick a coffee for me?',
                            timestamp: Date.now(),
                        },
                        { silent: true },
                    );
                    await window.imChat.handleAiReply(
                        a.getFriendById(id),
                        document.querySelector('#chat-interface-' + id + ' .ins-chat-messages'),
                        null,
                        { source: 'manual', silent: true },
                    );
                    const gifts = a
                        .getFriendById(id)
                        .messages.filter((m) => m.type === 'gift' && m.giftName === 'Coffee beans');
                    return (
                        (requests > 0 &&
                            prompt.includes('shop_gift') &&
                            prompt.includes('note') &&
                            gifts.length === 1 &&
                            gifts[0].giftDescription === 'For our next slow morning.' &&
                            !a
                                .getFriendById(id)
                                .messages.some(
                                    (m) => m.type === 'gift' && m.giftName === 'Duplicate',
                                )) || {
                            requests,
                            gifts,
                            types: a
                                .getFriendById(id)
                                .messages.map((m) => ({ type: m.type, content: m.content })),
                        }
                    );
                } finally {
                    window.fetch = oldFetch;
                    window.getApiConfig = oldConfig;
                    window.u2Api = oldApi;
                }
            },
        );
        await check('existing User gift notes and custom Shop gifting remain intact', async () => {
            const a = window.imApp,
                id = 'apk113-char',
                note = 'A personal custom note. '.repeat(20),
                msg = {
                    id: 'existing-user-gift',
                    role: 'user',
                    type: 'gift',
                    giftName: 'Personal gift',
                    giftValue: 32,
                    giftDescription: note,
                    giftStatus: 'pending',
                    timestamp: Date.now(),
                };
            if (!(await a.appendFriendMessage(id, msg, { silent: true }))) return false;
            const stored = await window.appStorage.withStore(
                [window.appStorage.STORES.imMessages],
                'readonly',
                (stores) =>
                    window.appStorage.requestToPromise(
                        stores[window.appStorage.STORES.imMessages].get(msg.id),
                    ),
            );
            const shop = window.shoppingApp;
            shop.openGiftComposer(a.getFriendById(id), {
                items: [{ name: 'Personal gift' }],
                total: 32,
                method: 'Pay',
            });
            const input = document.querySelector('.shopping-gift-compose-input');
            input.value = 'My custom note';
            const intact = input.value === 'My custom note';
            document.querySelector('.shopping-gift-compose-cancel').click();
            return stored.giftDescription === note && intact;
        });
        await check('automatic reply gate: successful User send only, Char only', () => {
            const old = window.imChat.handleAiReply,
                friend = window.imApp.getFriendById('apk113-char');
            let calls = 0;
            window.imChat.handleAiReply = async (f, c, b, o) => {
                if (o.source === 'auto_reply') calls++;
            };
            try {
                friend.autoReplyEnabled = false;
                window.imChat.maybeAutoReplyAfterUserMessage(friend, null, { role: 'user' });
                friend.autoReplyEnabled = true;
                window.imChat.maybeAutoReplyAfterUserMessage(friend, null, { role: 'user' });
                window.imChat.maybeAutoReplyAfterUserMessage(friend, null, {
                    role: 'user',
                    deliveryStatus: 'blocked',
                });
                window.imChat.maybeAutoReplyAfterUserMessage(friend, null, {
                    role: 'user',
                    excludedFromContext: true,
                });
                window.imChat.maybeAutoReplyAfterUserMessage(friend, null, { role: 'assistant' });
                window.imChat.maybeAutoReplyAfterUserMessage(
                    window.imApp.getFriendById('apk113-npc'),
                    null,
                    { role: 'user' },
                );
                return calls === 1;
            } finally {
                window.imChat.handleAiReply = old;
                friend.autoReplyEnabled = false;
            }
        });
        await check('Char/NPC switch keeps relationships and other settings', async () => {
            const a = window.imApp,
                friend = a.getFriendById('apk113-char');
            friend.autoReplyEnabled = true;
            if (!(await a.changeFriendType(friend.id, 'npc'))) return 'to npc';
            let group = a.getFriendById('apk113-group');
            if (
                group.memory.relationships.find((r) => r.targetId === friend.id)?.targetType !==
                'npc'
            )
                return group.memory;
            if (!(await a.changeFriendType(friend.id, 'char'))) return 'to char';
            return (
                a.getFriendById(friend.id).autoReplyEnabled === true &&
                a
                    .getFriendById('apk113-group')
                    .memory.relationships.find((r) => r.targetId === friend.id)?.targetType ===
                    'char'
            );
        });
        await check(
            'Pay uses current balance and never falls back from a missing card',
            async () => {
                await window.payDataReadyPromise;
                const card = window.getPayCards()[0];
                const before = Number(card.balance),
                    n = card.transactions.length;
                if (window.addPayTransaction(1, 'invalid', 'expense', 'missing-card'))
                    return 'fallback';
                if (window.addPayTransaction(before + 1, 'excess', 'expense', card.id))
                    return 'overspent';
                if (window.addPayTransaction(1, 'invalid type', 'unknown', card.id)) return 'type';
                if (
                    !window.addPayTransaction(1, 'first', 'expense', card.id) ||
                    !window.addPayTransaction(1, 'second', 'expense', card.id)
                )
                    return 'valid rejected';
                const latest = window.getPayCards().find((c) => c.id === card.id);
                return (
                    latest.balance === before - 2 &&
                    latest.transactions.length === n + 2 &&
                    latest.transactions[0].id !== latest.transactions[1].id
                );
            },
        );
        await check(
            'family card consumption is saved once with remaining credit and can be deleted',
            async () => {
                window.addOrUpdateFamilyCard('apk113-char', 'Gift sender', 100);
                if (!window.addPayTransaction(12.5, 'Coffee', 'expense', 'family_apk113-char'))
                    return 'payment';
                await new Promise((r) => setTimeout(r, 250));
                const a = window.imApp,
                    friend = a.getFriendById('apk113-char'),
                    messages = friend.messages.filter((m) => m.noticeKind === 'family_card_spend');
                if (messages.length !== 1 || messages[0].familyCardSpend.balance !== 87.5)
                    return messages;
                const text = a.formatSystemNoticeForApiContext(messages[0], friend);
                if (!text.includes('12.50') || !text.includes('87.50')) return text;
                const container = document.querySelector(
                    '#chat-interface-apk113-char .ins-chat-messages',
                );
                window.imChat.rerenderChatContainer(friend, container, { scroll: false });
                const button = container.querySelector('.chat-notice-delete');
                if (!button) return 'no delete button';
                const remove = a.removeFriendMessages;
                let deletion;
                a.removeFriendMessages = (...args) => (deletion = remove(...args));
                button.click();
                const saved = await deletion;
                a.removeFriendMessages = remove;
                if (!saved) return { saved, disabled: button.disabled };
                const tx = window.getPayCards().find((c) => c.id === 'family_apk113-char')
                    .transactions[0];
                return (
                    (tx.familyCardSpend.noticeStatus === 'sent' &&
                        !a
                            .getFriendById(friend.id)
                            .messages.some((m) => m.id === messages[0].id)) || {
                        tx,
                        remaining: a
                            .getFriendById(friend.id)
                            .messages.filter((m) => m.noticeKind === 'family_card_spend'),
                    }
                );
            },
        );
        await check(
            'voice playback and transcript are independent; iOS preparation is reused',
            async () => {
                const a = window.imApp,
                    id = 'apk113-char',
                    tts = window.u2Tts;
                let generated = 0,
                    played = 0;
                window.u2Tts = {
                    ...tts,
                    canSpeakForFriend: () => true,
                    resolveFriendTtsSettings: () => ({ enabled: true }),
                    prepareSpeech: async () => {
                        generated++;
                        return 'data:audio/mpeg;base64,SUQzBAAAAAAA';
                    },
                    playAudioUrl: async () => {
                        played++;
                    },
                };
                try {
                    await a.appendFriendMessage(
                        id,
                        {
                            id: 'voice113',
                            role: 'assistant',
                            type: 'voice_message',
                            text: 'A short voice message',
                            transcript: 'A short voice message',
                            timestamp: Date.now(),
                        },
                        { silent: true },
                    );
                    const friend = a.getFriendById(id),
                        container = document.querySelector(
                            '#chat-interface-' + id + ' .ins-chat-messages',
                        );
                    window.imChat.rerenderChatContainer(friend, container, { scroll: false });
                    const row = container.querySelector('[data-message-id="voice113"]'),
                        text = row.querySelector('.voice-message-transcript');
                    if (row.querySelector('.voice-message-mic')) return 'old microphone remains';
                    row.querySelector('.voice-message-bubble-inner').click();
                    await new Promise((r) => setTimeout(r, 20));
                    if (text.hidden || generated || played)
                        return { text: text.hidden, generated, played };
                    const button = row.querySelector('.voice-message-play');
                    button.click();
                    await new Promise((r) => setTimeout(r, 150));
                    if (
                        generated !== 1 ||
                        played !== 0 ||
                        !row
                            .querySelector('.voice-message-playback-status')
                            .textContent.includes('准备好')
                    )
                        return { generated, played };
                    button.click();
                    await new Promise((r) => setTimeout(r, 40));
                    return generated === 1 && played === 1;
                } finally {
                    window.u2Tts = tts;
                }
            },
        );
        await check(
            'worldbook imports support multiple files, partial failure and frozen folder',
            async () => {
                activeWbGroupName = 'Import target';
                const input = document.getElementById('wb-import-file'),
                    files = [
                        new File(['first'], 'first.txt'),
                        new File(['second'], 'second.txt'),
                        new File([''], 'empty.txt'),
                    ];
                const read = files[0].text.bind(files[0]);
                files[0].text = async () => {
                    await new Promise((r) => setTimeout(r, 30));
                    return read();
                };
                Object.defineProperty(input, 'files', { configurable: true, value: files });
                input.dispatchEvent(new Event('change', { bubbles: true }));
                activeWbGroupName = 'Different folder';
                await new Promise((r) => setTimeout(r, 250));
                const books = window
                    .getWorldBooks()
                    .filter((b) => ['first', 'second'].includes(b.name));
                if (
                    books.length !== 2 ||
                    books.some((b) => b.group !== 'Import target') ||
                    new Set(books.map((b) => b.id)).size !== 2
                )
                    return books;
                books[0].isGlobal = true;
                const ids = window.getVisibleWorldBookMountIds([
                    books[0].id,
                    books[1].id,
                    books[1].id,
                    'missing',
                ]);
                return input.multiple && ids.length === 1 && ids[0] === String(books[1].id);
            },
        );
        await check('Netflix globals are live, manually mounted books remain snapshots', () => {
            const app = window.netflixApp,
                old = window.getGlobalWorldBookContextByPosition;
            const global = window.getWorldBooks().find((b) => b.isGlobal),
                manual = window.getWorldBooks().find((b) => !b.isGlobal);
            window.getGlobalWorldBookContextByPosition = (position) =>
                position === 'before_role' ? 'GLOBAL-LIVE' : '';
            try {
                const run = {
                    setup: {
                        worldBooks: [
                            { id: global.id, name: 'old global', content: 'STALE-GLOBAL' },
                            { id: manual.id, name: 'manual', content: 'SNAPSHOT' },
                        ],
                    },
                };
                const text = app.getWorldBookPromptContext(run, 'test');
                return (
                    text.includes('GLOBAL-LIVE') &&
                    text.includes('SNAPSHOT') &&
                    !text.includes('STALE-GLOBAL') &&
                    app.getSelectableWorldBooks().every((b) => !b.isGlobal)
                );
            } finally {
                window.getGlobalWorldBookContextByPosition = old;
            }
        });
        await check('Weibo images distribute to posts while using existing detail UI', () => {
            const app = window.lovesApp,
                posts = [{ text: 'one' }, { text: 'two' }, { text: 'three' }],
                images = [{ url: 'one' }, { url: 'two' }, { url: 'three' }, { url: 'four' }];
            const split = app.distributeWeiboAlbum(posts, images);
            return (
                split[0][0] === images[2] &&
                split[1].length === 2 &&
                split[2][0] === images[1] &&
                app.getWeiboRandomImage({ id: 'a' }, 'main', 0).endsWith('/400/400')
            );
        });
        await check(
            'CPhone background generation freezes its owner and can finish after closing',
            async () => {
                const app = window.cphoneApp,
                    old = app.requestJsonGeneration;
                app.selectedId = 'apk113-char';
                document.getElementById('cphone-create-contact-count').value = '1';
                document.getElementById('cphone-create-contact-rounds').value = '1';
                document.getElementById('cphone-create-contact-direction').value =
                    'A brief coffee invitation.';
                let finish;
                app.requestJsonGeneration = () => new Promise((resolve) => (finish = resolve));
                try {
                    const pending = app.createContacts();
                    if (app.creationJob?.ownerId !== 'apk113-char') return 'owner not captured';
                    app.closeCreateContact();
                    app.selectedId = 'apk113-npc';
                    finish({
                        contacts: [
                            {
                                realName: 'Background contact',
                                nickname: 'Background coffee',
                                signature: 'Coffee is ready',
                                persona: 'A friendly colleague',
                                relationship: 'colleague',
                                rounds: [
                                    [
                                        { speaker: 'char', text: 'Coffee?' },
                                        { speaker: 'account', text: 'Yes, please.' },
                                    ],
                                ],
                            },
                        ],
                    });
                    if (!(await pending)) return app.creationNotice;
                    const owner = window.imApp.getFriendById('apk113-char'),
                        other = window.imApp.getFriendById('apk113-npc');
                    const linked = owner.linkedAccountChats.find(
                        (chat) => chat.name === 'Background coffee',
                    );
                    if (
                        !linked ||
                        other.linkedAccountChats?.some((chat) => chat.name === 'Background coffee')
                    )
                        return { linked, other };
                    const generated = window.imApp.getFriendById(linked.sourceNpcId);
                    if (
                        !document
                            .getElementById('cphone-contact-sheet')
                            .contains(document.getElementById('cphone-contact-delete'))
                    )
                        return 'misplaced delete control';
                    app.selectedId = owner.id;
                    app.activeContact = {
                        kind: 'linked',
                        chatId: linked.id,
                        targetId: generated.id,
                    };
                    await window.imApp.commitFriendsChange(() => {
                        const group = window.imApp.getFriendById('apk113-group');
                        group.members.push(generated.id);
                        group.adminMemberIds = [generated.id];
                        group.memberTitles = { [generated.id]: 'Coffee' };
                        group.memory.relationships.push({
                            targetId: generated.id,
                            targetType: 'npc',
                            relation: 'friend',
                        });
                        group.memory.mountSettings = { [generated.id]: true };
                    });
                    if (!(await app.deleteContact(app.activeContact))) return 'delete failed';
                    const group = window.imApp.getFriendById('apk113-group');
                    return (
                        !window.imApp.getFriendById(generated.id) &&
                        !group.members.includes(generated.id) &&
                        !group.adminMemberIds.includes(generated.id) &&
                        !group.memberTitles[generated.id] &&
                        !group.memory.mountSettings[generated.id] &&
                        !group.memory.relationships.some((r) => r.targetId === generated.id) &&
                        !window.imApp
                            .getFriendById(owner.id)
                            .linkedAccountChats.some((chat) => chat.id === linked.id)
                    );
                } finally {
                    app.requestJsonGeneration = old;
                    app.selectedId = 'apk113-char';
                }
            },
        );
        await check(
            'desktop presets save, switch and apply visuals without changing widget size or layout',
            async () => {
                await window.desktopDataReadyPromise;
                const wait = async (test) => {
                    for (let i = 0; i < 160; i++) {
                        if (test()) return;
                        await new Promise((r) => setTimeout(r, 25));
                    }
                    throw new Error(
                        'preset action timeout: ' +
                            document.getElementById('desktop-preset-status').textContent,
                    );
                };
                const original = window.getAppState('desktop'),
                    widgets = window.getHomeWidgetThemeConfigs();
                const id = Object.keys(window.getHomeWidgetPresetTargets())[0];
                if (!id) return 'no widget';
                const layout = JSON.stringify(original.pages),
                    size = JSON.stringify(widgets[id].size);
                document.getElementById('desktop-preset-name').value = 'Original test';
                document.getElementById('desktop-preset-save').click();
                await wait(
                    () =>
                        window.appStorage.readDomain('desktop_theme_presets', {}).presets
                            ?.length === 1 &&
                        !document.getElementById('desktop-preset-save').disabled,
                );
                await window.applyHomeWidgetPresetVisuals({
                    [id]: { ...widgets[id], color: '#123456', size: { cols: 1, rows: 1 }, span: 1 },
                });
                if (
                    JSON.stringify(window.getHomeWidgetThemeConfigs()[id].size) !== size ||
                    JSON.stringify(window.getAppState('desktop').pages) !== layout
                )
                    return 'geometry changed';
                window.u2ThemeState.bgUrl =
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z1pEAAAAASUVORK5CYII=';
                window.u2ThemeState.bgAssetId = '';
                window.u2ThemeState.apps[0].icon = window.u2ThemeState.bgUrl;
                window.u2ThemeState.apps[0].iconAssetId = '';
                document.getElementById('desktop-preset-name').value = 'Blue test';
                document.getElementById('desktop-preset-save').click();
                await wait(
                    () =>
                        window.appStorage.readDomain('desktop_theme_presets', {}).presets
                            ?.length === 2 &&
                        !document.getElementById('desktop-preset-save').disabled,
                );
                const meta = window.appStorage.readDomain('desktop_theme_presets', {}),
                    first = meta.presets[0];
                document.querySelector('.desktop-preset-switch').click();
                await wait(
                    () =>
                        window.appStorage.readDomain('desktop_theme_presets', {}).activeId ===
                            first.id && !document.getElementById('desktop-preset-save').disabled,
                );
                if (window.getHomeWidgetThemeConfigs()[id].color !== widgets[id].color)
                    return 'first preset did not restore';
                const second = meta.presets[1],
                    snapshot = window.appStorage.readDomain(
                        'desktop_theme_preset:' + second.id,
                        {},
                    ).snapshot;
                if (
                    !snapshot.background?.assetId ||
                    !(await window.appStorage.getAssetBlob(snapshot.background.assetId))
                )
                    return 'image not stored';
                document.querySelectorAll('.desktop-preset-switch')[1].click();
                await wait(
                    () =>
                        window.appStorage.readDomain('desktop_theme_presets', {}).activeId ===
                            second.id && !document.getElementById('desktop-preset-save').disabled,
                );
                return (
                    window.getHomeWidgetThemeConfigs()[id].color === '#123456' &&
                    window.u2ThemeState.bgUrl.startsWith('blob:') &&
                    JSON.stringify(window.getHomeWidgetThemeConfigs()[id].size) === size &&
                    JSON.stringify(window.getAppState('desktop').pages) === layout
                );
            },
        );
        await check(
            'offline dialogue opens its speech modal and persists a reusable voice asset',
            async () => {
                const a = window.imApp,
                    id = 'apk113-char',
                    tts = window.u2Tts;
                let generated = 0;
                window.u2Tts = {
                    ...tts,
                    canSpeakForFriend: () => true,
                    resolveFriendTtsSettings: () => ({ enabled: true }),
                    prepareSpeech: async () => {
                        generated++;
                        return 'data:audio/mpeg;base64,SUQzBAAAAAAA';
                    },
                    stopPlayback: () => {},
                    playAudioUrl: async () =>
                        Object.assign(new EventTarget(), {
                            paused: false,
                            ended: false,
                            pause() {
                                this.paused = true;
                            },
                            async play() {
                                this.paused = false;
                            },
                        }),
                };
                try {
                    await a.commitFriendsChange(() => {
                        const f = a.getFriendById(id);
                        f.offlineMeetingActive = true;
                        f.offlineCurrentSessionId = 'offline113-session';
                        f.offlineMessages = [
                            {
                                id: 'offline113',
                                role: 'assistant',
                                content:
                                    '<narration>He sets down two cups.</narration><speech>Good morning.</speech>',
                                timestamp: Date.now(),
                            },
                        ];
                    });
                    await window.imChat.openChatTab(a.getFriendById(id));
                    const page = document.querySelector('#chat-interface-' + id);
                    window.imChat.createAttachmentSheet(page);
                    document.getElementById('open-offline-chats-btn').click();
                    for (
                        let i = 0;
                        i < 80 &&
                        !document.querySelector(
                            '#offline-chat-view .offline-chat-speech.is-playable',
                        );
                        i++
                    )
                        await new Promise((r) => setTimeout(r, 25));
                    const speech = document.querySelector(
                        '#offline-chat-view .offline-chat-speech.is-playable',
                    );
                    if (!speech)
                        return {
                            html: document
                                .getElementById('offline-chat-view')
                                .innerHTML.slice(0, 2000),
                        };
                    speech.click();
                    await new Promise((r) => setTimeout(r, 200));
                    const overlay = document.getElementById('offline-speech-overlay');
                    if (overlay.hidden) return 'hidden';
                    if (
                        document.getElementById('offline-speech-text').textContent !==
                        'Good morning.'
                    )
                        return 'wrong text';
                    document.getElementById('offline-speech-regenerate').click();
                    for (
                        let i = 0;
                        i < 80 && !a.getFriendById(id).offlineMessages[0].ttsAudioAssets?.length;
                        i++
                    )
                        await new Promise((r) => setTimeout(r, 25));
                    const assets = a.getFriendById(id).offlineMessages[0].ttsAudioAssets;
                    document.getElementById('offline-speech-close').click();
                    document.getElementById('offline-chat-close-btn').click();
                    return (
                        (generated >= 1 &&
                            assets?.length === 1 &&
                            !!(await window.appStorage.getAssetBlob(assets[0].assetId))) || {
                            generated,
                            assets,
                            status: document.getElementById('offline-speech-status').textContent,
                        }
                    );
                } finally {
                    window.u2Tts = tts;
                }
            },
        );
        await check(
            'music modes: shuffle visits every track, previous follows history, single repeat keeps the track',
            () => {
                const t = window.__playbackTest,
                    state = t.state,
                    original = t.getPlayTrack(),
                    saved = {
                        tracks: state.tracks,
                        queue: state.queue,
                        currentTrack: state.currentTrack,
                        queueIndex: state.queueIndex,
                        mode: state.preferences.playbackMode,
                    };
                try {
                    state.tracks = ['a', 'b', 'c'].map((id) => ({
                        id,
                        title: id,
                        artist: 'test',
                        source: 'url',
                        mediaUrl: 'https://test.invalid/' + id + '.mp3',
                    }));
                    state.queue = ['a', 'b', 'c'];
                    state.currentTrack = state.tracks[0];
                    state.queueIndex = 0;
                    state.preferences.playbackMode = 'shuffle';
                    t.setPlayTrack((track, queue) => {
                        state.currentTrack = track;
                        state.queueIndex = queue.indexOf(track.id);
                    });
                    t.resetShuffleHistory('a');
                    const visited = ['a'];
                    t.playQueueDirection(1);
                    visited.push(state.currentTrack.id);
                    t.playQueueDirection(1);
                    visited.push(state.currentTrack.id);
                    if (new Set(visited).size !== 3) return { visited };
                    t.playQueueDirection(-1);
                    if (state.currentTrack.id !== visited[1]) return 'previous';
                    t.playQueueDirection(1);
                    if (state.currentTrack.id !== visited[2]) return 'forward history';
                    state.preferences.playbackMode = 'single_loop';
                    t.handleTrackEnded();
                    if (state.currentTrack.id !== visited[2]) return 'repeat';
                    state.preferences.playbackMode = 'list_loop';
                    state.currentTrack = state.tracks[2];
                    state.queueIndex = 2;
                    t.playQueueDirection(1);
                    return state.currentTrack.id === 'a';
                } finally {
                    t.setPlayTrack(original);
                    state.tracks = saved.tracks;
                    state.queue = saved.queue;
                    state.currentTrack = saved.currentTrack;
                    state.queueIndex = saved.queueIndex;
                    state.preferences.playbackMode = saved.mode;
                }
            },
        );
        await page.evaluate(() => {
            document.getElementById('library-player-mode').click();
        });
        await page.waitForTimeout(200);
        await check('music mode controls agree and preference persists', async () => {
            const prefs = await window.appStorage.getSetting('libraryPreferences', {});
            return (
                prefs.playbackMode === 'single_loop' &&
                document.getElementById('library-player-mode').title ===
                    document.getElementById('library-mini-mode').title
            );
        });
        await page.reload({ waitUntil: 'load' });
        await page.evaluate(() => window.appStorage.ready);
        await page.waitForFunction(
            () =>
                window.imApp?.ensureDataReady &&
                window.libraryApp &&
                document.querySelectorAll('.desktop-preset-card').length === 2,
        );
        await check(
            'new data survives reload without resending deleted family notices',
            async () => {
                await window.imApp.ensureDataReady();
                await window.payDataReadyPromise;
                await window.desktopDataReadyPromise;
                await new Promise((r) => setTimeout(r, 200));
                const a = window.imApp,
                    friend = a.getFriendById('apk113-char');
                await a.ensureFriendMessagesLoaded(friend);
                return (
                    (friend.messages.some(
                        (m) =>
                            m.type === 'gift' &&
                            m.giftName === 'Coffee beans' &&
                            m.giftDescription === 'For our next slow morning.',
                    ) &&
                        !friend.messages.some((m) => m.noticeKind === 'family_card_spend') &&
                        window.appStorage.readDomain('desktop_theme_presets', {}).presets
                            ?.length === 2 &&
                        (await window.appStorage.getSetting('libraryPreferences', {}))
                            .playbackMode === 'single_loop' &&
                        friend.offlineMessages[0].ttsAudioAssets?.length === 1 &&
                        window.u2ThemeState.bgUrl?.startsWith('blob:') &&
                        !!(await window.appStorage.getAssetBlob(window.u2ThemeState.bgAssetId)) &&
                        window.u2ThemeState.apps[0].iconAssetId === window.u2ThemeState.bgAssetId &&
                        window.u2ThemeState.apps[0].icon?.startsWith('blob:')) || {
                        theme: window.u2ThemeState.bgUrl,
                        asset: window.u2ThemeState.bgAssetId,
                        saved: window.appStorage.readDomain('settings', {}).themeState?.bgAssetId,
                        offline: friend.offlineMessages[0],
                        errors: document.body.dataset,
                    }
                );
            },
        );
        if (process.env.QA_DIR) {
            fs.mkdirSync(process.env.QA_DIR, { recursive: true });
            await page.evaluate(() => {
                document.getElementById('u2-login-screen')?.remove();
                document.body.classList.remove('u2-login-locked');
                window.shoppingApp.open();
                window.shoppingApp.currentTab = 'food';
                window.shoppingApp.openManualAdd();
            });
            await page.waitForTimeout(300);
            await page.screenshot({ path: path.join(process.env.QA_DIR, 'manual-ipad.png') });
            await page.setViewportSize({ width: 390, height: 844 });
            await page.waitForTimeout(300);
            await page.screenshot({ path: path.join(process.env.QA_DIR, 'manual-phone.png') });
            await page.evaluate(() => {
                window.shoppingApp.closeManualAdd();
                window.shoppingApp.initRatingSheet();
                window.shoppingApp.ratingSheet.classList.add('active');
            });
            await page.waitForTimeout(200);
            await page.screenshot({ path: path.join(process.env.QA_DIR, 'review-phone.png') });
            await page.evaluate(async () => {
                window.shoppingApp.ratingSheet.classList.remove('active');
                window.shoppingApp.close();
                const f = window.imApp.getFriendById('apk113-char');
                window.openView(document.getElementById('imessage-view'));
                await window.imChat.openChatTab(f);
                document
                    .querySelector('[data-message-id="incoming-gift"] .gift-message-card')
                    ?.click();
            });
            await page.waitForTimeout(300);
            await page.screenshot({ path: path.join(process.env.QA_DIR, 'gift-phone.png') });
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
