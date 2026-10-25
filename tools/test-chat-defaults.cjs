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
                    settings: renderOfflineChatSettings,
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
            await page.evaluate(async()=>{
                window.closeView(document.getElementById('offline-chat-view'));
                const a=window.imApp;
                // Real character/group creation and loading normalize records before use.
                await a.commitFriendChange('offline-fixture',f=>Object.assign(f,a.normalizeFriendData(f)),{silent:true,metaOnly:true});
                const fresh=a.normalizeFriendData({id:'fresh',type:'char'});
                const group=a.normalizeFriendData({id:'fresh-group',type:'group'});
                if(fresh.timeAware!==false||fresh.allowRoleRecall!==false||group.timeAware!==false)throw Error('Incorrect missing-field defaults');
                for(const enabled of [true,false])for(const type of ['char','group']){
                    const f=a.normalizeFriendData({type,timeAware:enabled,allowRoleRecall:enabled});
                    if(f.timeAware!==enabled||f.allowRoleRecall!==enabled)throw Error('Explicit saved preferences were overwritten');
                }
                window.__promptBodies=[];
                window.getApiConfig=()=>({endpoint:'https://test.invalid/v1',apiKey:'test',model:'test'});
                window.u2Api={...window.u2Api,fetchChatCompletion:async(_url,opts)=>{
                    const body=typeof opts.body==='string'?JSON.parse(opts.body):opts.body;
                    window.__promptBodies.push(body);
                    const content='<chat_json>'+JSON.stringify([{type:'text',text:'Fixture response.',translation:'测试回复。'}])+'</chat_json>';
                    return body.stream?new Response('data: '+JSON.stringify({choices:[{delta:{content}}]})+'\n\ndata: [DONE]\n\n',{headers:{'Content-Type':'text/event-stream'}})
                        :new Response(JSON.stringify({choices:[{message:{content},finish_reason:'stop'}]}),{headers:{'Content-Type':'application/json'}});
                }};
                window.__requestDefaultPrompt=async()=>{
                    const f=a.getFriendById('offline-fixture');
                    await a.appendFriendMessage(f.id,{id:'request-'+Date.now(),role:'user',type:'text',content:'Hello',timestamp:Date.now()},{silent:true});
                    await window.imChat.handleAiReply(a.getFriendById(f.id),document.querySelector('#chat-interface-offline-fixture .ins-chat-messages'),null,{source:'manual',silent:true});
                    if(!window.__promptBodies.length)throw Error('Expected API request');
                    return JSON.stringify(window.__promptBodies.at(-1).messages);
                };
                a.openChatSettingsForFriend(a.getFriendById('offline-fixture'));
            });
            assert.equal(await page.locator('#chat-time-aware-toggle').isChecked(),false);
            assert.equal(await page.locator('#chat-role-recall-toggle').isChecked(),false);
            console.log('PASS',label,'fresh Chat Settings defaults and explicit saved preferences');
            const offPrompt=await page.evaluate(()=>window.__requestDefaultPrompt());
            assert.ok(!offPrompt.includes('5d. Human-like recall:')&&!offPrompt.includes('Time state for this turn | determined by code'), JSON.stringify({recall:offPrompt.includes('5d. Human-like recall:'),time:offPrompt.includes('Time state for this turn | determined by code'),friend:await page.evaluate(()=>{const f=window.imApp.getFriendById('offline-fixture');return {timeAware:f.timeAware,recall:f.allowRoleRecall,custom:f.customTimeEnabled}})}));
            for(const id of ['chat-time-aware-toggle','chat-role-recall-toggle'])await page.locator('#'+id).locator('..').click();
            await page.waitForFunction(()=>{const f=window.imApp.getFriendById('offline-fixture');return f.timeAware===true&&f.allowRoleRecall===true});
            const onPrompt=await page.evaluate(()=>window.__requestDefaultPrompt());
            assert.ok(onPrompt.includes('5d. Human-like recall:')&&onPrompt.includes('Time state for this turn | determined by code'));
            console.log('PASS',label,'manual Chat Settings opt-in restores real API time and recall instructions');
            await page.evaluate(()=>{window.imApp.openChatSettingsForFriend(window.imApp.getFriendById('offline-fixture'))});
            assert.equal(await page.locator('#chat-time-aware-toggle').isChecked(),true);
            assert.equal(await page.locator('#chat-role-recall-toggle').isChecked(),true);
            for(const id of ['chat-time-aware-toggle','chat-role-recall-toggle'])await page.locator('#'+id).locator('..').click();
            await page.waitForFunction(()=>{const f=window.imApp.getFriendById('offline-fixture');return f.timeAware===false&&f.allowRoleRecall===false});
            assert.ok(!(await page.evaluate(()=>window.__requestDefaultPrompt())).includes('5d. Human-like recall:'));
            await page.evaluate(async()=>{
                window.closeView(document.getElementById('chat-settings-sheet'));
                await window.imApp.commitFriendsChange(()=>window.imData.friends.push(window.imApp.normalizeFriendData({id:'default-group',type:'group',nickname:'Group fixture',realName:'Group fixture',members:['offline-fixture'],messages:[]})));
                window.imApp.openGroupDetails(window.imApp.getFriendById('default-group'));
            });
            await page.locator('#group-details-settings-btn').click();
            assert.equal(await page.locator('#group-time-aware-toggle').isChecked(),false);
            await page.locator('#group-time-aware-toggle').locator('..').click();
            await page.locator('#confirm-group-context-btn').click();
            await page.waitForFunction(()=>window.imApp.getFriendById('default-group').timeAware===true);
            await page.locator('#group-details-settings-btn').click();
            assert.equal(await page.locator('#group-time-aware-toggle').isChecked(),true);
            await page.locator('#group-time-aware-toggle').locator('..').click();
            await page.locator('#confirm-group-context-btn').click();
            await page.waitForFunction(()=>window.imApp.getFriendById('default-group').timeAware===false);
            console.log('PASS',label,'group management default, manual opt-in, reopen and opt-out');
            await page.evaluate(async()=>{await window.imApp.commitFriendChange('offline-fixture',f=>{f.timeAware=true;f.allowRoleRecall=true},{silent:true,metaOnly:true});await window.saveGlobalData();await window.appStorage.flushPendingWrites()});
            await page.reload();
            await page.waitForFunction(()=>typeof window.imApp?.openChatSettingsForFriend==='function');
            await page.evaluate(async()=>{await window.appStorage.ready;await window.globalDataReadyPromise;await window.imApp.ensureDataReady()});
            assert.equal(await page.evaluate(()=>{const f=window.imApp.getFriendById('offline-fixture');return f.timeAware&&f.allowRoleRecall}),true);
            assert.equal(await page.evaluate(()=>window.imApp.getFriendById('default-group').timeAware),false);
            console.log('PASS',label,'saved on/off choices survive refresh');
            assert.deepEqual(errors,[]);
            await context.close();
        }
    } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1});
