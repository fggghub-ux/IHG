(function (localValue1) {
  const localValue2 = localValue1.imApp = localValue1.imApp || {};
  localValue2.applyGroupThoughtPreference = function (localValue3, localValue4) {
    if (localValue4.type !== "group" || localValue4.thoughtStatusEnabled !== false) return localValue3;
    return String(localValue3).replace(/,\s*"thought"\s*:\s*"(?:[^"\\]|\\.)*"/g, "").replace(/^.*(?:- thought always uses|12\. Write thought as).*\r?\n?/gm, "").replace(/, with optional thought as for ordinary messages/g, "");
  }, localValue2.buildCherishedMemoryRequirement = function (localValue5) {
    if (localValue5.type === "group") return "";
    if (localValue5.allowCharCherishedMemory === false) return "\nCherished memory requests are disabled. Do not output <memory_request> or populate profile_panel.memoryRequest.";
    return "\nCherished memory requests, independent of the profile status setting:\n- Only when you, as the current Char, sincerely find something rare and precious in this chat that you personally want to remember later, append one <memory_request>valid JSON object</memory_request> after </chat_json> and any required <cot_summary>.\n- A User request to save or remember something is insufficient by itself. Do not request a memory every turn. When uncertain, omit the tag entirely.\n- At most one request per turn; all visible text must be in Simplified Chinese.\n- Shape: {\"title\":\"cherished memory title\",\"content\":\"specific thing I want to remember\",\"detail\":\"additional detail\",\"reason\":\"why I want to remember\",\"createdAt\":\"time or empty\",\"sourceThought\":\"optional or empty\"}.\n- This is not a normal chat bubble or a User instruction. Never invent a thought just to fill sourceThought; leave it empty when status generation is disabled. Keep profile_panel.memoryRequest null.";
  };
})(typeof window !== "undefined" ? window : globalThis);
