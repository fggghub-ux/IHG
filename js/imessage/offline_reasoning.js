(function (globalScope, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    if (globalScope) globalScope.imOfflineReasoning = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
    'use strict';

    const REASONING_TAG_NAMES = ['cot', 'think', 'thinking', 'reasoning', 'analysis'],
        COMPLETE_TAG_PATTERN = new RegExp(
            '<\\s*(\\/?)\\s*(' + REASONING_TAG_NAMES.join('|') + ')\\s*>',
            'gi',
        ),
        PARTIAL_TAG_CANDIDATES = REASONING_TAG_NAMES.flatMap((value_20) => [
            '<' + value_20 + '>',
            '</' + value_20 + '>',
        ]),
        REASONING_BOUNDARY_PATTERN = new RegExp(
            '<\\s*\\/?\\s*(?:' + REASONING_TAG_NAMES.join('|') + ')\\s*>',
            'gi',
        ),
        VISIBLE_REASONING_BLOCK_TYPES = new Set([
            'reasoning',
            'reasoning.text',
            'reasoning.summary',
            'thinking',
            'thinking.text',
            'thinking.summary',
            'analysis',
            'analysis.text',
            'analysis.summary',
        ]),
        normalizeText = (value_3) =>
            String(value_3 == null ? '' : value_3).replace(
                /\r\n/g,
                `
`,
            ),
        DEFAULT_MAX_RESPONSE_TOKENS = 30000,
        normalizeMaxResponseTokens_2 = (value_12) => {
            const numeric = Number(value_12);
            if (!Number.isFinite(numeric) || numeric <= 0) return DEFAULT_MAX_RESPONSE_TOKENS;
            return Math.min(32768, Math.max(256, Math.round(numeric)));
        },
        stripReasoningBoundaryTags_2 = (value_26) =>
            normalizeText(value_26).replace(REASONING_BOUNDARY_PATTERN, '').trim(),
        normalizeCotEntryTitle = (value_29, value_25) => {
            const title_2 = normalizeText(value_29)
                .replace(/[\r\n]+/g, ' ')
                .trim();
            return title_2 || 'COT ' + (value_25 + 1);
        },
        isCotEntry_2 = (value_27, value_28) => {
            const trim_29 = normalizeText(value_27?.id).trim(),
                value_30 =
                    value_28 instanceof Set
                        ? value_28
                        : new Set(Array.isArray(value_28) ? value_28 : []);
            if (value_30.has(trim_29)) return true;
            if (value_27?.cotEnabled === true) return true;
            if (value_27?.cotEnabled === false) return false;
            if (!/^custom-/i.test(trim_29)) return false;
            const trim_31 = normalizeText(value_27?.name).trim();
            return /\bcot(?:\b|\d)|(?:思维|思考)链/i.test(trim_31);
        },
        buildCotInstructionBlock_2 = (entries) => {
            const checklist_2 = (Array.isArray(entries) ? entries : [])
                    .filter((entry) => entry && entry.enabled !== false)
                    .map((entry_2, index_2) => ({
                        title: normalizeCotEntryTitle(entry_2.name, index_2),
                        instruction: stripReasoningBoundaryTags_2(entry_2.content),
                    }))
                    .filter((entry_3) => entry_3.instruction),
                expectedTitles_3 = checklist_2.map((value_40) => '【' + value_40.title + '】');
            if (!checklist_2.length)
                return {
                    content: '',
                    expectedTitles: [],
                    checklist: [],
                };
            const join_35 = checklist_2.map(
                    (value_41) =>
                        '【' +
                        value_41.title +
                        `】
` +
                        value_41.instruction,
                ).join(`

`),
                join_36 = expectedTitles_3.join('、');
            return {
                content:
                    `<offline_cot_instruction>
在输出正文之前，先根据下面所有已启用的 COT 条目逐项思考，并输出一份简洁、可见的思考摘要。
思考摘要必须完整放在一对 <thinking> 与 </thinking> 标签内；正文必须紧跟在 </thinking> 之后并位于标签外。
思考摘要必须按当前顺序使用这些标题，标题文字不得改写、合并或遗漏：` +
                    join_36 +
                    `
每个标题下都要明确回应对应要求，不要只复述标题。

` +
                    join_35 +
                    `
</offline_cot_instruction>`,
                expectedTitles: expectedTitles_3,
                checklist: checklist_2,
            };
        },
        validateCotResponse_2 = (value_42, expectedTitles_2) => {
            const source = normalizeText(value_42),
                titles = (Array.isArray(expectedTitles_2) ? expectedTitles_2 : [])
                    .map((title_3) => String(title_3 || '').trim())
                    .filter(Boolean);
            if (!titles.length)
                return {
                    valid: true,
                    hasCompleteTag: true,
                    missingTitles: [],
                    parsed: parseTaggedReasoning_2(source),
                };
            const parsed_2 = parseTaggedReasoning_2(source),
                openingPattern = new RegExp(
                    '<\\s*(?:' + REASONING_TAG_NAMES.join('|') + ')\\s*>',
                    'i',
                ),
                closingPattern = new RegExp(
                    '<\\s*\\/\\s*(?:' + REASONING_TAG_NAMES.join('|') + ')\\s*>',
                    'i',
                ),
                hasCompleteTag_2 =
                    openingPattern.test(source) &&
                    closingPattern.test(source) &&
                    !parsed_2.incomplete,
                missingTitles_2 = titles.filter((title_4) => !parsed_2.reasoning.includes(title_4));
            return {
                valid: hasCompleteTag_2 && missingTitles_2.length === 0,
                hasCompleteTag: hasCompleteTag_2,
                missingTitles: missingTitles_2,
                parsed: parsed_2,
            };
        },
        detectReasoningApiMode_2 = (value_52, value_53) => {
            const endpointText = String(value_52 || '')
                    .trim()
                    .toLowerCase(),
                modelText = String(value_53 || '')
                    .trim()
                    .toLowerCase();
            if (/openrouter\.ai|openrouter/.test(endpointText)) return 'openrouter';
            if (/api\.openai\.com|openai\.com/.test(endpointText)) return 'native';
            if (/api\.deepseek\.com|deepseek\.com/.test(endpointText)) return 'native';
            if (/z\.ai|bigmodel|zhipu|moonshot|kimi/.test(endpointText)) return 'thinking';
            if (/\b(glm|kimi|moonshot)[-_/.]?/.test(modelText)) return 'thinking';
            return 'openrouter';
        },
        isOpenAiReasoningModel = (value_56, value_57) => {
            const endpointText_2 = String(value_56 || '')
                    .trim()
                    .toLowerCase(),
                modelText_2 = String(value_57 || '')
                    .trim()
                    .toLowerCase();
            if (!/api\.openai\.com|openai\.com/.test(endpointText_2)) return false;
            return /^(o1|o3|o4)(?:[-_.]|$)|^gpt-5(?:[-_.]|$)/.test(modelText_2);
        },
        buildReasoningRequestConfig_2 = (options_2 = {}) => {
            const endpoint_2 = String(options_2.endpoint || '').trim(),
                model_2 = String(options_2.model || '').trim(),
                enabled_2 = options_2.enabled !== false,
                maxTokens_2 = normalizeMaxResponseTokens_2(options_2.maxTokens),
                mode_2 = detectReasoningApiMode_2(endpoint_2, model_2),
                parameters_2 = {};
            if (isOpenAiReasoningModel(endpoint_2, model_2))
                parameters_2.max_completion_tokens = maxTokens_2;
            else parameters_2.max_tokens = maxTokens_2;
            if (mode_2 === 'openrouter')
                parameters_2.reasoning = {
                    enabled: enabled_2,
                    exclude: false,
                };
            else
                mode_2 === 'thinking' &&
                    (parameters_2.thinking = {
                        type: enabled_2 ? 'enabled' : 'disabled',
                    });
            return {
                mode: mode_2,
                enabled: enabled_2,
                maxTokens: maxTokens_2,
                hasReasoningParameter: mode_2 === 'openrouter' || mode_2 === 'thinking',
                parameters: parameters_2,
            };
        },
        getStructuredBlockType = (value_31) =>
            value_31 && typeof value_31 === 'object'
                ? String(value_31.type || value_31.kind || '')
                      .trim()
                      .toLowerCase()
                : '',
        isEncryptedReasoningBlock = (value_33) => {
            const type_2 = getStructuredBlockType(value_33);
            return (
                type_2 === 'reasoning.encrypted' ||
                type_2 === 'thinking.encrypted' ||
                type_2 === 'analysis.encrypted' ||
                value_33?.encrypted === true
            );
        },
        isVisibleReasoningBlock = (value_34) => {
            if (!value_34 || typeof value_34 !== 'object' || isEncryptedReasoningBlock(value_34))
                return false;
            const type_3 = getStructuredBlockType(value_34);
            return (
                value_34.thought === true ||
                value_34.is_reasoning === true ||
                value_34.isReasoning === true ||
                VISIBLE_REASONING_BLOCK_TYPES.has(type_3)
            );
        },
        readReasoningValue_2 = (value_35) => {
            if (typeof value_35 === 'string') return value_35;
            if (value_35 == null) return '';
            if (Array.isArray(value_35))
                return value_35.map(readReasoningValue_2).filter(Boolean).join(`
`);
            if (typeof value_35 === 'object') {
                if (isEncryptedReasoningBlock(value_35)) return '';
                for (const key_2 of [
                    'text',
                    'summary',
                    'thinking',
                    'reasoning_content',
                    'reasoning',
                    'content',
                ]) {
                    const text_2 = readReasoningValue_2(value_35[key_2]);
                    if (text_2) return text_2;
                }
            }
            return '';
        },
        readFirstReasoningValue_2 = (...value_74) => {
            for (const value_75 of value_74) {
                const value_10_76 = readReasoningValue_2(value_75);
                if (value_10_76) return value_10_76;
            }
            return '';
        },
        readContentValue_2 = (value_36) => {
            if (typeof value_36 === 'string') return value_36;
            if (value_36 == null) return '';
            if (Array.isArray(value_36))
                return value_36.map(readContentValue_2).filter(Boolean).join('');
            if (typeof value_36 === 'object') {
                if (isVisibleReasoningBlock(value_36) || isEncryptedReasoningBlock(value_36))
                    return '';
                for (const key of ['text', 'output_text', 'content', 'value']) {
                    const text_3 = readContentValue_2(value_36[key]);
                    if (text_3) return text_3;
                }
            }
            return '';
        },
        readFirstContentValue_2 = (...value_79) => {
            for (const value_80 of value_79) {
                const contentValue_12 = readContentValue_2(value_80);
                if (contentValue_12) return contentValue_12;
            }
            return '';
        },
        readStructuredReasoningValue_2 = (value_37) => {
            if (value_37 == null || typeof value_37 === 'string') return '';
            if (Array.isArray(value_37))
                return value_37.map(readStructuredReasoningValue_2).filter(Boolean).join(`
`);
            if (typeof value_37 !== 'object' || isEncryptedReasoningBlock(value_37)) return '';
            if (isVisibleReasoningBlock(value_37)) return readReasoningValue_2(value_37);
            for (const value_82 of ['content', 'parts', 'output', 'items']) {
                const value_14_83 = readStructuredReasoningValue_2(value_37[value_82]);
                if (value_14_83) return value_14_83;
            }
            return '';
        },
        readFirstStructuredReasoningValue_2 = (...value_84) => {
            for (const value_85 of value_84) {
                const value_14_86 = readStructuredReasoningValue_2(value_85);
                if (value_14_86) return value_14_86;
            }
            return '';
        },
        extractResponseParts_2 = (value_87, value_88) => {
            const value_89 = Array.isArray(value_87) ? value_87 : [value_87],
                value_90 = Array.isArray(value_88) ? value_88 : [value_88],
                content_2 = readFirstContentValue_2(...value_89),
                structuredReasoning = readFirstStructuredReasoningValue_2(...value_89),
                nativeReasoning = readFirstReasoningValue_2(...value_90);
            return {
                content: content_2,
                reasoning: structuredReasoning || nativeReasoning,
                reasoningSource: structuredReasoning
                    ? 'structured'
                    : nativeReasoning
                      ? 'native'
                      : '',
            };
        },
        findPartialTagSuffix = (text_4) => {
            const lower = text_4.toLowerCase();
            let best = '';
            for (const candidate of PARTIAL_TAG_CANDIDATES) {
                for (let length_2 = 1; length_2 < candidate.length; length_2 += 1) {
                    const prefix = candidate.slice(0, length_2);
                    if (lower.endsWith(prefix) && prefix.length > best.length)
                        best = text_4.slice(-prefix.length);
                }
            }
            return best;
        },
        parseTaggedReasoning_2 = (value_96, options_3 = {}) => {
            const source_2 = normalizeText(value_96),
                contentParts = [],
                reasoningParts = [];
            let cursor = 0,
                reasoningStart = -1,
                foundTag_2 = false,
                match = null;
            COMPLETE_TAG_PATTERN.lastIndex = 0;
            while ((match = COMPLETE_TAG_PATTERN.exec(source_2)) !== null) {
                foundTag_2 = true;
                const value_106 = match[1] === '/';
                if (!value_106) {
                    reasoningStart < 0 &&
                        (contentParts.push(source_2.slice(cursor, match.index)),
                        (reasoningStart = COMPLETE_TAG_PATTERN.lastIndex));
                    continue;
                }
                reasoningStart >= 0
                    ? (reasoningParts.push(source_2.slice(reasoningStart, match.index)),
                      (reasoningStart = -1),
                      (cursor = COMPLETE_TAG_PATTERN.lastIndex))
                    : (reasoningParts.push(source_2.slice(cursor, match.index)),
                      (cursor = COMPLETE_TAG_PATTERN.lastIndex));
            }
            let incomplete_2 = false,
                pendingTag_2 = '';
            if (reasoningStart >= 0) {
                reasoningParts.push(source_2.slice(reasoningStart));
                incomplete_2 = true;
            } else {
                contentParts.push(source_2.slice(cursor));
                if (!foundTag_2 && options_3.streaming) {
                    pendingTag_2 = findPartialTagSuffix(
                        contentParts[contentParts.length - 1] || '',
                    );
                    if (pendingTag_2) {
                        const lastIndex_2 = contentParts.length - 1;
                        contentParts[lastIndex_2] = contentParts[lastIndex_2].slice(
                            0,
                            -pendingTag_2.length,
                        );
                    }
                }
            }
            return {
                content: contentParts.join('').trim(),
                reasoning: reasoningParts.map((part) => part.trim()).filter(Boolean).join(`

`),
                foundTag: foundTag_2,
                incomplete: incomplete_2,
                pendingTag: pendingTag_2,
            };
        },
        normalizeResponse_2 = (value_108, nativeReasoning_2, value_110 = {}) => {
            const tagged = parseTaggedReasoning_2(value_108, value_110),
                nativeText = readReasoningValue_2(nativeReasoning_2).trim(),
                taggedText = tagged.reasoning.trim();
            return {
                content: tagged.content,
                reasoning: taggedText || nativeText,
                reasoningSource: taggedText ? 'tagged' : nativeText ? 'native' : '',
                foundTag: tagged.foundTag,
                incomplete: tagged.incomplete,
                pendingTag: tagged.pendingTag,
            };
        };
    return {
        normalizeMaxResponseTokens: normalizeMaxResponseTokens_2,
        stripReasoningBoundaryTags: stripReasoningBoundaryTags_2,
        isCotEntry: isCotEntry_2,
        buildCotInstructionBlock: buildCotInstructionBlock_2,
        validateCotResponse: validateCotResponse_2,
        detectReasoningApiMode: detectReasoningApiMode_2,
        buildReasoningRequestConfig: buildReasoningRequestConfig_2,
        readContentValue: readContentValue_2,
        readFirstContentValue: readFirstContentValue_2,
        readReasoningValue: readReasoningValue_2,
        readFirstReasoningValue: readFirstReasoningValue_2,
        readStructuredReasoningValue: readStructuredReasoningValue_2,
        readFirstStructuredReasoningValue: readFirstStructuredReasoningValue_2,
        extractResponseParts: extractResponseParts_2,
        parseTaggedReasoning: parseTaggedReasoning_2,
        normalizeResponse: normalizeResponse_2,
    };
});
