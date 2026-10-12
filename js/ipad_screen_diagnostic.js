/* Temporary, local-only measurement for the reported iPad standalone gap.
 * Remove this file and its script tag after the device measurements are read.
 * No storage, network requests, authentication data or layout overrides. */
(function () {
    const ipad = /iPad/.test(navigator.userAgent) ||
        (/Mac/.test(navigator.userAgent + navigator.platform) && navigator.maxTouchPoints > 1);
    if (!ipad) return;
    function install() {
        const host = document.createElement('div');
        host.id = 'ipad-screen-diagnostic';
        host.style.cssText = 'position:fixed;top:70px;right:12px;z-index:2147483647;';
        const shadow = host.attachShadow({mode: 'open'});
        const style = document.createElement('style');
        style.textContent = ':host{font:14px -apple-system,sans-serif}button{font:inherit;background:#202020;color:white;border:1px solid #aaa;border-radius:8px;padding:10px}section{box-sizing:border-box;position:fixed;top:110px;left:12px;right:12px;max-height:70vh;overflow:auto;background:white;color:#111;border:2px solid #222;border-radius:10px;padding:14px}pre{font:13px/1.45 monospace;white-space:pre-wrap;overflow-wrap:anywhere;margin:10px 0}';
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = '屏幕检测';
        const panel = document.createElement('section');
        panel.hidden = true;
        const title = document.createElement('strong');
        title.textContent = 'iPad 屏幕尺寸 · D1（截图此面板）';
        const output = document.createElement('pre');
        const close = document.createElement('button');
        close.type = 'button';
        close.textContent = '关闭';
        close.onclick = () => { panel.hidden = true; };
        panel.append(title, output, close);
        shadow.append(style, button, panel);
        button.onclick = () => {
            // Capture first; opening the panel cannot alter the reported geometry.
            const n = value => Math.round(value * 100) / 100;
            const vv = window.visualViewport;
            const lines = [
                'standalone=' + (navigator.standalone === true || matchMedia('(display-mode: standalone)').matches),
                'screen=' + screen.width + 'x' + screen.height + ' avail=' + screen.availWidth + 'x' + screen.availHeight + ' dpr=' + devicePixelRatio,
                'inner=' + innerWidth + 'x' + innerHeight + ' scroll=' + scrollX + ',' + scrollY,
                'visual=' + (vv ? [n(vv.width), n(vv.height), 'top=' + n(vv.offsetTop), 'pageTop=' + n(vv.pageTop), 'scale=' + vv.scale].join(' ') : 'none'),
                'html.class=' + document.documentElement.className,
            ];
            ['html', 'body', '#app', '#pages-container', '#dock'].forEach(selector => {
                const el = document.querySelector(selector);
                if (!el) return;
                const r = el.getBoundingClientRect(), c = getComputedStyle(el);
                lines.push(selector + ' top=' + n(r.top) + ' bottom=' + n(r.bottom) + ' h=' + n(r.height) + ' scrollH=' + el.scrollHeight,
                    '  ' + c.position + ' cssH=' + c.height + ' top=' + c.top + ' bottom=' + c.bottom + ' margin=' + c.margin + ' padding=' + c.padding + ' transform=' + c.transform);
            });
            const probe = document.createElement('div');
            probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:0;height:100vh;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);box-sizing:content-box;';
            shadow.append(probe);
            let c = getComputedStyle(probe);
            lines.push('vh=' + c.height + ' safeTop=' + c.paddingTop + ' safeBottom=' + c.paddingBottom);
            probe.style.height = '100dvh';
            lines.push('dvh=' + getComputedStyle(probe).height);
            probe.remove();
            lines.push(navigator.userAgent);
            output.textContent = lines.join('\n');
            panel.hidden = false;
        };
        document.body.append(host);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
    else install();
})();
