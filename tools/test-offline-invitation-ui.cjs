// Real app rendering/storage and pointer input. API replies and save failures are fixtures.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
(async () => {
    const root = path.resolve(__dirname, '..'), errors = [];
    const server = http.createServer((req, res) => {
        const file = decodeURIComponent(new URL(req.url, 'http://local').pathname).slice(1) || 'index.html';
        try {
            res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)] || 'application/octet-stream');
            res.end(fs.readFileSync(path.join(root, file)));
        } catch { res.writeHead(404).end(); }
    });
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH,
        args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
    async function open(width, height) {
        const context = await browser.newContext({ viewport: {width, height}, hasTouch: true, isMobile: true });
        const page = await context.newPage();
        page.on('pageerror', e => errors.push(e.message));
        await page.route('**/*', r => new URL(r.request().url()).hostname === '127.0.0.1' ? r.continue() : r.abort());
        await page.goto('http://127.0.0.1:' + server.address().port);
        await page.waitForFunction(() => window.imChat?.openChatTab && document.documentElement.style.getPropertyValue('--theme-font-family'));
        await page.evaluate(async () => {
            await window.globalDataReadyPromise; await window.imApp.ensureDataReady();
            document.getElementById('u2-login-screen')?.remove(); document.body.classList.remove('u2-login-locked');
            await window.imApp.commitFriendsChange(() => window.imData.friends.push({id:'invite-ui',type:'char',nickname:'Character Remark',realName:'Different Real Name',messages:[]}));
            window.openView(document.getElementById('imessage-view'));
        });
        return { context, page };
    }
    async function fixture(page, data = {}) {
        await page.evaluate(async data => {
            document.querySelectorAll('.offline-invite-detail-overlay').forEach(e => e.click());
            document.getElementById('offline-chat-view').style.display = 'none';
            await window.imApp.commitFriendChange('invite-ui', f => {
                f.messages = [{id:'invite',role:'assistant',type:'offline_invite',inviteStatus:'pending',title:'晚饭',invitationText:'带你出去吃点东西 散散心',place:'尔湾',timestamp:1793635200000,...data}];
            });
            window.openView(document.getElementById('imessage-view'));
            await window.imChat.openChatTab(window.imApp.getFriendById('invite-ui'));
            window.imChat.rerenderChatContainer(window.imApp.getFriendById('invite-ui'),document.querySelector('#chat-interface-invite-ui .ins-chat-messages'),{scroll:false});
        }, data);
        await page.locator('#chat-interface-invite-ui .offline-invite-face').evaluate(e => e.decode());
        await page.evaluate(() => document.fonts.ready);
    }
    const status = page => page.evaluate(() => window.imApp.getFriendById('invite-ui').messages.find(m => m.id === 'invite')?.inviteStatus);
    async function detail(page) { await page.locator('#chat-interface-invite-ui .offline-invite-card').click(); }
    async function points(page) {
        return page.locator('.offline-invite-slider').evaluate(e => {
            const t=e.querySelector('button').getBoundingClientRect(),r=e.getBoundingClientRect();
            return {x:t.x+t.width/2,y:t.y+t.height/2,left:r.left+6+t.width/2,right:r.right-6-t.width/2,top:r.top,bottom:r.bottom};
        });
    }
    async function start(page, direction = 'left', touch) {
        const p = await points(page);
        if (touch) {
            await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y}]});
            await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:p[direction],y:p.y}]});
        } else {
            await page.mouse.move(p.x,p.y); await page.mouse.down(); await page.mouse.move(p[direction],p.y,{steps:8});
        }
        return p;
    }
    async function shot(page, name) {
        if (process.env.INVITATION_SHOTS) {
            fs.mkdirSync(process.env.INVITATION_SHOTS,{recursive:true});
            await page.screenshot({path:path.join(process.env.INVITATION_SHOTS,name+'.png')});
        }
    }
    try {
        for (const [width,height] of [[390,844],[820,1180],[1180,820],[320,568]]) {
            if(process.env.INVITATION_WIDTH && width!==Number(process.env.INVITATION_WIDTH))continue;
            const {page,context} = await open(width,height);
            if(process.env.INVITATION_ACTIONS_ONLY){await require('./test-offline-invitation-actions.cjs')({page,context,fixture,detail,start,points,status,shot});await context.close();continue;}
            for (const mode of ['none','one','two']) {
                await page.evaluate(async mode => window.imApp.commitFriendChange('invite-ui', f => {f.showAvatar=mode!=='none';f.avatarDisplayMode=mode==='none'?'one':mode;}),mode);
                await fixture(page);
                const card = await page.locator('#chat-interface-invite-ui .offline-invite-card').evaluate(e => {
                    const r=e.getBoundingClientRect(); return {w:r.width,h:r.height,inside:r.left>=0&&r.right<=innerWidth,text:e.textContent.trim(),font:getComputedStyle(e.querySelector('.offline-invite-face-copy')).fontFamily,bg:getComputedStyle(e).backgroundImage};
                });
                assert.equal(card.w,152.5); assert.equal(card.h,152.5); assert.ok(card.inside);
                assert.equal(card.text,'Face IDDate with Character Remark'); assert.match(card.font,/SF Pro Display/);assert.match(card.bg,/linear-gradient/);
                await detail(page);
                const d = await page.locator('.offline-invite-detail').evaluate(e=>({
                    title:e.querySelector('h2').textContent,place:e.querySelector('.offline-invite-detail-place').textContent,
                    summary:e.querySelector('.offline-invite-details p').textContent,text:e.textContent,
                    icon:getComputedStyle(e.querySelector('.offline-invite-detail-icon')).backgroundColor,
                    pin:getComputedStyle(e.querySelector('.offline-invite-detail-icon svg')).color,
                    label:e.querySelector('.offline-invite-slider-label').textContent,
                    labelLines:(()=>{const r=document.createRange();r.selectNodeContents(e.querySelector('.offline-invite-slider-label'));return r.getClientRects().length;})(),
                    fits:e.getBoundingClientRect().left>=0&&e.getBoundingClientRect().right<=innerWidth&&e.scrollWidth<=e.clientWidth,
                }));
                assert.equal(d.title,'晚饭');assert.equal(d.place,'尔湾');assert.equal(d.summary,'带你出去吃点东西 散散心');
                assert.equal(d.text.split(d.summary).length-1,1);assert.ok(!d.text.includes('Note')&&!d.text.includes('线下邀请')&&!d.text.includes('New User'));
                assert.equal(d.icon,'rgb(229, 229, 234)');assert.equal(d.pin,'rgb(0, 0, 0)');assert.equal(d.label,'slide to unlock');assert.equal(d.labelLines,1);assert.ok(d.fits);
                if(mode==='one')await shot(page,'detail-'+width);
                await page.locator('.offline-invite-detail-overlay').click({position:{x:2,y:2}});
            }
            // Long and escaped data; the summary remains exactly one real HTML text node.
            await fixture(page,{title:'晚饭<&>'.repeat(15),invitationText:'带你出去 <script>散心</script>\n'.repeat(20),place:'尔湾<&>'.repeat(12)});
            await detail(page);
            assert.equal(await page.locator('.offline-invite-detail script').count(),0);
            assert.ok(await page.locator('.offline-invite-detail').evaluate(e=>e.scrollWidth<=e.clientWidth&&e.getBoundingClientRect().bottom<=innerHeight));
            await page.locator('.offline-invite-detail').evaluate(e=>e.scrollTop=e.scrollHeight);
            assert.ok(await page.locator('.offline-invite-slider-thumb').isVisible());
            await page.keyboard.press('Escape');
            await fixture(page,{place:'',invitationText:''});await detail(page);
            assert.equal(await page.locator('.offline-invite-detail-place').textContent(),'');assert.equal(await page.locator('.offline-invite-details p').textContent(),'');await page.keyboard.press('Escape');
            // Release early; no state change after the original three-second window.
            await fixture(page);await detail(page);const p=await start(page);
            assert.equal(await page.locator('.offline-invite-slider-label').textContent(),'3s 后自动拒绝 松开取消');
            const red=await page.locator('.offline-invite-slider-thumb').evaluate(e=>({bg:getComputedStyle(e).backgroundColor,c:getComputedStyle(e).color,inside:e.getBoundingClientRect().left>=e.parentElement.getBoundingClientRect().left}));
            await page.waitForTimeout(200);assert.equal(await page.locator('.offline-invite-slider-thumb').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 59, 48)');assert.ok(red.inside);
            await shot(page,'decline-'+width);
            await page.mouse.up();await page.waitForTimeout(3100);assert.equal(await status(page),'pending');
            assert.equal(await page.locator('.offline-invite-slider-label').textContent(),'slide to unlock');
            // Moving out of the track cancels. Reentering while still held does not restart it.
            await start(page);await page.mouse.move(p.left,p.bottom+20);await page.mouse.move(p.left,p.y);await page.waitForTimeout(3100);assert.equal(await status(page),'pending');await page.mouse.up();
            // Partial right drag and a stationary hold never answer the invitation.
            const q=await points(page);await page.mouse.move(q.x,q.y);await page.mouse.down();await page.waitForTimeout(3100);assert.equal(await status(page),'pending');await page.mouse.move(q.x+35,q.y);await page.mouse.up();assert.equal(await status(page),'pending');
            // Touch input follows the same threshold and real three-second hold.
            const touch=await context.newCDPSession(page);await start(page,'left',touch);await page.waitForTimeout(1200);assert.equal(await status(page),'pending');await page.waitForFunction(()=>window.imApp.getFriendById('invite-ui').messages.find(m=>m.id==='invite').inviteStatus==='declined');await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await touch.detach();
            assert.equal(await page.locator('.offline-invite-detail-overlay').count(),0);
            await detail(page);assert.equal(await page.locator('.offline-invite-slider').count(),0);assert.equal(await page.locator('.offline-invite-resolved').textContent(),'已婉拒');await page.keyboard.press('Escape');
            // Cancelled touch input and a closed overlay must also release their timers.
            await fixture(page);await detail(page);const touch2=await context.newCDPSession(page);await start(page,'left',touch2);await touch2.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await page.waitForTimeout(3100);assert.equal(await status(page),'pending');await touch2.detach();await start(page);await page.keyboard.press('Escape');await page.waitForTimeout(3100);assert.equal(await status(page),'pending');
            // Right endpoint flashes blue/unlocked, then calls the existing session path exactly once.
            await page.evaluate(()=>{const accept=window.imChat.acceptOfflineInvitation;window.__acceptCalls=0;window.imChat.acceptOfflineInvitation=async(...args)=>{window.__acceptCalls++;return accept(...args);};});
            await detail(page);await start(page,'right');
            assert.ok(await page.locator('.offline-invite-slider').evaluate(e=>e.classList.contains('is-unlocked')));
            assert.equal(await page.locator('.offline-invite-slider-label').textContent(),'slide to unlock');
            await page.mouse.up();await page.waitForFunction(()=>window.imApp.getFriendById('invite-ui').messages.find(m=>m.id==='invite').inviteStatus==='accepted');
            await page.waitForSelector('#offline-chat-view .offline-invitation-opening');
            const opening=await page.locator('.offline-invitation-opening').evaluate(e=>({title:e.querySelector('strong').textContent,summary:e.querySelector('p').textContent,place:e.querySelector('.offline-opening-place').textContent,font:getComputedStyle(e.querySelector('strong')).fontFamily,parentFont:getComputedStyle(e.parentElement).fontFamily,pin:getComputedStyle(e.querySelector('.offline-opening-place svg')).color,dots:e.querySelectorAll('.offline-opening-dots i').length,images:e.querySelectorAll('img').length,text:e.textContent,r:e.getBoundingClientRect().toJSON(),header:document.querySelector('#offline-chat-view .offline-chat-header').getBoundingClientRect().toJSON(),overflow:e.scrollWidth>e.clientWidth}));
            assert.equal(opening.title,'晚饭');assert.equal(opening.summary,'带你出去吃点东西 散散心');assert.equal(opening.place,'尔湾');assert.equal(opening.font,opening.parentFont);assert.equal(opening.pin,'rgb(255, 255, 255)');assert.equal(opening.dots,2);assert.equal(opening.images,0);assert.ok(!opening.text.includes('本次见面')&&!opening.text.includes('Update'));assert.ok(!opening.overflow);assert.ok(opening.r.top>=opening.header.bottom);assert.equal(await page.evaluate(()=>window.__acceptCalls),1);
            await page.waitForTimeout(400);await shot(page,'opening-'+width);
            await page.locator('.offline-opening-chevron').click();assert.equal(await page.locator('#offline-chat-view').isVisible(),true);
            const saved = await page.evaluate(()=>{const f=window.imApp.getFriendById('invite-ui');return {session:f.offlineCurrentSessionId,context:f.offlineInvitationContext};});assert.ok(saved.session);assert.equal(saved.context.title,'晚饭');assert.equal(saved.context.invitationText,'带你出去吃点东西 散散心');assert.equal(saved.context.place,'尔湾');
            // A second invitation during a meeting reuses the existing session/context behavior.
            await fixture(page,{id:'invite',title:'Another dinner'});await detail(page);await start(page,'right');await page.mouse.up();await page.waitForFunction(()=>window.imApp.getFriendById('invite-ui').messages[0].inviteStatus==='accepted');assert.equal(await page.evaluate(()=>window.imApp.getFriendById('invite-ui').offlineCurrentSessionId),saved.session);assert.deepEqual(await page.evaluate(()=>window.imApp.getFriendById('invite-ui').offlineInvitationContext),saved.context);
            if(width===390)await require('./test-offline-invitation-actions.cjs')({page,context,fixture,detail,start,points,status,shot});
            await context.close();console.log('PASS',width,'three avatar layouts; detail data; left release/move/cancel/close; real touch hold; unlock and existing/new session behavior');
        }
        assert.deepEqual(errors,[]);console.log('PASS invitation UI suite');
    } finally { await browser.close();server.close(); }
})().catch(e=>{console.error(e);process.exit(1);});
