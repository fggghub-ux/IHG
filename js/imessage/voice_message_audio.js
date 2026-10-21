(function () {
    const value = new Map();
    const _value = new Map();
    function handleAction(value_14) {
        return String(value_14?.transcript || value_14?.text || '').trim();
    }
    function handleAction_1(value_15, value_16) {
        const string = String(value_16?.id || '');
        return (
            (value_15?.messages || []).find((value_17) => String(value_17?.id || '') === string) ||
            value_16
        );
    }
    function handleAction_2(value_18, message) {
        if (message?.role !== 'assistant' || message?.type !== 'voice_message') return null;
        const messageTtsFriend = window.u2Tts?.resolveMessageTtsFriend?.(value_18, message);
        return messageTtsFriend &&
            (messageTtsFriend.type === 'char' || messageTtsFriend.type === 'friend')
            ? messageTtsFriend
            : null;
    }
    function handleAction_3(value_19, value_20) {
        return !!handleAction_2(value_19, value_20);
    }
    function handleAction_4(value_21, message_22) {
        return (
            String(value_21?.id || '') + ':' + String(message_22?.id || message_22?.timestamp || '')
        );
    }
    function _value2(_value5, _value6) {
        const _value7 = handleAction_4(_value5, _value6);
        const _value8 = handleAction_1(_value5, _value6);
        const _value9 = _value.get(_value7);
        if (!_value9) return null;
        if (
            _value9.assetId !== _value8?.ttsAudioAssetId ||
            _value9.text !== handleAction(_value8) ||
            _value8?.ttsAudioText !== _value9.text
        ) {
            _value['delete'](_value7);
            return null;
        }
        return _value9;
    }
    function _value3() {
        const _value0 = typeof navigator === 'undefined' ? null : navigator;
        const _value1 = String(_value0?.userAgent || '');
        return (
            /iPad|iPhone|iPod/i.test(_value1) ||
            (/Macintosh/i.test(_value1) && Number(_value0?.maxTouchPoints) > 1)
        );
    }
    async function handleAction_5(value_23) {
        const trim_24 = String(value_23 || '').trim();
        if (!trim_24) throw new Error('TTS 未返回可保存的音频');
        if (trim_24.startsWith('data:')) {
            const dataUrlToBlob_27 = window.appStorage?.dataUrlToBlob?.(trim_24);
            if (dataUrlToBlob_27?.size) return dataUrlToBlob_27;
        }
        const value_25 = await fetch(trim_24);
        if (!value_25.ok) throw new Error('无法读取生成的音频 (' + value_25.status + ')');
        const value_26 = await value_25.blob();
        if (!value_26.size) throw new Error('生成的音频为空');
        return value_26;
    }
    async function handleAction_6(value_28, value_29) {
        const handleAction_1_30 = handleAction_1(value_28, value_29);
        const handleAction_31 = handleAction(handleAction_1_30);
        const string_32 = String(handleAction_1_30?.ttsAudioAssetId || '');
        if (!string_32 || !handleAction_31 || handleAction_1_30.ttsAudioText !== handleAction_31)
            return null;
        const value_33 = await window.appStorage?.getAssetBlob?.(string_32);
        return value_33?.size
            ? {
                  assetId: string_32,
                  blob: value_33,
              }
            : null;
    }
    function handleAction_7(value_34, value_35) {
        const slice_36 = ((value_34?.id || '') + '_' + (value_35?.id || ''))
            .replace(/[^a-z0-9_-]+/gi, '-')
            .slice(0, 140);
        const value_37 =
            window.crypto?.randomUUID?.() || Date.now() + '_' + Math.random().toString(36).slice(2);
        return 'im_voice_tts_' + slice_36 + '_' + value_37;
    }
    async function handleAction_8(value_38, value_39) {
        const handleAction_1_40 = handleAction_1(value_38, value_39);
        const handleAction_2_41 = handleAction_2(value_38, handleAction_1_40);
        const handleAction_42 = handleAction(handleAction_1_40);
        if (!handleAction_2_41) throw new Error('无法确定这条语音的发送角色');
        if (!handleAction_42) throw new Error('这条语音没有可合成的文字');
        if (!window.u2Tts?.canSpeakForFriend?.(handleAction_2_41))
            throw new Error('请先为该角色开启 TTS 并设置音色 ID');
        if (
            !window.appStorage?.saveAssetFromBlob ||
            !window.appStorage?.getAssetBlob ||
            !window.imApp?.updateFriendMessage
        )
            throw new Error('语音存储服务不可用，请刷新后重试');
        const value_43 = await window.u2Tts.prepareSpeech(handleAction_42, handleAction_2_41);
        let value_44;
        try {
            value_44 = await handleAction_5(value_43);
        } finally {
            if (String(value_43 || '').startsWith('blob:')) URL.revokeObjectURL(value_43);
        }
        const handleAction_7_45 = handleAction_7(value_38, handleAction_1_40);
        await window.appStorage.saveAssetFromBlob(handleAction_7_45, value_44, {
            ownerType: 'imessage_voice_tts',
            ownerId: String(handleAction_1_40.id || ''),
            friendId: String(value_38.id || ''),
        });
        try {
            const value_46 = await window.imApp.updateFriendMessage(
                value_38.id,
                {
                    id: handleAction_1_40.id || null,
                    timestamp: handleAction_1_40.timestamp || null,
                },
                (value_47) => {
                    if (!value_47 || handleAction(value_47) !== handleAction_42)
                        throw new Error('语音文字已变化，请重试');
                    value_47.ttsAudioAssetId = handleAction_7_45;
                    value_47.ttsAudioText = handleAction_42;
                },
                {
                    silent: true,
                },
            );
            if (!value_46) throw new Error('语音保存失败，请重试');
        } catch (value_48) {
            await window.appStorage.deleteAsset?.(handleAction_7_45)['catch'](() => undefined);
            throw value_48;
        }
        value_39.ttsAudioAssetId = handleAction_7_45;
        value_39.ttsAudioText = handleAction_42;
        return {
            assetId: handleAction_7_45,
            blob: value_44,
        };
    }
    async function handleAction_9(value_49, value_50, { regenerate = false } = {}) {
        if (!handleAction_3(value_49, value_50)) throw new Error('这条语音不能生成音频');
        const handleAction_4_51 = handleAction_4(value_49, value_50);
        const result = value.get(handleAction_4_51);
        if (result) {
            if (!regenerate) return result;
            try {
                await result;
            } catch (value_53) {}
        }
        const value_52 = (async () => {
            if (!regenerate) {
                const value_54 = await handleAction_6(value_49, value_50);
                if (value_54) return value_54;
            }
            return handleAction_8(value_49, value_50);
        })();
        value.set(handleAction_4_51, value_52);
        try {
            return await value_52;
        } finally {
            if (value.get(handleAction_4_51) === value_52) value['delete'](handleAction_4_51);
        }
    }
    async function handleAction_10(value_55, value_56, _value11 = {}) {
        const { assetId: value_57 } = await handleAction_9(value_55, value_56, _value11);
        const value_58 = await window.appStorage.getAssetUrl(value_57);
        if (!value_58) throw new Error('已保存的语音无法读取，请重试');
        const _value12 = handleAction_1(value_55, value_56);
        const _value13 = handleAction(_value12);
        if (
            String(_value12?.ttsAudioAssetId || '') !== value_57 ||
            _value12?.ttsAudioText !== _value13
        )
            throw new Error('语音文字已变化，请重试');
        const _value14 = {
            assetId: value_57,
            url: value_58,
            text: _value13,
        };
        _value.set(handleAction_4(value_55, value_56), _value14);
        return _value14;
    }
    function _value4(_value15, _value16) {
        const value_58 = _value2(_value15, _value16);
        if (value_58) return window.u2Tts.playAudioUrl(value_58.url);
        return handleAction_10(_value15, _value16).then((_value17) =>
            _value3()
                ? {
                      readyForTap: true,
                  }
                : window.u2Tts.playAudioUrl(_value17.url),
        );
    }
    async function handleAction_11(value_59, value_60) {
        return handleAction_10(value_59, value_60, {
            regenerate: true,
        });
    }
    function handleAction_12(message_61, value_62) {
        const value_63 =
            {
                'audio/mpeg': 'mp3',
                'audio/mp3': 'mp3',
                'audio/wav': 'wav',
                'audio/x-wav': 'wav',
                'audio/ogg': 'ogg',
                'audio/mp4': 'm4a',
                'audio/webm': 'webm',
                'audio/flac': 'flac',
            }[String(value_62 || '').toLowerCase()] || 'mp3';
        const value_64 = new Date(message_61?.timestamp || Date.now());
        const value_65 = Number.isNaN(value_64.getTime())
            ? String(Date.now())
            : value_64.toISOString().replace(/[:.]/g, '-').slice(0, 19);
        return 'imessage-voice-' + value_65 + '.' + value_63;
    }
    async function handleAction_13(value_66, value_67) {
        if (typeof window.u2ExportFile !== 'function')
            throw new Error('文件下载功能尚未加载，请刷新后重试');
        const { blob: value_68 } = await handleAction_9(value_66, value_67);
        const value_69 = await window.u2ExportFile({
            blob: value_68,
            fileName: handleAction_12(value_67, value_68.type),
            title: 'iMessage 语音',
        });
        if (value_69 === 'failed') throw new Error('语音下载失败，请重试');
        return value_69;
    }
    window.imVoiceMessageAudio = Object.freeze({
        canManage: handleAction_3,
        getOrCreate: handleAction_9,
        isReady: (_value18, _value19) => !!_value2(_value18, _value19),
        play: _value4,
        regenerate: handleAction_11,
        download: handleAction_13,
    });
})();
