// Execute the production prompt, normalization, and persistence code without external traffic.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(root, file), 'utf8');
const clone = value => JSON.parse(JSON.stringify(value));

async function createApp(records) {
    const document = {
        addEventListener() {}, dispatchEvent() {},
        getElementById() { return null; }, querySelector() { return null; },
    };
    const window = {
        document, TextDecoder, atob, Uint8Array, setTimeout, clearTimeout,
        CustomEvent: class { constructor(type) { this.type = type; } },
        console: { log() {}, warn() {}, error() {} },
        addEventListener() {},
        localStorage: { getItem() { return null; }, setItem() {} },
        imStorage: {
            async loadFriends() { return clone([...records.values()]); },
            async saveFriend(friend) { records.set(friend.id, clone(friend)); },
            async saveFriendMetaOnly(friend) { records.set(friend.id, clone(friend)); },
            async patchFriendMeta(id, patch) {
                records.set(id, { ...records.get(id), ...clone(patch) });
            },
        },
    };
    window.window = window;
    const context = vm.createContext(window);
    for (const file of ['js/builtin_worldbook.js', 'js/imessage/2_core.js', 'js/imessage/online_prompts.js'])
        vm.runInContext(source(file), context, { filename: file });
    await window.imApp.ensureDataReady();
    return { window, context };
}

(async () => {
    const records = new Map([
        ['old-on', { id: 'old-on', type: 'char', builtinLivingVibeEnabled: true }],
        ['old-off', { id: 'old-off', type: 'char', builtinLivingVibeEnabled: false }],
        ['new', { id: 'new', type: 'char' }],
    ]);
    const { window: w, context } = await createApp(records);
    const app = w.imApp, store = app.onlinePrompts;
    for (const [id, expected] of [['old-on', true], ['old-off', false], ['new', true]]) {
        const friend = app.getFriendById(id);
        assert.equal(friend.builtinLivingVibeEnabled, expected);
        assert.equal(friend.builtinPunctuationEnabled, expected);
    }
    assert.equal(app.normalizeFriendData({ builtinLivingVibeEnabled: false, builtinPunctuationEnabled: true }).builtinPunctuationEnabled, true);
    console.log('PASS old settings migrate; explicit independent choices survive normalization');

    const entries = w.getBuiltinWorldBookEntries();
    assert.deepEqual(clone(entries.map(e => [e.title, e.injectionPosition, e.systemDepth, e.order])), [
        ['自主交流1.0', 'system_depth', 0, 999],
        ['标点符号准则', 'system_depth', 4, 100],
    ]);
    assert.ok(entries[0].content.includes('Do not deliberately create typos'));
    assert.ok(entries[1].content.includes('These rules govern formatting only.'));
    assert.ok(!entries[0].content.includes('character has own life mood thoughts. LIVING not WAITING.'));
    assert.ok(!entries[1].content.includes('simulate a realistic, modern netizen'));
    console.log('PASS new prompts replace old text; depth and order preserved');

    // Use the actual options expression from the AI request builder, then the real context pipeline.
    const aiSource = source('js/imessage/4_chat_ai.js');
    const optionsCode = aiSource.match(/const worldBookOptions = ([\s\S]*?);\n/)[1];
    assert.ok(optionsCode);
    for (const [a, p] of [[true, true], [false, true], [false, false], [true, false]]) {
        await store.setBuiltinLivingVibeEnabled('old-on', a);
        await store.setBuiltinPunctuationEnabled('old-on', p);
        const friend = app.getFriendById('old-on');
        assert.deepEqual([friend.builtinLivingVibeEnabled, friend.builtinPunctuationEnabled], [a, p]);
        context.friend_31 = friend;
        const options = vm.runInContext('(' + optionsCode + ')', context);
        for (const position of ['before_role', 'after_role', 'system_depth']) {
            const prompt = app.getWorldBookContextForFriendByPosition(position, friend, '', options);
            assert.equal(prompt.includes('【自主交流1.0】'), a && position === 'system_depth');
            assert.equal(prompt.includes('【标点符号准则】'), p && position === 'system_depth');
        }
        assert.equal(app.getFriendById('old-off').builtinLivingVibeEnabled, false);
        assert.equal(app.getFriendById('old-off').builtinPunctuationEnabled, false);
    }
    console.log('PASS all four combinations through AI options and production worldbook pipeline; chats isolated');

    const raw = { id: 'raw', type: 'char', builtinLivingVibeEnabled: false };
    w.imData.friends.push(raw);
    records.set(raw.id, clone(raw));
    await store.setBuiltinLivingVibeEnabled(raw.id, true);
    assert.equal(app.getFriendById(raw.id).builtinPunctuationEnabled, false);
    console.log('PASS first autonomy edit on a raw legacy record preserves punctuation');

    for (const [field, setter] of [
        ['builtinLivingVibeEnabled', 'setBuiltinLivingVibeEnabled'],
        ['builtinPunctuationEnabled', 'setBuiltinPunctuationEnabled'],
    ]) {
        const original = app.commitScopedFriendChange;
        const friend = app.getFriendById('old-on');
        const previous = [friend.builtinLivingVibeEnabled, friend.builtinPunctuationEnabled];
        app.commitScopedFriendChange = async (id, mutate) => { mutate(app.getFriendById(id)); return false; };
        try { await assert.rejects(store[setter](friend.id, !friend[field])); }
        finally { app.commitScopedFriendChange = original; }
        assert.deepEqual([friend.builtinLivingVibeEnabled, friend.builtinPunctuationEnabled], previous);
    }
    const reloaded = (await createApp(records)).window.imApp;
    assert.deepEqual([reloaded.getFriendById('old-on').builtinLivingVibeEnabled,
        reloaded.getFriendById('old-on').builtinPunctuationEnabled], [true, false]);
    console.log('PASS failed writes roll back; independent settings reload from persisted records');

    w.getWorldBooks = () => [{ id: 'user', isGlobal: true, name: 'User Book', entries: [{
        id: 'user-rule', title: 'User Rule', content: 'USER_BOOK_REMAINS', injectionPosition: 'system_depth',
    }] }];
    const prompt = app.getWorldBookContextForFriendByPosition('system_depth', app.getFriendById('old-on'), '', { includeBuiltin: false });
    assert.ok(prompt.includes('USER_BOOK_REMAINS'));
    assert.ok(!prompt.includes('【自主交流1.0】') && !prompt.includes('【标点符号准则】'));
    const html = source('index.html');
    const rows = [...html.matchAll(/<label class="online-prompt-living-vibe" for="([^"]+)">([\s\S]*?)<\/label>/g)];
    assert.deepEqual(rows.map(m => m[1]), ['online-prompt-living-vibe-toggle', 'online-prompt-punctuation-toggle']);
    assert.ok(rows[0][2].includes('内置自主交流') && rows[1][2].includes('标点符号准则'));
    assert.equal(rows[0][2].replace(/内置自主交流|online-prompt-living-vibe-toggle/g, '_'), rows[1][2].replace(/标点符号准则|online-prompt-punctuation-toggle/g, '_'));
    console.log('PASS user worldbooks unaffected; front-end controls share identical markup and correct order');
})().catch(error => { console.error(error); process.exitCode = 1; });
