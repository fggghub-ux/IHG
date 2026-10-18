/* One owner for the web app's viewport. App pages and sheets inherit its size
 * instead of independently moving above the keyboard and exposing the desktop. */
(function () {
    const root = document.documentElement;
    const viewport = window.visualViewport;
    const isNative = window.u2NativeBridge?.isNativeAndroid?.() === true;
    if (isNative) return; // The Android host owns its WebView size and insets.
    const isIPad = /iPad/.test(navigator.userAgent) ||
        (/Mac/.test(navigator.userAgent + navigator.platform) && navigator.maxTouchPoints > 1);
    root.classList.toggle('app-ipad-layout', isIPad);
    // Keep the existing layout/scroll rules unchanged on other platforms. iPhone
    // Safari also says 'like Mac OS X', so exclude it from the iPad keyboard path.
    const stabilizeIPad = isIPad && !/iPhone|iPod/.test(navigator.userAgent);
    root.classList.toggle('app-ipad-viewport', stabilizeIPad);

    let frame = 0;
    let restingHeight = stabilizeIPad ? (viewport?.height || window.innerHeight) : window.innerHeight;
    let restingWidth = window.innerWidth;
    let keyboardOpen = false;
    let appliedHeight = -1;
    let appliedTop = -1;
    const timers = new Set();
    const excludedTypes = new Set([
        'button',
        'submit',
        'reset',
        'checkbox',
        'radio',
        'file',
        'hidden',
        'range',
        'color',
    ]);
    function isEditable(element) {
        if (!element || element.disabled || element.readOnly) return false;
        return (
            element.isContentEditable ||
            element.tagName === 'TEXTAREA' ||
            (element.tagName === 'INPUT' && !excludedTypes.has(element.type))
        );
    }
    function update() {
        frame = 0;
        // Resizing the app to a pinch-zoomed viewport would reflow its contents.
        if (viewport && Math.abs(viewport.scale - 1) > 0.02) return;
        const height = Math.round(viewport?.height || window.innerHeight);
        const width = Math.round(viewport?.width || window.innerWidth);
        let top = Math.max(0, Math.round(viewport?.offsetTop || 0));
        if (height <= 0 || width <= 0) return;
        if (Math.abs(width - restingWidth) > 48) {
            restingWidth = width;
            restingHeight = Math.max(height, window.innerHeight);
        }
        const focused = isEditable(document.activeElement);
        if (!focused && !keyboardOpen) {
            restingHeight = stabilizeIPad ? height : Math.max(height, window.innerHeight);
        }
        if (stabilizeIPad) {
            // Follow the entire resize, including the last <100px of dismissal.
            // Blurring/sending is not proof that the keyboard has finished closing.
            keyboardOpen = restingHeight - height > 1 && (focused || keyboardOpen);
            // WebKit can deliver the restored height before the matching scroll
            // event. An old offset must not move a full-height app down the screen.
            top = keyboardOpen ? Math.min(top, Math.max(0, restingHeight - height)) : 0;
        } else {
            keyboardOpen = restingHeight - height > 100 && (focused || keyboardOpen);
            if (height >= restingHeight - 72) keyboardOpen = false;
        }
        root.classList.toggle('app-keyboard-open', keyboardOpen);
        if (height !== appliedHeight) {
            root.style.setProperty('--app-viewport-height', height + 'px');
            appliedHeight = height;
        }
        if (top !== appliedTop) {
            root.style.setProperty('--app-viewport-top', top + 'px');
            appliedTop = top;
        }
        // Restore a window pan only after the keyboard has finished retreating.
        if (!focused && !keyboardOpen && top === 0 && (window.scrollX || window.scrollY)) {
            window.scrollTo(0, 0);
        }
    }
    function schedule() {
        // Viewport resize/scroll already runs on the UI thread. Applying iPad
        // geometry here avoids painting one frame with the previous keyboard size.
        if (stabilizeIPad) {
            update();
            return;
        }
        if (!frame) frame = requestAnimationFrame(update);
    }
    function settle() {
        timers.forEach(clearTimeout);
        timers.clear();
        schedule();
        [60, 180, 360].forEach((delay) => {
            const timer = setTimeout(() => {
                timers.delete(timer);
                schedule();
            }, delay);
            timers.add(timer);
        });
    }
    window.appViewport = {
        managed: true,
        refresh: schedule,
    };
    root.classList.add('app-viewport-managed');
    window.addEventListener('resize', schedule, {
        passive: true,
    });
    window.addEventListener('orientationchange', settle, {
        passive: true,
    });
    window.addEventListener('pageshow', settle, {
        passive: true,
    });
    viewport?.addEventListener('resize', schedule, {
        passive: true,
    });
    viewport?.addEventListener('scroll', schedule, {
        passive: true,
    });
    document.addEventListener('focusin', settle, true);
    document.addEventListener('focusout', settle, true);
    update();
})();
