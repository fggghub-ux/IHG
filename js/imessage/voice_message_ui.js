// Shared voice controls for private/group messages and their context-menu previews.
(() => {
    const states = new Map();
    const probes = new Map();
    const textOf = m => String(m?.transcript || m?.text || '').trim();
    const keyOf = (f, m) => encodeURIComponent(JSON.stringify([String(f.id), String(m.id || m.timestamp)]));
    const format = seconds => {
        const n = Math.max(0, Math.ceil(Number(seconds) || 0));
        return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
    };
    const stateOf = (f, m) => {
        const key = keyOf(f, m);
        let s = states.get(key);
        if (!s || s.text !== textOf(m)) {
            s?.audio?.pause();
            s = {key, text: textOf(m), duration: null, audio: null, busy: false, progress: 0};
            states.set(key, s);
        }
        return s;
    };
    function bars(message) {
        let seed = 2166136261;
        for (const ch of String(message.id || message.timestamp || '') + textOf(message))
            seed = Math.imul(seed ^ ch.charCodeAt(0), 16777619) >>> 0;
        return Array.from({length: 24}, (_, i) => {
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
            // Rounded, varied bars matching the reference; stable for each message.
            const h = 6 + ((seed >>> 16) % 17);
            return `<span style="height:${h}px;--voice-bar-start:${i / 24};--voice-bar-count:24"></span>`;
        }).join('');
    }
    function controls(f, m) {
        const s = stateOf(f, m);
        return `<div class="voice-message-bubble-main"><button type="button" class="voice-message-play" aria-label="播放语音"><i class="fas fa-play" aria-hidden="true"></i></button><button type="button" class="voice-message-bubble-inner" aria-expanded="false" aria-label="展开语音转文字"><span class="voice-message-wave" aria-hidden="true">${bars(m)}</span><span class="voice-message-duration">${format(s.duration ?? Math.min(115, Math.max(3, Math.ceil(s.text.length / 3))))}</span></button></div>`;
    }
    function paint(s) {
        for (const bubble of document.querySelectorAll(`[data-voice-key="${s.key}"]`)) {
            bubble.style.setProperty('--voice-progress', String(s.progress));
            const duration = bubble.querySelector('.voice-message-duration');
            if (duration) duration.textContent = format(s.duration ?? Math.min(115, Math.max(3, Math.ceil(s.text.length / 3))));
            const button = bubble.querySelector('.voice-message-play');
            const playing = !!s.audio && !s.audio.paused && !s.audio.ended;
            if (button) {
                button.disabled = s.busy;
                button.setAttribute('aria-label', s.busy ? '正在准备语音' : playing ? '暂停语音' : '播放语音');
                button.setAttribute('aria-pressed', String(playing));
                button.querySelector('i').className = s.busy ? 'fas fa-spinner voice-message-action-spinner' : playing ? 'fas fa-pause' : 'fas fa-play';
            }
        }
    }
    function attach(s, audio) {
        if (!audio?.addEventListener) return;
        if (s.audio === audio) { paint(s); return; }
        s.audio?.pause();
        s.audio = audio;
        let frame = null;
        const update = () => {
            if (s.audio !== audio) { if (frame !== null) cancelAnimationFrame(frame); return; }
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                s.duration = audio.duration;
                s.progress = Math.min(1, Math.max(0, audio.currentTime / audio.duration));
            }
            if (audio.ended) s.progress = 1;
            paint(s);
            if (!audio.paused && !audio.ended && frame === null)
                frame = requestAnimationFrame(() => { frame = null; update(); });
            else if ((audio.paused || audio.ended) && frame !== null) {
                cancelAnimationFrame(frame); frame = null;
            }
        };
        for (const event of ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'ended', 'error']) audio.addEventListener(event, update);
        update();
    }
    function inspectUrl(url) {
        return new Promise(resolve => {
            const audio = new Audio();
            let timer;
            const finish = () => {
                const n = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : null;
                clearTimeout(timer);
                audio.removeEventListener('loadedmetadata', finish);
                audio.removeEventListener('error', finish);
                audio.removeAttribute('src'); audio.load();
                resolve(n);
            };
            audio.addEventListener('loadedmetadata', finish);
            audio.addEventListener('error', finish);
            timer = setTimeout(finish, 8000);
            audio.preload = 'metadata'; audio.src = url;
        });
    }
    async function inspect(f, m) {
        const s = stateOf(f, m);
        const live = window.imApp?.getFriendById?.(f.id)?.messages?.find(x => String(x.id) === String(m.id)) || m;
        const asset = live.ttsAudioText === textOf(live) ? live.ttsAudioAssetId : null;
        const token = asset || live.ttsAudioUrl || live.ttsAudioCache?.url;
        if (!token) return;
        s.asset = token;
        if (!probes.has(token)) probes.set(token, (async () => {
            if (!asset) return inspectUrl(token);
            const blob = await window.appStorage?.getAssetBlob?.(asset);
            if (!blob?.size) return null;
            const url = URL.createObjectURL(blob);
            try { return await inspectUrl(url); } finally { URL.revokeObjectURL(url); }
        })().catch(() => null));
        const n = await probes.get(token);
        if (s.asset === token && n !== null) { s.duration = n; paint(s); }
    }
    async function play(f, m, {restart = false} = {}) {
        const s = stateOf(f, m);
        if (s.busy) return;
        if (!restart && s.audio && !s.audio.ended) {
            if (s.audio.paused) await window.u2Tts.resumeAudio(s.audio); else s.audio.pause();
            paint(s); return;
        }
        s.busy = true; paint(s);
        try {
            if (m.role === 'assistant' && window.imVoiceMessageAudio?.canManage?.(f, m)) {
                const result = await window.imVoiceMessageAudio.play(f, m);
                if (result?.readyForTap) {
                    await inspect(f, m);
                    window.showToast?.('语音已准备好，再点播放');
                } else attach(s, result);
            } else if (m.role === 'user') {
                const friend = window.u2Tts?.resolveMessageTtsFriend?.(f, m);
                // Retain the existing User TTS eligibility; no new User synthesis settings.
                if (!window.u2Tts?.canSpeakForFriend?.(friend)) return;
                await window.u2Tts.speakTextCached(textOf(m), friend, m, {onAudio: audio => attach(s, audio)});
            }
        } finally { s.busy = false; paint(s); }
    }
    function reportError(error, operation = '语音生成') {
        if (!window.u2Api?.isRequestError?.(error) || !window.u2Api.reportError(error, {operation}))
            window.showToast?.(window.u2Tts?.getUserErrorMessage?.(error) || error.message || '语音操作失败');
    }
    function bind(row, f, m) {
        const bubble = row.querySelector('.voice-message-bubble');
        if (!bubble) return;
        const s = stateOf(f, m);
        bubble.dataset.voiceKey = s.key;
        // Only the voice container is sized; its existing background/tail is preserved.
        for (const [name, val] of Object.entries({display:'inline-flex', 'flex-direction':'column', width:'206px', 'max-width':'206px', 'min-width':'0', height:'auto', 'min-height':'43px', 'max-height':'none', 'aspect-ratio':'auto', flex:'0 0 auto', padding:'5px 12px 6px 10px', 'box-sizing':'border-box', 'white-space':'normal'})) bubble.style.setProperty(name, val, 'important');
        bubble.querySelector('.voice-message-play')?.addEventListener('click', async event => {
            event.preventDefault(); event.stopPropagation();
            try { await play(f, m); }
            catch (error) { reportError(error); }
        });
        paint(s); requestAnimationFrame(() => paint(s)); void inspect(f, m);
    }
    async function regenerate(f, m) {
        const s = stateOf(f, m);
        if (s.busy) return;
        s.audio?.pause(); s.audio = null; s.busy = true; paint(s);
        try {
            const result = await window.imVoiceMessageAudio.regenerate(f, m);
            s.duration = null; s.progress = 0;
            await inspect(f, m);
            return result;
        } finally { s.busy = false; paint(s); }
    }
    window.imVoiceMessageUI = Object.freeze({controls, bind, play, regenerate, inspect, reportError, observe: (f, m, audio) => attach(stateOf(f, m), audio)});
})();
