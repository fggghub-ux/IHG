const trendRefreshBtn = document.getElementById("yt-trending-refresh-btn"),
  trendList = document.getElementById("yt-trending-list");
let isTrendingLoading = false,
  currentTrendingType = "live";
const trendFilterLive = document.getElementById("yt-trend-filter-live"),
  trendFilterSub = document.getElementById("yt-trend-filter-sub");
trendFilterLive && trendFilterSub && (trendFilterLive.addEventListener("click", () => {
  trendFilterLive.classList.add("active");
  trendFilterSub.classList.remove("active");
  currentTrendingType = "live";
  if (channelState.cachedTrendingLive && channelState.cachedTrendingLive.length > 0) renderTrendingData(channelState.cachedTrendingLive);else trendList && (trendList.innerHTML = "<div style=\"text-align: center; color: #8e8e93; margin-top: 40px;\">点击右上角魔法棒生成最新榜单</div>");
}), trendFilterSub.addEventListener("click", () => {
  trendFilterSub.classList.add("active");
  trendFilterLive.classList.remove("active");
  currentTrendingType = "sub";
  if (channelState.cachedTrendingSub && channelState.cachedTrendingSub.length > 0) renderTrendingData(channelState.cachedTrendingSub);else trendList && (trendList.innerHTML = "<div style=\"text-align: center; color: #8e8e93; margin-top: 40px;\">点击右上角魔法棒生成最新榜单</div>");
}));
const mockTrendingData = [{
  rank: 1,
  name: "PewDiePie",
  handle: "pewdiepie",
  desc: "Gameplays, memes and everything in between.",
  subs: "1.11亿",
  videos: "4.7K",
  isLive: true
}, {
  rank: 2,
  name: "MrBeast",
  handle: "mrbeast",
  desc: "I do crazy challenges and give away money.",
  subs: "2.5亿",
  videos: "780",
  isLive: false
}, {
  rank: 3,
  name: "Markiplier",
  handle: "markiplier",
  desc: "Welcome to Markiplier! Here you'll find hilarious gaming videos.",
  subs: "3600万",
  videos: "5.4K",
  isLive: false
}, {
  rank: 4,
  name: "Gawr Gura",
  handle: "gawrgura",
  desc: "Shark girl from Atlantis. Chumbuds assemble!",
  subs: "440万",
  videos: "500",
  isLive: true
}, {
  rank: 5,
  name: "MKBHD",
  handle: "markiplier",
  desc: "Tech reviews and crispy videos.",
  subs: "1800万",
  videos: "1.5K",
  isLive: false
}, {
  rank: 6,
  name: "IShowSpeed",
  handle: "ishowspeed",
  desc: "Loud, crazy, and always entertaining.",
  subs: "2200万",
  videos: "1.2K",
  isLive: true
}, {
  rank: 7,
  name: "Jacksepticeye",
  handle: "jacksepticeye",
  desc: "Top of the mornin to ya laddies!",
  subs: "3000万",
  videos: "5.1K",
  isLive: false
}, {
  rank: 8,
  name: "Dude Perfect",
  handle: "dudeperfect",
  desc: "5 best friends and a panda.",
  subs: "6000万",
  videos: "300",
  isLive: false
}, {
  rank: 9,
  name: "Valkyrae",
  handle: "valkyrae",
  desc: "Gaming, lifestyle and good vibes.",
  subs: "400万",
  videos: "400",
  isLive: true
}, {
  rank: 10,
  name: "Sykkuno",
  handle: "sykkuno",
  desc: "Just playing games for fun.",
  subs: "290万",
  videos: "600",
  isLive: false
}];
function normalizeTrendingArray(trendingArray_2, type_2 = currentTrendingType) {
  if (!Array.isArray(trendingArray_2)) return [];
  return trendingArray_2.filter(item => item && typeof item === "object").map((item_2, index) => {
    const rank_2 = Number(item_2.rank) || index + 1,
      name_2 = String(item_2.name || item_2.nickname || "频道" + rank_2).trim(),
      handle_2 = String(item_2.handle || name_2 || "channel" + rank_2).replace(/^@/, "").replace(/\s+/g, "").trim() || "channel" + rank_2,
      id_2 = item_2.id || (typeof createStableYtChannelId === "function" ? createStableYtChannelId(type_2 + "_" + handle_2, "char_trend") : "char_trend_" + type_2 + "_" + handle_2),
      avatar_2 = item_2.avatar || item_2.avatarUrl || "https://picsum.photos/seed/" + encodeURIComponent(handle_2) + "/80/80";
    return {
      ...item_2,
      id: id_2,
      rank: rank_2,
      name: name_2,
      handle: handle_2,
      avatar: avatar_2,
      banner: item_2.banner || null,
      desc: item_2.desc || item_2.persona || "",
      subs: item_2.subs || "0",
      videos: item_2.videos || "10",
      isLive: type_2 === "live" ? true : !!item_2.isLive
    };
  });
}
function persistTrendingCache(value_8, value_9) {
  const trendingArray = normalizeTrendingArray(value_9, value_8);
  value_8 === "live" ? channelState.cachedTrendingLive = trendingArray : channelState.cachedTrendingSub = trendingArray;
  if (typeof saveYoutubeData === "function") saveYoutubeData();
  return trendingArray;
}
function renderTrendingData(trendingArray_3) {
  if (!trendList) return;
  trendList.innerHTML = "";
  const normalizedTrending = normalizeTrendingArray(trendingArray_3);
  normalizedTrending.length > 0 ? normalizedTrending.forEach((item_3, index_2) => {
    const avatar_3 = item_3.avatar || "https://picsum.photos/seed/" + encodeURIComponent(item_3.handle) + "/80/80",
      el = document.createElement("div");
    el.className = "yt-trending-list-item";
    let rankClass = "";
    if (item_3.rank === 1) rankClass = "top-1";
    if (item_3.rank === 2) rankClass = "top-2";
    if (item_3.rank === 3) rankClass = "top-3";
    el.innerHTML = "\n                    <div class=\"yt-trending-rank " + rankClass + "\">" + item_3.rank + "</div>\n                    <div class=\"yt-video-avatar\" style=\"width: 50px; height: 50px; flex-shrink: 0;\">\n                        <img src=\"" + avatar_3 + "\">\n                    </div>\n                    <div style=\"flex: 1; overflow: hidden;\">\n                        <div style=\"font-size: 16px; font-weight: 500; color: #0f0f0f; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;\">" + item_3.name + "</div>\n                        <div style=\"font-size: 12px; color: #606060; margin-top: 2px;\">@" + item_3.handle + " • " + item_3.subs + " 订阅</div>\n                        <div style=\"font-size: 12px; color: #8e8e93; margin-top: 2px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;\">" + item_3.desc + "</div>\n                    </div>\n                    " + (item_3.isLive ? "<div class=\"yt-live-badge\" style=\"position:static; margin-left:10px;\"><i class=\"fas fa-broadcast-tower\"></i></div>" : "") + "\n                ";
    el.addEventListener("click", () => {
      let channelData = typeof buildYtChannelFromTrendingItem === "function" ? buildYtChannelFromTrendingItem(item_3, currentTrendingType, index_2) : {
        ...item_3,
        avatar: avatar_3,
        isSubscribed: false
      };
      if (typeof mergeYtChannelIntoSubscriptions === "function") channelData = mergeYtChannelIntoSubscriptions(channelData, {
        save: true,
        preferExistingSubscription: true
      }) || channelData;else typeof saveYoutubeData === "function" && saveYoutubeData();
      openSubChannelView(channelData);
    });
    trendList.appendChild(el);
  }) : trendList.innerHTML = "<div style=\"text-align: center; color: #8e8e93; margin-top: 40px;\">点击右上角魔法棒生成最新榜单</div>";
}
if (trendList) {
  const initialTrending = channelState.cachedTrendingLive || channelState.cachedTrendingSub;
  Array.isArray(initialTrending) && initialTrending.length > 0 && (!channelState.cachedTrendingLive && channelState.cachedTrendingSub && (currentTrendingType = "sub", trendFilterSub && trendFilterLive && (trendFilterSub.classList.add("active"), trendFilterLive.classList.remove("active"))), renderTrendingData(initialTrending));
}
trendRefreshBtn && trendList && trendRefreshBtn.addEventListener("click", async event => {
  if (event) event.stopPropagation();
  if (isTrendingLoading) return;
  if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
    if (window.showToast) window.showToast("请先配置 API，当前显示默认榜单");
    const fallbackTrending = persistTrendingCache(currentTrendingType, mockTrendingData);
    renderTrendingData(fallbackTrending);
    return;
  }
  const wbContext = window.getYtWorldBookContext ? window.getYtWorldBookContext(currentTrendingType) : "";
  isTrendingLoading = true;
  trendList.innerHTML = "<div style=\"text-align:center; padding: 40px; color:#8e8e93;\"><i class=\"fas fa-spinner fa-spin\" style=\"font-size:24px; margin-bottom:10px;\"></i><p>正在拉取最新榜单数据...</p></div>";
  let content_2 = "";
  currentTrendingType === "live" ? content_2 = "请根据世界书生成八个正在直播的频道（NO.1-8）。\n要求返回严格的JSON格式，必须完全符合以下结构：\n{\n  \"trending\": [\n    {\n      \"rank\": 1,\n      \"name\": \"频道名称\",\n      \"handle\": \"账号名不带@\",\n      \"desc\": \"频道简介或主播人设\",\n      \"subs\": \"254万\",\n      \"videos\": \"120\",\n      \"isLive\": true\n    }\n  ]\n}\n注意：isLive 必须全部设为 true。\n" + wbContext + "\n不要包含任何Markdown标记。" : content_2 = "请根据世界书生成NO.1-8订阅最多的人。\n要求返回严格的JSON格式，必须完全符合以下结构：\n{\n  \"trending\": [\n    {\n      \"rank\": 1,\n      \"name\": \"频道名称\",\n      \"handle\": \"账号名不带@\",\n      \"desc\": \"频道简介或主播人设\",\n      \"subs\": \"254万\",\n      \"videos\": \"120\",\n      \"isLive\": false\n    }\n  ]\n}\n注意：isLive 必须全部设为 false。\n" + wbContext + "\n不要包含任何Markdown标记。";
  try {
    const endpoint_2 = window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint),
      value_19 = await fetch(endpoint_2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.apiConfig.apiKey
        },
        body: JSON.stringify({
          model: window.apiConfig.model || "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: content_2
          }],
          temperature: 0.9,
          response_format: {
            type: "json_object"
          }
        })
      });
    if (!value_19.ok) throw window.u2Api?.createHttpError?.(value_19, await window.u2Api?.readApiError?.(value_19)) || Object.assign(new Error("HTTP " + value_19.status), {
      status: value_19.status
    });
    const data = await value_19.json();
    let rawText = data.choices[0].message.content,
      jsonMatch = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/),
      resultText = jsonMatch ? jsonMatch[0] : rawText;
    resultText = resultText.replace(/```json/gi, "").replace(/```/g, "").trim();
    let parsed;
    try {
      parsed = sanitizeObj(JSON.parse(resultText));
    } catch (parseErr) {
      console.error("JSON Parse Error in Trending:", parseErr, resultText);
      if (window.showToast) window.showToast("大模型返回的格式有误，请重试");
      trendList.innerHTML = "<div style=\"text-align:center; padding: 40px; color:#ff3b30;\"><i class=\"fas fa-exclamation-triangle\" style=\"font-size:24px; margin-bottom:10px;\"></i><p>生成数据解析失败，请点击右上角重新生成</p></div>";
      isTrendingLoading = false;
      return;
    }
    trendList.innerHTML = "";
    let trendingArray_4 = [];
    if (Array.isArray(parsed)) trendingArray_4 = parsed;else {
      if (parsed.trending && Array.isArray(parsed.trending)) trendingArray_4 = parsed.trending;else {
        if (typeof parsed === "object") {
          const keys_2 = Object.keys(parsed);
          keys_2.length > 0 && Array.isArray(parsed[keys_2[0]]) ? trendingArray_4 = parsed[keys_2[0]] : trendingArray_4 = [parsed];
        }
      }
    }
    if (trendingArray_4.length > 0) {
      const persistTrendingCache_28 = persistTrendingCache(currentTrendingType, trendingArray_4);
      renderTrendingData(persistTrendingCache_28);
    } else trendList.innerHTML = "<div style=\"text-align:center; padding: 40px; color:#8e8e93;\">没有生成到有效榜单，请重试</div>";
  } catch (value_29) {
    console.error(value_29);
    trendList.innerHTML = "<div style=\"text-align:center; padding: 40px; color:#ff3b30;\">生成失败，请重试</div>";
  } finally {
    isTrendingLoading = false;
  }
});
