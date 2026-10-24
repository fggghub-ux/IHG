// GX/GPT profile UI port: real DOM, persistence, request prompts and device layouts.
// All remote requests are blocked; API replies and image files are local fixtures.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
(async()=>{
 const root=path.resolve(process.env.OFFLINE_TEST_ROOT||path.join(__dirname,'..'));
 const gpt=path.basename(root)==='GX';
 const server=http.createServer((req,res)=>{
  let file=path.join(root,decodeURIComponent(new URL(req.url,'http://local').pathname));
  try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
   res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream');
   if(file.endsWith('/4_chat_sheet.js')){
    let s=fs.readFileSync(file,'utf8');
    s=s.replace("        const chatCloseBtn = document.getElementById",`        window.__offlineTest = {renderOfflineChatBubble, renderOfflineCurrentMessages, normalize: ${gpt?'normalizeOfflineMessagesForFriend':'value_221'}, defaults: createOfflineDefaultPrompts, prompts: normalizeOfflinePrompts, buildApi: ${gpt?'buildOfflineApiMessages':'value_296'}, ${gpt?'':'stream: createStreamingBubble, normalizeChoice: normalizeOfflineChoiceText, parseChoices: parseOfflineChoiceBlocks,'} };
        const chatCloseBtn = document.getElementById`);res.end(s);
   }else fs.createReadStream(file).pipe(res);
  }catch{res.writeHead(404);res.end();}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  for(const [label,width,height] of [['phone',390,844],['ipad',820,1148],['ipad-landscape',1180,788]]){
   if(process.env.OFFLINE_TEST_TARGET&&label!==process.env.OFFLINE_TEST_TARGET)continue;
   const context=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,userAgent:label==='phone'?'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)':'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)'});
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log('BROWSER',m.text().slice(0,700));});
   await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
   await page.addInitScript(()=>{Object.defineProperty(navigator,'maxTouchPoints',{value:5});Object.defineProperty(navigator,'standalone',{value:true});});
   await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'load'});
   await page.waitForFunction(()=>typeof window.imChat?.openChatTab==='function');
   await page.evaluate(async()=>{
    await window.appStorage.ready;await window.globalDataReadyPromise;await window.imApp.ensureDataReady();
    document.getElementById('u2-login-screen')?.remove();document.body.classList.remove('u2-login-locked');
    window.openView(document.getElementById('imessage-view'));
    const f={id:'offline-ui-char',type:'char',realName:'Char Name',nickname:'Nickname',language:'en',messages:[],offlineStreamEnabled:false,offlineMeetEnabled:true,
     offlineCurrentSessionId:'offline-ui-session',offlineMessages:[
      {id:'offline-u',role:'user',content:'Hello.',timestamp:Date.now()-2000},
      {id:'offline-a',role:'assistant',content:'The room is quiet.\n\n“Hello there.”\n\n【选项】\nLook outside\nSit down\nRead a book',reasoning:'Existing COT text',tokens:42,timestamp:Date.now()-1000}
     ]};
    await window.imApp.commitFriendsChange(()=>window.imData.friends.push(f));
    await window.imChat.openChatTab(window.imApp.getFriendById(f.id));
    window.imChat.openAttachmentSheet();
    window.__offlineBaselinePrompts=window.__offlineTest.defaults();
    window.imData.offlinePrompts=window.__offlineTest.defaults().map(p=>({...p,enabled:p.id==='player_choices'||(!/cot/i.test(p.id)&&p.enabled)}));
    window.imData.offlinePromptsInitialized=true;
    document.querySelector('#chat-attachment-sheet .attachment-more-offline-entry').click();
   });
   await page.waitForSelector('#offline-chat-content .offline-chat-bubble.ai');
   await page.waitForTimeout(350);
   const check=async(name,fn)=>{const v=await page.evaluate(fn);assert.equal(v,true,label+' '+name+': '+JSON.stringify(v));console.log('PASS',label,name);};
   await check('profile card, counters, quote styling and choices',()=>{
    const q=s=>document.querySelector(s), a=q('.offline-chat-bubble.ai'),u=q('.offline-chat-bubble.user');
    const quote=a.querySelector('.offline-chat-dialogue');
    return a.querySelector('.offline-chat-name').textContent==='Char Name'&&a.querySelector('.offline-chat-handle').textContent==='@CharName'&&a.querySelector('.offline-chat-content-metric').textContent==='42'&&a.querySelector('.offline-chat-social-item span:last-child').textContent==='2'&&!!a.querySelector('.offline-chat-thinking')&&a.querySelectorAll('.offline-chat-choice-btn').length===3&&a.querySelector('.offline-chat-choice-toggle').textContent==='Related'&&getComputedStyle(quote).boxShadow!=='none'&&u.querySelector('.offline-chat-content-metric').textContent==='6'&&!q('.offline-chat-bubble-meta,.offline-chat-bubble-actions')||{a:a.outerHTML.slice(-2000)};
   });
   const geometry=await page.evaluate(()=>{
    const b=document.querySelector('.offline-chat-bubble.ai'),q=s=>b.querySelector(s),r=e=>{const x=e.getBoundingClientRect();return {x:x.x,y:x.y,width:x.width,height:x.height}},v=document.getElementById('offline-chat-view');
    return {bubble:r(b),banner:r(q('.offline-chat-banner')),avatar:r(q('.offline-chat-avatar')),tools:r(q('.offline-chat-profile-tools')),actions:[...b.querySelectorAll('.offline-chat-social-item')].map(r),scrollWidth:v.scrollWidth,clientWidth:v.clientWidth,input:r(document.querySelector('.offline-chat-input-bar'))};
   });
   assert(geometry.scrollWidth<=geometry.clientWidth+1,JSON.stringify(geometry));
   assert(geometry.bubble.width<=({phone:480,ipad:720,'ipad-landscape':860})[label]);
   fs.writeFileSync('/tmp/offline-geometry-'+(gpt?'gpt':'ihg')+'-'+label+'.json',JSON.stringify(geometry));
   if(gpt){await page.screenshot({path:'/tmp/offline-gpt-'+label+'.png'});await context.close();continue;}
   await check('choice parsing preserves English words and removes only explicit labels',()=>{
    const cases=[['Look outside','Look outside'],['Sit down','Sit down'],['Read a book','Read a book'],['I want to stay','I want to stay'],['A little closer','A little closer'],['Choice matters','Choice matters'],['3 more steps','3 more steps'],['选择向前走','选择向前走'],['1. Look outside','Look outside'],['2) Sit down','Sit down'],['3 Read a book','3 Read a book'],['A. Look outside','Look outside'],['b) Sit down','Sit down'],['①Read a book','Read a book'],['Choice 1: Look outside','Look outside'],['Choice: Sit down','Sit down'],['选项2：Read a book','Read a book']];
    for(const [input,expected] of cases)if(window.__offlineTest.normalizeChoice(input)!==expected)return {input,actual:window.__offlineTest.normalizeChoice(input),expected};
    for(const options of [['Look outside','Sit down','Read a book'],['I want to stay','A little closer','Choice matters'],['A. Look outside','B. Sit down','C. Read a book'],['1. Look outside','2) Sit down','③Read a book']]){
     const parsed=window.__offlineTest.parseChoices('The room is quiet.\n\n【选项】\n'+options.join('\n'));
     const expected=options.map(x=>window.__offlineTest.normalizeChoice(x));
     if(JSON.stringify(parsed.choices)!==JSON.stringify(expected)||parsed.cleanText!=='The room is quiet.')return parsed;
    }
    return true;
   });
   await check('only requested prompt content migrates and enable flags survive',()=>{
    const original=window.__offlineBaselinePrompts;
    const fixture=original.map(p=>({...p,presetVersion:p.id==='bilingual_dialogue'?1:p.id==='format_rules'?2:p.presetVersion,content:p.id==='bilingual_dialogue'?'OLD BILINGUAL':p.id==='format_rules'?'OLD FORMAT':p.content,enabled:false}));
    const p=window.__offlineTest.prompts(fixture),b=p.find(x=>x.id==='bilingual_dialogue'),f=p.find(x=>x.id==='format_rules');
    return b.name==='文本格式'&&b.content.includes('{{default_language}}')&&f.content.includes('straight double quotes')&&p.every(x=>x.alwaysEnabled||x.enabled===false)&&original.filter(x=>!['bilingual_dialogue','format_rules'].includes(x.id)).every(x=>p.find(y=>y.id===x.id)?.content===x.content);
   });
   await page.locator('.offline-chat-bubble.ai .offline-chat-choice-btn').first().click();
   assert.deepEqual(await page.locator('.offline-chat-bubble.ai .offline-chat-choice-text').allTextContents(),['Look outside','Sit down','Read a book']);
   assert.equal(await page.locator('#offline-chat-input').inputValue(),'Look outside');
   await page.locator('#offline-chat-input').fill('');
   await page.locator('.offline-chat-bubble.user .offline-chat-follow-btn').click();
   await page.waitForSelector('#offline-profile-editor.active');
   const field=n=>page.locator(`[data-offline-profile-field="${n}"]`);
   for(const [n,v] of Object.entries({name:'Custom User',handle:'@custom-user',following:'12',followers:'800K',views:'8M',likes:'33K',favorite:'4K'}))await field(n).fill(v);
   const image=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=10;c.height=10;c.getContext('2d').fillRect(0,0,10,10);return c.toDataURL();});
   const upload={name:'profile.png',mimeType:'image/png',buffer:Buffer.from(image.split(',')[1],'base64')};
   await page.locator('.offline-profile-editor-avatar-input').setInputFiles(upload);
   await page.waitForFunction(()=>!!document.querySelector('.offline-profile-editor-avatar-preview img'));
   await page.locator('.offline-profile-editor-banner-input').setInputFiles(upload);
   await page.waitForFunction(()=>!!document.querySelector('.offline-profile-editor-banner-preview img'));
   await page.screenshot({path:'/tmp/offline-editor-'+label+'.png'});
   await page.locator('.offline-profile-editor-save').click();
   await page.waitForFunction(()=>!document.getElementById('offline-profile-editor').classList.contains('active'));
   await check('profile images, handle and statistics persist',()=>{
    const f=window.imApp.getFriendById('offline-ui-char'),p=f.offlineUserProfile,b=document.querySelector('.offline-chat-bubble.user');
    return p.name==='Custom User'&&p.handle==='@custom-user'&&p.followers==='800K'&&p.avatarUrl.startsWith('data:image/')&&f.offlineUserBannerUrl.startsWith('data:image/')&&b.querySelector('.offline-profile-likes-value').textContent==='33K'&&b.querySelector('.offline-chat-banner').classList.contains('has-image');
   });
   await page.locator('.offline-chat-bubble.ai .offline-chat-follow-btn').click();await field('name').fill('Custom Char');await field('handle').fill('@char');await page.locator('.offline-profile-editor-save').click();
   await page.waitForFunction(()=>!document.getElementById('offline-profile-editor').classList.contains('active'));
   await page.locator('.offline-chat-bubble.ai .offline-chat-like-action').click();
   await page.waitForFunction(()=>window.imApp.getFriendById('offline-ui-char').offlineMessages.find(m=>m.id==='offline-a').liked===true);
   await page.locator('.offline-chat-bubble.user .offline-chat-favorite-action').click();
   await page.waitForFunction(()=>window.imApp.getFriendById('offline-ui-char').offlineMessages.find(m=>m.id==='offline-u').saved===true);
   await page.evaluate(()=>window.__offlineTest.renderOfflineCurrentMessages(window.imApp.getFriendById('offline-ui-char')));
   await check('social toggles and edited identities survive rerender',()=>document.querySelector('.offline-chat-bubble.ai .offline-chat-like-action').getAttribute('aria-pressed')==='true'&&document.querySelector('.offline-chat-bubble.user .offline-chat-favorite-action').getAttribute('aria-pressed')==='true'&&document.querySelector('.offline-chat-bubble.ai .offline-chat-name').textContent==='Custom Char');
   await page.locator('.offline-chat-bubble.ai .offline-chat-like-action').click();await page.locator('.offline-chat-bubble.user .offline-chat-favorite-action').click();
   await page.waitForFunction(()=>window.imApp.getFriendById('offline-ui-char').offlineMessages.every(m=>!m.liked&&!m.saved));
   await page.route('https://offline-fixture.invalid/**',async route=>{
    await page.evaluate(body=>window.__offlineRequests.push(body),route.request().postDataJSON());
    await route.fulfill({contentType:'application/json',body:JSON.stringify({choices:[{message:{content:'房间很安静。\n\n“你好。”'},finish_reason:'stop'}],usage:{completion_tokens:23}})});
   });
   await page.evaluate(()=>{
    window.__offlineRequests=[];
    window.getApiConfig=()=>({endpoint:'https://offline-fixture.invalid/v1',apiKey:'fixture',model:'fixture',temperature:.7});

   });
   await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').click();
   await page.waitForFunction(()=>document.querySelector('.offline-chat-bubble.ai .offline-chat-quotes-btn').classList.contains('is-translated'));
   await check('translation cached without changing original or reasoning',()=>{const m=window.imApp.getFriendById('offline-ui-char').offlineMessages.find(m=>m.id==='offline-a');return m.translationZh.includes('你好')&&m.content.includes('Hello there')&&m.reasoning==='Existing COT text'&&document.querySelector('.offline-chat-bubble.ai .offline-chat-bubble-text').textContent.includes('你好');});
   await page.locator('.offline-chat-bubble.ai .offline-chat-quotes-btn').click();
   await check('translation collapses to original',()=>document.querySelector('.offline-chat-bubble.ai .offline-chat-bubble-text').textContent.includes('Hello there')&&window.__offlineRequests.length===1);
   await check('final language guard follows Chat Settings',async()=>{const f=window.imApp.getFriendById('offline-ui-char');for(const l of ['en','ko','zh']){f.language=l;const r=await window.__offlineTest.buildApi(f,f.offlineMessages);const guard=r.messages.find(m=>m.content?.includes('<offline_language_guard'));if(!guard?.content.includes(window.imDataUtils.getChatLanguageName(l))||r.messages.some(m=>m.content.includes('{{default_language}}')))return r;}return true;});
   await page.evaluate(async()=>{
    window.__originalTts=window.u2Tts;window.__speechCalls=[];window.__speechPlays=0;window.__speechDownloads=0;
    window.__originalExport=window.u2ExportFile;
    window.u2ExportFile=async()=>{window.__speechDownloads++;return 'downloaded';};
    window.u2Tts={...window.u2Tts,resolveFriendTtsSettings:()=>({enabled:true}),canSpeakForFriend:()=>true,
     prepareSpeech:async text=>{window.__speechCalls.push(text);return 'data:audio/wav;base64,AAAA';},
     playAudioUrl:async()=>{window.__speechPlays++;return Object.assign(new EventTarget(),{paused:false,ended:false,pause(){this.paused=true;this.dispatchEvent(new Event('pause'));},async play(){this.paused=false;this.dispatchEvent(new Event('play'));}});}};
    const f=window.imApp.getFriendById('offline-ui-char');
    await window.imApp.commitFriendMetaPatch(f.id,{offlineMessages:f.offlineMessages.concat({id:'speech-ui',role:'assistant',content:'"Straight quote."\n\n“Curly quote.”\n\n「Plain text only」',timestamp:Date.now()})},{silent:true});
    window.__offlineTest.renderOfflineCurrentMessages(window.imApp.getFriendById(f.id));
   });
   await check('only new straight/curly dialogue creates speech targets',()=>{const b=document.querySelector('[data-message-id="speech-ui"]');return b.querySelectorAll('.offline-chat-speech.is-playable').length===2&&[...b.querySelectorAll('.offline-chat-speech')].every(e=>!e.textContent.includes('「'));});
   const speech=page.locator('[data-message-id="speech-ui"] .offline-chat-speech.is-playable');
   await speech.first().click();
   await page.waitForSelector('#offline-speech-overlay:not([hidden])');
   await check('original speech dialog opens before generation',()=>document.querySelector('#offline-speech-text').textContent==='Straight quote.'&&window.__speechCalls.length===0&&!!document.querySelector('#offline-speech-regenerate')&&!!document.querySelector('#offline-speech-download'));
   await page.locator('#offline-speech-play').click();
   await page.waitForFunction(()=>window.__speechPlays===1);
   await check('speech text and audio cache use existing storage flow',()=>{const m=window.imApp.getFriendById('offline-ui-char').offlineMessages.find(m=>m.id==='speech-ui');return window.__speechCalls[0]==='Straight quote.'&&m.ttsAudioAssets.length===1&&m.ttsAudioAssets[0].text==='Straight quote.';});
   await page.locator('#offline-speech-close').click();await speech.first().click();await page.locator('#offline-speech-play').click();
   await page.waitForFunction(()=>window.__speechPlays===2);
   assert.equal(await page.evaluate(()=>window.__speechCalls.length),1,'cached speech is reused');
   await page.locator('#offline-speech-regenerate').click();await page.waitForFunction(()=>window.__speechCalls.length===2&&window.__speechPlays===3);
   await page.locator('#offline-speech-download').click();await page.waitForFunction(()=>window.__speechDownloads===1);
   await page.locator('#offline-speech-close').click();await speech.nth(1).click();
   assert.equal(await page.locator('#offline-speech-text').textContent(),'Curly quote.');await page.locator('#offline-speech-close').click();
   console.log('PASS',label,'new dialogue preserves speech popup, generation, cache, preview, regenerate and download');
   await page.evaluate(async()=>{window.u2Tts=window.__originalTts;window.u2ExportFile=window.__originalExport;const f=window.imApp.getFriendById('offline-ui-char');await window.imApp.commitFriendMetaPatch(f.id,{offlineMessages:f.offlineMessages.filter(m=>m.id!=='speech-ui')},{silent:true});window.__offlineTest.renderOfflineCurrentMessages(window.imApp.getFriendById(f.id));});
   await page.evaluate(()=>{const f=window.imApp.getFriendById('offline-ui-char');window.__offlineStream=window.__offlineTest.stream('',false,{id:'stream-ui',floor:3});window.__offlineStream.appendContentChunk('A new reply.\n\n“Hello.”');window.__offlineStream.finish();window.__offlineStream.setTokens(88);});
   await check('streaming token counter uses new footer',()=>document.querySelector('[data-message-id="stream-ui"] .offline-chat-content-metric').textContent==='88');
   await page.locator('.offline-chat-bubble.ai .offline-chat-like-action').first().dispatchEvent('pointerdown',{pointerId:1,button:0,clientX:0,clientY:0});await page.waitForTimeout(900);
   await page.locator('.offline-chat-bubble.ai .offline-chat-like-action').first().dispatchEvent('pointerup',{pointerId:1,button:0});
   await page.locator('.offline-chat-bubble.ai .offline-chat-share-action').first().click();
   await check('postponed gestures and share deletion are absent',()=>window.__offlineRequests.length===1&&window.imApp.getFriendById('offline-ui-char').offlineMessages.length===2&&!document.querySelector('.offline-chat-inline-editor,[data-offline-action="delete"]'));
   await page.evaluate(()=>document.querySelector('[data-message-id="stream-ui"]').remove());
   await page.locator('#offline-chat-settings-btn').click();
   await page.waitForSelector('#offline-chat-settings-sheet.active');
   await check('auto-image icon is blue',()=>getComputedStyle(document.querySelector('.offline-settings-auto-image .offline-settings-worldbook-main > i')).backgroundColor==='rgb(0, 122, 255)');
   await page.locator('#offline-chat-settings-back-btn').click();
   await page.evaluate(async()=>{
    const f=window.imApp.getFriendById('offline-ui-char');
    window.__beforeHistory=f.offlineMeetingSessions;
    await window.imApp.commitFriendMetaPatch(f.id,{offlineMeetingSessions:[{id:'past-ui-session',title:'Past meeting',startedAt:Date.now()-20000,endedAt:Date.now()-10000,messages:[{id:'past-ui',role:'user',content:'A past message',timestamp:Date.now()-15000}],summary:'A past meeting.'}]},{silent:true});
    window.__offlineTest.renderOfflineCurrentMessages(window.imApp.getFriendById(f.id));
   });
   assert.equal(await page.locator('.offline-chat-history-card span').textContent(),'Forever romance');
   await page.locator('.offline-chat-history-card').click();
   assert.equal(await page.locator('.offline-chat-history-back').textContent(),' First encounter');
   await check('history list uses GPT layout',()=>document.getElementById('offline-chat-content').classList.contains('offline-chat-history-list'));
   await page.locator('.offline-chat-history-session').click();
   assert.equal(await page.locator('.offline-chat-history-back').textContent(),' Notification Center');
   await page.locator('.offline-chat-history-back').click();await page.locator('.offline-chat-history-back').click();
   await page.evaluate(async()=>{const f=window.imApp.getFriendById('offline-ui-char');await window.imApp.commitFriendMetaPatch(f.id,{offlineMeetingSessions:window.__beforeHistory||[]},{silent:true});window.__offlineTest.renderOfflineCurrentMessages(window.imApp.getFriendById(f.id));});

   await page.screenshot({path:'/tmp/offline-ihg-'+label+'.png'});
   assert.deepEqual(errors,[],label+' runtime errors');
   console.log('PASS',label,'layout',JSON.stringify(geometry));await context.close();
  }
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
