var defaultPrompt = "你正在扮演 YouTube 直播主播 {char}。\n主播人设：{char_persona}\n观看用户：{user}\n用户人设：{user_persona}\n联动嘉宾：{guest}\n已绑定世界书：{wb_context}\n上一场直播总结：{live_summary_context}\n{msg_context}\n{context_clue}\n\n请生成主播在直播画面中的回应，像真实直播间一样自然推进内容。除了要生成主播的话，还要生成第三人称视角的画面、环境和氛围描写，可以穿插在主播的话中，一条20字左右。\n特别要求：主播不仅要针对 {user} 的最新消息进行回复，还得自然地回复其他观众的评论，表现出连续自然的直播间多人互动状态。\n只返回严格 JSON：\n{\n  \"narrative\": \"第三人称视角的画面、环境和氛围描写\",\n  \"charBubbles\": [\"主播画面气泡1\", \"主播画面气泡2\"],\n  \"fanComments\": [{\"name\": \"观众名\", \"text\": \"弹幕\"}],\n  \"randomSuperChat\": {\"hasSuperChat\": false, \"name\": \"\", \"text\": \"\", \"displayAmount\": \"\", \"amount\": 0, \"color\": \"#e65100\"}\n}\n要求：主播气泡不少于 5 条，继续生成不少于 10 条弹幕评论（fanComments），这些弹幕中，一部分可以是对 {user} 最新评论的回复、跟风或吐槽；另一部分可以是刚进直播间的新观众留言，或是没看到 {user} 评论、纯粹针对主播或直播内容表达自己观点的独立弹幕，以体现真实直播间弹幕的丰富和滚动感。\n语言自然，不要 emoji，不要 Markdown。",
  defaultGroupChatPrompt = "你要生成真实自然的 YouTube 私信或频道粉丝社群对话。频道主体是 {char}。\n群主人设：{char_persona}\n用户：{user}\n用户人设：{user_persona}\n可用管理员（自建社群时使用）：\n{admins}\n世界书内容：{wb_context}\n聊天记录：\n{chat_history}\n\n触发说明：\n{trigger_instruction}\n\n请根据聊天上下文生成活泼自然的短消息，并严格遵循末尾追加的 JSON 输出协议。\n要求：\n1. 不要使用 Markdown，不要 emoji，语气符合真实私信或粉丝群氛围，可以吹捧、调侃、讨论和自然追问。\n2. 连续消息应有上下文关系，不要机械复述。\n3. YouTube 是国际化平台，可以使用符合角色国籍、人设和上下文的任意语言；外语必须提供自然中文翻译。",
  defaultVODPrompt = "你正在扮演 YouTube 频道 {char}。\n频道人设：{char_persona}\n用户：{user}\n用户人设：{user_persona}\n视频标题：{video_title}\n已绑定世界书：{wb_context}\n用户评论：{msg}\n\n请生成视频评论区的后续互动。\n只返回严格 JSON：\n{\n  \"charReplies\": [\"频道回复\"],\n  \"fanReplies\": [\"其他观众回复\"]\n}\n不要 Markdown，不要 emoji，评论要短而像真实 YouTube 评论区。",
  defaultSummaryPrompt = "请为这场 YouTube 直播生成复盘总结。\n主播/频道：{char}\n主播人设：{char_persona}\n用户人设：{user}\n当前时间：{current_time}\n聊天记录：\n{chat_history}\n\n只返回严格 JSON：\n{\n  \"title\": \"总结标题\",\n  \"content\": \"总结正文\",\n  \"mood\": \"直播氛围\",\n  \"highlights\": [\"亮点1\", \"亮点2\"],\n  \"newSubs\": 0\n}\n不要 Markdown，不要 emoji。";
const ytBindWorldBookBtn = document.getElementById("yt-bind-wb-btn"),
  ytSettingsSheet = document.getElementById("yt-settings-sheet"),
  ytSummaryListBtn = document.getElementById("yt-summary-list-btn"),
  ytBoundWbName = document.getElementById("yt-bound-wb-name"),
  promptTabLive = document.getElementById("prompt-tab-live"),
  promptTabGroup = document.getElementById("prompt-tab-group"),
  ytPromptInput = document.getElementById("yt-prompt-input"),
  ytPromptDesc = document.getElementById("yt-prompt-desc"),
  resetYtPromptBtn = document.getElementById("reset-yt-prompt-btn"),
  confirmYtPromptBtn = document.getElementById("confirm-yt-prompt-btn");
let currentYtPromptType = "live";
function closeYtSettingsSheet() {
  if (ytSettingsSheet) ytSettingsSheet.classList.remove("active");
}
function updateYtBoundWorldBookLabel() {
  if (!ytBoundWbName) return;
  const ids = Array.isArray(channelState?.boundWorldBookIds) ? channelState.boundWorldBookIds : [];
  if (ids.length === 0) {
    ytBoundWbName.textContent = "未绑定";
    return;
  }
  const books = typeof window.getWorldBooks === "function" ? window.getWorldBooks() : [],
    names = ids.map(id_2 => books.find(book => String(book.id) === String(id_2))?.name).filter(Boolean);
  ytBoundWbName.textContent = names.length > 0 ? names.join("、") : "已绑定 " + ids.length + " 项";
}
function getYtPromptValue(type) {
  if (type === "group") return channelState.groupChatPrompt || defaultGroupChatPrompt;
  return channelState.systemPrompt || defaultPrompt;
}
function getDefaultYtPromptValue(type_2) {
  if (type_2 === "group") return defaultGroupChatPrompt;
  return defaultPrompt;
}
function setActiveYtPromptTab(type_3) {
  currentYtPromptType = type_3 === "group" ? "group" : "live";
  if (promptTabLive) promptTabLive.classList.toggle("active", currentYtPromptType === "live");
  if (promptTabGroup) promptTabGroup.classList.toggle("active", currentYtPromptType === "group");
  ytPromptDesc && (ytPromptDesc.textContent = currentYtPromptType === "group" ? "群聊/私信提示词。可用变量：{char}、{char_persona}、{user}、{user_persona}、{admins}、{wb_context}、{chat_history}、{trigger_instruction}。" : "直播互动提示词。可用变量：{char}、{char_persona}、{user}、{user_persona}、{guest}、{wb_context}、{live_summary_context}、{msg_context}、{context_clue}。");
  if (ytPromptInput) ytPromptInput.value = getYtPromptValue(currentYtPromptType);
}
ytBindWorldBookBtn && ytSettingsSheet && ytBindWorldBookBtn.addEventListener("click", () => {
  window.renderWorldBookSelector && window.renderWorldBookSelector(channelState.boundWorldBookIds || [], selectedIds => {
    channelState.boundWorldBookIds = selectedIds;
    if (typeof saveYoutubeData === "function") saveYoutubeData();
    updateYtBoundWorldBookLabel();
  });
});
ytSummaryListBtn && ytSummaryListBtn.addEventListener("click", () => {
  typeof window.renderYtSummaryList === "function" && window.renderYtSummaryList();
  const summarySheet = document.getElementById("yt-summary-list-sheet");
  if (summarySheet) summarySheet.classList.add("active");
  closeYtSettingsSheet();
});
promptTabLive && promptTabLive.addEventListener("click", () => setActiveYtPromptTab("live"));
promptTabGroup && promptTabGroup.addEventListener("click", () => setActiveYtPromptTab("group"));
resetYtPromptBtn && ytPromptInput && resetYtPromptBtn.addEventListener("click", () => {
  ytPromptInput.value = getDefaultYtPromptValue(currentYtPromptType);
});
confirmYtPromptBtn && ytPromptInput && confirmYtPromptBtn.addEventListener("click", () => {
  currentYtPromptType === "group" ? channelState.groupChatPrompt = ytPromptInput.value.trim() : channelState.systemPrompt = ytPromptInput.value.trim();
  if (typeof saveYoutubeData === "function") saveYoutubeData();
  if (window.showToast) window.showToast("已保存");
  const promptSheet = document.getElementById("yt-prompt-sheet");
  if (promptSheet) promptSheet.classList.remove("active");
});
updateYtBoundWorldBookLabel();
setActiveYtPromptTab("live");
