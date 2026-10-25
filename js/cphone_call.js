(function () {
  'use strict';

  const apk119Value1 = 604800000,
    apk119Value2 = (apk119Value14, apk119Value15 = 2000) => typeof apk119Value14 === "string" ? apk119Value14.trim().slice(0, apk119Value15) : "",
    apk119Value3 = apk119Value16 => String(apk119Value16 ?? "").replace(/[&<>"']/g, apk119Value17 => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[apk119Value17]),
    apk119Value4 = apk119Value18 => apk119Value18?.["nickname"] || apk119Value18?.["realName"] || apk119Value18?.["realname"] || "联系人",
    apk119Value5 = apk119Value19 => apk119Value19 + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10),
    apk119Value6 = apk119Value20 => (window.imData?.["friends"] || []).find(apk119Value21 => String(apk119Value21.id) === String(apk119Value20)),
    apk119Value7 = apk119Value22 => document.getElementById(apk119Value22),
    apk119Value8 = apk119Value23 => Number(apk119Value23?.["occurredAt"]) || Number(apk119Value23?.["generatedAt"]) || 0,
    apk119Value9 = apk119Value24 => apk119Value24.status || (apk119Value24.type === "missed" ? "missed" : "connected"),
    apk119Value10 = apk119Value25 => ({
      missed: "未接来电",
      rejected: "已拒接",
      cancelled: "已取消"
    })[apk119Value9(apk119Value25)] || (apk119Value25.type === "outgoing" ? "呼出通话" : "呼入通话"),
    apk119Value11 = apk119Value26 => {
      const {
        id: apk119Value27,
        legacyIndex: apk119Value28,
        ...apk119Value29
      } = apk119Value26;
      return JSON.stringify(apk119Value29);
    },
    apk119Value12 = (apk119Value30, apk119Value31, apk119Value32 = "") => {
      const apk119Value33 = String(apk119Value30 || ""),
        apk119Value34 = /^(https?:|blob:|file:|data:image\/)/i.test(apk119Value33) || !/^[a-z][a-z\d+.-]*:/i.test(apk119Value33) ? apk119Value33 : "";
      return "<span class=\"cphone-avatar cphone-call-avatar " + apk119Value32 + "\" aria-hidden=\"true\">" + (apk119Value34 ? "<img src=\"" + apk119Value3(apk119Value34) + "\" alt=\"\" loading=\"lazy\">" : '<i class="fas fa-user" aria-hidden="true"></i>') + "</span>";
    },
    apk119Value13 = {
      initialized: false,
      ownerId: "",
      tab: "recent",
      jobs: new Map(),
      contactDeletes: new Set(),
      notices: new Map(),
      contactRows: new Map(),
      recordRows: new Map(),
      activeContactKey: "",
      activeRecordId: "",
      activeRecordSnapshot: null,
      previousFocus: null,
      getOwner() {
        return apk119Value6(this.ownerId);
      },
      getUserIdentity(apk119Value35) {
        return window.cphoneApp?.["getUserIdentity"]?.(apk119Value35) || window.imApp?.["getCharUserIdentity"]?.(apk119Value35) || {
          name: window.userState?.["name"] || "User",
          avatarUrl: window.userState?.["avatarUrl"] || "",
          persona: window.userState?.["persona"] || ""
        };
      },
      getContacts(apk119Value36, {
        includeHidden = false
      } = {}) {
        if (!apk119Value36) return [];
        const apk119Value37 = this.getUserIdentity(apk119Value36),
          apk119Value38 = [{
            key: "user",
            id: "user",
            kind: "user",
            name: apk119Value37.name || "User",
            avatarUrl: apk119Value37.avatarUrl || "",
            persona: apk119Value37.persona || "",
            relationship: apk119Value36.relationship || "User"
          }],
          apk119Value39 = new Set();
        (Array.isArray(apk119Value36.memory?.["relationships"]) ? apk119Value36.memory.relationships : []).forEach(apk119Value41 => {
          const apk119Value42 = String(apk119Value41?.["targetId"] ?? apk119Value41?.["npcId"] ?? ""),
            apk119Value43 = apk119Value6(apk119Value42);
          if (!apk119Value43 || !["char", "npc"].includes(apk119Value43.type) || apk119Value42 === String(apk119Value36.id) || apk119Value39.has(apk119Value42)) return;
          apk119Value39.add(apk119Value42);
          const apk119Value44 = (apk119Value36.linkedAccountChats || []).find(apk119Value45 => String(apk119Value45.sourceNpcId || "") === apk119Value42);
          apk119Value38.push({
            key: "relationship:" + apk119Value42,
            id: apk119Value42,
            kind: "relationship",
            name: apk119Value4(apk119Value43),
            avatarUrl: apk119Value43.avatarUrl || "",
            persona: apk119Value43.persona || apk119Value43.signature || apk119Value44?.["persona"] || "",
            relationship: apk119Value41.relation || apk119Value44?.["relationship"] || "联系人"
          });
        }), (Array.isArray(apk119Value36.callData?.["contacts"]) ? apk119Value36.callData.contacts : []).forEach((apk119Value46, apk119Value47) => {
          if (!apk119Value46 || apk119Value46.kind === "stranger") return;
          const apk119Value48 = String(apk119Value46.targetId || "");
          if (apk119Value46.kind === "relationship" && apk119Value39.has(apk119Value48) || apk119Value46.kind === "user") return;
          const apk119Value49 = String(apk119Value46.id || "legacy-" + apk119Value47);
          apk119Value38.push({
            key: "local:" + apk119Value49,
            id: apk119Value49,
            kind: "local",
            name: apk119Value2(apk119Value46.name, 80) || "联系人",
            avatarUrl: apk119Value46.avatarUrl || "",
            persona: apk119Value46.persona || "",
            relationship: apk119Value46.relationship || apk119Value46.callReason || "手机联系人"
          });
        });
        const apk119Value40 = new Set(Array.isArray(apk119Value36.callData?.["hiddenContactKeys"]) ? apk119Value36.callData.hiddenContactKeys : []);
        return includeHidden ? apk119Value38 : apk119Value38.filter(apk119Value50 => !apk119Value40.has(apk119Value50.key));
      },
      getRecords(apk119Value51) {
        return (Array.isArray(apk119Value51?.["callData"]?.["recentCalls"]) ? apk119Value51.callData.recentCalls : []).map((apk119Value52, apk119Value53) => apk119Value52 && typeof apk119Value52 === "object" ? {
          ...apk119Value52,
          id: String(apk119Value52.id || "legacy-call-" + apk119Value53),
          legacyIndex: apk119Value53
        } : null).filter(Boolean).sort((apk119Value54, apk119Value55) => apk119Value8(apk119Value55) - apk119Value8(apk119Value54));
      },
      resolveContact(apk119Value56, apk119Value57) {
        if (apk119Value57.contactKind === "stranger") return null;
        const apk119Value58 = apk119Value57.contactKey || (apk119Value57.contactKind === "user" ? "user" : apk119Value57.contactId ? apk119Value57.contactKind + ":" + apk119Value57.contactId : "");
        return apk119Value58 ? this.getContacts(apk119Value56).find(apk119Value59 => apk119Value59.key === apk119Value58) || null : null;
      },
      getDisplay(apk119Value60, apk119Value61) {
        const apk119Value62 = this.resolveContact(apk119Value60, apk119Value61);
        return {
          name: apk119Value62?.["name"] || apk119Value61.name || (apk119Value61.contactKind === "stranger" ? "陌生号码" : "未知联系人"),
          avatarUrl: apk119Value62?.["avatarUrl"] || apk119Value61.avatarUrl || "",
          relationship: apk119Value62?.["relationship"] || apk119Value61.relationship || "",
          contact: apk119Value62
        };
      },
      beginJob(apk119Value63) {
        if (!apk119Value63 || !apk119Value6(apk119Value63.id)) throw new Error("当前角色已不存在");
        const apk119Value64 = String(apk119Value63.id);
        if (this.jobs.has(apk119Value64)) throw new Error("这个角色的通话正在生成，请稍候");
        const apk119Value65 = {
          ownerId: apk119Value64,
          ownerName: apk119Value4(apk119Value63),
          token: apk119Value5("call-job")
        };
        return this.jobs.set(apk119Value64, apk119Value65), this.setNotice(apk119Value64, "正在生成通话，关闭弹窗后仍会继续…"), window.showToast?.("正在生成通话…"), apk119Value65;
      },
      endJob(apk119Value66) {
        if (apk119Value66 && this.jobs.get(apk119Value66.ownerId) === apk119Value66) this.jobs["delete"](apk119Value66.ownerId);
        this.updateStatus();
      },
      setNotice(apk119Value67, apk119Value68, apk119Value69 = false) {
        this.notices.set(String(apk119Value67), {
          message: apk119Value68,
          isError: apk119Value69
        });
        if (String(apk119Value67) === this.ownerId) this.updateStatus();
      },
      updateStatus() {
        const apk119Value70 = this.jobs.has(this.ownerId);
        for (const apk119Value72 of ["friend-call-generate", "cphone-call-generate-submit"]) {
          const apk119Value73 = apk119Value7(apk119Value72);
          apk119Value73 && (apk119Value73.disabled = apk119Value70, apk119Value73.setAttribute("aria-busy", String(apk119Value70)));
        }
        const apk119Value71 = apk119Value7("cphone-call-generate-submit");
        if (apk119Value71) apk119Value71.textContent = apk119Value70 ? "生成中…" : "生成通话记录";
      },
      buildGenerationPrompt(apk119Value74, apk119Value75) {
        const apk119Value76 = this.getContacts(apk119Value74),
          apk119Value77 = this.getUserIdentity(apk119Value74),
          apk119Value78 = apk119Value4(apk119Value74),
          apk119Value79 = apk119Value77.name || apk119Value77.accountName || "User",
          apk119Value80 = (apk119Value88, apk119Value89 = apk119Value78) => String(apk119Value88 || "").replace(/\{\{\s*(user|char)\s*\}\}/gi, (apk119Value90, apk119Value91) => apk119Value91.toLowerCase() === "user" ? apk119Value79 : apk119Value89),
          apk119Value81 = new Set(apk119Value76.map(apk119Value92 => apk119Value92.key)),
          apk119Value82 = this.getContacts(apk119Value74, {
            includeHidden: true
          }).filter(apk119Value93 => !apk119Value81.has(apk119Value93.key)).map(apk119Value94 => apk119Value94.name),
          apk119Value83 = apk119Value76.map(apk119Value95 => {
            const apk119Value96 = (apk119Value74.linkedAccountChats || []).find(apk119Value97 => apk119Value95.kind === "relationship" && String(apk119Value97.sourceNpcId || "") === apk119Value95.id);
            return {
              key: apk119Value95.key,
              name: apk119Value95.name,
              relationship: apk119Value80(apk119Value95.relationship),
              persona: apk119Value80(apk119Value95.persona, apk119Value95.kind === "user" ? apk119Value78 : apk119Value95.name).slice(0, 5000),
              recentChat: (apk119Value96?.["messages"] || []).slice(-10).map(apk119Value98 => ({
                speaker: apk119Value98.role === "char" ? apk119Value78 : apk119Value95.name,
                text: apk119Value80(apk119Value98.content || apk119Value98.text).slice(0, 1000)
              }))
            };
          }),
          apk119Value84 = apk119Value74.phoneIncludeChatContext === false ? [] : (window.cphoneApp?.["getCharUserMemory"]?.(apk119Value74, {
            userName: apk119Value79
          }) || []).map(apk119Value99 => ({
            ...apk119Value99,
            text: apk119Value80(apk119Value99.text),
            translation: apk119Value80(apk119Value99.translation)
          })),
          apk119Value85 = [apk119Value74.persona, ...apk119Value83.map(apk119Value100 => apk119Value100.relationship)].join("\n"),
          apk119Value86 = ["system_depth", "before_role", "after_role"].map(apk119Value101 => {
            const apk119Value102 = window.getGlobalWorldBookContextByPosition?.(apk119Value101, apk119Value85) || "",
              apk119Value103 = window.imApp?.["getWorldBookContextForFriendByPosition"]?.(apk119Value101, apk119Value74, apk119Value85, {
                includeGlobal: false
              }) || "";
            return [apk119Value102, apk119Value103].filter(Boolean).join("\n");
          }).filter(Boolean).join("\n"),
          apk119Value87 = this.getRecords(apk119Value74).slice(0, 12).map(apk119Value104 => ({
            name: this.getDisplay(apk119Value74, apk119Value104).name,
            reason: apk119Value80(apk119Value104.reason),
            summary: apk119Value80(apk119Value104.summary)
          }));
        return "为 " + apk119Value78 + " 的 Cphone 新增准确 " + apk119Value75 + " 条自然、完整的通话记录。只返回 JSON 对象，不要 Markdown。\n人物姓名与称呼：手机主人（Char）" + JSON.stringify({
          name: apk119Value78,
          realName: apk119Value74.realName || apk119Value74.realname || apk119Value78
        }) + "；绑定用户（User）" + JSON.stringify({
          name: apk119Value79,
          accountName: apk119Value77.accountName || apk119Value79,
          remark: apk119Value77.remark || ""
        }) + "。\n称呼规则：User、Char、user、char、contact 只是身份或 JSON 标识，不是人物姓名。reason、summary、transcript 的 text 及所有中文翻译中，提到人物时必须使用上述实际姓名、已有备注或符合关系的自然称呼，不得直接喊 User 或 Char（人物实际姓名本来就是该词时除外），也不得输出 {{user}}、{{char}} 等占位符。不要为了体现姓名而每句重复称呼。历史资料里出现的身份标签也必须按此规则理解。\n手机主人 " + apk119Value78 + " 的人设：" + apk119Value80(apk119Value74.persona || apk119Value74.signature || "未设置").slice(0, 8000) + "。\n绑定用户 " + apk119Value79 + " 的人设（仅供 " + apk119Value78 + " 与 " + apk119Value79 + " 的私人语境参考，不代表 " + apk119Value79 + " 参与所有通话）：" + JSON.stringify({
          name: apk119Value79,
          persona: apk119Value80(apk119Value77.persona || "未设置").slice(0, 8000)
        }) + "。\n语言：" + (apk119Value74.language || "zh") + "。已有姓名必须原样保留，不强制改成中文。叙事和通话原文遵循手机主人语言，非中文 reason、summary 分别提供 reasonTranslationZh、summaryTranslationZh，每句非中文对话提供 translation；中文译文留空。\n已有联系人注册表：" + JSON.stringify(apk119Value83) + "。\n已从 Call 移除的人物：" + JSON.stringify(apk119Value82) + "。不要通过新建熟人或陌生电话重新引入这些人物。\n双方私聊参考（仅 " + apk119Value78 + " 与 " + apk119Value79 + " 知道，其他人不默认知情）：" + JSON.stringify(apk119Value84) + "。\n世界书（遵守人物各自的知情范围）：" + (apk119Value80(apk119Value86) || "无") + "。\n已保存的近期通话（避免重复话题和套路）：" + JSON.stringify(apk119Value87) + "。\n有已有联系人时优先从中选择，contactKey 必须原样使用注册表的 key；" + apk119Value79 + " 只在注册表存在 user 且 contactKey=user 时参与该通话，user 对应的姓名是 " + JSON.stringify(apk119Value79) + "。允许少量关系网外的熟人：在 contacts 中声明临时 key（例如 new1）、姓名、关系、独立人设，记录使用 new:new1；这些人只保存到 Call 通讯录。不要另造同名身份替代注册表人物。\n也允许快递、推销、误拨等陌生电话：contactKey 固定为 stranger，name 写来电身份或陌生号码，不能添加到 contacts；陌生人不得自称与 " + apk119Value78 + " 熟识或知道私人往事。不要每批机械新增熟人或安排陌生电话。\ntype 只能 incoming 或 outgoing；status 只能 connected、missed、rejected、cancelled。missed/rejected 只用于 incoming，cancelled 只用于 outgoing。已接通为主，未接/拒接/取消的 durationSeconds 必须为 0、transcript 必须 []，只说明来电事由或未接情况，不能编造通话内容。\n每条必须有具体 reason 和简短 summary。接通记录的 transcript 为双方逐句对话，speaker 只用 char、contact：char 对应 " + JSON.stringify(apk119Value78) + "，contact 对应该条 contactKey 在注册表中的实际人物（或新熟人、陌生来电身份），不固定代表绑定用户；双方都必须发言；熟人通常 12–24 句，有自然开场、沟通展开和收尾；办事/陌生电话通常 4–10 句，按实际场景写，不灌水、不使用旁白替代对话。durationSeconds 为与内容长度相称的正整数，最长 7200 秒。\nminutesAgo 是通话结束距生成时刻的分钟数（0–10000 整数），选择过去七天内符合人物作息的分散时段，避免每条相同或等间隔；实际日期时间、ID、生成时间由前端计算，不输出时间戳。" + (apk119Value74.phoneIncludeRealTime === false ? "" : "当前时间仅供语境参考：" + new Date().toLocaleString("zh-CN") + "。") + "\n返回格式：{\"contacts\":[{\"key\":\"new1\",\"name\":\"姓名\",\"relationship\":\"与 Char 的关系\",\"persona\":\"独立人设\"}],\"recentCalls\":[{\"contactKey\":\"user / 注册表key / new:new1 / stranger\",\"name\":\"仅陌生电话需要的来电身份\",\"type\":\"incoming\",\"status\":\"connected\",\"minutesAgo\":30,\"durationSeconds\":120,\"reason\":\"通话事由\",\"reasonTranslationZh\":\"\",\"summary\":\"内容摘要\",\"summaryTranslationZh\":\"\",\"transcript\":[{\"speaker\":\"char\",\"text\":\"通话原文\",\"translation\":\"\"},{\"speaker\":\"contact\",\"text\":\"通话原文\",\"translation\":\"\"}]}]}。contacts 没有新增熟人时返回 []；recentCalls 必须恰好 " + apk119Value75 + " 条。";
      },
      normalizeGeneratedData(apk119Value105, apk119Value106, apk119Value107, apk119Value108 = Date.now()) {
        const apk119Value109 = apk119Value106?.["call"] || apk119Value106;
        if (!Number.isInteger(apk119Value107) || apk119Value107 < 1 || apk119Value107 > 20 || !Array.isArray(apk119Value109?.["recentCalls"]) || apk119Value109.recentCalls.length !== apk119Value107) throw new Error("通话记录数量必须为 " + apk119Value107 + " 条");
        if (apk119Value109.contacts != null && !Array.isArray(apk119Value109.contacts)) throw new Error("新联系人格式无效");
        const apk119Value110 = new Map(this.getContacts(apk119Value105).map(apk119Value119 => [apk119Value119.key, apk119Value119])),
          apk119Value111 = [],
          apk119Value112 = new Set(),
          apk119Value113 = new Set(this.getContacts(apk119Value105, {
            includeHidden: true
          }).map(apk119Value120 => apk119Value120.name.trim().toLocaleLowerCase()));
        (apk119Value109.contacts || []).forEach(apk119Value121 => {
          const apk119Value122 = apk119Value2(apk119Value121?.["key"], 80),
            apk119Value123 = apk119Value2(apk119Value121?.["name"], 80),
            apk119Value124 = apk119Value2(apk119Value121?.["relationship"], 200),
            apk119Value125 = apk119Value2(apk119Value121?.["persona"], 5000);
          if (!/^[a-zA-Z0-9_-]{1,80}$/.test(apk119Value122) || apk119Value112.has(apk119Value122) || !apk119Value123 || !apk119Value124 || !apk119Value125) throw new Error("新联系人资料不完整或标识重复");
          if (apk119Value113.has(apk119Value123.toLocaleLowerCase())) throw new Error("新联系人与已有联系人同名，请使用已有联系人标识");
          apk119Value112.add(apk119Value122), apk119Value113.add(apk119Value123.toLocaleLowerCase());
          const apk119Value126 = {
            id: apk119Value5("call-contact"),
            kind: "local",
            name: apk119Value123,
            relationship: apk119Value124,
            persona: apk119Value125
          };
          apk119Value111.push(apk119Value126), apk119Value110.set("new:" + apk119Value122, {
            ...apk119Value126,
            key: "local:" + apk119Value126.id
          });
        });
        const apk119Value114 = this.getRecords(apk119Value105).filter(apk119Value127 => Number(apk119Value127.occurredAt) > apk119Value108 - apk119Value1 && Number(apk119Value127.occurredAt) <= apk119Value108).map(apk119Value128 => ({
            start: Number(apk119Value128.occurredAt),
            end: Number(apk119Value128.occurredAt) + Math.max(30, Number(apk119Value128.durationSeconds) || 0) * 1000
          })),
          apk119Value115 = new Set(),
          apk119Value116 = !/^zh(?:[-_]|$)/i.test(apk119Value105.language || "zh"),
          apk119Value117 = (apk119Value129, apk119Value130) => {
            if (apk119Value116 && /[^\p{Script=Han}\p{P}\p{N}\p{Z}\p{S}\s]/u.test(apk119Value129) && !apk119Value130) throw new Error("非中文通话内容缺少中文翻译");
          },
          apk119Value118 = apk119Value109.recentCalls.map(apk119Value131 => {
            const apk119Value132 = apk119Value2(apk119Value131?.["contactKey"], 200),
              apk119Value133 = apk119Value132 === "stranger",
              apk119Value134 = apk119Value110.get(apk119Value132);
            if (!apk119Value133 && !apk119Value134) throw new Error("通话引用的联系人不存在或关系网已变化，请重新生成");
            if (apk119Value132.startsWith("new:")) apk119Value115.add(apk119Value132.slice(4));
            const apk119Value135 = apk119Value131.type,
              apk119Value136 = apk119Value131.status;
            if (!["incoming", "outgoing"].includes(apk119Value135) || !["connected", "missed", "rejected", "cancelled"].includes(apk119Value136) || ["missed", "rejected"].includes(apk119Value136) && apk119Value135 !== "incoming" || apk119Value136 === "cancelled" && apk119Value135 !== "outgoing") throw new Error("通话方向与状态不一致");
            const apk119Value137 = apk119Value2(apk119Value131.reason),
              apk119Value138 = apk119Value2(apk119Value131.summary, 4000),
              apk119Value139 = apk119Value116 ? apk119Value2(apk119Value131.reasonTranslationZh) : "",
              apk119Value140 = apk119Value116 ? apk119Value2(apk119Value131.summaryTranslationZh, 4000) : "";
            if (!apk119Value137 || !apk119Value138) throw new Error("通话缺少事由或摘要");
            apk119Value117(apk119Value137, apk119Value139), apk119Value117(apk119Value138, apk119Value140);
            if (!Array.isArray(apk119Value131.transcript) || apk119Value131.transcript.length > 80) throw new Error("通话对话格式无效");
            const apk119Value141 = apk119Value131.transcript.map(apk119Value148 => {
              const apk119Value149 = apk119Value148?.["speaker"],
                apk119Value150 = apk119Value2(apk119Value148?.["text"], 2000),
                apk119Value151 = apk119Value116 ? apk119Value2(apk119Value148?.["translation"], 2000) : "";
              if (!["char", "contact"].includes(apk119Value149) || !apk119Value150) throw new Error("通话存在无效发言");
              return apk119Value117(apk119Value150, apk119Value151), {
                speaker: apk119Value149,
                text: apk119Value150,
                translation: apk119Value151
              };
            });
            let apk119Value142 = Number(apk119Value131.durationSeconds);
            if (!Number.isInteger(apk119Value142) || apk119Value142 < 0 || apk119Value142 > 7200) throw new Error("通话时长无效");
            if (apk119Value136 === "connected") {
              if (apk119Value141.length < 4 || new Set(apk119Value141.map(apk119Value153 => apk119Value153.speaker)).size !== 2 || apk119Value142 === 0) throw new Error("已接通的电话需要完整的双方对话和时长");
              const apk119Value152 = apk119Value141.reduce((apk119Value154, apk119Value155) => apk119Value154 + apk119Value155.text.length, 0);
              apk119Value142 = Math.max(apk119Value142, Math.ceil(apk119Value152 / 5) + apk119Value141.length * 2);
              if (apk119Value142 > 7200) throw new Error("通话内容过长");
            } else {
              if (apk119Value142 !== 0 || apk119Value141.length) throw new Error("未接通的电话不能有通话时长或对话");
            }
            const apk119Value143 = Number(apk119Value131.minutesAgo);
            if (!Number.isInteger(apk119Value143) || apk119Value143 < 0 || apk119Value143 > 10000) throw new Error("通话时间应位于最近七天");
            const apk119Value144 = Math.max(30, apk119Value142) * 1000;
            let apk119Value145 = apk119Value108 - apk119Value143 * 60000 - apk119Value144,
              apk119Value146;
            while (apk119Value146 = apk119Value114.find(apk119Value156 => apk119Value145 < apk119Value156.end + 30000 && apk119Value145 + apk119Value144 > apk119Value156.start - 30000)) {
              apk119Value145 = apk119Value146.start - 30000 - apk119Value144;
            }
            if (apk119Value145 < apk119Value108 - apk119Value1 || apk119Value145 + apk119Value144 > apk119Value108) throw new Error("最近七天没有合适的通话时段，请重试");
            apk119Value114.push({
              start: apk119Value145,
              end: apk119Value145 + apk119Value144
            });
            const apk119Value147 = apk119Value133 ? apk119Value2(apk119Value131.name, 80) : apk119Value134.name;
            if (!apk119Value147) throw new Error("陌生来电缺少显示身份");
            return {
              id: apk119Value5("call"),
              contactKey: apk119Value133 ? "" : apk119Value134.key,
              contactId: apk119Value133 ? "" : apk119Value134.id,
              contactKind: apk119Value133 ? "stranger" : apk119Value134.kind,
              name: apk119Value147,
              avatarUrl: apk119Value134?.["avatarUrl"] || "",
              relationship: apk119Value134?.["relationship"] || "",
              type: apk119Value135,
              status: apk119Value136,
              occurredAt: apk119Value145,
              generatedAt: apk119Value108,
              durationSeconds: apk119Value142,
              reason: apk119Value137,
              reasonTranslationZh: apk119Value139,
              summary: apk119Value138,
              summaryTranslationZh: apk119Value140,
              transcript: apk119Value141
            };
          });
        if ([...apk119Value112].some(apk119Value157 => !apk119Value115.has(apk119Value157))) throw new Error("生成了没有对应通话的新联系人");
        return {
          version: 2,
          contacts: apk119Value111,
          recentCalls: apk119Value118
        };
      },
      mergeGeneratedData(apk119Value158, apk119Value159, apk119Value160 = {}) {
        const apk119Value161 = apk119Value159?.["call"] || apk119Value159,
          apk119Value162 = this.normalizeGeneratedData(apk119Value158, apk119Value161, apk119Value160.count ?? apk119Value161?.["recentCalls"]?.["length"], apk119Value160.generatedAt || Date.now()),
          apk119Value163 = apk119Value158.callData || {};
        return {
          ...apk119Value163,
          version: 2,
          contacts: [...(Array.isArray(apk119Value163.contacts) ? apk119Value163.contacts : []), ...apk119Value162.contacts],
          recentCalls: [...(Array.isArray(apk119Value163.recentCalls) ? apk119Value163.recentCalls : []), ...apk119Value162.recentCalls].sort((apk119Value164, apk119Value165) => apk119Value8(apk119Value165) - apk119Value8(apk119Value164))
        };
      },
      async generate() {
        const apk119Value166 = this.getOwner(),
          apk119Value167 = String(apk119Value7("cphone-call-generate-count")?.["value"] || "").trim(),
          apk119Value168 = Number(apk119Value167);
        if (!apk119Value167 || !Number.isInteger(apk119Value168) || apk119Value168 < 1 || apk119Value168 > 20) return this.showGenerationError("请输入 1–20 的整数"), false;
        let apk119Value169;
        try {
          apk119Value169 = this.beginJob(apk119Value166), this.showGenerationError("");
          if (apk119Value166.phoneIncludeChatContext !== false) await window.lovesApp?.["ensureFriendPhoneMessagesLoaded"]?.(apk119Value166);
          const apk119Value170 = apk119Value6(apk119Value169.ownerId);
          if (!apk119Value170) throw new Error("发起生成的角色已被删除，结果未保存");
          const apk119Value171 = await window.cphoneApp.requestJsonGeneration(this.buildGenerationPrompt(apk119Value170, apk119Value168));
          if (!apk119Value6(apk119Value169.ownerId)) throw new Error("发起生成的角色已被删除，结果未保存");
          this.normalizeGeneratedData(apk119Value6(apk119Value169.ownerId), apk119Value171, apk119Value168);
          const apk119Value172 = await window.lovesApp.persistFriendState(apk119Value6(apk119Value169.ownerId), {
            metaOnly: true,
            mutate: apk119Value173 => {
              apk119Value173.callData = this.mergeGeneratedData(apk119Value173, apk119Value171, {
                count: apk119Value168
              });
            }
          });
          if (!apk119Value172) throw new Error("通话保存失败，已撤销本次生成");
          return this.setNotice(apk119Value169.ownerId, "已新增 " + apk119Value168 + " 条通话记录"), window.showToast?.(apk119Value169.ownerName + " 的 " + apk119Value168 + " 条通话已生成"), this.ownerId === apk119Value169.ownerId && (this.closeSheet("generate"), this.tab = "recent", this.render()), true;
        } catch (apk119Value174) {
          const apk119Value175 = apk119Value174?.["message"] || "通话生成失败，请重试";
          if (apk119Value169) this.setNotice(apk119Value169.ownerId, apk119Value175, true);
          if (!apk119Value169 || this.ownerId === apk119Value169.ownerId) this.showGenerationError(apk119Value175);
          if (!window.u2Api?.["isRequestError"]?.(apk119Value174) || !window.u2Api.reportError?.(apk119Value174, {
            operation: "通话生成"
          })) window.showToast?.(apk119Value175);
          return false;
        } finally {
          this.endJob(apk119Value169);
        }
      },
      showGenerationError(apk119Value176) {
        const apk119Value177 = apk119Value7("cphone-call-generate-error");
        apk119Value177 && (apk119Value177.textContent = apk119Value176, apk119Value177.hidden = !apk119Value176);
      },
      init() {
        if (this.initialized || !apk119Value7("friend-phonecall-view")) return;
        this.view = apk119Value7("friend-phonecall-view"), apk119Value7("friend-phonecall-back-btn")?.["addEventListener"]("click", () => this.close()), apk119Value7("friend-call-generate")?.["addEventListener"]("click", () => this.openGenerator()), apk119Value7("cphone-call-generate-form")?.["addEventListener"]("submit", apk119Value178 => {
          apk119Value178.preventDefault(), void this.generate();
        });
        for (const [apk119Value179, apk119Value180] of [["friend-call-tab-recent", "recent"], ["friend-call-tab-contacts", "contacts"]]) {
          apk119Value7(apk119Value179)?.["addEventListener"]("click", () => {
            this.tab = apk119Value180, this.render();
          }), apk119Value7(apk119Value179)?.["addEventListener"]("keydown", apk119Value181 => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(apk119Value181.key)) return;
            apk119Value181.preventDefault(), this.tab = apk119Value181.key === "Home" ? "recent" : apk119Value181.key === "End" ? "contacts" : apk119Value180 === "recent" ? "contacts" : "recent", this.render(), apk119Value7(this.tab === "recent" ? "friend-call-tab-recent" : "friend-call-tab-contacts")?.["focus"]();
          });
        }
        this.view.addEventListener("click", apk119Value182 => {
          const apk119Value183 = apk119Value182.target.closest("[data-call-close]");
          if (apk119Value183) return this.closeSheet(apk119Value183.dataset.callClose);
          if (apk119Value182.target === apk119Value7("cphone-call-generate-sheet")) return this.closeSheet("generate");
          if (apk119Value182.target === apk119Value7("cphone-call-detail-sheet")) return this.closeSheet("detail");
          const apk119Value184 = apk119Value182.target.closest("[data-call-record]");
          if (apk119Value184) return this.showCall(apk119Value184.dataset.callRecord);
          const apk119Value185 = apk119Value182.target.closest("[data-call-contact]");
          if (apk119Value185) return this.showContact(apk119Value185.dataset.callContact);
          const apk119Value186 = apk119Value182.target.closest("[data-call-delete-contact]");
          if (apk119Value186) return void this.deleteContact(apk119Value186.dataset.callDeleteContact);
          const apk119Value187 = apk119Value182.target.closest("[data-call-delete]");
          if (apk119Value187) return void this.deleteCall(apk119Value187.dataset.callDelete);
          const apk119Value188 = apk119Value182.target.closest("[data-call-translation]");
          if (apk119Value188) {
            const apk119Value189 = apk119Value188.nextElementSibling;
            apk119Value189.hidden = !apk119Value189.hidden, apk119Value188.setAttribute("aria-expanded", String(!apk119Value189.hidden)), apk119Value188.textContent = apk119Value189.hidden ? "查看翻译" : "收起翻译";
          }
        }), this.view.addEventListener("keydown", apk119Value190 => {
          const apk119Value191 = !apk119Value7("cphone-call-detail-sheet")?.["hidden"] ? apk119Value7("cphone-call-detail-sheet") : !apk119Value7("cphone-call-generate-sheet")?.["hidden"] ? apk119Value7("cphone-call-generate-sheet") : null;
          if (!apk119Value191) return;
          apk119Value190.key === "Escape" && (apk119Value190.preventDefault(), this.closeSheet(apk119Value191 === apk119Value7("cphone-call-detail-sheet") ? "detail" : "generate"));
          if (apk119Value190.key === "Tab") {
            const apk119Value192 = Array.from(apk119Value191.querySelectorAll("button:not(:disabled), input:not(:disabled), [tabindex=\"0\"]")).filter(apk119Value195 => !apk119Value195.hidden),
              apk119Value193 = apk119Value192[0],
              apk119Value194 = apk119Value192.at(-1);
            if (apk119Value190.shiftKey && (document.activeElement === apk119Value193 || !apk119Value192.includes(document.activeElement))) apk119Value190.preventDefault(), apk119Value194?.["focus"]();else !apk119Value190.shiftKey && document.activeElement === apk119Value194 && (apk119Value190.preventDefault(), apk119Value193?.["focus"]());
          }
        }), window.mobileInputCompat?.["registerFocusScope"]?.({
          selector: "#friend-phonecall-view.active",
          priority: 40,
          preferFocusScope: true,
          followViewportOrigin: true,
          resolveScrollContainer: apk119Value196 => apk119Value196.closest(".cphone-call-generate-card"),
          scrollBehavior: "focus"
        });
        for (const apk119Value197 of ["account-updated", "user-state-updated", "u2:friend-account-binding-changed", "u2:char-user-remark-changed", "u2:linked-accounts-changed", "u2:friend-removed"]) {
          window.addEventListener(apk119Value197, () => {
            if (!this.view.classList.contains("active")) return;
            if (!this.getOwner()) return this.close();
            this.render();
            if (this.activeContactKey) this.showContact(this.activeContactKey, false);else {
              if (this.activeRecordId) this.showCall(this.activeRecordId, false);
            }
          });
        }
        this.initialized = true;
      },
      open(apk119Value198) {
        this.init();
        if (!apk119Value198 || !this.view) return;
        this.closeSheet("generate", false), this.closeSheet("detail", false), this.ownerId = String(apk119Value198.id), this.tab = "recent", this.render(), window.openView?.(this.view);
      },
      close() {
        this.closeSheet("generate", false), this.closeSheet("detail", false), window.closeView?.(this.view);
      },
      openGenerator() {
        if (this.jobs.has(this.ownerId)) return;
        this.closeSheet("detail", false), apk119Value7("cphone-call-generate-count").value = "5", this.showGenerationError(""), this.openSheet("generate");
      },
      openSheet(apk119Value199) {
        const apk119Value200 = apk119Value7("cphone-call-" + apk119Value199 + "-sheet");
        if (!apk119Value200) return;
        if (apk119Value200.hidden) this.previousFocus = document.activeElement;
        apk119Value200.hidden = false, apk119Value7("cphone-call-page").inert = true, apk119Value200.querySelector("[role=\"dialog\"]")?.["focus"]();
      },
      closeSheet(apk119Value201, apk119Value202 = true) {
        const apk119Value203 = apk119Value7("cphone-call-" + apk119Value201 + "-sheet");
        if (apk119Value203) {
          if (apk119Value203.contains(document.activeElement)) document.activeElement.blur?.();
          apk119Value203.hidden = true;
        }
        apk119Value201 === "detail" && (this.activeContactKey = "", this.activeRecordId = "", this.activeRecordSnapshot = null);
        const apk119Value204 = apk119Value7("cphone-call-" + (apk119Value201 === "detail" ? "generate" : "detail") + "-sheet");
        if (apk119Value7("cphone-call-page")) apk119Value7("cphone-call-page").inert = !!apk119Value204 && !apk119Value204.hidden;
        if (apk119Value202 && (!apk119Value204 || apk119Value204.hidden) && this.previousFocus?.["isConnected"]) this.previousFocus.focus?.();
      },
      formatDuration(apk119Value205) {
        if (apk119Value9(apk119Value205) !== "connected") return "未接通";
        if (!Number.isFinite(Number(apk119Value205.durationSeconds)) || apk119Value205.durationSeconds == null) return "时长未知";
        const apk119Value206 = Math.max(0, Number(apk119Value205.durationSeconds));
        return Math.floor(apk119Value206 / 60) + ":" + String(apk119Value206 % 60).padStart(2, "0");
      },
      dateLabel(apk119Value207) {
        if (!apk119Value207) return "时间未知";
        const apk119Value208 = new Date(apk119Value207),
          apk119Value209 = new Date(),
          apk119Value210 = apk119Value212 => new Date(apk119Value212.getFullYear(), apk119Value212.getMonth(), apk119Value212.getDate()).getTime(),
          apk119Value211 = Math.round((apk119Value210(apk119Value209) - apk119Value210(apk119Value208)) / 86400000);
        if (apk119Value211 === 0) return "今天";
        if (apk119Value211 === 1) return "昨天";
        return apk119Value208.toLocaleDateString("zh-CN", {
          month: "long",
          day: "numeric",
          ...(apk119Value208.getFullYear() !== apk119Value209.getFullYear() ? {
            year: "numeric"
          } : {})
        });
      },
      recordHtml(apk119Value213, apk119Value214) {
        const apk119Value215 = this.getDisplay(apk119Value213, apk119Value214),
          apk119Value216 = ["missed", "rejected"].includes(apk119Value9(apk119Value214)),
          apk119Value217 = apk119Value8(apk119Value214);
        return "<button type=\"button\" class=\"cphone-sms-row cphone-call-row" + (apk119Value216 ? " is-missed" : "") + "\" data-call-record=\"" + apk119Value3(apk119Value214.id) + "\">\n                " + apk119Value12(apk119Value215.avatarUrl, apk119Value215.name, apk119Value214.contactKind === "stranger" ? "is-stranger" : "") + "\n                <span class=\"cphone-call-row-body\"><span class=\"cphone-call-row-name\">" + apk119Value3(apk119Value215.name) + (apk119Value215.contact?.["kind"] === "user" ? "<span class=\"cphone-call-star\" aria-hidden=\"true\">★</span>" : "") + "</span>\n                <span class=\"cphone-call-row-meta\"><span aria-hidden=\"true\">" + (apk119Value214.type === "outgoing" ? "↗" : "↙") + "</span> " + apk119Value10(apk119Value214) + "<span>·</span>" + apk119Value3(this.formatDuration(apk119Value214)) + "</span></span>\n                <span class=\"cphone-call-row-time\">" + (apk119Value217 ? new Date(apk119Value217).toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }) : apk119Value3(apk119Value2(apk119Value214.time, 40) || "未知")) + "<span aria-hidden=\"true\">›</span></span></button>";
      },
      render() {
        const apk119Value218 = this.getOwner();
        if (!apk119Value218 || !apk119Value7("friend-call-list")) return;
        const apk119Value219 = this.getRecords(apk119Value218),
          apk119Value220 = this.getContacts(apk119Value218);
        this.recordRows = new Map(apk119Value219.map(apk119Value222 => [apk119Value222.id, apk119Value222])), this.contactRows = new Map(apk119Value220.map(apk119Value223 => [apk119Value223.key, apk119Value223])), apk119Value7("cphone-call-owner").textContent = apk119Value4(apk119Value218) + " 的账号", apk119Value7("cphone-call-count").textContent = this.tab === "recent" ? apk119Value219.length + " 条记录" : apk119Value220.length + " 位联系人";
        for (const [apk119Value224, apk119Value225] of [["friend-call-tab-recent", "recent"], ["friend-call-tab-contacts", "contacts"]]) {
          apk119Value7(apk119Value224).classList.toggle("active", this.tab === apk119Value225), apk119Value7(apk119Value224).setAttribute("aria-selected", String(this.tab === apk119Value225)), apk119Value7(apk119Value224).tabIndex = this.tab === apk119Value225 ? 0 : -1;
        }
        apk119Value7("friend-call-list").hidden = this.tab !== "recent", apk119Value7("friend-contact-list").hidden = this.tab !== "contacts";
        let apk119Value221 = "";
        apk119Value7("friend-call-list").innerHTML = apk119Value219.length ? apk119Value219.map(apk119Value226 => {
          const apk119Value227 = this.dateLabel(apk119Value8(apk119Value226)),
            apk119Value228 = apk119Value227 !== apk119Value221 ? "<h2 class=\"cphone-call-date\">" + apk119Value3(apk119Value227) + "</h2>" : "";
          return apk119Value221 = apk119Value227, apk119Value228 + this.recordHtml(apk119Value218, apk119Value226);
        }).join("") : "<div class=\"cphone-sms-empty\">还没有通话记录</div>", apk119Value7("friend-contact-list").innerHTML = apk119Value220.length ? apk119Value220.map(apk119Value229 => "<button type=\"button\" class=\"cphone-sms-row cphone-call-row cphone-call-contact-row\" data-call-contact=\"" + apk119Value3(apk119Value229.key) + "\">\n                " + apk119Value12(apk119Value229.avatarUrl, apk119Value229.name) + "<span class=\"cphone-call-row-body\"><span class=\"cphone-call-row-name\">" + apk119Value3(apk119Value229.name) + (apk119Value229.kind === "user" ? "<span class=\"cphone-call-star\" aria-hidden=\"true\">★</span>" : "") + "</span><span class=\"cphone-call-row-meta\">" + apk119Value3(apk119Value229.relationship) + "</span></span></button>").join("") : "<div class=\"cphone-sms-empty\">暂无联系人</div>", this.updateStatus();
      },
      localized(apk119Value230, apk119Value231, apk119Value232 = "") {
        const apk119Value233 = apk119Value232 ? "<span class=\"cphone-call-speaker\">" + apk119Value3(apk119Value232) + "：</span>" : "";
        return "<p class=\"cphone-call-prose\">" + apk119Value233 + apk119Value3(apk119Value230) + "</p>" + (apk119Value231 ? "<button type=\"button\" class=\"cphone-call-translation-toggle\" data-call-translation aria-expanded=\"false\">查看翻译</button><p class=\"cphone-call-translation\" hidden>" + apk119Value233 + apk119Value3(apk119Value231) + "</p>" : "");
      },
      adaptDetailMarkup(kind, markup) {
        const host = document.createElement('div');
        host.innerHTML = markup;
        const profile = host.querySelector('.cphone-call-profile');
        if (kind === 'call') profile?.querySelector('p')?.remove();
        const shortcuts = document.createElement('div');
        shortcuts.className = 'cphone-call-shortcuts';
        shortcuts.innerHTML = [['comment','信息'],['phone-alt','电话'],['video','视频'],['envelope','邮件']].map(([icon,label]) => '<div class="cphone-call-shortcut"><i class="fas fa-'+icon+'" aria-hidden="true"></i><span>'+label+'</span></div>').join('');
        profile?.after(shortcuts);
        host.querySelectorAll('.cphone-call-facts, .cphone-call-detail-section').forEach(node => node.classList.add('cphone-call-detail-surface'));
        return host.innerHTML;
      },
      showCall(apk119Value234, apk119Value235 = true) {
        const apk119Value236 = this.getOwner(),
          apk119Value237 = this.getRecords(apk119Value236).find(apk119Value242 => apk119Value242.id === apk119Value234);
        if (!apk119Value237) {
          this.closeSheet("detail");
          return;
        }
        this.activeRecordId = apk119Value234, this.activeRecordSnapshot = apk119Value237, this.activeContactKey = "";
        const apk119Value238 = this.getDisplay(apk119Value236, apk119Value237),
          apk119Value239 = apk119Value8(apk119Value237),
          apk119Value240 = apk119Value9(apk119Value237) === "connected",
          apk119Value241 = Array.isArray(apk119Value237.transcript) ? apk119Value237.transcript : [];
        apk119Value7("cphone-call-detail-title").textContent = "通话详情", apk119Value7("cphone-call-detail-content").innerHTML = this.adaptDetailMarkup("call", "<div class=\"cphone-call-profile\">" + apk119Value12(apk119Value238.avatarUrl, apk119Value238.name) + "<h2>" + apk119Value3(apk119Value238.name) + (apk119Value238.contact?.["kind"] === "user" ? "<span class=\"cphone-call-star\" aria-hidden=\"true\">★</span>" : "") + "</h2><p>" + apk119Value3(apk119Value238.relationship || (apk119Value237.contactKind === "stranger" ? "陌生电话" : "通话记录")) + "</p></div>\n                <dl class=\"cphone-call-facts\"><div><dt>通话状态</dt><dd>" + apk119Value10(apk119Value237) + "</dd></div><div><dt>通话时长</dt><dd>" + apk119Value3(this.formatDuration(apk119Value237)) + "</dd></div><div class=\"is-wide\"><dt>通话时间</dt><dd>" + (apk119Value239 ? apk119Value3(new Date(apk119Value239).toLocaleString("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
})) : apk119Value3(apk119Value2(apk119Value237.time, 80) || "时间未知")) + "</dd></div></dl>\n                " + (apk119Value237.summary ? "<section class=\"cphone-call-detail-section\"><h3>内容摘要</h3>" + this.localized(apk119Value237.summary, apk119Value237.summaryTranslationZh) + "</section>" : "") + "\n                <section class=\"cphone-call-detail-section\"><h3>通话内容</h3>" + (!apk119Value240 ? "<p class=\"cphone-call-muted\">本次通话未接通，没有对话记录。</p>" : apk119Value241.length ? "<div class=\"cphone-call-transcript\">" + apk119Value241.map(apk119Value243 => "<div class=\"cphone-call-transcript-line\">" + this.localized(apk119Value243.text, apk119Value243.translation, apk119Value243.speaker === "char" ? apk119Value4(apk119Value236) : apk119Value238.name) + "</div>").join("") + "</div>" : this.localized(apk119Value237.dialogue || "暂无通话内容", apk119Value237.dialogueTranslationZh)) + "</section>\n                " + (apk119Value238.contact ? "<button type=\"button\" class=\"cphone-call-secondary\" data-call-contact=\"" + apk119Value3(apk119Value238.contact.key) + "\">查看联系人 <span aria-hidden=\"true\">↗</span></button>" : "") + "\n                <button type=\"button\" class=\"cphone-call-delete\" data-call-delete=\"" + apk119Value3(apk119Value234) + "\">删除通话记录</button>");
        if (apk119Value235) this.openSheet("detail");
      },
      showContact(apk119Value244, apk119Value245 = true) {
        const apk119Value246 = this.getOwner(),
          apk119Value247 = this.getContacts(apk119Value246).find(apk119Value249 => apk119Value249.key === apk119Value244);
        if (!apk119Value247) {
          this.closeSheet("detail");
          return;
        }
        this.activeContactKey = apk119Value244, this.activeRecordId = "", this.activeRecordSnapshot = null;
        const apk119Value248 = this.getRecords(apk119Value246).filter(apk119Value250 => this.resolveContact(apk119Value246, apk119Value250)?.["key"] === apk119Value244);
        apk119Value7("cphone-call-detail-title").textContent = "联系人", apk119Value7("cphone-call-detail-content").innerHTML = this.adaptDetailMarkup("contact", "<div class=\"cphone-call-profile\">" + apk119Value12(apk119Value247.avatarUrl, apk119Value247.name) + "<h2>" + apk119Value3(apk119Value247.name) + (apk119Value247.kind === "user" ? "<span class=\"cphone-call-star\" aria-hidden=\"true\">★</span>" : "") + "</h2><p>" + apk119Value3(apk119Value247.relationship) + "</p></div>\n                <section class=\"cphone-call-detail-section\"><h3>最近通话 <span>" + apk119Value248.length + "</span></h3>" + (apk119Value248.length ? apk119Value248.map(apk119Value251 => "<p class=\"cphone-call-contact-date\">" + apk119Value3(this.dateLabel(apk119Value8(apk119Value251))) + "</p>" + this.recordHtml(apk119Value246, apk119Value251)).join("") : "<p class=\"cphone-call-muted\">还没有与 TA 的通话记录。</p>") + "</section>\n                <button type=\"button\" class=\"cphone-contact-delete\" data-call-delete-contact=\"" + apk119Value3(apk119Value244) + "\"" + (this.contactDeletes.has(apk119Value246.id + ":" + apk119Value244) ? " disabled" : "") + "><i class=\"fas fa-trash-can\" aria-hidden=\"true\"></i> 删除联系人</button>");
        if (apk119Value245) this.openSheet("detail");
      },
      async deleteContact(apk119Value252) {
        const apk119Value253 = this.getOwner(),
          apk119Value254 = this.getContacts(apk119Value253).find(apk119Value257 => apk119Value257.key === apk119Value252),
          apk119Value255 = apk119Value253?.["id"] + ":" + apk119Value252;
        if (!apk119Value253 || !apk119Value254 || this.contactDeletes.has(apk119Value255) || !window.confirm("从 Call 联系人中删除“" + apk119Value254.name + "”？")) return false;
        const apk119Value256 = String(apk119Value253.id);
        this.contactDeletes.add(apk119Value255), this.render();
        if (this.activeContactKey === apk119Value252) this.showContact(apk119Value252, false);
        try {
          const apk119Value258 = await window.lovesApp.persistFriendState(apk119Value253, {
            metaOnly: true,
            mutate: apk119Value259 => {
              if (!this.getContacts(apk119Value259).some(apk119Value263 => apk119Value263.key === apk119Value252)) throw new Error("联系人已变化，请重新打开");
              const apk119Value260 = apk119Value259.callData || {},
                apk119Value261 = new Set(Array.isArray(apk119Value260.hiddenContactKeys) ? apk119Value260.hiddenContactKeys : []);
              apk119Value261.add(apk119Value252);
              const apk119Value262 = (Array.isArray(apk119Value260.contacts) ? apk119Value260.contacts : []).map((apk119Value264, apk119Value265) => apk119Value264 && typeof apk119Value264 === "object" ? {
                ...apk119Value264,
                id: apk119Value264.id || "legacy-" + apk119Value265
              } : apk119Value264);
              apk119Value259.callData = {
                ...apk119Value260,
                contacts: apk119Value262,
                hiddenContactKeys: [...apk119Value261]
              };
            }
          });
          if (!apk119Value258) throw new Error("联系人删除失败，请重试");
          if (this.ownerId === apk119Value256 && this.activeContactKey === apk119Value252) this.closeSheet("detail");
          return window.showToast?.("已删除联系人"), true;
        } catch (apk119Value266) {
          return window.showToast?.(apk119Value266?.["message"] || "联系人删除失败，请重试"), false;
        } finally {
          this.contactDeletes["delete"](apk119Value255);
          if (this.ownerId === apk119Value256) {
            this.render();
            if (this.activeContactKey === apk119Value252) this.showContact(apk119Value252, false);
          }
        }
      },
      async deleteCall(apk119Value267) {
        const apk119Value268 = this.getOwner(),
          apk119Value269 = this.activeRecordId === apk119Value267 && this.activeRecordSnapshot || this.getRecords(apk119Value268).find(apk119Value272 => apk119Value272.id === apk119Value267);
        if (!apk119Value268 || !apk119Value269 || !window.confirm("删除这条通话记录？")) return false;
        const apk119Value270 = String(apk119Value268.id),
          apk119Value271 = await window.lovesApp.persistFriendState(apk119Value268, {
            metaOnly: true,
            mutate: apk119Value273 => {
              const apk119Value274 = apk119Value273.callData?.["recentCalls"] || [];
              let apk119Value275 = apk119Value274.findIndex(apk119Value276 => String(apk119Value276?.["id"] || "") === apk119Value267);
              if (apk119Value275 < 0 && apk119Value269.id.startsWith("legacy-call-")) {
                const apk119Value277 = apk119Value274.flatMap((apk119Value278, apk119Value279) => apk119Value278 && apk119Value11(apk119Value278) === apk119Value11(apk119Value269) ? [apk119Value279] : []);
                if (apk119Value277.length === 1) apk119Value275 = apk119Value277[0];
              }
              if (apk119Value275 < 0 || !apk119Value274[apk119Value275]) throw new Error("通话记录已变化，请重新打开");
              apk119Value274.splice(apk119Value275, 1);
            }
          });
        apk119Value271 && this.ownerId === apk119Value270 && (this.closeSheet("detail"), this.render());
        if (!apk119Value271) window.showToast?.("删除失败，请重试");
        return !!apk119Value271;
      }
    };
  window.cphoneCallApp = apk119Value13, (window.u2OnStorageReady || (apk119Value280 => document.addEventListener("DOMContentLoaded", apk119Value280)))(() => apk119Value13.init());
})();