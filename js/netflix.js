class NetflixApp {
    constructor() {
        this.core = window.NetflixGameCore;
        this.view = document.getElementById('netflix-view');
        this.isOpen = false;
        this.activeTab = 'home';
        this.setupDraft = null;
        this.availableCharacters = [];
        this.isBusy = false;
        this.isSearchBusy = false;
        this.saveModalMode = 'load';
        this.saveReturnToSettings = false;
        this.sheetFocusOrigins = new WeakMap();
        this.pendingRequestChoice = null;
        this.isTransitioning = false;
        this.customChoiceOpen = false;
        this.pendingRunPreview = null;
        this.hubOpen = false;
        this.hubDraftOpen = false;
        this.castPickerReturnToRelations = false;
        this.mapTransform = {
            x: 0,
            y: 0,
            scale: 1,
        };
        this.mapPointers = new Map();
        this.mapGesture = null;
        this.mapEditMode = false;
        this.migratedLegacyState = false;
        if (!this.core || !this.view) return;
        this.state = this.loadState();
        this.init();
    }
    ['init']() {
        this.renderStructure();
        this.cacheElements();
        this.bindEvents();
        this.renderHome();
        this.renderProfile();
        this.renderNav();
        if (this.migratedLegacyState) this.finishLegacyMigration();
    }
    ['createDefaultCatalog']() {
        const make = (id_20, title_5, category_3, summary_3, value_7, tags_2 = []) => ({
                id: id_20,
                title: title_5,
                category: category_3,
                summary: summary_3,
                tags: tags_2,
                coverUrl: 'https://picsum.photos/seed/' + value_7 + '/720/1080?grayscale',
                cast: [],
            }),
            items = [
                make(
                    'default-night-train',
                    '雾夜列车',
                    '悬疑',
                    '一列不会停站的夜车，载着彼此隐瞒秘密的旅客驶向未知终点。',
                    'u2-night-train',
                    ['命运', '群像'],
                ),
                make(
                    'default-summer-letter',
                    '夏日未寄信',
                    '恋爱',
                    '多年后重返海边小镇，一封未寄出的信让旧日关系再次泛起涟漪。',
                    'u2-summer-letter',
                    ['重逢', '治愈'],
                ),
                make(
                    'default-glass-city',
                    '玻璃城',
                    '都市',
                    '光鲜城市的幕后，每个人都在欲望、名声与真心之间作出选择。',
                    'u2-glass-city',
                    ['成长', '名利'],
                ),
                make(
                    'default-star-academy',
                    '星光学院',
                    '校园',
                    '新人演员进入竞争激烈的表演学院，在友情、爱情与舞台梦想之间成长。',
                    'u2-star-academy',
                    ['养成', '青春'],
                ),
                make(
                    'default-ancient-promise',
                    '长安旧约',
                    '古风',
                    '旧朝暗流涌动，一纸婚约把两个立场相反的人推向同一场棋局。',
                    'u2-ancient-promise',
                    ['权谋', '情感'],
                ),
                make(
                    'default-island',
                    '无人岛来信',
                    '奇幻',
                    '每天清晨，海岸都会出现一封来自未来的信。',
                    'u2-island-letter',
                    ['探索', '奇幻'],
                ),
                make(
                    'default-stage',
                    '未落幕',
                    '娱乐圈',
                    '一次意外同台，让沉寂的演员重新站到聚光灯下。',
                    'u2-stage',
                    ['事业', '羁绊'],
                ),
            ];
        return {
            banners: items.slice(0, 3),
            recent: [],
            sections: {
                为你推荐: items.slice(3, 7),
                恋爱剧情: [items[1], items[4], items[6]],
                成长养成: [items[3], items[2], items[5]],
                悬疑奇幻: [items[0], items[5], items[4]],
            },
        };
    }
    ['normalizeCatalogItem'](item_2 = {}, value_10 = '') {
        if (!item_2 || typeof item_2 !== 'object') return null;
        const title_2 = String(item_2.title || item_2.name || '未命名影片').trim() || '未命名影片',
            category_2 = String(item_2.category || item_2.type || '剧情').trim() || '剧情',
            id_21 = String(
                item_2.id ||
                    value_10 ||
                    'catalog-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
            ),
            cast_2 = (
                Array.isArray(item_2.cast)
                    ? item_2.cast
                    : Array.isArray(item_2.actors)
                      ? item_2.actors
                      : []
            ).map((actor_2, value_14) => ({
                id: String(actor_2?.id || 'film-' + id_21 + '-' + value_14),
                type: 'custom',
                sourceId: '',
                name: String(
                    actor_2?.roleName ||
                        actor_2?.name ||
                        actor_2?.realName ||
                        '主演' + (value_14 + 1),
                ).trim(),
                persona: String(
                    actor_2?.rolePersona || actor_2?.persona || actor_2?.desc || '',
                ).trim(),
                avatar: String(actor_2?.avatar || actor_2?.avatarUrl || '').trim(),
                affinity: this.core.clampInt(actor_2?.affinity, 0, 100, 50),
            }));
        return {
            id: id_21,
            title: title_2,
            category: category_2,
            summary: String(item_2.summary || item_2.description || item_2.desc || '').trim(),
            tags: (Array.isArray(item_2.tags)
                ? item_2.tags
                : String(item_2.tags || '').split(/[，,、\s]+/)
            )
                .map((tag) => String(tag).trim())
                .filter(Boolean)
                .slice(0, 5),
            coverUrl: this.normalizeCoverUrl(
                item_2.coverUrl || item_2.cover || item_2.thumbnail || '',
                id_21 + '-' + title_2,
            ),
            cast: cast_2,
        };
    }
    ['normalizeCoverUrl'](url, value_16 = 'netflix') {
        const value_13 = String(url || '').trim();
        if (/^(https?:\/\/|data:image\/|blob:)/i.test(value_13)) return value_13;
        return 'https://picsum.photos/seed/' + encodeURIComponent(value_16) + '/720/1080?grayscale';
    }
    ['normalizeCatalog'](rawCatalog) {
        const fallback = this.createDefaultCatalog(),
            source = rawCatalog && typeof rawCatalog === 'object' ? rawCatalog : fallback,
            sectionSource =
                source.sections && typeof source.sections === 'object'
                    ? source.sections
                    : fallback.sections,
            sections_2 = Object.entries(sectionSource).reduce((value_25, [value_26, value_27]) => {
                return (
                    (value_25[String(value_26)] = (Array.isArray(value_27) ? value_27 : [])
                        .map((value_28, value_29) =>
                            this.normalizeCatalogItem(
                                value_28,
                                'section-' + value_26 + '-' + value_29,
                            ),
                        )
                        .filter(Boolean)),
                    value_25
                );
            }, {}),
            banners_2 = (Array.isArray(source.banners) ? source.banners : fallback.banners)
                .map((value_30, value_31) =>
                    this.normalizeCatalogItem(value_30, 'banner-' + value_31),
                )
                .filter(Boolean)
                .slice(0, 3),
            recent_2 = (Array.isArray(source.recent) ? source.recent : [])
                .map((value_32, value_33) =>
                    this.normalizeCatalogItem(value_32, 'recent-' + value_33),
                )
                .filter(Boolean)
                .slice(0, 8),
            hasExplicitCatalogShape =
                !!rawCatalog &&
                typeof rawCatalog === 'object' &&
                ('banners' in rawCatalog || 'recent' in rawCatalog || 'sections' in rawCatalog);
        if (!Object.keys(sections_2).length && !hasExplicitCatalogShape) return fallback;
        return {
            banners: banners_2,
            recent: recent_2,
            sections: sections_2,
        };
    }
    ['loadState']() {
        let raw = null;
        try {
            if (typeof window.getAppState === 'function') raw = window.getAppState('netflix');
            if (!raw && window.appStorage?.readDomain)
                raw = window.appStorage.readDomain('netflix', null);
        } catch (error_2) {
            console.warn('[Netflix] state load failed:', error_2);
        }
        const normalized = this.core.normalizeState(raw, this.createDefaultCatalog());
        return (
            (this.migratedLegacyState = normalized.migrated),
            (normalized.state.homeCatalog = this.normalizeCatalog(normalized.state.homeCatalog)),
            normalized.state
        );
    }
    async ['saveState'](options_2 = {}) {
        try {
            if (typeof window.setAppState === 'function')
                window.setAppState('netflix', this.state, {
                    silent: true,
                });
            else
                window.appStorage?.commitDomain &&
                    (await window.appStorage.commitDomain('netflix', this.state, {
                        critical: true,
                        reason: 'netflix-visual-novel',
                    }));
            if (options_2.flush && typeof window.saveGlobalData === 'function')
                await window.saveGlobalData();
            return true;
        } catch (error_3) {
            return (
                console.error('[Netflix] state save failed:', error_3),
                this.toast('存档写入失败，请稍后重试'),
                false
            );
        }
    }
    async ['finishLegacyMigration']() {
        await this.saveState({
            flush: true,
        });
        const legacyKeys = [
            'u2_netflixWorks',
            'u2_netflixBoundWorldBookIds',
            'u2_netflixHomeCatalog',
            'u2_netflixPlaybackCatalog',
            'u2_netflixPlaybackCustomCss',
            'u2_netflixPresetState',
        ];
        window.appStorage?.removeLegacyKey &&
            (await Promise.allSettled(
                legacyKeys.map((key) => window.appStorage.removeLegacyKey(key)),
            ));
    }
    ['renderStructure']() {
        this.view.innerHTML = `
            <header class="netflix-header" id="netflix-header">
                <button type="button" class="netflix-logo" data-action="close-app" aria-label="关闭 Netflix">N</button>
                <div class="netflix-header-actions">
                    <button type="button" class="netflix-icon-button" data-action="open-search" aria-label="搜索"><i class="fas fa-search"></i></button>
                    <button type="button" class="netflix-header-avatar" data-action="open-profile" aria-label="我的 Netflix"><i class="fas fa-user"></i></button>
                </div>
            </header>
            <main class="netflix-content" id="netflix-content">
                <section class="netflix-panel is-active" data-panel="home"><div id="netflix-home-content"></div></section>
                <section class="netflix-panel netflix-profile-panel" data-panel="profile" id="netflix-profile-panel"></section>
            </main>
            <nav class="netflix-bottom-nav" aria-label="Netflix 导航">
                <button type="button" class="netflix-nav-item is-active" data-tab="home"><i class="fas fa-home"></i><span>首页</span></button>
                <button type="button" class="netflix-nav-item" data-tab="profile"><i class="fas fa-user-circle"></i><span>我的 Netflix</span></button>
            </nav>

            <section class="netflix-sheet netflix-search-sheet" id="netflix-search-sheet" aria-hidden="true">
                <div class="netflix-modal-card netflix-search-card" role="dialog" aria-modal="true" aria-labelledby="netflix-search-title">
                    <button type="button" class="netflix-modal-close" data-action="close-search" aria-label="关闭"><i class="fas fa-times"></i></button>
                    <span class="netflix-eyebrow">DISCOVER</span>
                    <h2 id="netflix-search-title">生成新的片库</h2>
                    <p>输入喜欢的题材、人物关系或故事氛围，留空则随机生成。</p>
                    <textarea id="netflix-search-input" placeholder="例如：豪门成长、娱乐圈、久别重逢"></textarea>
                    <button type="button" class="netflix-primary-button" data-action="confirm-search" id="netflix-search-confirm">生成片库</button>
                </div>
            </section>

            <section class="netflix-setup-view" id="netflix-setup-view" aria-hidden="true">
                <header class="netflix-subview-header">
                    <button type="button" class="netflix-icon-button" data-action="close-setup" aria-label="返回"><i class="fas fa-chevron-left"></i></button>
                    <div><span>NEW STORY</span><strong>初始化游戏</strong></div>
                    <button type="button" class="netflix-subview-text-button" data-action="open-load">读档</button>
                </header>
                <div class="netflix-setup-scroll" id="netflix-setup-body"></div>
            </section>

            <section class="netflix-game-view" id="netflix-game-view" aria-hidden="true" tabindex="-1">
                <div class="netflix-game-backdrop" id="netflix-game-backdrop"></div>
                <div class="netflix-game-shade"></div>
                <section class="netflix-game-hub" id="netflix-game-hub" aria-label="故事主界面" aria-hidden="true">
                    <header class="netflix-hub-header">
                        <button type="button" class="netflix-game-top-button" data-action="return-to-netflix" aria-label="返回 Netflix"><i class="fas fa-chevron-left"></i></button>
                        <span>STORY HOME</span>
                        <button type="button" class="netflix-game-top-button" data-action="show-game-settings" aria-label="设置"><i class="fas fa-cog"></i></button>
                    </header>
                    <div class="netflix-hub-content" id="netflix-hub-content"></div>
                </section>
                <header class="netflix-game-header">
                    <button type="button" class="netflix-game-top-button" data-action="show-game-hub" aria-label="返回故事主界面"><i class="fas fa-chevron-left"></i></button>
                    <div class="netflix-game-title" id="netflix-game-title"></div>
                    <button type="button" class="netflix-game-top-button" data-action="open-game-menu" id="netflix-game-menu-button" aria-label="菜单"><i class="fas fa-bars"></i></button>
                </header>
                <div class="netflix-scene-heading" id="netflix-scene-heading"></div>
                <div class="netflix-game-stage" id="netflix-game-stage"></div>
                <section class="netflix-training-view" id="netflix-training-view" aria-hidden="true">
                    <header class="netflix-training-header">
                        <button type="button" class="netflix-game-top-button" data-action="show-game-hub" aria-label="返回故事主界面"><i class="fas fa-chevron-left"></i></button>
                        <div><span id="netflix-training-day">DAY 01</span><strong id="netflix-training-title">养成地图</strong></div>
                        <button type="button" class="netflix-game-top-button" data-action="open-game-menu" aria-label="菜单"><i class="fas fa-bars"></i></button>
                    </header>
                    <div class="netflix-training-hud" id="netflix-training-hud"></div>
                    <div class="netflix-map-viewport" id="netflix-map-viewport" tabindex="0" aria-label="养成地图，可拖动和缩放">
                        <div class="netflix-map-canvas" id="netflix-map-canvas"></div>
                    </div>
                    <div class="netflix-map-controls" aria-label="地图缩放控制">
                        <button type="button" data-action="map-zoom-out" aria-label="缩小地图"><i class="fas fa-minus"></i></button>
                        <button type="button" data-action="map-reset-view" aria-label="复位地图"><i class="fas fa-crosshairs"></i></button>
                        <button type="button" data-action="map-zoom-in" aria-label="放大地图"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="netflix-training-event" id="netflix-training-event" aria-hidden="true"></div>
                </section>
                <div class="netflix-generation-overlay" id="netflix-generation-overlay" role="status" aria-live="polite" aria-hidden="true">
                    <div><i class="fas fa-spinner fa-spin"></i><strong id="netflix-generation-title">正在生成剧情</strong><span id="netflix-generation-detail">正在建立世界与人物关系，请稍候。</span></div>
                </div>
            </section>

            <section class="netflix-sheet netflix-menu-sheet" id="netflix-menu-sheet" aria-hidden="true">
                <div class="netflix-menu-card" role="dialog" aria-modal="true" aria-label="游戏菜单">
                    <div class="netflix-menu-header"><div><span>STORY MENU</span><h2>游戏菜单</h2></div><button type="button" class="netflix-modal-close" data-action="close-game-menu" aria-label="关闭"><i class="fas fa-times"></i></button></div>
                    <div class="netflix-menu-grid">
                        <button type="button" data-action="continue-context" id="netflix-menu-continue"><i class="fas fa-play"></i><span>继续游戏</span></button>
                        <button type="button" data-action="open-save"><i class="fas fa-save"></i><span>存档</span></button>
                        <button type="button" data-action="open-load"><i class="fas fa-folder-open"></i><span>读档</span></button>
                        <button type="button" data-action="show-attributes"><i class="fas fa-chart-bar"></i><span>属性</span></button>
                        <button type="button" data-action="show-relations"><i class="fas fa-user-friends"></i><span>关系</span></button>
                        <button type="button" data-action="show-history"><i class="fas fa-book-open"></i><span>剧情回看</span></button>
                        <button type="button" data-action="restart-game"><i class="fas fa-redo"></i><span>重新开始</span></button>
                    </div>
                    <button type="button" class="netflix-menu-exit" data-action="return-to-netflix"><i class="fas fa-sign-out-alt"></i> 返回 Netflix</button>
                </div>
            </section>

            <section class="netflix-sheet netflix-save-sheet" id="netflix-save-sheet" aria-hidden="true">
                <div class="netflix-save-card" role="dialog" aria-modal="true" aria-labelledby="netflix-save-title">
                    <header><div><span>SAVE DATA</span><h2 id="netflix-save-title">读档</h2></div><button type="button" class="netflix-modal-close" data-action="close-saves" aria-label="关闭"><i class="fas fa-times"></i></button></header>
                    <div class="netflix-save-list" id="netflix-save-list"></div>
                </div>
            </section>

            <section class="netflix-sheet netflix-cast-picker-sheet" id="netflix-cast-picker-sheet" aria-hidden="true">
                <div class="netflix-modal-card netflix-cast-picker-card" role="dialog" aria-modal="true" aria-labelledby="netflix-cast-picker-title">
                    <button type="button" class="netflix-modal-close" data-action="close-cast-picker" aria-label="关闭"><i class="fas fa-times"></i></button>
                    <span class="netflix-eyebrow">CAST</span><h2 id="netflix-cast-picker-title">添加主演</h2>
                    <div class="netflix-cast-picker-list" id="netflix-cast-picker-list"></div>
                    <button type="button" class="netflix-secondary-button" data-action="add-custom-cast"><i class="fas fa-plus"></i> 手动添加 NPC</button>
                </div>
            </section>

            <section class="netflix-sheet netflix-info-sheet" id="netflix-info-sheet" aria-hidden="true">
                <div class="netflix-info-card" role="dialog" aria-modal="true" aria-labelledby="netflix-info-title">
                    <header><h2 id="netflix-info-title"></h2><button type="button" class="netflix-modal-close" data-action="close-info" aria-label="关闭"><i class="fas fa-times"></i></button></header>
                    <div class="netflix-info-body" id="netflix-info-body"></div>
                </div>
            </section>

            <section class="netflix-sheet netflix-map-editor-sheet" id="netflix-map-editor-sheet" aria-hidden="true">
                <div class="netflix-info-card netflix-map-editor-card" role="dialog" aria-modal="true" aria-labelledby="netflix-map-editor-title">
                    <header><div><span>MAP EDITOR</span><h2 id="netflix-map-editor-title">编辑养成地图</h2></div><button type="button" class="netflix-modal-close" data-action="close-map-editor" aria-label="关闭"><i class="fas fa-times"></i></button></header>
                    <div class="netflix-info-body" id="netflix-map-editor-body"></div>
                </div>
            </section>
        `;
    }
    ['cacheElements']() {
        this.content = this.view.querySelector('#netflix-content');
        this.header = this.view.querySelector('#netflix-header');
        this.homeContent = this.view.querySelector('#netflix-home-content');
        this.profilePanel = this.view.querySelector('#netflix-profile-panel');
        this.searchSheet = this.view.querySelector('#netflix-search-sheet');
        this.searchInput = this.view.querySelector('#netflix-search-input');
        this.searchConfirm = this.view.querySelector('#netflix-search-confirm');
        this.setupView = this.view.querySelector('#netflix-setup-view');
        this.setupBody = this.view.querySelector('#netflix-setup-body');
        this.gameView = this.view.querySelector('#netflix-game-view');
        this.gameHub = this.view.querySelector('#netflix-game-hub');
        this.hubContent = this.view.querySelector('#netflix-hub-content');
        this.gameBackdrop = this.view.querySelector('#netflix-game-backdrop');
        this.gameTitle = this.view.querySelector('#netflix-game-title');
        this.sceneHeading = this.view.querySelector('#netflix-scene-heading');
        this.gameStage = this.view.querySelector('#netflix-game-stage');
        this.gameMenuButton = this.view.querySelector('#netflix-game-menu-button');
        this.trainingView = this.view.querySelector('#netflix-training-view');
        this.trainingDay = this.view.querySelector('#netflix-training-day');
        this.trainingTitle = this.view.querySelector('#netflix-training-title');
        this.trainingHud = this.view.querySelector('#netflix-training-hud');
        this.mapViewport = this.view.querySelector('#netflix-map-viewport');
        this.mapCanvas = this.view.querySelector('#netflix-map-canvas');
        this.trainingEvent = this.view.querySelector('#netflix-training-event');
        this.generationOverlay = this.view.querySelector('#netflix-generation-overlay');
        this.generationTitle = this.view.querySelector('#netflix-generation-title');
        this.generationDetail = this.view.querySelector('#netflix-generation-detail');
        this.menuContinue = this.view.querySelector('#netflix-menu-continue');
        this.menuSheet = this.view.querySelector('#netflix-menu-sheet');
        this.saveSheet = this.view.querySelector('#netflix-save-sheet');
        this.saveTitle = this.view.querySelector('#netflix-save-title');
        this.saveList = this.view.querySelector('#netflix-save-list');
        this.castPickerSheet = this.view.querySelector('#netflix-cast-picker-sheet');
        this.castPickerList = this.view.querySelector('#netflix-cast-picker-list');
        this.infoSheet = this.view.querySelector('#netflix-info-sheet');
        this.infoTitle = this.view.querySelector('#netflix-info-title');
        this.infoBody = this.view.querySelector('#netflix-info-body');
        this.mapEditorSheet = this.view.querySelector('#netflix-map-editor-sheet');
        this.mapEditorBody = this.view.querySelector('#netflix-map-editor-body');
    }
    ['bindEvents']() {
        document.getElementById('app-netflix-btn')?.addEventListener('click', () => this.open());
        this.view.addEventListener('click', (event_2) => this.handleClick(event_2));
        this.view.addEventListener('input', (event_3) => this.handleInput(event_3));
        this.view.addEventListener('change', (event_4) => this.handleChange(event_4));
        this.content?.addEventListener('scroll', () =>
            this.header?.classList.toggle('is-scrolled', this.content.scrollTop > 28),
        );
        this.mapViewport?.addEventListener('wheel', (event_5) => this.handleMapWheel(event_5), {
            passive: false,
        });
        this.mapViewport?.addEventListener('pointerdown', (event_6) =>
            this.handleMapPointerDown(event_6),
        );
        this.mapViewport?.addEventListener('pointermove', (event_7) =>
            this.handleMapPointerMove(event_7),
        );
        this.mapViewport?.addEventListener('pointerup', (value_46) =>
            this.handleMapPointerUp(value_46),
        );
        this.mapViewport?.addEventListener('pointercancel', (value_47) =>
            this.handleMapPointerUp(value_47),
        );
        window.addEventListener('pagehide', () => {
            if (this.state.activeRun && !this.isBusy) this.updateAutoSave(false);
        });
    }
    ['handleClick'](event) {
        const target_2 = event.target.closest(
            '[data-action], [data-tab], [data-catalog-id], [data-choice-id], [data-location-id], [data-training-choice-id]',
        );
        if (!target_2 || !this.view.contains(target_2)) return;
        if (target_2.dataset.tab) return this.switchTab(target_2.dataset.tab);
        if (target_2.dataset.catalogId)
            return this.openSetup(this.findCatalogItem(target_2.dataset.catalogId));
        if (target_2.dataset.choiceId) return this.chooseStoryOption(target_2.dataset.choiceId);
        if (target_2.dataset.locationId)
            return this.openTrainingLocation(target_2.dataset.locationId);
        if (target_2.dataset.trainingChoiceId)
            return this.resolveTrainingChoice(target_2.dataset.trainingChoiceId);
        const action_2 = target_2.dataset.action,
            actions = {
                'close-app': () => this.close(),
                'open-profile': () => this.switchTab('profile'),
                'open-search': () => this.openSearch(),
                'close-search': () => this.closeSheet(this.searchSheet),
                'confirm-search': () => this.generateCatalog(),
                'delete-title': () => this.deleteCatalogTitle(),
                'close-setup': () => this.closeSetup(),
                'reroll-attributes': () => this.rerollAttributes(),
                'add-attribute': () => this.addCustomAttribute(),
                'delete-attribute': () => this.deleteCustomAttribute(target_2.dataset.attributeId),
                'open-cast-picker': () => this.openCastPicker(),
                'close-cast-picker': () => this.closeCastPicker(),
                'add-existing-cast': () => this.addExistingCharacter(target_2.dataset.characterId),
                'add-custom-cast': () => this.addCustomCast(),
                'delete-cast': () => this.deleteCast(target_2.dataset.castId),
                'start-game': () => this.startNewGame(),
                'advance-dialogue': () => this.advanceDialogue(),
                'toggle-custom-choice': () => this.toggleCustomChoice(),
                'submit-custom-choice': () => this.submitCustomChoice(),
                'enter-training': () => this.enterTraining(),
                'continue-story': () => this.continueStory(),
                'show-game-hub': () => this.showGameHub(),
                'show-game-story': () => this.showGameStory(),
                'resume-game-story': () => this.resumeGameStory(),
                'show-game-relations': () => this.showGameRelations(),
                'show-game-attributes': () => this.showAttributes(),
                'show-game-map': () => this.showGameMap(),
                'show-game-settings': () => this.showGameSettings(),
                'save-hub-background': () => this.saveHubBackground(),
                'clear-hub-background': () => this.clearHubBackground(),
                'advance-training-event': () => this.advanceTrainingEvent(),
                'dismiss-training-result': () => this.dismissTrainingResult(),
                'close-training-event': () => this.closeTrainingEvent(),
                'select-companion': () =>
                    this.selectTrainingCompanion(target_2.dataset.companionId),
                'map-zoom-in': () => this.zoomMap(0.15),
                'map-zoom-out': () => this.zoomMap(-0.15),
                'map-reset-view': () => this.resetMapView(),
                'toggle-map-layout': () => this.toggleMapLayout(),
                'open-map-editor': () => this.openMapEditor(),
                'close-map-editor': () => this.closeSheet(this.mapEditorSheet),
                'add-map-node': () => this.addMapNode(),
                'delete-map-node': () => this.deleteMapNode(target_2.dataset.mapNodeId),
                'save-map-editor': () => this.saveMapEditor(),
                'regenerate-map': () => this.regenerateMap(),
                'enter-main-game': () => this.enterMainGame(),
                'continue-epilogue': () => this.continueEpilogue(),
                'open-game-menu': () => this.openGameMenu(),
                'close-game-menu': () => this.closeSheet(this.menuSheet),
                'continue-context': () => this.continueContext(),
                'open-save': () => this.openSaves('save'),
                'open-load': () => this.openSaves('load'),
                'close-saves': () => this.closeSaves(),
                'save-slot': () => this.writeManualSave(Number(target_2.dataset.slotIndex)),
                'load-slot': () =>
                    this.loadSave(target_2.dataset.slotKind, Number(target_2.dataset.slotIndex)),
                'delete-save': () => this.deleteManualSave(Number(target_2.dataset.slotIndex)),
                'show-attributes': () => this.showAttributes(),
                'show-relations': () => this.showRelations(),
                'show-character-detail': () =>
                    this.showCharacterDetail(target_2.dataset.characterId),
                'back-to-relations': () => this.showRelations(false),
                'acquaint-character': () => this.resolveIdentityCard(true),
                'defer-character': () => this.resolveIdentityCard(false),
                'show-history': () => this.showHistory(),
                'show-endings': () => this.showEndings(),
                'show-worldbooks': () => this.showWorldBooksInfo(),
                'close-info': () => this.closeInfo(),
                'restart-game': () => this.restartGame(),
                'return-to-netflix': () => this.returnToNetflix(),
            };
        if (action_2 && actions[action_2]) actions[action_2]();
    }
    ['handleInput'](event_8) {
        const run_2 = this.getEditableSetup();
        if (!run_2) return;
        const field = event_8.target.dataset.setupField;
        if (field) run_2[field] = event_8.target.value;
        const worldbookContent_52 = event_8.target.dataset.worldbookContent;
        if (worldbookContent_52) {
            const result_55 = (run_2.worldBooks || []).find(
                (value_56) => String(value_56.id) === worldbookContent_52,
            );
            if (result_55) result_55.content = event_8.target.value;
        }
        const attributeId_2 = event_8.target.dataset.attributeId;
        if (attributeId_2) {
            const attribute_2 = run_2.attributes.find((value_58) => value_58.id === attributeId_2);
            if (attribute_2) {
                if (event_8.target.dataset.attributeField === 'name')
                    attribute_2.name = event_8.target.value;
                if (event_8.target.dataset.attributeField === 'value')
                    attribute_2.value = this.core.clampInt(event_8.target.value, 0, 100, 0);
            }
        }
        const id_2 = event_8.target.dataset.castId;
        if (id_2) {
            const actor_3 = run_2.cast.find((item_3) => item_3.id === id_2);
            if (actor_3) {
                const castField_2 = event_8.target.dataset.castField;
                if (castField_2 === 'name') actor_3.name = event_8.target.value;
                if (castField_2 === 'persona') actor_3.persona = event_8.target.value;
                if (castField_2 === 'affinity' && actor_3.type !== 'user') {
                    actor_3.affinity = this.core.clampInt(event_8.target.value, 0, 100, 50);
                    const output = event_8.target
                        .closest('.netflix-affinity-field')
                        ?.querySelector('b');
                    if (output) output.textContent = String(actor_3.affinity);
                }
            }
        }
    }
    ['handleChange'](event_9) {
        const run_3 = this.getEditableSetup();
        if (!run_3) return;
        if (event_9.target.matches('[data-worldbook-id]')) {
            const id_3 = String(event_9.target.dataset.worldbookId),
                value_65 = new Set(run_3.worldBookIds || []);
            event_9.target.checked ? value_65.add(id_3) : value_65['delete'](id_3);
            run_3.worldBookIds = Array.from(value_65);
            const value_66 = new Map(
                    (run_3.worldBooks || []).map((value_68) => [String(value_68.id), value_68]),
                ),
                value_67 = new Map(
                    this.snapshotWorldBooks(run_3.worldBookIds).map((value_69) => [
                        String(value_69.id),
                        value_69,
                    ]),
                );
            run_3.worldBooks = run_3.worldBookIds
                .map((value_70) => value_66.get(String(value_70)) || value_67.get(String(value_70)))
                .filter(Boolean);
        }
        if (event_9.target.dataset.action === 'upload-cast-avatar') {
            const id_4 = event_9.target.dataset.castId;
            this.readImageFile(event_9.target, (avatar_2) => {
                const actor_4 = run_3.cast.find((item_4) => item_4.id === id_4);
                if (actor_4) actor_4.avatar = avatar_2;
                this.refreshDraftEditor();
                this.persistLiveSetup();
            });
        }
        event_9.target.matches(
            '[data-setup-field], [data-attribute-field], [data-cast-field], [data-worldbook-id], [data-worldbook-content]',
        ) && this.persistLiveSetup();
        if (
            event_9.target.matches('[data-worldbook-id]') &&
            this.infoTitle.textContent === '故事'
        ) {
            const scrollTop_2 = this.infoBody.scrollTop;
            this.showGameStory();
            this.infoBody.scrollTop = scrollTop_2;
        }
    }
    ['getEditableSetup']() {
        if (this.hubDraftOpen) return this.setupDraft;
        const activeRun_76 = this.state.activeRun;
        if (!activeRun_76?.setup) return null;
        return (
            (activeRun_76.setup.cast = activeRun_76.cast),
            (activeRun_76.setup.attributes = activeRun_76.attributes),
            (activeRun_76.setup.worldBookIds ||= (activeRun_76.setup.worldBooks || []).map(
                (value_77) => value_77.id,
            )),
            activeRun_76.setup
        );
    }
    ['persistLiveSetup']() {
        if (this.hubDraftOpen || !this.state.activeRun) return;
        const pendingRun = this.state.activeRun;
        pendingRun.cast = this.core.normalizeCast(pendingRun.setup.cast);
        pendingRun.attributes = this.core.normalizeAttributes(
            pendingRun.setup.attributes,
            () => 0.5,
        );
        pendingRun.setup.cast = pendingRun.cast;
        pendingRun.setup.attributes = pendingRun.attributes;
        pendingRun.updatedAt = Date.now();
        if (this.findCatalogItem(pendingRun.setup.sourceId)) this.upsertRecent(pendingRun.setup);
        this.updateAutoSave(false);
    }
    ['readImageFile'](value_79, callback) {
        const value_80 = value_79.files?.[0];
        if (!value_80) return;
        const reader = new FileReader();
        reader.onload = () => callback(String(reader.result || ''));
        reader.readAsDataURL(value_80);
        value_79.value = '';
    }
    ['getUserState']() {
        if (typeof window.getUserState === 'function') return window.getUserState() || {};
        return window.userState && typeof window.userState === 'object' ? window.userState : {};
    }
    ['getUserActor']() {
        const user = this.getUserState();
        return {
            id: 'user-current',
            sourceId: 'user-current',
            type: 'user',
            name: String(user.name || user.realName || 'User'),
            persona: String(user.persona || user.signature || user.bio || ''),
            avatar: String(user.avatarUrl || user.avatar || ''),
            affinity: null,
        };
    }
    ['getWorldBooks']() {
        try {
            if (typeof window.getWorldBooks === 'function') return window.getWorldBooks() || [];
        } catch (error_4) {
            console.warn('[Netflix] world books unavailable:', error_4);
        }
        return [];
    }
    ['snapshotWorldBooks'](ids_2) {
        const selected = new Set((Array.isArray(ids_2) ? ids_2 : []).map(String));
        return this.getWorldBooks()
            .filter((book) => selected.has(String(book.id)))
            .map((book_2) => ({
                id: String(book_2.id),
                name: String(book_2.name || '未命名世界书'),
                content: (Array.isArray(book_2.entries) ? book_2.entries : [])
                    .filter((entry) => entry && entry.enabled !== false)
                    .map((message_85) =>
                        (
                            '【' +
                            (message_85.title || message_85.name || message_85.keyword || '词条') +
                            `】
` +
                            (message_85.content || '')
                        ).trim(),
                    )
                    .filter(Boolean).join(`

`),
            }));
    }
    ['renderAvatarMarkup'](actor_5, value_87 = '') {
        const name_2 = String(actor_5?.name || '?');
        return actor_5?.avatar
            ? '<span class="netflix-avatar-image ' +
                  value_87 +
                  '"><img src="' +
                  this.escapeAttr(actor_5.avatar) +
                  '" alt=""></span>'
            : '<span class="netflix-avatar-fallback ' +
                  value_87 +
                  '">' +
                  this.escapeHtml(name_2.slice(0, 1).toUpperCase()) +
                  '</span>';
    }
    ['renderHome']() {
        const catalog = this.normalizeCatalog(this.state.homeCatalog);
        this.state.homeCatalog = catalog;
        const banners_3 = catalog.banners,
            rows = [
                catalog.recent.length
                    ? this.renderCatalogRow('继续你的故事', catalog.recent, true)
                    : '',
                ...Object.entries(catalog.sections).map(([title_3, items_2]) =>
                    this.renderCatalogRow(title_3, items_2, false),
                ),
            ]
                .filter(Boolean)
                .join(''),
            hasTitles =
                banners_3.length ||
                catalog.recent.length ||
                Object.values(catalog.sections).some((items_3) => items_3.length);
        this.homeContent.innerHTML = hasTitles
            ? `
            ` +
              (banners_3.length
                  ? `<div class="netflix-hero-scroll">
                ` +
                    banners_3
                        .map(
                            (value_95, value_96) =>
                                `
                    <article class="netflix-hero" style="--hero-image:url('` +
                                this.escapeAttr(value_95.coverUrl) +
                                `')">
                        <div class="netflix-hero-copy">
                            <span>` +
                                this.escapeHtml(value_95.category) +
                                `</span>
                            <h1>` +
                                this.escapeHtml(value_95.title) +
                                `</h1>
                            <p>` +
                                this.escapeHtml(value_95.summary || '开启一段属于你的互动故事。') +
                                `</p>
                            <button type="button" data-catalog-id="` +
                                this.escapeAttr(value_95.id) +
                                `"><i class="fas fa-play"></i> 播放</button>
                        </div>
                        <div class="netflix-hero-index">0` +
                                (value_96 + 1) +
                                `</div>
                    </article>`,
                        )
                        .join('') +
                    `
            </div>`
                  : '') +
              `
            ` +
              rows +
              `
        `
            : '<div class="netflix-catalog-empty"><i class="fas fa-film"></i><h2>片库是空的</h2><p>可以通过右上角搜索生成新的互动故事。</p><button type="button" data-action="open-search">创建故事</button></div>';
    }
    ['renderCatalogRow'](value_97, items_98, value_99) {
        return (
            `<section class="netflix-row">
            <header><h2>` +
            this.escapeHtml(value_97) +
            '</h2><span>' +
            items_98.length +
            ` 部</span></header>
            <div class="netflix-row-scroll">
                ` +
            items_98
                .map(
                    (item_5) =>
                        '<button type="button" class="netflix-catalog-card ' +
                        (value_99 ? 'is-landscape' : '') +
                        '" data-catalog-id="' +
                        this.escapeAttr(item_5.id) +
                        `">
                    <span class="netflix-catalog-cover" style="background-image:url('` +
                        this.escapeAttr(item_5.coverUrl) +
                        `')"></span>
                    <strong>` +
                        this.escapeHtml(item_5.title) +
                        '</strong><small>' +
                        this.escapeHtml(
                            [item_5.category, ...(item_5.tags || [])].slice(0, 2).join(' · '),
                        ) +
                        `</small>
                </button>`,
                )
                .join('') +
            `
            </div>
        </section>`
        );
    }
    ['findCatalogItem'](id_5) {
        const catalog_2 = this.normalizeCatalog(this.state.homeCatalog),
            all = [
                ...catalog_2.banners,
                ...catalog_2.recent,
                ...Object.values(catalog_2.sections).flat(),
            ];
        return all.find((item) => String(item.id) === String(id_5)) || null;
    }
    async ['deleteCatalogTitle']() {
        const value_104 = this.hubDraftOpen
                ? this.setupDraft?.sourceId
                : this.state.activeRun?.sourceId || this.state.activeRun?.setup?.sourceId,
            value_105 = value_104 ? this.findCatalogItem(value_104) : null;
        if (this.isBusy || !value_105) return this.toast('这个故事已不在片库中');
        if (
            !window.confirm(
                '确定从片库删除《' +
                    value_105.title +
                    `》吗？
存档和已解锁结局会保留。`,
            )
        )
            return;
        const id_6 = String(value_105.id),
            catalog_3 = this.normalizeCatalog(this.state.homeCatalog);
        catalog_3.banners = catalog_3.banners.filter((entry_2) => String(entry_2.id) !== id_6);
        catalog_3.recent = catalog_3.recent.filter((entry_3) => String(entry_3.id) !== id_6);
        catalog_3.sections = Object.entries(catalog_3.sections).reduce(
            (result_2, [name_3, items_4]) => {
                const remaining = items_4.filter((entry_4) => String(entry_4.id) !== id_6);
                if (remaining.length) result_2[name_3] = remaining;
                return result_2;
            },
            {},
        );
        this.state.homeCatalog = catalog_3;
        await this.saveState({
            flush: true,
        });
        this.returnToNetflix();
        this.toast('故事已从片库删除，存档仍然保留');
    }
    ['renderProfile']() {
        const user_2 = this.getUserActor(),
            manualCount = this.state.saveSlots.manual.filter(Boolean).length,
            endingCount = this.state.unlockedEndings.length;
        this.profilePanel.innerHTML =
            `
            <div class="netflix-profile-hero">
                ` +
            this.renderAvatarMarkup(user_2, 'netflix-profile-avatar') +
            `
                <div><span>PLAYER PROFILE</span><h1>` +
            this.escapeHtml(user_2.name) +
            `</h1></div>
            </div>
            <div class="netflix-profile-stats">
                <div><strong>` +
            manualCount +
            `</strong><span>手动存档</span></div>
                <div><strong>` +
            endingCount +
            `</strong><span>已解锁结局</span></div>
            </div>
            <div class="netflix-profile-actions">
                <button type="button" data-action="open-load"><i class="fas fa-folder-open"></i><span><strong>存档管理</strong><small>自动档与 6 个手动档</small></span><i class="fas fa-chevron-right"></i></button>
                <button type="button" data-action="show-endings"><i class="fas fa-trophy"></i><span><strong>结局收藏</strong><small>回顾已经抵达的故事终点</small></span><i class="fas fa-chevron-right"></i></button>
            </div>`;
        const headerAvatar = this.view.querySelector('.netflix-header-avatar');
        if (headerAvatar)
            headerAvatar.innerHTML = user_2.avatar
                ? '<img src="' + this.escapeAttr(user_2.avatar) + '" alt="">'
                : '<i class="fas fa-user"></i>';
    }
    ['renderNav']() {
        this.view
            .querySelectorAll('[data-tab]')
            .forEach((button_2) =>
                button_2.classList.toggle('is-active', button_2.dataset.tab === this.activeTab),
            );
        this.view
            .querySelectorAll('[data-panel]')
            .forEach((panel_2) =>
                panel_2.classList.toggle('is-active', panel_2.dataset.panel === this.activeTab),
            );
    }
    ['switchTab'](tabName = 'home') {
        this.activeTab = tabName === 'profile' ? 'profile' : 'home';
        this.renderNav();
        if (this.activeTab === 'profile') this.renderProfile();
        if (this.content) this.content.scrollTop = 0;
    }
    ['openSearch']() {
        this.searchInput.value = '';
        this.openSheet(this.searchSheet);
        setTimeout(
            () =>
                this.searchInput?.focus({
                    preventScroll: true,
                }),
            80,
        );
    }
    async ['generateCatalog']() {
        if (this.isSearchBusy) return;
        if (!this.hasApiConfig()) return this.toast('请先在设置中配置大模型 API');
        this.isSearchBusy = true;
        this.searchConfirm.disabled = true;
        this.searchConfirm.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中';
        const query = this.searchInput.value.trim();
        try {
            const prompt =
                    '你正在生成 Netflix 互动文游片库。' +
                    (query ? '用户偏好：' + query : '请随机选择有戏剧张力的题材。') +
                    `
只返回 JSON 对象，不要 Markdown。格式：{"banners":[作品,作品,作品],"sections":{"为你推荐":[作品,作品,作品,作品],"恋爱剧情":[作品,作品,作品],"成长养成":[作品,作品,作品],"悬疑奇幻":[作品,作品,作品]}}。每个作品格式：{"id":"唯一英文id","title":"中文片名","category":"分类","summary":"80字内世界与矛盾简介","tags":["标签1","标签2"],"coverUrl":"https://picsum.photos/seed/英文关键词/720/1080?grayscale","cast":[{"name":"角色名","persona":"人物人设"}]}。必须恰好生成上述数量。`,
                raw_2 = await this.requestJson(prompt),
                parsed = this.core.cleanJsonText(raw_2),
                catalog_122 = this.normalizeCatalog({
                    banners: parsed.banners,
                    sections: parsed.sections,
                    recent: this.state.homeCatalog.recent,
                });
            if (
                catalog_122.banners.length < 3 ||
                Object.values(catalog_122.sections).some((items_5) => items_5.length < 3)
            )
                throw new Error('片库数量不完整');
            this.state.homeCatalog = catalog_122;
            await this.saveState({
                flush: true,
            });
            this.renderHome();
            this.closeSheet(this.searchSheet);
            this.toast('新的片库已生成');
        } catch (error_5) {
            console.error('[Netflix] catalog generation failed:', error_5);
            if (
                !window.u2Api?.isRequestError?.(error_5) ||
                !window.u2Api.reportError(error_5, {
                    operation: '片库生成',
                })
            )
                this.toast(error_5?.message || '片库生成失败');
        } finally {
            this.isSearchBusy = false;
            this.searchConfirm.disabled = false;
            this.searchConfirm.innerHTML = '生成片库';
        }
    }
    ['createSetupDraft'](value_125) {
        const filmCast = (value_125.cast || []).map((value_127, value_128) => ({
            ...value_127,
            id: 'film-' + value_125.id + '-' + value_128,
            type: 'custom',
            affinity: 50,
        }));
        return {
            sourceId: value_125.id,
            title: value_125.title,
            category: value_125.category,
            coverUrl: value_125.coverUrl,
            worldview: value_125.summary || '',
            premise: value_125.summary || '',
            worldBookIds: [],
            worldBooks: [],
            cast: this.core.normalizeCast([this.getUserActor(), ...filmCast]),
            attributes: this.core.createDefaultAttributes(),
        };
    }
    ['openSetup'](item_6) {
        if (!item_6) return;
        this.setupDraft = this.createSetupDraft(item_6);
        this.hubDraftOpen = true;
        this.hubOpen = true;
        this.setupView.classList.remove('is-active');
        this.setupView.setAttribute('aria-hidden', 'true');
        this.gameView.classList.add('is-active');
        this.gameView.setAttribute('aria-hidden', 'false');
        this.renderGameHub();
        this.gameHub.querySelector('button')?.focus({
            preventScroll: true,
        });
    }
    ['closeSetup']() {
        if (this.isBusy) return;
        this.setupView.classList.remove('is-active');
        this.setupView.setAttribute('aria-hidden', 'true');
    }
    ['renderSetup']() {
        if (!this.setupDraft) return;
        const worldBooks_130 = this.getWorldBooks(),
            selectedBooks = new Set((this.setupDraft.worldBookIds || []).map(String));
        this.setupBody.innerHTML =
            `
            <section class="netflix-setup-cover" style="--setup-cover:url('` +
            this.escapeAttr(this.setupDraft.coverUrl) +
            `')">
                <div><span>GAME PROJECT</span><h1>` +
            this.escapeHtml(this.setupDraft.title || '未命名游戏') +
            `</h1></div>
            </section>
            <section class="netflix-setup-section">
                <div class="netflix-section-heading"><span>01</span><div><h2>故事设定</h2><p>影片资料已预填，可以完全改写。</p></div></div>
                <label class="netflix-field"><span>游戏标题</span><input type="text" maxlength="60" data-setup-field="title" value="` +
            this.escapeAttr(this.setupDraft.title) +
            `"></label>
                <label class="netflix-field"><span>世界观设定</span><textarea maxlength="8000" data-setup-field="worldview" placeholder="时代、地点、社会规则与不可违背的设定">` +
            this.escapeHtml(this.setupDraft.worldview) +
            `</textarea></label>
                <label class="netflix-field"><span>故事前提</span><textarea maxlength="4000" data-setup-field="premise" placeholder="主线矛盾、开局处境与希望体验的故事方向">` +
            this.escapeHtml(this.setupDraft.premise) +
            `</textarea></label>
            </section>
            <section class="netflix-setup-section">
                <div class="netflix-section-heading"><span>02</span><div><h2>主演人设</h2><p>玩家固定参与；Char 与自定义 NPC 会保存为独立快照。</p></div><button type="button" class="netflix-section-action" data-action="open-cast-picker"><i class="fas fa-plus"></i> 添加</button></div>
                <div class="netflix-setup-cast-list">
                    ` +
            this.setupDraft.cast.map((actor_6) => this.renderSetupActor(actor_6)).join('') +
            `
                </div>
            </section>
            <section class="netflix-setup-section">
                <div class="netflix-section-heading"><span>03</span><div><h2>User 属性</h2><p>初始值随机 0–100，可直接修改。</p></div><button type="button" class="netflix-section-action" data-action="reroll-attributes"><i class="fas fa-dice"></i> 重随机</button></div>
                <div class="netflix-attribute-grid">
                    ` +
            this.setupDraft.attributes
                .map((attribute_3) => this.renderSetupAttribute(attribute_3))
                .join('') +
            `
                </div>
                <button type="button" class="netflix-dashed-button" data-action="add-attribute"><i class="fas fa-plus"></i> 添加自定义属性</button>
            </section>
            <section class="netflix-setup-section">
                <div class="netflix-section-heading"><span>04</span><div><h2>世界书</h2><p>开始后保存词条快照，不受后续修改影响。</p></div></div>
                <div class="netflix-worldbook-options">
                    ` +
            (worldBooks_130.length
                ? worldBooks_130
                      .map(
                          (book_3) =>
                              '<label><span><i class="fas fa-book"></i><b>' +
                              this.escapeHtml(book_3.name || '未命名世界书') +
                              '</b><small>' +
                              (Array.isArray(book_3.entries) ? book_3.entries.length : 0) +
                              ' 条词条</small></span><input type="checkbox" data-worldbook-id="' +
                              this.escapeAttr(book_3.id) +
                              '" ' +
                              (selectedBooks.has(String(book_3.id)) ? 'checked' : '') +
                              '></label>',
                      )
                      .join('')
                : '<div class="netflix-empty-state">暂无世界书，可直接使用上方世界观开始。</div>') +
            `
                </div>
            </section>
            <div class="netflix-setup-actions">
                <button type="button" class="netflix-secondary-button" data-action="open-load"><i class="fas fa-folder-open"></i> 读档</button>
                <button type="button" class="netflix-primary-button" data-action="start-game" id="netflix-start-game-button"><i class="fas fa-play"></i> 开始播放</button>
            </div>`;
    }
    ['renderSetupActor'](contact_135) {
        return (
            '<article class="netflix-setup-actor" data-actor-card="' +
            this.escapeAttr(contact_135.id) +
            `">
            <div class="netflix-actor-visual">
                ` +
            this.renderAvatarMarkup(contact_135) +
            `
                <label aria-label="更换头像"><i class="fas fa-camera"></i><input type="file" accept="image/*" data-action="upload-cast-avatar" data-cast-id="` +
            this.escapeAttr(contact_135.id) +
            `"></label>
            </div>
            <div class="netflix-actor-fields">
                <div class="netflix-actor-title"><span>` +
            (contact_135.type === 'user'
                ? 'PLAYER · ' + this.escapeHtml(contact_135.name)
                : '' +
                  (contact_135.type === 'char' ? 'CHAR' : 'NPC') +
                  (this.hubDraftOpen
                      ? ''
                      : ' · ' + (contact_135.acquainted ? '已结识' : '待相识'))) +
            '</span>' +
            (contact_135.type !== 'user'
                ? '<button type="button" data-action="delete-cast" data-cast-id="' +
                  this.escapeAttr(contact_135.id) +
                  '" aria-label="移除主演"><i class="fas fa-trash-alt"></i></button>'
                : '') +
            `</div>
                <label class="netflix-field compact"><span>姓名</span><input type="text" maxlength="40" data-cast-id="` +
            this.escapeAttr(contact_135.id) +
            '" data-cast-field="name" value="' +
            this.escapeAttr(contact_135.name) +
            `"></label>
                <label class="netflix-field compact"><span>人设</span><textarea maxlength="3000" data-cast-id="` +
            this.escapeAttr(contact_135.id) +
            '" data-cast-field="persona" placeholder="性格、背景、关系与说话方式">' +
            this.escapeHtml(contact_135.persona) +
            `</textarea></label>
                ` +
            (contact_135.type !== 'user'
                ? '<label class="netflix-affinity-field"><span>' +
                  (this.hubDraftOpen ? '初始好感度' : '当前好感度') +
                  '</span><input type="number" min="0" max="100" inputmode="numeric" data-cast-id="' +
                  this.escapeAttr(contact_135.id) +
                  '" data-cast-field="affinity" value="' +
                  contact_135.affinity +
                  '"><b>' +
                  contact_135.affinity +
                  '</b></label>'
                : '') +
            `
            </div>
        </article>`
        );
    }
    ['renderSetupAttribute'](value_136) {
        return (
            `<div class="netflix-attribute-editor">
            ` +
            (value_136.isDefault
                ? '<strong>' + this.escapeHtml(value_136.name) + '</strong>'
                : '<input type="text" maxlength="24" data-attribute-id="' +
                  this.escapeAttr(value_136.id) +
                  '" data-attribute-field="name" value="' +
                  this.escapeAttr(value_136.name) +
                  '" aria-label="属性名">') +
            `
            <input type="number" min="0" max="100" inputmode="numeric" data-attribute-id="` +
            this.escapeAttr(value_136.id) +
            '" data-attribute-field="value" value="' +
            value_136.value +
            '" aria-label="' +
            this.escapeAttr(value_136.name) +
            `数值">
            ` +
            (value_136.isDefault
                ? '<span>/ 100</span>'
                : '<button type="button" data-action="delete-attribute" data-attribute-id="' +
                  this.escapeAttr(value_136.id) +
                  '" aria-label="删除属性"><i class="fas fa-times"></i></button>') +
            `
        </div>`
        );
    }
    ['rerollAttributes']() {
        const editableSetup_137 = this.getEditableSetup();
        if (!editableSetup_137) return;
        const map_138 = editableSetup_137.attributes
            .filter((attribute) => !attribute.isDefault)
            .map((attribute_4) => ({
                ...attribute_4,
                value: this.core.randomAttributeValue(),
            }));
        editableSetup_137.attributes = [...this.core.createDefaultAttributes(), ...map_138];
        if (!this.hubDraftOpen) this.state.activeRun.attributes = editableSetup_137.attributes;
        this.persistLiveSetup();
        this.refreshDraftEditor();
    }
    ['addCustomAttribute']() {
        const editableSetup_140 = this.getEditableSetup();
        if (!editableSetup_140) return;
        editableSetup_140.attributes.push({
            id: 'custom-' + Date.now(),
            name: '新属性',
            value: this.core.randomAttributeValue(),
            isDefault: false,
        });
        this.persistLiveSetup();
        this.refreshDraftEditor();
    }
    ['deleteCustomAttribute'](id_7) {
        const editableSetup_142 = this.getEditableSetup();
        if (!editableSetup_142) return;
        editableSetup_142.attributes = editableSetup_142.attributes.filter(
            (attribute_5) => attribute_5.isDefault || attribute_5.id !== id_7,
        );
        if (!this.hubDraftOpen) this.state.activeRun.attributes = editableSetup_142.attributes;
        this.persistLiveSetup();
        this.refreshDraftEditor();
    }
    async ['getAvailableCharacters']() {
        let friends_2 = [];
        try {
            if (window.imStorage?.loadFriends) friends_2 = await window.imStorage.loadFriends();
            else {
                if (typeof window.getAppState === 'function')
                    friends_2 = window.getAppState('imessage')?.friends || [];
            }
        } catch (error_6) {
            console.warn('[Netflix] Char list unavailable:', error_6);
        }
        return (Array.isArray(friends_2) ? friends_2 : [])
            .filter((friend) => friend?.type === 'char')
            .map((friend_2) => ({
                id: 'char-' + (friend_2.id || friend_2.realName || friend_2.name),
                sourceId: String(friend_2.id || ''),
                type: 'char',
                name: String(friend_2.nickname || friend_2.name || friend_2.realName || 'Char'),
                persona: String(
                    friend_2.persona || friend_2.desc || friend_2.signature || friend_2.bio || '',
                ),
                avatar: String(
                    friend_2.avatarUrl || friend_2.avatar || friend_2.avatarDataUrl || '',
                ),
                affinity: 50,
            }));
    }
    async ['openCastPicker']() {
        const editableSetup_147 = this.getEditableSetup();
        if (!editableSetup_147) return;
        this.castPickerReturnToRelations = this.gameView.classList.contains('is-active');
        if (this.castPickerReturnToRelations) this.closeSheet(this.infoSheet);
        this.castPickerList.innerHTML =
            '<div class="netflix-empty-state"><i class="fas fa-spinner fa-spin"></i> 正在读取 Char…</div>';
        this.openSheet(this.castPickerSheet);
        this.availableCharacters = await this.getAvailableCharacters();
        const value_148 = new Set(
            editableSetup_147.cast.map((value_149) => value_149.sourceId).filter(Boolean),
        );
        this.castPickerList.innerHTML = this.availableCharacters.length
            ? this.availableCharacters
                  .map(
                      (actor_7) =>
                          '<button type="button" data-action="add-existing-cast" data-character-id="' +
                          this.escapeAttr(actor_7.id) +
                          '" ' +
                          (value_148.has(actor_7.sourceId) ? 'disabled' : '') +
                          '>' +
                          this.renderAvatarMarkup(actor_7) +
                          '<span><strong>' +
                          this.escapeHtml(actor_7.name) +
                          '</strong><small>' +
                          this.escapeHtml(actor_7.persona || '暂无人设') +
                          '</small></span><i class="fas ' +
                          (value_148.has(actor_7.sourceId) ? 'fa-check' : 'fa-plus') +
                          '"></i></button>',
                  )
                  .join('')
            : '<div class="netflix-empty-state">暂无可用 Char，请先在 iMessage 添加。</div>';
    }
    ['addExistingCharacter'](id_8) {
        const actor = this.availableCharacters.find((item_7) => item_7.id === id_8),
            editableSetup_152 = this.getEditableSetup();
        if (!actor || !editableSetup_152) return;
        if (
            !editableSetup_152.cast.some(
                (item_8) => item_8.sourceId && item_8.sourceId === actor.sourceId,
            )
        )
            editableSetup_152.cast.push({
                ...this.core.clone(actor),
                origin: 'setup',
                acquainted: false,
            });
        this.persistLiveSetup();
        this.closeCastPicker();
    }
    ['addCustomCast']() {
        const editableSetup_155 = this.getEditableSetup();
        if (!editableSetup_155) return;
        editableSetup_155.cast.push({
            id: 'custom-cast-' + Date.now(),
            sourceId: '',
            type: 'custom',
            origin: 'setup',
            acquainted: false,
            name: '新角色',
            persona: '',
            avatar: '',
            affinity: 50,
        });
        this.persistLiveSetup();
        this.closeCastPicker();
    }
    ['deleteCast'](id_9) {
        const editableSetup_157 = this.getEditableSetup();
        if (!editableSetup_157) return;
        editableSetup_157.cast = editableSetup_157.cast.filter(
            (actor_8) => actor_8.type === 'user' || actor_8.id !== id_9,
        );
        if (!this.hubDraftOpen) this.state.activeRun.cast = editableSetup_157.cast;
        this.persistLiveSetup();
        this.refreshDraftEditor();
    }
    ['closeCastPicker']() {
        this.closeSheet(this.castPickerSheet);
        if (this.castPickerReturnToRelations) this.showGameRelations();
        this.castPickerReturnToRelations = false;
    }
    ['refreshDraftEditor']() {
        if (this.setupView.classList.contains('is-active')) return this.renderSetup();
        if (this.infoSheet.classList.contains('is-active')) {
            if (this.infoTitle.textContent === '属性') this.showAttributes();
            else {
                if (this.infoTitle.textContent === '关系') this.showGameRelations();
                else {
                    if (this.infoTitle.textContent === '故事') this.showGameStory();
                }
            }
        }
        if (this.hubOpen) this.renderGameHub();
    }
    ['closeInfo']() {
        if (['故事', '关系', '属性'].includes(this.infoTitle.textContent)) this.persistLiveSetup();
        this.closeSheet(this.infoSheet);
        if (this.hubOpen) this.renderGameHub();
    }
    ['validateSetup']() {
        if (!this.setupDraft?.title.trim()) throw new Error('请填写游戏标题');
        if (!this.setupDraft.worldview.trim()) throw new Error('请填写世界观设定');
        if (!this.setupDraft.premise.trim()) throw new Error('请填写故事前提');
        if (!this.setupDraft.cast.some((actor_9) => actor_9.type === 'user'))
            throw new Error('主演中必须包含玩家');
        if (this.setupDraft.cast.some((actor_10) => !String(actor_10.name || '').trim()))
            throw new Error('主演姓名不能为空');
        const names = this.setupDraft.attributes.map((attribute_6) =>
            String(attribute_6.name || '').trim(),
        );
        if (names.some((name_4) => !name_4)) throw new Error('属性名称不能为空');
        if (new Set(names).size !== names.length) throw new Error('属性名称不能重复');
        if (!this.hasApiConfig()) throw new Error('请先在设置中配置大模型 API');
    }
    ['createRunFromDraft']() {
        const now_164 = Date.now(),
            setup_2 = {
                ...this.core.clone(this.setupDraft),
                title: this.setupDraft.title.trim(),
                worldview: this.setupDraft.worldview.trim(),
                premise: this.setupDraft.premise.trim(),
                worldBooks: this.core.clone(this.setupDraft.worldBooks || []),
            };
        return {
            id: 'run-' + now_164,
            sourceId: setup_2.sourceId,
            homeBackgroundUrl: String(setup_2.homeBackgroundUrl || ''),
            phase: 'prologue',
            viewMode: 'story',
            storyReturnPoint: null,
            sceneNumber: 0,
            beatIndex: 0,
            setup: setup_2,
            attributes: this.core.normalizeAttributes(setup_2.attributes, () => 0.5),
            cast: this.core.normalizeCast(
                setup_2.cast.map((actor_11) =>
                    actor_11.type === 'user'
                        ? actor_11
                        : {
                              ...actor_11,
                              origin: 'setup',
                              acquainted: false,
                              profileComplete: false,
                              companionEligible: true,
                          },
                ),
            ),
            flags: [],
            storySummary: '',
            currentScene: null,
            storyLog: [],
            training: this.core.createDefaultTraining(),
            pendingIdentityCard: null,
            lastChoice: null,
            startedAt: now_164,
            updatedAt: now_164,
        };
    }
    async ['startNewGame']() {
        if (this.isBusy) return;
        try {
            this.validateSetup();
        } catch (error_7) {
            return this.toast(error_7.message);
        }
        if (this.state.saveSlots.auto && !window.confirm('开始新游戏会覆盖当前自动档，是否继续？'))
            return;
        this.closeSheet(this.infoSheet);
        const pendingRun_2 = this.createRunFromDraft();
        this.pendingRunPreview = pendingRun_2;
        this.showPendingGame(pendingRun_2, '正在生成序章', '正在建立世界与人物关系，请稍候。');
        this.setBusy(true, '正在生成序章…');
        try {
            const raw_3 = await this.requestJson(
                    this.buildScenePrompt(pendingRun_2, 'prologue', null),
                ),
                scene = this.normalizeSceneForRun(raw_3, 'prologue', pendingRun_2);
            pendingRun_2.cast = this.core.mergeCharacterProfiles(
                pendingRun_2.cast,
                scene.characterProfiles,
                {
                    sceneId: scene.id,
                    seenAt: scene.createdAt,
                },
            );
            pendingRun_2.currentScene = scene;
            pendingRun_2.storySummary = scene.storySummary || scene.outcome.summary || '';
            pendingRun_2.storyLog = [this.createLogEntry(scene)];
            pendingRun_2.updatedAt = Date.now();
            this.state.activeRun = pendingRun_2;
            this.upsertRecent(pendingRun_2.setup);
            await this.updateAutoSave(true);
            this.closeSetup();
            this.hubDraftOpen = false;
            this.setupDraft = null;
            this.openGame();
        } catch (error_8) {
            console.error('[Netflix] prologue generation failed:', error_8);
            this.hidePendingGame(true);
            if (
                !window.u2Api?.isRequestError?.(error_8) ||
                !window.u2Api.reportError(error_8, {
                    operation: '序章生成',
                })
            )
                this.toast(error_8?.message || '序章生成失败，请重试');
        } finally {
            this.pendingRunPreview = null;
            this.setBusy(false);
        }
    }
    ['buildScenePrompt'](run_4, phase_2, value_172) {
        const value_173 = run_4.setup || {},
            join_174 = (value_173.worldBooks || [])
                .map(
                    (message_183) =>
                        '《' +
                        message_183.name +
                        `》
` +
                        message_183.content,
                )
                .filter(Boolean).join(`

`),
            join_175 = (run_4.attributes || [])
                .map((value_184) => value_184.id + '（' + value_184.name + '）=' + value_184.value)
                .join('；'),
            join_176 = (run_4.cast || []).map((actor_12) => {
                if (actor_12.type === 'user')
                    return (
                        actor_12.id +
                        ' | ' +
                        actor_12.name +
                        ' | 玩家本人，所有对话必须显示姓名“' +
                        actor_12.name +
                        '”'
                    );
                const relation = actor_12.acquainted ? '已结识' : '已登场但未结识',
                    value_187 = actor_12.profileComplete
                        ? '身份：' +
                          actor_12.identity +
                          '；职业：' +
                          actor_12.occupation +
                          '；阵营：' +
                          actor_12.faction +
                          '；角色属性：' +
                          actor_12.characterAttributes
                              .map((value_188) => '' + value_188.name + value_188.value)
                              .join('、')
                        : '身份档案尚未补全，本次实际登场时必须返回 characterProfiles 档案';
                return (
                    actor_12.id +
                    ' | ' +
                    actor_12.name +
                    ' | ' +
                    (actor_12.origin === 'story' ? '剧情人物' : '开局主演') +
                    ' | ' +
                    relation +
                    ' | 好感度' +
                    actor_12.affinity +
                    ' | ' +
                    (actor_12.companionEligible ? '可同行' : '不可同行') +
                    `
` +
                    value_187 +
                    `
人设：` +
                    (actor_12.persona || '未填写')
                );
            }).join(`

`),
            join_177 = (run_4.storyLog || []).slice(-2).map(
                (value_189) =>
                    value_189.title +
                    `
` +
                    value_189.beats.map(
                        (value_190) =>
                            '' +
                            (value_190.speakerName ? value_190.speakerName + '：' : '') +
                            value_190.text,
                    ).join(`
`),
            ).join(`

`),
            trainingRecent =
                (run_4.training?.recentEventSummaries || []).slice(-3).join(`
`) || '无',
            value_179 =
                `【固定设定】
标题：` +
                value_173.title +
                `
分类：` +
                (value_173.category || '剧情') +
                `
世界观：` +
                value_173.worldview +
                `
故事前提：` +
                value_173.premise +
                `

【世界书快照】
` +
                (join_174 || '无') +
                `

【主演】
` +
                join_176 +
                `

【当前 User 属性】
` +
                join_175 +
                `

【累计剧情摘要】
` +
                (run_4.storySummary || '尚未开始') +
                `

【事件标记】
` +
                ((run_4.flags || []).join('、') || '无') +
                `

【最近养成事件】
` +
                trainingRecent +
                `

【最近场景】
` +
                (join_177 || '无'),
            text_180 = `只返回合法 JSON，不要 Markdown、代码围栏或解释。结构：
{"scene":{"id":"scene-id","title":"场景标题","beats":[{"id":"beat-1","kind":"narration","text":"旁白"},{"id":"beat-2","kind":"dialogue","speakerId":"稳定角色id","speakerName":"显示姓名","text":"对话"}],"characterProfiles":[{"id":"角色稳定id","triggerBeatId":"角色首次实际登场的beat id","name":"姓名","identity":"身份定位","occupation":"职业","faction":"阵营","persona":"完整人设","attributes":[{"id":"开局User属性id","value":0}],"initialAffinity":50,"companionEligible":false}]},"outcome":{"attributeDeltas":{"属性id":0},"affinityDeltas":{"已登记角色id":0},"summary":"更新后的完整剧情摘要","flags":["新增事件标记"]},"choices":[{"id":"choice-id","text":"玩家可执行的行动","requirements":{"attributes":{"属性id":最低值},"affinities":{"已登记角色id":最低值}}}],"storySummary":"更新后的完整剧情摘要","ending":null}。characterProfiles 只为首次登场的新具名角色或档案未补全的已有角色返回；每份档案必须绑定实际登场 beat。角色 attributes 必须逐项完整复用【当前 User 属性】中的全部属性 id，数量和 id 完全一致，只由你为每项选择 0–100 整数值；禁止新增、删除、改名或输出其他属性。剧情新角色 initialAffinity 必须为 30–70；无名路人不要建档。已登记人物必须复用原 id，禁止同名重复建档。单场数值变化只能为 -10 到 10。`;
        if (phase_2 === 'prologue')
            return (
                `你是中文养成文游的主笔。根据设定生成一次完整序章。序章必须有 8–14 条可逐条显示的内容，旁白与人物对话交错，对话必须有 speakerName 和稳定 speakerId；玩家角色只能使用主演快照中的真实姓名，禁止称为 U、User 或“玩家”。所有非 User 角色第一次实际登场都要按契约提供身份档案。只负责建立世界、人物关系和开局事件，不提供选项、不进行属性结算、不产生结局。

` +
                value_179 +
                `

` +
                text_180 +
                `
序章的 choices 必须是空数组，outcome 中所有变化为 0，ending 必须为 null。`
            );
        const value_181 = value_172
                ? '玩家刚刚选择：' + value_172.text + '（id=' + value_172.id + '）'
                : '这是第一章的第一个场景，没有上一选择。',
            canEnd = run_4.sceneNumber >= 8 || phase_2 === 'epilogue';
        return (
            '你是中文养成文游的主笔。生成下一个完整场景包：严格 12–18 条旁白/对话和 2–4 个差异明确的行动选项。先在 outcome 中结算上一选择，再写新场景。选项可以设置属性或好感度门槛，但必须至少有一个无门槛或按当前数值可满足的选项。所有对话必须使用稳定 speakerId；所有非 User 角色第一次实际登场都要按契约提供身份档案。玩家角色只能使用主演快照中的真实姓名，禁止称为 U、User 或“玩家”。如果玩家输入了不合理的自定义行动，应写出符合设定的失败尝试，不能扭曲世界规则。人物必须遵守人设，剧情要推进而非复述。' +
            (canEnd
                ? '如果剧情、属性和关系已经形成完整收束，可以返回自然结局；否则 ending 为 null。'
                : '主线不足 8 个场景，ending 必须为 null。') +
            `

` +
            value_179 +
            `

【本次输入】
` +
            value_181 +
            `

` +
            text_180 +
            `
` +
            (phase_2 === 'epilogue' ? '这是结局后的番外，不要重复解锁同一个结局。' : '')
        );
    }
    ['hasApiConfig']() {
        const config =
            typeof window.getApiConfig === 'function'
                ? window.getApiConfig()
                : window.apiConfig || {};
        return !!(config?.endpoint && config?.apiKey && config?.model);
    }
    async ['requestJson'](value_192) {
        const config_2 =
                typeof window.getApiConfig === 'function'
                    ? window.getApiConfig()
                    : window.apiConfig || {},
            endpoint_2 =
                window.u2Api?.resolveChatCompletionsEndpoint?.(config_2.endpoint || '') || '';
        if (!endpoint_2 || !config_2.apiKey || !config_2.model)
            throw new Error('请先在设置中完成 API 配置');
        const controller = new AbortController(),
            timeoutId = setTimeout(() => controller.abort(), 90000);
        try {
            const headers_2 = window.u2Api?.buildApiHeaders
                    ? window.u2Api.buildApiHeaders(config_2, {
                          'X-U2-Silent-Errors': '1',
                      })
                    : {
                          'Content-Type': 'application/json',
                          Authorization: 'Bearer ' + config_2.apiKey,
                          'X-U2-Silent-Errors': '1',
                      },
                response = await fetch(endpoint_2, {
                    method: 'POST',
                    headers: headers_2,
                    body: JSON.stringify({
                        model: config_2.model,
                        temperature: Number.isFinite(Number(config_2.temperature))
                            ? Number(config_2.temperature)
                            : 0.8,
                        messages: [
                            {
                                role: 'user',
                                content: value_192,
                            },
                        ],
                        response_format: {
                            type: 'json_object',
                        },
                    }),
                    signal: controller.signal,
                });
            if (!response.ok) {
                const detail = window.u2Api?.readApiError
                    ? await window.u2Api.readApiError(response)
                    : null;
                throw (
                    window.u2Api?.createHttpError?.(response, detail) ||
                    Object.assign(
                        new Error(
                            detail?.message || 'API 请求失败（HTTP ' + response.status + '）',
                        ),
                        {
                            status: response.status,
                        },
                    )
                );
            }
            const data = await response.json(),
                content_2 = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? '';
            return Array.isArray(content_2)
                ? content_2.map((item_9) => item_9?.text || item_9 || '').join('')
                : String(content_2 || '');
        } catch (value_202) {
            if (value_202?.name === 'AbortError')
                throw Object.assign(new Error('剧情生成超时，请重试'), {
                    name: 'TimeoutError',
                });
            throw value_202;
        } finally {
            clearTimeout(timeoutId);
        }
    }
    ['setBusy'](value_203, message_2 = '') {
        this.isBusy = !!value_203;
        this.view.classList.toggle('is-generating', this.isBusy);
        this.view
            .querySelectorAll(
                '#netflix-start-game-button, [data-choice-id], [data-training-choice-id], [data-location-id], [data-action="enter-main-game"], [data-action="continue-epilogue"], [data-action="submit-custom-choice"]',
            )
            .forEach((button) => {
                button.disabled = this.isBusy;
            });
        if (this.generationOverlay) {
            this.generationOverlay.classList.toggle(
                'is-active',
                this.isBusy && this.gameView.classList.contains('is-active'),
            );
            this.generationOverlay.setAttribute(
                'aria-hidden',
                String(!(this.isBusy && this.gameView.classList.contains('is-active'))),
            );
            if (this.isBusy) this.generationTitle.textContent = message_2 || '正在生成剧情…';
        }
    }
    ['normalizeSceneForRun'](raw_4, phase_3, run_5) {
        return this.core.resolvePlayerSpeakerNames(
            this.core.normalizeScenePayload(raw_4, {
                phase: phase_3,
                cast: run_5.cast,
                attributes: run_5.attributes,
            }),
            run_5.cast,
        );
    }
    ['showPendingGame'](value_208, title_4, detail_2) {
        this.setupView.classList.remove('is-active');
        this.setupView.setAttribute('aria-hidden', 'true');
        this.gameView.classList.add('is-active');
        this.gameView.setAttribute('aria-hidden', 'false');
        this.hubOpen = false;
        this.moveFocusToGameView();
        this.gameView.classList.remove('is-training', 'is-hub');
        this.gameHub.setAttribute('aria-hidden', 'true');
        this.gameBackdrop.style.backgroundImage = value_208.setup.coverUrl
            ? 'url("' + String(value_208.setup.coverUrl).replace(/["\\]/g, '\\$&') + '")'
            : '';
        this.gameTitle.textContent = value_208.setup.title;
        this.sceneHeading.innerHTML = '<span>NEW STORY</span><strong>故事即将开始</strong>';
        this.gameStage.innerHTML = '';
        this.gameMenuButton.hidden = true;
        this.generationTitle.textContent = title_4 || '正在生成剧情';
        this.generationDetail.textContent = detail_2 || '正在建立世界与人物关系，请稍候。';
    }
    ['hidePendingGame'](value_211 = false) {
        if (value_211 && this.hubDraftOpen) {
            this.hubOpen = true;
            this.renderGameHub();
            return;
        }
        this.gameView.classList.remove('is-active', 'is-training');
        this.gameView.setAttribute('aria-hidden', 'true');
        value_211 &&
            (this.setupView.classList.add('is-active'),
            this.setupView.setAttribute('aria-hidden', 'false'));
    }
    ['createLogEntry'](scene_2, selectedChoice_2 = null) {
        return {
            id: scene_2.id,
            title: scene_2.title,
            phase: scene_2.phase,
            beats: this.core.clone(scene_2.beats),
            characterProfiles: this.core.clone(scene_2.characterProfiles || []),
            selectedChoice: selectedChoice_2
                ? {
                      id: selectedChoice_2.id,
                      text: selectedChoice_2.text,
                  }
                : null,
            createdAt: scene_2.createdAt || Date.now(),
        };
    }
    async ['enterMainGame']() {
        if (this.isBusy || !this.state.activeRun) return;
        const current = this.core.clone(this.state.activeRun);
        this.setBusy(true, '正在进入第一章…');
        this.generationDetail.textContent = '正在根据序章生成第一个主线场景。';
        try {
            const raw_5 = await this.requestJson(this.buildScenePrompt(current, 'main', null)),
                currentScene_2 = this.normalizeSceneForRun(raw_5, 'main', current);
            current.cast = this.core.mergeCharacterProfiles(
                current.cast,
                currentScene_2.characterProfiles,
                {
                    sceneId: currentScene_2.id,
                    seenAt: currentScene_2.createdAt,
                },
            );
            let activeRun_2 = this.core.applyOutcome(current, currentScene_2.outcome);
            currentScene_2.choices = this.core.ensureUnlockedChoice(
                currentScene_2.choices,
                activeRun_2.attributes,
                activeRun_2.cast,
            );
            activeRun_2.phase = currentScene_2.ending ? 'ending' : 'main';
            activeRun_2.sceneNumber = 1;
            activeRun_2.beatIndex = 0;
            activeRun_2.currentScene = currentScene_2;
            activeRun_2.storySummary = currentScene_2.storySummary || activeRun_2.storySummary;
            activeRun_2.storyLog.push(this.createLogEntry(currentScene_2));
            activeRun_2.updatedAt = Date.now();
            this.state.activeRun = activeRun_2;
            this.recordEnding(currentScene_2.ending, activeRun_2);
            await this.updateAutoSave(true);
            this.renderGame();
        } catch (error_9) {
            console.error('[Netflix] first chapter generation failed:', error_9);
            if (
                !window.u2Api?.isRequestError?.(error_9) ||
                !window.u2Api.reportError(error_9, {
                    operation: '第一章生成',
                })
            )
                this.toast(error_9?.message || '第一章生成失败，请重试');
            this.renderGame();
        } finally {
            this.setBusy(false);
        }
    }
    async ['chooseStoryOption'](choiceId_2, providedChoice = null) {
        if (this.isBusy || !this.state.activeRun) return;
        const run_6 = this.state.activeRun,
            choice_2 =
                providedChoice ||
                (run_6.currentScene?.choices || []).find((item_10) => item_10.id === choiceId_2);
        if (!choice_2) return;
        const status_2 = this.core.getRequirementStatus(choice_2, run_6.attributes, run_6.cast);
        if (!status_2.unlocked) return this.toast('当前属性或好感度不足');
        const pending_2 = this.core.clone(run_6);
        this.pendingRequestChoice = choice_2;
        this.setBusy(true, '选择已经送达，正在续写…');
        this.generationDetail.textContent = '选择尚未结算，请勿重复点击。';
        try {
            const phase_4 = pending_2.phase === 'epilogue' ? 'epilogue' : 'main',
                raw_6 = await this.requestJson(this.buildScenePrompt(pending_2, phase_4, choice_2)),
                currentScene_3 = this.normalizeSceneForRun(raw_6, phase_4, pending_2);
            pending_2.cast = this.core.mergeCharacterProfiles(
                pending_2.cast,
                currentScene_3.characterProfiles,
                {
                    sceneId: currentScene_3.id,
                    seenAt: currentScene_3.createdAt,
                },
            );
            let applyOutcome_228 = this.core.applyOutcome(pending_2, currentScene_3.outcome);
            currentScene_3.choices = this.core.ensureUnlockedChoice(
                currentScene_3.choices,
                applyOutcome_228.attributes,
                applyOutcome_228.cast,
            );
            applyOutcome_228.phase = currentScene_3.ending ? 'ending' : phase_4;
            applyOutcome_228.sceneNumber += 1;
            applyOutcome_228.beatIndex = 0;
            applyOutcome_228.lastChoice = {
                id: choice_2.id,
                text: choice_2.text,
            };
            const previousLog = applyOutcome_228.storyLog[applyOutcome_228.storyLog.length - 1];
            if (previousLog)
                previousLog.selectedChoice = {
                    id: choice_2.id,
                    text: choice_2.text,
                };
            applyOutcome_228.currentScene = currentScene_3;
            applyOutcome_228.storySummary =
                currentScene_3.storySummary || applyOutcome_228.storySummary;
            applyOutcome_228.storyLog.push(this.createLogEntry(currentScene_3));
            applyOutcome_228.updatedAt = Date.now();
            this.state.activeRun = applyOutcome_228;
            this.customChoiceOpen = false;
            this.recordEnding(currentScene_3.ending, applyOutcome_228);
            await this.updateAutoSave(true);
            this.renderGame();
        } catch (error_10) {
            console.error('[Netflix] story continuation failed:', error_10);
            if (
                !window.u2Api?.isRequestError?.(error_10) ||
                !window.u2Api.reportError(error_10, {
                    operation: '剧情生成',
                })
            )
                this.toast(error_10?.message || '剧情生成失败，选择尚未结算');
            this.renderGame();
        } finally {
            this.pendingRequestChoice = null;
            this.setBusy(false);
        }
    }
    async ['continueEpilogue']() {
        if (this.isBusy || !this.state.activeRun) return;
        const pending_3 = this.core.clone(this.state.activeRun);
        pending_3.phase = 'epilogue';
        const choice_3 = {
            id: 'continue-epilogue',
            text: '从当前结局继续番外',
            requirements: {
                attributes: {},
                affinities: {},
            },
        };
        this.setBusy(true, '正在生成结局后的故事…');
        this.generationDetail.textContent = '正在延续当前结局与人物关系。';
        try {
            const raw_7 = await this.requestJson(
                    this.buildScenePrompt(pending_3, 'epilogue', choice_3),
                ),
                currentScene_4 = this.normalizeSceneForRun(raw_7, 'epilogue', pending_3);
            pending_3.cast = this.core.mergeCharacterProfiles(
                pending_3.cast,
                currentScene_4.characterProfiles,
                {
                    sceneId: currentScene_4.id,
                    seenAt: currentScene_4.createdAt,
                },
            );
            let activeRun_3 = this.core.applyOutcome(pending_3, currentScene_4.outcome);
            currentScene_4.ending = null;
            currentScene_4.choices.length < 2 &&
                (currentScene_4.choices = [
                    {
                        id: 'epilogue-forward',
                        text: '顺着眼前的生活继续前行',
                        requirements: {
                            attributes: {},
                            affinities: {},
                        },
                    },
                    {
                        id: 'epilogue-reflect',
                        text: '回望过去，再做一次新的决定',
                        requirements: {
                            attributes: {},
                            affinities: {},
                        },
                    },
                ]);
            currentScene_4.choices = this.core.ensureUnlockedChoice(
                currentScene_4.choices,
                activeRun_3.attributes,
                activeRun_3.cast,
            );
            activeRun_3.phase = 'epilogue';
            activeRun_3.sceneNumber += 1;
            activeRun_3.beatIndex = 0;
            activeRun_3.currentScene = currentScene_4;
            activeRun_3.storySummary = currentScene_4.storySummary || activeRun_3.storySummary;
            activeRun_3.storyLog.push(this.createLogEntry(currentScene_4));
            this.state.activeRun = activeRun_3;
            await this.updateAutoSave(true);
            this.renderGame();
        } catch (error_11) {
            console.error('[Netflix] epilogue generation failed:', error_11);
            if (
                !window.u2Api?.isRequestError?.(error_11) ||
                !window.u2Api.reportError(error_11, {
                    operation: '番外生成',
                })
            )
                this.toast(error_11?.message || '番外生成失败');
            this.renderGame();
        } finally {
            this.setBusy(false);
        }
    }
    ['recordEnding'](ending_2, run_7) {
        if (!ending_2) return;
        const record = {
                ...ending_2,
                runId: run_7.id,
                storyTitle: run_7.setup.title,
                sceneNumber: run_7.sceneNumber,
                unlockedAt: Date.now(),
            },
            exists = this.state.unlockedEndings.some(
                (item_11) => item_11.id === record.id && item_11.storyTitle === record.storyTitle,
            );
        if (!exists) this.state.unlockedEndings.unshift(record);
    }
    ['openGame']() {
        this.setupView.classList.remove('is-active');
        this.setupView.setAttribute('aria-hidden', 'true');
        this.hubDraftOpen = false;
        this.gameView.classList.add('is-active');
        this.gameView.setAttribute('aria-hidden', 'false');
        this.hubOpen = true;
        this.renderGame();
        if (!this.isBusy)
            this.gameHub.querySelector('button')?.focus({
                preventScroll: true,
            });
    }
    ['renderGame']() {
        const run_8 = this.state.activeRun;
        if (!run_8?.currentScene) return;
        if (this.hubOpen) {
            this.renderGameHub();
            return;
        }
        this.moveFocusToGameView();
        this.gameView.classList.remove('is-hub');
        this.gameHub.setAttribute('aria-hidden', 'true');
        if (run_8.viewMode === 'training') {
            this.renderTraining();
            return;
        }
        this.gameView.classList.remove('is-training');
        this.trainingView.setAttribute('aria-hidden', 'true');
        const scene_3 = run_8.currentScene,
            beat_2 = scene_3.beats[Math.min(run_8.beatIndex, scene_3.beats.length - 1)];
        this.gameBackdrop.style.backgroundImage = run_8.setup.coverUrl
            ? 'url("' + String(run_8.setup.coverUrl).replace(/["\\]/g, '\\$&') + '")'
            : '';
        this.gameTitle.textContent = run_8.setup.title;
        this.sceneHeading.innerHTML =
            '<span>' +
            (run_8.phase === 'prologue'
                ? 'PROLOGUE'
                : run_8.phase === 'epilogue'
                  ? 'AFTER STORY'
                  : 'SCENE ' + String(run_8.sceneNumber).padStart(2, '0')) +
            '</span><strong>' +
            this.escapeHtml(scene_3.title) +
            '</strong>';
        this.gameMenuButton.hidden = run_8.phase === 'prologue';
        if (run_8.beatIndex < scene_3.beats.length) {
            const identityActor = this.prepareIdentityCard(
                run_8,
                'story',
                scene_3,
                run_8.beatIndex,
            );
            if (identityActor) {
                this.renderStage(this.renderIdentityCardMarkup(identityActor));
                return;
            }
            this.renderStage(
                '<button type="button" class="netflix-dialogue-box ' +
                    (beat_2.kind === 'narration' ? 'is-narration' : '') +
                    `" data-action="advance-dialogue">
                ` +
                    (beat_2.kind === 'dialogue'
                        ? '<span class="netflix-speaker-name">' +
                          this.escapeHtml(beat_2.speakerName) +
                          '</span>'
                        : '<span class="netflix-narration-label">旁白</span>') +
                    `
                <span class="netflix-dialogue-text">` +
                    this.escapeHtml(beat_2.text) +
                    `</span>
                <span class="netflix-dialogue-progress">` +
                    (run_8.beatIndex + 1) +
                    ' / ' +
                    scene_3.beats.length +
                    `<i class="fas fa-chevron-down"></i></span>
            </button>`,
            );
            return;
        }
        if (run_8.phase === 'prologue') {
            this.renderStage(
                '<div class="netflix-scene-complete"><span>PROLOGUE COMPLETE</span><h2>序章结束</h2><p>故事的世界已经展开，接下来每个选择都会改变属性、关系与最终结局。</p><button type="button" class="netflix-primary-button" data-action="enter-main-game"><i class="fas fa-play"></i> 进入第一章</button></div>',
            );
            return;
        }
        if (scene_3.ending) {
            this.renderStage(
                '<div class="netflix-ending-panel"><span>' +
                    this.escapeHtml(scene_3.ending.type) +
                    '</span><h2>' +
                    this.escapeHtml(scene_3.ending.title) +
                    '</h2><p>' +
                    this.escapeHtml(scene_3.ending.summary) +
                    '</p><div><button type="button" class="netflix-secondary-button" data-action="open-load">读档</button><button type="button" class="netflix-primary-button" data-action="continue-epilogue">继续番外</button></div></div>',
            );
            return;
        }
        const choices_2 = this.core.ensureUnlockedChoice(
            scene_3.choices,
            run_8.attributes,
            run_8.cast,
        );
        scene_3.choices = choices_2;
        const training_2 = this.core.normalizeTraining(run_8.training);
        run_8.training = training_2;
        const trainingSpent =
                training_2.cycleSceneNumber === run_8.sceneNumber && training_2.actionPoints <= 0,
            value_246 = this.customChoiceOpen
                ? '<div class="netflix-custom-choice-form"><textarea id="netflix-custom-choice-input" maxlength="200" placeholder="描述你想采取的行动……"></textarea><div><button type="button" data-action="toggle-custom-choice">取消</button><button type="button" class="netflix-primary-button" data-action="submit-custom-choice">确认行动</button></div></div>'
                : '',
            value_247 =
                '<div class="netflix-choice-auxiliary"><button type="button" data-action="toggle-custom-choice"><i class="fas fa-pen"></i><span><strong>自定义行动</strong><small>输入自己的选择</small></span></button>' +
                (run_8.phase === 'main'
                    ? '<button type="button" data-action="enter-training" ' +
                      (trainingSpent ? 'disabled' : '') +
                      '><i class="fas fa-map-marked-alt"></i><span><strong>进入养成</strong><small>' +
                      (trainingSpent ? '本日行动力已用完' : '探索地图并提升能力') +
                      '</small></span></button>'
                    : '') +
                '</div>';
        this.renderStage(
            '<div class="netflix-choice-panel"><span>YOUR CHOICE</span><h2>你准备怎么做？</h2><div>' +
                choices_2.map((choice, index) => this.renderChoice(choice, index, run_8)).join('') +
                '</div>' +
                value_247 +
                value_246 +
                '</div>',
        );
        if (this.customChoiceOpen)
            requestAnimationFrame(() =>
                this.view.querySelector('#netflix-custom-choice-input')?.focus({
                    preventScroll: true,
                }),
            );
    }
    ['renderGameHub']() {
        if (this.hubDraftOpen && this.setupDraft) {
            const setupDraft_253 = this.setupDraft;
            this.gameView.classList.remove('is-training');
            this.gameView.classList.add('is-hub');
            this.gameHub.setAttribute('aria-hidden', 'false');
            this.focusGameHubFromScene();
            this.trainingView.setAttribute('aria-hidden', 'true');
            const value_254 = setupDraft_253.homeBackgroundUrl || setupDraft_253.coverUrl;
            this.gameBackdrop.style.backgroundImage = value_254
                ? 'url("' + String(value_254).replace(/["\\]/g, '\\$&') + '")'
                : '';
            this.hubContent.innerHTML =
                '<div class="netflix-hub-intro"><span>NEW STORY · 即将开始</span><h1>' +
                this.escapeHtml(setupDraft_253.title || '未命名故事') +
                '</h1><p>' +
                this.escapeHtml(setupDraft_253.premise || '在故事里写下属于你的选择。') +
                `</p></div>
                <div class="netflix-hub-progress"><i class="fas fa-star"></i><span><small>开局准备</small><strong>从这里开始你的故事</strong></span><button type="button" data-action="show-game-story">查看设定 <i class="fas fa-angle-right"></i></button></div>
                <nav class="netflix-hub-actions" aria-label="故事功能">
                    <button type="button" class="is-primary" data-action="show-game-story"><i class="fas fa-book-open"></i><span><strong>故事</strong><small>开始剧情 · 设定 · 世界书</small></span></button>
                    <button type="button" data-action="show-game-relations"><i class="fas fa-heart"></i><span><strong>关系</strong><small>` +
                Math.max(0, setupDraft_253.cast.length - 1) +
                ` 位开局主演</small></span></button>
                    <button type="button" data-action="show-game-attributes"><i class="fas fa-user-astronaut"></i><span><strong>属性</strong><small>User 人设与初始属性</small></span></button>
                    <button type="button" data-action="show-game-map"><i class="fas fa-map-marked-alt"></i><span><strong>地图</strong><small>推进第一章后解锁</small></span></button>
                    <button type="button" data-action="show-game-settings"><i class="fas fa-cog"></i><span><strong>设置</strong><small>读档 · 主界面背景</small></span></button>
                </nav>`;
            return;
        }
        const run_9 = this.state.activeRun;
        if (!run_9?.currentScene) return;
        this.gameView.classList.remove('is-training');
        this.gameView.classList.add('is-hub');
        this.gameHub.setAttribute('aria-hidden', 'false');
        this.focusGameHubFromScene();
        this.trainingView.setAttribute('aria-hidden', 'true');
        const value_250 = run_9.homeBackgroundUrl || run_9.setup.coverUrl;
        this.gameBackdrop.style.backgroundImage = value_250
            ? 'url("' + String(value_250).replace(/["\\]/g, '\\$&') + '")'
            : '';
        const value_251 =
                run_9.phase === 'prologue'
                    ? '序章'
                    : run_9.phase === 'ending'
                      ? '结局'
                      : run_9.phase === 'epilogue'
                        ? '番外'
                        : '第 ' + run_9.sceneNumber + ' 章',
            length_252 = run_9.cast.filter(
                (actor_13) => actor_13.type !== 'user' && actor_13.acquainted,
            ).length;
        this.hubContent.innerHTML =
            `
            <div class="netflix-hub-intro"><span>INTERACTIVE STORY · ` +
            this.escapeHtml(value_251) +
            '</span><h1>' +
            this.escapeHtml(run_9.setup.title) +
            '</h1><p>' +
            this.escapeHtml(
                run_9.storySummary || run_9.setup.premise || '你的选择将决定接下来的故事。',
            ) +
            `</p></div>
            <div class="netflix-hub-progress"><i class="fas fa-bookmark"></i><span><small>当前进度</small><strong>` +
            this.escapeHtml(run_9.currentScene.title || value_251) +
            `</strong></span><button type="button" data-action="show-game-story">查看故事 <i class="fas fa-angle-right"></i></button></div>
            <nav class="netflix-hub-actions" aria-label="故事功能">
                <button type="button" class="is-primary" data-action="show-game-story"><i class="fas fa-book-open"></i><span><strong>故事</strong><small>剧情 · 设定 · 世界书</small></span></button>
                <button type="button" data-action="show-game-relations"><i class="fas fa-heart"></i><span><strong>关系</strong><small>` +
            length_252 +
            ` 位已结识角色</small></span></button>
                <button type="button" data-action="show-game-attributes"><i class="fas fa-user-astronaut"></i><span><strong>属性</strong><small>User 人设与能力</small></span></button>
                <button type="button" data-action="show-game-map"><i class="fas fa-map-marked-alt"></i><span><strong>地图</strong><small>` +
            (run_9.viewMode === 'training' || this.canEnterGameMap(run_9)
                ? '探索养成地点'
                : '推进第一章后解锁') +
            `</small></span></button>
                <button type="button" data-action="show-game-settings"><i class="fas fa-cog"></i><span><strong>设置</strong><small>存读档 · 主界面背景</small></span></button>
            </nav>`;
    }
    ['showGameHub']() {
        if (this.isBusy || (!this.hubDraftOpen && !this.state.activeRun?.currentScene)) return;
        this.closeSheet(this.menuSheet);
        this.hubOpen = true;
        this.renderGameHub();
    }
    ['showGameStory']() {
        if (this.hubDraftOpen && this.setupDraft) {
            const setupDraft_265 = this.setupDraft,
                worldBooks_266 = this.getWorldBooks(),
                selectedBooks_2 = new Set((setupDraft_265.worldBookIds || []).map(String)),
                join_268 = (setupDraft_265.worldBooks || [])
                    .map(
                        (message_269) =>
                            '<label class="netflix-field"><span>' +
                            this.escapeHtml(message_269.name || '未命名世界书') +
                            ' · 词条文本</span><textarea data-worldbook-content="' +
                            this.escapeAttr(message_269.id) +
                            '" rows="5">' +
                            this.escapeHtml(message_269.content || '') +
                            '</textarea></label>',
                    )
                    .join('');
            this.infoTitle.textContent = '故事';
            this.infoBody.innerHTML =
                '<div class="netflix-hub-info"><div class="netflix-hub-story-lead"><span>NEW STORY</span><h3>' +
                this.escapeHtml(setupDraft_265.title || '未命名故事') +
                `</h3><p>设置世界与人物后，从这里开始生成序章。</p><button type="button" class="netflix-primary-button" data-action="start-game" id="netflix-start-game-button"><i class="fas fa-play"></i> 开始剧情</button></div>
                <section><h3>故事设定</h3><label class="netflix-field"><span>故事标题</span><input type="text" maxlength="60" data-setup-field="title" value="` +
                this.escapeAttr(setupDraft_265.title) +
                '"></label><label class="netflix-field"><span>故事前提</span><textarea maxlength="4000" data-setup-field="premise">' +
                this.escapeHtml(setupDraft_265.premise) +
                '</textarea></label><label class="netflix-field"><span>世界观设定</span><textarea maxlength="8000" data-setup-field="worldview">' +
                this.escapeHtml(setupDraft_265.worldview) +
                `</textarea></label></section>
                <section><h3>世界书</h3><p>勾选并编辑当前故事使用的词条文本。</p><div class="netflix-worldbook-options">` +
                (worldBooks_266.length
                    ? worldBooks_266
                          .map(
                              (book_4) =>
                                  '<label><span><i class="fas fa-book"></i><b>' +
                                  this.escapeHtml(book_4.name || '未命名世界书') +
                                  '</b><small>' +
                                  (Array.isArray(book_4.entries) ? book_4.entries.length : 0) +
                                  ' 条词条</small></span><input type="checkbox" data-worldbook-id="' +
                                  this.escapeAttr(book_4.id) +
                                  '" ' +
                                  (selectedBooks_2.has(String(book_4.id)) ? 'checked' : '') +
                                  '></label>',
                          )
                          .join('')
                    : '<div class="netflix-empty-state">暂无世界书，可直接开始故事。</div>') +
                '</div>' +
                join_268 +
                '</section></div>';
            this.openSheet(this.infoSheet);
            return;
        }
        const activeRun_256 = this.state.activeRun;
        if (!activeRun_256) return;
        const setup_3 = this.getEditableSetup(),
            value_258 =
                activeRun_256.phase === 'prologue'
                    ? '序章'
                    : activeRun_256.phase === 'ending'
                      ? '结局'
                      : activeRun_256.phase === 'epilogue'
                        ? '番外'
                        : '第 ' + activeRun_256.sceneNumber + ' 章',
            worldBooks_259 = this.getWorldBooks(),
            selectedBooks_3 = new Set(worldBooks_259.map((value_271) => String(value_271.id))),
            items_261 = [
                ...worldBooks_259,
                ...(setup_3.worldBooks || [])
                    .filter((book_5) => !selectedBooks_3.has(String(book_5.id)))
                    .map((value_273) => ({
                        ...value_273,
                        isSavedOnly: true,
                    })),
            ],
            selectedBooks_4 = new Set(
                (setup_3.worldBookIds || (setup_3.worldBooks || []).map((book_6) => book_6.id)).map(
                    String,
                ),
            ),
            join_263 = items_261
                .map(
                    (book_7) =>
                        '<label><span><i class="fas fa-book"></i><b>' +
                        this.escapeHtml(book_7.name || '未命名世界书') +
                        '</b><small>' +
                        (book_7.isSavedOnly
                            ? '当前故事保存的快照'
                            : (Array.isArray(book_7.entries) ? book_7.entries.length : 0) +
                              ' 条词条') +
                        '</small></span><input type="checkbox" data-worldbook-id="' +
                        this.escapeAttr(book_7.id) +
                        '" ' +
                        (selectedBooks_4.has(String(book_7.id)) ? 'checked' : '') +
                        '></label>',
                )
                .join(''),
            join_264 = (setup_3.worldBooks || [])
                .map(
                    (message_276) =>
                        '<label class="netflix-field"><span>' +
                        this.escapeHtml(message_276.name || '未命名世界书') +
                        ' · 词条快照</span><textarea data-worldbook-content="' +
                        this.escapeAttr(message_276.id) +
                        '" rows="5">' +
                        this.escapeHtml(message_276.content || '') +
                        '</textarea></label>',
                )
                .join('');
        this.infoTitle.textContent = '故事';
        this.infoBody.innerHTML =
            `<div class="netflix-hub-info">
            <div class="netflix-hub-story-lead"><span>` +
            this.escapeHtml(value_258) +
            ' · ' +
            this.escapeHtml(activeRun_256.currentScene?.title || '') +
            '</span><h3>' +
            this.escapeHtml(setup_3.title || '未命名故事') +
            '</h3><p>' +
            this.escapeHtml(activeRun_256.storySummary || setup_3.premise || '故事即将开始。') +
            `</p><button type="button" class="netflix-primary-button" data-action="resume-game-story"><i class="fas fa-play"></i> 继续剧情</button></div>
            <button type="button" class="netflix-hub-link" data-action="show-history"><i class="fas fa-history"></i> 剧情回看 <i class="fas fa-chevron-right"></i></button>
            <section><h3>故事设定</h3><label class="netflix-field"><span>故事标题</span><input type="text" maxlength="60" data-setup-field="title" value="` +
            this.escapeAttr(setup_3.title) +
            '"></label><label class="netflix-field"><span>故事前提</span><textarea maxlength="4000" data-setup-field="premise">' +
            this.escapeHtml(setup_3.premise) +
            '</textarea></label><label class="netflix-field"><span>世界观设定</span><textarea maxlength="8000" data-setup-field="worldview">' +
            this.escapeHtml(setup_3.worldview) +
            `</textarea></label></section>
            <section><h3>世界书</h3><p>勾选词条来源，或直接修改当前故事保存的词条文本。修改会用于后续剧情。</p><div class="netflix-worldbook-options">` +
            (join_263 || '<div class="netflix-empty-state">暂无可选世界书。</div>') +
            '</div>' +
            (join_264 || '<p>当前故事未选择世界书。</p>') +
            `</section>
        </div>`;
        this.closeSheet(this.menuSheet);
        this.openSheet(this.infoSheet);
    }
    ['resumeGameStory']() {
        const activeRun_277 = this.state.activeRun;
        if (this.isBusy || !activeRun_277) return;
        if (
            activeRun_277.viewMode === 'training' &&
            (activeRun_277.training?.currentEvent || activeRun_277.training?.eventResult)
        ) {
            this.toast('请先在地图完成当前地点事件');
            return;
        }
        this.persistLiveSetup();
        this.closeSheet(this.infoSheet);
        this.hubOpen = false;
        if (activeRun_277.viewMode === 'training') this.continueStory();
        else this.renderGame();
    }
    ['canEnterGameMap'](value_278 = this.state.activeRun) {
        return !!(
            value_278?.phase === 'main' &&
            !value_278.currentScene?.ending &&
            value_278.beatIndex >= (value_278.currentScene?.beats?.length || 0)
        );
    }
    ['showGameMap']() {
        if (this.hubDraftOpen) return this.toast('开始剧情并推进第一章后，即可解锁地图');
        const activeRun_279 = this.state.activeRun;
        if (this.isBusy || !activeRun_279) return;
        if (activeRun_279.viewMode === 'training') {
            this.hubOpen = false;
            this.moveFocusToGameView();
            this.gameView.classList.remove('is-hub');
            this.gameHub.setAttribute('aria-hidden', 'true');
            this.renderTraining();
            return;
        }
        if (!this.canEnterGameMap(activeRun_279))
            return this.toast('推进第一章剧情并到达选择阶段后，即可解锁地图');
        this.enterTraining().then(() => {
            if (this.state.activeRun?.viewMode === 'training') {
                this.hubOpen = false;
                this.moveFocusToGameView();
                this.gameView.classList.remove('is-hub');
                this.gameHub.setAttribute('aria-hidden', 'true');
                this.renderTraining();
            } else this.renderGameHub();
        });
    }
    ['showGameRelations']() {
        if (this.hubDraftOpen && this.setupDraft) {
            const filter_283 = this.setupDraft.cast.filter((actor_14) => actor_14.type !== 'user');
            this.infoTitle.textContent = '关系';
            this.infoBody.innerHTML =
                '<div class="netflix-hub-info"><section><div class="netflix-section-heading"><div><h3>开局主演</h3><p>主演人设会随故事保存。</p></div><button type="button" class="netflix-section-action" data-action="open-cast-picker"><i class="fas fa-plus"></i> 添加</button></div><div class="netflix-setup-cast-list">' +
                (filter_283.length
                    ? filter_283.map((actor_15) => this.renderSetupActor(actor_15)).join('')
                    : '<div class="netflix-empty-state">暂无主演，可添加 Char 或自定义角色。</div>') +
                '</div></section></div>';
            this.openSheet(this.infoSheet);
            return;
        }
        const activeRun_280 = this.state.activeRun;
        if (!activeRun_280) return;
        this.getEditableSetup();
        const filter_281 = activeRun_280.cast.filter(
                (value_286) => value_286.type !== 'user' && value_286.origin === 'setup',
            ),
            filter_282 = activeRun_280.cast.filter(
                (value_287) =>
                    value_287.type !== 'user' &&
                    value_287.origin !== 'setup' &&
                    value_287.acquainted,
            );
        this.infoTitle.textContent = '关系';
        this.infoBody.innerHTML =
            '<div class="netflix-hub-info"><section><div class="netflix-section-heading"><div><h3>开局主演</h3><p>人设修改会用于后续剧情。</p></div><button type="button" class="netflix-section-action" data-action="open-cast-picker"><i class="fas fa-plus"></i> 添加</button></div><div class="netflix-setup-cast-list">' +
            (filter_281.length
                ? filter_281.map((actor_16) => this.renderSetupActor(actor_16)).join('')
                : '<div class="netflix-empty-state">暂无开局主演。</div>') +
            '</div></section><section><h3>已建立的关系</h3>' +
            (filter_282.length
                ? '<div class="netflix-hub-relations">' +
                  filter_282
                      .map(
                          (actor_17) =>
                              '<article>' +
                              this.renderAvatarMarkup(actor_17) +
                              '<div><span>已结识 · ' +
                              this.escapeHtml(actor_17.identity || '剧情人物') +
                              '</span><h3>' +
                              this.escapeHtml(actor_17.name) +
                              '</h3><p>' +
                              this.escapeHtml(actor_17.persona || '暂无人设') +
                              '</p><small>好感度 ' +
                              (actor_17.affinity ?? 50) +
                              '</small></div></article>',
                      )
                      .join('') +
                  '</div>'
                : '<p>尚未结识剧情新角色。</p>') +
            '</section></div>';
        this.closeSheet(this.menuSheet);
        this.openSheet(this.infoSheet);
    }
    ['showGameSettings']() {
        if (this.hubDraftOpen && this.setupDraft) {
            this.infoTitle.textContent = '设置';
            this.infoBody.innerHTML =
                '<div class="netflix-hub-info"><section><h3>存档管理</h3><p>故事开始后可存档；现在可以读取已有故事。</p><div class="netflix-hub-setting-actions"><button type="button" data-action="open-load"><i class="fas fa-folder-open"></i> 读档</button></div></section><section><h3>主界面背景</h3><p>粘贴图片 URL，仅用于这个故事的主界面。</p><label class="netflix-field"><span>图片 URL</span><input id="netflix-hub-background-url" type="url" inputmode="url" placeholder="https://example.com/background.jpg" value="' +
                this.escapeAttr(this.setupDraft.homeBackgroundUrl || '') +
                '"></label><div class="netflix-hub-setting-actions"><button type="button" data-action="save-hub-background"><i class="fas fa-check"></i> 保存背景</button><button type="button" data-action="clear-hub-background"><i class="fas fa-undo"></i> 恢复封面</button></div></section>' +
                this.renderDeleteStoryButton(this.setupDraft.sourceId) +
                '</div>';
            this.openSheet(this.infoSheet);
            return;
        }
        const activeRun_290 = this.state.activeRun;
        if (!activeRun_290) return;
        this.infoTitle.textContent = '设置';
        this.infoBody.innerHTML =
            '<div class="netflix-hub-info"><section><h3>存档管理</h3><div class="netflix-hub-setting-actions"><button type="button" data-action="open-save"><i class="fas fa-save"></i> 存档</button><button type="button" data-action="open-load"><i class="fas fa-folder-open"></i> 读档</button></div><button type="button" class="netflix-hub-link" data-action="restart-game"><i class="fas fa-redo"></i> 重新开始 <i class="fas fa-chevron-right"></i></button></section><section><h3>主界面背景</h3><p>粘贴图片 URL，仅用于当前故事的主界面。</p><label class="netflix-field"><span>图片 URL</span><input id="netflix-hub-background-url" type="url" inputmode="url" placeholder="https://example.com/background.jpg" value="' +
            this.escapeAttr(activeRun_290.homeBackgroundUrl || '') +
            '"></label><div class="netflix-hub-setting-actions"><button type="button" data-action="save-hub-background"><i class="fas fa-check"></i> 保存背景</button><button type="button" data-action="clear-hub-background"><i class="fas fa-undo"></i> 恢复封面</button></div></section>' +
            this.renderDeleteStoryButton(activeRun_290.sourceId || activeRun_290.setup?.sourceId) +
            '</div>';
        this.closeSheet(this.menuSheet);
        this.openSheet(this.infoSheet);
    }
    ['renderDeleteStoryButton'](value_291) {
        if (!value_291 || !this.findCatalogItem(value_291)) return '';
        return '<section class="netflix-hub-delete-section"><button type="button" data-action="delete-title"><i class="fas fa-trash-alt"></i> 从片库删除故事</button><p>存档和已解锁结局会保留。</p></section>';
    }
    async ['saveHubBackground']() {
        const map_2 = this.hubDraftOpen ? this.setupDraft : this.state.activeRun;
        if (!map_2 || this.isBusy) return;
        const trim_293 = String(
            this.view.querySelector('#netflix-hub-background-url')?.value || '',
        ).trim();
        let value_294;
        try {
            value_294 = new URL(trim_293);
        } catch (value_296) {
            return this.toast('请输入有效的 HTTP/HTTPS 图片 URL');
        }
        if (!['http:', 'https:'].includes(value_294.protocol) || trim_293.length > 2048)
            return this.toast('请输入有效的 HTTP/HTTPS 图片 URL');
        map_2.homeBackgroundUrl = value_294.href;
        if (this.hubDraftOpen) {
            this.renderGameHub();
            this.toast('主界面背景已设置，开始剧情后会随故事保存');
            return;
        }
        const value_295 = await this.updateAutoSave(true);
        if (!value_295) return;
        if (this.hubOpen) this.renderGameHub();
        this.toast('主界面背景已保存');
    }
    async ['clearHubBackground']() {
        const map_3 = this.hubDraftOpen ? this.setupDraft : this.state.activeRun;
        if (!map_3 || this.isBusy) return;
        map_3.homeBackgroundUrl = '';
        if (this.hubDraftOpen) {
            this.showGameSettings();
            this.renderGameHub();
            this.toast('已恢复故事封面');
            return;
        }
        const value_298 = await this.updateAutoSave(true);
        if (!value_298) return;
        this.showGameSettings();
        if (this.hubOpen) this.renderGameHub();
        this.toast('已恢复故事封面');
    }
    ['renderStage'](innerHTML_2) {
        this.gameStage.innerHTML = innerHTML_2;
        const element_2 = this.gameStage.firstElementChild;
        element_2 &&
            (element_2.classList.add('netflix-stage-entering'),
            element_2.addEventListener(
                'animationend',
                () => element_2.classList.remove('netflix-stage-entering'),
                {
                    once: true,
                },
            ));
    }
    ['prepareIdentityCard'](run_10, scope_2, content_3, beatIndex_2) {
        const beat = content_3?.beats?.[beatIndex_2];
        if (!beat) return null;
        const scopeId_2 = String(content_3.id || ''),
            pending = run_10.pendingIdentityCard;
        if (
            pending &&
            pending.scope === scope_2 &&
            pending.scopeId === scopeId_2 &&
            pending.beatIndex === beatIndex_2
        ) {
            const pendingActor = run_10.cast.find(
                (actor_18) => actor_18.id === pending.characterId,
            );
            if (
                pendingActor &&
                pendingActor.type !== 'user' &&
                !pendingActor.acquainted &&
                pendingActor.deferredSceneId !== scopeId_2
            )
                return pendingActor;
            run_10.pendingIdentityCard = null;
        }
        const ids = [];
        (content_3.characterProfiles || []).forEach((profile) => {
            if (profile.triggerBeatId === beat.id && !ids.includes(profile.id))
                ids.push(profile.id);
        });
        if (beat.kind === 'dialogue' && beat.speakerId && !ids.includes(beat.speakerId))
            ids.push(beat.speakerId);
        const actor_19 = ids
            .map((id_10) => run_10.cast.find((item_12) => item_12.id === id_10))
            .find(
                (item_13) =>
                    item_13 &&
                    item_13.type !== 'user' &&
                    item_13.profileComplete &&
                    !item_13.acquainted &&
                    item_13.deferredSceneId !== scopeId_2,
            );
        if (!actor_19) return null;
        return (
            (run_10.pendingIdentityCard = {
                characterId: actor_19.id,
                scope: scope_2,
                scopeId: scopeId_2,
                beatIndex: beatIndex_2,
            }),
            (run_10.updatedAt = Date.now()),
            this.updateAutoSave(false),
            actor_19
        );
    }
    ['renderIdentityCardMarkup'](actor_20) {
        const join_313 = (actor_20.characterAttributes || [])
            .map(
                (value_314) =>
                    '<div><span>' +
                    this.escapeHtml(value_314.name) +
                    '</span><b>' +
                    value_314.value +
                    '</b><i><em style="width:' +
                    value_314.value +
                    '%"></em></i></div>',
            )
            .join('');
        return (
            '<article class="netflix-identity-card" aria-label="' +
            this.escapeAttr(actor_20.name) +
            `的身份卡">
            <span class="netflix-identity-eyebrow">NEW CHARACTER</span>
            <header>` +
            this.renderAvatarMarkup(actor_20) +
            '<div><small>' +
            this.escapeHtml(actor_20.identity) +
            '</small><h2>' +
            this.escapeHtml(actor_20.name) +
            '</h2><p>' +
            this.escapeHtml(actor_20.occupation) +
            ' · ' +
            this.escapeHtml(actor_20.faction) +
            `</p></div></header>
            <p class="netflix-identity-persona">` +
            this.escapeHtml(actor_20.persona) +
            `</p>
            <div class="netflix-identity-traits">` +
            join_313 +
            `</div>
            <div class="netflix-identity-actions"><button type="button" data-action="defer-character">暂不结识</button><button type="button" class="netflix-primary-button" data-action="acquaint-character"><i class="fas fa-handshake"></i> 结识</button></div>
        </article>`
        );
    }
    async ['resolveIdentityCard'](value_315) {
        const run_11 = this.state.activeRun,
            pending_4 = run_11?.pendingIdentityCard;
        if (this.isBusy || !pending_4) return;
        const actor_21 = run_11.cast.find(
            (item_14) => item_14.id === pending_4.characterId && item_14.type !== 'user',
        );
        if (!actor_21) return;
        value_315
            ? ((actor_21.acquainted = true),
              (actor_21.acquaintedAt = Date.now()),
              (actor_21.acquaintedSceneId = pending_4.scopeId),
              (actor_21.deferredSceneId = ''))
            : (actor_21.deferredSceneId = pending_4.scopeId);
        run_11.pendingIdentityCard = null;
        run_11.updatedAt = Date.now();
        await this.updateAutoSave(true);
        this.renderGame();
    }
    ['renderChoice'](choice_4, value_321, run_12) {
        const requirementStatus_323 = this.core.getRequirementStatus(
                choice_4,
                run_12.attributes,
                run_12.cast,
            ),
            requirementLabels = [
                ...Object.entries(choice_4.requirements?.attributes || {}).map(
                    ([id_11, value_326]) => this.findAttributeName(id_11, run_12) + ' ' + value_326,
                ),
                ...Object.entries(choice_4.requirements?.affinities || {}).map(
                    ([value_327, value_328]) =>
                        this.findActorName(value_327, run_12) + '好感 ' + value_328,
                ),
            ];
        return (
            '<button type="button" data-choice-id="' +
            this.escapeAttr(choice_4.id) +
            '" ' +
            (requirementStatus_323.unlocked ? '' : 'disabled') +
            '><b>' +
            String.fromCharCode(65 + value_321) +
            '</b><span><strong>' +
            this.escapeHtml(choice_4.text) +
            '</strong>' +
            (requirementLabels.length
                ? '<small class="' +
                  (requirementStatus_323.unlocked ? '' : 'is-locked') +
                  '"><i class="fas ' +
                  (requirementStatus_323.unlocked ? 'fa-check-circle' : 'fa-lock') +
                  '"></i> ' +
                  this.escapeHtml(requirementLabels.join(' · ')) +
                  '</small>'
                : '<small><i class="fas fa-unlock"></i> 无门槛</small>') +
            '</span></button>'
        );
    }
    ['findAttributeName'](id_12, run_13 = this.state.activeRun) {
        return run_13?.attributes?.find((item_15) => item_15.id === id_12)?.name || id_12;
    }
    ['findActorName'](id_13, run_14 = this.state.activeRun) {
        return run_14?.cast?.find((item_16) => item_16.id === id_13)?.name || id_13;
    }
    ['advanceDialogue']() {
        if (this.isBusy || this.isTransitioning || !this.state.activeRun?.currentScene) return;
        const commit = () => {
            const run_15 = this.state.activeRun;
            if (!run_15?.currentScene) return;
            if (run_15.beatIndex < run_15.currentScene.beats.length) run_15.beatIndex += 1;
            run_15.updatedAt = Date.now();
            this.updateAutoSave(false);
            this.renderGame();
        };
        if (
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
            this.state.uiSettings?.reduceMotion
        )
            return commit();
        this.isTransitioning = true;
        this.gameStage.firstElementChild?.classList.add('netflix-stage-leaving');
        setTimeout(() => {
            commit();
            setTimeout(() => {
                this.isTransitioning = false;
            }, 170);
        }, 90);
    }
    ['toggleCustomChoice']() {
        if (this.isBusy) return;
        this.customChoiceOpen = !this.customChoiceOpen;
        this.renderGame();
    }
    ['submitCustomChoice']() {
        if (this.isBusy || !this.state.activeRun) return;
        const input = this.view.querySelector('#netflix-custom-choice-input'),
            text_2 = String(input?.value || '')
                .trim()
                .slice(0, 200);
        if (!text_2) return this.toast('请输入自定义行动');
        const choice_5 = {
            id: 'custom-' + Date.now(),
            text: text_2,
            requirements: {
                attributes: {},
                affinities: {},
            },
            isCustom: true,
        };
        this.chooseStoryOption(choice_5.id, choice_5);
    }
    async ['enterTraining']() {
        const run_16 = this.state.activeRun;
        if (
            this.isBusy ||
            !run_16 ||
            run_16.phase !== 'main' ||
            run_16.currentScene?.ending ||
            run_16.beatIndex < run_16.currentScene.beats.length
        )
            return;
        const pending_5 = this.core.clone(run_16);
        pending_5.training = this.core.normalizeTraining(pending_5.training);
        pending_5.training.cycleSceneNumber !== pending_5.sceneNumber &&
            ((pending_5.training.day += 1),
            (pending_5.training.actionPoints = 3),
            (pending_5.training.cycleSceneNumber = pending_5.sceneNumber),
            (pending_5.training.currentEvent = null),
            (pending_5.training.eventBeatIndex = 0));
        if (pending_5.training.actionPoints <= 0)
            return this.toast('本日行动力已用完，请先推进主线');
        pending_5.storyReturnPoint = {
            sceneId: pending_5.currentScene.id,
            beatIndex: pending_5.beatIndex,
        };
        if (!pending_5.training.map) {
            this.setBusy(true, '正在生成养成地图…');
            this.generationDetail.textContent = '正在把世界观转换为可探索地点。';
            try {
                pending_5.training.map = await this.requestTrainingMap(pending_5);
            } catch (error_12) {
                console.error('[Netflix] training map generation failed:', error_12);
                if (
                    !window.u2Api?.isRequestError?.(error_12) ||
                    !window.u2Api.reportError(error_12, {
                        operation: '地图生成',
                    })
                )
                    this.toast(error_12?.message || '地图生成失败，请重试');
                return;
            } finally {
                this.setBusy(false);
            }
        }
        pending_5.viewMode = 'training';
        this.state.activeRun = pending_5;
        this.customChoiceOpen = false;
        await this.updateAutoSave(true);
        this.resetMapView(false);
        this.renderTraining();
    }
    async ['requestTrainingMap'](run_17) {
        const raw_8 = await this.requestJson(this.buildMapPrompt(run_17));
        return this.core.normalizeMapPayload(raw_8);
    }
    ['buildMapPrompt'](run_18) {
        const value_344 = run_18.setup || {},
            value_345 =
                (value_344.worldBooks || []).map(
                    (message_348) => '《' + message_348.name + '》' + message_348.content,
                ).join(`
`) || '无',
            join_346 = (run_18.attributes || [])
                .map((value_349) => value_349.id + '=' + value_349.name)
                .join('、'),
            join_347 = (run_18.cast || [])
                .filter(
                    (actor_22) =>
                        actor_22.type === 'user' ||
                        (actor_22.acquainted && actor_22.companionEligible),
                )
                .map((value_351) => value_351.id + '=' + value_351.name)
                .join('、');
        return (
            `你是中文养成文游的地图设计师。根据以下资料生成一张可长期探索的互动节点地图。只返回合法 JSON，不要 Markdown。

标题：` +
            value_344.title +
            `
世界观：` +
            value_344.worldview +
            `
故事前提：` +
            value_344.premise +
            `
当前剧情：` +
            (run_18.storySummary || '序章之后') +
            `
世界书：` +
            value_345 +
            `
属性 id：` +
            join_346 +
            `
主演 id：` +
            join_347 +
            `

严格结构：{"map":{"id":"英文id","name":"地图名","description":"地图整体说明","nodes":[{"id":"英文唯一id","name":"地点名","description":"地点介绍","type":"地点类型","icon":"Font Awesome 图标类名，如 fa-school","x":5到95的整数,"y":8到92的整数,"focusAttributes":["属性id"],"featuredCastIds":["主演id"]}],"edges":[{"from":"地点id","to":"地点id"}]}}。nodes 必须 6–10 个，分布不能重叠；edges 必须全部引用有效节点并让地图整体连通。`
        );
    }
    ['buildTrainingEventPrompt'](run_19, location) {
        const training_3 = run_19.training,
            companion = run_19.cast.find(
                (actor_23) => actor_23.id === training_3.companionId && actor_23.type !== 'user',
            ),
            familiarity = training_3.familiarityByLocation[location.id] || 0,
            join_357 = run_19.attributes
                .map((value_360) => value_360.id + '（' + value_360.name + '）=' + value_360.value)
                .join('；'),
            join_358 = run_19.cast.map(
                (contact_361) =>
                    contact_361.id +
                    ' | ' +
                    contact_361.name +
                    (contact_361.type === 'user'
                        ? ' | 玩家本人'
                        : ' | ' +
                          (contact_361.acquainted ? '已结识' : '未结识') +
                          ' | 好感度' +
                          contact_361.affinity) +
                    ' | ' +
                    (contact_361.persona || '未填写') +
                    (contact_361.profileComplete ? '' : ' | 档案待补全'),
            ).join(`
`);
        return (
            `你是中文养成文游的事件设计师。为一次地点行动生成完整小剧情。只返回合法 JSON，不要 Markdown。

作品：` +
            run_19.setup.title +
            `
世界观：` +
            run_19.setup.worldview +
            `
主线摘要：` +
            run_19.storySummary +
            `
地点：` +
            location.name +
            '（' +
            location.type +
            `）
地点说明：` +
            location.description +
            `
熟悉度：` +
            familiarity +
            `/5
同行角色：` +
            (companion
                ? companion.id + ' | ' + companion.name + ' | ' + companion.persona
                : '独自行动') +
            `
当前属性：` +
            join_357 +
            `
已登记人物：
` +
            join_358 +
            `
已有事件标记：` +
            (run_19.flags.join('、') || '无') +
            `
最近事件，严禁重复冲突和桥段：
` +
            (training_3.recentEventSummaries.slice(-12).join(`
`) || '无') +
            `

严格结构：{"event":{"id":"英文id","locationId":"` +
            location.id +
            '","title":"事件标题","summary":"事件摘要","beats":[{"id":"beat-1","kind":"narration","text":"旁白"},{"id":"beat-2","kind":"dialogue","speakerId":"稳定角色id","speakerName":"显示姓名","text":"对话"}],"characterProfiles":[{"id":"角色稳定id","triggerBeatId":"实际登场beat id","name":"姓名","identity":"身份定位","occupation":"职业","faction":"阵营","persona":"完整人设","attributes":[{"id":"开局User属性id","value":50}],"initialAffinity":50,"companionEligible":false}],"choices":[{"id":"a","text":"行动选项","outcome":{"attributeDeltas":{"属性id":0},"affinityDeltas":{"已登记角色id":0},"flags":["事件标记"],"summary":"选择结果摘要"}},{"id":"b","text":"另一行动","outcome":{"attributeDeltas":{},"affinityDeltas":{},"flags":[],"summary":"选择结果摘要"}}]}}。beats 必须 3–6 条，choices 必须恰好 2 个。首次实际登场的新具名角色或档案待补全角色必须提供 characterProfiles；角色 attributes 必须逐项完整复用“当前属性”中的全部属性 id，数量和 id 完全一致，只选择每项 0–100 整数值，禁止新增、删除、改名或输出其他属性；新角色初始好感 30–70，无名路人不要建档，已登记人物必须复用原 id。每个数值变化只能为 -5 到 5；不能产生结局。玩家角色必须显示快照姓名，禁止称为 U、User 或“玩家”。'
        );
    }
    ['renderTraining']() {
        const run_20 = this.state.activeRun;
        if (!run_20?.training?.map) return;
        const training_4 = run_20.training;
        this.gameView.classList.add('is-training');
        this.trainingView.setAttribute('aria-hidden', 'false');
        this.trainingDay.textContent =
            'DAY ' + String(Math.max(1, training_4.day)).padStart(2, '0');
        this.trainingTitle.textContent = training_4.map.name;
        this.renderTrainingHud(run_20);
        this.renderMap(run_20);
        this.renderTrainingEvent(run_20);
    }
    ['renderTrainingHud'](run_21) {
        const training_365 = run_21.training,
            companions = run_21.cast.filter(
                (actor_24) =>
                    actor_24.type !== 'user' && actor_24.acquainted && actor_24.companionEligible,
            ),
            recommendedLocationIds = this.getRecommendedLocationIds(run_21),
            value_367 = recommendedLocationIds.size
                ? '根据当前锁定选项，推荐 ' + recommendedLocationIds.size + ' 个地点'
                : '自由探索，寻找新的剧情标记';
        this.trainingHud.innerHTML =
            '<div class="netflix-training-status"><span><i class="fas fa-bolt"></i> 行动力 <b>' +
            training_365.actionPoints +
            '/3</b></span><span><i class="fas fa-bullseye"></i> ' +
            this.escapeHtml(value_367) +
            '</span></div><div class="netflix-training-toolbar"><div class="netflix-companion-picker"><span>同行</span><button type="button" data-action="select-companion" data-companion-id="" class="' +
            (training_365.companionId ? '' : 'is-active') +
            '">独自</button>' +
            companions
                .map(
                    (value_369) =>
                        '<button type="button" data-action="select-companion" data-companion-id="' +
                        this.escapeAttr(value_369.id) +
                        '" class="' +
                        (training_365.companionId === value_369.id ? 'is-active' : '') +
                        '">' +
                        this.escapeHtml(value_369.name) +
                        '</button>',
                )
                .join('') +
            '</div><div><button type="button" data-action="toggle-map-layout" class="' +
            (this.mapEditMode ? 'is-active' : '') +
            '"><i class="fas fa-arrows-alt"></i> ' +
            (this.mapEditMode ? '完成布局' : '调整位置') +
            '</button><button type="button" data-action="open-map-editor"><i class="fas fa-edit"></i> 编辑地图</button></div></div>';
    }
    ['getRecommendedLocationIds'](run_22) {
        const missingAttributes = new Set(),
            missingCast = new Set();
        return (
            (run_22.currentScene?.choices || []).forEach((choice_6) => {
                this.core
                    .getRequirementStatus(choice_6, run_22.attributes, run_22.cast)
                    .missing.forEach((item_17) => {
                        if (item_17.kind === 'attribute') missingAttributes.add(item_17.id);
                        if (item_17.kind === 'affinity') missingCast.add(item_17.id);
                    });
            }),
            new Set(
                (run_22.training?.map?.nodes || [])
                    .filter(
                        (node) =>
                            node.focusAttributes.some((id_14) => missingAttributes.has(id_14)) ||
                            node.featuredCastIds.some((id_15) => missingCast.has(id_15)),
                    )
                    .map((node_2) => node_2.id),
            )
        );
    }
    ['renderMap'](run_23) {
        const map_4 = run_23.training.map,
            recommendedLocationIds_378 = this.getRecommendedLocationIds(run_23),
            byId = new Map(map_4.nodes.map((node_3) => [node_3.id, node_3])),
            join_380 = map_4.edges
                .map((value_382) => {
                    const result_383 = byId.get(value_382.from),
                        result_384 = byId.get(value_382.to);
                    if (!result_383 || !result_384) return '';
                    return (
                        '<line x1="' +
                        result_383.x +
                        '%" y1="' +
                        result_383.y +
                        '%" x2="' +
                        result_384.x +
                        '%" y2="' +
                        result_384.y +
                        '%"></line>'
                    );
                })
                .join('');
        this.mapCanvas.innerHTML =
            '<svg class="netflix-map-routes" aria-hidden="true">' +
            join_380 +
            '</svg>' +
            map_4.nodes
                .map((node_4) => {
                    const familiarity_2 = run_23.training.familiarityByLocation[node_4.id] || 0;
                    return (
                        '<button type="button" class="netflix-map-node ' +
                        (recommendedLocationIds_378.has(node_4.id) ? 'is-recommended' : '') +
                        ' ' +
                        (this.mapEditMode ? 'is-editing' : '') +
                        '" data-location-id="' +
                        this.escapeAttr(node_4.id) +
                        '" style="left:' +
                        node_4.x +
                        '%;top:' +
                        node_4.y +
                        '%" aria-label="' +
                        this.escapeAttr(node_4.name) +
                        '，熟悉度 ' +
                        familiarity_2 +
                        '"><i class="fas ' +
                        this.escapeAttr(node_4.icon) +
                        '"></i><span><strong>' +
                        this.escapeHtml(node_4.name) +
                        '</strong><small>' +
                        this.escapeHtml(node_4.type) +
                        ' · 熟悉 ' +
                        familiarity_2 +
                        '/5</small></span>' +
                        (recommendedLocationIds_378.has(node_4.id) ? '<em>推荐</em>' : '') +
                        '</button>'
                    );
                })
                .join('');
        this.applyMapTransform();
    }
    async ['openTrainingLocation'](locationId_2) {
        const run_24 = this.state.activeRun;
        if (
            this.mapEditMode ||
            this.mapDragMoved ||
            this.isBusy ||
            !run_24?.training?.map ||
            run_24.viewMode !== 'training'
        )
            return;
        if (run_24.training.currentEvent || run_24.training.eventResult) return;
        if (run_24.training.actionPoints <= 0) return this.toast('本日行动力已用完');
        const location_2 = run_24.training.map.nodes.find((node_5) => node_5.id === locationId_2);
        if (!location_2) return;
        const pending_6 = this.core.clone(run_24);
        this.setBusy(true, '正在探索' + location_2.name + '…');
        this.generationDetail.textContent = '正在生成不会重复的地点小剧情。';
        try {
            const raw_9 = await this.requestJson(
                this.buildTrainingEventPrompt(pending_6, location_2),
            );
            let event_10 = this.core.normalizeTrainingEventPayload(raw_9, location_2.id, {
                cast: pending_6.cast,
                attributes: pending_6.attributes,
            });
            const resolved = this.core.resolvePlayerSpeakerNames(
                {
                    beats: event_10.beats,
                },
                pending_6.cast,
            );
            if (resolved?.beats)
                event_10 = {
                    ...event_10,
                    beats: resolved.beats,
                };
            pending_6.cast = this.core.mergeCharacterProfiles(
                pending_6.cast,
                event_10.characterProfiles,
                {
                    sceneId: event_10.id,
                    seenAt: event_10.createdAt,
                },
            );
            pending_6.training.currentEvent = event_10;
            pending_6.training.eventBeatIndex = 0;
            pending_6.training.eventResult = null;
            this.state.activeRun = pending_6;
            await this.updateAutoSave(true);
            this.renderTraining();
        } catch (error_13) {
            console.error('[Netflix] training event generation failed:', error_13);
            if (
                !window.u2Api?.isRequestError?.(error_13) ||
                !window.u2Api.reportError(error_13, {
                    operation: '地点剧情生成',
                })
            )
                this.toast(error_13?.message || '地点剧情生成失败，请重试');
        } finally {
            this.setBusy(false);
        }
    }
    ['renderTrainingEvent'](run_25) {
        const training_5 = run_25.training,
            event_11 = training_5.currentEvent,
            result_3 = training_5.eventResult;
        if (!event_11 && !result_3) {
            this.trainingEvent.classList.remove('is-active');
            this.trainingEvent.setAttribute('aria-hidden', 'true');
            this.trainingEvent.innerHTML = '';
            return;
        }
        if (result_3) {
            const join_400 = (result_3.attributeChanges || [])
                    .map(
                        (value_405) =>
                            '<div><span>' +
                            this.escapeHtml(value_405.name) +
                            '</span><b class="' +
                            (value_405.delta > 0 ? 'is-positive' : 'is-negative') +
                            '">' +
                            (value_405.delta > 0 ? '+' : '') +
                            value_405.delta +
                            '</b><small>' +
                            value_405.before +
                            ' → ' +
                            value_405.after +
                            '</small></div>',
                    )
                    .join(''),
                join_401 = (result_3.affinityChanges || [])
                    .map(
                        (value_406) =>
                            '<div><span>' +
                            this.escapeHtml(value_406.name) +
                            '好感</span><b class="' +
                            (value_406.delta > 0 ? 'is-positive' : 'is-negative') +
                            '">' +
                            (value_406.delta > 0 ? '+' : '') +
                            value_406.delta +
                            '</b><small>' +
                            value_406.before +
                            ' → ' +
                            value_406.after +
                            '</small></div>',
                    )
                    .join(''),
                value_402 =
                    '' + join_400 + join_401 ||
                    '<p class="netflix-training-result-empty">本次行动没有改变属性或好感度。</p>',
                value_403 = (result_3.flags || []).length
                    ? '<div class="netflix-training-result-flags"><span>获得事件标记</span>' +
                      result_3.flags
                          .map((value_407) => '<b>' + this.escapeHtml(value_407) + '</b>')
                          .join('') +
                      '</div>'
                    : '',
                value_404 =
                    '<div class="netflix-training-result"><span>ACTION RESULT</span><h2>行动结算</h2><strong>' +
                    this.escapeHtml(result_3.choiceText) +
                    '</strong><p>' +
                    this.escapeHtml(result_3.summary || '这次行动已经结束。') +
                    '</p><div class="netflix-training-result-values">' +
                    value_402 +
                    '</div>' +
                    value_403 +
                    '<button type="button" class="netflix-primary-button" data-action="dismiss-training-result">返回地图 · 剩余 ' +
                    result_3.actionPoints +
                    ' 点行动力</button></div>';
            this.trainingEvent.innerHTML =
                '<div class="netflix-training-event-card">' + value_404 + '</div>';
            this.trainingEvent.classList.add('is-active');
            this.trainingEvent.setAttribute('aria-hidden', 'false');
            return;
        }
        const beat_3 =
            event_11.beats[Math.min(training_5.eventBeatIndex, event_11.beats.length - 1)];
        let value_399;
        if (training_5.eventBeatIndex < event_11.beats.length) {
            const identityActor_2 = this.prepareIdentityCard(
                run_25,
                'training',
                event_11,
                training_5.eventBeatIndex,
            );
            value_399 = identityActor_2
                ? this.renderIdentityCardMarkup(identityActor_2)
                : '<button type="button" class="netflix-training-dialogue ' +
                  (beat_3.kind === 'narration' ? 'is-narration' : '') +
                  '" data-action="advance-training-event">' +
                  (beat_3.kind === 'dialogue'
                      ? '<span>' + this.escapeHtml(beat_3.speakerName) + '</span>'
                      : '<span>旁白</span>') +
                  '<strong>' +
                  this.escapeHtml(beat_3.text) +
                  '</strong><small>' +
                  (training_5.eventBeatIndex + 1) +
                  ' / ' +
                  event_11.beats.length +
                  ' <i class="fas fa-chevron-down"></i></small></button>';
        } else
            value_399 =
                '<div class="netflix-training-event-choices"><span>EVENT CHOICE</span><h2>' +
                this.escapeHtml(event_11.title) +
                '</h2>' +
                event_11.choices
                    .map(
                        (value_409, value_410) =>
                            '<button type="button" data-training-choice-id="' +
                            this.escapeAttr(value_409.id) +
                            '"><b>' +
                            String.fromCharCode(65 + value_410) +
                            '</b><strong>' +
                            this.escapeHtml(value_409.text) +
                            '</strong></button>',
                    )
                    .join('') +
                '</div>';
        this.trainingEvent.innerHTML =
            '<div class="netflix-training-event-card">' + value_399 + '</div>';
        this.trainingEvent.classList.add('is-active');
        this.trainingEvent.setAttribute('aria-hidden', 'false');
    }
    ['advanceTrainingEvent']() {
        const run_26 = this.state.activeRun;
        if (this.isBusy || this.isTransitioning || !run_26?.training?.currentEvent) return;
        const commit_2 = () => {
            run_26.training.eventBeatIndex = Math.min(
                run_26.training.currentEvent.beats.length,
                run_26.training.eventBeatIndex + 1,
            );
            this.updateAutoSave(false);
            this.renderTrainingEvent(run_26);
        };
        if (
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
            this.state.uiSettings?.reduceMotion
        )
            return commit_2();
        this.isTransitioning = true;
        this.trainingEvent.firstElementChild?.classList.add('netflix-stage-leaving');
        setTimeout(() => {
            commit_2();
            this.trainingEvent.firstElementChild?.classList.add('netflix-stage-entering');
            setTimeout(() => {
                this.isTransitioning = false;
            }, 170);
        }, 90);
    }
    async ['resolveTrainingChoice'](choiceId_3) {
        const run_27 = this.state.activeRun,
            event_12 = run_27?.training?.currentEvent;
        if (this.isBusy || !event_12 || run_27.training.eventBeatIndex < event_12.beats.length)
            return;
        const choice_7 = event_12.choices.find((item_18) => item_18.id === choiceId_3);
        if (!choice_7) return;
        const before_2 = this.core.clone(run_27);
        let next = this.core.applyTrainingOutcome(run_27, choice_7.outcome);
        const training_6 = next.training;
        training_6.actionPoints = Math.max(0, training_6.actionPoints - 1);
        training_6.familiarityByLocation[event_12.locationId] = Math.min(
            5,
            (training_6.familiarityByLocation[event_12.locationId] || 0) + 1,
        );
        const summary_2 =
            choice_7.outcome.summary || event_12.summary || event_12.title + '：' + choice_7.text;
        training_6.eventLog.push({
            ...this.core.clone(event_12),
            selectedChoice: {
                id: choice_7.id,
                text: choice_7.text,
            },
            resolvedAt: Date.now(),
        });
        training_6.eventLog = training_6.eventLog.slice(-200);
        training_6.recentEventSummaries.push(summary_2);
        training_6.recentEventSummaries = training_6.recentEventSummaries.slice(-12);
        const beforeAttributes = new Map(
                (before_2.attributes || []).map((attribute_7) => [attribute_7.id, attribute_7]),
            ),
            beforeCast = new Map((before_2.cast || []).map((actor_25) => [actor_25.id, actor_25]));
        training_6.eventResult = {
            eventId: event_12.id,
            title: event_12.title,
            choiceText: choice_7.text,
            summary: summary_2,
            attributeChanges: (next.attributes || [])
                .map((attribute_8) => {
                    const previous = beforeAttributes.get(attribute_8.id);
                    return previous && previous.value !== attribute_8.value
                        ? {
                              id: attribute_8.id,
                              name: attribute_8.name,
                              before: previous.value,
                              after: attribute_8.value,
                              delta: attribute_8.value - previous.value,
                          }
                        : null;
                })
                .filter(Boolean),
            affinityChanges: (next.cast || [])
                .map((actor_26) => {
                    const previous_2 = beforeCast.get(actor_26.id);
                    return actor_26.type !== 'user' &&
                        previous_2 &&
                        previous_2.affinity !== actor_26.affinity
                        ? {
                              id: actor_26.id,
                              name: actor_26.name,
                              before: previous_2.affinity,
                              after: actor_26.affinity,
                              delta: actor_26.affinity - previous_2.affinity,
                          }
                        : null;
                })
                .filter(Boolean),
            flags: [...(choice_7.outcome.flags || [])],
            actionPoints: training_6.actionPoints,
            resolvedAt: Date.now(),
        };
        training_6.currentEvent = null;
        training_6.eventBeatIndex = 0;
        next.updatedAt = Date.now();
        this.state.activeRun = next;
        await this.updateAutoSave(true);
        this.renderTraining();
    }
    async ['dismissTrainingResult']() {
        const activeRun_427 = this.state.activeRun;
        if (this.isBusy || !activeRun_427?.training?.eventResult) return;
        activeRun_427.training.eventResult = null;
        activeRun_427.updatedAt = Date.now();
        await this.updateAutoSave(true);
        this.renderTraining();
    }
    ['closeTrainingEvent']() {
        if (this.state.activeRun?.training?.currentEvent) this.toast('请先读完并选择本次行动结果');
        else {
            if (this.state.activeRun?.training?.eventResult) this.toast('请先确认本次行动结算');
        }
    }
    ['selectTrainingCompanion'](id_16) {
        const run_28 = this.state.activeRun;
        if (!run_28?.training || this.isBusy) return;
        const valid =
            !id_16 ||
            run_28.cast.some(
                (actor_27) =>
                    actor_27.id === id_16 &&
                    actor_27.type !== 'user' &&
                    actor_27.acquainted &&
                    actor_27.companionEligible,
            );
        if (!valid) return;
        run_28.training.companionId = id_16 || '';
        this.updateAutoSave(false);
        this.renderTrainingHud(run_28);
    }
    ['continueStory']() {
        const run_29 = this.state.activeRun;
        if (this.isBusy || !run_29) return;
        if (run_29.training?.currentEvent) return this.toast('请先完成当前地点事件');
        if (run_29.training?.eventResult) return this.toast('请先确认本次行动结算');
        run_29.viewMode = 'story';
        if (run_29.storyReturnPoint)
            run_29.beatIndex = this.core.clampInt(
                run_29.storyReturnPoint.beatIndex,
                0,
                run_29.currentScene.beats.length,
                run_29.beatIndex,
            );
        run_29.storyReturnPoint = null;
        this.mapEditMode = false;
        this.updateAutoSave(false);
        this.renderGame();
    }
    ['continueContext']() {
        this.closeSheet(this.menuSheet);
        if (this.state.activeRun?.viewMode === 'training') this.continueStory();
    }
    ['openMapEditor']() {
        const map_5 = this.state.activeRun?.training?.map;
        if (!map_5 || this.isBusy) return;
        this.mapEditorDraft = this.core.clone(map_5);
        this.renderMapEditor();
        this.openSheet(this.mapEditorSheet);
    }
    ['renderMapEditor']() {
        const map_6 = this.mapEditorDraft;
        if (!map_6) return;
        const join_435 = map_6.edges.map((value_436) => value_436.from + ' > ' + value_436.to)
            .join(`
`);
        this.mapEditorBody.innerHTML =
            '<label class="netflix-field"><span>地图名称</span><input type="text" maxlength="40" data-map-field="name" value="' +
            this.escapeAttr(map_6.name) +
            '"></label><label class="netflix-field"><span>整体说明</span><textarea maxlength="320" data-map-field="description">' +
            this.escapeHtml(map_6.description || '') +
            '</textarea></label><div class="netflix-map-editor-heading"><h3>地点 ' +
            map_6.nodes.length +
            '/12</h3><button type="button" data-action="add-map-node" ' +
            (map_6.nodes.length >= 12 ? 'disabled' : '') +
            '><i class="fas fa-plus"></i> 添加地点</button></div><div class="netflix-map-editor-nodes">' +
            map_6.nodes
                .map(
                    (node_6) =>
                        '<article data-map-node-editor="' +
                        this.escapeAttr(node_6.id) +
                        '"><header><strong>' +
                        this.escapeHtml(node_6.name) +
                        '</strong><button type="button" data-action="delete-map-node" data-map-node-id="' +
                        this.escapeAttr(node_6.id) +
                        '" ' +
                        (map_6.nodes.length <= 4 ? 'disabled' : '') +
                        ' aria-label="删除地点"><i class="fas fa-trash-alt"></i></button></header><div><label><span>名称</span><input type="text" maxlength="30" data-node-field="name" value="' +
                        this.escapeAttr(node_6.name) +
                        '"></label><label><span>类型</span><input type="text" maxlength="20" data-node-field="type" value="' +
                        this.escapeAttr(node_6.type) +
                        '"></label><label class="is-wide"><span>介绍</span><textarea maxlength="240" data-node-field="description">' +
                        this.escapeHtml(node_6.description) +
                        '</textarea></label><label><span>X 位置</span><input type="number" min="5" max="95" data-node-field="x" value="' +
                        node_6.x +
                        '"></label><label><span>Y 位置</span><input type="number" min="8" max="92" data-node-field="y" value="' +
                        node_6.y +
                        '"></label><label class="is-wide"><span>关联属性 ID（逗号分隔）</span><input type="text" data-node-field="focusAttributes" value="' +
                        this.escapeAttr(node_6.focusAttributes.join(',')) +
                        '"></label><label class="is-wide"><span>关联主演 ID（逗号分隔）</span><input type="text" data-node-field="featuredCastIds" value="' +
                        this.escapeAttr(node_6.featuredCastIds.join(',')) +
                        '"></label></div></article>',
                )
                .join('') +
            '</div><label class="netflix-field"><span>地点连线（每行：地点ID &gt; 地点ID）</span><textarea data-map-field="edges" spellcheck="false">' +
            this.escapeHtml(join_435) +
            '</textarea></label><div class="netflix-map-editor-actions"><button type="button" class="netflix-secondary-button" data-action="regenerate-map"><i class="fas fa-sync-alt"></i> 重新生成</button><button type="button" class="netflix-primary-button" data-action="save-map-editor"><i class="fas fa-save"></i> 保存地图</button></div>';
    }
    ['collectMapEditorDraft']() {
        if (!this.mapEditorDraft) return null;
        const draft = this.core.clone(this.mapEditorDraft),
            root = this.mapEditorBody;
        return (
            (draft.name = root.querySelector('[data-map-field="name"]')?.value || draft.name),
            (draft.description = root.querySelector('[data-map-field="description"]')?.value || ''),
            (draft.nodes = [...root.querySelectorAll('[data-map-node-editor]')].map((card) => {
                const original = draft.nodes.find(
                        (node_7) => node_7.id === card.dataset.mapNodeEditor,
                    ),
                    read = (value_443) =>
                        card.querySelector('[data-node-field="' + value_443 + '"]')?.value;
                return {
                    ...original,
                    name: read('name'),
                    type: read('type'),
                    description: read('description'),
                    x: read('x'),
                    y: read('y'),
                    focusAttributes: String(read('focusAttributes') || '')
                        .split(',')
                        .map((value_17) => value_17.trim())
                        .filter(Boolean),
                    featuredCastIds: String(read('featuredCastIds') || '')
                        .split(',')
                        .map((value_21) => value_21.trim())
                        .filter(Boolean),
                };
            })),
            (draft.edges = String(root.querySelector('[data-map-field="edges"]')?.value || '')
                .split(/\r?\n/)
                .map((line) => line.split(/>|→/).map((value_22) => value_22.trim()))
                .filter((parts) => parts.length === 2)
                .map(([from_2, to_2]) => ({
                    from: from_2,
                    to: to_2,
                }))),
            draft
        );
    }
    ['addMapNode']() {
        const draft_2 = this.collectMapEditorDraft();
        if (!draft_2 || draft_2.nodes.length >= 12) return;
        const id_17 = 'location-' + Date.now().toString(36),
            previous_3 = draft_2.nodes[draft_2.nodes.length - 1];
        draft_2.nodes.push({
            id: id_17,
            name: '新地点',
            description: '填写这个地点的环境与用途。',
            type: '剧情地点',
            icon: 'fa-map-marker-alt',
            x: 50,
            y: 50,
            focusAttributes: [],
            featuredCastIds: [],
        });
        if (previous_3)
            draft_2.edges.push({
                from: previous_3.id,
                to: id_17,
            });
        this.mapEditorDraft = draft_2;
        this.renderMapEditor();
    }
    ['deleteMapNode'](id_18) {
        const draft_3 = this.collectMapEditorDraft();
        if (!draft_3 || draft_3.nodes.length <= 4) return;
        draft_3.nodes = draft_3.nodes.filter((node_8) => node_8.id !== id_18);
        draft_3.edges = draft_3.edges.filter((edge) => edge.from !== id_18 && edge.to !== id_18);
        this.mapEditorDraft = draft_3;
        this.renderMapEditor();
    }
    async ['saveMapEditor']() {
        const run_30 = this.state.activeRun;
        if (!run_30?.training || this.isBusy) return;
        try {
            const map_7 = this.core.normalizeMapPayload(
                {
                    map: this.collectMapEditorDraft(),
                },
                {
                    manual: true,
                },
            );
            run_30.training.map = map_7;
            const ids_3 = new Set(map_7.nodes.map((node_9) => node_9.id));
            run_30.training.familiarityByLocation = Object.entries(
                run_30.training.familiarityByLocation,
            ).reduce((result_4, [id_19, value_23]) => {
                if (ids_3.has(id_19)) result_4[id_19] = value_23;
                return result_4;
            }, {});
            await this.updateAutoSave(true);
            this.closeSheet(this.mapEditorSheet);
            this.renderTraining();
            this.toast('地图已保存');
        } catch (error_14) {
            this.toast(error_14?.message || '地图信息不完整');
        }
    }
    async ['regenerateMap']() {
        const run_31 = this.state.activeRun;
        if (
            this.isBusy ||
            !run_31 ||
            !window.confirm(
                '重新生成会替换地点、连线和熟悉度，已获得的属性与事件记录会保留。是否继续？',
            )
        )
            return;
        this.closeSheet(this.mapEditorSheet);
        const activeRun_4 = this.core.clone(run_31);
        this.setBusy(true, '正在重新生成地图…');
        this.generationDetail.textContent = '正在重建地点与路线，原有数值不会改变。';
        try {
            activeRun_4.training.map = await this.requestTrainingMap(activeRun_4);
            activeRun_4.training.familiarityByLocation = {};
            activeRun_4.training.currentEvent = null;
            activeRun_4.training.eventBeatIndex = 0;
            this.state.activeRun = activeRun_4;
            await this.updateAutoSave(true);
            this.resetMapView(false);
            this.renderTraining();
        } catch (error_15) {
            console.error('[Netflix] map regeneration failed:', error_15);
            if (
                !window.u2Api?.isRequestError?.(error_15) ||
                !window.u2Api.reportError(error_15, {
                    operation: '地图重新生成',
                })
            )
                this.toast(error_15?.message || '地图重新生成失败');
        } finally {
            this.setBusy(false);
        }
    }
    ['toggleMapLayout']() {
        if (this.isBusy) return;
        this.mapEditMode = !this.mapEditMode;
        if (!this.mapEditMode) this.updateAutoSave(false);
        this.renderTraining();
    }
    ['applyMapTransform']() {
        if (!this.mapCanvas) return;
        const { x: x_2, y: y_2, scale: scale_2 } = this.mapTransform;
        this.mapCanvas.style.transform =
            'translate3d(' + x_2 + 'px, ' + y_2 + 'px, 0) scale(' + scale_2 + ')';
    }
    ['zoomMap'](delta_2) {
        this.mapTransform.scale = Math.max(0.75, Math.min(1.6, this.mapTransform.scale + delta_2));
        this.applyMapTransform();
    }
    ['resetMapView'](render = true) {
        this.mapTransform = {
            x: 0,
            y: 0,
            scale: 1,
        };
        if (render) this.applyMapTransform();
    }
    ['handleMapWheel'](event_13) {
        if (this.state.activeRun?.viewMode !== 'training') return;
        event_13.preventDefault();
        this.zoomMap(event_13.deltaY > 0 ? -0.1 : 0.1);
    }
    ['handleMapPointerDown'](event_14) {
        if (this.state.activeRun?.viewMode !== 'training' || this.isBusy) return;
        this.mapViewport.setPointerCapture?.(event_14.pointerId);
        this.mapPointers.set(event_14.pointerId, {
            x: event_14.clientX,
            y: event_14.clientY,
        });
        const node_10 = event_14.target.closest('[data-location-id]');
        if (this.mapPointers.size === 2) {
            const points = [...this.mapPointers.values()];
            this.mapGesture = {
                mode: 'pinch',
                distance: Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y),
                scale: this.mapTransform.scale,
            };
        } else
            this.mapGesture = {
                mode: this.mapEditMode && node_10 ? 'node' : 'pan',
                startX: event_14.clientX,
                startY: event_14.clientY,
                originX: this.mapTransform.x,
                originY: this.mapTransform.y,
                nodeId: node_10?.dataset.locationId || '',
                moved: false,
            };
    }
    ['handleMapPointerMove'](event_15) {
        if (!this.mapPointers.has(event_15.pointerId) || !this.mapGesture) return;
        this.mapPointers.set(event_15.pointerId, {
            x: event_15.clientX,
            y: event_15.clientY,
        });
        if (this.mapPointers.size >= 2) {
            const points_2 = [...this.mapPointers.values()],
                distance_2 = Math.hypot(
                    points_2[0].x - points_2[1].x,
                    points_2[0].y - points_2[1].y,
                );
            if (this.mapGesture.mode !== 'pinch')
                this.mapGesture = {
                    mode: 'pinch',
                    distance: distance_2,
                    scale: this.mapTransform.scale,
                };
            this.mapTransform.scale = Math.max(
                0.75,
                Math.min(
                    1.6,
                    this.mapGesture.scale * (distance_2 / Math.max(1, this.mapGesture.distance)),
                ),
            );
            this.applyMapTransform();
            this.mapDragMoved = true;
            return;
        }
        const dx = event_15.clientX - this.mapGesture.startX,
            dy = event_15.clientY - this.mapGesture.startY;
        if (Math.abs(dx) + Math.abs(dy) > 5) this.mapGesture.moved = this.mapDragMoved = true;
        if (this.mapGesture.mode === 'pan') {
            this.mapTransform.x = this.mapGesture.originX + dx;
            this.mapTransform.y = this.mapGesture.originY + dy;
            this.applyMapTransform();
        } else {
            if (this.mapGesture.mode === 'node') {
                const node_11 = this.state.activeRun?.training?.map?.nodes.find(
                    (item_19) => item_19.id === this.mapGesture.nodeId,
                );
                if (!node_11) return;
                const rect = this.mapCanvas.getBoundingClientRect();
                node_11.x = this.core.clampInt(
                    ((event_15.clientX - rect.left) / Math.max(1, rect.width)) * 100,
                    5,
                    95,
                    node_11.x,
                );
                node_11.y = this.core.clampInt(
                    ((event_15.clientY - rect.top) / Math.max(1, rect.height)) * 100,
                    8,
                    92,
                    node_11.y,
                );
                const element_3 = [...this.mapCanvas.querySelectorAll('[data-location-id]')].find(
                    (item_20) => item_20.dataset.locationId === node_11.id,
                );
                element_3 &&
                    ((element_3.style.left = node_11.x + '%'),
                    (element_3.style.top = node_11.y + '%'));
            }
        }
    }
    ['handleMapPointerUp'](event_16) {
        if (!this.mapPointers.has(event_16.pointerId)) return;
        const movedNode = this.mapGesture?.mode === 'node' && this.mapGesture.moved;
        this.mapPointers['delete'](event_16.pointerId);
        if (this.mapPointers.size === 1) {
            const point = [...this.mapPointers.values()][0];
            this.mapGesture = {
                mode: 'pan',
                startX: point.x,
                startY: point.y,
                originX: this.mapTransform.x,
                originY: this.mapTransform.y,
                moved: true,
            };
        } else
            !this.mapPointers.size &&
                ((this.mapGesture = null),
                movedNode && (this.renderMap(this.state.activeRun), this.updateAutoSave(false)),
                setTimeout(() => {
                    this.mapDragMoved = false;
                }, 0));
    }
    ['createSnapshot'](run_32 = this.state.activeRun) {
        if (!run_32?.currentScene) return null;
        return this.core.normalizeSnapshot({
            id: 'save-' + Date.now(),
            title: run_32.setup.title,
            phase: run_32.phase,
            sceneNumber: run_32.sceneNumber,
            beatIndex: run_32.beatIndex,
            savedAt: Date.now(),
            run: this.core.clone(run_32),
        });
    }
    async ['updateAutoSave'](flush_2 = false) {
        const auto_2 = this.createSnapshot();
        if (!auto_2) return false;
        return (
            (this.state.activeRun = this.core.clone(auto_2.run)),
            (this.state.saveSlots.auto = auto_2),
            this.saveState({
                flush: flush_2,
            })
        );
    }
    ['openSaves'](mode_2 = 'load') {
        if (this.isBusy) return this.toast('剧情生成期间暂不能操作存档');
        if (this.hubDraftOpen && mode_2 === 'save') return this.toast('开始剧情后才能存档');
        this.saveReturnToSettings =
            this.infoSheet.classList.contains('is-active') && this.infoTitle.textContent === '设置';
        this.saveModalMode = mode_2 === 'save' ? 'save' : 'load';
        this.saveTitle.textContent = this.saveModalMode === 'save' ? '保存进度' : '读取进度';
        this.renderSaveSlots();
        this.closeSheet(this.menuSheet);
        this.closeSheet(this.infoSheet);
        this.openSheet(this.saveSheet);
    }
    ['closeSaves']() {
        this.closeSheet(this.saveSheet);
        if (this.saveReturnToSettings && this.gameView.classList.contains('is-active'))
            this.showGameSettings();
        this.saveReturnToSettings = false;
    }
    ['renderSaveSlots']() {
        const auto_3 = this.state.saveSlots.auto,
            slots = this.state.saveSlots.manual;
        this.saveList.innerHTML =
            `
            <section class="netflix-save-group"><h3>自动存档</h3>` +
            this.renderSaveSlot(auto_3, 'auto', -1) +
            `</section>
            <section class="netflix-save-group"><h3>手动存档</h3>` +
            slots
                .map((snapshot_2, index_2) => this.renderSaveSlot(snapshot_2, 'manual', index_2))
                .join('') +
            '</section>';
    }
    ['renderSaveSlot'](snapshot_3, value_494, value_495) {
        const value_496 = value_494 === 'auto' ? 'AUTO' : 'SLOT ' + (value_495 + 1);
        if (!snapshot_3)
            return (
                '<article class="netflix-save-slot is-empty"><span>' +
                value_496 +
                '</span><div><strong>空存档</strong><small>还没有故事记录</small></div>' +
                (this.saveModalMode === 'save' && value_494 === 'manual' && this.state.activeRun
                    ? '<button type="button" data-action="save-slot" data-slot-index="' +
                      value_495 +
                      '">保存</button>'
                    : '') +
                '</article>'
            );
        const savedTime = new Date(snapshot_3.savedAt).toLocaleString('zh-CN', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            value_498 =
                snapshot_3.run?.viewMode === 'training'
                    ? '养成 DAY ' + (snapshot_3.run.training?.day || 1)
                    : snapshot_3.phase === 'prologue'
                      ? '序章'
                      : snapshot_3.phase === 'ending'
                        ? '结局'
                        : snapshot_3.phase === 'epilogue'
                          ? '番外'
                          : '场景 ' + snapshot_3.sceneNumber;
        return (
            '<article class="netflix-save-slot"><span>' +
            value_496 +
            '</span><div><strong>' +
            this.escapeHtml(snapshot_3.title) +
            '</strong><small>' +
            value_498 +
            ' · 对话 ' +
            (snapshot_3.beatIndex + 1) +
            ' · ' +
            savedTime +
            '</small></div><div class="netflix-save-actions">' +
            (this.saveModalMode === 'save' && value_494 === 'manual'
                ? '<button type="button" data-action="save-slot" data-slot-index="' +
                  value_495 +
                  '" aria-label="覆盖存档"><i class="fas fa-save"></i></button>'
                : '<button type="button" data-action="load-slot" data-slot-kind="' +
                  value_494 +
                  '" data-slot-index="' +
                  value_495 +
                  '" aria-label="读取存档"><i class="fas fa-play"></i></button>') +
            (value_494 === 'manual'
                ? '<button type="button" class="is-danger" data-action="delete-save" data-slot-index="' +
                  value_495 +
                  '" aria-label="删除存档"><i class="fas fa-trash-alt"></i></button>'
                : '') +
            '</div></article>'
        );
    }
    async ['writeManualSave'](index_3) {
        if (
            this.isBusy ||
            !this.state.activeRun ||
            index_3 < 0 ||
            index_3 >= this.core.MANUAL_SLOT_COUNT
        )
            return;
        if (
            this.state.saveSlots.manual[index_3] &&
            !window.confirm('覆盖手动存档 ' + (index_3 + 1) + '？')
        )
            return;
        this.state.saveSlots.manual[index_3] = this.createSnapshot();
        const saved = await this.saveState({
            flush: true,
        });
        if (saved) this.toast('已保存到槽位 ' + (index_3 + 1));
        this.renderSaveSlots();
        this.renderProfile();
    }
    async ['loadSave'](kind_2, index_4) {
        if (this.isBusy) return;
        const snapshot_4 =
            kind_2 === 'auto' ? this.state.saveSlots.auto : this.state.saveSlots.manual[index_4];
        if (!snapshot_4) return;
        if (
            this.state.activeRun &&
            !window.confirm('读取“' + snapshot_4.title + '”？当前进度会由自动档保存后切换。')
        )
            return;
        if (this.state.activeRun) await this.updateAutoSave(true);
        this.state.activeRun = this.core.clone(snapshot_4.run);
        this.state.saveSlots.auto = this.createSnapshot(this.state.activeRun);
        await this.saveState({
            flush: true,
        });
        this.closeSheet(this.saveSheet);
        this.saveReturnToSettings = false;
        this.closeSheet(this.menuSheet);
        this.closeSetup();
        this.openGame();
        this.toast('存档已读取');
    }
    async ['deleteManualSave'](index_5) {
        if (
            index_5 < 0 ||
            index_5 >= this.core.MANUAL_SLOT_COUNT ||
            !this.state.saveSlots.manual[index_5]
        )
            return;
        if (!window.confirm('删除手动存档 ' + (index_5 + 1) + '？删除后无法恢复。')) return;
        this.state.saveSlots.manual[index_5] = null;
        await this.saveState({
            flush: true,
        });
        this.renderSaveSlots();
        this.renderProfile();
    }
    ['openGameMenu']() {
        if (this.isBusy || this.state.activeRun?.phase === 'prologue') return;
        const training_7 = this.state.activeRun?.viewMode === 'training',
            label = this.menuContinue?.querySelector('span');
        if (label) label.textContent = training_7 ? '继续剧情' : '继续游戏';
        this.openSheet(this.menuSheet);
    }
    ['showAttributes']() {
        const editableSetup_506 = this.getEditableSetup();
        if (!editableSetup_506) return;
        const value_507 =
            editableSetup_506.cast.find((actor_28) => actor_28.type === 'user') ||
            this.getUserActor();
        this.infoTitle.textContent = '属性';
        this.infoBody.innerHTML =
            '<div class="netflix-hub-info"><section><h3>User 人设</h3>' +
            this.renderSetupActor(value_507) +
            '</section><section><div class="netflix-section-heading"><div><h3>' +
            (this.hubDraftOpen ? '初始属性' : '当前属性') +
            '</h3><p>属性值会影响后续剧情与选项。</p></div><button type="button" class="netflix-section-action" data-action="reroll-attributes"><i class="fas fa-dice"></i> 重随机</button></div><div class="netflix-attribute-grid">' +
            editableSetup_506.attributes
                .map((attribute_9) => this.renderSetupAttribute(attribute_9))
                .join('') +
            '</div><button type="button" class="netflix-dashed-button" data-action="add-attribute"><i class="fas fa-plus"></i> 添加自定义属性</button></section></div>';
        this.closeSheet(this.menuSheet);
        this.openSheet(this.infoSheet);
    }
    ['showRelations'](closeMenu = true) {
        const run_33 = this.state.activeRun;
        if (!run_33) return;
        const relations = run_33.cast.filter(
            (actor_29) => actor_29.type !== 'user' && actor_29.acquainted,
        );
        this.infoTitle.textContent = '关系';
        this.infoBody.innerHTML = relations.length
            ? '<div class="netflix-relation-list">' +
              relations
                  .map(
                      (value_514) =>
                          '<button type="button" data-action="show-character-detail" data-character-id="' +
                          this.escapeAttr(value_514.id) +
                          '">' +
                          this.renderAvatarMarkup(value_514) +
                          '<span><strong>' +
                          this.escapeHtml(value_514.name) +
                          '</strong><small>' +
                          this.escapeHtml(value_514.identity || '档案待补充') +
                          '</small></span><b><small>好感</small>' +
                          value_514.affinity +
                          '</b><i class="fas fa-chevron-right"></i></button>',
                  )
                  .join('') +
              '</div>'
            : '<div class="netflix-empty-state">还没有结识任何角色。角色首次登场时，可以通过身份卡选择结识。</div>';
        if (closeMenu) this.closeSheet(this.menuSheet);
        this.openSheet(this.infoSheet);
    }
    ['showCharacterDetail'](characterId_2) {
        const run_34 = this.state.activeRun,
            actor_30 = run_34?.cast?.find(
                (item_21) =>
                    item_21.id === characterId_2 && item_21.type !== 'user' && item_21.acquainted,
            );
        if (!actor_30) return;
        const firstMet = actor_30.acquaintedAt
                ? new Date(actor_30.acquaintedAt).toLocaleString('zh-CN', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                  })
                : '旧存档关系',
            value_519 = actor_30.characterAttributes?.length
                ? actor_30.characterAttributes
                      .map(
                          (value_521) =>
                              '<div><span>' +
                              this.escapeHtml(value_521.name) +
                              '</span><b>' +
                              value_521.value +
                              '</b><i><em style="width:' +
                              value_521.value +
                              '%"></em></i></div>',
                      )
                      .join('')
                : '<div class="netflix-character-profile-empty">属性档案待补充，角色下次登场时会自动完善。</div>';
        this.infoTitle.textContent = actor_30.name;
        this.infoBody.innerHTML =
            '<article class="netflix-character-profile"><button type="button" class="netflix-info-back" data-action="back-to-relations"><i class="fas fa-chevron-left"></i> 返回关系</button><header>' +
            this.renderAvatarMarkup(actor_30) +
            '<div><span>' +
            this.escapeHtml(actor_30.identity || '档案待补充') +
            '</span><h3>' +
            this.escapeHtml(actor_30.name) +
            '</h3><p>' +
            this.escapeHtml(actor_30.occupation || '未知职业') +
            ' · ' +
            this.escapeHtml(actor_30.faction || '未知阵营') +
            '</p></div></header><p>' +
            this.escapeHtml(actor_30.persona || '暂无人物介绍') +
            '</p><section><div class="netflix-character-affinity"><span>好感度</span><b>' +
            actor_30.affinity +
            '</b><i><em style="width:' +
            actor_30.affinity +
            '%"></em></i></div><h4>角色属性</h4><div class="netflix-character-traits">' +
            value_519 +
            '</div></section><footer><span><i class="fas fa-handshake"></i> ' +
            this.escapeHtml(actor_30.acquaintedSceneId || '已有关系') +
            ' · ' +
            firstMet +
            '</span><span><i class="fas fa-walking"></i> ' +
            (actor_30.companionEligible ? '可在养成中同行' : '暂不可同行') +
            '</span></footer></article>';
    }
    ['showHistory']() {
        const run_35 = this.state.activeRun;
        if (!run_35) return;
        this.infoTitle.textContent = '剧情回看';
        const join_523 = (run_35.storyLog || [])
                .slice()
                .reverse()
                .map(
                    (entry_5) =>
                        '<article><span>' +
                        this.escapeHtml(entry_5.phase === 'prologue' ? '序章' : entry_5.title) +
                        '</span>' +
                        entry_5.beats
                            .map(
                                (value_526) =>
                                    '<p>' +
                                    (value_526.speakerName
                                        ? '<b>' + this.escapeHtml(value_526.speakerName) + '</b>'
                                        : '') +
                                    this.escapeHtml(value_526.text) +
                                    '</p>',
                            )
                            .join('') +
                        (entry_5.selectedChoice
                            ? '<div><i class="fas fa-angle-right"></i> ' +
                              this.escapeHtml(entry_5.selectedChoice.text) +
                              '</div>'
                            : '') +
                        '</article>',
                )
                .join(''),
            join_524 = (run_35.training?.eventLog || [])
                .slice()
                .reverse()
                .map(
                    (snapshot_5) =>
                        '<article><span>养成 · ' +
                        this.escapeHtml(snapshot_5.title) +
                        '</span>' +
                        snapshot_5.beats
                            .map(
                                (value_528) =>
                                    '<p>' +
                                    (value_528.speakerName
                                        ? '<b>' + this.escapeHtml(value_528.speakerName) + '</b>'
                                        : '') +
                                    this.escapeHtml(value_528.text) +
                                    '</p>',
                            )
                            .join('') +
                        (snapshot_5.selectedChoice
                            ? '<div><i class="fas fa-angle-right"></i> ' +
                              this.escapeHtml(snapshot_5.selectedChoice.text) +
                              '</div>'
                            : '') +
                        '</article>',
                )
                .join('');
        this.infoBody.innerHTML =
            '<div class="netflix-history-list">' + join_523 + join_524 + '</div>';
        this.closeSheet(this.menuSheet);
        this.openSheet(this.infoSheet);
    }
    ['showEndings']() {
        this.infoTitle.textContent = '结局收藏';
        this.infoBody.innerHTML = this.state.unlockedEndings.length
            ? '<div class="netflix-ending-list">' +
              this.state.unlockedEndings
                  .map(
                      (ending_3) =>
                          '<article><span>' +
                          this.escapeHtml(ending_3.type) +
                          '</span><h3>' +
                          this.escapeHtml(ending_3.title) +
                          '</h3><p>' +
                          this.escapeHtml(ending_3.summary) +
                          '</p><small>' +
                          this.escapeHtml(ending_3.storyTitle || '') +
                          ' · ' +
                          new Date(ending_3.unlockedAt).toLocaleDateString('zh-CN') +
                          '</small></article>',
                  )
                  .join('') +
              '</div>'
            : '<div class="netflix-empty-state">还没有解锁结局。每一个选择都会把故事推向不同方向。</div>';
        this.openSheet(this.infoSheet);
    }
    ['showWorldBooksInfo']() {
        const worldBooks_530 = this.getWorldBooks();
        this.infoTitle.textContent = '世界书';
        this.infoBody.innerHTML = worldBooks_530.length
            ? '<div class="netflix-book-list">' +
              worldBooks_530
                  .map(
                      (value_531) =>
                          '<article><i class="fas fa-book"></i><span><strong>' +
                          this.escapeHtml(value_531.name || '未命名世界书') +
                          '</strong><small>' +
                          (Array.isArray(value_531.entries) ? value_531.entries.length : 0) +
                          ' 条词条</small></span></article>',
                  )
                  .join('') +
              '</div><p class="netflix-info-note">世界书会在初始化游戏时选择，并随存档保存独立文本快照。</p>'
            : '<div class="netflix-empty-state">暂无世界书，请先在系统设置中创建。</div>';
        this.openSheet(this.infoSheet);
    }
    ['restartGame']() {
        if (this.isBusy || !this.state.activeRun) return;
        if (!window.confirm('重新开始会覆盖自动档，手动存档不会受影响。是否继续？')) return;
        const setup_4 = this.state.activeRun.setup;
        this.setupDraft = {
            sourceId: setup_4.sourceId,
            title: setup_4.title,
            category: setup_4.category,
            coverUrl: setup_4.coverUrl,
            homeBackgroundUrl: this.state.activeRun.homeBackgroundUrl || '',
            worldview: setup_4.worldview,
            premise: setup_4.premise,
            worldBookIds: (setup_4.worldBooks || []).map((book_8) => book_8.id),
            worldBooks: this.core.clone(setup_4.worldBooks || []),
            cast: this.core.clone(setup_4.cast),
            attributes: this.core.createDefaultAttributes(),
        };
        this.state.activeRun = null;
        this.state.saveSlots.auto = null;
        this.saveState({
            flush: true,
        });
        this.closeSheet(this.menuSheet);
        this.closeSheet(this.infoSheet);
        this.hubDraftOpen = true;
        this.hubOpen = true;
        this.gameView.classList.add('is-active');
        this.gameView.setAttribute('aria-hidden', 'false');
        this.setupView.classList.remove('is-active');
        this.setupView.setAttribute('aria-hidden', 'true');
        this.renderGameHub();
    }
    ['returnToNetflix']() {
        if (this.isBusy) return;
        if (this.state.activeRun) this.updateAutoSave(true);
        this.closeSheet(this.menuSheet);
        this.closeSheet(this.saveSheet);
        this.saveReturnToSettings = false;
        this.closeSheet(this.infoSheet);
        this.closeSheet(this.mapEditorSheet);
        this.hubOpen = false;
        this.hubDraftOpen = false;
        this.setupDraft = null;
        if (this.gameView.contains(document.activeElement))
            this.header.querySelector('.netflix-logo')?.focus({
                preventScroll: true,
            });
        this.gameView.classList.remove('is-active');
        this.gameView.setAttribute('aria-hidden', 'true');
        this.setupView.classList.remove('is-active');
        this.setupView.setAttribute('aria-hidden', 'true');
        this.renderHome();
        this.renderProfile();
    }
    ['upsertRecent'](setup_5) {
        const item_22 = this.normalizeCatalogItem(
                {
                    id: setup_5.sourceId,
                    title: setup_5.title,
                    category: setup_5.category,
                    summary: setup_5.premise,
                    coverUrl: setup_5.coverUrl,
                    cast: setup_5.cast.filter((actor_31) => actor_31.type !== 'user'),
                },
                setup_5.sourceId,
            ),
            catalog_536 = this.normalizeCatalog(this.state.homeCatalog);
        catalog_536.recent = [
            item_22,
            ...catalog_536.recent.filter((existing) => existing.id !== item_22.id),
        ].slice(0, 8);
        this.state.homeCatalog = catalog_536;
    }
    ['openSheet'](sheet) {
        if (!sheet) return;
        if (document.activeElement && !sheet.contains(document.activeElement))
            this.sheetFocusOrigins.set(sheet, document.activeElement);
        sheet.inert = false;
        sheet.classList.add('is-active');
        sheet.setAttribute('aria-hidden', 'false');
    }
    ['closeSheet'](sheet_2) {
        if (!sheet_2) return;
        if (sheet_2.contains(document.activeElement)) {
            const result_540 = this.sheetFocusOrigins.get(sheet_2),
                contains_541 = this.gameView.classList.contains('is-active'),
                value_542 = this.gameView.classList.contains('is-hub')
                    ? this.gameHub.querySelector('button')
                    : this.gameView.classList.contains('is-training')
                      ? this.trainingView.querySelector('button')
                      : this.gameView.querySelector('.netflix-game-header button'),
                value_543 = contains_541
                    ? value_542
                    : result_540?.isConnected
                      ? result_540
                      : this.header.querySelector('.netflix-logo');
            value_543?.focus({
                preventScroll: true,
            });
            if (sheet_2.contains(document.activeElement)) document.activeElement.blur();
        }
        sheet_2.inert = true;
        sheet_2.classList.remove('is-active');
        sheet_2.setAttribute('aria-hidden', 'true');
    }
    ['moveFocusToGameView']() {
        if (this.gameHub.contains(document.activeElement))
            this.gameView.focus({
                preventScroll: true,
            });
    }
    ['focusGameHubFromScene']() {
        const activeElement_544 = document.activeElement;
        this.gameView.contains(activeElement_544) &&
            activeElement_544 !== this.gameView &&
            !this.gameHub.contains(activeElement_544) &&
            this.gameHub.querySelector('button')?.focus({
                preventScroll: true,
            });
    }
    ['toast'](message_3) {
        if (typeof window.showToast === 'function') window.showToast(message_3);
        else console.warn('[Netflix]', message_3);
    }
    ['escapeHtml'](value_35 = '') {
        return String(value_35).replace(
            /[&<>"']/g,
            (character) =>
                ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                })[character],
        );
    }
    ['escapeAttr'](value_39 = '') {
        return this.escapeHtml(value_39).replace(/`/g, '&#96;');
    }
    ['open']() {
        if (!this.view) return;
        this.isOpen = true;
        this.view.style.display = 'flex';
        this.view.classList.add('active');
        this.switchTab('home');
    }
    ['close']() {
        if (this.isBusy) return this.toast('剧情生成中，请稍候');
        if (this.state.activeRun) this.updateAutoSave(true);
        this.isOpen = false;
        this.view.classList.remove('active');
        this.view.style.display = 'none';
    }
}
function initializeNetflixApp() {
    try {
        window.netflixApp = new NetflixApp();
        window.globalDataReadyPromise?.then
            ? (window.netflixDataReadyPromise = window.globalDataReadyPromise
                  .then(() => {
                      if (!window.netflixApp) return false;
                      return (
                          (window.netflixApp.state = window.netflixApp.loadState()),
                          window.netflixApp.renderHome(),
                          window.netflixApp.renderProfile(),
                          true
                      );
                  })
                  ['catch']((error_16) => {
                      return (
                          console.warn('[Netflix] durable state recovery failed:', error_16),
                          false
                      );
                  }))
            : (window.netflixDataReadyPromise = Promise.resolve(true));
    } catch (error_17) {
        document.documentElement.dataset.netflixInitError =
            error_17?.stack || error_17?.message || String(error_17);
        console.error('[Netflix] initialization failed:', error_17);
    }
}
(
    window.u2OnStorageReady ||
    ((callback_2) => document.addEventListener('DOMContentLoaded', callback_2))
)(initializeNetflixApp);
