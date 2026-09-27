(function () {
  'use strict';

  const text = "u2phone_mcp_chat_config_v1",
    value = window.u2LegacyStorageFacade || window.localStorage,
    freeze_2 = Object.freeze({
      enabled: false,
      showToolCalls: true,
      autoXhsLink: true,
      approvalPolicy: "read-only-auto"
    });
  function handleAction_3(value_8) {
    const value_9 = value_8 && typeof value_8 === "object" ? value_8 : {};
    return {
      ...freeze_2,
      ...value_9,
      enabled: value_9.enabled === true,
      showToolCalls: value_9.showToolCalls !== false
    };
  }
  function handleAction_4(value_10) {
    try {
      const result = JSON.parse(value.getItem(text) || "{}");
      return handleAction_3(result[String(value_10)]);
    } catch (value_11) {
      return console.error("[MCP Config] Failed to read config", value_11), handleAction_3(null);
    }
  }
  function handleAction_5(friendId_2, value_13) {
    try {
      const result_14 = JSON.parse(value.getItem(text) || "{}");
      return result_14[String(friendId_2)] = handleAction_3({
        ...handleAction_4(friendId_2),
        ...value_13
      }), value.setItem(text, JSON.stringify(result_14)), window.dispatchEvent(new CustomEvent("mcp-chat-config-updated", {
        detail: {
          friendId: friendId_2,
          config: result_14[String(friendId_2)]
        }
      })), true;
    } catch (value_15) {
      return console.error("[MCP Config] Failed to save config", value_15), false;
    }
  }
  function handleAction_6(friendId_3) {
    try {
      const result_17 = JSON.parse(value.getItem(text) || "{}");
      return delete result_17[String(friendId_3)], value.setItem(text, JSON.stringify(result_17)), window.dispatchEvent(new CustomEvent("mcp-chat-config-updated", {
        detail: {
          friendId: friendId_3,
          config: null
        }
      })), true;
    } catch (value_18) {
      return console.error("[MCP Config] Failed to delete config", value_18), false;
    }
  }
  function handleAction_7() {
    try {
      const result_19 = JSON.parse(value.getItem(text) || "{}");
      return Object.keys(result_19).filter(value_20 => result_19[value_20]?.enabled === true);
    } catch (value_21) {
      return console.error("[MCP Config] Failed to get enabled chats", value_21), [];
    }
  }
  window.imMcpConfig = {
    "isEnabled"(value_22) {
      return handleAction_4(value_22).enabled === true;
    },
    "enable"(value_23) {
      return handleAction_5(value_23, {
        enabled: true
      });
    },
    "disable"(value_24) {
      return handleAction_5(value_24, {
        enabled: false
      });
    },
    "toggle"(value_25) {
      const handleAction_4_26 = handleAction_4(value_25);
      return handleAction_5(value_25, {
        enabled: !handleAction_4_26.enabled
      });
    },
    "shouldShowToolCalls"(value_27) {
      return handleAction_4(value_27).showToolCalls !== false;
    },
    "setShowToolCalls"(value_28, value_29) {
      return handleAction_5(value_28, {
        showToolCalls: value_29 !== false
      });
    },
    "getConfig"(value_30) {
      return handleAction_4(value_30);
    },
    "setConfig"(value_31, value_32) {
      return handleAction_5(value_31, value_32);
    },
    "deleteConfig"(value_33) {
      return handleAction_6(value_33);
    },
    "getEnabledChats"() {
      return handleAction_7();
    }
  };
  console.log("[MCP Config] Module loaded");
})();
