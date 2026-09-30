(function () {
  const modal = document.getElementById("about-info-modal"),
    title_3 = document.getElementById("about-info-modal-title"),
    disclaimerContent = document.getElementById("about-disclaimer-content"),
    changelogContent = document.getElementById("about-changelog-content"),
    changelogListView = document.getElementById("about-changelog-list-view"),
    changelogDetailContent = document.getElementById("about-changelog-list"),
    aboutChangelogMonthTriggerElement = document.getElementById("about-changelog-month-trigger"),
    title_4 = document.getElementById("about-changelog-month-label"),
    changelogContent_2 = document.getElementById("about-changelog-month-picker"),
    changelogDetailContent_3 = document.getElementById("about-changelog-year-options"),
    changelogDetailContent_4 = document.getElementById("about-changelog-month-options"),
    changelogDetailView = document.getElementById("about-changelog-detail-view"),
    aboutChangelogDetailKickerElement = document.getElementById("about-changelog-detail-kicker"),
    changelogDetailDate = document.getElementById("about-changelog-detail-date"),
    changelogDetailContent_5 = document.getElementById("about-changelog-detail-tags"),
    changelogDetailContent_2 = document.getElementById("about-changelog-detail-content"),
    backButton = document.getElementById("about-info-modal-back"),
    closeButton = document.getElementById("about-info-modal-close"),
    confirmButton = document.getElementById("about-info-modal-confirm"),
    CHANGELOG_ENTRIES = [{
      id: "2026-09-28",
      year: "2026",
      shortDate: "9.28",
      fullDate: "2026年9月28日",
      sections: [{
        label: "",
        title: "",
        items: ["LHV"]
      }]
    }, {
      id: "2026-09-24",
      year: "2026",
      shortDate: "9.24",
      fullDate: "2026年9月24日",
      sections: [{
        label: "",
        title: "",
        items: ["Koala"]
      }]
    }, {
      id: "2026-09-20",
      year: "2026",
      shortDate: "9.20",
      fullDate: "2026年9月20日",
      sections: [{
        label: "",
        title: "",
        items: ["Leo"]
      }]
    }],
    LATEST_CHANGELOG_ENTRY_ID = CHANGELOG_ENTRIES[0]?.id || "",
    count = 250,
    ACKNOWLEDGEMENT_DELAY_MS = 3000,
    text = "u2_changelog_notice_seen:20260928-v1:";
  let returnFocus = null,
    overflow_2 = "",
    value_5 = null,
    autoNoticeTimer = null,
    autoNoticeInFlight = false,
    text_6 = "",
    latestNoticeEligibilityReady = false,
    acknowledgementTimer = null,
    acknowledgementInterval = null,
    dismissalLocked = false,
    text_9 = "",
    count_10 = 0,
    count_11 = 0;
  const seenNoticeKeys = new Set();
  function getChangelogEntry(id_2) {
    return CHANGELOG_ENTRIES.find(entry => entry.id === id_2) || null;
  }
  function setModalTitle(textContent_2) {
    if (title_3) title_3.textContent = textContent_2;
  }
  function getNoticeStorageKey(username_2) {
    const account = String(username_2 || "local").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_") || "local";
    return "" + text + LATEST_CHANGELOG_ENTRY_ID + ":" + account;
  }
  async function hasSeenLatestChangelog(storageKey) {
    if (seenNoticeKeys.has(storageKey)) return true;
    try {
      if (window.appStorage?.ready) await window.appStorage.ready;
      const seen = (await window.appStorage?.getSetting?.(storageKey, false)) === true;
      if (seen) seenNoticeKeys.add(storageKey);
      return seen;
    } catch {
      return false;
    }
  }
  async function markLatestChangelogSeen(storageKey_2) {
    if (!storageKey_2) return;
    seenNoticeKeys.add(storageKey_2);
    try {
      if (window.appStorage?.ready) await window.appStorage.ready;
      await window.appStorage?.setSetting?.(storageKey_2, true);
    } catch {}
  }
  function handleAction_12() {
    if (acknowledgementTimer) window.clearTimeout(acknowledgementTimer);
    if (acknowledgementInterval) window.clearInterval(acknowledgementInterval);
    acknowledgementTimer = null;
    acknowledgementInterval = null;
    dismissalLocked = false;
    text_9 = "";
    if (closeButton) closeButton.disabled = false;
    confirmButton && (confirmButton.disabled = false, confirmButton.textContent = "u");
  }
  function handleAction_13(value_32) {
    handleAction_12();
    text_9 = value_32;
    dismissalLocked = true;
    if (closeButton) closeButton.disabled = true;
    if (backButton) backButton.hidden = true;
    if (confirmButton) confirmButton.disabled = true;
    const deadline = Date.now() + ACKNOWLEDGEMENT_DELAY_MS,
      updateCountdown = () => {
        const secondsRemaining = Math.ceil(Math.max(0, deadline - Date.now()) / 1000);
        if (confirmButton) confirmButton.textContent = secondsRemaining > 0 ? "u（" + secondsRemaining + "秒）" : "u";
      };
    updateCountdown();
    acknowledgementInterval = window.setInterval(updateCountdown, 250);
    acknowledgementTimer = window.setTimeout(() => {
      if (acknowledgementInterval) window.clearInterval(acknowledgementInterval);
      acknowledgementInterval = null;
      acknowledgementTimer = null;
      dismissalLocked = false;
      if (closeButton) closeButton.disabled = false;
      confirmButton && (confirmButton.disabled = false, confirmButton.textContent = "u");
    }, ACKNOWLEDGEMENT_DELAY_MS);
  }
  function handleAction_14(value_36) {
    const match_37 = String(value_36?.id || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match_37) return null;
    const year_2 = Number(match_37[1]),
      month_2 = Number(match_37[2]),
      day_2 = Number(match_37[3]);
    if (!Number.isInteger(year_2) || month_2 < 1 || month_2 > 12 || day_2 < 1 || day_2 > 31) return null;
    return {
      year: year_2,
      month: month_2,
      day: day_2
    };
  }
  function handleAction_15() {
    return [...new Set(CHANGELOG_ENTRIES.map(handleAction_14).filter(Boolean).map(({
      year: year_3
    }) => year_3))].sort((value_41, value_42) => value_42 - value_41);
  }
  function handleAction_16(value_43, value_44) {
    const value_45 = new Map();
    return CHANGELOG_ENTRIES.forEach(value_46 => {
      const handleAction_14_47 = handleAction_14(value_46);
      if (handleAction_14_47?.year === value_43 && handleAction_14_47.month === value_44) value_45.set(handleAction_14_47.day, value_46);
    }), value_45;
  }
  function handleAction_17(value_48) {
    if (!changelogContent_2) return;
    const showChangelog = Boolean(value_48);
    changelogContent_2.hidden = !showChangelog;
    aboutChangelogMonthTriggerElement?.setAttribute("aria-expanded", String(showChangelog));
    if (showChangelog) handleAction_19();
  }
  function handleAction_18() {
    const handleAction_14_49 = handleAction_14(CHANGELOG_ENTRIES[0]);
    if (!handleAction_14_49) return;
    count_10 = handleAction_14_49.year;
    count_11 = handleAction_14_49.month;
  }
  function handleAction_19() {
    const handleAction_15_50 = handleAction_15();
    changelogDetailContent_3 && (changelogDetailContent_3.replaceChildren(), handleAction_15_50.forEach(value_51 => {
      const element = document.createElement("button");
      element.type = "button";
      element.className = "about-changelog-year-option";
      element.textContent = value_51 + "年";
      element.setAttribute("aria-pressed", String(value_51 === count_10));
      if (value_51 === count_10) element.className += " is-selected";
      element.addEventListener("click", () => {
        count_10 = value_51;
        handleAction_19();
        handleAction_20();
      });
      changelogDetailContent_3.append(element);
    }));
    if (changelogDetailContent_4) {
      changelogDetailContent_4.replaceChildren();
      for (let count_52 = 1; count_52 <= 12; count_52 += 1) {
        const element_53 = document.createElement("button"),
          value_54 = handleAction_16(count_10, count_52).size > 0;
        element_53.type = "button";
        element_53.className = "about-changelog-month-option";
        element_53.textContent = count_52 + "月";
        element_53.setAttribute("aria-pressed", String(count_52 === count_11));
        if (value_54) element_53.className += " has-updates";
        if (count_52 === count_11) element_53.className += " is-selected";
        element_53.addEventListener("click", () => {
          count_11 = count_52;
          handleAction_20();
          handleAction_17(false);
          aboutChangelogMonthTriggerElement?.focus();
        });
        changelogDetailContent_4.append(element_53);
      }
    }
  }
  function handleAction_20() {
    if (!changelogDetailContent || !count_10 || !count_11) return;
    const textContent_3 = count_10 + "年" + count_11 + "月",
      handleAction_16_56 = handleAction_16(count_10, count_11),
      day_57 = new Date(count_10, count_11 - 1, 1).getDay(),
      date = new Date(count_10, count_11, 0).getDate();
    if (title_4) title_4.textContent = textContent_3;
    aboutChangelogMonthTriggerElement?.setAttribute("aria-label", "选择年月，当前为" + textContent_3);
    changelogDetailContent.setAttribute("aria-label", textContent_3 + "更新日历");
    changelogDetailContent.replaceChildren();
    for (let count_58 = 0; count_58 < 42; count_58 += 1) {
      const sectionElement = document.createElement("div"),
        value_60 = count_58 - day_57 + 1;
      sectionElement.className = "about-changelog-calendar-cell";
      sectionElement.setAttribute("role", "gridcell");
      if (value_60 < 1 || value_60 > date) {
        sectionElement.className += " is-empty";
        sectionElement.setAttribute("aria-hidden", "true");
        changelogDetailContent.append(sectionElement);
        continue;
      }
      const entry_2 = handleAction_16_56.get(value_60);
      if (entry_2) {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "about-changelog-calendar-day is-updated";
        item.dataset.changelogId = entry_2.id;
        item.textContent = String(value_60);
        item.setAttribute("aria-label", "查看 " + entry_2.fullDate + " 更新内容");
        item.addEventListener("click", () => showChangelogDetail(entry_2.id, item));
        sectionElement.append(item);
      } else {
        const copy = document.createElement("span");
        copy.className = "about-changelog-calendar-day is-idle";
        copy.textContent = String(value_60);
        copy.setAttribute("aria-label", count_10 + "年" + count_11 + "月" + value_60 + "日，无更新");
        sectionElement.append(copy);
      }
      changelogDetailContent.append(sectionElement);
    }
  }
  function handleAction_21() {
    handleAction_20();
  }
  function showChangelogList({
    restoreFocus = false
  } = {}) {
    if (changelogListView) changelogListView.hidden = false;
    if (changelogDetailView) changelogDetailView.hidden = true;
    if (backButton) backButton.hidden = true;
    handleAction_17(false);
    setModalTitle("更新日志");
    const focusTarget = value_5;
    value_5 = null;
    if (restoreFocus && focusTarget && document.contains(focusTarget)) focusTarget.focus();
  }
  function showChangelogDetail(value_64, value_65) {
    const entry_3 = getChangelogEntry(value_64);
    if (!entry_3 || !changelogDetailContent_2) return;
    value_5 = value_65 || changelogDetailContent?.querySelector("[data-changelog-id=\"" + value_64 + "\"]") || null;
    changelogDetailContent_2.replaceChildren();
    if (aboutChangelogDetailKickerElement) aboutChangelogDetailKickerElement.textContent = "RELEASE_NOTE";
    handleAction_17(false);
    changelogDetailDate && (changelogDetailDate.textContent = entry_3.shortDate, changelogDetailDate.setAttribute("aria-label", entry_3.fullDate));
    if (changelogDetailContent_5) {
      const items_66 = [entry_3.id.replaceAll("-", "."), entry_3.id === LATEST_CHANGELOG_ENTRY_ID ? "LATEST" : "ARCHIVE"];
      entry_3.sections.forEach(value_67 => {
        if (value_67.status && !items_66.includes(value_67.status)) items_66.push(value_67.status);
      });
      changelogDetailContent_5.replaceChildren();
      items_66.forEach(textContent_4 => {
        const element_69 = document.createElement("span");
        element_69.className = "about-changelog-detail-tag";
        element_69.textContent = textContent_4;
        changelogDetailContent_5.append(element_69);
      });
    }
    entry_3.sections.forEach((section, value_71) => {
      const sectionElement_2 = document.createElement("section"),
        element_73 = document.createElement("div"),
        element_74 = document.createElement("span"),
        heading = document.createElement("h3"),
        list = document.createElement("ul");
      sectionElement_2.className = "about-changelog-section";
      element_73.className = "about-changelog-section-header";
      element_74.className = "about-changelog-section-label";
      element_74.textContent = section.label || "SECTION " + String(value_71 + 1).padStart(2, "0");
      heading.textContent = section.title;
      section.items.forEach(item_76 => {
        const listItem = document.createElement("li");
        listItem.textContent = item_76;
        list.append(listItem);
      });
      element_73.append(element_74, heading);
      if (section.status) {
        const copy_2 = document.createElement("span");
        copy_2.className = "about-changelog-section-status";
        copy_2.textContent = section.status;
        element_73.append(copy_2);
      }
      sectionElement_2.append(element_73, list);
      changelogDetailContent_2.append(sectionElement_2);
    });
    if (changelogListView) changelogListView.hidden = true;
    if (changelogDetailView) changelogDetailView.hidden = false;
    if (backButton) backButton.hidden = false;
    setModalTitle(entry_3.fullDate);
    backButton?.focus();
  }
  function open_2(mode = "disclaimer", options = {}) {
    if (!modal) return false;
    const safeOptions = options && typeof options === "object" ? options : {},
      showChangelog_2 = mode === "changelog",
      changelogEntryId_2 = showChangelog_2 ? String(safeOptions.changelogEntryId || "") : "",
      noticeStorageKey_2 = showChangelog_2 ? String(safeOptions.noticeStorageKey || "") : "";
    returnFocus = document.activeElement;
    handleAction_12();
    modal.classList?.toggle("is-changelog-mode", showChangelog_2);
    if (disclaimerContent) disclaimerContent.hidden = showChangelog_2;
    if (changelogContent) changelogContent.hidden = !showChangelog_2;
    if (showChangelog_2) {
      handleAction_18();
      handleAction_21();
      showChangelogList();
      if (changelogEntryId_2) showChangelogDetail(changelogEntryId_2);
    } else {
      if (backButton) backButton.hidden = true;
      setModalTitle("Gravity");
    }
    return overflow_2 = document.body.style.overflow, modal.hidden = false, modal.setAttribute("aria-hidden", "false"), document.body.style.overflow = "hidden", noticeStorageKey_2 ? (handleAction_13(noticeStorageKey_2), changelogDetailView?.focus()) : closeButton?.focus(), true;
  }
  function close_2() {
    if (!modal || modal.hidden || dismissalLocked) return false;
    void markLatestChangelogSeen(text_9);
    const activeElement_84 = document.activeElement;
    if (returnFocus && typeof returnFocus.focus === "function") returnFocus.focus();
    return document.activeElement === activeElement_84 && activeElement_84 && typeof activeElement_84.blur === "function" && activeElement_84.blur(), returnFocus = null, handleAction_12(), modal.hidden = true, modal.setAttribute("aria-hidden", "true"), modal.classList?.remove("is-changelog-mode"), document.body.style.overflow = overflow_2, overflow_2 = "", true;
  }
  async function showLatestChangelogNotice_2(username_3) {
    if (!latestNoticeEligibilityReady || !LATEST_CHANGELOG_ENTRY_ID || !modal || !modal.hidden) return false;
    const storageKey_3 = getNoticeStorageKey(username_3);
    if (await hasSeenLatestChangelog(storageKey_3)) return false;
    if (!modal.hidden) return false;
    return open_2("changelog", {
      changelogEntryId: LATEST_CHANGELOG_ENTRY_ID,
      noticeStorageKey: storageKey_3
    });
  }
  function scheduleLatestChangelogNotice(event_2) {
    text_6 = event_2?.detail?.username || text_6 || "";
    if (!latestNoticeEligibilityReady || autoNoticeTimer || autoNoticeInFlight || !modal?.hidden) return;
    const value_88 = text_6,
      noticeStorageKey_89 = getNoticeStorageKey(value_88);
    autoNoticeInFlight = true;
    hasSeenLatestChangelog(noticeStorageKey_89).then(hasSeen => {
      if (hasSeen || !modal?.hidden) return;
      autoNoticeTimer = window.setTimeout(() => {
        autoNoticeTimer = null;
        showLatestChangelogNotice_2(value_88)["finally"](() => {
          autoNoticeInFlight = false;
        });
      }, count);
    })["catch"](() => {})["finally"](() => {
      if (!autoNoticeTimer) autoNoticeInFlight = false;
    });
  }
  function allowLatestChangelogNotice() {
    latestNoticeEligibilityReady = true;
    (text_6 || window.u2Auth?.isLoggedIn?.()) && scheduleLatestChangelogNotice({
      detail: {
        username: text_6
      }
    });
  }
  aboutChangelogMonthTriggerElement?.addEventListener("click", () => {
    handleAction_17(changelogContent_2?.hidden !== false);
  });
  closeButton?.addEventListener("click", close_2);
  confirmButton?.addEventListener("click", close_2);
  backButton?.addEventListener("click", () => showChangelogList({
    restoreFocus: true
  }));
  modal?.addEventListener("click", event => {
    if (event.target === modal) close_2();
  });
  document.addEventListener("keydown", value_91 => {
    if (value_91.key !== "Escape" || !modal || modal.hidden) return;
    if (changelogContent_2 && !changelogContent_2.hidden) {
      handleAction_17(false);
      aboutChangelogMonthTriggerElement?.focus();
      return;
    }
    close_2();
  });
  window.addEventListener("u2:main-interface-ready", scheduleLatestChangelogNotice);
  window.addEventListener("u2:splash-screen-removed", allowLatestChangelogNotice, {
    once: true
  });
  if (window.u2SplashScreenRemoved === true) allowLatestChangelogNotice();
  window.u2AboutInfoModal = {
    open: open_2,
    close: close_2,
    showLatestChangelogNotice: showLatestChangelogNotice_2
  };
})();
