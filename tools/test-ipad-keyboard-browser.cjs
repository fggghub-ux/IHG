// Geometry regression using real app DOM/CSS and synthetic VisualViewport events.
// This does not emulate WebKit's native keyboard/compositor. Requires Playwright;
// optionally set CHROMIUM_PATH to an installed executable.
const {chromium} = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const server = require('node:http').createServer((req, res) => {
    let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    try {
        if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        res.setHeader('Content-Type', {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json'}[path.extname(file)] || 'application/octet-stream');
        fs.createReadStream(file).pipe(res);
    } catch { res.writeHead(404); res.end(); }
});
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || undefined,
            args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote']});
        const page = await browser.newPage({viewport: {width: 820, height: 1180}, hasTouch: true,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/26.1 Safari/605.1.15',
            serviceWorkers: 'block'});
        await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'standalone', {value: true});
            Object.defineProperty(navigator, 'maxTouchPoints', {value: 5});
            const viewport = Object.assign(new EventTarget(), {width: 820, height: 1148, offsetTop: 0, offsetLeft: 0, scale: 1});
            Object.defineProperty(window, 'visualViewport', {value: viewport});
            window.testViewport = (height, top) => {
                viewport.height = height; viewport.offsetTop = top;
                viewport.dispatchEvent(new Event('resize'));
            };
        });
        await page.goto('http://127.0.0.1:' + server.address().port, {waitUntil: 'load'});
        await page.evaluate(() => window.appStorage.ready);
        await page.waitForFunction(() => typeof window.imChat?.openChatTab === 'function');
        await page.evaluate(async () => {
            document.getElementById('u2-login-screen')?.remove();
            document.body.classList.remove('u2-login-locked');
            await window.imApp.ensureDataReady();
            const char = {id: 'keyboard-test-char', type: 'char', nickname: 'Keyboard Test', realName: 'Test', messages: []};
            await window.imApp.commitFriendsChange(() => window.imData.friends.push(char));
            window.openView(document.getElementById('imessage-view'));
            await window.imChat.openChatTab(window.imApp.getFriendById(char.id));
        });
        const inputs = await page.evaluate(() => {
            const chat = document.querySelector('#chat-interface-keyboard-test-char .chat-input');
            if (!chat) throw new Error('Visible iMessage input missing');
            chat.id = 'keyboard-test-imessage-input';
            return [chat.id, 'bstage-fan-chat-input', 'yt-community-chat-input'];
        });
        for (const id of inputs) {
            const result = await page.evaluate(async id => {
                const input = document.getElementById(id);
                if (!input) throw new Error('Missing input: ' + id);
                const view = input.closest('.app-view');
                if (view) window.openView(view);
                await new Promise(resolve => setTimeout(resolve, 400));
                const app = document.getElementById('app');
                const read = () => {
                    const rect = app.getBoundingClientRect();
                    return {top: rect.top, height: rect.height, position: getComputedStyle(app).position,
                        keyboard: document.documentElement.classList.contains('app-keyboard-open')};
                };
                const states = [read()];
                input.focus({preventScroll: true});
                if (document.activeElement !== input) throw new Error('Input not focusable: ' + id);
                window.testViewport(700, 200);
                states.push(read());
                input.value = 'keyboard regression';
                input.dispatchEvent(new Event('input', {bubbles: true}));
                states.push(read());
                input.blur();
                states.push(read());
                for (const height of [1000, 1050, 1100, 1140, 1148]) {
                    window.testViewport(height, 200);
                    states.push(read());
                    await new Promise(requestAnimationFrame);
                    states.push(read());
                }
                window.testViewport(1148, 0);
                return {states, htmlHeight: document.documentElement.getBoundingClientRect().height};
            }, id);
            assert.equal(result.htmlHeight, 1180, 'standalone full-screen height is preserved');
            assert.deepEqual(result.states[0], {top: 0, height: 1180, position: 'fixed', keyboard: false});
            for (const state of result.states) assert.equal(state.position, 'fixed', 'positioning context never switches');
            for (const state of result.states.slice(1, 4)) assert.deepEqual(state, {top: 200, height: 700, position: 'fixed', keyboard: true});
            [1000, 1050, 1100, 1140, 1148].forEach((height, i) => {
                const open = height < 1148;
                const expected = {top: open ? Math.min(200, 1148 - height) : 0,
                    height: open ? height : 1180, position: 'fixed', keyboard: open};
                assert.deepEqual(result.states[4 + i * 2], expected, 'same-event geometry');
                assert.deepEqual(result.states[5 + i * 2], expected, 'next-frame geometry');
            });
            console.log('PASS app keyboard geometry:', id);
        }
    } finally {
        await browser?.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => {console.error(error); process.exitCode = 1;});
