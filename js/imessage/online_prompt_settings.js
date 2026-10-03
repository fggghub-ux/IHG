(
    window.u2OnStorageReady ||
    ((handleDOMContentLoaded) =>
        document.addEventListener('DOMContentLoaded', handleDOMContentLoaded))
)(() => {
    'use strict';

    const onlinePrompts_3 = window.imApp.onlinePrompts,
        chatOnlinePromptSheetElement = document.getElementById('chat-online-prompt-sheet'),
        chatOnlinePromptSettingsBtnElement = document.getElementById(
            'chat-online-prompt-settings-btn',
        );
    if (!chatOnlinePromptSheetElement || !onlinePrompts_3) return;
    const onlinePromptPanelElement =
            chatOnlinePromptSheetElement.querySelector('.online-prompt-panel'),
        onlinePromptBodyElement = chatOnlinePromptSheetElement.querySelector('.online-prompt-body'),
        onlinePromptSelectElement =
            chatOnlinePromptSheetElement.querySelector('.online-prompt-select'),
        onlinePromptDecisionElement =
            chatOnlinePromptSheetElement.querySelector('.online-prompt-decision'),
        onlinePromptNoticeElement =
            chatOnlinePromptSheetElement.querySelector('.online-prompt-notice');
    if (
        !onlinePromptPanelElement ||
        !onlinePromptBodyElement ||
        !onlinePromptSelectElement ||
        !onlinePromptDecisionElement ||
        !onlinePromptNoticeElement
    )
        return;
    let value_4 = null,
        value_5 = null,
        text = '',
        value_3 = '',
        text_7 = '',
        inert_2 = false,
        value_9 = null,
        value_10 = null,
        value_11 = null;
    const value_12 = () => onlinePrompts_3.normalizePresets(window.imData.onlinePromptPresets),
        value_13 = () => value_5 && JSON.stringify(value_5) !== text;
    window.mobileInputCompat?.registerFocusScope &&
        window.mobileInputCompat.registerFocusScope({
            selector: '#chat-online-prompt-sheet',
            priority: 30,
            preferFocusScope: true,
            resolveScrollContainer: (value_42, element) =>
                element.querySelector('.online-prompt-body'),
            scrollBehavior: 'focus',
            viewportClassName: 'u2-android-online-prompt-viewport-sized',
            viewportHeightCssVariable: '--u2-android-online-prompt-viewport-height',
            viewportTopCssVariable: '--u2-android-online-prompt-viewport-top',
        });
    function handleAction_14(value_43, className_2, textContent_2) {
        const element_46 = document.createElement(value_43);
        if (className_2) element_46.className = className_2;
        if (textContent_2 != null) element_46.textContent = textContent_2;
        return element_46;
    }
    function handleAction_15(value_47) {
        const handleAction_14_48 = handleAction_14('i', value_47);
        return (handleAction_14_48.setAttribute('aria-hidden', 'true'), handleAction_14_48);
    }
    function handleAction_16(value_49, handleClick, value_51 = '') {
        const handleAction_14_52 = handleAction_14('button', value_51, value_49);
        handleAction_14_52.type = 'button';
        if (typeof handleClick === 'function')
            handleAction_14_52.addEventListener('click', handleClick);
        return handleAction_14_52;
    }
    function handleAction_17(value_53, title_2, value_55, value_56 = '') {
        const handleAction_16_57 = handleAction_16('', value_55, value_56);
        return (
            handleAction_16_57.setAttribute('aria-label', title_2),
            (handleAction_16_57.title = title_2),
            handleAction_16_57.append(handleAction_15(value_53)),
            handleAction_16_57
        );
    }
    function handleAction_18(textContent_3 = '') {
        onlinePromptNoticeElement.textContent = textContent_3;
    }
    function refreshOnlinePromptSettingsLabel_2(
        value_59 = window.imApp.getFriendById(value_4) || window.imData.currentSettingsFriend,
    ) {
        const elementById = document.getElementById(
            value_59?.type === 'group'
                ? 'group-online-prompt-settings-label'
                : 'chat-online-prompt-settings-label',
        );
        if (elementById)
            elementById.textContent = onlinePrompts_3.resolve(value_59)?.name || '内置预设';
    }
    window.imApp.refreshOnlinePromptSettingsLabel = refreshOnlinePromptSettingsLabel_2;
    function handleAction_20() {
        onlinePromptSelectElement.replaceChildren();
        onlinePromptSelectElement.append(new Option('内置预设', ''));
        value_12().forEach((value_60) =>
            onlinePromptSelectElement.append(new Option(value_60.name, value_60.id)),
        );
        value_5 &&
            !value_12().some((value_61) => value_61.id === value_5.id) &&
            onlinePromptSelectElement.append(
                new Option(value_5.name || '新预设（未保存）', value_5.id),
            );
        onlinePromptSelectElement.value = value_3;
    }
    function handleAction_21() {
        onlinePromptBodyElement
            .querySelectorAll(
                '.online-prompt-entry.is-drop-before, .online-prompt-entry.is-drop-after',
            )
            .forEach((element_62) => {
                element_62.classList.remove('is-drop-before', 'is-drop-after');
            });
    }
    function handleAction_22(value_63) {
        return (
            [...onlinePromptBodyElement.querySelectorAll('.online-prompt-entry')].find(
                (value_64) => value_64.dataset.promptItemId === String(value_63),
            ) || null
        );
    }
    function handleAction_23() {
        if (!value_5) return [];
        return (
            (value_5.order = onlinePrompts_3.normalizeOrder(value_5.order, value_5.entries)),
            onlinePrompts_3.getOrderedItems(value_5)
        );
    }
    function handleAction_24(value_65, value_66) {
        if (!value_5 || !Array.isArray(value_5.order)) return false;
        const value_67 = value_5.order.length - 1;
        if (
            value_65 < 0 ||
            value_65 > value_67 ||
            value_66 < 0 ||
            value_66 > value_67 ||
            value_65 === value_66
        )
            return false;
        const [splice_68] = value_5.order.splice(value_65, 1);
        value_5.order.splice(value_66, 0, splice_68);
        const result = onlinePrompts_3
            .getOrderedItems(value_5)
            .find((value_69) => value_69.token === splice_68);
        if (result?.kind === 'entry') text_7 = result.id;
        return (
            handleAction_34(),
            handleAction_22(splice_68)?.querySelector('.online-prompt-drag-handle')?.focus({
                preventScroll: true,
            }),
            true
        );
    }
    function handleAction_25(value_70 = false) {
        const value_71 = value_11;
        if (!value_71) return;
        value_11 = null;
        document.removeEventListener('pointermove', handlePointermove);
        document.removeEventListener('pointerup', handlePointerup);
        document.removeEventListener('pointercancel', handlePointercancel);
        value_71.card?.classList.remove('is-dragging');
        value_71.handle?.removeAttribute('aria-grabbed');
        handleAction_21();
        if (!value_70 || !value_5 || value_71.insertionIndex == null) return;
        const indexOf_72 = value_5.order.indexOf(value_71.itemToken);
        if (indexOf_72 < 0) return;
        let insertionIndex_73 = value_71.insertionIndex;
        if (indexOf_72 < insertionIndex_73) insertionIndex_73 -= 1;
        if (handleAction_24(indexOf_72, insertionIndex_73))
            handleAction_18('提示词顺序已调整，保存后生效');
    }
    function handleAction_26(value_74) {
        const boundingClientRect = onlinePromptBodyElement.getBoundingClientRect(),
            count = 56;
        if (value_74 < boundingClientRect.top + count)
            onlinePromptBodyElement.scrollTop -= Math.max(
                8,
                Math.ceil((boundingClientRect.top + count - value_74) / 5),
            );
        else
            value_74 > boundingClientRect.bottom - count &&
                (onlinePromptBodyElement.scrollTop += Math.max(
                    8,
                    Math.ceil((value_74 - (boundingClientRect.bottom - count)) / 5),
                ));
    }
    function handleAction_27(value_75) {
        if (!value_11) return;
        const filter_76 = [
            ...onlinePromptBodyElement.querySelectorAll('.online-prompt-entry'),
        ].filter((value_79) => value_79.dataset.promptItemId !== value_11.itemToken);
        if (!filter_76.length) {
            value_11.insertionIndex = null;
            handleAction_21();
            return;
        }
        let value_77 = filter_76[filter_76.length - 1],
            enabled_78 = false;
        for (const value_80 of filter_76) {
            const boundingClientRect_81 = value_80.getBoundingClientRect();
            if (value_75 <= boundingClientRect_81.top + boundingClientRect_81.height / 2) {
                value_77 = value_80;
                enabled_78 = true;
                break;
            }
            if (value_75 <= boundingClientRect_81.bottom) {
                value_77 = value_80;
                enabled_78 = false;
                break;
            }
        }
        const number = Number(value_77.dataset.itemIndex);
        value_11.insertionIndex = Number.isFinite(number) ? number + (enabled_78 ? 0 : 1) : null;
        handleAction_21();
        value_77.classList.add(enabled_78 ? 'is-drop-before' : 'is-drop-after');
    }
    function handlePointermove(event) {
        if (!value_11 || event.pointerId !== value_11.pointerId) return;
        event.preventDefault();
        handleAction_26(event.clientY);
        handleAction_27(event.clientY);
    }
    function handlePointerup(value_82) {
        if (!value_11 || value_82.pointerId !== value_11.pointerId) return;
        handleAction_25(true);
    }
    function handlePointercancel(value_83) {
        if (!value_11 || value_83.pointerId !== value_11.pointerId) return;
        handleAction_25(false);
    }
    function handleAction_31(event_84, value_85, card_2, handle_2) {
        if (
            inert_2 ||
            value_11 ||
            !value_5 ||
            (event_84.pointerType !== 'touch' && event_84.button !== 0)
        )
            return;
        event_84.preventDefault();
        value_11 = {
            itemToken: String(value_85.token),
            pointerId: event_84.pointerId,
            card: card_2,
            handle: handle_2,
            insertionIndex: null,
        };
        card_2.classList.add('is-dragging');
        handle_2.setAttribute('aria-grabbed', 'true');
        try {
            handle_2.setPointerCapture(event_84.pointerId);
        } catch (value_88) {}
        document.addEventListener('pointermove', handlePointermove, {
            passive: false,
        });
        document.addEventListener('pointerup', handlePointerup);
        document.addEventListener('pointercancel', handlePointercancel);
        handleAction_27(event_84.clientY);
    }
    function handleAction_32(message_89) {
        const replace_90 = String(message_89.content || '')
            .trim()
            .replace(/\s+/g, ' ');
        return replace_90 ? replace_90.slice(0, 92) : '尚未填写内容';
    }
    function handleAction_33(value_91, value_92, value_93) {
        const value_94 = value_91.kind === 'fixed',
            message_95 = value_94
                ? null
                : value_5.entries.find((value_109) => value_109.id === value_91.id),
            value_96 = !value_94 && text_7 === message_95?.id,
            handleAction_14_97 = handleAction_14('article', 'online-prompt-entry');
        handleAction_14_97.dataset.promptItemId = String(value_91.token);
        handleAction_14_97.dataset.itemIndex = String(value_92);
        handleAction_14_97.classList.toggle('is-expanded', value_96);
        handleAction_14_97.classList.toggle('is-fixed', value_94);
        const handleAction_14_98 = handleAction_14('div', 'online-prompt-entry-header'),
            handleAction_17_99 = handleAction_17(
                'fas fa-grip-vertical',
                '拖动第 ' + (value_92 + 1) + ' 项',
                null,
                'online-prompt-drag-handle',
            );
        handleAction_17_99.setAttribute('data-prompt-entry-drag-handle', '');
        handleAction_17_99.addEventListener('pointerdown', (value_110) =>
            handleAction_31(value_110, value_91, handleAction_14_97, handleAction_17_99),
        );
        const handleAction_14_100 = handleAction_14('div', 'online-prompt-entry-summary'),
            handleAction_14_101 = handleAction_14('div', 'online-prompt-entry-meta');
        handleAction_14_101.append(
            handleAction_14('span', 'online-prompt-entry-order', '#' + (value_92 + 1)),
        );
        if (value_94) {
            handleAction_14_100.append(
                handleAction_14('strong', 'online-prompt-fixed-title', value_91.name),
            );
            handleAction_14_101.append(
                handleAction_14('span', 'online-prompt-entry-preview', value_91.summary),
            );
            handleAction_14_100.append(handleAction_14_101);
            handleAction_14_98.append(
                handleAction_17_99,
                handleAction_14_100,
                handleAction_15('fas fa-lock'),
            );
        } else {
            const handleAction_14_111 = handleAction_14('input', 'online-prompt-entry-title');
            handleAction_14_111.type = 'text';
            handleAction_14_111.value = message_95.name;
            handleAction_14_111.maxLength = 80;
            handleAction_14_111.placeholder = '条目名称';
            handleAction_14_111.setAttribute('aria-label', '第 ' + (value_92 + 1) + ' 项名称');
            handleAction_14_111.addEventListener('input', () => {
                message_95.name = handleAction_14_111.value;
            });
            const handleAction_14_112 = handleAction_14(
                'span',
                'online-prompt-entry-status',
                message_95.enabled ? '启用' : '停用',
            );
            handleAction_14_112.classList.toggle('is-enabled', message_95.enabled);
            handleAction_14_101.append(
                handleAction_14('span', 'online-prompt-entry-preview', handleAction_32(message_95)),
                handleAction_14_112,
            );
            handleAction_14_100.append(handleAction_14_111, handleAction_14_101);
            const handleAction_17_113 = handleAction_17(
                'fas fa-chevron-down',
                value_96 ? '收起提示词' : '展开提示词',
                () => {
                    text_7 = value_96 ? '' : message_95.id;
                    handleAction_34();
                },
                'online-prompt-expand',
            );
            handleAction_17_113.setAttribute('aria-expanded', String(value_96));
            handleAction_14_98.append(handleAction_17_99, handleAction_14_100, handleAction_17_113);
        }
        const handleAction_14_102 = handleAction_14('div', 'online-prompt-entry-tools');
        if (!value_94) {
            const handleAction_14_114 = handleAction_14('label', 'online-prompt-toggle'),
                handleAction_14_115 = handleAction_14('input');
            handleAction_14_115.type = 'checkbox';
            handleAction_14_115.checked = message_95.enabled;
            handleAction_14_115.setAttribute('aria-label', '启用第 ' + (value_92 + 1) + ' 项');
            handleAction_14_115.addEventListener('change', () => {
                message_95.enabled = handleAction_14_115.checked;
                handleAction_34();
            });
            handleAction_14_114.append(handleAction_14_115, handleAction_14('span', '', '启用'));
            handleAction_14_102.append(handleAction_14_114);
        }
        const handleAction_14_103 = handleAction_14('div', 'online-prompt-move-actions'),
            handleAction_17_104 = handleAction_17(
                'fas fa-arrow-up',
                '上移第 ' + (value_92 + 1) + ' 项',
                () => handleAction_24(value_92, value_92 - 1),
                'online-prompt-icon-action',
            ),
            handleAction_17_105 = handleAction_17(
                'fas fa-arrow-down',
                '下移第 ' + (value_92 + 1) + ' 项',
                () => handleAction_24(value_92, value_92 + 1),
                'online-prompt-icon-action',
            );
        handleAction_17_104.disabled = value_92 === 0;
        handleAction_17_105.disabled = value_92 === value_93.length - 1;
        handleAction_14_103.append(handleAction_17_104, handleAction_17_105);
        handleAction_14_102.append(handleAction_14_103);
        if (value_94)
            return (
                handleAction_14_97.append(handleAction_14_98, handleAction_14_102),
                handleAction_14_97
            );
        const handleAction_17_106 = handleAction_17(
            'fas fa-trash',
            '删除第 ' + (value_92 + 1) + ' 项',
            () => {
                if (text_7 === message_95.id) text_7 = '';
                value_5.entries = value_5.entries.filter(
                    (value_116) => value_116.id !== message_95.id,
                );
                value_5.order = value_5.order.filter((value_117) => value_117 !== value_91.token);
                handleAction_34();
            },
            'online-prompt-icon-action danger',
        );
        handleAction_14_102.append(handleAction_17_106);
        const handleAction_14_107 = handleAction_14('div', 'online-prompt-entry-content');
        handleAction_14_107.setAttribute('aria-hidden', String(!value_96));
        const handleAction_14_108 = handleAction_14('textarea');
        return (
            (handleAction_14_108.value = message_95.content),
            (handleAction_14_108.placeholder = '输入提示词内容'),
            handleAction_14_108.setAttribute('aria-label', '第 ' + (value_92 + 1) + ' 项内容'),
            handleAction_14_108.addEventListener('input', () => {
                message_95.content = handleAction_14_108.value;
            }),
            handleAction_14_107.append(handleAction_14_108),
            handleAction_14_97.append(handleAction_14_98, handleAction_14_102, handleAction_14_107),
            handleAction_14_97
        );
    }
    function handleAction_34() {
        handleAction_25(false);
        handleAction_20();
        onlinePromptBodyElement.replaceChildren();
        for (const value_124 of ['save', 'delete']) {
            chatOnlinePromptSheetElement.querySelector(
                '[data-prompt-action="' + value_124 + '"]',
            ).disabled = !value_5;
        }
        if (!value_5) {
            onlinePromptBodyElement.append(
                handleAction_14(
                    'div',
                    'online-prompt-builtin',
                    '当前使用内置预设。系统规则会照常生效，但不开放查看或编辑。',
                ),
            );
            return;
        }
        const handleAction_14_118 = handleAction_14('label', 'online-prompt-field', '预设名称'),
            handleAction_14_119 = handleAction_14('input');
        handleAction_14_119.type = 'text';
        handleAction_14_119.maxLength = 40;
        handleAction_14_119.value = value_5.name;
        handleAction_14_119.placeholder = '输入预设名称';
        handleAction_14_119.addEventListener('input', () => {
            value_5.name = handleAction_14_119.value;
        });
        handleAction_14_118.append(handleAction_14_119);
        onlinePromptBodyElement.append(handleAction_14_118);
        const handleAction_14_120 = handleAction_14('div', 'online-prompt-entries'),
            handleAction_23_121 = handleAction_23();
        handleAction_23_121.forEach((value_125, value_126) =>
            handleAction_14_120.append(handleAction_33(value_125, value_126, handleAction_23_121)),
        );
        const value_122 = () => {
                if (inert_2 || value_9 || !value_5) return;
                const options = {
                    id: onlinePrompts_3.createId(),
                    name: '',
                    content: '',
                    enabled: true,
                };
                value_5.entries.push(options);
                value_5.order = onlinePrompts_3.normalizeOrder(value_5.order, value_5.entries);
                text_7 = options.id;
                handleAction_34();
                const value_127 = () => {
                    const handleAction_22_128 = handleAction_22(
                        onlinePrompts_3.entryToken(options.id),
                    );
                    if (!handleAction_22_128) return;
                    const boundingClientRect_129 = onlinePromptBodyElement.getBoundingClientRect(),
                        boundingClientRect_130 = handleAction_22_128.getBoundingClientRect(),
                        value_131 =
                            onlinePromptBodyElement.scrollTop +
                            boundingClientRect_130.top -
                            boundingClientRect_129.top -
                            12;
                    onlinePromptBodyElement.scrollTo({
                        top: Math.max(0, value_131),
                        behavior: 'smooth',
                    });
                };
                (window.requestAnimationFrame || ((value_132) => setTimeout(value_132, 0)))(
                    value_127,
                );
            },
            handleAction_16_123 = handleAction_16('', value_122, 'online-prompt-add-entry');
        handleAction_16_123.append(
            handleAction_15('fas fa-plus'),
            document.createTextNode('添加提示词条目'),
        );
        handleAction_14_120.append(handleAction_16_123);
        onlinePromptBodyElement.append(handleAction_14_120);
    }
    function handleAction_35(value_133, items) {
        onlinePromptDecisionElement.replaceChildren(handleAction_14('p', '', value_133));
        const handleAction_14_134 = handleAction_14('div', 'online-prompt-decision-actions');
        onlinePromptDecisionElement.append(handleAction_14_134);
        onlinePromptDecisionElement.hidden = false;
        const activeElement_135 = document.activeElement;
        return (
            (onlinePromptBodyElement.inert = true),
            new Promise((value_136) => {
                value_9 = (value_137) => {
                    onlinePromptDecisionElement.hidden = true;
                    onlinePromptBodyElement.inert = inert_2;
                    value_9 = null;
                    if (activeElement_135?.isConnected)
                        activeElement_135.focus({
                            preventScroll: true,
                        });
                    value_136(value_137);
                };
                items.forEach(([value_138, value_139]) =>
                    handleAction_14_134.append(
                        handleAction_16(value_139, () => value_9?.(value_138)),
                    ),
                );
                handleAction_14_134.querySelector('button')?.focus({
                    preventScroll: true,
                });
            })
        );
    }
    async function handleAction_36() {
        if (!value_5) return;
        value_5 = await onlinePrompts_3.savePreset(value_5);
        text = JSON.stringify(value_5);
        value_3 = value_5.id;
        refreshOnlinePromptSettingsLabel_2();
        handleAction_34();
    }
    async function handleAction_37() {
        if (!value_13()) return true;
        const value_140 = await handleAction_35('当前预设有未保存修改。', [
            ['save', '保存'],
            ['discard', '放弃'],
            ['cancel', '取消'],
        ]);
        if (value_140 === 'cancel') return false;
        if (value_140 === 'save') await handleAction_36();
        return true;
    }
    async function handleAction_38(value_141) {
        if (inert_2 || value_9) return;
        inert_2 = true;
        onlinePromptBodyElement.inert = true;
        onlinePromptPanelElement.setAttribute('aria-busy', 'true');
        handleAction_18();
        const filter_142 = [
                ...onlinePromptPanelElement.querySelectorAll('button, input, textarea, select'),
            ].filter((value_144) => !onlinePromptDecisionElement.contains(value_144)),
            map_143 = filter_142.map((value_145) => value_145.disabled);
        filter_142.forEach((value_146) => {
            value_146.disabled = true;
        });
        try {
            await value_141();
        } catch (value_147) {
            handleAction_18(value_147.message || '保存失败，请重试');
            handleAction_20();
        } finally {
            filter_142.forEach((value_148, value_149) => {
                if (value_148.isConnected) value_148.disabled = map_143[value_149];
            });
            inert_2 = false;
            onlinePromptBodyElement.inert = false;
            onlinePromptPanelElement.removeAttribute('aria-busy');
            for (const value_150 of ['save', 'delete']) {
                chatOnlinePromptSheetElement.querySelector(
                    '[data-prompt-action="' + value_150 + '"]',
                ).disabled = !value_5;
            }
            chatOnlinePromptSheetElement.classList.contains('active') &&
                (!onlinePromptPanelElement.contains(document.activeElement) ||
                    onlinePromptDecisionElement.contains(document.activeElement)) &&
                onlinePromptPanelElement.focus({
                    preventScroll: true,
                });
        }
    }
    function handleAction_39(value_151) {
        handleAction_25(false);
        value_5 = value_12().find((value_152) => value_152.id === value_151) || null;
        value_3 = value_5?.id || '';
        text = value_5 ? JSON.stringify(value_5) : '';
        text_7 = '';
        handleAction_34();
    }
    async function handleClick_2() {
        if (inert_2 || value_9) return;
        if (!(await handleAction_37())) return;
        handleAction_25(false);
        window.closeView(chatOnlinePromptSheetElement);
        value_5 = null;
        text = '';
        text_7 = '';
        value_4 = null;
        value_10?.focus({
            preventScroll: true,
        });
    }
    async function openOnlinePromptSettings_2(value_153) {
        if (inert_2 || value_9 || !value_153) return;
        if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
        value_153 = window.imApp.getFriendById(value_153.id) || value_153;
        value_4 = value_153.id;
        value_10 = document.activeElement;
        if (value_10?.matches?.('input, textarea, select, [contenteditable="true"]'))
            value_10.blur();
        handleAction_18();
        handleAction_39(onlinePrompts_3.resolve(value_153)?.id || '');
        window.openView(chatOnlinePromptSheetElement);
        onlinePromptPanelElement.focus({
            preventScroll: true,
        });
    }
    window.imApp.openOnlinePromptSettings = openOnlinePromptSettings_2;
    chatOnlinePromptSettingsBtnElement &&
        (chatOnlinePromptSettingsBtnElement.addEventListener('keydown', (event_154) => {
            (event_154.key === 'Enter' || event_154.key === ' ') &&
                (event_154.preventDefault(), chatOnlinePromptSettingsBtnElement.click());
        }),
        chatOnlinePromptSettingsBtnElement.addEventListener('click', () =>
            openOnlinePromptSettings_2(window.imData.currentSettingsFriend),
        ));
    onlinePromptSelectElement.addEventListener('change', () => {
        const value_155 = onlinePromptSelectElement.value;
        onlinePromptSelectElement.value = value_3;
        handleAction_38(async () => {
            if (await handleAction_37()) handleAction_39(value_155);
        });
    });
    chatOnlinePromptSheetElement
        .querySelector('[data-prompt-action="close"]')
        .addEventListener('click', handleClick_2);
    chatOnlinePromptSheetElement
        .querySelector('[data-prompt-action="new"]')
        .addEventListener('click', () =>
            handleAction_38(async () => {
                if (!(await handleAction_37())) return;
                value_5 = {
                    id: onlinePrompts_3.createId(),
                    name: '',
                    entries: [],
                    order: onlinePrompts_3.defaultOrder([]),
                };
                value_3 = value_5.id;
                text = '';
                text_7 = '';
                handleAction_34();
                onlinePromptBodyElement.scrollTop = 0;
                onlinePromptBodyElement.querySelector('input')?.focus({
                    preventScroll: true,
                });
            }),
        );
    chatOnlinePromptSheetElement
        .querySelector('[data-prompt-action="save"]')
        .addEventListener('click', () =>
            handleAction_38(async () => {
                await handleAction_36();
                handleAction_18('预设已保存');
            }),
        );
    chatOnlinePromptSheetElement
        .querySelector('[data-prompt-action="apply"]')
        .addEventListener('click', () =>
            handleAction_38(async () => {
                if (value_5 && !onlinePrompts_3.enabledEntries(value_5).length)
                    throw new Error('至少添加一个启用且非空的提示词条目后才能应用');
                if (value_5) await handleAction_36();
                await onlinePrompts_3.applyPreset(value_4, value_5?.id || '');
                refreshOnlinePromptSettingsLabel_2();
                window.closeView(chatOnlinePromptSheetElement);
                value_10?.focus({
                    preventScroll: true,
                });
                value_5 = null;
                text_7 = '';
                window.showToast?.('提示词已应用');
            }),
        );
    chatOnlinePromptSheetElement
        .querySelector('[data-prompt-action="delete"]')
        .addEventListener('click', () =>
            handleAction_38(async () => {
                if (!value_5) return;
                const filter_156 = (window.imData.friends || []).filter(
                        (value_158) => value_158.onlinePromptPresetId === value_5.id,
                    ),
                    value_157 = await handleAction_35(
                        '删除“' +
                            (value_5.name || '未命名预设') +
                            '”？' +
                            (filter_156.length
                                ? '正在使用它的 ' + filter_156.length + ' 个聊天将恢复内置预设。'
                                : ''),
                        [
                            ['cancel', '取消'],
                            ['delete', '删除'],
                        ],
                    );
                if (value_157 !== 'delete') return;
                await onlinePrompts_3.deletePreset(value_5.id);
                handleAction_39('');
                refreshOnlinePromptSettingsLabel_2();
                handleAction_18('预设已删除');
            }),
        );
    chatOnlinePromptSheetElement.addEventListener('keydown', (event_159) => {
        if (event_159.key === 'Escape') {
            event_159.preventDefault();
            event_159.stopPropagation();
            if (value_9) value_9('cancel');
            else handleClick_2();
        }
        if (event_159.key !== 'Tab') return;
        const value_160 = onlinePromptDecisionElement.hidden
                ? onlinePromptPanelElement
                : onlinePromptDecisionElement,
            filter_161 = [
                ...value_160.querySelectorAll('button, input, textarea, select, summary'),
            ].filter(
                (value_164) =>
                    !value_164.disabled &&
                    value_164.type !== 'file' &&
                    !value_164.closest('[hidden]'),
            ),
            value_162 = filter_161[0],
            value_163 = filter_161[filter_161.length - 1];
        if (
            event_159.shiftKey &&
            (document.activeElement === value_162 ||
                document.activeElement === onlinePromptPanelElement)
        ) {
            event_159.preventDefault();
            value_163?.focus({
                preventScroll: true,
            });
        } else
            !event_159.shiftKey &&
                document.activeElement === value_163 &&
                (event_159.preventDefault(),
                value_162?.focus({
                    preventScroll: true,
                }));
    });
});
