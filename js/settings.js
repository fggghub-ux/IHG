(function () {
    let accounts_2 = [],
        currentAccountId_3 = null,
        userState_2 = {
            name: '',
            phone: '',
            persona: '',
            avatarUrl: null,
        };
    function clonePlainData(value_2) {
        if (typeof structuredClone === 'function') return structuredClone(value_2);
        return JSON.parse(JSON.stringify(value_2));
    }
    function handleAction_4() {
        const acc_2 = accounts_2.find(
            (value_23) => String(value_23.id) === String(currentAccountId_3),
        );
        return (
            acc_2
                ? ((userState_2.name = acc_2.name || ''),
                  (userState_2.phone = acc_2.phone || ''),
                  (userState_2.persona = acc_2.persona || ''),
                  (userState_2.signature = acc_2.signature || ''),
                  (userState_2.avatarUrl = acc_2.avatarUrl || null))
                : ((userState_2.name = ''),
                  (userState_2.phone = ''),
                  (userState_2.persona = ''),
                  (userState_2.signature = ''),
                  (userState_2.avatarUrl = null)),
            (window.userState = userState_2),
            userState_2
        );
    }
    function notifyUserStateUpdated(detail_3 = {}) {
        window.userState = userState_2;
        const detail_2 = {
            userState: clonePlainData(userState_2),
            ...detail_3,
        };
        window.dispatchEvent(
            new CustomEvent('user-state-updated', {
                detail: detail_2,
            }),
        );
        detail_3.avatarChanged &&
            window.dispatchEvent(
                new CustomEvent('avatar-updated', {
                    detail: detail_2,
                }),
            );
    }
    function handleAction_6() {
        window.getAccounts = () => accounts_2;
        window.getCurrentAccountId = () => currentAccountId_3;
        window.setCurrentAccountId = (value_26) => {
            return (
                (currentAccountId_3 = value_26),
                handleAction_4(),
                persistSettingsData({
                    immediate: true,
                }),
                notifyUserStateUpdated({
                    avatarChanged: true,
                }),
                currentAccountId_3
            );
        };
    }
    let value_7 = null;
    function persistSettingsData({ immediate = false } = {}) {
        handleAction_4();
        if (!window.appStorage?.commitDomain) return Promise.resolve(false);
        if (immediate)
            return (value_7 && (clearTimeout(value_7), (value_7 = null)), handleAction_8());
        return new Promise((value_27) => {
            if (value_7) clearTimeout(value_7);
            value_7 = setTimeout(() => {
                value_7 = null;
                handleAction_8().then(value_27);
            }, 300);
        });
    }
    function handleAction_8() {
        return window.appStorage
            .commitDomain(
                'settings',
                (draft_2) => {
                    const nextDraft = {
                        ...draft_2,
                        userState: clonePlainData(userState_2),
                        accounts: clonePlainData(accounts_2),
                        currentAccountId: currentAccountId_3,
                        apiConfig: clonePlainData(apiConfig_2),
                        vectorMemoryConfig: clonePlainData(vectorMemoryConfig_2),
                        visionConfig: clonePlainData(visionConfig_2),
                        imageGenerationConfig: clonePlainData(imageGenerationConfig_2),
                        ttsConfig: clonePlainData(ttsConfig_2),
                        apiPresets: clonePlainData(apiPresets_2),
                        fetchedModels: clonePlainData(fetchedModels_2),
                        assistiveBallSettings: clonePlainData(assistiveBallSettings_2),
                        themeState: clonePlainData(themeState_2),
                    };
                    return (delete nextDraft.minimaxConfig, nextDraft);
                },
                {
                    critical: true,
                    reason: 'settings-update',
                },
            )
            ['catch']((error_2) => {
                return (console.warn('Failed to persist settings:', error_2), false);
            });
    }
    handleAction_6();
    let apiConfig_2 = {
            provider: 'openai-compatible',
            endpoint: '',
            apiKey: '',
            model: '',
            temperature: 0.7,
            frequencyPenalty: 0,
        },
        vectorMemoryConfig_2 = window.getVectorMemoryConfig
            ? window.getVectorMemoryConfig()
            : window.vectorMemoryConfig || {},
        imageGenerationConfig_2 = window.u2ImageGeneration
            ? window.u2ImageGeneration.normalizeConfig(window.imageGenerationConfig)
            : window.imageGenerationConfig || {
                  activeProvider: 'gemini',
                  providers: {},
              },
        visionConfig_2 = window.u2ImageUnderstanding
            ? window.u2ImageUnderstanding.normalizeConfig(window.visionConfig)
            : window.getVisionConfig
              ? window.getVisionConfig()
              : window.visionConfig || {
                    activeProvider: 'gemini',
                    providers: {},
                },
        ttsConfig_2 = window.u2Tts
            ? window.u2Tts.getConfig()
            : window.getTtsConfig
              ? window.getTtsConfig()
              : window.ttsConfig || {
                    activeProvider: 'minimax',
                    providers: {},
                },
        apiPresets_2 = [],
        fetchedModels_2 = [];
    window.getApiPresets = function getApiPresets_2() {
        return clonePlainData(Array.isArray(apiPresets_2) ? apiPresets_2 : []);
    };
    function notifyApiPresetsUpdated() {
        window.dispatchEvent(
            new CustomEvent('u2:api-presets-updated', {
                detail: {
                    presets: window.getApiPresets(),
                },
            }),
        );
    }
    let assistiveBallSettings_2 = {
            enabled: false,
            x: null,
            y: null,
            size: 58,
            opacity: 0.72,
            imageUrl: '',
        },
        tempApiConfig = {};
    const DEFAULT_SYSTEM_THEME_FONT_FAMILY =
            'system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif',
        IMESSAGE_CSS_THEME_TYPES = ['home', 'bubble', 'chat', 'group', 'status'],
        BUILTIN_THEME_FONTS = [
            {
                key: 'system-default',
                label: '默认',
                cssName: '',
                family: DEFAULT_SYSTEM_THEME_FONT_FAMILY,
                sources: {
                    woff2: '',
                    woff: '',
                    ttf: '',
                    otf: '',
                },
            },
        ];
    let themeState_2 = {
        bgUrl: null,
        uiChineseEnabled: false,
        apps: [
            {
                id: 'app-icon-1',
                name: 'Pay',
                icon: null,
            },
            {
                id: 'app-icon-2',
                name: 'TikTok',
                icon: null,
            },
            {
                id: 'app-icon-3',
                name: 'b.stage',
                icon: null,
            },
            {
                id: 'app-icon-4',
                name: 'X',
                icon: null,
            },
            {
                id: 'app-icon-5',
                name: 'Shop',
                icon: null,
            },
            {
                id: 'app-icon-6',
                name: 'Library',
                icon: null,
            },
            {
                id: 'app-icon-7',
                name: 'Netflix',
                icon: null,
            },
            {
                id: 'app-icon-8',
                name: 'Loves',
                icon: null,
            },
            {
                id: 'app-icon-9',
                name: 'App Store',
                icon: null,
            },
            {
                id: 'app-icon-10',
                name: 'Gallery',
                icon: null,
            },
            {
                id: 'app-icon-11',
                name: 'MCP',
                icon: null,
            },
            {
                id: 'app-icon-12',
                name: 'AO3',
                icon: null,
            },
            {
                id: 'app-icon-13',
                name: 'Diary',
                icon: null,
            },
            {
                id: 'app-icon-14',
                name: 'call',
                icon: null,
            },
            {
                id: 'app-icon-15',
                name: 'Cphone',
                icon: null,
            },
            {
                id: 'dock-icon-settings',
                name: '设置',
                icon: null,
            },
            {
                id: 'dock-icon-imessage',
                name: '信息',
                icon: null,
            },
            {
                id: 'dock-icon-youtube',
                name: 'YouTube',
                icon: null,
            },
        ],
        fontMode: 'preset',
        fontPresetKey: 'system-default',
        fontFamily: DEFAULT_SYSTEM_THEME_FONT_FAMILY,
        fontCssName: '',
        fontSize: 16,
        fontSources: {
            woff2: '',
            woff: '',
            ttf: '',
            otf: '',
        },
        fontSourceType: 'preset',
        fontAssetId: '',
        fontFormat: '',
        savedFontPresets: [],
        imessageCssPresets: {
            home: [],
            bubble: [],
            chat: [],
            group: [],
            status: [],
        },
        imessageStatusTemplatePresets: [],
        imessageHomeCssEnabled: false,
        imessageHomeCss: '',
        imessageChatCssEnabled: false,
        imessageChatCss: '',
        imessageGroupCssEnabled: false,
        imessageGroupCss: '',
    };
    window.u2ThemeState = themeState_2;
    let enabled_20 = false;
    (
        window.u2OnStorageReady ||
        ((callback) => document.addEventListener('DOMContentLoaded', callback))
    )(async () => {
        let savedSettings = null;
        try {
            await window.appStorage?.ready;
            savedSettings =
                typeof window.appStorage?.readDomain === 'function'
                    ? window.appStorage.readDomain('settings', {})
                    : null;
        } catch (error_3) {
            console.warn('Failed to hydrate settings from IndexedDB:', error_3);
        }
        let enabled_33 = false,
            migratedTtsConfig = false;
        if (savedSettings && typeof savedSettings === 'object') {
            apiConfig_2 = {
                ...apiConfig_2,
                ...(savedSettings.apiConfig || {}),
            };
            apiConfig_2 = window.u2Api.sanitizeApiConfig(apiConfig_2);
            if (apiConfig_2.endpoint)
                try {
                    apiConfig_2.endpoint = window.u2Api.normalizeApiEndpoint(
                        apiConfig_2.endpoint,
                        apiConfig_2.provider,
                    );
                } catch (error_4) {
                    console.warn('Saved API endpoint is invalid:', error_4);
                }
            vectorMemoryConfig_2 = window.u2Api?.normalizeVectorMemoryConfig
                ? window.u2Api.normalizeVectorMemoryConfig(
                      savedSettings.vectorMemoryConfig || vectorMemoryConfig_2,
                  )
                : {
                      ...vectorMemoryConfig_2,
                      ...(savedSettings.vectorMemoryConfig || {}),
                  };
            imageGenerationConfig_2 = window.u2ImageGeneration
                ? window.u2ImageGeneration.normalizeConfig(
                      savedSettings.imageGenerationConfig || imageGenerationConfig_2,
                  )
                : savedSettings.imageGenerationConfig || imageGenerationConfig_2;
            visionConfig_2 = window.u2ImageUnderstanding
                ? window.u2ImageUnderstanding.normalizeConfig(
                      savedSettings.visionConfig || visionConfig_2,
                  )
                : savedSettings.visionConfig || visionConfig_2;
            migratedTtsConfig = !savedSettings.ttsConfig && !!savedSettings.minimaxConfig;
            ttsConfig_2 = window.u2Tts
                ? window.u2Tts.normalizeConfig(
                      savedSettings.ttsConfig || savedSettings.minimaxConfig || ttsConfig_2,
                  )
                : savedSettings.ttsConfig || savedSettings.minimaxConfig || ttsConfig_2;
            apiPresets_2 = Array.isArray(savedSettings.apiPresets) ? savedSettings.apiPresets : [];
            fetchedModels_2 = Array.isArray(savedSettings.fetchedModels)
                ? savedSettings.fetchedModels
                : [];
            assistiveBallSettings_2 = {
                ...assistiveBallSettings_2,
                ...(savedSettings.assistiveBallSettings || {}),
            };
            accounts_2 = Array.isArray(savedSettings.accounts) ? savedSettings.accounts : [];
            currentAccountId_3 = savedSettings.currentAccountId ?? null;
            const savedUserState = savedSettings.userState;
            savedUserState &&
                typeof savedUserState === 'object' &&
                (userState_2 = {
                    ...userState_2,
                    ...savedUserState,
                });
            currentAccountId_3 && handleAction_4();
            const savedThemeState = savedSettings.themeState;
            savedThemeState &&
                (Array.isArray(savedThemeState.apps) &&
                    (savedThemeState.apps.forEach((savedApp) => {
                        const existingApp = themeState_2.apps.find((a_2) => a_2.id === savedApp.id);
                        if (existingApp) {
                            existingApp.icon = savedApp.icon;
                            if (savedApp.id === 'app-icon-6') existingApp.name = 'Library';
                            else {
                                if (savedApp.id === 'app-icon-10') existingApp.name = 'Gallery';
                                else
                                    savedApp.id === 'app-icon-8' && savedApp.name === 'Diary'
                                        ? (existingApp.name = 'Loves')
                                        : (existingApp.name = savedApp.name || existingApp.name);
                            }
                        } else themeState_2.apps.push(savedApp);
                    }),
                    delete savedThemeState.apps),
                (themeState_2 = {
                    ...themeState_2,
                    ...savedThemeState,
                }));
            themeState_2.uiChineseEnabled = themeState_2.uiChineseEnabled === true;
            themeState_2.imessageHomeCssEnabled = themeState_2.imessageHomeCssEnabled === true;
            themeState_2.imessageHomeCss =
                typeof themeState_2.imessageHomeCss === 'string'
                    ? themeState_2.imessageHomeCss
                    : '';
            themeState_2.imessageCssPresets = normalizeImessageCssPresets(
                themeState_2.imessageCssPresets,
            );
            themeState_2.imessageStatusTemplatePresets = handleAction_56(
                themeState_2.imessageStatusTemplatePresets,
            );
            IMESSAGE_CSS_THEME_TYPES.forEach((type_2) => {
                if (themeState_2.imessageCssPresets[type_2].length > 0) return;
                const legacyPresets = window.appStorage?.loadLegacyKey
                        ? window.appStorage.loadLegacyKey('u2_theme_' + type_2 + 'Presets', [])
                        : [],
                    normalizedLegacyPresets = normalizeImessageCssPresets({
                        [type_2]: legacyPresets,
                    })[type_2];
                normalizedLegacyPresets.length > 0 &&
                    ((themeState_2.imessageCssPresets[type_2] = normalizedLegacyPresets),
                    (enabled_33 = true));
            });
            window.u2ThemeState = themeState_2;
            handleAction_40();
        }
        themeState_2.uiChineseEnabled = themeState_2.uiChineseEnabled === true;
        window.u2ThemeState = themeState_2;
        window.u2UiTranslation?.setEnabled(themeState_2.uiChineseEnabled);
        (enabled_33 || migratedTtsConfig) && (await persistSettingsData());
        window.apiConfig = apiConfig_2;
        window.vectorMemoryConfig = vectorMemoryConfig_2;
        window.visionConfig = visionConfig_2;
        window.imageGenerationConfig = imageGenerationConfig_2;
        window.u2Tts && typeof window.u2Tts.setConfig === 'function'
            ? (ttsConfig_2 = window.u2Tts.setConfig(ttsConfig_2))
            : (window.ttsConfig = ttsConfig_2);
        window.userState = userState_2;
        handleAction_6();
        notifyUserStateUpdated({
            avatarChanged: true,
            source: 'settings-hydration',
        });
        UI.views.settings = document.getElementById('settings-view');
        UI.views.edit = document.getElementById('edit-view');
        UI.overlays.accountSwitcher = document.getElementById('account-sheet-overlay');
        UI.overlays.personaDetail = document.getElementById('persona-detail-sheet');
        UI.overlays.aboutDevice = document.getElementById('about-device-sheet');
        UI.lists.accounts = document.getElementById('account-list');
        UI.inputs = {
            detailName: document.getElementById('detail-name-input'),
            detailPhone: document.getElementById('detail-phone-input'),
            detailSignature: document.getElementById('detail-signature-input'),
            detailPersona: document.getElementById('detail-persona-input'),
            detailAvatarImg: document.getElementById('detail-avatar-img'),
            detailAvatarIcon: document.querySelector('#user-detail-avatar-wrapper .fa-user'),
            apiProvider: document.getElementById('api-provider-select'),
            apiProviderHint: document.getElementById('api-provider-hint'),
            apiEndpoint: document.getElementById('api-endpoint-input'),
            apiKey: document.getElementById('api-key-input'),
            apiModel: document.getElementById('api-model-select'),
            apiModelPickerToggle: document.getElementById('api-model-picker-toggle'),
            apiModelPicker: document.getElementById('api-model-picker'),
            apiModelSearch: document.getElementById('api-model-search-input'),
            apiModelList: document.getElementById('api-model-list'),
            apiTemp: document.getElementById('api-temp-input'),
            apiFrequencyPenalty: document.getElementById('api-frequency-penalty-input'),
            vectorMemoryEnabled: document.getElementById('vector-memory-enabled-toggle'),
            vectorMemoryProvider: document.getElementById('vector-memory-provider-select'),
            vectorMemoryEndpoint: document.getElementById('vector-memory-endpoint-input'),
            vectorMemoryApiKey: document.getElementById('vector-memory-api-key-input'),
            vectorMemoryModel: document.getElementById('vector-memory-model-select'),
            vectorMemoryCustomModel: document.getElementById('vector-memory-custom-model-input'),
            vectorMemoryCustomModelRow: document.getElementById('vector-memory-custom-model-row'),
            vectorMemoryCustomEndpointRow: document.getElementById(
                'vector-memory-custom-endpoint-row',
            ),
            vectorMemoryIndexStatus: document.getElementById('vector-memory-index-status'),
            visionProvider: document.getElementById('vision-provider-select'),
            visionEndpoint: document.getElementById('vision-endpoint-input'),
            visionApiKey: document.getElementById('vision-key-input'),
            visionModel: document.getElementById('vision-model-input'),
            visionModelSelect: document.getElementById('vision-model-select'),
            visionKeyLabel: document.getElementById('vision-key-label'),
            visionEndpointHint: document.getElementById('vision-endpoint-hint'),
            imageProvider: document.getElementById('image-generation-provider-select'),
            imageEndpoint: document.getElementById('image-generation-endpoint-input'),
            imageApiKey: document.getElementById('image-generation-key-input'),
            imageModel: document.getElementById('image-generation-model-input'),
            imageModelSelect: document.getElementById('image-generation-model-select'),
            imageSize: document.getElementById('image-generation-size-select'),
            imageKeyLabel: document.getElementById('image-generation-key-label'),
            imageEndpointHint: document.getElementById('image-generation-endpoint-hint'),
            bgActivityToggle: document.getElementById('bg-activity-toggle'),
            systemNotificationToggle: document.getElementById('system-notification-toggle'),
            notificationSettingsGroup: document.getElementById('notification-settings-group'),
            notificationSoundSettings: document.getElementById('notification-sound-settings'),
            notificationSoundFileName: document.getElementById('notification-sound-file-name'),
            notificationSoundUploadBtn: document.getElementById('notification-sound-upload-btn'),
            notificationSoundUploadLabel: document.getElementById(
                'notification-sound-upload-label',
            ),
            notificationSoundFileInput: document.getElementById('notification-sound-file-input'),
            notificationSoundActions: document.getElementById('notification-sound-actions'),
            notificationSoundPreviewBtn: document.getElementById('notification-sound-preview-btn'),
            notificationSoundRemoveBtn: document.getElementById('notification-sound-remove-btn'),
            ttsProvider: document.getElementById('tts-provider-select'),
            ttsEndpoint: document.getElementById('tts-endpoint-input'),
            ttsApiKey: document.getElementById('tts-key-input'),
            ttsModel: document.getElementById('tts-model-input'),
            ttsModelSelect: document.getElementById('tts-model-select'),
            ttsKeyLabel: document.getElementById('tts-key-label'),
            ttsModelLabel: document.getElementById('tts-model-label'),
            ttsModelSelectLabel: document.getElementById('tts-model-select-label'),
            ttsExtraFields: document.getElementById('tts-provider-extra-fields'),
            ttsEndpointHint: document.getElementById('tts-endpoint-hint'),
            presetName: document.getElementById('preset-name-input'),
        };
        UI.lists.presets = document.getElementById('preset-list');
        UI.overlays.apiConfig = document.getElementById('api-config-sheet');
        UI.overlays.vectorMemoryConfig = document.getElementById('vector-memory-config-sheet');
        UI.overlays.visionConfig = document.getElementById('vision-config-sheet');
        UI.overlays.imageGenerationConfig = document.getElementById(
            'image-generation-config-sheet',
        );
        UI.overlays.ttsConfig = document.getElementById('tts-config-sheet');
        UI.overlays.savePreset = document.getElementById('save-preset-name-sheet');
        UI.overlays.loadPreset = document.getElementById('load-preset-list-sheet');
        UI.overlays.assistiveBallSettings = document.getElementById(
            'assistive-ball-settings-sheet',
        );
        UI.inputs.assistiveBallToggle = document.getElementById('assistive-ball-toggle');
        UI.inputs.assistiveBallOpacity = document.getElementById('assistive-ball-opacity-range');
        UI.inputs.assistiveBallOpacityValue = document.getElementById(
            'assistive-ball-opacity-value',
        );
        UI.inputs.assistiveBallSize = document.getElementById('assistive-ball-size-range');
        UI.inputs.assistiveBallSizeValue = document.getElementById('assistive-ball-size-value');
        UI.inputs.assistiveBallImageUrl = document.getElementById('assistive-ball-image-url-input');
        UI.inputs.assistiveBallImageUrlApply = document.getElementById(
            'assistive-ball-image-url-apply-btn',
        );
        UI.inputs.assistiveBallImageUpload = document.getElementById(
            'assistive-ball-image-upload-btn',
        );
        UI.inputs.assistiveBallImageFile = document.getElementById(
            'assistive-ball-image-file-input',
        );
        UI.inputs.assistiveBallImageReset = document.getElementById(
            'assistive-ball-image-reset-btn',
        );
        function openApiConfigSheet() {
            openView(UI.overlays.apiConfig);
        }
        function closeApiConfigSheet() {
            setApiModelPickerOpen(false);
            closeView(UI.overlays.apiConfig);
        }
        function closeVectorMemoryConfigSheet() {
            closeView(UI.overlays.vectorMemoryConfig);
        }
        UI.overlays.apiConfig &&
            UI.overlays.apiConfig.addEventListener('click', (event) => {
                event.target === UI.overlays.apiConfig &&
                    (event.stopPropagation(), closeApiConfigSheet());
            });
        UI.overlays.vectorMemoryConfig &&
            UI.overlays.vectorMemoryConfig.addEventListener('click', (event_208) => {
                event_208.target === UI.overlays.vectorMemoryConfig &&
                    (event_208.stopPropagation(), closeVectorMemoryConfigSheet());
            });
        UI.overlays.visionConfig &&
            UI.overlays.visionConfig.addEventListener('click', (event_209) => {
                event_209.target === UI.overlays.visionConfig &&
                    (event_209.stopPropagation(), closeView(UI.overlays.visionConfig));
            });
        UI.overlays.imageGenerationConfig &&
            UI.overlays.imageGenerationConfig.addEventListener('click', (event_210) => {
                event_210.target === UI.overlays.imageGenerationConfig &&
                    (event_210.stopPropagation(), closeView(UI.overlays.imageGenerationConfig));
            });
        const settingsBtn = document.getElementById('dock-icon-settings');
        settingsBtn &&
            settingsBtn.addEventListener('click', (e) => {
                syncUIs();
                openView(UI.views.settings);
            });
        const settingsBackBtn = document.getElementById('settings-title-back-btn');
        settingsBackBtn &&
            settingsBackBtn.addEventListener('click', () => closeView(UI.views.settings));
        const aboutDeviceBtn = document.getElementById('about-device-btn'),
            aboutDeviceSheet = document.getElementById('about-device-sheet'),
            aboutDeviceCloseBtn = document.getElementById('about-device-close-btn'),
            aboutDisclaimerBtn = document.getElementById('about-device-disclaimer-btn'),
            aboutChangelogBtn = document.getElementById('about-device-changelog-btn');
        aboutDeviceBtn &&
            aboutDeviceSheet &&
            aboutDeviceBtn.addEventListener('click', () => {
                const appNameEl = document.getElementById('about-device-app-name');
                if (appNameEl) appNameEl.textContent = 'u2phone';
                openView(aboutDeviceSheet);
            });
        aboutDeviceCloseBtn &&
            aboutDeviceSheet &&
            aboutDeviceCloseBtn.addEventListener('click', () => closeView(aboutDeviceSheet));
        aboutDisclaimerBtn?.addEventListener('click', () =>
            window.u2AboutInfoModal?.open('disclaimer'),
        );
        aboutChangelogBtn?.addEventListener('click', () =>
            window.u2AboutInfoModal?.open('changelog'),
        );
        const dataManagementBtn = document.getElementById('data-management-btn'),
            dataManagementSheet = document.getElementById('data-management-sheet'),
            dataManagementCloseBtn = document.getElementById('data-management-close-btn'),
            authSignOutBtn = document.getElementById('u2-auth-sign-out-btn');
        dataManagementBtn &&
            dataManagementSheet &&
            dataManagementBtn.addEventListener('click', () => {
                openView(dataManagementSheet);
            });
        dataManagementCloseBtn &&
            dataManagementSheet &&
            dataManagementCloseBtn.addEventListener('click', () => closeView(dataManagementSheet));
        authSignOutBtn?.addEventListener('click', async () => {
            authSignOutBtn.disabled = true;
            try {
                if (dataManagementSheet) closeView(dataManagementSheet);
                await window.u2Auth?.logout();
            } catch (error_5) {
                console.error('[auth] Failed to sign out:', error_5);
            } finally {
                authSignOutBtn.disabled = false;
            }
        });
        const appleIdTrigger = document.getElementById('apple-id-trigger');
        appleIdTrigger &&
            appleIdTrigger.addEventListener('click', (e_2) => {
                e_2.stopPropagation();
                syncUIs();
                openView(UI.views.edit);
            });
        const editBackBtn = document.getElementById('edit-back-btn');
        editBackBtn && editBackBtn.addEventListener('click', () => closeView(UI.views.edit));
        function readImageAsCompressedDataUrl_2(file_2, options_2 = {}) {
            return new Promise((resolve_2, reject) => {
                if (!file_2) {
                    reject(new Error('No file selected'));
                    return;
                }
                const {
                        maxWidth = 1024,
                        maxHeight = 1024,
                        quality = 0.82,
                        outputType = 'image/jpeg',
                    } = options_2,
                    reader_2 = new FileReader();
                reader_2.onload = (event_2) => {
                    const rawDataUrl = event_2?.target?.result;
                    if (!rawDataUrl || typeof rawDataUrl !== 'string') {
                        reject(new Error('Failed to read file'));
                        return;
                    }
                    const image_2 = new Image();
                    image_2.onload = () => {
                        let { width: width_2, height: height_2 } = image_2;
                        if (!width_2 || !height_2) {
                            resolve_2(rawDataUrl);
                            return;
                        }
                        const widthRatio = maxWidth / width_2,
                            heightRatio = maxHeight / height_2,
                            scale = Math.min(1, widthRatio, heightRatio),
                            width_3 = Math.max(1, Math.round(width_2 * scale)),
                            height_3 = Math.max(1, Math.round(height_2 * scale)),
                            canvas = document.createElement('canvas');
                        canvas.width = width_3;
                        canvas.height = height_3;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            resolve_2(rawDataUrl);
                            return;
                        }
                        ctx.drawImage(image_2, 0, 0, width_3, height_3);
                        try {
                            const compressedDataUrl = canvas.toDataURL(outputType, quality);
                            resolve_2(compressedDataUrl || rawDataUrl);
                        } catch (err_2) {
                            console.warn(
                                'Failed to compress image, using original data url.',
                                err_2,
                            );
                            resolve_2(rawDataUrl);
                        }
                    };
                    image_2.onerror = () =>
                        reject(new Error('Failed to load image for compression'));
                    image_2.src = rawDataUrl;
                };
                reader_2.onerror = () => reject(new Error('Failed to read file'));
                reader_2.readAsDataURL(file_2);
            });
        }
        window.readImageAsCompressedDataUrl = readImageAsCompressedDataUrl_2;
        const mainEditAvatarWrapper = document.getElementById('main-edit-avatar-wrapper'),
            mainAvatarUpload = document.getElementById('main-avatar-upload');
        mainEditAvatarWrapper &&
            mainAvatarUpload &&
            (mainEditAvatarWrapper.addEventListener('click', (e_3) => {
                if (e_3.target.tagName !== 'INPUT') mainAvatarUpload.click();
            }),
            mainAvatarUpload.addEventListener('change', async (event_230) => {
                const value_231 = event_230.target.files[0];
                if (value_231)
                    try {
                        const avatarUrl_2 = await readImageAsCompressedDataUrl_2(value_231, {
                            maxWidth: 256,
                            maxHeight: 256,
                            quality: 0.72,
                        });
                        userState_2.avatarUrl = avatarUrl_2;
                        const acc_3 = accounts_2.find(
                            (value_234) => value_234.id === currentAccountId_3,
                        );
                        acc_3 && (acc_3.avatarUrl = avatarUrl_2);
                        saveGlobalData();
                        syncUIs();
                        notifyUserStateUpdated({
                            avatarChanged: true,
                        });
                        showToast('头像已更新');
                    } catch (err_3) {
                        console.error('Failed to process avatar upload', err_3);
                        showToast('头像处理失败');
                    }
                event_230.target.value = '';
            }));
        let isCreatingNewAccount = false,
            detailTempId = null;
        const switchAccountBtn = document.getElementById('switch-account-btn');
        switchAccountBtn &&
            switchAccountBtn.addEventListener('click', () => {
                renderAccountList();
                openView(UI.overlays.accountSwitcher);
            });
        function renderAccountList() {
            if (!UI.lists.accounts) return;
            UI.lists.accounts.innerHTML = '';
            accounts_2.forEach((acc) => {
                const card = document.createElement('div');
                card.className =
                    'account-card ' + (acc.id === currentAccountId_3 ? 'selected' : '');
                acc.id === currentAccountId_3 && (card.style.backgroundColor = '#e8f2ff');
                const value_237 = acc.avatarUrl
                    ? '<img src="' + acc.avatarUrl + '" alt="">'
                    : '<i class="fas fa-user"></i>';
                card.innerHTML =
                    `
                    <div class="account-content">
                        <div class="account-avatar">` +
                    value_237 +
                    `</div>
                        <div class="account-info">
                            <div class="account-name">` +
                    acc.name +
                    `</div>
                            <div class="account-detail">` +
                    (acc.phone || 'No Phone') +
                    `</div>
                        </div>
                        <i class="fas fa-times delete-icon"></i>
                    </div>
                `;
                card.querySelector('.account-content').addEventListener('click', (e_4) => {
                    if (
                        e_4.target.classList.contains('delete-icon') ||
                        e_4.target.closest('.delete-icon')
                    )
                        return;
                    currentAccountId_3 = acc.id;
                    if (window.setCurrentAccountId) window.setCurrentAccountId(acc.id);
                    renderAccountList();
                    isCreatingNewAccount = false;
                    detailTempId = acc.id;
                    UI.inputs.detailName.value = acc.name || '';
                    UI.inputs.detailPhone.value = acc.phone || '';
                    if (UI.inputs.detailSignature)
                        UI.inputs.detailSignature.value = acc.signature || '';
                    UI.inputs.detailPersona.value = acc.persona || '';
                    setDetailAvatar(acc.avatarUrl);
                    openView(UI.overlays.personaDetail);
                });
                card.querySelector('.delete-icon').addEventListener('click', (event_239) => {
                    event_239.stopPropagation();
                    if (confirm('Delete account "' + acc.name + '"?')) {
                        accounts_2 = accounts_2.filter((value_240) => value_240.id !== acc.id);
                        if (currentAccountId_3 === acc.id) {
                            currentAccountId_3 = accounts_2.length > 0 ? accounts_2[0].id : null;
                            if (window.setCurrentAccountId)
                                window.setCurrentAccountId(currentAccountId_3);
                            const nextAccount = accounts_2.find(
                                (a_3) => a_3.id === currentAccountId_3,
                            );
                            userState_2.name = nextAccount?.name || '';
                            userState_2.phone = nextAccount?.phone || '';
                            userState_2.persona =
                                nextAccount?.signature || nextAccount?.persona || '';
                            userState_2.avatarUrl = nextAccount?.avatarUrl || null;
                        }
                        saveGlobalData();
                        syncUIs();
                        notifyUserStateUpdated({
                            avatarChanged: true,
                        });
                        renderAccountList();
                    }
                });
                UI.lists.accounts.appendChild(card);
            });
        }
        window.updateAccountById = function (value_243, value_244 = {}) {
            const acc_4 = accounts_2.find(
                (value_248) => String(value_248.id) === String(value_243),
            );
            if (!acc_4) return false;
            const previousAvatarUrl = acc_4.avatarUrl || null;
            if (typeof value_244 === 'function') value_244(acc_4);
            else value_244 && typeof value_244 === 'object' && Object.assign(acc_4, value_244);
            const avatarChanged_2 = previousAvatarUrl !== (acc_4.avatarUrl || null);
            String(currentAccountId_3) === String(acc_4.id) && handleAction_4();
            saveGlobalData();
            if (window.syncUIs) window.syncUIs();
            return (
                window.dispatchEvent(
                    new CustomEvent('account-updated', {
                        detail: {
                            account: clonePlainData(acc_4),
                            accountId: acc_4.id,
                            avatarChanged: avatarChanged_2,
                        },
                    }),
                ),
                notifyUserStateUpdated({
                    avatarChanged: avatarChanged_2,
                }),
                renderAccountList(),
                true
            );
        };
        document.getElementById('add-account-btn')?.addEventListener('click', () => {
            isCreatingNewAccount = true;
            detailTempId = Date.now();
            UI.inputs.detailName.value = '';
            UI.inputs.detailPhone.value = '';
            if (UI.inputs.detailSignature) UI.inputs.detailSignature.value = '';
            UI.inputs.detailPersona.value = '';
            setDetailAvatar(null);
            openView(UI.overlays.personaDetail);
        });
        document.getElementById('save-id-btn')?.addEventListener('click', () => {
            const accToSync = accounts_2.find((value_250) => value_250.id === currentAccountId_3);
            accToSync
                ? ((userState_2.name = accToSync.name),
                  (userState_2.phone = accToSync.phone),
                  (userState_2.persona = accToSync.persona),
                  (userState_2.signature = accToSync.signature),
                  (userState_2.avatarUrl = accToSync.avatarUrl))
                : ((userState_2.name = ''),
                  (userState_2.phone = ''),
                  (userState_2.persona = ''),
                  (userState_2.signature = ''),
                  (userState_2.avatarUrl = null));
            saveGlobalData();
            syncUIs();
            notifyUserStateUpdated({
                avatarChanged: true,
            });
            closeView(UI.overlays.accountSwitcher);
        });
        document.getElementById('confirm-sync-btn')?.addEventListener('click', () => {
            const name_2 = UI.inputs.detailName.value || 'New User',
                phone_2 = UI.inputs.detailPhone.value,
                signature_2 = UI.inputs.detailSignature ? UI.inputs.detailSignature.value : '',
                persona_2 = UI.inputs.detailPersona.value,
                avatarUrl_3 =
                    UI.inputs.detailAvatarImg.style.display === 'block'
                        ? UI.inputs.detailAvatarImg.src
                        : null;
            if (isCreatingNewAccount) {
                accounts_2.push({
                    id: detailTempId,
                    name: name_2,
                    phone: phone_2,
                    signature: signature_2,
                    persona: persona_2,
                    avatarUrl: avatarUrl_3,
                });
                currentAccountId_3 = detailTempId;
            } else {
                const acc_5 = accounts_2.find((value_257) => value_257.id === detailTempId);
                acc_5 &&
                    ((acc_5.name = name_2),
                    (acc_5.phone = phone_2),
                    (acc_5.signature = signature_2),
                    (acc_5.persona = persona_2),
                    (acc_5.avatarUrl = avatarUrl_3));
            }
            isCreatingNewAccount = false;
            String(currentAccountId_3) === String(detailTempId) && handleAction_4();
            saveGlobalData();
            syncUIs();
            notifyUserStateUpdated({
                avatarChanged: true,
            });
            renderAccountList();
            closeView(UI.overlays.personaDetail);
            showToast('资料已保存');
        });
        const userDetailAvatarWrapper = document.getElementById('user-detail-avatar-wrapper');
        userDetailAvatarWrapper &&
            userDetailAvatarWrapper.addEventListener('click', (e_5) => {
                if (e_5.target.tagName !== 'INPUT')
                    document.getElementById('detail-avatar-upload').click();
            });
        document
            .getElementById('detail-avatar-upload')
            ?.addEventListener('change', async (event_259) => {
                const value_260 = event_259.target.files[0];
                if (value_260)
                    try {
                        const value_261 = await readImageAsCompressedDataUrl_2(value_260, {
                            maxWidth: 256,
                            maxHeight: 256,
                            quality: 0.72,
                        });
                        setDetailAvatar(value_261);
                    } catch (err_4) {
                        console.error('Failed to process detail avatar upload', err_4);
                        showToast('头像处理失败');
                    }
            });
        function setDetailAvatar(url_2) {
            if (url_2) {
                UI.inputs.detailAvatarImg.src = url_2;
                UI.inputs.detailAvatarImg.style.display = 'block';
                if (UI.inputs.detailAvatarIcon) UI.inputs.detailAvatarIcon.style.display = 'none';
            } else {
                UI.inputs.detailAvatarImg.style.display = 'none';
                if (UI.inputs.detailAvatarIcon) UI.inputs.detailAvatarIcon.style.display = 'block';
                UI.inputs.detailAvatarImg.src = '';
            }
        }
        const syncUIs_38 = window.syncUIs;
        window.syncUIs = function () {
            syncUIs_38 && syncUIs_38();
            const settingsName = document.getElementById('settings-name'),
                settingsAvatarImg = document.getElementById('settings-avatar-img'),
                settingsAvatarIcon = document.querySelector('.apple-id-avatar-small .fa-user');
            settingsName && (settingsName.textContent = userState_2.name || '未登录 Apple ID');
            if (userState_2.avatarUrl) {
                settingsAvatarImg &&
                    ((settingsAvatarImg.src = userState_2.avatarUrl),
                    (settingsAvatarImg.style.display = 'block'));
                if (settingsAvatarIcon) settingsAvatarIcon.style.display = 'none';
            } else {
                if (settingsAvatarImg) settingsAvatarImg.style.display = 'none';
                if (settingsAvatarIcon) settingsAvatarIcon.style.display = 'block';
            }
            const displayName = document.getElementById('display-name'),
                displayPhone = document.getElementById('display-phone'),
                displaySignature = document.getElementById('display-signature'),
                editAvatarImg = document.getElementById('edit-avatar-img'),
                editAvatarIcon = document.querySelector('#edit-avatar-preview .fa-user');
            if (displayName) displayName.textContent = userState_2.name || '未登录 Apple ID';
            if (displayPhone) displayPhone.textContent = userState_2.phone || '暂无手机号';
            if (displaySignature)
                displaySignature.textContent =
                    userState_2.signature || '添加账号后可同步头像、名称与签名';
            if (userState_2.avatarUrl) {
                editAvatarImg &&
                    ((editAvatarImg.src = userState_2.avatarUrl),
                    (editAvatarImg.style.display = 'block'));
                if (editAvatarIcon) editAvatarIcon.style.display = 'none';
            } else {
                if (editAvatarImg) editAvatarImg.style.display = 'none';
                if (editAvatarIcon) editAvatarIcon.style.display = 'block';
            }
            const imProfileName = document.getElementById('imessage-profile-name'),
                imProfileSign = document.getElementById('imessage-profile-sign'),
                imAvatarImg = document.getElementById('imessage-avatar-img'),
                imAvatarIcon = document.getElementById('imessage-avatar-icon');
            if (imProfileName) imProfileName.textContent = userState_2.name || 'Default User';
            if (imProfileSign) imProfileSign.textContent = userState_2.signature || 'No Signature';
            if (userState_2.avatarUrl) {
                imAvatarImg &&
                    ((imAvatarImg.src = userState_2.avatarUrl),
                    (imAvatarImg.style.display = 'block'));
                if (imAvatarIcon) imAvatarIcon.style.display = 'none';
            } else {
                if (imAvatarImg) imAvatarImg.style.display = 'none';
                if (imAvatarIcon) imAvatarIcon.style.display = 'block';
            }
        };
        window.syncUIs && window.syncUIs();
        document.getElementById('close-account-sheet-btn')?.addEventListener('click', () => {
            closeView(UI.overlays.accountSwitcher);
        });
        document.getElementById('close-persona-sheet-btn')?.addEventListener('click', () => {
            closeView(UI.overlays.personaDetail);
        });
        const worldBookMainBtn = document.getElementById('world-book-main-btn');
        worldBookMainBtn &&
            worldBookMainBtn.addEventListener('click', (event_264) => {
                event_264.stopPropagation();
                window.renderWorldBooks && window.renderWorldBooks();
                const wbView = document.getElementById('world-book-view');
                wbView && openView(wbView);
            });
        const themeConfigBtn = document.getElementById('theme-config-btn'),
            imessageThemesBtn = document.getElementById('imessage-themes-btn'),
            themeConfigSheet = document.getElementById('theme-config-sheet'),
            themeConfigBackBtn = document.getElementById('theme-config-back-btn'),
            desktopThemeConfigSheet = document.getElementById('desktop-theme-config-sheet'),
            globalUiTranslationToggle = document.getElementById('global-ui-translation-toggle');
        function syncGlobalUiTranslationToggle() {
            if (globalUiTranslationToggle)
                globalUiTranslationToggle.checked = themeState_2.uiChineseEnabled === true;
        }
        async function handleAction_39(nextEnabled, { persist = true } = {}) {
            return (
                (themeState_2.uiChineseEnabled = nextEnabled === true),
                (window.u2ThemeState = themeState_2),
                window.u2UiTranslation?.setEnabled(themeState_2.uiChineseEnabled),
                applyThemeAppIcons(themeState_2),
                renderThemeAppList(),
                syncGlobalUiTranslationToggle(),
                persist ? saveGlobalData() : true
            );
        }
        syncGlobalUiTranslationToggle();
        globalUiTranslationToggle &&
            globalUiTranslationToggle.addEventListener('change', async () => {
                const enabled_2 = globalUiTranslationToggle.checked,
                    persisted_2 = await handleAction_39(enabled_2);
                showToast(
                    persisted_2
                        ? enabled_2
                            ? '全局 UI 已切换为中文'
                            : '全局 UI 已恢复英文'
                        : '全局翻译保存失败，当前效果未持久化',
                );
            });
        async function handleAction_40() {
            window.u2ThemeState = themeState_2;
            applyThemeBackground(themeState_2);
            applyThemeAppIcons(themeState_2);
            window.imApp &&
                window.imApp.applyGlobalChatCss &&
                window.imApp.applyGlobalChatCss(themeState_2);
            window.imApp?.applyGlobalHomeCss?.(themeState_2);
            window.imApp &&
                window.imApp.applyGlobalGroupCss &&
                window.imApp.applyGlobalGroupCss(themeState_2);
            if (enabled_20) await handleAction_156(themeState_2);
        }
        function openDesktopThemeConfig() {
            ensureThemeFontStateShape();
            const themeBgUrlInput = document.getElementById('theme-bg-url-input');
            if (themeBgUrlInput) themeBgUrlInput.value = themeState_2.bgUrl || '';
            syncThemeFontInputsFromState();
            renderThemeFontPresetLists();
            renderThemeFontPreview();
            renderThemeAppList();
            openView(desktopThemeConfigSheet);
        }
        const value_34 = `/* 线下界面真实可编辑源码
   :scope 会自动限定到线下主界面和弹幕详情页。 */

:scope {
  --offline-chat-narrative-color: #111111;
  --offline-chat-dialogue-color: #8B8B8B;
  background: #ffffff;
  color: #111111;
}

.offline-chat-header,
.offline-chat-input-area {
  background: rgba(255, 255, 255, 0.96);
  border-color: rgba(0, 0, 0, 0.08);
}

.offline-chat-bubble-text,
.offline-chat-paragraph {
  color: var(--offline-chat-narrative-color);
}

.offline-chat-dialogue,
.offline-chat-speech {
  color: var(--offline-chat-dialogue-color);
}

.offline-chat-bubble.user { background: #fafafa; }
.offline-chat-bubble.ai { background: #ffffff; }
.offline-chat-choice-btn {
  background: #ffffff;
  color: #111111;
  border: 1px solid #d8d8dc;
}`,
            options_42 = {
                narrativeColor: document.getElementById('theme-offline-narrative-color'),
                narrativeValue: document.getElementById('theme-offline-narrative-value'),
                narrativeSwatch: document.getElementById('theme-offline-narrative-swatch'),
                dialogueColor: document.getElementById('theme-offline-dialogue-color'),
                dialogueValue: document.getElementById('theme-offline-dialogue-value'),
                dialogueSwatch: document.getElementById('theme-offline-dialogue-swatch'),
                css: document.getElementById('theme-offline-css-input'),
                clear: document.getElementById('theme-offline-clear-btn'),
                copy: document.getElementById('theme-offline-copy-btn'),
                apply: document.getElementById('theme-offline-apply-btn'),
                export: document.getElementById('theme-offline-export-btn'),
                import: document.getElementById('theme-offline-import-btn'),
                importInput: document.getElementById('theme-offline-import-input'),
                presetSelect: document.getElementById('theme-offline-preset-select'),
                presetDelete: document.getElementById('theme-offline-preset-delete-btn'),
                presetName: document.getElementById('theme-offline-preset-name'),
                presetSave: document.getElementById('theme-offline-preset-save-btn'),
                reset: document.getElementById('theme-offline-reset-btn'),
            };
        let value_43 = window.imApp.getOfflineThemeState?.().theme ||
                window.imApp.createDefaultOfflineThemeState?.() || {
                    narrativeColor: '#111111',
                    dialogueColor: '#8B8B8B',
                    customCss: '',
                    customCssEnabled: false,
                    activePresetId: '',
                },
            items_44 = window.imApp.getOfflineThemeState?.().presets || [],
            value_45 = null,
            enabled_46 = false;
        function handleAction_47() {
            const presetSelect_268 = options_42.presetSelect;
            if (!presetSelect_268) return;
            presetSelect_268.replaceChildren(new Option('自定义主题', ''));
            items_44.forEach((value_269) =>
                presetSelect_268.add(new Option(value_269.name, value_269.id)),
            );
            presetSelect_268.value = items_44.some(
                (value_270) => value_270.id === value_43.activePresetId,
            )
                ? value_43.activePresetId
                : '';
            if (options_42.presetDelete) options_42.presetDelete.disabled = !presetSelect_268.value;
        }
        function handleAction_48({ includeCss = true } = {}) {
            const items_271 = [
                ['narrativeColor', 'narrativeValue', 'narrativeSwatch'],
                ['dialogueColor', 'dialogueValue', 'dialogueSwatch'],
            ];
            items_271.forEach(([value_272, value_273, value_274]) => {
                if (options_42[value_272]) options_42[value_272].value = value_43[value_272];
                if (options_42[value_273]) options_42[value_273].value = value_43[value_272];
                if (options_42[value_274])
                    options_42[value_274].style.backgroundColor = value_43[value_272];
            });
            if (includeCss && options_42.css) options_42.css.value = value_43.customCss || '';
            handleAction_47();
        }
        function handleImessageDataReady() {
            const offlineThemeState = window.imApp.getOfflineThemeState?.();
            offlineThemeState &&
                ((value_43 = offlineThemeState.theme), (items_44 = offlineThemeState.presets));
            enabled_46 = false;
            handleAction_48();
        }
        async function handleAction_50(value_275, { toast = '' } = {}) {
            enabled_46 = false;
            value_43 = window.imApp.normalizeOfflineThemeState
                ? window.imApp.normalizeOfflineThemeState(value_275)
                : {
                      ...value_43,
                      ...value_275,
                  };
            value_43 = await window.imApp.saveOfflineThemeState(value_43);
            handleAction_48();
            if (toast) showToast(toast);
            return value_43;
        }
        function handleAction_51() {
            window.imApp.applyOfflineChatTheme?.(value_43);
            if (value_45) window.clearTimeout(value_45);
            value_45 = window.setTimeout(() => {
                value_45 = null;
                handleAction_50(value_43)['catch']((value_276) => {
                    console.error('Offline theme persistence failed', value_276);
                    showToast('线下主题保存失败');
                });
            }, 350);
        }
        function handleAction_52(value_277, searchText_2) {
            if (!/^#[0-9a-fA-F]{6}$/.test(String(searchText_2 || '').trim())) return false;
            value_43 = window.imApp.normalizeOfflineThemeState({
                ...value_43,
                [value_277]: searchText_2,
                activePresetId: '',
            });
            handleAction_48({
                includeCss: false,
            });
            if (!enabled_46) handleAction_51();
            return true;
        }
        options_42.narrativeColor?.addEventListener('input', (event_279) =>
            handleAction_52('narrativeColor', event_279.target.value),
        );
        options_42.dialogueColor?.addEventListener('input', (event_280) =>
            handleAction_52('dialogueColor', event_280.target.value),
        );
        [
            ['narrativeColor', options_42.narrativeValue],
            ['dialogueColor', options_42.dialogueValue],
        ].forEach(([value_281, value_282]) => {
            value_282?.addEventListener('input', () => handleAction_52(value_281, value_282.value));
            value_282?.addEventListener('blur', () => {
                value_282.value = value_43[value_281];
            });
        });
        options_42.apply?.addEventListener('click', () =>
            handleAction_50(
                {
                    ...value_43,
                    customCss: options_42.css?.value || '',
                    activePresetId: value_43.activePresetId || '',
                },
                {
                    toast: (options_42.css?.value || '').trim()
                        ? '线下 CSS 已应用'
                        : '线下 CSS 已关闭',
                },
            ),
        );
        options_42.css?.addEventListener('input', () => {
            value_43 = {
                ...value_43,
                activePresetId: '',
            };
            handleAction_47();
        });
        options_42.clear?.addEventListener('click', () =>
            handleAction_50(
                {
                    ...value_43,
                    customCss: '',
                    activePresetId: '',
                },
                {
                    toast: '已清空线下 CSS',
                },
            ),
        );
        options_42.copy?.addEventListener('click', async () => {
            try {
                if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value_34);
                else {
                    const overlay_2 = document.createElement('textarea');
                    overlay_2.value = value_34;
                    overlay_2.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
                    document.body.appendChild(overlay_2);
                    overlay_2.select();
                    document.execCommand('copy');
                    overlay_2.remove();
                }
                showToast('已复制线下界面真实源码');
            } catch (value_284) {
                console.error('Copy offline theme source failed', value_284);
                showToast('复制失败，请稍后重试');
            }
        });
        options_42.presetSelect?.addEventListener('change', () => {
            const result_285 = items_44.find(
                (value_286) => value_286.id === options_42.presetSelect.value,
            );
            if (!result_285) {
                value_43 = {
                    ...value_43,
                    activePresetId: '',
                };
                handleAction_47();
                return;
            }
            value_45 && (window.clearTimeout(value_45), (value_45 = null));
            enabled_46 = true;
            value_43 = window.imApp.normalizeOfflineThemeState({
                ...result_285,
                activePresetId: result_285.id,
            });
            handleAction_48();
            showToast('已载入主题“' + result_285.name + '”，请保存并应用');
        });
        options_42.presetSave?.addEventListener('click', async () => {
            const name_12 = String(options_42.presetName?.value || '').trim();
            if (!name_12) {
                showToast('请输入主题预设名称');
                options_42.presetName?.focus();
                return;
            }
            const result_288 = items_44.find(
                    (value_291) =>
                        value_291.name.toLocaleLowerCase() === name_12.toLocaleLowerCase(),
                ),
                value_289 =
                    result_288?.id ||
                    'offline-theme-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
                options_290 = {
                    id: value_289,
                    name: name_12,
                    narrativeColor: value_43.narrativeColor,
                    dialogueColor: value_43.dialogueColor,
                    customCss: options_42.css?.value || '',
                };
            items_44 = await window.imApp.saveOfflineThemePresets(
                result_288
                    ? items_44.map((value_292) =>
                          value_292.id === value_289 ? options_290 : value_292,
                      )
                    : items_44.concat(options_290),
            );
            if (options_42.presetName) options_42.presetName.value = '';
            await handleAction_50(
                {
                    ...options_290,
                    activePresetId: value_289,
                },
                {
                    toast: result_288 ? '主题预设已更新' : '主题预设已保存',
                },
            );
        });
        options_42.presetDelete?.addEventListener('click', () => {
            const value_293 = options_42.presetSelect?.value || '';
            if (!value_293) return;
            const result_294 = items_44.find((value_296) => value_296.id === value_293),
                onConfirm_2 = async () => {
                    const value_297 = enabled_46,
                        value_298 = window.imApp.getOfflineThemeState?.().theme || value_43;
                    items_44 = await window.imApp.saveOfflineThemePresets(
                        items_44.filter((value_299) => value_299.id !== value_293),
                    );
                    value_297
                        ? ((enabled_46 = false),
                          (value_43 = value_298),
                          handleAction_48(),
                          showToast('主题预设已删除'))
                        : await handleAction_50(
                              {
                                  ...value_298,
                                  activePresetId: '',
                              },
                              {
                                  toast: '主题预设已删除',
                              },
                          );
                };
            window.showCustomModal && result_294
                ? window.showCustomModal({
                      title: '删除主题预设',
                      message: '确定删除“' + result_294.name + '”吗？',
                      confirmText: '删除',
                      cancelText: '取消',
                      isDestructive: true,
                      onConfirm: onConfirm_2,
                  })
                : void onConfirm_2();
        });
        options_42.reset?.addEventListener('click', () =>
            handleAction_50(window.imApp.createDefaultOfflineThemeState(), {
                toast: '已恢复默认线下主题',
            }),
        );
        options_42['export']?.addEventListener('click', async () => {
            const result_300 = items_44.find(
                    (value_304) => value_304.id === value_43.activePresetId,
                ),
                name_13 = result_300?.name || '自定义线下主题',
                options_302 = {
                    type: 'u2-offline-theme',
                    version: 1,
                    name: name_13,
                    theme: {
                        narrativeColor: value_43.narrativeColor,
                        dialogueColor: value_43.dialogueColor,
                        customCss: options_42.css?.value || '',
                    },
                },
                value_303 = await window.u2ExportFile({
                    blob: new Blob([JSON.stringify(options_302, null, 2)], {
                        type: 'application/json',
                    }),
                    fileName: (name_13.replace(/[\\/:*?"<>|]/g, '_') || 'offline-theme') + '.json',
                    title: 'U2 线下主题',
                });
            if (value_303 === 'shared' || value_303 === 'downloaded') showToast('线下主题已导出');
            else {
                if (value_303 === 'failed') showToast('线下主题导出失败');
            }
        });
        options_42['import']?.addEventListener('click', () => options_42.importInput?.click());
        options_42.importInput?.addEventListener('change', async () => {
            const value_305 = options_42.importInput.files?.[0];
            options_42.importInput.value = '';
            if (!value_305) return;
            try {
                const result_306 = JSON.parse(await value_305.text()),
                    value_307 =
                        result_306?.theme && typeof result_306.theme === 'object'
                            ? result_306.theme
                            : result_306;
                if (!value_307 || typeof value_307 !== 'object')
                    throw new Error('Invalid offline theme file');
                const offlineThemeState_308 = window.imApp.normalizeOfflineThemeState(value_307),
                    name_14 =
                        String(
                            result_306?.name ||
                                value_307.name ||
                                value_305.name.replace(/\.json$/i, '') ||
                                '导入主题',
                        )
                            .trim()
                            .slice(0, 40) || '导入主题',
                    result_310 = items_44.find(
                        (value_313) =>
                            value_313.name.toLocaleLowerCase() === name_14.toLocaleLowerCase(),
                    ),
                    value_311 =
                        result_310?.id ||
                        'offline-theme-' +
                            Date.now() +
                            '-' +
                            Math.random().toString(36).slice(2, 7),
                    options_312 = {
                        id: value_311,
                        name: name_14,
                        narrativeColor: offlineThemeState_308.narrativeColor,
                        dialogueColor: offlineThemeState_308.dialogueColor,
                        customCss: offlineThemeState_308.customCss,
                    };
                items_44 = await window.imApp.saveOfflineThemePresets(
                    result_310
                        ? items_44.map((value_314) =>
                              value_314.id === value_311 ? options_312 : value_314,
                          )
                        : items_44.concat(options_312),
                );
                await handleAction_50(
                    {
                        ...options_312,
                        activePresetId: value_311,
                    },
                    {
                        toast: '已导入并应用主题：' + name_14,
                    },
                );
            } catch (value_315) {
                console.error('Import offline theme failed', value_315);
                showToast('主题文件无效，导入失败');
            }
        });
        document.addEventListener('imessage-data-ready', handleImessageDataReady);
        handleAction_48();
        function handleAction_53() {
            handleImessageDataReady();
            value_64.clear();
            value_65.clear();
            renderKey = 'all';
            inputNameThemeChatScopeElements.forEach((value_318) => {
                value_318.checked = value_318.value === 'all';
            });
            const value_316 =
                window.imData?.currentSettingsFriend || window.imData?.currentActiveFriend || null;
            handleAction_84(value_316);
            const handleAction_83_317 = handleAction_83();
            handleAction_80(handleAction_83_317);
            void handleAction_95(handleAction_83_317);
            handleAction_116(handleAction_83_317);
            handleAction_75();
            handleAction_76(handleAction_83_317);
            handleAction_77();
            openView(themeConfigSheet);
        }
        function getActiveThemeType() {
            const activeTab = document.querySelector('.im-theme-tabs .theme-tab.active'),
                targetId = activeTab?.getAttribute('data-target') || 'theme-tab-home';
            if (targetId === 'theme-tab-home') return 'home';
            if (targetId === 'theme-tab-chat') return 'chat';
            if (targetId === 'theme-tab-group') return 'group';
            if (targetId === 'theme-tab-status') return 'status';
            if (targetId === 'theme-tab-offline') return 'offline';
            return 'bubble';
        }
        themeConfigSheet &&
            window.mobileInputCompat?.registerFocusScope &&
            window.mobileInputCompat.registerFocusScope({
                selector: '#theme-config-sheet',
                preferFocusScope: true,
                resolveScrollContainer: (target_2, root) => root.querySelector('.im-theme-content'),
                scrollBehavior: 'focus',
                viewportClassName: 'u2-android-theme-viewport-sized',
                viewportHeightCssVariable: '--u2-android-theme-viewport-height',
                viewportTopCssVariable: '--u2-android-theme-viewport-top',
            });
        async function handleAction_54(pendingThemeCssImportType_2 = getActiveThemeType()) {
            const targetType = pendingThemeCssImportType_2 || getActiveThemeType();
            if (targetType === 'home') {
                const value_326 = homeCssInput,
                    imessageHomeCss_2 = value_326 ? value_326.value : '';
                themeState_2.imessageHomeCss = imessageHomeCss_2;
                themeState_2.imessageHomeCssEnabled = !!imessageHomeCss_2.trim();
                window.u2ThemeState = themeState_2;
                window.imApp?.applyGlobalHomeCss?.(themeState_2);
                const value_328 = await saveGlobalData(),
                    text_329 = '首页与会话列表样式';
                showToast(
                    value_328
                        ? imessageHomeCss_2.trim()
                            ? text_329 + ' 已应用'
                            : text_329 + ' 已清空'
                        : text_329 + ' 保存失败，当前效果未持久化',
                );
                if (value_328) handleAction_75('home');
                return value_328;
            }
            if (targetType === 'chat') {
                const value_330 = chatCssInput ? chatCssInput.value : '';
                if (renderKey === 'friend') {
                    const handleAction_83_332 = handleAction_83();
                    if (!handleAction_83_332) return (showToast('请先选择一个单聊好友'), false);
                    const value_333 = await window.imApp?.commitScopedFriendChange?.(
                        handleAction_83_332,
                        (value_334) => {
                            value_334.chatCss = value_330;
                            value_334.chatCssEnabled = !!value_330.trim();
                        },
                        {
                            silent: true,
                            syncSettings: true,
                        },
                    );
                    if (!value_333) return (showToast('当前好友单聊样式保存失败'), false);
                    return (
                        window.imApp?.applyFriendCss?.(handleAction_97(handleAction_83_332)),
                        handleAction_69(),
                        showToast(
                            value_330.trim() ? '当前好友单聊样式已应用' : '当前好友单聊样式已清空',
                        ),
                        true
                    );
                }
                themeState_2.imessageChatCss = value_330;
                themeState_2.imessageChatCssEnabled = !!value_330.trim();
                window.u2ThemeState = themeState_2;
                window.imApp &&
                    window.imApp.applyGlobalChatCss &&
                    window.imApp.applyGlobalChatCss(themeState_2);
                const value_331 = await saveGlobalData();
                showToast(
                    value_331
                        ? value_330.trim()
                            ? '聊天页样式已应用'
                            : '聊天页样式已清空'
                        : '聊天页样式保存失败，当前效果未持久化',
                );
                if (value_331) handleAction_69();
                return value_331;
            }
            if (targetType === 'group') {
                const imessageGroupCss_2 = groupCssInput ? groupCssInput.value : '';
                themeState_2.imessageGroupCss = imessageGroupCss_2;
                themeState_2.imessageGroupCssEnabled = !!imessageGroupCss_2.trim();
                window.u2ThemeState = themeState_2;
                window.imApp &&
                    window.imApp.applyGlobalGroupCss &&
                    window.imApp.applyGlobalGroupCss(themeState_2);
                const value_336 = await saveGlobalData();
                showToast(
                    value_336
                        ? imessageGroupCss_2.trim()
                            ? '群聊样式已应用'
                            : '群聊样式已清空'
                        : '群聊样式保存失败，当前效果未持久化',
                );
                if (value_336) handleAction_75('group');
                return value_336;
            }
            if (targetType === 'status') {
                const string = String(currentOption?.value || 'template'),
                    value_337 =
                        string === 'css'
                            ? await handleAction_99()
                            : string === 'default'
                              ? await handleAction_100()
                              : await handleAction_98();
                if (value_337) handleAction_75('status');
                return value_337;
            }
            const handleAction_83_323 = handleAction_83();
            if (!handleAction_83_323) return (showToast('请先选择一个单聊好友'), false);
            const value_324 = themeBubbleCssInput,
                customCss_2 = value_324 ? value_324.value : '';
            if (window.imApp && window.imApp.commitScopedFriendChange) {
                const value_338 = await window.imApp.commitScopedFriendChange(
                    handleAction_83_323,
                    (targetFriend) => {
                        targetFriend.customCss = customCss_2;
                        targetFriend.customCssEnabled = !!customCss_2.trim();
                    },
                    {
                        silent: true,
                        syncSettings: true,
                    },
                );
                if (value_338) {
                    const handleAction_97_340 = handleAction_97(handleAction_83_323);
                    if (window.imApp.applyFriendCss)
                        window.imApp.applyFriendCss(handleAction_97_340);
                    handleAction_116(handleAction_97_340);
                    handleAction_75('bubble');
                    showToast('当前好友气泡样式已应用');
                } else showToast('当前好友气泡样式保存失败');
                return value_338;
            }
            return false;
        }
        function normalizeImessageCssPresets(value_341) {
            const value_342 = value_341 && typeof value_341 === 'object' ? value_341 : {};
            return IMESSAGE_CSS_THEME_TYPES.reduce((value_343, value_344) => {
                const seenNames = new Set();
                return (
                    (value_343[value_344] = (
                        Array.isArray(value_342[value_344]) ? value_342[value_344] : []
                    )
                        .map((preset_2, value_347) => ({
                            id: String(preset_2?.id || value_344 + '-preset-' + value_347),
                            name: String(preset_2?.name || '').trim(),
                            css: typeof preset_2?.css === 'string' ? preset_2.css : '',
                        }))
                        .filter((preset) => preset.name && preset.css.trim())
                        .filter((preset_3) => {
                            if (seenNames.has(preset_3.name)) return false;
                            return (seenNames.add(preset_3.name), true);
                        })),
                    value_343
                );
            }, {});
        }
        function handleAction_56(value_349) {
            const items_350 = Array.isArray(value_349) ? value_349 : [],
                seenNames_2 = new Set();
            return items_350
                .map((preset_4, value_353) => {
                    const name_15 = String(preset_4?.name || '').trim(),
                        prompt_2 = String(preset_4?.prompt || '').trim(),
                        regex_2 = String(preset_4?.regex || '').trim(),
                        html_2 = String(preset_4?.html || '').trim();
                    if (!name_15 || !prompt_2 || !regex_2 || !html_2) return null;
                    return {
                        id: String(preset_4?.id || 'status-template-preset-' + value_353),
                        name: name_15,
                        prompt: prompt_2,
                        regex: regex_2,
                        html: html_2,
                    };
                })
                .filter(Boolean)
                .filter((preset_5) => {
                    if (seenNames_2.has(preset_5.name)) return false;
                    return (seenNames_2.add(preset_5.name), true);
                });
        }
        themeConfigBtn &&
            desktopThemeConfigSheet &&
            themeConfigBtn.addEventListener('click', (event_359) => {
                event_359.stopPropagation();
                openDesktopThemeConfig();
            });
        imessageThemesBtn &&
            themeConfigSheet &&
            imessageThemesBtn.addEventListener('click', (event_360) => {
                event_360.stopPropagation();
                handleAction_53();
            });
        themeConfigBackBtn &&
            themeConfigSheet &&
            themeConfigBackBtn.addEventListener('click', () => {
                if (handleAction_72() && !window.confirm('当前 Theme 有未保存的修改，确定放弃吗？'))
                    return;
                handleAction_75();
                closeView(themeConfigSheet);
            });
        const themeTabs = document.querySelectorAll('.theme-tab'),
            themeTabContents = document.querySelectorAll('.theme-tab-content');
        function handleAction_57(value_361, { focus = false } = {}) {
            const targetId_2 = value_361?.getAttribute('data-target');
            if (!targetId_2) return;
            themeTabs.forEach((tab_2) => {
                const active_2 = tab_2 === value_361;
                tab_2.classList.toggle('active', active_2);
                tab_2.setAttribute('aria-selected', String(active_2));
            });
            themeTabContents.forEach((element_364) => {
                const value_365 = element_364.id === targetId_2;
                element_364.classList.toggle('active', value_365);
                element_364.hidden = !value_365;
            });
            handleAction_77();
            if (focus)
                value_361.focus({
                    preventScroll: true,
                });
        }
        function handleAction_58(items_366, value_367) {
            items_366.forEach((value_368, value_369) => {
                value_368.addEventListener('keydown', (event_370) => {
                    const items_371 = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
                    if (!items_371.includes(event_370.key)) return;
                    event_370.preventDefault();
                    let value_372 = value_369;
                    if (event_370.key === 'ArrowLeft')
                        value_372 = (value_369 - 1 + items_366.length) % items_366.length;
                    if (event_370.key === 'ArrowRight')
                        value_372 = (value_369 + 1) % items_366.length;
                    if (event_370.key === 'Home') value_372 = 0;
                    if (event_370.key === 'End') value_372 = items_366.length - 1;
                    value_367(items_366[value_372], {
                        focus: true,
                    });
                });
            });
        }
        themeTabs.forEach((value_373) => {
            value_373.addEventListener('click', () => {
                handleAction_57(value_373);
            });
        });
        handleAction_58(Array.from(themeTabs), handleAction_57);
        const homeCssInput = document.getElementById('theme-home-css-input'),
            themeHomeClearBtn = document.getElementById('theme-home-clear-btn'),
            themeHomeCopyBtn = document.getElementById('theme-home-copy-btn'),
            themeHomeSaveBtn = document.getElementById('theme-home-save-btn'),
            themeHomePresetName = document.getElementById('theme-home-preset-name'),
            themeHomePresetList = document.getElementById('theme-home-preset-list'),
            themeBubbleCssInput = document.getElementById('theme-bubble-css-input'),
            themeBubbleClearBtn = document.getElementById('theme-bubble-clear-btn'),
            themeBubbleCopyBtn = document.getElementById('theme-bubble-copy-btn'),
            themeChatCopyBtn = document.getElementById('theme-chat-copy-btn'),
            themeBubbleSaveBtn = document.getElementById('theme-bubble-save-btn'),
            themeBubblePresetName = document.getElementById('theme-bubble-preset-name'),
            chatCssInput = document.getElementById('theme-chat-css-input'),
            themeChatClearBtn = document.getElementById('theme-chat-clear-btn'),
            groupCssInput = document.getElementById('theme-group-css-input'),
            themeGroupClearBtn = document.getElementById('theme-group-clear-btn'),
            themeGroupCopyBtn = document.getElementById('theme-group-copy-btn'),
            themeChatSaveBtn = document.getElementById('theme-chat-save-btn'),
            themeChatPresetName = document.getElementById('theme-chat-preset-name'),
            themeChatPresetList = document.getElementById('theme-chat-preset-list'),
            themeGroupSaveBtn = document.getElementById('theme-group-save-btn'),
            themeGroupPresetName = document.getElementById('theme-group-preset-name'),
            themeGroupPresetList = document.getElementById('theme-group-preset-list'),
            themeFontUrlInput_4 = document.getElementById('theme-status-template-prompt'),
            themeFontUrlInput_5 = document.getElementById('theme-status-template-regex'),
            themeFontUrlInput_6 = document.getElementById('theme-status-template-html'),
            themeStatusTemplateGenerateBtnElement = document.getElementById(
                'theme-status-template-generate-btn',
            ),
            storageHealthWarning_2 = document.getElementById('theme-status-more-actions'),
            closest_59 = storageHealthWarning_2?.closest('.im-theme-workspace-footer'),
            dataStatusRenderActionElements = document.querySelectorAll(
                '[data-status-render-action]',
            ),
            themeStatusClearBtn = document.getElementById('theme-status-clear-btn'),
            themeStatusCopyBtn = document.getElementById('theme-status-copy-btn'),
            themeStatusTemplateImportBtnElement = document.getElementById(
                'theme-status-template-import-btn',
            ),
            themeStatusTemplateExportBtnElement = document.getElementById(
                'theme-status-template-export-btn',
            ),
            themeStatusTemplateImportInputElement = document.getElementById(
                'theme-status-template-import-input',
            ),
            themeFontUrlInput_3 = document.getElementById('theme-status-target-select'),
            currentOption = document.getElementById('theme-status-render-mode'),
            dataStatusRenderPanelElements = document.querySelectorAll('[data-status-render-panel]'),
            themeFontUrlInput_7 = document.getElementById('theme-status-css-prompt'),
            themeStatusCssInput = document.getElementById('theme-status-css-input'),
            themeStatusCssSaveBtnElement = document.getElementById('theme-status-css-save-btn'),
            themeStatusCssPresetNameElement = document.getElementById(
                'theme-status-css-preset-name',
            ),
            themeStatusCssPresetListElement = document.getElementById(
                'theme-status-css-preset-list',
            ),
            themeStatusSaveBtn = document.getElementById('theme-status-save-btn'),
            themeFontUrlInput_2 = document.getElementById('theme-status-preset-name'),
            themeStatusPresetList = document.getElementById('theme-status-preset-list'),
            themeCssImportInput = document.getElementById('theme-css-import-input'),
            themeCssImportButtons = document.querySelectorAll('[data-theme-import-type]');
        let pendingThemeCssImportType = '',
            value_5 = '';
        const themeBubblePresetList = document.getElementById('theme-bubble-preset-list'),
            themeFriendTargetBarElement = document.getElementById('theme-friend-target-bar'),
            themeFriendTargetAvatarElement = document.getElementById('theme-friend-target-avatar'),
            themeFriendTargetNameElement = document.getElementById('theme-friend-target-name'),
            options_61 = {
                bubble: document.getElementById('theme-bubble-preview'),
            },
            themeDraftIndicatorElement = document.getElementById('theme-draft-indicator'),
            options_62 = {
                sections: new Set(),
            },
            inputNameThemeChatScopeElements = document.querySelectorAll(
                'input[name="theme-chat-scope"]',
            ),
            themeChatScopeSummaryElement = document.getElementById('theme-chat-scope-summary');
        let renderKey = 'all';
        const value_64 = new Map(),
            value_65 = new Set();
        function handleAction_66(value_374 = renderKey, value_375 = value_5) {
            return value_374 === 'friend' ? 'friend:' + value_375 : 'all';
        }
        function handleAction_67() {
            const handleAction_66_376 = handleAction_66();
            value_64.set(handleAction_66_376, chatCssInput?.value || '');
            value_65.add(handleAction_66_376);
            handleAction_74('chat');
        }
        function handleAction_68() {
            if (!chatCssInput) return;
            const handleAction_66_377 = handleAction_66(),
                value_378 = renderKey === 'friend' ? handleAction_83() : null;
            chatCssInput.value = value_64.has(handleAction_66_377)
                ? value_64.get(handleAction_66_377)
                : renderKey === 'friend'
                  ? value_378?.chatCss || ''
                  : themeState_2.imessageChatCss || '';
            if (themeChatScopeSummaryElement)
                themeChatScopeSummaryElement.textContent =
                    renderKey === 'friend'
                        ? '仅应用到 ' + (value_378?.nickname || '所选好友')
                        : '应用到全部单聊';
        }
        function handleAction_69() {
            const handleAction_66_379 = handleAction_66();
            value_64['delete'](handleAction_66_379);
            value_65['delete'](handleAction_66_379);
            if (value_65.size === 0) handleAction_75('chat');
        }
        function handleAction_70(value_380) {
            const apiModelRenderKey = value_380 === 'friend' ? 'friend' : 'all';
            if (apiModelRenderKey === renderKey) return;
            renderKey = apiModelRenderKey;
            inputNameThemeChatScopeElements.forEach((value_382) => {
                value_382.checked = value_382.value === apiModelRenderKey;
            });
            handleAction_68();
            handleAction_77();
            handleAction_116(handleAction_83());
        }
        inputNameThemeChatScopeElements.forEach((value_383) =>
            value_383.addEventListener('change', () => {
                if (value_383.checked) handleAction_70(value_383.value);
            }),
        );
        function handleAction_71() {
            return Array.from(options_62.sections);
        }
        function handleAction_72(value_384 = '') {
            return value_384 ? options_62.sections.has(value_384) : options_62.sections.size > 0;
        }
        function handleAction_73() {
            if (!themeDraftIndicatorElement) return;
            themeDraftIndicatorElement.textContent = handleAction_72()
                ? '未保存 · ' + handleAction_71().length + ' 项修改'
                : 'iMessage 样式工具';
        }
        function handleAction_74(value_385) {
            if (!value_385) return;
            options_62.sections.add(value_385);
            handleAction_73();
        }
        function handleAction_75(value_386 = '') {
            if (value_386) options_62.sections['delete'](value_386);
            else options_62.sections.clear();
            handleAction_73();
        }
        function handleAction_76(value_387 = handleAction_83()) {
            themeFriendTargetNameElement &&
                (themeFriendTargetNameElement.textContent = value_387
                    ? value_387.nickname || value_387.realName || '单聊 ' + value_387.id
                    : '暂无可用单聊好友');
            themeFriendTargetAvatarElement &&
                ((themeFriendTargetAvatarElement.src =
                    value_387?.avatarUrl || 'https://picsum.photos/seed/char/100/100'),
                (themeFriendTargetAvatarElement.alt = value_387
                    ? (themeFriendTargetNameElement?.textContent || '好友') + '的头像'
                    : ''));
        }
        function handleAction_77() {
            if (!themeFriendTargetBarElement) return;
            const activeThemeType = getActiveThemeType();
            themeFriendTargetBarElement.hidden =
                activeThemeType !== 'bubble' &&
                activeThemeType !== 'status' &&
                !(activeThemeType === 'chat' && renderKey === 'friend');
            if (!themeFriendTargetBarElement.hidden) handleAction_76();
        }
        function handleAction_78() {
            return '<div class="preview-chat"><div class="chat-row ai-row"><div class="chat-bubble ai-bubble">这是对方的消息</div></div><div class="chat-row user-row"><div class="chat-bubble user-bubble">这是我的消息</div></div></div>';
        }
        function handleAction_79(value_388) {
            const assistiveDragState = options_61[value_388],
                assistiveBallEl_2 = getThemeCssInput(value_388);
            if (!assistiveDragState || !assistiveBallEl_2) return;
            const replace_390 = String(assistiveBallEl_2.value || '').replace(
                /<\/style/gi,
                '<\\/style',
            );
            assistiveDragState.srcdoc =
                `<!doctype html><html><head><meta charset="utf-8"><style>
                * { box-sizing: border-box; } html, body { min-height: 100%; margin: 0; } body { padding: 14px; background: #f2f2f7; color: #111; font: 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
                .preview-home, .preview-chat { min-height: 100%; padding: 12px; border-radius: 16px; background: #fff; } .preview-header, .chat-header { font-size: 17px; font-weight: 800; } .preview-search, .chat-composer { margin: 10px 0; padding: 8px 10px; border-radius: 10px; background: #f2f2f7; color: #8e8e93; } .preview-row { display: flex; flex-direction: column; gap: 3px; padding: 10px 0; border-bottom: 1px solid #ececf0; } .preview-row span, .chat-header span { color: #8e8e93; font-size: 11px; font-weight: 500; } .chat-row, .group-row { display: flex; margin: 10px 0; gap: 7px; } .user-row { justify-content: flex-end; } .chat-bubble { max-width: 76%; padding: 9px 11px; border-radius: 14px; } .ai-bubble { background: #e5e5ea; } .user-bubble { background: #111; color: #fff; } .group-avatar { width: 24px; height: 24px; border-radius: 50%; background: #d1d1d6; flex: 0 0 auto; }
                ` +
                replace_390 +
                `
            </style></head><body><div id="theme-preview-root">` +
                handleAction_78() +
                '</div></body></html>';
        }
        function handleAction_80(value_391 = handleAction_83()) {
            if (homeCssInput) homeCssInput.value = themeState_2.imessageHomeCss || '';
            if (chatCssInput) chatCssInput.value = themeState_2.imessageChatCss || '';
            if (groupCssInput) groupCssInput.value = themeState_2.imessageGroupCss || '';
            if (themeBubbleCssInput) themeBubbleCssInput.value = value_391?.customCss || '';
            handleAction_94(value_391);
            handleAction_79('bubble');
        }
        function handleAction_81() {
            return window.imApp?.createDefaultStatusTemplate
                ? window.imApp.createDefaultStatusTemplate()
                : {
                      enabled: false,
                      prompt: window.imApp?.DEFAULT_STATUS_PROMPT || '',
                      regex: '(?<thought>[\\s\\S]+)',
                      html: '<div class="gmp-inner-voice chat-profile-panel-thought">{{thought}}</div>',
                  };
        }
        function handleAction_82() {
            return (window.imData?.friends || []).filter(
                (value_392) => value_392 && value_392.id != null && value_392.type === 'char',
            );
        }
        function handleAction_83() {
            const rawUrl = String(themeFontUrlInput_3?.value || '').trim(),
                value_394 = rawUrl
                    ? handleAction_82().find((value_398) => String(value_398.id) === rawUrl)
                    : null,
                value_395 =
                    window.imData?.currentSettingsFriend ||
                    window.imData?.currentActiveFriend ||
                    null,
                value_396 = value_394 || value_395,
                value_397 = value_396
                    ? window.imApp?.getFriendById?.(value_396.id) || value_396
                    : null;
            return value_397?.type === 'char' ? value_397 : null;
        }
        function handleAction_84(value_399 = null) {
            if (!themeFontUrlInput_3) return;
            const handleAction_82_400 = handleAction_82(),
                trim_401 = String(themeFontUrlInput_3.value || '').trim(),
                trim_402 = String(
                    value_399?.id ||
                        trim_401 ||
                        window.imData?.currentSettingsFriend?.id ||
                        window.imData?.currentActiveFriend?.id ||
                        '',
                ).trim();
            themeFontUrlInput_3.innerHTML = '';
            if (handleAction_82_400.length === 0) {
                const element_404 = document.createElement('option');
                element_404.value = '';
                element_404.textContent = '暂无可用单聊';
                themeFontUrlInput_3.appendChild(element_404);
                themeFontUrlInput_3.disabled = true;
                handleAction_76(null);
                return;
            }
            handleAction_82_400.forEach((preset_6) => {
                const option_2 = document.createElement('option');
                option_2.value = String(preset_6.id);
                option_2.textContent =
                    preset_6.nickname || preset_6.realName || '单聊 ' + String(preset_6.id);
                themeFontUrlInput_3.appendChild(option_2);
            });
            const value_3 = handleAction_82_400.some(
                (value_407) => String(value_407.id) === trim_402,
            )
                ? trim_402
                : String(handleAction_82_400[0].id);
            themeFontUrlInput_3.value = value_3;
            themeFontUrlInput_3.disabled = false;
            value_5 = value_3;
            handleAction_76(handleAction_83());
        }
        function handleAction_85(value_408 = handleAction_83()) {
            if (typeof window.imApp?.getStatusRenderMode === 'function')
                return window.imApp.getStatusRenderMode(value_408);
            const trim_409 = String(value_408?.statusRenderMode || '').trim();
            if (['template', 'css', 'default'].includes(trim_409)) return trim_409;
            if (value_408?.statusTemplate?.enabled === true) return 'template';
            if (value_408?.statusCssEnabled && String(value_408.statusCss || '').trim())
                return 'css';
            return 'default';
        }
        function handleAction_86(value_410 = handleAction_85()) {
            const value_4 = ['template', 'css', 'default'].includes(value_410)
                ? value_410
                : 'default';
            if (currentOption) currentOption.value = value_4;
            dataStatusRenderPanelElements.forEach((value_413) => {
                const value_414 = value_413.getAttribute('data-status-render-panel') === value_4;
                value_413.hidden = !value_414;
            });
            let warning_2 = false;
            dataStatusRenderActionElements.forEach((storageHealthWarning) => {
                const filter_416 = String(
                        storageHealthWarning.getAttribute('data-status-render-action') || '',
                    )
                        .split(/\s+/)
                        .filter(Boolean),
                    warning = filter_416.includes(value_4);
                storageHealthWarning.hidden = !warning;
                warning_2 ||= warning;
            });
            if (storageHealthWarning_2) {
                storageHealthWarning_2.hidden = !warning_2;
                if (!warning_2) storageHealthWarning_2.open = false;
            }
            closest_59?.classList.toggle('is-status-actions-hidden', !warning_2);
        }
        function handleAction_87(enabled_6 = true) {
            return {
                enabled: enabled_6,
                prompt: String(themeFontUrlInput_4?.value || '').trim(),
                regex: String(themeFontUrlInput_5?.value || '').trim(),
                html: String(themeFontUrlInput_6?.value || '').trim(),
            };
        }
        const format_7 = 'u2-imessage-status-template',
            version_2 = 1;
        function handleAction_90(value_419) {
            const validateStatusTemplate_420 = window.imApp?.validateStatusTemplate?.({
                enabled: true,
                prompt: value_419?.prompt,
                regex: value_419?.regex,
                html: value_419?.html,
            });
            if (!validateStatusTemplate_420?.valid)
                throw new Error(validateStatusTemplate_420?.error || '状态栏模板格式无效');
            return validateStatusTemplate_420.template;
        }
        function buildHomeThemePackage_2() {
            const handleAction_90_421 = handleAction_90(handleAction_87(true));
            return {
                format: format_7,
                version: version_2,
                template: {
                    prompt: handleAction_90_421.prompt,
                    regex: handleAction_90_421.regex,
                    html: handleAction_90_421.html,
                },
            };
        }
        function parseHomeThemePackage_2(rawText) {
            let payload_2;
            try {
                payload_2 = JSON.parse(String(rawText || ''));
            } catch (value_424) {
                throw new Error('模板文件不是有效 JSON');
            }
            if (
                !payload_2 ||
                typeof payload_2 !== 'object' ||
                Array.isArray(payload_2) ||
                payload_2.format !== format_7 ||
                payload_2.version !== version_2 ||
                !payload_2.template ||
                typeof payload_2.template !== 'object' ||
                Array.isArray(payload_2.template)
            )
                throw new Error('不是可识别的状态栏模板文件');
            return handleAction_90(payload_2.template);
        }
        function handleAction_93(value_425) {
            if (themeFontUrlInput_4) themeFontUrlInput_4.value = value_425.prompt;
            if (themeFontUrlInput_5) themeFontUrlInput_5.value = value_425.regex;
            if (themeFontUrlInput_6) themeFontUrlInput_6.value = value_425.html;
            handleAction_74('status');
        }
        function handleAction_94(value_426 = handleAction_83()) {
            const value_427 =
                value_426?.statusTemplate && typeof value_426.statusTemplate === 'object'
                    ? value_426.statusTemplate
                    : handleAction_81();
            if (themeFontUrlInput_4)
                themeFontUrlInput_4.value = value_427.prompt || handleAction_81().prompt;
            if (themeFontUrlInput_5)
                themeFontUrlInput_5.value = value_427.regex || handleAction_81().regex;
            if (themeFontUrlInput_6)
                themeFontUrlInput_6.value = value_427.html || handleAction_81().html;
            if (themeFontUrlInput_7) themeFontUrlInput_7.value = value_426?.statusCssPrompt || '';
            if (themeStatusCssInput) themeStatusCssInput.value = value_426?.statusCss || '';
            handleAction_86(handleAction_85(value_426));
        }
        async function handleAction_95(value_428 = handleAction_83()) {
            if (
                !value_428 ||
                value_428.type === 'group' ||
                value_428._statusTemplateNeedsPersistence !== true ||
                !window.imApp?.commitScopedFriendChange
            )
                return true;
            return window.imApp.commitScopedFriendChange(
                value_428,
                (value_429) => {
                    (!value_429.statusTemplate || typeof value_429.statusTemplate !== 'object') &&
                        (value_429.statusTemplate = window.imApp?.createDefaultStatusTemplate
                            ? window.imApp.createDefaultStatusTemplate({
                                  enabled: value_429.statusPromptEnabled === true,
                                  prompt: value_429.statusPrompt,
                              })
                            : handleAction_81());
                    !['template', 'css', 'default'].includes(value_429.statusRenderMode) &&
                        (value_429.statusRenderMode = value_429.statusTemplate.enabled
                            ? 'template'
                            : 'default');
                    delete value_429._statusTemplateNeedsPersistence;
                },
                {
                    silent: true,
                    syncSettings: true,
                },
            );
        }
        function handleAction_96(value_430) {
            if (!value_430 || value_430.type === 'group') return;
            if (window.imChat?.refreshProfilePanel) {
                window.imChat.refreshProfilePanel(value_430);
                return;
            }
            const elementById = document.getElementById('chat-interface-' + value_430.id),
                chatProfilePanelOverlayActiveElement = elementById?.querySelector(
                    '.chat-profile-panel-overlay.active',
                );
            chatProfilePanelOverlayActiveElement &&
                window.imChat?.renderProfilePanel &&
                window.imChat.renderProfilePanel(value_430, chatProfilePanelOverlayActiveElement);
        }
        function handleAction_97(value_431) {
            return window.imApp?.getFriendById?.(value_431?.id) || value_431 || handleAction_83();
        }
        async function handleAction_98() {
            const handleAction_83_432 = handleAction_83();
            if (!handleAction_83_432) return (showToast('请先在上方选择一个单聊好友'), false);
            const validateStatusTemplate_433 = window.imApp?.validateStatusTemplate?.(
                handleAction_87(true),
            );
            if (!validateStatusTemplate_433?.valid)
                return (
                    showToast(validateStatusTemplate_433?.error || '状态栏模板校验失败'),
                    false
                );
            const value_434 = await window.imApp.commitScopedFriendChange(
                handleAction_83_432,
                (value_436) => {
                    value_436.statusTemplate = validateStatusTemplate_433.template;
                    value_436.statusRenderMode = 'template';
                    delete value_436._statusTemplateNeedsPersistence;
                },
                {
                    silent: true,
                    syncSettings: true,
                },
            );
            if (!value_434) return (showToast('状态栏模板保存失败'), false);
            const handleAction_97_435 = handleAction_97(handleAction_83_432);
            return (
                window.imApp.applyFriendStatusBarCss?.(handleAction_97_435),
                handleAction_96(handleAction_97_435),
                handleAction_116(handleAction_97_435),
                handleAction_86('template'),
                showToast('已应用 HTML 状态栏模板'),
                true
            );
        }
        async function handleAction_99() {
            const handleAction_83_437 = handleAction_83();
            if (!handleAction_83_437) return (showToast('请先在上方选择一个单聊好友'), false);
            const statusCss_2 = String(themeStatusCssInput?.value || ''),
                statusCssPrompt_2 = String(themeFontUrlInput_7?.value || '').trim(),
                statusCssAppliedAt_2 = statusCss_2.trim() ? Date.now() : 0,
                value_441 = await window.imApp.commitScopedFriendChange(
                    handleAction_83_437,
                    (targetFriend_2) => {
                        targetFriend_2.statusCss = statusCss_2;
                        targetFriend_2.statusCssEnabled = !!statusCss_2.trim();
                        targetFriend_2.statusCssPrompt = statusCssPrompt_2;
                        targetFriend_2.statusCssAppliedAt = statusCssAppliedAt_2;
                        targetFriend_2.statusRenderMode = statusCss_2.trim() ? 'css' : 'default';
                    },
                    {
                        silent: true,
                        syncSettings: true,
                    },
                );
            if (!value_441) return (showToast('状态栏 CSS 保存失败'), false);
            const handleAction_97_442 = handleAction_97(handleAction_83_437);
            return (
                window.imApp.applyFriendStatusBarCss?.(handleAction_97_442),
                handleAction_96(handleAction_97_442),
                handleAction_86(statusCss_2.trim() ? 'css' : 'default'),
                handleAction_116(handleAction_97_442),
                showToast(statusCss_2.trim() ? '已应用纯 CSS 状态栏' : '已恢复系统默认状态栏'),
                true
            );
        }
        async function handleAction_100() {
            const handleAction_83_444 = handleAction_83();
            if (!handleAction_83_444)
                return (
                    handleAction_86('default'),
                    showToast('先选择单聊好友后即可应用系统默认状态栏'),
                    false
                );
            const value_445 = await window.imApp.commitScopedFriendChange(
                handleAction_83_444,
                (value_447) => {
                    value_447.statusRenderMode = 'default';
                    value_447.statusCssAppliedAt = 0;
                },
                {
                    silent: true,
                    syncSettings: true,
                },
            );
            if (!value_445) return (showToast('恢复系统默认状态栏失败'), false);
            const handleAction_97_446 = handleAction_97(handleAction_83_444);
            return (
                window.imApp.applyFriendStatusBarCss?.(handleAction_97_446),
                handleAction_96(handleAction_97_446),
                handleAction_86('default'),
                showToast('已使用系统默认状态栏'),
                true
            );
        }
        function handleAction_101() {
            if (!window.confirm('清空模板草稿？保存并应用后才会影响当前状态栏。')) return;
            const handleAction_81_448 = handleAction_81();
            if (themeFontUrlInput_4) themeFontUrlInput_4.value = handleAction_81_448.prompt;
            if (themeFontUrlInput_5) themeFontUrlInput_5.value = handleAction_81_448.regex;
            if (themeFontUrlInput_6) themeFontUrlInput_6.value = handleAction_81_448.html;
            handleAction_74('status');
            showToast('模板草稿已恢复默认，等待保存并应用');
        }
        function handleAction_102() {
            if (!window.confirm('清空 CSS 草稿？保存并应用后才会影响当前状态栏。')) return;
            if (themeStatusCssInput) themeStatusCssInput.value = '';
            handleAction_74('status');
            showToast('CSS 草稿已清空，等待保存并应用');
        }
        function handleAction_103() {
            const string_449 = String(currentOption?.value || handleAction_85());
            if (string_449 === 'css') {
                handleAction_102();
                return;
            }
            if (string_449 === 'template') handleAction_101();
        }
        themeFontUrlInput_3?.addEventListener('change', () => {
            const trim_450 = String(themeFontUrlInput_3.value || '').trim();
            if (
                (handleAction_72('bubble') || handleAction_72('status')) &&
                !window.confirm('切换好友会放弃当前好友与状态栏的未保存修改，确定继续吗？')
            ) {
                themeFontUrlInput_3.value = value_5;
                return;
            }
            value_5 = trim_450;
            const handleAction_83_451 = handleAction_83();
            if (renderKey === 'friend') handleAction_68();
            if (themeBubbleCssInput)
                themeBubbleCssInput.value = handleAction_83_451?.customCss || '';
            handleAction_94(handleAction_83_451);
            if (themeStatusPresetList) themeStatusPresetList.value = '';
            void handleAction_95(handleAction_83_451);
            handleAction_116(handleAction_83_451);
            handleAction_75('bubble');
            handleAction_75('status');
            handleAction_76(handleAction_83_451);
            handleAction_79('bubble');
        });
        currentOption?.addEventListener('change', () => {
            handleAction_86(currentOption.value);
            handleAction_74('status');
        });
        themeStatusTemplateGenerateBtnElement?.addEventListener('click', async () => {
            const handleAction_83_452 = handleAction_83();
            if (!handleAction_83_452) {
                showToast('请先在上方选择一个单聊好友');
                return;
            }
            const string_453 = String(currentOption?.value || 'template');
            if (!['template', 'css'].includes(string_453)) {
                showToast('请先选择 HTML 模板或纯 CSS 并保存，再生成最新状态');
                return;
            }
            if (!window.imChat?.generateProfileStatus) {
                showToast('状态生成器尚未就绪，请稍后再试');
                return;
            }
            themeStatusTemplateGenerateBtnElement.disabled = true;
            try {
                if (!(await handleAction_54('status'))) return;
                const handleAction_97_454 = handleAction_97(handleAction_83_452),
                    value_455 = await window.imChat.generateProfileStatus(handleAction_97_454, {
                        reveal: true,
                    });
                if (!value_455?.success) {
                    showToast(value_455?.reason || '状态生成失败');
                    return;
                }
                showToast('已生成并展示最新状态');
            } finally {
                themeStatusTemplateGenerateBtnElement.disabled = false;
            }
        });
        themeStatusClearBtn?.addEventListener('click', handleAction_103);
        themeStatusTemplateExportBtnElement?.addEventListener('click', async () => {
            try {
                const blob_4 = new Blob([JSON.stringify(buildHomeThemePackage_2(), null, 2)], {
                        type: 'application/json;charset=utf-8',
                    }),
                    value_457 = await window.u2ExportFile({
                        blob: blob_4,
                        fileName:
                            'u2-imessage-status-template-' +
                            new Date().toISOString().slice(0, 10) +
                            '.json',
                        title: 'iMessage 状态栏模板',
                    });
                if (value_457 === 'shared' || value_457 === 'downloaded')
                    showToast('状态栏模板已导出');
                else {
                    if (value_457 === 'failed') showToast('状态栏模板导出失败');
                }
            } catch (value_458) {
                console.error('Failed to export iMessage status template', value_458);
                showToast(value_458?.message || '状态栏模板导出失败');
            }
        });
        themeStatusTemplateImportBtnElement?.addEventListener('click', () =>
            themeStatusTemplateImportInputElement?.click(),
        );
        themeStatusTemplateImportInputElement?.addEventListener('change', async () => {
            const file_3 = themeStatusTemplateImportInputElement.files?.[0];
            themeStatusTemplateImportInputElement.value = '';
            if (!file_3) return;
            if (
                !String(file_3.name || '')
                    .toLowerCase()
                    .endsWith('.json')
            ) {
                showToast('请选择 JSON 状态栏模板文件');
                return;
            }
            try {
                const importedTheme_2 = parseHomeThemePackage_2(await file_3.text());
                if (
                    String(themeFontUrlInput_4?.value || '').trim() ||
                    String(themeFontUrlInput_5?.value || '').trim() ||
                    String(themeFontUrlInput_6?.value || '').trim()
                ) {
                    if (!window.confirm('导入会替换当前未应用的状态栏模板内容，确定继续吗？'))
                        return;
                }
                handleAction_93(importedTheme_2);
                showToast('状态栏模板已导入，请确认内容后点击应用');
            } catch (value_461) {
                console.error('Failed to import iMessage status template', value_461);
                showToast(value_461?.message || '状态栏模板导入失败');
            }
        });
        [themeFontUrlInput_4, themeFontUrlInput_5, themeFontUrlInput_6].forEach((value_462) => {
            value_462?.addEventListener('input', () => {
                handleAction_74('status');
            });
        });
        function getThemeCssInput(type_3 = getActiveThemeType()) {
            if (type_3 === 'home') return homeCssInput;
            if (type_3 === 'chat') return chatCssInput;
            if (type_3 === 'group') return groupCssInput;
            if (type_3 === 'status') return themeStatusCssInput;
            return themeBubbleCssInput;
        }
        document.querySelectorAll('[data-theme-draft-section]').forEach((value_464) => {
            value_464.addEventListener('input', () => {
                const attribute_465 = value_464.getAttribute('data-theme-draft-section');
                if (attribute_465 === 'chat') handleAction_67();
                else handleAction_74(attribute_465);
                if (attribute_465 === 'bubble') handleAction_79('bubble');
            });
        });
        document.querySelectorAll('[data-theme-apply-type]').forEach((value_466) => {
            value_466.addEventListener('click', () => {
                const attribute_467 = value_466.getAttribute('data-theme-apply-type');
                handleAction_54(attribute_467)['catch']((value_468) => {
                    console.warn('Failed to save iMessage Theme workspace:', value_468);
                    showToast('Theme 保存失败，当前效果未持久化');
                });
            });
        });
        async function handleAction_104(file_4) {
            const lowerName = String(file_4?.name || '').toLowerCase();
            if (!lowerName.endsWith('.txt') && !lowerName.endsWith('.docx'))
                throw new Error('仅支持 TXT 和 DOCX 文件');
            let text_2 = '';
            if (lowerName.endsWith('.docx')) {
                await window.u2LoadVendorLibrary?.('mammoth');
                if (!window.mammoth?.extractRawText)
                    throw new Error('DOCX 解析组件未加载，请检查网络后重试');
                const result_2 = await window.mammoth.extractRawText({
                    arrayBuffer: await file_4.arrayBuffer(),
                });
                text_2 = String(result_2?.value || '');
            } else text_2 = String(await file_4.text());
            const normalized_2 = text_2
                .replace(
                    /\r\n?/g,
                    `
`,
                )
                .replace(/\u0000/g, '');
            if (!normalized_2.trim()) throw new Error('文件内容为空');
            return normalized_2;
        }
        themeCssImportInput &&
            themeCssImportButtons.length &&
            (themeCssImportButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    pendingThemeCssImportType =
                        button.getAttribute('data-theme-import-type') || getActiveThemeType();
                    themeCssImportInput.click();
                });
            }),
            themeCssImportInput.addEventListener('change', async () => {
                const value_474 = themeCssImportInput.files?.[0],
                    targetType_2 = pendingThemeCssImportType || getActiveThemeType();
                pendingThemeCssImportType = '';
                themeCssImportInput.value = '';
                if (!value_474) return;
                try {
                    const value_6 = await handleAction_104(value_474),
                        cssInput = getThemeCssInput(targetType_2);
                    if (!cssInput) throw new Error('未找到 CSS 编辑器');
                    if (
                        cssInput.value.trim() &&
                        !window.confirm('导入内容会替换当前未应用的 CSS，确定继续吗？')
                    )
                        return;
                    cssInput.value = value_6;
                    cssInput.dispatchEvent(
                        new Event('input', {
                            bubbles: true,
                        }),
                    );
                    showToast('CSS 已导入，请确认后点击应用');
                } catch (error_6) {
                    console.error('Failed to import Theme CSS', error_6);
                    showToast(error_6?.message || 'CSS 导入失败');
                }
            }));
        function handleAction_105(value_479, value_480, value_481) {
            if (!window.confirm('清空' + value_481 + '草稿？保存并应用后才会影响界面。')) return;
            if (value_480) value_480.value = '';
            handleAction_74(value_479);
            if (value_479 === 'chat') handleAction_67();
            if (value_479 === 'bubble') handleAction_79('bubble');
            showToast(value_481 + '草稿已清空，等待保存并应用');
        }
        function handleAction_106() {
            handleAction_105('home', homeCssInput, '首页与会话列表样式');
        }
        themeHomeClearBtn?.addEventListener('click', handleAction_106);
        themeBubbleClearBtn?.addEventListener('click', () =>
            handleAction_105('bubble', themeBubbleCssInput, '当前好友气泡样式'),
        );
        themeChatClearBtn?.addEventListener('click', () =>
            handleAction_105('chat', chatCssInput, '聊天页样式'),
        );
        themeGroupClearBtn?.addEventListener('click', () =>
            handleAction_105('group', groupCssInput, '群聊样式'),
        );
        function handleAction_107(value_482, template_2, successMessage) {
            value_482?.addEventListener('click', () => {
                navigator.clipboard
                    .writeText(template_2)
                    .then(() => {
                        showToast(successMessage);
                    })
                    ['catch']((error_7) => {
                        console.error('Copy failed', error_7);
                        showToast('复制失败');
                    });
            });
        }
        handleAction_107(
            themeHomeCopyBtn,
            `:scope {
  background: #ffffff;
}
:scope .line-header {
  background: rgba(255, 255, 255, 0.96);
}
:scope .line-content {
  color: #111111;
}
:scope .line-profile,
:scope .line-search-bar,
:scope .line-service-item,
:scope .line-list-item {
  background: #ffffff;
  border-color: #f2f2f7;
}
:scope .line-bottom-nav {
  background: rgba(255, 255, 255, 0.92);
}
:scope .chats-content,
:scope .chats-list-container {
  background: transparent;
}
:scope .chat-item {
  background: #ffffff;
  border-color: #f2f2f7;
}
:scope .chat-avatar {
  border-radius: 50%;
}
:scope .chat-name { color: #111111; }
:scope .chat-message,
:scope .chat-time { color: #8e8e93; }
:scope .chats-empty-state { color: #111111; }`,
            '已复制 Home 与 Chats 界面源码',
        );
        themeBubbleCopyBtn &&
            themeBubbleCopyBtn.addEventListener('click', () => {
                const bubbleTemplate = `/* iMessage 真实气泡源码（单聊文本气泡）
   运行时结构：.chat-row.user-row/.ai-row > .chat-bubble.user-bubble/.ai-bubble
   提示：在主题编辑器里，:scope 代表当前聊天页根节点 */

.chat-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
  transition: transform 0.2s, opacity 0.2s;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.chat-row:not(.has-prev) {
  margin-top: 10px;
}

.chat-row:first-child {
  margin-top: 0;
}

.chat-row.user-row {
  justify-content: flex-end;
}

.chat-row.ai-row {
  justify-content: flex-start;
}

.chat-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 20px;
  font-size: 15px;
  line-height: 1.4;
  word-wrap: break-word;
  white-space: pre-wrap;
  transition: border-radius 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.user-bubble {
  background-color: #2c2c2e;
  color: #fff;
  border-radius: 20px;
  position: relative;
}

.ai-bubble {
  background-color: #f2f2f7;
  color: #000;
  border-radius: 20px;
  position: relative;
}

/* 连续气泡圆角 */
.user-row.has-prev .user-bubble {
  border-top-right-radius: 4px;
}

.user-row.has-next .user-bubble {
  border-bottom-right-radius: 4px;
}

.ai-row.has-prev .ai-bubble {
  border-top-left-radius: 4px;
}

.ai-row.has-next .ai-bubble {
  border-bottom-left-radius: 4px;
}

/* 单聊消息头像与消息头
   这些节点由“显示头像”开关生成；运行时带内联初始值，因此这里使用 !important 方便主题覆盖 */
.chat-message-header {
  width: 100% !important;
  display: flex !important;
  align-items: flex-start !important;
  margin-bottom: 4px !important;
}

.chat-message-header.user-header {
  justify-content: flex-end !important;
}

.chat-message-header.ai-header {
  justify-content: flex-start !important;
}

.chat-message-header .chat-header-avatar {
  width: 44px !important;
  height: 44px !important;
  border: 1px solid #eee !important;
  border-radius: 50% !important;
  overflow: hidden !important;
  background: #fff !important;
  flex-shrink: 0 !important;
}

.chat-message-header .chat-header-avatar img {
  width: 100% !important;
  height: 100% !important;
  display: block;
  object-fit: cover !important;
}

.chat-message-header .chat-header-info {
  min-height: 44px;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}

.chat-message-header.user-header .chat-header-info {
  align-items: flex-end !important;
}

.chat-message-header.ai-header .chat-header-info {
  align-items: flex-start !important;
}

.chat-message-header .chat-header-name {
  margin-bottom: 2px !important;
  color: #333 !important;
  font-size: 14px !important;
  font-weight: 600 !important;
}

.chat-message-header .chat-header-date {
  color: #888 !important;
  font-size: 12px !important;
}

/* 群聊/多人消息的小头像 */
.chat-avatar-small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #e5e5ea;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #8e8e93;
}

.chat-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 单聊的每条实际消息都带一个隐藏头像节点，Theme 可按需显示。
   群聊继续使用原生的 .group-ai-avatar-slot，不使用这个节点。 */
.im-message-avatar {
  display: none;
  width: var(--im-message-avatar-size, 30px);
  height: var(--im-message-avatar-size, 30px);
  border-radius: var(--im-message-avatar-radius, 50%);
  overflow: hidden;
}

.im-message-avatar.is-user {
  /* 当前用户消息头像 */
}

.im-message-avatar.is-assistant {
  /* 单聊好友消息头像 */
}

.im-message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 单聊居中时间分隔 */
.chat-timestamp {
  display: flex;
  justify-content: center;
  margin: 16px 0 6px;
}

.chat-timestamp span {
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(0,0,0,0.2);
  color: #fff;
  font-size: 11px;
}

/* 单聊气泡内时间/已读 */
.bubble-meta {
  display: none;
  margin-left: 6px;
  font-size: 10px;
  opacity: 0.7;
  vertical-align: bottom;
}

.bubble-time {
  white-space: nowrap;
}

:scope.show-timestamps .bubble-meta {
  display: inline-flex;
  align-items: center;
}

.bubble-read-icon {
  margin-left: 3px;
  font-size: 10px;
  letter-spacing: 0;
}

:scope.timestamp-outside .chat-bubble {
  overflow: visible;
}

:scope.timestamp-outside .user-row .bubble-meta {
  position: absolute;
  left: 0;
  bottom: 4px;
  transform: translateX(-100%);
  margin-left: -6px;
  margin-top: 0;
  color: #8e8e93;
}

:scope.timestamp-outside .ai-row .bubble-meta {
  position: absolute;
  right: 0;
  bottom: 4px;
  transform: translateX(100%);
  margin-right: -6px;
  margin-top: 0;
  color: #8e8e93;
}

/* 单聊可见 COT 卡片 */
.chat-cot-row {
  width: 100%;
  margin: 6px 0;
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
}

.chat-cot-row.chat-cot-row-inline {
  margin: 2px 0 6px;
}

.chat-cot-card {
  width: fit-content;
  max-width: min(78%, 330px);
  overflow: hidden;
  border: 0;
  border-radius: 999px;
  background: rgba(242,242,247,0.94);
  color: #636366;
  box-sizing: border-box;
}

.chat-cot-card.is-expanded {
  width: min(78%, 330px);
  border-radius: 20px;
}

.chat-cot-toggle {
  width: 100%;
  min-height: 36px;
  padding: 7px 12px;
  border: 0;
  background: transparent;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font: inherit;
  cursor: pointer;
}

.chat-cot-title {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.chat-cot-chevron {
  flex: 0 0 auto;
  color: #8e8e93;
  font-size: 11px;
  transition: transform 0.2s ease;
}

.chat-cot-card.is-expanded .chat-cot-chevron {
  transform: rotate(180deg);
}

.chat-cot-content {
  padding: 0 12px 12px;
  color: #666;
  font-size: 13px;
  line-height: 1.58;
  white-space: pre-wrap;
  word-break: break-word;
  user-select: text;
  -webkit-user-select: text;
}

.chat-cot-content[hidden] {
  display: none;
}

.typing-row.im-cot-loading-row {
  margin-top: 10px;
}

.im-cot-loading-row .chat-cot-card {
  width: fit-content;
}

.im-cot-loading-row .chat-cot-toggle {
  cursor: default;
}

.im-cot-loading-dots {
  display: inline-flex;
  gap: 3px;
  margin-left: 3px;
}

.im-cot-loading-dots > span {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #8e8e93;
  animation: typingBounce 1.2s infinite ease-in-out;
}

.im-cot-loading-dots > span:nth-child(2) {
  animation-delay: 0.15s;
}

.im-cot-loading-dots > span:nth-child(3) {
  animation-delay: 0.3s;
}

/* 引用与翻译：实际由 JS 内联生成，这里给玩家可覆盖的真实 class */
.msg-reply-quote {
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 14px;
  margin-bottom: 8px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-bubble .msg-reply-quote {
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.15);
}

.ai-bubble .msg-reply-quote {
  color: rgba(0,0,0,0.6);
  background: rgba(0,0,0,0.05);
}

.msg-translation {
  margin-top: 6px;
  padding-top: 6px;
  font-size: 13px;
  line-height: 1.4;
  word-wrap: break-word;
  white-space: normal;
}

.user-bubble .msg-translation {
  border-top: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.7);
}

.ai-bubble .msg-translation {
  border-top: 1px solid rgba(0,0,0,0.1);
  color: #8e8e93;
}`;
                navigator.clipboard
                    .writeText(bubbleTemplate)
                    .then(() => {
                        if (window.showToast) window.showToast('已复制真实气泡源码');
                    })
                    ['catch']((value_487) => {
                        console.error('Copy failed', value_487);
                        if (window.showToast) window.showToast('复制失败');
                    });
            });
        themeChatCopyBtn &&
            themeChatCopyBtn.addEventListener('click', () => {
                const chatTemplate = `/* iMessage 真实单聊 Chat 源码
   运行时根节点：.active-chat-interface.im-chat-single
   提示：在主题编辑器里，:scope 代表当前单聊根节点 */

:scope {
  --im-chat-bg-color: #ffffff;
  --im-chat-bg-image: none;
  --im-chat-bg-size: cover;
  --im-chat-bg-position: center;
  --im-chat-bg-repeat: no-repeat;
  --im-chat-avatar-size: 44px;
  --im-chat-name-size: 16px;
  --im-chat-sign-size: 11px;
  --im-chat-status-dot-size: 7px;
  --im-chat-header-gap: 10px;
  --im-chat-header-left-offset: 12px;
  --im-chat-header-padding: 0 16px;
  --im-chat-header-bg: #ffffff;
  --im-chat-header-border: 1px solid #f2f2f7;
  --im-chat-input-container-bg: #ffffff;
  --im-chat-input-bg: #f2f2f7;
  --im-chat-input-radius: 22px;
  position: absolute;
  inset: 0;
  flex-direction: column;
  background-color: var(--im-chat-bg-color);
  background-image: var(--im-chat-bg-image);
  background-size: var(--im-chat-bg-size);
  background-position: var(--im-chat-bg-position);
  background-repeat: var(--im-chat-bg-repeat);
  z-index: 150;
  min-height: 0;
  overflow: hidden;
}

:scope.has-chat-bg {
  --im-chat-header-bg: #ffffff;
  --im-chat-header-border: 1px solid #f2f2f7;
  --im-chat-header-backdrop: none;
  --im-chat-input-container-bg: transparent;
}

.chat-sticky-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 20;
  padding-top: max(10px, env(safe-area-inset-top, 0px));
  padding-bottom: 10px;
  pointer-events: none;
}

.chat-sticky-container.is-friend {
  background: #ffffff;
  border-bottom: var(--im-chat-header-border, 1px solid #f2f2f7);
  padding-bottom: 5px;
}

.chat-sticky-container :where(
  .chat-back-btn,
  .im-chat-back-btn,
  .chat-call-btn,
  .chat-menu-btn,
  .chat-cancel-batch-btn,
  .im-chat-header-main,
  .im-chat-header-main *,
  .ins-chat-avatar,
  .ins-chat-avatar *
) {
  pointer-events: auto;
}

.chat-top-bar {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: var(--im-chat-header-padding);
  align-items: center;
  color: #000;
  font-size: 20px;
  z-index: 10;
  pointer-events: none;
}

.im-chat-top-bar {
  padding-left: var(--im-chat-header-left-offset) !important;
}

.im-chat-header-left,
.im-chat-actions,
.im-chat-input-actions {
  display: flex;
  align-items: center;
}

.im-chat-header-left {
  gap: var(--im-chat-header-gap);
  min-width: 0;
}

.im-chat-header-main {
  display: flex;
  align-items: center;
  min-width: 0;
}

.im-chat-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.ins-chat-avatar {
  width: var(--im-chat-avatar-size);
  height: var(--im-chat-avatar-size);
  border-radius: 50%;
  background-color: #f2f2f7;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8e8e93;
  overflow: hidden;
  margin: 0;
  flex-shrink: 0;
}

.ins-chat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.im-chat-title-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 8px;
  gap: 1px;
  min-width: 0;
}

.ins-chat-name {
  font-size: var(--im-chat-name-size);
  font-weight: 600;
  color: #000;
  line-height: 1.05;
}

.ins-chat-sign {
  font-size: var(--im-chat-sign-size);
  color: #8e8e93;
  margin-top: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 4px;
}

.im-chat-status-dot {
  width: var(--im-chat-status-dot-size);
  height: var(--im-chat-status-dot-size);
  border-radius: 50%;
  background: #34c759;
}

.chat-back-btn,
.chat-menu-btn,
.chat-call-btn {
  cursor: pointer;
  color: #000;
}

.ins-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 单聊消息头像与消息头
   由“显示头像”开关生成；运行时带内联初始值，因此使用 !important 方便主题覆盖 */
.chat-message-header {
  width: 100% !important;
  display: flex !important;
  align-items: flex-start !important;
  margin-bottom: 4px !important;
}

.chat-message-header.user-header {
  justify-content: flex-end !important;
}

.chat-message-header.ai-header {
  justify-content: flex-start !important;
}

.chat-message-header .chat-header-avatar {
  width: 44px !important;
  height: 44px !important;
  border: 1px solid #eee !important;
  border-radius: 50% !important;
  overflow: hidden !important;
  background: #fff !important;
  flex-shrink: 0 !important;
}

.chat-message-header .chat-header-avatar img {
  width: 100% !important;
  height: 100% !important;
  display: block;
  object-fit: cover !important;
}

.chat-message-header .chat-header-info {
  min-height: 44px;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}

.chat-message-header.user-header .chat-header-info {
  align-items: flex-end !important;
}

.chat-message-header.ai-header .chat-header-info {
  align-items: flex-start !important;
}

.chat-message-header .chat-header-name {
  margin-bottom: 2px !important;
  color: #333 !important;
  font-size: 14px !important;
  font-weight: 600 !important;
}

.chat-message-header .chat-header-date {
  color: #888 !important;
  font-size: 12px !important;
}

/* 单聊每条实际消息的隐藏头像钩子；没有设置开关，由 Theme CSS 自行决定是否显示。 */
.im-message-avatar {
  display: none;
  width: var(--im-message-avatar-size, 30px);
  height: var(--im-message-avatar-size, 30px);
  border-radius: var(--im-message-avatar-radius, 50%);
  overflow: hidden;
}

.im-message-avatar.is-user { /* 当前用户消息头像 */ }
.im-message-avatar.is-assistant { /* 单聊好友消息头像 */ }
.im-message-avatar img { width: 100%; height: 100%; object-fit: cover; }

/* 单聊时间戳：居中分隔时间、气泡内时间和外置时间 */
.chat-timestamp {
  display: flex;
  justify-content: center;
  margin: 16px 0 6px;
}

.chat-timestamp span {
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(0,0,0,0.2);
  color: #fff;
  font-size: 11px;
}

.bubble-meta {
  display: none;
  margin-left: 6px;
  font-size: 10px;
  opacity: 0.7;
  vertical-align: bottom;
}

.bubble-time {
  white-space: nowrap;
}

:scope.show-timestamps .bubble-meta {
  display: inline-flex;
  align-items: center;
}

.bubble-read-icon {
  margin-left: 3px;
  font-size: 10px;
  letter-spacing: 0;
}

:scope.timestamp-outside .chat-bubble {
  overflow: visible;
}

:scope.timestamp-outside .user-row .bubble-meta {
  position: absolute;
  left: 0;
  bottom: 4px;
  transform: translateX(-100%);
  margin-left: -6px;
  color: #8e8e93;
}

:scope.timestamp-outside .ai-row .bubble-meta {
  position: absolute;
  right: 0;
  bottom: 4px;
  transform: translateX(100%);
  margin-right: -6px;
  color: #8e8e93;
}

/* 单聊可见 COT 卡片 */
.chat-cot-row {
  width: 100%;
  margin: 6px 0;
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
}

.chat-cot-row.chat-cot-row-inline {
  margin: 2px 0 6px;
}

.chat-cot-card {
  width: fit-content;
  max-width: min(78%, 330px);
  overflow: hidden;
  border: 0;
  border-radius: 999px;
  background: rgba(242,242,247,0.94);
  color: #636366;
  box-sizing: border-box;
}

.chat-cot-card.is-expanded {
  width: min(78%, 330px);
  border-radius: 20px;
}

.chat-cot-toggle {
  width: 100%;
  min-height: 36px;
  padding: 7px 12px;
  border: 0;
  background: transparent;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font: inherit;
  cursor: pointer;
}

.chat-cot-title {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.chat-cot-chevron {
  flex: 0 0 auto;
  color: #8e8e93;
  font-size: 11px;
  transition: transform 0.2s ease;
}

.chat-cot-card.is-expanded .chat-cot-chevron {
  transform: rotate(180deg);
}

.chat-cot-content {
  padding: 0 12px 12px;
  color: #666;
  font-size: 13px;
  line-height: 1.58;
  white-space: pre-wrap;
  word-break: break-word;
  user-select: text;
  -webkit-user-select: text;
}

.chat-cot-content[hidden] {
  display: none;
}

.typing-row.im-cot-loading-row {
  margin-top: 10px;
}

.im-cot-loading-row .chat-cot-card {
  width: fit-content;
}

.im-cot-loading-row .chat-cot-toggle {
  cursor: default;
}

.im-cot-loading-dots {
  display: inline-flex;
  gap: 3px;
  margin-left: 3px;
}

.im-cot-loading-dots > span {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #8e8e93;
  animation: typingBounce 1.2s infinite ease-in-out;
}

.im-cot-loading-dots > span:nth-child(2) {
  animation-delay: 0.15s;
}

.im-cot-loading-dots > span:nth-child(3) {
  animation-delay: 0.3s;
}

.ins-chat-input-container {
  width: 100%;
  padding: 10px 16px 8px;
  padding-bottom: max(12px, env(safe-area-inset-bottom, 0px));
  background-color: var(--im-chat-input-container-bg, #ffffff);
  border-top: none;
  z-index: 30;
  box-sizing: border-box;
}

.keyboard-open .ins-chat-input-container {
  padding: 8px 12px;
}

.ins-chat-input-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--im-chat-input-bg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--im-chat-input-radius);
  padding: 6px 12px;
  gap: 10px;
}

.ins-message-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  padding: 8px 0;
  min-width: 0;
  color: #111;
}

.ins-input-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #007aff;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  flex-shrink: 0;
}

.im-chat-input-actions {
  gap: 8px;
}

.send-btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  border: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.16s ease, transform 0.16s ease, opacity 0.16s ease;
}

.send-btn-icon:active {
  transform: scale(0.94);
}

.send-btn {
  background: transparent;
  color: #8e8e93;
  font-size: 16px;
}

.send-btn:active {
  background: transparent;
  color: #636366;
}

.mic-btn {
  background: #111111;
  color: #ffffff;
}

.mic-btn:active {
  background: #2c2c2e;
}

/* =========================================================
   消息卡片通用层
   结构：.chat-row > .chat-bubble.im-card-bubble > .im-card-content
   ========================================================= */
.chat-row .chat-bubble.im-card-bubble {
  width: auto !important;
  min-width: 0 !important;
  max-width: min(70%, 260px) !important;
  flex: 0 1 auto !important;
  white-space: normal !important;
  box-sizing: border-box !important;
}

.chat-row .chat-bubble.im-card-bubble .im-card-content {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
}

:scope.timestamp-outside .pay-transfer-bubble .bubble-meta { bottom: 12px; }

/* 图片卡片 */
.chat-row .chat-bubble.image-message-bubble { max-width: min(62vw, 204px) !important; padding: 0; background: transparent; }
.chat-image-bubble-img { width: min(56vw, 200px) !important; height: min(56vw, 200px) !important; max-width: 200px !important; max-height: 200px !important; display: block; object-fit: cover; border-radius: 18px; }

/* 转账、亲属卡与收款凭证 */
.pay-transfer-bubble { padding: 4px 6px !important; min-width: 156px; max-width: min(56vw, 210px) !important; background: transparent !important; color: #111 !important; }
.pay-transfer-bubble .bubble-meta { margin-top: 4px; }
.pay-transfer-card { padding: 11px 12px; border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,248,250,0.98)); color: #111; }
.pay-transfer-card.is-received { background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,249,246,0.98)); }
.pay-transfer-card.is-income { background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,247,255,0.98)); }
.pay-transfer-card.is-pending { background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(249,249,251,0.98)); cursor: pointer; }
.pay-transfer-card.is-rejected { opacity: 0.72; }
.pay-transfer-card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.pay-transfer-card-icon { width: 28px; height: 28px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 10px; background: #111; color: #fff; font-size: 12px; }
.pay-transfer-card-meta { min-width: 0; flex: 1; }
.pay-transfer-card-title { color: #111; font-size: 12px; font-weight: 700; line-height: 1.1; }
.pay-transfer-card-subtitle { margin-top: 2px; overflow: hidden; color: #8e8e93; font-size: 10px; white-space: nowrap; text-overflow: ellipsis; }
.pay-transfer-card-amount { margin-bottom: 4px; color: #111; font-size: 20px; font-weight: 700; line-height: 1.05; letter-spacing: -0.03em; }
.pay-transfer-card-desc { margin-bottom: 0; color: #636366; font-size: 11px; line-height: 1.35; word-break: break-word; }
.pay-receipt-card { width: min(76vw, 280px) !important; max-width: 280px !important; padding: 16px; border-radius: 12px; background: #fff; color: #111; box-sizing: border-box; }

/* 语音卡片 */
.voice-message-bubble { min-width: 0; max-width: min(70%, 240px) !important; padding: 10px 14px; overflow: visible; }
.voice-message-bubble-inner { width: auto; min-height: 0; display: flex; align-items: center; gap: 8px; padding: 0; border: 0; border-radius: 0; background: transparent; color: inherit; cursor: pointer; font: inherit; text-align: left; }
.voice-message-mic { display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: inherit; font-size: 14px; }
.voice-message-wave { display: flex; align-items: center; gap: 3px; min-width: 0; }
.voice-message-wave span { display: block; width: 3px; border-radius: 999px; background: currentColor; opacity: 0.82; }
.voice-message-duration { font-size: 12px; font-weight: 700; line-height: 1; white-space: nowrap; opacity: 0.76; }
.voice-message-transcript { margin-top: 7px; padding-top: 7px; border-top: 1px solid rgba(255,255,255,0.22); font-size: 13px; line-height: 1.45; white-space: normal; word-break: break-word; }
.ai-bubble .voice-message-transcript { color: #2c2c2e; border-top-color: rgba(0,0,0,0.12); }

/* 贴纸 */
.sticker-message-wrap { width: auto !important; max-width: min(44vw, 150px) !important; display: inline-flex; flex-direction: column; align-items: flex-end; padding: 0; background: transparent; }
.ai-row .sticker-message-wrap { align-items: flex-start; }
.sticker-message-img { width: auto !important; max-width: min(40vw, 132px) !important; max-height: min(40vw, 132px) !important; display: block; object-fit: contain; background: transparent; }
.sticker-message-meta { margin-top: 3px; color: #8e8e93; text-shadow: none; }
.sticker-group-wrap { max-width: min(78%, 190px); }

/* 朋友圈转发卡片 */
.moment-forward-bubble { width: min(62vw, 220px) !important; min-width: 0 !important; max-width: min(62vw, 220px) !important; display: flex; align-items: center; gap: 12px; margin: 4px 0; padding: 10px !important; border: 1px solid #e5e5ea !important; border-radius: 16px; background: #fff !important; color: #111; box-sizing: border-box; cursor: pointer; }

/* 链接卡片 */
.chat-link-card { width: min(64vw, 228px); overflow: hidden; border: 1px solid rgba(0,0,0,0.07); border-radius: 15px; background: #fbfbfd; color: #111; cursor: pointer; text-align: left; }
.chat-link-card-cover { height: 74px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: linear-gradient(135deg, #1c1c1e, #6b6b70); color: #fff; font-size: 22px; }
.chat-link-card-cover img { width: 100%; height: 100%; display: block; object-fit: cover; }
.chat-link-card-body { padding: 9px 10px 10px; }
.chat-link-card-platform { color: var(--link-card-color, #3a3a3c); font-size: 9px; font-weight: 900; letter-spacing: 0.05em; text-transform: uppercase; }
.chat-link-card-title { margin-top: 3px; overflow: hidden; color: #111; font-size: 13px; font-weight: 800; line-height: 1.32; word-break: break-word; }
.chat-link-card-summary { margin-top: 5px; overflow: hidden; color: #636366; font-size: 10px; line-height: 1.38; word-break: break-word; }
.chat-link-card-footer { margin-top: 8px; padding-top: 7px; display: flex; align-items: center; justify-content: space-between; gap: 8px; border-top: 1px solid #f2f2f7; color: #8e8e93; font-size: 9px; }
.chat-link-card-footer span { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

/* HTML / Loves 自定义卡片 */
.html-bubble.im-card-bubble { position: relative; max-width: min(72%, 260px) !important; padding: 0; background: transparent; }
.html-bubble.im-card-bubble > * { max-width: 100% !important; box-sizing: border-box !important; }
.html-bubble.im-card-bubble .loves-invite-bubble { width: min(62vw, 220px) !important; max-width: 100% !important; box-sizing: border-box !important; }

/* 通话记录与线下见面记录 */
.voice-call-record-bubble { min-width: 176px !important; padding: 0; background: transparent; }
.voice-call-record-card { display: flex; align-items: center; gap: 10px; overflow: hidden; padding: 10px 14px; border-radius: 18px; background: #f2f2f7; color: #111; cursor: pointer; }
.offline-meeting-record-card { max-width: 84%; padding: 11px 15px; align-items: flex-start; background: rgba(0,0,0,0.05); text-align: left; }

/* 系统通知、撤回提示与群私聊入口 */
.chat-system-row { width: 100%; display: flex; justify-content: center; }
.system-notice-card { max-width: 80%; padding: 10px 16px; border-radius: 18px; background: rgba(0,0,0,0.05); color: #000; font-size: 13px; line-height: 1.4; }
.system-notice-narration { text-align: left; cursor: pointer; }
.system-notice-default,
.system-notice-offline_meeting_active { text-align: center; }
.message-recalled-notice { color: #8e8e93; font-size: 12px; text-align: center; }
.message-recalled-view-link { margin-left: 6px; color: #007aff; cursor: pointer; }
}`;
                navigator.clipboard
                    .writeText(chatTemplate)
                    .then(() => {
                        if (window.showToast) window.showToast('已复制真实单聊 Chat 源码');
                    })
                    ['catch']((value_489) => {
                        console.error('Copy failed', value_489);
                        if (window.showToast) window.showToast('复制失败');
                    });
            });
        themeGroupCopyBtn &&
            themeGroupCopyBtn.addEventListener('click', () => {
                const groupTemplate = `/* iMessage Group CSS source
   Runtime root: .active-chat-interface.im-chat-group
   In this editor, :scope represents that group-chat root only. */

:scope {
  --group-chat-bg: #ffffff;
  --group-chat-header-bg: #ffffff;
  --group-chat-input-bg: #ffffff;
  --group-chat-accent: #007aff;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: var(--group-chat-bg);
}

:scope .chat-sticky-container.is-group {
  background: var(--group-chat-header-bg);
  border-bottom: 1px solid #e5e5ea;
  z-index: 20;
}

:scope .im-chat-group-title-wrap { color: #111; }
:scope .group-header-right-avatar { border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.16); }
:scope .ins-chat-messages { flex: 1; min-height: 0; background: transparent; }
:scope .ins-chat-input-container { background: var(--group-chat-input-bg); border-top: 1px solid #e5e5ea; }

:scope .group-ai-bubble-wrap { display: flex; align-items: flex-end; gap: 8px; }
:scope .group-ai-speaker-name { color: #6d6d72; font-size: 12px; }
:scope .group-ai-bubble-row { align-items: flex-end; }
:scope .group-ai-avatar-slot { width: 34px; height: 34px; }
:scope .group-ai-avatar-placeholder { background: #e5e5ea; color: #6d6d72; }

:scope .group-poll-card { width: min(232px, 64vw); border: 1px solid #e5e5ea; background: #fff; }
:scope .group-poll-card-head { padding: 13px 14px 8px; }
:scope .group-poll-card-kicker { color: var(--group-chat-accent); }
:scope .group-poll-card-title { color: #111; }
:scope .group-poll-card-options { padding: 0 10px; }
:scope .group-poll-card-option { border-color: #e5e5ea; }
:scope .group-poll-card-option.is-user-selected { border-color: var(--group-chat-accent); }
:scope .group-poll-radio { border-color: #8e8e93; }
:scope .group-poll-card-option.is-user-selected .group-poll-radio { border-color: var(--group-chat-accent); }
:scope .group-poll-voters, :scope .group-poll-voter { color: #6d6d72; }
:scope .group-poll-card-footer { color: #8e8e93; }

:scope .group-red-packet-card, :scope .group-red-packet-bubble { background: #fa9d3b; color: #fff; }
:scope .group-red-packet-card .group-red-packet-amount { color: #fff7dd; }
:scope .group-red-packet-card .group-red-packet-footer { color: rgba(255,255,255,.72); }

:scope .chat-system-row .system-notice-card,
:scope .group-system-notice-card,
:scope .system-notice-group_join,
:scope .system-notice-group_left,
:scope .system-notice-red_packet_claim { background: rgba(142,142,147,.14); color: #6d6d72; }
:scope .group-private-chat-view-link { color: var(--group-chat-accent); }
`;
                navigator.clipboard
                    .writeText(groupTemplate)
                    .then(() => {
                        if (window.showToast) window.showToast('已复制 Group CSS 源码');
                    })
                    ['catch']((value_491) => {
                        console.error('Copy failed', value_491);
                        if (window.showToast) window.showToast('复制失败');
                    });
            });
        const text_108 = `/* iMessage 真实状态资料卡源码（仅单聊）
   运行时根节点：.chat-profile-panel-overlay
   提示：在状态栏 CSS 编辑器里，:scope 代表当前好友的资料卡遮罩层。 */

:scope {
  background: rgba(0, 0, 0, 0.22);
  padding: calc(88px + env(safe-area-inset-top, 0px)) 16px 24px;
}

:scope .chat-profile-panel-card {
  width: min(100%, 320px);
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.18);
}

:scope .gmp-header,
:scope .chat-profile-panel-header {
  height: 88px;
  background: linear-gradient(180deg, #f2f2f7 0%, #ffffff 100%);
}

:scope .gmp-avatar-wrapper {
  bottom: -34px;
  left: 18px;
}

:scope .gmp-avatar {
  width: 66px;
  height: 66px;
  border: 3px solid #ffffff;
  background: #e5e5ea;
}

:scope .gmp-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:scope .gmp-status-bubble {
  border: 1px solid #e5e5ea;
  border-radius: 14px;
  background: #ffffff;
  color: #333333;
  padding: 4px 10px;
  font-size: 12px;
}

:scope .chat-profile-panel-close {
  background: rgba(255, 255, 255, 0.92);
  color: #111111;
}

:scope .gmp-body,
:scope .chat-profile-panel-body {
  padding: 46px 16px 16px;
}

:scope .gmp-name {
  color: #000000;
  font-size: 18px;
  font-weight: 700;
}

:scope .gmp-signature,
:scope .chat-profile-panel-section-label {
  color: #8e8e93;
}

:scope .chat-profile-panel-content {
  max-height: min(40vh, 320px);
  overflow-y: auto;
}

:scope .chat-profile-panel-thought {
  min-height: 108px;
  color: #222222;
  white-space: pre-wrap;
  word-break: break-word;
}

:scope .gmp-inner-voice {
  border-radius: 16px;
  background: #f2f2f7;
  color: #333333;
  padding: 10px 12px;
}

:scope .chat-profile-panel-meta-row {
  color: #8e8e93;
}
`;
        handleAction_107(themeStatusCopyBtn, text_108, '已复制真实状态栏 CSS 源码');
        function handleAction_109() {
            return (
                (themeState_2.imessageStatusTemplatePresets = handleAction_56(
                    themeState_2.imessageStatusTemplatePresets,
                )),
                themeState_2.imessageStatusTemplatePresets
            );
        }
        async function handleAction_110(value_492) {
            return (
                (themeState_2.imessageStatusTemplatePresets = handleAction_56(value_492)),
                (window.u2ThemeState = themeState_2),
                saveGlobalData()
            );
        }
        function handleAction_111() {
            if (!themeStatusPresetList) return;
            const handleAction_109_493 = handleAction_109(),
                value_494 = themeStatusPresetList.value;
            themeStatusPresetList.replaceChildren(new Option('选择预设', ''));
            handleAction_109_493.forEach((value_495) =>
                themeStatusPresetList.add(new Option(value_495.name, value_495.id)),
            );
            themeStatusPresetList.value = handleAction_109_493.some(
                (value_496) => value_496.id === value_494,
            )
                ? value_494
                : '';
            const themeStatusPresetDeleteBtnElement = document.getElementById(
                'theme-status-preset-delete-btn',
            );
            if (themeStatusPresetDeleteBtnElement)
                themeStatusPresetDeleteBtnElement.disabled = !themeStatusPresetList.value;
            if (themeStatusPresetList.dataset.bound === 'true') return;
            themeStatusPresetList.dataset.bound = 'true';
            themeStatusPresetList.addEventListener('change', () => {
                const result_497 = handleAction_109().find(
                    (value_498) => value_498.id === themeStatusPresetList.value,
                );
                if (themeStatusPresetDeleteBtnElement)
                    themeStatusPresetDeleteBtnElement.disabled = !result_497;
                if (!result_497) return;
                if (themeFontUrlInput_4) themeFontUrlInput_4.value = result_497.prompt;
                if (themeFontUrlInput_5) themeFontUrlInput_5.value = result_497.regex;
                if (themeFontUrlInput_6) themeFontUrlInput_6.value = result_497.html;
                handleAction_74('status');
                showToast('已载入状态栏模板预设“' + result_497.name + '”，请保存并应用');
            });
            themeStatusPresetDeleteBtnElement?.addEventListener('click', async () => {
                const value_499 = themeStatusPresetList.value,
                    result_500 = handleAction_109().find((value_502) => value_502.id === value_499);
                if (!result_500 || !window.confirm('删除预设“' + result_500.name + '”？')) return;
                const value_501 = await handleAction_110(
                    handleAction_109().filter((value_503) => value_503.id !== value_499),
                );
                if (!value_501) {
                    showToast('删除状态栏模板预设失败');
                    return;
                }
                handleAction_111();
                showToast('状态栏模板预设已删除');
            });
        }
        async function handleAction_112() {
            const name_3 = String(themeFontUrlInput_2?.value || '').trim();
            if (!name_3) {
                showToast('请输入预设名字');
                return;
            }
            const validateStatusTemplate_505 = window.imApp?.validateStatusTemplate?.(
                handleAction_87(true),
            );
            if (!validateStatusTemplate_505?.valid) {
                showToast(validateStatusTemplate_505?.error || '状态栏模板校验失败');
                return;
            }
            const presets_2 = handleAction_109(),
                options_507 = {
                    id: 'status-template-preset-' + Date.now(),
                    name: name_3,
                    prompt: validateStatusTemplate_505.template.prompt,
                    regex: validateStatusTemplate_505.template.regex,
                    html: validateStatusTemplate_505.template.html,
                },
                existingIndex = presets_2.findIndex((p) => p.name === name_3);
            if (existingIndex >= 0) options_507.id = presets_2[existingIndex].id;
            const value_508 =
                existingIndex >= 0
                    ? presets_2.map((value_510, value_511) =>
                          value_511 === existingIndex ? options_507 : value_510,
                      )
                    : [...presets_2, options_507];
            if (!(await handleAction_110(value_508))) {
                showToast('预设“' + name_3 + '”保存失败');
                return;
            }
            if (themeFontUrlInput_2) themeFontUrlInput_2.value = '';
            handleAction_111();
            showToast('预设“' + name_3 + '”已保存');
        }
        themeStatusSaveBtn?.addEventListener('click', () => {
            void handleAction_112();
        });
        function handleAction_113(value_512) {
            return (
                (themeState_2.imessageCssPresets = normalizeImessageCssPresets(
                    themeState_2.imessageCssPresets,
                )),
                themeState_2.imessageCssPresets[value_512] || []
            );
        }
        async function handleAction_114(type_4, presets_3) {
            return (
                (themeState_2.imessageCssPresets = {
                    ...normalizeImessageCssPresets(themeState_2.imessageCssPresets),
                    [type_4]: normalizeImessageCssPresets({
                        [type_4]: presets_3,
                    })[type_4],
                }),
                (window.u2ThemeState = themeState_2),
                saveGlobalData()
            );
        }
        function handleAction_115(value_515, value_516, assistiveBallEl_3) {
            if (!value_516) return;
            const handleAction_113_518 = handleAction_113(value_515);
            value_516.replaceChildren(new Option('选择预设', ''));
            handleAction_113_518.forEach((value_522) =>
                value_516.add(new Option(value_522.name, value_522.id)),
            );
            const result_519 = handleAction_113_518.find(
                (value_523) => value_523.css === assistiveBallEl_3?.value,
            );
            value_516.value = result_519?.id || '';
            const value_520 =
                    value_515 === 'status'
                        ? 'theme-status-css-preset-delete-btn'
                        : 'theme-' + value_515 + '-preset-delete-btn',
                elementById_521 = document.getElementById(value_520);
            if (elementById_521) elementById_521.disabled = !value_516.value;
            if (value_516.dataset.bound === 'true') return;
            value_516.dataset.bound = 'true';
            value_516.addEventListener('change', () => {
                const assistiveDragState_2 = handleAction_113(value_515).find(
                    (value_525) => value_525.id === value_516.value,
                );
                if (elementById_521) elementById_521.disabled = !assistiveDragState_2;
                if (!assistiveDragState_2 || !assistiveBallEl_3) return;
                assistiveBallEl_3.value = assistiveDragState_2.css;
                if (value_515 === 'chat') handleAction_67();
                else handleAction_74(value_515);
                if (value_515 === 'bubble') handleAction_79('bubble');
                showToast('已载入预设“' + assistiveDragState_2.name + '”，请保存并应用');
            });
            elementById_521?.addEventListener('click', async () => {
                const value_526 = value_516.value,
                    result_527 = handleAction_113(value_515).find(
                        (value_529) => value_529.id === value_526,
                    );
                if (!result_527 || !window.confirm('删除预设“' + result_527.name + '”？')) return;
                const value_528 = await handleAction_114(
                    value_515,
                    handleAction_113(value_515).filter((value_530) => value_530.id !== value_526),
                );
                value_528
                    ? (handleAction_116(handleAction_83() || window.imData?.currentSettingsFriend),
                      showToast('预设已删除'))
                    : showToast('预设删除失败');
            });
        }
        function handleAction_116(
            value_531 = handleAction_83() || window.imData?.currentSettingsFriend,
        ) {
            handleAction_115('bubble', themeBubblePresetList, themeBubbleCssInput);
            handleAction_115('home', themeHomePresetList, homeCssInput);
            handleAction_115('chat', themeChatPresetList, chatCssInput);
            handleAction_115('group', themeGroupPresetList, groupCssInput);
            handleAction_115('status', themeStatusCssPresetListElement, themeStatusCssInput);
            handleAction_111();
        }
        function handleAction_117(type_5, value_533, value_534, value_535, value_536) {
            value_533 &&
                value_533.addEventListener('click', async () => {
                    let cssInput_2;
                    if (type_5 === 'home') cssInput_2 = homeCssInput;
                    else {
                        if (type_5 === 'bubble') cssInput_2 = themeBubbleCssInput;
                        else {
                            if (type_5 === 'chat') cssInput_2 = chatCssInput;
                            else {
                                if (type_5 === 'group') cssInput_2 = groupCssInput;
                                else {
                                    if (type_5 === 'status') cssInput_2 = themeStatusCssInput;
                                }
                            }
                        }
                    }
                    const name_4 = value_534 ? value_534.value.trim() : '',
                        css_2 = cssInput_2 ? cssInput_2.value.trim() : '';
                    if (!name_4) {
                        if (window.showToast) window.showToast('请输入预设名字');
                        return;
                    }
                    if (!css_2) {
                        if (window.showToast) window.showToast('CSS 代码不能为空');
                        return;
                    }
                    const presets_4 = handleAction_113(type_5),
                        existingIndex_2 = presets_4.findIndex((p_2) => p_2.name === name_4);
                    existingIndex_2 >= 0
                        ? (presets_4[existingIndex_2] = {
                              ...presets_4[existingIndex_2],
                              css: css_2,
                          })
                        : presets_4.push({
                              id: type_5 + '-preset-' + Date.now(),
                              name: name_4,
                              css: css_2,
                          });
                    const value_542 = await handleAction_114(type_5, presets_4);
                    if (!value_542) {
                        if (window.showToast) window.showToast('预设 "' + name_4 + '" 保存失败');
                        return;
                    }
                    handleAction_116(handleAction_83() || window.imData?.currentSettingsFriend);
                    if (value_534) value_534.value = '';
                    if (window.showToast) window.showToast('预设 "' + name_4 + '" 已保存');
                });
            value_535 && handleAction_115(type_5, value_535, value_536);
        }
        handleAction_117(
            'home',
            themeHomeSaveBtn,
            themeHomePresetName,
            themeHomePresetList,
            homeCssInput,
        );
        handleAction_117(
            'bubble',
            themeBubbleSaveBtn,
            themeBubblePresetName,
            themeBubblePresetList,
            themeBubbleCssInput,
        );
        handleAction_117(
            'chat',
            themeChatSaveBtn,
            themeChatPresetName,
            themeChatPresetList,
            chatCssInput,
        );
        handleAction_117(
            'group',
            themeGroupSaveBtn,
            themeGroupPresetName,
            themeGroupPresetList,
            groupCssInput,
        );
        handleAction_117(
            'status',
            themeStatusCssSaveBtnElement,
            themeStatusCssPresetNameElement,
            themeStatusCssPresetListElement,
            themeStatusCssInput,
        );
        function getThemeFontActiveSurfaceFor_2(value_544) {
            if (typeof window.mobileInputCompat?.isSendEnter === 'function')
                return window.mobileInputCompat.isSendEnter(value_544);
            return (
                value_544?.key === 'Enter' &&
                !value_544.isComposing &&
                value_544.keyCode !== 229 &&
                !value_544.shiftKey &&
                !value_544.ctrlKey &&
                !value_544.metaKey &&
                !value_544.altKey
            );
        }
        function handleAction_119(input_2, themeImportFileInput_546) {
            if (!input_2 || !themeImportFileInput_546) return;
            input_2.setAttribute('enterkeyhint', 'done');
            const onSend_2 = () => themeImportFileInput_546.click();
            if (typeof window.mobileInputCompat?.register === 'function') {
                window.mobileInputCompat.register({
                    input: input_2,
                    onSend: onSend_2,
                    enterKeyHint: 'done',
                    blurAfterSend: false,
                    restoreWindowScroll: false,
                });
                return;
            }
            input_2.addEventListener('keydown', (surface_2) => {
                if (!getThemeFontActiveSurfaceFor_2(surface_2)) return;
                surface_2.preventDefault();
                if (!String(input_2.value || '').trim()) return;
                onSend_2();
            });
        }
        [
            [themeHomePresetName, themeHomeSaveBtn],
            [themeChatPresetName, themeChatSaveBtn],
            [themeBubblePresetName, themeBubbleSaveBtn],
            [themeGroupPresetName, themeGroupSaveBtn],
            [themeFontUrlInput_2, themeStatusSaveBtn],
            [themeStatusCssPresetNameElement, themeStatusCssSaveBtnElement],
        ].forEach(([value_549, value_550]) => handleAction_119(value_549, value_550));
        themeFontUrlInput_5?.setAttribute('enterkeyhint', 'next');
        themeFontUrlInput_5?.addEventListener('keydown', (surface_3) => {
            if (!getThemeFontActiveSurfaceFor_2(surface_3)) return;
            surface_3.preventDefault();
            themeFontUrlInput_6?.focus({
                preventScroll: true,
            });
        });
        window.imApp = window.imApp || {};
        window.imApp.refreshChatThemePresetUi = () => {};
        const value_120 = new Set([
            'status_template',
            'status_css',
            'home_css',
            'chat_css',
            'bubble_css',
            'group_css',
        ]);
        function handleAction_121(value_552) {
            if (!value_552) return null;
            const value_553 = window.imApp?.getFriendById?.(value_552) || null;
            return value_553 && value_553.type === 'char' ? value_553 : null;
        }
        function handleAction_122(value_554) {
            return clonePlainData(value_554 == null ? null : value_554);
        }
        function getSnapshot_2(value_555, value_556 = '') {
            if (!value_120.has(value_555)) return null;
            if (value_555 === 'home_css')
                return {
                    css: themeState_2.imessageHomeCss || '',
                    enabled: themeState_2.imessageHomeCssEnabled === true,
                };
            if (value_555 === 'chat_css')
                return {
                    css: themeState_2.imessageChatCss || '',
                    enabled: themeState_2.imessageChatCssEnabled === true,
                };
            if (value_555 === 'group_css')
                return {
                    css: themeState_2.imessageGroupCss || '',
                    enabled: themeState_2.imessageGroupCssEnabled === true,
                };
            const handleAction_121_557 = handleAction_121(value_556);
            if (!handleAction_121_557) return null;
            if (value_555 === 'bubble_css')
                return {
                    css: handleAction_121_557.customCss || '',
                    enabled: handleAction_121_557.customCssEnabled === true,
                };
            if (value_555 === 'status_css')
                return {
                    css: handleAction_121_557.statusCss || '',
                    prompt: handleAction_121_557.statusCssPrompt || '',
                    enabled: handleAction_121_557.statusCssEnabled === true,
                    renderMode: handleAction_121_557.statusRenderMode || 'default',
                };
            return {
                template: handleAction_122(
                    handleAction_121_557.statusTemplate || handleAction_81(),
                ),
                renderMode: handleAction_121_557.statusRenderMode || 'default',
            };
        }
        function fingerprint_2(root_2, options_4 = '') {
            const addedSize_2 = getSnapshot_2(root_2, options_4);
            return addedSize_2 ? JSON.stringify(addedSize_2) : '';
        }
        function validate_2(value_561, value_562 = {}) {
            if (!value_120.has(value_561))
                return {
                    valid: false,
                    error: '不支持的主题作品类型',
                };
            if (value_561 === 'status_template') {
                const validateStatusTemplate_564 = window.imApp?.validateStatusTemplate?.({
                    enabled: true,
                    prompt: value_562.prompt,
                    regex: value_562.regex,
                    html: value_562.html,
                });
                return validateStatusTemplate_564?.valid
                    ? {
                          valid: true,
                          payload: validateStatusTemplate_564.template,
                      }
                    : {
                          valid: false,
                          error: validateStatusTemplate_564?.error || '状态栏模板校验失败',
                      };
            }
            const css_3 = String(value_562.css || '').slice(0, 50000);
            if (!css_3.trim())
                return {
                    valid: false,
                    error: 'CSS 代码为空',
                };
            if (/<\/?(?:script|iframe|object|embed)\b/i.test(css_3))
                return {
                    valid: false,
                    error: 'CSS 中包含不允许的 HTML 内容',
                };
            if (/@import\b|(?:javascript|vbscript):|expression\s*\(/i.test(css_3))
                return {
                    valid: false,
                    error: 'CSS 中包含不允许的外部导入或脚本表达式',
                };
            return {
                valid: true,
                payload:
                    value_561 === 'status_css'
                        ? {
                              css: css_3,
                              prompt: String(value_562.prompt || '')
                                  .trim()
                                  .slice(0, 8000),
                          }
                        : {
                              css: css_3,
                          },
            };
        }
        async function apply_2(root_3, options_5, options_6 = '') {
            const addedSize_3 = validate_2(root_3, options_5);
            if (!addedSize_3.valid) throw new Error(addedSize_3.error);
            const previousSnapshot_2 = getSnapshot_2(root_3, options_6);
            if (
                ['bubble_css', 'status_css', 'status_template'].includes(root_3) &&
                !previousSnapshot_2
            )
                throw new Error('请选择要应用的普通单聊角色');
            if (root_3 === 'home_css' || root_3 === 'chat_css' || root_3 === 'group_css') {
                const options_570 = {
                        home_css: [
                            'imessageHomeCss',
                            'imessageHomeCssEnabled',
                            'applyGlobalHomeCss',
                        ],
                        chat_css: [
                            'imessageChatCss',
                            'imessageChatCssEnabled',
                            'applyGlobalChatCss',
                        ],
                        group_css: [
                            'imessageGroupCss',
                            'imessageGroupCssEnabled',
                            'applyGlobalGroupCss',
                        ],
                    },
                    [value_571, value_572, value_573] = options_570[root_3];
                themeState_2[value_571] = addedSize_3.payload.css;
                themeState_2[value_572] = true;
                window.u2ThemeState = themeState_2;
                window.imApp?.[value_573]?.(themeState_2);
                if (!(await saveGlobalData())) throw new Error('主题保存失败');
            } else {
                const handleAction_121_574 = handleAction_121(options_6),
                    value_575 = await window.imApp.commitScopedFriendChange(
                        handleAction_121_574,
                        (value_577) => {
                            if (root_3 === 'bubble_css') {
                                value_577.customCss = addedSize_3.payload.css;
                                value_577.customCssEnabled = true;
                            } else
                                root_3 === 'status_css'
                                    ? ((value_577.statusCss = addedSize_3.payload.css),
                                      (value_577.statusCssPrompt = addedSize_3.payload.prompt),
                                      (value_577.statusCssEnabled = true),
                                      (value_577.statusRenderMode = 'css'))
                                    : ((value_577.statusTemplate = addedSize_3.payload),
                                      (value_577.statusRenderMode = 'template'),
                                      delete value_577._statusTemplateNeedsPersistence);
                        },
                        {
                            silent: true,
                            syncSettings: true,
                        },
                    );
                if (!value_575) throw new Error('主题保存失败');
                const handleAction_121_576 = handleAction_121(options_6);
                window.imApp.applyFriendCss?.(handleAction_121_576);
                window.imApp.applyFriendStatusBarCss?.(handleAction_121_576);
                handleAction_96(handleAction_121_576);
                handleAction_116(handleAction_121_576);
            }
            return {
                previousSnapshot: previousSnapshot_2,
                appliedFingerprint: fingerprint_2(root_3, options_6),
            };
        }
        async function restore_2(value_578, value_579, value_580) {
            if (!value_580) throw new Error('缺少可撤销快照');
            if (value_578 === 'home_css' || value_578 === 'chat_css' || value_578 === 'group_css') {
                const options_584 = {
                        home_css: [
                            'imessageHomeCss',
                            'imessageHomeCssEnabled',
                            'applyGlobalHomeCss',
                        ],
                        chat_css: [
                            'imessageChatCss',
                            'imessageChatCssEnabled',
                            'applyGlobalChatCss',
                        ],
                        group_css: [
                            'imessageGroupCss',
                            'imessageGroupCssEnabled',
                            'applyGlobalGroupCss',
                        ],
                    },
                    [value_585, value_586, value_587] = options_584[value_578];
                themeState_2[value_585] = String(value_580.css || '');
                themeState_2[value_586] = value_580.enabled === true;
                window.u2ThemeState = themeState_2;
                window.imApp?.[value_587]?.(themeState_2);
                if (!(await saveGlobalData())) throw new Error('撤销保存失败');
                return true;
            }
            const handleAction_121_581 = handleAction_121(value_579);
            if (!handleAction_121_581) throw new Error('原应用角色已不存在');
            const value_582 = await window.imApp.commitScopedFriendChange(
                handleAction_121_581,
                (value_588) => {
                    if (value_578 === 'bubble_css') {
                        value_588.customCss = String(value_580.css || '');
                        value_588.customCssEnabled = value_580.enabled === true;
                    } else
                        value_578 === 'status_css'
                            ? ((value_588.statusCss = String(value_580.css || '')),
                              (value_588.statusCssPrompt = String(value_580.prompt || '')),
                              (value_588.statusCssEnabled = value_580.enabled === true),
                              (value_588.statusRenderMode = value_580.renderMode || 'default'))
                            : ((value_588.statusTemplate = window.imApp.createDefaultStatusTemplate(
                                  value_580.template || {},
                              )),
                              (value_588.statusRenderMode = value_580.renderMode || 'default'));
                },
                {
                    silent: true,
                    syncSettings: true,
                },
            );
            if (!value_582) throw new Error('撤销保存失败');
            const handleAction_121_583 = handleAction_121(value_579);
            return (
                window.imApp.applyFriendCss?.(handleAction_121_583),
                window.imApp.applyFriendStatusBarCss?.(handleAction_121_583),
                handleAction_96(handleAction_121_583),
                handleAction_116(handleAction_121_583),
                true
            );
        }
        async function savePreset_2(root_4, searchText_3, options_7) {
            const name_5 = String(searchText_3 || '')
                .trim()
                .slice(0, 80);
            if (!name_5) throw new Error('作品名称为空');
            const addedSize_4 = validate_2(root_4, options_7);
            if (!addedSize_4.valid) throw new Error(addedSize_4.error);
            if (root_4 === 'status_template') {
                const presets_5 = handleAction_56(themeState_2.imessageStatusTemplatePresets),
                    options_595 = {
                        id: 'status-template-' + Date.now(),
                        name: name_5,
                        ...addedSize_4.payload,
                    },
                    existingIndex_3 = presets_5.findIndex((p_3) => p_3.name === name_5);
                if (existingIndex_3 >= 0) options_595.id = presets_5[existingIndex_3].id;
                const value_597 =
                    existingIndex_3 >= 0
                        ? presets_5.map((value_599, value_600) =>
                              value_600 === existingIndex_3 ? options_595 : value_599,
                          )
                        : [...presets_5, options_595];
                if (!(await handleAction_110(value_597))) throw new Error('预设保存失败');
            } else {
                const options_601 = {
                        home_css: 'home',
                        chat_css: 'chat',
                        group_css: 'group',
                        bubble_css: 'bubble',
                        status_css: 'status',
                    },
                    value_602 = options_601[root_4],
                    presets_6 = handleAction_113(value_602),
                    options_604 = {
                        id: value_602 + '-preset-' + Date.now(),
                        name: name_5,
                        css: addedSize_4.payload.css,
                    },
                    existingIndex_4 = presets_6.findIndex((p_4) => p_4.name === name_5);
                if (existingIndex_4 >= 0) options_604.id = presets_6[existingIndex_4].id;
                const value_606 =
                    existingIndex_4 >= 0
                        ? presets_6.map((value_608, value_609) =>
                              value_609 === existingIndex_4 ? options_604 : value_608,
                          )
                        : [...presets_6, options_604];
                if (!(await handleAction_114(value_602, value_606)))
                    throw new Error('预设保存失败');
            }
            return (
                handleAction_116(handleAction_83() || window.imData?.currentSettingsFriend),
                true
            );
        }
        window.u2ThemeAgent = {
            kinds: Array.from(value_120),
            validate: validate_2,
            getSnapshot: getSnapshot_2,
            fingerprint: fingerprint_2,
            apply: apply_2,
            restore: restore_2,
            savePreset: savePreset_2,
        };
        handleAction_116();
        const hOME_THEME_PACKAGE_FORMAT = 'u2-home-theme',
            HOME_THEME_PACKAGE_VERSION = 2,
            HOME_THEME_SUPPORTED_VERSIONS = new Set([1, HOME_THEME_PACKAGE_VERSION]),
            themeExportBtn = document.getElementById('theme-export-btn'),
            themeImportBtn = document.getElementById('theme-import-btn'),
            themeImportFileInput = document.getElementById('theme-import-file-input'),
            themeBgUploadBtn = document.getElementById('theme-bg-upload-btn'),
            themeBgResetBtn = document.getElementById('theme-bg-reset-btn'),
            themeBgFileInput = document.getElementById('theme-bg-file-input');
        function buildHomeThemePackage() {
            const widgetConfigs =
                typeof window.getHomeWidgetThemeConfigs === 'function'
                    ? window.getHomeWidgetThemeConfigs()
                    : window.getAppState?.('desktop')?.widgets || {};
            return {
                format: hOME_THEME_PACKAGE_FORMAT,
                version: HOME_THEME_PACKAGE_VERSION,
                exportedAt: new Date().toISOString(),
                background: themeState_2.bgUrl ?? null,
                apps: themeState_2.apps.map((app) => ({
                    id: String(app.id),
                    name: String(app.name || ''),
                    icon: app.icon ?? null,
                })),
                widgets: widgetConfigs,
            };
        }
        function parseHomeThemePackage(rawText_2) {
            let payload_3;
            try {
                payload_3 = JSON.parse(String(rawText_2 || ''));
            } catch (value_614) {
                throw new Error('主题文件不是有效的 JSON');
            }
            if (!payload_3 || typeof payload_3 !== 'object' || Array.isArray(payload_3))
                throw new Error('主题文件结构无效');
            if (payload_3.format !== hOME_THEME_PACKAGE_FORMAT)
                throw new Error('这不是 U2 主屏主题文件');
            if (!HOME_THEME_SUPPORTED_VERSIONS.has(payload_3.version))
                throw new Error('不支持的主题文件版本：' + (payload_3.version ?? '未知'));
            if (
                !Object.prototype.hasOwnProperty.call(payload_3, 'background') ||
                (payload_3.background !== null && typeof payload_3.background !== 'string')
            )
                throw new Error('主题背景数据无效');
            if (!Array.isArray(payload_3.apps)) throw new Error('主题图标数据无效');
            const apps_2 = new Map();
            payload_3.apps.forEach((app_2) => {
                if (!app_2 || typeof app_2 !== 'object' || Array.isArray(app_2))
                    throw new Error('主题图标项目无效');
                const id_2 = typeof app_2.id === 'string' ? app_2.id.trim() : '';
                if (!id_2 || (app_2.icon !== null && typeof app_2.icon !== 'string'))
                    throw new Error('主题图标项目缺少有效 ID 或图标');
                if (apps_2.has(id_2)) throw new Error('主题图标 ID 重复：' + id_2);
                apps_2.set(id_2, app_2.icon);
            });
            let widgets_2 = null;
            if (payload_3.version >= 2) {
                if (
                    !payload_3.widgets ||
                    typeof payload_3.widgets !== 'object' ||
                    Array.isArray(payload_3.widgets)
                )
                    throw new Error('主题小组件数据无效');
                widgets_2 = Object.create(null);
                Object.entries(payload_3.widgets).forEach(([value_617, value_618]) => {
                    if (
                        !value_617 ||
                        !value_618 ||
                        typeof value_618 !== 'object' ||
                        Array.isArray(value_618)
                    )
                        throw new Error('主题小组件项目无效');
                    widgets_2[value_617] = value_618;
                });
            }
            return {
                background: payload_3.background,
                apps: apps_2,
                widgets: widgets_2,
            };
        }
        function applyImportedHomeTheme(importedTheme_3) {
            themeState_2.bgUrl = importedTheme_3.background;
            themeState_2.apps.forEach((app_3) => {
                importedTheme_3.apps.has(String(app_3.id)) &&
                    (app_3.icon = importedTheme_3.apps.get(String(app_3.id)));
            });
            applyThemeBackground(themeState_2);
            applyThemeAppIcons(themeState_2);
            importedTheme_3.widgets &&
                typeof window.applyHomeWidgetThemeConfigs === 'function' &&
                window.applyHomeWidgetThemeConfigs(importedTheme_3.widgets);
            renderThemeAppList();
            saveGlobalData();
        }
        themeExportBtn &&
            themeExportBtn.addEventListener('click', async () => {
                try {
                    const serialized = JSON.stringify(buildHomeThemePackage(), null, 2),
                        blob_2 = new Blob([serialized], {
                            type: 'application/json;charset=utf-8',
                        }),
                        result_3 = await window.u2ExportFile({
                            blob: blob_2,
                            fileName:
                                'u2-home-theme-' + new Date().toISOString().slice(0, 10) + '.json',
                            title: 'U2 主屏主题',
                        });
                    if (result_3 === 'shared' || result_3 === 'downloaded')
                        showToast('主屏主题已导出');
                    else {
                        if (result_3 === 'failed') showToast('主题导出失败');
                    }
                } catch (error_8) {
                    console.error('Failed to export home theme', error_8);
                    showToast('主题导出失败');
                }
            });
        themeImportBtn &&
            themeImportFileInput &&
            (themeImportBtn.addEventListener('click', () => themeImportFileInput.click()),
            themeImportFileInput.addEventListener('change', async () => {
                const file = themeImportFileInput.files?.[0];
                themeImportFileInput.value = '';
                if (!file) return;
                if (
                    !String(file.name || '')
                        .toLowerCase()
                        .endsWith('.json')
                ) {
                    showToast('请选择 JSON 主题文件');
                    return;
                }
                try {
                    const importedTheme = parseHomeThemePackage(await file.text());
                    applyImportedHomeTheme(importedTheme);
                    showToast('主屏主题已导入');
                } catch (error_9) {
                    console.error('Failed to import home theme', error_9);
                    showToast(error_9?.message || '主题导入失败');
                }
            }));
        if (themeBgUploadBtn)
            themeBgUploadBtn.addEventListener('click', () => themeBgFileInput?.click());
        themeBgResetBtn &&
            themeBgResetBtn.addEventListener('click', () => {
                themeState_2.bgUrl = null;
                commitThemeBackgroundChanges('背景已重置');
            });
        themeBgFileInput &&
            themeBgFileInput.addEventListener('change', (event_626) => {
                const value_627 = event_626.target.files[0];
                if (value_627) {
                    const value_628 = new FileReader();
                    value_628.onload = (event_3) => {
                        window.compressImage
                            ? window.compressImage(
                                  event_3.target.result,
                                  1080,
                                  1920,
                                  (compressedUrl) => {
                                      themeState_2.bgUrl = compressedUrl;
                                      commitThemeBackgroundChanges('背景已更新');
                                  },
                              )
                            : ((themeState_2.bgUrl = event_3.target.result),
                              commitThemeBackgroundChanges('背景已更新'));
                    };
                    value_628.readAsDataURL(value_627);
                }
                event_626.target.value = '';
            });
        function applyThemeBackground(state_2) {
            const appEl = document.getElementById('app');
            if (!appEl) return;
            const bgUrl_2 = typeof state_2.bgUrl === 'string' ? state_2.bgUrl.trim() : '';
            bgUrl_2
                ? ((appEl.style.backgroundImage = 'url(' + bgUrl_2 + ')'),
                  (appEl.style.backgroundSize = 'cover'),
                  (appEl.style.backgroundPosition = 'center'),
                  (appEl.style.backgroundColor = 'transparent'),
                  (document.body.style.backgroundImage = 'url(' + bgUrl_2 + ')'),
                  (document.body.style.backgroundSize = 'cover'),
                  (document.body.style.backgroundPosition = 'center'))
                : ((appEl.style.backgroundImage = ''),
                  (appEl.style.backgroundColor = ''),
                  (document.body.style.backgroundImage = ''),
                  (document.body.style.backgroundSize = ''),
                  (document.body.style.backgroundPosition = ''));
        }
        function commitThemeBackgroundChanges(toastMessage = '') {
            applyThemeBackground(themeState_2);
            saveGlobalData();
            if (toastMessage) showToast(toastMessage);
        }
        const themeAppListContainer = document.getElementById('theme-app-list'),
            themeAppFileInput = document.getElementById('theme-app-file-input'),
            resetAllIconsBtn = document.getElementById('theme-reset-all-icons-btn');
        let currentEditingAppIndex = -1;
        resetAllIconsBtn &&
            resetAllIconsBtn.addEventListener('click', () => {
                themeState_2.apps.forEach((app_4) => {
                    app_4.icon = null;
                });
                commitThemeAppIconChanges('应用图标已全部重置');
            });
        themeAppFileInput &&
            themeAppFileInput.addEventListener('change', async (event_633) => {
                const file_5 = event_633.target.files?.[0],
                    appIndex = currentEditingAppIndex;
                try {
                    if (!file_5 || appIndex < 0 || !themeState_2.apps[appIndex]) return;
                    const icon_2 = await readImageAsCompressedDataUrl_2(file_5, {
                            maxWidth: 150,
                            maxHeight: 150,
                            outputType: 'image/png',
                        }),
                        appName = themeState_2.apps[appIndex]?.name || '应用';
                    themeState_2.apps[appIndex].icon = icon_2;
                    commitThemeAppIconChanges(appName + ' 图标已更新');
                } catch (error_10) {
                    console.error('Failed to process app icon.', error_10);
                    showToast('图标处理失败，请更换图片后重试');
                } finally {
                    event_633.target.value = '';
                }
            });
        function renderThemeAppList() {
            if (!themeAppListContainer) return;
            themeAppListContainer.innerHTML = '';
            themeState_2.apps.forEach((app_5, index_2) => {
                const item_2 = document.createElement('div'),
                    appDisplayName = window.u2UiTranslation?.getAppName
                        ? window.u2UiTranslation.getAppName(app_5)
                        : app_5.name;
                item_2.className = 'form-item';
                item_2.style.padding = '8px 16px';
                item_2.style.height = '60px';
                item_2.style.display = 'flex';
                item_2.style.justifyContent = 'space-between';
                item_2.style.alignItems = 'center';
                item_2.style.borderBottom = '1px solid #f2f2f7';
                let text_643 = '';
                app_5.icon
                    ? (text_643 =
                          '<div style="width: 40px; height: 40px; border-radius: 10px; background-image: url(\'' +
                          app_5.icon +
                          '\'); background-size: cover; background-position: center; border: 1px solid #e5e5ea; flex-shrink: 0;"></div>')
                    : (text_643 =
                          '<div style="width: 40px; height: 40px; border-radius: 10px; background-color: #f2f2f7; border: 1px solid #e5e5ea; display: flex; align-items: center; justify-content: center; color: #c7c7cc; flex-shrink: 0;"><i class="fas fa-image"></i></div>');
                item_2.innerHTML =
                    `
                    <div style="display: flex; align-items: center; flex: 1;">
                        ` +
                    text_643 +
                    `
                        <div style="margin-left: 12px; font-size: 16px; font-weight: 500; color: #000;">` +
                    appDisplayName +
                    `</div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <div class="reset-single-app-btn" style="width: 32px; height: 32px; border-radius: 50%; background: #ffebee; color: #ff3b30; display: flex; justify-content: center; align-items: center; cursor: pointer;">
                            <i class="fas fa-undo" style="font-size: 14px;"></i>
                        </div>
                        <div class="upload-single-app-btn" style="width: 32px; height: 32px; border-radius: 50%; background: #e8f5e9; color: #34c759; display: flex; justify-content: center; align-items: center; cursor: pointer;">
                            <i class="fas fa-upload" style="font-size: 14px;"></i>
                        </div>
                    </div>
                `;
                const resetBtn = item_2.querySelector('.reset-single-app-btn');
                resetBtn.addEventListener('click', (event_644) => {
                    event_644.stopPropagation();
                    themeState_2.apps[index_2].icon = null;
                    commitThemeAppIconChanges(app_5.name + ' 图标已重置');
                });
                const uploadBtn = item_2.querySelector('.upload-single-app-btn');
                uploadBtn.addEventListener('click', (e_6) => {
                    e_6.stopPropagation();
                    currentEditingAppIndex = index_2;
                    themeAppFileInput?.click();
                });
                themeAppListContainer.appendChild(item_2);
            });
        }
        function applyThemeAppIcons(state) {
            if (!Array.isArray(state.apps)) return;
            state.apps.forEach((app_6) => applyAppIconStyles(app_6));
        }
        function commitThemeAppIconChanges(toastMessage_2 = '') {
            applyThemeAppIcons(themeState_2);
            renderThemeAppList();
            saveGlobalData();
            if (toastMessage_2) showToast(toastMessage_2);
        }
        function applyAppIconStyles(app_7) {
            const el = document.getElementById(app_7.id);
            if (!el) return;
            const appItem = el.classList.contains('app-item') ? el : el.closest('.app-item'),
                iconDiv = el.classList.contains('app-icon')
                    ? el
                    : el.querySelector('.app-icon') || appItem?.querySelector('.app-icon'),
                nameEl = appItem
                    ? appItem.querySelector('.app-name')
                    : el.querySelector('.app-name');
            nameEl &&
                app_7.name &&
                (window.u2UiTranslation?.applyAppName
                    ? window.u2UiTranslation.applyAppName(nameEl, app_7)
                    : (nameEl.textContent = app_7.name));
            if (!iconDiv) return;
            const ensureIconElement = (value_654, value_655 = '') => {
                return (
                    (iconDiv.innerHTML =
                        '<i class="' + value_654 + '" style="' + value_655 + '"></i>'),
                    iconDiv.querySelector('i')
                );
            };
            if (app_7.icon) {
                iconDiv.innerHTML = '';
                iconDiv.classList.add('has-custom-app-icon');
                iconDiv.style.setProperty(
                    'background',
                    'url(' + app_7.icon + ') center / cover no-repeat',
                    'important',
                );
                iconDiv.style.setProperty(
                    'background-image',
                    'url(' + app_7.icon + ')',
                    'important',
                );
                iconDiv.style.setProperty('background-size', 'cover', 'important');
                iconDiv.style.setProperty('background-position', 'center', 'important');
                iconDiv.style.setProperty('background-repeat', 'no-repeat', 'important');
                iconDiv.style.setProperty('background-color', 'transparent', 'important');
                iconDiv.style.setProperty('border', 'none', 'important');
                iconDiv.style.setProperty('box-shadow', 'none', 'important');
            } else {
                iconDiv.classList.remove('has-custom-app-icon');
                iconDiv.style.removeProperty('background');
                iconDiv.style.removeProperty('background-image');
                iconDiv.style.removeProperty('background-size');
                iconDiv.style.removeProperty('background-position');
                iconDiv.style.removeProperty('background-repeat');
                iconDiv.style.removeProperty('background-color');
                iconDiv.style.removeProperty('border');
                iconDiv.style.removeProperty('box-shadow');
                iconDiv.style.backgroundImage = 'none';
                iconDiv.style.backgroundSize = '';
                iconDiv.style.backgroundPosition = '';
                iconDiv.style.backgroundColor = '';
                iconDiv.style.color = '';
                iconDiv.style.border = '1px solid #e5e5ea';
                iconDiv.style.display = 'flex';
                iconDiv.style.justifyContent = 'center';
                iconDiv.style.alignItems = 'center';
                iconDiv.innerHTML = '';
                const isCustomBg = !!window.u2ThemeState?.bgUrl,
                    background_2 = isCustomBg ? 'rgba(255, 255, 255, 0.7)' : '#ffffff',
                    background_3 = isCustomBg
                        ? 'rgba(255, 255, 255, 0.8)'
                        : 'linear-gradient(180deg, #ffffff 0%, #f2f2f7 100%)';
                if (app_7.id === 'dock-icon-settings') {
                    iconDiv.style.background = background_2;
                    iconDiv.style.color = '#1c1c1e';
                    ensureIconElement('fas fa-cog');
                } else {
                    if (app_7.id === 'dock-icon-imessage') {
                        iconDiv.style.background = background_3;
                        iconDiv.style.color = '#1c1c1e';
                        ensureIconElement('fas fa-comment');
                    } else {
                        if (app_7.id === 'dock-icon-youtube') {
                            iconDiv.style.background = background_2;
                            iconDiv.style.color = '#1c1c1e';
                            iconDiv.style.fontSize = '38px';
                            ensureIconElement('fab fa-youtube');
                        } else {
                            if (app_7.id === 'app-icon-1') {
                                iconDiv.style.background = background_2;
                                iconDiv.style.color = '#1c1c1e';
                                ensureIconElement('fas fa-wallet');
                            } else {
                                if (app_7.id === 'app-icon-2') {
                                    iconDiv.style.background = background_2;
                                    iconDiv.style.color = '#1c1c1e';
                                    ensureIconElement('fab fa-tiktok');
                                } else {
                                    if (app_7.id === 'app-icon-3') {
                                        iconDiv.style.background = background_2;
                                        iconDiv.style.color = '#1c1c1e';
                                        ensureIconElement('fas fa-layer-group', 'font-size: 26px;');
                                    } else {
                                        if (app_7.id === 'app-icon-4') {
                                            iconDiv.style.background = background_2;
                                            iconDiv.style.color = '#1c1c1e';
                                            ensureIconElement(
                                                'fa-brands fa-x-twitter',
                                                'font-size: 26px;',
                                            );
                                        } else {
                                            if (app_7.id === 'app-icon-5') {
                                                iconDiv.style.background = background_2;
                                                iconDiv.style.color = '#1c1c1e';
                                                ensureIconElement(
                                                    'fas fa-shopping-bag',
                                                    'color: #1c1c1e; font-size: 30px; filter: none;',
                                                );
                                            } else {
                                                if (app_7.id === 'app-icon-6') {
                                                    iconDiv.style.background = '#ffffff';
                                                    iconDiv.style.color = '#1c1c1e';
                                                    iconDiv.style.fontSize = '27px';
                                                    iconDiv.style.border = '1px solid #e5e5ea';
                                                    ensureIconElement(
                                                        'fas fa-book-open',
                                                        'color: #1c1c1e; font-size: 27px; filter: none;',
                                                    );
                                                } else {
                                                    if (app_7.id === 'app-icon-7') {
                                                        iconDiv.style.background = background_2;
                                                        iconDiv.style.color = '#1c1c1e';
                                                        iconDiv.style.border = isCustomBg
                                                            ? 'none'
                                                            : '1px solid #e5e5ea';
                                                        iconDiv.style.fontSize = '32px';
                                                        iconDiv.style.fontWeight = '900';
                                                        iconDiv.style.fontFamily =
                                                            'Arial, sans-serif';
                                                        iconDiv.style.letterSpacing = '-1px';
                                                        iconDiv.innerHTML = 'N';
                                                    } else {
                                                        if (app_7.id === 'app-icon-8') {
                                                            iconDiv.style.background = background_2;
                                                            iconDiv.style.color = '#1c1c1e';
                                                            ensureIconElement(
                                                                'fas fa-heart',
                                                                'color: #1c1c1e; font-size: 28px;',
                                                            );
                                                        } else {
                                                            if (app_7.id === 'app-icon-9') {
                                                                iconDiv.style.background =
                                                                    background_2;
                                                                iconDiv.style.color = '#1c1c1e';
                                                                ensureIconElement(
                                                                    'fab fa-app-store-ios',
                                                                    'color: #1c1c1e; font-size: 29px;',
                                                                );
                                                            } else {
                                                                if (app_7.id === 'app-icon-10') {
                                                                    iconDiv.style.background =
                                                                        background_2;
                                                                    iconDiv.style.color = '#1c1c1e';
                                                                    ensureIconElement(
                                                                        'fas fa-images',
                                                                        'color: #1c1c1e; font-size: 27px;',
                                                                    );
                                                                } else {
                                                                    if (
                                                                        app_7.id === 'app-icon-11'
                                                                    ) {
                                                                        iconDiv.style.background =
                                                                            background_2;
                                                                        iconDiv.style.color =
                                                                            '#1c1c1e';
                                                                        ensureIconElement(
                                                                            'fas fa-plug',
                                                                            'color: #1c1c1e; font-size: 27px;',
                                                                        );
                                                                    } else {
                                                                        if (
                                                                            app_7.id ===
                                                                            'app-icon-12'
                                                                        ) {
                                                                            iconDiv.style.background =
                                                                                background_2;
                                                                            iconDiv.style.color =
                                                                                '#1c1c1e';
                                                                            ensureIconElement(
                                                                                'fas fa-book',
                                                                                'color: #1c1c1e; font-size: 28px;',
                                                                            );
                                                                        } else {
                                                                            if (
                                                                                app_7.id ===
                                                                                'app-icon-13'
                                                                            ) {
                                                                                iconDiv.style.background =
                                                                                    background_2;
                                                                                iconDiv.style.color =
                                                                                    '#1c1c1e';
                                                                                ensureIconElement(
                                                                                    'fas fa-book-open',
                                                                                    'color: #1c1c1e; font-size: 27px;',
                                                                                );
                                                                            } else {
                                                                                if (
                                                                                    app_7.id ===
                                                                                    'app-icon-14'
                                                                                ) {
                                                                                    iconDiv.style.background =
                                                                                        background_2;
                                                                                    iconDiv.style.color =
                                                                                        '#1c1c1e';
                                                                                    ensureIconElement(
                                                                                        'fas fa-phone',
                                                                                        'color: #1c1c1e; font-size: 27px; transform: rotate(-12deg);',
                                                                                    );
                                                                                } else
                                                                                    app_7.id ===
                                                                                        'app-icon-15' &&
                                                                                        ((iconDiv.style.background =
                                                                                            background_2),
                                                                                        (iconDiv.style.color =
                                                                                            '#1c1c1e'),
                                                                                        ensureIconElement(
                                                                                            'fas fa-mobile-screen-button',
                                                                                            'color: #1c1c1e; font-size: 27px;',
                                                                                        ));
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        const themeFontBtn = document.getElementById('theme-font-btn'),
            themeFontModal = document.getElementById('theme-font-modal'),
            themeFontCloseBtn = document.getElementById('theme-font-close-btn'),
            themeFontModalPreview = document.getElementById('theme-font-modal-preview'),
            themeFontModalUserPresetList = document.getElementById(
                'theme-font-modal-user-preset-list',
            ),
            themeFontNameInput = document.getElementById('theme-font-name-input'),
            themeFontUrlInput = document.getElementById('theme-font-url-input'),
            themeFontLocalNameInput = document.getElementById('theme-font-local-name-input'),
            themeFontUploadBtn = document.getElementById('theme-font-upload-btn'),
            themeFontFileInput = document.getElementById('theme-font-file-input'),
            themeFontFileStatus = document.getElementById('theme-font-file-status'),
            themeFontAddBtn = document.getElementById('theme-font-add-btn'),
            themeFontSourceTabs = Array.from(document.querySelectorAll('.theme-font-source-tab')),
            themeFontSourcePanels = Array.from(
                document.querySelectorAll('.theme-font-source-panel'),
            ),
            themeFontSizeSlider = document.getElementById('theme-font-size-slider'),
            themeFontSizeValue = document.getElementById('theme-font-size-value'),
            textContent_4 = 'Aa 你好 Hello 123',
            THEME_FONT_MAX_FILE_SIZE = 20971520,
            THEME_FONT_WARNING_FILE_SIZE = 5242880,
            THEME_FONT_FORMATS = new Set(['ttf', 'otf', 'woff', 'woff2']),
            THEME_FONT_DEFAULT_SIZE = 16,
            join_134 = [
                'script',
                'style',
                'link',
                'meta',
                'svg',
                'path',
                'canvas',
                'video',
                'audio',
                '.app-icon',
                '.icon-placeholder',
                'i',
                '.fa',
                '.fas',
                '.far',
                '.fab',
                '.fal',
                '.fa-solid',
                '.fa-regular',
                '.fa-brands',
                '#theme-bubble-css-input',
                '#theme-chat-css-input',
                '#theme-group-css-input',
                '#theme-status-template-prompt',
                '#theme-status-template-regex',
                '#theme-status-template-html',
                '#bubble-css-input',
                '#status-css-input',
                'textarea[placeholder*="CSS"]',
                'textarea[placeholder*="css"]',
            ].join(','),
            THEME_FONT_SURFACE_CANDIDATE_SELECTOR = [
                '#u2-login-screen',
                '.app-view',
                '.settings-view',
                '.edit-view',
                '.bottom-sheet-overlay',
                '.tk-sub-profile-view',
                '.tk-tab-content',
                '.yt-tab-content',
                '.x-tab-content',
                '.modal-overlay',
                '.wb-centered-modal-overlay',
                '.toast-bubble',
            ].join(','),
            THEME_FONT_ACTIVE_SURFACE_SELECTOR = [
                '.app-view.active',
                '.settings-view.active',
                '.edit-view.active',
                '.bottom-sheet-overlay.active',
                '.tk-sub-profile-view.active',
                '.tk-tab-content.active',
                '.yt-tab-content.active',
                '.x-tab-content.active',
                '.modal-overlay.active',
                '.wb-centered-modal-overlay.active',
                '.toast-bubble.show',
            ].join(','),
            THEME_FONT_INACTIVE_SURFACE_SELECTOR = [
                '#u2-login-screen.is-hidden',
                '.app-view:not(.active)',
                '.settings-view:not(.active)',
                '.edit-view:not(.active)',
                '.bottom-sheet-overlay:not(.active)',
                '.tk-sub-profile-view:not(.active)',
                '.tk-tab-content:not(.active)',
                '.yt-tab-content:not(.active)',
                '.x-tab-content:not(.active)',
                '[hidden]',
                '[aria-hidden="true"]',
            ].join(','),
            THEME_FONT_HOME_SURFACE_SELECTOR = [
                '#pages-container',
                '#dock',
                '.page-indicators',
                '.home-search-pill',
                '#home-ios-status-bar',
            ].join(','),
            themeFontFaceRegistry = new Map(),
            themeFontBaseSizes = new Set(),
            themeFontObservedSurfaces = new WeakSet(),
            themeFontCapturedSurfaces = new WeakSet(),
            themeFontPendingFullSurfaces = new WeakSet(),
            themeFontDeferredRoots = new WeakMap(),
            themeFontPendingRoots = new Set();
        let themeFontSaveTimer = null,
            themeFontSelectedFile = null,
            themeFontSourceMode = 'local',
            count_142 = 0,
            themeFontScaleObserver = null,
            themeFontScaleSurfaceObserver = null,
            themeFontCaptureFrame = 0,
            themeFontScaleRefreshFrame = 0;
        function cloneThemeFontSources(sources_2 = {}) {
            return {
                woff2: typeof sources_2.woff2 === 'string' ? sources_2.woff2.trim() : '',
                woff: typeof sources_2.woff === 'string' ? sources_2.woff.trim() : '',
                ttf: typeof sources_2.ttf === 'string' ? sources_2.ttf.trim() : '',
                otf: typeof sources_2.otf === 'string' ? sources_2.otf.trim() : '',
            };
        }
        function normalizeThemeFontSize(value_8) {
            const parsed = Number(value_8);
            if (!Number.isFinite(parsed)) return 16;
            return Math.min(24, Math.max(12, Math.round(parsed)));
        }
        function sanitizeThemeFontCssName(value_9) {
            const sanitized = String(value_9 || '')
                .trim()
                .replace(/["']/g, '')
                .replace(/[{}]/g, '')
                .replace(/\s+/g, ' ');
            return sanitized || 'CustomThemeFont';
        }
        function sanitizeThemeFontLabel(value_11) {
            return sanitizeThemeFontCssName(value_11).slice(0, 60);
        }
        function buildThemeFontFamily(value_663) {
            return (
                '"' + sanitizeThemeFontCssName(value_663) + '", ' + DEFAULT_SYSTEM_THEME_FONT_FAMILY
            );
        }
        function handleAction_146(presetId) {
            const safeId = String(presetId || 'font').replace(/[^a-z0-9_-]/gi, '_');
            return 'U2ThemeFont_' + safeId + '_' + Date.now().toString(36);
        }
        function normalizeThemeFontFormat(value_12) {
            const normalized = String(value_12 || '')
                .trim()
                .toLowerCase()
                .replace(/^\./, '');
            return THEME_FONT_FORMATS.has(normalized) ? normalized : '';
        }
        function inferThemeFontFormat(value_13) {
            const cleanValue = String(value_13 || '')
                    .split('?')[0]
                    .split('#')[0]
                    .toLowerCase(),
                match_2 = cleanValue.match(/\.([a-z0-9]+)$/);
            return normalizeThemeFontFormat(match_2?.[1]);
        }
        function getThemeFontCssFormat(format_2) {
            if (format_2 === 'ttf') return 'truetype';
            if (format_2 === 'otf') return 'opentype';
            return format_2;
        }
        function normalizeThemeFontPreset(preset_7 = {}, value_672 = 0) {
            const id_3 =
                    typeof preset_7.id === 'string' && preset_7.id
                        ? preset_7.id
                        : 'font_preset_' + Date.now() + '_' + value_672,
                normalizedName = sanitizeThemeFontLabel(
                    preset_7.name ||
                        preset_7.label ||
                        preset_7.cssName ||
                        'CustomFont' + (value_672 + 1),
                ),
                fontAssetId_2 =
                    typeof preset_7.fontAssetId === 'string' ? preset_7.fontAssetId : '',
                sourceType_2 = preset_7.sourceType === 'local' || fontAssetId_2 ? 'local' : 'link',
                sources_3 = cloneThemeFontSources(preset_7.sources),
                sourceUrl =
                    sources_3.woff2 || sources_3.woff || sources_3.ttf || sources_3.otf || '',
                fontFormat_2 =
                    normalizeThemeFontFormat(preset_7.fontFormat) ||
                    inferThemeFontFormat(sourceUrl),
                cssName_2 = sanitizeThemeFontCssName(preset_7.cssName || normalizedName);
            return {
                id: id_3,
                type: 'user',
                name: normalizedName,
                label: normalizedName,
                cssName: cssName_2,
                family: buildThemeFontFamily(cssName_2),
                sourceType: sourceType_2,
                fontAssetId: fontAssetId_2,
                fontFormat: fontFormat_2,
                sources: sources_3,
            };
        }
        function ensureThemeFontStateShape() {
            if (!themeState_2 || typeof themeState_2 !== 'object') return;
            if (!themeState_2.fontMode) themeState_2.fontMode = 'preset';
            if (!themeState_2.fontPresetKey) themeState_2.fontPresetKey = 'system-default';
            if (!themeState_2.fontFamily)
                themeState_2.fontFamily = DEFAULT_SYSTEM_THEME_FONT_FAMILY;
            if (typeof themeState_2.fontCssName !== 'string') themeState_2.fontCssName = '';
            themeState_2.fontSize = normalizeThemeFontSize(themeState_2.fontSize);
            themeState_2.fontSources = cloneThemeFontSources(themeState_2.fontSources);
            themeState_2.fontSourceType = ['preset', 'local', 'link'].includes(
                themeState_2.fontSourceType,
            )
                ? themeState_2.fontSourceType
                : 'preset';
            themeState_2.fontAssetId =
                typeof themeState_2.fontAssetId === 'string' ? themeState_2.fontAssetId : '';
            themeState_2.fontFormat = normalizeThemeFontFormat(themeState_2.fontFormat);
            themeState_2.savedFontPresets = Array.isArray(themeState_2.savedFontPresets)
                ? themeState_2.savedFontPresets.map((preset_8, index_3) =>
                      normalizeThemeFontPreset(preset_8, index_3),
                  )
                : [];
            if (
                themeState_2.fontMode === 'saved' &&
                !themeState_2.savedFontPresets.some(
                    (preset_9) => preset_9.id === themeState_2.fontPresetKey,
                )
            ) {
                const legacySourceUrl =
                    themeState_2.fontSources.woff2 ||
                    themeState_2.fontSources.woff ||
                    themeState_2.fontSources.ttf ||
                    themeState_2.fontSources.otf ||
                    '';
                if (legacySourceUrl) {
                    const themeFontPreset = normalizeThemeFontPreset({
                        id: 'font_preset_migrated_' + Date.now(),
                        name: themeState_2.fontCssName || '迁移字体',
                        cssName: themeState_2.fontCssName || 'MigratedThemeFont',
                        sourceType: 'link',
                        sources: themeState_2.fontSources,
                        fontFormat: themeState_2.fontFormat,
                    });
                    themeState_2.savedFontPresets.push(themeFontPreset);
                    themeState_2.fontPresetKey = themeFontPreset.id;
                }
            }
            if (themeState_2.fontMode !== 'saved') {
                const builtin =
                    BUILTIN_THEME_FONTS.find(
                        (font_2) => font_2.key === themeState_2.fontPresetKey,
                    ) || BUILTIN_THEME_FONTS[0];
                themeState_2.fontMode = 'preset';
                themeState_2.fontPresetKey = builtin.key;
                themeState_2.fontFamily = builtin.family || DEFAULT_SYSTEM_THEME_FONT_FAMILY;
                themeState_2.fontCssName = builtin.cssName || '';
                themeState_2.fontSources = cloneThemeFontSources(builtin.sources);
                themeState_2.fontSourceType = 'preset';
                themeState_2.fontAssetId = '';
                themeState_2.fontFormat = '';
            }
        }
        function getActiveThemeFontDefinition(state_3 = themeState_2) {
            ensureThemeFontStateShape();
            if (state_3.fontMode === 'saved') {
                const savedPreset = state_3.savedFontPresets.find(
                    (preset_10) => preset_10.id === state_3.fontPresetKey,
                );
                if (savedPreset)
                    return {
                        ...savedPreset,
                        type: 'user',
                    };
            }
            const preset_11 =
                BUILTIN_THEME_FONTS.find((font) => font.key === state_3.fontPresetKey) ||
                BUILTIN_THEME_FONTS[0];
            return {
                ...preset_11,
                type: 'builtin',
                sourceType: 'preset',
                fontAssetId: '',
                fontFormat: '',
            };
        }
        function setThemeFontStateFromDefinition(definition) {
            definition.type === 'builtin' || definition.key
                ? ((themeState_2.fontMode = 'preset'),
                  (themeState_2.fontPresetKey = definition.key || 'system-default'))
                : ((themeState_2.fontMode = 'saved'), (themeState_2.fontPresetKey = definition.id));
            themeState_2.fontFamily = definition.family || DEFAULT_SYSTEM_THEME_FONT_FAMILY;
            themeState_2.fontCssName = definition.cssName || '';
            themeState_2.fontSources = cloneThemeFontSources(definition.sources);
            themeState_2.fontSourceType =
                definition.sourceType || (definition.type === 'builtin' ? 'preset' : 'link');
            themeState_2.fontAssetId = definition.fontAssetId || '';
            themeState_2.fontFormat = normalizeThemeFontFormat(definition.fontFormat);
        }
        function handleAction_149() {
            let styleEl = document.getElementById('theme-font-applied-style');
            return (
                !styleEl &&
                    ((styleEl = document.createElement('style')),
                    (styleEl.id = 'theme-font-applied-style'),
                    document.head.appendChild(styleEl)),
                styleEl
            );
        }
        function getThemeFontScaleStyleElement() {
            let styleEl_2 = document.getElementById('theme-font-scale-style');
            return (
                !styleEl_2 &&
                    ((styleEl_2 = document.createElement('style')),
                    (styleEl_2.id = 'theme-font-scale-style'),
                    document.head.appendChild(styleEl_2)),
                styleEl_2
            );
        }
        function formatThemeFontBaseSize(value_14) {
            return Number(value_14)
                .toFixed(2)
                .replace(/\.?0+$/, '');
        }
        function rebuildThemeFontScaleCss(fontSize_2 = themeState_2.fontSize) {
            const scale_2 = normalizeThemeFontSize(fontSize_2) / THEME_FONT_DEFAULT_SIZE,
                rules = Array.from(themeFontBaseSizes, Number)
                    .filter(Number.isFinite)
                    .sort((a, b) => a - b)
                    .map((baseSize) => {
                        const formatThemeFontBaseSize_696 = formatThemeFontBaseSize(baseSize),
                            scaledSize = Math.max(1, baseSize * scale_2)
                                .toFixed(3)
                                .replace(/\.?0+$/, '');
                        return (
                            '[data-theme-font-base-size="' +
                            formatThemeFontBaseSize_696 +
                            '"] { font-size: ' +
                            scaledSize +
                            'px !important; }'
                        );
                    });
            getThemeFontScaleStyleElement().textContent = rules.join(`
`);
            document.documentElement.style.setProperty('--theme-font-scale', String(scale_2));
        }
        function captureThemeFontBaseSize(element_2, { recapture = false } = {}) {
            if (!(element_2 instanceof HTMLElement) || element_2.matches(join_134)) return false;
            if (element_2.closest(THEME_FONT_INACTIVE_SURFACE_SELECTOR)) return false;
            if (!recapture && element_2.hasAttribute('data-theme-font-base-size')) return false;
            if (recapture) element_2.removeAttribute('data-theme-font-base-size');
            const computedSize = Number.parseFloat(window.getComputedStyle(element_2).fontSize);
            if (!Number.isFinite(computedSize) || computedSize <= 0) return false;
            const baseSize_2 = formatThemeFontBaseSize(computedSize);
            element_2.setAttribute('data-theme-font-base-size', baseSize_2);
            const size_700 = themeFontBaseSizes.size;
            return (themeFontBaseSizes.add(baseSize_2), themeFontBaseSizes.size !== size_700);
        }
        function captureThemeFontSizesIn(root_5, options_8, value_703 = true) {
            if (!(root_5 instanceof Element)) return false;
            const scaleStyleSheet = document.getElementById('theme-font-scale-style')?.sheet,
                disabled_2 = !!scaleStyleSheet?.disabled;
            if (scaleStyleSheet) scaleStyleSheet.disabled = true;
            try {
                let addedSize = captureThemeFontBaseSize(root_5, options_8);
                return (
                    value_703 &&
                        root_5.querySelectorAll('*').forEach((element_3) => {
                            if (captureThemeFontBaseSize(element_3, options_8)) addedSize = true;
                        }),
                    addedSize
                );
            } finally {
                if (scaleStyleSheet) scaleStyleSheet.disabled = disabled_2;
            }
        }
        function scheduleThemeFontScaleCssRefresh() {
            if (themeFontScaleRefreshFrame) return;
            themeFontScaleRefreshFrame = window.requestAnimationFrame(() => {
                themeFontScaleRefreshFrame = 0;
                rebuildThemeFontScaleCss();
            });
        }
        function isThemeFontLoginVisible() {
            const loginScreen = document.getElementById('u2-login-screen');
            return !!loginScreen && !loginScreen.classList.contains('is-hidden');
        }
        function getThemeFontActiveRoots() {
            if (!document.body) return [];
            const loginScreen_2 = document.getElementById('u2-login-screen');
            if (isThemeFontLoginVisible()) return loginScreen_2 ? [loginScreen_2] : [];
            const roots = Array.from(document.querySelectorAll(THEME_FONT_ACTIVE_SURFACE_SELECTOR));
            return (
                !document.querySelector(
                    '.app-view.active, .settings-view.active, .edit-view.active',
                ) &&
                    document
                        .querySelectorAll(THEME_FONT_HOME_SURFACE_SELECTOR)
                        .forEach((root_6) => roots.push(root_6)),
                Array.from(new Set(roots))
            );
        }
        function getThemeFontActiveSurfaceFor(node_2) {
            if (!(node_2 instanceof Element)) return null;
            const loginScreen_3 = document.getElementById('u2-login-screen');
            if (isThemeFontLoginVisible())
                return loginScreen_3?.contains(node_2) ? loginScreen_3 : null;
            if (node_2.closest(THEME_FONT_INACTIVE_SURFACE_SELECTOR)) return null;
            const activeSurface = node_2.matches(THEME_FONT_ACTIVE_SURFACE_SELECTOR)
                ? node_2
                : node_2.closest(THEME_FONT_ACTIVE_SURFACE_SELECTOR);
            if (activeSurface) return activeSurface;
            if (
                !document.querySelector(
                    '.app-view.active, .settings-view.active, .edit-view.active',
                )
            )
                return node_2.matches(THEME_FONT_HOME_SURFACE_SELECTOR)
                    ? node_2
                    : node_2.closest(THEME_FONT_HOME_SURFACE_SELECTOR);
            return null;
        }
        function getThemeFontRegisteredSurfaceFor(node) {
            if (!(node instanceof Element)) return null;
            return node.matches(THEME_FONT_SURFACE_CANDIDATE_SELECTOR)
                ? node
                : node.closest(THEME_FONT_SURFACE_CANDIDATE_SELECTOR);
        }
        function deferThemeFontCapture(root_7) {
            const surface = getThemeFontRegisteredSurfaceFor(root_7);
            if (!surface) return;
            if (!themeFontDeferredRoots.has(surface))
                themeFontDeferredRoots.set(surface, new Set());
            themeFontDeferredRoots.get(surface).add(root_7);
        }
        function flushThemeFontCaptureQueue() {
            themeFontCaptureFrame = 0;
            const roots_2 = Array.from(themeFontPendingRoots);
            themeFontPendingRoots.clear();
            let enabled_713 = false;
            roots_2.forEach((root_8) => {
                if (!root_8.isConnected || !getThemeFontActiveSurfaceFor(root_8)) return;
                if (captureThemeFontSizesIn(root_8)) enabled_713 = true;
                themeFontPendingFullSurfaces.has(root_8) &&
                    (themeFontPendingFullSurfaces['delete'](root_8),
                    themeFontCapturedSurfaces.add(root_8),
                    themeFontDeferredRoots['delete'](root_8),
                    root_8
                        .querySelectorAll(THEME_FONT_SURFACE_CANDIDATE_SELECTOR)
                        .forEach((surface_4) => {
                            if (!getThemeFontActiveSurfaceFor(surface_4)) return;
                            themeFontCapturedSurfaces.add(surface_4);
                            themeFontDeferredRoots['delete'](surface_4);
                        }));
            });
            if (enabled_713) scheduleThemeFontScaleCssRefresh();
        }
        function queueThemeFontCapture(root_9, { fullSurface = false } = {}) {
            if (!(root_9 instanceof Element)) return;
            if (!getThemeFontActiveSurfaceFor(root_9)) {
                deferThemeFontCapture(root_9);
                return;
            }
            if (fullSurface) themeFontPendingFullSurfaces.add(root_9);
            themeFontPendingRoots.add(root_9);
            if (themeFontCaptureFrame) return;
            themeFontCaptureFrame = window.requestAnimationFrame(flushThemeFontCaptureQueue);
        }
        function queueThemeFontSurfaceActivation(value_717) {
            if (!(value_717 instanceof Element) || !getThemeFontActiveSurfaceFor(value_717)) return;
            if (!themeFontCapturedSurfaces.has(value_717)) {
                queueThemeFontCapture(value_717, {
                    fullSurface: true,
                });
                return;
            }
            const deferredRoots = themeFontDeferredRoots.get(value_717);
            if (!deferredRoots) return;
            themeFontDeferredRoots['delete'](value_717);
            deferredRoots.forEach((root_10) => queueThemeFontCapture(root_10));
        }
        function queueThemeFontActivatedSurfaceTree(surface_5) {
            if (!(surface_5 instanceof Element) || !getThemeFontActiveSurfaceFor(surface_5)) return;
            if (!themeFontCapturedSurfaces.has(surface_5)) {
                queueThemeFontCapture(surface_5, {
                    fullSurface: true,
                });
                return;
            }
            queueThemeFontSurfaceActivation(surface_5);
            surface_5
                .querySelectorAll(THEME_FONT_SURFACE_CANDIDATE_SELECTOR)
                .forEach((candidate) => {
                    if (getThemeFontActiveSurfaceFor(candidate))
                        queueThemeFontSurfaceActivation(candidate);
                });
        }
        function queueAllActiveThemeFontRoots() {
            getThemeFontActiveRoots().forEach((value_721) => {
                value_721.matches(THEME_FONT_SURFACE_CANDIDATE_SELECTOR)
                    ? queueThemeFontSurfaceActivation(value_721)
                    : queueThemeFontCapture(value_721);
            });
        }
        function observeThemeFontSurface(surface_6) {
            if (!(surface_6 instanceof Element) || themeFontObservedSurfaces.has(surface_6)) return;
            themeFontObservedSurfaces.add(surface_6);
            themeFontScaleSurfaceObserver.observe(surface_6, {
                attributes: true,
                attributeFilter: ['class', 'hidden', 'aria-hidden'],
            });
        }
        function registerThemeFontSurfacesIn(root_11) {
            if (!(root_11 instanceof Element)) return;
            if (root_11.matches(THEME_FONT_SURFACE_CANDIDATE_SELECTOR))
                observeThemeFontSurface(root_11);
            root_11
                .querySelectorAll(THEME_FONT_SURFACE_CANDIDATE_SELECTOR)
                .forEach(observeThemeFontSurface);
        }
        function handleAction_153() {
            if (!document.body) return;
            if (themeFontScaleObserver) return;
            let addedSize_5 = false;
            getThemeFontActiveRoots().forEach((root_12) => {
                if (captureThemeFontSizesIn(root_12)) addedSize_5 = true;
                if (root_12.matches(THEME_FONT_SURFACE_CANDIDATE_SELECTOR))
                    themeFontCapturedSurfaces.add(root_12);
            });
            if (addedSize_5) rebuildThemeFontScaleCss();
            themeFontScaleSurfaceObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    const target_3 = mutation.target;
                    if (!(target_3 instanceof Element)) return;
                    if (target_3.id === 'u2-login-screen') {
                        queueAllActiveThemeFontRoots();
                        return;
                    }
                    queueThemeFontActivatedSurfaceTree(target_3);
                });
            });
            registerThemeFontSurfacesIn(document.body);
            themeFontScaleObserver = new MutationObserver((items_727) => {
                items_727.forEach((value_728) => {
                    value_728.addedNodes.forEach((value_729) => {
                        if (!(value_729 instanceof Element)) return;
                        registerThemeFontSurfacesIn(value_729);
                        value_729.matches(THEME_FONT_SURFACE_CANDIDATE_SELECTOR)
                            ? queueThemeFontSurfaceActivation(value_729)
                            : queueThemeFontCapture(value_729);
                    });
                });
            });
            themeFontScaleObserver.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
        function applyThemeFontCss(resolvedFamily, value_731) {
            const resolvedSize = normalizeThemeFontSize(value_731) + 'px',
                handleAction_149_733 = handleAction_149();
            handleAction_149_733.textContent = (
                `
            :root {
                --theme-font-family: ` +
                resolvedFamily +
                `;
                --theme-font-size: ` +
                resolvedSize +
                `;
            }
            body {
                font-family: var(--theme-font-family) !important;
            }
            body :where(*:not(i):not(.fa):not(.fas):not(.far):not(.fab):not(.fal):not(.fa-solid):not(.fa-regular):not(.fa-brands)) {
                font-family: var(--theme-font-family) !important;
            }
            body :where(i, .fa, .fas, .far, .fab, .fal, .fa-solid, .fa-regular, .fa-brands),
            body :where(i, .fa, .fas, .far, .fab, .fal, .fa-solid, .fa-regular, .fa-brands)::before {
                font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands" !important;
            }
            body :where(#theme-bubble-css-input, #theme-chat-css-input, #theme-group-css-input, #theme-status-template-prompt, #theme-status-template-regex, #theme-status-template-html, #bubble-css-input, #status-css-input, textarea[placeholder*="CSS"], textarea[placeholder*="css"]) {
                font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace !important;
                font-size: 13px !important;
            }`
            ).trim();
            document.documentElement.style.setProperty('--theme-font-family', resolvedFamily);
            document.documentElement.style.setProperty('--theme-font-size', resolvedSize);
            handleAction_153();
            rebuildThemeFontScaleCss(value_731);
        }
        async function handleAction_154(definition_2) {
            if (!definition_2 || definition_2.type === 'builtin' || definition_2.key) return null;
            if (definition_2.sourceType === 'local') {
                if (
                    !definition_2.fontAssetId ||
                    typeof window.appStorage?.getAssetUrl !== 'function'
                )
                    throw new Error('本地字体文件不存在');
                const value_738 = await window.appStorage.getAssetUrl(definition_2.fontAssetId);
                if (!value_738) throw new Error('本地字体文件已丢失');
                return {
                    url: value_738,
                    format: normalizeThemeFontFormat(definition_2.fontFormat),
                };
            }
            const sources_4 = cloneThemeFontSources(definition_2.sources),
                format_3 = sources_4.woff2
                    ? 'woff2'
                    : sources_4.woff
                      ? 'woff'
                      : sources_4.ttf
                        ? 'ttf'
                        : sources_4.otf
                          ? 'otf'
                          : '',
                url_3 = sources_4[format_3] || '';
            if (!url_3) throw new Error('字体链接为空');
            return {
                url: url_3,
                format: normalizeThemeFontFormat(definition_2.fontFormat) || format_3,
            };
        }
        async function handleAction_155(definition_3) {
            if (!definition_3 || definition_3.type === 'builtin' || definition_3.key)
                return definition_3?.family || DEFAULT_SYSTEM_THEME_FONT_FAMILY;
            if (typeof FontFace !== 'function' || !document.fonts)
                throw new Error('当前浏览器不支持自定义字体');
            const source_2 = await handleAction_154(definition_3),
                registryKey = definition_3.cssName + '|' + source_2.url + '|' + source_2.format,
                existingFace = themeFontFaceRegistry.get(registryKey);
            if (existingFace?.status === 'loaded') return definition_3.family;
            const cssFormat = getThemeFontCssFormat(source_2.format),
                sourceDescriptor =
                    'url(' +
                    JSON.stringify(source_2.url) +
                    ')' +
                    (cssFormat ? ' format(' + JSON.stringify(cssFormat) + ')' : ''),
                fontFace = new FontFace(definition_3.cssName, sourceDescriptor, {
                    style: 'normal',
                    weight: 'normal',
                    display: 'swap',
                });
            return (
                await fontFace.load(),
                document.fonts.add(fontFace),
                themeFontFaceRegistry.set(registryKey, fontFace),
                definition_3.family
            );
        }
        async function handleAction_156(state_4 = themeState_2, { fallbackOnError = true } = {}) {
            ensureThemeFontStateShape();
            const activeThemeFontDefinition = getActiveThemeFontDefinition(state_4),
                value_746 = ++count_142;
            try {
                const value_747 = await handleAction_155(activeThemeFontDefinition);
                if (value_746 !== count_142) return false;
                return (
                    applyThemeFontCss(value_747, state_4.fontSize),
                    renderThemeFontPreview(),
                    true
                );
            } catch (error_11) {
                console.warn('Failed to load theme font:', error_11);
                if (value_746 !== count_142) return false;
                if (fallbackOnError)
                    applyThemeFontCss(DEFAULT_SYSTEM_THEME_FONT_FAMILY, state_4.fontSize);
                return false;
            }
        }
        function renderThemeFontPreview() {
            ensureThemeFontStateShape();
            const definition_4 = getActiveThemeFontDefinition(themeState_2),
                value_750 = normalizeThemeFontSize(themeState_2.fontSize) + 'px';
            themeFontModalPreview &&
                ((themeFontModalPreview.textContent = textContent_4),
                (themeFontModalPreview.style.fontFamily =
                    definition_4.family || DEFAULT_SYSTEM_THEME_FONT_FAMILY),
                (themeFontModalPreview.style.fontSize = value_750));
            if (themeFontSizeValue) themeFontSizeValue.textContent = value_750;
            if (themeFontSizeSlider)
                themeFontSizeSlider.value = String(normalizeThemeFontSize(themeState_2.fontSize));
        }
        function syncThemeFontInputsFromState() {
            ensureThemeFontStateShape();
            renderThemeFontPreview();
            const preset_12 =
                themeState_2.fontMode === 'saved'
                    ? themeState_2.savedFontPresets.find(
                          (item) => item.id === themeState_2.fontPresetKey,
                      )
                    : null;
            if (preset_12?.sourceType === 'link') {
                themeFontNameInput.value = preset_12.name || '';
                themeFontUrlInput.value =
                    preset_12.sources.woff2 ||
                    preset_12.sources.woff ||
                    preset_12.sources.ttf ||
                    preset_12.sources.otf ||
                    '';
            } else {
                if (themeFontNameInput) themeFontNameInput.value = '';
                if (themeFontUrlInput) themeFontUrlInput.value = '';
            }
            if (themeFontLocalNameInput) themeFontLocalNameInput.value = '';
            themeFontSelectedFile = null;
            if (themeFontFileInput) themeFontFileInput.value = '';
            updateThemeFontFileStatus();
        }
        function scheduleThemeFontSave() {
            if (themeFontSaveTimer) clearTimeout(themeFontSaveTimer);
            themeFontSaveTimer = setTimeout(() => {
                themeFontSaveTimer = null;
                saveGlobalData();
            }, 300);
        }
        function handleAction_157({
            label: textContent_5,
            family: family_2,
            isActive: isActive_2,
            onSelect: onSelect_2,
            onDelete = null,
        }) {
            const element_756 = document.createElement('div');
            element_756.className = 'theme-font-pill ' + (isActive_2 ? 'active' : '');
            const selectBtn = document.createElement('button');
            selectBtn.type = 'button';
            selectBtn.className = 'theme-font-pill-select';
            selectBtn.textContent = textContent_5;
            selectBtn.style.fontFamily = family_2 || DEFAULT_SYSTEM_THEME_FONT_FAMILY;
            selectBtn.addEventListener('click', () => onSelect_2?.());
            element_756.appendChild(selectBtn);
            if (typeof onDelete === 'function') {
                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.className = 'theme-font-pill-delete';
                deleteBtn.setAttribute('aria-label', '删除字体 ' + textContent_5);
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                deleteBtn.addEventListener('click', () => onDelete());
                element_756.appendChild(deleteBtn);
            }
            return element_756;
        }
        async function handleAction_158(value_759, value_760 = '') {
            try {
                if (themeFontAddBtn) themeFontAddBtn.disabled = true;
                await handleAction_155(value_759);
                setThemeFontStateFromDefinition(value_759);
                renderThemeFontPresetLists();
                renderThemeFontPreview();
                await handleAction_156(themeState_2, {
                    fallbackOnError: false,
                });
                await saveGlobalData();
                if (value_760) showToast(value_760);
                return true;
            } catch (error_12) {
                return (
                    console.warn('Failed to activate theme font:', error_12),
                    showToast(error_12?.message || '字体加载失败'),
                    false
                );
            } finally {
                if (themeFontAddBtn) themeFontAddBtn.disabled = false;
            }
        }
        async function handleAction_159(preset_13) {
            const wasActive =
                themeState_2.fontMode === 'saved' && themeState_2.fontPresetKey === preset_13.id;
            themeState_2.savedFontPresets = themeState_2.savedFontPresets.filter(
                (item_3) => item_3.id !== preset_13.id,
            );
            if (wasActive)
                setThemeFontStateFromDefinition({
                    ...BUILTIN_THEME_FONTS[0],
                    type: 'builtin',
                });
            renderThemeFontPresetLists();
            renderThemeFontPreview();
            if (wasActive) await handleAction_156(themeState_2);
            await saveGlobalData();
            if (preset_13.fontAssetId && typeof window.appStorage?.deleteAsset === 'function') {
                const stillReferenced = themeState_2.savedFontPresets.some(
                    (item_4) => item_4.fontAssetId === preset_13.fontAssetId,
                );
                if (!stillReferenced) await window.appStorage.deleteAsset(preset_13.fontAssetId);
            }
            showToast('已删除字体 ' + preset_13.label);
        }
        function renderThemeFontPresetLists() {
            if (!themeFontModalUserPresetList) return;
            themeFontModalUserPresetList.innerHTML = '';
            const builtin_2 = BUILTIN_THEME_FONTS[0];
            themeFontModalUserPresetList.appendChild(
                handleAction_157({
                    label: builtin_2.label,
                    family: builtin_2.family,
                    isActive: themeState_2.fontMode === 'preset',
                    onSelect: () =>
                        handleAction_158(
                            {
                                ...builtin_2,
                                type: 'builtin',
                            },
                            '已切换到 ' + builtin_2.label,
                        ),
                }),
            );
            themeState_2.savedFontPresets.forEach((value_768) => {
                themeFontModalUserPresetList.appendChild(
                    handleAction_157({
                        label: value_768.label,
                        family: value_768.family,
                        isActive:
                            themeState_2.fontMode === 'saved' &&
                            themeState_2.fontPresetKey === value_768.id,
                        onSelect: () => handleAction_158(value_768, '已切换到 ' + value_768.label),
                        onDelete: () => handleAction_159(value_768),
                    }),
                );
            });
        }
        function setThemeFontSourceMode(mode) {
            themeFontSourceMode = mode === 'link' ? 'link' : 'local';
            themeFontSourceTabs.forEach((tab) => {
                const active = tab.dataset.fontSource === themeFontSourceMode;
                tab.classList.toggle('active', active);
                tab.setAttribute('aria-selected', String(active));
            });
            themeFontSourcePanels.forEach((panel) => {
                const active_3 = panel.dataset.fontSourcePanel === themeFontSourceMode;
                panel.classList.toggle('active', active_3);
                panel.hidden = !active_3;
            });
        }
        function updateThemeFontFileStatus(message_2 = '') {
            if (!themeFontFileStatus) return;
            themeFontFileStatus.classList.remove('is-ready', 'is-warning');
            if (!themeFontSelectedFile) {
                themeFontFileStatus.textContent =
                    message_2 || '支持 TTF、OTF、WOFF、WOFF2，单个文件不超过 20 MB';
                return;
            }
            const toFixed_771 = (themeFontSelectedFile.size / 1048576).toFixed(1),
                largeFile = themeFontSelectedFile.size > THEME_FONT_WARNING_FILE_SIZE;
            themeFontFileStatus.classList.add(largeFile ? 'is-warning' : 'is-ready');
            themeFontFileStatus.textContent = largeFile
                ? themeFontSelectedFile.name +
                  ' · ' +
                  toFixed_771 +
                  ' MB，文件较大，建议优先使用 WOFF2'
                : themeFontSelectedFile.name + ' · ' + toFixed_771 + ' MB，已准备添加';
        }
        async function handleAction_160(file_6) {
            if (typeof window.appStorage?.blobToDataUrl === 'function')
                return window.appStorage.blobToDataUrl(file_6);
            return new Promise((resolve_3, reject_2) => {
                const reader = new FileReader();
                reader.onload = () => resolve_3(String(reader.result || ''));
                reader.onerror = () => reject_2(reader.error || new Error('字体文件读取失败'));
                reader.readAsDataURL(file_6);
            });
        }
        function buildThemeFontLinkSources(url_4, format_4) {
            const sources_5 = cloneThemeFontSources();
            return ((sources_5[format_4 || 'woff2'] = url_4), sources_5);
        }
        async function handleAction_162() {
            ensureThemeFontStateShape();
            const rawName =
                    themeFontSourceMode === 'local'
                        ? themeFontLocalNameInput?.value
                        : themeFontNameInput?.value,
                name_6 = sanitizeThemeFontLabel(rawName || '');
            if (!String(rawName || '').trim()) {
                showToast('请填写字体名称');
                return;
            }
            const existingIndex_5 = themeState_2.savedFontPresets.findIndex(
                    (preset_14) => preset_14.name === name_6,
                ),
                previousPreset =
                    existingIndex_5 >= 0 ? themeState_2.savedFontPresets[existingIndex_5] : null,
                id_4 = previousPreset?.id || 'font_preset_' + Date.now(),
                cssName_3 = handleAction_146(id_4);
            let nextPreset = null,
                newAssetId = '';
            try {
                if (themeFontAddBtn) themeFontAddBtn.disabled = true;
                if (themeFontSourceMode === 'local') {
                    const file_7 = themeFontSelectedFile,
                        fontFormat_3 = inferThemeFontFormat(file_7?.name || '');
                    if (!file_7 || !fontFormat_3) throw new Error('请选择支持的字体文件');
                    if (file_7.size <= 0) throw new Error('字体文件为空');
                    if (file_7.size > THEME_FONT_MAX_FILE_SIZE)
                        throw new Error('字体文件不能超过 20 MB');
                    if (typeof window.appStorage?.saveAssetFromDataUrl !== 'function')
                        throw new Error('字体存储服务不可用');
                    const dataUrl_2 = await handleAction_160(file_7);
                    newAssetId = 'theme_font_' + id_4 + '_' + Date.now();
                    await window.appStorage.saveAssetFromDataUrl(newAssetId, dataUrl_2, {
                        kind: 'theme-font',
                        fileName: file_7.name,
                        fontFormat: fontFormat_3,
                    });
                    nextPreset = normalizeThemeFontPreset({
                        id: id_4,
                        name: name_6,
                        cssName: cssName_3,
                        sourceType: 'local',
                        fontAssetId: newAssetId,
                        fontFormat: fontFormat_3,
                        sources: {},
                    });
                } else {
                    const rawUrl_2 = String(themeFontUrlInput?.value || '').trim();
                    let parsedUrl;
                    try {
                        parsedUrl = new URL(rawUrl_2);
                    } catch (value_794) {
                        throw new Error('请输入完整的字体链接');
                    }
                    if (!['http:', 'https:'].includes(parsedUrl.protocol))
                        throw new Error('字体链接仅支持 HTTP 或 HTTPS');
                    const format_5 = inferThemeFontFormat(parsedUrl.pathname) || 'woff2';
                    nextPreset = normalizeThemeFontPreset({
                        id: id_4,
                        name: name_6,
                        cssName: cssName_3,
                        sourceType: 'link',
                        fontFormat: format_5,
                        sources: buildThemeFontLinkSources(rawUrl_2, format_5),
                    });
                }
                await handleAction_155(nextPreset);
                if (existingIndex_5 >= 0)
                    themeState_2.savedFontPresets[existingIndex_5] = nextPreset;
                else themeState_2.savedFontPresets.push(nextPreset);
                setThemeFontStateFromDefinition(nextPreset);
                renderThemeFontPresetLists();
                renderThemeFontPreview();
                await handleAction_156(themeState_2, {
                    fallbackOnError: false,
                });
                await saveGlobalData();
                previousPreset?.fontAssetId &&
                    previousPreset.fontAssetId !== newAssetId &&
                    typeof window.appStorage?.deleteAsset === 'function' &&
                    (await window.appStorage.deleteAsset(previousPreset.fontAssetId));
                syncThemeFontInputsFromState();
                showToast(existingIndex_5 >= 0 ? '字体已更新并应用' : '字体已添加并应用');
            } catch (error_13) {
                console.warn('Failed to add theme font:', error_13);
                newAssetId &&
                    typeof window.appStorage?.deleteAsset === 'function' &&
                    (await window.appStorage.deleteAsset(newAssetId)['catch'](() => undefined));
                showToast(error_13?.message || '字体添加失败');
            } finally {
                if (themeFontAddBtn) themeFontAddBtn.disabled = false;
            }
        }
        function openThemeFontModal() {
            if (!themeFontModal) return;
            syncThemeFontInputsFromState();
            renderThemeFontPresetLists();
            setThemeFontSourceMode('local');
            themeFontModal.classList.add('active');
            themeFontModal.setAttribute('aria-hidden', 'false');
        }
        function closeThemeFontModal() {
            if (!themeFontModal) return;
            themeFontModal.classList.remove('active');
            themeFontModal.setAttribute('aria-hidden', 'true');
        }
        themeFontBtn?.addEventListener('click', (event_796) => {
            event_796.stopPropagation();
            openThemeFontModal();
        });
        themeFontCloseBtn?.addEventListener('click', closeThemeFontModal);
        themeFontModal?.addEventListener('click', (event_4) => {
            if (event_4.target === themeFontModal) closeThemeFontModal();
        });
        document.addEventListener('keydown', (event_5) => {
            if (event_5.key === 'Escape' && themeFontModal?.classList.contains('active'))
                closeThemeFontModal();
        });
        themeFontSourceTabs.forEach((tab_3) =>
            tab_3.addEventListener('click', () => setThemeFontSourceMode(tab_3.dataset.fontSource)),
        );
        themeFontUploadBtn?.addEventListener('click', () => themeFontFileInput?.click());
        themeFontFileInput?.addEventListener('change', () => {
            const file_8 = themeFontFileInput.files?.[0] || null,
                format_6 = inferThemeFontFormat(file_8?.name || '');
            if (!file_8 || !format_6) {
                themeFontSelectedFile = null;
                updateThemeFontFileStatus(file_8 ? '不支持该字体格式' : '');
                if (file_8) showToast('仅支持 TTF、OTF、WOFF、WOFF2');
                return;
            }
            if (file_8.size > THEME_FONT_MAX_FILE_SIZE) {
                themeFontSelectedFile = null;
                themeFontFileInput.value = '';
                updateThemeFontFileStatus('字体文件不能超过 20 MB');
                showToast('字体文件不能超过 20 MB');
                return;
            }
            themeFontSelectedFile = file_8;
            themeFontLocalNameInput &&
                !themeFontLocalNameInput.value.trim() &&
                (themeFontLocalNameInput.value = file_8.name.replace(/\.[^.]+$/, ''));
            updateThemeFontFileStatus();
        });
        themeFontAddBtn?.addEventListener('click', handleAction_162);
        themeFontSizeSlider &&
            (themeFontSizeSlider.addEventListener('input', (event_6) => {
                themeState_2.fontSize = normalizeThemeFontSize(event_6.target.value);
                renderThemeFontPreview();
                const family_3 =
                    document.documentElement.style.getPropertyValue('--theme-font-family') ||
                    getActiveThemeFontDefinition(themeState_2).family;
                applyThemeFontCss(family_3, themeState_2.fontSize);
                scheduleThemeFontSave();
            }),
            themeFontSizeSlider.addEventListener('change', () => {
                themeFontSaveTimer &&
                    (clearTimeout(themeFontSaveTimer), (themeFontSaveTimer = null));
                saveGlobalData();
                showToast('字体大小已调整为 ' + themeState_2.fontSize + 'px');
            }));
        enabled_20 = true;
        await handleAction_40();
        document.dispatchEvent(new CustomEvent('u2-theme-state-ready'));
        function saveGlobalData() {
            return persistSettingsData();
        }
        function normalizeVectorMemoryConfig_2(value_15) {
            if (window.u2Api?.normalizeVectorMemoryConfig)
                return window.u2Api.normalizeVectorMemoryConfig(value_15);
            const source_3 = value_15 && typeof value_15 === 'object' ? value_15 : {};
            return {
                enabled: source_3.enabled === true,
                provider: String(source_3.provider || 'siliconflow').trim(),
                endpoint: String(source_3.endpoint || '').trim(),
                apiKey: String(source_3.apiKey || '').trim(),
                model: String(source_3.model || '').trim(),
            };
        }
        function getVectorMemoryProviders() {
            return window.u2Api?.VECTOR_MEMORY_PROVIDERS || window.imVectorMemory?.PROVIDERS || {};
        }
        function getVectorMemoryProviderMeta(provider_2) {
            const providers_2 = getVectorMemoryProviders();
            return (
                providers_2[provider_2] ||
                providers_2.siliconflow || {
                    defaultModel: '',
                    models: [],
                }
            );
        }
        function getSelectedVectorMemoryModel() {
            const selected = String(UI.inputs.vectorMemoryModel?.value || '').trim();
            return selected === '__custom__'
                ? String(UI.inputs.vectorMemoryCustomModel?.value || '').trim()
                : selected;
        }
        function getVectorMemoryConfigDraft() {
            return normalizeVectorMemoryConfig_2({
                enabled: !!UI.inputs.vectorMemoryEnabled?.checked,
                provider: String(UI.inputs.vectorMemoryProvider?.value || 'siliconflow').trim(),
                endpoint: String(UI.inputs.vectorMemoryEndpoint?.value || '').trim(),
                apiKey: String(UI.inputs.vectorMemoryApiKey?.value || '').trim(),
                model: getSelectedVectorMemoryModel(),
            });
        }
        function renderVectorMemoryModelOptions(
            selectedConfig = vectorMemoryConfig_2,
            preferredModel = '',
        ) {
            const select_2 = UI.inputs.vectorMemoryModel;
            if (!select_2) return;
            const provider_3 = String(
                    selectedConfig?.provider ||
                        UI.inputs.vectorMemoryProvider?.value ||
                        'siliconflow',
                ),
                providerMeta = getVectorMemoryProviderMeta(provider_3),
                selectedModel_2 = String(
                    preferredModel || selectedConfig?.model || providerMeta.defaultModel || '',
                ).trim(),
                models_2 = Array.isArray(providerMeta.models)
                    ? providerMeta.models.map(String).filter(Boolean)
                    : [];
            select_2.replaceChildren();
            models_2.forEach((model_2) => {
                const option_3 = document.createElement('option');
                option_3.value = model_2;
                option_3.textContent = model_2;
                select_2.append(option_3);
            });
            const customOption = document.createElement('option');
            customOption.value = '__custom__';
            customOption.textContent = '自定义模型';
            select_2.append(customOption);
            const usesCustomModel = !models_2.includes(selectedModel_2);
            select_2.value = usesCustomModel ? '__custom__' : selectedModel_2;
            UI.inputs.vectorMemoryCustomModel &&
                (UI.inputs.vectorMemoryCustomModel.value = usesCustomModel ? selectedModel_2 : '');
            UI.inputs.vectorMemoryCustomModelRow &&
                (UI.inputs.vectorMemoryCustomModelRow.hidden = !usesCustomModel);
        }
        function syncVectorMemoryConfigInputs() {
            const config_2 = normalizeVectorMemoryConfig_2(vectorMemoryConfig_2);
            if (UI.inputs.vectorMemoryEnabled)
                UI.inputs.vectorMemoryEnabled.checked = config_2.enabled;
            if (UI.inputs.vectorMemoryProvider)
                UI.inputs.vectorMemoryProvider.value = config_2.provider;
            if (UI.inputs.vectorMemoryEndpoint)
                UI.inputs.vectorMemoryEndpoint.value = config_2.endpoint;
            if (UI.inputs.vectorMemoryApiKey) UI.inputs.vectorMemoryApiKey.value = config_2.apiKey;
            UI.inputs.vectorMemoryCustomEndpointRow &&
                (UI.inputs.vectorMemoryCustomEndpointRow.hidden =
                    config_2.provider !== 'openai-compatible');
            renderVectorMemoryModelOptions(config_2);
            handleU2VectorMemoryStatus();
        }
        function handleU2VectorMemoryStatus() {
            const status_2 = document.getElementById('vector-memory-config-status'),
                config_3 = normalizeVectorMemoryConfig_2(vectorMemoryConfig_2);
            status_2 &&
                (status_2.textContent = config_3.enabled
                    ? config_3.apiKey &&
                      config_3.model &&
                      (config_3.provider !== 'openai-compatible' || config_3.endpoint)
                        ? '已启用'
                        : '待配置'
                    : '关闭');
            const runtimeStatus = window.imVectorMemory?.getStatus?.();
            UI.inputs.vectorMemoryIndexStatus &&
                (UI.inputs.vectorMemoryIndexStatus.textContent =
                    runtimeStatus?.message ||
                    (config_3.enabled ? '保存后将自动同步全部记忆' : '未启用'));
        }
        handleU2VectorMemoryStatus();
        function handleAction_167() {
            if (
                window.u2BackgroundActivity &&
                typeof window.u2BackgroundActivity.getSettings === 'function'
            )
                return window.u2BackgroundActivity.getSettings();
            return {
                enabled: false,
                intervalSeconds: 60,
            };
        }
        function handleU2BackgroundActivitySettingsChanged() {
            const settings_2 = handleAction_167();
            UI.inputs.bgActivityToggle &&
                (UI.inputs.bgActivityToggle.checked = !!settings_2.enabled);
        }
        function applyBackgroundActivityControls(value_821 = false) {
            const currentSettings = handleAction_167(),
                intervalSeconds_2 = currentSettings.intervalSeconds || 60,
                enabled_3 = !!UI.inputs.bgActivityToggle?.checked;
            if (
                window.u2BackgroundActivity &&
                typeof window.u2BackgroundActivity.updateSettings === 'function'
            )
                window.u2BackgroundActivity.updateSettings({
                    enabled: enabled_3,
                    intervalSeconds: intervalSeconds_2,
                });
            else
                window.StorageManager &&
                    typeof window.StorageManager.save === 'function' &&
                    window.StorageManager.save('u2_backgroundActivitySettings', {
                        enabled: enabled_3,
                        intervalSeconds: intervalSeconds_2,
                        lastTickAt: 0,
                    });
            value_821 &&
                typeof showToast === 'function' &&
                showToast(enabled_3 ? '后台保活已开启' : '后台保活已关闭');
        }
        UI.inputs.bgActivityToggle &&
            (UI.inputs.bgActivityToggle.addEventListener('change', () => {
                applyBackgroundActivityControls(true);
            }),
            window.addEventListener(
                'u2:background-activity-settings-changed',
                handleU2BackgroundActivitySettingsChanged,
            ));
        const MAX_NOTIFICATION_SOUND_BYTES = 5242880;
        function syncSystemNotificationControls() {
            if (!UI.inputs.systemNotificationToggle) return;
            const settings_3 = window.u2SystemNotifications?.getSettings
                    ? window.u2SystemNotifications.getSettings()
                    : {
                          enabled: false,
                          hasCustomSound: false,
                      },
                checked_2 = !!settings_3.enabled,
                hasCustomSound_2 = !!settings_3.hasCustomSound;
            UI.inputs.systemNotificationToggle.checked = checked_2;
            UI.inputs.notificationSettingsGroup?.classList.toggle('is-sound-expanded', checked_2);
            UI.inputs.notificationSoundSettings?.classList.toggle('is-visible', checked_2);
            UI.inputs.notificationSoundSettings?.setAttribute('aria-hidden', String(!checked_2));
            UI.inputs.notificationSoundActions?.classList.toggle('is-visible', hasCustomSound_2);
            UI.inputs.notificationSoundActions?.setAttribute(
                'aria-hidden',
                String(!hasCustomSound_2),
            );
            UI.inputs.notificationSoundFileName &&
                (UI.inputs.notificationSoundFileName.textContent = hasCustomSound_2
                    ? (settings_3.soundFileName || '自定义提示音') + ' · 已保存，可试听'
                    : '默认使用系统提示音');
            UI.inputs.notificationSoundUploadLabel &&
                (UI.inputs.notificationSoundUploadLabel.textContent = hasCustomSound_2
                    ? '更换'
                    : '上传音频');
        }
        async function applySystemNotificationControls(value_828 = false) {
            if (!UI.inputs.systemNotificationToggle) return;
            const enabled_4 = !!UI.inputs.systemNotificationToggle.checked;
            if (window.u2SystemNotifications?.updateSettings) {
                const result_4 = await window.u2SystemNotifications.updateSettings({
                    enabled: enabled_4,
                });
                UI.inputs.systemNotificationToggle.checked = !!result_4.enabled;
                if (value_828 && typeof showToast === 'function') {
                    if (result_4.unsupported) showToast('当前浏览器不支持系统通知');
                    else
                        result_4.permission === 'denied'
                            ? showToast('系统通知权限被拒绝，请在浏览器设置中开启')
                            : showToast(result_4.enabled ? '消息通知已开启' : '消息通知已关闭');
                }
                return;
            }
            UI.inputs.systemNotificationToggle.checked = false;
            value_828 && typeof showToast === 'function' && showToast('消息通知模块未加载');
        }
        UI.inputs.systemNotificationToggle &&
            (UI.inputs.systemNotificationToggle.addEventListener('change', async () => {
                UI.inputs.systemNotificationToggle.disabled = true;
                try {
                    await applySystemNotificationControls(true);
                } finally {
                    UI.inputs.systemNotificationToggle.disabled = false;
                    syncSystemNotificationControls();
                }
            }),
            window.addEventListener(
                'u2:system-notification-settings-changed',
                syncSystemNotificationControls,
            ));
        function readNotificationSoundFile(file_9) {
            return new Promise((resolve_4, reject_3) => {
                const reader_3 = new FileReader();
                reader_3.onload = () => resolve_4(String(reader_3.result || ''));
                reader_3.onerror = () => reject_3(reader_3.error || new Error('音频读取失败'));
                reader_3.readAsDataURL(file_9);
            });
        }
        UI.inputs.notificationSoundUploadBtn &&
            UI.inputs.notificationSoundFileInput &&
            (UI.inputs.notificationSoundUploadBtn.addEventListener('click', () => {
                UI.inputs.notificationSoundFileInput.click();
            }),
            UI.inputs.notificationSoundFileInput.addEventListener('change', async (event_7) => {
                const file_10 = event_7.target.files?.[0];
                if (!file_10) return;
                try {
                    if (file_10.type && !file_10.type.startsWith('audio/')) {
                        showToast('请选择音频文件');
                        return;
                    }
                    if (file_10.size > MAX_NOTIFICATION_SOUND_BYTES) {
                        showToast('提示音不能超过 5 MB');
                        return;
                    }
                    if (!window.u2SystemNotifications?.setCustomSound) {
                        showToast('消息通知模块未加载');
                        return;
                    }
                    UI.inputs.notificationSoundUploadBtn.disabled = true;
                    const dataUrl_3 = await readNotificationSoundFile(file_10);
                    await window.u2SystemNotifications.setCustomSound({
                        dataUrl: dataUrl_3,
                        fileName: file_10.name,
                        mimeType: file_10.type || 'application/octet-stream',
                    });
                    syncSystemNotificationControls();
                    showToast('消息提示音已更新');
                } catch (error_14) {
                    console.error('[settings] Failed to save notification sound:', error_14);
                    showToast(
                        error_14?.name === 'QuotaExceededError'
                            ? '存储空间不足，无法保存提示音'
                            : '提示音保存失败',
                    );
                } finally {
                    UI.inputs.notificationSoundUploadBtn.disabled = false;
                    event_7.target.value = '';
                }
            }));
        UI.inputs.notificationSoundPreviewBtn &&
            UI.inputs.notificationSoundPreviewBtn.addEventListener('click', async () => {
                const played = await window.u2SystemNotifications?.playNotificationSound?.();
                if (!played) showToast('提示音暂时无法播放');
            });
        UI.inputs.notificationSoundRemoveBtn &&
            UI.inputs.notificationSoundRemoveBtn.addEventListener('click', async () => {
                if (!window.u2SystemNotifications?.clearCustomSound) return;
                UI.inputs.notificationSoundRemoveBtn.disabled = true;
                try {
                    await window.u2SystemNotifications.clearCustomSound();
                    syncSystemNotificationControls();
                    showToast('已恢复系统提示音');
                } catch (error_15) {
                    console.error('[settings] Failed to remove notification sound:', error_15);
                    showToast('提示音移除失败');
                } finally {
                    UI.inputs.notificationSoundRemoveBtn.disabled = false;
                }
            });
        const assistiveBallConfigBtn = document.getElementById('assistive-ball-config-btn');
        let assistiveBallEl = null,
            assistiveBallPanelEl = null,
            assistivePresetSelectEl = null,
            assistiveDragState_3 = null,
            assistiveDragFrame = null,
            value_172 = null,
            assistivePositionSaveTimer = null;
        function getCurrentApiPresetId() {
            if (!Array.isArray(apiPresets_2)) return '';
            const match_3 = apiPresets_2.find(
                (value_841) =>
                    (value_841.provider || 'openai-compatible') ===
                        (apiConfig_2.provider || 'openai-compatible') &&
                    (value_841.endpoint || '') === (apiConfig_2.endpoint || '') &&
                    (value_841.apiKey || '') === (apiConfig_2.apiKey || '') &&
                    (value_841.model || '') === (apiConfig_2.model || '') &&
                    String(value_841.temp ?? 0.7) === String(apiConfig_2.temperature ?? 0.7) &&
                    String(value_841.frequencyPenalty ?? 0) ===
                        String(apiConfig_2.frequencyPenalty ?? 0),
            );
            return match_3 ? String(match_3.id) : '';
        }
        function getApiDisplayValue(value_16, fallback = '未设置') {
            const text_3 = String(value_16 || '').trim();
            return text_3 || fallback;
        }
        function handleAction_175(searchText_4) {
            const text_4 = String(searchText_4 || '').trim();
            if (!text_4) return '未设置';
            if (text_4.length <= 8) return '已填写';
            return text_4.slice(0, 4) + '...' + text_4.slice(-4);
        }
        function normalizeAssistiveBallOpacity(value_17) {
            const numeric = parseFloat(value_17);
            if (!Number.isFinite(numeric)) return 0.72;
            return Math.max(0.2, Math.min(1, numeric > 1 ? numeric / 100 : numeric));
        }
        function normalizeAssistiveBallSize(value_18) {
            const numeric_2 = parseFloat(value_18);
            if (!Number.isFinite(numeric_2)) return 58;
            return Math.round(Math.max(36, Math.min(96, numeric_2)) / 2) * 2;
        }
        function normalizeAssistiveBallImageUrl(value_19) {
            const imageUrl_2 = typeof value_19 === 'string' ? value_19.trim() : '';
            if (!imageUrl_2) return '';
            if (/^data:image\/png;base64,/i.test(imageUrl_2)) return imageUrl_2;
            try {
                const parsed_2 = new URL(imageUrl_2);
                return parsed_2.protocol === 'http:' || parsed_2.protocol === 'https:'
                    ? imageUrl_2
                    : '';
            } catch (error_16) {
                return '';
            }
        }
        function preloadAssistiveBallImage(imageUrl_3) {
            return new Promise((resolve_5, reject_4) => {
                const image = new Image();
                image.onload = () => resolve_5(imageUrl_3);
                image.onerror = () => reject_4(new Error('Failed to load assistive ball image'));
                image.src = imageUrl_3;
            });
        }
        function renderDefaultAssistiveBallAppearance() {
            if (!assistiveBallEl) return;
            const inner = assistiveBallEl.querySelector('.assistive-api-ball-inner');
            assistiveBallEl.classList.remove('has-custom-image');
            if (inner) inner.innerHTML = '<i class="fas fa-circle-dot"></i>';
        }
        function applyAssistiveBallAppearance() {
            if (!assistiveBallEl) return;
            const inner_2 = assistiveBallEl.querySelector('.assistive-api-ball-inner'),
                src_2 = normalizeAssistiveBallImageUrl(assistiveBallSettings_2.imageUrl);
            if (!inner_2 || !src_2) {
                renderDefaultAssistiveBallAppearance();
                return;
            }
            assistiveBallEl.classList.add('has-custom-image');
            inner_2.innerHTML = '';
            const image_3 = document.createElement('img');
            image_3.className = 'assistive-api-ball-image';
            image_3.alt = '';
            image_3.draggable = false;
            image_3.addEventListener(
                'error',
                () => {
                    normalizeAssistiveBallImageUrl(assistiveBallSettings_2.imageUrl) === src_2 &&
                        renderDefaultAssistiveBallAppearance();
                },
                {
                    once: true,
                },
            );
            image_3.src = src_2;
            inner_2.appendChild(image_3);
        }
        function syncAssistiveBallImageControls() {
            UI.inputs.assistiveBallImageUrl &&
                (UI.inputs.assistiveBallImageUrl.value = normalizeAssistiveBallImageUrl(
                    assistiveBallSettings_2.imageUrl,
                ));
        }
        async function setAssistiveBallImage(value_858, value_859) {
            const imageUrl_4 = normalizeAssistiveBallImageUrl(value_858);
            if (!imageUrl_4) return (showToast('请输入有效的 http(s) 图片链接'), false);
            try {
                await preloadAssistiveBallImage(imageUrl_4);
            } catch (value_861) {
                return (showToast('图片加载失败，请检查链接或图片文件'), false);
            }
            return (
                (assistiveBallSettings_2.imageUrl = imageUrl_4),
                ensureAssistiveBallDom(),
                applyAssistiveBallAppearance(),
                syncAssistiveBallImageControls(),
                await saveGlobalData(),
                showToast(value_859),
                true
            );
        }
        function syncAssistiveBallOpacityControls() {
            assistiveBallSettings_2.opacity = normalizeAssistiveBallOpacity(
                assistiveBallSettings_2.opacity,
            );
            const percent = Math.round(assistiveBallSettings_2.opacity * 100);
            UI.inputs.assistiveBallOpacity &&
                (UI.inputs.assistiveBallOpacity.value = String(percent));
            UI.inputs.assistiveBallOpacityValue &&
                (UI.inputs.assistiveBallOpacityValue.textContent = percent + '%');
            assistiveBallEl &&
                assistiveBallEl.style.setProperty(
                    '--assistive-ball-opacity',
                    assistiveBallSettings_2.opacity.toFixed(2),
                );
        }
        function syncAssistiveBallSizeControls() {
            assistiveBallSettings_2.size = normalizeAssistiveBallSize(assistiveBallSettings_2.size);
            UI.inputs.assistiveBallSize &&
                (UI.inputs.assistiveBallSize.value = String(assistiveBallSettings_2.size));
            UI.inputs.assistiveBallSizeValue &&
                (UI.inputs.assistiveBallSizeValue.textContent =
                    assistiveBallSettings_2.size + 'px');
            assistiveBallEl &&
                assistiveBallEl.style.setProperty(
                    '--assistive-ball-size',
                    assistiveBallSettings_2.size + 'px',
                );
        }
        function ensureAssistiveBallDom() {
            const appContainer = document.getElementById('app') || document.body;
            !assistiveBallEl &&
                ((assistiveBallEl = document.createElement('div')),
                (assistiveBallEl.id = 'global-assistive-api-ball'),
                (assistiveBallEl.className = 'assistive-api-ball'),
                assistiveBallEl.setAttribute('role', 'button'),
                assistiveBallEl.setAttribute('aria-label', 'API 悬浮球'),
                (assistiveBallEl.innerHTML =
                    '<div class="assistive-api-ball-inner"><i class="fas fa-circle-dot"></i></div>'),
                appContainer.appendChild(assistiveBallEl),
                assistiveBallEl.addEventListener('click', (event_8) => {
                    event_8.stopPropagation();
                    if (assistiveBallEl.dataset.dragged === 'true') {
                        assistiveBallEl.dataset.dragged = 'false';
                        return;
                    }
                    openAssistiveBallPanel();
                }),
                assistiveBallEl.addEventListener('pointerdown', handlePointerdown),
                syncAssistiveBallOpacityControls(),
                syncAssistiveBallSizeControls(),
                applyAssistiveBallAppearance());
            !assistiveBallPanelEl &&
                ((assistiveBallPanelEl = document.createElement('div')),
                (assistiveBallPanelEl.id = 'global-assistive-api-panel'),
                (assistiveBallPanelEl.className = 'assistive-api-panel'),
                (assistiveBallPanelEl.innerHTML = `
                    <div class="assistive-api-panel-title">当前 API</div>
                    <div class="assistive-api-row">
                        <span>模型</span>
                        <strong id="assistive-api-model">未设置</strong>
                    </div>
                    <label class="assistive-api-select-wrap">
                        <span>API 预设</span>
                        <select id="assistive-api-preset-select"></select>
                        <i class="fas fa-chevron-down"></i>
                    </label>
                `),
                appContainer.appendChild(assistiveBallPanelEl),
                (assistivePresetSelectEl = assistiveBallPanelEl.querySelector(
                    '#assistive-api-preset-select',
                )),
                assistiveBallPanelEl.addEventListener('click', (event_865) => {
                    event_865.stopPropagation();
                    event_865.target === assistiveBallPanelEl && handleAction_176();
                }),
                assistivePresetSelectEl?.addEventListener('change', (event_9) => {
                    applyAssistivePreset(event_9.target.value);
                }));
        }
        function openAssistiveBallPanel() {
            ensureAssistiveBallDom();
            syncAssistiveBallPanel();
            assistiveBallEl.classList.remove('visible');
            assistiveBallEl.classList.add('panel-open');
            assistiveBallPanelEl.classList.add('active');
        }
        function handleAction_176() {
            if (assistiveBallPanelEl) assistiveBallPanelEl.classList.remove('active');
            assistiveBallEl &&
                (assistiveBallEl.classList.remove('panel-open'),
                assistiveBallEl.classList.toggle('visible', assistiveBallSettings_2.enabled));
        }
        function clampAssistiveBallPosition(x_2, y_2, value_869 = null) {
            if (!assistiveBallEl)
                return {
                    x: 0,
                    y: 0,
                };
            let bounds = value_869;
            if (!bounds) {
                const value_872 = assistiveBallEl.parentElement || document.body,
                    parentRect = value_872.getBoundingClientRect(),
                    ballRect = assistiveBallEl.getBoundingClientRect();
                bounds = {
                    parentWidth: parentRect.width,
                    parentHeight: parentRect.height,
                    ballWidth: ballRect.width || 58,
                    ballHeight: ballRect.height || 58,
                };
            }
            const margin = 8;
            return {
                x: Math.max(margin, Math.min(x_2, bounds.parentWidth - bounds.ballWidth - margin)),
                y: Math.max(
                    margin,
                    Math.min(y_2, bounds.parentHeight - bounds.ballHeight - margin),
                ),
            };
        }
        function applyAssistiveBallPosition() {
            if (!assistiveBallEl) return;
            const value_874 = assistiveBallEl.parentElement || document.body,
                parentRect_2 = value_874.getBoundingClientRect(),
                currentRect = assistiveBallEl.getBoundingClientRect(),
                fallbackX = parentRect_2.width - (currentRect.width || 58) - 12,
                fallbackY = parentRect_2.height * 0.46,
                next = clampAssistiveBallPosition(
                    Number.isFinite(assistiveBallSettings_2.x)
                        ? assistiveBallSettings_2.x
                        : fallbackX,
                    Number.isFinite(assistiveBallSettings_2.y)
                        ? assistiveBallSettings_2.y
                        : fallbackY,
                    {
                        parentWidth: parentRect_2.width,
                        parentHeight: parentRect_2.height,
                        ballWidth: currentRect.width || 58,
                        ballHeight: currentRect.height || 58,
                    },
                );
            assistiveBallSettings_2.x = next.x;
            assistiveBallSettings_2.y = next.y;
            assistiveBallEl.style.left = next.x + 'px';
            assistiveBallEl.style.top = next.y + 'px';
        }
        function handlePointerdown(event_10) {
            if (!assistiveBallEl) return;
            value_172 !== null && (cancelAnimationFrame(value_172), (value_172 = null));
            const value_881 = assistiveBallEl.parentElement || document.body,
                parentRect_3 = value_881.getBoundingClientRect(),
                ballRect_2 = assistiveBallEl.getBoundingClientRect();
            assistiveDragState_3 = {
                pointerId: event_10.pointerId,
                startClientX: event_10.clientX,
                startClientY: event_10.clientY,
                offsetX: event_10.clientX - ballRect_2.left,
                offsetY: event_10.clientY - ballRect_2.top,
                parentLeft: parentRect_3.left,
                parentTop: parentRect_3.top,
                parentWidth: parentRect_3.width,
                parentHeight: parentRect_3.height,
                ballWidth: ballRect_2.width || assistiveBallSettings_2.size || 58,
                ballHeight: ballRect_2.height || assistiveBallSettings_2.size || 58,
                originX: ballRect_2.left - parentRect_3.left,
                originY: ballRect_2.top - parentRect_3.top,
                nextX: ballRect_2.left - parentRect_3.left,
                nextY: ballRect_2.top - parentRect_3.top,
                latestClientX: event_10.clientX,
                latestClientY: event_10.clientY,
                moved: false,
            };
            assistiveBallEl.classList.add('dragging');
            assistiveBallEl.style.transform = 'translate3d(0, 0, 0) scale(0.96)';
            assistiveBallEl.setPointerCapture?.(event_10.pointerId);
            assistiveBallEl.addEventListener('pointermove', moveAssistiveBallDrag);
            assistiveBallEl.addEventListener('pointerup', endAssistiveBallDrag);
            assistiveBallEl.addEventListener('pointercancel', endAssistiveBallDrag);
        }
        function moveAssistiveBallDrag(event_11) {
            if (
                !assistiveDragState_3 ||
                !assistiveBallEl ||
                event_11.pointerId !== assistiveDragState_3.pointerId
            )
                return;
            event_11.preventDefault();
            assistiveDragState_3.latestClientX = event_11.clientX;
            assistiveDragState_3.latestClientY = event_11.clientY;
            const deltaX = event_11.clientX - assistiveDragState_3.startClientX,
                deltaY = event_11.clientY - assistiveDragState_3.startClientY;
            !assistiveDragState_3.moved &&
                Math.abs(deltaX) + Math.abs(deltaY) > 4 &&
                ((assistiveDragState_3.moved = true), handleAction_176());
            assistiveDragFrame === null &&
                (assistiveDragFrame = requestAnimationFrame(renderAssistiveBallDragFrame));
        }
        function renderAssistiveBallDragFrame() {
            assistiveDragFrame = null;
            if (!assistiveDragState_3 || !assistiveBallEl) return;
            const margin_2 = 8,
                rawX =
                    assistiveDragState_3.latestClientX -
                    assistiveDragState_3.parentLeft -
                    assistiveDragState_3.offsetX,
                rawY =
                    assistiveDragState_3.latestClientY -
                    assistiveDragState_3.parentTop -
                    assistiveDragState_3.offsetY,
                nextX_2 = Math.max(
                    margin_2,
                    Math.min(
                        rawX,
                        assistiveDragState_3.parentWidth -
                            assistiveDragState_3.ballWidth -
                            margin_2,
                    ),
                ),
                nextY_2 = Math.max(
                    margin_2,
                    Math.min(
                        rawY,
                        assistiveDragState_3.parentHeight -
                            assistiveDragState_3.ballHeight -
                            margin_2,
                    ),
                );
            assistiveDragState_3.nextX = nextX_2;
            assistiveDragState_3.nextY = nextY_2;
            const translateX = nextX_2 - assistiveDragState_3.originX,
                translateY = nextY_2 - assistiveDragState_3.originY;
            assistiveBallEl.style.transform =
                'translate3d(' + translateX + 'px, ' + translateY + 'px, 0) scale(0.96)';
        }
        function endAssistiveBallDrag(value_894) {
            if (!assistiveBallEl) return;
            const moved_2 = !!assistiveDragState_3?.moved;
            assistiveDragFrame !== null &&
                (cancelAnimationFrame(assistiveDragFrame),
                (assistiveDragFrame = null),
                renderAssistiveBallDragFrame());
            const x_3 = assistiveDragState_3?.nextX,
                y_3 = assistiveDragState_3?.nextY;
            assistiveBallEl.releasePointerCapture?.(value_894.pointerId);
            assistiveBallEl.removeEventListener('pointermove', moveAssistiveBallDrag);
            assistiveBallEl.removeEventListener('pointerup', endAssistiveBallDrag);
            assistiveBallEl.removeEventListener('pointercancel', endAssistiveBallDrag);
            assistiveDragState_3 = null;
            if (moved_2) {
                assistiveBallSettings_2.x = x_3;
                assistiveBallSettings_2.y = y_3;
                assistiveBallEl.style.left = x_3 + 'px';
                assistiveBallEl.style.top = y_3 + 'px';
                assistiveBallEl.style.transform = 'translate3d(0, 0, 0) scale(0.96)';
                assistiveBallEl.dataset.dragged = 'true';
                value_172 = requestAnimationFrame(() => {
                    value_172 = requestAnimationFrame(() => {
                        value_172 = null;
                        !assistiveDragState_3 &&
                            assistiveBallEl &&
                            (assistiveBallEl.classList.remove('dragging'),
                            (assistiveBallEl.style.transform = ''));
                    });
                });
                if (assistivePositionSaveTimer !== null) clearTimeout(assistivePositionSaveTimer);
                assistivePositionSaveTimer = window.setTimeout(() => {
                    assistivePositionSaveTimer = null;
                    saveGlobalData();
                }, 50);
                window.setTimeout(() => {
                    if (assistiveBallEl) assistiveBallEl.dataset.dragged = 'false';
                }, 0);
            } else {
                assistiveBallEl.classList.remove('dragging');
                assistiveBallEl.style.transform = '';
            }
        }
        function syncAssistiveBallPanel() {
            if (!assistiveBallPanelEl) return;
            const modelEl = assistiveBallPanelEl.querySelector('#assistive-api-model');
            if (modelEl) modelEl.textContent = getApiDisplayValue(apiConfig_2.model);
            if (!assistivePresetSelectEl) return;
            assistivePresetSelectEl.innerHTML = '';
            const placeholder_2 = document.createElement('option');
            placeholder_2.value = '';
            placeholder_2.textContent =
                Array.isArray(apiPresets_2) && apiPresets_2.length
                    ? '选择 API 预设'
                    : '暂无 API 预设';
            assistivePresetSelectEl.appendChild(placeholder_2);
            Array.isArray(apiPresets_2) &&
                apiPresets_2.forEach((preset_15) => {
                    const option = document.createElement('option');
                    option.value = String(preset_15.id);
                    option.textContent = preset_15.name || '未命名预设';
                    assistivePresetSelectEl.appendChild(option);
                });
            assistivePresetSelectEl.value = getCurrentApiPresetId();
        }
        function setAssistiveBallEnabled(enabled_5) {
            assistiveBallSettings_2.enabled = !!enabled_5;
            UI.inputs.assistiveBallToggle &&
                (UI.inputs.assistiveBallToggle.checked = assistiveBallSettings_2.enabled);
            ensureAssistiveBallDom();
            syncAssistiveBallOpacityControls();
            syncAssistiveBallSizeControls();
            applyAssistiveBallAppearance();
            applyAssistiveBallPosition();
            assistiveBallEl.classList.toggle('visible', assistiveBallSettings_2.enabled);
            !assistiveBallSettings_2.enabled ? handleAction_176() : syncAssistiveBallPanel();
        }
        function applyAssistivePreset(presetId_2) {
            const preset_16 = Array.isArray(apiPresets_2)
                ? apiPresets_2.find((item_5) => String(item_5.id) === String(presetId_2))
                : null;
            if (!preset_16) {
                syncAssistiveBallPanel();
                return;
            }
            apiConfig_2 = {
                provider: preset_16.provider || 'openai-compatible',
                endpoint: preset_16.endpoint || '',
                apiKey: preset_16.apiKey || '',
                model: preset_16.model || '',
                temperature: preset_16.temp ?? 0.7,
                frequencyPenalty: preset_16.frequencyPenalty ?? 0,
            };
            tempApiConfig = {
                ...apiConfig_2,
            };
            window.apiConfig = apiConfig_2;
            if (UI.inputs.apiProvider) UI.inputs.apiProvider.value = apiConfig_2.provider;
            syncApiProviderPresentation({
                provider: apiConfig_2.provider,
            });
            if (UI.inputs.apiEndpoint) UI.inputs.apiEndpoint.value = apiConfig_2.endpoint;
            if (UI.inputs.apiKey) UI.inputs.apiKey.value = apiConfig_2.apiKey;
            if (UI.inputs.apiModel) syncSelectValue(UI.inputs.apiModel, apiConfig_2.model || '');
            if (UI.inputs.apiTemp) UI.inputs.apiTemp.value = apiConfig_2.temperature;
            if (UI.inputs.apiFrequencyPenalty)
                UI.inputs.apiFrequencyPenalty.value = apiConfig_2.frequencyPenalty ?? 0;
            saveGlobalData();
            syncAssistiveBallPanel();
            showToast('已切换到 ' + (preset_16.name || '未命名预设'));
        }
        assistiveBallConfigBtn &&
            UI.overlays.assistiveBallSettings &&
            assistiveBallConfigBtn.addEventListener('click', () => {
                setAssistiveBallEnabled(assistiveBallSettings_2.enabled);
                syncAssistiveBallOpacityControls();
                syncAssistiveBallSizeControls();
                syncAssistiveBallImageControls();
                openView(UI.overlays.assistiveBallSettings);
            });
        UI.inputs.assistiveBallToggle &&
            UI.inputs.assistiveBallToggle.addEventListener('change', () => {
                setAssistiveBallEnabled(UI.inputs.assistiveBallToggle.checked);
                saveGlobalData();
                showToast(assistiveBallSettings_2.enabled ? '悬浮球已开启' : '悬浮球已关闭');
            });
        UI.inputs.assistiveBallOpacity &&
            (UI.inputs.assistiveBallOpacity.addEventListener('input', () => {
                assistiveBallSettings_2.opacity = normalizeAssistiveBallOpacity(
                    UI.inputs.assistiveBallOpacity.value,
                );
                syncAssistiveBallOpacityControls();
            }),
            UI.inputs.assistiveBallOpacity.addEventListener('change', () => {
                assistiveBallSettings_2.opacity = normalizeAssistiveBallOpacity(
                    UI.inputs.assistiveBallOpacity.value,
                );
                syncAssistiveBallOpacityControls();
                saveGlobalData();
            }));
        UI.inputs.assistiveBallSize &&
            (UI.inputs.assistiveBallSize.addEventListener('input', () => {
                assistiveBallSettings_2.size = normalizeAssistiveBallSize(
                    UI.inputs.assistiveBallSize.value,
                );
                syncAssistiveBallSizeControls();
                applyAssistiveBallPosition();
            }),
            UI.inputs.assistiveBallSize.addEventListener('change', () => {
                assistiveBallSettings_2.size = normalizeAssistiveBallSize(
                    UI.inputs.assistiveBallSize.value,
                );
                syncAssistiveBallSizeControls();
                applyAssistiveBallPosition();
                saveGlobalData();
            }));
        UI.inputs.assistiveBallImageUrlApply &&
            UI.inputs.assistiveBallImageUrlApply.addEventListener('click', () => {
                setAssistiveBallImage(UI.inputs.assistiveBallImageUrl?.value, '悬浮球图片已更新');
            });
        UI.inputs.assistiveBallImageUrl &&
            UI.inputs.assistiveBallImageUrl.addEventListener('keydown', (event_12) => {
                if (event_12.key !== 'Enter') return;
                event_12.preventDefault();
                setAssistiveBallImage(UI.inputs.assistiveBallImageUrl.value, '悬浮球图片已更新');
            });
        UI.inputs.assistiveBallImageUpload &&
            UI.inputs.assistiveBallImageFile &&
            (UI.inputs.assistiveBallImageUpload.addEventListener('click', () => {
                UI.inputs.assistiveBallImageFile.click();
            }),
            UI.inputs.assistiveBallImageFile.addEventListener('change', async (event_13) => {
                const file_11 = event_13.target.files?.[0];
                event_13.target.value = '';
                if (!file_11) return;
                if (file_11.type !== 'image/png') {
                    showToast('请上传 PNG 图片');
                    return;
                }
                try {
                    const compressedImageUrl = await readImageAsCompressedDataUrl_2(file_11, {
                        maxWidth: 256,
                        maxHeight: 256,
                        outputType: 'image/png',
                    });
                    await setAssistiveBallImage(compressedImageUrl, '悬浮球图片已压缩并更新');
                } catch (error_17) {
                    console.warn('Failed to compress assistive ball image:', error_17);
                    showToast('图片压缩失败，请重试');
                }
            }));
        UI.inputs.assistiveBallImageReset &&
            UI.inputs.assistiveBallImageReset.addEventListener('click', async () => {
                assistiveBallSettings_2.imageUrl = '';
                ensureAssistiveBallDom();
                applyAssistiveBallAppearance();
                syncAssistiveBallImageControls();
                await saveGlobalData();
                showToast('已恢复默认悬浮球');
            });
        document.addEventListener('click', (event_14) => {
            assistiveBallPanelEl?.classList.contains('active') &&
                !assistiveBallPanelEl.contains(event_14.target) &&
                handleAction_176();
        });
        window.u2AssistiveApiBall = {
            sync: syncAssistiveBallPanel,
            setEnabled: setAssistiveBallEnabled,
            getSettings: () => ({
                ...assistiveBallSettings_2,
            }),
        };
        setAssistiveBallEnabled(assistiveBallSettings_2.enabled);
        const API_MODEL_RENDER_LIMIT = 50,
            API_MODEL_SEARCH_DEBOUNCE_MS = 150;
        let count_183 = 0,
            apiModelRenderKey_2 = '',
            apiModelSearchTimer = null;
        function handleAction_185() {
            count_183 += 1;
            apiModelRenderKey_2 = '';
            apiModelSearchTimer &&
                (clearTimeout(apiModelSearchTimer), (apiModelSearchTimer = null));
        }
        function renderNativeModelSelect(
            searchText_5 = UI.inputs.apiModelSearch?.value || '',
            options_9 = {},
        ) {
            if (!UI.inputs.apiModelList) return;
            if (!options_9.force && UI.inputs.apiModelPicker?.hidden) return;
            const query = String(searchText_5 || '')
                    .trim()
                    .toLocaleLowerCase(),
                models_3 = (Array.isArray(fetchedModels_2) ? fetchedModels_2 : []).filter(
                    (model_3) => !query || String(model_3).toLocaleLowerCase().includes(query),
                ),
                selectedModel = String(UI.inputs.apiModel?.value || '').trim(),
                renderKey_2 = count_183 + '|' + query + '|' + selectedModel;
            if (apiModelRenderKey_2 === renderKey_2) return;
            apiModelRenderKey_2 = renderKey_2;
            const visibleModels = models_3.slice(0, API_MODEL_RENDER_LIMIT);
            !query &&
                selectedModel &&
                !visibleModels.includes(selectedModel) &&
                models_3.includes(selectedModel) &&
                (visibleModels.pop(), visibleModels.unshift(selectedModel));
            const fragment = document.createDocumentFragment();
            if (!models_3.length) {
                const empty = document.createElement('div');
                empty.className = 'api-model-empty';
                empty.textContent = fetchedModels_2.length
                    ? '没有匹配的模型'
                    : '暂无模型列表，可先获取模型或直接填写名称';
                fragment.appendChild(empty);
                UI.inputs.apiModelList.replaceChildren(fragment);
                return;
            }
            visibleModels.forEach((model_4) => {
                const option_4 = document.createElement('button');
                option_4.type = 'button';
                option_4.className = 'api-model-option';
                option_4.setAttribute('role', 'option');
                option_4.setAttribute('aria-selected', String(model_4 === selectedModel));
                option_4.classList.toggle('is-selected', model_4 === selectedModel);
                option_4.textContent = model_4;
                option_4.addEventListener('click', () => {
                    syncSelectValue(UI.inputs.apiModel, model_4);
                    tempApiConfig.model = model_4;
                    setApiModelPickerOpen(false);
                });
                fragment.appendChild(option_4);
            });
            if (models_3.length > visibleModels.length) {
                const hint_2 = document.createElement('div');
                hint_2.className = 'api-model-limit-hint';
                hint_2.textContent = '已显示前 ' + API_MODEL_RENDER_LIMIT + ' 个模型，请继续搜索';
                fragment.appendChild(hint_2);
            }
            UI.inputs.apiModelList.replaceChildren(fragment);
        }
        function scheduleNativeModelSelectRender(searchText) {
            if (apiModelSearchTimer) clearTimeout(apiModelSearchTimer);
            apiModelSearchTimer = setTimeout(() => {
                apiModelSearchTimer = null;
                renderNativeModelSelect(searchText);
            }, API_MODEL_SEARCH_DEBOUNCE_MS);
        }
        function setApiModelPickerOpen(value_919) {
            if (!UI.inputs.apiModelPicker || !UI.inputs.apiModelPickerToggle) return;
            const shouldOpen = !!value_919;
            UI.inputs.apiModelPicker.hidden = !shouldOpen;
            UI.inputs.apiModelPickerToggle.setAttribute('aria-expanded', String(shouldOpen));
            if (!shouldOpen) {
                apiModelSearchTimer &&
                    (clearTimeout(apiModelSearchTimer), (apiModelSearchTimer = null));
                return;
            }
            if (UI.inputs.apiModelSearch) UI.inputs.apiModelSearch.value = '';
            renderNativeModelSelect('', {
                force: true,
            });
            setTimeout(
                () =>
                    UI.inputs.apiModelSearch?.focus({
                        preventScroll: true,
                    }),
                0,
            );
        }
        function syncSelectValue(selectEl, value_20) {
            if (!selectEl) return;
            selectEl.value = value_20;
        }
        const API_PROVIDER_META = Object.freeze({
            openai: {
                endpoint: 'https://api.openai.com/v1',
                model: 'gpt-4o-mini',
                hint: '使用 OpenAI 官方 Chat Completions 接口。',
            },
            deepseek: {
                endpoint: 'https://api.deepseek.com/v1',
                model: 'deepseek-chat',
                hint: '使用 DeepSeek 的 OpenAI 兼容接口。',
            },
            siliconflow: {
                endpoint: 'https://api.siliconflow.cn/v1',
                model: 'deepseek-ai/DeepSeek-V3',
                hint: '使用硅基流动的 OpenAI 兼容接口。',
            },
            gemini: {
                endpoint: 'https://generativelanguage.googleapis.com/v1beta',
                model: 'gemini-2.5-flash',
                hint: '使用 Gemini 官方协议与 x-goog-api-key；不要填写 OpenAI 的 /chat/completions 路径。',
            },
            anthropic: {
                endpoint: 'https://api.anthropic.com/v1',
                model: 'claude-sonnet-4-20250514',
                hint: '使用 Claude 官方 Messages API 与 x-api-key。',
            },
            'openai-compatible': {
                endpoint: '',
                model: '',
                hint: '填写任意 OpenAI 兼容服务的地址、密钥和模型。',
            },
        });
        function getApiProviderMeta(provider_4) {
            const normalized_3 = window.u2Api.normalizeApiProvider(provider_4);
            return API_PROVIDER_META[normalized_3] || API_PROVIDER_META['openai-compatible'];
        }
        function syncApiProviderPresentation(options_10 = {}) {
            const provider_5 = window.u2Api.normalizeApiProvider(
                    options_10.provider ||
                        UI.inputs.apiProvider?.value ||
                        tempApiConfig.provider ||
                        apiConfig_2.provider,
                ),
                meta = getApiProviderMeta(provider_5);
            if (UI.inputs.apiProvider) UI.inputs.apiProvider.value = provider_5;
            if (UI.inputs.apiProviderHint) UI.inputs.apiProviderHint.textContent = meta.hint;
            options_10.applyPreset &&
                meta.endpoint &&
                UI.inputs.apiEndpoint &&
                (UI.inputs.apiEndpoint.value = meta.endpoint);
            if (options_10.applyPreset && meta.model && UI.inputs.apiModel) {
                const previousMeta = getApiProviderMeta(options_10.previousProvider),
                    currentModel = String(UI.inputs.apiModel.value || '').trim();
                (!currentModel || currentModel === previousMeta.model) &&
                    syncSelectValue(UI.inputs.apiModel, meta.model);
            }
            return (
                options_10.applyPreset &&
                    provider_5 !== window.u2Api.normalizeApiProvider(options_10.previousProvider) &&
                    ((fetchedModels_2 = []), handleAction_185()),
                (tempApiConfig.provider = provider_5),
                provider_5
            );
        }
        function getApiConfigDraft(requireModel_2 = true) {
            const validateApiConfig_929 = window.u2Api.validateApiConfig(
                {
                    provider: UI.inputs.apiProvider?.value,
                    endpoint: UI.inputs.apiEndpoint?.value,
                    apiKey: UI.inputs.apiKey?.value,
                    model: UI.inputs.apiModel?.value,
                    temperature: UI.inputs.apiTemp?.value,
                    frequencyPenalty: UI.inputs.apiFrequencyPenalty?.value,
                },
                {
                    requireModel: requireModel_2,
                },
            );
            return (
                (validateApiConfig_929.endpoint = window.u2Api.normalizeApiEndpoint(
                    validateApiConfig_929.endpoint,
                    validateApiConfig_929.provider,
                )),
                validateApiConfig_929
            );
        }
        function formatApiRequestError(error_18, value_931) {
            const status_3 = Number(error_18?.status) || 0,
                detail_4 = String(error_18?.message || '').trim();
            if (status_3)
                return value_931 + '（HTTP ' + status_3 + (detail_4 ? '：' + detail_4 : '') + '）';
            return detail_4 || value_931;
        }
        const apiConfigBtn = document.getElementById('api-config-btn');
        apiConfigBtn &&
            UI.overlays.apiConfig &&
            apiConfigBtn.addEventListener('click', (event_934) => {
                event_934.stopPropagation();
                setApiModelPickerOpen(false);
                tempApiConfig = {
                    provider: apiConfig_2.provider || 'openai-compatible',
                    endpoint: apiConfig_2.endpoint || '',
                    apiKey: apiConfig_2.apiKey || '',
                    model: apiConfig_2.model || '',
                    temperature: apiConfig_2.temperature ?? 0.7,
                    frequencyPenalty: apiConfig_2.frequencyPenalty ?? 0,
                };
                syncApiProviderPresentation({
                    provider: tempApiConfig.provider,
                });
                UI.inputs.apiEndpoint.value = tempApiConfig.endpoint || '';
                UI.inputs.apiKey.value = tempApiConfig.apiKey || '';
                syncSelectValue(UI.inputs.apiModel, tempApiConfig.model || '');
                UI.inputs.apiTemp.value = tempApiConfig.temperature ?? 0.7;
                if (UI.inputs.apiFrequencyPenalty)
                    UI.inputs.apiFrequencyPenalty.value = tempApiConfig.frequencyPenalty ?? 0;
                handleU2BackgroundActivitySettingsChanged();
                syncSystemNotificationControls();
                openApiConfigSheet();
            });
        UI.inputs.apiProvider &&
            UI.inputs.apiProvider.addEventListener('change', () => {
                const previousProvider_2 =
                    tempApiConfig.provider || apiConfig_2.provider || 'openai-compatible';
                syncApiProviderPresentation({
                    provider: UI.inputs.apiProvider.value,
                    previousProvider: previousProvider_2,
                    applyPreset: true,
                });
            });
        const vectorMemoryConfigBtn = document.getElementById('vector-memory-config-btn');
        vectorMemoryConfigBtn &&
            UI.overlays.vectorMemoryConfig &&
            vectorMemoryConfigBtn.addEventListener('click', (event_15) => {
                event_15.stopPropagation();
                syncVectorMemoryConfigInputs();
                openView(UI.overlays.vectorMemoryConfig);
            });
        const VISION_PROVIDER_COPY = {
            openai: {
                name: 'OpenAI',
                keyLabel: 'OpenAI API Key',
                endpointHint:
                    '使用支持图片输入的 OpenAI 模型；接口可填写完整 chat/completions 地址或 /v1 基础地址。',
            },
            gemini: {
                name: 'Gemini',
                keyLabel: 'Gemini API Key',
                endpointHint: '使用 Gemini Interactions API；请填写支持图片理解的 Gemini 模型。',
            },
            claude: {
                name: 'Claude',
                keyLabel: 'Anthropic API Key',
                endpointHint: '使用 Anthropic Messages API；远程图片地址需要浏览器可读取。',
            },
            grok: {
                name: 'Grok',
                keyLabel: 'xAI API Key',
                endpointHint: '使用支持图片输入的 Grok 模型。',
            },
            qwen: {
                name: 'Qwen / DashScope',
                keyLabel: 'DashScope API Key',
                endpointHint:
                    '使用百炼 OpenAI 兼容接口；请选择支持视觉输入的 Qwen-VL 或多模态模型。',
            },
            zhipu: {
                name: '智谱 GLM',
                keyLabel: '智谱 API Key',
                endpointHint: '使用智谱 OpenAI 兼容接口；请选择支持视觉输入的 GLM 模型。',
            },
            'openai-compatible': {
                name: 'OpenAI 兼容',
                keyLabel: 'API 密钥',
                endpointHint: '可接入支持 OpenAI Chat Completions 图像输入的中转站或兼容服务。',
            },
        };
        let tempVisionConfig = window.u2ImageUnderstanding
            ? window.u2ImageUnderstanding.normalizeConfig(visionConfig_2)
            : clonePlainData(visionConfig_2);
        function commitVisionInputsToDraft() {
            const provider_6 = tempVisionConfig.activeProvider;
            if (!provider_6 || !tempVisionConfig.providers?.[provider_6]) return;
            tempVisionConfig.providers[provider_6] = {
                endpoint: String(UI.inputs.visionEndpoint?.value || '').trim(),
                apiKey: String(UI.inputs.visionApiKey?.value || '').trim(),
                model: String(UI.inputs.visionModel?.value || '').trim(),
                models: Array.isArray(tempVisionConfig.providers[provider_6].models)
                    ? tempVisionConfig.providers[provider_6].models.slice()
                    : [],
            };
        }
        function renderVisionModelSelect(config_4) {
            const select_3 = UI.inputs.visionModelSelect;
            if (!select_3) return;
            const models_4 = Array.isArray(config_4?.models) ? config_4.models : [];
            select_3.replaceChildren();
            const placeholder_3 = document.createElement('option');
            placeholder_3.value = '';
            placeholder_3.textContent = models_4.length ? '选择已获取模型' : '暂无已获取模型';
            select_3.appendChild(placeholder_3);
            models_4.forEach((value_942) => {
                const option_5 = document.createElement('option');
                option_5.value = value_942;
                option_5.textContent = value_942;
                select_3.appendChild(option_5);
            });
            select_3.value = models_4.includes(String(config_4?.model || '').trim())
                ? String(config_4.model).trim()
                : '';
            select_3.disabled = models_4.length === 0;
        }
        function renderVisionInputs() {
            const value_944 = tempVisionConfig.activeProvider || 'gemini',
                config_5 = tempVisionConfig.providers?.[value_944] || {},
                copy_2 =
                    VISION_PROVIDER_COPY[value_944] || VISION_PROVIDER_COPY['openai-compatible'];
            if (UI.inputs.visionProvider) UI.inputs.visionProvider.value = value_944;
            if (UI.inputs.visionEndpoint) UI.inputs.visionEndpoint.value = config_5.endpoint || '';
            UI.inputs.visionApiKey &&
                ((UI.inputs.visionApiKey.value = config_5.apiKey || ''),
                (UI.inputs.visionApiKey.placeholder =
                    value_944 === 'gemini' ? 'AIza...' : 'sk-...'));
            UI.inputs.visionModel &&
                ((UI.inputs.visionModel.value = config_5.model || ''),
                (UI.inputs.visionModel.placeholder = '填写支持视觉输入的模型'));
            renderVisionModelSelect(config_5);
            if (UI.inputs.visionKeyLabel) UI.inputs.visionKeyLabel.textContent = copy_2.keyLabel;
            if (UI.inputs.visionEndpointHint)
                UI.inputs.visionEndpointHint.textContent = copy_2.endpointHint;
        }
        const visionConfigBtn = document.getElementById('vision-config-btn');
        visionConfigBtn &&
            UI.overlays.visionConfig &&
            visionConfigBtn.addEventListener('click', (event_16) => {
                event_16.stopPropagation();
                if (!window.u2ImageUnderstanding) {
                    showToast('识图模块尚未加载，请刷新后重试');
                    return;
                }
                tempVisionConfig = window.u2ImageUnderstanding.normalizeConfig(visionConfig_2);
                renderVisionInputs();
                openView(UI.overlays.visionConfig);
            });
        UI.inputs.visionProvider?.addEventListener('change', () => {
            commitVisionInputsToDraft();
            tempVisionConfig.activeProvider = UI.inputs.visionProvider.value;
            renderVisionInputs();
        });
        [UI.inputs.visionEndpoint, UI.inputs.visionApiKey].forEach((input_3) => {
            input_3?.addEventListener('input', commitVisionInputsToDraft);
            input_3?.addEventListener('change', commitVisionInputsToDraft);
        });
        UI.inputs.visionModel?.addEventListener('input', () => {
            commitVisionInputsToDraft();
            const activeProvider_949 = tempVisionConfig.activeProvider,
                models_5 = tempVisionConfig.providers?.[activeProvider_949]?.models || [];
            UI.inputs.visionModelSelect &&
                (UI.inputs.visionModelSelect.value = models_5.includes(
                    String(UI.inputs.visionModel.value || '').trim(),
                )
                    ? String(UI.inputs.visionModel.value).trim()
                    : '');
        });
        UI.inputs.visionModel?.addEventListener('change', commitVisionInputsToDraft);
        UI.inputs.visionModelSelect?.addEventListener('change', () => {
            const selectedModel_3 = String(UI.inputs.visionModelSelect.value || '').trim();
            if (!selectedModel_3 || !UI.inputs.visionModel) return;
            UI.inputs.visionModel.value = selectedModel_3;
            commitVisionInputsToDraft();
        });
        const fetchVisionModelsBtn = document.getElementById('fetch-vision-models-btn');
        fetchVisionModelsBtn &&
            fetchVisionModelsBtn.addEventListener('click', async () => {
                const innerHTML_2 = fetchVisionModelsBtn.innerHTML;
                try {
                    if (!window.u2ImageUnderstanding)
                        throw new Error('识图模块尚未加载，请刷新后重试');
                    commitVisionInputsToDraft();
                    const provider_7 = tempVisionConfig.activeProvider,
                        activeConfig = tempVisionConfig.providers?.[provider_7] || {};
                    fetchVisionModelsBtn.innerHTML =
                        '<i class="fas fa-spinner fa-spin"></i><div class="settings-text" style="color:var(--blue-color);">正在获取模型…</div>';
                    fetchVisionModelsBtn.style.pointerEvents = 'none';
                    const models_6 = await window.u2ImageUnderstanding.fetchModels({
                        provider: provider_7,
                        ...activeConfig,
                    });
                    if (!models_6.length) throw new Error('接口返回成功，但没有找到可用模型');
                    tempVisionConfig.providers[provider_7].models = models_6.slice();
                    renderVisionModelSelect(tempVisionConfig.providers[provider_7]);
                    UI.inputs.visionModel &&
                        !UI.inputs.visionModel.value.trim() &&
                        ((UI.inputs.visionModel.value = models_6[0]), commitVisionInputsToDraft());
                    if (UI.inputs.visionModelSelect)
                        UI.inputs.visionModelSelect.value = UI.inputs.visionModel.value;
                    UI.inputs.visionModel?.focus({
                        preventScroll: true,
                    });
                    showToast('成功获取 ' + models_6.length + ' 个模型');
                } catch (error_19) {
                    console.error('Fetch Vision Models Error:', error_19);
                    if (
                        !window.u2Api?.isRequestError?.(error_19) ||
                        !window.u2Api.reportError(error_19, {
                            operation: '获取识图模型',
                        })
                    )
                        showToast(error_19?.message || '获取识图模型失败');
                } finally {
                    fetchVisionModelsBtn.innerHTML = innerHTML_2;
                    fetchVisionModelsBtn.style.pointerEvents = '';
                }
            });
        const confirmVisionConfigBtn = document.getElementById('confirm-vision-config-btn');
        confirmVisionConfigBtn &&
            confirmVisionConfigBtn.addEventListener('click', async () => {
                const visionConfig_3 = visionConfig_2;
                try {
                    if (!window.u2ImageUnderstanding)
                        throw new Error('识图模块尚未加载，请刷新后重试');
                    commitVisionInputsToDraft();
                    const provider_8 = tempVisionConfig.activeProvider,
                        activeConfig_2 = tempVisionConfig.providers?.[provider_8] || {};
                    window.u2ImageUnderstanding.validateActiveConfig({
                        provider: provider_8,
                        ...activeConfig_2,
                    });
                    confirmVisionConfigBtn.classList.add('is-busy');
                    confirmVisionConfigBtn.style.pointerEvents = 'none';
                    visionConfig_2 = window.u2ImageUnderstanding.normalizeConfig(tempVisionConfig);
                    window.visionConfig = visionConfig_2;
                    const persisted_3 = await saveGlobalData();
                    if (!persisted_3) throw new Error('识图配置未能写入本地存储，请重试');
                    closeView(UI.overlays.visionConfig);
                    const providerName = VISION_PROVIDER_COPY[provider_8]?.name || '识图服务';
                    showToast('已启用 ' + providerName);
                } catch (error_20) {
                    visionConfig_2 = visionConfig_3;
                    window.visionConfig = visionConfig_3;
                    console.error('Save Vision Config Error:', error_20);
                    showToast(error_20?.message || '识图配置保存失败');
                } finally {
                    confirmVisionConfigBtn.classList.remove('is-busy');
                    confirmVisionConfigBtn.style.pointerEvents = '';
                }
            });
        const IMAGE_PROVIDER_COPY = {
            openai: {
                name: 'GPT Image（OpenAI）',
                keyLabel: 'OpenAI API Key',
                endpointHint: '使用 OpenAI 官方 GPT Image 接口，也可替换为同协议代理地址',
            },
            gemini: {
                name: 'Gemini Image',
                keyLabel: 'Gemini API Key',
                endpointHint: '使用 x-goog-api-key 调用 Nano Banana / Gemini Image',
            },
            novelai: {
                name: 'NovelAI',
                keyLabel: 'Persistent Token',
                endpointHint: '使用 NovelAI Persistent API Token，返回图片将保存到聊天记录',
            },
            grok: {
                name: 'Grok',
                keyLabel: 'xAI API Key',
                endpointHint: '使用 Grok Imagine 图片生成接口',
            },
            relay: {
                name: 'OpenAI 兼容中转站',
                keyLabel: 'API 密钥',
                endpointHint: '可填写基础地址或完整 /v1/images/generations 地址',
            },
        };
        let tempImageGenerationConfig = window.u2ImageGeneration
            ? window.u2ImageGeneration.normalizeConfig(imageGenerationConfig_2)
            : clonePlainData(imageGenerationConfig_2);
        function commitImageGenerationInputsToDraft() {
            const provider_9 = tempImageGenerationConfig.activeProvider;
            if (!provider_9 || !tempImageGenerationConfig.providers?.[provider_9]) return;
            tempImageGenerationConfig.providers[provider_9] = {
                endpoint: String(UI.inputs.imageEndpoint?.value || '').trim(),
                apiKey: String(UI.inputs.imageApiKey?.value || '').trim(),
                model: String(UI.inputs.imageModel?.value || '').trim(),
                size: UI.inputs.imageSize?.value || '1024x1024',
                models: Array.isArray(tempImageGenerationConfig.providers[provider_9].models)
                    ? tempImageGenerationConfig.providers[provider_9].models.slice()
                    : [],
            };
        }
        function renderImageGenerationModelSelect(config_6) {
            const select_4 = UI.inputs.imageModelSelect;
            if (!select_4) return;
            const models_7 = Array.isArray(config_6?.models) ? config_6.models : [];
            select_4.replaceChildren();
            const placeholder_4 = document.createElement('option');
            placeholder_4.value = '';
            placeholder_4.textContent = models_7.length ? '选择已获取模型' : '暂无已获取模型';
            select_4.appendChild(placeholder_4);
            models_7.forEach((value_968) => {
                const option_6 = document.createElement('option');
                option_6.value = value_968;
                option_6.textContent = value_968;
                select_4.appendChild(option_6);
            });
            select_4.value = models_7.includes(String(config_6?.model || '').trim())
                ? String(config_6.model).trim()
                : '';
            select_4.disabled = models_7.length === 0;
        }
        function renderImageGenerationInputs() {
            const provider_10 = tempImageGenerationConfig.activeProvider || 'gemini',
                config_7 = tempImageGenerationConfig.providers?.[provider_10] || {},
                copy_3 = IMAGE_PROVIDER_COPY[provider_10] || IMAGE_PROVIDER_COPY.relay;
            if (UI.inputs.imageProvider) UI.inputs.imageProvider.value = provider_10;
            if (UI.inputs.imageEndpoint) UI.inputs.imageEndpoint.value = config_7.endpoint || '';
            UI.inputs.imageApiKey &&
                ((UI.inputs.imageApiKey.value = config_7.apiKey || ''),
                (UI.inputs.imageApiKey.placeholder =
                    provider_10 === 'novelai' ? 'pst-...' : 'sk-...'));
            UI.inputs.imageModel &&
                ((UI.inputs.imageModel.value = config_7.model || ''),
                (UI.inputs.imageModel.placeholder =
                    provider_10 === 'novelai'
                        ? '填写账号可用的 NovelAI 图片模型'
                        : provider_10 === 'relay'
                          ? '填写中转站图片模型'
                          : '填写图片模型'));
            if (UI.inputs.imageSize) UI.inputs.imageSize.value = config_7.size || '1024x1024';
            renderImageGenerationModelSelect(config_7);
            if (UI.inputs.imageKeyLabel) UI.inputs.imageKeyLabel.textContent = copy_3.keyLabel;
            if (UI.inputs.imageEndpointHint)
                UI.inputs.imageEndpointHint.textContent = copy_3.endpointHint;
        }
        const imageGenerationConfigBtn = document.getElementById('image-generation-config-btn');
        imageGenerationConfigBtn &&
            UI.overlays.imageGenerationConfig &&
            imageGenerationConfigBtn.addEventListener('click', (event_17) => {
                event_17.stopPropagation();
                tempImageGenerationConfig = window.u2ImageGeneration
                    ? window.u2ImageGeneration.normalizeConfig(imageGenerationConfig_2)
                    : clonePlainData(imageGenerationConfig_2);
                renderImageGenerationInputs();
                openView(UI.overlays.imageGenerationConfig);
            });
        UI.inputs.imageProvider &&
            UI.inputs.imageProvider.addEventListener('change', () => {
                commitImageGenerationInputsToDraft();
                tempImageGenerationConfig.activeProvider = UI.inputs.imageProvider.value;
                renderImageGenerationInputs();
            });
        [UI.inputs.imageEndpoint, UI.inputs.imageApiKey, UI.inputs.imageSize].forEach((input_4) => {
            input_4?.addEventListener('input', commitImageGenerationInputsToDraft);
            input_4?.addEventListener('change', commitImageGenerationInputsToDraft);
        });
        [UI.inputs.imageModel].forEach((input_5) => {
            input_5?.addEventListener('input', () => {
                commitImageGenerationInputsToDraft();
                const activeProvider_976 = tempImageGenerationConfig.activeProvider,
                    models_8 =
                        tempImageGenerationConfig.providers?.[activeProvider_976]?.models || [];
                UI.inputs.imageModelSelect &&
                    (UI.inputs.imageModelSelect.value = models_8.includes(
                        String(input_5.value || '').trim(),
                    )
                        ? String(input_5.value).trim()
                        : '');
            });
            input_5?.addEventListener('change', commitImageGenerationInputsToDraft);
        });
        UI.inputs.imageModelSelect?.addEventListener('change', () => {
            const selectedModel_4 = String(UI.inputs.imageModelSelect.value || '').trim();
            if (!selectedModel_4 || !UI.inputs.imageModel) return;
            UI.inputs.imageModel.value = selectedModel_4;
            commitImageGenerationInputsToDraft();
        });
        const fetchImageGenerationModelsBtn = document.getElementById(
            'fetch-image-generation-models-btn',
        );
        fetchImageGenerationModelsBtn &&
            fetchImageGenerationModelsBtn.addEventListener('click', async () => {
                const innerHTML_3 = fetchImageGenerationModelsBtn.innerHTML;
                try {
                    commitImageGenerationInputsToDraft();
                    const provider_11 = tempImageGenerationConfig.activeProvider,
                        activeConfig_3 = tempImageGenerationConfig.providers?.[provider_11] || {};
                    fetchImageGenerationModelsBtn.innerHTML =
                        '<i class="fas fa-spinner fa-spin"></i><div class="settings-text" style="color:var(--blue-color);">正在获取模型…</div>';
                    fetchImageGenerationModelsBtn.style.pointerEvents = 'none';
                    const models_9 = await window.u2ImageGeneration.fetchModels({
                        provider: provider_11,
                        ...activeConfig_3,
                    });
                    if (!models_9.length) throw new Error('接口返回成功，但没有找到可用模型');
                    tempImageGenerationConfig.providers[provider_11].models = models_9.slice();
                    renderImageGenerationModelSelect(
                        tempImageGenerationConfig.providers[provider_11],
                    );
                    UI.inputs.imageModel &&
                        !UI.inputs.imageModel.value.trim() &&
                        ((UI.inputs.imageModel.value = models_9[0]),
                        commitImageGenerationInputsToDraft());
                    if (UI.inputs.imageModelSelect)
                        UI.inputs.imageModelSelect.value = UI.inputs.imageModel.value;
                    UI.inputs.imageModel?.focus({
                        preventScroll: true,
                    });
                    showToast('成功获取 ' + models_9.length + ' 个模型');
                } catch (error_21) {
                    console.error('Fetch Image Generation Models Error:', error_21);
                    if (
                        !window.u2Api?.isRequestError?.(error_21) ||
                        !window.u2Api.reportError(error_21, {
                            operation: '获取生图模型',
                        })
                    )
                        showToast(error_21?.message || '获取生图模型失败');
                } finally {
                    fetchImageGenerationModelsBtn.innerHTML = innerHTML_3;
                    fetchImageGenerationModelsBtn.style.pointerEvents = '';
                }
            });
        const confirmImageGenerationBtn = document.getElementById('confirm-image-generation-btn');
        confirmImageGenerationBtn &&
            confirmImageGenerationBtn.addEventListener('click', async () => {
                const imageGenerationConfig_3 = imageGenerationConfig_2;
                try {
                    commitImageGenerationInputsToDraft();
                    const provider_12 = tempImageGenerationConfig.activeProvider,
                        activeConfig_4 = tempImageGenerationConfig.providers?.[provider_12] || {};
                    window.u2ImageGeneration.validateActiveConfig({
                        provider: provider_12,
                        ...activeConfig_4,
                    });
                    confirmImageGenerationBtn.classList.add('is-busy');
                    confirmImageGenerationBtn.style.pointerEvents = 'none';
                    imageGenerationConfig_2 =
                        window.u2ImageGeneration.normalizeConfig(tempImageGenerationConfig);
                    window.imageGenerationConfig = imageGenerationConfig_2;
                    const persisted_4 = await saveGlobalData();
                    if (!persisted_4) throw new Error('生图配置未能写入本地存储，请重试');
                    closeView(UI.overlays.imageGenerationConfig);
                    const providerName_2 = IMAGE_PROVIDER_COPY[provider_12]?.name || '生图服务';
                    showToast('已启用 ' + providerName_2);
                } catch (error_22) {
                    imageGenerationConfig_2 = imageGenerationConfig_3;
                    window.imageGenerationConfig = imageGenerationConfig_3;
                    console.error('Save Image Generation Config Error:', error_22);
                    showToast(error_22?.message || '生图配置保存失败');
                } finally {
                    confirmImageGenerationBtn.classList.remove('is-busy');
                    confirmImageGenerationBtn.style.pointerEvents = '';
                }
            });
        let tempTtsConfig = window.u2Tts
            ? window.u2Tts.normalizeConfig(ttsConfig_2)
            : clonePlainData(ttsConfig_2);
        function getActiveTtsDraft() {
            const provider_13 = tempTtsConfig.activeProvider;
            return {
                provider: provider_13,
                ...(tempTtsConfig.providers?.[provider_13] || {}),
            };
        }
        function commitTtsInputsToDraft() {
            const provider_14 = tempTtsConfig.activeProvider;
            if (!provider_14 || !tempTtsConfig.providers?.[provider_14]) return;
            const draft = tempTtsConfig.providers[provider_14];
            draft.endpoint = String(UI.inputs.ttsEndpoint?.value || '').trim();
            draft.apiKey = String(UI.inputs.ttsApiKey?.value || '').trim();
            draft.model = String(UI.inputs.ttsModel?.value || '').trim();
            UI.inputs.ttsExtraFields?.querySelectorAll('[data-tts-field]').forEach((input_6) => {
                draft[input_6.dataset.ttsField] = String(input_6.value || '').trim();
            });
        }
        function renderTtsModelSelect(config) {
            const select_5 = UI.inputs.ttsModelSelect;
            if (!select_5) return;
            const models_10 = Array.isArray(config?.models) ? config.models : [];
            select_5.replaceChildren();
            const placeholder_5 = document.createElement('option');
            placeholder_5.value = '';
            placeholder_5.textContent = models_10.length ? '选择已获取项目' : '暂无已获取项目';
            select_5.appendChild(placeholder_5);
            models_10.forEach((model_996) => {
                const option_7 = document.createElement('option');
                option_7.value = model_996;
                option_7.textContent = model_996;
                select_5.appendChild(option_7);
            });
            select_5.value = models_10.includes(String(config?.model || '').trim())
                ? String(config.model).trim()
                : '';
            select_5.disabled = models_10.length === 0;
        }
        function handleAction_192(value_998, config_8) {
            const holder = UI.inputs.ttsExtraFields;
            if (!holder) return;
            holder.replaceChildren();
            const providerDefinition = window.u2Tts?.getProviderDefinition?.(value_998);
            (providerDefinition?.fields || []).forEach((field, index_4, fields_2) => {
                const row = document.createElement('div');
                row.className = 'form-item';
                if (index_4 === fields_2.length - 1) row.style.borderBottom = 'none';
                const label_2 = document.createElement('label');
                label_2.style.width = '112px';
                label_2.style.whiteSpace = 'nowrap';
                label_2.textContent = field.label;
                row.appendChild(label_2);
                let input_7;
                field.type === 'select'
                    ? ((input_7 = document.createElement('select')),
                      (input_7.style.cssText =
                          'flex:1; border:none; text-align:right; direction:rtl; appearance:none; background:transparent; color:var(--blue-color); outline:none; font-size:16px; min-width:0;'),
                      (field.options || []).forEach(([value_22, labelText]) => {
                          const option_8 = document.createElement('option');
                          option_8.value = value_22;
                          option_8.textContent = labelText;
                          input_7.appendChild(option_8);
                      }))
                    : ((input_7 = document.createElement('input')),
                      (input_7.type = field.type || 'text'),
                      (input_7.autocomplete = 'off'),
                      (input_7.placeholder = field.placeholder || '填写' + field.label));
                input_7.dataset.ttsField = field.key;
                input_7.value = config_8[field.key] || '';
                input_7.addEventListener('input', commitTtsInputsToDraft);
                input_7.addEventListener('change', commitTtsInputsToDraft);
                row.appendChild(input_7);
                holder.appendChild(row);
            });
        }
        function renderTtsInputs() {
            const value_25 = tempTtsConfig.activeProvider || 'minimax',
                config_9 = tempTtsConfig.providers?.[value_25] || {},
                definition_5 = window.u2Tts?.getProviderDefinition?.(value_25);
            if (UI.inputs.ttsProvider) UI.inputs.ttsProvider.value = value_25;
            if (UI.inputs.ttsEndpoint) UI.inputs.ttsEndpoint.value = config_9.endpoint || '';
            if (UI.inputs.ttsApiKey) UI.inputs.ttsApiKey.value = config_9.apiKey || '';
            if (UI.inputs.ttsModel) UI.inputs.ttsModel.value = config_9.model || '';
            if (UI.inputs.ttsKeyLabel)
                UI.inputs.ttsKeyLabel.textContent = definition_5?.keyLabel || 'API 密钥';
            const textContent_2 = definition_5?.modelLabel || 'TTS 模型';
            if (UI.inputs.ttsModelLabel) UI.inputs.ttsModelLabel.textContent = textContent_2;
            if (UI.inputs.ttsModelSelectLabel)
                UI.inputs.ttsModelSelectLabel.textContent = '已获取' + textContent_2;
            UI.inputs.ttsEndpointHint &&
                (UI.inputs.ttsEndpointHint.textContent =
                    (definition_5?.label || 'TTS') +
                    '：模型或音色列表仅从当前服务商在线拉取，不提供内置候选。');
            handleAction_192(value_25, config_9);
            renderTtsModelSelect(config_9);
        }
        const ttsConfigBtn = document.getElementById('tts-config-btn');
        ttsConfigBtn &&
            UI.overlays.ttsConfig &&
            ttsConfigBtn.addEventListener('click', (event_18) => {
                event_18.stopPropagation();
                if (!window.u2Tts) {
                    showToast('TTS 模块尚未加载，请刷新后重试');
                    return;
                }
                ttsConfig_2 = window.u2Tts.getConfig();
                tempTtsConfig = window.u2Tts.normalizeConfig(ttsConfig_2);
                renderTtsInputs();
                openView(UI.overlays.ttsConfig);
            });
        UI.inputs.ttsProvider?.addEventListener('change', () => {
            commitTtsInputsToDraft();
            tempTtsConfig.activeProvider = UI.inputs.ttsProvider.value;
            renderTtsInputs();
        });
        [UI.inputs.ttsEndpoint, UI.inputs.ttsApiKey].forEach((input_8) => {
            input_8?.addEventListener('input', commitTtsInputsToDraft);
            input_8?.addEventListener('change', commitTtsInputsToDraft);
        });
        UI.inputs.ttsModel?.addEventListener('input', () => {
            commitTtsInputsToDraft();
            const models_11 = getActiveTtsDraft().models || [];
            if (UI.inputs.ttsModelSelect)
                UI.inputs.ttsModelSelect.value = models_11.includes(UI.inputs.ttsModel.value.trim())
                    ? UI.inputs.ttsModel.value.trim()
                    : '';
        });
        UI.inputs.ttsModel?.addEventListener('change', commitTtsInputsToDraft);
        UI.inputs.ttsModelSelect?.addEventListener('change', () => {
            const model_5 = String(UI.inputs.ttsModelSelect.value || '').trim();
            if (!model_5 || !UI.inputs.ttsModel) return;
            UI.inputs.ttsModel.value = model_5;
            commitTtsInputsToDraft();
        });
        const fetchTtsModelsBtn = document.getElementById('fetch-tts-models-btn');
        fetchTtsModelsBtn &&
            fetchTtsModelsBtn.addEventListener('click', async () => {
                const innerHTML_4 = fetchTtsModelsBtn.innerHTML;
                try {
                    if (!window.u2Tts) throw new Error('TTS 模块尚未加载，请刷新后重试');
                    commitTtsInputsToDraft();
                    const draft_3 = getActiveTtsDraft();
                    fetchTtsModelsBtn.innerHTML =
                        '<i class="fas fa-spinner fa-spin"></i><div class="settings-text" style="color:var(--blue-color);">正在获取模型…</div>';
                    fetchTtsModelsBtn.style.pointerEvents = 'none';
                    const models_12 = await window.u2Tts.fetchModels(draft_3);
                    tempTtsConfig.providers[draft_3.provider].models = models_12.slice();
                    renderTtsModelSelect(tempTtsConfig.providers[draft_3.provider]);
                    showToast(
                        '成功获取 ' +
                            models_12.length +
                            ' 个' +
                            (window.u2Tts.getProviderDefinition(draft_3.provider)?.modelIsVoice
                                ? '音色'
                                : '模型'),
                    );
                } catch (error_23) {
                    console.error('Fetch TTS Models Error:', error_23);
                    if (
                        !window.u2Api?.isRequestError?.(error_23) ||
                        !window.u2Api.reportError(error_23, {
                            operation: '获取 TTS 模型',
                        })
                    )
                        showToast(error_23?.message || '获取 TTS 模型失败');
                } finally {
                    fetchTtsModelsBtn.innerHTML = innerHTML_4;
                    fetchTtsModelsBtn.style.pointerEvents = '';
                }
            });
        const confirmTtsBtn = document.getElementById('confirm-tts-btn');
        confirmTtsBtn &&
            confirmTtsBtn.addEventListener('click', async () => {
                const ttsConfig_3 = ttsConfig_2;
                try {
                    if (!window.u2Tts) throw new Error('TTS 模块尚未加载，请刷新后重试');
                    commitTtsInputsToDraft();
                    const activeConfig_5 = getActiveTtsDraft();
                    window.u2Tts.validateActiveConfig(activeConfig_5);
                    confirmTtsBtn.classList.add('is-busy');
                    confirmTtsBtn.style.pointerEvents = 'none';
                    ttsConfig_2 = window.u2Tts.setConfig(tempTtsConfig);
                    const persisted_5 = await saveGlobalData();
                    if (!persisted_5) throw new Error('TTS 配置未能写入本地存储，请重试');
                    closeView(UI.overlays.ttsConfig);
                    showToast(
                        window.u2Tts.getProviderName(activeConfig_5.provider) + ' TTS 已保存',
                    );
                } catch (error_24) {
                    ttsConfig_2 = ttsConfig_3;
                    window.ttsConfig = ttsConfig_3;
                    console.error('Save TTS Config Error:', error_24);
                    showToast(error_24?.message || 'TTS 配置保存失败');
                } finally {
                    confirmTtsBtn.classList.remove('is-busy');
                    confirmTtsBtn.style.pointerEvents = '';
                }
            });
        const vectorMemoryTestBtn = document.getElementById('test-vector-memory-connection-btn');
        vectorMemoryTestBtn &&
            vectorMemoryTestBtn.addEventListener('click', async () => {
                const innerHTML_5 = vectorMemoryTestBtn.innerHTML;
                vectorMemoryTestBtn.innerHTML =
                    '<i class="fas fa-spinner fa-spin"></i><div class="settings-text" style="color:var(--blue-color);">正在测试服务…</div>';
                vectorMemoryTestBtn.style.pointerEvents = 'none';
                try {
                    const draft_4 = {
                            ...getVectorMemoryConfigDraft(),
                            enabled: true,
                        },
                        result_5 = await window.imVectorMemory?.testConnection?.(draft_4);
                    if (!result_5?.ok) throw new Error(result_5?.error || '嵌入服务连接失败');
                    showToast('嵌入服务连接成功');
                } catch (error_25) {
                    console.error('Test Vector Memory Connection Error:', error_25);
                    showToast(error_25?.message || '嵌入服务连接失败');
                } finally {
                    vectorMemoryTestBtn.innerHTML = innerHTML_5;
                    vectorMemoryTestBtn.style.pointerEvents = '';
                }
            });
        const rebuildVectorMemoryIndexBtn = document.getElementById(
            'rebuild-vector-memory-index-btn',
        );
        rebuildVectorMemoryIndexBtn &&
            rebuildVectorMemoryIndexBtn.addEventListener('click', async () => {
                const innerHTML_6 = rebuildVectorMemoryIndexBtn.innerHTML;
                rebuildVectorMemoryIndexBtn.innerHTML =
                    '<i class="fas fa-spinner fa-spin"></i><div class="settings-text" style="color:var(--blue-color);">正在构建索引…</div>';
                rebuildVectorMemoryIndexBtn.style.pointerEvents = 'none';
                try {
                    const result_6 = await window.imVectorMemory?.rebuildAllMemoryIndexes?.();
                    if (!result_6?.ok) throw new Error(result_6?.error || '索引构建失败');
                    showToast('已同步 ' + (result_6.count || 0) + ' 条记忆');
                } catch (error_26) {
                    console.error('Rebuild Vector Memory Index Error:', error_26);
                    showToast(error_26?.message || '索引构建失败');
                } finally {
                    rebuildVectorMemoryIndexBtn.innerHTML = innerHTML_6;
                    rebuildVectorMemoryIndexBtn.style.pointerEvents = '';
                    handleU2VectorMemoryStatus();
                }
            });
        UI.inputs.vectorMemoryProvider &&
            UI.inputs.vectorMemoryProvider.addEventListener('change', () => {
                const provider_15 = String(UI.inputs.vectorMemoryProvider.value || 'siliconflow'),
                    providerMeta_2 = getVectorMemoryProviderMeta(provider_15);
                UI.inputs.vectorMemoryCustomEndpointRow &&
                    (UI.inputs.vectorMemoryCustomEndpointRow.hidden =
                        provider_15 !== 'openai-compatible');
                renderVectorMemoryModelOptions({
                    ...getVectorMemoryConfigDraft(),
                    provider: provider_15,
                    model: providerMeta_2.defaultModel || '',
                });
            });
        UI.inputs.vectorMemoryModel &&
            UI.inputs.vectorMemoryModel.addEventListener('change', () => {
                const usesCustomModel_2 = UI.inputs.vectorMemoryModel.value === '__custom__';
                UI.inputs.vectorMemoryCustomModelRow &&
                    (UI.inputs.vectorMemoryCustomModelRow.hidden = !usesCustomModel_2);
                if (usesCustomModel_2) UI.inputs.vectorMemoryCustomModel?.focus();
            });
        window.addEventListener('u2:vector-memory-status', handleU2VectorMemoryStatus);
        const closeVectorMemoryConfigBtn = document.getElementById(
            'close-vector-memory-config-btn',
        );
        closeVectorMemoryConfigBtn &&
            closeVectorMemoryConfigBtn.addEventListener('click', closeVectorMemoryConfigSheet);
        const confirmVectorMemoryConfigBtn = document.getElementById(
            'confirm-vector-memory-config-btn',
        );
        confirmVectorMemoryConfigBtn &&
            confirmVectorMemoryConfigBtn.addEventListener('click', async () => {
                const value_1034 = vectorMemoryConfig_2;
                let enabled_1035 = false;
                try {
                    const nextVectorMemoryConfig = getVectorMemoryConfigDraft();
                    if (nextVectorMemoryConfig.enabled && !nextVectorMemoryConfig.apiKey)
                        throw new Error('启用向量记忆前请填写 API 密钥');
                    if (nextVectorMemoryConfig.enabled && !nextVectorMemoryConfig.model)
                        throw new Error('启用向量记忆前请选择嵌入模型');
                    if (
                        nextVectorMemoryConfig.enabled &&
                        nextVectorMemoryConfig.provider === 'openai-compatible' &&
                        !nextVectorMemoryConfig.endpoint
                    )
                        throw new Error('请填写兼容服务的嵌入接口地址');
                    confirmVectorMemoryConfigBtn.classList.add('is-busy');
                    confirmVectorMemoryConfigBtn.style.pointerEvents = 'none';
                    vectorMemoryConfig_2 = nextVectorMemoryConfig;
                    window.vectorMemoryConfig = vectorMemoryConfig_2;
                    const persisted_6 = await saveGlobalData();
                    if (!persisted_6) throw new Error('向量记忆设置未能写入本地存储，请重试');
                    enabled_1035 = true;
                    handleU2VectorMemoryStatus();
                    if (nextVectorMemoryConfig.enabled) {
                        const value_1037 = await window.imVectorMemory?.rebuildAllMemoryIndexes?.();
                        if (!value_1037?.ok)
                            throw new Error(value_1037?.error || '设置已保存，但索引同步失败');
                    }
                    closeVectorMemoryConfigSheet();
                    showToast(
                        nextVectorMemoryConfig.enabled ? '向量记忆已同步' : '向量记忆设置已保存',
                    );
                } catch (error_27) {
                    !enabled_1035 &&
                        ((vectorMemoryConfig_2 = value_1034),
                        (window.vectorMemoryConfig = vectorMemoryConfig_2));
                    console.error('Save Vector Memory Config Error:', error_27);
                    showToast(error_27?.message || '向量记忆设置保存失败');
                } finally {
                    confirmVectorMemoryConfigBtn.classList.remove('is-busy');
                    confirmVectorMemoryConfigBtn.style.pointerEvents = '';
                }
            });
        const confirmApiBtn = document.getElementById('confirm-api-btn');
        confirmApiBtn &&
            confirmApiBtn.addEventListener('click', async () => {
                const previousConfig = apiConfig_2;
                try {
                    const nextConfig = getApiConfigDraft(true);
                    confirmApiBtn.classList.add('is-busy');
                    confirmApiBtn.style.pointerEvents = 'none';
                    tempApiConfig = {
                        ...nextConfig,
                    };
                    apiConfig_2 = {
                        ...nextConfig,
                    };
                    window.apiConfig = apiConfig_2;
                    applyBackgroundActivityControls(false);
                    await applySystemNotificationControls(false);
                    const persisted_7 = await saveGlobalData();
                    if (!persisted_7) throw new Error('API 设置未能写入本地存储，请重试');
                    notifyApiPresetsUpdated();
                    syncAssistiveBallPanel();
                    closeApiConfigSheet();
                    showToast('API 设置已保存');
                } catch (error_28) {
                    apiConfig_2 = previousConfig;
                    window.apiConfig = apiConfig_2;
                    console.error('Save API Config Error:', error_28);
                    showToast(error_28?.message || 'API 设置保存失败');
                } finally {
                    confirmApiBtn.classList.remove('is-busy');
                    confirmApiBtn.style.pointerEvents = '';
                }
            });
        const btnApiFetch = document.getElementById('fetch-models-btn');
        btnApiFetch &&
            btnApiFetch.addEventListener('click', async () => {
                const innerHTML_7 = btnApiFetch.innerHTML;
                btnApiFetch.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';
                btnApiFetch.style.pointerEvents = 'none';
                try {
                    const draft_5 = getApiConfigDraft(false),
                        url_5 = window.u2Api.resolveModelsEndpoint(draft_5.endpoint),
                        headers_2 = window.u2Api.buildApiHeaders(draft_5, {
                            [window.u2Api.INTERNAL_SILENT_ERROR_HEADER]: '1',
                        }),
                        res = await fetch(url_5, {
                            method: 'GET',
                            headers: headers_2,
                        });
                    if (!res.ok) {
                        const value_1047 = await window.u2Api.readApiError(res);
                        throw Object.assign(new Error(value_1047.message), value_1047);
                    }
                    const data_2 = await res.json(),
                        modelRows = Array.isArray(data_2?.data)
                            ? data_2.data
                            : Array.isArray(data_2?.models)
                              ? data_2.models
                              : Array.isArray(data_2)
                                ? data_2
                                : [],
                        usableModelRows =
                            draft_5.provider === 'gemini'
                                ? modelRows.filter((item_6) => {
                                      if (typeof item_6 === 'string') return true;
                                      const methods = item_6?.supportedGenerationMethods;
                                      return (
                                          !Array.isArray(methods) ||
                                          methods.includes('generateContent')
                                      );
                                  })
                                : modelRows;
                    fetchedModels_2 = Array.from(
                        new Set(
                            usableModelRows
                                .map((item_7) =>
                                    typeof item_7 === 'string'
                                        ? item_7
                                        : item_7?.id || item_7?.name || '',
                                )
                                .map((item_8) =>
                                    draft_5.provider === 'gemini'
                                        ? String(item_8 || '').replace(/^models\//i, '')
                                        : item_8,
                                )
                                .map((item_9) => String(item_9 || '').trim())
                                .filter(Boolean),
                        ),
                    ).sort((a_4, b_2) => a_4.localeCompare(b_2));
                    if (fetchedModels_2.length) {
                        const currentModel_2 =
                            UI.inputs.apiModel?.value || tempApiConfig.model || '';
                        await saveGlobalData();
                        handleAction_185();
                        renderNativeModelSelect();
                        syncSelectValue(UI.inputs.apiModel, currentModel_2);
                        showToast('成功获取 ' + fetchedModels_2.length + ' 个模型');
                    } else
                        throw new Error(
                            '接口返回成功，但没有识别到模型列表；可直接手动填写模型名称',
                        );
                } catch (error_29) {
                    console.error('Fetch Models Error:', error_29);
                    if (
                        !window.u2Api?.isRequestError?.(error_29) ||
                        !window.u2Api.reportError(error_29, {
                            operation: '获取模型',
                        })
                    )
                        showToast(formatApiRequestError(error_29, '获取模型失败'));
                } finally {
                    btnApiFetch.innerHTML = innerHTML_7;
                    btnApiFetch.style.pointerEvents = '';
                }
            });
        const testApiConnectionBtn = document.getElementById('test-api-connection-btn');
        testApiConnectionBtn &&
            testApiConnectionBtn.addEventListener('click', async () => {
                const innerHTML_8 = testApiConnectionBtn.innerHTML;
                testApiConnectionBtn.innerHTML =
                    '<i class="fas fa-spinner fa-spin"></i> Testing...';
                testApiConnectionBtn.style.pointerEvents = 'none';
                try {
                    const apiConfig_3 = getApiConfigDraft(true),
                        endpoint_2 = window.u2Api.resolveChatCompletionsEndpoint(
                            apiConfig_3.endpoint,
                        ),
                        headers_3 = window.u2Api.buildApiHeaders(apiConfig_3, {
                            [window.u2Api.INTERNAL_SILENT_ERROR_HEADER]: '1',
                        }),
                        options_1058 = {
                            model: apiConfig_3.model,
                            messages: [
                                {
                                    role: 'user',
                                    content: 'Reply with OK.',
                                },
                            ],
                            temperature: 0,
                        },
                        value_1059 = typeof window.u2Api.fetchChatCompletion === 'function',
                        value_1060 = value_1059 ? window.u2Api.fetchChatCompletion : fetch,
                        value_1061 = await value_1060(endpoint_2, {
                            method: 'POST',
                            headers: headers_3,
                            apiConfig: apiConfig_3,
                            body: value_1059 ? options_1058 : JSON.stringify(options_1058),
                        });
                    if (!value_1061.ok) {
                        const value_1064 = await window.u2Api.readApiError(value_1061);
                        throw Object.assign(new Error(value_1064.message), value_1064);
                    }
                    const data_3 = await value_1061.json(),
                        hasCompatibleOutput =
                            Array.isArray(data_3?.choices) || Array.isArray(data_3?.output);
                    if (!hasCompatibleOutput)
                        throw new Error('接口已连接，但返回格式不是兼容的聊天响应');
                    showToast('连接测试成功');
                } catch (error_30) {
                    console.error('Test API Connection Error:', error_30);
                    if (
                        !window.u2Api?.isRequestError?.(error_30) ||
                        !window.u2Api.reportError(error_30, {
                            operation: '连接测试',
                        })
                    )
                        showToast(formatApiRequestError(error_30, '连接测试失败'));
                } finally {
                    testApiConnectionBtn.innerHTML = innerHTML_8;
                    testApiConnectionBtn.style.pointerEvents = '';
                }
            });
        UI.inputs.apiModel &&
            (UI.inputs.apiModel.addEventListener('input', (e_7) => {
                tempApiConfig.model = e_7.target.value;
            }),
            UI.inputs.apiModel.addEventListener('change', (e_8) => {
                tempApiConfig.model = e_8.target.value;
            }));
        UI.inputs.apiModelPickerToggle &&
            UI.inputs.apiModelPickerToggle.addEventListener('click', () => {
                const isOpen =
                    UI.inputs.apiModelPickerToggle.getAttribute('aria-expanded') === 'true';
                setApiModelPickerOpen(!isOpen);
            });
        UI.inputs.apiModelSearch &&
            UI.inputs.apiModelSearch.addEventListener('input', () => {
                scheduleNativeModelSelectRender(UI.inputs.apiModelSearch.value);
            });
        const savePresetBtn = document.getElementById('save-preset-btn'),
            loadPresetBtn = document.getElementById('load-preset-btn'),
            confirmSavePresetBtn = document.getElementById('confirm-save-preset-btn'),
            input_9 = document.getElementById('api-preset-search-input'),
            apiPresetCountElement = document.getElementById('api-preset-count'),
            dataApiPresetCloseElements = document.querySelectorAll('[data-api-preset-close]');
        function handleAction_193() {
            const parsedTemp = Number.parseFloat(UI.inputs.apiTemp && UI.inputs.apiTemp.value),
                float_1069 = Number.parseFloat(
                    UI.inputs.apiFrequencyPenalty && UI.inputs.apiFrequencyPenalty.value,
                );
            return {
                provider: window.u2Api.normalizeApiProvider(
                    (UI.inputs.apiProvider && UI.inputs.apiProvider.value) ||
                        tempApiConfig.provider,
                ),
                endpoint: String(
                    (UI.inputs.apiEndpoint && UI.inputs.apiEndpoint.value) || '',
                ).trim(),
                apiKey: String((UI.inputs.apiKey && UI.inputs.apiKey.value) || '').trim(),
                model: String((UI.inputs.apiModel && UI.inputs.apiModel.value) || '').trim(),
                temperature: Number.isFinite(parsedTemp)
                    ? Math.max(0, Math.min(2, parsedTemp))
                    : 0.7,
                frequencyPenalty: Number.isFinite(float_1069)
                    ? Math.max(-2, Math.min(2, float_1069))
                    : 0,
            };
        }
        async function handleAction_194(source_4, value_1071 = {}) {
            if (!source_4 || typeof source_4 !== 'object') return false;
            const parsedTemp_2 = Number(
                    source_4.temperature !== undefined ? source_4.temperature : source_4.temp,
                ),
                number_1072 = Number(source_4.frequencyPenalty),
                apiConfig_4 = {
                    provider: window.u2Api.normalizeApiProvider(
                        source_4.provider || 'openai-compatible',
                    ),
                    endpoint: String(source_4.endpoint || '').trim(),
                    apiKey: String(source_4.apiKey || '').trim(),
                    model: String(source_4.model || '').trim(),
                    temperature: Number.isFinite(parsedTemp_2)
                        ? Math.max(0, Math.min(2, parsedTemp_2))
                        : 0.7,
                    frequencyPenalty: Number.isFinite(number_1072)
                        ? Math.max(-2, Math.min(2, number_1072))
                        : 0,
                };
            tempApiConfig = {
                ...apiConfig_4,
            };
            apiConfig_2 = {
                ...apiConfig_4,
            };
            window.apiConfig = apiConfig_2;
            if (UI.inputs.apiProvider) UI.inputs.apiProvider.value = apiConfig_4.provider;
            syncApiProviderPresentation({
                provider: apiConfig_4.provider,
            });
            if (UI.inputs.apiEndpoint) UI.inputs.apiEndpoint.value = apiConfig_4.endpoint;
            if (UI.inputs.apiKey) UI.inputs.apiKey.value = apiConfig_4.apiKey;
            if (UI.inputs.apiModel) syncSelectValue(UI.inputs.apiModel, apiConfig_4.model);
            if (UI.inputs.apiTemp) UI.inputs.apiTemp.value = String(apiConfig_4.temperature);
            if (UI.inputs.apiFrequencyPenalty)
                UI.inputs.apiFrequencyPenalty.value = String(apiConfig_4.frequencyPenalty);
            if (value_1071.persist !== false) {
                const value_1074 = await saveGlobalData();
                if (!value_1074) throw new Error('API 设置未能写入本地存储');
            }
            return (notifyApiPresetsUpdated(), syncAssistiveBallPanel(), true);
        }
        function handleAction_195(provider_16) {
            const options_1076 = {
                openai: 'OpenAI 官方',
                deepseek: 'DeepSeek',
                siliconflow: '硅基流动',
                gemini: 'Gemini 官方',
                anthropic: 'Claude 官方',
                'openai-compatible': 'OpenAI 兼容',
            };
            return options_1076[window.u2Api.normalizeApiProvider(provider_16)] || '自定义服务商';
        }
        function handleAction_196(value_1077, value_1078) {
            if (!apiPresetCountElement) return;
            apiPresetCountElement.textContent =
                value_1077 === value_1078
                    ? value_1078 + ' 个预设'
                    : value_1077 + ' / ' + value_1078 + ' 个预设';
        }
        function handleInput() {
            if (!UI.lists.presets) return;
            const items_1079 = Array.isArray(apiPresets_2) ? apiPresets_2 : [],
                toLocaleLowerCase_1080 = String((input_9 && input_9.value) || '')
                    .trim()
                    .toLocaleLowerCase(),
                filter_1081 = items_1079.filter((value_1082) => {
                    if (!toLocaleLowerCase_1080) return true;
                    return [
                        value_1082.name,
                        value_1082.provider,
                        handleAction_195(value_1082.provider),
                        value_1082.model,
                        value_1082.endpoint,
                    ].some((value_1083) =>
                        String(value_1083 || '')
                            .toLocaleLowerCase()
                            .includes(toLocaleLowerCase_1080),
                    );
                });
            UI.lists.presets.replaceChildren();
            handleAction_196(filter_1081.length, items_1079.length);
            if (!items_1079.length || !filter_1081.length) {
                const fragment_2 = document.createElement('div');
                fragment_2.className = 'api-preset-empty';
                fragment_2.textContent = items_1079.length ? '没有匹配的预设' : '暂无 API 预设';
                UI.lists.presets.appendChild(fragment_2);
                return;
            }
            const fragment_3 = document.createDocumentFragment();
            filter_1081.forEach((value_1085) => {
                const row_2 = document.createElement('article');
                row_2.className = 'api-preset-card';
                row_2.setAttribute('role', 'listitem');
                const element_1087 = document.createElement('button');
                element_1087.type = 'button';
                element_1087.className = 'api-preset-card-main';
                element_1087.setAttribute(
                    'aria-label',
                    '加载预设 ' + (value_1085.name || '未命名预设'),
                );
                const element_1088 = document.createElement('span');
                element_1088.className = 'api-preset-card-icon';
                element_1088.innerHTML = '<i class="fas fa-server" aria-hidden="true"></i>';
                const element_1089 = document.createElement('span');
                element_1089.className = 'api-preset-card-content';
                const name_7 = document.createElement('strong');
                name_7.className = 'api-preset-card-name';
                name_7.textContent = String(value_1085.name || '未命名预设');
                const element_1091 = document.createElement('span');
                element_1091.className = 'api-preset-card-meta';
                element_1091.textContent =
                    handleAction_195(value_1085.provider) +
                    ' · ' +
                    (value_1085.model || '未选择模型');
                const element_1092 = document.createElement('span');
                element_1092.className = 'api-preset-card-endpoint';
                element_1092.textContent = value_1085.endpoint || '未填写接口地址';
                element_1089.append(name_7, element_1091, element_1092);
                const element_1093 = document.createElement('i');
                element_1093.className = 'fas fa-chevron-right api-preset-card-arrow';
                element_1093.setAttribute('aria-hidden', 'true');
                element_1087.append(element_1088, element_1089, element_1093);
                element_1087.addEventListener('click', async () => {
                    element_1087.disabled = true;
                    try {
                        await handleAction_194(value_1085);
                        closeView(UI.overlays.loadPreset);
                        showToast('已应用预设“' + (value_1085.name || '未命名预设') + '”');
                    } catch (value_1095) {
                        console.error('Apply API preset error:', value_1095);
                        showToast((value_1095 && value_1095.message) || '预设加载失败');
                    } finally {
                        element_1087.disabled = false;
                    }
                });
                const element_1094 = document.createElement('button');
                element_1094.type = 'button';
                element_1094.className = 'api-preset-card-delete';
                element_1094.setAttribute(
                    'aria-label',
                    '删除预设 ' + (value_1085.name || '未命名预设'),
                );
                element_1094.innerHTML = '<i class="fas fa-trash-can" aria-hidden="true"></i>';
                element_1094.addEventListener('click', (event_1096) => {
                    event_1096.stopPropagation();
                    if (!window.confirm('删除预设“' + (value_1085.name || '未命名预设') + '”？'))
                        return;
                    apiPresets_2 = apiPresets_2.filter(
                        (value_1097) => value_1097.id !== value_1085.id,
                    );
                    void saveGlobalData().then(() => {
                        notifyApiPresetsUpdated();
                        syncAssistiveBallPanel();
                        handleInput();
                        showToast('预设已删除');
                    });
                });
                row_2.append(element_1087, element_1094);
                fragment_3.appendChild(row_2);
            });
            UI.lists.presets.appendChild(fragment_3);
        }
        dataApiPresetCloseElements.forEach((value_1098) =>
            value_1098.addEventListener('click', () => {
                const value_1099 =
                    value_1098.dataset.apiPresetClose === 'save'
                        ? UI.overlays.savePreset
                        : UI.overlays.loadPreset;
                closeView(value_1099);
            }),
        );
        if (input_9) input_9.addEventListener('input', handleInput);
        savePresetBtn &&
            savePresetBtn.addEventListener('click', () => {
                if (UI.inputs.presetName) UI.inputs.presetName.value = '';
                openView(UI.overlays.savePreset);
                setTimeout(
                    () =>
                        UI.inputs.presetName &&
                        UI.inputs.presetName.focus({
                            preventScroll: true,
                        }),
                    80,
                );
            });
        confirmSavePresetBtn &&
            confirmSavePresetBtn.addEventListener('click', async () => {
                const name_16 =
                        String((UI.inputs.presetName && UI.inputs.presetName.value) || '').trim() ||
                        '未命名预设',
                    handleAction_193_1101 = handleAction_193(),
                    toLocaleLowerCase_1102 = name_16.toLocaleLowerCase(),
                    value_1103 = Array.isArray(apiPresets_2)
                        ? apiPresets_2.findIndex(
                              (value_1106) =>
                                  String(value_1106.name || '')
                                      .trim()
                                      .toLocaleLowerCase() === toLocaleLowerCase_1102,
                          )
                        : -1,
                    value_1104 = value_1103 >= 0 ? apiPresets_2[value_1103] : null,
                    options_1105 = {
                        id:
                            value_1104 && value_1104.id !== undefined
                                ? value_1104.id
                                : 'api-preset-' + Date.now(),
                        name: name_16,
                        ...handleAction_193_1101,
                        temp: handleAction_193_1101.temperature,
                    };
                apiPresets_2 =
                    value_1103 >= 0
                        ? apiPresets_2.map((value_1107, value_1108) =>
                              value_1108 === value_1103 ? options_1105 : value_1107,
                          )
                        : Array.isArray(apiPresets_2)
                          ? apiPresets_2.concat(options_1105)
                          : [options_1105];
                confirmSavePresetBtn.disabled = true;
                try {
                    const value_1109 = await saveGlobalData();
                    if (!value_1109) throw new Error('预设未能写入本地存储');
                    notifyApiPresetsUpdated();
                    syncAssistiveBallPanel();
                    closeView(UI.overlays.savePreset);
                    showToast(
                        value_1104 ? '预设“' + name_16 + '”已更新' : '预设“' + name_16 + '”已保存',
                    );
                } catch (value_1110) {
                    console.error('Save API preset error:', value_1110);
                    showToast((value_1110 && value_1110.message) || '预设保存失败');
                } finally {
                    confirmSavePresetBtn.disabled = false;
                }
            });
        UI.inputs.presetName &&
            typeof window.mobileInputCompat?.register === 'function' &&
            window.mobileInputCompat.register({
                input: UI.inputs.presetName,
                onSend: () => confirmSavePresetBtn?.click(),
                enterKeyHint: 'done',
                blurAfterSend: false,
                restoreWindowScroll: false,
            });
        input_9 &&
            typeof window.mobileInputCompat?.register === 'function' &&
            window.mobileInputCompat.register({
                input: input_9,
                onSend: () => handleInput(),
                enterKeyHint: 'search',
                blurAfterSend: false,
                restoreWindowScroll: false,
            });
        typeof window.mobileInputCompat?.registerFocusScope === 'function' &&
            window.mobileInputCompat.registerFocusScope({
                selector: '.api-preset-overlay.active',
                priority: 30,
                preferFocusScope: true,
                resolveScrollContainer: (value_1111, element_1112) =>
                    element_1112.querySelector('.api-preset-list'),
                scrollBehavior: 'focus',
                viewportClassName: 'u2-android-api-preset-viewport-sized',
                viewportHeightCssVariable: '--u2-android-api-preset-viewport-height',
                viewportTopCssVariable: '--u2-android-api-preset-viewport-top',
            });
        loadPresetBtn &&
            loadPresetBtn.addEventListener('click', () => {
                if (input_9) input_9.value = '';
                handleInput();
                openView(UI.overlays.loadPreset);
            });
        const exportDataBtn = document.getElementById('export-data-btn'),
            importDataBtn = document.getElementById('import-data-btn'),
            importDataFile = document.getElementById('import-data-file'),
            exportImessageDataBtnElement = document.getElementById('export-imessage-data-btn'),
            exportCharLiteBtnElement = document.getElementById('export-char-lite-btn'),
            charLiteExportPickerElement = document.getElementById('char-lite-export-picker'),
            charLiteExportSelectElement = document.getElementById('char-lite-export-select'),
            charLiteExportConfirmElement = document.getElementById('char-lite-export-confirm'),
            importCharLiteBtnElement = document.getElementById('import-char-lite-btn'),
            importDataFile_2 = document.getElementById('import-char-lite-file'),
            charLiteChangeFileElement = document.getElementById('char-lite-change-file'),
            importImessageDataBtnElement = document.getElementById('import-imessage-data-btn'),
            importDataFile_3 = document.getElementById('import-imessage-data-file'),
            clearDataBtn = document.getElementById('clear-data-btn');
        (function value_1113() {
            const importPreview = document.getElementById('data-import-preview'),
                importFileName = document.getElementById('data-import-file-name'),
                importVersion = document.getElementById('data-import-version'),
                importRecords = document.getElementById('data-import-records'),
                importAssets = document.getElementById('data-import-assets'),
                importSize = document.getElementById('data-import-size');
            let selectedImportPayload = null,
                selectedImportFile = null;
            const importPreview_2 = document.getElementById('imessage-import-preview'),
                imessageImportFileNameElement = document.getElementById(
                    'imessage-import-file-name',
                ),
                imessageImportFriendsElement = document.getElementById('imessage-import-friends'),
                imessageImportMessagesElement = document.getElementById('imessage-import-messages'),
                importAssets_2 = document.getElementById('imessage-import-assets'),
                importSize_2 = document.getElementById('imessage-import-size');
            let selectedImportPayload_2 = null,
                selectedImportFile_2 = null,
                selectedImportPayload_3 = null,
                selectedImportFile_3 = null,
                value_1119 = null,
                overlay = null,
                overlayText = null,
                overlayProgress = null;
            const storageHealthDot = document.getElementById('storage-health-dot'),
                storageHealthStatus = document.getElementById('storage-health-status'),
                storageHealthPersistence = document.getElementById('storage-health-persistence'),
                storageHealthLastSave = document.getElementById('storage-health-last-save'),
                storageHealthWarning_3 = document.getElementById('storage-health-warning'),
                storageHealthCompaction = document.getElementById('storage-health-compaction'),
                storageHealthImageCompression = document.getElementById(
                    'storage-health-image-compression',
                ),
                storageCleanCacheBtn = document.getElementById('storage-clean-cache-btn'),
                storageCompressImagesBtn = document.getElementById('storage-compress-images-btn'),
                storageRetryBtn = document.getElementById('storage-retry-btn'),
                storageTotalUsage = document.getElementById('storage-total-usage'),
                storageSummaryDescription = document.getElementById('storage-summary-description'),
                storageUsageBar = document.getElementById('storage-usage-bar'),
                storageUsageLegend = document.getElementById('storage-usage-legend'),
                storageCategoryList = document.getElementById('storage-category-list'),
                storageCategoryColors = {
                    iMessage: '#ff3b30',
                    X: '#0a84ff',
                    本地资源: '#ff9500',
                    书库: '#af52de',
                    应用状态: '#34c759',
                    冗余历史: '#8e8e93',
                };
            function stopLegacy(e_9) {
                e_9.preventDefault();
                e_9.stopImmediatePropagation();
            }
            function setBusy(btn, busy) {
                if (!btn) return;
                btn.disabled = !!busy;
                btn.classList.toggle('is-busy', !!busy);
            }
            function readFileText(file_12) {
                return new Promise((resolve_6, reject_5) => {
                    const reader_4 = new FileReader();
                    reader_4.onload = (event_19) => resolve_6(event_19.target.result || '');
                    reader_4.onerror = () =>
                        reject_5(reader_4.error || new Error('File read failed'));
                    reader_4.readAsText(file_12);
                });
            }
            function formatBytesForUi(bytes_2) {
                if (window.appStorage && typeof window.appStorage.formatBytes === 'function')
                    return window.appStorage.formatBytes(bytes_2);
                const size_2 = Math.max(0, Number(bytes_2) || 0);
                return size_2 < 1024 ? size_2 + ' B' : (size_2 / 1024).toFixed(1) + ' KB';
            }
            function formatDateForUi(timestamp) {
                const value_29 = Number(timestamp) || 0;
                if (!value_29) return '未知时间';
                try {
                    return new Date(value_29).toLocaleString();
                } catch (error_31) {
                    return '未知时间';
                }
            }
            function getStorageGroups(health) {
                return Object.entries(
                    health?.breakdown?.logicalGroups || health?.breakdown?.groups || {},
                )
                    .map(([name_8, value_31]) => ({
                        name: name_8,
                        bytes: Math.max(0, Number(value_31?.bytes) || 0),
                        count: Math.max(0, Number(value_31?.count) || 0),
                    }))
                    .filter((group_2) => group_2.bytes > 0)
                    .sort((a_5, b_3) => b_3.bytes - a_5.bytes);
            }
            function getStorageCategoryColor(name_9) {
                return storageCategoryColors[name_9] || '#c7c7cc';
            }
            function handleAction_1124(health_2) {
                const groups_2 = getStorageGroups(health_2),
                    totalBytes = Math.max(0, Number(health_2?.breakdown?.logicalBytes) || 0),
                    total = totalBytes || groups_2.reduce((sum, group_3) => sum + group_3.bytes, 0);
                storageTotalUsage &&
                    (storageTotalUsage.textContent = '已使用 ' + formatBytesForUi(total));
                storageSummaryDescription &&
                    (storageSummaryDescription.textContent =
                        total > 0
                            ? '根据当前应用内保存的数据实时统计'
                            : '当前还没有可统计的应用数据');
                storageUsageBar &&
                    (storageUsageBar.replaceChildren(),
                    groups_2.forEach((value_1150) => {
                        const segment = document.createElement('span'),
                            percentage = total > 0 ? (value_1150.bytes / total) * 100 : 0;
                        segment.className = 'data-storage-usage-segment';
                        segment.style.width = percentage + '%';
                        segment.style.backgroundColor = getStorageCategoryColor(value_1150.name);
                        segment.title = value_1150.name + ' ' + formatBytesForUi(value_1150.bytes);
                        storageUsageBar.appendChild(segment);
                    }),
                    storageUsageBar.setAttribute(
                        'aria-label',
                        groups_2.length
                            ? '应用数据已使用 ' +
                                  formatBytesForUi(total) +
                                  '，' +
                                  groups_2
                                      .map(
                                          (summary) =>
                                              summary.name + ' ' + formatBytesForUi(summary.bytes),
                                      )
                                      .join('，')
                            : '当前没有可统计的应用数据',
                    ));
                storageUsageLegend &&
                    (storageUsageLegend.replaceChildren(),
                    groups_2.forEach((summary_2) => {
                        const item_10 = document.createElement('span'),
                            dot = document.createElement('i'),
                            element_1157 = document.createElement('span');
                        item_10.className = 'data-storage-legend-item';
                        dot.className = 'data-storage-color-dot';
                        dot.style.backgroundColor = getStorageCategoryColor(summary_2.name);
                        element_1157.textContent =
                            summary_2.name + ' ' + formatBytesForUi(summary_2.bytes);
                        item_10.append(dot, element_1157);
                        storageUsageLegend.appendChild(item_10);
                    }));
                if (storageCategoryList) {
                    storageCategoryList.replaceChildren();
                    if (!groups_2.length) {
                        const empty_2 = document.createElement('div');
                        empty_2.className = 'storage-category-empty';
                        empty_2.textContent = '暂无可统计的应用数据';
                        storageCategoryList.appendChild(empty_2);
                        return;
                    }
                    groups_2.forEach((value_1159) => {
                        const row_3 = document.createElement('div'),
                            dot_2 = document.createElement('span'),
                            copy_4 = document.createElement('span'),
                            name_10 = document.createElement('strong'),
                            detail_5 = document.createElement('small'),
                            size_3 = document.createElement('span'),
                            chevron = document.createElement('i');
                        row_3.className = 'storage-category-row';
                        row_3.setAttribute('role', 'listitem');
                        dot_2.className = 'storage-category-color-dot';
                        dot_2.style.backgroundColor = getStorageCategoryColor(value_1159.name);
                        copy_4.className = 'storage-category-copy';
                        name_10.textContent = value_1159.name;
                        detail_5.textContent =
                            value_1159.count > 0 ? value_1159.count + ' 条记录' : '应用数据';
                        size_3.className = 'storage-category-size';
                        size_3.textContent = formatBytesForUi(value_1159.bytes);
                        chevron.className = 'fas fa-chevron-right storage-category-chevron';
                        chevron.setAttribute('aria-hidden', 'true');
                        copy_4.append(name_10, detail_5);
                        row_3.append(dot_2, copy_4, size_3, chevron);
                        storageCategoryList.appendChild(row_3);
                    });
                }
            }
            async function refreshStorageHealth() {
                if (!window.appStorage?.getStorageHealth) return;
                const health_3 = await window.appStorage.getStorageHealth(),
                    statusLabels = {
                        initializing: '正在初始化',
                        saving: '保存中',
                        saved: '已保存',
                        error: '保存失败',
                    };
                if (storageHealthStatus)
                    storageHealthStatus.textContent =
                        statusLabels[health_3.status] || '存储状态未知';
                storageHealthDot &&
                    (storageHealthDot.classList.toggle('is-saved', health_3.status === 'saved'),
                    storageHealthDot.classList.toggle('is-error', health_3.status === 'error'));
                storageHealthPersistence &&
                    (storageHealthPersistence.textContent =
                        '有效数据：' +
                        formatBytesForUi(health_3.breakdown?.logicalBytes) +
                        ' · 持久存储：' +
                        (health_3.persisted ? '已启用' : '浏览器未授予'));
                storageHealthLastSave &&
                    (storageHealthLastSave.textContent =
                        '最后保存：' + formatDateForUi(health_3.lastCommitAt));
                if (storageHealthWarning_3) {
                    const textContent_3 = health_3.lastError ? '错误：' + health_3.lastError : '';
                    storageHealthWarning_3.textContent = textContent_3;
                    storageHealthWarning_3.hidden = !textContent_3;
                }
                if (storageRetryBtn) storageRetryBtn.hidden = health_3.status !== 'error';
                handleAction_1124(health_3);
                if (storageHealthCompaction) {
                    const cleaned = health_3.lastCacheCleanup,
                        compacted = health_3.lastCompaction;
                    storageHealthCompaction.textContent = cleaned?.clearedAt
                        ? '最近手动清理：' +
                          formatDateForUi(cleaned.clearedAt) +
                          '，预计释放 ' +
                          formatBytesForUi(cleaned.estimatedBytesFreed)
                        : compacted?.compactedAt
                          ? '最近自动优化：' +
                            formatDateForUi(compacted.compactedAt) +
                            '，预计释放 ' +
                            formatBytesForUi(compacted.estimatedBytesFreed)
                          : '尚未执行存储优化';
                }
                if (storageHealthImageCompression) {
                    const compressed_2 = health_3.lastImageCompression;
                    storageHealthImageCompression.textContent = compressed_2?.compressedAt
                        ? '最近图片压缩：' +
                          formatDateForUi(compressed_2.compressedAt) +
                          '，压缩 ' +
                          (Number(compressed_2.compressed) || 0) +
                          ' 张，释放 ' +
                          formatBytesForUi(compressed_2.bytesFreed)
                        : '尚未执行图片压缩';
                }
            }
            storageCleanCacheBtn?.addEventListener('click', async () => {
                if (
                    !confirm(
                        '将先创建并校验安全影子数据库，再无损去重资源并重建主数据库。不会删除聊天、帖子、资料、登录状态或仍在使用的图片。优化期间请勿关闭页面，继续吗？',
                    )
                )
                    return;
                setBusy(storageCleanCacheBtn, true);
                showOperation('正在安全优化存储...');
                try {
                    const result_7 = await window.appStorage.optimizeStorage({
                        progressCallback: updateOperation,
                    });
                    hideOperation();
                    const released = formatBytesForUi(result_7.estimatedBytesFreed);
                    showToast('存储优化完成，浏览器报告已释放 ' + released);
                } catch (error_32) {
                    console.error('Storage optimization failed:', error_32);
                    hideOperation();
                    showToast(error_32?.message || '存储优化中止，原数据仍被保留');
                } finally {
                    setBusy(storageCleanCacheBtn, false);
                    await refreshStorageHealth();
                }
            });
            storageCompressImagesBtn?.addEventListener('click', async () => {
                setBusy(storageCompressImagesBtn, true);
                showOperation('正在扫描图片资源...');
                try {
                    const summary_3 = await window.appStorage.inspectImageCompression({
                        scope: 'all',
                        profile: 'balanced',
                    });
                    hideOperation();
                    if (!summary_3.eligible) {
                        showToast('图片已经足够精简');
                        return;
                    }
                    const confirm_1177 = confirm(
                        '找到 ' +
                            summary_3.eligible +
                            ' 张可压缩图片，当前共 ' +
                            formatBytesForUi(summary_3.bytes) +
                            `。

` +
                            `将按图片用途限制尺寸，并以约 82% 质量转换为 WebP；只有明显变小的图片才会替换。GIF、SVG、音频、字体和内置素材不会处理。

` +
                            '压缩不可恢复，重要数据建议先导出备份。继续吗？',
                    );
                    if (!confirm_1177) return;
                    showOperation('正在准备压缩图片...');
                    const result_8 = await window.appStorage.compressImageAssets({
                        scope: 'all',
                        profile: 'balanced',
                        progressCallback: updateOperation,
                    });
                    hideOperation();
                    showToast(
                        '图片压缩完成：压缩 ' +
                            result_8.compressed +
                            ' 张，跳过 ' +
                            result_8.skipped +
                            ' 张' +
                            ((result_8.failed ? '，失败 ' + result_8.failed + ' 张' : '') + '，') +
                            (formatBytesForUi(result_8.bytesBefore) +
                                ' → ' +
                                formatBytesForUi(result_8.bytesAfter) +
                                '，') +
                            ('释放 ' + formatBytesForUi(result_8.bytesFreed)),
                    );
                } catch (error_33) {
                    console.error('Image compression failed:', error_33);
                    hideOperation();
                    showToast(error_33?.message || '图片压缩中止，原图片仍被保留');
                } finally {
                    setBusy(storageCompressImagesBtn, false);
                    await refreshStorageHealth();
                }
            });
            storageRetryBtn?.addEventListener('click', async () => {
                storageRetryBtn.disabled = true;
                try {
                    const saved_2 = await window.appStorage.flushPendingWrites();
                    showToast(saved_2 ? '待保存数据已完成写入' : '仍有数据保存失败');
                } finally {
                    storageRetryBtn.disabled = false;
                    await refreshStorageHealth();
                }
            });
            let storageRefreshTimer = null;
            const isDataManagementOpen = () =>
                !!dataManagementSheet &&
                (dataManagementSheet.classList.contains('active') ||
                    dataManagementSheet.style.display === 'flex');
            window.appStorage?.subscribe?.(() => {
                if (!isDataManagementOpen()) return;
                clearTimeout(storageRefreshTimer);
                storageRefreshTimer = setTimeout(() => refreshStorageHealth(), 180);
            });
            dataManagementBtn?.addEventListener('click', () =>
                setTimeout(() => refreshStorageHealth(), 0),
            );
            function showOperation(text_5) {
                !overlay &&
                    ((overlay = document.createElement('div')),
                    (overlay.className = 'data-operation-overlay'),
                    (overlay.innerHTML = `
                        <div class="data-operation-card">
                            <i class="fas fa-spinner fa-spin data-operation-spinner"></i>
                            <div class="data-operation-text"></div>
                            <div class="data-operation-progress"><div></div></div>
                        </div>
                    `),
                    (overlayText = overlay.querySelector('.data-operation-text')),
                    (overlayProgress = overlay.querySelector('.data-operation-progress > div')),
                    document.body.appendChild(overlay));
                overlayText.textContent = text_5 || '处理中...';
                overlayProgress.style.width = '0%';
                overlay.style.display = 'flex';
            }
            function updateOperation(progressData = {}) {
                if (overlayText) overlayText.textContent = progressData.message || '处理中...';
                if (overlayProgress) {
                    const progress_2 = Math.max(
                        0,
                        Math.min(100, Number(progressData.progress) || 0),
                    );
                    overlayProgress.style.width = progress_2 + '%';
                }
            }
            function hideOperation() {
                if (overlay) overlay.style.display = 'none';
            }
            function handleAction_1125(file_13, summary_4) {
                if (!importPreview) return;
                importPreview.style.display = 'block';
                if (importFileName) importFileName.textContent = file_13?.name || '未命名备份';
                if (importVersion)
                    importVersion.textContent = 'v' + (summary_4.schemaVersion || '-');
                if (importRecords) importRecords.textContent = String(summary_4.recordCount || 0);
                if (importAssets) importAssets.textContent = String(summary_4.assetCount || 0);
                if (importSize)
                    importSize.textContent = formatBytesForUi(
                        summary_4.approximateBytes || file_13?.size || 0,
                    );
            }
            function resetPreview() {
                selectedImportPayload = null;
                selectedImportFile = null;
                if (importPreview) importPreview.style.display = 'none';
            }
            function handleAction_1126(file_14, summary_5) {
                if (!importPreview_2) return;
                importPreview_2.style.display = 'block';
                if (imessageImportFileNameElement)
                    imessageImportFileNameElement.textContent =
                        file_14?.name || '未命名 iMessage 备份';
                if (imessageImportFriendsElement)
                    imessageImportFriendsElement.textContent = String(summary_5.friendCount || 0);
                if (imessageImportMessagesElement)
                    imessageImportMessagesElement.textContent = String(summary_5.messageCount || 0);
                if (importAssets_2) importAssets_2.textContent = String(summary_5.assetCount || 0);
                if (importSize_2)
                    importSize_2.textContent = formatBytesForUi(
                        summary_5.approximateBytes || file_14?.size || 0,
                    );
            }
            function resetPreview_2() {
                selectedImportPayload_2 = null;
                selectedImportFile_2 = null;
                if (importPreview_2) importPreview_2.style.display = 'none';
            }
            exportDataBtn &&
                exportDataBtn.addEventListener(
                    'click',
                    async (value_1188) => {
                        stopLegacy(value_1188);
                        try {
                            setBusy(exportDataBtn, true);
                            showOperation('正在准备导出数据...');
                            const blob_3 = await window.appStorage.exportAllData(updateOperation);
                            updateOperation({
                                message: '准备下载...',
                                progress: 99,
                            });
                            hideOperation();
                            const result_9 = await window.u2ExportFile({
                                blob: blob_3,
                                fileName:
                                    'u2phone_backup_' +
                                    new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) +
                                    '.json',
                                title: 'U2 完整数据备份',
                            });
                            if (result_9 === 'shared' || result_9 === 'downloaded')
                                showToast('数据导出成功');
                            else {
                                if (result_9 === 'failed') showToast('导出失败，请重试');
                            }
                        } catch (err_5) {
                            console.error('Export failed:', err_5);
                            hideOperation();
                            showToast('导出失败，请查看控制台');
                        } finally {
                            setBusy(exportDataBtn, false);
                        }
                    },
                    true,
                );
            importDataBtn &&
                importDataFile &&
                (importDataBtn.addEventListener(
                    'click',
                    (value_1192) => {
                        stopLegacy(value_1192);
                        if (!selectedImportPayload || !selectedImportFile) {
                            importDataFile.click();
                            return;
                        }
                        if (
                            !confirm(
                                '将用「' +
                                    selectedImportFile.name +
                                    '」完整替换当前手机里的应用数据和配置。此操作不可撤销，确定继续？',
                            )
                        )
                            return;
                        (async () => {
                            try {
                                setBusy(importDataBtn, true);
                                showOperation('正在导入备份...');
                                const importReport = await window.appStorage.importAllData(
                                        selectedImportPayload,
                                        updateOperation,
                                    ),
                                    stickerReport = importReport?.stickers,
                                    skippedStickers = Math.max(
                                        0,
                                        Number(stickerReport?.skippedItems) || 0,
                                    ),
                                    message_3 =
                                        skippedStickers > 0
                                            ? '导入成功，已跳过 ' +
                                              skippedStickers +
                                              ' 张无法恢复的表情，正在重启...'
                                            : '导入成功，正在重启...';
                                updateOperation({
                                    message: message_3,
                                    progress: 100,
                                });
                                setTimeout(() => window.location.reload(), 1200);
                            } catch (err_6) {
                                console.error('Import failed:', err_6);
                                hideOperation();
                                showToast(err_6?.message || '导入失败，当前数据未替换');
                                setBusy(importDataBtn, false);
                            }
                        })();
                    },
                    true,
                ),
                importDataFile.addEventListener(
                    'change',
                    async (event_1198) => {
                        event_1198.stopImmediatePropagation();
                        const value_1199 = event_1198.target.files[0];
                        if (!value_1199) return;
                        try {
                            setBusy(importDataBtn, true);
                            showOperation('正在读取备份文件...');
                            const value_1200 = await readFileText(value_1199);
                            updateOperation({
                                message: '正在校验备份...',
                                progress: 30,
                            });
                            const payload_4 = JSON.parse(value_1200),
                                summary_6 = window.appStorage.inspectBackupPayload(payload_4);
                            selectedImportPayload = payload_4;
                            selectedImportFile = value_1199;
                            handleAction_1125(value_1199, summary_6);
                            hideOperation();
                            showToast('备份已校验，请再次点击导入');
                        } catch (err_7) {
                            console.error('Import preview failed:', err_7);
                            resetPreview();
                            hideOperation();
                            showToast(err_7?.message || '文件格式错误或备份已损坏');
                        } finally {
                            setBusy(importDataBtn, false);
                            event_1198.target.value = '';
                        }
                    },
                    true,
                ));
            exportImessageDataBtnElement &&
                exportImessageDataBtnElement.addEventListener(
                    'click',
                    async (value_1204) => {
                        stopLegacy(value_1204);
                        try {
                            setBusy(exportImessageDataBtnElement, true);
                            showOperation('正在准备导出 iMessage 备份...');
                            const blob_5 =
                                await window.appStorage.exportImessageBackup(updateOperation);
                            updateOperation({
                                message: '准备下载...',
                                progress: 99,
                            });
                            hideOperation();
                            const value_1206 = await window.u2ExportFile({
                                blob: blob_5,
                                fileName:
                                    'u2phone_imessage_backup_' +
                                    new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) +
                                    '.json',
                                title: 'U2 iMessage 备份',
                            });
                            if (value_1206 === 'shared' || value_1206 === 'downloaded')
                                showToast('iMessage 备份导出成功');
                            else {
                                if (value_1206 === 'failed')
                                    showToast('iMessage 备份导出失败，请重试');
                            }
                        } catch (value_1207) {
                            console.error('iMessage export failed:', value_1207);
                            hideOperation();
                            showToast(value_1207?.message || 'iMessage 备份导出失败');
                        } finally {
                            setBusy(exportImessageDataBtnElement, false);
                        }
                    },
                    true,
                );
            exportCharLiteBtnElement &&
                charLiteExportPickerElement &&
                charLiteExportSelectElement &&
                charLiteExportConfirmElement &&
                (exportCharLiteBtnElement.addEventListener(
                    'click',
                    async (value_1208) => {
                        stopLegacy(value_1208);
                        if (!charLiteExportPickerElement.hidden) {
                            charLiteExportPickerElement.hidden = true;
                            exportCharLiteBtnElement.setAttribute('aria-expanded', 'false');
                            return;
                        }
                        try {
                            setBusy(exportCharLiteBtnElement, true);
                            const items_1209 = await window.appStorage.listCharLiteExportChoices();
                            if (!items_1209.length) {
                                showToast('没有可导出的 Char');
                                return;
                            }
                            charLiteExportSelectElement.replaceChildren();
                            const element_1210 = document.createElement('option');
                            element_1210.value = '';
                            element_1210.textContent = '全部 Char（' + items_1209.length + '）';
                            charLiteExportSelectElement.appendChild(element_1210);
                            const value_1211 = new Map();
                            items_1209.forEach(({ name: name_17 }) =>
                                value_1211.set(name_17, (value_1211.get(name_17) || 0) + 1),
                            );
                            const themeFontFaceRegistry_2 = new Map();
                            items_1209.forEach(({ id: value_33, name: name_11 }) => {
                                const currentOption_2 = document.createElement('option');
                                currentOption_2.value = value_33;
                                const fontFace_2 = (themeFontFaceRegistry_2.get(name_11) || 0) + 1;
                                themeFontFaceRegistry_2.set(name_11, fontFace_2);
                                currentOption_2.textContent =
                                    value_1211.get(name_11) > 1
                                        ? name_11 + '（第 ' + fontFace_2 + ' 位）'
                                        : name_11;
                                charLiteExportSelectElement.appendChild(currentOption_2);
                            });
                            charLiteExportPickerElement.hidden = false;
                            exportCharLiteBtnElement.setAttribute('aria-expanded', 'true');
                        } catch (value_1218) {
                            console.error('Failed to list Char export choices:', value_1218);
                            showToast(value_1218?.message || '读取 Char 列表失败');
                        } finally {
                            setBusy(exportCharLiteBtnElement, false);
                        }
                    },
                    true,
                ),
                charLiteExportConfirmElement.addEventListener(
                    'click',
                    async (value_1219) => {
                        stopLegacy(value_1219);
                        try {
                            setBusy(charLiteExportConfirmElement, true);
                            showOperation('正在准备轻量备份...');
                            if (window.imApp?.saveState?.dirty && window.imApp.flushGlobalSave) {
                                if (
                                    !(await window.imApp.flushGlobalSave({
                                        silent: true,
                                    }))
                                )
                                    throw new Error('待保存的聊天数据未能完成保存');
                            }
                            const value_1220 = charLiteExportSelectElement.value || null,
                                blob_6 = await window.appStorage.exportCharChatMemoryLite(
                                    value_1220,
                                    updateOperation,
                                );
                            hideOperation();
                            const value_1222 =
                                    charLiteExportSelectElement.selectedOptions?.[0]?.textContent ||
                                    'char',
                                value_1223 = value_1220
                                    ? value_1222
                                          .replace(/[\\/:*?"<>|]/g, '_')
                                          .replace(/\s+/g, '_')
                                          .slice(0, 48) || 'char'
                                    : 'all_char',
                                slice_1224 = new Date()
                                    .toISOString()
                                    .replace(/[:.]/g, '-')
                                    .slice(0, 19),
                                value_1225 = await window.u2ExportFile({
                                    blob: blob_6,
                                    fileName:
                                        'u2phone_char_chat_memory_' +
                                        value_1223 +
                                        '_' +
                                        slice_1224 +
                                        '.json',
                                    title: 'U2 Char 轻量备份',
                                });
                            if (value_1225 === 'shared' || value_1225 === 'downloaded')
                                showToast('轻量备份已导出');
                            else {
                                if (value_1225 === 'failed') showToast('轻量导出失败，请重试');
                            }
                        } catch (value_1226) {
                            console.error('Char lite export failed:', value_1226);
                            hideOperation();
                            showToast(value_1226?.message || '轻量导出失败');
                        } finally {
                            setBusy(charLiteExportConfirmElement, false);
                        }
                    },
                    true,
                ));
            if (importCharLiteBtnElement && importDataFile_2) {
                const charLiteImportPreviewElement = document.getElementById(
                        'char-lite-import-preview',
                    ),
                    charLiteImportFileNameElement = document.getElementById(
                        'char-lite-import-file-name',
                    ),
                    charLiteImportNamesElement = document.getElementById('char-lite-import-names'),
                    charLiteImportCharsElement = document.getElementById('char-lite-import-chars'),
                    charLiteImportMessagesElement = document.getElementById(
                        'char-lite-import-messages',
                    ),
                    charLiteImportSizeElement = document.getElementById('char-lite-import-size'),
                    value_1227 = () => {
                        selectedImportPayload_3 = null;
                        selectedImportFile_3 = null;
                        value_1119 = null;
                        if (charLiteImportPreviewElement)
                            charLiteImportPreviewElement.style.display = 'none';
                    };
                importCharLiteBtnElement.addEventListener(
                    'click',
                    (value_1228) => {
                        stopLegacy(value_1228);
                        if (!selectedImportPayload_3 || !selectedImportFile_3) {
                            importDataFile_2.click();
                            return;
                        }
                        const value_1229 = value_1119;
                        if (
                            !confirm(
                                '将用“' +
                                    selectedImportFile_3.name +
                                    '”替换 ' +
                                    value_1229.charCount +
                                    ' 个对应 Char 的聊天和记忆（' +
                                    value_1229.messageCount +
                                    ' 条消息）。已有 Char 的其他资料保留；备份中没有的 Char 会创建基础联系人。确定导入？',
                            )
                        )
                            return;
                        (async () => {
                            try {
                                setBusy(importCharLiteBtnElement, true);
                                showOperation('正在导入轻量备份...');
                                if (
                                    window.imApp?.saveState?.dirty &&
                                    window.imApp.flushGlobalSave
                                ) {
                                    if (
                                        !(await window.imApp.flushGlobalSave({
                                            silent: true,
                                        }))
                                    )
                                        throw new Error('待保存的聊天数据未能完成保存');
                                }
                                const value_1230 = await window.appStorage.importCharChatMemoryLite(
                                    selectedImportPayload_3,
                                    updateOperation,
                                );
                                updateOperation({
                                    message:
                                        '已恢复 ' +
                                        value_1230.charCount +
                                        ' 个 Char、' +
                                        value_1230.messageCount +
                                        ' 条消息，正在重启...',
                                    progress: 100,
                                });
                                value_1227();
                                setTimeout(() => window.location.reload(), 1200);
                            } catch (value_1231) {
                                console.error('Char lite import failed:', value_1231);
                                hideOperation();
                                showToast(
                                    value_1231?.message || '轻量备份导入失败，当前数据未修改',
                                );
                                setBusy(importCharLiteBtnElement, false);
                            }
                        })();
                    },
                    true,
                );
                importDataFile_2.addEventListener(
                    'change',
                    async (event_1232) => {
                        event_1232.stopImmediatePropagation();
                        const value_1233 = event_1232.target.files[0];
                        if (!value_1233) return;
                        value_1227();
                        try {
                            setBusy(importCharLiteBtnElement, true);
                            showOperation('正在读取轻量备份...');
                            const result_1234 = JSON.parse(await readFileText(value_1233)),
                                inspectCharChatMemoryLitePayload_1235 =
                                    window.appStorage.inspectCharChatMemoryLitePayload(result_1234);
                            selectedImportPayload_3 = result_1234;
                            selectedImportFile_3 = value_1233;
                            value_1119 = inspectCharChatMemoryLitePayload_1235;
                            if (charLiteImportFileNameElement)
                                charLiteImportFileNameElement.textContent = value_1233.name;
                            if (charLiteImportNamesElement) {
                                const value_1236 = new Map();
                                result_1234.chars.forEach((value_1238) => {
                                    const value_1239 = value_1238.name.trim() || '未命名 Char';
                                    value_1236.set(
                                        value_1239,
                                        (value_1236.get(value_1239) || 0) + 1,
                                    );
                                });
                                const themeFontFaceRegistry_3 = new Map();
                                charLiteImportNamesElement.textContent = result_1234.chars
                                    .map((value_1240) => {
                                        const registryKey_2 =
                                                value_1240.name.trim() || '未命名 Char',
                                            fontFace_3 =
                                                (themeFontFaceRegistry_3.get(registryKey_2) || 0) +
                                                1;
                                        return (
                                            themeFontFaceRegistry_3.set(registryKey_2, fontFace_3),
                                            value_1236.get(registryKey_2) > 1
                                                ? registryKey_2 + '（第 ' + fontFace_3 + ' 位）'
                                                : registryKey_2
                                        );
                                    })
                                    .join('、');
                            }
                            if (charLiteImportCharsElement)
                                charLiteImportCharsElement.textContent = String(
                                    inspectCharChatMemoryLitePayload_1235.charCount,
                                );
                            if (charLiteImportMessagesElement)
                                charLiteImportMessagesElement.textContent = String(
                                    inspectCharChatMemoryLitePayload_1235.messageCount,
                                );
                            if (charLiteImportSizeElement)
                                charLiteImportSizeElement.textContent = formatBytesForUi(
                                    value_1233.size,
                                );
                            if (charLiteImportPreviewElement)
                                charLiteImportPreviewElement.style.display = 'block';
                            hideOperation();
                            showToast('轻量备份已校验，请再次点击导入');
                        } catch (value_1243) {
                            value_1227();
                            hideOperation();
                            showToast(value_1243?.message || '轻量备份文件无效');
                        } finally {
                            setBusy(importCharLiteBtnElement, false);
                            event_1232.target.value = '';
                        }
                    },
                    true,
                );
                charLiteChangeFileElement?.addEventListener(
                    'click',
                    (value_1244) => {
                        stopLegacy(value_1244);
                        value_1227();
                        importDataFile_2.click();
                    },
                    true,
                );
            }
            importImessageDataBtnElement &&
                importDataFile_3 &&
                (importImessageDataBtnElement.addEventListener(
                    'click',
                    (value_1245) => {
                        stopLegacy(value_1245);
                        if (!selectedImportPayload_2 || !selectedImportFile_2) {
                            importDataFile_3.click();
                            return;
                        }
                        if (
                            !confirm(
                                '将用“' +
                                    selectedImportFile_2.name +
                                    '”完整替换当前 iMessage 的联系人、聊天、朋友圈、表情和本地资源。其他应用、账号和全局配置不会修改。此操作不可撤销，确定继续？',
                            )
                        )
                            return;
                        (async () => {
                            try {
                                setBusy(importImessageDataBtnElement, true);
                                showOperation('正在导入 iMessage 备份...');
                                const value_1246 = await window.appStorage.importImessageBackup(
                                        selectedImportPayload_2,
                                        updateOperation,
                                    ),
                                    value_1247 =
                                        Array.isArray(value_1246.compatibilityWarnings) &&
                                        value_1246.compatibilityWarnings.length > 0
                                            ? '，界面状态或朋友圈封面已恢复默认'
                                            : '';
                                updateOperation({
                                    message:
                                        'iMessage 导入成功（' +
                                        (value_1246.friendCount || 0) +
                                        ' 位联系人，' +
                                        (value_1246.messageCount || 0) +
                                        ' 条消息' +
                                        value_1247 +
                                        '），正在重启...',
                                    progress: 100,
                                });
                                setTimeout(() => window.location.reload(), 1200);
                            } catch (value_1248) {
                                console.error('iMessage import failed:', value_1248);
                                hideOperation();
                                showToast(
                                    value_1248?.message || 'iMessage 备份导入失败，当前数据未修改',
                                );
                                setBusy(importImessageDataBtnElement, false);
                            }
                        })();
                    },
                    true,
                ),
                importDataFile_3.addEventListener(
                    'change',
                    async (event_1249) => {
                        event_1249.stopImmediatePropagation();
                        const value_1250 = event_1249.target.files[0];
                        if (!value_1250) return;
                        try {
                            setBusy(importImessageDataBtnElement, true);
                            showOperation('正在读取 iMessage 备份文件...');
                            const value_1251 = await readFileText(value_1250);
                            updateOperation({
                                message: '正在校验 iMessage 备份...',
                                progress: 30,
                            });
                            const result_1252 = JSON.parse(value_1251),
                                inspectImessageBackupPayload_1253 =
                                    window.appStorage.inspectImessageBackupPayload(result_1252);
                            selectedImportPayload_2 = result_1252;
                            selectedImportFile_2 = value_1250;
                            handleAction_1126(value_1250, inspectImessageBackupPayload_1253);
                            hideOperation();
                            showToast('iMessage 备份已校验，请再次点击导入');
                        } catch (value_1254) {
                            console.error('iMessage import preview failed:', value_1254);
                            resetPreview_2();
                            hideOperation();
                            showToast(value_1254?.message || 'iMessage 备份格式错误或已损坏');
                        } finally {
                            setBusy(importImessageDataBtnElement, false);
                            event_1249.target.value = '';
                        }
                    },
                    true,
                ));
            clearDataBtn &&
                clearDataBtn.addEventListener(
                    'click',
                    async (e_10) => {
                        stopLegacy(e_10);
                        if (
                            !confirm(
                                '确定清空所有应用数据和配置吗？此操作不可恢复，系统将重启到默认状态。',
                            )
                        )
                            return;
                        try {
                            setBusy(clearDataBtn, true);
                            showOperation('正在清空应用数据...');
                            await window.appStorage.clearAllPersistentData();
                            updateOperation({
                                message: '已清空，正在重启...',
                                progress: 100,
                            });
                            setTimeout(() => window.location.reload(), 1200);
                        } catch (err) {
                            console.error('Clear data failed:', err);
                            hideOperation();
                            showToast('清空数据失败');
                            setBusy(clearDataBtn, false);
                        }
                    },
                    true,
                );
        })();
    });
})();
