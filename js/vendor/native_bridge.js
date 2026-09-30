(() => {
  var xe = Object.defineProperty;
  var V = (t, e) => () => (t && (e = t(t = 0)), e);
  var Z = (t, e) => {
    for (var i in e) xe(t, i, {
      get: e[i],
      enumerable: !0
    });
  };
  var P,
    R,
    Le,
    ke,
    Ce,
    A,
    m,
    b,
    W,
    Q,
    q,
    Qe,
    Pe,
    Ae,
    Te,
    Be,
    H,
    ie,
    ee,
    te,
    z,
    et,
    L = V(() => {
      (function (t) {
        t.Unimplemented = "UNIMPLEMENTED";
        t.Unavailable = "UNAVAILABLE";
      })(P || (P = {}));
      R = class extends Error {
        constructor(e, i, n) {
          super(e);
          this.message = e;
          this.code = i;
          this.data = n;
        }
      };
      Le = t => {
        var e, i;
        return t?.androidBridge ? "android" : !((i = (e = t?.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || i === void 0) && i.bridge ? "ios" : "web";
      };
      ke = t => {
        let e = t.CapacitorCustomPlatform || null,
          i = t.Capacitor || {},
          n = i.Plugins = i.Plugins || {},
          r = () => e !== null ? e.name : Le(t),
          o = () => r() !== "web",
          s = c => {
            let l = h.get(c);
            return !!(l?.platforms.has(r()) || a(c));
          },
          a = c => {
            var l;
            return (l = i.PluginHeaders) === null || l === void 0 ? void 0 : l.find(D => D.name === c);
          },
          d = c => t.console.error(c),
          h = new Map(),
          w = (c, l = {}) => {
            let D = h.get(c);
            if (D) return console.warn(`Capacitor plugin "${c}" already registered. Cannot register plugins twice.`), D.proxy;
            let x = r(),
              C = a(c),
              y,
              Ne = async () => (!y && x in l ? y = typeof l[x] == "function" ? y = await l[x]() : y = l[x] : e !== null && !y && "web" in l && (y = typeof l.web == "function" ? y = await l.web() : y = l.web), y),
              Ee = (u, p) => {
                var v, E;
                if (C) {
                  let S = C?.methods.find(g => p === g.name);
                  if (S) return S.rtype === "promise" ? g => i.nativePromise(c, p.toString(), g) : (g, I) => i.nativeCallback(c, p.toString(), g, I);
                  if (u) return (v = u[p]) === null || v === void 0 ? void 0 : v.bind(u);
                } else {
                  if (u) return (E = u[p]) === null || E === void 0 ? void 0 : E.bind(u);
                  throw new R(`"${c}" plugin is not implemented on ${x}`, P.Unimplemented);
                }
              },
              j = u => {
                let p,
                  v = (...E) => {
                    let S = Ne().then(g => {
                      let I = Ee(g, u);
                      if (I) {
                        let U = I(...E);
                        return p = U?.remove, U;
                      } else throw new R(`"${c}.${u}()" is not implemented on ${x}`, P.Unimplemented);
                    });
                    return u === "addListener" && (S.remove = async () => p()), S;
                  };
                return v.toString = () => `${u.toString()}() { [capacitor code] }`, Object.defineProperty(v, "name", {
                  value: u,
                  writable: !1,
                  configurable: !1
                }), v;
              },
              J = j("addListener"),
              X = j("removeListener"),
              Se = (u, p) => {
                let v = J({
                    eventName: u
                  }, p),
                  E = async () => {
                    let g = await v;
                    X({
                      eventName: u,
                      callbackId: g
                    }, p);
                  },
                  S = new Promise(g => v.then(() => g({
                    remove: E
                  })));
                return S.remove = async () => {
                  console.warn("Using addListener() without 'await' is deprecated.");
                  await E();
                }, S;
              },
              F = new Proxy({}, {
                get(u, p) {
                  switch (p) {
                    case "$$typeof":
                      return;
                    case "toJSON":
                      return () => ({});
                    case "addListener":
                      return C ? Se : J;
                    case "removeListener":
                      return X;
                    default:
                      return j(p);
                  }
                }
              });
            return n[c] = F, h.set(c, {
              name: c,
              proxy: F,
              platforms: new Set([...Object.keys(l), ...(C ? [x] : [])])
            }), F;
          };
        return i.convertFileSrc || (i.convertFileSrc = c => c), i.getPlatform = r, i.handleError = d, i.isNativePlatform = o, i.isPluginAvailable = s, i.registerPlugin = w, i.Exception = R, i.DEBUG = !!i.DEBUG, i.isLoggingEnabled = !!i.isLoggingEnabled, i;
      };
      Ce = t => t.Capacitor = ke(t);
      A = Ce(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
      m = A.registerPlugin;
      b = class {
        constructor() {
          this.listeners = {};
          this.retainedEventArguments = {};
          this.windowListeners = {};
        }
        addListener(e, i) {
          let n = !1;
          this.listeners[e] || (this.listeners[e] = [], n = !0);
          this.listeners[e].push(i);
          let o = this.windowListeners[e];
          o && !o.registered && this.addWindowListener(o);
          n && this.sendRetainedArgumentsForEvent(e);
          let s = async () => this.removeListener(e, i);
          return Promise.resolve({
            remove: s
          });
        }
        async removeAllListeners() {
          this.listeners = {};
          for (let e in this.windowListeners) this.removeWindowListener(this.windowListeners[e]);
          this.windowListeners = {};
        }
        notifyListeners(e, i, n) {
          let r = this.listeners[e];
          if (!r) {
            if (n) {
              let o = this.retainedEventArguments[e];
              o || (o = []);
              o.push(i);
              this.retainedEventArguments[e] = o;
            }
            return;
          }
          r.forEach(o => o(i));
        }
        hasListeners(e) {
          var i;
          return !!(!((i = this.listeners[e]) === null || i === void 0) && i.length);
        }
        registerWindowListener(e, i) {
          this.windowListeners[i] = {
            registered: !1,
            windowEventName: e,
            pluginEventName: i,
            handler: n => {
              this.notifyListeners(i, n);
            }
          };
        }
        unimplemented(e = "not implemented") {
          return new A.Exception(e, P.Unimplemented);
        }
        unavailable(e = "not available") {
          return new A.Exception(e, P.Unavailable);
        }
        async removeListener(e, i) {
          let n = this.listeners[e];
          if (!n) return;
          let r = n.indexOf(i);
          r !== -1 && this.listeners[e].splice(r, 1);
          this.listeners[e].length || this.removeWindowListener(this.windowListeners[e]);
        }
        addWindowListener(e) {
          window.addEventListener(e.windowEventName, e.handler);
          e.registered = !0;
        }
        removeWindowListener(e) {
          e && (window.removeEventListener(e.windowEventName, e.handler), e.registered = !1);
        }
        sendRetainedArgumentsForEvent(e) {
          let i = this.retainedEventArguments[e];
          i && (delete this.retainedEventArguments[e], i.forEach(n => {
            this.notifyListeners(e, n);
          }));
        }
      };
      W = t => encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      Q = t => t.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
      q = class extends b {
        async getCookies() {
          let e = document.cookie,
            i = {};
          return e.split(";").forEach(n => {
            if (n.length <= 0) return;
            let [r, o] = n.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
            r = Q(r).trim();
            o = Q(o).trim();
            i[r] = o;
          }), i;
        }
        async setCookie(e) {
          try {
            let i = W(e.key),
              n = W(e.value),
              r = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "",
              o = (e.path || "/").replace("path=", ""),
              s = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
            document.cookie = `${i}=${n || ""}${r}; path=${o}; ${s};`;
          } catch (i) {
            return Promise.reject(i);
          }
        }
        async deleteCookie(e) {
          try {
            document.cookie = `${e.key}=; Max-Age=0`;
          } catch (i) {
            return Promise.reject(i);
          }
        }
        async clearCookies() {
          try {
            let e = document.cookie.split(";") || [];
            for (let i of e) document.cookie = i.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
          } catch (e) {
            return Promise.reject(e);
          }
        }
        async clearAllCookies() {
          try {
            await this.clearCookies();
          } catch (e) {
            return Promise.reject(e);
          }
        }
      };
      Qe = m("CapacitorCookies", {
        web: () => new q()
      });
      Pe = async t => new Promise((e, i) => {
        let n = new FileReader();
        n.onload = () => {
          let r = n.result;
          e(r.indexOf(",") >= 0 ? r.split(",")[1] : r);
        };
        n.onerror = r => i(r);
        n.readAsDataURL(t);
      });
      Ae = (t = {}) => {
        let e = Object.keys(t);
        return Object.keys(t).map(r => r.toLocaleLowerCase()).reduce((r, o, s) => (r[o] = t[e[s]], r), {});
      };
      Te = (t, e = !0) => t ? Object.entries(t).reduce((n, r) => {
        let [o, s] = r,
          a,
          d;
        return Array.isArray(s) ? (d = "", s.forEach(h => {
          a = e ? encodeURIComponent(h) : h;
          d += `${o}=${a}&`;
        }), d.slice(0, -1)) : (a = e ? encodeURIComponent(s) : s, d = `${o}=${a}`), `${n}&${d}`;
      }, "").substr(1) : null;
      Be = (t, e = {}) => {
        let i = Object.assign({
            method: t.method || "GET",
            headers: t.headers
          }, e),
          r = Ae(t.headers)["content-type"] || "";
        if (typeof t.data == "string") i.body = t.data;else if (r.includes("application/x-www-form-urlencoded")) {
          let o = new URLSearchParams();
          for (let [s, a] of Object.entries(t.data || {})) o.set(s, a);
          i.body = o.toString();
        } else if (r.includes("multipart/form-data") || t.data instanceof FormData) {
          let o = new FormData();
          if (t.data instanceof FormData) t.data.forEach((a, d) => {
            o.append(d, a);
          });else for (let a of Object.keys(t.data)) o.append(a, t.data[a]);
          i.body = o;
          let s = new Headers(i.headers);
          s.delete("content-type");
          i.headers = s;
        } else (r.includes("application/json") || typeof t.data == "object") && (i.body = JSON.stringify(t.data));
        return i;
      };
      H = class extends b {
        async request(e) {
          let i = Be(e, e.webFetchExtra),
            n = Te(e.params, e.shouldEncodeUrlParams),
            r = n ? `${e.url}?${n}` : e.url,
            o = await fetch(r, i),
            s = o.headers.get("content-type") || "",
            {
              responseType: a = "text"
            } = o.ok ? e : {};
          s.includes("application/json") && (a = "json");
          let d, h;
          switch (a) {
            case "arraybuffer":
            case "blob":
              h = await o.blob();
              d = await Pe(h);
              break;
            case "json":
              d = await o.json();
              break;
            case "document":
            case "text":
            default:
              d = await o.text();
          }
          let w = {};
          return o.headers.forEach((c, l) => {
            w[l] = c;
          }), {
            data: d,
            headers: w,
            status: o.status,
            url: o.url
          };
        }
        async get(e) {
          return this.request(Object.assign(Object.assign({}, e), {
            method: "GET"
          }));
        }
        async post(e) {
          return this.request(Object.assign(Object.assign({}, e), {
            method: "POST"
          }));
        }
        async put(e) {
          return this.request(Object.assign(Object.assign({}, e), {
            method: "PUT"
          }));
        }
        async patch(e) {
          return this.request(Object.assign(Object.assign({}, e), {
            method: "PATCH"
          }));
        }
        async delete(e) {
          return this.request(Object.assign(Object.assign({}, e), {
            method: "DELETE"
          }));
        }
      };
      ie = m("CapacitorHttp", {
        web: () => new H()
      });
      (function (t) {
        t.Dark = "DARK";
        t.Light = "LIGHT";
        t.Default = "DEFAULT";
      })(ee || (ee = {}));
      (function (t) {
        t.StatusBar = "StatusBar";
        t.NavigationBar = "NavigationBar";
      })(te || (te = {}));
      z = class extends b {
        async setStyle() {
          this.unavailable("not available for web");
        }
        async setAnimation() {
          this.unavailable("not available for web");
        }
        async show() {
          this.unavailable("not available for web");
        }
        async hide() {
          this.unavailable("not available for web");
        }
      };
      et = m("SystemBars", {
        web: () => new z()
      });
    });
  var ne = {};
  Z(ne, {
    AppWeb: () => G
  });
  var G,
    re = V(() => {
      L();
      G = class extends b {
        constructor() {
          super();
          this.handleVisibilityChange = () => {
            let e = {
              isActive: document.hidden !== !0
            };
            this.notifyListeners("appStateChange", e);
            document.hidden ? this.notifyListeners("pause", null) : this.notifyListeners("resume", null);
          };
          document.addEventListener("visibilitychange", this.handleVisibilityChange, !1);
        }
        exitApp() {
          throw this.unimplemented("Not implemented on web.");
        }
        async getInfo() {
          throw this.unimplemented("Not implemented on web.");
        }
        async getLaunchUrl() {
          return {
            url: ""
          };
        }
        async getState() {
          return {
            isActive: document.hidden !== !0
          };
        }
        async minimizeApp() {
          throw this.unimplemented("Not implemented on web.");
        }
        async toggleBackButtonHandler() {
          throw this.unimplemented("Not implemented on web.");
        }
        async getAppLanguage() {
          return {
            value: navigator.language.split("-")[0].toLowerCase()
          };
        }
      };
    });
  var se = {};
  Z(se, {
    LocalNotificationsWeb: () => K
  });
  var K,
    ae = V(() => {
      L();
      K = class extends b {
        constructor() {
          super(...arguments);
          this.pending = [];
          this.deliveredNotifications = [];
          this.hasNotificationSupport = () => {
            if (!("Notification" in window) || !Notification.requestPermission) return !1;
            if (Notification.permission !== "granted") try {
              new Notification("");
            } catch (e) {
              if (e instanceof Error && e.name === "TypeError") return !1;
            }
            return !0;
          };
        }
        async getDeliveredNotifications() {
          let e = [];
          for (let i of this.deliveredNotifications) {
            let n = {
              title: i.title,
              id: parseInt(i.tag),
              body: i.body
            };
            e.push(n);
          }
          return {
            notifications: e
          };
        }
        async removeDeliveredNotifications(e) {
          for (let i of e.notifications) {
            let n = this.deliveredNotifications.find(r => r.tag === String(i.id));
            n?.close();
            this.deliveredNotifications = this.deliveredNotifications.filter(() => !n);
          }
        }
        async removeDeliveredNotificationsById(e) {
          for (let i of e.ids) {
            let n = this.deliveredNotifications.find(r => r.tag === String(i));
            n?.close();
            this.deliveredNotifications = this.deliveredNotifications.filter(r => r !== n);
          }
        }
        async removeAllDeliveredNotifications() {
          for (let e of this.deliveredNotifications) e.close();
          this.deliveredNotifications = [];
        }
        async getByIds(e) {
          let i = e.ids.map(o => String(o)),
            n = this.pending.filter(o => i.includes(String(o.id))),
            r = this.deliveredNotifications.filter(o => i.includes(o.tag)).map(o => this.deliveredToSchema(o));
          return {
            notifications: [...n, ...r]
          };
        }
        async getAll(e) {
          let i = [...this.pending],
            n = this.deliveredNotifications.map(r => this.deliveredToSchema(r));
          return e?.state === "SCHEDULED" ? {
            notifications: i
          } : e?.state === "TRIGGERED" ? {
            notifications: n
          } : {
            notifications: [...i, ...n]
          };
        }
        deliveredToSchema(e) {
          return {
            title: e.title,
            id: parseInt(e.tag),
            body: e.body
          };
        }
        async createChannel() {
          throw this.unimplemented("Not implemented on web.");
        }
        async deleteChannel() {
          throw this.unimplemented("Not implemented on web.");
        }
        async listChannels() {
          throw this.unimplemented("Not implemented on web.");
        }
        async schedule(e) {
          if (!this.hasNotificationSupport()) throw this.unavailable("Notifications not supported in this browser.");
          for (let i of e.notifications) this.sendNotification(i);
          return {
            notifications: e.notifications.map(i => ({
              id: i.id
            }))
          };
        }
        async update(e) {
          if (!this.hasNotificationSupport()) throw this.unavailable("Notifications not supported in this browser.");
          let i = [];
          for (let n of e.notifications) {
            let r = this.pending.findIndex(o => o.id === n.id);
            r !== -1 && (this.pending.splice(r, 1), this.sendNotification(n), i.push(n));
          }
          return {
            notifications: i.map(n => ({
              id: n.id
            }))
          };
        }
        async getPending() {
          return {
            notifications: this.pending
          };
        }
        async cancelAll() {
          this.pending = [];
        }
        async registerActionTypes() {
          throw this.unimplemented("Not implemented on web.");
        }
        async cancel(e) {
          this.pending = this.pending.filter(i => !e.notifications.find(n => n.id === i.id));
        }
        async areEnabled() {
          let {
            display: e
          } = await this.checkPermissions();
          return {
            value: e === "granted"
          };
        }
        async changeExactNotificationSetting() {
          throw this.unimplemented("Not implemented on web.");
        }
        async checkExactNotificationSetting() {
          throw this.unimplemented("Not implemented on web.");
        }
        async requestPermissions() {
          if (!this.hasNotificationSupport()) throw this.unavailable("Notifications not supported in this browser.");
          return {
            display: this.transformNotificationPermission(await Notification.requestPermission())
          };
        }
        async checkPermissions() {
          if (!this.hasNotificationSupport()) throw this.unavailable("Notifications not supported in this browser.");
          return {
            display: this.transformNotificationPermission(Notification.permission)
          };
        }
        transformNotificationPermission(e) {
          switch (e) {
            case "granted":
              return "granted";
            case "denied":
              return "denied";
            default:
              return "prompt";
          }
        }
        sendPending() {
          var e;
          let i = [],
            n = new Date().getTime();
          for (let r of this.pending) !((e = r.schedule) === null || e === void 0) && e.at && r.schedule.at.getTime() <= n && (this.buildNotification(r), i.push(r));
          this.pending = this.pending.filter(r => !i.find(o => o === r));
        }
        sendNotification(e) {
          var i;
          if (!((i = e.schedule) === null || i === void 0) && i.at) {
            let n = e.schedule.at.getTime() - new Date().getTime();
            this.pending.push(e);
            setTimeout(() => {
              this.sendPending();
            }, n);
            return;
          }
          this.buildNotification(e);
        }
        buildNotification(e) {
          let i = new Notification(e.title, {
            body: e.body,
            tag: String(e.id)
          });
          return i.addEventListener("click", this.onClick.bind(this, e), !1), i.addEventListener("show", this.onShow.bind(this, e), !1), i.addEventListener("close", () => {
            this.deliveredNotifications = this.deliveredNotifications.filter(() => !this);
          }, !1), this.deliveredNotifications.push(i), i;
        }
        onClick(e) {
          let i = {
            actionId: "tap",
            notification: e
          };
          this.notifyListeners("localNotificationActionPerformed", i);
        }
        onShow(e) {
          this.notifyListeners("localNotificationReceived", e);
        }
      };
    });
  L();
  L();
  var T = m("App", {
    web: () => Promise.resolve().then(() => (re(), ne)).then(t => new t.AppWeb())
  });
  L();
  var oe;
  (function (t) {
    t[t.Sunday = 1] = "Sunday";
    t[t.Monday = 2] = "Monday";
    t[t.Tuesday = 3] = "Tuesday";
    t[t.Wednesday = 4] = "Wednesday";
    t[t.Thursday = 5] = "Thursday";
    t[t.Friday = 6] = "Friday";
    t[t.Saturday = 7] = "Saturday";
  })(oe || (oe = {}));
  var B = m("LocalNotifications", {
    web: () => Promise.resolve().then(() => (ae(), se)).then(t => new t.LocalNotificationsWeb())
  });
  L();
  var ce;
  (function (t) {
    t.Dark = "DARK";
    t.Light = "LIGHT";
    t.Default = "DEFAULT";
  })(ce || (ce = {}));
  var de;
  (function (t) {
    t.None = "NONE";
    t.Slide = "SLIDE";
    t.Fade = "FADE";
  })(de || (de = {}));
  var le = m("StatusBar");
  var Y = A.getPlatform(),
    f = A.isNativePlatform() && Y === "android",
    we = "u2_silent_messages",
    Oe = 1800,
    M = 256 * 1024,
    ue = 3,
    Re = 80,
    _ = m("U2FileExport"),
    N = m("U2NativeBackup"),
    De = new Set(["https://ceshi2-7s6.pages.dev", "https://u2iisony.pages.dev"]),
    O = f ? "default" : "unsupported",
    $ = 0,
    fe = !1;
  function k(t, e = {}, i = {}) {
    return window.dispatchEvent(new CustomEvent(t, {
      detail: e,
      cancelable: !!i.cancelable
    }));
  }
  function Ie(t) {
    return t === "granted" ? "granted" : t === "denied" ? "denied" : "default";
  }
  function ge(t, e) {
    return O = Ie(t), k("u2:native-notification-permission-changed", {
      permission: O,
      reason: e
    }), O;
  }
  function ve(t) {
    if (!(t instanceof HTMLElement)) return !1;
    let e = window.getComputedStyle(t);
    return e.display !== "none" && e.visibility !== "hidden" && e.pointerEvents !== "none" && t.getClientRects().length > 0;
  }
  function he(t) {
    let e = [...document.querySelectorAll(t)].filter(ve);
    return e.sort((i, n) => {
      let r = Number.parseInt(window.getComputedStyle(i).zIndex, 10) || 0,
        o = Number.parseInt(window.getComputedStyle(n).zIndex, 10) || 0;
      return r !== o ? r - o : e.indexOf(i) - e.indexOf(n);
    }), e[e.length - 1] || null;
  }
  function pe(t) {
    if (!t) return !1;
    let e = ["[data-native-back]", '[data-action="back"]', ".native-back-btn", ".back-btn", '[id$="-back-btn"]', '[id$="-close-btn"]', '[aria-label="\u8FD4\u56DE"]', '[aria-label*="\u8FD4\u56DE"]', '[aria-label="\u5173\u95ED"]'],
      i = [...t.querySelectorAll(e.join(","))].find(n => ve(n) && !n.disabled);
    return i ? (i.click(), !0) : !1;
  }
  function Ue() {
    let t = he('.bottom-sheet-overlay.active, [role="dialog"].active');
    if (t) return pe(t) || (typeof window.closeView == "function" ? window.closeView(t) : t.classList.remove("active")), !0;
    let e = he([".app-view.active", ".settings-view.active", ".edit-view.active", ".detail-view.active"].join(","));
    return e ? (pe(e) || (typeof window.closeView == "function" ? window.closeView(e) : e.classList.remove("active")), !0) : !1;
  }
  async function _e(t) {
    if (!k("u2:native-back-button", {
      canGoBack: !!t?.canGoBack
    }, {
      cancelable: !0
    })) return;
    if (Ue()) {
      $ = 0;
      return;
    }
    let i = Date.now();
    if (i - $ <= Oe) {
      $ = 0;
      await T.exitApp();
      return;
    }
    $ = i;
    typeof window.showToast == "function" && window.showToast("\u518D\u6309\u4E00\u6B21\u9000\u51FA LHV");
  }
  function $e(t) {
    return String(t || "u2phone-export").replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_").replace(/\s+/g, " ").trim().slice(0, 180) || `u2phone-export-${Date.now()}`;
  }
  function ye(t) {
    return new Promise((e, i) => {
      let n = new FileReader();
      n.onerror = () => i(n.error || new Error("Unable to read export file"));
      n.onload = () => {
        let r = String(n.result || "");
        e(r.includes(",") ? r.slice(r.indexOf(",") + 1) : r);
      };
      n.readAsDataURL(t);
    });
  }
  async function Me({
    blob: t,
    fileName: e,
    title: i = ""
  } = {}) {
    if (!f) return "unavailable";
    if (!(t instanceof Blob)) throw new TypeError("A Blob is required");
    let n = $e(e),
      r = String(t.type || "application/octet-stream"),
      o = "";
    try {
      let s = await _.beginExport({
        fileName: n,
        mimeType: r,
        title: i || n
      });
      if (o = String(s?.token || ""), !o) throw new Error("Native export session did not start");
      for (let d = 0; d < t.size; d += M) {
        let h = t.slice(d, Math.min(t.size, d + M)),
          w = await ye(h);
        await _.appendExportChunk({
          token: o,
          data: w
        });
      }
      let a = await _.finishExport({
        token: o,
        fileName: n,
        mimeType: r,
        title: i || n
      });
      return o = "", a?.status === "cancelled" ? "cancelled" : "downloaded";
    } catch (s) {
      let a = String(s?.message || s || "");
      if (/cancel|canceled|cancelled/i.test(a)) return "cancelled";
      throw s;
    } finally {
      o && _.abortExport({
        token: o
      }).catch(() => {});
    }
  }
  function je(t) {
    let e = window.atob(String(t || "")),
      i = new Uint8Array(e.length);
    for (let n = 0; n < e.length; n += 1) i[n] = e.charCodeAt(n);
    return i;
  }
  async function Fe() {
    return f ? N.getStatus() : {
      exists: !1,
      unavailable: !0
    };
  }
  async function Ve({
    blob: t,
    metadata: e = {}
  } = {}) {
    if (!f) return {
      status: "unavailable"
    };
    if (!(t instanceof Blob)) throw new TypeError("A Blob is required for native storage backup");
    let i = "";
    try {
      let n = await N.beginBackup();
      if (i = String(n?.token || ""), !i) throw new Error("Native backup session did not start");
      for (let o = 0; o < t.size; o += M) {
        let s = t.slice(o, Math.min(t.size, o + M));
        await N.appendBackupChunk({
          token: i,
          data: await ye(s)
        });
      }
      let r = await N.commitBackup({
        token: i,
        schemaVersion: Math.max(0, Number(e.schemaVersion) || 0),
        exportedAt: Math.max(0, Number(e.exportedAt) || 0),
        recordCount: Math.max(0, Number(e.recordCount) || 0),
        payloadChecksum: String(e.payloadChecksum || "")
      });
      return i = "", r;
    } finally {
      i && N.abortBackup({
        token: i
      }).catch(() => {});
    }
  }
  async function qe() {
    if (!f) return null;
    let t = "";
    try {
      let e = await N.beginRestore();
      if (!e?.exists) return null;
      t = String(e.token || "");
      let i = Math.max(0, Number(e.size) || 0);
      if (!t || i <= 0) throw new Error("Native restore session is invalid");
      let n = [],
        r = 0;
      for (; r < i;) {
        let s = null,
          a = null,
          d = r,
          h = null;
        for (let w = 0; w < ue; w += 1) {
          try {
            if (s = await N.readRestoreChunk({
              token: t,
              offset: r
            }), a = je(s?.data), d = Math.max(0, Number(s?.offset) || 0), d > r && a.byteLength > 0) break;
            h = new Error("Native restore returned an empty or non-advancing chunk");
          } catch (c) {
            h = c;
          }
          w + 1 < ue && (await new Promise(c => setTimeout(c, Re * (w + 1))));
        }
        if (!a || d <= r || a.byteLength === 0) throw h || new Error("Native restore stopped before the backup was complete");
        if (n.push(a), r = d, s?.done === !0) break;
      }
      if (r !== i) throw new Error("Native restore size mismatch");
      return {
        text: await new Blob(n, {
          type: "application/json"
        }).text(),
        metadata: {
          slot: String(e.slot || ""),
          savedAt: Math.max(0, Number(e.savedAt) || 0),
          schemaVersion: Math.max(0, Number(e.schemaVersion) || 0),
          exportedAt: Math.max(0, Number(e.exportedAt) || 0),
          recordCount: Math.max(0, Number(e.recordCount) || 0),
          payloadChecksum: String(e.payloadChecksum || "")
        }
      };
    } finally {
      t && N.finishRestore({
        token: t
      }).catch(() => {});
    }
  }
  async function He() {
    return f ? N.deleteBackups() : {
      exists: !1,
      unavailable: !0
    };
  }
  async function ze({
    url: t,
    method: e = "GET",
    headers: i = {},
    body: n,
    timeoutMs: r = 18e3
  } = {}) {
    if (!f) throw new Error("Native NetEase requests are only available on Android");
    let o = new URL(String(t || ""));
    if (o.protocol !== "https:" || !De.has(o.origin) || !o.pathname.startsWith("/api/netease/")) throw new Error("Blocked native NetEase gateway URL");
    let s = Math.max(1e3, Number(r) || 18e3),
      a = {
        url: o.href,
        method: String(e || "GET").toUpperCase(),
        headers: i,
        connectTimeout: s,
        readTimeout: s,
        responseType: "json"
      };
    return n !== void 0 && (a.data = n), ie.request(a);
  }
  function Ge(t) {
    let e = String(t || `${Date.now()}-${Math.random()}`),
      i = 2166136261;
    for (let n = 0; n < e.length; n += 1) {
      i ^= e.charCodeAt(n);
      i = Math.imul(i, 16777619);
    }
    return i >>> 0 & 2147483647 || 1;
  }
  async function Ke() {
    !f || fe || (await B.createChannel({
      id: we,
      name: "LHV \u81EA\u5B9A\u4E49\u63D0\u793A\u97F3\u6D88\u606F",
      description: "\u901A\u77E5\u7531\u7CFB\u7EDF\u663E\u793A\uFF0C\u63D0\u793A\u97F3\u7531 LHV \u64AD\u653E",
      importance: 4
    }), fe = !0);
  }
  async function be(t = "check") {
    if (!f) return O;
    let e = await B.checkPermissions();
    return ge(e.display, t);
  }
  async function Ye() {
    if (!f) return "unsupported";
    let t = await B.requestPermissions();
    return ge(t.display, "request");
  }
  async function Je({
    title: t,
    body: e,
    tag: i,
    data: n,
    silent: r = !1
  } = {}) {
    return !f || O !== "granted" ? !1 : (r && (await Ke()), await B.schedule({
      notifications: [{
        id: Ge(i),
        title: String(t || "LHV"),
        body: String(e || "\u65B0\u6D88\u606F"),
        ...(r ? {
          channelId: we
        } : {}),
        extra: n || {}
      }]
    }), !0);
  }
  async function me() {
    f && (await le.hide());
  }
  async function Xe() {
    document.documentElement.classList.toggle("u2-native-android", f);
    f && (await Promise.allSettled([me(), be("startup")]), await T.addListener("backButton", _e), await T.addListener("pause", () => k("u2:native-pause", {
      at: Date.now()
    })), await T.addListener("resume", () => {
      me().catch(t => {
        console.warn("[native_bridge] Failed to restore hidden status bar:", t);
      });
      k("u2:native-resume", {
        at: Date.now()
      });
    }), await T.addListener("appStateChange", t => {
      k("u2:native-app-state", {
        isActive: !!t.isActive,
        at: Date.now()
      });
    }), await B.addListener("localNotificationActionPerformed", t => {
      k("u2:native-notification-action", {
        notification: t.notification,
        actionId: t.actionId,
        inputValue: t.inputValue
      });
    }));
  }
  var Ze = Xe().catch(t => {
    console.warn("[native_bridge] Native runtime initialization failed:", t);
  });
  window.u2NativeBridge = Object.freeze({
    isNativeAndroid: () => f,
    getPlatform: () => Y,
    ready: () => Ze,
    exportFile: Me,
    getStorageBackupStatus: Fe,
    writeStorageBackup: Ve,
    readStorageBackup: qe,
    deleteStorageBackups: He,
    requestNetEaseGateway: ze,
    getNotificationPermission: () => O,
    refreshNotificationPermission: be,
    requestNotificationPermission: Ye,
    showNotification: Je
  });
  k("u2:native-bridge-ready", {
    platform: Y,
    isNativeAndroid: f
  });
})();
