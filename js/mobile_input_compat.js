(function () {
  const isAndroid_3 = /Android/i.test(navigator.userAgent || ""),
    registrations = new Map(),
    value_4 = new Map(),
    bottomSheetExcludedInputTypes = new Set(["file", "hidden", "checkbox", "radio", "range", "color"]);
  let activeEntry = null,
    activeFocusScope = null,
    enabled = false,
    enabled_5 = false,
    focusScopeViewportFrame = 0,
    enabled_6 = false,
    focusScopeViewportFrame_2 = 0;
  const bottomSheetFocusGuard = {
    active: false,
    overlay: null,
    scrollLeft: 0,
    scrollTop: 0,
    previousScrollSnapType: "",
    previousScrollBehavior: "",
    previousOverflowX: "",
    previousTouchAction: "",
    target: null,
    restingHeight: 0,
    restingLayoutHeight: 0,
    keyboardWasOpen: false,
    appliedViewportHeight: 0,
    appliedViewportTop: 0,
    originalOverlayHeight: "",
    originalOverlayTop: "",
    originalOverlayBottom: "",
    restoreTimers: []
  };
  function resolveElement(value_2) {
    if (typeof value_2 === "function") return value_2() || null;
    if (typeof value_2 === "string") return document.querySelector(value_2);
    return value_2 || null;
  }
  function getViewportMetrics() {
    const viewport = window.visualViewport;
    return {
      height: Math.round(viewport?.height || window.innerHeight || 0),
      width: Math.round(viewport?.width || window.innerWidth || 0)
    };
  }
  function getPagesContainer() {
    return document.getElementById("pages-container");
  }
  function isBottomSheetEditableTarget(target_2) {
    if (!target_2 || !target_2.closest || target_2.disabled) return false;
    const tagName_2 = target_2.tagName;
    if (tagName_2 === "TEXTAREA") return !target_2.readOnly;
    if (tagName_2 === "SELECT") return true;
    if (target_2.isContentEditable || target_2.getAttribute?.("contenteditable") === "true") return true;
    if (tagName_2 !== "INPUT") return false;
    const type_2 = String(target_2.getAttribute("type") || target_2.type || "text").toLowerCase();
    return !target_2.readOnly && !bottomSheetExcludedInputTypes.has(type_2);
  }
  function resolveFocusScope(target_3) {
    if (!isAndroid_3 || !isBottomSheetEditableTarget(target_3)) return null;
    let resolvedScope = null;
    for (const registration_2 of value_4.values()) {
      let root_2 = null;
      try {
        root_2 = target_3.closest(registration_2.selector);
      } catch (error_2) {
        console.warn("[mobileInputCompat] Invalid focus scope selector:", registration_2.selector, error_2);
      }
      if (!root_2) continue;
      (!resolvedScope || registration_2.priority > resolvedScope.registration.priority) && (resolvedScope = {
        registration: registration_2,
        root: root_2,
        target: target_3
      });
    }
    return resolvedScope;
  }
  function restoreFocusScopeWindowPosition(scope_2 = activeFocusScope) {
    if (!isAndroid_3 || !scope_2) return;
    if (activeFocusScope && activeFocusScope !== scope_2) return;
    try {
      window.scrollTo(scope_2.scrollLeft, scope_2.scrollTop);
    } catch (value_40) {}
    document.documentElement.scrollLeft = scope_2.scrollLeft;
    document.documentElement.scrollTop = scope_2.scrollTop;
    document.body.scrollLeft = scope_2.scrollLeft;
    document.body.scrollTop = scope_2.scrollTop;
  }
  function clearFocusScopeRestoreTimers(scope = activeFocusScope) {
    if (!scope) return;
    scope.restoreTimers.forEach(timer => clearTimeout(timer));
    scope.restoreTimers = [];
  }
  function scheduleFocusScopeWindowRestore(scope_3 = activeFocusScope) {
    if (!isAndroid_3 || !scope_3 || scope_3 !== activeFocusScope) return;
    clearFocusScopeRestoreTimers(scope_3);
    requestAnimationFrame(() => restoreFocusScopeWindowPosition(scope_3));
    [0, 60, 180, 360].forEach(delay => {
      scope_3.restoreTimers.push(setTimeout(() => restoreFocusScopeWindowPosition(scope_3), delay));
    });
  }
  function getFocusScopeScrollContainer(scope_4) {
    if (!scope_4 || typeof scope_4.registration.resolveScrollContainer !== "function") return null;
    try {
      return resolveElement(scope_4.registration.resolveScrollContainer(scope_4.target, scope_4.root));
    } catch (error_3) {
      return console.warn("[mobileInputCompat] Failed to resolve focus-scope scroll container:", error_3), null;
    }
  }
  function getFocusScopeViewportConfig(registration_3) {
    return {
      className: String(registration_3?.viewportClassName || "").trim(),
      heightCssVariable: String(registration_3?.viewportHeightCssVariable || "").trim(),
      topCssVariable: String(registration_3?.viewportTopCssVariable || "").trim()
    };
  }
  function handleAction_8(value_45, value_46, value_47) {
    if (typeof value_45?.resolveViewportRoot !== "function") return value_47;
    try {
      return resolveElement(value_45.resolveViewportRoot(value_46, value_47)) || value_47;
    } catch (value_48) {
      return console.warn("[mobileInputCompat] Failed to resolve focus-scope viewport root:", value_48), value_47;
    }
  }
  function scrollFocusScopeToLatest(scope_5) {
    const scrollContainer_2 = getFocusScopeScrollContainer(scope_5);
    if (!scrollContainer_2) return;
    requestAnimationFrame(() => {
      scrollContainer_2.scrollTop = scrollContainer_2.scrollHeight;
    });
  }
  function scrollFocusScopeTargetIntoView(event_51) {
    const scrollContainer_3 = getFocusScopeScrollContainer(event_51),
      target_4 = event_51?.target;
    if (!scrollContainer_3 || !target_4?.isConnected) return;
    requestAnimationFrame(() => {
      const containerRect = scrollContainer_3.getBoundingClientRect(),
        targetRect = target_4.getBoundingClientRect(),
        padding = 16,
        visibleTop = containerRect.top + padding,
        visibleBottom = containerRect.bottom - padding;
      if (targetRect.top < visibleTop) scrollContainer_3.scrollTop += targetRect.top - visibleTop;else targetRect.bottom > visibleBottom && (scrollContainer_3.scrollTop += targetRect.bottom - visibleBottom);
    });
  }
  function scrollFocusScopeContent(scope_6) {
    if (scope_6?.registration.scrollBehavior === "focus") {
      scrollFocusScopeTargetIntoView(scope_6);
      return;
    }
    scrollFocusScopeToLatest(scope_6);
  }
  function restoreFocusScopeViewport(root_3, originalRoot_2, viewportConfig) {
    if (!root_3?.style) return;
    if (viewportConfig.className) {
      viewportConfig.heightCssVariable && (originalRoot_2.heightCssValue ? root_3.style.setProperty(viewportConfig.heightCssVariable, originalRoot_2.heightCssValue) : root_3.style.removeProperty(viewportConfig.heightCssVariable));
      viewportConfig.topCssVariable && (originalRoot_2.topCssValue ? root_3.style.setProperty(viewportConfig.topCssVariable, originalRoot_2.topCssValue) : root_3.style.removeProperty(viewportConfig.topCssVariable));
      root_3.classList.remove(viewportConfig.className);
      return;
    }
    root_3.style.height = originalRoot_2.height;
    root_3.style.top = originalRoot_2.top;
    root_3.style.bottom = originalRoot_2.bottom;
    root_3.classList.remove("u2-android-keyboard-open");
  }
  function restoreFocusScopeLayout(scope_7 = activeFocusScope, options_2 = {}) {
    if (!scope_7) return;
    const root_4 = scope_7.viewportRoot || scope_7.root,
      {
        originalRoot: originalRoot_3
      } = scope_7;
    restoreFocusScopeViewport(root_4, originalRoot_3, getFocusScopeViewportConfig(scope_7.registration));
    scope_7.keyboardWasOpen = false;
    scope_7.appliedViewportHeight = 0;
    scope_7.appliedViewportTop = 0;
    restoreFocusScopeWindowPosition(scope_7);
    if (options_2.scrollToLatest) scrollFocusScopeContent(scope_7);
  }
  function handleAction_11(value_63, value_64 = {}) {
    if (!value_63) return;
    clearFocusScopeRestoreTimers(value_63);
    [0, 60, 180, 360].forEach(value_65 => {
      value_63.restoreTimers.push(setTimeout(() => {
        if (activeFocusScope) return;
        restoreFocusScopeLayout(value_63, value_64);
      }, value_65));
    });
  }
  function releaseFocusScope(scope_8 = activeFocusScope) {
    if (!scope_8) return;
    const scrollToLatest_2 = scope_8.keyboardWasOpen;
    clearFocusScopeRestoreTimers(scope_8);
    if (scope_8.releaseTimer) clearTimeout(scope_8.releaseTimer);
    scope_8.releaseTimer = null;
    restoreFocusScopeLayout(scope_8, {
      scrollToLatest: scrollToLatest_2
    });
    (scope_8.viewportRoot || scope_8.root)?.classList?.remove("u2-android-focus-locked");
    if (activeFocusScope === scope_8) activeFocusScope = null;
    handleAction_11(scope_8, {
      scrollToLatest: scrollToLatest_2
    });
  }
  function captureFocusScope(target_5) {
    if (!isAndroid_3) return false;
    const resolved_2 = resolveFocusScope(target_5);
    if (!resolved_2) return false;
    if (activeFocusScope && activeFocusScope.root === resolved_2.root) {
      activeFocusScope.releaseTimer && (clearTimeout(activeFocusScope.releaseTimer), activeFocusScope.releaseTimer = null);
      activeFocusScope.target = target_5;
      if (!activeFocusScope.keyboardWasOpen) {
        const viewportMetrics_72 = getViewportMetrics(),
          round_73 = Math.round(window.innerHeight || viewportMetrics_72.height || 0);
        activeFocusScope.restingHeight = Math.max(activeFocusScope.restingHeight, round_73, viewportMetrics_72.height);
        activeFocusScope.restingLayoutHeight = Math.max(activeFocusScope.restingLayoutHeight, round_73);
      }
      return (activeFocusScope.viewportRoot || activeFocusScope.root).classList.add("u2-android-focus-locked"), scheduleFocusScopeWindowRestore(activeFocusScope), handleFocusScopeViewportChange(), true;
    }
    if (activeFocusScope) releaseFocusScope(activeFocusScope);
    const metrics_2 = getViewportMetrics(),
      restingLayoutHeight_2 = Math.round(window.innerHeight || metrics_2.height || 0),
      root_70 = resolved_2.root,
      handleAction_8_71 = handleAction_8(resolved_2.registration, target_5, root_70);
    return activeFocusScope = {
      ...resolved_2,
      viewportRoot: handleAction_8_71,
      scrollLeft: Math.round(window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0),
      scrollTop: Math.round(window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0),
      restingHeight: Math.max(restingLayoutHeight_2, metrics_2.height),
      restingLayoutHeight: restingLayoutHeight_2,
      keyboardWasOpen: false,
      appliedViewportHeight: 0,
      appliedViewportTop: 0,
      restoreTimers: [],
      releaseTimer: null,
      originalRoot: {
        height: handleAction_8_71.style.height,
        top: handleAction_8_71.style.top,
        bottom: handleAction_8_71.style.bottom,
        heightCssValue: handleAction_8_71.style.getPropertyValue(getFocusScopeViewportConfig(resolved_2.registration).heightCssVariable),
        topCssValue: handleAction_8_71.style.getPropertyValue(getFocusScopeViewportConfig(resolved_2.registration).topCssVariable)
      }
    }, handleAction_8_71.classList.add("u2-android-focus-locked"), handleAction_15(), scheduleFocusScopeWindowRestore(activeFocusScope), handleFocusScopeViewportChange(), true;
  }
  function isActiveFocusScopeStillFocused(scope_9 = activeFocusScope) {
    if (!scope_9) return false;
    const resolved = resolveFocusScope(document.activeElement);
    return !!resolved && resolved.root === scope_9.root;
  }
  function handleAction_14(value_75, value_76, value_77) {
    const layoutAlreadyResized_3 = value_75.restingLayoutHeight - value_77 > 100,
      max_79 = Math.max(0, Math.round(window.visualViewport?.offsetTop || 0)),
      value_80 = max_79 + value_76.height,
      count_81 = 24,
      value_82 = layoutAlreadyResized_3 && value_75.registration.followViewportOrigin && max_79 > 0 && Math.abs(value_80 - value_77) <= count_81;
    return {
      layoutAlreadyResized: layoutAlreadyResized_3,
      viewportHeight: layoutAlreadyResized_3 && !value_82 ? value_77 : value_76.height,
      rawViewportTop: layoutAlreadyResized_3 && !value_82 ? 0 : max_79
    };
  }
  function applyFocusScopeViewport() {
    const scope_10 = activeFocusScope,
      element_84 = scope_10?.viewportRoot || scope_10?.root;
    if (!isAndroid_3 || !scope_10 || !scope_10.root?.isConnected || !element_84?.isConnected) return;
    restoreFocusScopeWindowPosition(scope_10);
    const viewportMetrics_85 = getViewportMetrics(),
      round_86 = Math.round(window.innerHeight || viewportMetrics_85.height || 0),
      {
        viewportHeight: viewportHeight_2,
        rawViewportTop: rawViewportTop_2
      } = handleAction_14(scope_10, viewportMetrics_85, round_86),
      appliedViewportTop_2 = scope_10.registration.followViewportOrigin ? Math.max(0, rawViewportTop_2) : Math.min(rawViewportTop_2, 50);
    if (viewportHeight_2 <= 0) return;
    const focused = isActiveFocusScopeStillFocused(scope_10),
      keyboardOpen = focused && scope_10.restingHeight - viewportHeight_2 > 100;
    scheduleFocusScopeWindowRestore(scope_10);
    if (!keyboardOpen) {
      const keyboardStillRetreating = scope_10.keyboardWasOpen && !focused && scope_10.restingHeight - viewportHeight_2 > 72;
      if (keyboardStillRetreating) return;
      if (scope_10.keyboardWasOpen) restoreFocusScopeLayout(scope_10, {
        scrollToLatest: true
      });
      (!focused || viewportHeight_2 >= scope_10.restingHeight - 72) && (scope_10.restingHeight = Math.max(scope_10.restingHeight, round_86, viewportMetrics_85.height), scope_10.restingLayoutHeight = Math.max(scope_10.restingLayoutHeight, round_86));
      return;
    }
    scope_10.keyboardWasOpen = true;
    const viewportConfig_2 = getFocusScopeViewportConfig(scope_10.registration),
      viewportClassName_2 = viewportConfig_2.className || "u2-android-keyboard-open",
      metricsChanged = viewportHeight_2 !== scope_10.appliedViewportHeight || appliedViewportTop_2 !== scope_10.appliedViewportTop,
      viewportClassApplied = element_84.classList.contains(viewportClassName_2);
    if (!metricsChanged && viewportClassApplied) return;
    scope_10.appliedViewportHeight = viewportHeight_2;
    scope_10.appliedViewportTop = appliedViewportTop_2;
    viewportConfig_2.className ? (viewportConfig_2.heightCssVariable && element_84.style.setProperty(viewportConfig_2.heightCssVariable, viewportHeight_2 + "px"), viewportConfig_2.topCssVariable && element_84.style.setProperty(viewportConfig_2.topCssVariable, appliedViewportTop_2 + "px"), element_84.classList.add(viewportConfig_2.className)) : (element_84.style.height = viewportHeight_2 + "px", element_84.style.top = appliedViewportTop_2 + "px", element_84.style.bottom = "auto", element_84.classList.add("u2-android-keyboard-open"));
    scrollFocusScopeContent(scope_10);
  }
  function handleFocusScopeViewportChange() {
    if (!isAndroid_3 || !activeFocusScope) return;
    if (focusScopeViewportFrame_2) return;
    focusScopeViewportFrame_2 = requestAnimationFrame(() => {
      focusScopeViewportFrame_2 = 0;
      applyFocusScopeViewport();
    });
  }
  function handleAction_15() {
    if (!isAndroid_3 || enabled_6) return;
    enabled_6 = true;
    window.addEventListener("resize", handleFocusScopeViewportChange, {
      passive: true
    });
    window.addEventListener("scroll", handleFocusScopeViewportChange, {
      passive: true
    });
    window.visualViewport?.addEventListener("resize", handleFocusScopeViewportChange, {
      passive: true
    });
    window.visualViewport?.addEventListener("scroll", handleFocusScopeViewportChange, {
      passive: true
    });
  }
  function releaseFocusScopeIfIdle(scope_11) {
    if (!scope_11 || scope_11 !== activeFocusScope) return;
    scope_11.releaseTimer = null;
    if (isActiveFocusScopeStillFocused(scope_11)) {
      scheduleFocusScopeWindowRestore(scope_11);
      return;
    }
    const viewportMetrics_97 = getViewportMetrics(),
      round_98 = Math.round(window.innerHeight || viewportMetrics_97.height || 0),
      value_99 = scope_11.restingLayoutHeight - round_98 > 100,
      viewportHeight_3 = value_99 ? round_98 : viewportMetrics_97.height,
      keyboardStillRetreating_2 = scope_11.keyboardWasOpen && scope_11.restingHeight - viewportHeight_3 > 72;
    if (keyboardStillRetreating_2) {
      scheduleFocusScopeRelease(scope_11);
      return;
    }
    releaseFocusScope(scope_11);
  }
  function scheduleFocusScopeRelease(scope_12 = activeFocusScope) {
    if (!isAndroid_3 || !scope_12) return;
    if (scope_12.releaseTimer) clearTimeout(scope_12.releaseTimer);
    scope_12.releaseTimer = setTimeout(() => releaseFocusScopeIfIdle(scope_12), 120);
  }
  function registerFocusScope_2(options_3 = {}) {
    const selector_2 = String(options_3.selector || "").trim();
    if (!selector_2) return function () {};
    const priority_2 = Number(options_3.priority),
      result = value_4.get(selector_2);
    if (result) result.cleanup();
    const registration_4 = {
      selector: selector_2,
      priority: Number.isFinite(priority_2) ? priority_2 : 0,
      preferFocusScope: options_3.preferFocusScope === true,
      nativeInsetsOnly: options_3.nativeInsetsOnly === true,
      followViewportOrigin: options_3.followViewportOrigin === true,
      resolveScrollContainer: typeof options_3.resolveScrollContainer === "function" ? options_3.resolveScrollContainer : null,
      resolveViewportRoot: typeof options_3.resolveViewportRoot === "function" ? options_3.resolveViewportRoot : null,
      scrollBehavior: options_3.scrollBehavior === "focus" ? "focus" : "latest",
      viewportClassName: String(options_3.viewportClassName || "").trim(),
      viewportHeightCssVariable: String(options_3.viewportHeightCssVariable || "").trim(),
      viewportTopCssVariable: String(options_3.viewportTopCssVariable || "").trim(),
      cleanup: null
    };
    return registration_4.cleanup = () => {
      if (activeFocusScope?.registration === registration_4) releaseFocusScope(activeFocusScope);
      if (value_4.get(selector_2) === registration_4) value_4["delete"](selector_2);
    }, value_4.set(selector_2, registration_4), handleAction_15(), registration_4.cleanup;
  }
  function getActiveBottomSheetOverlay(target_6) {
    if (!target_6 || !target_6.closest) return null;
    const closest_106 = target_6.closest(".bottom-sheet-overlay");
    if (!closest_106) return null;
    if (closest_106.classList.contains("active")) return closest_106;
    const computedStyle = window.getComputedStyle?.(closest_106),
      value_107 = computedStyle && computedStyle.display !== "none" && computedStyle.visibility !== "hidden" && computedStyle.pointerEvents !== "none" && Number(computedStyle.opacity || 1) > 0;
    return value_107 ? closest_106 : null;
  }
  function resetHorizontalWindowScroll() {
    try {
      window.scrollTo(0, window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0);
    } catch (error_4) {}
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
  }
  function restoreBottomSheetFocusPosition() {
    if (!isAndroid_3 || !bottomSheetFocusGuard.active) return;
    const pagesContainer = getPagesContainer();
    if (pagesContainer) {
      try {
        pagesContainer.scrollTo({
          left: bottomSheetFocusGuard.scrollLeft,
          behavior: "auto"
        });
      } catch (error_5) {
        pagesContainer.scrollLeft = bottomSheetFocusGuard.scrollLeft;
      }
      pagesContainer.scrollLeft = bottomSheetFocusGuard.scrollLeft;
    }
    const scrollTop_2 = bottomSheetFocusGuard.scrollTop;
    try {
      window.scrollTo(0, scrollTop_2);
    } catch (error_6) {}
    document.documentElement.scrollLeft = 0;
    document.documentElement.scrollTop = scrollTop_2;
    document.body.scrollLeft = 0;
    document.body.scrollTop = scrollTop_2;
  }
  function scheduleBottomSheetFocusRestore() {
    if (!isAndroid_3 || !bottomSheetFocusGuard.active) return;
    bottomSheetFocusGuard.restoreTimers.forEach(timer_2 => clearTimeout(timer_2));
    bottomSheetFocusGuard.restoreTimers = [];
    requestAnimationFrame(restoreBottomSheetFocusPosition);
    [0, 60, 180, 360].forEach(delay_2 => {
      bottomSheetFocusGuard.restoreTimers.push(setTimeout(restoreBottomSheetFocusPosition, delay_2));
    });
  }
  function handleAction_17() {
    const scope_13 = bottomSheetFocusGuard,
      root_5 = scope_13.overlay;
    if (!root_5?.style) return;
    root_5.style.height = scope_13.originalOverlayHeight;
    root_5.style.top = scope_13.originalOverlayTop;
    root_5.style.bottom = scope_13.originalOverlayBottom;
    root_5.classList.remove("u2-android-keyboard-open");
    scope_13.keyboardWasOpen = false;
    scope_13.appliedViewportHeight = 0;
    scope_13.appliedViewportTop = 0;
  }
  function handleAction_18(value_116, value_117) {
    if (!value_116?.isConnected || !value_117?.contains(value_116)) return null;
    let parentElement_118 = value_116.parentElement;
    while (parentElement_118 && parentElement_118 !== value_117) {
      const computedStyle_119 = window.getComputedStyle?.(parentElement_118);
      if (computedStyle_119 && /(auto|scroll|overlay)/.test(computedStyle_119.overflowY || "") && parentElement_118.scrollHeight > parentElement_118.clientHeight + 1) return parentElement_118;
      parentElement_118 = parentElement_118.parentElement;
    }
    return value_116.closest(".detail-sheet-content, .bottom-sheet");
  }
  function handleAction_19() {
    const event_120 = bottomSheetFocusGuard,
      target_121 = event_120.target,
      overlay_122 = event_120.overlay,
      handleAction_18_123 = handleAction_18(target_121, overlay_122);
    if (!target_121?.isConnected || !handleAction_18_123) return;
    requestAnimationFrame(() => {
      const boundingClientRect_124 = handleAction_18_123.getBoundingClientRect(),
        boundingClientRect_125 = target_121.getBoundingClientRect(),
        count_126 = 16;
      if (boundingClientRect_125.top < boundingClientRect_124.top + count_126) handleAction_18_123.scrollTop += boundingClientRect_125.top - boundingClientRect_124.top - count_126;else boundingClientRect_125.bottom > boundingClientRect_124.bottom - count_126 && (handleAction_18_123.scrollTop += boundingClientRect_125.bottom - boundingClientRect_124.bottom + count_126);
    });
  }
  function applyFocusScopeViewport_2() {
    const scope_14 = bottomSheetFocusGuard,
      overlay_128 = scope_14.overlay;
    if (!isAndroid_3 || !scope_14.active || !overlay_128?.isConnected) return;
    const viewportMetrics_129 = getViewportMetrics(),
      round_130 = Math.round(window.innerHeight || viewportMetrics_129.height || 0),
      layoutAlreadyResized_2 = scope_14.restingLayoutHeight - round_130 > 100,
      value_132 = layoutAlreadyResized_2 ? round_130 : viewportMetrics_129.height,
      appliedViewportTop_3 = layoutAlreadyResized_2 ? 0 : Math.round(window.visualViewport?.offsetTop || 0);
    if (value_132 <= 0) return;
    const activeElement_2 = document.activeElement,
      focused_2 = isBottomSheetEditableTarget(activeElement_2) && getActiveBottomSheetOverlay(activeElement_2) === overlay_128,
      keyboardOpen_2 = focused_2 && scope_14.restingHeight - value_132 > 100;
    scheduleBottomSheetFocusRestore();
    if (!keyboardOpen_2) {
      const keyboardStillRetreating_3 = scope_14.keyboardWasOpen && !focused_2 && scope_14.restingHeight - value_132 > 72;
      if (keyboardStillRetreating_3) return;
      if (scope_14.keyboardWasOpen) handleAction_17();
      (!focused_2 || value_132 >= scope_14.restingHeight - 72) && (scope_14.restingHeight = Math.max(scope_14.restingHeight, round_130, viewportMetrics_129.height), scope_14.restingLayoutHeight = Math.max(scope_14.restingLayoutHeight, round_130));
      return;
    }
    scope_14.keyboardWasOpen = true;
    const metricsChanged_2 = value_132 !== scope_14.appliedViewportHeight || appliedViewportTop_3 !== scope_14.appliedViewportTop;
    (metricsChanged_2 || !overlay_128.classList.contains("u2-android-keyboard-open")) && (scope_14.appliedViewportHeight = value_132, scope_14.appliedViewportTop = appliedViewportTop_3, overlay_128.style.height = value_132 + "px", overlay_128.style.top = appliedViewportTop_3 + "px", overlay_128.style.bottom = "auto", overlay_128.classList.add("u2-android-keyboard-open"));
    handleAction_19();
  }
  function handleAction_21(target_7) {
    if (!isAndroid_3 || !isBottomSheetEditableTarget(target_7)) return false;
    const overlay_2 = getActiveBottomSheetOverlay(target_7);
    if (!overlay_2) return false;
    bottomSheetFocusGuard.active && bottomSheetFocusGuard.overlay !== overlay_2 && unlockBottomSheetFocusScroll();
    const pagesContainer_2 = getPagesContainer();
    if (!bottomSheetFocusGuard.active) {
      const metrics_3 = getViewportMetrics(),
        restingLayoutHeight_3 = Math.round(window.innerHeight || metrics_3.height || 0);
      bottomSheetFocusGuard.active = true;
      bottomSheetFocusGuard.scrollLeft = pagesContainer_2 ? pagesContainer_2.scrollLeft : 0;
      bottomSheetFocusGuard.scrollTop = Math.round(window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0);
      pagesContainer_2 && (bottomSheetFocusGuard.previousScrollSnapType = pagesContainer_2.style.scrollSnapType || "", bottomSheetFocusGuard.previousScrollBehavior = pagesContainer_2.style.scrollBehavior || "", bottomSheetFocusGuard.previousOverflowX = pagesContainer_2.style.overflowX || "", bottomSheetFocusGuard.previousTouchAction = pagesContainer_2.style.touchAction || "");
      bottomSheetFocusGuard.restingHeight = Math.max(restingLayoutHeight_3, metrics_3.height);
      bottomSheetFocusGuard.restingLayoutHeight = restingLayoutHeight_3;
      bottomSheetFocusGuard.keyboardWasOpen = false;
      bottomSheetFocusGuard.appliedViewportHeight = 0;
      bottomSheetFocusGuard.appliedViewportTop = 0;
      bottomSheetFocusGuard.originalOverlayHeight = overlay_2.style.height;
      bottomSheetFocusGuard.originalOverlayTop = overlay_2.style.top;
      bottomSheetFocusGuard.originalOverlayBottom = overlay_2.style.bottom;
    }
    return bottomSheetFocusGuard.overlay = overlay_2, bottomSheetFocusGuard.target = target_7, overlay_2.classList.add("u2-android-input-locked"), pagesContainer_2 && (pagesContainer_2.style.scrollSnapType = "none", pagesContainer_2.style.scrollBehavior = "auto", pagesContainer_2.style.overflowX = "hidden", pagesContainer_2.style.touchAction = "none"), handleAction_25(), scheduleBottomSheetFocusRestore(), applyFocusScopeViewport_2(), true;
  }
  function activateAndroidInputGuard(target_8) {
    if (window.appViewport?.managed) return "app-viewport";
    const registeredEntry = registrations.get(target_8);
    if (registeredEntry?.managesOwnViewport) {
      if (bottomSheetFocusGuard.active) unlockBottomSheetFocusScroll();
      if (activeFocusScope) releaseFocusScope(activeFocusScope);
      return "managed-viewport";
    }
    const preferredScope = resolveFocusScope(target_8);
    if (preferredScope?.registration.nativeInsetsOnly) {
      if (bottomSheetFocusGuard.active) unlockBottomSheetFocusScroll();
      if (activeFocusScope) releaseFocusScope(activeFocusScope);
      return "native-insets";
    }
    if (preferredScope?.registration.preferFocusScope) {
      if (bottomSheetFocusGuard.active) unlockBottomSheetFocusScroll();
      return captureFocusScope(target_8) ? "focus-scope" : "";
    }
    const bottomSheetLocked = handleAction_21(target_8);
    if (bottomSheetLocked) {
      if (activeFocusScope) releaseFocusScope(activeFocusScope);
      return "bottom-sheet";
    }
    return captureFocusScope(target_8) ? "focus-scope" : "";
  }
  function unlockBottomSheetFocusScroll() {
    if (!bottomSheetFocusGuard.active) return;
    bottomSheetFocusGuard.restoreTimers.forEach(value_149 => clearTimeout(value_149));
    bottomSheetFocusGuard.restoreTimers = [];
    if (focusScopeViewportFrame) cancelAnimationFrame(focusScopeViewportFrame);
    focusScopeViewportFrame = 0;
    handleAction_17();
    const pagesContainer_3 = getPagesContainer();
    pagesContainer_3 && (pagesContainer_3.style.scrollSnapType = bottomSheetFocusGuard.previousScrollSnapType, pagesContainer_3.style.scrollBehavior = bottomSheetFocusGuard.previousScrollBehavior, pagesContainer_3.style.overflowX = bottomSheetFocusGuard.previousOverflowX, pagesContainer_3.style.touchAction = bottomSheetFocusGuard.previousTouchAction, pagesContainer_3.scrollLeft = bottomSheetFocusGuard.scrollLeft);
    const scrollTop_3 = bottomSheetFocusGuard.scrollTop;
    try {
      window.scrollTo(0, scrollTop_3);
    } catch (value_150) {}
    document.documentElement.scrollTop = scrollTop_3;
    document.body.scrollTop = scrollTop_3;
    bottomSheetFocusGuard.overlay?.classList && bottomSheetFocusGuard.overlay.classList.remove("u2-android-input-locked");
    bottomSheetFocusGuard.active = false;
    bottomSheetFocusGuard.overlay = null;
    bottomSheetFocusGuard.target = null;
    bottomSheetFocusGuard.scrollLeft = 0;
    bottomSheetFocusGuard.scrollTop = 0;
    bottomSheetFocusGuard.previousScrollSnapType = "";
    bottomSheetFocusGuard.previousScrollBehavior = "";
    bottomSheetFocusGuard.previousOverflowX = "";
    bottomSheetFocusGuard.previousTouchAction = "";
    bottomSheetFocusGuard.restingHeight = 0;
    bottomSheetFocusGuard.restingLayoutHeight = 0;
    bottomSheetFocusGuard.originalOverlayHeight = "";
    bottomSheetFocusGuard.originalOverlayTop = "";
    bottomSheetFocusGuard.originalOverlayBottom = "";
    resetHorizontalWindowScroll();
  }
  function isBottomSheetGuardContextActive() {
    const activeElement_3 = document.activeElement;
    return isBottomSheetEditableTarget(activeElement_3) && !!getActiveBottomSheetOverlay(activeElement_3);
  }
  function releaseBottomSheetFocusScrollIfIdle() {
    if (!isAndroid_3 || !bottomSheetFocusGuard.active) return;
    if (isBottomSheetGuardContextActive()) {
      scheduleBottomSheetFocusRestore();
      return;
    }
    const viewportMetrics_152 = getViewportMetrics(),
      round_153 = Math.round(window.innerHeight || viewportMetrics_152.height || 0),
      value_154 = bottomSheetFocusGuard.restingLayoutHeight - round_153 > 100,
      viewportHeight_4 = value_154 ? round_153 : viewportMetrics_152.height,
      keyboardStillRetreating_4 = bottomSheetFocusGuard.keyboardWasOpen && bottomSheetFocusGuard.restingHeight - viewportHeight_4 > 72;
    if (keyboardStillRetreating_4) {
      setTimeout(releaseBottomSheetFocusScrollIfIdle, 120);
      return;
    }
    unlockBottomSheetFocusScroll();
  }
  function handleAction_24() {
    if (!isAndroid_3 || !bottomSheetFocusGuard.active) return;
    !focusScopeViewportFrame && (focusScopeViewportFrame = requestAnimationFrame(() => {
      focusScopeViewportFrame = 0;
      applyFocusScopeViewport_2();
    }));
    setTimeout(releaseBottomSheetFocusScrollIfIdle, 120);
  }
  function handleAction_25() {
    if (!isAndroid_3 || !window.visualViewport || enabled_5) return;
    enabled_5 = true;
    window.visualViewport.addEventListener("resize", handleAction_24, {
      passive: true
    });
    window.visualViewport.addEventListener("scroll", handleAction_24, {
      passive: true
    });
  }
  function isSendEnter_2(event_2, options_4 = {}) {
    if (!event_2 || event_2.key !== "Enter") return false;
    if (event_2.isComposing || event_2.keyCode === 229) return false;
    if (event_2.ctrlKey || event_2.metaKey || event_2.altKey) return false;
    if (event_2.shiftKey) return false;
    if (options_4.multiline && event_2.shiftKey) return false;
    return true;
  }
  function captureRestingViewport(entry) {
    if (!isAndroid_3 || !entry) return;
    const metrics = getViewportMetrics();
    if (metrics.width > 0 && Math.abs(metrics.width - entry.viewportWidth) > 48) {
      entry.viewportWidth = metrics.width;
      entry.restingHeight = metrics.height;
      entry.keyboardWasOpen = false;
      return;
    }
    entry.viewportWidth = metrics.width || entry.viewportWidth;
    entry.restingHeight = Math.max(entry.restingHeight, metrics.height);
  }
  function restoreEntry(entry_2) {
    if (!isAndroid_3 || !entry_2 || !entry_2.input.isConnected) return;
    const root_6 = resolveElement(entry_2.root),
      scrollContainer_4 = resolveElement(entry_2.scrollContainer);
    root_6?.classList && entry_2.openClasses.forEach(className_2 => root_6.classList.remove(className_2));
    entry_2.restoreWindowScroll && (window.scrollTo(0, 0), document.documentElement.scrollTop = 0, document.body.scrollTop = 0);
    requestAnimationFrame(() => {
      if (scrollContainer_4) scrollContainer_4.scrollTop = scrollContainer_4.scrollHeight;
      if (typeof entry_2.onRestore === "function") entry_2.onRestore(entry_2);
    });
  }
  function scheduleRestore(entry_3) {
    entry_3.restoreTimers.forEach(timer_3 => clearTimeout(timer_3));
    entry_3.restoreTimers = [];
    [0, 60, 180, 360].forEach(delay_3 => {
      entry_3.restoreTimers.push(setTimeout(() => restoreEntry(entry_3), delay_3));
    });
  }
  function handleAction_27() {
    const entry_4 = activeEntry;
    if (!isAndroid_3 || !entry_4 || !entry_4.input.isConnected) return;
    const metrics_4 = getViewportMetrics();
    if (Math.abs(metrics_4.width - entry_4.viewportWidth) > 48) {
      entry_4.viewportWidth = metrics_4.width;
      entry_4.restingHeight = metrics_4.height;
      entry_4.keyboardWasOpen = false;
      return;
    }
    const inputFocused = document.activeElement === entry_4.input;
    !inputFocused && !entry_4.keyboardWasOpen && (entry_4.restingHeight = Math.max(entry_4.restingHeight, metrics_4.height));
    if (inputFocused && entry_4.restingHeight - metrics_4.height > entry_4.openThreshold) {
      entry_4.keyboardWasOpen = true;
      return;
    }
    entry_4.keyboardWasOpen && metrics_4.height >= entry_4.restingHeight - entry_4.closeTolerance && (entry_4.keyboardWasOpen = false, entry_4.restingHeight = Math.max(entry_4.restingHeight, metrics_4.height), scheduleRestore(entry_4));
  }
  function handleAction_28() {
    if (!isAndroid_3 || !window.visualViewport || enabled) return;
    enabled = true;
    window.visualViewport.addEventListener("resize", handleAction_27, {
      passive: true
    });
    window.visualViewport.addEventListener("scroll", handleAction_27, {
      passive: true
    });
  }
  function register_2(options_5 = {}) {
    const input_2 = resolveElement(options_5.input);
    if (!input_2) return function () {};
    const result_171 = registrations.get(input_2);
    if (result_171) result_171.cleanup();
    const entry_5 = {
      input: input_2,
      root: options_5.root || null,
      scrollContainer: options_5.scrollContainer || null,
      onSend: typeof options_5.onSend === "function" ? options_5.onSend : null,
      onRestore: typeof options_5.onRestore === "function" ? options_5.onRestore : null,
      allowEmpty: !!options_5.allowEmpty,
      multiline: !!options_5.multiline,
      blurAfterSend: !!options_5.blurAfterSend,
      restoreWindowScroll: options_5.restoreWindowScroll !== false,
      managesOwnViewport: options_5.managesOwnViewport === true,
      openClasses: Array.isArray(options_5.openClasses) ? options_5.openClasses.filter(Boolean) : ["keyboard-open"],
      openThreshold: Number(options_5.openThreshold) || 100,
      closeTolerance: Number(options_5.closeTolerance) || 72,
      restingHeight: 0,
      viewportWidth: 0,
      keyboardWasOpen: false,
      restoreTimers: [],
      cleanup: null
    };
    options_5.enterKeyHint !== false && input_2.setAttribute("enterkeyhint", options_5.enterKeyHint || "send");
    const activate = () => {
        activeEntry = entry_5;
        captureRestingViewport(entry_5);
      },
      handleKeydown = event_3 => {
        if (!isSendEnter_2(event_3, entry_5)) return;
        event_3.preventDefault();
        const text_2 = String(input_2.value || "").trim();
        if (!entry_5.allowEmpty && !text_2) return;
        if (!entry_5.onSend) return;
        try {
          const result_2 = entry_5.onSend({
            event: event_3,
            input: input_2,
            text: text_2
          });
          result_2 && typeof result_2["catch"] === "function" && result_2["catch"](error_7 => console.error("[mobileInputCompat] send failed", error_7));
        } catch (value_180) {
          console.error("[mobileInputCompat] send failed", value_180);
        }
        if (entry_5.blurAfterSend) input_2.blur();
      },
      handleBlur = () => {
        if (isAndroid_3 && !window.visualViewport) scheduleRestore(entry_5);
      };
    return input_2.addEventListener("pointerdown", activate, {
      passive: true
    }), input_2.addEventListener("touchstart", activate, {
      passive: true
    }), input_2.addEventListener("focus", activate), input_2.addEventListener("blur", handleBlur), input_2.addEventListener("keydown", handleKeydown), entry_5.cleanup = () => {
      entry_5.restoreTimers.forEach(value_181 => clearTimeout(value_181));
      input_2.removeEventListener("pointerdown", activate);
      input_2.removeEventListener("touchstart", activate);
      input_2.removeEventListener("focus", activate);
      input_2.removeEventListener("blur", handleBlur);
      input_2.removeEventListener("keydown", handleKeydown);
      registrations["delete"](input_2);
      if (activeEntry === entry_5) activeEntry = null;
    }, registrations.set(input_2, entry_5), captureRestingViewport(entry_5), handleAction_28(), entry_5.cleanup;
  }
  document.addEventListener("focusin", event_4 => {
    activateAndroidInputGuard(event_4.target);
    const entry_6 = registrations.get(event_4.target);
    if (entry_6) {
      activeEntry = entry_6;
      captureRestingViewport(entry_6);
    } else activeEntry && !activeEntry.keyboardWasOpen && (activeEntry = null);
  }, true);
  document.addEventListener("pointerdown", event_5 => {
    activateAndroidInputGuard(event_5.target);
  }, {
    capture: true,
    passive: true
  });
  document.addEventListener("touchstart", event_6 => {
    activateAndroidInputGuard(event_6.target);
  }, {
    capture: true,
    passive: true
  });
  document.addEventListener("focusout", () => {
    if (!isAndroid_3) return;
    if (bottomSheetFocusGuard.active) setTimeout(releaseBottomSheetFocusScrollIfIdle, 120);
    scheduleFocusScopeRelease();
  }, true);
  document.addEventListener("selectionchange", () => {
    if (!isAndroid_3 || !bottomSheetFocusGuard.active) return;
    isBottomSheetGuardContextActive() ? scheduleBottomSheetFocusRestore() : setTimeout(releaseBottomSheetFocusScrollIfIdle, 120);
  });
  registerFocusScope_2({
    selector: "#app",
    priority: -100
  });
  registerFocusScope_2({
    selector: "#u2-login-screen:not(.is-hidden)",
    priority: 20,
    preferFocusScope: true,
    resolveScrollContainer: (value_186, value_187) => value_187,
    scrollBehavior: "focus"
  });
  window.mobileInputCompat = {
    isAndroid: isAndroid_3,
    isSendEnter: isSendEnter_2,
    register: register_2,
    registerFocusScope: registerFocusScope_2,
    "unregister"(value_188) {
      const element_189 = resolveElement(value_188);
      registrations.get(element_189)?.cleanup();
    }
  };
})();
