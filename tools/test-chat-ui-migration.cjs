// Offline integration checks for the GX/GPT -> IHG/<3 single-chat migration.
// External network requests are blocked; AI/TTS use local test fixtures only.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {execFileSync} = require('node:child_process');
(async () => {
    const root = path.resolve(__dirname, '..');
    const server = http.createServer((req, res) => {
        let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://local').pathname));
        try {
            if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
            res.setHeader(
                'Content-Type',
                {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css',
                    '.jpg': 'image/jpeg',
                    '.png': 'image/png',
                }[path.extname(file)] || 'application/octet-stream',
            );
            fs.createReadStream(file).pipe(res);
        } catch {
            res.writeHead(404);
            res.end();
        }
    });
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    let browser;
    const launch = () =>
        chromium.launch({
            headless: true,
            executablePath: process.env.CHROMIUM_PATH || undefined,
            args: ['--no-sandbox', '--no-zygote', '--disable-dev-shm-usage', '--disable-gpu'],
        });
    const errors = [];
    try {
        for (const [label, width, height, ua] of [
            ['phone', 390, 844, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'],
            [
                'ipad',
                820,
                1148,
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/26.1 Safari/605.1.15',
            ],
            ['ipad-landscape', 1180, 788, 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)'],
        ]) {
            if (process.env.CHAT_UI_TARGET && process.env.CHAT_UI_TARGET !== label) continue;
            browser = await launch();
            const context = await browser.newContext({
                viewport: { width, height },
                hasTouch: true,
                isMobile: true,
                userAgent: ua,
            });
            const page = await context.newPage();
            page.on('pageerror', (e) => errors.push(label + ': ' + e.message));
            page.on('console', (msg) => {
                if (msg.type() === 'error') console.log('BROWSER', msg.text().slice(0, 500));
            });
            await page.route('**/*', (route) =>
                new URL(route.request().url()).hostname === '127.0.0.1'
                    ? route.continue()
                    : route.abort(),
            );
            await page.addInitScript(() => {
                Object.defineProperty(navigator, 'maxTouchPoints', { value: 5 });
                Object.defineProperty(navigator, 'standalone', { value: true });
                // Simulate keyboard visualViewport events without resizing the layout viewport.
                window.__testViewport = {
                    height: innerHeight,
                    width: innerWidth,
                    offsetTop: 0,
                    scale: 1,
                };
                for (const key of ['height', 'width', 'offsetTop', 'scale'])
                    Object.defineProperty(visualViewport, key, {
                        get: () => window.__testViewport[key],
                        configurable: true,
                    });
            });
            await page.goto('http://127.0.0.1:' + server.address().port + '/', {
                waitUntil: 'load',
            });
            await page.evaluate(() => {
                window.__testViewport.height = innerHeight;
                window.__testViewport.width = innerWidth;
                visualViewport.dispatchEvent(new Event('resize'));
            });
            await page.waitForFunction(() => typeof window.imChat?.openChatTab === 'function');
            await page.evaluate(async () => {
                await window.appStorage.ready;
                await window.globalDataReadyPromise;
                await window.imApp.ensureDataReady();
                document.getElementById('u2-login-screen')?.remove();
                document.body.classList.remove('u2-login-locked');
                window.openView(document.getElementById('imessage-view'));
                const canvas = document.createElement('canvas');
                canvas.width = 120;
                canvas.height = 80;
                canvas.getContext('2d').fillRect(0, 0, 120, 80);
                window.__testImage = canvas.toDataURL();
                const t = Date.now() - 10000;
                const messages = [
                    {
                        id: 'ai-text',
                        role: 'assistant',
                        type: 'text',
                        content: 'Hello there',
                        translation: '你好',
                        timestamp: t,
                    },
                    {
                        id: 'ai-text-last',
                        role: 'assistant',
                        type: 'text',
                        content: 'One more',
                        translation: '再一条',
                        timestamp: t + 1,
                    },
                    {
                        id: 'user-text',
                        role: 'user',
                        type: 'text',
                        content: 'A reply',
                        translation: '回复',
                        timestamp: t + 2,
                    },
                    {
                        id: 'ai-voice',
                        role: 'assistant',
                        type: 'voice_message',
                        transcript: 'Voice from Char',
                        translation: '角色语音',
                        duration: 4,
                        timestamp: t + 3,
                    },
                    {
                        id: 'user-voice',
                        role: 'user',
                        type: 'voice_message',
                        transcript: 'Voice from User',
                        translation: '用户语音',
                        duration: 5,
                        timestamp: t + 4,
                    },
                    {
                        id: 'photo',
                        role: 'user',
                        type: 'image',
                        imageSource: 'real',
                        content: window.__testImage,
                        timestamp: t + 5,
                    },
                    {
                        id: 'transfer',
                        role: 'user',
                        type: 'pay_transfer',
                        payKind: 'user_to_char',
                        amount: 1000,
                        description: '转账',
                        timestamp: t + 6,
                    },
                    {
                        id: 'incoming',
                        role: 'assistant',
                        type: 'pay_transfer',
                        payKind: 'char_to_user_pending',
                        amount: 15,
                        description: 'Dinner',
                        timestamp: t + 7,
                    },
                    {
                        id: 'family',
                        role: 'assistant',
                        type: 'pay_transfer',
                        payKind: 'family_card_pending',
                        paymentAction: 'family_card',
                        amount: 800,
                        description: '亲属卡',
                        timestamp: t + 8,
                    },
                    {
                        id: 'gift',
                        role: 'assistant',
                        type: 'gift',
                        giftName: 'Flowers',
                        giftPrice: 10,
                        timestamp: t + 9,
                    },
                ];
                await window.imApp.commitFriendsChange(() =>
                    window.imData.friends.push(
                        {
                            id: 'ui-char',
                            type: 'char',
                            nickname: 'Test Char',
                            avatarUrl: 'assets/moren-thumb.jpg',
                            messages,
                        },
                        {
                            id: 'ui-group',
                            type: 'group',
                            nickname: 'Test Group',
                            members: ['ui-char'],
                            messages: [],
                        },
                    ),
                );
                await window.imChat.openChatTab(window.imApp.getFriendById('ui-char'));
            });
            async function check(name, fn) {
                const result = await page.evaluate(fn);
                assert.equal(result, true, label + ' ' + name + ': ' + JSON.stringify(result));
                console.log('PASS', label, name);
            }
            await check('new header and input geometry', () => {
                const p = document.getElementById('chat-interface-ui-char'),
                    b = p.querySelector('.im-chat-back-count'),
                    input = p.querySelector('.ins-chat-input-container');
                const gap = p.getBoundingClientRect().bottom - input.getBoundingClientRect().bottom;
                return (
                    (p.classList.contains('im-chat-char') &&
                        b.textContent === '2991' &&
                        !p.querySelector('.chat-call-btn') &&
                        p.querySelector('.chat-menu-btn svg') &&
                        gap >= 21 &&
                        p.scrollWidth <= p.clientWidth + 1) || {
                        classes: p.className,
                        badge: b?.textContent,
                        gap,
                    }
                );
            });
            const gptCore = fs.readFileSync(path.resolve(root, '../GX/js/imessage/2_core.js'), 'utf8');
            const gptFormatter = gptCore.slice(gptCore.indexOf('window.imApp.formatTime = function'), gptCore.indexOf('window.imApp.addMomentNotification')).replace(/^window.imApp.formatTime = /, '').trim().replace(/;$/, '');
            await page.evaluate(source => {window.__gptFormat = (0,eval)('(' + source + ')');}, gptFormatter);
            await check('timestamp separators use GPT rules even with custom time', () => {
                const dates=[Date.now(),Date.now()-86400000,Date.now()-2*86400000,new Date(2026,9,10,11,5).getTime()];
                for(const t of dates) {
                    const container=document.createElement('div');
                    window.imChat.renderTimestamp(t,container,{type:'char',timeAware:false,customTimeEnabled:true,customTimeAnchors:[]});
                    const stamp=container.querySelector('span');
                    if(stamp.textContent!==window.__gptFormat(t)||stamp.getAttribute('role')!=='button')return stamp.outerHTML;
                }
                return true;
            });
            await check('stored family-card symbols preserve half/full width', () => {
                const f=window.imApp.getFriendById('ui-char'), c=document.createElement('div');
                window.imChat.renderMessageBubble({id:'old-family',role:'user',type:'pay_transfer',paymentAction:'family_card',amount:100,description:'亲属卡额度 \u00a5100 / \uffe5200',timestamp:Date.now()},f,c);
                return c.textContent.includes('$100 / ＄200') && !/[\u00a5\uffe5]/.test(c.textContent);
            });
            await check('Loves invitation stays clear of every-message avatar', () => {
                const f={...window.imApp.getFriendById('ui-char'),showAvatar:true,avatarDisplayMode:'two'}, host=document.createElement('div');
                host.className='ins-chat-messages avatar-mode-two';
                document.getElementById('chat-interface-ui-char').appendChild(host);
                window.imChat.renderMessageBubble({id:'loves-regression',role:'user',type:'html',content:'<div class="loves-invite-bubble" style="max-width:220px;padding:12px;margin:2px;border:1px solid #ddd;border-radius:16px">Loves 邀请<br>我向你发送了情侣空间的邀请，快来接受吧！</div>',timestamp:Date.now()},f,host);
                const row=host.querySelector('.chat-row'), card=row.querySelector('.loves-invite-bubble'), avatar=row.querySelector('.im-message-avatar');
                const a=avatar.getBoundingClientRect(),b=card.getBoundingClientRect();
                const result=a.left>=b.right+5 && b.width<=220 && b.width>100 || {avatar:a.toJSON(),card:b.toJSON()};
                host.remove();return result;
            });
            await page.evaluate(() =>
                document.querySelector('#chat-interface-ui-char .chat-back-btn').click(),
            );
            for (const id of ['tearsorg', 'tiamo']) {
                await page.evaluate((id) => {
                    const app = document.getElementById('app');
                    const surface = document.getElementById('chats-list-surface');
                    window.__statusFrame = [app, surface].map(e => ({
                        top:e.getBoundingClientRect().top,
                        height:e.getBoundingClientRect().height,
                        style:e.style.cssText,
                    }));
                    document.querySelector(`[data-chats-featured-status="${id}"]`).click();
                }, id);
                await page.waitForTimeout(400);
                await page.evaluate(() => {
                    window.__testViewport.height = innerHeight - 310;
                    window.__testViewport.offsetTop = 40;
                    visualViewport.dispatchEvent(new Event('resize'));
                });
                await page.waitForTimeout(100);
                await check('featured STATUS preserves frame without inline locks: ' + id, () => {
                    const app = document.getElementById('app');
                    const surface = document.getElementById('chats-list-surface');
                    const frame = [app, surface].map(e => ({
                        top:e.getBoundingClientRect().top,
                        height:e.getBoundingClientRect().height,
                        style:e.style.cssText,
                    }));
                    return (JSON.stringify(frame) === JSON.stringify(window.__statusFrame) &&
                        document.getElementById('custom-modal-overlay').dataset.keepBackground === 'true') || frame;
                });
                await page.locator('#modal-input').fill('Updated ' + id);
                await page.locator('#modal-prompt-confirm-btn').click();
                // The closing keyboard must not cause a temporary background shrink.
                await page.waitForTimeout(100);
                await check('featured STATUS close keeps frame during keyboard dismissal', () => {
                    const app = document.getElementById('app');
                    return app.style.cssText === window.__statusFrame[0].style &&
                        app.getBoundingClientRect().height === window.__statusFrame[0].height;
                });
                await page.evaluate(() => {
                    window.__testViewport.height = innerHeight;
                    window.__testViewport.offsetTop = 0;
                    visualViewport.dispatchEvent(new Event('resize'));
                });
                await page.waitForTimeout(400);
                assert.equal(await page.evaluate(id =>
                    window.appStorage.loadLegacyKey('imessage_chats_featured_status_' + id, ''), id),
                    'Updated ' + id);
            }
            await page.evaluate(() => window.imChat.openChatTab(window.imApp.getFriendById('ui-char')));
            await page.evaluate(() =>
                window.imApp.openChatSettingsForFriend(window.imApp.getFriendById('ui-char')),
            );
            await page.waitForTimeout(450);
            await check('languages and avatar controls', () => {
                const langs = [...document.querySelectorAll('#chat-language-select option')]
                    .map((e) => e.value)
                    .join(',');
                return (
                    (!document.getElementById('chat-every-message-avatar-toggle') &&
                        langs === 'zh,en,ru,yue,it,es,ar,__custom__' &&
                        document.querySelector('#avatar-position-select option[value="two"]')
                            .textContent === '每条') ||
                    langs
                );
            });
            await page.evaluate(async () => {
                for (const [id, value] of [
                    ['chat-avatar-toggle', true],
                    ['avatar-position-select', 'two'],
                ]) {
                    const e = document.getElementById(id);
                    if (e.type === 'checkbox') e.checked = value;
                    else e.value = value;
                    e.dispatchEvent(new Event('change', { bubbles: true }));
                    await new Promise((r) => setTimeout(r, 350));
                }
            });
            await page.evaluate(() => document.querySelector('#chat-settings-sheet .char-settings-tab[data-tab="theme"]').click());
            await check('Avatar row matches language selector and has its own divider', () => {
                const body=document.getElementById('avatar-position-body');
                const select=document.getElementById('avatar-position-select');
                const language=document.getElementById('chat-language-select');
                const own=getComputedStyle(select), reference=getComputedStyle(language);
                const label=getComputedStyle(body.querySelector('label'));
                const toggleLabel=getComputedStyle(document.getElementById('chat-avatar-toggle').closest('.form-item').querySelector('label'));
                const divider=getComputedStyle(body), other=getComputedStyle(body.nextElementSibling);
                return (getComputedStyle(body).display==='flex' &&
                    label.color===toggleLabel.color && label.fontSize===toggleLabel.fontSize && own.fontSize===reference.fontSize &&
                    own.fontFamily===reference.fontFamily && own.fontWeight===reference.fontWeight &&
                    own.color===reference.color && own.backgroundColor===reference.backgroundColor &&
                    own.borderTopWidth==='0px' && !!select.nextElementSibling?.classList.contains('fa-chevron-right') &&
                    divider.borderBottomWidth===other.borderBottomWidth && divider.borderBottomColor===other.borderBottomColor) ||
                    {label:label.color,toggle:toggleLabel.color,font:own.fontSize,reference:reference.fontSize,border:divider.borderBottom,other:other.borderBottom};
            });
            await check('Avatar row has toggle-row height and vertically centered contents', () => {
                const row=document.getElementById('avatar-position-body');
                const toggle=document.getElementById('chat-avatar-toggle').closest('.form-item');
                const r=row.getBoundingClientRect(),t=toggle.getBoundingClientRect();
                const elements=[row.querySelector('label'),row.querySelector('select'),row.querySelector('.arrow')];
                return (r.height===t.height && elements.every(e=>{
                    const b=e.getBoundingClientRect();return Math.abs((b.top+b.bottom-r.top-r.bottom)/2)<1;
                }) && getComputedStyle(row.querySelector('.arrow')).fontSize===getComputedStyle(document.getElementById('chat-language-select').nextElementSibling).fontSize) || {row:r.height,toggle:t.height,contents:elements.map(e=>e.getBoundingClientRect().toJSON())};
            });
            await page.evaluate(() => window.closeView(document.getElementById('chat-settings-sheet')));
            await page.waitForFunction(
                () =>
                    window.imApp.getFriendById('ui-char').showAvatar &&
                    window.imApp.getFriendById('ui-char').avatarDisplayMode === 'two' &&
                    document.querySelector('#chat-interface-ui-char .avatar-mode-two'),
            );
            await check('per-message avatar mode and Char voice retained', () => {
                const p = document.getElementById('chat-interface-ui-char'),
                    m = p.querySelector('.ins-chat-messages');
                return (
                    (m.classList.contains('avatar-mode-two') &&
                        p.querySelectorAll('.im-message-avatar').length >= 6 &&
                        !p.querySelector('.chat-message-header') &&
                        !!p.querySelector(
                            '[data-message-id="ai-voice"] .voice-message-bubble-main',
                        ) &&
                        !!p.querySelector('[data-message-id="user-voice"] .voice-message-mic') &&
                        !p.querySelector(
                            '[data-message-id="user-voice"] .voice-message-bubble-main',
                        )) || {
                        classes: m.className,
                        avatars: p.querySelectorAll('.im-message-avatar').length,
                    }
                );
            });
            await check('Character voice shares text shell in both avatar modes and tail states', async () => {
                const page=document.getElementById('chat-interface-ui-char');
                for(const mode of ['one','two']) {
                    const f={...window.imApp.getFriendById('ui-char'),showAvatar:true,avatarDisplayMode:mode};
                    const host=document.createElement('div');host.className='ins-chat-messages';page.appendChild(host);
                    window.imChat.renderMessageBubble({id:'shell-text',role:'assistant',type:'text',content:'Text',timestamp:Date.now()},f,host);
                    window.imChat.renderMessageBubble({id:'shell-voice',role:'assistant',type:'voice_message',transcript:'Voice',duration:4,timestamp:Date.now()},f,host);
                    const voice=host.querySelector('.voice-message-bubble'),text=host.querySelector('.ai-bubble:not(.voice-message-bubble)');
                    if(voice.classList.contains('im-card-bubble')||!voice.querySelector('.voice-message-bubble-inner')||voice.querySelectorAll('.voice-message-action').length!==2) {host.remove();return 'voice internals or shell class';}
                    for(const grouped of [true,false]) {
                        for(const row of host.querySelectorAll('.chat-row')) {row.classList.toggle('has-prev',grouped);row.classList.toggle('has-next',grouped);}
                        void host.offsetWidth;
                        await Promise.all(host.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));
                        const a=getComputedStyle(voice),b=getComputedStyle(text);
                        for(const key of ['backgroundColor','borderTopLeftRadius','borderBottomLeftRadius','paddingTop','paddingLeft'])
                            if(a[key]!==b[key]){const result={mode,grouped,key,voice:a[key],text:b[key]};host.remove();return result;}
                        const va=getComputedStyle(voice,'::after'),ta=getComputedStyle(text,'::after');
                        if(va.content!==ta.content||va.backgroundImage!==ta.backgroundImage){host.remove();return {mode,grouped,voiceTail:va.content,textTail:ta.content};}
                    }
                    host.remove();
                }
                return true;
            });
            await check('outside timestamps show only at the end of each turn in US format', async () => {
                const a = window.imApp, f = a.getFriendById('ui-char');
                await a.commitFriendChange(f.id, target => {
                    target.showTimestamp = true;
                    target.timestampPosition = 'outside';
                }, {silent: true});
                await window.imChat.openChatTab(a.getFriendById(f.id));
                const p = document.getElementById('chat-interface-ui-char');
                const first = p.querySelector('[data-message-id="ai-text"] .bubble-meta');
                const last = p.querySelector('[data-message-id="ai-text-last"] .bubble-meta');
                const user = p.querySelector('[data-message-id="user-text"] .bubble-meta');
                return p.classList.contains('timestamp-outside')
                    && getComputedStyle(first).display === 'none'
                    && ['flex','inline-flex'].includes(getComputedStyle(last).display)
                    && /AM|PM/.test(last.textContent)
                    && getComputedStyle(user, '::before').content.includes('Read') || {classes:p.className,first:getComputedStyle(first).display,last:getComputedStyle(last).display,text:last.textContent,read:getComputedStyle(user,'::before').content};
            });
            await check('outside timestamp leaves room before the next bubble', () => {
                const p=document.getElementById('chat-interface-ui-char');
                let checked=0;
                for(const row of p.querySelectorAll('.chat-row:not(.has-next):has(.bubble-meta)')) {
                    const meta=row.querySelector('.bubble-meta');
                    if(getComputedStyle(meta).display==='none')continue;
                    let next=row.nextElementSibling;
                    while(next&&!next.classList.contains('chat-row'))next=next.nextElementSibling;
                    const bubble=next?.querySelector('.chat-bubble');
                    if(!bubble)continue;
                    const gap=bubble.getBoundingClientRect().top-meta.getBoundingClientRect().bottom;
                    if(gap<7.5)return {id:row.dataset.messageId,gap};
                    checked++;
                }
                p.classList.remove('timestamp-outside');
                const inside=[...p.querySelectorAll('.chat-row')].every(r=>getComputedStyle(r).marginBottom==='0px');
                p.classList.add('timestamp-outside');
                return checked>1 && inside || {checked,inside};
            });
            await check('Avatar One groups headers and Two restores each-message avatars', async () => {
                const a = window.imApp;
                await a.commitFriendChange('ui-char', f => { f.avatarDisplayMode = 'one'; }, {silent:true});
                const p = document.getElementById('chat-interface-ui-char');
                window.imChat.rerenderChatContainer(a.getFriendById('ui-char'), p.querySelector('.ins-chat-messages'), {scroll:false});
                const one = !p.querySelector('.avatar-mode-two') && !!p.querySelector('.chat-message-header') && !p.querySelector('.im-message-avatar');
                await a.commitFriendChange('ui-char', f => { f.avatarDisplayMode = 'two'; }, {silent:true});
                window.imChat.rerenderChatContainer(a.getFriendById('ui-char'), p.querySelector('.ins-chat-messages'), {scroll:false});
                return one && !!p.querySelector('.avatar-mode-two') && !!p.querySelector('.im-message-avatar');
            });
            // Record every animation frame across press/release: no opacity flash or row replacement.
            await page.waitForTimeout(400);
            await check('translation and voice expansion do not flash', async () => {
                const p = document.getElementById('chat-interface-ui-char');
                for (const selector of [
                    '[data-message-id="ai-text"] .chat-bubble',
                    '[data-message-id="ai-voice"] .voice-message-bubble-inner',
                    '[data-message-id="user-voice"] .voice-message-bubble-inner',
                ]) {
                    const b = p.querySelector(selector);
                    if (!b) return selector;
                    const row = b.closest('.chat-row'),
                        bubble = row.querySelector('.chat-bubble');
                    b.dispatchEvent(
                        new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }),
                    );
                    const touch = new Touch({ identifier: 1, target: b, clientX: 10, clientY: 10 });
                    b.dispatchEvent(
                        new TouchEvent('touchstart', {
                            bubbles: true,
                            touches: [touch],
                            changedTouches: [touch],
                        }),
                    );
                    const samples = [];
                    const sample = () =>
                        samples.push({
                            connected: b.isConnected,
                            opacity: getComputedStyle(bubble).opacity,
                            visibility: getComputedStyle(bubble).visibility,
                        });
                    sample();
                    b.click();
                    for (let i = 0; i < 8; i++) {
                        await new Promise(requestAnimationFrame);
                        sample();
                    }
                    b.dispatchEvent(
                        new TouchEvent('touchend', {
                            bubbles: true,
                            touches: [],
                            changedTouches: [touch],
                        }),
                    );
                    if (
                        samples.some(
                            (x) => !x.connected || x.opacity !== '1' || x.visibility !== 'visible',
                        )
                    )
                        return { selector, samples };
                    if (selector.includes('ai-text') && !row.querySelector('.msg-translation'))
                        return 'translation missing';
                    if (
                        selector.includes('voice') &&
                        row.querySelector('.voice-message-transcript').hidden
                    )
                        return 'voice transcript hidden';
                }
                return true;
            });
            await check('rapid preview reopen keeps its new bubble', async () => {
                const rows = document.querySelectorAll('#chat-interface-ui-char .chat-row');
                window.imChat.showContextMenu(rows[0], {});
                window.imChat.closeContextMenu();
                window.imChat.showContextMenu(rows[1], {});
                await new Promise((r) => setTimeout(r, 350));
                const ok =
                    !!document.querySelector('#msg-context-bubble-clone .chat-bubble') &&
                    document.getElementById('msg-context-overlay').style.display !== 'none';
                window.imChat.closeContextMenu();
                await new Promise((r) => setTimeout(r, 350));
                return ok;
            });
            await page.evaluate(() => {
                window.__frameBefore = (() => {
                    const p = document.getElementById('chat-interface-ui-char');
                    return [
                        document.getElementById('app'),
                        p,
                        p.querySelector('.ins-chat-input-container'),
                    ].map((e) => ({
                        top: e.getBoundingClientRect().top,
                        height: e.getBoundingClientRect().height,
                        style: e.style.cssText,
                    }));
                })();
                document.querySelector('#chat-interface-ui-char .im-chat-back-count').click();
            });
            await page.waitForTimeout(400);
            await page.evaluate(() => {
                window.__testViewport.height -= 310;
                window.__testViewport.offsetTop = 40;
                visualViewport.dispatchEvent(new Event('resize'));
                visualViewport.dispatchEvent(new Event('scroll'));
            });
            await page.waitForTimeout(100);
            await check('STATUS keyboard leaves background and input fixed', () => {
                const p = document.getElementById('chat-interface-ui-char');
                const after = [
                    document.getElementById('app'),
                    p,
                    p.querySelector('.ins-chat-input-container'),
                ].map((e) => ({
                    top: e.getBoundingClientRect().top,
                    height: e.getBoundingClientRect().height,
                    style: e.style.cssText,
                }));
                return (
                    JSON.stringify(after) === JSON.stringify(window.__frameBefore) || {
                        before: window.__frameBefore,
                        after,
                    }
                );
            });
            await page.locator('#modal-input').fill('');
            await page.locator('#modal-prompt-confirm-btn').click();
            await page.waitForTimeout(100);
            await check('badge close keeps background during keyboard dismissal', () => {
                const p = document.getElementById('chat-interface-ui-char');
                const after = [document.getElementById('app'), p, p.querySelector('.ins-chat-input-container')]
                    .map(e => ({top:e.getBoundingClientRect().top, height:e.getBoundingClientRect().height, style:e.style.cssText}));
                return JSON.stringify(after) === JSON.stringify(window.__frameBefore) || after;
            });
            await page.evaluate(() =>
                document.querySelector('#chat-interface-ui-char .im-chat-back-restore-hotspot').click(),
            );
            await page.waitForTimeout(350);
            await check('rapid badge reopen keeps same background without restore listeners', () => {
                const app = document.getElementById('app');
                return app.style.cssText === window.__frameBefore[0].style &&
                    app.getBoundingClientRect().height === window.__frameBefore[0].height;
            });
            await page.locator('#modal-cancel-btn').click();
            await page.evaluate(() => {
                window.__testViewport.height = innerHeight;
                window.__testViewport.offsetTop = 0;
                visualViewport.dispatchEvent(new Event('resize'));
            });
            await page.waitForTimeout(450);
            await check('empty badge can be edited again; no inline background lock', () => {
                const p = document.getElementById('chat-interface-ui-char');
                return (
                    (p.querySelector('.im-chat-back-count').hidden &&
                        !p.querySelector('.im-chat-back-restore-hotspot').hidden &&
                        !document.getElementById('app').style.getPropertyPriority('height')) || {
                        badge: p.querySelector('.im-chat-back-count').outerHTML,
                        hotspot: p.querySelector('.im-chat-back-restore-hotspot').outerHTML,
                        style: document.getElementById('app').style.cssText,
                        modal: document.getElementById('custom-modal-overlay').className,
                    }
                );
            });
            await page.evaluate(() =>
                document
                    .querySelector('#chat-interface-ui-char .im-chat-back-restore-hotspot')
                    .click(),
            );
            await page.waitForTimeout(350);
            await page.locator('#modal-input').fill('12345678901234567890');
            await page.locator('#modal-prompt-confirm-btn').click();
            await page.waitForTimeout(350);
            await check('large badge stays within header', () => {
                const b = document.querySelector('#chat-interface-ui-char .im-chat-back-btn');
                return (
                    b.getBoundingClientRect().width <= innerWidth * 0.38 + 1 &&
                    b.querySelector('span').textContent === '12345678901234567890'
                );
            });
            await page.evaluate(() => {
                document.querySelector('#chat-interface-ui-char .ins-message-input').focus();
                window.__testViewport.height = innerHeight - 310;
                window.__testViewport.offsetTop = 40;
                visualViewport.dispatchEvent(new Event('resize'));
            });
            await page.waitForTimeout(400);
            await check('ordinary composer retains existing keyboard ownership', () => {
                const root = document.documentElement;
                return root.classList.contains('app-ipad-layout')
                    ? !window.appViewport && !document.getElementById('app').style.height
                    : root.classList.contains('app-keyboard-open') &&
                        document.getElementById('app').getBoundingClientRect().height === innerHeight - 310;
            });
            await page.evaluate(() => {
                document.activeElement.blur();
                window.__testViewport.height = innerHeight;
                window.__testViewport.offsetTop = 0;
                visualViewport.dispatchEvent(new Event('resize'));
            });
            await page.waitForTimeout(400);
            await page.evaluate(() => window.imChat.openAttachmentSheet());
            await page.waitForTimeout(400);
            await check('More order and moved call', () => {
                const s = window.imData.attachmentSheet;
                const keys = [...s.querySelectorAll('.attachment-more-icon-grid > div')]
                    .map((e) => e.className.match(/attachment-more-([\w-]+)-entry/)?.[1])
                    .filter(Boolean);
                const i = s.querySelector('.attachment-more-call-icon');
                return (
                    (keys.join(',') ===
                        'call,regenerate,pay,contact,voice,listen,offline,narration,link,dynamic-action' &&
                        getComputedStyle(i).backgroundColor === 'rgb(52, 199, 89)' &&
                        getComputedStyle(s.querySelector('.attachment-more-listen-icon'))
                            .backgroundColor === 'rgb(0, 0, 0)') || {
                        keys,
                        color: getComputedStyle(i).backgroundColor,
                    }
                );
            });
            await page.evaluate(() =>
                window.imData.attachmentSheet.querySelector('.attachment-more-call-entry').click(),
            );
            await page.waitForTimeout(350);
            await check('call chooser preserves live video/voice actions', () => {
                const s = document.getElementById('custom-call-overlay');
                return (
                    getComputedStyle(s).display === 'flex' &&
                    s.dataset.friendId === 'ui-char' &&
                    window.imData.attachmentSheet.style.display === 'none' &&
                    typeof window.imChat.openVideoCall === 'function' &&
                    typeof window.imChat.openVoiceCall === 'function'
                );
            });
            await page.evaluate(
                () => (document.getElementById('custom-call-overlay').style.display = 'none'),
            );
            for (const id of [
                'ai-text',
                'ai-text-last',
                'user-text',
                'ai-voice',
                'user-voice',
                'photo',
                'transfer',
                'incoming',
                'family',
                'gift',
            ]) {
                await page.evaluate((id) => {
                    const row = document.querySelector(
                        '#chat-interface-ui-char [data-message-id="' + id + '"]',
                    );
                    window.imChat.showContextMenu(row, {});
                }, id);
                await page.waitForTimeout(300);
                await check('centered preview ' + id, () => {
                    const rect = (id) => document.getElementById(id).getBoundingClientRect();
                    const top = rect('msg-reaction-bar'),
                        bottom = rect('msg-context-actions');
                    const b = document
                        .querySelector(
                            '#msg-context-bubble-clone .chat-bubble, #msg-context-bubble-clone .sticker-message-wrap',
                        )
                        ?.getBoundingClientRect();
                    if (!b) return 'no bubble';
                    const upper = b.top - top.bottom,
                        lower = bottom.top - b.bottom;
                    return Math.abs(upper - lower) <= 2 || { upper, lower };
                });
                await page.evaluate(() => window.imChat.closeContextMenu());
                await page.waitForTimeout(400);
            }
            await page.evaluate(() => {
                const p = document.getElementById('chat-interface-ui-char');
                p._openTransferDetailOverlay(
                    window.imApp.getFriendById('ui-char').messages.find((m) => m.id === 'transfer'),
                );
            });
            await check('transfer detail matches GPT with dollars', () => {
                const p = document.getElementById('chat-interface-ui-char');
                return (
                    (p.querySelector('.pay-transfer-detail-amount').textContent === '$1000.00' &&
                        p.querySelector('.pay-transfer-detail-desc').style.display === 'none' &&
                        p.querySelector('.pay-transfer-detail-summary').style.display === 'none' &&
                        getComputedStyle(
                            p.querySelector('.pay-transfer-detail-claim-btn').parentElement,
                        ).display === 'none') || {
                        amount: p.querySelector('.pay-transfer-detail-amount').textContent,
                        desc: p.querySelector('.pay-transfer-detail-desc').outerHTML,
                        summary: p.querySelector('.pay-transfer-detail-summary').outerHTML,
                        actions: getComputedStyle(
                            p.querySelector('.pay-transfer-detail-claim-btn').parentElement,
                        ).display,
                    }
                );
            });
            await page.evaluate(() =>
                document.getElementById('chat-interface-ui-char')._closeTransferDetailOverlay(),
            );
            if (label === 'phone') {
                await check(
                    'Fonts scales bubble padding and each-message avatars together',
                    async () => {
                        const p = document.getElementById('chat-interface-ui-char'),
                            avatar = p.querySelector('.im-message-avatar'),
                            b = p.querySelector('[data-message-id="ai-text"] .chat-bubble');
                        const read = () => [
                            avatar.getBoundingClientRect().width,
                            parseFloat(getComputedStyle(b).paddingLeft),
                            parseFloat(getComputedStyle(b).fontSize),
                        ];
                        const before = read();
                        document.getElementById('theme-font-btn').click();
                        const slider = document.getElementById('theme-font-size-slider');
                        slider.value = '20';
                        slider.dispatchEvent(new Event('input', { bubbles: true }));
                        await new Promise((r) => setTimeout(r, 100));
                        const after = read();
                        document.getElementById('theme-font-close-btn').click();
                        const ok = after.every((v, i) => Math.abs(v / before[i] - 1.25) < 0.03);
                        slider.value = '16';
                        slider.dispatchEvent(new Event('input', { bubbles: true }));
                        return ok || { before, after };
                    },
                );
                await check(
                    'chat image avatar crop, save, refresh and gallery coexist',
                    async () => {
                        const a = window.imApp,
                            old = {
                                fetch: window.fetch,
                                config: window.getApiConfig,
                                api: window.u2Api,
                                toast: window.showToast,
                            };
                        const notices = [];
                        window.showToast = (t) => notices.push(t);
                        let responseTag = '',
                            prompt = '';
                        window.getApiConfig = () => ({
                            endpoint: 'https://test.invalid/v1',
                            apiKey: 'test',
                            model: 'test',
                            temperature: 0.7,
                        });
                        window.fetch = async (url, opts) => {
                            if (!String(url).startsWith('https://test.invalid'))
                                return old.fetch(url, opts);
                            const body =
                                typeof opts.body === 'string' ? JSON.parse(opts.body) : opts.body;
                            prompt = JSON.stringify(body.messages);
                            const reply =
                                '<chat_json>' +
                                JSON.stringify([
                                    { type: 'text', text: '好的，已经换了。', translation: '' },
                                ]) +
                                '</chat_json>' +
                                responseTag;
                            return body.stream
                                ? new Response(
                                      'data: ' +
                                          JSON.stringify({
                                              choices: [{ delta: { content: reply } }],
                                          }) +
                                          '\n\ndata: [DONE]\n\n',
                                      { headers: { 'content-type': 'text/event-stream' } },
                                  )
                                : new Response(
                                      JSON.stringify({
                                          choices: [{ message: { content: reply } }],
                                      }),
                                      { headers: { 'content-type': 'application/json' } },
                                  );
                        };
                        window.u2Api = { ...old.api, fetchChatCompletion: window.fetch };
                        try {
                            const id = 'ui-char';
                            await a.appendFriendMessage(
                                id,
                                {
                                    id: 'avatar-request',
                                    role: 'user',
                                    type: 'text',
                                    content: '把刚才这张图片换成你的头像',
                                    timestamp: Date.now(),
                                },
                                { silent: true },
                            );
                            await window.imChat.handleAiReply(
                                a.getFriendById(id),
                                document.querySelector(
                                    '#chat-interface-ui-char .ins-chat-messages',
                                ),
                                null,
                                { source: 'manual', silent: true },
                            );
                            let f = a.getFriendById(id);
                            const sourceOk =
                                f.avatarUpdatedFromMessageId === 'photo' &&
                                prompt.includes('avatar_update') &&
                                !prompt.includes('<gallery_avatar_catalog>');
                            if (!sourceOk)
                                return {
                                    sourceOk,
                                    source: f.avatarUpdatedFromMessageId,
                                    prompt: prompt.slice(-500),
                                    notices,
                                };
                            const img = new Image();
                            img.src = f.avatarUrl;
                            await img.decode();
                            if (img.naturalWidth !== 256 || img.naturalHeight !== 256)
                                return { width: img.naturalWidth, height: img.naturalHeight };
                            if (
                                [
                                    ...document.querySelectorAll(
                                        '#chat-interface-ui-char .im-message-avatar.is-assistant img',
                                    ),
                                ].some((img) => img.src !== f.avatarUrl)
                            )
                                return 'message avatars stale';
                            const canvas = document.createElement('canvas');
                            canvas.width = 32;
                            canvas.height = 32;
                            canvas.getContext('2d').fillStyle = 'red';
                            canvas.getContext('2d').fillRect(0, 0, 32, 32);
                            const galleryUrl = canvas.toDataURL();
                            await a.commitFriendChange(
                                id,
                                (f) => {
                                    f.galleryAlbumImages = [
                                        {
                                            id: 'gallery_test_photo',
                                            url: galleryUrl,
                                            description: 'red square',
                                            addedAt: Date.now(),
                                        },
                                    ];
                                },
                                { silent: true },
                            );
                            await a.appendFriendMessage(
                                id,
                                {
                                    id: 'gallery-request',
                                    role: 'user',
                                    type: 'text',
                                    content: '从你的图库选第一张照片换头像',
                                    timestamp: Date.now(),
                                },
                                { silent: true },
                            );
                            responseTag =
                                '<gallery_avatar_update>{"photoId":"gallery_test_photo"}</gallery_avatar_update>';
                            await window.imChat.handleAiReply(
                                a.getFriendById(id),
                                document.querySelector(
                                    '#chat-interface-ui-char .ins-chat-messages',
                                ),
                                null,
                                { source: 'manual', silent: true },
                            );
                            f = a.getFriendById(id);
                            window.__avatarPersisted = {
                                source: f.avatarUpdatedFromMessageId,
                                gallery: f.avatarUpdatedFromGalleryPhotoId,
                            };
                            return (
                                (f.avatarUpdatedFromGalleryPhotoId === 'gallery_test_photo' &&
                                    prompt.includes('<gallery_avatar_catalog>')) || {
                                    gallery: f.avatarUpdatedFromGalleryPhotoId,
                                    hasCatalog: prompt.includes('<gallery_avatar_catalog>'),
                                    photos: f.galleryAlbumImages?.map((x) => ({
                                        id: x.id,
                                        asset: x.assetId,
                                        url: x.url?.slice(0, 20),
                                    })),
                                    notices,
                                }
                            );
                        } finally {
                            window.fetch = old.fetch;
                            window.getApiConfig = old.config;
                            window.u2Api = old.api;
                            window.showToast = old.toast;
                        }
                    },
                );
            }
            await check('group avatars share every-message renderer and user toggle', async () => {
                const a=window.imApp;
                await a.commitFriendChange('ui-group',f=>{f.showGroupUserAvatar=true;},{silent:true});
                for(const [id,role] of [['group-ai-one','assistant'],['group-ai-two','assistant'],['group-user','user']])
                    await a.appendFriendMessage('ui-group',{id,role,type:'text',content:id,speakerMemberId:'ui-char',speaker:'Test Char',timestamp:Date.now()},{silent:true});
                await window.imChat.openChatTab(a.getFriendById('ui-group'));
                const p=document.getElementById('chat-interface-ui-group');
                const rows=[...p.querySelectorAll('.chat-row[data-message-id^="group-"]')];
                const ok=rows.length===3 && rows.every(r=>r.querySelector(':scope > .im-message-avatar img')) && !p.querySelector('.group-ai-avatar-slot');
                if(!ok)return {rows:rows.map(r=>r.outerHTML.slice(0,250))};
                await a.commitFriendChange('ui-group',f=>{f.showGroupUserAvatar=false;},{silent:true});
                window.imChat.rerenderChatContainer(a.getFriendById('ui-group'),p.querySelector('.ins-chat-messages'),{scroll:false});
                return !p.querySelector('.user-row > .im-message-avatar') && !!p.querySelector('.ai-row > .im-message-avatar');
            });
            await check('group transfer card and detail keep the original UI', async () => {
                const a=window.imApp;
                await a.appendFriendMessage('ui-group',{id:'group-transfer',role:'assistant',type:'pay_transfer',payKind:'char_to_user_pending',amount:42,description:'Group test',timestamp:Date.now()},{silent:true});
                await window.imChat.openChatTab(a.getFriendById('ui-group'));
                const p=document.getElementById('chat-interface-ui-group');
                p._openTransferDetailOverlay(a.getFriendById('ui-group').messages.find(m=>m.id==='group-transfer'));
                const ok=!p.classList.contains('im-chat-char')&&!p.querySelector('.apple-cash-bubble')&&!!p.querySelector('.pay-transfer-card-icon')&&!!p.querySelector('.pay-transfer-detail-action-text')&&p.querySelector('.pay-transfer-detail-amount').textContent==='$42.00';
                p._closeTransferDetailOverlay();return ok;
            });
            await page.evaluate(() => {
                document.querySelector('#chat-interface-ui-group .chat-back-btn').click();
                window.imChat.renderChatsList();
            });
            await check('group list badge fits and its text is centered', () => {
                const badge=document.querySelector('.chat-group-label');
                if(!badge)return 'missing group badge';
                const r=badge.getBoundingClientRect(),p=badge.parentElement.getBoundingClientRect();
                const range=document.createRange();range.selectNodeContents(badge);
                const t=range.getBoundingClientRect();
                return r.top>=p.top && r.bottom<=p.bottom && Math.abs((t.top+t.bottom-r.top-r.bottom)/2)<2 || {badge:r.toJSON(),parent:p.toJSON(),text:t.toJSON()};
            });
            await page.evaluate(() => {
                window.imApp.openGroupDetails(window.imApp.getFriendById('ui-group'));
            });
            await check('Group Settings moves horizontally during opening', async () => {
                await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
                const m=new DOMMatrix(getComputedStyle(document.getElementById('group-details-sheet')).transform);
                return m.m41>0 && m.m42===0 || {x:m.m41,y:m.m42};
            });
            await page.waitForFunction(
                () =>
                    Math.abs(
                        new DOMMatrix(
                            getComputedStyle(
                                document.getElementById('group-details-sheet'),
                            ).transform,
                        ).m41,
                    ) < 1,
            );
            await check('Group Settings horizontal transition and group UI preserved', () => {
                const sheet = document.getElementById('group-details-sheet'),
                    style = getComputedStyle(sheet);
                return (
                    (style.transitionProperty.includes('transform') &&
                        new DOMMatrix(style.transform).m42 === 0 &&
                        Math.abs(new DOMMatrix(style.transform).m41) < 1 &&
                        document.querySelector('#chat-interface-ui-char .im-chat-back-count') !=
                            null) || {
                        transition: style.transitionProperty,
                        transform: style.transform,
                    }
                );
            });
            await page.evaluate(() => window.openView(document.getElementById('group-context-settings-sheet')));
            await page.waitForTimeout(450);
            const baselineCss=execFileSync('git',['show','22d35a1:css/imessage.css'],{cwd:root,encoding:'utf8',maxBuffer:2e6});
            const manageCompare=await page.evaluate(async css=>{
                const sheet=document.getElementById('group-context-settings-sheet');
                await Promise.all(sheet.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));
                const snapshot=()=>[sheet.querySelector('.bottom-sheet'),sheet.querySelector('.detail-sheet-content'),...sheet.querySelectorAll('.settings-group')].filter(Boolean).map(e=>{
                    const r=e.getBoundingClientRect();return {top:r.top,left:r.left,width:r.width,height:r.height,border:getComputedStyle(e).borderRadius};
                });
                const actual=snapshot();
                const link=document.querySelector('link[href^="css/imessage.css"]');link.disabled=true;
                const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
                await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
                const expected=snapshot();style.remove();link.disabled=false;
                return {actual,expected};
            },baselineCss);
            assert.deepEqual(manageCompare.actual,manageCompare.expected,label+' Manage Group geometry must match pre-migration');
            console.log('PASS',label,'Manage Group matches pre-migration geometry');
            if (process.env.CHAT_UI_SCREENSHOTS) {
                await page.waitForTimeout(450);
                fs.mkdirSync(process.env.CHAT_UI_SCREENSHOTS,{recursive:true});
                await page.screenshot({path:path.join(process.env.CHAT_UI_SCREENSHOTS,label+'-manage.png')});
            }
            await page.evaluate(() => {
                window.closeView(document.getElementById('group-context-settings-sheet'));
                window.closeView(document.getElementById('group-details-sheet'));
                return window.imChat.openChatTab(window.imApp.getFriendById('ui-char'));
            });
            if (process.env.CHAT_UI_SCREENSHOTS) {
                fs.mkdirSync(process.env.CHAT_UI_SCREENSHOTS, { recursive: true });
                await page.screenshot({
                    path: path.join(process.env.CHAT_UI_SCREENSHOTS, label + '.png'),
                });
            }
            if (label === 'phone') {
                await page.reload({ waitUntil: 'load' });
                await page.waitForFunction(() => typeof window.imChat?.openChatTab === 'function');
                await page.evaluate(async () => {
                    await window.appStorage.ready;
                    await window.imApp.ensureDataReady();
                });
                await check('avatar changes, avatar mode and badge persist after reload', () => {
                    const f = window.imApp.getFriendById('ui-char');
                    return (
                        (f.avatarUpdatedFromMessageId === 'photo' &&
                            f.avatarUpdatedFromGalleryPhotoId === 'gallery_test_photo' &&
                            f.showAvatar &&
                            f.avatarDisplayMode === 'two' &&
                            window.appStorage.loadLegacyKey('imessage_chat_back_badge', '') ===
                                '12345678901234567890') || {
                            source: f.avatarUpdatedFromMessageId,
                            gallery: f.avatarUpdatedFromGalleryPhotoId,
                            mode: f.avatarDisplayMode,
                        }
                    );
                });
            }
            await context.close();
            await browser.close();
            browser = null;
        }
        assert.deepEqual(errors, []);
        console.log('PASS no page errors');
    } finally {
        await browser?.close();
        await new Promise((r) => server.close(r));
    }
})().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
