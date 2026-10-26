// Mock native JavaScript contracts; no native build or paid/network request.
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
        if (plugin === 'U2Health' && method === 'getAvailability') return {available:true};
        if (plugin === 'U2Health' && method === 'readMenstrualChanges') return {samples:[],deletedIds:[],anchor:'next',storeId:'health',hasMore:false};
        if (plugin === 'Filesystem' && method === 'writeFile') return {uri:'file:///cache/qr.png'};
        if (plugin === 'Share' && method === 'share' && importMode === 'cancel') throw new Error('User cancelled');
        if (plugin === 'U2MessageNotifications' && method === 'showMessage') {if (importMode === 'avatarFail') throw new Error('unavailable');return {shown:importMode !== 'avatarFalse'};}
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
                'U2FileExport', 'U2Health', 'Filesystem', 'Share', 'CapacitorHttp', 'U2MessageNotifications',
                'U2IOSNavigation',
                'App',
                'StatusBar',
                'LocalNotifications',
            ].map((name) => ({
                name,
                methods: [
                    ...[
                        'beginImport', 'getAvailability', 'requestReadAuthorization', 'readMenstrualChanges', 'writeFile', 'deleteFile', 'share', 'request', 'showMessage', 'schedule', 'requestPermissions',
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

(async()=>{
 const ios=bridge('ios');await ios.api.ready();assert.equal((await ios.api.getHealthAvailability()).available,true);await ios.api.requestHealthReadAuthorization();await ios.api.readHealthMenstrualChanges({anchor:'a',storeId:'s'});assert(ios.calls.some(c=>c.plugin==='U2Health'&&c.method==='readMenstrualChanges'&&c.args.anchor==='a'));
 assert.equal(await ios.api.shareNetEaseQrImage({dataUrl:'data:image/png;base64,aGVsbG8='}),'shared');assert(ios.calls.some(c=>c.plugin==='Share'&&c.args.files[0]==='file:///cache/qr.png'));assert(ios.calls.some(c=>c.plugin==='Filesystem'&&c.method==='deleteFile'&&c.args.directory==='CACHE'));
 ios.setMode('cancel');assert.equal(await ios.api.shareNetEaseQrImage({dataUrl:'data:image/png;base64,aGVsbG8='}),'cancelled');
 await ios.api.requestNetEaseGateway({url:'https://u2iisony.pages.dev/api/netease/qr/start'});assert(ios.calls.some(c=>c.plugin==='CapacitorHttp'&&c.method==='request'));await assert.rejects(()=>ios.api.requestNetEaseGateway({url:'https://example.invalid/api/netease/qr/start'}));
 ios.setMode('valid');assert.equal(await ios.api.showNotification({title:'Test',body:'Body',senderId:'char',senderName:'Name',avatarUrl:'data:image/png;base64,aGVsbG8='}),true);assert(ios.calls.some(c=>c.plugin==='U2MessageNotifications'&&c.method==='showMessage'&&c.args.senderId==='char'));
 ios.setMode('avatarFail');await ios.api.showNotification({title:'Test',senderId:'char'});assert(ios.calls.some(c=>c.plugin==='LocalNotifications'&&c.method==='schedule'&&c.args.notifications[0].foreground===true));assert(ios.listeners['App:pause']&&ios.listeners['App:resume']);
 const android=bridge('android');await android.api.ready();
 await android.api.showNotification({title:'Test',senderId:'char',senderName:'Sender',avatarUrl:'data:image/png;base64,aGVsbG8=',silent:true});
 const avatar=android.calls.find(c=>c.plugin==='U2MessageNotifications'&&c.method==='showMessage');assert.equal(avatar.args.senderName,'Sender');assert.equal(avatar.args.channelId,'u2_silent_messages');assert(avatar.args.avatarUrl.startsWith('data:image/'));assert(!android.calls.some(c=>c.plugin==='LocalNotifications'&&c.method==='schedule'));
 for(const mode of ['avatarFail','avatarFalse']){android.setMode(mode);const before=android.calls.length;assert.equal(await android.api.showNotification({title:'Test',senderId:'char'}),true);assert(android.calls.slice(before).some(c=>c.plugin==='LocalNotifications'&&c.method==='schedule'));}
 const before=android.calls.length;await android.api.showNotification({title:'Plain'});assert(!android.calls.slice(before).some(c=>c.plugin==='U2MessageNotifications'));assert(android.calls.slice(before).some(c=>c.method==='schedule'));
 console.log('PASS iOS Health authorization/read, NetEase native gateway/share/cancel cleanup, sender-avatar notification/fallback, lifecycle events; Android avatar success, false/throw fallback and ordinary notifications');
})().catch(e=>{console.error(e);process.exitCode=1});
