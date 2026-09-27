(function () {
  document.addEventListener("touchmove", function (event) {
    (event.target === document.body || event.target === document.documentElement || event.target.id === "app") && event.preventDefault();
  }, {
    passive: false
  });
  let lastTap = 0;
  document.addEventListener("touchend", function (e_2) {
    const now_2 = Date.now(),
      closest_6 = e_2.target?.closest?.(".library-reader-scroll");
    if (closest_6) {
      lastTap = now_2;
      return;
    }
    if (now_2 - lastTap < 300) {
      if (e_2.cancelable) e_2.preventDefault();
    }
    lastTap = now_2;
  }, {
    passive: false
  });
  function isStandalone() {
    return "standalone" in window.navigator && window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
  }
  window.openView = function (viewElement) {
    if (viewElement) viewElement.classList.add("active");
  };
  window.closeView = function (viewElement_2) {
    if (viewElement_2) viewElement_2.classList.remove("active");
  };
  typeof window.showCustomModal !== "function" && (window.showCustomModal = function (options) {
    const overlay = document.getElementById("custom-modal-overlay");
    if (!overlay) return;
    const titleEl = document.getElementById("modal-title"),
      messageEl = document.getElementById("modal-message"),
      cancelBtn = document.getElementById("modal-cancel-btn"),
      confirmBtn = document.getElementById("modal-confirm-btn");
    if (titleEl) titleEl.textContent = options.title || "提示";
    if (messageEl) messageEl.textContent = options.message || "";
    cancelBtn && (cancelBtn.textContent = options.cancelText || "取消", cancelBtn.onclick = () => {
      window.closeView(overlay);
      if (options.onCancel) options.onCancel();
    });
    if (confirmBtn) {
      confirmBtn.textContent = options.confirmText || "确定";
      if (options.confirmTone === "dark") {
        confirmBtn.style.color = "#fff";
        confirmBtn.style.background = "#111";
      } else options.isDestructive ? (confirmBtn.style.color = "#ff3b30", confirmBtn.style.background = "") : (confirmBtn.style.color = "#007aff", confirmBtn.style.background = "");
      confirmBtn.onclick = () => {
        window.closeView(overlay);
        if (options.onConfirm) options.onConfirm();
      };
    }
    const promptContent = document.getElementById("modal-prompt-content"),
      confirmContent = document.getElementById("modal-confirm-content"),
      promptConfirmBtn = document.getElementById("modal-prompt-confirm-btn"),
      modalInput = document.getElementById("modal-input");
    if (options.type === "prompt") {
      if (promptContent) promptContent.style.display = "block";
      if (confirmContent) confirmContent.style.display = "none";
      if (confirmBtn) confirmBtn.style.display = "none";
      promptConfirmBtn && (promptConfirmBtn.style.display = "block", promptConfirmBtn.textContent = options.confirmText || "确定", promptConfirmBtn.style.background = options.confirmTone === "dark" ? "#111" : "#007aff", promptConfirmBtn.style.color = "#fff", promptConfirmBtn.onclick = () => {
        window.closeView(overlay);
        if (options.onConfirm) options.onConfirm(modalInput ? modalInput.value : "");
      });
      modalInput && (modalInput.placeholder = options.placeholder || "请输入", modalInput.value = options.defaultValue || "");
    } else {
      if (promptContent) promptContent.style.display = "none";
      if (confirmContent) confirmContent.style.display = "block";
      if (confirmBtn) confirmBtn.style.display = "block";
      if (promptConfirmBtn) promptConfirmBtn.style.display = "none";
    }
    window.openView(overlay);
  });
  let toastTimeout = null;
  window.showToast = function (textContent_2, duration = 2000) {
    let toast = document.getElementById("global-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "global-toast";
      toast.className = "toast-bubble";
      const screen = document.getElementById("app");
      screen ? screen.appendChild(toast) : document.body.appendChild(toast);
    }
    toast.textContent = textContent_2;
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  };
  window.formatChatBubbleTime = function (value_10) {
    if (!value_10) return "";
    const date = new Date(value_10),
      now_3 = new Date(),
      y = date.getFullYear(),
      m = (date.getMonth() + 1).toString().padStart(2, "0"),
      d = date.getDate().toString().padStart(2, "0"),
      hh = date.getHours().toString().padStart(2, "0"),
      mm = date.getMinutes().toString().padStart(2, "0"),
      isToday = y === now_3.getFullYear() && date.getMonth() === now_3.getMonth() && date.getDate() === now_3.getDate(),
      isThisYear = y === now_3.getFullYear();
    if (isToday) return hh + ":" + mm;else return isThisYear ? m + "/" + d + " " + hh + ":" + mm : y + "/" + m + "/" + d + " " + hh + ":" + mm;
  };
  function getAllMainGrids() {
    return [...document.querySelectorAll(".main-grid")];
  }
  function getMaxHomePageIndex() {
    return Math.max(getAllMainGrids().length - 1, 0);
  }
  function getCurrentHomePageIndex() {
    const pagesContainerEl = document.getElementById("pages-container");
    if (!pagesContainerEl || !pagesContainerEl.clientWidth) return 0;
    const maxIndex = getMaxHomePageIndex();
    return Math.min(maxIndex, Math.max(0, Math.round(pagesContainerEl.scrollLeft / pagesContainerEl.clientWidth)));
  }
  function handleAction_3(index_2, behavior_2 = "smooth") {
    const pagesContainerEl_2 = document.getElementById("pages-container");
    if (!pagesContainerEl_2 || !pagesContainerEl_2.clientWidth) return 0;
    const targetIndex = Math.min(getMaxHomePageIndex(), Math.max(0, index_2));
    return pagesContainerEl_2.scrollTo({
      left: targetIndex * pagesContainerEl_2.clientWidth,
      behavior: behavior_2
    }), targetIndex;
  }
  function updateHomePageIndicators(pageIndex = getCurrentHomePageIndex()) {
    const dots = document.querySelectorAll(".page-indicators .dot");
    dots.forEach((dot, index) => {
      if (index === pageIndex) dot.classList.add("active");else dot.classList.remove("active");
    });
    document.querySelectorAll("#pages-container > .page-wrapper").forEach((page, index_3) => {
      page.classList.toggle("is-current", index_3 === pageIndex);
    });
  }
  const pagesContainer = document.getElementById("pages-container");
  if (pagesContainer) {
    let isDown = false,
      startX,
      scrollLeft_2,
      dragRAF = null,
      pendingScrollLeft = null,
      indicatorSettleTimer = null,
      pageWidth = Math.max(1, pagesContainer.clientWidth),
      activeIndicatorPage = -1;
    function refreshPageWidth(width_2 = pagesContainer.clientWidth) {
      if (Number.isFinite(width_2) && width_2 > 0) pageWidth = width_2;
    }
    function renderPendingMouseScroll() {
      dragRAF = null;
      if (pendingScrollLeft === null) return;
      pagesContainer.scrollLeft = pendingScrollLeft;
      pendingScrollLeft = null;
    }
    function flushPendingMouseScroll() {
      dragRAF !== null && (cancelAnimationFrame(dragRAF), dragRAF = null);
      renderPendingMouseScroll();
    }
    function cancelPendingMouseScroll() {
      if (dragRAF !== null) cancelAnimationFrame(dragRAF);
      dragRAF = null;
      pendingScrollLeft = null;
    }
    function updateVisiblePageIndicator() {
      const pageIndex_2 = Math.min(getMaxHomePageIndex(), Math.max(0, Math.round(pagesContainer.scrollLeft / pageWidth)));
      if (pageIndex_2 === activeIndicatorPage) return;
      activeIndicatorPage = pageIndex_2;
      updateHomePageIndicators(pageIndex_2);
    }
    function finishMouseDrag() {
      if (!isDown) return;
      isDown = false;
      flushPendingMouseScroll();
      pagesContainer.style.scrollSnapType = "";
      pagesContainer.style.cursor = "";
      snapToNearestPage();
    }
    pagesContainer.addEventListener("mousedown", e => {
      if (window.isJiggleMode || window.preventAppClick || e.target.closest(".bottom-sheet-overlay")) return;
      isDown = true;
      refreshPageWidth();
      startX = e.clientX;
      scrollLeft_2 = pagesContainer.scrollLeft;
      pagesContainer.style.scrollSnapType = "none";
      pagesContainer.style.cursor = "grabbing";
    });
    pagesContainer.addEventListener("mouseleave", finishMouseDrag);
    pagesContainer.addEventListener("mouseup", finishMouseDrag);
    pagesContainer.addEventListener("mousemove", e_3 => {
      if (!isDown) return;
      if (window.isJiggleMode) {
        isDown = false;
        cancelPendingMouseScroll();
        pagesContainer.style.scrollSnapType = "";
        pagesContainer.style.cursor = "";
        return;
      }
      e_3.preventDefault();
      const walk = (e_3.clientX - startX) * 1.5;
      pendingScrollLeft = scrollLeft_2 - walk;
      if (dragRAF === null) dragRAF = requestAnimationFrame(renderPendingMouseScroll);
    });
    function snapToNearestPage() {
      const pageIndex_3 = Math.min(getMaxHomePageIndex(), Math.max(0, Math.round(pagesContainer.scrollLeft / pageWidth)));
      pagesContainer.scrollTo({
        left: pageIndex_3 * pageWidth,
        behavior: "smooth"
      });
    }
    function settleVisiblePageIndicator() {
      indicatorSettleTimer !== null && (clearTimeout(indicatorSettleTimer), indicatorSettleTimer = null);
      updateVisiblePageIndicator();
    }
    "onscrollend" in pagesContainer ? pagesContainer.addEventListener("scrollend", settleVisiblePageIndicator, {
      passive: true
    }) : pagesContainer.addEventListener("scroll", () => {
      if (indicatorSettleTimer !== null) clearTimeout(indicatorSettleTimer);
      indicatorSettleTimer = window.setTimeout(settleVisiblePageIndicator, 120);
    }, {
      passive: true
    });
    if (typeof ResizeObserver === "function") {
      const pageResizeObserver = new ResizeObserver(entries => {
        refreshPageWidth(entries[0]?.contentRect?.width);
      });
      pageResizeObserver.observe(pagesContainer);
    } else window.addEventListener("resize", () => refreshPageWidth(), {
      passive: true
    });
    updateVisiblePageIndicator();
  }
  document.addEventListener("DOMContentLoaded", () => {
    isStandalone() ? console.log("App is running in Standalone (Fullscreen) mode.") : console.log("App is running in Browser mode.");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        typeof window.removeSplashScreen === "function" && window.removeSplashScreen();
      });
    });
  });
})();
