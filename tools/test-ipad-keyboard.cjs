const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const source = fs.readFileSync(process.env.VIEWPORT_SOURCE || path.join(__dirname, '../js/viewport_layout.js'), 'utf8');
function setup({ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', native = false} = {}) {
    const classes = new Set(), props = new Map(), frames = [], timers = new Map();
    let timer = 0;
    const eventTarget = object => Object.assign(object, {
        listeners: {},
        addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); },
        emit(type) { for (const callback of this.listeners[type] || []) callback(); },
    });
    const root = {
        classList: {add: c => classes.add(c), toggle: (c, on) => on ? classes.add(c) : classes.delete(c)},
        style: {setProperty: (k, v) => props.set(k, v)},
    };
    const document = eventTarget({documentElement: root, activeElement: null});
    const viewport = eventTarget({height: 1148, width: 820, offsetTop: 0, scale: 1});
    const window = eventTarget({
        // Deliberately include the standalone 32px discrepancy at rest.
        innerHeight: 1180, innerWidth: 820, visualViewport: viewport, scrollX: 0, scrollY: 0,
        u2NativeBridge: {isNativeAndroid: () => native},
        scrollTo(x, y) { this.scrollX = x; this.scrollY = y; },
    });
    vm.runInNewContext(source, {
        document, window, navigator: {userAgent: ua, platform: 'MacIntel', maxTouchPoints: 5},
        requestAnimationFrame: fn => (frames.push(fn), frames.length),
        setTimeout: fn => (timers.set(++timer, fn), timer), clearTimeout: id => timers.delete(id),
    });
    const flush = () => { while (frames.length) frames.shift()(); };
    const metrics = (height, top = 0, event = 'resize') => {
        viewport.height = height; viewport.offsetTop = top; viewport.emit(event); flush();
    };
    const focus = element => { document.activeElement = element; document.emit(element ? 'focusin' : 'focusout'); flush(); };
    return {classes, props, frames, viewport, window, metrics, focus, flush, document};
}
for (const [label, input] of [
    ['input', {tagName: 'INPUT', type: 'text'}],
    ['textarea', {tagName: 'TEXTAREA'}],
    ['contenteditable', {tagName: 'DIV', isContentEditable: true}],
]) {
    const s = setup();
    const open = () => s.classes.has('app-keyboard-open');
    s.focus(input);
    assert.equal(open(), false, '32px standalone difference is not a keyboard');
    s.metrics(700, 200);
    assert.equal(open(), true);
    assert.equal(s.props.get('--app-viewport-height'), '700px');
    // Sending without blur keeps the keyboard frame; moving focus cannot reset it.
    s.focus(input);
    assert.equal(open(), true);
    s.focus(null);
    assert.equal(open(), true, 'blur precedes the keyboard animation');
    for (const height of [820, 1000, 1050, 1100, 1140]) {
        s.metrics(height, 200);
        assert.equal(open(), true, `do not restore 100vh with ${1148 - height}px still closing`);
        assert.equal(s.props.get('--app-viewport-height'), height + 'px');
        assert(Number.parseFloat(s.props.get('--app-viewport-top')) <= 1148 - height);
    }
    s.window.scrollY = 180;
    s.metrics(1148, 200); // Height restored before WebKit's matching scroll event.
    assert.equal(open(), false);
    assert.equal(s.props.get('--app-viewport-top'), '0px');
    assert.equal(s.window.scrollY, 0);
    s.metrics(1148, 0, 'scroll');
    assert.equal(open(), false);
    // A late offset notification alone must never re-open/reposition the app.
    s.metrics(1148, 200, 'scroll');
    assert.equal(s.props.get('--app-viewport-top'), '0px');
    s.metrics(1148, 0, 'scroll');
    s.focus(input); s.metrics(700, 100); s.focus(null); s.metrics(1050, 50);
    s.focus(input); s.metrics(690, 120); // Reopen while dismissing.
    assert.equal(open(), true);
    s.metrics(1148, 100); // Hardware hide-keyboard button; input still focused.
    assert.equal(open(), false);
    assert.equal(s.props.get('--app-viewport-top'), '0px');
    s.focus(null);
    s.viewport.scale = 2;
    s.metrics(574, 100);
    assert.equal(open(), false, 'pinch zoom is not a keyboard resize');
    s.viewport.scale = 1; s.metrics(1148);
    s.viewport.width = 1180; s.window.innerWidth = 1180; s.window.innerHeight = 820;
    s.metrics(820);
    s.focus(input); s.metrics(500, 50); s.focus(null); s.metrics(780, 40);
    assert.equal(open(), true, 'landscape dismissal also tracks the final pixels');
    s.metrics(820, 40);
    assert.equal(open(), false);
    console.log('PASS iPad keyboard lifecycle:', label);
}
const iphone = setup({ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'});
assert.equal(iphone.classes.has('app-ipad-viewport'), false);
const native = setup({ua: 'Android', native: true});
assert.equal(native.window.appViewport, undefined);
assert.equal(native.classes.size, 0);
console.log('PASS iPhone exclusion and native Android ownership');
