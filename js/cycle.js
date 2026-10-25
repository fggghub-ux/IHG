(function () {
  'use strict';

  const apk119Value1 = window.cycleData;
  if (!apk119Value1) return;
  let apk119Value2 = apk119Value1.createDefaultState(),
    apk119Value3 = false,
    apk119Value4 = null,
    apk119Value5 = false,
    apk119Value6 = "overview",
    apk119Value7 = new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    apk119Value8 = "",
    apk119Value9 = "",
    apk119Value10 = "new",
    apk119Value11,
    apk119Value12 = false;
  const apk119Value13 = {};
  function apk119Value14(apk119Value40) {
    return document.getElementById("cycle-" + apk119Value40);
  }
  function apk119Value15(apk119Value41) {
    return String(apk119Value41 ?? "").replace(/[&<>"']/g, apk119Value42 => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[apk119Value42]);
  }
  function apk119Value16(apk119Value43) {
    return apk119Value43 ? Number(apk119Value43.slice(5, 7)) + "月" + Number(apk119Value43.slice(8, 10)) + "日" : "暂无";
  }
  function apk119Value17(apk119Value44) {
    window.showToast?.(apk119Value44);
  }
  async function apk119Value18() {
    if (apk119Value3) return apk119Value2;
    if (apk119Value4) return apk119Value4;
    return apk119Value4 = (async () => {
      try {
        if (window.globalDataReadyPromise) await window.globalDataReadyPromise;else {
          if (window.appStorage?.["ready"]) await window.appStorage.ready;
        }
      } catch (apk119Value45) {
        console.warn("[Cycle] Storage hydration failed.", apk119Value45);
      }
      return apk119Value2 = apk119Value1.normalizeState(window.getAppState?.("cycle")), apk119Value3 = true, apk119Value2;
    })(), apk119Value4;
  }
  async function apk119Value19(apk119Value46) {
    if (apk119Value5) return false;
    apk119Value5 = true;
    const apk119Value47 = apk119Value2;
    try {
      const apk119Value48 = apk119Value1.normalizeState(apk119Value46);
      window.setAppState?.("cycle", apk119Value48);
      if (window.saveGlobalData && (await window.saveGlobalData()) === false) throw new Error("save failed");
      return apk119Value2 = apk119Value48, apk119Value24(), true;
    } catch (apk119Value49) {
      return window.setAppState?.("cycle", apk119Value47), apk119Value17("保存失败，请重试"), console.warn("[Cycle] Save failed.", apk119Value49), false;
    } finally {
      apk119Value5 = false, apk119Value20();
    }
  }
  function apk119Value20() {
    if (!apk119Value13.healthStatus) return;
    const apk119Value50 = apk119Value11?.["status"]() || {},
      apk119Value51 = window.u2NativeBridge?.["isNativeIOS"]?.() === true,
      apk119Value52 = apk119Value50.busy || apk119Value5;
    apk119Value13.healthStatus.textContent = apk119Value50.message || (apk119Value51 ? apk119Value2.health.enabled ? "已开启前台同步。" : "连接后，将“健康”中已记录的经期导入 Cycle。" : "健康导入可在 iOS 安装包中使用。"), apk119Value13.healthTime.textContent = apk119Value2.health.lastSyncAt ? "上次同步：" + new Date(apk119Value2.health.lastSyncAt).toLocaleString() + " · " + apk119Value2.health.samples.length + " 条健康记录" : "尚未同步", apk119Value13.healthConnect.hidden = apk119Value2.health.enabled, apk119Value13.healthSync.hidden = apk119Value13.healthStop.hidden = !apk119Value2.health.enabled, apk119Value13.healthClear.hidden = !apk119Value2.health.samples.length && !apk119Value2.health.lastSyncAt;
    for (const apk119Value53 of [apk119Value13.healthConnect, apk119Value13.healthSync, apk119Value13.healthStop]) apk119Value53.disabled = !apk119Value51 || apk119Value52;
    apk119Value13.healthClear.disabled = !!apk119Value52, apk119Value13.healthCard.setAttribute("aria-busy", String(!!apk119Value50.busy));
  }
  function apk119Value21() {
    const apk119Value54 = apk119Value1.getSummary(apk119Value2);
    if (!apk119Value54) return;
    let apk119Value55 = "从今天开始记录",
      apk119Value56 = "点击“开始新经期”，再按天记录身体感受。";
    if (apk119Value54.status === "period") apk119Value55 = "经期第 " + apk119Value54.periodDay + " 天", apk119Value56 = "今天已记录" + (apk119Value54.todayLog.bleeding ? " · 出血" + apk119Value54.todayLog.bleeding : "") + (apk119Value54.todayLog.pain ? " · 疼痛" + apk119Value54.todayLog.pain : "") + (apk119Value54.todayLog.moods.length ? " · " + apk119Value54.todayLog.moods.join("、") : "");else {
      if (apk119Value54.status === "awaiting-today") apk119Value55 = "今天尚未记录", apk119Value56 = "昨天有经期记录。可继续补记今天，当前状态以实际情况为准。";else {
        if (apk119Value54.status === "recent-unconfirmed") apk119Value55 = "经期状态待确认", apk119Value56 = "最近一次记录在 " + apk119Value16(apk119Value54.latestRecordedDate) + "。如仍在经期，可继续逐日补记。";else apk119Value54.recordCount && (apk119Value55 = apk119Value54.phase, apk119Value56 = apk119Value54.status === "estimated" || apk119Value54.status === "imminent" ? "周期第 " + apk119Value54.cycleDay + " 天 · 阶段仅为推测" : "周期第 " + apk119Value54.cycleDay + " 天 · 请在来潮后记录实际日期");
      }
    }
    apk119Value13.statusCard.innerHTML = "<span>当前状态</span><strong>" + apk119Value15(apk119Value55) + "</strong><p>" + apk119Value15(apk119Value56) + "</p>";
    const apk119Value57 = [["平均周期", apk119Value54.averageCycleDays === null ? apk119Value2.typicalCycleDays + " 天" : apk119Value54.averageCycleDays + " 天", apk119Value54.averageCycleDays === null ? "预设值" : "最近 " + apk119Value54.cycleSampleCount + " 个周期"], ["平均经期", apk119Value54.averagePeriodDays === null ? apk119Value2.typicalPeriodDays + " 天" : apk119Value54.averagePeriodDays + " 天", apk119Value54.averagePeriodDays === null ? "预设值" : "最近 " + apk119Value54.periodSampleCount + " 次记录"], ["累计记录", apk119Value54.recordCount + " 次", "已记录来潮"], ["当前周期", apk119Value54.cycleDay ? "第 " + apk119Value54.cycleDay + " 天" : "暂无", apk119Value54.recordCount ? "从最近一次来潮起算" : "先添加记录"]];
    apk119Value13.statsGrid.innerHTML = apk119Value57.map(([apk119Value60, apk119Value61, apk119Value62]) => "<div class=\"cycle-stat\"><span>" + apk119Value60 + "</span><strong>" + apk119Value15(apk119Value61) + "</strong><small>" + apk119Value15(apk119Value62) + "</small></div>").join("");
    const apk119Value58 = apk119Value54.nextStartDate ? apk119Value16(apk119Value54.nextStartDate) : "暂无预测",
      apk119Value59 = !apk119Value54.recordCount ? "记录首次经期开始日期后显示。" : apk119Value54.daysUntilNext < 0 ? "预计日期已过 " + -apk119Value54.daysUntilNext + " 天，尚未记录新来潮。" : apk119Value54.daysUntilNext === 0 ? "预计今天；是否来潮以实际记录为准。" : "预计还有 " + apk119Value54.daysUntilNext + " 天 · " + (apk119Value54.cycleSource === "history" ? "按历史平均周期" : "按预设周期") + "推测" + (apk119Value54.variableCycle ? " · 周期波动较大" : "");
    apk119Value13.nextCard.innerHTML = "<strong>" + apk119Value15(apk119Value58) + "</strong><span>" + apk119Value15(apk119Value59) + "</span>", apk119Value13.typicalCycle.value = apk119Value2.typicalCycleDays, apk119Value13.typicalPeriod.value = apk119Value2.typicalPeriodDays;
  }
  function apk119Value22() {
    const apk119Value63 = apk119Value1.getPeriods(apk119Value2),
      apk119Value64 = apk119Value7.getFullYear(),
      apk119Value65 = apk119Value7.getMonth(),
      apk119Value66 = new Date(apk119Value64, apk119Value65, 1).getDay(),
      apk119Value67 = new Date(apk119Value64, apk119Value65 + 1, 0).getDate(),
      apk119Value68 = apk119Value1.localTodayKey(),
      apk119Value69 = apk119Value1.getSummary(apk119Value2, apk119Value68),
      apk119Value70 = apk119Value69?.["daysUntilNext"] >= 0 ? apk119Value1.parseDateKey(apk119Value69.nextStartDate) : null;
    apk119Value13.monthLabel.textContent = apk119Value64 + "年" + (apk119Value65 + 1) + "月";
    const apk119Value71 = Array(apk119Value66).fill("<span aria-hidden=\"true\"></span>");
    for (let apk119Value72 = 1; apk119Value72 <= apk119Value67; apk119Value72 += 1) {
      const apk119Value73 = apk119Value64 + "-" + String(apk119Value65 + 1).padStart(2, "0") + "-" + String(apk119Value72).padStart(2, "0"),
        apk119Value74 = apk119Value1.parseDateKey(apk119Value73),
        apk119Value75 = apk119Value63.some(apk119Value78 => apk119Value78.days.some(apk119Value79 => apk119Value79.date === apk119Value73)),
        apk119Value76 = !apk119Value75 && apk119Value70 !== null && apk119Value74 >= apk119Value70 && apk119Value74 < apk119Value70 + apk119Value69.predictedPeriodDays,
        apk119Value77 = [apk119Value75 ? "is-actual" : "", apk119Value76 ? "is-predicted" : "", apk119Value73 === apk119Value68 ? "is-today" : ""].filter(Boolean).join(" ");
      apk119Value71.push("<button type=\"button\" class=\"" + apk119Value77 + "\" data-cycle-date=\"" + apk119Value73 + "\" aria-label=\"" + apk119Value73 + (apk119Value75 ? " 已记录经期" : apk119Value76 ? " 预计经期" : "") + "\">" + apk119Value72 + "</button>");
    }
    apk119Value13.calendarGrid.innerHTML = apk119Value71.join(""), apk119Value13.recordCount.textContent = apk119Value63.length + " 次", apk119Value13.recordList.innerHTML = apk119Value63.length ? [...apk119Value63].reverse().map(apk119Value80 => "<div class=\"cycle-record-card\">\n                <div class=\"cycle-record-heading\"><span><strong>" + apk119Value15(apk119Value80.startDate) + " 开始</strong><small>已记录 " + apk119Value80.days.length + " 天 · 最近 " + apk119Value15(apk119Value80.days.at(-1)?.["date"] || apk119Value80.startDate) + "</small></span>" + apk119Value80.manualIds.map(apk119Value81 => "<button type=\"button\" class=\"cycle-record-delete\" data-cycle-delete-period=\"" + apk119Value15(apk119Value81) + "\">删除手动记录</button>").join("") + "</div>\n                <div class=\"cycle-day-list\">" + [...apk119Value80.days].reverse().map(apk119Value82 => "<button type=\"button\" " + (apk119Value82.source === "health" ? "data-cycle-health-day=\"true\" aria-disabled=\"true\"" : "data-cycle-record-id=\"" + apk119Value15(apk119Value82.manualRecordId) + "\" data-cycle-log-date=\"" + apk119Value15(apk119Value82.date) + "\"") + "><strong>" + apk119Value15(apk119Value16(apk119Value82.date)) + "</strong><span>" + apk119Value15([apk119Value82.source === "health" ? "苹果健康" : "", apk119Value82.bleeding ? "出血" + apk119Value82.bleeding : "", apk119Value82.moods.join("、"), apk119Value82.pain ? "疼痛" + apk119Value82.pain : ""].filter(Boolean).join(" · ") || "详情未填写") + "</span>" + (apk119Value82.source === "health" ? "" : "<i class=\"fas fa-chevron-right\" aria-hidden=\"true\"></i>") + "</button>").join("") + "</div>\n                " + (apk119Value80.manualIds.length ? "<button type=\"button\" class=\"cycle-add-day-inline\" data-cycle-add-day=\"" + apk119Value15(apk119Value80.manualIds.at(-1)) + "\">+ 补记这次经期的一天</button>" : "") + "\n            </div>").join("") : "<div class=\"cycle-empty\">还没有经期记录。点击“开始新经期”添加第一天。</div>", apk119Value13.addDay.disabled = !apk119Value2.periods.length, apk119Value13.addDay.textContent = apk119Value2.periods.at(-1)?.["days"]["some"](apk119Value83 => apk119Value83.date === apk119Value68) ? "编辑今天" : "补记一天";
  }
  function apk119Value23() {
    const apk119Value84 = (Array.isArray(window.imData?.["friends"]) ? window.imData.friends : []).filter(apk119Value85 => apk119Value85?.["type"] === "char");
    apk119Value13.charList.innerHTML = apk119Value84.length ? apk119Value84.map(apk119Value86 => {
      const apk119Value87 = String(apk119Value86.id),
        apk119Value88 = String(apk119Value86.nickname || apk119Value86.realName || apk119Value86.name || "Char"),
        apk119Value89 = apk119Value2.boundCharIds.includes(apk119Value87);
      return "<button type=\"button\" class=\"cycle-char-row" + (apk119Value89 ? " is-bound" : "") + "\" data-cycle-char-id=\"" + apk119Value15(apk119Value87) + "\" aria-pressed=\"" + apk119Value89 + "\"><span class=\"cycle-char-identity\"><span class=\"cycle-char-avatar\">" + apk119Value15(apk119Value88.slice(0, 1)) + "</span><span><strong>" + apk119Value15(apk119Value88) + "</strong><small>" + (apk119Value89 ? "已绑定 · 可见当前状态" : "未绑定") + "</small></span></span><span class=\"cycle-char-switch\" aria-hidden=\"true\"></span></button>";
    }).join("") : "<div class=\"cycle-empty\">暂无可绑定的 Char。</div>";
  }
  function apk119Value24() {
    apk119Value21(), apk119Value22(), apk119Value23(), apk119Value20();
  }
  function apk119Value25(apk119Value90) {
    if (!["overview", "calendar", "sharing"].includes(apk119Value90)) return;
    const apk119Value91 = document.activeElement;
    if (apk119Value91?.["closest"]?.("[data-cycle-page]")?.["dataset"]["cyclePage"] !== apk119Value90 && apk119Value13.view?.["contains"](apk119Value91)) apk119Value91.blur?.();
    apk119Value6 = apk119Value90, document.querySelectorAll("[data-cycle-page]").forEach(apk119Value92 => {
      const apk119Value93 = apk119Value92.dataset.cyclePage === apk119Value90;
      apk119Value92.hidden = !apk119Value93, apk119Value92.classList.toggle("active", apk119Value93);
    }), document.querySelectorAll("[data-cycle-tab]").forEach(apk119Value94 => {
      const apk119Value95 = apk119Value94.dataset.cycleTab === apk119Value90;
      apk119Value94.classList.toggle("active", apk119Value95), apk119Value94.setAttribute("aria-selected", String(apk119Value95));
    });
  }
  function apk119Value26(apk119Value96, apk119Value97) {
    apk119Value13.editor.querySelectorAll("[data-cycle-choice=\"" + apk119Value96 + "\"]").forEach(apk119Value98 => {
      const apk119Value99 = apk119Value97.includes(apk119Value98.dataset.cycleValue);
      apk119Value98.classList.toggle("selected", apk119Value99), apk119Value98.setAttribute("aria-pressed", String(apk119Value99));
    });
  }
  function apk119Value27(apk119Value100) {
    return [...apk119Value13.editor.querySelectorAll("[data-cycle-choice=\"" + apk119Value100 + "\"].selected")].map(apk119Value101 => apk119Value101.dataset.cycleValue);
  }
  function apk119Value28(apk119Value102) {
    const apk119Value103 = apk119Value2.periods.find(apk119Value106 => apk119Value1.parseDateKey(apk119Value106.startDate) > apk119Value1.parseDateKey(apk119Value102.startDate)),
      apk119Value104 = apk119Value1.parseDateKey(apk119Value102.days.at(-1)?.["date"] || apk119Value102.startDate),
      apk119Value105 = apk119Value1.dateKeyFromOrdinal(apk119Value104 + 1);
    return (!apk119Value103 || apk119Value105 < apk119Value103.startDate) && apk119Value105 <= apk119Value1.localTodayKey() ? apk119Value105 : apk119Value102.days.at(-1)?.["date"] || apk119Value102.startDate;
  }
  function apk119Value29(apk119Value107 = "new", apk119Value108 = "", apk119Value109 = apk119Value1.localTodayKey()) {
    const apk119Value110 = apk119Value2.periods.find(apk119Value112 => apk119Value112.id === apk119Value108) || null,
      apk119Value111 = apk119Value107 === "edit" ? apk119Value110?.["days"]["find"](apk119Value113 => apk119Value113.date === apk119Value109) : null;
    apk119Value10 = apk119Value107, apk119Value8 = apk119Value110?.["id"] || "", apk119Value9 = apk119Value111?.["date"] || "", apk119Value13.editorTitle.textContent = apk119Value107 === "new" ? "开始新经期" : apk119Value107 === "edit" ? "编辑这一天" : "补记一天", apk119Value13.logDate.value = apk119Value111?.["date"] || apk119Value109, apk119Value13.logDate.max = apk119Value1.localTodayKey(), apk119Value26("bleeding", apk119Value111?.["bleeding"] ? [apk119Value111.bleeding] : []), apk119Value26("mood", apk119Value111?.["moods"] || []), apk119Value26("pain", apk119Value111?.["pain"] ? [apk119Value111.pain] : []), apk119Value13.deleteRecord.hidden = apk119Value107 !== "edit", apk119Value13.editorHint.textContent = apk119Value107 === "new" ? "这一天会作为新经期的第一天。以后可按天补记，无需填写结束日期。" : "属于 " + (apk119Value110?.["startDate"] || "") + " 开始的经期。", apk119Value13.editor.hidden = false, apk119Value13.logDate.focus();
  }
  function apk119Value30() {
    if (apk119Value13.editor.contains(document.activeElement)) document.activeElement.blur?.();
    apk119Value13.editor.hidden = true, apk119Value8 = "", apk119Value9 = "";
  }
  function apk119Value31(apk119Value114) {
    const apk119Value115 = apk119Value1.parseDateKey(apk119Value114),
      apk119Value116 = apk119Value1.parseDateKey(apk119Value1.localTodayKey());
    if (apk119Value115 === null || apk119Value115 > apk119Value116) return "请输入有效的实际日期";
    const apk119Value117 = apk119Value2.periods,
      apk119Value118 = apk119Value117.find(apk119Value122 => apk119Value122.id === apk119Value8);
    if (apk119Value10 === "new") {
      if (apk119Value117.some(apk119Value123 => apk119Value123.startDate === apk119Value114)) return "这一天已经是一次经期的开始";
      if (apk119Value117.some(apk119Value124 => apk119Value1.parseDateKey(apk119Value124.startDate) < apk119Value115 && apk119Value1.parseDateKey(apk119Value124.days.at(-1)?.["date"]) >= apk119Value115)) return "这一天已有经期记录，请编辑或补记原经期";
      return "";
    }
    if (!apk119Value118) return "请先开始新经期";
    const apk119Value119 = apk119Value117.find(apk119Value125 => apk119Value1.parseDateKey(apk119Value125.startDate) > apk119Value1.parseDateKey(apk119Value118.startDate));
    if (apk119Value119 && apk119Value115 >= apk119Value1.parseDateKey(apk119Value119.startDate)) return "日期不能与下一次经期重叠";
    const apk119Value120 = [...apk119Value117].reverse().find(apk119Value126 => apk119Value1.parseDateKey(apk119Value126.startDate) < apk119Value1.parseDateKey(apk119Value118.startDate));
    if (apk119Value120 && apk119Value115 <= apk119Value1.parseDateKey(apk119Value120.days.at(-1)?.["date"])) return "日期不能与上一次经期重叠";
    const apk119Value121 = apk119Value10 === "edit" && apk119Value9 === apk119Value118.startDate;
    if (!apk119Value121 && apk119Value115 < apk119Value1.parseDateKey(apk119Value118.startDate)) return "补记日期不能早于本次经期第一天";
    if (apk119Value121 && apk119Value118.days.some(apk119Value127 => apk119Value127.date !== apk119Value9 && apk119Value127.date < apk119Value114)) return "第一天不能晚于已记录的其他日期";
    if (apk119Value118.days.some(apk119Value128 => apk119Value128.date === apk119Value114 && apk119Value128.date !== apk119Value9)) return "这一天已经记录过了";
    return "";
  }
  async function apk119Value32(apk119Value129) {
    apk119Value129.preventDefault();
    const apk119Value130 = apk119Value13.logDate.value,
      apk119Value131 = apk119Value31(apk119Value130);
    if (apk119Value131) {
      apk119Value17(apk119Value131);
      return;
    }
    const apk119Value132 = {
        date: apk119Value130,
        bleeding: apk119Value27("bleeding")[0] || "",
        moods: apk119Value27("mood"),
        pain: apk119Value27("pain")[0] || ""
      },
      apk119Value133 = apk119Value2.periods.map(apk119Value134 => ({
        ...apk119Value134,
        days: [...apk119Value134.days]
      }));
    if (apk119Value10 === "new") apk119Value133.push({
      id: window.crypto?.["randomUUID"]?.() || "cycle-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      startDate: apk119Value130,
      days: [apk119Value132]
    });else {
      const apk119Value135 = apk119Value133.find(apk119Value136 => apk119Value136.id === apk119Value8);
      if (apk119Value10 === "edit") apk119Value135.days = apk119Value135.days.filter(apk119Value137 => apk119Value137.date !== apk119Value9);
      if (apk119Value9 === apk119Value135.startDate) apk119Value135.startDate = apk119Value130;
      apk119Value135.days.push(apk119Value132), apk119Value135.days.sort((apk119Value138, apk119Value139) => apk119Value138.date.localeCompare(apk119Value139.date));
    }
    (await apk119Value19({
      ...apk119Value2,
      periods: apk119Value133
    })) && (apk119Value30(), apk119Value17("每日记录已保存"));
  }
  async function apk119Value33() {
    if (!apk119Value8 || !apk119Value9 || !window.confirm("删除这一天的记录？")) return;
    const apk119Value140 = apk119Value2.periods.map(apk119Value141 => ({
      ...apk119Value141,
      days: apk119Value141.days.filter(apk119Value142 => apk119Value142.date !== apk119Value9)
    })).filter(apk119Value143 => apk119Value143.days.length).map(apk119Value144 => ({
      ...apk119Value144,
      startDate: apk119Value144.days[0].date
    }));
    (await apk119Value19({
      ...apk119Value2,
      periods: apk119Value140
    })) && (apk119Value30(), apk119Value17("这一天的记录已删除"));
  }
  async function apk119Value34(apk119Value145) {
    if (!window.confirm("删除这次经期及全部每日记录？")) return;
    if (await apk119Value19({
      ...apk119Value2,
      periods: apk119Value2.periods.filter(apk119Value146 => apk119Value146.id !== apk119Value145)
    })) apk119Value17("这次经期已删除");
  }
  async function apk119Value35(apk119Value147) {
    apk119Value147.preventDefault();
    const apk119Value148 = Number(apk119Value13.typicalCycle.value),
      apk119Value149 = Number(apk119Value13.typicalPeriod.value);
    if (!Number.isInteger(apk119Value148) || apk119Value148 < 15 || apk119Value148 > 90 || !Number.isInteger(apk119Value149) || apk119Value149 < 1 || apk119Value149 > 30) {
      apk119Value17("请填写有效天数");
      return;
    }
    if (await apk119Value19({
      ...apk119Value2,
      typicalCycleDays: apk119Value148,
      typicalPeriodDays: apk119Value149
    })) apk119Value17("常用周期已更新");
  }
  async function apk119Value36(apk119Value150) {
    const apk119Value151 = (window.imData?.["friends"] || []).find(apk119Value153 => apk119Value153?.["type"] === "char" && String(apk119Value153.id) === apk119Value150);
    if (!apk119Value151) return;
    const apk119Value152 = apk119Value2.boundCharIds.includes(apk119Value150) ? apk119Value2.boundCharIds.filter(apk119Value154 => apk119Value154 !== apk119Value150) : [...apk119Value2.boundCharIds, apk119Value150];
    if (await apk119Value19({
      ...apk119Value2,
      boundCharIds: apk119Value152
    })) apk119Value17(apk119Value152.includes(apk119Value150) ? "已绑定 Char" : "已解除绑定");
  }
  async function apk119Value37() {
    apk119Value13.view.classList.add("active"), apk119Value13.view.inert = false, apk119Value13.view.setAttribute("aria-hidden", "false"), await apk119Value18(), apk119Value25("overview"), apk119Value24(), void apk119Value11?.["sync"]();
  }
  function apk119Value38() {
    apk119Value30();
    const apk119Value155 = document.activeElement;
    if (apk119Value155 && apk119Value13.view.contains(apk119Value155)) apk119Value155.blur?.();
    apk119Value13.view.classList.remove("active"), apk119Value13.view.inert = true, apk119Value13.view.setAttribute("aria-hidden", "true"), document.getElementById("app-cycle-btn")?.["focus"]?.({
      preventScroll: true
    });
  }
  function apk119Value39() {
    Object.assign(apk119Value13, {
      view: apk119Value14("view"),
      statusCard: apk119Value14("status-card"),
      statsGrid: apk119Value14("stats-grid"),
      nextCard: apk119Value14("next-card"),
      typicalCycle: apk119Value14("typical-cycle"),
      typicalPeriod: apk119Value14("typical-period"),
      monthLabel: apk119Value14("month-label"),
      calendarGrid: apk119Value14("calendar-grid"),
      recordCount: apk119Value14("record-count"),
      recordList: apk119Value14("record-list"),
      addDay: apk119Value14("add-day"),
      charList: apk119Value14("char-list"),
      editor: apk119Value14("editor"),
      editorTitle: apk119Value14("editor-title"),
      logDate: apk119Value14("log-date"),
      editorHint: apk119Value14("editor-hint"),
      deleteRecord: apk119Value14("delete-record")
    }), Object.assign(apk119Value13, {
      healthCard: apk119Value14("health-card"),
      healthStatus: apk119Value14("health-status"),
      healthTime: apk119Value14("health-time"),
      healthConnect: apk119Value14("health-connect"),
      healthSync: apk119Value14("health-sync"),
      healthStop: apk119Value14("health-stop"),
      healthClear: apk119Value14("health-clear")
    });
    if (!apk119Value13.view) return;
    apk119Value11 = window.cycleHealth?.["createController"]({
      getState: () => apk119Value2,
      persist: apk119Value19,
      onChange: apk119Value20,
      isForeground: () => !apk119Value12 && !document.hidden && apk119Value13.view.classList.contains("active")
    }), apk119Value13.healthConnect?.["addEventListener"]("click", () => void apk119Value11?.["connect"]()), apk119Value13.healthSync?.["addEventListener"]("click", () => void apk119Value11?.["sync"]()), apk119Value13.healthStop?.["addEventListener"]("click", () => void apk119Value11?.["stop"]()), apk119Value13.healthClear?.["addEventListener"]("click", () => {
      if (window.confirm("清除已导入的健康记录并停止同步？手动记录会保留，可重新连接后导入。")) void apk119Value11?.["clear"]();
    });
    const apk119Value156 = () => {
      if (apk119Value13.view.classList.contains("active") && !document.hidden) void apk119Value11?.["sync"]();
    };
    window.addEventListener("u2:native-pause", () => {
      apk119Value12 = true;
    }), window.addEventListener("u2:native-resume", () => {
      apk119Value12 = false, apk119Value156();
    }), document.addEventListener("visibilitychange", apk119Value156), window.addEventListener("u2:native-bridge-ready", apk119Value20), window.mobileInputCompat?.["registerFocusScope"]?.({
      selector: "#cycle-view.active",
      priority: 30,
      preferFocusScope: true,
      resolveScrollContainer: apk119Value157 => apk119Value157.closest(".cycle-editor-form, .cycle-page-scroll"),
      scrollBehavior: "focus"
    }), apk119Value14("back-btn")?.["addEventListener"]("click", apk119Value38), document.querySelectorAll("[data-cycle-tab]").forEach(apk119Value158 => apk119Value158.addEventListener("click", () => apk119Value25(apk119Value158.dataset.cycleTab))), apk119Value14("prev-month")?.["addEventListener"]("click", () => {
      apk119Value7 = new Date(apk119Value7.getFullYear(), apk119Value7.getMonth() - 1, 1), apk119Value22();
    }), apk119Value14("next-month")?.["addEventListener"]("click", () => {
      apk119Value7 = new Date(apk119Value7.getFullYear(), apk119Value7.getMonth() + 1, 1), apk119Value22();
    }), apk119Value14("add-record")?.["addEventListener"]("click", () => apk119Value29("new")), apk119Value13.addDay.addEventListener("click", () => {
      const apk119Value159 = apk119Value2.periods.at(-1);
      if (apk119Value159) {
        const apk119Value160 = apk119Value1.localTodayKey();
        apk119Value29(apk119Value159.days.some(apk119Value161 => apk119Value161.date === apk119Value160) ? "edit" : "day", apk119Value159.id, apk119Value160);
      }
    }), apk119Value13.calendarGrid.addEventListener("click", apk119Value162 => {
      const apk119Value163 = apk119Value162.target.closest("[data-cycle-date]")?.["dataset"]["cycleDate"];
      if (!apk119Value163) return;
      const apk119Value164 = apk119Value1.parseDateKey(apk119Value163),
        apk119Value165 = apk119Value1.parseDateKey(apk119Value1.localTodayKey());
      if (apk119Value164 > apk119Value165) {
        apk119Value17("预计日期须等实际来潮后再记录");
        return;
      }
      const apk119Value166 = apk119Value1.getPeriods(apk119Value2).flatMap(apk119Value169 => apk119Value169.days).find(apk119Value170 => apk119Value170.date === apk119Value163 && apk119Value170.source === "health");
      if (apk119Value166) return;
      const apk119Value167 = [...apk119Value2.periods].reverse().find(apk119Value171 => apk119Value1.parseDateKey(apk119Value171.startDate) <= apk119Value164),
        apk119Value168 = apk119Value167?.["days"]["find"](apk119Value172 => apk119Value172.date === apk119Value163);
      if (apk119Value168) apk119Value29("edit", apk119Value167.id, apk119Value163);else {
        if (apk119Value167 && apk119Value164 - apk119Value1.parseDateKey(apk119Value167.startDate) <= 29) apk119Value29("day", apk119Value167.id, apk119Value163);else apk119Value29("new", "", apk119Value163);
      }
    }), apk119Value13.recordList.addEventListener("click", apk119Value173 => {
      if (apk119Value173.target.closest("[data-cycle-health-day]")) return;
      const apk119Value174 = apk119Value173.target.closest("[data-cycle-delete-period]");
      if (apk119Value174) {
        void apk119Value34(apk119Value174.dataset.cycleDeletePeriod);
        return;
      }
      const apk119Value175 = apk119Value173.target.closest("[data-cycle-add-day]");
      if (apk119Value175) {
        const apk119Value177 = apk119Value2.periods.find(apk119Value178 => apk119Value178.id === apk119Value175.dataset.cycleAddDay);
        if (apk119Value177) apk119Value29("day", apk119Value177.id, apk119Value28(apk119Value177));
        return;
      }
      const apk119Value176 = apk119Value173.target.closest("[data-cycle-log-date]");
      if (apk119Value176) apk119Value29("edit", apk119Value176.dataset.cycleRecordId, apk119Value176.dataset.cycleLogDate);
    }), apk119Value13.charList.addEventListener("click", apk119Value179 => {
      const apk119Value180 = apk119Value179.target.closest("[data-cycle-char-id]")?.["dataset"]["cycleCharId"];
      if (apk119Value180) void apk119Value36(apk119Value180);
    }), apk119Value14("record-form")?.["addEventListener"]("submit", apk119Value181 => void apk119Value32(apk119Value181)), apk119Value14("settings-form")?.["addEventListener"]("submit", apk119Value182 => void apk119Value35(apk119Value182)), apk119Value14("editor-close")?.["addEventListener"]("click", apk119Value30), apk119Value13.editor.addEventListener("click", apk119Value183 => {
      if (apk119Value183.target === apk119Value13.editor) apk119Value30();
    }), apk119Value13.deleteRecord.addEventListener("click", () => void apk119Value33()), apk119Value13.editor.querySelectorAll("[data-cycle-choice]").forEach(apk119Value184 => apk119Value184.addEventListener("click", () => {
      const apk119Value185 = apk119Value184.dataset.cycleChoice,
        apk119Value186 = apk119Value27(apk119Value185);
      if (apk119Value185 === "mood") apk119Value26(apk119Value185, apk119Value186.includes(apk119Value184.dataset.cycleValue) ? apk119Value186.filter(apk119Value187 => apk119Value187 !== apk119Value184.dataset.cycleValue) : [...apk119Value186, apk119Value184.dataset.cycleValue]);else apk119Value26(apk119Value185, apk119Value186.includes(apk119Value184.dataset.cycleValue) ? [] : [apk119Value184.dataset.cycleValue]);
    })), [apk119Value14("record-form"), apk119Value14("settings-form")].forEach(apk119Value188 => apk119Value188?.["addEventListener"]("keydown", apk119Value189 => {
      if (apk119Value189.key !== "Enter" || apk119Value189.isComposing || apk119Value189.keyCode === 229 || apk119Value189.target?.["tagName"] !== "INPUT") return;
      apk119Value189.preventDefault();
      if (apk119Value188.id === "cycle-settings-form" && apk119Value189.target === apk119Value13.typicalCycle) apk119Value13.typicalPeriod.focus();else apk119Value189.target.blur();
    })), document.addEventListener("keydown", apk119Value190 => {
      if (apk119Value190.key === "Escape" && !apk119Value13.editor.hidden && apk119Value13.view.classList.contains("active")) apk119Value30();
    }), window.addEventListener?.("u2:friend-removed", () => {
      if (apk119Value13.view.classList.contains("active")) apk119Value23();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apk119Value39, {
    once: true
  });else apk119Value39();
  window.cycleApp = {
    open: apk119Value37,
    close: apk119Value38
  };
})();