(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    const followingBar = document.getElementById('tk-following-bar'),
        addCharBtn = document.getElementById('tk-chat-add-btn'),
        editCharSheet = document.getElementById('tk-edit-char-sheet'),
        dmsContainer = document.getElementById('tk-chat-dms-container'),
        chatView = document.getElementById('tk-dm-chat-view'),
        chatBackBtn = document.getElementById('tk-dm-back-btn'),
        chatTitle = document.getElementById('tk-dm-chat-title'),
        messagesContainer = document.getElementById('tk-dm-messages-container'),
        chatInput = document.getElementById('tk-dm-chat-input'),
        chatSendBtn = document.getElementById('tk-dm-chat-send'),
        chatMicBtn = document.getElementById('tk-dm-mic-btn'),
        chatGenerateDmsBtn = document.getElementById('tk-chat-generate-dms-btn'),
        charAvatarImg = document.getElementById('tk-char-avatar-img'),
        tkSubProfileMsgBtn = document.getElementById('tk-sub-profile-msg-btn'),
        charAvatarIcon = document.querySelector('#tk-char-avatar-preview i'),
        charNameInput = document.getElementById('tk-char-name'),
        charStatusInput = document.getElementById('tk-char-status'),
        charPersonaInput = document.getElementById('tk-char-persona'),
        charBioInput = document.getElementById('tk-char-bio'),
        charFollowingInput = document.getElementById('tk-char-following'),
        charFollowersInput = document.getElementById('tk-char-followers'),
        charLikesInput = document.getElementById('tk-char-likes'),
        saveCharBtn = document.getElementById('tk-save-char-btn'),
        deleteCharBtn = document.getElementById('tk-delete-char-btn');
    let editingCharId = null,
        currentChatCharId = null,
        enabled = false;
    function tkDmEscapeHtml(value_2) {
        return String(value_2 ?? '').replace(
            /[&<>"']/g,
            (char) =>
                ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                })[char],
        );
    }
    function tkDmResolveAvatar(char_2) {
        if (!char_2) return '';
        return window.tkResolveAvatar
            ? window.tkResolveAvatar(char_2.id, char_2.name || char_2.handle, char_2.avatar)
            : char_2.avatar || '';
    }
    function tkDmRelationshipLabel(char_3) {
        if (!char_3) return '';
        if (char_3.isFollowed && char_3.isFollower) return '互相关注';
        if (char_3.isFollower && !char_3.isFollowed) return '对方是陌生人';
        return '';
    }
    function tkDmRenderActivitySummary() {
        const items = document.querySelectorAll('#tk-activity-list > .tk-activity-item');
        if (!items || items.length < 3) return;
        const activity_2 = {
            newFollowers: '暂无新粉丝',
            likesSaves: '互动消息',
            commentsMentions: '互动消息',
            ...(tkState.activity && typeof tkState.activity === 'object' ? tkState.activity : {}),
        };
        [activity_2.newFollowers, activity_2.likesSaves, activity_2.commentsMentions].forEach(
            (text_2, index) => {
                const desc_2 = items[index]?.querySelector('.tk-activity-desc');
                if (desc_2) desc_2.textContent = text_2 || '互动消息';
            },
        );
    }
    function tkDmProfileIntroHtml(char_4) {
        const tkDmResolveAvatar_15 = tkDmResolveAvatar(char_4),
            value_16 = tkDmResolveAvatar_15
                ? '<img src="' + tkDmEscapeHtml(tkDmResolveAvatar_15) + '" alt="">'
                : '<i class="fas fa-user"></i>';
        return (
            `
            <div class="tk-dm-profile-intro">
                <div class="tk-dm-profile-avatar">` +
            value_16 +
            `</div>
                <div class="tk-dm-profile-name">` +
            tkDmEscapeHtml(char_4?.name || char_4?.handle || 'User') +
            `</div>
                <div class="tk-dm-profile-meta">@` +
            tkDmEscapeHtml(char_4?.handle || char_4?.id || 'user') +
            ' · ' +
            tkDmEscapeHtml(
                [tkDmRelationshipLabel(char_4), char_4?.status || 'TikTok']
                    .filter(Boolean)
                    .join(' · '),
            ) +
            `</div>
                <button type="button" class="tk-dm-profile-home-btn" id="tk-dm-profile-home-btn">主页</button>
            </div>
        `
        );
    }
    function tkDmResolveApiEndpoint() {
        return window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint);
    }
    function tkDmSlug(value_3, fallback = 'tiktok_user') {
        const slug = String(value_3 || fallback)
            .trim()
            .toLowerCase()
            .replace(/^@/, '')
            .replace(/[^a-z0-9_\u4e00-\u9fa5]+/gi, '_')
            .replace(/^_+|_+$/g, '');
        return slug || fallback;
    }
    function tkDmNormalizeGeneratedMessages(rawMessages) {
        if (!Array.isArray(rawMessages)) return [];
        return rawMessages
            .map((item) => {
                if (typeof item === 'string')
                    return {
                        text: item,
                        translationZh: '',
                    };
                if (item && typeof item === 'object')
                    return {
                        text: item.content || item.text || item.message || '',
                        translationZh:
                            item.translationZh || item.translation || item.zhTranslation || '',
                    };
                return {
                    text: '',
                    translationZh: '',
                };
            })
            .map((message_2) => ({
                text: String(message_2.text || '').trim(),
                translationZh: String(message_2.translationZh || '').trim(),
            }))
            .filter((value_21) => value_21.text)
            .slice(0, 10);
    }
    function tkDmSetGenerateButtonLoading(isLoading) {
        if (!chatGenerateDmsBtn) return;
        chatGenerateDmsBtn.style.opacity = isLoading ? '0.45' : '1';
        chatGenerateDmsBtn.style.pointerEvents = isLoading ? 'none' : 'auto';
        chatGenerateDmsBtn.title = isLoading ? 'Generating messages' : 'Generate incoming DMs';
    }
    window.tkGenerateIncomingDms = async function () {
        if (enabled) return;
        if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
            if (window.showToast) window.showToast('请先在系统设置中配置 API');
            return;
        }
        enabled = true;
        tkDmSetGenerateButtonLoading(true);
        if (window.showToast) window.showToast('正在生成 TikTok 私信...');
        const userPersonaParts = [
                tkState.profile?.persona
                    ? 'TikTok profile persona: ' + tkState.profile.persona
                    : '',
                tkState.profile?.bio ? 'TikTok profile bio: ' + tkState.profile.bio : '',
                window.userState?.persona ? 'User base persona: ' + window.userState.persona : '',
                tkState.profile?.name ? 'TikTok display name: ' + tkState.profile.name : '',
                tkState.profile?.handle ? 'TikTok handle: @' + tkState.profile.handle : '',
            ].filter(Boolean),
            userPersonaContext =
                userPersonaParts.join(`
`) || 'No explicit TikTok persona. Infer a normal but specific TikTok creator/user.',
            wbTriggerText = [
                'TikTok incoming direct messages',
                tkState.profile?.name || '',
                tkState.profile?.handle || '',
                tkState.profile?.persona || '',
                tkState.profile?.bio || '',
                window.userState?.persona || '',
            ].filter(Boolean).join(`
`),
            value_25 = window.tkBuildWorldBookContext
                ? window.tkBuildWorldBookContext(wbTriggerText)
                : '',
            content_2 =
                `
Generate incoming TikTok direct messages for the current user's TikTok account. This must perfectly simulate the highly realistic, chaotic, and unfiltered environment of real TikTok DMs.

User TikTok persona:
` +
                userPersonaContext +
                `

Mounted and built-in world book context:
` +
                (value_25 || 'No extra world book context.') +
                `

Hard requirements:
1. Return one strict JSON object only. No markdown, no prose, no comments, no trailing commas.
2. The JSON shape must be {"users":[...]}.
3. Generate 2-5 different senders. To reflect real TikTok DMs, mix normal users (strangers, peers, followers) with UNWANTED users (crypto/forex scammers, fake sugar daddies/mommies, fake agency collabs, bots, weird creeps, or harassment messages).
4. Every sender must include "name", "handle", "avatarDesc", "persona", "status", and "messages". "persona" must explicitly describe their motive (e.g. "Crypto scammer trying to sell a course" or "Creepy stranger asking for feet pics").
5. "messages" must contain 5-10 message objects from that sender to the user. Each object is one short chat bubble.
6. The messages must feel EXTREMELY REAL to TikTok. Scammers should use their typical aggressive/scripted tactics, creeps should be inappropriately forward, bots should sound like spam, and normal users should be casual.
7. Do not use emoji. Do not write as the user. Do not include offer cards or non-text message types. 禁止扮演user的身份发抖音和评论，你只能是除了user以外的人。
8. The app is international. The message text can be any language that fits the sender persona. If "text" is not Chinese, "translationZh" must contain a natural Chinese translation. If "text" is Chinese, "translationZh" must be an empty string.

JSON example:
{
  "users": [
    {
      "name": "sender name",
      "handle": "sender_handle",
      "avatarDesc": "short avatar seed",
      "persona": "why this sender would DM the user",
      "status": "short TikTok status",
      "messages": [
        { "text": "message 1", "translationZh": "" },
        { "text": "foreign-language message", "translationZh": "这条外语消息的中文翻译" },
        { "text": "message 3", "translationZh": "" },
        { "text": "message 4", "translationZh": "" },
        { "text": "message 5", "translationZh": "" }
      ]
    }
  ]
}
`;
        try {
            const value_27 = await fetch(tkDmResolveApiEndpoint(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + window.apiConfig.apiKey,
                },
                body: JSON.stringify({
                    model: window.apiConfig.model || 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content:
                                'Return strict valid JSON only. Use double-quoted keys and strings. Do not use markdown, comments, prose, or trailing commas.',
                        },
                        {
                            role: 'user',
                            content: content_2,
                        },
                    ],
                    temperature: parseFloat(window.apiConfig.temperature) || 0.9,
                }),
            });
            if (!value_27.ok)
                throw (
                    window.u2Api?.createHttpError?.(
                        value_27,
                        await window.u2Api?.readApiError?.(value_27),
                    ) ||
                    Object.assign(new Error('HTTP ' + value_27.status), {
                        status: value_27.status,
                    })
                );
            const data = await value_27.json(),
                parsed = window.tkParseAiJson
                    ? window.tkParseAiJson(data.choices?.[0]?.message?.content || '')
                    : JSON.parse(data.choices?.[0]?.message?.content || '{}'),
                generatedUsers = Array.isArray(parsed.users) ? parsed.users.slice(0, 5) : [],
                created = [];
            generatedUsers.forEach((user, value_32) => {
                const messages_2 = tkDmNormalizeGeneratedMessages(user.messages);
                if (messages_2.length < 5) return;
                const name_2 = String(user.name || 'TikTok DM ' + (value_32 + 1)).trim(),
                    handle_2 = tkDmSlug(user.handle || name_2, 'dm_' + (value_32 + 1)),
                    charId_2 =
                        'tk_dm_' +
                        Date.now() +
                        '_' +
                        value_32 +
                        '_' +
                        Math.floor(Math.random() * 10000),
                    avatar_3 =
                        user.authorAvatar ||
                        user.avatar ||
                        (window.tkResolveAvatar
                            ? window.tkResolveAvatar(charId_2, name_2, '')
                            : 'https://picsum.photos/seed/' +
                              encodeURIComponent(user.avatarDesc || handle_2 || name_2) +
                              '/150/150');
                window.tkSaveChar &&
                    window.tkSaveChar({
                        id: charId_2,
                        name: name_2,
                        handle: handle_2,
                        avatar: avatar_3,
                        status: user.status || '刚刚发来私信',
                        persona: user.persona || 'TikTok 私信联系人：' + name_2,
                        isFollower: true,
                        isFollowed: false,
                    });
                const timestamp_2 = new Date().toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                });
                tkState.dms.unshift({
                    charId: charId_2,
                    messages: messages_2.map((message_3) => ({
                        sender: 'char',
                        text: message_3.text,
                        translationZh: message_3.translationZh,
                        timestamp: timestamp_2,
                    })),
                });
                created.push(charId_2);
            });
            if (!created.length) throw new Error('No valid DM threads in API response');
            if (window.tkPersistState) window.tkPersistState();
            if (window.tkRenderChat) window.tkRenderChat();
            if (window.showToast) window.showToast('收到 ' + created.length + ' 位新联系人私信');
        } catch (error_2) {
            console.error('TikTok incoming DM generation failed:', error_2);
            if (
                !window.u2Api?.isRequestError?.(error_2) ||
                !window.u2Api.reportError(error_2, {
                    operation: 'TikTok 私信生成',
                })
            ) {
                if (window.showToast)
                    window.showToast('无法生成 TikTok 私信，请检查 API 或返回格式');
            }
        } finally {
            enabled = false;
            tkDmSetGenerateButtonLoading(false);
        }
    };
    window.tkRenderChat = function () {
        if (!followingBar) return;
        tkDmRenderActivitySummary();
        followingBar.innerHTML = '';
        const selfAvatarUrl = window.tkResolveAvatar
                ? window.tkResolveAvatar(
                      'profile',
                      tkState.profile.name || tkState.profile.handle || 'User',
                      tkState.profile.avatar,
                  )
                : tkState.profile.avatar,
            value_42 = selfAvatarUrl
                ? '<img src="' + tkDmEscapeHtml(selfAvatarUrl) + '">'
                : '<i class="fas fa-user"></i>',
            element = document.createElement('div');
        element.className = 'tk-follow-item';
        element.innerHTML =
            `
            <div class="tk-follow-avatar">
                ` +
            value_42 +
            `
                <div class="tk-follow-plus"><i class="fas fa-plus"></i></div>
            </div>
            ` +
            (tkState.profile.status
                ? '<div class="tk-follow-bubble">' + tkState.profile.status + '</div>'
                : '') +
            `
            <div class="tk-follow-name">我的状态</div>
        `;
        element.addEventListener('click', () => {
            window.tkRenderProfile &&
                document
                    .querySelector('.tk-bottom-nav .tk-nav-item[data-target="tk-profile-tab"]')
                    .click();
        });
        followingBar.appendChild(element);
        const followedChars = tkState.chars.filter((c_2) => c_2.isFollowed);
        followedChars.forEach((char_5) => {
            const tkDmResolveAvatar_46 = tkDmResolveAvatar(char_5),
                value_47 = tkDmResolveAvatar_46
                    ? '<img src="' + tkDmResolveAvatar_46 + '">'
                    : '<i class="fas fa-user"></i>',
                element_48 = document.createElement('div');
            element_48.className = 'tk-follow-item';
            element_48.innerHTML =
                `
                <div class="tk-follow-avatar">
                    ` +
                value_47 +
                `
                </div>
                ` +
                (char_5.status ? '<div class="tk-follow-bubble">' + char_5.status + '</div>' : '') +
                `
                <div class="tk-follow-name">` +
                (char_5.name || char_5.handle) +
                `</div>
            `;
            element_48.addEventListener('click', () => {
                window.tkOpenSubProfile && window.tkOpenSubProfile(char_5.id);
            });
            followingBar.appendChild(element_48);
        });
        dmsContainer &&
            ((dmsContainer.innerHTML = ''),
            tkState.dms.forEach((dm_2) => {
                const char_6 = window.tkGetChar(dm_2.charId);
                if (!char_6) return;
                const relationLabel = tkDmRelationshipLabel(char_6),
                    lastMsg =
                        dm_2.messages.length > 0
                            ? dm_2.messages[dm_2.messages.length - 1].text
                            : relationLabel || '开始聊天吧',
                    tkDmResolveAvatar_53 = tkDmResolveAvatar(char_6),
                    value_54 = tkDmResolveAvatar_53
                        ? '<img src="' + tkDmResolveAvatar_53 + '">'
                        : '<i class="fas fa-user"></i>',
                    dmItem = document.createElement('div');
                dmItem.className = 'tk-activity-item';
                dmItem.innerHTML =
                    `
                    <div class="tk-activity-icon" style="background: #f0f0f0; color: #999;">
                        ` +
                    value_54 +
                    `
                    </div>
                    <div class="tk-activity-text">
                        <div class="tk-activity-title">` +
                    (char_6.name || char_6.handle) +
                    `</div>
                        <div class="tk-activity-desc" style="display:flex; align-items:center; gap:6px;">
                            ` +
                    lastMsg +
                    `
                        </div>
                    </div>
                    <i class="fas fa-camera arrow" style="font-size: 20px;"></i>
                `;
                dmItem.addEventListener('click', () => {
                    window.tkOpenChatView(char_6.id);
                });
                dmsContainer.appendChild(dmItem);
            }),
            tkState.dms.length === 0 &&
                (dmsContainer.innerHTML =
                    '<div style="padding: 20px; text-align: center; color: #999; font-size: 13px;">暂无消息记录</div>'));
        document.getElementById('tk-chat-tab').dataset.tkRendered = 'true';
    };
    const importSheet = document.getElementById('tk-import-char-sheet'),
        importList = document.getElementById('tk-import-list'),
        closeImportBtn = document.getElementById('tk-close-import-btn');
    addCharBtn &&
        addCharBtn.addEventListener('click', () => {
            window.tkOpenImportSheet();
        });
    chatGenerateDmsBtn &&
        chatGenerateDmsBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (window.tkGenerateIncomingDms) window.tkGenerateIncomingDms();
        });
    closeImportBtn &&
        closeImportBtn.addEventListener('click', () => {
            window.closeView(importSheet);
        });
    window.tkOpenImportSheet = function () {
        if (!importList) return;
        importList.innerHTML = '';
        const createNewBtn = document.createElement('div');
        createNewBtn.className = 'tk-import-item';
        createNewBtn.innerHTML = `
            <div class="tk-avatar-small" style="background: #333; color: white;"><i class="fas fa-plus"></i></div>
            <div style="flex: 1; font-weight: 600; color: #111;">创建新角色</div>
        `;
        createNewBtn.addEventListener('click', () => {
            window.closeView(importSheet);
            openEditChar();
        });
        importList.appendChild(createNewBtn);
        let imFriends = window.getImFriends ? window.getImFriends() : [];
        imFriends = imFriends.filter((f) => !f.isOfficial && f.type !== 'official');
        if (imFriends.length > 0) {
            const separator = document.createElement('div');
            separator.style.fontSize = '13px';
            separator.style.color = '#888';
            separator.style.marginTop = '10px';
            separator.style.marginBottom = '5px';
            separator.textContent = '从信息应用导入:';
            importList.appendChild(separator);
            imFriends.forEach((friend) => {
                const alreadyExists = tkState.chars.some(
                        (c_3) =>
                            String(c_3.id) === String(friend.id) ||
                            String(c_3.imCharId || '') === String(friend.id),
                    ),
                    item_2 = document.createElement('div');
                item_2.className = 'tk-import-item';
                item_2.style.opacity = alreadyExists ? '0.5' : '1';
                const value_60 = friend.avatarUrl
                    ? '<img src="' +
                      friend.avatarUrl +
                      '" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">'
                    : '<i class="fas fa-user"></i>';
                item_2.innerHTML =
                    `
                    <div class="tk-avatar-small">` +
                    value_60 +
                    `</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #111; font-size: 15px;">` +
                    (friend.nickname || friend.realName) +
                    `</div>
                        <div style="color: #888; font-size: 12px; margin-top: 2px;">` +
                    (friend.signature || '') +
                    `</div>
                    </div>
                    ` +
                    (alreadyExists
                        ? '<div style="font-size:12px; color:#999;">已添加</div>'
                        : '<i class="fas fa-download" style="color:#111;"></i>') +
                    `
                `;
                item_2.addEventListener('click', () => {
                    if (alreadyExists) {
                        const existingChar = tkState.chars.find(
                            (c) =>
                                String(c.id) === String(friend.id) ||
                                String(c.imCharId || '') === String(friend.id),
                        );
                        if (existingChar) {
                            existingChar.imCharId = existingChar.imCharId || friend.id;
                            existingChar.isFollowed = true;
                            existingChar.isFollower = true;
                            if (window.tkPersistState) window.tkPersistState();
                            window.showToast('TikTok 账号已同步');
                        }
                        window.closeView(importSheet);
                        return;
                    }
                    const charData = {
                        id: friend.id,
                        name: friend.nickname || friend.realName,
                        handle:
                            (friend.realName || friend.nickname || 'user')
                                .toLowerCase()
                                .replace(/\s+/g, '') +
                            '_' +
                            Math.floor(Math.random() * 100),
                        avatar: friend.avatarUrl,
                        status: friend.signature || '刚来到 TikTok',
                        persona: friend.persona || '',
                        isFollowed: true,
                        isFollower: true,
                        imCharId: friend.id,
                    };
                    window.tkSaveChar(charData);
                    window.tkRenderChat();
                    window.closeView(importSheet);
                    window.showToast('导入成功');
                });
                importList.appendChild(item_2);
            });
        }
        window.openView(importSheet);
    };
    window.tkOpenEditChar = function (charId_3 = null) {
        editingCharId = charId_3;
        const title_2 = document.getElementById('tk-char-sheet-title');
        if (charId_3) {
            if (title_2) title_2.textContent = '编辑角色';
            const char_7 = window.tkGetChar(charId_3);
            if (char_7) {
                if (charNameInput) charNameInput.value = char_7.name || '';
                if (charStatusInput) charStatusInput.value = char_7.status || '';
                if (charPersonaInput) charPersonaInput.value = char_7.persona || '';
                if (charBioInput) charBioInput.value = char_7.bio || '';
                if (charFollowingInput) charFollowingInput.value = char_7.following || 0;
                if (charFollowersInput) charFollowersInput.value = char_7.followers || 0;
                if (charLikesInput) charLikesInput.value = char_7.likes || 0;
                setCharAvatarPreview(char_7.avatar);
                if (deleteCharBtn) deleteCharBtn.style.display = 'block';
            }
        } else {
            if (title_2) title_2.textContent = '添加新角色';
            if (charNameInput) charNameInput.value = '';
            if (charStatusInput) charStatusInput.value = '';
            if (charPersonaInput) charPersonaInput.value = '';
            if (charBioInput) charBioInput.value = '';
            if (charFollowingInput) charFollowingInput.value = 0;
            if (charFollowersInput) charFollowersInput.value = 0;
            if (charLikesInput) charLikesInput.value = 0;
            setCharAvatarPreview(null);
            if (deleteCharBtn) deleteCharBtn.style.display = 'none';
        }
        window.openView(editCharSheet);
    };
    function openEditChar(charId_4) {
        window.tkOpenEditChar(charId_4);
    }
    const avatarWrapper = document.getElementById('tk-char-avatar-wrapper'),
        avatarUpload = document.getElementById('tk-char-avatar-upload');
    avatarWrapper &&
        avatarUpload &&
        (avatarWrapper.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') avatarUpload.click();
        }),
        avatarUpload.addEventListener('change', (e_2) => {
            const file = e_2.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event_2) => setCharAvatarPreview(event_2.target.result);
                reader.readAsDataURL(file);
            }
            e_2.target.value = '';
        }));
    function setCharAvatarPreview(src_2) {
        src_2
            ? ((charAvatarImg.src = src_2),
              (charAvatarImg.style.display = 'block'),
              (charAvatarIcon.style.display = 'none'))
            : ((charAvatarImg.src = ''),
              (charAvatarImg.style.display = 'none'),
              (charAvatarIcon.style.display = 'block'));
    }
    saveCharBtn &&
        saveCharBtn.addEventListener('click', () => {
            const name_3 = charNameInput.value.trim() || 'User_' + Date.now(),
                status_2 = charStatusInput.value.trim(),
                persona_2 = charPersonaInput.value.trim(),
                avatar_2 = charAvatarImg.style.display === 'block' ? charAvatarImg.src : null,
                bio_2 = charBioInput ? charBioInput.value.trim() : '',
                following_2 = charFollowingInput ? charFollowingInput.value : 0,
                followers_2 = charFollowersInput ? charFollowersInput.value : 0,
                likes_2 = charLikesInput ? charLikesInput.value : 0;
            if (editingCharId) {
                const tkGetChar_77 = window.tkGetChar(editingCharId);
                tkGetChar_77 &&
                    ((tkGetChar_77.name = name_3),
                    (tkGetChar_77.status = status_2),
                    (tkGetChar_77.persona = persona_2),
                    (tkGetChar_77.avatar = avatar_2),
                    (tkGetChar_77.bio = bio_2),
                    (tkGetChar_77.following = following_2),
                    (tkGetChar_77.followers = followers_2),
                    (tkGetChar_77.likes = likes_2));
            } else {
                const value_78 = 'char_' + Date.now();
                window.tkSaveChar({
                    id: value_78,
                    name: name_3,
                    handle: value_78,
                    status: status_2,
                    persona: persona_2,
                    avatar: avatar_2,
                    bio: bio_2,
                    following: following_2,
                    followers: followers_2,
                    likes: likes_2,
                    isFollowed: true,
                });
            }
            if (window.tkPersistState) window.tkPersistState();
            window.tkRenderChat();
            window.closeView(editCharSheet);
            window.showToast('已保存');
        });
    deleteCharBtn &&
        deleteCharBtn.addEventListener('click', () => {
            if (editingCharId) {
                if (confirm('确定删除此角色吗？')) {
                    tkState.chars = tkState.chars.filter((c_4) => c_4.id !== editingCharId);
                    if (window.tkPersistState) window.tkPersistState();
                    window.tkRenderChat();
                    window.closeView(editCharSheet);
                    window.showToast('已删除');
                }
            }
        });
    chatBackBtn &&
        chatView &&
        chatBackBtn.addEventListener('click', () => {
            window.closeView(chatView);
            currentChatCharId = null;
        });
    const chatSettingsBtn = document.getElementById('tk-dm-settings-btn'),
        chatSettingsSheet = document.getElementById('tk-dm-chat-settings-sheet'),
        btnClearHistory = document.getElementById('tk-dm-clear-chat-btn'),
        btnBlock = document.getElementById('tk-dm-block-friend-btn'),
        btnDelete = document.getElementById('tk-dm-delete-friend-btn'),
        btnCancel = chatSettingsSheet
            ? chatSettingsSheet.querySelector('.sheet-action[onclick*="tk-dm-chat-settings-sheet"]')
            : null;
    chatSettingsBtn &&
        chatSettingsSheet &&
        (chatSettingsBtn.addEventListener('click', () => {
            window.openView(chatSettingsSheet);
        }),
        btnCancel &&
            btnCancel.addEventListener('click', () => {
                window.closeView(chatSettingsSheet);
            }),
        chatSettingsSheet.addEventListener('click', (event_80) => {
            event_80.target === chatSettingsSheet && window.closeView(chatSettingsSheet);
        }),
        btnClearHistory &&
            btnClearHistory.addEventListener('click', () => {
                if (currentChatCharId && confirm('确定清空聊天记录吗？')) {
                    const dm = tkState.dms.find((d) => d.charId === currentChatCharId);
                    if (dm) {
                        dm.messages = [];
                        if (window.tkPersistState) window.tkPersistState();
                        renderMessages();
                        if (window.tkRenderChat) window.tkRenderChat();
                    }
                    window.closeView(chatSettingsSheet);
                    if (window.showToast) window.showToast('已清空聊天记录');
                }
            }),
        btnBlock &&
            btnBlock.addEventListener('click', () => {
                if (currentChatCharId && confirm('确定拉黑此用户吗？')) {
                    tkState.chars = tkState.chars.filter((c_5) => c_5.id !== currentChatCharId);
                    tkState.dms = tkState.dms.filter((d_2) => d_2.charId !== currentChatCharId);
                    if (window.tkPersistState) window.tkPersistState();
                    window.closeView(chatSettingsSheet);
                    window.closeView(chatView);
                    if (window.tkRenderChat) window.tkRenderChat();
                    currentChatCharId = null;
                    if (window.showToast) window.showToast('已拉黑该用户');
                }
            }),
        btnDelete &&
            btnDelete.addEventListener('click', () => {
                if (currentChatCharId && confirm('确定删除此好友吗？')) {
                    tkState.chars = tkState.chars.filter((c_6) => c_6.id !== currentChatCharId);
                    tkState.dms = tkState.dms.filter((d_3) => d_3.charId !== currentChatCharId);
                    if (window.tkPersistState) window.tkPersistState();
                    window.closeView(chatSettingsSheet);
                    window.closeView(chatView);
                    if (window.tkRenderChat) window.tkRenderChat();
                    currentChatCharId = null;
                    if (window.showToast) window.showToast('已删除好友');
                }
            }));
    const wtBubble = document.getElementById('tk-watch-together-bubble');
    window.currentWtCharId = null;
    function tkEnsureWatchTogetherSheet() {
        let sheet = document.getElementById('tk-watch-together-sheet');
        if (sheet) return sheet;
        sheet = document.createElement('div');
        sheet.id = 'tk-watch-together-sheet';
        sheet.className = 'bottom-sheet-overlay';
        sheet.innerHTML = `
            <div class="bottom-sheet tk-wt-confirm-sheet">
                <div class="sheet-handle"></div>
                <div class="sheet-title">一起看</div>
                <div class="detail-sheet-content tk-wt-confirm-content">
                    <div class="tk-wt-confirm-copy">是否邀请 <span id="tk-wt-confirm-name">TA</span> 一起看视频？</div>
                    <div class="tk-wt-confirm-actions">
                        <div class="sheet-action" id="tk-wt-confirm-cancel">取消</div>
                        <div class="sheet-action confirm-action" id="tk-wt-confirm-submit">邀请</div>
                    </div>
                </div>
            </div>
        `;
        const host = document.getElementById('tiktok-view') || document.body;
        return (
            host.appendChild(sheet),
            sheet.addEventListener('click', (event_3) => {
                if (event_3.target === sheet) window.closeView(sheet);
            }),
            sheet
                .querySelector('#tk-wt-confirm-cancel')
                ?.addEventListener('click', () => window.closeView(sheet)),
            sheet.querySelector('#tk-wt-confirm-submit')?.addEventListener('click', () => {
                const charId_5 = sheet.dataset.charId;
                window.closeView(sheet);
                window.tkStartWatchTogether(charId_5);
            }),
            sheet
        );
    }
    window.tkStartWatchTogether = function (charId_6) {
        const char_8 = window.tkGetChar(charId_6);
        if (!char_8 || !wtBubble) {
            if (window.showToast) window.showToast('找不到角色数据');
            return;
        }
        wtChatHistory = [];
        wtChatContainer &&
            (wtChatContainer.innerHTML =
                '<div style="text-align: center; color: rgba(0,0,0,0.5); font-size: 10px; margin-top: 5px;">点击对方头像可以进行互动</div>');
        if (wtUserAvatar)
            wtUserAvatar.src =
                tkState.profile.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User';
        if (wtCharAvatar)
            wtCharAvatar.src =
                tkDmResolveAvatar(char_8) || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Char';
        wtBubble.dataset.charId = charId_6;
        window.currentWtCharId = charId_6;
        wtBubble.dataset.isHidden = 'false';
        wtBubble.style.display = 'flex';
        if (wtExitMenu) wtExitMenu.style.display = 'none';
        if (wtMainContent) wtMainContent.style.display = 'flex';
        if (wtCloseBtn) wtCloseBtn.className = 'fas fa-times';
        window.closeView(chatView);
        document.querySelector('.tk-bottom-nav .tk-nav-item[data-target="tk-home-tab"]')?.click();
        if (window.showToast) window.showToast('已连接 ' + (char_8.name || char_8.handle));
    };
    window.tkOpenWatchTogetherConfirm = function () {
        const snapshotCharId = currentChatCharId || window.currentWtCharId;
        if (!snapshotCharId || snapshotCharId === 'null' || snapshotCharId === 'undefined') {
            if (window.showToast) window.showToast('无法获取当前聊天对象，请重新进入聊天室！');
            return;
        }
        const char_11 = window.tkGetChar(snapshotCharId);
        if (!char_11) {
            if (window.showToast) window.showToast('找不到角色数据');
            return;
        }
        const sheet_2 = tkEnsureWatchTogetherSheet();
        sheet_2.dataset.charId = snapshotCharId;
        const nameEl = sheet_2.querySelector('#tk-wt-confirm-name');
        if (nameEl) nameEl.textContent = char_11.name || char_11.handle || 'TA';
        window.openView(sheet_2);
    };
    const wtUserAvatar = document.getElementById('wt-user-avatar'),
        wtCharAvatar = document.getElementById('wt-char-avatar'),
        wtCloseBtn = document.getElementById('wt-close-btn'),
        wtChatContainer = document.getElementById('wt-chat-container'),
        wtChatInput = document.getElementById('wt-chat-input'),
        wtSendBtn = document.getElementById('wt-send-btn'),
        wtLoadingOverlay = document.getElementById('wt-loading-overlay'),
        wtLoadingText = document.getElementById('wt-loading-text');
    let wtChatHistory = [];
    function onSend_2() {
        const text_3 = wtChatInput.value.trim();
        if (!text_3) return;
        wtChatHistory.push({
            sender: 'user',
            text: text_3,
        });
        appendWtMessage('user', text_3);
        wtChatInput.value = '';
    }
    wtSendBtn &&
        wtChatInput &&
        (wtSendBtn.addEventListener('click', onSend_2),
        window.mobileInputCompat?.register({
            input: wtChatInput,
            root: document.getElementById('tk-watch-together-bubble'),
            scrollContainer: wtChatContainer,
            onSend: onSend_2,
            allowEmpty: true,
        }));
    function appendWtMessage(sender_2, textContent_2, translationZh_2 = '') {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.width = '100%';
        row.style.justifyContent = sender_2 === 'user' ? 'flex-end' : 'flex-start';
        const msgDiv = document.createElement('div');
        msgDiv.style.background = sender_2 === 'user' ? '#333333' : '#e5e5ea';
        msgDiv.style.color = sender_2 === 'user' ? '#ffffff' : '#111111';
        msgDiv.style.padding = '6px 10px';
        msgDiv.style.borderRadius = '16px';
        msgDiv.style.fontSize = '12px';
        msgDiv.style.maxWidth = '85%';
        msgDiv.style.wordBreak = 'break-word';
        msgDiv.textContent = textContent_2;
        const cleanTranslation = String(translationZh_2 || '').trim();
        if (cleanTranslation) {
            msgDiv.style.cursor = 'pointer';
            const translationDiv = document.createElement('div');
            translationDiv.className = 'tk-dm-translation';
            translationDiv.style.display = 'none';
            translationDiv.textContent = cleanTranslation;
            msgDiv.appendChild(translationDiv);
            msgDiv.addEventListener('click', (event_4) => {
                event_4.stopPropagation();
                translationDiv.style.display =
                    translationDiv.style.display === 'none' ? 'block' : 'none';
            });
        }
        row.appendChild(msgDiv);
        wtChatContainer.appendChild(row);
        wtChatContainer.scrollTop = wtChatContainer.scrollHeight;
    }
    const wtHistoryBtn = document.getElementById('wt-history-btn'),
        wtHistoryOverlay = document.getElementById('wt-history-overlay'),
        wtHistoryClose = document.getElementById('wt-history-close'),
        wtHistoryContent = document.getElementById('wt-history-content');
    wtHistoryBtn &&
        wtHistoryOverlay &&
        (wtHistoryBtn.addEventListener('click', () => {
            wtHistoryContent &&
                ((wtHistoryContent.innerHTML = ''),
                (wtHistoryContent.style.display = 'flex'),
                (wtHistoryContent.style.flexDirection = 'column'),
                (wtHistoryContent.style.gap = '10px'),
                (wtHistoryContent.style.padding = '10px 5px'));
            const charId_7 = wtBubble.dataset.charId,
                tkGetChar_98 = window.tkGetChar(charId_7);
            if (wtChatHistory.length === 0) {
                if (wtHistoryContent)
                    wtHistoryContent.innerHTML =
                        '<div style="text-align: center; color: #999; margin-top: 20px;">暂无聊天记录</div>';
            } else {
                wtChatHistory.forEach((msg_2) => {
                    const isSelf = msg_2.sender === 'user',
                        row_2 = document.createElement('div');
                    row_2.style.display = 'flex';
                    row_2.style.width = '100%';
                    row_2.style.justifyContent = isSelf ? 'flex-end' : 'flex-start';
                    const bubble = document.createElement('div');
                    bubble.style.maxWidth = '80%';
                    bubble.style.padding = '8px 12px';
                    bubble.style.fontSize = '14px';
                    bubble.style.lineHeight = '1.4';
                    bubble.style.wordBreak = 'break-word';
                    isSelf
                        ? ((bubble.style.background = '#111111'),
                          (bubble.style.color = '#ffffff'),
                          (bubble.style.borderRadius = '16px'))
                        : ((bubble.style.background = '#e5e5ea'),
                          (bubble.style.color = '#111111'),
                          (bubble.style.borderRadius = '16px'));
                    bubble.textContent = msg_2.text;
                    row_2.appendChild(bubble);
                    if (wtHistoryContent) wtHistoryContent.appendChild(row_2);
                });
                setTimeout(() => {
                    if (wtHistoryContent)
                        wtHistoryContent.scrollTop = wtHistoryContent.scrollHeight;
                }, 50);
            }
            wtHistoryOverlay.style.display = 'flex';
        }),
        wtHistoryClose &&
            wtHistoryClose.addEventListener('click', () => {
                wtHistoryOverlay.style.display = 'none';
            }),
        wtHistoryOverlay.addEventListener('click', (event_103) => {
            event_103.target === wtHistoryOverlay && (wtHistoryOverlay.style.display = 'none');
        }));
    let isWtGenerating = false;
    window.tkTriggerWtApi = async function (event_104) {
        event_104 &&
            (event_104.stopPropagation(),
            event_104.type === 'touchend' && event_104.cancelable && event_104.preventDefault());
        console.log('[一起看] 触发 API 调用逻辑');
        if (isWtGenerating) {
            console.log('[一起看] 拦截: 正在生成中');
            if (window.showToast) window.showToast('对方正在回复中...');
            return;
        }
        let charId_8 = window.currentWtCharId;
        const wtBubbleEl = document.getElementById('tk-watch-together-bubble');
        !charId_8 &&
            wtBubbleEl &&
            wtBubbleEl.dataset.charId &&
            (charId_8 = wtBubbleEl.dataset.charId);
        !charId_8 && (charId_8 = currentChatCharId);
        (charId_8 === 'null' || charId_8 === 'undefined' || charId_8 === '') && (charId_8 = null);
        if (!charId_8) {
            console.warn('[一起看] 拦截: 找不到气泡或没有 charId (所有途径均为空)');
            if (window.showToast) window.showToast('无法获取互动对象ID，请退出重试！');
            return;
        }
        const char_12 = window.tkGetChar(charId_8);
        if (!char_12) {
            console.warn('[一起看] 拦截: 找不到对应的 char 对象, charId:', charId_8);
            if (window.showToast) window.showToast('找不到ID为 ' + charId_8 + ' 的角色数据！');
            return;
        }
        if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
            if (window.showToast) window.showToast('请在系统设置中配置 API');
            return;
        }
        console.log('[一起看] 准备调用 API, Char:', char_12.name);
        isWtGenerating = true;
        if (window.showToast) window.showToast('准备互动中...');
        let currentVideo = null;
        try {
            const tkFullscreenVideoViewElement = document.getElementById(
                'tk-fullscreen-video-view',
            );
            if (
                tkFullscreenVideoViewElement &&
                tkFullscreenVideoViewElement.classList.contains('active')
            ) {
                const vid = tkFullscreenVideoViewElement.dataset.videoId;
                if (vid && window.findVideoGlobal) {
                    const res = window.findVideoGlobal(vid);
                    currentVideo = res ? res.video : null;
                }
            } else {
                const feedContainer = document.getElementById('tk-feed-container');
                if (feedContainer && feedContainer.children.length > 0) {
                    const cards = Array.from(feedContainer.querySelectorAll('.tk-video-card'));
                    let closestCard = null,
                        value_125 = Infinity;
                    const boundingClientRect = feedContainer.getBoundingClientRect(),
                        containerCenter = boundingClientRect.top + boundingClientRect.height / 2;
                    cards.forEach((feedContainer_2) => {
                        const boundingClientRect_128 = feedContainer_2.getBoundingClientRect(),
                            cardCenter =
                                boundingClientRect_128.top + boundingClientRect_128.height / 2,
                            distance = Math.abs(containerCenter - cardCenter);
                        distance < value_125 &&
                            ((value_125 = distance), (closestCard = feedContainer_2));
                    });
                    if (closestCard && closestCard.dataset.videoId) {
                        const vid_2 = closestCard.dataset.videoId;
                        if (window.findVideoGlobal) {
                            const res_2 = window.findVideoGlobal(vid_2);
                            currentVideo = res_2 ? res_2.video : null;
                        }
                    }
                }
                !currentVideo &&
                    tkState &&
                    tkState.videos &&
                    tkState.videos.length > 0 &&
                    (currentVideo = tkState.videos[0]);
            }
        } catch (err) {
            console.warn('获取当前视频上下文失败', err);
        }
        let text_108 = '';
        currentVideo &&
            currentVideo.comments &&
            currentVideo.comments.length > 0 &&
            ((text_108 = `该视频的评论区热评：
`),
            currentVideo.comments.slice(0, 5).forEach((value_134) => {
                text_108 +=
                    '- ' +
                    value_134.authorName +
                    ': ' +
                    value_134.text +
                    `
`;
            }));
        let videoContext = currentVideo
                ? '当前我们在看一个视频。视频作者是：' +
                  (currentVideo.authorName || '未知') +
                  '。视频文案是：' +
                  (currentVideo.desc || '无') +
                  '。视频画面描述是：' +
                  (currentVideo.sceneText || '一段视频') +
                  `。
` +
                  text_108
                : '我们在浏览TikTok，但是当前没有特定的视频。',
            chatHistoryStr = `聊天记录:
`;
        wtChatHistory.slice(-10).forEach((value_135) => {
            chatHistoryStr +=
                '[' +
                (value_135.sender === 'user' ? '我(User)' : char_12.name) +
                ']: ' +
                value_135.text +
                `
`;
        });
        let worldBookContextText =
            videoContext +
            `
` +
            chatHistoryStr;
        const value_112 = window.imApp?.getWorldBookContextForFriendByPosition
                ? window.imApp.getWorldBookContextForFriendByPosition(
                      'system_depth',
                      char_12,
                      worldBookContextText,
                  )
                : window.getGlobalWorldBookContextByPosition
                  ? window.getGlobalWorldBookContextByPosition('system_depth')
                  : '',
            value_113 = window.imApp?.getWorldBookContextForFriendByPosition
                ? window.imApp.getWorldBookContextForFriendByPosition(
                      'before_role',
                      char_12,
                      worldBookContextText,
                  )
                : window.getGlobalWorldBookContextByPosition
                  ? window.getGlobalWorldBookContextByPosition('before_role')
                  : '',
            value_114 = window.imApp?.getWorldBookContextForFriendByPosition
                ? window.imApp.getWorldBookContextForFriendByPosition(
                      'after_role',
                      char_12,
                      worldBookContextText,
                  )
                : window.getGlobalWorldBookContextByPosition
                  ? window.getGlobalWorldBookContextByPosition('after_role')
                  : '',
            value_115 = window.tkBuildWorldBookContext
                ? window.tkBuildWorldBookContext(worldBookContextText)
                : '';
        let text_116 = '';
        char_12 &&
            char_12.memories &&
            char_12.memories.length > 0 &&
            ((text_116 += `角色记忆:
`),
            char_12.memories.forEach((value_136) => {
                text_116 +=
                    '- ' +
                    value_136.text +
                    `
`;
            }),
            (text_116 += `
`));
        let text_117 = '';
        window.userState &&
            window.userState.persona &&
            (text_117 =
                '我(User)的人设: ' +
                window.userState.persona +
                `
`);
        wtCharAvatar.style.opacity = '0.5';
        const id_2 = 'wt-typing-' + Date.now(),
            element_119 = document.createElement('div');
        element_119.id = id_2;
        element_119.style.display = 'flex';
        element_119.style.width = '100%';
        element_119.style.justifyContent = 'flex-start';
        const msgDiv_2 = document.createElement('div');
        msgDiv_2.style.background = '#e5e5ea';
        msgDiv_2.style.color = '#666';
        msgDiv_2.style.padding = '6px 10px';
        msgDiv_2.style.borderRadius = '12px 12px 12px 2px';
        msgDiv_2.style.fontSize = '12px';
        msgDiv_2.style.maxWidth = '85%';
        msgDiv_2.textContent = '正在回复中...';
        element_119.appendChild(msgDiv_2);
        wtChatContainer.appendChild(element_119);
        wtChatContainer.scrollTop = wtChatContainer.scrollHeight;
        const content_4 =
            `
` +
            (value_112
                ? `System Depth Rules (Highest Priority):
` +
                  value_112 +
                  `

`
                : '') +
            (value_113
                ? `Before Role Rules:
` +
                  value_113 +
                  `

`
                : '') +
            (value_115
                ? `TikTok Mounted World Book:
` +
                  value_115 +
                  `

`
                : '') +
            '你现在的身份是：' +
            char_12.name +
            `
你的人设是：` +
            char_12.persona +
            `
现在我们正在"一起看视频"的连麦状态。

` +
            text_116 +
            `
` +
            text_117 +
            `

` +
            videoContext +
            `

` +
            chatHistoryStr +
            `
` +
            (value_114
                ? `
After Role Rules:
` +
                  value_114 +
                  `
`
                : '') +
            `
要求：
1. 请读取已挂载的世界书，深度扮演 ` +
            char_12.name +
            ` 的身份人设与user开始沉浸式聊天。
2. 读取视频内容、文案、评论区以及我刚才的话（如果有），作出合理回应。可以吐槽视频、回复我的话、玩梗，或者分享你的感受。
3. 一句一发，将你想说的话拆分成 3 到 5 条简短的微信式气泡。
4. 绝对不要发 emoji，也绝对不要使用句号结尾，要有十足的"活人感"和"网感"。语言自然连贯。禁止扮演user的身份发抖音和评论，你只能是除了user以外的人。
5. 国际化翻译规则：回复可以使用符合角色国籍、人设和上下文的任意语言；如果 text 不是中文，必须填写 translationZh 作为自然中文翻译；如果 text 是中文，translationZh 必须是空字符串。
6. 必须返回严格的 JSON 数组格式（不要带有 markdown 代码块标记），格式如下：
[
  { "text": "气泡1", "translationZh": "" },
  { "text": "foreign-language bubble", "translationZh": "这条外语气泡的中文翻译" },
  { "text": "气泡3", "translationZh": "" }
]
`;
        try {
            const chatCompletionsEndpoint = window.u2Api.resolveChatCompletionsEndpoint(
                    window.apiConfig.endpoint,
                ),
                value_137 = await fetch(chatCompletionsEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + window.apiConfig.apiKey,
                    },
                    body: JSON.stringify({
                        model: window.apiConfig.model || 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a roleplay character JSON generator.',
                            },
                            {
                                role: 'user',
                                content: content_4,
                            },
                        ],
                        temperature: parseFloat(window.apiConfig.temperature) || 0.8,
                    }),
                });
            if (!value_137.ok)
                throw (
                    window.u2Api?.createHttpError?.(
                        value_137,
                        await window.u2Api?.readApiError?.(value_137),
                    ) ||
                    Object.assign(new Error('HTTP ' + value_137.status), {
                        status: value_137.status,
                    })
                );
            const value_138 = await value_137.json();
            let content_139 = value_138.choices[0].message.content;
            content_139 = content_139
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
            let parsedMsgs = [];
            try {
                const result_141 = JSON.parse(content_139);
                if (Array.isArray(result_141))
                    parsedMsgs = tkDmNormalizeGeneratedMessages(result_141);
                else {
                    if (result_141.text) parsedMsgs = tkDmNormalizeGeneratedMessages([result_141]);
                    else {
                        if (result_141.reply && Array.isArray(result_141.reply))
                            parsedMsgs = tkDmNormalizeGeneratedMessages(result_141.reply);
                        else {
                            if (result_141.messages && Array.isArray(result_141.messages))
                                parsedMsgs = tkDmNormalizeGeneratedMessages(result_141.messages);
                            else
                                typeof result_141 === 'object' &&
                                    (parsedMsgs = tkDmNormalizeGeneratedMessages(
                                        Object.values(result_141).filter(
                                            (value_142) =>
                                                typeof value_142 === 'string' ||
                                                (value_142 && typeof value_142 === 'object'),
                                        ),
                                    ));
                        }
                    }
                }
            } catch (parseErr) {
                console.warn('JSON Parse failed, falling back to split', parseErr);
                parsedMsgs = tkDmNormalizeGeneratedMessages(
                    content_139
                        .split(
                            `
`,
                        )
                        .map((value_144) => value_144.replace(/^[-*•\d.\[\]"'\s]+/, '').trim())
                        .filter((value_145) => value_145.length > 0),
                );
            }
            parsedMsgs.length === 0 &&
                (parsedMsgs = [
                    {
                        text: '(微笑)',
                        translationZh: '',
                    },
                ]);
            const elementById = document.getElementById(id_2);
            if (elementById) elementById.remove();
            let delay = 0;
            parsedMsgs.forEach((message_4) => {
                setTimeout(() => {
                    wtChatHistory.push({
                        sender: 'char',
                        text: message_4.text,
                        translationZh: message_4.translationZh,
                    });
                    appendWtMessage('char', message_4.text, message_4.translationZh);
                }, delay);
                delay += 1500 + Math.random() * 1000;
            });
        } catch (error_3) {
            console.error('WT Gen Error:', error_3);
            if (
                !window.u2Api?.isRequestError?.(error_3) ||
                !window.u2Api.reportError(error_3, {
                    operation: '互动回复生成',
                })
            ) {
                if (window.showToast) window.showToast('互动生成失败');
            }
            const elementById_148 = document.getElementById(id_2);
            if (elementById_148) elementById_148.remove();
        } finally {
            const avatarEl = document.getElementById('wt-char-avatar');
            if (avatarEl) avatarEl.style.opacity = '1';
            isWtGenerating = false;
        }
    };
    wtCharAvatar &&
        (wtCharAvatar.addEventListener('click', window.tkTriggerWtApi),
        wtCharAvatar.addEventListener('touchend', window.tkTriggerWtApi));
    const wtMagicBtn = document.getElementById('wt-magic-btn');
    wtMagicBtn &&
        (wtMagicBtn.addEventListener('click', window.tkTriggerWtApi),
        wtMagicBtn.addEventListener('touchend', window.tkTriggerWtApi));
    const wtMainContent = document.getElementById('wt-main-content'),
        wtExitMenu = document.getElementById('wt-exit-menu'),
        wtExitSummaryBtn = document.getElementById('wt-exit-summary-btn'),
        wtExitDirectBtn = document.getElementById('wt-exit-direct-btn');
    wtCloseBtn &&
        wtCloseBtn.addEventListener('click', () => {
            wtExitMenu.style.display === 'none'
                ? ((wtMainContent.style.display = 'none'),
                  (wtExitMenu.style.display = 'flex'),
                  (wtCloseBtn.className = 'fas fa-chevron-left'))
                : ((wtExitMenu.style.display = 'none'),
                  (wtMainContent.style.display = 'flex'),
                  (wtCloseBtn.className = 'fas fa-times'));
        });
    function endWatchTogether(charId_12) {
        if (!charId_12) return;
        let dm_3 = tkState.dms.find((value_152) => value_152.charId === charId_12);
        !dm_3 &&
            ((dm_3 = {
                charId: charId_12,
                messages: [],
            }),
            tkState.dms.push(dm_3));
        dm_3.messages.push({
            sender: 'system',
            text: '一起看视频已结束',
            timestamp: new Date().toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        });
        if (window.tkPersistState) window.tkPersistState();
        currentChatCharId === charId_12 &&
            chatView.classList.contains('active') &&
            renderMessages();
    }
    wtExitDirectBtn &&
        wtExitDirectBtn.addEventListener('click', () => {
            const charId_9 = wtBubble.dataset.charId || window.currentWtCharId;
            endWatchTogether(charId_9);
            wtBubble.style.display = 'none';
            wtBubble.dataset.charId = '';
            window.currentWtCharId = null;
            wtBubble.dataset.isHidden = 'true';
            wtChatHistory = [];
            wtExitMenu.style.display = 'none';
            wtMainContent.style.display = 'flex';
            wtCloseBtn.className = 'fas fa-times';
        });
    wtExitSummaryBtn &&
        wtExitSummaryBtn.addEventListener('click', async () => {
            const value_154 = wtBubble.dataset.charId || window.currentWtCharId,
                tkGetChar_155 = window.tkGetChar(value_154);
            if (!tkGetChar_155) return;
            wtLoadingOverlay.style.display = 'flex';
            try {
                await handleAction_6(tkGetChar_155);
            } finally {
                endWatchTogether(value_154);
                wtLoadingOverlay.style.display = 'none';
                wtBubble.style.display = 'none';
                wtBubble.dataset.charId = '';
                window.currentWtCharId = null;
                wtBubble.dataset.isHidden = 'true';
                wtChatHistory = [];
                wtExitMenu.style.display = 'none';
                wtMainContent.style.display = 'flex';
                wtCloseBtn.className = 'fas fa-times';
            }
        });
    async function handleAction_6(value_156) {
        if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
            window.showToast('请在系统设置中配置 API，无法保存总结');
            return;
        }
        if (wtChatHistory.length === 0) {
            window.showToast('暂无互动内容，已退出');
            return;
        }
        const now_2 = new Date(),
            value_158 =
                now_2.getFullYear() +
                '年' +
                (now_2.getMonth() + 1) +
                '月' +
                now_2.getDate() +
                '日 ' +
                now_2.getHours() +
                ':' +
                now_2.getMinutes().toString().padStart(2, '0');
        let text_159 = '';
        wtChatHistory.forEach((value_162) => {
            text_159 +=
                '[' +
                (value_162.sender === 'user' ? '我' : value_156.name) +
                ']: ' +
                value_162.text +
                `
`;
        });
        const value_160 = window.tkBuildWorldBookContext
                ? window.tkBuildWorldBookContext(text_159)
                : '',
            content_3 =
                `
请总结这段"一起看视频"的连麦过程。
记录时间：` +
                value_158 +
                `
聊天记录：
` +
                text_159 +
                `
` +
                (value_160
                    ? `
TikTok Mounted World Book:
` +
                      value_160 +
                      `
`
                    : '') +
                `

要求：
1. 提取真实的互动时间和内容。
2. 用精练、自然的第三人称日记视角来写（例如："2024年X月X日 XX:XX，我和某某一起连麦刷了会儿视频，聊了聊关于..."）。
3. 绝对不要胡编乱造没有发生过的事情，如果没有特定细节就一笔带过。真实的啥简化啥。
4. 返回严格的 JSON 格式，包含一个 summary 字段，不要有 markdown。格式：
{ "summary": "总结内容" }
`;
        try {
            const chatCompletionsEndpoint_163 = window.u2Api.resolveChatCompletionsEndpoint(
                    window.apiConfig.endpoint,
                ),
                value_164 = await fetch(chatCompletionsEndpoint_163, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + window.apiConfig.apiKey,
                    },
                    body: JSON.stringify({
                        model: window.apiConfig.model || 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are an accurate summarizer.',
                            },
                            {
                                role: 'user',
                                content: content_3,
                            },
                        ],
                        temperature: 0.3,
                    }),
                });
            if (!value_164.ok)
                throw (
                    window.u2Api?.createHttpError?.(
                        value_164,
                        await window.u2Api?.readApiError?.(value_164),
                    ) ||
                    Object.assign(new Error('HTTP ' + value_164.status), {
                        status: value_164.status,
                    })
                );
            const value_165 = await value_164.json();
            let content_166 = value_165.choices[0].message.content;
            content_166 = content_166
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
            const result_167 = JSON.parse(content_166);
            result_167.summary &&
                (window.autoSaveSummaryToWorldBook
                    ? window.autoSaveSummaryToWorldBook(
                          '和' + value_156.name + '的一起看记录 (' + value_158 + ')',
                          result_167.summary,
                      )
                    : window.showToast('总结完成，但未保存'));
        } catch (err_2) {
            console.error('Summary Error:', err_2);
            window.showToast('总结保存失败');
        }
    }
    tkSubProfileMsgBtn &&
        tkSubProfileMsgBtn.addEventListener('click', (e_3) => {
            e_3.stopPropagation();
            const charId_10 = window.currentTkSubProfileCharId;
            if (charId_10) {
                let dm_4 = tkState.dms.find((d_4) => d_4.charId === charId_10);
                if (!dm_4) {
                    dm_4 = {
                        charId: charId_10,
                        messages: [],
                    };
                    tkState.dms.push(dm_4);
                    if (window.tkPersistState) window.tkPersistState();
                    if (window.tkRenderChat) window.tkRenderChat();
                }
                window.tkOpenChatView(charId_10);
            }
        });
    window.tkOpenChatView = function (value_173) {
        const char_13 = window.tkGetChar(value_173);
        if (!char_13 || !chatView) return;
        currentChatCharId = value_173;
        chatTitle.textContent = char_13.name || char_13.handle;
        const headerAvatar = document.getElementById('tk-dm-chat-avatar'),
            headerAvatarIcon = document.getElementById('tk-dm-chat-avatar-icon'),
            src_3 = tkDmResolveAvatar(char_13);
        if (src_3) {
            headerAvatar && ((headerAvatar.src = src_3), (headerAvatar.style.display = 'block'));
            if (headerAvatarIcon) headerAvatarIcon.style.display = 'none';
        } else {
            if (headerAvatar) headerAvatar.style.display = 'none';
            if (headerAvatarIcon) headerAvatarIcon.style.display = 'block';
        }
        renderMessages();
        window.openView(chatView);
    };
    function renderMessages() {
        if (!messagesContainer || !currentChatCharId) return;
        messagesContainer.innerHTML = '';
        const char_14 = window.tkGetChar(currentChatCharId);
        if (char_14) {
            const intro = document.createElement('div');
            intro.innerHTML = tkDmProfileIntroHtml(char_14);
            messagesContainer.appendChild(intro.firstElementChild);
            messagesContainer
                .querySelector('#tk-dm-profile-home-btn')
                ?.addEventListener('click', () => {
                    const charId_11 = currentChatCharId;
                    window.closeView(chatView);
                    currentChatCharId = null;
                    setTimeout(() => {
                        if (window.tkOpenSubProfile) window.tkOpenSubProfile(charId_11);
                    }, 40);
                });
        }
        let dm_5 = tkState.dms.find((value_183) => value_183.charId === currentChatCharId);
        if (!dm_5 || dm_5.messages.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'tk-dm-empty-state';
            empty.textContent = '打个招呼吧';
            messagesContainer.appendChild(empty);
            return;
        }
        const tkDmResolveAvatar_178 = tkDmResolveAvatar(char_14);
        let lastSender = null,
            value_180 = null;
        dm_5.messages.forEach((msg, index_2) => {
            const isSelf_2 = msg.sender === 'user',
                timeStr =
                    msg.timestamp ||
                    new Date().toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                    });
            if (timeStr !== value_180) {
                const timeRow = document.createElement('div');
                timeRow.style.width = '100%';
                timeRow.style.display = 'flex';
                timeRow.style.justifyContent = 'center';
                timeRow.style.marginBottom = '5px';
                timeRow.style.marginTop = index_2 === 0 ? '2px' : '7px';
                timeRow.innerHTML =
                    '<span style="background: rgba(0,0,0,0.05); color: #999; font-size: 11px; padding: 2px 8px; border-radius: 8px;">' +
                    timeStr +
                    '</span>';
                messagesContainer.appendChild(timeRow);
                value_180 = timeStr;
                lastSender = null;
            }
            const hasNext =
                    index_2 < dm_5.messages.length - 1 &&
                    dm_5.messages[index_2 + 1].sender === msg.sender,
                isConsecutive = lastSender === msg.sender,
                marginBottom_2 = hasNext ? '1px' : '6px';
            lastSender = msg.sender;
            const row_3 = document.createElement('div');
            row_3.className = 'chat-row ' + (isConsecutive ? 'has-prev' : '');
            row_3.style.display = 'flex';
            row_3.style.width = '100%';
            row_3.style.marginBottom = marginBottom_2;
            let value_192 =
                    'background: ' +
                    (isSelf_2 ? '#111' : '#f0f0f0') +
                    '; color: ' +
                    (isSelf_2 ? '#fff' : '#111') +
                    '; padding: 6px 10px; font-size: 14px; max-width: 76%; line-height: 1.35; word-break: break-word; position: relative;',
                text_193 = '16px';
            value_192 += 'border-radius: ' + text_193 + ';';
            const cleanMessageText = tkDmEscapeHtml(msg.text || ''),
                cleanTranslation_2 = String(msg.translationZh || '').trim(),
                value_196 = cleanTranslation_2
                    ? '<div class="tk-dm-translation" style="display:' +
                      (msg.translationExpanded ? 'block' : 'none') +
                      ';">' +
                      tkDmEscapeHtml(cleanTranslation_2) +
                      '</div>'
                    : '';
            let value_197 = '' + cleanMessageText + value_196;
            if (msg.sender === 'system') {
                const sysRow = document.createElement('div');
                sysRow.style.width = '100%';
                sysRow.style.display = 'flex';
                sysRow.style.justifyContent = 'center';
                sysRow.style.marginBottom = '8px';
                sysRow.innerHTML =
                    `
                    <div style="background: rgba(0,0,0,0.05); color: #8e8e93; font-size: 12px; padding: 6px 12px; border-radius: 12px; font-weight: 500;">
                        ` +
                    msg.text +
                    `
                    </div>
                `;
                messagesContainer.appendChild(sysRow);
                return;
            }
            if (msg.sharedVideoId) {
                let value_200 = null;
                if (window.findVideoGlobal) {
                    const videoGlobal_201 = window.findVideoGlobal(msg.sharedVideoId);
                    if (videoGlobal_201) value_200 = videoGlobal_201.video;
                } else value_200 = tkState.videos.find((v) => v.id === msg.sharedVideoId);
                if (value_200) {
                    const value_203 = value_200.bgImage
                            ? "background: url('" + value_200.bgImage + "') center/cover no-repeat;"
                            : value_200.bgColor
                              ? 'background: ' + value_200.bgColor + ';'
                              : 'background: #ffffff;',
                        value_204 = value_200.bgImage
                            ? ''
                            : value_200.desc
                              ? `
                        <div style="background: #111111; color: #ffffff; padding: 12px 16px; border-radius: 16px; max-width: 85%; text-align: center; font-size: 12px; line-height: 1.4; word-break: break-word; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden;">
                            ` +
                                value_200.desc +
                                `
                        </div>
                    `
                              : '';
                    value_197 =
                        `
                        <div onclick="if(window.tkOpenFullscreenVideo){window.tkOpenFullscreenVideo('` +
                        value_200.id +
                        "');}else{if(window.showToast)window.showToast('组件未就绪');}\" style=\"width: 150px; height: 220px; border-radius: 16px; overflow: hidden; position: relative; cursor: pointer; " +
                        value_203 +
                        ` display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #f0f0f0;">
                            ` +
                        value_204 +
                        `
                            <div style="background: rgba(255,255,255,0.95); color: #111; padding: 8px 12px; font-size: 12px; font-weight: 500; width: 100%; position: absolute; bottom: 0; text-align: center; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-top: 1px solid #f0f0f0;">
                                @` +
                        (value_200.authorName || 'User') +
                        `
                            </div>
                        </div>
                    `;
                    value_192 = 'padding: 0; background: transparent; border-radius: 16px;';
                }
            }
            if (isSelf_2) {
                row_3.style.justifyContent = 'flex-end';
                row_3.style.alignItems = 'flex-end';
                row_3.innerHTML =
                    `
                    <div class="` +
                    (cleanTranslation_2 && !msg.sharedVideoId ? 'tk-dm-translatable-bubble' : '') +
                    '" style="' +
                    value_192 +
                    `">
                        ` +
                    value_197 +
                    `
                    </div>
                `;
            } else {
                let text_205 = '';
                !isConsecutive
                    ? (text_205 = tkDmResolveAvatar_178
                          ? '<img src="' +
                            tkDmResolveAvatar_178 +
                            '" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 6px; object-fit: cover; background: #f0f0f0; flex-shrink: 0; align-self: flex-end;">'
                          : '<div style="width: 30px; height: 30px; border-radius: 50%; background: #f0f0f0; display: flex; justify-content: center; align-items: center; margin-right: 6px; color: #999; flex-shrink: 0; align-self: flex-end;"><i class="fas fa-user"></i></div>')
                    : (text_205 =
                          '<div style="width: 30px; margin-right: 6px; flex-shrink: 0;"></div>');
                row_3.style.justifyContent = 'flex-start';
                row_3.style.alignItems = 'flex-end';
                row_3.innerHTML =
                    `
                    ` +
                    text_205 +
                    `
                    <div class="` +
                    (cleanTranslation_2 && !msg.sharedVideoId ? 'tk-dm-translatable-bubble' : '') +
                    '" style="' +
                    value_192 +
                    `">
                        ` +
                    value_197 +
                    `
                    </div>
                `;
            }
            messagesContainer.appendChild(row_3);
            const translatableBubble = row_3.querySelector('.tk-dm-translatable-bubble');
            translatableBubble &&
                translatableBubble.addEventListener('click', (event_5) => {
                    event_5.stopPropagation();
                    const translationEl = translatableBubble.querySelector('.tk-dm-translation');
                    if (!translationEl) return;
                    msg.translationExpanded = !msg.translationExpanded;
                    translationEl.style.display = msg.translationExpanded ? 'block' : 'none';
                    if (window.tkPersistState) window.tkPersistState();
                });
        });
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 50);
    }
    chatSendBtn &&
        chatInput &&
        (chatSendBtn.addEventListener('click', () => {
            if (!currentChatCharId) return;
            const text_4 = chatInput.value.trim();
            if (!text_4) return;
            let dm_6 = tkState.dms.find((value_209) => value_209.charId === currentChatCharId);
            !dm_6 &&
                ((dm_6 = {
                    charId: currentChatCharId,
                    messages: [],
                }),
                tkState.dms.push(dm_6));
            dm_6.messages.push({
                sender: 'user',
                text: text_4,
                timestamp: new Date().toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            });
            chatInput.value = '';
            if (window.tkPersistState) window.tkPersistState();
            renderMessages();
            if (window.tkRenderChat) window.tkRenderChat();
            chatSendBtn.style.display = 'none';
            if (chatMicBtn) chatMicBtn.style.display = 'block';
            const plusBtn = document.getElementById('tk-dm-plus-btn');
            if (plusBtn) plusBtn.style.display = 'block';
        }),
        window.mobileInputCompat?.register({
            input: chatInput,
            root: chatView,
            scrollContainer: messagesContainer,
            onSend: () => chatSendBtn.click(),
            allowEmpty: true,
        }),
        chatInput.addEventListener('input', () => {
            if (chatInput.value.trim().length > 0) {
                chatSendBtn.style.display = 'flex';
                if (chatMicBtn) chatMicBtn.style.display = 'none';
                document.getElementById('tk-dm-plus-btn').style.display = 'none';
            } else {
                chatSendBtn.style.display = 'none';
                if (chatMicBtn) chatMicBtn.style.display = 'block';
                document.getElementById('tk-dm-plus-btn').style.display = 'block';
            }
        }));
    let isChatGenerating = false;
    chatMicBtn &&
        chatMicBtn.addEventListener('click', async () => {
            if (!currentChatCharId) return;
            if (isChatGenerating) {
                if (window.showToast) window.showToast('对方正在输入中...');
                return;
            }
            if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
                if (window.showToast) window.showToast('请在系统设置中配置 API');
                return;
            }
            isChatGenerating = true;
            const tkGetChar_210 = window.tkGetChar(currentChatCharId);
            if (!tkGetChar_210) return;
            let dm_7 = tkState.dms.find((value_223) => value_223.charId === currentChatCharId);
            !dm_7 &&
                ((dm_7 = {
                    charId: currentChatCharId,
                    messages: [],
                }),
                tkState.dms.push(dm_7));
            window.showToast('对方正在输入...');
            const recentMsgs = dm_7.messages.slice(-15);
            let text_213 = `历史聊天记录:
`,
                text_214 = '';
            recentMsgs.forEach((msg_3) => {
                let text_225 = msg_3.text;
                if (msg_3.sharedVideoId) {
                    let value_226 = null;
                    if (window.findVideoGlobal) {
                        const videoGlobal_227 = window.findVideoGlobal(msg_3.sharedVideoId);
                        if (videoGlobal_227) value_226 = videoGlobal_227.video;
                    } else value_226 = tkState.videos.find((v_2) => v_2.id === msg_3.sharedVideoId);
                    value_226 &&
                        ((text_225 +=
                            ' (分享了视频：文案[' +
                            (value_226.desc || '无') +
                            '] 画面内容[' +
                            (value_226.sceneText || '无') +
                            '])'),
                        (text_214 =
                            `
请注意，User 刚刚分享了一个视频，视频文案是：` +
                            (value_226.desc || '无') +
                            '，视频内容是：' +
                            (value_226.sceneText || '无') +
                            '。请针对这个视频的内容、文案或者可能产生的评论进行互动和反馈。'));
                }
                text_213 +=
                    '[' +
                    (msg_3.sender === 'user' ? 'User' : 'Char') +
                    ']: ' +
                    text_225 +
                    `
`;
            });
            let worldBookContextText_2 = text_213,
                tkMountedWorldBookContext = '';
            const value_217 = window.imApp?.getWorldBookContextForFriendByPosition
                    ? window.imApp.getWorldBookContextForFriendByPosition(
                          'system_depth',
                          tkGetChar_210,
                          worldBookContextText_2,
                      )
                    : window.getGlobalWorldBookContextByPosition
                      ? window.getGlobalWorldBookContextByPosition('system_depth')
                      : '',
                value_218 = window.imApp?.getWorldBookContextForFriendByPosition
                    ? window.imApp.getWorldBookContextForFriendByPosition(
                          'before_role',
                          tkGetChar_210,
                          worldBookContextText_2,
                      )
                    : window.getGlobalWorldBookContextByPosition
                      ? window.getGlobalWorldBookContextByPosition('before_role')
                      : '',
                value_219 = window.imApp?.getWorldBookContextForFriendByPosition
                    ? window.imApp.getWorldBookContextForFriendByPosition(
                          'after_role',
                          tkGetChar_210,
                          worldBookContextText_2,
                      )
                    : window.getGlobalWorldBookContextByPosition
                      ? window.getGlobalWorldBookContextByPosition('after_role')
                      : '';
            tkMountedWorldBookContext = window.tkBuildWorldBookContext
                ? window.tkBuildWorldBookContext(worldBookContextText_2)
                : '';
            let text_220 = '';
            tkGetChar_210 &&
                tkGetChar_210.memories &&
                tkGetChar_210.memories.length > 0 &&
                ((text_220 += `角色记忆:
`),
                tkGetChar_210.memories.forEach((value_229) => {
                    text_220 +=
                        '- ' +
                        value_229.text +
                        `
`;
                }),
                (text_220 += `
`));
            let text_221 = '';
            window.userState &&
                window.userState.persona &&
                (text_221 =
                    'User的人设: ' +
                    window.userState.persona +
                    `
`);
            const content_5 =
                `
` +
                (value_217
                    ? `System Depth Rules (Highest Priority):
` +
                      value_217 +
                      `

`
                    : '') +
                (value_218
                    ? `Before Role Rules:
` +
                      value_218 +
                      `

`
                    : '') +
                (tkMountedWorldBookContext
                    ? `TikTok Mounted World Book:
` +
                      tkMountedWorldBookContext +
                      `

`
                    : '') +
                '你现在的身份是：' +
                tkGetChar_210.name +
                `
你的人设是：` +
                tkGetChar_210.persona +
                `
请扮演该角色，在 TikTok 的私信(DM)中与 User 开启沉浸式对话。` +
                text_214 +
                `

要求：
1. 一句一发，不要一大串。调用一次必须生成 3 到 6 条气泡回复。
2. 如果 User 分享了视频，请务必读取视频内容和文案进行针对性玩梗、感叹或讨论（视频的作者不一定是user，读取视频创作者名字）。
3. 这是一场真实的 TikTok 私信互动。如果对方人设是正常人，要有十足的"活人感"和短视频网感；如果对方人设是诈骗犯、推销员、杀猪盘或骚扰者，请淋漓尽致地展现他们的话术、生硬机翻或死缠烂打的套路。
4. 绝对不要发emoji，也绝对不要使用句号结尾，保持短平快的发送习惯。禁止扮演user的身份发抖音和评论，你只能是除了user以外的人。
5. 国际化翻译规则：回复可以使用符合角色国籍、人设和上下文的任意语言；如果 text 不是中文，必须填写 translationZh 作为自然中文翻译；如果 text 是中文，translationZh 必须是空字符串。
6. 必须返回严格的 JSON 数组格式（不要带有 markdown 代码块标记），格式如下：
[
  { "text": "第一条回复内容", "translationZh": "" },
  { "text": "foreign-language reply", "translationZh": "这条外语回复的中文翻译" },
  { "text": "第三条回复内容", "translationZh": "" }
]

` +
                text_220 +
                `
` +
                text_221 +
                `
` +
                text_213 +
                `
` +
                (value_219
                    ? `
After Role Rules:
` + value_219
                    : '') +
                `
`;
            try {
                const chatCompletionsEndpoint_230 = window.u2Api.resolveChatCompletionsEndpoint(
                        window.apiConfig.endpoint,
                    ),
                    value_231 = await fetch(chatCompletionsEndpoint_230, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + window.apiConfig.apiKey,
                        },
                        body: JSON.stringify({
                            model: window.apiConfig.model || 'gpt-3.5-turbo',
                            messages: [
                                {
                                    role: 'system',
                                    content: 'You are a roleplay character JSON generator.',
                                },
                                {
                                    role: 'user',
                                    content: content_5,
                                },
                            ],
                            temperature: parseFloat(window.apiConfig.temperature) || 0.8,
                        }),
                    });
                if (!value_231.ok)
                    throw (
                        window.u2Api?.createHttpError?.(
                            value_231,
                            await window.u2Api?.readApiError?.(value_231),
                        ) ||
                        Object.assign(new Error('HTTP ' + value_231.status), {
                            status: value_231.status,
                        })
                    );
                const value_232 = await value_231.json();
                let content_233 = value_232.choices[0].message.content;
                content_233 = content_233
                    .replace(/```json/g, '')
                    .replace(/```/g, '')
                    .trim();
                let items_234 = [];
                try {
                    const result_235 = JSON.parse(content_233);
                    if (Array.isArray(result_235))
                        items_234 = tkDmNormalizeGeneratedMessages(result_235);
                    else {
                        if (result_235.text)
                            items_234 = tkDmNormalizeGeneratedMessages([result_235]);
                        else {
                            if (result_235.reply && Array.isArray(result_235.reply))
                                items_234 = tkDmNormalizeGeneratedMessages(result_235.reply);
                            else {
                                if (result_235.messages && Array.isArray(result_235.messages))
                                    items_234 = tkDmNormalizeGeneratedMessages(result_235.messages);
                                else
                                    typeof result_235 === 'object' &&
                                        (items_234 = tkDmNormalizeGeneratedMessages(
                                            Object.values(result_235).filter(
                                                (value_236) =>
                                                    typeof value_236 === 'string' ||
                                                    (value_236 && typeof value_236 === 'object'),
                                            ),
                                        ));
                            }
                        }
                    }
                } catch (parseErr_2) {
                    console.warn('Chat JSON Parse failed, falling back to split', parseErr_2);
                    items_234 = tkDmNormalizeGeneratedMessages(
                        content_233
                            .split(
                                `
`,
                            )
                            .map((value_238) => value_238.replace(/^[-*•\d.\[\]"'\s]+/, '').trim())
                            .filter((value_239) => value_239.length > 0),
                    );
                }
                items_234.length === 0 &&
                    (items_234 = [
                        {
                            text: '(微笑)',
                            translationZh: '',
                        },
                    ]);
                let count = 0;
                items_234.forEach((message_5, value_241) => {
                    setTimeout(() => {
                        dm_7.messages.push({
                            sender: 'char',
                            text: message_5.text,
                            translationZh: message_5.translationZh,
                            timestamp: new Date().toLocaleTimeString('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        });
                        if (window.tkPersistState) window.tkPersistState();
                        currentChatCharId === tkGetChar_210.id && renderMessages();
                        if (window.tkRenderChat) window.tkRenderChat();
                    }, count);
                    count += 1500 + Math.random() * 1000;
                });
            } catch (error_4) {
                console.error('Chat Gen Error:', error_4);
                if (
                    !window.u2Api?.isRequestError?.(error_4) ||
                    !window.u2Api.reportError(error_4, {
                        operation: '聊天回复生成',
                    })
                ) {
                    if (window.showToast) window.showToast('生成回复失败');
                }
            } finally {
                isChatGenerating = false;
            }
        });
});
