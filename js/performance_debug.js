0, function () {
  "use strict";

  let _0x2288c = ![];
  try {
    _0x2288c = new URLSearchParams(location.search).has("u2perf");
  } catch (_0x4ea278) {}
  if (!_0x2288c) return;
  const _0x1fb636 = Object.create(null),
    _0x3b8e0f = Object.create(null),
    _0x3d57af = 200,
    _0x162637 = [];
  let _0x53e5bd = null;
  const _0x365cc9 = (_0x34ebeb, _0x1ae4e5) => {
      if (!Number.isFinite(_0x1ae4e5) || _0x1ae4e5 < 0) return;
      const _0x3cbd5a = _0x1fb636[_0x34ebeb] || (_0x1fb636[_0x34ebeb] = []);
      _0x3cbd5a.push(Math.round(_0x1ae4e5 * 10) / 10);
      if (_0x3cbd5a.length > _0x3d57af) _0x3cbd5a.shift();
    },
    _0x54c2f7 = (_0x2708c4, _0x5e1a16) => {
      if (!_0x2708c4?.["length"]) return null;
      const _0x23c59d = [..._0x2708c4].sort((_0x45e5a3, _0x46f58d) => _0x45e5a3 - _0x46f58d);
      return _0x23c59d[Math.min(_0x23c59d.length - 1, Math.ceil(_0x23c59d.length * _0x5e1a16) - 1)];
    },
    _0x552453 = _0x53f536 => ({
      "count": _0x53f536.length,
      "p50": _0x54c2f7(_0x53f536, 0.5),
      "p95": _0x54c2f7(_0x53f536, 0.95),
      "max": _0x53f536.length ? Math.max(..._0x53f536) : null
    }),
    _0x2b808c = (_0x418b13, _0x5447fe, _0xc59009) => {
      if (!Number.isFinite(_0xc59009) || _0xc59009 < 0) return;
      _0x365cc9("assistive-" + _0x5447fe, _0xc59009), _0x418b13.metrics[_0x5447fe].push(Math.round(_0xc59009 * 10) / 10);
      if (_0x418b13.metrics[_0x5447fe].length > _0x3d57af) _0x418b13.metrics[_0x5447fe].shift();
    },
    _0x3efb69 = {
      "start"(_0x5dc359) {
        const _0x28aa9b = performance.now(),
          _0x5742ff = {
            "surface": document.querySelector(".app-view.active, .settings-view.active, .edit-view.active")?.["id"] || "home",
            "pointerType": _0x5dc359.pointerType || "unknown",
            "startedAt": _0x28aa9b,
            "endedAt": null,
            "lastMoveAt": null,
            "lastFrameAt": null,
            "latestMoveAt": null,
            "events": 0,
            "frames": 0,
            "metrics": {
              "event-gap": [],
              "event-delay": [],
              "move-work": [],
              "frame-gap": [],
              "input-to-frame": [],
              "frame-work": []
            },
            "longTasks": []
          };
        _0x162637.push(_0x5742ff);
        if (_0x162637.length > 10) _0x162637.shift();
        _0x53e5bd = _0x5742ff;
      },
      "move"(_0x13e776, _0x197fb9) {
        const _0x4b13a0 = _0x53e5bd;
        if (!_0x4b13a0) return;
        const _0x5dd2f9 = performance.now();
        if (_0x4b13a0.lastMoveAt !== null) _0x2b808c(_0x4b13a0, "event-gap", _0x197fb9 - _0x4b13a0.lastMoveAt);
        const _0x540d96 = _0x197fb9 - _0x13e776.timeStamp;
        if (_0x540d96 >= 0 && _0x540d96 < 60000) _0x2b808c(_0x4b13a0, "event-delay", _0x540d96);
        _0x2b808c(_0x4b13a0, "move-work", _0x5dd2f9 - _0x197fb9), _0x4b13a0.lastMoveAt = _0x197fb9, _0x4b13a0.latestMoveAt = _0x197fb9, _0x4b13a0.events += 1;
      },
      "frame"(_0x37e7f8, _0x4418c3, _0x38bd97) {
        const _0x359871 = _0x53e5bd;
        if (!_0x359871 || !Number.isFinite(_0x37e7f8)) return;
        if (_0x359871.lastFrameAt !== null) _0x2b808c(_0x359871, "frame-gap", _0x37e7f8 - _0x359871.lastFrameAt);
        if (_0x359871.latestMoveAt !== null) _0x2b808c(_0x359871, "input-to-frame", _0x4418c3 - _0x359871.latestMoveAt);
        _0x2b808c(_0x359871, "frame-work", _0x38bd97 - _0x4418c3), _0x359871.lastFrameAt = _0x37e7f8, _0x359871.frames += 1;
      },
      "end"() {
        if (!_0x53e5bd) return;
        _0x53e5bd.endedAt = performance.now(), _0x53e5bd = null;
      },
      "report"() {
        const _0x3f81b2 = _0x162637[_0x162637.length - 1];
        if (!_0x3f81b2) return null;
        const _0x50e6c3 = {
          "surface": _0x3f81b2.surface,
          "pointerType": _0x3f81b2.pointerType,
          "durationMs": Math.round(((_0x3f81b2.endedAt ?? performance.now()) - _0x3f81b2.startedAt) * 10) / 10,
          "events": _0x3f81b2.events,
          "frames": _0x3f81b2.frames,
          "longTasks": _0x3f81b2.longTasks.slice(),
          "metrics": Object.fromEntries(Object.entries(_0x3f81b2.metrics).map(([_0x3da81c, _0x126204]) => [_0x3da81c, _0x552453(_0x126204)]))
        };
        return console.table(_0x50e6c3.metrics), _0x50e6c3;
      }
    };
  window.u2Perf = {
    "mark"(_0x28c256) {
      _0x3b8e0f[_0x28c256] = performance.now(), performance.mark("u2:" + _0x28c256);
    },
    "finish"(_0x5ac7d8, _0x48bd3d) {
      if (_0x3b8e0f[_0x48bd3d] === undefined) return;
      const _0x3b671c = performance.now() - _0x3b8e0f[_0x48bd3d];
      return _0x365cc9(_0x5ac7d8, _0x3b671c), performance.measure("u2:" + _0x5ac7d8, "u2:" + _0x48bd3d), _0x3b671c;
    },
    "sample": _0x365cc9,
    "assistiveDrag": _0x3efb69,
    "report"() {
      const _0x571812 = Object.fromEntries(Object.entries(_0x1fb636).map(([_0x272607, _0x8c867f]) => [_0x272607, _0x552453(_0x8c867f)]));
      return console.table(_0x571812), _0x571812;
    }
  }, window.u2Perf.mark("bootstrap");
  if ("PerformanceObserver" in window) try {
    new PerformanceObserver(_0x2b6f6f => {
      _0x2b6f6f.getEntries().forEach(_0x202eb3 => {
        _0x365cc9("long-task", _0x202eb3.duration);
        const _0x4d3be5 = _0x202eb3.startTime + _0x202eb3.duration;
        _0x162637.forEach(_0x589887 => {
          if (_0x4d3be5 < _0x589887.startedAt || _0x202eb3.startTime > (_0x589887.endedAt ?? performance.now())) return;
          _0x589887.longTasks.push({
            "startTime": Math.round(_0x202eb3.startTime),
            "duration": Math.round(_0x202eb3.duration)
          }), _0x365cc9("assistive-long-task", _0x202eb3.duration);
        });
      });
    }).observe({
      "type": "longtask",
      "buffered": !![]
    });
  } catch (_0x45a2cc) {}
  document.addEventListener("input", _0x181310 => {
    const _0x9a41d2 = _0x181310.target;
    if (!_0x9a41d2?.["closest"]?.("#imessage-view") || !_0x9a41d2.matches?.("textarea, input, [contenteditable]")) return;
    const _0x670d07 = performance.now();
    requestAnimationFrame(() => {
      setTimeout(() => _0x365cc9("imessage-input-to-paint", performance.now() - _0x670d07), 0);
    });
  }, !![]);
  if (typeof window.MutationObserver === "function") {
    let _0x240da4 = null,
      _0xfbd1ee = 0;
    const _0x1c4684 = ".app-view, .settings-view, .edit-view, .yt-tab-content, .tk-tab-content, .x-tab-content, [data-diary-page], [data-cycle-page]",
      _0x4dadaf = _0x27a840 => _0x27a840.isConnected && !_0x27a840.hidden && _0x27a840.classList.contains("active") && !_0x27a840.closest(".app-view:not(.active)");
    document.addEventListener("click", () => {
      _0x240da4 = performance.now(), _0xfbd1ee++;
    }, !![]);
    const _0x511160 = () => {
      if (!document.body) return;
      const _0x1074a9 = new window.MutationObserver(_0x1c36ac => {
        if (_0x240da4 === null || performance.now() - _0x240da4 > 1500) return;
        const _0x2eb65d = _0x1c36ac.map(_0x15dece => _0x15dece.target).find(_0x23eb7c => _0x23eb7c.matches?.(_0x1c4684) && _0x4dadaf(_0x23eb7c));
        if (!_0x2eb65d) return;
        const _0x1fe970 = _0x240da4;
        _0x240da4 = null;
        const _0x51197f = _0xfbd1ee;
        requestAnimationFrame(() => setTimeout(() => {
          if (_0x51197f !== _0xfbd1ee || !_0x4dadaf(_0x2eb65d)) return;
          _0x365cc9("navigation-input-to-paint", performance.now() - _0x1fe970);
        }, 0));
      });
      _0x1074a9.observe(document.body, {
        "subtree": !![],
        "attributes": !![],
        "attributeFilter": ["class", "hidden"]
      });
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", _0x511160, {
      "once": !![]
    });else _0x511160();
  }
}();
