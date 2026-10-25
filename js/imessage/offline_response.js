// Streaming dual-language offline response envelope. The UI receives only content;
// translationZh is retained separately and becomes usable only after a valid envelope.
(() => {
    const readString = (source, start) => {
        let text = '';
        for (let i = start; i < source.length; i++) {
            const char = source[i];
            if (char === '"') return { text, end: i + 1, complete: true };
            if (char !== '\\') { text += char; continue; }
            if (++i >= source.length) break;
            const escape = source[i];
            if (escape === 'u') {
                const hex = source.slice(i + 1, i + 5);
                if (!/^[a-f\d]{4}$/i.test(hex)) break;
                text += String.fromCharCode(parseInt(hex, 16)); i += 4;
            } else {
                const values = { '"': '"', '\\': '\\', '/': '/', n: '\n', r: '\r', t: '\t', b: '\b', f: '\f' };
                if (!(escape in values)) break;
                text += values[escape];
            }
        }
        return { text, end: source.length, complete: false };
    };
    const parse = (raw, { streaming = false } = {}) => {
        const source = String(raw || '').trimStart().replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');
        if (!source.startsWith('{')) return {
            content: source.startsWith('`') ? '' : source,
            translationZh: '', translationState: streaming ? 'pending' : 'incomplete'
        };
        const fields = {};
        let i = 1;
        while (i < source.length) {
            while (/[\s,]/.test(source[i] || '') && i < source.length) i++;
            if (source[i] !== '"') break;
            const key = readString(source, i + 1);
            if (!key.complete) break;
            i = key.end;
            while (/\s/.test(source[i] || '') && i < source.length) i++;
            if (source[i++] !== ':') break;
            while (/\s/.test(source[i] || '') && i < source.length) i++;
            if (source[i++] !== '"') break;
            const value = readString(source, i);
            fields[key.text] = value.text;
            i = value.end;
            if (!value.complete) break;
        }
        let complete = false;
        try {
            const parsed = JSON.parse(source);
            complete = typeof parsed.content === 'string' && typeof parsed.translationZh === 'string'
                && !!parsed.content.trim() && !!parsed.translationZh.trim();
        } catch (_) {}
        return { content: fields.content || '', translationZh: fields.translationZh || '',
            translationState: complete ? 'complete' : streaming ? 'pending' : 'incomplete' };
    };
    window.imOfflineResponse = { parse };
})();
