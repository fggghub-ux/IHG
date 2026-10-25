(function () {
  'use strict';

  function apk119Value1({
    getState: apk119Value2,
    persist: apk119Value3,
    onChange = () => {},
    native = () => window.u2NativeBridge,
    isForeground = () => true
  }) {
    const apk119Value4 = window.cycleData;
    let apk119Value5 = false,
      apk119Value6 = 0,
      apk119Value7 = "",
      apk119Value8 = false;
    const apk119Value9 = () => ({
        busy: apk119Value5,
        message: apk119Value7,
        supported: apk119Value8
      }),
      apk119Value10 = apk119Value17 => {
        apk119Value7 = apk119Value17, onChange(apk119Value9());
      };
    async function apk119Value11() {
      const apk119Value18 = native();
      if (!apk119Value18?.["isNativeIOS"]?.() || typeof apk119Value18.getHealthAvailability !== "function") throw new Error("健康导入需要安装支持此功能的 iOS IPA。");
      const apk119Value19 = await apk119Value18.getHealthAvailability();
      apk119Value8 = apk119Value19?.["available"] === true;
      if (!apk119Value8) throw new Error("当前设备无法使用苹果健康，经期仍可手动记录。");
      return apk119Value18;
    }
    async function apk119Value12(apk119Value20, apk119Value21) {
      let apk119Value22 = false;
      while (apk119Value6 === apk119Value21 && apk119Value2().health.enabled && isForeground()) {
        const apk119Value23 = apk119Value2().health;
        let apk119Value24;
        try {
          apk119Value24 = await apk119Value20.readHealthMenstrualChanges({
            anchor: apk119Value22 ? "" : apk119Value23.anchor,
            storeId: apk119Value23.storeId
          });
        } catch (apk119Value25) {
          if (apk119Value25?.["code"] === "HEALTH_ANCHOR_INVALID" && !apk119Value22) {
            apk119Value22 = true;
            continue;
          }
          throw apk119Value25;
        }
        if (apk119Value6 !== apk119Value21 || !apk119Value2().health.enabled) return;
        if (!apk119Value24 || !Array.isArray(apk119Value24.samples) || !Array.isArray(apk119Value24.deletedIds) || typeof apk119Value24.anchor !== "string" || !apk119Value24.anchor || apk119Value24.hasMore && apk119Value24.anchor === (apk119Value22 ? "" : apk119Value23.anchor)) throw new Error("健康同步返回的数据无效，请重试。");
        if (!(await apk119Value3(apk119Value4.applyHealthChanges(apk119Value2(), apk119Value24)))) throw new Error("健康记录保存失败，请重试。");
        apk119Value22 = false;
        if (!apk119Value24.hasMore) {
          apk119Value10(!apk119Value24.samples.length && !apk119Value24.deletedIds.length ? "暂无新的可读取经期记录。可在“健康”中检查记录与访问权限。" : "健康记录已同步。");
          return;
        }
      }
      apk119Value10("同步已暂停，返回 Cycle 后继续。");
    }
    function apk119Value13(apk119Value26) {
      if (apk119Value26?.["code"] === "UNIMPLEMENTED") return "当前安装包未包含健康导入，请更新 IPA。";
      return apk119Value26?.["message"] || "健康同步失败，请检查系统权限后重试。";
    }
    async function apk119Value14(apk119Value27) {
      if (apk119Value5 || !isForeground() || !apk119Value27 && !apk119Value2().health.enabled) return;
      apk119Value5 = true;
      const apk119Value28 = ++apk119Value6;
      apk119Value10(apk119Value27 ? "正在连接苹果健康…" : "正在同步健康记录…");
      try {
        const apk119Value29 = await apk119Value11();
        if (apk119Value27) {
          await apk119Value29.requestHealthReadAuthorization();
          if (!(await apk119Value3({
            ...apk119Value2(),
            health: {
              ...apk119Value2().health,
              enabled: true,
              anchor: ""
            }
          }))) throw new Error("连接设置保存失败，请重试。");
        }
        await apk119Value12(apk119Value29, apk119Value28);
      } catch (apk119Value30) {
        apk119Value10(apk119Value13(apk119Value30));
      } finally {
        apk119Value5 = false, onChange(apk119Value9());
      }
    }
    async function apk119Value15() {
      if (apk119Value5) return;
      ++apk119Value6;
      if (await apk119Value3({
        ...apk119Value2(),
        health: {
          ...apk119Value2().health,
          enabled: false
        }
      })) apk119Value10("已停止同步，导入记录已保留。");
    }
    async function apk119Value16() {
      if (apk119Value5) return;
      ++apk119Value6;
      if (await apk119Value3({
        ...apk119Value2(),
        health: apk119Value4.normalizeHealth()
      })) apk119Value10("已清除健康导入记录，手动记录已保留。");
    }
    return {
      status: apk119Value9,
      connect: () => apk119Value14(true),
      sync: () => apk119Value14(false),
      stop: apk119Value15,
      clear: apk119Value16
    };
  }
  window.cycleHealth = {
    createController: apk119Value1
  };
})();