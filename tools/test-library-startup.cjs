const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
    const root = path.resolve(__dirname, '..');
    const server = http.createServer((req, res) => {
        try {
            let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://local').pathname));
            if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
            res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
            res.end(fs.readFileSync(file));
        } catch { res.writeHead(404).end(); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
    try {
        for (const width of [390, 820]) {
            const context = await browser.newContext({ viewport: { width, height: 1180 }, isMobile: true, hasTouch: true });
            const page = await context.newPage(), errors = [];
            page.on('pageerror', e => errors.push(e.message));
            await page.route('**/*', route => route.request().url().includes('127.0.0.1') ? route.continue() : route.abort());
            await page.goto('http://127.0.0.1:' + server.address().port);
            await page.evaluate(() => window.globalDataReadyPromise);
            const modal = page.locator('#library-playlist-cover-modal');
            await modal.waitFor({state: 'hidden', timeout: 3000});
            await page.evaluate(async () => {
                document.getElementById('u2-login-screen')?.remove();
                document.body.classList.remove('u2-login-locked');
                await window.appStorage.saveLibraryPlaylistBundle({id: 'startup-cover', name: 'Startup cover test', trackIds: []}, []);
                await window.libraryApp.open('music');
            });
            await page.waitForFunction(() => { window.libraryApp.open('music'); return document.getElementById('library-view').classList.contains('active'); });
            await page.locator('[data-playlist-id="startup-cover"]').click();
            await page.locator('#library-playlist-cover-edit').click();
            await modal.waitFor({state: 'visible'});
            await modal.locator('[data-close-library-modal]').click();
            await modal.waitFor({state: 'hidden', timeout: 3000});
            await page.locator('#library-playlist-cover-edit').click();
            await modal.click({position: {x: 3, y: 3}});
            await modal.waitFor({state: 'hidden', timeout: 3000});
            await page.locator('#library-playlist-cover-edit').click();
            await page.locator('#library-playlist-cover-url').fill('https://test.invalid/cover.jpg');
            await page.locator('#library-playlist-cover-save').click();
            await modal.waitFor({state: 'hidden', timeout: 3000});
            assert.equal(await page.evaluate(async () => (await window.appStorage.loadLibraryPlaylists()).find(p => p.id === 'startup-cover').customCoverUrl), 'https://test.invalid/cover.jpg');
            await page.evaluate(() => window.libraryApp.close());
            await modal.waitFor({state: 'hidden', timeout: 3000});
            await page.reload();
            await page.evaluate(() => window.globalDataReadyPromise);
            await modal.waitFor({state: 'hidden', timeout: 3000});
            assert.deepEqual(errors, []);
            console.log(`PASS ${width}px: clean startup, real playlist navigation, close button, backdrop, save, exit and reload; no page errors`);
            await context.close();
        }
    } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); process.exit(1); });
