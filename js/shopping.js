(function () {
  const durableStorage = window.u2LegacyStorageFacade,
    count = 8000,
    count_3 = 16000;
  function handleAction_4(value_10) {
    const replace_11 = String(value_10 == null ? "" : value_10).replace(/[，,\s]/g, "").replace(/[^\d.-]/g, ""),
      float = Number.parseFloat(replace_11);
    return Number.isFinite(float) && float >= 0 ? float : 0;
  }
  function handleAction_5(value_12 = "shop") {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return value_12 + "-" + window.crypto.randomUUID();
    return value_12 + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
  }
  function handleAction_6(value_13) {
    return String(value_13 == null ? "" : value_13).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  class ShoppingApp {
    constructor() {
      this.view = document.getElementById("shopping-view");
      this.panelsWrap = document.getElementById("shopping-panels");
      this.indicator = document.getElementById("shopping-nav-indicator");
      this.closeBtn = document.getElementById("shopping-close-btn");
      this.tabs = ["food", "mall", "cart", "me"];
      this.currentTab = "food";
      this.hasSelectedTab = false;
      this.scrollTimer = null;
      this.ordersRefreshTimer = null;
      this.cart = this.loadCart();
      this.detailSheet = document.getElementById("shopping-detail-sheet");
      this.detailMedia = document.getElementById("shopping-detail-media");
      this.detailName = document.getElementById("shopping-detail-name");
      this.detailPrice = document.getElementById("shopping-detail-price");
      this.detailDesc = document.getElementById("shopping-detail-desc");
      this.addToCartBtn = document.getElementById("shopping-add-to-cart-btn");
      this.foodDetailSheet = document.getElementById("shopping-food-detail-sheet");
      this.foodDetailMedia = document.getElementById("shopping-food-detail-media");
      this.foodDetailName = document.getElementById("shopping-food-detail-name");
      this.foodDetailPrice = document.getElementById("shopping-food-detail-price");
      this.foodDetailDesc = document.getElementById("shopping-food-detail-desc");
      this.foodBottomPrice = document.getElementById("shopping-food-bottom-price");
      this.foodCloseBtn = document.getElementById("shopping-food-close-btn");
      this.addFoodToCartBtn = document.getElementById("shopping-food-add-to-cart-btn");
      this.currentProduct = null;
      this.cartEmptyState = document.getElementById("shopping-cart-empty-state");
      this.cartContent = document.getElementById("shopping-cart-content");
      this.cartList = document.getElementById("shopping-cart-list");
      this.cartSubtotal = document.getElementById("shopping-cart-subtotal");
      this.cartTotal = document.getElementById("shopping-cart-total");
      this.checkoutBtn = document.getElementById("shopping-checkout-btn");
      this.checkoutSheet = document.getElementById("shopping-checkout-sheet");
      this.payDesc = document.getElementById("shopping-checkout-pay-desc");
      this.paySelectBtn = document.getElementById("shopping-checkout-pay-select");
      this.friendDesc = document.getElementById("shopping-checkout-friend-desc");
      this.friendSelectBtn = document.getElementById("shopping-checkout-friend-select");
      this.confirmPaymentBtn = document.getElementById("shopping-confirm-payment-btn");
      this.paymentRadios = document.querySelectorAll("input[name=\"shopping-payment-method\"]");
      this.cardSelectionModal = document.getElementById("shopping-card-selection-modal");
      this.cardList = document.getElementById("shopping-card-list");
      this.cardBalance = document.getElementById("shopping-card-selection-balance");
      this.charSelectionModal = document.getElementById("shopping-char-selection-modal");
      this.charList = document.getElementById("shopping-char-list");
      this.ordersBtn = document.getElementById("shopping-orders-btn");
      this.ordersSheet = document.getElementById("shopping-orders-sheet");
      this.ordersList = document.getElementById("shopping-orders-list");
      this.orders = this.loadOrders();
      this.selectedCard = null;
      this.selectedFriend = null;
      this.giftOrdersInFlight = new Set();
      if (!this.view || !this.panelsWrap) return;
      this.navItems = Array.from(this.view.querySelectorAll(".shopping-nav-item"));
      this.panels = Array.from(this.view.querySelectorAll(".shopping-panel"));
      this.settingsBtn = document.getElementById("shopping-settings-btn");
      this.settingsSheet = document.getElementById("shopping-settings-sheet");
      this.searchBtn = document.getElementById("shopping-search-btn");
      this.searchSheet = document.getElementById("shopping-search-sheet");
      this.searchInput = document.getElementById("shopping-search-input");
      this.searchConfirmBtn = document.getElementById("shopping-search-confirm-btn");
      this.bindWbBtn = document.getElementById("shopping-bind-wb-btn");
      this.boundWbName = document.getElementById("shopping-bound-wb-name");
      this.clearGeneratedBtn = document.getElementById("shopping-clear-generated-btn");
      this.foodListContainer = document.getElementById("shopping-food-list-container");
      this.productListContainer = document.getElementById("shopping-product-grid-container");
      this.profileAvatar = document.getElementById("shopping-profile-avatar");
      this.profileAvatarImg = document.getElementById("shopping-profile-avatar-img");
      this.profileAvatarIcon = document.getElementById("shopping-profile-avatar-icon");
      this.profileName = document.getElementById("shopping-profile-name");
      this.updateBoundWbDisplay();
      this.syncProfile();
      this.bindEvents();
      this.switchTab("food", {
        scroll: false
      });
      this.renderCart();
      this.loadGeneratedProducts();
    }
    ["loadGeneratedProducts"]() {
      try {
        const savedFood = durableStorage.getItem("shopping_generated_food");
        if (savedFood) {
          const foodData = JSON.parse(savedFood);
          this.renderProductCards(foodData, "food");
        }
        const savedMall = durableStorage.getItem("shopping_generated_mall");
        if (savedMall) {
          const mallData = JSON.parse(savedMall);
          this.renderProductCards(mallData, "mall");
        }
      } catch (e_2) {
        console.error("Failed to load generated products", e_2);
      }
    }
    ["clearGeneratedProducts"]() {
      const confirm_17 = window.confirm("Clear all AI-generated food and mall items? Your cart and orders will not be affected.");
      if (!confirm_17) return false;
      return durableStorage.removeItem("shopping_generated_food"), durableStorage.removeItem("shopping_generated_mall"), this.foodListContainer?.querySelectorAll("[data-shopping-generated=\"true\"]").forEach(value_18 => value_18.remove()), this.productListContainer?.querySelectorAll("[data-shopping-generated=\"true\"]").forEach(value_19 => value_19.remove()), window.showToast ? window.showToast("Generated items cleared") : alert("Generated items cleared"), true;
    }
    ["getAvailableWorldBooks"]() {
      if (typeof window.getWorldBooks === "function") return window.getWorldBooks() || [];
      const globalDataStr = durableStorage.getItem("app_global_data");
      if (globalDataStr) try {
        const globalData = JSON.parse(globalDataStr);
        return globalData?.worldBooks?.books || [];
      } catch (value_22) {}
      return [];
    }
    ["getBoundWorldBookIds"]() {
      let ids = [];
      const savedIds = durableStorage.getItem("shopping_bound_wb_ids");
      if (savedIds) try {
        const parsedIds = JSON.parse(savedIds);
        if (Array.isArray(parsedIds)) ids = parsedIds;
      } catch (value_27) {}
      const legacyId = durableStorage.getItem("shopping_bound_wb_id");
      return legacyId && !ids.map(String).includes(String(legacyId)) && ids.unshift(legacyId), ids.map(id_2 => String(id_2)).filter((id_3, index_2, allIds) => id_3 && allIds.indexOf(id_3) === index_2);
    }
    ["saveBoundWorldBookIds"](ids_2 = []) {
      const nextIds = (Array.isArray(ids_2) ? ids_2 : []).map(id_4 => String(id_4)).filter((id_5, index_3, allIds_2) => id_5 && allIds_2.indexOf(id_5) === index_3);
      nextIds.length > 0 ? (durableStorage.setItem("shopping_bound_wb_ids", JSON.stringify(nextIds)), durableStorage.setItem("shopping_bound_wb_id", nextIds[0])) : (durableStorage.removeItem("shopping_bound_wb_ids"), durableStorage.removeItem("shopping_bound_wb_id"));
    }
    ["updateBoundWbDisplay"]() {
      if (!this.boundWbName) return;
      const boundIds = this.getBoundWorldBookIds();
      if (boundIds.length === 0) {
        this.boundWbName.textContent = "Not mounted";
        return;
      }
      const books_2 = this.getAvailableWorldBooks(),
        boundBooks = boundIds.map(id_6 => books_2.find(book => String(book.id) === String(id_6))).filter(Boolean);
      if (boundBooks.length === 1) this.boundWbName.textContent = boundBooks[0].name || "未命名世界书";else boundBooks.length > 1 ? this.boundWbName.textContent = "已挂载 " + boundBooks.length + " 本" : this.boundWbName.textContent = "Not mounted";
    }
    ["syncProfile"]() {
      const contact = window.getUserState ? window.getUserState() : window.userState || {},
        textContent_4 = String(contact?.name || "").trim() || "User",
        src_2 = String(contact?.avatarUrl || contact?.avatar || "").trim();
      if (this.profileName) this.profileName.textContent = textContent_4;
      this.profileAvatarImg && this.profileAvatarIcon && (src_2 ? (this.profileAvatarImg.src = src_2, this.profileAvatarImg.style.display = "block", this.profileAvatarIcon.style.display = "none") : (this.profileAvatarImg.removeAttribute("src"), this.profileAvatarImg.style.display = "none", this.profileAvatarIcon.style.display = "flex"));
    }
    ["bindEvents"]() {
      this.closeBtn?.addEventListener("click", () => this.close());
      this.foodCloseBtn?.addEventListener("click", () => this.closeDetail());
      this.settingsBtn && this.settingsBtn.addEventListener("click", () => {
        this.updateBoundWbDisplay();
        this.settingsSheet?.classList.add("active");
      });
      this.bindWbBtn && this.bindWbBtn.addEventListener("click", () => {
        if (typeof window.renderWorldBookSelector === "function") window.renderWorldBookSelector(this.getBoundWorldBookIds(), selectedIds => {
          this.saveBoundWorldBookIds(selectedIds);
          this.updateBoundWbDisplay();
        });else window.wbManager && window.wbManager.showWorldBookPicker && window.wbManager.showWorldBookPicker(selectedBook => {
          this.saveBoundWorldBookIds(selectedBook ? [selectedBook.id] : []);
          this.updateBoundWbDisplay();
        });
      });
      this.clearGeneratedBtn?.addEventListener("click", () => {
        this.clearGeneratedProducts() && this.settingsSheet?.classList.remove("active");
      });
      this.searchBtn && this.searchBtn.addEventListener("click", () => {
        if (this.searchInput) this.searchInput.value = "";
        this.searchSheet?.classList.add("active");
      });
      this.searchConfirmBtn && this.searchConfirmBtn.addEventListener("click", () => {
        this.handleGenerateProducts();
      });
      [this.settingsSheet, this.searchSheet, this.ordersSheet].forEach(element => {
        element && element.addEventListener("click", event => {
          if (event.target === element) {
            element.classList.remove("active");
            if (element === this.ordersSheet) this.stopOrdersRefresh();
          }
        });
      });
      window.addEventListener("user-state-updated", () => this.syncProfile());
      window.addEventListener("avatar-updated", () => this.syncProfile());
      const reviewsTrigger = document.getElementById("shopping-reviews-trigger");
      reviewsTrigger && reviewsTrigger.addEventListener("click", () => {
        this.currentProduct && this.openAllReviews(this.currentProduct.name, false);
      });
      const foodReviewsTrigger = document.getElementById("shopping-food-reviews-trigger");
      foodReviewsTrigger && foodReviewsTrigger.addEventListener("click", () => {
        this.currentProduct && this.openAllReviews(this.currentProduct.name, true);
      });
      const shoppingMallQaTriggerElement = document.getElementById("shopping-mall-qa-trigger");
      shoppingMallQaTriggerElement && shoppingMallQaTriggerElement.addEventListener("click", () => {
        const qaSheet = document.getElementById("shopping-qa-sheet");
        qaSheet && qaSheet.classList.add("active");
      });
      const shoppingQaSheetElement = document.getElementById("shopping-qa-sheet");
      shoppingQaSheetElement && shoppingQaSheetElement.addEventListener("click", event_45 => {
        event_45.target === shoppingQaSheetElement && shoppingQaSheetElement.classList.remove("active");
      });
      const shoppingAllReviewsSheetElement = document.getElementById("shopping-all-reviews-sheet");
      shoppingAllReviewsSheetElement && shoppingAllReviewsSheetElement.addEventListener("click", event_46 => {
        event_46.target === shoppingAllReviewsSheetElement && shoppingAllReviewsSheetElement.classList.remove("active");
      });
      this.navItems.forEach(item_2 => {
        item_2.addEventListener("click", () => {
          this.switchTab(item_2.dataset.tab || "food");
        });
      });
      const handlePanelsWrapScrollend = () => {
        const width_2 = this.panelsWrap.clientWidth || 1,
          index_4 = Math.round(this.panelsWrap.scrollLeft / width_2),
          tab_2 = this.tabs[Math.max(0, Math.min(this.tabs.length - 1, index_4))];
        this.switchTab(tab_2, {
          scroll: false
        });
      };
      "onscrollend" in this.panelsWrap ? this.panelsWrap.addEventListener("scrollend", handlePanelsWrapScrollend, {
        passive: true
      }) : this.panelsWrap.addEventListener("scroll", () => {
        window.clearTimeout(this.scrollTimer);
        this.scrollTimer = window.setTimeout(handlePanelsWrapScrollend, 120);
      }, {
        passive: true
      });
      window.addEventListener("resize", () => this.updateIndicator());
      this.bindProductClicks();
      this.addToCartBtn && this.addToCartBtn.addEventListener("click", () => {
        if (this.currentProduct) {
          this.addToCart(this.currentProduct);
          this.closeDetail();
          const originalText = this.addToCartBtn.textContent;
          this.addToCartBtn.textContent = "已添加!";
          setTimeout(() => {
            if (this.addToCartBtn) this.addToCartBtn.textContent = originalText;
          }, 1000);
        }
      });
      this.addFoodToCartBtn && this.addFoodToCartBtn.addEventListener("click", () => {
        if (this.currentProduct) {
          this.addToCart(this.currentProduct);
          this.closeDetail();
          const originalText_2 = this.addFoodToCartBtn.textContent;
          this.addFoodToCartBtn.textContent = "已添加!";
          setTimeout(() => {
            if (this.addFoodToCartBtn) this.addFoodToCartBtn.textContent = originalText_2;
          }, 1000);
        }
      });
      this.checkoutBtn && this.checkoutBtn.addEventListener("click", async () => {
        if (this.cart.length === 0) return;
        await this.initCheckout();
        this.checkoutSheet?.classList.add("active");
      });
      this.paySelectBtn && this.paySelectBtn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        const payRadio = document.querySelector("input[name=\"shopping-payment-method\"][value=\"pay\"]");
        if (payRadio) payRadio.checked = true;
        this.openCardSelection();
      });
      this.friendSelectBtn && this.friendSelectBtn.addEventListener("click", e_3 => {
        e_3.preventDefault();
        e_3.stopPropagation();
        const friendRadio = document.querySelector("input[name=\"shopping-payment-method\"][value=\"friend\"]");
        if (friendRadio) friendRadio.checked = true;
        this.openCharSelection();
      });
      this.confirmPaymentBtn && this.confirmPaymentBtn.addEventListener("click", () => {
        this.processPayment();
      });
      this.ordersBtn && this.ordersBtn.addEventListener("click", () => {
        this.renderOrders();
        this.ordersSheet?.classList.add("active");
        this.startOrdersRefresh();
      });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) this.stopOrdersRefresh();else {
          if (this.ordersSheet?.classList.contains("active")) this.startOrdersRefresh();
        }
      });
    }
    ["stopOrdersRefresh"]() {
      if (this.ordersRefreshTimer) clearTimeout(this.ordersRefreshTimer);
      this.ordersRefreshTimer = null;
    }
    startOrdersRefresh() {
        this.stopOrdersRefresh();
        if (!this.ordersSheet?.classList.contains('active') || document.hidden) return;
        this.ordersRefreshTimer = window.setTimeout(() => {
            this.ordersRefreshTimer = null;
            if (!this.ordersSheet?.classList.contains('active') || document.hidden) return;
            this.updateOrderProgress();
            this.startOrdersRefresh();
        }, 1000);
    }

    updateOrderProgress() {
        if (!this.ordersList) return;
        const now = Date.now();

        this.ordersList.querySelectorAll('.shopping-order-card[data-order-id]').forEach(card => {
            const order = this.orders.find(item => String(item.id) === card.dataset.orderId);
            if (!order) return;

            const elapsed = (now - (order.timestamp || order.id)) / 1000;
            const progress = Math.min(100, Math.max(0, (elapsed / 16) * 100));
            const isFood = order.items.some(item => item.isFood);
            const active = [true, elapsed >= 8, elapsed >= 16];
            const currentColor = isFood ? 'var(--shop-accent, #a97642)' : '#111111';
            const finalColor = 'var(--shop-green, #476c5a)';
            const glow = isFood ? 'shopPulseGlow' : 'shopPulseGlowGreen';

            const fill = card.querySelector('.shopping-order-fill');
            if (fill) {
                fill.style.width = `calc(68% * ${progress / 100})`;
                fill.style.background = active[2] ? finalColor : currentColor;
            }

            card.querySelectorAll('.shopping-order-node').forEach((node, index) => {
                const icon = node.querySelector('.shopping-order-icon-wrap');
                const text = node.querySelector('.shopping-order-node-text');
                const color = index === 2 ? finalColor : currentColor;
                if (icon) {
                    icon.style.background = active[index] ? color : '#f2f2f7';
                    icon.style.animation = (
                        (index === 0 && active[0] && !active[1]) ||
                        (index === 1 && active[1] && !active[2])
                    ) ? `${glow} 2s infinite` : 'none';
                    const glyph = icon.querySelector('i');
                    if (glyph) glyph.style.color = active[index] ? '#fff' : '#c7c7cc';
                }
                if (text) {
                    text.style.color = active[index] ? '#111' : '#8e8e93';
                    text.style.fontWeight = active[index] ? '700' : '600';
                }
            });
        });
    }

    async handleGenerateProducts() {
        let userInput = this.searchInput ? this.searchInput.value.trim() : '';
            
        const targetTab = this.currentTab === 'food' ? 'food' : 'mall';
            
        // If empty, generate random items based on the current tab
        if (!userInput) {
            userInput = targetTab === 'food' 
                ? "随机生成一些高质量的米其林餐或雪茄吧饮品" 
                : "随机生成一些高品质的奢侈品牌商品或酒";
        }

        if (this.searchConfirmBtn) {
            this.searchConfirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            this.searchConfirmBtn.disabled = true;
        }

        let systemPrompt = `你现在是一个商品、评价及问答生成器。根据用户的输入，生成不少于10个商品。每个商品生成5-10条用户评价，以及5-10条问答(Q&A)。
当前分类是 ${targetTab === 'food' ? 'Food(米其林餐)' : 'Mall(奢侈品牌商品)'}。

**关键要求**：
1. **评价(Reviews)**：必须非常真实、接地气，包含好评、中评甚至差评。语气要幽默、调侃或者夸张（比如：“全球住了七家安缦，纽约这家的餐厅终于没让我失望。怀石料理做得很有水准，空间设计也是一贯的安缦极简风，呼吸都变慢了。”、“作为在东京吃过银座级别omakase的人，Mase确实能打，但说实话同等价位在东京能吃两顿。纽约溢价太狠了。”）。
2. **问答(Q&A)**：这是买家向已经买过的买家提问的板块（类似淘宝的“问大家”）。回答者**绝对不要**像官方客服，而是真实的、充满个性的普通买家。回答可以很搞笑、无厘头、甚至带点互坑的成分（比如 Q：“真的需要配货才能买到吗？配货比例大概多少？” A：“我的经验是1:1.5到1.2不等，看你和SA的关系。有人说直接走进去就买到了，我只能说投胎是门技术活。” 或 Q：“日常戴会不会太夸张了？” A：“看款式，基础款其实挺低调，密镶钻那款确实闪。但姐妹，花了十几万买的东西不就是为了让人看到吗？”）。

\n\n`;

        // Append World Book context if bound
        const boundIds = this.getBoundWorldBookIds();
        if (boundIds.length > 0 && window.wbManager) {
            const bookContexts = [];
            for (const boundId of boundIds) {
                const bookCtx = await window.wbManager.getBookContextString(boundId);
                if (bookCtx) bookContexts.push(bookCtx);
            }
            if (bookContexts.length > 0) {
                systemPrompt += `[当前挂载的世界书上下文]\n${bookContexts.join('\n\n')}\n\n参考以上世界书设定生成契合世界观的商品，评价和问答也可以带入世界观中的梗。\n\n`;
            }
        }
            
        systemPrompt += `输出必须为纯 JSON 数组格式，不要任何多余文本或 markdown 标签。格式：字符串内如需强调词语、菜名、品牌名或俚语，一律使用单引号 ' 包裹（例如 the 'wagyu' course），禁止在字符串内使用双引号 " ，否则破坏 JSON 结构导致解析失败。tags 数组长度严格为2。格式要求：\n

[
  {
    "name": "Product name",
    "price": "Product price(including $ symbol，e.g. $2200)",
    "desc": "Short product description",
    "iconClass": "fontawesome icon class name(e.g. fa-utensils)",
    "bgGrad": "CSS渐变背景(例如 linear-gradient(135deg, #0A1128 0%, #C41E5C 100%) 色调需偏向高端品牌)",
    "tags": ["Tag 1", "Tag 2"],
    "reviews": [
      { "user": "User A", "text": "Review content", "rating": 5 },
      { "user": "User B", "text": "Review content", "rating": 4 }
    ],
    "qa": [
      { "q": "Question 1", "a": "Answer 1" },
      { "q": "Question 2", "a": "Answer 2" }
    ]
  }
]`;
            
        try {
            const apiConfig = typeof window.getApiConfig === 'function' ? window.getApiConfig() : (window.apiConfig || {});
            if (!apiConfig || !apiConfig.endpoint || !apiConfig.apiKey) {
                throw new Error('请先在系统设置中配置 API');
            }

            const endpoint = window.u2Api.resolveChatCompletionsEndpoint(apiConfig.endpoint);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: apiConfig.model || 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userInput }
                    ],
                    temperature: parseFloat(apiConfig.temperature) || 0.8
                })
            });

            if (!response.ok) {
                const errorBody = await window.u2Api?.readApiError?.(response);
                throw window.u2Api?.createHttpError?.(response, errorBody)
                    || Object.assign(new Error(`API 请求失败: HTTP ${response.status}`), { status: response.status });
            }

            const data = await response.json();
            const choice = data.choices && data.choices[0];
            const responseText = choice && choice.message ? choice.message.content : '';
                
            let jsonText = responseText || '';
                
            // Clean up possible markdown wrappers
            if (jsonText.startsWith('```')) {
                jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
            }

            let productsData = null;
            try {
                productsData = JSON.parse(jsonText);
            } catch(e) {
                // Try to extract array if parsing fails
                const startIdx = jsonText.indexOf('[');
                const endIdx = jsonText.lastIndexOf(']');
                if(startIdx !== -1 && endIdx !== -1) {
                    productsData = JSON.parse(jsonText.substring(startIdx, endIdx + 1));
                } else {
                    throw new Error("JSON 解析失败");
                }
            }

            if (!Array.isArray(productsData) || productsData.length === 0) {
                 throw new Error("生成数据为空");
            }

            // Append generated products to UI
            this.injectGeneratedProducts(productsData, targetTab);
                
            if (this.searchSheet) this.searchSheet.classList.remove('active');
            if (this.searchInput) this.searchInput.value = '';
                
        } catch(e) {
            console.error("Generate error:", e);
            (!window.u2Api?.isRequestError?.(e) || !window.u2Api.reportError(e, { operation: 'Product generation' }))
                && (window.showToast ? window.showToast('生成失败: ' + e.message) : alert('生成失败: ' + e.message));
        } finally {
            if (this.searchConfirmBtn) {
                this.searchConfirmBtn.innerHTML = '<i class="fas fa-magic"></i> Generate';
                this.searchConfirmBtn.disabled = false;
            }
        }
    }

    ["renderProductCards"](items_94, targetTab_2) {
      let container = null;
      if (targetTab_2 === "food") container = this.foodListContainer;
      if (targetTab_2 === "mall") container = this.productListContainer;
      if (!container) return;
      items_94.forEach(value_97 => {
        const article = document.createElement("article");
        article.dataset.shoppingGenerated = "true";
        const toFixed_99 = (Math.random() * 1 + 4).toFixed(1);
        if (targetTab_2 === "food") {
          article.className = "shopping-food-card";
          let join_100 = (value_97.tags || ["30 min", toFixed_99]).map(value_101 => "<span>" + value_101 + "</span>").join("");
          article.innerHTML = "\n                        <div class=\"shopping-food-media\" style=\"background: " + (value_97.bgGrad || "#f2f2f7") + "\"><i class=\"fas " + (value_97.iconClass || "fa-utensils") + "\"></i></div>\n                        <div class=\"shopping-food-copy\">\n                            <div class=\"shopping-card-topline\"><strong>" + value_97.name + "</strong><span>" + value_97.price + "</span></div>\n                            <p>" + value_97.desc + "</p>\n                            <div class=\"shopping-tags\">" + join_100 + "</div>\n                        </div>\n                    ";
        } else {
          article.className = "shopping-product-card";
          article.innerHTML = "\n                        <div class=\"shopping-product-media\" style=\"background: " + (value_97.bgGrad || "#f2f2f7") + "\"><i class=\"fas " + (value_97.iconClass || "fa-box") + "\"></i></div>\n                        <strong>" + value_97.name + "</strong>\n                        <span>" + value_97.price + "</span>\n                        <span style=\"display:none;\">" + value_97.desc + "</span> <!-- Hidden desc to pass to openDetail -->\n                    ";
        }
        container.appendChild(article);
      });
      this.bindProductClicks();
    }
    ["injectGeneratedProducts"](productsData_2, targetTab_3) {
      this.renderProductCards(productsData_2, targetTab_3);
      try {
        const key = targetTab_3 === "food" ? "shopping_generated_food" : "shopping_generated_mall";
        let saved = [];
        const stored = durableStorage.getItem(key);
        if (stored) saved = JSON.parse(stored);
        saved = saved.concat(productsData_2);
        durableStorage.setItem(key, JSON.stringify(saved));
      } catch (value_108) {}
      let commentsObj = {};
      try {
        const item_109 = durableStorage.getItem("shopping_comments");
        if (item_109) commentsObj = JSON.parse(item_109);
      } catch (value_110) {}
      let qaObj = {};
      try {
        const item_111 = durableStorage.getItem("shopping_qa");
        if (item_111) qaObj = JSON.parse(item_111);
      } catch (value_112) {}
      productsData_2.forEach(p => {
        if (p.reviews && Array.isArray(p.reviews)) {
          const datedReviews = p.reviews.map(r => ({
            ...r,
            date: r.date || new Date().toLocaleDateString()
          }));
          commentsObj[p.name] ? commentsObj[p.name] = [...datedReviews, ...commentsObj[p.name]] : commentsObj[p.name] = datedReviews;
        }
        p.qa && Array.isArray(p.qa) && (qaObj[p.name] ? qaObj[p.name] = [...p.qa, ...qaObj[p.name]] : qaObj[p.name] = p.qa);
      });
      durableStorage.setItem("shopping_comments", JSON.stringify(commentsObj));
      durableStorage.setItem("shopping_qa", JSON.stringify(qaObj));
    }
    bindProductClicks() {
        const products = this.view.querySelectorAll('.shopping-food-card, .shopping-product-card');
        products.forEach(product => {
            // Prevent multiple bindings
            if (product.hasAttribute('data-bound')) return;
            product.setAttribute('data-bound', 'true');

            product.style.cursor = 'pointer';
            product.addEventListener('click', () => {
                let name, price, desc;
                    
        const isFood = product.classList.contains('shopping-food-card');
        const media = product.querySelector(isFood ? '.shopping-food-media' : '.shopping-product-media');
        if (isFood) {
            name = product.querySelector('strong')?.textContent || 'Food Item';
            price = product.querySelector('.shopping-card-topline span')?.textContent || '$0';
            desc = product.querySelector('p')?.textContent || '';
        } else {
            name = product.querySelector('strong')?.textContent || 'Product';
            price = product.querySelector('span')?.textContent.split('·')[0].trim() || '$0';
            // For generated mall items, desc is in the hidden span
            const spans = product.querySelectorAll('span');
            desc = (spans.length > 1) ? spans[1].textContent : '';
        }

                const iconHtml = media?.innerHTML || '';
                const mediaBg = media ? (media.style.background || window.getComputedStyle(media).background) : '';
                const mediaImage = media ? window.getComputedStyle(media, '::after').backgroundImage : 'none';
                this.openDetail({ name, price, desc, iconHtml, mediaBg, mediaImage }, isFood);
            });
        });
    }

    async openGiftCharSelection(order, orderIndex) {
        if (!this.charSelectionModal || !this.charList) return;
            
        const originalTitle = this.charSelectionModal.querySelector('.wb-centered-modal-title').textContent;
        this.charSelectionModal.querySelector('.wb-centered-modal-title').textContent = 'Select a friend to gift';
            
        this.charList.innerHTML = '';
            
        let friends = [];
        if (window.imStorage && window.imStorage.loadFriends) {
            try {
                const allFriends = await window.imStorage.loadFriends();
                friends = allFriends;
            } catch(e) {}
        }
            
        if (friends.length === 0) {
            this.charList.innerHTML = '<div style="text-align: center; padding: 20px; color: #73706a;">no friends yet</div>';
        } else {
            friends.forEach(friend => {
                const el = document.createElement('div');
                el.style.cssText = 'background: rgba(255, 255, 255, 0.82); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border: 1px solid rgba(17,17,17,0.09); ';
                    
                const name = friend.name || friend.nickname || 'Unknown Char';
                let avatarHtml = `<div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(17,17,17,0.06); display: flex; justify-content: center; align-items: center; color: #73706a;"><i class="fas fa-user"></i></div>`;
                const friendAvatar = friend.avatarUrl || friend.avatar;
                if (friendAvatar) {
                    avatarHtml = `<img src="${friendAvatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(17,17,17,0.09);">`;
                }
                    
                el.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        ${avatarHtml}
                        <div style="display: flex; flex-direction: column;">
                            <div style="font-size: 15px; font-weight: 700; color: #111;">${name}</div>
                            <div style="font-size: 13px; color: #73706a; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${friend.signature || ''}</div>
                        </div>
                    </div>
                    <div style="background: #111; color: #fff; padding: 6px 12px; border-radius: 16px; font-size: 13px; font-weight: 600;">Gift</div>
                `;
                    
                el.addEventListener('click', () => {
                    this.charSelectionModal.style.display = 'none';
                    this.charSelectionModal.classList.remove('active');
                    this.charSelectionModal.querySelector('.wb-centered-modal-title').textContent = originalTitle;
                    this.openGiftComposer(friend, order, orderIndex);
                });
                    
                this.charList.appendChild(el);
            });
        }
            
        const closeBtn = this.charSelectionModal.querySelector('.wb-centered-modal-close');
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        newCloseBtn.addEventListener('click', () => {
            this.charSelectionModal.style.display = 'none';
            this.charSelectionModal.classList.remove('active');
            this.charSelectionModal.querySelector('.wb-centered-modal-title').textContent = originalTitle;
        });

        this.charSelectionModal.style.display = 'flex';
        requestAnimationFrame(() => {
            this.charSelectionModal.classList.add('active');
        });
    }

    openGiftComposer(friend, order, orderIndex) {
        document.querySelector('.shopping-gift-compose-overlay')?.remove();
        const overlay = document.createElement('div');
        overlay.className = 'shopping-gift-compose-overlay';
        overlay.innerHTML = `
            <div class="shopping-gift-compose-card" role="dialog" aria-modal="true" aria-label="Gift">
                <div class="shopping-gift-compose-title">Gift</div>
                <div class="shopping-gift-compose-label">Description</div>
                <input class="shopping-gift-compose-input" type="text" maxlength="180" placeholder="e.g. : miss" autocomplete="off">
                <div class="shopping-gift-compose-actions">
                    <button type="button" class="shopping-gift-compose-cancel">取消</button>
                    <button type="button" class="shopping-gift-compose-submit">发送</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.style.display = 'flex';
        const input = overlay.querySelector('.shopping-gift-compose-input');
        const close = () => overlay.remove();
        overlay.querySelector('.shopping-gift-compose-cancel')?.addEventListener('click', close);
        overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
        overlay.querySelector('.shopping-gift-compose-submit')?.addEventListener('click', async () => {
            const submit = overlay.querySelector('.shopping-gift-compose-submit');
            if (submit.disabled) return;
            submit.disabled = true;
            const success = await this.sendGiftMessage(friend, order, input?.value || '');
            submit.disabled = false;
            if (!success) return;
            if (orderIndex !== undefined && this.orders[orderIndex]) {
                this.orders[orderIndex].gifted = true;
                this.saveOrders();
                this.renderOrders();
            }
            close();
        });
        requestAnimationFrame(() => input?.focus());
    }
        
    async sendGiftMessage(friend, order, description = '') {
        const orderId = String(order?.id || '');
        if (!orderId || this.giftOrdersInFlight.has(orderId)) return false;
        this.giftOrdersInFlight.add(orderId);
        const itemNames = order.items.map(i => i.name).join(', ');
        const cleanDescription = String(description || '').trim();
        const msgText = `Gift: ${itemNames}\nValue $${order.total.toFixed(2)}${cleanDescription ? `\nDescription: ${cleanDescription}` : ''}`;

        let success = false;
        if (window.imApp && window.imApp.appendFriendMessage) {
            try {
                if (window.imApp.ensureFriendMessagesLoaded) {
                    await window.imApp.ensureFriendMessagesLoaded(friend.id);
                }

                const newMsg = {
                    role: 'user',
                    type: 'gift',
                    text: msgText,
                    content: msgText,
                    giftName: itemNames,
                    giftValue: Number(order.total) || 0,
                    giftDescription: cleanDescription,
                    giftStatus: 'pending',
                    giftPaymentMethod: order.method || '',
                    timestamp: Date.now()
                };
                    
                success = await window.imApp.appendFriendMessage(friend.id, newMsg, { silent: false });
                const giftContextText = `[Gift event] User sent ${itemNames}. Value $${order.total.toFixed(2)}.${cleanDescription ? ` Description: ${cleanDescription}.` : ''} Paid via ${order.method}. 理解礼物描述含义，并根据你的角色人设对她送你的这份礼物做出你真实的反应。。`;
                const aiMsg = {
                    role: 'system',
                    type: 'text',
                    text: giftContextText,
                    content: giftContextText,
                    timestamp: Date.now() + 1
                };
                await window.imApp.appendFriendMessage(friend.id, aiMsg, { silent: true });
                    
                if (window.imData && window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(friend.id)) {
                    const activeContainer = document.querySelector('.active-chat-interface .ins-chat-messages');
                    if (activeContainer && window.imChat && window.imChat.appendMessageToContainer) {
                        window.imChat.appendMessageToContainer(window.imData.currentActiveFriend, activeContainer, newMsg);
                    }
                }
            } catch(e) {
                console.error('Failed to append gift message:', e);
            }
        }
            
        if (success) {
            if (window.showToast) window.showToast('Gift sent');
            else alert('Gift sent');
        } else {
            if (window.showToast) window.showToast('赠送失败');
            else alert('赠送失败');
        }
            
        this.giftOrdersInFlight.delete(orderId);
        return success;
    }

    ["loadOrders"]() {
      try {
        const saved_2 = durableStorage.getItem("shopping_orders");
        if (saved_2) {
          const result_151 = JSON.parse(saved_2),
            orders_152 = this.normalizeOrders(result_151);
          return JSON.stringify(result_151) !== JSON.stringify(orders_152) && durableStorage.setItem("shopping_orders", JSON.stringify(orders_152)), orders_152;
        }
      } catch (value_153) {}
      return [];
    }
    ["normalizeOrders"](items_154) {
      if (!Array.isArray(items_154)) return [];
      const items_155 = [];
      return items_154.forEach(message_156 => {
        if (!message_156 || typeof message_156 !== "object") return;
        const items_157 = Array.isArray(message_156.items) ? message_156.items : [],
          batchId_2 = String(message_156.batchId || message_156.id || handleAction_5("checkout")),
          timestamp_2 = Number(message_156.timestamp || message_156.id) || Date.now();
        items_157.forEach((value_160, value_161) => {
          if (!value_160 || typeof value_160 !== "object") return;
          const handleAction_4_162 = handleAction_4(value_160.price || value_160.priceVal),
            options_163 = {
              ...value_160,
              priceVal: handleAction_4_162
            },
            value_164 = items_157.length === 1;
          items_155.push({
            ...message_156,
            id: value_164 ? String(message_156.id || batchId_2 + "-item-1") : batchId_2 + "-item-" + (value_161 + 1),
            batchId: batchId_2,
            timestamp: timestamp_2,
            items: [options_163],
            itemTotal: handleAction_4_162,
            total: handleAction_4_162,
            legacyPaidTotal: message_156.legacyPaidTotal ?? (items_157.length > 1 ? Number(message_156.total) || null : undefined)
          });
        });
      }), items_155;
    }
    ["createOrdersFromCart"](method_3, status_2 = "Paid") {
      const batchId_3 = handleAction_5("checkout"),
        timestamp_3 = Date.now();
      return this.cart.map((value_169, value_170) => {
        const options_171 = {
          ...value_169,
          priceVal: handleAction_4(value_169.price || value_169.priceVal)
        };
        return {
          id: batchId_3 + "-item-" + (value_170 + 1),
          batchId: batchId_3,
          timestamp: timestamp_3,
          date: new Date(timestamp_3).toLocaleString(),
          items: [options_171],
          itemTotal: options_171.priceVal,
          total: options_171.priceVal,
          status: status_2,
          method: method_3
        };
      });
    }
    ["saveOrders"]() {
      durableStorage.setItem("shopping_orders", JSON.stringify(this.orders));
    }
    async ["initCheckout"]() {
      let items_172 = [];
      typeof window.getPayCards === "function" && (items_172 = window.getPayCards());
      (!items_172 || items_172.length === 0) && (items_172 = [{
        id: "card1",
        name: "Bank debit card",
        number: "**** **** **** 8888",
        icon: "fa-university"
      }, {
        id: "card2",
        name: "Bank credit card",
        number: "**** **** **** 1234",
        icon: "fa-credit-card"
      }]);
      let friends_2 = [];
      if (window.imStorage && window.imStorage.loadFriends) try {
        friends_2 = await window.imStorage.loadFriends();
      } catch (value_174) {}
      !this.selectedCard && items_172.length > 0 && (this.selectedCard = items_172[0]);
      friends_2.length > 0 ? (!this.selectedFriend || !friends_2.find(f => String(f.id) === String(this.selectedFriend.id))) && (this.selectedFriend = friends_2[0]) : this.selectedFriend = null;
      this.payDesc && this.selectedCard && (this.payDesc.textContent = this.selectedCard.name + " (" + this.selectedCard.number.slice(-4) + ")");
      this.friendDesc && (this.friendDesc.textContent = this.selectedFriend ? this.selectedFriend.name || this.selectedFriend.nickname || "Unknown Char" : "Select a friend");
    }
    async ["openCardSelection"]() {
      if (!this.cardSelectionModal || !this.cardList) return;
      this.cardList.innerHTML = "";
      let items_175 = [],
        balance_2 = 0;
      typeof window.getPayCards === "function" && (items_175 = window.getPayCards());
      typeof window.getPayBalance === "function" && (balance_2 = window.getPayBalance());
      (!items_175 || items_175.length === 0) && (items_175 = [{
        id: "card1",
        name: "Bank debit card",
        number: "**** **** **** 8888",
        icon: "fa-university"
      }, {
        id: "card2",
        name: "Bank credit card",
        number: "**** **** **** 1234",
        icon: "fa-credit-card"
      }]);
      this.cardBalance && (this.cardBalance.textContent = "$" + balance_2.toFixed(2));
      items_175.forEach(selectedCard_2 => {
        const element_178 = document.createElement("div");
        element_178.style.cssText = "background: rgba(255, 255, 255, 0.82); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border: 1px solid rgba(17,17,17,0.09); ";
        const isSelected = this.selectedCard && String(this.selectedCard.id) === String(selectedCard_2.id);
        element_178.innerHTML = "\n                    <div style=\"display: flex; align-items: center; gap: 12px;\">\n                        <div style=\"width: 40px; height: 40px; border-radius: 50%; background: rgba(17,17,17,0.06); display: flex; justify-content: center; align-items: center; color: #111;\">\n                            <i class=\"fas " + (selectedCard_2.icon || "fa-credit-card") + "\"></i>\n                        </div>\n                        <div style=\"display: flex; flex-direction: column;\">\n                            <div style=\"font-size: 15px; font-weight: 700; color: #111;\">" + selectedCard_2.name + "</div>\n                            <div style=\"font-size: 13px; color: #85858b; font-family: monospace;\">" + selectedCard_2.number + "</div>\n                        </div>\n                    </div>\n                    " + (isSelected ? "<i class=\"fas fa-check-circle\" style=\"color: #111113; font-size: 20px;\"></i>" : "<div style=\"width: 20px; height: 20px; border-radius: 50%; border: 1px solid rgba(17,17,17,0.15);\"></div>") + "\n                ";
        element_178.addEventListener("click", () => {
          this.selectedCard = selectedCard_2;
          this.payDesc && (this.payDesc.textContent = this.selectedCard.name + " (" + this.selectedCard.number.slice(-4) + ")");
          this.cardSelectionModal.style.display = "none";
          this.cardSelectionModal.classList.remove("active");
        });
        this.cardList.appendChild(element_178);
      });
      this.cardSelectionModal.style.display = "flex";
      requestAnimationFrame(() => {
        this.cardSelectionModal.classList.add("active");
      });
    }
    async ["openCharSelection"]() {
      if (!this.charSelectionModal || !this.charList) return;
      this.charList.innerHTML = "";
      let items_180 = [];
      if (window.imStorage && window.imStorage.loadFriends) try {
        items_180 = await window.imStorage.loadFriends();
      } catch (value_181) {}
      items_180.length === 0 ? this.charList.innerHTML = "<div style=\"text-align: center; padding: 20px; color: #85858b;\">No friends found</div>" : items_180.forEach(selectedFriend_2 => {
        const element_183 = document.createElement("div");
        element_183.style.cssText = "background: rgba(255, 255, 255, 0.82); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border: 1px solid rgba(17,17,17,0.09); ";
        const isSelected_2 = this.selectedFriend && String(this.selectedFriend.id) === String(selectedFriend_2.id),
          textContent_3 = selectedFriend_2.name || selectedFriend_2.nickname || "Unknown Char";
        let text_186 = "<div style=\"width: 40px; height: 40px; border-radius: 50%; background: rgba(17,17,17,0.06); display: flex; justify-content: center; align-items: center; color: #85858b;\"><i class=\"fas fa-user\"></i></div>";
        const value_187 = selectedFriend_2.avatarUrl || selectedFriend_2.avatar;
        value_187 && (text_186 = "<img src=\"" + value_187 + "\" style=\"width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(17,17,17,0.09);\">");
        element_183.innerHTML = "\n                        <div style=\"display: flex; align-items: center; gap: 12px;\">\n                            " + text_186 + "\n                            <div style=\"display: flex; flex-direction: column;\">\n                                <div style=\"font-size: 15px; font-weight: 700; color: #111;\">" + textContent_3 + "</div>\n                                <div style=\"font-size: 13px; color: #85858b; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">" + (selectedFriend_2.signature || "") + "</div>\n                            </div>\n                        </div>\n                        " + (isSelected_2 ? "<i class=\"fas fa-check-circle\" style=\"color: #111113; font-size: 20px;\"></i>" : "<div style=\"width: 20px; height: 20px; border-radius: 50%; border: 1px solid rgba(17,17,17,0.15);\"></div>") + "\n                    ";
        element_183.addEventListener("click", () => {
          this.selectedFriend = selectedFriend_2;
          this.friendDesc && (this.friendDesc.textContent = textContent_3);
          this.charSelectionModal.style.display = "none";
          this.charSelectionModal.classList.remove("active");
        });
        this.charList.appendChild(element_183);
      });
      this.charSelectionModal.style.display = "flex";
      requestAnimationFrame(() => {
        this.charSelectionModal.classList.add("active");
      });
    }
    async ["processPayment"]() {
      const method_2 = document.querySelector("input[name=\"shopping-payment-method\"]:checked")?.value;
      let subtotal = 0;
      this.cart.forEach(item_3 => subtotal += item_3.priceVal);
      const total_2 = subtotal + 5,
        itemNames = this.cart.map(item_4 => item_4.name).join(", ");
      if (method_2 === "pay") {
        if (!this.selectedCard) {
          window.showToast ? window.showToast("请选择支付卡片") : alert("请选择支付卡片");
          return;
        }
        const cardBalance_2 = this.selectedCard.balance !== undefined ? this.selectedCard.balance : typeof window.getPayBalance === "function" ? window.getPayBalance() : 0;
        if (cardBalance_2 >= total_2) {
          let paymentSuccess = true;
          typeof window.addPayTransaction === "function" && (paymentSuccess = window.addPayTransaction(total_2, "Shopping", "expense", this.selectedCard.id));
          if (paymentSuccess) {
            const value_195 = this.selectedCard.type === "family" ? "Family card (" + this.selectedCard.name + ")" : "Pay";
            this.orders.unshift(...this.createOrdersFromCart(value_195));
            this.saveOrders();
            this.cart = [];
            this.saveCart();
            this.renderCart();
            this.checkoutSheet?.classList.remove("active");
            window.showToast ? window.showToast("Payment successful") : alert("Payment successful");
          } else window.showToast ? window.showToast("支付失败") : alert("支付失败");
        } else window.showToast ? window.showToast("余额不足") : alert("余额不足");
      } else {
        if (method_2 === "friend") {
          if (!this.selectedFriend) {
            window.showToast ? window.showToast("请选择代付好友") : alert("请选择代付好友");
            return;
          }
          const friendName = this.selectedFriend.name || this.selectedFriend.nickname || "Unknown Char",
            text_4 = "[Payment request]\nItems: " + itemNames + "\nTotal: $" + total_2.toFixed(2),
            content_4 = "\n                    <div style=\"background: #f6f6f8; border-radius: 16px; padding: 16px; min-width: 220px; max-width: 280px; color: #111111;  border: 1px solid rgba(17,17,17,0.09); display: inline-block;\">\n                        <div style=\"font-size: 12px; color: #85858b; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; font-weight: 700;\">\n                            <i class=\"fas fa-bag-shopping\" style=\"color: #111113;\"></i> Shop Request\n                        </div>\n                        <div style=\"font-size: 15px; font-weight: 700; margin-bottom: 6px; white-space: normal; word-break: break-word; line-height: 1.4;\">" + itemNames + "</div>\n                        <div style=\"font-size: 24px; font-weight: 800; color: #111111; margin-top: 14px; margin-bottom: 16px;\">$" + total_2.toFixed(2) + "</div>\n                        <div style=\"background: #111113; color: #ffffff; text-align: center; padding: 10px 0; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;\">Pay Now</div>\n                    </div>\n                ";
          let success_2 = false;
          if (window.imApp && window.imApp.appendFriendMessage) try {
            window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(this.selectedFriend.id));
            const newMsg = {
              role: "user",
              type: "html",
              text: text_4,
              content: content_4,
              timestamp: Date.now()
            };
            success_2 = await window.imApp.appendFriendMessage(this.selectedFriend.id, newMsg, {
              silent: true
            });
            if (success_2 && window.imData && window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(this.selectedFriend.id)) {
              const activeChatInterfaceInsChatMessagesElement = document.querySelector(".active-chat-interface .ins-chat-messages");
              activeChatInterfaceInsChatMessagesElement && window.imChat && window.imChat.appendMessageToContainer && window.imChat.appendMessageToContainer(window.imData.currentActiveFriend, activeChatInterfaceInsChatMessagesElement, newMsg);
            }
          } catch (e_6) {
            console.error("Failed to append shop request message:", e_6);
          }
          success_2 ? (this.orders.unshift(...this.createOrdersFromCart("Pay for me (" + friendName + ")", "Payment request sent")), this.saveOrders(), this.cart = [], this.saveCart(), this.renderCart(), this.checkoutSheet?.classList.remove("active"), window.showToast ? window.showToast("Payment request sent") : alert("Payment request sent")) : window.showToast ? window.showToast("无法发送代付请求") : alert("无法发送代付请求");
        }
      }
    }
    renderOrders() {
        if (!this.ordersList) return;
        this.ordersList.innerHTML = '';
            
        if (this.orders.length === 0) {
            this.ordersList.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #8e8e93;">
                    <i class="fas fa-receipt" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                    <div style="font-size: 15px;">No Order History Yet</div>
                </div>
            `;
            return;
        }

        this.orders.forEach((order, index) => {
            const el = document.createElement('div');
            el.style.cssText = 'background: #fff; border-radius: 16px; padding: 16px;  position: relative;';
                
            const itemNames = order.items.map(i => i.name).join(', ');
            let mediaHtml = '';
            order.items.slice(0, 3).forEach(item => {
                mediaHtml += `<div style="width: 40px; height: 40px; border-radius: 8px; background: ${item.mediaBg}; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 16px; flex-shrink: 0;">${item.iconHtml}</div>`;
            });
            if (order.items.length > 3) {
                mediaHtml += `<div style="width: 40px; height: 40px; border-radius: 8px; background: #f2f2f7; display: flex; justify-content: center; align-items: center; color: #8e8e93; font-size: 12px; font-weight: 600; flex-shrink: 0;">+${order.items.length - 3}</div>`;
            }

            let displayStatus = order.status;

            const ts = order.timestamp || order.id; // fallback to id which is Date.now()
            const elapsed = (Date.now() - ts) / 1000;
            const isFood = order.items.some(i => i.isFood);
                
            const step1Text = isFood ? 'picked' : 'shipped';
            const step2Text = isFood ? 'delivery' : 'in transit';
            const step3Text = 'delivered';

            const progress = Math.min(100, Math.max(0, (elapsed / 16) * 100));
            // Premium colors
            const cColor = isFood ? 'var(--shop-accent, #a97642)' : '#111111';
            const fColor = 'var(--shop-green, #476c5a)';
            const fGlow = isFood ? 'shopPulseGlow' : 'shopPulseGlowGreen';
                
            const s1Active = elapsed >= 0;
            const s2Active = elapsed >= 8;
            const s3Active = elapsed >= 16;

            const lineBg = s3Active ? fColor : cColor;
                
            // Add staggered animation delay
            const delay = index * 0.1;
            el.className = 'shopping-order-card';
            el.dataset.orderId = String(order.id);
            el.style.animationDelay = `${delay}s`;
            // Remove inline styles that clash with css classes
            el.style.cssText = `animation-delay: ${delay}s;`;
                
            el.innerHTML = `
                <div class="shopping-order-header">
                    <div class="shopping-order-date">${order.date}</div>
                    <button class="shopping-order-delete-btn shopping-order-delete" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                    
                <div class="shopping-order-progress">
                    <div class="shopping-order-track"></div>
                    <div class="shopping-order-fill" style="width: calc(68% * ${progress / 100}); background: ${lineBg};"></div>
                        
                    <div class="shopping-order-nodes">
                        <!-- Node 1 -->
                        <div class="shopping-order-node">
                            <div class="shopping-order-icon-wrap" style="background: ${s1Active ? cColor : '#f2f2f7'}; ${s1Active && !s2Active ? `animation: ${fGlow} 2s infinite;` : ''}">
                                <i class="fas fa-check" style="color: ${s1Active ? '#fff' : '#c7c7cc'};"></i>
                            </div>
                            <div class="shopping-order-node-text" style="color: ${s1Active ? '#111' : '#8e8e93'}; font-weight: ${s1Active ? '700' : '600'};">${step1Text}</div>
                        </div>
                        <!-- Node 2 -->
                        <div class="shopping-order-node">
                            <div class="shopping-order-icon-wrap" style="background: ${s2Active ? cColor : '#f2f2f7'}; ${s2Active && !s3Active ? `animation: ${fGlow} 2s infinite;` : ''}">
                                <i class="fas fa-motorcycle" style="color: ${s2Active ? '#fff' : '#c7c7cc'};"></i>
                            </div>
                            <div class="shopping-order-node-text" style="color: ${s2Active ? '#111' : '#8e8e93'}; font-weight: ${s2Active ? '700' : '600'};">${step2Text}</div>
                        </div>
                        <!-- Node 3 -->
                        <div class="shopping-order-node">
                            <div class="shopping-order-icon-wrap" style="background: ${s3Active ? fColor : '#f2f2f7'};">
                                <i class="fas fa-home" style="color: ${s3Active ? '#fff' : '#c7c7cc'};"></i>
                            </div>
                            <div class="shopping-order-node-text" style="color: ${s3Active ? '#111' : '#8e8e93'}; font-weight: ${s3Active ? '700' : '600'};">${step3Text}</div>
                        </div>
                    </div>
                </div>

                <div class="shopping-order-item-inline-wrap">
                    <div class="shopping-order-items-scroll inline-mode">
                        ${order.items.map(item => {
                            const mediaImage = this.getProductImage(item);
                            return `
                                <div class="shopping-order-item-media" style="background: ${item.mediaBg}; ${mediaImage ? `background-image: ${mediaImage}; background-position: center; background-size: cover; background-repeat: no-repeat;` : ''}">
                                    ${mediaImage ? '' : item.iconHtml}
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="shopping-order-title inline-mode">${itemNames}</div>
                </div>
                    
                <div class="shopping-order-footer">
                    <div class="shopping-order-method">${order.method}</div>
                    <div class="shopping-order-price-wrap">
                        <button class="shopping-order-gift-btn" data-index="${index}" style="margin-right: 8px; background: #000; color: #fff; border: none; border-radius: 12px; padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer;">Gift</button>
                        <button class="shopping-order-comment-btn" data-product="${order.items.length > 0 ? order.items[0].name : ''}">Review</button>
                        <div class="shopping-order-price">$${order.total.toFixed(2)}</div>
                    </div>
                </div>
            `;

            const giftBtn = el.querySelector('.shopping-order-gift-btn');
            if (giftBtn) {
                if (order.gifted) {
                    giftBtn.textContent = 'Gifted';
                    giftBtn.style.background = '#e5e5ea';
                    giftBtn.style.color = '#8e8e93';
                    giftBtn.style.cursor = 'default';
                } else {
                    giftBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const idx = parseInt(giftBtn.dataset.index, 10);
                        const orderToGift = this.orders[idx];
                        this.openGiftCharSelection(orderToGift, idx);
                    });
                }
            }

            const deleteBtn = el.querySelector('.shopping-order-delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = parseInt(deleteBtn.dataset.index, 10);
                    this.orders.splice(idx, 1);
                    this.saveOrders();
                    this.renderOrders();
                });
            }

            const commentBtn = el.querySelector('.shopping-order-comment-btn');
            if (commentBtn) {
                commentBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const productName = commentBtn.dataset.product;
                    if (!productName) return;
                        
                    this.currentReviewProduct = productName;
                    if (!this.ratingSheet) this.initRatingSheet();
                        
                    // Reset form
                    this.ratingText.value = '';
                    if (this.ratingStars) {
                        Array.from(this.ratingStars).forEach(s => {
                            s.className = 'fas fa-star';
                            s.style.color = '#ff9500';
                        });
                    }
                        
                    this.ratingSheet.classList.add('active');
                });
            }

            this.ordersList.appendChild(el);
        });
    }

    getProductImage(product) {
        const defaults = {
            'Espresson': 'assets/shopping/food-coffee.jpg',
            'Per Se Menu': 'assets/shopping/food-per-se.jpg',
            'Mase Omakase': 'assets/shopping/food-mase.jpg',
            'Romanée-Conti': 'assets/shopping/mall-drc.jpg',
            'Serpenti Viper Bracelet': 'assets/shopping/mall-bylgarl.jpg',
            'Hermes Birkin': 'assets/shopping/mall-hermes.jpg',
            'Vintage Alhambra': 'assets/shopping/mall-vca.jpg'
        };
        if (product.mediaImage && product.mediaImage !== 'none') {
            return product.mediaImage.replace(/"/g, "'");
        }
        return defaults[product.name] ? `url('${defaults[product.name]}')` : '';
    }

    setDetailMedia(element, product) {
        const hasImage = product.mediaImage && product.mediaImage !== 'none';
        element.innerHTML = hasImage ? '' : product.iconHtml;
        element.style.background = product.mediaBg;
        element.style.backgroundImage = hasImage ? product.mediaImage : '';
        element.style.backgroundPosition = 'center';
        element.style.backgroundSize = 'cover';
        element.style.backgroundRepeat = 'no-repeat';
    }

    openDetail(product, isFood = false) {
        product.isFood = isFood;
        this.currentProduct = product;
            
        if (isFood) {
            if (this.foodDetailName) this.foodDetailName.textContent = product.name;
            if (this.foodDetailPrice) {
                const val = product.price.replace('$', '');
                this.foodDetailPrice.innerHTML = `<span style="font-size: 16px;">$</span>${val}`;
            }
            if (this.foodBottomPrice) this.foodBottomPrice.textContent = product.price;
            if (this.foodDetailDesc) this.foodDetailDesc.textContent = product.desc;
            if (this.foodDetailMedia) {
                this.setDetailMedia(this.foodDetailMedia, product);
            }
            if (this.foodDetailSheet) {
                this.foodDetailSheet.classList.add('active');
            }
        } else {
            if (this.detailName) this.detailName.textContent = product.name;
            if (this.detailPrice) this.detailPrice.textContent = product.price;
            if (this.detailDesc) this.detailDesc.textContent = product.desc;
            if (this.detailMedia) {
                this.setDetailMedia(this.detailMedia, product);
            }
                
            // Update QA Trigger Preview
            this.renderQA(product.name, false);

            if (this.detailSheet) {
                this.detailSheet.classList.add('active');
            }
        }
            
        // Render comments for this product
        this.renderComments(product.name, isFood);
    }

    ["renderQA"](value_223, isFood_6) {
      const qaTrigger = document.getElementById("shopping-mall-qa-trigger"),
        shoppingQaContainerElement = document.getElementById("shopping-qa-container"),
        qaSheetTitle = document.getElementById("shopping-qa-sheet-title");
      if (!shoppingQaContainerElement) return;
      if (isFood_6) {
        if (qaTrigger) qaTrigger.style.display = "none";
        return;
      } else {
        if (qaTrigger) qaTrigger.style.display = "block";
      }
      let options_226 = {};
      try {
        const item_228 = durableStorage.getItem("shopping_qa");
        if (item_228) options_226 = JSON.parse(item_228);
      } catch (value_229) {}
      const items_227 = options_226[value_223] || [];
      if (qaSheetTitle) qaSheetTitle.textContent = "Q&A (" + items_227.length + ")";
      if (qaTrigger) {
        qaTrigger.innerHTML = "\n                    <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;\">\n                        <div style=\"font-size: 16px; font-weight: 700; color: #111;\">Q&A (" + items_227.length + ")</div>\n                        <div style=\"font-size: 13px; color: #111; font-weight: 600; display: flex; align-items: center;\">See All <i class=\"fas fa-chevron-right\" style=\"font-size: 10px; margin-left: 4px;\"></i></div>\n                    </div>\n                ";
        if (items_227.length === 0) qaTrigger.innerHTML += "<div style=\"font-size: 14px; color: #8e8e93;\">No Q&A yet</div>";else {
          const slice_230 = items_227.slice(0, 2);
          slice_230.forEach(value_231 => {
            const randomAnswersCount = Math.floor(Math.random() * 5) + 1;
            qaTrigger.innerHTML += "\n                            <div style=\"display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;\">\n                                <span style=\"background: #111; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-top: 2px;\">Q</span>\n                                <div style=\"flex: 1; font-size: 14px; color: #111; line-height: 1.4;\">" + value_231.q + "</div>\n                                <div style=\"font-size: 12px; color: #8e8e93; white-space: nowrap;\">" + randomAnswersCount + " answers</div>\n                            </div>\n                        ";
          });
        }
      }
      shoppingQaContainerElement.innerHTML = "";
      items_227.length === 0 ? shoppingQaContainerElement.innerHTML = "<div style=\"text-align: center; color: #8e8e93; font-size: 14px; padding: 20px 0;\">No Q&A yet</div>" : items_227.forEach(value_233 => {
        const element_234 = document.createElement("div");
        element_234.style.cssText = "display: flex; flex-direction: column; gap: 8px; padding-bottom: 12px; border-bottom: 1px solid rgba(17,17,17,0.05);";
        element_234.innerHTML = "\n                        <div style=\"display: flex; align-items: flex-start; gap: 8px;\">\n                            <span style=\"background: #111; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-top: 2px;\">Q</span>\n                            <div style=\"font-size: 15px; font-weight: 600; color: #111; line-height: 1.4;\">" + value_233.q + "</div>\n                        </div>\n                        <div style=\"display: flex; align-items: flex-start; gap: 8px; margin-top: 4px;\">\n                            <span style=\"background: #e5e5ea; color: #8e8e93; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-top: 2px;\">A</span>\n                            <div style=\"font-size: 14px; color: #333; line-height: 1.5;\">" + value_233.a + "</div>\n                        </div>\n                    ";
        shoppingQaContainerElement.appendChild(element_234);
      });
    }
    ["renderComments"](value_235, isFood_7) {
      const sheet = isFood_7 ? this.foodDetailSheet : this.detailSheet;
      if (!sheet) return;
      const oldContainer = sheet.querySelector(isFood_7 ? "#shopping-food-detail-comments" : "#shopping-detail-comments");
      oldContainer && (oldContainer.style.display = "none");
      let reviewsContainerList_2, titleEl;
      if (isFood_7) {
        const allDivs = sheet.querySelectorAll("div");
        for (let div of allDivs) {
          if (div.textContent.includes("Delivery Reviews") && div.style.fontSize === "15px") {
            titleEl = div;
            reviewsContainerList_2 = div.parentElement.lastElementChild;
            break;
          }
        }
      } else {
        const allDivs_2 = sheet.querySelectorAll("div");
        for (let div_2 of allDivs_2) {
          if (div_2.textContent.includes("Reviews") && div_2.style.fontSize === "16px") {
            titleEl = div_2;
            reviewsContainerList_2 = div_2.parentElement.lastElementChild;
            break;
          }
        }
      }
      if (!reviewsContainerList_2) return;
      let options_241 = {};
      try {
        const item_246 = durableStorage.getItem("shopping_comments");
        if (item_246) options_241 = JSON.parse(item_246);
      } catch (value_247) {}
      const value_242 = options_241[value_235] || [];
      titleEl && (titleEl.textContent = isFood_7 ? "Delivery Reviews (" + value_242.length + ")" : "Reviews (" + value_242.length + ")");
      reviewsContainerList_2.innerHTML = "";
      value_242.length === 0 && (reviewsContainerList_2.innerHTML = "<div style=\"font-size: 14px; color: #8e8e93; text-align: center; padding: 10px 0;\">No reviews yet</div>");
    }
    ["initRatingSheet"]() {
      if (document.getElementById("shopping-rating-sheet")) return;
      const sheetHtml = "\n            <div class=\"bottom-sheet-overlay detail-sheet-overlay\" id=\"shopping-rating-sheet\" style=\"z-index: 1200;\">\n                <div class=\"bottom-sheet\" style=\"height: auto; max-height: 70%; padding-bottom: max(20px, env(safe-area-inset-bottom, 0px)); background: #ffffff;\">\n                    <div class=\"sheet-handle\"></div>\n                    <div class=\"sheet-title\" id=\"shopping-rating-title\">Product Review</div>\n                    <div class=\"detail-sheet-content\" style=\"padding: 16px;\">\n                        <div style=\"display: flex; justify-content: center; gap: 15px; margin-bottom: 24px;\" id=\"shopping-rating-stars\">\n                            <i class=\"fas fa-star\" data-val=\"1\" style=\"font-size: 32px; color: #ff9500; cursor: pointer;\"></i>\n                            <i class=\"fas fa-star\" data-val=\"2\" style=\"font-size: 32px; color: #ff9500; cursor: pointer;\"></i>\n                            <i class=\"fas fa-star\" data-val=\"3\" style=\"font-size: 32px; color: #ff9500; cursor: pointer;\"></i>\n                            <i class=\"fas fa-star\" data-val=\"4\" style=\"font-size: 32px; color: #ff9500; cursor: pointer;\"></i>\n                            <i class=\"fas fa-star\" data-val=\"5\" style=\"font-size: 32px; color: #ff9500; cursor: pointer;\"></i>\n                        </div>\n                        <textarea id=\"shopping-rating-text\" placeholder=\"If you want to create something of value, be prepared to be judged.\" style=\"width: 100%; height: 120px; border: none; background: #f6f6f8; border-radius: 12px; padding: 16px; font-size: 15px; resize: none; outline: none; margin-bottom: 20px; box-sizing: border-box;\"></textarea>\n                        <button type=\"button\" id=\"shopping-rating-submit\" style=\"width: 100%; padding: 16px; background: #111; color: #fff; border-radius: 12px; font-size: 16px; font-weight: 700; border: none; cursor: pointer;\">submit review</button>\n                    </div>\n                </div>\n            </div>";
      document.body.insertAdjacentHTML("beforeend", sheetHtml);
      this.ratingSheet = document.getElementById("shopping-rating-sheet");
      this.ratingStars = document.getElementById("shopping-rating-stars").children;
      this.ratingText = document.getElementById("shopping-rating-text");
      this.ratingSubmit = document.getElementById("shopping-rating-submit");
      let rating_2 = 5;
      Array.from(this.ratingStars).forEach(value_250 => {
        value_250.addEventListener("click", e_8 => {
          rating_2 = parseInt(e_8.target.dataset.val, 10);
          Array.from(this.ratingStars).forEach((element_252, value_253) => {
            value_253 < rating_2 ? (element_252.className = "fas fa-star", element_252.style.color = "#ff9500") : (element_252.className = "far fa-star", element_252.style.color = "#e5e5ea");
          });
        });
      });
      this.ratingSubmit.addEventListener("click", () => {
        const text_2 = this.ratingText.value.trim();
        if (!text_2) {
          if (window.showToast) window.showToast("请输入评价内容");else alert("请输入评价内容");
          return;
        }
        if (!this.currentReviewProduct) return;
        let commentsObj_2 = {};
        try {
          const item_256 = durableStorage.getItem("shopping_comments");
          if (item_256) commentsObj_2 = JSON.parse(item_256);
        } catch (value_257) {}
        !commentsObj_2[this.currentReviewProduct] && (commentsObj_2[this.currentReviewProduct] = []);
        commentsObj_2[this.currentReviewProduct].unshift({
          user: "我",
          text: text_2,
          rating: rating_2,
          date: new Date().toLocaleDateString()
        });
        durableStorage.setItem("shopping_comments", JSON.stringify(commentsObj_2));
        if (window.showToast) window.showToast("Review published");else alert("Review published");
        this.ratingSheet.classList.remove("active");
        this.currentProduct && this.currentProduct.name === this.currentReviewProduct && this.renderComments(this.currentReviewProduct, this.currentProduct.isFood);
      });
      this.ratingSheet.addEventListener("click", event_258 => {
        event_258.target === this.ratingSheet && this.ratingSheet.classList.remove("active");
      });
    }
    ["openAllReviews"](value_259, value_260) {
      const shoppingAllReviewsSheetElement_261 = document.getElementById("shopping-all-reviews-sheet"),
        container_2 = document.getElementById("shopping-all-reviews-container"),
        titleEl_2 = document.getElementById("shopping-all-reviews-sheet-title");
      if (!shoppingAllReviewsSheetElement_261 || !container_2) return;
      let options_262 = {};
      try {
        const item_264 = durableStorage.getItem("shopping_comments");
        if (item_264) options_262 = JSON.parse(item_264);
      } catch (value_265) {}
      const items_263 = options_262[value_259] || [];
      titleEl_2 && (titleEl_2.textContent = value_260 ? "Delivery Reviews (" + items_263.length + ")" : "Reviews (" + items_263.length + ")");
      container_2.innerHTML = "";
      items_263.length === 0 ? container_2.innerHTML = "<div style=\"text-align: center; padding: 40px; color: #8e8e93;\">No reviews yet</div>" : items_263.forEach(value_266 => {
        const element_267 = document.createElement("div");
        element_267.style.cssText = "display: flex; gap: 12px; align-items: flex-start; padding-bottom: 12px; border-bottom: 1px solid rgba(17,17,17,0.05);";
        let starsHtml = "";
        const value_269 = value_266.rating || 5;
        for (let count_270 = 0; count_270 < 5; count_270++) {
          count_270 < value_269 ? starsHtml += "<i class=\"fas fa-star\" style=\"color: #ff9500; font-size: 10px;\"></i>" : starsHtml += "<i class=\"far fa-star\" style=\"color: #e5e5ea; font-size: 10px;\"></i>";
        }
        element_267.innerHTML = "\n                        <div style=\"width: 40px; height: 40px; border-radius: 50%; background: #f2f2f7; display: flex; justify-content: center; align-items: center; font-size: 16px; color: #8e8e93; flex-shrink: 0;\"><i class=\"fas fa-user\"></i></div>\n                        <div style=\"flex: 1;\">\n                            <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;\">\n                                <div style=\"font-size: 15px; font-weight: 600; color: #111;\">" + value_266.user + "</div>\n                                <div style=\"font-size: 12px; color: #8e8e93;\">" + value_266.date + "</div>\n                            </div>\n                            <div style=\"margin-bottom: 8px; display: flex; gap: 2px;\">" + starsHtml + "</div>\n                            <div style=\"font-size: 15px; color: #333; line-height: 1.5;\">" + value_266.text + "</div>\n                        </div>\n                    ";
        container_2.appendChild(element_267);
      });
      shoppingAllReviewsSheetElement_261.classList.add("active");
    }
    ["closeDetail"]() {
      if (this.detailSheet) this.detailSheet.classList.remove("active");
      if (this.foodDetailSheet) this.foodDetailSheet.classList.remove("active");
    }
    ["loadCart"]() {
      try {
        const savedCart = durableStorage.getItem("shopping_cart");
        if (savedCart) {
          const result_272 = JSON.parse(savedCart);
          if (!Array.isArray(result_272)) return [];
          const map_273 = result_272.map(value_274 => ({
            ...value_274,
            priceVal: handleAction_4(value_274?.price || value_274?.priceVal)
          }));
          return JSON.stringify(result_272) !== JSON.stringify(map_273) && durableStorage.setItem("shopping_cart", JSON.stringify(map_273)), map_273;
        }
      } catch (e_9) {
        console.error("Failed to load cart from localStorage", e_9);
      }
      return [];
    }
    ["saveCart"]() {
      try {
        durableStorage.setItem("shopping_cart", JSON.stringify(this.cart));
      } catch (e_10) {
        console.error("Failed to save cart to localStorage", e_10);
      }
    }
    ["addToCart"](value_277) {
      const priceVal_2 = handleAction_4(value_277.price);
      this.cart.push({
        ...value_277,
        priceVal: priceVal_2,
        id: handleAction_5("cart")
      });
      this.saveCart();
      this.renderCart();
    }
    ["removeFromCart"](value_279) {
      this.cart.splice(value_279, 1);
      this.saveCart();
      this.renderCart();
    }
    renderCart() {
        if (!this.cartEmptyState || !this.cartContent || !this.cartList) return;

        if (this.cart.length === 0) {
            this.cartEmptyState.style.display = 'flex';
            this.cartContent.style.display = 'none';
            return;
        }

        this.cartEmptyState.style.display = 'none';
        this.cartContent.style.display = 'flex';
            
        this.cartList.innerHTML = '';
        let subtotal = 0;

        this.cart.forEach((item, index) => {
            subtotal += item.priceVal;
            const mediaImage = this.getProductImage(item);
                
            const itemEl = document.createElement('div');
            itemEl.style.display = 'flex';
            itemEl.style.alignItems = 'center';
            itemEl.style.gap = '15px';
            itemEl.style.padding = '10px';
            itemEl.style.background = '#fff';
            itemEl.style.borderRadius = '12px';
            itemEl.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                
            itemEl.innerHTML = `
                <div style="width: 50px; height: 50px; border-radius: 10px; background: ${item.mediaBg}; ${mediaImage ? `background-image: ${mediaImage}; background-position: center; background-size: cover; background-repeat: no-repeat;` : ''} display: flex; justify-content: center; align-items: center; color: #fff; font-size: 20px;">
                    ${mediaImage ? '' : item.iconHtml}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 700; font-size: 15px;">${item.name}</div>
                    <div style="color: #a97642; font-weight: 700; margin-top: 4px;">${item.price}</div>
                </div>
                <div class="shopping-cart-remove" style="width: 30px; height: 30px; border-radius: 50%; background: #ffebee; color: #ff3b30; display: flex; justify-content: center; align-items: center; cursor: pointer;">
                    <i class="fas fa-trash-alt" style="font-size: 12px;"></i>
                </div>
            `;
                
            const removeBtn = itemEl.querySelector('.shopping-cart-remove');
            removeBtn.addEventListener('click', () => {
                this.removeFromCart(index);
            });
                
            this.cartList.appendChild(itemEl);
        });

        if (this.cartSubtotal) this.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        const deliveryFee = 5;
        if (this.cartTotal) this.cartTotal.textContent = `$${(subtotal + deliveryFee).toFixed(2)}`;
    }

    ["open"]() {
      if (!this.view) return;
      this.syncProfile();
      this.view.style.display = "flex";
      window.requestAnimationFrame(() => {
        this.view.classList.add("active");
        this.switchTab("food", {
          force: true
        });
      });
      document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", "#fbfbfc");
    }
    ["close"]() {
      if (!this.view) return;
      this.stopOrdersRefresh();
      this.view.classList.remove("active");
      window.setTimeout(() => {
        !this.view.classList.contains("active") && (this.view.style.display = "none");
      }, 340);
      document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", "#ffffff");
    }
    ["switchTab"](tab_3, options_2 = {}) {
      const currentTab_2 = this.tabs.includes(tab_3) ? tab_3 : "food";
      if (this.hasSelectedTab && this.currentTab === currentTab_2 && !options_2.force) return;
      const shouldScroll = options_2.scroll !== false;
      this.currentTab = currentTab_2;
      this.hasSelectedTab = true;
      if (currentTab_2 === "me") this.syncProfile();
      this.navItems?.forEach(element_288 => {
        const value_289 = element_288.dataset.tab === currentTab_2;
        element_288.classList.toggle("active", value_289);
        element_288.setAttribute("aria-pressed", String(value_289));
      });
      this.panels?.forEach(element_290 => {
        element_290.classList.toggle("active", element_290.dataset.tab === currentTab_2);
      });
      if (shouldScroll && this.panelsWrap) {
        const index_6 = this.tabs.indexOf(currentTab_2);
        this.panelsWrap.scrollTo({
          left: index_6 * this.panelsWrap.clientWidth,
          behavior: "auto"
        });
      }
      this.updateIndicator();
    }
    ["updateIndicator"]() {
      if (!this.indicator || !this.navItems || !this.navItems.length) return;
      const activeItem = this.navItems.find(item_5 => item_5.dataset.tab === this.currentTab) || this.navItems[0],
        nav = activeItem.closest(".shopping-bottom-nav");
      if (!nav) return;
      const navRect = nav.getBoundingClientRect(),
        itemRect = activeItem.getBoundingClientRect(),
        navStyle = window.getComputedStyle(nav),
        inset = parseFloat(navStyle.paddingLeft) || 0,
        offset = itemRect.left - navRect.left - inset;
      this.indicator.style.width = itemRect.width + "px";
      this.indicator.style.transform = "translateX(" + offset + "px)";
    }
  }
  function handleAction_8() {
    if (window.shoppingApp) return window.shoppingApp;
    window.shoppingApp = new ShoppingApp();
    const appBtn = document.getElementById("app-shopping-btn");
    return appBtn && appBtn.addEventListener("click", event_2 => {
      event_2.stopPropagation();
      if (window.isJiggleMode) return;
      window.shoppingApp?.open();
    }), window.shoppingApp;
  }
  function initShoppingAppAfterStorageReady() {
    if (window.shoppingDataReadyPromise) return window.shoppingDataReadyPromise;
    const initialize = () => {
      return handleAction_8(), true;
    };
    return window.globalDataReadyPromise && typeof window.globalDataReadyPromise.then === "function" ? window.shoppingDataReadyPromise = window.globalDataReadyPromise.then(initialize)["catch"](error_2 => {
      return console.warn("Shopping global data recovery failed:", error_2), initialize(), false;
    }) : (initialize(), window.shoppingDataReadyPromise = Promise.resolve(true)), window.shoppingDataReadyPromise;
  }
  (window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(initShoppingAppAfterStorageReady);
})();
