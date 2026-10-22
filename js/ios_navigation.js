(function () {
    const bridge = window.u2NativeBridge;
    if (!bridge?.isNativeIOS?.()) return;
    const surfaceSelector = [
        '.app-view',
        '.settings-view',
        '.edit-view',
        '.detail-view',
        '.bottom-sheet-overlay',
        '[role="dialog"]',
        '[aria-modal="true"]',
        '[data-ios-back-surface]',
        '[data-ios-back-block]',
        '.chat-page',
        '.active-chat-interface',
        '.tk-sub-profile-view',
        '[id$="-view"]',
        '[id$="-sheet"]',
        '[id$="-overlay"]',
        '[id$="-modal"]',
        '[id$="-detail"]',
        '[id$="-panel"]',
        '[id$="-backdrop"]',
    ].join(',');
    const backControlSelector = [
        '[data-ios-back]',
        '[data-native-back]',
        '[data-action="back"]',
        '.back-btn',
        '.chat-back-btn',
        '[id$="-back-btn"]',
        '[id$="-back"]',
        '[id^="back-"]',
        '[id$="-close-btn"]',
        '[id$="-close"]',
        '[id^="close-"]',
        '[id$="-cancel-btn"]',
        '[id$="-exit-button"]',
        '[aria-label="返回"]',
        '[aria-label^="返回"]',
        '[aria-label="关闭"]',
        '[data-action="close-app"]',
        '.wb-centered-modal-close',
        '.im-group-settings-back',
    ].join(',');
    const registeredHandlers = new Map();
    let lastEnabled;
    let refreshPending = false;
    let lastBackAt = -Infinity;
    function isVisible(element) {
        if (!element || element.closest('[hidden], [inert], [aria-hidden="true"]')) return false;
        const style = window.getComputedStyle(element);
        if (
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            style.pointerEvents === 'none'
        )
            return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < window.innerWidth &&
            rect.top < window.innerHeight
        );
    }
    function getStackingContexts(element) {
        const contexts = [];
        for (
            let ancestor = element;
            ancestor && ancestor !== document.documentElement;
            ancestor = ancestor.parentElement
        ) {
            const style = window.getComputedStyle(ancestor);
            ((style.zIndex !== 'auto' && style.position !== 'static') ||
                style.transform !== 'none' ||
                Number(style.opacity) < 1 ||
                /paint|layout/.test(style.contain) ||
                style.isolation === 'isolate') &&
                contexts.unshift({
                    node: ancestor,
                    z: Number.parseInt(style.zIndex, 10) || 0,
                });
        }
        return contexts;
    }
    function compareSurfaces(left, right) {
        if (left === right) return 0;
        if (left.contains(right)) return -1;
        if (right.contains(left)) return 1;
        const leftContexts = getStackingContexts(left);
        const rightContexts = getStackingContexts(right);
        let index = 0;
        while (
            leftContexts[index] &&
            rightContexts[index] &&
            leftContexts[index].node === rightContexts[index].node
        )
            index += 1;
        const leftZ = leftContexts[index]?.z || 0;
        const rightZ = rightContexts[index]?.z || 0;
        if (leftZ !== rightZ) return leftZ - rightZ;
        const leftNode = leftContexts[index]?.node || left;
        const rightNode = rightContexts[index]?.node || right;
        return leftNode.compareDocumentPosition(rightNode) & 4 ? -1 : 1;
    }
    function getBackControl(surface) {
        const selector = surface.dataset.iosBackControl;
        if (selector) {
            const control = surface.querySelector(selector);
            return isVisible(control) && !control.disabled ? control : null;
        }
        return (
            [...surface.querySelectorAll(backControlSelector)].find(
                (control) =>
                    !control.disabled &&
                    isVisible(control) &&
                    control.closest(surfaceSelector) === surface,
            ) || null
        );
    }
    function resolveBackAction() {
        const visibleSurfaces = [...document.querySelectorAll(surfaceSelector)].filter(
            (surface) =>
                isVisible(surface) &&
                (surface.matches(
                    '.app-view.active, .settings-view.active, .edit-view.active, .detail-view.active, .bottom-sheet-overlay.active',
                ) ||
                    !surface.matches(
                        '.app-view, .settings-view, .edit-view, .detail-view, .bottom-sheet-overlay',
                    )),
        );
        const candidates = visibleSurfaces.filter(
            (surface) =>
                registeredHandlers.has(surface.id) ||
                getBackControl(surface) ||
                surface.matches(
                    '.app-view.active, .settings-view.active, .edit-view.active, .bottom-sheet-overlay.active, [role="dialog"], [aria-modal="true"], [data-ios-back-block], [id$="-overlay"], [id$="-modal"], [id$="-sheet"]',
                ),
        );
        const surface = candidates.sort(compareSurfaces).at(-1);
        if (!surface || surface.hasAttribute('data-ios-back-block')) return null;
        const handler = registeredHandlers.get(surface.id);
        if (handler) return () => handler(surface);
        const control = getBackControl(surface);
        return control ? () => control.click() : null;
    }
    async function updateNativeGesture() {
        refreshPending = false;
        const enabled = !!resolveBackAction();
        if (enabled === lastEnabled) return;
        lastEnabled = enabled;
        try {
            await bridge.setBackGestureEnabled(enabled);
        } catch (error) {
            lastEnabled = undefined;
            console.warn('[ios_navigation] Gesture unavailable:', error);
        }
    }
    function scheduleRefresh() {
        if (refreshPending) return;
        refreshPending = true;
        window.requestAnimationFrame(() => void updateNativeGesture());
    }
    function back() {
        const now = Date.now();
        if (now - lastBackAt < 400) return false;
        const action = resolveBackAction();
        if (!action) return false;
        lastBackAt = now;
        action();
        scheduleRefresh();
        return true;
    }
    window.u2IosNavigation = Object.freeze({
        back: back,
        refresh: scheduleRefresh,
        register(surfaceId, handler) {
            registeredHandlers.set(surfaceId, handler);
            scheduleRefresh();
            return () => {
                registeredHandlers['delete'](surfaceId);
                scheduleRefresh();
            };
        },
    });
    function initializeNavigation() {
        registeredHandlers.set('imessage-view', (view) => window.closeView(view));
        registeredHandlers.set('msg-context-overlay', (overlay) => overlay.click());
        const viewControls = {
            'settings-view': '#settings-title-back-btn',
            'ao3-view': '#ao3-history-back, #ao3-exit-button',
            'x-view': '#x-back-btn, #x-profile-close-btn',
        };
        for (const [viewId, selector] of Object.entries(viewControls)) {
            const view = document.getElementById(viewId);
            if (!view) continue;
            registeredHandlers.set(viewId, () => {
                const control = [...view.querySelectorAll(selector)].find(isVisible);
                control?.click();
            });
        }
        const observerSelector = surfaceSelector + ', ' + backControlSelector;
        const observer = new MutationObserver((mutations) => {
            if (
                mutations.some((mutation) =>
                    mutation.type === 'attributes'
                        ? mutation.target.matches(observerSelector) ||
                          !!mutation.target.querySelector(observerSelector)
                        : [...mutation.addedNodes, ...mutation.removedNodes].some(
                              (node) =>
                                  node.nodeType === 1 &&
                                  (node.matches(observerSelector) ||
                                      node.querySelector(observerSelector)),
                          ),
                )
            )
                scheduleRefresh();
        });
        observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: [
                'class',
                'style',
                'hidden',
                'inert',
                'aria-hidden',
                'disabled',
                'data-ios-back-block',
            ],
        });
        window.addEventListener('resize', scheduleRefresh);
        window.addEventListener('u2:ios-edge-back', back);
        void bridge.ready().then(scheduleRefresh);
        scheduleRefresh();
    }
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', initializeNavigation, {
            once: true,
        });
    else initializeNavigation();
})();
