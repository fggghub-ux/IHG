(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    const {
            openView: openView_3,
            closeView: closeView_2,
            showToast: showToast_2,
            userState: userState_2,
        } = window,
        chatSettingsSheet = document.getElementById('chat-settings-sheet'),
        npcChatSettingsSheet = document.getElementById('npc-chat-settings-sheet');
    // Resolve the modal at activation time; storage bootstrap may replace the fallback.
    function showCustomModal_2(options) {
        const show = window.imApp?.showCustomModal || window.showCustomModal;
        if (typeof show === 'function') return show(options);
    }
    window.mobileInputCompat?.registerFocusScope?.({
        selector: '#chat-location-profile-modal',
        priority: 20,
        preferFocusScope: true,
        resolveScrollContainer: (value_106, value_107) => value_107?.firstElementChild || null,
        scrollBehavior: 'focus',
    });
    window.imData.currentSettingsFriend = null;
    const bindWorldBookSheet = document.getElementById('bind-world-book-sheet'),
        bindWorldBookList = document.getElementById('bind-world-book-list'),
        confirmBindWorldBookBtn = document.getElementById('confirm-bind-world-book-btn'),
        worldBookBtn = document.getElementById('world-book-btn'),
        chatBindIdBtn = document.getElementById('chat-bind-id-btn'),
        chatBindIdLabel = document.getElementById('chat-bind-id-label'),
        bindAccountSheet = document.getElementById('bind-account-sheet'),
        bindAccountList = document.getElementById('bind-account-list'),
        bindAccountEmpty = document.getElementById('bind-account-empty'),
        confirmBindAccountBtn = document.getElementById('confirm-bind-account-btn'),
        bindAccountDetailSheet = document.getElementById('bind-account-detail-sheet'),
        bindAccountDetailSelect = document.getElementById('bind-account-detail-select'),
        bindAccountDetailEmpty = document.getElementById('bind-account-detail-empty'),
        bindAccountDetailForm = document.getElementById('bind-account-detail-form'),
        bindAccountDetailAvatarBtn = document.getElementById('bind-account-detail-avatar-btn'),
        bindAccountDetailAvatarUpload = document.getElementById(
            'bind-account-detail-avatar-upload',
        ),
        bindAccountDetailAvatarImg = document.getElementById('bind-account-detail-avatar-img'),
        bindAccountDetailAvatarIcon = document.getElementById('bind-account-detail-avatar-icon'),
        bindAccountDetailNameInput = document.getElementById('bind-account-detail-name-input'),
        bindAccountDetailPhoneInput = document.getElementById('bind-account-detail-phone-input'),
        bindAccountDetailSignatureInput = document.getElementById(
            'bind-account-detail-signature-input',
        ),
        bindAccountDetailPersonaInput = document.getElementById(
            'bind-account-detail-persona-input',
        ),
        bindAccountDetailSaveBtn = document.getElementById('bind-account-detail-save-btn');
    let tempSelectedBookIds = [],
        tempSelectedAccountId = null,
        bindAccountDetailAvatarUrl = null;
    const editCharPersonaSheetElement = document.getElementById('edit-char-persona-sheet'),
        relationshipSheet = document.getElementById('relationship-sheet'),
        relationshipBtn = document.getElementById('relationship-btn'),
        relationshipList = document.getElementById('relationship-list'),
        relationshipEmptyState = document.getElementById('relationship-empty-state'),
        relationshipPicker = document.getElementById('relationship-picker'),
        relationshipPickerList = document.getElementById('relationship-picker-list'),
        relationshipPickerFilters = document.getElementById('relationship-picker-filters'),
        relationshipSelectedCount = document.getElementById('relationship-selected-count'),
        relationshipTotalBadge = document.getElementById('relationship-total-badge'),
        confirmRelationshipBtn = document.getElementById('confirm-relationship-btn'),
        relationshipAddNpcBtn = document.getElementById('relationship-add-npc-btn'),
        chatCotSettingsSheet = document.getElementById('chat-cot-settings-sheet'),
        chatCotSettingsBtn = document.getElementById('chat-cot-settings-btn'),
        chatCotSettingsLabel = document.getElementById('chat-cot-settings-label'),
        chatCotEnabledToggle = document.getElementById('chat-cot-enabled-toggle'),
        chatCotPromptInput = document.getElementById('chat-cot-prompt-input'),
        resetChatCotPromptBtn = document.getElementById('reset-chat-cot-prompt-btn'),
        saveChatCotSettingsBtn = document.getElementById('save-chat-cot-settings-btn'),
        DEFAULT_SINGLE_CHAT_COT_PROMPT_2 = window.imApp.DEFAULT_SINGLE_CHAT_COT_PROMPT || '';
    let tempRelationshipDrafts = [],
        isRelationshipPickerVisible = false,
        relationshipPickerType = 'all',
        relationshipPreviewFrame = null,
        pendingRelationshipPreviewFriend = null;
    async function commitSettingsFriendChange(mutator, options_2 = {}) {
        const currentFriend = window.imData.currentSettingsFriend;
        if (!currentFriend) return false;
        return window.imApp.commitScopedFriendChange(currentFriend, mutator, {
            syncActive: false,
            syncSettings: true,
            metaOnly: options_2.metaOnly !== false,
            ...options_2,
        });
    }
    async function commitNamedFriendChange(friend_2, mutator_2, options_3 = {}) {
        if (!friend_2) return false;
        return window.imApp.commitScopedFriendChange(friend_2, mutator_2, {
            syncActive: false,
            syncSettings: true,
            metaOnly: options_3.metaOnly !== false,
            ...options_3,
        });
    }
    const chatBackgroundOperationTokens = new Map();
    function handleAction_7(friend_3) {
        if (friend_3?.id == null) return null;
        const friendId_2 = String(friend_3.id),
            token_2 = (chatBackgroundOperationTokens.get(friendId_2) || 0) + 1;
        return (
            chatBackgroundOperationTokens.set(friendId_2, token_2),
            {
                friendId: friendId_2,
                token: token_2,
            }
        );
    }
    function isLatestChatBackgroundOperation(operation_2) {
        return (
            !!operation_2 &&
            chatBackgroundOperationTokens.get(operation_2.friendId) === operation_2.token
        );
    }
    function getLatestChatBackgroundFriend(friend_4) {
        return window.imApp.getFriendById ? window.imApp.getFriendById(friend_4) : friend_4;
    }
    async function handleAction_8(file_2, friend_5) {
        if (!file_2 || !friend_5)
            return {
                status: 'ignored',
            };
        const handleAction_7_118 = handleAction_7(friend_5);
        if (!handleAction_7_118)
            return {
                status: 'ignored',
            };
        const bgUrl = window.imApp.compressImageFile
            ? await window.imApp.compressImageFile(file_2, {
                  maxWidth: 1440,
                  maxHeight: 1440,
                  mimeType: 'image/jpeg',
                  quality: 0.82,
              })
            : await window.imApp.readFileAsDataUrl(file_2);
        if (!isLatestChatBackgroundOperation(handleAction_7_118))
            return {
                status: 'superseded',
            };
        const saved_2 = await commitNamedFriendChange(
            friend_5,
            (targetFriend) => {
                targetFriend.chatBg = bgUrl;
                targetFriend.chatBgAssetId = null;
            },
            {
                silent: true,
            },
        );
        if (!isLatestChatBackgroundOperation(handleAction_7_118))
            return {
                status: 'superseded',
            };
        if (!saved_2)
            return {
                status: 'failed',
            };
        const friend_66 = getLatestChatBackgroundFriend(friend_5);
        return (
            applyFriendBg_2(friend_66),
            {
                status: 'saved',
                friend: friend_66,
            }
        );
    }
    async function handleAction_9(friend_6) {
        if (!friend_6)
            return {
                status: 'ignored',
            };
        const handleAction_7_121 = handleAction_7(friend_6);
        if (!handleAction_7_121)
            return {
                status: 'ignored',
            };
        const saved_3 = await commitNamedFriendChange(
            friend_6,
            (targetFriend_2) => {
                targetFriend_2.chatBg = null;
                targetFriend_2.chatBgAssetId = null;
            },
            {
                silent: true,
            },
        );
        if (!isLatestChatBackgroundOperation(handleAction_7_121))
            return {
                status: 'superseded',
            };
        if (!saved_3)
            return {
                status: 'failed',
            };
        const friend_67 = getLatestChatBackgroundFriend(friend_6);
        return (
            applyFriendBg_2(friend_67),
            {
                status: 'reset',
                friend: friend_67,
            }
        );
    }
    function updateStatusBarBtnCount_2() {
        return;
    }
    function getRelationshipTargetId(relation_2) {
        return String(relation_2?.targetId ?? relation_2?.npcId ?? '');
    }
    function getRelationshipTarget(relationOrId) {
        const targetId_2 =
            typeof relationOrId === 'object'
                ? getRelationshipTargetId(relationOrId)
                : String(relationOrId ?? '');
        return (
            (window.imData.friends || []).find(
                (item) =>
                    (item?.type === 'char' || item?.type === 'npc') &&
                    String(item.id) === targetId_2,
            ) || null
        );
    }
    function getRelationshipTypeLabel(target_2) {
        return target_2?.type === 'npc' ? 'NPC' : 'Char';
    }
    function getRelationshipFallbackIcon(target_3) {
        return target_3?.type === 'npc' ? 'fa-robot' : 'fa-user';
    }
    function escapeRelationshipHtml(value_6) {
        return String(value_6 ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    function getDraftRelationValue(targetId_3, friend_7) {
        const draftRelation = tempRelationshipDrafts.find(
                (rel_2) => getRelationshipTargetId(rel_2) === String(targetId_3),
            ),
            savedRelation = friend_7.memory.relationships.find(
                (rel_3) => getRelationshipTargetId(rel_3) === String(targetId_3),
            );
        if (draftRelation) return draftRelation.relation || '';
        return savedRelation ? savedRelation.relation || '' : '';
    }
    function scheduleRelationshipPreviewRender(friend_8) {
        if (!friend_8) return;
        pendingRelationshipPreviewFriend = friend_8;
        if (relationshipPreviewFrame !== null) return;
        relationshipPreviewFrame = window.requestAnimationFrame(() => {
            relationshipPreviewFrame = null;
            const pendingFriend = pendingRelationshipPreviewFriend;
            pendingRelationshipPreviewFriend = null;
            if (pendingFriend) renderRelationshipPreview(pendingFriend);
        });
    }
    function renderRelationshipList(friend_9) {
        if (!relationshipList || !relationshipEmptyState) return;
        friend_9.memory = friend_9.memory || window.imApp.createDefaultMemory();
        !Array.isArray(friend_9.memory.relationships) && (friend_9.memory.relationships = []);
        const items = tempRelationshipDrafts;
        relationshipList.innerHTML = '';
        relationshipEmptyState.innerHTML = '';
        relationshipEmptyState.style.display = 'none';
        const visibleRelations = items.filter((value_8) => !!getRelationshipTarget(value_8));
        if (relationshipSelectedCount)
            relationshipSelectedCount.textContent = String(visibleRelations.length);
        if (relationshipTotalBadge)
            relationshipTotalBadge.textContent = visibleRelations.length + ' 人';
        if (visibleRelations.length === 0) {
            relationshipList.style.display = 'none';
            relationshipEmptyState.style.display = 'block';
            relationshipEmptyState.innerHTML = `
                <div class="relationship-empty-icon"><i class="fas fa-user-group"></i></div>
                <div class="relationship-empty-title">还没有添加人物</div>
                <div class="relationship-empty-copy">可从已有 Char 或 NPC 中选择，为他们记录与当前 Char 的关系。</div>
            `;
            return;
        }
        relationshipList.style.display = 'flex';
        visibleRelations.forEach((rel_4) => {
            const relationshipTarget = getRelationshipTarget(rel_4);
            if (!relationshipTarget) return;
            const targetId_4 = String(relationshipTarget.id),
                item_2 = document.createElement('div');
            item_2.className = 'relationship-item';
            const value_10 = relationshipTarget.avatarUrl
                    ? '<img src="' +
                      escapeRelationshipHtml(relationshipTarget.avatarUrl) +
                      '" alt="">'
                    : '<i class="fas ' + getRelationshipFallbackIcon(relationshipTarget) + '"></i>',
                value_11 =
                    relationshipTarget.nickname || relationshipTarget.realName || '未命名人物',
                value_12 =
                    relationshipTarget.realName &&
                    relationshipTarget.realName !== relationshipTarget.nickname
                        ? relationshipTarget.realName
                        : relationshipTarget.signature ||
                          (relationshipTarget.type === 'npc' ? 'NPC 联系人' : 'Char 联系人');
            item_2.innerHTML =
                `
                <div class="relationship-avatar">` +
                value_10 +
                `</div>
                <div class="relationship-meta">
                    <div class="relationship-name-row">
                        <div class="relationship-name">` +
                escapeRelationshipHtml(value_11) +
                `</div>
                        <span class="relationship-type-badge ` +
                (relationshipTarget.type === 'npc' ? 'is-npc' : 'is-char') +
                '">' +
                getRelationshipTypeLabel(relationshipTarget) +
                `</span>
                    </div>
                    <div class="relationship-desc">` +
                escapeRelationshipHtml(value_12) +
                `</div>
                </div>
                <input class="relationship-input" data-target-id="` +
                escapeRelationshipHtml(targetId_4) +
                '" type="text" placeholder="例如：好友、同事" value="' +
                escapeRelationshipHtml(rel_4.relation || '') +
                `">
                <button type="button" class="relationship-delete-btn" aria-label="移除 ` +
                escapeRelationshipHtml(value_11) +
                `"><i class="fas fa-xmark"></i></button>
            `;
            const deleteBtn = item_2.querySelector('.relationship-delete-btn');
            deleteBtn &&
                deleteBtn.addEventListener('click', () => {
                    collectRelationshipDrafts();
                    tempRelationshipDrafts = tempRelationshipDrafts.filter(
                        (r) => getRelationshipTargetId(r) !== targetId_4,
                    );
                    relationshipList.innerHTML = '';
                    renderRelationshipList(friend_9);
                    renderRelationshipPreview(friend_9);
                    renderRelationshipPicker(friend_9);
                });
            const relInput = item_2.querySelector('.relationship-input');
            relInput &&
                relInput.addEventListener('input', () => {
                    collectRelationshipDrafts();
                    scheduleRelationshipPreviewRender(friend_9);
                });
            relationshipList.appendChild(item_2);
        });
    }
    function renderRelationshipPreview(value_144) {
        const previewArea = document.getElementById('relationship-preview-area'),
            canvas = document.getElementById('relationship-canvas'),
            nodesContainer = document.getElementById('relationship-nodes-container');
        if (!previewArea || !canvas || !nodesContainer) return;
        canvas.width = previewArea.clientWidth;
        canvas.height = previewArea.clientHeight;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        nodesContainer.innerHTML = '';
        const selectedRelations = tempRelationshipDrafts.filter(
            (value_153) => !!getRelationshipTarget(value_153),
        );
        if (selectedRelations.length === 0) {
            const value_154 = canvas.width / 2,
                value_155 = canvas.height / 2,
                element_156 = document.createElement('div');
            element_156.className = 'relationship-node main-node';
            element_156.style.left = value_154 - 25 + 'px';
            element_156.style.top = value_155 - 25 + 'px';
            const value_157 = value_144.avatarUrl
                ? '<img src="' + escapeRelationshipHtml(value_144.avatarUrl) + '" alt="">'
                : '<i class="fas fa-user"></i>';
            element_156.innerHTML =
                value_157 +
                '<div class="node-label">' +
                escapeRelationshipHtml(value_144.nickname || 'Char') +
                '</div>';
            nodesContainer.appendChild(element_156);
            return;
        }
        const value_147 = canvas.width / 2,
            value_148 = canvas.height / 2,
            element_149 = document.createElement('div');
        element_149.className = 'relationship-node main-node';
        element_149.style.left = value_147 - 25 + 'px';
        element_149.style.top = value_148 - 25 + 'px';
        const value_150 = value_144.avatarUrl
            ? '<img src="' + escapeRelationshipHtml(value_144.avatarUrl) + '" alt="">'
            : '<i class="fas fa-user"></i>';
        element_149.innerHTML =
            value_150 +
            '<div class="node-label">' +
            escapeRelationshipHtml(value_144.nickname || 'Char') +
            '</div>';
        nodesContainer.appendChild(element_149);
        const radius = Math.max(72, Math.min(canvas.width, canvas.height) * 0.34),
            angleStep = (Math.PI * 2) / selectedRelations.length;
        ctx.strokeStyle = 'rgba(88, 86, 214, 0.28)';
        ctx.lineWidth = 2;
        selectedRelations.forEach((rel_5, index_2) => {
            const target_4 = getRelationshipTarget(rel_5);
            if (!target_4) return;
            const angle = index_2 * angleStep - Math.PI / 2,
                offsetX_2 = radius * Math.cos(angle),
                offsetY_2 = radius * Math.sin(angle),
                value_164 = value_147 + offsetX_2,
                value_165 = value_148 + offsetY_2;
            ctx.beginPath();
            ctx.moveTo(value_147, value_148);
            ctx.lineTo(value_164, value_165);
            ctx.stroke();
            if (rel_5.relation) {
                const value_168 = value_147 + offsetX_2 * 0.5,
                    value_169 = value_148 + offsetY_2 * 0.5;
                ctx.font = '11px sans-serif';
                const metrics = ctx.measureText(rel_5.relation),
                    textWidth = metrics.width,
                    textHeight = 18;
                let textAngle = Math.atan2(offsetY_2, offsetX_2);
                (textAngle > Math.PI / 2 || textAngle < -Math.PI / 2) && (textAngle += Math.PI);
                ctx.save();
                ctx.translate(value_168, value_169);
                ctx.rotate(textAngle);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
                ctx.beginPath();
                ctx.roundRect(-textWidth / 2 - 7, -textHeight / 2, textWidth + 14, textHeight, 8);
                ctx.fill();
                ctx.fillStyle = '#3f3f46';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(rel_5.relation, 0, 0);
                ctx.restore();
            }
            const element_166 = document.createElement('div');
            element_166.className =
                'relationship-node ' + (target_4.type === 'npc' ? 'npc-node' : 'char-node');
            element_166.style.left = value_164 - 20 + 'px';
            element_166.style.top = value_165 - 20 + 'px';
            const value_167 = target_4.avatarUrl
                ? '<img src="' + escapeRelationshipHtml(target_4.avatarUrl) + '" alt="">'
                : '<i class="fas ' + getRelationshipFallbackIcon(target_4) + '"></i>';
            element_166.innerHTML =
                value_167 +
                '<div class="node-label">' +
                escapeRelationshipHtml(target_4.nickname || target_4.realName || '人物') +
                '</div>';
            nodesContainer.appendChild(element_166);
        });
    }
    function renderRelationshipPicker(friend_10) {
        if (!relationshipPicker || !relationshipPickerList) return;
        const allPeople = (window.imData.friends || []).filter(
                (item_3) =>
                    (item_3.type === 'char' || item_3.type === 'npc') &&
                    String(item_3.id) !== String(friend_10.id),
            ),
            selectedTargetIds = new Set(tempRelationshipDrafts.map(getRelationshipTargetId));
        relationshipPickerList.innerHTML = '';
        const availablePeople = allPeople.filter(
            (person) =>
                !selectedTargetIds.has(String(person.id)) &&
                (relationshipPickerType === 'all' || person.type === relationshipPickerType),
        );
        if (!isRelationshipPickerVisible) {
            relationshipPicker.style.display = 'none';
            return;
        }
        relationshipPicker.style.display = 'block';
        relationshipPicker.querySelectorAll('.relationship-filter-btn').forEach((button) => {
            button.classList.toggle('active', button.dataset.type === relationshipPickerType);
        });
        if (availablePeople.length === 0) {
            const typeText =
                relationshipPickerType === 'char'
                    ? 'Char'
                    : relationshipPickerType === 'npc'
                      ? 'NPC'
                      : '人物';
            relationshipPickerList.innerHTML =
                '<div class="relationship-picker-empty">暂无可添加的' + typeText + '</div>';
            return;
        }
        availablePeople.forEach((target_5) => {
            const item_4 = document.createElement('div');
            item_4.className = 'relationship-item relationship-picker-item';
            const value_17 = target_5.avatarUrl
                    ? '<img src="' + escapeRelationshipHtml(target_5.avatarUrl) + '" alt="">'
                    : '<i class="fas ' + getRelationshipFallbackIcon(target_5) + '"></i>',
                value_182 = target_5.nickname || target_5.realName || '未命名人物',
                value_18 =
                    target_5.realName && target_5.realName !== target_5.nickname
                        ? target_5.realName
                        : target_5.signature ||
                          (target_5.type === 'npc' ? 'NPC 联系人' : 'Char 联系人');
            item_4.innerHTML =
                `
                <div class="relationship-avatar">` +
                value_17 +
                `</div>
                <div class="relationship-meta">
                    <div class="relationship-name-row">
                        <div class="relationship-name">` +
                escapeRelationshipHtml(value_182) +
                `</div>
                        <span class="relationship-type-badge ` +
                (target_5.type === 'npc' ? 'is-npc' : 'is-char') +
                '">' +
                getRelationshipTypeLabel(target_5) +
                `</span>
                    </div>
                    <div class="relationship-desc">` +
                escapeRelationshipHtml(value_18) +
                `</div>
                </div>
                <span class="relationship-picker-add"><i class="fas fa-plus"></i></span>
            `;
            item_4.addEventListener('click', () => {
                collectRelationshipDrafts();
                !tempRelationshipDrafts.some(
                    (rel) => getRelationshipTargetId(rel) === String(target_5.id),
                ) &&
                    tempRelationshipDrafts.push({
                        npcId: String(target_5.id),
                        targetType: target_5.type,
                        relation: getDraftRelationValue(target_5.id, friend_10),
                    });
                renderRelationshipList(friend_10);
                renderRelationshipPicker(friend_10);
                renderRelationshipPreview(friend_10);
                showToast_2('已添加' + getRelationshipTypeLabel(target_5) + '：' + value_182);
            });
            relationshipPickerList.appendChild(item_4);
        });
    }
    function renderRelationshipSheet_2(friend_11) {
        if (!relationshipList || !relationshipEmptyState) return;
        friend_11.memory = friend_11.memory || window.imApp.createDefaultMemory();
        !Array.isArray(friend_11.memory.relationships) && (friend_11.memory.relationships = []);
        relationshipSheet &&
            relationshipSheet.style.display === 'none' &&
            tempRelationshipDrafts.length === 0 &&
            (tempRelationshipDrafts = friend_11.memory.relationships.map((rel_6) => ({
                npcId: getRelationshipTargetId(rel_6),
                targetType: rel_6.targetType || getRelationshipTarget(rel_6)?.type,
                relation: rel_6.relation || '',
                offsetX: rel_6.offsetX,
                offsetY: rel_6.offsetY,
            })));
        renderRelationshipList(friend_11);
        renderRelationshipPicker(friend_11);
        setTimeout(() => renderRelationshipPreview(friend_11), 150);
    }
    function collectRelationshipDrafts() {
        if (!relationshipList) return;
        const inputs = relationshipList.querySelectorAll('.relationship-input'),
            currentValues = Array.from(inputs).map((input) => {
                const targetId_5 = input.getAttribute('data-target-id'),
                    existingRel = tempRelationshipDrafts.find(
                        (r_2) => getRelationshipTargetId(r_2) === targetId_5,
                    ),
                    target_6 = getRelationshipTarget(targetId_5);
                return {
                    npcId: targetId_5,
                    targetType: target_6?.type || existingRel?.targetType,
                    relation: input.value.trim(),
                    offsetX: existingRel ? existingRel.offsetX : undefined,
                    offsetY: existingRel ? existingRel.offsetY : undefined,
                };
            }),
            existingIds = new Set(currentValues.map(getRelationshipTargetId)),
            hiddenDrafts = tempRelationshipDrafts.filter(
                (item_5) => !existingIds.has(getRelationshipTargetId(item_5)),
            );
        tempRelationshipDrafts = [...currentValues, ...hiddenDrafts];
    }
    function getAvailableAccounts() {
        return typeof window.getAccounts === 'function' ? window.getAccounts() : [];
    }
    function getBoundAccountByFriend_2(friend_12) {
        if (!friend_12 || !friend_12.boundAccountId) return null;
        const accounts = getAvailableAccounts();
        return accounts.find((acc) => String(acc.id) === String(friend_12.boundAccountId)) || null;
    }
    function getEffectivePersonaForFriend_3(friend_13) {
        const boundAccount = getBoundAccountByFriend_2(friend_13);
        if (!boundAccount) return userState_2.persona || '';
        return boundAccount.signature || boundAccount.persona || '';
    }
    function getFriendsBoundToAccount_2(value_196) {
        const allFriends = Array.isArray(window.imData?.friends) ? window.imData.friends : [];
        return allFriends.filter(
            (friend_14) =>
                friend_14 &&
                friend_14.type !== 'group' &&
                friend_14.type !== 'official' &&
                String(friend_14.boundAccountId || '') === String(value_196),
        );
    }
    function updateChatBindIdLabel_2(friend_15) {
        if (!chatBindIdLabel) return;
        const boundAccount_2 = getBoundAccountByFriend_2(friend_15);
        chatBindIdLabel.textContent = boundAccount_2 ? boundAccount_2.name || '已绑定' : '';
    }
    function renderBindAccountList(friend_16) {
        if (!bindAccountList || !bindAccountEmpty) return;
        const accounts_2 = getAvailableAccounts();
        bindAccountList.innerHTML = '';
        const options_4 = [
            {
                id: null,
                name: '不绑定',
                phone: '恢复为当前 Apple ID 默认人设',
                persona: '',
            },
            ...accounts_2,
        ];
        if (options_4.length === 1) {
            bindAccountList.style.display = 'none';
            bindAccountEmpty.style.display = 'block';
            return;
        }
        bindAccountList.style.display = 'flex';
        bindAccountEmpty.style.display = 'none';
        options_4.forEach((acc_2) => {
            const isSelected = String(tempSelectedAccountId || '') === String(acc_2.id || ''),
                personaText =
                    acc_2.id == null
                        ? '聊天时将继续读取当前 Apple ID 人设'
                        : acc_2.signature || acc_2.persona || '该 ID 暂无人设',
                item_6 = document.createElement('div');
            item_6.className = 'account-card';
            item_6.style.padding = '10px 14px';
            item_6.style.height = 'auto';
            item_6.style.cursor = 'pointer';
            item_6.style.borderRadius = '999px';
            item_6.style.border = isSelected ? '2px solid #007aff' : '1px solid #e5e5ea';
            item_6.style.boxShadow = '0 1px 6px rgba(0,0,0,0.04)';
            item_6.style.background = '#fff';
            item_6.innerHTML =
                `
                <div style="display:flex; align-items:center; gap:10px; width:100%;">
                    <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
                        <div style="width:34px; height:34px; border-radius:999px; background:` +
                (acc_2.id == null ? '#8e8e93' : '#34c759') +
                `; color:#fff; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0;">
                            <i class="fas ` +
                (acc_2.id == null ? 'fa-ban' : 'fa-id-card') +
                `"></i>
                        </div>
                        <div style="min-width:0; flex:1;">
                            <div style="font-size:14px; font-weight:600; color:#000; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">` +
                (acc_2.name || '未命名ID') +
                `</div>
                            <div style="font-size:11px; color:#8e8e93; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">` +
                (acc_2.phone || personaText) +
                `</div>
                            <div style="font-size:11px; color:#666; margin-top:2px; line-height:1.35; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">` +
                personaText +
                `</div>
                        </div>
                    </div>
                    <div style="margin-left:auto; width:20px; height:20px; border-radius:50%; border:1px solid ` +
                (isSelected ? '#007aff' : '#c7c7cc') +
                '; background:' +
                (isSelected ? '#007aff' : 'transparent') +
                `; display:flex; align-items:center; justify-content:center; color:#fff; font-size:11px; flex-shrink:0;">
                        ` +
                (isSelected ? '<i class="fas fa-check"></i>' : '') +
                `
                    </div>
                </div>
            `;
            item_6.addEventListener('click', () => {
                tempSelectedAccountId = acc_2.id == null ? null : acc_2.id;
                renderBindAccountList(friend_16);
            });
            bindAccountList.appendChild(item_6);
        });
    }
    async function persistProfileStatusMigration(friend_17) {
        if (
            !friend_17 ||
            friend_17.type === 'group' ||
            !window.imApp.migrateSingleChatProfileStatus
        )
            return true;
        const changed = window.imApp.migrateSingleChatProfileStatus(friend_17);
        if (!changed && !friend_17._profileStatusNeedsPersistence) return true;
        return commitNamedFriendChange(
            friend_17,
            (targetFriend_3) => {
                window.imApp.migrateSingleChatProfileStatus(targetFriend_3);
                delete targetFriend_3._profileStatusNeedsPersistence;
            },
            {
                silent: true,
            },
        );
    }
    function renderChatCotSettings(friend_18) {
        if (!friend_18) return;
        window.imApp.refreshOnlinePromptSettingsLabel?.(friend_18);
        if (chatCotSettingsBtn)
            chatCotSettingsBtn.style.display = friend_18.type === 'group' ? 'none' : 'flex';
        if (friend_18.type === 'group') return;
        const checked_2 = friend_18.cotEnabled === true;
        if (chatCotEnabledToggle) chatCotEnabledToggle.checked = checked_2;
        if (chatCotPromptInput) {
            const savedPrompt =
                typeof friend_18.cotPrompt === 'string' ? friend_18.cotPrompt.trim() : '';
            chatCotPromptInput.value = savedPrompt || DEFAULT_SINGLE_CHAT_COT_PROMPT_2;
        }
        if (chatCotSettingsLabel) chatCotSettingsLabel.textContent = checked_2 ? '开启' : '关闭';
    }
    function getIdentityNames(identity = {}) {
        return Array.from(
            new Set(
                [identity.nickname, identity.realName]
                    .map((value_2) => String(value_2 || '').trim())
                    .filter(Boolean),
            ),
        );
    }
    async function migrateGroupMemberIdentityReferences(
        memberId_2,
        previousIdentity = {},
        nextIdentity = {},
    ) {
        const previousNames = new Set(getIdentityNames(previousIdentity)),
            previousAvatarUrl = String(previousIdentity.avatarUrl || '').trim(),
            value_216 =
                String(nextIdentity.nickname || nextIdentity.realName || '群成员').trim() ||
                '群成员',
            nextAvatarUrl = nextIdentity.avatarUrl || '',
            groups = (window.imData.friends || []).filter((group_2) => {
                if (!group_2 || group_2.type !== 'group' || !Array.isArray(group_2.members))
                    return false;
                return group_2.members.some(
                    (memberRef) =>
                        String(memberRef) === String(memberId_2) ||
                        previousNames.has(String(memberRef || '').trim()),
                );
            }),
            changedGroupIds = [];
        for (const group_3 of groups) {
            window.imApp.ensureFriendMessagesLoaded &&
                (await window.imApp.ensureFriendMessagesLoaded(group_3));
            const avatarIsUnique =
                !!previousAvatarUrl &&
                !(window.imChat?.getGroupMemberFriends
                    ? window.imChat
                          .getGroupMemberFriends(group_3)
                          .some(
                              (member) =>
                                  String(member.id) !== String(memberId_2) &&
                                  String(member.avatarUrl || '').trim() === previousAvatarUrl,
                          )
                    : false);
            let changed_2 = false;
            const saved_4 = await window.imApp.commitFriendChange(
                group_3.id,
                (targetGroup) => {
                    if (!targetGroup) return;
                    targetGroup.members = (targetGroup.members || []).map((memberRef_2) => {
                        if (
                            String(memberRef_2) === String(memberId_2) ||
                            previousNames.has(String(memberRef_2 || '').trim())
                        ) {
                            if (String(memberRef_2) !== String(memberId_2)) changed_2 = true;
                            return memberId_2;
                        }
                        return memberRef_2;
                    });
                    (targetGroup.messages || []).forEach((message_2) => {
                        if (!message_2 || message_2.role === 'user') return;
                        const storedMemberId =
                                message_2.speakerMemberId ?? message_2.senderMemberId ?? null,
                            storedNames = [message_2.speaker, message_2.senderName]
                                .map((value_3) => String(value_3 || '').trim())
                                .filter(Boolean),
                            matchesId =
                                storedMemberId != null &&
                                String(storedMemberId) === String(memberId_2),
                            matchesLegacyName =
                                storedMemberId == null &&
                                storedNames.some((name_2) => previousNames.has(name_2)),
                            matchesLegacyAvatar =
                                storedMemberId == null &&
                                avatarIsUnique &&
                                String(message_2.senderAvatarUrl || '').trim() ===
                                    previousAvatarUrl;
                        if (!matchesId && !matchesLegacyName && !matchesLegacyAvatar) return;
                        message_2.speakerMemberId = memberId_2;
                        message_2.speaker = value_216;
                        (message_2.senderName ||
                            message_2.type === 'group_red_packet' ||
                            message_2.type === 'pay_transfer') &&
                            (message_2.senderName = value_216);
                        (nextAvatarUrl || message_2.senderAvatarUrl) &&
                            (message_2.senderAvatarUrl =
                                nextAvatarUrl || message_2.senderAvatarUrl || '');
                        changed_2 = true;
                    });
                },
                {
                    silent: true,
                    metaOnly: false,
                },
            );
            if (saved_4 && changed_2) changedGroupIds.push(String(group_3.id));
        }
        return (
            changedGroupIds.forEach((groupId_2) => {
                const group_4 = (window.imData.friends || []).find(
                        (item_7) => String(item_7.id) === groupId_2,
                    ),
                    elementById = document.getElementById('chat-interface-' + groupId_2),
                    insChatMessagesElement = elementById?.querySelector('.ins-chat-messages');
                group_4 &&
                    insChatMessagesElement &&
                    window.imChat?.rerenderChatContainer &&
                    window.imChat.rerenderChatContainer(group_4, insChatMessagesElement, {
                        scroll: false,
                    });
            }),
            changedGroupIds
        );
    }
    function setBindAccountDetailAvatar(url_2) {
        bindAccountDetailAvatarUrl = url_2 || null;
        bindAccountDetailAvatarImg &&
            ((bindAccountDetailAvatarImg.src = bindAccountDetailAvatarUrl || ''),
            (bindAccountDetailAvatarImg.style.display = bindAccountDetailAvatarUrl
                ? 'block'
                : 'none'));
        bindAccountDetailAvatarIcon &&
            (bindAccountDetailAvatarIcon.style.display = bindAccountDetailAvatarUrl
                ? 'none'
                : 'block');
    }
    function getAccountById(accountId) {
        if (!accountId || accountId === 'none') return null;
        return (
            getAvailableAccounts().find((acc_3) => String(acc_3.id) === String(accountId)) || null
        );
    }
    function renderBindAccountDetailSelect(friend_19) {
        if (!bindAccountDetailSelect) return;
        const accounts_3 = getAvailableAccounts();
        bindAccountDetailSelect.innerHTML = '<option value="none">不绑定</option>';
        accounts_3.forEach((acc_4) => {
            const option = document.createElement('option');
            option.value = acc_4.id;
            option.textContent = acc_4.name || '未命名ID';
            bindAccountDetailSelect.appendChild(option);
        });
        const selectedAccount = getBoundAccountByFriend_2(friend_19);
        bindAccountDetailSelect.value = selectedAccount ? String(selectedAccount.id) : 'none';
    }
    function renderBindAccountDetailForm(friend_20) {
        const selectedAccountId = bindAccountDetailSelect
                ? bindAccountDetailSelect.value
                : friend_20?.boundAccountId || 'none',
            account = getAccountById(selectedAccountId),
            hasAccounts = getAvailableAccounts().length > 0;
        if (!account) {
            if (bindAccountDetailForm) bindAccountDetailForm.style.display = 'none';
            bindAccountDetailEmpty &&
                ((bindAccountDetailEmpty.style.display = 'block'),
                (bindAccountDetailEmpty.textContent = hasAccounts
                    ? '当前未绑定 ID，选择一个 ID 后可快捷编辑资料'
                    : '暂无可用 ID，请先在系统设置的 Apple ID 中创建账号'));
            if (bindAccountDetailSaveBtn) bindAccountDetailSaveBtn.style.display = 'none';
            setBindAccountDetailAvatar(null);
            return;
        }
        if (bindAccountDetailEmpty) bindAccountDetailEmpty.style.display = 'none';
        if (bindAccountDetailForm) bindAccountDetailForm.style.display = 'block';
        if (bindAccountDetailSaveBtn) bindAccountDetailSaveBtn.style.display = 'flex';
        if (bindAccountDetailNameInput) bindAccountDetailNameInput.value = account.name || '';
        if (bindAccountDetailPhoneInput) bindAccountDetailPhoneInput.value = account.phone || '';
        if (bindAccountDetailSignatureInput)
            bindAccountDetailSignatureInput.value = account.signature || '';
        if (bindAccountDetailPersonaInput)
            bindAccountDetailPersonaInput.value = account.persona || '';
        setBindAccountDetailAvatar(account.avatarUrl || null);
    }
    function openBindAccountDetailSheet(friend_21) {
        if (!friend_21 || !bindAccountDetailSheet) return;
        renderBindAccountDetailSelect(friend_21);
        renderBindAccountDetailForm(friend_21);
        openView_3(bindAccountDetailSheet);
    }
    async function handleAction_20(nextBoundAccountId) {
        const currentFriend_2 = window.imData.currentSettingsFriend;
        if (!currentFriend_2) return false;
        const boundAccountId_4 =
                nextBoundAccountId && nextBoundAccountId !== 'none' ? nextBoundAccountId : null,
            value_250 = await commitSettingsFriendChange(
                (value_251) => {
                    value_251.boundAccountId = boundAccountId_4;
                },
                {
                    silent: true,
                },
            );
        if (!value_250) return (showToast_2('角色绑定ID保存失败'), false);
        updateChatBindIdLabel_2(window.imData.currentSettingsFriend);
        if (window.updateBindRoleEntryPoints) window.updateBindRoleEntryPoints();
        return (
            refreshChatPageForFriend(window.imData.currentSettingsFriend),
            window.dispatchEvent(
                new CustomEvent('u2:friend-account-binding-changed', {
                    detail: {
                        friendId: String(window.imData.currentSettingsFriend.id),
                    },
                }),
            ),
            true
        );
    }
    function refreshChatPageForFriend(friendOrId) {
        const friend_22 = window.imApp.getFriendById
            ? window.imApp.getFriendById(friendOrId)
            : friendOrId;
        if (!friend_22) return false;
        let refreshed = false;
        const elementById_255 = document.getElementById('chat-interface-' + friend_22.id),
            insChatMessagesElement_256 = elementById_255?.querySelector('.ins-chat-messages');
        return (
            insChatMessagesElement_256 &&
                window.imChat?.rerenderChatContainer &&
                (window.imChat.rerenderChatContainer(friend_22, insChatMessagesElement_256, {
                    scroll: false,
                }),
                (refreshed = true)),
            window.imChat?.refreshOfflineUserIdentity &&
                (refreshed = window.imChat.refreshOfflineUserIdentity(friend_22) || refreshed),
            refreshed
        );
    }
    function refreshChatPagesBoundToAccount(accountId_2) {
        if (!accountId_2) return;
        getFriendsBoundToAccount_2(accountId_2).forEach((friend_23) => {
            refreshChatPageForFriend(friend_23);
        });
    }
    let count_21 = 0,
        count_22 = 0,
        count_23 = 0,
        text_24 = '';
    const value_25 = new Set();
    function handleAction_26() {
        if (count_22) cancelAnimationFrame(count_22);
        if (count_23) cancelAnimationFrame(count_23);
        count_22 = 0;
        count_23 = 0;
    }
    chatSettingsSheet &&
        typeof MutationObserver === 'function' &&
        new MutationObserver(() => {
            if (chatSettingsSheet.classList.contains('active')) return;
            count_21 += 1;
            handleAction_26();
            chatSettingsSheet
                .querySelectorAll('.char-settings-panel.is-hydrating')
                .forEach((element_259) => {
                    element_259.classList.remove('is-hydrating');
                    element_259.removeAttribute('aria-busy');
                });
        }).observe(chatSettingsSheet, {
            attributes: true,
            attributeFilter: ['class'],
        });
    function handleAction_27(friend_24) {
        const friendData = window.imApp.normalizeFriendData(friend_24);
        friend_24.memory = friendData.memory;
        const chatMemoryOverviewInput = document.getElementById('chat-memory-overview-input'),
            chatMemoryContextEnabledToggleElement = document.getElementById(
                'chat-memory-context-enabled-toggle',
            ),
            chatMemoryContextLimit = document.getElementById('chat-memory-context-limit-input'),
            chatMemoryScheduleSleepInputElement = document.getElementById(
                'chat-memory-schedule-sleep-input',
            ),
            chatMemoryScheduleWakeInputElement = document.getElementById(
                'chat-memory-schedule-wake-input',
            );
        if (chatMemoryOverviewInput)
            chatMemoryOverviewInput.value = friend_24.memory.overview || '';
        if (chatMemoryContextEnabledToggleElement)
            chatMemoryContextEnabledToggleElement.checked =
                friend_24.memory.context.enabled !== false;
        if (chatMemoryContextLimit)
            chatMemoryContextLimit.value = friend_24.memory.context.limit || 50;
        if (chatMemoryScheduleSleepInputElement)
            chatMemoryScheduleSleepInputElement.value =
                friend_24.memory.schedule?.sleepTime || '23:00';
        if (chatMemoryScheduleWakeInputElement)
            chatMemoryScheduleWakeInputElement.value =
                friend_24.memory.schedule?.wakeTime || '07:00';
        handleAction_49();
        handleAction_58(friend_24);
        handleAction_31();
        handleAction_36();
        renderChatMemoryOverviewStats(friend_24, friendData);
    }
    function handleAction_28(value_261, element_262) {
        handleAction_26();
        if (value_261 !== 'memory') return;
        const friend_25 = window.imData.currentSettingsFriend;
        if (!friend_25 || !element_262) return;
        const value_264 = count_21,
            string_265 = String(friend_25.id),
            value_266 = text_24 !== string_265 || !value_25.has(value_261);
        if (!value_266) return;
        element_262.classList.add('is-hydrating');
        element_262.setAttribute('aria-busy', 'true');
        count_22 = requestAnimationFrame(() => {
            count_22 = 0;
            count_23 = requestAnimationFrame(() => {
                count_23 = 0;
                if (
                    value_264 !== count_21 ||
                    !chatSettingsSheet?.classList.contains('active') ||
                    String(window.imData.currentSettingsFriend?.id) !== string_265 ||
                    !element_262.classList.contains('active')
                )
                    return;
                try {
                    handleAction_27(friend_25);
                    text_24 = string_265;
                    value_25.add(value_261);
                } finally {
                    element_262.classList.remove('is-hydrating');
                    element_262.removeAttribute('aria-busy');
                }
            });
        });
    }
    function setActiveChatSettingsTab(tabName) {
        const tabs = document.querySelectorAll('#chat-settings-segment .char-settings-tab'),
            panels = document.querySelectorAll('#chat-settings-sheet .char-settings-panel');
        let value_267 = null;
        const elementById_268 = document.getElementById('chat-settings-' + tabName + '-panel');
        if (elementById_268) elementById_268.scrollTop = 0;
        tabs.forEach((tab) => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });
        panels.forEach((panel) => {
            const isActivePanel = panel.id === 'chat-settings-' + tabName + '-panel';
            panel.classList.toggle('active', isActivePanel);
            isActivePanel
                ? (value_267 = panel)
                : (panel.classList.remove('is-hydrating'), panel.removeAttribute('aria-busy'));
        });
        handleAction_28(tabName, value_267);
    }
    function handleAction_29(value_271) {
        const value_272 = window.imApp.getLastChatApiUsage
                ? window.imApp.getLastChatApiUsage(value_271)
                : null,
            value_273 = (value_274) =>
                Number.isFinite(Number(value_274))
                    ? Math.max(0, Math.round(Number(value_274))).toLocaleString()
                    : '';
        if (!value_272)
            return {
                value: '暂未实测',
            };
        if (value_272.totalTokens != null)
            return {
                value: value_273(value_272.totalTokens) + ' TK',
            };
        if (value_272.inputTokens != null)
            return {
                value: '输入 ' + value_273(value_272.inputTokens) + ' TK',
            };
        if (value_272.outputTokens != null)
            return {
                value: '输出 ' + value_273(value_272.outputTokens) + ' TK',
            };
        return {
            value: '未返回总量',
        };
    }
    function handleAction_2(value_23) {
        const handleAction_29_24 = handleAction_29(value_23);
        return (
            `
            <div style="background: #ffffff; border: 1px solid #ececf2; border-radius: 12px; padding: 10px; text-align: center;">
                <div style="font-size: 11px; color: #8e8e93; margin-bottom: 4px;">最近一次 API 实测</div>
                <div style="font-size: 13px; font-weight: 700; color: #111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">` +
            handleAction_29_24.value +
            `</div>
            </div>
        `
        );
    }
    function renderChatMemoryOverviewStats(value_277, normalizedFriend = null) {
        const statsContainer = document.getElementById('chat-memory-overview-stats');
        if (!statsContainer) return;
        normalizedFriend = normalizedFriend || window.imApp.normalizeFriendData(value_277);
        const memory_2 = normalizedFriend.memory || window.imApp.createDefaultMemory(),
            value_280 = window.imApp.getFriendMessageCount
                ? window.imApp.getFriendMessageCount(value_277)
                : Number(normalizedFriend.messageCount) ||
                  (Array.isArray(normalizedFriend.messages) ? normalizedFriend.messages.length : 0),
            shortTermEntries_2 = Array.isArray(memory_2.shortTermEntries)
                ? memory_2.shortTermEntries
                : [],
            longTermEntries_2 = [
                ...(Array.isArray(memory_2.longTermEntries) ? memory_2.longTermEntries : []),
                ...(Array.isArray(memory_2.cherishedEntries) ? memory_2.cherishedEntries : []),
            ],
            xDirectMessageMount_2 = window.imApp.normalizeXDirectMessageMount
                ? window.imApp.normalizeXDirectMessageMount(memory_2.xDirectMessageMount)
                : {
                      enabled: true,
                      limit: 10,
                      dmId: '',
                  },
            schedule_2 = memory_2.schedule || {},
            groupContextCandidates = window.imApp.getEligibleGroupChatMemoryContexts
                ? window.imApp.getEligibleGroupChatMemoryContexts(normalizedFriend)
                : [];
        let now_35 = Date.now(),
            now_287 = Date.now();
        value_280 > 0 &&
            normalizedFriend.messages.length > 0 &&
            ((now_35 = normalizedFriend.messages[0].timestamp || Date.now()),
            (now_287 =
                normalizedFriend.lastMessageTimestamp ||
                normalizedFriend.messages[normalizedFriend.messages.length - 1]?.timestamp ||
                Date.now()));
        const max_37 = Math.max(1, Math.ceil((Date.now() - now_35) / 86400000)),
            value_38 = window.imApp.formatTime
                ? window.imApp.formatTime(now_287)
                : new Date(now_287).toLocaleString();
        statsContainer.innerHTML =
            `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                <div style="background: #ffffff; border: 1px solid #ececf2; border-radius: 12px; padding: 10px; text-align: center;">
                    <div style="font-size: 11px; color: #8e8e93; margin-bottom: 4px;">聊天总数</div>
                    <div style="font-size: 16px; font-weight: 700; color: #111;">` +
            value_280 +
            `</div>
                </div>
                <div style="background: #ffffff; border: 1px solid #ececf2; border-radius: 12px; padding: 10px; text-align: center;">
                    <div style="font-size: 11px; color: #8e8e93; margin-bottom: 4px;">建联天数</div>
                    <div style="font-size: 16px; font-weight: 700; color: #111;">` +
            max_37 +
            `</div>
                </div>
                ` +
            handleAction_2(normalizedFriend) +
            `
                <div style="background: #ffffff; border: 1px solid #ececf2; border-radius: 12px; padding: 10px; text-align: center;">
                    <div style="font-size: 11px; color: #8e8e93; margin-bottom: 4px;">最后聊天</div>
                    <div style="font-size: 13px; font-weight: 700; color: #111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">` +
            (value_280 > 0 ? value_38 : '无') +
            `</div>
                </div>
            </div>
        `;
        const setCountText = (value_291, value_292) => {
            const elementById_293 = document.getElementById(value_291);
            if (elementById_293)
                elementById_293.textContent = value_292 > 0 ? value_292 + '项' : '';
        };
        setCountText('chat-memory-shortterm-count', shortTermEntries_2.length);
        setCountText('chat-memory-group-context-count', groupContextCandidates.length);
        setCountText('chat-memory-longterm-count', longTermEntries_2.length);
        const xDmContextStatus = document.getElementById('chat-memory-x-dm-context-count');
        if (xDmContextStatus) {
            const hasMatchingXDirectMessage =
                    xDirectMessageMount_2.dmId ||
                    Boolean(
                        window.imApp.getXDirectMessageMountCandidates?.(normalizedFriend)?.length,
                    ),
                value_295 = hasMatchingXDirectMessage
                    ? xDirectMessageMount_2.enabled
                        ? xDirectMessageMount_2.limit + '条/类'
                        : '关闭'
                    : '',
                bstagePopMount_296 = window.imApp.normalizeBstagePopMount?.(
                    memory_2.bstagePopMount,
                ),
                mountedBstagePopMember = window.imApp.getMountedBstagePopMember?.(normalizedFriend),
                value_297 =
                    bstagePopMount_296?.teamId && bstagePopMount_296?.memberId
                        ? mountedBstagePopMember
                            ? bstagePopMount_296.enabled
                                ? 'POP已开启'
                                : 'POP已关闭'
                            : 'POP关联失效'
                        : '';
            xDmContextStatus.textContent = [value_295, value_297].filter(Boolean).join(' · ');
        }
        const scheduleStatus = document.getElementById('chat-memory-schedule-status');
        scheduleStatus && (scheduleStatus.textContent = schedule_2.enabled ? '开启' : '关闭');
    }
    window.addEventListener('u2:memory-entries-updated', (event_2) => {
        const friend_26 = window.imData.currentSettingsFriend;
        if (!friend_26 || String(event_2.detail?.friendId || '') !== String(friend_26.id)) return;
        const currentSettingsFriend_10 = window.imApp.getFriendById?.(friend_26.id) || friend_26;
        window.imData.currentSettingsFriend = currentSettingsFriend_10;
        renderChatMemoryOverviewStats(currentSettingsFriend_10);
    });
    window.addEventListener('u2:chat-api-usage-updated', (event_3) => {
        const friend_27 = window.imData.currentSettingsFriend;
        if (!friend_27 || String(event_3.detail?.friendId || '') !== String(friend_27.id)) return;
        const currentSettingsFriend_11 = window.imApp.getFriendById?.(friend_27.id) || friend_27;
        window.imData.currentSettingsFriend = currentSettingsFriend_11;
        renderChatMemoryOverviewStats(currentSettingsFriend_11);
    });
    function handleAction_31() {
        const memoryPanel = document.getElementById('chat-settings-memory-panel'),
            modalRoot = chatSettingsSheet || memoryPanel;
        if (!modalRoot) return null;
        let overlay_2 = document.getElementById('chat-memory-modal-overlay');
        if (!overlay_2) {
            overlay_2 = document.createElement('div');
            overlay_2.id = 'chat-memory-modal-overlay';
            overlay_2.className = 'chat-memory-modal-overlay';
            overlay_2.style.display = 'none';
            overlay_2.innerHTML = `
                <div class="chat-memory-modal-card">
                    <button type="button" class="chat-memory-modal-close" aria-label="关闭">
                        <i class="fas fa-times"></i>
                    </button>
                    <div id="chat-memory-modal-label" class="chat-memory-modal-label">记忆</div>
                    <div id="chat-memory-modal-title" class="chat-memory-modal-title">记忆内容</div>
                    <div id="chat-memory-modal-subtitle" class="chat-memory-modal-subtitle"></div>
                    <div id="chat-memory-modal-content" class="chat-memory-modal-content"></div>
                </div>
            `;
            modalRoot.appendChild(overlay_2);
            overlay_2.addEventListener('click', (event_51) => {
                event_51.target === overlay_2 && hideChatMemoryModal_2();
            });
            const closeBtn = overlay_2.querySelector('.chat-memory-modal-close');
            closeBtn &&
                closeBtn.addEventListener('click', (event_52) => {
                    event_52.stopPropagation();
                    hideChatMemoryModal_2();
                });
        }
        return {
            overlay: overlay_2,
            labelEl: document.getElementById('chat-memory-modal-label'),
            titleEl: document.getElementById('chat-memory-modal-title'),
            subtitleEl: document.getElementById('chat-memory-modal-subtitle'),
            contentEl: document.getElementById('chat-memory-modal-content'),
        };
    }
    function hideChatMemoryModal_2() {
        const chatMemoryModalOverlayElement_306 = document.getElementById(
            'chat-memory-modal-overlay',
        );
        if (!chatMemoryModalOverlayElement_306) return;
        chatMemoryModalOverlayElement_306.classList.remove('active');
        setTimeout(() => {
            !chatMemoryModalOverlayElement_306.classList.contains('active') &&
                (chatMemoryModalOverlayElement_306.style.display = 'none');
        }, 220);
    }
    function buildTextMemoryModalHtml(value_53, content_2, value_309) {
        const safeContent = String(content_2 || '').trim();
        if (!safeContent) return '<div class="chat-memory-modal-empty">' + value_309 + '</div>';
        return (
            `
            <div class="chat-memory-modal-text-block">
                ` +
            safeContent +
            `
            </div>
        `
        );
    }
    function showChatMemoryModal_2(type_2, value_58) {
        const ui = handleAction_31();
        if (!ui || !value_58) return;
        const friendData_313 = window.imApp.normalizeFriendData(value_58),
            memory_3 = friendData_313.memory || window.imApp.createDefaultMemory(),
            typeMap = {
                schedule: {
                    label: '角色记忆',
                    title: '作息时间',
                },
                overview: {
                    label: '角色记忆',
                    title: '总览',
                    subtitle: '记录整体印象、关系概括与近期变化',
                    emptyText: '这里还没有记录总览内容。',
                },
                longterm: {
                    label: '角色记忆',
                    title: '长期记忆',
                    subtitle: '记录长期稳定的重要设定、偏好与关系事实',
                    emptyText: '这里还没有记录长期记忆内容。',
                },
                cherished: {
                    label: '角色记忆',
                    title: '珍视回忆',
                    subtitle: '收纳那些值得被记住的时刻',
                    emptyText: '这里还没有珍视回忆。',
                },
            },
            currentConfig = typeMap[type_2] || typeMap.overview;
        ui.labelEl.textContent = currentConfig.label;
        ui.titleEl.textContent = currentConfig.title;
        ui.subtitleEl.textContent = currentConfig.subtitle || '';
        ui.subtitleEl.style.display = currentConfig.subtitle ? 'block' : 'none';
        if (type_2 === 'schedule')
            ui.contentEl.innerHTML = `
                <div class="chat-memory-modal-text-block">作息时间设置请直接在面板开关调整。</div>
            `;
        else {
            if (type_2 === 'cherished') {
                const entries_2 = Array.isArray(memory_3.cherishedEntries)
                    ? memory_3.cherishedEntries
                    : [];
                if (entries_2.length > 0) {
                    ui.contentEl.innerHTML =
                        `
                    <div class="chat-memory-modal-cherished-list">
                        ` +
                        entries_2
                            .map(
                                (value_63) =>
                                    `
                            <button type="button" class="chat-memory-modal-cherished-card" data-entry-id="` +
                                    value_63.id +
                                    `">
                                <div class="chat-memory-modal-cherished-card-title">` +
                                    (value_63.title || '珍视回忆') +
                                    `</div>
                                <div class="chat-memory-modal-cherished-card-time">` +
                                    (value_63.createdAt || '点击查看详情') +
                                    `</div>
                            </button>
                        `,
                            )
                            .join('') +
                        `
                    </div>
                `;
                    const chatMemoryModalCherishedCardElements = ui.contentEl.querySelectorAll(
                        '.chat-memory-modal-cherished-card',
                    );
                    chatMemoryModalCherishedCardElements.forEach((value_319) => {
                        value_319.addEventListener('click', () => {
                            const value_320 = value_319.getAttribute('data-entry-id') || '',
                                latestFriend_2 =
                                    window.imData.currentSettingsFriend &&
                                    String(window.imData.currentSettingsFriend.id) ===
                                        String(friendData_313.id)
                                        ? window.imData.currentSettingsFriend
                                        : friendData_313,
                                latestEntries = Array.isArray(
                                    latestFriend_2.memory?.cherishedEntries,
                                )
                                    ? latestFriend_2.memory.cherishedEntries
                                    : [],
                                result_323 = latestEntries.find(
                                    (value_324) => String(value_324.id) === String(value_320),
                                );
                            result_323 && showCherishedMemoryDetail_2(result_323);
                        });
                    });
                } else
                    ui.contentEl.innerHTML = buildTextMemoryModalHtml(
                        '珍视回忆',
                        memory_3.cherished,
                        currentConfig.emptyText,
                    );
            } else {
                if (type_2 === 'overview') {
                    const value_325 = Array.isArray(friendData_313.messages)
                        ? friendData_313.messages.length
                        : 0;
                    let now_65 = Date.now(),
                        now_327 = Date.now();
                    value_325 > 0 &&
                        ((now_65 = friendData_313.messages[0].timestamp || Date.now()),
                        (now_327 = friendData_313.messages[value_325 - 1].timestamp || Date.now()));
                    const max_67 = Math.max(1, Math.ceil((Date.now() - now_65) / 86400000)),
                        value_68 = window.imApp.formatTime
                            ? window.imApp.formatTime(now_327)
                            : new Date(now_327).toLocaleString(),
                        statsHtml =
                            `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                    <div style="background: #ffffff; border: 1px solid #ececf2; border-radius: 12px; padding: 10px; text-align: center;">
                        <div style="font-size: 11px; color: #8e8e93; margin-bottom: 4px;">聊天总数</div>
                        <div style="font-size: 16px; font-weight: 700; color: #111;">` +
                            value_325 +
                            `</div>
                    </div>
                    <div style="background: #ffffff; border: 1px solid #ececf2; border-radius: 12px; padding: 10px; text-align: center;">
                        <div style="font-size: 11px; color: #8e8e93; margin-bottom: 4px;">建联天数</div>
                        <div style="font-size: 16px; font-weight: 700; color: #111;">` +
                            max_67 +
                            `</div>
                    </div>
                    ` +
                            handleAction_2(friendData_313) +
                            `
                    <div style="background: #ffffff; border: 1px solid #ececf2; border-radius: 12px; padding: 10px; text-align: center;">
                        <div style="font-size: 11px; color: #8e8e93; margin-bottom: 4px;">最后聊天</div>
                        <div style="font-size: 13px; font-weight: 700; color: #111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">` +
                            (value_325 > 0 ? value_68 : '无') +
                            `</div>
                    </div>
                </div>
            `;
                    ui.contentEl.innerHTML =
                        statsHtml +
                        buildTextMemoryModalHtml(
                            '总览',
                            memory_3.overview,
                            currentConfig.emptyText,
                        );
                } else {
                    const entries_3 = Array.isArray(memory_3.longTermEntries)
                        ? memory_3.longTermEntries
                        : [];
                    if (entries_3.length > 0) {
                        ui.contentEl.innerHTML =
                            `
                    <div class="chat-memory-modal-cherished-list">
                        ` +
                            entries_3
                                .map(
                                    (value_72) =>
                                        `
                            <button type="button" class="chat-memory-modal-cherished-card" data-entry-id="` +
                                        value_72.id +
                                        `">
                                <div class="chat-memory-modal-cherished-card-title">` +
                                        (value_72.title || '长期记忆') +
                                        `</div>
                                <div class="chat-memory-modal-cherished-card-time">` +
                                        (value_72.time || '点击查看详情') +
                                        `</div>
                            </button>
                        `,
                                )
                                .join('') +
                            `
                    </div>
                `;
                        const chatMemoryModalCherishedCardElements_332 =
                            ui.contentEl.querySelectorAll('.chat-memory-modal-cherished-card');
                        chatMemoryModalCherishedCardElements_332.forEach((value_334) => {
                            value_334.addEventListener('click', () => {
                                const value_335 = value_334.getAttribute('data-entry-id') || '',
                                    latestFriend_3 =
                                        window.imData.currentSettingsFriend &&
                                        String(window.imData.currentSettingsFriend.id) ===
                                            String(friendData_313.id)
                                            ? window.imData.currentSettingsFriend
                                            : friendData_313,
                                    latestEntries_2 = Array.isArray(
                                        latestFriend_3.memory?.longTermEntries,
                                    )
                                        ? latestFriend_3.memory.longTermEntries
                                        : [],
                                    targetEntry = latestEntries_2.find(
                                        (value_339) => String(value_339.id) === String(value_335),
                                    );
                                targetEntry &&
                                    showCherishedMemoryDetail_2({
                                        title: targetEntry.title,
                                        createdAt: targetEntry.time,
                                        content: targetEntry.content,
                                    });
                            });
                        });
                    } else
                        ui.contentEl.innerHTML = buildTextMemoryModalHtml(
                            '长期记忆',
                            memory_3.longTerm,
                            currentConfig.emptyText,
                        );
                }
            }
        }
        ui.overlay.style.display = 'flex';
        requestAnimationFrame(() => {
            ui.overlay.classList.add('active');
        });
    }
    function handleAction_35(value_73) {
        return String(value_73 ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    function getGroupChatMemoryContexts(friend_28) {
        const memory_4 = window.imApp.normalizeFriendData(friend_28 || {}).memory || {};
        return window.imDataUtils?.normalizeGroupChatContexts
            ? window.imDataUtils.normalizeGroupChatContexts(memory_4.groupChatContexts)
            : [];
    }
    function getGroupChatMemoryMessages(group_5, messageLimit_2 = 30) {
        const messages_2 = Array.isArray(group_5?.messages) ? group_5.messages : [];
        return window.imDataUtils?.getRecentPublicGroupMessages
            ? window.imDataUtils.getRecentPublicGroupMessages(messages_2, messageLimit_2)
            : {
                  selectedMessages: messages_2
                      .filter(
                          (message_3) =>
                              message_3?.noticeKind !== 'group_private_to_user' &&
                              message_3?.noticeKind !== 'group_friend_private_chat',
                      )
                      .slice(-messageLimit_2),
              };
    }
    async function saveGroupChatMemoryContexts(friend_29, contexts) {
        if (!friend_29) return false;
        const candidates = window.imApp.getGroupChatMemoryCandidates
                ? window.imApp.getGroupChatMemoryCandidates(friend_29)
                : [],
            candidateIds = new Set(candidates.map((group_6) => String(group_6.id))),
            normalizedContexts = (
                window.imDataUtils?.normalizeGroupChatContexts
                    ? window.imDataUtils.normalizeGroupChatContexts(contexts)
                    : []
            ).filter((context_2) => candidateIds.has(String(context_2.groupId))),
            saved_5 = await commitNamedFriendChange(
                friend_29,
                (targetFriend_4) => {
                    targetFriend_4.memory =
                        targetFriend_4.memory || window.imApp.createDefaultMemory();
                    targetFriend_4.memory.groupChatContexts = normalizedContexts;
                },
                {
                    silent: true,
                    metaOnly: false,
                    includeMessages: false,
                    syncActive: true,
                },
            );
        if (
            saved_5 &&
            window.imData.currentSettingsFriend &&
            String(window.imData.currentSettingsFriend.id) === String(friend_29.id)
        ) {
            const latest = window.imApp.getFriendById(friend_29.id);
            if (latest) window.imData.currentSettingsFriend = latest;
        }
        return saved_5;
    }
    function showGroupChatMemoryPicker(friend_30) {
        const ui_2 = handleAction_31();
        if (!ui_2 || !friend_30) return;
        const candidates_2 = window.imApp.getGroupChatMemoryCandidates
                ? window.imApp.getGroupChatMemoryCandidates(friend_30)
                : [],
            draftContexts = new Map(
                getGroupChatMemoryContexts(friend_30).map((context_3) => [
                    String(context_3.groupId),
                    {
                        ...context_3,
                    },
                ]),
            );
        ui_2.labelEl.textContent = '角色记忆';
        ui_2.titleEl.textContent = '群聊记忆';
        ui_2.subtitleEl.textContent = '单聊时会读取角色所在群聊最新公开聊天记录。';
        ui_2.subtitleEl.style.display = 'block';
        const renderPicker = () => {
            if (candidates_2.length === 0) {
                ui_2.contentEl.innerHTML =
                    '<div class="chat-memory-modal-empty">该角色暂未加入可读取的群聊</div>';
                return;
            }
            const selectedGroups = candidates_2.filter((group_7) =>
                    draftContexts.has(String(group_7.id)),
                ),
                filter_362 = candidates_2.filter(
                    (value_77) => !draftContexts.has(String(value_77.id)),
                );
            ui_2.contentEl.innerHTML =
                `
                <div class="chat-memory-modal-plain-note">选择群聊</div>
                <select class="chat-memory-group-picker-select" ` +
                (filter_362.length === 0 ? 'disabled' : '') +
                `>
                    <option value="">` +
                (filter_362.length > 0 ? '选择群聊' : '没有更多可添加的群聊') +
                `</option>
                    ` +
                filter_362
                    .map((value_365) => {
                        const string_366 = String(value_365.id),
                            value_367 = value_365.nickname || value_365.realName || '未命名群聊';
                        return (
                            '<option value="' +
                            handleAction_35(string_366) +
                            '">' +
                            handleAction_35(value_367) +
                            '</option>'
                        );
                    })
                    .join('') +
                `
                </select>
                <div class="chat-memory-modal-plain-note">已加入群聊记忆</div>
                <div class="chat-memory-group-picker-list">
                    ` +
                (selectedGroups.length > 0
                    ? selectedGroups
                          .map((value_78) => {
                              const groupId_3 = String(value_78.id),
                                  context_4 = draftContexts.get(groupId_3) || {
                                      groupId: groupId_3,
                                      messageLimit: 30,
                                  },
                                  value_80 = value_78.nickname || value_78.realName || '未命名群聊';
                              return (
                                  `
                            <div class="chat-memory-group-context-item" data-selected-group-id="` +
                                  handleAction_35(groupId_3) +
                                  `">
                                <div class="chat-memory-group-context-icon"><i class="fas fa-users"></i></div>
                                <div class="chat-memory-group-context-main">
                                    <div class="chat-memory-group-context-name">` +
                                  handleAction_35(value_80) +
                                  `</div>
                                    <div class="chat-memory-group-context-meta">读取最近 ` +
                                  context_4.messageLimit +
                                  ` 条公开消息</div>
                                </div>
                                <input class="chat-memory-group-context-limit-input" type="number" min="1" max="999" value="` +
                                  context_4.messageLimit +
                                  `" aria-label="读取消息条数">
                                <button type="button" class="chat-memory-group-context-remove" aria-label="移除群聊记忆" title="移除群聊记忆"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        `
                              );
                          })
                          .join('')
                    : '<div class="chat-memory-modal-empty">暂未加入群聊记忆</div>') +
                `
                </div>
                <button type="button" class="chat-memory-group-picker-save">保存</button>
            `;
            const groupSelect = ui_2.contentEl.querySelector('.chat-memory-group-picker-select');
            groupSelect &&
                groupSelect.addEventListener('change', () => {
                    const groupId_4 = groupSelect.value;
                    if (!groupId_4) return;
                    groupSelect.disabled = true;
                    const liveGroup =
                        window.imApp.getFriendById(groupId_4) ||
                        candidates_2.find((group_8) => String(group_8.id) === String(groupId_4));
                    if (!liveGroup) {
                        renderPicker();
                        return;
                    }
                    draftContexts.set(groupId_4, {
                        groupId: groupId_4,
                        messageLimit: 30,
                    });
                    renderPicker();
                });
            ui_2.contentEl
                .querySelectorAll('.chat-memory-group-context-limit-input')
                .forEach((input_2) => {
                    const updateMessageLimit = (normalizeValue = false) => {
                        const item_8 = input_2.closest('[data-selected-group-id]'),
                            groupId_5 = item_8?.getAttribute('data-selected-group-id') || '',
                            context_5 = draftContexts.get(groupId_5),
                            numericValue = Number(input_2.value);
                        if (!context_5) return;
                        if (normalizeValue)
                            context_5.messageLimit = window.imDataUtils?.normalizeMessageLimit
                                ? window.imDataUtils.normalizeMessageLimit(numericValue, 30)
                                : Math.min(999, Math.max(1, Math.round(numericValue) || 30));
                        else {
                            if (Number.isFinite(numericValue) && numericValue >= 1)
                                context_5.messageLimit = numericValue;
                            else return;
                        }
                        if (normalizeValue) input_2.value = context_5.messageLimit;
                        const meta = item_8?.querySelector('.chat-memory-group-context-meta');
                        if (meta)
                            meta.textContent = '读取最近 ' + context_5.messageLimit + ' 条公开消息';
                    };
                    input_2.addEventListener('input', () => updateMessageLimit(false));
                    input_2.addEventListener('change', () => updateMessageLimit(true));
                });
            ui_2.contentEl
                .querySelectorAll('.chat-memory-group-context-remove')
                .forEach((value_380) => {
                    value_380.addEventListener('click', () => {
                        const closest_381 = value_380.closest('[data-selected-group-id]');
                        draftContexts['delete'](
                            closest_381?.getAttribute('data-selected-group-id') || '',
                        );
                        renderPicker();
                    });
                });
            const saveButton = ui_2.contentEl.querySelector('.chat-memory-group-picker-save');
            saveButton &&
                saveButton.addEventListener('click', async () => {
                    const saved = await saveGroupChatMemoryContexts(
                        friend_30,
                        Array.from(draftContexts.values()),
                    );
                    if (!saved) {
                        if (window.showToast) window.showToast('群聊记忆保存失败');
                        return;
                    }
                    const latestFriend_4 = window.imApp.getFriendById(friend_30.id) || friend_30;
                    renderChatMemoryOverviewStats(latestFriend_4);
                    hideChatMemoryModal_2();
                });
        };
        renderPicker();
        ui_2.overlay.style.display = 'flex';
        requestAnimationFrame(() => ui_2.overlay.classList.add('active'));
    }
    function handleAction_36() {
        const panelNames = ['overview', 'longterm', 'cherished'],
            getCurrentFriend = () =>
                window.imData.currentSettingsFriend || window.imData.currentActiveFriend || null;
        panelNames.forEach((panelName) => {
            const btn_2 = document.getElementById('chat-memory-' + panelName + '-btn');
            if (!btn_2 || btn_2.dataset.memoryPanelBound === 'true') return;
            btn_2.dataset.memoryPanelBound = 'true';
            btn_2.addEventListener('click', () => {
                const currentFriend_3 = getCurrentFriend();
                if (!currentFriend_3) return;
                showChatMemoryModal_2(panelName, currentFriend_3);
            });
        });
        const bindMemoryLocationButton = (id_2, location) => {
            const btn = document.getElementById(id_2);
            if (!btn || btn.dataset.memoryPanelBound === 'true') return;
            btn.dataset.memoryPanelBound = 'true';
            btn.addEventListener('click', () => {
                const currentFriend_4 = getCurrentFriend();
                if (!currentFriend_4) return;
                if (
                    !window.imApp.openMemoryLocationForFriend ||
                    !window.imApp.openMemoryLocationForFriend(currentFriend_4, location)
                ) {
                    if (window.showToast) window.showToast('记忆功能暂不可用');
                }
            });
        };
        bindMemoryLocationButton('chat-memory-shortterm-btn', 'iphone');
        bindMemoryLocationButton('chat-memory-longterm-library-btn', 'downloads');
        bindMemoryLocationButton('chat-memory-x-dm-context-btn', 'x-dm');
        const groupContextBtn = document.getElementById('chat-memory-group-context-btn');
        groupContextBtn &&
            groupContextBtn.dataset.memoryPanelBound !== 'true' &&
            ((groupContextBtn.dataset.memoryPanelBound = 'true'),
            groupContextBtn.addEventListener('click', () => {
                const currentFriend_5 = getCurrentFriend();
                if (currentFriend_5) showGroupChatMemoryPicker(currentFriend_5);
            }));
        const scheduleBtn = document.getElementById('chat-memory-schedule-entry-btn');
        scheduleBtn &&
            scheduleBtn.dataset.memoryPanelBound !== 'true' &&
            ((scheduleBtn.dataset.memoryPanelBound = 'true'),
            scheduleBtn.addEventListener('click', () => {
                const currentFriend_6 = getCurrentFriend();
                if (!currentFriend_6) return;
                if (
                    !window.imApp.openMemoryScheduleForFriend ||
                    !window.imApp.openMemoryScheduleForFriend(currentFriend_6)
                ) {
                    if (window.showToast) window.showToast('日程作息暂不可用');
                }
            }));
    }
    function handleAction_37() {
        const segmentTabs = document.querySelectorAll('#chat-settings-segment .char-settings-tab');
        segmentTabs.forEach((tab_2) => {
            if (tab_2.dataset.bound === 'true') return;
            tab_2.dataset.bound = 'true';
            tab_2.addEventListener('click', () => {
                setActiveChatSettingsTab(tab_2.getAttribute('data-tab'));
            });
        });
        handleAction_41();
    }
    function handleAction_38(value_393) {
        return window.imDataUtils?.normalizeLocationProfile
            ? window.imDataUtils.normalizeLocationProfile(value_393?.locationProfile)
            : {
                  char: {
                      country: '',
                      city: '',
                      timeZone: '',
                  },
                  user: {
                      country: '',
                      city: '',
                      timeZone: '',
                  },
                  timeDifferenceEnabled: false,
                  weatherAwareEnabled: false,
                  longDistanceEnabled: false,
              };
    }
    function handleAction_39(value_394) {
        const handleAction_38_395 = handleAction_38(value_394),
            chatLocationProfileLabelElement = document.getElementById(
                'chat-location-profile-label',
            ),
            chatLocationProfileBtnElement = document.getElementById('chat-location-profile-btn'),
            isCustomLanguage = !!value_394 && value_394.type === 'char';
        if (chatLocationProfileBtnElement)
            chatLocationProfileBtnElement.style.display = isCustomLanguage ? 'flex' : 'none';
        const value_397 = !!(
            handleAction_38_395.char.country &&
            handleAction_38_395.char.city &&
            handleAction_38_395.char.timeZone &&
            handleAction_38_395.user.country &&
            handleAction_38_395.user.city &&
            handleAction_38_395.user.timeZone
        );
        chatLocationProfileLabelElement &&
            (chatLocationProfileLabelElement.textContent = value_397
                ? handleAction_38_395.char.city +
                  ' · ' +
                  handleAction_38_395.user.city +
                  (handleAction_38_395.timeDifferenceEnabled ? ' · 时差开' : '') +
                  (handleAction_38_395.weatherAwareEnabled ? ' · 天气开' : '') +
                  (handleAction_38_395.longDistanceEnabled ? ' · 异地开' : '')
                : '未设置');
    }
    function handleAction_40(value_86) {
        if (!value_86 || value_86.type !== 'char') return;
        document.getElementById('chat-location-profile-modal')?.remove();
        const handleAction_38_399 = handleAction_38(value_86),
            items_400 = window.imDataUtils?.getSupportedTimeZones?.() || [],
            value_401 = (value_406) =>
                String(value_406 == null ? '' : value_406)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;'),
            element_402 = document.createElement('div');
        element_402.id = 'chat-location-profile-modal';
        element_402.style.cssText =
            'position:absolute;inset:0;z-index:80;background:rgba(0,0,0,.38);display:flex;align-items:flex-end;justify-content:center;';
        const value_403 = (value_407) =>
                ['<option value="">请选择时区</option>']
                    .concat(
                        items_400.map(
                            (value_408) =>
                                '<option value="' +
                                value_401(value_408) +
                                '"' +
                                (value_408 === value_407 ? ' selected' : '') +
                                '>' +
                                value_401(value_408) +
                                '</option>',
                        ),
                    )
                    .join(''),
            value_404 = (value_90, value_91, value_93) =>
                `
            <section style="padding:14px;border-radius:18px;background:#eeeeef;display:flex;flex-direction:column;gap:10px;">
                <strong style="font-size:15px;color:#252525;">` +
                value_91 +
                `</strong>
                <input data-location-field="` +
                value_90 +
                '-country" maxlength="80" value="' +
                value_401(value_93.country) +
                `" placeholder="国家，例如：中国" style="height:42px;border:1px solid #d1d1d1;border-radius:12px;background:#fafafa;color:#252525;padding:0 12px;font-size:15px;outline:none;box-sizing:border-box;">
                <input data-location-field="` +
                value_90 +
                '-city" maxlength="80" value="' +
                value_401(value_93.city) +
                `" placeholder="城市，例如：上海" style="height:42px;border:1px solid #d1d1d1;border-radius:12px;background:#fafafa;color:#252525;padding:0 12px;font-size:15px;outline:none;box-sizing:border-box;">
                <select data-location-field="` +
                value_90 +
                '-timezone" style="height:42px;border:1px solid #d1d1d1;border-radius:12px;background:#fafafa;color:#252525;padding:0 10px;font-size:14px;outline:none;box-sizing:border-box;">' +
                value_403(value_93.timeZone) +
                `</select>
            </section>`;
        element_402.innerHTML =
            `
            <div style="width:100%;max-height:88%;overflow-y:auto;background:#f7f7f7;border-radius:24px 24px 0 0;padding:10px 16px calc(18px + env(safe-area-inset-bottom));box-sizing:border-box;">
                <div style="width:38px;height:5px;border-radius:99px;background:#bdbdbd;margin:0 auto 12px;"></div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                    <button type="button" data-location-action="cancel" style="border:0;background:transparent;color:#777;font-size:16px;padding:6px;">取消</button>
                    <strong style="font-size:18px;">定位与时区</strong>
                    <button type="button" data-location-action="save" style="border:0;background:transparent;color:#222;font-size:16px;font-weight:800;padding:6px;">保存</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:12px;">
                    ` +
            value_404('char', 'Char 所在地', handleAction_38_399.char) +
            `
                    ` +
            value_404('user', 'User 所在地', handleAction_38_399.user) +
            `
                    <div style="min-height:54px;padding:0 14px;border-radius:16px;background:#e7e7e8;display:flex;align-items:center;gap:12px;">
                        <div style="flex:1;min-width:0;">
                            <strong style="display:block;color:#252525;font-size:15px;">时差感知</strong>
                            <span style="display:block;margin-top:2px;color:#777;font-size:12px;">开启后，AI 上下文按 Char 当地时间换算</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" class="location-profile-time-difference-toggle"` +
            (handleAction_38_399.timeDifferenceEnabled ? ' checked' : '') +
            `>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div style="min-height:54px;padding:0 14px;border-radius:16px;background:#e7e7e8;display:flex;align-items:center;gap:12px;">
                        <div style="flex:1;min-width:0;"><strong style="display:block;color:#252525;font-size:15px;">天气感知</strong><span style="display:block;margin-top:2px;color:#777;font-size:12px;">将双方城市实时天气提供给 Char</span></div>
                        <label class="toggle-switch"><input type="checkbox" class="location-profile-weather-toggle"` +
            (handleAction_38_399.weatherAwareEnabled ? ' checked' : '') +
            `><span class="slider"></span></label>
                    </div>
                    <div style="min-height:54px;padding:0 14px;border-radius:16px;background:#e7e7e8;display:flex;align-items:center;gap:12px;">
                        <div style="flex:1;min-width:0;"><strong style="display:block;color:#252525;font-size:15px;">异地模式</strong><span style="display:block;margin-top:2px;color:#777;font-size:12px;">明确告诉 Char 你们处于异地</span></div>
                        <label class="toggle-switch"><input type="checkbox" class="location-profile-long-distance-toggle"` +
            (handleAction_38_399.longDistanceEnabled ? ' checked' : '') +
            `><span class="slider"></span></label>
                    </div>
                </div>
            </div>`;
        chatSettingsSheet.appendChild(element_402);
        const value_405 = () => element_402.remove();
        element_402.addEventListener('click', (event_412) => {
            if (
                event_412.target === element_402 ||
                event_412.target.closest('[data-location-action="cancel"]')
            )
                value_405();
        });
        ['char', 'user'].forEach((value_413) => {
            const el = element_402.querySelector(
                    '[data-location-field="' + value_413 + '-country"]',
                ),
                el_2 = element_402.querySelector('[data-location-field="' + value_413 + '-city"]'),
                chatCotPromptInput_2 = element_402.querySelector(
                    '[data-location-field="' + value_413 + '-timezone"]',
                ),
                value_417 = () => {
                    const value_4 =
                        window.imDataUtils?.resolveLocationTimeZone?.(el.value, el_2.value) || '';
                    if (
                        value_4 &&
                        Array.from(chatCotPromptInput_2.options).some(
                            (value_419) => value_419.value === value_4,
                        )
                    )
                        chatCotPromptInput_2.value = value_4;
                    else {
                        if (!value_4) chatCotPromptInput_2.value = '';
                    }
                };
            el.addEventListener('change', value_417);
            el_2.addEventListener('change', value_417);
            el_2.addEventListener('blur', value_417);
        });
        element_402
            .querySelector('[data-location-action="save"]')
            ?.addEventListener('click', async () => {
                const value_420 = (value_425) => ({
                        country:
                            element_402.querySelector(
                                '[data-location-field="' + value_425 + '-country"]',
                            )?.value || '',
                        city:
                            element_402.querySelector(
                                '[data-location-field="' + value_425 + '-city"]',
                            )?.value || '',
                        timeZone:
                            element_402.querySelector(
                                '[data-location-field="' + value_425 + '-timezone"]',
                            )?.value || '',
                    }),
                    locationProfile_2 = window.imDataUtils?.normalizeLocationProfile?.({
                        char: value_420('char'),
                        user: value_420('user'),
                        timeDifferenceEnabled:
                            element_402.querySelector('.location-profile-time-difference-toggle')
                                ?.checked === true,
                        weatherAwareEnabled:
                            element_402.querySelector('.location-profile-weather-toggle')
                                ?.checked === true,
                        longDistanceEnabled:
                            element_402.querySelector('.location-profile-long-distance-toggle')
                                ?.checked === true,
                    }),
                    value_422 = !!(
                        locationProfile_2?.char?.country &&
                        locationProfile_2.char.city &&
                        locationProfile_2.char.timeZone &&
                        locationProfile_2?.user?.country &&
                        locationProfile_2.user.city &&
                        locationProfile_2.user.timeZone
                    );
                if (!value_422) {
                    showToast_2('请完整填写双方国家、城市并选择有效时区');
                    return;
                }
                const value_423 = await commitSettingsFriendChange(
                    (value_426) => {
                        value_426.locationProfile = locationProfile_2;
                        if (locationProfile_2.timeDifferenceEnabled) value_426.timeAware = true;
                    },
                    {
                        silent: true,
                        metaOnly: false,
                    },
                );
                if (!value_423) {
                    showToast_2('定位设置保存失败');
                    return;
                }
                const value_97 = window.imApp.getFriendById?.(value_86.id) || value_86;
                if (locationProfile_2.timeDifferenceEnabled) {
                    const chatTimeAwareToggleElement_427 =
                        document.getElementById('chat-time-aware-toggle');
                    if (chatTimeAwareToggleElement_427)
                        chatTimeAwareToggleElement_427.checked = true;
                }
                handleAction_39(value_97);
                value_405();
            });
    }
    function handleAction_41() {
        const chatLocationProfileBtnElement_428 = document.getElementById(
            'chat-location-profile-btn',
        );
        if (
            !chatLocationProfileBtnElement_428 ||
            chatLocationProfileBtnElement_428.dataset.bound === 'true'
        )
            return;
        chatLocationProfileBtnElement_428.dataset.bound = 'true';
        chatLocationProfileBtnElement_428.addEventListener('click', () => {
            const currentSettingsFriend_429 = window.imData.currentSettingsFriend;
            if (currentSettingsFriend_429 && currentSettingsFriend_429.type === 'char')
                handleAction_40(currentSettingsFriend_429);
        });
    }
    editCharPersonaSheetElement &&
        editCharPersonaSheetElement.addEventListener('click', (event_99) => {
            event_99.target === editCharPersonaSheetElement &&
                closeView_2(editCharPersonaSheetElement);
        });
    relationshipSheet &&
        relationshipSheet.addEventListener('click', (event_100) => {
            event_100.target === relationshipSheet && closeView_2(relationshipSheet);
        });
    relationshipBtn &&
        relationshipBtn.addEventListener('click', () => {
            if (!window.imData.currentSettingsFriend) return;
            isRelationshipPickerVisible = false;
            relationshipPickerType = 'all';
            tempRelationshipDrafts = (
                window.imData.currentSettingsFriend.memory?.relationships || []
            ).map((rel_7) => ({
                npcId: getRelationshipTargetId(rel_7),
                targetType: rel_7.targetType || getRelationshipTarget(rel_7)?.type,
                relation: rel_7.relation || '',
                offsetX: rel_7.offsetX,
                offsetY: rel_7.offsetY,
            }));
            renderRelationshipSheet_2(window.imData.currentSettingsFriend);
            openView_3(relationshipSheet);
        });
    confirmRelationshipBtn &&
        confirmRelationshipBtn.addEventListener('click', async () => {
            if (!window.imData.currentSettingsFriend || !relationshipList) return;
            collectRelationshipDrafts();
            const normalizedRelations = tempRelationshipDrafts
                    .map((item_9) => ({
                        npcId: getRelationshipTargetId(item_9),
                        targetType:
                            item_9.targetType || getRelationshipTarget(item_9)?.type || 'npc',
                        relation: (item_9.relation || '').trim(),
                        offsetX: item_9.offsetX,
                        offsetY: item_9.offsetY,
                    }))
                    .filter(
                        (item_10) =>
                            item_10.npcId &&
                            item_10.relation &&
                            !!getRelationshipTarget(item_10.npcId),
                    ),
                saved_6 = await commitSettingsFriendChange(
                    (targetFriend_5) => {
                        targetFriend_5.memory =
                            targetFriend_5.memory || window.imApp.createDefaultMemory();
                        targetFriend_5.memory.relationships = normalizedRelations;
                    },
                    {
                        silent: true,
                    },
                );
            if (!saved_6) {
                showToast_2('关系网保存失败');
                return;
            }
            tempRelationshipDrafts = (
                window.imData.currentSettingsFriend.memory.relationships || []
            ).map((rel_8) => ({
                npcId: getRelationshipTargetId(rel_8),
                targetType: rel_8.targetType || getRelationshipTarget(rel_8)?.type,
                relation: rel_8.relation || '',
                offsetX: rel_8.offsetX,
                offsetY: rel_8.offsetY,
            }));
            isRelationshipPickerVisible = false;
            showToast_2(
                normalizedRelations.length > 0 ? '关系网已保存' : '未填写关系，已清空关系网',
            );
            closeView_2(relationshipSheet);
        });
    relationshipAddNpcBtn &&
        relationshipAddNpcBtn.addEventListener('click', () => {
            if (!window.imData.currentSettingsFriend) return;
            collectRelationshipDrafts();
            const allPeople_2 = (window.imData.friends || []).filter(
                    (item_11) =>
                        (item_11.type === 'char' || item_11.type === 'npc') &&
                        String(item_11.id) !== String(window.imData.currentSettingsFriend.id),
                ),
                value_440 = new Set(tempRelationshipDrafts.map(getRelationshipTargetId)),
                availablePeople_2 = allPeople_2.filter(
                    (value_443) => !value_440.has(String(value_443.id)),
                );
            if (allPeople_2.length === 0) {
                showToast_2('暂无可添加的人物，请先创建 Char 或 NPC');
                return;
            }
            if (availablePeople_2.length === 0) {
                showToast_2('已有 Char 和 NPC 均已添加');
                return;
            }
            isRelationshipPickerVisible = !isRelationshipPickerVisible;
            renderRelationshipSheet_2(window.imData.currentSettingsFriend);
        });
    relationshipPickerFilters &&
        relationshipPickerFilters.addEventListener('click', (event_4) => {
            const button_2 = event_4.target.closest('.relationship-filter-btn');
            if (!button_2 || !window.imData.currentSettingsFriend) return;
            relationshipPickerType = button_2.dataset.type || 'all';
            renderRelationshipPicker(window.imData.currentSettingsFriend);
        });
    chatSettingsSheet &&
        chatSettingsSheet.addEventListener('click', (event_101) => {
            event_101.target === chatSettingsSheet && closeView_2(chatSettingsSheet);
        });
    npcChatSettingsSheet &&
        npcChatSettingsSheet.addEventListener('click', (event_102) => {
            event_102.target === npcChatSettingsSheet && closeView_2(npcChatSettingsSheet);
        });
    function handleAction_42() {
        const profileTrigger = document.getElementById('npc-chat-settings-profile-trigger'),
            npcChatBgUploadElement = document.getElementById('npc-chat-bg-upload'),
            bgUploadIcon = document.getElementById('npc-chat-bg-upload-icon'),
            bgResetIcon = document.getElementById('npc-chat-bg-reset-icon'),
            npcTimestampToggleElement_448 = document.getElementById('npc-timestamp-toggle'),
            pinToggle = document.getElementById('npc-chat-pinned-toggle'),
            npcChatAvatarToggleElement = document.getElementById('npc-chat-avatar-toggle'),
            clearHistoryBtn = document.getElementById('npc-clear-history-btn'),
            deleteNpcBtn = document.getElementById('npc-delete-friend-btn');
        profileTrigger &&
            profileTrigger.dataset.bound !== 'true' &&
            ((profileTrigger.dataset.bound = 'true'),
            profileTrigger.addEventListener('click', () => {
                if (!window.imData.currentSettingsFriend) return;
                const sharedProfileTrigger = document.getElementById(
                    'chat-settings-profile-trigger',
                );
                if (sharedProfileTrigger) sharedProfileTrigger.click();
            }));
        bgUploadIcon &&
            npcChatBgUploadElement &&
            bgUploadIcon.dataset.bound !== 'true' &&
            ((bgUploadIcon.dataset.bound = 'true'),
            bgUploadIcon.addEventListener('click', () => {
                npcChatBgUploadElement.click();
            }));
        npcChatBgUploadElement &&
            npcChatBgUploadElement.dataset.bound !== 'true' &&
            ((npcChatBgUploadElement.dataset.bound = 'true'),
            npcChatBgUploadElement.addEventListener('change', async (e_2) => {
                const file_3 = e_2.target.files[0],
                    friend_32 = window.imData.currentSettingsFriend;
                if (!file_3 || !friend_32) {
                    e_2.target.value = '';
                    return;
                }
                try {
                    const value_452 = await handleAction_8(file_3, friend_32);
                    if (value_452.status === 'failed') {
                        showToast_2('聊天背景保存失败');
                        return;
                    }
                    if (value_452.status === 'saved') showToast_2('已更换聊天背景');
                } catch (error_2) {
                    console.error('Failed to process NPC chat background image', error_2);
                    showToast_2('聊天背景处理失败');
                } finally {
                    e_2.target.value = '';
                }
            }));
        bgResetIcon &&
            bgResetIcon.dataset.bound !== 'true' &&
            ((bgResetIcon.dataset.bound = 'true'),
            bgResetIcon.addEventListener('click', async () => {
                const currentSettingsFriend_454 = window.imData.currentSettingsFriend;
                if (!currentSettingsFriend_454) return;
                const value_455 = await handleAction_9(currentSettingsFriend_454);
                if (value_455.status === 'failed') {
                    showToast_2('聊天背景重置失败');
                    return;
                }
                if (value_455.status === 'reset') showToast_2('已重置聊天背景');
            }));
        npcChatAvatarToggleElement &&
            npcChatAvatarToggleElement.dataset.bound !== 'true' &&
            ((npcChatAvatarToggleElement.dataset.bound = 'true'),
            npcChatAvatarToggleElement.addEventListener('change', async (event_456) => {
                const friend_33 = window.imData.currentSettingsFriend;
                if (!friend_33) return;
                const checked_3 = !!friend_33.showAvatar,
                    showAvatar_2 = event_456.target.checked,
                    value_460 = await commitSettingsFriendChange(
                        (value_461) => {
                            value_461.showAvatar = showAvatar_2;
                        },
                        {
                            silent: true,
                        },
                    );
                if (!value_460) {
                    event_456.target.checked = checked_3;
                    showToast_2('头像设置保存失败');
                    return;
                }
                if (window.imChat && window.imChat.rerenderChatContainer) {
                    const elementById_462 = document.getElementById(
                        'chat-interface-' + friend_33.id,
                    );
                    if (elementById_462) {
                        const insChatMessagesElement_463 =
                            elementById_462.querySelector('.ins-chat-messages');
                        if (insChatMessagesElement_463)
                            window.imChat.rerenderChatContainer(
                                friend_33,
                                insChatMessagesElement_463,
                                {
                                    scroll: false,
                                },
                            );
                    }
                }
            }));
        npcTimestampToggleElement_448 &&
            npcTimestampToggleElement_448.dataset.bound !== 'true' &&
            ((npcTimestampToggleElement_448.dataset.bound = 'true'),
            npcTimestampToggleElement_448.addEventListener('change', async (event_464) => {
                const friend_34 = window.imData.currentSettingsFriend;
                if (!friend_34) return;
                const checked_4 = !!friend_34.showTimestamp,
                    showTimestamp_2 = event_464.target.checked,
                    value_468 = await commitSettingsFriendChange(
                        (value_469) => {
                            value_469.showTimestamp = showTimestamp_2;
                        },
                        {
                            silent: true,
                        },
                    );
                if (!value_468) {
                    event_464.target.checked = checked_4;
                    showToast_2('时间戳设置保存失败');
                    return;
                }
                handleAction_88(window.imData.currentSettingsFriend);
            }));
        pinToggle &&
            pinToggle.dataset.bound !== 'true' &&
            ((pinToggle.dataset.bound = 'true'),
            pinToggle.addEventListener('change', async (event_470) => {
                const friend_35 = window.imData.currentSettingsFriend;
                if (!friend_35) return;
                const checked_5 = !!friend_35.isPinned,
                    isPinned_2 = event_470.target.checked,
                    value_474 = await commitSettingsFriendChange(
                        (value_475) => {
                            value_475.isPinned = isPinned_2;
                        },
                        {
                            silent: true,
                        },
                    );
                if (!value_474) {
                    event_470.target.checked = checked_5;
                    showToast_2('置顶设置保存失败');
                    return;
                }
                if (window.imApp.renderChatsList) window.imApp.renderChatsList();
                handleAction_88(window.imData.currentSettingsFriend);
                showToast_2(window.imData.currentSettingsFriend.isPinned ? '已置顶' : '已取消置顶');
            }));
        clearHistoryBtn &&
            clearHistoryBtn.dataset.bound !== 'true' &&
            ((clearHistoryBtn.dataset.bound = 'true'),
            clearHistoryBtn.addEventListener('click', () => {
                const deletingFriend = window.imData.currentSettingsFriend;
                if (!deletingFriend) return;
                showCustomModal_2({
                    title: '清空聊天记录',
                    message:
                        '确定清空这个 NPC 的线上聊天记录吗？上下文、记忆和状态栏会保留，此操作不可恢复。',
                    isDestructive: true,
                    confirmText: '清空',
                    onConfirm: async () => {
                        const deletingFriendId = deletingFriend.id,
                            saved_7 = window.imApp.resetFriendMessages
                                ? await window.imApp.resetFriendMessages(deletingFriendId, {
                                      silent: true,
                                  })
                                : await commitSettingsFriendChange(
                                      (targetFriend_6) => {
                                          targetFriend_6.messages = [];
                                      },
                                      {
                                          silent: true,
                                          metaOnly: false,
                                          includeMessages: true,
                                      },
                                  );
                        if (!saved_7) {
                            showToast_2('清空聊天记录失败');
                            return;
                        }
                        const elementById_479 = document.getElementById(
                            'chat-interface-' + deletingFriendId,
                        );
                        if (elementById_479) {
                            const insChatMessagesElement_481 =
                                    elementById_479.querySelector('.ins-chat-messages'),
                                value_482 = window.imApp.getFriendById
                                    ? window.imApp.getFriendById(deletingFriendId)
                                    : window.imData.currentSettingsFriend;
                            if (
                                insChatMessagesElement_481 &&
                                value_482 &&
                                window.imChat.rerenderChatContainer
                            )
                                window.imChat.rerenderChatContainer(
                                    value_482,
                                    insChatMessagesElement_481,
                                    {
                                        scroll: false,
                                    },
                                );
                            else
                                insChatMessagesElement_481 &&
                                    (insChatMessagesElement_481.innerHTML = '');
                        }
                        if (window.imApp.renderChatsList) window.imApp.renderChatsList();
                        showToast_2('已清空聊天记录');
                        closeView_2(npcChatSettingsSheet);
                    },
                });
            }));
        deleteNpcBtn &&
            deleteNpcBtn.dataset.bound !== 'true' &&
            ((deleteNpcBtn.dataset.bound = 'true'),
            deleteNpcBtn.addEventListener('click', () => {
                const deletingFriend_2 = window.imData.currentSettingsFriend;
                if (!deletingFriend_2) return;
                showCustomModal_2({
                    title: '删除 NPC',
                    message: '确定删除 NPC ' + deletingFriend_2.nickname + ' 吗？此操作不可恢复。',
                    isDestructive: true,
                    confirmText: '删除',
                    onConfirm: async () => {
                        const deletingFriendId_2 = deletingFriend_2.id,
                            saved_8 = window.imApp.commitFriendsChange
                                ? await window.imApp.commitFriendsChange(
                                      () => {
                                          window.imData.friends = (
                                              window.imData.friends || []
                                          ).filter(
                                              (f) => String(f.id) !== String(deletingFriendId_2),
                                          );
                                      },
                                      {
                                          silent: true,
                                          friendIds: [],
                                          deletedFriendIds: [deletingFriendId_2],
                                      },
                                  )
                                : false;
                        if (!saved_8) {
                            showToast_2('删除 NPC 失败');
                            return;
                        }
                        window.imData.currentSettingsFriend &&
                            String(window.imData.currentSettingsFriend.id) ===
                                String(deletingFriendId_2) &&
                            (window.imData.currentSettingsFriend = null);
                        window.imData.currentActiveFriend &&
                            String(window.imData.currentActiveFriend.id) ===
                                String(deletingFriendId_2) &&
                            (window.imData.currentActiveFriend = null);
                        if (window.imApp.renderFriendsList) window.imApp.renderFriendsList();
                        if (window.imApp.updateChatsView) window.imApp.updateChatsView();
                        const elementById_486 = document.getElementById(
                            'chat-interface-' + deletingFriendId_2,
                        );
                        if (elementById_486) elementById_486.remove();
                        closeView_2(npcChatSettingsSheet);
                        showToast_2('已删除 NPC');
                    },
                });
            }));
    }
    const staticChatMenuBtn = document.querySelector('#active-chat-interface .chat-menu-btn');
    staticChatMenuBtn &&
        staticChatMenuBtn.addEventListener('click', () => {
            window.imData.currentActiveFriend &&
                openChatSettingsForFriend_2(window.imData.currentActiveFriend);
        });
    bindWorldBookSheet &&
        bindWorldBookSheet.addEventListener('click', (event_103) => {
            event_103.target === bindWorldBookSheet && closeView_2(bindWorldBookSheet);
        });
    bindAccountSheet &&
        bindAccountSheet.addEventListener('click', (event_104) => {
            event_104.target === bindAccountSheet && closeView_2(bindAccountSheet);
        });
    chatCotSettingsSheet &&
        chatCotSettingsSheet.addEventListener('click', (event_490) => {
            if (event_490.target === chatCotSettingsSheet) closeView_2(chatCotSettingsSheet);
        });
    chatCotSettingsBtn &&
        chatCotSettingsBtn.addEventListener('click', () => {
            const currentSettingsFriend_491 = window.imData.currentSettingsFriend;
            if (!currentSettingsFriend_491 || currentSettingsFriend_491.type !== 'char') return;
            renderChatCotSettings(currentSettingsFriend_491);
            openView_3(chatCotSettingsSheet);
        });
    resetChatCotPromptBtn &&
        resetChatCotPromptBtn.addEventListener('click', () => {
            if (chatCotPromptInput) chatCotPromptInput.value = DEFAULT_SINGLE_CHAT_COT_PROMPT_2;
        });
    saveChatCotSettingsBtn &&
        saveChatCotSettingsBtn.addEventListener('click', async () => {
            const currentSettingsFriend_492 = window.imData.currentSettingsFriend;
            if (!currentSettingsFriend_492 || currentSettingsFriend_492.type === 'group') return;
            const nextEnabled = chatCotEnabledToggle?.checked !== false,
                nextPrompt = String(chatCotPromptInput?.value || '')
                    .trim()
                    .slice(0, 4000);
            saveChatCotSettingsBtn.disabled = true;
            const saved_9 = await commitSettingsFriendChange(
                (targetFriend_7) => {
                    targetFriend_7.cotEnabled = nextEnabled;
                    targetFriend_7.cotDefaultVersion = 2;
                    targetFriend_7.cotPrompt =
                        nextPrompt === DEFAULT_SINGLE_CHAT_COT_PROMPT_2 ? '' : nextPrompt;
                },
                {
                    silent: true,
                },
            );
            saveChatCotSettingsBtn.disabled = false;
            if (!saved_9) {
                renderChatCotSettings(window.imData.currentSettingsFriend);
                showToast_2('COT 设置保存失败');
                return;
            }
            renderChatCotSettings(window.imData.currentSettingsFriend);
            showToast_2('COT 设置已保存');
            closeView_2(chatCotSettingsSheet);
        });
    bindAccountDetailSheet &&
        bindAccountDetailSheet.addEventListener('click', (event_105) => {
            event_105.target === bindAccountDetailSheet && closeView_2(bindAccountDetailSheet);
        });
    chatBindIdBtn &&
        chatBindIdBtn.addEventListener('click', () => {
            if (!window.imData.currentSettingsFriend) return;
            openBindAccountDetailSheet(window.imData.currentSettingsFriend);
        });
    bindAccountDetailSelect &&
        bindAccountDetailSelect.addEventListener('change', async (e_3) => {
            const previousValue_2 = window.imData.currentSettingsFriend?.boundAccountId || 'none',
                nextValue_2 = e_3.target.value || 'none',
                saved_10 = await handleAction_20(nextValue_2);
            if (!saved_10) {
                e_3.target.value = previousValue_2 || 'none';
                renderBindAccountDetailForm(window.imData.currentSettingsFriend);
                return;
            }
            renderBindAccountDetailForm(window.imData.currentSettingsFriend);
            showToast_2(nextValue_2 !== 'none' ? '角色绑定ID已更新' : '已取消绑定ID');
        });
    bindAccountDetailAvatarBtn &&
        bindAccountDetailAvatarUpload &&
        (bindAccountDetailAvatarBtn.addEventListener('click', () => {
            bindAccountDetailSelect &&
                bindAccountDetailSelect.value !== 'none' &&
                bindAccountDetailAvatarUpload.click();
        }),
        bindAccountDetailAvatarUpload.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            try {
                if (typeof window.readImageAsCompressedDataUrl !== 'function') {
                    showToast_2('头像上传组件不可用');
                    return;
                }
                const url = await window.readImageAsCompressedDataUrl(file, {
                    maxWidth: 256,
                    maxHeight: 256,
                    quality: 0.72,
                });
                setBindAccountDetailAvatar(url);
            } catch (error_3) {
                console.error('Failed to process bound account avatar', error_3);
                showToast_2('头像处理失败');
            } finally {
                e.target.value = '';
            }
        }));
    bindAccountDetailSaveBtn &&
        bindAccountDetailSaveBtn.addEventListener('click', () => {
            const accountId_3 = bindAccountDetailSelect ? bindAccountDetailSelect.value : 'none';
            if (!accountId_3 || accountId_3 === 'none') {
                showToast_2('请先选择要绑定的 ID');
                return;
            }
            if (typeof window.updateAccountById !== 'function') {
                showToast_2('账号保存组件不可用');
                return;
            }
            const saved_11 = window.updateAccountById(accountId_3, {
                name: (bindAccountDetailNameInput?.value || '').trim() || '未命名ID',
                phone: (bindAccountDetailPhoneInput?.value || '').trim(),
                signature: (bindAccountDetailSignatureInput?.value || '').trim(),
                persona: (bindAccountDetailPersonaInput?.value || '').trim(),
                avatarUrl: bindAccountDetailAvatarUrl || null,
            });
            if (!saved_11) {
                showToast_2('ID资料保存失败');
                return;
            }
            updateChatBindIdLabel_2(window.imData.currentSettingsFriend);
            renderBindAccountDetailSelect(window.imData.currentSettingsFriend);
            if (bindAccountDetailSelect) bindAccountDetailSelect.value = String(accountId_3);
            renderBindAccountDetailForm(window.imData.currentSettingsFriend);
            if (window.updateBindRoleEntryPoints) window.updateBindRoleEntryPoints();
            if (window.imApp.renderFriendsList) window.imApp.renderFriendsList();
            if (window.imApp.renderChatsList) window.imApp.renderChatsList();
            if (window.imApp.updateChatsView) window.imApp.updateChatsView();
            refreshChatPagesBoundToAccount(accountId_3);
            showToast_2('ID资料已同步');
        });
    worldBookBtn &&
        worldBookBtn.addEventListener('click', () => {
            if (!window.imData.currentSettingsFriend) return;
            if (typeof window.renderWorldBookSelector !== 'function') {
                showToast_2('世界书选择器不可用');
                return;
            }
            const selectedIds = Array.isArray(window.imData.currentSettingsFriend.boundBooks)
                ? window.imData.currentSettingsFriend.boundBooks
                : [];
            window.renderWorldBookSelector(selectedIds, async (nextIds) => {
                const saved_12 = await commitSettingsFriendChange(
                    (targetFriend_8) => {
                        targetFriend_8.boundBooks = Array.isArray(nextIds)
                            ? nextIds.filter(Boolean).map((id_3) => String(id_3))
                            : [];
                    },
                    {
                        silent: true,
                    },
                );
                if (!saved_12) {
                    showToast_2('世界书绑定保存失败');
                    return;
                }
                if (window.invalidateWorldBookLocalBindings)
                    window.invalidateWorldBookLocalBindings();
                if (window.renderWorldBooks) window.renderWorldBooks();
                showToast_2('世界书绑定已更新');
            });
        });
    confirmBindWorldBookBtn &&
        confirmBindWorldBookBtn.addEventListener('click', async () => {
            if (window.imData.currentSettingsFriend) {
                const saved_13 = await commitSettingsFriendChange(
                    (targetFriend_9) => {
                        targetFriend_9.boundBooks = [...tempSelectedBookIds];
                    },
                    {
                        silent: true,
                    },
                );
                if (!saved_13) {
                    showToast_2('世界书绑定保存失败');
                    return;
                }
                if (window.invalidateWorldBookLocalBindings)
                    window.invalidateWorldBookLocalBindings();
                if (window.renderWorldBooks) window.renderWorldBooks();
                showToast_2('世界书绑定已更新');
            }
            closeView_2(bindWorldBookSheet);
        });
    confirmBindAccountBtn &&
        confirmBindAccountBtn.addEventListener('click', async () => {
            const currentSettingsFriend_508 = window.imData.currentSettingsFriend;
            if (!currentSettingsFriend_508) return;
            const boundAccountId_3 = tempSelectedAccountId || null,
                saved_14 = await commitSettingsFriendChange(
                    (value_511) => {
                        value_511.boundAccountId = boundAccountId_3;
                    },
                    {
                        silent: true,
                    },
                );
            if (!saved_14) {
                showToast_2('角色绑定ID保存失败');
                return;
            }
            updateChatBindIdLabel_2(window.imData.currentSettingsFriend);
            if (window.updateBindRoleEntryPoints) window.updateBindRoleEntryPoints();
            refreshChatPageForFriend(window.imData.currentSettingsFriend);
            window.dispatchEvent(
                new CustomEvent('u2:friend-account-binding-changed', {
                    detail: {
                        friendId: String(window.imData.currentSettingsFriend.id),
                    },
                }),
            );
            showToast_2(
                window.imData.currentSettingsFriend.boundAccountId
                    ? '角色绑定ID已更新'
                    : '已取消绑定ID',
            );
            closeView_2(bindAccountSheet);
        });
    function handleAction_43() {
        if (!bindWorldBookList) return;
        bindWorldBookList.innerHTML = '';
        let allBooks = window.getWorldBooks ? window.getWorldBooks() : [];
        const selectableBooks = allBooks.filter((book) => !book.isGlobal);
        if (allBooks.length === 0) {
            bindWorldBookList.innerHTML =
                '<div style="text-align: center; color: #8e8e93; padding: 20px;">暂无世界书，请先在主界面创建</div>';
            return;
        } else {
            if (selectableBooks.length === 0) {
                bindWorldBookList.innerHTML =
                    '<div style="text-align: center; color: #8e8e93; padding: 20px;">所有世界书都已启用全局，无需在此单独绑定</div>';
                return;
            }
        }
        selectableBooks.forEach((book_2) => {
            const isSelected_2 = tempSelectedBookIds.includes(book_2.id),
                tokens = window.calculateTokens ? window.calculateTokens(book_2.entries) : 0,
                item_12 = document.createElement('div');
            item_12.className = 'account-card';
            item_12.style.padding = '12px 16px';
            item_12.style.height = 'auto';
            item_12.style.cursor = 'pointer';
            item_12.style.borderRadius = '16px';
            item_12.style.border = isSelected_2
                ? '2px solid var(--blue-color)'
                : '2px solid transparent';
            item_12.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            item_12.style.position = 'relative';
            item_12.innerHTML =
                `
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 36px; height: 36px; background-color: #1c1c1e; border-radius: 10px; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 16px;">
                            <i class="fas fa-book"></i>
                        </div>
                        <div>
                            <div style="font-size: 16px; font-weight: 500; color: #000;">` +
                book_2.name +
                `</div>
                            <div style="font-size: 12px; color: #8e8e93; margin-top: 2px;">分组: ` +
                book_2.group +
                `</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 13px; color: #8e8e93;">+` +
                tokens +
                ` Tokens</span>
                        <div style="width: 22px; height: 22px; border-radius: 50%; border: 1px solid ` +
                (isSelected_2 ? 'var(--blue-color)' : '#c7c7cc') +
                '; background-color: ' +
                (isSelected_2 ? 'var(--blue-color)' : 'transparent') +
                `; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 12px;">
                            ` +
                (isSelected_2 ? '<i class="fas fa-check"></i>' : '') +
                `
                        </div>
                    </div>
                </div>
            `;
            const styleFix = document.createElement('style');
            styleFix.innerHTML =
                '#bind-world-book-list .account-card::after { display: none !important; }';
            item_12.appendChild(styleFix);
            item_12.addEventListener('click', () => {
                tempSelectedBookIds.includes(book_2.id)
                    ? (tempSelectedBookIds = tempSelectedBookIds.filter(
                          (id_4) => id_4 !== book_2.id,
                      ))
                    : tempSelectedBookIds.push(book_2.id);
                handleAction_43();
            });
            bindWorldBookList.appendChild(item_12);
        });
    }
    const deleteFriendBtn = document.getElementById('delete-friend-btn'),
        clearHistoryBtn_2 = document.getElementById('clear-history-btn'),
        resetCssBtn = document.getElementById('reset-css-btn'),
        chatBgUpload = document.getElementById('chat-bg-upload'),
        chatBgUploadIcon = document.getElementById('chat-bg-upload-icon'),
        chatBgSaveIcon = document.getElementById('chat-bg-save-icon'),
        chatBgResetIcon = document.getElementById('chat-bg-reset-icon');
    chatBgUploadIcon &&
        chatBgUpload &&
        (chatBgUploadIcon.addEventListener('click', () => {
            chatBgUpload.click();
        }),
        chatBgUpload.addEventListener('change', async (event_520) => {
            const value_521 = event_520.target.files[0],
                currentSettingsFriend_522 = window.imData.currentSettingsFriend;
            if (value_521 && currentSettingsFriend_522)
                try {
                    const value_523 = await handleAction_8(value_521, currentSettingsFriend_522);
                    if (value_523.status === 'failed') {
                        showToast_2('聊天背景保存失败');
                        return;
                    }
                    if (value_523.status === 'saved') showToast_2('已更换聊天背景');
                } catch (error_4) {
                    console.error('Failed to process chat background image', error_4);
                    showToast_2('聊天背景处理失败');
                }
            event_520.target.value = '';
        }));
    chatBgResetIcon &&
        chatBgResetIcon.addEventListener('click', async () => {
            const currentSettingsFriend_112 = window.imData.currentSettingsFriend;
            if (!currentSettingsFriend_112) return;
            const value_113 = await handleAction_9(currentSettingsFriend_112);
            if (value_113.status === 'failed') {
                showToast_2('聊天背景重置失败');
                return;
            }
            if (value_113.status === 'reset') showToast_2('已重置聊天背景');
        });
    function applyFriendBg_2(friend_36) {
        if (!friend_36) return;
        const page = document.getElementById('chat-interface-' + friend_36.id);
        if (page) {
            const stickyContainer = page.querySelector('.chat-sticky-container');
            page.style.removeProperty('background-image');
            page.style.removeProperty('background-color');
            page.style.removeProperty('background-size');
            page.style.removeProperty('background-position');
            stickyContainer &&
                (stickyContainer.style.removeProperty('background'),
                stickyContainer.style.removeProperty('border-bottom'));
            if (friend_36.chatBg) {
                const escapedBg = String(friend_36.chatBg).replace(/["\\]/g, '\\$&');
                page.classList.add('has-chat-bg');
                page.style.setProperty('--im-chat-bg-image', 'url("' + escapedBg + '")');
            } else {
                page.classList.remove('has-chat-bg');
                page.style.removeProperty('--im-chat-bg-image');
            }
        }
    }
    clearHistoryBtn_2 &&
        clearHistoryBtn_2.addEventListener('click', () => {
            window.imData.currentSettingsFriend &&
                showCustomModal_2({
                    title: '清空聊天记录',
                    message: '确定清空线上聊天记录吗？上下文、记忆和状态栏会保留，此操作不可恢复。',
                    isDestructive: true,
                    confirmText: '清空',
                    onConfirm: async () => {
                        const friendId_3 = window.imData.currentSettingsFriend.id,
                            value_531 = window.imApp.resetFriendMessages
                                ? await window.imApp.resetFriendMessages(friendId_3, {
                                      silent: true,
                                  })
                                : await commitSettingsFriendChange(
                                      (targetFriend_10) => {
                                          targetFriend_10.messages = [];
                                          window.imApp.syncActiveFriendReference &&
                                              window.imApp.syncActiveFriendReference(
                                                  targetFriend_10,
                                              );
                                          window.imApp.syncSettingsFriendReference &&
                                              window.imApp.syncSettingsFriendReference(
                                                  targetFriend_10,
                                              );
                                      },
                                      {
                                          silent: true,
                                          metaOnly: false,
                                          includeMessages: true,
                                      },
                                  );
                        if (!value_531) {
                            showToast_2('清空聊天记录失败');
                            const elementById_534 = document.getElementById(
                                'chat-interface-' + friendId_3,
                            );
                            if (elementById_534) {
                                const failedContainer =
                                    elementById_534.querySelector('.ins-chat-messages');
                                failedContainer &&
                                    ((failedContainer.innerHTML = ''),
                                    window.imChat.renderChatHistory(
                                        window.imData.currentSettingsFriend,
                                        failedContainer,
                                    ));
                            }
                            return;
                        }
                        const elementById_532 = document.getElementById(
                            'chat-interface-' + friendId_3,
                        );
                        if (elementById_532) {
                            const insChatMessagesElement_536 =
                                    elementById_532.querySelector('.ins-chat-messages'),
                                value_537 = window.imApp.getFriendById
                                    ? window.imApp.getFriendById(friendId_3)
                                    : window.imData.currentSettingsFriend;
                            if (
                                insChatMessagesElement_536 &&
                                value_537 &&
                                window.imChat.rerenderChatContainer
                            )
                                window.imChat.rerenderChatContainer(
                                    value_537,
                                    insChatMessagesElement_536,
                                    {
                                        scroll: false,
                                    },
                                );
                            else
                                insChatMessagesElement_536 &&
                                    (insChatMessagesElement_536.innerHTML = '');
                        }
                        showToast_2('已清空聊天记录');
                        closeView_2(chatSettingsSheet);
                        if (window.imApp.renderChatsList) window.imApp.renderChatsList();
                    },
                });
        });
    deleteFriendBtn &&
        deleteFriendBtn.addEventListener('click', () => {
            window.imData.currentSettingsFriend &&
                showCustomModal_2({
                    title: '删除好友',
                    message:
                        '确定删除好友 ' +
                        window.imData.currentSettingsFriend.nickname +
                        ' 吗？此操作不可恢复。',
                    isDestructive: true,
                    confirmText: '删除',
                    onConfirm: async () => {
                        const deletingFriend_3 = window.imData.currentSettingsFriend,
                            deletingFriendId_3 = deletingFriend_3.id,
                            saved_15 = window.imApp.commitFriendsChange
                                ? await window.imApp.commitFriendsChange(
                                      () => {
                                          window.imData.friends = (
                                              window.imData.friends || []
                                          ).filter(
                                              (f_2) =>
                                                  String(f_2.id) !== String(deletingFriendId_3),
                                          );
                                      },
                                      {
                                          silent: true,
                                          friendIds: [],
                                          deletedFriendIds: [deletingFriendId_3],
                                      },
                                  )
                                : window.imApp.flushFriendSave
                                  ? await window.imApp.flushFriendSave(deletingFriendId_3, {
                                        silent: true,
                                    })
                                  : false;
                        if (!saved_15) {
                            showToast_2('删除好友失败');
                            return;
                        }
                        window.imData.currentSettingsFriend &&
                            String(window.imData.currentSettingsFriend.id) ===
                                String(deletingFriendId_3) &&
                            (window.imData.currentSettingsFriend = null);
                        window.imData.currentActiveFriend &&
                            String(window.imData.currentActiveFriend.id) ===
                                String(deletingFriendId_3) &&
                            (window.imData.currentActiveFriend = null);
                        if (window.imApp.renderFriendsList) window.imApp.renderFriendsList();
                        closeView_2(chatSettingsSheet);
                        if (window.imApp.updateChatsView) window.imApp.updateChatsView();
                        const elementById_541 = document.getElementById(
                            'chat-interface-' + deletingFriendId_3,
                        );
                        if (elementById_541) elementById_541.remove();
                        showToast_2('已删除好友');
                    },
                });
        });
    const chatSettingsMomentsBtn = document.getElementById('chat-settings-moments-btn'),
        chatReversePhoneBtnElement = document.getElementById('chat-reverse-phone-btn');
    chatReversePhoneBtnElement &&
        chatReversePhoneBtnElement.addEventListener('click', () => {
            const friendId_4 = window.imData.currentSettingsFriend?.id,
                result_544 = (window.imData.friends || []).find(
                    (item_13) => String(item_13.id) === String(friendId_4),
                );
            if (result_544?.type !== 'char') return;
            window.imApp.openUserPhoneAccessSettings?.(result_544.id);
        });
    chatSettingsMomentsBtn &&
        chatSettingsMomentsBtn.addEventListener('click', () => {
            if (!window.imData.currentSettingsFriend) return;
            if (chatSettingsSheet) closeView_2(chatSettingsSheet);
            if (window.imApp.openUserMoments)
                window.imApp.openUserMoments(window.imData.currentSettingsFriend.id);
        });
    const chatSettingsProfileTriggerElement = document.getElementById(
        'chat-settings-profile-trigger',
    );
    chatSettingsProfileTriggerElement &&
        chatSettingsProfileTriggerElement.addEventListener('click', () => {
            if (!window.imData.currentSettingsFriend) return;
            const friend_37 = window.imData.currentSettingsFriend,
                editCharPersonaSheetElement_547 =
                    document.getElementById('edit-char-persona-sheet');
            if (!editCharPersonaSheetElement_547) return;
            const realNameInput = document.getElementById('char-realname-input'),
                nicknameInput = document.getElementById('char-nickname-input'),
                signatureInput = document.getElementById('char-signature-input'),
                relationshipInput = document.getElementById('char-relationship-input'),
                personaInput = document.getElementById('char-persona-input'),
                charEditAvatarImgElement = document.getElementById('char-edit-avatar-img'),
                iconPreview = document.getElementById('char-edit-avatar-preview');
            let element_548 = null;
            if (iconPreview) element_548 = iconPreview.querySelector('i');
            let tempAvatarUrl = friend_37.avatarUrl;
            friend_37.memory = window.imApp.normalizeFriendData(friend_37).memory;
            if (realNameInput) realNameInput.value = friend_37.realName || '';
            if (nicknameInput) nicknameInput.value = friend_37.nickname || '';
            if (signatureInput) signatureInput.value = friend_37.signature || '';
            if (relationshipInput) relationshipInput.value = friend_37.relationship || '';
            if (personaInput) personaInput.value = friend_37.persona || '';
            if (friend_37.avatarUrl) {
                charEditAvatarImgElement &&
                    ((charEditAvatarImgElement.src = friend_37.avatarUrl),
                    (charEditAvatarImgElement.style.display = 'block'));
                if (element_548) element_548.style.display = 'none';
            } else {
                charEditAvatarImgElement &&
                    ((charEditAvatarImgElement.style.display = 'none'),
                    (charEditAvatarImgElement.src = ''));
                if (element_548) element_548.style.display = 'block';
            }
            const avatarWrapper = document.getElementById('char-edit-avatar-wrapper'),
                avatarUpload = document.getElementById('char-edit-avatar-upload');
            if (avatarWrapper && avatarUpload) {
                const newAvatarWrapper = avatarWrapper.cloneNode(true);
                avatarWrapper.parentNode.replaceChild(newAvatarWrapper, avatarWrapper);
                const newAvatarUpload = avatarUpload.cloneNode(true);
                avatarUpload.parentNode.replaceChild(newAvatarUpload, avatarUpload);
                newAvatarWrapper.addEventListener('click', (e_4) => {
                    if (e_4.target.tagName !== 'INPUT') newAvatarUpload.click();
                });
                newAvatarUpload.addEventListener('change', async (event_551) => {
                    const file_4 = event_551.target.files[0];
                    if (file_4)
                        try {
                            tempAvatarUrl = window.imApp.compressImageFile
                                ? await window.imApp.compressImageFile(file_4, {
                                      maxWidth: 256,
                                      maxHeight: 256,
                                      mimeType: 'image/jpeg',
                                      quality: 0.8,
                                  })
                                : await window.imApp.readFileAsDataUrl(file_4);
                            const charEditAvatarImgElement_553 =
                                    document.getElementById('char-edit-avatar-img'),
                                iconPreview_2 = document.getElementById('char-edit-avatar-preview');
                            let element_555 = null;
                            if (iconPreview_2) element_555 = iconPreview_2.querySelector('i');
                            charEditAvatarImgElement_553 &&
                                ((charEditAvatarImgElement_553.src = tempAvatarUrl),
                                (charEditAvatarImgElement_553.style.display = 'block'));
                            if (element_555) element_555.style.display = 'none';
                        } catch (error_5) {
                            console.error('Failed to process character avatar image', error_5);
                            showToast_2('头像处理失败');
                        } finally {
                            event_551.target.value = '';
                        }
                });
            }
            const confirmBtn = document.getElementById('confirm-char-persona-btn');
            if (confirmBtn) {
                const cloneNode_557 = confirmBtn.cloneNode(true);
                confirmBtn.parentNode.replaceChild(cloneNode_557, confirmBtn);
                cloneNode_557.addEventListener('click', async () => {
                    const previousIdentity_2 = {
                            nickname: friend_37.nickname || '',
                            realName: friend_37.realName || '',
                            avatarUrl: friend_37.avatarUrl || '',
                        },
                        fallbackName = friend_37.type === 'npc' ? 'New NPC' : 'New Friend',
                        saved_16 = await commitNamedFriendChange(
                            friend_37,
                            (targetFriend_11) => {
                                targetFriend_11.realName = realNameInput ? realNameInput.value : '';
                                targetFriend_11.nickname = nicknameInput
                                    ? nicknameInput.value || fallbackName
                                    : fallbackName;
                                targetFriend_11.signature = signatureInput
                                    ? signatureInput.value
                                    : '';
                                targetFriend_11.relationship = relationshipInput
                                    ? relationshipInput.value
                                    : '';
                                targetFriend_11.persona = personaInput ? personaInput.value : '';
                                targetFriend_11.avatarUrl = tempAvatarUrl;
                            },
                            {
                                silent: true,
                            },
                        );
                    if (!saved_16) {
                        showToast_2('角色修改保存失败');
                        return;
                    }
                    const latestFriend_6 =
                        window.imData.friends.find(
                            (value_564) => String(value_564.id) === String(friend_37.id),
                        ) || friend_37;
                    window.imData.currentSettingsFriend = latestFriend_6;
                    const identityChanged =
                        previousIdentity_2.nickname !== (latestFriend_6.nickname || '') ||
                        previousIdentity_2.realName !== (latestFriend_6.realName || '') ||
                        previousIdentity_2.avatarUrl !== (latestFriend_6.avatarUrl || '');
                    identityChanged &&
                        latestFriend_6.type !== 'group' &&
                        (await migrateGroupMemberIdentityReferences(
                            latestFriend_6.id,
                            previousIdentity_2,
                            latestFriend_6,
                        ));
                    const page_2 = document.getElementById('chat-interface-' + latestFriend_6.id);
                    if (page_2) {
                        const nameEl = page_2.querySelector('.ins-chat-name'),
                            avatarContainer = page_2.querySelector('.ins-chat-avatar');
                        if (nameEl) nameEl.textContent = latestFriend_6.nickname;
                        avatarContainer &&
                            (latestFriend_6.avatarUrl
                                ? (avatarContainer.innerHTML =
                                      '<img src="' +
                                      latestFriend_6.avatarUrl +
                                      '" style="display: block;">')
                                : (avatarContainer.innerHTML = '<i class="fas fa-user"></i>'));
                    }
                    const chatSettingsAvatarImgElement = document.getElementById(
                            'chat-settings-avatar-img',
                        ),
                        chatSettingsAvatarIconElement = document.getElementById(
                            'chat-settings-avatar-icon',
                        ),
                        chatSettingsNameElement = document.getElementById('chat-settings-name');
                    if (latestFriend_6.avatarUrl) {
                        chatSettingsAvatarImgElement &&
                            ((chatSettingsAvatarImgElement.src = latestFriend_6.avatarUrl),
                            (chatSettingsAvatarImgElement.style.display = 'block'));
                        if (chatSettingsAvatarIconElement)
                            chatSettingsAvatarIconElement.style.display = 'none';
                    } else {
                        chatSettingsAvatarImgElement &&
                            ((chatSettingsAvatarImgElement.style.display = 'none'),
                            (chatSettingsAvatarImgElement.src = ''));
                        if (chatSettingsAvatarIconElement)
                            chatSettingsAvatarIconElement.style.display = 'block';
                    }
                    if (chatSettingsNameElement)
                        chatSettingsNameElement.textContent = latestFriend_6.nickname;
                    if (latestFriend_6.type === 'npc') refreshNpcSettingsHeader(latestFriend_6);
                    if (window.imApp.renderFriendsList) window.imApp.renderFriendsList();
                    if (window.imApp.renderChatsList) window.imApp.renderChatsList();
                    if (window.imChat && window.imChat.rerenderChatContainer && page_2) {
                        const msgContainer = page_2.querySelector('.ins-chat-messages');
                        if (msgContainer)
                            window.imChat.rerenderChatContainer(latestFriend_6, msgContainer, {
                                scroll: false,
                            });
                    }
                    showToast_2('角色修改成功');
                    closeView_2(editCharPersonaSheetElement_547);
                });
            }
            openView_3(editCharPersonaSheetElement_547);
        });
    function handleAction_45() {
        let detailOverlay_2 = document.getElementById('chat-memory-cherished-detail-overlay');
        if (!detailOverlay_2) {
            detailOverlay_2 = document.createElement('div');
            detailOverlay_2.id = 'chat-memory-cherished-detail-overlay';
            detailOverlay_2.className = 'chat-memory-cherished-detail-overlay';
            detailOverlay_2.style.position = 'fixed';
            detailOverlay_2.style.inset = '0';
            detailOverlay_2.style.background = 'rgba(0,0,0,0.4)';
            detailOverlay_2.style.zIndex = '99999';
            detailOverlay_2.style.display = 'none';
            detailOverlay_2.style.alignItems = 'center';
            detailOverlay_2.style.justifyContent = 'center';
            detailOverlay_2.style.padding = '20px';
            detailOverlay_2.style.boxSizing = 'border-box';
            detailOverlay_2.innerHTML = `
                <div class="chat-memory-cherished-detail-card" style="background:#fff; width:100%; max-width:320px; border-radius:20px; padding:20px;  position:relative;">
                    <button type="button" class="chat-memory-cherished-detail-close" aria-label="关闭" style="position:absolute; right:15px; top:15px; border:none; background:transparent; font-size:18px; color:#8e8e93; cursor:pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="chat-memory-cherished-detail-label" style="font-size:12px; color:#007aff; font-weight:700; margin-bottom:10px;">长期记忆详情</div>
                    <div id="chat-memory-cherished-detail-title" class="chat-memory-cherished-detail-title" style="font-size:18px; font-weight:700; color:#111; margin-bottom:8px;">标题</div>
                    <div id="chat-memory-cherished-detail-time" class="chat-memory-cherished-detail-time" style="font-size:13px; color:#8e8e93; margin-bottom:16px;"></div>
                    <div id="chat-memory-cherished-detail-content" class="chat-memory-cherished-detail-content" style="font-size:15px; color:#333; line-height:1.6; margin-bottom:16px;"></div>
                    <div id="chat-memory-cherished-detail-reason" class="chat-memory-cherished-detail-reason" style="font-size:14px; color:#666; background:#f2f2f7; padding:12px; border-radius:12px; margin-bottom:12px;"></div>
                    <div id="chat-memory-cherished-detail-thought" class="chat-memory-cherished-detail-thought" style="font-size:14px; color:#666; background:#f2f2f7; padding:12px; border-radius:12px; margin-bottom:16px;"></div>
                    <div style="margin-top: 10px;">
                        <button type="button" id="chat-memory-cherished-detail-delete-btn" style="width: 100%; padding: 12px; border-radius: 12px; background: #ffe5e5; color: #ff3b30; border: none; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <i class="fas fa-trash-alt"></i> 删除这条长期记忆
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(detailOverlay_2);
            detailOverlay_2.addEventListener('click', (event_114) => {
                event_114.target === detailOverlay_2 && hideCherishedMemoryDetail_3();
            });
            const closeBtn_2 = detailOverlay_2.querySelector('.chat-memory-cherished-detail-close');
            closeBtn_2 &&
                closeBtn_2.addEventListener('click', (event_115) => {
                    event_115.stopPropagation();
                    hideCherishedMemoryDetail_3();
                });
            const deleteBtn_2 = detailOverlay_2.querySelector(
                '#chat-memory-cherished-detail-delete-btn',
            );
            deleteBtn_2 &&
                deleteBtn_2.addEventListener('click', async (event_116) => {
                    event_116.stopPropagation();
                    const entryId_2 = deleteBtn_2.getAttribute('data-entry-id');
                    if (!entryId_2) return;
                    const friend_38 =
                        window.imData.currentSettingsFriend ||
                        window.imApp.getCurrentMemoryFriend?.();
                    if (!friend_38) return;
                    let cherished_2 = '';
                    const value_572 = await window.imApp.commitScopedFriendChange(
                        friend_38,
                        (targetFriend_12) => {
                            if (!targetFriend_12 || !targetFriend_12.memory) return;
                            let entries_4 = Array.isArray(targetFriend_12.memory.cherishedEntries)
                                ? targetFriend_12.memory.cherishedEntries
                                : [];
                            entries_4 = entries_4.filter(
                                (item_14) => String(item_14.id) !== String(entryId_2),
                            );
                            targetFriend_12.memory.cherishedEntries = entries_4;
                            const presentedEntries =
                                targetFriend_12.memory.recallPresentation?.recall?.cherishedEntries;
                            Array.isArray(presentedEntries) &&
                                presentedEntries.some(
                                    (item_15) => String(item_15?.id) === String(entryId_2),
                                ) &&
                                (targetFriend_12.memory.recallPresentation = null);
                            entries_4.forEach((message_578) => {
                                const parts = [
                                        message_578.title ? '【' + message_578.title + '】' : '',
                                        message_578.content || '',
                                        message_578.reason ? '原因：' + message_578.reason : '',
                                    ].filter(Boolean),
                                    trim_126 = parts
                                        .join(
                                            `
`,
                                        )
                                        .trim();
                                if (trim_126)
                                    cherished_2 +=
                                        (cherished_2
                                            ? `

`
                                            : '') + trim_126;
                            });
                            targetFriend_12.memory.cherished = cherished_2;
                        },
                        {
                            silent: true,
                            syncActive: true,
                            syncSettings: true,
                        },
                    );
                    if (value_572) {
                        void window.imVectorMemory
                            ?.deleteMemoryEntries?.(friend_38, [
                                {
                                    kind: 'cherished',
                                    entryId: String(entryId_2),
                                },
                            ])
                            ['catch']((error_6) =>
                                console.warn('[iMessage] external memory delete failed', error_6),
                            );
                        if (window.showToast) window.showToast('已删除长期记忆');
                        hideCherishedMemoryDetail_3();
                        const latestFriend_7 = window.imApp.getFriendById
                                ? window.imApp.getFriendById(friend_38.id) || friend_38
                                : window.imData.friends.find(
                                      (f_3) => String(f_3.id) === String(friend_38.id),
                                  ) || friend_38,
                            chatMemoryCherishedInput = document.getElementById(
                                'chat-memory-cherished-input',
                            );
                        chatMemoryCherishedInput &&
                            window.imData.currentSettingsFriend &&
                            String(window.imData.currentSettingsFriend.id) ===
                                String(latestFriend_7.id) &&
                            (chatMemoryCherishedInput.value =
                                latestFriend_7.memory?.cherished || '');
                        window.imApp.refreshMemoryLocationSheet &&
                            window.imApp.refreshMemoryLocationSheet('downloads');
                    } else {
                        if (window.showToast) window.showToast('删除失败');
                    }
                });
        }
        return {
            detailOverlay: detailOverlay_2,
        };
    }
    function showCherishedMemoryDetail_2(entry_2) {
        handleAction_45();
        const overlay_3 = document.getElementById('chat-memory-cherished-detail-overlay');
        if (!overlay_3 || !entry_2) return;
        const titleEl_2 = document.getElementById('chat-memory-cherished-detail-title'),
            timeEl = document.getElementById('chat-memory-cherished-detail-time'),
            contentEl_2 = document.getElementById('chat-memory-cherished-detail-content'),
            reasonEl = document.getElementById('chat-memory-cherished-detail-reason'),
            thoughtEl = document.getElementById('chat-memory-cherished-detail-thought'),
            deleteBtn_3 = document.getElementById('chat-memory-cherished-detail-delete-btn');
        if (titleEl_2) titleEl_2.textContent = entry_2.title || '长期记忆';
        if (timeEl) timeEl.textContent = entry_2.createdAt || '';
        if (contentEl_2) contentEl_2.textContent = entry_2.content || '';
        reasonEl &&
            ((reasonEl.textContent = entry_2.reason ? '想记住的原因：' + entry_2.reason : ''),
            (reasonEl.style.display = entry_2.reason ? 'block' : 'none'));
        thoughtEl &&
            ((thoughtEl.textContent = entry_2.sourceThought
                ? '当时的心声：' + entry_2.sourceThought
                : ''),
            (thoughtEl.style.display = entry_2.sourceThought ? 'block' : 'none'));
        deleteBtn_3 && deleteBtn_3.setAttribute('data-entry-id', entry_2.id);
        overlay_3.style.display = 'flex';
        requestAnimationFrame(() => {
            overlay_3.classList.add('active');
        });
    }
    function hideCherishedMemoryDetail_3() {
        const chatMemoryCherishedDetailOverlayElement_587 = document.getElementById(
            'chat-memory-cherished-detail-overlay',
        );
        if (!chatMemoryCherishedDetailOverlayElement_587) return;
        chatMemoryCherishedDetailOverlayElement_587.classList.remove('active');
        setTimeout(() => {
            !chatMemoryCherishedDetailOverlayElement_587.classList.contains('active') &&
                (chatMemoryCherishedDetailOverlayElement_587.style.display = 'none');
        }, 220);
    }
    function renderCherishedMemoryCards_3(friend_39) {
        return;
    }
    async function saveChatSettingsMemory(friend_40, options_5 = {}) {
        if (!friend_40) return false;
        friend_40 = window.imApp.getFriendById?.(friend_40) || friend_40;
        const shouldToast = !!options_5.showToast,
            chatMemoryOverviewInput_2 = document.getElementById('chat-memory-overview-input'),
            chatMemoryContextEnabled = document.getElementById(
                'chat-memory-context-enabled-toggle',
            ),
            chatMemoryContextLimit_2 = document.getElementById('chat-memory-context-limit-input'),
            chatMemoryCherishedInput_2 = document.getElementById('chat-memory-cherished-input'),
            chatMemoryScheduleSleep = document.getElementById('chat-memory-schedule-sleep-input'),
            chatMemoryScheduleWake = document.getElementById('chat-memory-schedule-wake-input'),
            nextMemory = {
                ...window.imApp.createDefaultMemory(),
                ...(friend_40.memory || {}),
                overview: chatMemoryOverviewInput_2 ? chatMemoryOverviewInput_2.value : '',
                context: {
                    enabled: chatMemoryContextEnabled ? chatMemoryContextEnabled.checked : true,
                    limit:
                        chatMemoryContextLimit_2 && Number(chatMemoryContextLimit_2.value) > 0
                            ? Number(chatMemoryContextLimit_2.value)
                            : 50,
                    notes: friend_40.memory?.context?.notes || '',
                },
                summary: {
                    enabled: !!friend_40.memory?.summary?.enabled,
                    limit: friend_40.memory?.summary?.limit || 80,
                    roundLimit: window.imDataUtils?.normalizeRoundLimit
                        ? window.imDataUtils.normalizeRoundLimit(
                              friend_40.memory?.summary?.roundLimit,
                              30,
                          )
                        : Number(friend_40.memory?.summary?.roundLimit) || 30,
                    prompt: friend_40.memory?.summary?.prompt || '',
                    apiPresetId: String(friend_40.memory?.summary?.apiPresetId || ''),
                },
                autonomous: window.imApp.normalizeAutonomousActivity
                    ? window.imApp.normalizeAutonomousActivity(friend_40.memory?.autonomous)
                    : {
                          enabled: false,
                          minIntervalMinutes: 30,
                          maxIntervalMinutes: 240,
                          nextRunAt: 0,
                          lastRunAt: 0,
                      },
                longTerm: friend_40.memory?.longTerm || '',
                shortTermEntries: Array.isArray(friend_40.memory?.shortTermEntries)
                    ? friend_40.memory.shortTermEntries
                    : [],
                cherished: chatMemoryCherishedInput_2
                    ? chatMemoryCherishedInput_2.value
                    : friend_40.memory?.cherished || '',
                schedule: {
                    ...(friend_40.memory?.schedule || {}),
                    enabled: !!friend_40.memory?.schedule?.enabled,
                    sleepTime: chatMemoryScheduleSleep
                        ? chatMemoryScheduleSleep.value
                        : friend_40.memory?.schedule?.sleepTime || '23:00',
                    wakeTime: chatMemoryScheduleWake
                        ? chatMemoryScheduleWake.value
                        : friend_40.memory?.schedule?.wakeTime || '07:00',
                    events: Array.isArray(friend_40.memory?.schedule?.events)
                        ? friend_40.memory.schedule.events
                        : [],
                },
                relationships: Array.isArray(friend_40.memory?.relationships)
                    ? friend_40.memory.relationships
                    : [],
            },
            commitOptions = {
                silent: options_5.silent !== false,
                immediate: options_5.immediate,
                delay: options_5.delay,
            },
            saved_17 = await commitNamedFriendChange(
                friend_40,
                (targetFriend_13) => {
                    const preservedAutonomous = window.imApp.normalizeAutonomousActivity
                        ? window.imApp.normalizeAutonomousActivity(
                              targetFriend_13.memory?.autonomous || nextMemory.autonomous,
                          )
                        : nextMemory.autonomous;
                    targetFriend_13.memory = {
                        ...nextMemory,
                        autonomous: preservedAutonomous,
                    };
                },
                commitOptions,
            );
        if (!saved_17) {
            if (shouldToast) showToast_2('记忆设置保存失败');
            return false;
        }
        if (shouldToast) showToast_2('记忆设置已保存');
        const currentSettingsFriend_5 = window.imApp.getFriendById?.(friend_40) || friend_40;
        return (
            window.imData.currentSettingsFriend &&
                String(window.imData.currentSettingsFriend.id) ===
                    String(currentSettingsFriend_5.id) &&
                (window.imData.currentSettingsFriend = currentSettingsFriend_5),
            true
        );
    }
    function handleAction_49() {
        const ids = [
            'chat-memory-overview-input',
            'chat-memory-context-enabled-toggle',
            'chat-memory-context-limit-input',
            'chat-memory-cherished-input',
            'chat-memory-schedule-sleep-input',
            'chat-memory-schedule-wake-input',
        ];
        ids.forEach((value_603) => {
            const el_3 = document.getElementById(value_603);
            if (!el_3) return;
            if (el_3.dataset.chatMemoryBound === 'true') return;
            const schedulePersist = async () => {
                    const currentFriend_7 = window.imData.currentSettingsFriend;
                    if (!currentFriend_7) return;
                    await saveChatSettingsMemory(currentFriend_7, {
                        showToast: false,
                        silent: true,
                        immediate: false,
                        delay: 900,
                    });
                },
                flushPersist = async () => {
                    const currentFriend_8 = window.imData.currentSettingsFriend;
                    if (!currentFriend_8) return;
                    await saveChatSettingsMemory(currentFriend_8, {
                        showToast: false,
                        silent: true,
                        immediate: true,
                    });
                };
            el_3.tagName === 'TEXTAREA' || el_3.type === 'number' || el_3.type === 'text'
                ? (el_3.addEventListener('input', schedulePersist),
                  el_3.addEventListener('blur', flushPersist))
                : el_3.addEventListener('change', flushPersist);
            el_3.dataset.chatMemoryBound = 'true';
        });
    }
    const manualSummaryBtn = document.getElementById('chat-memory-manual-summary-btn'),
        manualSummaryModal = document.getElementById('chat-memory-summary-modal'),
        manualSummaryClose = document.getElementById('chat-memory-summary-close'),
        manualSummaryConfirm = document.getElementById('chat-memory-summary-confirm'),
        manualSummaryCountInput = document.getElementById('chat-memory-summary-count-input'),
        manualSummaryUnsummarizedCount = document.getElementById('chat-memory-unsummarized-count'),
        manualSummaryBatchCount = document.getElementById('chat-memory-summary-batch-count'),
        autoSummaryToggle = document.getElementById('chat-memory-auto-summary-toggle'),
        summaryRoundInput = document.getElementById('chat-memory-summary-round-input'),
        summaryHint = document.getElementById('chat-memory-summary-hint'),
        summaryApiSelect = document.getElementById('chat-memory-summary-api-select'),
        summaryPromptInput = document.getElementById('chat-memory-summary-prompt-input'),
        summaryPromptClear = document.getElementById('chat-memory-summary-prompt-clear'),
        autonomousBtn = document.getElementById('chat-memory-autonomous-btn'),
        autonomousSheet = document.getElementById('chat-memory-autonomous-sheet'),
        autonomousClose = document.getElementById('chat-memory-autonomous-close-btn'),
        autonomousSaveBtn = document.getElementById('chat-memory-autonomous-save-btn'),
        autonomousToggle = document.getElementById('chat-memory-autonomous-enabled-toggle'),
        autonomousStatus = document.getElementById('chat-memory-autonomous-status'),
        autonomousNextLabel = document.getElementById('chat-memory-autonomous-next-label'),
        autonomousReplyMinInput = document.getElementById('chat-memory-autonomous-reply-min-input'),
        autonomousReplyMaxInput = document.getElementById('chat-memory-autonomous-reply-max-input'),
        autonomousMomentToggle = document.getElementById('chat-memory-autonomous-moment-toggle'),
        autonomousMomentMinInput = document.getElementById(
            'chat-memory-autonomous-moment-min-input',
        ),
        autonomousMomentMaxInput = document.getElementById(
            'chat-memory-autonomous-moment-max-input',
        ),
        autonomousMomentNextLabel = document.getElementById(
            'chat-memory-autonomous-moment-next-label',
        ),
        summaryInFlight = new Set(),
        chatBackgroundOperationTokens_2 = new Map(),
        value_52 = new Map();
    function setAutonomousCardExpanded(toggleEl, expanded) {
        const card = toggleEl?.closest?.('.chat-memory-autonomous-card');
        if (card) card.classList.toggle('is-enabled', !!expanded);
    }
    function normalizeAutonomousActivity_2(activity) {
        return window.imApp.normalizeAutonomousActivity
            ? window.imApp.normalizeAutonomousActivity(activity)
            : {
                  reply: normalizeAutonomousTask_2(activity?.reply || activity),
                  moment: normalizeAutonomousTask_2(activity?.moment),
              };
    }
    function normalizeAutonomousTask_2(task) {
        return window.imApp.normalizeAutonomousTask
            ? window.imApp.normalizeAutonomousTask(task)
            : {
                  enabled: !!task?.enabled,
                  minIntervalMinutes: Math.max(
                      1,
                      Math.round(Number(task?.minIntervalMinutes) || 30),
                  ),
                  maxIntervalMinutes: Math.max(
                      Math.max(1, Math.round(Number(task?.minIntervalMinutes) || 30)),
                      Math.round(Number(task?.maxIntervalMinutes) || 240),
                  ),
                  nextRunAt: Math.max(0, Number(task?.nextRunAt) || 0),
                  lastRunAt: Math.max(0, Number(task?.lastRunAt) || 0),
              };
    }
    function getRandomAutonomousDelay(value_609) {
        const normalized_2 = normalizeAutonomousTask_2(value_609),
            min_2 = Math.max(1, Number(normalized_2.minIntervalMinutes) || 30),
            max_2 = Math.max(min_2, Number(normalized_2.maxIntervalMinutes) || 240),
            minutes = min_2 + Math.floor(Math.random() * (max_2 - min_2 + 1));
        return minutes * 60 * 1000;
    }
    function formatAutonomousNextTime(timestamp_2) {
        const value_5 = Number(timestamp_2) || 0;
        if (value_5 <= 0) return '等待下次随机触发';
        const date = new Date(value_5);
        if (Number.isNaN(date.getTime())) return '等待下次随机触发';
        return (
            '下次约 ' +
            (date.getMonth() + 1) +
            '月' +
            date.getDate() +
            '日 ' +
            String(date.getHours()).padStart(2, '0') +
            ':' +
            String(date.getMinutes()).padStart(2, '0')
        );
    }
    function getAutonomousIntervalValues(minInput_2, maxInput_2, value_618) {
        const fallback = normalizeAutonomousTask_2(value_618),
            minValue = Math.max(
                1,
                Math.round(Number(minInput_2?.value) || fallback.minIntervalMinutes || 30),
            ),
            maxIntervalMinutes_2 = Math.max(
                minValue,
                Math.round(Number(maxInput_2?.value) || fallback.maxIntervalMinutes || 240),
            );
        return {
            minIntervalMinutes: minValue,
            maxIntervalMinutes: maxIntervalMinutes_2,
        };
    }
    function setAutonomousIntervalInputs(task_2, minInput, maxInput) {
        const normalized = normalizeAutonomousTask_2(task_2);
        if (minInput) minInput.value = String(normalized.minIntervalMinutes);
        if (maxInput) maxInput.value = String(normalized.maxIntervalMinutes);
    }
    function buildAutonomousTaskFromControls(value_623, value_624, minInput_3, maxInput_3) {
        const nextTask = normalizeAutonomousTask_2(value_623),
            intervalValues = getAutonomousIntervalValues(minInput_3, maxInput_3, nextTask);
        return (
            (nextTask.enabled = !!value_624),
            (nextTask.minIntervalMinutes = intervalValues.minIntervalMinutes),
            (nextTask.maxIntervalMinutes = intervalValues.maxIntervalMinutes),
            nextTask.enabled
                ? (nextTask.nextRunAt = Date.now() + getRandomAutonomousDelay(nextTask))
                : (nextTask.nextRunAt = 0),
            nextTask
        );
    }
    function handleAction_58(friend_41) {
        const activity_2 = normalizeAutonomousActivity_2(friend_41?.memory?.autonomous),
            replyTask = normalizeAutonomousTask_2(activity_2.reply),
            momentTask = normalizeAutonomousTask_2(activity_2.moment);
        autonomousStatus &&
            ((autonomousStatus.textContent =
                replyTask.enabled && momentTask.enabled
                    ? '全部开启'
                    : replyTask.enabled
                      ? '回复开启'
                      : momentTask.enabled
                        ? '朋友圈开启'
                        : '关闭'),
            (autonomousStatus.style.color =
                replyTask.enabled || momentTask.enabled ? '#34c759' : '#8e8e93'));
        if (autonomousToggle) autonomousToggle.checked = !!replyTask.enabled;
        if (autonomousMomentToggle) autonomousMomentToggle.checked = !!momentTask.enabled;
        setAutonomousCardExpanded(autonomousToggle, replyTask.enabled);
        setAutonomousCardExpanded(autonomousMomentToggle, momentTask.enabled);
        setAutonomousIntervalInputs(replyTask, autonomousReplyMinInput, autonomousReplyMaxInput);
        setAutonomousIntervalInputs(momentTask, autonomousMomentMinInput, autonomousMomentMaxInput);
        autonomousNextLabel &&
            (autonomousNextLabel.textContent = replyTask.enabled
                ? formatAutonomousNextTime(replyTask.nextRunAt)
                : '关闭后不会主动发消息');
        autonomousMomentNextLabel &&
            (autonomousMomentNextLabel.textContent = momentTask.enabled
                ? formatAutonomousNextTime(momentTask.nextRunAt)
                : '关闭后不会自动发朋友圈');
    }
    function handleAction_59(value_632) {
        if (!value_632 || !autonomousSheet) return;
        value_632.memory = window.imApp.normalizeFriendData(value_632).memory;
        handleAction_58(value_632);
        window.openView
            ? window.openView(autonomousSheet)
            : (autonomousSheet.classList.add('active'), (autonomousSheet.style.display = 'flex'));
    }
    async function handleClick() {
        const friend_42 = window.imData.currentSettingsFriend;
        if (!friend_42 || !autonomousSaveBtn) return;
        const replyEnabled = !!autonomousToggle?.checked,
            momentEnabled = !!autonomousMomentToggle?.checked;
        autonomousSaveBtn.textContent = '保存中...';
        autonomousSaveBtn.style.pointerEvents = 'none';
        try {
            const saved_18 = await commitNamedFriendChange(
                friend_42,
                (targetFriend_14) => {
                    targetFriend_14.memory =
                        window.imApp.normalizeFriendData(targetFriend_14).memory;
                    const activity_3 = normalizeAutonomousActivity_2(
                        targetFriend_14.memory.autonomous,
                    );
                    activity_3.reply = buildAutonomousTaskFromControls(
                        activity_3.reply,
                        replyEnabled,
                        autonomousReplyMinInput,
                        autonomousReplyMaxInput,
                    );
                    activity_3.moment = buildAutonomousTaskFromControls(
                        activity_3.moment,
                        momentEnabled,
                        autonomousMomentMinInput,
                        autonomousMomentMaxInput,
                    );
                    targetFriend_14.memory.autonomous = activity_3;
                },
                {
                    silent: true,
                    immediate: true,
                },
            );
            if (!saved_18) {
                showToast_2('自主活动保存失败');
                return;
            }
            const currentSettingsFriend_6 =
                window.imData.friends.find(
                    (value_638) => String(value_638.id) === String(friend_42.id),
                ) || friend_42;
            currentSettingsFriend_6.memory =
                window.imApp.normalizeFriendData(currentSettingsFriend_6).memory;
            window.imData.currentSettingsFriend = currentSettingsFriend_6;
            handleAction_58(currentSettingsFriend_6);
            window.imChat?.refreshAutonomousActivityTimers &&
                window.imChat.refreshAutonomousActivityTimers();
            showToast_2(replyEnabled || momentEnabled ? '自主活动已保存' : '自主活动已关闭');
            if (autonomousSheet && window.closeView) window.closeView(autonomousSheet);
        } finally {
            autonomousSaveBtn.textContent = '保存';
            autonomousSaveBtn.style.pointerEvents = '';
        }
    }
    function handleAction_61(value_639, value_640) {
        if (Array.isArray(value_640)) return value_640.length;
        return window.imApp.getFriendMessageCount
            ? window.imApp.getFriendMessageCount(value_639)
            : Number(value_639?.messageCount) ||
                  (Array.isArray(value_639?.messages) ? value_639.messages.length : 0);
    }
    function handleAction_62(value_641, value_642) {
        const value_643 = Array.isArray(value_642) ? value_642 : [],
            value_644 = window.imDataUtils?.resolveSummaryStartIndex
                ? window.imDataUtils.resolveSummaryStartIndex(
                      value_643,
                      value_641?.memory?.summaryCursor,
                      value_641?.memory?.lastSummaryMessageCount,
                      value_641?.memory?.shortTermEntries,
                  )
                : Math.min(
                      value_643.length,
                      Math.max(0, Number(value_641?.memory?.lastSummaryMessageCount) || 0),
                  );
        return Math.max(0, handleAction_61(value_641, value_643) - value_644);
    }
    function isSourceMessage_2(message_4) {
        if (!message_4) return false;
        if (message_4.privateFromGroup) return false;
        if (message_4.payload?.privateFromGroup) return false;
        if (message_4.privateChatSnapshot) return false;
        if (message_4.payload?.privateChatSnapshot) return false;
        const noticeKind_2 = String(message_4.noticeKind || '').trim();
        if (
            noticeKind_2 === 'group_private_to_user' ||
            noticeKind_2 === 'group_friend_private_chat'
        )
            return false;
        return true;
    }
    function getAutonomousIntervalValues_2(value_647, roundLimit_2, value_649) {
        const messages_3 = Array.isArray(value_649)
                ? value_649
                : chatBackgroundOperationTokens_2.get(String(value_647?.id || '')) || [],
            legacyCount_2 = Math.max(0, Number(value_647?.memory?.lastSummaryMessageCount) || 0),
            value_652 = value_647?.memory?.summaryCursor || {
                count: legacyCount_2,
            },
            limit_2 = window.imDataUtils?.normalizeRoundLimit
                ? window.imDataUtils.normalizeRoundLimit(roundLimit_2, 30)
                : Math.max(1, Math.round(Number(roundLimit_2) || 30));
        if (value_647?.type === 'group') {
            if (window.imDataUtils?.getGroupSummaryBatch)
                return window.imDataUtils.getGroupSummaryBatch(
                    messages_3,
                    value_652,
                    roundLimit_2,
                    {
                        legacyCount: legacyCount_2,
                        summaryEntries: value_647?.memory?.shortTermEntries,
                        isSourceMessage: isSourceMessage_2,
                    },
                );
        }
        if (window.imDataUtils?.getSummaryBatch)
            return window.imDataUtils.getSummaryBatch(messages_3, value_652, roundLimit_2, {
                legacyCount: legacyCount_2,
                summaryEntries: value_647?.memory?.shortTermEntries,
            });
        const startIndex_2 = Math.min(legacyCount_2, messages_3.length),
            pending = messages_3.slice(startIndex_2),
            availableRounds_2 = pending.filter((message_5) => message_5?.role === 'user').length;
        return {
            startIndex: startIndex_2,
            endIndex: messages_3.length,
            roundLimit: limit_2,
            availableRounds: availableRounds_2,
            unsummarizedMessageCount: pending.length,
            selectedRounds: Math.min(limit_2, availableRounds_2),
            selectedMessageCount: pending.length,
            selectedMessages: pending,
            ready: availableRounds_2 >= limit_2,
        };
    }
    function handleAction_65(value_658, value_659) {
        if (!value_658 || !Array.isArray(value_659)) return false;
        value_658.memory = window.imApp.normalizeFriendData(value_658).memory;
        const value_660 = value_658.memory.summaryCursor || {
                messageId: '',
                order: -1,
                count: 0,
            },
            lastSummaryMessageCount_2 = window.imDataUtils?.resolveSummaryStartIndex
                ? window.imDataUtils.resolveSummaryStartIndex(
                      value_659,
                      value_660,
                      value_658.memory.lastSummaryMessageCount,
                      value_658.memory.shortTermEntries,
                  )
                : Math.min(
                      value_659.length,
                      Math.max(0, Number(value_658.memory.lastSummaryMessageCount) || 0),
                  ),
            value_662 =
                lastSummaryMessageCount_2 > 0 ? value_659[lastSummaryMessageCount_2 - 1] : null,
            summaryCursor_2 = {
                messageId: String(value_662?.id || '').trim(),
                order: Number.isFinite(Number(value_662?.__messageOrder))
                    ? Number(value_662.__messageOrder)
                    : lastSummaryMessageCount_2 - 1,
                count: lastSummaryMessageCount_2,
            },
            value_664 =
                String(value_660.messageId || '') !== summaryCursor_2.messageId ||
                Number(value_660.order) !== summaryCursor_2.order ||
                Number(value_660.count) !== summaryCursor_2.count ||
                Number(value_658.memory.lastSummaryMessageCount) !== lastSummaryMessageCount_2;
        if (!value_664) return false;
        return (
            (value_658.memory.summaryCursor = summaryCursor_2),
            (value_658.memory.lastSummaryMessageCount = lastSummaryMessageCount_2),
            window.imStorage?.patchFriendMeta &&
                Promise.resolve(
                    window.imStorage.patchFriendMeta(value_658.id, {
                        memory: value_658.memory,
                    }),
                )['catch']((value_665) =>
                    console.warn('Failed to repair chat summary cursor', value_658.id, value_665),
                ),
            true
        );
    }
    async function handleAction_66(value_666) {
        if (!value_666) throw new Error('Chat not found');
        const friendId_5 = String(value_666.id);
        value_52.set(friendId_5, 'loading');
        try {
            let value_668;
            if (window.imStorage?.loadMessageIndexByFriendId)
                value_668 = await window.imStorage.loadMessageIndexByFriendId(value_666.id);
            else {
                if (window.imApp.ensureFriendMessagesLoaded) {
                    const messages_4 = await window.imApp.ensureFriendMessagesLoaded(value_666, {
                        requireComplete: true,
                    });
                    value_668 = {
                        messages: messages_4,
                        totalCount: messages_4.length,
                    };
                } else throw new Error('Complete chat history reader is unavailable');
            }
            const token_3 = Array.isArray(value_668?.messages) ? value_668.messages : [];
            return (
                chatBackgroundOperationTokens_2.set(friendId_5, token_3),
                value_52.set(friendId_5, 'ready'),
                window.imApp.repairFriendMessageCount?.(value_666, value_668?.totalCount),
                handleAction_65(value_666, token_3),
                token_3
            );
        } catch (value_671) {
            value_52.set(friendId_5, 'error');
            throw value_671;
        }
    }
    function formatSummarySourceMessage(msg_2, friend_43) {
        if (friend_43?.type === 'group' && window.imApp.formatMessageForApiContext) {
            const formatted = window.imApp.formatMessageForApiContext(msg_2, friend_43, {
                    userName: userState_2?.name || 'User',
                }),
                value_678 = msg_2.timestamp
                    ? new Date(msg_2.timestamp).toLocaleString('zh-CN', {
                          hour12: false,
                      })
                    : '';
            return (
                '[' + value_678 + '] ' + (formatted?.content || msg_2.content || msg_2.text || '')
            );
        }
        const speaker_2 =
                msg_2.role === 'assistant'
                    ? friend_43.nickname || friend_43.realname || friend_43.realName || 'Char'
                    : userState_2?.name || 'User',
            value_675 = msg_2.timestamp
                ? new Date(msg_2.timestamp).toLocaleString('zh-CN', {
                      hour12: false,
                  })
                : '',
            content_3 = msg_2.content || msg_2.text || '';
        return '[' + value_675 + '] ' + speaker_2 + ': ' + content_3;
    }
    function normalizeSummaryApiEndpoint(config) {
        return window.u2Api.resolveChatCompletionsEndpoint(config.endpoint || '');
    }
    function parseSummaryDate_2(value_679) {
        const endpoint_2 = String(value_679?.endpoint || '').trim(),
            apiKey_2 = String(value_679?.apiKey || '').trim(),
            model_2 = String(value_679?.model || '').trim();
        if (!endpoint_2)
            throw createSummaryFailureError({
                kind: 'configuration',
                message: '请填写摘要 API 地址',
            });
        if (!apiKey_2)
            throw createSummaryFailureError({
                kind: 'configuration',
                message: '请填写摘要 API 密钥',
            });
        if (!model_2)
            throw createSummaryFailureError({
                kind: 'configuration',
                message: '请填写摘要 API 模型名称',
            });
        try {
            window.u2Api?.validateApiConfig &&
                window.u2Api.validateApiConfig({
                    ...value_679,
                    endpoint: endpoint_2,
                    apiKey: apiKey_2,
                    model: model_2,
                });
        } catch (value_683) {
            throw createSummaryFailureError({
                kind: 'configuration',
                message: value_683?.message || '摘要 API 配置无效',
            });
        }
        return {
            ...value_679,
            endpoint: endpoint_2,
            apiKey: apiKey_2,
            model: model_2,
        };
    }
    function getSummaryResponseContent(data) {
        const firstChoice = data?.choices?.[0];
        if (!firstChoice) return '';
        return firstChoice.message?.content || firstChoice.text || firstChoice.delta?.content || '';
    }
    function getSummaryEntryTime(entry_3) {
        return entry_3?.lastActivatedAt || entry_3?.time || entry_3?.createdAt || '';
    }
    function parseSummaryDate(value_6_2) {
        if (!value_6_2) return null;
        if (typeof value_6_2 === 'number') {
            const numericDate = new Date(value_6_2);
            return Number.isNaN(numericDate.getTime()) ? null : numericDate;
        }
        const text_2 = String(value_6_2).trim(),
            normalized_3 = text_2
                .replace(/年/g, '-')
                .replace(/月/g, '-')
                .replace(/日/g, ' ')
                .replace(/\./g, '-')
                .replace(/\//g, '-'),
            value_688 = new Date(normalized_3);
        return Number.isNaN(value_688.getTime()) ? null : value_688;
    }
    function decayShortTermMemoryEntries(entries_5, now_2 = new Date(), activatedIds = new Set()) {
        if (!Array.isArray(entries_5)) return [];
        const dayMs = 86400000;
        return entries_5.map((entry_4) => {
            if (!entry_4) return entry_4;
            if (activatedIds.has(String(entry_4.id))) return entry_4;
            const anchorDate = parseSummaryDate(getSummaryEntryTime(entry_4));
            if (!anchorDate) return entry_4;
            const ageDays = (now_2.getTime() - anchorDate.getTime()) / dayMs;
            if (ageDays > 30) entry_4.degree = '遗忘';
            else {
                if (ageDays > 7) entry_4.degree = '低';
                else ageDays > 1 && entry_4.degree === '高' && (entry_4.degree = '中');
            }
            return entry_4;
        });
    }
    function handleAction_4(friend_44, value_698 = []) {
        const entries_6 = Array.isArray(friend_44?.memory?.shortTermEntries)
            ? friend_44.memory.shortTermEntries
            : [];
        if (entries_6.length === 0) return '无';
        const toLocaleLowerCase_700 = (Array.isArray(value_698) ? value_698 : [])
                .map(
                    (message_703) =>
                        (message_703?.content || message_703?.text || '') +
                        ' ' +
                        (message_703?.translation || ''),
                )
                .join(' ')
                .toLocaleLowerCase(),
            max_701 = Math.max(1, Math.round(Number(friend_44?.memory?.summary?.limit) || 80)),
            slice_702 = entries_6
                .map((entry_5, index_3) => {
                    const value_706 = window.imChat?.getShortTermMemoryTags
                            ? window.imChat.getShortTermMemoryTags(entry_5)
                            : entry_5.memoryTags || entry_5.triggerKeywords || [],
                        relevance_2 = value_706.reduce(
                            (value_708, value_709) =>
                                value_708 +
                                (toLocaleLowerCase_700.includes(
                                    String(value_709 || '').toLocaleLowerCase(),
                                )
                                    ? 1
                                    : 0),
                            0,
                        );
                    return {
                        entry: entry_5,
                        index: index_3,
                        relevance: relevance_2,
                        timestamp: parseSummaryDate(getSummaryEntryTime(entry_5))?.getTime() || 0,
                    };
                })
                .sort(
                    (message_710, message_711) =>
                        message_711.relevance - message_710.relevance ||
                        message_711.timestamp - message_710.timestamp ||
                        message_711.index - message_710.index,
                )
                .slice(0, max_701);
        return slice_702.map(({ entry: entry_9 }) =>
            [
                'ID: ' + entry_9.id,
                '标题: ' + (entry_9.title || '对话总结'),
                '时间: ' + (entry_9.time || ''),
                '事件: ' + (entry_9.event || ''),
                '记忆点: ' + (entry_9.memoryPoints || ''),
                '记忆标签: ' +
                    (window.imChat?.getShortTermMemoryTags
                        ? window.imChat.getShortTermMemoryTags(entry_9)
                        : entry_9.memoryTags || entry_9.triggerKeywords || []
                    ).join('、'),
                '记忆程度: ' + (entry_9.degree || '高'),
            ].join(`
`),
        ).join(`

`);
    }
    function handleAction_71(raw_2) {
        const cleanText = String(raw_2 || '')
            .trim()
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/i, '');
        if (!cleanText)
            throw createSummaryFailureError({
                kind: 'response_format',
            });
        try {
            const parsed = JSON.parse(cleanText),
                summaryPayload =
                    parsed.summary && typeof parsed.summary === 'object' ? parsed.summary : parsed;
            if (
                !summaryPayload ||
                typeof summaryPayload !== 'object' ||
                Array.isArray(summaryPayload)
            )
                throw new Error('Summary payload must be an object');
            let memoryPointsData = summaryPayload.memoryPoints || summaryPayload.记忆点 || '',
                memoryPoints_2 = '';
            if (Array.isArray(memoryPointsData))
                memoryPoints_2 = memoryPointsData.join('，').trim();
            else
                typeof memoryPointsData === 'object' && memoryPointsData !== null
                    ? (memoryPoints_2 = Object.entries(memoryPointsData)
                          .map(([value_723, value_724]) => value_723 + ':' + value_724)
                          .join('，')
                          .trim())
                    : (memoryPoints_2 = String(memoryPointsData).trim());
            const memoryTags_2 = window.imChat?.normalizeMemoryTriggerKeywords
                    ? window.imChat.normalizeMemoryTriggerKeywords(
                          summaryPayload.memoryTags || summaryPayload.记忆标签 || [],
                      )
                    : Array.isArray(summaryPayload.memoryTags)
                      ? summaryPayload.memoryTags
                      : [],
                title_3 = String(summaryPayload.title || summaryPayload.标题 || '').trim(),
                event_6 = String(summaryPayload.event || summaryPayload.事件 || '').trim(),
                memoryTags_3 = memoryTags_2
                    .map((value_725) => String(value_725 || '').trim())
                    .filter(Boolean)
                    .slice(0, 6);
            if (!title_3 || !event_6 || !memoryPoints_2 || memoryTags_3.length === 0)
                throw new Error('Summary fields are incomplete');
            return {
                activatedEntryIds: Array.isArray(parsed.activatedEntryIds)
                    ? parsed.activatedEntryIds.map(String)
                    : [],
                title: title_3,
                time: summaryPayload.time || summaryPayload.时间 || '',
                event: event_6,
                memoryPoints: memoryPoints_2,
                memoryTags: memoryTags_3,
                triggerKeywords: window.imChat?.normalizeMemoryTriggerKeywords
                    ? window.imChat.normalizeMemoryTriggerKeywords(memoryTags_3)
                    : memoryTags_3,
                degree: summaryPayload.degree || summaryPayload.记忆程度 || '高',
                raw: raw_2,
            };
        } catch (value_726) {
            if (value_726?.summaryFailure) throw value_726;
            throw createSummaryFailureError({
                kind: 'response_format',
            });
        }
    }
    function parseShortTermMemoryPromotionDraft(value_727, fallback_2 = {}) {
        const cleanText_2 = String(value_727 || '')
            .trim()
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/i, '');
        let payload_2 = {};
        try {
            payload_2 = JSON.parse(cleanText_2);
        } catch (value_735) {
            throw createSummaryFailureError({
                kind: 'response_format',
            });
        }
        const title_2 = String(payload_2?.title || '').trim(),
            content_4 = String(payload_2?.content || payload_2?.memory || '').trim(),
            rawTags = payload_2?.triggerKeywords || payload_2?.memoryTags || [],
            triggerKeywords_2 = window.imChat?.normalizeMemoryTriggerKeywords
                ? window.imChat.normalizeMemoryTriggerKeywords(rawTags)
                : (Array.isArray(rawTags) ? rawTags : [rawTags])
                      .map((value_7) => String(value_7 || '').trim())
                      .filter(Boolean)
                      .slice(0, 6);
        if (!title_2 || !content_4 || triggerKeywords_2.length === 0)
            throw createSummaryFailureError({
                kind: 'response_format',
            });
        return {
            title: title_2,
            content: content_4,
            time: String(payload_2?.time || fallback_2.time || '').trim(),
            triggerKeywords: triggerKeywords_2.slice(0, 6),
        };
    }
    function getSummaryApiPresets() {
        const presets = typeof window.getApiPresets === 'function' ? window.getApiPresets() : [];
        return Array.isArray(presets) ? presets : [];
    }
    function getSummaryEntryTime_2(value_737) {
        const string_738 = String(value_737?.memory?.summary?.apiPresetId || ''),
            selectedPreset = string_738
                ? getSummaryApiPresets().find((preset_2) => String(preset_2?.id) === string_738)
                : null;
        if (selectedPreset)
            return {
                provider: selectedPreset.provider || 'openai-compatible',
                endpoint: selectedPreset.endpoint || '',
                apiKey: selectedPreset.apiKey || '',
                model: selectedPreset.model || '',
                temperature: selectedPreset.temperature ?? selectedPreset.temp ?? 0.7,
                frequencyPenalty: selectedPreset.frequencyPenalty ?? 0,
                presetId: string_738,
            };
        const current = window.getApiConfig ? window.getApiConfig() : window.apiConfig || {};
        return {
            ...current,
            presetId: '',
        };
    }
    window.imApp.generateShortTermMemoryPromotionDraft = async function (value_136, sourceEntries) {
        const entry_8 = window.imApp.getFriendById?.(value_136) || value_136,
            entries_7 = (Array.isArray(sourceEntries) ? sourceEntries : [])
                .filter((entry_6) => entry_6 && entry_6.id != null)
                .map((entry_7) => ({
                    ...entry_7,
                }));
        if (!entry_8 || entries_7.length === 0) throw new Error('请选择至少一条短期记忆');
        const anchorDate_2 = parseSummaryDate_2(getSummaryEntryTime_2(entry_8)),
            value_140 = entry_8.nickname || entry_8.realname || entry_8.realName || 'Char',
            value_141 = entry_8.type === 'group',
            join_142 = entries_7.map((message_152, value_156) =>
                [
                    '条目 ' + (value_156 + 1) + '（ID: ' + message_152.id + '）',
                    '标题: ' + (message_152.title || '对话总结'),
                    '时间: ' + (message_152.time || message_152.createdAt || '未记录'),
                    '事件: ' + (message_152.event || message_152.content || ''),
                    '记忆点: ' + (message_152.memoryPoints || ''),
                    '标签: ' +
                        (window.imChat?.getShortTermMemoryTags
                            ? window.imChat.getShortTermMemoryTags(message_152)
                            : message_152.memoryTags || message_152.triggerKeywords || []
                        ).join('、'),
                ].join(`
`),
            ).join(`

`),
            string_143 = String(
                entries_7[entries_7.length - 1]?.time ||
                    entries_7[entries_7.length - 1]?.createdAt ||
                    '',
            ),
            value_145 = value_141
                ? `
群聊隐私约束（最高优先级）：
- 输入仅应来自该群公开总结；只保留公开发生的事实。
- 禁止写入、推断或复述任何成员私信、好友私聊、私密想法或未公开信息。
- 必须使用第三人称描述群聊共同事件。`
                : `
单聊约束：
- 只合并输入条目中已经明确存在的事实，不得补写、猜测或虚构细节。
- 用 ` +
                  value_140 +
                  ' 与 User 的长期关系和稳定偏好可理解的简洁表述。',
            content_5 =
                '你是记忆整理员。请把以下 ' +
                entries_7.length +
                ' 条短期记忆合并为一条可长期保存的记忆。保留稳定事实、承诺、偏好、关系变化和未完成事项；去掉重复与瞬时细节。' +
                value_145 +
                `

只输出可解析 JSON，禁止 markdown 或解释，结构必须完全如下：
{
  "title": "不超过16字的标题",
  "time": "沿用输入中最晚的相关时间，不确定则留空",
  "content": "60-180字的长期记忆正文",
  "triggerKeywords": ["3到6个可单独触发的简短标签"]
}

短期记忆：
` +
                join_142,
            value_753 = await fetch(normalizeSummaryApiEndpoint(anchorDate_2), {
                method: 'POST',
                headers: window.u2Api?.buildApiHeaders
                    ? window.u2Api.buildApiHeaders(anchorDate_2, {
                          'X-U2-Silent-Errors': '1',
                      })
                    : {
                          'Content-Type': 'application/json',
                          Authorization: 'Bearer ' + anchorDate_2.apiKey,
                      },
                body: JSON.stringify({
                    model: anchorDate_2.model || '',
                    messages: [
                        {
                            role: 'system',
                            content: '你只输出可解析 JSON。',
                        },
                        {
                            role: 'user',
                            content: content_5,
                        },
                    ],
                    temperature: parseFloat(anchorDate_2.temperature ?? anchorDate_2.temp) || 0.7,
                }),
            });
        if (!value_753.ok) {
            const value_158 = window.u2Api?.readApiError
                ? await window.u2Api.readApiError(value_753)
                : {
                      status: value_753.status,
                      statusText: value_753.statusText || '',
                      message: value_753.statusText || '',
                  };
            throw createSummaryFailureError({
                kind: 'http',
                status: value_158.status || value_753.status,
                message: value_158.message || value_158.statusText || '',
            });
        }
        let data_2;
        try {
            data_2 = await value_753.json();
        } catch (value_159) {
            throw createSummaryFailureError({
                kind: 'response_format',
            });
        }
        return parseShortTermMemoryPromotionDraft(getSummaryResponseContent(data_2), {
            time: string_143,
        });
    };
    function refreshSummaryApiSelect(value_761) {
        if (!summaryApiSelect) return;
        const selectedId = String(value_761?.memory?.summary?.apiPresetId || ''),
            presets_2 = getSummaryApiPresets();
        summaryApiSelect.replaceChildren();
        const fallbackOption = document.createElement('option');
        fallbackOption.value = '';
        fallbackOption.textContent = '跟随当前 API';
        summaryApiSelect.appendChild(fallbackOption);
        presets_2.forEach((preset) => {
            const option_2 = document.createElement('option');
            option_2.value = String(preset?.id ?? '');
            option_2.textContent = String(preset?.name || '未命名预设');
            summaryApiSelect.appendChild(option_2);
        });
        summaryApiSelect.value = presets_2.some((preset_3) => String(preset_3?.id) === selectedId)
            ? selectedId
            : '';
    }
    function getSummaryFailureClassification(input_3 = {}) {
        if (window.imDataUtils?.classifySummaryRequestFailure)
            return window.imDataUtils.classifySummaryRequestFailure(input_3);
        const status_2 = Math.max(0, Math.round(Number(input_3.status) || 0));
        return {
            code: 'unknown',
            status: status_2,
            message: '摘要生成失败，请稍后重试' + (status_2 > 0 ? '（HTTP ' + status_2 + '）' : ''),
        };
    }
    function createSummaryFailureError(value_768 = {}) {
        const summaryFailure_2 = getSummaryFailureClassification(value_768),
            error_7 = new Error('Summary ' + summaryFailure_2.code);
        return (
            (error_7.name = 'SummaryGenerationError'),
            (error_7.summaryFailure = summaryFailure_2),
            (error_7.status = Number(summaryFailure_2.status) || 0),
            (error_7.apiDetail = String(value_768.message || '')),
            error_7
        );
    }
    function isSummaryNetworkError(error_8) {
        if (error_8?.name === 'TypeError') return true;
        return /(?:failed to fetch|networkerror|network request failed|cors)/i.test(
            String(error_8?.message || ''),
        );
    }
    function handleAction_76(friend_45, error_9) {
        const failure =
            error_9?.summaryFailure ||
            getSummaryFailureClassification({
                kind: isSummaryNetworkError(error_9) ? 'network' : 'unknown',
            });
        return (
            console.error('Manual single-chat summary failed', {
                friendId: String(friend_45?.id || ''),
                apiPresetId: String(friend_45?.memory?.summary?.apiPresetId || ''),
                category: failure.code,
                status: failure.status || 0,
                message: failure.message,
            }),
            failure
        );
    }
    async function handleAction_77(friend_46, options_6 = {}) {
        const anchorDate_3 = parseSummaryDate_2(getSummaryEntryTime_2(friend_46)),
            nextTask_2 = Array.isArray(options_6.sourceMessages)
                ? options_6.sourceMessages
                : await handleAction_66(friend_46),
            sourceRoundLimit_2 = window.imDataUtils?.normalizeRoundLimit
                ? window.imDataUtils.normalizeRoundLimit(
                      options_6.roundLimit ?? friend_46.memory?.summary?.roundLimit,
                      30,
                  )
                : Math.max(
                      1,
                      Math.round(
                          Number(options_6.roundLimit ?? friend_46.memory?.summary?.roundLimit) ||
                              30,
                      ),
                  ),
            batch = getAutonomousIntervalValues_2(friend_46, sourceRoundLimit_2, nextTask_2);
        if (options_6.requireFullBatch && !batch.ready) return null;
        const sourceMessages_2 = batch.selectedMessages;
        if (sourceMessages_2.length === 0) {
            if (!options_6.silent) showToast_2('暂无未总结对话');
            return null;
        }
        const value_166 = friend_46.nickname || friend_46.realname || friend_46.realName || 'Char',
            userName_2 = userState_2?.name || 'User',
            now_3 = new Date(),
            nowString =
                now_3.getFullYear() +
                '年' +
                String(now_3.getMonth() + 1).padStart(2, '0') +
                '月' +
                String(now_3.getDate()).padStart(2, '0') +
                '日 ' +
                String(now_3.getHours()).padStart(2, '0') +
                ':' +
                String(now_3.getMinutes()).padStart(2, '0'),
            time_2 = window.imDataUtils?.formatMemoryEventTime
                ? window.imDataUtils.formatMemoryEventTime(sourceMessages_2, now_3.getTime())
                : nowString,
            join_174 = sourceMessages_2.map((msg) => formatSummarySourceMessage(msg, friend_46))
                .join(`
`),
            handleAction_4_175 = handleAction_4(friend_46, sourceMessages_2),
            customSummaryPrompt = String(friend_46.memory?.summary?.prompt || '').trim(),
            value_177 =
                friend_46.type === 'group'
                    ? `查看已有的群聊总结，将与本次需要总结的公开群聊内容相关的记忆条目激活（记忆程度改为高）。

已有群聊总结：
` +
                      handleAction_4_175 +
                      `

你是群聊记录整理员。请用第三人称总结群聊「` +
                      value_166 +
                      '」中的公开聊天，把以下' +
                      batch.selectedRounds +
                      '轮、共' +
                      sourceMessages_2.length +
                      `条公开消息整理为一份可供后续回顾的完整记录。按实际发生顺序保留事件缘由、参与者的立场与行动、关键对话或决定、情绪与氛围变化、最终结果、承诺和未解决事项；只整合真实公开内容，不要逐条复述，也不要虚构细节。

当前真实总结时间：` +
                      nowString +
                      `
本批对话实际发生时间：` +
                      time_2 +
                      `
User 名称：` +
                      userName_2 +
                      `

严格限制：
- 只总结当前群聊里公开发生的消息。
- 不要写入、推断或复述任何群成员给 User 的私信内容。
- 不要写入、推断或复述任何群成员与自己好友/私有联系人的私信内容。
- 如果记录里只有“有人发了私信”这类系统提示，也只能当作不可展开的背景事件，不得编造私信细节。

必须只输出 JSON，不要 markdown，不要解释。JSON 字段如下：
{
  "activatedEntryIds": ["与本次群聊相关、需要激活的已有总结ID，没有则为空数组"],
  "summary": {
    "title": "10字内，事件名称",
    "time": "本批公开群聊实际发生时间，前端会按消息时间戳覆盖",
    "event": "180-320字，第三人称完整叙述公开群聊的缘由、经过、关键互动/决定、情绪变化、结果与待办；信息不足时如实略过，不得编造",
    "memoryPoints": "纯文本字符串，按“参与者/目标或分歧/关键决定/关系或情绪变化/结果与待办”概括可召回事实",
    "degree": "高"
  }
}

summary.degree 只可输出“高”。activatedEntryIds 只能使用已有群聊总结中的 ID。

公开群聊：
` +
                      join_174 +
                      `

查看已有总结，将所有记忆程度超过真实时间1天的高改成中，超过7天的改成低，超过30天的改成遗忘。`
                    : `查看已有的总结，将与本次需要总结的对话的内容相关的记忆点的记忆条目激活（记忆程度改为高）。

已有短期记忆总结：
` +
                      handleAction_4_175 +
                      `

你是` +
                      value_166 +
                      '，请站在' +
                      value_166 +
                      '的第一人称视角，将以下' +
                      batch.selectedRounds +
                      '轮、共' +
                      sourceMessages_2.length +
                      `条对话整理为一段可回顾的完整记忆。按实际发生顺序交代缘由、双方的主动表达与回应、重要细节或原话、情绪和关系变化、达成的约定/偏好，以及结果或未完成事项；不要机械罗列消息，也不得补写未发生的情节。

当前真实总结时间：` +
                      nowString +
                      `
本批对话实际发生时间：` +
                      time_2 +
                      `
User 名称：` +
                      userName_2 +
                      `

必须只输出 JSON，不要 markdown，不要解释。JSON 字段如下：
{
  "activatedEntryIds": ["与本次对话相关、需要激活的已有记忆ID，没有则为空数组"],
  "summary": {
    "title": "10字内，事件名称",
    "time": "本批对话实际发生时间，前端会按消息时间戳覆盖",
    "event": "160-300字，以第一人称完整记录这段对话的缘由、经过、关键细节、双方情绪与关系变化、结果和后续事项；仅依据对话事实，不得虚构",
    "memoryPoints": "纯文本字符串，包含情绪、声音、画面、气味、环境及本次形成的偏好/约定等可召回要点；没有依据的感官信息留空，不得编造",
    "degree": "高"
  }
}

summary.degree 只可输出“高”。activatedEntryIds 只能使用已有短期记忆总结中的 ID。

对话：
` +
                      join_174 +
                      `

查看已有的总结，将所有记忆程度超过真实时间1天的高改成中，超过7天的改成低，超过30天的改成遗忘。`,
            value_178 = customSummaryPrompt
                ? '请总结以下' +
                  (friend_46.type === 'group' ? '公开群聊' : '对话') +
                  `。总结的内容取舍、重点、视角和表达方式必须以 <user_summary_instructions> 为最高优先级，不得套用其他内置总结风格。

<user_summary_instructions>
` +
                  customSummaryPrompt +
                  `
</user_summary_instructions>

已有总结：
` +
                  handleAction_4_175 +
                  `

当前真实总结时间：` +
                  nowString +
                  `
本批对话实际发生时间：` +
                  time_2 +
                  `
User 名称：` +
                  userName_2 +
                  `

必须只输出以下 JSON 结构：
{
  "activatedEntryIds": ["与本次内容相关的已有总结ID，没有则为空数组"],
  "summary": {
    "title": "按自定义要求概括的简短标题",
    "time": "本批对话实际发生时间，前端会按消息时间戳覆盖",
    "event": "完全按自定义要求生成的总结正文",
    "memoryPoints": "与自定义总结一致的可召回要点",
    "degree": "高"
  }
}

对话：
` +
                  join_174
                : value_177,
            value_179 =
                friend_46.type === 'group'
                    ? `

最高优先级结构与隐私约束：只能总结当前群聊公开消息，禁止写入、推断或复述任何群成员私信及好友私聊内容。不能修改 JSON 字段，只输出可解析 JSON。`
                    : `

最高优先级结构约束：不能修改 JSON 字段，只输出可解析 JSON。`,
            value_180 = customSummaryPrompt
                ? `
除上述结构、真实时间和群聊隐私约束外，总结内容必须完全服从 <user_summary_instructions>，禁止恢复内置的字数、感官、人称或表达风格要求。`
                : '',
            replace_181 = value_178
                .replace(
                    '"memoryPoints": "纯文本字符串，按“参与者/目标或分歧/关键决定/关系或情绪变化/结果与待办”概括可召回事实",',
                    `"memoryPoints": "纯文本字符串，按“参与者/目标或分歧/关键决定/关系或情绪变化/结果与待办”概括可召回事实",
    "memoryTags": ["3-6个仅来自公开内容的简短标签"],`,
                )
                .replace(
                    '"memoryPoints": "纯文本字符串，包含情绪、声音、画面、气味、环境及本次形成的偏好/约定等可召回要点；没有依据的感官信息留空，不得编造",',
                    `"memoryPoints": "纯文本字符串，概括对话中有依据的情绪、关系变化、偏好、约定、结果与待办；不得补写感官或环境细节",
    "memoryTags": ["3-6个简短具体标签"],`,
                )
                .replace(
                    '"memoryPoints": "与自定义总结一致的可召回要点",',
                    `"memoryPoints": "与自定义总结一致的可召回要点",
    "memoryTags": ["3-6个简短具体标签"],`,
                )
                .replace(
                    /\n\n查看已有(?:的)?总结，将所有记忆程度超过真实时间1天的高改成中，超过7天的改成低，超过30天的改成遗忘。/g,
                    '',
                ),
            content_6 =
                replace_181 +
                `

字段规则：summary.memoryPoints 必须保留为总结详情；summary.memoryTags 是召回标签字段，必须输出 3-6 个 2-16 字的简短具体标签，任意单个标签都应能独立触发对应记忆。群聊的记忆点和标签都只能来自公开内容。记忆衰减由前端处理，不要修改已有总结的程度。` +
                value_180 +
                value_179,
            summaryApiEndpoint = normalizeSummaryApiEndpoint(anchorDate_3),
            value_796 = await fetch(summaryApiEndpoint, {
                method: 'POST',
                headers: window.u2Api?.buildApiHeaders
                    ? window.u2Api.buildApiHeaders(anchorDate_3, {
                          'X-U2-Silent-Errors': '1',
                      })
                    : {
                          'Content-Type': 'application/json',
                          Authorization: 'Bearer ' + anchorDate_3.apiKey,
                      },
                body: JSON.stringify({
                    model: anchorDate_3.model || '',
                    messages: [
                        {
                            role: 'system',
                            content: '你只输出可解析 JSON。',
                        },
                        {
                            role: 'user',
                            content: content_6,
                        },
                    ],
                    temperature: parseFloat(anchorDate_3.temperature ?? anchorDate_3.temp) || 0.7,
                }),
            });
        if (!value_796.ok) {
            const value_189 = window.u2Api?.readApiError
                ? await window.u2Api.readApiError(value_796)
                : {
                      status: value_796.status,
                      statusText: value_796.statusText || '',
                      message: value_796.statusText || '',
                  };
            throw createSummaryFailureError({
                kind: 'http',
                status: value_189.status || value_796.status,
                message: value_189.message || value_189.statusText || '',
            });
        }
        let value_185;
        try {
            value_185 = await value_796.json();
        } catch (value_190) {
            throw createSummaryFailureError({
                kind: 'response_format',
            });
        }
        const tempSelectedAccountId_2 = getSummaryResponseContent(value_185);
        if (!String(tempSelectedAccountId_2 || '').trim())
            throw createSummaryFailureError({
                kind: 'response_format',
            });
        const summary_2 = handleAction_71(tempSelectedAccountId_2);
        summary_2.id = 'stm-' + Date.now();
        summary_2.time = time_2;
        summary_2.degree = '高';
        summary_2.sourceCount = sourceMessages_2.length;
        summary_2.sourceRoundCount = batch.selectedRounds;
        summary_2.sourceRoundLimit = sourceRoundLimit_2;
        summary_2.sourceStartMessageCount = batch.startIndex;
        summary_2.sourceEndMessageCount = batch.endIndex;
        const value_799 = nextTask_2[batch.startIndex] || sourceMessages_2[0] || null,
            value_800 =
                nextTask_2[Math.max(batch.startIndex, batch.endIndex - 1)] ||
                sourceMessages_2[sourceMessages_2.length - 1] ||
                null;
        return (
            (summary_2.sourceStartMessageId = String(value_799?.id || '').trim()),
            (summary_2.sourceEndMessageId = String(value_800?.id || '').trim()),
            (summary_2.sourceStartMessageOrder = Number.isFinite(Number(value_799?.__messageOrder))
                ? Number(value_799.__messageOrder)
                : batch.startIndex),
            (summary_2.sourceEndMessageOrder = Number.isFinite(Number(value_800?.__messageOrder))
                ? Number(value_800.__messageOrder)
                : Math.max(-1, batch.endIndex - 1)),
            (summary_2.sourceMessageIds = sourceMessages_2.map((message_803, value_804) =>
                message_803?.id != null
                    ? String(message_803.id)
                    : (Number(message_803?.timestamp) || 0) +
                      ':' +
                      (message_803?.role || '') +
                      ':' +
                      value_804,
            )),
            summary_2
        );
    }
    function refreshSummaryModal(friend_47) {
        if (!friend_47) return null;
        friend_47.memory = window.imApp.normalizeFriendData(friend_47).memory;
        const value_806 = value_52.get(String(friend_47.id)) || 'idle';
        if (value_806 === 'loading' || value_806 === 'error') {
            const enabled_2 = value_806 === 'error';
            if (manualSummaryUnsummarizedCount)
                manualSummaryUnsummarizedCount.textContent = enabled_2 ? '读取失败' : '读取中…';
            if (manualSummaryBatchCount)
                manualSummaryBatchCount.textContent = enabled_2 ? '请重试' : '读取中…';
            if (manualSummaryCountInput) manualSummaryCountInput.value = '';
            manualSummaryConfirm &&
                ((manualSummaryConfirm.disabled = !enabled_2),
                (manualSummaryConfirm.textContent = enabled_2
                    ? '重新读取聊天记录'
                    : '正在读取聊天记录…'));
            if (summaryHint)
                summaryHint.textContent = enabled_2
                    ? '完整聊天记录读取失败，点击下方按钮重试'
                    : '正在读取完整聊天记录，不会加载图片或语音文件';
            return (refreshSummaryApiSelect(friend_47), null);
        }
        const maxInput_4 = friend_47.memory.summary?.roundLimit || 30,
            nextTask_3 = chatBackgroundOperationTokens_2.get(String(friend_47.id)) || [],
            batch_2 = getAutonomousIntervalValues_2(friend_47, maxInput_4, nextTask_3);
        manualSummaryUnsummarizedCount &&
            (manualSummaryUnsummarizedCount.textContent =
                batch_2.availableRounds + '轮 / ' + batch_2.unsummarizedMessageCount + '条');
        manualSummaryBatchCount &&
            (manualSummaryBatchCount.textContent =
                batch_2.selectedRounds + '轮 / ' + batch_2.selectedMessageCount + '条');
        if (manualSummaryCountInput)
            manualSummaryCountInput.value = String(batch_2.selectedMessageCount);
        if (autoSummaryToggle) autoSummaryToggle.checked = !!friend_47.memory.summary?.enabled;
        if (summaryRoundInput) summaryRoundInput.value = String(maxInput_4);
        refreshSummaryApiSelect(friend_47);
        if (summaryPromptInput) summaryPromptInput.value = friend_47.memory.summary?.prompt || '';
        summaryHint &&
            (summaryHint.textContent = autoSummaryToggle?.checked
                ? '开启后每 ' + maxInput_4 + ' 轮自动总结一次；已有记录将在下一次 AI 回复后检查'
                : '开启后每 ' + maxInput_4 + ' 轮自动总结一次');
        if (manualSummaryConfirm) {
            const value_811 = manualSummaryConfirm.dataset.summaryBusy === 'true';
            manualSummaryConfirm.disabled = value_811 || batch_2.selectedMessageCount === 0;
            manualSummaryConfirm.textContent = value_811
                ? '正在总结...'
                : batch_2.selectedMessageCount > 0
                  ? '立即总结 ' + batch_2.selectedMessageCount + ' 条'
                  : '暂无可总结对话';
        }
        return batch_2;
    }
    async function persistSummarySettings(friend_48) {
        if (!friend_48) return false;
        const roundLimit_3 = window.imDataUtils?.normalizeRoundLimit
                ? window.imDataUtils.normalizeRoundLimit(summaryRoundInput?.value, 30)
                : Math.max(1, Math.round(Number(summaryRoundInput?.value) || 30)),
            saved_19 = await commitNamedFriendChange(
                friend_48,
                (targetFriend_15) => {
                    targetFriend_15.memory =
                        window.imApp.normalizeFriendData(targetFriend_15).memory;
                    targetFriend_15.memory.summary = {
                        ...targetFriend_15.memory.summary,
                        enabled: !!autoSummaryToggle?.checked,
                        roundLimit: roundLimit_3,
                        apiPresetId: String(summaryApiSelect?.value || ''),
                        prompt: String(summaryPromptInput?.value || '').trim(),
                    };
                },
                {
                    silent: true,
                    immediate: true,
                },
            );
        if (saved_19) {
            const currentSettingsFriend_7 =
                window.imData.friends.find(
                    (value_817) => String(value_817.id) === String(friend_48.id),
                ) || friend_48;
            window.imData.currentSettingsFriend &&
                String(window.imData.currentSettingsFriend.id) === String(friend_48.id) &&
                (window.imData.currentSettingsFriend = currentSettingsFriend_7);
            refreshSummaryModal(currentSettingsFriend_7);
        }
        return saved_19;
    }
    async function handleAction_79(friend_49, summary_3) {
        if (!friend_49 || !summary_3) return false;
        const value_820 =
                window.imData.friends.find(
                    (value_823) => String(value_823.id) === String(friend_49.id),
                ) || friend_49,
            items_821 = await handleAction_66(value_820),
            value_822 = Array.isArray(summary_3.sourceMessageIds)
                ? summary_3.sourceMessageIds.map(String)
                : [];
        if (value_822.length > 0) {
            const max_824 = Math.max(0, Number(summary_3.sourceStartMessageCount) || 0),
                max_825 = Math.max(max_824, Number(summary_3.sourceEndMessageCount) || max_824),
                items_826 =
                    value_820.type === 'group'
                        ? items_821.slice(max_824, max_825).filter(isSourceMessage_2)
                        : items_821.slice(max_824, max_825),
                map_827 = items_826.map((message_828, value_829) =>
                    message_828?.id != null
                        ? String(message_828.id)
                        : (Number(message_828?.timestamp) || 0) +
                          ':' +
                          (message_828?.role || '') +
                          ':' +
                          value_829,
                );
            if (
                map_827.length !== value_822.length ||
                map_827.some((value_830, value_831) => value_830 !== value_822[value_831])
            )
                throw createSummaryFailureError({
                    kind: 'source_changed',
                });
        }
        return commitNamedFriendChange(
            friend_49,
            (targetFriend_16) => {
                if (window.imApp.applyGeneratedShortTermMemory) {
                    window.imApp.applyGeneratedShortTermMemory(targetFriend_16, summary_3, {
                        activatedEntryIds: summary_3.activatedEntryIds,
                        updateSummaryCursor: true,
                    });
                    return;
                }
                targetFriend_16.memory = window.imApp.normalizeFriendData(targetFriend_16).memory;
                if (!Array.isArray(targetFriend_16.memory.shortTermEntries))
                    targetFriend_16.memory.shortTermEntries = [];
                const now_4 = new Date(),
                    lastActivatedAt_2 =
                        now_4.getFullYear() +
                        '年' +
                        String(now_4.getMonth() + 1).padStart(2, '0') +
                        '月' +
                        String(now_4.getDate()).padStart(2, '0') +
                        '日 ' +
                        String(now_4.getHours()).padStart(2, '0') +
                        ':' +
                        String(now_4.getMinutes()).padStart(2, '0'),
                    activatedIds_2 = new Set(
                        Array.isArray(summary_3.activatedEntryIds)
                            ? summary_3.activatedEntryIds.map(String)
                            : [],
                    );
                targetFriend_16.memory.shortTermEntries.forEach((value_837) => {
                    value_837 &&
                        activatedIds_2.has(String(value_837.id)) &&
                        ((value_837.degree = '高'),
                        (value_837.lastActivatedAt = lastActivatedAt_2));
                });
                decayShortTermMemoryEntries(
                    targetFriend_16.memory.shortTermEntries,
                    now_4,
                    activatedIds_2,
                );
                summary_3.lastActivatedAt = lastActivatedAt_2;
                targetFriend_16.memory.shortTermEntries.push(summary_3);
                const lastSummaryMessageCount_3 =
                    Number(summary_3.sourceEndMessageCount) || items_821.length;
                targetFriend_16.memory.lastSummaryMessageCount = lastSummaryMessageCount_3;
                targetFriend_16.memory.summaryCursor = {
                    messageId: String(summary_3.sourceEndMessageId || '').trim(),
                    order: Number.isFinite(Number(summary_3.sourceEndMessageOrder))
                        ? Number(summary_3.sourceEndMessageOrder)
                        : -1,
                    count: lastSummaryMessageCount_3,
                };
            },
            {
                silent: true,
                immediate: true,
            },
        );
    }
    function handleAction_80(friend_50, summary_4, value_840 = {}) {
        const friendId_6 = String(friend_50?.id || ''),
            currentSettingsFriend_2 =
                window.imData.friends.find((item_16) => String(item_16.id) === friendId_6) ||
                friend_50;
        if (!currentSettingsFriend_2) return null;
        currentSettingsFriend_2.memory =
            window.imApp.normalizeFriendData(currentSettingsFriend_2).memory;
        window.imData.currentSettingsFriend &&
            String(window.imData.currentSettingsFriend.id) === friendId_6 &&
            ((window.imData.currentSettingsFriend = currentSettingsFriend_2),
            refreshSummaryModal(currentSettingsFriend_2));
        if (window.imApp.renderMemoryView) window.imApp.renderMemoryView();
        if (currentSettingsFriend_2.type === 'group') {
            if (window.imApp.renderGroupSummaryMorePanel)
                window.imApp.renderGroupSummaryMorePanel(currentSettingsFriend_2);
            window.dispatchEvent(
                new CustomEvent('u2:group-summary-updated', {
                    detail: {
                        groupId: friendId_6,
                    },
                }),
            );
        } else
            window.dispatchEvent(
                new CustomEvent('u2:memory-entries-updated', {
                    detail: {
                        friendId: friendId_6,
                        action: 'upsert',
                        collection: 'shortTermEntries',
                        entryId: String(summary_4.id || ''),
                    },
                }),
            );
        return (
            showToast_2(
                value_840.auto
                    ? '已自动总结 ' +
                          (summary_4.sourceRoundCount ||
                              currentSettingsFriend_2.memory?.summary?.roundLimit ||
                              0) +
                          ' 轮' +
                          (currentSettingsFriend_2.type === 'group' ? '群聊' : '对话')
                    : currentSettingsFriend_2.type === 'group'
                      ? '群聊总结已存入 More'
                      : '总结已存入短期记忆',
            ),
            currentSettingsFriend_2
        );
    }
    function handleAction_81(value_844, value_845) {
        if (!value_844 || !value_845 || !window.imChat?.openGeneratedResultPreview) return false;
        const string_846 = String(value_844.id);
        let value_847 = value_845;
        const getCurrentFriend_2 = () =>
                window.imData.friends.find((value_851) => String(value_851.id) === string_846) ||
                null,
            value_849 = (value_852) =>
                '标题：' +
                (value_852.title || '对话总结') +
                ' · ' +
                (value_852.sourceRoundCount || 0) +
                ' 轮 / ' +
                (value_852.sourceCount || 0) +
                ' 条消息',
            value_850 = (value_853) =>
                String(value_853.event || value_853.memoryPoints || '').trim();
        return (
            window.imChat.openGeneratedResultPreview({
                title: '对话总结预览',
                subtitle: value_849(value_847),
                text: value_850(value_847),
                editable: true,
                regenerateText: '重新总结',
                confirmText: '确认保存',
                onCancel: () => {
                    const currentFriend_9 = getCurrentFriend_2();
                    if (currentFriend_9) refreshSummaryModal(currentFriend_9);
                },
                onRegenerate: async () => {
                    const token_855 = window.imChat.getGeneratedResultPreviewState?.()?.token;
                    window.imChat.setGeneratedResultPreviewBusy?.(true);
                    try {
                        const currentFriend_848 = getCurrentFriend_2();
                        if (!currentFriend_848)
                            throw createSummaryFailureError({
                                kind: 'source_changed',
                            });
                        const value_856 = await handleAction_77(currentFriend_848, {
                            roundLimit: currentFriend_848.memory?.summary?.roundLimit,
                            silent: false,
                        });
                        if (
                            !value_856 ||
                            !window.imChat.isGeneratedResultPreviewCurrent?.(token_855)
                        )
                            return;
                        value_847 = value_856;
                        window.imChat.updateGeneratedResultPreview?.({
                            subtitle: value_849(value_847),
                            text: value_850(value_847),
                        });
                    } catch (value_857) {
                        const handleAction_76_858 = handleAction_76(
                            getCurrentFriend_2() || value_844,
                            value_857,
                        );
                        if (
                            !window.u2Api?.isRequestError?.(value_857) ||
                            !window.u2Api.reportError(value_857, {
                                operation: '重新总结',
                            })
                        )
                            showToast_2('重新总结失败：' + handleAction_76_858.message);
                    } finally {
                        window.imChat.isGeneratedResultPreviewCurrent?.(token_855) &&
                            window.imChat.setGeneratedResultPreviewBusy?.(false);
                    }
                },
                onConfirm: async () => {
                    const event_7 = window.imChat.getGeneratedResultPreviewText?.() || '';
                    if (!event_7) {
                        showToast_2('预览内容不能为空');
                        return;
                    }
                    window.imChat.setGeneratedResultPreviewBusy?.(true);
                    try {
                        const currentFriend_848_860 = getCurrentFriend_2();
                        if (!currentFriend_848_860)
                            throw createSummaryFailureError({
                                kind: 'source_changed',
                            });
                        const value_861 = await handleAction_79(currentFriend_848_860, {
                            ...value_847,
                            event: event_7,
                        });
                        if (!value_861)
                            throw createSummaryFailureError({
                                kind: 'persistence',
                            });
                        window.imChat.closeGeneratedResultPreview?.();
                        closeView_2(manualSummaryModal);
                        handleAction_80(currentFriend_848_860, {
                            ...value_847,
                            event: event_7,
                        });
                    } catch (value_862) {
                        const handleAction_76_863 = handleAction_76(
                            getCurrentFriend_2() || value_844,
                            value_862,
                        );
                        showToast_2('保存总结失败：' + handleAction_76_863.message);
                    } finally {
                        window.imChat.getGeneratedResultPreviewState?.() &&
                            window.imChat.setGeneratedResultPreviewBusy?.(false);
                    }
                },
            }),
            true
        );
    }
    async function runChatSummary(friend_51, options_7 = {}) {
        if (!friend_51) return false;
        const friendId_7 = String(friend_51.id);
        if (summaryInFlight.has(friendId_7)) return false;
        friend_51 =
            window.imData.friends.find((item_17) => String(item_17.id) === friendId_7) || friend_51;
        friend_51.memory = window.imApp.normalizeFriendData(friend_51).memory;
        const value_867 = friend_51.type === 'group',
            roundLimit_4 = friend_51.memory.summary?.roundLimit || 30;
        if (options_7.auto && !friend_51.memory.summary?.enabled) return false;
        summaryInFlight.add(friendId_7);
        try {
            const sourceMessages_3 = await handleAction_66(friend_51),
                handleAction_64_871 = getAutonomousIntervalValues_2(
                    friend_51,
                    roundLimit_4,
                    sourceMessages_3,
                );
            if (options_7.auto && !handleAction_64_871.ready) return false;
            if (handleAction_64_871.selectedMessageCount === 0) return false;
            const value_872 = await handleAction_77(friend_51, {
                roundLimit: roundLimit_4,
                requireFullBatch: !!options_7.auto,
                silent: !!options_7.auto,
                sourceMessages: sourceMessages_3,
            });
            if (!value_872) return false;
            if (options_7.preview) {
                if (!handleAction_81(friend_51, value_872))
                    throw createSummaryFailureError({
                        kind: 'response_format',
                    });
                return true;
            }
            const value_873 = await handleAction_79(friend_51, value_872);
            if (!value_873) {
                if (!value_867 && !options_7.auto)
                    throw createSummaryFailureError({
                        kind: 'persistence',
                    });
                throw new Error('summary persistence failed');
            }
            return (
                handleAction_80(friend_51, value_872, {
                    auto: !!options_7.auto,
                }),
                true
            );
        } catch (error_10) {
            if (!value_867 && !options_7.auto) {
                const handleAction_76_875 = handleAction_76(friend_51, error_10);
                if (
                    !window.u2Api?.isRequestError?.(error_10) ||
                    !window.u2Api.reportError(error_10, {
                        operation: '对话总结',
                    })
                )
                    showToast_2('总结失败：' + handleAction_76_875.message);
            } else {
                console.error(
                    options_7.auto ? 'Auto summary failed' : 'Manual summary failed',
                    error_10,
                );
                (options_7.auto ||
                    !window.u2Api?.isRequestError?.(error_10) ||
                    !window.u2Api.reportError(error_10, {
                        operation: '对话总结',
                    })) &&
                    showToast_2(
                        options_7.auto ? '自动总结失败，将在下次回复后重试' : '总结生成失败',
                    );
            }
            return false;
        } finally {
            summaryInFlight['delete'](friendId_7);
        }
    }
    async function openManualSummaryModal_3(currentSettingsFriend_8) {
        if (!currentSettingsFriend_8 || !manualSummaryModal) return;
        currentSettingsFriend_8 =
            window.imData.friends.find(
                (value_877) => String(value_877.id) === String(currentSettingsFriend_8.id),
            ) || currentSettingsFriend_8;
        window.imData.currentSettingsFriend = currentSettingsFriend_8;
        openView_3(manualSummaryModal);
        value_52.set(String(currentSettingsFriend_8.id), 'loading');
        refreshSummaryModal(currentSettingsFriend_8);
        try {
            await handleAction_66(currentSettingsFriend_8);
            refreshSummaryModal(currentSettingsFriend_8);
        } catch (value_878) {
            console.error('Failed to load complete chat history for summary', value_878);
            refreshSummaryModal(currentSettingsFriend_8);
            showToast_2('聊天记录读取失败，请点击重试');
        }
    }
    window.imChat = window.imChat || {};
    window.imChat.openManualSummaryModal = openManualSummaryModal_3;
    manualSummaryBtn &&
        manualSummaryBtn.addEventListener('click', () => {
            window.imData.currentSettingsFriend &&
                openManualSummaryModal_3(window.imData.currentSettingsFriend);
        });
    manualSummaryClose &&
        manualSummaryModal &&
        manualSummaryClose.addEventListener('click', () => closeView_2(manualSummaryModal));
    autoSummaryToggle &&
        autoSummaryToggle.addEventListener('change', () => {
            const currentSettingsFriend_193 = window.imData.currentSettingsFriend;
            if (currentSettingsFriend_193) void persistSummarySettings(currentSettingsFriend_193);
        });
    summaryRoundInput &&
        (summaryRoundInput.addEventListener('input', () => {
            const friend_52 = window.imData.currentSettingsFriend;
            if (!friend_52) return;
            const draftFriend = {
                ...friend_52,
                memory: {
                    ...friend_52.memory,
                    summary: {
                        ...friend_52.memory?.summary,
                        roundLimit: summaryRoundInput.value,
                        apiPresetId: String(summaryApiSelect?.value || ''),
                        prompt: String(summaryPromptInput?.value || ''),
                    },
                },
            };
            refreshSummaryModal(draftFriend);
        }),
        summaryRoundInput.addEventListener('change', () => {
            const currentSettingsFriend_194 = window.imData.currentSettingsFriend;
            if (currentSettingsFriend_194) void persistSummarySettings(currentSettingsFriend_194);
        }));
    summaryApiSelect?.addEventListener('change', () => {
        const currentSettingsFriend_195 = window.imData.currentSettingsFriend;
        if (currentSettingsFriend_195) void persistSummarySettings(currentSettingsFriend_195);
    });
    summaryPromptInput?.addEventListener('blur', () => {
        const currentSettingsFriend_196 = window.imData.currentSettingsFriend;
        if (currentSettingsFriend_196) void persistSummarySettings(currentSettingsFriend_196);
    });
    summaryPromptClear?.addEventListener('click', () => {
        if (summaryPromptInput) summaryPromptInput.value = '';
        const friend_53 = window.imData.currentSettingsFriend;
        if (friend_53) void persistSummarySettings(friend_53);
    });
    window.addEventListener('u2:api-presets-updated', () => {
        const friend_54 = window.imData.currentSettingsFriend;
        if (friend_54 && manualSummaryModal?.classList.contains('active'))
            refreshSummaryApiSelect(friend_54);
    });
    autonomousBtn &&
        autonomousBtn.addEventListener('click', () => {
            window.imData.currentSettingsFriend &&
                handleAction_59(window.imData.currentSettingsFriend);
        });
    autonomousClose &&
        autonomousSheet &&
        autonomousClose.addEventListener('click', () => {
            if (window.closeView) window.closeView(autonomousSheet);
        });
    autonomousSheet &&
        autonomousSheet.addEventListener('click', (event_886) => {
            event_886.target === autonomousSheet &&
                window.closeView &&
                window.closeView(autonomousSheet);
        });
    autonomousToggle &&
        autonomousToggle.addEventListener('change', () => {
            setAutonomousCardExpanded(autonomousToggle, autonomousToggle.checked);
            autonomousNextLabel &&
                (autonomousNextLabel.textContent = autonomousToggle.checked
                    ? '保存后将按当前间隔随机触发'
                    : '关闭后不会主动发消息');
        });
    autonomousMomentToggle &&
        autonomousMomentToggle.addEventListener('change', () => {
            setAutonomousCardExpanded(autonomousMomentToggle, autonomousMomentToggle.checked);
            autonomousMomentNextLabel &&
                (autonomousMomentNextLabel.textContent = autonomousMomentToggle.checked
                    ? '保存后将按当前间隔随机发朋友圈'
                    : '关闭后不会自动发朋友圈');
        });
    autonomousSaveBtn && autonomousSaveBtn.addEventListener('click', handleClick);
    manualSummaryConfirm &&
        manualSummaryConfirm.addEventListener('click', async () => {
            let friend_55 = window.imData.currentSettingsFriend;
            if (!friend_55) {
                showToast_2('未找到当前聊天，请返回聊天设置后重试');
                return;
            }
            manualSummaryConfirm.dataset.summaryBusy = 'true';
            manualSummaryConfirm.disabled = true;
            manualSummaryConfirm.classList.add('is-loading');
            manualSummaryConfirm.textContent = '正在总结...';
            showToast_2('正在总结对话...');
            try {
                const value_888 = await persistSummarySettings(friend_55);
                if (!value_888) {
                    const failure_2 = getSummaryFailureClassification({
                        kind: 'settings_persistence',
                    });
                    console.error('Manual single-chat summary settings save failed', {
                        friendId: String(friend_55.id || ''),
                        apiPresetId: String(friend_55.memory?.summary?.apiPresetId || ''),
                        category: failure_2.code,
                        status: failure_2.status || 0,
                        message: failure_2.message,
                    });
                    showToast_2('总结失败：' + failure_2.message);
                    return;
                }
                friend_55 =
                    window.imData.friends.find(
                        (value_890) => String(value_890.id) === String(friend_55.id),
                    ) || friend_55;
                await runChatSummary(friend_55, {
                    auto: false,
                    preview: true,
                });
            } catch (value_891) {
                const failure_3 = getSummaryFailureClassification({
                    kind: 'settings_persistence',
                });
                console.error('Manual single-chat summary settings save failed', {
                    friendId: String(friend_55?.id || ''),
                    apiPresetId: String(friend_55?.memory?.summary?.apiPresetId || ''),
                    category: failure_3.code,
                    status: failure_3.status || 0,
                    message: failure_3.message,
                });
                showToast_2('总结失败：' + failure_3.message);
            } finally {
                delete manualSummaryConfirm.dataset.summaryBusy;
                manualSummaryConfirm.disabled = false;
                manualSummaryConfirm.classList.remove('is-loading');
                const value_893 =
                    window.imData.friends.find(
                        (value_894) => String(value_894.id) === String(friend_55.id),
                    ) || friend_55;
                refreshSummaryModal(value_893);
            }
        });
    window.imChat = window.imChat || {};
    window.imChat.maybeAutoSummarize = async function value_896(friendOrId_2) {
        const friendId_8 =
                friendOrId_2 && typeof friendOrId_2 === 'object' ? friendOrId_2.id : friendOrId_2,
            friend_56 =
                (window.imData.friends || []).find(
                    (item_18) => String(item_18.id) === String(friendId_8),
                ) || (friendOrId_2 && typeof friendOrId_2 === 'object' ? friendOrId_2 : null);
        return runChatSummary(friend_56, {
            auto: true,
        });
    };
    function handleAction_84(value_900) {
        const chatSettingsAvatarImgElement_901 = document.getElementById(
                'chat-settings-avatar-img',
            ),
            chatSettingsAvatarIconElement_902 = document.getElementById(
                'chat-settings-avatar-icon',
            ),
            chatSettingsNameElement_903 = document.getElementById('chat-settings-name');
        if (value_900.avatarUrl) {
            chatSettingsAvatarImgElement_901 &&
                ((chatSettingsAvatarImgElement_901.src = value_900.avatarUrl),
                (chatSettingsAvatarImgElement_901.style.display = 'block'));
            if (chatSettingsAvatarIconElement_902)
                chatSettingsAvatarIconElement_902.style.display = 'none';
        } else {
            chatSettingsAvatarImgElement_901 &&
                ((chatSettingsAvatarImgElement_901.style.display = 'none'),
                (chatSettingsAvatarImgElement_901.src = ''));
            if (chatSettingsAvatarIconElement_902)
                chatSettingsAvatarIconElement_902.style.display = 'block';
        }
        if (chatSettingsNameElement_903)
            chatSettingsNameElement_903.textContent = value_900.nickname;
    }
    function handleAction_85(value_904) {
        const chatMcpEnabledToggleElement_905 = document.getElementById('chat-mcp-enabled-toggle'),
            chatMcpStatusLabelElement = document.getElementById('chat-mcp-status-label'),
            chatMcpDisplayRowElement = document.getElementById('chat-mcp-display-row'),
            statusPromptInput = document.getElementById('chat-mcp-display-toggle');
        if (!chatMcpEnabledToggleElement_905 || !value_904?.id) return;
        const value_907 = window.imMcpConfig?.getConfig?.(value_904.id) || {},
            checked_6 = value_907.enabled === true,
            value_909 = (window.mcpIntegration?.getEnabledMcpServers?.().length || 0) > 0;
        chatMcpEnabledToggleElement_905.checked = checked_6;
        chatMcpEnabledToggleElement_905.disabled = !value_909 && !checked_6;
        chatMcpEnabledToggleElement_905
            .closest('label')
            ?.setAttribute(
                'title',
                value_909 ? '为当前聊天启用 MCP 工具' : '请先在 MCP 应用中启用服务器',
            );
        chatMcpStatusLabelElement &&
            (chatMcpStatusLabelElement.style.display = value_909 ? 'none' : '');
        if (chatMcpDisplayRowElement) chatMcpDisplayRowElement.hidden = !checked_6;
        statusPromptInput &&
            ((statusPromptInput.checked = value_907.showToolCalls !== false),
            (statusPromptInput.disabled = !checked_6));
    }
    function initChatSettingsForFriend_3(friend_57) {
        if (!friend_57) return null;
        friend_57 = window.imApp.getFriendById?.(friend_57) || friend_57;
        window.imData.currentSettingsFriend = friend_57;
        setActiveChatSettingsTab('info');
        if (chatReversePhoneBtnElement)
            chatReversePhoneBtnElement.hidden = friend_57.type !== 'char';
        isRelationshipPickerVisible = false;
        relationshipPickerType = 'all';
        tempRelationshipDrafts = [];
        handleAction_37();
        handleAction_84(friend_57);
        updateChatBindIdLabel_2(friend_57);
        const timestampToggleElement_911 = document.getElementById('timestamp-toggle'),
            timestampPositionBodyElement_912 = document.getElementById('timestamp-position-body'),
            timestampPositionSelectElement_913 = document.getElementById(
                'timestamp-position-select',
            ),
            chatAvatarToggleElement_914 = document.getElementById('chat-avatar-toggle'),
            chatLanguageSelect = document.getElementById('chat-language-select'),
            chatCustomLanguageRow_2 = document.getElementById('chat-custom-language-row'),
            chatCustomLanguageInput_2 = document.getElementById('chat-custom-language-input'),
            chatMessageCountMinInput = document.getElementById('chat-message-count-min-input'),
            chatMessageCountMaxInput = document.getElementById('chat-message-count-max-input'),
            chatTimeAwareToggle = document.getElementById('chat-time-aware-toggle'),
            chatRoleRecallToggle = document.getElementById('chat-role-recall-toggle'),
            chatCharBlockToggleElement_921 = document.getElementById('chat-char-block-toggle'),
            chatBlockFriendBtnElement_922 = document.getElementById('chat-block-friend-btn'),
            chatAutoExpandTranslationToggle = document.getElementById(
                'chat-auto-expand-translation-toggle',
            ),
            chatTtsEnabledToggleElement_924 = document.getElementById('chat-tts-enabled-toggle'),
            chatTtsBody = document.getElementById('chat-tts-settings-body'),
            chatTtsVoiceInput = document.getElementById('chat-tts-voice-id-input'),
            chatTtsSpeedInput = document.getElementById('chat-tts-speed-input');
        chatAvatarToggleElement_914 &&
            (chatAvatarToggleElement_914.checked = !!friend_57.showAvatar);
        if (chatLanguageSelect) {
            const language_2 = String(friend_57.language || 'zh').trim() || 'zh',
                standardLanguages = new Set(['zh', 'ko', 'ja', 'en', 'fr', 'yue', 'ru']),
                isCustomLanguage_2 = !standardLanguages.has(language_2);
            chatLanguageSelect.value = isCustomLanguage_2 ? '__custom__' : language_2;
            if (chatCustomLanguageRow_2)
                chatCustomLanguageRow_2.style.display = isCustomLanguage_2 ? 'flex' : 'none';
            if (chatCustomLanguageInput_2)
                chatCustomLanguageInput_2.value = isCustomLanguage_2 ? language_2 : '';
        }
        const messageRange = window.imDataUtils?.normalizeChatMessageRange
            ? window.imDataUtils.normalizeChatMessageRange(
                  friend_57.messageCountMin,
                  friend_57.messageCountMax,
                  2,
                  8,
              )
            : {
                  min: 2,
                  max: 8,
              };
        if (chatMessageCountMinInput) chatMessageCountMinInput.value = String(messageRange.min);
        if (chatMessageCountMaxInput) chatMessageCountMaxInput.value = String(messageRange.max);
        chatTimeAwareToggle && (chatTimeAwareToggle.checked = friend_57.timeAware !== false);
        handleAction_39(friend_57);
        chatRoleRecallToggle &&
            (chatRoleRecallToggle.checked = friend_57.allowRoleRecall !== false);
        chatCharBlockToggleElement_921 &&
            (chatCharBlockToggleElement_921.checked = friend_57.allowCharBlock === true);
        if (chatBlockFriendBtnElement_922) {
            const value_932 = friend_57.blockState?.userBlocksChar === true;
            chatBlockFriendBtnElement_922.textContent = value_932 ? '解除拉黑' : '拉黑好友';
            chatBlockFriendBtnElement_922.style.color = value_932 ? '#007aff' : '#ff3b30';
        }
        chatAutoExpandTranslationToggle &&
            (chatAutoExpandTranslationToggle.checked = friend_57.autoExpandTranslation === true);
        handleAction_85(friend_57);
        renderChatCotSettings(friend_57);
        const ttsVoice_2 =
            friend_57.ttsVoice && typeof friend_57.ttsVoice === 'object'
                ? friend_57.ttsVoice
                : friend_57.minimaxVoice && typeof friend_57.minimaxVoice === 'object'
                  ? friend_57.minimaxVoice
                  : {};
        return (
            chatTtsEnabledToggleElement_924 &&
                (chatTtsEnabledToggleElement_924.checked = !!ttsVoice_2.enabled),
            chatTtsBody && (chatTtsBody.style.display = ttsVoice_2.enabled ? 'block' : 'none'),
            chatTtsVoiceInput && (chatTtsVoiceInput.value = ttsVoice_2.voiceId || ''),
            chatTtsSpeedInput && (chatTtsSpeedInput.value = ttsVoice_2.speed || 1),
            timestampToggleElement_911 &&
                ((timestampToggleElement_911.checked = !!friend_57.showTimestamp),
                timestampPositionBodyElement_912 &&
                    (timestampPositionBodyElement_912.style.display = 'flex'),
                timestampPositionSelectElement_913 &&
                    (timestampPositionSelectElement_913.value =
                        friend_57.timestampPosition || 'inside')),
            updateStatusBarBtnCount_2(friend_57),
            friend_57
        );
    }
    function refreshNpcSettingsHeader(friend_58) {
        const avatarImg = document.getElementById('npc-chat-settings-avatar-img'),
            avatarIcon = document.getElementById('npc-chat-settings-avatar-icon'),
            nameEl_2 = document.getElementById('npc-chat-settings-name');
        if (friend_58 && friend_58.avatarUrl) {
            avatarImg &&
                ((avatarImg.src = friend_58.avatarUrl), (avatarImg.style.display = 'block'));
            if (avatarIcon) avatarIcon.style.display = 'none';
        } else {
            avatarImg && ((avatarImg.style.display = 'none'), (avatarImg.src = ''));
            if (avatarIcon) avatarIcon.style.display = 'flex';
        }
        if (nameEl_2) nameEl_2.textContent = friend_58?.nickname || 'NPC';
    }
    function handleAction_88(friend_59) {
        if (!friend_59) return;
        const page_3 = document.getElementById('chat-interface-' + friend_59.id);
        if (!page_3) return;
        page_3.classList.toggle('show-timestamps', !!friend_59.showTimestamp);
        page_3.classList.toggle(
            'timestamp-outside',
            !!friend_59.showTimestamp && friend_59.timestampPosition === 'outside',
        );
    }
    function handleAction_89(currentSettingsFriend_9) {
        if (!currentSettingsFriend_9) return null;
        window.imData.currentSettingsFriend = currentSettingsFriend_9;
        refreshNpcSettingsHeader(currentSettingsFriend_9);
        const npcTimestampToggleElement_937 = document.getElementById('npc-timestamp-toggle'),
            npcTimestampPositionBodyElement_938 = document.getElementById(
                'npc-timestamp-position-body',
            ),
            npcTimestampPositionSelectElement_939 = document.getElementById(
                'npc-timestamp-position-select',
            ),
            npcChatAvatarToggleElement_940 = document.getElementById('npc-chat-avatar-toggle');
        return (
            npcChatAvatarToggleElement_940 &&
                (npcChatAvatarToggleElement_940.checked = !!currentSettingsFriend_9.showAvatar),
            npcTimestampToggleElement_937 &&
                ((npcTimestampToggleElement_937.checked = !!currentSettingsFriend_9.showTimestamp),
                npcTimestampPositionBodyElement_938 &&
                    (npcTimestampPositionBodyElement_938.style.display = 'flex'),
                npcTimestampPositionSelectElement_939 &&
                    (npcTimestampPositionSelectElement_939.value =
                        currentSettingsFriend_9.timestampPosition || 'inside')),
            handleAction_42(),
            currentSettingsFriend_9
        );
    }
    function openNpcChatSettingsForFriend(value_941) {
        const handleAction_89_942 = handleAction_89(value_941);
        if (!handleAction_89_942 || !npcChatSettingsSheet) return;
        window.openView
            ? window.openView(npcChatSettingsSheet)
            : npcChatSettingsSheet.classList.add('active');
    }
    function openChatSettingsForFriend_2(friend_60) {
        const latestFriend_8 = window.imApp.getFriendById
            ? window.imApp.getFriendById(friend_60) || friend_60
            : friend_60;
        if (latestFriend_8 && latestFriend_8.type === 'npc') {
            openNpcChatSettingsForFriend(latestFriend_8);
            return;
        }
        if (!latestFriend_8 || !chatSettingsSheet) return;
        count_21 += 1;
        handleAction_26();
        text_24 = String(latestFriend_8.id);
        value_25.clear();
        const handleAction_86_945 = initChatSettingsForFriend_3(latestFriend_8);
        if (!handleAction_86_945) return;
        window.openView
            ? window.openView(chatSettingsSheet)
            : chatSettingsSheet.classList.add('active');
        setTimeout(() => {
            typeof requestIdleCallback === 'function'
                ? requestIdleCallback(
                      () => void persistProfileStatusMigration(handleAction_86_945),
                      {
                          timeout: 1500,
                      },
                  )
                : void persistProfileStatusMigration(handleAction_86_945);
        }, 400);
    }
    const timestampToggleElement = document.getElementById('timestamp-toggle'),
        timestampPositionBodyElement = document.getElementById('timestamp-position-body'),
        timestampPositionSelectElement = document.getElementById('timestamp-position-select');
    timestampToggleElement &&
        timestampToggleElement.dataset.bound !== 'true' &&
        ((timestampToggleElement.dataset.bound = 'true'),
        timestampToggleElement.addEventListener('change', async (event_197) => {
            if (window.imData.currentSettingsFriend) {
                const checked_12 = !!window.imData.currentSettingsFriend.showTimestamp,
                    showTimestamp_3 = event_197.target.checked,
                    value_200 = await commitSettingsFriendChange(
                        (value_201) => {
                            value_201.showTimestamp = showTimestamp_3;
                        },
                        {
                            silent: true,
                        },
                    );
                if (!value_200) {
                    event_197.target.checked = checked_12;
                    showToast_2('时间戳设置保存失败');
                    return;
                }
                handleAction_88(window.imData.currentSettingsFriend);
            }
        }));
    timestampPositionSelectElement &&
        timestampPositionSelectElement.dataset.bound !== 'true' &&
        ((timestampPositionSelectElement.dataset.bound = 'true'),
        timestampPositionSelectElement.addEventListener('change', async (event_202) => {
            if (window.imData.currentSettingsFriend) {
                const value_16 = window.imData.currentSettingsFriend.timestampPosition || 'inside',
                    timestampPosition_2 = event_202.target.value,
                    value_205 = await commitSettingsFriendChange(
                        (value_206) => {
                            value_206.timestampPosition = timestampPosition_2;
                        },
                        {
                            silent: true,
                        },
                    );
                if (!value_205) {
                    event_202.target.value = value_16;
                    showToast_2('时间戳位置保存失败');
                    return;
                }
                handleAction_88(window.imData.currentSettingsFriend);
            }
        }));
    const npcTimestampToggleElement = document.getElementById('npc-timestamp-toggle'),
        npcTimestampPositionBodyElement = document.getElementById('npc-timestamp-position-body'),
        npcTimestampPositionSelectElement = document.getElementById(
            'npc-timestamp-position-select',
        );
    npcTimestampToggleElement &&
        npcTimestampToggleElement.dataset.bound !== 'true' &&
        ((npcTimestampToggleElement.dataset.bound = 'true'),
        npcTimestampToggleElement.addEventListener('change', async (event_207) => {
            if (window.imData.currentSettingsFriend) {
                const checked_13 = !!window.imData.currentSettingsFriend.showTimestamp,
                    showTimestamp_4 = event_207.target.checked,
                    value_210 = await commitSettingsFriendChange(
                        (value_211) => {
                            value_211.showTimestamp = showTimestamp_4;
                        },
                        {
                            silent: true,
                        },
                    );
                if (!value_210) {
                    event_207.target.checked = checked_13;
                    showToast_2('时间戳设置保存失败');
                    return;
                }
                handleAction_88(window.imData.currentSettingsFriend);
            }
        }));
    npcTimestampPositionSelectElement &&
        npcTimestampPositionSelectElement.dataset.bound !== 'true' &&
        ((npcTimestampPositionSelectElement.dataset.bound = 'true'),
        npcTimestampPositionSelectElement.addEventListener('change', async (event_212) => {
            if (window.imData.currentSettingsFriend) {
                const value_19 = window.imData.currentSettingsFriend.timestampPosition || 'inside',
                    timestampPosition_3 = event_212.target.value,
                    value_215 = await commitSettingsFriendChange(
                        (value_217) => {
                            value_217.timestampPosition = timestampPosition_3;
                        },
                        {
                            silent: true,
                        },
                    );
                if (!value_215) {
                    event_212.target.value = value_19;
                    showToast_2('时间戳位置保存失败');
                    return;
                }
                handleAction_88(window.imData.currentSettingsFriend);
            }
        }));
    const chatLanguageSelect_2 = document.getElementById('chat-language-select'),
        chatCustomLanguageRowElement = document.getElementById('chat-custom-language-row'),
        chatCustomLanguageInput = document.getElementById('chat-custom-language-input'),
        value_92 = new Set(['zh', 'ko', 'ja', 'en', 'fr', 'yue', 'ru']);
    chatLanguageSelect_2 &&
        chatLanguageSelect_2.addEventListener('change', async (event_966) => {
            if (window.imData.currentSettingsFriend) {
                const value_8_2 = window.imData.currentSettingsFriend.language || 'zh',
                    language_4 = event_966.target.value;
                if (language_4 === '__custom__') {
                    if (chatCustomLanguageRowElement)
                        chatCustomLanguageRowElement.style.display = 'flex';
                    chatCustomLanguageInput &&
                        ((chatCustomLanguageInput.value = value_92.has(value_8_2) ? '' : value_8_2),
                        chatCustomLanguageInput.focus());
                    return;
                }
                if (chatCustomLanguageRowElement)
                    chatCustomLanguageRowElement.style.display = 'none';
                if (chatCustomLanguageInput) chatCustomLanguageInput.value = '';
                const value_969 = await commitSettingsFriendChange(
                    (value_970) => {
                        value_970.language = language_4;
                    },
                    {
                        silent: true,
                    },
                );
                !value_969 &&
                    ((event_966.target.value = value_8_2), showToast_2('语言设置保存失败'));
            }
        });
    window.imApp.openUserPhoneAccessSettings = function (friendId_9) {
        const result_972 = (window.imData.friends || []).find(
            (item_19) => String(item_19.id) === String(friendId_9),
        );
        if (result_972?.type !== 'char') return false;
        return (window.userPhoneAccessUi?.open(result_972), true);
    };
    async function handleAction_93() {
        const friend_61 = window.imData.currentSettingsFriend;
        if (!friend_61 || !chatCustomLanguageInput || chatLanguageSelect_2?.value !== '__custom__')
            return;
        const language_3 = String(chatCustomLanguageInput.value || '').trim();
        if (!language_3) {
            showToast_2('请输入自定义语言');
            return;
        }
        const previousValue_3 = friend_61.language || 'zh',
            value_977 = await commitSettingsFriendChange(
                (value_978) => {
                    value_978.language = language_3;
                },
                {
                    silent: true,
                },
            );
        !value_977 &&
            ((chatCustomLanguageInput.value = value_92.has(previousValue_3) ? '' : previousValue_3),
            showToast_2('语言设置保存失败'));
    }
    chatCustomLanguageInput?.addEventListener('blur', () => void handleAction_93());
    chatCustomLanguageInput?.addEventListener('change', () => void handleAction_93());
    chatCustomLanguageInput?.addEventListener('keydown', (event_219) => {
        if (event_219.key !== 'Enter' || event_219.isComposing || event_219.keyCode === 229) return;
        event_219.preventDefault();
        chatCustomLanguageInput.blur();
    });
    const chatMessageCountMinInputElement = document.getElementById('chat-message-count-min-input'),
        chatMessageCountMaxInputElement = document.getElementById('chat-message-count-max-input'),
        clampChatMessageCount = (value_9_2) =>
            Math.min(20, Math.max(1, Math.round(Number(value_9_2) || 1)));
    async function handleAction_95(changedSide) {
        const currentSettingsFriend_982 = window.imData.currentSettingsFriend;
        if (
            !currentSettingsFriend_982 ||
            !chatMessageCountMinInputElement ||
            !chatMessageCountMaxInputElement
        )
            return;
        let min_3 = clampChatMessageCount(chatMessageCountMinInputElement.value),
            max_3 = clampChatMessageCount(chatMessageCountMaxInputElement.value);
        if (min_3 > max_3) {
            if (changedSide === 'min') max_3 = min_3;
            else min_3 = max_3;
        }
        chatMessageCountMinInputElement.value = String(min_3);
        chatMessageCountMaxInputElement.value = String(max_3);
        const value_985 = window.imDataUtils?.normalizeChatMessageRange
                ? window.imDataUtils.normalizeChatMessageRange(
                      currentSettingsFriend_982.messageCountMin,
                      currentSettingsFriend_982.messageCountMax,
                      2,
                      8,
                  )
                : {
                      min: 2,
                      max: 8,
                  },
            saved_20 = await commitSettingsFriendChange(
                (targetFriend_17) => {
                    targetFriend_17.messageCountMin = min_3;
                    targetFriend_17.messageCountMax = max_3;
                },
                {
                    silent: true,
                },
            );
        !saved_20 &&
            ((chatMessageCountMinInputElement.value = String(value_985.min)),
            (chatMessageCountMaxInputElement.value = String(value_985.max)),
            showToast_2('消息条数保存失败'));
    }
    chatMessageCountMinInputElement?.addEventListener('change', () => void handleAction_95('min'));
    chatMessageCountMinInputElement?.addEventListener('blur', () => void handleAction_95('min'));
    chatMessageCountMaxInputElement?.addEventListener('change', () => void handleAction_95('max'));
    chatMessageCountMaxInputElement?.addEventListener('blur', () => void handleAction_95('max'));
    const chatTimeAwareToggleElement = document.getElementById('chat-time-aware-toggle');
    chatTimeAwareToggleElement &&
        chatTimeAwareToggleElement.dataset.bound !== 'true' &&
        ((chatTimeAwareToggleElement.dataset.bound = 'true'),
        chatTimeAwareToggleElement.addEventListener('change', async (event_988) => {
            if (window.imData.currentSettingsFriend) {
                const checked_7 = window.imData.currentSettingsFriend.timeAware !== false,
                    timeAware_2 = event_988.target.checked,
                    value_991 = await commitSettingsFriendChange(
                        (targetFriend_18) => {
                            targetFriend_18.timeAware = timeAware_2;
                            if (!timeAware_2) {
                                const locationProfile_3 = handleAction_38(targetFriend_18);
                                locationProfile_3.timeDifferenceEnabled = false;
                                targetFriend_18.locationProfile = locationProfile_3;
                            }
                        },
                        {
                            silent: true,
                        },
                    );
                if (!value_991) {
                    event_988.target.checked = checked_7;
                    showToast_2('时间感知设置保存失败');
                } else !timeAware_2 && handleAction_39(window.imData.currentSettingsFriend);
            }
        }));
    const chatRoleRecallToggleElement = document.getElementById('chat-role-recall-toggle');
    chatRoleRecallToggleElement &&
        chatRoleRecallToggleElement.dataset.bound !== 'true' &&
        ((chatRoleRecallToggleElement.dataset.bound = 'true'),
        chatRoleRecallToggleElement.addEventListener('change', async (event_994) => {
            if (window.imData.currentSettingsFriend) {
                const checked_8 = window.imData.currentSettingsFriend.allowRoleRecall !== false,
                    checked_996 = event_994.target.checked,
                    saved_21 = await commitSettingsFriendChange(
                        (targetFriend_19) => {
                            targetFriend_19.allowRoleRecall = checked_996;
                        },
                        {
                            silent: true,
                        },
                    );
                !saved_21 &&
                    ((event_994.target.checked = checked_8), showToast_2('角色撤回设置保存失败'));
            }
        }));
    const chatCharBlockToggleElement = document.getElementById('chat-char-block-toggle');
    chatCharBlockToggleElement &&
        chatCharBlockToggleElement.dataset.bound !== 'true' &&
        ((chatCharBlockToggleElement.dataset.bound = 'true'),
        chatCharBlockToggleElement.addEventListener('change', async (event_999) => {
            const currentSettingsFriend_1000 = window.imData.currentSettingsFriend;
            if (!currentSettingsFriend_1000 || currentSettingsFriend_1000.type === 'group') return;
            const checked_14 = currentSettingsFriend_1000.allowCharBlock === true,
                allowCharBlock_2 = event_999.target.checked === true,
                value_1003 = await commitSettingsFriendChange(
                    (value_1004) => {
                        value_1004.allowCharBlock = allowCharBlock_2;
                    },
                    {
                        silent: true,
                    },
                );
            !value_1003 &&
                ((event_999.target.checked = checked_14), showToast_2('Char 拉黑权限保存失败'));
        }));
    const autonomousSaveBtn_2 = document.getElementById('chat-block-friend-btn');
    autonomousSaveBtn_2 &&
        autonomousSaveBtn_2.dataset.bound !== 'true' &&
        ((autonomousSaveBtn_2.dataset.bound = 'true'),
        autonomousSaveBtn_2.addEventListener('click', () => {
            const friend_62 = window.imData.currentSettingsFriend;
            if (!friend_62 || friend_62.type === 'group') return;
            const value_1006 = friend_62.blockState?.userBlocksChar === true,
                value_1007 = async () => {
                    autonomousSaveBtn_2.style.pointerEvents = 'none';
                    const value_1008 = await window.imApp.commitChatBlockState(
                        friend_62,
                        'userBlocksChar',
                        !value_1006,
                        {
                            requestStatus: value_1006 ? 'resolved' : undefined,
                            decision: value_1006 ? 'unblocked' : undefined,
                        },
                    );
                    autonomousSaveBtn_2.style.pointerEvents = '';
                    if (!value_1008) {
                        showToast_2(value_1006 ? '解除拉黑失败' : '拉黑好友失败');
                        return;
                    }
                    const currentSettingsFriend_3 =
                        window.imApp.getFriendById?.(friend_62.id) || friend_62;
                    window.imData.currentSettingsFriend = currentSettingsFriend_3;
                    autonomousSaveBtn_2.textContent = value_1006 ? '拉黑好友' : '解除拉黑';
                    autonomousSaveBtn_2.style.color = value_1006 ? '#ff3b30' : '#007aff';
                    showToast_2(value_1006 ? '已解除拉黑' : '已将对方拉黑');
                };
            if (value_1006) {
                void value_1007();
                return;
            }
            showCustomModal_2({
                title: '拉黑好友',
                message: '拉黑后，对方的普通消息会发送失败，只能向你申请解除拉黑。',
                confirmText: '拉黑',
                cancelText: '取消',
                isDestructive: true,
                onConfirm: () => void value_1007(),
            });
        }));
    const chatAutoExpandTranslationToggleElement = document.getElementById(
        'chat-auto-expand-translation-toggle',
    );
    chatAutoExpandTranslationToggleElement &&
        chatAutoExpandTranslationToggleElement.dataset.bound !== 'true' &&
        ((chatAutoExpandTranslationToggleElement.dataset.bound = 'true'),
        chatAutoExpandTranslationToggleElement.addEventListener('change', async (event_1010) => {
            if (window.imData.currentSettingsFriend) {
                const checked_9 =
                        window.imData.currentSettingsFriend.autoExpandTranslation === true,
                    checked_1012 = event_1010.target.checked,
                    saved_22 = await commitSettingsFriendChange(
                        (targetFriend_20) => {
                            targetFriend_20.autoExpandTranslation = checked_1012;
                        },
                        {
                            silent: true,
                        },
                    );
                !saved_22 &&
                    ((event_1010.target.checked = checked_9),
                    showToast_2('自动展开翻译设置保存失败'));
            }
        }));
    const chatMcpEnabledToggleElement = document.getElementById('chat-mcp-enabled-toggle');
    chatMcpEnabledToggleElement &&
        chatMcpEnabledToggleElement.dataset.bound !== 'true' &&
        ((chatMcpEnabledToggleElement.dataset.bound = 'true'),
        chatMcpEnabledToggleElement.addEventListener('change', (event_1015) => {
            const currentSettingsFriend_1016 = window.imData.currentSettingsFriend;
            if (!currentSettingsFriend_1016?.id) return;
            const checked_15 =
                    window.imMcpConfig?.isEnabled?.(currentSettingsFriend_1016.id) === true,
                value_1018 = event_1015.target.checked === true,
                value_1019 = value_1018
                    ? window.imMcpConfig?.enable?.(currentSettingsFriend_1016.id)
                    : window.imMcpConfig?.disable?.(currentSettingsFriend_1016.id);
            if (value_1019 !== true) {
                event_1015.target.checked = checked_15;
                showToast_2('MCP 设置保存失败');
                return;
            }
            handleAction_85(currentSettingsFriend_1016);
            showToast_2(value_1018 ? '已启用 MCP 工具调用' : '已禁用 MCP 工具调用');
        }));
    const chatMcpDisplayToggleElement = document.getElementById('chat-mcp-display-toggle');
    chatMcpDisplayToggleElement &&
        chatMcpDisplayToggleElement.dataset.bound !== 'true' &&
        ((chatMcpDisplayToggleElement.dataset.bound = 'true'),
        chatMcpDisplayToggleElement.addEventListener('change', (event_1020) => {
            const currentSettingsFriend_1021 = window.imData.currentSettingsFriend;
            if (!currentSettingsFriend_1021?.id) return;
            const checked_16 =
                    window.imMcpConfig?.shouldShowToolCalls?.(currentSettingsFriend_1021.id) !==
                    false,
                value_1023 = event_1020.target.checked === true,
                setShowToolCalls_1024 = window.imMcpConfig?.setShowToolCalls?.(
                    currentSettingsFriend_1021.id,
                    value_1023,
                );
            if (setShowToolCalls_1024 !== true) {
                event_1020.target.checked = checked_16;
                showToast_2('工具调用显示设置保存失败');
                return;
            }
            handleAction_85(currentSettingsFriend_1021);
            showToast_2(value_1023 ? '将保留工具调用成功提示' : '工具调用提示将在回复后隐藏');
        }));
    window.addEventListener('mcp-chat-config-updated', (value_1025) => {
        const friend_63 = window.imData.currentSettingsFriend;
        friend_63?.id &&
            String(value_1025.detail?.friendId) === String(friend_63.id) &&
            handleAction_85(friend_63);
    });
    window.addEventListener('mcp-servers-updated', () => {
        handleAction_85(window.imData.currentSettingsFriend);
    });
    function getCurrentTtsVoiceSettings(friend_64) {
        if (!friend_64 || typeof friend_64 !== 'object')
            return {
                enabled: false,
                voiceId: '',
                speed: 1,
            };
        const source =
            friend_64.ttsVoice && typeof friend_64.ttsVoice === 'object'
                ? friend_64.ttsVoice
                : friend_64.minimaxVoice && typeof friend_64.minimaxVoice === 'object'
                  ? friend_64.minimaxVoice
                  : {};
        return {
            enabled: source.enabled === true,
            voiceId: String(source.voiceId || '').trim(),
            speed: Math.max(0.5, Math.min(2, Number.parseFloat(source.speed) || 1)),
        };
    }
    function syncChatTtsBodyVisibility(enabled_3) {
        const body_2 = document.getElementById('chat-tts-settings-body');
        if (body_2) body_2.style.display = enabled_3 ? 'block' : 'none';
    }
    const chatTtsEnabledToggleElement = document.getElementById('chat-tts-enabled-toggle');
    chatTtsEnabledToggleElement &&
        chatTtsEnabledToggleElement.dataset.bound !== 'true' &&
        ((chatTtsEnabledToggleElement.dataset.bound = 'true'),
        chatTtsEnabledToggleElement.addEventListener('change', async (e_5) => {
            if (!window.imData.currentSettingsFriend) return;
            const previousSettings = {
                    ...getCurrentTtsVoiceSettings(window.imData.currentSettingsFriend),
                },
                nextValue = e_5.target.checked;
            syncChatTtsBodyVisibility(nextValue);
            const saved_23 = await commitSettingsFriendChange(
                (targetFriend_21) => {
                    targetFriend_21.ttsVoice = {
                        ...getCurrentTtsVoiceSettings(targetFriend_21),
                        enabled: nextValue,
                    };
                    delete targetFriend_21.minimaxVoice;
                },
                {
                    silent: true,
                },
            );
            !saved_23 &&
                ((e_5.target.checked = !!previousSettings.enabled),
                syncChatTtsBodyVisibility(!!previousSettings.enabled),
                showToast_2('TTS 设置保存失败'));
        }));
    async function saveChatTtsField(field, value_10_2, inputEl, value_14) {
        if (!window.imData.currentSettingsFriend) return;
        const saved_24 = await commitSettingsFriendChange(
            (targetFriend_22) => {
                targetFriend_22.ttsVoice = {
                    ...getCurrentTtsVoiceSettings(targetFriend_22),
                    [field]: value_10_2,
                };
                delete targetFriend_22.minimaxVoice;
            },
            {
                silent: true,
            },
        );
        if (!saved_24) {
            if (inputEl) inputEl.value = value_14;
            showToast_2('TTS 设置保存失败');
        }
    }
    const chatTtsVoiceInput_2 = document.getElementById('chat-tts-voice-id-input');
    chatTtsVoiceInput_2 &&
        chatTtsVoiceInput_2.dataset.bound !== 'true' &&
        ((chatTtsVoiceInput_2.dataset.bound = 'true'),
        chatTtsVoiceInput_2.addEventListener('change', async (e_6) => {
            const previousValue_4 =
                getCurrentTtsVoiceSettings(window.imData.currentSettingsFriend).voiceId || '';
            await saveChatTtsField('voiceId', e_6.target.value.trim(), e_6.target, previousValue_4);
        }));
    const chatTtsSpeedInputElement = document.getElementById('chat-tts-speed-input');
    chatTtsSpeedInputElement &&
        chatTtsSpeedInputElement.dataset.bound !== 'true' &&
        ((chatTtsSpeedInputElement.dataset.bound = 'true'),
        chatTtsSpeedInputElement.addEventListener('change', async (e_7) => {
            const previousValue_5 =
                    getCurrentTtsVoiceSettings(window.imData.currentSettingsFriend).speed || 1,
                value_12_2 = Math.max(0.5, Math.min(2, parseFloat(e_7.target.value) || 1));
            e_7.target.value = value_12_2;
            await saveChatTtsField('speed', value_12_2, e_7.target, previousValue_5);
        }));
    const chatAvatarToggleElement = document.getElementById('chat-avatar-toggle');
    chatAvatarToggleElement &&
        chatAvatarToggleElement.addEventListener('change', async (event_1042) => {
            if (window.imData.currentSettingsFriend) {
                const checked_10 = !!window.imData.currentSettingsFriend.showAvatar,
                    showAvatar_3 = event_1042.target.checked,
                    value_1045 = await commitSettingsFriendChange(
                        (value_1046) => {
                            value_1046.showAvatar = showAvatar_3;
                        },
                        {
                            silent: true,
                        },
                    );
                if (!value_1045) {
                    event_1042.target.checked = checked_10;
                    showToast_2('头像设置保存失败');
                    return;
                }
                if (window.imChat && window.imChat.rerenderChatContainer) {
                    const currentSettingsFriend_1047 = window.imData.currentSettingsFriend,
                        elementById_1048 = document.getElementById(
                            'chat-interface-' + currentSettingsFriend_1047.id,
                        );
                    if (elementById_1048) {
                        const insChatMessagesElement_1049 =
                            elementById_1048.querySelector('.ins-chat-messages');
                        if (insChatMessagesElement_1049)
                            window.imChat.rerenderChatContainer(
                                currentSettingsFriend_1047,
                                insChatMessagesElement_1049,
                                {
                                    scroll: false,
                                },
                            );
                    }
                }
            }
        });
    const pinToggle_2 = document.getElementById('chat-pinned-toggle');
    pinToggle_2 &&
        pinToggle_2.addEventListener('change', async (event_1050) => {
            if (window.imData.currentSettingsFriend) {
                const checked_11 = !!window.imData.currentSettingsFriend.isPinned,
                    isPinned_3 = event_1050.target.checked,
                    value_1053 = await commitSettingsFriendChange(
                        (value_1055) => {
                            value_1055.isPinned = isPinned_3;
                        },
                        {
                            silent: true,
                        },
                    );
                if (!value_1053) {
                    event_1050.target.checked = checked_11;
                    showToast_2('置顶设置保存失败');
                    return;
                }
                if (window.imApp.renderChatsList) window.imApp.renderChatsList();
                showToast_2(window.imData.currentSettingsFriend.isPinned ? '已置顶' : '已取消置顶');
                const page_4 = document.getElementById(
                    'chat-interface-' + window.imData.currentSettingsFriend.id,
                );
                page_4 &&
                    (window.imData.currentSettingsFriend.isPinned
                        ? page_4.classList.add('pinned-chat')
                        : page_4.classList.remove('pinned-chat'));
            }
        });
    function initTimestampSetting_3(currentSettingsFriend_12) {
        window.imData.currentSettingsFriend = currentSettingsFriend_12;
    }
    function escapeCssAttributeValue(value_13) {
        return String(value_13 ?? '')
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\r/g, '\\d ')
            .replace(/\n/g, '\\a ');
    }
    function scopeThemeCss(css_2, scope) {
        return window.imApp.scopeUserCss
            ? window.imApp.scopeUserCss(css_2, scope)
            : css_2.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/gi, scope + ' ' + '$1$2');
    }
    function applyFriendCss_2(friend_65) {
        let text_1061 = '';
        if (friend_65.customCssEnabled && friend_65.customCss) {
            const value_229 = '#chat-interface-' + friend_65.id,
                value_1064 =
                    '#msg-context-bubble-clone[data-current-friend-id="' +
                    escapeCssAttributeValue(friend_65.id) +
                    '"]';
            text_1061 += scopeThemeCss(friend_65.customCss, value_229);
            text_1061 += `
`;
            text_1061 += scopeThemeCss(friend_65.customCss, value_1064);
            text_1061 += `
`;
        }
        if (friend_65.chatCssEnabled && friend_65.chatCss) {
            const prefix = '#chat-interface-' + friend_65.id;
            text_1061 += scopeThemeCss(friend_65.chatCss, prefix);
            text_1061 += `
`;
        }
        let styleTag = document.getElementById('custom-style-' + friend_65.id);
        if (!text_1061) return (styleTag?.remove(), false);
        !styleTag &&
            ((styleTag = document.createElement('style')),
            (styleTag.id = 'custom-style-' + friend_65.id),
            document.head.appendChild(styleTag));
        if (styleTag.textContent !== text_1061) styleTag.textContent = text_1061;
        return true;
    }
    let text_99 = '';
    async function applyAllSavedCss_2() {
        window.imApp.ensureDataReady && (await window.imApp.ensureDataReady());
        const value_1066 = window.u2ThemeState || {},
            stringify_1067 = JSON.stringify({
                friends: (Array.isArray(window.imData.friends) ? window.imData.friends : []).map(
                    (value_1068) => [
                        String(value_1068?.id || ''),
                        value_1068?.customCssEnabled === true
                            ? String(value_1068.customCss || '')
                            : '',
                        value_1068?.chatCssEnabled === true ? String(value_1068.chatCss || '') : '',
                        value_1068?.statusCssEnabled === true
                            ? String(value_1068.statusCss || '')
                            : '',
                        String(value_1068?.statusRenderMode || ''),
                    ],
                ),
                global: [
                    value_1066.imessageHomeCssEnabled === true
                        ? String(value_1066.imessageHomeCss || '')
                        : '',
                    value_1066.imessageChatCssEnabled === true
                        ? String(value_1066.imessageChatCss || '')
                        : '',
                    value_1066.imessageGroupCssEnabled === true
                        ? String(value_1066.imessageGroupCss || '')
                        : '',
                ],
            });
        if (stringify_1067 === text_99) return false;
        return (
            Array.isArray(window.imData.friends) &&
                window.imData.friends.forEach((value_1069) => {
                    applyFriendCss_2(value_1069);
                    window.imApp.applyFriendStatusBarCss?.(value_1069);
                }),
            window.imApp.applyGlobalChatCss && window.imApp.applyGlobalChatCss(value_1066),
            window.imApp.applyGlobalGroupCss?.(value_1066),
            window.imApp.applyGlobalHomeCss?.(value_1066),
            (text_99 = stringify_1067),
            true
        );
    }
    let enabled_101 = false,
        enabled_102 = false,
        enabled_103 = false;
    function restoreSavedCss() {
        enabled_103 = true;
        if (enabled_101 || enabled_102) return;
        enabled_101 = true;
        const value_1070 = async () => {
            enabled_101 = false;
            if (enabled_102) return;
            enabled_102 = true;
            try {
                do {
                    enabled_103 = false;
                    await applyAllSavedCss_2();
                } while (enabled_103);
            } catch (error_11) {
                console.warn('Failed to restore saved iMessage CSS:', error_11);
            } finally {
                enabled_102 = false;
            }
        };
        if (typeof queueMicrotask === 'function') queueMicrotask(value_1070);
        else Promise.resolve().then(value_1070);
    }
    document.addEventListener('imessage-data-ready', restoreSavedCss);
    document.addEventListener('u2-theme-state-ready', restoreSavedCss);
    restoreSavedCss();
    const saveCssPresetBtn = document.getElementById('save-css-preset-btn'),
        loadCssPresetBtn = document.getElementById('load-css-preset-btn'),
        cssPresetListSheet = document.getElementById('css-preset-list-sheet'),
        cssPresetList = document.getElementById('css-preset-list');
    cssPresetListSheet &&
        cssPresetListSheet.addEventListener('click', (event_232) => {
            event_232.target === cssPresetListSheet && closeView_2(cssPresetListSheet);
        });
    let cssPresets_2 = Array.isArray(window.imData.cssPresets) ? window.imData.cssPresets : [];
    saveCssPresetBtn &&
        saveCssPresetBtn.addEventListener('click', () => {
            if (!window.imData.currentSettingsFriend) return;
            showCustomModal_2({
                type: 'prompt',
                title: '存为预设',
                placeholder: '输入预设名称',
                confirmText: '保存',
                onConfirm: (name_3) => {
                    if (name_3 && name_3.trim()) {
                        cssPresets_2.push({
                            name: name_3.trim(),
                            css: bubbleCssInput.value,
                            id: Date.now(),
                        });
                        window.imData.cssPresets = cssPresets_2;
                        if (window.saveGlobalData) window.saveGlobalData();
                        showToast_2('预设已保存');
                    }
                },
            });
        });
    loadCssPresetBtn &&
        loadCssPresetBtn.addEventListener('click', () => {
            renderCssPresetList();
            openView_3(cssPresetListSheet);
        });
    function renderCssPresetList() {
        if (!cssPresetList) return;
        cssPresetList.innerHTML = '';
        if (cssPresets_2.length === 0) {
            cssPresetList.innerHTML =
                '<div style="padding: 20px; text-align: center; color: #8e8e93;">暂无预设</div>';
            return;
        }
        cssPresets_2.forEach((preset_4) => {
            const item_20 = document.createElement('div');
            item_20.className = 'account-card';
            item_20.innerHTML =
                `
                <div class="account-content" style="cursor: pointer;">
                    <div class="account-info">
                        <div class="account-name">` +
                preset_4.name +
                `</div>
                    </div>
                </div>
                <div class="delete-icon"><i class="fas fa-times"></i></div>
            `;
            item_20.querySelector('.account-content').addEventListener('click', () => {
                window.imData.currentSettingsFriend &&
                    ((bubbleCssInput.value = preset_4.css),
                    applyCssBtn.click(),
                    closeView_2(cssPresetListSheet));
            });
            item_20.querySelector('.delete-icon').addEventListener('click', (e_8) => {
                e_8.stopPropagation();
                cssPresets_2 = cssPresets_2.filter((p) => p.id !== preset_4.id);
                window.imData.cssPresets = cssPresets_2;
                if (window.saveGlobalData) window.saveGlobalData();
                renderCssPresetList();
            });
            cssPresetList.appendChild(item_20);
        });
    }
    window.imApp.initChatSettingsForFriend = initChatSettingsForFriend_3;
    window.imApp.openChatSettingsForFriend = openChatSettingsForFriend_2;
    window.imApp.updateStatusBarBtnCount = updateStatusBarBtnCount_2;
    window.imApp.applyFriendBg = applyFriendBg_2;
    window.imApp.initTimestampSetting = initTimestampSetting_3;
    window.imApp.applyFriendCss = applyFriendCss_2;
    window.imApp.applyAllSavedCss = applyAllSavedCss_2;
    window.imApp.renderRelationshipSheet = renderRelationshipSheet_2;
    window.imApp.getBoundAccountByFriend = getBoundAccountByFriend_2;
    window.imApp.getEffectivePersonaForFriend = getEffectivePersonaForFriend_3;
    window.imApp.getFriendsBoundToAccount = getFriendsBoundToAccount_2;
    window.imApp.updateChatBindIdLabel = updateChatBindIdLabel_2;
    window.imApp.renderCherishedMemoryCards = renderCherishedMemoryCards_3;
    window.imApp.showCherishedMemoryDetail = showCherishedMemoryDetail_2;
    window.imApp.hideCherishedMemoryDetail = hideCherishedMemoryDetail_3;
    window.imApp.showChatMemoryModal = showChatMemoryModal_2;
    window.imApp.hideChatMemoryModal = hideChatMemoryModal_2;
});
