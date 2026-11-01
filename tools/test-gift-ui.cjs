// Gift-card integration regression: real app/storage, no live AI/API requests.
// Optional GIFT_BASELINE_REF compares Lover/detail pixels with an earlier commit.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
(async () => {
    const root = path.resolve(__dirname, '..');
    const baselineRef = process.env.GIFT_BASELINE_REF;
    const referenceFile = process.env.GIFT_REFERENCE_FILE;
    let referenceCss = '';
    if (referenceFile) {
        const source = fs.readFileSync(referenceFile, 'utf8');
        const start = source.indexOf('.gift-ig-container {');
        referenceCss = source.slice(start, source.indexOf('/* =========================================================', start));
    }
    const original = new Map();
    if (baselineRef) for (const file of ['css/imessage.css', 'js/imessage/4_chat_bubbles.js']) {
        original.set(file, execFileSync('git', ['show', `${baselineRef}:${file}`], { cwd: root }));
    }
    let useBaseline = false;
    const server = http.createServer((req, res) => {
        try {
            let relative = decodeURIComponent(new URL(req.url, 'http://local').pathname).replace(/^\//, '');
            if (!relative) relative = 'index.html';
            const file = path.join(root, relative);
            res.setHeader('Content-Type', { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.jpg': 'image/jpeg', '.png': 'image/png' }[path.extname(file)] || 'application/octet-stream');
            res.end(useBaseline && original.has(relative) ? original.get(relative) : fs.readFileSync(file));
        } catch { res.writeHead(404).end(); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
    const errors = [];
    async function open(width, height) {
        const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, userAgent: width > 700 ? 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)' });
        const page = await context.newPage();
        page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
        await page.goto('http://127.0.0.1:' + server.address().port);
        await page.waitForFunction(() => window.imChat?.openChatTab && window.shoppingApp?.sendGiftMessage);
        await page.evaluate(async () => {
            await window.globalDataReadyPromise;
            await window.imApp.ensureDataReady();
            document.getElementById('u2-login-screen')?.remove();
            document.body.classList.remove('u2-login-locked');
            const canvas = document.createElement('canvas'); canvas.width = canvas.height = 32;
            canvas.getContext('2d').fillRect(0, 0, 32, 32);
            const avatar = canvas.toDataURL();
            window.userState.name = 'Gift User'; window.userState.avatarUrl = avatar;
            const t = 1793556000000;
            const gifts = [
                { id: 'gift-user', role: 'user', type: 'gift', giftName: 'Espresso <Gift>', giftValue: 32, giftDescription: 'A note & a smile', giftStatus: 'pending', content: 'Gift: Espresso <Gift>\nValue $32.00', timestamp: t },
                { id: 'gift-reply', role: 'assistant', type: 'text', content: 'Thank you for the gift.', timestamp: t + 1 },
                { id: 'gift-char', role: 'assistant', type: 'gift', giftName: 'Flowers', giftValue: 88.88, giftDescription: 'For you', giftStatus: 'received', shopGift: { itemName: 'Flowers', price: 88.88, senderRole: 'assistant' }, timestamp: t + 2 },
                { id: 'legacy-gift', role: 'assistant', type: 'html', content: '<div>Gift Received: Legacy Flower\nValue $12.50</div>', timestamp: t + 3 },
            ];
            await window.imApp.commitFriendsChange(() => window.imData.friends.push({ id: 'gift-ui', type: 'char', nickname: 'Gift Char', avatarUrl: avatar, messages: gifts, showAvatar: false }));
            window.openView(document.getElementById('imessage-view'));
            await window.imChat.openChatTab(window.imApp.getFriendById('gift-ui'));
        });
        await page.locator('#chat-interface-gift-ui').waitFor({ state: 'visible' });
        await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' });
        return { context, page };
    }
    async function controls(page) {
        // Keep the sticky header's backdrop blur out of isolated card comparisons.
        await page.locator('#chat-interface-gift-ui .chat-sticky-container').evaluate(e => e.style.visibility = 'hidden');
        const snapshots = [];
        snapshots.metrics = [];
        for (const role of ['user', 'assistant']) for (const status of ['pending', 'received']) {
            await page.evaluate(({ role, status }) => {
                const pane = document.getElementById('chat-interface-gift-ui');
                const host = pane.querySelector('.ins-chat-messages'); host.replaceChildren();
                window.imChat.renderMessageBubble({ id: 'control', type: 'html', role, timestamp: 1793556000000, content: window.imChat.buildLovesInvitationCardHtml(status) }, window.imApp.getFriendById('gift-ui'), host);
            }, { role, status });
            snapshots.metrics.push(await page.locator('#chat-interface-gift-ui .loves-invitation-card').evaluate(e => [...e.querySelectorAll('*'),e,e.parentElement,e.parentElement.parentElement].map(n=>({tag:n.tagName,rect:n.getBoundingClientRect().toJSON(),style:Object.fromEntries([...getComputedStyle(n)].map(k=>[k,getComputedStyle(n).getPropertyValue(k)]))}))));
            snapshots.push(await page.locator('#chat-interface-gift-ui .loves-invitation-card').screenshot());
        }
        for (const role of ['user', 'assistant', 'legacy']) {
            await page.evaluate(role => {
                const host = document.querySelector('#chat-interface-gift-ui .ins-chat-messages'); host.replaceChildren();
                const friend = window.imApp.getFriendById('gift-ui');
                window.imChat.renderMessageBubble(friend.messages.find(m => role === 'legacy' ? m.id === 'legacy-gift' : m.type === 'gift' && m.role === role), friend, host);
                host.querySelector('.gift-message-card').click();
                // Isolate translucent detail pixels from the intentionally changed gift below.
                host.querySelector('.gift-message-card').style.visibility = 'hidden';
            }, role);
            snapshots.push(await page.locator('#chat-interface-gift-ui .gift-detail-card').screenshot());
            await page.locator('.gift-detail-overlay').click({ position: { x: 2, y: 2 } });
        }
        await page.locator('#chat-interface-gift-ui .chat-sticky-container').evaluate(e => e.style.visibility = '');
        return snapshots;
    }
    try {
        for (const [width, height] of [[390, 844], [820, 1180], [1180, 820]]) {
            if (process.env.GIFT_TARGET_WIDTH && width !== Number(process.env.GIFT_TARGET_WIDTH)) continue;
            let baseline;
            if (baselineRef) {
                useBaseline = true;
                const old = await open(width, height);
                baseline = await controls(old.page);
                await old.context.close();
                useBaseline = false;
            }
            const { context, page } = await open(width, height);
            if (baseline) {
                const current = await controls(page);
                assert.deepEqual(current.metrics, baseline.metrics, 'unchanged Lover computed styles and geometry');
                current.forEach((image, index) => assert.ok(image.equals(baseline[index]), `unchanged Lover/detail pixels ${width}/${index}`));
                console.log('PASS', width, 'Lover cards and gift details match baseline pixels');
            }
            if (referenceCss && width === 390) {
                await page.addStyleTag({ content: referenceCss });
                await page.evaluate(() => {
                    const stage = document.createElement('div'); stage.id = 'gift-reference-stage';
                    stage.style.cssText = 'position:fixed;top:100px;left:40px;width:284px;height:202px;background:white;z-index:99999;padding:30px 32px;box-sizing:border-box';
                    stage.innerHTML = '<div class="gift-message-card"><span class="gift-message-label">App Store &amp; iTunes</span></div>';
                    document.body.appendChild(stage);
                });
                const migrated = await page.locator('#gift-reference-stage').screenshot();
                await page.evaluate(() => { document.getElementById('gift-reference-stage').innerHTML = '<div class="gift-ig-container"></div>'; });
                const reference = await page.locator('#gift-reference-stage').screenshot();
                assert.ok(migrated.equals(reference), 'gift card, logo, label and full surrounding shadow match reference pixels');
                await page.locator('#gift-reference-stage').evaluate(stage => stage.remove());
                console.log('PASS gift card including shadow matches supplied CSS pixels');
            }
            const matrix = await page.evaluate(async () => {
                const pane = document.getElementById('chat-interface-gift-ui'), host = pane.querySelector('.ins-chat-messages');
                const saved = window.imApp.getFriendById('gift-ui');
                const before = JSON.stringify(saved.messages);
                const appearances = [];
                for (const mode of ['none', 'one', 'two']) for (const role of ['user', 'assistant']) for (const status of ['pending', 'received']) {
                    const friend = { ...saved, showAvatar: mode !== 'none', avatarDisplayMode: mode === 'none' ? 'one' : mode };
                    const gift = { ...saved.messages[0], id: `matrix-${mode}-${role}-${status}`, role, giftStatus: status, status };
                    host.replaceChildren();
                    window.imChat.renderMessageBubble(gift, friend, host, gift.timestamp);
                    const reply = { id: 'later', role: 'assistant', type: 'text', content: 'Later reply', timestamp: gift.timestamp + 10 };
                    friend.messages = [gift, reply];
                    window.imChat.renderMessageBubble(reply, friend, host, reply.timestamp);
                    const cards = host.querySelectorAll('.gift-message-card'), card = cards[0], style = getComputedStyle(card), logo = getComputedStyle(card, '::before');
                    const r = card.getBoundingClientRect(), h = host.getBoundingClientRect();
                    const avatar = card.closest('.chat-row').querySelector('.im-message-avatar')?.getBoundingClientRect();
                    appearances.push({ mode, role, status, count: cards.length, width: r.width, height: r.height, radius: style.borderRadius, background: style.backgroundImage, shadow: style.boxShadow, logo: [logo.width, logo.height, logo.backgroundImage], label: card.querySelector('.gift-message-label')?.textContent, received: card.classList.contains('is-received'), overflow: r.left < h.left - 1 || r.right > h.right + 1, overlapsAvatar: avatar ? !(avatar.right <= r.left - 4 || avatar.left >= r.right + 4) : false });
                }
                host.replaceChildren();
                const legacy = saved.messages.find(m => m.id === 'legacy-gift');
                window.imChat.renderMessageBubble(legacy, saved, host, legacy.timestamp);
                return { appearances, unchanged: JSON.stringify(saved.messages) === before, legacyCount: host.querySelectorAll('.gift-message-label').length };
            });
            assert.equal(matrix.unchanged, true);
            assert.equal(matrix.legacyCount, 1);
            for (const sample of matrix.appearances) {
                assert.equal(sample.count, 1, JSON.stringify(sample));
                assert.equal(sample.width, 220, JSON.stringify(sample)); assert.equal(sample.height, 138);
                assert.equal(sample.radius, '16px'); assert.equal(sample.label, 'App Store & iTunes');
                assert.equal(sample.received, false); assert.equal(sample.overflow, false); assert.equal(sample.overlapsAvatar, false);
                assert.match(sample.background, /repeating-radial-gradient/); assert.match(sample.shadow, /12px 28px/);
                assert.deepEqual(sample.logo.slice(0, 2), ['66px', '78px']); assert.match(sample.logo[2], /data:image\/svg/);
            }
            assert.equal(new Set(matrix.appearances.map(s => JSON.stringify([s.background, s.shadow, s.logo]))).size, 1);
            console.log('PASS', width, 'both roles/statuses, avatar modes, reply without receipt, legacy gift, data preserved');
            await page.evaluate(() => {
                const friend = window.imApp.getFriendById('gift-ui'), host = document.querySelector('#chat-interface-gift-ui .ins-chat-messages'); host.replaceChildren();
                friend.messages.forEach(m => window.imChat.renderMessageBubble(m, friend, host, m.timestamp));
            });
            for (const [id, name, value] of [['gift-user', 'Espresso <Gift>', 'Value $32.00'], ['gift-char', 'Flowers', 'Value $88.88'], // Storage has always defaulted absent legacy giftValue to zero; UI work must preserve details.
                ['legacy-gift', 'Legacy Flower', 'Value $0.00']]) {
                const card = page.locator(`[data-message-id="${id}"] .gift-message-card`);
                await card.click();
                assert.equal(await page.locator('.gift-detail-name').textContent(), name);
                assert.equal(await page.locator('.gift-detail-value').textContent(), value);
                await page.locator('.gift-detail-overlay').click({ position: { x: 2, y: 2 } });
                await card.focus(); await card.press('Enter'); assert.equal(await page.locator('.gift-detail-overlay').count(), 1);
                await page.locator('.gift-detail-overlay').click({ position: { x: 2, y: 2 } });
                await card.focus(); await card.press('Space'); assert.equal(await page.locator('.gift-detail-overlay').count(), 1);
                await page.locator('.gift-detail-overlay').click({ position: { x: 2, y: 2 } });
            }
            // Exercise the unchanged Shop sender outside the conversation, then reopen it.
            await page.locator('#chat-interface-gift-ui .im-chat-back-chevron').click();
            const shop = await page.evaluate(async () => {
                const friend = window.imApp.getFriendById('gift-ui'), before = friend.messages.length;
                const order = { id: 'gift-test-order', items: [{ name: 'Coffee' }], total: 32, itemTotal: 30, method: 'Pay' };
                const sent = await window.shoppingApp.sendGiftMessage(friend, order, 'Enjoy & smile');
                const live = window.imApp.getFriendById('gift-ui'), added = live.messages.slice(before);
                const gift = added.find(m => m.type === 'gift');
                window.__shopGiftId = gift.id;
                return { sent, count: added.length, gift: { name: gift.giftName, value: gift.giftValue, note: gift.giftDescription, status: gift.giftStatus, order: gift.shopGift.orderId }, system: added.some(m => m.role === 'system' && m.content.includes('[Gift event]')), inFlight: window.shoppingApp.giftOrdersInFlight.size };
            });
            assert.deepEqual(shop, { sent: true, count: 2, gift: { name: 'Coffee', value: 32, note: 'Enjoy & smile', status: 'pending', order: 'gift-test-order' }, system: true, inFlight: 0 });
            await page.evaluate(async () => {
                await window.imChat.openChatTab(window.imApp.getFriendById('gift-ui'));
            });
            assert.equal(await page.locator('#chat-interface-gift-ui .gift-message-card:not(.loves-invitation-card)').count(), 4);
            await page.evaluate(() => {
                const row = document.querySelector(`[data-message-id="${window.__shopGiftId}"]`);
                window.imChat.showContextMenu(row, {});
            });
            const clone = page.locator('#msg-context-bubble-clone .gift-message-card');
            assert.equal(await clone.locator('.gift-message-label').textContent(), 'App Store & iTunes');
            await page.locator('#msg-context-menu [data-action="reply"]').click();
            assert.ok(await page.evaluate(() => !!window.imData.currentReplyText && window.imData.currentReplyMessageId === window.__shopGiftId));
            await page.locator('#chat-interface-gift-ui .reply-cancel-btn').click();
            await page.evaluate(() => {
                window.__copied = null;
                Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__copied = text; } } });
                window.imChat.showContextMenu(document.querySelector(`[data-message-id="${window.__shopGiftId}"]`), {});
            });
            await page.locator('#msg-context-menu [data-action="copy"]').click();
            assert.match(await page.evaluate(() => window.__copied), /App Store & iTunes/);
            console.log('PASS', width, 'detail click/keyboard, Shop send/context, context preview, reply and copy');
            await page.reload();
            await page.waitForFunction(() => window.imChat?.openChatTab);
            await page.evaluate(async () => {
                await window.globalDataReadyPromise; await window.imApp.ensureDataReady();
                document.getElementById('u2-login-screen')?.remove(); document.body.classList.remove('u2-login-locked');
                window.openView(document.getElementById('imessage-view')); await window.imChat.openChatTab(window.imApp.getFriendById('gift-ui'));
            });
            assert.equal(await page.locator('#chat-interface-gift-ui .gift-message-card:not(.loves-invitation-card)').count(), 4);
            assert.equal(await page.locator('[data-message-id^="gift-accepted-"]').count(), 0);
            assert.equal(await page.locator('#chat-interface-gift-ui .gift-message-card.is-received').count(), 0);
            console.log('PASS', width, 'persisted gifts reopen with one card each and no extra acceptance');
            if (process.env.GIFT_SCREENSHOT_DIR) {
                fs.mkdirSync(process.env.GIFT_SCREENSHOT_DIR, { recursive: true });
                await page.screenshot({ path: path.join(process.env.GIFT_SCREENSHOT_DIR, `gift-${width}.png`) });
            }
            await context.close();
        }
        assert.deepEqual(errors, []);
        console.log('PASS no browser runtime errors');
    } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exit(1); });
