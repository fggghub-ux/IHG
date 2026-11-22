(function () {
  const localValue1 = window.imChat = window.imChat || {},
    localValue2 = localValue28 => window.imApp?.["getFriendById"]?.(localValue28) || window.imData?.["friends"]?.["find"](localValue29 => String(localValue29.id) === String(localValue28));
  let localValue3 = null,
    localValue4 = null,
    localValue5 = null;
  const localValue6 = new Set();
  function localValue7(localValue30) {
    if (!localValue30 || typeof localValue30 !== "object" || !String(localValue30.id || "").trim()) return null;
    const localValue31 = Number(localValue30.startedAt),
      localValue32 = Number(localValue30.endsAt),
      localValue33 = Number(localValue30.returnAt);
    if (![localValue31, localValue32, localValue33].every(Number.isFinite) || localValue31 <= 0 || localValue32 <= localValue31 || localValue33 < localValue32 || !Number.isFinite(new Date(localValue33).getTime()) || !String(localValue30.activity || "").trim()) return null;
    return {
      ...localValue30,
      "id": String(localValue30.id),
      "activity": String(localValue30.activity).trim().slice(0, 200),
      "startedAt": localValue31,
      "endsAt": localValue32,
      "returnAt": localValue33,
      "status": ["finished", "cancelled"].includes(localValue30.status) ? localValue30.status : "active",
      "deliveryStatus": ["sending", "sent", "failed", "cancelled"].includes(localValue30.deliveryStatus) ? localValue30.deliveryStatus : "pending",
      "sourceMessageIds": Array.isArray(localValue30.sourceMessageIds) ? localValue30.sourceMessageIds.map(String) : [],
      "sourceRunIds": Array.isArray(localValue30.sourceRunIds) ? localValue30.sourceRunIds.map(String) : []
    };
  }
  function localValue8(localValue34) {
    const localValue35 = String(localValue34 || ""),
      localValue36 = [...localValue35.matchAll(/<away_activity\s*>([\s\S]*?)<\/away_activity\s*>/gi)];
    let localValue37 = null;
    if (localValue36.length === 1 && localValue36[0].index > localValue35.toLowerCase().lastIndexOf("</chat_json>")) try {
      const localValue39 = JSON.parse(localValue36[0][1]);
      if (["start", "update", "finish", "cancel"].includes(localValue39?.["action"])) {
        if (["finish", "cancel"].includes(localValue39.action)) localValue37 = {
          "action": localValue39.action
        };else {
          const localValue40 = Number(localValue39.durationMinutes),
            localValue41 = localValue39.returnAfterMinutes == null ? localValue40 : Number(localValue39.returnAfterMinutes);
          typeof localValue39.activity === "string" && localValue39.activity.trim() && Number.isFinite(localValue40) && localValue40 > 0 && Number.isFinite(localValue41) && localValue41 >= localValue40 && (localValue37 = {
            "action": localValue39.action,
            "activity": localValue39.activity.trim().slice(0, 200),
            "durationMinutes": localValue40,
            "returnAfterMinutes": localValue41
          });
        }
      }
    } catch (localValue42) {}
    const localValue38 = localValue35.replace(/<away_activity\b[^>]*>[\s\S]*?<\/away_activity\s*>/gi, "").replace(/<away_activity\b[^>]*>[\s\S]*$/gi, "").replace(/<\/?away_activity\b[^>]*>/gi, "").trim();
    return {
      "reply": localValue38,
      "action": localValue37
    };
  }
  function localValue9(localValue43) {
    const localValue44 = Math.max(0, Math.round(localValue43 / 60000));
    if (localValue44 < 60) return localValue44 + " 分钟";
    return Math.floor(localValue44 / 60) + " 小时" + (localValue44 % 60 ? " " + localValue44 % 60 + " 分钟" : "");
  }
  function localValue10(localValue45) {
    const localValue46 = new Date(localValue45),
      localValue47 = new Date(),
      localValue48 = localValue46.toDateString() === localValue47.toDateString();
    return localValue46.toLocaleString(undefined, {
      ...(localValue48 ? {} : {
        "year": "numeric",
        "month": "2-digit",
        "day": "2-digit"
      }),
      "hour": "2-digit",
      "minute": "2-digit",
      "hour12": false
    });
  }
  function localValue11(localValue49, localValue50 = Date.now()) {
    if (localValue49.status === "cancelled") return localValue49.activity + "（已取消）";
    if (localValue49.status === "finished" || localValue50 >= localValue49.endsAt) return localValue49.activity + "（已结束）";
    return "正在" + localValue49.activity;
  }
  function localValue12(localValue51, localValue52) {
    const localValue53 = {
      "sending": localValue6.has(String(localValue51.id)) ? "正在发送…" : "发送结果待确认",
      "sent": "消息已发送",
      "failed": "消息发送失败",
      "cancelled": "已取消发送"
    };
    return localValue53[localValue52.deliveryStatus] || "";
  }
  function localValue13(localValue54, localValue55 = Date.now(), localValue56 = false) {
    if (localValue54?.["type"] !== "char") return "";
    const localValue57 = localValue7(localValue54.awayActivity),
      localValue58 = "Temporary absence / return agreement:\n- Only when your visible reply explicitly says you are leaving NOW to do a concrete activity and will return/contact User later, append <away_activity>{\"action\":\"start\",\"activity\":\"做饭\",\"durationMinutes\":60,\"returnAfterMinutes\":60}</away_activity> after </chat_json> and after <cot_summary> if required. Use an activity phrase in the chat language that follows \"正在\" naturally. Choose a realistic duration from the conversation; an explicit promised clock time determines the real waiting interval. returnAfterMinutes defaults to durationMinutes and must be >= durationMinutes.\n- Do not emit this metadata for hypothetical, remembered, quoted, vague, or future plans that are not an actual departure now. Do not invent a departure to use this feature. No metadata is needed for ordinary conversation.\n- For an explicit change to the SAME ongoing activity, use action \"update\"; durationMinutes and returnAfterMinutes are TOTAL minutes since the ORIGINAL start, not additional minutes. For a different activity, use \"start\". For an explicit early return/completion use {\"action\":\"finish\"}; for cancelling the activity use {\"action\":\"cancel\"}. Never silently end/update a plan merely because User sends a message.\n- Metadata must agree with your visible bubbles. Output at most one valid JSON metadata block outside chat_json. It is internal bookkeeping, never explain its tags, timers, API, or settings to User. This uses real elapsed time even when the chat uses a fictional date.";
    if (!localValue57) return localValue58;
    const localValue59 = Math.max(0, localValue55 - localValue57.startedAt),
      localValue60 = "Recorded activity: " + JSON.stringify(localValue57.activity) + ". State: " + localValue57.status + ".\nReal start: " + new Date(localValue57.startedAt).toISOString() + "; expected end: " + new Date(localValue57.endsAt).toISOString() + "; planned contact: " + new Date(localValue57.returnAt).toISOString() + ".\nPlanned activity duration: " + localValue9(localValue57.endsAt - localValue57.startedAt) + ". Actual time since departure: " + localValue9(localValue59) + ". Contact delay beyond the promise: " + localValue9(Math.max(0, localValue55 - localValue57.returnAt)) + ".\nThe planned activity duration and time elapsed since departure are different facts. Do not claim you spent the entire delayed/offline interval continuously doing the activity. If it is still before the expected end, remain aware you are busy while responding normally to User.";
    return localValue58 + "\n\n" + localValue60 + (localValue56 ? "\nTrigger for this turn: your agreed return time has arrived. Proactively contact User after the recorded activity, remember what you just went to do and its duration, and naturally pick up the latest chat context. User has not sent a new message for this trigger. Do not wait for User, describe this as unanswered User input, or start a new absence automatically. Output normal visible chat_json bubbles." : "");
  }
  async function localValue14(localValue61, localValue62) {
    return window.imApp.commitScopedFriendChange(localValue61.id, localValue63 => {
      localValue63.awayActivity = localValue62;
    }, {
      "silent": true,
      "immediate": true,
      "metaOnly": true,
      "syncActive": true,
      "syncSettings": true
    });
  }
  async function localValue15(localValue64, localValue65) {
    if (!localValue65?.["noticeId"]) return true;
    return window.imApp.updateFriendMessage(localValue64.id, {
      "id": localValue65.noticeId
    }, localValue66 => {
      localValue66.awayActivity = {
        ...localValue65
      };
    }, {
      "silent": true
    });
  }
  async function localValue16(localValue67, localValue68, localValue69) {
    let localValue70 = localValue2(typeof localValue67 === "object" ? localValue67.id : localValue67);
    if (localValue70?.["type"] !== "char" || !localValue68) return false;
    await window.imApp.ensureFriendMessagesLoaded?.(localValue70), localValue70 = localValue2(localValue70.id);
    const localValue71 = (localValue70.messages || []).filter(localValue76 => localValue76.role === "assistant" && localValue76.type !== "system_notice" && localValue76.deliveryStatus !== "blocked" && String(localValue76.apiRunId) === String(localValue69));
    if (!localValue71.length) return false;
    const localValue72 = localValue7(localValue70.awayActivity);
    if (localValue72?.["sourceRunIds"]["includes"](String(localValue69))) return false;
    const localValue73 = Date.now();
    let localValue74;
    const localValue75 = localValue68.action === "update" && localValue72?.["status"] === "active";
    if (["finish", "cancel"].includes(localValue68.action)) {
      if (!localValue72 || localValue72.status !== "active") return false;
      localValue74 = {
        ...localValue72,
        "status": localValue68.action === "finish" ? "finished" : "cancelled",
        "finishedAt": localValue73,
        "deliveryStatus": localValue72.deliveryStatus === "pending" ? "cancelled" : localValue72.deliveryStatus
      };
    } else {
      if (localValue68.action === "update" && !localValue75) return false;
      const localValue77 = localValue75 ? localValue72.startedAt : localValue73,
        localValue78 = localValue75 ? localValue72.id : "away-" + localValue69;
      localValue74 = localValue7({
        "id": localValue78,
        "activity": localValue68.activity,
        "startedAt": localValue77,
        "endsAt": localValue77 + localValue68.durationMinutes * 60000,
        "returnAt": localValue77 + localValue68.returnAfterMinutes * 60000,
        "status": "active",
        "deliveryStatus": localValue75 ? localValue72.deliveryStatus : "pending",
        "noticeId": localValue75 ? localValue72.noticeId : localValue78 + "-notice",
        "sourceRunIds": [...new Set([...(localValue75 ? localValue72.sourceRunIds : []), String(localValue69)])],
        "sourceMessageIds": [...new Set([...(localValue75 ? localValue72.sourceMessageIds : []), ...localValue71.map(localValue79 => String(localValue79.id))])]
      });
      if (!localValue74) return false;
    }
    if (!(await localValue14(localValue70, localValue74))) return false;
    if (!localValue72 || localValue72.id !== localValue74.id) {
      const localValue80 = {
        "id": localValue74.noticeId,
        "role": "system",
        "type": "system_notice",
        "noticeKind": "away_activity",
        "excludedFromContext": true,
        "apiRunId": localValue69,
        "timestamp": localValue73,
        "content": (localValue70.nickname || localValue70.realName || "Char") + " " + localValue11(localValue74),
        "awayActivity": {
          ...localValue74
        }
      };
      if (!(await window.imApp.appendFriendMessage(localValue70.id, localValue80, {
        "silent": true
      }))) return await localValue14(localValue70, localValue72), false;
      if (localValue72) await localValue15(localValue70, {
        ...localValue72,
        "status": localValue72.status === "active" ? "cancelled" : localValue72.status,
        "deliveryStatus": localValue72.deliveryStatus === "pending" ? "cancelled" : localValue72.deliveryStatus
      });
      const localValue81 = document.getElementById("chat-interface-" + localValue70.id)?.["querySelector"](".ins-chat-messages");
      localValue81 && String(window.imData.currentActiveFriend?.["id"]) === String(localValue70.id) && localValue1.renderSystemNoticeBubble?.(localValue80, localValue2(localValue70.id), localValue81, localValue73);
    } else await localValue15(localValue70, localValue74);
    return localValue19(), true;
  }
  function localValue17(localValue82, localValue83) {
    const localValue84 = localValue7(localValue82?.["awayActivity"]);
    if (!localValue84 || localValue84.status !== "active") return;
    if (localValue83.some(localValue85 => String(localValue85.id) === localValue84.noticeId || localValue84.sourceMessageIds.includes(String(localValue85.id)) || localValue84.sourceRunIds.includes(String(localValue85.apiRunId || "")))) {
      localValue82.awayActivity = {
        ...localValue84,
        "status": "cancelled",
        "deliveryStatus": localValue84.deliveryStatus === "pending" ? "cancelled" : localValue84.deliveryStatus
      };
      for (const localValue86 of localValue82.messages || []) {
        if (localValue86.id === localValue84.noticeId) localValue86.awayActivity = {
          ...localValue82.awayActivity
        };
      }
    }
  }
  async function localValue18(localValue87, localValue88) {
    const localValue89 = localValue2(localValue87);
    if (localValue89?.["type"] !== "char") return false;
    const localValue90 = await window.imApp.commitScopedFriendChange(localValue89.id, localValue91 => {
      localValue91.awayReturnEnabled = localValue88 === true;
    }, {
      "silent": true,
      "immediate": true,
      "metaOnly": true,
      "syncActive": true,
      "syncSettings": true
    });
    if (!localValue90) window.showToast?.("主动消息设置保存失败");
    return localValue19(), void localValue27(), localValue90;
  }
  function localValue19() {
    document.querySelectorAll(".chat-away-activity-notice").forEach(localValue92 => {
      const localValue93 = localValue2(localValue92.dataset.friendId),
        localValue94 = localValue7(localValue93?.["awayActivity"]),
        localValue95 = localValue94?.["id"] === localValue92.dataset.activityId ? localValue94 : localValue92._awayActivity,
        localValue96 = localValue92.querySelector(".chat-away-activity-text");
      if (localValue93 && localValue95 && localValue96) localValue96.textContent = (localValue93.nickname || localValue93.realName || "Char") + " " + localValue11(localValue95);
    });
    if (localValue5?.["isConnected"]) localValue21();
    localValue26();
  }
  function localValue20(localValue97, localValue98, localValue99, localValue100) {
    const localValue101 = localValue7(localValue98.awayActivity),
      localValue102 = localValue101?.["id"] === localValue97.awayActivity?.["id"] ? localValue101 : localValue7(localValue97.awayActivity);
    if (localValue98.type !== "char" || !localValue102) return null;
    const localValue103 = document.createElement("div");
    return localValue103.className = "chat-system-row chat-away-activity-notice", localValue103.dataset.friendId = String(localValue98.id), localValue103.dataset.activityId = localValue102.id, localValue103.dataset.messageId = localValue97.id, localValue103.dataset.timestamp = String(localValue100), localValue103._awayActivity = localValue102, localValue103.innerHTML = "<div class=\"chat-away-activity-pill\"><span class=\"chat-away-activity-text\"></span><span aria-hidden=\"true\"> · </span><button type=\"button\" class=\"chat-away-activity-view\">查看</button></div>", localValue103.querySelector(".chat-away-activity-text").textContent = (localValue98.nickname || localValue98.realName || "Char") + " " + localValue11(localValue102), localValue103.querySelector("button").addEventListener("click", () => localValue23(localValue98.id, localValue102)), localValue1.attachNoticeDeleteButton?.(localValue103, localValue98, localValue97, {
      "parent": localValue103.querySelector(".chat-away-activity-pill")
    }), localValue99.appendChild(localValue103), localValue1.scrollToBottom?.(localValue99), localValue103;
  }
  function localValue21() {
    const localValue104 = localValue2(localValue5.dataset.friendId),
      localValue105 = localValue7(localValue104?.["awayActivity"]),
      localValue106 = localValue105?.["id"] === localValue5._awayActivity.id ? localValue105 : localValue5._awayActivity;
    if (!localValue104) {
      localValue22();
      return;
    }
    const localValue107 = Date.now(),
      localValue108 = localValue106.status === "cancelled" ? "cancelled" : localValue106.status === "finished" || localValue107 >= localValue106.endsAt ? "finished" : "active",
      localValue109 = {
        "activity": localValue106.activity,
        "startedAt": localValue10(localValue106.startedAt),
        "duration": localValue9(localValue106.endsAt - localValue106.startedAt),
        "endsAt": localValue10(localValue106.endsAt),
        "returnAt": localValue10(localValue106.returnAt),
        "state": localValue12(localValue104, localValue106),
        "phase": localValue108 === "cancelled" ? "已取消" : localValue108 === "finished" ? "已结束" : "进行中"
      };
    for (const [localValue110, localValue111] of Object.entries(localValue109)) localValue5.querySelector("[data-away-field=\"" + localValue110 + "\"]").textContent = localValue111;
    localValue5.dataset.phase = localValue108, localValue5.querySelector("[data-away-field=\"state\"]").hidden = !localValue109.state, localValue5.querySelector("input").checked = localValue104.awayReturnEnabled === true;
  }
  function localValue22() {
    const localValue112 = localValue5?.["_previousFocus"];
    localValue5?.["remove"](), localValue5 = null, localValue112?.["focus"]?.();
  }
  function localValue23(localValue113, localValue114) {
    localValue22(), localValue5 = document.createElement("div"), localValue5.className = "chat-away-activity-overlay", localValue5.dataset.friendId = String(localValue113), localValue5._awayActivity = {
      ...localValue114
    }, localValue5._previousFocus = document.activeElement, localValue5.innerHTML = "<section class=\"chat-away-activity-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"chat-away-activity-title\" tabindex=\"-1\">\n            <header class=\"chat-away-activity-header\"><h3 id=\"chat-away-activity-title\">活动详情</h3>\n                <button type=\"button\" class=\"chat-away-activity-close\" aria-label=\"关闭活动详情\"><svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"m6 6 12 12M18 6 6 18\"/></svg></button></header>\n            <div class=\"chat-away-activity-hero\">\n                <strong data-away-field=\"activity\"></strong>\n                <span data-away-field=\"phase\"></span>\n            </div>\n            <dl class=\"chat-away-activity-details\"><div><dt>预计时长</dt><dd data-away-field=\"duration\"></dd></div>\n                <div><dt>开始时间</dt><dd data-away-field=\"startedAt\"></dd></div>\n                <div><dt>预计结束</dt><dd data-away-field=\"endsAt\"></dd></div>\n                <div><dt>联系时间</dt><dd data-away-field=\"returnAt\"></dd></div></dl>\n            <div class=\"chat-away-activity-preference\">\n                <label class=\"chat-away-activity-switch\"><span>忙完后主动发消息</span><span class=\"toggle-switch\"><input type=\"checkbox\" aria-label=\"忙完后主动发消息\"><span class=\"slider\"></span></span></label>\n            </div>\n            <p class=\"chat-away-activity-state\" data-away-field=\"state\" role=\"status\" hidden></p>\n            </section>", localValue5.querySelector(".chat-away-activity-close").addEventListener("click", localValue22), localValue5.addEventListener("click", localValue115 => {
      if (localValue115.target === localValue5) localValue22();
    }), localValue5.addEventListener("keydown", localValue116 => {
      if (localValue116.key === "Escape") localValue22();
      if (localValue116.key === "Tab" && localValue5) {
        const localValue117 = [...localValue5.querySelectorAll("button, input")].filter(localValue120 => !localValue120.disabled),
          localValue118 = localValue117[0],
          localValue119 = localValue117[localValue117.length - 1];
        if (localValue116.shiftKey && (document.activeElement === localValue118 || document.activeElement.tagName === "SECTION")) localValue116.preventDefault(), localValue119.focus();else !localValue116.shiftKey && document.activeElement === localValue119 && (localValue116.preventDefault(), localValue118.focus());
      }
    }), localValue5.querySelector("input").addEventListener("change", async localValue121 => {
      const localValue122 = localValue121.currentTarget;
      localValue122.disabled = true;
      try {
        await localValue18(localValue113, localValue122.checked);
      } finally {
        localValue122.disabled = false;
        if (localValue5?.["isConnected"]) localValue21();
      }
    }), (document.getElementById("app") || document.body).appendChild(localValue5), localValue21(), localValue5.querySelector("section").focus();
  }
  function localValue24(localValue123, localValue124) {
    const localValue125 = localValue7(localValue123?.["awayActivity"]);
    return localValue123?.["type"] === "char" && localValue123.awayReturnEnabled === true && localValue125?.["status"] === "active" && localValue125.deliveryStatus === "pending" && localValue125.returnAt <= localValue124 ? localValue125 : null;
  }
  async function localValue25(localValue126) {
    let localValue127 = localValue2(localValue126);
    if (localValue127?.["type"] === "char" && localValue127.awayActivity?.["deliveryStatus"] === "sending" && !localValue6.has(String(localValue126))) {
      const localValue131 = await window.imStorage.getAwayReturnState(localValue126, localValue127.awayActivity.id);
      if (localValue131) localValue127.awayActivity = localValue7(localValue131);
    }
    const localValue128 = localValue24(localValue127, Date.now());
    if (!localValue128) return false;
    if (localValue6.has(String(localValue126)) || localValue1.isAwayReplyBusy?.(localValue126)) return true;
    if (navigator.onLine === false || localValue127.blockState?.["charBlocksUser"] || localValue127.blockState?.["userBlocksChar"]) return true;
    const localValue129 = window.getApiConfig?.() || window.apiConfig || {};
    if (!localValue129.endpoint || !localValue129.apiKey || typeof localValue1.handleAiReply !== "function") return true;
    localValue6.add(String(localValue126));
    let localValue130 = false;
    try {
      await window.imApp.ensureFriendMessagesLoaded?.(localValue127);
      if (!localValue24(localValue2(localValue126), Date.now()) || localValue1.isAwayReplyBusy?.(localValue126)) return true;
      localValue127 = localValue2(localValue126);
      if (!localValue127) return true;
      const localValue132 = await localValue1.handleAiReply(localValue127, null, null, {
        "source": "away_return",
        "silent": true,
        "singleApiAttempt": true,
        "continueWithoutUser": true,
        "awayReturn": {
          ...localValue127.awayActivity
        },
        "beforeApiRequest": async () => {
          const localValue135 = await window.imStorage.claimAwayReturn(localValue126, localValue128.id, Date.now());
          if (!localValue135) return false;
          const localValue136 = localValue2(localValue126);
          if (localValue136?.["awayActivity"]?.["id"] === localValue128.id) localValue136.awayActivity = localValue7(localValue135.activity);
          if (localValue135.alreadyClaimed) return false;
          return localValue130 = true, true;
        }
      });
      if (!localValue130) return true;
      const localValue133 = localValue132?.["success"] === true ? "sent" : "failed",
        localValue134 = await window.imStorage.finishAwayReturn(localValue126, localValue128.id, localValue133, Date.now());
      localValue127 = localValue2(localValue126), localValue127?.["awayActivity"]?.["id"] === localValue128.id && localValue134 && (localValue127.awayActivity = localValue7(localValue134), await localValue15(localValue127, localValue127.awayActivity));
    } catch (localValue137) {
      console.error("[iMessage away return] failed", localValue137);
      if (localValue130) {
        const localValue138 = await window.imStorage.finishAwayReturn(localValue126, localValue128.id, "failed", Date.now())["catch"](() => null);
        localValue127 = localValue2(localValue126);
        if (localValue127?.["awayActivity"]?.["id"] === localValue128.id && localValue138) localValue127.awayActivity = localValue7(localValue138);
      }
    } finally {
      localValue6["delete"](String(localValue126)), localValue19();
    }
    return true;
  }
  function localValue26() {
    if (localValue3 != null) clearTimeout(localValue3);
    const localValue139 = Date.now();
    let localValue140 = 60000;
    for (const localValue141 of window.imData?.["friends"] || []) {
      if (localValue141.type !== "char") continue;
      const localValue142 = localValue7(localValue141.awayActivity);
      if (!localValue142 || localValue142.status !== "active") continue;
      if (localValue142.endsAt > localValue139) localValue140 = Math.min(localValue140, localValue142.endsAt - localValue139);
      localValue141.awayReturnEnabled === true && localValue142.deliveryStatus === "pending" && (localValue140 = Math.min(localValue140, localValue142.returnAt > localValue139 ? localValue142.returnAt - localValue139 : 1000));
    }
    localValue3 = setTimeout(() => {
      void localValue27();
    }, Math.max(100, localValue140));
  }
  function localValue27() {
    if (localValue4) return localValue4;
    return localValue4 = (async () => {
      for (const localValue143 of window.imData?.["friends"] || []) {
        try {
          await localValue25(localValue143.id);
        } catch (localValue144) {
          console.error("[iMessage away activity] check failed", localValue144);
        }
      }
    })()["finally"](() => {
      localValue4 = null, localValue19();
    }), localValue4;
  }
  localValue1.awayActivity = {
    "normalize": localValue7,
    "consume": localValue8,
    "prompt": localValue13,
    "apply": localValue16,
    "removeSources": localValue17,
    "setEnabled": localValue18,
    "renderNotice": localValue20,
    "openDetail": localValue23,
    "refresh": localValue19,
    "check": localValue27,
    "run": localValue25,
    "due": localValue24,
    "label": localValue11,
    "deliveryLabel": localValue12
  }, (window.u2OnStorageReady || (localValue145 => document.addEventListener("DOMContentLoaded", localValue145)))(() => {
    for (const localValue146 of ["pageshow", "online", "u2:native-resume", "u2:background-activity-tick"]) {
      window.addEventListener(localValue146, () => {
        void localValue27();
      });
    }
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) void localValue27();
    }), void localValue27();
  });
})();
