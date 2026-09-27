(() => {
  var vd = Object.defineProperty;
  var kS = (e, t, r) => t in e ? vd(e, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
  var xc = (e, t) => {
    for (var r in t) vd(e, r, {
      get: t[r],
      enumerable: !0
    });
  };
  var R = (e, t, r) => kS(e, typeof t != "symbol" ? t + "" : t, r);
  var CS = Object.create,
    Ds = Object.defineProperty,
    IS = Object.getOwnPropertyDescriptor,
    OS = Object.getOwnPropertyNames,
    NS = Object.getPrototypeOf,
    AS = Object.prototype.hasOwnProperty,
    Rd = (e, t) => () => (t || e((t = {
      exports: {}
    }).exports, t), t.exports),
    wd = (e, t) => {
      let r = {};
      for (var o in e) Ds(r, o, {
        get: e[o],
        enumerable: !0
      });
      return t && Ds(r, Symbol.toStringTag, {
        value: "Module"
      }), r;
    },
    MS = (e, t, r, o) => {
      if (t && typeof t == "object" || typeof t == "function") for (var n = OS(t), s = 0, i = n.length, a; s < i; s++) {
        a = n[s];
        !AS.call(e, a) && a !== r && Ds(e, a, {
          get: (u => t[u]).bind(null, a),
          enumerable: !(o = IS(t, a)) || o.enumerable
        });
      }
      return e;
    },
    xd = (e, t, r) => (r = e != null ? CS(NS(e)) : {}, MS(t || !e || !e.__esModule ? Ds(r, "default", {
      value: e,
      enumerable: !0
    }) : r, e));
  var qS = new Set(["https://json-schema.org/draft/2020-12/schema", "http://json-schema.org/draft/2020-12/schema"]),
    Pd = new Set(["https://json-schema.org/draft/2019-09/schema", "http://json-schema.org/draft/2019-09/schema"]),
    jS = new Set(["https://json-schema.org/draft-07/schema", "http://json-schema.org/draft-07/schema"]),
    LS = new Set(["https://json-schema.org/draft-06/schema", "http://json-schema.org/draft-06/schema"]);
  function $d(e) {
    return typeof e == "string" && Pd.has(e.replace(/#$/, ""));
  }
  function Td(e, t) {
    if (!("$schema" in e) || typeof e.$schema != "string") return "2020-12";
    let r = e.$schema.replace(/#$/, "");
    if (qS.has(r)) return "2020-12";
    if (Pd.has(r)) return "2019-09";
    if (jS.has(r) || LS.has(r)) return "draft-7";
    throw new Error(`JSON Schema declares an unsupported dialect ("$schema": "${e.$schema.slice(0, 200)}"). The default validator supports JSON Schema 2020-12, 2019-09, draft-07, and draft-06; ${t}`);
  }
  var G = {};
  xc(G, {
    BIGINT_FORMAT_RANGES: () => Od,
    CONSTANT_CATCH: () => qd,
    Class: () => $c,
    NUMBER_FORMAT_RANGES: () => Mc,
    aborted: () => Zt,
    allowsEval: () => Oc,
    assert: () => VS,
    assertEqual: () => US,
    assertIs: () => DS,
    assertNever: () => FS,
    assertNotEqual: () => ZS,
    assignProp: () => ge,
    attachSchema: () => Js,
    base64ToUint8Array: () => Ad,
    base64urlToUint8Array: () => c_,
    cached: () => Fr,
    captureStackTrace: () => Vs,
    cleanEnum: () => a_,
    cleanRegex: () => dn,
    clone: () => tt,
    cloneDef: () => JS,
    codePointLength: () => pn,
    constantCatch: () => jd,
    createTransparentProxy: () => XS,
    defineLazy: () => kc,
    defineLazyInternal: () => Q,
    esc: () => Cc,
    escapeRegex: () => bt,
    explicitlyAborted: () => qc,
    extend: () => t_,
    finalizeIssue: () => nt,
    floatSafeRemainder: () => Ec,
    getElementAtPath: () => BS,
    getEnumValues: () => ln,
    getLengthableOrigin: () => hn,
    getParsedType: () => YS,
    getSizableOrigin: () => Nd,
    hexToUint8Array: () => l_,
    hide: () => Uc,
    installLazyProp: () => f_,
    isObject: () => ur,
    isPlainObject: () => Ut,
    issue: () => Vr,
    joinValues: () => Fs,
    jsonStringifyReplacer: () => Dr,
    members: () => Lc,
    merge: () => o_,
    mergeDefs: () => yt,
    normalizeParams: () => Z,
    nullish: () => Tc,
    numKeys: () => GS,
    objectClone: () => HS,
    omit: () => e_,
    optionalKeys: () => Ac,
    own: () => Zr,
    parsedType: () => jc,
    partial: () => n_,
    pick: () => QS,
    prefixIssues: () => vt,
    primitiveTypes: () => Id,
    promiseAllObject: () => WS,
    propertyKeyTypes: () => Nc,
    randomString: () => KS,
    required: () => s_,
    safeExtend: () => r_,
    shallowClone: () => Cd,
    slugify: () => Ic,
    stringifyPrimitive: () => Hs,
    toZod: () => kd,
    uint8ArrayToBase64: () => Md,
    uint8ArrayToBase64url: () => u_,
    uint8ArrayToHex: () => d_,
    unwrapMessage: () => Ur
  });
  function US(e) {
    return e;
  }
  function ZS(e) {
    return e;
  }
  function kd() {
    return e => e;
  }
  function DS(e) {}
  function FS(e) {
    throw new Error("Unexpected value in exhaustive check");
  }
  function VS(e) {}
  function ln(e) {
    let t = Object.values(e).filter(o => typeof o == "number");
    return Object.entries(e).filter(([o, n]) => t.indexOf(+o) === -1).map(([o, n]) => n);
  }
  function Fs(e, t = "|") {
    return e.map(r => Hs(r)).join(t);
  }
  function Dr(e, t) {
    return typeof t == "bigint" ? t.toString() : t;
  }
  function Fr(e) {
    return {
      get value() {
        {
          let r = e();
          return Object.defineProperty(this, "value", {
            value: r
          }), r;
        }
        throw new Error("cached value already set");
      }
    };
  }
  function Tc(e) {
    return e == null;
  }
  function dn(e) {
    let t = e.startsWith("^") ? 1 : 0,
      r = e.endsWith("$") ? e.length - 1 : e.length;
    return e.slice(t, r);
  }
  function Ec(e, t) {
    let r = e / t,
      o = Math.round(r),
      n = 4 * Number.EPSILON * Math.max(Math.abs(r), 1);
    return Math.abs(r - o) < n ? 0 : r - o;
  }
  var Ed = Symbol("evaluating");
  function kc(e, t, r) {
    let o;
    Object.defineProperty(e, t, {
      get() {
        if (o !== Ed) return o === void 0 && (o = Ed, o = r()), o;
      },
      set(n) {
        Object.defineProperty(e, t, {
          value: n
        });
      },
      configurable: !0
    });
  }
  function HS(e) {
    return Object.create(Object.getPrototypeOf(e), Object.getOwnPropertyDescriptors(e));
  }
  function ge(e, t, r) {
    Object.defineProperty(e, t, {
      value: r,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  }
  function yt(...e) {
    let t = {};
    for (let r of e) {
      let o = Object.getOwnPropertyDescriptors(r);
      Object.assign(t, o);
    }
    return Object.defineProperties({}, t);
  }
  function JS(e) {
    return yt(e._zod.def);
  }
  function BS(e, t) {
    return t ? t.reduce((r, o) => r?.[o], e) : e;
  }
  function WS(e) {
    let t = Object.keys(e),
      r = t.map(o => e[o]);
    return Promise.all(r).then(o => {
      let n = {};
      for (let s = 0; s < t.length; s++) n[t[s]] = o[s];
      return n;
    });
  }
  function KS(e = 10) {
    let t = "abcdefghijklmnopqrstuvwxyz",
      r = "";
    for (let o = 0; o < e; o++) r += t[Math.floor(Math.random() * t.length)];
    return r;
  }
  function Cc(e) {
    return JSON.stringify(e);
  }
  function Ic(e) {
    return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  }
  var Vs = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
  function ur(e) {
    return typeof e == "object" && e !== null && !Array.isArray(e);
  }
  var Oc = Fr(() => {
    if (Le.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
    try {
      let e = Function;
      return new e(""), !0;
    } catch {
      return !1;
    }
  });
  function Ut(e) {
    if (ur(e) === !1) return !1;
    let t = e.constructor;
    if (t === void 0 || typeof t != "function") return !0;
    let r = t.prototype;
    return !(ur(r) === !1 || Object.prototype.hasOwnProperty.call(r, "isPrototypeOf") === !1);
  }
  function Cd(e) {
    return Ut(e) ? {
      ...e
    } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
  }
  function GS(e) {
    let t = 0;
    for (let r in e) Object.prototype.hasOwnProperty.call(e, r) && t++;
    return t;
  }
  var YS = e => {
      let t = typeof e;
      switch (t) {
        case "undefined":
          return "undefined";
        case "string":
          return "string";
        case "number":
          return Number.isNaN(e) ? "nan" : "number";
        case "boolean":
          return "boolean";
        case "function":
          return "function";
        case "bigint":
          return "bigint";
        case "symbol":
          return "symbol";
        case "object":
          return Array.isArray(e) ? "array" : e === null ? "null" : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? "promise" : typeof Map < "u" && e instanceof Map ? "map" : typeof Set < "u" && e instanceof Set ? "set" : typeof Date < "u" && e instanceof Date ? "date" : typeof File < "u" && e instanceof File ? "file" : "object";
        default:
          throw new Error(`Unknown data type: ${t}`);
      }
    },
    Nc = new Set(["string", "number", "symbol"]),
    Id = new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
  function bt(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function tt(e, t, r) {
    let o = new e._zod.constr(t ?? e._zod.def);
    return (!t || r?.parent) && (o._zod.parent = e), o;
  }
  function Z(e) {
    let t = e;
    if (!t) return {};
    if (typeof t == "string") return {
      error: () => t
    };
    if (t?.message !== void 0) {
      if (t?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
      t.error = t.message;
    }
    return delete t.message, typeof t.error == "string" ? {
      ...t,
      error: () => t.error
    } : t;
  }
  function XS(e) {
    let t;
    return new Proxy({}, {
      get(r, o, n) {
        return t ?? (t = e()), Reflect.get(t, o, n);
      },
      set(r, o, n, s) {
        return t ?? (t = e()), Reflect.set(t, o, n, s);
      },
      has(r, o) {
        return t ?? (t = e()), Reflect.has(t, o);
      },
      deleteProperty(r, o) {
        return t ?? (t = e()), Reflect.deleteProperty(t, o);
      },
      ownKeys(r) {
        return t ?? (t = e()), Reflect.ownKeys(t);
      },
      getOwnPropertyDescriptor(r, o) {
        return t ?? (t = e()), Reflect.getOwnPropertyDescriptor(t, o);
      },
      defineProperty(r, o, n) {
        return t ?? (t = e()), Reflect.defineProperty(t, o, n);
      }
    });
  }
  function Hs(e) {
    return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
  }
  function Ac(e) {
    return Object.keys(e).filter(t => e[t]._zod.optin !== void 0 && e[t]._zod.optout === "optional");
  }
  var Mc = {
      safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      int32: [-2147483648, 2147483647],
      uint32: [0, 4294967295],
      float32: [-34028234663852886e22, 34028234663852886e22],
      float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
    },
    Od = {
      int64: [BigInt("-9223372036854775808"), BigInt("9223372036854775807")],
      uint64: [BigInt(0), BigInt("18446744073709551615")]
    };
  function QS(e, t) {
    let r = e._zod.def,
      o = r.checks;
    if (o && o.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
    let s = yt(e._zod.def, {
      get shape() {
        let i = {};
        for (let a of Reflect.ownKeys(t)) {
          if (!Object.prototype.hasOwnProperty.call(r.shape, a)) throw new Error(`Unrecognized key: "${String(a)}"`);
          t[a] && ge(i, a, r.shape[a]);
        }
        return ge(this, "shape", i), i;
      },
      checks: []
    });
    return tt(e, s);
  }
  function e_(e, t) {
    let r = e._zod.def,
      o = r.checks;
    if (o && o.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
    let s = yt(e._zod.def, {
      get shape() {
        let i = {
          ...e._zod.def.shape
        };
        for (let a of Reflect.ownKeys(t)) {
          if (!Object.prototype.hasOwnProperty.call(r.shape, a)) throw new Error(`Unrecognized key: "${String(a)}"`);
          t[a] && delete i[a];
        }
        return ge(this, "shape", i), i;
      },
      checks: []
    });
    return tt(e, s);
  }
  function t_(e, t) {
    if (!Ut(t)) throw new Error("Invalid input to extend: expected a plain object");
    let r = e._zod.def.checks;
    if (r && r.length > 0) {
      let s = e._zod.def.shape;
      for (let i of Reflect.ownKeys(t)) if (Object.getOwnPropertyDescriptor(s, i) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
    }
    let n = yt(e._zod.def, {
      get shape() {
        let s = {
          ...e._zod.def.shape,
          ...t
        };
        return ge(this, "shape", s), s;
      }
    });
    return tt(e, n);
  }
  function r_(e, t) {
    if (!Ut(t)) throw new Error("Invalid input to safeExtend: expected a plain object");
    let r = yt(e._zod.def, {
      get shape() {
        let o = {
          ...e._zod.def.shape,
          ...t
        };
        return ge(this, "shape", o), o;
      }
    });
    return tt(e, r);
  }
  function o_(e, t) {
    if (!t?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
    if (e._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
    let r = yt(e._zod.def, {
      get shape() {
        let o = {
          ...e._zod.def.shape,
          ...t._zod.def.shape
        };
        return ge(this, "shape", o), o;
      },
      get catchall() {
        return t._zod.def.catchall;
      },
      checks: t._zod.def.checks ?? []
    });
    return tt(e, r);
  }
  function n_(e, t, r, o = "partial") {
    let s = t._zod.def.checks;
    if (s && s.length > 0) throw new Error(`.${o}() cannot be used on object schemas containing refinements`);
    let a = yt(t._zod.def, {
      get shape() {
        let u = t._zod.def.shape,
          l = {
            ...u
          };
        if (r) for (let d of Reflect.ownKeys(r)) {
          if (!Object.prototype.hasOwnProperty.call(u, d)) throw new Error(`Unrecognized key: "${String(d)}"`);
          r[d] && (l[d] = e ? new e({
            type: "optional",
            innerType: u[d]
          }) : u[d]);
        } else for (let d of Reflect.ownKeys(u)) l[d] = e ? new e({
          type: "optional",
          innerType: u[d]
        }) : u[d];
        return ge(this, "shape", l), l;
      },
      checks: []
    });
    return tt(t, a);
  }
  function s_(e, t, r) {
    let o = yt(t._zod.def, {
      get shape() {
        let n = t._zod.def.shape,
          s = {
            ...n
          };
        if (r) for (let i of Reflect.ownKeys(r)) {
          if (!Object.prototype.hasOwnProperty.call(s, i)) throw new Error(`Unrecognized key: "${String(i)}"`);
          r[i] && (s[i] = new e({
            type: "nonoptional",
            innerType: n[i]
          }));
        } else for (let i of Reflect.ownKeys(n)) s[i] = new e({
          type: "nonoptional",
          innerType: n[i]
        });
        return ge(this, "shape", s), s;
      }
    });
    return tt(t, o);
  }
  function Zt(e, t = 0) {
    if (e.aborted === !0) return !0;
    for (let r = t; r < e.issues.length; r++) if (e.issues[r]?.continue !== !0) return !0;
    return !1;
  }
  function qc(e, t = 0) {
    if (e.aborted === !0) return !0;
    for (let r = t; r < e.issues.length; r++) if (e.issues[r]?.continue === !1) return !0;
    return !1;
  }
  function vt(e, t) {
    return t.map(r => {
      var o;
      return (o = r).path ?? (o.path = []), r.path.unshift(e), r;
    });
  }
  function Ur(e) {
    return typeof e == "string" ? e : e?.message;
  }
  function Js(e, t, r) {
    var o;
    for (let n = t; n < e.length; n++) (o = e[n]).schema ?? (o.schema = r);
  }
  function nt(e, t, r) {
    var o;
    let n = e.inst?._zod?.traits;
    n?.has("$ZodType") && (n.has("$ZodCheck") ? (o = e).schema ?? (o.schema = e.inst) : e.schema = e.inst);
    let s = e.schema !== e.inst ? e.schema?._zod.def?.error : void 0,
      i = e.message ? e.message : Ur(e.inst?._zod.def?.error?.(e)) ?? Ur(s?.(e)) ?? Ur(t?.error?.(e)) ?? Ur(r.customError?.(e)) ?? Ur(r.localeError?.(e)) ?? "Invalid input",
      {
        inst: a,
        schema: u,
        continue: l,
        input: d,
        ...p
      } = e;
    return p.path ?? (p.path = []), p.message = i, t?.reportInput && (p.input = d), p;
  }
  function Nd(e) {
    return e instanceof Set ? "set" : e instanceof Map ? "map" : e instanceof File ? "file" : "unknown";
  }
  var i_ = /[\uD800-\uDBFF]/;
  function pn(e) {
    let t = e.length;
    if (!i_.test(e)) return t;
    let r = t;
    for (let o = 0; o < t - 1; o++) (e.charCodeAt(o) & 64512) === 55296 && (e.charCodeAt(o + 1) & 64512) === 56320 && (r--, o++);
    return r;
  }
  function hn(e) {
    return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
  }
  function jc(e) {
    let t = typeof e;
    switch (t) {
      case "number":
        return Number.isNaN(e) ? "nan" : "number";
      case "object":
        {
          if (e === null) return "null";
          if (Array.isArray(e)) return "array";
          let r = e;
          if (r && Object.getPrototypeOf(r) !== Object.prototype && "constructor" in r && r.constructor) return r.constructor.name;
        }
    }
    return t;
  }
  function Vr(...e) {
    let [t, r, o] = e;
    return typeof t == "string" ? {
      message: t,
      code: "custom",
      input: r,
      inst: o
    } : {
      ...t
    };
  }
  function a_(e) {
    return Object.entries(e).filter(([t, r]) => Number.isNaN(Number.parseInt(t, 10))).map(t => t[1]);
  }
  function Ad(e) {
    let t = atob(e),
      r = new Uint8Array(t.length);
    for (let o = 0; o < t.length; o++) r[o] = t.charCodeAt(o);
    return r;
  }
  function Md(e) {
    let t = "";
    for (let r = 0; r < e.length; r++) t += String.fromCharCode(e[r]);
    return btoa(t);
  }
  function c_(e) {
    let t = e.replace(/-/g, "+").replace(/_/g, "/"),
      r = "=".repeat((4 - t.length % 4) % 4);
    return Ad(t + r);
  }
  function u_(e) {
    return Md(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  function l_(e) {
    let t = e.replace(/^0x/, "");
    if (t.length % 2 !== 0) throw new Error("Invalid hex string length");
    let r = new Uint8Array(t.length / 2);
    for (let o = 0; o < t.length; o += 2) r[o / 2] = Number.parseInt(t.slice(o, o + 2), 16);
    return r;
  }
  function d_(e) {
    return Array.from(e).map(t => t.toString(16).padStart(2, "0")).join("");
  }
  var $c = class {
    constructor(...t) {}
  };
  function Lc(e, t) {
    for (let r in t) {
      let o = Object.getOwnPropertyDescriptor(t, r);
      o.get ? Object.defineProperty(e, r, {
        ...o,
        enumerable: !1
      }) : p_(e, r, o.value);
    }
  }
  function Zr(e, t, r, o = !0) {
    return Object.defineProperty(e, t, {
      configurable: !0,
      writable: !0,
      enumerable: o,
      value: r
    }), r;
  }
  function Uc(e, t, r) {
    return Zr(e, t, r, !1);
  }
  function p_(e, t, r) {
    Object.defineProperty(e, t, {
      configurable: !0,
      get() {
        return this == null ? r : Zr(this, t, r.bind(this));
      },
      set(o) {
        Zr(this, t, o);
      }
    });
  }
  function h_(e, t) {
    let r = Object.getPrototypeOf(e);
    return t in r ? void 0 : r;
  }
  var Pc,
    Lt = !1,
    m_ = {
      configurable: !0,
      get() {
        Lt = !0;
      }
    };
  function Q(e, t, r) {
    let o = Object.getPrototypeOf(e._zod);
    if (t in o && Pc !== e._zod) {
      Pc = void 0;
      return;
    }
    Pc = e._zod;
    Object.defineProperty(o, t, {
      configurable: !0,
      get() {
        Object.defineProperty(this, t, m_);
        let n = Lt;
        Lt = !1;
        try {
          let s = r(this);
          return Lt ? delete this[t] : Object.defineProperty(this, t, {
            configurable: !0,
            writable: !0,
            value: s
          }), Lt = Lt || n, s;
        } catch (s) {
          throw delete this[t], Lt = Lt || n, s;
        }
      },
      set(n) {
        Object.defineProperty(this, t, {
          configurable: !0,
          writable: !0,
          value: n
        });
      }
    });
  }
  function f_(e, t, r, o) {
    let n = h_(e, t);
    n && Object.defineProperty(n, t, {
      configurable: !0,
      get() {
        let s = {
          configurable: !0,
          writable: !0,
          enumerable: o,
          value: void 0
        };
        return Object.defineProperty(this, t, s), s.value = r(this), Object.defineProperty(this, t, s), s.value;
      },
      set(s) {
        Object.defineProperty(this, t, {
          configurable: !0,
          writable: !0,
          enumerable: o,
          value: s
        });
      }
    });
  }
  var qd = "~constantCatch";
  function jd(e) {
    let t = () => e;
    return t[qd] = !0, t;
  }
  var Ld,
    Dc = Object.freeze({
      status: "aborted"
    }),
    Zc = {
      value: void 0,
      enumerable: !1
    },
    Ud = "captureStackTrace" in Error ? Error : null;
  function g_(e) {
    let t = Ud;
    if (t) {
      let r = t.stackTraceLimit;
      if (typeof r == "number") {
        try {
          t.stackTraceLimit = 0;
        } catch {
          return Ud = null, new e();
        }
        try {
          return new e();
        } finally {
          t.stackTraceLimit = r;
        }
      }
    }
    return new e();
  }
  function z(e, t, r, o) {
    let n = {};
    function s(h) {
      this.def = h;
      this.constr = p;
      this.traits = new Set();
    }
    s.prototype = n;
    let i = r,
      a = i && new WeakSet();
    function u(h, f) {
      if (!h._zod) {
        Zc.value = new s(f);
        try {
          Object.defineProperty(h, "_zod", Zc);
        } finally {
          Zc.value = void 0;
        }
      }
      if (h._zod.traits.has(e)) return;
      if (h._zod.traits.add(e), t(h, f), a) {
        let y = Object.getPrototypeOf(h),
          b = h._zod.constr.prototype,
          T = y;
        for (; T && T !== b;) T = Object.getPrototypeOf(T);
        let L = T ?? y;
        a.has(L) || (a.add(L), Lc(L, i));
      }
      let g = p.prototype;
      for (let y in g) Object.prototype.hasOwnProperty.call(g, y) && (y in h || (h[y] = g[y].bind(h)));
    }
    let l = o?.Parent ?? Object;
    class d extends l {}
    Object.defineProperty(d, "name", {
      value: e
    });
    function p(h) {
      let f = o?.Parent ? g_(d) : this;
      u(f, h);
      let g = f._zod.deferred;
      if (g) {
        for (let b of g) b();
        f._zod.deferred = void 0;
      }
      let y = globalThis.__zod_globalConfig?.postProcessor;
      return y && y(f), f;
    }
    return Object.defineProperty(p, "init", {
      value: u
    }), Object.defineProperty(p, Symbol.hasInstance, {
      value: h => o?.Parent && h instanceof o.Parent ? !0 : h?._zod?.traits?.has(e)
    }), Object.defineProperty(p, "name", {
      value: e
    }), p;
  }
  var gt = class extends Error {
      constructor() {
        super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
      }
    },
    Hr = class extends Error {
      constructor(t) {
        super(`Encountered unidirectional transform during encode: ${t}`);
        this.name = "ZodEncodeError";
      }
    };
  (Ld = globalThis).__zod_globalConfig ?? (Ld.__zod_globalConfig = {});
  var Le = globalThis.__zod_globalConfig;
  function Ue(e) {
    return e && Object.assign(Le, e), Le;
  }
  function S_() {
    let e = this._zod;
    return e.message ?? (e.message = JSON.stringify(e.def, Dr, 2)), e.message;
  }
  function __(e) {
    this._zod.message = e;
  }
  var z_ = {
      get: S_,
      set: __,
      enumerable: !0,
      configurable: !0
    },
    Vc = {
      value: void 0,
      enumerable: !1
    },
    Hc = {
      value: void 0,
      enumerable: !1
    },
    Zd = new WeakSet([Object.prototype, Error.prototype]),
    Dd = (e, t) => {
      e.name = "$ZodError";
      Vc.value = e._zod;
      Object.defineProperty(e, "_zod", Vc);
      Hc.value = t;
      Object.defineProperty(e, "issues", Hc);
      Vc.value = void 0;
      Hc.value = void 0;
      Object.defineProperty(e, "message", z_);
      let r = Object.getPrototypeOf(e);
      Zd.has(r) || (Zd.add(r), Object.defineProperty(r, "toString", {
        configurable: !0,
        enumerable: !1,
        get() {
          let o = () => this.message;
          return Object.defineProperty(this, "toString", {
            value: o,
            configurable: !0,
            writable: !0
          }), o;
        },
        set(o) {
          Object.defineProperty(this, "toString", {
            value: o,
            configurable: !0,
            writable: !0
          });
        }
      }));
    },
    Bs = z("$ZodError", Dd),
    Jc = z("$ZodError", Dd, void 0, {
      Parent: Error
    });
  function y_(e, t, r) {
    return Object.prototype.hasOwnProperty.call(e, t) || (t === "__proto__" ? Object.defineProperty(e, t, {
      value: r(),
      writable: !0,
      enumerable: !0,
      configurable: !0
    }) : e[t] = r()), e[t];
  }
  function Bc(e, t = r => r.message) {
    let r = {},
      o = [];
    for (let n of e.issues) n.path.length > 0 ? y_(r, n.path[0], () => []).push(t(n)) : o.push(t(n));
    return {
      formErrors: o,
      fieldErrors: r
    };
  }
  function Wc(e, t = r => r.message) {
    let r = {
        _errors: []
      },
      o = (n, s = []) => {
        for (let i of n.issues) if (i.code === "invalid_union" && i.errors.length) i.errors.map(a => o({
          issues: a
        }, [...s, ...i.path]));else if (i.code === "invalid_key") o({
          issues: i.issues
        }, [...s, ...i.path]);else if (i.code === "invalid_element") o({
          issues: i.issues
        }, [...s, ...i.path]);else {
          let a = [...s, ...i.path];
          if (a.length === 0) r._errors.push(t(i));else {
            let u = r,
              l = 0;
            for (; l < a.length;) {
              let d = a[l],
                p = l === a.length - 1;
              if (d === "_errors") {
                p && u._errors.push(t(i));
                l++;
                continue;
              }
              Object.prototype.hasOwnProperty.call(u, d) || Object.defineProperty(u, d, {
                value: {
                  _errors: []
                },
                enumerable: !0,
                writable: !0,
                configurable: !0
              });
              let h = u[d];
              p && h._errors.push(t(i));
              u = h;
              l++;
            }
          }
        }
      };
    return o(e), r;
  }
  function Ws(e, t) {
    return {
      callee: t?.callee ?? e,
      Err: t?.Err
    };
  }
  var Ks = e => {
    let t = (r, o, n, s) => {
      let i = n ? {
          ...n,
          async: !1
        } : {
          async: !1
        },
        a = r._zod.run({
          value: o,
          issues: []
        }, i);
      if (a instanceof Promise) throw new gt();
      if (a.issues.length) {
        let u = new (s?.Err ?? e)(a.issues.map(l => nt(l, i, Ue())));
        throw Vs(u, s?.callee ?? t), u;
      }
      return a.value;
    };
    return t;
  };
  var Gs = e => {
    let t = async (r, o, n, s) => {
      let i = n ? {
          ...n,
          async: !0
        } : {
          async: !0
        },
        a = r._zod.run({
          value: o,
          issues: []
        }, i);
      if (a instanceof Promise && (a = await a), a.issues.length) {
        let u = new (s?.Err ?? e)(a.issues.map(l => nt(l, i, Ue())));
        throw Vs(u, s?.callee ?? t), u;
      }
      return a.value;
    };
    return t;
  };
  var mn = e => (t, r, o) => {
      let n = o ? {
          ...o,
          async: !1
        } : {
          async: !1
        },
        s = t._zod.run({
          value: r,
          issues: []
        }, n);
      if (s instanceof Promise) throw new gt();
      return s.issues.length ? {
        success: !1,
        error: new (e ?? Bs)(s.issues.map(i => nt(i, n, Ue())))
      } : {
        success: !0,
        data: s.value
      };
    },
    Fd = mn(Jc),
    fn = e => async (t, r, o) => {
      let n = o ? {
          ...o,
          async: !0
        } : {
          async: !0
        },
        s = t._zod.run({
          value: r,
          issues: []
        }, n);
      return s instanceof Promise && (s = await s), s.issues.length ? {
        success: !1,
        error: new e(s.issues.map(i => nt(i, n, Ue())))
      } : {
        success: !0,
        data: s.value
      };
    },
    Vd = fn(Jc);
  var Hd = e => {
    let t = Ks(e),
      r = (o, n, s, i) => {
        let a = s ? {
          ...s,
          direction: "backward"
        } : {
          direction: "backward"
        };
        return t(o, n, a, Ws(r, i));
      };
    return r;
  };
  var Jd = e => {
    let t = Ks(e),
      r = (o, n, s, i) => t(o, n, s, Ws(r, i));
    return r;
  };
  var Bd = e => {
    let t = Gs(e),
      r = async (o, n, s, i) => {
        let a = s ? {
          ...s,
          direction: "backward"
        } : {
          direction: "backward"
        };
        return await t(o, n, a, Ws(r, i));
      };
    return r;
  };
  var Wd = e => {
    let t = Gs(e),
      r = async (o, n, s, i) => await t(o, n, s, Ws(r, i));
    return r;
  };
  var Kd = e => (t, r, o) => {
    let n = o ? {
      ...o,
      direction: "backward"
    } : {
      direction: "backward"
    };
    return mn(e)(t, r, n);
  };
  var Gd = e => (t, r, o) => mn(e)(t, r, o);
  var Yd = e => async (t, r, o) => {
    let n = o ? {
      ...o,
      direction: "backward"
    } : {
      direction: "backward"
    };
    return fn(e)(t, r, n);
  };
  var Xd = e => async (t, r, o) => fn(e)(t, r, o);
  var Qd = /^[cC][0-9a-z]{6,}$/,
    ep = /^[0-9a-z]+$/,
    tp = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/,
    rp = /^[0-9a-vA-V]{20}$/,
    op = /^[A-Za-z0-9]{27}$/,
    np = /^[a-zA-Z0-9_-]{21}$/;
  function sp(e) {
    return new RegExp(`^[a-zA-Z0-9_-]{${e}}$`);
  }
  var ip = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
  var ap = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
    Gc = e => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  var cp = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
  var v_ = "^[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
  function up() {
    return new RegExp(v_, "u");
  }
  var lp = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    dp = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
  var pp = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,
    hp = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
    mp = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,
    Yc = /^[A-Za-z0-9_-]*$/;
  var fp = /^https?$/,
    gp = /^\+[1-9]\d{6,14}$/;
  var Sp = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
  function R_(e) {
    return new RegExp(`^${e}$`);
  }
  var _p = R_(Sp);
  function Kc(e) {
    let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
    return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : e.seconds ? `${t}:[0-5]\\d(?:\\.\\d+)?` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  }
  function zp(e) {
    return new RegExp(`^${Kc(e)}$`);
  }
  function yp(e) {
    let t = ["Z"];
    e.offset && t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
    let r = `${Kc({
        precision: e.precision,
        seconds: !0
      })}(?:${t.join("|")})`,
      o = e.local ? `${r}|${Kc({
        precision: e.precision
      })}` : r;
    return new RegExp(`^${Sp}T(?:${o})$`);
  }
  var bp = e => {
      let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
      return new RegExp(`^${t}$`);
    },
    vp = /^-?\d+n?$/,
    Ys = /^-?\d+$/,
    gn = /^-?\d+(?:\.\d+)?$/,
    Rp = /^(?:true|false)$/i,
    wp = /^null$/i;
  var xp = /^[^A-Z]*$/,
    Pp = /^[^a-z]*$/;
  var Re = z("$ZodCheck", (e, t) => {
    var r;
    e._zod ?? (e._zod = {});
    e._zod.def = t;
    (r = e._zod).onattach ?? (r.onattach = []);
  });
  var Xc = e => {
      let t = e.value;
      return !Tc(t) && t.length !== void 0;
    },
    Xs = {
      number: "number",
      bigint: "bigint",
      object: "date"
    },
    Qc = z("$ZodCheckLessThan", (e, t) => {
      Re.init(e, t);
      let r = Xs[typeof t.value];
      e._zod.onattach.push(o => {
        let n = o._zod.bag,
          s = (t.inclusive ? n.maximum : n.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
        t.value < s && (t.inclusive ? n.maximum = t.value : n.exclusiveMaximum = t.value);
      });
      e._zod.check = o => {
        (t.inclusive ? o.value <= t.value : o.value < t.value) || o.issues.push({
          origin: Xs[typeof o.value] ?? r,
          code: "too_big",
          maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
          input: o.value,
          inclusive: t.inclusive,
          inst: e,
          continue: !t.abort
        });
      };
    }),
    eu = z("$ZodCheckGreaterThan", (e, t) => {
      Re.init(e, t);
      let r = Xs[typeof t.value];
      e._zod.onattach.push(o => {
        let n = o._zod.bag,
          s = (t.inclusive ? n.minimum : n.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
        t.value > s && (t.inclusive ? n.minimum = t.value : n.exclusiveMinimum = t.value);
      });
      e._zod.check = o => {
        (t.inclusive ? o.value >= t.value : o.value > t.value) || o.issues.push({
          origin: Xs[typeof o.value] ?? r,
          code: "too_small",
          minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
          input: o.value,
          inclusive: t.inclusive,
          inst: e,
          continue: !t.abort
        });
      };
    }),
    $p = z("$ZodCheckMultipleOf", (e, t) => {
      Re.init(e, t);
      e._zod.onattach.push(r => {
        var o;
        (o = r._zod.bag).multipleOf ?? (o.multipleOf = t.value);
      });
      e._zod.check = r => {
        if (typeof r.value != typeof t.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
        (typeof r.value == "bigint" ? t.value !== BigInt(0) && r.value % t.value === BigInt(0) : Ec(r.value, t.value) === 0) || r.issues.push({
          origin: typeof r.value,
          code: "not_multiple_of",
          divisor: t.value,
          input: r.value,
          inst: e,
          continue: !t.abort
        });
      };
    }),
    Tp = z("$ZodCheckNumberFormat", (e, t) => {
      Re.init(e, t);
      t.format = t.format || "float64";
      let r = t.format?.includes("int"),
        o = r ? "int" : "number",
        [n, s] = Mc[t.format];
      e._zod.onattach.push(i => {
        let a = i._zod.bag;
        a.format = t.format;
        a.minimum = n;
        a.maximum = s;
        r && (a.pattern = Ys);
      });
      e._zod.check = i => {
        let a = i.value;
        if (r) {
          if (!Number.isInteger(a)) {
            i.issues.push({
              expected: o,
              format: t.format,
              code: "invalid_type",
              continue: !1,
              input: a,
              inst: e
            });
            return;
          }
          if (!Number.isSafeInteger(a)) {
            a > 0 ? i.issues.push({
              input: a,
              code: "too_big",
              maximum: Number.MAX_SAFE_INTEGER,
              note: "Integers must be within the safe integer range.",
              inst: e,
              origin: o,
              inclusive: !0,
              continue: !t.abort
            }) : i.issues.push({
              input: a,
              code: "too_small",
              minimum: Number.MIN_SAFE_INTEGER,
              note: "Integers must be within the safe integer range.",
              inst: e,
              origin: o,
              inclusive: !0,
              continue: !t.abort
            });
            return;
          }
        }
        a < n && i.issues.push({
          origin: "number",
          input: a,
          code: "too_small",
          minimum: n,
          inclusive: !0,
          inst: e,
          continue: !t.abort
        });
        a > s && i.issues.push({
          origin: "number",
          input: a,
          code: "too_big",
          maximum: s,
          inclusive: !0,
          inst: e,
          continue: !t.abort
        });
      };
    });
  var Ep = z("$ZodCheckMaxLength", (e, t) => {
      var r;
      Re.init(e, t);
      (r = e._zod.def).when ?? (r.when = Xc);
      e._zod.onattach.push(o => {
        let n = o._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
        t.maximum < n && (o._zod.bag.maximum = t.maximum);
      });
      e._zod.check = o => {
        let n = o.value,
          s = n.length;
        if ((typeof n == "string" && s > t.maximum ? pn(n) : s) <= t.maximum) return;
        let a = hn(n);
        o.issues.push({
          origin: a,
          code: "too_big",
          maximum: t.maximum,
          inclusive: !0,
          input: n,
          inst: e,
          continue: !t.abort
        });
      };
    }),
    kp = z("$ZodCheckMinLength", (e, t) => {
      var r;
      Re.init(e, t);
      (r = e._zod.def).when ?? (r.when = Xc);
      e._zod.onattach.push(o => {
        let n = o._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
        t.minimum > n && (o._zod.bag.minimum = t.minimum);
      });
      e._zod.check = o => {
        let n = o.value,
          s = n.length;
        if ((typeof n == "string" && s >= t.minimum && s < t.minimum * 2 ? pn(n) : s) >= t.minimum) return;
        let a = hn(n);
        o.issues.push({
          origin: a,
          code: "too_small",
          minimum: t.minimum,
          inclusive: !0,
          input: n,
          inst: e,
          continue: !t.abort
        });
      };
    }),
    Cp = z("$ZodCheckLengthEquals", (e, t) => {
      var r;
      Re.init(e, t);
      (r = e._zod.def).when ?? (r.when = Xc);
      e._zod.onattach.push(o => {
        let n = o._zod.bag;
        n.minimum = t.length;
        n.maximum = t.length;
        n.length = t.length;
      });
      e._zod.check = o => {
        let n = o.value,
          s = n.length,
          i = typeof n == "string" && s >= t.length && s <= t.length * 2 ? pn(n) : s;
        if (i === t.length) return;
        let a = hn(n),
          u = i > t.length;
        o.issues.push({
          origin: a,
          ...(u ? {
            code: "too_big",
            maximum: t.length
          } : {
            code: "too_small",
            minimum: t.length
          }),
          inclusive: !0,
          exact: !0,
          input: o.value,
          inst: e,
          continue: !t.abort
        });
      };
    }),
    Sn = z("$ZodCheckStringFormat", (e, t) => {
      var r, o;
      Re.init(e, t);
      e._zod.onattach.push(n => {
        let s = n._zod.bag;
        s.format = t.format;
        t.pattern && (s.patterns ?? (s.patterns = new Set()), s.patterns.add(t.pattern));
      });
      t.pattern ? (r = e._zod).check ?? (r.check = n => {
        t.pattern.lastIndex = 0;
        !t.pattern.test(n.value) && n.issues.push({
          origin: "string",
          code: "invalid_format",
          format: t.format,
          input: n.value,
          ...(t.pattern ? {
            pattern: t.pattern.toString()
          } : {}),
          inst: e,
          continue: !t.abort
        });
      }) : (o = e._zod).check ?? (o.check = () => {});
    }),
    Ip = z("$ZodCheckRegex", (e, t) => {
      Sn.init(e, t);
      e._zod.check = r => {
        t.pattern.lastIndex = 0;
        !t.pattern.test(r.value) && r.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "regex",
          input: r.value,
          pattern: t.pattern.toString(),
          inst: e,
          continue: !t.abort
        });
      };
    }),
    Op = z("$ZodCheckLowerCase", (e, t) => {
      t.pattern ?? (t.pattern = xp);
      Sn.init(e, t);
    }),
    Np = z("$ZodCheckUpperCase", (e, t) => {
      t.pattern ?? (t.pattern = Pp);
      Sn.init(e, t);
    }),
    Ap = z("$ZodCheckIncludes", (e, t) => {
      Re.init(e, t);
      let r = bt(t.includes),
        o = new RegExp(typeof t.position == "number" ? `^.{${t.position},}${r}` : r);
      t.pattern = o;
      e._zod.onattach.push(n => {
        let s = n._zod.bag;
        s.patterns ?? (s.patterns = new Set());
        s.patterns.add(o);
      });
      e._zod.check = n => {
        n.value.includes(t.includes, t.position) || n.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "includes",
          includes: t.includes,
          input: n.value,
          inst: e,
          continue: !t.abort
        });
      };
    }),
    Mp = z("$ZodCheckStartsWith", (e, t) => {
      Re.init(e, t);
      let r = new RegExp(`^${bt(t.prefix)}.*`);
      t.pattern ?? (t.pattern = r);
      e._zod.onattach.push(o => {
        let n = o._zod.bag;
        n.patterns ?? (n.patterns = new Set());
        n.patterns.add(r);
      });
      e._zod.check = o => {
        o.value.startsWith(t.prefix) || o.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "starts_with",
          prefix: t.prefix,
          input: o.value,
          inst: e,
          continue: !t.abort
        });
      };
    }),
    qp = z("$ZodCheckEndsWith", (e, t) => {
      Re.init(e, t);
      let r = new RegExp(`.*${bt(t.suffix)}$`);
      t.pattern ?? (t.pattern = r);
      e._zod.onattach.push(o => {
        let n = o._zod.bag;
        n.patterns ?? (n.patterns = new Set());
        n.patterns.add(r);
      });
      e._zod.check = o => {
        o.value.endsWith(t.suffix) || o.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "ends_with",
          suffix: t.suffix,
          input: o.value,
          inst: e,
          continue: !t.abort
        });
      };
    });
  var jp = z("$ZodCheckOverwrite", (e, t) => {
    Re.init(e, t);
    e._zod.check = r => {
      r.value = t.tx(r.value);
    };
  });
  var Qs = class {
    constructor(t = [], r = {}) {
      this.content = [];
      this.indent = 0;
      this.args = t;
      this.closed = r;
    }
    indented(t) {
      this.indent += 1;
      t(this);
      this.indent -= 1;
    }
    write(t) {
      if (typeof t == "function") {
        t(this, {
          execution: "sync"
        });
        t(this, {
          execution: "async"
        });
        return;
      }
      let o = t.split(`
`).filter(i => i),
        n = Math.min(...o.map(i => i.length - i.trimStart().length)),
        s = o.map(i => i.slice(n)).map(i => " ".repeat(this.indent * 2) + i);
      for (let i of s) this.content.push(i);
    }
    compile() {
      let t = Function,
        r = this?.content ?? [""];
      return new t(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {
${r.join(`
`)}
};`)(...Object.values(this.closed));
    }
  };
  var Up = {
    major: 4,
    minor: 5,
    patch: 4
  };
  var oe = z("$ZodType", (e, t) => {
      var r;
      e ?? (e = {});
      e._zod.def = t;
      e._zod.bag = e._zod.bag || {};
      e._zod.version = Up;
      let o = e._zod.def.checks,
        n = e._zod.traits.has("$ZodCheck") ? [e, ...(o ?? [])] : o?.length ? [...o] : [];
      for (let s of n) for (let i of s._zod.onattach) i(e);
      if (n.length === 0) {
        (r = e._zod).deferred ?? (r.deferred = []);
        e._zod.deferred?.push(() => {
          e._zod.run = e._zod.parse;
        });
      } else {
        let s = (a, u, l) => {
            if (a.memo) return a;
            let d = Zt(a),
              p;
            for (let h of u) {
              if (h._zod.def.when) {
                if (qc(a) || !h._zod.def.when(a)) continue;
              } else if (d) continue;
              let f = a.issues.length,
                g = h._zod.check(a);
              if (g instanceof Promise && l?.async === !1) throw new gt();
              if (p || g instanceof Promise) p = (p ?? Promise.resolve()).then(async () => {
                await g;
                a.issues.length !== f && (Js(a.issues, f, e), d || (d = Zt(a, f)));
              });else {
                if (a.issues.length === f) continue;
                Js(a.issues, f, e);
                d || (d = Zt(a, f));
              }
            }
            return p ? p.then(() => a) : a;
          },
          i = (a, u, l) => {
            if (Zt(a)) return a.aborted = !0, a;
            let d = s(u, n, l);
            if (d instanceof Promise) {
              if (l.async === !1) throw new gt();
              return d.then(p => e._zod.parse(p, l));
            }
            return e._zod.parse(d, l);
          };
        e._zod.run = (a, u) => {
          if (u.skipChecks) return e._zod.parse(a, u);
          if (u.direction === "backward") {
            let d = e._zod.parse({
              value: a.value,
              issues: []
            }, {
              ...u,
              skipChecks: !0
            });
            return d instanceof Promise ? d.then(p => i(p, a, u)) : i(d, a, u);
          }
          let l = e._zod.parse(a, u);
          if (l instanceof Promise) {
            if (u.async === !1) throw new gt();
            return l.then(d => s(d, n, u));
          }
          return s(l, n, u);
        };
      }
    }, {
      get "~standard"() {
        return Uc(this, "~standard", ou(this));
      },
      set "~standard"(e) {
        Zr(this, "~standard", e);
      }
    }),
    Zp = e => e.success ? {
      value: e.data
    } : {
      issues: e.error?.issues
    };
  function ou(e) {
    return {
      validate: t => {
        try {
          return Zp(Fd(e, t));
        } catch {
          return Vd(e, t).then(Zp);
        }
      },
      vendor: "zod",
      version: 1
    };
  }
  var ri = z("$ZodString", (e, t) => {
      oe.init(e, t);
      e._zod.pattern = [...(e?._zod.bag?.patterns ?? [])].pop() ?? bp(e._zod.bag);
      e._zod.parse = (r, o) => {
        if (t.coerce) try {
          r.value = String(r.value);
        } catch {}
        return typeof r.value == "string" || r.issues.push({
          expected: "string",
          code: "invalid_type",
          input: r.value,
          inst: e
        }), r;
      };
    }),
    ae = z("$ZodStringFormat", (e, t) => {
      Sn.init(e, t);
      ri.init(e, t);
    }),
    Yp = z("$ZodGUID", (e, t) => {
      t.pattern ?? (t.pattern = ap);
      ae.init(e, t);
    }),
    Xp = z("$ZodUUID", (e, t) => {
      if (t.version) {
        let o = {
          v1: 1,
          v2: 2,
          v3: 3,
          v4: 4,
          v5: 5,
          v6: 6,
          v7: 7,
          v8: 8
        }[t.version];
        if (o === void 0) throw new Error(`Invalid UUID version: "${t.version}"`);
        t.pattern ?? (t.pattern = Gc(o));
      } else t.pattern ?? (t.pattern = Gc());
      ae.init(e, t);
    }),
    Qp = z("$ZodEmail", (e, t) => {
      t.pattern ?? (t.pattern = cp);
      ae.init(e, t);
    }),
    eh = 1,
    th = 2;
  function w_(e, t) {
    if (!t.normalize && t.protocol?.source === fp.source && !/^https?:\/\//i.test(e)) return eh;
    try {
      return new URL(e);
    } catch {
      return th;
    }
  }
  var x_ = /[\t\n\r]/g;
  function P_(e) {
    return e.replace(x_, "");
  }
  function $_(e, t) {
    return t.lastIndex = 0, t.test(e.hostname);
  }
  function T_(e, t) {
    return t.lastIndex = 0, t.test(e.protocol.endsWith(":") ? e.protocol.slice(0, -1) : e.protocol);
  }
  var rh = z("$ZodURL", (e, t) => {
      ae.init(e, t);
      e._zod.check = r => {
        try {
          let o = r.value.trim(),
            n = w_(o, t);
          if (n === eh) {
            r.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid URL format",
              input: r.value,
              inst: e,
              continue: !t.abort
            });
            return;
          }
          if (n === th) {
            r.issues.push({
              code: "invalid_format",
              format: "url",
              input: r.value,
              inst: e,
              continue: !t.abort
            });
            return;
          }
          t.hostname && !$_(n, t.hostname) && r.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: t.hostname.source,
            input: r.value,
            inst: e,
            continue: !t.abort
          });
          t.protocol && !T_(n, t.protocol) && r.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: t.protocol.source,
            input: r.value,
            inst: e,
            continue: !t.abort
          });
          r.value = t.normalize ? n.href : P_(o);
          return;
        } catch {
          r.issues.push({
            code: "invalid_format",
            format: "url",
            input: r.value,
            inst: e,
            continue: !t.abort
          });
        }
      };
    }),
    oh = z("$ZodEmoji", (e, t) => {
      t.pattern ?? (t.pattern = up());
      ae.init(e, t);
    }),
    nh = z("$ZodNanoID", (e, t) => {
      if (t.length !== void 0 && (!Number.isInteger(t.length) || t.length < 1)) throw new Error(`Invalid nanoid length: ${t.length}`);
      t.pattern ?? (t.pattern = t.length === void 0 ? np : sp(t.length));
      ae.init(e, t);
    }),
    sh = z("$ZodCUID", (e, t) => {
      t.pattern ?? (t.pattern = Qd);
      ae.init(e, t);
    }),
    ih = z("$ZodCUID2", (e, t) => {
      t.pattern ?? (t.pattern = ep);
      ae.init(e, t);
    }),
    ah = z("$ZodULID", (e, t) => {
      t.pattern ?? (t.pattern = tp);
      ae.init(e, t);
    }),
    ch = z("$ZodXID", (e, t) => {
      t.pattern ?? (t.pattern = rp);
      ae.init(e, t);
    }),
    uh = z("$ZodKSUID", (e, t) => {
      t.pattern ?? (t.pattern = op);
      ae.init(e, t);
    }),
    lh = z("$ZodISODateTime", (e, t) => {
      t.pattern ?? (t.pattern = yp(t));
      ae.init(e, t);
      (t.local || t.precision === -1) && (e._zod.bag.laxFormat = !0, e._zod.onattach.push(r => {
        r._zod.bag.laxFormat = !0;
      }));
    }),
    dh = z("$ZodISODate", (e, t) => {
      t.pattern ?? (t.pattern = _p);
      ae.init(e, t);
    }),
    ph = z("$ZodISOTime", (e, t) => {
      t.pattern ?? (t.pattern = zp(t));
      ae.init(e, t);
    }),
    hh = z("$ZodISODuration", (e, t) => {
      t.pattern ?? (t.pattern = ip);
      ae.init(e, t);
    }),
    mh = z("$ZodIPv4", (e, t) => {
      t.pattern ?? (t.pattern = lp);
      ae.init(e, t);
      e._zod.bag.format = "ipv4";
    }),
    E_ = /^[0-9a-fA-F:.]+$/;
  function fh(e) {
    if (!E_.test(e)) return !1;
    try {
      return new URL(`http://[${e}]`), !0;
    } catch {
      return !1;
    }
  }
  var gh = z("$ZodIPv6", (e, t) => {
    t.pattern ?? (t.pattern = dp);
    ae.init(e, t);
    e._zod.bag.format = "ipv6";
    e._zod.check = r => {
      fh(r.value) || r.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: r.value,
        inst: e,
        continue: !t.abort
      });
    };
  });
  var Sh = z("$ZodCIDRv4", (e, t) => {
    t.pattern ?? (t.pattern = pp);
    ae.init(e, t);
  });
  function k_(e) {
    let t = e.split("/");
    if (t.length !== 2) return !1;
    let [r, o] = t;
    if (!o) return !1;
    let n = Number(o);
    return `${n}` !== o || n < 0 || n > 128 ? !1 : fh(r);
  }
  var _h = z("$ZodCIDRv6", (e, t) => {
    t.pattern ?? (t.pattern = hp);
    ae.init(e, t);
    e._zod.check = r => {
      k_(r.value) || r.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: r.value,
        inst: e,
        continue: !t.abort
      });
    };
  });
  function zh(e) {
    if (e === "") return !0;
    if (/\s/.test(e) || e.length % 4 !== 0) return !1;
    try {
      return atob(e), !0;
    } catch {
      return !1;
    }
  }
  var yh = z("$ZodBase64", (e, t) => {
    t.pattern ?? (t.pattern = mp);
    ae.init(e, t);
    e._zod.bag.contentEncoding = "base64";
    e._zod.check = r => {
      zh(r.value) || r.issues.push({
        code: "invalid_format",
        format: "base64",
        input: r.value,
        inst: e,
        continue: !t.abort
      });
    };
  });
  function C_(e) {
    if (!Yc.test(e)) return !1;
    let t = e.replace(/[-_]/g, o => o === "-" ? "+" : "/"),
      r = t.padEnd(Math.ceil(t.length / 4) * 4, "=");
    return zh(r);
  }
  var bh = z("$ZodBase64URL", (e, t) => {
      t.pattern ?? (t.pattern = Yc);
      ae.init(e, t);
      e._zod.bag.contentEncoding = "base64url";
      e._zod.check = r => {
        C_(r.value) || r.issues.push({
          code: "invalid_format",
          format: "base64url",
          input: r.value,
          inst: e,
          continue: !t.abort
        });
      };
    }),
    vh = z("$ZodE164", (e, t) => {
      t.pattern ?? (t.pattern = gp);
      ae.init(e, t);
    });
  function I_(e, t = null) {
    try {
      let r = e.split(".");
      if (r.length !== 3) return !1;
      let [o] = r;
      if (!o) return !1;
      let n = JSON.parse(atob(o));
      return !("typ" in n && n?.typ !== "JWT" || !n.alg || t && (!("alg" in n) || n.alg !== t));
    } catch {
      return !1;
    }
  }
  var Rh = z("$ZodJWT", (e, t) => {
    ae.init(e, t);
    e._zod.check = r => {
      I_(r.value, t.alg) || r.issues.push({
        code: "invalid_format",
        format: "jwt",
        input: r.value,
        inst: e,
        continue: !t.abort
      });
    };
  });
  var nu = z("$ZodNumber", (e, t) => {
      oe.init(e, t);
      e._zod.pattern = e._zod.bag.pattern ?? gn;
      e._zod.parse = (r, o) => {
        if (t.coerce) try {
          r.value = Number(r.value);
        } catch {}
        let n = r.value;
        if (typeof n == "number" && !Number.isNaN(n) && Number.isFinite(n)) return r;
        let s = typeof n == "number" ? Number.isNaN(n) ? "NaN" : Number.isFinite(n) ? void 0 : String(n) : void 0;
        return r.issues.push({
          expected: "number",
          code: "invalid_type",
          input: n,
          inst: e,
          ...(s ? {
            received: s
          } : {})
        }), r;
      };
    }),
    wh = z("$ZodNumberFormat", (e, t) => {
      Tp.init(e, t);
      nu.init(e, t);
    }),
    xh = z("$ZodBoolean", (e, t) => {
      oe.init(e, t);
      e._zod.pattern = Rp;
      e._zod.parse = (r, o) => {
        if (t.coerce) try {
          r.value = !!r.value;
        } catch {}
        let n = r.value;
        return typeof n == "boolean" || r.issues.push({
          expected: "boolean",
          code: "invalid_type",
          input: n,
          inst: e
        }), r;
      };
    }),
    Ph = z("$ZodBigInt", (e, t) => {
      oe.init(e, t);
      e._zod.pattern = vp;
      e._zod.parse = (r, o) => {
        if (t.coerce) try {
          r.value = BigInt(r.value);
        } catch {}
        return typeof r.value == "bigint" || r.issues.push({
          expected: "bigint",
          code: "invalid_type",
          input: r.value,
          inst: e
        }), r;
      };
    });
  var $h = z("$ZodNull", (e, t) => {
      oe.init(e, t);
      e._zod.pattern = wp;
      e._zod.values = new Set([null]);
      e._zod.parse = (r, o) => {
        let n = r.value;
        return n === null || r.issues.push({
          expected: "null",
          code: "invalid_type",
          input: n,
          inst: e
        }), r;
      };
    }),
    Th = z("$ZodAny", (e, t) => {
      oe.init(e, t);
      e._zod.parse = r => r;
    }),
    Eh = z("$ZodUnknown", (e, t) => {
      oe.init(e, t);
      e._zod.parse = r => r;
    }),
    kh = z("$ZodNever", (e, t) => {
      oe.init(e, t);
      e._zod.parse = (r, o) => (r.issues.push({
        expected: "never",
        code: "invalid_type",
        input: r.value,
        inst: e
      }), r);
    });
  var Ch = z("$ZodDate", (e, t) => {
    oe.init(e, t);
    e._zod.parse = (r, o) => {
      if (t.coerce) try {
        r.value = new Date(r.value);
      } catch {}
      let n = r.value,
        s = n instanceof Date;
      return s && !Number.isNaN(n.getTime()) || r.issues.push({
        expected: "date",
        code: "invalid_type",
        input: n,
        ...(s ? {
          received: "Invalid Date"
        } : {}),
        inst: e
      }), r;
    };
  });
  function Dp(e, t, r) {
    e.issues.length && t.issues.push(...vt(r, e.issues));
    t.value[r] = e.value;
  }
  var Ih = z("$ZodArray", (e, t) => {
    oe.init(e, t);
    let r = Le.memoizer;
    r?.attach(e);
    e._zod.parse = (o, n) => {
      let s = o.value;
      if (!Array.isArray(s)) return o.issues.push({
        expected: "array",
        code: "invalid_type",
        input: s,
        inst: e
      }), o;
      o.value = r ? r.alloc(e, o, Array(s.length), n) : Array(s.length);
      let i = [];
      for (let a = 0; a < s.length; a++) {
        let u = s[a],
          l = t.element._zod.run({
            value: u,
            issues: []
          }, n);
        l instanceof Promise ? i.push(l.then(d => Dp(d, o, a))) : Dp(l, o, a);
      }
      return i.length ? Promise.all(i).then(() => o) : o;
    };
  });
  function ti(e, t, r, o, n, s) {
    let i = r in o,
      a = s === "optional";
    if (!(!i && a && n === "optional")) {
      if (e.issues.length) {
        if (n !== void 0 && a && !i) return;
        t.issues.push(...vt(r, e.issues));
      }
      if (!i && n === void 0) {
        e.issues.length || t.issues.push({
          code: "invalid_type",
          expected: "nonoptional",
          input: void 0,
          path: [r]
        });
        return;
      }
      e.value === void 0 ? i && (t.value[r] = void 0) : t.value[r] = e.value;
    }
  }
  var O_ = [];
  function Oh(e) {
    let t = Object.keys(e.shape),
      r = Object.getOwnPropertySymbols(e.shape),
      o = r.length ? r : O_,
      n = o.length ? [...t, ...o] : t;
    for (let i of n) if (!e.shape?.[i]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(i)}": expected a Zod schema`);
    let s = Ac(e.shape);
    return {
      ...e,
      allKeys: n,
      symbolKeys: o,
      keySet: new Set(t),
      numKeys: t.length,
      optionalKeys: new Set(s)
    };
  }
  function Nh(e, t, r, o, n, s) {
    let i = [],
      a = n.keySet,
      u = n.catchall._zod,
      l = u.def.type,
      d = u.optin,
      p = u.optout;
    for (let h in t) {
      if (a.has(h)) continue;
      if (h === "__proto__") {
        l === "never" && i.push(h);
        continue;
      }
      if (l === "never") {
        i.push(h);
        continue;
      }
      let f = u.run({
        value: t[h],
        issues: []
      }, o);
      f instanceof Promise ? e.push(f.then(g => ti(g, r, h, t, d, p))) : ti(f, r, h, t, d, p);
    }
    return i.length && r.issues.push({
      code: "unrecognized_keys",
      keys: i,
      input: t,
      inst: s,
      continue: !0
    }), e.length ? Promise.all(e).then(() => r) : r;
  }
  var tu = new WeakMap(),
    N_ = z("$ZodObject", (e, t) => {
      if (oe.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
        let u = t.shape;
        tu.set(t, u);
        Object.defineProperty(t, "shape", {
          get: () => {
            let l = {
              ...u
            };
            return Object.defineProperty(t, "shape", {
              value: l
            }), tu.set(t, l), l;
          }
        });
      }
      let o = Fr(() => Oh(t));
      Q(e, "propValues", u => {
        let l = u.def.shape,
          d = {};
        for (let p in l) {
          let h = l[p]._zod;
          if (h.values) {
            Object.prototype.hasOwnProperty.call(d, p) || ge(d, p, new Set());
            for (let f of h.values) d[p].add(f);
            h.optin !== void 0 && d[p].add(void 0);
          }
        }
        return d;
      });
      let n = ur,
        s = t.catchall,
        i,
        a = Le.memoizer;
      a?.attach(e);
      e._zod.parse = (u, l) => {
        i ?? (i = o.value);
        let d = u.value;
        if (!n(d)) return u.issues.push({
          expected: "object",
          code: "invalid_type",
          input: d,
          inst: e
        }), u;
        u.value = a ? a.alloc(e, u, {}, l) : {};
        let p = [],
          h = i.shape;
        for (let f of i.allKeys) {
          if (f === "__proto__") continue;
          let g = h[f],
            y = g._zod.optin,
            b = g._zod.optout,
            T = g._zod.run({
              value: d[f],
              issues: []
            }, l);
          T instanceof Promise ? p.push(T.then(L => ti(L, u, f, d, y, b))) : ti(T, u, f, d, y, b);
        }
        return s ? Nh(p, d, u, l, o.value, e) : p.length ? Promise.all(p).then(() => u) : u;
      };
    }),
    Ah = z("$ZodObjectJIT", (e, t) => {
      N_.init(e, t);
      let r = e._zod.parse,
        o = Fr(() => Oh(t)),
        n = Le.memoizer,
        s = f => {
          let g = o.value,
            y = g.symbolKeys,
            b = new Qs(["payload", "ctx"], {
              shape: f,
              inst: e,
              memo: n,
              syms: y
            }),
            T = x => `shape[${x}]._zod.run({ value: input[${x}], issues: [] }, ctx)`,
            L = (x, v) => `
          for (let i = 0; i < ${x}.issues.length; i++) {
            const iss = ${x}.issues[i];
            iss.path = iss.path ? [${v}, ...iss.path] : [${v}];
            payload.issues.push(iss);
          }`;
          b.write("const input = payload.value;");
          let U = Object.create(null),
            te = 0;
          for (let x of g.allKeys) U[x] = `key_${te++}`;
          b.write(n ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};");
          for (let x of g.allKeys) {
            if (x === "__proto__") continue;
            let v = U[x],
              C = typeof x == "symbol" ? `syms[${y.indexOf(x)}]` : Cc(x),
              ee = `${C} in input`,
              K = f[x],
              ie = K?._zod?.optin,
              Y = ie !== void 0,
              _e = K?._zod?.optout === "optional";
            if (b.write(`const ${v} = ${T(C)};`), Y && _e) {
              let Ge = ie === "optional" ? `${v}_present` : `${v}.value !== undefined || ${v}_present`;
              b.write(`
        const ${v}_present = ${ee};
        if (!${v}.issues.length || ${v}_present) {
          if (${v}.issues.length) {${L(v, C)}
          }

          if (${Ge}) {
            newResult[${C}] = ${v}.value;
          }
        }

      `);
            } else Y ? b.write(`
        if (${v}.issues.length) {${L(v, C)}
        }
        
        if (${v}.value === undefined) {
          if (${ee}) {
            newResult[${C}] = undefined;
          }
        } else {
          newResult[${C}] = ${v}.value;
        }

      `) : b.write(`
        const ${v}_present = ${ee};
        if (${v}.issues.length) {${L(v, C)}
        }
        if (!${v}_present && !${v}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${C}]
          });
        }

        if (${v}_present) {
          newResult[${C}] = ${v}.value;
        }

      `);
          }
          return b.write("payload.value = newResult;"), b.write("return payload;"), b.compile();
        },
        i,
        a = ur,
        u = !Le.jitless,
        d = u && Oc.value,
        p = t.catchall,
        h;
      e._zod.parse = (f, g) => {
        h ?? (h = o.value);
        let y = f.value;
        return a(y) ? u && d && g?.async === !1 && g.jitless !== !0 ? (i || (i = s(t.shape)), f = i(f, g), p ? Nh([], y, f, g, h, e) : f) : r(f, g) : (f.issues.push({
          expected: "object",
          code: "invalid_type",
          input: y,
          inst: e
        }), f);
      };
    });
  function Fp(e, t, r, o) {
    for (let s of e) if (s.issues.length === 0) return t.value = s.value, t;
    let n = e.filter(s => !Zt(s));
    return n.length === 1 ? (t.value = n[0].value, n[0]) : (t.issues.push({
      code: "invalid_union",
      input: t.value,
      inst: r,
      errors: e.map(s => s.issues.map(i => nt(i, o, Ue())))
    }), t);
  }
  var su = z("$ZodUnion", (e, t) => {
    oe.init(e, t);
    Q(e, "optin", o => o.def.options.some(n => n._zod.optin === "defaulted") ? "defaulted" : o.def.options.some(n => n._zod.optin !== void 0) ? "optional" : void 0);
    Q(e, "optout", o => o.def.options.some(n => n._zod.optout === "optional") ? "optional" : void 0);
    Q(e, "values", o => {
      if (o.def.options.every(n => n._zod.values)) return new Set(o.def.options.flatMap(n => Array.from(n._zod.values)));
    });
    Q(e, "pattern", o => {
      if (o.def.options.every(n => n._zod.pattern)) {
        let n = o.def.options.map(s => s._zod.pattern);
        return new RegExp(`^(${n.map(s => dn(s.source)).join("|")})$`);
      }
    });
    let r = t.options.length === 1 ? t.options[0]._zod.run : null;
    e._zod.parse = (o, n) => {
      if (r) return r(o, n);
      let s = !1,
        i = [];
      for (let a of t.options) {
        let u = a._zod.run({
          value: o.value,
          issues: []
        }, n);
        if (u instanceof Promise) {
          i.push(u);
          s = !0;
        } else {
          if (u.issues.length === 0) return u;
          i.push(u);
        }
      }
      return s ? Promise.all(i).then(a => Fp(a, o, e, n)) : Fp(i, o, e, n);
    };
  });
  var Mh = z("$ZodDiscriminatedUnion", (e, t) => {
      t.inclusive = !1;
      su.init(e, t);
      let r = e._zod.parse;
      Q(e, "propValues", n => {
        let s = {};
        for (let i of n.def.options) {
          let a = i._zod.propValues;
          if (!a || Object.keys(a).length === 0) throw new Error(`Invalid discriminated union option at index "${n.def.options.indexOf(i)}"`);
          for (let [u, l] of Object.entries(a)) {
            Object.prototype.hasOwnProperty.call(s, u) || ge(s, u, new Set());
            for (let d of l) s[u].add(d);
          }
        }
        return s;
      });
      t.options.forEach((n, s) => {
        let i = tu.get(n._zod.def);
        if (i && !Object.prototype.hasOwnProperty.call(i, t.discriminator)) throw new Error(`Invalid discriminated union option at index "${s}"`);
      });
      let o = Fr(() => {
        let n = t.options,
          s = new Map();
        for (let i of n) {
          let a = i._zod.propValues?.[t.discriminator];
          if (!a || a.size === 0) throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(i)}"`);
          for (let u of a) {
            if (s.has(u)) throw new Error(`Duplicate discriminator value "${String(u)}"`);
            s.set(u, i);
          }
        }
        return s;
      });
      e._zod.parse = (n, s) => {
        let i = n.value;
        if (!ur(i)) return n.issues.push({
          code: "invalid_type",
          expected: "object",
          input: i,
          inst: e
        }), n;
        let a = o.value.get(i?.[t.discriminator]);
        return a ? a._zod.run(n, s) : t.unionFallback || s.direction === "backward" ? r(n, s) : (n.issues.push({
          code: "invalid_union",
          errors: [],
          note: "No matching discriminator",
          discriminator: t.discriminator,
          options: Array.from(o.value.keys()),
          input: i,
          path: [t.discriminator],
          inst: e
        }), n);
      };
    }),
    qh = z("$ZodIntersection", (e, t) => {
      oe.init(e, t);
      e._zod.parse = (r, o) => {
        let n = r.value,
          s = t.left._zod.run({
            value: n,
            issues: []
          }, o),
          i = t.right._zod.run({
            value: n,
            issues: []
          }, o);
        return s instanceof Promise || i instanceof Promise ? Promise.all([s, i]).then(([u, l]) => Vp(r, u, l)) : Vp(r, s, i);
      };
    });
  function ru(e, t) {
    if (e === t) return {
      valid: !0,
      data: e
    };
    if (e instanceof Date && t instanceof Date && +e == +t) return {
      valid: !0,
      data: e
    };
    if (Ut(e) && Ut(t)) {
      let r = Object.keys(t),
        o = Object.keys(e).filter(s => r.indexOf(s) !== -1),
        n = {
          ...e,
          ...t
        };
      Object.prototype.hasOwnProperty.call(n, "__proto__") && delete n.__proto__;
      for (let s of o) {
        if (s === "__proto__") continue;
        let i = ru(e[s], t[s]);
        if (!i.valid) return {
          valid: !1,
          mergeErrorPath: [s, ...i.mergeErrorPath]
        };
        n[s] = i.data;
      }
      return {
        valid: !0,
        data: n
      };
    }
    if (Array.isArray(e) && Array.isArray(t)) {
      if (e.length !== t.length) return {
        valid: !1,
        mergeErrorPath: []
      };
      let r = [];
      for (let o = 0; o < e.length; o++) {
        let n = e[o],
          s = t[o],
          i = ru(n, s);
        if (!i.valid) return {
          valid: !1,
          mergeErrorPath: [o, ...i.mergeErrorPath]
        };
        r.push(i.data);
      }
      return {
        valid: !0,
        data: r
      };
    }
    return {
      valid: !1,
      mergeErrorPath: []
    };
  }
  function Vp(e, t, r) {
    let o = new Map(),
      n,
      s = new Map(),
      i = (l, d) => {
        let p;
        if (l.code === "unrecognized_keys" && !l.path?.length) {
          n ?? (n = l);
          p = l.keys;
        } else if (l.code === "invalid_key" && l.origin === "record" && l.path?.length === 1) {
          let h = String(l.path[0]);
          s.has(h) || s.set(h, l);
          p = [h];
        } else return !1;
        for (let h of p) {
          o.has(h) || o.set(h, {});
          o.get(h)[d] = !0;
        }
        return !0;
      };
    for (let l of t.issues) i(l, "l") || e.issues.push(l);
    for (let l of r.issues) i(l, "r") || e.issues.push(l);
    let a = [...o].filter(([, l]) => l.l && l.r).map(([l]) => l);
    if (a.length) {
      let l = n ? a.filter(d => n.keys.includes(d)) : [];
      l.length && e.issues.push({
        ...n,
        keys: l
      });
      for (let d of a) !l.includes(d) && s.has(d) && e.issues.push(s.get(d));
    }
    let u = ru(t.value, r.value);
    if (!u.valid) {
      if (Zt(e)) return e;
      throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(u.mergeErrorPath)}`);
    }
    return e.value = u.data, e;
  }
  var jh = z("$ZodRecord", (e, t) => {
    oe.init(e, t);
    let r = Le.memoizer;
    r?.attach(e);
    e._zod.parse = (o, n) => {
      let s = o.value;
      if (!Ut(s)) return o.issues.push({
        expected: "record",
        code: "invalid_type",
        input: s,
        inst: e
      }), o;
      let i = [],
        a = t.keyType._zod.values;
      if (a && !t.partial) {
        o.value = r ? r.alloc(e, o, {}, n) : {};
        let u = new Set();
        for (let d of a) if (typeof d == "string" || typeof d == "number" || typeof d == "symbol") {
          if (u.add(typeof d == "number" ? d.toString() : d), d === "__proto__") continue;
          let p = t.keyType._zod.run({
            value: d,
            issues: []
          }, n);
          if (p instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
          if (p.issues.length) {
            o.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: p.issues.map(g => nt(g, n, Ue())),
              input: d,
              path: [d],
              inst: e
            });
            continue;
          }
          let h = p.value;
          if (h === "__proto__") continue;
          let f = t.valueType._zod.run({
            value: s[d],
            issues: []
          }, n);
          f instanceof Promise ? i.push(f.then(g => {
            g.issues.length && o.issues.push(...vt(d, g.issues));
            o.value[h] = g.value;
          })) : (f.issues.length && o.issues.push(...vt(d, f.issues)), o.value[h] = f.value);
        }
        let l;
        for (let d in s) if (!u.has(d)) if (t.mode === "loose") {
          if (d === "__proto__") continue;
          o.value[d] = s[d];
        } else {
          l = l ?? [];
          l.push(d);
        }
        l && l.length > 0 && o.issues.push({
          code: "unrecognized_keys",
          input: s,
          inst: e,
          keys: l,
          continue: !0
        });
      } else {
        o.value = r ? r.alloc(e, o, {}, n) : {};
        let u;
        for (let l of Reflect.ownKeys(s)) {
          if (l === "__proto__" || !Object.prototype.propertyIsEnumerable.call(s, l)) continue;
          let d = t.keyType._zod.run({
            value: l,
            issues: []
          }, n);
          if (d instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
          if (typeof l == "string" && gn.test(l) && d.issues.length) {
            let g = t.keyType._zod.run({
              value: Number(l),
              issues: []
            }, n);
            if (g instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
            g.issues.length === 0 && (d = g);
          }
          if (d.issues.length) {
            t.mode === "loose" ? o.value[l] = s[l] : a ? (u = u ?? [], u.push(l)) : o.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: d.issues.map(g => nt(g, n, Ue())),
              input: l,
              path: [l],
              inst: e
            });
            continue;
          }
          let h = d.value;
          if (h === "__proto__") continue;
          let f = t.valueType._zod.run({
            value: s[l],
            issues: []
          }, n);
          f instanceof Promise ? i.push(f.then(g => {
            g.issues.length && o.issues.push(...vt(l, g.issues));
            o.value[h] = g.value;
          })) : (f.issues.length && o.issues.push(...vt(l, f.issues)), o.value[h] = f.value);
        }
        u && u.length > 0 && o.issues.push({
          code: "unrecognized_keys",
          input: s,
          inst: e,
          keys: u,
          continue: !0
        });
      }
      return i.length ? Promise.all(i).then(() => o) : o;
    };
  });
  var Lh = z("$ZodEnum", (e, t) => {
      oe.init(e, t);
      let r = ln(t.entries),
        o = new Set(r);
      e._zod.values = o;
      let n = r.filter(s => Nc.has(typeof s));
      e._zod.pattern = new RegExp(n.length ? `^(${n.map(s => bt(s.toString())).join("|")})$` : "^[^\\s\\S]$");
      e._zod.parse = (s, i) => {
        let a = s.value;
        return o.has(a) || s.issues.push({
          code: "invalid_value",
          values: r,
          input: a,
          inst: e
        }), s;
      };
    }),
    Uh = z("$ZodLiteral", (e, t) => {
      oe.init(e, t);
      let r = new Set(t.values);
      e._zod.values = r;
      e._zod.pattern = new RegExp(t.values.length ? `^(${t.values.map(o => typeof o == "string" ? bt(o) : o ? bt(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
      e._zod.parse = (o, n) => {
        let s = o.value;
        return r.has(s) || o.issues.push({
          code: "invalid_value",
          values: t.values,
          input: s,
          inst: e
        }), o;
      };
    });
  var Zh = z("$ZodTransform", (e, t) => {
    oe.init(e, t);
    e._zod.optin = "optional";
    Le.memoizer?.guard(e);
    e._zod.parse = (r, o) => {
      if (o.direction === "backward") throw new Hr(e.constructor.name);
      let n = t.transform(r.value, r);
      if (o.async) return (n instanceof Promise ? n : Promise.resolve(n)).then(i => (r.value = i, r));
      if (n instanceof Promise) throw new gt();
      return r.value = n, r;
    };
  });
  function Hp(e, t) {
    return e.value = t.issues.length ? void 0 : t.value, e;
  }
  var iu = z("$ZodOptional", (e, t) => {
      oe.init(e, t);
      Q(e, "optin", r => r.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
      e._zod.optout = "optional";
      Q(e, "values", r => {
        let o = r.def.innerType._zod.values;
        return o ? new Set([...o, void 0]) : void 0;
      });
      Q(e, "pattern", r => {
        let o = r.def.innerType._zod.pattern;
        return o ? new RegExp(`^(${dn(o.source)})?$`) : void 0;
      });
      e._zod.parse = (r, o) => {
        if (r.value === void 0) {
          if (t.innerType._zod.optin !== "defaulted") return r;
          let n = t.innerType._zod.run({
            value: r.value,
            issues: []
          }, o);
          return n instanceof Promise ? n.then(s => Hp(r, s)) : Hp(r, n);
        }
        return t.innerType._zod.run(r, o);
      };
    }),
    Dh = z("$ZodExactOptional", (e, t) => {
      iu.init(e, t);
      Q(e, "values", r => r.def.innerType._zod.values);
      Q(e, "pattern", r => r.def.innerType._zod.pattern);
      e._zod.parse = (r, o) => t.innerType._zod.run(r, o);
    }),
    Fh = z("$ZodNullable", (e, t) => {
      oe.init(e, t);
      Q(e, "optin", r => r.def.innerType._zod.optin);
      Q(e, "optout", r => r.def.innerType._zod.optout);
      Q(e, "pattern", r => {
        let o = r.def.innerType._zod.pattern;
        return o ? new RegExp(`^(${dn(o.source)}|null)$`) : void 0;
      });
      Q(e, "values", r => r.def.innerType._zod.values ? new Set([...r.def.innerType._zod.values, null]) : void 0);
      e._zod.parse = (r, o) => r.value === null ? r : t.innerType._zod.run(r, o);
    }),
    Vh = z("$ZodDefault", (e, t) => {
      oe.init(e, t);
      e._zod.optin = "defaulted";
      Q(e, "values", r => r.def.innerType._zod.values);
      e._zod.parse = (r, o) => {
        if (o.direction === "backward") return t.innerType._zod.run(r, o);
        if (r.value === void 0) return r.value = t.defaultValue, r;
        let n = t.innerType._zod.run(r, o);
        return n instanceof Promise ? n.then(s => Jp(s, t)) : Jp(n, t);
      };
    });
  function Jp(e, t) {
    return e.value === void 0 && (e.value = t.defaultValue), e;
  }
  var Hh = z("$ZodPrefault", (e, t) => {
      oe.init(e, t);
      e._zod.optin = "defaulted";
      Q(e, "values", r => r.def.innerType._zod.values);
      e._zod.parse = (r, o) => (o.direction === "backward" || r.value === void 0 && (r.value = t.defaultValue), t.innerType._zod.run(r, o));
    }),
    Jh = z("$ZodNonOptional", (e, t) => {
      oe.init(e, t);
      Q(e, "values", r => {
        let o = r.def.innerType._zod.values;
        return o ? new Set([...o].filter(n => n !== void 0)) : void 0;
      });
      e._zod.parse = (r, o) => {
        let n = t.innerType._zod.run(r, o);
        return n instanceof Promise ? n.then(s => Bp(s, e)) : Bp(n, e);
      };
    });
  function Bp(e, t) {
    return !e.issues.length && e.value === void 0 && e.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: e.value,
      inst: t
    }), e;
  }
  function Wp(e, t, r, o) {
    return t.issues.length ? (e.value = r.catchValue({
      ...t,
      value: e.value,
      error: {
        issues: t.issues.map(n => nt(n, o, Ue()))
      },
      input: e.value
    }), e) : (e.value = t.value, t.memo && (e.memo = !0), e);
  }
  var Bh = z("$ZodCatch", (e, t) => {
    oe.init(e, t);
    Q(e, "optin", r => r.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
    Q(e, "optout", r => r.def.innerType._zod.optout);
    Q(e, "values", r => r.def.innerType._zod.values);
    e._zod.parse = (r, o) => {
      if (o.direction === "backward") return t.innerType._zod.run(r, o);
      let n = t.innerType._zod.run({
        value: r.value,
        issues: []
      }, o);
      return n instanceof Promise ? n.then(s => Wp(r, s, t, o)) : Wp(r, n, t, o);
    };
  });
  var au = z("$ZodPipe", (e, t) => {
    oe.init(e, t);
    Q(e, "values", r => r.def.in._zod.values);
    Q(e, "optin", r => r.def.in._zod.optin);
    Q(e, "optout", r => r.def.out._zod.optout);
    Q(e, "propValues", r => r.def.in._zod.propValues);
    e._zod.parse = (r, o) => {
      if (o.direction === "backward") {
        let s = t.out._zod.run(r, o);
        return s instanceof Promise ? s.then(i => ei(i, t.in, o)) : ei(s, t.in, o);
      }
      let n = t.in._zod.run(r, o);
      return n instanceof Promise ? n.then(s => ei(s, t.out, o)) : ei(n, t.out, o);
    };
  });
  function ei(e, t, r) {
    return e.issues.some(o => o.code !== "unrecognized_keys") ? (e.aborted = !0, e) : t._zod.run({
      value: e.value,
      issues: e.issues
    }, r);
  }
  var Wh = z("$ZodPreprocess", (e, t) => {
      au.init(e, t);
    }),
    Kh = z("$ZodReadonly", (e, t) => {
      oe.init(e, t);
      Q(e, "propValues", r => r.def.innerType._zod.propValues);
      Q(e, "values", r => r.def.innerType._zod.values);
      Q(e, "optin", r => r.def.innerType?._zod?.optin);
      Q(e, "optout", r => r.def.innerType?._zod?.optout);
      e._zod.parse = (r, o) => {
        if (o.direction === "backward") return t.innerType._zod.run(r, o);
        let n = t.innerType._zod.run(r, o);
        return n instanceof Promise ? n.then(Kp) : Kp(n);
      };
    });
  function Kp(e) {
    return e.memo || (e.value = Object.freeze(e.value)), e;
  }
  var Gh = z("$ZodLazy", (e, t) => {
      oe.init(e, t);
      kc(e._zod, "innerType", () => {
        let r = t;
        return r._cachedInner || (r._cachedInner = t.getter()), r._cachedInner;
      });
      Q(e, "pattern", r => r.innerType?._zod?.pattern);
      Q(e, "propValues", r => r.innerType?._zod?.propValues);
      Q(e, "optin", r => r.innerType?._zod?.optin ?? void 0);
      Q(e, "optout", r => r.innerType?._zod?.optout ?? void 0);
      e._zod.parse = (r, o) => e._zod.innerType._zod.run(r, o);
    }),
    Yh = z("$ZodCustom", (e, t) => {
      Re.init(e, t);
      oe.init(e, t);
      e._zod.parse = (r, o) => r;
      e._zod.check = r => {
        let o = r.value,
          n = t.fn(o);
        if (n instanceof Promise) return n.then(s => Gp(s, r, o, e));
        Gp(n, r, o, e);
      };
    });
  function Gp(e, t, r, o) {
    if (!e) {
      let n = {
        code: "custom",
        input: r,
        inst: o,
        path: [...(o._zod.def.path ?? [])],
        continue: !o._zod.def.abort
      };
      o._zod.def.params && (n.params = o._zod.def.params);
      t.issues.push(Vr(n));
    }
  }
  var uu = class extends Error {
      constructor() {
        super("Cannot parse a reference cycle that closes through a transform");
        this.name = "ZodCyclicError";
      }
    },
    lu = "~memo",
    Xh = [];
  function cu(e) {
    return e.map(t => t.path ? {
      ...t,
      path: t.path.slice()
    } : {
      ...t
    });
  }
  var Qh = new WeakMap();
  function em(e, t) {
    let r = Qh.get(e);
    if (r !== void 0) return r;
    if (t.has(e)) return !0;
    t.add(e);
    let o = !1,
      n = a => {
        !o && a?._zod && em(a, t) && (o = !0);
      },
      s = e._zod.def,
      i = s.type;
    switch (i) {
      case "object":
        {
          for (let a of Reflect.ownKeys(s.shape)) n(s.shape[a]);
          n(s.catchall);
          break;
        }
      case "array":
        n(s.element);
        break;
      case "tuple":
        for (let a of s.items) n(a);
        n(s.rest);
        break;
      case "record":
      case "map":
        n(s.keyType);
        n(s.valueType);
        break;
      case "set":
        n(s.valueType);
        break;
      case "union":
        for (let a of s.options) n(a);
        break;
      case "intersection":
        n(s.left);
        n(s.right);
        break;
      case "optional":
      case "nullable":
      case "default":
      case "prefault":
      case "catch":
      case "readonly":
      case "nonoptional":
      case "promise":
      case "success":
        n(s.innerType);
        break;
      case "pipe":
        n(s.in);
        n(s.out);
        break;
      case "function":
        n(s.input);
        n(s.output);
        break;
      case "lazy":
        n(e._zod.innerType);
        break;
      case "template_literal":
      case "string":
      case "number":
      case "int":
      case "boolean":
      case "bigint":
      case "symbol":
      case "undefined":
      case "null":
      case "void":
      case "never":
      case "any":
      case "unknown":
      case "date":
      case "nan":
      case "enum":
      case "literal":
      case "file":
      case "transform":
      case "custom":
        break;
      default:
        for (let a in s) {
          let u = Object.getOwnPropertyDescriptor(s, a);
          if (!u || u.get) continue;
          let l = u.value;
          if (!(!l || typeof l != "object")) {
            if (l._zod) n(l);else if (Array.isArray(l)) for (let d of l) n(d);
          }
        }
    }
    return t.delete(e), Qh.set(e, o), o;
  }
  function A_(e, t) {
    let r = e.buckets.get(t);
    return r || (r = new Map(), e.buckets.set(t, r)), r;
  }
  var oi,
    ni = [],
    M_ = {
      alloc(e, t, r) {
        let o = oi;
        if (!o) return r;
        oi = void 0;
        let n = {
          value: r,
          issues: null
        };
        return o.set(t.value, n), ni.push(n), r;
      },
      guard(e) {
        var t;
        (t = e._zod).deferred ?? (t.deferred = []);
        e._zod.deferred.push(() => {
          let r = e._zod.parse,
            o = (n, s) => {
              if (s.direction !== "backward" && q_(s, n.value)) throw new uu();
              return r(n, s);
            };
          e._zod.parse = o;
          e._zod.run === r && (e._zod.run = o);
        });
      },
      attach(e) {
        var t;
        let r, o, n;
        (t = e._zod).deferred ?? (t.deferred = []);
        e._zod.deferred.push(() => {
          let s = e._zod.parse,
            i = (a, u) => {
              if (r === void 0 && (r = em(e, new Set()), !r)) return e._zod.parse = s, e._zod.run === i && (e._zod.run = s), s(a, u);
              let l = a.value;
              if (l === null || typeof l != "object") return s(a, u);
              let d = u[lu];
              d || (d = {
                buckets: new Map(),
                backEdges: void 0
              }, u[lu] = d);
              let p;
              o === u ? p = n : (p = A_(d, e), o = u, n = p);
              let h = p.get(l);
              if (h) return a.value = h.value, h.issues ? h.issues.length && a.issues.push(...cu(h.issues)) : (a.memo = !0, d.backEdges ?? (d.backEdges = new Set()), d.backEdges.add(h.value)), a;
              oi = p;
              let f = ni.length,
                g = s(a, u);
              oi = void 0;
              let y = ni.length > f ? ni.pop() : void 0;
              return g instanceof Promise ? g.then(b => (y && (y.issues = b.issues.length ? cu(b.issues) : Xh), b)) : (y && (y.issues = g.issues.length ? cu(g.issues) : Xh), g);
            };
          e._zod.parse = i;
          e._zod.run === s && (e._zod.run = i);
        });
      }
    };
  function du() {
    return M_;
  }
  function q_(e, t) {
    let r = e[lu]?.backEdges;
    return r !== void 0 && t !== null && typeof t == "object" && r.has(t);
  }
  var j_ = () => {
    let e = {
      string: {
        unit: "characters",
        verb: "to have"
      },
      file: {
        unit: "bytes",
        verb: "to have"
      },
      array: {
        unit: "items",
        verb: "to have"
      },
      set: {
        unit: "items",
        verb: "to have"
      },
      map: {
        unit: "entries",
        verb: "to have"
      }
    };
    function t(s) {
      return e[s] ?? null;
    }
    let r = {
        regex: "input",
        email: "email address",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datetime",
        date: "ISO date",
        time: "ISO time",
        duration: "ISO duration",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        mac: "MAC address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded string",
        base64url: "base64url-encoded string",
        json_string: "JSON string",
        e164: "E.164 number",
        credit_card: "credit card number",
        jwt: "JWT",
        template_literal: "input"
      },
      o = {
        nan: "NaN"
      };
    function n(s, i) {
      return s === "number" && typeof i == "number" && !Number.isFinite(i) ? String(i) : o[s] ?? s;
    }
    return s => {
      switch (s.code) {
        case "invalid_type":
          {
            let i = n(s.expected),
              a = jc(s.input),
              u = n(a, s.input);
            return `Invalid input: expected ${i}, received ${u}`;
          }
        case "invalid_value":
          return s.values.length === 1 ? `Invalid input: expected ${Hs(s.values[0])}` : `Invalid option: expected one of ${Fs(s.values, "|")}`;
        case "too_big":
          {
            let i = s.exact ? "exactly " : s.inclusive ? "<=" : "<",
              a = t(s.origin);
            return a ? `Too big: expected ${s.origin ?? "value"} to have ${i}${s.maximum.toString()} ${a.unit ?? "elements"}` : `Too big: expected ${s.origin ?? "value"} to be ${i}${s.maximum.toString()}`;
          }
        case "too_small":
          {
            let i = s.exact ? "exactly " : s.inclusive ? ">=" : ">",
              a = t(s.origin);
            return a ? `Too small: expected ${s.origin} to have ${i}${s.minimum.toString()} ${a.unit}` : `Too small: expected ${s.origin} to be ${i}${s.minimum.toString()}`;
          }
        case "invalid_format":
          {
            let i = s;
            return i.format === "starts_with" ? `Invalid string: must start with "${i.prefix}"` : i.format === "ends_with" ? `Invalid string: must end with "${i.suffix}"` : i.format === "includes" ? `Invalid string: must include "${i.includes}"` : i.format === "regex" ? `Invalid string: must match pattern ${i.pattern}` : `Invalid ${r[i.format] ?? s.format}`;
          }
        case "not_multiple_of":
          return `Invalid number: must be a multiple of ${s.divisor}`;
        case "unrecognized_keys":
          return `Unrecognized key${s.keys.length > 1 ? "s" : ""}: ${Fs(s.keys, ", ")}`;
        case "invalid_key":
          return `Invalid key in ${s.origin}`;
        case "invalid_union":
          return s.options && Array.isArray(s.options) && s.options.length > 0 ? `Invalid discriminator value. Expected ${s.options.map(a => `'${a}'`).join(" | ")}` : s.inclusive === !1 ? "Invalid input: more than one option matched" : "Invalid input";
        case "invalid_element":
          return `Invalid value in ${s.origin}`;
        default:
          return "Invalid input";
      }
    };
  };
  function tm() {
    return {
      localeError: j_()
    };
  }
  var rm;
  var pu = class {
    constructor() {
      this._map = new WeakMap();
      this._idmap = new Map();
    }
    add(t, ...r) {
      let o = r[0];
      return this._map.set(t, o), o && typeof o == "object" && "id" in o && this._idmap.set(o.id, t), this;
    }
    clear() {
      return this._map = new WeakMap(), this._idmap = new Map(), this;
    }
    remove(t) {
      let r = this._map.get(t);
      return r && typeof r == "object" && "id" in r && this._idmap.delete(r.id), this._map.delete(t), this;
    }
    get(t) {
      let r = t._zod.parent;
      if (r) {
        let o = {
          ...(this.get(r) ?? {})
        };
        delete o.id;
        let n = {
          ...o,
          ...this._map.get(t)
        };
        return Object.keys(n).length ? n : void 0;
      }
      return this._map.get(t);
    }
    has(t) {
      return this._map.has(t);
    }
  };
  function om() {
    return new pu();
  }
  (rm = globalThis).__zod_globalRegistry ?? (rm.__zod_globalRegistry = om());
  var Dt = globalThis.__zod_globalRegistry;
  function nm(e, t) {
    return new e({
      type: "string",
      ...Z(t)
    });
  }
  function sm(e, t) {
    return new e({
      type: "string",
      coerce: !0,
      ...Z(t)
    });
  }
  function hu(e, t) {
    return new e({
      type: "string",
      format: "email",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function im(e, t) {
    return new e({
      type: "string",
      format: "guid",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function am(e, t) {
    return new e({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function cm(e, t) {
    return new e({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: !1,
      version: "v4",
      ...Z(t)
    });
  }
  function um(e, t) {
    return new e({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: !1,
      version: "v6",
      ...Z(t)
    });
  }
  function lm(e, t) {
    return new e({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: !1,
      version: "v7",
      ...Z(t)
    });
  }
  function mu(e, t) {
    return new e({
      type: "string",
      format: "url",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function dm(e, t) {
    return new e({
      type: "string",
      format: "emoji",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function pm(e, t) {
    return new e({
      type: "string",
      format: "nanoid",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function hm(e, t) {
    return new e({
      type: "string",
      format: "cuid",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function mm(e, t) {
    return new e({
      type: "string",
      format: "cuid2",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function fm(e, t) {
    return new e({
      type: "string",
      format: "ulid",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function gm(e, t) {
    return new e({
      type: "string",
      format: "xid",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function Sm(e, t) {
    return new e({
      type: "string",
      format: "ksuid",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function _m(e, t) {
    return new e({
      type: "string",
      format: "ipv4",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function zm(e, t) {
    return new e({
      type: "string",
      format: "ipv6",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function ym(e, t) {
    return new e({
      type: "string",
      format: "cidrv4",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function bm(e, t) {
    return new e({
      type: "string",
      format: "cidrv6",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function vm(e, t) {
    return new e({
      type: "string",
      format: "base64",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function Rm(e, t) {
    return new e({
      type: "string",
      format: "base64url",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function wm(e, t) {
    return new e({
      type: "string",
      format: "e164",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function xm(e, t) {
    return new e({
      type: "string",
      format: "jwt",
      check: "string_format",
      abort: !1,
      ...Z(t)
    });
  }
  function si(e, t) {
    return new e({
      type: "string",
      format: "datetime",
      check: "string_format",
      offset: !1,
      local: !1,
      precision: null,
      ...Z(t)
    });
  }
  function ii(e, t) {
    return new e({
      type: "string",
      format: "date",
      check: "string_format",
      ...Z(t)
    });
  }
  function ai(e, t) {
    return new e({
      type: "string",
      format: "time",
      check: "string_format",
      precision: null,
      ...Z(t)
    });
  }
  function ci(e, t) {
    return new e({
      type: "string",
      format: "duration",
      check: "string_format",
      ...Z(t)
    });
  }
  function Pm(e, t) {
    return new e({
      type: "number",
      checks: [],
      ...Z(t)
    });
  }
  function $m(e, t) {
    return new e({
      type: "number",
      coerce: !0,
      checks: [],
      ...Z(t)
    });
  }
  function Tm(e, t) {
    return new e({
      type: "number",
      check: "number_format",
      abort: !1,
      format: "safeint",
      ...Z(t)
    });
  }
  function Em(e, t) {
    return new e({
      type: "boolean",
      ...Z(t)
    });
  }
  function km(e, t) {
    return new e({
      type: "boolean",
      coerce: !0,
      ...Z(t)
    });
  }
  function Cm(e, t) {
    return new e({
      type: "bigint",
      coerce: !0,
      ...Z(t)
    });
  }
  function Im(e, t) {
    return new e({
      type: "null",
      ...Z(t)
    });
  }
  function Om(e) {
    return new e({
      type: "any"
    });
  }
  function Nm(e) {
    return new e({
      type: "unknown"
    });
  }
  function Am(e, t) {
    return new e({
      type: "never",
      ...Z(t)
    });
  }
  function Mm(e, t) {
    return new e({
      type: "date",
      coerce: !0,
      ...Z(t)
    });
  }
  function Br(e, t) {
    return new Qc({
      check: "less_than",
      ...Z(t),
      value: e,
      inclusive: !1
    });
  }
  function Rt(e, t) {
    return new Qc({
      check: "less_than",
      ...Z(t),
      value: e,
      inclusive: !0
    });
  }
  function Wr(e, t) {
    return new eu({
      check: "greater_than",
      ...Z(t),
      value: e,
      inclusive: !1
    });
  }
  function wt(e, t) {
    return new eu({
      check: "greater_than",
      ...Z(t),
      value: e,
      inclusive: !0
    });
  }
  function _n(e, t) {
    return new $p({
      check: "multiple_of",
      ...Z(t),
      value: e
    });
  }
  function ui(e, t) {
    return new Ep({
      check: "max_length",
      ...Z(t),
      maximum: e
    });
  }
  function Kr(e, t) {
    return new kp({
      check: "min_length",
      ...Z(t),
      minimum: e
    });
  }
  function li(e, t) {
    return new Cp({
      check: "length_equals",
      ...Z(t),
      length: e
    });
  }
  function fu(e, t) {
    return new Ip({
      check: "string_format",
      format: "regex",
      ...Z(t),
      pattern: e
    });
  }
  function gu(e) {
    return new Op({
      check: "string_format",
      format: "lowercase",
      ...Z(e)
    });
  }
  function Su(e) {
    return new Np({
      check: "string_format",
      format: "uppercase",
      ...Z(e)
    });
  }
  function _u(e, t) {
    return new Ap({
      check: "string_format",
      format: "includes",
      ...Z(t),
      includes: e
    });
  }
  function zu(e, t) {
    return new Mp({
      check: "string_format",
      format: "starts_with",
      ...Z(t),
      prefix: e
    });
  }
  function yu(e, t) {
    return new qp({
      check: "string_format",
      format: "ends_with",
      ...Z(t),
      suffix: e
    });
  }
  function Ft(e) {
    return new jp({
      check: "overwrite",
      tx: e
    });
  }
  function bu(e) {
    return Ft(t => t.normalize(e));
  }
  function vu() {
    return Ft(e => e.trim());
  }
  function Ru() {
    return Ft(e => e.toLowerCase());
  }
  function wu() {
    return Ft(e => e.toUpperCase());
  }
  function xu() {
    return Ft(e => Ic(e));
  }
  function qm(e, t, r) {
    return new e({
      type: "array",
      element: t,
      ...Z(r)
    });
  }
  function jm(e, t, r) {
    return new e({
      type: "custom",
      check: "custom",
      fn: t,
      ...Z(r)
    });
  }
  function Lm(e, t) {
    let r = L_(o => (o.addIssue = n => {
      if (typeof n == "string") o.issues.push(Vr(n, o.value, r._zod.def));else {
        let s = n;
        s.fatal && (s.continue = !1);
        s.code ?? (s.code = "custom");
        "input" in s || (s.input = o.value);
        s.inst ?? (s.inst = r);
        s.continue ?? (s.continue = !r._zod.def.abort);
        o.issues.push(Vr(s));
      }
    }, e(o.value, o)), t);
    return r;
  }
  function L_(e, t) {
    let r = new Re({
      check: "custom",
      ...Z(t)
    });
    return r._zod.check = e, r;
  }
  function zn(e, ...t) {
    for (let r of t) for (let o of Reflect.ownKeys(r)) Object.prototype.propertyIsEnumerable.call(r, o) && ge(e, o, r[o]);
    return e;
  }
  function bn(e) {
    let t = e?.target ?? "draft-2020-12";
    return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
      processors: e.processors ?? {},
      metadataRegistry: e?.metadata ?? Dt,
      target: t,
      unrepresentable: e?.unrepresentable ?? "throw",
      override: e?.override ?? (() => {}),
      io: e?.io ?? "output",
      counter: 0,
      seen: new Map(),
      sharedDefsExtractedFor: void 0,
      sharedEmitDoneFor: void 0,
      cycles: e?.cycles ?? "ref",
      reused: e?.reused ?? "inline",
      intersections: [],
      deferred: [],
      external: e?.external ?? void 0
    };
  }
  function ze(e, t, r, o, n) {
    let s = typeof t.unrepresentable == "function" ? t.unrepresentable({
      zodSchema: e,
      path: o.path,
      message: n
    }) : t.unrepresentable;
    if (s === "any") return !1;
    if (s === void 0 || s === "throw") throw new Error(n);
    return Object.assign(r, s), !0;
  }
  function se(e, t, r = {
    path: [],
    schemaPath: []
  }) {
    var o;
    let n = e._zod.def,
      s = t.seen.get(e);
    if (s) return s.count++, r.schemaPath.includes(e) && (s.cycle = r.path), s.schema;
    let i = {
      schema: {},
      count: 1,
      cycle: void 0,
      path: r.path
    };
    t.seen.set(e, i);
    t.sharedDefsExtractedFor = void 0;
    t.sharedEmitDoneFor = void 0;
    let a = e._zod.toJSONSchema?.();
    if (a) i.schema = a;else {
      let d = {
        ...r,
        schemaPath: [...r.schemaPath, e],
        path: r.path
      };
      if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, i.schema, d);else {
        let h = i.schema,
          f = t.processors[n.type];
        if (!f) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${n.type}`);
        f(e, t, h, d);
      }
      let p = e._zod.parent;
      p && (i.ref || (i.ref = p), se(p, t, d), t.seen.get(p).isParent = !0);
    }
    let u = t.metadataRegistry.get(e);
    return u && zn(i.schema, u), t.io === "input" && Ne(e) && (delete i.schema.examples, delete i.schema.default), t.io === "input" && "_prefault" in i.schema && ((o = i.schema).default ?? (o.default = i.schema._prefault)), delete i.schema._prefault, t.seen.get(e).schema;
  }
  function Um(e) {
    return e.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  function vn(e, t) {
    let r = e.seen.get(t);
    if (!r) throw new Error("Unprocessed schema. This is a bug in Zod.");
    if (e.external && e.sharedDefsExtractedFor === e.external) return;
    let o = new Map();
    for (let i of e.seen.entries()) {
      let a = e.metadataRegistry.get(i[0])?.id;
      if (a) {
        let u = o.get(a);
        if (u && u !== i[0]) throw new Error(`Duplicate schema id "${a}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
        o.set(a, i[0]);
      }
    }
    let n = i => {
        let a = e.target === "draft-2020-12" ? "$defs" : "definitions";
        if (e.external) {
          let p = e.external.registry.get(i[0])?.id,
            h = e.external.uri ?? (g => g);
          if (p) return {
            ref: h(p)
          };
          let f = i[1].defId ?? i[1].schema.id ?? `schema${e.counter++}`;
          return i[1].defId = f, {
            defId: f,
            ref: `${h("__shared")}#/${a}/${Um(f)}`
          };
        }
        let u = "#",
          l = `${u}/${a}/`;
        if (i[1] === r && !i[1].schema.id) return {
          ref: u
        };
        let d = i[1].schema.id ?? `__schema${e.counter++}`;
        return {
          defId: d,
          ref: l + Um(d)
        };
      },
      s = i => {
        if (i[1].schema.$ref) return;
        let a = i[1],
          {
            ref: u,
            defId: l
          } = n(i);
        a.def = {
          ...a.schema
        };
        l && (a.defId = l);
        let d = a.schema;
        for (let p in d) delete d[p];
        d.$ref = u;
      };
    if (e.cycles === "throw") for (let i of e.seen.entries()) {
      let a = i[1];
      if (a.cycle) throw new Error(`Cycle detected: #/${a.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
    for (let i of e.seen.entries()) {
      let a = i[1];
      if (t === i[0]) {
        s(i);
        continue;
      }
      if (e.external) {
        let l = e.external.registry.get(i[0])?.id;
        if (t !== i[0] && l) {
          s(i);
          continue;
        }
      }
      if (e.metadataRegistry.get(i[0])?.id) {
        s(i);
        continue;
      }
      if (a.cycle) {
        s(i);
        continue;
      }
      if (a.count > 1 && e.reused === "ref") {
        s(i);
        continue;
      }
    }
    e.external && (e.sharedDefsExtractedFor = e.external);
  }
  function Fm(e) {
    let t = e.anyOf;
    if (!Array.isArray(t) || t.length === 0 || e.type !== void 0) return;
    let r = [];
    for (let o of t) {
      if (!o || typeof o != "object") return;
      Fm(o);
      let n = Object.keys(o);
      if (n.length !== 1 || n[0] !== "type") return;
      let s = o.type;
      for (let i of Array.isArray(s) ? s : [s]) {
        if (typeof i != "string") return;
        r.includes(i) || r.push(i);
      }
    }
    delete e.anyOf;
    e.type = r.length === 1 ? r[0] : r;
  }
  var Vm = new Set(["type", "properties", "required", "additionalProperties"]),
    Zm = ["oneOf", "anyOf"];
  function Dm(e) {
    let t = e.additionalProperties;
    return t === void 0 || t === !1 || typeof t != "object" || t === null ? null : Object.keys(t).length ? t : null;
  }
  function Pu(e) {
    let t = [];
    for (let s of e) {
      if (typeof s != "object" || s.type !== "object") return null;
      for (let i in s) if (!Vm.has(i)) return null;
      t.push(s);
    }
    let r = {},
      o = new Set();
    for (let s of t) {
      for (let i in s.properties) {
        if (Object.prototype.hasOwnProperty.call(r, i)) continue;
        let a = [];
        for (let l of t) {
          let d = l.properties?.[i] ?? Dm(l);
          d != null && (a.some(p => JSON.stringify(p) === JSON.stringify(d)) || a.push(d));
        }
        let u = a.length === 1 ? a[0] : Pu(a) ?? {
          allOf: a
        };
        ge(r, i, u);
      }
      for (let i of s.required ?? []) o.add(i);
    }
    let n = {
      type: "object",
      properties: r
    };
    if (o.size && (n.required = [...o]), t.every(s => s.additionalProperties === !1)) n.additionalProperties = !1;else {
      let s = [];
      for (let i of t) {
        let a = Dm(i);
        a && !s.some(u => JSON.stringify(u) === JSON.stringify(a)) && s.push(a);
      }
      s.length === 1 ? n.additionalProperties = s[0] : s.length > 1 && (n.additionalProperties = {
        allOf: s
      });
    }
    return n;
  }
  function U_(e) {
    let t = e.allOf;
    if (!Array.isArray(t) || t.length < 2) return;
    for (let n of Vm) if (n in e) return;
    let r = t.filter(n => Zm.some(s => Array.isArray(n[s]))),
      o = null;
    if (!r.length) o = Pu(t);else {
      let n = r[0],
        s = Zm.find(u => Array.isArray(n[u]));
      if (Object.keys(n).length !== 1) return;
      let i = t.filter(u => u !== n),
        a = n[s].map(u => Pu([...i, u]));
      if (a.some(u => !u)) return;
      o = {
        [s]: a
      };
    }
    o && (delete e.allOf, zn(e, o));
  }
  function Rn(e, t) {
    let r = e.seen.get(t);
    if (!r) throw new Error("Unprocessed schema. This is a bug in Zod.");
    let o = a => {
      let u = e.seen.get(a);
      if (u.ref === null) return;
      let l = u.def ?? u.schema,
        d = {
          ...l
        },
        p = u.ref;
      if (u.ref = null, p) {
        o(p);
        let f = e.seen.get(p),
          g = f.schema;
        if (g.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (l.allOf = l.allOf ?? [], l.allOf.push(g)) : zn(l, g), zn(l, d), a._zod.parent === p) for (let b in l) b === "$ref" || b === "allOf" || b in d || delete l[b];
        if (g.$ref && f.def) for (let b in l) b === "$ref" || b === "allOf" || b in f.def && JSON.stringify(l[b]) === JSON.stringify(f.def[b]) && delete l[b];
      }
      let h = a._zod.parent;
      if (h && h !== p) {
        o(h);
        let f = e.seen.get(h);
        if (f?.schema.$ref && (l.$ref = f.schema.$ref, f.def)) for (let g in l) g === "$ref" || g === "allOf" || g in f.def && JSON.stringify(l[g]) === JSON.stringify(f.def[g]) && delete l[g];
      }
      e.override({
        zodSchema: a,
        jsonSchema: l,
        path: u.path ?? []
      });
    };
    if (!e.external || e.sharedEmitDoneFor !== e.external) {
      for (let a of [...e.seen.entries()].reverse()) o(a[0]);
      if (e.target !== "openapi-3.0") for (let a of e.seen.entries()) Fm(a[1].def ?? a[1].schema);
      for (let a of e.deferred) a();
      if (e.intersections.length) {
        let a = new Map();
        for (let u of e.seen.values()) for (let l of [u.schema, u.def]) {
          let d = l?.allOf;
          if (!Array.isArray(d)) continue;
          let p = a.get(d);
          p ? p.push(l) : a.set(d, [l]);
        }
        for (let u of e.intersections) for (let l of a.get(u) ?? []) U_(l);
      }
    }
    let n = {};
    if (e.target === "draft-2020-12" ? n.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? n.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? n.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
      let a = e.external.registry.get(t)?.id;
      if (!a) throw new Error("Schema is missing an `id` property");
      n.$id = e.external.uri(a);
    }
    zn(n, r.defId ? r.schema : r.def ?? r.schema);
    let s = e.metadataRegistry.get(t)?.id;
    s !== void 0 && n.id === s && delete n.id;
    let i = e.external?.defs ?? {};
    if (!e.external || e.sharedEmitDoneFor !== e.external) for (let a of e.seen.entries()) {
      let u = a[1];
      u.def && u.defId && (u.def.id === u.defId && delete u.def.id, ge(i, u.defId, u.def));
    }
    e.external && (e.sharedEmitDoneFor = e.external);
    e.external || Object.keys(i).length > 0 && (e.target === "draft-2020-12" ? n.$defs = i : n.definitions = i);
    try {
      let a = JSON.parse(JSON.stringify(n));
      return Object.defineProperty(a, "~standard", {
        value: {
          ...t["~standard"],
          jsonSchema: {
            input: yn(t, "input", e.processors),
            output: yn(t, "output", e.processors)
          }
        },
        enumerable: !1,
        writable: !1
      }), a;
    } catch {
      throw new Error("Error converting schema to JSON.");
    }
  }
  function Ne(e, t) {
    let r = t ?? {
      seen: new Set()
    };
    if (r.seen.has(e)) return !1;
    r.seen.add(e);
    let o = e._zod.def;
    if (o.type === "transform") return !0;
    if (o.type === "array") return Ne(o.element, r);
    if (o.type === "set") return Ne(o.valueType, r);
    if (o.type === "lazy") return Ne(o.getter(), r);
    if (o.type === "promise" || o.type === "optional" || o.type === "nonoptional" || o.type === "nullable" || o.type === "readonly" || o.type === "default" || o.type === "prefault" || o.type === "catch") return Ne(o.innerType, r);
    if (o.type === "intersection") return Ne(o.left, r) || Ne(o.right, r);
    if (o.type === "record" || o.type === "map") return Ne(o.keyType, r) || Ne(o.valueType, r);
    if (o.type === "pipe") return e._zod.traits.has("$ZodCodec") ? !0 : Ne(o.in, r) || Ne(o.out, r);
    if (o.type === "object") {
      for (let n in o.shape) if (Ne(o.shape[n], r)) return !0;
      return !1;
    }
    if (o.type === "union") {
      for (let n of o.options) if (Ne(n, r)) return !0;
      return !1;
    }
    if (o.type === "tuple") {
      for (let n of o.items) if (Ne(n, r)) return !0;
      return !!(o.rest && Ne(o.rest, r));
    }
    return !1;
  }
  var Hm = (e, t = {}) => r => {
      let o = bn({
        ...r,
        processors: t
      });
      return se(e, o), vn(o, e), Rn(o, e);
    },
    yn = (e, t, r = {}) => o => {
      let {
          libraryOptions: n,
          target: s
        } = o ?? {},
        i = bn({
          ...(n ?? {}),
          target: s,
          io: t,
          processors: r
        });
      return se(e, i), vn(i, e), Rn(i, e);
    };
  var Z_ = {
      guid: "uuid",
      url: "uri",
      datetime: "date-time",
      json_string: "json-string",
      regex: ""
    },
    Eu = (e, t, r, o) => {
      let n = r;
      n.type = "string";
      let {
        minimum: s,
        maximum: i,
        format: a,
        patterns: u,
        contentEncoding: l,
        laxFormat: d
      } = e._zod.bag;
      if (typeof s == "number" && (n.minLength = s), typeof i == "number" && (n.maxLength = i), a && (n.format = Z_[a] ?? a, n.format === "" && delete n.format, (a === "time" || d) && delete n.format), l && (n.contentEncoding = l), u && u.size > 0) {
        let p = [...u];
        p.length === 1 ? n.pattern = p[0].source : p.length > 1 && (n.allOf = [...p.map(h => ({
          ...(t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? {
            type: "string"
          } : {}),
          pattern: h.source
        }))]);
      }
    },
    ku = (e, t, r, o) => {
      let n = r,
        {
          minimum: s,
          maximum: i,
          format: a,
          multipleOf: u,
          exclusiveMaximum: l,
          exclusiveMinimum: d
        } = e._zod.bag;
      typeof a == "string" && a.includes("int") ? n.type = "integer" : n.type = "number";
      let p = typeof d == "number" && d >= (s ?? Number.NEGATIVE_INFINITY),
        h = typeof l == "number" && l <= (i ?? Number.POSITIVE_INFINITY),
        f = t.target === "draft-04" || t.target === "openapi-3.0";
      p ? f ? (n.minimum = d, n.exclusiveMinimum = !0) : n.exclusiveMinimum = d : typeof s == "number" && (n.minimum = s);
      h ? f ? (n.maximum = l, n.exclusiveMaximum = !0) : n.exclusiveMaximum = l : typeof i == "number" && (n.maximum = i);
      typeof u == "number" && (Number.isFinite(u) && u !== 0 ? n.multipleOf = Math.abs(u) : ze(e, t, n, o, `A multipleOf divisor of ${u} cannot be represented in JSON Schema`));
    },
    Cu = (e, t, r, o) => {
      r.type = "boolean";
    },
    Iu = (e, t, r, o) => {
      ze(e, t, r, o, "BigInt cannot be represented in JSON Schema");
    },
    Bm = (e, t, r, o) => {
      ze(e, t, r, o, "Symbols cannot be represented in JSON Schema");
    },
    Ou = (e, t, r, o) => {
      t.target === "openapi-3.0" ? (r.type = "string", r.nullable = !0, r.enum = [null]) : r.type = "null";
    },
    Wm = (e, t, r, o) => {
      ze(e, t, r, o, "Undefined cannot be represented in JSON Schema");
    },
    Km = (e, t, r, o) => {
      ze(e, t, r, o, "Void cannot be represented in JSON Schema");
    },
    Nu = (e, t, r, o) => {
      r.not = {};
    },
    Au = (e, t, r, o) => {},
    Mu = (e, t, r, o) => {},
    qu = (e, t, r, o) => {
      ze(e, t, r, o, "Date cannot be represented in JSON Schema");
    },
    ju = (e, t, r, o) => {
      let n = e._zod.def,
        s = ln(n.entries);
      if (s.length === 0) {
        r.not = {};
        return;
      }
      s.every(i => typeof i == "number") && (r.type = "number");
      s.every(i => typeof i == "string") && (r.type = "string");
      r.enum = s;
    },
    Lu = (e, t, r, o) => {
      let n = e._zod.def;
      if (n.values.length === 0) {
        r.not = {};
        return;
      }
      let s = [];
      for (let i of n.values) if (i === void 0) {
        if (ze(e, t, r, o, "Literal `undefined` cannot be represented in JSON Schema")) return;
      } else if (typeof i == "bigint") {
        if (ze(e, t, r, o, "BigInt literals cannot be represented in JSON Schema")) return;
        s.push(Number(i));
      } else s.push(i);
      if (s.length !== 0) if (s.length === 1) {
        let i = s[0];
        r.type = i === null ? "null" : typeof i;
        t.target === "draft-04" || t.target === "openapi-3.0" ? r.enum = [i] : r.const = i;
      } else {
        s.every(i => typeof i == "number") && (r.type = "number");
        s.every(i => typeof i == "string") && (r.type = "string");
        s.every(i => typeof i == "boolean") && (r.type = "boolean");
        s.every(i => i === null) && (r.type = "null");
        r.enum = s;
      }
    },
    Gm = (e, t, r, o) => {
      ze(e, t, r, o, "NaN cannot be represented in JSON Schema");
    },
    Ym = (e, t, r, o) => {
      let n = r,
        s = e._zod.pattern;
      if (!s) throw new Error("Pattern not found in template literal");
      n.type = "string";
      n.pattern = s.source;
    },
    Xm = (e, t, r, o) => {
      let n = r,
        s = {
          type: "string",
          format: "binary",
          contentEncoding: "binary"
        },
        {
          minimum: i,
          maximum: a,
          mime: u
        } = e._zod.bag;
      i !== void 0 && (s.minLength = i);
      a !== void 0 && (s.maxLength = a);
      u ? u.length === 1 ? (s.contentMediaType = u[0], Object.assign(n, s)) : (Object.assign(n, s), n.anyOf = u.map(l => ({
        contentMediaType: l
      }))) : Object.assign(n, s);
    },
    Qm = (e, t, r, o) => {
      r.type = "boolean";
    },
    Uu = (e, t, r, o) => {
      ze(e, t, r, o, "Custom types cannot be represented in JSON Schema");
    },
    ef = (e, t, r, o) => {
      ze(e, t, r, o, "Function types cannot be represented in JSON Schema");
    },
    Zu = (e, t, r, o) => {
      ze(e, t, r, o, "Transforms cannot be represented in JSON Schema");
    },
    tf = (e, t, r, o) => {
      ze(e, t, r, o, "Map cannot be represented in JSON Schema");
    },
    rf = (e, t, r, o) => {
      ze(e, t, r, o, "Set cannot be represented in JSON Schema");
    },
    Du = (e, t, r, o) => {
      let n = r,
        s = e._zod.def,
        {
          minimum: i,
          maximum: a
        } = e._zod.bag;
      typeof i == "number" && (n.minItems = i);
      typeof a == "number" && (n.maxItems = a);
      n.type = "array";
      n.items = se(s.element, t, {
        ...o,
        path: [...o.path, "items"]
      });
    };
  function wn(e) {
    let t = e._zod.def;
    return t.type === "pipe" && t.in._zod.traits.has("$ZodTransform") ? wn(t.out) : t.type === "catch" ? wn(t.innerType) : e._zod.optin;
  }
  var Fu = (e, t, r, o) => {
      let n = r,
        s = e._zod.def,
        i = s.shape;
      if (Object.getOwnPropertySymbols(i).length && ze(e, t, n, o, "Symbol keys cannot be represented in JSON Schema")) return;
      n.type = "object";
      n.properties = {};
      for (let d in i) ge(n.properties, d, se(i[d], t, {
        ...o,
        path: [...o.path, "properties", d]
      }));
      let u = new Set(Object.keys(i)),
        l = new Set([...u].filter(d => {
          let p = s.shape[d];
          return t.io === "input" ? wn(p) === void 0 : p._zod.optout === void 0;
        }));
      l.size > 0 && (n.required = Array.from(l));
      s.catchall?._zod.def.type === "never" ? n.additionalProperties = !1 : s.catchall ? s.catchall && (n.additionalProperties = se(s.catchall, t, {
        ...o,
        path: [...o.path, "additionalProperties"]
      })) : t.io === "output" && (n.additionalProperties = !1);
    },
    Vu = (e, t, r, o) => {
      let n = e._zod.def,
        s = n.inclusive === !1,
        i = n.options.map((a, u) => se(a, t, {
          ...o,
          path: [...o.path, s ? "oneOf" : "anyOf", u]
        }));
      s ? r.oneOf = i : r.anyOf = i;
    },
    Hu = (e, t, r, o) => {
      let n = e._zod.def,
        s = se(n.left, t, {
          ...o,
          path: [...o.path, "allOf", 0]
        }),
        i = se(n.right, t, {
          ...o,
          path: [...o.path, "allOf", 1]
        }),
        a = l => "allOf" in l && Object.keys(l).length === 1,
        u = [...(a(s) ? s.allOf : [s]), ...(a(i) ? i.allOf : [i])];
      r.allOf = u;
      t.intersections.push(u);
    },
    of = (e, t, r, o) => {
      let n = r,
        s = e._zod.def;
      n.type = "array";
      let i = t.target === "draft-2020-12" ? "prefixItems" : "items",
        a = t.target === "draft-2020-12" || t.target === "openapi-3.0" ? "items" : "additionalItems",
        u = s.items.map((y, b) => se(y, t, {
          ...o,
          path: [...o.path, i, b]
        })),
        l = s.rest ? se(s.rest, t, {
          ...o,
          path: [...o.path, a, ...(t.target === "openapi-3.0" ? [s.items.length] : [])]
        }) : null,
        d = s.items.length;
      for (; d > 0;) {
        let y = s.items[d - 1];
        if (!(t.io === "input" ? wn(y) !== void 0 : y._zod.optout === "optional")) break;
        d--;
      }
      let p = s.items.length,
        h = !s.rest;
      t.target === "draft-2020-12" ? (n.prefixItems = u, h ? n.items = !1 : l && (n.items = l), d > 0 && (n.minItems = d), h && (n.maxItems = p)) : t.target === "openapi-3.0" ? (n.items = {
        anyOf: u
      }, l && n.items.anyOf.push(l), d > 0 && (n.minItems = d), h && (n.maxItems = p)) : (n.items = u, h ? n.additionalItems = !1 : l && (n.additionalItems = l), d > 0 && (n.minItems = d), h && (n.maxItems = p));
      let {
        minimum: f,
        maximum: g
      } = e._zod.bag;
      typeof f == "number" && (n.minItems = f);
      typeof g == "number" && (n.maxItems = g);
    };
  function $u(e, t, r) {
    if (t.$ref) {
      if (r.has(t)) return t;
      r.add(t);
      let g = e.get(t)?.def;
      if (!g) return t;
      let y = $u(e, g, r);
      return y === g ? t : y;
    }
    for (let g of ["anyOf", "oneOf"]) {
      let y = t[g];
      if (!Array.isArray(y)) continue;
      let b = y.map(T => $u(e, T, r));
      b.some((T, L) => T !== y[L]) && (t = {
        ...t,
        [g]: b
      });
    }
    let o = Array.isArray(t.type) ? t.type : [t.type],
      n = !o.includes("string") && o.some(g => g === "number" || g === "integer"),
      s = t.enum ?? (t.const !== void 0 ? [t.const] : void 0);
    if (!n && !s?.some(g => typeof g == "number")) return t;
    let {
      minimum: i,
      maximum: a,
      exclusiveMinimum: u,
      exclusiveMaximum: l,
      multipleOf: d,
      format: p,
      id: h,
      ...f
    } = t;
    return f.enum ? f.enum = f.enum.map(g => typeof g == "number" ? String(g) : g) : typeof f.const == "number" && (f.const = String(f.const)), n && (f.type = "string", s || (f.pattern = (o.includes("number") ? gn : Ys).source)), f;
  }
  var Tu = new WeakMap();
  function D_(e) {
    let t = new Map();
    for (let o of e.seen.values()) o.def && !t.has(o.schema) && t.set(o.schema, o);
    let r = new Map();
    for (let o of Tu.get(e) ?? []) {
      let n = e.seen.get(o),
        s = (n?.def ?? n?.schema)?.propertyNames;
      if (!s || s === !0 || r.has(s)) continue;
      let i = $u(t, s, new Set());
      i !== s && r.set(s, i);
    }
    if (r.size) for (let o of e.seen.values()) for (let n of [o.schema, o.def]) {
      let s = n && r.get(n.propertyNames);
      s && (n.propertyNames = s);
    }
  }
  var Ju = (e, t, r, o) => {
      let n = r,
        s = e._zod.def;
      n.type = "object";
      let i = s.keyType,
        u = i._zod.bag?.patterns;
      if (s.mode === "loose" && u && u.size > 0) {
        let p = se(s.valueType, t, {
          ...o,
          path: [...o.path, "patternProperties", "*"]
        });
        n.patternProperties = {};
        for (let h of u) ge(n.patternProperties, h.source, p);
      } else {
        if (t.target === "draft-07" || t.target === "draft-2020-12") {
          n.propertyNames = se(s.keyType, t, {
            ...o,
            path: [...o.path, "propertyNames"]
          });
          let p = Tu.get(t);
          p || (p = [], Tu.set(t, p), t.deferred.push(() => D_(t)));
          p.push(e);
        }
        n.additionalProperties = se(s.valueType, t, {
          ...o,
          path: [...o.path, "additionalProperties"]
        });
      }
      let l = i._zod.values,
        d = t.io === "input" && wn(s.valueType) !== void 0;
      if (l && !s.partial && !d) {
        let p = [...l].filter(h => typeof h == "string" || typeof h == "number");
        p.length > 0 && (n.required = p.map(String));
      }
    },
    Bu = (e, t, r, o) => {
      let n = e._zod.def,
        s = se(n.innerType, t, o),
        i = t.seen.get(e);
      t.target === "openapi-3.0" ? (i.ref = n.innerType, r.nullable = !0) : r.anyOf = [s, {
        type: "null"
      }];
    },
    Wu = (e, t, r, o) => {
      let n = e._zod.def;
      se(n.innerType, t, o);
      let s = t.seen.get(e);
      s.ref = n.innerType;
    },
    Ku = Symbol();
  function nf(e, t, r, o, n) {
    let s = !1,
      i = JSON.stringify(e, (a, u) => typeof u != "bigint" ? u : (s = !0, null));
    return s ? (ze(t, r, o, n, "BigInt defaults cannot be represented in JSON Schema"), Ku) : JSON.parse(i);
  }
  var Gu = (e, t, r, o) => {
      let n = e._zod.def;
      se(n.innerType, t, o);
      let s = t.seen.get(e);
      s.ref = n.innerType;
      let i = nf(n.defaultValue, e, t, r, o);
      i !== Ku && (r.default = i);
    },
    Yu = (e, t, r, o) => {
      let n = e._zod.def;
      se(n.innerType, t, o);
      let s = t.seen.get(e);
      if (s.ref = n.innerType, t.io !== "input") return;
      let i = nf(n.defaultValue, e, t, r, o);
      i !== Ku && (r._prefault = i);
    },
    Xu = (e, t, r, o) => {
      let n = e._zod.def;
      se(n.innerType, t, o);
      let s = t.seen.get(e);
      s.ref = n.innerType;
      let i;
      try {
        i = n.catchValue(void 0);
      } catch {
        ze(e, t, r, o, "Dynamic catch values are not supported in JSON Schema");
        return;
      }
      r.default = i;
    },
    Qu = (e, t, r, o) => {
      let n = e._zod.def,
        s = n.in._zod.traits.has("$ZodTransform"),
        i = t.io === "input" ? s ? n.out : n.in : n.out;
      se(i, t, o);
      let a = t.seen.get(e);
      a.ref = i;
    },
    el = (e, t, r, o) => {
      let n = e._zod.def;
      se(n.innerType, t, o);
      let s = t.seen.get(e);
      s.ref = n.innerType;
      r.readOnly = !0;
    },
    sf = (e, t, r, o) => {
      let n = e._zod.def;
      se(n.innerType, t, o);
      let s = t.seen.get(e);
      s.ref = n.innerType;
    },
    di = (e, t, r, o) => {
      let n = e._zod.def;
      se(n.innerType, t, o);
      let s = t.seen.get(e);
      s.ref = n.innerType;
    },
    tl = (e, t, r, o) => {
      let n = e._zod.innerType;
      se(n, t, o);
      let s = t.seen.get(e);
      s.ref = n;
    },
    Jm = {
      string: Eu,
      number: ku,
      boolean: Cu,
      bigint: Iu,
      symbol: Bm,
      null: Ou,
      undefined: Wm,
      void: Km,
      never: Nu,
      any: Au,
      unknown: Mu,
      date: qu,
      enum: ju,
      literal: Lu,
      nan: Gm,
      template_literal: Ym,
      file: Xm,
      success: Qm,
      custom: Uu,
      function: ef,
      transform: Zu,
      map: tf,
      set: rf,
      array: Du,
      object: Fu,
      union: Vu,
      intersection: Hu,
      tuple: of,
      record: Ju,
      nullable: Bu,
      nonoptional: Wu,
      default: Gu,
      prefault: Yu,
      catch: Xu,
      pipe: Qu,
      readonly: el,
      promise: sf,
      optional: di,
      lazy: tl
    };
  function pi(e, t) {
    if ("_idmap" in e) {
      let o = e,
        n = bn({
          ...t,
          processors: Jm
        }),
        s = {};
      for (let u of o._idmap.entries()) {
        let [l, d] = u;
        se(d, n);
      }
      let i = {},
        a = {
          registry: o,
          uri: t?.uri,
          defs: s
        };
      n.external = a;
      for (let u of o._idmap.entries()) {
        let [l, d] = u;
        vn(n, d);
        ge(i, l, Rn(n, d));
      }
      if (Object.keys(s).length > 0) {
        let u = n.target === "draft-2020-12" ? "$defs" : "definitions";
        i.__shared = {
          [u]: s
        };
      }
      return {
        schemas: i
      };
    }
    let r = bn({
      ...t,
      processors: Jm
    });
    return se(e, r), vn(r, e), Rn(r, e);
  }
  var af = new WeakSet([Object.prototype, Error.prototype]);
  function hi(e, t, r) {
    Object.defineProperty(e, t, {
      configurable: !0,
      enumerable: !1,
      get() {
        let o = r(this);
        return Object.defineProperty(this, t, {
          value: o,
          configurable: !0,
          writable: !0
        }), o;
      },
      set(o) {
        Object.defineProperty(this, t, {
          value: o,
          configurable: !0,
          writable: !0
        });
      }
    });
  }
  var G_ = (e, t) => {
    Bs.init(e, t);
    e.name = "ZodError";
    let r = Object.getPrototypeOf(e);
    af.has(r) || (af.add(r), hi(r, "format", o => n => Wc(o, n)), hi(r, "flatten", o => n => Bc(o, n)), hi(r, "addIssue", o => n => {
      o.issues.push(n);
      o.message = JSON.stringify(o.issues, Dr, 2);
    }), hi(r, "addIssues", o => n => {
      o.issues.push(...n);
      o.message = JSON.stringify(o.issues, Dr, 2);
    }), Object.defineProperty(r, "isEmpty", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this.issues.length === 0;
      }
    }));
  };
  var We = z("ZodError", G_, void 0, {
    Parent: Error
  });
  var cf = Ks(We),
    uf = Gs(We),
    mi = mn(We),
    lf = fn(We),
    df = Hd(We),
    pf = Jd(We),
    hf = Bd(We),
    mf = Wd(We),
    ff = Kd(We),
    gf = Gd(We),
    Sf = Yd(We),
    _f = Xd(We);
  function X_() {
    Le.localeError || Ue(tm());
  }
  function gi() {
    Le.memoizer || Ue({
      memoizer: du()
    });
  }
  var ne = z("ZodType", (e, t) => (X_(), oe.init(e, t), e.def = t, e.type = t.type, e), {
      check(...e) {
        let t = this.def;
        return this.clone(G.mergeDefs(t, {
          checks: [...(t.checks ?? []), ...e.map(r => typeof r == "function" ? {
            _zod: {
              check: r,
              def: {
                check: "custom"
              },
              onattach: []
            }
          } : r)]
        }), {
          parent: !0
        });
      },
      with(...e) {
        return this.check(...e);
      },
      clone(e, t) {
        return tt(this, e, t);
      },
      brand() {
        return this;
      },
      register(e, t) {
        return e.add(this, t), this;
      },
      refine(e, t) {
        return this.check(Uz(e, t));
      },
      superRefine(e, t) {
        return this.check(Zz(e, t));
      },
      overwrite(e) {
        return this.check(Ft(e));
      },
      optional() {
        return q(this);
      },
      exactOptional() {
        return Pz(this);
      },
      nullable() {
        return bf(this);
      },
      nullish() {
        return q(bf(this));
      },
      nonoptional(e) {
        return Iz(this, e);
      },
      array() {
        return S(this);
      },
      or(e) {
        return O([this, e]);
      },
      and(e) {
        return xt(this, e);
      },
      transform(e) {
        return vf(this, If(e));
      },
      default(e) {
        return Ez(this, e);
      },
      prefault(e) {
        return Cz(this, e);
      },
      catch(e) {
        return Nz(this, e);
      },
      pipe(e) {
        return vf(this, e);
      },
      readonly() {
        return qz(this);
      },
      describe(e) {
        let t = this.clone();
        return Dt.add(t, {
          description: e
        }), t;
      },
      meta(...e) {
        if (e.length === 0) return Dt.get(this);
        let t = this.clone();
        return Dt.add(t, e[0]), t;
      },
      isOptional() {
        return this.safeParse(void 0).success;
      },
      isNullable() {
        return this.safeParse(null).success;
      },
      apply(e, ...t) {
        return t.length === 0 ? e(this) : e(this, ...t);
      },
      get "~standard"() {
        return G.hide(this, "~standard", {
          ...ou(this),
          jsonSchema: {
            input: yn(this, "input"),
            output: yn(this, "output")
          }
        });
      },
      set "~standard"(e) {
        G.own(this, "~standard", e);
      },
      parse: function e(t, r) {
        return cf(this, t, r, {
          callee: e
        });
      },
      parseAsync: async function e(t, r) {
        return await uf(this, t, r, {
          callee: e
        });
      },
      safeParse(e, t) {
        return mi(this, e, t);
      },
      async safeParseAsync(e, t) {
        return lf(this, e, t);
      },
      get spa() {
        return this?.safeParseAsync;
      },
      set spa(e) {
        G.own(this, "spa", e);
      },
      encode: function e(t, r) {
        return df(this, t, r, {
          callee: e
        });
      },
      decode: function e(t, r) {
        return pf(this, t, r, {
          callee: e
        });
      },
      encodeAsync: async function e(t, r) {
        return await hf(this, t, r, {
          callee: e
        });
      },
      decodeAsync: async function e(t, r) {
        return await mf(this, t, r, {
          callee: e
        });
      },
      safeEncode(e, t) {
        return ff(this, e, t);
      },
      safeDecode(e, t) {
        return gf(this, e, t);
      },
      async safeEncodeAsync(e, t) {
        return Sf(this, e, t);
      },
      async safeDecodeAsync(e, t) {
        return _f(this, e, t);
      },
      toJSONSchema(e) {
        return Hm(this, {})(e);
      },
      get description() {
        return Dt.get(this)?.description;
      },
      get _def() {
        return this._zod.def;
      }
    }),
    Rf = z("_ZodString", (e, t) => {
      ri.init(e, t);
      ne.init(e, t);
      e._zod.processJSONSchema = (o, n, s) => Eu(e, o, n, s);
      let r = e._zod.bag;
      e.format = r.format ?? null;
      e.minLength = r.minimum ?? null;
      e.maxLength = r.maximum ?? null;
    }, {
      regex(...e) {
        return this.check(fu(...e));
      },
      includes(...e) {
        return this.check(_u(...e));
      },
      startsWith(...e) {
        return this.check(zu(...e));
      },
      endsWith(...e) {
        return this.check(yu(...e));
      },
      min(...e) {
        return this.check(Kr(...e));
      },
      max(...e) {
        return this.check(ui(...e));
      },
      length(...e) {
        return this.check(li(...e));
      },
      nonempty(...e) {
        return this.check(Kr(1, ...e));
      },
      lowercase(e) {
        return this.check(gu(e));
      },
      uppercase(e) {
        return this.check(Su(e));
      },
      trim() {
        return this.check(vu());
      },
      normalize(...e) {
        return this.check(bu(...e));
      },
      toLowerCase() {
        return this.check(Ru());
      },
      toUpperCase() {
        return this.check(wu());
      },
      slugify() {
        return this.check(xu());
      }
    }),
    ol = z("ZodString", (e, t) => {
      ri.init(e, t);
      Rf.init(e, t);
    }, {
      email(e) {
        return this.check(hu(wf, e));
      },
      url(e) {
        return this.check(mu(Pf, e));
      },
      jwt(e) {
        return this.check(xm(mz, e));
      },
      emoji(e) {
        return this.check(dm(ez, e));
      },
      guid(e) {
        return this.check(im(Q_, e));
      },
      uuid(e) {
        return this.check(am(fi, e));
      },
      uuidv4(e) {
        return this.check(cm(fi, e));
      },
      uuidv6(e) {
        return this.check(um(fi, e));
      },
      uuidv7(e) {
        return this.check(lm(fi, e));
      },
      nanoid(e) {
        return this.check(pm(tz, e));
      },
      cuid(e) {
        return this.check(hm(rz, e));
      },
      cuid2(e) {
        return this.check(mm(oz, e));
      },
      ulid(e) {
        return this.check(fm(nz, e));
      },
      base64(e) {
        return this.check(vm(dz, e));
      },
      base64url(e) {
        return this.check(Rm(pz, e));
      },
      xid(e) {
        return this.check(gm(sz, e));
      },
      ksuid(e) {
        return this.check(Sm(iz, e));
      },
      ipv4(e) {
        return this.check(_m(az, e));
      },
      ipv6(e) {
        return this.check(zm(cz, e));
      },
      cidrv4(e) {
        return this.check(ym(uz, e));
      },
      cidrv6(e) {
        return this.check(bm(lz, e));
      },
      e164(e) {
        return this.check(wm(hz, e));
      },
      datetime(e) {
        return this.check(si(xn, e));
      },
      date(e) {
        return this.check(ii(Pn, e));
      },
      time(e) {
        return this.check(ai($n, e));
      },
      duration(e) {
        return this.check(ci(Tn, e));
      }
    });
  function c(e) {
    return nm(ol, e);
  }
  var ue = z("ZodStringFormat", (e, t) => {
      ae.init(e, t);
      Rf.init(e, t);
    }),
    xn = z("ZodISODateTime", (e, t) => {
      lh.init(e, t);
      ue.init(e, t);
    }),
    Pn = z("ZodISODate", (e, t) => {
      dh.init(e, t);
      ue.init(e, t);
    }),
    $n = z("ZodISOTime", (e, t) => {
      ph.init(e, t);
      ue.init(e, t);
    }),
    Tn = z("ZodISODuration", (e, t) => {
      hh.init(e, t);
      ue.init(e, t);
    }),
    wf = z("ZodEmail", (e, t) => {
      Qp.init(e, t);
      ue.init(e, t);
    });
  function xf(e) {
    return hu(wf, e);
  }
  var Q_ = z("ZodGUID", (e, t) => {
    Yp.init(e, t);
    ue.init(e, t);
  });
  var fi = z("ZodUUID", (e, t) => {
    Xp.init(e, t);
    ue.init(e, t);
  });
  var Pf = z("ZodURL", (e, t) => {
    rh.init(e, t);
    ue.init(e, t);
  });
  function Si(e) {
    return mu(Pf, e);
  }
  var ez = z("ZodEmoji", (e, t) => {
    oh.init(e, t);
    ue.init(e, t);
  });
  var tz = z("ZodNanoID", (e, t) => {
    nh.init(e, t);
    ue.init(e, t);
  });
  var rz = z("ZodCUID", (e, t) => {
    sh.init(e, t);
    ue.init(e, t);
  });
  var oz = z("ZodCUID2", (e, t) => {
    ih.init(e, t);
    ue.init(e, t);
  });
  var nz = z("ZodULID", (e, t) => {
    ah.init(e, t);
    ue.init(e, t);
  });
  var sz = z("ZodXID", (e, t) => {
    ch.init(e, t);
    ue.init(e, t);
  });
  var iz = z("ZodKSUID", (e, t) => {
    uh.init(e, t);
    ue.init(e, t);
  });
  var az = z("ZodIPv4", (e, t) => {
    mh.init(e, t);
    ue.init(e, t);
  });
  var cz = z("ZodIPv6", (e, t) => {
    gh.init(e, t);
    ue.init(e, t);
  });
  var uz = z("ZodCIDRv4", (e, t) => {
    Sh.init(e, t);
    ue.init(e, t);
  });
  var lz = z("ZodCIDRv6", (e, t) => {
    _h.init(e, t);
    ue.init(e, t);
  });
  var dz = z("ZodBase64", (e, t) => {
    yh.init(e, t);
    ue.init(e, t);
  });
  var pz = z("ZodBase64URL", (e, t) => {
    bh.init(e, t);
    ue.init(e, t);
  });
  var hz = z("ZodE164", (e, t) => {
    vh.init(e, t);
    ue.init(e, t);
  });
  var mz = z("ZodJWT", (e, t) => {
    Rh.init(e, t);
    ue.init(e, t);
  });
  var _i = z("ZodNumber", (e, t) => {
    nu.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (o, n, s) => ku(e, o, n, s);
    let r = e._zod.bag;
    e.minValue = Math.max(r.minimum ?? Number.NEGATIVE_INFINITY, r.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
    e.maxValue = Math.min(r.maximum ?? Number.POSITIVE_INFINITY, r.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
    e.isInt = (r.format ?? "").includes("int") || Number.isSafeInteger(r.multipleOf ?? .5);
    e.isFinite = !0;
    e.format = r.format ?? null;
  }, {
    gt(e, t) {
      return this.check(Wr(e, t));
    },
    gte(e, t) {
      return this.check(wt(e, t));
    },
    min(e, t) {
      return this.check(wt(e, t));
    },
    lt(e, t) {
      return this.check(Br(e, t));
    },
    lte(e, t) {
      return this.check(Rt(e, t));
    },
    max(e, t) {
      return this.check(Rt(e, t));
    },
    int(e) {
      return this.check(zf(e));
    },
    safe(e) {
      return this.check(zf(e));
    },
    positive(e) {
      return this.check(Wr(0, e));
    },
    nonnegative(e) {
      return this.check(wt(0, e));
    },
    negative(e) {
      return this.check(Br(0, e));
    },
    nonpositive(e) {
      return this.check(Rt(0, e));
    },
    multipleOf(e, t) {
      return this.check(_n(e, t));
    },
    step(e, t) {
      return this.check(_n(e, t));
    },
    finite() {
      return this;
    }
  });
  function w(e) {
    return Pm(_i, e);
  }
  var fz = z("ZodNumberFormat", (e, t) => {
    wh.init(e, t);
    _i.init(e, t);
  });
  function zf(e) {
    return Tm(fz, e);
  }
  var nl = z("ZodBoolean", (e, t) => {
    xh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Cu(e, r, o, n);
  });
  function k(e) {
    return Em(nl, e);
  }
  var $f = z("ZodBigInt", (e, t) => {
    Ph.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (o, n, s) => Iu(e, o, n, s);
    let r = e._zod.bag;
    e.minValue = r.minimum ?? null;
    e.maxValue = r.maximum ?? null;
    e.format = r.format ?? null;
  }, {
    gte(e, t) {
      return this.check(wt(e, t));
    },
    min(e, t) {
      return this.check(wt(e, t));
    },
    gt(e, t) {
      return this.check(Wr(e, t));
    },
    lt(e, t) {
      return this.check(Br(e, t));
    },
    lte(e, t) {
      return this.check(Rt(e, t));
    },
    max(e, t) {
      return this.check(Rt(e, t));
    },
    positive(e) {
      return this.check(Wr(BigInt(0), e));
    },
    negative(e) {
      return this.check(Br(BigInt(0), e));
    },
    nonpositive(e) {
      return this.check(Rt(BigInt(0), e));
    },
    nonnegative(e) {
      return this.check(wt(BigInt(0), e));
    },
    multipleOf(e, t) {
      return this.check(_n(e, t));
    }
  });
  var gz = z("ZodNull", (e, t) => {
    $h.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Ou(e, r, o, n);
  });
  function lr(e) {
    return Im(gz, e);
  }
  var Sz = z("ZodAny", (e, t) => {
    Th.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Au(e, r, o, n);
  });
  function Tf() {
    return Om(Sz);
  }
  var _z = z("ZodUnknown", (e, t) => {
    Eh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Mu(e, r, o, n);
  });
  function j() {
    return Nm(_z);
  }
  var zz = z("ZodNever", (e, t) => {
    kh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Nu(e, r, o, n);
  });
  function yz(e) {
    return Am(zz, e);
  }
  var Ef = z("ZodDate", (e, t) => {
    Ch.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (o, n, s) => qu(e, o, n, s);
    e.min = (o, n) => e.check(wt(o, n));
    e.max = (o, n) => e.check(Rt(o, n));
    let r = e._zod.bag;
    e.minDate = r.minimum ? new Date(r.minimum) : null;
    e.maxDate = r.maximum ? new Date(r.maximum) : null;
  });
  var bz = z("ZodArray", (e, t) => {
    gi();
    Ih.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Du(e, r, o, n);
    e.element = t.element;
  }, {
    min(e, t) {
      return this.check(Kr(e, t));
    },
    nonempty(e) {
      return this.check(Kr(1, e));
    },
    max(e, t) {
      return this.check(ui(e, t));
    },
    length(e, t) {
      return this.check(li(e, t));
    },
    unwrap() {
      return this.element;
    }
  });
  function S(e, t) {
    return qm(bz, e, t);
  }
  var kf = z("ZodObject", (e, t) => {
    gi();
    Ah.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Fu(e, r, o, n);
    G.installLazyProp(e, "shape", r => r._zod.def.shape, !1);
  }, {
    keyof() {
      return B(Object.keys(this._zod.def.shape));
    },
    catchall(e) {
      return this.clone({
        ...this._zod.def,
        catchall: e
      });
    },
    passthrough() {
      return this.clone({
        ...this._zod.def,
        catchall: j()
      });
    },
    loose() {
      return this.clone({
        ...this._zod.def,
        catchall: j()
      });
    },
    strict() {
      return this.clone({
        ...this._zod.def,
        catchall: yz()
      });
    },
    strip() {
      return this.clone({
        ...this._zod.def,
        catchall: void 0
      });
    },
    extend(e) {
      return G.extend(this, e);
    },
    safeExtend(e) {
      return G.safeExtend(this, e);
    },
    merge(e) {
      return G.merge(this, e);
    },
    pick(e) {
      return G.pick(this, e);
    },
    omit(e) {
      return G.omit(this, e);
    },
    partial(...e) {
      return G.partial(Of, this, e[0]);
    },
    exactPartial(...e) {
      return G.partial(Nf, this, e[0], "exactPartial");
    },
    required(...e) {
      return G.required(Af, this, e[0]);
    }
  });
  function m(e, t) {
    let r = {
      type: "object",
      shape: e ?? {},
      ...G.normalizeParams(t)
    };
    return new kf(r);
  }
  function D(e, t) {
    return new kf({
      type: "object",
      shape: e,
      catchall: j(),
      ...G.normalizeParams(t)
    });
  }
  var Cf = z("ZodUnion", (e, t) => {
    su.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Vu(e, r, o, n);
    e.options = t.options;
  });
  function O(e, t) {
    return new Cf({
      type: "union",
      options: e,
      ...G.normalizeParams(t)
    });
  }
  var vz = z("ZodDiscriminatedUnion", (e, t) => {
    Cf.init(e, t);
    Mh.init(e, t);
  });
  function Yr(e, t, r) {
    return new vz({
      type: "union",
      options: t,
      discriminator: e,
      ...G.normalizeParams(r)
    });
  }
  var Rz = z("ZodIntersection", (e, t) => {
    qh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Hu(e, r, o, n);
  });
  function xt(e, t) {
    return new Rz({
      type: "intersection",
      left: e,
      right: t
    });
  }
  var yf = z("ZodRecord", (e, t) => {
    gi();
    jh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Ju(e, r, o, n);
    e.keyType = t.keyType;
    e.valueType = t.valueType;
  });
  function P(e, t, r) {
    return !t || !t._zod ? new yf({
      type: "record",
      keyType: c(),
      valueType: e,
      ...G.normalizeParams(t)
    }) : new yf({
      type: "record",
      keyType: e,
      valueType: t,
      ...G.normalizeParams(r)
    });
  }
  var rl = z("ZodEnum", (e, t) => {
    Lh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (o, n, s) => ju(e, o, n, s);
    e.enum = t.entries;
    e.options = Object.values(t.entries);
    let r = new Set(Object.keys(t.entries));
    e.extract = (o, n) => {
      let s = {};
      for (let i of o) if (r.has(i)) s[i] = t.entries[i];else throw new Error(`Key ${i} not found in enum`);
      return new rl({
        ...t,
        checks: [],
        ...G.normalizeParams(n),
        entries: s
      });
    };
    e.exclude = (o, n) => {
      let s = {
        ...t.entries
      };
      for (let i of o) if (r.has(i)) delete s[i];else throw new Error(`Key ${i} not found in enum`);
      return new rl({
        ...t,
        checks: [],
        ...G.normalizeParams(n),
        entries: s
      });
    };
  });
  function B(e, t) {
    let r = Array.isArray(e) ? Object.fromEntries(e.map(o => [o, o])) : e;
    return new rl({
      type: "enum",
      entries: r,
      ...G.normalizeParams(t)
    });
  }
  var wz = z("ZodLiteral", (e, t) => {
    Uh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Lu(e, r, o, n);
    e.values = new Set(t.values);
    Object.defineProperty(e, "value", {
      get() {
        if (t.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
        return t.values[0];
      }
    });
  });
  function _(e, t) {
    return new wz({
      type: "literal",
      values: Array.isArray(e) ? e : [e],
      ...G.normalizeParams(t)
    });
  }
  var xz = z("ZodTransform", (e, t) => {
    gi();
    Zh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Zu(e, r, o, n);
    e._zod.parse = (r, o) => {
      if (o.direction === "backward") throw new Hr(e.constructor.name);
      r.addIssue = s => {
        if (typeof s == "string") r.issues.push(G.issue(s, r.value, t));else {
          let i = s;
          i.fatal && (i.continue = !1);
          i.code ?? (i.code = "custom");
          "input" in i || (i.input = r.value);
          i.inst ?? (i.inst = e);
          r.issues.push(G.issue(i));
        }
      };
      let n = t.transform(r.value, r);
      return n instanceof Promise ? n.then(s => (r.value = s, r)) : (r.value = n, r);
    };
  });
  function If(e) {
    return new xz({
      type: "transform",
      transform: e
    });
  }
  var Of = z("ZodOptional", (e, t) => {
    iu.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => di(e, r, o, n);
    e.unwrap = () => e._zod.def.innerType;
  });
  function q(e) {
    return new Of({
      type: "optional",
      innerType: e
    });
  }
  var Nf = z("ZodExactOptional", (e, t) => {
    Dh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => di(e, r, o, n);
    e.unwrap = () => e._zod.def.innerType;
  });
  function Pz(e) {
    return new Nf({
      type: "optional",
      innerType: e
    });
  }
  var $z = z("ZodNullable", (e, t) => {
    Fh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Bu(e, r, o, n);
    e.unwrap = () => e._zod.def.innerType;
  });
  function bf(e) {
    return new $z({
      type: "nullable",
      innerType: e
    });
  }
  var Tz = z("ZodDefault", (e, t) => {
    Vh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Gu(e, r, o, n);
    e.unwrap = () => e._zod.def.innerType;
    e.removeDefault = e.unwrap;
  });
  function Ez(e, t) {
    return new Tz({
      type: "default",
      innerType: e,
      get defaultValue() {
        return typeof t == "function" ? t() : G.shallowClone(t);
      }
    });
  }
  var kz = z("ZodPrefault", (e, t) => {
    Hh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Yu(e, r, o, n);
    e.unwrap = () => e._zod.def.innerType;
  });
  function Cz(e, t) {
    return new kz({
      type: "prefault",
      innerType: e,
      get defaultValue() {
        return typeof t == "function" ? t() : G.shallowClone(t);
      }
    });
  }
  var Af = z("ZodNonOptional", (e, t) => {
    Jh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Wu(e, r, o, n);
    e.unwrap = () => e._zod.def.innerType;
  });
  function Iz(e, t) {
    return new Af({
      type: "nonoptional",
      innerType: e,
      ...G.normalizeParams(t)
    });
  }
  var Oz = z("ZodCatch", (e, t) => {
    Bh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Xu(e, r, o, n);
    e.unwrap = () => e._zod.def.innerType;
    e.removeCatch = e.unwrap;
  });
  function Nz(e, t) {
    return new Oz({
      type: "catch",
      innerType: e,
      catchValue: typeof t == "function" ? t : G.constantCatch(t)
    });
  }
  var Mf = z("ZodPipe", (e, t) => {
    au.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Qu(e, r, o, n);
    e.in = t.in;
    e.out = t.out;
  });
  function vf(e, t) {
    return new Mf({
      type: "pipe",
      in: e,
      out: t
    });
  }
  var Az = z("ZodPreprocess", (e, t) => {
      Mf.init(e, t);
      Wh.init(e, t);
    }),
    Mz = z("ZodReadonly", (e, t) => {
      Kh.init(e, t);
      ne.init(e, t);
      e._zod.processJSONSchema = (r, o, n) => el(e, r, o, n);
      e.unwrap = () => e._zod.def.innerType;
    });
  function qz(e) {
    return new Mz({
      type: "readonly",
      innerType: e
    });
  }
  var jz = z("ZodLazy", (e, t) => {
    Gh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => tl(e, r, o, n);
    e.unwrap = () => e._zod.def.getter();
  });
  function En(e) {
    return new jz({
      type: "lazy",
      getter: e
    });
  }
  var Lz = z("ZodCustom", (e, t) => {
    Yh.init(e, t);
    ne.init(e, t);
    e._zod.processJSONSchema = (r, o, n) => Uu(e, r, o, n);
  });
  function Uz(e, t = {}) {
    return jm(Lz, e, t);
  }
  function Zz(e, t) {
    return Lm(e, t);
  }
  function dr(e, t) {
    return new Az({
      type: "pipe",
      in: If(e),
      out: t
    });
  }
  var jf = {
    invalid_type: "invalid_type",
    too_big: "too_big",
    too_small: "too_small",
    invalid_format: "invalid_format",
    not_multiple_of: "not_multiple_of",
    unrecognized_keys: "unrecognized_keys",
    invalid_union: "invalid_union",
    invalid_key: "invalid_key",
    invalid_element: "invalid_element",
    invalid_value: "invalid_value",
    custom: "custom"
  };
  var qf;
  qf || (qf = {});
  var Pt = {};
  xc(Pt, {
    ZodISODate: () => Pn,
    ZodISODateTime: () => xn,
    ZodISODuration: () => Tn,
    ZodISOTime: () => $n,
    date: () => Vz,
    datetime: () => Fz,
    duration: () => Jz,
    time: () => Hz
  });
  function Fz(e) {
    return si(xn, e);
  }
  function Vz(e) {
    return ii(Pn, e);
  }
  function Hz(e) {
    return ai($n, e);
  }
  function Jz(e) {
    return ci(Tn, e);
  }
  var zi = {};
  xc(zi, {
    bigint: () => Gz,
    boolean: () => Kz,
    date: () => Yz,
    number: () => Wz,
    string: () => Bz
  });
  function Bz(e) {
    return sm(ol, e);
  }
  function Wz(e) {
    return $m(_i, e);
  }
  function Kz(e) {
    return km(nl, e);
  }
  function Gz(e) {
    return Cm($f, e);
  }
  function Yz(e) {
    return Mm(Ef, e);
  }
  var Xr = "2025-11-25";
  var yi = [Xr, "2025-06-18", "2025-03-26", "2024-11-05", "2024-10-07"],
    bi = "io.modelcontextprotocol/related-task",
    Tt = "io.modelcontextprotocol/protocolVersion",
    Qr = "io.modelcontextprotocol/clientInfo",
    Et = "io.modelcontextprotocol/serverInfo",
    hr = "io.modelcontextprotocol/clientCapabilities",
    kn = "io.modelcontextprotocol/subscriptionId",
    eo = "io.modelcontextprotocol/logLevel";
  var mr = "2.0";
  var Vt = En(() => O([c(), w(), k(), lr(), P(c(), Vt), S(Vt)])),
    de = P(c(), Vt),
    il = S(Vt),
    Cn = O([c(), w().int()]),
    In = c(),
    vi = m({
      ttl: w().optional()
    }),
    Ri = m({
      taskId: c()
    }),
    On = D({
      progressToken: Cn.optional(),
      [bi]: Ri.optional()
    }),
    be = m({
      _meta: On.optional()
    }),
    fr = be.extend({
      task: vi.optional()
    }),
    pe = m({
      method: c(),
      params: be.loose().optional()
    }),
    $e = m({
      _meta: On.optional()
    }),
    Te = m({
      method: c(),
      params: $e.loose().optional()
    }),
    Nn = D({
      get [Et]() {
        return oo.optional().catch(void 0);
      }
    }),
    he = D({
      _meta: Nn.optional()
    }),
    Ht = O([c(), w().int()]),
    An = m({
      jsonrpc: _(mr),
      id: Ht,
      ...pe.shape
    }).strict(),
    Mn = m({
      jsonrpc: _(mr),
      ...Te.shape
    }).strict(),
    to = m({
      jsonrpc: _(mr),
      id: Ht,
      result: he
    }).strict(),
    ro = m({
      jsonrpc: _(mr),
      id: Ht.optional(),
      error: m({
        code: w().int(),
        message: c(),
        data: j().optional()
      })
    }).strict(),
    kt = O([An, Mn, to, ro]),
    al = O([to, ro]),
    qn = he.strict(),
    wi = $e.extend({
      requestId: Ht.optional(),
      reason: c().optional()
    }),
    jn = Te.extend({
      method: _("notifications/cancelled"),
      params: wi
    }),
    xi = m({
      src: c(),
      mimeType: c().optional(),
      sizes: S(c()).optional(),
      theme: B(["light", "dark"]).optional()
    }),
    Jt = m({
      icons: S(xi).optional()
    }),
    $t = m({
      name: c(),
      title: c().optional()
    }),
    oo = $t.extend({
      ...$t.shape,
      ...Jt.shape,
      version: c(),
      websiteUrl: c().optional(),
      description: c().optional()
    }),
    Qz = xt(m({
      applyDefaults: k().optional()
    }), de),
    ey = dr(e => e && typeof e == "object" && !Array.isArray(e) && Object.keys(e).length === 0 ? {
      form: {}
    } : e, xt(m({
      form: Qz.optional(),
      url: de.optional()
    }), de.optional())),
    Pi = D({
      list: de.optional(),
      cancel: de.optional(),
      requests: D({
        sampling: D({
          createMessage: de.optional()
        }).optional(),
        elicitation: D({
          create: de.optional()
        }).optional()
      }).optional()
    }),
    $i = D({
      list: de.optional(),
      cancel: de.optional(),
      requests: D({
        tools: D({
          call: de.optional()
        }).optional()
      }).optional()
    }),
    Ti = m({
      experimental: P(c(), de).optional(),
      sampling: m({
        context: de.optional(),
        tools: de.optional()
      }).optional(),
      elicitation: ey.optional(),
      roots: m({
        listChanged: k().optional()
      }).optional(),
      tasks: Pi.optional(),
      extensions: P(c(), de).optional()
    }),
    Ei = be.extend({
      protocolVersion: c(),
      capabilities: Ti,
      clientInfo: oo
    }),
    Ln = pe.extend({
      method: _("initialize"),
      params: Ei
    }),
    Un = m({
      experimental: P(c(), de).optional(),
      logging: de.optional(),
      completions: de.optional(),
      prompts: m({
        listChanged: k().optional()
      }).optional(),
      resources: m({
        subscribe: k().optional(),
        listChanged: k().optional()
      }).optional(),
      tools: m({
        listChanged: k().optional()
      }).optional(),
      tasks: $i.optional(),
      extensions: P(c(), de).optional()
    }),
    ki = he.extend({
      protocolVersion: c(),
      capabilities: Un,
      serverInfo: oo,
      instructions: c().optional()
    }),
    Zn = Te.extend({
      method: _("notifications/initialized"),
      params: $e.optional()
    }),
    Ci = pe.extend({
      method: _("server/discover"),
      params: be.optional()
    }),
    gr = he.extend({
      supportedVersions: S(c()),
      capabilities: Un,
      instructions: c().optional()
    }),
    Dn = pe.extend({
      method: _("ping"),
      params: be.optional()
    }),
    Ii = m({
      progress: w(),
      total: q(w()),
      message: q(c())
    }),
    Oi = m({
      ...$e.shape,
      ...Ii.shape,
      progressToken: Cn
    }),
    Fn = Te.extend({
      method: _("notifications/progress"),
      params: Oi
    }),
    Ni = be.extend({
      cursor: In.optional()
    }),
    Bt = pe.extend({
      params: Ni.optional()
    }),
    Wt = he.extend({
      nextCursor: In.optional()
    }),
    Vn = m({
      uri: c(),
      mimeType: q(c()),
      _meta: P(c(), j()).optional()
    }),
    Hn = Vn.extend({
      text: c()
    }),
    cl = c().refine(e => {
      try {
        return atob(e), !0;
      } catch {
        return !1;
      }
    }, {
      message: "Invalid Base64 string"
    }),
    Jn = Vn.extend({
      blob: cl
    }),
    Kt = B(["user", "assistant"]),
    Ct = m({
      audience: S(Kt).optional(),
      priority: w().min(0).max(1).optional(),
      lastModified: Pt.datetime({
        offset: !0
      }).optional()
    }),
    Bn = m({
      ...$t.shape,
      ...Jt.shape,
      uri: c(),
      description: q(c()),
      mimeType: q(c()),
      size: q(w()),
      annotations: Ct.optional(),
      _meta: q(D({}))
    }),
    Ai = m({
      ...$t.shape,
      ...Jt.shape,
      uriTemplate: c(),
      description: q(c()),
      mimeType: q(c()),
      annotations: Ct.optional(),
      _meta: q(D({}))
    }),
    Mi = Bt.extend({
      method: _("resources/list")
    }),
    qi = Wt.extend({
      resources: S(Bn)
    }),
    ji = Bt.extend({
      method: _("resources/templates/list")
    }),
    Li = Wt.extend({
      resourceTemplates: S(Ai)
    }),
    no = be.extend({
      uri: c()
    }),
    Ui = no,
    Zi = pe.extend({
      method: _("resources/read"),
      params: Ui
    }),
    Di = he.extend({
      contents: S(O([Hn, Jn]))
    }),
    Fi = Te.extend({
      method: _("notifications/resources/list_changed"),
      params: $e.optional()
    }),
    Vi = no,
    Hi = pe.extend({
      method: _("resources/subscribe"),
      params: Vi
    }),
    Ji = no,
    Bi = pe.extend({
      method: _("resources/unsubscribe"),
      params: Ji
    }),
    Wn = m({
      toolsListChanged: k().optional(),
      promptsListChanged: k().optional(),
      resourcesListChanged: k().optional(),
      resourceSubscriptions: S(c()).optional()
    }),
    Wi = be.extend({
      notifications: Wn
    }),
    Ki = pe.extend({
      method: _("subscriptions/listen"),
      params: Wi
    }),
    Gi = $e.extend({
      notifications: Wn
    }),
    Yi = Te.extend({
      method: _("notifications/subscriptions/acknowledged"),
      params: Gi
    }),
    Xi = Nn.extend({
      [kn]: Ht
    }),
    Qi = he.extend({
      _meta: Xi
    }),
    ea = $e.extend({
      uri: c()
    }),
    ta = Te.extend({
      method: _("notifications/resources/updated"),
      params: ea
    }),
    ra = m({
      name: c(),
      description: q(c()),
      required: q(k())
    }),
    oa = m({
      ...$t.shape,
      ...Jt.shape,
      description: q(c()),
      arguments: q(S(ra)),
      _meta: q(D({}))
    }),
    na = Bt.extend({
      method: _("prompts/list")
    }),
    sa = Wt.extend({
      prompts: S(oa)
    }),
    ia = be.extend({
      name: c(),
      arguments: P(c(), c()).optional()
    }),
    aa = pe.extend({
      method: _("prompts/get"),
      params: ia
    }),
    so = m({
      type: _("text"),
      text: c(),
      annotations: Ct.optional(),
      _meta: P(c(), j()).optional()
    }),
    io = m({
      type: _("image"),
      data: cl,
      mimeType: c(),
      annotations: Ct.optional(),
      _meta: P(c(), j()).optional()
    }),
    ao = m({
      type: _("audio"),
      data: cl,
      mimeType: c(),
      annotations: Ct.optional(),
      _meta: P(c(), j()).optional()
    }),
    ca = m({
      type: _("tool_use"),
      name: c(),
      id: c(),
      input: P(c(), j()),
      _meta: P(c(), j()).optional()
    }),
    ua = m({
      type: _("resource"),
      resource: O([Hn, Jn]),
      annotations: Ct.optional(),
      _meta: P(c(), j()).optional()
    }),
    la = Bn.extend({
      type: _("resource_link")
    }),
    co = O([so, io, ao, la, ua]),
    da = m({
      role: Kt,
      content: co
    }),
    pa = he.extend({
      description: c().optional(),
      messages: S(da)
    }),
    ha = Te.extend({
      method: _("notifications/prompts/list_changed"),
      params: $e.optional()
    }),
    ma = m({
      title: c().optional(),
      readOnlyHint: k().optional(),
      destructiveHint: k().optional(),
      idempotentHint: k().optional(),
      openWorldHint: k().optional()
    }),
    fa = m({
      taskSupport: B(["required", "optional", "forbidden"]).optional()
    }),
    Kn = m({
      ...$t.shape,
      ...Jt.shape,
      description: c().optional(),
      inputSchema: m({
        type: _("object"),
        properties: P(c(), Vt).optional(),
        required: S(c()).optional()
      }).catchall(j()),
      outputSchema: D({
        $schema: c().optional()
      }).optional(),
      annotations: ma.optional(),
      execution: fa.optional(),
      _meta: P(c(), j()).optional()
    }),
    ga = Bt.extend({
      method: _("tools/list")
    }),
    Sa = Wt.extend({
      tools: S(Kn)
    }),
    Gn = he.extend({
      content: S(co).default([]),
      structuredContent: j().optional(),
      isError: k().optional()
    }),
    ul = Gn.or(he.extend({
      toolResult: j()
    })),
    _a = fr.extend({
      name: c(),
      arguments: P(c(), j()).optional()
    }),
    za = pe.extend({
      method: _("tools/call"),
      params: _a
    }),
    ya = Te.extend({
      method: _("notifications/tools/list_changed"),
      params: $e.optional()
    }),
    Yn = m({
      autoRefresh: k().default(!0),
      debounceMs: w().int().nonnegative().default(300)
    }),
    Xn = B(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]),
    ba = be.extend({
      level: Xn
    }),
    va = pe.extend({
      method: _("logging/setLevel"),
      params: ba
    }),
    Ra = $e.extend({
      level: Xn,
      logger: c().optional(),
      data: j()
    }),
    wa = Te.extend({
      method: _("notifications/message"),
      params: Ra
    }),
    xa = m({
      name: c().optional()
    }),
    Pa = m({
      hints: S(xa).optional(),
      costPriority: w().min(0).max(1).optional(),
      speedPriority: w().min(0).max(1).optional(),
      intelligencePriority: w().min(0).max(1).optional()
    }),
    $a = m({
      mode: B(["auto", "required", "none"]).optional()
    }),
    Ta = m({
      type: _("tool_result"),
      toolUseId: c().describe("The unique identifier for the corresponding tool call."),
      content: S(co),
      structuredContent: j().optional(),
      isError: k().optional(),
      _meta: P(c(), j()).optional()
    }),
    Ea = Yr("type", [so, io, ao]),
    pr = Yr("type", [so, io, ao, ca, Ta]),
    ka = m({
      role: Kt,
      content: O([pr, S(pr)]),
      _meta: P(c(), j()).optional()
    }),
    Ca = fr.extend({
      messages: S(ka),
      modelPreferences: Pa.optional(),
      systemPrompt: c().optional(),
      includeContext: B(["none", "thisServer", "allServers"]).optional(),
      temperature: w().optional(),
      maxTokens: w().int(),
      stopSequences: S(c()).optional(),
      metadata: de.optional(),
      tools: S(Kn).optional(),
      toolChoice: $a.optional()
    }),
    Ia = pe.extend({
      method: _("sampling/createMessage"),
      params: Ca
    }),
    Oa = he.extend({
      model: c(),
      stopReason: q(B(["endTurn", "stopSequence", "maxTokens"]).or(c())),
      role: Kt,
      content: Ea
    }),
    Na = he.extend({
      model: c(),
      stopReason: q(B(["endTurn", "stopSequence", "maxTokens", "toolUse"]).or(c())),
      role: Kt,
      content: O([pr, S(pr)])
    }),
    Qn = m({
      type: _("boolean"),
      title: c().optional(),
      description: c().optional(),
      default: k().optional()
    }),
    uo = m({
      type: _("string"),
      title: c().optional(),
      description: c().optional(),
      minLength: w().optional(),
      maxLength: w().optional(),
      format: B(["email", "uri", "date", "date-time"]).optional(),
      default: c().optional()
    }),
    lo = m({
      type: B(["number", "integer"]),
      title: c().optional(),
      description: c().optional(),
      minimum: w().optional(),
      maximum: w().optional(),
      default: w().optional()
    }),
    es = m({
      type: _("string"),
      title: c().optional(),
      description: c().optional(),
      enum: S(c()),
      default: c().optional()
    }),
    ts = m({
      type: _("string"),
      title: c().optional(),
      description: c().optional(),
      oneOf: S(m({
        const: c(),
        title: c()
      })),
      default: c().optional()
    }),
    rs = m({
      type: _("string"),
      title: c().optional(),
      description: c().optional(),
      enum: S(c()),
      enumNames: S(c()).optional(),
      default: c().optional()
    }),
    Aa = O([es, ts]),
    os = m({
      type: _("array"),
      title: c().optional(),
      description: c().optional(),
      minItems: w().optional(),
      maxItems: w().optional(),
      items: m({
        type: _("string"),
        enum: S(c())
      }),
      default: S(c()).optional()
    }),
    ns = m({
      type: _("array"),
      title: c().optional(),
      description: c().optional(),
      minItems: w().optional(),
      maxItems: w().optional(),
      items: m({
        anyOf: S(m({
          const: c(),
          title: c()
        }))
      }),
      default: S(c()).optional()
    }),
    Ma = O([os, ns]),
    qa = O([rs, Aa, Ma]),
    ss = O([qa, Qn, uo, lo]),
    po = fr.extend({
      mode: _("form").optional(),
      message: c(),
      requestedSchema: m({
        type: _("object"),
        properties: P(c(), ss),
        required: S(c()).optional()
      }).catchall(j())
    }),
    ja = fr.extend({
      mode: _("url"),
      message: c(),
      elicitationId: c(),
      url: c().url()
    }),
    La = O([po, ja]),
    Ua = pe.extend({
      method: _("elicitation/create"),
      params: La
    }),
    Za = $e.extend({
      elicitationId: c()
    }),
    Da = Te.extend({
      method: _("notifications/elicitation/complete"),
      params: Za
    }),
    Fa = he.extend({
      action: B(["accept", "decline", "cancel"]),
      content: dr(e => e === null ? void 0 : e, P(c(), O([c(), w(), k(), S(c())])).optional())
    }),
    Va = m({
      type: _("ref/resource"),
      uri: c()
    }),
    Ha = m({
      type: _("ref/prompt"),
      name: c()
    }),
    Ja = be.extend({
      ref: O([Ha, Va]),
      argument: m({
        name: c(),
        value: c()
      }),
      context: m({
        arguments: P(c(), c()).optional()
      }).optional()
    }),
    Ba = pe.extend({
      method: _("completion/complete"),
      params: Ja
    }),
    Wa = he.extend({
      completion: D({
        values: S(c()).max(100),
        total: q(w().int()),
        hasMore: q(k())
      })
    }),
    Ka = m({
      uri: c().startsWith("file://"),
      name: c().optional(),
      _meta: P(c(), j()).optional()
    }),
    Ga = pe.extend({
      method: _("roots/list"),
      params: be.optional()
    }),
    Ya = he.extend({
      roots: S(Ka)
    }),
    Xa = Te.extend({
      method: _("notifications/roots/list_changed"),
      params: $e.optional()
    }),
    ll = D({
      ttl: w().optional(),
      pollInterval: w().optional()
    }),
    Qa = B(["working", "input_required", "completed", "failed", "cancelled"]),
    Gt = m({
      taskId: c(),
      status: Qa,
      ttl: O([w(), lr()]),
      createdAt: c(),
      lastUpdatedAt: c(),
      pollInterval: q(w()),
      statusMessage: q(c())
    }),
    dl = he.extend({
      task: Gt
    }),
    ec = $e.merge(Gt),
    pl = Te.extend({
      method: _("notifications/tasks/status"),
      params: ec
    }),
    hl = pe.extend({
      method: _("tasks/get"),
      params: be.extend({
        taskId: c()
      })
    }),
    ml = he.merge(Gt),
    fl = pe.extend({
      method: _("tasks/result"),
      params: be.extend({
        taskId: c()
      })
    }),
    gl = he.loose(),
    Sl = Bt.extend({
      method: _("tasks/list")
    }),
    _l = Wt.extend({
      tasks: S(Gt)
    }),
    zl = pe.extend({
      method: _("tasks/cancel"),
      params: be.extend({
        taskId: c()
      })
    }),
    yl = he.merge(Gt),
    bl = O([Dn, Ln, Ci, Ba, va, aa, na, Mi, ji, Zi, Hi, Bi, Ki, za, ga]),
    vl = O([jn, Fn, Zn, Xa]),
    Rl = O([qn, Oa, Na, Fa, Ya]),
    wl = O([Dn, Ia, Ua, Ga]),
    xl = O([jn, Fn, wa, ta, Fi, ya, ha, Yi, Da]),
    Pl = O([qn, ki, gr, Wa, pa, sa, qi, Li, Di, Gn, Sa, Qi]),
    ye = Si().superRefine((e, t) => {
      if (!URL.canParse(e)) return t.addIssue({
        code: jf.custom,
        message: "URL must be parseable",
        fatal: !0
      }), Dc;
    }).refine(e => {
      let t = new URL(e);
      return t.protocol !== "javascript:" && t.protocol !== "data:" && t.protocol !== "vbscript:";
    }, {
      message: "URL cannot use javascript:, data:, or vbscript: scheme"
    }),
    is = D({
      resource: c().url(),
      authorization_servers: S(ye).optional(),
      jwks_uri: c().url().optional(),
      scopes_supported: S(c()).optional(),
      bearer_methods_supported: S(c()).optional(),
      resource_signing_alg_values_supported: S(c()).optional(),
      resource_name: c().optional(),
      resource_documentation: c().optional(),
      resource_policy_uri: c().url().optional(),
      resource_tos_uri: c().url().optional(),
      tls_client_certificate_bound_access_tokens: k().optional(),
      authorization_details_types_supported: S(c()).optional(),
      dpop_signing_alg_values_supported: S(c()).optional(),
      dpop_bound_access_tokens_required: k().optional()
    }),
    ho = D({
      issuer: c(),
      authorization_endpoint: ye,
      token_endpoint: ye,
      registration_endpoint: ye.optional(),
      scopes_supported: S(c()).optional(),
      response_types_supported: S(c()),
      response_modes_supported: S(c()).optional(),
      grant_types_supported: S(c()).optional(),
      token_endpoint_auth_methods_supported: S(c()).optional(),
      token_endpoint_auth_signing_alg_values_supported: S(c()).optional(),
      service_documentation: ye.optional(),
      revocation_endpoint: ye.optional(),
      revocation_endpoint_auth_methods_supported: S(c()).optional(),
      revocation_endpoint_auth_signing_alg_values_supported: S(c()).optional(),
      introspection_endpoint: c().optional(),
      introspection_endpoint_auth_methods_supported: S(c()).optional(),
      introspection_endpoint_auth_signing_alg_values_supported: S(c()).optional(),
      code_challenge_methods_supported: S(c()).optional(),
      client_id_metadata_document_supported: k().optional(),
      authorization_response_iss_parameter_supported: k().optional().catch(void 0)
    }),
    tc = D({
      issuer: c(),
      authorization_endpoint: ye,
      token_endpoint: ye,
      userinfo_endpoint: ye.optional(),
      jwks_uri: ye,
      registration_endpoint: ye.optional(),
      scopes_supported: S(c()).optional(),
      response_types_supported: S(c()),
      response_modes_supported: S(c()).optional(),
      grant_types_supported: S(c()).optional(),
      acr_values_supported: S(c()).optional(),
      subject_types_supported: S(c()),
      id_token_signing_alg_values_supported: S(c()),
      id_token_encryption_alg_values_supported: S(c()).optional(),
      id_token_encryption_enc_values_supported: S(c()).optional(),
      userinfo_signing_alg_values_supported: S(c()).optional(),
      userinfo_encryption_alg_values_supported: S(c()).optional(),
      userinfo_encryption_enc_values_supported: S(c()).optional(),
      request_object_signing_alg_values_supported: S(c()).optional(),
      request_object_encryption_alg_values_supported: S(c()).optional(),
      request_object_encryption_enc_values_supported: S(c()).optional(),
      token_endpoint_auth_methods_supported: S(c()).optional(),
      token_endpoint_auth_signing_alg_values_supported: S(c()).optional(),
      display_values_supported: S(c()).optional(),
      claim_types_supported: S(c()).optional(),
      claims_supported: S(c()).optional(),
      service_documentation: c().optional(),
      claims_locales_supported: S(c()).optional(),
      ui_locales_supported: S(c()).optional(),
      claims_parameter_supported: k().optional(),
      request_parameter_supported: k().optional(),
      request_uri_parameter_supported: k().optional(),
      require_request_uri_registration: k().optional(),
      op_policy_uri: ye.optional(),
      op_tos_uri: ye.optional(),
      client_id_metadata_document_supported: k().optional(),
      authorization_response_iss_parameter_supported: k().optional().catch(void 0)
    }),
    as = m({
      ...tc.shape,
      ...ho.pick({
        code_challenge_methods_supported: !0
      }).shape
    }),
    cs = m({
      access_token: c(),
      id_token: c().optional(),
      token_type: c(),
      expires_in: zi.number().optional(),
      scope: c().optional(),
      refresh_token: c().optional()
    }).strip(),
    rc = m({
      issued_token_type: _("urn:ietf:params:oauth:token-type:id-jag"),
      access_token: c(),
      token_type: c().optional(),
      expires_in: w().optional(),
      scope: c().optional()
    }).strip(),
    us = m({
      error: c(),
      error_description: c().optional(),
      error_uri: c().optional()
    }),
    sl = ye.optional().or(_("").transform(() => {})),
    oc = m({
      redirect_uris: S(ye),
      token_endpoint_auth_method: c().optional(),
      grant_types: S(c()).optional(),
      response_types: S(c()).optional(),
      application_type: c().optional(),
      client_name: c().optional(),
      client_uri: ye.optional(),
      logo_uri: sl,
      scope: c().optional(),
      contacts: S(c()).optional(),
      tos_uri: sl,
      policy_uri: c().optional(),
      jwks_uri: ye.optional(),
      jwks: Tf().optional(),
      software_id: c().optional(),
      software_version: c().optional(),
      software_statement: c().optional()
    }).strip(),
    nc = m({
      client_id: c(),
      client_secret: c().optional(),
      client_id_issued_at: w().optional(),
      client_secret_expires_at: w().optional()
    }).strip(),
    ls = oc.merge(nc),
    $l = m({
      error: c(),
      error_description: c().optional()
    }).strip(),
    Tl = m({
      token: c(),
      token_type_hint: c().optional()
    }).strip();
  var Ol = Symbol.for("mcp.sdk.errorBrands");
  function yr(e, t) {
    let r = new Set(),
      o = t;
    for (; typeof o == "function";) {
      let n = o.mcpBrand;
      Object.prototype.hasOwnProperty.call(o, "mcpBrand") && typeof n == "string" && r.add(n);
      o = Object.getPrototypeOf(o);
    }
    r.size !== 0 && Object.defineProperty(e, Ol, {
      value: r,
      enumerable: !1,
      configurable: !0
    });
  }
  function Ke(e, t) {
    try {
      if (typeof t == "object" && t !== null && Object.prototype.hasOwnProperty.call(e, "mcpBrand") && typeof e.mcpBrand == "string" && Object.prototype.hasOwnProperty.call(t, Ol)) {
        let r = t[Ol];
        if (r && typeof r.has == "function" && r.has(e.mcpBrand)) return !0;
      }
    } catch {}
    return Function.prototype[Symbol.hasInstance].call(e, t);
  }
  var br = function (e) {
      return e.InvalidRequest = "invalid_request", e.InvalidClient = "invalid_client", e.InvalidGrant = "invalid_grant", e.UnauthorizedClient = "unauthorized_client", e.UnsupportedGrantType = "unsupported_grant_type", e.InvalidScope = "invalid_scope", e.AccessDenied = "access_denied", e.ServerError = "server_error", e.TemporarilyUnavailable = "temporarily_unavailable", e.UnsupportedResponseType = "unsupported_response_type", e.UnsupportedTokenType = "unsupported_token_type", e.InvalidToken = "invalid_token", e.MethodNotAllowed = "method_not_allowed", e.TooManyRequests = "too_many_requests", e.InvalidClientMetadata = "invalid_client_metadata", e.InvalidRedirectUri = "invalid_redirect_uri", e.InsufficientScope = "insufficient_scope", e.InvalidTarget = "invalid_target", e;
    }({}),
    Sr,
    vr = (Sr = class extends Error {
      static [Symbol.hasInstance](t) {
        return Ke(this, t);
      }
      static isInstance(t) {
        if (typeof this != "function") throw new TypeError("isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)`");
        return Ke(this, t);
      }
      constructor(t, r, o) {
        super(r);
        this.code = t;
        this.errorUri = o;
        this.name = "OAuthError";
        yr(this, new.target);
      }
      toResponseObject() {
        let t = {
          error: this.code,
          error_description: this.message
        };
        return this.errorUri && (t.error_uri = this.errorUri), t;
      }
      static fromResponse(t) {
        return new Sr(t.error, t.error_description ?? t.error, t.error_uri);
      }
    }, Object.defineProperty(Sr, "mcpBrand", {
      value: "mcp.OAuthError"
    }), Sr),
    N = function (e) {
      return e.NotConnected = "NOT_CONNECTED", e.AlreadyConnected = "ALREADY_CONNECTED", e.NotInitialized = "NOT_INITIALIZED", e.CapabilityNotSupported = "CAPABILITY_NOT_SUPPORTED", e.RequestTimeout = "REQUEST_TIMEOUT", e.ConnectionClosed = "CONNECTION_CLOSED", e.SendFailed = "SEND_FAILED", e.InvalidResult = "INVALID_RESULT", e.UnsupportedResultType = "UNSUPPORTED_RESULT_TYPE", e.InputRequiredRoundsExceeded = "INPUT_REQUIRED_ROUNDS_EXCEEDED", e.ListPaginationExceeded = "LIST_PAGINATION_EXCEEDED", e.MethodNotSupportedByProtocolVersion = "METHOD_NOT_SUPPORTED_BY_PROTOCOL_VERSION", e.EraNegotiationFailed = "ERA_NEGOTIATION_FAILED", e.ClientHttpNotImplemented = "CLIENT_HTTP_NOT_IMPLEMENTED", e.ClientHttpAuthentication = "CLIENT_HTTP_AUTHENTICATION", e.ClientHttpForbidden = "CLIENT_HTTP_FORBIDDEN", e.ClientHttpUnexpectedContent = "CLIENT_HTTP_UNEXPECTED_CONTENT", e.ClientHttpFailedToOpenStream = "CLIENT_HTTP_FAILED_TO_OPEN_STREAM", e.ClientHttpFailedToTerminateSession = "CLIENT_HTTP_FAILED_TO_TERMINATE_SESSION", e;
    }({}),
    fo,
    A = (fo = class extends Error {
      static [Symbol.hasInstance](t) {
        return Ke(this, t);
      }
      static isInstance(t) {
        if (typeof this != "function") throw new TypeError("isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)`");
        return Ke(this, t);
      }
      constructor(t, r, o) {
        super(r);
        this.code = t;
        this.data = o;
        this.name = "SdkError";
        yr(this, new.target);
      }
    }, Object.defineProperty(fo, "mcpBrand", {
      value: "mcp.SdkError"
    }), fo),
    go,
    st = (go = class extends A {
      constructor(t, r, o) {
        super(t, r, o);
        this.name = "SdkHttpError";
      }
      get status() {
        return this.data.status;
      }
      get statusText() {
        return this.data.statusText;
      }
    }, Object.defineProperty(go, "mcpBrand", {
      value: "mcp.SdkHttpError"
    }), go);
  function sg(e) {
    let t = typeof e == "string" ? new URL(e) : new URL(e.href);
    return t.hash = "", t;
  }
  function ig({
    requestedResource: e,
    configuredResource: t
  }) {
    let r = typeof e == "string" ? new URL(e) : new URL(e.href),
      o = typeof t == "string" ? new URL(t) : new URL(t.href);
    if (r.origin !== o.origin || r.pathname.length < o.pathname.length) return !1;
    let n = r.pathname.endsWith("/") ? r.pathname : r.pathname + "/",
      s = o.pathname.endsWith("/") ? o.pathname : o.pathname + "/";
    return n.startsWith(s);
  }
  var ag = "2026-07-28",
    jl = [ag];
  function Ot(e) {
    return e >= ag;
  }
  function Ll(e) {
    return e.filter(t => !Ot(t));
  }
  function Ss(e) {
    return e.filter(t => Ot(t));
  }
  function cg(e) {
    let t = e.structuredContent;
    return t === void 0 || !(typeof t != "object" || t === null || Array.isArray(t)) || (e.content?.some(r => r.type === "text") ?? !1) ? e : {
      ...e,
      content: [...(e.content ?? []), {
        type: "text",
        text: JSON.stringify(t)
      }]
    };
  }
  var ug = ["task", "inputRequests", "requestState"];
  function ty(e) {
    return e === null || typeof e != "object" || Array.isArray(e) || e.content !== void 0 || ug.some(t => t in e) ? e : {
      ...e,
      content: []
    };
  }
  function ry() {
    let e = En(() => O([c(), w(), k(), lr(), P(c(), e), S(e)])),
      t = P(c(), e),
      r = O([c(), w().int()]),
      o = c(),
      n = m({
        ttl: w().optional()
      }),
      s = m({
        taskId: c()
      }),
      i = D({
        progressToken: r.optional(),
        "io.modelcontextprotocol/related-task": s.optional()
      }),
      a = m({
        _meta: i.optional()
      }),
      u = a.extend({
        task: n.optional()
      }),
      l = m({
        method: c(),
        params: a.loose().optional()
      }),
      d = m({
        _meta: i.optional()
      }),
      p = m({
        method: c(),
        params: d.loose().optional()
      }),
      h = D({
        _meta: i.optional()
      }),
      f = O([c(), w().int()]),
      g = h.strict(),
      y = d.extend({
        requestId: f.optional(),
        reason: c().optional()
      }),
      b = p.extend({
        method: _("notifications/cancelled"),
        params: y
      }),
      T = m({
        src: c(),
        mimeType: c().optional(),
        sizes: S(c()).optional(),
        theme: B(["light", "dark"]).optional()
      }),
      L = m({
        icons: S(T).optional()
      }),
      U = m({
        name: c(),
        title: c().optional()
      }),
      te = U.extend({
        ...U.shape,
        ...L.shape,
        version: c(),
        websiteUrl: c().optional(),
        description: c().optional()
      }),
      x = xt(m({
        applyDefaults: k().optional()
      }), t),
      v = dr(Pe => Pe && typeof Pe == "object" && !Array.isArray(Pe) && Object.keys(Pe).length === 0 ? {
        form: {}
      } : Pe, xt(m({
        form: x.optional(),
        url: t.optional()
      }), t.optional())),
      C = D({
        list: t.optional(),
        cancel: t.optional(),
        requests: D({
          sampling: D({
            createMessage: t.optional()
          }).optional(),
          elicitation: D({
            create: t.optional()
          }).optional()
        }).optional()
      }),
      ee = D({
        list: t.optional(),
        cancel: t.optional(),
        requests: D({
          tools: D({
            call: t.optional()
          }).optional()
        }).optional()
      }),
      K = m({
        experimental: P(c(), t).optional(),
        sampling: m({
          context: t.optional(),
          tools: t.optional()
        }).optional(),
        elicitation: v.optional(),
        roots: m({
          listChanged: k().optional()
        }).optional(),
        tasks: C.optional(),
        extensions: P(c(), t).optional()
      }),
      ie = a.extend({
        protocolVersion: c(),
        capabilities: K,
        clientInfo: te
      }),
      Y = l.extend({
        method: _("initialize"),
        params: ie
      }),
      _e = m({
        experimental: P(c(), t).optional(),
        logging: t.optional(),
        completions: t.optional(),
        prompts: m({
          listChanged: k().optional()
        }).optional(),
        resources: m({
          subscribe: k().optional(),
          listChanged: k().optional()
        }).optional(),
        tools: m({
          listChanged: k().optional()
        }).optional(),
        tasks: ee.optional(),
        extensions: P(c(), t).optional()
      }),
      Ge = h.extend({
        protocolVersion: c(),
        capabilities: _e,
        serverInfo: te,
        instructions: c().optional()
      }),
      ve = p.extend({
        method: _("notifications/initialized"),
        params: d.optional()
      }),
      ke = l.extend({
        method: _("ping"),
        params: a.optional()
      }),
      ct = m({
        progress: w(),
        total: q(w()),
        message: q(c())
      }),
      Ae = m({
        ...d.shape,
        ...ct.shape,
        progressToken: r
      }),
      Ye = p.extend({
        method: _("notifications/progress"),
        params: Ae
      }),
      ut = a.extend({
        cursor: o.optional()
      }),
      Fe = l.extend({
        params: ut.optional()
      }),
      Ce = h.extend({
        nextCursor: o.optional()
      }),
      _t = m({
        uri: c(),
        mimeType: q(c()),
        _meta: P(c(), j()).optional()
      }),
      zt = _t.extend({
        text: c()
      }),
      lt = c().refine(Pe => {
        try {
          return atob(Pe), !0;
        } catch {
          return !1;
        }
      }, {
        message: "Invalid Base64 string"
      }),
      we = _t.extend({
        blob: lt
      }),
      Ie = B(["user", "assistant"]),
      Oe = m({
        audience: S(Ie).optional(),
        priority: w().min(0).max(1).optional(),
        lastModified: Pt.datetime({
          offset: !0
        }).optional()
      }),
      rt = m({
        ...U.shape,
        ...L.shape,
        uri: c(),
        description: q(c()),
        mimeType: q(c()),
        size: q(w()),
        annotations: Oe.optional(),
        _meta: q(D({}))
      }),
      Xt = m({
        ...U.shape,
        ...L.shape,
        uriTemplate: c(),
        description: q(c()),
        mimeType: q(c()),
        annotations: Oe.optional(),
        _meta: q(D({}))
      }),
      Ve = Fe.extend({
        method: _("resources/list")
      }),
      He = Ce.extend({
        resources: S(rt)
      }),
      Me = Fe.extend({
        method: _("resources/templates/list")
      }),
      Xe = Ce.extend({
        resourceTemplates: S(Xt)
      }),
      Qe = a.extend({
        uri: c()
      }),
      dt = Qe,
      pt = l.extend({
        method: _("resources/read"),
        params: dt
      }),
      At = h.extend({
        contents: S(O([zt, we]))
      }),
      ht = p.extend({
        method: _("notifications/resources/list_changed"),
        params: d.optional()
      }),
      Qt = Qe,
      E = l.extend({
        method: _("resources/subscribe"),
        params: Qt
      }),
      mt = Qe,
      F = l.extend({
        method: _("resources/unsubscribe"),
        params: mt
      }),
      M = d.extend({
        uri: c()
      }),
      W = p.extend({
        method: _("notifications/resources/updated"),
        params: M
      }),
      I = m({
        name: c(),
        description: q(c()),
        required: q(k())
      }),
      $ = m({
        ...U.shape,
        ...L.shape,
        description: q(c()),
        arguments: q(S(I)),
        _meta: q(D({}))
      }),
      H = Fe.extend({
        method: _("prompts/list")
      }),
      V = Ce.extend({
        prompts: S($)
      }),
      fe = a.extend({
        name: c(),
        arguments: P(c(), c()).optional()
      }),
      er = l.extend({
        method: _("prompts/get"),
        params: fe
      }),
      ft = m({
        type: _("text"),
        text: c(),
        annotations: Oe.optional(),
        _meta: P(c(), j()).optional()
      }),
      tr = m({
        type: _("image"),
        data: lt,
        mimeType: c(),
        annotations: Oe.optional(),
        _meta: P(c(), j()).optional()
      }),
      rr = m({
        type: _("audio"),
        data: lt,
        mimeType: c(),
        annotations: Oe.optional(),
        _meta: P(c(), j()).optional()
      }),
      Mo = m({
        type: _("tool_use"),
        name: c(),
        id: c(),
        input: P(c(), j()),
        _meta: P(c(), j()).optional()
      }),
      Mt = m({
        type: _("resource"),
        resource: O([zt, we]),
        annotations: Oe.optional(),
        _meta: P(c(), j()).optional()
      }),
      qo = rt.extend({
        type: _("resource_link")
      }),
      et = O([ft, tr, rr, qo, Mt]),
      Er = m({
        role: Ie,
        content: et
      }),
      kr = h.extend({
        description: c().optional(),
        messages: S(Er)
      }),
      or = p.extend({
        method: _("notifications/prompts/list_changed"),
        params: d.optional()
      }),
      jo = m({
        title: c().optional(),
        readOnlyHint: k().optional(),
        destructiveHint: k().optional(),
        idempotentHint: k().optional(),
        openWorldHint: k().optional()
      }),
      Cr = m({
        taskSupport: B(["required", "optional", "forbidden"]).optional()
      }),
      nr = m({
        ...U.shape,
        ...L.shape,
        description: c().optional(),
        inputSchema: m({
          type: _("object"),
          properties: P(c(), e).optional(),
          required: S(c()).optional()
        }).catchall(j()),
        outputSchema: m({
          type: _("object"),
          properties: P(c(), e).optional(),
          required: S(c()).optional()
        }).catchall(j()).optional(),
        annotations: jo.optional(),
        execution: Cr.optional(),
        _meta: P(c(), j()).optional()
      }),
      Ir = Fe.extend({
        method: _("tools/list")
      }),
      Or = Ce.extend({
        tools: S(nr)
      }),
      Nr = h.extend({
        content: S(et),
        structuredContent: P(c(), j()).optional(),
        isError: k().optional()
      }),
      xe = u.extend({
        name: c(),
        arguments: P(c(), j()).optional()
      }),
      Lo = l.extend({
        method: _("tools/call"),
        params: xe
      }),
      xs = p.extend({
        method: _("notifications/tools/list_changed"),
        params: d.optional()
      }),
      Ar = B(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]),
      Uo = a.extend({
        level: Ar
      }),
      Zo = l.extend({
        method: _("logging/setLevel"),
        params: Uo
      }),
      Do = d.extend({
        level: Ar,
        logger: c().optional(),
        data: j()
      }),
      Fo = p.extend({
        method: _("notifications/message"),
        params: Do
      }),
      Vo = m({
        name: c().optional()
      }),
      Ho = m({
        hints: S(Vo).optional(),
        costPriority: w().min(0).max(1).optional(),
        speedPriority: w().min(0).max(1).optional(),
        intelligencePriority: w().min(0).max(1).optional()
      }),
      Jo = m({
        mode: B(["auto", "required", "none"]).optional()
      }),
      Ps = m({
        type: _("tool_result"),
        toolUseId: c().describe("The unique identifier for the corresponding tool call."),
        content: S(et),
        structuredContent: m({}).loose().optional(),
        isError: k().optional(),
        _meta: P(c(), j()).optional()
      }),
      Bo = Yr("type", [ft, tr, rr]),
      qt = Yr("type", [ft, tr, rr, Mo, Ps]),
      Wo = m({
        role: Ie,
        content: O([qt, S(qt)]),
        _meta: P(c(), j()).optional()
      }),
      Ko = u.extend({
        messages: S(Wo),
        modelPreferences: Ho.optional(),
        systemPrompt: c().optional(),
        includeContext: B(["none", "thisServer", "allServers"]).optional(),
        temperature: w().optional(),
        maxTokens: w().int(),
        stopSequences: S(c()).optional(),
        metadata: t.optional(),
        tools: S(nr).optional(),
        toolChoice: Jo.optional()
      }),
      Go = l.extend({
        method: _("sampling/createMessage"),
        params: Ko
      }),
      Yo = h.extend({
        model: c(),
        stopReason: q(B(["endTurn", "stopSequence", "maxTokens"]).or(c())),
        role: Ie,
        content: Bo
      }),
      Xo = h.extend({
        model: c(),
        stopReason: q(B(["endTurn", "stopSequence", "maxTokens", "toolUse"]).or(c())),
        role: Ie,
        content: O([qt, S(qt)])
      }),
      Qo = m({
        type: _("boolean"),
        title: c().optional(),
        description: c().optional(),
        default: k().optional()
      }),
      en = m({
        type: _("string"),
        title: c().optional(),
        description: c().optional(),
        minLength: w().optional(),
        maxLength: w().optional(),
        format: B(["email", "uri", "date", "date-time"]).optional(),
        default: c().optional()
      }),
      tn = m({
        type: B(["number", "integer"]),
        title: c().optional(),
        description: c().optional(),
        minimum: w().optional(),
        maximum: w().optional(),
        default: w().optional()
      }),
      rn = m({
        type: _("string"),
        title: c().optional(),
        description: c().optional(),
        enum: S(c()),
        default: c().optional()
      }),
      on = m({
        type: _("string"),
        title: c().optional(),
        description: c().optional(),
        oneOf: S(m({
          const: c(),
          title: c()
        })),
        default: c().optional()
      }),
      nn = m({
        type: _("string"),
        title: c().optional(),
        description: c().optional(),
        enum: S(c()),
        enumNames: S(c()).optional(),
        default: c().optional()
      }),
      sn = O([rn, on]),
      sr = m({
        type: _("array"),
        title: c().optional(),
        description: c().optional(),
        minItems: w().optional(),
        maxItems: w().optional(),
        items: m({
          type: _("string"),
          enum: S(c())
        }),
        default: S(c()).optional()
      }),
      ir = m({
        type: _("array"),
        title: c().optional(),
        description: c().optional(),
        minItems: w().optional(),
        maxItems: w().optional(),
        items: m({
          anyOf: S(m({
            const: c(),
            title: c()
          }))
        }),
        default: S(c()).optional()
      }),
      $s = O([sr, ir]),
      Ts = O([nn, sn, $s]),
      Je = O([Ts, Qo, en, tn]),
      Be = u.extend({
        mode: _("form").optional(),
        message: c(),
        requestedSchema: m({
          type: _("object"),
          properties: P(c(), Je),
          required: S(c()).optional()
        }).catchall(j())
      }),
      an = u.extend({
        mode: _("url"),
        message: c(),
        elicitationId: c(),
        url: c().url()
      }),
      ot = O([Be, an]),
      Es = l.extend({
        method: _("elicitation/create"),
        params: ot
      }),
      ks = d.extend({
        elicitationId: c()
      }),
      Cs = p.extend({
        method: _("notifications/elicitation/complete"),
        params: ks
      }),
      Is = h.extend({
        action: B(["accept", "decline", "cancel"]),
        content: dr(Pe => Pe === null ? void 0 : Pe, P(c(), O([c(), w(), k(), S(c())])).optional())
      }),
      Os = m({
        type: _("ref/resource"),
        uri: c()
      }),
      Ns = m({
        type: _("ref/prompt"),
        name: c()
      }),
      As = a.extend({
        ref: O([Ns, Os]),
        argument: m({
          name: c(),
          value: c()
        }),
        context: m({
          arguments: P(c(), c()).optional()
        }).optional()
      }),
      cn = l.extend({
        method: _("completion/complete"),
        params: As
      }),
      Ms = h.extend({
        completion: D({
          values: S(c()).max(100),
          total: q(w().int()),
          hasMore: q(k())
        })
      }),
      qs = m({
        uri: c().startsWith("file://"),
        name: c().optional(),
        _meta: P(c(), j()).optional()
      }),
      Mr = l.extend({
        method: _("roots/list"),
        params: a.optional()
      }),
      un = h.extend({
        roots: S(qs)
      }),
      js = p.extend({
        method: _("notifications/roots/list_changed"),
        params: d.optional()
      }),
      Ls = D({
        ttl: w().optional(),
        pollInterval: w().optional()
      }),
      Us = B(["working", "input_required", "completed", "failed", "cancelled"]),
      jt = m({
        taskId: c(),
        status: Us,
        ttl: O([w(), lr()]),
        createdAt: c(),
        lastUpdatedAt: c(),
        pollInterval: q(w()),
        statusMessage: q(c())
      }),
      qe = h.extend({
        task: jt
      }),
      Zs = d.merge(jt),
      ar = p.extend({
        method: _("notifications/tasks/status"),
        params: Zs
      }),
      qr = l.extend({
        method: _("tasks/get"),
        params: a.extend({
          taskId: c()
        })
      }),
      jr = h.merge(jt),
      Lr = l.extend({
        method: _("tasks/result"),
        params: a.extend({
          taskId: c()
        })
      }),
      wc = h.loose(),
      je = Fe.extend({
        method: _("tasks/list")
      }),
      me = Ce.extend({
        tasks: S(jt)
      }),
      cr = l.extend({
        method: _("tasks/cancel"),
        params: a.extend({
          taskId: c()
        })
      });
    return {
      JSONValueSchema: e,
      JSONObjectSchema: t,
      ProgressTokenSchema: r,
      CursorSchema: o,
      TaskMetadataSchema: n,
      RelatedTaskMetadataSchema: s,
      RequestMetaSchema: i,
      BaseRequestParamsSchema: a,
      TaskAugmentedRequestParamsSchema: u,
      RequestSchema: l,
      NotificationsParamsSchema: d,
      NotificationSchema: p,
      ResultSchema: h,
      RequestIdSchema: f,
      EmptyResultSchema: g,
      CancelledNotificationParamsSchema: y,
      CancelledNotificationSchema: b,
      IconSchema: T,
      IconsSchema: L,
      BaseMetadataSchema: U,
      ImplementationSchema: te,
      ClientTasksCapabilitySchema: C,
      ServerTasksCapabilitySchema: ee,
      ClientCapabilitiesSchema: K,
      InitializeRequestParamsSchema: ie,
      InitializeRequestSchema: Y,
      ServerCapabilitiesSchema: _e,
      InitializeResultSchema: Ge,
      InitializedNotificationSchema: ve,
      PingRequestSchema: ke,
      ProgressSchema: ct,
      ProgressNotificationParamsSchema: Ae,
      ProgressNotificationSchema: Ye,
      PaginatedRequestParamsSchema: ut,
      PaginatedRequestSchema: Fe,
      PaginatedResultSchema: Ce,
      ResourceContentsSchema: _t,
      TextResourceContentsSchema: zt,
      BlobResourceContentsSchema: we,
      RoleSchema: Ie,
      AnnotationsSchema: Oe,
      ResourceSchema: rt,
      ResourceTemplateSchema: Xt,
      ListResourcesRequestSchema: Ve,
      ListResourcesResultSchema: He,
      ListResourceTemplatesRequestSchema: Me,
      ListResourceTemplatesResultSchema: Xe,
      ResourceRequestParamsSchema: Qe,
      ReadResourceRequestParamsSchema: dt,
      ReadResourceRequestSchema: pt,
      ReadResourceResultSchema: At,
      ResourceListChangedNotificationSchema: ht,
      SubscribeRequestParamsSchema: Qt,
      SubscribeRequestSchema: E,
      UnsubscribeRequestParamsSchema: mt,
      UnsubscribeRequestSchema: F,
      ResourceUpdatedNotificationParamsSchema: M,
      ResourceUpdatedNotificationSchema: W,
      PromptArgumentSchema: I,
      PromptSchema: $,
      ListPromptsRequestSchema: H,
      ListPromptsResultSchema: V,
      GetPromptRequestParamsSchema: fe,
      GetPromptRequestSchema: er,
      TextContentSchema: ft,
      ImageContentSchema: tr,
      AudioContentSchema: rr,
      ToolUseContentSchema: Mo,
      EmbeddedResourceSchema: Mt,
      ResourceLinkSchema: qo,
      ContentBlockSchema: et,
      PromptMessageSchema: Er,
      GetPromptResultSchema: kr,
      PromptListChangedNotificationSchema: or,
      ToolAnnotationsSchema: jo,
      ToolExecutionSchema: Cr,
      ToolSchema: nr,
      ListToolsRequestSchema: Ir,
      ListToolsResultSchema: Or,
      CallToolResultSchema: Nr,
      CallToolRequestParamsSchema: xe,
      CallToolRequestSchema: Lo,
      ToolListChangedNotificationSchema: xs,
      LoggingLevelSchema: Ar,
      SetLevelRequestParamsSchema: Uo,
      SetLevelRequestSchema: Zo,
      LoggingMessageNotificationParamsSchema: Do,
      LoggingMessageNotificationSchema: Fo,
      ModelHintSchema: Vo,
      ModelPreferencesSchema: Ho,
      ToolChoiceSchema: Jo,
      ToolResultContentSchema: Ps,
      SamplingContentSchema: Bo,
      SamplingMessageContentBlockSchema: qt,
      SamplingMessageSchema: Wo,
      CreateMessageRequestParamsSchema: Ko,
      CreateMessageRequestSchema: Go,
      CreateMessageResultSchema: Yo,
      CreateMessageResultWithToolsSchema: Xo,
      BooleanSchemaSchema: Qo,
      StringSchemaSchema: en,
      NumberSchemaSchema: tn,
      UntitledSingleSelectEnumSchemaSchema: rn,
      TitledSingleSelectEnumSchemaSchema: on,
      LegacyTitledEnumSchemaSchema: nn,
      SingleSelectEnumSchemaSchema: sn,
      UntitledMultiSelectEnumSchemaSchema: sr,
      TitledMultiSelectEnumSchemaSchema: ir,
      MultiSelectEnumSchemaSchema: $s,
      EnumSchemaSchema: Ts,
      PrimitiveSchemaDefinitionSchema: Je,
      ElicitRequestFormParamsSchema: Be,
      ElicitRequestURLParamsSchema: an,
      ElicitRequestParamsSchema: ot,
      ElicitRequestSchema: Es,
      ElicitationCompleteNotificationParamsSchema: ks,
      ElicitationCompleteNotificationSchema: Cs,
      ElicitResultSchema: Is,
      ResourceTemplateReferenceSchema: Os,
      PromptReferenceSchema: Ns,
      CompleteRequestParamsSchema: As,
      CompleteRequestSchema: cn,
      CompleteResultSchema: Ms,
      RootSchema: qs,
      ListRootsRequestSchema: Mr,
      ListRootsResultSchema: un,
      RootsListChangedNotificationSchema: js,
      TaskCreationParamsSchema: Ls,
      TaskStatusSchema: Us,
      TaskSchema: jt,
      CreateTaskResultSchema: qe,
      TaskStatusNotificationParamsSchema: Zs,
      TaskStatusNotificationSchema: ar,
      GetTaskRequestSchema: qr,
      GetTaskResultSchema: jr,
      GetTaskPayloadRequestSchema: Lr,
      GetTaskPayloadResultSchema: wc,
      ListTasksRequestSchema: je,
      ListTasksResultSchema: me,
      CancelTaskRequestSchema: cr,
      CancelTaskResultSchema: h.merge(jt),
      ClientRequestSchema: O([ke, Y, cn, Zo, er, H, Ve, Me, pt, E, F, Lo, Ir, qr, Lr, je, cr]),
      ClientNotificationSchema: O([b, Ye, ve, js, ar]),
      ClientResultSchema: O([g, Yo, Xo, Is, un, jr, me, qe]),
      ServerRequestSchema: O([ke, Go, Es, Mr, qr, Lr, je, cr]),
      ServerNotificationSchema: O([b, Ye, Fo, W, ht, xs, or, ar, Cs]),
      ServerResultSchema: O([g, Ge, Ms, kr, V, He, Xe, At, Nr, Or, jr, me, qe]),
      CallToolResultWireSchema: j().superRefine((Pe, ES) => {
        if (!(typeof Pe != "object" || Pe === null || Array.isArray(Pe) || Pe.content !== void 0)) {
          for (let bd of ug) if (bd in Pe) {
            ES.addIssue({
              code: "custom",
              message: `content is required when the body carries '${bd}' \u2014 another result family cannot default into an empty tools/call success`
            });
            return;
          }
        }
      }).transform(ty).pipe(Nr)
    };
  }
  var oy;
  function lg() {
    return oy ?? (oy = ry());
  }
  function dg(e) {
    return e.type !== "object";
  }
  var ny = new Set(["const", "enum", "default", "examples"]),
    sy = new Set(["properties", "patternProperties", "$defs", "definitions", "dependentSchemas", "dependencies"]);
  function Wf(e) {
    return e !== void 0 && !(typeof e == "string" && e.startsWith("#"));
  }
  function iy(e) {
    let t = typeof e.$schema == "string" ? e.$schema : void 0;
    if (Wf(e.$id)) return {
      ...(t !== void 0 && {
        $schema: t
      }),
      type: "object",
      properties: {
        result: e
      },
      required: ["result"]
    };
    let r = $d(e.$schema) && e.$recursiveAnchor !== !0,
      o = (n, s) => {
        if (Array.isArray(n)) return n.map(u => o(u, !1));
        if (n === null || typeof n != "object" || !s && Wf(n.$id)) return n;
        let i = {},
          a = !1;
        for (let [u, l] of Object.entries(n)) s ? i[u] = o(l, !1) : (u === "$ref" || u === "$dynamicRef") && typeof l == "string" ? i[u] = l === "#" ? "#/properties/result" : l.startsWith("#/") ? `#/properties/result${l.slice(1)}` : l : u === "$recursiveRef" && l === "#" && r ? a = !0 : ny.has(u) ? i[u] = l : sy.has(u) ? i[u] = o(l, !0) : i[u] = o(l, !1);
        return a && ("$ref" in i ? i.allOf = [...(Array.isArray(i.allOf) ? i.allOf : []), {
          $ref: "#/properties/result"
        }] : i.$ref = "#/properties/result"), i;
      };
    return {
      ...(t !== void 0 && {
        $schema: t
      }),
      type: "object",
      properties: {
        result: o(e, !1)
      },
      required: ["result"]
    };
  }
  var pg = {
      ping: null,
      initialize: null,
      "completion/complete": null,
      "logging/setLevel": null,
      "prompts/get": null,
      "prompts/list": null,
      "resources/list": null,
      "resources/templates/list": null,
      "resources/read": null,
      "resources/subscribe": null,
      "resources/unsubscribe": null,
      "tools/call": null,
      "tools/list": null,
      "tasks/get": null,
      "tasks/result": null,
      "tasks/list": null,
      "tasks/cancel": null,
      "sampling/createMessage": null,
      "elicitation/create": null,
      "roots/list": null
    },
    hg = {
      "notifications/cancelled": null,
      "notifications/progress": null,
      "notifications/initialized": null,
      "notifications/roots/list_changed": null,
      "notifications/tasks/status": null,
      "notifications/message": null,
      "notifications/resources/updated": null,
      "notifications/resources/list_changed": null,
      "notifications/tools/list_changed": null,
      "notifications/prompts/list_changed": null,
      "notifications/elicitation/complete": null
    },
    ay = {
      ping: null,
      initialize: null,
      "completion/complete": null,
      "logging/setLevel": null,
      "prompts/get": null,
      "prompts/list": null,
      "resources/list": null,
      "resources/templates/list": null,
      "resources/read": null,
      "resources/subscribe": null,
      "resources/unsubscribe": null,
      "tools/call": null,
      "tools/list": null,
      "sampling/createMessage": null,
      "elicitation/create": null,
      "roots/list": null
    },
    sc;
  function Ul() {
    if (sc) return sc;
    let e = lg();
    return sc = {
      requestSchemas: {
        ping: e.PingRequestSchema,
        initialize: e.InitializeRequestSchema,
        "completion/complete": e.CompleteRequestSchema,
        "logging/setLevel": e.SetLevelRequestSchema,
        "prompts/get": e.GetPromptRequestSchema,
        "prompts/list": e.ListPromptsRequestSchema,
        "resources/list": e.ListResourcesRequestSchema,
        "resources/templates/list": e.ListResourceTemplatesRequestSchema,
        "resources/read": e.ReadResourceRequestSchema,
        "resources/subscribe": e.SubscribeRequestSchema,
        "resources/unsubscribe": e.UnsubscribeRequestSchema,
        "tools/call": e.CallToolRequestSchema,
        "tools/list": e.ListToolsRequestSchema,
        "tasks/get": e.GetTaskRequestSchema,
        "tasks/result": e.GetTaskPayloadRequestSchema,
        "tasks/list": e.ListTasksRequestSchema,
        "tasks/cancel": e.CancelTaskRequestSchema,
        "sampling/createMessage": e.CreateMessageRequestSchema,
        "elicitation/create": e.ElicitRequestSchema,
        "roots/list": e.ListRootsRequestSchema
      },
      notificationSchemas: {
        "notifications/cancelled": e.CancelledNotificationSchema,
        "notifications/progress": e.ProgressNotificationSchema,
        "notifications/initialized": e.InitializedNotificationSchema,
        "notifications/roots/list_changed": e.RootsListChangedNotificationSchema,
        "notifications/tasks/status": e.TaskStatusNotificationSchema,
        "notifications/message": e.LoggingMessageNotificationSchema,
        "notifications/resources/updated": e.ResourceUpdatedNotificationSchema,
        "notifications/resources/list_changed": e.ResourceListChangedNotificationSchema,
        "notifications/tools/list_changed": e.ToolListChangedNotificationSchema,
        "notifications/prompts/list_changed": e.PromptListChangedNotificationSchema,
        "notifications/elicitation/complete": e.ElicitationCompleteNotificationSchema
      },
      resultSchemas: {
        ping: e.EmptyResultSchema,
        initialize: e.InitializeResultSchema,
        "completion/complete": e.CompleteResultSchema,
        "logging/setLevel": e.EmptyResultSchema,
        "prompts/get": e.GetPromptResultSchema,
        "prompts/list": e.ListPromptsResultSchema,
        "resources/list": e.ListResourcesResultSchema,
        "resources/templates/list": e.ListResourceTemplatesResultSchema,
        "resources/read": e.ReadResourceResultSchema,
        "resources/subscribe": e.EmptyResultSchema,
        "resources/unsubscribe": e.EmptyResultSchema,
        "tools/call": e.CallToolResultWireSchema,
        "tools/list": e.ListToolsResultSchema,
        "sampling/createMessage": e.CreateMessageResultWithToolsSchema,
        "elicitation/create": e.ElicitResultSchema,
        "roots/list": e.ListRootsResultSchema
      }
    }, sc;
  }
  function mg(e) {
    return Object.prototype.hasOwnProperty.call(pg, e);
  }
  function fg(e) {
    return Object.prototype.hasOwnProperty.call(hg, e);
  }
  function cy(e) {
    return Object.prototype.hasOwnProperty.call(ay, e);
  }
  function uy(e) {
    return cy(e) ? Ul().resultSchemas[e] : void 0;
  }
  function ly(e) {
    return mg(e) ? Ul().requestSchemas[e] : void 0;
  }
  function dy(e) {
    return fg(e) ? Ul().notificationSchemas[e] : void 0;
  }
  var Ox = Object.keys(pg),
    Nx = Object.keys(hg);
  function Nl(e) {
    return e !== null && typeof e == "object" && !Array.isArray(e);
  }
  function ic(e, t) {
    if (e === void 0) return {
      ok: !1,
      reason: "not-in-era"
    };
    let r = e.safeParse(t);
    return r.success ? {
      ok: !0,
      value: r.data
    } : {
      ok: !1,
      reason: "invalid",
      message: String(r.error)
    };
  }
  var Kf = {
    ok: !1,
    reason: "not-in-era"
  };
  function Gf(e) {
    return Nl(e) && Nl(e.outputSchema) && dg(e.outputSchema);
  }
  var Zl = {
    era: "2025-11-25",
    hasRequestMethod: mg,
    hasNotificationMethod: fg,
    validateRequest: (e, t) => ic(ly(e), t),
    validateResult: (e, t) => ic(uy(e), t),
    validateNotification: (e, t) => ic(dy(e), t),
    hasInputRequestMethod: () => !1,
    validateInputRequest: () => Kf,
    validateInputResponse: () => Kf,
    samplingResultVariant: (e, t) => {
      let r = lg();
      return ic(e ? r.CreateMessageResultWithToolsSchema : r.CreateMessageResultSchema, t);
    },
    outboundEnvelope: e => {},
    validateEnvelopeMeta: e => [],
    projectCallToolResult(e, t) {
      let r = cg(e),
        o = r.structuredContent;
      if (o === void 0) return r;
      let n = typeof o != "object" || o === null || Array.isArray(o),
        s = t !== void 0 && dg(t);
      return !n && !s ? r : {
        ...r,
        structuredContent: {
          result: o
        }
      };
    },
    decodeResult(e, t) {
      if (Nl(t) && "resultType" in t) {
        let r = {
          ...t
        };
        return delete r.resultType, {
          kind: "complete",
          result: r
        };
      }
      return {
        kind: "complete",
        result: t
      };
    },
    encodeResult(e, t) {
      if (e !== "tools/list") return t;
      let r = t.tools;
      return !Array.isArray(r) || !r.some(o => Gf(o)) ? t : {
        ...t,
        tools: r.map(o => Gf(o) ? {
          ...o,
          outputSchema: iy(o.outputSchema)
        } : o)
      };
    },
    encodeErrorCode: e => e === -32002 ? -32602 : e,
    checkInboundEnvelope: e => {}
  };
  function py() {
    let e = En(() => O([c(), w(), k(), lr(), P(c(), e), S(e)])),
      t = P(c(), e),
      r = O([c(), w().int()]),
      o = c(),
      n = O([c(), w().int()]),
      s = B(["user", "assistant"]),
      i = B(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]),
      a = c().refine(me => {
        try {
          return atob(me), !0;
        } catch {
          return !1;
        }
      }, {
        message: "Invalid Base64 string"
      }),
      u = m({
        ttl: w().optional()
      }),
      l = m({
        taskId: c()
      }),
      d = D({
        progressToken: r.optional(),
        "io.modelcontextprotocol/related-task": l.optional()
      }),
      p = m({
        _meta: d.optional()
      }),
      h = p.extend({
        task: u.optional()
      }),
      f = m({
        _meta: d.optional()
      }),
      g = m({
        method: c(),
        params: f.loose().optional()
      }),
      y = m({
        src: c(),
        mimeType: c().optional(),
        sizes: S(c()).optional(),
        theme: B(["light", "dark"]).optional()
      }),
      b = m({
        icons: S(y).optional()
      }),
      T = m({
        name: c(),
        title: c().optional()
      }),
      L = T.extend({
        ...T.shape,
        ...b.shape,
        version: c(),
        websiteUrl: c().optional(),
        description: c().optional()
      }),
      U = xt(m({
        applyDefaults: k().optional()
      }), t),
      te = dr(me => me && typeof me == "object" && !Array.isArray(me) && Object.keys(me).length === 0 ? {
        form: {}
      } : me, xt(m({
        form: U.optional(),
        url: t.optional()
      }), t.optional())),
      x = D({
        list: t.optional(),
        cancel: t.optional(),
        requests: D({
          sampling: D({
            createMessage: t.optional()
          }).optional(),
          elicitation: D({
            create: t.optional()
          }).optional()
        }).optional()
      }),
      v = D({
        list: t.optional(),
        cancel: t.optional(),
        requests: D({
          tools: D({
            call: t.optional()
          }).optional()
        }).optional()
      }),
      C = m({
        experimental: P(c(), t).optional(),
        sampling: m({
          context: t.optional(),
          tools: t.optional()
        }).optional(),
        elicitation: te.optional(),
        roots: m({
          listChanged: k().optional()
        }).optional(),
        tasks: x.optional(),
        extensions: P(c(), t).optional()
      }),
      ee = m({
        experimental: P(c(), t).optional(),
        logging: t.optional(),
        completions: t.optional(),
        prompts: m({
          listChanged: k().optional()
        }).optional(),
        resources: m({
          subscribe: k().optional(),
          listChanged: k().optional()
        }).optional(),
        tools: m({
          listChanged: k().optional()
        }).optional(),
        tasks: v.optional(),
        extensions: P(c(), t).optional()
      }),
      K = m({
        progress: w(),
        total: q(w()),
        message: q(c())
      }),
      ie = m({
        ...f.shape,
        ...K.shape,
        progressToken: r
      }),
      Y = g.extend({
        method: _("notifications/progress"),
        params: ie
      }),
      _e = f.extend({
        level: i,
        logger: c().optional(),
        data: j()
      }),
      Ge = g.extend({
        method: _("notifications/message"),
        params: _e
      }),
      ve = m({
        uri: c(),
        mimeType: q(c()),
        _meta: P(c(), j()).optional()
      }),
      ke = ve.extend({
        text: c()
      }),
      ct = ve.extend({
        blob: a
      }),
      Ae = m({
        audience: S(s).optional(),
        priority: w().min(0).max(1).optional(),
        lastModified: Pt.datetime({
          offset: !0
        }).optional()
      }),
      Ye = m({
        ...T.shape,
        ...b.shape,
        uri: c(),
        description: q(c()),
        mimeType: q(c()),
        size: q(w()),
        annotations: Ae.optional(),
        _meta: q(D({}))
      }),
      ut = m({
        ...T.shape,
        ...b.shape,
        uriTemplate: c(),
        description: q(c()),
        mimeType: q(c()),
        annotations: Ae.optional(),
        _meta: q(D({}))
      }),
      Fe = g.extend({
        method: _("notifications/resources/list_changed"),
        params: f.optional()
      }),
      Ce = f.extend({
        uri: c()
      }),
      _t = g.extend({
        method: _("notifications/resources/updated"),
        params: Ce
      }),
      zt = m({
        name: c(),
        description: q(c()),
        required: q(k())
      }),
      lt = m({
        ...T.shape,
        ...b.shape,
        description: q(c()),
        arguments: q(S(zt)),
        _meta: q(D({}))
      }),
      we = g.extend({
        method: _("notifications/prompts/list_changed"),
        params: f.optional()
      }),
      Ie = m({
        type: _("text"),
        text: c(),
        annotations: Ae.optional(),
        _meta: P(c(), j()).optional()
      }),
      Oe = m({
        type: _("image"),
        data: a,
        mimeType: c(),
        annotations: Ae.optional(),
        _meta: P(c(), j()).optional()
      }),
      rt = m({
        type: _("audio"),
        data: a,
        mimeType: c(),
        annotations: Ae.optional(),
        _meta: P(c(), j()).optional()
      }),
      Xt = m({
        type: _("tool_use"),
        name: c(),
        id: c(),
        input: P(c(), j()),
        _meta: P(c(), j()).optional()
      }),
      Ve = m({
        type: _("resource"),
        resource: O([ke, ct]),
        annotations: Ae.optional(),
        _meta: P(c(), j()).optional()
      }),
      He = Ye.extend({
        type: _("resource_link")
      }),
      Me = O([Ie, Oe, rt, He, Ve]),
      Xe = m({
        role: s,
        content: Me
      }),
      Qe = m({
        title: c().optional(),
        readOnlyHint: k().optional(),
        destructiveHint: k().optional(),
        idempotentHint: k().optional(),
        openWorldHint: k().optional()
      }),
      dt = g.extend({
        method: _("notifications/tools/list_changed"),
        params: f.optional()
      }),
      pt = m({
        name: c().optional()
      }),
      At = m({
        hints: S(pt).optional(),
        costPriority: w().min(0).max(1).optional(),
        speedPriority: w().min(0).max(1).optional(),
        intelligencePriority: w().min(0).max(1).optional()
      }),
      ht = m({
        mode: B(["auto", "required", "none"]).optional()
      }),
      Qt = m({
        type: _("boolean"),
        title: c().optional(),
        description: c().optional(),
        default: k().optional()
      }),
      E = m({
        type: _("string"),
        title: c().optional(),
        description: c().optional(),
        minLength: w().optional(),
        maxLength: w().optional(),
        format: B(["email", "uri", "date", "date-time"]).optional(),
        default: c().optional()
      }),
      mt = m({
        type: B(["number", "integer"]),
        title: c().optional(),
        description: c().optional(),
        minimum: w().optional(),
        maximum: w().optional(),
        default: w().optional()
      }),
      F = m({
        type: _("string"),
        title: c().optional(),
        description: c().optional(),
        enum: S(c()),
        default: c().optional()
      }),
      M = m({
        type: _("string"),
        title: c().optional(),
        description: c().optional(),
        oneOf: S(m({
          const: c(),
          title: c()
        })),
        default: c().optional()
      }),
      W = m({
        type: _("string"),
        title: c().optional(),
        description: c().optional(),
        enum: S(c()),
        enumNames: S(c()).optional(),
        default: c().optional()
      }),
      I = O([F, M]),
      $ = m({
        type: _("array"),
        title: c().optional(),
        description: c().optional(),
        minItems: w().optional(),
        maxItems: w().optional(),
        items: m({
          type: _("string"),
          enum: S(c())
        }),
        default: S(c()).optional()
      }),
      H = m({
        type: _("array"),
        title: c().optional(),
        description: c().optional(),
        minItems: w().optional(),
        maxItems: w().optional(),
        items: m({
          anyOf: S(m({
            const: c(),
            title: c()
          }))
        }),
        default: S(c()).optional()
      }),
      V = O([$, H]),
      fe = O([W, I, V]),
      er = O([fe, Qt, E, mt]),
      ft = h.extend({
        mode: _("form").optional(),
        message: c(),
        requestedSchema: m({
          type: _("object"),
          properties: P(c(), er),
          required: S(c()).optional()
        }).catchall(j())
      }),
      tr = m({
        type: _("ref/resource"),
        uri: c()
      }),
      rr = m({
        type: _("ref/prompt"),
        name: c()
      }),
      Mo = m({
        uri: c().startsWith("file://"),
        name: c().optional(),
        _meta: P(c(), j()).optional()
      }),
      Mt = C.shape,
      qo = m({
        experimental: Mt.experimental,
        sampling: Mt.sampling,
        elicitation: Mt.elicitation,
        roots: Mt.roots,
        extensions: Mt.extensions
      }),
      et = ee.shape,
      Er = m({
        experimental: et.experimental,
        logging: et.logging,
        completions: et.completions,
        prompts: et.prompts,
        resources: et.resources,
        tools: et.tools,
        extensions: et.extensions
      }),
      kr = D({
        progressToken: r.optional(),
        [Tt]: c(),
        [Qr]: L.optional(),
        [hr]: qo,
        [eo]: i.optional()
      }),
      or = m({
        ...T.shape,
        ...b.shape,
        description: c().optional(),
        inputSchema: D({
          $schema: c().optional(),
          type: _("object")
        }),
        outputSchema: D({
          $schema: c().optional()
        }).optional(),
        annotations: Qe.optional(),
        _meta: P(c(), j()).optional()
      }),
      jo = m({
        type: _("tool_result"),
        toolUseId: c(),
        content: S(Me),
        structuredContent: j().optional(),
        isError: k().optional(),
        _meta: P(c(), j()).optional()
      }),
      Cr = O([Ie, Oe, rt, Xt, jo]),
      nr = m({
        role: s,
        content: O([Cr, S(Cr)]),
        _meta: P(c(), j()).optional()
      }),
      Ir = c(),
      Or = D({
        [Et]: L.optional().catch(void 0)
      }),
      Nr = Or.optional();
    function xe(me) {
      return D({
        _meta: Nr,
        resultType: Ir.default("complete"),
        ...me
      });
    }
    let Lo = xe({}),
      xs = xe({
        nextCursor: o.optional()
      }),
      Ar = xe({
        content: S(Me),
        structuredContent: j().optional(),
        isError: k().optional()
      }),
      Uo = xe({
        ttlMs: w().int().min(0),
        cacheScope: B(["public", "private"]),
        tools: S(or),
        nextCursor: o.optional()
      }),
      Zo = xe({
        ttlMs: w().int().min(0),
        cacheScope: B(["public", "private"]),
        prompts: S(lt),
        nextCursor: o.optional()
      }),
      Do = xe({
        description: c().optional(),
        messages: S(Xe)
      }),
      Fo = xe({
        ttlMs: w().int().min(0),
        cacheScope: B(["public", "private"]),
        resources: S(Ye),
        nextCursor: o.optional()
      }),
      Vo = xe({
        ttlMs: w().int().min(0),
        cacheScope: B(["public", "private"]),
        resourceTemplates: S(ut),
        nextCursor: o.optional()
      }),
      Ho = xe({
        ttlMs: w().int().min(0),
        cacheScope: B(["public", "private"]),
        contents: S(O([ke, ct]))
      }),
      Jo = xe({
        completion: m({
          values: S(c()).max(100),
          total: w().int().optional(),
          hasMore: k().optional()
        }).loose()
      }),
      Ps = xe({
        ttlMs: w().int().min(0),
        cacheScope: B(["public", "private"])
      }),
      Bo = xe({
        ttlMs: w().int().min(0).catch(0),
        cacheScope: B(["public", "private"]).catch("private"),
        supportedVersions: S(c()),
        capabilities: Er,
        instructions: c().optional()
      }),
      qt = m({
        messages: S(nr),
        modelPreferences: At.optional(),
        systemPrompt: c().optional(),
        includeContext: B(["none", "thisServer", "allServers"]).optional(),
        temperature: w().optional(),
        maxTokens: w().int(),
        stopSequences: S(c()).optional(),
        metadata: t.optional(),
        tools: S(or).optional(),
        toolChoice: ht.optional()
      }),
      Wo = m({
        method: _("sampling/createMessage"),
        params: qt
      }),
      Ko = m({
        method: _("roots/list"),
        params: m({
          _meta: P(c(), j()).optional()
        }).optional()
      }),
      Go = m({
        ...nr.shape,
        model: c(),
        stopReason: c().optional()
      }),
      Yo = m({
        roots: S(Mo)
      }),
      Xo = m({
        action: B(["accept", "decline", "cancel"]),
        content: P(c(), O([c(), w(), k(), S(c())])).optional()
      }),
      Qo = m({
        mode: _("url"),
        message: c(),
        url: c().url()
      }),
      en = O([ft, Qo]),
      tn = m({
        method: _("elicitation/create"),
        params: en
      }),
      rn = O([Wo, Ko, tn]),
      on = O([Go, Yo, Xo]),
      nn = P(c(), rn),
      sn = P(c(), on),
      sr = xe({
        inputRequests: nn.optional(),
        requestState: c().optional()
      }),
      ir = {
        inputResponses: sn.optional(),
        requestState: c().optional()
      },
      $s = m({
        _meta: kr,
        ...ir
      }),
      Ts = D({
        progressToken: r.optional()
      });
    function Je(me, cr) {
      return m({
        method: _(me),
        params: m({
          _meta: kr,
          ...cr
        })
      });
    }
    function Be(me, cr) {
      return m({
        method: _(me),
        params: m({
          _meta: Ts.optional(),
          ...cr
        }).optional()
      });
    }
    let an = {
        name: c(),
        arguments: P(c(), j()).optional(),
        ...ir
      },
      ot = {
        cursor: o.optional()
      },
      Es = Je("tools/call", an),
      ks = Je("tools/list", ot),
      Cs = Je("prompts/list", ot),
      Is = Je("prompts/get", {
        name: c(),
        arguments: P(c(), c()).optional(),
        ...ir
      }),
      Os = Je("resources/list", ot),
      Ns = Je("resources/templates/list", ot),
      As = Je("resources/read", {
        uri: c(),
        ...ir
      }),
      cn = {
        ref: O([rr, tr]),
        argument: m({
          name: c(),
          value: c()
        }),
        context: m({
          arguments: P(c(), c()).optional()
        }).optional()
      },
      Ms = Je("completion/complete", cn),
      qs = Je("server/discover", {}),
      Mr = m({
        toolsListChanged: k().optional(),
        promptsListChanged: k().optional(),
        resourcesListChanged: k().optional(),
        resourceSubscriptions: S(c()).optional()
      }),
      un = {
        notifications: Mr
      },
      js = Je("subscriptions/listen", un),
      Ls = Or.extend({
        "io.modelcontextprotocol/subscriptionId": n
      }),
      Us = D({
        _meta: Ls,
        resultType: Ir.default("complete")
      }),
      jt = {
        "tools/call": Be("tools/call", an),
        "tools/list": Be("tools/list", ot),
        "prompts/get": Be("prompts/get", {
          name: c(),
          arguments: P(c(), c()).optional()
        }),
        "prompts/list": Be("prompts/list", ot),
        "resources/list": Be("resources/list", ot),
        "resources/templates/list": Be("resources/templates/list", ot),
        "resources/read": Be("resources/read", {
          uri: c()
        }),
        "completion/complete": Be("completion/complete", cn),
        "server/discover": Be("server/discover", {}),
        "subscriptions/listen": Be("subscriptions/listen", un)
      };
    function qe(me) {
      return D({
        _meta: Nr,
        ...me
      });
    }
    let Zs = {
        "tools/call": qe({
          content: S(Me),
          structuredContent: j().optional(),
          isError: k().optional()
        }),
        "tools/list": qe({
          ttlMs: w().int().min(0),
          cacheScope: B(["public", "private"]),
          tools: S(or),
          nextCursor: o.optional()
        }),
        "prompts/get": qe({
          description: c().optional(),
          messages: S(Xe)
        }),
        "prompts/list": qe({
          ttlMs: w().int().min(0),
          cacheScope: B(["public", "private"]),
          prompts: S(lt),
          nextCursor: o.optional()
        }),
        "resources/list": qe({
          ttlMs: w().int().min(0),
          cacheScope: B(["public", "private"]),
          resources: S(Ye),
          nextCursor: o.optional()
        }),
        "resources/templates/list": qe({
          ttlMs: w().int().min(0),
          cacheScope: B(["public", "private"]),
          resourceTemplates: S(ut),
          nextCursor: o.optional()
        }),
        "resources/read": qe({
          ttlMs: w().int().min(0),
          cacheScope: B(["public", "private"]),
          contents: S(O([ke, ct]))
        }),
        "completion/complete": qe({
          completion: m({
            values: S(c()).max(100),
            total: w().int().optional(),
            hasMore: k().optional()
          }).loose()
        }),
        "server/discover": qe({
          ttlMs: w().int().min(0).catch(0),
          cacheScope: B(["public", "private"]).catch("private"),
          supportedVersions: S(c()),
          capabilities: Er,
          instructions: c().optional()
        }),
        "subscriptions/listen": qe({})
      },
      ar = D({
        "io.modelcontextprotocol/subscriptionId": n.optional()
      }),
      qr = m({
        method: _("notifications/subscriptions/acknowledged"),
        params: m({
          _meta: ar.optional(),
          notifications: Mr
        })
      }),
      jr = m({
        _meta: ar.optional(),
        requestId: n,
        reason: c().optional()
      }),
      Lr = m({
        method: _("notifications/cancelled"),
        params: jr
      }),
      wc = {
        "notifications/cancelled": Lr,
        "notifications/progress": Y,
        "notifications/message": Ge,
        "notifications/resources/updated": _t,
        "notifications/resources/list_changed": Fe,
        "notifications/tools/list_changed": dt,
        "notifications/prompts/list_changed": we,
        "notifications/subscriptions/acknowledged": qr
      },
      je = me => m({
        jsonrpc: _("2.0"),
        id: O([c(), w().int()]),
        result: me
      }).strict();
    return {
      JSONValueSchema: e,
      JSONObjectSchema: t,
      ProgressTokenSchema: r,
      CursorSchema: o,
      RequestIdSchema: n,
      RoleSchema: s,
      LoggingLevelSchema: i,
      TaskMetadataSchema: u,
      RelatedTaskMetadataSchema: l,
      RequestMetaSchema: d,
      BaseRequestParamsSchema: p,
      TaskAugmentedRequestParamsSchema: h,
      NotificationsParamsSchema: f,
      NotificationSchema: g,
      IconSchema: y,
      IconsSchema: b,
      BaseMetadataSchema: T,
      ImplementationSchema: L,
      ClientTasksCapabilitySchema: x,
      ServerTasksCapabilitySchema: v,
      ClientCapabilitiesSchema: C,
      ServerCapabilitiesSchema: ee,
      ProgressSchema: K,
      ProgressNotificationParamsSchema: ie,
      ProgressNotificationSchema: Y,
      LoggingMessageNotificationParamsSchema: _e,
      LoggingMessageNotificationSchema: Ge,
      ResourceContentsSchema: ve,
      TextResourceContentsSchema: ke,
      BlobResourceContentsSchema: ct,
      AnnotationsSchema: Ae,
      ResourceSchema: Ye,
      ResourceTemplateSchema: ut,
      ResourceListChangedNotificationSchema: Fe,
      ResourceUpdatedNotificationParamsSchema: Ce,
      ResourceUpdatedNotificationSchema: _t,
      PromptArgumentSchema: zt,
      PromptSchema: lt,
      PromptListChangedNotificationSchema: we,
      TextContentSchema: Ie,
      ImageContentSchema: Oe,
      AudioContentSchema: rt,
      ToolUseContentSchema: Xt,
      EmbeddedResourceSchema: Ve,
      ResourceLinkSchema: He,
      ContentBlockSchema: Me,
      PromptMessageSchema: Xe,
      ToolAnnotationsSchema: Qe,
      ToolListChangedNotificationSchema: dt,
      ModelHintSchema: pt,
      ModelPreferencesSchema: At,
      ToolChoiceSchema: ht,
      BooleanSchemaSchema: Qt,
      StringSchemaSchema: E,
      NumberSchemaSchema: mt,
      UntitledSingleSelectEnumSchemaSchema: F,
      TitledSingleSelectEnumSchemaSchema: M,
      LegacyTitledEnumSchemaSchema: W,
      SingleSelectEnumSchemaSchema: I,
      UntitledMultiSelectEnumSchemaSchema: $,
      TitledMultiSelectEnumSchemaSchema: H,
      MultiSelectEnumSchemaSchema: V,
      EnumSchemaSchema: fe,
      PrimitiveSchemaDefinitionSchema: er,
      ElicitRequestFormParamsSchema: ft,
      ResourceTemplateReferenceSchema: tr,
      PromptReferenceSchema: rr,
      RootSchema: Mo,
      ClientCapabilities2026Schema: qo,
      ServerCapabilities2026Schema: Er,
      RequestMetaEnvelopeSchema: kr,
      ToolSchema: or,
      ToolResultContentSchema: jo,
      SamplingMessageContentBlockSchema: Cr,
      SamplingMessageSchema: nr,
      ResultTypeSchema: Ir,
      ResultMetaSchema: Or,
      ResultSchema: Lo,
      PaginatedResultSchema: xs,
      CallToolResultSchema: Ar,
      ListToolsResultSchema: Uo,
      ListPromptsResultSchema: Zo,
      GetPromptResultSchema: Do,
      ListResourcesResultSchema: Fo,
      ListResourceTemplatesResultSchema: Vo,
      ReadResourceResultSchema: Ho,
      CompleteResultSchema: Jo,
      CacheableResultSchema: Ps,
      DiscoverResultSchema: Bo,
      CreateMessageRequestParamsSchema: qt,
      CreateMessageRequestSchema: Wo,
      ListRootsRequestSchema: Ko,
      CreateMessageResultSchema: Go,
      ListRootsResultSchema: Yo,
      ElicitResultSchema: Xo,
      ElicitRequestURLParamsSchema: Qo,
      ElicitRequestParamsSchema: en,
      ElicitRequestSchema: tn,
      InputRequestSchema: rn,
      InputResponseSchema: on,
      InputRequestsSchema: nn,
      InputResponsesSchema: sn,
      InputRequiredResultSchema: sr,
      InputResponseRequestParamsSchema: $s,
      CallToolRequestSchema: Es,
      ListToolsRequestSchema: ks,
      ListPromptsRequestSchema: Cs,
      GetPromptRequestSchema: Is,
      ListResourcesRequestSchema: Os,
      ListResourceTemplatesRequestSchema: Ns,
      ReadResourceRequestSchema: As,
      CompleteRequestSchema: Ms,
      DiscoverRequestSchema: qs,
      SubscriptionFilterSchema: Mr,
      SubscriptionsListenRequestSchema: js,
      SubscriptionsListenResultMetaSchema: Ls,
      SubscriptionsListenResultSchema: Us,
      dispatchRequestSchemas: jt,
      dispatchResultSchemas: Zs,
      NotificationMetaSchema: ar,
      SubscriptionsAcknowledgedNotificationSchema: qr,
      CancelledNotificationParamsSchema: jr,
      CancelledNotificationSchema: Lr,
      notificationSchemas2026: wc,
      JSONRPCResultResponseSchema: je(Lo),
      CallToolResultResponseSchema: je(O([Ar, sr])),
      ListToolsResultResponseSchema: je(Uo),
      ListPromptsResultResponseSchema: je(Zo),
      GetPromptResultResponseSchema: je(O([Do, sr])),
      ListResourcesResultResponseSchema: je(Fo),
      ListResourceTemplatesResultResponseSchema: je(Vo),
      ReadResourceResultResponseSchema: je(O([Ho, sr])),
      CompleteResultResponseSchema: je(Jo),
      DiscoverResultResponseSchema: je(Bo)
    };
  }
  var hy;
  function zr() {
    return hy ?? (hy = py());
  }
  var my = ["tools/list", "prompts/list", "resources/list", "resources/templates/list", "resources/read", "server/discover"];
  function fy(e) {
    return my.includes(e);
  }
  var Dl = Symbol("modelcontextprotocol.resultCacheHintFallback");
  function gy(e) {
    return e[Dl];
  }
  function gg(e) {
    return typeof e == "number" && Number.isSafeInteger(e) && e >= 0;
  }
  function Sg(e) {
    return e === "public" || e === "private";
  }
  var J = function (e) {
      return e[e.ParseError = -32700] = "ParseError", e[e.InvalidRequest = -32600] = "InvalidRequest", e[e.MethodNotFound = -32601] = "MethodNotFound", e[e.InvalidParams = -32602] = "InvalidParams", e[e.InternalError = -32603] = "InternalError", e[e.ResourceNotFound = -32002] = "ResourceNotFound", e[e.MissingRequiredClientCapability = -32021] = "MissingRequiredClientCapability", e[e.UnsupportedProtocolVersion = -32022] = "UnsupportedProtocolVersion", e[e.UrlElicitationRequired = -32042] = "UrlElicitationRequired", e;
    }({}),
    _r,
    re = (_r = class extends Error {
      static [Symbol.hasInstance](t) {
        return Ke(this, t);
      }
      static isInstance(t) {
        if (typeof this != "function") throw new TypeError("isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)`");
        return Ke(this, t);
      }
      constructor(t, r, o) {
        super(r);
        this.code = t;
        this.data = o;
        this.name = "ProtocolError";
        yr(this, new.target);
      }
      static fromError(t, r, o) {
        if (t === J.UrlElicitationRequired && o) {
          let n = o;
          if (n.elicitations) return new zg(n.elicitations, r);
        }
        if (t === J.UnsupportedProtocolVersion && o) {
          let n = o;
          if (Array.isArray(n.supported) && typeof n.requested == "string") return new dc({
            supported: n.supported,
            requested: n.requested
          }, r);
        }
        if (t === J.InvalidParams || t === J.ResourceNotFound) {
          let n = o;
          if (typeof n?.uri == "string" && (t === J.ResourceNotFound || Object.keys(n).length === 1)) return new _g(n.uri, r);
        }
        if (t === J.MissingRequiredClientCapability && o) {
          let n = o;
          if (n.requiredCapabilities !== null && typeof n.requiredCapabilities == "object" && !Array.isArray(n.requiredCapabilities)) return new yg({
            requiredCapabilities: n.requiredCapabilities
          }, r);
        }
        return new _r(t, r, o);
      }
    }, Object.defineProperty(_r, "mcpBrand", {
      value: "mcp.ProtocolError"
    }), _r),
    So,
    _g = (So = class extends re {
      constructor(t, r = `Resource not found: ${t}`) {
        super(J.InvalidParams, r, {
          uri: t
        });
      }
      get uri() {
        return this.data.uri;
      }
    }, Object.defineProperty(So, "mcpBrand", {
      value: "mcp.ResourceNotFoundError"
    }), So),
    _o,
    zg = (_o = class extends re {
      constructor(t, r = `URL elicitation${t.length > 1 ? "s" : ""} required`) {
        super(J.UrlElicitationRequired, r, {
          elicitations: t
        });
      }
      get elicitations() {
        return this.data?.elicitations ?? [];
      }
    }, Object.defineProperty(_o, "mcpBrand", {
      value: "mcp.UrlElicitationRequiredError"
    }), _o),
    zo,
    dc = (zo = class extends re {
      constructor(t, r = `Unsupported protocol version: ${t.requested}`) {
        super(J.UnsupportedProtocolVersion, r, t);
      }
      get supported() {
        return this.data.supported;
      }
      get requested() {
        return this.data.requested;
      }
    }, Object.defineProperty(zo, "mcpBrand", {
      value: "mcp.UnsupportedProtocolVersionError"
    }), zo),
    yo,
    yg = (yo = class extends re {
      constructor(t, r = `Missing required client capabilities: ${Object.keys(t.requiredCapabilities).join(", ")}`) {
        super(J.MissingRequiredClientCapability, r, t);
      }
      get requiredCapabilities() {
        return this.data.requiredCapabilities;
      }
    }, Object.defineProperty(yo, "mcpBrand", {
      value: "mcp.MissingRequiredClientCapabilityError"
    }), yo),
    Sy = 0,
    _y = "private",
    zy = ["tools/call", "prompts/get", "resources/read"];
  function yy(e, t) {
    let r = t.resultType;
    if (r === void 0) return {
      ...t,
      resultType: "complete"
    };
    if (r === "complete" || zy.includes(e)) return t;
    throw new re(J.InternalError, `Handler for ${e} returned resultType '${String(r)}', but results of ${e} only support 'complete' on protocol revision 2026-07-28`);
  }
  function by(e, t) {
    let r = gy(t);
    if (t.resultType !== "complete" || !fy(e)) return r === void 0 ? t : Py(t);
    let o = t,
      n = gg(o.ttlMs) ? o.ttlMs : wy(r),
      s = Sg(o.cacheScope) ? o.cacheScope : xy(r),
      i = {
        ...o,
        ttlMs: n,
        cacheScope: s
      };
    return delete i[Dl], i;
  }
  function vy(e) {
    return e !== null && typeof e == "object" && !Array.isArray(e);
  }
  function Ry(e, t) {
    if (t === void 0) return e;
    let r = e._meta;
    return r === void 0 ? {
      ...e,
      _meta: {
        [Et]: t
      }
    } : !vy(r) || r[Et] !== void 0 ? e : {
      ...e,
      _meta: {
        ...r,
        [Et]: t
      }
    };
  }
  function wy(e) {
    return e !== void 0 && gg(e.ttlMs) ? e.ttlMs : Sy;
  }
  function xy(e) {
    return e !== void 0 && Sg(e.cacheScope) ? e.cacheScope : _y;
  }
  function Py(e) {
    let t = {
      ...e
    };
    return delete t[Dl], t;
  }
  var $y = ["elicitation/create", "sampling/createMessage", "roots/list"],
    ac;
  function bg() {
    if (ac) return ac;
    let e = zr();
    return ac = {
      request: {
        "elicitation/create": m({
          method: _("elicitation/create"),
          params: e.ElicitRequestParamsSchema
        }),
        "sampling/createMessage": m({
          method: _("sampling/createMessage"),
          params: e.CreateMessageRequestParamsSchema
        }),
        "roots/list": m({
          method: _("roots/list"),
          params: D({}).optional()
        })
      },
      response: {
        "elicitation/create": e.ElicitResultSchema,
        "sampling/createMessage": e.CreateMessageResultSchema,
        "roots/list": e.ListRootsResultSchema
      }
    }, ac;
  }
  function vg(e) {
    return $y.includes(e);
  }
  function El(e) {
    return vg(e) ? bg().request[e] : void 0;
  }
  function Ty(e) {
    return vg(e) ? bg().response[e] : void 0;
  }
  var Fl = {
      "tools/call": null,
      "tools/list": null,
      "prompts/get": null,
      "prompts/list": null,
      "resources/list": null,
      "resources/templates/list": null,
      "resources/read": null,
      "completion/complete": null,
      "server/discover": null,
      "subscriptions/listen": null
    },
    Rg = {
      "notifications/cancelled": null,
      "notifications/progress": null,
      "notifications/message": null,
      "notifications/resources/updated": null,
      "notifications/resources/list_changed": null,
      "notifications/tools/list_changed": null,
      "notifications/prompts/list_changed": null,
      "notifications/subscriptions/acknowledged": null
    };
  function wg(e) {
    return Object.prototype.hasOwnProperty.call(Fl, e);
  }
  function xg(e) {
    return Object.prototype.hasOwnProperty.call(Rg, e);
  }
  function Ey(e) {
    return Object.prototype.hasOwnProperty.call(Fl, e);
  }
  function ky(e) {
    return wg(e) ? zr().dispatchRequestSchemas[e] : void 0;
  }
  function Cy(e) {
    return Ey(e) ? zr().dispatchResultSchemas[e] : void 0;
  }
  function Iy(e) {
    return xg(e) ? zr().notificationSchemas2026[e] : void 0;
  }
  var Ax = Object.keys(Fl),
    Mx = Object.keys(Rg);
  function hs(e) {
    return e !== null && typeof e == "object" && !Array.isArray(e);
  }
  function ds(e, t) {
    if (e === void 0) return {
      ok: !1,
      reason: "not-in-era"
    };
    let r = e.safeParse(t);
    return r.success ? {
      ok: !0,
      value: r.data
    } : {
      ok: !1,
      reason: "invalid",
      message: String(r.error)
    };
  }
  var Oy = {
      ok: !1,
      reason: "not-in-era"
    },
    Ny = [Tt, hr];
  function Ay(e, t) {
    let r = t,
      o = !1,
      n = () => (o || (r = {
        ...r
      }, o = !0), r),
      s = t.tools;
    e === "tools/list" && Array.isArray(s) && s.some(a => hs(a) && "execution" in a) && (n().tools = s.map(a => {
      if (!hs(a) || !("execution" in a)) return a;
      let u = {
        ...a
      };
      return delete u.execution, u;
    }));
    let i = t.capabilities;
    if (hs(i) && "tasks" in i) {
      let a = {
        ...i
      };
      delete a.tasks;
      n().capabilities = a;
    }
    return r;
  }
  var Vl = {
      era: "2026-07-28",
      hasRequestMethod: wg,
      hasNotificationMethod: xg,
      hasInputRequestMethod: e => El(e) !== void 0,
      validateRequest: (e, t) => ds(ky(e), t),
      validateResult: (e, t) => ds(Cy(e), t),
      validateNotification: (e, t) => ds(Iy(e), t),
      validateInputRequest: (e, t) => ds(El(e), t),
      validateInputResponse: (e, t) => ds(Ty(e), t),
      samplingResultVariant: () => Oy,
      outboundEnvelope(e) {
        return {
          [Tt]: e.protocolVersion,
          [Qr]: e.clientInfo,
          [hr]: e.clientCapabilities,
          ...(e.logLevel !== void 0 && {
            [eo]: e.logLevel
          })
        };
      },
      validateEnvelopeMeta(e) {
        let t = [];
        for (let o of Ny) o in e || t.push({
          key: o,
          problem: "missing"
        });
        let r = zr().RequestMetaEnvelopeSchema.safeParse(e);
        if (!r.success) for (let o of r.error.issues) {
          let n = o.path.map(String),
            s = n.length > 0 ? n.join(".") : "_meta";
          n.length === 1 && t.some(i => i.key === s && i.problem === "missing") || t.push({
            key: s,
            problem: o.message
          });
        }
        return t;
      },
      projectCallToolResult: e => cg(e),
      inputRequestSchema: El,
      decodeResult(e, t) {
        if (!hs(t)) return {
          kind: "invalid",
          error: new A(N.InvalidResult, `Invalid result for ${e}: not an object`, {
            method: e
          })
        };
        let r = t.resultType;
        if (r === void 0) return {
          kind: "invalid",
          error: new A(N.InvalidResult, `Invalid result for ${e}: missing required resultType \u2014 servers implementing protocol revision 2026-07-28 MUST include it (the absent-means-complete bridge applies only to earlier-revision servers)`, {
            method: e,
            violation: "missing-resultType"
          })
        };
        if (typeof r != "string") return {
          kind: "invalid",
          error: new A(N.InvalidResult, `Invalid result for ${e}: non-string resultType`, {
            method: e,
            resultType: r
          })
        };
        if (r === "input_required") {
          let i = t.inputRequests,
            a = hs(i) ? i : {},
            u = t.requestState;
          return Object.keys(a).length === 0 && typeof u != "string" ? {
            kind: "invalid",
            error: new A(N.InvalidResult, `Invalid result for ${e}: input_required carries neither inputRequests nor requestState (every input_required result must include at least one of the two)`, {
              method: e,
              violation: "input-required-missing-both"
            })
          } : {
            kind: "input_required",
            inputRequests: a,
            ...(typeof u == "string" && {
              requestState: u
            })
          };
        }
        if (r !== "complete") return {
          kind: "invalid",
          error: new A(N.UnsupportedResultType, `Unsupported result type '${r}' for ${e}`, {
            resultType: r,
            method: e
          })
        };
        let o = My(),
          n = Object.hasOwn(o, e) ? o[e] : void 0;
        if (n !== void 0) {
          let i = n.safeParse(t);
          if (!i.success) return {
            kind: "invalid",
            error: new A(N.InvalidResult, `Invalid result for ${e}: ${i.error}`, {
              method: e
            })
          };
        }
        let s = {
          ...t
        };
        return delete s.resultType, {
          kind: "complete",
          result: s
        };
      },
      encodeResult(e, t, r) {
        return Ry(by(e, yy(e, Ay(e, t))), r);
      },
      encodeErrorCode: e => e === -32002 ? -32602 : e,
      checkInboundEnvelope(e) {
        if (e.envelope === void 0) return "Request is missing the required _meta envelope for protocol revision 2026-07-28 (io.modelcontextprotocol/protocolVersion, io.modelcontextprotocol/clientCapabilities)";
        let t = zr().RequestMetaEnvelopeSchema.safeParse(e.envelope);
        if (!t.success) return `Invalid _meta envelope for protocol revision 2026-07-28: ${t.error.issues.map(r => r.message).join("; ")}`;
      }
    },
    cc;
  function My() {
    if (cc) return cc;
    let e = zr();
    return cc = {
      "tools/call": e.CallToolResultSchema,
      "tools/list": e.ListToolsResultSchema,
      "prompts/get": e.GetPromptResultSchema,
      "prompts/list": e.ListPromptsResultSchema,
      "resources/list": e.ListResourcesResultSchema,
      "resources/templates/list": e.ListResourceTemplatesResultSchema,
      "resources/read": e.ReadResourceResultSchema,
      "completion/complete": e.CompleteResultSchema,
      "server/discover": e.DiscoverResultSchema
    }, cc;
  }
  var pc = "2026-07-28";
  function It(e) {
    return e !== void 0 && Ot(e) ? Vl : Zl;
  }
  function Yf(e) {
    return e.revision !== void 0 ? It(e.revision).era : e.era === "modern" ? Vl.era : Zl.era;
  }
  function kl(e) {
    return Pg.some(t => t.hasRequestMethod(e));
  }
  function Cl(e) {
    return Pg.some(t => t.hasNotificationMethod(e));
  }
  var Pg = [Zl, Vl],
    qy = wd({
      AnnotationsSchema: () => Ct,
      AudioContentSchema: () => ao,
      BaseMetadataSchema: () => $t,
      BaseRequestParamsSchema: () => be,
      BlobResourceContentsSchema: () => Jn,
      BooleanSchemaSchema: () => Qn,
      CallToolRequestParamsSchema: () => _a,
      CallToolRequestSchema: () => za,
      CallToolResultSchema: () => Gn,
      CancelTaskRequestSchema: () => zl,
      CancelTaskResultSchema: () => yl,
      CancelledNotificationParamsSchema: () => wi,
      CancelledNotificationSchema: () => jn,
      ClientCapabilitiesSchema: () => Ti,
      ClientNotificationSchema: () => vl,
      ClientRequestSchema: () => bl,
      ClientResultSchema: () => Rl,
      ClientTasksCapabilitySchema: () => Pi,
      CompatibilityCallToolResultSchema: () => ul,
      CompleteRequestParamsSchema: () => Ja,
      CompleteRequestSchema: () => Ba,
      CompleteResultSchema: () => Wa,
      ContentBlockSchema: () => co,
      CreateMessageRequestParamsSchema: () => Ca,
      CreateMessageRequestSchema: () => Ia,
      CreateMessageResultSchema: () => Oa,
      CreateMessageResultWithToolsSchema: () => Na,
      CreateTaskResultSchema: () => dl,
      CursorSchema: () => In,
      DiscoverRequestSchema: () => Ci,
      DiscoverResultSchema: () => gr,
      ElicitRequestFormParamsSchema: () => po,
      ElicitRequestParamsSchema: () => La,
      ElicitRequestSchema: () => Ua,
      ElicitRequestURLParamsSchema: () => ja,
      ElicitResultSchema: () => Fa,
      ElicitationCompleteNotificationParamsSchema: () => Za,
      ElicitationCompleteNotificationSchema: () => Da,
      EmbeddedResourceSchema: () => ua,
      EmptyResultSchema: () => qn,
      EnumSchemaSchema: () => qa,
      GetPromptRequestParamsSchema: () => ia,
      GetPromptRequestSchema: () => aa,
      GetPromptResultSchema: () => pa,
      GetTaskPayloadRequestSchema: () => fl,
      GetTaskPayloadResultSchema: () => gl,
      GetTaskRequestSchema: () => hl,
      GetTaskResultSchema: () => ml,
      IconSchema: () => xi,
      IconsSchema: () => Jt,
      ImageContentSchema: () => io,
      ImplementationSchema: () => oo,
      InitializeRequestParamsSchema: () => Ei,
      InitializeRequestSchema: () => Ln,
      InitializeResultSchema: () => ki,
      InitializedNotificationSchema: () => Zn,
      JSONArraySchema: () => il,
      JSONObjectSchema: () => de,
      JSONRPCErrorResponseSchema: () => ro,
      JSONRPCMessageSchema: () => kt,
      JSONRPCNotificationSchema: () => Mn,
      JSONRPCRequestSchema: () => An,
      JSONRPCResponseSchema: () => al,
      JSONRPCResultResponseSchema: () => to,
      JSONValueSchema: () => Vt,
      LegacyTitledEnumSchemaSchema: () => rs,
      ListChangedOptionsBaseSchema: () => Yn,
      ListPromptsRequestSchema: () => na,
      ListPromptsResultSchema: () => sa,
      ListResourceTemplatesRequestSchema: () => ji,
      ListResourceTemplatesResultSchema: () => Li,
      ListResourcesRequestSchema: () => Mi,
      ListResourcesResultSchema: () => qi,
      ListRootsRequestSchema: () => Ga,
      ListRootsResultSchema: () => Ya,
      ListTasksRequestSchema: () => Sl,
      ListTasksResultSchema: () => _l,
      ListToolsRequestSchema: () => ga,
      ListToolsResultSchema: () => Sa,
      LoggingLevelSchema: () => Xn,
      LoggingMessageNotificationParamsSchema: () => Ra,
      LoggingMessageNotificationSchema: () => wa,
      ModelHintSchema: () => xa,
      ModelPreferencesSchema: () => Pa,
      MultiSelectEnumSchemaSchema: () => Ma,
      NotificationSchema: () => Te,
      NotificationsParamsSchema: () => $e,
      NumberSchemaSchema: () => lo,
      PaginatedRequestParamsSchema: () => Ni,
      PaginatedRequestSchema: () => Bt,
      PaginatedResultSchema: () => Wt,
      PingRequestSchema: () => Dn,
      PrimitiveSchemaDefinitionSchema: () => ss,
      ProgressNotificationParamsSchema: () => Oi,
      ProgressNotificationSchema: () => Fn,
      ProgressSchema: () => Ii,
      ProgressTokenSchema: () => Cn,
      PromptArgumentSchema: () => ra,
      PromptListChangedNotificationSchema: () => ha,
      PromptMessageSchema: () => da,
      PromptReferenceSchema: () => Ha,
      PromptSchema: () => oa,
      ReadResourceRequestParamsSchema: () => Ui,
      ReadResourceRequestSchema: () => Zi,
      ReadResourceResultSchema: () => Di,
      RelatedTaskMetadataSchema: () => Ri,
      RequestIdSchema: () => Ht,
      RequestMetaSchema: () => On,
      RequestSchema: () => pe,
      ResourceContentsSchema: () => Vn,
      ResourceLinkSchema: () => la,
      ResourceListChangedNotificationSchema: () => Fi,
      ResourceRequestParamsSchema: () => no,
      ResourceSchema: () => Bn,
      ResourceTemplateReferenceSchema: () => Va,
      ResourceTemplateSchema: () => Ai,
      ResourceUpdatedNotificationParamsSchema: () => ea,
      ResourceUpdatedNotificationSchema: () => ta,
      ResultMetaObjectSchema: () => Nn,
      ResultSchema: () => he,
      RoleSchema: () => Kt,
      RootSchema: () => Ka,
      RootsListChangedNotificationSchema: () => Xa,
      SamplingContentSchema: () => Ea,
      SamplingMessageContentBlockSchema: () => pr,
      SamplingMessageSchema: () => ka,
      ServerCapabilitiesSchema: () => Un,
      ServerNotificationSchema: () => xl,
      ServerRequestSchema: () => wl,
      ServerResultSchema: () => Pl,
      ServerTasksCapabilitySchema: () => $i,
      SetLevelRequestParamsSchema: () => ba,
      SetLevelRequestSchema: () => va,
      SingleSelectEnumSchemaSchema: () => Aa,
      StringSchemaSchema: () => uo,
      SubscribeRequestParamsSchema: () => Vi,
      SubscribeRequestSchema: () => Hi,
      SubscriptionFilterSchema: () => Wn,
      SubscriptionsAcknowledgedNotificationParamsSchema: () => Gi,
      SubscriptionsAcknowledgedNotificationSchema: () => Yi,
      SubscriptionsListenRequestParamsSchema: () => Wi,
      SubscriptionsListenRequestSchema: () => Ki,
      SubscriptionsListenResultMetaSchema: () => Xi,
      SubscriptionsListenResultSchema: () => Qi,
      TaskAugmentedRequestParamsSchema: () => fr,
      TaskCreationParamsSchema: () => ll,
      TaskMetadataSchema: () => vi,
      TaskSchema: () => Gt,
      TaskStatusNotificationParamsSchema: () => ec,
      TaskStatusNotificationSchema: () => pl,
      TaskStatusSchema: () => Qa,
      TextContentSchema: () => so,
      TextResourceContentsSchema: () => Hn,
      TitledMultiSelectEnumSchemaSchema: () => ns,
      TitledSingleSelectEnumSchemaSchema: () => ts,
      ToolAnnotationsSchema: () => ma,
      ToolChoiceSchema: () => $a,
      ToolExecutionSchema: () => fa,
      ToolListChangedNotificationSchema: () => ya,
      ToolResultContentSchema: () => Ta,
      ToolSchema: () => Kn,
      ToolUseContentSchema: () => ca,
      UnsubscribeRequestParamsSchema: () => Ji,
      UnsubscribeRequestSchema: () => Bi,
      UntitledMultiSelectEnumSchemaSchema: () => os,
      UntitledSingleSelectEnumSchemaSchema: () => es
    });
  var Rr = e => An.safeParse(e).success,
    $g = e => Mn.safeParse(e).success,
    bo = e => to.safeParse(e).success,
    vo = e => ro.safeParse(e).success;
  var Tg = e => typeof e == "object" && e !== null && !Array.isArray(e) && e.resultType === "input_required";
  var Hl = e => Ln.safeParse(e).success,
    Eg = e => Zn.safeParse(e).success;
  var jy = "Mcp-Param-",
    Xf = "x-mcp-header",
    Ly = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/,
    Uy = new Set(["string", "integer", "boolean", "number"]);
  function Jl(e) {
    let t = [],
      r = new Map(),
      o = (s, i, a) => {
        if (s === null || typeof s != "object") return;
        let u = s;
        if (Xf in u) {
          if (!a || i.length === 0) return `${uc(i)}: x-mcp-header is only permitted on properties statically reachable via a chain of 'properties' keys (not under items, additionalProperties, oneOf/anyOf/allOf/not, if/then/else, or $ref)`;
          let d = u[Xf];
          if (typeof d != "string" || d.length === 0) return `${uc(i)}: x-mcp-header MUST be a non-empty string`;
          if (!Ly.test(d)) return `${uc(i)}: x-mcp-header '${d}' is not a valid RFC 9110 token (no spaces, control characters or HTTP delimiters)`;
          let p = typeof u.type == "string" ? u.type : void 0;
          if (p === void 0 || !Uy.has(p)) return `${uc(i)}: x-mcp-header is only permitted on primitive-typed properties (string, integer, boolean); got ${p ?? "<none>"}`;
          let h = d.toLowerCase(),
            f = r.get(h);
          if (f !== void 0) return `x-mcp-header '${d}' is not case-insensitively unique (also declared as '${f}')`;
          r.set(h, d);
          t.push({
            path: i,
            headerName: d,
            type: p
          });
        }
        let l = u.properties;
        if (l !== null && typeof l == "object") for (let [d, p] of Object.entries(l)) {
          let h = o(p, [...i, d], a);
          if (h !== void 0) return h;
        }
        for (let d of Zy) {
          let p = u[d];
          if (p === void 0) continue;
          let h = Array.isArray(p) ? p : p !== null && typeof p == "object" && Dy.has(d) ? Object.values(p) : [p];
          for (let f of h) {
            let g = o(f, [...i, `<${d}>`], !1);
            if (g !== void 0) return g;
          }
        }
      },
      n = o(e, [], !0);
    return n === void 0 ? {
      valid: !0,
      declarations: t
    } : {
      valid: !1,
      reason: n
    };
  }
  var Zy = ["items", "prefixItems", "contains", "additionalProperties", "unevaluatedProperties", "unevaluatedItems", "propertyNames", "patternProperties", "dependentSchemas", "oneOf", "anyOf", "allOf", "not", "if", "then", "else", "$defs", "definitions"],
    Dy = new Set(["patternProperties", "dependentSchemas", "$defs", "definitions"]);
  function uc(e) {
    return e.length === 0 ? "<root>" : e.join(".");
  }
  var kg = "=?base64?",
    Cg = "?=";
  function Fy(e) {
    if (typeof e == "string") return e;
    if (typeof e == "boolean") return e ? "true" : "false";
    if (typeof e == "number") return !Number.isFinite(e) || Number.isInteger(e) && !Number.isSafeInteger(e) ? void 0 : String(e);
  }
  function Vy(e) {
    if (e.length === 0 || e.startsWith(kg) && e.endsWith(Cg) || e !== e.trim()) return !0;
    for (let t = 0; t < e.length; t++) {
      let r = e.codePointAt(t);
      if (!(r === 9 || r >= 32 && r <= 126)) return !0;
    }
    return !1;
  }
  function Hy(e) {
    let t = new TextEncoder().encode(e),
      r = "";
    for (let o of t) r += String.fromCodePoint(o);
    return btoa(r);
  }
  function Bl(e) {
    return Vy(e) ? `${kg}${Hy(e)}${Cg}` : e;
  }
  function Jy(e, t) {
    let r = e;
    for (let o of t) {
      if (r === null || typeof r != "object") return;
      r = r[o];
    }
    return r;
  }
  function Ig(e, t) {
    let r = {};
    for (let o of e) {
      let n = Jy(t, o.path);
      if (n == null) continue;
      let s = Fy(n);
      s !== void 0 && (r[`${jy}${o.headerName}`] = Bl(s));
    }
    return r;
  }
  var mo = -32020,
    qx = [{
      rung: "http-method",
      order: 1,
      evaluatedAt: "edge",
      codes: [-32e3],
      conformance: [],
      rationale: "The modern era is POST-only; GET/DELETE are body-less 2025-era session operations and are method-routed to legacy serving (405 when legacy serving is not configured), before any body is read."
    }, {
      rung: "jsonrpc-shape",
      order: 2,
      evaluatedAt: "edge",
      codes: [J.InvalidRequest],
      conformance: ["server-stateless"],
      rationale: "The body must be a JSON-RPC request or notification: posted responses and batch arrays containing a modern or invalid element are rejected before classification (element-wise batch rule); all-legacy arrays stay legacy traffic."
    }, {
      rung: "era-classification",
      order: 3,
      evaluatedAt: "edge",
      codes: [mo, J.UnsupportedProtocolVersion],
      conformance: ["server-stateless", "http-header-validation", "http-custom-header-server-validation"],
      rationale: "Body-primary era classification with the protocol-version header as a cross-check; a header/body disagreement is rejected with -32020 (HeaderMismatch), and an envelope-less request on a modern-only endpoint is answered with the unsupported-protocol-version error naming the supported revisions."
    }, {
      rung: "envelope",
      order: 4,
      evaluatedAt: "edge",
      codes: [J.InvalidParams],
      conformance: ["server-stateless"],
      rationale: "A present envelope claim with a malformed envelope \u2014 and a missing envelope on a request whose protocol-version header names a modern revision \u2014 is an invalid-params rejection naming the offending or missing key(s); never a silent fall back to legacy handling. This is the only place an invalid-params rejection maps to HTTP 400."
    }, {
      rung: "method-registry",
      order: 5,
      evaluatedAt: "dispatch",
      codes: [J.MethodNotFound],
      conformance: ["server-stateless"],
      rationale: "Method existence outranks parameter validity: a method absent from the negotiated revision\u2019s registry (or with no handler installed) answers method-not-found before params or capabilities are looked at."
    }, {
      rung: "request-params",
      order: 6,
      evaluatedAt: "dispatch",
      codes: [J.InvalidParams],
      conformance: [],
      rationale: "Per-method params validation; emitted in-band by the dispatch layer (HTTP 200), never via the ladder status table."
    }, {
      rung: "standard-header-validation",
      order: 7,
      evaluatedAt: "pre-dispatch",
      codes: [mo],
      conformance: ["http-header-validation"],
      rationale: "SEP-2243 standard `Mcp-Method` / `Mcp-Name` headers \u2014 presence, sentinel decoding, and `Mcp-Name` \u2194 body cross-check \u2014 are validated by the HTTP entry on a modern-classified request after the supported-revision gate and before dispatch. The classifier\u2019s own header-mismatch cells (protocol-version, `Mcp-Method` mismatch) stay on the edge `era-classification` rung; this rung carries the entry-layer presence/`Mcp-Name` half. Evaluated before the capability gate, the factory call, and the `Mcp-Param-*` rung so a request that fails several rungs is answered by the standard-header rung first. The documented order (after method-registry 5 and request-params 6) is NOT the observed precedence: serveModern evaluates this rung immediately after the supported-revision gate, so a request that also fails a dispatch rung is answered here before the dispatch rungs (5\u20136) are consulted."
    }, {
      rung: "client-capabilities",
      order: 8,
      evaluatedAt: "pre-dispatch",
      codes: [J.MissingRequiredClientCapability],
      conformance: ["server-stateless"],
      rationale: "The capability requirement is checked by the HTTP entry, pre-dispatch, against the validated envelope the classifier produced \u2014 pinning the spec-mandated HTTP 400 independently of how dispatch- and handler-produced errors are mapped. The documented order (after method resolution and params validation) is preserved observably only while the requirement table is empty: once a served method gains a requirement entry, a request that is missing the capability and would also fail a dispatch rung is answered by this gate first, so the entry must consult the method registry before the gate if the documented precedence is to stay observable."
    }, {
      rung: "param-header-validation",
      order: 9,
      evaluatedAt: "pre-dispatch",
      codes: [mo],
      conformance: ["http-custom-header-server-validation"],
      rationale: "SEP-2243 `Mcp-Param-*` headers are validated against the named tool\u2019s `x-mcp-header` declarations and the body `arguments` after the tool registry is known and before dispatch reaches the handler; a missing/disagreeing/malformed header is rejected 400 / -32020 with the same shape as the standard-header cross-checks. The documented order (after method resolution and params validation) is preserved observably only when the body `arguments` would otherwise validate: the check runs pre-dispatch, so a `tools/call` that fails BOTH this rung and a dispatch-time rung (e.g. order-6 `request-params`, -32602) is answered by this gate first with 400 / -32020, not by the earlier-ordered rung."
    }],
    jx = {
      [J.ParseError]: 400,
      [J.InvalidRequest]: 400,
      [J.MethodNotFound]: 404,
      [J.UnsupportedProtocolVersion]: 400,
      [J.MissingRequiredClientCapability]: 400,
      [mo]: 400
    };
  function hc(e, t) {
    return mi(e, t);
  }
  function ps(e) {
    return new Set(e.flatMap(t => Object.keys(t.shape)));
  }
  function Al(e) {
    if (e == null) return !1;
    let t = typeof e;
    return t !== "object" && t !== "function" || !("~standard" in e) ? !1 : typeof e["~standard"]?.validate == "function";
  }
  var Qf = !1,
    Ml = "draft-2020-12";
  function By(e, t = "input") {
    let r = e["~standard"],
      o;
    if (r.jsonSchema) o = r.jsonSchema[t]({
      target: Ml
    });else if (r.vendor === "zod") {
      if (!("_zod" in e)) throw new Error("Schema appears to be from zod 3, which the SDK cannot convert to JSON Schema. Upgrade to zod >=4.2.0, or wrap your JSON Schema with fromJsonSchema().");
      Qf || (Qf = !0, console.warn("[mcp-sdk] Your zod version does not implement `~standard.jsonSchema` (added in zod 4.2.0). Falling back to z.toJSONSchema(). Upgrade to zod >=4.2.0 to silence this warning."));
      o = pi(e, {
        target: Ml,
        io: t
      });
    } else throw new Error(`Schema library "${r.vendor}" does not implement StandardJSONSchemaV1 (\`~standard.jsonSchema\`). Upgrade to a version that does, or wrap your JSON Schema with fromJsonSchema().`);
    if (t === "output") return o.type !== void 0 ? o : Og(o) ? {
      type: "object",
      ...o
    } : o;
    if (o.type !== void 0 && o.type !== "object") throw new Error(`MCP tool and prompt schemas must describe objects (got type: ${JSON.stringify(o.type)}). Wrap your schema in z.object({...}) or equivalent.`);
    return {
      type: "object",
      ...o
    };
  }
  function Og(e) {
    if ("properties" in e || "patternProperties" in e || "additionalProperties" in e || "required" in e) return !0;
    for (let t of ["oneOf", "anyOf", "allOf"]) {
      let r = e[t];
      if (Array.isArray(r) && r.length > 0) return r.every(o => o !== null && typeof o == "object" && (o.type === "object" || Og(o)));
    }
    return !1;
  }
  function Wy(e) {
    return e.path?.length ? `${e.path.map(t => String(typeof t == "object" ? t.key : t)).join(".")}: ${e.message}` : e.message;
  }
  async function Il(e, t) {
    let r = await e["~standard"].validate(t);
    return r.issues && r.issues.length > 0 ? {
      success: !1,
      error: r.issues.map(o => Wy(o)).join(", ")
    } : {
      success: !0,
      data: r.value
    };
  }
  function Ky(e) {
    let t = pi(e, {
      target: Ml,
      io: "input"
    });
    return typeof t.pattern == "string" ? t.pattern : void 0;
  }
  var Gy = /\\\.\\d\{(\d+)\}/;
  function Yy(e) {
    let t = Gy.exec(e),
      r = [void 0, -1, 0];
    return t && r.push(Number(t[1])), [!1, !0].flatMap(o => [!1, !0].flatMap(n => r.map(s => Pt.datetime({
      local: o,
      offset: n,
      precision: s
    }))));
  }
  function Xy(e, t) {
    let r;
    switch (e) {
      case "email":
        r = [xf()];
        break;
      case "uri":
        r = [Si()];
        break;
      case "date":
        r = [Pt.date()];
        break;
      case "date-time":
        r = Yy(t);
        break;
    }
    return new Set(r.map(o => Ky(o)).filter(o => o !== void 0));
  }
  function Qy(e, t, r) {
    return r !== "zod" ? !0 : Xy(e, t).has(t);
  }
  function fs(e) {
    return typeof e == "object" && e !== null && !Array.isArray(e);
  }
  function eb(e) {
    try {
      return By(e, "input");
    } catch (t) {
      let r = t instanceof Error ? t.message : String(t);
      throw new re(J.InvalidParams, `Elicitation requestedSchema must describe an object with flat primitive properties: ${r}`);
    }
  }
  var tb = new Set(["$comment", "deprecated", "description", "examples", "readOnly", "title", "writeOnly"]);
  function Wl(e) {
    return tb.has(e) || e.startsWith("x-");
  }
  var rb = new Set(["$schema", ...Object.keys(po.shape.requestedSchema.shape)]),
    eg = {
      string: ps([uo, es, ts, rs]),
      number: ps([lo]),
      integer: ps([lo]),
      boolean: ps([Qn]),
      array: ps([os, ns])
    },
    ob = new Set(uo.shape.format.unwrap().options);
  function nb(e, t, r, o) {
    if (!fs(e)) return e;
    let n = typeof e.type == "string" && Object.hasOwn(eg, e.type) ? eg[e.type] : void 0;
    if (n === void 0) return e;
    let s = {};
    for (let [i, a] of Object.entries(e)) n.has(i) || Wl(i) ? s[i] = a : i === "pattern" && e.type === "string" && typeof e.format == "string" ? ob.has(e.format) ? (typeof a != "string" || !Qy(e.format, a, r)) && o.push(`${t}.${i}`) : s[i] = a : o.push(`${t}.${i}`);
    return s;
  }
  function sb(e, t) {
    let r = {},
      o = [];
    for (let [n, s] of Object.entries(e)) n === "properties" && fs(s) ? r[n] = Object.fromEntries(Object.entries(s).map(([i, a]) => [i, nb(a, `properties.${i}`, t, o)])) : rb.has(n) ? r[n] = s : Wl(n) || o.push(n);
    if (o.length > 0) throw new re(J.InvalidParams, `Elicitation requestedSchema contains unsupported JSON Schema constraint(s) after Standard Schema conversion: ${o.join(", ")}`);
    return r;
  }
  function ib(e, t) {
    if (!fs(e.properties)) return t;
    let r = Object.entries(e.properties).filter(([, o]) => !hc(ss, o).success).map(([o]) => `properties.${o}`);
    return r.length > 0 ? r.join(", ") : t;
  }
  function ql(e, t, r = "") {
    return Array.isArray(e) && Array.isArray(t) ? e.flatMap((o, n) => ql(o, t[n], `${r}[${n}]`)) : !fs(e) || !fs(t) ? [] : Object.entries(e).flatMap(([o, n]) => {
      let s = r ? `${r}.${o}` : o;
      return Object.prototype.hasOwnProperty.call(t, o) ? ql(n, t[o], s) : Wl(o) ? [] : [s];
    });
  }
  function ab(e) {
    if (!Al(e.requestedSchema)) return {
      ...e,
      mode: "form",
      requestedSchema: e.requestedSchema
    };
    let t = e.requestedSchema["~standard"].vendor,
      r = sb(eb(e.requestedSchema), t),
      o = hc(po.shape.requestedSchema, r);
    if (!o.success) throw new re(J.InvalidParams, `Elicitation requestedSchema only supports flat primitive properties (string, number, integer, boolean, and string enums): ${ib(r, o.error.message)}`);
    let n = ql(r, o.data);
    if (n.length > 0) throw new re(J.InvalidParams, `Elicitation requestedSchema contains unsupported JSON Schema constraint(s) after Standard Schema conversion: ${n.join(", ")}`);
    let s = (o.data.required ?? []).filter(i => !Object.prototype.hasOwnProperty.call(o.data.properties, i));
    if (s.length > 0) throw new re(J.InvalidParams, `Elicitation requestedSchema lists required properties that are not defined in properties: ${s.join(", ")}`);
    return {
      ...e,
      mode: "form",
      requestedSchema: o.data
    };
  }
  function cb(e) {
    let t = e.inputRequests !== void 0 && Object.keys(e.inputRequests).length > 0,
      r = typeof e.requestState == "string";
    if (!t && !r) throw new TypeError("inputRequired() requires at least one of inputRequests (with at least one entry) or requestState (spec: every InputRequiredResult MUST include at least one of the two)");
    return {
      resultType: "input_required",
      ...(e.inputRequests !== void 0 && {
        inputRequests: e.inputRequests
      }),
      ...(e.requestState !== void 0 && {
        requestState: e.requestState
      })
    };
  }
  var Lx = Object.assign(cb, {
    elicit(e) {
      try {
        return {
          method: "elicitation/create",
          params: ab(e)
        };
      } catch (t) {
        throw t instanceof re ? new TypeError(t.message, {
          cause: t
        }) : t;
      }
    },
    elicitUrl(e) {
      return {
        method: "elicitation/create",
        params: {
          ...e,
          mode: "url"
        }
      };
    },
    createMessage(e) {
      return {
        method: "sampling/createMessage",
        params: e
      };
    },
    listRoots() {
      return {
        method: "roots/list"
      };
    }
  });
  var ub = !0,
    lb = 10,
    db = 250;
  function Ng(e) {
    return {
      autoFulfill: e?.autoFulfill ?? ub,
      maxRounds: e?.maxRounds ?? lb
    };
  }
  function pb(e, t, r) {
    let o = t !== void 0 && Object.keys(t).length > 0;
    return !o && r === void 0 ? e : {
      ...e,
      ...(o && {
        inputResponses: t
      }),
      ...(r !== void 0 && {
        requestState: r
      })
    };
  }
  function hb(e, t) {
    return `Multi-round-trip request '${e}' still required input after ${t} rounds (inputRequired.maxRounds)`;
  }
  function mb(e, t) {
    return new Promise((r, o) => {
      if (t?.aborted) {
        o(t.reason instanceof A ? t.reason : new A(N.RequestTimeout, String(t.reason)));
        return;
      }
      let n = setTimeout(() => {
          t?.removeEventListener("abort", s);
          r();
        }, e),
        s = () => {
          clearTimeout(n);
          o(t?.reason instanceof A ? t.reason : new A(N.RequestTimeout, String(t?.reason)));
        };
      t?.addEventListener("abort", s, {
        once: !0
      });
    });
  }
  function fb(e) {
    let t = new AbortController(),
      r = () => t.abort(e?.reason);
    return e?.addEventListener("abort", r, {
      once: !0
    }), e?.aborted && t.abort(e.reason), {
      signal: t.signal,
      abort: o => t.abort(o),
      dispose: () => e?.removeEventListener("abort", r)
    };
  }
  async function gb(e) {
    let {
        config: t,
        method: r,
        originalParams: o,
        requestOptions: n,
        hooks: s,
        signal: i
      } = e,
      a = e.flowStartedAt ?? Date.now(),
      u = e.firstPayload,
      l = 0;
    for (;;) {
      if (l += 1, l > t.maxRounds) throw new A(N.InputRequiredRoundsExceeded, hb(r, t.maxRounds), {
        rounds: t.maxRounds,
        lastResult: {
          inputRequests: u.inputRequests,
          ...(u.requestState !== void 0 && {
            requestState: u.requestState
          })
        }
      });
      n.onprogress?.({
        progress: l,
        message: `Fulfilling input required by '${r}' (round ${l})`
      });
      let d = Object.entries(u.inputRequests ?? {}),
        p;
      if (d.length > 0) {
        let g = fb(i);
        try {
          let y = await Promise.all(d.map(async ([b, T]) => {
            try {
              return [b, await s.dispatchInputRequest(b, T, g.signal)];
            } catch (L) {
              throw g.abort(L), L;
            }
          }));
          p = Object.fromEntries(y);
        } finally {
          g.dispose();
        }
      } else await mb(db, i);
      let h = {
        ...(n.timeout !== void 0 && {
          timeout: n.timeout
        })
      };
      if (n.maxTotalTimeout !== void 0) {
        let g = Date.now() - a,
          y = n.maxTotalTimeout - g;
        if (y <= 0) throw new A(N.RequestTimeout, "Maximum total timeout exceeded", {
          maxTotalTimeout: n.maxTotalTimeout,
          totalElapsed: g
        });
        h.maxTotalTimeout = y;
      }
      let f = await s.retry(pb(o, p, u.requestState), h);
      if (Tg(f)) {
        u = {
          inputRequests: f.inputRequests ?? {},
          ...(f.requestState !== void 0 && {
            requestState: f.requestState
          })
        };
        continue;
      }
      return f;
    }
  }
  var Sb = ["AnnotationsSchema", "AudioContentSchema", "BaseMetadataSchema", "BlobResourceContentsSchema", "BooleanSchemaSchema", "CallToolRequestSchema", "CallToolRequestParamsSchema", "CallToolResultSchema", "CancelledNotificationSchema", "CancelledNotificationParamsSchema", "CancelTaskRequestSchema", "CancelTaskResultSchema", "ClientCapabilitiesSchema", "ClientNotificationSchema", "ClientRequestSchema", "ClientResultSchema", "CompatibilityCallToolResultSchema", "CompleteRequestSchema", "CompleteRequestParamsSchema", "CompleteResultSchema", "ContentBlockSchema", "CreateMessageRequestSchema", "CreateMessageRequestParamsSchema", "CreateMessageResultSchema", "CreateMessageResultWithToolsSchema", "CreateTaskResultSchema", "CursorSchema", "DiscoverRequestSchema", "DiscoverResultSchema", "ElicitationCompleteNotificationSchema", "ElicitationCompleteNotificationParamsSchema", "ElicitRequestSchema", "ElicitRequestFormParamsSchema", "ElicitRequestParamsSchema", "ElicitRequestURLParamsSchema", "ElicitResultSchema", "EmbeddedResourceSchema", "EmptyResultSchema", "EnumSchemaSchema", "GetPromptRequestSchema", "GetPromptRequestParamsSchema", "GetPromptResultSchema", "GetTaskPayloadRequestSchema", "GetTaskPayloadResultSchema", "GetTaskRequestSchema", "GetTaskResultSchema", "IconSchema", "IconsSchema", "ImageContentSchema", "ImplementationSchema", "InitializedNotificationSchema", "InitializeRequestSchema", "InitializeRequestParamsSchema", "InitializeResultSchema", "JSONArraySchema", "JSONObjectSchema", "JSONRPCErrorResponseSchema", "JSONRPCMessageSchema", "JSONRPCNotificationSchema", "JSONRPCRequestSchema", "JSONRPCResponseSchema", "JSONRPCResultResponseSchema", "JSONValueSchema", "LegacyTitledEnumSchemaSchema", "ListPromptsRequestSchema", "ListPromptsResultSchema", "ListResourcesRequestSchema", "ListResourcesResultSchema", "ListResourceTemplatesRequestSchema", "ListResourceTemplatesResultSchema", "ListRootsRequestSchema", "ListRootsResultSchema", "ListTasksRequestSchema", "ListTasksResultSchema", "ListToolsRequestSchema", "ListToolsResultSchema", "LoggingLevelSchema", "LoggingMessageNotificationSchema", "LoggingMessageNotificationParamsSchema", "ModelHintSchema", "ModelPreferencesSchema", "MultiSelectEnumSchemaSchema", "NotificationSchema", "NumberSchemaSchema", "PaginatedRequestSchema", "PaginatedRequestParamsSchema", "PaginatedResultSchema", "PingRequestSchema", "PrimitiveSchemaDefinitionSchema", "ProgressSchema", "ProgressNotificationSchema", "ProgressNotificationParamsSchema", "ProgressTokenSchema", "PromptSchema", "PromptArgumentSchema", "PromptListChangedNotificationSchema", "PromptMessageSchema", "PromptReferenceSchema", "ReadResourceRequestSchema", "ReadResourceRequestParamsSchema", "ReadResourceResultSchema", "RelatedTaskMetadataSchema", "RequestSchema", "RequestIdSchema", "RequestMetaSchema", "ResourceSchema", "ResourceContentsSchema", "ResourceLinkSchema", "ResourceListChangedNotificationSchema", "ResourceRequestParamsSchema", "ResourceTemplateSchema", "ResourceTemplateReferenceSchema", "ResourceUpdatedNotificationSchema", "ResourceUpdatedNotificationParamsSchema", "ResultMetaObjectSchema", "ResultSchema", "RoleSchema", "RootSchema", "RootsListChangedNotificationSchema", "SamplingContentSchema", "SamplingMessageSchema", "SamplingMessageContentBlockSchema", "ServerCapabilitiesSchema", "ServerNotificationSchema", "ServerRequestSchema", "ServerResultSchema", "SetLevelRequestSchema", "SetLevelRequestParamsSchema", "SingleSelectEnumSchemaSchema", "StringSchemaSchema", "SubscribeRequestSchema", "SubscribeRequestParamsSchema", "SubscriptionFilterSchema", "SubscriptionsAcknowledgedNotificationSchema", "SubscriptionsAcknowledgedNotificationParamsSchema", "SubscriptionsListenRequestSchema", "SubscriptionsListenRequestParamsSchema", "SubscriptionsListenResultSchema", "SubscriptionsListenResultMetaSchema", "TaskAugmentedRequestParamsSchema", "TaskCreationParamsSchema", "TaskMetadataSchema", "TaskSchema", "TaskStatusSchema", "TaskStatusNotificationSchema", "TaskStatusNotificationParamsSchema", "TextContentSchema", "TextResourceContentsSchema", "TitledMultiSelectEnumSchemaSchema", "TitledSingleSelectEnumSchemaSchema", "ToolSchema", "ToolAnnotationsSchema", "ToolChoiceSchema", "ToolExecutionSchema", "ToolListChangedNotificationSchema", "ToolResultContentSchema", "ToolUseContentSchema", "UnsubscribeRequestSchema", "UnsubscribeRequestParamsSchema", "UntitledMultiSelectEnumSchemaSchema", "UntitledSingleSelectEnumSchemaSchema"],
    _b = {
      IdJagTokenExchangeResponseSchema: rc,
      OAuthClientInformationFullSchema: ls,
      OAuthClientInformationSchema: nc,
      OAuthClientMetadataSchema: oc,
      OAuthClientRegistrationErrorSchema: $l,
      OAuthErrorResponseSchema: us,
      OAuthMetadataSchema: ho,
      OAuthProtectedResourceMetadataSchema: is,
      OAuthTokenRevocationRequestSchema: Tl,
      OAuthTokensSchema: cs,
      OpenIdProviderDiscoveryMetadataSchema: as,
      OpenIdProviderMetadataSchema: tc
    },
    Ag = {},
    Mg = {};
  function qg(e, t) {
    let r = e.slice(0, -6);
    Ag[r] = t;
    Mg[r] = o => t.safeParse(o).success;
  }
  for (let e of Sb) qg(e, qy[e]);
  for (let [e, t] of Object.entries(_b)) qg(e, t);
  var zb = Object.freeze(Ag),
    jg = Object.freeze(Mg);
  function yb(e) {
    switch (e) {
      case "initialize":
      case "notifications/initialized":
        return It(void 0);
      case "server/discover":
        return It(pc);
      default:
        return;
    }
  }
  var mc = 6e4,
    bb = [Tt, Qr, hr, eo],
    vb = ["inputResponses", "requestState"];
  function tg(e, t) {
    let r = e.params;
    if (!ms(r)) return {
      message: e,
      lifted: {}
    };
    let o = r._meta,
      n = ms(o) ? bb.filter(u => u in o) : [],
      s = t === "request" ? vb.filter(u => u in r) : [];
    if (n.length === 0 && s.length === 0) return {
      message: e,
      lifted: {}
    };
    let i = {},
      a = {
        ...r
      };
    if (n.length > 0 && ms(o)) {
      let u = {},
        l = {
          ...o
        };
      for (let d of n) {
        u[d] = o[d];
        delete l[d];
      }
      i.envelope = u;
      Object.keys(l).length > 0 ? a._meta = l : delete a._meta;
    }
    for (let u of s) {
      u === "inputResponses" && (i.inputResponses = a[u]);
      u === "requestState" && (i.requestState = a[u]);
      delete a[u];
    }
    return {
      message: {
        ...e,
        params: a
      },
      lifted: i
    };
  }
  function rg(e, t) {
    let r = e.validateResult(t, void 0);
    if (!(!r.ok && r.reason === "not-in-era")) return {
      "~standard": {
        version: 1,
        vendor: "mcp-wire-codec",
        validate(o) {
          let n = e.validateResult(t, o);
          return n.ok ? {
            value: n.value
          } : {
            issues: [{
              message: n.reason === "invalid" ? n.message : `not-in-era: ${t}`
            }]
          };
        }
      }
    };
  }
  function Kl(e) {
    return () => e;
  }
  var Rb = Kl(void 0),
    wb,
    ng,
    Lg = (ng = class {
      constructor(e) {
        R(this, "_transport");
        R(this, "_requestMessageId", 0);
        R(this, "_requestHandlers", new Map());
        R(this, "_requestHandlerAbortControllers", new Map());
        R(this, "_notificationHandlers", new Map());
        R(this, "_responseHandlers", new Map());
        R(this, "_progressHandlers", new Map());
        R(this, "_timeoutInfo", new Map());
        R(this, "_pendingDebouncedNotifications", new Set());
        R(this, "_negotiatedProtocolVersion");
        R(this, "_supportedProtocolVersions");
        R(this, "onclose");
        R(this, "onerror");
        R(this, "fallbackRequestHandler");
        R(this, "fallbackNotificationHandler");
        this._options = e;
        this._supportedProtocolVersions = e?.supportedProtocolVersions ?? yi;
        this.setNotificationHandler("notifications/cancelled", t => {
          this._oncancel(t);
        });
        this.setNotificationHandler("notifications/progress", t => {
          this._onprogress(t);
        });
        this.setRequestHandler("ping", t => ({}));
      }
      _shouldDropInbound(e) {}
      _outboundMetaEnvelope() {}
      _envelopeOutbound(e) {
        let t = this._outboundMetaEnvelope();
        if (t === void 0) return e;
        let r = e.params ?? {};
        return {
          ...e,
          params: {
            ...r,
            _meta: {
              ...t,
              ...r._meta
            }
          }
        };
      }
      _resolveNonCompleteResult(e, t) {
        return Promise.reject(new A(N.UnsupportedResultType, `Unsupported result type '${e.kind}' for ${t.request.method}`, {
          resultType: e.kind,
          method: t.request.method
        }));
      }
      _getRequestHandler(e) {
        return this._requestHandlers.get(e);
      }
      async _oncancel(e) {
        e.params.requestId && this._requestHandlerAbortControllers.get(e.params.requestId)?.abort(e.params.reason);
      }
      _setupTimeout(e, t, r, o, n = !1) {
        this._timeoutInfo.set(e, {
          timeoutId: setTimeout(o, t),
          startTime: Date.now(),
          timeout: t,
          maxTotalTimeout: r,
          resetTimeoutOnProgress: n,
          onTimeout: o
        });
      }
      _resetTimeout(e) {
        let t = this._timeoutInfo.get(e);
        if (!t) return !1;
        let r = Date.now() - t.startTime;
        if (t.maxTotalTimeout && r >= t.maxTotalTimeout) throw this._timeoutInfo.delete(e), new A(N.RequestTimeout, "Maximum total timeout exceeded", {
          maxTotalTimeout: t.maxTotalTimeout,
          totalElapsed: r
        });
        return clearTimeout(t.timeoutId), t.timeoutId = setTimeout(t.onTimeout, t.timeout), !0;
      }
      _cleanupTimeout(e) {
        let t = this._timeoutInfo.get(e);
        t && (clearTimeout(t.timeoutId), this._timeoutInfo.delete(e));
      }
      async connect(e) {
        this._transport = e;
        let t = this.transport?.onclose;
        this._transport.onclose = () => {
          try {
            t?.();
          } finally {
            this._onclose();
          }
        };
        let r = this.transport?.onerror;
        this._transport.onerror = n => {
          r?.(n);
          this._onerror(n);
        };
        let o = this._transport?.onmessage;
        this._transport.onmessage = (n, s) => {
          o?.(n, s);
          bo(n) || vo(n) ? this._onresponse(n) : Rr(n) ? this._onrequest(n, s) : $g(n) ? this._onnotification(n, s) : this._onerror(new Error(`Unknown message type: ${JSON.stringify(n)}`));
        };
        e.setSupportedProtocolVersions?.(this._supportedProtocolVersions);
        await this._transport.start();
      }
      _onclose() {
        let e = this._responseHandlers;
        this._responseHandlers = new Map();
        this._progressHandlers.clear();
        this._pendingDebouncedNotifications.clear();
        for (let o of this._timeoutInfo.values()) clearTimeout(o.timeoutId);
        this._timeoutInfo.clear();
        let t = this._requestHandlerAbortControllers;
        this._requestHandlerAbortControllers = new Map();
        let r = new A(N.ConnectionClosed, "Connection closed");
        this._transport = void 0;
        try {
          this.onclose?.();
        } finally {
          for (let o of e.values()) o(r);
          for (let o of t.values()) o.abort(r);
        }
      }
      _onerror(e) {
        this.onerror?.(e);
      }
      _onnotification(e, t) {
        let {
            message: r
          } = tg(e, "notification"),
          o = this._negotiatedWireCodec();
        if (t?.classification === void 0 && this._shouldDropInbound(e) === "drop") return;
        if (t?.classification !== void 0) {
          let i = Yf(t.classification);
          if (i !== o.era) {
            this._onerror(new Error(`Era mismatch on inbound notification '${r.method}': classified as ${i} but this instance serves ${o.era}`));
            return;
          }
        }
        if (Cl(r.method) && !o.hasNotificationMethod(r.method)) return;
        let n = this._notificationHandlers.get(r.method),
          s = this.fallbackNotificationHandler;
        n === void 0 && s === void 0 || Promise.resolve().then(() => n === void 0 ? s(r) : n(r, o)).catch(i => this._onerror(new Error(`Uncaught error in notification handler: ${i}`)));
      }
      _onrequest(e, t) {
        let {
            message: r,
            lifted: o
          } = tg(e, "request"),
          n = this._negotiatedWireCodec();
        if (t?.classification === void 0 && this._shouldDropInbound(e) === "drop") {
          this._onerror(new Error(`Dropped inbound request '${e.method}': not servable on this connection's protocol era`));
          return;
        }
        let s = this._transport,
          i = (y, b, T) => {
            let L = {
              jsonrpc: "2.0",
              id: r.id,
              error: {
                code: y,
                message: b,
                ...(T !== void 0 && {
                  data: T
                })
              }
            };
            s?.send(L).catch(U => this._onerror(new Error(`Failed to send an error response: ${U}`)));
          };
        if (t?.classification !== void 0) {
          let y = Yf(t.classification);
          if (y !== n.era) {
            this._onerror(new Error(`Era mismatch on inbound request '${r.method}': classified as ${y} but this instance serves ${n.era}`));
            let b = t.classification.revision ?? y;
            i(J.UnsupportedProtocolVersion, `Unsupported protocol version: ${b}`, {
              supported: this._supportedProtocolVersions,
              requested: b
            });
            return;
          }
        }
        if (kl(r.method) && !n.hasRequestMethod(r.method)) {
          i(J.MethodNotFound, "Method not found");
          return;
        }
        let a = this._requestHandlers.get(r.method) ?? this.fallbackRequestHandler;
        if (a === void 0) {
          i(J.MethodNotFound, "Method not found");
          return;
        }
        let u = n.checkInboundEnvelope(o);
        if (u !== void 0) {
          i(J.InvalidParams, u);
          return;
        }
        let l = (y, b) => this._notificationViaCodec(this._resolveOutboundCodec(y.method), y, {
            ...b,
            relatedRequestId: r.id
          }),
          d = (y, b, T) => this._requestWithSchemaViaCodec(this._resolveOutboundCodec(y.method), y, b, {
            ...T,
            relatedRequestId: r.id
          }),
          p = new AbortController();
        this._requestHandlerAbortControllers.set(r.id, p);
        let h = o.inputResponses === void 0 ? void 0 : xb(o.inputResponses),
          f = {
            sessionId: s?.sessionId,
            mcpReq: {
              id: r.id,
              method: r.method,
              _meta: r.params?._meta,
              ...(o.envelope !== void 0 && {
                envelope: o.envelope
              }),
              ...(h !== void 0 && {
                inputResponses: h.accepted
              }),
              ...(h !== void 0 && h.droppedKeys.length > 0 && {
                droppedInputResponseKeys: h.droppedKeys
              }),
              requestState: o.requestState === void 0 ? Rb : Kl(o.requestState),
              signal: p.signal,
              send: (y, b, T) => {
                let L = this._resolveOutboundCodec(y.method);
                if (this._assertOutboundRequestInEra(L, y.method), Al(b)) return d(y, b, T);
                let U = rg(L, y.method);
                if (U === void 0) throw new TypeError(`'${y.method}' is not a spec method; pass a result schema as the second argument to ctx.mcpReq.send().`);
                return d(y, U, b);
              },
              notify: l
            },
            http: t?.authInfo ? {
              authInfo: t.authInfo
            } : void 0
          },
          g = this.buildContext(f, t);
        Promise.resolve().then(() => a(r, g)).then(async y => {
          if (p.signal.aborted) return;
          let b;
          try {
            b = n.encodeResult(r.method, y, this._outboundServerInfo());
          } catch (L) {
            this._onerror(new Error(`Failed to encode result for ${r.method}: ${L}`));
            i(J.InternalError, "Internal error");
            return;
          }
          let T = {
            result: b,
            jsonrpc: "2.0",
            id: r.id
          };
          await s?.send(T);
        }, async y => {
          if (p.signal.aborted) return;
          let b = Number.isSafeInteger(y.code) ? y.code : J.InternalError,
            T = {
              jsonrpc: "2.0",
              id: r.id,
              error: {
                code: n.encodeErrorCode(b),
                message: y.message ?? "Internal error",
                ...(y.data !== void 0 && {
                  data: y.data
                })
              }
            };
          await s?.send(T);
        }).catch(y => this._onerror(new Error(`Failed to send response: ${y}`))).finally(() => {
          this._requestHandlerAbortControllers.get(r.id) === p && this._requestHandlerAbortControllers.delete(r.id);
        });
      }
      _onprogress(e) {
        let {
            progressToken: t,
            ...r
          } = e.params,
          o = Number(t),
          n = this._progressHandlers.get(o);
        if (!n) {
          this._onerror(new Error(`Received a progress notification for an unknown token: ${JSON.stringify(e)}`));
          return;
        }
        let s = this._responseHandlers.get(o),
          i = this._timeoutInfo.get(o);
        if (i && s && i.resetTimeoutOnProgress) try {
          this._resetTimeout(o);
        } catch (a) {
          this._responseHandlers.delete(o);
          this._progressHandlers.delete(o);
          this._cleanupTimeout(o);
          s(a);
          return;
        }
        n(r);
      }
      _onresponse(e) {
        let t = Number(e.id),
          r = this._responseHandlers.get(t);
        if (r === void 0) {
          this._onerror(new Error(`Received a response for an unknown message ID: ${JSON.stringify(e)}`));
          return;
        }
        this._responseHandlers.delete(t);
        this._cleanupTimeout(t);
        this._progressHandlers.delete(t);
        bo(e) ? r(e) : r(re.fromError(e.error.code, e.error.message, e.error.data));
      }
      get transport() {
        return this._transport;
      }
      async close() {
        await this._transport?.close();
      }
      request(e, t, r) {
        let o = this._resolveOutboundCodec(e.method);
        if (this._assertOutboundRequestInEra(o, e.method), Al(t)) return this._requestWithSchemaViaCodec(o, e, t, r);
        let n = rg(o, e.method);
        if (n === void 0) throw new TypeError(`'${e.method}' is not a spec method; pass a result schema as the second argument to request().`);
        return this._requestWithSchemaViaCodec(o, e, n, t);
      }
      _negotiatedWireCodec() {
        return It(this._negotiatedProtocolVersion);
      }
      _wireCodec() {
        return this._negotiatedWireCodec();
      }
      _resolveOutboundCodec(e) {
        if (this._negotiatedProtocolVersion === void 0) {
          let t = yb(e);
          if (t) return t;
        }
        return this._negotiatedWireCodec();
      }
      _assertOutboundRequestInEra(e, t) {
        if (kl(t) && !e.hasRequestMethod(t)) throw new A(N.MethodNotSupportedByProtocolVersion, `Method '${t}' is not supported by the negotiated protocol version (wire era ${e.era})`, {
          method: t,
          era: e.era
        });
      }
      _requestWithSchema(e, t, r) {
        let o = this._resolveOutboundCodec(e.method);
        return this._assertOutboundRequestInEra(o, e.method), this._requestWithSchemaViaCodec(o, e, t, r);
      }
      _requestWithSchemaViaCodec(e, t, r, o) {
        let {
            relatedRequestId: n,
            resumptionToken: s,
            onresumptiontoken: i,
            headers: a
          } = o ?? {},
          u = Date.now(),
          l,
          d;
        return new Promise((p, h) => {
          let f = v => {
            h(v);
          };
          if (!this._transport) {
            f(new Error("Not connected"));
            return;
          }
          if (this._options?.enforceStrictCapabilities === !0) try {
            this.assertCapabilityForMethod(t.method);
          } catch (v) {
            f(v);
            return;
          }
          if (o?.signal?.aborted) {
            let v = o.signal.reason;
            throw v instanceof A ? v : new A(N.RequestTimeout, String(v));
          }
          let g = e.era === pc && this._transport.hasPerRequestStream === !0 ? new AbortController() : void 0,
            y = this._requestMessageId++;
          d = y;
          let b = {
            ...t,
            jsonrpc: "2.0",
            id: y
          };
          o?.onprogress && (this._progressHandlers.set(y, o.onprogress), b.params = {
            ...t.params,
            _meta: {
              ...t.params?._meta,
              progressToken: y
            }
          });
          let T = this._envelopeOutbound(b),
            L = !1,
            U = v => {
              L || (this._progressHandlers.delete(y), g === void 0 ? this._transport?.send(this._envelopeOutbound({
                jsonrpc: "2.0",
                method: "notifications/cancelled",
                params: {
                  requestId: y,
                  reason: String(v)
                }
              }), {
                relatedRequestId: n,
                resumptionToken: s,
                onresumptiontoken: i
              }).catch(C => this._onerror(new Error(`Failed to send cancellation: ${C}`))) : g.abort(), h(v instanceof A ? v : new A(N.RequestTimeout, String(v))));
            };
          this._responseHandlers.set(y, v => {
            if (o?.signal?.aborted) return;
            if (L = !0, v instanceof Error) return h(v);
            let C;
            try {
              C = e.decodeResult(t.method, v.result);
            } catch (K) {
              return h(K instanceof Error ? K : new Error(String(K)));
            }
            if (C.kind === "invalid") return h(C.error);
            if (C.kind === "input_required") {
              if (o?.allowInputRequired === !0) return p(Eb(C));
              let K = {
                codec: e,
                request: t,
                resultSchema: r,
                options: o,
                flowStartedAt: u,
                retry: (ie, Y) => this._requestWithSchemaViaCodec(e, ie === void 0 ? {
                  method: t.method
                } : {
                  method: t.method,
                  params: ie
                }, r, Y)
              };
              return p(this._resolveNonCompleteResult(C, K));
            }
            let ee = C.result;
            Il(r, ee).then(K => {
              K.success ? p(K.data) : h(new A(N.InvalidResult, `Invalid result for ${t.method}: ${K.error}`));
            }, h);
          });
          l = () => U(o?.signal?.reason);
          o?.signal?.addEventListener("abort", l, {
            once: !0
          });
          let te = o?.timeout ?? mc,
            x = () => U(new A(N.RequestTimeout, "Request timed out", {
              timeout: te
            }));
          this._setupTimeout(y, te, o?.maxTotalTimeout, x, o?.resetTimeoutOnProgress ?? !1);
          this._transport.send(T, {
            relatedRequestId: n,
            resumptionToken: s,
            onresumptiontoken: i,
            headers: a,
            requestSignal: g?.signal
          }).catch(v => {
            this._progressHandlers.delete(y);
            h(v);
          });
        }).finally(() => {
          l && o?.signal?.removeEventListener("abort", l);
          d !== void 0 && (this._responseHandlers.delete(d), this._cleanupTimeout(d));
        });
      }
      async notification(e, t) {
        return this._notificationViaCodec(this._resolveOutboundCodec(e.method), e, t);
      }
      async _notificationViaCodec(e, t, r) {
        if (!this._transport) throw new A(N.NotConnected, "Not connected");
        if (Cl(t.method) && !e.hasNotificationMethod(t.method)) throw new A(N.MethodNotSupportedByProtocolVersion, `Notification '${t.method}' is not supported by the negotiated protocol version (wire era ${e.era})`, {
          method: t.method,
          era: e.era
        });
        this.assertNotificationCapability(t.method);
        let o = this._envelopeOutbound({
          jsonrpc: "2.0",
          ...t
        });
        if ((this._options?.debouncedNotificationMethods ?? []).includes(t.method) && !t.params && !r?.relatedRequestId) {
          if (this._pendingDebouncedNotifications.has(t.method)) return;
          this._pendingDebouncedNotifications.add(t.method);
          Promise.resolve().then(() => {
            this._pendingDebouncedNotifications.delete(t.method);
            this._transport && this._transport?.send(o, r).catch(n => this._onerror(n));
          });
          return;
        }
        await this._transport.send(o, r);
      }
      setRequestHandler(e, t, r) {
        this.assertRequestHandlerCapability(e);
        let o;
        if (typeof t == "function") {
          if (!kl(e)) throw new TypeError(`'${e}' is not a spec request method; pass schemas as the second argument to setRequestHandler().`);
          o = (n, s) => {
            let i = this._negotiatedWireCodec(),
              a = i.validateRequest(e, n);
            if (!a.ok && a.reason === "not-in-era" && (a = i.validateInputRequest(e, n)), !a.ok) throw a.reason === "not-in-era" ? new re(J.InternalError, `No wire schema for ${e} in the resolved era`) : new Error(a.message);
            return Promise.resolve(t(a.value, s));
          };
        } else if (r) o = async (n, s) => {
          let i = await Il(t.params, {
            ...n.params
          });
          if (!i.success) throw new re(J.InvalidParams, `Invalid params for ${e}: ${i.error}`);
          return r(i.data, s);
        };else throw new TypeError("setRequestHandler: handler is required");
        this._requestHandlers.set(e, this._wrapHandler(e, o));
      }
      _wrapHandler(e, t) {
        return t;
      }
      _outboundServerInfo() {}
      removeRequestHandler(e) {
        this._requestHandlers.delete(e);
      }
      assertCanSetRequestHandler(e) {
        if (this._requestHandlers.has(e)) throw new Error(`A request handler for ${e} already exists, which would be overridden`);
      }
      setNotificationHandler(e, t, r) {
        if (typeof t == "function") {
          if (!Cl(e)) throw new TypeError(`'${e}' is not a spec notification method; pass schemas as the second argument to setNotificationHandler().`);
          this._notificationHandlers.set(e, (o, n) => {
            let s = n.validateNotification(e, o);
            if (!s.ok) throw s.reason === "not-in-era" ? new re(J.InternalError, `No wire schema for ${e} in the resolved era`) : new Error(s.message);
            return Promise.resolve(t(s.value));
          });
          return;
        }
        if (!r) throw new TypeError("setNotificationHandler: handler is required");
        this._notificationHandlers.set(e, async o => {
          let n = await Il(t.params, {
            ...o.params
          });
          if (!n.success) throw new re(J.InvalidParams, `Invalid params for notification ${e}: ${n.error}`);
          await r(n.data, o);
        });
      }
      removeNotificationHandler(e) {
        this._notificationHandlers.delete(e);
      }
    }, wb = (e, t) => {
      e._negotiatedProtocolVersion = t;
    }, ng);
  function ms(e) {
    return e !== null && typeof e == "object" && !Array.isArray(e);
  }
  function Ug(e, t) {
    let r = {
      ...e
    };
    for (let o in t) {
      let n = o,
        s = t[n];
      if (s === void 0) continue;
      let i = r[n];
      r[n] = ms(i) && ms(s) ? {
        ...i,
        ...s
      } : s;
    }
    return r;
  }
  function lc(e) {
    return typeof e == "object" && e !== null && !Array.isArray(e);
  }
  function xb(e) {
    let t = {},
      r = [];
    if (!lc(e)) return {
      accepted: t,
      droppedKeys: r
    };
    for (let [o, n] of Object.entries(e)) {
      if (!lc(n) || "method" in n || "result" in n) {
        r.push(o);
        continue;
      }
      t[o] = n;
    }
    return {
      accepted: t,
      droppedKeys: r
    };
  }
  function og(e) {
    throw new A(N.SendFailed, `ctx.mcpReq.${e} is not available while fulfilling an embedded input request: the request is fulfilled locally and has no related peer request`);
  }
  function Pb(e, t, r, o, n) {
    return {
      sessionId: n,
      mcpReq: {
        id: e,
        method: t,
        _meta: r?._meta,
        requestState: Kl(void 0),
        signal: o,
        send: () => og("send"),
        notify: () => og("notify")
      }
    };
  }
  async function $b(e, t, r, o, n) {
    if (!lc(o) || typeof o.method != "string") throw new A(N.InvalidResult, `Invalid input request '${r}': each inputRequests entry must be an embedded request object with a method`, {
      key: r
    });
    let s = o.method;
    if (!t.hasInputRequestMethod(s)) throw new A(N.InvalidResult, `Invalid input request '${r}': '${s}' is not an embedded request the ${t.era} revision defines (expected elicitation/create, sampling/createMessage, or roots/list)`, {
      key: r,
      method: s
    });
    let i = e.getRequestHandler(s);
    if (i === void 0) throw new A(N.CapabilityNotSupported, `Cannot fulfil input request '${r}': no handler is registered for '${s}' on this client. Declare the corresponding capability and register a handler, or handle input_required results manually.`, {
      key: r,
      method: s
    });
    let a = lc(o.params) ? o.params : void 0;
    return await i({
      jsonrpc: "2.0",
      id: r,
      method: s,
      ...(a !== void 0 && {
        params: a
      })
    }, e.buildContext(Pb(r, s, a, n, e.sessionId)));
  }
  function Tb(e, t) {
    return {
      ...(e?.signal !== void 0 && {
        signal: e.signal
      }),
      ...(e?.onprogress !== void 0 && {
        onprogress: e.onprogress
      }),
      ...(e?.resetTimeoutOnProgress !== void 0 && {
        resetTimeoutOnProgress: e.resetTimeoutOnProgress
      }),
      ...(e?.headers !== void 0 && {
        headers: e.headers
      }),
      ...(t.timeout !== void 0 && {
        timeout: t.timeout
      }),
      ...(t.maxTotalTimeout !== void 0 && {
        maxTotalTimeout: t.maxTotalTimeout
      }),
      allowInputRequired: !0
    };
  }
  function Zg(e, t, r, o) {
    let {
        codec: n,
        request: s,
        options: i,
        flowStartedAt: a
      } = o,
      u = {
        inputRequests: r.inputRequests,
        ...(r.requestState !== void 0 && {
          requestState: r.requestState
        })
      },
      l = {
        dispatchInputRequest: (d, p, h) => $b(e, n, d, p, h),
        retry: (d, p) => o.retry(d, Tb(i, p))
      };
    return gb({
      config: t,
      method: s.method,
      originalParams: s.params,
      firstPayload: u,
      flowStartedAt: a,
      signal: i?.signal,
      requestOptions: {
        ...(i?.timeout !== void 0 && {
          timeout: i.timeout
        }),
        ...(i?.maxTotalTimeout !== void 0 && {
          maxTotalTimeout: i.maxTotalTimeout
        }),
        ...(i?.onprogress !== void 0 && {
          onprogress: i.onprogress
        })
      },
      hooks: l
    });
  }
  function Eb(e) {
    return {
      resultType: "input_required",
      inputRequests: e.inputRequests,
      ...(e.requestState !== void 0 && {
        requestState: e.requestState
      })
    };
  }
  var kb = Rd(e => {
      var t = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g,
        r = /\\([\u000b\u0020-\u00ff])/g,
        o = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
      e.parse = n;
      function n(a) {
        if (!a) throw new TypeError("argument string is required");
        var u = typeof a == "object" ? s(a) : a;
        if (typeof u != "string") throw new TypeError("argument string is required to be a string");
        var l = u.indexOf(";"),
          d = l !== -1 ? u.slice(0, l).trim() : u.trim();
        if (!o.test(d)) throw new TypeError("invalid media type");
        var p = new i(d.toLowerCase());
        if (l !== -1) {
          var h, f, g;
          for (t.lastIndex = l; f = t.exec(u);) {
            if (f.index !== l) throw new TypeError("invalid parameter format");
            l += f[0].length;
            h = f[1].toLowerCase();
            g = f[2];
            g.charCodeAt(0) === 34 && (g = g.slice(1, -1), g.indexOf("\\") !== -1 && (g = g.replace(r, "$1")));
            p.parameters[h] = g;
          }
          if (l !== u.length) throw new TypeError("invalid parameter format");
        }
        return p;
      }
      function s(a) {
        var u;
        if (typeof a.getHeader == "function" ? u = a.getHeader("content-type") : typeof a.headers == "object" && (u = a.headers && a.headers["content-type"]), typeof u != "string") throw new TypeError("content-type header is missing from object");
        return u;
      }
      function i(a) {
        this.parameters = Object.create(null);
        this.type = a;
      }
    }),
    Cb = xd(kb(), 1);
  function Dg(e) {
    if (e) try {
      return Cb.parse(e).type;
    } catch {
      let t = (e.split(";", 1)[0] ?? "").trim().toLowerCase();
      return t === "" || e.slice(t.length).includes(",") ? void 0 : t;
    }
  }
  var Ib = 10 * 1024 * 1024;
  function gs(e) {
    return e ? e instanceof Headers ? Object.fromEntries(e.entries()) : Array.isArray(e) ? Object.fromEntries(e) : {
      ...e
    } : {};
  }
  function Gl(e = fetch, t) {
    return t ? async (r, o) => e(r, {
      ...t,
      ...o,
      headers: o?.headers ? {
        ...gs(t.headers),
        ...gs(o.headers)
      } : t.headers
    }) : e;
  }
  function _s(e, t) {
    let r = typeof e;
    if (r !== typeof t) return !1;
    if (Array.isArray(e)) {
      if (!Array.isArray(t)) return !1;
      let o = e.length;
      if (o !== t.length) return !1;
      for (let n = 0; n < o; n++) if (!_s(e[n], t[n])) return !1;
      return !0;
    }
    if (r === "object") {
      if (!e || !t) return e === t;
      let o = Object.keys(e),
        n = Object.keys(t);
      if (o.length !== n.length) return !1;
      for (let s of o) if (!_s(e[s], t[s])) return !1;
      return !0;
    }
    return e === t;
  }
  function it(e) {
    return encodeURI(Ob(e));
  }
  function Ob(e) {
    return e.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  var Nb = {
      prefixItems: !0,
      items: !0,
      allOf: !0,
      anyOf: !0,
      oneOf: !0
    },
    Ab = {
      $defs: !0,
      definitions: !0,
      properties: !0,
      patternProperties: !0,
      dependentSchemas: !0
    },
    Mb = {
      id: !0,
      $id: !0,
      $ref: !0,
      $schema: !0,
      $anchor: !0,
      $vocabulary: !0,
      $comment: !0,
      default: !0,
      enum: !0,
      const: !0,
      required: !0,
      type: !0,
      maximum: !0,
      minimum: !0,
      exclusiveMaximum: !0,
      exclusiveMinimum: !0,
      multipleOf: !0,
      maxLength: !0,
      minLength: !0,
      pattern: !0,
      format: !0,
      maxItems: !0,
      minItems: !0,
      uniqueItems: !0,
      maxProperties: !0,
      minProperties: !0
    },
    qb = typeof self < "u" && self.location && self.location.origin !== "null" ? new URL(self.location.origin + self.location.pathname + location.search) : new URL("https://github.com/cfworker");
  function wr(e, t = Object.create(null), r = qb, o = "") {
    if (e && typeof e == "object" && !Array.isArray(e)) {
      let s = e.$id || e.id;
      if (s) {
        let i = new URL(s, r.href);
        i.hash.length > 1 ? t[i.href] = e : (i.hash = "", o === "" ? r = i : wr(e, t, r));
      }
    } else if (e !== !0 && e !== !1) return t;
    let n = r.href + (o ? "#" + o : "");
    if (t[n] !== void 0) throw new Error(`Duplicate schema URI "${n}".`);
    if (t[n] = e, e === !0 || e === !1) return t;
    if (e.__absolute_uri__ === void 0 && Object.defineProperty(e, "__absolute_uri__", {
      enumerable: !1,
      value: n
    }), e.$ref && e.__absolute_ref__ === void 0) {
      let s = new URL(e.$ref, r.href);
      s.hash = s.hash;
      Object.defineProperty(e, "__absolute_ref__", {
        enumerable: !1,
        value: s.href
      });
    }
    if (e.$recursiveRef && e.__absolute_recursive_ref__ === void 0) {
      let s = new URL(e.$recursiveRef, r.href);
      s.hash = s.hash;
      Object.defineProperty(e, "__absolute_recursive_ref__", {
        enumerable: !1,
        value: s.href
      });
    }
    if (e.$anchor) {
      let s = new URL("#" + e.$anchor, r.href);
      t[s.href] = e;
    }
    for (let s in e) {
      if (Mb[s]) continue;
      let i = `${o}/${it(s)}`,
        a = e[s];
      if (Array.isArray(a)) {
        if (Nb[s]) {
          let u = a.length;
          for (let l = 0; l < u; l++) wr(a[l], t, r, `${i}/${l}`);
        }
      } else if (Ab[s]) for (let u in a) wr(a[u], t, r, `${i}/${it(u)}`);else wr(a, t, r, i);
    }
    return t;
  }
  var jb = /^(\d\d\d\d)-(\d\d)-(\d\d)$/,
    Lb = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    Ub = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i,
    Zb = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    Db = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    Fb = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    Vb = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)(?:\.(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    Hb = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    Jb = /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    Bb = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    Wb = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    Kb = e => {
      if (e[0] === '"') return !1;
      let [t, r, ...o] = e.split("@");
      return !t || !r || o.length !== 0 || t.length > 64 || r.length > 253 || t[0] === "." || t.endsWith(".") || t.includes("..") || !/^[a-z0-9.-]+$/i.test(r) || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(t) ? !1 : r.split(".").every(n => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(n));
    },
    Gb = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    Yb = /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    Xb = e => e.length > 1 && e.length < 80 && (/^P\d+([.,]\d+)?W$/.test(e) || /^P[\dYMDTHS]*(\d[.,]\d+)?[YMDHS]$/.test(e) && /^P([.,\d]+Y)?([.,\d]+M)?([.,\d]+D)?(T([.,\d]+H)?([.,\d]+M)?([.,\d]+S)?)?$/.test(e));
  function St(e) {
    return e.test.bind(e);
  }
  var Fg = {
    date: Vg,
    time: Hg.bind(void 0, !1),
    "date-time": tv,
    duration: Xb,
    uri: nv,
    "uri-reference": St(Db),
    "uri-template": St(Fb),
    url: St(Vb),
    email: Kb,
    hostname: St(Zb),
    ipv4: St(Gb),
    ipv6: St(Yb),
    regex: iv,
    uuid: St(Hb),
    "json-pointer": St(Jb),
    "json-pointer-uri-fragment": St(Bb),
    "relative-json-pointer": St(Wb)
  };
  function Qb(e) {
    return e % 4 === 0 && (e % 100 !== 0 || e % 400 === 0);
  }
  function Vg(e) {
    let t = e.match(jb);
    if (!t) return !1;
    let r = +t[1],
      o = +t[2],
      n = +t[3];
    return o >= 1 && o <= 12 && n >= 1 && n <= (o == 2 && Qb(r) ? 29 : Lb[o]);
  }
  function Hg(e, t) {
    let r = t.match(Ub);
    if (!r) return !1;
    let o = +r[1],
      n = +r[2],
      s = +r[3],
      i = !!r[5];
    return (o <= 23 && n <= 59 && s <= 59 || o == 23 && n == 59 && s == 60) && (!e || i);
  }
  var ev = /t|\s/i;
  function tv(e) {
    let t = e.split(ev);
    return t.length == 2 && Vg(t[0]) && Hg(!0, t[1]);
  }
  var rv = /\/|:/,
    ov = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function nv(e) {
    return rv.test(e) && ov.test(e);
  }
  var sv = /[^\\]\\Z/;
  function iv(e) {
    if (sv.test(e)) return !1;
    try {
      return new RegExp(e, "u"), !0;
    } catch {
      return !1;
    }
  }
  function av(e) {
    let t = 0,
      r = e.length,
      o = 0,
      n;
    for (; o < r;) {
      t++;
      n = e.charCodeAt(o++);
      n >= 55296 && n <= 56319 && o < r && (n = e.charCodeAt(o), (n & 64512) == 56320 && o++);
    }
    return t;
  }
  function le(e, t, r = "2019-09", o = wr(t), n = !0, s = null, i = "#", a = "#", u = Object.create(null)) {
    if (t === !0) return {
      valid: !0,
      errors: []
    };
    if (t === !1) return {
      valid: !1,
      errors: [{
        instanceLocation: i,
        keyword: "false",
        keywordLocation: i,
        error: "False boolean schema."
      }]
    };
    let l = typeof e,
      d;
    switch (l) {
      case "boolean":
      case "number":
      case "string":
        d = l;
        break;
      case "object":
        e === null ? d = "null" : Array.isArray(e) ? d = "array" : d = "object";
        break;
      default:
        throw new Error(`Instances of "${l}" type are not supported.`);
    }
    let {
        $ref: p,
        $recursiveRef: h,
        $recursiveAnchor: f,
        type: g,
        const: y,
        enum: b,
        required: T,
        not: L,
        anyOf: U,
        allOf: te,
        oneOf: x,
        if: v,
        then: C,
        else: ee,
        format: K,
        properties: ie,
        patternProperties: Y,
        additionalProperties: _e,
        unevaluatedProperties: Ge,
        minProperties: ve,
        maxProperties: ke,
        propertyNames: ct,
        dependentRequired: Ae,
        dependentSchemas: Ye,
        dependencies: ut,
        prefixItems: Fe,
        items: Ce,
        additionalItems: _t,
        unevaluatedItems: zt,
        contains: lt,
        minContains: we,
        maxContains: Ie,
        minItems: Oe,
        maxItems: rt,
        uniqueItems: Xt,
        minimum: Ve,
        maximum: He,
        exclusiveMinimum: Me,
        exclusiveMaximum: Xe,
        multipleOf: Qe,
        minLength: dt,
        maxLength: pt,
        pattern: At,
        __absolute_ref__: ht,
        __absolute_recursive_ref__: Qt
      } = t,
      E = [];
    if (f === !0 && s === null && (s = t), h === "#") {
      let F = s === null ? o[Qt] : s,
        M = `${a}/$recursiveRef`,
        W = le(e, s === null ? t : s, r, o, n, F, i, M, u);
      W.valid || E.push({
        instanceLocation: i,
        keyword: "$recursiveRef",
        keywordLocation: M,
        error: "A subschema had errors."
      }, ...W.errors);
    }
    if (p !== void 0) {
      let F = o[ht || p];
      if (F === void 0) {
        let I = `Unresolved $ref "${p}".`;
        throw ht && ht !== p && (I += `  Absolute URI "${ht}".`), I += `
Known schemas:
- ${Object.keys(o).join(`
- `)}`, new Error(I);
      }
      let M = `${a}/$ref`,
        W = le(e, F, r, o, n, s, i, M, u);
      if (W.valid || E.push({
        instanceLocation: i,
        keyword: "$ref",
        keywordLocation: M,
        error: "A subschema had errors."
      }, ...W.errors), r === "4" || r === "7") return {
        valid: E.length === 0,
        errors: E
      };
    }
    if (Array.isArray(g)) {
      let F = g.length,
        M = !1;
      for (let W = 0; W < F; W++) if (d === g[W] || g[W] === "integer" && d === "number" && e % 1 === 0 && e === e) {
        M = !0;
        break;
      }
      M || E.push({
        instanceLocation: i,
        keyword: "type",
        keywordLocation: `${a}/type`,
        error: `Instance type "${d}" is invalid. Expected "${g.join('", "')}".`
      });
    } else g === "integer" ? (d !== "number" || e % 1 || e !== e) && E.push({
      instanceLocation: i,
      keyword: "type",
      keywordLocation: `${a}/type`,
      error: `Instance type "${d}" is invalid. Expected "${g}".`
    }) : g !== void 0 && d !== g && E.push({
      instanceLocation: i,
      keyword: "type",
      keywordLocation: `${a}/type`,
      error: `Instance type "${d}" is invalid. Expected "${g}".`
    });
    if (y !== void 0 && (d === "object" || d === "array" ? _s(e, y) || E.push({
      instanceLocation: i,
      keyword: "const",
      keywordLocation: `${a}/const`,
      error: `Instance does not match ${JSON.stringify(y)}.`
    }) : e !== y && E.push({
      instanceLocation: i,
      keyword: "const",
      keywordLocation: `${a}/const`,
      error: `Instance does not match ${JSON.stringify(y)}.`
    })), b !== void 0 && (d === "object" || d === "array" ? b.some(F => _s(e, F)) || E.push({
      instanceLocation: i,
      keyword: "enum",
      keywordLocation: `${a}/enum`,
      error: `Instance does not match any of ${JSON.stringify(b)}.`
    }) : b.some(F => e === F) || E.push({
      instanceLocation: i,
      keyword: "enum",
      keywordLocation: `${a}/enum`,
      error: `Instance does not match any of ${JSON.stringify(b)}.`
    })), L !== void 0) {
      let F = `${a}/not`;
      le(e, L, r, o, n, s, i, F).valid && E.push({
        instanceLocation: i,
        keyword: "not",
        keywordLocation: F,
        error: 'Instance matched "not" schema.'
      });
    }
    let mt = [];
    if (U !== void 0) {
      let F = `${a}/anyOf`,
        M = E.length,
        W = !1;
      for (let I = 0; I < U.length; I++) {
        let $ = U[I],
          H = Object.create(u),
          V = le(e, $, r, o, n, f === !0 ? s : null, i, `${F}/${I}`, H);
        E.push(...V.errors);
        W = W || V.valid;
        V.valid && mt.push(H);
      }
      W ? E.length = M : E.splice(M, 0, {
        instanceLocation: i,
        keyword: "anyOf",
        keywordLocation: F,
        error: "Instance does not match any subschemas."
      });
    }
    if (te !== void 0) {
      let F = `${a}/allOf`,
        M = E.length,
        W = !0;
      for (let I = 0; I < te.length; I++) {
        let $ = te[I],
          H = Object.create(u),
          V = le(e, $, r, o, n, f === !0 ? s : null, i, `${F}/${I}`, H);
        E.push(...V.errors);
        W = W && V.valid;
        V.valid && mt.push(H);
      }
      W ? E.length = M : E.splice(M, 0, {
        instanceLocation: i,
        keyword: "allOf",
        keywordLocation: F,
        error: "Instance does not match every subschema."
      });
    }
    if (x !== void 0) {
      let F = `${a}/oneOf`,
        M = E.length,
        W = x.filter((I, $) => {
          let H = Object.create(u),
            V = le(e, I, r, o, n, f === !0 ? s : null, i, `${F}/${$}`, H);
          return E.push(...V.errors), V.valid && mt.push(H), V.valid;
        }).length;
      W === 1 ? E.length = M : E.splice(M, 0, {
        instanceLocation: i,
        keyword: "oneOf",
        keywordLocation: F,
        error: `Instance does not match exactly one subschema (${W} matches).`
      });
    }
    if ((d === "object" || d === "array") && Object.assign(u, ...mt), v !== void 0) {
      let F = `${a}/if`;
      if (le(e, v, r, o, n, s, i, F, u).valid) {
        if (C !== void 0) {
          let M = le(e, C, r, o, n, s, i, `${a}/then`, u);
          M.valid || E.push({
            instanceLocation: i,
            keyword: "if",
            keywordLocation: F,
            error: 'Instance does not match "then" schema.'
          }, ...M.errors);
        }
      } else if (ee !== void 0) {
        let M = le(e, ee, r, o, n, s, i, `${a}/else`, u);
        M.valid || E.push({
          instanceLocation: i,
          keyword: "if",
          keywordLocation: F,
          error: 'Instance does not match "else" schema.'
        }, ...M.errors);
      }
    }
    if (d === "object") {
      if (T !== void 0) for (let I of T) I in e || E.push({
        instanceLocation: i,
        keyword: "required",
        keywordLocation: `${a}/required`,
        error: `Instance does not have required property "${I}".`
      });
      let F = Object.keys(e);
      if (ve !== void 0 && F.length < ve && E.push({
        instanceLocation: i,
        keyword: "minProperties",
        keywordLocation: `${a}/minProperties`,
        error: `Instance does not have at least ${ve} properties.`
      }), ke !== void 0 && F.length > ke && E.push({
        instanceLocation: i,
        keyword: "maxProperties",
        keywordLocation: `${a}/maxProperties`,
        error: `Instance does not have at least ${ke} properties.`
      }), ct !== void 0) {
        let I = `${a}/propertyNames`;
        for (let $ in e) {
          let H = `${i}/${it($)}`,
            V = le($, ct, r, o, n, s, H, I);
          V.valid || E.push({
            instanceLocation: i,
            keyword: "propertyNames",
            keywordLocation: I,
            error: `Property name "${$}" does not match schema.`
          }, ...V.errors);
        }
      }
      if (Ae !== void 0) {
        let I = `${a}/dependantRequired`;
        for (let $ in Ae) if ($ in e) {
          let H = Ae[$];
          for (let V of H) V in e || E.push({
            instanceLocation: i,
            keyword: "dependentRequired",
            keywordLocation: I,
            error: `Instance has "${$}" but does not have "${V}".`
          });
        }
      }
      if (Ye !== void 0) for (let I in Ye) {
        let $ = `${a}/dependentSchemas`;
        if (I in e) {
          let H = le(e, Ye[I], r, o, n, s, i, `${$}/${it(I)}`, u);
          H.valid || E.push({
            instanceLocation: i,
            keyword: "dependentSchemas",
            keywordLocation: $,
            error: `Instance has "${I}" but does not match dependant schema.`
          }, ...H.errors);
        }
      }
      if (ut !== void 0) {
        let I = `${a}/dependencies`;
        for (let $ in ut) if ($ in e) {
          let H = ut[$];
          if (Array.isArray(H)) for (let V of H) V in e || E.push({
            instanceLocation: i,
            keyword: "dependencies",
            keywordLocation: I,
            error: `Instance has "${$}" but does not have "${V}".`
          });else {
            let V = le(e, H, r, o, n, s, i, `${I}/${it($)}`);
            V.valid || E.push({
              instanceLocation: i,
              keyword: "dependencies",
              keywordLocation: I,
              error: `Instance has "${$}" but does not match dependant schema.`
            }, ...V.errors);
          }
        }
      }
      let M = Object.create(null),
        W = !1;
      if (ie !== void 0) {
        let I = `${a}/properties`;
        for (let $ in ie) {
          if (!($ in e)) continue;
          let H = `${i}/${it($)}`,
            V = le(e[$], ie[$], r, o, n, s, H, `${I}/${it($)}`);
          if (V.valid) u[$] = M[$] = !0;else if (W = n, E.push({
            instanceLocation: i,
            keyword: "properties",
            keywordLocation: I,
            error: `Property "${$}" does not match schema.`
          }, ...V.errors), W) break;
        }
      }
      if (!W && Y !== void 0) {
        let I = `${a}/patternProperties`;
        for (let $ in Y) {
          let H = new RegExp($, "u"),
            V = Y[$];
          for (let fe in e) {
            if (!H.test(fe)) continue;
            let er = `${i}/${it(fe)}`,
              ft = le(e[fe], V, r, o, n, s, er, `${I}/${it($)}`);
            ft.valid ? u[fe] = M[fe] = !0 : (W = n, E.push({
              instanceLocation: i,
              keyword: "patternProperties",
              keywordLocation: I,
              error: `Property "${fe}" matches pattern "${$}" but does not match associated schema.`
            }, ...ft.errors));
          }
        }
      }
      if (!W && _e !== void 0) {
        let I = `${a}/additionalProperties`;
        for (let $ in e) {
          if (M[$]) continue;
          let H = `${i}/${it($)}`,
            V = le(e[$], _e, r, o, n, s, H, I);
          V.valid ? u[$] = !0 : (W = n, E.push({
            instanceLocation: i,
            keyword: "additionalProperties",
            keywordLocation: I,
            error: `Property "${$}" does not match additional properties schema.`
          }, ...V.errors));
        }
      } else if (!W && Ge !== void 0) {
        let I = `${a}/unevaluatedProperties`;
        for (let $ in e) if (!u[$]) {
          let H = `${i}/${it($)}`,
            V = le(e[$], Ge, r, o, n, s, H, I);
          V.valid ? u[$] = !0 : E.push({
            instanceLocation: i,
            keyword: "unevaluatedProperties",
            keywordLocation: I,
            error: `Property "${$}" does not match unevaluated properties schema.`
          }, ...V.errors);
        }
      }
    } else if (d === "array") {
      rt !== void 0 && e.length > rt && E.push({
        instanceLocation: i,
        keyword: "maxItems",
        keywordLocation: `${a}/maxItems`,
        error: `Array has too many items (${e.length} > ${rt}).`
      });
      Oe !== void 0 && e.length < Oe && E.push({
        instanceLocation: i,
        keyword: "minItems",
        keywordLocation: `${a}/minItems`,
        error: `Array has too few items (${e.length} < ${Oe}).`
      });
      let F = e.length,
        M = 0,
        W = !1;
      if (Fe !== void 0) {
        let I = `${a}/prefixItems`,
          $ = Math.min(Fe.length, F);
        for (; M < $; M++) {
          let H = le(e[M], Fe[M], r, o, n, s, `${i}/${M}`, `${I}/${M}`);
          if (u[M] = !0, !H.valid && (W = n, E.push({
            instanceLocation: i,
            keyword: "prefixItems",
            keywordLocation: I,
            error: "Items did not match schema."
          }, ...H.errors), W)) break;
        }
      }
      if (Ce !== void 0) {
        let I = `${a}/items`;
        if (Array.isArray(Ce)) {
          let $ = Math.min(Ce.length, F);
          for (; M < $; M++) {
            let H = le(e[M], Ce[M], r, o, n, s, `${i}/${M}`, `${I}/${M}`);
            if (u[M] = !0, !H.valid && (W = n, E.push({
              instanceLocation: i,
              keyword: "items",
              keywordLocation: I,
              error: "Items did not match schema."
            }, ...H.errors), W)) break;
          }
        } else for (; M < F; M++) {
          let $ = le(e[M], Ce, r, o, n, s, `${i}/${M}`, I);
          if (u[M] = !0, !$.valid && (W = n, E.push({
            instanceLocation: i,
            keyword: "items",
            keywordLocation: I,
            error: "Items did not match schema."
          }, ...$.errors), W)) break;
        }
        if (!W && _t !== void 0) {
          let $ = `${a}/additionalItems`;
          for (; M < F; M++) {
            let H = le(e[M], _t, r, o, n, s, `${i}/${M}`, $);
            u[M] = !0;
            H.valid || (W = n, E.push({
              instanceLocation: i,
              keyword: "additionalItems",
              keywordLocation: $,
              error: "Items did not match additional items schema."
            }, ...H.errors));
          }
        }
      }
      if (lt !== void 0) if (F === 0 && we === void 0) E.push({
        instanceLocation: i,
        keyword: "contains",
        keywordLocation: `${a}/contains`,
        error: "Array is empty. It must contain at least one item matching the schema."
      });else if (we !== void 0 && F < we) E.push({
        instanceLocation: i,
        keyword: "minContains",
        keywordLocation: `${a}/minContains`,
        error: `Array has less items (${F}) than minContains (${we}).`
      });else {
        let I = `${a}/contains`,
          $ = E.length,
          H = 0;
        for (let V = 0; V < F; V++) {
          let fe = le(e[V], lt, r, o, n, s, `${i}/${V}`, I);
          fe.valid ? (u[V] = !0, H++) : E.push(...fe.errors);
        }
        H >= (we || 0) && (E.length = $);
        we === void 0 && Ie === void 0 && H === 0 ? E.splice($, 0, {
          instanceLocation: i,
          keyword: "contains",
          keywordLocation: I,
          error: "Array does not contain item matching schema."
        }) : we !== void 0 && H < we ? E.push({
          instanceLocation: i,
          keyword: "minContains",
          keywordLocation: `${a}/minContains`,
          error: `Array must contain at least ${we} items matching schema. Only ${H} items were found.`
        }) : Ie !== void 0 && H > Ie && E.push({
          instanceLocation: i,
          keyword: "maxContains",
          keywordLocation: `${a}/maxContains`,
          error: `Array may contain at most ${Ie} items matching schema. ${H} items were found.`
        });
      }
      if (!W && zt !== void 0) {
        let I = `${a}/unevaluatedItems`;
        for (; M < F; M++) {
          if (u[M]) continue;
          let $ = le(e[M], zt, r, o, n, s, `${i}/${M}`, I);
          u[M] = !0;
          $.valid || E.push({
            instanceLocation: i,
            keyword: "unevaluatedItems",
            keywordLocation: I,
            error: "Items did not match unevaluated items schema."
          }, ...$.errors);
        }
      }
      if (Xt) for (let I = 0; I < F; I++) {
        let $ = e[I],
          H = typeof $ == "object" && $ !== null;
        for (let V = 0; V < F; V++) {
          if (I === V) continue;
          let fe = e[V];
          ($ === fe || H && typeof fe == "object" && fe !== null && _s($, fe)) && (E.push({
            instanceLocation: i,
            keyword: "uniqueItems",
            keywordLocation: `${a}/uniqueItems`,
            error: `Duplicate items at indexes ${I} and ${V}.`
          }), I = Number.MAX_SAFE_INTEGER, V = Number.MAX_SAFE_INTEGER);
        }
      }
    } else if (d === "number") {
      if (r === "4" ? (Ve !== void 0 && (Me === !0 && e <= Ve || e < Ve) && E.push({
        instanceLocation: i,
        keyword: "minimum",
        keywordLocation: `${a}/minimum`,
        error: `${e} is less than ${Me ? "or equal to " : ""} ${Ve}.`
      }), He !== void 0 && (Xe === !0 && e >= He || e > He) && E.push({
        instanceLocation: i,
        keyword: "maximum",
        keywordLocation: `${a}/maximum`,
        error: `${e} is greater than ${Xe ? "or equal to " : ""} ${He}.`
      })) : (Ve !== void 0 && e < Ve && E.push({
        instanceLocation: i,
        keyword: "minimum",
        keywordLocation: `${a}/minimum`,
        error: `${e} is less than ${Ve}.`
      }), He !== void 0 && e > He && E.push({
        instanceLocation: i,
        keyword: "maximum",
        keywordLocation: `${a}/maximum`,
        error: `${e} is greater than ${He}.`
      }), Me !== void 0 && e <= Me && E.push({
        instanceLocation: i,
        keyword: "exclusiveMinimum",
        keywordLocation: `${a}/exclusiveMinimum`,
        error: `${e} is less than ${Me}.`
      }), Xe !== void 0 && e >= Xe && E.push({
        instanceLocation: i,
        keyword: "exclusiveMaximum",
        keywordLocation: `${a}/exclusiveMaximum`,
        error: `${e} is greater than or equal to ${Xe}.`
      })), Qe !== void 0) {
        let F = e % Qe;
        Math.abs(0 - F) >= 11920929e-14 && Math.abs(Qe - F) >= 11920929e-14 && E.push({
          instanceLocation: i,
          keyword: "multipleOf",
          keywordLocation: `${a}/multipleOf`,
          error: `${e} is not a multiple of ${Qe}.`
        });
      }
    } else if (d === "string") {
      let F = dt === void 0 && pt === void 0 ? 0 : av(e);
      dt !== void 0 && F < dt && E.push({
        instanceLocation: i,
        keyword: "minLength",
        keywordLocation: `${a}/minLength`,
        error: `String is too short (${F} < ${dt}).`
      });
      pt !== void 0 && F > pt && E.push({
        instanceLocation: i,
        keyword: "maxLength",
        keywordLocation: `${a}/maxLength`,
        error: `String is too long (${F} > ${pt}).`
      });
      At !== void 0 && !new RegExp(At, "u").test(e) && E.push({
        instanceLocation: i,
        keyword: "pattern",
        keywordLocation: `${a}/pattern`,
        error: "String does not match pattern."
      });
      K !== void 0 && Fg[K] && !Fg[K](e) && E.push({
        instanceLocation: i,
        keyword: "format",
        keywordLocation: `${a}/format`,
        error: `String does not match format "${K}".`
      });
    }
    return {
      valid: E.length === 0,
      errors: E
    };
  }
  var cv = class {
      constructor(e, t = "2019-09", r = !0) {
        R(this, "schema");
        R(this, "draft");
        R(this, "shortCircuit");
        R(this, "lookup");
        this.schema = e;
        this.draft = t;
        this.shortCircuit = r;
        this.lookup = wr(e);
      }
      validate(e) {
        return le(e, this.schema, this.draft, this.lookup, this.shortCircuit);
      }
      addSchema(e, t) {
        t && (e = {
          ...e,
          $id: t
        });
        wr(e, this.lookup);
      }
    },
    Yl = class {
      constructor(e) {
        R(this, "shortcircuit");
        R(this, "draft");
        this.shortcircuit = e?.shortcircuit ?? !0;
        this.draft = e?.draft;
      }
      _draftFor(e) {
        let t = Td(e, "pass an explicit { draft } to CfWorkerJsonSchemaValidator to validate other dialects.");
        return t === "draft-7" ? "7" : t;
      }
      getValidator(e) {
        let t = new cv(e, this.draft ?? this._draftFor(e), this.shortcircuit);
        return r => {
          let o = t.validate(r);
          return o.valid ? {
            valid: !0,
            data: r,
            errorMessage: void 0
          } : {
            valid: !1,
            data: void 0,
            errorMessage: o.errors.map(n => `${n.instanceLocation}: ${n.error}`).join("; ")
          };
        };
      }
    };
  var Jg = !0;
  var Xl;
  Xl = globalThis.crypto;
  async function uv(e) {
    return (await Xl).getRandomValues(new Uint8Array(e));
  }
  async function lv(e) {
    let t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~",
      r = Math.pow(2, 8) - Math.pow(2, 8) % t.length,
      o = "";
    for (; o.length < e;) {
      let n = await uv(e - o.length);
      for (let s of n) s < r && (o += t[s % t.length]);
    }
    return o;
  }
  async function dv(e) {
    return await lv(e);
  }
  async function pv(e) {
    let t = await (await Xl).subtle.digest("SHA-256", new TextEncoder().encode(e));
    return btoa(String.fromCharCode(...new Uint8Array(t))).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
  }
  async function Ql(e) {
    if (e || (e = 43), e < 43 || e > 128) throw `Expected a length between 43 and 128. Received ${e}.`;
    let t = await dv(e),
      r = await pv(t);
    return {
      code_verifier: t,
      code_challenge: r
    };
  }
  var zs = class extends Error {
      constructor(t, r) {
        super(t);
        this.name = "ParseError";
        this.type = r.type;
        this.field = r.field;
        this.value = r.value;
        this.line = r.line;
      }
    },
    Bg = 10,
    hv = 13,
    xr = 32;
  function ed(e) {}
  function fc(e) {
    if (typeof e == "function") throw new TypeError("`config` must be an object, got a function instead. Did you mean `createParser({onEvent: fn})`?");
    let {
        onEvent: t = ed,
        onError: r = ed,
        onRetry: o = ed,
        onComment: n,
        maxBufferSize: s
      } = e,
      i = [],
      a = 0,
      u = !0,
      l,
      d = "",
      p = 0,
      h,
      f = !1;
    function g(x) {
      if (f) throw new Error("Cannot feed parser: it was terminated after exceeding the configured max buffer size. Call `reset()` to resume parsing.");
      if (u && (u = !1, x.charCodeAt(0) === 239 && x.charCodeAt(1) === 187 && x.charCodeAt(2) === 191 && (x = x.slice(3))), i.length === 0) {
        let ee = b(x);
        ee !== "" && (i.push(ee), a = ee.length);
        y();
        return;
      }
      if (x.indexOf(`
`) === -1 && x.indexOf("\r") === -1) {
        i.push(x);
        a += x.length;
        y();
        return;
      }
      i.push(x);
      let v = i.join("");
      i.length = 0;
      a = 0;
      let C = b(v);
      C !== "" && (i.push(C), a = C.length);
      y();
    }
    function y() {
      s !== void 0 && (a + d.length <= s || (f = !0, i.length = 0, a = 0, l = void 0, d = "", p = 0, h = void 0, r(new zs(`Buffered data exceeded max buffer size of ${s} characters`, {
        type: "max-buffer-size-exceeded"
      }))));
    }
    function b(x) {
      let v = 0;
      if (x.indexOf("\r") === -1) {
        let C = x.indexOf(`
`, v);
        for (; C !== -1;) {
          if (v === C) {
            p > 0 && t({
              id: l,
              event: h,
              data: d
            });
            l = void 0;
            d = "";
            p = 0;
            h = void 0;
            v = C + 1;
            C = x.indexOf(`
`, v);
            continue;
          }
          let ee = x.charCodeAt(v);
          if (Wg(x, v, ee)) {
            let K = x.charCodeAt(v + 5) === xr ? v + 6 : v + 5,
              ie = x.slice(K, C);
            if (p === 0 && x.charCodeAt(C + 1) === Bg) {
              t({
                id: l,
                event: h,
                data: ie
              });
              l = void 0;
              d = "";
              h = void 0;
              v = C + 2;
              C = x.indexOf(`
`, v);
              continue;
            }
            d = p === 0 ? ie : `${d}
${ie}`;
            p++;
          } else Kg(x, v, ee) ? h = x.slice(x.charCodeAt(v + 6) === xr ? v + 7 : v + 6, C) || void 0 : T(x, v, C);
          v = C + 1;
          C = x.indexOf(`
`, v);
        }
        return x.slice(v);
      }
      for (; v < x.length;) {
        let C = x.indexOf("\r", v),
          ee = x.indexOf(`
`, v),
          K = -1;
        if (C !== -1 && ee !== -1 ? K = C < ee ? C : ee : C !== -1 ? C === x.length - 1 ? K = -1 : K = C : ee !== -1 && (K = ee), K === -1) break;
        T(x, v, K);
        v = K + 1;
        x.charCodeAt(v - 1) === hv && x.charCodeAt(v) === Bg && v++;
      }
      return x.slice(v);
    }
    function T(x, v, C) {
      if (v === C) {
        U();
        return;
      }
      let ee = x.charCodeAt(v);
      if (Wg(x, v, ee)) {
        let ve = x.charCodeAt(v + 5) === xr ? v + 6 : v + 5,
          ke = x.slice(ve, C);
        d = p === 0 ? ke : `${d}
${ke}`;
        p++;
        return;
      }
      if (Kg(x, v, ee)) {
        h = x.slice(x.charCodeAt(v + 6) === xr ? v + 7 : v + 6, C) || void 0;
        return;
      }
      if (ee === 105 && x.charCodeAt(v + 1) === 100 && x.charCodeAt(v + 2) === 58) {
        let ve = x.slice(x.charCodeAt(v + 3) === xr ? v + 4 : v + 3, C);
        ve.includes("\0") || (l = ve);
        return;
      }
      if (ee === 58) {
        if (n) {
          let ve = x.slice(v, C);
          n(ve.slice(x.charCodeAt(v + 1) === xr ? 2 : 1));
        }
        return;
      }
      let K = x.slice(v, C),
        ie = K.indexOf(":");
      if (ie === -1) {
        L(K, "", K);
        return;
      }
      let Y = K.slice(0, ie),
        _e = K.charCodeAt(ie + 1) === xr ? 2 : 1,
        Ge = K.slice(ie + _e);
      L(Y, Ge, K);
    }
    function L(x, v, C) {
      switch (x) {
        case "event":
          h = v || void 0;
          break;
        case "data":
          d = p === 0 ? v : `${d}
${v}`;
          p++;
          break;
        case "id":
          v.includes("\0") || (l = v);
          break;
        case "retry":
          /^\d+$/.test(v) ? o(parseInt(v, 10)) : r(new zs(`Invalid \`retry\` value: "${v}"`, {
            type: "invalid-retry",
            value: v,
            line: C
          }));
          break;
        default:
          r(new zs(`Unknown field "${x.length > 20 ? `${x.slice(0, 20)}\u2026` : x}"`, {
            type: "unknown-field",
            field: x,
            value: v,
            line: C
          }));
          break;
      }
    }
    function U() {
      p > 0 && t({
        id: l,
        event: h,
        data: d
      });
      l = void 0;
      d = "";
      p = 0;
      h = void 0;
    }
    function te(x = {}) {
      if (x.consume && i.length > 0) {
        let v = i.join("");
        T(v, 0, v.length);
      }
      u = !0;
      l = void 0;
      d = "";
      p = 0;
      h = void 0;
      i.length = 0;
      a = 0;
      f = !1;
    }
    return {
      feed: g,
      reset: te
    };
  }
  function Wg(e, t, r) {
    return r === 100 && e.charCodeAt(t + 1) === 97 && e.charCodeAt(t + 2) === 116 && e.charCodeAt(t + 3) === 97 && e.charCodeAt(t + 4) === 58;
  }
  function Kg(e, t, r) {
    return r === 101 && e.charCodeAt(t + 1) === 118 && e.charCodeAt(t + 2) === 101 && e.charCodeAt(t + 3) === 110 && e.charCodeAt(t + 4) === 116 && e.charCodeAt(t + 5) === 58;
  }
  var Sc = class extends Event {
    constructor(t, r) {
      var o, n;
      super(t);
      this.code = (o = r?.code) != null ? o : void 0;
      this.message = (n = r?.message) != null ? n : void 0;
    }
    [Symbol.for("nodejs.util.inspect.custom")](t, r, o) {
      return o(Gg(this), r);
    }
    [Symbol.for("Deno.customInspect")](t, r) {
      return t(Gg(this), r);
    }
  };
  function mv(e) {
    let t = globalThis.DOMException;
    return typeof t == "function" ? new t(e, "SyntaxError") : new SyntaxError(e);
  }
  function td(e) {
    return e instanceof Error ? "errors" in e && Array.isArray(e.errors) ? e.errors.map(td).join(", ") : "cause" in e && e.cause instanceof Error ? `${e}: ${td(e.cause)}` : e.message : `${e}`;
  }
  function Gg(e) {
    return {
      type: e.type,
      message: e.message,
      code: e.code,
      defaultPrevented: e.defaultPrevented,
      cancelable: e.cancelable,
      timeStamp: e.timeStamp
    };
  }
  var Xg = e => {
      throw TypeError(e);
    },
    ud = (e, t, r) => t.has(e) || Xg("Cannot " + r),
    X = (e, t, r) => (ud(e, t, "read from private field"), r ? r.call(e) : t.get(e)),
    Se = (e, t, r) => t.has(e) ? Xg("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r),
    ce = (e, t, r, o) => (ud(e, t, "write to private field"), t.set(e, r), r),
    Nt = (e, t, r) => (ud(e, t, "access private method"), r),
    Ze,
    Pr,
    Ro,
    gc,
    _c,
    vs,
    Po,
    Rs,
    Yt,
    wo,
    $o,
    xo,
    ys,
    at,
    rd,
    od,
    nd,
    Yg,
    sd,
    id,
    bs,
    ad,
    cd,
    $r = class extends EventTarget {
      constructor(t, r) {
        var o, n;
        super();
        Se(this, at);
        this.CONNECTING = 0;
        this.OPEN = 1;
        this.CLOSED = 2;
        Se(this, Ze);
        Se(this, Pr);
        Se(this, Ro);
        Se(this, gc);
        Se(this, _c);
        Se(this, vs);
        Se(this, Po);
        Se(this, Rs, null);
        Se(this, Yt);
        Se(this, wo);
        Se(this, $o, null);
        Se(this, xo, null);
        Se(this, ys, null);
        Se(this, od, async s => {
          var i;
          X(this, wo).reset();
          let {
            body: a,
            redirected: u,
            status: l,
            headers: d
          } = s;
          if (l === 204) {
            Nt(this, at, bs).call(this, "Server sent HTTP 204, not reconnecting", 204);
            this.close();
            return;
          }
          if (u ? ce(this, Ro, new URL(s.url)) : ce(this, Ro, void 0), l !== 200) {
            Nt(this, at, bs).call(this, `Non-200 status code (${l})`, l);
            return;
          }
          if (!(d.get("content-type") || "").startsWith("text/event-stream")) {
            Nt(this, at, bs).call(this, 'Invalid content type, expected "text/event-stream"', l);
            return;
          }
          if (X(this, Ze) === this.CLOSED) return;
          ce(this, Ze, this.OPEN);
          let p = new Event("open");
          if ((i = X(this, ys)) == null || i.call(this, p), this.dispatchEvent(p), typeof a != "object" || !a || !("getReader" in a)) {
            Nt(this, at, bs).call(this, "Invalid response body, expected a web ReadableStream", l);
            this.close();
            return;
          }
          let h = new TextDecoder(),
            f = a.getReader(),
            g = !0;
          do {
            let {
              done: y,
              value: b
            } = await f.read();
            b && X(this, wo).feed(h.decode(b, {
              stream: !y
            }));
            y && (g = !1, X(this, wo).reset(), Nt(this, at, ad).call(this));
          } while (g);
        });
        Se(this, nd, s => {
          ce(this, Yt, void 0);
          !(s.name === "AbortError" || s.type === "aborted") && Nt(this, at, ad).call(this, td(s));
        });
        Se(this, sd, s => {
          typeof s.id == "string" && ce(this, Rs, s.id);
          let i = new MessageEvent(s.event || "message", {
            data: s.data,
            origin: X(this, Ro) ? X(this, Ro).origin : X(this, Pr).origin,
            lastEventId: s.id || ""
          });
          X(this, xo) && (!s.event || s.event === "message") && X(this, xo).call(this, i);
          this.dispatchEvent(i);
        });
        Se(this, id, s => {
          ce(this, vs, s);
        });
        Se(this, cd, () => {
          ce(this, Po, void 0);
          X(this, Ze) === this.CONNECTING && Nt(this, at, rd).call(this);
        });
        try {
          if (t instanceof URL) ce(this, Pr, t);else if (typeof t == "string") ce(this, Pr, new URL(t, fv()));else throw new Error("Invalid URL");
        } catch {
          throw mv("An invalid or illegal string was specified");
        }
        ce(this, wo, fc({
          onEvent: X(this, sd),
          onRetry: X(this, id)
        }));
        ce(this, Ze, this.CONNECTING);
        ce(this, vs, 3e3);
        ce(this, _c, (o = r?.fetch) != null ? o : globalThis.fetch);
        ce(this, gc, (n = r?.withCredentials) != null ? n : !1);
        Nt(this, at, rd).call(this);
      }
      get readyState() {
        return X(this, Ze);
      }
      get url() {
        return X(this, Pr).href;
      }
      get withCredentials() {
        return X(this, gc);
      }
      get onerror() {
        return X(this, $o);
      }
      set onerror(t) {
        ce(this, $o, t);
      }
      get onmessage() {
        return X(this, xo);
      }
      set onmessage(t) {
        ce(this, xo, t);
      }
      get onopen() {
        return X(this, ys);
      }
      set onopen(t) {
        ce(this, ys, t);
      }
      addEventListener(t, r, o) {
        let n = r;
        super.addEventListener(t, n, o);
      }
      removeEventListener(t, r, o) {
        let n = r;
        super.removeEventListener(t, n, o);
      }
      close() {
        X(this, Po) && clearTimeout(X(this, Po));
        X(this, Ze) !== this.CLOSED && (X(this, Yt) && X(this, Yt).abort(), ce(this, Ze, this.CLOSED), ce(this, Yt, void 0));
      }
    };
  Ze = new WeakMap();
  Pr = new WeakMap();
  Ro = new WeakMap();
  gc = new WeakMap();
  _c = new WeakMap();
  vs = new WeakMap();
  Po = new WeakMap();
  Rs = new WeakMap();
  Yt = new WeakMap();
  wo = new WeakMap();
  $o = new WeakMap();
  xo = new WeakMap();
  ys = new WeakMap();
  at = new WeakSet();
  rd = function () {
    ce(this, Ze, this.CONNECTING);
    ce(this, Yt, new AbortController());
    X(this, _c)(X(this, Pr), Nt(this, at, Yg).call(this)).then(X(this, od)).catch(X(this, nd));
  };
  od = new WeakMap();
  nd = new WeakMap();
  Yg = function () {
    var e;
    let t = {
      mode: "cors",
      redirect: "follow",
      headers: {
        Accept: "text/event-stream",
        ...(X(this, Rs) ? {
          "Last-Event-ID": X(this, Rs)
        } : void 0)
      },
      cache: "no-store",
      signal: (e = X(this, Yt)) == null ? void 0 : e.signal
    };
    return "window" in globalThis && (t.credentials = this.withCredentials ? "include" : "same-origin"), t;
  };
  sd = new WeakMap();
  id = new WeakMap();
  bs = function (e, t) {
    var r;
    X(this, Ze) !== this.CLOSED && ce(this, Ze, this.CLOSED);
    let o = new Sc("error", {
      code: t,
      message: e
    });
    (r = X(this, $o)) == null || r.call(this, o);
    this.dispatchEvent(o);
  };
  ad = function (e, t) {
    var r;
    if (X(this, Ze) === this.CLOSED) return;
    ce(this, Ze, this.CONNECTING);
    let o = new Sc("error", {
      code: t,
      message: e
    });
    (r = X(this, $o)) == null || r.call(this, o);
    this.dispatchEvent(o);
    ce(this, Po, setTimeout(X(this, cd), X(this, vs)));
  };
  cd = new WeakMap();
  $r.CONNECTING = 0;
  $r.OPEN = 1;
  $r.CLOSED = 2;
  function fv() {
    let e = "document" in globalThis ? globalThis.document : void 0;
    return e && typeof e == "object" && "baseURI" in e && typeof e.baseURI == "string" ? e.baseURI : void 0;
  }
  var zc = class extends TransformStream {
    constructor({
      onError: t,
      onRetry: r,
      onComment: o,
      maxBufferSize: n
    } = {}) {
      let s;
      super({
        start(i) {
          s = fc({
            onEvent: a => {
              i.enqueue(a);
            },
            onError(a) {
              typeof t == "function" && t(a);
              (t === "terminate" || a.type === "max-buffer-size-exceeded") && i.error(a);
            },
            onRetry: r,
            onComment: o,
            maxBufferSize: n
          });
        },
        transform(i) {
          s.feed(i);
        }
      });
    }
  };
  var To,
    ws = (To = class extends Error {
      static [Symbol.hasInstance](t) {
        return Ke(this, t);
      }
      static isInstance(t) {
        if (typeof this != "function") throw new TypeError("isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)`");
        return Ke(this, t);
      }
      constructor(t) {
        super(t);
        this.name = new.target.name;
        yr(this, new.target);
      }
    }, Object.defineProperty(To, "mcpBrand", {
      value: "mcp.OAuthClientFlowError"
    }), To),
    Eo,
    Sd = (Eo = class extends ws {
      constructor(r, o, n) {
        super(`Issuer mismatch in ${r === "metadata" ? "authorization server metadata (RFC 8414 \xA73.3)" : "authorization response (RFC 9207)"}: expected ${JSON.stringify(o)}, received ${JSON.stringify(n)}`);
        R(this, "kind");
        R(this, "expected");
        R(this, "received");
        this.kind = r;
        this.expected = o;
        this.received = n;
      }
    }, Object.defineProperty(Eo, "mcpBrand", {
      value: "mcp.IssuerMismatchError"
    }), Eo),
    ko,
    gv = (ko = class extends ws {
      constructor(r) {
        super(`Dynamic Client Registration rejected (HTTP ${r.status}): ${r.body}`);
        R(this, "status");
        R(this, "body");
        R(this, "submittedMetadata");
        this.status = r.status;
        this.body = r.body;
        this.submittedMetadata = r.submittedMetadata;
      }
    }, Object.defineProperty(ko, "mcpBrand", {
      value: "mcp.RegistrationRejectedError"
    }), ko),
    Co,
    dS = (Co = class extends ws {
      constructor(r) {
        super(`Refusing to send credentials to non-https token endpoint '${r}'. OAuth token requests MUST use TLS (localhost / 127.0.0.1 / ::1 are exempt).`);
        R(this, "tokenEndpoint");
        this.tokenEndpoint = r;
      }
    }, Object.defineProperty(Co, "mcpBrand", {
      value: "mcp.InsecureTokenEndpointError"
    }), Co),
    Io,
    ld = (Io = class extends ws {
      constructor(t, r) {
        super(`Authorization server changed between redirect and callback (redirected to ${JSON.stringify(t)}, callback resolved ${JSON.stringify(r)}); refusing to send authorization_code/code_verifier to a different token endpoint`);
        this.recordedIssuer = t;
        this.currentIssuer = r;
      }
    }, Object.defineProperty(Io, "mcpBrand", {
      value: "mcp.AuthorizationServerMismatchError"
    }), Io),
    Oo,
    Qg = (Oo = class extends ws {
      constructor(r) {
        super(`Insufficient scope${r.requiredScope ? `: required "${r.requiredScope}"` : ""}`);
        R(this, "requiredScope");
        R(this, "resourceMetadataUrl");
        R(this, "errorDescription");
        this.requiredScope = r.requiredScope;
        this.resourceMetadataUrl = r.resourceMetadataUrl;
        this.errorDescription = r.errorDescription;
      }
    }, Object.defineProperty(Oo, "mcpBrand", {
      value: "mcp.InsufficientScopeError"
    }), Oo);
  function eS(e, t, r) {
    if (e !== void 0) return e.issuer === void 0 ? (r?.canPersistStamp !== !1 && console.warn("[mcp-sdk] SEP-2352: stored OAuth credential has no 'issuer' stamp (pre-upgrade storage or provider not round-tripping the value). SEP-2352 isolation is inactive for this read; ensure your provider round-trips the issuer field."), e) : pS(e.issuer, t) ? e : void 0;
  }
  function pS(e, t) {
    return e === t || e.endsWith("/") && e.slice(0, -1) === t || t.endsWith("/") && t.slice(0, -1) === e;
  }
  function hS(e) {
    if (e == null) return !1;
    let t = e;
    return typeof t.tokens == "function" && typeof t.clientInformation == "function";
  }
  async function Sv(e, t, r) {
    let {
      resourceMetadataUrl: o,
      scope: n
    } = Tr(t.response);
    if ((await Rc(e, {
      serverUrl: t.serverUrl,
      resourceMetadataUrl: o,
      scope: n,
      fetchFn: t.fetchFn,
      ...r
    })) !== "AUTHORIZED") throw new De();
  }
  function mS(e, t) {
    return {
      token: async () => (await e.tokens())?.access_token,
      onUnauthorized: async r => Sv(e, r, t)
    };
  }
  var No,
    De = (No = class extends Error {
      static [Symbol.hasInstance](t) {
        return Ke(this, t);
      }
      static isInstance(t) {
        if (typeof this != "function") throw new TypeError("isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)`");
        return Ke(this, t);
      }
      constructor(t) {
        super(t ?? "Unauthorized");
        this.name = "UnauthorizedError";
        yr(this, new.target);
      }
    }, Object.defineProperty(No, "mcpBrand", {
      value: "mcp.UnauthorizedError"
    }), No);
  function zd(e) {
    return e?.authorization_response_iss_parameter_supported === !0;
  }
  function yd({
    iss: e,
    expectedIssuer: t,
    issParameterSupported: r
  }) {
    if (t !== void 0) {
      if (e === void 0) {
        if (r) throw new Sd("authorization_response", t, void 0);
        return;
      }
      if (e !== t) throw new Sd("authorization_response", t, e);
    }
  }
  function dd(...e) {
    let t = new Set();
    for (let r of e) if (r) for (let o of r.split(/\s+/)) o && t.add(o);
    return t.size > 0 ? [...t].join(" ") : void 0;
  }
  function _v(e, t) {
    if (!e) return !1;
    let r = new Set((t ?? "").split(/\s+/).filter(Boolean));
    for (let o of e.split(/\s+/)) if (o && !r.has(o)) return !0;
    return !1;
  }
  async function fS(e, t, r, o, n) {
    if (typeof e == "string") return {
      authorizationCode: e,
      iss: t
    };
    let s = e.get("iss") ?? void 0,
      i = e.get("code");
    if (i) return {
      authorizationCode: i,
      iss: s
    };
    let a = (await r.discoveryState?.())?.authorizationServerMetadata;
    if (!a) try {
      a = (await yS(o, n)).authorizationServerMetadata;
    } catch {
      a = void 0;
    }
    if (!a) throw new De("Authorization callback failed and the issuer could not be verified");
    yd({
      iss: s,
      expectedIssuer: a.issuer,
      issParameterSupported: zd(a)
    });
    let u = e.get("error");
    throw u ? new vr(u, e.get("error_description") ?? u, e.get("error_uri") ?? void 0) : new De("Authorization callback contained neither `code` nor `error`");
  }
  function zv(e) {
    return ["client_secret_basic", "client_secret_post", "none"].includes(e);
  }
  var pd = "code",
    hd = "S256";
  function yv(e, t) {
    let r = e.client_secret !== void 0;
    return "token_endpoint_auth_method" in e && e.token_endpoint_auth_method && zv(e.token_endpoint_auth_method) && (t.length === 0 || t.includes(e.token_endpoint_auth_method)) ? e.token_endpoint_auth_method : t.length === 0 ? r ? "client_secret_basic" : "none" : r && t.includes("client_secret_basic") ? "client_secret_basic" : r && t.includes("client_secret_post") ? "client_secret_post" : t.includes("none") ? "none" : r ? "client_secret_post" : "none";
  }
  function bv(e, t, r, o) {
    let {
      client_id: n,
      client_secret: s
    } = t;
    switch (e) {
      case "client_secret_basic":
        vv(n, s, r);
        return;
      case "client_secret_post":
        Rv(n, s, o);
        return;
      case "none":
        wv(n, o);
        return;
      default:
        throw new Error(`Unsupported client authentication method: ${e}`);
    }
  }
  function vv(e, t, r) {
    if (!t) throw new Error("client_secret_basic authentication requires a client_secret");
    let o = btoa(`${e}:${t}`);
    r.set("Authorization", `Basic ${o}`);
  }
  function Rv(e, t, r) {
    r.set("client_id", e);
    t && r.set("client_secret", t);
  }
  function wv(e, t) {
    t.set("client_id", e);
  }
  function gS(e) {
    return e === "localhost" || e === "127.0.0.1" || e === "[::1]" || e === "::1";
  }
  function xv(e) {
    let t = new URL(String(e));
    if (t.protocol !== "https:" && !gS(t.hostname)) throw new dS(t.href);
    return t;
  }
  function Pv(e) {
    for (let t of e ?? []) {
      let r;
      try {
        r = new URL(t);
      } catch {
        continue;
      }
      if (r.protocol !== "http:" && r.protocol !== "https:" || gS(r.hostname)) return "native";
    }
    return "web";
  }
  function $v(e) {
    let t = e.clientMetadata;
    return {
      ...t,
      grant_types: t.grant_types ?? (e.redirectUrl === void 0 ? void 0 : ["authorization_code", "refresh_token"]),
      application_type: t.application_type ?? Pv(t.redirect_uris)
    };
  }
  async function tS(e) {
    let t = e instanceof Response ? e.status : void 0,
      r = e instanceof Response ? await e.text() : e;
    try {
      let o = us.parse(JSON.parse(r));
      return vr.fromResponse(o);
    } catch (o) {
      let n = `${t ? `HTTP ${t}: ` : ""}Invalid OAuth error response: ${o}. Raw body: ${r}`;
      return new vr(br.ServerError, n);
    }
  }
  async function Rc(e, t) {
    try {
      return await md(e, t);
    } catch (r) {
      if (r instanceof vr) {
        if (r.code === br.InvalidClient || r.code === br.UnauthorizedClient) return await e.invalidateCredentials?.("client"), await e.invalidateCredentials?.("tokens"), await md(e, t);
        if (r.code === br.InvalidGrant) return await e.invalidateCredentials?.("tokens"), await md(e, t);
      }
      throw r;
    }
  }
  function Tv(e) {
    let {
        requestedScope: t,
        resourceMetadata: r,
        authServerMetadata: o,
        clientMetadata: n
      } = e,
      s = t || r?.scopes_supported?.join(" ") || n.scope;
    return s && o?.scopes_supported?.includes("offline_access") && !s.split(" ").includes("offline_access") && n.grant_types?.includes("refresh_token") && (s = `${s} offline_access`), s;
  }
  async function md(e, {
    serverUrl: t,
    authorizationCode: r,
    iss: o,
    scope: n,
    resourceMetadataUrl: s,
    fetchFn: i,
    skipIssuerMetadataValidation: a,
    forceReauthorization: u
  }) {
    let l = $v(e),
      d = await e.discoveryState?.(),
      p,
      h,
      f,
      g,
      y = s;
    if (!y && d?.resourceMetadataUrl && (y = new URL(d.resourceMetadataUrl)), d?.authorizationServerUrl) {
      if (h = d.authorizationServerUrl, p = d.resourceMetadata, f = d.authorizationServerMetadata ?? (await zS(h, {
        fetchFn: i,
        skipIssuerValidation: a
      })), !p) try {
        p = await SS(t, {
          resourceMetadataUrl: y
        }, i);
      } catch (Y) {
        if (Y instanceof TypeError) throw Y;
      }
      (f !== d.authorizationServerMetadata || p !== d.resourceMetadata) && (await e.saveDiscoveryState?.({
        authorizationServerUrl: String(h),
        resourceMetadataUrl: y?.toString(),
        resourceMetadata: p,
        authorizationServerMetadata: f
      }));
    } else {
      let Y = await yS(t, {
        resourceMetadataUrl: y,
        fetchFn: i,
        skipIssuerMetadataValidation: a
      });
      h = Y.authorizationServerUrl;
      f = Y.authorizationServerMetadata;
      p = Y.resourceMetadata;
      g = {
        authorizationServerUrl: String(h),
        resourceMetadataUrl: y?.toString(),
        resourceMetadata: p,
        authorizationServerMetadata: f
      };
    }
    let b = f?.issuer ?? String(h),
      T = {
        issuer: b
      };
    if (await e.saveAuthorizationServerUrl?.(b), r !== void 0) {
      let Y = d?.authorizationServerMetadata?.issuer ?? d?.authorizationServerUrl;
      if (Y === void 0) {
        if (e.saveDiscoveryState !== void 0) throw new ld("discoveryState was not available on the callback leg; ensure your provider persists discoveryState alongside codeVerifier", b);
        console.warn("[mcp-sdk] OAuthClientProvider does not implement saveDiscoveryState()/discoveryState(); the SEP-2352 callback-leg authorization-server binding cannot be checked. Implement discoveryState (persist alongside codeVerifier) \u2014 see docs/migration/upgrade-to-v2.md \xA7SEP-2352.");
      } else if (!pS(Y, b)) throw new ld(Y, b);
    }
    g && (await e.saveDiscoveryState?.(g));
    let L = await kv(t, e, p);
    L && (await e.saveResourceUrl?.(String(L)));
    let U = Tv({
        requestedScope: n,
        resourceMetadata: p,
        authServerMetadata: f,
        clientMetadata: e.clientMetadata
      }),
      te = await Promise.resolve(e.clientInformation(T)),
      x = eS(te, b, {
        canPersistStamp: e.saveClientInformation !== void 0
      });
    if (x === void 0 && te?.issuer && e.saveClientInformation === void 0) throw new ld(te.issuer, b);
    if (x && x.issuer === void 0 && (x = {
      ...x,
      issuer: b
    }, await e.saveClientInformation?.(x, T)), !x) {
      if (r !== void 0) throw new Error("Existing OAuth client information is required when exchanging an authorization code");
      let Y = f?.client_id_metadata_document_supported === !0,
        _e = e.clientMetadataUrl;
      if (_e && !Ev(_e)) throw new vr(br.InvalidClientMetadata, `clientMetadataUrl must be a valid HTTPS URL with a non-root pathname, got: ${_e}`);
      if (Y && _e) {
        x = {
          client_id: _e,
          issuer: b
        };
        await e.saveClientInformation?.(x, T);
      } else {
        if (!e.saveClientInformation) throw new Error("OAuth client information must be saveable for dynamic registration");
        x = {
          ...(await Lv(h, {
            metadata: f,
            clientMetadata: l,
            scope: U,
            fetchFn: i
          })),
          issuer: b
        };
        await e.saveClientInformation(x, T);
      }
    }
    let v = !e.redirectUrl;
    if (r !== void 0 || v) {
      r !== void 0 && yd({
        iss: o,
        expectedIssuer: f?.issuer,
        issParameterSupported: zd(f)
      });
      let Y = await jv(e, h, {
        metadata: f,
        resource: L,
        authorizationCode: r,
        iss: o,
        scope: U,
        fetchFn: i
      });
      return await e.saveTokens({
        ...Y,
        issuer: b
      }, T), "AUTHORIZED";
    }
    let C = eS(await e.tokens(T), b);
    if (C && C.issuer === void 0 && (C = {
      ...C,
      issuer: b
    }, await e.saveTokens(C, T)), C?.refresh_token && !u) try {
      let Y = await qv(h, {
        metadata: f,
        clientInformation: x,
        refreshToken: C.refresh_token,
        resource: L,
        addClientAuthentication: e.addClientAuthentication,
        fetchFn: i
      });
      return await e.saveTokens({
        ...Y,
        issuer: b
      }, T), "AUTHORIZED";
    } catch (Y) {
      if (Y instanceof dS || !(!(Y instanceof vr) || Y.code === br.ServerError)) throw Y;
    }
    let ee = e.state ? await e.state() : void 0,
      {
        authorizationUrl: K,
        codeVerifier: ie
      } = await Av(h, {
        metadata: f,
        clientInformation: x,
        state: ee,
        redirectUrl: e.redirectUrl,
        scope: U,
        resource: L
      });
    return await e.saveCodeVerifier(ie), await e.redirectToAuthorization(K), "REDIRECT";
  }
  function Ev(e) {
    if (!e) return !1;
    try {
      let t = new URL(e);
      return t.protocol === "https:" && t.pathname !== "/";
    } catch {
      return !1;
    }
  }
  async function kv(e, t, r) {
    let o = sg(e);
    if (t.validateResourceURL) return await t.validateResourceURL(o, r?.resource);
    if (r) {
      if (!ig({
        requestedResource: o,
        configuredResource: r.resource
      })) throw new Error(`Protected resource ${r.resource} does not match expected ${o} (or origin)`);
      return new URL(r.resource);
    }
  }
  function Tr(e) {
    let t = e.headers.get("WWW-Authenticate");
    if (!t) return {};
    let [r, o] = t.split(" ");
    if (r?.toLowerCase() !== "bearer" || !o) return {};
    let n = yc(e, "resource_metadata") || void 0,
      s;
    if (n) try {
      s = new URL(n);
    } catch {}
    let i = yc(e, "scope") || void 0,
      a = yc(e, "error") || void 0,
      u = yc(e, "error_description") || void 0;
    return {
      resourceMetadataUrl: s,
      scope: i,
      error: a,
      errorDescription: u
    };
  }
  function yc(e, t) {
    let r = e.headers.get("WWW-Authenticate");
    if (!r) return null;
    let o = new RegExp(String.raw`${t}=(?:"([^"]+)"|([^\s,]+))`),
      n = r.match(o);
    if (n) {
      let s = n[1] || n[2];
      if (s) return s;
    }
    return null;
  }
  async function SS(e, t, r = fetch) {
    let o = await Ov(e, "oauth-protected-resource", r, {
      protocolVersion: t?.protocolVersion,
      metadataUrl: t?.resourceMetadataUrl
    });
    if (!o || o.status === 404) throw await o?.text?.().catch(() => {}), new Error("Resource server does not implement OAuth 2.0 Protected Resource Metadata.");
    if (!o.ok) throw await o.text?.().catch(() => {}), new Error(`HTTP ${o.status} trying to load well-known OAuth protected resource metadata.`);
    return is.parse(await o.json());
  }
  async function _S(e, t, r = fetch) {
    try {
      return await r(e, {
        headers: t
      });
    } catch (o) {
      if (!(o instanceof TypeError) || !Jg) throw o;
      if (t) try {
        return await r(e, {});
      } catch (n) {
        if (!(n instanceof TypeError)) throw n;
        return;
      }
      return;
    }
  }
  function Cv(e, t = "", r = {}) {
    return t.endsWith("/") && (t = t.slice(0, -1)), r.prependPathname ? `${t}/.well-known/${e}` : `/.well-known/${e}${t}`;
  }
  async function rS(e, t, r = fetch) {
    return await _S(e, {
      "MCP-Protocol-Version": t
    }, r);
  }
  function Iv(e, t) {
    return e ? t === "/" ? !1 : e.status >= 400 && e.status < 500 || e.status === 502 : !0;
  }
  async function Ov(e, t, r, o) {
    let n = new URL(e),
      s = o?.protocolVersion ?? Xr,
      i;
    if (o?.metadataUrl) i = new URL(o.metadataUrl);else {
      let u = Cv(t, n.pathname);
      i = new URL(u, o?.metadataServerUrl ?? n);
      i.search = n.search;
    }
    let a = await rS(i, s, r);
    return !o?.metadataUrl && Iv(a, n.pathname) && (a = await rS(new URL(`/.well-known/${t}`, n), s, r)), a;
  }
  function Nv(e) {
    let t = typeof e == "string" ? new URL(e) : e,
      r = t.pathname !== "/",
      o = [];
    if (!r) return o.push({
      url: new URL("/.well-known/oauth-authorization-server", t.origin),
      type: "oauth"
    }, {
      url: new URL("/.well-known/openid-configuration", t.origin),
      type: "oidc"
    }), o;
    let n = t.pathname;
    return n.endsWith("/") && (n = n.slice(0, -1)), o.push({
      url: new URL(`/.well-known/oauth-authorization-server${n}`, t.origin),
      type: "oauth"
    }, {
      url: new URL(`/.well-known/openid-configuration${n}`, t.origin),
      type: "oidc"
    }, {
      url: new URL(`${n}/.well-known/openid-configuration`, t.origin),
      type: "oidc"
    }), o;
  }
  async function zS(e, {
    fetchFn: t = fetch,
    protocolVersion: r = Xr,
    skipIssuerValidation: o = !1
  } = {}) {
    let n = {
        "MCP-Protocol-Version": r,
        Accept: "application/json"
      },
      s = Nv(e);
    for (let {
      url: i,
      type: a
    } of s) {
      let u = await _S(i, n, t);
      if (!u) continue;
      if (!u.ok) {
        if (await u.text?.().catch(() => {}), u.status >= 400 && u.status < 500 || u.status === 502) continue;
        throw new Error(`HTTP ${u.status} trying to load ${a === "oauth" ? "OAuth" : "OpenID provider"} metadata from ${i}`);
      }
      let l = a === "oauth" ? ho.parse(await u.json()) : as.parse(await u.json());
      if (!o) {
        let d = typeof e == "string" ? e : e.href;
        if (!(l.issuer === d || d.endsWith("/") && l.issuer === d.slice(0, -1))) throw new Sd("metadata", d, l.issuer);
      }
      return l;
    }
  }
  async function yS(e, t) {
    let r, o;
    try {
      r = await SS(e, {
        resourceMetadataUrl: t?.resourceMetadataUrl
      }, t?.fetchFn);
      r.authorization_servers && r.authorization_servers.length > 0 && (o = r.authorization_servers[0]);
    } catch (s) {
      if (s instanceof TypeError) throw s;
    }
    o || (o = String(new URL("/", e)));
    let n = await zS(o, {
      fetchFn: t?.fetchFn,
      skipIssuerValidation: t?.skipIssuerMetadataValidation
    });
    return {
      authorizationServerUrl: o,
      authorizationServerMetadata: n,
      resourceMetadata: r
    };
  }
  async function Av(e, {
    metadata: t,
    clientInformation: r,
    redirectUrl: o,
    scope: n,
    state: s,
    resource: i
  }) {
    let a;
    if (t) {
      if (a = new URL(t.authorization_endpoint), !t.response_types_supported.includes(pd)) throw new Error(`Incompatible auth server: does not support response type ${pd}`);
      if (t.code_challenge_methods_supported && !t.code_challenge_methods_supported.includes(hd)) throw new Error(`Incompatible auth server: does not support code challenge method ${hd}`);
    } else a = new URL("/authorize", e);
    let u = await Ql(),
      l = u.code_verifier,
      d = u.code_challenge;
    return a.searchParams.set("response_type", pd), a.searchParams.set("client_id", r.client_id), a.searchParams.set("code_challenge", d), a.searchParams.set("code_challenge_method", hd), a.searchParams.set("redirect_uri", String(o)), s && a.searchParams.set("state", s), n && a.searchParams.set("scope", n), n?.split(" ").includes("offline_access") && a.searchParams.append("prompt", "consent"), i && a.searchParams.set("resource", i.href), {
      authorizationUrl: a,
      codeVerifier: l
    };
  }
  function Mv(e, t, r) {
    return new URLSearchParams({
      grant_type: "authorization_code",
      code: e,
      code_verifier: t,
      redirect_uri: String(r)
    });
  }
  async function bS(e, {
    metadata: t,
    tokenRequestParams: r,
    clientInformation: o,
    addClientAuthentication: n,
    resource: s,
    fetchFn: i
  }) {
    let a = xv(t?.token_endpoint ?? new URL("/token", e)),
      u = new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      });
    s && r.set("resource", s.href);
    n ? await n(u, r, a, t) : o && bv(yv(o, t?.token_endpoint_auth_methods_supported ?? []), o, u, r);
    let l = await (i ?? fetch)(a, {
      method: "POST",
      headers: u,
      body: r
    });
    if (!l.ok) throw await tS(l);
    let d = await l.json();
    try {
      return cs.parse(d);
    } catch (p) {
      throw typeof d == "object" && d !== null && "error" in d ? await tS(JSON.stringify(d)) : p;
    }
  }
  async function qv(e, {
    metadata: t,
    clientInformation: r,
    refreshToken: o,
    resource: n,
    addClientAuthentication: s,
    fetchFn: i
  }) {
    return {
      refresh_token: o,
      ...(await bS(e, {
        metadata: t,
        tokenRequestParams: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: o
        }),
        clientInformation: r,
        addClientAuthentication: s,
        resource: n,
        fetchFn: i
      }))
    };
  }
  async function jv(e, t, {
    metadata: r,
    resource: o,
    authorizationCode: n,
    iss: s,
    scope: i,
    fetchFn: a
  } = {}) {
    n !== void 0 && yd({
      iss: s,
      expectedIssuer: r?.issuer,
      issParameterSupported: zd(r)
    });
    let u = i ?? e.clientMetadata.scope,
      l;
    if (e.prepareTokenRequest && (l = await e.prepareTokenRequest(u)), !l) {
      if (!n) throw new Error("Either provider.prepareTokenRequest() or authorizationCode is required");
      if (!e.redirectUrl) throw new Error("redirectUrl is required for authorization_code flow");
      l = Mv(n, await e.codeVerifier(), e.redirectUrl);
    }
    let d = await e.clientInformation({
      issuer: r?.issuer ?? String(t)
    });
    return bS(t, {
      metadata: r,
      tokenRequestParams: l,
      clientInformation: d ?? void 0,
      addClientAuthentication: e.addClientAuthentication,
      resource: o,
      fetchFn: a
    });
  }
  async function Lv(e, {
    metadata: t,
    clientMetadata: r,
    scope: o,
    fetchFn: n
  }) {
    let s;
    if (t) {
      if (!t.registration_endpoint) throw new Error("Incompatible auth server: does not support dynamic client registration");
      s = new URL(t.registration_endpoint);
    } else s = new URL("/register", e);
    let i = {
        ...r,
        ...(o === void 0 ? {} : {
          scope: o
        })
      },
      a = await (n ?? fetch)(s, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(i)
      });
    if (!a.ok) throw new gv({
      status: a.status,
      body: await a.text(),
      submittedMetadata: i
    });
    return ls.parse(await a.json());
  }
  var bc = new Set(["tools/list", "prompts/list", "resources/list", "resources/templates/list", "server/discover"]),
    Uv = class {
      constructor(e) {
        R(this, "_entries", new Map());
        R(this, "_maxEntries");
        R(this, "_stamp", 0);
        R(this, "_cappedSize", 0);
        this._maxEntries = e?.maxEntries ?? 512;
      }
      get size() {
        return this._entries.size;
      }
      get(e) {
        return this._entries.get(fd(e));
      }
      set(e, t) {
        let r = fd(e),
          o = bc.has(e.method),
          n = !this._entries.has(r);
        if (!o && n && this._maxEntries > 0 && this._cappedSize >= this._maxEntries) {
          for (let i of this._entries.keys()) if (!bc.has(i.slice(0, i.indexOf("\0")))) {
            this._entries.delete(i);
            this._cappedSize--;
            break;
          }
        }
        let s = ++this._stamp;
        return this._entries.set(r, {
          ...t,
          stamp: s
        }), n && !o && this._cappedSize++, s;
      }
      delete(e) {
        this._entries.delete(fd(e)) && !bc.has(e.method) && this._cappedSize--;
      }
      evict(e) {
        let t = `${e}\0`,
          r = bc.has(e);
        for (let o of this._entries.keys()) o.startsWith(t) && (this._entries.delete(o), r || this._cappedSize--);
      }
      clear() {
        this._entries.clear();
        this._cappedSize = 0;
      }
    };
  function fd(e) {
    return `${e.method}\0${JSON.stringify([e.partition ?? "", e.params ?? ""])}`;
  }
  function gd(e, t) {
    return t === void 0 ? e : `${e}\0${t}`;
  }
  var Zv = 864e5,
    Dv = class {
      constructor(e, t, r = () => {}, o = "", n = Date.now) {
        R(this, "_evictionGeneration", new Map());
        R(this, "_toolIndex");
        R(this, "_toolOutputValidatorIndex");
        R(this, "_serverIdentity", "");
        this._store = e;
        this._isUserSupplied = t;
        this._reportError = r;
        this._cachePartition = o;
        this._now = n;
      }
      now() {
        return this._now();
      }
      setServerIdentity(e) {
        this._serverIdentity = e;
      }
      _partitionFor(e) {
        return JSON.stringify([this._serverIdentity, e === "public" ? "" : this._cachePartition]);
      }
      async _probe(e, t) {
        let r = {
            method: e,
            params: t ?? ""
          },
          o = this._partitionFor("private"),
          n = await this._store.get({
            ...r,
            partition: o
          });
        if (n !== void 0) return n;
        let s = this._partitionFor("public");
        if (s === o) return;
        let i = await this._store.get({
          ...r,
          partition: s
        });
        return i?.scope === "public" ? i : void 0;
      }
      async evict(e) {
        this._evictionGeneration.set(e, (this._evictionGeneration.get(e) ?? 0) + 1);
        await this._deleteBoth(e, "");
      }
      async _deleteBoth(e, t) {
        let r = this._partitionFor("private"),
          o = this._partitionFor("public");
        try {
          await this._store.delete({
            method: e,
            params: t,
            partition: r
          });
        } catch (n) {
          this._reportError(n);
        }
        if (o !== r) try {
          await this._store.delete({
            method: e,
            params: t,
            partition: o
          });
        } catch (n) {
          this._reportError(n);
        }
      }
      async evictKey(e, t) {
        let r = gd(e, t),
          o = this._evictionGeneration.get(r);
        o !== void 0 && this._evictionGeneration.set(r, o + 1);
        await this._deleteBoth(e, t);
      }
      captureGeneration(e, t) {
        let r = gd(e, t),
          o = this._evictionGeneration.get(r) ?? 0;
        return this._evictionGeneration.set(r, o), o;
      }
      async write(e, t, r, o) {
        if ((this._evictionGeneration.get(gd(e, o?.params)) ?? 0) !== r) return;
        let n = o?.params ?? "",
          s = this._partitionFor("private"),
          i = this._partitionFor("public"),
          a = (o?.scope ?? "private") === "public" ? i : s;
        try {
          await this._store.set({
            method: e,
            params: n,
            partition: a
          }, {
            value: Fv(t),
            expiresAt: o?.expiresAt,
            scope: o?.scope
          });
        } catch (u) {
          this._reportError(u);
        }
        if (i !== s) try {
          await this._store.delete({
            method: e,
            params: n,
            partition: a === s ? i : s
          });
        } catch (u) {
          this._reportError(u);
        }
      }
      async read(e, t) {
        let r = await this._probe(e, t);
        if (!(r?.expiresAt === void 0 || !(r.expiresAt > this.now()))) try {
          let o = JSON.parse(r.value);
          if (typeof o != "object" || o === null || Array.isArray(o)) throw new TypeError("cached document is not an object");
          return {
            value: o
          };
        } catch (o) {
          this._reportError(o);
          await this._deleteBoth(e, t ?? "");
          return;
        }
      }
      resetForReconnect() {
        this._isUserSupplied || this._store.clear();
        this._evictionGeneration.clear();
        this._toolIndex = void 0;
        this._toolOutputValidatorIndex = void 0;
        this._serverIdentity = "";
      }
      async toolDefinition(e) {
        let t = await this._probe("tools/list");
        if (t === void 0) {
          this._toolIndex = void 0;
          return;
        }
        if (this._toolIndex?.stamp !== t.stamp) {
          let r = this._decodeListTools(t),
            o = new Map();
          if (r !== void 0) for (let n of r.tools) o.set(n.name, n);
          this._toolIndex = {
            stamp: t.stamp,
            byName: o
          };
        }
        return this._toolIndex.byName.get(e);
      }
      async outputValidator(e, t) {
        let r = await this._probe("tools/list");
        if (r === void 0) {
          this._toolOutputValidatorIndex = void 0;
          return;
        }
        if (this._toolOutputValidatorIndex?.stamp !== r.stamp) {
          let o = this._decodeListTools(r) ?? {
              tools: []
            },
            n = new Map();
          for (let s of o.tools) {
            let i = t(s);
            i !== void 0 && n.set(s.name, i);
          }
          this._toolOutputValidatorIndex = {
            stamp: r.stamp,
            byName: n
          };
        }
        return this._toolOutputValidatorIndex.byName.get(e);
      }
      _decodeListTools(e) {
        try {
          let t = JSON.parse(e.value);
          if (!Array.isArray(t?.tools) || !t.tools.every(r => r !== null && typeof r == "object")) throw new TypeError("cached tools/list document has a malformed tools array");
          return t;
        } catch (t) {
          this._reportError(t);
          return;
        }
      }
    };
  function Fv(e) {
    let t;
    try {
      t = JSON.stringify(e);
    } catch (r) {
      throw new TypeError(`cache value is not JSON-serializable: ${r instanceof Error ? r.message : String(r)}`);
    }
    if (typeof t != "string") throw new TypeError("cache value is not JSON-serializable: it has no JSON representation");
    return t;
  }
  var vS = Symbol.for("mcp.authSeamEscape");
  function Ee(e) {
    if (typeof e == "object" && e !== null || typeof e == "function") try {
      Object.defineProperty(e, vS, {
        value: !0,
        configurable: !0
      });
    } catch {}
    return e;
  }
  function Vv(e) {
    return (typeof e == "object" && e !== null || typeof e == "function") && e[vS] === !0;
  }
  var Hv = -32022,
    Jv = new Set([-32001, -32020, -32021]);
  function Bv(e, t) {
    switch (e.kind) {
      case "result":
        return Wv(e.result, t);
      case "rpc-error":
        return RS(e, t);
      case "http-error":
        return Kv(e, t);
      case "network-error":
        return oS(e.error, t);
      case "auth-required":
        return {
          kind: "error",
          error: e.error
        };
      case "closed":
        return t.transportKind === "stdio" ? {
          kind: "legacy"
        } : oS(new Error("Connection closed during the version negotiation probe"), t);
      case "timeout":
        return t.transportKind === "stdio" ? {
          kind: "legacy"
        } : {
          kind: "error",
          error: new A(N.RequestTimeout, `Version negotiation probe timed out after ${e.timeoutMs}ms`, {
            timeout: e.timeoutMs
          })
        };
    }
  }
  function Wv(e, t) {
    let r = It(pc).validateResult("server/discover", e);
    if (!r.ok) return {
      kind: "legacy"
    };
    let o = r.value.supportedVersions,
      n = t.clientModernVersions.find(s => o.includes(s));
    return n !== void 0 ? {
      kind: "modern",
      version: n,
      discover: r.value
    } : t.fallbackAvailable ? {
      kind: "legacy"
    } : {
      kind: "error",
      error: new dc({
        supported: [...o],
        requested: t.requestedVersion
      })
    };
  }
  function RS(e, t) {
    let {
      code: r,
      message: o,
      data: n
    } = e;
    if (r === Hv) {
      let s = Xv(n);
      if (s === void 0) return {
        kind: "legacy"
      };
      let i = new dc({
          supported: s,
          requested: Qv(n) ?? t.requestedVersion
        }, o),
        a = Ss(s),
        u = t.clientModernVersions.find(l => a.includes(l));
      return u !== void 0 ? {
        kind: "corrective",
        version: u,
        error: i
      } : a.length > 0 ? {
        kind: "error",
        error: i
      } : t.fallbackAvailable ? {
        kind: "legacy"
      } : {
        kind: "error",
        error: i
      };
    }
    return Jv.has(r) ? {
      kind: "legacy"
    } : {
      kind: "legacy"
    };
  }
  function Kv(e, t) {
    if (e.status === 401 || e.status === 403) {
      let o = e.status === 403;
      return {
        kind: "error",
        error: new st(o ? N.ClientHttpForbidden : N.ClientHttpAuthentication, `Version negotiation failed: ${o ? "the server denied access (HTTP 403)" : "the server requires authorization (HTTP 401)"}`, {
          status: e.status,
          statusText: e.statusText,
          text: e.body
        })
      };
    }
    if (e.status >= 500) return {
      kind: "error",
      error: new st(N.EraNegotiationFailed, `Version negotiation failed: the server answered the probe with HTTP ${e.status}`, {
        status: e.status,
        statusText: e.statusText,
        text: e.body
      })
    };
    let r = eR(e.body);
    return r !== void 0 ? RS(r, t) : {
      kind: "legacy"
    };
  }
  function oS(e, t) {
    return t.environment === "browser" && Gv(e) ? {
      kind: "legacy"
    } : {
      kind: "error",
      error: new A(N.EraNegotiationFailed, `Version negotiation probe failed: ${Yv(e)}`, {
        cause: e
      })
    };
  }
  function Gv(e) {
    return e instanceof TypeError || e instanceof Error && e.name === "TypeError";
  }
  function Yv(e) {
    return e instanceof Error ? e.message : String(e);
  }
  function Xv(e) {
    if (typeof e != "object" || e === null) return;
    let t = e.supported;
    if (!(!Array.isArray(t) || t.length === 0 || !t.every(r => typeof r == "string"))) return t;
  }
  function Qv(e) {
    if (typeof e != "object" || e === null) return;
    let t = e.requested;
    return typeof t == "string" ? t : void 0;
  }
  function eR(e) {
    if (e === void 0 || e === "") return;
    let t;
    try {
      t = JSON.parse(e);
    } catch {
      return;
    }
    if (typeof t != "object" || t === null) return;
    let r = t.error;
    if (typeof r != "object" || r === null) return;
    let {
      code: o,
      message: n,
      data: s
    } = r;
    if (typeof o == "number") return {
      code: o,
      message: typeof n == "string" ? n : "",
      data: s
    };
  }
  var tR = "legacy";
  function rR(e, t) {
    let r = e?.mode ?? tR;
    if (r === "legacy") return {
      kind: "legacy"
    };
    let o = e?.probe ?? {};
    if (typeof r == "object") {
      if (!Ot(r.pin)) throw new TypeError(`versionNegotiation: { pin: '${r.pin}' } is not a modern protocol revision \u2014 pinning is for 2026-07-28 and later; omit versionNegotiation (or use mode: 'legacy') for 2025-era servers.`);
      return {
        kind: "pin",
        version: r.pin,
        probe: o
      };
    }
    let n = t ? Ss(t) : [];
    return {
      kind: "auto",
      modernVersions: n.length > 0 ? n : [...jl],
      fallbackAvailable: t ? Ll(t).length > 0 : !0,
      probe: o
    };
  }
  function nS() {
    let e = globalThis;
    return e.window !== void 0 && e.document !== void 0 ? "browser" : "node";
  }
  function sS(e) {
    return "stderr" in e && "pid" in e ? "stdio" : "http";
  }
  var oR = class wS {
      constructor(t) {
        R(this, "_pending");
        R(this, "_probeCounter", 0);
        R(this, "_savedOnMessage");
        R(this, "_savedOnError");
        R(this, "_savedOnClose");
        R(this, "_closeDelivered", !1);
        this._transport = t;
        this._savedOnMessage = t.onmessage;
        this._savedOnError = t.onerror;
        this._savedOnClose = t.onclose;
      }
      static async open(t) {
        let r = new wS(t);
        t.onmessage = o => {
          let n = r._pending;
          if (n !== void 0 && (bo(o) || vo(o)) && o.id === n.id) {
            r._pending = void 0;
            bo(o) ? n.resolve({
              kind: "response",
              result: o.result
            }) : n.resolve({
              kind: "response",
              error: o.error
            });
            return;
          }
        };
        t.onerror = o => {
          r._savedOnError?.(o);
        };
        t.onclose = () => {
          let o = r._pending;
          o !== void 0 && (r._pending = void 0, o.resolve({
            kind: "closed"
          }));
          r._closeDelivered = !0;
          r._savedOnClose?.();
        };
        try {
          await t.start();
        } catch (o) {
          throw r.detach(), o;
        }
        return r;
      }
      async exchange(t, r) {
        let o = `server-discover-probe-${++this._probeCounter}`;
        return new Promise(n => {
          let s = !1,
            i = u => {
              s || (s = !0, clearTimeout(a), this._pending?.id === o && (this._pending = void 0), n(u));
            },
            a = setTimeout(() => i({
              kind: "timeout"
            }), r);
          this._pending = {
            id: o,
            resolve: i
          };
          this._transport.send(t(o)).catch(u => i({
            kind: "send-error",
            error: u
          }));
        });
      }
      detach() {
        if (this._pending = void 0, this._transport.onmessage = this._savedOnMessage, this._transport.onerror = this._savedOnError, this._closeDelivered && this._savedOnClose !== void 0) {
          let t = this._savedOnClose,
            r = this._transport,
            o = !1,
            n = () => {
              if (!o) {
                o = !0;
                return;
              }
              t();
            };
          r.onclose = n;
          _d.set(r, () => {
            r.onclose === n && (r.onclose = t);
          });
        } else this._transport.onclose = this._savedOnClose;
      }
      release() {
        this.detach();
        let t = this._transport,
          r = t.start,
          o = !0;
        t.start = async function () {
          if (o) {
            o = !1;
            t.start = r;
            return;
          }
          return r.call(t);
        };
      }
    },
    _d = new WeakMap();
  function iS(e) {
    let t = _d.get(e);
    _d.delete(e);
    t?.();
  }
  function nR(e, t, r, o) {
    return {
      jsonrpc: "2.0",
      id: e,
      method: "server/discover",
      params: {
        _meta: It(t).outboundEnvelope({
          protocolVersion: t,
          clientInfo: r,
          clientCapabilities: o
        })
      }
    };
  }
  function sR(e, t) {
    switch (e.kind) {
      case "response":
        return e.error === void 0 ? {
          kind: "result",
          result: e.result
        } : {
          kind: "rpc-error",
          ...e.error
        };
      case "send-error":
        {
          let r = e.error;
          if (Vv(r) || r instanceof De || r instanceof Error && r.name === "UnauthorizedError") return {
            kind: "auth-required",
            error: r
          };
          if (r instanceof st) {
            let o = r.data?.text;
            return {
              kind: "http-error",
              status: r.data.status,
              body: typeof o == "string" ? o : void 0,
              statusText: r.data.statusText
            };
          }
          return {
            kind: "network-error",
            error: r
          };
        }
      case "closed":
        return {
          kind: "closed"
        };
      case "timeout":
        return {
          kind: "timeout",
          timeoutMs: t
        };
    }
  }
  async function xS(e, t) {
    let r = e.probe.timeoutMs ?? t.defaultTimeoutMs,
      o = Math.max(0, e.probe.maxRetries ?? 0),
      n = e.kind === "pin" ? [e.version] : e.modernVersions,
      s = e.kind === "auto" && e.fallbackAvailable,
      i = await oR.open(t.transport),
      a = async () => {
        let l = n[0],
          d = !1,
          p = o;
        for (;;) {
          let h = await i.exchange(y => nR(y, l, t.clientInfo, t.capabilities), r);
          if (h.kind === "timeout" && p > 0) {
            p--;
            continue;
          }
          let f = sR(h, r),
            g = Bv(f, {
              clientModernVersions: n,
              requestedVersion: l,
              fallbackAvailable: s,
              environment: t.environment,
              transportKind: t.transportKind
            });
          switch (g.kind) {
            case "modern":
              return {
                era: "modern",
                version: g.version,
                discover: g.discover
              };
            case "corrective":
              if (d) throw g.error;
              d = !0;
              l = g.version;
              continue;
            case "legacy":
              {
                let y = f.kind === "closed" ? "the connection closed during the server/discover probe" : void 0;
                if (e.kind === "pin") throw new A(N.EraNegotiationFailed, y === void 0 ? `Version negotiation failed: the server did not offer pinned protocol version ${e.version} via server/discover (no fallback in pin mode)` : `Version negotiation failed: ${y} before the server offered pinned protocol version ${e.version} (no fallback in pin mode)`);
                if (!e.fallbackAvailable) throw new A(N.EraNegotiationFailed, y === void 0 ? "Version negotiation failed: the server gave no modern evidence and this client supports no pre-2026-07-28 protocol version to fall back to" : `Version negotiation failed: ${y} and this client supports no pre-2026-07-28 protocol version to fall back to`);
                if (y !== void 0 && t.disposableProbe !== !0) throw new A(N.EraNegotiationFailed, `Version negotiation failed: ${y} (this transport probed in place \u2014 the disposable sibling probe requires the SDK's base StdioClientTransport)`);
                return {
                  era: "legacy"
                };
              }
            case "error":
              throw g.error;
          }
        }
      },
      u;
    try {
      u = await a();
    } catch (l) {
      throw i.detach(), l;
    }
    return i.release(), u;
  }
  function iR(e) {
    let t = Object.getPrototypeOf(e);
    if (t === null || !Object.prototype.hasOwnProperty.call(t, "_dispose")) return;
    let r = e._serverParams;
    return typeof r == "object" && r !== null && typeof r.command == "string" ? r : void 0;
  }
  async function aR(e, t, r, o) {
    let n = t.constructor,
      s = new n({
        ...r,
        stderr: "ignore"
      }),
      i = t.close,
      a = !1,
      u,
      l = new Promise((p, h) => {
        u = () => h(aS());
      });
    t.close = async function () {
      return a = !0, u?.(), i.call(t);
    };
    let d;
    try {
      let p = xS(e, {
        ...o,
        transport: s,
        transportKind: "stdio",
        disposableProbe: !0
      });
      p.catch(() => {});
      d = await Promise.race([p, l]);
    } finally {
      await cR(s);
      t.close = i;
    }
    if (a) throw aS();
    return d;
  }
  function aS() {
    return new A(N.EraNegotiationFailed, "Version negotiation failed: the transport was closed during the server/discover probe");
  }
  async function cR(e) {
    try {
      let t = e._dispose;
      await (typeof t == "function" ? t.call(e) : e.close());
    } catch {}
  }
  function cS(e) {
    let t = e._meta?.[Et];
    return jg.Implementation(t) ? t : void 0;
  }
  function vc(e, t) {
    if (!(!e || t === null || typeof t != "object")) {
      if (e.type === "object" && e.properties && typeof e.properties == "object") {
        let r = t,
          o = e.properties;
        for (let n of Object.keys(o)) {
          let s = o[n];
          r[n] === void 0 && Object.prototype.hasOwnProperty.call(s, "default") && (r[n] = s.default);
          r[n] !== void 0 && vc(s, r[n]);
        }
      }
      if (Array.isArray(e.anyOf)) for (let r of e.anyOf) typeof r != "boolean" && vc(r, t);
      if (Array.isArray(e.oneOf)) for (let r of e.oneOf) typeof r != "boolean" && vc(r, t);
    }
  }
  function uR(e) {
    if (!e) return {
      supportsFormMode: !1,
      supportsUrlMode: !1
    };
    let t = e.form !== void 0,
      r = e.url !== void 0;
    return {
      supportsFormMode: t || !t && !r,
      supportsUrlMode: r
    };
  }
  function lR(e) {
    if (typeof e == "object" && e !== null && (e.kind === "legacy" && !("supportedVersions" in e) && !("discover" in e) || e.kind === "modern" && gr.safeParse(e.discover).success)) return e;
    throw new A(N.EraNegotiationFailed, "connect({ prior }): unrecognized prior \u2014 expected { kind: 'modern', discover } or { kind: 'legacy' }");
  }
  var uS = {
      "notifications/tools/list_changed": ["tools/list"],
      "notifications/prompts/list_changed": ["prompts/list"],
      "notifications/resources/list_changed": ["resources/list", "resources/templates/list"]
    },
    dR = 64,
    PS = class extends Lg {
      constructor(t, r) {
        super(r);
        R(this, "_serverCapabilities");
        R(this, "_serverVersion");
        R(this, "_capabilities");
        R(this, "_instructions");
        R(this, "_jsonSchemaValidator");
        R(this, "_cache");
        R(this, "_defaultCacheTtlMs");
        R(this, "_listMaxPages");
        R(this, "_listChangedDebounceTimers", new Map());
        R(this, "_listChangedConfig");
        R(this, "_enforceStrictCapabilities");
        R(this, "_versionNegotiation");
        R(this, "_supportedProtocolVersionsOption");
        R(this, "_inputRequiredDriverConfig");
        R(this, "_listenState", new Map());
        R(this, "_nextListenId", 0);
        R(this, "_autoOpenedSubscription");
        R(this, "_discoverResult");
        this._clientInfo = t;
        this._capabilities = r?.capabilities ? {
          ...r.capabilities
        } : {};
        this._jsonSchemaValidator = r?.jsonSchemaValidator ?? new Yl();
        this._enforceStrictCapabilities = r?.enforceStrictCapabilities ?? !1;
        this._versionNegotiation = r?.versionNegotiation;
        this._supportedProtocolVersionsOption = r?.supportedProtocolVersions;
        this._inputRequiredDriverConfig = Ng(r?.inputRequired);
        this._cache = new Dv(r?.responseCacheStore ?? new Uv(), r?.responseCacheStore !== void 0, o => this._reportStoreError(o), r?.cachePartition ?? "");
        this._defaultCacheTtlMs = r?.defaultCacheTtlMs ?? 0;
        this._listMaxPages = r?.listMaxPages ?? dR;
        r?.listChanged && (this._listChangedConfig = r.listChanged);
      }
      _resetConnectionState() {
        if (this._negotiatedProtocolVersion = void 0, this._serverCapabilities = void 0, this._serverVersion = void 0, this._instructions = void 0, this._discoverResult = void 0, this._autoOpenedSubscription = void 0, this._listenState.size > 0) {
          let t = new A(N.ConnectionClosed, "subscriptions/listen: client reconnected or closed; subscription state from the previous connection was reset");
          for (let r of this._listenState.values()) r.settle({
            cause: "remote",
            error: t
          });
        }
        this._listenState.clear();
        for (let t of this._listChangedDebounceTimers.values()) clearTimeout(t);
        this._listChangedDebounceTimers.clear();
        this._cache.resetForReconnect();
      }
      async close() {
        try {
          await super.close();
        } finally {
          this._resetConnectionState();
        }
      }
      buildContext(t, r) {
        return t;
      }
      _shouldDropInbound(t) {
        if (this._negotiatedProtocolVersion !== void 0 && Ot(this._negotiatedProtocolVersion) && Rr(t)) return "drop";
      }
      _outboundMetaEnvelope() {
        let t = this._negotiatedProtocolVersion;
        if (t !== void 0) return this._wireCodec().outboundEnvelope({
          protocolVersion: t,
          clientInfo: this._clientInfo,
          clientCapabilities: this._capabilities
        });
      }
      _resolveNonCompleteResult(t, r) {
        return this._inputRequiredDriverConfig.autoFulfill ? Zg({
          getRequestHandler: o => this._getRequestHandler(o),
          buildContext: o => this.buildContext(o, void 0),
          sessionId: this.transport?.sessionId
        }, this._inputRequiredDriverConfig, t, r) : Promise.reject(new A(N.UnsupportedResultType, `Unsupported result type 'input_required' for ${r.request.method}: multi-round-trip auto-fulfilment is not enabled on this instance \u2014 pass allowInputRequired: true to handle it manually, or enable inputRequired.autoFulfill`, {
          resultType: "input_required",
          method: r.request.method
        }));
      }
      _setupListChangedHandlers(t) {
        t.tools && this._serverCapabilities?.tools?.listChanged && this._setupListChangedHandler("tools", "notifications/tools/list_changed", t.tools, async () => (await this.listTools(void 0, {
          cacheMode: "refresh"
        })).tools);
        t.prompts && this._serverCapabilities?.prompts?.listChanged && this._setupListChangedHandler("prompts", "notifications/prompts/list_changed", t.prompts, async () => (await this.listPrompts(void 0, {
          cacheMode: "refresh"
        })).prompts);
        t.resources && this._serverCapabilities?.resources?.listChanged && this._setupListChangedHandler("resources", "notifications/resources/list_changed", t.resources, async () => (await this.listResources(void 0, {
          cacheMode: "refresh"
        })).resources);
      }
      registerCapabilities(t) {
        if (this.transport) throw new Error("Cannot register capabilities after connecting to transport");
        this._capabilities = Ug(this._capabilities, t);
      }
      setVersionNegotiation(t) {
        if (this.transport) throw new Error("Cannot configure version negotiation after connecting to transport");
        this._versionNegotiation = t;
      }
      _wrapHandler(t, r) {
        return t === "elicitation/create" ? async (o, n) => {
          let s = It(this._negotiatedProtocolVersion),
            i = s.validateRequest("elicitation/create", o);
          if (!i.ok && i.reason === "not-in-era" && (i = s.validateInputRequest("elicitation/create", o)), !i.ok) throw new re(i.reason === "not-in-era" ? J.InternalError : J.InvalidParams, i.reason === "not-in-era" ? "No wire schema for elicitation/create in the resolved era" : `Invalid elicitation request: ${i.message}`);
          let {
            params: a
          } = i.value;
          a.mode = a.mode ?? "form";
          let {
            supportsFormMode: u,
            supportsUrlMode: l
          } = uR(this._capabilities.elicitation);
          if (a.mode === "form" && !u) throw new re(J.InvalidParams, "Client does not support form-mode elicitation requests");
          if (a.mode === "url" && !l) throw new re(J.InvalidParams, "Client does not support URL-mode elicitation requests");
          let d = await r(o, n),
            p = s.validateResult("elicitation/create", d);
          if (!p.ok && p.reason === "not-in-era" && (p = s.validateInputResponse("elicitation/create", d)), !p.ok) throw new re(p.reason === "not-in-era" ? J.InternalError : J.InvalidParams, p.reason === "not-in-era" ? "No wire schema for elicitation/create in the resolved era" : `Invalid elicitation result: ${p.message}`);
          let h = p.value,
            f = a.mode === "form" ? a.requestedSchema : void 0;
          if (a.mode === "form" && h.action === "accept" && h.content && f && this._capabilities.elicitation?.form?.applyDefaults) try {
            vc(f, h.content);
          } catch {}
          return h;
        } : t === "sampling/createMessage" ? async (o, n) => {
          let s = It(this._negotiatedProtocolVersion),
            i = s.validateRequest("sampling/createMessage", o);
          if (!i.ok && i.reason === "not-in-era" && (i = s.validateInputRequest("sampling/createMessage", o)), !i.ok) throw new re(i.reason === "not-in-era" ? J.InternalError : J.InvalidParams, i.reason === "not-in-era" ? "No wire schema for sampling/createMessage in the resolved era" : `Invalid sampling request: ${i.message}`);
          let {
              params: a
            } = i.value,
            u = await r(o, n),
            l = !!(a.tools || a.toolChoice),
            d = s.samplingResultVariant(l, u);
          if (!d.ok && d.reason === "not-in-era" && (d = s.validateInputResponse("sampling/createMessage", u)), !d.ok) throw new re(d.reason === "not-in-era" ? J.InternalError : J.InvalidParams, d.reason === "not-in-era" ? "No result schema for sampling/createMessage in the resolved era" : `Invalid sampling result: ${d.message}`);
          return d.value;
        } : r;
      }
      assertCapability(t, r) {
        if (!this._serverCapabilities?.[t]) throw new A(N.CapabilityNotSupported, `Server does not support ${t} (required for ${r})`);
      }
      async connect(t, r) {
        if (r?.prior != null) return this._connectFromPrior(t, lR(r.prior), r);
        let o = rR(this._versionNegotiation, this._supportedProtocolVersionsOption);
        return o.kind !== "legacy" ? this._connectNegotiated(t, o, r) : this._connectPlainLegacy(t, r);
      }
      async _connectPlainLegacy(t, r) {
        if (await super.connect(t), t.sessionId !== void 0) {
          let o = this._negotiatedProtocolVersion;
          o !== void 0 && t.setProtocolVersion?.(o);
          return;
        }
        this._resetConnectionState();
        await this._legacyHandshake(t, r);
      }
      async _legacyHandshake(t, r) {
        let o = Ll(this._supportedProtocolVersions);
        try {
          let n = o[0];
          if (n === void 0) throw new A(N.EraNegotiationFailed, "Cannot run the initialize handshake: supportedProtocolVersions contains no pre-2026-07-28 protocol version");
          let s = await this.request({
            method: "initialize",
            params: {
              protocolVersion: n,
              capabilities: this._capabilities,
              clientInfo: this._clientInfo
            }
          }, r);
          if (s === void 0) throw new Error(`Server sent invalid initialize result: ${s}`);
          if (!o.includes(s.protocolVersion)) throw new Error(`Server's protocol version is not supported: ${s.protocolVersion}`);
          this._serverCapabilities = s.capabilities;
          this._serverVersion = s.serverInfo;
          this._cache.setServerIdentity(this._deriveServerIdentity(t));
          t.setProtocolVersion && t.setProtocolVersion(s.protocolVersion);
          this._instructions = s.instructions;
          await this.notification({
            method: "notifications/initialized"
          });
          this._negotiatedProtocolVersion = s.protocolVersion;
          this._listChangedConfig && this._setupListChangedHandlers(this._listChangedConfig);
        } catch (n) {
          throw this.close(), n;
        }
      }
      async _connectNegotiated(t, r, o) {
        if (t.sessionId !== void 0) {
          await super.connect(t);
          let s = this._negotiatedProtocolVersion;
          s !== void 0 && t.setProtocolVersion && t.setProtocolVersion(s);
          return;
        }
        this._resetConnectionState();
        let n;
        try {
          let s = sS(t),
            i = {
              clientInfo: this._clientInfo,
              capabilities: this._capabilities,
              environment: nS(),
              defaultTimeoutMs: o?.timeout ?? mc
            },
            a = s === "stdio" ? iR(t) : void 0;
          n = a === void 0 ? await xS(r, {
            ...i,
            transport: t,
            transportKind: s
          }) : await aR(r, t, a, i);
        } catch (s) {
          throw await t.close().catch(() => {}), iS(t), s;
        }
        if (iS(t), await super.connect(t), n.era === "legacy") {
          await this._legacyHandshake(t, o);
          return;
        }
        if (this._serverCapabilities = n.discover.capabilities, this._serverVersion = cS(n.discover), this._cache.setServerIdentity(this._deriveServerIdentity(t)), this._instructions = n.discover.instructions, this._discoverResult = n.discover, this._negotiatedProtocolVersion = n.version, t.setProtocolVersion && t.setProtocolVersion(n.version), this._listChangedConfig) {
          let s = this._listChangedConfig,
            i = this._serverCapabilities,
            a = {
              ...(s.tools && i?.tools?.listChanged && {
                tools: s.tools
              }),
              ...(s.prompts && i?.prompts?.listChanged && {
                prompts: s.prompts
              }),
              ...(s.resources && i?.resources?.listChanged && {
                resources: s.resources
              })
            },
            u = !0;
          try {
            this._setupListChangedHandlers(a);
          } catch (d) {
            u = !1;
            this.onerror?.(d instanceof Error ? d : new Error(String(d)));
          }
          let l = u ? {
            ...(a.tools && {
              toolsListChanged: !0
            }),
            ...(a.prompts && {
              promptsListChanged: !0
            }),
            ...(a.resources && {
              resourcesListChanged: !0
            })
          } : {};
          if (Object.keys(l).length > 0) {
            let d = new AbortController(),
              p = () => d.abort(o?.signal?.reason);
            o?.signal?.aborted && p();
            o?.signal?.addEventListener("abort", p);
            try {
              this._autoOpenedSubscription = await this.listen(l, {
                timeout: o?.timeout,
                signal: d.signal
              });
            } catch (h) {
              if (o?.signal?.aborted) throw await this.close().catch(() => {}), h;
              this.onerror?.(h instanceof Error ? h : new Error(String(h)));
            } finally {
              o?.signal?.removeEventListener("abort", p);
            }
          }
        }
      }
      async _connectFromPrior(t, r, o) {
        if (r.kind === "legacy") return this._connectPlainLegacy(t, o);
        let n = r.discover;
        this._resetConnectionState();
        let s = this._supportedProtocolVersionsOption,
          i = (s && Ss(s).length > 0 ? Ss(s) : jl).find(a => n.supportedVersions.includes(a));
        if (i === void 0) throw new A(N.EraNegotiationFailed, "connect({ prior }) with a modern verdict requires a 2026-07-28+ mutual protocol version; the supplied DiscoverResult and this client's supportedProtocolVersions have no modern overlap. For a server known to be legacy, pass prior: { kind: 'legacy' } to skip the probe and initialize directly, or use versionNegotiation: { mode: 'auto' } to re-probe with legacy fallback.");
        if (await super.connect(t), this._discoverResult = n, this._serverCapabilities = n.capabilities, this._serverVersion = cS(n), this._cache.setServerIdentity(this._deriveServerIdentity(t)), this._instructions = n.instructions, this._negotiatedProtocolVersion = i, t.setProtocolVersion?.(i), this._listChangedConfig) try {
          this._setupListChangedHandlers(this._listChangedConfig);
        } catch (a) {
          this.onerror?.(a instanceof Error ? a : new Error(String(a)));
        }
      }
      getServerCapabilities() {
        return this._serverCapabilities;
      }
      getServerVersion() {
        return this._serverVersion;
      }
      _deriveServerIdentity(t) {
        let r = this._serverVersion;
        return r !== void 0 ? `${r.name}@${r.version}` : t.sessionId ?? `anonymous:${Date.now()}-${Math.random().toString(36).slice(2)}`;
      }
      getNegotiatedProtocolVersion() {
        return this._negotiatedProtocolVersion;
      }
      getProtocolEra() {
        let t = this._negotiatedProtocolVersion;
        if (t !== void 0) return Ot(t) ? "modern" : "legacy";
      }
      getInstructions() {
        return this._instructions;
      }
      getDiscoverResult() {
        return this._discoverResult;
      }
      assertCapabilityForMethod(t) {
        switch (t) {
          case "logging/setLevel":
            if (!this._serverCapabilities?.logging) throw new A(N.CapabilityNotSupported, `Server does not support logging (required for ${t})`);
            break;
          case "prompts/get":
          case "prompts/list":
            if (!this._serverCapabilities?.prompts) throw new A(N.CapabilityNotSupported, `Server does not support prompts (required for ${t})`);
            break;
          case "resources/list":
          case "resources/templates/list":
          case "resources/read":
          case "resources/subscribe":
          case "resources/unsubscribe":
            if (!this._serverCapabilities?.resources) throw new A(N.CapabilityNotSupported, `Server does not support resources (required for ${t})`);
            if (t === "resources/subscribe" && !this._serverCapabilities.resources.subscribe) throw new A(N.CapabilityNotSupported, `Server does not support resource subscriptions (required for ${t})`);
            break;
          case "tools/call":
          case "tools/list":
            if (!this._serverCapabilities?.tools) throw new A(N.CapabilityNotSupported, `Server does not support tools (required for ${t})`);
            break;
          case "completion/complete":
            if (!this._serverCapabilities?.completions) throw new A(N.CapabilityNotSupported, `Server does not support completions (required for ${t})`);
            break;
          case "initialize":
            break;
          case "server/discover":
            break;
          case "ping":
            break;
        }
      }
      assertNotificationCapability(t) {
        switch (t) {
          case "notifications/roots/list_changed":
            if (!this._capabilities.roots?.listChanged) throw new A(N.CapabilityNotSupported, `Client does not support roots list changed notifications (required for ${t})`);
            break;
          case "notifications/initialized":
            break;
          case "notifications/cancelled":
            break;
          case "notifications/progress":
            break;
        }
      }
      assertRequestHandlerCapability(t) {
        switch (t) {
          case "sampling/createMessage":
            if (!this._capabilities.sampling) throw new A(N.CapabilityNotSupported, `Client does not support sampling capability (required for ${t})`);
            break;
          case "elicitation/create":
            if (!this._capabilities.elicitation) throw new A(N.CapabilityNotSupported, `Client does not support elicitation capability (required for ${t})`);
            break;
          case "roots/list":
            if (!this._capabilities.roots) throw new A(N.CapabilityNotSupported, `Client does not support roots capability (required for ${t})`);
            break;
          case "ping":
            break;
        }
      }
      async ping(t) {
        return this.request({
          method: "ping"
        }, t);
      }
      async discover(t) {
        let r = await this._requestWithSchema({
          method: "server/discover"
        }, gr, t);
        return this._discoverResult = r, r;
      }
      async complete(t, r) {
        return this.request({
          method: "completion/complete",
          params: t
        }, r);
      }
      async setLoggingLevel(t, r) {
        return this.request({
          method: "logging/setLevel",
          params: {
            level: t
          }
        }, r);
      }
      async getPrompt(t, r) {
        return this.request({
          method: "prompts/get",
          params: t
        }, r);
      }
      async listPrompts(t, r) {
        if (!this._serverCapabilities?.prompts && !this._enforceStrictCapabilities) return console.debug("Client.listPrompts() called but server does not advertise prompts capability - returning empty list"), {
          prompts: []
        };
        if (t?.cursor !== void 0) return this.request({
          method: "prompts/list",
          params: t
        }, r);
        let o = await this._serveFromCache("prompts/list", void 0, r);
        return o !== void 0 ? o : this._listAllPages("prompts/list", t, r, (n, s) => n.prompts.push(...s.prompts));
      }
      async listResources(t, r) {
        if (!this._serverCapabilities?.resources && !this._enforceStrictCapabilities) return console.debug("Client.listResources() called but server does not advertise resources capability - returning empty list"), {
          resources: []
        };
        if (t?.cursor !== void 0) return this.request({
          method: "resources/list",
          params: t
        }, r);
        let o = await this._serveFromCache("resources/list", void 0, r);
        return o !== void 0 ? o : this._listAllPages("resources/list", t, r, (n, s) => n.resources.push(...s.resources));
      }
      async listResourceTemplates(t, r) {
        if (!this._serverCapabilities?.resources && !this._enforceStrictCapabilities) return console.debug("Client.listResourceTemplates() called but server does not advertise resources capability - returning empty list"), {
          resourceTemplates: []
        };
        if (t?.cursor !== void 0) return this.request({
          method: "resources/templates/list",
          params: t
        }, r);
        let o = await this._serveFromCache("resources/templates/list", void 0, r);
        return o !== void 0 ? o : this._listAllPages("resources/templates/list", t, r, (n, s) => n.resourceTemplates.push(...s.resourceTemplates));
      }
      async _listAllPages(t, r, o, n, s) {
        let i = o?.cacheMode === "bypass",
          a = this._cache.captureGeneration(t),
          u = await this.request({
            method: t,
            ...(r && {
              params: {
                ...r
              }
            })
          }, o),
          l = u.nextCursor,
          d = new Set(),
          p = 1;
        for (; l !== void 0 && !d.has(l);) {
          if (this._listMaxPages !== 0 && p >= this._listMaxPages) throw new A(N.ListPaginationExceeded, `${t}: exceeded listMaxPages (${this._listMaxPages}); server pagination did not terminate`, {
            method: t,
            listMaxPages: this._listMaxPages
          });
          d.add(l);
          let h = await this.request({
            method: t,
            params: {
              ...r,
              cursor: l
            }
          }, o);
          n(u, h);
          l = h.nextCursor;
          p++;
        }
        return delete u.nextCursor, s?.(u), i || (await this._cache.write(t, u, a, this._freshness(u))), u;
      }
      _freshness(t, r) {
        let o = t,
          n = typeof o.ttlMs == "number" ? o.ttlMs : this._defaultCacheTtlMs,
          s = o.cacheScope === "public" ? "public" : "private";
        return {
          expiresAt: this._cache.now() + Math.min(Math.max(0, n), Zv),
          scope: s,
          params: r
        };
      }
      async _serveFromCache(t, r, o) {
        if (o?.cacheMode === "bypass" || o?.cacheMode === "refresh") return;
        let n = await this._cache.read(t, r).catch(s => void this._reportStoreError(s));
        if (n !== void 0) {
          if (o?.signal?.aborted) {
            let s = o.signal.reason;
            throw s instanceof A ? s : new A(N.RequestTimeout, String(s));
          }
          return n.value;
        }
      }
      _reportStoreError(t) {
        this.onerror?.(t instanceof Error ? t : new Error(String(t)));
      }
      _compileOutputValidator(t) {
        if (t.outputSchema) try {
          return {
            ok: !0,
            validator: this._jsonSchemaValidator.getValidator(t.outputSchema)
          };
        } catch (r) {
          return {
            ok: !1,
            compileError: r
          };
        }
      }
      async _resolveXMcpHeaderScan(t, r) {
        let o = r ?? (await this._cache.toolDefinition(t));
        return o === void 0 ? void 0 : Jl(o.inputSchema);
      }
      async readResource(t, r) {
        let o = await this._serveFromCache("resources/read", t.uri, r);
        if (o !== void 0) return o;
        let n = this._cache.captureGeneration("resources/read", t.uri),
          s = await this.request({
            method: "resources/read",
            params: t
          }, r);
        if (r?.cacheMode !== "bypass") {
          let i = this._freshness(s, t.uri);
          i.expiresAt > this._cache.now() ? await this._cache.write("resources/read", s, n, i) : r?.cacheMode === "refresh" && (await this._cache.evictKey("resources/read", t.uri));
        }
        return s;
      }
      async subscribeResource(t, r) {
        return this.request({
          method: "resources/subscribe",
          params: t
        }, r);
      }
      async unsubscribeResource(t, r) {
        return this.request({
          method: "resources/unsubscribe",
          params: t
        }, r);
      }
      async listen(t, r) {
        if (this.transport === void 0) throw new A(N.NotConnected, "Not connected");
        let o = this._negotiatedProtocolVersion;
        if (o === void 0 || !Ot(o)) throw new A(N.MethodNotSupportedByProtocolVersion, `subscriptions/listen requires a 2026-07-28-era connection (negotiated: ${o ?? "none"}). On a 2025-era connection, change notifications are delivered unsolicited: use ClientOptions.listChanged and resources/subscribe instead.`, {
          method: "subscriptions/listen",
          protocolVersion: o
        });
        if (r?.signal?.aborted) {
          let U = r.signal.reason;
          throw U instanceof A ? U : new A(N.RequestTimeout, String(U));
        }
        let n = new AbortController(),
          s = `listen:${this._nextListenId++}`,
          i = "opening",
          a,
          u,
          l,
          d,
          p = new Promise((U, te) => {
            l = U;
            d = te;
          }),
          h,
          f = new Promise(U => {
            h = U;
          }),
          g = U => {
            if (i === "closed") return;
            let te = i === "opening";
            if (a !== void 0 && (clearTimeout(a), a = void 0), "ack" in U) {
              i = "open";
              l(U.ack);
              return;
            }
            i = "closed";
            u !== void 0 && r?.signal?.removeEventListener("abort", u);
            this._listenState.delete(s);
            n.abort();
            h(U.cause);
            te && d(U.error ?? new A(N.ConnectionClosed, "subscriptions/listen closed before the server acknowledged"));
          },
          y = async () => {
            n.abort();
            await this.notification({
              method: "notifications/cancelled",
              params: {
                requestId: s
              }
            }).catch(() => {});
          },
          b = async () => {
            i !== "closed" && (g({
              cause: "local"
            }), await y());
          };
        this._listenState.set(s, {
          settle: g
        });
        let T = r?.timeout ?? mc;
        if (a = setTimeout(() => {
          g({
            cause: "remote",
            error: new A(N.RequestTimeout, "subscriptions/listen ack timed out", {
              timeout: T
            })
          });
          y().catch(() => {});
        }, T), r?.signal) {
          let U = r.signal;
          u = () => {
            if (i === "closed") return;
            let te = U.reason;
            g({
              cause: "local",
              error: te instanceof Error ? te : new Error(String(te ?? "Aborted"))
            });
            y().catch(() => {});
          };
          U.addEventListener("abort", u, {
            once: !0
          });
        }
        let L = {
          jsonrpc: "2.0",
          id: s,
          method: "subscriptions/listen",
          params: {
            _meta: {
              ...this._outboundMetaEnvelope()
            },
            notifications: t
          }
        };
        try {
          await this.transport.send(L, {
            requestSignal: n.signal,
            onRequestStreamEnd: () => g({
              cause: "remote",
              error: new Error("subscriptions/listen: stream ended")
            })
          });
        } catch (U) {
          g({
            cause: "remote",
            error: U instanceof Error ? U : new Error(String(U))
          });
        }
        return {
          honoredFilter: await p,
          close: b,
          closed: f
        };
      }
      get autoOpenedSubscription() {
        return this._autoOpenedSubscription;
      }
      _onnotification(t, r) {
        let o = Object.hasOwn(uS, t.method) ? uS[t.method] : void 0;
        if (t.method === "notifications/resources/updated") {
          let n = t.params?.uri;
          typeof n == "string" && this._cache.evictKey("resources/read", n);
        } else if (o !== void 0) for (let n of o) this._cache.evict(n);
        if (t.method === "notifications/subscriptions/acknowledged") {
          let n = t.params?._meta?.[kn],
            s = typeof n == "string" ? this._listenState.get(n) : void 0;
          if (s !== void 0) {
            let i = this._wireCodec().validateNotification("notifications/subscriptions/acknowledged", t);
            s.settle({
              ack: i.ok ? i.value.params.notifications : {}
            });
            return;
          }
        }
        if (t.method === "notifications/cancelled") {
          let n = t.params?.requestId,
            s = typeof n == "string" ? this._listenState.get(n) : void 0;
          if (s !== void 0) {
            s.settle({
              cause: "remote",
              error: new Error("subscriptions/listen: server cancelled the subscription")
            });
            return;
          }
        }
        super._onnotification(t, r);
      }
      _onresponse(t) {
        let r = t.id,
          o = typeof r == "string" ? this._listenState.get(r) : void 0;
        if (o !== void 0) {
          vo(t) ? o.settle({
            cause: "remote",
            error: re.fromError(t.error.code, t.error.message, t.error.data)
          }) : o.settle({
            cause: "graceful",
            error: new A(N.ConnectionClosed, "subscriptions/listen: server closed the subscription gracefully before acknowledging")
          });
          return;
        }
        super._onresponse(t);
      }
      _onclose() {
        if (this._listenState.size > 0) {
          let t = new A(N.ConnectionClosed, "Connection closed");
          for (let r of this._listenState.values()) r.settle({
            cause: "remote",
            error: t
          });
          this._listenState.clear();
        }
        super._onclose();
      }
      async callTool(t, r) {
        let o = this.getProtocolEra() === "modern" && nS() !== "browser",
          n = async () => {
            if (!o) return r;
            let l;
            try {
              l = await this._resolveXMcpHeaderScan(t.name, r?.toolDefinition);
            } catch (p) {
              this._reportStoreError(p);
            }
            if (!l?.valid || l.declarations.length === 0) return r;
            let d = Ig(l.declarations, t.arguments);
            return Object.keys(d).length === 0 ? r : {
              ...r,
              headers: {
                ...r?.headers,
                ...d
              }
            };
          },
          s = r?.toolDefinition === void 0 ? await this._cache.outputValidator(t.name, l => this._compileOutputValidator(l)).catch(l => void this._reportStoreError(l)) : this._compileOutputValidator(r.toolDefinition),
          i = () => {
            if (s === void 0 || s.ok) return;
            let l = s.compileError,
              d = (l instanceof Error ? l.message : String(l)).slice(0, 200);
            throw new re(J.InvalidParams, `Tool '${t.name}' has an invalid outputSchema: ${d}`);
          };
        i();
        let a;
        try {
          a = await this.request({
            method: "tools/call",
            params: t
          }, await n());
        } catch (l) {
          let d = l instanceof re && l.code === mo;
          if (!o || !d || r?.toolDefinition !== void 0) throw l;
          let p = {
            signal: r?.signal,
            timeout: r?.timeout,
            cacheMode: "refresh"
          };
          await this._cache.evict("tools/list");
          await this.listTools(void 0, p).catch(h => this._reportStoreError(h));
          s = await this._cache.outputValidator(t.name, h => this._compileOutputValidator(h)).catch(h => void this._reportStoreError(h));
          i();
          a = await this.request({
            method: "tools/call",
            params: t
          }, await n());
        }
        let u = s !== void 0 && s.ok ? s.validator : void 0;
        if (u) {
          if (a.structuredContent === void 0 && !a.isError) throw new re(J.InvalidRequest, `Tool ${t.name} has an output schema but did not return structured content`);
          if (a.structuredContent !== void 0 && !a.isError) try {
            let l = u(a.structuredContent);
            if (!l.valid) throw new re(J.InvalidParams, `Structured content does not match the tool's output schema: ${l.errorMessage}`);
          } catch (l) {
            throw l instanceof re ? l : new re(J.InvalidParams, `Failed to validate structured content: ${l instanceof Error ? l.message : String(l)}`);
          }
        }
        return a;
      }
      async listTools(t, r) {
        if (!this._serverCapabilities?.tools && !this._enforceStrictCapabilities) return console.debug("Client.listTools() called but server does not advertise tools capability - returning empty list"), {
          tools: []
        };
        if (t?.cursor !== void 0) {
          let n = await this.request({
            method: "tools/list",
            params: t
          }, r);
          return this._excludeInvalidXMcpHeaderTools(n), n;
        }
        let o = await this._serveFromCache("tools/list", void 0, r);
        return o !== void 0 ? o : this._listAllPages("tools/list", t, r, (n, s) => n.tools.push(...s.tools), n => this._excludeInvalidXMcpHeaderTools(n));
      }
      _excludeInvalidXMcpHeaderTools(t) {
        if (this.getProtocolEra() !== "modern" || !this.transport || sS(this.transport) === "stdio") return;
        let r = t.tools.filter(o => {
          let n = Jl(o.inputSchema);
          return n.valid ? !0 : (console.warn(`[mcp-sdk] excluding tool '${o.name}' from tools/list: invalid x-mcp-header declaration \u2014 ${n.reason}`), !1);
        });
        r.length !== t.tools.length && (t.tools = r);
      }
      _setupListChangedHandler(t, r, o, n) {
        let s = hc(Yn, o);
        if (!s.success) throw new Error(`Invalid ${t} listChanged options: ${s.error.message}`);
        if (typeof o.onChanged != "function") throw new TypeError(`Invalid ${t} listChanged options: onChanged must be a function`);
        let {
            autoRefresh: i,
            debounceMs: a
          } = s.data,
          {
            onChanged: u
          } = o,
          l = async () => {
            if (!i) {
              u(null, null);
              return;
            }
            try {
              u(null, await n());
            } catch (p) {
              u(p instanceof Error ? p : new Error(String(p)), null);
            }
          },
          d = () => {
            if (a) {
              let p = this._listChangedDebounceTimers.get(t);
              p && clearTimeout(p);
              let h = setTimeout(l, a);
              this._listChangedDebounceTimers.set(t, h);
            } else l();
          };
        this.setNotificationHandler(r, d);
      }
      async sendRootsListChanged() {
        return this.notification({
          method: "notifications/roots/list_changed"
        });
      }
    };
  var Ao,
    pR = (Ao = class extends Error {
      static [Symbol.hasInstance](t) {
        return Ke(this, t);
      }
      static isInstance(t) {
        if (typeof this != "function") throw new TypeError("isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)`");
        return Ke(this, t);
      }
      constructor(t, r, o) {
        super(`SSE error: ${r}`);
        this.code = t;
        this.event = o;
        yr(this, new.target);
      }
    }, Object.defineProperty(Ao, "mcpBrand", {
      value: "mcp.SseError"
    }), Ao),
    $S = class {
      constructor(e, t) {
        R(this, "_eventSource");
        R(this, "_endpoint");
        R(this, "_abortController");
        R(this, "_url");
        R(this, "_resourceMetadataUrl");
        R(this, "_scope");
        R(this, "_eventSourceInit");
        R(this, "_requestInit");
        R(this, "_authProvider");
        R(this, "_oauthProvider");
        R(this, "_skipIssuerMetadataValidation");
        R(this, "_fetch");
        R(this, "_fetchWithInit");
        R(this, "_protocolVersion");
        R(this, "onclose");
        R(this, "onerror");
        R(this, "onmessage");
        R(this, "_last401Response");
        this._url = e;
        this._resourceMetadataUrl = void 0;
        this._scope = void 0;
        this._eventSourceInit = t?.eventSourceInit;
        this._requestInit = t?.requestInit;
        this._skipIssuerMetadataValidation = t?.skipIssuerMetadataValidation;
        hS(t?.authProvider) ? (this._oauthProvider = t.authProvider, this._authProvider = mS(t.authProvider, {
          skipIssuerMetadataValidation: t.skipIssuerMetadataValidation
        })) : this._authProvider = t?.authProvider;
        this._fetch = t?.fetch;
        this._fetchWithInit = Gl(t?.fetch, t?.requestInit);
      }
      async _commonHeaders() {
        let e = {},
          t;
        try {
          t = await this._authProvider?.token();
        } catch (o) {
          throw Ee(o);
        }
        t && (e.Authorization = `Bearer ${t}`);
        this._protocolVersion && (e["mcp-protocol-version"] = this._protocolVersion);
        let r = gs(this._requestInit?.headers);
        return new Headers({
          ...e,
          ...r
        });
      }
      _startOrAuth() {
        let e = this?._eventSourceInit?.fetch ?? this._fetch ?? fetch;
        return new Promise((t, r) => {
          this._eventSource = new $r(this._url.href, {
            ...this._eventSourceInit,
            fetch: async (o, n) => {
              let s = await this._commonHeaders();
              s.set("Accept", "text/event-stream");
              let i = await e(o, {
                ...n,
                headers: s
              });
              if (i.status === 401 && (this._last401Response = i, i.headers.has("www-authenticate"))) {
                let {
                  resourceMetadataUrl: a,
                  scope: u
                } = Tr(i);
                this._resourceMetadataUrl = a;
                this._scope = u;
              }
              return i;
            }
          });
          this._abortController = new AbortController();
          this._eventSource.onerror = o => {
            if (o.code === 401 && this._authProvider) {
              if (this._authProvider.onUnauthorized && this._last401Response) {
                let i = this._last401Response;
                this._last401Response = void 0;
                this._eventSource?.close();
                this._authProvider.onUnauthorized({
                  response: i,
                  serverUrl: this._url,
                  fetchFn: this._fetchWithInit
                }).then(() => this._startOrAuth().then(t, r), a => {
                  Ee(a);
                  this.onerror?.(a);
                  r(a);
                });
                return;
              }
              let s = Ee(new De());
              r(s);
              this.onerror?.(s);
              return;
            }
            let n = new pR(o.code, o.message, o);
            r(n);
            this.onerror?.(n);
          };
          this._eventSource.onopen = () => {};
          this._eventSource.addEventListener("endpoint", o => {
            let n = o;
            try {
              if (this._endpoint = new URL(n.data, this._url), this._endpoint.origin !== this._url.origin) throw new Error(`Endpoint origin does not match connection origin: ${this._endpoint.origin}`);
            } catch (s) {
              r(s);
              this.onerror?.(s);
              this.close();
              return;
            }
            t();
          });
          this._eventSource.onmessage = o => {
            let n = o,
              s;
            try {
              s = kt.parse(JSON.parse(n.data));
            } catch (i) {
              this.onerror?.(i);
              return;
            }
            this.onmessage?.(s);
          };
        });
      }
      async start() {
        if (this._eventSource) throw new Error("SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        return await this._startOrAuth();
      }
      async finishAuth(e, t) {
        if (!this._oauthProvider) throw new De("finishAuth requires an OAuthClientProvider");
        let {
          authorizationCode: r,
          iss: o
        } = await fS(e, t, this._oauthProvider, this._url, {
          fetchFn: this._fetchWithInit,
          resourceMetadataUrl: this._resourceMetadataUrl
        });
        if ((await Rc(this._oauthProvider, {
          serverUrl: this._url,
          authorizationCode: r,
          iss: o,
          resourceMetadataUrl: this._resourceMetadataUrl,
          scope: this._scope,
          fetchFn: this._fetchWithInit,
          skipIssuerMetadataValidation: this._skipIssuerMetadataValidation
        })) !== "AUTHORIZED") throw new De("Failed to authorize");
      }
      async close() {
        this._abortController?.abort();
        this._eventSource?.close();
        this.onclose?.();
      }
      async send(e) {
        return this._send(e, !1);
      }
      async _send(e, t) {
        if (!this._endpoint) throw new A(N.NotConnected, "Not connected");
        try {
          let r = await this._commonHeaders();
          r.set("content-type", "application/json");
          let o = {
              ...this._requestInit,
              method: "POST",
              headers: r,
              body: JSON.stringify(e),
              signal: this._abortController?.signal
            },
            n = await (this._fetch ?? fetch)(this._endpoint, o);
          if (!n.ok) {
            if (n.status === 401 && this._authProvider) {
              if (n.headers.has("www-authenticate")) {
                let {
                  resourceMetadataUrl: i,
                  scope: a
                } = Tr(n);
                this._resourceMetadataUrl = i;
                this._scope = a;
              }
              if (this._authProvider.onUnauthorized && !t) {
                try {
                  await this._authProvider.onUnauthorized({
                    response: n,
                    serverUrl: this._url,
                    fetchFn: this._fetchWithInit
                  });
                } catch (i) {
                  throw Ee(i);
                }
                return await n.text?.().catch(() => {}), this._send(e, !0);
              }
              throw await n.text?.().catch(() => {}), Ee(t ? new st(N.ClientHttpAuthentication, "Server returned 401 after re-authentication", {
                status: 401,
                statusText: n.statusText
              }) : new De());
            }
            let s = await n.text?.().catch(() => null);
            throw new Error(`Error POSTing to endpoint (HTTP ${n.status}): ${s}`);
          }
          await n.text?.().catch(() => {});
        } catch (r) {
          throw this.onerror?.(r), r;
        }
      }
      setProtocolVersion(e) {
        this._protocolVersion = e;
      }
    },
    hR = 1,
    mR = {
      initialReconnectionDelay: 1e3,
      maxReconnectionDelay: 3e4,
      reconnectionDelayGrowFactor: 1.5,
      maxRetries: 2
    },
    fR = new Set(["authorization", "content-type", "mcp-protocol-version", "mcp-method", "mcp-name", "mcp-session-id"]);
  function lS(e, t) {
    if (typeof AbortSignal.any == "function") return AbortSignal.any([e, t]);
    let r = new AbortController();
    if (e.aborted) return r.abort(e.reason), r.signal;
    if (t.aborted) return r.abort(t.reason), r.signal;
    let o = () => {
      e.removeEventListener("abort", n);
      t.removeEventListener("abort", s);
    };
    function n() {
      o();
      r.abort(e.reason);
    }
    function s() {
      o();
      r.abort(t.reason);
    }
    return e.addEventListener("abort", n, {
      once: !0
    }), t.addEventListener("abort", s, {
      once: !0
    }), r.signal;
  }
  var TS = class {
    constructor(e, t) {
      R(this, "_abortController");
      R(this, "_url");
      R(this, "_resourceMetadataUrl");
      R(this, "_scope");
      R(this, "_requestInit");
      R(this, "_authProvider");
      R(this, "_oauthProvider");
      R(this, "_skipIssuerMetadataValidation");
      R(this, "_fetch");
      R(this, "_fetchWithInit");
      R(this, "_sessionId");
      R(this, "_reconnectionOptions");
      R(this, "_protocolVersion");
      R(this, "_onInsufficientScope");
      R(this, "_maxStepUpRetries");
      R(this, "_serverRetryMs");
      R(this, "_reconnectionScheduler");
      R(this, "_cancelReconnection");
      R(this, "onclose");
      R(this, "onerror");
      R(this, "onmessage");
      R(this, "hasPerRequestStream", !0);
      this._url = e;
      this._resourceMetadataUrl = void 0;
      this._scope = void 0;
      this._requestInit = t?.requestInit;
      this._skipIssuerMetadataValidation = t?.skipIssuerMetadataValidation;
      hS(t?.authProvider) ? (this._oauthProvider = t.authProvider, this._authProvider = mS(t.authProvider, {
        skipIssuerMetadataValidation: t.skipIssuerMetadataValidation
      })) : this._authProvider = t?.authProvider;
      this._fetch = t?.fetch;
      this._fetchWithInit = Gl(t?.fetch, t?.requestInit);
      this._sessionId = t?.sessionId;
      this._protocolVersion = t?.protocolVersion;
      this._reconnectionOptions = t?.reconnectionOptions ?? mR;
      this._reconnectionScheduler = t?.reconnectionScheduler;
      this._onInsufficientScope = t?.onInsufficientScope ?? "reauthorize";
      this._maxStepUpRetries = Math.max(0, t?.maxStepUpRetries ?? hR);
    }
    async _stepUpAuthorize(e, t) {
      try {
        return await this._stepUpAuthorizeInner(e, t);
      } catch (r) {
        throw Ee(r);
      }
    }
    async _stepUpAuthorizeInner(e, t) {
      if (this._onInsufficientScope === "throw") throw new Qg({
        requiredScope: e.scope,
        resourceMetadataUrl: e.resourceMetadataUrl,
        errorDescription: e.errorDescription
      });
      if (!this._oauthProvider) throw new Qg({
        requiredScope: e.scope,
        resourceMetadataUrl: e.resourceMetadataUrl,
        errorDescription: e.errorDescription
      });
      if (t >= this._maxStepUpRetries) throw new st(N.ClientHttpForbidden, `Server returned 403 insufficient_scope after step-up re-authorization (retry limit ${this._maxStepUpRetries} reached)`, {
        status: 403,
        statusText: e.statusText ?? "Forbidden",
        text: e.text
      });
      e.resourceMetadataUrl && (this._resourceMetadataUrl = e.resourceMetadataUrl);
      let r = await this._oauthProvider.tokens(),
        o = dd(this._scope, r?.scope, e.scope);
      this._scope = o;
      let n = _v(o, r?.scope);
      return Rc(this._oauthProvider, {
        serverUrl: this._url,
        resourceMetadataUrl: this._resourceMetadataUrl,
        scope: o,
        forceReauthorization: n,
        fetchFn: this._fetchWithInit,
        skipIssuerMetadataValidation: this._skipIssuerMetadataValidation
      });
    }
    async _commonHeaders() {
      let e = {},
        t;
      try {
        t = await this._authProvider?.token();
      } catch (o) {
        throw Ee(o);
      }
      t && (e.Authorization = `Bearer ${t}`);
      this._sessionId && (e["mcp-session-id"] = this._sessionId);
      this._protocolVersion && (e["mcp-protocol-version"] = this._protocolVersion);
      let r = gs(this._requestInit?.headers);
      return new Headers({
        ...e,
        ...r
      });
    }
    _applyBodyDerivedHeaders(e, t) {
      if (Array.isArray(t) || !Rr(t)) return;
      let r = t.params?._meta?.[Tt];
      if (typeof r != "string") return;
      e.set("mcp-protocol-version", r);
      e.set("mcp-method", t.method);
      let o = t.params,
        n = t.method === "resources/read" ? typeof o?.uri == "string" ? o.uri : void 0 : typeof o?.name == "string" ? o.name : void 0;
      n !== void 0 && e.set("mcp-name", Bl(n));
    }
    _isModernEnvelopedRequest(e) {
      if (Array.isArray(e) || !Rr(e)) return !1;
      let t = e.params?._meta?.[Tt];
      return typeof t == "string" && Ot(t);
    }
    async _startOrAuthSse(e, t = !1, r = 0) {
      let {
          resumptionToken: o,
          requestSignal: n
        } = e,
        s = () => this._abortController?.signal.aborted === !0 || n?.aborted === !0;
      try {
        let i = await this._commonHeaders(),
          a = [...(i.get("accept")?.split(",").map(p => p.trim().toLowerCase()) ?? []), "text/event-stream"];
        i.set("accept", [...new Set(a)].join(", "));
        o && i.set("last-event-id", o);
        let u = this._abortController?.signal,
          l = n !== void 0 && u !== void 0 ? lS(u, n) : n ?? u,
          d = await (this._fetch ?? fetch)(this._url, {
            ...this._requestInit,
            method: "GET",
            headers: i,
            signal: l
          });
        if (!d.ok) {
          if (d.status === 401 && this._authProvider) {
            if (d.headers.has("www-authenticate")) {
              let {
                resourceMetadataUrl: p,
                scope: h
              } = Tr(d);
              this._resourceMetadataUrl = p;
              this._scope = dd(this._scope, h);
            }
            if (this._authProvider.onUnauthorized && !t) {
              try {
                await this._authProvider.onUnauthorized({
                  response: d,
                  serverUrl: this._url,
                  fetchFn: this._fetchWithInit
                });
              } catch (p) {
                throw Ee(p);
              }
              return await d.text?.().catch(() => {}), this._startOrAuthSse(e, !0, r);
            }
            throw await d.text?.().catch(() => {}), Ee(t ? new st(N.ClientHttpAuthentication, "Server returned 401 after re-authentication", {
              status: 401,
              statusText: d.statusText
            }) : new De());
          }
          if (d.status === 403) {
            let {
              resourceMetadataUrl: p,
              scope: h,
              error: f,
              errorDescription: g
            } = Tr(d);
            if (f === "insufficient_scope") {
              let y = await d.text?.().catch(() => null);
              if ((await this._stepUpAuthorize({
                scope: h,
                resourceMetadataUrl: p,
                errorDescription: g,
                statusText: d.statusText,
                text: y
              }, r)) !== "AUTHORIZED") throw Ee(new De());
              return this._startOrAuthSse(e, t, r + 1);
            }
          }
          if (await d.text?.().catch(() => {}), d.status === 405) {
            e.onRequestStreamEnd?.();
            return;
          }
          throw new st(N.ClientHttpFailedToOpenStream, `Failed to open SSE stream: ${d.statusText}`, {
            status: d.status,
            statusText: d.statusText
          });
        }
        this._handleSseStream(d.body, e, !0);
      } catch (i) {
        throw s() || this.onerror?.(i), i;
      }
    }
    _getNextReconnectionDelay(e) {
      if (this._serverRetryMs !== void 0) return this._serverRetryMs;
      let t = this._reconnectionOptions.initialReconnectionDelay,
        r = this._reconnectionOptions.reconnectionDelayGrowFactor,
        o = this._reconnectionOptions.maxReconnectionDelay;
      return Math.min(t * Math.pow(r, e), o);
    }
    _scheduleReconnection(e, t = 0) {
      let r = this._reconnectionOptions.maxRetries;
      if (t >= r) {
        this.onerror?.(new Error(`Maximum reconnection attempts (${r}) exceeded.`));
        e.onRequestStreamEnd?.();
        return;
      }
      let o = this._getNextReconnectionDelay(t),
        n = () => {
          this._cancelReconnection = void 0;
          !(this._abortController?.signal.aborted || e.requestSignal?.aborted) && this._startOrAuthSse(e).catch(s => {
            if (!(this._abortController?.signal.aborted || e.requestSignal?.aborted)) {
              this.onerror?.(new Error(`Failed to reconnect SSE stream: ${s instanceof Error ? s.message : String(s)}`));
              try {
                this._scheduleReconnection(e, t + 1);
              } catch (i) {
                this.onerror?.(i instanceof Error ? i : new Error(String(i)));
              }
            }
          });
        };
      if (this._reconnectionScheduler) {
        let s = this._reconnectionScheduler(n, o, t);
        this._cancelReconnection = typeof s == "function" ? s : void 0;
      } else {
        let s = setTimeout(n, o);
        this._cancelReconnection = () => clearTimeout(s);
      }
    }
    _handleSseStream(e, t, r) {
      if (!e) {
        t.onRequestStreamEnd?.();
        return;
      }
      let {
          onresumptiontoken: o,
          replayMessageId: n,
          requestSignal: s,
          onRequestStreamEnd: i
        } = t,
        a = () => this._abortController?.signal.aborted === !0 || s?.aborted === !0,
        u,
        l = !1,
        d = !1;
      (async () => {
        try {
          let h = e.pipeThrough(new TextDecoderStream()).pipeThrough(new zc({
            onRetry: f => {
              this._serverRetryMs = f;
            }
          })).getReader();
          for (;;) {
            let {
              value: f,
              done: g
            } = await h.read();
            if (g) break;
            if (f.id && (u = f.id, l = !0, o?.(f.id)), !!f.data && (!f.event || f.event === "message")) try {
              let y = kt.parse(JSON.parse(f.data));
              (bo(y) || vo(y)) && (d = !0, n !== void 0 && (y.id = n));
              this.onmessage?.(y);
            } catch (y) {
              this.onerror?.(y);
            }
          }
          (r || l) && !d && this._abortController && !a() ? this._scheduleReconnection({
            resumptionToken: u,
            onresumptiontoken: o,
            replayMessageId: n,
            requestSignal: s,
            onRequestStreamEnd: i
          }, 0) : a() || i?.();
        } catch (h) {
          if (a()) return;
          if (this.onerror?.(new Error(`SSE stream disconnected: ${h}`)), (r || l) && !d && this._abortController && !a()) try {
            this._scheduleReconnection({
              resumptionToken: u,
              onresumptiontoken: o,
              replayMessageId: n,
              requestSignal: s,
              onRequestStreamEnd: i
            }, 0);
          } catch (f) {
            this.onerror?.(new Error(`Failed to reconnect: ${f instanceof Error ? f.message : String(f)}`));
            i?.();
          } else i?.();
        }
      })();
    }
    async start() {
      if (this._abortController) throw new Error("StreamableHTTPClientTransport already started! If using Client class, note that connect() calls start() automatically.");
      this._abortController = new AbortController();
    }
    async finishAuth(e, t) {
      if (!this._oauthProvider) throw new De("finishAuth requires an OAuthClientProvider");
      let {
        authorizationCode: r,
        iss: o
      } = await fS(e, t, this._oauthProvider, this._url, {
        fetchFn: this._fetchWithInit,
        resourceMetadataUrl: this._resourceMetadataUrl
      });
      if ((await Rc(this._oauthProvider, {
        serverUrl: this._url,
        authorizationCode: r,
        iss: o,
        resourceMetadataUrl: this._resourceMetadataUrl,
        scope: this._scope,
        fetchFn: this._fetchWithInit,
        skipIssuerMetadataValidation: this._skipIssuerMetadataValidation
      })) !== "AUTHORIZED") throw new De("Failed to authorize");
    }
    async close() {
      try {
        this._cancelReconnection?.();
      } finally {
        this._cancelReconnection = void 0;
        this._abortController?.abort();
        this.onclose?.();
      }
    }
    async send(e, t) {
      return this._send(e, t, !1);
    }
    async _send(e, t, r, o = 0) {
      try {
        let {
          resumptionToken: n,
          onresumptiontoken: s
        } = t || {};
        if (n) {
          this._startOrAuthSse({
            resumptionToken: n,
            replayMessageId: Rr(e) ? e.id : void 0,
            requestSignal: t?.requestSignal
          }).catch(b => this.onerror?.(b));
          return;
        }
        let i = await this._commonHeaders();
        this._applyBodyDerivedHeaders(i, e);
        let a = Array.isArray(e) ? e.some(b => Hl(b)) : Hl(e);
        if (a && i.delete("mcp-session-id"), t?.headers !== void 0) for (let [b, T] of Object.entries(t.headers)) fR.has(b.toLowerCase()) || i.set(b, T);
        i.set("content-type", "application/json");
        let u = [...(i.get("accept")?.split(",").map(b => b.trim().toLowerCase()) ?? []), "application/json", "text/event-stream"];
        i.set("accept", [...new Set(u)].join(", "));
        let l = this._abortController?.signal,
          d = t?.requestSignal !== void 0 && l !== void 0 ? lS(l, t.requestSignal) : t?.requestSignal ?? l,
          p = {
            ...this._requestInit,
            method: "POST",
            headers: i,
            body: JSON.stringify(e),
            signal: d
          },
          h = await (this._fetch ?? fetch)(this._url, p);
        if (a && h.ok && (this._sessionId = h.headers.get("mcp-session-id") || void 0), !h.ok) {
          if (h.status === 401 && this._authProvider) {
            if (h.headers.has("www-authenticate")) {
              let {
                resourceMetadataUrl: T,
                scope: L
              } = Tr(h);
              this._resourceMetadataUrl = T;
              this._scope = dd(this._scope, L);
            }
            if (this._authProvider.onUnauthorized && !r) {
              try {
                await this._authProvider.onUnauthorized({
                  response: h,
                  serverUrl: this._url,
                  fetchFn: this._fetchWithInit
                });
              } catch (T) {
                throw Ee(T);
              }
              return await h.text?.().catch(() => {}), this._send(e, t, !0, o);
            }
            throw await h.text?.().catch(() => {}), Ee(r ? new st(N.ClientHttpAuthentication, "Server returned 401 after re-authentication", {
              status: 401,
              statusText: h.statusText
            }) : new De());
          }
          let b = await h.text?.().catch(() => null);
          if (h.status === 403) {
            let {
              resourceMetadataUrl: T,
              scope: L,
              error: U,
              errorDescription: te
            } = Tr(h);
            if (U === "insufficient_scope") {
              if ((await this._stepUpAuthorize({
                scope: L,
                resourceMetadataUrl: T,
                errorDescription: te,
                statusText: h.statusText,
                text: b
              }, o)) !== "AUTHORIZED") throw Ee(new De());
              return this._send(e, t, r, o + 1);
            }
          }
          if (h.status === 400 && typeof b == "string" && this._isModernEnvelopedRequest(e)) try {
            let T = kt.parse(JSON.parse(b)),
              L = (Array.isArray(e) ? e : [e]).filter(U => Rr(U));
            if (vo(T) && L.some(U => U.id === T.id)) {
              this.onmessage?.(T);
              return;
            }
          } catch {}
          throw new st(N.ClientHttpNotImplemented, `Error POSTing to endpoint: ${b}`, {
            status: h.status,
            statusText: h.statusText,
            text: b
          });
        }
        if (h.status === 202) {
          await h.text?.().catch(() => {});
          Eg(e) && this._startOrAuthSse({
            resumptionToken: void 0
          }).catch(b => this.onerror?.(b));
          return;
        }
        let f = (Array.isArray(e) ? e : [e]).some(b => "method" in b && "id" in b && b.id !== void 0),
          g = h.headers.get("content-type"),
          y = Dg(g);
        if (f) {
          if (y === "text/event-stream") this._handleSseStream(h.body, {
            onresumptiontoken: s,
            requestSignal: t?.requestSignal,
            onRequestStreamEnd: t?.onRequestStreamEnd
          }, !1);else if (y === "application/json") {
            let b = await h.json(),
              T = Array.isArray(b) ? b.map(L => kt.parse(L)) : [kt.parse(b)];
            for (let L of T) this.onmessage?.(L);
          } else throw await h.text?.().catch(() => {}), new A(N.ClientHttpUnexpectedContent, `Unexpected content type: ${g}`, {
            contentType: g
          });
        } else await h.text?.().catch(() => {});
      } catch (n) {
        throw t?.requestSignal?.aborted !== !0 && this.onerror?.(n), n;
      }
    }
    get sessionId() {
      return this._sessionId;
    }
    async terminateSession() {
      if (this._sessionId) try {
        let e = await this._commonHeaders(),
          t = {
            ...this._requestInit,
            method: "DELETE",
            headers: e,
            signal: this._abortController?.signal
          },
          r = await (this._fetch ?? fetch)(this._url, t);
        if (await r.text?.().catch(() => {}), !r.ok && r.status !== 405) throw new st(N.ClientHttpFailedToTerminateSession, `Failed to terminate session: ${r.statusText}`, {
          status: r.status,
          statusText: r.statusText
        });
        this._sessionId = void 0;
      } catch (e) {
        throw this.onerror?.(e), e;
      }
    }
    setProtocolVersion(e) {
      this._protocolVersion = e;
    }
    get protocolVersion() {
      return this._protocolVersion;
    }
    async resumeStream(e, t) {
      await this._startOrAuthSse({
        resumptionToken: e,
        onresumptiontoken: t?.onresumptiontoken
      });
    }
  };
  window.u2McpSdk = Object.freeze({
    Client: PS,
    SSEClientTransport: $S,
    StreamableHTTPClientTransport: TS
  });
})();
