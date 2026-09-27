(function () {
  'use strict';

  const vendors = {
      mammoth: {
        src: "https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js",
        isReady: () => !!window.mammoth?.extractRawText
      },
      jszip: {
        src: "https://unpkg.com/jszip@3.10.1/dist/jszip.min.js",
        isReady: () => !!window.JSZip?.loadAsync
      }
    },
    pending = new Map();
  window.u2LoadVendorLibrary = function value_3(u2Vendor_2) {
    const vendor = vendors[u2Vendor_2];
    if (!vendor) return Promise.reject(new Error("Unknown vendor library: " + u2Vendor_2));
    if (vendor.isReady()) return Promise.resolve();
    if (pending.has(u2Vendor_2)) return pending.get(u2Vendor_2);
    const value_5 = new Promise((value_6, value_7) => {
      const script = document.createElement("script");
      script.src = vendor.src;
      script.async = true;
      script.dataset.u2Vendor = u2Vendor_2;
      script.onload = () => vendor.isReady() ? value_6() : value_7(new Error(u2Vendor_2 + " loaded without its expected global"));
      script.onerror = () => value_7(new Error("Failed to load " + u2Vendor_2));
      document.head.appendChild(script);
    })["finally"](() => pending["delete"](u2Vendor_2));
    return pending.set(u2Vendor_2, value_5), value_5;
  };
})();
