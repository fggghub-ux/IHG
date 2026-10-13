/* Keep iPad gestures inside content scrollports without fixing the full-height
 * document again. Keyboard geometry remains owned by viewport_layout.js. */
(function () {
    if (!document.documentElement.classList.contains('app-ipad-layout')) return;

    let gesture = null;
    function scrollports(target) {
        const ports = [];
        for (let node = target?.nodeType === 1 ? target : target?.parentElement;
            node && node !== document.body && node !== document.documentElement;
            node = node.parentElement) {
            if (/^(auto|scroll|overlay)$/.test(getComputedStyle(node).overflowY)) {
                node.classList.toggle('app-ipad-scrollport', node.scrollHeight > node.clientHeight + 1);
                ports.push(node);
            }
        }
        return ports;
    }
    document.addEventListener('touchstart', (event) => {
        gesture = null;
        if (event.touches.length !== 1) return;
        const touch = event.touches[0];
        gesture = { x: touch.clientX, y: touch.clientY, ports: scrollports(event.target) };
    }, { passive: true, capture: true });

    document.addEventListener('touchmove', (event) => {
        if (!gesture || event.touches.length !== 1) {
            gesture = null;
            return;
        }
        const touch = event.touches[0];
        const dx = touch.clientX - gesture.x;
        const dy = touch.clientY - gesture.y;
        gesture.x = touch.clientX;
        gesture.y = touch.clientY;
        // Leave horizontal pagers and multi-touch gestures to their own owners.
        if (Math.abs(dy) <= Math.abs(dx)) return;
        const port = gesture.ports.find((node) =>
            node.isConnected && node.scrollHeight > node.clientHeight + 1);
        const canScroll = port && (dy > 0
            ? port.scrollTop > 0
            : port.scrollTop < port.scrollHeight - port.clientHeight - 1);
        if (!canScroll && event.cancelable) event.preventDefault();
    }, { passive: false, capture: true });

    const end = () => { gesture = null; };
    document.addEventListener('touchend', end, { passive: true, capture: true });
    document.addEventListener('touchcancel', end, { passive: true, capture: true });
    // Apply the same CSS boundary rule before an iPad trackpad starts scrolling.
    document.addEventListener('wheel', (event) => {
        scrollports(event.target);
    }, { passive: true, capture: true });
})();
