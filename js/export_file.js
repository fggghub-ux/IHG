(function () {
  const DOWNLOAD_URL_LIFETIME_MS = 5000,
    READY_OVERLAY_ID = "u2-export-ready-overlay";
  function isIosStandalone() {
    const userAgent_2 = String(window.navigator?.userAgent || ""),
      isIOS = /iPad|iPhone|iPod/i.test(userAgent_2) || window.navigator?.platform === "MacIntel" && Number(window.navigator?.maxTouchPoints) > 1,
      isStandalone = window.navigator?.standalone === true || window.matchMedia?.("(display-mode: standalone)")?.matches === true;
    return isIOS && isStandalone;
  }
  function makeShareFile(blob_2, fileName_2) {
    if (typeof window.File !== "function") return null;
    try {
      return new window.File([blob_2], fileName_2, {
        type: blob_2.type || "application/octet-stream",
        lastModified: Date.now()
      });
    } catch (error_2) {
      return console.warn("[u2ExportFile] Failed to create share file:", error_2), null;
    }
  }
  function canShareFile(file) {
    if (!file || typeof window.navigator?.share !== "function") return false;
    try {
      return typeof window.navigator.canShare !== "function" || window.navigator.canShare({
        files: [file]
      });
    } catch (error) {
      return false;
    }
  }
  async function shareFile(file_2, title_2) {
    try {
      return await window.navigator.share({
        files: [file_2],
        title: title_2 || file_2.name
      }), "shared";
    } catch (error_3) {
      if (error_3?.name === "AbortError") return "cancelled";
      if (error_3?.name === "NotAllowedError") return "needs-user-action";
      return console.warn("[u2ExportFile] System share failed:", error_3), "failed";
    }
  }
  function promptForShare(file_3, title_3) {
    return new Promise(resolve => {
      document.getElementById(READY_OVERLAY_ID)?.remove();
      const overlay = document.createElement("div");
      overlay.id = READY_OVERLAY_ID;
      overlay.style.cssText = "position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.28);font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;";
      const card = document.createElement("div");
      card.style.cssText = "width:min(100%,360px);padding:22px;border-radius:18px;background:#fff;color:#1c1c1e;box-shadow:0 18px 50px rgba(0,0,0,.18);text-align:center;";
      const heading = document.createElement("div");
      heading.textContent = "文件已准备好";
      heading.style.cssText = "font-size:18px;font-weight:700;";
      const detail = document.createElement("div");
      detail.textContent = "点击下方按钮打开系统分享，可选择“存储到文件”。";
      detail.style.cssText = "margin-top:9px;color:#6e6e73;font-size:14px;line-height:1.5;";
      const shareButton = document.createElement("button");
      shareButton.type = "button";
      shareButton.textContent = "分享并存储";
      shareButton.style.cssText = "width:100%;height:44px;margin-top:20px;border:0;border-radius:12px;background:#007aff;color:#fff;font-size:16px;font-weight:600;";
      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.textContent = "取消";
      cancelButton.style.cssText = "width:100%;height:40px;margin-top:8px;border:0;background:transparent;color:#6e6e73;font-size:15px;";
      let settled = false;
      const finish = result => {
        if (settled) return;
        settled = true;
        overlay.remove();
        resolve(result);
      };
      shareButton.addEventListener("click", async () => {
        shareButton.disabled = true;
        const result_2 = await shareFile(file_3, title_3);
        if (result_2 === "needs-user-action") {
          shareButton.disabled = false;
          detail.textContent = "系统暂时无法打开分享，请再试一次。";
          return;
        }
        finish(result_2);
      });
      cancelButton.addEventListener("click", () => finish("cancelled"));
      overlay.addEventListener("click", event => {
        if (event.target === overlay) finish("cancelled");
      });
      card.append(heading, detail, shareButton, cancelButton);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
    });
  }
  function downloadFile(blob_3, download_2) {
    try {
      const objectUrl = window.URL.createObjectURL(blob_3),
        link = document.createElement("a");
      return link.href = objectUrl, link.download = download_2, link.hidden = true, document.body.appendChild(link), link.click(), link.remove(), window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), DOWNLOAD_URL_LIFETIME_MS), "downloaded";
    } catch (error_4) {
      return console.warn("[u2ExportFile] Browser download failed:", error_4), "failed";
    }
  }
  window.u2ExportFile = async function value_20({
    blob: blob_4,
    fileName: fileName_3,
    title = ""
  } = {}) {
    if (!(blob_4 instanceof window.Blob) || !String(fileName_3 || "").trim()) return console.warn("[u2ExportFile] A Blob and fileName are required."), "failed";
    const trim_21 = String(fileName_3).trim(),
      u2NativeBridge_22 = window.u2NativeBridge;
    if (u2NativeBridge_22?.isNativeAndroid?.()) try {
      const value_25 = await u2NativeBridge_22.exportFile({
        blob: blob_4,
        fileName: trim_21,
        title: title
      });
      if (value_25 !== "unavailable") return value_25;
    } catch (value_26) {
      return console.warn("[u2ExportFile] Native Android export failed:", value_26), "failed";
    }
    if (!isIosStandalone()) return downloadFile(blob_4, trim_21);
    const shareFileObject = makeShareFile(blob_4, trim_21);
    if (!canShareFile(shareFileObject)) return console.warn("[u2ExportFile] File sharing is unavailable in this iOS standalone session."), "failed";
    if (window.navigator.userActivation && !window.navigator.userActivation.isActive) return promptForShare(shareFileObject, title);
    const result_3 = await shareFile(shareFileObject, title);
    return result_3 === "needs-user-action" ? promptForShare(shareFileObject, title) : result_3;
  };
})();
