(function () {
    'use strict';

    window.imChat = window.imChat || {};
    const text_2 =
            '只描述此刻画面中能直接看见的事实，包含显著文字、人物动作与场景变化。用简短中文，不猜测未显示的手机内容，不写社交媒体评论。',
        value_3 = (value_52) => /^(zh|cn|chinese)(-|$)/i.test(String(value_52 || 'zh')),
        options = {
            en: '英语',
            ja: '日语',
            ko: '韩语',
            fr: '法语',
            de: '德语',
            ru: '俄语',
            es: '西班牙语',
            pt: '葡萄牙语',
            it: '意大利语',
            th: '泰语',
            vi: '越南语',
        },
        items = [5, 10, 20, 30];
    let value_4 = null,
        value_5 = null;
    const getActiveSingleCallContext_6 = window.imChat.getActiveSingleCallContext;
    window.imChat.getActiveSingleCallContext = function (value_53) {
        const friendId_2 = String(
            value_53 && typeof value_53 === 'object' ? value_53.id : (value_53 ?? ''),
        );
        if (value_4 && value_4.connected && String(value_4.friend.id) === friendId_2)
            return {
                active: true,
                connected: true,
                minimized: value_4.minimized,
                friendId: friendId_2,
                mode: 'video',
                durationSeconds: value_4.seconds,
            };
        return typeof getActiveSingleCallContext_6 === 'function'
            ? getActiveSingleCallContext_6(value_53)
            : null;
    };
    function getVideoCallAsrConfig_2() {
        const value_54 = window.appStorage?.readDomain?.('settings', {})?.videoCallAsrConfig || {};
        return {
            endpoint: String(value_54.endpoint || '').trim(),
            apiKey: String(value_54.apiKey || '').trim(),
            model: String(value_54.model || 'gpt-transcribe').trim(),
        };
    }
    function handleAction_8() {
        const number = Number(
            window.appStorage?.readDomain?.('settings', {})?.videoCallObserveSeconds,
        );
        return items.includes(number) ? number : 10;
    }
    async function handleAction_9(value_55) {
        const videoCallAsrConfig_2 = {
            endpoint: String(value_55.endpoint || '').trim(),
            apiKey: String(value_55.apiKey || '').trim(),
            model: String(value_55.model || 'gpt-transcribe').trim(),
        };
        if (
            videoCallAsrConfig_2.endpoint &&
            !/^https:\/\//i.test(videoCallAsrConfig_2.endpoint) &&
            !/^http:\/\/localhost(?::\d+)?\//i.test(videoCallAsrConfig_2.endpoint)
        )
            throw new Error('语音识别接口请使用 HTTPS');
        if (!window.appStorage?.commitDomain) throw new Error('设置存储尚未就绪');
        const videoCallObserveSeconds_2 = Number(value_55.observeSeconds);
        if (!items.includes(videoCallObserveSeconds_2)) throw new Error('请选择有效的观察间隔');
        const value_58 = await window.appStorage.commitDomain(
            'settings',
            (value_59) => ({
                ...value_59,
                videoCallAsrConfig: videoCallAsrConfig_2,
                videoCallObserveSeconds: videoCallObserveSeconds_2,
            }),
            {
                critical: true,
                reason: 'video-call-settings',
            },
        );
        if (value_58 === false) throw new Error('语音识别设置保存失败');
        return videoCallAsrConfig_2;
    }
    window.imChat.getVideoCallAsrConfig = getVideoCallAsrConfig_2;
    window.imChat.isVideoCallActive = () => !!value_4 && !value_4.ended;
    function handleAction_10(value_60) {
        if (window.showToast) window.showToast(value_60);
    }
    function handleAction_11(value_61, value_62, value_63 = '') {
        return (
            '<button type="button" class="im-video-call-control ' +
            value_63 +
            '" data-action="' +
            value_61 +
            '" aria-label="' +
            value_62 +
            '" title="' +
            value_62 +
            '"><span class="im-video-call-icon"><i class="fas fa-' +
            (value_61 === 'hangup'
                ? 'phone-slash'
                : value_61 === 'mute'
                  ? 'microphone'
                  : value_61 === 'camera'
                    ? 'video'
                    : value_61 === 'flip'
                      ? 'sync-alt'
                      : value_61 === 'share'
                        ? 'mobile-alt'
                        : value_61 === 'reroll'
                          ? 'redo-alt'
                          : 'magic') +
            '" aria-hidden="true"></i></span><span>' +
            value_62 +
            '</span></button>'
        );
    }
    function handleAction_12() {
        let imVideoCallViewElement = document.getElementById('im-video-call-view');
        if (imVideoCallViewElement) return imVideoCallViewElement;
        return (
            (imVideoCallViewElement = document.createElement('div')),
            (imVideoCallViewElement.id = 'im-video-call-view'),
            (imVideoCallViewElement.className = 'im-video-call app-view'),
            (imVideoCallViewElement.innerHTML =
                `
            <div class="im-video-call-stage"><img class="im-video-call-avatar" alt=""><div class="im-video-call-avatar-fallback" hidden><i class="fas fa-user"></i></div><div class="im-video-call-name"></div><div class="im-video-call-status" role="status">正在呼叫…</div></div>
            <div class="im-video-call-captions" aria-live="polite"></div>
            <div class="im-video-call-preview"><video autoplay muted playsinline></video><img alt="共享画面预览" hidden><div class="im-video-call-preview-label">我的画面</div></div>
            <div class="im-video-call-top"><button type="button" class="im-video-call-icon" data-action="minimize" aria-label="最小化"><i class="fas fa-chevron-down"></i></button><button type="button" class="im-video-call-icon" data-action="config" aria-label="视频通话设置"><i class="fas fa-cog"></i></button></div>
            <div class="im-video-call-bottom"><div class="im-video-call-controls">` +
                handleAction_11('mute', '静音') +
                handleAction_11('camera', '摄像头') +
                handleAction_11('flip', '翻转') +
                handleAction_11('share', '共享屏幕') +
                handleAction_11('reroll', '重回') +
                handleAction_11('hangup', '挂断', 'hangup') +
                `</div><div class="im-video-call-input-row"><input class="im-video-call-input" type="text" inputmode="text" enterkeyhint="send" autocomplete="off" autocapitalize="sentences" placeholder="输入消息…"><button type="button" class="im-video-call-send" data-action="send" aria-label="发送消息" title="发送消息"><i class="fas fa-arrow-up" aria-hidden="true"></i></button></div></div>
            <div class="im-video-call-float" data-action="restore" role="button" tabindex="0"><i class="fas fa-video"></i><div class="im-video-call-float-time">00:00</div></div>
            <div class="im-video-call-config"><form class="im-video-call-config-card"><h2>视频通话设置</h2><label>观察间隔<select name="observeSeconds"><option value="5">每 5 秒</option><option value="10">每 10 秒</option><option value="20">每 20 秒</option><option value="30">每 30 秒</option></select></label><p class="im-video-call-config-hint">仅在 Char 空闲时观察；识图、回复和朗读仍需时间。间隔越短，接口调用越多。</p><h3>语音识别</h3><p class="im-video-call-config-hint">使用兼容 /audio/transcriptions 的服务；不配置也能使用文字和画面通话。</p><label>接口地址<input name="endpoint" type="url" placeholder="https://api.example.com/v1/audio/transcriptions"></label><label>API Key（如接口需要）<input name="apiKey" type="password" autocomplete="off"></label><label>模型<input name="model" type="text" value="gpt-transcribe" required></label><div class="im-video-call-config-actions"><button type="button" data-action="close-config">取消</button><button type="submit" class="primary">保存</button></div></form></div>`),
            (document.getElementById('app') || document.body).appendChild(imVideoCallViewElement),
            imVideoCallViewElement
        );
    }
    function handleAction_13(value_64, textContent_2) {
        if (!handleAction_15(value_64)) return;
        value_64.view.querySelector('.im-video-call-status').textContent = textContent_2;
    }
    function handleAction_14(value_66, value_67) {
        if (!handleAction_15(value_66)) return;
        value_66.statusUntil = Date.now() + 7000;
        handleAction_13(value_66, value_67);
    }
    function handleAction_15(value_68) {
        return !!value_68 && value_4 === value_68 && !value_68.ended;
    }
    function handleAction_16(value_69) {
        return (
            String(Math.floor(value_69 / 60)).padStart(2, '0') +
            ':' +
            String(value_69 % 60).padStart(2, '0')
        );
    }
    function handleAction_17(value_70) {
        try {
            value_70?.getTracks().forEach((value_71) => value_71.stop());
        } catch (value_72) {}
    }
    async function handleAction_18(value_73, value_74, value_75, value_76, value_77) {
        const value_78 = new AbortController();
        let enabled_79 = false;
        const handleSignalAbort = () => value_78.abort();
        if (value_73.controller.signal.aborted) handleSignalAbort();
        else
            value_73.controller.signal.addEventListener('abort', handleSignalAbort, {
                once: true,
            });
        const setTimeout_81 = setTimeout(() => {
            enabled_79 = true;
            handleSignalAbort();
        }, value_76);
        try {
            return await fetch(value_74, {
                ...value_75,
                signal: value_78.signal,
            });
        } catch (value_82) {
            if (enabled_79) throw new Error(value_77 + '超时，请稍后重试');
            throw value_82;
        } finally {
            clearTimeout(setTimeout_81);
            value_73.controller.signal.removeEventListener('abort', handleSignalAbort);
        }
    }
    async function handleAction_19(value_83, value_84, value_85) {
        let value_86;
        try {
            return await Promise.race([
                value_83,
                new Promise((value_87, value_88) => {
                    value_86 = setTimeout(
                        () => value_88(new Error(value_85 + '超时，请稍后重试')),
                        value_84,
                    );
                }),
            ]);
        } finally {
            clearTimeout(value_86);
        }
    }
    function handleAction_20(value_89, value_90) {
        if (!handleAction_15(value_89)) return null;
        const options_91 = {
            text: String(value_90.text || '').trim(),
            translationText: String(value_90.translationText || '').trim(),
            actionText: String(value_90.actionText || '').trim(),
            thoughtText: String(value_90.thoughtText || '').trim(),
            visualSummary: String(value_90.visualSummary || '').trim(),
            isSelf: !!value_90.isSelf,
            timestamp: Date.now(),
            callTurnId: 'video-' + Date.now() + '-' + ++value_89.sequence,
        };
        value_89.messages.push(options_91);
        if (!options_91.isSelf && options_91.text && !value_90.deferCaption) {
            const element = document.createElement('div');
            element.className = 'im-video-call-line';
            element.dataset.callTurnId = options_91.callTurnId;
            const element_92 = document.createElement('div');
            element_92.className = 'im-video-call-original';
            element_92.textContent = options_91.text;
            element.appendChild(element_92);
            if (options_91.translationText) {
                const element_93 = document.createElement('div');
                element_93.className = 'im-video-call-translation';
                const element_94 = document.createElement('span');
                element_94.className = 'im-video-call-translation-label';
                element_94.textContent = '译';
                element_93.append(element_94, document.createTextNode(options_91.translationText));
                element.appendChild(element_93);
            }
            const imVideoCallCaptionsElement =
                value_89.view.querySelector('.im-video-call-captions');
            imVideoCallCaptionsElement.appendChild(element);
            handleAction_22(value_89);
        }
        return options_91;
    }
    function handleAction_21(value_95, value_96, value_97, value_98) {
        if (!handleAction_15(value_95)) return;
        const imVideoCallCaptionsElement_99 =
            value_95.view.querySelector('.im-video-call-captions');
        let querySelector_100 = imVideoCallCaptionsElement_99.querySelector(
            '[data-call-turn-id="' + value_96.callTurnId + '"]',
        );
        if (value_98 || !querySelector_100) {
            if (querySelector_100) querySelector_100.remove();
            querySelector_100 = document.createElement('div');
            querySelector_100.className = 'im-video-call-line';
            querySelector_100.dataset.callTurnId = value_96.callTurnId;
            imVideoCallCaptionsElement_99.appendChild(querySelector_100);
        }
        const element_101 = document.createElement('div');
        element_101.className = 'im-video-call-segment';
        const element_102 = document.createElement('div');
        element_102.className = 'im-video-call-original';
        element_102.textContent = value_97.text;
        element_101.appendChild(element_102);
        if (value_97.translation) {
            const element_103 = document.createElement('div');
            element_103.className = 'im-video-call-translation';
            const element_104 = document.createElement('span');
            element_104.className = 'im-video-call-translation-label';
            element_104.textContent = '译';
            element_103.append(element_104, document.createTextNode(value_97.translation));
            element_101.appendChild(element_103);
        }
        querySelector_100.appendChild(element_101);
        handleAction_22(value_95);
    }
    function handleAction_22(value_105) {
        if (!value_105.followCaptions) return;
        requestAnimationFrame(() => {
            if (!handleAction_15(value_105) || !value_105.followCaptions) return;
            const imVideoCallCaptionsElement_106 =
                value_105.view.querySelector('.im-video-call-captions');
            if (imVideoCallCaptionsElement_106.scrollTo)
                imVideoCallCaptionsElement_106.scrollTo({
                    top: imVideoCallCaptionsElement_106.scrollHeight,
                    behavior: 'smooth',
                });
            else
                imVideoCallCaptionsElement_106.scrollTop =
                    imVideoCallCaptionsElement_106.scrollHeight;
        });
    }
    function handleAction_23(value_107, value_108) {
        if (!value_108) return;
        value_107.messages = value_107.messages.filter((value_109) => value_109 !== value_108);
        value_107.view
            .querySelectorAll('[data-call-turn-id="' + value_108.callTurnId + '"]')
            .forEach((value_110) => value_110.remove());
    }
    function handleAction_24(value_111) {
        const imVideoCallCaptionsElement_112 =
                value_111.view.querySelector('.im-video-call-captions'),
            value_113 = () => {
                value_111.lastCaptionInteraction = Date.now();
            },
            handleScroll = () => {
                if (Date.now() - value_111.lastCaptionInteraction > 1500) return;
                value_111.followCaptions =
                    imVideoCallCaptionsElement_112.scrollHeight -
                        imVideoCallCaptionsElement_112.scrollTop -
                        imVideoCallCaptionsElement_112.clientHeight <=
                    48;
            };
        return (
            imVideoCallCaptionsElement_112.addEventListener('pointerdown', value_113, {
                passive: true,
            }),
            imVideoCallCaptionsElement_112.addEventListener('touchstart', value_113, {
                passive: true,
            }),
            imVideoCallCaptionsElement_112.addEventListener('wheel', value_113, {
                passive: true,
            }),
            imVideoCallCaptionsElement_112.addEventListener('scroll', handleScroll, {
                passive: true,
            }),
            () => {
                imVideoCallCaptionsElement_112.removeEventListener('pointerdown', value_113);
                imVideoCallCaptionsElement_112.removeEventListener('touchstart', value_113);
                imVideoCallCaptionsElement_112.removeEventListener('wheel', value_113);
                imVideoCallCaptionsElement_112.removeEventListener('scroll', handleScroll);
            }
        );
    }
    function handleAction_25(value_115, value_116, textContent_3) {
        const imVideoCallPreviewVideoElement = value_115.view.querySelector(
                '.im-video-call-preview video',
            ),
            imVideoCallPreviewImgElement = value_115.view.querySelector(
                '.im-video-call-preview img',
            );
        imVideoCallPreviewVideoElement.srcObject = value_116 || null;
        imVideoCallPreviewVideoElement.hidden = !value_116;
        imVideoCallPreviewImgElement.hidden = true;
        imVideoCallPreviewVideoElement.classList.toggle(
            'front',
            value_115.facing === 'user' && value_115.source === 'camera',
        );
        value_115.view.querySelector('.im-video-call-preview-label').textContent = textContent_3;
        if (value_116) imVideoCallPreviewVideoElement.play()['catch'](() => {});
    }
    async function handleAction_26(value_118, ideal_2 = 'user') {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('此环境不支持摄像头');
        const cameraStream_120 = value_118.cameraStream,
            facing_121 = value_118.facing,
            value_122 = !!cameraStream_120 && ideal_2 !== facing_121;
        if (value_122) cameraStream_120.getVideoTracks().forEach((value_124) => value_124.stop());
        let value_123;
        try {
            try {
                value_123 = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: {
                            ideal: ideal_2,
                        },
                        width: {
                            ideal: 1280,
                        },
                        height: {
                            ideal: 720,
                        },
                    },
                    audio: true,
                });
            } catch (value_125) {
                if (value_125.name === 'NotAllowedError')
                    throw new Error('请允许摄像头和麦克风权限');
                value_123 = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: {
                            ideal: ideal_2,
                        },
                    },
                    audio: false,
                });
                handleAction_10('麦克风不可用，可继续文字与画面通话');
            }
        } catch (value_126) {
            if (value_122 && handleAction_15(value_118))
                try {
                    await handleAction_26(value_118, facing_121);
                } catch (value_127) {}
            throw value_126;
        }
        if (!handleAction_15(value_118)) {
            handleAction_17(value_123);
            return;
        }
        handleAction_27(value_118);
        handleAction_17(cameraStream_120);
        value_118.cameraStream = value_123;
        value_123.getAudioTracks().forEach((value_128) => {
            value_128.enabled = !value_118.muted;
        });
        value_118.stream = value_123;
        value_118.source = 'camera';
        value_118.facing = ideal_2;
        handleAction_25(value_118, value_123, '我的摄像头');
        handleAction_28(value_118);
        handleAction_31(value_118);
        handleAction_44(value_118);
    }
    function handleAction_27(value_129) {
        clearInterval(value_129.audioTimer);
        value_129.audioTimer = null;
        if (value_129.recorder) {
            value_129.recorder.onstop = null;
            if (value_129.recorder.state !== 'inactive')
                try {
                    value_129.recorder.stop();
                } catch (value_130) {}
        }
        value_129.recorder = null;
        value_129.audioContext?.close()['catch'](() => {});
        value_129.audioContext = null;
    }
    function handleAction_28(value_131) {
        handleAction_27(value_131);
        if (
            value_131.nativeScreen ||
            value_131.muted ||
            !window.MediaRecorder ||
            (!window.AudioContext && !window.webkitAudioContext)
        )
            return;
        const filter_132 = [
            ...(value_131.cameraStream?.getAudioTracks() || []),
            ...(value_131.screenStream?.getAudioTracks() || []),
        ].filter((value_139) => value_139.readyState === 'live');
        if (!filter_132.length) return;
        const value_133 = window.AudioContext || window.webkitAudioContext,
            audioContext_2 = new value_133(),
            mediaStreamDestination = audioContext_2.createMediaStreamDestination(),
            analyser = audioContext_2.createAnalyser();
        analyser.fftSize = 1024;
        filter_132.forEach((value_140) =>
            audioContext_2.createMediaStreamSource(new MediaStream([value_140])).connect(analyser),
        );
        analyser.connect(mediaStreamDestination);
        audioContext_2.resume()['catch'](() => {});
        const value_135 = new Uint8Array(analyser.fftSize);
        value_131.audioContext = audioContext_2;
        let count = 0,
            count_136 = 0,
            recorder_2 = null;
        const value_138 = () => {
            try {
                const mimeType_2 = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find(
                    (value_142) => MediaRecorder.isTypeSupported(value_142),
                );
                recorder_2 = new MediaRecorder(
                    mediaStreamDestination.stream,
                    mimeType_2
                        ? {
                              mimeType: mimeType_2,
                          }
                        : undefined,
                );
                const items_141 = [];
                recorder_2.ondataavailable = (value_143) => {
                    if (value_143.data?.size) items_141.push(value_143.data);
                };
                recorder_2.onstop = () => {
                    if (!handleAction_15(value_131) || !items_141.length || value_131.speaking)
                        return;
                    handleAction_29(
                        value_131,
                        new Blob(items_141, {
                            type: recorder_2.mimeType || 'audio/webm',
                        }),
                    );
                };
                recorder_2.start();
                value_131.recorder = recorder_2;
                count_136 = Date.now();
            } catch (value_144) {
                handleAction_10('录音不可用，请改用文字输入');
            }
        };
        value_131.audioTimer = setInterval(() => {
            if (!handleAction_15(value_131) || value_131.speaking || value_131.muted) return;
            analyser.getByteTimeDomainData(value_135);
            let count_145 = 0;
            for (let count_147 = 0; count_147 < value_135.length; count_147++) {
                const value_148 = (value_135[count_147] - 128) / 128;
                count_145 += value_148 * value_148;
            }
            const value_146 = Math.sqrt(count_145 / value_135.length) > 0.023;
            if (value_146) count = Date.now();
            if (value_146 && (!recorder_2 || recorder_2.state === 'inactive')) value_138();
            if (
                recorder_2?.state === 'recording' &&
                (Date.now() - count > 850 || Date.now() - count_136 > 12000)
            )
                recorder_2.stop();
        }, 140);
    }
    async function handleAction_29(value_149, value_150) {
        const handleAction_7_151 = getVideoCallAsrConfig_2();
        if (!handleAction_7_151.endpoint) {
            handleAction_13(value_149, '请在齿轮中配置语音识别');
            return;
        }
        try {
            const body_2 = new FormData(),
                value_153 = /mp4/.test(value_150.type) ? 'm4a' : 'webm';
            body_2.append(
                'file',
                new File([value_150], 'turn.' + value_153, {
                    type: value_150.type,
                }),
            );
            body_2.append('model', handleAction_7_151.model);
            const value_154 = await handleAction_18(
                value_149,
                handleAction_7_151.endpoint,
                {
                    method: 'POST',
                    headers: handleAction_7_151.apiKey
                        ? {
                              Authorization: 'Bearer ' + handleAction_7_151.apiKey,
                          }
                        : {},
                    body: body_2,
                },
                30000,
                '语音识别',
            );
            if (!value_154.ok) throw new Error('语音识别失败 (' + value_154.status + ')');
            const value_155 = await value_154.json(),
                trim_156 = String(value_155.text || '').trim();
            if (!handleAction_15(value_149) || !trim_156) return;
            handleAction_20(value_149, {
                isSelf: true,
                text: trim_156,
            });
            await handleAction_35(value_149, {
                transcript: trim_156,
            });
        } catch (value_157) {
            if (handleAction_15(value_149) && value_157.name !== 'AbortError')
                handleAction_14(value_149, value_157.message || '语音识别失败');
        }
    }
    function handleAction_30(value_158) {
        const imVideoCallPreviewVideoElement_159 = value_158.view.querySelector(
            '.im-video-call-preview video',
        );
        if (
            !imVideoCallPreviewVideoElement_159.videoWidth ||
            !imVideoCallPreviewVideoElement_159.videoHeight ||
            imVideoCallPreviewVideoElement_159.hidden
        )
            return '';
        const element_160 = document.createElement('canvas'),
            min_161 = Math.min(
                1,
                720 /
                    Math.max(
                        imVideoCallPreviewVideoElement_159.videoWidth,
                        imVideoCallPreviewVideoElement_159.videoHeight,
                    ),
            );
        return (
            (element_160.width = Math.max(
                1,
                Math.round(imVideoCallPreviewVideoElement_159.videoWidth * min_161),
            )),
            (element_160.height = Math.max(
                1,
                Math.round(imVideoCallPreviewVideoElement_159.videoHeight * min_161),
            )),
            element_160
                .getContext('2d')
                .drawImage(
                    imVideoCallPreviewVideoElement_159,
                    0,
                    0,
                    element_160.width,
                    element_160.height,
                ),
            element_160.toDataURL('image/jpeg', 0.67)
        );
    }
    function handleAction_31(value_162) {
        clearInterval(value_162.visualTimer);
        if (value_162.nativeScreen) return;
        let value_163 = null;
        value_162.visualTimer = setInterval(() => {
            if (
                !handleAction_15(value_162) ||
                !value_162.connected ||
                value_162.busy ||
                value_162.speaking
            )
                return;
            const imVideoCallPreviewVideoElement_164 = value_162.view.querySelector(
                '.im-video-call-preview video',
            );
            if (
                imVideoCallPreviewVideoElement_164.hidden ||
                imVideoCallPreviewVideoElement_164.readyState < 2
            )
                return;
            const element_165 = document.createElement('canvas');
            element_165.width = 40;
            element_165.height = 24;
            const context = element_165.getContext('2d', {
                willReadFrequently: true,
            });
            context.drawImage(imVideoCallPreviewVideoElement_164, 0, 0, 40, 24);
            const data_166 = context.getImageData(0, 0, 40, 24).data;
            let count_167 = 0;
            if (value_163)
                for (let count_172 = 0; count_172 < data_166.length; count_172 += 16) {
                    count_167 += Math.abs(data_166[count_172] - value_163[count_172]);
                    count_167 += Math.abs(data_166[count_172 + 1] - value_163[count_172 + 1]);
                    count_167 += Math.abs(data_166[count_172 + 2] - value_163[count_172 + 2]);
                }
            value_163 = new Uint8Array(data_166);
            const lastVisualTurn_2 = Date.now(),
                value_169 = count_167 / ((data_166.length / 16) * 3),
                value_170 = value_162.observeSeconds * 1000,
                value_171 =
                    !value_162.initialVisualTurn ||
                    (value_169 > 9 &&
                        lastVisualTurn_2 - value_162.lastVisualTurn >= Math.min(8000, value_170)) ||
                    lastVisualTurn_2 - value_162.lastVisualTurn >= value_170;
            value_171 &&
                ((value_162.initialVisualTurn = true),
                (value_162.lastVisualTurn = lastVisualTurn_2),
                handleAction_35(value_162, {
                    transcript: '',
                }));
        }, 2500);
    }
    async function handleAction_32(value_173, url_2) {
        if (!url_2) return '';
        if (window.u2ImageUnderstanding?.isConfigured?.())
            return String(
                (await handleAction_19(
                    window.u2ImageUnderstanding.analyze(url_2, {
                        prompt: text_2,
                        raw: true,
                    }),
                    45000,
                    '画面识别',
                )) || '',
            )
                .trim()
                .slice(0, 450);
        const value_175 = window.apiConfig || {};
        if (!value_175.endpoint || !value_175.apiKey || !value_175.model)
            throw new Error('请先配置识图模型');
        const chatCompletionsEndpoint = window.u2Api.resolveChatCompletionsEndpoint(
                value_175.endpoint,
            ),
            value_176 = await handleAction_18(
                value_173,
                chatCompletionsEndpoint,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + value_175.apiKey,
                    },
                    body: JSON.stringify({
                        model: value_175.model,
                        messages: [
                            {
                                role: 'user',
                                content: [
                                    {
                                        type: 'text',
                                        text: text_2,
                                    },
                                    {
                                        type: 'image_url',
                                        image_url: {
                                            url: url_2,
                                        },
                                    },
                                ],
                            },
                        ],
                    }),
                },
                45000,
                '画面识别',
            );
        if (!value_176.ok) throw new Error('识图失败 (' + value_176.status + ')');
        return String((await value_176.json())?.choices?.[0]?.message?.content || '')
            .trim()
            .slice(0, 450);
    }
    function handleAction_33(value_177) {
        const replace_178 = String(value_177 || '')
            .trim()
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/, '');
        return JSON.parse(replace_178);
    }
    function handleAction_34(value_179, value_180) {
        const value_3_181 = value_3(value_180);
        let value_182 = Array.isArray(value_179.segments)
            ? value_179.segments
                  .map((value_183) => ({
                      text: String(value_183?.text || '').trim(),
                      translation: value_3_181 ? '' : String(value_183?.translation || '').trim(),
                  }))
                  .filter((value_184) => value_184.text)
                  .slice(0, 4)
            : [];
        !value_182.length &&
            String(value_179.text || '').trim() &&
            (value_182 = [
                {
                    text: String(value_179.text).trim(),
                    translation: value_3_181 ? '' : String(value_179.translation || '').trim(),
                },
            ]);
        if (!value_3_181 && value_182.some((value_185) => !value_185.translation))
            throw new Error('非中文回复缺少翻译');
        return value_182;
    }
    async function handleAction_35(value_186, value_187, value_188 = false) {
        if (!handleAction_15(value_186) || !value_186.connected || value_186.nativeScreen) return;
        if (value_186.busy) {
            if (!value_188 && String(value_187.transcript || '').trim()) {
                value_186.pendingTurns.push({
                    transcript: String(value_187.transcript).trim(),
                });
                if (value_186.pendingTurns.length > 4) value_186.pendingTurns.shift();
            }
            return;
        }
        value_186.busy = true;
        const frame_2 = value_188
                ? value_187.frame
                : value_186.source === 'screen' || value_186.cameraOn
                  ? handleAction_30(value_186)
                  : '',
            transcript_2 = String(value_187.transcript || '').trim();
        let visualSummary_2 = value_188 ? value_187.visualSummary : '';
        try {
            handleAction_13(value_186, 'Char 正在观察…');
            if (!value_188 && frame_2)
                try {
                    visualSummary_2 = await handleAction_32(value_186, frame_2);
                } catch (value_207) {
                    handleAction_14(value_186, value_207.message || '画面识别不可用');
                }
            if (!transcript_2 && !visualSummary_2) return;
            const value_192 = window.apiConfig || {};
            if (!value_192.endpoint || !value_192.apiKey || !value_192.model)
                throw new Error('请先配置聊天 API');
            const value_193 = window.userState?.name || 'User',
                string_194 = String(value_186.friend.language || 'zh'),
                value_195 = options[string_194.toLowerCase()] || string_194,
                join_196 = value_186.messages
                    .slice(-18)
                    .map(
                        (value_208) =>
                            (value_208.isSelf ? value_193 : value_186.friend.nickname) +
                            ': ' +
                            value_208.text +
                            (value_208.visualSummary
                                ? ' [看到：' + value_208.visualSummary + ']'
                                : ''),
                    ).join(`
`),
                value_197 =
                    window.imApp
                        ?.getRecentContextMessages?.(value_186.friend)
                        ?.slice(-12)
                        .map(
                            (message_209) =>
                                (message_209.role === 'user'
                                    ? value_193
                                    : value_186.friend.nickname) +
                                ': ' +
                                (message_209.text || message_209.content || ''),
                        ).join(`
`) || '',
                content_2 =
                    '你正在以 ' +
                    (value_186.friend.realName || value_186.friend.nickname || 'Char') +
                    ' 的身份和 ' +
                    value_193 +
                    ' 进行单人视频通话。人物设定：' +
                    (value_186.friend.persona || '自然交流') +
                    '。与 User 的关系：' +
                    (value_186.friend.relationship || '未指定') +
                    `。
最近聊天：` +
                    value_197 +
                    `
本次通话：` +
                    join_196 +
                    `
只能根据明确提供的实时画面观察和已识别的声音反应，不要声称能看见未共享的手机内容。画面变化不值得说话时 shouldSpeak=false，避免连续解说。若开口，像真实通话那样自然回应，通常连续说 2 到 4 句简短口语；每句放进 segments 的独立条目，不要写长篇解说或重复画面。每条 text 必须使用角色默认语言 ` +
                    value_195 +
                    '。' +
                    (value_3(string_194)
                        ? '每条 translation 必须为空字符串。'
                        : '每条 translation 必须是对应 text 的准确、自然的简体中文翻译。') +
                    'action 和 thought 为简短中文，可留空。只输出 JSON：{"shouldSpeak":true,"action":"","thought":"","segments":[{"text":"","translation":""},{"text":"","translation":""}]}。',
                content_3 =
                    '本轮 User 说：' +
                    (transcript_2 || '未说话') +
                    `
本轮可见画面：` +
                    (visualSummary_2 || '不可见或识别失败') +
                    (value_188
                        ? `
重回上一轮：重新回应相同依据，不要重复上一句。`
                        : ''),
                chatCompletionsEndpoint_200 = window.u2Api.resolveChatCompletionsEndpoint(
                    value_192.endpoint,
                ),
                value_201 = await handleAction_18(
                    value_186,
                    chatCompletionsEndpoint_200,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + value_192.apiKey,
                        },
                        body: JSON.stringify({
                            model: value_192.model,
                            temperature: Number(value_192.temperature) || 0.7,
                            messages: [
                                {
                                    role: 'system',
                                    content: content_2,
                                },
                                {
                                    role: 'user',
                                    content: content_3,
                                },
                            ],
                        }),
                    },
                    45000,
                    '通话回复',
                );
            if (!value_201.ok) throw new Error('通话回复失败 (' + value_201.status + ')');
            const handleAction_33_202 = handleAction_33(
                (await value_201.json())?.choices?.[0]?.message?.content,
            );
            if (!handleAction_15(value_186) || handleAction_33_202.shouldSpeak === false) return;
            const handleAction_34_203 = handleAction_34(handleAction_33_202, string_194);
            if (!handleAction_34_203.length) return;
            const text_3 = handleAction_34_203
                    .map((value_210) => value_210.text)
                    .join(/^(zh|ja|ko)/i.test(string_194) ? '' : ' '),
                translationText_2 = value_3(string_194)
                    ? ''
                    : handleAction_34_203.map((value_211) => value_211.translation).join('');
            if (value_188) handleAction_23(value_186, value_186.lastAiTurn?.message);
            const message_2 = handleAction_20(value_186, {
                text: text_3,
                translationText: translationText_2,
                actionText: handleAction_33_202.action,
                thoughtText: handleAction_33_202.thought,
                visualSummary: visualSummary_2,
                isSelf: false,
                deferCaption: true,
            });
            value_186.lastAiTurn = {
                message: message_2,
                evidence: {
                    transcript: transcript_2,
                    visualSummary: visualSummary_2,
                    frame: frame_2,
                },
            };
            await handleAction_37(value_186, handleAction_34_203, message_2);
        } catch (value_212) {
            if (handleAction_15(value_186) && value_212.name !== 'AbortError')
                handleAction_14(value_186, value_212.message || '通话回复失败');
        } finally {
            value_186.busy = false;
            if (handleAction_15(value_186)) {
                if (Date.now() >= (value_186.statusUntil || 0))
                    handleAction_13(value_186, handleAction_16(value_186.seconds));
                const shift_213 = value_186.pendingTurns.shift();
                if (shift_213) Promise.resolve().then(() => handleAction_35(value_186, shift_213));
            }
        }
    }
    function handleAction_36(value_214, value_215, items_216, value_217, value_218) {
        return new Promise((value_219) => {
            const map_220 = items_216.map((value_228) => Math.max(1, value_228.text.length)),
                reduce_221 = map_220.reduce((value_229, value_230) => value_229 + value_230, 0);
            let count_222 = 1,
                value_223 = map_220[0],
                enabled_224 = false;
            handleAction_21(value_214, value_215, items_216[0], true);
            const value_225 = () => {
                    if (enabled_224) return;
                    enabled_224 = true;
                    clearInterval(setInterval_227);
                    value_217.removeEventListener('ended', value_225);
                    value_217.removeEventListener('error', value_225);
                    value_217.removeEventListener('pause', value_225);
                    if (value_218() && value_217.ended) {
                        while (count_222 < items_216.length)
                            handleAction_21(value_214, value_215, items_216[count_222++], false);
                    }
                    value_219();
                },
                value_226 = () => {
                    if (!value_218() || value_217.ended || value_217.paused) {
                        value_225();
                        return;
                    }
                    const value_231 =
                        Number.isFinite(value_217.duration) && value_217.duration > 0
                            ? value_217.duration
                            : Math.max(2, reduce_221 * 0.16);
                    while (
                        count_222 < items_216.length &&
                        value_217.currentTime >= (value_231 * value_223) / reduce_221
                    ) {
                        handleAction_21(value_214, value_215, items_216[count_222], false);
                        value_223 += map_220[count_222++];
                    }
                };
            value_217.addEventListener('ended', value_225, {
                once: true,
            });
            value_217.addEventListener('error', value_225, {
                once: true,
            });
            value_217.addEventListener('pause', value_225, {
                once: true,
            });
            const setInterval_227 = setInterval(value_226, 80);
            value_226();
        });
    }
    async function handleAction_37(value_232, items_233, value_234) {
        if (!handleAction_15(value_232)) return;
        const value_235 = ++value_232.speechId,
            value_236 = () => handleAction_15(value_232) && value_235 === value_232.speechId;
        value_232.speaking = true;
        if (value_232.recorder?.state === 'recording') {
            value_232.recorder.onstop = null;
            try {
                value_232.recorder.stop();
            } catch (value_243) {}
        }
        value_232.view.classList.add('speaking');
        const value_237 = (value_244) =>
                new Promise((value_245) => {
                    if (!window.speechSynthesis || !value_236()) return value_245();
                    try {
                        const value_246 = new SpeechSynthesisUtterance(value_244);
                        value_246.lang = value_232.friend.language || 'zh-CN';
                        value_246.onend = value_245;
                        value_246.onerror = value_245;
                        window.speechSynthesis.speak(value_246);
                    } catch (value_247) {
                        value_245();
                    }
                }),
            value_238 = (async () => {
                if (window.u2Tts?.prepareSpeech && window.u2Tts?.playAudioUrl)
                    try {
                        handleAction_13(value_232, 'Char 正在准备语音…');
                        const join_248 = items_233
                                .map((value_251) => value_251.text)
                                .join(
                                    /^(zh|ja|ko)/i.test(value_232.friend.language || 'zh')
                                        ? ''
                                        : ' ',
                                ),
                            value_249 = await window.u2Tts.prepareSpeech(
                                join_248,
                                value_232.friend,
                                {
                                    ignoreFriendToggle: true,
                                },
                            );
                        if (!value_236()) return;
                        const value_250 = await window.u2Tts.playAudioUrl(value_249);
                        if (!value_236()) {
                            window.u2Tts.stopPlayback?.();
                            return;
                        }
                        await handleAction_36(
                            value_232,
                            value_234,
                            items_233,
                            value_250,
                            value_236,
                        );
                        return;
                    } catch (value_252) {
                        if (!value_236()) return;
                        handleAction_13(
                            value_232,
                            window.speechSynthesis
                                ? 'Char 音色不可用，正在使用系统语音'
                                : '语音播放失败，已显示字幕',
                        );
                    }
                else {
                    if (window.speechSynthesis) handleAction_13(value_232, '正在使用系统语音');
                }
                for (let count_253 = 0; count_253 < items_233.length && value_236(); count_253++) {
                    const value_254 = items_233[count_253];
                    handleAction_21(value_232, value_234, value_254, count_253 === 0);
                    if (window.speechSynthesis) {
                        const now_255 = Date.now();
                        await value_237(value_254.text);
                        const min_256 = Math.min(1800, Math.max(700, value_254.text.length * 45)),
                            value_257 = min_256 - (Date.now() - now_255);
                        if (value_257 > 0)
                            await new Promise((value_258) => setTimeout(value_258, value_257));
                    } else {
                        handleAction_13(value_232, '语音播放不可用，已显示字幕');
                        await new Promise((value_259) =>
                            setTimeout(
                                value_259,
                                Math.min(1800, Math.max(700, value_254.text.length * 45)),
                            ),
                        );
                    }
                }
            })();
        let value_239;
        const value_240 = new Promise((value_260) => {
            value_239 = setTimeout(
                () => {
                    value_236() &&
                        (value_232.speechId++,
                        window.u2Tts?.stopPlayback?.(),
                        window.speechSynthesis?.cancel?.(),
                        handleAction_14(value_232, '朗读超时，已恢复聆听'));
                    value_260();
                },
                Math.min(
                    90000,
                    Math.max(
                        35000,
                        items_233.reduce(
                            (value_261, value_262) => value_261 + value_262.text.length,
                            0,
                        ) * 450,
                    ),
                ),
            );
        });
        let value_241;
        const value_242 = new Promise((speechCancel_2) => {
            value_241 = speechCancel_2;
            value_232.speechCancel = speechCancel_2;
        });
        try {
            await Promise.race([value_238, value_240, value_242]);
        } finally {
            clearTimeout(value_239);
            if (value_232.speechCancel === value_241) value_232.speechCancel = null;
            value_232.speaking = false;
            value_232.view.classList.remove('speaking');
            if (handleAction_15(value_232)) value_232.audioContext?.resume()['catch'](() => {});
        }
    }
    function handleAction_38() {
        if (
            !window.Capacitor?.isNativePlatform?.() ||
            window.Capacitor.getPlatform?.() !== 'android'
        )
            return null;
        if (!value_5) value_5 = window.Capacitor.registerPlugin('U2VideoCall');
        return value_5;
    }
    async function handleAction_39(value_264) {
        const handleAction_38_265 = handleAction_38();
        if (!handleAction_38_265) return false;
        const asr_2 = getVideoCallAsrConfig_2();
        if (!asr_2.endpoint) throw new Error('请先在齿轮中配置语音识别');
        const value_267 = window.apiConfig || {};
        if (!value_267.endpoint || !value_267.apiKey || !value_267.model)
            throw new Error('请先配置聊天 API');
        const vision_2 = window.u2ImageUnderstanding?.isConfigured?.()
            ? window.u2ImageUnderstanding.getActiveConfig()
            : {
                  provider: 'openai-compatible',
                  endpoint: value_267.endpoint,
                  apiKey: value_267.apiKey,
                  model: value_267.model,
              };
        value_264.nativeListener = await handleAction_38_265.addListener(
            'videoCallEvent',
            (value_269) => handleAction_40(value_264, value_269),
        );
        try {
            await handleAction_38_265.startScreen({
                sessionId: value_264.id,
                friendName: value_264.friend.realName || value_264.friend.nickname || 'Char',
                persona: value_264.friend.persona || '',
                relationship: value_264.friend.relationship || '',
                language: value_264.friend.language || 'zh',
                userName: window.userState?.name || 'User',
                api: {
                    endpoint: window.u2Api.resolveChatCompletionsEndpoint(value_267.endpoint),
                    apiKey: value_267.apiKey,
                    model: value_267.model,
                },
                vision: vision_2,
                asr: asr_2,
                history: value_264.messages.slice(-12).map((value_270) => ({
                    text: value_270.text,
                    isSelf: value_270.isSelf,
                })),
                tts: (() => {
                    try {
                        const value_271 = window.u2Tts?.getActiveConfig?.() || {},
                            value_272 =
                                window.u2Tts?.resolveFriendTtsSettings?.(value_264.friend) || {};
                        return {
                            ...value_271,
                            voiceId: value_272.voiceId || value_271.voiceId || '',
                            speed: value_272.speed || 1,
                        };
                    } catch (value_273) {
                        return {};
                    }
                })(),
                observeSeconds: value_264.observeSeconds,
                muted: value_264.muted,
            });
        } catch (value_274) {
            value_264.nativeListener.remove();
            value_264.nativeListener = null;
            throw value_274;
        }
        return (
            (value_264.nativeScreen = true),
            (value_264.source = 'screen'),
            handleAction_27(value_264),
            clearInterval(value_264.visualTimer),
            handleAction_17(value_264.cameraStream),
            (value_264.cameraStream = null),
            (value_264.view.querySelector('.im-video-call-preview video').hidden = true),
            (value_264.view.querySelector('.im-video-call-preview-label').textContent =
                '正在共享手机屏幕'),
            handleAction_44(value_264),
            true
        );
    }
    function handleAction_40(value_275, value_276) {
        if (
            !handleAction_15(value_275) ||
            !value_276 ||
            String(value_276.sessionId || '') !== value_275.id
        )
            return;
        if (value_276.id && value_275.seenNative.has(value_276.id)) return;
        if (value_276.id) value_275.seenNative.add(value_276.id);
        if (value_276.type === 'user') {
            const handleAction_20_277 = handleAction_20(value_275, {
                isSelf: true,
                text: value_276.text,
            });
            if (handleAction_20_277) handleAction_20_277.nativeId = value_276.id;
        }
        if (value_276.type === 'turn') {
            if (value_276.reroll) handleAction_23(value_275, value_275.lastAiTurn?.message);
            const message_3 = handleAction_20(value_275, {
                text: value_276.text,
                translationText: value_276.translation,
                actionText: value_276.action,
                thoughtText: value_276.thought,
                visualSummary: value_276.visualSummary,
                isSelf: false,
                deferCaption: true,
            });
            if (message_3) message_3.nativeId = value_276.id;
            value_275.lastAiTurn = {
                message: message_3,
                native: true,
            };
        }
        if (value_276.type === 'caption') {
            const result_279 = value_275.messages.find(
                (value_280) => value_280.nativeId === value_276.turnId,
            );
            if (result_279)
                handleAction_21(
                    value_275,
                    result_279,
                    {
                        text: value_276.text,
                        translation: value_276.translation,
                    },
                    value_276.index === 0,
                );
        }
        if (value_276.type === 'status') handleAction_13(value_275, value_276.message);
        if (value_276.type === 'error') handleAction_13(value_275, value_276.message || '共享异常');
        if (value_276.type === 'stopped') handleAction_42(value_275, true);
        if (value_276.type === 'preview' && value_276.image) {
            const imVideoCallPreviewImgElement_281 = value_275.view.querySelector(
                '.im-video-call-preview img',
            );
            imVideoCallPreviewImgElement_281.src = value_276.image;
            imVideoCallPreviewImgElement_281.hidden = false;
        }
    }
    async function handleAction_41(value_282, value_283 = false) {
        if (!value_282.nativeScreen) return;
        try {
            const value_284 = await handleAction_38()?.drainEvents({
                sessionId: value_282.id,
            });
            (value_284?.events || []).forEach((value_285) => {
                if (!value_283 || value_285.type !== 'stopped')
                    handleAction_40(value_282, value_285);
            });
        } catch (value_286) {}
    }
    async function handleAction_42(value_287, value_288 = false) {
        if (!value_287.nativeScreen || value_287.stoppingNativeScreen) return;
        value_287.stoppingNativeScreen = true;
        await handleAction_41(value_287, true);
        value_287.nativeScreen = false;
        if (!value_288)
            try {
                await handleAction_38()?.stopScreen({
                    sessionId: value_287.id,
                });
            } catch (value_289) {}
        value_287.nativeListener?.remove();
        value_287.nativeListener = null;
        handleAction_15(value_287) &&
            (handleAction_13(value_287, '共享已停止'),
            await handleAction_26(value_287, value_287.facing)['catch']((value_290) =>
                handleAction_13(value_287, value_290.message),
            ));
        value_287.stoppingNativeScreen = false;
    }
    async function handleAction_43(value_291) {
        if (value_291.nativeScreen) {
            await handleAction_42(value_291);
            return;
        }
        if (value_291.source === 'screen') {
            handleAction_17(value_291.screenStream);
            value_291.screenStream = null;
            await handleAction_26(value_291, value_291.facing);
            return;
        }
        if (await handleAction_39(value_291)) return;
        if (!navigator.mediaDevices?.getDisplayMedia) {
            handleAction_10('当前浏览器不支持屏幕共享');
            return;
        }
        const screenStream_2 = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
        });
        if (!handleAction_15(value_291)) {
            handleAction_17(screenStream_2);
            return;
        }
        handleAction_17(
            value_291.cameraStream?.getVideoTracks
                ? new MediaStream(value_291.cameraStream.getVideoTracks())
                : null,
        );
        value_291.screenStream = screenStream_2;
        value_291.source = 'screen';
        handleAction_25(
            value_291,
            screenStream_2,
            screenStream_2.getAudioTracks().length ? '共享屏幕与声音' : '共享屏幕（仅麦克风）',
        );
        screenStream_2.getVideoTracks()[0]?.addEventListener(
            'ended',
            () => {
                if (handleAction_15(value_291) && value_291.source === 'screen')
                    handleAction_43(value_291)['catch'](() => {});
            },
            {
                once: true,
            },
        );
        handleAction_28(value_291);
        handleAction_31(value_291);
        handleAction_44(value_291);
    }
    function handleAction_44(value_293) {
        const view_294 = value_293.view;
        view_294.querySelector('[data-action="mute"]').classList.toggle('active', value_293.muted);
        view_294
            .querySelector('[data-action="camera"]')
            .classList.toggle('active', !value_293.cameraOn);
        view_294
            .querySelector('[data-action="share"]')
            .classList.toggle('active', value_293.source === 'screen');
        view_294.querySelector('[data-action="flip"]').disabled =
            value_293.source !== 'camera' || !value_293.cameraOn;
        view_294.querySelector('[data-action="camera"]').disabled = value_293.source !== 'camera';
        view_294.querySelector('[data-action="share"]').disabled =
            !handleAction_38() && !navigator.mediaDevices?.getDisplayMedia;
    }
    async function handleAction_45(value_295) {
        const options_296 = {
            id: 'video-' + Date.now(),
            type: 'voice_call_record',
            isVideo: true,
            role: value_295.incoming ? 'assistant' : 'user',
            content: '[视频通话记录]',
            senderId: value_295.incoming
                ? value_295.friend.id
                : window.imData?.currentUser?.id || 'me',
            timestamp: Date.now(),
            duration: value_295.connected ? value_295.seconds : 0,
            callMessages: value_295.messages.map(
                ({
                    text: text_4,
                    translationText: translationText_3,
                    actionText: actionText_2,
                    thoughtText: thoughtText_2,
                    visualSummary: visualSummary_3,
                    isSelf: isSelf_2,
                    timestamp: timestamp_2,
                    callTurnId: callTurnId_2,
                }) => ({
                    text: text_4,
                    translationText: translationText_3,
                    actionText: actionText_2,
                    thoughtText: thoughtText_2,
                    visualSummary: visualSummary_3,
                    isSelf: isSelf_2,
                    timestamp: timestamp_2,
                    callTurnId: callTurnId_2,
                }),
            ),
            isSelf: !value_295.incoming,
            statusText: value_295.connected ? '通话记录' : value_295.incoming ? '已拒绝' : '已取消',
        };
        if (!window.imApp?.appendFriendMessage) return;
        await window.imApp.appendFriendMessage(value_295.friend.id, options_296);
        const elementById = document.getElementById('chat-interface-' + value_295.friend.id),
            insChatMessagesElement = elementById?.querySelector('.ins-chat-messages');
        if (insChatMessagesElement && window.imChat.appendMessageToContainer)
            window.imChat.appendMessageToContainer(
                value_295.friend,
                insChatMessagesElement,
                options_296,
            );
    }
    async function handleAction_46(value_305) {
        if (!handleAction_15(value_305)) return;
        if (value_305.nativeScreen) await handleAction_41(value_305);
        value_305.ended = true;
        value_305.speechId++;
        value_305.speechCancel?.();
        clearInterval(value_305.clockTimer);
        clearInterval(value_305.visualTimer);
        clearTimeout(value_305.dialTimer);
        value_305.controller.abort();
        handleAction_27(value_305);
        handleAction_17(value_305.cameraStream);
        handleAction_17(value_305.screenStream);
        if (value_305.nativeScreen)
            try {
                await handleAction_38()?.stopScreen({
                    sessionId: value_305.id,
                });
            } catch (value_306) {}
        value_305.nativeListener?.remove();
        window.u2Tts?.stopPlayback?.();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        value_305.inputCleanup?.();
        value_305.captionCleanup?.();
        value_305.view.classList.remove('active', 'minimized', 'speaking');
        value_305.view.style.display = 'none';
        if (window.closeView) window.closeView(value_305.view);
        value_4 = null;
        try {
            await handleAction_45(value_305);
        } catch (value_307) {
            handleAction_10('视频通话记录保存失败');
            console.error(value_307);
        }
    }
    async function handleAction_47(value_308) {
        if (!handleAction_15(value_308) || value_308.connected) return;
        try {
            await handleAction_26(value_308);
            if (!handleAction_15(value_308)) return;
            value_308.connected = true;
            value_308.view.querySelector('.im-video-call-input-row').hidden = false;
            value_308.clockTimer = setInterval(() => {
                if (!handleAction_15(value_308)) return;
                value_308.seconds++;
                const textContent_4 = handleAction_16(value_308.seconds);
                if (
                    !value_308.busy &&
                    !value_308.nativeScreen &&
                    Date.now() >= (value_308.statusUntil || 0)
                )
                    handleAction_13(value_308, textContent_4);
                value_308.view.querySelector('.im-video-call-float-time').textContent =
                    textContent_4;
            }, 1000);
            handleAction_13(value_308, '00:00');
        } catch (value_310) {
            handleAction_13(value_308, value_310.message || '无法开启摄像头');
            handleAction_10(value_310.message || '无法开启摄像头');
        }
    }
    function handleAction_48(value_311) {
        const imVideoCallConfigElement = value_311.view.querySelector('.im-video-call-config'),
            formElement = imVideoCallConfigElement.querySelector('form'),
            handleAction_7_312 = getVideoCallAsrConfig_2();
        formElement.elements.endpoint.value = handleAction_7_312.endpoint;
        formElement.elements.apiKey.value = handleAction_7_312.apiKey;
        formElement.elements.model.value = handleAction_7_312.model;
        formElement.elements.observeSeconds.value = String(value_311.observeSeconds);
        imVideoCallConfigElement.classList.add('open');
    }
    function handleAction_49(value_313, value_314) {
        // Web pages inherit the shared app frame; applying its offset again exposes Home.
        // The native host keeps its existing viewport handling.
        if (!window.mobileInputCompat?.isAndroid) return () => {};
        const view_315 = value_313.view,
            visualViewport_316 = window.visualViewport,
            options_317 = {
                height: view_315.style.height,
                top: view_315.style.top,
                bottom: view_315.style.bottom,
            };
        let round_318 = Math.round(window.innerHeight || visualViewport_316?.height || 0),
            max_319 = Math.max(round_318, Math.round(visualViewport_316?.height || 0)),
            round_320 = Math.round((window.scrollY || 0) + (visualViewport_316?.offsetTop || 0)),
            round_321 = Math.round(visualViewport_316?.width || window.innerWidth || 0),
            enabled_322 = false,
            count_323 = 0;
        const items_324 = [],
            value_325 = () => {
                view_315.style.height = options_317.height;
                view_315.style.top = options_317.top;
                view_315.style.bottom = options_317.bottom;
                view_315.classList.remove('im-video-call-keyboard-open');
            },
            value_326 = () => {
                if (!handleAction_15(value_313)) return;
                const round_329 = Math.round(window.innerHeight || 0),
                    round_330 = Math.round(visualViewport_316?.height || round_329),
                    round_331 = Math.round(visualViewport_316?.width || window.innerWidth || 0),
                    round_332 = Math.round(
                        (window.scrollY || 0) + (visualViewport_316?.offsetTop || 0),
                    );
                if (round_330 <= 0) return;
                if (Math.abs(round_331 - round_321) > 48) {
                    round_321 = round_331;
                    round_318 = round_329;
                    max_319 = Math.max(round_329, round_330);
                    round_320 = round_332;
                    enabled_322 = false;
                    value_325();
                    return;
                }
                const value_333 = round_318 - round_329 > 100,
                    value_334 = value_333 ? round_329 : round_330,
                    value_335 = document.activeElement === value_314,
                    value_336 =
                        value_335 &&
                        (max_319 - value_334 > 100 || Math.abs(round_332 - round_320) > 72);
                if (value_336) {
                    enabled_322 = true;
                    view_315.style.height = value_334 + 'px';
                    view_315.style.top = Math.max(0, round_332) + 'px';
                    view_315.style.bottom = 'auto';
                    view_315.classList.add('im-video-call-keyboard-open');
                    handleAction_22(value_313);
                    return;
                }
                if (enabled_322 && !value_335 && max_319 - value_334 > 72) return;
                enabled_322 = false;
                value_325();
                !value_335 &&
                    ((round_318 = Math.max(round_318, round_329)),
                    (max_319 = Math.max(max_319, value_334)),
                    (round_320 = round_332));
            },
            value_327 = () => {
                if (count_323) cancelAnimationFrame(count_323);
                count_323 = requestAnimationFrame(() => {
                    count_323 = 0;
                    value_326();
                });
            },
            handleBlur = () => {
                value_327();
                [80, 200, 450].forEach((value_337) =>
                    items_324.push(setTimeout(value_327, value_337)),
                );
            };
        return (
            value_314.addEventListener('focus', value_327),
            value_314.addEventListener('blur', handleBlur),
            visualViewport_316?.addEventListener('resize', value_327, {
                passive: true,
            }),
            visualViewport_316?.addEventListener('scroll', value_327, {
                passive: true,
            }),
            window.addEventListener('resize', value_327, {
                passive: true,
            }),
            () => {
                if (count_323) cancelAnimationFrame(count_323);
                items_324.forEach(clearTimeout);
                value_314.removeEventListener('focus', value_327);
                value_314.removeEventListener('blur', handleBlur);
                visualViewport_316?.removeEventListener('resize', value_327);
                visualViewport_316?.removeEventListener('scroll', value_327);
                window.removeEventListener('resize', value_327);
                value_325();
            }
        );
    }
    function handleAction_50(value_338) {
        const root_2 = value_338.view,
            input_2 = root_2.querySelector('.im-video-call-input'),
            dataActionSendElement = root_2.querySelector('[data-action="send"]'),
            handlePointerdown = (event) => {
                if (document.activeElement === input_2) event.preventDefault();
            };
        dataActionSendElement.addEventListener('pointerdown', handlePointerdown);
        let value_341;
        if (window.mobileInputCompat?.register)
            value_341 = window.mobileInputCompat.register({
                input: input_2,
                root: root_2,
                scrollContainer: root_2.querySelector('.im-video-call-captions'),
                enterKeyHint: 'send',
                managesOwnViewport: true,
                restoreWindowScroll: false,
                blurAfterSend: false,
                onSend: () => dataActionSendElement.click(),
            });
        else {
            const handleKeydown = (event_344) => {
                if (
                    event_344.key !== 'Enter' ||
                    event_344.isComposing ||
                    event_344.keyCode === 229 ||
                    event_344.shiftKey ||
                    event_344.ctrlKey ||
                    event_344.altKey ||
                    event_344.metaKey
                )
                    return;
                event_344.preventDefault();
                if (input_2.value.trim()) dataActionSendElement.click();
            };
            input_2.addEventListener('keydown', handleKeydown);
            value_341 = () => input_2.removeEventListener('keydown', handleKeydown);
        }
        const handleAction_49_342 = handleAction_49(value_338, input_2);
        return () => {
            value_341();
            handleAction_49_342();
            dataActionSendElement.removeEventListener('pointerdown', handlePointerdown);
        };
    }
    function handleAction_51(value_345) {
        const view_346 = value_345.view;
        view_346.onclick = async (event_347) => {
            const action_348 = event_347.target.closest('[data-action]')?.dataset.action;
            if (!action_348 || !handleAction_15(value_345)) return;
            try {
                if (action_348 === 'hangup') return handleAction_46(value_345);
                if (action_348 === 'minimize') {
                    value_345.minimized = true;
                    view_346.classList.add('minimized');
                    return;
                }
                if (action_348 === 'restore') {
                    value_345.minimized = false;
                    view_346.classList.remove('minimized');
                    return;
                }
                if (action_348 === 'config') return handleAction_48(value_345);
                if (action_348 === 'close-config') {
                    view_346.querySelector('.im-video-call-config').classList.remove('open');
                    return;
                }
                if (action_348 === 'accept') return handleAction_47(value_345);
                if (!value_345.connected) return;
                if (action_348 === 'share') return await handleAction_43(value_345);
                if (action_348 === 'flip')
                    return await handleAction_26(
                        value_345,
                        value_345.facing === 'user' ? 'environment' : 'user',
                    );
                if (action_348 === 'mute') {
                    value_345.muted = !value_345.muted;
                    value_345.cameraStream?.getAudioTracks().forEach((value_349) => {
                        value_349.enabled = !value_345.muted;
                    });
                    if (value_345.nativeScreen)
                        await handleAction_38()?.setMuted({
                            muted: value_345.muted,
                        });
                    else handleAction_28(value_345);
                    handleAction_44(value_345);
                    return;
                }
                if (action_348 === 'camera') {
                    value_345.cameraOn = !value_345.cameraOn;
                    value_345.cameraStream?.getVideoTracks().forEach((value_350) => {
                        value_350.enabled = value_345.cameraOn;
                    });
                    if (!value_345.cameraOn) clearInterval(value_345.visualTimer);
                    else handleAction_31(value_345);
                    handleAction_44(value_345);
                    return;
                }
                if (action_348 === 'reroll') {
                    if (value_345.busy) return handleAction_10('请等待当前回复完成');
                    if (value_345.nativeScreen) {
                        await handleAction_38()?.reroll({
                            sessionId: value_345.id,
                        });
                        return;
                    }
                    if (!value_345.lastAiTurn?.evidence)
                        return handleAction_10('还没有可重回的回复');
                    return handleAction_35(value_345, value_345.lastAiTurn.evidence, true);
                }
                if (action_348 === 'send') {
                    const imVideoCallInputElement_351 =
                            view_346.querySelector('.im-video-call-input'),
                        text_5 = imVideoCallInputElement_351.value.trim();
                    if (!text_5) return;
                    imVideoCallInputElement_351.value = '';
                    handleAction_20(value_345, {
                        text: text_5,
                        isSelf: true,
                    });
                    if (value_345.nativeScreen)
                        await handleAction_38()?.sendText({
                            sessionId: value_345.id,
                            text: text_5,
                        });
                    else
                        await handleAction_35(value_345, {
                            transcript: text_5,
                        });
                }
            } catch (value_353) {
                handleAction_15(value_345) &&
                    (handleAction_13(value_345, value_353.message || '操作失败'),
                    handleAction_10(value_353.message || '操作失败'));
            }
        };
        value_345.inputCleanup = handleAction_50(value_345);
        view_346.querySelector('.im-video-call-config form').onsubmit = async (event_354) => {
            event_354.preventDefault();
            try {
                const currentTarget_355 = event_354.currentTarget;
                await handleAction_9({
                    endpoint: currentTarget_355.elements.endpoint.value,
                    apiKey: currentTarget_355.elements.apiKey.value,
                    model: currentTarget_355.elements.model.value,
                    observeSeconds: currentTarget_355.elements.observeSeconds.value,
                });
                value_345.observeSeconds = handleAction_8();
                if (value_345.nativeScreen)
                    try {
                        await handleAction_38()?.setObserveSeconds({
                            sessionId: value_345.id,
                            observeSeconds: value_345.observeSeconds,
                        });
                    } catch (value_356) {
                        handleAction_10('当前原生共享会沿用旧频率，下次共享生效');
                    }
                view_346.querySelector('.im-video-call-config').classList.remove('open');
                handleAction_10('视频通话设置已保存');
            } catch (value_357) {
                handleAction_10(value_357.message);
            }
        };
    }
    window.imChat.openVideoCall = function (friend_2, incoming_2 = false) {
        if (!friend_2 || friend_2.type === 'group') return handleAction_10('视频通话仅支持单聊');
        if (value_4) return handleAction_10('已有视频通话正在进行');
        if (document.getElementById('voice-call-view')?.classList.contains('active'))
            return handleAction_10('请先结束当前语音通话');
        const view_2 = handleAction_12(),
            options_361 = {
                id: 'video-' + Date.now(),
                friend: friend_2,
                view: view_2,
                incoming: incoming_2,
                connected: false,
                ended: false,
                minimized: false,
                seconds: 0,
                sequence: 0,
                messages: [],
                pendingTurns: [],
                facing: 'user',
                source: 'camera',
                cameraOn: true,
                muted: false,
                busy: false,
                speaking: false,
                nativeScreen: false,
                seenNative: new Set(),
                controller: new AbortController(),
                observeSeconds: handleAction_8(),
                lastVisualTurn: Date.now(),
                initialVisualTurn: false,
                speechId: 0,
                followCaptions: true,
                lastCaptionInteraction: 0,
            };
        value_4 = options_361;
        view_2.classList.add('active');
        view_2.classList.remove('minimized', 'speaking');
        view_2.style.display = 'flex';
        if (window.openView) window.openView(view_2);
        const imVideoCallAvatarElement = view_2.querySelector('.im-video-call-avatar');
        imVideoCallAvatarElement.src = friend_2.avatarUrl || '';
        imVideoCallAvatarElement.hidden = !friend_2.avatarUrl;
        view_2.querySelector('.im-video-call-avatar-fallback').hidden = !!friend_2.avatarUrl;
        view_2.querySelector('.im-video-call-name').textContent =
            friend_2.nickname || friend_2.realName || 'Char';
        view_2.querySelector('.im-video-call-captions').replaceChildren();
        options_361.captionCleanup = handleAction_24(options_361);
        view_2.querySelector('.im-video-call-input').value = '';
        view_2.querySelector('.im-video-call-config').classList.remove('open');
        view_2.querySelector('.im-video-call-input-row').hidden = true;
        view_2.querySelector('.im-video-call-preview img').hidden = true;
        view_2.querySelector('.im-video-call-preview video').hidden = true;
        const dataActionAcceptElement = view_2.querySelector('[data-action="accept"]');
        if (dataActionAcceptElement) dataActionAcceptElement.remove();
        if (incoming_2) {
            handleAction_13(options_361, 'Char 邀请你视频通话…');
            const element_362 = document.createElement('button');
            element_362.type = 'button';
            element_362.dataset.action = 'accept';
            element_362.className = 'im-video-call-control';
            element_362.innerHTML =
                '<span class="im-video-call-icon" style="background:#34c759"><i class="fas fa-phone"></i></span><span>接听</span>';
            view_2.querySelector('.im-video-call-controls').prepend(element_362);
        } else {
            handleAction_13(options_361, '正在呼叫…');
            options_361.dialTimer = setTimeout(() => handleAction_47(options_361), 1300);
        }
        handleAction_51(options_361);
        handleAction_44(options_361);
    };
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && value_4?.nativeScreen) handleAction_41(value_4);
    });
    window.addEventListener('focus', () => {
        if (value_4?.nativeScreen) handleAction_41(value_4);
    });
})();
