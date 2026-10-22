// Tests only the JavaScript integrations shipped inside APK 1.1.7. No native build.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/vendor/native_bridge.js'), 'utf8');
function bridge(platform) {
    const calls = [],
        listeners = {},
        classes = new Set();
    let importMode = 'valid';
    const payload = Buffer.from('{"test":true}');
    const promise = async (plugin, method, args) => {
        calls.push({ plugin, method, args });
        if (plugin === 'U2FileExport')
            switch (method) {
                case 'beginImport':
                    return importMode === 'cancel'
                        ? { status: 'cancelled' }
                        : { token: 'import-token', size: payload.length, fileName: 'test.json' };
                case 'readImportChunk':
                    return {
                        data: payload.toString('base64'),
                        offset: importMode === 'corrupt' ? 999 : payload.length,
                    };
                case 'beginExport':
                    return { token: 'export-token' };
                case 'finishExport':
                    return { status: 'downloaded' };
            }
        if (method === 'checkPermissions') return { display: 'granted' };
        return {};
    };
    const win = {
        console: { warn() {}, error() {} },
        atob,
        dispatchEvent(event) {
            listeners[event.type]?.(event);
            return true;
        },
        addEventListener(type, fn) {
            listeners[type] = fn;
        },
        navigator: {},
        location: { origin: 'https://example.invalid' },
        Capacitor: {
            PluginHeaders: [
                'U2FileExport',
                'U2IOSNavigation',
                'App',
                'StatusBar',
                'LocalNotifications',
            ].map((name) => ({
                name,
                methods: [
                    ...[
                        'beginImport',
                        'readImportChunk',
                        'finishImport',
                        'beginExport',
                        'appendExportChunk',
                        'finishExport',
                        'abortExport',
                        'setEnabled',
                        'hide',
                        'checkPermissions',
                        'createChannel',
                    ].map((name) => ({ name, rtype: 'promise' })),
                    { name: 'addListener', rtype: 'callback' },
                ],
            })),
            nativePromise: promise,
            nativeCallback(plugin, method, args, callback) {
                calls.push({ plugin, method, args });
                listeners[plugin + ':' + args.eventName] = callback;
                return Promise.resolve('callback-id');
            },
        },
    };
    if (platform === 'ios') win.webkit = { messageHandlers: { bridge: {} } };
    if (platform === 'android') win.androidBridge = {};
    class Reader {
        readAsDataURL(blob) {
            blob.arrayBuffer().then((buf) => {
                this.result =
                    'data:application/octet-stream;base64,' + Buffer.from(buf).toString('base64');
                this.onload();
            });
        }
    }
    vm.runInNewContext(source, {
        window: win,
        globalThis: win,
        document: {
            documentElement: {
                classList: {
                    toggle(name, on) {
                        on ? classes.add(name) : classes.delete(name);
                    },
                },
            },
        },
        console: win.console,
        Blob,
        FileReader: Reader,
        Uint8Array,
        URL,
        CustomEvent: class {
            constructor(type, options) {
                this.type = type;
                this.detail = options?.detail;
            }
        },
        Date,
        setTimeout,
        clearTimeout,
    });
    return {
        api: win.u2NativeBridge,
        calls,
        listeners,
        classes,
        setMode(mode) {
            importMode = mode;
        },
    };
}
(async () => {
    const ios = bridge('ios');
    await ios.api.ready();
    assert.equal(ios.api.isNativeIOS(), true);
    assert.equal(ios.api.isNativeAndroid(), false);
    assert(ios.classes.has('u2-native-ios'));
    assert(ios.calls.some((c) => c.plugin === 'U2IOSNavigation' && c.args.eventName === 'back'));
    assert(
        !ios.calls.some((c) => ['StatusBar', 'LocalNotifications', 'App'].includes(c.plugin)),
        'iOS must not enter Android initialization',
    );
    const progress = [],
        file = await ios.api.importBackupFile((p) => progress.push(p.progress));
    assert.equal(await file.blob.text(), '{"test":true}');
    assert.equal(file.name, 'test.json');
    assert.deepEqual(progress, [25]);
    assert.equal(ios.calls.at(-1).method, 'finishImport');
    ios.setMode('corrupt');
    await assert.rejects(() => ios.api.importBackupFile(), /备份读取不完整/);
    assert.equal(ios.calls.at(-1).method, 'finishImport');
    ios.setMode('cancel');
    assert.equal(await ios.api.importBackupFile(), null);
    assert.equal(
        await ios.api.exportFile({ blob: new Blob(['export-test']), fileName: 'backup.json' }),
        'downloaded',
    );
    await ios.api.setBackGestureEnabled(true);
    assert.equal(ios.calls.at(-1).args.enabled, true);
    console.log(
        'PASS native iOS bridge: chunk validation, cleanup, cancel, export and navigation gating',
    );
    const web = bridge('web');
    await web.api.ready();
    assert.equal(web.api.isNativeIOS(), false);
    assert.equal(await web.api.importBackupFile(), null);
    await web.api.setBackGestureEnabled(true);
    assert.deepEqual(web.calls, []);
    const android = bridge('android');
    await android.api.ready();
    assert.equal(android.api.isNativeIOS(), false);
    assert.equal(android.api.isNativeAndroid(), true);
    await android.api.setBackGestureEnabled(true);
    assert(!android.calls.some((c) => c.plugin === 'U2IOSNavigation'));
    assert.equal(
        await android.api.exportFile({
            blob: new Blob(['android export']),
            fileName: 'backup.json',
        }),
        'downloaded',
    );
    console.log('PASS ordinary web remains inactive and existing Android export stays available');
    const browser = await chromium.launch({
        headless: true,
        executablePath: process.env.CHROMIUM_PATH,
        args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
    });
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
        const start = html.indexOf('<div class="data-transfer-group" id="ios-icloud-backup-group"');
        const end = html.indexOf('<div class="data-transfer-group">', start + 10);
        await page.setContent(html.slice(start, end));
        await page.evaluate(() => {
            window.__test = {
                imports: 0,
                exports: 0,
                restores: 0,
                show: 0,
                hide: 0,
                confirmed: false,
                mode: 'valid',
                messages: [],
            };
            window.confirm = () => window.__test.confirmed;
            window.showToast = (text) => window.__test.messages.push(text);
            window.u2NativeBridge = {
                isNativeIOS: () => true,
                exportFile: async () => {
                    window.__test.exports++;
                    return 'downloaded';
                },
                importBackupFile: async () => {
                    window.__test.imports++;
                    return {
                        blob: new Blob([
                            window.__test.mode === 'invalid'
                                ? 'bad-json'
                                : JSON.stringify({ schemaVersion: 1, records: [] }),
                        ]),
                        name: 'fixture.json',
                        size: 42,
                    };
                },
            };
            window.appStorage = {
                exportAllData: async () => new Blob(['{}']),
                formatBytes: (size) => size + 'B',
                inspectBackupPayload: (p) => ({
                    schemaVersion: p.schemaVersion,
                    recordCount: 2,
                    assetCount: 3,
                }),
                importAllData: async () => {
                    window.__test.restores++;
                    throw new Error('simulated storage failure');
                },
            };
        });
        await page.addScriptTag({ path: path.join(root, 'js/ios_backup.js') });
        await page.evaluate(() =>
            window.u2InitIosBackup({
                showOperation: () => window.__test.show++,
                updateOperation: () => {},
                hideOperation: () => window.__test.hide++,
                refreshStorageHealth: async () => {},
            }),
        );
        await page.locator('#ios-icloud-export-btn').click();
        await page.waitForFunction(
            () =>
                window.__test.exports === 1 &&
                !document.getElementById('ios-icloud-export-btn').disabled,
        );
        await page.locator('#ios-icloud-import-btn').click();
        await page.waitForFunction(
            () => !document.getElementById('ios-icloud-import-preview').hidden,
        );
        assert.equal(
            await page.evaluate(() => window.__test.restores),
            0,
            'preview must not restore data',
        );
        await page.locator('#ios-icloud-import-btn').click();
        assert.equal(
            await page.evaluate(() => window.__test.restores),
            0,
            'cancel must not restore data',
        );
        await page.evaluate(() => (window.__test.confirmed = true));
        await page.locator('#ios-icloud-import-btn').click();
        await page.waitForFunction(
            () =>
                window.__test.restores === 1 &&
                !document.getElementById('ios-icloud-import-btn').disabled,
        );
        await page.evaluate(() => (window.__test.mode = 'invalid'));
        await page.locator('#ios-icloud-change-file').click();
        await page.waitForFunction(
            () =>
                document.getElementById('ios-icloud-import-preview').hidden &&
                !document.getElementById('ios-icloud-import-btn').disabled,
        );
        assert.equal(
            await page.evaluate(() => window.__test.restores),
            1,
            'invalid file must not restore',
        );
        console.log(
            'PASS APK iCloud interface: export, preview, confirmation cancellation and failed import recovery',
        );
        await page.setContent(
            `<style>section{position:fixed;inset:10px;background:white}#first-view{z-index:1}#dialog{z-index:2}[hidden]{display:none!important}</style><section id="first-view" class="app-view active"><button id="first-back">Back</button></section><section id="dialog" role="dialog"><button id="dialog-close">Close</button></section>`,
        );
        await page.evaluate(() => {
            window.__back = { first: 0, dialog: 0, enabled: [] };
            window.u2NativeBridge = {
                isNativeIOS: () => true,
                setBackGestureEnabled: async (enabled) => window.__back.enabled.push(enabled),
                ready: async () => {},
            };
            document.getElementById('first-back').onclick = () => window.__back.first++;
            document.getElementById('dialog-close').onclick = () => {
                window.__back.dialog++;
                document.getElementById('dialog').hidden = true;
            };
        });
        await page.addScriptTag({ path: path.join(root, 'js/ios_navigation.js') });
        await page.waitForFunction(() => window.__back.enabled.length > 0);
        assert.equal(await page.evaluate(() => window.u2IosNavigation.back()), true);
        assert.deepEqual(
            await page.evaluate(() => [window.__back.first, window.__back.dialog]),
            [0, 1],
        );
        await page.waitForTimeout(420);
        await page.evaluate(() => {
            document.getElementById('first-view').setAttribute('data-ios-back-block', '');
            window.u2IosNavigation.refresh();
        });
        await page.waitForTimeout(50);
        assert.equal(
            await page.evaluate(() => window.u2IosNavigation.back()),
            false,
            'blocking surface must not close lower view',
        );
        await page.evaluate(() => {
            document.getElementById('first-view').removeAttribute('data-ios-back-block');
            window.u2IosNavigation.refresh();
        });
        await page.waitForTimeout(50);
        assert.equal(await page.evaluate(() => window.u2IosNavigation.back()), true);
        assert.equal(await page.evaluate(() => window.__back.first), 1);
        assert.deepEqual(errors, []);
        console.log(
            'PASS APK iOS navigation uses topmost existing controls and honors blocking overlays',
        );
    } finally {
        await browser.close();
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
