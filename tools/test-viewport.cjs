const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname,'../js/viewport_layout.js'),'utf8');
for (const [label, userAgent, maxTouchPoints, ipad] of [
 ['iPad desktop','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)',5,true],
 ['iPad mobile','Mozilla/5.0 (iPad; CPU OS 18_0)',5,true],
 ['iPhone','Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',5,false],
 ['Mac','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)',0,false]
]) {
 const classes = new Set(), props = new Map(), callbacks=[];
 const root = {classList:{add:c=>classes.add(c),toggle:(c,on)=>on?classes.add(c):classes.delete(c)},style:{setProperty:(k,v)=>props.set(k,v)}};
 const listeners=[];
 const listen=(...args)=>listeners.push(args);
 const document = {documentElement:root,activeElement:null,addEventListener:listen};
 const viewport = {height:1180,width:820,offsetTop:0,scale:1,addEventListener:listen};
 const window = {innerHeight:1180,innerWidth:820,visualViewport:viewport,addEventListener:listen,scrollX:0,scrollY:0,scrollTo(x,y){this.scrollX=x;this.scrollY=y}};
 vm.runInNewContext(source,{document,window,navigator:{userAgent,maxTouchPoints},requestAnimationFrame:f=>(callbacks.push(f),callbacks.length),setTimeout,clearTimeout});
 const refresh=()=>{window.appViewport.refresh(); callbacks.shift()()};
 assert.equal(classes.has('app-ipad-layout'),ipad,label);
 assert.equal(classes.has('app-keyboard-open'),false);
 if (ipad) {
  assert.equal(window.appViewport,undefined,'APK-style iPad layout has no second viewport owner');
  assert.equal(classes.has('app-viewport-managed'),false);
  assert.equal(listeners.length,0,'no keyboard/scroll/focus interception');
  assert.equal(props.size,0,'no inline viewport height or top');
  assert.equal(callbacks.length,0,'no queued geometry writes');
  console.log(label+': APK layout ownership retained PASS');
  continue;
 }
 document.activeElement={tagName:'INPUT',type:'text'};
 viewport.height=700;viewport.offsetTop=40;refresh();
 assert.equal(classes.has('app-keyboard-open'),true);
 assert.equal(props.get('--app-viewport-height'),'700px');
 assert.equal(props.get('--app-viewport-top'),'40px');
 document.activeElement=null;viewport.height=1180;viewport.offsetTop=0;window.scrollY=32;refresh();
 assert.equal(classes.has('app-keyboard-open'),false);
 assert.equal(window.scrollY,0);
 viewport.width=1180;viewport.height=820;window.innerHeight=820;refresh();
 assert.equal(classes.has('app-keyboard-open'),false);
 console.log(label+': detection, keyboard open/close, pan reset, rotation PASS');
}
