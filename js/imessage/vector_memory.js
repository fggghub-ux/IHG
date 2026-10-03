(function () {
    const RECALL_LIMIT_2 = 4,
        EMBEDDING_REQUEST_TIMEOUT_MS_2 = 15000,
        EMBEDDING_BATCH_SIZE = 16,
        FALLBACK_PROVIDERS = Object.freeze({
            siliconflow: {
                label: 'SiliconFlow',
                endpoint: 'https://api.siliconflow.cn/v1/embeddings',
                defaultModel: 'BAAI/bge-m3',
                models: ['BAAI/bge-m3', 'BAAI/bge-large-zh-v1.5'],
            },
            openai: {
                label: 'OpenAI',
                endpoint: 'https://api.openai.com/v1/embeddings',
                defaultModel: 'text-embedding-3-small',
                models: ['text-embedding-3-small', 'text-embedding-3-large'],
            },
            dashscope: {
                label: 'DashScope',
                endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings',
                defaultModel: 'text-embedding-v4',
                models: ['text-embedding-v4', 'text-embedding-v3'],
            },
            zhipu: {
                label: 'Zhipu AI',
                endpoint: 'https://open.bigmodel.cn/api/paas/v4/embeddings',
                defaultModel: 'embedding-3',
                models: ['embedding-3', 'embedding-2'],
            },
            'openai-compatible': {
                label: 'OpenAI Compatible',
                endpoint: '',
                defaultModel: '',
                models: [],
            },
        }),
        fallbackIndex = new Map();
    let indexQueue = Promise.resolve(),
        syncStatus = {
            phase: 'idle',
            message: '',
            completed: 0,
            total: 0,
            updatedAt: 0,
        };
    function getProviderRegistry() {
        const providers = window.u2Api?.VECTOR_MEMORY_PROVIDERS;
        return providers && typeof providers === 'object' ? providers : FALLBACK_PROVIDERS;
    }
    function getProviderMeta(provider_2) {
        const registry = getProviderRegistry();
        return registry[provider_2] || registry.siliconflow || FALLBACK_PROVIDERS.siliconflow;
    }
    function normalizeConfig_2(config_2) {
        if (window.imApp?.normalizeVectorMemoryConfig)
            return window.imApp.normalizeVectorMemoryConfig(config_2);
        if (window.u2Api?.normalizeVectorMemoryConfig)
            return window.u2Api.normalizeVectorMemoryConfig(config_2);
        const source_2 = config_2 && typeof config_2 === 'object' ? config_2 : {},
            provider_3 = Object.prototype.hasOwnProperty.call(
                getProviderRegistry(),
                String(source_2.provider || '').trim(),
            )
                ? String(source_2.provider).trim()
                : 'siliconflow',
            meta = getProviderMeta(provider_3);
        let endpoint_2 = String(source_2.endpoint || '')
            .trim()
            .replace(/\/+$/, '');
        try {
            if (endpoint_2) endpoint_2 = new URL(endpoint_2).toString().replace(/\/+$/, '');
        } catch (value_34) {
            endpoint_2 = '';
        }
        return {
            enabled: source_2.enabled === true,
            provider: provider_3,
            endpoint: provider_3 === 'openai-compatible' ? endpoint_2 : '',
            apiKey: String(source_2.apiKey || '').trim(),
            model: String(source_2.model || meta.defaultModel || '').trim(),
        };
    }
    function getGlobalConfig_2() {
        return normalizeConfig_2(
            window.getVectorMemoryConfig?.() || window.vectorMemoryConfig || {},
        );
    }
    function getEmbeddingEndpoint_2(value_35) {
        const normalized_2 = normalizeConfig_2(value_35),
            provider_4 = getProviderMeta(normalized_2.provider);
        return String(
            normalized_2.provider === 'openai-compatible'
                ? normalized_2.endpoint
                : provider_4.endpoint || '',
        )
            .trim()
            .replace(/\/+$/, '');
    }
    function isConfigured(config) {
        const normalized = normalizeConfig_2(config);
        return !!(
            normalized.enabled &&
            normalized.apiKey &&
            normalized.model &&
            getEmbeddingEndpoint_2(normalized)
        );
    }
    function getFriend(friendOrId) {
        if (window.imApp?.getFriendById) return window.imApp.getFriendById(friendOrId);
        const id_2 = typeof friendOrId === 'object' ? friendOrId?.id : friendOrId;
        return (
            (window.imData?.friends || []).find(
                (friend_2) => String(friend_2?.id) === String(id_2),
            ) || null
        );
    }
    function getMemory(friendOrId_2) {
        const source_3 =
                getFriend(friendOrId_2) ||
                (typeof friendOrId_2 === 'object' ? friendOrId_2 : null) ||
                {},
            value_41 = window.imApp?.normalizeFriendData
                ? window.imApp.normalizeFriendData(source_3)
                : source_3;
        return {
            friend: value_41,
            memory: value_41.memory || {},
        };
    }
    function getAccountId() {
        const accountId_2 = window.getCurrentAccountId?.();
        return String(accountId_2 == null || accountId_2 === '' ? 'default' : accountId_2);
    }
    function getConfigFingerprint_2(config_3) {
        const normalized_3 = normalizeConfig_2(config_3);
        return [normalized_3.provider, getEmbeddingEndpoint_2(normalized_3), normalized_3.model]
            .map((value_2) => String(value_2 || '').trim())
            .join('|');
    }
    function getScopeKey(value_46) {
        return getAccountId() + '|' + getConfigFingerprint_2(value_46);
    }
    function getScopeFriendKey(value_47, value_48) {
        return getScopeKey(value_47) + '|' + String(value_48 || '');
    }
    function getMemoryKindForCollection_2(collection_2) {
        if (collection_2 === 'shortTermEntries') return 'short';
        if (collection_2 === 'cherishedEntries') return 'cherished';
        return 'long';
    }
    function getVectorRecordId_2(friendId_2, kind_2, entryId_2, config_4 = getGlobalConfig_2()) {
        return [
            'u2-vector',
            encodeURIComponent(getAccountId()),
            encodeURIComponent(getConfigFingerprint_2(config_4)),
            encodeURIComponent(String(friendId_2 || '')),
            encodeURIComponent(String(kind_2 || '')),
            encodeURIComponent(String(entryId_2 || '')),
        ].join(':');
    }
    function getEntryTags(kind_3, entry_2) {
        const source =
            kind_3 === 'short'
                ? entry_2?.memoryTags || entry_2?.triggerKeywords || []
                : entry_2?.triggerKeywords || entry_2?.memoryTags || [];
        return (Array.isArray(source) ? source : [source])
            .map((value_3) => String(value_3 || '').trim())
            .filter(Boolean)
            .slice(0, 12);
    }
    function getEntryContent_2(kind_4, entry_3) {
        const pieces = [
            entry_3?.title ? 'Title: ' + entry_3.title : '',
            entry_3?.time || entry_3?.createdAt
                ? 'Time: ' + (entry_3.time || entry_3.createdAt)
                : '',
            kind_4 === 'short' ? entry_3?.event || entry_3?.content || '' : entry_3?.content || '',
            entry_3?.memoryPoints ? 'Memory points: ' + entry_3.memoryPoints : '',
            entry_3?.detail ? 'Details: ' + entry_3.detail : '',
            entry_3?.reason ? 'Reason: ' + entry_3.reason : '',
            getEntryTags(kind_4, entry_3).length > 0
                ? 'Tags: ' + getEntryTags(kind_4, entry_3).join(', ')
                : '',
        ];
        return pieces
            .filter(Boolean)
            .join(
                `
`,
            )
            .trim();
    }
    function listIndexableEntries_2(friendOrId_3) {
        const { friend: friend_3, memory: memory_2 } = getMemory(friendOrId_3);
        if (!friend_3?.id) return [];
        const isGroup = friend_3.type === 'group',
            entries = [],
            appendEntries = (kind_5, source_4) => {
                (Array.isArray(source_4) ? source_4 : []).forEach((entry_4) => {
                    if (!entry_4?.id) return;
                    const content_2 = getEntryContent_2(kind_5, entry_4);
                    if (content_2)
                        entries.push({
                            kind: kind_5,
                            entry: entry_4,
                            content: content_2,
                        });
                });
            };
        appendEntries('short', memory_2.shortTermEntries);
        appendEntries(
            'long',
            isGroup
                ? Array.isArray(memory_2.longTermEntries)
                    ? memory_2.longTermEntries.filter(
                          (entry_5) => String(entry_5?.sourceType || '') === 'manual',
                      )
                    : []
                : memory_2.longTermEntries,
        );
        if (!isGroup) appendEntries('cherished', memory_2.cherishedEntries);
        return entries;
    }
    function createContentHash(value_4) {
        const text_2 = String(value_4 || '');
        let hash = 2166136261;
        for (let index_2 = 0; index_2 < text_2.length; index_2 += 1) {
            hash ^= text_2.charCodeAt(index_2);
            hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0).toString(36);
    }
    function createIndexRecord_2(value_73, item_2, embedding_2, config_6 = getGlobalConfig_2()) {
        const { friend: friend_4 } = getMemory(value_73),
            kind_6 = item_2?.kind,
            entry_6 = item_2?.entry || {},
            value_80 = Array.isArray(embedding_2) ? embedding_2.map(Number) : [];
        if (
            !friend_4?.id ||
            !kind_6 ||
            !entry_6.id ||
            value_80.length === 0 ||
            value_80.some((value_5) => !Number.isFinite(value_5))
        )
            return null;
        const fingerprint_2 = getConfigFingerprint_2(config_6);
        return {
            id: getVectorRecordId_2(friend_4.id, kind_6, entry_6.id, config_6),
            scopeKey: getScopeKey(config_6),
            scopeFriendKey: getScopeFriendKey(config_6, friend_4.id),
            accountId: getAccountId(),
            friendId: String(friend_4.id),
            kind: kind_6,
            entryId: String(entry_6.id),
            contentHash: createContentHash(item_2.content),
            fingerprint: fingerprint_2,
            embedding: value_80,
            updatedAt: Date.now(),
        };
    }
    function enqueueIndexTask(task) {
        const result_2 = indexQueue.then(task, task);
        return ((indexQueue = result_2['catch'](() => undefined)), result_2);
    }
    function emitStatus(patch) {
        return (
            (syncStatus = {
                ...syncStatus,
                ...patch,
                updatedAt: Date.now(),
            }),
            typeof window.CustomEvent === 'function' &&
                typeof window.dispatchEvent === 'function' &&
                window.dispatchEvent(
                    new window.CustomEvent('u2:vector-memory-status', {
                        detail: {
                            ...syncStatus,
                        },
                    }),
                ),
            syncStatus
        );
    }
    function getStatus_2() {
        return {
            ...syncStatus,
        };
    }
    function getProviderRegistry_2() {
        const storage_2 = window.appStorage,
            storeName_2 = storage_2?.STORES?.vectorMemoryIndex;
        return storage_2?.withStore && storage_2?.requestToPromise && storeName_2
            ? {
                  storage: storage_2,
                  storeName: storeName_2,
              }
            : null;
    }
    async function getIndexRecords(scopeFriendKey_2) {
        const runtime_2 = getProviderRegistry_2();
        if (!runtime_2)
            return Array.from(fallbackIndex.values()).filter(
                (record) => record.scopeFriendKey === scopeFriendKey_2,
            );
        return runtime_2.storage.withStore([runtime_2.storeName], 'readonly', async (value_88) => {
            const store_2 = value_88[runtime_2.storeName],
                request = store_2.index('scopeFriendKey').getAll(scopeFriendKey_2),
                records_2 = await runtime_2.storage.requestToPromise(request);
            return Array.isArray(records_2) ? records_2 : [];
        });
    }
    async function putIndexRecords(records) {
        const safeRecords = (Array.isArray(records) ? records : []).filter(Boolean);
        if (safeRecords.length === 0) return;
        const runtime = getProviderRegistry_2();
        if (!runtime) {
            safeRecords.forEach((record_2) =>
                fallbackIndex.set(record_2.id, {
                    ...record_2,
                }),
            );
            return;
        }
        await runtime.storage.withStore([runtime.storeName], 'readwrite', (stores) => {
            const store = stores[runtime.storeName];
            safeRecords.forEach((record_3) => store.put(record_3));
        });
    }
    async function deleteIndexRecordIds(ids) {
        const safeIds = Array.from(
            new Set((Array.isArray(ids) ? ids : []).map(String).filter(Boolean)),
        );
        if (safeIds.length === 0) return;
        const registry_2 = getProviderRegistry_2();
        if (!registry_2) {
            safeIds.forEach((value_96) => fallbackIndex['delete'](value_96));
            return;
        }
        await registry_2.storage.withStore([registry_2.storeName], 'readwrite', (value_97) => {
            const value_98 = value_97[registry_2.storeName];
            safeIds.forEach((value_99) => value_98['delete'](value_99));
        });
    }
    async function clearIndex() {
        const runtime_3 = getProviderRegistry_2();
        if (!runtime_3) {
            fallbackIndex.clear();
            return;
        }
        await runtime_3.storage.withStore([runtime_3.storeName], 'readwrite', (stores_2) => {
            stores_2[runtime_3.storeName].clear();
        });
    }
    async function purgeFriendIndexNow(friendId_3, config_7 = getGlobalConfig_2()) {
        const records_3 = await getIndexRecords(getScopeFriendKey(config_7, friendId_3));
        return (
            await deleteIndexRecordIds(records_3.map((record_4) => record_4.id)),
            records_3.length
        );
    }
    async function requestEmbeddings_2(value_106, inputs) {
        const normalized_4 = normalizeConfig_2(value_106);
        if (!isConfigured(normalized_4)) throw new Error('请先完成向量记忆服务配置');
        const values_2 = (Array.isArray(inputs) ? inputs : [inputs])
            .map((value_6) => String(value_6 || '').trim())
            .filter(Boolean);
        if (values_2.length === 0) return [];
        const controller = typeof AbortController === 'function' ? new AbortController() : null,
            timeout = window.setTimeout(() => controller?.abort(), EMBEDDING_REQUEST_TIMEOUT_MS_2);
        try {
            const value_112 = await fetch(getEmbeddingEndpoint_2(normalized_4), {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + normalized_4.apiKey,
                    },
                    body: JSON.stringify({
                        model: normalized_4.model,
                        input: values_2,
                    }),
                    signal: controller?.signal,
                }),
                raw = await value_112.text();
            let data_2 = {};
            if (raw)
                try {
                    data_2 = JSON.parse(raw);
                } catch (value_116) {
                    data_2 = {
                        error: raw.slice(0, 500),
                    };
                }
            if (!value_112.ok)
                throw new Error(
                    String(
                        data_2?.error?.message ||
                            data_2?.message ||
                            data_2?.error ||
                            value_112.status + ' ' + value_112.statusText,
                    ),
                );
            const rows = Array.isArray(data_2?.data) ? data_2.data : [],
                embeddings = Array(values_2.length);
            rows.forEach((row, fallbackIndex_2) => {
                const index_3 = Number.isInteger(Number(row?.index))
                        ? Number(row.index)
                        : fallbackIndex_2,
                    embedding_3 = Array.isArray(row?.embedding) ? row.embedding.map(Number) : [];
                index_3 >= 0 &&
                    index_3 < embeddings.length &&
                    embedding_3.length > 0 &&
                    embedding_3.every(Number.isFinite) &&
                    (embeddings[index_3] = embedding_3);
            });
            const hasIncompleteEmbedding = Array.from(
                {
                    length: values_2.length,
                },
                (_, index_4) => {
                    const vector = embeddings[index_4];
                    return !Array.isArray(vector) || vector.length === 0;
                },
            ).some(Boolean);
            if (hasIncompleteEmbedding) throw new Error('嵌入服务返回的数据不完整');
            const dimensions = embeddings[0].length;
            if (embeddings.some((vector_2) => vector_2.length !== dimensions))
                throw new Error('嵌入服务返回的向量维度不一致');
            return embeddings;
        } catch (error_2) {
            if (error_2?.name === 'AbortError') throw new Error('嵌入请求超时，请稍后重试');
            throw error_2;
        } finally {
            window.clearTimeout(timeout);
        }
    }
    async function testConnection_2(config_8) {
        try {
            return (
                await requestEmbeddings_2(config_8, ['vector memory connection test']),
                {
                    ok: true,
                }
            );
        } catch (error_3) {
            return {
                ok: false,
                error: String(error_3?.message || error_3 || '连接失败'),
            };
        }
    }
    async function syncFriendMemoryNow(value_126, value_127 = {}) {
        const { friend: friend_5 } = getMemory(value_126),
            config_9 = getGlobalConfig_2();
        if (!friend_5?.id)
            return {
                ok: false,
                reason: 'missing_friend',
                count: 0,
            };
        if (!isConfigured(config_9))
            return {
                ok: false,
                reason: 'not_configured',
                count: 0,
            };
        if (navigator.onLine === false)
            return {
                ok: false,
                reason: 'offline',
                count: 0,
            };
        const entries_2 = listIndexableEntries_2(friend_5),
            scopeFriendKey_3 = getScopeFriendKey(config_9, friend_5.id),
            existing = await getIndexRecords(scopeFriendKey_3),
            existingById = new Map(existing.map((record_5) => [record_5.id, record_5])),
            fingerprint_3 = getConfigFingerprint_2(config_9),
            currentIds = new Set(),
            pending = [];
        entries_2.forEach((item_3) => {
            const id_3 = getVectorRecordId_2(friend_5.id, item_3.kind, item_3.entry.id, config_9),
                contentHash_2 = createContentHash(item_3.content);
            currentIds.add(id_3);
            const previous = existingById.get(id_3);
            if (
                previous?.fingerprint === fingerprint_3 &&
                previous?.contentHash === contentHash_2 &&
                Array.isArray(previous.embedding)
            )
                return;
            pending.push({
                id: id_3,
                item: item_3,
            });
        });
        const staleIds = existing
                .filter(
                    (record_6) =>
                        !currentIds.has(record_6.id) || record_6.fingerprint !== fingerprint_3,
                )
                .map((record_7) => record_7.id),
            replacedIds = pending
                .filter((item_4) => existingById.has(item_4.id))
                .map((item_5) => item_5.id);
        await deleteIndexRecordIds([...staleIds, ...replacedIds]);
        let indexedCount_2 = 0;
        for (let start = 0; start < pending.length; start += EMBEDDING_BATCH_SIZE) {
            const batch = pending.slice(start, start + EMBEDDING_BATCH_SIZE),
                embeddings_2 = await requestEmbeddings_2(
                    config_9,
                    batch.map((item_6) => item_6.item.content),
                ),
                records_4 = batch
                    .map((item_7, index_5) =>
                        createIndexRecord_2(friend_5, item_7.item, embeddings_2[index_5], config_9),
                    )
                    .filter(Boolean);
            await putIndexRecords(records_4);
            indexedCount_2 += records_4.length;
            value_127.onProgress?.(indexedCount_2, pending.length);
        }
        return {
            ok: true,
            count: entries_2.length,
            indexedCount: indexedCount_2,
            pendingCount: pending.length,
        };
    }
    function syncFriendMemory_2(friendOrId_4, options_2 = {}) {
        return enqueueIndexTask(() => syncFriendMemoryNow(friendOrId_4, options_2));
    }
    async function rebuildAllMemoryIndexesNow() {
        const registry_3 = getGlobalConfig_2();
        if (!isConfigured(registry_3))
            return (
                emitStatus({
                    phase: 'error',
                    message: '请先完成向量记忆服务配置',
                    completed: 0,
                    total: 0,
                }),
                {
                    ok: false,
                    reason: 'not_configured',
                    count: 0,
                }
            );
        if (navigator.onLine === false)
            return (
                emitStatus({
                    phase: 'error',
                    message: '当前处于离线状态',
                    completed: 0,
                    total: 0,
                }),
                {
                    ok: false,
                    reason: 'offline',
                    count: 0,
                }
            );
        const friends_2 = (window.imData?.friends || []).filter((friend_6) => friend_6?.id),
            total_2 = friends_2.reduce(
                (count_5, friend_7) => count_5 + listIndexableEntries_2(friend_7).length,
                0,
            );
        emitStatus({
            phase: 'syncing',
            message: '正在建立本地索引',
            completed: 0,
            total: total_2,
        });
        let completed_2 = 0;
        try {
            await clearIndex();
            for (const value_161 of friends_2) {
                const records_5 = listIndexableEntries_2(value_161);
                await syncFriendMemoryNow(value_161, {
                    onProgress(indexed, value_164) {
                        emitStatus({
                            phase: 'syncing',
                            message: '正在建立本地索引',
                            completed: Math.min(total_2, completed_2 + indexed),
                            total: total_2,
                        });
                    },
                });
                completed_2 += records_5.length;
                emitStatus({
                    phase: 'syncing',
                    message: '正在建立本地索引',
                    completed: completed_2,
                    total: total_2,
                });
            }
            return (
                emitStatus({
                    phase: 'ready',
                    message: '已同步 ' + completed_2 + ' 条记忆',
                    completed: completed_2,
                    total: total_2,
                }),
                {
                    ok: true,
                    count: completed_2,
                }
            );
        } catch (error_4) {
            const message_2 = String(error_4?.message || error_4 || '索引同步失败');
            return (
                emitStatus({
                    phase: 'error',
                    message: message_2,
                    completed: completed_2,
                    total: total_2,
                }),
                {
                    ok: false,
                    error: message_2,
                    count: completed_2,
                }
            );
        }
    }
    function rebuildAllMemoryIndexes_2() {
        return enqueueIndexTask(rebuildAllMemoryIndexesNow);
    }
    async function deleteMemoryEntriesNow(value_166, value_167) {
        const { friend: friend_8 } = getMemory(value_166);
        if (!friend_8?.id)
            return {
                ok: false,
                reason: 'missing_friend',
                count: 0,
            };
        const config_10 = getGlobalConfig_2(),
            filter_170 = (Array.isArray(value_167) ? value_167 : [])
                .map((item_8) => {
                    const kind_7 = item_8?.kind || getMemoryKindForCollection_2(item_8?.collection),
                        entryId_3 = item_8?.entryId || item_8?.entry?.id;
                    return entryId_3
                        ? getVectorRecordId_2(friend_8.id, kind_7, entryId_3, config_10)
                        : '';
                })
                .filter(Boolean);
        return (
            await deleteIndexRecordIds(filter_170),
            {
                ok: true,
                count: filter_170.length,
            }
        );
    }
    function deleteMemoryEntries_2(friendOrId_5, items_2) {
        return enqueueIndexTask(() => deleteMemoryEntriesNow(friendOrId_5, items_2));
    }
    function purgeFriendIndex_2(friendId_4) {
        return enqueueIndexTask(() => purgeFriendIndexNow(friendId_4));
    }
    function cosineSimilarity_2(left_2, right_2) {
        if (
            !Array.isArray(left_2) ||
            !Array.isArray(right_2) ||
            left_2.length === 0 ||
            left_2.length !== right_2.length
        )
            return -1;
        let dot = 0,
            leftLength = 0,
            rightLength = 0;
        for (let count_182 = 0; count_182 < left_2.length; count_182 += 1) {
            const a = Number(left_2[count_182]),
                b = Number(right_2[count_182]);
            if (!Number.isFinite(a) || !Number.isFinite(b)) return -1;
            dot += a * b;
            leftLength += a * a;
            rightLength += b * b;
        }
        if (leftLength <= 0 || rightLength <= 0) return -1;
        return dot / Math.sqrt(leftLength * rightLength);
    }
    async function searchFriendMemory_2(value_184, queryText, options_3 = {}) {
        const { friend: friend_9 } = getMemory(value_184),
            config_11 = getGlobalConfig_2(),
            query = String(queryText || '').trim();
        if (!friend_9?.id || !isConfigured(config_11) || !query || navigator.onLine === false)
            return {
                results: [],
                skipped: true,
            };
        const queryEmbedding = (await requestEmbeddings_2(config_11, [query.slice(0, 6000)]))[0],
            fingerprint_4 = getConfigFingerprint_2(config_11),
            records_6 = await getIndexRecords(getScopeFriendKey(config_11, friend_9.id)),
            requestedLimit = Math.round(Number(options_3?.limit)),
            limit_2 =
                Number.isFinite(requestedLimit) && requestedLimit > 0
                    ? Math.min(100, requestedLimit)
                    : RECALL_LIMIT_2,
            results_2 = records_6
                .filter(
                    (record_8) =>
                        record_8.fingerprint === fingerprint_4 && Array.isArray(record_8.embedding),
                )
                .map((record_9) => ({
                    id: record_9.id,
                    score: cosineSimilarity_2(queryEmbedding, record_9.embedding),
                }))
                .filter((result_3) => Number.isFinite(result_3.score) && result_3.score >= 0)
                .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
                .slice(0, limit_2);
        return {
            results: results_2,
            skipped: false,
        };
    }
    function normalizeSearchResults(value_7) {
        const source_5 = Array.isArray(value_7?.results)
            ? value_7.results
            : Array.isArray(value_7)
              ? value_7
              : [];
        return source_5
            .map((item_9) => ({
                id: String(item_9?.id || ''),
                score: Number(item_9?.score || 0),
            }))
            .filter((item_10) => item_10.id && Number.isFinite(item_10.score));
    }
    function resolveSearchResults_2(value_202, value_203) {
        const { friend: friend_10 } = getMemory(value_202),
            config_12 = getGlobalConfig_2(),
            known = new Map();
        listIndexableEntries_2(friend_10).forEach((item_11) => {
            known.set(
                getVectorRecordId_2(friend_10.id, item_11.kind, item_11.entry.id, config_12),
                item_11,
            );
        });
        const resolved = [],
            value_207 = new Set();
        return (
            normalizeSearchResults(value_203).forEach((result_4) => {
                const item_12 = known.get(result_4.id);
                if (!item_12) return;
                const value_211 = item_12.kind + ':' + item_12.entry.id;
                if (value_207.has(value_211)) return;
                value_207.add(value_211);
                resolved.push({
                    type: item_12.kind,
                    entry: item_12.entry,
                    score: result_4.score,
                });
            }),
            resolved
        );
    }
    window.imVectorMemory = {
        RECALL_LIMIT: RECALL_LIMIT_2,
        EMBEDDING_REQUEST_TIMEOUT_MS: EMBEDDING_REQUEST_TIMEOUT_MS_2,
        PROVIDERS: getProviderRegistry(),
        normalizeConfig: normalizeConfig_2,
        getGlobalConfig: getGlobalConfig_2,
        getEmbeddingEndpoint: getEmbeddingEndpoint_2,
        getConfigFingerprint: getConfigFingerprint_2,
        getVectorRecordId: getVectorRecordId_2,
        getMemoryKindForCollection: getMemoryKindForCollection_2,
        getEntryContent: getEntryContent_2,
        listIndexableEntries: listIndexableEntries_2,
        createIndexRecord: createIndexRecord_2,
        requestEmbeddings: requestEmbeddings_2,
        testConnection: testConnection_2,
        syncFriendMemory: syncFriendMemory_2,
        rebuildAllMemoryIndexes: rebuildAllMemoryIndexes_2,
        deleteMemoryEntries: deleteMemoryEntries_2,
        purgeFriendIndex: purgeFriendIndex_2,
        searchFriendMemory: searchFriendMemory_2,
        resolveSearchResults: resolveSearchResults_2,
        cosineSimilarity: cosineSimilarity_2,
        getStatus: getStatus_2,
    };
    window.addEventListener('u2:memory-entries-updated', (value_212) => {
        const detail_2 = value_212?.detail || {},
            friend_11 = getFriend(detail_2.friendId);
        if (!friend_11) return;
        const task_2 =
            detail_2.action === 'delete'
                ? deleteMemoryEntries_2(friend_11, [detail_2])
                : syncFriendMemory_2(friend_11);
        void task_2['catch']((value_215) =>
            console.warn('[iMessage] local vector memory update failed', value_215),
        );
    });
    window.addEventListener('u2:group-summary-updated', (event_2) => {
        const friend_12 = getFriend(event_2?.detail?.groupId);
        if (!friend_12) return;
        void syncFriendMemory_2(friend_12)['catch']((value_218) =>
            console.warn('[iMessage] local vector memory update failed', value_218),
        );
    });
    window.addEventListener('u2:friend-removed', (event_3) => {
        const friendId_5 = event_3?.detail?.friendId;
        if (friendId_5 == null) return;
        void purgeFriendIndex_2(friendId_5)['catch']((error_5) =>
            console.warn('[iMessage] local vector index cleanup failed', error_5),
        );
    });
})();
