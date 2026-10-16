// Requires Playwright. Set CHROMIUM_PATH to use an installed Chromium binary.
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
    const path = require('path'),
        root = process.env.APP_ROOT || path.resolve(__dirname, '..');
    const server = require('http').createServer((req, res) => {
        let f = path.join(root, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
        try {
            if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
            res.setHeader(
                'Content-Type',
                {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                }[path.extname(f)] || 'application/octet-stream',
            );
            fs.createReadStream(f).pipe(res);
        } catch {
            res.statusCode = 404;
            res.end();
        }
    });
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.CHROMIUM_PATH
            ? {
                  executablePath: process.env.CHROMIUM_PATH,
              }
            : {}),
        args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
    });
    const context = await browser.newContext({
        viewport: {
            width: 390,
            height: 844,
        },
        hasTouch: true,
        isMobile: true,
        userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/26.1 Safari/605.1.15',
        serviceWorkers: 'allow',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => {
        errors.push(e.stack);
        console.log('PAGE ERROR', e.message);
    });
    await page.route('**/*', (route) =>
        new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort(),
    );
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'standalone', {
            value: true,
        });
        Object.defineProperty(navigator, 'maxTouchPoints', {
            value: 5,
        });
    });
    await page.goto('http://127.0.0.1:' + server.address().port + '/', {
        waitUntil: 'load',
    });
    await page.evaluate(() => window.appStorage.ready);
    await page.waitForTimeout(1500);
    // Runs against an isolated local test profile; all external requests are blocked.
    await page.evaluate(async () => {
        await window.imApp.ensureDataReady();
        document.getElementById('u2-login-screen')?.remove();
        document.body.classList.remove('u2-login-locked');
        window.openView(document.getElementById('imessage-view'));
        const char = {
            id: 'test-char',
            type: 'char',
            nickname: '测试角色',
            realName: 'Test',
            avatarUrl: 'assets/moren-thumb.jpg',
            messages: [],
        };
        const group = {
            id: 'test-group',
            type: 'group',
            nickname: '测试群',
            members: ['test-char'],
            messages: [],
            showGroupTitles: true,
        };
        await window.imApp.commitFriendsChange(() => {
            window.imData.friends.push(char, group);
        });
        await window.imApp.appendFriendMessage(char.id, {
            id: 'test-message',
            role: 'assistant',
            type: 'text',
            content: '测试消息',
            timestamp: Date.now(),
        });
        await window.imChat.openChatTab(window.imApp.getFriendById(char.id));
    });
    const assert = require('node:assert/strict'),
        shots = process.env.SCREENSHOT_DIR;
    if (shots)
        fs.mkdirSync(shots, {
            recursive: true,
        });
    async function shot(name) {
        if (shots)
            await page.screenshot({
                path: path.join(shots, name + '.png'),
            });
    }
    async function settle() {
        await page.waitForTimeout(400);
        assert.equal(
            await page.evaluate(() => document.getElementById('app').scrollTop),
            0,
            'outer app must remain stationary',
        );
    }
    async function closeOverlays() {
        await page.evaluate(() => {
            document
                .querySelectorAll('.bottom-sheet-overlay.active')
                .forEach((e) => window.closeView(e));
        });
        await settle();
    }
    // Rapidly replacing a prompt must not let the previous close/focus timer affect it.
    await page.evaluate(() => {
        window.showCustomModal({
            type: 'prompt',
            title: 'first',
        });
        window.closeCustomModal(false);
        window.showCustomModal({
            type: 'prompt',
            title: 'second',
        });
    });
    await settle();
    assert(await page.locator('#modal-input').isVisible());
    assert.equal(await page.locator('#modal-title').textContent(), 'second');
    assert.equal(await page.evaluate(() => document.getElementById('app').scrollTop), 0);
    await page.evaluate(() => window.closeCustomModal(false));
    await settle();
    for (const width of [390, 820]) {
        await page.setViewportSize({
            width,
            height: width === 390 ? 844 : 1148,
        });
        await closeOverlays();
        await page.evaluate(async () => {
            const a = window.imApp,
                g = a.getFriendById('test-group');
            if (!g.messages.some((x) => x.id === 'ui-poll'))
                await a.appendFriendMessage(g.id, {
                    id: 'ui-poll',
                    type: 'group_poll',
                    role: 'user',
                    timestamp: Date.now(),
                    pollQuestion: '选择一项',
                    pollOptions: [
                        {
                            id: 'a',
                            text: '选项甲',
                        },
                        {
                            id: 'b',
                            text: '选项乙',
                        },
                    ],
                    pollVotes: [],
                });
            await window.imChat.openChatTab(g);
        });
        await settle();
        const poll = await page
            .locator('.group-poll-card')
            .last()
            .evaluate((e) => {
                const b = e.closest('.group-poll-bubble'),
                    r = e.getBoundingClientRect();
                return {
                    width: r.width,
                    height: r.height,
                    whiteSpace: getComputedStyle(b).whiteSpace,
                    background: getComputedStyle(b).backgroundColor,
                    overflow: e.scrollWidth > e.clientWidth + 1,
                };
            });
        assert(
            poll.height < 350 &&
                poll.height > 100 &&
                !poll.overflow &&
                poll.whiteSpace === 'normal',
        );
        assert.equal(poll.background, 'rgba(0, 0, 0, 0)');
        await shot('poll-' + width);
        await page.evaluate(() =>
            window.imApp.openGroupDetails(window.imApp.getFriendById('test-group')),
        );
        await settle();
        await page.evaluate(() => {
            const e = document.getElementById('group-details-members-list');
            window.memberFrames = [];
            window.memberMutations = [];
            window.observeMembers = new MutationObserver(() =>
                memberMutations.push({
                    count: e.children.length,
                    text: e.textContent,
                }),
            );
            observeMembers.observe(e, {
                subtree: true,
                childList: true,
                characterData: true,
            });
            window.sampleMembers = true;
            const sample = () => {
                memberFrames.push({
                    count: e.children.length,
                    text: e.textContent,
                });
                if (sampleMembers) requestAnimationFrame(sample);
            };
            sample();
        });
        await page.locator('.im-group-owner-title-edit').click();
        await page.locator('#modal-input').fill('头衔' + width);
        await page.locator('#modal-prompt-confirm-btn').click();
        await page.waitForFunction(
            (w) => window.imApp.getFriendById('test-group').ownerTitle === '头衔' + w,
            width,
        );
        await settle();
        await page.evaluate(() =>
            window.imApp.showGroupMemberManageSheet(
                window.imApp.getFriendById('test-group'),
                'test-char',
            ),
        );
        await settle();
        await page.locator('#gmm-title-btn').click();
        await page.locator('#modal-input').fill('成员' + width);
        await page.locator('#modal-prompt-confirm-btn').click();
        await page.waitForFunction(
            (w) =>
                window.imApp.getGroupMemberTitle(
                    window.imApp.getFriendById('test-group'),
                    'test-char',
                ) ===
                '成员' + w,
            width,
        );
        await settle();
        await page.evaluate(() =>
            window.closeView(document.getElementById('group-member-manage-sheet')),
        );
        await settle();
        await page.locator('#group-details-settings-btn').click();
        await settle();
        await page.locator('#confirm-group-context-btn').click();
        await settle();
        const frames = await page.evaluate(() => {
            sampleMembers = false;
            observeMembers.disconnect();
            return [...memberFrames, ...memberMutations];
        });
        assert(frames.length > 5);
        if (!process.env.APK_REFERENCE)
            assert(frames.every((x) => x.count >= 2 && !/正在载入成员/.test(x.text)));
        console.log('PASS no empty/loading member frames', width, frames.length);
        await page.evaluate(() =>
            window.imApp.showGroupMemberManageSheet(
                window.imApp.getFriendById('test-group'),
                'test-char',
            ),
        );
        await settle();
        const layout = await page.evaluate(() => {
            const input = document.getElementById('gmm-memory-limit-input'),
                row = input.closest('.settings-item'),
                label = row.querySelector('.settings-text'),
                toggle = row.querySelector('.toggle-switch'),
                next = row.nextElementSibling.querySelector('.settings-text');
            const box = (e) => {
                const r = e.getBoundingClientRect();
                return {
                    x: r.x,
                    y: r.y,
                    width: r.width,
                    height: r.height,
                    cy: r.y + r.height / 2,
                };
            };
            return {
                input: box(input),
                label: box(label),
                toggle: box(toggle),
                next: box(next),
                row: box(row),
            };
        });
        assert(
            Math.abs(layout.label.cy - layout.input.cy) < 3 &&
                Math.abs(layout.label.cy - layout.toggle.cy) < 3,
        );
        assert(Math.abs(layout.label.x - layout.next.x) < 1);
        assert(layout.input.x >= layout.label.x + layout.label.width - 1);
        await shot('member-' + width);
        await closeOverlays();
        await page.evaluate(() => {
            window.imApp.openGroupDetails(window.imApp.getFriendById('test-group'));
            document.getElementById('group-details-more-btn').click();
        });
        await settle();
        const more = await page.locator('#group-summary-more-stats').textContent();
        assert(more.includes('暂未实测'));
        assert(!more.includes('usage') && !more.includes('发送消息后'));
        await shot('more-' + width);
        await closeOverlays();
        await page.evaluate(async () => {
            const f = window.imApp.getFriendById('test-char');
            await window.imChat.openChatTab(f);
            window.imApp.openChatSettingsForFriend(f);
        });
        await settle();
        await shot('settings-' + width);
        await page.evaluate(async () => {
            await window.imApp.commitFriendsChange(() => {
                const f = window.imApp.getFriendById('test-char');
                f.memory = window.imApp.normalizeFriendData(f).memory;
                f.memory.shortTermEntries = [
                    {
                        id: 'short-ui',
                        title: '近期对话',
                        event: '记忆内容预览',
                        degree: '高',
                        time: '2026-10-16',
                        memoryTags: ['测试'],
                    },
                ];
                f.memory.longTermEntries = [
                    {
                        id: 'long-ui',
                        title: '长期内容',
                        content: '长期记忆内容预览',
                        time: '2026-10-16',
                    },
                ];
            });
        });
        for (const kind of ['iphone', 'downloads']) {
            await page.evaluate(
                (kind) => window.imApp.openMemoryLocationForFriend('test-char', kind),
                kind,
            );
            await settle();
            const modal = page.locator('#memory-location-sheet');
            assert((await modal.getAttribute('class')).includes('memory-library-centered'));
            assert.equal(
                await page.locator('#memory-library-header-title').textContent(),
                kind === 'iphone' ? '短期记忆' : '长期记忆',
            );
            await shot('memory-' + kind + '-' + width);
            await page.locator('#memory-social-close').click();
            await settle();
        }
        await closeOverlays();
        await page.evaluate(() => window.imChat.openAttachmentSheet());
        await settle();
        await page.locator('.generated-image-entry').click();
        await page.waitForSelector('#custom-modal-overlay.is-image-generation');
        await settle();
        assert((await page.locator('.im-image-reference-card').count()) === 2);
        assert(await page.locator('#modal-generation-preset-group').isVisible());
        assert(await page.locator('#modal-generation-details').isVisible());
        assert(!(await page.locator('#modal-generation-details').getAttribute('open')));
        const card = await page.locator('#custom-modal-overlay .wb-group-modal-card').boundingBox();
        await shot('image-top-' + width);
        assert(card.x >= 0 && card.y >= 0 && card.y + card.height <= (width === 390 ? 844 : 1148));
        await page.locator('#modal-generation-negative-prompt').scrollIntoViewIfNeeded();
        await page.locator('#modal-generation-negative-prompt').fill('blurry');
        await page.locator('#modal-textarea').fill('test scene');
        await page.locator('#modal-generation-details summary').click();
        await page.locator('#modal-generation-char-appearance').fill('char appearance');
        await page.locator('#modal-generation-user-appearance').fill('user appearance');
        await page.locator('#modal-generation-artist-prompt').fill('style');
        await page.locator('#modal-generation-details summary').click();
        await page.locator('#modal-cancel-btn').scrollIntoViewIfNeeded();
        await shot('image-bottom-' + width);
        // Cancel saves the real composer draft; verify all prompt fields without calling a paid API.
        await page.locator('#modal-cancel-btn').click();
        await page.waitForFunction(() => {
            const c = window.imApp.getFriendById('test-char').imagePromptConfig;
            return (
                c.basePrompt === 'test scene' &&
                c.negativePrompt === 'blurry' &&
                c.charAppearance === 'char appearance' &&
                c.userAppearance === 'user appearance' &&
                c.artistPrompt === 'style'
            );
        });
        await settle();
        console.log('PASS composer, settings and memory', width);
    }
    await page.evaluate(async () => {
        const f = window.imApp.getFriendById('test-char');
        await window.imApp.appendFriendMessage(f.id, {
            id: 'call-ui',
            type: 'voice_call_record',
            role: 'assistant',
            duration: 65,
            timestamp: Date.now(),
        });
        await window.imChat.openChatTab(f);
    });
    await page.waitForSelector('.voice-call-record-card');
    assert(
        (
            await page
                .locator('#chat-interface-test-char .voice-call-record-card')
                .last()
                .textContent()
        ).includes('01:05'),
    );
    assert.deepEqual(errors, []);
    await browser.close();
    server.close();
    console.log('PASS interface regressions');
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
