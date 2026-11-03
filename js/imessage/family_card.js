// Family-card presentation and explicit incoming acceptance. Ordinary transfers stay separate.
(() => {
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c =>
        ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
    const busy = new Set();
    function isFamily(message = {}) {
        return /^family_card(?:_|$)/.test(message.paymentAction || '') ||
            /^family_card_/.test(message.payKind || '') ||
            [message.cardTitle, message.description, message.content].join(' ').includes('亲属卡');
    }
    function status(message = {}) {
        if (message.familyCardStatus === 'unbound' || message.payKind === 'family_card_unbound') return 'unbound';
        if (message.familyCardStatus === 'rejected' || /family_card_reject/.test(message.payKind || '')) return 'rejected';
        if (message.familyCardStatus === 'pending' || message.payKind === 'family_card_pending') return 'pending';
        return 'accepted'; // Previously issued cards were already active; retain that state.
    }
    const labels = {
        pending: 'Pending',
        accepted: 'Accepted',
        rejected: 'Returned',
        unbound: 'Unlinked',
    };
    const canClaim = message => message?.role === 'assistant' &&
        message.payKind === 'family_card_incoming' && status(message) === 'pending';
    function markup(message) {
        const state = status(message), label = labels[state];
        const amount = '$' + (Number(message.amount) || 0).toFixed(2);
        return `<div class="family-invitation-card im-card-content" data-family-status="${state}">
            <div class="family-invitation-brand"><svg class="family-invitation-apple" viewBox="0 0 24 28" aria-hidden="true"><path fill="currentColor" d="M16.9 14.3c0-3 2.5-4.5 2.6-4.6-1.4-2-3.5-2.3-4.2-2.3-1.8-.2-3.5 1.1-4.4 1.1-.9 0-2.3-1.1-3.8-1.1-2 0-3.8 1.2-4.8 3-2.1 3.6-.5 8.9 1.5 11.8 1 1.4 2.2 3 3.8 2.9 1.5-.1 2.1-1 3.9-1 1.8 0 2.3 1 3.9.9 1.6 0 2.7-1.4 3.6-2.8 1.2-1.7 1.7-3.4 1.7-3.5-.1 0-3.8-1.5-3.8-4.4zM14.2 5.5c.8-1.1 1.4-2.6 1.2-4-1.3.1-2.8.9-3.7 2-.8.9-1.6 2.5-1.4 3.9 1.4.1 2.9-.7 3.9-1.9z"/></svg><span>Family Card</span></div>
            <div class="family-invitation-summary"><strong class="family-invitation-amount">${amount}</strong><span class="family-invitation-status">${label}</span><span class="family-invitation-limit">Monthly Limit</span></div>
        </div>`;
    }
    function refresh(friendId) {
        const friend = window.imApp.getFriendById(friendId);
        const host = document.getElementById('chat-interface-' + friendId)?.querySelector('.ins-chat-messages');
        if (friend && host) window.imChat.rerenderChatContainer(friend, host, {scroll:false});
        window.imApp.requestChatsListRefresh?.();
    }
    async function respond(friendId, messageId, accepted) {
        const key = String(friendId) + ':' + String(messageId);
        if (busy.has(key)) return false;
        busy.add(key);
        try {
            await window.payDataReadyPromise;
            await window.imApp.ensureFriendMessagesLoaded?.(friendId);
            let changed = false;
            const saved = await window.imApp.commitFriendChange(friendId, friend => {
                const source = friend.messages?.find(message => String(message.id) === String(messageId));
                if (!canClaim(source) || !Number.isFinite(Number(source.amount)) || !(Number(source.amount) > 0)) return;
                source.familyCardStatus = accepted ? 'accepted' : 'rejected';
                source.payStatus = accepted ? 'completed' : 'rejected';
                source.content = `[亲属卡] User ${accepted ? '已收下' : '已退回'}额度 $${Number(source.amount).toFixed(2)} 的亲属卡`;
                const receipt = {
                    id: window.imChat.createMessageId('family'), role:'user', type:'pay_transfer',
                    payKind: accepted ? 'family_card_accept_notice' : 'family_card_reject_notice',
                    paymentAction: accepted ? 'family_card_accept' : 'family_card_reject',
                    familyCardId: source.id, familyCardStatus: source.familyCardStatus,
                    amount: source.amount, content: source.content, timestamp:Date.now(),
                };
                receipt.__messageOrder = Math.max(Number(friend.messageCount) || 0,
                    ...friend.messages.map((message, index) => (Number(message.__messageOrder) || index) + 1));
                friend.messages.push(receipt);
                friend.messageCount = receipt.__messageOrder + 1;
                friend.lastMessageTimestamp = receipt.timestamp;
                friend.lastMessagePreview = receipt.content;
                window.imApp.syncFriendMessageSummary?.(friend);
                changed = true;
            }, {silent:true});
            if (!saved || !changed) return false;
            // Reconcile only after the chat decision is durably saved. Pay deduplicates by grant ID.
            window.reconcileReceivedFamilyCards?.();
            refresh(friendId);
            return true;
        } catch (error) {
            console.error('Family-card response failed:', error);
            return false;
        } finally { busy.delete(key); }
    }
    function open(friend, message) {
        const live = window.imApp.getFriendById(friend.id)?.messages?.find(item => String(item.id) === String(message.id));
        if (!canClaim(live)) return;
        const page = document.getElementById('chat-interface-' + friend.id);
        if (!page || page.querySelector('.family-invitation-overlay')) return;
        const sender = window.imChat.normalizePayTransferMessage?.(live, friend);
        const avatar = live.senderAvatarUrl || sender?.payerAvatar || friend.avatarUrl || friend.avatar || '';
        const name = sender?.payerName || friend.nickname || friend.realName || 'Char';
        const overlay = document.createElement('div');
        overlay.className = 'family-invitation-overlay';
        overlay.innerHTML = `<div class="family-invitation-detail" role="dialog" aria-modal="true" aria-label="Family card">
            <div class="family-invitation-sender"><div class="family-invitation-avatar">${avatar ? `<img src="${escape(avatar)}" alt="">` : '<i class="fas fa-user" aria-hidden="true"></i>'}</div><strong>${escape(name)}</strong></div>
            <div class="family-invitation-detail-amount">$${Number(live.amount).toFixed(2)}</div>
            <div class="family-invitation-details">Details</div>
            <div class="family-invitation-buttons"><button type="button" data-family-response="return">退回</button><button type="button" data-family-response="accept">收下</button></div></div>`;
        const close = () => { document.removeEventListener('keydown', onKey); overlay.remove(); };
        const onKey = event => { if (event.key === 'Escape') close(); };
        document.addEventListener('keydown', onKey);
        overlay.addEventListener('click', async event => {
            if (event.target === overlay) { close(); return; }
            const button = event.target.closest('[data-family-response]');
            if (!button || button.disabled) return;
            const buttons = [...overlay.querySelectorAll('button')];
            buttons.forEach(item => { item.disabled = true; });
            if (await respond(friend.id, live.id, button.dataset.familyResponse === 'accept')) close();
            else { buttons.forEach(item => { item.disabled = false; }); window.showToast?.('亲属卡状态保存失败，请重试'); }
        });
        page.appendChild(overlay);
    }
    window.imFamilyCard = {isFamily, status, canClaim, markup, respond, open};
})();
