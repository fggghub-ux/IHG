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
                    patch: patchOfflineMessage
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
        for (const [label,width,height] of [['phone',390,844],['ipad',820,1148],['landscape',1180,788]]) {
            const context = await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,userAgent:'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)'});
            const page=await context.newPage();
            const errors=[];page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().startsWith('Failed to load'))console.log('CONSOLE',msg.text().slice(0,2000))});page.on('pageerror',error=>{errors.push(error.message); console.log('PAGEERROR',error.message)});
            await page.route('**/*',route => new URL(route.request().url()).hostname==='127.0.0.1' ? route.continue() : route.abort());
            await page.goto(`http://127.0.0.1:${server.address().port}`);
            await page.waitForFunction(() => typeof window.imChat?.openChatTab === "function");
            await page.evaluate(async () => {
                await window.appStorage.ready; await window.globalDataReadyPromise; await window.imApp.ensureDataReady();
                document.getElementById('u2-login-screen')?.remove(); document.body.classList.remove('u2-login-locked');
                window.openView(document.getElementById('imessage-view'));
                const t=Date.now();
                await window.imApp.commitFriendsChange(()=>window.imData.friends.push({id:'offline-fixture',type:'char',nickname:'Fixture Char',realName:'Char Name',language:'en',avatarUrl:'',persona:'Test fixture',messages:[],offlineMeetingActive:true,offlineCurrentSessionId:'fixture-session',offlineMessages:[
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
            await page.waitForFunction(()=>document.querySelector('.offline-chat-bubble.ai .offline-chat-avatar img')?.naturalWidth>0);
            await check('unset Char avatar uses the same assets default as Contacts',()=>document.querySelector('.offline-chat-bubble.ai .offline-chat-avatar img').getAttribute('src')==='assets/imessage/default-char-avatar.jpg');
            await check('short notification texts each occupy one line',()=>['Removed from favorites','Translated','Show original'].every(text=>{window.showToast(text);const t=document.getElementById('global-toast')||document.querySelector('.toast-bubble'),range=document.createRange();range.selectNodeContents(t);return range.getClientRects().length===1}));
            await page.screenshot({path:`/tmp/offline-initial-${label}.png`});
            await check('source composer layout stays horizontal',()=>{const bar=document.querySelector('.offline-chat-input-bar'),input=document.getElementById('offline-chat-input'),send=document.getElementById('offline-chat-send-btn');return getComputedStyle(bar).display==='flex'&&send.getBoundingClientRect().left>input.getBoundingClientRect().left&&bar.getBoundingClientRect().height<70});
            await check('English choices retain the first letter',()=>['Ask him.','Come closer.','Stay here.','Choiceful prose'].every(text=>window.__offlineTest.choices(text)===text)&&window.__offlineTest.choices('A. Ask him.')==='Ask him.');
            await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').click();
            await check('translation switches locally',()=>document.querySelector('.offline-chat-bubble.ai .offline-chat-bubble-text').textContent.includes('安静的房间')&&document.querySelector('.toast-bubble').textContent==='Translated');
            await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').click();
            await check('original switches locally',()=>document.querySelector('.offline-chat-bubble.ai .offline-chat-bubble-text').textContent.includes('A quiet room')&&document.querySelector('.toast-bubble').textContent==='Show original');
            await page.evaluate(()=>{window.showToast('test');document.querySelector('.toast-bubble').classList.remove('show')});
            await page.locator('.offline-chat-bubble.ai .offline-chat-like-action').click();
            await page.locator('.offline-chat-bubble.ai .offline-chat-favorite-action').click();
            await check('hidden toast cannot block reactions',()=>{document.querySelector('.toast-bubble').classList.remove('show');const f=window.imApp.getFriendById('offline-fixture'),m=f.offlineMessages.find(m=>m.id==='offline-ai');return m.liked&&m.saved&&getComputedStyle(document.querySelector('.toast-bubble')).pointerEvents==='none'});
            if (label==='phone') {
                await page.evaluate(async()=>{
                    window.__ttsCalls=[];window.__exports=[];
                    window.u2ExportFile=async options=>{window.__exports.push({name:options.fileName,type:options.blob.type,size:options.blob.size});return 'downloaded'};
                    window.u2Tts={...window.u2Tts,
                        resolveFriendTtsSettings:()=>({enabled:true}),canSpeakForFriend:()=>true,
                        prepareSpeech:async text=>{window.__ttsCalls.push(text);return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='},
                        stopPlayback:()=>{},playAudioUrl:async()=>{const a=new EventTarget();a.paused=false;a.ended=false;a.pause=()=>{a.paused=true};a.play=async()=>{a.paused=false};return a}
                    };
                    window.__offlineTest.render(window.imApp.getFriendById('offline-fixture'));
                });
                await page.locator('.offline-chat-bubble.ai .offline-chat-speech').click();
                await page.waitForSelector('#offline-speech-overlay:not([hidden])');
                await check('new quotation opens the existing IHG speech dialog',()=>document.getElementById('offline-speech-text').textContent==='Hello there.'&&document.querySelectorAll('#offline-speech-overlay .offline-speech-controls button').length===3);
                await page.locator('#offline-speech-play').click();
                await page.waitForFunction(()=>document.getElementById('offline-speech-status').textContent==='正在播放');
                await page.locator('#offline-speech-regenerate').click();
                await page.waitForFunction(()=>window.__ttsCalls.length===2&&!document.getElementById('offline-speech-regenerate').disabled);
                await page.locator('#offline-speech-download').click();
                await page.waitForFunction(()=>window.__exports.length===1);
                await check('voice generation, preview, reroll, cache and download survive',()=>window.__ttsCalls.every(x=>x==='Hello there.')&&window.__exports[0].type==='audio/wav'&&window.imApp.getFriendById('offline-fixture').offlineMessages.find(m=>m.id==='offline-ai').ttsAudioAssets.length===1);
                await page.locator('#offline-speech-close').click();
                await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').click();
                await page.locator('.offline-chat-bubble.ai .offline-chat-speech').click();
                await check('translated dialogue still previews the original voice',()=>document.getElementById('offline-speech-text').textContent==='Hello there.'&&!document.getElementById('offline-speech-status').textContent.includes('变化'));
                await page.locator('#offline-speech-close').click();
                await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').click();
                await check('old corner quotes have no compatibility speech wrapper',()=>!window.__offlineTest.text('「Legacy quote」',{messageId:'old-corner',enableVoice:true}).includes('offline-chat-speech'));
            }
            const share=page.locator('.offline-chat-bubble.ai .offline-chat-share-action');
            await share.scrollIntoViewIfNeeded();
            const box=await share.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(850);await page.mouse.up();
            await check('800ms share menu matches online action card',()=>{const c=document.querySelector('.offline-message-menu-card');return c&&[...c.querySelectorAll('.msg-menu-item span')].map(n=>n.textContent).join(',')==='Edit,Reroll,Delete'&&getComputedStyle(c).width==='200px'&&getComputedStyle(c.querySelector('.msg-menu-item')).fontSize==='16px'});
            await page.locator('#offline-message-menu [data-offline-action="edit"]').click();
            await page.locator('.offline-chat-inline-editor').fill('An edited room.\n\n"A changed line."');
            await check('View cannot replace an unsaved original editor',()=>{
                const view=document.querySelector('.offline-chat-bubble.ai .offline-chat-quotes-btn');
                view.dispatchEvent(new MouseEvent('click',{bubbles:true}));
                return view.disabled&&document.querySelector('.offline-chat-inline-editor')?.value==='An edited room.\n\n"A changed line."'&&view.getAttribute('aria-pressed')==='false';
            });
            const oldTranslation=await page.evaluate(()=>window.imApp.getFriendById('offline-fixture').offlineMessages.find(m=>m.id==='offline-ai').translationZh);
            await page.locator('.offline-chat-bubble.ai [data-inline-edit-action="save"]').click();
            await page.waitForFunction(()=>!document.querySelector('.offline-chat-inline-editor'));
            assert.equal(await page.evaluate(()=>window.imApp.getFriendById('offline-fixture').offlineMessages.find(m=>m.id==='offline-ai').translationZh),oldTranslation,label+' original edit retains the exact translation');
            await check('original edit preserves the existing Chinese translation',()=>{const m=window.imApp.getFriendById('offline-fixture').offlineMessages.find(m=>m.id==='offline-ai');return m.content==='An edited room.\n\n"A changed line."'&&m.translationState==='complete'&&!document.querySelector('.offline-chat-bubble.ai .offline-chat-quotes-btn').disabled});
            const openEditor=async()=>{
                const button=page.locator('[data-message-id="offline-ai"] .offline-chat-share-action');
                await button.scrollIntoViewIfNeeded();const b=await button.boundingBox();
                await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.waitForTimeout(850);await page.mouse.up();
                await page.locator('#offline-message-menu [data-offline-action="edit"]').click();
            };
            await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').click();
            await openEditor();
            assert.equal(await page.locator('.offline-chat-inline-editor').inputValue(),oldTranslation,label+' translated view opens its own text');
            await page.locator('.offline-chat-inline-editor').fill('修改后的中文译文。\n\n“新的对白。”');
            const originalSnapshot=await page.evaluate(()=>{const m=window.imApp.getFriendById('offline-fixture').offlineMessages.find(m=>m.id==='offline-ai');return JSON.stringify({content:m.content,tokens:m.tokens,tts:m.ttsAudioAssets})});
            await check('View cannot replace an unsaved translation editor',()=>{
                const view=document.querySelector('.offline-chat-bubble.ai .offline-chat-quotes-btn');
                view.dispatchEvent(new MouseEvent('click',{bubbles:true}));
                return view.disabled&&document.querySelector('.offline-chat-inline-editor')?.value==='修改后的中文译文。\n\n“新的对白。”'&&view.getAttribute('aria-pressed')==='true';
            });
            await page.locator('.offline-chat-bubble.ai [data-inline-edit-action="save"]').click();
            await page.waitForFunction(()=>!document.querySelector('.offline-chat-inline-editor'));
            assert.equal(await page.evaluate(()=>{const m=window.imApp.getFriendById('offline-fixture').offlineMessages.find(m=>m.id==='offline-ai');return JSON.stringify({content:m.content,tokens:m.tokens,tts:m.ttsAudioAssets})}),originalSnapshot,label+' translation edit leaves original text, tokens and audio unchanged');
            await check('translation edit persists independently and stays on the Chinese view',()=>{
                const m=window.imApp.getFriendById('offline-fixture').offlineMessages.find(m=>m.id==='offline-ai');
                return m.translationZh==='修改后的中文译文。\n\n“新的对白。”'&&document.querySelector('.offline-chat-bubble.ai .offline-chat-quotes-btn').getAttribute('aria-pressed')==='true'&&document.querySelector('.offline-chat-bubble.ai .offline-chat-bubble-text').textContent.includes('修改后的中文译文');
            });
            for(const translated of [true,false]){
                if(!translated) await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').click();
                await openEditor();await page.locator('.offline-chat-inline-editor').fill('Unsaved cancellation fixture');
                await page.locator('.offline-chat-bubble.ai [data-inline-edit-action="cancel"]').click();
                await check('cancel restores the selected language and unlocks View',()=>{
                    const m=window.imApp.getFriendById('offline-fixture').offlineMessages.find(m=>m.id==='offline-ai');
                    return !document.querySelector('.offline-chat-inline-editor')&&!document.querySelector('.offline-chat-bubble.ai .offline-chat-quotes-btn').disabled&&m.content==='An edited room.\n\n"A changed line."'&&m.translationZh==='修改后的中文译文。\n\n“新的对白。”';
                });
            }
            await page.locator('.offline-chat-bubble.ai .offline-chat-follow-btn').click();
            await page.locator('[data-offline-profile-field="name"]').fill('Edited Char');
            for (const [field,value] of [['following','11'],['followers','42K'],['views','7M'],['likes','23K'],['favorite','6.5K']]) {
                await page.locator(`[data-offline-profile-field="${field}"]`).fill(value);
            }
            if (label==='phone') {
                const image=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=8;c.height=8;c.getContext('2d').fillRect(0,0,8,8);return c.toDataURL().split(',')[1]});
                for (const kind of ['avatar','banner']) {
                    await page.locator(`.offline-profile-editor-${kind}-input`).setInputFiles({name:'fixture.png',mimeType:'image/png',buffer:Buffer.from(image,'base64')});
                    await page.waitForFunction(kind=>!!document.querySelector(`.offline-profile-editor-${kind}-preview img`),kind);
                }
            }
            await page.locator('.offline-profile-editor-save').click();
            await page.waitForFunction(()=>!document.querySelector('.offline-profile-editor.active'));
            await check('profile Save persists source override fields',()=>window.imApp.getFriendById('offline-fixture').offlineCharProfile?.name==='Edited Char'&&document.querySelector('.offline-chat-bubble.ai .offline-chat-name').textContent==='Edited Char'&&[['following','11'],['followers','42K'],['views','7M'],['likes','23K'],['favorite','6.5K']].every(([field,value])=>window.imApp.getFriendById('offline-fixture').offlineCharProfile[field]===value&&[...document.querySelectorAll('.offline-chat-bubble.ai .offline-profile-'+field+'-value')].every(el=>el.textContent===value)));
            if(label==='phone') {
                await check('only two presets migrate; custom toggles remain',()=>{
                    const defaults=window.__offlineTest.defaults(); const old=defaults.map(x=>({...x, enabled:false}));old.find(x=>x.id==='bilingual_dialogue').presetVersion=1;old.find(x=>x.id==='bilingual_dialogue').name='双语对话';old.find(x=>x.id==='bilingual_dialogue').content='old';
                    const migrated=window.__offlineTest.prompts(old);return migrated.find(x=>x.id==='bilingual_dialogue').name==='文本格式'&&!migrated.find(x=>x.id==='bilingual_dialogue').enabled&&migrated.filter(x=>x.id.startsWith('cot_')).every(x=>!x.enabled);
                });
                await check('JSON field stream handles every split and escapes',()=>{
                    const content='A room.\n\n"Hello \\ friend." 🙂';const raw=JSON.stringify({content,translationZh:'房间。\n\n“你好。”'});
                    for(let i=1;i<=raw.length;i++){const p=window.imOfflineResponse.parse(raw.slice(0,i),{streaming:true});if(p.content.includes('translationZh')||!content.startsWith(p.content))return p;}
                    return window.imOfflineResponse.parse(raw).translationState==='complete'&&window.imOfflineResponse.parse(raw.slice(0,-2)).translationState==='incomplete';
                });
                await page.evaluate(async()=>{
                    window.apiConfig={endpoint:'https://mock.invalid/v1',apiKey:'fixture',model:'fixture',temperature:.7};
                    window.getApiConfig=()=>window.apiConfig;
                    window.__apiCalls=0;
                    window.u2Api={...window.u2Api, fetchChatCompletion:async(_url,options)=>{
                        __apiCalls++;window.__requestBody=options.body;
                        const raw=JSON.stringify({content:'The original streamed text.\n\n"Hello again."',translationZh:'原文的完整译文。\n\n“你好。”'});
                        const cut=raw.indexOf(',"translationZh"');
                        return new Response(new ReadableStream({async start(controller){
                            const send=part=>controller.enqueue(new TextEncoder().encode('data: '+JSON.stringify({choices:[{delta:{content:part}}]})+'\n\n'));
                            send(raw.slice(0,cut));
                            await new Promise(resolve=>window.__releaseTranslation=resolve);
                            send(raw.slice(cut));controller.enqueue(new TextEncoder().encode('data: '+JSON.stringify({choices:[{delta:{},finish_reason:'stop'}]})+'\n\ndata: [DONE]\n\n'));controller.close();
                        }}),{headers:{'Content-Type':'text/event-stream'}});
                    }};
                    document.getElementById('offline-chat-input').value='Next';
                    document.getElementById('offline-chat-send-btn').click();
                });
                await page.waitForTimeout(1000);
                await page.waitForFunction(()=>typeof window.__releaseTranslation==='function');
                await page.waitForTimeout(150);
                await check('stream shows original while translation is pending',()=>{
                    const b=[...document.querySelectorAll('.offline-chat-bubble.ai')].at(-1);return b.querySelector('.offline-chat-bubble-text').textContent==='The original streamed text.\n\n"Hello again."'&&b.querySelector('.offline-chat-quotes-btn').disabled;
                });
                await page.evaluate(async()=>{
                    await window.__offlineTest.patch(window.imApp.getFriendById('offline-fixture'),'offline-ai',live=>({...live,liked:false,saved:true}));
                    await window.imApp.commitFriendChange('offline-fixture',f=>f.offlineMessages.push({id:'concurrent-message',role:'user',content:'Added during translation',timestamp:Date.now()}),{silent:true,metaOnly:true});
                    __releaseTranslation();
                });
                await page.waitForFunction(()=>!document.getElementById('offline-chat-send-btn').classList.contains('is-generating'));
                await check('completed translation preserves concurrent messages and reactions',()=>{
                    const f=window.imApp.getFriendById('offline-fixture'),m=f.offlineMessages.find(m=>m.content.startsWith('The original streamed'));const old=f.offlineMessages.find(m=>m.id==='offline-ai');
                    return (__apiCalls===1&&m?.translationState==='complete'&&m.translationZh.startsWith('原文')&&!m.content.includes('原文')&&f.offlineMessages.some(m=>m.id==='concurrent-message')&&!old.liked&&old.saved)||{calls:__apiCalls,rows:f.offlineMessages};
                });
                await check('later context contains original only and final language guard',async()=>{
                    const ctx=await window.__offlineTest.context(window.imApp.getFriendById('offline-fixture'),window.imApp.getFriendById('offline-fixture').offlineMessages);
                    return !ctx.messages.filter(m=>m.role==='assistant').some(m=>m.content.includes('原文的完整译文'))&&ctx.messages.some(m=>m.role==='system'&&m.content.includes('translationZh')&&m.content.includes('English'));
                });
                await page.evaluate(async()=>{
                    const friend=window.imApp.getFriendById('offline-fixture');
                    window.u2Api={...window.u2Api,fetchChatCompletion:async()=>new Response(JSON.stringify({choices:[{message:{content:'{"content":"A partial original.","translationZh":"未完',reasoning_content:'Native reason'},finish_reason:'length'}]}),{headers:{'Content-Type':'application/json'}})};
                    const result=await window.__offlineTest.request([{role:'user',content:'test'}],null,{stream:false});
                    window.__incompleteResult=result;
                    await window.__offlineTest.patch(friend,'incomplete',()=>({id:'incomplete',role:'assistant',...result,timestamp:Date.now()}),{append:true});
                    window.__offlineTest.render(window.imApp.getFriendById(friend.id));
                });
                await check('interrupted translation remains explicit and makes no extra request',()=>window.__incompleteResult.content==='A partial original.'&&window.__incompleteResult.translationState==='incomplete'&&document.querySelector('[data-message-id="incomplete"] .offline-chat-quotes-btn').textContent==='译文未完成');
                await page.locator('[data-message-id="incomplete"] .offline-chat-quotes-btn').click();
                await check('incomplete View does not launch a translation request',()=>document.querySelector('.toast-bubble').textContent==='译文未完成'&&window.__apiCalls===1);
                await page.evaluate(async()=>{
                    await window.__offlineTest.patch(window.imApp.getFriendById('offline-fixture'),'incomplete',live=>({...live,continuationState:'available',offlineStreamEnabled:false}));
                    window.u2Api={...window.u2Api,fetchChatCompletion:async(_url,options)=>{
                        window.__continuationPrompt=options.body.messages;
                        return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({content:' A continued ending.',translationZh:'部分原文。一个续写结尾。'}),reasoning_content:'Independent native reasoning'},finish_reason:'stop'}]}),{headers:{'Content-Type':'application/json'}});
                    }};
                    window.__offlineTest.render(window.imApp.getFriendById('offline-fixture'));
                });
                await page.locator('[data-message-id="incomplete"] [data-offline-action="continue"]').click();
                await page.waitForFunction(()=>window.imApp.getFriendById('offline-fixture').offlineMessages.find(m=>m.id==='incomplete').translationState==='complete');
                await check('IHG continue entry appends the original and saves the full translation',()=>{const m=window.imApp.getFriendById('offline-fixture').offlineMessages.find(m=>m.id==='incomplete');return m.content==='A partial original. A continued ending.'&&m.translationZh==='部分原文。一个续写结尾。'&&!!m.reasoning&&!m.continuationState});
                await page.evaluate(async()=>{
                    const canvas=document.createElement('canvas');canvas.width=300;canvas.height=150;canvas.getContext('2d').fillRect(0,0,300,150);
                    await window.__offlineTest.patch(window.imApp.getFriendById('offline-fixture'),'test-image',()=>({id:'test-image',type:'offline_generated_image',role:'assistant',imageUrl:canvas.toDataURL(),imageSize:'300x150',sourceMessageId:'incomplete',content:'fixture image',timestamp:Date.now()}),{append:true});
                    window.__offlineTest.render(window.imApp.getFriendById('offline-fixture'));
                });
                await page.locator('[data-message-id="test-image"] [data-offline-action="save-image"]').click();
                await page.waitForFunction(()=>window.__exports.length===2);
                await check('IHG generated-image Save to local stays reachable',()=>window.__exports[1].type==='image/png'&&window.__exports[1].size>0);
                await page.evaluate(async()=>{
                    window.u2Api={...window.u2Api,fetchChatCompletion:async()=>new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({content:'Rerolled original.\n\n"A new line."',translationZh:'重生成原文。\n\n“新的一句话。”'})},finish_reason:'stop'}]}),{headers:{'Content-Type':'application/json'}})};
                    await window.__offlineTest.reroll('incomplete');
                });
                await check('Reroll uses the same dual-field decoder',()=>{const m=window.imApp.getFriendById('offline-fixture').offlineMessages.find(m=>m.id==='incomplete');return m.content.startsWith('Rerolled original')&&m.translationState==='complete'&&m.translationZh.startsWith('重生成原文')});
                await check('Reroll retains IHG cleanup of the old generated image',()=>!window.imApp.getFriendById('offline-fixture').offlineMessages.some(m=>m.id==='test-image'));
                await page.evaluate(async()=>{
                    await window.__offlineTest.patch(window.imApp.getFriendById('offline-fixture'),'delete-fixture',()=>({id:'delete-fixture',role:'user',content:'Delete just this fixture',timestamp:Date.now()}),{append:true});
                    window.__offlineTest.render(window.imApp.getFriendById('offline-fixture'));
                });
                await page.locator('[data-message-id="delete-fixture"] .offline-chat-share-action').scrollIntoViewIfNeeded();
                const imageShare=await page.locator('[data-message-id="delete-fixture"] .offline-chat-share-action').boundingBox();
                await page.mouse.move(imageShare.x+imageShare.width/2,imageShare.y+imageShare.height/2);await page.mouse.down();await page.waitForTimeout(850);await page.mouse.up();
                page.once('dialog',dialog=>dialog.accept());
                await page.locator('#offline-message-menu [data-offline-action="delete"]').click();
                await page.waitForFunction(()=>!window.imApp.getFriendById('offline-fixture').offlineMessages.some(m=>m.id==='delete-fixture'));
                await check('share Delete removes the selected message only',()=>window.imApp.getFriendById('offline-fixture').offlineMessages.some(m=>m.id==='incomplete'));
                await page.reload();
                await page.waitForFunction(()=>typeof window.imChat?.openChatTab==='function');
                await page.evaluate(async()=>{
                    await window.imApp.ensureDataReady();
                    document.getElementById('u2-login-screen')?.remove();document.body.classList.remove('u2-login-locked');
                    window.openView(document.getElementById('imessage-view'));
                    await window.imChat.openChatTab(window.imApp.getFriendById('offline-fixture'));
                    window.imChat.openAttachmentSheet();await window.__offlineTest.open();
                });
                await check('independent language edits survive refresh',()=>{const m=window.imApp.getFriendById('offline-fixture').offlineMessages.find(m=>m.id==='offline-ai');return m.content==='An edited room.\n\n"A changed line."'&&m.translationZh==='修改后的中文译文。\n\n“新的对白。”'});
                await check('refresh retains both fields, concurrent messages and profile overrides',()=>{
                    const f=window.imApp.getFriendById('offline-fixture'),m=f.offlineMessages.find(m=>m.content.startsWith('The original streamed'));
                    return m?.translationState==='complete'&&m.translationZh.startsWith('原文')&&f.offlineMessages.some(m=>m.id==='concurrent-message')&&f.offlineCharProfile.name==='Edited Char'&&f.offlineCharProfile.avatarUrl.startsWith('data:')&&f.offlineCharBannerUrl.startsWith('data:');
                });
            }
            await page.screenshot({path:`/tmp/offline-${label}.png`,fullPage:true});
            assert.deepEqual(errors,[],label+' runtime errors');
            await context.close();
        }
    } finally { await browser.close();server.close(); }
})().catch(error=>{console.error(error);server.close();process.exitCode=1});
