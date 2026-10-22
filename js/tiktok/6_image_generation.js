(window.u2OnStorageReady || ((_value) => document.addEventListener('DOMContentLoaded', _value)))(
    () => {
        const _value2 = new Map();
        let _value3 = null;
        let _value4 = null;
        let _value5 = 0;
        let _value6 = null;
        const _value7 = (_value27) => window.showToast?.(_value27);
        const _value8 = () => Date.now() + '-' + Math.random().toString(36).slice(2, 9);
        const _value9 = () => [...window.tkState.videos, ...(window.tkState.profile.posts || [])];
        const _value0 = (_value28) =>
            _value9().find((_value29) => String(_value29.id) === String(_value28));
        const _value1 = (_value30) => !_value30.cancelled && _value30.isDataCurrent();
        const _value10 = () =>
            Object.assign(new Error('视频数据已清理'), {
                name: 'AbortError',
            });
        function _value11(_value31) {
            const _value32 = window.tkState;
            const _value33 = window.tkGetChar(_value31.authorId);
            const _value34 = window.getImFriends?.() || window.imData?.friends || [];
            const _value35 = _value34.filter(
                (_value38) =>
                    _value38.type !== 'group' &&
                    !_value38.isOfficial &&
                    _value38.type !== 'official',
            );
            const _value36 =
                String(_value31.authorId) === 'profile'
                    ? null
                    : (_value33?.imCharId &&
                          _value35.find(
                              (_value39) => String(_value39.id) === String(_value33.imCharId),
                          )) ||
                      _value35.find(
                          (_value40) => String(_value40.id) === String(_value31.authorId),
                      );
            let _value37 = String(_value31.authorId) === 'profile' ? _value32.profile : _value33;
            if (!_value37 && !_value36) {
                const _value41 = (_value32.settings.imagePromptConfigs ||= {});
                _value37 = _value41['author:' + _value31.authorId] ||= {};
            }
            return {
                friend: _value36,
                local: _value37,
                record: _value36 || _value37,
                name:
                    _value36?.nickname ||
                    _value36?.realName ||
                    _value33?.name ||
                    _value31.authorName ||
                    'Char',
            };
        }
        async function _value12(
            _value42 = {
                dirtyTabs: [],
            },
        ) {
            window.tkPersistState(_value42);
            const _value43 = await window.saveGlobalData?.();
            if (_value43 === false) throw new Error('保存失败，请检查存储空间后重试');
        }
        async function _value13(_value44, _value45) {
            if (!_value1(_value44)) throw _value10();
            const _value46 = _value11(_value44);
            if (_value46.friend) {
                const _value47 = await window.imApp?.commitFriendMetaPatch?.(
                    _value46.friend.id,
                    _value45,
                );
                if (!_value47) throw new Error('角色生图设置保存失败，请重试');
            } else {
                const _value48 = new Map(
                    Object.keys(_value45).map((_value49) => [_value49, _value46.local[_value49]]),
                );
                Object.assign(_value46.local, _value45);
                try {
                    await _value12();
                } catch (_value50) {
                    _value48.forEach((_value51, _value52) => {
                        if (_value51 === undefined) delete _value46.local[_value52];
                        else _value46.local[_value52] = _value51;
                    });
                    window.tkPersistState({
                        dirtyTabs: [],
                    });
                    throw _value50;
                }
            }
        }
        function _value14(_value53, _value54, _value55 = {}) {
            const _value56 = _value11(_value53).record.imagePromptConfig || {};
            return {
                ..._value56,
                basePrompt: String(_value54 || '').trim(),
                lastPrompt: String(_value54 || '').trim(),
                charAppearance: String(_value55.charAppearance || '').trim(),
                userAppearance: String(_value55.userAppearance || '').trim(),
                artistPrompt: String(_value55.artistPrompt || '').trim(),
                negativePrompt: String(_value55.negativePrompt || '').trim(),
                activePresetId: _value55.activePresetId || '',
                presets: Array.isArray(_value55.presets)
                    ? _value55.presets
                    : _value56.presets || [],
                autoGenerate: _value56.autoGenerate === true,
            };
        }
        function _value15(_value57) {
            const _value58 =
                Array.isArray(_value57.sceneSegments) && _value57.sceneSegments.length
                    ? _value57.sceneSegments
                    : [_value57.opening, _value57.middle, _value57.ending].filter(Boolean);
            const _value59 = _value58.length ? _value58.join('\n') : _value57.sceneText;
            return [
                _value57.imagePrompt && '画面提示：' + _value57.imagePrompt,
                _value59 && '画面描述：' + _value59,
                _value57.desc && '视频文案：' + _value57.desc,
            ]
                .filter(Boolean)
                .join('\n\n')
                .slice(0, 12000);
        }
        async function _value16(_value60) {
            if (_value60.imageFaceReferenceAssetId) {
                const _value61 = await window.appStorage?.getAssetUrl?.(
                    _value60.imageFaceReferenceAssetId,
                );
                if (_value61) return _value61;
            }
            return _value60.imageFaceReferenceUrl || '';
        }
        function _value17() {
            return window.appStorage?.readDomain?.('settings', {})?.imessageUserFaceReference || {};
        }
        async function _value18(_value62, _value63, _value64) {
            if (!/^image\//i.test(_value64?.type || '')) throw new Error('请选择图片文件');
            if (!window.imApp?.compressImageFile || !window.appStorage?.saveAssetFromDataUrl)
                throw new Error('图片存储服务不可用');
            const _value65 =
                _value63 === 'user'
                    ? _value17().assetId
                    : _value11(_value62).record.imageFaceReferenceAssetId;
            const _value66 = await window.imApp.compressImageFile(_value64, {
                maxWidth: 1536,
                maxHeight: 1536,
                quality: 0.9,
                mimeType: 'image/jpeg',
            });
            if (!_value1(_value62)) throw _value10();
            const _value67 = 'tk-' + _value63 + '-face-' + _value8();
            const _value68 = await window.appStorage.saveAssetFromDataUrl(_value67, _value66, {
                ownerType:
                    _value63 === 'user' ? 'im_user_face_reference' : 'tk_char_face_reference',
                ownerId: _value63 === 'user' ? 'global' : String(_value62.authorId),
                fileName: _value64.name,
            });
            if (!_value68) throw new Error('参考脸保存失败');
            try {
                if (!_value1(_value62)) throw _value10();
                if (_value63 === 'user')
                    await window.appStorage.commitDomain(
                        'settings',
                        (_value69) => {
                            _value69.imessageUserFaceReference = {
                                assetId: _value67,
                                fileName: _value64.name,
                            };
                        },
                        {
                            critical: true,
                            reason: 'tk-user-face-reference',
                        },
                    );
                else
                    await _value13(_value62, {
                        imageFaceReferenceAssetId: _value67,
                        imageFaceReferenceUrl: null,
                        imageFaceReferenceFileName: _value64.name,
                    });
            } catch (_value70) {
                await window.appStorage.deleteAsset(_value67)['catch'](() => undefined);
                throw _value70;
            }
            if (_value65 && _value65 !== _value67)
                await window.appStorage.deleteAsset(_value65)['catch'](() => undefined);
            return {
                imageUrl: await window.appStorage.getAssetUrl(_value67),
                fileName: _value64.name,
            };
        }
        async function _value19(_value71, _value72) {
            const _value73 =
                _value72 === 'user'
                    ? _value17().assetId
                    : _value11(_value71).record.imageFaceReferenceAssetId;
            if (_value72 === 'user')
                await window.appStorage.commitDomain(
                    'settings',
                    (_value74) => {
                        _value74.imessageUserFaceReference = {
                            assetId: '',
                            fileName: '',
                        };
                    },
                    {
                        critical: true,
                        reason: 'tk-user-face-reference-delete',
                    },
                );
            else
                await _value13(_value71, {
                    imageFaceReferenceAssetId: null,
                    imageFaceReferenceUrl: null,
                    imageFaceReferenceFileName: '',
                });
            if (_value73) await window.appStorage.deleteAsset(_value73)['catch'](() => undefined);
        }
        function _value20(_value75, _value76, _value77) {
            if (!_value1(_value75)) return Promise.resolve(false);
            _value75.scene = String(_value77.secondaryValue ?? _value75.scene).trim();
            _value75.config = _value14(_value75, _value76, _value77);
            return _value13(_value75, {
                imagePromptConfig: _value75.config,
            });
        }
        async function _value21(_value78) {
            if (!_value1(_value78)) return;
            if (_value78.running) {
                _value24(_value78);
                return;
            }
            const _value79 = ++_value5;
            const _value80 = _value11(_value78);
            const _value81 = _value80.record.imagePromptConfig || {};
            const _value82 = _value17();
            let _value83;
            let _value84;
            try {
                [_value83, _value84] = await Promise.all([
                    _value16(_value80.record),
                    _value82.assetId ? window.appStorage.getAssetUrl(_value82.assetId) : '',
                ]);
            } catch (_value86) {
                _value7(_value86.message || '参考脸读取失败');
                return;
            }
            if (_value79 !== _value5 || !_value1(_value78) || !_value0(_value78.videoId)) return;
            if (_value6?.classList.contains('active')) window.closeView(_value6);
            _value4 = _value78;
            const _value85 = window.imApp?.showCustomModal || window.showCustomModal;
            if (!_value85) {
                _value7('生图提示词窗口尚未加载，请刷新后重试');
                return;
            }
            _value85({
                type: 'prompt',
                title: 'TikTok 生图',
                ownerId: 'tiktok-image-generation',
                autoFocus: false,
                multiline: true,
                message: 'Char：' + _value80.name + '。根据当前视频生成图片，可先修改画面描述。',
                textareaLabel: '基础正向提示词',
                placeholder: '持续应用的主体、场景或质量要求（选填）',
                defaultValue: _value81.basePrompt || _value81.lastPrompt || '',
                secondaryTextarea: {
                    label: '视频画面描述',
                    defaultValue: _value78.scene,
                    placeholder: '描述想生成的这一张图片',
                },
                confirmText: '开始生成',
                confirmTone: 'dark',
                generationPrompt: {
                    ..._value81,
                    showAutoGenerate: false,
                    onSavePreset: async ({
                        presets: _value87,
                        activePresetId: _value88,
                        preset: _value89,
                    }) => {
                        const _value90 = _value11(_value78).record.imagePromptConfig || {};
                        await _value13(_value78, {
                            imagePromptConfig: {
                                ..._value90,
                                presets: _value87,
                                activePresetId: _value88,
                                charAppearance: _value89.charAppearance || '',
                                userAppearance: _value89.userAppearance || '',
                                artistPrompt: _value89.artistPrompt || '',
                                negativePrompt: _value89.negativePrompt || '',
                                basePrompt: _value89.basePrompt || _value89.prompt || '',
                                lastPrompt: _value89.basePrompt || _value89.prompt || '',
                            },
                        });
                    },
                },
                referenceFaces: {
                    char: {
                        title: _value80.name,
                        imageUrl: _value83,
                        fileName: _value80.record.imageFaceReferenceFileName || '',
                        onUpload: (_value91) => _value18(_value78, 'char', _value91),
                        onDelete: () => _value19(_value78, 'char'),
                    },
                    user: {
                        title: 'User',
                        imageUrl: _value84,
                        fileName: _value82.fileName || '',
                        onUpload: (_value92) => _value18(_value78, 'user', _value92),
                        onDelete: () => _value19(_value78, 'user'),
                    },
                },
                onCancel: (_value93) => {
                    _value4 = null;
                    _value20(_value78, _value93.promptValue, _value93)['catch']((_value94) =>
                        _value7(_value94.message),
                    );
                },
                onConfirm: async (_value95, _value96) => {
                    if (!String(_value96.secondaryValue || '').trim()) {
                        _value7('请输入视频画面描述');
                        return false;
                    }
                    if (!_value0(_value78.videoId)) {
                        _value7('视频已删除');
                        return false;
                    }
                    if (
                        !window.u2ImageGeneration?.generate ||
                        !window.imChat?.prepareEnglishImageScene
                    )
                        throw new Error('生图功能尚未加载，请刷新后重试');
                    window.u2ImageGeneration.validateActiveConfig(
                        window.u2ImageGeneration.getActiveConfig(),
                    );
                    await _value20(_value78, _value95, _value96);
                    if (!_value96.isCurrent() || !_value1(_value78) || !_value0(_value78.videoId))
                        return false;
                    _value4 = null;
                    window.imApp.closeCustomModal(false);
                    _value78.running = true;
                    _value78.status = '正在根据视频描述整理画面…';
                    _value24(_value78);
                    void _value22(_value78);
                    return true;
                },
            });
        }
        async function _value22(_value97) {
            const _value98 = _value97.scene;
            const _value99 = {
                ..._value97.config,
            };
            try {
                if (!_value1(_value97)) throw _value10();
                const _value100 = _value11(_value97);
                const _value101 = _value100.friend || {
                    nickname: _value100.name,
                };
                const _value102 = await window.imChat.prepareEnglishImageScene(_value101, _value98);
                if (!_value1(_value97)) throw _value10();
                if (!_value0(_value97.videoId)) throw new Error('视频已删除，本次生成已停止');
                const _value103 = [];
                if (_value102.charPresent) {
                    const _value105 = await _value16(_value11(_value97).record);
                    if (_value105)
                        _value103.push({
                            role: 'char',
                            imageUrl: _value105,
                        });
                }
                if (_value102.userPresent) {
                    const _value106 = _value17();
                    const _value107 = _value106.assetId
                        ? await window.appStorage.getAssetUrl(_value106.assetId)
                        : '';
                    if (_value107)
                        _value103.push({
                            role: 'user',
                            imageUrl: _value107,
                        });
                }
                _value97.status = '正在生成图片…';
                _value25(_value97);
                const _value104 = await window.u2ImageGeneration.generate(_value102.scenePrompt, {
                    ..._value99,
                    referenceImages: _value103,
                    includeCharAppearance: _value102.charPresent,
                    includeUserAppearance: _value102.userPresent,
                });
                if (!_value1(_value97)) throw _value10();
                if (!_value104?.imageUrl) throw new Error('生图接口没有返回图片');
                if (!_value0(_value97.videoId)) throw new Error('视频已删除，生成结果未应用');
                _value97.result = _value104;
                _value97.status = '预览满意后，可设为当前视频配图。';
            } catch (_value108) {
                if (_value108.name === 'AbortError') return;
                _value97.status = _value108.message || '生成失败，请重试';
                _value7(_value97.status);
            } finally {
                _value97.running = false;
                _value25(_value97);
            }
        }
        function _value23() {
            if (_value6) return _value6;
            _value6 = document.createElement('div');
            _value6.id = 'tk-image-preview-sheet';
            _value6.className = 'bottom-sheet-overlay detail-sheet-overlay';
            _value6.innerHTML =
                "<div class=\"bottom-sheet tk-image-preview-sheet\">\n            <div class=\"sheet-handle\"></div><div class=\"sheet-title\">视频配图预览</div>\n            <div class=\"detail-sheet-content tk-image-preview-content\">\n                <img referrerpolicy=\"no-referrer\" class=\"tk-image-preview-image\" alt=\"当前视频生成的图片\" hidden>\n                <p class=\"tk-image-preview-status\" role=\"status\" aria-live=\"polite\"></p>\n            </div>\n            <div class=\"tk-image-preview-actions\">\n                    <button type=\"button\" data-action=\"save\">保存图片</button>\n                    <button type=\"button\" data-action=\"apply\">设为视频配图</button>\n                    <button type=\"button\" data-action=\"regenerate\">重新生成</button>\n                    <button type=\"button\" data-action=\"close\">关闭</button>\n            </div></div>";
            document.getElementById('tiktok-view').appendChild(_value6);
            _value6.addEventListener('u2:view-closing', () => {
                _value3 = null;
                _value5++;
            });
            _value6.addEventListener('click', async (_value109) => {
                const _value110 = _value3;
                const _value111 = _value109.target.closest('[data-action]')?.dataset.action;
                if (_value109.target === _value6 || _value111 === 'close') {
                    window.closeView(_value6);
                    return;
                }
                if (!_value110 || !_value111) return;
                if (_value111 === 'regenerate') {
                    void _value21(_value110);
                    return;
                }
                if (!_value110.result || _value110.applying || _value110.saving) return;
                try {
                    if (_value111 === 'save') {
                        _value110.saving = true;
                        _value25(_value110);
                        if (!window.u2ExportFile) throw new Error('图片保存功能尚未加载');
                        const _value112 = await fetch(_value110.result.imageUrl);
                        if (!_value112.ok) throw new Error('无法读取图片');
                        const _value113 = await _value112.blob();
                        if (!/^image\//i.test(_value113.type)) throw new Error('图片数据无效');
                        const _value114 = _value113.type.includes('jpeg')
                            ? 'jpg'
                            : _value113.type.includes('webp')
                              ? 'webp'
                              : 'png';
                        const _value115 = await window.u2ExportFile({
                            blob: _value113,
                            fileName: 'tiktok-' + _value8() + '.' + _value114,
                            title: 'TikTok 生成图片',
                        });
                        if (_value115 === 'failed') throw new Error('图片保存失败');
                        if (_value115 !== 'cancelled') _value7('图片已导出');
                    } else {
                        if (_value111 === 'apply') await _value26(_value110);
                    }
                } catch (_value116) {
                    if (_value116.name !== 'AbortError')
                        _value7(_value116.message || '操作失败，请重试');
                } finally {
                    _value110.saving = false;
                    _value25(_value110);
                }
            });
            return _value6;
        }
        function _value24(_value117) {
            const _value118 = _value23();
            _value3 = _value117;
            window.openView(_value118);
            _value25(_value117);
        }
        function _value25(_value119) {
            if (_value3 !== _value119 || !_value6?.classList.contains('active')) return;
            const _value120 = _value6.querySelector('img');
            _value120.hidden = !_value119.result;
            if (_value119.result && _value120.getAttribute('src') !== _value119.result.imageUrl)
                _value120.src = _value119.result.imageUrl;
            _value6.querySelector('[role="status"]').textContent = _value119.status || '';
            _value6.querySelector('[data-action="save"]').disabled =
                !_value119.result || _value119.saving || _value119.applying;
            _value6.querySelector('[data-action="apply"]').disabled =
                !_value119.result ||
                _value119.running ||
                _value119.applying ||
                _value119.saving ||
                !_value0(_value119.videoId);
            _value6.querySelector('[data-action="regenerate"]').disabled =
                _value119.running || _value119.applying || _value119.saving;
        }
        window.tkReleaseUnusedVideoAsset = async function (_value121) {
            if (
                !_value121 ||
                _value9().some((_value122) => _value122.generatedCoverAssetId === _value121)
            )
                return;
            await window.appStorage?.deleteAsset?.(_value121)['catch'](() => undefined);
        };
        async function _value26(_value123) {
            if (!_value1(_value123)) throw _value10();
            if (!_value0(_value123.videoId)) throw new Error('视频已删除，无法应用图片');
            _value123.applying = true;
            _value25(_value123);
            const _value124 = 'tk-video-cover-' + _value8();
            let _value125 = [];
            const _value126 = new Map();
            try {
                const _value127 = await fetch(_value123.result.imageUrl);
                if (!_value127.ok) throw new Error('无法读取图片');
                const _value128 = await _value127.blob();
                if (!_value1(_value123)) throw _value10();
                if (!/^image\//i.test(_value128.type)) throw new Error('图片数据无效');
                const _value129 = await window.appStorage.saveAssetFromBlob(_value124, _value128, {
                    ownerType: 'tk_video_cover',
                    ownerId: String(_value123.videoId),
                });
                if (!_value129) throw new Error('图片存储失败');
                const _value130 = await window.appStorage.getAssetUrl(_value124);
                if (!_value1(_value123)) throw _value10();
                if (!_value130) throw new Error('无法读取已保存的图片');
                _value125 = _value9().filter(
                    (_value133) => String(_value133.id) === String(_value123.videoId),
                );
                if (!_value125.length) throw new Error('视频已删除，无法应用图片');
                _value125.forEach((_value134) => {
                    _value126.set(_value134, _value134.generatedCoverAssetId);
                    _value134.generatedCoverAssetId = _value124;
                });
                window.tkCacheVideoAsset(_value124, _value130);
                await _value12({
                    dirtyTabs: ['tk-profile-tab'],
                });
                if (!_value1(_value123)) throw _value10();
                await Promise.all(
                    [...new Set(_value126.values())].map((_value135) =>
                        window.tkReleaseUnusedVideoAsset(_value135),
                    ),
                );
                window.tkRenderHome?.();
                if (document.getElementById('tk-profile-tab')?.classList.contains('active'))
                    window.tkRenderProfile?.();
                const _value131 = document.getElementById('tk-sub-profile-view');
                if (_value131?.classList.contains('active'))
                    window.tkOpenSubProfile?.(window.currentTkSubProfileCharId);
                const _value132 = document.getElementById('tk-fullscreen-video-view');
                if (
                    _value132?.classList.contains('active') &&
                    String(_value132.dataset.videoId) === String(_value123.videoId)
                )
                    window.tkOpenFullscreenVideo?.(_value123.videoId);
                _value123.status = '已设为视频配图';
                _value7(_value123.status);
            } catch (_value136) {
                _value125.forEach((_value137) => {
                    if (_value137.generatedCoverAssetId !== _value124) return;
                    const _value138 = _value126.get(_value137);
                    if (_value138) _value137.generatedCoverAssetId = _value138;
                    else delete _value137.generatedCoverAssetId;
                });
                if (_value125.length)
                    window.tkPersistState({
                        dirtyTabs: [],
                    });
                await window.tkReleaseUnusedVideoAsset(_value124);
                throw _value136;
            } finally {
                _value123.applying = false;
            }
        }
        window.tkOpenVideoImageGenerator = async function (_value139) {
            const _value140 = _value0(_value139);
            if (!_value140) {
                _value7('视频已删除或不存在');
                return;
            }
            let _value141 = _value2.get(String(_value139));
            _value141 &&
                !_value1(_value141) &&
                (_value2['delete'](String(_value139)), (_value141 = null));
            const _value142 = _value15(_value140);
            if (!_value141) {
                _value141 = {
                    videoId: _value140.id,
                    authorId: _value140.authorId || 'video:' + _value140.id,
                    authorName: _value140.authorName,
                    scene: _value142,
                    source: _value142,
                    isDataCurrent: window.tkCaptureDataGuard('videos'),
                    running: false,
                    result: null,
                };
                _value2.set(String(_value139), _value141);
            } else
                _value141.source !== _value142 &&
                    !_value141.running &&
                    ((_value141.source = _value142), (_value141.scene = _value142));
            if (_value141.result || _value141.running) _value24(_value141);
            else await _value21(_value141);
        };
        window.tkCloseImageGeneration = function () {
            _value5++;
            if (_value4) {
                _value4 = null;
                if (
                    document.getElementById('custom-modal-overlay')?.dataset.ownerId ===
                    'tiktok-image-generation'
                )
                    window.imApp?.closeCustomModal?.(true);
            }
            if (_value6) window.closeView(_value6);
        };
        document.getElementById('tiktok-view')?.addEventListener('u2:view-closing', () => {
            window.closeView(document.getElementById('tk-search-generate-sheet'));
            window.tkCloseImageGeneration();
        });
        document.addEventListener('tk:data-cleared', ({ detail: _value143 }) => {
            if (_value143.kind === 'dms') return;
            _value2.forEach((_value145) => (_value145.cancelled = true));
            _value2.clear();
            window.tkCloseImageGeneration();
            const _value144 = _value6?.querySelector('img');
            _value144 && (_value144.removeAttribute('src'), (_value144.hidden = true));
        });
    },
);
