(function () {
    'use strict';

    const cycleData_2 = window.cycleData;
    if (!cycleData_2) return;
    let defaultState = cycleData_2.createDefaultState(),
        enabled = false,
        value_3 = null,
        enabled_4 = false,
        text = 'overview',
        value_5 = new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        text_6 = '',
        text_7 = '',
        text_8 = 'new';
    const options = {};
    function handleAction_9(value_34) {
        return document.getElementById('cycle-' + value_34);
    }
    function handleAction_10(value_35) {
        return String(value_35 ?? '').replace(
            /[&<>"']/g,
            (value_36) =>
                ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                })[value_36],
        );
    }
    function handleAction_11(items) {
        return items
            ? Number(items.slice(5, 7)) + '月' + Number(items.slice(8, 10)) + '日'
            : '暂无';
    }
    function handleAction_12(value_37) {
        window.showToast?.(value_37);
    }
    async function handleAction_13() {
        if (enabled) return defaultState;
        if (value_3) return value_3;
        return (
            (value_3 = (async () => {
                try {
                    if (window.globalDataReadyPromise) await window.globalDataReadyPromise;
                    else {
                        if (window.appStorage?.ready) await window.appStorage.ready;
                    }
                } catch (value_38) {
                    console.warn('[Cycle] Storage hydration failed.', value_38);
                }
                return (
                    (defaultState = cycleData_2.normalizeState(window.getAppState?.('cycle'))),
                    (enabled = true),
                    defaultState
                );
            })()),
            value_3
        );
    }
    async function handleAction_14(value_39) {
        if (enabled_4) return false;
        enabled_4 = true;
        const value_40 = defaultState;
        try {
            const state = cycleData_2.normalizeState(value_39);
            window.setAppState?.('cycle', state);
            if (window.saveGlobalData && (await window.saveGlobalData()) === false)
                throw new Error('save failed');
            return ((defaultState = state), handleAction_18(), true);
        } catch (value_41) {
            return (
                window.setAppState?.('cycle', value_40),
                handleAction_12('保存失败，请重试'),
                console.warn('[Cycle] Save failed.', value_41),
                false
            );
        } finally {
            enabled_4 = false;
        }
    }
    function handleAction_15() {
        const summary = cycleData_2.getSummary(defaultState);
        if (!summary) return;
        let text_42 = '从今天开始记录',
            text_43 = '点击“开始新经期”，再按天记录身体感受。';
        if (summary.status === 'period') {
            text_42 = '经期第 ' + summary.periodDay + ' 天';
            text_43 =
                '今天已记录' +
                (summary.todayLog.bleeding ? ' · 出血' + summary.todayLog.bleeding : '') +
                (summary.todayLog.pain ? ' · 疼痛' + summary.todayLog.pain : '') +
                (summary.todayLog.moods.length ? ' · ' + summary.todayLog.moods.join('、') : '');
        } else {
            if (summary.status === 'awaiting-today') {
                text_42 = '今天尚未记录';
                text_43 = '昨天有经期记录。可继续补记今天，当前状态以实际情况为准。';
            } else {
                if (summary.status === 'recent-unconfirmed') {
                    text_42 = '经期状态待确认';
                    text_43 =
                        '最近一次记录在 ' +
                        handleAction_11(summary.latestRecordedDate) +
                        '。如仍在经期，可继续逐日补记。';
                } else
                    summary.recordCount &&
                        ((text_42 = summary.phase),
                        (text_43 =
                            summary.status === 'estimated' || summary.status === 'imminent'
                                ? '周期第 ' + summary.cycleDay + ' 天 · 阶段仅为推测'
                                : '周期第 ' + summary.cycleDay + ' 天 · 请在来潮后记录实际日期'));
            }
        }
        options.statusCard.innerHTML =
            '<span>当前状态</span><strong>' +
            handleAction_10(text_42) +
            '</strong><p>' +
            handleAction_10(text_43) +
            '</p>';
        const items_44 = [
            [
                '平均周期',
                summary.averageCycleDays === null
                    ? defaultState.typicalCycleDays + ' 天'
                    : summary.averageCycleDays + ' 天',
                summary.averageCycleDays === null
                    ? '预设值'
                    : '最近 ' + summary.cycleSampleCount + ' 个周期',
            ],
            [
                '平均经期',
                summary.averagePeriodDays === null
                    ? defaultState.typicalPeriodDays + ' 天'
                    : summary.averagePeriodDays + ' 天',
                summary.averagePeriodDays === null
                    ? '预设值'
                    : '最近 ' + summary.periodSampleCount + ' 次记录',
            ],
            ['累计记录', summary.recordCount + ' 次', '已记录来潮'],
            [
                '当前周期',
                summary.cycleDay ? '第 ' + summary.cycleDay + ' 天' : '暂无',
                summary.recordCount ? '从最近一次来潮起算' : '先添加记录',
            ],
        ];
        options.statsGrid.innerHTML = items_44
            .map(
                ([value_47, value_48, value_49]) =>
                    '<div class="cycle-stat"><span>' +
                    value_47 +
                    '</span><strong>' +
                    handleAction_10(value_48) +
                    '</strong><small>' +
                    handleAction_10(value_49) +
                    '</small></div>',
            )
            .join('');
        const value_45 = summary.nextStartDate
                ? handleAction_11(summary.nextStartDate)
                : '暂无预测',
            value_46 = !summary.recordCount
                ? '记录首次经期开始日期后显示。'
                : summary.daysUntilNext < 0
                  ? '预计日期已过 ' + -summary.daysUntilNext + ' 天，尚未记录新来潮。'
                  : summary.daysUntilNext === 0
                    ? '预计今天；是否来潮以实际记录为准。'
                    : '预计还有 ' +
                      summary.daysUntilNext +
                      ' 天 · ' +
                      (summary.cycleSource === 'history' ? '按历史平均周期' : '按预设周期') +
                      '推测' +
                      (summary.variableCycle ? ' · 周期波动较大' : '');
        options.nextCard.innerHTML =
            '<strong>' +
            handleAction_10(value_45) +
            '</strong><span>' +
            handleAction_10(value_46) +
            '</span>';
        options.typicalCycle.value = defaultState.typicalCycleDays;
        options.typicalPeriod.value = defaultState.typicalPeriodDays;
    }
    function handleAction_16() {
        const fullYear = value_5.getFullYear(),
            month = value_5.getMonth(),
            day = new Date(fullYear, month, 1).getDay(),
            date_50 = new Date(fullYear, month + 1, 0).getDate(),
            localTodayKey_51 = cycleData_2.localTodayKey(),
            summary_52 = cycleData_2.getSummary(defaultState, localTodayKey_51),
            value_53 =
                summary_52?.daysUntilNext >= 0
                    ? cycleData_2.parseDateKey(summary_52.nextStartDate)
                    : null;
        options.monthLabel.textContent = fullYear + '年' + (month + 1) + '月';
        const fill_54 = Array(day).fill('<span aria-hidden="true"></span>');
        for (let count = 1; count <= date_50; count += 1) {
            const value_55 =
                    fullYear +
                    '-' +
                    String(month + 1).padStart(2, '0') +
                    '-' +
                    String(count).padStart(2, '0'),
                dateKey = cycleData_2.parseDateKey(value_55),
                some_56 = defaultState.periods.some((value_59) =>
                    value_59.days.some((value_60) => value_60.date === value_55),
                ),
                value_57 =
                    !some_56 &&
                    value_53 !== null &&
                    dateKey >= value_53 &&
                    dateKey < value_53 + summary_52.predictedPeriodDays,
                join_58 = [
                    some_56 ? 'is-actual' : '',
                    value_57 ? 'is-predicted' : '',
                    value_55 === localTodayKey_51 ? 'is-today' : '',
                ]
                    .filter(Boolean)
                    .join(' ');
            fill_54.push(
                '<button type="button" class="' +
                    join_58 +
                    '" data-cycle-date="' +
                    value_55 +
                    '" aria-label="' +
                    value_55 +
                    (some_56 ? ' 已记录经期' : value_57 ? ' 预计经期' : '') +
                    '">' +
                    count +
                    '</button>',
            );
        }
        options.calendarGrid.innerHTML = fill_54.join('');
        options.recordCount.textContent = defaultState.periods.length + ' 次';
        options.recordList.innerHTML = defaultState.periods.length
            ? [...defaultState.periods]
                  .reverse()
                  .map(
                      (value_61) =>
                          `<div class="cycle-record-card">
                <div class="cycle-record-heading"><span><strong>` +
                          handleAction_10(value_61.startDate) +
                          ' 开始</strong><small>已记录 ' +
                          value_61.days.length +
                          ' 天 · 最近 ' +
                          handleAction_10(value_61.days.at(-1)?.date || value_61.startDate) +
                          '</small></span><button type="button" class="cycle-record-delete" data-cycle-delete-period="' +
                          handleAction_10(value_61.id) +
                          '" aria-label="删除 ' +
                          handleAction_10(value_61.startDate) +
                          ` 开始的经期">删除</button></div>
                <div class="cycle-day-list">` +
                          [...value_61.days]
                              .reverse()
                              .map(
                                  (value_62) =>
                                      '<button type="button" data-cycle-record-id="' +
                                      handleAction_10(value_61.id) +
                                      '" data-cycle-log-date="' +
                                      handleAction_10(value_62.date) +
                                      '"><strong>' +
                                      handleAction_10(handleAction_11(value_62.date)) +
                                      '</strong><span>' +
                                      handleAction_10(
                                          [
                                              value_62.bleeding ? '出血' + value_62.bleeding : '',
                                              value_62.moods.join('、'),
                                              value_62.pain ? '疼痛' + value_62.pain : '',
                                          ]
                                              .filter(Boolean)
                                              .join(' · ') || '详情未填写',
                                      ) +
                                      '</span><i class="fas fa-chevron-right" aria-hidden="true"></i></button>',
                              )
                              .join('') +
                          `</div>
                <button type="button" class="cycle-add-day-inline" data-cycle-add-day="` +
                          handleAction_10(value_61.id) +
                          `">+ 补记这次经期的一天</button>
            </div>`,
                  )
                  .join('')
            : '<div class="cycle-empty">还没有经期记录。点击“开始新经期”添加第一天。</div>';
        options.addDay.disabled = !defaultState.periods.length;
        options.addDay.textContent = defaultState.periods
            .at(-1)
            ?.days.some((value_63) => value_63.date === localTodayKey_51)
            ? '编辑今天'
            : '补记一天';
    }
    function handleAction_17() {
        const filter_64 = (
            Array.isArray(window.imData?.friends) ? window.imData.friends : []
        ).filter((value_65) => value_65?.type === 'char');
        options.charList.innerHTML = filter_64.length
            ? filter_64
                  .map((value_66) => {
                      const string = String(value_66.id),
                          string_67 = String(
                              value_66.nickname || value_66.realName || value_66.name || 'Char',
                          ),
                          includes_68 = defaultState.boundCharIds.includes(string);
                      return (
                          '<button type="button" class="cycle-char-row' +
                          (includes_68 ? ' is-bound' : '') +
                          '" data-cycle-char-id="' +
                          handleAction_10(string) +
                          '" aria-pressed="' +
                          includes_68 +
                          '"><span class="cycle-char-identity"><span class="cycle-char-avatar">' +
                          handleAction_10(string_67.slice(0, 1)) +
                          '</span><span><strong>' +
                          handleAction_10(string_67) +
                          '</strong><small>' +
                          (includes_68 ? '已绑定 · 可见当前状态' : '未绑定') +
                          '</small></span></span><span class="cycle-char-switch" aria-hidden="true"></span></button>'
                      );
                  })
                  .join('')
            : '<div class="cycle-empty">暂无可绑定的 Char。</div>';
    }
    function handleAction_18() {
        handleAction_15();
        handleAction_16();
        handleAction_17();
    }
    function handleAction_19(value_69) {
        if (!['overview', 'calendar', 'sharing'].includes(value_69)) return;
        const activeElement_70 = document.activeElement;
        if (
            activeElement_70?.closest?.('[data-cycle-page]')?.dataset.cyclePage !== value_69 &&
            options.view?.contains(activeElement_70)
        )
            activeElement_70.blur?.();
        text = value_69;
        document.querySelectorAll('[data-cycle-page]').forEach((element) => {
            const value_71 = element.dataset.cyclePage === value_69;
            element.hidden = !value_71;
            element.classList.toggle('active', value_71);
        });
        document.querySelectorAll('[data-cycle-tab]').forEach((element_72) => {
            const value_73 = element_72.dataset.cycleTab === value_69;
            element_72.classList.toggle('active', value_73);
            element_72.setAttribute('aria-selected', String(value_73));
        });
    }
    function handleAction_20(value_74, value_75) {
        options.editor
            .querySelectorAll('[data-cycle-choice="' + value_74 + '"]')
            .forEach((element_76) => {
                const includes_77 = value_75.includes(element_76.dataset.cycleValue);
                element_76.classList.toggle('selected', includes_77);
                element_76.setAttribute('aria-pressed', String(includes_77));
            });
    }
    function handleAction_21(value_78) {
        return [
            ...options.editor.querySelectorAll('[data-cycle-choice="' + value_78 + '"].selected'),
        ].map((value_79) => value_79.dataset.cycleValue);
    }
    function handleAction_22(value_80) {
        const result = defaultState.periods.find(
                (value_83) =>
                    cycleData_2.parseDateKey(value_83.startDate) >
                    cycleData_2.parseDateKey(value_80.startDate),
            ),
            dateKey_81 = cycleData_2.parseDateKey(value_80.days.at(-1)?.date || value_80.startDate),
            dateKeyFromOrdinal_82 = cycleData_2.dateKeyFromOrdinal(dateKey_81 + 1);
        return (!result || dateKeyFromOrdinal_82 < result.startDate) &&
            dateKeyFromOrdinal_82 <= cycleData_2.localTodayKey()
            ? dateKeyFromOrdinal_82
            : value_80.days.at(-1)?.date || value_80.startDate;
    }
    function handleAction_23(
        value_84 = 'new',
        value_85 = '',
        value_86 = cycleData_2.localTodayKey(),
    ) {
        const value_87 = defaultState.periods.find((value_89) => value_89.id === value_85) || null,
            value_88 =
                value_84 === 'edit'
                    ? value_87?.days.find((value_90) => value_90.date === value_86)
                    : null;
        text_8 = value_84;
        text_6 = value_87?.id || '';
        text_7 = value_88?.date || '';
        options.editorTitle.textContent =
            value_84 === 'new' ? '开始新经期' : value_84 === 'edit' ? '编辑这一天' : '补记一天';
        options.logDate.value = value_88?.date || value_86;
        options.logDate.max = cycleData_2.localTodayKey();
        handleAction_20('bleeding', value_88?.bleeding ? [value_88.bleeding] : []);
        handleAction_20('mood', value_88?.moods || []);
        handleAction_20('pain', value_88?.pain ? [value_88.pain] : []);
        options.deleteRecord.hidden = value_84 !== 'edit';
        options.editorHint.textContent =
            value_84 === 'new'
                ? '这一天会作为新经期的第一天。以后可按天补记，无需填写结束日期。'
                : '属于 ' + (value_87?.startDate || '') + ' 开始的经期。';
        options.editor.hidden = false;
        options.logDate.focus();
    }
    function handleAction_24() {
        if (options.editor.contains(document.activeElement)) document.activeElement.blur?.();
        options.editor.hidden = true;
        text_6 = '';
        text_7 = '';
    }
    function handleAction_25(value_91) {
        const dateKey_92 = cycleData_2.parseDateKey(value_91),
            dateKey_93 = cycleData_2.parseDateKey(cycleData_2.localTodayKey());
        if (dateKey_92 === null || dateKey_92 > dateKey_93) return '请输入有效的实际日期';
        const periods_94 = defaultState.periods,
            result_95 = periods_94.find((value_99) => value_99.id === text_6);
        if (text_8 === 'new') {
            if (periods_94.some((value_100) => value_100.startDate === value_91))
                return '这一天已经是一次经期的开始';
            if (
                periods_94.some(
                    (value_101) =>
                        cycleData_2.parseDateKey(value_101.startDate) < dateKey_92 &&
                        cycleData_2.parseDateKey(value_101.days.at(-1)?.date) >= dateKey_92,
                )
            )
                return '这一天已有经期记录，请编辑或补记原经期';
            return '';
        }
        if (!result_95) return '请先开始新经期';
        const result_96 = periods_94.find(
            (value_102) =>
                cycleData_2.parseDateKey(value_102.startDate) >
                cycleData_2.parseDateKey(result_95.startDate),
        );
        if (result_96 && dateKey_92 >= cycleData_2.parseDateKey(result_96.startDate))
            return '日期不能与下一次经期重叠';
        const result_97 = [...periods_94]
            .reverse()
            .find(
                (value_103) =>
                    cycleData_2.parseDateKey(value_103.startDate) <
                    cycleData_2.parseDateKey(result_95.startDate),
            );
        if (result_97 && dateKey_92 <= cycleData_2.parseDateKey(result_97.days.at(-1)?.date))
            return '日期不能与上一次经期重叠';
        const value_98 = text_8 === 'edit' && text_7 === result_95.startDate;
        if (!value_98 && dateKey_92 < cycleData_2.parseDateKey(result_95.startDate))
            return '补记日期不能早于本次经期第一天';
        if (
            value_98 &&
            result_95.days.some(
                (value_104) => value_104.date !== text_7 && value_104.date < value_91,
            )
        )
            return '第一天不能晚于已记录的其他日期';
        if (
            result_95.days.some(
                (value_105) => value_105.date === value_91 && value_105.date !== text_7,
            )
        )
            return '这一天已经记录过了';
        return '';
    }
    async function handleAction_26(event) {
        event.preventDefault();
        const startDate_2 = options.logDate.value,
            handleAction_25_107 = handleAction_25(startDate_2);
        if (handleAction_25_107) {
            handleAction_12(handleAction_25_107);
            return;
        }
        const options_108 = {
                date: startDate_2,
                bleeding: handleAction_21('bleeding')[0] || '',
                moods: handleAction_21('mood'),
                pain: handleAction_21('pain')[0] || '',
            },
            periods_2 = defaultState.periods.map((value_110) => ({
                ...value_110,
                days: [...value_110.days],
            }));
        if (text_8 === 'new')
            periods_2.push({
                id:
                    window.crypto?.randomUUID?.() ||
                    'cycle-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
                startDate: startDate_2,
                days: [options_108],
            });
        else {
            const result_111 = periods_2.find((value_112) => value_112.id === text_6);
            if (text_8 === 'edit')
                result_111.days = result_111.days.filter((value_113) => value_113.date !== text_7);
            if (text_7 === result_111.startDate) result_111.startDate = startDate_2;
            result_111.days.push(options_108);
            result_111.days.sort((value_114, value_115) =>
                value_114.date.localeCompare(value_115.date),
            );
        }
        (await handleAction_14({
            ...defaultState,
            periods: periods_2,
        })) && (handleAction_24(), handleAction_12('每日记录已保存'));
    }
    async function handleAction_27() {
        if (!text_6 || !text_7 || !window.confirm('删除这一天的记录？')) return;
        const periods_3 = defaultState.periods
            .map((value_117) => ({
                ...value_117,
                days: value_117.days.filter((value_118) => value_118.date !== text_7),
            }))
            .filter((value_119) => value_119.days.length)
            .map((value_120) => ({
                ...value_120,
                startDate: value_120.days[0].date,
            }));
        (await handleAction_14({
            ...defaultState,
            periods: periods_3,
        })) && (handleAction_24(), handleAction_12('这一天的记录已删除'));
    }
    async function handleAction_28(value_121) {
        if (!window.confirm('删除这次经期及全部每日记录？')) return;
        if (
            await handleAction_14({
                ...defaultState,
                periods: defaultState.periods.filter((value_122) => value_122.id !== value_121),
            })
        )
            handleAction_12('这次经期已删除');
    }
    async function handleAction_29(event_123) {
        event_123.preventDefault();
        const typicalCycleDays_2 = Number(options.typicalCycle.value),
            typicalPeriodDays_2 = Number(options.typicalPeriod.value);
        if (
            !Number.isInteger(typicalCycleDays_2) ||
            typicalCycleDays_2 < 15 ||
            typicalCycleDays_2 > 90 ||
            !Number.isInteger(typicalPeriodDays_2) ||
            typicalPeriodDays_2 < 1 ||
            typicalPeriodDays_2 > 30
        ) {
            handleAction_12('请填写有效天数');
            return;
        }
        if (
            await handleAction_14({
                ...defaultState,
                typicalCycleDays: typicalCycleDays_2,
                typicalPeriodDays: typicalPeriodDays_2,
            })
        )
            handleAction_12('常用周期已更新');
    }
    async function handleAction_30(value_125) {
        const result_126 = (window.imData?.friends || []).find(
            (value_128) => value_128?.type === 'char' && String(value_128.id) === value_125,
        );
        if (!result_126) return;
        const boundCharIds_2 = defaultState.boundCharIds.includes(value_125)
            ? defaultState.boundCharIds.filter((value_129) => value_129 !== value_125)
            : [...defaultState.boundCharIds, value_125];
        if (
            await handleAction_14({
                ...defaultState,
                boundCharIds: boundCharIds_2,
            })
        )
            handleAction_12(boundCharIds_2.includes(value_125) ? '已绑定 Char' : '已解除绑定');
    }
    async function open_2() {
        options.view.classList.add('active');
        options.view.inert = false;
        options.view.setAttribute('aria-hidden', 'false');
        await handleAction_13();
        handleAction_19('overview');
        handleAction_18();
    }
    function close_2() {
        handleAction_24();
        const activeElement_130 = document.activeElement;
        if (activeElement_130 && options.view.contains(activeElement_130))
            activeElement_130.blur?.();
        options.view.classList.remove('active');
        options.view.inert = true;
        options.view.setAttribute('aria-hidden', 'true');
        document.getElementById('app-cycle-btn')?.focus?.({
            preventScroll: true,
        });
    }
    function handleDOMContentLoaded() {
        Object.assign(options, {
            view: handleAction_9('view'),
            statusCard: handleAction_9('status-card'),
            statsGrid: handleAction_9('stats-grid'),
            nextCard: handleAction_9('next-card'),
            typicalCycle: handleAction_9('typical-cycle'),
            typicalPeriod: handleAction_9('typical-period'),
            monthLabel: handleAction_9('month-label'),
            calendarGrid: handleAction_9('calendar-grid'),
            recordCount: handleAction_9('record-count'),
            recordList: handleAction_9('record-list'),
            addDay: handleAction_9('add-day'),
            charList: handleAction_9('char-list'),
            editor: handleAction_9('editor'),
            editorTitle: handleAction_9('editor-title'),
            logDate: handleAction_9('log-date'),
            editorHint: handleAction_9('editor-hint'),
            deleteRecord: handleAction_9('delete-record'),
        });
        if (!options.view) return;
        window.mobileInputCompat?.registerFocusScope?.({
            selector: '#cycle-view.active',
            priority: 30,
            preferFocusScope: true,
            resolveScrollContainer: (value_131) =>
                value_131.closest('.cycle-editor-form, .cycle-page-scroll'),
            scrollBehavior: 'focus',
        });
        handleAction_9('back-btn')?.addEventListener('click', close_2);
        document
            .querySelectorAll('[data-cycle-tab]')
            .forEach((value_132) =>
                value_132.addEventListener('click', () =>
                    handleAction_19(value_132.dataset.cycleTab),
                ),
            );
        handleAction_9('prev-month')?.addEventListener('click', () => {
            value_5 = new Date(value_5.getFullYear(), value_5.getMonth() - 1, 1);
            handleAction_16();
        });
        handleAction_9('next-month')?.addEventListener('click', () => {
            value_5 = new Date(value_5.getFullYear(), value_5.getMonth() + 1, 1);
            handleAction_16();
        });
        handleAction_9('add-record')?.addEventListener('click', () => handleAction_23('new'));
        options.addDay.addEventListener('click', () => {
            const at_133 = defaultState.periods.at(-1);
            if (at_133) {
                const localTodayKey_134 = cycleData_2.localTodayKey();
                handleAction_23(
                    at_133.days.some((value_135) => value_135.date === localTodayKey_134)
                        ? 'edit'
                        : 'day',
                    at_133.id,
                    localTodayKey_134,
                );
            }
        });
        options.calendarGrid.addEventListener('click', (event_136) => {
            const cycleDate_137 = event_136.target.closest('[data-cycle-date]')?.dataset.cycleDate;
            if (!cycleDate_137) return;
            const dateKey_138 = cycleData_2.parseDateKey(cycleDate_137),
                dateKey_139 = cycleData_2.parseDateKey(cycleData_2.localTodayKey());
            if (dateKey_138 > dateKey_139) {
                handleAction_12('预计日期须等实际来潮后再记录');
                return;
            }
            const result_140 = [...defaultState.periods]
                    .reverse()
                    .find(
                        (value_142) => cycleData_2.parseDateKey(value_142.startDate) <= dateKey_138,
                    ),
                result_141 = result_140?.days.find((value_143) => value_143.date === cycleDate_137);
            if (result_141) handleAction_23('edit', result_140.id, cycleDate_137);
            else {
                if (
                    result_140 &&
                    dateKey_138 - cycleData_2.parseDateKey(result_140.startDate) <= 29
                )
                    handleAction_23('day', result_140.id, cycleDate_137);
                else handleAction_23('new', '', cycleDate_137);
            }
        });
        options.recordList.addEventListener('click', (event_144) => {
            const closest_145 = event_144.target.closest('[data-cycle-delete-period]');
            if (closest_145) {
                void handleAction_28(closest_145.dataset.cycleDeletePeriod);
                return;
            }
            const closest_146 = event_144.target.closest('[data-cycle-add-day]');
            if (closest_146) {
                const result_148 = defaultState.periods.find(
                    (value_149) => value_149.id === closest_146.dataset.cycleAddDay,
                );
                if (result_148) handleAction_23('day', result_148.id, handleAction_22(result_148));
                return;
            }
            const closest_147 = event_144.target.closest('[data-cycle-log-date]');
            if (closest_147)
                handleAction_23(
                    'edit',
                    closest_147.dataset.cycleRecordId,
                    closest_147.dataset.cycleLogDate,
                );
        });
        options.charList.addEventListener('click', (event_150) => {
            const cycleCharId_151 =
                event_150.target.closest('[data-cycle-char-id]')?.dataset.cycleCharId;
            if (cycleCharId_151) void handleAction_30(cycleCharId_151);
        });
        handleAction_9('record-form')?.addEventListener(
            'submit',
            (value_152) => void handleAction_26(value_152),
        );
        handleAction_9('settings-form')?.addEventListener(
            'submit',
            (value_153) => void handleAction_29(value_153),
        );
        handleAction_9('editor-close')?.addEventListener('click', handleAction_24);
        options.editor.addEventListener('click', (event_154) => {
            if (event_154.target === options.editor) handleAction_24();
        });
        options.deleteRecord.addEventListener('click', () => void handleAction_27());
        options.editor.querySelectorAll('[data-cycle-choice]').forEach((value_155) =>
            value_155.addEventListener('click', () => {
                const cycleChoice_156 = value_155.dataset.cycleChoice,
                    handleAction_21_157 = handleAction_21(cycleChoice_156);
                if (cycleChoice_156 === 'mood')
                    handleAction_20(
                        cycleChoice_156,
                        handleAction_21_157.includes(value_155.dataset.cycleValue)
                            ? handleAction_21_157.filter(
                                  (value_158) => value_158 !== value_155.dataset.cycleValue,
                              )
                            : [...handleAction_21_157, value_155.dataset.cycleValue],
                    );
                else
                    handleAction_20(
                        cycleChoice_156,
                        handleAction_21_157.includes(value_155.dataset.cycleValue)
                            ? []
                            : [value_155.dataset.cycleValue],
                    );
            }),
        );
        [handleAction_9('record-form'), handleAction_9('settings-form')].forEach((value_159) =>
            value_159?.addEventListener('keydown', (event_160) => {
                if (
                    event_160.key !== 'Enter' ||
                    event_160.isComposing ||
                    event_160.keyCode === 229 ||
                    event_160.target?.tagName !== 'INPUT'
                )
                    return;
                event_160.preventDefault();
                if (
                    value_159.id === 'cycle-settings-form' &&
                    event_160.target === options.typicalCycle
                )
                    options.typicalPeriod.focus();
                else event_160.target.blur();
            }),
        );
        document.addEventListener('keydown', (value_161) => {
            if (
                value_161.key === 'Escape' &&
                !options.editor.hidden &&
                options.view.classList.contains('active')
            )
                handleAction_24();
        });
        window.addEventListener?.('u2:friend-removed', () => {
            if (options.view.classList.contains('active')) handleAction_17();
        });
    }
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', handleDOMContentLoaded, {
            once: true,
        });
    else handleDOMContentLoaded();
    window.cycleApp = {
        open: open_2,
        close: close_2,
    };
})();
