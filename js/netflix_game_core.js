(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.NetflixGameCore = api;
})(typeof window !== 'undefined' ? window : null, function () {
    'use strict';

    const SCHEMA_VERSION_2 = 4,
        MANUAL_SLOT_COUNT_2 = 6,
        DEFAULT_ATTRIBUTES_2 = Object.freeze([
            {
                id: 'charm',
                name: '魅力',
            },
            {
                id: 'vitality',
                name: '体质',
            },
            {
                id: 'speed',
                name: '速度',
            },
            {
                id: 'insight',
                name: '洞察',
            },
        ]);
    function clone_3(value_2) {
        if (value_2 === undefined) return undefined;
        return JSON.parse(JSON.stringify(value_2));
    }
    function clampInt_2(value_3, min_2 = 0, max_2 = 100, fallback = min_2) {
        const parsed = Number.parseInt(value_3, 10),
            safe = Number.isFinite(parsed) ? parsed : fallback;
        return Math.max(min_2, Math.min(max_2, safe));
    }
    function randomAttributeValue_2(random_2 = Math.random) {
        return clampInt_2(Math.floor(Number(random_2()) * 101), 0, 100, 0);
    }
    function createDefaultAttributes_2(random_3 = Math.random) {
        return DEFAULT_ATTRIBUTES_2.map((attribute) => ({
            ...attribute,
            value: randomAttributeValue_2(random_3),
            isDefault: true,
        }));
    }
    function normalizeAttributes_2(value_43, random_4 = Math.random) {
        const input = Array.isArray(value_43) ? value_43 : [],
            byId = new Map(input.map((item) => [String(item?.id || ''), item])),
            defaults = DEFAULT_ATTRIBUTES_2.map((attribute_2) => {
                const saved = byId.get(attribute_2.id);
                return {
                    ...attribute_2,
                    value: saved
                        ? clampInt_2(saved.value, 0, 100, 50)
                        : randomAttributeValue_2(random_4),
                    isDefault: true,
                };
            }),
            custom = input
                .filter(
                    (item_2) =>
                        item_2 &&
                        !DEFAULT_ATTRIBUTES_2.some(
                            (attribute_3) => attribute_3.id === String(item_2.id || ''),
                        ),
                )
                .map((value_50, value_51) => ({
                    id: String(value_50.id || 'custom-' + Date.now() + '-' + value_51),
                    name: String(value_50.name || '')
                        .trim()
                        .slice(0, 24),
                    value: clampInt_2(value_50.value, 0, 100, 50),
                    isDefault: false,
                }))
                .filter((value_52) => value_52.name);
        return [...defaults, ...custom];
    }
    function normalizeCharacterAttributes_2(value_53, definitions = [], value_55 = {}) {
        const input_2 = Array.isArray(value_53) ? value_53 : [],
            normalizedDefinitions = (Array.isArray(definitions) ? definitions : [])
                .map((item_3) => ({
                    id: String(item_3?.id || '').trim(),
                    name: String(item_3?.name || '')
                        .trim()
                        .slice(0, 24),
                }))
                .filter((item_4) => item_4.id && item_4.name);
        if (!normalizedDefinitions.length)
            return input_2
                .map((value_61) => {
                    if (!value_61 || typeof value_61 !== 'object') return null;
                    const id_2 = String(value_61.id || '').trim(),
                        name_2 = String(value_61.name || '')
                            .trim()
                            .slice(0, 24),
                        rawValue = Number(value_61.value);
                    if (
                        !id_2 ||
                        !name_2 ||
                        !Number.isInteger(rawValue) ||
                        rawValue < 0 ||
                        rawValue > 100
                    )
                        return null;
                    return {
                        id: id_2,
                        name: name_2,
                        value: rawValue,
                    };
                })
                .filter(Boolean);
        const byId_2 = new Map(input_2.map((item_5) => [String(item_5?.id || '').trim(), item_5])),
            validIds = new Set(normalizedDefinitions.map((value_65) => value_65.id));
        if (
            value_55.strict &&
            (input_2.length !== normalizedDefinitions.length ||
                input_2.some((item_6) => !validIds.has(String(item_6?.id || '').trim())))
        )
            throw new Error('角色属性必须完整复用开局 User 属性 ID');
        return normalizedDefinitions.map((definition) => {
            const value_4 = Number(byId_2.get(definition.id)?.value);
            if (!Number.isInteger(value_4) || value_4 < 0 || value_4 > 100) {
                if (value_55.strict)
                    throw new Error('角色属性“' + definition.name + '”必须为 0–100 的整数');
                return {
                    ...definition,
                    value: 50,
                };
            }
            return {
                ...definition,
                value: value_4,
            };
        });
    }
    function normalizeCast_2(value_69) {
        const items_70 = Array.isArray(value_69) ? value_69 : [],
            value_71 = new Set();
        return items_70
            .map((actor_2, value_72) => {
                if (!actor_2 || typeof actor_2 !== 'object') return null;
                const type_2 =
                        actor_2.type === 'user'
                            ? 'user'
                            : actor_2.type === 'char'
                              ? 'char'
                              : actor_2.type === 'story'
                                ? 'story'
                                : 'custom',
                    fallbackId =
                        type_2 === 'user'
                            ? 'user-current'
                            : type_2 + '-' + Date.now() + '-' + value_72,
                    id_3 = String(actor_2.id || actor_2.sourceId || fallbackId);
                if (value_71.has(id_3)) return null;
                value_71.add(id_3);
                const trim_75 = String(
                    actor_2.name ||
                        actor_2.realName ||
                        actor_2.roleName ||
                        (type_2 === 'user' ? 'User' : '主演' + (value_72 + 1)),
                ).trim();
                return {
                    id: id_3,
                    sourceId: String(actor_2.sourceId || ''),
                    type: type_2,
                    name: trim_75 || '主演' + (value_72 + 1),
                    persona: String(
                        actor_2.persona || actor_2.rolePersona || actor_2.desc || '',
                    ).trim(),
                    avatar: String(actor_2.avatar || actor_2.avatarUrl || '').trim(),
                    affinity: type_2 === 'user' ? null : clampInt_2(actor_2.affinity, 0, 100, 50),
                    origin:
                        type_2 === 'user'
                            ? 'user'
                            : actor_2.origin === 'story' || type_2 === 'story'
                              ? 'story'
                              : 'setup',
                    identity: String(actor_2.identity || '')
                        .trim()
                        .slice(0, 80),
                    occupation: String(actor_2.occupation || '')
                        .trim()
                        .slice(0, 60),
                    faction: String(actor_2.faction || '')
                        .trim()
                        .slice(0, 60),
                    characterAttributes: normalizeCharacterAttributes_2(
                        actor_2.characterAttributes || actor_2.traits,
                    ),
                    profileComplete: type_2 === 'user' ? true : !!actor_2.profileComplete,
                    acquainted: type_2 === 'user' ? true : actor_2.acquainted !== false,
                    companionEligible:
                        type_2 === 'user'
                            ? false
                            : typeof actor_2.companionEligible === 'boolean'
                              ? actor_2.companionEligible
                              : type_2 !== 'story',
                    firstSeenAt: type_2 === 'user' ? null : Number(actor_2.firstSeenAt) || null,
                    firstSeenSceneId:
                        type_2 === 'user' ? '' : String(actor_2.firstSeenSceneId || ''),
                    acquaintedAt: type_2 === 'user' ? null : Number(actor_2.acquaintedAt) || null,
                    acquaintedSceneId:
                        type_2 === 'user' ? '' : String(actor_2.acquaintedSceneId || ''),
                    deferredSceneId: type_2 === 'user' ? '' : String(actor_2.deferredSceneId || ''),
                };
            })
            .filter(Boolean);
    }
    function cleanJsonText_2(raw) {
        const text_2 = String(raw || '')
            .trim()
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();
        if (!text_2) throw new Error('API 没有返回剧情内容');
        try {
            return JSON.parse(text_2);
        } catch (value_78) {
            const start = text_2.indexOf('{'),
                end = text_2.lastIndexOf('}');
            if (start >= 0 && end > start) return JSON.parse(text_2.slice(start, end + 1));
            throw new Error('API 返回的剧情不是合法 JSON');
        }
    }
    function normalizeRequirementMap(value_5) {
        if (!value_5 || typeof value_5 !== 'object' || Array.isArray(value_5)) return {};
        return Object.entries(value_5).reduce((result, [key, minimum_2]) => {
            const id_4 = String(key || '').trim();
            if (id_4) result[id_4] = clampInt_2(minimum_2, 0, 100, 0);
            return result;
        }, {});
    }
    function normalizeOutcome_2(value_84) {
        const source_2 = value_84 && typeof value_84 === 'object' ? value_84 : {},
            normalizeDeltas = (deltas) => {
                if (!deltas || typeof deltas !== 'object' || Array.isArray(deltas)) return {};
                return Object.entries(deltas).reduce((result_2, [key_2, amount]) => {
                    const id_5 = String(key_2 || '').trim();
                    if (id_5) result_2[id_5] = clampInt_2(amount, -10, 10, 0);
                    return result_2;
                }, {});
            };
        return {
            attributeDeltas: normalizeDeltas(source_2.attributeDeltas || source_2.attributes),
            affinityDeltas: normalizeDeltas(source_2.affinityDeltas || source_2.affinities),
            summary: String(source_2.summary || '').trim(),
            flags: Array.isArray(source_2.flags)
                ? source_2.flags
                      .map((flag) => String(flag || '').trim())
                      .filter(Boolean)
                      .slice(0, 24)
                : [],
        };
    }
    function normalizeTrainingOutcome_2(value_90) {
        const normalized = normalizeOutcome_2(value_90),
            clampDeltas = (value_93) =>
                Object.entries(value_93).reduce((result_3, [id_6, amount_2]) => {
                    return ((result_3[id_6] = clampInt_2(amount_2, -5, 5, 0)), result_3);
                }, {});
        return {
            ...normalized,
            attributeDeltas: clampDeltas(normalized.attributeDeltas),
            affinityDeltas: clampDeltas(normalized.affinityDeltas),
        };
    }
    function handleAction_12(beat_2, value_97) {
        if (!beat_2 || typeof beat_2 !== 'object') return null;
        const kind_2 =
                beat_2.kind === 'dialogue' || beat_2.type === 'dialogue'
                    ? 'dialogue'
                    : beat_2.kind === 'narration' || beat_2.type === 'narration'
                      ? 'narration'
                      : '',
            text_3 = String(beat_2.text || beat_2.content || '').trim();
        if (!kind_2 || !text_3) return null;
        const speakerName_2 = String(
            beat_2.speakerName || beat_2.speaker || beat_2.name || '',
        ).trim();
        if (kind_2 === 'dialogue' && !speakerName_2) return null;
        return {
            id: String(beat_2.id || 'beat-' + (value_97 + 1)),
            kind: kind_2,
            speakerId: String(beat_2.speakerId || '').trim(),
            speakerName: kind_2 === 'dialogue' ? speakerName_2 : '',
            text: text_3,
        };
    }
    function normalizeChoice(choice_2, value_102) {
        if (!choice_2 || typeof choice_2 !== 'object') return null;
        const text_4 = String(choice_2.text || choice_2.label || '').trim();
        if (!text_4) return null;
        const requirements_2 =
            choice_2.requirements && typeof choice_2.requirements === 'object'
                ? choice_2.requirements
                : {};
        return {
            id: String(choice_2.id || 'choice-' + (value_102 + 1)),
            text: text_4,
            requirements: {
                attributes: normalizeRequirementMap(
                    requirements_2.attributes || choice_2.attributeRequirements,
                ),
                affinities: normalizeRequirementMap(
                    requirements_2.affinities || choice_2.affinityRequirements,
                ),
            },
        };
    }
    function normalizeEnding(value_6) {
        if (!value_6 || typeof value_6 !== 'object') return null;
        const title_2 = String(value_6.title || value_6.endingTitle || '').trim(),
            summary_2 = String(value_6.summary || value_6.text || '').trim();
        if (!title_2 || !summary_2) return null;
        return {
            id: String(value_6.id || 'ending-' + Date.now()),
            title: title_2,
            summary: summary_2,
            type: String(value_6.type || '普通结局').trim(),
            unlockedAt: Number(value_6.unlockedAt) || Date.now(),
        };
    }
    function normalizeCharacterProfiles_2(value_108, items_109, cast_2 = [], attributes_2 = []) {
        const items_112 = Array.isArray(value_108) ? value_108 : [],
            knownById = new Map(normalizeCast_2(cast_2).map((actor_3) => [actor_3.id, actor_3])),
            seenIds = new Set(),
            beatById = new Map(items_109.map((value_117) => [value_117.id, value_117]));
        return items_112.map((profile_2) => {
            if (!profile_2 || typeof profile_2 !== 'object') throw new Error('角色档案格式无效');
            const id_7 = String(profile_2.id || profile_2.characterId || '').trim(),
                triggerBeatId_2 = String(profile_2.triggerBeatId || '').trim(),
                name_3 = String(profile_2.name || '')
                    .trim()
                    .slice(0, 40),
                identity_2 = String(profile_2.identity || '')
                    .trim()
                    .slice(0, 80),
                occupation_2 = String(profile_2.occupation || '')
                    .trim()
                    .slice(0, 60),
                faction_2 = String(profile_2.faction || '')
                    .trim()
                    .slice(0, 60),
                persona_2 = String(profile_2.persona || '')
                    .trim()
                    .slice(0, 1000),
                triggerBeat = beatById.get(triggerBeatId_2);
            if (!id_7 || id_7 === 'user-current' || seenIds.has(id_7))
                throw new Error('角色档案 ID 缺失、重复或指向 User');
            if (knownById.get(id_7)?.type === 'user') throw new Error('角色档案不能指向 User');
            if (!triggerBeat) throw new Error('角色档案引用了无效的登场内容');
            if (!name_3 || !identity_2 || !occupation_2 || !faction_2 || !persona_2)
                throw new Error('角色档案缺少身份资料');
            if (triggerBeat.speakerId !== id_7 && !triggerBeat.text.includes(name_3))
                throw new Error('角色档案必须绑定角色实际登场的内容');
            if (typeof profile_2.companionEligible !== 'boolean')
                throw new Error('角色档案缺少同行资格');
            const triggerBeat_2 = knownById.get(id_7),
                initialAffinity_2 = Number(profile_2.initialAffinity);
            if (
                !triggerBeat_2 &&
                (!Number.isInteger(initialAffinity_2) ||
                    initialAffinity_2 < 30 ||
                    initialAffinity_2 > 70)
            )
                throw new Error('剧情新角色初始好感度必须为 30–70');
            return (
                seenIds.add(id_7),
                {
                    id: id_7,
                    triggerBeatId: triggerBeatId_2,
                    name: name_3,
                    identity: identity_2,
                    occupation: occupation_2,
                    faction: faction_2,
                    persona: persona_2,
                    characterAttributes: normalizeCharacterAttributes_2(
                        profile_2.attributes || profile_2.characterAttributes,
                        attributes_2,
                        {
                            strict: true,
                        },
                    ),
                    initialAffinity: triggerBeat_2 ? triggerBeat_2.affinity : initialAffinity_2,
                    companionEligible: profile_2.companionEligible,
                    isNew: !triggerBeat_2,
                }
            );
        });
    }
    function handleAction_16(items_129, profiles, value_131 = [], value_132 = {}) {
        const handleAction_8_133 = normalizeCast_2(value_131),
            allowedById = new Map(handleAction_8_133.map((value_136) => [value_136.id, value_136]));
        profiles.forEach((profile) => allowedById.set(profile.id, profile));
        const value_134 = new Set(profiles.map((value_137) => value_137.id)),
            aliases = new Set(['u', 'user', '玩家']);
        items_129.forEach((beat) => {
            if (beat.kind !== 'dialogue') return;
            if (!beat.speakerId) {
                const matching = [...allowedById.values()].filter(
                    (actor) => actor.name === beat.speakerName,
                );
                if (matching.length === 1) beat.speakerId = matching[0].id;
            }
            if (aliases.has(beat.speakerName.toLowerCase())) return;
            const actor_4 = allowedById.get(beat.speakerId);
            if (!actor_4) throw new Error('具名角色“' + beat.speakerName + '”缺少合法角色档案');
            if (
                value_132.requireComplete !== false &&
                actor_4.type !== 'user' &&
                actor_4.profileComplete === false &&
                !value_134.has(actor_4.id)
            )
                throw new Error('角色“' + actor_4.name + '”首次登场时缺少完整身份档案');
        });
    }
    function mergeCharacterProfiles_2(value_140, value_141, context = {}) {
        const handleAction_8_143 = normalizeCast_2(value_140),
            allowedById_2 = new Map(
                handleAction_8_143.map((value_145) => [value_145.id, value_145]),
            );
        return (
            (Array.isArray(value_141) ? value_141 : []).forEach((profile_3) => {
                const existing = allowedById_2.get(profile_3.id),
                    profileData = {
                        name: existing?.name || profile_3.name,
                        identity: profile_3.identity,
                        occupation: profile_3.occupation,
                        faction: profile_3.faction,
                        persona: existing?.persona || profile_3.persona,
                        characterAttributes: clone_3(profile_3.characterAttributes),
                        profileComplete: true,
                        companionEligible:
                            existing?.origin === 'setup' ? true : !!profile_3.companionEligible,
                        firstSeenAt: existing?.firstSeenAt || Number(context.seenAt) || Date.now(),
                        firstSeenSceneId:
                            existing?.firstSeenSceneId || String(context.sceneId || ''),
                    };
                if (existing) {
                    if (!existing.profileComplete) Object.assign(existing, profileData);
                    return;
                }
                const profile_4 = normalizeCast_2([
                    {
                        id: profile_3.id,
                        type: 'story',
                        origin: 'story',
                        avatar: '',
                        affinity: profile_3.initialAffinity,
                        acquainted: false,
                        ...profileData,
                    },
                ])[0];
                handleAction_8_143.push(profile_4);
                allowedById_2.set(profile_4.id, profile_4);
            }),
            handleAction_8_143
        );
    }
    function normalizeScenePayload_2(value_149, options_2 = {}) {
        const value_151 =
                typeof value_149 === 'string' ? cleanJsonText_2(value_149) : clone_3(value_149),
            source_3 = value_151 && typeof value_151 === 'object' ? value_151 : {},
            sceneSource =
                source_3.scene && typeof source_3.scene === 'object' ? source_3.scene : source_3,
            beats_2 = (Array.isArray(sceneSource.beats) ? sceneSource.beats : [])
                .map(handleAction_12)
                .filter(Boolean);
        if (!beats_2.length) throw new Error('剧情响应缺少有效的旁白或对话');
        const phase_2 =
                options_2.phase === 'prologue'
                    ? 'prologue'
                    : options_2.phase === 'epilogue'
                      ? 'epilogue'
                      : 'main',
            minimumBeats = phase_2 === 'prologue' ? 8 : 12,
            maximumBeats = phase_2 === 'prologue' ? 14 : 18;
        if (beats_2.length < minimumBeats || beats_2.length > maximumBeats)
            throw new Error(
                (phase_2 === 'prologue' ? '序章' : '主线或番外场景') +
                    '必须包含 ' +
                    minimumBeats +
                    '–' +
                    maximumBeats +
                    ' 条有效内容',
            );
        const characterProfiles_2 = normalizeCharacterProfiles_2(
            source_3.characterProfiles || sceneSource.characterProfiles,
            beats_2,
            options_2.cast,
            options_2.attributes,
        );
        handleAction_16(beats_2, characterProfiles_2, options_2.cast, {
            requireComplete: options_2.requireProfiles !== false,
        });
        const ending_2 = normalizeEnding(source_3.ending || sceneSource.ending);
        let choices_2 = (
            Array.isArray(source_3.choices)
                ? source_3.choices
                : Array.isArray(sceneSource.choices)
                  ? sceneSource.choices
                  : []
        )
            .map(normalizeChoice)
            .filter(Boolean)
            .slice(0, 4);
        if (phase_2 === 'prologue') choices_2 = [];
        if (phase_2 !== 'prologue' && !ending_2 && choices_2.length < 2)
            throw new Error('主场景至少需要两个有效选项');
        return {
            id: String(sceneSource.id || 'scene-' + Date.now()),
            title: String(
                sceneSource.title ||
                    source_3.title ||
                    (phase_2 === 'prologue' ? '序章' : '未命名场景'),
            ).trim(),
            phase: phase_2,
            beats: beats_2,
            characterProfiles: characterProfiles_2,
            choices: choices_2,
            outcome: normalizeOutcome_2(source_3.outcome || sceneSource.outcome),
            storySummary: String(source_3.storySummary || sceneSource.storySummary || '').trim(),
            ending: ending_2,
            createdAt: Date.now(),
        };
    }
    function normalizeMapPayload_2(value_161, options_3 = {}) {
        const parsed_2 =
                typeof value_161 === 'string' ? cleanJsonText_2(value_161) : clone_3(value_161),
            source_4 = parsed_2?.map && typeof parsed_2.map === 'object' ? parsed_2.map : parsed_2;
        if (!source_4 || typeof source_4 !== 'object') throw new Error('地图响应缺少 map 对象');
        const minimum_3 = options_3.manual ? 4 : 6,
            maximum = options_3.manual ? 12 : 10,
            inputNodes = Array.isArray(source_4.nodes) ? source_4.nodes.slice(0, maximum) : [],
            value_168 = new Set(),
            nodes_2 = inputNodes
                .map((node_2, index_2) => {
                    if (!node_2 || typeof node_2 !== 'object') return null;
                    const name_4 = String(node_2.name || '')
                            .trim()
                            .slice(0, 30),
                        description_2 = String(node_2.description || node_2.desc || '')
                            .trim()
                            .slice(0, 240);
                    if (!name_4 || !description_2) return null;
                    let id_14 = String(node_2.id || 'location-' + (index_2 + 1))
                        .trim()
                        .replace(/[^a-zA-Z0-9_-]/g, '-');
                    if (!id_14 || value_168.has(id_14)) id_14 = 'location-' + (index_2 + 1);
                    while (value_168.has(id_14)) id_14 = id_14 + '-' + (index_2 + 1);
                    return (
                        value_168.add(id_14),
                        {
                            id: id_14,
                            name: name_4,
                            description: description_2,
                            type: String(node_2.type || '剧情地点')
                                .trim()
                                .slice(0, 20),
                            icon:
                                String(node_2.icon || 'fa-map-marker-alt')
                                    .trim()
                                    .replace(/[^a-zA-Z0-9-]/g, '') || 'fa-map-marker-alt',
                            x: clampInt_2(node_2.x, 5, 95, 12 + (index_2 % 4) * 24),
                            y: clampInt_2(node_2.y, 8, 92, 18 + Math.floor(index_2 / 4) * 30),
                            focusAttributes: (Array.isArray(node_2.focusAttributes)
                                ? node_2.focusAttributes
                                : []
                            )
                                .map(String)
                                .map((id_8) => id_8.trim())
                                .filter(Boolean)
                                .slice(0, 4),
                            featuredCastIds: (Array.isArray(node_2.featuredCastIds)
                                ? node_2.featuredCastIds
                                : []
                            )
                                .map(String)
                                .map((id_9) => id_9.trim())
                                .filter(Boolean)
                                .slice(0, 4),
                        }
                    );
                })
                .filter(Boolean);
        if (nodes_2.length < minimum_3 || nodes_2.length > maximum)
            throw new Error('地图地点数量必须为 ' + minimum_3 + '–' + maximum + ' 个');
        const nodeIds = new Set(nodes_2.map((value_182) => value_182.id)),
            value_171 = new Set(),
            edges_2 = (Array.isArray(source_4.edges) ? source_4.edges : [])
                .map((edge_2) => {
                    const from_2 = String(edge_2?.from || '').trim(),
                        to_2 = String(edge_2?.to || '').trim();
                    if (!nodeIds.has(from_2) || !nodeIds.has(to_2) || from_2 === to_2) return null;
                    const key_3 = [from_2, to_2].sort().join('::');
                    if (value_171.has(key_3)) return null;
                    return (
                        value_171.add(key_3),
                        {
                            from: from_2,
                            to: to_2,
                        }
                    );
                })
                .filter(Boolean)
                .slice(0, 24);
        if (!edges_2.length) throw new Error('地图至少需要一条有效连线');
        const graph = nodes_2.reduce((result_4, node) => result_4.set(node.id, []), new Map());
        edges_2.forEach((edge) => {
            graph.get(edge.from).push(edge.to);
            graph.get(edge.to).push(edge.from);
        });
        const visited = new Set([nodes_2[0].id]),
            items_174 = [nodes_2[0].id];
        while (items_174.length) {
            const shift_188 = items_174.shift();
            graph.get(shift_188).forEach((value_189) => {
                !visited.has(value_189) && (visited.add(value_189), items_174.push(value_189));
            });
        }
        if (visited.size !== nodes_2.length) throw new Error('地图连线必须让所有地点保持连通');
        return {
            id: String(source_4.id || 'map-' + Date.now()),
            name:
                String(source_4.name || '故事地图')
                    .trim()
                    .slice(0, 40) || '故事地图',
            description: String(source_4.description || '')
                .trim()
                .slice(0, 320),
            nodes: nodes_2,
            edges: edges_2,
            updatedAt: Date.now(),
        };
    }
    function normalizeTrainingEventPayload_2(value_190, locationId_2 = '', options_4 = {}) {
        const parsed_3 =
                typeof value_190 === 'string' ? cleanJsonText_2(value_190) : clone_3(value_190),
            source_5 =
                parsed_3?.event && typeof parsed_3.event === 'object' ? parsed_3.event : parsed_3;
        if (!source_5 || typeof source_5 !== 'object')
            throw new Error('养成事件响应缺少 event 对象');
        const beats_3 = (Array.isArray(source_5.beats) ? source_5.beats : [])
            .map(handleAction_12)
            .filter(Boolean);
        if (beats_3.length < 3 || beats_3.length > 6)
            throw new Error('养成事件需要 3–6 条有效内容');
        const characterProfiles_3 = normalizeCharacterProfiles_2(
            source_5.characterProfiles,
            beats_3,
            options_4.cast,
            options_4.attributes,
        );
        handleAction_16(beats_3, characterProfiles_3, options_4.cast, {
            requireComplete: options_4.requireProfiles !== false,
        });
        const choices_3 = (Array.isArray(source_5.choices) ? source_5.choices : [])
            .slice(0, 2)
            .map((choice_3, value_199) => {
                const text_5 = String(choice_3?.text || '')
                    .trim()
                    .slice(0, 120);
                if (!text_5) return null;
                return {
                    id: String(choice_3.id || 'training-choice-' + (value_199 + 1)),
                    text: text_5,
                    outcome: normalizeTrainingOutcome_2(choice_3.outcome),
                };
            })
            .filter(Boolean);
        if (choices_3.length !== 2) throw new Error('养成事件必须包含两个有效选项');
        return {
            id: String(source_5.id || 'training-event-' + Date.now()),
            locationId: String(source_5.locationId || locationId_2),
            title: String(source_5.title || '地点事件')
                .trim()
                .slice(0, 60),
            summary: String(source_5.summary || '')
                .trim()
                .slice(0, 300),
            beats: beats_3,
            characterProfiles: characterProfiles_3,
            choices: choices_3,
            createdAt: Date.now(),
        };
    }
    function resolvePlayerSpeakerNames_2(value_201, cast_3) {
        const next = clone_3(value_201),
            player = (Array.isArray(cast_3) ? cast_3 : []).find(
                (actor_5) => actor_5?.type === 'user',
            );
        if (!next || !player?.name || !Array.isArray(next.beats)) return next;
        const aliases_2 = new Set(['u', 'user', '玩家']);
        return (
            (next.beats = next.beats.map((beat_3) => {
                if (beat_3?.kind !== 'dialogue') return beat_3;
                const speakerId_2 = String(beat_3.speakerId || '').toLowerCase(),
                    speakerName_3 = String(beat_3.speakerName || '').trim();
                if (
                    speakerId_2 === String(player.id || '').toLowerCase() ||
                    speakerId_2 === 'user-current' ||
                    aliases_2.has(speakerName_3.toLowerCase())
                )
                    return {
                        ...beat_3,
                        speakerId: player.id || 'user-current',
                        speakerName: player.name,
                    };
                return beat_3;
            })),
            next
        );
    }
    function getRequirementStatus_2(choice_4, attributes_3, cast_4) {
        const attributeValues = new Map(
                (Array.isArray(attributes_3) ? attributes_3 : []).map((item_7) => [
                    String(item_7.id),
                    clampInt_2(item_7.value, 0, 100, 0),
                ]),
            ),
            affinityValues = new Map(
                (Array.isArray(cast_4) ? cast_4 : []).map((item_8) => [
                    String(item_8.id),
                    clampInt_2(item_8.affinity, 0, 100, 0),
                ]),
            ),
            requirements_3 = choice_4?.requirements || {},
            missing_2 = [];
        return (
            Object.entries(requirements_3.attributes || {}).forEach(([id_10, minimum_4]) => {
                const current_2 = attributeValues.get(String(id_10)) ?? 0;
                if (current_2 < minimum_4)
                    missing_2.push({
                        kind: 'attribute',
                        id: String(id_10),
                        current: current_2,
                        minimum: minimum_4,
                    });
            }),
            Object.entries(requirements_3.affinities || {}).forEach(([id_11, minimum_5]) => {
                const current_3 = affinityValues.get(String(id_11)) ?? 0;
                if (current_3 < minimum_5)
                    missing_2.push({
                        kind: 'affinity',
                        id: String(id_11),
                        current: current_3,
                        minimum: minimum_5,
                    });
            }),
            {
                unlocked: missing_2.length === 0,
                missing: missing_2,
            }
        );
    }
    function ensureUnlockedChoice_2(choices_4, attributes_4, cast_5) {
        const list = clone_3(Array.isArray(choices_4) ? choices_4 : []);
        if (
            !list.length ||
            list.some((choice) => getRequirementStatus_2(choice, attributes_4, cast_5).unlocked)
        )
            return list;
        return (
            (list[0].requirements = {
                attributes: {},
                affinities: {},
            }),
            list
        );
    }
    function applyOutcome_2(value_229, value_230) {
        const next_2 = clone_3(value_229 || {}),
            normalized_2 = normalizeOutcome_2(value_230);
        next_2.attributes = normalizeAttributes_2(next_2.attributes, () => 0.5).map(
            (value_234) => ({
                ...value_234,
                value: clampInt_2(
                    value_234.value + (normalized_2.attributeDeltas[value_234.id] || 0),
                    0,
                    100,
                    value_234.value,
                ),
            }),
        );
        next_2.cast = normalizeCast_2(next_2.cast).map((value_235) =>
            value_235.type === 'user'
                ? value_235
                : {
                      ...value_235,
                      affinity: clampInt_2(
                          value_235.affinity + (normalized_2.affinityDeltas[value_235.id] || 0),
                          0,
                          100,
                          value_235.affinity,
                      ),
                  },
        );
        const flags_2 = new Set([
            ...(Array.isArray(next_2.flags) ? next_2.flags : []),
            ...normalized_2.flags,
        ]);
        next_2.flags = Array.from(flags_2).slice(-100);
        if (normalized_2.summary) next_2.storySummary = normalized_2.summary;
        return next_2;
    }
    function applyTrainingOutcome_2(value_236, value_237) {
        const next_3 = clone_3(value_236 || {}),
            normalized_3 = normalizeTrainingOutcome_2(value_237);
        return (
            (next_3.attributes = normalizeAttributes_2(next_3.attributes, () => 0.5).map(
                (value_240) => ({
                    ...value_240,
                    value: clampInt_2(
                        value_240.value + (normalized_3.attributeDeltas[value_240.id] || 0),
                        0,
                        100,
                        value_240.value,
                    ),
                }),
            )),
            (next_3.cast = normalizeCast_2(next_3.cast).map((value_241) =>
                value_241.type === 'user'
                    ? value_241
                    : {
                          ...value_241,
                          affinity: clampInt_2(
                              value_241.affinity + (normalized_3.affinityDeltas[value_241.id] || 0),
                              0,
                              100,
                              value_241.affinity,
                          ),
                      },
            )),
            (next_3.flags = Array.from(
                new Set([
                    ...(Array.isArray(next_3.flags) ? next_3.flags : []),
                    ...normalized_3.flags,
                ]),
            ).slice(-100)),
            next_3
        );
    }
    function createDefaultTraining_2() {
        return {
            day: 0,
            actionPoints: 0,
            cycleSceneNumber: null,
            map: null,
            companionId: '',
            familiarityByLocation: {},
            currentEvent: null,
            eventBeatIndex: 0,
            eventResult: null,
            eventLog: [],
            recentEventSummaries: [],
        };
    }
    function normalizeTrainingEventResult_2(value_7) {
        if (!value_7 || typeof value_7 !== 'object') return null;
        const normalizeChanges = (value_244) =>
            (Array.isArray(value_244) ? value_244 : [])
                .map((change) => {
                    if (!change || typeof change !== 'object') return null;
                    const id_12 = String(change.id || '').trim(),
                        name_5 = String(change.name || id_12)
                            .trim()
                            .slice(0, 40),
                        before_2 = clampInt_2(change.before, 0, 100, 0),
                        after_2 = clampInt_2(change.after, 0, 100, before_2);
                    if (!id_12 || !name_5 || before_2 === after_2) return null;
                    return {
                        id: id_12,
                        name: name_5,
                        before: before_2,
                        after: after_2,
                        delta: after_2 - before_2,
                    };
                })
                .filter(Boolean);
        return {
            eventId: String(value_7.eventId || ''),
            title: String(value_7.title || '行动结算')
                .trim()
                .slice(0, 60),
            choiceText: String(value_7.choiceText || '')
                .trim()
                .slice(0, 120),
            summary: String(value_7.summary || '')
                .trim()
                .slice(0, 300),
            attributeChanges: normalizeChanges(value_7.attributeChanges),
            affinityChanges: normalizeChanges(value_7.affinityChanges),
            flags: (Array.isArray(value_7.flags) ? value_7.flags : [])
                .map(String)
                .map((flag_2) => flag_2.trim().slice(0, 80))
                .filter(Boolean)
                .slice(-20),
            actionPoints: clampInt_2(value_7.actionPoints, 0, 3, 0),
            resolvedAt: Number(value_7.resolvedAt) || Date.now(),
        };
    }
    function normalizeTraining_2(value_251, cast_6 = [], attributes_5 = []) {
        const source_6 = value_251 && typeof value_251 === 'object' ? value_251 : {},
            defaults_2 = createDefaultTraining_2();
        let map_2 = null;
        if (source_6.map)
            try {
                map_2 = normalizeMapPayload_2(source_6.map, {
                    manual: true,
                });
            } catch (value_258) {
                map_2 = null;
            }
        let currentEvent_2 = null;
        if (source_6.currentEvent)
            try {
                currentEvent_2 = normalizeTrainingEventPayload_2(
                    source_6.currentEvent,
                    source_6.currentEvent.locationId,
                    {
                        cast: cast_6,
                        attributes: attributes_5,
                        requireProfiles: false,
                    },
                );
            } catch (value_259) {
                currentEvent_2 = null;
            }
        const familiarity =
            source_6.familiarityByLocation && typeof source_6.familiarityByLocation === 'object'
                ? source_6.familiarityByLocation
                : {};
        return {
            ...defaults_2,
            day: clampInt_2(source_6.day, 0, 999999, 0),
            actionPoints: clampInt_2(source_6.actionPoints, 0, 3, 0),
            cycleSceneNumber: Number.isInteger(source_6.cycleSceneNumber)
                ? source_6.cycleSceneNumber
                : null,
            map: map_2,
            companionId: String(source_6.companionId || ''),
            familiarityByLocation: Object.entries(familiarity).reduce(
                (result_5, [id_13, amount_3]) => {
                    return ((result_5[String(id_13)] = clampInt_2(amount_3, 0, 5, 0)), result_5);
                },
                {},
            ),
            currentEvent: currentEvent_2,
            eventBeatIndex: currentEvent_2
                ? clampInt_2(source_6.eventBeatIndex, 0, currentEvent_2.beats.length, 0)
                : 0,
            eventResult: normalizeTrainingEventResult_2(source_6.eventResult),
            eventLog: (Array.isArray(source_6.eventLog) ? source_6.eventLog : [])
                .map(clone_3)
                .filter(Boolean)
                .slice(-200),
            recentEventSummaries: (Array.isArray(source_6.recentEventSummaries)
                ? source_6.recentEventSummaries
                : []
            )
                .map(String)
                .map((text_6) => text_6.trim())
                .filter(Boolean)
                .slice(-12),
        };
    }
    function normalizeRun_2(value_264) {
        if (!value_264 || typeof value_264 !== 'object') return null;
        const run_2 = clone_3(value_264);
        run_2.attributes = normalizeAttributes_2(run_2.attributes, () => 0.5);
        run_2.cast = normalizeCast_2(run_2.cast);
        const cast_7 = run_2.cast;
        return (
            run_2.currentScene &&
                typeof run_2.currentScene === 'object' &&
                (run_2.currentScene = resolvePlayerSpeakerNames_2(run_2.currentScene, cast_7)),
            Array.isArray(run_2.storyLog) &&
                (run_2.storyLog = run_2.storyLog.map((entry) =>
                    entry && typeof entry === 'object'
                        ? resolvePlayerSpeakerNames_2(entry, cast_7)
                        : entry,
                )),
            (run_2.viewMode = run_2.viewMode === 'training' ? 'training' : 'story'),
            (run_2.storyReturnPoint =
                run_2.storyReturnPoint && typeof run_2.storyReturnPoint === 'object'
                    ? {
                          sceneId: String(
                              run_2.storyReturnPoint.sceneId || run_2.currentScene?.id || '',
                          ),
                          beatIndex: clampInt_2(
                              run_2.storyReturnPoint.beatIndex,
                              0,
                              Math.max(0, run_2.currentScene?.beats?.length || 0),
                              run_2.beatIndex || 0,
                          ),
                      }
                    : null),
            (run_2.training = normalizeTraining_2(run_2.training, cast_7, run_2.attributes)),
            (run_2.pendingIdentityCard =
                run_2.pendingIdentityCard && typeof run_2.pendingIdentityCard === 'object'
                    ? {
                          characterId: String(run_2.pendingIdentityCard.characterId || ''),
                          scope:
                              run_2.pendingIdentityCard.scope === 'training' ? 'training' : 'story',
                          scopeId: String(run_2.pendingIdentityCard.scopeId || ''),
                          beatIndex: clampInt_2(run_2.pendingIdentityCard.beatIndex, 0, 999999, 0),
                      }
                    : null),
            run_2.training.currentEvent &&
                (run_2.training.currentEvent = resolvePlayerSpeakerNames_2(
                    run_2.training.currentEvent,
                    cast_7,
                )),
            (run_2.training.eventLog = run_2.training.eventLog.map((entry_2) =>
                entry_2 && typeof entry_2 === 'object'
                    ? resolvePlayerSpeakerNames_2(entry_2, cast_7)
                    : entry_2,
            )),
            run_2
        );
    }
    function createEmptySaveSlots_2() {
        return {
            auto: null,
            manual: Array.from(
                {
                    length: MANUAL_SLOT_COUNT_2,
                },
                () => null,
            ),
        };
    }
    function normalizeSnapshot_2(snapshot) {
        if (!snapshot || typeof snapshot !== 'object') return null;
        const run_3 = normalizeRun_2(snapshot.run || snapshot);
        if (!run_3 || !run_3.id || !run_3.setup || !run_3.currentScene) return null;
        const beatIndex_2 = clampInt_2(
            run_3.beatIndex,
            0,
            Math.max(0, (run_3.currentScene.beats || []).length),
            0,
        );
        return (
            (run_3.beatIndex = beatIndex_2),
            {
                id: String(snapshot.id || 'save-' + Date.now()),
                title: String(snapshot.title || run_3.setup.title || '未命名游戏'),
                phase: String(run_3.phase || run_3.currentScene.phase || 'prologue'),
                sceneNumber: clampInt_2(run_3.sceneNumber, 0, 999999, 0),
                beatIndex: beatIndex_2,
                savedAt: Number(snapshot.savedAt) || Date.now(),
                run: run_3,
            }
        );
    }
    function normalizeSaveSlots_2(value_272) {
        const source = value_272 && typeof value_272 === 'object' ? value_272 : {},
            manual_2 = Array.from(
                {
                    length: MANUAL_SLOT_COUNT_2,
                },
                (_, index) => normalizeSnapshot_2(source.manual?.[index]),
            );
        return {
            auto: normalizeSnapshot_2(source.auto),
            manual: manual_2,
        };
    }
    function createDefaultState_2(value_274 = null) {
        return {
            schemaVersion: SCHEMA_VERSION_2,
            homeCatalog: value_274 && typeof value_274 === 'object' ? clone_3(value_274) : null,
            activeRun: null,
            saveSlots: createEmptySaveSlots_2(),
            mediaLibrary: {},
            unlockedEndings: [],
            uiSettings: {
                textSpeed: 'normal',
                reduceMotion: false,
            },
        };
    }
    function normalizeState_2(value_275, fallbackHomeCatalog = null) {
        const source_7 = value_275 && typeof value_275 === 'object' ? value_275 : {},
            version = Number(source_7.schemaVersion) || 1,
            migrated_2 = version !== SCHEMA_VERSION_2,
            defaults_3 = createDefaultState_2(source_7.homeCatalog || fallbackHomeCatalog),
            value_281 = version >= 2;
        return {
            state: {
                ...defaults_3,
                homeCatalog:
                    source_7.homeCatalog && typeof source_7.homeCatalog === 'object'
                        ? clone_3(source_7.homeCatalog)
                        : defaults_3.homeCatalog,
                activeRun: value_281 ? normalizeRun_2(source_7.activeRun) : null,
                saveSlots: value_281
                    ? normalizeSaveSlots_2(source_7.saveSlots)
                    : createEmptySaveSlots_2(),
                mediaLibrary:
                    source_7.mediaLibrary && typeof source_7.mediaLibrary === 'object'
                        ? Object.fromEntries(
                              Object.entries(source_7.mediaLibrary).filter(
                                  ([, value_282]) =>
                                      typeof value_282 === 'string' &&
                                      value_282.startsWith('data:'),
                              ),
                          )
                        : {},
                unlockedEndings: (Array.isArray(source_7.unlockedEndings)
                    ? source_7.unlockedEndings
                    : []
                )
                    .map(normalizeEnding)
                    .filter(Boolean),
                uiSettings: {
                    textSpeed: ['slow', 'normal', 'fast'].includes(source_7.uiSettings?.textSpeed)
                        ? source_7.uiSettings.textSpeed
                        : 'normal',
                    reduceMotion: !!source_7.uiSettings?.reduceMotion,
                },
            },
            migrated: migrated_2,
        };
    }
    return {
        SCHEMA_VERSION: SCHEMA_VERSION_2,
        MANUAL_SLOT_COUNT: MANUAL_SLOT_COUNT_2,
        DEFAULT_ATTRIBUTES: DEFAULT_ATTRIBUTES_2,
        clone: clone_3,
        clampInt: clampInt_2,
        randomAttributeValue: randomAttributeValue_2,
        createDefaultAttributes: createDefaultAttributes_2,
        normalizeAttributes: normalizeAttributes_2,
        normalizeCharacterAttributes: normalizeCharacterAttributes_2,
        normalizeCast: normalizeCast_2,
        cleanJsonText: cleanJsonText_2,
        normalizeOutcome: normalizeOutcome_2,
        normalizeTrainingOutcome: normalizeTrainingOutcome_2,
        normalizeScenePayload: normalizeScenePayload_2,
        normalizeMapPayload: normalizeMapPayload_2,
        normalizeTrainingEventPayload: normalizeTrainingEventPayload_2,
        normalizeCharacterProfiles: normalizeCharacterProfiles_2,
        mergeCharacterProfiles: mergeCharacterProfiles_2,
        resolvePlayerSpeakerNames: resolvePlayerSpeakerNames_2,
        getRequirementStatus: getRequirementStatus_2,
        ensureUnlockedChoice: ensureUnlockedChoice_2,
        applyOutcome: applyOutcome_2,
        applyTrainingOutcome: applyTrainingOutcome_2,
        createDefaultTraining: createDefaultTraining_2,
        normalizeTrainingEventResult: normalizeTrainingEventResult_2,
        normalizeTraining: normalizeTraining_2,
        normalizeRun: normalizeRun_2,
        createEmptySaveSlots: createEmptySaveSlots_2,
        normalizeSaveSlots: normalizeSaveSlots_2,
        normalizeSnapshot: normalizeSnapshot_2,
        createDefaultState: createDefaultState_2,
        normalizeState: normalizeState_2,
    };
});
