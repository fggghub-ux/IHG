(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    const avatarImg = document.getElementById('tk-profile-avatar-img');
    const avatarIcon = document.getElementById('tk-profile-avatar-icon');
    const statusBubble = document.getElementById('tk-profile-status-bubble');
    const nameEl = document.getElementById('tk-profile-name');
    const handleEl = document.getElementById('tk-profile-handle');
    const bioEl = document.getElementById('tk-profile-bio');
    const statFollowing = document.getElementById('tk-stat-following');
    const statFollowers = document.getElementById('tk-stat-followers');
    const statLikes = document.getElementById('tk-stat-likes');
    const editBtn = document.getElementById('tk-profile-edit-btn');
    const visitorsBtn = document.getElementById('tk-profile-visitors-btn');
    const profileSettingsBtn = document.getElementById('tk-profile-settings-btn');
    const profileBackBtn = document.getElementById('tk-profile-back-btn');
    const tkEditProfileSheetElement = document.getElementById('tk-edit-profile-sheet');
    const saveProfileBtn = document.getElementById('tk-save-profile-btn');
    const tiktokViewElement = document.getElementById('tiktok-view');
    const editCharSheet = document.getElementById('tk-edit-char-sheet');
    const subProfileEditTrigger = document.getElementById('tk-sub-profile-edit-trigger');
    const tkEditNameElement = document.getElementById('tk-edit-name');
    const tkEditHandleElement = document.getElementById('tk-edit-handle');
    const tkEditBioElement = document.getElementById('tk-edit-bio');
    const tkEditPersonaElement = document.getElementById('tk-edit-persona');
    const tkEditFollowingElement = document.getElementById('tk-edit-following');
    const tkEditFollowersElement = document.getElementById('tk-edit-followers');
    const tkEditLikesElement = document.getElementById('tk-edit-likes');
    const avatarBtn = document.getElementById('tk-profile-avatar-btn');
    const avatarUpload = document.getElementById('tk-profile-avatar-upload');
    const subProfileView = document.getElementById('tk-sub-profile-view');
    const subProfileBackBtn = document.getElementById('tk-sub-profile-back-btn');
    const subProfileAvatarImg = document.getElementById('tk-sub-profile-avatar-img');
    const subProfileAvatarIcon = document.getElementById('tk-sub-profile-avatar-icon');
    const subProfileStatusBubble = document.getElementById('tk-sub-profile-status-bubble');
    const subProfileName = document.getElementById('tk-sub-profile-name');
    const subProfileHandle = document.getElementById('tk-sub-profile-handle');
    const subStatFollowing = document.getElementById('tk-sub-stat-following');
    const subStatFollowers = document.getElementById('tk-sub-stat-followers');
    const subStatLikes = document.getElementById('tk-sub-stat-likes');
    const subProfileBio = document.getElementById('tk-sub-profile-bio');
    const subProfileFollowBtn = document.getElementById('tk-sub-profile-follow-btn');
    const subProfileMsgBtn = document.getElementById('tk-sub-profile-msg-btn');
    const subProfileApiBtn = document.getElementById('tk-sub-profile-api-btn');
    const tkSubProfileGridElement = document.getElementById('tk-sub-profile-grid');
    let currentSubCharId = null;
    const _value = new Map();
    const _value2 = new WeakMap();
    let _value3 = 0;
    function tkProfileFormatCount(value_2) {
        return window.tkFormatCount ? window.tkFormatCount(value_2) : String(value_2 || 0);
    }
    function tkProfileResolveAvatar(char) {
        if (!char) return '';
        return window.tkResolveAvatar
            ? window.tkResolveAvatar(char.id, char.name || char.handle, char.avatar)
            : char.avatar || '';
    }
    function tkProfileEscape(value_3) {
        return String(value_3 ?? '').replace(
            /[&<>"']/g,
            (char_2) =>
                ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                })[char_2],
        );
    }
    function tkProfileToNumber(value_4) {
        const num = Number(value_4);
        return Number.isFinite(num) ? num : 0;
    }
    function handleAction_2(post) {
        const followerDelta_2 = Math.floor(Math.random() * 9) + 1,
            likeDelta_2 = Math.floor(Math.random() * 220) + 20;
        return (
            (tkState.profile.followers =
                tkProfileToNumber(tkState.profile.followers) + followerDelta_2),
            (tkState.profile.likes = tkProfileToNumber(tkState.profile.likes) + likeDelta_2),
            post && (post.likes = tkProfileToNumber(post.likes) + likeDelta_2),
            {
                followerDelta: followerDelta_2,
                likeDelta: likeDelta_2,
            }
        );
    }
    function tkProfileGetBoundWorldBookIds() {
        if (!tkState.settings || typeof tkState.settings !== 'object') tkState.settings = {};
        if (!Array.isArray(tkState.settings.boundWorldBookIds))
            tkState.settings.boundWorldBookIds = [];
        return tkState.settings.boundWorldBookIds;
    }
    function tkProfileBoundWorldBookLabel() {
        const ids = new Set(
            (window.getVisibleWorldBookMountIds?.(tkProfileGetBoundWorldBookIds()) || []).map(
                String,
            ),
        );
        if (!ids.size) return 'Not Mounted';
        const books = typeof window.getWorldBooks === 'function' ? window.getWorldBooks() : [];
        const names = (Array.isArray(books) ? books : [])
            .filter((book) => book && ids.has(String(book.id)))
            .map((book_2) => book_2.name || book_2.title || book_2.keyword || '世界书')
            .filter(Boolean);
        if (!names.length) return ids.size + ' 本';
        if (names.length <= 2) return names.join('、');
        return names.slice(0, 2).join('、') + ' 等 ' + names.length + ' 本';
    }
    function tkProfileUpdateSettingsSheet(sheet) {
        const label = sheet?.querySelector('#tk-bound-worldbook-label');
        if (label) label.textContent = tkProfileBoundWorldBookLabel();
    }
    function tkEnsureProfileSettingsSheet() {
        let sheet_2 = document.getElementById('tk-profile-settings-sheet');
        if (sheet_2) return sheet_2;
        sheet_2 = document.createElement('div');
        sheet_2.id = 'tk-profile-settings-sheet';
        sheet_2.className = 'bottom-sheet-overlay detail-sheet-overlay';
        sheet_2.innerHTML =
            '<div class="bottom-sheet tk-settings-sheet tk-settings-shop-sheet" role="dialog" aria-modal="true" aria-labelledby="tk-settings-title">\n <div class="sheet-handle" aria-hidden="true"></div><div class="sheet-title" id="tk-settings-title">TIKTOK SETTINGS</div>\n <div class="detail-sheet-content" style="padding:16px"><div class="settings-group fully-rounded" style="margin:0"><button type="button" class="settings-item tk-settings-row" id="tk-bind-worldbook-btn">\n                                <span class="settings-icon" style="background-color:#1c1c1e" aria-hidden="true"><i class="fas fa-book"></i></span>\n                                <span class="tk-settings-copy"><span class="tk-settings-row-title">挂载世界书</span></span><span id="tk-bound-worldbook-label" class="tk-settings-book-status">Not Mounted</span>\n                                <svg class="tk-settings-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>\n                            </button>\n<button type="button" class="settings-item tk-settings-row" data-tk-clear="videos">\n                                <span class="tk-settings-icon" aria-hidden="true"><svg viewBox="3 5 18 14"><rect x="3" y="5" width="12" height="14" rx="3"/><path d="m15 10 6-4v12l-6-4Z"/></svg></span>\n                                <span class="tk-settings-copy"><span class="tk-settings-row-title">清理全部视频</span><span class="tk-settings-description">推荐、关注和自己发布的视频</span></span>\n                                <svg class="tk-settings-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>\n                            </button>\n<button type="button" class="settings-item tk-settings-row" data-tk-clear="dms">\n                                <span class="tk-settings-icon" aria-hidden="true"><svg viewBox="3 3 18 18"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8A8.5 8.5 0 0 1 12.5 20a8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/></svg></span>\n                                <span class="tk-settings-copy"><span class="tk-settings-row-title">清理全部私信</span><span class="tk-settings-description">清空私信会话，保留角色联系人</span></span>\n                                <svg class="tk-settings-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>\n                            </button>\n<button type="button" class="settings-item tk-settings-row tk-settings-row-destructive" data-tk-clear="all">\n                                <span class="tk-settings-icon" aria-hidden="true"><i class="fas fa-trash-alt"></i></span>\n                                <span class="tk-settings-copy"><span class="tk-settings-row-title">清空 TikTok 所有数据</span><span class="tk-settings-description">重置 TikTok，不影响其他应用</span></span>\n                                <svg class="tk-settings-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>\n                            </button></div></div></div>';
        (document.getElementById('tiktok-view') || document.body).appendChild(sheet_2);
        sheet_2.addEventListener('click', (event) => {
                if (event.target === sheet_2) window.closeView(sheet_2);
            });
        sheet_2
            .querySelector('.tk-settings-close')
            ?.addEventListener('click', () => window.closeView(sheet_2));
        sheet_2.querySelectorAll('[data-tk-clear]').forEach((_value6) =>
            _value6.addEventListener('click', () => {
                const _value7 = _value6.dataset.tkClear;
                const _value8 = {
                    videos: [
                        '清理全部视频',
                        '将删除推荐、关注及自己发布的全部视频和相关视频互动记录，保留个人资料、角色与私信。此操作无法撤销。',
                    ],
                    dms: [
                        '清理全部私信',
                        '将删除 TikTok 的全部私信会话和聊天记录，保留角色联系人与视频。此操作无法撤销。',
                    ],
                    all: [
                        '清空 TK 所有数据',
                        '将重置 TikTok 的个人资料、角色、视频、私信、互动记录和设置，其他应用及 iMessage 角色数据不受影响。此操作无法撤销。',
                    ],
                };
                const [_value9, _value0] = _value8[_value7];
                const _value1 = async () => {
                    const _value11 = sheet_2.querySelectorAll('[data-tk-clear]');
                    _value11.forEach((_value12) => (_value12.disabled = true));
                    window.showToast?.('正在清理…');
                    try {
                        const _value13 = await window.tkClearData(_value7);
                        _value13 &&
                            (tkProfileUpdateSettingsSheet(sheet_2),
                            window.showToast?.(
                                _value7 === 'videos'
                                    ? '全部视频已清理'
                                    : _value7 === 'dms'
                                      ? '全部私信已清理'
                                      : 'TikTok 数据已清空',
                            ));
                    } catch (_value14) {
                        window.showToast?.(_value14.message || '清理失败，请重试');
                    } finally {
                        _value11.forEach((_value15) => (_value15.disabled = false));
                    }
                };
                const _value10 = window.imApp?.showCustomModal || window.showCustomModal;
                if (_value10)
                    _value10({
                        type: 'confirm',
                        title: _value9,
                        message: _value0,
                        confirmText: '清理',
                        isDestructive: true,
                        ownerId: 'tiktok-data-cleanup',
                        onConfirm: () => {
                            void _value1();
                        },
                    });
                else {
                    if (confirm(_value9 + '？\n' + _value0)) void _value1();
                }
            }),
        );
        sheet_2.querySelector('#tk-bind-worldbook-btn')?.addEventListener('click', () => {
                if (typeof window.renderWorldBookSelector !== 'function') {
                    if (window.showToast) window.showToast('世界书选择器不可用');
                    return;
                }
                window.renderWorldBookSelector(tkProfileGetBoundWorldBookIds(), (selectedIds) => {
                    tkState.settings = tkState.settings || {};
                    tkState.settings.boundWorldBookIds = Array.isArray(selectedIds)
                        ? selectedIds.filter(Boolean).map((id_3) => String(id_3))
                        : [];
                    if (window.tkPersistState) window.tkPersistState();
                    tkProfileUpdateSettingsSheet(sheet_2);
                    if (window.showToast) window.showToast('TikTok 世界书挂载已更新');
                });
            });
        return sheet_2;
    }
    function tkFormatVisitorTime(value_5) {
        const time = Number(value_5);
        if (!Number.isFinite(time) || time <= 0) return 'Just visited';
        return new Date(time).toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    function handleAction_3(rawText) {
        if (window.tkParseAiJson) return window.tkParseAiJson(rawText);
        const raw = String(rawText || '')
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();
        try {
            return JSON.parse(raw);
        } catch (error_2) {
            if (error_2?.name === 'AbortError') return;
            const start = Math.min(
                ...[raw.indexOf('{'), raw.indexOf('[')].filter((index) => index >= 0),
            );
            const end = Math.max(raw.lastIndexOf('}'), raw.lastIndexOf(']'));
            if (!Number.isFinite(start) || start < 0 || end <= start) throw error_2;
            return JSON.parse(raw.slice(start, end + 1).replace(/,\s*([}\]])/g, '$1'));
        }
    }
    function handleAction_4() {
        let sheet_3 = document.getElementById('tk-profile-visitors-sheet');
        if (sheet_3) return sheet_3;
        return (
            (sheet_3 = document.createElement('div')),
            (sheet_3.id = 'tk-profile-visitors-sheet'),
            (sheet_3.className = 'bottom-sheet-overlay'),
            (sheet_3.innerHTML = `
            <div class="bottom-sheet tk-visitors-sheet">
                <div class="sheet-handle"></div>
                <div class="sheet-title">PROFILE VISITORS</div>
                <div class="detail-sheet-content tk-visitors-list" id="tk-profile-visitors-list"></div>
            </div>
        `),
            (document.getElementById('tiktok-view') || document.body).appendChild(sheet_3),
            sheet_3.addEventListener('click', (event_30) => {
                if (event_30.target === sheet_3) window.closeView(sheet_3);
            }),
            sheet_3
        );
    }
    function handleAction_5() {
        let sheet_4 = document.getElementById('tk-profile-visitor-thought-sheet');
        if (sheet_4) return sheet_4;
        return (
            (sheet_4 = document.createElement('div')),
            (sheet_4.id = 'tk-profile-visitor-thought-sheet'),
            (sheet_4.className = 'bottom-sheet-overlay'),
            (sheet_4.innerHTML = `
            <div class="bottom-sheet tk-visitor-thought-sheet">
                <div class="sheet-handle"></div>
                <div class="tk-visitor-thought-header">
                    <div class="tk-visitor-avatar tk-visitor-thought-avatar" id="tk-visitor-thought-avatar"></div>
                    <div>
                        <div class="tk-visitor-name" id="tk-visitor-thought-name">Visitor</div>
                        <div class="tk-visitor-meta" id="tk-visitor-thought-handle">@visitor</div>
                        <div class="tk-visitor-meta tk-visitor-thought-time" id="tk-visitor-thought-time">Just visited</div>
                    </div>
                </div>
                <div class="tk-visitor-thought-text" id="tk-visitor-thought-text"></div>
            </div>
        `),
            (document.getElementById('tiktok-view') || document.body).appendChild(sheet_4),
            sheet_4.addEventListener('click', (event_31) => {
                if (event_31.target === sheet_4) window.closeView(sheet_4);
            }),
            sheet_4
        );
    }
    function tkOpenVisitorThought(visitor_2) {
        const sheet_5 = handleAction_5(),
            avatarEl = sheet_5.querySelector('#tk-visitor-thought-avatar'),
            nameEl_2 = sheet_5.querySelector('#tk-visitor-thought-name'),
            handleEl_2 = sheet_5.querySelector('#tk-visitor-thought-handle'),
            timeEl = sheet_5.querySelector('#tk-visitor-thought-time'),
            textEl = sheet_5.querySelector('#tk-visitor-thought-text'),
            value_33 = visitor_2.avatar || '';
        avatarEl.innerHTML = value_33
            ? "<img referrerpolicy=\"no-referrer\" src=\"" + tkProfileEscape(value_33) + '" alt="">'
            : '<i class="fas fa-user"></i>';
        nameEl_2.textContent = visitor_2.name || 'Visitor';
        handleEl_2.textContent = '@' + (visitor_2.handle || visitor_2.id || 'visitor');
        if (timeEl) timeEl.textContent = tkFormatVisitorTime(visitor_2.createdAt);
        textEl.textContent =
            visitor_2.thought || visitor_2.reason || '看完你的评论后，想来主页确认更多细节。';
        window.openView(sheet_5);
    }
    function handleAction_7() {
        const storedVisitors =
            tkState.profile && Array.isArray(tkState.profile.visitors)
                ? tkState.profile.visitors
                : [];
        return storedVisitors
            .filter((visitor) => visitor && visitor.name)
            .slice()
            .sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0))
            .slice(0, 30)
            .map((visitor_3) => ({
                ...visitor_3,
                avatar: window.tkResolveAvatar
                    ? window.tkResolveAvatar(visitor_3.id, visitor_3.name, visitor_3.avatar)
                    : visitor_3.avatar,
            }));
        const seen = new Set(),
            visitors_2 = [],
            addVisitor = (visitor_4) => {
                if (!visitor_4 || !visitor_4.name) return;
                const key = String(visitor_4.id || visitor_4.name);
                if (seen.has(key)) return;
                seen.add(key);
                visitors_2.push(visitor_4);
            };
        return (
            (tkState.videos || []).forEach((value_37) => {
                (value_37.comments || []).forEach((comment) => {
                    const id_4 = comment.authorId || 'visitor_' + comment.authorName;
                    addVisitor({
                        id: id_4,
                        name: comment.authorName,
                        handle: comment.authorName,
                        avatar: window.tkResolveAvatar
                            ? window.tkResolveAvatar(id_4, comment.authorName, comment.authorAvatar)
                            : comment.authorAvatar,
                        reason: '刚刚看过你的内容',
                    });
                });
            }),
            (tkState.dms || []).forEach((dm) => {
                const char_3 = window.tkGetChar(dm.charId);
                char_3 &&
                    addVisitor({
                        id: char_3.id,
                        name: char_3.name || char_3.handle,
                        handle: char_3.handle || char_3.id,
                        avatar: tkProfileResolveAvatar(char_3),
                        reason: '来自私信互动',
                    });
            }),
            (tkState.chars || [])
                .filter((char_4) => char_4.isFollowed)
                .forEach((char_5) => {
                    addVisitor({
                        id: char_5.id,
                        name: char_5.name || char_5.handle,
                        handle: char_5.handle || char_5.id,
                        avatar: tkProfileResolveAvatar(char_5),
                        reason: '关注了你的动态',
                    });
                }),
            visitors_2.slice(0, 20)
        );
    }
    window.tkOpenProfileVisitorsSheet = function () {
        const handleAction_4_44 = handleAction_4(),
            list = handleAction_4_44.querySelector('#tk-profile-visitors-list'),
            handleAction_7_45 = handleAction_7();
        !handleAction_7_45.length
            ? (list.innerHTML = '<div class="tk-visitors-empty">No Visitors</div>')
            : ((list.innerHTML = handleAction_7_45
                  .map(
                      (visitor_5) =>
                          `
                <div class="tk-visitor-item" data-id="` +
                          tkProfileEscape(visitor_5.id) +
                          '" data-name="' +
                          tkProfileEscape(visitor_5.name) +
                          '" data-handle="' +
                          tkProfileEscape(visitor_5.handle || visitor_5.id || 'user') +
                          '" data-avatar="' +
                          tkProfileEscape(visitor_5.avatar) +
                          '" data-thought="' +
                          tkProfileEscape(visitor_5.thought || visitor_5.reason || '') +
                          '" data-created-at="' +
                          tkProfileEscape(visitor_5.createdAt || '') +
                          `">
                    <div class="tk-visitor-avatar">` +
                          (visitor_5.avatar
                              ? "<img referrerpolicy=\"no-referrer\" src=\"" + tkProfileEscape(visitor_5.avatar) + '" alt="">'
                              : '<i class="fas fa-user"></i>') +
                          `</div>
                    <div class="tk-visitor-info">
                        <div class="tk-visitor-name">` +
                          tkProfileEscape(visitor_5.name || 'User') +
                          `</div>
                        <div class="tk-visitor-meta">@` +
                          tkProfileEscape(visitor_5.handle || visitor_5.id || 'user') +
                          ' · ' +
                          tkProfileEscape(visitor_5.reason || '访问了主页') +
                          `</div>
                    </div>
                    <button type="button" class="tk-visitor-delete-btn" title="删除访客"><i class="fas fa-chevron-right"></i></button>
                </div>
            `,
                  )
                  .join('')),
              list.querySelectorAll('.tk-visitor-item').forEach((item) => {
                  item.addEventListener('click', (event_2) => {
                      if (event_2.target.closest('.tk-visitor-avatar')) return;
                      if (event_2.target.closest('.tk-visitor-delete-btn')) return;
                      tkOpenVisitorThought({
                          id: item.dataset.id || '',
                          name: item.dataset.name || 'Visitor',
                          handle: item.dataset.handle || '',
                          avatar: item.dataset.avatar || '',
                          thought: item.dataset.thought || '',
                          createdAt: item.dataset.createdAt || '',
                      });
                      return;
                      const id_5 = item.dataset.id || 'visitor_' + Date.now(),
                          name_4 = item.dataset.name || 'User',
                          avatar_2 = item.dataset.avatar || '';
                      !window.tkGetChar(id_5) &&
                          window.tkSaveChar({
                              id: id_5,
                              name: name_4,
                              handle: name_4.toLowerCase().replace(/\s+/g, '') || id_5,
                              avatar: avatar_2,
                              status: '',
                              persona: '访问过主页的 ' + name_4,
                              isFollowed: false,
                          });
                      window.closeView(handleAction_4_44);
                      if (window.tkOpenSubProfile) window.tkOpenSubProfile(id_5);
                  });
                  const avatarBtn_2 = item.querySelector('.tk-visitor-avatar');
                  avatarBtn_2 &&
                      avatarBtn_2.addEventListener('click', (event_51) => {
                          event_51.stopPropagation();
                          const id_6 = item.dataset.id || 'visitor_' + Date.now(),
                              name_2 = item.dataset.name || 'User',
                              avatar_3 = item.dataset.avatar || '',
                              handle_2 =
                                  item.dataset.handle ||
                                  name_2.toLowerCase().replace(/\s+/g, '') ||
                                  id_6;
                          !window.tkGetChar(id_6) &&
                              window.tkSaveChar({
                                  id: id_6,
                                  name: name_2,
                                  handle: handle_2,
                                  avatar: avatar_3,
                                  status: '',
                                  persona: '访问过主页的 ' + name_2,
                                  isFollowed: false,
                              });
                          window.closeView(handleAction_4_44);
                          if (window.tkOpenSubProfile) window.tkOpenSubProfile(id_6);
                      });
                  const deleteBtn = item.querySelector('.tk-visitor-delete-btn');
                  deleteBtn &&
                      deleteBtn.addEventListener('click', (event_56) => {
                          event_56.stopPropagation();
                          const id_7 = item.dataset.id || '',
                              handle_3 = item.dataset.handle || '',
                              name_3 = item.dataset.name || '';
                          tkState.profile &&
                              Array.isArray(tkState.profile.visitors) &&
                              (tkState.profile.visitors = tkState.profile.visitors.filter(
                                  (visitor_6) => {
                                      return (
                                          String(visitor_6.id || '') !== String(id_7) &&
                                          String(visitor_6.handle || '') !== String(handle_3) &&
                                          String(visitor_6.name || '') !== String(name_3)
                                      );
                                  },
                              ));
                          if (window.tkPersistState) window.tkPersistState();
                          window.tkOpenProfileVisitorsSheet();
                      });
              }));
        window.openView(handleAction_4_44);
    };
    subProfileBackBtn &&
        subProfileView &&
        subProfileBackBtn.addEventListener('click', () => {
            window.closeView(subProfileView);
            currentSubCharId = null;
            window.currentTkSubProfileCharId = null;
        });
    subProfileView?.addEventListener('u2:view-closing', () => {
        const _value16 = document.getElementById('tk-search-generate-sheet');
        if (_value16?.dataset.tkCharId != null) window.closeView(_value16);
    });
    subProfileEditTrigger?.addEventListener('click', () => {
        if (currentSubCharId) window.tkOpenEditChar?.(currentSubCharId);
    });
    function handleAction_8(value_63) {
        if (!subProfileFollowBtn || !value_63) return;
        if (value_63.isFollowed && value_63.isFollower) {
            subProfileFollowBtn.textContent = 'Following';
            subProfileFollowBtn.className = 'tk-btn-secondary';
        } else {
            if (value_63.isFollowed) {
                subProfileFollowBtn.textContent = 'Following';
                subProfileFollowBtn.className = 'tk-btn-secondary';
            } else
                value_63.isFollower
                    ? ((subProfileFollowBtn.textContent = 'Follow'),
                      (subProfileFollowBtn.className = 'tk-btn-primary'))
                    : ((subProfileFollowBtn.textContent = 'Follow'),
                      (subProfileFollowBtn.className = 'tk-btn-primary'));
        }
    }
    function _value4() {
        const _value17 = window.tkGetChar(currentSubCharId);
        const _value18 =
            subProfileView.querySelector('.tk-ptab.active')?.dataset.target || 'videos';
        const _value19 =
            _value18 === 'liked' ? new Set((_value17?.likedVideoIds || []).map(String)) : null;
        const _value20 = _value17
            ? tkState.videos.filter((_value21) =>
                  _value19
                      ? _value19.has(String(_value21.id))
                      : String(_value21.authorId) === String(_value17.id),
              )
            : [];
        renderGrid(
            _value18,
            tkSubProfileGridElement,
            _value18 === 'videos' ? _value20 : [],
            _value18 === 'liked' ? _value20 : [],
        );
    }
    window.tkOpenSubProfile = function (currentTkSubProfileCharId_2) {
        const char_6 = window.tkGetChar(currentTkSubProfileCharId_2);
        if (!char_6 || !subProfileView) return;
        if (String(currentSubCharId) !== String(currentTkSubProfileCharId_2)) {
            const _value22 = document.getElementById('tk-search-generate-sheet');
            if (_value22?.dataset.tkCharId != null) window.closeView(_value22);
            subProfileView.querySelector('.tk-profile-scrollable').scrollTop = 0;
        }
        currentSubCharId = currentTkSubProfileCharId_2;
        window.currentTkSubProfileCharId = currentTkSubProfileCharId_2;
        _value5();
        subProfileName.textContent = char_6.name || 'User';
        subProfileHandle.textContent = '@' + (char_6.handle || currentTkSubProfileCharId_2);
        subProfileBio.textContent = char_6.bio || 'No introduction yet';
        char_6.status
            ? ((subProfileStatusBubble.style.display = 'block'),
              (subProfileStatusBubble.textContent = char_6.status))
            : (subProfileStatusBubble.style.display = 'none');
        subStatFollowing.textContent = tkProfileFormatCount(char_6.following || 0);
        subStatFollowers.textContent = tkProfileFormatCount(char_6.followers || 0);
        subStatLikes.textContent = tkProfileFormatCount(char_6.likes || 0);
        const src_4 = tkProfileResolveAvatar(char_6);
        if (src_4) {
            if (subProfileAvatarImg.getAttribute('src') !== src_4) subProfileAvatarImg.src = src_4;
            subProfileAvatarImg.style.display = 'block';
            subProfileAvatarIcon.style.display = 'none';
        } else {
            subProfileAvatarImg.src = '';
            subProfileAvatarImg.style.display = 'none';
            subProfileAvatarIcon.style.display = 'block';
        }
        handleAction_8(char_6);
        _value4();
        subProfileView.classList.add('active');
    };
    subProfileFollowBtn &&
        subProfileFollowBtn.addEventListener('click', () => {
            if (!currentSubCharId) return;
            const _value23 = window.tkGetChar(currentSubCharId);
            if (_value23) {
                _value23.isFollowed = !_value23.isFollowed;
                if (window.tkPersistState) window.tkPersistState();
                handleAction_8(_value23);
                _value23.isFollowed ? window.showToast('Following') : window.showToast('Unfollowed');
                if (window.tkRenderHome) window.tkRenderHome();
                if (window.tkRenderChat) window.tkRenderChat();
            }
        });
    function _value5() {
        if (!subProfileApiBtn) return;
        const _value24 = _value.has(String(currentSubCharId));
        subProfileApiBtn.disabled = _value24;
        subProfileApiBtn.setAttribute('aria-busy', String(_value24));
        subProfileApiBtn.title = _value24 ? '正在生成主页内容' : '生成主页内容';
    }
    subProfileApiBtn &&
        ((subProfileApiBtn.innerHTML = '<i class="fas fa-search" style="color: #fff;"></i>'),
        (subProfileApiBtn.title = '生成主页内容'),
        subProfileApiBtn.addEventListener('click', (_value25) => {
            if (!currentSubCharId) return;
            const _value26 = currentSubCharId;
            const _value27 = window.tkGetChar(_value26);
            if (!_value27 || _value.has(String(_value26))) return;
            const _value28 =
                subProfileView.querySelector('.tk-ptab.active')?.dataset.target || 'videos';
            window.tkOpenSearchGenerateSheet(_value25, {
                charId: _value26,
                title: _value28 === 'liked' ? '生成角色喜欢的视频' : '生成角色作品',
                placeholder: '想生成什么内容？留空按角色设定生成',
                isCurrent: () =>
                    window.tkGetChar(_value26) === _value27 &&
                    String(currentSubCharId) === String(_value26) &&
                    subProfileView.classList.contains('active'),
                onGenerate: (_value29, _value30) =>
                    window.tkGenerateCharVideos(_value26, {
                        query: _value29,
                        count: _value30,
                        target: _value28,
                    }),
            });
        }));
    window.tkGenerateCharVideos = async function (_value31, _value32 = {}, _value33) {
        typeof _value32 === 'function' && ((_value33 = _value32), (_value32 = {}));
        const char_8 = window.tkGetChar(_value31);
        if (!char_8) return false;
        const _value34 = String(_value31);
        if (_value.has(_value34)) return false;
        if (!window.apiConfig?.endpoint || !window.apiConfig?.apiKey) {
            window.showToast('请在系统设置中配置 API');
            return false;
        }
        const _value35 = String(_value32.query || '').trim();
        const _value36 = Math.min(10, Math.max(1, Number.parseInt(_value32.count, 10) || 3));
        const _value37 = _value32.target === 'liked' ? 'likedVideos' : 'posts';
        const _value38 = {};
        const _value39 = window.tkCaptureDataGuard('videos');
        const _value40 = () => _value39() && window.tkGetChar(_value31) === char_8;
        _value.set(_value34, _value38);
        _value5();
        try {
            const _value41 = [char_8.name, char_8.handle, char_8.persona, char_8.bio, _value35]
                .filter(Boolean)
                .join(' ');
            let text_76 = window.tkBuildWorldBookContext?.(_value41) || '';
            if (!window.tkBuildWorldBookContext) {
                const _value47 = [
                    ...(window.getWorldBooks?.() || []),
                    ...(window.getBuiltinWorldBooks?.() || []),
                ];
                text_76 = _value47
                    .filter((value_71) => value_71?.isGlobal)
                    .flatMap((_value48) =>
                        (_value48.entries || [])
                            .filter((_value49) => _value49.enabled !== false)
                            .map(
                                (value_91) =>
                                    '- ' +
                                    (value_91.keyword || '') +
                                    ': ' +
                                    (value_91.content || ''),
                            ),
                    )
                    .join('\n');
            }
            const _value42 = (Array.isArray(char_8.memories) ? char_8.memories : [])
                .map((_value50) => _value50?.text || _value50)
                .filter(Boolean);
            const _value43 =
                window.tkBuildWorldActorPrompt?.({
                    includeUserIdentity: false,
                    purpose: '角色 TikTok 主页视频与评论区生成',
                    triggerText: _value41,
                }) || '你可以扮演世界观中的非 user 角色、路人和创作者，禁止扮演 user。';
            const content_2 =
                '\nYou are generating a TikTok character profile. Return strict valid JSON only.\nYou may write as any non-user account/person inside this world view. Do not impersonate user.\n\n' +
                _value43 +
                '\n\nCharacter:\n' +
                JSON.stringify(
                    {
                        id: _value31,
                        name: char_8.name || 'User',
                        handle: char_8.handle || _value31,
                        persona: char_8.persona || '',
                        bio: char_8.bio || '',
                        status: char_8.status || '',
                    },
                    null,
                    2,
                ) +
                '\n\nWorld book context:\n' +
                (text_76 || 'No extra world book context.') +
                '\nCharacter memories:\n' +
                (_value42.join('\n') || 'No extra memories.') +
                '\n\n用户指定的生成内容：' +
                (_value35 || '未指定，请根据角色设定随机生成具体、有生活感的内容。') +
                '\n本次生成目标：' +
                (_value37 === 'posts'
                    ? '该角色自己发布的作品'
                    : '该角色喜欢的、由其他创作者发布的视频') +
                '。\n生成数量：恰好 ' +
                _value36 +
                ' 条。只生成本次目标，不额外生成其他页的内容。\n\nHard requirements:\n1. Return one JSON object only. No markdown, comments, prose, or trailing commas.\n2. Include "profileStats" with numeric "following", "followers", and "likes".\n3. "' +
                _value37 +
                '" must contain exactly ' +
                _value36 +
                ' complete items. "' +
                (_value37 === 'posts' ? 'likedVideos' : 'posts') +
                '" must be an empty array.\n4. Every post and likedVideo must include "mediaType" ("video" or "image"), "desc", "imagePrompt", "opening", "middle", "ending", "likes", "shares", and "comments".\n5. Even when mediaType is "video", provide imagePrompt as a realistic cover frame description. If no real image URL exists, leave "cover", "bgImage", and "imageUrl" empty.\n6. opening, middle, and ending are each 30-50 characters. Use immersive third-person descriptions of the environment, action, and dialogue, in a language fitting the character and world.\n7. Every video in posts and likedVideos must contain at least 10 top-level comments. Each comment must include authorName, authorAvatar, text, likes, and replies. replies is always an array and may be empty or contain natural nested replies when appropriate.\n8. Match the user\'s requested content, character persona, and world book. Captions should feel like real TikTok posts. 禁止扮演user的身份发抖音和评论。\n9. If this character appears in comments or replies, use Character.id as authorId and Character.name as authorName. For likedVideos, include the other creator\'s authorName, authorId (if known), and authorAvatar.\n10. If opening/middle/ending is not Chinese, fill the matching openingTranslationZh/middleTranslationZh/endingTranslationZh with a natural Chinese translation. If a comment or reply is not Chinese, fill translationZh. For Chinese originals, leave the matching translation fields empty.\n\nJSON shape (repeat complete video objects to meet the requested count):\n{"profileStats":{"following":120,"followers":3400,"likes":28000},"posts":[],"likedVideos":[]}\nEach video object uses:\n{"mediaType":"video","desc":"caption with tags","imagePrompt":"realistic cover frame","opening":"opening scene","openingTranslationZh":"","middle":"middle scene","middleTranslationZh":"","ending":"ending scene","endingTranslationZh":"","likes":1234,"shares":23,"comments":[{"authorId":"commenter-id","authorName":"commenter","authorAvatar":"","text":"comment text","translationZh":"","likes":12,"replies":[]}]}\n';
            window.showToast(
                '正在生成 ' +
                    _value36 +
                    ' 条角色' +
                    (_value37 === 'posts' ? '作品' : '喜欢的视频') +
                    '…',
            );
            const endpoint_2 = window.u2Api.resolveChatCompletionsEndpoint(
                window.apiConfig.endpoint,
            );
            const value_92 = await window.tkFetch('videos', endpoint_2, {
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
                                'Return strict valid JSON only. Use double-quoted keys and strings. No markdown, comments, prose, or trailing commas.',
                        },
                        {
                            role: 'user',
                            content: content_2,
                        },
                    ],
                    temperature: parseFloat(window.apiConfig.temperature) || 0.8,
                }),
            });
            if (!value_92.ok)
                throw (
                    window.u2Api?.createHttpError?.(
                        value_92,
                        await window.u2Api?.readApiError?.(value_92),
                    ) ||
                    Object.assign(new Error('HTTP ' + value_92.status), {
                        status: value_92.status,
                    })
                );
            const data = await value_92.json();
            if (!_value40()) return false;
            const parsedData = handleAction_3(data.choices?.[0]?.message?.content || '');
            const _value44 = Array.isArray(parsedData?.[_value37])
                ? parsedData[_value37].slice(0, _value36)
                : [];
            if (_value44.length !== _value36)
                throw new Error('返回的视频数量不足，需要 ' + _value36 + ' 条，请重试');
            if (
                _value44.some(
                    (_value51) =>
                        !_value51 ||
                        typeof _value51 !== 'object' ||
                        !(_value51.desc || _value51.sceneText || _value51.opening),
                )
            )
                throw new Error('返回的视频内容不完整，请重试');
            const _value45 = tkProfileResolveAvatar(char_8) || null;
            const _value46 = _value44.map((_value52) => {
                const _value53 = 'v_char_' + Date.now() + '_' + ++_value3;
                return window.tkNormalizeVideoPayload(
                    _value52,
                    _value37 === 'posts'
                        ? {
                              id: _value53,
                              authorId: _value31,
                              authorName: char_8.name,
                              authorAvatar: _value45,
                              isLiked: false,
                          }
                        : {
                              id: _value53,
                              authorId:
                                  _value52.authorId || _value52.handle || 'creator_' + _value53,
                              isLiked: false,
                          },
                );
            });
            tkState.videos.unshift(..._value46);
            _value37 === 'likedVideos' &&
                (char_8.likedVideoIds = [
                    ...new Set([
                        ...(char_8.likedVideoIds || []),
                        ..._value46.map((_value54) => _value54.id),
                    ]),
                ]);
            parsedData.profileStats &&
                typeof parsedData.profileStats === 'object' &&
                ['following', 'followers', 'likes'].forEach((_value55) => {
                    const _value56 = Number(parsedData.profileStats[_value55]);
                    if (Number.isFinite(_value56) && _value56 >= 0) char_8[_value55] = _value56;
                });
            window.tkPersistState?.({
                dirtyTabs: ['tk-home-tab', 'tk-profile-tab'],
            });
            window.tkRenderHome?.();
            String(currentSubCharId) === String(_value31) &&
                subProfileView.classList.contains('active') &&
                window.tkOpenSubProfile(_value31);
            window.showToast('已生成 ' + _value46.length + ' 条视频');
            _value33?.();
            return true;
        } catch (error_3) {
            if (error_3?.name === 'AbortError' || !_value40()) return false;
            console.error('Char Profile Gen Error:', error_3);
            (!window.u2Api?.isRequestError?.(error_3) ||
                !window.u2Api.reportError(error_3, {
                    operation: '角色主页内容生成',
                })) &&
                window.showToast(error_3.message || '生成失败，请检查 API 配置');
            return false;
        } finally {
            if (_value.get(_value34) === _value38) _value['delete'](_value34);
            _value5();
        }
    };
    window.tkRenderProfile = function () {
        const p = tkState.profile;
        if (nameEl) nameEl.textContent = p.name || 'User';
        if (handleEl) handleEl.textContent = '@' + (p.handle || 'user');
        if (bioEl) bioEl.textContent = p.bio || 'Add bio';
        if (p.status)
            statusBubble &&
                ((statusBubble.style.display = 'block'), (statusBubble.textContent = p.status));
        else {
            if (statusBubble) statusBubble.style.display = 'none';
        }
        statFollowing.textContent = tkProfileFormatCount(p.following || 0);
        statFollowers.textContent = tkProfileFormatCount(p.followers || 0);
        statLikes.textContent = tkProfileFormatCount(p.likes || 0);
        const src_2 = window.tkResolveAvatar
            ? window.tkResolveAvatar('profile', p.name || p.handle || 'User', p.avatar)
            : p.avatar;
        src_2
            ? ((avatarImg.src = src_2),
              (avatarImg.style.display = 'block'),
              (avatarIcon.style.display = 'none'))
            : ((avatarImg.src = ''),
              (avatarImg.style.display = 'none'),
              (avatarIcon.style.display = 'block'));
        const activeTab_2 = document.querySelector('#tk-profile-tab .tk-ptab.active'),
            target_2 = activeTab_2 ? activeTab_2.getAttribute('data-target') : 'videos';
        renderGrid(
            target_2,
            document.getElementById('tk-profile-grid'),
            tkState.profile.posts || [],
            tkState.videos.filter((v_4) => v_4.isLiked),
        );
        document.getElementById('tk-profile-tab').dataset.tkRendered = 'true';
    };
    statusBubble &&
        statusBubble.addEventListener('click', (event_105) => {
            event_105.stopPropagation();
            if (window.showCustomModal)
                window.showCustomModal({
                    title: 'STATUS',
                    type: 'prompt',
                    placeholder: 'Enter Your Current Status',
                    defaultValue: tkState.profile.status,
                    onConfirm: (val) => {
                        tkState.profile.status = val;
                        if (window.tkPersistState) window.tkPersistState();
                        window.tkRenderProfile();
                        if (window.tkRenderChat) window.tkRenderChat();
                    },
                });
            else {
                const status_2 = prompt('Enter Your Current Status:', tkState.profile.status);
                if (status_2 !== null) {
                    tkState.profile.status = status_2;
                    if (window.tkPersistState) window.tkPersistState();
                    window.tkRenderProfile();
                }
            }
        });
    avatarBtn &&
        avatarUpload &&
        (avatarBtn.addEventListener('click', (event_107) => {
            if (event_107.target === statusBubble || event_107.target.closest('.tk-avatar-plus')) {
                event_107.target.closest('.tk-avatar-plus') && avatarUpload.click();
                return;
            }
            avatarUpload.click();
        }),
        avatarUpload.addEventListener('change', (event_108) => {
            const value_109 = event_108.target.files[0];
            if (value_109) {
                const value_110 = new FileReader();
                value_110.onload = (event_3) => {
                    tkState.profile.avatar = event_3.target.result;
                    window.userState && (window.userState.avatarUrl = event_3.target.result);
                    if (window.tkPersistState) window.tkPersistState();
                    window.tkRenderProfile();
                    if (window.tkRenderChat) window.tkRenderChat();
                    window.showToast('Updated');
                };
                value_110.readAsDataURL(value_109);
            }
            event_108.target.value = '';
        }));
    profileBackBtn &&
        profileBackBtn.addEventListener('click', () => {
            tiktokViewElement && window.closeView(tiktokViewElement);
        });
    !window.tkProfileDelegationBound &&
        ((window.tkProfileDelegationBound = true),
        document.addEventListener('click', (e_2) => {
            const sheets = ['tk-edit-profile-sheet', 'tk-upload-video-sheet', 'tk-edit-char-sheet'];
            sheets.forEach((id_9) => {
                const sheet_6 = document.getElementById(id_9);
                sheet_6 &&
                    sheet_6.classList.contains('active') &&
                    e_2.target === sheet_6 &&
                    window.closeView(sheet_6);
            });
            if (e_2.target.closest('#tk-profile-edit-btn'))
                try {
                    const p_2 = tkState.profile;
                    const tkEditNameElement_116 = document.getElementById('tk-edit-name');
                    if (tkEditNameElement_116) tkEditNameElement_116.value = p_2.name || '';
                    const elHandle = document.getElementById('tk-edit-handle');
                    if (elHandle) elHandle.value = p_2.handle || '';
                    const tkEditBioElement_118 = document.getElementById('tk-edit-bio');
                    if (tkEditBioElement_118) tkEditBioElement_118.value = p_2.bio || '';
                    const tkEditPersonaElement_119 = document.getElementById('tk-edit-persona');
                    if (tkEditPersonaElement_119)
                        tkEditPersonaElement_119.value = p_2.persona || '';
                    const tkEditFollowingElement_120 = document.getElementById('tk-edit-following');
                    if (tkEditFollowingElement_120)
                        tkEditFollowingElement_120.value = p_2.following || 0;
                    const tkEditFollowersElement_121 = document.getElementById('tk-edit-followers');
                    if (tkEditFollowersElement_121)
                        tkEditFollowersElement_121.value = p_2.followers || 0;
                    const tkEditLikesElement_122 = document.getElementById('tk-edit-likes');
                    if (tkEditLikesElement_122) tkEditLikesElement_122.value = p_2.likes || 0;
                    const editCharSheet_2 = document.getElementById('tk-edit-profile-sheet');
                    if (editCharSheet_2) window.openView(editCharSheet_2);
                    else {
                        if (window.showToast) window.showToast('无法找到编辑面板容器');
                    }
                } catch (err) {
                    console.error('打开编辑资料报错:', err);
                    if (window.showToast) window.showToast('打开编辑失败:' + err.message);
                }
            if (e_2.target.closest('#tk-save-profile-btn')) {
                const elName = document.getElementById('tk-edit-name');
                const elHandle_2 = document.getElementById('tk-edit-handle');
                const elBio = document.getElementById('tk-edit-bio');
                const elPersona = document.getElementById('tk-edit-persona');
                const elFollowing = document.getElementById('tk-edit-following');
                const elFollowers = document.getElementById('tk-edit-followers');
                const elLikes = document.getElementById('tk-edit-likes');
                tkState.profile.name = elName ? elName.value.trim() : 'User';
                tkState.profile.handle = elHandle_2 ? elHandle_2.value.trim() : 'user';
                tkState.profile.bio = elBio ? elBio.value.trim() : '';
                tkState.profile.persona = elPersona ? elPersona.value.trim() : '';
                if (elFollowing) tkState.profile.following = elFollowing.value || 0;
                if (elFollowers) tkState.profile.followers = elFollowers.value || 0;
                if (elLikes) tkState.profile.likes = elLikes.value || 0;
                window.userState && (window.userState.name = tkState.profile.name);
                if (window.tkPersistState) window.tkPersistState();
                window.tkRenderProfile();
                const createActionSheet = document.getElementById('tk-edit-profile-sheet');
                if (createActionSheet) window.closeView(createActionSheet);
                window.showToast('Profile saved');
            }
            if (e_2.target.closest('#tk-profile-tab .tk-btn-icon')) {
                const sheet_7 = document.getElementById('tk-upload-desc-input');
                const tkUploadDescInputElement = document.getElementById('tk-upload-scene-input');
                const tkUploadCoverImgElement_134 = document.getElementById('tk-upload-cover-img');
                const coverBtn = document.getElementById('tk-upload-cover-btn');
                const tkUploadSceneInputElement = document.getElementById('tk-upload-cover-input');
                if (sheet_7) sheet_7.value = '';
                if (tkUploadDescInputElement) tkUploadDescInputElement.value = '';
                if (tkUploadSceneInputElement) tkUploadSceneInputElement.value = '';
                tkUploadCoverImgElement_134 &&
                    ((tkUploadCoverImgElement_134.src = ''),
                    (tkUploadCoverImgElement_134.style.display = 'none'));
                if (coverBtn) {
                    const div = coverBtn.querySelector('div');
                    if (div) div.style.display = 'flex';
                }
                const sheet_8 = document.getElementById('tk-upload-video-sheet');
                if (sheet_8) window.openView(sheet_8);
            }
            if (e_2.target.closest('#tk-confirm-upload-btn')) {
                const tkUploadDescInputElement_136 =
                    document.getElementById('tk-upload-desc-input');
                const tkUploadSceneInputElement_137 =
                    document.getElementById('tk-upload-scene-input');
                const coverImg = document.getElementById('tk-upload-cover-img');
                const desc_2 = tkUploadDescInputElement_136
                    ? tkUploadDescInputElement_136.value.trim()
                    : '';
                const sceneText_2 = tkUploadSceneInputElement_137
                    ? tkUploadSceneInputElement_137.value.trim()
                    : '';
                const cover_2 = coverImg ? coverImg.src : null;
                if (!tkState.profile.posts) tkState.profile.posts = [];
                const newPost = {
                    id: 'post_' + Date.now(),
                    authorId: 'profile',
                    authorName: tkState.profile.name || 'User',
                    authorAvatar: null,
                    mediaType: 'video',
                    desc: desc_2,
                    sceneText: sceneText_2,
                    cover: coverImg && coverImg.style.display === 'block' ? cover_2 : null,
                    likes: 0,
                    savedCount: 0,
                    saves: 0,
                    shares: 0,
                    commentsCount: 0,
                    comments: [],
                };
                const handleAction_2_142 = handleAction_2(newPost);
                tkState.profile.posts.unshift(newPost);
                if (window.tkPersistState) window.tkPersistState();
                window.tkRenderProfile();
                const createActionSheet_3 = document.getElementById('tk-upload-video-sheet');
                if (createActionSheet_3) window.closeView(createActionSheet_3);
                window.showToast(
                    '视频已发布，粉丝 +' +
                        handleAction_2_142.followerDelta +
                        '，获赞 +' +
                        handleAction_2_142.likeDelta,
                );
                window.tkGenerateVideoInteractions &&
                    window.tkGenerateVideoInteractions(newPost.id, {
                        isAuto: true,
                    });
            }
        }));
    visitorsBtn &&
        ((visitorsBtn.title = 'PROFILE VISITORS'),
        visitorsBtn.addEventListener('click', (_value57) => {
            _value57.stopPropagation();
            if (window.tkOpenProfileVisitorsSheet) window.tkOpenProfileVisitorsSheet();
        }));
    profileSettingsBtn &&
        ((profileSettingsBtn.title = 'TIKTOK SETTINGS'),
        profileSettingsBtn.addEventListener('click', (_value58) => {
            _value58.stopPropagation();
            const _value59 = tkEnsureProfileSettingsSheet();
            tkProfileUpdateSettingsSheet(_value59);
            window.openView(_value59);
        }));
    const mainProfileTabs = document.querySelectorAll('#tk-profile-tab .tk-ptab');
    const tkCharAvatarPreviewIElement_155 = document.querySelector(
        '#tk-profile-tab .tk-ptab-indicator',
    );
    const mainGridContainer = document.getElementById('tk-profile-grid');
    mainProfileTabs.forEach((subProfileView_3, value_163) => {
        subProfileView_3.addEventListener('click', () => {
            if (subProfileView_3.classList.contains('active')) return;
            mainProfileTabs.forEach((subProfileView_2) =>
                subProfileView_2.classList.remove('active'),
            );
            subProfileView_3.classList.add('active');
            tkCharAvatarPreviewIElement_155.style.transform =
                'translateX(' + value_163 * 100 + '%)';
            const target_3 = subProfileView_3.getAttribute('data-target');
            renderGrid(
                target_3,
                mainGridContainer,
                tkState.profile.posts || [],
                tkState.videos.filter((v_5) => v_5.isLiked),
            );
        });
    });
    const subProfileTabs = document.querySelectorAll('#tk-sub-profile-view .tk-ptab');
    const subIndicator = document.querySelector('#tk-sub-profile-view .tk-ptab-indicator');
    subProfileTabs.forEach((subProfileView_5, value_167) => {
        subProfileView_5.addEventListener('click', () => {
            if (subProfileView_5.classList.contains('active')) return;
            subProfileTabs.forEach((subProfileView_4) =>
                subProfileView_4.classList.remove('active'),
            );
            subProfileView_5.classList.add('active');
            subIndicator.style.transform = 'translateX(' + value_167 * 100 + '%)';
            _value4();
        });
    });
    function renderGrid(_value60 = 'videos', _value61, charVideos_2 = [], items_170 = []) {
        if (!_value61) return;
        let _value62 = _value2.get(_value61);
        !_value62 &&
            ((_value62 = {
                nodes: new Map(),
                empty: document.createElement('div'),
            }),
            (_value62.empty.className = 'tk-grid-empty'),
            (_value62.empty.textContent = 'No content yet'),
            _value2.set(_value61, _value62),
            _value61.replaceChildren(),
            _value61.addEventListener('click', (v_6) => {
                const _value64 = v_6.target.closest('.tk-grid-item[data-video-id]');
                if (!_value64 || !_value61.contains(_value64)) return;
                window.tkOpenFullscreenVideo?.(_value64.dataset.videoId);
            }));
        const _value63 =
            _value60 === 'videos' ? charVideos_2 : _value60 === 'liked' ? items_170 : [];
        const container = new Set(_value63.map((_value65) => String(_value65.id)));
        for (const [_value66, _value67] of _value62.nodes) {
            !container.has(_value66) &&
                (_value67.element.remove(), _value62.nodes['delete'](_value66));
        }
        if (!_value63.length) {
            if (_value62.empty.parentElement !== _value61) _value61.replaceChildren(_value62.empty);
            return;
        }
        _value62.empty.remove();
        let el = _value61.firstElementChild;
        _value63.forEach((item_2) => {
            const _value68 = String(item_2.id);
            let _value69 = _value62.nodes.get(_value68);
            if (!_value69) {
                const _value75 = document.createElement('button');
                _value75.type = 'button';
                _value75.className = 'tk-grid-item';
                _value75.dataset.videoId = _value68;
                _value75.innerHTML =
                    "<img referrerpolicy=\"no-referrer\" class=\"tk-grid-cover\" alt=\"\" loading=\"lazy\" decoding=\"async\"><span class=\"tk-grid-text\"></span><span class=\"tk-grid-views\"><i class=\"fas\" aria-hidden=\"true\"></i><span></span></span>";
                _value69 = {
                    element: _value75,
                    signature: '',
                };
                _value62.nodes.set(_value68, _value69);
            }
            const _value70 = window.tkGetVideoCover(item_2);
            const _value71 = String(item_2.sceneText || item_2.desc || '视频');
            const _value72 = tkProfileFormatCount(item_2.likes ?? 0);
            const _value73 = JSON.stringify([
                _value70,
                _value71,
                _value72,
                item_2.bgColor,
                item_2.mediaType,
                item_2.desc,
            ]);
            const _value74 = _value69.element;
            if (_value73 !== _value69.signature) {
                const _value76 = _value74.querySelector('img');
                const _value77 = _value74.querySelector('.tk-grid-text');
                if (_value70 && _value76.getAttribute('src') !== _value70) _value76.src = _value70;
                if (!_value70) _value76.removeAttribute('src');
                _value76.hidden = !_value70;
                _value74.classList.toggle('tk-grid-without-cover', !_value70);
                _value77.hidden = Boolean(_value70);
                const items_2 = Array.from(_value71);
                _value77.textContent =
                    items_2.slice(0, 15).join('') + (items_2.length > 15 ? '…' : '');
                _value77.style.background = item_2.bgColor || '#fff';
                _value74.querySelector('.tk-grid-views i').className =
                    'fas ' + (item_2.mediaType === 'image' ? 'fa-image' : 'fa-play');
                _value74.querySelector('.tk-grid-views span').textContent = _value72;
                _value74.setAttribute(
                    'aria-label',
                    (item_2.desc || _value71) + '，' + _value72 + '赞',
                );
                _value69.signature = _value73;
            }
            if (_value74 === el) el = el.nextElementSibling;
            else _value61.insertBefore(_value74, el);
        });
    }
    const coverBtn_2 = document.getElementById('tk-upload-cover-btn');
    const coverInput = document.getElementById('tk-upload-cover-input');
    const coverImg_2 = document.getElementById('tk-upload-cover-img');
    coverBtn_2 &&
        coverInput &&
        (coverBtn_2.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') coverInput.click();
        }),
        coverInput.addEventListener('change', (event_185) => {
            const value_186 = event_185.target.files[0];
            if (value_186) {
                const value_187 = new FileReader();
                value_187.onload = (ev) => {
                    coverImg_2 &&
                        ((coverImg_2.src = ev.target.result), (coverImg_2.style.display = 'block'));
                    const divElement_189 = coverBtn_2.querySelector('div');
                    if (divElement_189) divElement_189.style.display = 'none';
                };
                value_187.readAsDataURL(value_186);
            }
            event_185.target.value = '';
        }));
    document.addEventListener('tk:data-cleared', ({ detail: _value78 }) => {
        if (_value78.kind === 'videos') {
            _value4();
            return;
        }
        if (_value78.kind !== 'all') return;
        currentSubCharId = null;
        window.currentTkSubProfileCharId = null;
        [
            'tk-sub-profile-view',
            'tk-edit-profile-sheet',
            'tk-edit-char-sheet',
            'tk-import-char-sheet',
            'tk-upload-video-sheet',
            'tk-profile-visitors-sheet',
            'tk-visitor-thought-sheet',
        ].forEach((_value79) => window.closeView(document.getElementById(_value79)));
        document.getElementById('tk-sub-profile-grid')?.replaceChildren();
        tkProfileUpdateSettingsSheet(document.getElementById('tk-profile-settings-sheet'));
    });
});
