(function initImessageWeatherContext(value_2, value_3) {
    const imWeatherContext_2 = value_3();
    if (typeof module === 'object' && module.exports) module.exports = imWeatherContext_2;
    if (typeof window !== 'undefined') window.imWeatherContext = imWeatherContext_2;
    else {
        if (value_2) value_2.imWeatherContext = imWeatherContext_2;
    }
})(typeof globalThis !== 'undefined' ? globalThis : null, function createImessageWeatherContext() {
    const WEATHER_TTL_MS_2 = 900000,
        count_5 = 86400000,
        value_6 = new Map(),
        value_7 = new Map(),
        options = {
            0: '晴',
            1: '大致晴朗',
            2: '局部多云',
            3: '阴',
            45: '有雾',
            48: '雾凇',
            51: '小毛毛雨',
            53: '毛毛雨',
            55: '强毛毛雨',
            56: '冻毛毛雨',
            57: '强冻毛毛雨',
            61: '小雨',
            63: '中雨',
            65: '大雨',
            66: '冻雨',
            67: '强冻雨',
            71: '小雪',
            73: '中雪',
            75: '大雪',
            77: '雪粒',
            80: '小阵雨',
            81: '阵雨',
            82: '强阵雨',
            85: '小阵雪',
            86: '强阵雪',
            95: '雷雨',
            96: '雷雨伴冰雹',
            99: '强雷雨伴冰雹',
        },
        value_8 = (value_15) =>
            String(value_15 || '')
                .trim()
                .toLowerCase()
                .replace(/[\s,，·.\-]/g, ''),
        value_9 = (value_16) => value_8(value_16).replace(/(市|city)$/u, '');
    function countryMatches_2(value_17, value_18) {
        const value_8_19 = value_8(value_17);
        if (!value_8_19) return false;
        const toUpperCase_20 = String(value_18?.country_code || '').toUpperCase(),
            items = [value_18?.country, toUpperCase_20];
        if (toUpperCase_20 && typeof Intl?.DisplayNames === 'function')
            for (const value_21 of ['zh', 'en']) {
                try {
                    items.push(
                        new Intl.DisplayNames([value_21], {
                            type: 'region',
                        }).of(toUpperCase_20),
                    );
                } catch (value_22) {}
            }
        return items.some((value_23) => value_8(value_23) === value_8_19);
    }
    async function handleAction_11(value_24, value_25, value_26) {
        const value_27 = new AbortController(),
            setTimeout_28 = setTimeout(() => value_27.abort(), value_26);
        try {
            const value_29 = await value_25(value_24, {
                signal: value_27.signal,
            });
            if (!value_29.ok) throw new Error('Weather HTTP ' + value_29.status);
            return await value_29.json();
        } finally {
            clearTimeout(setTimeout_28);
        }
    }
    async function handleAction_12(value_30, value_31, value_32, value_33, at_2, value_35) {
        const value_36 = value_8(value_30) + '|' + value_8(value_31),
            result = value_7.get(value_36);
        if (result && at_2 - result.at < count_5) return result.value;
        const value_37 = async (value_48, value_49) => {
            const value_50 = new URL('https://geocoding-api.open-meteo.com/v1/search');
            return (
                value_50.searchParams.set('name', value_48),
                value_50.searchParams.set('count', '10'),
                value_50.searchParams.set('language', value_49),
                (await handleAction_11(value_50.toString(), value_33, value_35))?.results || []
            );
        };
        let value_38 = value_31,
            items_39 = await value_37(value_31 + ', ' + value_30, 'zh'),
            filter_40 = items_39.filter(
                (value_51) =>
                    countryMatches_2(value_30, value_51) &&
                    Number.isFinite(value_51.latitude) &&
                    Number.isFinite(value_51.longitude),
            );
        filter_40.length === 0 &&
            value_32?.includes('/') &&
            ((value_38 = value_32.split('/').pop().replace(/_/g, ' ')),
            (items_39 = await value_37(value_38, 'en')),
            (filter_40 = items_39.filter(
                (value_52) =>
                    countryMatches_2(value_30, value_52) &&
                    value_52.timezone === value_32 &&
                    Number.isFinite(value_52.latitude) &&
                    Number.isFinite(value_52.longitude),
            )));
        const filter_41 = filter_40.filter(
                (value_53) => value_9(value_53.name) === value_9(value_38),
            ),
            sort_42 = filter_41
                .slice()
                .sort(
                    (value_54, value_55) =>
                        (Number(value_55.population) || 0) - (Number(value_54.population) || 0),
                ),
            value_43 = Number(sort_42[0]?.population) || 0,
            value_44 = Number(sort_42[1]?.population) || 0,
            value_45 =
                sort_42.length > 1 && value_43 >= 100000 && value_43 >= Math.max(1, value_44) * 5
                    ? sort_42[0]
                    : null,
            value_46 =
                filter_41.length === 1
                    ? filter_41[0]
                    : value_45 || (filter_40.length === 1 ? filter_40[0] : null),
            value_4 = value_46
                ? {
                      latitude: value_46.latitude,
                      longitude: value_46.longitude,
                  }
                : null;
        return (
            value_7.set(value_36, {
                at: at_2,
                value: value_4,
            }),
            value_4
        );
    }
    async function handleAction_13(value_56, value_57) {
        const trim_58 = String(value_56?.country || '').trim(),
            trim_59 = String(value_56?.city || '').trim();
        if (!trim_58 || !trim_59) return null;
        const at_3 = value_57.now(),
            value_61 = value_8(trim_58) + '|' + value_8(trim_59),
            result_62 = value_6.get(value_61);
        if (result_62 && at_3 - result_62.at < WEATHER_TTL_MS_2) return result_62.value;
        const value_63 = await handleAction_12(
            trim_58,
            trim_59,
            value_56?.timeZone,
            value_57.fetcher,
            at_3,
            value_57.timeoutMs,
        );
        if (!value_63) return null;
        const value_64 = new URL('https://api.open-meteo.com/v1/forecast');
        value_64.searchParams.set('latitude', String(value_63.latitude));
        value_64.searchParams.set('longitude', String(value_63.longitude));
        value_64.searchParams.set('current', 'temperature_2m,precipitation,weather_code');
        value_64.searchParams.set('timezone', 'auto');
        const current_65 = (
                await handleAction_11(value_64.toString(), value_57.fetcher, value_57.timeoutMs)
            )?.current,
            number = Number(current_65?.temperature_2m),
            number_66 = Number(current_65?.precipitation),
            value_67 = options[current_65?.weather_code];
        if (!value_67 || !Number.isFinite(number) || !Number.isFinite(number_66)) return null;
        const value_5 =
            value_67 +
            '，' +
            Math.round(number) +
            '°C，近一小时降水 ' +
            Math.max(0, number_66) +
            ' mm';
        return (
            value_6.set(value_61, {
                at: at_3,
                value: value_5,
            }),
            value_5
        );
    }
    async function getWeatherPrompt_2(value_69, value_70 = {}) {
        if (value_69?.weatherAwareEnabled !== true) return '';
        const { char: char_2, user: user_2 } = value_69;
        if (!char_2?.country || !char_2?.city || !user_2?.country || !user_2?.city) return '';
        const options_73 = {
            fetcher: value_70.fetcher || (typeof fetch === 'function' ? fetch : null),
            now: value_70.now || Date.now,
            timeoutMs: value_70.timeoutMs || 4000,
        };
        if (!options_73.fetcher) return '';
        const [value_74, value_75] = await Promise.allSettled([
                handleAction_13(char_2, options_73),
                handleAction_13(user_2, options_73),
            ]),
            items_76 = [];
        if (value_74.status === 'fulfilled' && value_74.value)
            items_76.push('Char 所在地（' + char_2.city + '）：' + value_74.value);
        if (value_75.status === 'fulfilled' && value_75.value)
            items_76.push('User 所在地（' + user_2.city + '）：' + value_75.value);
        return items_76.length
            ? `
【实时天气背景】
- ` +
                  items_76.join(`
- `) +
                  `
- 天气仅作当前背景，按语境自然使用，不要每轮机械提及，也不要推断缺失地点的天气。`
            : '';
    }
    return {
        getWeatherPrompt: getWeatherPrompt_2,
        countryMatches: countryMatches_2,
        WEATHER_TTL_MS: WEATHER_TTL_MS_2,
    };
});
