(function () {
    'use strict';

    const text_2 = 'cphone:selected-char-id',
        value_3 = (value_10) => 'cphone:groups:' + value_10,
        value_4 = (value_11) =>
            value_11 &&
            value_11.excludedFromContext !== true &&
            value_11.noticeKind !== 'group_private_to_user' &&
            value_11.noticeKind !== 'group_friend_private_chat',
        value_5 = (value_12) => value_12?.noticeKind !== 'user_remark_changed',
        value_6 = (value_13) =>
            value_13?.nickname || value_13?.realName || value_13?.realname || 'Char',
        value_7 = (value_14) =>
            value_14 + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10),
        value_8 = (value_15) =>
            (window.imData?.friends || []).find(
                (value_16) => String(value_16?.id) === String(value_15),
            ) || null,
        value_9 = (message_17) =>
            Number(message_17?.timestamp || message_17?.updatedAt || message_17?.generatedAt) || 0,
        cphoneApp_2 = {
            initialized: false,
            selectedId: '',
            activeThread: null,
            activeContact: null,
            tab: 'threads',
            rows: new Map(),
            searchRows: null,
            searchTimer: null,
            renderedThreadKey: '',
            renderedMessageCount: 0,
            renderedSignatures: [],
            renderedLastSpeakerKey: '',
            renderedLastTime: 0,
            migration: null,
            groupMigration: null,
            groupsByChar: new Map(),
            groupLoads: new Map(),
            groupWrites: new Map(),
            progressing: false,
            clearing: false,
            creatingGroup: false,
            wallpaperSaving: false,
            openSequence: 0,
            wallpaperRevision: 0,
            getFriends() {
                return (window.imData?.friends || []).filter(
                    (value_18) => value_18?.type === 'char',
                );
            },
            getSelectedFriend() {
                return (
                    this.getFriends().find((value_19) => String(value_19.id) === this.selectedId) ||
                    null
                );
            },
            getUserIdentity(value_20) {
                return (
                    window.imApp?.getCharUserIdentity?.(value_20) || {
                        name: window.userState?.name || window.imData?.profile?.name || 'User',
                        avatarUrl:
                            window.userState?.avatarUrl || window.imData?.profile?.avatarUrl || '',
                        persona: window.userState?.persona || '',
                    }
                );
            },
            refreshUserIdentity() {
                const selectedFriend = this.getSelectedFriend();
                if (!selectedFriend) return;
                const userIdentity_21 = this.getUserIdentity(selectedFriend);
                this.searchRows = null;
                this.activeContact?.kind === 'user' &&
                    ((this.activeContact.title = userIdentity_21.name),
                    (this.activeContact.avatarUrl = userIdentity_21.avatarUrl),
                    (this.activeContact.persona = userIdentity_21.persona),
                    (document.getElementById('cphone-contact-name').textContent =
                        userIdentity_21.name),
                    (document.getElementById('cphone-contact-persona').textContent =
                        userIdentity_21.persona),
                    this.fillAvatar(
                        document.getElementById('cphone-contact-avatar'),
                        userIdentity_21.avatarUrl,
                        userIdentity_21.name,
                    ));
                this.activeThread?.kind === 'user' &&
                    ((this.activeThread.title = userIdentity_21.name),
                    (this.activeThread.avatarUrl = userIdentity_21.avatarUrl),
                    (document.getElementById('cphone-thread-title').textContent =
                        userIdentity_21.name),
                    this.fillAvatar(
                        document.getElementById('cphone-thread-avatar'),
                        userIdentity_21.avatarUrl,
                        userIdentity_21.name,
                    ));
                if (this.activeThread) this.renderThread();
                else this.renderList();
            },
            async readSelection() {
                try {
                    return String((await window.appStorage?.getMeta?.(text_2)) || '');
                } catch (value_22) {
                    return '';
                }
            },
            saveSelection(value_23) {
                this.selectedId = String(value_23 || '');
                window.appStorage?.setMeta &&
                    window.appStorage
                        .setMeta(text_2, this.selectedId)
                        [
                            'catch'
                        ]((value_24) => console.warn('[Cphone] Failed to save selected Char', value_24));
            },
            init() {
                if (this.initialized) return;
                this.phoneView = document.getElementById('lovers-friend-phone-view');
                this.emptyView = document.getElementById('cphone-view');
                this.smsView = document.getElementById('friend-imessage-view');
                if (!this.phoneView || !this.emptyView || !this.smsView) return;
                window.mobileInputCompat?.registerFocusScope?.({
                    selector: '#friend-imessage-view.active',
                    priority: 40,
                    preferFocusScope: true,
                    followViewportOrigin: true,
                    resolveScrollContainer: (value_25) =>
                        value_25.closest('.cphone-create-group-card') ||
                        this.smsView.querySelector('.cphone-sms-scroll'),
                    scrollBehavior: 'focus',
                });
                document
                    .getElementById('cphone-back-btn')
                    ?.addEventListener('click', () => this.closeEmpty());
                document
                    .getElementById('cphone-owner-button')
                    ?.addEventListener('click', () => this.showSwitcher());
                document
                    .getElementById('friend-phone-app-settings')
                    ?.addEventListener('click', () => this.syncWallpaperSettings());
                document.getElementById('cphone-wallpaper-apply')?.addEventListener('click', () => {
                    void this.applyWallpaperUrl();
                });
                document.getElementById('cphone-wallpaper-reset')?.addEventListener('click', () => {
                    void this.saveWallpaper('');
                });
                document
                    .getElementById('cphone-wallpaper-url')
                    ?.addEventListener('keydown', (event) => {
                        if (event.key !== 'Enter' || event.isComposing) return;
                        event.preventDefault();
                        event.target.blur?.();
                        void this.applyWallpaperUrl();
                    });
                document
                    .getElementById('cphone-switch-close')
                    ?.addEventListener('click', () => this.hideSwitcher());
                document
                    .getElementById('cphone-switcher')
                    ?.addEventListener('click', (event_26) => {
                        if (event_26.target.id === 'cphone-switcher') this.hideSwitcher();
                        const closest_27 = event_26.target.closest('[data-cphone-friend-id]');
                        if (closest_27) void this.openFriend(closest_27.dataset.cphoneFriendId);
                    });
                document
                    .getElementById('friend-imsg-back-btn')
                    ?.addEventListener('click', () => this.closeMessages());
                document
                    .getElementById('cphone-create-group-open')
                    ?.addEventListener('click', () => this.openCreateGroup());
                document
                    .getElementById('cphone-create-group-close')
                    ?.addEventListener('click', () => this.closeCreateGroup());
                document
                    .getElementById('cphone-create-group-sheet')
                    ?.addEventListener('click', (event_28) => {
                        if (event_28.target.id === 'cphone-create-group-sheet')
                            this.closeCreateGroup();
                    });
                document
                    .getElementById('cphone-create-group-form')
                    ?.addEventListener('submit', (event_29) => {
                        event_29.preventDefault();
                        void this.createGroup();
                    });
                ['cphone-sms-search', 'cphone-create-group-form', 'cphone-progress-form'].forEach(
                    (value_30) => {
                        document
                            .getElementById(value_30)
                            ?.addEventListener('keydown', (value_31) =>
                                this.handleInputEnter(value_31),
                            );
                    },
                );
                document.addEventListener('keydown', (value_32) => {
                    if (
                        value_32.key === 'Escape' &&
                        !document.getElementById('cphone-create-group-sheet')?.hidden
                    )
                        this.closeCreateGroup();
                    if (
                        value_32.key === 'Escape' &&
                        !document.getElementById('cphone-progress-sheet')?.hidden
                    )
                        this.closeProgress();
                    if (
                        value_32.key === 'Escape' &&
                        !document.getElementById('cphone-switcher')?.hidden
                    )
                        this.hideSwitcher();
                });
                document
                    .getElementById('cphone-thread-back')
                    ?.addEventListener('click', () => this.closeThread());
                document
                    .getElementById('cphone-progress-open')
                    ?.addEventListener('click', () => this.openProgress());
                document.getElementById('cphone-clear-chat')?.addEventListener('click', () => {
                    void this.clearThread();
                });
                document
                    .getElementById('cphone-progress-close')
                    ?.addEventListener('click', () => this.closeProgress());
                document
                    .getElementById('cphone-progress-sheet')
                    ?.addEventListener('click', (event_33) => {
                        if (event_33.target.id === 'cphone-progress-sheet') this.closeProgress();
                    });
                document
                    .getElementById('cphone-progress-form')
                    ?.addEventListener('submit', (event_34) => {
                        event_34.preventDefault();
                        void this.progressThread();
                    });
                document.getElementById('cphone-sms-search')?.addEventListener('input', () => {
                    if (this.searchTimer) clearTimeout(this.searchTimer);
                    this.searchTimer = setTimeout(() => {
                        this.searchTimer = null;
                        this.renderList(true);
                    }, 80);
                });
                document
                    .getElementById('cphone-sms-tabs')
                    ?.addEventListener('click', (event_35) => {
                        const closest_36 = event_35.target.closest('[data-cphone-tab]');
                        closest_36 &&
                            ((this.tab = closest_36.dataset.cphoneTab), this.renderList());
                    });
                document
                    .getElementById('cphone-sms-list')
                    ?.addEventListener('click', (event_37) => {
                        const closest_38 = event_37.target.closest('[data-cphone-row]'),
                            value_39 = closest_38 && this.rows.get(closest_38.dataset.cphoneRow);
                        if (value_39)
                            this.tab === 'contacts'
                                ? this.openContact(value_39)
                                : void this.openThread(value_39);
                    });
                document
                    .getElementById('cphone-contact-close')
                    ?.addEventListener('click', () => this.closeContact());
                document
                    .getElementById('cphone-contact-sheet')
                    ?.addEventListener('click', (event_40) => {
                        if (event_40.target.id === 'cphone-contact-sheet') this.closeContact();
                    });
                document.getElementById('cphone-contact-send')?.addEventListener('click', () => {
                    const activeContact_41 = this.activeContact;
                    this.closeContact();
                    if (activeContact_41) void this.openThread(activeContact_41);
                });
                document
                    .getElementById('cphone-sms-messages')
                    ?.addEventListener('click', (event_42) => {
                        const closest_43 = event_42.target.closest?.(
                            '.group-private-chat-detail-bubble.has-translation',
                        );
                        if (closest_43) this.toggleBubbleTranslation(closest_43);
                    });
                window.addEventListener('u2:linked-accounts-changed', (value_44) => {
                    if (
                        String(value_44.detail?.friendId || '') === this.selectedId &&
                        (!this.activeThread || this.activeThread.kind === 'linked')
                    )
                        this.refreshMessages();
                });
                window.addEventListener('u2:friend-message-appended', (value_45) => {
                    const string = String(value_45.detail?.friendId || '');
                    if (this.activeThread) {
                        if (
                            (this.activeThread.kind === 'user' && string === this.selectedId) ||
                            (this.activeThread.kind === 'group' &&
                                string === String(this.activeThread.groupId))
                        )
                            this.refreshMessages();
                    } else {
                        if (
                            string === this.selectedId ||
                            this.getGroupsForChar(this.getSelectedFriend()).some(
                                (value_46) => String(value_46.id) === string,
                            )
                        )
                            this.refreshMessages();
                    }
                });
                window.addEventListener('u2:friend-removed', () => {
                    if (!this.getSelectedFriend()) void this.open();
                });
                window.addEventListener('account-updated', () => this.refreshUserIdentity());
                window.addEventListener('user-state-updated', () => this.refreshUserIdentity());
                window.addEventListener('u2:friend-account-binding-changed', (value_47) => {
                    if (String(value_47.detail?.friendId || '') === this.selectedId)
                        this.refreshUserIdentity();
                });
                window.addEventListener('u2:char-user-remark-changed', (value_48) => {
                    if (String(value_48.detail?.friendId || '') === this.selectedId)
                        this.refreshUserIdentity();
                });
                this.initialized = true;
                void this.migrateLegacyGroups();
            },
            handleInputEnter(event_49) {
                const value_50 =
                    window.mobileInputCompat?.isSendEnter?.(event_49) ??
                    (event_49?.key === 'Enter' &&
                        !event_49.isComposing &&
                        event_49.keyCode !== 229 &&
                        !event_49.shiftKey &&
                        !event_49.ctrlKey &&
                        !event_49.metaKey &&
                        !event_49.altKey);
                if (!value_50) return;
                const value_51 = {
                    'cphone-create-group-name': 'cphone-create-group-count',
                    'cphone-create-group-count': 'cphone-create-group-purpose',
                    'cphone-progress-rounds': 'cphone-progress-direction',
                }[event_49.target?.id];
                if (event_49.target?.id === 'cphone-sms-search') {
                    event_49.preventDefault();
                    event_49.target.blur?.();
                } else
                    value_51 &&
                        (event_49.preventDefault(), document.getElementById(value_51)?.focus?.());
            },
            blurActiveWithin(value_52) {
                const activeElement_53 = document.activeElement;
                if (activeElement_53 && value_52?.contains?.(activeElement_53))
                    activeElement_53.blur?.();
            },
            async cleanupLegacySms() {
                if (this.migration) return this.migration;
                return (
                    (this.migration = (async () => {
                        const filter_54 = this.getFriends().filter(
                            (value_55) =>
                                Object.prototype.hasOwnProperty.call(value_55, 'imessageData') ||
                                value_55.phoneGenApps?.includes('imessage') ||
                                Object.prototype.hasOwnProperty.call(
                                    value_55.phoneGenCounts || {},
                                    'imessageMain',
                                ) ||
                                Object.prototype.hasOwnProperty.call(
                                    value_55.phoneGenCounts || {},
                                    'imessageAlt',
                                ),
                        );
                        for (const value_56 of filter_54) {
                            if (!window.imApp?.commitFriendChange) break;
                            try {
                                const value_57 = await window.imApp.commitFriendChange(
                                    value_56.id,
                                    (value_58) => {
                                        delete value_58.imessageData;
                                        if (Array.isArray(value_58.phoneGenApps))
                                            value_58.phoneGenApps = value_58.phoneGenApps.filter(
                                                (value_59) => value_59 !== 'imessage',
                                            );
                                        value_58.phoneGenCounts &&
                                            (delete value_58.phoneGenCounts.imessageMain,
                                            delete value_58.phoneGenCounts.imessageAlt);
                                    },
                                    {
                                        silent: true,
                                    },
                                );
                                if (!value_57) window.showToast?.('旧短信记录清理失败');
                            } catch (value_60) {
                                console.warn('[Cphone] Failed to remove legacy SMS data', value_60);
                                window.showToast?.('旧短信记录清理失败');
                            }
                        }
                    })()['finally'](() => {
                        this.migration = null;
                    })),
                    this.migration
                );
            },
            getCphoneGroups(value_61) {
                return this.groupsByChar.get(String(value_61?.id || '')) || [];
            },
            async loadCphoneGroups(value_62) {
                const string_63 = String(value_62 || '');
                if (this.groupsByChar.has(string_63)) return this.groupsByChar.get(string_63);
                if (this.groupLoads.has(string_63)) return this.groupLoads.get(string_63);
                const value_64 = (async () => {
                    const value_65 = await window.appStorage?.getMeta?.(value_3(string_63)),
                        value_66 = Array.isArray(value_65) ? value_65 : [];
                    return (this.groupsByChar.set(string_63, value_66), value_66);
                })()['finally'](() => this.groupLoads['delete'](string_63));
                return (this.groupLoads.set(string_63, value_64), value_64);
            },
            saveCphoneGroups(value_67, value_68) {
                const string_69 = String(value_67 || ''),
                    value_70 = this.groupWrites.get(string_69) || Promise.resolve(),
                    then_71 = value_70['catch'](() => {}).then(async () => {
                        const value_72 = await this.loadCphoneGroups(string_69),
                            result = JSON.parse(JSON.stringify(value_72));
                        value_68(result);
                        if (!window.appStorage?.setMeta) throw new Error('Cphone 存储不可用');
                        return (
                            await window.appStorage.setMeta(value_3(string_69), result),
                            this.groupsByChar.set(string_69, result),
                            result
                        );
                    });
                return (
                    this.groupWrites.set(string_69, then_71),
                    void then_71['finally'](() => {
                        if (this.groupWrites.get(string_69) === then_71)
                            this.groupWrites['delete'](string_69);
                    })['catch'](() => {}),
                    then_71
                );
            },
            migrateLegacyGroups() {
                if (this.groupMigration) return this.groupMigration;
                return (
                    (this.groupMigration = (async () => {
                        await this.cleanupLegacySms();
                        const filter_73 = (window.imData?.friends || []).filter(
                            (value_79) =>
                                value_79?.type === 'group' &&
                                String(value_79.id || '').startsWith('cphone-group-'),
                        );
                        if (!filter_73.length || !window.imApp?.commitFriendsChange) return;
                        for (const value_80 of filter_73) {
                            await window.imApp.ensureFriendMessagesLoaded?.(value_80);
                        }
                        const map_74 = filter_73.map((group_2) => {
                                const owner_2 = (window.imData?.friends || []).find(
                                    (value_83) =>
                                        value_83?.type === 'char' &&
                                        (group_2.members || []).some(
                                            (value_84) => String(value_84) === String(value_83.id),
                                        ),
                                );
                                return {
                                    group: group_2,
                                    owner: owner_2,
                                    local: {
                                        id: String(group_2.id),
                                        title: value_6(group_2),
                                        displayCount: Number(group_2.cphoneDisplayMemberCount) || 0,
                                        purpose: String(group_2.cphoneGroupPurpose || ''),
                                        members: Array.isArray(group_2.cphoneStrangers)
                                            ? group_2.cphoneStrangers.map((value_85) => ({
                                                  ...value_85,
                                              }))
                                            : [],
                                        messages: Array.isArray(group_2.messages)
                                            ? group_2.messages.map((value_86) => ({
                                                  ...value_86,
                                              }))
                                            : [],
                                        createdAt:
                                            Number(group_2.leftGroupAt) ||
                                            value_9(group_2.messages?.[0]) ||
                                            Date.now(),
                                        updatedAt: value_9(group_2.messages?.at(-1)) || Date.now(),
                                    },
                                };
                            }),
                            map_75 = map_74
                                .filter((value_87) => !value_87.owner)
                                .map((value_88) => value_88.local);
                        if (map_75.length) {
                            if (!window.appStorage?.setMeta)
                                throw new Error('无法保存无主 Cphone 群');
                            const value_89 =
                                    await window.appStorage.getMeta?.('cphone:orphan-groups'),
                                items_90 = Array.isArray(value_89) ? [...value_89] : [];
                            map_75.forEach((value_91) => {
                                if (
                                    !items_90.some(
                                        (value_92) => String(value_92.id) === value_91.id,
                                    )
                                )
                                    items_90.push(value_91);
                            });
                            await window.appStorage.setMeta('cphone:orphan-groups', items_90);
                        }
                        const value_76 = new Set(
                                map_74.map((value_93) => String(value_93.group.id)),
                            ),
                            value_77 = new Map();
                        map_74.forEach(({ owner: owner_3, local: local_2 }) => {
                            if (!owner_3) return;
                            const string_96 = String(owner_3.id);
                            if (!value_77.has(string_96)) value_77.set(string_96, []);
                            value_77.get(string_96).push(local_2);
                        });
                        const value_78 = new Map();
                        try {
                            for (const [value_98, items_99] of value_77) {
                                value_78.set(
                                    value_98,
                                    JSON.parse(
                                        JSON.stringify(await this.loadCphoneGroups(value_98)),
                                    ),
                                );
                                await this.saveCphoneGroups(value_98, (items_100) => {
                                    items_99.forEach((value_101) => {
                                        if (
                                            !items_100.some(
                                                (value_102) =>
                                                    String(value_102.id) === value_101.id,
                                            )
                                        )
                                            items_100.push(value_101);
                                    });
                                });
                            }
                            const value_97 = await window.imApp.commitFriendsChange(
                                () => {
                                    window.imData.friends = window.imData.friends.filter(
                                        (value_103) => !value_76.has(String(value_103.id)),
                                    );
                                },
                                {
                                    deletedFriendIds: [...value_76],
                                    silent: true,
                                },
                            );
                            if (!value_97) throw new Error('Cphone 群迁移保存失败');
                        } catch (value_104) {
                            for (const [value_105, value_106] of value_78) {
                                try {
                                    await this.saveCphoneGroups(value_105, (value_107) => {
                                        value_107.splice(0, value_107.length, ...value_106);
                                    });
                                } catch (value_108) {
                                    console.error(
                                        '[Cphone] Failed to restore group storage',
                                        value_108,
                                    );
                                }
                            }
                            throw value_104;
                        }
                        if (value_76.has(String(window.imData.currentActiveFriend?.id || '')))
                            window.imData.currentActiveFriend = null;
                        window.imApp.renderGroupsList?.({
                            force: true,
                        });
                        window.imApp.requestChatsListRefresh?.();
                        this.refreshMessages();
                    })()
                        ['catch']((value_109) => {
                            console.warn('[Cphone] Failed to migrate Cphone groups', value_109);
                            window.showToast?.('Cphone 群迁移失败，请重新打开 Cphone 重试');
                        })
                        ['finally'](() => {
                            this.groupMigration = null;
                        })),
                    this.groupMigration
                );
            },
            async open() {
                this.init();
                await this.migrateLegacyGroups();
                const friends_110 = this.getFriends(),
                    value_111 = this.getSelectedFriend()?.id || (await this.readSelection()),
                    value_112 =
                        friends_110.find(
                            (value_113) => String(value_113.id) === String(value_111),
                        ) || friends_110[0];
                if (!value_112) {
                    this.closeMessages();
                    window.closeView?.(this.phoneView);
                    this.phoneView.classList.remove('active');
                    this.emptyView.inert = false;
                    this.emptyView.setAttribute('aria-hidden', 'false');
                    window.openView?.(this.emptyView);
                    this.emptyView.classList.add('active');
                    return;
                }
                return this.openFriend(value_112.id);
            },
            async openFriend(value_114) {
                this.init();
                const result_115 = this.getFriends().find(
                    (value_119) => String(value_119.id) === String(value_114),
                );
                if (!result_115 || !window.lovesApp?.openFriendPhone) return false;
                const value_116 = ++this.openSequence;
                await this.loadCphoneGroups(result_115.id);
                if (value_116 !== this.openSequence) return false;
                if (!window.lovesApp.initialized) window.lovesApp.init();
                this.closeContact();
                this.closeMessages();
                this.hideSwitcher();
                this.closeEmpty();
                this.saveSelection(result_115.id);
                this.searchRows = null;
                this.renderedThreadKey = '';
                this.paintWallpaper('');
                window.lovesApp.openFriendPhone(result_115);
                this.renderDesktop(result_115);
                this.syncWallpaperSettings();
                const value_117 = ++this.wallpaperRevision,
                    value_118 = await this.resolveWallpaper(result_115);
                if (value_116 === this.openSequence && value_117 === this.wallpaperRevision)
                    this.paintWallpaper(value_118);
                return true;
            },
            async resolveWallpaper(value_120) {
                const trim_121 = String(value_120?.cphoneWallpaperAssetId || '').trim();
                if (trim_121)
                    try {
                        return String((await window.appStorage?.getAssetUrl?.(trim_121)) || '');
                    } catch (value_123) {
                        return (console.warn('[Cphone] Failed to load wallpaper', value_123), '');
                    }
                const trim_122 = String(value_120?.cphoneWallpaperUrl || '').trim();
                try {
                    const value_124 = new URL(trim_122);
                    return ['http:', 'https:'].includes(value_124.protocol) ? value_124.href : '';
                } catch (value_125) {
                    return '';
                }
            },
            paintWallpaper(value_126) {
                if (!this.phoneView) return;
                const string_127 = String(value_126 || '');
                this.phoneView.classList.toggle('has-custom-wallpaper', !!string_127);
                if (string_127)
                    this.phoneView.style.setProperty(
                        '--cphone-wallpaper-image',
                        'url(' + JSON.stringify(string_127) + ')',
                    );
                else this.phoneView.style.removeProperty('--cphone-wallpaper-image');
            },
            syncWallpaperSettings() {
                const selectedFriend_128 = this.getSelectedFriend(),
                    cphoneWallpaperUrlElement = document.getElementById('cphone-wallpaper-url'),
                    cphoneWallpaperStatusElement =
                        document.getElementById('cphone-wallpaper-status');
                if (cphoneWallpaperUrlElement)
                    cphoneWallpaperUrlElement.value = String(
                        selectedFriend_128?.cphoneWallpaperUrl || '',
                    );
                if (cphoneWallpaperStatusElement)
                    cphoneWallpaperStatusElement.textContent =
                        selectedFriend_128?.cphoneWallpaperAssetId
                            ? '当前使用旧背景，可用 URL 替换'
                            : selectedFriend_128?.cphoneWallpaperUrl
                              ? '当前使用 URL 图片'
                              : '当前使用默认背景';
            },
            async applyWallpaperUrl() {
                const trim_129 = String(
                    document.getElementById('cphone-wallpaper-url')?.value || '',
                ).trim();
                let value_130;
                try {
                    value_130 = new URL(trim_129);
                    if (!['http:', 'https:'].includes(value_130.protocol))
                        throw new Error('unsupported protocol');
                } catch (value_131) {
                    return (window.showToast?.('请输入有效的 http 或 https 图片 URL'), false);
                }
                return this.saveWallpaper(value_130.href);
            },
            async saveWallpaper(cphoneWallpaperUrl_2) {
                const selectedFriend_133 = this.getSelectedFriend();
                if (!selectedFriend_133 || this.wallpaperSaving) return false;
                const string_134 = String(selectedFriend_133.id),
                    string_135 = String(selectedFriend_133.cphoneWallpaperAssetId || '');
                if (
                    String(selectedFriend_133.cphoneWallpaperUrl || '') === cphoneWallpaperUrl_2 &&
                    !string_135
                )
                    return true;
                this.wallpaperSaving = true;
                try {
                    const value_136 = await window.imApp?.commitFriendChange?.(
                        string_134,
                        (value_137) => {
                            value_137.cphoneWallpaperUrl = cphoneWallpaperUrl_2;
                            value_137.cphoneWallpaperAssetId = '';
                        },
                        {
                            silent: true,
                            metaOnly: true,
                            immediate: true,
                        },
                    );
                    if (!value_136) throw new Error('wallpaper save failed');
                    string_135 &&
                        void Promise.resolve(window.appStorage?.markAssetOrphaned?.(string_135))[
                            'catch'
                        ](() => {});
                    if (this.selectedId === string_134) {
                        const selectedFriend_138 = this.getSelectedFriend(),
                            value_139 = ++this.wallpaperRevision,
                            value_140 = await this.resolveWallpaper(selectedFriend_138);
                        this.selectedId === string_134 &&
                            value_139 === this.wallpaperRevision &&
                            (this.paintWallpaper(value_140), this.syncWallpaperSettings());
                    }
                    return (
                        window.showToast?.(
                            cphoneWallpaperUrl_2 ? '桌面背景已更新' : '已恢复默认背景',
                        ),
                        true
                    );
                } catch (value_141) {
                    return (
                        console.warn('[Cphone] Failed to save wallpaper', value_141),
                        window.showToast?.('桌面背景保存失败'),
                        false
                    );
                } finally {
                    this.wallpaperSaving = false;
                }
            },
            closeEmpty() {
                if (!this.emptyView) return;
                window.closeView?.(this.emptyView);
                this.emptyView.classList.remove('active');
                this.emptyView.inert = true;
                this.emptyView.setAttribute('aria-hidden', 'true');
            },
            fillAvatar(element, src_2, value_143) {
                if (!element) return;
                element.replaceChildren();
                if (src_2) {
                    const element_144 = document.createElement('img');
                    element_144.src = src_2;
                    element_144.alt = '';
                    element.appendChild(element_144);
                } else {
                    const element_145 = document.createElement('span');
                    element_145.textContent =
                        String(value_143 || '?')
                            .trim()
                            .charAt(0) || '?';
                    element.appendChild(element_145);
                }
            },
            renderDesktop(value_146) {
                const cphoneOwnerButtonElement = document.getElementById('cphone-owner-button');
                if (cphoneOwnerButtonElement)
                    cphoneOwnerButtonElement.setAttribute(
                        'aria-label',
                        '当前 ' + value_6(value_146) + '，切换 Char',
                    );
                const cphoneOwnerNameElement = document.getElementById('cphone-owner-name');
                if (cphoneOwnerNameElement) cphoneOwnerNameElement.textContent = value_6(value_146);
                this.fillAvatar(
                    document.getElementById('cphone-owner-avatar'),
                    value_146.avatarUrl,
                    value_6(value_146),
                );
            },
            showSwitcher() {
                const cphoneSwitcherElement = document.getElementById('cphone-switcher'),
                    cphoneSwitchListElement = document.getElementById('cphone-switch-list');
                if (!cphoneSwitcherElement || !cphoneSwitchListElement) return;
                cphoneSwitchListElement.replaceChildren();
                const friends_147 = this.getFriends();
                friends_147.forEach((value_148) => {
                    const element_149 = document.createElement('button');
                    element_149.type = 'button';
                    element_149.className = 'cphone-switch-row';
                    element_149.dataset.cphoneFriendId = String(value_148.id);
                    const element_150 = document.createElement('span');
                    element_150.className = 'cphone-avatar';
                    this.fillAvatar(element_150, value_148.avatarUrl, value_6(value_148));
                    const element_151 = document.createElement('strong');
                    element_151.textContent = value_6(value_148);
                    const element_152 = document.createElement('i');
                    element_152.className =
                        String(value_148.id) === this.selectedId
                            ? 'fas fa-check'
                            : 'fas fa-chevron-right';
                    element_152.setAttribute('aria-hidden', 'true');
                    element_149.append(element_150, element_151, element_152);
                    cphoneSwitchListElement.appendChild(element_149);
                });
                if (!friends_147.length)
                    cphoneSwitchListElement.textContent = '还没有 Char，请先在 iMessage 添加。';
                cphoneSwitcherElement.inert = false;
                cphoneSwitcherElement.hidden = false;
                (
                    cphoneSwitchListElement.querySelector?.('button') ||
                    document.getElementById('cphone-switch-close')
                )?.focus?.({
                    preventScroll: true,
                });
            },
            hideSwitcher() {
                const cphoneSwitcherElement_153 = document.getElementById('cphone-switcher');
                if (!cphoneSwitcherElement_153) return;
                const activeElement_154 = document.activeElement;
                if (activeElement_154 && cphoneSwitcherElement_153.contains(activeElement_154)) {
                    document.getElementById('cphone-owner-button')?.focus?.({
                        preventScroll: true,
                    });
                    if (cphoneSwitcherElement_153.contains(document.activeElement))
                        activeElement_154.blur?.();
                }
                cphoneSwitcherElement_153.inert = true;
                cphoneSwitcherElement_153.hidden = true;
            },
            async openMessages() {
                await this.migrateLegacyGroups();
                const selectedFriend_155 = this.getSelectedFriend();
                if (!selectedFriend_155) return;
                await this.loadCphoneGroups(selectedFriend_155.id);
                await window.imApp?.ensureFriendMessagesLoaded?.(selectedFriend_155);
                this.activeThread = null;
                this.tab = 'threads';
                const cphoneSmsSearchElement = document.getElementById('cphone-sms-search');
                if (cphoneSmsSearchElement) cphoneSmsSearchElement.value = '';
                window.openView?.(this.smsView);
                this.smsView.classList.add('active');
                this.renderList();
            },
            closeMessages() {
                if (!this.smsView) return;
                if (this.searchTimer) clearTimeout(this.searchTimer);
                this.searchTimer = null;
                this.blurActiveWithin(this.smsView);
                this.activeThread = null;
                this.searchRows = null;
                this.renderedThreadKey = '';
                this.closeContact();
                this.closeCreateGroup();
                this.closeProgress(true);
                window.closeView?.(this.smsView);
                this.smsView.classList.remove('active');
            },
            closeThread() {
                this.closeProgress(true);
                this.activeThread = null;
                this.renderedThreadKey = '';
                this.renderList();
            },
            getGroupsForChar(value_156) {
                if (!value_156) return [];
                return (window.imData?.friends || []).filter((value_157) => {
                    if (value_157?.type !== 'group') return false;
                    if (String(value_157.id || '').startsWith('cphone-group-')) return false;
                    if (typeof window.imChat?.getGroupMemberFriends === 'function')
                        return window.imChat
                            .getGroupMemberFriends(value_157)
                            .some((value_158) => String(value_158.id) === String(value_156.id));
                    return (value_157.members || []).some(
                        (value_159) => String(value_159) === String(value_156.id),
                    );
                });
            },
            getLinkedChats(value_160) {
                return window.imApp?.normalizeLinkedAccountChats
                    ? window.imApp.normalizeLinkedAccountChats(value_160?.linkedAccountChats)
                    : Array.isArray(value_160?.linkedAccountChats)
                      ? value_160.linkedAccountChats
                      : [];
            },
            getRelationships(value_161) {
                return (
                    Array.isArray(value_161?.memory?.relationships)
                        ? value_161.memory.relationships
                        : []
                )
                    .map((relation_2) => ({
                        relation: relation_2,
                        target: value_8(relation_2?.targetId ?? relation_2?.npcId),
                    }))
                    .filter(
                        (event_163) =>
                            event_163.target &&
                            (event_163.target.type === 'char' || event_163.target.type === 'npc'),
                    );
            },
            findLinkedForTarget(value_164, value_165, items_166 = this.getLinkedChats(value_164)) {
                const result_167 = items_166.find(
                    (value_170) => String(value_170.sourceNpcId || '') === String(value_165.id),
                );
                if (result_167) return result_167;
                const value_168 = new Set(
                        [value_165.nickname, value_165.realName, value_165.realname]
                            .filter(Boolean)
                            .map((value_171) => String(value_171).trim().toLowerCase()),
                    ),
                    filter_169 = items_166.filter(
                        (value_172) =>
                            !value_172.sourceNpcId &&
                            [value_172.name, value_172.remark, value_172.realName].some(
                                (value_173) =>
                                    value_168.has(
                                        String(value_173 || '')
                                            .trim()
                                            .toLowerCase(),
                                    ),
                            ),
                    );
                return filter_169.length === 1 ? filter_169[0] : null;
            },
            getThreadRows(value_174) {
                if (!value_174) return [];
                const items_175 = [],
                    userIdentity_176 = this.getUserIdentity(value_174),
                    messages_2 = Array.isArray(value_174.messages)
                        ? value_174.messages.filter(value_5)
                        : [];
                if (messages_2.length)
                    items_175.push({
                        kind: 'user',
                        key: 'user',
                        title: userIdentity_176.name,
                        avatarUrl: userIdentity_176.avatarUrl,
                        messages: messages_2,
                        timestamp: value_9(messages_2.at(-1)),
                    });
                return (
                    this.getGroupsForChar(value_174).forEach((value_178) => {
                        const messages_3 = (
                            Array.isArray(value_178.messages) ? value_178.messages : []
                        ).filter(value_4);
                        items_175.push({
                            kind: 'group',
                            key: 'group:' + value_178.id,
                            groupId: String(value_178.id),
                            title: value_6(value_178),
                            avatarUrl: value_178.avatarUrl || '',
                            messages: messages_3,
                            previewText: messages_3.length
                                ? ''
                                : String(value_178.lastMessagePreview || ''),
                            timestamp:
                                value_9(messages_3.at(-1)) ||
                                Number(value_178.lastMessageTimestamp) ||
                                0,
                        });
                    }),
                    this.getCphoneGroups(value_174).forEach((value_180) => {
                        const messages_4 = Array.isArray(value_180.messages)
                            ? value_180.messages
                            : [];
                        items_175.push({
                            kind: 'cphoneGroup',
                            key: 'cphone-group:' + value_180.id,
                            groupId: String(value_180.id),
                            title: value_180.title || '群聊',
                            avatarUrl: value_180.avatarUrl || '',
                            displayCount: Number(value_180.displayCount) || 0,
                            messages: messages_4,
                            timestamp:
                                value_9(messages_4.at(-1)) || Number(value_180.updatedAt) || 0,
                        });
                    }),
                    this.getLinkedChats(value_174).forEach((contact) => {
                        if (!contact.messages?.length) return;
                        const value_182 = contact.sourceNpcId ? value_8(contact.sourceNpcId) : null;
                        items_175.push({
                            kind: 'linked',
                            key: 'linked:' + contact.id,
                            chatId: String(contact.id),
                            targetId: value_182?.id ? String(value_182.id) : '',
                            title: contact.remark || contact.name || contact.realName || '联系人',
                            avatarUrl: value_182?.avatarUrl || '',
                            relationship: contact.relationship || '',
                            persona: contact.persona || '',
                            messages: contact.messages,
                            timestamp:
                                Number(contact.updatedAt) || value_9(contact.messages.at(-1)),
                        });
                    }),
                    items_175.sort(
                        (message_183, message_184) =>
                            message_184.timestamp - message_183.timestamp ||
                            message_183.title.localeCompare(message_184.title),
                    )
                );
            },
            getContactRows(value_185) {
                if (!value_185) return [];
                const userIdentity_186 = this.getUserIdentity(value_185),
                    items_187 = [
                        {
                            kind: 'user',
                            key: 'user',
                            title: userIdentity_186.name,
                            avatarUrl: userIdentity_186.avatarUrl,
                            relationship: value_185.relationship || '',
                            persona: userIdentity_186.persona,
                        },
                    ],
                    value_188 = new Set(),
                    linkedChats = this.getLinkedChats(value_185);
                return (
                    this.getRelationships(value_185).forEach(
                        ({ relation: relation_3, target: target_2 }) => {
                            const linkedForTarget = this.findLinkedForTarget(
                                value_185,
                                target_2,
                                linkedChats,
                            );
                            if (linkedForTarget) value_188.add(String(linkedForTarget.id));
                            items_187.push({
                                kind: 'linked',
                                key: 'contact:' + target_2.id,
                                targetId: String(target_2.id),
                                chatId: linkedForTarget ? String(linkedForTarget.id) : '',
                                title: linkedForTarget?.remark || value_6(target_2),
                                avatarUrl: target_2.avatarUrl || '',
                                relationship:
                                    relation_3.relation || linkedForTarget?.relationship || '',
                                persona: linkedForTarget?.persona || target_2.signature || '',
                            });
                        },
                    ),
                    linkedChats.forEach((contact_191) => {
                        if (value_188.has(String(contact_191.id))) return;
                        const value_192 = contact_191.sourceNpcId
                            ? value_8(contact_191.sourceNpcId)
                            : null;
                        items_187.push({
                            kind: 'linked',
                            key: 'contact-linked:' + contact_191.id,
                            chatId: String(contact_191.id),
                            targetId: value_192?.id ? String(value_192.id) : '',
                            title:
                                contact_191.remark ||
                                contact_191.name ||
                                contact_191.realName ||
                                '联系人',
                            avatarUrl: value_192?.avatarUrl || '',
                            relationship: contact_191.relationship || '',
                            persona: contact_191.persona || '',
                        });
                    }),
                    items_187
                );
            },
            messageText(message_193) {
                const options_194 = {
                        image: '[图片]',
                        sticker: '[表情]',
                        voice: '[语音]',
                        voice_message: '[语音]',
                        video: '[视频]',
                        file: '[文件]',
                        location: '[位置]',
                        payment: '[转账]',
                        transfer: '[转账]',
                        group_red_packet: '[红包]',
                        group_poll: '[投票]',
                    },
                    string_195 = String(message_193?.type || '');
                if (options_194[string_195]) {
                    const trim_196 = String(
                        message_193?.description || message_193?.text || '',
                    ).trim();
                    return '' + options_194[string_195] + (trim_196 ? ' ' + trim_196 : '');
                }
                return (
                    [message_193?.text, message_193?.content, message_193?.transcript]
                        .map((value_197) => String(value_197 ?? '').trim())
                        .find(Boolean) || '[消息]'
                );
            },
            messageTime(value_198) {
                if (!value_198) return '';
                const value_199 = new Date(value_198);
                if (Number.isNaN(value_199.getTime())) return '';
                const value_200 = (value_202) => String(value_202).padStart(2, '0'),
                    value_201 =
                        value_200(value_199.getHours()) + ':' + value_200(value_199.getMinutes());
                return value_199.toDateString() === new Date().toDateString()
                    ? value_201
                    : value_199.getMonth() + 1 + '/' + value_199.getDate() + ' ' + value_201;
            },
            messageChipTime(value_203) {
                const value_204 = new Date(Number(value_203) || 0);
                if (!value_203 || Number.isNaN(value_204.getTime())) return '';
                const value_205 = (value_206) => String(value_206).padStart(2, '0');
                return (
                    value_204.getMonth() +
                    1 +
                    '/' +
                    value_204.getDate() +
                    ' ' +
                    value_205(value_204.getHours()) +
                    ':' +
                    value_205(value_204.getMinutes())
                );
            },
            renderList(value_207 = false) {
                if (!this.smsView?.classList.contains('active') || this.activeThread) return;
                !value_207 &&
                    this.searchTimer &&
                    (clearTimeout(this.searchTimer), (this.searchTimer = null));
                const selectedFriend_208 = this.getSelectedFriend();
                document.getElementById('cphone-sms-list-page').hidden = false;
                document.getElementById('cphone-sms-detail').hidden = true;
                document.getElementById('cphone-sms-owner').textContent =
                    value_6(selectedFriend_208) + ' 的账号';
                document
                    .querySelectorAll('#cphone-sms-tabs [data-cphone-tab]')
                    .forEach((element_212) => {
                        const value_213 = element_212.dataset.cphoneTab === this.tab;
                        element_212.classList.toggle('active', value_213);
                        element_212.setAttribute('aria-selected', String(value_213));
                    });
                const toLowerCase_209 = String(
                    document.getElementById('cphone-sms-search')?.value || '',
                )
                    .trim()
                    .toLowerCase();
                if (
                    !value_207 ||
                    !this.searchRows ||
                    this.searchRows.ownerId !== String(selectedFriend_208?.id || '') ||
                    this.searchRows.tab !== this.tab
                ) {
                    const items_214 =
                        this.tab === 'contacts'
                            ? this.getContactRows(selectedFriend_208)
                            : this.getThreadRows(selectedFriend_208);
                    this.searchRows = {
                        ownerId: String(selectedFriend_208?.id || ''),
                        tab: this.tab,
                        items: items_214.map((row_2) => ({
                            row: row_2,
                            searchText: [
                                row_2.title,
                                row_2.relationship,
                                this.messageText(row_2.messages?.at(-1)),
                            ].map((value_216) => String(value_216 || '').toLowerCase()).join(`
`),
                        })),
                    };
                }
                const map_210 = this.searchRows.items
                        .filter(
                            (value_217) =>
                                !toLowerCase_209 || value_217.searchText.includes(toLowerCase_209),
                        )
                        .map((value_218) => value_218.row),
                    cphoneSmsListElement = document.getElementById('cphone-sms-list');
                this.rows.clear();
                cphoneSmsListElement.replaceChildren();
                document.getElementById('cphone-sms-count').textContent =
                    map_210.length + ' ' + (this.tab === 'contacts' ? '位联系人' : '个会话');
                if (!map_210.length) {
                    const element_219 = document.createElement('div');
                    element_219.className = 'cphone-sms-empty';
                    element_219.textContent = toLowerCase_209
                        ? '没有找到匹配结果'
                        : this.tab === 'contacts'
                          ? '还没有联系人'
                          : '还没有会话';
                    cphoneSmsListElement.appendChild(element_219);
                    return;
                }
                const documentFragment = document.createDocumentFragment?.(),
                    element_211 = documentFragment || cphoneSmsListElement;
                map_210.forEach((message_220, value_221) => {
                    const element_222 = document.createElement('button');
                    element_222.type = 'button';
                    element_222.className = 'cphone-sms-row';
                    element_222.dataset.cphoneRow = String(value_221);
                    this.rows.set(String(value_221), message_220);
                    const element_223 = document.createElement('span');
                    element_223.className =
                        'cphone-avatar' + (message_220.kind === 'group' ? ' is-group' : '');
                    this.fillAvatar(element_223, message_220.avatarUrl, message_220.title);
                    const element_224 = document.createElement('span');
                    element_224.className = 'cphone-sms-row-body';
                    const element_225 = document.createElement('span');
                    element_225.className = 'cphone-sms-row-top';
                    const element_226 = document.createElement('strong');
                    element_226.textContent = message_220.title;
                    const element_227 = document.createElement('small');
                    element_227.textContent =
                        this.tab === 'contacts' ? '' : this.messageTime(message_220.timestamp);
                    element_225.append(element_226, element_227);
                    const element_228 = document.createElement('span');
                    element_228.className = 'cphone-sms-preview';
                    element_228.textContent =
                        this.tab === 'contacts'
                            ? message_220.relationship ||
                              (message_220.kind === 'user' ? '与你的聊天' : '联系人')
                            : message_220.messages?.length
                              ? this.messageText(message_220.messages.at(-1))
                              : message_220.previewText || '暂无消息';
                    element_224.append(element_225, element_228);
                    element_222.append(element_223, element_224);
                    element_211.appendChild(element_222);
                });
                if (documentFragment) cphoneSmsListElement.appendChild(documentFragment);
            },
            openContact(activeContact_2) {
                this.activeContact = activeContact_2;
                const cphoneContactSheetElement = document.getElementById('cphone-contact-sheet');
                document.getElementById('cphone-contact-name').textContent = activeContact_2.title;
                document.getElementById('cphone-contact-relationship').textContent =
                    activeContact_2.relationship || '联系人';
                document.getElementById('cphone-contact-persona').textContent =
                    activeContact_2.persona || '';
                this.fillAvatar(
                    document.getElementById('cphone-contact-avatar'),
                    activeContact_2.avatarUrl,
                    activeContact_2.title,
                );
                cphoneContactSheetElement.hidden = false;
            },
            closeContact() {
                this.activeContact = null;
                const cphoneContactSheetElement_230 =
                    document.getElementById('cphone-contact-sheet');
                if (cphoneContactSheetElement_230) cphoneContactSheetElement_230.hidden = true;
            },
            async openThread(value_231) {
                const selectedFriend_232 = this.getSelectedFriend();
                if (!selectedFriend_232 || !value_231) return;
                if (this.searchTimer) clearTimeout(this.searchTimer);
                this.searchTimer = null;
                if (value_231.kind === 'user')
                    await window.imApp?.ensureFriendMessagesLoaded?.(selectedFriend_232);
                if (value_231.kind === 'group') {
                    const value_8_234 = value_8(value_231.groupId);
                    if (
                        !value_8_234 ||
                        !this.getGroupsForChar(selectedFriend_232).some(
                            (value_235) => String(value_235.id) === String(value_8_234.id),
                        )
                    )
                        return;
                    await window.imApp?.ensureFriendMessagesLoaded?.(value_8_234);
                }
                if (
                    value_231.kind === 'cphoneGroup' &&
                    !this.getCphoneGroups(selectedFriend_232).some(
                        (value_236) => String(value_236.id) === String(value_231.groupId),
                    )
                )
                    return;
                this.activeThread = {
                    ...value_231,
                };
                this.renderedThreadKey = '';
                document.getElementById('cphone-sms-list-page').hidden = true;
                document.getElementById('cphone-sms-detail').hidden = false;
                document.getElementById('cphone-thread-title').textContent = value_231.title;
                document.getElementById('cphone-thread-subtitle').textContent =
                    value_231.kind === 'group' || value_231.kind === 'cphoneGroup'
                        ? value_231.displayCount
                            ? '群聊 · ' + value_231.displayCount + ' 人'
                            : '群聊'
                        : value_231.relationship ||
                          (value_231.kind === 'user' ? '与 User 的聊天' : '关联好友');
                const value_233 = value_231.kind === 'cphoneGroup' || value_231.kind === 'linked';
                document.getElementById('cphone-progress-open').hidden = !value_233;
                document.getElementById('cphone-clear-chat').hidden = !value_233;
                this.fillAvatar(
                    document.getElementById('cphone-thread-avatar'),
                    value_231.avatarUrl,
                    value_231.title,
                );
                this.renderThread();
            },
            currentMessages() {
                const activeThread_237 = this.activeThread,
                    selectedFriend_238 = this.getSelectedFriend();
                if (!activeThread_237 || !selectedFriend_238) return [];
                if (activeThread_237.kind === 'user')
                    return Array.isArray(selectedFriend_238.messages)
                        ? selectedFriend_238.messages.filter(value_5)
                        : [];
                if (activeThread_237.kind === 'group')
                    return (
                        Array.isArray(value_8(activeThread_237.groupId)?.messages)
                            ? value_8(activeThread_237.groupId).messages
                            : []
                    ).filter(value_4);
                if (activeThread_237.kind === 'cphoneGroup')
                    return (
                        this.getCphoneGroups(selectedFriend_238).find(
                            (value_241) =>
                                String(value_241.id) === String(activeThread_237.groupId),
                        )?.messages || []
                    );
                const linkedChats_239 = this.getLinkedChats(selectedFriend_238),
                    value_240 =
                        linkedChats_239.find(
                            (value_242) => String(value_242.id) === String(activeThread_237.chatId),
                        ) ||
                        linkedChats_239.find(
                            (value_243) =>
                                activeThread_237.targetId &&
                                String(value_243.sourceNpcId) === String(activeThread_237.targetId),
                        );
                return Array.isArray(value_240?.messages) ? value_240.messages : [];
            },
            isOwnMessage(message_244, value_245, value_246, value_247) {
                if (value_245.kind === 'user')
                    return message_244?.role === 'assistant' || message_244?.sender === 'char';
                if (value_245.kind === 'linked') return message_244?.role === 'char';
                if (value_245.kind === 'cphoneGroup')
                    return (
                        String(
                            message_244?.speakerMemberId || message_244?.senderMemberId || '',
                        ) === String(value_246.id)
                    );
                if (message_244?.role !== 'assistant') return false;
                if (
                    String(message_244.speakerMemberId || message_244.senderMemberId || '') ===
                    String(value_246.id)
                )
                    return true;
                const groupSpeaker = window.imChat?.normalizeGroupSpeaker?.(
                    value_247?.group || value_8(value_245.groupId),
                    message_244.speaker || message_244.senderName || '',
                    message_244.speakerMemberId || message_244.senderMemberId || '',
                );
                return String(groupSpeaker?.id || '') === String(value_246.id);
            },
            messageSpeaker(message_248, value_249, value_250, value_251, value_252) {
                const name_2 =
                    value_252?.userIdentity?.name || this.getUserIdentity(value_250).name;
                if (value_249.kind === 'user')
                    return value_251
                        ? {
                              key: 'char:' + value_250.id,
                              name: value_6(value_250),
                          }
                        : {
                              key: 'user',
                              name: name_2,
                          };
                if (value_249.kind === 'linked')
                    return value_251
                        ? {
                              key: 'char:' + value_250.id,
                              name: value_6(value_250),
                          }
                        : {
                              key:
                                  'account:' +
                                  (value_249.targetId || value_249.chatId || value_249.title),
                              name: value_249.title || '联系人',
                          };
                if (message_248?.role === 'user')
                    return {
                        key: 'user',
                        name: name_2,
                    };
                if (value_251)
                    return {
                        key: 'char:' + value_250.id,
                        name: value_6(value_250),
                    };
                const string_254 = String(
                        message_248?.speakerMemberId || message_248?.senderMemberId || '',
                    ),
                    value_255 =
                        value_252?.memberNames?.get(string_254) ||
                        (!value_252
                            ? (() => {
                                  const value_257 =
                                          value_249.kind === 'cphoneGroup'
                                              ? this.getCphoneGroups(value_250).find(
                                                    (value_259) =>
                                                        String(value_259.id) ===
                                                        String(value_249.groupId),
                                                )
                                              : value_8(value_249.groupId),
                                      result_258 = (value_257?.members || []).find(
                                          (value_260) =>
                                              String(value_260?.id || value_260) === string_254,
                                      );
                                  return typeof result_258 === 'object'
                                      ? result_258?.nickname || result_258?.name
                                      : '';
                              })()
                            : ''),
                    name_3 =
                        message_248?.speaker ||
                        message_248?.senderName ||
                        value_255 ||
                        value_252?.friendNames?.get(string_254) ||
                        value_8(string_254)?.nickname ||
                        '群成员';
                return {
                    key: string_254 ? 'member:' + string_254 : 'speaker:' + name_3,
                    name: name_3,
                };
            },
            toggleBubbleTranslation(element_261) {
                const groupPrivateChatDetailTranslationElement = element_261?.querySelector(
                    '.group-private-chat-detail-translation',
                );
                if (!groupPrivateChatDetailTranslationElement) return;
                const hidden_262 = groupPrivateChatDetailTranslationElement.hidden;
                groupPrivateChatDetailTranslationElement.hidden = !hidden_262;
                element_261.classList.toggle('is-expanded', hidden_262);
                element_261.setAttribute('aria-expanded', String(hidden_262));
                element_261.title = hidden_262 ? '点击收起翻译' : '点击展开翻译';
            },
            messageRenderSignature(message_263) {
                return JSON.stringify([
                    message_263?.id,
                    message_263?.role,
                    message_263?.sender,
                    message_263?.type,
                    message_263?.description,
                    message_263?.text,
                    message_263?.content,
                    message_263?.transcript,
                    message_263?.translation,
                    message_263?.translationZh,
                    message_263?.trans,
                    message_263?.textTranslationZh,
                    message_263?.speaker,
                    message_263?.senderName,
                    message_263?.speakerMemberId,
                    message_263?.senderMemberId,
                    value_9(message_263),
                ]);
            },
            renderThread() {
                const cphoneSmsMessagesElement = document.getElementById('cphone-sms-messages'),
                    activeThread_264 = this.activeThread,
                    selectedFriend_265 = this.getSelectedFriend();
                if (!cphoneSmsMessagesElement || !activeThread_264 || !selectedFriend_265) return;
                const currentMessages_266 = this.currentMessages(),
                    cphoneClearChatElement = document.getElementById('cphone-clear-chat');
                if (cphoneClearChatElement)
                    cphoneClearChatElement.disabled =
                        !currentMessages_266.length || this.clearing || this.progressing;
                const items_267 = currentMessages_266.every(
                        (value_280, value_281) =>
                            !value_281 ||
                            value_9(currentMessages_266[value_281 - 1]) <= value_9(value_280),
                    )
                        ? currentMessages_266
                        : [...currentMessages_266].sort(
                              (value_282, value_283) => value_9(value_282) - value_9(value_283),
                          ),
                    renderedThreadKey_2 =
                        this.selectedId + ':' + this.progressKey(activeThread_264),
                    renderedMessageCount_269 = this.renderedMessageCount,
                    renderedSignatures_2 = items_267.map((value_284) =>
                        this.messageRenderSignature(value_284),
                    ),
                    value_271 =
                        renderedThreadKey_2 === this.renderedThreadKey &&
                        renderedMessageCount_269 > 0 &&
                        items_267.length > renderedMessageCount_269 &&
                        this.renderedSignatures.every(
                            (value_285, value_286) => value_285 === renderedSignatures_2[value_286],
                        ),
                    scrollTop_2 = cphoneSmsMessagesElement.scrollTop,
                    value_273 =
                        renderedThreadKey_2 !== this.renderedThreadKey ||
                        !Number.isFinite(cphoneSmsMessagesElement.clientHeight) ||
                        cphoneSmsMessagesElement.scrollHeight -
                            cphoneSmsMessagesElement.scrollTop -
                            cphoneSmsMessagesElement.clientHeight <
                            80;
                if (!value_271) cphoneSmsMessagesElement.replaceChildren();
                const documentFragment_274 = document.createDocumentFragment?.(),
                    element_275 = documentFragment_274 || cphoneSmsMessagesElement;
                if (!currentMessages_266.length) {
                    const element_287 = document.createElement('div');
                    element_287.className = 'cphone-sms-empty';
                    element_287.textContent =
                        activeThread_264.kind === 'cphoneGroup' ||
                        activeThread_264.kind === 'linked'
                            ? '还没有消息，点击右上角推进聊天'
                            : '还没有消息';
                    element_275.appendChild(element_287);
                }
                const group_3 =
                        activeThread_264.kind === 'cphoneGroup'
                            ? this.getCphoneGroups(selectedFriend_265).find(
                                  (value_288) =>
                                      String(value_288.id) === String(activeThread_264.groupId),
                              )
                            : activeThread_264.kind === 'group'
                              ? value_8(activeThread_264.groupId)
                              : null,
                    value_277 = group_3
                        ? {
                              group: group_3,
                              userIdentity: this.getUserIdentity(selectedFriend_265),
                              memberNames: new Map(
                                  (group_3.members || []).map((value_289) => [
                                      String(value_289?.id || value_289),
                                      typeof value_289 === 'object'
                                          ? value_289.nickname || value_289.name || ''
                                          : '',
                                  ]),
                              ),
                              friendNames: new Map(
                                  (window.imData?.friends || []).map((value_290) => [
                                      String(value_290.id),
                                      value_290.nickname || '',
                                  ]),
                              ),
                          }
                        : {
                              userIdentity: this.getUserIdentity(selectedFriend_265),
                          };
                let renderedLastSpeakerKey_2 = value_271 ? this.renderedLastSpeakerKey : '',
                    renderedLastTime_2 = value_271 ? this.renderedLastTime : 0;
                for (
                    let value_291 = value_271 ? renderedMessageCount_269 : 0;
                    value_291 < items_267.length;
                    value_291++
                ) {
                    const value_292 = items_267[value_291],
                        isOwnMessage_293 = this.isOwnMessage(
                            value_292,
                            activeThread_264,
                            selectedFriend_265,
                            value_277,
                        ),
                        messageSpeaker_294 = this.messageSpeaker(
                            value_292,
                            activeThread_264,
                            selectedFriend_265,
                            isOwnMessage_293,
                            value_277,
                        ),
                        value_9_295 = value_9(value_292);
                    if (
                        value_9_295 &&
                        (value_291 === 0 ||
                            (renderedLastTime_2 && value_9_295 - renderedLastTime_2 > 300000))
                    ) {
                        const element_301 = document.createElement('div');
                        element_301.className = 'group-private-chat-detail-time-chip';
                        element_301.textContent = this.messageChipTime(value_9_295);
                        element_275.appendChild(element_301);
                    }
                    const value_296 =
                            value_291 === 0 || renderedLastSpeakerKey_2 !== messageSpeaker_294.key,
                        element_297 = document.createElement('div');
                    element_297.className =
                        'group-private-chat-detail-row' +
                        (isOwnMessage_293 ? ' is-sender' : '') +
                        (value_296 ? ' is-group-start' : '');
                    if (value_296) {
                        const element_302 = document.createElement('small');
                        element_302.className = 'group-private-chat-detail-name';
                        element_302.textContent = messageSpeaker_294.name;
                        element_297.appendChild(element_302);
                    }
                    const textContent_2 = String(
                            value_292.translation ||
                                value_292.translationZh ||
                                value_292.trans ||
                                value_292.textTranslationZh ||
                                '',
                        ).trim(),
                        element_299 = document.createElement(textContent_2 ? 'button' : 'div');
                    element_299.className =
                        'group-private-chat-detail-bubble' +
                        (textContent_2 ? ' has-translation' : '');
                    textContent_2 &&
                        ((element_299.type = 'button'),
                        element_299.setAttribute('aria-expanded', 'false'),
                        (element_299.title = '点击展开翻译'));
                    const element_300 = document.createElement('span');
                    element_300.className = 'group-private-chat-detail-original';
                    element_300.textContent = this.messageText(value_292);
                    element_299.appendChild(element_300);
                    if (textContent_2) {
                        const element_303 = document.createElement('span');
                        element_303.className = 'group-private-chat-detail-translation';
                        element_303.textContent = textContent_2;
                        element_303.hidden = true;
                        element_299.appendChild(element_303);
                    }
                    element_297.appendChild(element_299);
                    element_275.appendChild(element_297);
                    renderedLastSpeakerKey_2 = messageSpeaker_294.key;
                    renderedLastTime_2 = value_9_295;
                }
                if (documentFragment_274)
                    cphoneSmsMessagesElement.appendChild(documentFragment_274);
                this.renderedThreadKey = renderedThreadKey_2;
                this.renderedMessageCount = items_267.length;
                this.renderedSignatures = renderedSignatures_2;
                this.renderedLastSpeakerKey = renderedLastSpeakerKey_2;
                this.renderedLastTime = renderedLastTime_2;
                if (value_273)
                    cphoneSmsMessagesElement.scrollTop = cphoneSmsMessagesElement.scrollHeight;
                else {
                    if (!value_271) cphoneSmsMessagesElement.scrollTop = scrollTop_2;
                }
            },
            refreshMessages() {
                if (!this.smsView?.classList.contains('active')) return;
                if (this.activeThread) this.renderThread();
                else this.renderList();
            },
            openCreateGroup() {
                if (!this.getSelectedFriend() || this.creatingGroup) return;
                const cphoneCreateGroupFormElement = document.getElementById(
                        'cphone-create-group-form',
                    ),
                    cphoneCreateGroupSheetElement = document.getElementById(
                        'cphone-create-group-sheet',
                    );
                if (!cphoneCreateGroupFormElement || !cphoneCreateGroupSheetElement) return;
                cphoneCreateGroupFormElement.reset();
                const cphoneCreateGroupErrorElement = document.getElementById(
                    'cphone-create-group-error',
                );
                cphoneCreateGroupErrorElement &&
                    ((cphoneCreateGroupErrorElement.textContent = ''),
                    (cphoneCreateGroupErrorElement.hidden = true));
                cphoneCreateGroupSheetElement.hidden = false;
                document.getElementById('cphone-create-group-name')?.focus();
            },
            closeCreateGroup() {
                if (this.creatingGroup) return;
                const cphoneCreateGroupSheetElement_304 = document.getElementById(
                    'cphone-create-group-sheet',
                );
                this.blurActiveWithin(cphoneCreateGroupSheetElement_304);
                if (cphoneCreateGroupSheetElement_304)
                    cphoneCreateGroupSheetElement_304.hidden = true;
            },
            buildGroupGenerationPrompt(contact_305, value_306, value_307) {
                return (
                    '你要为 ' +
                    value_6(contact_305) +
                    ' 创建一个真实自然的私人群聊。群名：' +
                    value_306 +
                    '。群聊用途（只给 AI 看，不要写进聊天消息）：' +
                    value_307 +
                    `。
当前 Char 的人设：` +
                    String(contact_305.persona || contact_305.signature || '未设置').slice(
                        0,
                        5000,
                    ) +
                    `。
User 从未加入这个群，不能发言，也不能被当作群成员。群里除当前 Char 外，创造 2 到 8 名身份各异的陌生成员；他们与 Char 可以认识，但不要把他们创建为 Char 的通讯录好友。语言以 Char 的 ` +
                    (contact_305.language || 'zh') +
                    ` 设置为主，非中文消息填写自然中文 translation。
请一次性写出准确 10 轮连续群聊。每轮是一个承接上轮的对话单元，包含 2 到 5 条不同成员接话的短消息；每轮至少两位不同成员发言，当前 Char 至少发言一次。避免整齐轮流、重复话题和旁白。
只返回合法 JSON，不要 Markdown 或说明。格式：{"members":[{"slot":"s1","name":"姓名","persona":"性格和与群的关系"}],"rounds":[[{"speaker":"char","text":"消息","translation":""},{"speaker":"s1","text":"消息","translation":""}]]}。members 必须 2-8 项，slot 按 s1、s2 递增；rounds 必须恰好 10 项；speaker 只能是 char 或 members 中的 slot。`
                );
            },
            async requestGroupGeneration(value_308, value_309, value_310) {
                return this.requestJsonGeneration(
                    this.buildGroupGenerationPrompt(value_308, value_309, value_310),
                );
            },
            async requestJsonGeneration(content_2) {
                const value_312 = window.getApiConfig?.() || window.apiConfig || {};
                if (!value_312.endpoint || !value_312.apiKey)
                    throw new Error('请先在系统设置中配置 API');
                const chatCompletionsEndpoint = window.u2Api?.resolveChatCompletionsEndpoint?.(
                    value_312.endpoint,
                );
                if (!chatCompletionsEndpoint) throw new Error('API 地址无效');
                const value_313 = await fetch(chatCompletionsEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + value_312.apiKey,
                    },
                    body: JSON.stringify({
                        model: value_312.model || 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: '你是群聊数据生成助手。只输出严格合法的 JSON。',
                            },
                            {
                                role: 'user',
                                content: content_2,
                            },
                        ],
                        temperature: 0.85,
                    }),
                });
                if (!value_313.ok) {
                    const value_317 = await window.u2Api?.readApiError?.(value_313);
                    throw (
                        window.u2Api?.createHttpError?.(value_313, value_317) ||
                        Object.assign(new Error('生成失败（HTTP ' + value_313.status + '）'), {
                            status: value_313.status,
                        })
                    );
                }
                const value_314 = await value_313.json(),
                    content_315 = value_314?.choices?.[0]?.message?.content;
                if (typeof content_315 !== 'string') throw new Error('API 未返回聊天内容');
                const replace_316 = content_315
                    .trim()
                    .replace(/^```(?:json)?\s*/i, '')
                    .replace(/\s*```$/, '');
                try {
                    return JSON.parse(replace_316);
                } catch (value_318) {
                    throw new Error('AI 返回的聊天格式无效，请重试');
                }
            },
            normalizeGroupGeneration(value_319, value_320, value_321) {
                const members_322 = value_319?.members,
                    rounds_323 = value_319?.rounds;
                if (
                    !Array.isArray(members_322) ||
                    members_322.length < 2 ||
                    members_322.length > 8 ||
                    !Array.isArray(rounds_323) ||
                    rounds_323.length !== 10
                )
                    throw new Error('AI 未生成 2–8 名成员和准确 10 轮聊天，请重试');
                const value_324 = (value_330) =>
                        String(value_330 || '')
                            .replace(/[<>&"'`\u0000-\u001f]/g, '')
                            .trim(),
                    value_325 = new Map([
                        [
                            'char',
                            {
                                id: String(value_320.id),
                                nickname: value_6(value_320),
                                avatarUrl: value_320.avatarUrl || '',
                            },
                        ],
                    ]),
                    members_2 = members_322.map((contact_331, value_332) => {
                        const value_324_333 = value_324(contact_331?.slot),
                            nickname_2 = value_324(contact_331?.name).slice(0, 40);
                        if (
                            value_324_333 !== 's' + (value_332 + 1) ||
                            !nickname_2 ||
                            nickname_2 === value_6(value_320) ||
                            [...value_325.values()].some(
                                (value_336) => value_336.nickname === nickname_2,
                            )
                        )
                            throw new Error('AI 生成的群成员资料无效，请重试');
                        const options_335 = {
                            id: value_321 + '-member-' + (value_332 + 1),
                            nickname: nickname_2,
                            persona: value_324(contact_331?.persona).slice(0, 800),
                            language: value_320.language || 'zh',
                            avatarUrl: '',
                        };
                        return (value_325.set(value_324_333, options_335), options_335);
                    }),
                    messages_5 = [];
                let enabled = false;
                const value_328 = new Set();
                rounds_323.forEach((items_337, value_338) => {
                    if (!Array.isArray(items_337) || items_337.length < 2 || items_337.length > 5)
                        throw new Error('AI 生成的对话轮次无效，请重试');
                    const value_339 = new Set();
                    items_337.forEach((value_340) => {
                        const value_324_341 = value_324(value_340?.speaker),
                            result_342 = value_325.get(value_324_341),
                            content_3 = String(value_340?.text || '')
                                .replace(/[<>\u0000-\u001f]/g, '')
                                .trim();
                        if (!result_342 || !content_3 || content_3.length > 1000)
                            throw new Error('AI 生成的消息无效，请重试');
                        value_339.add(value_324_341);
                        value_328.add(value_324_341);
                        if (value_324_341 === 'char') enabled = true;
                        const options_344 = {
                                id: value_7('cphone-group-msg'),
                                role: 'assistant',
                                type: 'text',
                                content: content_3,
                                timestamp: 0,
                                round: value_338 + 1,
                                speakerMemberId: result_342.id,
                                speaker: result_342.nickname,
                                senderName: result_342.nickname,
                                senderAvatarUrl: result_342.avatarUrl || '',
                                source: 'cphone_generated_group',
                            },
                            trim_345 = String(value_340?.translation || '')
                                .replace(/[<>\u0000-\u001f]/g, '')
                                .trim();
                        if (trim_345) options_344.translation = trim_345.slice(0, 2000);
                        messages_5.push(options_344);
                    });
                    if (value_339.size < 2) throw new Error('每轮群聊需要不同成员接话，请重试');
                });
                if (!enabled) throw new Error('生成的群聊缺少当前 Char 发言，请重试');
                if (members_2.some((value_346, value_347) => !value_328.has('s' + (value_347 + 1))))
                    throw new Error('生成的群聊存在未发言成员，请重试');
                const createdAt_2 = Date.now() - messages_5.length * 1000;
                return (
                    messages_5.forEach((message_348, value_349) => {
                        message_348.timestamp = createdAt_2 + value_349 * 1000;
                    }),
                    {
                        members: members_2,
                        messages: messages_5,
                        createdAt: createdAt_2,
                    }
                );
            },
            async createGroup() {
                if (this.creatingGroup) return false;
                const selectedFriend_350 = this.getSelectedFriend(),
                    trim_351 = String(
                        document.getElementById('cphone-create-group-name')?.value || '',
                    ).trim(),
                    title_2 = trim_351.replace(/[<>&"'`]/g, '').trim(),
                    purpose_2 = String(
                        document.getElementById('cphone-create-group-purpose')?.value || '',
                    ).trim(),
                    trim_354 = String(
                        document.getElementById('cphone-create-group-count')?.value || '',
                    ).trim(),
                    displayCount_2 = Number(trim_354),
                    cphoneCreateGroupErrorElement_355 = document.getElementById(
                        'cphone-create-group-error',
                    ),
                    cphoneCreateGroupSubmitElement = document.getElementById(
                        'cphone-create-group-submit',
                    );
                if (
                    !selectedFriend_350 ||
                    !title_2 ||
                    title_2 !== trim_351 ||
                    title_2.length > 40 ||
                    !purpose_2 ||
                    purpose_2.length > 2000 ||
                    !trim_354 ||
                    !Number.isInteger(displayCount_2) ||
                    displayCount_2 < 1 ||
                    displayCount_2 > 9999
                )
                    return (
                        cphoneCreateGroupErrorElement_355 &&
                            ((cphoneCreateGroupErrorElement_355.textContent =
                                '请填写有效群名（不含 HTML 符号）、1–9999 的展示人数和用途'),
                            (cphoneCreateGroupErrorElement_355.hidden = false)),
                        false
                    );
                this.creatingGroup = true;
                cphoneCreateGroupSubmitElement &&
                    ((cphoneCreateGroupSubmitElement.disabled = true),
                    (cphoneCreateGroupSubmitElement.textContent = '正在生成群聊…'));
                cphoneCreateGroupErrorElement_355 &&
                    ((cphoneCreateGroupErrorElement_355.textContent = ''),
                    (cphoneCreateGroupErrorElement_355.hidden = true));
                try {
                    const value_356 = await this.requestGroupGeneration(
                            selectedFriend_350,
                            title_2,
                            purpose_2,
                        ),
                        id_2 = value_7('cphone-group'),
                        groupGeneration = this.normalizeGroupGeneration(
                            value_356,
                            selectedFriend_350,
                            id_2,
                        );
                    if (
                        !value_8(selectedFriend_350.id) ||
                        this.selectedId !== String(selectedFriend_350.id)
                    )
                        throw new Error('当前 Char 已变化，请重试');
                    const options_358 = {
                        id: id_2,
                        title: title_2,
                        displayCount: displayCount_2,
                        purpose: purpose_2,
                        members: groupGeneration.members,
                        messages: groupGeneration.messages,
                        createdAt: groupGeneration.createdAt,
                        updatedAt: value_9(groupGeneration.messages.at(-1)),
                    };
                    await this.saveCphoneGroups(selectedFriend_350.id, (items_360) => {
                        if (
                            !value_8(selectedFriend_350.id) ||
                            this.selectedId !== String(selectedFriend_350.id)
                        )
                            throw new Error('当前 Char 已变化，请重试');
                        items_360.push(options_358);
                    });
                    this.creatingGroup = false;
                    this.closeCreateGroup();
                    this.tab = 'threads';
                    this.renderList();
                    const result_359 = this.getThreadRows(this.getSelectedFriend()).find(
                        (value_361) =>
                            value_361.kind === 'cphoneGroup' &&
                            value_361.groupId === String(options_358.id),
                    );
                    if (result_359) await this.openThread(result_359);
                    return true;
                } catch (value_362) {
                    if (
                        window.u2Api?.isRequestError?.(value_362) &&
                        window.u2Api.reportError(value_362, {
                            operation: '群聊生成',
                        })
                    ) {
                        if (cphoneCreateGroupErrorElement_355)
                            cphoneCreateGroupErrorElement_355.hidden = true;
                    } else
                        cphoneCreateGroupErrorElement_355 &&
                            ((cphoneCreateGroupErrorElement_355.textContent =
                                value_362?.message || '群聊生成失败，请重试'),
                            (cphoneCreateGroupErrorElement_355.hidden = false));
                    return false;
                } finally {
                    this.creatingGroup = false;
                    cphoneCreateGroupSubmitElement &&
                        ((cphoneCreateGroupSubmitElement.disabled = false),
                        (cphoneCreateGroupSubmitElement.textContent = '生成 10 轮群聊'));
                }
            },
            progressKey(value_363) {
                return (
                    (value_363?.kind || '') +
                    ':' +
                    (value_363?.groupId ||
                        value_363?.chatId ||
                        value_363?.targetId ||
                        value_363?.title ||
                        '')
                );
            },
            progressMarker(value_364) {
                const value_365 = Array.isArray(value_364) ? value_364 : [],
                    at_366 = value_365.at(-1);
                return (
                    value_365.length +
                    ':' +
                    (at_366?.id || '') +
                    ':' +
                    value_9(at_366) +
                    ':' +
                    this.messageText(at_366)
                );
            },
            openProgress() {
                const activeThread_367 = this.activeThread;
                if (
                    this.progressing ||
                    this.clearing ||
                    !activeThread_367 ||
                    (activeThread_367.kind !== 'cphoneGroup' && activeThread_367.kind !== 'linked')
                )
                    return;
                const cphoneProgressFormElement = document.getElementById('cphone-progress-form'),
                    cphoneProgressSheetElement = document.getElementById('cphone-progress-sheet');
                if (!cphoneProgressFormElement || !cphoneProgressSheetElement) return;
                cphoneProgressFormElement.reset();
                const cphoneProgressRoundsElement =
                    document.getElementById('cphone-progress-rounds');
                if (cphoneProgressRoundsElement) cphoneProgressRoundsElement.value = '10';
                const cphoneProgressErrorElement = document.getElementById('cphone-progress-error');
                cphoneProgressErrorElement &&
                    ((cphoneProgressErrorElement.hidden = true),
                    (cphoneProgressErrorElement.textContent = ''));
                cphoneProgressSheetElement.hidden = false;
                cphoneProgressRoundsElement?.focus();
            },
            closeProgress(value_368 = false) {
                if (this.progressing && !value_368) return;
                const cphoneProgressSheetElement_369 =
                    document.getElementById('cphone-progress-sheet');
                this.blurActiveWithin(cphoneProgressSheetElement_369);
                if (cphoneProgressSheetElement_369) cphoneProgressSheetElement_369.hidden = true;
            },
            getProgressCharacters(value_370, value_371, value_372, value_373) {
                const items_374 = [value_370];
                if (value_371.kind === 'cphoneGroup')
                    (value_372.members || []).forEach((value_375) => {
                        const value_8_376 = value_8(value_375?.id);
                        if (
                            value_8_376?.type === 'char' &&
                            String(value_8_376.id) !== String(value_370.id)
                        )
                            items_374.push(value_8_376);
                    });
                else
                    value_373?.type === 'char' &&
                        String(value_373.id) !== String(value_370.id) &&
                        items_374.push(value_373);
                return [
                    ...new Map(
                        items_374.map((value_377) => [String(value_377.id), value_377]),
                    ).values(),
                ];
            },
            getCharUserMemory(value_378) {
                return (Array.isArray(value_378.messages) ? value_378.messages : [])
                    .filter(
                        (message_379) =>
                            (message_379?.role === 'user' || message_379?.role === 'assistant') &&
                            message_379.excludedFromContext !== true &&
                            !message_379.noticeKind &&
                            this.messageText(message_379) !== '[消息]',
                    )
                    .slice(-20)
                    .map((message_380) => ({
                        speaker: message_380.role === 'user' ? 'User' : value_6(value_378),
                        text: this.messageText(message_380).slice(0, 2000),
                        translation: String(message_380.translation || '').slice(0, 1000),
                    }));
            },
            getProgressWorldBooks(items_381, value_382, value_383) {
                const items_384 = ['system_depth', 'before_role', 'after_role'];
                return items_384
                    .map((value_385) => {
                        const items_386 = [],
                            globalWorldBookContextByPosition =
                                window.getGlobalWorldBookContextByPosition?.(value_385, value_382);
                        if (globalWorldBookContextByPosition)
                            items_386.push(
                                '【共用世界书 · ' +
                                    value_385 +
                                    `】
` +
                                    globalWorldBookContextByPosition,
                            );
                        return (
                            items_381.forEach((value_387) => {
                                const value_388 =
                                        value_382 +
                                        `
` +
                                        (value_383.get(String(value_387.id)) || []).map(
                                            (value_389) => value_389.text,
                                        ).join(`
`),
                                    worldBookContextForFriendByPosition =
                                        window.imApp?.getWorldBookContextForFriendByPosition?.(
                                            value_385,
                                            value_387,
                                            value_388,
                                            {
                                                includeGlobal: false,
                                            },
                                        );
                                if (worldBookContextForFriendByPosition)
                                    items_386.push(
                                        '【' +
                                            value_6(value_387) +
                                            '（' +
                                            value_387.id +
                                            '）绑定世界书 · ' +
                                            value_385 +
                                            `｜仅该 Char 可知】
` +
                                            worldBookContextForFriendByPosition,
                                    );
                            }),
                            items_386.join(`

`)
                        );
                    })
                    .filter(Boolean).join(`

`);
            },
            buildProgressPrompt(
                value_390,
                contact_391,
                value_392,
                contact_393,
                value_394,
                value_395,
                value_396,
                items_397 = [value_390],
            ) {
                const value_398 = new Map(
                        items_397.map((value_404) => [
                            String(value_404.id),
                            this.getCharUserMemory(value_404),
                        ]),
                    ),
                    map_399 = (Array.isArray(value_396) ? value_396 : [])
                        .slice(-20)
                        .map((message_405) => ({
                            speaker:
                                contact_391.kind === 'cphoneGroup'
                                    ? String(
                                          message_405.speakerMemberId || message_405.speaker || '',
                                      )
                                    : message_405.role === 'char'
                                      ? 'char'
                                      : 'account',
                            text: this.messageText(message_405).slice(0, 2000),
                            translation: String(message_405.translation || '').slice(0, 1000),
                        })),
                    join_400 = [
                        value_395,
                        contact_391.title,
                        value_392?.purpose,
                        ...map_399.map((value_406) => value_406.text),
                    ].filter(Boolean).join(`
`),
                    progressWorldBooks = this.getProgressWorldBooks(items_397, join_400, value_398),
                    map_401 = items_397.map((contact_407) => ({
                        id: String(contact_407.id),
                        name: value_6(contact_407),
                        persona: String(
                            contact_407.persona || contact_407.signature || '未设置',
                        ).slice(0, 5000),
                    })),
                    map_402 = items_397.map((value_408) => ({
                        charId: String(value_408.id),
                        charName: value_6(value_408),
                        userChat: value_398.get(String(value_408.id)),
                    })),
                    value_403 =
                        '你要续写 ' +
                        value_6(value_390) +
                        ' 手机里的真实聊天。只返回严格合法 JSON，不要说明或 Markdown。准确生成 ' +
                        value_394 +
                        ' 轮。聊天方向：' +
                        (value_395 || '自行选择自然的发展方向') +
                        `。
参与的 Char 人设：` +
                        JSON.stringify(map_401) +
                        `。
以下每位 Char 与 User 的最近 20 条私聊、以及其绑定世界书，分别只属于标注的 Char 的私人记忆；其他角色默认不知道内容，除非该 Char 在当前会话中自然透露。不得让 User 参与当前会话或代 User 发言。
各 Char 私人记忆：` +
                        JSON.stringify(map_402) +
                        `
世界书：` +
                        (progressWorldBooks || '无') +
                        `
当前会话最近消息：` +
                        JSON.stringify(map_399) +
                        `
非中文消息请提供自然中文 translation；中文消息的 translation 留空。每条消息 text 不超过 1000 字。`;
                if (contact_391.kind === 'cphoneGroup') {
                    const map_409 = (value_392.members || []).map((contact_410, value_411) => ({
                        slot: 'm' + (value_411 + 1),
                        id: contact_410.id,
                        name: contact_410.nickname,
                        persona: contact_410.persona || '',
                    }));
                    return (
                        value_403 +
                        `
群名：` +
                        value_392.title +
                        '。群聊用途（只供 AI 参考，不写入消息）：' +
                        (value_392.purpose || '未设置') +
                        '。成员：' +
                        JSON.stringify([
                            {
                                slot: 'char',
                                id: value_390.id,
                                name: value_6(value_390),
                            },
                            ...map_409,
                        ]) +
                        `。沿用这些成员，不得新增成员。每轮 2 到 5 条消息，至少两位不同成员发言，整批至少包含一次 Char 发言。
格式：{"rounds":[[{"speaker":"char","text":"原文","translation":""},{"speaker":"m1","text":"原文","translation":""}]]}。speaker 只能为 char 或列出的 m 序号，rounds 必须恰好 ` +
                        value_394 +
                        ' 项。'
                    );
                }
                return (
                    value_403 +
                    `
联系人：` +
                    JSON.stringify({
                        name: contact_391.title,
                        relationship: contact_391.relationship || contact_393?.relationship || '',
                        persona: contact_391.persona || contact_393?.persona || '',
                    }) +
                    `。每轮 2 到 5 条消息，Char 与联系人双方都必须发言，顺序自然。
格式：{"rounds":[[{"speaker":"char","text":"原文","translation":""},{"speaker":"account","text":"原文","translation":""}]]}。speaker 只能为 char 或 account，rounds 必须恰好 ` +
                    value_394 +
                    ' 项。'
                );
            },
            normalizeProgressRounds(value_412, value_413, value_414, value_415) {
                if (!Array.isArray(value_412?.rounds) || value_412.rounds.length !== value_415)
                    throw new Error('AI 未生成准确 ' + value_415 + ' 轮聊天，请重试');
                const value_416 =
                    value_413.kind === 'cphoneGroup'
                        ? new Set([
                              'char',
                              ...(value_414.members || []).map(
                                  (value_420, value_421) => 'm' + (value_421 + 1),
                              ),
                          ])
                        : new Set(['char', 'account']);
                let enabled_417 = false;
                const value_418 = (value_422) =>
                        String(value_422 || '')
                            .replace(/[<>\u0000-\u001f]/g, '')
                            .trim(),
                    map_419 = value_412.rounds.map((items_423, value_424) => {
                        if (
                            !Array.isArray(items_423) ||
                            items_423.length < 2 ||
                            items_423.length > 5
                        )
                            throw new Error('AI 返回的对话轮次无效，请重试');
                        const value_425 = new Set(),
                            map_426 = items_423.map((value_427) => {
                                const speaker_2 = String(value_427?.speaker || '').trim(),
                                    text_3 = value_418(value_427?.text);
                                if (!value_416.has(speaker_2) || !text_3 || text_3.length > 1000)
                                    throw new Error('AI 返回的消息或发送者无效，请重试');
                                value_425.add(speaker_2);
                                if (speaker_2 === 'char') enabled_417 = true;
                                return {
                                    speaker: speaker_2,
                                    text: text_3,
                                    translation: value_418(value_427?.translation).slice(0, 2000),
                                    round: value_424 + 1,
                                };
                            });
                        if (
                            value_413.kind === 'cphoneGroup'
                                ? value_425.size < 2
                                : !value_425.has('char') || !value_425.has('account')
                        )
                            throw new Error('每轮需要不同成员接话，请重试');
                        return map_426;
                    });
                if (!enabled_417) throw new Error('生成内容缺少 Char 发言，请重试');
                return map_419.flat();
            },
            materializeProgress(items_430, value_431, value_432, value_433, value_434) {
                const value_435 = Array.isArray(value_431) ? value_431 : [],
                    reduce_436 = value_435.reduce(
                        (value_438, value_439) => Math.max(value_438, Number(value_439.round) || 0),
                        0,
                    ),
                    max_437 = Math.max(Date.now(), value_9(value_435.at(-1)) + 1);
                return items_430.map((value_440, value_441) => {
                    const options_442 = {
                        id: value_7('cphone-progress-msg'),
                        timestamp: max_437 + value_441,
                        round: reduce_436 + value_440.round,
                        translation: value_440.translation,
                    };
                    if (value_432.kind === 'cphoneGroup') {
                        const value_443 =
                            value_440.speaker === 'char'
                                ? value_433
                                : value_434.members[Number(value_440.speaker.slice(1)) - 1];
                        return {
                            ...options_442,
                            role: 'assistant',
                            type: 'text',
                            content: value_440.text,
                            speakerMemberId: value_443.id,
                            speaker: value_6(value_443),
                            senderName: value_6(value_443),
                            source: 'cphone_progress',
                        };
                    }
                    return {
                        ...options_442,
                        role: value_440.speaker === 'char' ? 'char' : 'account',
                        text: value_440.text,
                    };
                });
            },
            appendLinkedProgress(value_444, value_445, contact_446, items_447, value_448 = false) {
                value_444.linkedAccountChats = window.imApp?.normalizeLinkedAccountChats
                    ? window.imApp.normalizeLinkedAccountChats(value_444.linkedAccountChats)
                    : Array.isArray(value_444.linkedAccountChats)
                      ? value_444.linkedAccountChats
                      : [];
                const sourceNpcId_2 = String(value_445?.id || contact_446.targetId || '');
                let result_450 = value_444.linkedAccountChats.find(
                    (value_451) =>
                        contact_446.chatId && String(value_451.id) === String(contact_446.chatId),
                );
                if (!result_450 && sourceNpcId_2)
                    result_450 = value_444.linkedAccountChats.find(
                        (value_452) => String(value_452.sourceNpcId || '') === sourceNpcId_2,
                    );
                if (!result_450) {
                    const value_453 = value_445 ? value_6(value_445) : contact_446.title;
                    result_450 = {
                        id: value_7('linked-chat'),
                        name: value_453,
                        realName: value_445?.realName || value_453,
                        remark: value_453,
                        relationship: contact_446.relationship || '',
                        persona: contact_446.persona || '',
                        sourceNpcId: sourceNpcId_2,
                        messages: [],
                        createdAt: items_447[0].timestamp,
                        updatedAt: items_447.at(-1).timestamp,
                        readAt: 0,
                    };
                    value_444.linkedAccountChats.unshift(result_450);
                }
                if (sourceNpcId_2 && !result_450.sourceNpcId)
                    result_450.sourceNpcId = sourceNpcId_2;
                return (
                    (result_450.messages = Array.isArray(result_450.messages)
                        ? result_450.messages
                        : []),
                    result_450.messages.push(
                        ...items_447.map((message_454) => ({
                            ...message_454,
                            role: value_448
                                ? message_454.role === 'char'
                                    ? 'account'
                                    : 'char'
                                : message_454.role,
                        })),
                    ),
                    (result_450.updatedAt = items_447.at(-1).timestamp),
                    result_450.id
                );
            },
            async saveLinkedProgress(value_455, value_456, value_457, value_458, value_459 = '') {
                const result_460 = this.getLinkedChats(value_455).find(
                        (value_465) => String(value_465.id) === String(value_456.chatId),
                    ),
                    value_461 = value_456.targetId || result_460?.sourceNpcId || '',
                    value_462 = value_461 ? value_8(value_461) : null;
                let chatId_2 = '';
                if (value_462?.type === 'char' && String(value_462.id) !== String(value_455.id)) {
                    const value_466 = await window.imApp?.commitFriendsChange?.(
                        () => {
                            const value_8_467 = value_8(value_455.id),
                                value_8_468 = value_8(value_462.id);
                            if (!value_8_467 || !value_8_468) throw new Error('角色不存在');
                            if (
                                this.selectedId !== String(value_455.id) ||
                                this.progressKey(this.activeThread) !== this.progressKey(value_456)
                            )
                                throw new Error('当前 Char 或会话已变化');
                            const value_469 =
                                this.getLinkedChats(value_8_467).find(
                                    (value_473) =>
                                        String(value_473.id) === String(value_456.chatId),
                                ) ||
                                this.getLinkedChats(value_8_467).find(
                                    (value_474) =>
                                        value_461 &&
                                        String(value_474.sourceNpcId) === String(value_461),
                                );
                            if (this.progressMarker(value_469?.messages) !== value_458)
                                throw new Error('会话已更新，请重试');
                            const result_470 = this.getLinkedChats(value_8_468).find(
                                (value_475) =>
                                    String(value_475.sourceNpcId || '') === String(value_8_467.id),
                            );
                            if (this.progressMarker(result_470?.messages) !== value_459)
                                throw new Error('对方会话已更新，请重试');
                            const sort_471 = [
                                    ...(value_469?.messages || []),
                                    ...(result_470?.messages || []),
                                ].sort(
                                    (value_476, value_477) =>
                                        value_9(value_476) - value_9(value_477),
                                ),
                                materializeProgress_472 = this.materializeProgress(
                                    value_457,
                                    sort_471,
                                    value_456,
                                    value_8_467,
                                );
                            chatId_2 = this.appendLinkedProgress(
                                value_8_467,
                                value_8_468,
                                value_456,
                                materializeProgress_472,
                            );
                            this.appendLinkedProgress(
                                value_8_468,
                                value_8_467,
                                {
                                    title: value_6(value_8_467),
                                    targetId: String(value_8_467.id),
                                },
                                materializeProgress_472,
                                true,
                            );
                        },
                        {
                            friendIds: [value_455.id, value_462.id],
                            silent: true,
                        },
                    );
                    if (!value_466) return false;
                    window.dispatchEvent(
                        new CustomEvent('u2:linked-accounts-changed', {
                            detail: {
                                friendId: String(value_462.id),
                                changedCount: value_457.length,
                            },
                        }),
                    );
                } else {
                    const value_478 = await window.imApp?.commitFriendChange?.(
                        value_455.id,
                        (value_479) => {
                            if (!value_479) throw new Error('角色不存在');
                            if (
                                this.selectedId !== String(value_455.id) ||
                                this.progressKey(this.activeThread) !== this.progressKey(value_456)
                            )
                                throw new Error('当前 Char 或会话已变化');
                            const value_480 =
                                this.getLinkedChats(value_479).find(
                                    (value_482) =>
                                        String(value_482.id) === String(value_456.chatId),
                                ) ||
                                this.getLinkedChats(value_479).find(
                                    (value_483) =>
                                        value_461 &&
                                        String(value_483.sourceNpcId) === String(value_461),
                                );
                            if (this.progressMarker(value_480?.messages) !== value_458)
                                throw new Error('会话已更新，请重试');
                            const materializeProgress_481 = this.materializeProgress(
                                value_457,
                                value_480?.messages,
                                value_456,
                                value_479,
                            );
                            chatId_2 = this.appendLinkedProgress(
                                value_479,
                                value_462,
                                value_456,
                                materializeProgress_481,
                            );
                        },
                        {
                            silent: true,
                            metaOnly: true,
                        },
                    );
                    if (!value_478) return false;
                }
                const progressKey_464 = this.progressKey(value_456);
                value_456.chatId = chatId_2;
                if (this.activeThread && this.progressKey(this.activeThread) === progressKey_464)
                    this.activeThread.chatId = chatId_2;
                return (
                    window.dispatchEvent(
                        new CustomEvent('u2:linked-accounts-changed', {
                            detail: {
                                friendId: String(value_455.id),
                                changedCount: value_457.length,
                            },
                        }),
                    ),
                    window.imApp?.requestChatsListRefresh?.(),
                    true
                );
            },
            async clearThread() {
                if (this.clearing || this.progressing || !this.activeThread) return false;
                const selectedFriend_484 = this.getSelectedFriend(),
                    options_485 = {
                        ...this.activeThread,
                    };
                if (
                    !selectedFriend_484 ||
                    (options_485.kind !== 'cphoneGroup' && options_485.kind !== 'linked') ||
                    !this.currentMessages().length
                )
                    return false;
                const value_486 =
                        options_485.kind === 'linked'
                            ? this.getLinkedChats(selectedFriend_484).find(
                                  (value_491) =>
                                      String(value_491.id) === String(options_485.chatId),
                              )
                            : null,
                    value_487 = options_485.targetId || value_486?.sourceNpcId || '',
                    value_488 = value_487 ? value_8(value_487) : null,
                    value_489 =
                        value_488?.type === 'char' &&
                        String(value_488.id) !== String(selectedFriend_484.id)
                            ? '确定清空当前聊天记录吗？对方 Char 手机中的对应聊天也会清空，此操作无法撤销。'
                            : '确定清空当前聊天记录吗？此操作无法撤销。';
                if (typeof window.confirm !== 'function' || !window.confirm(value_489))
                    return false;
                this.clearing = true;
                const cphoneClearChatElement_490 = document.getElementById('cphone-clear-chat'),
                    cphoneProgressOpenElement = document.getElementById('cphone-progress-open');
                if (cphoneClearChatElement_490) cphoneClearChatElement_490.disabled = true;
                if (cphoneProgressOpenElement) cphoneProgressOpenElement.disabled = true;
                try {
                    const value_492 = () =>
                        this.selectedId === String(selectedFriend_484.id) &&
                        this.progressKey(this.activeThread) === this.progressKey(options_485);
                    if (options_485.kind === 'cphoneGroup')
                        await this.saveCphoneGroups(selectedFriend_484.id, (value_493) => {
                            if (!value_492()) throw new Error('当前 Char 或会话已变化');
                            const result_494 = value_493.find(
                                (value_495) => String(value_495.id) === String(options_485.groupId),
                            );
                            if (!result_494) throw new Error('群聊不存在');
                            result_494.messages = [];
                            result_494.updatedAt = Date.now();
                        });
                    else {
                        if (
                            value_488?.type === 'char' &&
                            String(value_488.id) !== String(selectedFriend_484.id)
                        ) {
                            const value_496 = await window.imApp?.commitFriendsChange?.(
                                () => {
                                    if (!value_492()) throw new Error('当前 Char 或会话已变化');
                                    const value_8_497 = value_8(selectedFriend_484.id),
                                        value_8_498 = value_8(value_488.id);
                                    if (!value_8_497 || !value_8_498) throw new Error('角色不存在');
                                    value_8_497.linkedAccountChats =
                                        this.getLinkedChats(value_8_497);
                                    const value_499 =
                                        value_8_497.linkedAccountChats.find(
                                            (value_501) =>
                                                String(value_501.id) === String(options_485.chatId),
                                        ) ||
                                        value_8_497.linkedAccountChats.find(
                                            (value_502) =>
                                                String(value_502.sourceNpcId || '') ===
                                                String(value_488.id),
                                        );
                                    if (!value_499) throw new Error('会话不存在');
                                    value_499.messages = [];
                                    value_499.updatedAt = Date.now();
                                    value_8_498.linkedAccountChats =
                                        this.getLinkedChats(value_8_498);
                                    const result_500 = value_8_498.linkedAccountChats.find(
                                        (value_503) =>
                                            String(value_503.sourceNpcId || '') ===
                                            String(value_8_497.id),
                                    );
                                    result_500 &&
                                        ((result_500.messages = []),
                                        (result_500.updatedAt = value_499.updatedAt));
                                },
                                {
                                    friendIds: [selectedFriend_484.id, value_488.id],
                                    silent: true,
                                },
                            );
                            if (!value_496) throw new Error('清空失败，聊天记录已恢复');
                            window.dispatchEvent(
                                new CustomEvent('u2:linked-accounts-changed', {
                                    detail: {
                                        friendId: String(value_488.id),
                                        changedCount: 1,
                                    },
                                }),
                            );
                        } else {
                            const value_504 = await window.imApp?.commitFriendChange?.(
                                selectedFriend_484.id,
                                (value_505) => {
                                    if (!value_492() || !value_505)
                                        throw new Error('当前 Char 或会话已变化');
                                    value_505.linkedAccountChats = this.getLinkedChats(value_505);
                                    const value_506 =
                                        value_505.linkedAccountChats.find(
                                            (value_507) =>
                                                String(value_507.id) === String(options_485.chatId),
                                        ) ||
                                        value_505.linkedAccountChats.find(
                                            (value_508) =>
                                                value_487 &&
                                                String(value_508.sourceNpcId || '') ===
                                                    String(value_487),
                                        );
                                    if (!value_506) throw new Error('会话不存在');
                                    value_506.messages = [];
                                    value_506.updatedAt = Date.now();
                                },
                                {
                                    silent: true,
                                    metaOnly: true,
                                },
                            );
                            if (!value_504) throw new Error('清空失败，聊天记录已恢复');
                        }
                    }
                    options_485.kind === 'linked' &&
                        (window.dispatchEvent(
                            new CustomEvent('u2:linked-accounts-changed', {
                                detail: {
                                    friendId: String(selectedFriend_484.id),
                                    changedCount: 1,
                                },
                            }),
                        ),
                        window.imApp?.requestChatsListRefresh?.());
                    if (value_492()) this.renderThread();
                    return true;
                } catch (value_509) {
                    return (
                        window.showToast?.(value_509?.message || '清空失败，聊天记录已恢复'),
                        false
                    );
                } finally {
                    this.clearing = false;
                    if (cphoneProgressOpenElement) cphoneProgressOpenElement.disabled = false;
                    if (cphoneClearChatElement_490)
                        cphoneClearChatElement_490.disabled = !this.currentMessages().length;
                }
            },
            async progressThread() {
                if (this.progressing || this.clearing || !this.activeThread) return false;
                const selectedFriend_510 = this.getSelectedFriend(),
                    options_511 = {
                        ...this.activeThread,
                    };
                if (
                    !selectedFriend_510 ||
                    (options_511.kind !== 'cphoneGroup' && options_511.kind !== 'linked')
                )
                    return false;
                const trim_512 = String(
                        document.getElementById('cphone-progress-rounds')?.value || '',
                    ).trim(),
                    number_513 = Number(trim_512),
                    trim_514 = String(
                        document.getElementById('cphone-progress-direction')?.value || '',
                    ).trim(),
                    cphoneProgressErrorElement_515 =
                        document.getElementById('cphone-progress-error'),
                    cphoneProgressSubmitElement = document.getElementById('cphone-progress-submit');
                if (
                    !trim_512 ||
                    !Number.isInteger(number_513) ||
                    number_513 < 1 ||
                    number_513 > 20 ||
                    trim_514.length > 1000
                )
                    return (
                        cphoneProgressErrorElement_515 &&
                            ((cphoneProgressErrorElement_515.textContent =
                                '请选择 1–20 轮，聊天方向不超过 1000 字'),
                            (cphoneProgressErrorElement_515.hidden = false)),
                        false
                    );
                this.progressing = true;
                cphoneProgressSubmitElement &&
                    ((cphoneProgressSubmitElement.disabled = true),
                    (cphoneProgressSubmitElement.textContent = '正在推进…'));
                cphoneProgressErrorElement_515 &&
                    ((cphoneProgressErrorElement_515.hidden = true),
                    (cphoneProgressErrorElement_515.textContent = ''));
                try {
                    await window.imApp?.ensureFriendMessagesLoaded?.(selectedFriend_510);
                    if (
                        this.selectedId !== String(selectedFriend_510.id) ||
                        this.progressKey(this.activeThread) !== this.progressKey(options_511)
                    )
                        throw new Error('当前 Char 或会话已变化，请重试');
                    const value_516 =
                        options_511.kind === 'cphoneGroup'
                            ? this.getCphoneGroups(selectedFriend_510).find(
                                  (value_524) =>
                                      String(value_524.id) === String(options_511.groupId),
                              )
                            : null;
                    if (options_511.kind === 'cphoneGroup' && !value_516)
                        throw new Error('群聊不存在');
                    const value_517 =
                            options_511.kind === 'linked'
                                ? this.getLinkedChats(selectedFriend_510).find(
                                      (value_525) =>
                                          String(value_525.id) === String(options_511.chatId),
                                  )
                                : null,
                        value_518 = options_511.targetId || value_517?.sourceNpcId || '',
                        value_519 =
                            options_511.kind === 'linked' && value_518 ? value_8(value_518) : null,
                        progressCharacters = this.getProgressCharacters(
                            selectedFriend_510,
                            options_511,
                            value_516,
                            value_519,
                        );
                    for (const value_526 of progressCharacters) {
                        if (String(value_526.id) !== String(selectedFriend_510.id))
                            await window.imApp?.ensureFriendMessagesLoaded?.(value_526);
                    }
                    const currentMessages_520 = this.currentMessages(),
                        progressMarker_521 = this.progressMarker(currentMessages_520),
                        value_522 =
                            value_519?.type === 'char'
                                ? this.progressMarker(
                                      this.getLinkedChats(value_519).find(
                                          (value_527) =>
                                              String(value_527.sourceNpcId || '') ===
                                              String(selectedFriend_510.id),
                                      )?.messages,
                                  )
                                : '',
                        value_523 = await this.requestJsonGeneration(
                            this.buildProgressPrompt(
                                selectedFriend_510,
                                options_511,
                                value_516,
                                value_519,
                                number_513,
                                trim_514,
                                currentMessages_520,
                                progressCharacters,
                            ),
                        ),
                        progressRounds = this.normalizeProgressRounds(
                            value_523,
                            options_511,
                            value_516,
                            number_513,
                        );
                    if (
                        this.selectedId !== String(selectedFriend_510.id) ||
                        !value_8(selectedFriend_510.id) ||
                        this.progressKey(this.activeThread) !== this.progressKey(options_511)
                    )
                        throw new Error('当前 Char 或会话已变化，请重试');
                    if (options_511.kind === 'cphoneGroup')
                        await this.saveCphoneGroups(selectedFriend_510.id, (value_528) => {
                            if (
                                this.selectedId !== String(selectedFriend_510.id) ||
                                this.progressKey(this.activeThread) !==
                                    this.progressKey(options_511)
                            )
                                throw new Error('当前 Char 或会话已变化');
                            const result_529 = value_528.find(
                                (value_531) => String(value_531.id) === String(options_511.groupId),
                            );
                            if (
                                !result_529 ||
                                this.progressMarker(result_529.messages) !== progressMarker_521
                            )
                                throw new Error('群聊已更新，请重试');
                            const materializeProgress_530 = this.materializeProgress(
                                progressRounds,
                                result_529.messages,
                                options_511,
                                selectedFriend_510,
                                result_529,
                            );
                            result_529.messages = Array.isArray(result_529.messages)
                                ? result_529.messages
                                : [];
                            result_529.messages.push(...materializeProgress_530);
                            result_529.updatedAt = materializeProgress_530.at(-1).timestamp;
                        });
                    else {
                        if (
                            !(await this.saveLinkedProgress(
                                selectedFriend_510,
                                options_511,
                                progressRounds,
                                progressMarker_521,
                                value_522,
                            ))
                        )
                            throw new Error('聊天保存失败，已撤销本次推进');
                    }
                    this.progressing = false;
                    this.closeProgress();
                    if (this.activeThread && this.selectedId === String(selectedFriend_510.id))
                        this.renderThread();
                    return true;
                } catch (value_532) {
                    if (
                        window.u2Api?.isRequestError?.(value_532) &&
                        window.u2Api.reportError(value_532, {
                            operation: '聊天推进',
                        })
                    ) {
                        if (cphoneProgressErrorElement_515)
                            cphoneProgressErrorElement_515.hidden = true;
                    } else
                        cphoneProgressErrorElement_515 &&
                            ((cphoneProgressErrorElement_515.textContent =
                                value_532?.message || '聊天推进失败，请重试'),
                            (cphoneProgressErrorElement_515.hidden = false));
                    return false;
                } finally {
                    this.progressing = false;
                    cphoneProgressSubmitElement &&
                        ((cphoneProgressSubmitElement.disabled = false),
                        (cphoneProgressSubmitElement.textContent = '生成聊天'));
                }
            },
        };
    window.cphoneApp = cphoneApp_2;
    (
        window.u2OnStorageReady ||
        ((handleDOMContentLoaded) =>
            document.addEventListener('DOMContentLoaded', handleDOMContentLoaded))
    )(() => cphoneApp_2.init());
})();
