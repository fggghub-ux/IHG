(function () {
    const durableStorage = window.u2LegacyStorageFacade,
        count = 8000,
        count_3 = 16000;
    function handleAction_4(value_10) {
        const replace_11 = String(value_10 == null ? '' : value_10)
                .replace(/[，,\s]/g, '')
                .replace(/[^\d.-]/g, ''),
            float = Number.parseFloat(replace_11);
        return Number.isFinite(float) && float >= 0 ? float : 0;
    }
    function handleAction_5(value_12 = 'shop') {
        if (window.crypto && typeof window.crypto.randomUUID === 'function')
            return value_12 + '-' + window.crypto.randomUUID();
        return value_12 + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
    }
    function handleAction_6(value_13) {
        return String(value_13 == null ? '' : value_13)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    class ShoppingApp {
        constructor() {
            this.view = document.getElementById('shopping-view');
            this.panelsWrap = document.getElementById('shopping-panels');
            this.indicator = document.getElementById('shopping-nav-indicator');
            this.closeBtn = document.getElementById('shopping-close-btn');
            this.tabs = ['food', 'mall', 'cart', 'me'];
            this.currentTab = 'food';
            this.hasSelectedTab = false;
            this.scrollTimer = null;
            this.ordersRefreshTimer = null;
            this.cart = this.loadCart();
            this.detailSheet = document.getElementById('shopping-detail-sheet');
            this.detailMedia = document.getElementById('shopping-detail-media');
            this.detailName = document.getElementById('shopping-detail-name');
            this.detailPrice = document.getElementById('shopping-detail-price');
            this.detailDesc = document.getElementById('shopping-detail-desc');
            this.addToCartBtn = document.getElementById('shopping-add-to-cart-btn');
            this.foodDetailSheet = document.getElementById('shopping-food-detail-sheet');
            this.foodDetailMedia = document.getElementById('shopping-food-detail-media');
            this.foodDetailName = document.getElementById('shopping-food-detail-name');
            this.foodDetailPrice = document.getElementById('shopping-food-detail-price');
            this.foodDetailDesc = document.getElementById('shopping-food-detail-desc');
            this.foodBottomPrice = document.getElementById('shopping-food-bottom-price');
            this.foodCloseBtn = document.getElementById('shopping-food-close-btn');
            this.addFoodToCartBtn = document.getElementById('shopping-food-add-to-cart-btn');
            this.currentProduct = null;
            this.cartEmptyState = document.getElementById('shopping-cart-empty-state');
            this.cartContent = document.getElementById('shopping-cart-content');
            this.cartList = document.getElementById('shopping-cart-list');
            this.cartSubtotal = document.getElementById('shopping-cart-subtotal');
            this.cartTotal = document.getElementById('shopping-cart-total');
            this.checkoutBtn = document.getElementById('shopping-checkout-btn');
            this.checkoutSheet = document.getElementById('shopping-checkout-sheet');
            this.payDesc = document.getElementById('shopping-checkout-pay-desc');
            this.paySelectBtn = document.getElementById('shopping-checkout-pay-select');
            this.friendDesc = document.getElementById('shopping-checkout-friend-desc');
            this.friendSelectBtn = document.getElementById('shopping-checkout-friend-select');
            this.confirmPaymentBtn = document.getElementById('shopping-confirm-payment-btn');
            this.paymentRadios = document.querySelectorAll('input[name="shopping-payment-method"]');
            this.cardSelectionModal = document.getElementById('shopping-card-selection-modal');
            this.cardList = document.getElementById('shopping-card-list');
            this.cardBalance = document.getElementById('shopping-card-selection-balance');
            this.charSelectionModal = document.getElementById('shopping-char-selection-modal');
            this.charList = document.getElementById('shopping-char-list');
            this.ordersBtn = document.getElementById('shopping-orders-btn');
            this.ordersSheet = document.getElementById('shopping-orders-sheet');
            this.ordersList = document.getElementById('shopping-orders-list');
            this.orders = this.loadOrders();
            this.selectedCard = null;
            this.selectedFriend = null;
            this.giftOrdersInFlight = new Set();
            if (!this.view || !this.panelsWrap) return;
            this.navItems = Array.from(this.view.querySelectorAll('.shopping-nav-item'));
            this.panels = Array.from(this.view.querySelectorAll('.shopping-panel'));
            this.settingsBtn = document.getElementById('shopping-settings-btn');
            this.settingsSheet = document.getElementById('shopping-settings-sheet');
            this.searchBtn = document.getElementById('shopping-search-btn');
            this.searchSheet = document.getElementById('shopping-search-sheet');
            this.searchInput = document.getElementById('shopping-search-input');
            this.searchConfirmBtn = document.getElementById('shopping-search-confirm-btn');
            this.bindWbBtn = document.getElementById('shopping-bind-wb-btn');
            this.boundWbName = document.getElementById('shopping-bound-wb-name');
            this.clearGeneratedBtn = document.getElementById('shopping-clear-generated-btn');
            this.foodListContainer = document.getElementById('shopping-food-list-container');
            this.productListContainer = document.getElementById('shopping-product-grid-container');
            this.profileAvatar = document.getElementById('shopping-profile-avatar');
            this.profileAvatarImg = document.getElementById('shopping-profile-avatar-img');
            this.profileAvatarIcon = document.getElementById('shopping-profile-avatar-icon');
            this.profileName = document.getElementById('shopping-profile-name');
            this.updateBoundWbDisplay();
            this.syncProfile();
            this.bindEvents();
            this.switchTab('food', {
                scroll: false,
            });
            this.renderCart();
            this.loadGeneratedProducts();
        }
        ['loadGeneratedProducts']() {
            try {
                const savedFood = durableStorage.getItem('shopping_generated_food');
                if (savedFood) {
                    const foodData = JSON.parse(savedFood);
                    this.renderProductCards(foodData, 'food');
                }
                const savedMall = durableStorage.getItem('shopping_generated_mall');
                if (savedMall) {
                    const mallData = JSON.parse(savedMall);
                    this.renderProductCards(mallData, 'mall');
                }
            } catch (e_2) {
                console.error('Failed to load generated products', e_2);
            }
        }
        ['clearGeneratedProducts']() {
            const confirm_17 = window.confirm(
                '确定要清空所有 AI 生成的外卖和商城商品吗？购物车和订单不会受到影响。',
            );
            if (!confirm_17) return false;
            return (
                durableStorage.removeItem('shopping_generated_food'),
                durableStorage.removeItem('shopping_generated_mall'),
                this.foodListContainer
                    ?.querySelectorAll('[data-shopping-generated="true"]')
                    .forEach((value_18) => value_18.remove()),
                this.productListContainer
                    ?.querySelectorAll('[data-shopping-generated="true"]')
                    .forEach((value_19) => value_19.remove()),
                window.showToast ? window.showToast('已清空生成的商品') : alert('已清空生成的商品'),
                true
            );
        }
        ['getAvailableWorldBooks']() {
            if (typeof window.getWorldBooks === 'function') return window.getWorldBooks() || [];
            const globalDataStr = durableStorage.getItem('app_global_data');
            if (globalDataStr)
                try {
                    const globalData = JSON.parse(globalDataStr);
                    return globalData?.worldBooks?.books || [];
                } catch (value_22) {}
            return [];
        }
        ['getBoundWorldBookIds']() {
            let ids = [];
            const savedIds = durableStorage.getItem('shopping_bound_wb_ids');
            if (savedIds)
                try {
                    const parsedIds = JSON.parse(savedIds);
                    if (Array.isArray(parsedIds)) ids = parsedIds;
                } catch (value_27) {}
            const legacyId = durableStorage.getItem('shopping_bound_wb_id');
            return (
                legacyId && !ids.map(String).includes(String(legacyId)) && ids.unshift(legacyId),
                ids
                    .map((id_2) => String(id_2))
                    .filter((id_3, index_2, allIds) => id_3 && allIds.indexOf(id_3) === index_2)
            );
        }
        ['saveBoundWorldBookIds'](ids_2 = []) {
            const nextIds = (Array.isArray(ids_2) ? ids_2 : [])
                .map((id_4) => String(id_4))
                .filter((id_5, index_3, allIds_2) => id_5 && allIds_2.indexOf(id_5) === index_3);
            nextIds.length > 0
                ? (durableStorage.setItem('shopping_bound_wb_ids', JSON.stringify(nextIds)),
                  durableStorage.setItem('shopping_bound_wb_id', nextIds[0]))
                : (durableStorage.removeItem('shopping_bound_wb_ids'),
                  durableStorage.removeItem('shopping_bound_wb_id'));
        }
        ['updateBoundWbDisplay']() {
            if (!this.boundWbName) return;
            const boundIds = this.getBoundWorldBookIds();
            if (boundIds.length === 0) {
                this.boundWbName.textContent = '未绑定';
                return;
            }
            const books_2 = this.getAvailableWorldBooks(),
                boundBooks = boundIds
                    .map((id_6) => books_2.find((book) => String(book.id) === String(id_6)))
                    .filter(Boolean);
            if (boundBooks.length === 1)
                this.boundWbName.textContent = boundBooks[0].name || '未命名世界书';
            else
                boundBooks.length > 1
                    ? (this.boundWbName.textContent = '已挂载 ' + boundBooks.length + ' 本')
                    : (this.boundWbName.textContent = '未绑定');
        }
        ['syncProfile']() {
            const contact = window.getUserState ? window.getUserState() : window.userState || {},
                textContent_4 = String(contact?.name || '').trim() || 'User',
                src_2 = String(contact?.avatarUrl || contact?.avatar || '').trim();
            if (this.profileName) this.profileName.textContent = textContent_4;
            this.profileAvatarImg &&
                this.profileAvatarIcon &&
                (src_2
                    ? ((this.profileAvatarImg.src = src_2),
                      (this.profileAvatarImg.style.display = 'block'),
                      (this.profileAvatarIcon.style.display = 'none'))
                    : (this.profileAvatarImg.removeAttribute('src'),
                      (this.profileAvatarImg.style.display = 'none'),
                      (this.profileAvatarIcon.style.display = 'flex')));
        }
        ['bindEvents']() {
            this.closeBtn?.addEventListener('click', () => this.close());
            this.foodCloseBtn?.addEventListener('click', () => this.closeDetail());
            this.settingsBtn &&
                this.settingsBtn.addEventListener('click', () => {
                    this.updateBoundWbDisplay();
                    this.settingsSheet?.classList.add('active');
                });
            this.bindWbBtn &&
                this.bindWbBtn.addEventListener('click', () => {
                    if (typeof window.renderWorldBookSelector === 'function')
                        window.renderWorldBookSelector(
                            this.getBoundWorldBookIds(),
                            (selectedIds) => {
                                this.saveBoundWorldBookIds(selectedIds);
                                this.updateBoundWbDisplay();
                            },
                        );
                    else
                        window.wbManager &&
                            window.wbManager.showWorldBookPicker &&
                            window.wbManager.showWorldBookPicker((selectedBook) => {
                                this.saveBoundWorldBookIds(selectedBook ? [selectedBook.id] : []);
                                this.updateBoundWbDisplay();
                            });
                });
            this.clearGeneratedBtn?.addEventListener('click', () => {
                this.clearGeneratedProducts() && this.settingsSheet?.classList.remove('active');
            });
            this.searchBtn &&
                this.searchBtn.addEventListener('click', () => {
                    if (this.searchInput) this.searchInput.value = '';
                    this.searchSheet?.classList.add('active');
                });
            this.searchConfirmBtn &&
                this.searchConfirmBtn.addEventListener('click', () => {
                    this.handleGenerateProducts();
                });
            [this.settingsSheet, this.searchSheet, this.ordersSheet].forEach((element) => {
                element &&
                    element.addEventListener('click', (event) => {
                        if (event.target === element) {
                            element.classList.remove('active');
                            if (element === this.ordersSheet) this.stopOrdersRefresh();
                        }
                    });
            });
            window.addEventListener('user-state-updated', () => this.syncProfile());
            window.addEventListener('avatar-updated', () => this.syncProfile());
            const reviewsTrigger = document.getElementById('shopping-reviews-trigger');
            reviewsTrigger &&
                reviewsTrigger.addEventListener('click', () => {
                    this.currentProduct && this.openAllReviews(this.currentProduct.name, false);
                });
            const foodReviewsTrigger = document.getElementById('shopping-food-reviews-trigger');
            foodReviewsTrigger &&
                foodReviewsTrigger.addEventListener('click', () => {
                    this.currentProduct && this.openAllReviews(this.currentProduct.name, true);
                });
            const shoppingMallQaTriggerElement = document.getElementById(
                'shopping-mall-qa-trigger',
            );
            shoppingMallQaTriggerElement &&
                shoppingMallQaTriggerElement.addEventListener('click', () => {
                    const qaSheet = document.getElementById('shopping-qa-sheet');
                    qaSheet && qaSheet.classList.add('active');
                });
            const shoppingQaSheetElement = document.getElementById('shopping-qa-sheet');
            shoppingQaSheetElement &&
                shoppingQaSheetElement.addEventListener('click', (event_45) => {
                    event_45.target === shoppingQaSheetElement &&
                        shoppingQaSheetElement.classList.remove('active');
                });
            const shoppingAllReviewsSheetElement = document.getElementById(
                'shopping-all-reviews-sheet',
            );
            shoppingAllReviewsSheetElement &&
                shoppingAllReviewsSheetElement.addEventListener('click', (event_46) => {
                    event_46.target === shoppingAllReviewsSheetElement &&
                        shoppingAllReviewsSheetElement.classList.remove('active');
                });
            this.navItems.forEach((item_2) => {
                item_2.addEventListener('click', () => {
                    this.switchTab(item_2.dataset.tab || 'food');
                });
            });
            const handlePanelsWrapScrollend = () => {
                const width_2 = this.panelsWrap.clientWidth || 1,
                    index_4 = Math.round(this.panelsWrap.scrollLeft / width_2),
                    tab_2 = this.tabs[Math.max(0, Math.min(this.tabs.length - 1, index_4))];
                this.switchTab(tab_2, {
                    scroll: false,
                });
            };
            'onscrollend' in this.panelsWrap
                ? this.panelsWrap.addEventListener('scrollend', handlePanelsWrapScrollend, {
                      passive: true,
                  })
                : this.panelsWrap.addEventListener(
                      'scroll',
                      () => {
                          window.clearTimeout(this.scrollTimer);
                          this.scrollTimer = window.setTimeout(handlePanelsWrapScrollend, 120);
                      },
                      {
                          passive: true,
                      },
                  );
            window.addEventListener('resize', () => this.updateIndicator());
            this.bindProductClicks();
            this.addToCartBtn &&
                this.addToCartBtn.addEventListener('click', () => {
                    if (this.currentProduct) {
                        this.addToCart(this.currentProduct);
                        this.closeDetail();
                        const originalText = this.addToCartBtn.textContent;
                        this.addToCartBtn.textContent = '已添加!';
                        setTimeout(() => {
                            if (this.addToCartBtn) this.addToCartBtn.textContent = originalText;
                        }, 1000);
                    }
                });
            this.addFoodToCartBtn &&
                this.addFoodToCartBtn.addEventListener('click', () => {
                    if (this.currentProduct) {
                        this.addToCart(this.currentProduct);
                        this.closeDetail();
                        const originalText_2 = this.addFoodToCartBtn.textContent;
                        this.addFoodToCartBtn.textContent = '已添加!';
                        setTimeout(() => {
                            if (this.addFoodToCartBtn)
                                this.addFoodToCartBtn.textContent = originalText_2;
                        }, 1000);
                    }
                });
            this.checkoutBtn &&
                this.checkoutBtn.addEventListener('click', async () => {
                    if (this.cart.length === 0) return;
                    await this.initCheckout();
                    this.checkoutSheet?.classList.add('active');
                });
            this.paySelectBtn &&
                this.paySelectBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const payRadio = document.querySelector(
                        'input[name="shopping-payment-method"][value="pay"]',
                    );
                    if (payRadio) payRadio.checked = true;
                    this.openCardSelection();
                });
            this.friendSelectBtn &&
                this.friendSelectBtn.addEventListener('click', (e_3) => {
                    e_3.preventDefault();
                    e_3.stopPropagation();
                    const friendRadio = document.querySelector(
                        'input[name="shopping-payment-method"][value="friend"]',
                    );
                    if (friendRadio) friendRadio.checked = true;
                    this.openCharSelection();
                });
            this.confirmPaymentBtn &&
                this.confirmPaymentBtn.addEventListener('click', () => {
                    this.processPayment();
                });
            this.ordersBtn &&
                this.ordersBtn.addEventListener('click', () => {
                    this.renderOrders();
                    this.ordersSheet?.classList.add('active');
                    this.startOrdersRefresh();
                });
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) this.stopOrdersRefresh();
                else {
                    if (this.ordersSheet?.classList.contains('active')) this.startOrdersRefresh();
                }
            });
        }
        ['stopOrdersRefresh']() {
            if (this.ordersRefreshTimer) clearTimeout(this.ordersRefreshTimer);
            this.ordersRefreshTimer = null;
        }
        ['startOrdersRefresh']() {
            this.stopOrdersRefresh();
            if (!this.ordersSheet?.classList.contains('active') || document.hidden) return;
            const now_54 = Date.now();
            let value_55 = Infinity;
            this.orders.forEach((message_56) => {
                const max_57 = Math.max(0, now_54 - Number(message_56.timestamp || 0)),
                    result_58 = Array.from(this.ordersList?.children || []).find(
                        (value_59) => value_59.dataset.orderId === String(message_56.id),
                    );
                if (result_58) this.updateOrderProgress(message_56, result_58, max_57);
                if (max_57 < count) value_55 = Math.min(value_55, count - max_57);
                else max_57 < count_3 && (value_55 = Math.min(value_55, count_3 - max_57));
            });
            if (!Number.isFinite(value_55)) return;
            this.ordersRefreshTimer = window.setTimeout(
                () => {
                    this.ordersRefreshTimer = null;
                    this.startOrdersRefresh();
                },
                Math.max(16, Math.ceil(value_55) + 16),
            );
        }
        ['updateOrderProgress'](
            order,
            element_61,
            value_62 = Math.max(0, Date.now() - Number(order.timestamp || 0)),
        ) {
            if (!element_61) return;
            const isFood_2 = order.items.some((i) => i.isFood),
                cColor = isFood_2 ? 'var(--shop-accent, #a97642)' : '#111111',
                fColor = 'var(--shop-green, #476c5a)',
                value_66 = value_62 >= count_3 ? 3 : value_62 >= count ? 2 : 1,
                from_67 = Array.from(element_61.querySelectorAll('.shopping-order-icon-wrap')),
                from_68 = Array.from(element_61.querySelectorAll('.shopping-order-node-text'));
            from_67.forEach((element_71, value_72) => {
                const value_73 = value_72 < value_66,
                    value_74 = value_72 === 2 && value_66 === 3;
                element_71.style.background = value_73 ? (value_74 ? fColor : cColor) : '#f2f2f7';
                element_71.style.animation = 'none';
                const iElement = element_71.querySelector('i');
                if (iElement) iElement.style.color = value_73 ? '#fff' : '#c7c7cc';
                from_68[value_72] &&
                    ((from_68[value_72].style.color = value_73 ? '#111' : '#8e8e93'),
                    (from_68[value_72].style.fontWeight = value_73 ? '700' : '600'));
            });
            const reviewsContainerList = element_61.querySelector('.shopping-order-fill');
            if (!reviewsContainerList) return;
            reviewsContainerList.style.background = value_66 === 3 ? fColor : cColor;
            if (reviewsContainerList.dataset.progressStarted === 'true') return;
            const min_69 = Math.min(1, value_62 / count_3);
            reviewsContainerList.style.transition = 'none';
            reviewsContainerList.style.transform = 'scaleX(' + min_69 + ')';
            reviewsContainerList.dataset.progressStarted = 'true';
            min_69 < 1 &&
                window.requestAnimationFrame(() => {
                    if (!reviewsContainerList.isConnected) return;
                    reviewsContainerList.style.transition =
                        'transform ' +
                        Math.max(0, count_3 - value_62) +
                        'ms linear, background 0.3s ease';
                    reviewsContainerList.style.transform = 'scaleX(1)';
                });
        }
        async ['handleGenerateProducts']() {
            let value_75 = this.searchInput ? this.searchInput.value.trim() : '';
            const targetTab = this.currentTab === 'food' ? 'food' : 'mall';
            !value_75 &&
                (value_75 =
                    targetTab === 'food'
                        ? '随机生成一些高质量的外卖美食和饮品'
                        : '随机生成一些高品质的商城百货和数码日常用品');
            this.searchConfirmBtn &&
                ((this.searchConfirmBtn.innerHTML =
                    '<i class="fas fa-spinner fa-spin"></i> 生成中...'),
                (this.searchConfirmBtn.disabled = true));
            let content_2 =
                `你现在是一个商品、评价及问答生成器。根据用户的输入，生成不少于10个商品。每个商品生成5-10条用户评价，以及5-10条问答(Q&A)。
当前分类是 ` +
                (targetTab === 'food' ? '外卖美食' : '商城百货') +
                `。

**关键要求**：
1. **评价**：必须非常真实、接地气，包含好评、中评甚至差评。语气要幽默、调侃或者夸张（比如：”好吃是好吃，就是吃完对象跑了”、”衣服很仙，但穿上像个成了精的拖把”）。
2. **问答(Q&A)**：这是买家向已经买过的买家提问的板块（类似淘宝的”问大家”）。回答者**绝对不要**像官方客服，而是真实的、充满个性的普通买家。回答可以很搞笑、无厘头、甚至带点互坑的成分（比如 Q：”吃完能变帅吗？” A：”别做梦了，看脸” 或 Q：”好用吗？” A：”买回来积灰挺好的，建议入手”）。



`;
            const boundWorldBookIds_78 = this.getBoundWorldBookIds();
            if (boundWorldBookIds_78.length > 0 && window.wbManager) {
                const bookContexts = [];
                for (const boundId of boundWorldBookIds_78) {
                    const bookCtx = await window.wbManager.getBookContextString(boundId);
                    if (bookCtx) bookContexts.push(bookCtx);
                }
                bookContexts.length > 0 &&
                    (content_2 +=
                        `[当前挂载的世界书上下文]
` +
                        bookContexts.join(`

`) +
                        `

参考以上世界书设定生成契合世界观的商品，评价和问答也可以带入世界观中的梗。

`);
            }
            content_2 += `输出必须为纯 JSON 数组格式，不要任何多余文本或 markdown 标签。格式要求：

[
  {
    "name": "商品名称",
    "price": "商品价格(包含¥符号，如¥45)",
    "desc": "商品简短描述",
    "iconClass": "fontawesome图标类名(例如 fa-burger)",
    "bgGrad": "CSS渐变背景(例如 linear-gradient(135deg, #f093fb 0%, #f5576c 100%))",
    "tags": ["标签1", "标签2"],
    "reviews": [
      { "user": "用户A", "text": "评价内容", "rating": 5 },
      { "user": "用户B", "text": "评价内容", "rating": 4 }
    ],
    "qa": [
      { "q": "问题内容1", "a": "回答内容1" },
      { "q": "问题内容2", "a": "回答内容2" }
    ]
  }
]`;
            try {
                const apiConfig_2 =
                    typeof window.getApiConfig === 'function'
                        ? window.getApiConfig()
                        : window.apiConfig || {};
                if (!apiConfig_2 || !apiConfig_2.endpoint || !apiConfig_2.apiKey)
                    throw new Error('请先在系统设置中配置 API');
                const endpoint_2 = window.u2Api.resolveChatCompletionsEndpoint(
                        apiConfig_2.endpoint,
                    ),
                    value_83 = await fetch(endpoint_2, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + apiConfig_2.apiKey,
                        },
                        body: JSON.stringify({
                            model: apiConfig_2.model || 'gpt-3.5-turbo',
                            messages: [
                                {
                                    role: 'system',
                                    content: content_2,
                                },
                                {
                                    role: 'user',
                                    content: value_75,
                                },
                            ],
                            temperature: parseFloat(apiConfig_2.temperature) || 0.8,
                        }),
                    });
                if (!value_83.ok) {
                    const value_89 = await window.u2Api?.readApiError?.(value_83);
                    throw (
                        window.u2Api?.createHttpError?.(value_83, value_89) ||
                        Object.assign(new Error('API 请求失败: HTTP ' + value_83.status), {
                            status: value_83.status,
                        })
                    );
                }
                const data = await value_83.json(),
                    choice = data.choices && data.choices[0],
                    responseText = choice && choice.message ? choice.message.content : '';
                let jsonText = responseText || '';
                jsonText.startsWith('```') &&
                    (jsonText = jsonText
                        .replace(/```json/g, '')
                        .replace(/```/g, '')
                        .trim());
                let productsData = null;
                try {
                    productsData = JSON.parse(jsonText);
                } catch (value_90) {
                    const startIdx = jsonText.indexOf('['),
                        endIdx = jsonText.lastIndexOf(']');
                    if (startIdx !== -1 && endIdx !== -1)
                        productsData = JSON.parse(jsonText.substring(startIdx, endIdx + 1));
                    else throw new Error('JSON 解析失败');
                }
                if (!Array.isArray(productsData) || productsData.length === 0)
                    throw new Error('生成数据为空');
                this.injectGeneratedProducts(productsData, targetTab);
                if (this.searchSheet) this.searchSheet.classList.remove('active');
                if (this.searchInput) this.searchInput.value = '';
            } catch (e_4) {
                console.error('Generate error:', e_4);
                (!window.u2Api?.isRequestError?.(e_4) ||
                    !window.u2Api.reportError(e_4, {
                        operation: '商品生成',
                    })) &&
                    (window.showToast
                        ? window.showToast('生成失败: ' + e_4.message)
                        : alert('生成失败: ' + e_4.message));
            } finally {
                this.searchConfirmBtn &&
                    ((this.searchConfirmBtn.innerHTML = '<i class="fas fa-magic"></i> 确认生成'),
                    (this.searchConfirmBtn.disabled = false));
            }
        }
        ['renderProductCards'](items_94, targetTab_2) {
            let container = null;
            if (targetTab_2 === 'food') container = this.foodListContainer;
            if (targetTab_2 === 'mall') container = this.productListContainer;
            if (!container) return;
            items_94.forEach((value_97) => {
                const article = document.createElement('article');
                article.dataset.shoppingGenerated = 'true';
                const toFixed_99 = (Math.random() * 1 + 4).toFixed(1);
                if (targetTab_2 === 'food') {
                    article.className = 'shopping-food-card';
                    let join_100 = (value_97.tags || ['30 min', toFixed_99])
                        .map((value_101) => '<span>' + value_101 + '</span>')
                        .join('');
                    article.innerHTML =
                        `
                        <div class="shopping-food-media" style="background: ` +
                        (value_97.bgGrad || '#f2f2f7') +
                        '"><i class="fas ' +
                        (value_97.iconClass || 'fa-utensils') +
                        `"></i></div>
                        <div class="shopping-food-copy">
                            <div class="shopping-card-topline"><strong>` +
                        value_97.name +
                        '</strong><span>' +
                        value_97.price +
                        `</span></div>
                            <p>` +
                        value_97.desc +
                        `</p>
                            <div class="shopping-tags">` +
                        join_100 +
                        `</div>
                        </div>
                    `;
                } else {
                    article.className = 'shopping-product-card';
                    article.innerHTML =
                        `
                        <div class="shopping-product-media" style="background: ` +
                        (value_97.bgGrad || '#f2f2f7') +
                        '"><i class="fas ' +
                        (value_97.iconClass || 'fa-box') +
                        `"></i></div>
                        <strong>` +
                        value_97.name +
                        `</strong>
                        <span>` +
                        value_97.price +
                        `</span>
                        <span style="display:none;">` +
                        value_97.desc +
                        `</span> <!-- Hidden desc to pass to openDetail -->
                    `;
                }
                container.appendChild(article);
            });
            this.bindProductClicks();
        }
        ['injectGeneratedProducts'](productsData_2, targetTab_3) {
            this.renderProductCards(productsData_2, targetTab_3);
            try {
                const key =
                    targetTab_3 === 'food' ? 'shopping_generated_food' : 'shopping_generated_mall';
                let saved = [];
                const stored = durableStorage.getItem(key);
                if (stored) saved = JSON.parse(stored);
                saved = saved.concat(productsData_2);
                durableStorage.setItem(key, JSON.stringify(saved));
            } catch (value_108) {}
            let commentsObj = {};
            try {
                const item_109 = durableStorage.getItem('shopping_comments');
                if (item_109) commentsObj = JSON.parse(item_109);
            } catch (value_110) {}
            let qaObj = {};
            try {
                const item_111 = durableStorage.getItem('shopping_qa');
                if (item_111) qaObj = JSON.parse(item_111);
            } catch (value_112) {}
            productsData_2.forEach((p) => {
                if (p.reviews && Array.isArray(p.reviews)) {
                    const datedReviews = p.reviews.map((r) => ({
                        ...r,
                        date: r.date || new Date().toLocaleDateString(),
                    }));
                    commentsObj[p.name]
                        ? (commentsObj[p.name] = [...datedReviews, ...commentsObj[p.name]])
                        : (commentsObj[p.name] = datedReviews);
                }
                p.qa &&
                    Array.isArray(p.qa) &&
                    (qaObj[p.name]
                        ? (qaObj[p.name] = [...p.qa, ...qaObj[p.name]])
                        : (qaObj[p.name] = p.qa));
            });
            durableStorage.setItem('shopping_comments', JSON.stringify(commentsObj));
            durableStorage.setItem('shopping_qa', JSON.stringify(qaObj));
        }
        ['bindProductClicks']() {
            const products = this.view.querySelectorAll(
                '.shopping-food-card, .shopping-product-card',
            );
            products.forEach((product_2) => {
                if (product_2.hasAttribute('data-bound')) return;
                product_2.setAttribute('data-bound', 'true');
                product_2.style.cursor = 'pointer';
                product_2.addEventListener('click', () => {
                    let name_2,
                        price_2,
                        desc_2,
                        iconHtml_2,
                        mediaBg_2,
                        isFood_3 = false;
                    if (product_2.classList.contains('shopping-food-card')) {
                        isFood_3 = true;
                        name_2 = product_2.querySelector('strong')?.textContent || 'Food Item';
                        price_2 =
                            product_2.querySelector('.shopping-card-topline span')?.textContent ||
                            '¥0';
                        desc_2 = product_2.querySelector('p')?.textContent || '';
                        iconHtml_2 =
                            product_2.querySelector('.shopping-food-media')?.innerHTML || '';
                        mediaBg_2 =
                            product_2.querySelector('.shopping-food-media').style.background ||
                            window.getComputedStyle(product_2.querySelector('.shopping-food-media'))
                                .background;
                    } else {
                        name_2 = product_2.querySelector('strong')?.textContent || 'Product';
                        price_2 =
                            product_2.querySelector('span')?.textContent.split('·')[0].trim() ||
                            '¥0';
                        const spans = product_2.querySelectorAll('span');
                        desc_2 = spans.length > 1 ? spans[1].textContent : '';
                        iconHtml_2 =
                            product_2.querySelector('.shopping-product-media')?.innerHTML || '';
                        mediaBg_2 =
                            product_2.querySelector('.shopping-product-media').style.background ||
                            window.getComputedStyle(
                                product_2.querySelector('.shopping-product-media'),
                            ).background;
                    }
                    this.openDetail(
                        {
                            name: name_2,
                            price: price_2,
                            desc: desc_2,
                            iconHtml: iconHtml_2,
                            mediaBg: mediaBg_2,
                        },
                        isFood_3,
                    );
                });
            });
        }
        async ['openGiftCharSelection'](order_2, id_7) {
            if (!this.charSelectionModal || !this.charList) return;
            const textContent_2 = this.charSelectionModal.querySelector(
                '.wb-centered-modal-title',
            ).textContent;
            this.charSelectionModal.querySelector('.wb-centered-modal-title').textContent =
                '选择赠送的好友';
            this.charList.innerHTML = '';
            let items_123 = [];
            if (window.imStorage && window.imStorage.loadFriends)
                try {
                    const allFriends = await window.imStorage.loadFriends();
                    items_123 = allFriends;
                } catch (value_126) {}
            items_123.length === 0
                ? (this.charList.innerHTML =
                      '<div style="text-align: center; padding: 20px; color: #73706a;">暂无好友</div>')
                : items_123.forEach((friend) => {
                      const element_128 = document.createElement('div');
                      element_128.style.cssText =
                          'background: rgba(255, 255, 255, 0.82); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border: 1px solid rgba(17,17,17,0.09); ';
                      const value_129 = friend.name || friend.nickname || 'Unknown Char';
                      let text_130 =
                          '<div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(17,17,17,0.06); display: flex; justify-content: center; align-items: center; color: #73706a;"><i class="fas fa-user"></i></div>';
                      const value_131 = friend.avatarUrl || friend.avatar;
                      value_131 &&
                          (text_130 =
                              '<img src="' +
                              value_131 +
                              '" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(17,17,17,0.09);">');
                      element_128.innerHTML =
                          `
                        <div style="display: flex; align-items: center; gap: 12px;">
                            ` +
                          text_130 +
                          `
                            <div style="display: flex; flex-direction: column;">
                                <div style="font-size: 15px; font-weight: 700; color: #111;">` +
                          value_129 +
                          `</div>
                                <div style="font-size: 13px; color: #73706a; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">` +
                          (friend.signature || '') +
                          `</div>
                            </div>
                        </div>
                        <div style="background: #111; color: #fff; padding: 6px 12px; border-radius: 16px; font-size: 13px; font-weight: 600;">赠送</div>
                    `;
                      element_128.addEventListener('click', async () => {
                          if (this.giftOrdersInFlight.has(String(order_2.id))) return;
                          const success = await this.sendGiftMessage(friend, order_2);
                          if (success) {
                              const result_133 = this.orders.find(
                                  (book_2) => String(book_2.id) === String(id_7),
                              );
                              result_133 &&
                                  ((result_133.gifted = true),
                                  (result_133.giftedAt = Date.now()),
                                  (result_133.giftedToFriendId = String(friend.id)),
                                  (result_133.giftedToName =
                                      friend.name || friend.nickname || 'Unknown Char'),
                                  this.saveOrders(),
                                  this.renderOrders());
                          }
                          this.charSelectionModal.style.display = 'none';
                          this.charSelectionModal.classList.remove('active');
                          this.charSelectionModal.querySelector(
                              '.wb-centered-modal-title',
                          ).textContent = textContent_2;
                      });
                      this.charList.appendChild(element_128);
                  });
            const closeBtn_2 = this.charSelectionModal.querySelector('.wb-centered-modal-close'),
                newCloseBtn = closeBtn_2.cloneNode(true);
            closeBtn_2.parentNode.replaceChild(newCloseBtn, closeBtn_2);
            newCloseBtn.addEventListener('click', () => {
                this.charSelectionModal.style.display = 'none';
                this.charSelectionModal.classList.remove('active');
                this.charSelectionModal.querySelector('.wb-centered-modal-title').textContent =
                    textContent_2;
            });
            this.charSelectionModal.style.display = 'flex';
            requestAnimationFrame(() => {
                this.charSelectionModal.classList.add('active');
            });
        }
        async ['sendGiftMessage'](friend_2, value_136) {
            const orderId_2 = String(value_136?.id || '');
            if (!orderId_2 || this.giftOrdersInFlight.has(orderId_2)) return false;
            this.giftOrdersInFlight.add(orderId_2);
            const value_137 = value_136.items?.[0] || {},
                itemName_2 = String(value_137.name || '商品'),
                price_3 = Number(value_136.itemTotal ?? value_137.priceVal ?? value_136.total) || 0,
                text_3 =
                    `[赠送礼物]
商品: ` +
                    itemName_2 +
                    `
价值: ¥` +
                    price_3.toFixed(2) +
                    `
付款方式: ` +
                    value_136.method,
                handleAction_6_141 = handleAction_6(itemName_2),
                handleAction_6_142 = handleAction_6(value_136.method || 'Pay'),
                content_3 =
                    `
                <div style="background: #fff0f3; border-radius: 16px; padding: 16px; min-width: 220px; max-width: 280px; color: #111111; border: 1px solid rgba(255,155,179,0.3); display: inline-block;">
                    <div style="font-size: 12px; color: #ff9bb3; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; font-weight: 700;">
                        <i class="fas fa-gift"></i> 收到礼物
                    </div>
                    <div style="font-size: 15px; font-weight: 700; margin-bottom: 6px; white-space: normal; word-break: break-word; line-height: 1.4;">` +
                    handleAction_6_141 +
                    `</div>
                    <div style="font-size: 13px; color: #73706a; margin-top: 8px;">价值 ¥` +
                    price_3.toFixed(2) +
                    `</div>
                    <div style="font-size: 12px; color: #8e8e93; margin-top: 4px;">由 ` +
                    handleAction_6_142 +
                    ` 支付</div>
                </div>
            `;
            let enabled_144 = false;
            try {
                if (window.imApp && window.imApp.appendFriendMessage) {
                    window.imApp.ensureFriendMessagesLoaded &&
                        (await window.imApp.ensureFriendMessagesLoaded(friend_2.id));
                    const aiMsg = {
                        role: 'user',
                        type: 'html',
                        text: text_3,
                        content: content_3,
                        shopGift: {
                            orderId: orderId_2,
                            itemName: itemName_2,
                            price: price_3,
                            paymentMethod: String(value_136.method || 'Pay'),
                        },
                        timestamp: Date.now(),
                    };
                    enabled_144 = await window.imApp.appendFriendMessage(friend_2.id, aiMsg, {
                        silent: true,
                    });
                    let value_146 = null;
                    enabled_144 &&
                        window.imData &&
                        window.imData.currentActiveFriend &&
                        String(window.imData.currentActiveFriend.id) === String(friend_2.id) &&
                        ((value_146 = document.querySelector(
                            '.active-chat-interface .ins-chat-messages',
                        )),
                        value_146 &&
                            window.imChat &&
                            window.imChat.appendMessageToContainer &&
                            window.imChat.appendMessageToContainer(
                                window.imData.currentActiveFriend,
                                value_146,
                                aiMsg,
                            ));
                    if (enabled_144 && window.imChat?.handleAiReply) {
                        const value_147 =
                            (window.imData?.friends || []).find(
                                (value_148) => String(value_148.id) === String(friend_2.id),
                            ) || friend_2;
                        value_146 =
                            document
                                .getElementById('chat-interface-' + friend_2.id)
                                ?.querySelector('.ins-chat-messages') || value_146;
                        void window.imChat.handleAiReply(value_147, value_146, null, {
                            source: 'shop_gift',
                            silent: true,
                            extraSystemPrompt:
                                'User 刚刚赠送了礼物“' +
                                itemName_2 +
                                '”（价值 ¥' +
                                price_3.toFixed(2) +
                                '）。请以 Char 身份结合人设和关系自然回应这份礼物。',
                        });
                    }
                }
            } catch (e_5) {
                console.error('Failed to append gift message:', e_5);
            } finally {
                this.giftOrdersInFlight['delete'](orderId_2);
            }
            if (window.showToast) window.showToast(enabled_144 ? '赠送成功' : '赠送失败');
            else alert(enabled_144 ? '赠送成功' : '赠送失败');
            return enabled_144;
        }
        ['loadOrders']() {
            try {
                const saved_2 = durableStorage.getItem('shopping_orders');
                if (saved_2) {
                    const result_151 = JSON.parse(saved_2),
                        orders_152 = this.normalizeOrders(result_151);
                    return (
                        JSON.stringify(result_151) !== JSON.stringify(orders_152) &&
                            durableStorage.setItem('shopping_orders', JSON.stringify(orders_152)),
                        orders_152
                    );
                }
            } catch (value_153) {}
            return [];
        }
        ['normalizeOrders'](items_154) {
            if (!Array.isArray(items_154)) return [];
            const items_155 = [];
            return (
                items_154.forEach((message_156) => {
                    if (!message_156 || typeof message_156 !== 'object') return;
                    const items_157 = Array.isArray(message_156.items) ? message_156.items : [],
                        batchId_2 = String(
                            message_156.batchId || message_156.id || handleAction_5('checkout'),
                        ),
                        timestamp_2 = Number(message_156.timestamp || message_156.id) || Date.now();
                    items_157.forEach((value_160, value_161) => {
                        if (!value_160 || typeof value_160 !== 'object') return;
                        const handleAction_4_162 = handleAction_4(
                                value_160.price || value_160.priceVal,
                            ),
                            options_163 = {
                                ...value_160,
                                priceVal: handleAction_4_162,
                            },
                            value_164 = items_157.length === 1;
                        items_155.push({
                            ...message_156,
                            id: value_164
                                ? String(message_156.id || batchId_2 + '-item-1')
                                : batchId_2 + '-item-' + (value_161 + 1),
                            batchId: batchId_2,
                            timestamp: timestamp_2,
                            items: [options_163],
                            itemTotal: handleAction_4_162,
                            total: handleAction_4_162,
                            legacyPaidTotal:
                                message_156.legacyPaidTotal ??
                                (items_157.length > 1
                                    ? Number(message_156.total) || null
                                    : undefined),
                        });
                    });
                }),
                items_155
            );
        }
        ['createOrdersFromCart'](method_3, status_2 = '已付款') {
            const batchId_3 = handleAction_5('checkout'),
                timestamp_3 = Date.now();
            return this.cart.map((value_169, value_170) => {
                const options_171 = {
                    ...value_169,
                    priceVal: handleAction_4(value_169.price || value_169.priceVal),
                };
                return {
                    id: batchId_3 + '-item-' + (value_170 + 1),
                    batchId: batchId_3,
                    timestamp: timestamp_3,
                    date: new Date(timestamp_3).toLocaleString(),
                    items: [options_171],
                    itemTotal: options_171.priceVal,
                    total: options_171.priceVal,
                    status: status_2,
                    method: method_3,
                };
            });
        }
        ['saveOrders']() {
            durableStorage.setItem('shopping_orders', JSON.stringify(this.orders));
        }
        async ['initCheckout']() {
            let items_172 = [];
            typeof window.getPayCards === 'function' && (items_172 = window.getPayCards());
            (!items_172 || items_172.length === 0) &&
                (items_172 = [
                    {
                        id: 'card1',
                        name: '招商银行储蓄卡',
                        number: '**** **** **** 8888',
                        icon: 'fa-university',
                    },
                    {
                        id: 'card2',
                        name: '工商银行信用卡',
                        number: '**** **** **** 1234',
                        icon: 'fa-credit-card',
                    },
                ]);
            let friends_2 = [];
            if (window.imStorage && window.imStorage.loadFriends)
                try {
                    friends_2 = await window.imStorage.loadFriends();
                } catch (value_174) {}
            !this.selectedCard && items_172.length > 0 && (this.selectedCard = items_172[0]);
            friends_2.length > 0
                ? (!this.selectedFriend ||
                      !friends_2.find((f) => String(f.id) === String(this.selectedFriend.id))) &&
                  (this.selectedFriend = friends_2[0])
                : (this.selectedFriend = null);
            this.payDesc &&
                this.selectedCard &&
                (this.payDesc.textContent =
                    this.selectedCard.name + ' (' + this.selectedCard.number.slice(-4) + ')');
            this.friendDesc &&
                (this.friendDesc.textContent = this.selectedFriend
                    ? this.selectedFriend.name || this.selectedFriend.nickname || 'Unknown Char'
                    : '选择好友');
        }
        async ['openCardSelection']() {
            if (!this.cardSelectionModal || !this.cardList) return;
            this.cardList.innerHTML = '';
            let items_175 = [],
                balance_2 = 0;
            typeof window.getPayCards === 'function' && (items_175 = window.getPayCards());
            typeof window.getPayBalance === 'function' && (balance_2 = window.getPayBalance());
            (!items_175 || items_175.length === 0) &&
                (items_175 = [
                    {
                        id: 'card1',
                        name: '招商银行储蓄卡',
                        number: '**** **** **** 8888',
                        icon: 'fa-university',
                    },
                    {
                        id: 'card2',
                        name: '工商银行信用卡',
                        number: '**** **** **** 1234',
                        icon: 'fa-credit-card',
                    },
                ]);
            this.cardBalance && (this.cardBalance.textContent = '¥' + balance_2.toFixed(2));
            items_175.forEach((selectedCard_2) => {
                const element_178 = document.createElement('div');
                element_178.style.cssText =
                    'background: rgba(255, 255, 255, 0.82); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border: 1px solid rgba(17,17,17,0.09); ';
                const isSelected =
                    this.selectedCard && String(this.selectedCard.id) === String(selectedCard_2.id);
                element_178.innerHTML =
                    `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(17,17,17,0.06); display: flex; justify-content: center; align-items: center; color: #111;">
                            <i class="fas ` +
                    (selectedCard_2.icon || 'fa-credit-card') +
                    `"></i>
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <div style="font-size: 15px; font-weight: 700; color: #111;">` +
                    selectedCard_2.name +
                    `</div>
                            <div style="font-size: 13px; color: #73706a; font-family: monospace;">` +
                    selectedCard_2.number +
                    `</div>
                        </div>
                    </div>
                    ` +
                    (isSelected
                        ? '<i class="fas fa-check-circle" style="color: #111113; font-size: 20px;"></i>'
                        : '<div style="width: 20px; height: 20px; border-radius: 50%; border: 1px solid rgba(17,17,17,0.15);"></div>') +
                    `
                `;
                element_178.addEventListener('click', () => {
                    this.selectedCard = selectedCard_2;
                    this.payDesc &&
                        (this.payDesc.textContent =
                            this.selectedCard.name +
                            ' (' +
                            this.selectedCard.number.slice(-4) +
                            ')');
                    this.cardSelectionModal.style.display = 'none';
                    this.cardSelectionModal.classList.remove('active');
                });
                this.cardList.appendChild(element_178);
            });
            this.cardSelectionModal.style.display = 'flex';
            requestAnimationFrame(() => {
                this.cardSelectionModal.classList.add('active');
            });
        }
        async ['openCharSelection']() {
            if (!this.charSelectionModal || !this.charList) return;
            this.charList.innerHTML = '';
            let items_180 = [];
            if (window.imStorage && window.imStorage.loadFriends)
                try {
                    items_180 = await window.imStorage.loadFriends();
                } catch (value_181) {}
            items_180.length === 0
                ? (this.charList.innerHTML =
                      '<div style="text-align: center; padding: 20px; color: #73706a;">暂无好友</div>')
                : items_180.forEach((selectedFriend_2) => {
                      const element_183 = document.createElement('div');
                      element_183.style.cssText =
                          'background: rgba(255, 255, 255, 0.82); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border: 1px solid rgba(17,17,17,0.09); ';
                      const isSelected_2 =
                              this.selectedFriend &&
                              String(this.selectedFriend.id) === String(selectedFriend_2.id),
                          textContent_3 =
                              selectedFriend_2.name || selectedFriend_2.nickname || 'Unknown Char';
                      let text_186 =
                          '<div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(17,17,17,0.06); display: flex; justify-content: center; align-items: center; color: #73706a;"><i class="fas fa-user"></i></div>';
                      const value_187 = selectedFriend_2.avatarUrl || selectedFriend_2.avatar;
                      value_187 &&
                          (text_186 =
                              '<img src="' +
                              value_187 +
                              '" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(17,17,17,0.09);">');
                      element_183.innerHTML =
                          `
                        <div style="display: flex; align-items: center; gap: 12px;">
                            ` +
                          text_186 +
                          `
                            <div style="display: flex; flex-direction: column;">
                                <div style="font-size: 15px; font-weight: 700; color: #111;">` +
                          textContent_3 +
                          `</div>
                                <div style="font-size: 13px; color: #73706a; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">` +
                          (selectedFriend_2.signature || '') +
                          `</div>
                            </div>
                        </div>
                        ` +
                          (isSelected_2
                              ? '<i class="fas fa-check-circle" style="color: #111113; font-size: 20px;"></i>'
                              : '<div style="width: 20px; height: 20px; border-radius: 50%; border: 1px solid rgba(17,17,17,0.15);"></div>') +
                          `
                    `;
                      element_183.addEventListener('click', () => {
                          this.selectedFriend = selectedFriend_2;
                          this.friendDesc && (this.friendDesc.textContent = textContent_3);
                          this.charSelectionModal.style.display = 'none';
                          this.charSelectionModal.classList.remove('active');
                      });
                      this.charList.appendChild(element_183);
                  });
            this.charSelectionModal.style.display = 'flex';
            requestAnimationFrame(() => {
                this.charSelectionModal.classList.add('active');
            });
        }
        async ['processPayment']() {
            const method_2 = document.querySelector(
                'input[name="shopping-payment-method"]:checked',
            )?.value;
            let subtotal = 0;
            this.cart.forEach((item_3) => (subtotal += item_3.priceVal));
            const total_2 = subtotal,
                itemNames = this.cart.map((item_4) => item_4.name).join(', ');
            if (method_2 === 'pay') {
                if (!this.selectedCard) {
                    window.showToast ? window.showToast('请选择支付卡片') : alert('请选择支付卡片');
                    return;
                }
                const cardBalance_2 =
                    this.selectedCard.balance !== undefined
                        ? this.selectedCard.balance
                        : typeof window.getPayBalance === 'function'
                          ? window.getPayBalance()
                          : 0;
                if (cardBalance_2 >= total_2) {
                    let paymentSuccess = true;
                    typeof window.addPayTransaction === 'function' &&
                        (paymentSuccess = window.addPayTransaction(
                            total_2,
                            '购物消费',
                            'expense',
                            this.selectedCard.id,
                        ));
                    if (paymentSuccess) {
                        const value_195 =
                            this.selectedCard.type === 'family'
                                ? '亲属卡 (' + this.selectedCard.name + ')'
                                : 'Pay';
                        this.orders.unshift(...this.createOrdersFromCart(value_195));
                        this.saveOrders();
                        this.cart = [];
                        this.saveCart();
                        this.renderCart();
                        this.checkoutSheet?.classList.remove('active');
                        window.showToast ? window.showToast('支付成功') : alert('支付成功');
                    } else window.showToast ? window.showToast('支付失败') : alert('支付失败');
                } else window.showToast ? window.showToast('余额不足') : alert('余额不足');
            } else {
                if (method_2 === 'friend') {
                    if (!this.selectedFriend) {
                        window.showToast
                            ? window.showToast('请选择代付好友')
                            : alert('请选择代付好友');
                        return;
                    }
                    const friendName =
                            this.selectedFriend.name ||
                            this.selectedFriend.nickname ||
                            'Unknown Char',
                        text_4 =
                            `[代付请求]
商品: ` +
                            itemNames +
                            `
总价: ¥` +
                            total_2.toFixed(2),
                        content_4 =
                            `
                    <div style="background: #f7f7f5; border-radius: 16px; padding: 16px; min-width: 220px; max-width: 280px; color: #111111;  border: 1px solid rgba(17,17,17,0.09); display: inline-block;">
                        <div style="font-size: 12px; color: #73706a; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; font-weight: 700;">
                            <i class="fas fa-bag-shopping" style="color: #a97642;"></i> Shop Request
                        </div>
                        <div style="font-size: 15px; font-weight: 700; margin-bottom: 6px; white-space: normal; word-break: break-word; line-height: 1.4;">` +
                            itemNames +
                            `</div>
                        <div style="font-size: 24px; font-weight: 800; color: #111111; margin-top: 14px; margin-bottom: 16px;">¥` +
                            total_2.toFixed(2) +
                            `</div>
                        <div style="background: #a97642; color: #ffffff; text-align: center; padding: 10px 0; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;">Pay Now</div>
                    </div>
                `;
                    let success_2 = false;
                    if (window.imApp && window.imApp.appendFriendMessage)
                        try {
                            window.imApp.ensureFriendMessagesLoaded &&
                                (await window.imApp.ensureFriendMessagesLoaded(
                                    this.selectedFriend.id,
                                ));
                            const newMsg = {
                                role: 'user',
                                type: 'html',
                                text: text_4,
                                content: content_4,
                                timestamp: Date.now(),
                            };
                            success_2 = await window.imApp.appendFriendMessage(
                                this.selectedFriend.id,
                                newMsg,
                                {
                                    silent: true,
                                },
                            );
                            if (
                                success_2 &&
                                window.imData &&
                                window.imData.currentActiveFriend &&
                                String(window.imData.currentActiveFriend.id) ===
                                    String(this.selectedFriend.id)
                            ) {
                                const activeChatInterfaceInsChatMessagesElement =
                                    document.querySelector(
                                        '.active-chat-interface .ins-chat-messages',
                                    );
                                activeChatInterfaceInsChatMessagesElement &&
                                    window.imChat &&
                                    window.imChat.appendMessageToContainer &&
                                    window.imChat.appendMessageToContainer(
                                        window.imData.currentActiveFriend,
                                        activeChatInterfaceInsChatMessagesElement,
                                        newMsg,
                                    );
                            }
                        } catch (e_6) {
                            console.error('Failed to append shop request message:', e_6);
                        }
                    success_2
                        ? (this.orders.unshift(
                              ...this.createOrdersFromCart(
                                  '代付 (' + friendName + ')',
                                  '代付请求已发送',
                              ),
                          ),
                          this.saveOrders(),
                          (this.cart = []),
                          this.saveCart(),
                          this.renderCart(),
                          this.checkoutSheet?.classList.remove('active'),
                          window.showToast
                              ? window.showToast('代付请求已发送')
                              : alert('代付请求已发送'))
                        : window.showToast
                          ? window.showToast('无法发送代付请求')
                          : alert('无法发送代付请求');
                }
            }
        }
        ['renderOrders']() {
            if (!this.ordersList) return;
            this.ordersList.innerHTML = '';
            if (this.orders.length === 0) {
                this.ordersList.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; color: #8e8e93;">
                        <i class="fas fa-receipt" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                        <div style="font-size: 15px;">暂无订单记录</div>
                    </div>
                `;
                return;
            }
            this.orders.forEach((order_3, value_203) => {
                const el = document.createElement('div'),
                    value_205 = order_3.items[0],
                    value_206 = value_205?.name || '商品',
                    ts = order_3.timestamp || order_3.id,
                    max_208 = Math.max(0, Date.now() - Number(ts || 0)),
                    isFood_4 = Boolean(value_205?.isFood),
                    step1Text = isFood_4 ? '已取餐' : '已发货',
                    step2Text = isFood_4 ? '送餐中' : '运输中',
                    text_211 = '已送达',
                    value_212 = value_203 * 0.1;
                el.className = 'shopping-order-card';
                el.style.cssText = 'animation-delay: ' + value_212 + 's;';
                el.dataset.orderId = String(order_3.id);
                el.innerHTML =
                    `
                    <div class="shopping-order-header">
                        <div class="shopping-order-date">` +
                    order_3.date +
                    `</div>
                        <button class="shopping-order-delete-btn shopping-order-delete" data-index="` +
                    value_203 +
                    `">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="shopping-order-progress">
                        <div class="shopping-order-track"></div>
                        <div class="shopping-order-fill"></div>
                        
                        <div class="shopping-order-nodes">
                            <!-- Node 1 -->
                            <div class="shopping-order-node">
                                <div class="shopping-order-icon-wrap">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="shopping-order-node-text">` +
                    step1Text +
                    `</div>
                            </div>
                            <!-- Node 2 -->
                            <div class="shopping-order-node">
                                <div class="shopping-order-icon-wrap">
                                    <i class="fas fa-motorcycle"></i>
                                </div>
                                <div class="shopping-order-node-text">` +
                    step2Text +
                    `</div>
                            </div>
                            <!-- Node 3 -->
                            <div class="shopping-order-node">
                                <div class="shopping-order-icon-wrap">
                                    <i class="fas fa-home"></i>
                                </div>
                                <div class="shopping-order-node-text">` +
                    text_211 +
                    `</div>
                            </div>
                        </div>
                    </div>

                    <div class="shopping-order-item-inline-wrap">
                        <div class="shopping-order-items-scroll inline-mode">
                            <div class="shopping-order-item-media" style="background: ` +
                    (value_205?.mediaBg || '#f2f2f7') +
                    `;">
                                ` +
                    (value_205?.iconHtml || '<i class="fas fa-box"></i>') +
                    `
                            </div>
                        </div>
                        <div class="shopping-order-title inline-mode">` +
                    value_206 +
                    `</div>
                    </div>
                    
                    <div class="shopping-order-footer">
                        <div class="shopping-order-method">` +
                    order_3.method +
                    `</div>
                        <div class="shopping-order-price-wrap">
                            <button class="shopping-order-gift-btn" data-order-id="` +
                    order_3.id +
                    `" style="margin-right: 8px; background: #ff9bb3; color: #fff; border: none; border-radius: 12px; padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer;">赠送</button>
                            <button class="shopping-order-comment-btn" data-product="` +
                    (order_3.items.length > 0 ? order_3.items[0].name : '') +
                    `">评价商品</button>
                            <div class="shopping-order-price">¥` +
                    Number(order_3.itemTotal ?? order_3.total ?? 0).toFixed(2) +
                    `</div>
                        </div>
                    </div>
                `;
                this.updateOrderProgress(order_3, el, max_208);
                const giftBtn = el.querySelector('.shopping-order-gift-btn');
                giftBtn &&
                    (order_3.gifted
                        ? ((giftBtn.textContent = order_3.giftedToName
                              ? '已赠给 ' + order_3.giftedToName
                              : '已赠送'),
                          (giftBtn.style.background = '#e5e5ea'),
                          (giftBtn.style.color = '#8e8e93'),
                          (giftBtn.style.cursor = 'default'))
                        : giftBtn.addEventListener('click', (event_213) => {
                              event_213.stopPropagation();
                              const id_214 = giftBtn.dataset.orderId,
                                  orderToGift = this.orders.find(
                                      (book_3) => String(book_3.id) === String(id_214),
                                  );
                              if (orderToGift) this.openGiftCharSelection(orderToGift, id_214);
                          }));
                const deleteBtn = el.querySelector('.shopping-order-delete-btn');
                deleteBtn &&
                    deleteBtn.addEventListener('click', (e_7) => {
                        e_7.stopPropagation();
                        const idx = parseInt(deleteBtn.dataset.index, 10);
                        this.orders.splice(idx, 1);
                        this.saveOrders();
                        this.renderOrders();
                    });
                const commentBtn = el.querySelector('.shopping-order-comment-btn');
                commentBtn &&
                    commentBtn.addEventListener('click', (event_218) => {
                        event_218.stopPropagation();
                        const currentReviewProduct_2 = commentBtn.dataset.product;
                        if (!currentReviewProduct_2) return;
                        this.currentReviewProduct = currentReviewProduct_2;
                        if (!this.ratingSheet) this.initRatingSheet();
                        this.ratingText.value = '';
                        this.ratingStars &&
                            Array.from(this.ratingStars).forEach((s) => {
                                s.className = 'fas fa-star';
                                s.style.color = '#ff9500';
                            });
                        this.ratingSheet.classList.add('active');
                    });
                this.ordersList.appendChild(el);
            });
        }
        ['openDetail'](product_3, isFood_5 = false) {
            product_3.isFood = isFood_5;
            this.currentProduct = product_3;
            if (isFood_5) {
                if (this.foodDetailName) this.foodDetailName.textContent = product_3.name;
                if (this.foodDetailPrice) {
                    const val_2 = product_3.price.replace('¥', '');
                    this.foodDetailPrice.innerHTML =
                        '<span style="font-size: 16px;">¥</span>' + val_2;
                }
                if (this.foodBottomPrice) this.foodBottomPrice.textContent = product_3.price;
                if (this.foodDetailDesc) this.foodDetailDesc.textContent = product_3.desc;
                this.foodDetailMedia &&
                    ((this.foodDetailMedia.innerHTML = product_3.iconHtml),
                    (this.foodDetailMedia.style.background = product_3.mediaBg));
                this.foodDetailSheet && this.foodDetailSheet.classList.add('active');
            } else {
                if (this.detailName) this.detailName.textContent = product_3.name;
                if (this.detailPrice) this.detailPrice.textContent = product_3.price;
                if (this.detailDesc) this.detailDesc.textContent = product_3.desc;
                this.detailMedia &&
                    ((this.detailMedia.innerHTML = product_3.iconHtml),
                    (this.detailMedia.style.background = product_3.mediaBg));
                this.renderQA(product_3.name, false);
                this.detailSheet && this.detailSheet.classList.add('active');
            }
            this.renderComments(product_3.name, isFood_5);
        }
        ['renderQA'](value_223, isFood_6) {
            const qaTrigger = document.getElementById('shopping-mall-qa-trigger'),
                shoppingQaContainerElement = document.getElementById('shopping-qa-container'),
                qaSheetTitle = document.getElementById('shopping-qa-sheet-title');
            if (!shoppingQaContainerElement) return;
            if (isFood_6) {
                if (qaTrigger) qaTrigger.style.display = 'none';
                return;
            } else {
                if (qaTrigger) qaTrigger.style.display = 'block';
            }
            let options_226 = {};
            try {
                const item_228 = durableStorage.getItem('shopping_qa');
                if (item_228) options_226 = JSON.parse(item_228);
            } catch (value_229) {}
            const items_227 = options_226[value_223] || [];
            if (qaSheetTitle) qaSheetTitle.textContent = '问大家 (' + items_227.length + ')';
            if (qaTrigger) {
                qaTrigger.innerHTML =
                    `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <div style="font-size: 16px; font-weight: 700; color: #111;">Q&A (` +
                    items_227.length +
                    `)</div>
                        <div style="font-size: 13px; color: #111; font-weight: 600; display: flex; align-items: center;">See All <i class="fas fa-chevron-right" style="font-size: 10px; margin-left: 4px;"></i></div>
                    </div>
                `;
                if (items_227.length === 0)
                    qaTrigger.innerHTML +=
                        '<div style="font-size: 14px; color: #8e8e93;">暂无问答</div>';
                else {
                    const slice_230 = items_227.slice(0, 2);
                    slice_230.forEach((value_231) => {
                        const randomAnswersCount = Math.floor(Math.random() * 5) + 1;
                        qaTrigger.innerHTML +=
                            `
                            <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
                                <span style="background: #111; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-top: 2px;">Q</span>
                                <div style="flex: 1; font-size: 14px; color: #111; line-height: 1.4;">` +
                            value_231.q +
                            `</div>
                                <div style="font-size: 12px; color: #8e8e93; white-space: nowrap;">` +
                            randomAnswersCount +
                            ` answers</div>
                            </div>
                        `;
                    });
                }
            }
            shoppingQaContainerElement.innerHTML = '';
            items_227.length === 0
                ? (shoppingQaContainerElement.innerHTML =
                      '<div style="text-align: center; color: #8e8e93; font-size: 14px; padding: 20px 0;">暂无问答数据</div>')
                : items_227.forEach((value_233) => {
                      const element_234 = document.createElement('div');
                      element_234.style.cssText =
                          'display: flex; flex-direction: column; gap: 8px; padding-bottom: 12px; border-bottom: 1px solid rgba(17,17,17,0.05);';
                      element_234.innerHTML =
                          `
                        <div style="display: flex; align-items: flex-start; gap: 8px;">
                            <span style="background: #111; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-top: 2px;">Q</span>
                            <div style="font-size: 15px; font-weight: 600; color: #111; line-height: 1.4;">` +
                          value_233.q +
                          `</div>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 8px; margin-top: 4px;">
                            <span style="background: #e5e5ea; color: #8e8e93; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-top: 2px;">A</span>
                            <div style="font-size: 14px; color: #333; line-height: 1.5;">` +
                          value_233.a +
                          `</div>
                        </div>
                    `;
                      shoppingQaContainerElement.appendChild(element_234);
                  });
        }
        ['renderComments'](value_235, isFood_7) {
            const sheet = isFood_7 ? this.foodDetailSheet : this.detailSheet;
            if (!sheet) return;
            const oldContainer = sheet.querySelector(
                isFood_7 ? '#shopping-food-detail-comments' : '#shopping-detail-comments',
            );
            oldContainer && (oldContainer.style.display = 'none');
            let reviewsContainerList_2, titleEl;
            if (isFood_7) {
                const allDivs = sheet.querySelectorAll('div');
                for (let div of allDivs) {
                    if (div.textContent.includes('外卖评价') && div.style.fontSize === '15px') {
                        titleEl = div;
                        reviewsContainerList_2 = div.parentElement.lastElementChild;
                        break;
                    }
                }
            } else {
                const allDivs_2 = sheet.querySelectorAll('div');
                for (let div_2 of allDivs_2) {
                    if (div_2.textContent.includes('Reviews') && div_2.style.fontSize === '16px') {
                        titleEl = div_2;
                        reviewsContainerList_2 = div_2.parentElement.lastElementChild;
                        break;
                    }
                }
            }
            if (!reviewsContainerList_2) return;
            let options_241 = {};
            try {
                const item_246 = durableStorage.getItem('shopping_comments');
                if (item_246) options_241 = JSON.parse(item_246);
            } catch (value_247) {}
            const value_242 = options_241[value_235] || [];
            titleEl &&
                (titleEl.textContent = isFood_7
                    ? '外卖评价 (' + value_242.length + ')'
                    : 'Reviews (' + value_242.length + ')');
            reviewsContainerList_2.innerHTML = '';
            value_242.length === 0 &&
                (reviewsContainerList_2.innerHTML =
                    '<div style="font-size: 14px; color: #8e8e93; text-align: center; padding: 10px 0;">暂无评价</div>');
        }
        ['initRatingSheet']() {
            if (document.getElementById('shopping-rating-sheet')) return;
            const sheetHtml = `
            <div class="bottom-sheet-overlay detail-sheet-overlay" id="shopping-rating-sheet" style="z-index: 1200;">
                <div class="bottom-sheet" style="height: auto; max-height: 70%; padding-bottom: max(20px, env(safe-area-inset-bottom, 0px)); background: #ffffff;">
                    <div class="sheet-handle"></div>
                    <div class="sheet-title" id="shopping-rating-title">商品评价</div>
                    <div class="detail-sheet-content" style="padding: 16px;">
                        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 24px;" id="shopping-rating-stars">
                            <i class="fas fa-star" data-val="1" style="font-size: 32px; color: #ff9500; cursor: pointer;"></i>
                            <i class="fas fa-star" data-val="2" style="font-size: 32px; color: #ff9500; cursor: pointer;"></i>
                            <i class="fas fa-star" data-val="3" style="font-size: 32px; color: #ff9500; cursor: pointer;"></i>
                            <i class="fas fa-star" data-val="4" style="font-size: 32px; color: #ff9500; cursor: pointer;"></i>
                            <i class="fas fa-star" data-val="5" style="font-size: 32px; color: #ff9500; cursor: pointer;"></i>
                        </div>
                        <textarea id="shopping-rating-text" placeholder="写点评价吧，你的评价对其他买家有很大帮助..." style="width: 100%; height: 120px; border: none; background: #f7f7f5; border-radius: 12px; padding: 16px; font-size: 15px; resize: none; outline: none; margin-bottom: 20px; box-sizing: border-box;"></textarea>
                        <button type="button" id="shopping-rating-submit" style="width: 100%; padding: 16px; background: #111; color: #fff; border-radius: 12px; font-size: 16px; font-weight: 700; border: none; cursor: pointer;">提交评价</button>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', sheetHtml);
            this.ratingSheet = document.getElementById('shopping-rating-sheet');
            this.ratingStars = document.getElementById('shopping-rating-stars').children;
            this.ratingText = document.getElementById('shopping-rating-text');
            this.ratingSubmit = document.getElementById('shopping-rating-submit');
            let rating_2 = 5;
            Array.from(this.ratingStars).forEach((value_250) => {
                value_250.addEventListener('click', (e_8) => {
                    rating_2 = parseInt(e_8.target.dataset.val, 10);
                    Array.from(this.ratingStars).forEach((element_252, value_253) => {
                        value_253 < rating_2
                            ? ((element_252.className = 'fas fa-star'),
                              (element_252.style.color = '#ff9500'))
                            : ((element_252.className = 'far fa-star'),
                              (element_252.style.color = '#e5e5ea'));
                    });
                });
            });
            this.ratingSubmit.addEventListener('click', () => {
                const text_2 = this.ratingText.value.trim();
                if (!text_2) {
                    if (window.showToast) window.showToast('请输入评价内容');
                    else alert('请输入评价内容');
                    return;
                }
                if (!this.currentReviewProduct) return;
                let commentsObj_2 = {};
                try {
                    const item_256 = durableStorage.getItem('shopping_comments');
                    if (item_256) commentsObj_2 = JSON.parse(item_256);
                } catch (value_257) {}
                !commentsObj_2[this.currentReviewProduct] &&
                    (commentsObj_2[this.currentReviewProduct] = []);
                commentsObj_2[this.currentReviewProduct].unshift({
                    user: '我',
                    text: text_2,
                    rating: rating_2,
                    date: new Date().toLocaleDateString(),
                });
                durableStorage.setItem('shopping_comments', JSON.stringify(commentsObj_2));
                if (window.showToast) window.showToast('评价发表成功');
                else alert('评价发表成功');
                this.ratingSheet.classList.remove('active');
                this.currentProduct &&
                    this.currentProduct.name === this.currentReviewProduct &&
                    this.renderComments(this.currentReviewProduct, this.currentProduct.isFood);
            });
            this.ratingSheet.addEventListener('click', (event_258) => {
                event_258.target === this.ratingSheet &&
                    this.ratingSheet.classList.remove('active');
            });
        }
        ['openAllReviews'](value_259, value_260) {
            const shoppingAllReviewsSheetElement_261 = document.getElementById(
                    'shopping-all-reviews-sheet',
                ),
                container_2 = document.getElementById('shopping-all-reviews-container'),
                titleEl_2 = document.getElementById('shopping-all-reviews-sheet-title');
            if (!shoppingAllReviewsSheetElement_261 || !container_2) return;
            let options_262 = {};
            try {
                const item_264 = durableStorage.getItem('shopping_comments');
                if (item_264) options_262 = JSON.parse(item_264);
            } catch (value_265) {}
            const items_263 = options_262[value_259] || [];
            titleEl_2 &&
                (titleEl_2.textContent = value_260
                    ? '外卖评价 (' + items_263.length + ')'
                    : 'Reviews (' + items_263.length + ')');
            container_2.innerHTML = '';
            items_263.length === 0
                ? (container_2.innerHTML =
                      '<div style="text-align: center; padding: 40px; color: #8e8e93;">暂无评价</div>')
                : items_263.forEach((value_266) => {
                      const element_267 = document.createElement('div');
                      element_267.style.cssText =
                          'display: flex; gap: 12px; align-items: flex-start; padding-bottom: 12px; border-bottom: 1px solid rgba(17,17,17,0.05);';
                      let starsHtml = '';
                      const value_269 = value_266.rating || 5;
                      for (let count_270 = 0; count_270 < 5; count_270++) {
                          count_270 < value_269
                              ? (starsHtml +=
                                    '<i class="fas fa-star" style="color: #ff9500; font-size: 10px;"></i>')
                              : (starsHtml +=
                                    '<i class="far fa-star" style="color: #e5e5ea; font-size: 10px;"></i>');
                      }
                      element_267.innerHTML =
                          `
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #f2f2f7; display: flex; justify-content: center; align-items: center; font-size: 16px; color: #8e8e93; flex-shrink: 0;"><i class="fas fa-user"></i></div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                <div style="font-size: 15px; font-weight: 600; color: #111;">` +
                          value_266.user +
                          `</div>
                                <div style="font-size: 12px; color: #8e8e93;">` +
                          value_266.date +
                          `</div>
                            </div>
                            <div style="margin-bottom: 8px; display: flex; gap: 2px;">` +
                          starsHtml +
                          `</div>
                            <div style="font-size: 15px; color: #333; line-height: 1.5;">` +
                          value_266.text +
                          `</div>
                        </div>
                    `;
                      container_2.appendChild(element_267);
                  });
            shoppingAllReviewsSheetElement_261.classList.add('active');
        }
        ['closeDetail']() {
            if (this.detailSheet) this.detailSheet.classList.remove('active');
            if (this.foodDetailSheet) this.foodDetailSheet.classList.remove('active');
        }
        ['loadCart']() {
            try {
                const savedCart = durableStorage.getItem('shopping_cart');
                if (savedCart) {
                    const result_272 = JSON.parse(savedCart);
                    if (!Array.isArray(result_272)) return [];
                    const map_273 = result_272.map((value_274) => ({
                        ...value_274,
                        priceVal: handleAction_4(value_274?.price || value_274?.priceVal),
                    }));
                    return (
                        JSON.stringify(result_272) !== JSON.stringify(map_273) &&
                            durableStorage.setItem('shopping_cart', JSON.stringify(map_273)),
                        map_273
                    );
                }
            } catch (e_9) {
                console.error('Failed to load cart from localStorage', e_9);
            }
            return [];
        }
        ['saveCart']() {
            try {
                durableStorage.setItem('shopping_cart', JSON.stringify(this.cart));
            } catch (e_10) {
                console.error('Failed to save cart to localStorage', e_10);
            }
        }
        ['addToCart'](value_277) {
            const priceVal_2 = handleAction_4(value_277.price);
            this.cart.push({
                ...value_277,
                priceVal: priceVal_2,
                id: handleAction_5('cart'),
            });
            this.saveCart();
            this.renderCart();
        }
        ['removeFromCart'](value_279) {
            this.cart.splice(value_279, 1);
            this.saveCart();
            this.renderCart();
        }
        ['renderCart']() {
            if (!this.cartEmptyState || !this.cartContent || !this.cartList) return;
            if (this.cart.length === 0) {
                this.cartEmptyState.style.display = 'flex';
                this.cartContent.style.display = 'none';
                return;
            }
            this.cartEmptyState.style.display = 'none';
            this.cartContent.style.display = 'flex';
            this.cartList.innerHTML = '';
            let count_280 = 0;
            this.cart.forEach((value_281, index_5) => {
                count_280 += value_281.priceVal;
                const itemEl = document.createElement('div');
                itemEl.className = 'shopping-cart-item';
                itemEl.innerHTML =
                    `
                    <div class="shopping-cart-item-media" style="background: ` +
                    value_281.mediaBg +
                    `;">
                        ` +
                    value_281.iconHtml +
                    `
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; font-size: 15px;">` +
                    value_281.name +
                    `</div>
                        <div class="shopping-cart-item-price">` +
                    value_281.price +
                    `</div>
                    </div>
                    <div class="shopping-cart-remove" style="width: 30px; height: 30px; border-radius: 50%; background: #ffebee; color: #ff3b30; display: flex; justify-content: center; align-items: center; cursor: pointer;">
                        <i class="fas fa-trash-alt" style="font-size: 12px;"></i>
                    </div>
                `;
                const removeBtn = itemEl.querySelector('.shopping-cart-remove');
                removeBtn.addEventListener('click', () => {
                    this.removeFromCart(index_5);
                });
                this.cartList.appendChild(itemEl);
            });
            if (this.cartSubtotal) this.cartSubtotal.textContent = '¥' + count_280.toFixed(2);
            if (this.cartTotal) this.cartTotal.textContent = '¥' + count_280.toFixed(2);
        }
        ['open']() {
            if (!this.view) return;
            this.syncProfile();
            this.view.style.display = 'flex';
            window.requestAnimationFrame(() => {
                this.view.classList.add('active');
                this.switchTab('food', {
                    force: true,
                });
            });
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#fbfbfc');
        }
        ['close']() {
            if (!this.view) return;
            this.stopOrdersRefresh();
            this.view.classList.remove('active');
            window.setTimeout(() => {
                !this.view.classList.contains('active') && (this.view.style.display = 'none');
            }, 340);
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
        }
        ['switchTab'](tab_3, options_2 = {}) {
            const currentTab_2 = this.tabs.includes(tab_3) ? tab_3 : 'food';
            if (this.hasSelectedTab && this.currentTab === currentTab_2 && !options_2.force) return;
            const shouldScroll = options_2.scroll !== false;
            this.currentTab = currentTab_2;
            this.hasSelectedTab = true;
            if (currentTab_2 === 'me') this.syncProfile();
            this.navItems?.forEach((element_288) => {
                const value_289 = element_288.dataset.tab === currentTab_2;
                element_288.classList.toggle('active', value_289);
                element_288.setAttribute('aria-pressed', String(value_289));
            });
            this.panels?.forEach((element_290) => {
                element_290.classList.toggle('active', element_290.dataset.tab === currentTab_2);
            });
            if (shouldScroll && this.panelsWrap) {
                const index_6 = this.tabs.indexOf(currentTab_2);
                this.panelsWrap.scrollTo({
                    left: index_6 * this.panelsWrap.clientWidth,
                    behavior: 'auto',
                });
            }
            this.updateIndicator();
        }
        ['updateIndicator']() {
            if (!this.indicator || !this.navItems || !this.navItems.length) return;
            const activeItem =
                    this.navItems.find((item_5) => item_5.dataset.tab === this.currentTab) ||
                    this.navItems[0],
                nav = activeItem.closest('.shopping-bottom-nav');
            if (!nav) return;
            const navRect = nav.getBoundingClientRect(),
                itemRect = activeItem.getBoundingClientRect(),
                navStyle = window.getComputedStyle(nav),
                inset = parseFloat(navStyle.paddingLeft) || 0,
                offset = itemRect.left - navRect.left - inset;
            this.indicator.style.width = itemRect.width + 'px';
            this.indicator.style.transform = 'translateX(' + offset + 'px)';
        }
    }
    function handleAction_8() {
        if (window.shoppingApp) return window.shoppingApp;
        window.shoppingApp = new ShoppingApp();
        const appBtn = document.getElementById('app-shopping-btn');
        return (
            appBtn &&
                appBtn.addEventListener('click', (event_2) => {
                    event_2.stopPropagation();
                    if (window.isJiggleMode) return;
                    window.shoppingApp?.open();
                }),
            window.shoppingApp
        );
    }
    function initShoppingAppAfterStorageReady() {
        if (window.shoppingDataReadyPromise) return window.shoppingDataReadyPromise;
        const initialize = () => {
            return (handleAction_8(), true);
        };
        return (
            window.globalDataReadyPromise &&
            typeof window.globalDataReadyPromise.then === 'function'
                ? (window.shoppingDataReadyPromise = window.globalDataReadyPromise
                      .then(initialize)
                      ['catch']((error_2) => {
                          return (
                              console.warn('Shopping global data recovery failed:', error_2),
                              initialize(),
                              false
                          );
                      }))
                : (initialize(), (window.shoppingDataReadyPromise = Promise.resolve(true))),
            window.shoppingDataReadyPromise
        );
    }
    (
        window.u2OnStorageReady ||
        ((callback) => document.addEventListener('DOMContentLoaded', callback))
    )(initShoppingAppAfterStorageReady);
})();
