// Requires Playwright. Set CHROMIUM_PATH to use an installed Chromium binary.
const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
const path=require('path'),root=path.resolve(__dirname,'..');
const server=require('http').createServer((req,res)=>{let f=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));try{if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}),args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-zygote']});
const context=await browser.newContext({viewport:{width:820,height:1148},hasTouch:true,isMobile:true,userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/26.1 Safari/605.1.15',serviceWorkers:'allow'});
const page=await context.newPage(); const errors=[];
page.on('pageerror',e=>{errors.push(e.stack);console.log('PAGE ERROR',e.message)});
await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
await page.addInitScript(()=>{Object.defineProperty(navigator,'standalone',{value:true});Object.defineProperty(navigator,'maxTouchPoints',{value:5});});
await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'load'});
await page.evaluate(()=>window.appStorage.ready);
await page.waitForTimeout(1500);
// Runs against an isolated local test profile; all external requests are blocked.
await page.evaluate(async()=>{
 await window.imApp.ensureDataReady();document.getElementById('u2-login-screen')?.remove();document.body.classList.remove('u2-login-locked');
 window.openView(document.getElementById('imessage-view'));
 const char={id:'test-char',type:'char',nickname:'测试角色',realName:'Test',avatarUrl:'assets/moren-thumb.jpg',messages:[]};
 const group={id:'test-group',type:'group',nickname:'测试群',members:['test-char'],messages:[],showGroupTitles:true};
 await window.imApp.commitFriendsChange(()=>{window.imData.friends.push(char,group)});
 await window.imApp.appendFriendMessage(char.id,{id:'test-message',role:'assistant',type:'text',content:'测试消息',timestamp:Date.now()});
 await window.imChat.openChatTab(window.imApp.getFriendById(char.id));
});
const passed=[];
async function check(name,fn){const value=await page.evaluate(fn);if(value!==true)throw new Error(name+': '+JSON.stringify(value));passed.push(name);console.log('PASS',name)}
await check('iPad root and Home width',()=>{const a=document.getElementById('app'),h=document.querySelector('#imessage-view');return a.clientHeight===innerHeight && h.scrollWidth<=h.clientWidth || {app:a.clientHeight,innerHeight,width:h.clientWidth,scroll:h.scrollWidth}});
await check('group admin/title permissions',()=>{const a=window.imApp,g=a.getFriendById('test-group');a.normalizeGroupTitleData(g);a.setGroupAdmin(g,'test-char',true);if(!a.isGroupAdmin(g,'test-char'))return 'admin';a.setGroupMemberTitle(g,'test-char','管理员测试');if(a.getGroupMemberTitle(g,'test-char')!=='管理员测试')return 'title';g.showGroupTitles=false;if(a.areGroupTitlesEnabled(g)!==false)return 'switch';g.showGroupTitles=true;return true});
await page.evaluate(async()=>{await window.imApp.appendFriendMessage('test-group',{id:'test-poll',type:'group_poll',role:'user',timestamp:Date.now(),pollQuestion:'选择一项',pollOptions:[{id:'a',text:'选项甲'},{id:'b',text:'选项乙'}],pollVotes:[]});await window.imChat.openChatTab(window.imApp.getFriendById('test-group'));});
await check('poll votes retain user and reject duplicate/invalid role votes',async()=>{const c=window.imChat,a=window.imApp;await c.selectGroupPollOption('test-group','test-poll','a');await c.applyGroupPollRoleVotes('test-group','test-poll',[{memberId:'test-char',optionId:'b'},{memberId:'test-char',optionId:'a'},{memberId:'unknown',optionId:'a'}]);await c.selectGroupPollOption('test-group','test-poll','b');const m=a.getFriendById('test-group').messages.find(x=>x.id==='test-poll');return m.pollVotes.length===2&&m.pollVotes.every(v=>v.optionId==='b') || m.pollVotes});
await check('poll card fits bubble',()=>{const e=document.querySelector('#chat-interface-test-group .group-poll-bubble');return !!e&&e.clientWidth>100&&e.scrollWidth<=e.clientWidth+1||{html:e?.outerHTML,width:e?.clientWidth,scroll:e?.scrollWidth}});
await page.evaluate(async()=>{await window.imChat.openChatTab(window.imApp.getFriendById('test-char'));window.imApp.openChatSettingsForFriend(window.imApp.getFriendById('test-char'));for(const [id,value]of [['chat-every-message-avatar-toggle',true],['chat-continuous-bubbles-toggle',false],['chat-reply-style-select','outside']]){const e=document.getElementById(id);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(r=>setTimeout(r,100));}});
await check('Chat Settings values and live classes',()=>{const f=window.imApp.getFriendById('test-char'),p=document.getElementById('chat-interface-test-char');return f.showEveryMessageAvatar===true&&f.continuousBubbles===false&&f.replyStyle==='outside'&&p.classList.contains('show-every-message-avatar')&&p.classList.contains('separate-bubbles')||{f,classes:p.className}});
await check('Loves resolves the bound User persona',()=>{const old=window.getAccounts;window.getAccounts=()=>[{id:'bound-test',persona:'绑定人设'}];try{return window.lovesApp.getGenerationUserPersona({boundAccountId:'bound-test'})==='绑定人设'}finally{window.getAccounts=old}});
await check('voice regenerate, cached download and audio storage',async()=>{
 const a=window.imApp,originalTts=window.u2Tts,originalExport=window.u2ExportFile;let generated=0,downloaded=false;
 window.u2Tts={...originalTts,canSpeakForFriend:()=>true,prepareSpeech:async()=>{generated++;return 'data:audio/mpeg;base64,SUQzBAAAAAAA';}};
 window.u2ExportFile=async({blob,fileName})=>{downloaded=blob.size>0&&fileName.endsWith('.mp3');return 'downloaded'};
 try{
 await a.appendFriendMessage('test-char',{id:'voice-test',type:'voice_message',role:'assistant',transcript:'语音测试',text:'语音测试',timestamp:Date.now()});
 let f=a.getFriendById('test-char'),m=f.messages.find(x=>x.id==='voice-test');
 const first=await window.imVoiceMessageAudio.regenerate(f,m);await window.imVoiceMessageAudio.download(f,m);if(generated!==1||!downloaded)return {generated,downloaded};
 const second=await window.imVoiceMessageAudio.regenerate(f,m);if(first.assetId===second.assetId||generated!==2)return 'regenerate did not create new audio';
 f=a.getFriendById('test-char');m=f.messages.find(x=>x.id==='voice-test');if(m.ttsAudioAssetId!==second.assetId||m.ttsAudioText!=='语音测试')return m;
 return !!(await window.appStorage.getAssetBlob(m.ttsAudioAssetId))?.size;
 }finally{window.u2Tts=originalTts;window.u2ExportFile=originalExport}
});

await page.evaluate(()=>{document.getElementById('home-search-toggle').checked=false;document.getElementById('home-search-toggle').dispatchEvent(new Event('change',{bubbles:true}));});
await page.waitForFunction(()=>document.getElementById('home-search-toggle')?.disabled===false&&window.appStorage.loadLegacyKey('homeWidgetPanelEnhanceSettings',{}).showSearch===false);
await page.reload({waitUntil:'load'});await page.waitForFunction(()=>typeof window.imChat?.openChatTab==='function' && typeof window.imApp?.openChatSettingsForFriend==='function');await page.evaluate(()=>window.appStorage.ready);await page.evaluate(async()=>{await window.imApp.ensureDataReady();document.getElementById('u2-login-screen')?.remove();document.body.classList.remove('u2-login-locked');window.openView(document.getElementById('imessage-view'));});
await check('settings and Search persist across reload',()=>{const f=window.imApp.getFriendById('test-char');return f.showEveryMessageAvatar===true&&f.continuousBubbles===false&&f.replyStyle==='outside'&&document.body.classList.contains('home-search-hidden')||{avatar:f.showEveryMessageAvatar,bubbles:f.continuousBubbles,reply:f.replyStyle,search:document.body.className,stored:window.appStorage.loadLegacyKey('homeWidgetPanelEnhanceSettings',{})}});
await check('voice audio persists across reload',async()=>{const f=window.imApp.getFriendById('test-char');await window.imApp.ensureFriendMessagesLoaded(f);const m=f.messages.find(x=>x.id==='voice-test');return m?.ttsAudioText==='语音测试'&&!!(await window.appStorage.getAssetBlob(m.ttsAudioAssetId))?.size});
await check('poll votes persist across reload',async()=>{const f=window.imApp.getFriendById('test-group');await window.imApp.ensureFriendMessagesLoaded(f);return f.messages.find(x=>x.id==='test-poll')?.pollVotes.length===2});
await check('storage breakdown includes voice audio blobs',async()=>{const b=await window.appStorage.getStorageBreakdown();return b.assetBreakdown.bytes>0&&b.assetBreakdown.sources.length>0});
await check('Fish Audio request uses configured model/voice/speed',async()=>{let request;const original=window.fetch;window.fetch=async(url,opts)=>{request={url,opts};return new Response(new Uint8Array([73,68,51]),{status:200,headers:{'content-type':'audio/mpeg'}})};try{const u=await window.u2Tts.prepareSpeech('测试语音',null,{ignoreFriendToggle:true,voiceId:'test-voice',config:{provider:'fish-audio',endpoint:'https://api.fish.audio',apiKey:'test-key',model:'s1'}});const b=JSON.parse(request.opts.body);URL.revokeObjectURL(u);return request.url==='https://api.fish.audio/v1/tts'&&request.opts.headers.model==='s1'&&b.reference_id==='test-voice'&&b.text==='测试语音'||request;}finally{window.fetch=original}});
await check('Char/User reference faces sent with separate identities',async()=>{
 const old=window.fetch;let body;const image='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aNx8AAAAASUVORK5CYII=';
 window.fetch=async(url,opts)=>{body=JSON.parse(opts.body);return new Response(JSON.stringify({candidates:[{content:{parts:[{inlineData:{mimeType:'image/png',data:image}}]}}]}),{headers:{'content-type':'application/json'}})};
 try{const result=await window.u2ImageGeneration.generate('Two people in a park',{config:{provider:'gemini',endpoint:'https://test.invalid/image',apiKey:'test',model:'test',size:'1024x1024'},referenceImages:[{role:'char',imageUrl:'data:image/png;base64,'+image},{role:'user',imageUrl:'data:image/png;base64,'+image}]});return result.charFaceReferenceUsed&&result.userFaceReferenceUsed&&body.input.filter(x=>x.type==='image').length===2&&body.input.some(x=>x.text==='User face identity reference:')&&body.input.some(x=>x.text==='Char face identity reference:')}
 finally{window.fetch=old}
});
await page.evaluate(async()=>{const f=window.imApp.getFriendById('test-char');await window.imChat.openChatTab(f);const p=document.getElementById('chat-interface-test-char'),rows=p.querySelectorAll('.chat-row[data-message-id]');window.imChat.enterBatchSelectMode(f,rows[0],p);window.imChat.toggleBatchRowSelection(f,rows[1],p);p.querySelector('.batch-delete-btn').click();});
await page.locator('#modal-confirm-btn').click({timeout:5000});await page.waitForFunction(()=>window.imApp.getFriendById('test-char').messages.length===0);passed.push('multi-select deletion');console.log('PASS multi-select deletion');
await page.waitForTimeout(450);
await page.evaluate(()=>window.imApp.appendFriendMessage('test-char',{id:'clear-test',type:'text',role:'user',content:'clear test',timestamp:Date.now()}));

// Click the actual custom confirmation button to exercise the web interaction repair.
async function confirmAction(button,setup,predicate){await page.waitForTimeout(450);await page.evaluate(setup);await page.evaluate(id=>document.getElementById(id).click(),button);await page.locator('#modal-confirm-btn').click({timeout:5000});await page.waitForFunction(predicate,{},{timeout:5000});passed.push(button);console.log('PASS',button)}
await confirmAction('clear-history-btn',async()=>{await window.imChat.openChatTab(window.imApp.getFriendById('test-char'));window.imApp.openChatSettingsForFriend(window.imApp.getFriendById('test-char'));},()=>window.imApp.getFriendById('test-char').messages.length===0);
await confirmAction('clear-group-chat-history-btn',()=>{window.imApp.openGroupDetails(window.imApp.getFriendById('test-group'));window.openView(document.getElementById('group-context-settings-sheet'));},()=>window.imApp.getFriendById('test-group').messages.length===0);
await confirmAction('leave-group-chat-btn',()=>{window.imApp.openGroupDetails(window.imApp.getFriendById('test-group'));window.openView(document.getElementById('group-context-settings-sheet'));},()=>window.imApp.getFriendById('test-group').leftGroupAt>0);
await confirmAction('dismiss-group-chat-btn',()=>{window.imApp.openGroupDetails(window.imApp.getFriendById('test-group'));window.openView(document.getElementById('group-context-settings-sheet'));},()=>!window.imApp.getFriendById('test-group'));
await confirmAction('chat-block-friend-btn',()=>window.imApp.openChatSettingsForFriend(window.imApp.getFriendById('test-char')),()=>window.imApp.getFriendById('test-char')?.blockState?.userBlocksChar===true);
await confirmAction('delete-friend-btn',()=>window.imApp.openChatSettingsForFriend(window.imApp.getFriendById('test-char')),()=>!window.imApp.getFriendById('test-char'));
await check('long-term recall keeps untagged memories and legacy text',()=>{
const result=window.imChat.resolveActiveMemoryRecall({id:'recall-fixture',type:'char',memory:{longTerm:'旧版长期记忆',longTermEntries:[{id:'ltm1',title:'记忆',content:'长期内容'}],cherishedEntries:[{id:'cherish1',title:'珍视',content:'珍视内容'}]}},'unrelated context');
return result.longTermEntries.some(e=>e.id==='ltm1')&&result.longTermEntries.some(e=>e.id==='legacy-long-term-text')&&result.cherishedEntries.some(e=>e.id==='cherish1');
});
await page.setViewportSize({width:1180,height:788});
await check('landscape root follows viewport',()=>document.getElementById('app').clientHeight===innerHeight);
console.log('RESULT',JSON.stringify({passed,errors},null,2));
if(errors.length)throw new Error('Unexpected browser errors: '+errors.join('\n'));
await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
