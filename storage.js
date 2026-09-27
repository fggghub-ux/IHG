const StorageManager = {
  stripVolatileBlobUrls: function (value, seen = new WeakSet()) {
    if (typeof value === "string") return value.startsWith("blob:") ? null : value;
    if (value == null || typeof value !== "object") return value;
    if (seen.has(value)) return undefined;
    seen.add(value);
    if (Array.isArray(value)) return value.map(item => this.stripVolatileBlobUrls(item, seen)).filter(item_3 => item_3 !== undefined);
    const result = {};
    return Object.keys(value).forEach(key => {
      const nextValue = this.stripVolatileBlobUrls(value[key], seen);
      if (nextValue !== undefined) result[key] = nextValue;
    }), result;
  },
  save: function (key_2, value_2) {
    try {
      if (!window.appStorage?.saveLegacyKey) return false;
      return window.appStorage.saveLegacyKey(key_2, this.stripVolatileBlobUrls(value_2))["catch"](value_5 => {
        console.error("Storage save error for key \"" + key_2 + "\":", value_5);
      }), true;
    } catch (value_6) {
      return console.error("Storage save error for key \"" + key_2 + "\":", value_6), false;
    }
  },
  load: function (key_3, defaultValue = null) {
    try {
      return window.appStorage?.loadLegacyKey ? window.appStorage.loadLegacyKey(key_3, defaultValue) : defaultValue;
    } catch (value_9) {
      return console.error("Storage load error for key \"" + key_3 + "\":", value_9), defaultValue;
    }
  },
  remove: function (key_4) {
    try {
      if (!window.appStorage?.removeLegacyKey) return false;
      return window.appStorage.removeLegacyKey(key_4)["catch"](value_11 => {
        console.error("Storage remove error for key \"" + key_4 + "\":", value_11);
      }), true;
    } catch (value_12) {
      return console.error("Storage remove error for key \"" + key_4 + "\":", value_12), false;
    }
  },
  clearAll: function () {
    try {
      window.appStorage?.clearAllPersistentData && window.appStorage.clearAllPersistentData()["catch"](error_2 => {
        console.error("Storage clearAll error:", error_2);
      });
    } catch (value_14) {
      console.error("Storage clearAll error:", value_14);
    }
  }
};
window.StorageManager = StorageManager;
window.u2LegacyStorageFacade = {
  "getItem"(key_5) {
    const value_13 = StorageManager.load(key_5, null);
    if (value_13 === null || value_13 === undefined) return null;
    return typeof value_13 === "string" ? value_13 : JSON.stringify(value_13);
  },
  "setItem"(key_6, rawValue) {
    let value_16 = rawValue;
    try {
      value_16 = JSON.parse(String(rawValue));
    } catch (value_20) {}
    StorageManager.save(key_6, value_16);
  },
  "removeItem"(value_21) {
    StorageManager.remove(value_21);
  }
};
