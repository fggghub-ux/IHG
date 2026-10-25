// Fresh settings and user opt-in regression, run within test-offline-migration.cjs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/imessage/4_chat_sheet.js'), 'utf8');
const baseline = execFileSync('git', ['show', '62af1a8:js/imessage/4_chat_sheet.js'], { cwd: root, encoding: 'utf8', maxBuffer: 3e6 });
const defaultsBlock = text => text.slice(text.indexOf('        const createOfflineDefaultPrompts'), text.indexOf('        const cloneOfflinePrompt')).replace(/enabled: (true|false)/g, 'enabled: DEFAULT');
assert.equal(defaultsBlock(source), defaultsBlock(baseline), 'Default changes must preserve every prompt, version, order, and capability');

module.exports = async (page, label) => {
    const check = async (name, fn) => {
        const result = await page.evaluate(fn);
        assert.equal(result, true, `${label} ${name}: ${JSON.stringify(result)}`);
        console.log('PASS', label, name);
    };
    await check('fresh settings enable exactly the seven requested switchable blocks', () => {
        const expected = ['role_identity','length_words','bilingual_dialogue','nsfw','style_creative_guidance','style_baimiao','perspective_second'].sort();
        const defaults = window.__offlineTest.defaults();
        const actual = window.imApp.getGlobalOfflinePrompts().filter(p => !p.systemManaged && p.enabled).map(p => p.id).sort();
        return JSON.stringify(actual) === JSON.stringify(expected)
            && defaults.filter(p => p.systemManaged).every(p => p.enabled && p.alwaysEnabled)
            && !window.imData.offlinePrompts.some(p => p.id.startsWith('cot_') && p.enabled);
    });
    await check('disabled optional blocks are excluded from the actual request', async () => {
        const f = window.imApp.getFriendById('offline-fixture');
        const ctx = await window.__offlineTest.context(f, f.offlineMessages);
        const text = ctx.messages.filter(m => m.role === 'system').map(m => m.content).join('\n');
        return !ctx.cotValidation.expectedTitles.length && !text.includes('<offline_cot_instruction>')
            && !text.includes('<barrage_comment_rules>') && !text.includes('<player_choice_rules>')
            && !text.includes('<task_instruction>') && !text.includes('<formatting_rules>')
            && text.includes('<perspective_rule type="second_person">') && !text.includes('<perspective_rule type="third_person">');
    });
    await page.evaluate(() => {
        window.__defaultSnapshot = window.imData.offlinePrompts.map(p => ({...p}));
        window.__offlineTest.settings();
        document.getElementById('offline-chat-settings-sheet').style.display = 'flex';
        window.openView(document.getElementById('offline-chat-settings-sheet'));
    });
    const ids = ['perspective_first','perspective_third','barrage_comments','player_choices','task_instruction','format_rules','offline_recap_haru','cot_before','cot_scene_planning','cot_literary_guidance','cot_language_check','cot_output_audit','cot_read_previous_recap_haru','cot_after'];
    for (const id of ids) {
        const index = await page.evaluate(id => window.imData.offlinePrompts.findIndex(p => p.id === id), id);
        await page.locator('.offline-settings-prompt-item').nth(index).locator('.toggle-switch').click();
        assert.equal(await page.evaluate(id => window.imData.offlinePrompts.find(p => p.id === id).enabled, id), true, `${id} must respond to UI enabling`);
    }
    await page.evaluate(async () => {
        await window.imApp.saveGlobalOfflinePrompts({ prompts: window.imData.offlinePrompts });
        window.closeView(document.getElementById('offline-chat-settings-sheet'));
        window.__offlineTest.render(window.imApp.getFriendById('offline-fixture'));
    });
    await check('manual enabling restores optional prompt mounting and choice controls', async () => {
        const f = window.imApp.getFriendById('offline-fixture');
        const ctx = await window.__offlineTest.context(f, f.offlineMessages);
        const text = ctx.messages.map(m => m.content).join('\n');
        return text.includes('<barrage_comment_rules>') && text.includes('<player_choice_rules>') && text.includes('<task_instruction>')
            && text.includes('<formatting_rules>') && ctx.cotValidation.expectedTitles.length > 0
            && document.querySelectorAll('.offline-chat-choice-btn, .offline-chat-choice-button, [data-offline-choice-index]').length > 0;
    });
    await check('re-enabled COT retains its original thinking boundaries and checklist format', async () => {
        const f = window.imApp.getFriendById('offline-fixture');
        const ctx = await window.__offlineTest.context(f, f.offlineMessages);
        const instruction = ctx.messages.find(m => m.content.includes('<offline_cot_instruction>'))?.content || '';
        const raw = '<thinking>【cot-情景规划】Scene plan.\n【cot-文学指导】Style.</thinking>' + JSON.stringify({content:'Original prose.',translationZh:'中文译文。'});
        const decoded = window.imOfflineReasoning.normalizeResponse(raw);
        const stream = window.__offlineTest.stream('', false, {id:'cot-default-test'});
        stream.appendContentChunk(raw);
        stream.finish();
        const card = document.querySelector('[data-message-id="cot-default-test"]');
        return instruction.includes('<thinking>') && instruction.includes('</thinking>')
            && ctx.cotValidation.expectedTitles.includes('【cot-情景规划】')
            && decoded.reasoning.includes('Scene plan.') && !decoded.content.includes('Scene plan.')
            && card.querySelector('.offline-chat-thinking-content').textContent.includes('Scene plan.')
            && card.querySelector('.offline-chat-bubble-text').textContent.includes('Original prose.')
            && !card.querySelector('.offline-chat-bubble-text').textContent.includes('Scene plan.');
    });
    await check('saved choices survive normalization instead of being forced back to defaults', () => {
        const saved = window.imData.offlinePrompts;
        const normalized = window.__offlineTest.prompts(saved);
        const legacy = window.__offlineTest.defaults().map(p => ({...p, enabled:p.id !== 'perspective_second'}));
        const existing = window.__offlineTest.prompts(legacy);
        const preset = window.imApp.normalizeOfflinePromptPresets([{id:'existing-fixture',name:'Existing preferences',prompts:legacy}])[0];
        return saved.every(p => normalized.find(q => q.id === p.id)?.enabled === p.enabled)
            && legacy.every(p => existing.find(q => q.id === p.id)?.enabled === p.enabled)
            && legacy.every(p => preset.prompts.find(q => q.id === p.id)?.enabled === p.enabled);
    });
    // UI-state saves enqueue storage writes; await the storage API before an immediate reload.
    await page.evaluate(async () => {
        await window.saveGlobalData();
        await window.appStorage.flushPendingWrites();
    });
    await page.reload();
    await page.waitForFunction(() => typeof window.imChat?.openChatTab === 'function');
    await page.evaluate(async () => {
        await window.appStorage.ready;
        await window.globalDataReadyPromise;
        await window.imApp.ensureDataReady();
        document.getElementById('u2-login-screen')?.remove(); document.body.classList.remove('u2-login-locked');
        window.openView(document.getElementById('imessage-view'));
        await window.imChat.openChatTab(window.imApp.getFriendById('offline-fixture'));
        window.imChat.openAttachmentSheet(); await window.__offlineTest.open();
    });
    await check('manual opt-ins persist after refresh', () => ['perspective_third','barrage_comments','player_choices','task_instruction','format_rules','cot_before','cot_scene_planning','cot_after'].every(id => window.imApp.getGlobalOfflinePrompts().find(p => p.id === id)?.enabled));
    // Restore a fresh configuration, leaving the full existing-user suite to opt in explicitly.
    await page.evaluate(async () => {
        await window.imApp.saveGlobalOfflinePrompts({ prompts: window.__offlineTest.defaults() });
        window.__offlineTest.render(window.imApp.getFriendById('offline-fixture'));
    });
};
