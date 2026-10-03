(function () {
    'use strict';

    let activeTab_2 = 'servers',
        text_2 = '',
        text_3 = '',
        enabled_4 = false,
        value_5 = null;
    const options = {},
        options_6 = {
            stopped: ['尚未连接', 'stopped'],
            connecting: ['连接中', 'connecting'],
            ready: ['可用', 'ready'],
            'needs-auth': ['需要授权', 'needs-auth'],
            error: ['错误', 'error'],
            disabled: ['已停用', 'stopped'],
        };
    function handleAction_7() {
        [
            'view',
            'back-btn',
            'refresh-btn',
            'server-count',
            'list',
            'tool-count',
            'tools-empty',
            'tool-list',
            'add-btn',
            'servers-page',
            'tools-page',
            'modal',
            'modal-title',
            'modal-cancel',
            'modal-save',
            'modal-form',
            'name-input',
            'url-input',
            'url-help',
            'auth-input',
            'bearer-fields',
            'bearer-input',
            'header-fields',
            'header-name-input',
            'header-value-input',
            'approval-input',
            'policy-warning',
            'enabled-input',
            'test-btn',
            'form-status',
            'detail',
            'detail-close',
            'detail-edit',
            'detail-title',
            'detail-kicker',
            'detail-status',
            'detail-command',
            'detail-delete',
            'use-direct',
            'relay-confirm',
            'relay-accept',
            'relay-cancel',
        ].forEach((value_49) => {
            options[value_49.replace(/-/g, '_')] = document.getElementById('mcp-' + value_49);
        });
        options.tabs = Array.from(document.querySelectorAll('[data-mcp-tab]'));
        options.detailActions = Array.from(document.querySelectorAll('[data-mcp-action]'));
        options.shell = document.querySelector('#mcp-view .mcp-shell');
        options.tabPill = document.querySelector('.mcp-tab-pill');
    }
    function getServers_2() {
        return window.mcpIntegration?.getServers?.() || [];
    }
    function handleAction_9() {
        return window.mcpIntegration?.getLastCatalog?.() || [];
    }
    function handleAction_10(value_50) {
        return (
            window.mcpIntegration
                ?.getLastStatus?.()
                ?.servers?.find((value_51) => value_51.id === value_50) || null
        );
    }
    function handleAction_11(value_52) {
        return handleAction_9().filter((value_53) => value_53.serverId === value_52).length;
    }
    function handleAction_12(value_54) {
        if (typeof window.showToast === 'function') window.showToast(value_54);
        else console.warn('[MCP]', value_54);
    }
    function handleAction_13(value_55) {
        const element = document.createElement('label');
        element.className = 'mcp-switch';
        const element_56 = document.createElement('input');
        element_56.type = 'checkbox';
        element_56.checked = value_55.enabled;
        element_56.setAttribute(
            'aria-label',
            (value_55.enabled ? '停用' : '启用') + ' ' + value_55.name,
        );
        const element_57 = document.createElement('span');
        return (
            element.append(element_56, element_57),
            element.addEventListener('click', (event) => event.stopPropagation()),
            element_56.addEventListener('change', async () => {
                element_56.disabled = true;
                try {
                    await window.mcpIntegration.saveServer({
                        ...value_55,
                        enabled: element_56.checked,
                    });
                } catch (value_58) {
                    element_56.checked = !element_56.checked;
                    handleAction_12(value_58.message);
                } finally {
                    element_56.disabled = false;
                    handleAction_17();
                }
            }),
            element
        );
    }
    function handleAction_14() {
        const handleAction_8_59 = getServers_2();
        options.server_count.textContent = handleAction_8_59.length + ' 台服务器';
        options.list.replaceChildren();
        handleAction_8_59.forEach((value_60) => {
            const handleAction_10_61 = handleAction_10(value_60.id),
                value_62 = value_60.enabled ? handleAction_10_61?.state || 'stopped' : 'disabled',
                [value_63, value_64] = options_6[value_62] || options_6.error,
                element_65 = document.createElement('button');
            element_65.type = 'button';
            element_65.className = 'mcp-server-card';
            const element_66 = document.createElement('span');
            element_66.className = 'mcp-server-icon';
            element_66.innerHTML = '<i class="fas fa-cloud"></i>';
            const element_67 = document.createElement('span');
            element_67.className = 'mcp-server-copy';
            const element_68 = document.createElement('strong');
            element_68.textContent = value_60.name;
            const element_69 = document.createElement('span');
            element_69.textContent =
                (value_60.connectionMode === 'relay' ? 'U2 中转' : '浏览器直连') +
                ' · ' +
                handleAction_15(value_60.url);
            const element_70 = document.createElement('span');
            element_70.className = 'mcp-server-meta';
            const element_71 = document.createElement('i');
            element_71.className = 'mcp-mini-dot ' + value_64;
            element_70.append(
                element_71,
                document.createTextNode(
                    value_63 + ' · ' + handleAction_11(value_60.id) + ' 项工具',
                ),
            );
            element_67.append(element_68, element_69, element_70);
            const element_72 = document.createElement('span');
            element_72.className = 'mcp-server-trailing';
            element_72.append(handleAction_13(value_60));
            const element_73 = document.createElement('i');
            element_73.className = 'fas fa-chevron-right';
            element_72.append(element_73);
            element_65.append(element_66, element_67, element_72);
            element_65.addEventListener('click', () => openServer_2(value_60.id));
            options.list.append(element_65);
        });
    }
    function handleAction_15(value_74) {
        try {
            return new URL(value_74).host;
        } catch (value_75) {
            return '地址无效';
        }
    }
    function handleAction_16() {
        const handleAction_9_76 = handleAction_9();
        options.tool_count.textContent = handleAction_9_76.length + ' 项';
        options.tools_empty.hidden = handleAction_9_76.length > 0;
        options.tool_list.hidden = handleAction_9_76.length === 0;
        options.tool_list.replaceChildren();
        const items = new Map();
        handleAction_9_76.forEach((value_77) => {
            if (!items.has(value_77.serverId)) items.set(value_77.serverId, []);
            items.get(value_77.serverId).push(value_77);
        });
        items.forEach((items_78) => {
            const element_79 = document.createElement('section');
            element_79.className = 'mcp-tool-group';
            const element_80 = document.createElement('header'),
                element_81 = document.createElement('h2');
            element_81.textContent = items_78[0]?.serverName || 'MCP';
            const element_82 = document.createElement('span');
            element_82.textContent = items_78.length + ' 项';
            element_80.append(element_81, element_82);
            element_79.append(element_80);
            items_78.forEach((value_83) => {
                const element_84 = document.createElement('details');
                element_84.className = 'mcp-tool-card';
                const element_85 = document.createElement('summary'),
                    element_86 = document.createElement('i');
                element_86.className =
                    value_83.annotations?.readOnlyHint === true
                        ? 'fas fa-shield-halved'
                        : 'fas fa-wand-magic-sparkles';
                const element_87 = document.createElement('span'),
                    element_88 = document.createElement('strong');
                element_88.textContent = value_83.title || value_83.name;
                const element_89 = document.createElement('span');
                element_89.textContent = value_83.description || '没有工具描述';
                element_87.append(element_88, element_89);
                const element_90 = document.createElement('i');
                element_90.className = 'fas fa-chevron-down';
                element_85.append(element_86, element_87, element_90);
                const element_91 = document.createElement('div'),
                    element_92 = document.createElement('span'),
                    value_93 =
                        value_83.annotations?.readOnlyHint === true &&
                        value_83.annotations?.destructiveHint !== true;
                element_92.className = 'mcp-tool-badge ' + (value_93 ? 'safe' : 'confirm');
                element_92.textContent = value_93 ? '只读' : '调用前确认';
                const element_94 = document.createElement('pre');
                element_94.textContent = JSON.stringify(
                    value_83.inputSchema || {
                        type: 'object',
                    },
                    null,
                    2,
                );
                element_91.append(element_92, element_94);
                element_84.append(element_85, element_91);
                element_79.append(element_84);
            });
            options.tool_list.append(element_79);
        });
    }
    function handleAction_17() {
        handleAction_14();
        handleAction_16();
        if (text_3 && !options.detail.hidden) handleAction_44();
    }
    function handleAction_18(value_95) {
        activeTab_2 = value_95 === 'tools' ? 'tools' : 'servers';
        [options.servers_page, options.tools_page].forEach((element_96) => {
            const value_97 = element_96.dataset.mcpPage === activeTab_2;
            element_96.hidden = !value_97;
            element_96.classList.toggle('active', value_97);
            element_96.setAttribute('aria-hidden', String(!value_97));
        });
        options.tabs.forEach((value_98) =>
            value_98.setAttribute('aria-selected', String(value_98.dataset.mcpTab === activeTab_2)),
        );
        options.tabPill.dataset.activeTab = activeTab_2;
        options.add_btn.querySelector('i').className =
            activeTab_2 === 'tools' ? 'fas fa-rotate' : 'fas fa-plus';
        options.add_btn.setAttribute(
            'aria-label',
            activeTab_2 === 'tools' ? '刷新 MCP 工具' : '添加远程 MCP 服务器',
        );
    }
    function handleAction_19(value_99) {
        const value_100 = window.mcpIntegration?.getRelayAvailability?.() || {};
        if (!value_100.configured) return value_99.message + '；U2 中转尚未配置';
        if (!value_100.loggedIn) return value_99.message + '；登录后可选择 U2 中转';
        return value_99.message;
    }
    function handleAction_20(value_101 = false) {
        if (!value_5) return;
        const value_102 = value_5;
        value_5 = null;
        options.relay_confirm.hidden = true;
        value_102.obscured &&
            ((value_102.obscured.inert = value_102.wasInert),
            value_102.obscured.setAttribute('aria-hidden', value_102.wasAriaHidden));
        value_102.resolve(Boolean(value_101));
        requestAnimationFrame(() =>
            value_102.returnFocus?.focus?.({
                preventScroll: true,
            }),
        );
    }
    function handleAction_21() {
        const value_103 = window.mcpIntegration?.getRelayAvailability?.() || {};
        if (!value_103.configured || !value_103.loggedIn || !options.relay_confirm)
            return Promise.resolve(false);
        if (value_5) handleAction_20(false);
        const obscured_2 = !options.modal.hidden
            ? options.modal
            : !options.detail.hidden
              ? options.detail
              : options.shell;
        return new Promise((resolve_2) => {
            value_5 = {
                resolve: resolve_2,
                obscured: obscured_2,
                wasInert: Boolean(obscured_2?.inert),
                wasAriaHidden: obscured_2?.getAttribute?.('aria-hidden') || 'false',
                returnFocus: document.activeElement,
            };
            obscured_2 &&
                ((obscured_2.inert = true), obscured_2.setAttribute('aria-hidden', 'true'));
            options.relay_confirm.hidden = false;
            requestAnimationFrame(() =>
                options.relay_accept.focus({
                    preventScroll: true,
                }),
            );
        });
    }
    async function handleAction_22(value_106) {
        try {
            return await window.mcpIntegration.discoverTools(value_106, {
                refresh: true,
                strict: true,
            });
        } catch (value_107) {
            if (value_107?.code !== 'MCP_DIRECT_CONNECTION_FAILED') throw value_107;
            const value_108 = window.mcpIntegration?.getRelayAvailability?.() || {};
            if (!value_108.configured || !value_108.loggedIn) {
                const value_110 = new Error(handleAction_19(value_107));
                value_110.code = value_107.code;
                throw value_110;
            }
            const value_109 = await handleAction_21();
            if (!value_109) throw value_107;
            return (
                await window.mcpIntegration.setConnectionMode(value_106, 'relay'),
                window.mcpIntegration.discoverTools(value_106, {
                    refresh: true,
                    strict: true,
                })
            );
        }
    }
    async function refresh_2(value_111 = null) {
        if (enabled_4) return;
        enabled_4 = true;
        options.refresh_btn?.classList.add('spinning');
        try {
            if (value_111) await handleAction_22(value_111);
            else {
                const filter_112 = getServers_2().filter((value_113) => value_113.enabled);
                for (const value_114 of filter_112) await handleAction_22(value_114.id);
            }
        } catch (value_115) {
            handleAction_12(value_115.message || '无法直连 MCP 服务器，请检查地址和 CORS');
        } finally {
            enabled_4 = false;
            options.refresh_btn?.classList.remove('spinning');
            handleAction_17();
        }
    }
    function open_2() {
        options.view.classList.add('active');
        options.view.inert = false;
        options.view.setAttribute('aria-hidden', 'false');
        handleAction_18('servers');
        handleAction_17();
    }
    function close_2() {
        handleAction_20(false);
        handleModal_cancelClick();
        handleDetail_closeClick();
        window.mcpIntegration?.cancelActiveApproval?.();
        const activeElement_116 = document.activeElement;
        activeElement_116 &&
            options.view.contains(activeElement_116) &&
            (document.getElementById('app-mcp-btn')?.focus?.({
                preventScroll: true,
            }),
            options.view.contains(document.activeElement) &&
                typeof activeElement_116.blur === 'function' &&
                activeElement_116.blur());
        options.view.classList.remove('active');
        options.view.inert = true;
        options.view.setAttribute('aria-hidden', 'true');
    }
    function handleAction_26(inert_2) {
        options.shell.inert = inert_2;
        options.shell.setAttribute('aria-hidden', String(inert_2));
    }
    function handleAction_27(value_118, value_119 = false) {
        options.form_status.textContent = value_118 || '';
        options.form_status.classList.toggle('error', value_119);
    }
    function handleApproval_inputChange() {
        options.policy_warning.hidden = options.approval_input.value !== 'allow-all';
    }
    function handleAction_29() {
        return [
            options.name_input,
            options.url_input,
            options.bearer_input,
            options.header_name_input,
            options.header_value_input,
        ].filter((value_120) => value_120 && !value_120.disabled && !value_120.closest('[hidden]'));
    }
    function handleAction_30() {
        const handleAction_29_121 = handleAction_29();
        [
            options.name_input,
            options.url_input,
            options.bearer_input,
            options.header_name_input,
            options.header_value_input,
        ]
            .filter(Boolean)
            .forEach((value_122) => value_122.setAttribute('enterkeyhint', 'done'));
        handleAction_29_121
            .slice(0, -1)
            .forEach((value_123) => value_123.setAttribute('enterkeyhint', 'next'));
    }
    function handleAction_31(value_124) {
        if (typeof window.mobileInputCompat?.isSendEnter === 'function')
            return window.mobileInputCompat.isSendEnter(value_124);
        return (
            value_124?.key === 'Enter' &&
            !value_124.isComposing &&
            value_124.keyCode !== 229 &&
            !value_124.shiftKey &&
            !value_124.ctrlKey &&
            !value_124.metaKey &&
            !value_124.altKey
        );
    }
    function handleAction_32(value_125) {
        const activeElement_126 = document.activeElement;
        if (
            activeElement_126 &&
            value_125?.contains(activeElement_126) &&
            typeof activeElement_126.blur === 'function'
        )
            activeElement_126.blur();
    }
    function handleAction_33(value_127) {
        if (!value_127 || value_127.disabled) return;
        value_127.focus?.({
            preventScroll: true,
        });
        requestAnimationFrame(() => {
            if (!value_127.isConnected || !options.modal_form?.isConnected) return;
            const boundingClientRect = options.modal_form.getBoundingClientRect(),
                boundingClientRect_128 = value_127.getBoundingClientRect(),
                count = 16;
            if (boundingClientRect_128.top < boundingClientRect.top + count)
                options.modal_form.scrollTop +=
                    boundingClientRect_128.top - boundingClientRect.top - count;
            else {
                if (boundingClientRect_128.bottom > boundingClientRect.bottom - count)
                    options.modal_form.scrollTop +=
                        boundingClientRect_128.bottom - boundingClientRect.bottom + count;
            }
        });
    }
    function handleModal_formKeydown(event_129) {
        const value_130 =
                !!window.mobileInputCompat?.isAndroid || /Android/i.test(navigator.userAgent || ''),
            target_131 = event_129.target;
        if (
            !value_130 ||
            !target_131?.matches?.(
                'input[type="text"], input[type="url"], input[type="password"]',
            ) ||
            !handleAction_31(event_129)
        )
            return;
        event_129.preventDefault();
        const handleAction_29_132 = handleAction_29(),
            value_133 = handleAction_29_132[handleAction_29_132.indexOf(target_131) + 1];
        if (value_133) handleAction_33(value_133);
        else target_131.blur?.();
    }
    function handleAction_35() {
        window.mobileInputCompat?.registerFocusScope?.({
            selector: '#mcp-modal:not([hidden])',
            priority: 30,
            preferFocusScope: true,
            resolveScrollContainer: (value_134, element_135) =>
                element_135.querySelector('.mcp-modal-form'),
            scrollBehavior: 'focus',
            viewportClassName: 'u2-android-mcp-viewport-sized',
            viewportHeightCssVariable: '--u2-android-mcp-viewport-height',
            viewportTopCssVariable: '--u2-android-mcp-viewport-top',
        });
    }
    function handleAuth_inputChange() {
        options.bearer_fields.hidden = options.auth_input.value !== 'bearer';
        options.header_fields.hidden = options.auth_input.value !== 'header';
        handleAction_30();
    }
    function handleAction_37(value_136 = null) {
        text_2 = value_136?.id || '';
        options.modal_title.textContent = value_136 ? '编辑远程 MCP' : '添加远程 MCP';
        options.modal_form.reset();
        options.name_input.value = value_136?.name || '';
        options.url_input.value = value_136?.url || '';
        options.auth_input.value = value_136?.auth?.type || 'none';
        options.bearer_input.value =
            value_136?.auth?.type === 'bearer' ? value_136.auth.token || '' : '';
        options.header_name_input.value =
            value_136?.auth?.type === 'header' ? value_136.auth.name || '' : '';
        options.header_value_input.value =
            value_136?.auth?.type === 'header' ? value_136.auth.value || '' : '';
        options.approval_input.value = value_136?.approvalPolicy || 'read-only-auto';
        options.enabled_input.checked = value_136?.enabled !== false;
        handleApproval_inputChange();
        handleAuth_inputChange();
        handleAction_27('');
        handleAction_26(true);
        options.modal.hidden = false;
        requestAnimationFrame(() =>
            options.name_input.focus({
                preventScroll: true,
            }),
        );
    }
    function handleModal_cancelClick() {
        if (options.modal.hidden) return;
        handleAction_32(options.modal);
        options.modal.hidden = true;
        text_2 = '';
        handleAction_26(false);
    }
    function handleAction_39() {
        const result = getServers_2().find((value_139) => value_139.id === text_2);
        if (!options.modal_form.checkValidity()) return (options.modal_form.reportValidity(), null);
        const value_137 = options.auth_input.value,
            auth_2 =
                value_137 === 'bearer'
                    ? {
                          type: 'bearer',
                          token: options.bearer_input.value.trim(),
                      }
                    : value_137 === 'header'
                      ? {
                            type: 'header',
                            name: options.header_name_input.value.trim(),
                            value: options.header_value_input.value.trim(),
                        }
                      : {
                            type: 'none',
                        };
        return {
            ...(result || {}),
            id: result?.id || undefined,
            name: options.name_input.value.trim(),
            url: options.url_input.value.trim(),
            protocolMode: result?.protocolMode || 'auto',
            enabled: options.enabled_input.checked,
            approvalPolicy: options.approval_input.value,
            connectionMode: result?.connectionMode || 'direct',
            auth: auth_2,
        };
    }
    async function handleModal_saveClick() {
        const handleAction_39_140 = handleAction_39();
        if (!handleAction_39_140 || enabled_4) return;
        enabled_4 = true;
        try {
            await window.mcpIntegration.saveServer(handleAction_39_140);
            handleModal_cancelClick();
            handleAction_17();
        } catch (value_141) {
            handleAction_27(value_141.message || '保存失败', true);
        } finally {
            enabled_4 = false;
        }
    }
    async function handleTest_btnClick() {
        const handleAction_39_142 = handleAction_39();
        if (!handleAction_39_142 || enabled_4) return;
        enabled_4 = true;
        options.test_btn.disabled = true;
        handleAction_27('正在连接并发现工具…');
        try {
            const value_143 = await window.mcpIntegration.saveServer(handleAction_39_142);
            text_2 = value_143.id;
            const value_144 = await handleAction_22(value_143.id);
            handleAction_27('连接成功，发现 ' + value_144.length + ' 项工具');
            handleAction_17();
            handleAuth_inputChange();
        } catch (value_145) {
            handleAction_27(value_145.message || '测试失败', true);
        } finally {
            enabled_4 = false;
            options.test_btn.disabled = false;
        }
    }
    function openServer_2(value_146) {
        text_3 = value_146;
        handleAction_26(true);
        options.detail.hidden = false;
        handleAction_44();
        requestAnimationFrame(() =>
            options.detail_close.focus({
                preventScroll: true,
            }),
        );
    }
    function handleDetail_closeClick() {
        if (options.detail.hidden) return;
        options.detail.hidden = true;
        text_3 = '';
        handleAction_26(false);
    }
    function handleAction_44() {
        const result_147 = getServers_2().find((value_156) => value_156.id === text_3);
        if (!result_147) return handleDetail_closeClick();
        const handleAction_10_148 = handleAction_10(result_147.id),
            value_149 = result_147.enabled ? handleAction_10_148?.state || 'stopped' : 'disabled',
            [textContent_2, value_151] = options_6[value_149] || options_6.error;
        options.detail_title.textContent = result_147.name;
        options.detail_kicker.textContent = 'REMOTE HTTP MCP';
        options.detail_edit.hidden = false;
        options.detail_delete.hidden = false;
        options.use_direct.hidden = result_147.connectionMode !== 'relay';
        options.detail_status.replaceChildren();
        const element_152 = document.createElement('span');
        element_152.className = 'mcp-status-dot ' + value_151;
        const element_153 = document.createElement('div'),
            element_154 = document.createElement('strong');
        element_154.textContent = textContent_2;
        const element_155 = document.createElement('span');
        element_155.textContent =
            handleAction_10_148?.error ||
            handleAction_11(result_147.id) +
                ' 项工具 · ' +
                (result_147.approvalPolicy === 'allow-all'
                    ? '全部自动允许'
                    : result_147.approvalPolicy === 'ask-every-time'
                      ? '每次询问'
                      : '只读自动');
        element_153.append(element_154, element_155);
        options.detail_status.append(element_152, element_153);
        options.detail_command.textContent =
            '连接：' +
            (result_147.connectionMode === 'relay' ? 'U2 中转' : '浏览器直连') +
            `
Streamable HTTP
` +
            result_147.url +
            `
认证：` +
            (result_147.auth?.type || 'none');
    }
    async function handleAction_45(value_157) {
        const result_158 = getServers_2().find((value_159) => value_159.id === text_3);
        if (!result_158 || enabled_4) return;
        enabled_4 = true;
        try {
            if (value_157 === 'refresh') await handleAction_22(result_158.id);
            else {
                if (value_157 === 'disconnect')
                    await window.mcpIntegration.disconnect(result_158.id);
                else
                    value_157 === 'use-direct' &&
                        (await window.mcpIntegration.setConnectionMode(result_158.id, 'direct'),
                        handleAction_12('已改回浏览器直连'));
            }
        } catch (value_160) {
            handleAction_12(value_160.message || '操作失败');
        } finally {
            enabled_4 = false;
            handleAction_17();
        }
    }
    async function handleDetail_deleteClick() {
        const result_161 = getServers_2().find((value_162) => value_162.id === text_3);
        if (!result_161) return;
        if (!window.confirm('删除“' + result_161.name + '”？保存在当前设备的 token 也会被移除。'))
            return;
        try {
            await window.mcpIntegration.deleteServer(result_161.id);
            handleDetail_closeClick();
            handleAction_17();
        } catch (value_163) {
            handleAction_12(value_163.message || '删除失败');
        }
    }
    function handleAction_47() {
        options.back_btn.addEventListener('click', close_2);
        options.refresh_btn.addEventListener('click', () => refresh_2());
        options.tabs.forEach((value_164) =>
            value_164.addEventListener('click', () => handleAction_18(value_164.dataset.mcpTab)),
        );
        options.add_btn.addEventListener('click', () =>
            activeTab_2 === 'tools' ? refresh_2() : handleAction_37(),
        );
        options.modal_cancel.addEventListener('click', handleModal_cancelClick);
        options.modal_save.addEventListener('click', handleModal_saveClick);
        options.test_btn.addEventListener('click', handleTest_btnClick);
        options.approval_input.addEventListener('change', handleApproval_inputChange);
        options.auth_input.addEventListener('change', handleAuth_inputChange);
        options.detail_close.addEventListener('click', handleDetail_closeClick);
        options.detail_edit.addEventListener('click', () => {
            const result_165 = getServers_2().find((value_166) => value_166.id === text_3);
            handleDetail_closeClick();
            handleAction_37(result_165);
        });
        options.detail_delete.addEventListener('click', handleDetail_deleteClick);
        options.detailActions.forEach((value_167) =>
            value_167.addEventListener('click', () => handleAction_45(value_167.dataset.mcpAction)),
        );
        options.relay_accept.addEventListener('click', () => handleAction_20(true));
        options.relay_cancel.addEventListener('click', () => handleAction_20(false));
        options.modal_form.addEventListener('keydown', handleModal_formKeydown);
        window.addEventListener('mcp-state-updated', handleAction_17);
        window.addEventListener('mcp-catalog-updated', handleAction_17);
        window.addEventListener('mcp-servers-updated', handleAction_17);
    }
    function handleDOMContentLoaded() {
        handleAction_7();
        if (!options.view) return;
        handleAction_35();
        handleAction_47();
        handleAction_17();
        void window.mcpIntegration
            ?.ready?.()
            .then(handleAction_17)
            ['catch']((value_168) => handleAction_12(value_168.message || 'MCP 服务器读取失败'));
    }
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', handleDOMContentLoaded, {
            once: true,
        });
    else handleDOMContentLoaded();
    window.mcpApp = {
        open: open_2,
        close: close_2,
        refresh: refresh_2,
        openServer: openServer_2,
        addServer: () => handleAction_37(),
        getServers: getServers_2,
        saveServer: (value_169) => window.mcpIntegration.saveServer(value_169),
        deleteServer: (value_170) => window.mcpIntegration.deleteServer(value_170),
        discoverTools: (value_171, value_172) =>
            window.mcpIntegration.discoverTools(value_171, value_172),
        callTool: (value_173, value_174, value_175, value_176) =>
            window.mcpIntegration.callTool(value_173, value_174, value_175, value_176),
    };
})();
