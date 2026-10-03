(function () {
    'use strict';

    const DESCRIPTION_LIMIT_2 = 300;
    function safeImageUrl_2(value) {
        const trim_14 = String(value || '').trim();
        return /^(?:https?:\/\/|data:image\/|blob:|assets\/)/i.test(trim_14) ? trim_14 : '';
    }
    function handleAction_3(value_15) {
        let count_16 = 2166136261;
        const string = String(value_15 || '');
        for (let count_17 = 0; count_17 < string.length; count_17 += 1) {
            count_16 ^= string.charCodeAt(count_17);
            count_16 = Math.imul(count_16, 16777619);
        }
        return (count_16 >>> 0).toString(36);
    }
    function createPhotoId_2(value_18, value_19 = {}, value_20 = 0) {
        const trim_21 = String(value_19.id || '').trim();
        if (/^[a-zA-Z0-9_-]{6,160}$/.test(trim_21)) return trim_21;
        const string_22 = String(
            value_19.assetId ||
                value_19.sourceMessageId ||
                value_19.url ||
                (value_19.addedAt || 0) + ':' + value_20,
        );
        return 'gallery_' + handleAction_3(String(value_18 || '') + '|' + string_22);
    }
    function normalizeAlbumPhotos_2(value_23) {
        const string_24 = String(value_23?.id || '');
        return (Array.isArray(value_23?.galleryAlbumImages) ? value_23.galleryAlbumImages : [])
            .map((url_2, index_2) => {
                const value_27 =
                        typeof url_2 === 'string'
                            ? {
                                  url: url_2,
                              }
                            : url_2 && typeof url_2 === 'object'
                              ? url_2
                              : {},
                    url_3 = safeImageUrl_2(value_27.url),
                    assetId_2 = String(value_27.assetId || '');
                if (!url_3 && !assetId_2) return null;
                return {
                    id: createPhotoId_2(string_24, value_27, index_2),
                    url: url_3,
                    assetId: assetId_2,
                    description: String(value_27.description || '')
                        .trim()
                        .slice(0, DESCRIPTION_LIMIT_2),
                    addedAt: Math.max(0, Number(value_27.addedAt) || 0),
                    sourceFriendId: String(value_27.sourceFriendId || ''),
                    sourceMessageId: String(value_27.sourceMessageId || ''),
                    index: index_2,
                };
            })
            .filter((value_30) => value_30 && value_30.url)
            .sort(
                (value_31, value_32) =>
                    value_32.addedAt - value_31.addedAt || value_32.index - value_31.index,
            );
    }
    function serializeAlbumPhotos_2(value_33, value_34) {
        return (Array.isArray(value_34) ? value_34 : [])
            .slice(0, 100)
            .map((value_35, value_36) => ({
                id: createPhotoId_2(value_33, value_35, value_36),
                url: /^https?:\/\//i.test(value_35?.url || '') ? String(value_35.url) : '',
                ...(value_35?.assetId
                    ? {
                          assetId: String(value_35.assetId),
                      }
                    : {}),
                description: String(value_35?.description || '')
                    .trim()
                    .slice(0, DESCRIPTION_LIMIT_2),
                addedAt: Math.max(0, Number(value_35?.addedAt) || 0),
                ...(value_35?.sourceFriendId
                    ? {
                          sourceFriendId: String(value_35.sourceFriendId),
                      }
                    : {}),
                ...(value_35?.sourceMessageId
                    ? {
                          sourceMessageId: String(value_35.sourceMessageId),
                      }
                    : {}),
            }));
    }
    function handleAction_7(message) {
        if (!message || message.role !== 'user' || message.type === 'image') return '';
        return [message.content, message.text, message.description]
            .map((value_37) => String(value_37 || '').trim())
            .filter(Boolean)
            .join(
                `
`,
            )
            .slice(0, 1000);
    }
    function classifyAvatarRequest_2(value_38) {
        const text_2 = typeof value_38 === 'string' ? value_38.trim() : handleAction_7(value_38);
        if (!text_2) return null;
        const toLowerCase_40 = text_2
                .replace(/[\s，。！？、,.!?:：；;“”"'（）()【】\[\]-]/g, '')
                .toLowerCase(),
            test_41 = /头像|profilepicture|profilepic|pfp|avatar/i.test(toLowerCase_40),
            test_42 =
                /换|更换|换成|改|改成|设|设置|用|选|挑|change|switch|set|use|choose|pick/i.test(
                    toLowerCase_40,
                );
        if (!test_41 || !test_42) return null;
        const test_43 =
                /要不要|想不想|愿不愿意|考不考虑|需不需要|可不可以|可以吗|好吗|怎么样|是否|wouldyou|doyouwant|couldyou/i.test(
                    toLowerCase_40,
                ),
            ordinal_2 = handleAction_9(text_2),
            test_45 = /最新|最近|最早|最旧|第一张|最后一张|newest|latest|oldest|first|last/i.test(
                text_2,
            ),
            test_46 =
                /这张|那张|某张|照片里|相册里|图库里|穿|戴|拿|背景|衣服|颜色|发型|表情|场景|photo|picture|image/i.test(
                    text_2,
                ),
            replace_47 = toLowerCase_40
                .replace(/profilepicture|profilepic|avatar|pfp|头像/g, '')
                .replace(
                    /更换|换成|改成|设置|换|改|设|用|选|挑|change|switch|set|use|choose|pick/g,
                    '',
                )
                .replace(/一下|一个|个|吧|嘛|呢|请|帮我|给我|你的|自己|please/g, ''),
            specified_2 = !!ordinal_2 || test_45 || test_46 || replace_47.length >= 4;
        return {
            text: text_2,
            mode: test_43 ? 'optional' : 'required',
            specified: specified_2,
            ordinal: ordinal_2,
        };
    }
    function handleAction_9(value_49) {
        const string_50 = String(value_49 || ''),
            match_51 = string_50.match(/第\s*(\d{1,3})\s*张/);
        if (match_51) return Math.max(1, Number(match_51[1]) || 1);
        const options = {
                一: 1,
                二: 2,
                两: 2,
                三: 3,
                四: 4,
                五: 5,
                六: 6,
                七: 7,
                八: 8,
                九: 9,
                十: 10,
            },
            match_52 = string_50.match(/第\s*([一二两三四五六七八九十])\s*张/);
        return match_52 ? options[match_52[1]] : null;
    }
    function handleAction_10(value_53) {
        const trim_54 = String(value_53 || '')
                .toLocaleLowerCase('zh-CN')
                .replace(
                    /头像|更换|换成|改成|设置|图库|相册|照片|图片|这张|那张|一个|一下|帮我|你的|自己|profile|picture|avatar|photo|image|change|switch|choose|pick/g,
                    ' ',
                )
                .replace(/[^\p{L}\p{N}]+/gu, ' ')
                .trim(),
            value_55 = new Set(trim_54.split(/\s+/).filter((value_57) => value_57.length >= 2)),
            replace_56 = trim_54.replace(/\s+/g, '');
        for (let count_58 = 0; count_58 < replace_56.length - 1; count_58 += 1)
            value_55.add(replace_56.slice(count_58, count_58 + 2));
        return (
            Array.from(replace_56).forEach((value_59) => {
                if (/\p{Script=Han}/u.test(value_59) && !/[的了把给请张个]/.test(value_59))
                    value_55.add(value_59);
            }),
            Array.from(value_55).slice(0, 30)
        );
    }
    function handleAction_11(items, value_60) {
        const handleAction_10_61 = handleAction_10(value_60.text);
        return items
            .map((photo_2, index_3) => {
                const toLocaleLowerCase_64 = (
                        photo_2.description +
                        ' ' +
                        (index_3 + 1)
                    ).toLocaleLowerCase('zh-CN'),
                    score_2 = handleAction_10_61.reduce(
                        (value_66, value_67) =>
                            value_66 +
                            (toLocaleLowerCase_64.includes(value_67)
                                ? Math.max(2, value_67.length)
                                : 0),
                        0,
                    );
                return {
                    photo: photo_2,
                    index: index_3,
                    score: score_2,
                };
            })
            .sort(
                (value_68, value_69) =>
                    value_69.score - value_68.score || value_68.index - value_69.index,
            );
    }
    function buildAvatarCatalog_2(value_70, value_71) {
        if (!value_70 || value_70.type !== 'char') return null;
        const request_2 = classifyAvatarRequest_2(value_71);
        if (!request_2) return null;
        const handleAction_5_73 = normalizeAlbumPhotos_2(value_70);
        let items_74 = [];
        if (!request_2.specified) items_74 = handleAction_5_73.slice(0, 20);
        else {
            const items_77 = [];
            if (request_2.ordinal && handleAction_5_73[request_2.ordinal - 1])
                items_77.push(handleAction_5_73[request_2.ordinal - 1]);
            if (/最早|最旧|oldest/i.test(request_2.text) && handleAction_5_73.length)
                items_77.push(handleAction_5_73[handleAction_5_73.length - 1]);
            if (/最新|最近|newest|latest/i.test(request_2.text) && handleAction_5_73.length)
                items_77.push(handleAction_5_73[0]);
            items_74 = [
                ...items_77,
                ...handleAction_11(handleAction_5_73, request_2)
                    .slice(0, 20)
                    .map((value_78) => value_78.photo),
                ...handleAction_5_73.slice(0, 10),
            ];
        }
        const value_75 = new Set(),
            catalog_2 = items_74
                .filter((value_79) => {
                    if (!value_79 || value_75.has(value_79.id)) return false;
                    return (value_75.add(value_79.id), true);
                })
                .slice(0, 30)
                .map((value_80) => ({
                    photoId: value_80.id,
                    position:
                        handleAction_5_73.findIndex((value_81) => value_81.id === value_80.id) + 1,
                    description: value_80.description,
                    addedAt: value_80.addedAt,
                    current: String(value_70.avatarUpdatedFromGalleryPhotoId || '') === value_80.id,
                }));
        return {
            request: request_2,
            catalog: catalog_2,
            total: handleAction_5_73.length,
        };
    }
    function resolveAlbumPhoto_2(value_82, value_83) {
        const trim_84 = String(value_83 || '').trim();
        if (!trim_84 || value_82?.type !== 'char') return null;
        return normalizeAlbumPhotos_2(value_82).find((value_85) => value_85.id === trim_84) || null;
    }
    window.galleryData = Object.freeze({
        DESCRIPTION_LIMIT: DESCRIPTION_LIMIT_2,
        safeImageUrl: safeImageUrl_2,
        createPhotoId: createPhotoId_2,
        normalizeAlbumPhotos: normalizeAlbumPhotos_2,
        serializeAlbumPhotos: serializeAlbumPhotos_2,
        classifyAvatarRequest: classifyAvatarRequest_2,
        buildAvatarCatalog: buildAvatarCatalog_2,
        resolveAlbumPhoto: resolveAlbumPhoto_2,
    });
})();
