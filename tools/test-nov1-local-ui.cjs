const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'..');const server=http.createServer((req,res)=>{try{let f=path.join(root,new URL(req.url,'http://local').pathname);if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404).end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});
 try{for(const width of [390,820,1180]){
 const ipad=width>700;const context=await browser.newContext({viewport:{width,height:1100},isMobile:true,hasTouch:true,userAgent:ipad?'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)':'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',reducedMotion:'reduce'});const page=await context.newPage(),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('PAGEERROR',e.message);});await page.route('**/*',r=>r.request().url().includes('127.0.0.1')?r.continue():r.abort());
 await page.goto('http://127.0.0.1:'+server.address().port);await page.evaluate(async()=>{
 await window.globalDataReadyPromise;await window.imApp.ensureDataReady();document.getElementById('u2-login-screen')?.remove();document.body.classList.remove('u2-login-locked');
 const photos=['red','green','blue'].map(color=>{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');x.fillStyle=color;x.fillRect(0,0,32,32);return c.toDataURL();});
 await window.imApp.commitFriendsChange(()=>window.imData.friends.push({id:'local-ui',type:'char',nickname:'UI test',messages:[{id:'album-local',type:'image',role:'user',content:photos[0],albumImages:photos.slice(1).map(url=>({url})),description:'Three photos',timestamp:Date.now()-2000},...Array.from({length:25},(_,i)=>({id:'local-text-'+i,type:'text',role:i%2?'user':'assistant',content:'Test message '+i,timestamp:Date.now()-1000+i}))]}));window.openView(document.getElementById('imessage-view'));
 });
 // Real tutorial buttons must render, dismiss the guide and reach the target.
 await page.evaluate(()=>window.openImessageTutorial120());assert.equal(await page.locator('#app-guide-content .app-guide-section-action').count(),8);
 for(const [label,target] of [['去添加 Char','#add-friend-sheet'],['去填写人设','#add-friend-sheet'],['去创建群聊','#create-group-sheet'],['打开 Stickers','#stickers-view'],['去添加表情包','#stickers-view'],['打开 Themes','#theme-config-sheet'],['找到有兔','#official-accounts-view']]){
 await page.evaluate(()=>window.openImessageTutorial120());await page.getByRole('button',{name:label,exact:true}).click();await page.locator('#app-guide-modal').waitFor({state:'hidden'});await page.waitForFunction(s=>document.querySelector(s).classList.contains('active'),target);await page.evaluate(s=>window.closeView(document.querySelector(s)),target);
 }
 await page.evaluate(()=>window.openImessageTutorial120());await page.getByRole('button',{name:'打开 Moments',exact:true}).click();await page.waitForFunction(()=>document.getElementById('nav-moments-btn').classList.contains('active'));await page.evaluate(()=>document.getElementById('nav-home-btn').click());
 console.log('PASS',width,'all eight tutorial action buttons render and navigate');
 // Stored album images must all reach Gallery, preview individually and add independently.
 await page.evaluate(()=>{window.closeView(document.getElementById('imessage-view'));window.galleryApp.open();});await page.waitForFunction(()=>document.querySelectorAll('#gallery-library-content [data-gallery-photo-key]').length===3);
 const tiles=page.locator('#gallery-library-content [data-gallery-photo-key]');assert.equal(await tiles.count(),3);
 for(let i=0;i<3;i++){await tiles.nth(i).click();await page.locator('#gallery-preview').waitFor({state:'visible'});await page.locator('#gallery-preview-add-album').click();await page.waitForFunction(()=>document.getElementById('gallery-preview-add-album').textContent.includes('已在共享相册'));await page.locator('#gallery-preview-close').click();}
 assert.equal(await page.evaluate(()=>window.galleryApp.buildSharedAlbums(window.imData.friends).find(a=>a.id==='local-ui').photos.length),3);
 await page.reload();await page.evaluate(async()=>{await window.globalDataReadyPromise;await window.imApp.ensureDataReady();document.getElementById('u2-login-screen')?.remove();document.body.classList.remove('u2-login-locked');window.galleryApp.open();});await page.waitForFunction(()=>document.querySelectorAll('#gallery-library-content [data-gallery-photo-key]').length===3);
 assert.equal(await page.evaluate(()=>window.galleryApp.buildSharedAlbums(window.imData.friends).find(a=>a.id==='local-ui').photos.length),3);await page.evaluate(()=>window.galleryApp.close());console.log('PASS',width,'three persisted album photos preview, shared-album add and reload');
 // Observe an intermediate animation frame, not just its final class.
 await page.waitForFunction(()=>typeof window.imChat?.openChatTab==='function');
 await page.evaluate(async()=>{window.openView(document.getElementById('imessage-view'));await window.imApp.commitFriendChange('local-ui',f=>{const i=f.messages.findIndex(m=>m.id==='album-local');const m=f.messages.splice(i,1)[0];m.timestamp=Date.now();f.messages.push(m);},{silent:true});await window.imChat.openChatTab(window.imApp.getFriendById('local-ui'));});
 const album=page.locator('#chat-interface-local-ui .photo-batch-summary');await album.scrollIntoViewIfNeeded();const toggle=album.locator('.photo-batch-toggle');await toggle.click();await page.waitForTimeout(60);
 assert.equal(await album.evaluate(e=>e.classList.contains('is-morphing')),ipad,'iPad must animate even when reduced motion is reported; iPhone keeps prior behavior');await page.waitForFunction(()=>!document.querySelector('.photo-batch-summary').classList.contains('is-morphing'));
 await toggle.click();await page.waitForTimeout(60);assert.equal(await album.evaluate(e=>e.classList.contains('is-morphing')),ipad);await page.waitForFunction(()=>!document.querySelector('.photo-batch-summary').classList.contains('is-morphing'));console.log('PASS',width,'expand and collapse intermediate frames under reduced motion');
 // Reply using the actual menu, then cancel; bottom padding must reflect the bar.
 await page.evaluate(()=>{const p=document.getElementById('chat-interface-local-ui'),m=p.querySelector('.ins-chat-messages');m.scrollTop=m.scrollHeight;window.__basePadding=parseFloat(getComputedStyle(m).paddingBottom);});
 for(const id of ['local-text-24','local-text-23']){
 await page.evaluate(id=>window.imChat.showContextMenu(document.querySelector('[data-message-id="'+id+'"]')),id);await page.locator('#msg-context-menu [data-action="reply"]').click();
 await page.waitForFunction(()=>{const p=document.getElementById('chat-interface-local-ui'),m=p.querySelector('.ins-chat-messages');return parseFloat(getComputedStyle(m).paddingBottom)>window.__basePadding+20;});
 const bounds=await page.evaluate(()=>{const p=document.getElementById('chat-interface-local-ui'),m=p.querySelector('.ins-chat-messages'),q=p.querySelector('.reply-preview-container'),last=m.querySelector('.chat-row:last-child');return {last:last.getBoundingClientRect().bottom,quote:q.getBoundingClientRect().top,padding:parseFloat(getComputedStyle(m).paddingBottom)};});assert.ok(bounds.last<=bounds.quote+1,JSON.stringify(bounds));await page.locator('#chat-interface-local-ui .reply-cancel-btn').click();await page.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('#chat-interface-local-ui .ins-chat-messages')).paddingBottom)===window.__basePadding);
 }
 console.log('PASS',width,'Char/User Reply reserves space, keeps last bubble clear and restores on cancel');
 if(width===390){
 await page.evaluate(()=>{window.imChat.closeContextMenu();window.closeView(document.getElementById('imessage-view'));window.galleryApp.open();});await page.waitForFunction(()=>document.querySelectorAll('#gallery-library-content [data-gallery-photo-key]').length===3);
 await page.locator('#gallery-library-content [data-gallery-photo-key]').nth(1).click();await page.locator('#gallery-preview-delete').click();assert.ok((await page.locator('#gallery-delete-confirm-copy').textContent()).includes('共 3 张'));await page.locator('#gallery-delete-confirm-action').click();await page.waitForFunction(()=>document.querySelectorAll('#gallery-library-content [data-gallery-photo-key]').length===0);assert.equal(await page.evaluate(()=>window.imApp.getFriendById('local-ui').messages.some(m=>m.id==='album-local')),false);console.log('PASS group deletion keeps existing message semantics and removes all sibling tiles');
 }
 assert.deepEqual(errors,[]);await context.close();
 }}finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
