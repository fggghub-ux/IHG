/* One owner for the web app's viewport. App pages and sheets inherit its size
 * instead of independently moving above the keyboard and exposing the desktop. */
(function () {
    const root = document.documentElement;
    const viewport = window.visualViewport;
    const isNative = window.u2NativeBridge?.isNativeAndroid?.() === true;
    if (isNative) return; // The Android host owns its WebView size and insets.

    let frame = 0;
    let restingHeight = window.innerHeight;
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
        const top = Math.max(0, Math.round(viewport?.offsetTop || 0));
        if (height <= 0 || width <= 0) return;
        if (Math.abs(width - restingWidth) > 48) {
            restingWidth = width;
            restingHeight = Math.max(height, window.innerHeight);
        }
        const focused = isEditable(document.activeElement);
        if (!focused && !keyboardOpen) restingHeight = Math.max(height, window.innerHeight);
        keyboardOpen = restingHeight - height > 100 && (focused || keyboardOpen);
        if (height >= restingHeight - 72) keyboardOpen = false;
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
