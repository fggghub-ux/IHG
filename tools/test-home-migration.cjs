// Offline browser regression: Home migration, preserved tabs/nav and avatar ownership.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const baseline = process.env.HOME_MIGRATION_BASELINE;
const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const isBaseline = url.pathname.startsWith('/baseline/');
    let file = path.join(isBaseline ? baseline : root, decodeURIComponent(url.pathname.replace(/^\/(?:baseline\/)?/, '')));
    try {
        if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        res.setHeader('Content-Type', {'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png'}[path.extname(file)] || 'application/octet-stream');
        fs.createReadStream(file).pipe(res);
    } catch { res.writeHead(404); res.end(); }
});
async function prepare(page, base) {
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'maxTouchPoints', {value:5});
        Object.defineProperty(navigator, 'standalone', {value:true});
    });
    await page.goto(base, {waitUntil:'load'});
    if (!base.includes('/baseline/')) {
        await page.waitForFunction(() => ['imessage-avatar-img','imessage-home-cover-img'].every(id => {
            const image=document.getElementById(id);
            return image.loading === 'eager' && image.complete && image.naturalWidth > 0;
        }));
        assert.equal(await page.locator('#imessage-view').evaluate(el=>el.classList.contains('active')),false);
        console.log('PASS Home images loaded before the App opens');
    }
    await page.addStyleTag({content:'*, *::before, *::after { transition: none !important; animation: none !important; }'});
    await page.evaluate(async () => {
        await window.appStorage.ready;
        await window.globalDataReadyPromise;
        await window.imApp.ensureDataReady();
        document.getElementById('u2-login-screen')?.remove();
        document.body.classList.remove('u2-login-locked');
        window.syncUIs();
        window.openView(document.getElementById('imessage-view'));
    });
}
async function snapshot(page, tab) {
    await page.evaluate(tab => document.querySelectorAll('.line-nav-item')[tab].click(), tab);
    await page.waitForTimeout(350);
    return page.evaluate(tab => {
        const props=['display','position','width','height','minWidth','minHeight','padding','margin','gap','fontSize','borderRadius','backgroundColor','color','transform'];
        const sample = el => [el.tagName,el.className,...props.map(p=>getComputedStyle(el)[p])];
        const nav = [...document.querySelectorAll('.line-bottom-nav-container, .line-bottom-nav-container *')].map(sample);
        const content = tab === 1 ? [...document.querySelectorAll('#chats-content, #chats-content *')].map(sample) : [];
        return {nav,content};
    },tab);
}
(async () => {
    await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
    const browser = await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || undefined,args:['--no-sandbox']});
    const base='http://127.0.0.1:'+server.address().port+'/';
    try {
        for (const viewport of [{width:390,height:844},{width:820,height:1180},{width:1180,height:820}]) {
            const context=await browser.newContext({viewport,hasTouch:true,isMobile:true});
            const page=await context.newPage();
            const errors=[];
            page.on('pageerror',e=>errors.push(e.message));
            await prepare(page,base);
            if (baseline) {
                const before=await context.newPage();
                await prepare(before,base+'baseline/');
                for (const tab of [0,1,2]) assert.deepEqual(await snapshot(page,tab),await snapshot(before,tab),'unchanged tab/nav metrics at '+viewport.width+', tab '+tab);
                await before.close();
                console.log('PASS',viewport.width,'Home/Chats/Moments nav metrics and complete Chats styles match baseline');
            }
            await snapshot(page,0);
            if (process.env.HOME_MIGRATION_SCREENSHOTS) await page.screenshot({path:path.join(process.env.HOME_MIGRATION_SCREENSHOTS,'home-'+viewport.width+'.png')});
            assert.equal(await page.locator('.line-service-item').count(),4);
            assert.equal(await page.locator('#imessage-game-btn').count(),0);
            assert.equal(await page.locator('.line-service-icon').count(),0);
            assert.equal(await page.locator('#imessage-home-cover-img').evaluate(el=>el.getAttribute('src')),'assets/imessage/home-cover-default.jpg');
            assert.equal(await page.locator('#imessage-home-cover-img').evaluate(el=>el.complete && el.naturalWidth>0),true);
            for (const id of ['settings-avatar-img','edit-avatar-img','imessage-avatar-img','moments-user-avatar-img']) assert.equal(await page.locator('#'+id).getAttribute('src'),'assets/default-user-avatar.jpg',id);
            await page.locator('#imessage-official-accounts-btn').click();
            await page.waitForFunction(()=>getComputedStyle(document.getElementById('official-accounts-view')).display !== 'none');
            await page.evaluate(()=>window.closeView(document.getElementById('official-accounts-view')));
            await page.locator('#imessage-themes-btn').click();
            await page.waitForFunction(()=>getComputedStyle(document.getElementById('theme-config-sheet')).display !== 'none');
            await page.evaluate(()=>window.closeView(document.getElementById('theme-config-sheet')));
            await page.locator('[data-imessage-service="stickers"]').click();
            await page.waitForFunction(()=>getComputedStyle(document.getElementById('stickers-view')).display !== 'none');
            await page.evaluate(()=>window.closeView(document.getElementById('stickers-view')));
            // Upload changes only the cover, survives hydration, and reports the copied status.
            await page.locator('#imessage-home-cover-input').setInputFiles(path.join(root,'assets/default-user-avatar.jpg'));
            await page.waitForFunction(()=>document.getElementById('imessage-home-cover-img').src.startsWith('data:image/'));
            assert.equal(await page.locator('#imessage-home-cover-toast').textContent(),'Cover Updated');
            const cover=await page.locator('#imessage-home-cover-img').getAttribute('src');
            assert.equal(await page.locator('#imessage-avatar-img').getAttribute('src'),'assets/default-user-avatar.jpg');
            await page.reload({waitUntil:'load'});
            await page.evaluate(()=>window.globalDataReadyPromise);
            await page.waitForFunction(()=>document.getElementById('imessage-home-cover-img').src.startsWith('data:image/'));
            assert.equal(await page.locator('#imessage-home-cover-img').getAttribute('src'),cover);
            await page.waitForFunction(()=>document.getElementById('settings-avatar-img').getAttribute('src') === 'assets/default-user-avatar.jpg');
            await page.evaluate(()=>{
                document.getElementById('u2-login-screen')?.remove();
                document.body.classList.remove('u2-login-locked');
                document.getElementById('add-account-btn').click();
            });
            assert.equal(await page.locator('#detail-avatar-img').getAttribute('src'),'assets/default-user-avatar.jpg');
            await page.evaluate(()=>{
                document.getElementById('detail-name-input').value='Migration User';
                document.getElementById('confirm-sync-btn').click();
            });
            await page.waitForFunction(()=>window.getAccounts().some(x=>x.name==='Migration User'));
            assert.equal(await page.evaluate(()=>window.getAccounts().find(x=>x.name==='Migration User').avatarUrl),null,'default preview does not overwrite account avatar data');
            await page.evaluate(()=>window.diaryApp.open());
            await page.waitForFunction(()=>document.querySelector('#diary-profile-avatar img'));
            assert.equal(await page.locator('#diary-profile-avatar img').getAttribute('src'),'assets/default-user-avatar.jpg');
            assert.equal(await page.locator('#moments-user-avatar-wrapper').evaluate(el=>getComputedStyle(el).borderTopWidth),'0px');
            assert.equal(await page.evaluate(()=>createDefaultTkState().profile.avatar),'assets/default-user-avatar.jpg');
            assert.equal(await page.evaluate(()=>normalizeTkState({profile:{avatar:null}}).profile.avatar),'assets/default-user-avatar.jpg');
            assert.equal(await page.evaluate(()=>normalizeTkState({profile:{avatar:'custom.jpg'}}).profile.avatar),'custom.jpg');
            assert.equal(await page.evaluate(()=>normalizeYtUserState({}).avatarUrl),'assets/default-user-avatar.jpg');
            // Existing uploads remain authoritative; the Add account fallback can be replaced.
            await page.evaluate(()=>document.getElementById('add-account-btn').click());
            await page.locator('#detail-avatar-upload').setInputFiles(path.join(root,'assets/imessage/default-char-avatar.jpg'));
            await page.waitForFunction(()=>document.getElementById('detail-avatar-img').src.startsWith('data:image/'));
            await page.evaluate(()=>{
                document.getElementById('detail-name-input').value='Uploaded User';
                document.getElementById('confirm-sync-btn').click();
            });
            await page.waitForFunction(()=>window.getAccounts().some(x=>x.name==='Uploaded User'));
            assert.equal(await page.evaluate(()=>window.getAccounts().find(x=>x.name==='Uploaded User').avatarUrl.startsWith('data:image/')),true);
            assert.equal(await page.locator('#imessage-avatar-img').evaluate(el=>el.src.startsWith('data:image/')),true);
            // Copied contact defaults apply to Char; NPC keeps its existing fallback semantics.
            for (const [button,name] of [['confirm-add-friend-btn','Migration Char'],['confirm-add-npc-btn','Migration NPC']]) {
                await page.evaluate(({button,name})=>{
                    document.getElementById('open-add-friend-sheet-btn').click();
                    document.getElementById('friend-nickname-input').value=name;
                    document.getElementById(button).click();
                },{button,name});
                await page.waitForFunction(name=>window.imData.friends.some(x=>x.nickname===name),name);
            }
            assert.equal(await page.evaluate(()=>window.imData.friends.find(x=>x.nickname==='Migration Char').avatarUrl),'assets/imessage/default-char-avatar.jpg');
            assert.equal(await page.evaluate(()=>window.imData.friends.find(x=>x.nickname==='Migration NPC').avatarUrl),null);

            // Saved Home uploads are restored and decoded while the App stays closed.
            const uploadedAvatar = await page.locator('#imessage-avatar-img').getAttribute('src');
            await page.waitForFunction(()=>window.appStorage.readDomain('settings',{}).accounts?.some(x=>x.name==='Uploaded User'));
            await page.evaluate(()=>window.appStorage.flushPendingWrites());
            await page.reload({waitUntil:'load'});
            await page.waitForFunction(() => ['imessage-avatar-img','imessage-home-cover-img'].every(id => {
                const image=document.getElementById(id);
                return image.src.startsWith('data:image/') && image.complete && image.naturalWidth > 0;
            }));
            assert.equal(await page.locator('#imessage-avatar-img').getAttribute('src'),uploadedAvatar);
            assert.equal(await page.locator('#imessage-home-cover-img').getAttribute('src'),cover);
            assert.equal(await page.locator('#imessage-view').evaluate(el=>el.classList.contains('active')),false);
            assert.deepEqual(errors,[],'no page errors');
            console.log('PASS',viewport.width,'Home entries, cover upload/persistence, default avatars and account fallback ownership');
            await context.close();
        }
    } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error);process.exitCode=1;});
