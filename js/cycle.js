(function () {
  "use strict";

  const scopeValue0 = window.cycleData;
  if (!scopeValue0) return;
  let scopeValue1 = scopeValue0.createDefaultState(),
    scopeValue2 = false,
    scopeValue3 = null,
    scopeValue4 = false,
    scopeValue5 = "overview",
    scopeValue6 = new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    scopeValue7 = "",
    scopeValue8 = "",
    scopeValue9 = "new",
    scopeValue10,
    scopeValue11 = false;
  const scopeValue12 = {};
  function scopeValue13(scopeValue39) {
    return document.getElementById("cycle-" + scopeValue39);
  }
  function scopeValue14(scopeValue40) {
    return String(scopeValue40 ?? "").replace(/[&<>"']/g, scopeValue41 => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[scopeValue41]);
  }
  function scopeValue15(scopeValue42) {
    return scopeValue42 ? Number(scopeValue42.slice(5, 7)) + "月" + Number(scopeValue42.slice(8, 10)) + "日" : "暂无";
  }
  function scopeValue16(scopeValue43) {
    window.showToast?.(scopeValue43);
  }
  async function scopeValue17() {
    if (scopeValue2) return scopeValue1;
    if (scopeValue3) return scopeValue3;
    return scopeValue3 = (async () => {
      try {
        if (window.globalDataReadyPromise) await window.globalDataReadyPromise;else {
          if (window.appStorage?.["ready"]) await window.appStorage.ready;
        }
      } catch (scopeValue44) {
        console.warn("[Cycle] Storage hydration failed.", scopeValue44);
      }
      return scopeValue1 = scopeValue0.normalizeState(window.getAppState?.("cycle")), scopeValue2 = true, scopeValue1;
    })(), scopeValue3;
  }
  async function scopeValue18(scopeValue45) {
    if (scopeValue4) return false;
    scopeValue4 = true;
    const scopeValue46 = scopeValue1;
    try {
      const scopeValue47 = scopeValue0.normalizeState(scopeValue45);
      window.setAppState?.("cycle", scopeValue47);
      if (window.saveGlobalData && (await window.saveGlobalData()) === false) throw new Error("save failed");
      return scopeValue1 = scopeValue47, scopeValue23(), true;
    } catch (scopeValue48) {
      return window.setAppState?.("cycle", scopeValue46), scopeValue16("保存失败，请重试"), console.warn("[Cycle] Save failed.", scopeValue48), false;
    } finally {
      scopeValue4 = false, scopeValue19();
    }
  }
  function scopeValue19() {
    if (!scopeValue12.healthStatus) return;
    const scopeValue49 = scopeValue10?.["status"]() || {},
      scopeValue50 = window.u2NativeBridge?.["isNativeIOS"]?.() === true,
      scopeValue51 = scopeValue49.busy || scopeValue4;
    scopeValue12.healthStatus.textContent = scopeValue49.message || (scopeValue50 ? scopeValue1.health.enabled ? "已开启前台同步。" : "连接后，将“健康”中已记录的经期导入 Cycle。" : "健康导入可在 iOS 安装包中使用。"), scopeValue12.healthTime.textContent = scopeValue1.health.lastSyncAt ? "上次同步：" + new Date(scopeValue1.health.lastSyncAt).toLocaleString() + " · " + scopeValue1.health.samples.length + " 条健康记录" : "尚未同步", scopeValue12.healthConnect.hidden = scopeValue1.health.enabled, scopeValue12.healthSync.hidden = scopeValue12.healthStop.hidden = !scopeValue1.health.enabled, scopeValue12.healthClear.hidden = !scopeValue1.health.samples.length && !scopeValue1.health.lastSyncAt;
    for (const scopeValue52 of [scopeValue12.healthConnect, scopeValue12.healthSync, scopeValue12.healthStop]) scopeValue52.disabled = !scopeValue50 || scopeValue51;
    scopeValue12.healthClear.disabled = !!scopeValue51, scopeValue12.healthCard.setAttribute("aria-busy", String(!!scopeValue49.busy));
  }
  function scopeValue20() {
    const scopeValue53 = scopeValue0.getSummary(scopeValue1);
    if (!scopeValue53) return;
    let scopeValue54 = "从今天开始记录",
      scopeValue55 = "点击“开始新经期”，再按天记录身体感受。";
    if (scopeValue53.status === "period") scopeValue54 = "经期第 " + scopeValue53.periodDay + " 天", scopeValue55 = "今天已记录" + (scopeValue53.todayLog.bleeding ? " · 出血" + scopeValue53.todayLog.bleeding : "") + (scopeValue53.todayLog.pain ? " · 疼痛" + scopeValue53.todayLog.pain : "") + (scopeValue53.todayLog.moods.length ? " · " + scopeValue53.todayLog.moods.join("、") : "");else {
      if (scopeValue53.status === "awaiting-today") scopeValue54 = "今天尚未记录", scopeValue55 = "昨天有经期记录。可继续补记今天，当前状态以实际情况为准。";else {
        if (scopeValue53.status === "recent-unconfirmed") scopeValue54 = "经期状态待确认", scopeValue55 = "最近一次记录在 " + scopeValue15(scopeValue53.latestRecordedDate) + "。如仍在经期，可继续逐日补记。";else scopeValue53.recordCount && (scopeValue54 = scopeValue53.phase, scopeValue55 = scopeValue53.status === "estimated" || scopeValue53.status === "imminent" ? "周期第 " + scopeValue53.cycleDay + " 天 · 阶段仅为推测" : "周期第 " + scopeValue53.cycleDay + " 天 · 请在来潮后记录实际日期");
      }
    }
    scopeValue12.statusCard.innerHTML = "<span>当前状态</span><strong>" + scopeValue14(scopeValue54) + "</strong><p>" + scopeValue14(scopeValue55) + "</p>";
    const scopeValue56 = [["平均周期", scopeValue53.averageCycleDays === null ? scopeValue1.typicalCycleDays + " 天" : scopeValue53.averageCycleDays + " 天", scopeValue53.averageCycleDays === null ? "预设值" : "最近 " + scopeValue53.cycleSampleCount + " 个周期"], ["平均经期", scopeValue53.averagePeriodDays === null ? scopeValue1.typicalPeriodDays + " 天" : scopeValue53.averagePeriodDays + " 天", scopeValue53.averagePeriodDays === null ? "预设值" : "最近 " + scopeValue53.periodSampleCount + " 次记录"], ["累计记录", scopeValue53.recordCount + " 次", "已记录来潮"], ["当前周期", scopeValue53.cycleDay ? "第 " + scopeValue53.cycleDay + " 天" : "暂无", scopeValue53.recordCount ? "从最近一次来潮起算" : "先添加记录"]];
    scopeValue12.statsGrid.innerHTML = scopeValue56.map(([scopeValue59, scopeValue60, scopeValue61]) => "<div class=\"cycle-stat\"><span>" + scopeValue59 + "</span><strong>" + scopeValue14(scopeValue60) + "</strong><small>" + scopeValue14(scopeValue61) + "</small></div>").join("");
    const scopeValue57 = scopeValue53.nextStartDate ? scopeValue15(scopeValue53.nextStartDate) : "暂无预测",
      scopeValue58 = !scopeValue53.recordCount ? "记录首次经期开始日期后显示。" : scopeValue53.daysUntilNext < 0 ? "预计日期已过 " + -scopeValue53.daysUntilNext + " 天，尚未记录新来潮。" : scopeValue53.daysUntilNext === 0 ? "预计今天；是否来潮以实际记录为准。" : "预计还有 " + scopeValue53.daysUntilNext + " 天 · " + (scopeValue53.cycleSource === "history" ? "按历史平均周期" : "按预设周期") + "推测" + (scopeValue53.variableCycle ? " · 周期波动较大" : "");
    scopeValue12.nextCard.innerHTML = "<strong>" + scopeValue14(scopeValue57) + "</strong><span>" + scopeValue14(scopeValue58) + "</span>", scopeValue12.typicalCycle.value = scopeValue1.typicalCycleDays, scopeValue12.typicalPeriod.value = scopeValue1.typicalPeriodDays;
  }
  function scopeValue21() {
    const scopeValue62 = scopeValue0.getPeriods(scopeValue1),
      scopeValue63 = scopeValue6.getFullYear(),
      scopeValue64 = scopeValue6.getMonth(),
      scopeValue65 = new Date(scopeValue63, scopeValue64, 1).getDay(),
      scopeValue66 = new Date(scopeValue63, scopeValue64 + 1, 0).getDate(),
      scopeValue67 = scopeValue0.localTodayKey(),
      scopeValue68 = scopeValue0.getSummary(scopeValue1, scopeValue67),
      scopeValue69 = scopeValue68?.["daysUntilNext"] >= 0 ? scopeValue0.parseDateKey(scopeValue68.nextStartDate) : null;
    scopeValue12.monthLabel.textContent = scopeValue63 + "年" + (scopeValue64 + 1) + "月";
    const scopeValue70 = Array(scopeValue65).fill("<span aria-hidden=\"true\"></span>");
    for (let scopeValue71 = 1; scopeValue71 <= scopeValue66; scopeValue71 += 1) {
      const scopeValue72 = scopeValue63 + "-" + String(scopeValue64 + 1).padStart(2, "0") + "-" + String(scopeValue71).padStart(2, "0"),
        scopeValue73 = scopeValue0.parseDateKey(scopeValue72),
        scopeValue74 = scopeValue62.some(scopeValue77 => scopeValue77.days.some(scopeValue78 => scopeValue78.date === scopeValue72)),
        scopeValue75 = !scopeValue74 && scopeValue69 !== null && scopeValue73 >= scopeValue69 && scopeValue73 < scopeValue69 + scopeValue68.predictedPeriodDays,
        scopeValue76 = [scopeValue74 ? "is-actual" : "", scopeValue75 ? "is-predicted" : "", scopeValue72 === scopeValue67 ? "is-today" : ""].filter(Boolean).join(" ");
      scopeValue70.push("<button type=\"button\" class=\"" + scopeValue76 + "\" data-cycle-date=\"" + scopeValue72 + "\" aria-label=\"" + scopeValue72 + (scopeValue74 ? " 已记录经期" : scopeValue75 ? " 预计经期" : "") + "\">" + scopeValue71 + "</button>");
    }
    scopeValue12.calendarGrid.innerHTML = scopeValue70.join(""), scopeValue12.recordCount.textContent = scopeValue62.length + " 次", scopeValue12.recordList.innerHTML = scopeValue62.length ? [...scopeValue62].reverse().map(scopeValue79 => "<div class=\"cycle-record-card\">\n                <div class=\"cycle-record-heading\"><span><strong>" + scopeValue14(scopeValue79.startDate) + " 开始</strong><small>已记录 " + scopeValue79.days.length + " 天 · 最近 " + scopeValue14(scopeValue79.days.at(-1)?.["date"] || scopeValue79.startDate) + "</small></span>" + scopeValue79.manualIds.map(scopeValue80 => "<button type=\"button\" class=\"cycle-record-delete\" data-cycle-delete-period=\"" + scopeValue14(scopeValue80) + "\">删除手动记录</button>").join("") + "</div>\n                <div class=\"cycle-day-list\">" + [...scopeValue79.days].reverse().map(scopeValue81 => "<button type=\"button\" " + (scopeValue81.source === "health" ? "data-cycle-health-day=\"true\" aria-disabled=\"true\"" : "data-cycle-record-id=\"" + scopeValue14(scopeValue81.manualRecordId) + "\" data-cycle-log-date=\"" + scopeValue14(scopeValue81.date) + "\"") + "><strong>" + scopeValue14(scopeValue15(scopeValue81.date)) + "</strong><span>" + scopeValue14([scopeValue81.source === "health" ? "苹果健康" : "", scopeValue81.bleeding ? "出血" + scopeValue81.bleeding : "", scopeValue81.moods.join("、"), scopeValue81.pain ? "疼痛" + scopeValue81.pain : ""].filter(Boolean).join(" · ") || "详情未填写") + "</span>" + (scopeValue81.source === "health" ? "" : "<i class=\"fas fa-chevron-right\" aria-hidden=\"true\"></i>") + "</button>").join("") + "</div>\n                " + (scopeValue79.manualIds.length ? "<button type=\"button\" class=\"cycle-add-day-inline\" data-cycle-add-day=\"" + scopeValue14(scopeValue79.manualIds.at(-1)) + "\">+ 补记这次经期的一天</button>" : "") + "\n            </div>").join("") : "<div class=\"cycle-empty\">还没有经期记录。点击“开始新经期”添加第一天。</div>", scopeValue12.addDay.disabled = !scopeValue1.periods.length, scopeValue12.addDay.textContent = scopeValue1.periods.at(-1)?.["days"]["some"](scopeValue82 => scopeValue82.date === scopeValue67) ? "编辑今天" : "补记一天";
  }
  function scopeValue22() {
    const scopeValue83 = (Array.isArray(window.imData?.["friends"]) ? window.imData.friends : []).filter(scopeValue84 => scopeValue84?.["type"] === "char");
    scopeValue12.charList.innerHTML = scopeValue83.length ? scopeValue83.map(scopeValue85 => {
      const scopeValue86 = String(scopeValue85.id),
        scopeValue87 = String(scopeValue85.nickname || scopeValue85.realName || scopeValue85.name || "Char"),
        scopeValue88 = scopeValue1.boundCharIds.includes(scopeValue86);
      return "<button type=\"button\" class=\"cycle-char-row" + (scopeValue88 ? " is-bound" : "") + "\" data-cycle-char-id=\"" + scopeValue14(scopeValue86) + "\" aria-pressed=\"" + scopeValue88 + "\"><span class=\"cycle-char-identity\"><span class=\"cycle-char-avatar\">" + scopeValue14(scopeValue87.slice(0, 1)) + "</span><span><strong>" + scopeValue14(scopeValue87) + "</strong><small>" + (scopeValue88 ? "已绑定 · 可见当前状态" : "未绑定") + "</small></span></span><span class=\"cycle-char-switch\" aria-hidden=\"true\"></span></button>";
    }).join("") : "<div class=\"cycle-empty\">暂无可绑定的 Char。</div>";
  }
  function scopeValue23() {
    if (!scopeValue12.view?.["classList"]["contains"]("active")) return;
    if (scopeValue5 === "calendar") scopeValue21();else {
      if (scopeValue5 === "sharing") scopeValue22();else scopeValue20(), scopeValue19();
    }
  }
  function scopeValue24(scopeValue89) {
    if (!["overview", "calendar", "sharing"].includes(scopeValue89)) return;
    const scopeValue90 = document.activeElement;
    if (scopeValue90?.["closest"]?.("[data-cycle-page]")?.["dataset"]["cyclePage"] !== scopeValue89 && scopeValue12.view?.["contains"](scopeValue90)) scopeValue90.blur?.();
    scopeValue5 = scopeValue89, document.querySelectorAll("[data-cycle-page]").forEach(scopeValue91 => {
      const scopeValue92 = scopeValue91.dataset.cyclePage === scopeValue89;
      scopeValue91.hidden = !scopeValue92, scopeValue91.classList.toggle("active", scopeValue92);
    }), document.querySelectorAll("[data-cycle-tab]").forEach(scopeValue93 => {
      const scopeValue94 = scopeValue93.dataset.cycleTab === scopeValue89;
      scopeValue93.classList.toggle("active", scopeValue94), scopeValue93.setAttribute("aria-selected", String(scopeValue94));
    }), scopeValue23();
  }
  function scopeValue25(scopeValue95, scopeValue96) {
    scopeValue12.editor.querySelectorAll("[data-cycle-choice=\"" + scopeValue95 + "\"]").forEach(scopeValue97 => {
      const scopeValue98 = scopeValue96.includes(scopeValue97.dataset.cycleValue);
      scopeValue97.classList.toggle("selected", scopeValue98), scopeValue97.setAttribute("aria-pressed", String(scopeValue98));
    });
  }
  function scopeValue26(scopeValue99) {
    return [...scopeValue12.editor.querySelectorAll("[data-cycle-choice=\"" + scopeValue99 + "\"].selected")].map(scopeValue100 => scopeValue100.dataset.cycleValue);
  }
  function scopeValue27(scopeValue101) {
    const scopeValue102 = scopeValue1.periods.find(scopeValue105 => scopeValue0.parseDateKey(scopeValue105.startDate) > scopeValue0.parseDateKey(scopeValue101.startDate)),
      scopeValue103 = scopeValue0.parseDateKey(scopeValue101.days.at(-1)?.["date"] || scopeValue101.startDate),
      scopeValue104 = scopeValue0.dateKeyFromOrdinal(scopeValue103 + 1);
    return (!scopeValue102 || scopeValue104 < scopeValue102.startDate) && scopeValue104 <= scopeValue0.localTodayKey() ? scopeValue104 : scopeValue101.days.at(-1)?.["date"] || scopeValue101.startDate;
  }
  function scopeValue28(scopeValue106 = "new", scopeValue107 = "", scopeValue108 = scopeValue0.localTodayKey()) {
    const scopeValue109 = scopeValue1.periods.find(scopeValue111 => scopeValue111.id === scopeValue107) || null,
      scopeValue110 = scopeValue106 === "edit" ? scopeValue109?.["days"]["find"](scopeValue112 => scopeValue112.date === scopeValue108) : null;
    scopeValue9 = scopeValue106, scopeValue7 = scopeValue109?.["id"] || "", scopeValue8 = scopeValue110?.["date"] || "", scopeValue12.editorTitle.textContent = scopeValue106 === "new" ? "开始新经期" : scopeValue106 === "edit" ? "编辑这一天" : "补记一天", scopeValue12.logDate.value = scopeValue110?.["date"] || scopeValue108, scopeValue12.logDate.max = scopeValue0.localTodayKey(), scopeValue25("bleeding", scopeValue110?.["bleeding"] ? [scopeValue110.bleeding] : []), scopeValue25("mood", scopeValue110?.["moods"] || []), scopeValue25("pain", scopeValue110?.["pain"] ? [scopeValue110.pain] : []), scopeValue12.deleteRecord.hidden = scopeValue106 !== "edit", scopeValue12.editorHint.textContent = scopeValue106 === "new" ? "这一天会作为新经期的第一天。以后可按天补记，无需填写结束日期。" : "属于 " + (scopeValue109?.["startDate"] || "") + " 开始的经期。", scopeValue12.editor.hidden = false, scopeValue12.logDate.focus();
  }
  function scopeValue29() {
    if (scopeValue12.editor.contains(document.activeElement)) document.activeElement.blur?.();
    scopeValue12.editor.hidden = true, scopeValue7 = "", scopeValue8 = "";
  }
  function scopeValue30(scopeValue113) {
    const scopeValue114 = scopeValue0.parseDateKey(scopeValue113),
      scopeValue115 = scopeValue0.parseDateKey(scopeValue0.localTodayKey());
    if (scopeValue114 === null || scopeValue114 > scopeValue115) return "请输入有效的实际日期";
    const scopeValue116 = scopeValue1.periods,
      scopeValue117 = scopeValue116.find(scopeValue121 => scopeValue121.id === scopeValue7);
    if (scopeValue9 === "new") {
      if (scopeValue116.some(scopeValue122 => scopeValue122.startDate === scopeValue113)) return "这一天已经是一次经期的开始";
      if (scopeValue116.some(scopeValue123 => scopeValue0.parseDateKey(scopeValue123.startDate) < scopeValue114 && scopeValue0.parseDateKey(scopeValue123.days.at(-1)?.["date"]) >= scopeValue114)) return "这一天已有经期记录，请编辑或补记原经期";
      return "";
    }
    if (!scopeValue117) return "请先开始新经期";
    const scopeValue118 = scopeValue116.find(scopeValue124 => scopeValue0.parseDateKey(scopeValue124.startDate) > scopeValue0.parseDateKey(scopeValue117.startDate));
    if (scopeValue118 && scopeValue114 >= scopeValue0.parseDateKey(scopeValue118.startDate)) return "日期不能与下一次经期重叠";
    const scopeValue119 = [...scopeValue116].reverse().find(scopeValue125 => scopeValue0.parseDateKey(scopeValue125.startDate) < scopeValue0.parseDateKey(scopeValue117.startDate));
    if (scopeValue119 && scopeValue114 <= scopeValue0.parseDateKey(scopeValue119.days.at(-1)?.["date"])) return "日期不能与上一次经期重叠";
    const scopeValue120 = scopeValue9 === "edit" && scopeValue8 === scopeValue117.startDate;
    if (!scopeValue120 && scopeValue114 < scopeValue0.parseDateKey(scopeValue117.startDate)) return "补记日期不能早于本次经期第一天";
    if (scopeValue120 && scopeValue117.days.some(scopeValue126 => scopeValue126.date !== scopeValue8 && scopeValue126.date < scopeValue113)) return "第一天不能晚于已记录的其他日期";
    if (scopeValue117.days.some(scopeValue127 => scopeValue127.date === scopeValue113 && scopeValue127.date !== scopeValue8)) return "这一天已经记录过了";
    return "";
  }
  async function scopeValue31(scopeValue128) {
    scopeValue128.preventDefault();
    const scopeValue129 = scopeValue12.logDate.value,
      scopeValue130 = scopeValue30(scopeValue129);
    if (scopeValue130) {
      scopeValue16(scopeValue130);
      return;
    }
    const scopeValue131 = {
        date: scopeValue129,
        bleeding: scopeValue26("bleeding")[0] || "",
        moods: scopeValue26("mood"),
        pain: scopeValue26("pain")[0] || ""
      },
      scopeValue132 = scopeValue1.periods.map(scopeValue133 => ({
        ...scopeValue133,
        days: [...scopeValue133.days]
      }));
    if (scopeValue9 === "new") scopeValue132.push({
      id: window.crypto?.["randomUUID"]?.() || "cycle-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      startDate: scopeValue129,
      days: [scopeValue131]
    });else {
      const scopeValue134 = scopeValue132.find(scopeValue135 => scopeValue135.id === scopeValue7);
      if (scopeValue9 === "edit") scopeValue134.days = scopeValue134.days.filter(scopeValue136 => scopeValue136.date !== scopeValue8);
      if (scopeValue8 === scopeValue134.startDate) scopeValue134.startDate = scopeValue129;
      scopeValue134.days.push(scopeValue131), scopeValue134.days.sort((scopeValue137, scopeValue138) => scopeValue137.date.localeCompare(scopeValue138.date));
    }
    (await scopeValue18({
      ...scopeValue1,
      periods: scopeValue132
    })) && (scopeValue29(), scopeValue16("每日记录已保存"));
  }
  async function scopeValue32() {
    if (!scopeValue7 || !scopeValue8 || !window.confirm("删除这一天的记录？")) return;
    const scopeValue139 = scopeValue1.periods.map(scopeValue140 => ({
      ...scopeValue140,
      days: scopeValue140.days.filter(scopeValue141 => scopeValue141.date !== scopeValue8)
    })).filter(scopeValue142 => scopeValue142.days.length).map(scopeValue143 => ({
      ...scopeValue143,
      startDate: scopeValue143.days[0].date
    }));
    (await scopeValue18({
      ...scopeValue1,
      periods: scopeValue139
    })) && (scopeValue29(), scopeValue16("这一天的记录已删除"));
  }
  async function scopeValue33(scopeValue144) {
    if (!window.confirm("删除这次经期及全部每日记录？")) return;
    if (await scopeValue18({
      ...scopeValue1,
      periods: scopeValue1.periods.filter(scopeValue145 => scopeValue145.id !== scopeValue144)
    })) scopeValue16("这次经期已删除");
  }
  async function scopeValue34(scopeValue146) {
    scopeValue146.preventDefault();
    const scopeValue147 = Number(scopeValue12.typicalCycle.value),
      scopeValue148 = Number(scopeValue12.typicalPeriod.value);
    if (!Number.isInteger(scopeValue147) || scopeValue147 < 15 || scopeValue147 > 90 || !Number.isInteger(scopeValue148) || scopeValue148 < 1 || scopeValue148 > 30) {
      scopeValue16("请填写有效天数");
      return;
    }
    if (await scopeValue18({
      ...scopeValue1,
      typicalCycleDays: scopeValue147,
      typicalPeriodDays: scopeValue148
    })) scopeValue16("常用周期已更新");
  }
  async function scopeValue35(scopeValue149) {
    const scopeValue150 = (window.imData?.["friends"] || []).find(scopeValue152 => scopeValue152?.["type"] === "char" && String(scopeValue152.id) === scopeValue149);
    if (!scopeValue150) return;
    const scopeValue151 = scopeValue1.boundCharIds.includes(scopeValue149) ? scopeValue1.boundCharIds.filter(scopeValue153 => scopeValue153 !== scopeValue149) : [...scopeValue1.boundCharIds, scopeValue149];
    if (await scopeValue18({
      ...scopeValue1,
      boundCharIds: scopeValue151
    })) scopeValue16(scopeValue151.includes(scopeValue149) ? "已绑定 Char" : "已解除绑定");
  }
  let newScope36 = 0;
  async function scopeValue36() {
    const newScope155 = ++newScope36;
    scopeValue12.view.classList.add("active"), scopeValue12.view.inert = false, scopeValue12.view.setAttribute("aria-hidden", "false"), await scopeValue17();
    if (newScope155 !== newScope36 || !scopeValue12.view.classList.contains("active")) return;
    scopeValue24("overview"), void scopeValue10?.["sync"]();
  }
  function scopeValue37() {
    newScope36++, scopeValue29();
    const scopeValue154 = document.activeElement;
    if (scopeValue154 && scopeValue12.view.contains(scopeValue154)) scopeValue154.blur?.();
    scopeValue12.view.classList.remove("active"), scopeValue12.view.inert = true, scopeValue12.view.setAttribute("aria-hidden", "true"), document.getElementById("app-cycle-btn")?.["focus"]?.({
      preventScroll: true
    });
  }
  function scopeValue38() {
    Object.assign(scopeValue12, {
      view: scopeValue13("view"),
      statusCard: scopeValue13("status-card"),
      statsGrid: scopeValue13("stats-grid"),
      nextCard: scopeValue13("next-card"),
      typicalCycle: scopeValue13("typical-cycle"),
      typicalPeriod: scopeValue13("typical-period"),
      monthLabel: scopeValue13("month-label"),
      calendarGrid: scopeValue13("calendar-grid"),
      recordCount: scopeValue13("record-count"),
      recordList: scopeValue13("record-list"),
      addDay: scopeValue13("add-day"),
      charList: scopeValue13("char-list"),
      editor: scopeValue13("editor"),
      editorTitle: scopeValue13("editor-title"),
      logDate: scopeValue13("log-date"),
      editorHint: scopeValue13("editor-hint"),
      deleteRecord: scopeValue13("delete-record")
    }), Object.assign(scopeValue12, {
      healthCard: scopeValue13("health-card"),
      healthStatus: scopeValue13("health-status"),
      healthTime: scopeValue13("health-time"),
      healthConnect: scopeValue13("health-connect"),
      healthSync: scopeValue13("health-sync"),
      healthStop: scopeValue13("health-stop"),
      healthClear: scopeValue13("health-clear")
    });
    if (!scopeValue12.view) return;
    scopeValue10 = window.cycleHealth?.["createController"]({
      getState: () => scopeValue1,
      persist: scopeValue18,
      onChange: scopeValue19,
      isForeground: () => !scopeValue11 && !document.hidden && scopeValue12.view.classList.contains("active")
    }), scopeValue12.healthConnect?.["addEventListener"]("click", () => void scopeValue10?.["connect"]()), scopeValue12.healthSync?.["addEventListener"]("click", () => void scopeValue10?.["sync"]()), scopeValue12.healthStop?.["addEventListener"]("click", () => void scopeValue10?.["stop"]()), scopeValue12.healthClear?.["addEventListener"]("click", () => {
      if (window.confirm("清除已导入的健康记录并停止同步？手动记录会保留，可重新连接后导入。")) void scopeValue10?.["clear"]();
    });
    const scopeValue155 = () => {
      if (scopeValue12.view.classList.contains("active") && !document.hidden) void scopeValue10?.["sync"]();
    };
    window.addEventListener("u2:native-pause", () => {
      scopeValue11 = true;
    }), window.addEventListener("u2:native-resume", () => {
      scopeValue11 = false, scopeValue155();
    }), document.addEventListener("visibilitychange", scopeValue155), window.addEventListener("u2:native-bridge-ready", scopeValue19), window.mobileInputCompat?.["registerFocusScope"]?.({
      selector: "#cycle-view.active",
      priority: 30,
      preferFocusScope: true,
      resolveScrollContainer: scopeValue156 => scopeValue156.closest(".cycle-editor-form, .cycle-page-scroll"),
      scrollBehavior: "focus"
    }), scopeValue13("back-btn")?.["addEventListener"]("click", scopeValue37), document.querySelectorAll("[data-cycle-tab]").forEach(scopeValue157 => scopeValue157.addEventListener("click", () => scopeValue24(scopeValue157.dataset.cycleTab))), scopeValue13("prev-month")?.["addEventListener"]("click", () => {
      scopeValue6 = new Date(scopeValue6.getFullYear(), scopeValue6.getMonth() - 1, 1), scopeValue21();
    }), scopeValue13("next-month")?.["addEventListener"]("click", () => {
      scopeValue6 = new Date(scopeValue6.getFullYear(), scopeValue6.getMonth() + 1, 1), scopeValue21();
    }), scopeValue13("add-record")?.["addEventListener"]("click", () => scopeValue28("new")), scopeValue12.addDay.addEventListener("click", () => {
      const scopeValue158 = scopeValue1.periods.at(-1);
      if (scopeValue158) {
        const scopeValue159 = scopeValue0.localTodayKey();
        scopeValue28(scopeValue158.days.some(scopeValue160 => scopeValue160.date === scopeValue159) ? "edit" : "day", scopeValue158.id, scopeValue159);
      }
    }), scopeValue12.calendarGrid.addEventListener("click", scopeValue161 => {
      const scopeValue162 = scopeValue161.target.closest("[data-cycle-date]")?.["dataset"]["cycleDate"];
      if (!scopeValue162) return;
      const scopeValue163 = scopeValue0.parseDateKey(scopeValue162),
        scopeValue164 = scopeValue0.parseDateKey(scopeValue0.localTodayKey());
      if (scopeValue163 > scopeValue164) {
        scopeValue16("预计日期须等实际来潮后再记录");
        return;
      }
      const scopeValue165 = scopeValue0.getPeriods(scopeValue1).flatMap(scopeValue168 => scopeValue168.days).find(scopeValue169 => scopeValue169.date === scopeValue162 && scopeValue169.source === "health");
      if (scopeValue165) return;
      const scopeValue166 = [...scopeValue1.periods].reverse().find(scopeValue170 => scopeValue0.parseDateKey(scopeValue170.startDate) <= scopeValue163),
        scopeValue167 = scopeValue166?.["days"]["find"](scopeValue171 => scopeValue171.date === scopeValue162);
      if (scopeValue167) scopeValue28("edit", scopeValue166.id, scopeValue162);else {
        if (scopeValue166 && scopeValue163 - scopeValue0.parseDateKey(scopeValue166.startDate) <= 29) scopeValue28("day", scopeValue166.id, scopeValue162);else scopeValue28("new", "", scopeValue162);
      }
    }), scopeValue12.recordList.addEventListener("click", scopeValue172 => {
      if (scopeValue172.target.closest("[data-cycle-health-day]")) return;
      const scopeValue173 = scopeValue172.target.closest("[data-cycle-delete-period]");
      if (scopeValue173) {
        void scopeValue33(scopeValue173.dataset.cycleDeletePeriod);
        return;
      }
      const scopeValue174 = scopeValue172.target.closest("[data-cycle-add-day]");
      if (scopeValue174) {
        const scopeValue176 = scopeValue1.periods.find(scopeValue177 => scopeValue177.id === scopeValue174.dataset.cycleAddDay);
        if (scopeValue176) scopeValue28("day", scopeValue176.id, scopeValue27(scopeValue176));
        return;
      }
      const scopeValue175 = scopeValue172.target.closest("[data-cycle-log-date]");
      if (scopeValue175) scopeValue28("edit", scopeValue175.dataset.cycleRecordId, scopeValue175.dataset.cycleLogDate);
    }), scopeValue12.charList.addEventListener("click", scopeValue178 => {
      const scopeValue179 = scopeValue178.target.closest("[data-cycle-char-id]")?.["dataset"]["cycleCharId"];
      if (scopeValue179) void scopeValue35(scopeValue179);
    }), scopeValue13("record-form")?.["addEventListener"]("submit", scopeValue180 => void scopeValue31(scopeValue180)), scopeValue13("settings-form")?.["addEventListener"]("submit", scopeValue181 => void scopeValue34(scopeValue181)), scopeValue13("editor-close")?.["addEventListener"]("click", scopeValue29), scopeValue12.editor.addEventListener("click", scopeValue182 => {
      if (scopeValue182.target === scopeValue12.editor) scopeValue29();
    }), scopeValue12.deleteRecord.addEventListener("click", () => void scopeValue32()), scopeValue12.editor.querySelectorAll("[data-cycle-choice]").forEach(scopeValue183 => scopeValue183.addEventListener("click", () => {
      const scopeValue184 = scopeValue183.dataset.cycleChoice,
        scopeValue185 = scopeValue26(scopeValue184);
      if (scopeValue184 === "mood") scopeValue25(scopeValue184, scopeValue185.includes(scopeValue183.dataset.cycleValue) ? scopeValue185.filter(scopeValue186 => scopeValue186 !== scopeValue183.dataset.cycleValue) : [...scopeValue185, scopeValue183.dataset.cycleValue]);else scopeValue25(scopeValue184, scopeValue185.includes(scopeValue183.dataset.cycleValue) ? [] : [scopeValue183.dataset.cycleValue]);
    })), [scopeValue13("record-form"), scopeValue13("settings-form")].forEach(scopeValue187 => scopeValue187?.["addEventListener"]("keydown", scopeValue188 => {
      if (scopeValue188.key !== "Enter" || scopeValue188.isComposing || scopeValue188.keyCode === 229 || scopeValue188.target?.["tagName"] !== "INPUT") return;
      scopeValue188.preventDefault();
      if (scopeValue187.id === "cycle-settings-form" && scopeValue188.target === scopeValue12.typicalCycle) scopeValue12.typicalPeriod.focus();else scopeValue188.target.blur();
    })), document.addEventListener("keydown", scopeValue189 => {
      if (scopeValue189.key === "Escape" && !scopeValue12.editor.hidden && scopeValue12.view.classList.contains("active")) scopeValue29();
    }), window.addEventListener?.("u2:friend-removed", () => {
      if (scopeValue12.view.classList.contains("active")) scopeValue22();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scopeValue38, {
    once: true
  });else scopeValue38();
  window.cycleApp = {
    open: scopeValue36,
    close: scopeValue37
  };
})();
