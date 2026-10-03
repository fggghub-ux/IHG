const WB_UNGROUPED = '未分组';
let worldBooks = [],
    wbGroups = [],
    activeWbGroupName = null,
    editingBookId = null,
    activeEntryId = null,
    tempEntries = [],
    draftIsGlobal = false,
    editorInitialSnapshot = '',
    editingGroupName = null,
    wbFolderEditMode = false,
    wbEditorExitPending = false;
const wbBookTokenCache = new Map();
function getWbElement(id_3) {
    return document.getElementById(id_3);
}
function openWbOverlay(id_4) {
    const element_2 = getWbElement(id_4);
    if (element_2 && window.openView) window.openView(element_2);
}
function closeWbOverlay(id_5) {
    const element_3 = getWbElement(id_5);
    if (element_3 && window.closeView) window.closeView(element_3);
}
function escapeHtml(value_2 = '') {
    return String(value_2)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function escapeAttr(value_5 = '') {
    return escapeHtml(value_5);
}
function normalizeGroupName(value_9) {
    const name_2 = String(value_9 || '').trim();
    return name_2 || WB_UNGROUPED;
}
function normalizeGroups() {
    const seen = new Set();
    wbGroups = (Array.isArray(wbGroups) ? wbGroups : [])
        .map((name_3) => String(name_3 || '').trim())
        .filter((name_4) => name_4 && name_4 !== WB_UNGROUPED)
        .filter((name_5) => {
            if (seen.has(name_5)) return false;
            return (seen.add(name_5), true);
        });
}
function getAllDisplayGroups() {
    normalizeGroups();
    const assignedGroups = worldBooks
        .map((book_2) => normalizeGroupName(book_2 && book_2.group))
        .filter((group_2) => group_2 !== WB_UNGROUPED && !wbGroups.includes(group_2));
    return [...wbGroups, ...Array.from(new Set(assignedGroups)), WB_UNGROUPED];
}
function invalidateWorldBookRenderCache() {
    wbBookTokenCache.clear();
}
function invalidateWorldBookLocalBindings() {}
function saveWorldBooksData() {
    invalidateWorldBookRenderCache();
    window.StorageManager &&
        (window.StorageManager.save('u2_worldBooks', worldBooks),
        window.StorageManager.save('u2_wbGroups', wbGroups));
}
function getBookTokenCount(book_3) {
    if (!book_3 || book_3.id == null) return calculateTokens(book_3 && book_3.entries);
    const cacheKey = String(book_3.id);
    if (wbBookTokenCache.has(cacheKey)) return wbBookTokenCache.get(cacheKey);
    const count_2 = calculateTokens(book_3.entries);
    return (wbBookTokenCache.set(cacheKey, count_2), count_2);
}
function calculateTokens(value_18) {
    const text_2 = (Array.isArray(value_18) ? value_18 : [])
        .map(
            (message_20) =>
                '' +
                ((message_20 && message_20.title) || '') +
                ((message_20 && message_20.keyword) || '') +
                ((message_20 && message_20.content) || ''),
        )
        .join('');
    return Math.ceil(text_2.length * 1.5) || 0;
}
window.calculateTokens = calculateTokens;
window.invalidateWorldBookLocalBindings = invalidateWorldBookLocalBindings;
window.getWorldBooks = () => (Array.isArray(worldBooks) ? worldBooks : []);
function cloneWorldBookAgentValue(value_21) {
    if (typeof structuredClone === 'function') return structuredClone(value_21);
    return JSON.parse(JSON.stringify(value_21));
}
function normalizeWorldBookAgentEntries(value_22) {
    return (Array.isArray(value_22) ? value_22 : [])
        .slice(0, 200)
        .map((value_23, value_24) => {
            const message_25 = window.normalizeWorldBookEntry
                    ? window.normalizeWorldBookEntry(value_23 || {})
                    : value_23 || {},
                triggerMode_2 = message_25.triggerMode === 'keyword' ? 'keyword' : 'permanent';
            return {
                id: message_25.id || 'wb-entry-' + Date.now() + '-' + value_24,
                title: String(
                    message_25.title ||
                        message_25.name ||
                        message_25.keyword ||
                        '词条 ' + (value_24 + 1),
                )
                    .trim()
                    .slice(0, 160),
                keyword:
                    triggerMode_2 === 'keyword'
                        ? String(message_25.keyword || '')
                              .trim()
                              .slice(0, 500)
                        : '',
                content: String(message_25.content || '')
                    .trim()
                    .slice(0, 50000),
                triggerMode: triggerMode_2,
                injectionPosition: ['before_role', 'after_role', 'system_depth'].includes(
                    message_25.injectionPosition,
                )
                    ? message_25.injectionPosition
                    : 'before_role',
                systemDepth: Number.isFinite(Number(message_25.systemDepth))
                    ? Number(message_25.systemDepth)
                    : 4,
                order: Number.isFinite(Number(message_25.order)) ? Number(message_25.order) : 100,
                recursive: false,
                enabled: message_25.enabled !== false,
            };
        })
        .filter(
            (message_27) =>
                message_27.content && (message_27.triggerMode !== 'keyword' || message_27.keyword),
        );
}
function normalizeWorldBookAgentPayload(book_4 = {}) {
    const name_13 = String(book_4.name || '')
            .trim()
            .slice(0, 120),
        entries_2 = normalizeWorldBookAgentEntries(book_4.entries);
    if (!name_13) throw new Error('世界书名称为空');
    if (entries_2.length === 0) throw new Error('世界书至少需要一个有效词条');
    return {
        name: name_13,
        group: normalizeGroupName(book_4.group),
        isGlobal: book_4.isGlobal === true,
        entries: entries_2,
    };
}
function getWorldBookAgentSnapshot(value_30) {
    const result = worldBooks.find((value_31) => String(value_31?.id) === String(value_30));
    return result ? cloneWorldBookAgentValue(result) : null;
}
function getWorldBookAgentFingerprint(value_32) {
    const worldBookAgentSnapshot = getWorldBookAgentSnapshot(value_32);
    return worldBookAgentSnapshot ? JSON.stringify(worldBookAgentSnapshot) : '';
}
function finishWorldBookAgentMutation() {
    saveWorldBooksData();
    renderWorldBooks({
        force: true,
    });
    window.dispatchEvent(
        new CustomEvent('u2:worldbooks-updated', {
            detail: {
                books: window.u2WorldBookAgent.list(),
            },
        }),
    );
}
window.u2WorldBookAgent = {
    list() {
        return worldBooks.map((value_33) => ({
            id: value_33.id,
            name: String(value_33.name || ''),
            group: normalizeGroupName(value_33.group),
            isGlobal: value_33.isGlobal === true,
            entryCount: Array.isArray(value_33.entries) ? value_33.entries.length : 0,
        }));
    },
    getSnapshot: getWorldBookAgentSnapshot,
    fingerprint: getWorldBookAgentFingerprint,
    validate(value_34) {
        try {
            return {
                valid: true,
                payload: normalizeWorldBookAgentPayload(value_34),
            };
        } catch (value_35) {
            return {
                valid: false,
                error: value_35.message || '世界书作品无效',
            };
        }
    },
    async apply(value_36, value_37 = '') {
        const worldBookAgentPayload = normalizeWorldBookAgentPayload(value_36),
            value_38 = value_37
                ? worldBooks.find((value_41) => String(value_41?.id) === String(value_37))
                : null;
        if (value_37 && !value_38) throw new Error('要修改的世界书不存在');
        const previousSnapshot_2 = value_38 ? cloneWorldBookAgentValue(value_38) : null,
            value_40 = value_38 ? value_38.id : 'youtu-wb-' + Date.now();
        value_38
            ? Object.assign(value_38, worldBookAgentPayload)
            : worldBooks.push({
                  id: value_40,
                  ...worldBookAgentPayload,
                  attachedRoles: [],
              });
        if (
            worldBookAgentPayload.group !== WB_UNGROUPED &&
            !wbGroups.includes(worldBookAgentPayload.group)
        )
            wbGroups.push(worldBookAgentPayload.group);
        return (
            finishWorldBookAgentMutation(),
            {
                targetBookId: value_40,
                previousSnapshot: previousSnapshot_2,
                appliedFingerprint: getWorldBookAgentFingerprint(value_40),
            }
        );
    },
    async restore(value_42, value_43) {
        const index = worldBooks.findIndex((value_44) => String(value_44?.id) === String(value_42));
        if (value_43) {
            if (index < 0) throw new Error('原世界书已不存在');
            worldBooks[index] = cloneWorldBookAgentValue(value_43);
        } else {
            if (index < 0) return true;
            worldBooks.splice(index, 1);
        }
        return (finishWorldBookAgentMutation(), true);
    },
};
function normalizeEntryForEditor(entry_2 = {}, value_46 = 0) {
    const normalizer = window.normalizeWorldBookEntry,
        source = normalizer ? normalizer(entry_2) : entry_2;
    return {
        ...source,
        __editorId: Date.now() + '-' + value_46 + '-' + Math.random().toString(36).slice(2, 8),
        title: String(source.title || source.name || source.keyword || '词条 ' + (value_46 + 1)),
        keyword: String(source.keyword || ''),
        content: String(source.content || ''),
        triggerMode: source.triggerMode === 'keyword' ? 'keyword' : 'permanent',
        injectionPosition: ['before_role', 'after_role', 'system_depth'].includes(
            source.injectionPosition,
        )
            ? source.injectionPosition
            : 'before_role',
        systemDepth: Number.isFinite(Number(source.systemDepth)) ? Number(source.systemDepth) : 4,
        order: Number.isFinite(Number(source.order)) ? Number(source.order) : 100,
        recursive: false,
        enabled: source.enabled !== false,
    };
}
function createDefaultEntry(value_49 = 0) {
    return normalizeEntryForEditor(
        {
            title: '词条 ' + (value_49 + 1),
            content: '',
            keyword: '',
            triggerMode: 'permanent',
            injectionPosition: 'before_role',
            systemDepth: 4,
            order: 100,
            enabled: true,
        },
        value_49,
    );
}
function showCenteredConfirm({
    title = '确认操作',
    message = '确定继续吗？',
    confirmText = '确认',
    cancelText = '取消',
    isDestructive = false,
    onConfirm: onConfirm_2,
} = {}) {
    if (typeof window.showCustomModal === 'function') {
        window.showCustomModal({
            title: title,
            message: message,
            confirmText: confirmText,
            cancelText: cancelText,
            isDestructive: isDestructive,
            onConfirm: onConfirm_2,
        });
        return;
    }
    getWbElement('wb-inline-confirm-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'wb-inline-confirm-overlay';
    overlay.className = 'bottom-sheet-overlay wb-centered-modal-overlay active';
    overlay.innerHTML =
        `
        <div class="wb-centered-modal-card wb-group-modal-card wb-inline-confirm-card">
            <div class="wb-centered-modal-header"><div class="wb-centered-modal-title">` +
        escapeHtml(title) +
        `</div></div>
            <div class="wb-centered-modal-body wb-inline-confirm-body">
                <div class="wb-inline-confirm-message">` +
        escapeHtml(message) +
        `</div>
                <div class="wb-inline-confirm-actions">
                    <button type="button" class="wb-inline-confirm-btn wb-inline-confirm-cancel">` +
        escapeHtml(cancelText) +
        `</button>
                    <button type="button" class="wb-inline-confirm-btn ` +
        (isDestructive ? 'wb-inline-confirm-danger' : 'wb-inline-confirm-confirm') +
        '">' +
        escapeHtml(confirmText) +
        `</button>
                </div>
            </div>
        </div>`;
    const cleanUp = () => overlay.remove();
    overlay.querySelector('.wb-inline-confirm-cancel').addEventListener('click', cleanUp);
    overlay
        .querySelector(isDestructive ? '.wb-inline-confirm-danger' : '.wb-inline-confirm-confirm')
        .addEventListener('click', () => {
            cleanUp();
            if (typeof onConfirm_2 === 'function') onConfirm_2();
        });
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) cleanUp();
    });
    (getWbElement('app') || document.body).appendChild(overlay);
}
function showWbMainPage() {
    activeWbGroupName = null;
    getWbElement('wb-files-main-page')?.classList.add('active');
    getWbElement('wb-files-group-page')?.classList.remove('active');
    getWbElement('wb-files-editor-page')?.classList.remove('active');
    renderWorldBooks({
        force: true,
    });
}
function openWbGroupPage(groupName) {
    activeWbGroupName = normalizeGroupName(groupName);
    getWbElement('wb-files-main-page')?.classList.remove('active');
    getWbElement('wb-files-editor-page')?.classList.remove('active');
    getWbElement('wb-files-group-page')?.classList.add('active');
    renderGroupBookList(activeWbGroupName);
}
function showEditorPage() {
    getWbElement('wb-files-main-page')?.classList.remove('active');
    getWbElement('wb-files-group-page')?.classList.remove('active');
    getWbElement('wb-files-editor-page')?.classList.add('active');
}
function isWorldBookEditableElement(value_51) {
    if (!value_51 || value_51.disabled) return false;
    const toUpperCase_52 = String(value_51.tagName || '').toUpperCase();
    return (
        toUpperCase_52 === 'INPUT' ||
        toUpperCase_52 === 'TEXTAREA' ||
        toUpperCase_52 === 'SELECT' ||
        value_51.isContentEditable ||
        value_51.getAttribute?.('contenteditable') === 'true'
    );
}
function waitForWorldBookKeyboardToClose(value_53 = 460) {
    const wbElement_54 = getWbElement('wb-files-editor-page'),
        activeElement_55 = document.activeElement,
        value_56 =
            !!window.mobileInputCompat?.isAndroid || /Android/i.test(navigator.userAgent || '');
    if (
        !wbElement_54 ||
        !value_56 ||
        !activeElement_55 ||
        !wbElement_54.contains(activeElement_55) ||
        !isWorldBookEditableElement(activeElement_55)
    )
        return Promise.resolve();
    activeElement_55.blur();
    const visualViewport_57 = window.visualViewport;
    if (!visualViewport_57) return new Promise((value_62) => window.setTimeout(value_62, 280));
    const now_58 = Date.now(),
        round_59 = Math.round(visualViewport_57.height || 0);
    let value_60 = round_59,
        count_61 = 0;
    return new Promise((value_63) => {
        let enabled_64 = false;
        const value_65 = () => {
                if (enabled_64) return;
                enabled_64 = true;
                value_63();
            },
            setTimeout_66 = window.setTimeout(value_65, value_53),
            value_67 = () => {
                if (enabled_64) return;
                const round_68 = Math.round(visualViewport_57.height || 0);
                count_61 = Math.abs(round_68 - value_60) <= 1 ? count_61 + 1 : 0;
                value_60 = round_68;
                const value_69 = round_68 >= round_59 + 72;
                if ((value_69 && count_61 >= 2) || Date.now() - now_58 >= value_53) {
                    window.clearTimeout(setTimeout_66);
                    value_65();
                    return;
                }
                window.requestAnimationFrame(value_67);
            };
        window.requestAnimationFrame(value_67);
    });
}
function leaveWorldBookEditor(value_70) {
    if (wbEditorExitPending) return;
    wbEditorExitPending = true;
    waitForWorldBookKeyboardToClose()['finally'](() => {
        wbEditorExitPending = false;
        value_70();
    });
}
function getBooksInGroup(groupName_2) {
    const normalized = normalizeGroupName(groupName_2);
    return worldBooks.filter((book_5) => normalizeGroupName(book_5 && book_5.group) === normalized);
}
let lastRenderHash = '',
    lastRenderGroupsSnapshot = '';
function createFolderElement(value_73) {
    const group_3 = normalizeGroupName(value_73),
        count_3 = getBooksInGroup(group_3).length,
        item = document.createElement('button');
    return (
        (item.type = 'button'),
        (item.className = 'wb-notes-row wb-folder-row' + (wbFolderEditMode ? ' is-editing' : '')),
        (item.dataset.group = group_3),
        (item.innerHTML =
            `
        <span class="wb-row-icon wb-folder-icon"><i class="far fa-folder"></i></span>
        <span class="wb-row-main"><strong>` +
            escapeHtml(group_3) +
            `</strong></span>
        <span class="wb-row-count">` +
            count_3 +
            `</span>
        <i class="fas fa-chevron-right wb-row-chevron"></i>
        ` +
            (group_3 === WB_UNGROUPED
                ? ''
                : '<span class="wb-row-edit-actions"><i class="fas fa-pen" data-action="rename"></i><i class="far fa-trash-alt" data-action="delete"></i></span>')),
        item.addEventListener('click', (event_2) => {
            const action_2 = event_2.target.closest('[data-action]')?.dataset.action;
            if (action_2 === 'rename') {
                event_2.stopPropagation();
                openGroupNameDialog(group_3);
            } else {
                if (action_2 === 'delete') {
                    event_2.stopPropagation();
                    deleteGroupByName(group_3);
                } else !wbFolderEditMode && openWbGroupPage(group_3);
            }
        }),
        item
    );
}
function renderWorldBooks({ force = false } = {}) {
    normalizeGroups();
    const list_2 = getWbElement('wb-folder-list');
    if (!list_2) return;
    const books_2 = getAllDisplayGroups(),
        stringify_79 = JSON.stringify(
            books_2.map((name_14) => ({
                name: name_14,
                count: getBooksInGroup(name_14).length,
            })),
        );
    if (!force && lastRenderHash === stringify_79) {
        if (activeWbGroupName) renderGroupBookList(activeWbGroupName);
        return;
    }
    lastRenderHash = stringify_79;
    const fragment = document.createDocumentFragment();
    books_2.forEach((book_6) => fragment.appendChild(createFolderElement(book_6)));
    list_2.replaceChildren(fragment);
    if (activeWbGroupName) renderGroupBookList(activeWbGroupName);
}
function createBookListItemElement(book_7) {
    const item_2 = document.createElement('button'),
        entryCount_2 = Array.isArray(book_7.entries) ? book_7.entries.length : 0,
        bookTokenCount = getBookTokenCount(book_7);
    return (
        (item_2.type = 'button'),
        (item_2.className = 'wb-notes-row wb-book-row'),
        (item_2.dataset.id = String(book_7.id)),
        (item_2.innerHTML =
            `
        <span class="wb-row-icon wb-book-icon"><i class="far fa-note-sticky"></i></span>
        <span class="wb-row-main"><strong>` +
            escapeHtml(book_7.name || '未命名世界书') +
            '</strong><small>' +
            entryCount_2 +
            ' 个词条 · ' +
            bookTokenCount +
            ' Tokens' +
            (book_7.isGlobal ? ' · 全局启用' : '') +
            `</small></span>
        <i class="fas fa-chevron-right wb-row-chevron"></i>`),
        item_2.addEventListener('click', () => openBookModal(book_7)),
        item_2
    );
}
function renderGroupBookList(value_85) {
    const textContent_2 = normalizeGroupName(value_85),
        books_3 = getBooksInGroup(textContent_2),
        title_2 = getWbElement('wb-group-large-title'),
        countLine = getWbElement('wb-group-count-line'),
        list_3 = getWbElement('wb-group-book-list');
    if (title_2) title_2.textContent = textContent_2;
    if (countLine) countLine.textContent = books_3.length + ' 本世界书';
    if (!list_3) return;
    const stringify_90 = JSON.stringify(
        books_3.map((value_92) => ({
            id: value_92.id,
            name: value_92.name,
            isGlobal: value_92.isGlobal,
            entries: value_92.entries?.length,
        })),
    );
    if (lastRenderGroupsSnapshot === stringify_90 && textContent_2 === activeWbGroupName) return;
    lastRenderGroupsSnapshot = stringify_90;
    if (!books_3.length) {
        list_3.innerHTML =
            '<div class="wb-files-empty-state"><i class="far fa-folder-open"></i><span>这个文件夹还没有世界书</span></div>';
        return;
    }
    const fragment_2 = document.createDocumentFragment();
    books_3.forEach((book_8) => fragment_2.appendChild(createBookListItemElement(book_8)));
    list_3.replaceChildren(fragment_2);
}
function renderWorldBookTab() {
    renderWorldBooks({
        force: true,
    });
}
function renderWorldBookGlobalTab() {
    const target_2 = getWbElement('wb-global-list');
    if (!target_2) return;
    const globalBooks = worldBooks.filter((book_9) => book_9.isGlobal);
    target_2.textContent = globalBooks.length + ' 本全局世界书';
}
function renderWorldBookLocalTab() {}
function normalizeBookForSave() {
    return tempEntries.map((entry_3, value_98) => {
        const normalized_2 = normalizeEntryForEditor(entry_3, value_98),
            { __editorId: __editorId_2, ...rest } = normalized_2;
        return {
            ...rest,
            title: String(entry_3.title || '').trim() || '词条 ' + (value_98 + 1),
            keyword: entry_3.triggerMode === 'keyword' ? String(entry_3.keyword || '').trim() : '',
            content: String(entry_3.content || '').trim(),
            triggerMode: entry_3.triggerMode === 'keyword' ? 'keyword' : 'permanent',
            injectionPosition: ['before_role', 'after_role', 'system_depth'].includes(
                entry_3.injectionPosition,
            )
                ? entry_3.injectionPosition
                : 'before_role',
            systemDepth: Number.isFinite(Number(entry_3.systemDepth))
                ? Number(entry_3.systemDepth)
                : 4,
            order: 100,
            recursive: false,
            enabled: entry_3.enabled !== false,
        };
    });
}
function renderAddBookGroupSelect() {
    const select = getWbElement('add-book-group-input');
    if (!select) return;
    const current = normalizeGroupName(select.value);
    select.innerHTML = getAllDisplayGroups()
        .map(
            (value_103) =>
                '<option value="' +
                escapeAttr(value_103) +
                '">' +
                escapeHtml(value_103) +
                '</option>',
        )
        .join('');
    select.value = getAllDisplayGroups().includes(current) ? current : WB_UNGROUPED;
}
function getEditorSnapshot() {
    return JSON.stringify({
        name: getWbElement('add-book-name-input')?.value || '',
        group: normalizeGroupName(getWbElement('add-book-group-input')?.value),
        isGlobal: !!draftIsGlobal,
        entries: tempEntries.map(({ __editorId: __editorId_3, ...entry_4 }) => entry_4),
    });
}
function isEditorDirty() {
    return getEditorSnapshot() !== editorInitialSnapshot;
}
function openBookModal(book_10 = null, preferredGroup = null, entryEditorId = null) {
    editingBookId = book_10 ? book_10.id : null;
    const nameInput = getWbElement('add-book-name-input'),
        groupInput = getWbElement('add-book-group-input'),
        globalInput = getWbElement('wb-editor-global-toggle'),
        deleteButton = getWbElement('delete-world-book-btn');
    renderAddBookGroupSelect();
    if (book_10) {
        if (nameInput) nameInput.value = book_10.name || '';
        if (groupInput) groupInput.value = normalizeGroupName(book_10.group);
        tempEntries = (Array.isArray(book_10.entries) ? book_10.entries : []).map(
            normalizeEntryForEditor,
        );
        draftIsGlobal = !!book_10.isGlobal;
        if (deleteButton) deleteButton.hidden = false;
    } else {
        if (nameInput) nameInput.value = '';
        if (groupInput)
            groupInput.value = normalizeGroupName(
                preferredGroup || activeWbGroupName || WB_UNGROUPED,
            );
        tempEntries = [createDefaultEntry(0)];
        draftIsGlobal = false;
        if (deleteButton) deleteButton.hidden = true;
    }
    if (globalInput) globalInput.checked = draftIsGlobal;
    activeEntryId = entryEditorId || tempEntries[0]?.__editorId || null;
    getWbElement('wb-editor-back-label').textContent = activeWbGroupName || '世界书';
    renderEntries();
    editorInitialSnapshot = getEditorSnapshot();
    showEditorPage();
    window.setTimeout(() => nameInput?.focus(), 0);
}
function addEntry() {
    const entry_5 = createDefaultEntry(tempEntries.length);
    tempEntries.push(entry_5);
    activeEntryId = entry_5.__editorId;
    renderEntries();
}
function deleteEntry(editorId) {
    showCenteredConfirm({
        title: '删除词条',
        message: '确定要删除这个词条吗？',
        confirmText: '删除',
        isDestructive: true,
        onConfirm: () => {
            tempEntries = tempEntries.filter((entry_6) => entry_6.__editorId !== editorId);
            if (!tempEntries.length) tempEntries = [createDefaultEntry(0)];
            activeEntryId = tempEntries[0].__editorId;
            renderEntries();
        },
    });
}
function renderEntries() {
    const list_4 = getWbElement('wb-entries-list-container');
    if (!list_4) return;
    const documentFragment_115 = document.createDocumentFragment();
    tempEntries.forEach((entry_7, value_117) => {
        const expanded = entry_7.__editorId === activeEntryId,
            item_3 = document.createElement('article');
        item_3.className = 'wb-entry-note' + (expanded ? ' expanded' : '');
        item_3.dataset.entryId = entry_7.__editorId;
        const hasKeywords = entry_7.triggerMode === 'keyword',
            isSystemDepth = entry_7.injectionPosition === 'system_depth';
        item_3.innerHTML =
            `
            <header class="wb-entry-note-head">
                <button type="button" class="wb-entry-expand-btn" aria-expanded="` +
            expanded +
            `">
                    <span><strong>` +
            escapeHtml(entry_7.title || '词条 ' + (value_117 + 1)) +
            '</strong><small>' +
            (hasKeywords ? '关键词触发' : '永久生效') +
            ' · ' +
            (entry_7.injectionPosition === 'after_role'
                ? '角色后'
                : isSystemDepth
                  ? '系统深度'
                  : '角色前') +
            `</small></span><i class="fas fa-chevron-right"></i>
                </button>
                <button type="button" class="wb-entry-delete-btn" aria-label="删除词条"><i class="far fa-trash-alt"></i></button>
            </header>
            <div class="wb-entry-note-body" ` +
            (expanded ? '' : 'hidden') +
            `>
                <input type="text" class="wb-entry-title-input" placeholder="词条标题" value="` +
            escapeAttr(entry_7.title) +
            `" aria-label="词条标题">
                <textarea class="wb-entry-body-textarea" placeholder="输入词条内容…" aria-label="词条内容">` +
            escapeHtml(entry_7.content) +
            `</textarea>
                <details class="wb-entry-settings" ` +
            (hasKeywords || isSystemDepth ? 'open' : '') +
            `>
                    <summary>词条设置 <i class="fas fa-chevron-right"></i></summary>
                    <div class="wb-entry-settings-content">
                        <label class="wb-entry-field"><span>触发模式</span><select class="wb-entry-trigger-mode"><option value="permanent" ` +
            (entry_7.triggerMode === 'permanent' ? 'selected' : '') +
            '>永久生效</option><option value="keyword" ' +
            (hasKeywords ? 'selected' : '') +
            `>关键词触发</option></select></label>
                        <label class="wb-entry-field wb-entry-keyword-field" ` +
            (hasKeywords ? '' : 'hidden') +
            '><span>关键词（多个用逗号分隔）</span><input type="text" class="wb-entry-keyword-input" placeholder="输入关键词" value="' +
            escapeAttr(entry_7.keyword) +
            `"></label>
                        <label class="wb-entry-field"><span>注入位置</span><select class="wb-entry-injection-position"><option value="before_role" ` +
            (entry_7.injectionPosition === 'before_role' ? 'selected' : '') +
            '>角色前</option><option value="after_role" ' +
            (entry_7.injectionPosition === 'after_role' ? 'selected' : '') +
            '>角色后</option><option value="system_depth" ' +
            (isSystemDepth ? 'selected' : '') +
            `>系统深度</option></select></label>
                        <label class="wb-entry-field wb-entry-depth-field" ` +
            (isSystemDepth ? '' : 'hidden') +
            '><span>系统深度</span><input type="number" min="0" class="wb-entry-system-depth-input" value="' +
            entry_7.systemDepth +
            `"></label>
                    </div>
                </details>
            </div>`;
        const expandButton = item_3.querySelector('.wb-entry-expand-btn');
        expandButton.addEventListener('click', () => {
            activeEntryId = activeEntryId === entry_7.__editorId ? null : entry_7.__editorId;
            renderEntries();
        });
        item_3
            .querySelector('.wb-entry-delete-btn')
            .addEventListener('click', () => deleteEntry(entry_7.__editorId));
        item_3.querySelector('.wb-entry-title-input').addEventListener('input', (event_3) => {
            entry_7.title = event_3.target.value;
        });
        const contentTextarea = item_3.querySelector('.wb-entry-body-textarea');
        contentTextarea.addEventListener('input', (event_4) => {
            entry_7.content = event_4.target.value;
        });
        item_3.querySelector('.wb-entry-keyword-input').addEventListener('input', (event_5) => {
            entry_7.keyword = event_5.target.value;
        });
        item_3.querySelector('.wb-entry-trigger-mode').addEventListener('change', (event_6) => {
            entry_7.triggerMode = event_6.target.value === 'keyword' ? 'keyword' : 'permanent';
            renderEntries();
        });
        item_3
            .querySelector('.wb-entry-injection-position')
            .addEventListener('change', (event_7) => {
                entry_7.injectionPosition = event_7.target.value;
                renderEntries();
            });
        item_3
            .querySelector('.wb-entry-system-depth-input')
            .addEventListener('input', (event_8) => {
                const value_11 = Number.parseInt(event_8.target.value, 10);
                entry_7.systemDepth = Number.isFinite(value_11) ? value_11 : 4;
            });
        documentFragment_115.appendChild(item_3);
    });
    list_4.replaceChildren(documentFragment_115);
}
function finishEditor() {
    if (wbEditorExitPending) return;
    const name_6 = String(getWbElement('add-book-name-input')?.value || '').trim(),
        group_4 = normalizeGroupName(getWbElement('add-book-group-input')?.value);
    if (!name_6) {
        window.showToast?.('请输入世界书名称');
        getWbElement('add-book-name-input')?.focus();
        return;
    }
    const entries_3 = normalizeBookForSave();
    for (let count_131 = 0; count_131 < entries_3.length; count_131 += 1) {
        if (!entries_3[count_131].content) {
            activeEntryId = tempEntries[count_131].__editorId;
            renderEntries();
            window.showToast?.('请填写“' + entries_3[count_131].title + '”的内容');
            return;
        }
        if (entries_3[count_131].triggerMode === 'keyword' && !entries_3[count_131].keyword) {
            activeEntryId = tempEntries[count_131].__editorId;
            renderEntries();
            window.showToast?.('请填写“' + entries_3[count_131].title + '”的关键词');
            return;
        }
    }
    if (editingBookId != null) {
        const book_11 = worldBooks.find((item_4) => String(item_4.id) === String(editingBookId));
        if (book_11)
            Object.assign(book_11, {
                name: name_6,
                group: group_4,
                entries: entries_3,
                isGlobal: draftIsGlobal,
            });
    } else {
        editingBookId = Date.now();
        worldBooks.push({
            id: editingBookId,
            name: name_6,
            group: group_4,
            entries: entries_3,
            isGlobal: draftIsGlobal,
            attachedRoles: [],
        });
    }
    if (group_4 !== WB_UNGROUPED && !wbGroups.includes(group_4)) wbGroups.push(group_4);
    saveWorldBooksData();
    editorInitialSnapshot = getEditorSnapshot();
    renderWorldBooks({
        force: true,
    });
    leaveWorldBookEditor(() => {
        if (activeWbGroupName) {
            if (normalizeGroupName(activeWbGroupName) === group_4) openWbGroupPage(group_4);
            else showWbMainPage();
        } else showWbMainPage();
        window.showToast?.('世界书已保存');
    });
}
function requestCloseEditor() {
    if (wbEditorExitPending) return;
    if (!isEditorDirty()) {
        leaveWorldBookEditor(() =>
            activeWbGroupName ? openWbGroupPage(activeWbGroupName) : showWbMainPage(),
        );
        return;
    }
    showCenteredConfirm({
        title: '放弃未保存的更改？',
        message: '返回后，本次编辑不会保存。',
        confirmText: '放弃更改',
        isDestructive: true,
        onConfirm: () =>
            leaveWorldBookEditor(() =>
                activeWbGroupName ? openWbGroupPage(activeWbGroupName) : showWbMainPage(),
            ),
    });
}
function deleteCurrentBook() {
    if (editingBookId == null || wbEditorExitPending) return;
    showCenteredConfirm({
        title: '删除世界书',
        message: '确定要删除这本世界书吗？此操作不可恢复。',
        confirmText: '删除',
        isDestructive: true,
        onConfirm: () => {
            worldBooks = worldBooks.filter(
                (book_12) => String(book_12.id) !== String(editingBookId),
            );
            saveWorldBooksData();
            leaveWorldBookEditor(() =>
                activeWbGroupName ? openWbGroupPage(activeWbGroupName) : showWbMainPage(),
            );
            window.showToast?.('世界书已删除');
        },
    });
}
function openGroupNameDialog(groupName_3 = null) {
    editingGroupName = groupName_3;
    getWbElement('wb-group-name-modal-title').textContent = groupName_3
        ? '重命名文件夹'
        : '新建文件夹';
    const input = getWbElement('wb-group-name-input');
    input.value = groupName_3 || '';
    openWbOverlay('wb-group-name-overlay');
    window.setTimeout(() => input.focus(), 0);
}
function saveGroupName() {
    const input_2 = getWbElement('wb-group-name-input'),
        nextName = String(input_2?.value || '').trim();
    normalizeGroups();
    if (!nextName) return window.showToast?.('请输入文件夹名称');
    if (nextName === WB_UNGROUPED) return window.showToast?.('“未分组”是系统文件夹');
    if (wbGroups.includes(nextName) && nextName !== editingGroupName)
        return window.showToast?.('该文件夹已存在');
    if (editingGroupName) {
        wbGroups = wbGroups.map((name_7) => (name_7 === editingGroupName ? nextName : name_7));
        worldBooks.forEach((value_138) => {
            if (normalizeGroupName(value_138.group) === editingGroupName)
                value_138.group = nextName;
        });
        if (activeWbGroupName === editingGroupName) activeWbGroupName = nextName;
    } else wbGroups.push(nextName);
    normalizeGroups();
    saveWorldBooksData();
    closeWbOverlay('wb-group-name-overlay');
    renderWorldBooks({
        force: true,
    });
    if (activeWbGroupName) renderGroupBookList(activeWbGroupName);
    window.showToast?.(editingGroupName ? '文件夹已重命名' : '文件夹已创建');
}
function deleteGroupByName(value_139) {
    const normalized_3 = normalizeGroupName(value_139);
    if (normalized_3 === WB_UNGROUPED) return;
    showCenteredConfirm({
        title: '删除文件夹',
        message: '“' + normalized_3 + '”内的世界书会移到“未分组”。',
        confirmText: '删除',
        isDestructive: true,
        onConfirm: () => {
            wbGroups = wbGroups.filter((group_5) => group_5 !== normalized_3);
            worldBooks.forEach((book_13) => {
                if (normalizeGroupName(book_13.group) === normalized_3)
                    book_13.group = WB_UNGROUPED;
            });
            saveWorldBooksData();
            if (activeWbGroupName === normalized_3) showWbMainPage();
            else
                renderWorldBooks({
                    force: true,
                });
            window.showToast?.('文件夹已删除');
        },
    });
}
function toggleGroupMoreMenu() {
    const menu = getWbElement('wb-group-more-menu');
    if (!menu || !activeWbGroupName) return;
    if (!menu.hidden) {
        menu.hidden = true;
        return;
    }
    const canEdit = activeWbGroupName !== WB_UNGROUPED;
    menu.innerHTML =
        `
        <button type="button" data-menu-action="import"><i class="fas fa-file-import"></i>导入世界书</button>
        ` +
        (canEdit
            ? '<button type="button" data-menu-action="rename"><i class="fas fa-pen"></i>重命名文件夹</button><button type="button" class="is-danger" data-menu-action="delete"><i class="far fa-trash-alt"></i>删除文件夹</button>'
            : '');
    menu.hidden = false;
    menu.querySelectorAll('[data-menu-action]').forEach((button) =>
        button.addEventListener('click', () => {
            const action_3 = button.dataset.menuAction;
            menu.hidden = true;
            if (action_3 === 'import') triggerWorldBookImport();
            if (action_3 === 'rename') openGroupNameDialog(activeWbGroupName);
            if (action_3 === 'delete') deleteGroupByName(activeWbGroupName);
        }),
    );
}
function getFileBaseName(fileName = '') {
    return String(fileName || '导入的世界书').replace(/\.[^/.]+$/, '') || '导入的世界书';
}
function isSupportedWorldBookImportFile(file) {
    const name_8 = String(file?.name || '').toLowerCase();
    return name_8.endsWith('.txt') || name_8.endsWith('.docx');
}
async function readWorldBookImportText(file_2) {
    if (
        String(file_2?.name || '')
            .toLowerCase()
            .endsWith('.docx')
    ) {
        try {
            await window.u2LoadVendorLibrary?.('mammoth');
        } catch (error_2) {
            console.warn('[worldbook] Could not load DOCX parser.', error_2);
        }
        if (!window.mammoth?.extractRawText)
            return (window.showToast?.('DOCX 解析器加载失败，请先另存为 TXT 后导入'), null);
        const result_2 = await window.mammoth.extractRawText({
            arrayBuffer: await file_2.arrayBuffer(),
        });
        if (!String(result_2?.value || '').trim()) throw new Error('DOCX 文件内容为空');
        return result_2.value;
    }
    return file_2.text();
}
function sanitizeImportedWorldBook(rawBook, fallbackName = '导入的世界书') {
    const source_2 = rawBook && typeof rawBook === 'object' ? rawBook : {},
        entries_4 = (
            Array.isArray(source_2.entries)
                ? source_2.entries
                : [
                      {
                          title: source_2.name || fallbackName,
                          content: source_2.content || '',
                      },
                  ]
        )
            .map((entry_8, index_2) => normalizeEntryForEditor(entry_8, index_2))
            .filter((entry_9) => String(entry_9.content || '').trim())
            .map(({ __editorId: __editorId_4, ...entry_10 }) => entry_10);
    return {
        id: Date.now() + Math.floor(Math.random() * 10000),
        name: String(source_2.name || fallbackName).trim() || fallbackName,
        group: normalizeGroupName(source_2.group || activeWbGroupName || WB_UNGROUPED),
        entries: entries_4.length
            ? entries_4
            : [
                  {
                      title: '正文',
                      content: '空白内容',
                      keyword: '',
                      triggerMode: 'permanent',
                      injectionPosition: 'before_role',
                      systemDepth: 4,
                      order: 100,
                      recursive: false,
                      enabled: true,
                  },
              ],
        isGlobal: !!source_2.isGlobal,
        attachedRoles: Array.isArray(source_2.attachedRoles) ? source_2.attachedRoles : [],
    };
}
function parseImportedWorldBooks(value_158, file_3) {
    const name_10 = getFileBaseName(file_3?.name || ''),
        content_2 = String(value_158 || '').trim();
    if (!content_2) throw new Error('文件内容为空');
    return [
        sanitizeImportedWorldBook(
            {
                name: name_10,
                group: activeWbGroupName || WB_UNGROUPED,
                entries: [
                    {
                        title: name_10,
                        content: content_2,
                    },
                ],
            },
            name_10,
        ),
    ];
}
async function importWorldBookFile(file_4) {
    if (!file_4) return;
    if (!isSupportedWorldBookImportFile(file_4))
        return window.showToast?.('仅支持导入 TXT 和 DOCX 文件');
    try {
        const text_3 = await readWorldBookImportText(file_4);
        if (text_3 === null) return;
        const importedBooks = parseImportedWorldBooks(text_3, file_4);
        worldBooks.push(...importedBooks);
        importedBooks.forEach((book_15) => {
            const group_6 = normalizeGroupName(book_15.group);
            if (group_6 !== WB_UNGROUPED && !wbGroups.includes(group_6)) wbGroups.push(group_6);
        });
        saveWorldBooksData();
        renderWorldBooks({
            force: true,
        });
        if (activeWbGroupName) renderGroupBookList(activeWbGroupName);
        window.showToast?.('已导入 ' + importedBooks.length + ' 本世界书');
    } catch (error_3) {
        console.error('Failed to import world book:', error_3);
        window.showToast?.('导入失败：请检查 TXT 或 DOCX 文件内容');
    }
}
function triggerWorldBookImport() {
    getWbElement('wb-import-file')?.click();
}
function makeSearchSnippet(value_12, query) {
    const text_4 = String(value_12 || '')
            .replace(/\s+/g, ' ')
            .trim(),
        index_3 = text_4.toLowerCase().indexOf(query.toLowerCase());
    if (index_3 < 0) return text_4.slice(0, 76);
    return (
        '' +
        (index_3 > 18 ? '…' : '') +
        text_4.slice(Math.max(0, index_3 - 18), index_3 + query.length + 52) +
        (index_3 + query.length + 52 < text_4.length ? '…' : '')
    );
}
function renderSearchResults(query_2) {
    const panel = getWbElement('wb-search-results');
    if (!panel) return;
    const normalizedQuery = String(query_2 || '')
        .trim()
        .toLowerCase();
    if (!normalizedQuery) {
        panel.hidden = true;
        panel.replaceChildren();
        return;
    }
    const count_173 = 30,
        matches = [];
    let count_174 = 0;
    for (const book_16 of worldBooks) {
        if (count_174 >= count_173) break;
        const bookName = String(book_16.name || '');
        if (bookName.toLowerCase().includes(normalizedQuery)) {
            matches.push({
                book: book_16,
                entry: null,
                snippet: makeSearchSnippet(bookName, normalizedQuery),
            });
            count_174++;
            if (count_174 >= count_173) break;
        }
        const value_178 = Array.isArray(book_16.entries) ? book_16.entries : [];
        for (let entryIndex_2 = 0; entryIndex_2 < value_178.length; entryIndex_2++) {
            if (count_174 >= count_173) break;
            const entry_11 = value_178[entryIndex_2],
                searchable = [entry_11.title, entry_11.keyword, entry_11.content].join(`
`);
            searchable.toLowerCase().includes(normalizedQuery) &&
                (matches.push({
                    book: book_16,
                    entryIndex: entryIndex_2,
                    snippet: makeSearchSnippet(searchable, normalizedQuery),
                }),
                count_174++);
        }
    }
    panel.hidden = false;
    if (!matches.length) {
        panel.innerHTML = '<div class="wb-search-empty">没有找到匹配的世界书或词条</div>';
        return;
    }
    const documentFragment_175 = document.createDocumentFragment();
    matches.forEach((match, value_183) => {
        const element_184 = document.createElement('button');
        element_184.type = 'button';
        element_184.className = 'wb-search-result';
        element_184.dataset.resultIndex = String(value_183);
        element_184.innerHTML =
            `
            <span class="wb-row-icon wb-book-icon"><i class="far fa-note-sticky"></i></span>
            <span><strong>` +
            escapeHtml(
                match.entryIndex == null
                    ? match.book.name || '未命名世界书'
                    : match.book.entries[match.entryIndex].title || '未命名词条',
            ) +
            '</strong><small>' +
            escapeHtml(normalizeGroupName(match.book.group)) +
            ' · ' +
            escapeHtml(match.snippet) +
            `</small></span><i class="fas fa-chevron-right"></i>
        `;
        element_184.addEventListener('click', () => {
            getWbElement('wb-search-input').value = '';
            renderSearchResults('');
            const sourceEntries = Array.isArray(match.book.entries) ? match.book.entries : [],
                targetEntry = Number.isInteger(match.entryIndex)
                    ? sourceEntries[match.entryIndex]
                    : null;
            openBookModal(match.book, null, targetEntry ? undefined : null);
            if (targetEntry) {
                const matchingDraft = tempEntries[match.entryIndex];
                activeEntryId = matchingDraft?.__editorId || activeEntryId;
                renderEntries();
            }
        });
        documentFragment_175.appendChild(element_184);
    });
    panel.replaceChildren(documentFragment_175);
}
window.renderWorldBooks = renderWorldBooks;
window.renderWorldBookTab = renderWorldBookTab;
window.renderWorldBookGlobalTab = renderWorldBookGlobalTab;
window.renderWorldBookLocalTab = renderWorldBookLocalTab;
window.renderWorldBookSelector = function renderWorldBookSelector(selectedIds = [], onConfirm_3) {
    let selectedBookIds = [],
        selector_2 = getWbElement('wb-selector-sheet');
    !selector_2 &&
        ((selector_2 = document.createElement('div')),
        (selector_2.id = 'wb-selector-sheet'),
        (selector_2.className = 'bottom-sheet-overlay detail-sheet-overlay'),
        (selector_2.style.zIndex = '1150'),
        (selector_2.innerHTML = `
            <div class="bottom-sheet wb-selector-panel">
                <div class="sheet-handle"></div><div class="sheet-title">选择世界书</div>
                <div class="wb-selector-body"><div class="wb-selector-field"><label for="wb-selector-group-select">选择分组</label><select id="wb-selector-group-select" class="wb-native-select"></select></div><div class="wb-selector-field"><label for="wb-selector-book-select">选择世界书</label><select id="wb-selector-book-select" class="wb-native-select"></select><div id="wb-selector-empty" class="wb-selector-empty"></div></div><div class="wb-selector-preview-head"><span>已挂载</span><span id="wb-selector-mounted-count">0 项</span></div><div id="wb-selector-mounted-list" class="wb-selector-mounted-list"></div></div>
                <div class="wb-selector-actions"><button type="button" class="sheet-action wb-selector-action-btn" id="wb-selector-cancel-btn">取消</button><button type="button" class="sheet-action confirm-action wb-selector-action-btn" id="wb-selector-confirm-btn">保存</button></div>
            </div>`),
        (getWbElement('app') || document.body).appendChild(selector_2),
        selector_2.addEventListener('click', (event_9) => {
            if (event_9.target === selector_2) window.closeView?.(selector_2);
        }));
    const groupSelect = selector_2.querySelector('#wb-selector-group-select'),
        bookSelect = selector_2.querySelector('#wb-selector-book-select'),
        empty = selector_2.querySelector('#wb-selector-empty'),
        mountedList = selector_2.querySelector('#wb-selector-mounted-list'),
        mountedCount = selector_2.querySelector('#wb-selector-mounted-count'),
        getBook = (id_6) => worldBooks.find((book_17) => String(book_17.id) === String(id_6)),
        value_191 = () => {
            const current_2 = normalizeGroupName(groupSelect.value),
                groups = getAllDisplayGroups();
            groupSelect.innerHTML = groups
                .map(
                    (value_197) =>
                        '<option value="' +
                        escapeAttr(value_197) +
                        '">' +
                        escapeHtml(value_197) +
                        '</option>',
                )
                .join('');
            groupSelect.value = groups.includes(current_2) ? current_2 : groups[0];
        },
        renderBooks = () => {
            const selected = new Set(selectedBookIds.map(String)),
                books_4 = getBooksInGroup(groupSelect.value).filter(
                    (book_18) => !selected.has(String(book_18.id)),
                );
            bookSelect.disabled = books_4.length === 0;
            bookSelect.innerHTML = books_4.length
                ? '<option value="">选择要挂载的世界书</option>' +
                  books_4
                      .map(
                          (value_200) =>
                              '<option value="' +
                              escapeAttr(value_200.id) +
                              '">' +
                              escapeHtml(value_200.name || '未命名世界书') +
                              ' · +' +
                              getBookTokenCount(value_200) +
                              ' Tokens</option>',
                      )
                      .join('')
                : '<option value="">暂无可挂载世界书</option>';
            empty.textContent = books_4.length ? '' : '此文件夹没有可挂载的世界书';
        },
        renderMounted = () => {
            mountedCount.textContent = selectedBookIds.length + ' 项';
            mountedList.innerHTML = selectedBookIds.length
                ? selectedBookIds
                      .map((value_201) => {
                          const book_19 = getBook(value_201);
                          if (!book_19) return '';
                          return (
                              '<div class="wb-selector-mounted-card"><div class="wb-selector-mounted-icon"><i class="fas fa-book"></i></div><div class="wb-selector-mounted-info"><div class="wb-selector-mounted-name">' +
                              escapeHtml(book_19.name || '未命名世界书') +
                              '</div><div class="wb-selector-mounted-meta">' +
                              escapeHtml(normalizeGroupName(book_19.group)) +
                              ' · +' +
                              getBookTokenCount(book_19) +
                              ' Tokens</div></div><button type="button" class="wb-selector-remove-btn" data-id="' +
                              escapeAttr(value_201) +
                              '" aria-label="移除"><i class="fas fa-times"></i></button></div>'
                          );
                      })
                      .join('')
                : '<div class="wb-selector-mounted-empty">还没有挂载世界书</div>';
            mountedList.querySelectorAll('.wb-selector-remove-btn').forEach((button_2) =>
                button_2.addEventListener('click', () => {
                    selectedBookIds = selectedBookIds.filter(
                        (id_7) => String(id_7) !== String(button_2.dataset.id),
                    );
                    renderMounted();
                    renderBooks();
                }),
            );
        };
    selectedBookIds = (Array.isArray(selectedIds) ? selectedIds : [])
        .map(String)
        .filter((id_8, index_4, ids) => ids.indexOf(id_8) === index_4 && getBook(id_8));
    value_191();
    renderBooks();
    renderMounted();
    groupSelect.onchange = renderBooks;
    bookSelect.onchange = () => {
        bookSelect.value &&
            (selectedBookIds.push(String(bookSelect.value)), renderBooks(), renderMounted());
    };
    selector_2.querySelector('#wb-selector-cancel-btn').onclick = () =>
        window.closeView?.(selector_2);
    selector_2.querySelector('#wb-selector-confirm-btn').onclick = () => {
        window.closeView?.(selector_2);
        if (typeof onConfirm_3 === 'function') onConfirm_3([...selectedBookIds]);
    };
    window.openView?.(selector_2);
};
window.renderLegacyWorldBookSelector = window.renderWorldBookSelector;
window.autoSaveSummaryToWorldBook = function autoSaveSummaryToWorldBook(title_3, summaryText) {
    worldBooks.push({
        id: Date.now(),
        name: title_3 || '自动总结',
        group: WB_UNGROUPED,
        isGlobal: true,
        attachedRoles: [],
        entries: [
            {
                title: '总结内容',
                content: summaryText,
                keyword: '',
                triggerMode: 'permanent',
                injectionPosition: 'before_role',
                systemDepth: 4,
                order: 100,
                recursive: false,
                enabled: true,
            },
        ],
    });
    saveWorldBooksData();
    renderWorldBooks({
        force: true,
    });
    window.showToast?.('已自动生成全局世界书');
};
let wbSearchTimer = null;
const WB_SEARCH_DEBOUNCE_MS = 200;
function initializeWorldBookUi() {
    if (typeof UI !== 'undefined') UI.views.worldBook = getWbElement('world-book-view');
    window.mobileInputCompat?.registerFocusScope?.({
        selector: '#world-book-view',
        priority: 20,
        preferFocusScope: true,
        resolveScrollContainer(value_208, element_209) {
            return (
                element_209?.querySelector('#wb-files-editor-page.active .wb-editor-scroll') || null
            );
        },
        scrollBehavior: 'focus',
    });
    getWbElement('world-book-back-btn')?.addEventListener('click', () =>
        closeWbOverlay('world-book-view'),
    );
    getWbElement('wb-folder-add-btn')?.addEventListener('click', () => openGroupNameDialog());
    getWbElement('wb-folder-edit-btn')?.addEventListener('click', (event_10) => {
        wbFolderEditMode = !wbFolderEditMode;
        event_10.currentTarget.textContent = wbFolderEditMode ? '完成' : '编辑';
        renderWorldBooks({
            force: true,
        });
    });
    getWbElement('wb-main-add-book-btn')?.addEventListener('click', () => openBookModal());
    getWbElement('wb-group-back-btn')?.addEventListener('click', showWbMainPage);
    getWbElement('wb-group-add-book-btn')?.addEventListener('click', () =>
        openBookModal(null, activeWbGroupName),
    );
    getWbElement('wb-group-more-btn')?.addEventListener('click', toggleGroupMoreMenu);
    getWbElement('wb-editor-back-btn')?.addEventListener('click', requestCloseEditor);
    getWbElement('wb-editor-done-btn')?.addEventListener('click', finishEditor);
    getWbElement('add-book-entry-btn')?.addEventListener('click', addEntry);
    getWbElement('delete-world-book-btn')?.addEventListener('click', deleteCurrentBook);
    getWbElement('wb-editor-global-toggle')?.addEventListener('change', (event_11) => {
        draftIsGlobal = event_11.target.checked;
    });
    getWbElement('wb-group-name-cancel-btn')?.addEventListener('click', () =>
        closeWbOverlay('wb-group-name-overlay'),
    );
    getWbElement('wb-group-name-confirm-btn')?.addEventListener('click', saveGroupName);
    getWbElement('wb-group-name-input')?.addEventListener('keydown', (event_12) => {
        if (event_12.key === 'Enter') saveGroupName();
    });
    getWbElement('wb-import-file')?.addEventListener('change', async (event_13) => {
        const file_5 = event_13.target.files && event_13.target.files[0];
        await importWorldBookFile(file_5);
        event_13.target.value = '';
    });
    getWbElement('wb-search-input')?.addEventListener('input', (event_14) => {
        if (wbSearchTimer) clearTimeout(wbSearchTimer);
        wbSearchTimer = setTimeout(() => {
            wbSearchTimer = null;
            renderSearchResults(event_14.target.value);
        }, WB_SEARCH_DEBOUNCE_MS);
    });
    document.addEventListener('click', (event_15) => {
        const menu_2 = getWbElement('wb-group-more-menu');
        if (
            menu_2 &&
            !menu_2.hidden &&
            !menu_2.contains(event_15.target) &&
            !event_15.target.closest('#wb-group-more-btn')
        )
            menu_2.hidden = true;
    });
}
(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    window.StorageManager &&
        ((worldBooks = window.StorageManager.load('u2_worldBooks', [])),
        (wbGroups = window.StorageManager.load('u2_wbGroups', [])));
    normalizeGroups();
    renderWorldBooks({
        force: true,
    });
});
initializeWorldBookUi();
