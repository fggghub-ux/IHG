// Additional cases run by test-offline-migration.cjs against the same real UI fixture.
const assert = require('node:assert/strict');

module.exports = async function checkFollowups(page, context, label) {
    const check = async (name, fn) => {
        assert.equal(await page.evaluate(fn), true, `${label}: ${name}`);
        console.log('PASS', label, name);
    };
    await check('existing language presets update without changing toggles or COT', () => {
        const defaults = window.__offlineTest.defaults();
        const ids = ['barrage_comments', 'player_choices', 'task_instruction', 'bilingual_dialogue', 'format_rules'];
        const old = defaults.map((entry, i) => ({ ...entry, enabled: i % 2 === 0 }));
        old.filter(entry => ids.includes(entry.id)).forEach(entry => { entry.presetVersion--; entry.content = 'old Chinese instructions'; });
        const migrated = window.__offlineTest.prompts(old);
        return ids.every(id => {
            const result = migrated.find(entry => entry.id === id);
            return result.content === defaults.find(entry => entry.id === id).content && result.enabled === old.find(entry => entry.id === id).enabled;
        }) && defaults.filter(entry => entry.id.startsWith('cot_')).every(entry => migrated.find(item => item.id === entry.id).content === entry.content);
    });
    await check('Arabic constraints include barrage names, choices and task text', async () => {
        const f = window.imApp.getFriendById('offline-fixture');
        const ctx = await window.__offlineTest.context({ ...f, language: 'ar' }, f.offlineMessages);
        const guard = ctx.messages.at(-1).content;
        return guard.includes('The Default Language is Arabic') && guard.includes('All audience names, barrage comments and player-choice text inside content must use Arabic')
            && !window.__offlineTest.defaults().find(entry => entry.id === 'player_choices').content.includes('10 Chinese characters');
    });

    await page.evaluate(async () => {
        await window.imApp.commitFriendChange('offline-fixture', f => { f.language = 'zh'; }, { silent: true, metaOnly: true });
        window.apiConfig = { endpoint: 'https://fixture.invalid/v1', apiKey: 'fixture', model: 'fixture' };
        window.getApiConfig = () => ({ endpoint: 'https://fixture.invalid/v1', apiKey: 'fixture', model: 'fixture' });
        window.__chineseCalls = 0;
        window.__chineseBodies = [];
        window.u2Api = { ...window.u2Api, fetchChatCompletion: async (_url, options) => {
            window.__chineseCalls++;
            const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
            window.__chineseBodies.push(body);
            if (!body.stream) return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ content: '新的中文正文。', translationZh: '' }) }, finish_reason: 'stop' }] }), { headers: { 'Content-Type': 'application/json' } });
            return new Response(new ReadableStream({ async start(controller) {
                const send = delta => controller.enqueue(new TextEncoder().encode('data: ' + JSON.stringify({ choices: [{ delta }] }) + '\n\n'));
                send({ reasoning_content: '中文场景思考。' });
                send({ content: '{"content":"中文原文逐步显示。' });
                await new Promise(resolve => window.__releaseChinese = resolve);
                send({ content: '\\n\\n“你好。”","translationZh":""}' });
                controller.enqueue(new TextEncoder().encode('data: ' + JSON.stringify({ choices: [{ delta: {}, finish_reason: 'stop' }] }) + '\n\ndata: [DONE]\n\n'));
                controller.close();
            } }), { headers: { 'Content-Type': 'text/event-stream' } });
        } };
        document.getElementById('offline-chat-input').value = '中文测试';
        document.getElementById('offline-chat-send-btn').click();
    });
    await page.waitForFunction(() => typeof window.__releaseChinese === 'function' && [...document.querySelectorAll('.offline-chat-bubble.ai')].at(-1)?.textContent.includes('中文原文逐步显示'));
    await check('Chinese stream displays the original while preserving independent COT', () => {
        const card = [...document.querySelectorAll('.offline-chat-bubble.ai')].at(-1);
        return card.querySelector('.offline-chat-bubble-text').textContent === '中文原文逐步显示。'
            && card.querySelector('.offline-chat-thinking-content').textContent === '中文场景思考。';
    });
    await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').last().click();
    await check('Chinese View provides feedback during streaming without changing text', () => document.querySelector('.toast-bubble').textContent === 'Already in Chinese'
        && [...document.querySelectorAll('.offline-chat-bubble.ai')].at(-1).querySelector('.offline-chat-bubble-text').textContent === '中文原文逐步显示。');
    await page.evaluate(() => window.__releaseChinese());
    await page.waitForFunction(() => !document.getElementById('offline-chat-send-btn').classList.contains('is-generating'));
    await check('Chinese completion saves one original without a duplicate translation', () => {
        const f = window.imApp.getFriendById('offline-fixture');
        const m = f.offlineMessages.find(row => row.content.startsWith('中文原文逐步显示'));
        window.__chineseMessageId = m?.id;
        const body = window.__chineseBodies[0];
        return window.__chineseCalls === 1 && m?.translationZh === '' && m.contentLanguage === 'zh' && m.translationState === 'not-needed'
            && body.messages.at(-1).content.includes('set translationZh to the empty string');
    });
    await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').last().click();
    await check('Chinese View only shows Already in Chinese without another API call', () => {
        const b = document.querySelector(`[data-message-id="${window.__chineseMessageId}"]`);
        return window.__chineseCalls === 1 && document.querySelector('.toast-bubble').textContent === 'Already in Chinese'
            && b.querySelector('.offline-chat-quotes-btn').getAttribute('aria-pressed') === 'false'
            && b.querySelector('.offline-chat-bubble-text').textContent.includes('中文原文逐步显示');
    });

    // Exercise menu touch selection, Cancel, and Reroll through actual menu entries.
    const share = page.locator('.offline-chat-bubble.ai .offline-chat-share-action').last();
    const open = async () => {
        await share.scrollIntoViewIfNeeded();
        const box = await share.boundingBox();
        const touch = await context.newCDPSession(page);
        await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }] });
        await page.waitForTimeout(850);
        await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await touch.detach();
        await page.waitForSelector('#offline-message-menu');
    };
    await open();
    await page.locator('#offline-message-menu [data-offline-action="edit"]').tap();
    await page.locator('.offline-chat-inline-editor').fill('独立的中文编辑草稿。');
    await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').last().click();
    await check('edit feedback takes precedence and keeps the Chinese draft', () => document.querySelector('.toast-bubble').textContent === 'No completed edits'
        && document.querySelector('.offline-chat-inline-editor').value === '独立的中文编辑草稿。');
    await page.locator('.offline-chat-bubble.ai [data-inline-edit-action="cancel"]').last().click();
    await open();
    page.once('dialog', dialog => dialog.dismiss());
    await page.locator('#offline-message-menu [data-offline-action="delete"]').tap();
    await check('Cancel still exits menu and preserves the floor', () => !document.querySelector('#offline-message-menu')
        && window.imApp.getFriendById('offline-fixture').offlineMessages.some(row => row.id === window.__chineseMessageId));
    await page.evaluate(async () => {
        await window.imApp.commitFriendChange('offline-fixture', f => { f.offlineStreamEnabled = false; }, { silent: true, metaOnly: true });
    });
    await open();
    await page.locator('#offline-message-menu [data-offline-action="reroll"]').tap();
    await page.locator('#custom-modal-overlay.active #modal-confirm-btn').click();
    await page.waitForFunction(() => window.imApp.getFriendById('offline-fixture').offlineMessages.find(row => row.id === window.__chineseMessageId)?.content === '新的中文正文。');
    await check('Chinese menu Reroll works without streaming or duplicate translation', () => {
        const m = window.imApp.getFriendById('offline-fixture').offlineMessages.find(row => row.id === window.__chineseMessageId);
        return window.__chineseCalls === 2 && m.translationZh === '' && m.translationState === 'not-needed' && m.contentLanguage === 'zh';
    });
    await page.evaluate(async () => {
        const f = window.imApp.getFriendById('offline-fixture');
        await window.__offlineTest.patch(f, window.__chineseMessageId, row => ({ ...row, continuationState: 'available' }));
        window.__offlineTest.render(window.imApp.getFriendById('offline-fixture'));
    });
    await page.locator('[data-offline-action="continue"]').last().click();
    await page.waitForFunction(() => window.__chineseCalls === 3 && !window.imApp.getFriendById('offline-fixture').offlineMessages.find(row => row.id === window.__chineseMessageId).continuationState);
    await check('Chinese continuation explicitly requests an empty translation', () => {
        const messages = window.__chineseBodies.at(-1).messages;
        const m = window.imApp.getFriendById('offline-fixture').offlineMessages.find(row => row.id === window.__chineseMessageId);
        return messages.at(-1).content.includes('translationZh 必须为空字符串') && m.translationZh === '' && m.translationState === 'not-needed';
    });
    await page.reload();
    await page.waitForFunction(() => typeof window.imChat?.openChatTab === 'function');
    await page.evaluate(async () => {
        await window.imApp.ensureDataReady();
        document.getElementById('u2-login-screen')?.remove(); document.body.classList.remove('u2-login-locked');
        window.openView(document.getElementById('imessage-view'));
        await window.imChat.openChatTab(window.imApp.getFriendById('offline-fixture'));
        window.imChat.openAttachmentSheet(); await window.__offlineTest.open();
    });
    await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').last().click();
    await check('Chinese state and View feedback survive reload', () => {
        const m = window.imApp.getFriendById('offline-fixture').offlineMessages.at(-1);
        return m.contentLanguage === 'zh' && m.translationZh === '' && m.translationState === 'not-needed'
            && document.querySelector('.toast-bubble').textContent === 'Already in Chinese';
    });
    await check('Chinese decoder keeps the original across every stream split', () => {
        const raw = JSON.stringify({ content: '中文原文。\n\n“你好。”', translationZh: '' });
        for (let i = 1; i <= raw.length; i++) {
            const partial = window.imOfflineResponse.parse(raw.slice(0, i), { streaming: true, translationRequired: false });
            if (partial.translationZh || !'中文原文。\n\n“你好。”'.startsWith(partial.content)) return false;
        }
        return window.imOfflineResponse.parse(raw, { translationRequired: false }).translationState === 'not-needed'
            && window.imOfflineResponse.parse(raw).translationState === 'incomplete';
    });
    await page.evaluate(async () => {
        await window.imApp.commitFriendChange('offline-fixture', f => {
            f.offlineMessages = [];
            f.offlineMeetingSessions = [];
        }, { silent: true, metaOnly: true });
        window.__offlineTest.render(window.imApp.getFriendById('offline-fixture'));
    });
    await check('empty meeting uses the exact GPT Notification Center label', () => document.querySelector('.offline-chat-placeholder').textContent === 'Notification Center');
    await page.evaluate(async () => {
        await window.imApp.commitFriendChange('offline-fixture', f => {
            f.offlineMeetingSessions = [{ id: 'history-label-fixture', startedAt: Date.now() - 1000, endedAt: Date.now(), title: 'Saved fixture', summary: 'Fixture summary', messages: [] }];
        }, { silent: true, metaOnly: true });
        window.__offlineTest.render(window.imApp.getFriendById('offline-fixture'));
    });
    await check('history entry uses the exact GPT Forever romance label', () => document.querySelector('.offline-chat-history-card').textContent === 'Forever romance');
    await page.locator('.offline-chat-history-card').click();
    await check('history return uses the exact GPT First encounter label', () => document.querySelector('.offline-chat-history-back').textContent.trim() === 'First encounter');
    await page.locator('.offline-chat-history-session .offline-chat-history-title').click();
    await check('history detail return uses the exact GPT Notification Center label', () => document.querySelector('.offline-chat-history-back').textContent.trim() === 'Notification Center');
    await page.locator('.offline-chat-history-back').click();
    await page.locator('.offline-chat-history-back').click();
    await check('all copied history navigation controls remain functional', () => !!document.querySelector('.offline-chat-history-card')
        && document.getElementById('offline-chat-content').dataset.offlineChatMode === 'current' && !document.querySelector('.offline-chat-history-back'));
};
