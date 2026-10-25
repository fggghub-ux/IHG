const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
    let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://local').pathname));
    try {
        if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        res.setHeader('Content-Type', {'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png'}[path.extname(file)] || 'application/octet-stream');
        let data = fs.readFileSync(file);
        if (file.endsWith('/4_chat_sheet.js')) {
            data = data.toString().replace('        value_365_2();', `
                window.__offlineTest = {
                    open: value_328, render: renderOfflineCurrentMessages,
                    normalize: value_221, prompts: normalizeOfflinePrompts,
                    defaults: createOfflineDefaultPrompts, request: value_297,
                    context: value_296, stream: createStreamingBubble,
                    reroll: rerollOfflineAssistantMessage, continue: rerollOfflineAssistantMessage_2,
                    choices: normalizeOfflineChoiceText, text: value_193,
                    editor: openOfflineMessageEditor, patch: patchOfflineMessage
                };
                value_365_2();`);
        }
        res.end(data);
    } catch { res.writeHead(404); res.end(); }
});
(async () => {
    await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
    const browser = await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || '/tmp/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
    try {
        for (const [label,width,height] of [['phone',390,844]]) {
            const context = await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,userAgent:'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)'});
            const page=await context.newPage();
            const errors=[];page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().startsWith('Failed to load'))console.log('CONSOLE',msg.text().slice(0,2000))});page.on('pageerror',error=>{errors.push(error.message); console.log('PAGEERROR',error.message)});
            await page.route('**/*',route => new URL(route.request().url()).hostname==='127.0.0.1' ? route.continue() : route.abort());
            await page.addInitScript(()=>{
                const desc=Object.getOwnPropertyDescriptor(Element.prototype,'scrollTop');window.__writes=[];
                Object.defineProperty(Element.prototype,'scrollTop',{...desc,set(value){
                    const before=desc.get.call(this);desc.set.call(this,value);
                    if(this.id==='offline-chat-content'&&window.__stage)window.__writes.push({time:performance.now(),kind:'scroll',stage:window.__stage,before,value,after:desc.get.call(this),height:this.scrollHeight,editorHeight:document.querySelector('.offline-chat-inline-editor')?.getBoundingClientRect().height,stack:new Error().stack.split('\n').slice(2,4).map(s=>s.slice(0,180))});
                }});
            });
            await page.goto(`http://127.0.0.1:${server.address().port}`);
            await page.waitForFunction(() => typeof window.imChat?.openChatTab === "function");
            await page.evaluate(async () => {
                await window.appStorage.ready; await window.globalDataReadyPromise; await window.imApp.ensureDataReady();
                document.getElementById('u2-login-screen')?.remove(); document.body.classList.remove('u2-login-locked');
                window.openView(document.getElementById('imessage-view'));
                const t=Date.now();
                await window.imApp.commitFriendsChange(()=>window.imData.friends.push({id:'offline-fixture',type:'char',nickname:'Fixture Char',realName:'Char Name',language:'en',avatarUrl:'assets/moren-thumb.jpg',persona:'Test fixture',messages:[],offlineMeetingActive:true,offlineCurrentSessionId:'fixture-session',offlineMessages:[
                    {id:'offline-user',role:'user',content:'Hello',timestamp:t},
                    {id:'offline-ai',role:'assistant',content:'A quiet room.\n\n"Hello there."\n\n【选项】\nAsk him.\nCome closer.\nStay here.',translationZh:'安静的房间。\n\n“你好。”\n\n【选项】\n问他。\n走近。\n留下。',translationState:'complete',timestamp:t+1,tokens:77}
                ]}));
                await window.imChat.openChatTab(window.imApp.getFriendById('offline-fixture'));
                window.imChat.openAttachmentSheet();
                await window.__offlineTest.open();
            });
            await page.waitForSelector('.offline-chat-share-action');
            const check=async(name,fn)=>{const result=await page.evaluate(fn);assert.equal(result,true,`${label} ${name}: ${JSON.stringify(result)}`);console.log('PASS',label,name)};
            await check('source card geometry and original fields',()=>{
                const bubbles=[...document.querySelectorAll('#offline-chat-content .offline-chat-bubble')];
                const ai=bubbles.at(-1); const r=ai.getBoundingClientRect();
                return (bubbles.length===2&&!!ai.querySelector('.offline-chat-banner')&&ai.querySelector('.offline-chat-name').textContent==='Char Name'&&ai.querySelector('.offline-chat-handle').textContent==='@CharName'&&ai.querySelector('.offline-chat-content-metric').textContent==='77'&&ai.querySelectorAll('.offline-chat-social-actions>.offline-chat-social-item').length===5&&r.width<=innerWidth&&document.getElementById('offline-chat-view').scrollWidth<=innerWidth) || {count:bubbles.length,rect:r.toJSON(),html:ai?.innerHTML.slice(-1500)};
            });
            await page.evaluate(async()=>{
                await window.imApp.commitFriendChange('offline-fixture',f=>{const m=f.offlineMessages.find(m=>m.id==='offline-ai');m.content=Array.from({length:28},(_,i)=>'Paragraph '+i+' with enough text to occupy the screen.').join('\n\n');m.translationZh=Array.from({length:7},(_,i)=>'中文段落 '+i+'，这是翻译后的文本。').join('\n\n');},{silent:true,metaOnly:true});
                window.__offlineTest.render(window.imApp.getFriendById('offline-fixture'));
            });
            await page.waitForTimeout(250);
            await page.evaluate(()=>{window.__stage='view';window.__writes=[];});
            await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').click();
            await page.waitForTimeout(250);
            await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').click();
            await page.waitForTimeout(250);
            assert.equal(await page.evaluate(()=>window.__writes.filter(event=>event.kind==='scroll'&&event.before!==event.after).length),0,'View swaps must not trigger scripted bottom scrolling');
            console.log('PASS View swaps do not force scroll to bottom');
            await page.evaluate(()=>window.__offlineTest.editor('offline-ai'));
            await page.locator('.offline-chat-inline-editor').press('Control+End');
            await page.waitForTimeout(250);
            await page.evaluate(()=>{window.__stage='edit';window.__writes=[];});
            for(let i=0;i<4;i++){await page.locator('.offline-chat-inline-editor').press('Enter');await page.locator('.offline-chat-inline-editor').pressSequentially('Extra line '+i,{delay:25});}
            await page.waitForTimeout(250);
            assert.equal(await page.evaluate(()=>window.__writes.filter(event=>event.kind==='scroll'&&event.before!==event.after).length),0,'Editor line breaks must not trigger scripted bottom scrolling');
            console.log('PASS editor line breaks do not force scroll to bottom');
            await page.locator('.offline-chat-bubble.ai [data-inline-edit-action="cancel"]').click();
            await page.evaluate(()=>{
                window.__stage='send';window.__writes=[];
                window.apiConfig={endpoint:'https://fixture.invalid/v1',apiKey:'fixture',model:'fixture'};window.getApiConfig=()=>window.apiConfig;
                window.u2Api={...window.u2Api,fetchChatCompletion:async()=>new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({content:'The new original.',translationZh:'新的原文。'})},finish_reason:'stop'}]}),{headers:{'Content-Type':'application/json'}})};
                const observer=new MutationObserver(()=>{
                    const cards=[...document.querySelectorAll('#offline-chat-content .offline-chat-bubble')];
                    window.__writes.push({time:performance.now(),kind:'cards',roles:cards.map(c=>c.className)});
                });observer.observe(document.getElementById('offline-chat-content'),{childList:true});
                document.getElementById('offline-chat-input').value='New User message';document.getElementById('offline-chat-send-btn').click();
            });
            await page.waitForFunction(()=>document.getElementById('offline-chat-send-btn').classList.contains('is-generating'));
            await page.waitForFunction(()=>!document.getElementById('offline-chat-send-btn').classList.contains('is-generating'));
            const mutations=await page.evaluate(()=>window.__writes.filter(event=>event.kind==='cards'));
            assert.ok(mutations.length>0);
            assert.ok(mutations.every(event=>event.roles.length===4&&event.roles.at(-1).includes('ai')),'No painted User-only intermediate card stage');
            console.log('PASS User and Char cards appear together without an intermediate User-only stage');
            await page.evaluate(()=>{const area=document.getElementById('offline-chat-content');area.scrollTop=0;area.dispatchEvent(new WheelEvent('wheel',{deltaY:-100,bubbles:true}));area.dispatchEvent(new Event('scroll'));});
            await page.waitForSelector('#offline-chat-scroll-latest.is-visible');
            await page.locator('#offline-chat-scroll-latest').click();
            await page.waitForFunction(()=>{const area=document.getElementById('offline-chat-content');return area.scrollHeight-area.scrollTop-area.clientHeight<=2});
            console.log('PASS explicit return-to-latest button still scrolls to bottom');
            await page.evaluate(()=>{
                window.__stream=window.__offlineTest.stream('',false,{id:'scroll-stream',floor:5});
                window.__stream.appendContentChunk('{"content":"Beginning.');
            });
            await page.waitForTimeout(150);
            await page.evaluate(()=>window.__stream.appendContentChunk(JSON.stringify(' More streamed prose.\n\n'.repeat(80)).slice(1,-1)));
            await page.waitForFunction(()=>{const a=document.getElementById('offline-chat-content');return a.scrollHeight-a.scrollTop-a.clientHeight<=2});
            console.log('PASS explicit streaming updates still follow new output');
            await page.evaluate(()=>{const a=document.getElementById('offline-chat-content');a.scrollTop=0;a.dispatchEvent(new WheelEvent('wheel',{deltaY:-100,bubbles:true}));a.dispatchEvent(new Event('scroll'));});
            await page.waitForTimeout(50);
            await page.evaluate(()=>window.__stream.appendContentChunk(JSON.stringify(' More after scrolling up.\n\n'.repeat(20)).slice(1,-1)));
            await page.waitForTimeout(180);
            assert.equal(await page.evaluate(()=>document.getElementById('offline-chat-content').scrollTop),0,'Stream must respect a user who scrolls up');
            console.log('PASS scrolling up during streaming stops automatic following');

            await context.close();
        }
    } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1});
