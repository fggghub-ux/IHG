(function () {
    if (!document.documentElement.classList.contains('app-ipad-layout')) return;

    function scrollports(target) {
        for (let node = target?.nodeType === 1 ? target : target?.parentElement;
            node && node !== document.body && node !== document.documentElement;
            node = node.parentElement) {
            if (/^(auto|scroll|overlay)$/.test(getComputedStyle(node).overflowY)) {
                node.classList.toggle('app-ipad-scrollport', node.scrollHeight > node.clientHeight + 1);
            }
        }
    }
    document.addEventListener('touchstart', (event) => {
        if (event.touches.length !== 1) return;
        scrollports(event.target);
    }, { passive: true, capture: true });
    // Apply the same CSS boundary rule before an iPad trackpad starts scrolling.
    document.addEventListener('wheel', (event) => {
        scrollports(event.target);
    }, { passive: true, capture: true });
})();
