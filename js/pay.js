(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    let currentCardId_3 = 'bank_1',
        currentFilter = 'all',
        outgoingFamilyCards_2 = [],
        cards_2 = [
            {
                id: 'bank_1',
                type: 'bank',
                name: '招商银行',
                icon: 'fas fa-university',
                cardType: '储蓄卡',
                number: '**** **** **** 8888',
                balance: 1000,
                logo: '银联',
                styleClass: '',
                transactions: [],
            },
            {
                id: 'bank_2',
                type: 'bank',
                name: 'VISA 信用卡',
                icon: 'fas fa-globe',
                cardType: 'Credit',
                number: '**** **** **** 1234',
                balance: 50000,
                logo: 'VISA',
                styleClass: 'bank-card-blue',
                transactions: [],
            },
        ];
    function getPayStoreSnapshot() {
        const raw = typeof window.getAppState === 'function' ? window.getAppState('pay') : null;
        return raw && typeof raw === 'object' ? raw : {};
    }
    function applyPaySnapshot(data = {}) {
        outgoingFamilyCards_2 = Array.isArray(data.outgoingFamilyCards)
            ? data.outgoingFamilyCards
            : [];
        if (data.cards && Array.isArray(data.cards)) {
            cards_2 = data.cards;
            data.currentCardId && (currentCardId_3 = data.currentCardId);
        } else {
            if (data.transactions || data.balance !== undefined) {
                cards_2[0].transactions = Array.isArray(data.transactions) ? data.transactions : [];
                const nextBalance = parseFloat(data.balance);
                cards_2[0].balance = Number.isFinite(nextBalance) ? nextBalance : 1000;
            }
        }
        !cards_2.find((value_16) => value_16.id === currentCardId_3) &&
            (currentCardId_3 = cards_2[0].id);
    }
    applyPaySnapshot(getPayStoreSnapshot());
    function getCurrentCard() {
        return cards_2.find((c) => c.id === currentCardId_3) || cards_2[0];
    }
    function getPayBalance_2() {
        return getCurrentCard().balance;
    }
    window.getPayBalance = getPayBalance_2;
    window.getPayCards = function () {
        return (applyPaySnapshot(getPayStoreSnapshot()), cards_2);
    };
    window.addPayTransaction = function (
        value_17,
        title_2,
        type_2 = 'income',
        targetCardId_2 = null,
    ) {
        const balance_2 = Number(value_17);
        if (!Number.isFinite(balance_2) || balance_2 <= 0) return false;
        const targetCard = targetCardId_2
            ? cards_2.find((c_2) => c_2.id === targetCardId_2) || getCurrentCard()
            : getCurrentCard();
        type_2 === 'income' ? (targetCard.balance += balance_2) : (targetCard.balance -= balance_2);
        const newTx = {
            id: Date.now(),
            title: title_2 || '未知交易',
            amount: type_2 === 'income' ? balance_2 : -balance_2,
            time: Date.now(),
            icon: type_2 === 'income' ? 'fa-arrow-down' : 'fa-shopping-bag',
            color: type_2 === 'income' ? '#333' : '#666',
        };
        return (
            (targetCard.transactions = targetCard.transactions || []),
            targetCard.transactions.unshift(newTx),
            savePayData(),
            renderPayUI(),
            window.showToast &&
                window.showToast(
                    type_2 === 'income'
                        ? '已到账 ￥' + balance_2.toFixed(2)
                        : '已支付 ￥' + balance_2.toFixed(2),
                ),
            true
        );
    };
    function savePayData() {
        if (typeof window.setAppState === 'function') {
            window.setAppState('pay', {
                cards: cards_2,
                currentCardId: currentCardId_3,
                outgoingFamilyCards: outgoingFamilyCards_2,
            });
            return;
        }
        window.saveGlobalData && window.saveGlobalData();
    }
    const payAppBtn = document.getElementById('app-pay-btn'),
        payView = document.getElementById('pay-view'),
        appContainer = document.getElementById('app'),
        payBackBtn = document.getElementById('pay-back-btn'),
        filterBtns = document.querySelectorAll('.pay-filter-btn'),
        totalAmountEl = document.getElementById('pay-total-amount'),
        payBillListElement = document.getElementById('pay-bill-list'),
        mainCardEl = document.getElementById('pay-main-card'),
        mainCardTitleEl = document.getElementById('pay-main-card-title'),
        mainCardTypeEl = document.getElementById('pay-main-card-type'),
        mainCardNumberEl = document.getElementById('pay-main-card-number'),
        mainCardLogoEl = document.getElementById('pay-main-card-logo'),
        btnScan = document.getElementById('pay-action-scan'),
        scanModal = document.getElementById('pay-scan-modal'),
        scanClose = document.getElementById('pay-scan-close'),
        btnCards = document.getElementById('pay-action-cards'),
        cardsSheet = document.getElementById('pay-cards-sheet'),
        transferInTargetEl = document.getElementById('pay-bank-list'),
        btnFamily = document.getElementById('pay-action-family'),
        familySheet = document.getElementById('pay-family-sheet'),
        transferInTargetEl_2 = document.getElementById('pay-family-list'),
        btnTransferIn = document.getElementById('pay-action-transfer-in'),
        transferInModal = document.getElementById('pay-transfer-in-modal'),
        transferInForm = document.getElementById('pay-transfer-in-form'),
        transferInAmountInput = document.getElementById('pay-transfer-in-amount'),
        transferInTargetEl_3 = document.getElementById('pay-transfer-in-target'),
        transferInClose = document.getElementById('pay-transfer-in-close'),
        transferInCancel = document.getElementById('pay-transfer-in-cancel'),
        transferInModal_2 = document.getElementById('pay-family-gift-modal'),
        payFamilyGiftFormElement = document.getElementById('pay-family-gift-form'),
        transferInTargetEl_5 = document.getElementById('pay-family-gift-friend'),
        transferInAmountInput_2 = document.getElementById('pay-family-gift-amount'),
        payFamilyGiftOpenElement = document.getElementById('pay-family-gift-open'),
        payFamilyGiftSubmitElement = document.getElementById('pay-family-gift-submit');
    let value_6 = null,
        enabled = false,
        payUiRendered = false;
    payAppBtn &&
        payAppBtn.addEventListener('click', () => {
            appContainer && ((appContainer.scrollTop = 0), (appContainer.scrollLeft = 0));
            if (!payUiRendered) renderPayUI();
        });
    payBackBtn &&
        payView &&
        payBackBtn.addEventListener('click', () => {
            payView.classList.remove('active');
            setTimeout(() => {
                if (!payView.classList.contains('active')) payView.style.display = '';
            }, 220);
        });
    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            currentFilter = btn.getAttribute('data-filter');
            renderPayUI();
        });
    });
    filterBtns.forEach((btn_2) => {
        btn_2.setAttribute('aria-pressed', btn_2.classList.contains('active') ? 'true' : 'false');
    });
    function handleAction_8() {
        handleAction_9();
        if (transferInTargetEl) {
            transferInTargetEl.innerHTML = '';
            const filter_25 = cards_2.filter((value_26) => value_26.type === 'bank');
            filter_25.forEach((value_27) => {
                const option = document.createElement('div');
                option.className =
                    'pay-bank-card ' +
                    (value_27.styleClass || '') +
                    ' ' +
                    (value_27.id === currentCardId_3 ? 'is-current' : '');
                option.innerHTML =
                    `
                    <div class="pay-bank-name"><i class="` +
                    value_27.icon +
                    '"></i> ' +
                    value_27.name +
                    `</div>
                    <div class="pay-bank-type">` +
                    value_27.cardType +
                    `</div>
                    <div class="pay-bank-number">` +
                    value_27.number +
                    `</div>
                    <div class="pay-bank-logo">` +
                    value_27.logo +
                    `</div>
                `;
                option.addEventListener('click', () => {
                    currentCardId_3 = value_27.id;
                    savePayData();
                    renderPayUI();
                    if (window.closeView) window.closeView(cardsSheet);
                    else cardsSheet.classList.remove('active');
                });
                transferInTargetEl.appendChild(option);
            });
        }
        if (transferInTargetEl_2) {
            transferInTargetEl_2.innerHTML = '';
            const familyCards = cards_2.filter((c_3) => c_3.type === 'family'),
                option_2 = document.createElement('h3');
            option_2.className = 'pay-family-issued-heading';
            option_2.textContent = '我收到的亲属卡';
            transferInTargetEl_2.appendChild(option_2);
            if (familyCards.length === 0) {
                const option_3 = document.createElement('div');
                option_3.className = 'pay-empty-card-state';
                option_3.textContent = '暂无收到的亲属卡';
                transferInTargetEl_2.appendChild(option_3);
            } else
                familyCards.forEach((c_4) => {
                    const element_35 = document.createElement('div');
                    element_35.className =
                        'pay-bank-card family-sheet-card ' +
                        (c_4.id === currentCardId_3 ? 'is-current' : '');
                    element_35.innerHTML =
                        `
                        <div class="pay-bank-name"><i class="` +
                        c_4.icon +
                        '"></i> ' +
                        c_4.name +
                        `</div>
                        <div class="pay-bank-type">` +
                        c_4.cardType +
                        `</div>
                        <div class="pay-bank-number">` +
                        c_4.number +
                        `</div>
                        <div class="pay-bank-logo">` +
                        c_4.logo +
                        `</div>
                    `;
                    const unbindBtn = document.createElement('button');
                    unbindBtn.type = 'button';
                    unbindBtn.className = 'pay-family-card-unbind';
                    unbindBtn.textContent = '解绑';
                    unbindBtn.setAttribute('aria-label', '解绑' + c_4.name);
                    unbindBtn.addEventListener('click', (event) => {
                        event.stopPropagation();
                        confirmRemoveFamilyCard(c_4);
                    });
                    element_35.appendChild(unbindBtn);
                    element_35.addEventListener('click', () => {
                        currentCardId_3 = c_4.id;
                        savePayData();
                        renderPayUI();
                        if (window.closeView) window.closeView(familySheet);
                        else familySheet.classList.remove('active');
                    });
                    transferInTargetEl_2.appendChild(element_35);
                });
            const option_4 = document.createElement('h3');
            option_4.className = 'pay-family-issued-heading';
            option_4.textContent = '我赠送的亲属卡';
            transferInTargetEl_2.appendChild(option_4);
            const filter_31 = outgoingFamilyCards_2.filter(
                (value_37) => value_37.status !== 'unbound',
            );
            if (filter_31.length === 0) {
                const option_5 = document.createElement('div');
                option_5.className = 'pay-empty-card-state';
                option_5.textContent = '暂无赠送记录';
                transferInTargetEl_2.appendChild(option_5);
            }
            filter_31.forEach((value_39) => {
                const option_6 = document.createElement('div');
                option_6.className = 'pay-bank-card family-sheet-card pay-outgoing-family-card';
                option_6.innerHTML =
                    '<div class="pay-bank-name"><i class="fas fa-heart"></i><span></span></div><div class="pay-bank-type"></div><div class="pay-bank-number"></div><div class="pay-bank-logo">Pay</div><div class="pay-outgoing-family-actions"></div>';
                option_6.querySelector('.pay-bank-name span').textContent =
                    '亲属卡 - ' + (value_39.friendName || '好友');
                option_6.querySelector('.pay-bank-type').textContent =
                    value_39.status === 'accepted'
                        ? '已收下'
                        : value_39.status === 'rejected'
                          ? '已退回'
                          : '等待收下';
                option_6.querySelector('.pay-bank-number').textContent =
                    '额度 ¥' + Number(value_39.limit).toFixed(2);
                const transferInTargetEl_4 = option_6.querySelector('.pay-outgoing-family-actions');
                if (value_39.status === 'accepted') {
                    const element_42 = document.createElement('button');
                    element_42.type = 'button';
                    element_42.className = 'pay-family-card-adjust';
                    element_42.textContent = '调整额度';
                    element_42.addEventListener('click', () => handleAction_13(value_39.id));
                    transferInTargetEl_4.appendChild(element_42);
                }
                const unbindBtn_2 = document.createElement('button');
                unbindBtn_2.type = 'button';
                unbindBtn_2.className = 'pay-family-card-unbind';
                unbindBtn_2.textContent = '解绑';
                unbindBtn_2.setAttribute(
                    'aria-label',
                    '解绑赠送给' + (value_39.friendName || '好友') + '的亲属卡',
                );
                unbindBtn_2.addEventListener('click', () => handleAction_10(value_39));
                transferInTargetEl_4.appendChild(unbindBtn_2);
                transferInTargetEl_2.appendChild(option_6);
            });
        }
    }
    function renderPayUI() {
        payUiRendered = true;
        const currentCard = getCurrentCard();
        if (mainCardEl && currentCard) {
            mainCardEl.className = 'pay-total-card ' + (currentCard.styleClass || '');
            if (mainCardTitleEl)
                mainCardTitleEl.innerHTML =
                    '<i class="' + currentCard.icon + '"></i> ' + currentCard.name;
            if (mainCardTypeEl) mainCardTypeEl.textContent = currentCard.cardType;
            if (totalAmountEl) totalAmountEl.textContent = currentCard.balance.toFixed(2);
            if (mainCardNumberEl) mainCardNumberEl.textContent = currentCard.number;
            if (mainCardLogoEl) mainCardLogoEl.textContent = currentCard.logo;
        }
        handleAction_8();
        let txs = currentCard.transactions || [],
            filteredTxs = txs;
        if (currentFilter === 'income') filteredTxs = txs.filter((tx) => tx.amount > 0);
        else currentFilter === 'expense' && (filteredTxs = txs.filter((tx_2) => tx_2.amount < 0));
        payBillListElement &&
            ((payBillListElement.innerHTML = ''),
            filteredTxs.length === 0
                ? (payBillListElement.innerHTML = '<div class="pay-empty-state">暂无交易记录</div>')
                : filteredTxs.forEach((tx_3) => {
                      const element_47 = document.createElement('div');
                      element_47.className = 'pay-bill-item';
                      const date = new Date(tx_3.time),
                          value_49 =
                              date.getMonth() +
                              1 +
                              '-' +
                              date.getDate() +
                              ' ' +
                              date.getHours().toString().padStart(2, '0') +
                              ':' +
                              date.getMinutes().toString().padStart(2, '0'),
                          amountStr = (tx_3.amount > 0 ? '+' : '') + tx_3.amount.toFixed(2),
                          amountClass = tx_3.amount > 0 ? 'pay-positive' : '';
                      element_47.innerHTML =
                          `
                        <div class="pay-bill-icon">
                            <i class="fas ` +
                          tx_3.icon +
                          `"></i>
                        </div>
                        <div class="pay-bill-info">
                            <div class="pay-bill-title">` +
                          tx_3.title +
                          `</div>
                            <div class="pay-bill-time">` +
                          value_49 +
                          `</div>
                        </div>
                        <div class="pay-bill-amount ` +
                          amountClass +
                          '">' +
                          amountStr +
                          `</div>
                    `;
                      payBillListElement.appendChild(element_47);
                  }));
    }
    function refreshPayStateAfterHydration() {
        applyPaySnapshot(getPayStoreSnapshot());
        renderPayUI();
    }
    window.globalDataReadyPromise && typeof window.globalDataReadyPromise.then === 'function'
        ? (window.payDataReadyPromise = window.globalDataReadyPromise
              .then(() => {
                  return (refreshPayStateAfterHydration(), true);
              })
              ['catch']((error_2) => {
                  return (console.warn('Pay global data recovery failed:', error_2), false);
              }))
        : (window.payDataReadyPromise = Promise.resolve(true));
    window.addOrUpdateFamilyCard = function (friendId_2, friendName_2, amount_2) {
        const cardId = 'family_' + friendId_2;
        let existingCard = cards_2.find((c_5) => c_5.id === cardId);
        const limit_2 = Number(amount_2) || 0;
        if (existingCard) {
            existingCard.balance += limit_2;
            savePayData();
            if (typeof renderPayUI === 'function') renderPayUI();
            return {
                action: 'increase',
                newBalance: existingCard.balance,
            };
        } else {
            const newCard = {
                id: cardId,
                type: 'family',
                name: '亲属卡 - ' + (friendName_2 || '好友'),
                icon: 'fas fa-heart',
                cardType: 'Family Card',
                number: '**** **** **** ' + Math.floor(1000 + Math.random() * 9000),
                balance: limit_2,
                logo: 'Pay',
                styleClass: 'family-card',
                transactions: [],
            };
            cards_2.push(newCard);
            savePayData();
            if (typeof renderPayUI === 'function') renderPayUI();
            return {
                action: 'grant',
                newBalance: limit_2,
            };
        }
    };
    window.hasFamilyCard = function (friendId_3) {
        return cards_2.some((c_6) => c_6.id === 'family_' + friendId_3);
    };
    window.getOutgoingFamilyCards = () => {
        return (
            handleAction_9(),
            outgoingFamilyCards_2
                .filter((value_60) => value_60.status !== 'unbound')
                .map((value_61) => ({
                    ...value_61,
                }))
        );
    };
    function handleAction_9() {
        let enabled_62 = false;
        (window.imData?.friends || [])
            .filter((value_63) => value_63?.type === 'char' && Array.isArray(value_63.messages))
            .forEach((value_64) => {
                value_64.messages.forEach((message_65) => {
                    if (
                        !message_65 ||
                        ![
                            'family_card_pending',
                            'family_card_accepted',
                            'family_card_rejected',
                            'family_card_adjust',
                            'family_card_unbound',
                        ].includes(message_65.payKind)
                    )
                        return;
                    const id_2 = String(message_65.familyCardId || message_65.id || '');
                    if (!id_2) return;
                    let result = outgoingFamilyCards_2.find(
                        (contact) =>
                            contact.id === id_2 && contact.friendId === String(value_64.id),
                    );
                    !result &&
                        message_65.payKind !== 'family_card_adjust' &&
                        ((result = {
                            id: id_2,
                            friendId: String(value_64.id),
                            friendName: value_64.nickname || value_64.realName || '好友',
                            limit: Number(message_65.amount) || 0,
                            status: 'pending',
                            createdAt: Number(message_65.timestamp) || Date.now(),
                        }),
                        outgoingFamilyCards_2.push(result),
                        (enabled_62 = true));
                    if (!result) return;
                    if (result.status === 'unbound') return;
                    const status_2 =
                        message_65.payKind === 'family_card_accepted'
                            ? 'accepted'
                            : message_65.payKind === 'family_card_rejected'
                              ? 'rejected'
                              : message_65.payKind === 'family_card_unbound'
                                ? 'unbound'
                                : null;
                    status_2 &&
                        result.status !== status_2 &&
                        ((result.status = status_2), (enabled_62 = true));
                    message_65.payKind === 'family_card_adjust' &&
                        result.status === 'accepted' &&
                        Number(message_65.amount) > 0 &&
                        result.limit !== Number(message_65.amount) &&
                        ((result.limit = Number(message_65.amount)), (enabled_62 = true));
                });
            });
        if (enabled_62) savePayData();
    }
    window.createOutgoingFamilyCard = function (value_67, value_68, value_69, value_70) {
        const limit_3 = Number(value_69);
        if (
            !value_67 ||
            !value_70 ||
            !Number.isFinite(limit_3) ||
            limit_3 <= 0 ||
            Math.abs(limit_3 * 100 - Math.round(limit_3 * 100)) > 0.000001
        )
            return false;
        if (
            outgoingFamilyCards_2.some(
                (contact_72) =>
                    String(contact_72.friendId) === String(value_67) &&
                    !['rejected', 'unbound'].includes(contact_72.status),
            )
        )
            return false;
        return (
            outgoingFamilyCards_2.push({
                id: String(value_70),
                friendId: String(value_67),
                friendName: String(value_68 || '好友'),
                limit: limit_3,
                status: 'pending',
                createdAt: Date.now(),
            }),
            savePayData(),
            renderPayUI(),
            true
        );
    };
    window.resolveOutgoingFamilyCard = function (value_73, value_74, status_3) {
        handleAction_9();
        const result_76 = outgoingFamilyCards_2.find(
            (contact_77) =>
                contact_77.id === String(value_73) && contact_77.friendId === String(value_74),
        );
        if (!result_76 || !['accepted', 'rejected'].includes(status_3)) return false;
        if (result_76.status === status_3) return (renderPayUI(), true);
        if (result_76.status !== 'pending') return false;
        return ((result_76.status = status_3), savePayData(), renderPayUI(), true);
    };
    window.changeOutgoingFamilyCardLimit = function (value_78, value_79) {
        const result_80 = outgoingFamilyCards_2.find(
                (value_83) => value_83.id === String(value_78) && value_83.status === 'accepted',
            ),
            limit_4 = Number(value_79);
        if (
            !result_80 ||
            !Number.isFinite(limit_4) ||
            limit_4 <= 0 ||
            Math.abs(limit_4 * 100 - Math.round(limit_4 * 100)) > 0.000001 ||
            limit_4 === result_80.limit
        )
            return false;
        const previousLimit_2 = result_80.limit;
        return (
            (result_80.limit = limit_4),
            savePayData(),
            renderPayUI(),
            {
                card: {
                    ...result_80,
                },
                previousLimit: previousLimit_2,
            }
        );
    };
    window.removeOutgoingFamilyCard = async function (value_84) {
        const result_85 = outgoingFamilyCards_2.find(
            (value_87) => value_87.id === String(value_84) && value_87.status !== 'unbound',
        );
        if (!result_85) return false;
        const result_86 = (window.imData?.friends || []).find(
            (value_88) => String(value_88.id) === result_85.friendId,
        );
        if (result_86) {
            if (!window.imApp?.commitFriendChange) return false;
            try {
                const value_89 = await window.imApp.commitFriendChange(
                    result_86.id,
                    (value_90) => {
                        const result_91 = value_90?.messages?.find(
                            (value_92) => String(value_92.id) === result_85.id,
                        );
                        if (!result_91) return;
                        result_91.familyCardStatus = 'unbound';
                        result_91.payKind = 'family_card_unbound';
                        result_91.cardTitle = '亲属卡已解绑';
                    },
                    {
                        silent: true,
                    },
                );
                if (!value_89) return false;
            } catch (value_93) {
                return (console.error('Failed to unbind outgoing family card:', value_93), false);
            }
        }
        result_85.status = 'unbound';
        result_85.unboundAt = Date.now();
        savePayData();
        renderPayUI();
        if (result_86) {
            const value_94 = window.imApp.getFriendById?.(result_86.id) || result_86,
                insChatMessagesElement = document
                    .getElementById('chat-interface-' + result_86.id)
                    ?.querySelector('.ins-chat-messages');
            insChatMessagesElement &&
                String(window.imData?.currentActiveFriend?.id) === result_85.friendId &&
                window.imChat?.rerenderChatContainer?.(value_94, insChatMessagesElement, {
                    scroll: true,
                });
        }
        return true;
    };
    function handleAction_10(value_95) {
        const onConfirm_3 = async () => {
                const value_98 = await window.removeOutgoingFamilyCard(value_95.id);
                if (window.showToast)
                    window.showToast(value_98 ? '亲属卡已解绑' : '解绑失败，请重试');
            },
            message_2 =
                '解绑后将移除赠送给' + (value_95.friendName || '好友') + '的亲属卡，且无法恢复。';
        if (typeof window.showCustomModal === 'function')
            window.showCustomModal({
                title: '解绑亲属卡',
                message: message_2,
                confirmText: '解绑',
                cancelText: '取消',
                isDestructive: true,
                onConfirm: onConfirm_3,
            });
        else window.confirm(message_2) && void onConfirm_3();
    }
    function removeFamilyCard_2(cardId_2) {
        const cardIndex = cards_2.findIndex((c_7) => c_7.id === cardId_2 && c_7.type === 'family');
        if (cardIndex < 0) return false;
        return (
            cards_2.splice(cardIndex, 1),
            !cards_2.some((c_8) => c_8.id === currentCardId_3) &&
                (currentCardId_3 =
                    cards_2.find((c_9) => c_9.type === 'bank')?.id || cards_2[0]?.id || 'bank_1'),
            savePayData(),
            renderPayUI(),
            true
        );
    }
    window.removeFamilyCard = removeFamilyCard_2;
    function confirmRemoveFamilyCard(card_2) {
        const onConfirm_2 = () => {
            if (!removeFamilyCard_2(card_2.id)) return;
            if (window.showToast) window.showToast('亲属卡已解绑');
        };
        if (typeof window.showCustomModal === 'function')
            window.showCustomModal({
                title: '解绑亲属卡',
                message: '解绑后将删除' + card_2.name + '，且无法恢复。',
                confirmText: '解绑',
                cancelText: '取消',
                isDestructive: true,
                onConfirm: onConfirm_2,
            });
        else window.confirm('解绑后将删除' + card_2.name + '，且无法恢复。') && onConfirm_2();
    }
    function handleClick() {
        const bankCards = cards_2.filter((value_108) => value_108.type === 'bank');
        if (bankCards.length === 0 || !transferInModal) {
            if (window.showToast) window.showToast('暂无可转入的银行卡');
            return;
        }
        const currentCard_2 = getCurrentCard(),
            selectedBankCard = currentCard_2?.type === 'bank' ? currentCard_2 : bankCards[0];
        transferInTargetEl_3 &&
            ((transferInTargetEl_3.innerHTML = ''),
            bankCards.forEach((card_3) => {
                const option_7 = document.createElement('option');
                option_7.value = card_3.id;
                option_7.textContent = (card_3.name + ' ' + (card_3.number || '')).trim();
                option_7.selected = card_3.id === selectedBankCard.id;
                transferInTargetEl_3.appendChild(option_7);
            }));
        if (transferInAmountInput) transferInAmountInput.value = '';
        transferInModal.classList.add('active');
        transferInModal.inert = false;
        setTimeout(() => {
            if (transferInModal.classList.contains('active')) transferInAmountInput?.focus();
        }, 80);
    }
    function closeTransferInModal() {
        if (!transferInModal) return;
        if (transferInModal.contains(document.activeElement)) btnTransferIn?.focus();
        transferInModal.classList.remove('active');
        transferInModal.inert = true;
        if (transferInForm) transferInForm.reset();
    }
    function handleAction_13(value_111 = null) {
        if (!transferInModal_2) return;
        const result_112 = outgoingFamilyCards_2.find(
            (value_113) => value_113.id === value_111 && value_113.status === 'accepted',
        );
        value_6 = result_112?.id || null;
        transferInTargetEl_5.innerHTML = '';
        if (result_112) {
            transferInTargetEl_5.add(new Option(result_112.friendName, result_112.friendId));
            transferInTargetEl_5.disabled = true;
            transferInAmountInput_2.value = result_112.limit;
        } else {
            transferInTargetEl_5.disabled = false;
            transferInAmountInput_2.value = '';
            const filter_114 = (window.imData?.friends || []).filter(
                    (value_116) => value_116?.type === 'char' && value_116.id != null,
                ),
                filter_115 = filter_114.filter(
                    (value_117) =>
                        !outgoingFamilyCards_2.some(
                            (contact_118) =>
                                String(contact_118.friendId) === String(value_117.id) &&
                                !['rejected', 'unbound'].includes(contact_118.status),
                        ),
                );
            filter_115.forEach((value_119) =>
                transferInTargetEl_5.add(
                    new Option(
                        value_119.nickname || value_119.realName || '未命名角色',
                        value_119.id,
                    ),
                ),
            );
            if (!filter_115.length) {
                if (window.showToast)
                    window.showToast(
                        filter_114.length ? '没有可赠送的角色' : '请先在 iMessage 添加角色',
                    );
                return;
            }
        }
        document.getElementById('pay-family-gift-title').textContent = result_112
            ? '调整亲属卡额度'
            : '赠送亲属卡';
        document.getElementById('pay-family-gift-amount-label').textContent = result_112
            ? '新额度'
            : '亲属卡额度';
        document.getElementById('pay-family-gift-hint').textContent = result_112
            ? '确认后将通知对方新的额度。'
            : '角色收下后可在这里调整额度。';
        payFamilyGiftSubmitElement.textContent = result_112 ? '确认调整' : '确认赠送';
        transferInModal_2.classList.add('active');
        transferInModal_2.inert = false;
        setTimeout(() => {
            if (transferInModal_2.classList.contains('active')) transferInAmountInput_2.focus();
        }, 80);
    }
    function closeTransferInModal_2() {
        if (!transferInModal_2 || enabled) return;
        if (transferInModal_2.contains(document.activeElement)) payFamilyGiftOpenElement?.focus();
        transferInModal_2.classList.remove('active');
        transferInModal_2.inert = true;
        value_6 = null;
        payFamilyGiftFormElement?.reset();
    }
    payFamilyGiftOpenElement?.addEventListener('click', () => handleAction_13());
    document
        .getElementById('pay-family-gift-close')
        ?.addEventListener('click', closeTransferInModal_2);
    document
        .getElementById('pay-family-gift-cancel')
        ?.addEventListener('click', closeTransferInModal_2);
    transferInModal_2?.addEventListener('mousedown', (event_2) => {
        if (event_2.target === transferInModal_2) closeTransferInModal_2();
    });
    payFamilyGiftFormElement?.addEventListener('submit', async (event_121) => {
        event_121.preventDefault();
        if (enabled) return;
        const amount_4 = Number(transferInAmountInput_2.value);
        if (
            !Number.isFinite(amount_4) ||
            amount_4 <= 0 ||
            Math.abs(amount_4 * 100 - Math.round(amount_4 * 100)) > 0.000001
        ) {
            if (window.showToast) window.showToast('请输入精确到分的正数额度');
            transferInAmountInput_2.focus();
            return;
        }
        const value_123 = transferInTargetEl_5.value,
            result_124 = (window.imData?.friends || []).find(
                (value_126) =>
                    String(value_126.id) === String(value_123) && value_126.type === 'char',
            );
        if (!result_124 || !window.imApp?.appendFriendMessage) {
            if (window.showToast) window.showToast('未找到 iMessage 角色');
            return;
        }
        const result_125 = outgoingFamilyCards_2.find(
            (value_127) => value_127.id === value_6 && value_127.status === 'accepted',
        );
        if (value_6 && !result_125) return;
        if (result_125 && amount_4 === result_125.limit) {
            if (window.showToast) window.showToast('新额度与当前额度相同');
            return;
        }
        if (
            !result_125 &&
            outgoingFamilyCards_2.some(
                (contact_128) =>
                    contact_128.friendId === String(value_123) &&
                    !['rejected', 'unbound'].includes(contact_128.status),
            )
        )
            return;
        enabled = true;
        payFamilyGiftSubmitElement.disabled = true;
        try {
            if (window.imApp.ensureFriendMessagesLoaded)
                await window.imApp.ensureFriendMessagesLoaded(result_124.id);
            const id_3 =
                    window.imChat?.createMessageId?.('family') ||
                    'family-' + Date.now() + '-' + Math.random().toString(36).slice(2),
                previousLimit_3 = result_125?.limit || 0,
                value_131 = result_125
                    ? amount_4 > previousLimit_3
                        ? 'increase'
                        : 'decrease'
                    : 'gift',
                cardTitle_2 =
                    value_131 === 'gift'
                        ? '赠送亲属卡'
                        : value_131 === 'increase'
                          ? '亲属卡提额'
                          : '亲属卡降额',
                options_133 = {
                    id: id_3,
                    role: 'user',
                    type: 'pay_transfer',
                    payKind: value_131 === 'gift' ? 'family_card_pending' : 'family_card_adjust',
                    paymentAction: value_131 === 'gift' ? 'family_card_gift' : 'family_card_adjust',
                    familyCardId: result_125?.id || id_3,
                    familyCardStatus: value_131 === 'gift' ? 'pending' : 'completed',
                    amount: amount_4,
                    previousLimit: previousLimit_3,
                    cardTitle: cardTitle_2,
                    description:
                        value_131 === 'gift'
                            ? '亲属卡额度 ¥' + amount_4.toFixed(2)
                            : '额度由 ¥' +
                              previousLimit_3.toFixed(2) +
                              ' 调整至 ¥' +
                              amount_4.toFixed(2),
                    content: '[亲属卡] ' + cardTitle_2 + ' ¥' + amount_4.toFixed(2),
                    timestamp: Date.now(),
                },
                value_134 = await window.imApp.appendFriendMessage(result_124.id, options_133, {
                    silent: true,
                });
            if (!value_134) throw new Error('亲属卡消息保存失败');
            if (result_125) window.changeOutgoingFamilyCardLimit(result_125.id, amount_4);
            else
                window.createOutgoingFamilyCard(
                    result_124.id,
                    result_124.nickname || result_124.realName,
                    amount_4,
                    id_3,
                );
            const value_135 = window.imApp.getFriendById?.(result_124.id) || result_124,
                insChatMessagesElement_136 = document
                    .getElementById('chat-interface-' + result_124.id)
                    ?.querySelector('.ins-chat-messages');
            insChatMessagesElement_136 &&
                window.imData?.currentActiveFriend &&
                String(window.imData.currentActiveFriend.id) === String(result_124.id) &&
                window.imChat?.rerenderChatContainer?.(value_135, insChatMessagesElement_136, {
                    scroll: true,
                });
            enabled = false;
            closeTransferInModal_2();
            if (window.showToast) window.showToast(result_125 ? '额度已调整' : '亲属卡已送出');
        } catch (value_137) {
            console.error('Pay family card failed:', value_137);
            if (window.showToast) window.showToast('亲属卡操作失败，请重试');
        } finally {
            enabled = false;
            payFamilyGiftSubmitElement.disabled = false;
        }
    });
    btnScan &&
        scanModal &&
        btnScan.addEventListener('click', () => {
            scanModal.classList.add('active');
        });
    scanClose &&
        scanModal &&
        scanClose.addEventListener('click', () => {
            scanModal.classList.remove('active');
        });
    btnTransferIn && btnTransferIn.addEventListener('click', handleClick);
    transferInClose && transferInClose.addEventListener('click', closeTransferInModal);
    transferInCancel && transferInCancel.addEventListener('click', closeTransferInModal);
    transferInModal &&
        transferInModal.addEventListener('mousedown', (event_3) => {
            if (event_3.target === transferInModal) closeTransferInModal();
        });
    transferInForm &&
        transferInForm.addEventListener('submit', (event_139) => {
            event_139.preventDefault();
            const amount_3 = Number(transferInAmountInput?.value);
            if (!Number.isFinite(amount_3) || amount_3 <= 0) {
                if (window.showToast) window.showToast('请输入大于 0 的转入金额');
                transferInAmountInput?.focus();
                return;
            }
            const targetCardId = transferInTargetEl_3?.value,
                targetCard_2 = cards_2.find(
                    (card_4) => card_4.id === targetCardId && card_4.type === 'bank',
                );
            if (!targetCard_2) {
                if (window.showToast) window.showToast('请选择银行卡');
                return;
            }
            const success = window.addPayTransaction(
                amount_3,
                '账户转入',
                'income',
                targetCard_2.id,
            );
            if (!success) {
                if (window.showToast) window.showToast('转入失败，请重试');
                return;
            }
            closeTransferInModal();
        });
    btnCards &&
        cardsSheet &&
        btnCards.addEventListener('click', () => {
            handleAction_8();
            if (window.openView) window.openView(cardsSheet);
            else cardsSheet.classList.add('active');
        });
    cardsSheet &&
        cardsSheet.addEventListener('mousedown', (event_144) => {
            if (event_144.target === cardsSheet) {
                if (window.closeView) window.closeView(cardsSheet);
                else cardsSheet.classList.remove('active');
            }
        });
    btnFamily &&
        familySheet &&
        btnFamily.addEventListener('click', () => {
            handleAction_8();
            if (window.openView) window.openView(familySheet);
            else familySheet.classList.add('active');
        });
    familySheet &&
        familySheet.addEventListener('mousedown', (event_145) => {
            if (event_145.target === familySheet) {
                if (window.closeView) window.closeView(familySheet);
                else familySheet.classList.remove('active');
            }
        });
});
