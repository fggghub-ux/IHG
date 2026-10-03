(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.imOfflineRegex = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
    'use strict';

    const createId = () =>
            'offline-text-replacement-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9),
        createId_2 = () =>
            'offline-html-template-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9),
        normalizeDepth_2 = (value_7) => {
            if (value_7 === '' || value_7 === null || typeof value_7 === 'undefined') return null;
            const number = Number(value_7);
            return Number.isInteger(number) && number >= 0 ? number : null;
        },
        normalizeTargetRole_2 = (value_24) => {
            const trim_25 = String(value_24 || '').trim();
            return trim_25 === 'user' || trim_25 === 'both' ? trim_25 : 'assistant';
        },
        normalizeRule = (rule_2, value_27 = 0) => {
            const source_2 = rule_2 && typeof rule_2 === 'object' ? rule_2 : {};
            return {
                id: String(source_2.id || createId()),
                name: String(source_2.name || '文字替换 ' + (value_27 + 1)),
                findRegex: String(source_2.findRegex || ''),
                replaceString: String(source_2.replaceString ?? ''),
                targetRole: normalizeTargetRole_2(source_2.targetRole),
                disabled: !!source_2.disabled,
                minDepth: normalizeDepth_2(source_2.minDepth),
                maxDepth: normalizeDepth_2(source_2.maxDepth),
                revision: Math.max(1, Math.floor(Number(source_2.revision) || 1)),
            };
        },
        normalizeTextReplacementRules_2 = (rules_2) =>
            (Array.isArray(rules_2) ? rules_2 : []).map(normalizeRule),
        createTextReplacementRule_2 = () =>
            normalizeRule({
                id: createId(),
                name: '新文字替换',
                targetRole: 'assistant',
                revision: 1,
            }),
        normalizeRule_7 = (rule_3, value_31 = 0) => {
            const source_3 = rule_3 && typeof rule_3 === 'object' ? rule_3 : {};
            return {
                id: String(source_3.id || createId_2()),
                scriptName: String(source_3.scriptName || 'HTML 模板 ' + (value_31 + 1)),
                findRegex: String(source_3.findRegex || ''),
                html: String(source_3.html || ''),
                disabled: !!source_3.disabled,
                minDepth: normalizeDepth_2(source_3.minDepth),
                maxDepth: normalizeDepth_2(source_3.maxDepth),
                revision: Math.max(1, Math.floor(Number(source_3.revision) || 1)),
            };
        },
        normalizeHtmlTemplateRules_2 = (rules_3) =>
            (Array.isArray(rules_3) ? rules_3 : []).map(normalizeRule_7),
        createHtmlTemplateRule_2 = () =>
            normalizeRule_7({
                id: createId_2(),
                scriptName: '新 HTML 模板',
                revision: 1,
            }),
        findClosingSlash = (value_12) => {
            for (let index_2 = value_12.length - 1; index_2 > 0; index_2 -= 1) {
                if (value_12[index_2] !== '/') continue;
                let backslashes = 0;
                for (
                    let cursor = index_2 - 1;
                    cursor >= 0 && value_12[cursor] === '\\';
                    cursor -= 1
                )
                    backslashes += 1;
                if (backslashes % 2 === 0) return index_2;
            }
            return -1;
        },
        parseRegex = (value_25) => {
            const raw_2 = String(value_25 || '');
            if (!raw_2) throw new Error('请输入查找正则表达式');
            if (!raw_2.startsWith('/'))
                return {
                    source: raw_2,
                    flags: '',
                };
            const closingSlash = findClosingSlash(raw_2);
            if (closingSlash <= 0)
                return {
                    source: raw_2,
                    flags: '',
                };
            return {
                source: raw_2.slice(1, closingSlash),
                flags: raw_2.slice(closingSlash + 1),
            };
        },
        compileRule_2 = (rule_4) => {
            try {
                const parsed = parseRegex(rule_4?.findRegex);
                return {
                    regex: new RegExp(parsed.source, parsed.flags),
                    error: '',
                };
            } catch (error_2) {
                return {
                    regex: null,
                    error: error_2 instanceof Error ? error_2.message : String(error_2),
                };
            }
        },
        extractNamedCaptureNames_2 = (value_40) => {
            const value_41 = new Set(),
                value_42 = /\(\?<([A-Za-z_$][\w$]*)>/g;
            let value_43;
            while ((value_43 = value_42.exec(String(value_40 || '')))) {
                value_41.add(value_43[1]);
            }
            return Array.from(value_41);
        },
        isDepthValid_2 = (rule_5) =>
            rule_5?.minDepth === null ||
            rule_5?.maxDepth === null ||
            Number(rule_5.maxDepth) >= Number(rule_5.minDepth),
        isDepthIncluded_2 = (rule_6, depth_2) => {
            if (!Number.isInteger(depth_2) || depth_2 < 0 || !isDepthValid_2(rule_6)) return false;
            if (rule_6.minDepth !== null && depth_2 < rule_6.minDepth) return false;
            if (rule_6.maxDepth !== null && depth_2 > rule_6.maxDepth) return false;
            return true;
        },
        isRoleIncluded_2 = (value_47, value_48) => {
            const value_4_49 = normalizeTargetRole_2(value_47?.targetRole);
            return value_4_49 === 'both' || value_4_49 === value_48;
        },
        validateTextReplacementRule_2 = (value_50) => {
            const rule_8 = normalizeRule(value_50),
                value_10_52 = compileRule_2(rule_8);
            if (value_10_52.error)
                return {
                    valid: false,
                    error: value_10_52.error,
                    rule: rule_8,
                };
            if (!isDepthValid_2(rule_8))
                return {
                    valid: false,
                    error: '最大深度不能小于最小深度',
                    rule: rule_8,
                };
            return {
                valid: true,
                error: '',
                rule: rule_8,
            };
        },
        applyTextReplacementRules_2 = (value_53, options_2 = {}) => {
            const role_2 = options_2.role === 'assistant' ? 'assistant' : 'user',
                number_56 = Number(options_2.depth);
            let string = String(value_53 || '');
            return (
                normalizeTextReplacementRules_2(options_2.rules).forEach((value_57) => {
                    if (
                        value_57.disabled ||
                        !isRoleIncluded_2(value_57, role_2) ||
                        !isDepthIncluded_2(value_57, number_56)
                    )
                        return;
                    const value_15_58 = validateTextReplacementRule_2(value_57);
                    if (!value_15_58.valid) return;
                    const value_10_59 = compileRule_2(value_15_58.rule);
                    if (!value_10_59.regex) return;
                    string = string.replace(value_10_59.regex, value_15_58.rule.replaceString);
                }),
                string
            );
        },
        validateHtmlTemplateRule_2 = (value_60) => {
            const rule_9 = normalizeRule_7(value_60),
                value_10_61 = compileRule_2(rule_9);
            if (value_10_61.error)
                return {
                    valid: false,
                    error: value_10_61.error,
                    rule: rule_9,
                    captureNames: [],
                };
            if (!isDepthValid_2(rule_9))
                return {
                    valid: false,
                    error: '最大深度不能小于最小深度',
                    rule: rule_9,
                    captureNames: [],
                };
            if (!rule_9.html.trim())
                return {
                    valid: false,
                    error: 'HTML 模板不能为空',
                    rule: rule_9,
                    captureNames: [],
                };
            const captureNames_2 = extractNamedCaptureNames_2(rule_9.findRegex);
            if (captureNames_2.length === 0)
                return {
                    valid: false,
                    error: 'HTML 模板正则至少需要一个命名捕获组，例如 (?<title>[\\s\\S]+)',
                    rule: rule_9,
                    captureNames: captureNames_2,
                };
            return {
                valid: true,
                error: '',
                rule: rule_9,
                captureNames: captureNames_2,
            };
        },
        value_18 = (value_63) =>
            String(value_63 == null ? '' : value_63)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;'),
        interpolateHtmlTemplate_2 = (value_64, value_65, value_66 = {}) => {
            const options = {
                    ...(value_65?.groups || {}),
                    match: String(value_65?.[0] || ''),
                },
                value_67 =
                    typeof value_66.transformText === 'function'
                        ? value_66.transformText
                        : (value_68) => String(value_68 == null ? '' : value_68);
            return String(value_64 || '').replace(
                /{{\s*([A-Za-z_$][\w$]*)\s*}}/g,
                (value_69, value_70) =>
                    Object.prototype.hasOwnProperty.call(options, value_70)
                        ? value_18(value_67(options[value_70]))
                        : '',
            );
        },
        value_20 = (value_71, value_72, value_73, value_74 = {}) => {
            const text_2 = String(value_71 || ''),
                value_76 = new RegExp(value_73.regex.source, value_73.regex.flags),
                transformText_2 =
                    typeof value_74.transformText === 'function' ? value_74.transformText : null,
                items = [];
            let count = 0,
                value_78;
            while ((value_78 = value_76.exec(text_2)) !== null) {
                const index_79 = value_78.index,
                    string_80 = String(value_78[0] || '');
                if (index_79 > count)
                    items.push({
                        type: 'text',
                        text: text_2.slice(count, index_79),
                    });
                items.push({
                    type: 'html',
                    html: interpolateHtmlTemplate_2(value_72.html, value_78, {
                        transformText: transformText_2,
                    }),
                    raw: transformText_2 ? String(transformText_2(string_80)) : string_80,
                });
                count = index_79 + string_80.length;
                if (!value_76.global) break;
                !string_80 &&
                    (value_76.lastIndex += text_2.codePointAt(value_76.lastIndex) > 65535 ? 2 : 1);
            }
            if (items.length === 0)
                return [
                    {
                        type: 'text',
                        text: text_2,
                    },
                ];
            if (count < text_2.length)
                items.push({
                    type: 'text',
                    text: text_2.slice(count),
                });
            return items;
        },
        applyHtmlTemplateRules_2 = (value_81, options_3 = {}) => {
            const role_3 = options_3.role === 'assistant' ? 'assistant' : 'user',
                number_84 = Number(options_3.depth),
                transformText_3 =
                    typeof options_3.transformText === 'function' ? options_3.transformText : null;
            if (role_3 !== 'assistant') {
                const string_87 = String(value_81 || '');
                return [
                    {
                        type: 'text',
                        text: transformText_3 ? String(transformText_3(string_87)) : string_87,
                    },
                ];
            }
            let items_86 = [
                {
                    type: 'text',
                    text: String(value_81 || ''),
                },
            ];
            return (
                normalizeHtmlTemplateRules_2(options_3.rules).forEach((value_88) => {
                    if (value_88.disabled || !isDepthIncluded_2(value_88, number_84)) return;
                    const value_17_89 = validateHtmlTemplateRule_2(value_88);
                    if (!value_17_89.valid) return;
                    const value_10_90 = compileRule_2(value_17_89.rule);
                    if (!value_10_90.regex) return;
                    items_86 = items_86.flatMap((value_91) =>
                        value_91.type === 'text'
                            ? value_20(value_91.text, value_17_89.rule, value_10_90, {
                                  transformText: transformText_3,
                              })
                            : [value_91],
                    );
                }),
                transformText_3 &&
                    (items_86 = items_86.map((value_92) =>
                        value_92.type === 'text'
                            ? {
                                  ...value_92,
                                  text: String(transformText_3(value_92.text)),
                              }
                            : value_92,
                    )),
                items_86
            );
        },
        stripHtmlTemplateRules_2 = (value_93, value_94 = {}) =>
            applyHtmlTemplateRules_2(value_93, value_94)
                .filter((value_95) => value_95.type === 'text')
                .map((value_96) => value_96.text)
                .join('');
    return {
        normalizeDepth: normalizeDepth_2,
        normalizeTargetRole: normalizeTargetRole_2,
        normalizeTextReplacementRule: normalizeRule,
        normalizeTextReplacementRules: normalizeTextReplacementRules_2,
        createTextReplacementRule: createTextReplacementRule_2,
        normalizeHtmlTemplateRule: normalizeRule_7,
        normalizeHtmlTemplateRules: normalizeHtmlTemplateRules_2,
        createHtmlTemplateRule: createHtmlTemplateRule_2,
        compileRule: compileRule_2,
        extractNamedCaptureNames: extractNamedCaptureNames_2,
        isDepthValid: isDepthValid_2,
        isDepthIncluded: isDepthIncluded_2,
        isRoleIncluded: isRoleIncluded_2,
        validateTextReplacementRule: validateTextReplacementRule_2,
        applyTextReplacementRules: applyTextReplacementRules_2,
        validateHtmlTemplateRule: validateHtmlTemplateRule_2,
        interpolateHtmlTemplate: interpolateHtmlTemplate_2,
        applyHtmlTemplateRules: applyHtmlTemplateRules_2,
        stripHtmlTemplateRules: stripHtmlTemplateRules_2,
    };
});
