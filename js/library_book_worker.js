'use strict';

const JSZIP_URL = 'https://unpkg.com/jszip@3.10.1/dist/jszip.min.js',
    MAMMOTH_URL = 'https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js',
    CHUNK_TARGET_CHARS = 16000;
function fileBaseName(name_3) {
    return String(name_3 || '未命名书籍').replace(/\.[^/.]+$/, '') || '未命名书籍';
}
function decodeEntities(value_3) {
    const named = {
        amp: '&',
        lt: '<',
        gt: '>',
        quot: '"',
        apos: "'",
        nbsp: ' ',
    };
    return String(value_3 || '').replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match_2, entity) => {
        if (entity[0] === '#') {
            const hex = entity[1]?.toLowerCase() === 'x',
                code = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
            return Number.isFinite(code) ? String.fromCodePoint(code) : match_2;
        }
        return named[entity.toLowerCase()] ?? match_2;
    });
}
function cleanPlainText(value_2) {
    return String(value_2 || '')
        .replace(
            /\r\n?/g,
            `
`,
        )
        .replace(/\u0000/g, '')
        .replace(
            /[ \t]+\n/g,
            `
`,
        )
        .replace(
            /\n{3,}/g,
            `

`,
        )
        .trim();
}
function htmlToPlainText(html) {
    return cleanPlainText(
        decodeEntities(
            String(html || '')
                .replace(/<!--[\s\S]*?-->/g, '')
                .replace(/<(script|style|svg|head|nav)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
                .replace(
                    /<br\s*\/?>/gi,
                    `
`,
                )
                .replace(
                    /<\/(?:p|div|section|article|h[1-6]|li|blockquote|pre|tr)>/gi,
                    `
`,
                )
                .replace(/<li\b[^>]*>/gi, '• ')
                .replace(/<[^>]+>/g, ''),
        ),
    );
}
function readAttribute(value_7, value_8) {
    const match_3 = String(value_7 || '').match(
        new RegExp('\\b' + value_8 + '\\s*=\\s*(["\'])(.*?)\\1', 'i'),
    );
    return match_3 ? decodeEntities(match_3[2]) : '';
}
function firstXmlText(value_10, value_11) {
    const match_4 = String(value_10 || '').match(
        new RegExp(
            '<(?:[\\w.-]+:)?' +
                value_11 +
                '\\b[^>]*>([\\s\\S]*?)<\\/(?:[\\w.-]+:)?' +
                value_11 +
                '>',
            'i',
        ),
    );
    return match_4 ? htmlToPlainText(match_4[1]) : '';
}
function normalizeZipPath(path) {
    const output = [];
    return (
        String(path || '')
            .replace(/\\/g, '/')
            .split('/')
            .forEach((part) => {
                if (!part || part === '.') return;
                if (part === '..') output.pop();
                else output.push(part);
            }),
        output.join('/')
    );
}
function zipDir(value_14) {
    const normalized = normalizeZipPath(value_14),
        index_2 = normalized.lastIndexOf('/');
    return index_2 >= 0 ? normalized.slice(0, index_2 + 1) : '';
}
function resolveZipPath(value_16, href_2) {
    const cleanHref = decodeURIComponent(String(href_2 || '').split('#')[0]);
    return normalizeZipPath('' + (value_16 || '') + cleanHref);
}
function decodeTextBuffer(buffer_2) {
    const bytes = new Uint8Array(buffer_2);
    if (bytes[0] === 255 && bytes[1] === 254)
        return new TextDecoder('utf-16le').decode(bytes.subarray(2));
    if (bytes[0] === 254 && bytes[1] === 255)
        return new TextDecoder('utf-16be').decode(bytes.subarray(2));
    if (bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191)
        return new TextDecoder('utf-8').decode(bytes.subarray(3));
    return new TextDecoder('utf-8').decode(bytes);
}
function isChapterHeading(line) {
    const value_9 = String(line || '').trim();
    if (!value_9 || value_9.length > 80) return false;
    return /^(?:第[0-9零一二三四五六七八九十百千万两〇]+[章节卷部篇回]|chapter\s+[0-9ivxlcdm]+\b|#{1,3}\s+|\d{1,3}[、.．]\s*\S+)/i.test(
        value_9,
    );
}
function buildChapterIndex(text_2) {
    const chapters = [
        {
            title: '开始阅读',
            start: 0,
        },
    ];
    let start_2 = 0;
    return (
        String(text_2 || '')
            .split(
                `
`,
            )
            .forEach((line_2) => {
                start_2 > 0 &&
                    isChapterHeading(line_2) &&
                    chapters.push({
                        title: line_2.trim().replace(/^#{1,3}\s*/, ''),
                        start: start_2,
                    });
                start_2 += line_2.length + 1;
            }),
        chapters.map((chapter, index) => ({
            ...chapter,
            end: index + 1 < chapters.length ? chapters[index + 1].start : text_2.length,
        }))
    );
}
function buildReaderChunks(text_3, chapterIndex_2) {
    const chunks_2 = [];
    let start_3 = 0;
    while (start_3 < text_3.length) {
        const target = Math.min(text_3.length, start_3 + CHUNK_TARGET_CHARS);
        let end_2 = target;
        if (target < text_3.length) {
            const nextChapter = chapterIndex_2.find(
                (chapter_2) => chapter_2.start > start_3 + 4000 && chapter_2.start <= target + 4000,
            );
            if (nextChapter) end_2 = nextChapter.start;
            else {
                const paragraphBreak = text_3.lastIndexOf(
                        `

`,
                        target,
                    ),
                    lineBreak = text_3.lastIndexOf(
                        `
`,
                        target,
                    ),
                    candidate =
                        paragraphBreak > start_3 + 8000 ? paragraphBreak + 2 : lineBreak + 1;
                if (candidate > start_3 + 4000) end_2 = candidate;
            }
        }
        if (end_2 <= start_3) end_2 = Math.min(text_3.length, start_3 + CHUNK_TARGET_CHARS);
        chunks_2.push({
            start: start_3,
            end: end_2,
        });
        start_3 = end_2;
    }
    return chunks_2.length
        ? chunks_2
        : [
              {
                  start: 0,
                  end: 0,
              },
          ];
}
function createParsedBook({
    text: text_4,
    sourceType: sourceType_2,
    title: title_2,
    author = '未知作者',
    synopsis = '暂无简介',
}) {
    const normalizedText = cleanPlainText(text_4);
    if (!normalizedText) throw new Error('文件内容为空');
    const chapterIndex_3 = buildChapterIndex(normalizedText);
    return {
        text: normalizedText,
        sourceType: sourceType_2,
        title: title_2,
        author: author,
        synopsis: synopsis,
        chapterIndex: chapterIndex_3,
        chunks: buildReaderChunks(normalizedText, chapterIndex_3),
    };
}
async function ensureDependency(kind) {
    if (kind === 'EPUB' && !self.JSZip) importScripts(JSZIP_URL);
    if (kind === 'DOCX' && !self.mammoth?.extractRawText) importScripts(MAMMOTH_URL);
}
async function parseEpub(buffer_3, name_4) {
    await ensureDependency('EPUB');
    const zip = await self.JSZip.loadAsync(buffer_3),
        containerEntry = zip.file('META-INF/container.xml');
    if (!containerEntry) throw new Error('EPUB 缺少 container.xml');
    const containerXml = await containerEntry.async('string'),
        rootfileTag = containerXml.match(/<(?:[\w.-]+:)?rootfile\b([^>]*)>/i),
        rootfilePath = readAttribute(rootfileTag?.[1], 'full-path');
    if (!rootfilePath) throw new Error('EPUB 缺少 OPF 入口');
    const opfEntry = zip.file(rootfilePath);
    if (!opfEntry) throw new Error('EPUB OPF 不存在');
    const opfXml = await opfEntry.async('string'),
        baseDir = zipDir(rootfilePath),
        manifest = new Map();
    for (const value_49 of opfXml.matchAll(/<(?:[\w.-]+:)?item\b([^>]*)\/?\s*>/gi)) {
        const attrs = value_49[1],
            id_2 = readAttribute(attrs, 'id'),
            href_3 = readAttribute(attrs, 'href');
        if (id_2 && href_3)
            manifest.set(id_2, {
                href: href_3,
                mediaType: readAttribute(attrs, 'media-type'),
            });
    }
    const spine = [];
    for (const match_5 of opfXml.matchAll(/<(?:[\w.-]+:)?itemref\b([^>]*)\/?\s*>/gi)) {
        const item = manifest.get(readAttribute(match_5[1], 'idref'));
        if (
            item &&
            (/application\/xhtml\+xml|text\/html/i.test(item.mediaType) ||
                /\.x?html?$/i.test(item.href))
        )
            spine.push(item);
    }
    if (!spine.length) throw new Error('EPUB 缺少可读章节');
    const chapterTexts = [];
    for (const item_2 of spine) {
        const zipPath_56 = resolveZipPath(baseDir, item_2.href),
            opfEntry_2 = zip.file(zipPath_56);
        if (!opfEntry_2) continue;
        const html_2 = await opfEntry_2.async('string'),
            heading =
                firstXmlText(html_2, 'h1') ||
                firstXmlText(html_2, 'h2') ||
                fileBaseName(item_2.href),
            body = html_2.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || html_2,
            htmlToPlainText_61 = htmlToPlainText(body);
        if (htmlToPlainText_61)
            chapterTexts.push(
                [heading ? '# ' + heading : '', htmlToPlainText_61].filter(Boolean).join(`

`),
            );
    }
    return createParsedBook({
        text: chapterTexts.join(`

`),
        sourceType: 'EPUB',
        title: firstXmlText(opfXml, 'title') || fileBaseName(name_4),
        author: firstXmlText(opfXml, 'creator') || '未知作者',
        synopsis: firstXmlText(opfXml, 'description') || '暂无简介',
    });
}
async function parseBook(buffer_4, name_5) {
    const lower = String(name_5 || '').toLowerCase();
    if (lower.endsWith('.epub')) return parseEpub(buffer_4, name_5);
    if (lower.endsWith('.docx')) {
        await ensureDependency('DOCX');
        const result_2 = await self.mammoth.extractRawText({
            arrayBuffer: buffer_4,
        });
        return createParsedBook({
            text: result_2?.value,
            sourceType: 'DOCX',
            title: fileBaseName(name_5),
        });
    }
    return createParsedBook({
        text: decodeTextBuffer(buffer_4),
        sourceType: 'TXT',
        title: fileBaseName(name_5),
    });
}
self.addEventListener('message', async (event) => {
    const {
        id: id_3,
        type: type_2,
        buffer: buffer_5,
        name: name_6,
        text: text_5,
    } = event.data || {};
    if (type_2 !== 'parse-book' && type_2 !== 'index-content') return;
    try {
        const book_2 =
            type_2 === 'index-content'
                ? buildContentIndex(text_5)
                : await parseBook(buffer_5, name_6);
        self.postMessage({
            id: id_3,
            ok: true,
            book: book_2,
        });
    } catch (error_2) {
        self.postMessage({
            id: id_3,
            ok: false,
            error: error_2?.message || '书籍解析失败',
        });
    }
});
