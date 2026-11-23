(function () {
  const SERVICE_LABELS = {
      text: "文本模型",
      vision: "识图",
      image: "生图",
      embedding: "向量记忆",
      asr: "语音识别",
      tts: "语音合成",
      test: "连接测试",
      models: "模型和音色列表"
    },
    STATUS_LABELS = {
      pending: "进行中",
      success: "成功",
      failed: "失败",
      timeout: "超时",
      cancelled: "已取消"
    },
    ERROR_LABELS = {
      network: "网络连接失败",
      invalid: "接口返回格式无效",
      truncated: "流式响应提前中断",
      service: "服务返回错误",
      timeout: "请求超时",
      cancelled: "请求已取消"
    },
    HTTP_ERROR_LABELS = {
      400: "请求参数无效",
      401: "身份验证失败",
      403: "访问被拒绝",
      404: "接口或模型不存在",
      408: "服务端请求超时",
      413: "请求内容过大",
      422: "服务无法处理请求参数",
      429: "请求受限"
    },
    dateFormat = new Intl.DateTimeFormat("zh-CN", {
      dateStyle: "short",
      timeStyle: "medium"
    }),
    numberFormat = new Intl.NumberFormat("zh-CN"),
    formatDuration = milliseconds => milliseconds == null ? "—" : milliseconds < 1000 ? Math.round(milliseconds) + " ms" : (milliseconds / 1000).toFixed(2) + " s";
  function createElement(tag, text, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  }
  function fillFilter(select, allLabel, labels) {
    for (const [value, label] of [["", allLabel], ...Object.entries(labels)]) {
      const option = createElement("option", label);
      option.value = value;
      select.append(option);
    }
  }
  function describeError(record) {
    if (record.reason !== "http") return ERROR_LABELS[record.reason] || "—";
    return HTTP_ERROR_LABELS[record.httpStatus] || (record.httpStatus >= 500 ? "服务端错误" : "HTTP 请求失败");
  }
  function renderRecord(record, expandedIds) {
    const article = createElement("article", null, "api-console-record"),
      details = createElement("details");
    details.dataset.callId = record.id;
    details.open = expandedIds.has(record.id);
    const summary = createElement("summary"),
      source = createElement("span", record.source, "api-console-source"),
      heading = createElement("span", null, "api-console-record-title"),
      status = createElement("span", STATUS_LABELS[record.status], "api-console-status");
    status.dataset.status = record.status;
    heading.append(createElement("strong", record.purpose), status);
    summary.append(source, heading);
    const modelLabel = [record.provider, record.model].filter(Boolean).join(" · ") || "—",
      metadata = createElement("span", null, "api-console-meta"),
      time = createElement("time", dateFormat.format(record.startedAt));
    time.dateTime = new Date(record.startedAt).toISOString();
    metadata.append(time, createElement("span", formatDuration(record.duration)));
    summary.append(metadata, createElement("span", modelLabel, "api-console-model"));
    const usage = record.usage || {},
      hasUsage = [usage.input, usage.output, usage.total].some(value => value != null);
    let usageLabel = "接口未返回";
    if (!record.tokenApplicable) usageLabel = "不适用";else {
      if (hasUsage) usageLabel = record.status === "success" ? "接口返回" : "部分用量";else {
        if (record.status === "pending") usageLabel = "等待接口返回";
      }
    }
    const formatTokens = tokens => tokens == null ? "—" : numberFormat.format(tokens),
      tokenGrid = createElement("dl", null, "api-console-token-grid");
    for (const [label, value] of [["输入 Token", usage.input], ["输出 Token", usage.output], ["总 Token", usage.total]]) {
      const item = createElement("div");
      item.append(createElement("dt", label), createElement("dd", formatTokens(value)));
      tokenGrid.append(item);
    }
    const properties = createElement("dl", null, "api-console-details");
    for (const [label, value] of [["服务", SERVICE_LABELS[record.service] || "AI 服务"], ["HTTP 状态", record.httpStatus || "—"], ["错误说明", describeError(record)], ["Token 用量", usageLabel]]) properties.append(createElement("dt", label), createElement("dd", value));
    details.append(summary, tokenGrid, properties);
    const deleteButton = createElement("button", null, "api-console-delete");
    deleteButton.type = "button";
    deleteButton.dataset.deleteCall = record.id;
    deleteButton.setAttribute("aria-label", "删除记录 · " + record.purpose);
    deleteButton.title = "删除这条记录";
    const icon = createElement("i", null, "fas fa-trash-can");
    return icon.setAttribute("aria-hidden", "true"), deleteButton.append(icon), article.append(details, deleteButton), article;
  }
  document.addEventListener("DOMContentLoaded", () => {
    const journal = window.u2ApiConsole,
      bySuffix = suffix => document.getElementById("api-console-" + suffix),
      view = bySuffix("view");
    if (!view || !journal) return;
    const openButton = bySuffix("btn"),
      serviceFilter = bySuffix("service"),
      statusFilter = bySuffix("status"),
      list = bySuffix("list"),
      scrollArea = list.closest(".api-console-content"),
      caption = bySuffix("caption"),
      storageNote = bySuffix("storage"),
      clearButton = bySuffix("clear"),
      previousButton = bySuffix("previous"),
      nextButton = bySuffix("next"),
      pageLabel = bySuffix("page"),
      statElements = {
        scope: bySuffix("statistics-scope"),
        success: bySuffix("stat-success"),
        failed: bySuffix("stat-failed"),
        duration: bySuffix("stat-duration"),
        tokens: bySuffix("stat-tokens"),
        note: bySuffix("stat-note")
      };
    let pagination = {
        page: 1,
        pages: 1,
        total: 0
      },
      requestedPage = 1,
      renderRevision = 0,
      refreshScheduled = false,
      isClearing = false;
    fillFilter(serviceFilter, "全部服务", SERVICE_LABELS);
    fillFilter(statusFilter, "全部状态", STATUS_LABELS);
    async function refresh(page = requestedPage) {
      if (!view.classList.contains("active")) return;
      requestedPage = page;
      const revision = ++renderRevision,
        result = await journal.getPage({
          page: page,
          service: serviceFilter.value,
          status: statusFilter.value
        });
      if (revision !== renderRevision || !view.classList.contains("active")) return;
      pagination = {
        page: result.page,
        pages: result.pages,
        total: result.total
      };
      requestedPage = result.page;
      const expandedIds = new Set([...list.querySelectorAll("details[open]")].map(details => details.dataset.callId)),
        fragment = document.createDocumentFragment();
      for (const record of result.records) fragment.append(renderRecord(record, expandedIds));
      if (!result.records.length) fragment.append(createElement("p", serviceFilter.value || statusFilter.value ? "没有符合筛选条件的调用" : "暂无 API 调用记录", "api-console-empty"));
      const focusedElement = list.contains(document.activeElement) ? document.activeElement : null,
        focusedId = focusedElement?.dataset.deleteCall || focusedElement?.closest("details")?.dataset.callId;
      list.replaceChildren(fragment);
      if (focusedId) {
        const nextFocusedElement = [...list.querySelectorAll(focusedElement.dataset.deleteCall ? "button" : "summary")].find(element => (element.dataset.deleteCall || element.closest("details")?.dataset.callId) === focusedId);
        (nextFocusedElement || list).focus({
          preventScroll: true
        });
      }
      const captionText = "调用记录 · " + numberFormat.format(result.total) + " 条";
      if (caption.textContent !== captionText) caption.textContent = captionText;
      storageNote.textContent = journal.storageFailed ? "部分本机记录可能不可用" : "仅本机 · 保留全部记录";
      const {
        counts: counts,
        durationCalls: durationCalls,
        durationMs: durationMs,
        tokenCalls: tokenCalls,
        tokens: tokens
      } = result.stats;
      statElements.scope.textContent = serviceFilter.value || statusFilter.value ? "当前筛选" : "全部记录";
      statElements.success.textContent = numberFormat.format(counts.success || 0);
      statElements.failed.textContent = numberFormat.format(counts.failed || 0) + " / " + numberFormat.format(counts.timeout || 0);
      statElements.duration.textContent = formatDuration(durationCalls ? durationMs / durationCalls : null);
      statElements.tokens.textContent = tokenCalls ? numberFormat.format(tokens) : "—";
      statElements.note.textContent = [tokenCalls ? numberFormat.format(tokenCalls) + " 条有总用量" : "暂无可统计的总 Token", counts.pending ? "进行中 " + numberFormat.format(counts.pending) + " 条" : "", counts.cancelled ? "已取消 " + numberFormat.format(counts.cancelled) + " 条" : ""].filter(Boolean).join(" · ");
      const paginationText = result.page + " / " + result.pages + " 页";
      if (pageLabel.textContent !== paginationText) pageLabel.textContent = paginationText;
      previousButton.disabled = result.page <= 1;
      nextButton.disabled = result.page >= result.pages;
      clearButton.disabled = isClearing;
    }
    journal.subscribe(() => {
      if (refreshScheduled || !view.classList.contains("active")) return;
      refreshScheduled = true;
      requestAnimationFrame(() => {
        refreshScheduled = false;
        void refresh();
      });
    });
    function goToPage(page) {
      scrollArea.scrollTop = 0;
      void refresh(page);
    }
    openButton.addEventListener("click", () => {
      pagination = {
        page: 1,
        pages: 1,
        total: 0
      };
      list.replaceChildren(createElement("p", "正在读取调用记录…", "api-console-empty"));
      openView(view);
      goToPage(1);
    });
    bySuffix("back").addEventListener("click", () => closeView(view));
    view.addEventListener("u2:view-closing", () => {
      renderRevision++;
      list.replaceChildren();
      openButton.focus();
    });
    for (const select of [serviceFilter, statusFilter]) select.addEventListener("change", () => goToPage(1));
    previousButton.addEventListener("click", () => goToPage(pagination.page - 1));
    nextButton.addEventListener("click", () => goToPage(pagination.page + 1));
    list.addEventListener("click", async event => {
      const button = event.target.closest("button[data-delete-call]");
      if (!button) return;
      button.disabled = true;
      try {
        await journal.remove(button.dataset.deleteCall);
      } catch (error) {
        showToast("删除调用记录失败，请重试");
      }
      await refresh();
    });
    clearButton.addEventListener("click", async () => {
      if (!window.confirm("清空本机 API 调用记录？")) return;
      isClearing = true;
      clearButton.disabled = true;
      try {
        await journal.clear();
      } catch (error) {
        showToast("清空本机记录失败，请重试");
      } finally {
        isClearing = false;
        goToPage(1);
      }
    });
  });
})();
