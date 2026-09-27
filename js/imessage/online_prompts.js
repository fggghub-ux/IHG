(function (value) {
  'use strict';

  const createId_2 = () => "online-" + (value.crypto?.randomUUID?.() || Date.now() + "-" + Math.random().toString(36).slice(2)),
    value_3 = value_27 => value_27 && typeof value_27 === "object" && !Array.isArray(value_27),
    value_4 = value_28 => typeof value_28 === "string" ? value_28.trim() : "",
    fixedRules_2 = Object.freeze([{
      id: "priority",
      name: "世界书、时间与前置规则",
      summary: "系统深度、时间感知和角色前规则"
    }, {
      id: "identity",
      name: "角色与用户身份",
      summary: "角色、User 与群成员身份边界"
    }, {
      id: "data",
      name: "世界书与记忆",
      summary: "角色记忆、挂载记忆与召回内容"
    }, {
      id: "behavior",
      name: "聊天行为约束",
      summary: "上下文连续性、条数与聊天行为"
    }, {
      id: "runtime",
      name: "时间与运行状态",
      summary: "当前活动、续聊和本轮运行状态"
    }, {
      id: "features",
      name: "功能权限与协议",
      summary: "支付、通话、资料卡与可用功能"
    }, {
      id: "format",
      name: "消息与输出格式",
      summary: "聊天 JSON 和附加标签格式"
    }]),
    value_6 = new Set(fixedRules_2.map(value_29 => value_29.id)),
    fixedToken_2 = value_30 => "fixed:" + value_30,
    entryToken_2 = value_31 => "entry:" + value_31,
    defaultOrder_2 = items => [fixedToken_2("priority"), fixedToken_2("identity"), fixedToken_2("data"), fixedToken_2("behavior"), ...(Array.isArray(items) ? items.map(value_32 => entryToken_2(value_32.id)) : []), fixedToken_2("runtime"), fixedToken_2("features"), fixedToken_2("format")];
  function handleAction_10(items_33, value_34, value_35) {
    const indexOf_36 = value_35.indexOf(value_34);
    for (let value_37 = indexOf_36 - 1; value_37 >= 0; value_37--) {
      const indexOf_38 = items_33.indexOf(value_35[value_37]);
      if (indexOf_38 >= 0) {
        items_33.splice(indexOf_38 + 1, 0, value_34);
        return;
      }
    }
    for (let value_39 = indexOf_36 + 1; value_39 < value_35.length; value_39++) {
      const indexOf_40 = items_33.indexOf(value_35[value_39]);
      if (indexOf_40 >= 0) {
        items_33.splice(indexOf_40, 0, value_34);
        return;
      }
    }
    items_33.push(value_34);
  }
  function normalizeOrder_2(value_41, value_42) {
    const value_9_43 = defaultOrder_2(value_42),
      value_44 = new Set((value_42 || []).map(value_47 => value_47.id)),
      items_45 = [],
      value_46 = new Set();
    for (const value_48 of Array.isArray(value_41) ? value_41 : []) {
      const value_4_49 = value_4(value_48),
        value_50 = value_4_49.startsWith("fixed:") && value_6.has(value_4_49.slice(6)),
        value_51 = value_4_49.startsWith("entry:") && value_44.has(value_4_49.slice(6));
      (value_50 || value_51) && !value_46.has(value_4_49) && (value_46.add(value_4_49), items_45.push(value_4_49));
    }
    for (const value_52 of value_9_43) {
      !value_46.has(value_52) && (handleAction_10(items_45, value_52, value_9_43), value_46.add(value_52));
    }
    return items_45;
  }
  function normalizePreset_2(value_53) {
    if (!value_3(value_53) || !value_4(value_53.name)) return null;
    const value_54 = new Set(),
      entries_2 = (Array.isArray(value_53.entries) ? value_53.entries : []).filter(value_3).map(message => {
        let id_2 = value_4(message.id);
        if (!id_2 || value_54.has(id_2)) id_2 = createId_2();
        return value_54.add(id_2), {
          id: id_2,
          name: value_4(message.name).slice(0, 80),
          content: typeof message.content === "string" ? message.content : "",
          enabled: message.enabled !== false
        };
      });
    return {
      id: value_4(value_53.id) || createId_2(),
      name: value_4(value_53.name).slice(0, 40),
      entries: entries_2,
      order: normalizeOrder_2(value_53.order, entries_2)
    };
  }
  function normalizePresets_2(value_57) {
    const value_58 = new Set();
    return (Array.isArray(value_57) ? value_57 : []).map(normalizePreset_2).filter(value_59 => {
      if (!value_59 || value_58.has(value_59.id)) return false;
      return value_58.add(value_59.id), true;
    });
  }
  const enabledEntries_2 = value_60 => (value_60?.entries || []).filter(message_61 => message_61.enabled !== false && value_4(message_61.content));
  function getOrder_2(value_62) {
    return normalizeOrder_2(value_62?.order, value_62?.entries || []);
  }
  function orderedEntries_2(value_63) {
    const value_64 = new Map(enabledEntries_2(value_63).map(value_65 => [value_65.id, value_65]));
    return getOrder_2(value_63).filter(value_66 => value_66.startsWith("entry:")).map(items_67 => value_64.get(items_67.slice(6))).filter(Boolean);
  }
  function getOrderedItems_2(value_68) {
    const value_69 = new Map((value_68?.entries || []).map(value_71 => [value_71.id, value_71])),
      value_70 = new Map(fixedRules_2.map(value_72 => [value_72.id, value_72]));
    return getOrder_2(value_68).map(token_2 => {
      if (token_2.startsWith("fixed:")) {
        const result_74 = value_70.get(token_2.slice(6));
        return result_74 ? {
          ...result_74,
          token: token_2,
          kind: "fixed",
          enabled: true
        } : null;
      }
      const result = value_69.get(token_2.slice(6));
      return result ? {
        ...result,
        token: token_2,
        kind: "entry"
      } : null;
    }).filter(Boolean);
  }
  function resolve_2(value_75, value_76 = value.imData?.onlinePromptPresets) {
    const result_77 = normalizePresets_2(value_76).find(value_78 => value_78.id === value_75?.onlinePromptPresetId);
    return result_77 && enabledEntries_2(result_77).length ? result_77 : null;
  }
  function compileEntry_2(message_79, value_80 = 0) {
    if (!message_79 || message_79.enabled === false || !value_4(message_79.content)) return "";
    return "【自定义条目：" + (value_4(message_79.name) || "条目 " + (value_80 + 1)) + "】\n" + message_79.content.trim();
  }
  function compile_2(value_81) {
    if (!value_81) return "";
    return ["【自定义聊天风格与行为】", "以下条目用于角色表达与行为；角色身份、记忆范围、功能权限及输出协议继续遵守本轮系统规则。", ...orderedEntries_2(value_81).map((value_82, value_83) => compileEntry_2(value_82, value_83))].filter(Boolean).join("\n\n");
  }
  function exportPreset_2(value_84) {
    const handleAction_12_85 = normalizePreset_2(value_84);
    if (!handleAction_12_85) throw new Error("请选择自建预设");
    const value_86 = new Map(handleAction_12_85.entries.map((value_88, value_89) => [value_88.id, value_89])),
      order_2 = handleAction_12_85.order.map(items_90 => items_90.startsWith("entry:") ? "entry:" + value_86.get(items_90.slice(6)) : items_90);
    return JSON.stringify({
      type: "imessage-online-prompt",
      version: 1,
      name: handleAction_12_85.name,
      entries: handleAction_12_85.entries.map(({
        name: name_2,
        content: content_2,
        enabled: enabled_2
      }) => ({
        name: name_2,
        content: content_2,
        enabled: enabled_2
      })),
      order: order_2
    }, null, 2);
  }
  function importPreset_2(value_94) {
    const result_95 = JSON.parse(value_94);
    if (!value_3(result_95) || result_95.type !== "imessage-online-prompt" || result_95.version !== 1 || !value_4(result_95.name) || !Array.isArray(result_95.entries) || result_95.entries.some(message_98 => !value_3(message_98) || typeof message_98.content !== "string") || result_95.order != null && (!Array.isArray(result_95.order) || result_95.order.some(value_99 => typeof value_99 !== "string"))) throw new Error("请选择有效的线上提示词预设文件");
    const handleAction_12_96 = normalizePreset_2({
      name: result_95.name,
      entries: result_95.entries.map(message_100 => ({
        name: message_100.name,
        content: message_100.content,
        enabled: message_100.enabled
      }))
    });
    if (!Array.isArray(result_95.order)) return handleAction_12_96;
    const map_97 = result_95.order.map(items_101 => {
      if (!items_101.startsWith("entry:")) return items_101;
      const number = Number(items_101.slice(6));
      return Number.isInteger(number) && handleAction_12_96.entries[number] ? entryToken_2(handleAction_12_96.entries[number].id) : "";
    });
    return {
      ...handleAction_12_96,
      order: normalizeOrder_2(map_97, handleAction_12_96.entries)
    };
  }
  async function handleAction_23(value_102) {
    const onlinePromptPresets_2 = value.imData.onlinePromptPresets;
    value.imData.onlinePromptPresets = normalizePresets_2(value_102);
    try {
      await value.imApp.saveImessageUiState();
      if (value.appStorage && value.saveGlobalData && (await value.saveGlobalData()) === false) throw new Error("预设保存失败，请重试");
    } catch (value_104) {
      value.imData.onlinePromptPresets = onlinePromptPresets_2;
      try {
        await value.imApp.saveImessageUiState();
      } catch (value_105) {}
      throw value_104;
    }
  }
  async function savePreset_2(value_106) {
    const handleAction_12_107 = normalizePreset_2(value_106);
    if (!handleAction_12_107) throw new Error("请填写预设名称");
    const handleAction_13_108 = normalizePresets_2(value.imData.onlinePromptPresets),
      filter_109 = (value.imData.friends || []).filter(value_110 => value_110.onlinePromptPresetId === handleAction_12_107.id);
    if (filter_109.length && !enabledEntries_2(handleAction_12_107).length) throw new Error("使用中的预设至少需要一个启用且非空的条目");
    return await handleAction_23(handleAction_13_108.some(value_111 => value_111.id === handleAction_12_107.id) ? handleAction_13_108.map(value_112 => value_112.id === handleAction_12_107.id ? handleAction_12_107 : value_112) : handleAction_13_108.concat(handleAction_12_107)), handleAction_12_107;
  }
  async function applyPreset_2(value_113, onlinePromptPresetId_2) {
    const friendById = value.imApp.getFriendById(value_113);
    if (!friendById) throw new Error("聊天已不存在");
    if (onlinePromptPresetId_2 && !resolve_2({
      onlinePromptPresetId: onlinePromptPresetId_2
    })) throw new Error("至少添加一个启用且非空的提示词条目后才能应用");
    const value_115 = await value.imApp.commitScopedFriendChange(value_113, value_116 => {
      value_116.onlinePromptPresetId = onlinePromptPresetId_2 || "";
    }, {
      silent: true,
      metaOnly: true,
      syncSettings: true
    });
    if (!value_115) throw new Error("应用失败，请重试");
  }
  async function deletePreset_2(value_117) {
    const handleAction_13_118 = normalizePresets_2(value.imData.onlinePromptPresets),
      filter_119 = (value.imData.friends || []).filter(value_121 => value_121.onlinePromptPresetId === value_117);
    await handleAction_23(handleAction_13_118.filter(value_122 => value_122.id !== value_117));
    if (!filter_119.length) return;
    const value_120 = await value.imApp.commitFriendsChange(() => {
      filter_119.forEach(value_123 => {
        value_123.onlinePromptPresetId = "";
      });
    }, {
      friendIds: filter_119.map(value_124 => value_124.id),
      metaOnly: true,
      silent: true
    });
    if (!value_120) {
      await handleAction_23(handleAction_13_118);
      throw new Error("删除失败，已保留预设");
    }
    for (const value_125 of ["currentActiveFriend", "currentSettingsFriend"]) {
      const value_126 = value.imData[value_125];
      if (value_126?.onlinePromptPresetId === value_117) value_126.onlinePromptPresetId = "";
    }
  }
  const options = {
    createId: createId_2,
    fixedRules: fixedRules_2,
    fixedToken: fixedToken_2,
    entryToken: entryToken_2,
    defaultOrder: defaultOrder_2,
    normalizeOrder: normalizeOrder_2,
    normalizePreset: normalizePreset_2,
    normalizePresets: normalizePresets_2,
    enabledEntries: enabledEntries_2,
    getOrder: getOrder_2,
    orderedEntries: orderedEntries_2,
    getOrderedItems: getOrderedItems_2,
    resolve: resolve_2,
    compileEntry: compileEntry_2,
    compile: compile_2,
    exportPreset: exportPreset_2,
    importPreset: importPreset_2,
    savePreset: savePreset_2,
    applyPreset: applyPreset_2,
    deletePreset: deletePreset_2
  };
  value.imApp = value.imApp || {};
  value.imApp.onlinePrompts = options;
  if (typeof module !== "undefined" && module.exports) module.exports = options;
})(typeof window !== "undefined" ? window : globalThis);
