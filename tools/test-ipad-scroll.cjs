const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/ipad_scroll.js'), 'utf8');
function setup(ipad = true) {
    const listeners = {};
    const body = {};
    const root = { classList: { contains: () => ipad } };
    vm.runInNewContext(source, {
        document: { body, documentElement: root,
            addEventListener: (type, fn) => { listeners[type] = fn; } },
        getComputedStyle: node => ({ overflowY: node.overflow }),
    });
    const node = (parent = body, overflow = 'auto', height = 500) => ({
        nodeType: 1, parentElement: parent, overflow, scrollHeight: height,
        clientHeight: 100, scrollTop: 0, isConnected: true,
        classList: { toggle(name, value) { this.marked = value; } },
    });
    const fire = (type, target, x, y, count = 1) => {
        let prevented = false;
        listeners[type]({ target, touches: Array.from({ length: count }, () =>
            ({ clientX: x, clientY: y })), cancelable: true,
            preventDefault() { prevented = true; } });
        return prevented;
    };
    const drag = (target, x, y) => {
        fire('touchstart', target, 100, 100);
        return fire('touchmove', target, 100 + x, 100 + y);
    };
    return { listeners, node, fire, drag, body };
}
const { node, fire, drag, body } = setup();
const list = node();
const image = node(list, 'hidden', 200);
assert.equal(drag(image, 0, -20), false, 'child image scrolls its list');
assert.equal(image.classList.marked, undefined, 'clipped image is not a scrollport');
assert.equal(drag(image, 0, 20), true, 'top edge cannot pull page');
list.scrollTop = 400;
assert.equal(drag(image, 0, -20), true, 'bottom edge cannot pull page');
assert.equal(drag(image, 0, 20), false, 'reverse from bottom still scrolls');
list.scrollTop = 150;
assert.equal(drag(image, 0, 20), false, 'middle scrolls normally');
assert.equal(drag(body, 0, 20), true, 'page background cannot bounce');
assert.equal(drag(node(body, 'auto', 90), 0, 20), true, 'short content cannot bounce');
assert.equal(drag(node(list, 'auto', 90), 0, 20), false, 'short nested content passes to list');
assert.equal(drag(node(list), 0, 20), true, 'nested scrollport edge stays contained');
assert.equal(drag(body, 30, 2), false, 'horizontal pager remains available');
fire('touchstart', image, 100, 100);
assert.equal(fire('touchmove', image, 100, 120, 2), false, 'pinch is untouched');
fire('touchcancel', image, 100, 120, 0);
assert.equal(fire('touchmove', image, 100, 140), false, 'cancel clears gesture');
const modal = node(body);
fire('wheel', modal, 0, 0);
assert.equal(modal.classList.marked, true, 'body-mounted modal and trackpad covered');
assert.deepEqual(Object.keys(setup(false).listeners), [], 'other platforms get no handlers');
console.log('PASS: iPad scroll boundaries, nested content, reverse scrolling, horizontal/pinch, modal, platform isolation');
