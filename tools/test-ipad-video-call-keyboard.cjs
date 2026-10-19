const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/imessage/video_call.js'), 'utf8');
const start = source.indexOf('    function bindIPadCallKeyboard(');
const end = source.indexOf('    function handleAction_50(', start);
assert(start >= 0 && end > start);

function setup({ ipad = true, managed = false, android = false } = {}) {
    const frames = new Map();
    const timers = new Map();
    const classes = new Set();
    let serial = 0;
    let active = true;
    let captionUpdates = 0;
    const target = value => Object.assign(value, {
        listeners: new Map(),
        addEventListener(type, fn) {
            if (!this.listeners.has(type)) this.listeners.set(type, new Set());
            this.listeners.get(type).add(fn);
        },
        removeEventListener(type, fn) { this.listeners.get(type)?.delete(fn); },
        emit(type) { for (const fn of this.listeners.get(type) || []) fn(); },
    });
    const forbiddenStyle = new Proxy({}, {
        set() { throw new Error('iPad keyboard UI must not write layout styles'); },
    });
    const input = target({});
    const view = {
        clientHeight: 1180,
        style: forbiddenStyle,
        classList: {
            toggle(name, on) { on ? classes.add(name) : classes.delete(name); },
            remove(name) { classes.delete(name); },
        },
    };
    const viewport = target({ height: 1180, width: 820, scale: 1, offsetTop: 0 });
    const document = {
        activeElement: null,
        documentElement: {
            style: forbiddenStyle,
            classList: { contains: name => ipad && name === 'app-ipad-layout' },
        },
    };
    const window = target({
        innerHeight: 1180, innerWidth: 820, scrollY: 0, visualViewport: viewport,
        appViewport: managed ? { managed: true } : undefined,
        mobileInputCompat: { isAndroid: android },
        scrollTo() { throw new Error('iPad keyboard UI must not pan the page'); },
    });
    const context = {
        document, window,
        handleAction_15: () => active,
        handleAction_22: () => { captionUpdates++; },
        requestAnimationFrame(fn) { frames.set(++serial, fn); return serial; },
        cancelAnimationFrame(id) { frames.delete(id); },
        setTimeout(fn) { timers.set(++serial, fn); return serial; },
        clearTimeout(id) { timers.delete(id); },
    };
    vm.runInNewContext(source.slice(start, end) + '\nthis.bind = handleAction_49;', context);
    const dispose = context.bind({ view }, input);
    const flush = () => {
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach(fn => fn());
    };
    const open = () => classes.has('im-video-call-keyboard-open');
    return {
        input, view, viewport, document, window, frames, timers, classes,
        dispose, flush, open,
        end() { active = false; },
        get captionUpdates() { return captionUpdates; },
    };
}
const s = setup();
s.flush();
assert.equal(s.open(), false);
s.document.activeElement = s.input;
s.input.emit('focus');
s.flush();
assert.equal(s.open(), false, 'hardware keyboard/focus alone keeps normal UI');
s.viewport.height = 758;
s.viewport.offsetTop = 390;
s.window.innerHeight = 758;
s.window.scrollY = 422;
s.viewport.emit('resize');
s.flush();
assert(s.open(), 'software keyboard enables existing compact call CSS');
assert.equal(s.captionUpdates, 1);
s.viewport.emit('resize');
s.flush();
assert.equal(s.captionUpdates, 1, 'typing does not repeatedly force caption scrolling');
s.document.activeElement = null;
s.input.emit('blur');
s.flush();
assert(s.open(), 'blur before keyboard dismissal retains compact UI');
s.viewport.height = 1180;
s.window.innerHeight = 1180;
s.viewport.emit('resize');
s.flush();
assert.equal(s.open(), false, 'dismissal restores normal call UI');
s.view.clientHeight = 820;
s.viewport.height = 500;
s.window.innerHeight = 500;
s.document.activeElement = s.input;
s.window.emit('resize');
s.flush();
assert(s.open(), 'landscape uses the call frame height');
s.viewport.height = 820;
s.viewport.emit('resize');
s.flush();
assert.equal(s.open(), false, 'hide-keyboard button works while input stays focused');
s.viewport.scale = 2;
s.viewport.height = 410;
s.viewport.emit('resize');
s.flush();
assert.equal(s.open(), false, 'pinch zoom does not activate keyboard UI');
s.viewport.scale = 1;
s.viewport.height = 500;
s.viewport.emit('resize');
s.flush();
assert(s.open());
s.end();
s.dispose();
assert.equal(s.open(), false);
assert.equal(s.frames.size, 0);
assert.equal(s.timers.size, 0);
s.input.emit('focus');
s.viewport.emit('resize');
s.window.emit('resize');
assert.equal(s.frames.size, 0, 'closing the call removes all listeners');
for (const options of [{ managed: true }, { ipad: false }]) {
    const other = setup(options);
    assert.equal(other.frames.size, 0, 'shared viewport/iPhone paths are untouched');
    assert.equal(other.input.listeners.size, 0);
    other.dispose();
}
console.log('PASS: iPad call keyboard UI, blur/hide/rotation/pinch, cleanup, platform isolation; no layout or page-scroll writes');
