(function () {
  const PAGE_SIZE = 10,
    STAT_FIELDS = ["count", "durationMs", "durationCalls", "tokens", "tokenCalls"],
    DATABASE_NAME = "u2_api_console",
    pendingCalls = new Map(),
    unsavedCalls = new Map(),
    removedNativeCalls = new Set(),
    listeners = new Set(),
    responseTraces = new WeakMap(),
    timedOutSignals = new WeakSet();
  let databasePromise,
    journalQueue = Promise.resolve(),
    clearRevision = 0,
    clearedAt = 0,
    nextSequence = 0,
    storageFailed = false;
  const compareByStart = (first, second) => second.startedAt - first.startedAt || (first.id < second.id ? 1 : first.id > second.id ? -1 : 0),
    currentTime = () => performance.timeOrigin + performance.now(),
    notifyListeners = () => listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {}
    }),
    emptyStats = () => ({
      count: 0,
      durationMs: 0,
      durationCalls: 0,
      tokens: 0,
      tokenCalls: 0
    });
  function addRecordToStats(stats, record, delta = 1) {
    stats.count += delta;
    record.duration != null && (stats.durationMs += record.duration * delta, stats.durationCalls += delta);
    record.usage?.total != null && record.tokenApplicable && (stats.tokens += record.usage.total * delta, stats.tokenCalls += delta);
  }
  function updateStats(store, record, delta) {
    const key = [record.service, record.status],
      request = store.get(key);
    request.onsuccess = () => {
      const stats = request.result || {
        key: key,
        ...emptyStats()
      };
      addRecordToStats(stats, record, delta);
      if (stats.count > 0) store.put(stats);else store.delete(key);
    };
  }
  function rebuildStats(calls, statsStore) {
    const totals = new Map(),
      cursorRequest = calls.openCursor();
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) {
        for (const stats of totals.values()) statsStore.put(stats);
        return;
      }
      const record = cursor.value,
        key = [record.service, record.status],
        stringKey = JSON.stringify(key);
      if (!totals.has(stringKey)) totals.set(stringKey, {
        key: key,
        ...emptyStats()
      });
      addRecordToStats(totals.get(stringKey), record);
      cursor.continue();
    };
  }
  function openDatabase() {
    if (!databasePromise) databasePromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DATABASE_NAME, 2);
      request.onupgradeneeded = event => {
        const database = request.result;
        let calls;
        if (!database.objectStoreNames.contains("calls")) calls = database.createObjectStore("calls", {
          keyPath: "id"
        }), calls.createIndex("byStart", ["startedAt", "id"]), database.createObjectStore("meta");else calls = request.transaction.objectStore("calls");
        calls.createIndex("byService", ["service", "startedAt", "id"]);
        calls.createIndex("byStatus", ["status", "startedAt", "id"]);
        calls.createIndex("byServiceStatus", ["service", "status", "startedAt", "id"]);
        const stats = database.createObjectStore("stats", {
          keyPath: "key"
        });
        database.createObjectStore("removedNative");
        if (event.oldVersion) rebuildStats(calls, stats);
      };
      request.onsuccess = () => {
        const database = request.result;
        database.onversionchange = () => {
          database.close();
          databasePromise = null;
        };
        resolve(database);
      };
      request.onerror = () => reject(request.error);
    }).catch(error => {
      databasePromise = null;
      throw error;
    });
    return databasePromise;
  }
  function withJournal(mode, operation) {
    return openDatabase().then(database => new Promise((resolve, reject) => {
      const transaction = database.transaction(["calls", "meta", "stats", "removedNative"], mode),
        result = operation(transaction.objectStore("calls"), transaction.objectStore("meta"), transaction.objectStore("stats"), transaction.objectStore("removedNative"));
      transaction.oncomplete = () => resolve(typeof result === "function" ? result() : result?.result);
      transaction.onabort = () => reject(transaction.error);
    }));
  }
  function enqueueJournalOperation(operation) {
    const task = journalQueue.then(operation);
    return journalQueue = task.catch(() => {
      !storageFailed && (storageFailed = true, notifyListeners());
    }), task;
  }
  function writeRecord(record) {
    return withJournal("readwrite", (calls, metadata, stats, removedNative) => {
      function save() {
        calls.put(record);
        updateStats(stats, record, 1);
      }
      const clearRequest = metadata.get("clearedAt");
      clearRequest.onsuccess = () => {
        if (record.startedAt <= (clearRequest.result || 0)) return;
        if (!record.id.startsWith("native-")) {
          save();
          return;
        }
        const removedRequest = removedNative.get(record.id),
          existingRequest = calls.getKey(record.id);
        existingRequest.onsuccess = () => {
          if (!removedRequest.result && !existingRequest.result) save();
        };
      };
    });
  }
  function syncClearedAt(metadata, onComplete) {
    const request = metadata.get("clearedAt");
    request.onsuccess = () => {
      const latestClearTime = request.result || 0;
      if (latestClearTime > clearedAt) {
        clearedAt = latestClearTime;
        for (const unsaved of [pendingCalls, unsavedCalls]) {
          for (const [id, record] of unsaved) if (record.startedAt <= latestClearTime) unsaved.delete(id);
        }
      }
      onComplete?.();
    };
  }
  function syncJournal() {
    return enqueueJournalOperation(() => withJournal("readonly", (_calls, metadata) => syncClearedAt(metadata)));
  }
  function paginate(page, total) {
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE)),
      currentPage = Math.max(1, Math.min(pages, Math.trunc(page) || 1));
    return {
      page: currentPage,
      pages: pages,
      total: total,
      records: []
    };
  }
  function calculateStats(storedStats, unsavedRecords, service, status) {
    const stats = {
      ...emptyStats(),
      counts: {}
    };
    for (const group of storedStats) {
      const [recordService, recordStatus] = group.key;
      if (service && recordService !== service || status && recordStatus !== status) continue;
      for (const key of STAT_FIELDS) stats[key] += group[key];
      stats.counts[recordStatus] = (stats.counts[recordStatus] || 0) + group.count;
    }
    for (const record of unsavedRecords) {
      addRecordToStats(stats, record);
      stats.counts[record.status] = (stats.counts[record.status] || 0) + 1;
    }
    return stats;
  }
  function getPage({
    page = 1,
    service = "",
    status = ""
  } = {}) {
    const matchingUnsavedCalls = () => [...pendingCalls.values(), ...unsavedCalls.values()].filter(record => (!service || service === record.service) && (!status || status === record.status)).sort(compareByStart).map(record => ({
      ...record,
      usage: {
        ...record.usage
      }
    }));
    return enqueueJournalOperation(() => withJournal("readonly", (calls, metadata, stats) => {
      let result, unsavedRecords;
      const statsRequest = stats.getAll();
      return syncClearedAt(metadata, () => {
        unsavedRecords = matchingUnsavedCalls();
        const index = calls.index(service && status ? "byServiceStatus" : service ? "byService" : status ? "byStatus" : "byStart"),
          filterKeys = [service, status].filter(Boolean),
          keyRange = filterKeys.length ? window.IDBKeyRange.bound([...filterKeys, -Infinity], [...filterKeys, Infinity]) : null,
          countRequest = index.count(keyRange);
        countRequest.onsuccess = () => {
          result = paginate(page, countRequest.result + unsavedRecords.length);
          const startOffset = (result.page - 1) * PAGE_SIZE,
            cursorOffset = Math.max(0, startOffset - unsavedRecords.length);
          let scanned = cursorOffset,
            unsavedIndex = 0,
            isFirstCursorRow = true;
          const cursorRequest = index.openKeyCursor(keyRange, "prev"),
            appendUnsavedRecord = record => {
              if (scanned++ >= startOffset) result.records.push(record);
            };
          cursorRequest.onsuccess = () => {
            const cursor = cursorRequest.result;
            if (isFirstCursorRow && cursor && cursorOffset) {
              isFirstCursorRow = false;
              cursor.advance(cursorOffset);
              return;
            }
            isFirstCursorRow = false;
            const cursorKey = cursor && {
              startedAt: cursor.key.at(-2),
              id: cursor.primaryKey
            };
            while (result.records.length < PAGE_SIZE && unsavedIndex < unsavedRecords.length && (!cursorKey || compareByStart(unsavedRecords[unsavedIndex], cursorKey) < 0)) appendUnsavedRecord(unsavedRecords[unsavedIndex++]);
            if (!cursor || result.records.length >= PAGE_SIZE) return;
            if (scanned++ >= startOffset) {
              const recordIndex = result.records.push(null) - 1,
                recordRequest = calls.get(cursor.primaryKey);
              recordRequest.onsuccess = () => {
                result.records[recordIndex] = recordRequest.result;
              };
            }
            if (result.records.length < PAGE_SIZE) cursor.continue();
          };
        };
      }), () => ({
        ...result,
        stats: calculateStats(statsRequest.result, unsavedRecords, service, status)
      });
    })).catch(() => {
      const unsavedRecords = matchingUnsavedCalls(),
        result = paginate(page, unsavedRecords.length);
      return result.records = unsavedRecords.slice((result.page - 1) * PAGE_SIZE, result.page * PAGE_SIZE), result.stats = calculateStats([], unsavedRecords, service, status), result;
    });
  }
  function removeRecord(id) {
    const pendingRecord = pendingCalls.get(id);
    pendingCalls.delete(id);
    const unsavedRecord = unsavedCalls.get(id);
    unsavedCalls.delete(id);
    const isNative = id.startsWith("native-");
    if (!isNative && (pendingRecord || unsavedRecord)) return notifyListeners(), Promise.resolve();
    const revision = clearRevision;
    if (isNative) removedNativeCalls.add(id);
    return enqueueJournalOperation(() => withJournal("readwrite", (calls, _metadata, stats, removedNative) => {
      const request = calls.get(id);
      request.onsuccess = () => {
        if (!request.result) return;
        calls.delete(id);
        updateStats(stats, request.result, -1);
      };
      if (isNative) removedNative.put(true, id);
    })).catch(error => {
      if (revision === clearRevision) {
        if (pendingRecord?.status === "pending") pendingCalls.set(id, pendingRecord);else {
          if (pendingRecord || unsavedRecord) unsavedCalls.set(id, pendingRecord || unsavedRecord);
        }
        if (isNative) removedNativeCalls.delete(id);
      }
      throw error;
    }).finally(notifyListeners);
  }
  function clearRecords() {
    clearRevision++;
    pendingCalls.clear();
    unsavedCalls.clear();
    removedNativeCalls.clear();
    const timestamp = currentTime();
    return clearedAt = timestamp, notifyListeners(), enqueueJournalOperation(() => withJournal("readwrite", (calls, metadata, stats, removedNative) => {
      calls.clear();
      stats.clear();
      removedNative.clear();
      metadata.put(timestamp, "clearedAt");
    }));
  }
  function formatIdentifier(value) {
    const identifier = typeof value === "string" ? value.trim() : "";
    return identifier.length <= 160 && /^[\w.:-]+(?:\/[\w.:-]+)*$/.test(identifier) ? identifier : "";
  }
  function readTokenCount(usage, ...keys) {
    for (const key of keys) {
      const count = usage[key];
      if ((typeof count === "number" || typeof count === "string" && /^\d+$/.test(count)) && Number.isSafeInteger(Number(count)) && Number(count) >= 0) return Number(count);
    }
    return null;
  }
  function extractUsage(payload, provider) {
    const usage = payload?.usage ?? payload?.usage_metadata ?? payload?.usageMetadata ?? payload?.message?.usage;
    if (!usage || typeof usage !== "object") return {};
    let input = readTokenCount(usage, "prompt_tokens", "input_tokens", "promptTokenCount", "inputTokens", "total_input_tokens");
    return provider === "anthropic" && input !== null && (input += (readTokenCount(usage, "cache_creation_input_tokens") ?? 0) + (readTokenCount(usage, "cache_read_input_tokens") ?? 0)), {
      input: input,
      output: readTokenCount(usage, "completion_tokens", "output_tokens", "candidatesTokenCount", "outputTokens", "total_output_tokens"),
      total: readTokenCount(usage, "total_tokens", "totalTokenCount", "totalTokens")
    };
  }
  function classifyError(error, signal) {
    if (error?.name === "TimeoutError" || signal && timedOutSignals.has(signal)) return "timeout";
    if (error?.name === "AbortError" || signal?.aborted) return "cancelled";
    if (error?.code === "stream_truncated") return "truncated";
    if (error?.code === "stream_error") return "service";
    if (error?.code === "invalid_stream" || error?.name === "SyntaxError") return "invalid";
    if (error?.name === "TypeError" || error?.name === "NetworkError") return "network";
    return "service";
  }
  function startTrace(info, signal, headers, existingCall) {
    if (!info) return null;
    const revision = clearRevision,
      startedAt = existingCall?.startedAt ?? currentTime();
    if (startedAt <= clearedAt) return null;
    const startTime = performance.now(),
      id = existingCall?.id || startedAt + "-" + String(nextSequence++).padStart(8, "0") + "-" + Math.random().toString(36).slice(2);
    if (existingCall && (pendingCalls.has(id) || removedNativeCalls.has(id))) return null;
    const model = formatIdentifier(info.model),
      apiKeys = ["authorization", "x-api-key", "api-key", "x-goog-api-key"].map(name => headers?.get(name)?.replace(/^Bearer\s+/i, "")),
      record = {
        id: id,
        startedAt: startedAt,
        service: info.service,
        source: info.source,
        purpose: info.purpose,
        provider: formatIdentifier(info.provider),
        model: model && !apiKeys.includes(model) ? model : "",
        status: "pending",
        httpStatus: null,
        duration: null,
        reason: "",
        usage: {},
        tokenApplicable: info.tokenApplicable !== false
      };
    let finished = false,
      serviceError = false;
    const finish = (reason = "", duration) => {
        if (finished) return;
        finished = true;
        signal?.removeEventListener("abort", onAbort);
        if (revision !== clearRevision || startedAt <= clearedAt) return;
        reason ||= serviceError ? "service" : "";
        record.reason = reason;
        record.status = reason === "timeout" || reason === "cancelled" ? reason : reason ? "failed" : "success";
        record.duration = Math.max(0, Math.round(duration ?? performance.now() - startTime));
        const {
          input: input,
          output: output,
          total: total
        } = record.usage;
        if (total == null && input != null && output != null) record.usage.total = input + output;
        if (!pendingCalls.delete(id)) return;
        void enqueueJournalOperation(async () => {
          try {
            await writeRecord(record);
            unsavedCalls.delete(id);
          } catch (error) {
            if (revision === clearRevision) unsavedCalls.set(id, record);
            throw error;
          }
        }).catch(() => {});
        notifyListeners();
      },
      onAbort = () => finish(classifyError(signal.reason, signal));
    pendingCalls.set(id, record);
    notifyListeners();
    if (signal?.aborted) onAbort();else signal?.addEventListener("abort", onAbort, {
      once: true
    });
    return {
      finish: finish,
      "fail"(error) {
        if (finished) return;
        if (Number.isInteger(error?.status) && error.status >= 400) record.httpStatus = error.status;
        finish(record.httpStatus >= 400 ? "http" : classifyError(error, signal));
      },
      "response"(response, duration) {
        if (finished) return;
        record.httpStatus = response.status || null;
        if (!response.ok) finish("http", duration);
      },
      "payload"(payload) {
        if (finished) return;
        serviceError ||= Boolean(payload?.error || payload?.type === "error" || Number(payload?.base_resp?.status_code));
        if (!record.tokenApplicable) return;
        for (const [key, count] of Object.entries(extractUsage(payload, record.provider))) {
          if (count != null) record.usage[key] = count;
        }
      }
    };
  }
  function watchResponse(response, trace, format) {
    if (!trace || !response.ok) return response;
    if (!response.body) return trace.finish(), response;
    responseTraces.set(response, trace);
    if (format === "manual") return response;
    for (const method of ["json", "text", "blob", "arrayBuffer", "bytes", "formData"]) {
      if (typeof response[method] !== "function") continue;
      const readBody = response[method];
      Object.defineProperty(response, method, {
        configurable: true,
        writable: true,
        async "value"(...args) {
          const shouldTrack = this === response && !response.bodyUsed;
          try {
            const content = await readBody.apply(this, args);
            if (!shouldTrack) return content;
            if (method === "json") trace.payload(content);
            if (method === "text" && format === "json") try {
              trace.payload(JSON.parse(content));
            } catch (error) {
              trace.fail(error);
            }
            if (method === "text" && format === "sse") {
              let completed = false;
              for (const event of content.split(/\r?\n\r?\n/)) {
                const data = event.split(/\r?\n/).filter(line => line.startsWith("data:")).map(line => line.slice(5).trimStart()).join("\n");
                if (data === "[DONE]") {
                  completed = true;
                  break;
                }
                if (!data) continue;
                try {
                  const payload = JSON.parse(data);
                  trace.payload(payload);
                  completed ||= Boolean(payload.choices?.some(choice => choice.finish_reason));
                } catch (error) {
                  trace.finish("invalid");
                }
              }
              trace.finish(completed ? "" : "truncated");
            } else trace.finish();
            return content;
          } catch (error) {
            if (shouldTrack) trace.fail(error);
            throw error;
          }
        }
      });
    }
    return response;
  }
  window.u2ApiConsole = Object.freeze({
    start: startTrace,
    watchResponse: watchResponse,
    forResponse: response => responseTraces.get(response),
    getPage: getPage,
    syncJournal: syncJournal,
    remove: removeRecord,
    clear: clearRecords,
    "markTimeout"(signal) {
      if (signal) timedOutSignals.add(signal);
    },
    "subscribe"(listener) {
      return listeners.add(listener), () => listeners.delete(listener);
    },
    get "storageFailed"() {
      return storageFailed;
    }
  });
})();
