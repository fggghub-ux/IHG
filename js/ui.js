const UI = {
    views: {},
    overlays: {},
    inputs: {},
    lists: {},
};
function openView(element) {
    if (!element) return;
    element.classList.contains('bottom-sheet-overlay')
        ? (element.classList.add('active'), (document.body.style.overflow = 'hidden'))
        : element.classList.add('active');
}
function closeView(element_2) {
    if (!element_2) return;
    // A hidden sheet must not retain the focused input and its software keyboard.
    if (element_2.contains(document.activeElement)) document.activeElement.blur();
    element_2.classList.contains('bottom-sheet-overlay')
        ? (element_2.classList.remove('active'), (document.body.style.overflow = ''))
        : element_2.classList.remove('active');
}
function syncUIs() {}
let toastHideTimer = null;
function showToast(value) {
    let toast = document.getElementById('global-toast-bubble');
    !toast &&
        ((toast = document.createElement('div')),
        (toast.id = 'global-toast-bubble'),
        (toast.className = 'toast-bubble'),
        toast.setAttribute('role', 'status'),
        toast.setAttribute('aria-live', 'polite'),
        document.body.appendChild(toast));
    const textContent_2 = String(value || '');
    toastHideTimer && (clearTimeout(toastHideTimer), (toastHideTimer = null));
    toast.classList.toggle('shop-success-toast', textContent_2 === 'Payment successful' || textContent_2 === 'Payment request sent');
    toast.textContent = textContent_2;
    toast.classList.add('show');
    const value_3 = textContent_2.length > 80 ? 8000 : 2500;
    toastHideTimer = setTimeout(() => {
        toast.classList.remove('show');
        toastHideTimer = null;
    }, value_3);
}
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        e.target.classList.contains('bottom-sheet-overlay') && closeView(e.target);
    });
});
let notificationBanner = null,
    bannerTimeout = null,
    notificationQueue = [],
    isShowingNotification = false,
    bannerPointerStartY = null,
    bannerPointerId = null,
    bannerHideTransitionTimeout = null;
function processNotificationQueue() {
    if (isShowingNotification || notificationQueue.length === 0) return;
    bannerHideTransitionTimeout &&
        (clearTimeout(bannerHideTransitionTimeout), (bannerHideTransitionTimeout = null));
    isShowingNotification = true;
    const { friend: friend_2, messageText: messageText_2 } = notificationQueue.shift(),
        appContainer = document.querySelector('#app') || document.body;
    !notificationBanner &&
        ((notificationBanner = document.createElement('div')),
        (notificationBanner.id = 'ios-banner-notification'),
        (notificationBanner.style.position = 'absolute'),
        (notificationBanner.style.top = '10px'),
        (notificationBanner.style.left = '50%'),
        (notificationBanner.style.transform = 'translate(-50%, -150%)'),
        (notificationBanner.style.width = 'calc(100% - 32px)'),
        (notificationBanner.style.maxWidth = '360px'),
        (notificationBanner.style.backgroundColor = '#ffffff'),
        (notificationBanner.style.borderRadius = '40px'),
        (notificationBanner.style.boxShadow =
            '0 10px 30px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,1)'),
        (notificationBanner.style.display = 'flex'),
        (notificationBanner.style.alignItems = 'center'),
        (notificationBanner.style.padding = '8px 16px 8px 8px'),
        (notificationBanner.style.zIndex = '9999999'),
        (notificationBanner.style.transition =
            'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2)'),
        (notificationBanner.style.touchAction = 'none'),
        appContainer.appendChild(notificationBanner),
        notificationBanner.addEventListener('pointerdown', (value_12) => {
            if (value_12.pointerType === 'mouse' && value_12.button !== 0) return;
            bannerPointerStartY = value_12.clientY;
            bannerPointerId = value_12.pointerId;
            notificationBanner.setPointerCapture?.(value_12.pointerId);
        }),
        notificationBanner.addEventListener('pointerup', (value_13) => {
            if (bannerPointerId !== value_13.pointerId || bannerPointerStartY === null) return;
            const value_14 = bannerPointerStartY - value_13.clientY;
            bannerPointerStartY = null;
            bannerPointerId = null;
            notificationBanner.releasePointerCapture?.(value_13.pointerId);
            if (value_14 >= 40) hideBannerNotification(false);
        }),
        notificationBanner.addEventListener('pointercancel', (value_15) => {
            if (bannerPointerId !== value_15.pointerId) return;
            bannerPointerStartY = null;
            bannerPointerId = null;
        }));
    const avatar = friend_2.avatarUrl || 'https://picsum.photos/seed/char/100/100',
        name = friend_2.nickname || friend_2.realName || 'Unknown';
    let previewText = messageText_2.replace(/<[^>]*>?/gm, '').trim();
    if (previewText.length > 30) previewText = previewText.substring(0, 30) + '...';
    const now = new Date(),
        value_11 = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
    notificationBanner.innerHTML =
        `
        <img src="` +
        avatar +
        `" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; flex-shrink: 0; ">
        <div style="flex: 1; min-width: 0; margin-left: 14px; display: flex; flex-direction: column; justify-content: center;">
            <div style="font-weight: 700; font-size: 15px; color: #1c1c1e; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">` +
        name +
        `</div>
            <div style="font-size: 13px; color: #8e8e93; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">` +
        previewText +
        `</div>
        </div>
        <div style="font-size: 12px; color: #8e8e93; font-weight: 500; margin-left: 10px; flex-shrink: 0;">
            ` +
        value_11 +
        `
        </div>
    `;
    if (bannerTimeout) clearTimeout(bannerTimeout);
    requestAnimationFrame(() => {
        notificationBanner.style.transform =
            'translate(-50%, max(env(safe-area-inset-top, 0px), 10px))';
    });
    bannerTimeout = setTimeout(() => {
        hideBannerInternal();
    }, 4000);
}
function hideBannerInternal() {
    notificationBanner && (notificationBanner.style.transform = 'translate(-50%, -150%)');
    if (bannerHideTransitionTimeout) clearTimeout(bannerHideTransitionTimeout);
    bannerHideTransitionTimeout = setTimeout(() => {
        bannerHideTransitionTimeout = null;
        isShowingNotification = false;
        processNotificationQueue();
    }, 400);
}
function showBannerNotification(friend_3, messageText_3) {
    return (
        notificationQueue.push({
            friend: friend_3,
            messageText: messageText_3,
        }),
        processNotificationQueue(),
        true
    );
}
function hideBannerNotification(value_18 = false) {
    value_18 && (notificationQueue = []);
    bannerTimeout && clearTimeout(bannerTimeout);
    hideBannerInternal();
}
window.openView = openView;
window.closeView = closeView;
window.syncUIs = syncUIs;
window.showToast = showToast;
window.showBannerNotification = showBannerNotification;
window.hideBannerNotification = hideBannerNotification;
