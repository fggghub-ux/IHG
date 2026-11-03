// Invitation presentation only. State changes stay in the existing chat handlers.
(() => {
    const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const pin = '<svg viewBox="0 0 384 512" aria-hidden="true"><path fill="currentColor" d="M192 0C86 0 0 86 0 192c0 77 25 99 172 310a24 24 0 0 0 40 0C359 291 384 269 384 192 384 86 298 0 192 0zm0 256a64 64 0 1 1 0-128 64 64 0 0 1 0 128z"/></svg>';
    const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="8 18 14 12 8 6"/><polyline points="13 18 19 12 13 6"/></svg>';
    const lock = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path class="invitation-lock-closed" d="M7 11V7a5 5 0 0 1 10 0v4"/><path class="invitation-lock-open" d="M7 11V6a4.5 4.5 0 0 1 7.7-3.2l2.3 2.3"/></svg>';
    function faceMarkup(friend) {
        const name = friend?.nickname || friend?.realName || 'Char';
        return '<img class="offline-invite-face" src="assets/imessage/offline-face-id.svg" alt="">' +
            '<div class="offline-invite-face-copy"><span>Face ID</span><span>Date with ' + escape(name) + '</span></div>';
    }
    function openingMarkup(invitation) {
        return '<span class="offline-opening-chevron" aria-hidden="true"></span>' +
            '<div class="offline-opening-copy"><strong>' + escape(invitation.title || '线下见面') +
            '</strong><p>' + escape(invitation.invitationText || '') + '</p></div>' +
            '<span class="offline-opening-dots" aria-hidden="true"><i></i><i></i></span>' +
            (invitation.place ? '<span class="offline-opening-place">' + pin + escape(invitation.place) + '</span>' : '');
    }
    function detailMarkup(invitation, status) {
        return '<div class="offline-invite-detail" role="dialog" aria-modal="true" aria-label="线下邀请">' +
            '<div class="offline-invite-detail-heading"><div class="offline-invite-detail-icon">' + pin +
            '</div><div class="offline-invite-detail-place">' + escape(invitation.place || '') + '</div></div>' +
            '<h2>' + escape(invitation.title || '见面邀请') + '</h2>' +
            '<div class="offline-invite-details"><div class="offline-invite-details-label">Details</div>' +
            '<p>' + escape(invitation.invitationText || '') + '</p></div>' +
            (status === 'pending' ? '<div class="offline-invite-slider">' +
                '<span class="offline-invite-slider-label" aria-live="polite">slide to unlock</span>' +
                '<span class="offline-invite-slider-lock" aria-hidden="true">' + lock + '</span>' +
                '<button type="button" class="offline-invite-slider-thumb" aria-label="滑动回应邀请">' + arrow + '</button></div>' :
                '<div class="offline-invite-resolved">' + ({ accepted: '已接受', declined: '已婉拒', superseded: '邀请已失效' }[status] || '邀请已结束') + '</div>') + '</div>';
    }
    function bindSlider(overlay, respond) {
        const track = overlay.querySelector('.offline-invite-slider');
        if (!track) return () => {};
        const thumb = track.querySelector('button'), label = track.querySelector('.offline-invite-slider-label');
        let active = null, timer = null, animation = null, busy = false, disposed = false;
        const clearTimer = () => { clearTimeout(timer); timer = null; };
        function reset() {
            clearTimer();
            const id = active?.id;
            active = null;
            if (id != null && thumb.hasPointerCapture?.(id)) thumb.releasePointerCapture(id);
            track.classList.remove('is-dragging', 'is-declining', 'is-unlocked');
            thumb.style.removeProperty('--invitation-thumb-x');
            label.textContent = 'slide to unlock';
        }
        async function finish(action) {
            if (busy || disposed || !overlay.isConnected) return;
            clearTimer();
            busy = true;
            active = null;
            thumb.disabled = true;
            track.classList.remove('is-dragging');
            if (action === 'accept') {
                track.classList.add('is-unlocked');
                // Show the unlocked state before the existing accept handler opens the meeting.
                await new Promise(resolve => { animation = { resolve, id: setTimeout(resolve, 180) }; });
                animation = null;
            }
            if (disposed || !overlay.isConnected) return;
            try {
                if (await respond(action) === false) {
                    busy = false;
                    thumb.disabled = false;
                    reset();
                }
            } catch (error) {
                console.error('[iMessage] invitation response failed', error);
                if (!disposed) {
                    busy = false;
                    thumb.disabled = false;
                    reset();
                    window.showToast?.('邀请状态保存失败，请重试');
                }
            }
        }
        function down(event) {
            if (busy || disposed || active || event.isPrimary === false || event.button !== 0) return;
            event.preventDefault();
            const rect = track.getBoundingClientRect(), size = thumb.getBoundingClientRect().width;
            active = { id: event.pointerId, startX: event.clientX, rect,
                origin: thumb.offsetLeft, min: 6, max: rect.width - size - 6 };
            thumb.setPointerCapture?.(event.pointerId);
            track.classList.add('is-dragging');
        }
        function move(event) {
            if (!active || active.id !== event.pointerId || busy) return;
            if (event.clientY < active.rect.top || event.clientY > active.rect.bottom ||
                event.clientX < active.rect.left || event.clientX > active.rect.right) {
                reset();
                return;
            }
            const delta = event.clientX - active.startX;
            const x = Math.max(active.min, Math.min(active.max, active.origin + delta));
            thumb.style.setProperty('--invitation-thumb-x', x + 'px');
            if (delta > 24 && x >= active.max - 2) {
                void finish('accept');
            } else if (delta < -12 && x <= active.min + 3) {
                track.classList.add('is-declining');
                label.innerHTML = '<span>3s 后自动拒绝</span> <span>松开取消</span>';
                if (timer == null) timer = setTimeout(() => {
                    if (active && !disposed && track.classList.contains('is-declining')) void finish('decline');
                }, 3000);
            } else {
                clearTimer();
                track.classList.remove('is-declining');
                label.textContent = 'slide to unlock';
            }
        }
        function up(event) { if (active?.id === event.pointerId && !busy) reset(); }
        function cancel() { if (!busy) reset(); }
        function visibility() { if (document.hidden) cancel(); }
        thumb.addEventListener('pointerdown', down);
        thumb.addEventListener('pointermove', move);
        thumb.addEventListener('pointerup', up);
        thumb.addEventListener('pointercancel', cancel);
        thumb.addEventListener('lostpointercapture', up);
        window.addEventListener('blur', cancel);
        window.addEventListener('resize', cancel);
        document.addEventListener('visibilitychange', visibility);
        return () => {
            disposed = true;
            reset();
            if (animation) { clearTimeout(animation.id); animation.resolve(); animation = null; }
            thumb.removeEventListener('pointerdown', down);
            thumb.removeEventListener('pointermove', move);
            thumb.removeEventListener('pointerup', up);
            thumb.removeEventListener('pointercancel', cancel);
            thumb.removeEventListener('lostpointercapture', up);
            window.removeEventListener('blur', cancel);
            window.removeEventListener('resize', cancel);
            document.removeEventListener('visibilitychange', visibility);
        };
    }
    window.imOfflineInvitationUI = { faceMarkup, openingMarkup, detailMarkup, bindSlider };
})();
