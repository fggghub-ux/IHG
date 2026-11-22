(function () {
  const localValue1 = 5000,
    localValue2 = "u2-export-ready-overlay";
  function localValue3() {
    const localValue10 = String(window.navigator?.["userAgent"] || ""),
      localValue11 = /iPad|iPhone|iPod/i.test(localValue10) || window.navigator?.["platform"] === "MacIntel" && Number(window.navigator?.["maxTouchPoints"]) > 1,
      localValue12 = window.navigator?.["standalone"] === true || window.matchMedia?.("(display-mode: standalone)")?.["matches"] === true;
    return localValue11 && localValue12;
  }
  function localValue4(localValue13, localValue14) {
    if (typeof window.File !== "function") return null;
    try {
      return new window.File([localValue13], localValue14, {
        "type": localValue13.type || "application/octet-stream",
        "lastModified": Date.now()
      });
    } catch (localValue15) {
      return console.warn("[u2ExportFile] Failed to create share file:", localValue15), null;
    }
  }
  function localValue5(localValue16) {
    if (!localValue16 || typeof window.navigator?.["share"] !== "function") return false;
    try {
      return typeof window.navigator.canShare !== "function" || window.navigator.canShare({
        "files": [localValue16]
      });
    } catch (localValue17) {
      return false;
    }
  }
  async function localValue6(localValue18, localValue19) {
    try {
      return await window.navigator.share({
        "files": [localValue18],
        "title": localValue19 || localValue18.name
      }), "shared";
    } catch (localValue20) {
      if (localValue20?.["name"] === "AbortError") return "cancelled";
      if (localValue20?.["name"] === "NotAllowedError") return "needs-user-action";
      return console.warn("[u2ExportFile] System share failed:", localValue20), "failed";
    }
  }
  function localValue7(localValue21, localValue22) {
    return new Promise(localValue23 => {
      document.getElementById(localValue2)?.["remove"]();
      const localValue24 = document.createElement("div");
      localValue24.id = localValue2, localValue24.style.cssText = "position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.28);font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;";
      const localValue25 = document.createElement("div");
      localValue25.style.cssText = "width:min(100%,360px);padding:22px;border-radius:18px;background:#fff;color:#1c1c1e;box-shadow:0 18px 50px rgba(0,0,0,.18);text-align:center;";
      const localValue26 = document.createElement("div");
      localValue26.textContent = "文件已准备好", localValue26.style.cssText = "font-size:18px;font-weight:700;";
      const localValue27 = document.createElement("div");
      localValue27.textContent = "点击下方按钮打开系统分享，可选择“存储到文件”。", localValue27.style.cssText = "margin-top:9px;color:#6e6e73;font-size:14px;line-height:1.5;";
      const localValue28 = document.createElement("button");
      localValue28.type = "button", localValue28.textContent = "分享并存储", localValue28.style.cssText = "width:100%;height:44px;margin-top:20px;border:0;border-radius:12px;background:#007aff;color:#fff;font-size:16px;font-weight:600;";
      const localValue29 = document.createElement("button");
      localValue29.type = "button", localValue29.textContent = "取消", localValue29.style.cssText = "width:100%;height:40px;margin-top:8px;border:0;background:transparent;color:#6e6e73;font-size:15px;";
      let localValue30 = false;
      const localValue31 = localValue32 => {
        if (localValue30) return;
        localValue30 = true, localValue24.remove(), localValue23(localValue32);
      };
      localValue28.addEventListener("click", async () => {
        localValue28.disabled = true;
        const localValue33 = await localValue6(localValue21, localValue22);
        if (localValue33 === "needs-user-action") {
          localValue28.disabled = false, localValue27.textContent = "系统暂时无法打开分享，请再试一次。";
          return;
        }
        localValue31(localValue33);
      }), localValue29.addEventListener("click", () => localValue31("cancelled")), localValue24.addEventListener("click", localValue34 => {
        if (localValue34.target === localValue24) localValue31("cancelled");
      }), localValue25.append(localValue26, localValue27, localValue28, localValue29), localValue24.appendChild(localValue25), document.body.appendChild(localValue24);
    });
  }
  function localValue8(localValue35, localValue36, localValue37 = localValue1) {
    try {
      const localValue38 = window.URL.createObjectURL(localValue35),
        localValue39 = document.createElement("a");
      return localValue39.href = localValue38, localValue39.download = localValue36, localValue39.hidden = true, document.body.appendChild(localValue39), localValue39.click(), localValue39.remove(), window.setTimeout(() => window.URL.revokeObjectURL(localValue38), localValue37), "downloaded";
    } catch (localValue40) {
      return console.warn("[u2ExportFile] Browser download failed:", localValue40), "failed";
    }
  }
  function localValue9({
    blob: localValue41,
    fileName: localValue42,
    title: localValue43,
    imageUrl: localValue44
  }) {
    const localValue45 = document.getElementById("u2-image-save-overlay");
    localValue45?.["_closeImageSave"]?.();
    const localValue46 = localValue41 instanceof window.Blob,
      localValue47 = localValue46 ? window.URL.createObjectURL(localValue41) : String(localValue44 || "");
    if (!/^(https?:|blob:|data:image\/)/i.test(localValue47)) return "failed";
    const localValue48 = document.createElement("div");
    localValue48.id = "u2-image-save-overlay", localValue48.setAttribute("role", "dialog"), localValue48.setAttribute("aria-modal", "true"), localValue48.setAttribute("aria-label", "备用保存图片"), localValue48.style.cssText = "position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;padding:24px;background:rgba(0,0,0,.4);";
    const localValue49 = document.createElement("div");
    localValue49.style.cssText = "width:min(100%,360px);box-sizing:border-box;padding:22px;border-radius:20px;background:#fff;color:#111;font:15px/1.5 -apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;";
    const localValue50 = document.createElement("strong");
    localValue50.textContent = "备用保存图片";
    const localValue51 = document.createElement("p");
    localValue51.setAttribute("role", "status"), localValue51.textContent = localValue46 ? "可重新下载、分享，或打开图片后长按保存。" : "图片源暂时无法读取，可打开原图后长按保存；外链可能已经失效。", localValue49.append(localValue50, localValue51);
    const localValue52 = (localValue57, localValue58 = false) => {
      const localValue59 = document.createElement("a");
      localValue59.textContent = localValue57, localValue59.href = localValue47, localValue59.style.cssText = "display:block;padding:12px 0;color:#007aff;", localValue58 ? (localValue59.download = localValue42, localValue59.addEventListener("click", () => {
        localValue51.textContent = "已发起下载，请查看浏览器下载列表。";
      })) : (localValue59.target = "_blank", localValue59.rel = "noopener noreferrer"), localValue49.appendChild(localValue59);
    };
    if (localValue46) localValue52("下载图片", true);
    const localValue53 = localValue46 ? localValue4(localValue41, localValue42) : null;
    if (localValue5(localValue53)) {
      const localValue60 = document.createElement("button");
      localValue60.type = "button", localValue60.textContent = "分享图片", localValue60.style.cssText = "display:block;padding:12px 0;border:0;background:none;color:#007aff;font:inherit;", localValue60.addEventListener("click", async () => {
        localValue60.disabled = true;
        const localValue61 = await localValue6(localValue53, localValue43);
        localValue60.disabled = false, localValue51.textContent = localValue61 === "shared" ? "图片已分享，请在所选应用中完成保存。" : localValue61 === "cancelled" ? "已取消分享，可选择其他保存方式。" : "分享暂时无法打开，请重试或打开原图保存。";
      }), localValue49.appendChild(localValue60);
    }
    localValue52("打开原图");
    const localValue54 = document.createElement("button");
    localValue54.type = "button", localValue54.textContent = "关闭", localValue54.style.cssText = "width:100%;margin-top:12px;padding:10px;border:0;border-radius:12px;background:#f2f2f7;font:inherit;";
    let localValue55 = false;
    const localValue56 = () => {
      if (localValue55) return;
      localValue55 = true, localValue48.remove();
      if (localValue46) window.setTimeout(() => window.URL.revokeObjectURL(localValue47), 60000);
    };
    return localValue48._closeImageSave = localValue56, localValue54.addEventListener("click", localValue56), localValue48.addEventListener("click", localValue62 => {
      if (localValue62.target === localValue48) localValue56();
    }), localValue48.addEventListener("keydown", localValue63 => {
      if (localValue63.key === "Escape") localValue56();
    }), localValue49.appendChild(localValue54), localValue48.appendChild(localValue49), document.body.appendChild(localValue48), localValue54.focus?.(), "ready";
  }
  window.u2ExportFile = async function localValue66({
    blob: localValue64,
    fileName: localValue65,
    title = "",
    mode = "",
    imageUrl = "",
    showOptions = false
  } = {}) {
    const localValue67 = window.u2NativeBridge,
      localValue68 = localValue67?.["isNativeAndroid"]?.() || localValue67?.["isNativeIOS"]?.();
    if (mode === "image" && showOptions && !(localValue68 && localValue64 instanceof window.Blob)) return localValue9({
      "blob": localValue64,
      "fileName": localValue65,
      "title": title,
      "imageUrl": imageUrl
    });
    if (!(localValue64 instanceof window.Blob) || !String(localValue65 || "").trim()) return console.warn("[u2ExportFile] A Blob and fileName are required."), "failed";
    const localValue69 = String(localValue65).trim();
    if (localValue68) try {
      const localValue72 = await localValue67.exportFile({
        "blob": localValue64,
        "fileName": localValue69,
        "title": title
      });
      if (localValue72 !== "unavailable") return localValue72;
    } catch (localValue73) {
      return console.warn("[u2ExportFile] Native file export failed:", localValue73), "failed";
    }
    if (!localValue3()) {
      if (mode === "image") {
        if (window.navigator.userActivation?.["isActive"] === false) return localValue9({
          "blob": localValue64,
          "fileName": localValue69,
          "title": title,
          "imageUrl": imageUrl
        });
        const localValue74 = localValue8(localValue64, localValue69, 60000);
        return localValue74 === "downloaded" ? "download-started" : localValue9({
          "blob": localValue64,
          "fileName": localValue69,
          "title": title,
          "imageUrl": imageUrl
        });
      }
      return localValue8(localValue64, localValue69);
    }
    const localValue70 = localValue4(localValue64, localValue69);
    if (!localValue5(localValue70)) {
      if (mode === "image") return localValue9({
        "blob": localValue64,
        "fileName": localValue69,
        "title": title,
        "imageUrl": imageUrl
      });
      return console.warn("[u2ExportFile] File sharing is unavailable in this iOS standalone session."), "failed";
    }
    if (window.navigator.userActivation && !window.navigator.userActivation.isActive) return localValue7(localValue70, title);
    const localValue71 = await localValue6(localValue70, title);
    return localValue71 === "needs-user-action" ? localValue7(localValue70, title) : localValue71;
  };
})();
