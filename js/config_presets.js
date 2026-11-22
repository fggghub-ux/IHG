(function (localValue1) {
  const localValue2 = localValue9 => JSON.parse(JSON.stringify(localValue9)),
    localValue3 = localValue10 => String(localValue10 ?? "").trim(),
    localValue4 = () => "config-preset-" + (localValue1.crypto?.["randomUUID"]?.() || Date.now() + "-" + Math.random().toString(36).slice(2));
  function localValue5(localValue11) {
    const localValue12 = new Set();
    return (Array.isArray(localValue11) ? localValue11 : []).filter(localValue13 => {
      if (!localValue13 || !localValue3(localValue13.id) || !localValue3(localValue13.name) || !localValue13.data || typeof localValue13.data !== "object" || Array.isArray(localValue13.data)) return false;
      if (localValue12.has(String(localValue13.id))) return false;
      return localValue12.add(String(localValue13.id)), true;
    }).map(localValue14 => ({
      "id": String(localValue14.id),
      "name": localValue3(localValue14.name).slice(0, 48),
      "data": localValue2(localValue14.data)
    }));
  }
  function localValue6({
    get: localValue15,
    set: localValue16,
    persist: localValue17,
    restore: localValue18
  }) {
    let localValue19 = Promise.resolve();
    const localValue20 = () => localValue5(localValue15());
    function localValue21(localValue22) {
      const localValue23 = localValue19.then(async () => {
        const localValue24 = localValue20(),
          {
            values: localValue25,
            result: localValue26
          } = localValue22(localValue24);
        localValue16(localValue25);
        try {
          if ((await localValue17()) === false) throw new Error("预设保存失败，请重试");
          return localValue26;
        } catch (localValue27) {
          localValue16(localValue24);
          try {
            await localValue18?.();
          } catch (localValue28) {}
          throw localValue27;
        }
      });
      return localValue19 = localValue23["catch"](() => {}), localValue23;
    }
    return {
      "list": localValue20,
      "save"(localValue29, localValue30) {
        const localValue31 = localValue3(localValue29).slice(0, 48);
        if (!localValue31) return Promise.reject(new Error("请填写预设名称"));
        const localValue32 = localValue2(localValue30);
        return localValue21(localValue33 => {
          const localValue34 = localValue33.find(localValue36 => localValue36.name.toLocaleLowerCase() === localValue31.toLocaleLowerCase()),
            localValue35 = {
              "id": localValue34?.["id"] || localValue4(),
              "name": localValue31,
              "data": localValue32
            };
          return {
            "values": localValue34 ? localValue33.map(localValue37 => localValue37.id === localValue34.id ? localValue35 : localValue37) : localValue33.concat(localValue35),
            "result": {
              "preset": localValue2(localValue35),
              "updated": !!localValue34
            }
          };
        });
      },
      "remove"(localValue38) {
        return localValue21(localValue39 => ({
          "values": localValue39.filter(localValue40 => localValue40.id !== localValue38),
          "result": true
        }));
      }
    };
  }
  function localValue7(localValue41, localValue42, localValue43) {
    const localValue44 = localValue3(localValue42?.["provider"]),
      localValue45 = localValue43({
        "activeProvider": localValue44,
        "providers": {
          [localValue44]: localValue42?.["config"] || {}
        }
      });
    if (!localValue44 || localValue45.activeProvider !== localValue44) throw new Error("预设服务商不可用");
    const localValue46 = localValue43(localValue41);
    return localValue46.activeProvider = localValue44, localValue46.providers[localValue44] = localValue2(localValue45.providers[localValue44]), localValue46;
  }
  function localValue8({
    id: localValue47,
    title: localValue48,
    library: localValue49,
    getDraft: localValue50,
    applyDraft: localValue51,
    describe = () => ({})
  }) {
    let localValue52,
      localValue53,
      localValue54,
      localValue55,
      localValue56,
      localValue57,
      localValue58,
      localValue59,
      localValue60,
      localValue61 = false,
      localValue62 = null;
    const localValue63 = localValue70 => localValue1.showToast?.(localValue70),
      localValue64 = (localValue71, localValue72, localValue73) => {
        const localValue74 = document.createElement(localValue71);
        localValue74.className = localValue72;
        if (localValue73 !== undefined) localValue74.textContent = localValue73;
        return localValue74;
      };
    function localValue65() {
      if (localValue61) return;
      localValue1.closeView(localValue52), localValue52.setAttribute("aria-hidden", "true"), localValue52.inert = true, localValue62?.["focus"]?.({
        "preventScroll": true
      });
    }
    async function localValue66(localValue75) {
      if (localValue61) return;
      localValue61 = true, localValue52.setAttribute("aria-busy", "true"), localValue52.querySelectorAll("button, input").forEach(localValue76 => {
        localValue76.disabled = true;
      });
      try {
        await localValue75();
      } catch (localValue77) {
        localValue63(localValue77?.["message"] || "预设操作失败，请重试");
      } finally {
        localValue61 = false, localValue52.removeAttribute("aria-busy"), localValue52.querySelectorAll("button, input").forEach(localValue78 => {
          localValue78.disabled = false;
        });
      }
    }
    function localValue67() {
      const localValue79 = localValue49.list(),
        localValue80 = localValue3(localValue54.value).toLocaleLowerCase(),
        localValue81 = localValue79.filter(localValue82 => {
          const localValue83 = describe(localValue82.data);
          return [localValue82.name, localValue83.meta, localValue83.endpoint].some(localValue84 => String(localValue84 || "").toLocaleLowerCase().includes(localValue80));
        });
      localValue56.textContent = localValue81.length === localValue79.length ? localValue79.length + " 个预设" : localValue81.length + " / " + localValue79.length + " 个预设", localValue55.replaceChildren();
      if (!localValue81.length) {
        localValue55.appendChild(localValue64("div", "api-preset-empty", localValue79.length ? "没有匹配的预设" : "暂无预设"));
        return;
      }
      localValue81.forEach(localValue85 => {
        const localValue86 = describe(localValue85.data),
          localValue87 = localValue64("div", "api-preset-card"),
          localValue88 = localValue64("button", "api-preset-card-main");
        localValue88.type = "button", localValue88.setAttribute("aria-label", "加载预设 " + localValue85.name);
        const localValue89 = localValue64("span", "api-preset-card-content");
        localValue89.appendChild(localValue64("span", "api-preset-card-name", localValue85.name));
        if (localValue86.meta) localValue89.appendChild(localValue64("span", "api-preset-card-meta", localValue86.meta));
        if (localValue86.endpoint) localValue89.appendChild(localValue64("span", "api-preset-card-endpoint", localValue86.endpoint));
        localValue88.append(localValue89, localValue64("span", "api-preset-card-arrow", "›")), localValue88.addEventListener("click", () => {
          if (localValue61) return;
          try {
            localValue51(localValue2(localValue85.data)), localValue65(), localValue63("已加载“" + localValue85.name + "”，保存设置后生效");
          } catch (localValue91) {
            localValue63(localValue91?.["message"] || "预设加载失败");
          }
        });
        const localValue90 = localValue64("button", "api-preset-card-delete");
        localValue90.type = "button", localValue90.setAttribute("aria-label", "删除预设 " + localValue85.name), localValue90.innerHTML = "<i class=\"far fa-trash-alt\" aria-hidden=\"true\"></i>", localValue90.addEventListener("click", () => {
          if (localValue61 || !localValue1.confirm("删除预设“" + localValue85.name + "”？")) return;
          void localValue66(async () => {
            await localValue49.remove(localValue85.id), localValue67(), localValue63("预设已删除");
          });
        }), localValue87.append(localValue88, localValue90), localValue55.appendChild(localValue87);
      });
    }
    function localValue68() {
      if (localValue52) return;
      localValue52 = localValue64("div", "bottom-sheet-overlay detail-sheet-overlay api-preset-overlay config-preset-overlay"), localValue52.id = localValue47 + "-dialog", localValue52.setAttribute("role", "dialog"), localValue52.setAttribute("aria-modal", "true"), localValue52.setAttribute("aria-labelledby", localValue47 + "-heading"), localValue52.innerHTML = "<div class=\"bottom-sheet api-preset-sheet\">\n                <div class=\"sheet-handle\"></div>\n                <div class=\"api-preset-sheet-header\"><div><div class=\"api-preset-eyebrow\"></div><div class=\"sheet-title\" id=\"" + localValue47 + "-heading\"></div></div><button type=\"button\" class=\"api-preset-close\" aria-label=\"关闭\"><i class=\"fas fa-xmark\" aria-hidden=\"true\"></i></button></div>\n                <div data-preset-save><div class=\"api-preset-form\"><label class=\"api-preset-field\" for=\"" + localValue47 + "-name\"><span>预设名称</span><input id=\"" + localValue47 + "-name\" maxlength=\"48\" autocomplete=\"off\" enterkeyhint=\"done\" placeholder=\"输入预设名称\"></label><p class=\"api-preset-hint\">同名预设会更新原配置。</p></div><button type=\"button\" class=\"api-preset-primary\" data-preset-confirm>保存预设</button></div>\n                <div data-preset-load><div class=\"api-preset-toolbar\"><label class=\"api-preset-search\" for=\"" + localValue47 + "-search\"><i class=\"fas fa-search\" aria-hidden=\"true\"></i><input id=\"" + localValue47 + "-search\" type=\"search\" placeholder=\"搜索预设\" autocomplete=\"off\"></label><span class=\"api-preset-count\"></span></div><div class=\"api-preset-list\" role=\"list\" aria-live=\"polite\"></div><button type=\"button\" class=\"api-preset-secondary\" data-preset-close>关闭</button></div>\n            </div>", localValue52.querySelector(".api-preset-eyebrow").textContent = localValue48, localValue60 = localValue52.querySelector(".sheet-title"), localValue53 = localValue52.querySelector("#" + localValue47 + "-name"), localValue54 = localValue52.querySelector("#" + localValue47 + "-search"), localValue55 = localValue52.querySelector(".api-preset-list"), localValue56 = localValue52.querySelector(".api-preset-count"), localValue58 = localValue52.querySelector("[data-preset-save]"), localValue59 = localValue52.querySelector("[data-preset-load]"), localValue57 = localValue52.querySelector("[data-preset-confirm]"), localValue52.querySelectorAll(".api-preset-close, [data-preset-close]").forEach(localValue92 => localValue92.addEventListener("click", localValue65)), localValue52.addEventListener("click", localValue93 => {
        if (localValue93.target === localValue52) localValue65();
      }), localValue52.addEventListener("keydown", localValue94 => {
        localValue94.key === "Escape" && (localValue94.stopPropagation(), localValue65());
      }), localValue54.addEventListener("input", localValue67), localValue57.addEventListener("click", () => void localValue66(async () => {
        const localValue95 = await localValue49.save(localValue53.value, localValue50());
        localValue63("预设“" + localValue95.preset.name + "”已" + (localValue95.updated ? "更新" : "保存")), localValue61 = false, localValue65();
      })), localValue1.mobileInputCompat?.["register"] ? localValue1.mobileInputCompat.register({
        "input": localValue53,
        "onSend": () => localValue57.click(),
        "enterKeyHint": "done"
      }) : localValue53.addEventListener("keydown", localValue96 => {
        localValue96.key === "Enter" && !localValue96.isComposing && (localValue96.preventDefault(), localValue57.click());
      }), (document.getElementById("app") || document.body).appendChild(localValue52);
    }
    function localValue69(localValue97) {
      localValue68();
      if (localValue61) return;
      localValue62 = document.activeElement;
      const localValue98 = localValue97 === "save";
      localValue60.textContent = localValue98 ? "存为预设" : "加载预设", localValue58.hidden = !localValue98, localValue59.hidden = localValue98, localValue52.querySelector(".api-preset-sheet").classList.toggle("api-preset-load-sheet", !localValue98), localValue52.querySelector(".api-preset-sheet").classList.toggle("api-preset-save-sheet", localValue98), localValue53.value = "", localValue54.value = "";
      if (!localValue98) localValue67();
      localValue52.inert = false, localValue52.setAttribute("aria-hidden", "false"), localValue1.openView(localValue52), (localValue98 ? localValue53 : localValue54).focus({
        "preventScroll": true
      });
    }
    return {
      "openSave": () => localValue69("save"),
      "openLoad": () => localValue69("load")
    };
  }
  localValue1.u2ConfigPresets = {
    "normalizePresets": localValue5,
    "createLibrary": localValue6,
    "mergeProviderConfig": localValue7,
    "createManager": localValue8
  };
})(window);
