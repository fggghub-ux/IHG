// Home-only image warmup and cover selection. Account state remains owned by settings.js.
(window.u2OnStorageReady || (callback => document.addEventListener('DOMContentLoaded', callback)))(() => {
    const button = document.getElementById('imessage-home-cover');
    const input = document.getElementById('imessage-home-cover-input');
    const image = document.getElementById('imessage-home-cover-img');
    const toast = document.getElementById('imessage-home-cover-toast');
    if (!button || !input || !image || !toast) return;

    document.querySelectorAll('#imessage-view > .line-content .line-service-item').forEach(item => {
        item.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                item.click();
            }
        });
    });

    const storageKey = 'imessage_home_cover';
    const saved = window.appStorage?.loadLegacyKey(storageKey, null);
    image.src = typeof saved === 'string' && saved.startsWith('data:image/')
        ? saved
        : 'assets/imessage/home-cover-default.jpg';

    // Paint the current account's Home avatar without waiting for the queued
    // Settings initializer. Read only: Settings still owns uploads and switching.
    const avatar = document.getElementById('imessage-avatar-img');
    if (avatar) {
        const settings = window.appStorage?.readDomain?.('settings', {}) || {};
        const accounts = Array.isArray(settings.accounts) ? settings.accounts : [];
        const user = settings.currentAccountId
            ? accounts.find(account => String(account?.id) === String(settings.currentAccountId)) || {}
            : settings.userState || {};
        avatar.src = user.avatarUrl || 'assets/default-user-avatar.jpg';
        avatar.style.display = 'block';
        const icon = document.getElementById('imessage-avatar-icon');
        if (icon) icon.style.display = 'none';
    }
    // Decode while Home is still offscreen; opening it should not start loading.
    [image, avatar].forEach(element => {
        if (element?.decode) element.decode().catch(() => {});
    });
    let toastTimer;

    function showStatus(text) {
        clearTimeout(toastTimer);
        toast.textContent = text;
        toast.hidden = false;
        toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
    }

    // Keep the click synchronous: Safari supplies its native photo/file menu.
    button.addEventListener('click', () => input.click());
    input.addEventListener('change', async () => {
        const file = input.files?.[0];
        input.value = '';
        if (!file) return;
        button.disabled = true;
        let objectUrl;
        try {
            if (file.type && !file.type.startsWith('image/')) throw new Error('Not an image');
            objectUrl = URL.createObjectURL(file);
            const selected = new Image();
            await new Promise((resolve, reject) => {
                selected.onload = resolve;
                selected.onerror = () => reject(new Error('Unsupported image'));
                selected.src = objectUrl;
            });
            // Bound storage size while retaining enough pixels for a retina cover.
            const scale = Math.min(1, 2048 / Math.max(selected.naturalWidth, selected.naturalHeight));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(selected.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(selected.naturalHeight * scale));
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Image processing unavailable');
            context.drawImage(selected, 0, 0, canvas.width, canvas.height);
            const cover = canvas.toDataURL('image/jpeg', 0.9);
            if (!window.appStorage?.saveLegacyKey) throw new Error('Storage unavailable');
            await window.appStorage.saveLegacyKey(storageKey, cover);
            image.src = cover;
            showStatus('Cover Updated');
        } catch (error) {
            console.error('Home cover update failed', error);
            showStatus('Cover could not be updated');
        } finally {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            button.disabled = false;
        }
    });
}, { queue: false });
