(window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(() => {
  const {
      openView: openView_2,
      closeView: closeView_2,
      showToast: showToast_2
    } = window,
    addCharBtn = document.getElementById("add-char-btn"),
    friendActionsSheet = document.getElementById("friend-actions-sheet"),
    openAddFriendSheetBtn = document.getElementById("open-add-friend-sheet-btn"),
    newFriendsBtn = document.getElementById("new-friends-btn"),
    nextSnapshot_6 = document.getElementById("new-friends-modal"),
    newFriendsModalCloseElement = document.getElementById("new-friends-modal-close"),
    friendsContent = document.getElementById("new-friends-list"),
    nextSnapshot_5 = document.getElementById("contact-card-action-modal"),
    contactCardActionCloseElement = document.getElementById("contact-card-action-close"),
    contactCardActionProfileElement = document.getElementById("contact-card-action-profile"),
    contactCardActionStatusElement = document.getElementById("contact-card-action-status"),
    contactCardAddFriendElement = document.getElementById("contact-card-add-friend"),
    contactCardRequestFriendElement = document.getElementById("contact-card-request-friend");
  let value_5 = null;
  function updateFriendRequestIndicators_2() {
    const some_34 = (window.imData.friendRequests || []).some(value_35 => !Number(value_35?.seenAt));
    addCharBtn?.classList.toggle("has-friend-request", some_34);
    newFriendsBtn?.classList.toggle("has-friend-request", some_34);
    addCharBtn?.setAttribute("aria-label", some_34 ? "有新的好友申请" : "添加朋友");
  }
  async function handleAction_7() {
    const items = Array.isArray(window.imData.friendRequests) ? window.imData.friendRequests : [];
    if (!items.some(value_38 => !Number(value_38?.seenAt))) return updateFriendRequestIndicators_2(), true;
    const now_36 = Date.now(),
      value_37 = await window.imApp.saveFriendRequests?.(items.map(value_39 => ({
        ...value_39,
        seenAt: Number(value_39.seenAt) || now_36
      })));
    return updateFriendRequestIndicators_2(), value_37 !== false;
  }
  function handleAction_8() {
    const friendRealnameInputElement = document.getElementById("friend-realname-input"),
      friendProfileImportInput_2 = document.getElementById("friend-nickname-input"),
      friendSignatureInputElement = document.getElementById("friend-signature-input"),
      friendRelationshipInputElement = document.getElementById("friend-relationship-input"),
      friendProfileImportInput_3 = document.getElementById("friend-persona-input");
    if (friendRealnameInputElement) friendRealnameInputElement.value = "";
    if (friendProfileImportInput_2) friendProfileImportInput_2.value = "";
    if (friendSignatureInputElement) friendSignatureInputElement.value = "";
    if (friendRelationshipInputElement) friendRelationshipInputElement.value = "";
    if (friendProfileImportInput_3) friendProfileImportInput_3.value = "";
    setFriendAvatar(null);
  }
  async function handleAction_9(friendOrId, mutator, value_41 = {}) {
    if (!window.imApp.commitFriendsChange) return false;
    const targetId_2 = typeof friendOrId === "object" && friendOrId !== null ? friendOrId.id : friendOrId,
      commitOptions = {
        metaOnly: value_41.metaOnly !== false,
        ...value_41
      };
    return window.imApp.commitFriendsChange(() => {
      const targetFriend = window.imData.friends.find(item => String(item.id) === String(targetId_2));
      if (!targetFriend) return;
      return mutator(targetFriend);
    }, commitOptions);
  }
  async function handleAction_10(value_43, value_44 = {}) {
    if (!currentViewingGroup || !window.imApp.commitFriendsChange) return false;
    const options_45 = {
      metaOnly: value_44.metaOnly !== false,
      ...value_44
    };
    return window.imApp.commitFriendsChange(() => {
      const currentActiveFriend_2 = window.imData.friends.find(item_2 => String(item_2.id) === String(currentViewingGroup.id));
      if (!currentActiveFriend_2) return;
      return currentViewingGroup = currentActiveFriend_2, window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(currentActiveFriend_2.id) && (window.imData.currentActiveFriend = currentActiveFriend_2), value_43(currentActiveFriend_2);
    }, options_45);
  }
  function handleAction_11() {
    handleAction_8();
    const addFriendSheet = document.getElementById("add-friend-sheet");
    if (addFriendSheet) {
      if (typeof window.openView === "function") window.openView(addFriendSheet);else {
        addFriendSheet.style.display = "flex";
        const bottomSheet = addFriendSheet.querySelector(".bottom-sheet");
        bottomSheet && setTimeout(() => bottomSheet.style.transform = "translateY(0)", 10);
      }
    }
  }
  addCharBtn && addCharBtn.addEventListener("click", () => {
    friendActionsSheet ? typeof window.openView === "function" ? window.openView(friendActionsSheet) : friendActionsSheet.style.display = "flex" : handleAction_11();
  });
  openAddFriendSheetBtn && openAddFriendSheetBtn.addEventListener("click", () => {
    if (friendActionsSheet && typeof window.closeView === "function") window.closeView(friendActionsSheet);else friendActionsSheet && (friendActionsSheet.style.display = "none");
    handleAction_11();
  });
  function isSameFriendsListSnapshot_3(element) {
    if (!element) return;
    if (typeof window.openView === "function") window.openView(element);else {
      element.style.display = "flex";
      element.classList.add("active");
    }
  }
  function isSameFriendsListSnapshot_4(element_47) {
    if (!element_47) return;
    if (typeof window.closeView === "function") window.closeView(element_47);else {
      element_47.classList.remove("active");
      element_47.style.display = "none";
    }
  }
  function isSameFriendsListSnapshot_2(value_48) {
    if (!value_48 || value_48.type !== "contact_card") return null;
    return window.imApp.normalizeGeneratedContactProfile?.({
      nickname: value_48.contactName,
      realName: value_48.contactRealName,
      signature: value_48.contactSignature,
      persona: value_48.contactPersona,
      referrerRelation: value_48.contactReferrerRelation,
      avatarUrl: value_48.contactAvatarUrl,
      avatarAssetId: value_48.contactAvatarAssetId
    }) || null;
  }
  function handleAction_15(value_49) {
    return {
      added: "已添加",
      request_pending: "申请中",
      request_accepted: "已接受",
      request_rejected: "已拒绝"
    }[String(value_49 || "")] || "";
  }
  function handleAction_16(targetId_3, value_51) {
    const result_52 = (window.imData.friends || []).find(item_3 => String(item_3.id) === String(targetId_3));
    if (!result_52 || !Array.isArray(result_52.messages)) return null;
    return result_52.messages.find(value_54 => String(value_54?.id || "") === String(value_51)) || null;
  }
  async function handleAction_17(targetId_4, value_56) {
    const result_57 = (window.imData.friends || []).find(item_4 => String(item_4.id) === String(targetId_4));
    if (!result_57) return null;
    if (window.imApp.ensureFriendMessagesLoaded) await window.imApp.ensureFriendMessagesLoaded(result_57);
    return handleAction_16(targetId_4, value_56);
  }
  function handleAction_18(targetId_5) {
    const result_60 = (window.imData.friends || []).find(item_5 => String(item_5.id) === String(targetId_5));
    if (!result_60 || String(window.imData.currentActiveFriend?.id || "") !== String(result_60.id)) return;
    const elementById = document.getElementById("chat-interface-" + result_60.id),
      insChatMessagesElement = elementById?.querySelector(".ins-chat-messages");
    insChatMessagesElement && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(result_60, insChatMessagesElement, {
      scroll: false
    });
  }
  async function handleAction_19(value_62, id_2, contactActionStatus_2, contactRequestId_2 = "") {
    if (!value_62 || !id_2 || !window.imApp.updateFriendMessage) return false;
    const value_66 = await window.imApp.updateFriendMessage(value_62, {
      id: id_2
    }, value_67 => {
      value_67.contactActionStatus = contactActionStatus_2;
      value_67.contactRequestId = contactRequestId_2;
    }, {
      silent: true
    });
    if (value_66) handleAction_18(value_62);
    return value_66;
  }
  function handleAction_20(value_68) {
    const value_69 = window.getUserState?.() || window.userState || {},
      value_70 = String(value_69.name || value_69.realName || value_69.nickname || "User").trim() || "User",
      value_71 = String(value_68?.nickname || value_68?.realName || "新朋友").trim() || "新朋友",
      value_72 = value_70 + "通过了" + value_71 + "的好友申请",
      timestamp_2 = Date.now();
    return {
      id: window.imChat?.createMessageId?.("friend-request-notice") || "friend-request-notice-" + timestamp_2,
      role: "system",
      type: "system_notice",
      noticeKind: "narration",
      narrationSource: "friend_request",
      content: value_72,
      text: value_72,
      timestamp: timestamp_2
    };
  }
  function handleAction_21(id_3, contact, value_75 = {}) {
    return window.imApp.normalizeFriendData({
      id: id_3,
      type: "char",
      nickname: contact.nickname,
      realName: contact.realName,
      signature: contact.signature,
      persona: contact.persona,
      relationship: "",
      avatarUrl: contact.avatarUrl || null,
      avatarAssetId: contact.avatarAssetId || null,
      messages: Array.isArray(value_75.initialMessages) ? value_75.initialMessages : [],
      chatBg: null,
      customCssEnabled: false,
      customCss: "",
      isPinned: false,
      memory: window.imApp.createDefaultMemory()
    });
  }
  async function handleAction_22(value_76) {
    const npcId_2 = String(value_76?.contactId || "").trim(),
      generatedContactProfile = window.imApp.normalizeGeneratedContactProfile?.(value_76?.profile, {
        strict: true
      });
    if (!npcId_2 || !generatedContactProfile || !window.imApp.commitFriendsChange) return false;
    if ((window.imData.friends || []).some(value_81 => String(value_81.id) === npcId_2)) return true;
    const npcId_3 = String(value_76?.sourceFriendId || "").trim(),
      handleAction_21_79 = handleAction_21(npcId_2, generatedContactProfile, {
        initialMessages: value_76?.initialMessages
      }),
      value_80 = await window.imApp.commitFriendsChange(() => {
        if ((window.imData.friends || []).some(value_85 => String(value_85.id) === npcId_2)) return;
        window.imData.friends.push(handleAction_21_79);
        const result_82 = (window.imData.friends || []).find(value_86 => String(value_86.id) === npcId_3 && value_86.type === "char");
        if (!result_82) return;
        if (!result_82.memory || typeof result_82.memory !== "object") result_82.memory = window.imApp.createDefaultMemory();
        if (!Array.isArray(result_82.memory.relationships)) result_82.memory.relationships = [];
        if (!handleAction_21_79.memory || typeof handleAction_21_79.memory !== "object") handleAction_21_79.memory = window.imApp.createDefaultMemory();
        if (!Array.isArray(handleAction_21_79.memory.relationships)) handleAction_21_79.memory.relationships = [];
        const some_83 = result_82.memory.relationships.some(value_87 => String(value_87?.targetId ?? value_87?.npcId ?? "") === npcId_2);
        !some_83 && result_82.memory.relationships.push({
          npcId: npcId_2,
          targetType: "char",
          relation: generatedContactProfile.referrerRelation
        });
        const some_84 = handleAction_21_79.memory.relationships.some(value_88 => String(value_88?.targetId ?? value_88?.npcId ?? "") === npcId_3);
        !some_84 && handleAction_21_79.memory.relationships.push({
          npcId: npcId_3,
          targetType: "char",
          relation: generatedContactProfile.referrerRelation
        });
      }, {
        friendIds: npcId_3 ? [npcId_2, npcId_3] : [npcId_2],
        silent: true
      });
    if (value_80) renderFriendsList_2({
      force: true
    });
    return value_80;
  }
  async function addContactFromCard_2(value_89, nextSnapshot_2) {
    if (!nextSnapshot_2 || nextSnapshot_2.role !== "assistant" || nextSnapshot_2.contactSource !== "generated") return false;
    if (String(nextSnapshot_2.contactActionStatus || "idle") !== "idle") return false;
    const profile_2 = isSameFriendsListSnapshot_2(nextSnapshot_2);
    if (!profile_2) return false;
    const some_92 = (window.imData.friends || []).some(item_94 => String(item_94.id) === String(nextSnapshot_2.contactId)),
      value_93 = await handleAction_19(value_89, nextSnapshot_2.id, "added");
    if (!value_93) return false;
    if (!some_92) {
      const value_95 = await handleAction_22({
        contactId: nextSnapshot_2.contactId,
        profile: profile_2,
        sourceFriendId: nextSnapshot_2.contactReferrerId || value_89
      });
      if (!value_95) return await handleAction_19(value_89, nextSnapshot_2.id, "idle"), false;
    }
    return true;
  }
  async function createFriendRequestFromContactCard_2(value_96, nextSnapshot_3) {
    if (!nextSnapshot_3 || nextSnapshot_3.role !== "assistant" || nextSnapshot_3.contactSource !== "generated") return false;
    if (String(nextSnapshot_3.contactActionStatus || "idle") !== "idle") return false;
    const profile_3 = isSameFriendsListSnapshot_2(nextSnapshot_3);
    if (!profile_3) return false;
    if ((window.imData.friends || []).some(item_105 => String(item_105.id) === String(nextSnapshot_3.contactId))) return await handleAction_19(value_96, nextSnapshot_3.id, "added"), true;
    const result_99 = (window.imData.friendRequests || []).find(item_106 => String(item_106.contactId) === String(nextSnapshot_3.contactId));
    if (result_99) return await handleAction_19(value_96, nextSnapshot_3.id, "request_pending", result_99.id), true;
    const id_4 = window.imChat?.createMessageId?.("friend-request") || "friend-request-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9),
      options_101 = {
        id: id_4,
        contactId: String(nextSnapshot_3.contactId),
        sourceFriendId: String(nextSnapshot_3.contactReferrerId || value_96 || ""),
        sourceMessageId: String(nextSnapshot_3.id || ""),
        createdAt: Date.now(),
        seenAt: 0,
        status: "pending",
        profile: profile_3
      },
      value_102 = Array.isArray(window.imData.friendRequests) ? window.imData.friendRequests.slice() : [],
      value_103 = await window.imApp.saveFriendRequests?.([...value_102, options_101]);
    if (!value_103) return false;
    const value_104 = await handleAction_19(value_96, nextSnapshot_3.id, "request_pending", id_4);
    if (!value_104) return await window.imApp.saveFriendRequests?.(value_102), false;
    return handleAction_27(), true;
  }
  async function handleAction_25(targetId_6, value_108) {
    const currentViewingGroup_109 = (window.imData.friendRequests || []).find(item_6 => String(item_6.id) === String(targetId_6));
    if (!currentViewingGroup_109 || !["accept", "reject"].includes(value_108)) return false;
    const slice_110 = (window.imData.friendRequests || []).slice(),
      filter_111 = slice_110.filter(value_118 => String(value_118.id) !== String(currentViewingGroup_109.id)),
      value_112 = await handleAction_17(currentViewingGroup_109.sourceFriendId, currentViewingGroup_109.sourceMessageId);
    if (value_108 === "reject") {
      if (value_112) {
        const value_120 = await handleAction_19(currentViewingGroup_109.sourceFriendId, currentViewingGroup_109.sourceMessageId, "request_rejected", currentViewingGroup_109.id);
        if (!value_120) return false;
      }
      const value_119 = await window.imApp.saveFriendRequests?.(filter_111);
      if (!value_119) {
        if (value_112) await handleAction_19(currentViewingGroup_109.sourceFriendId, currentViewingGroup_109.sourceMessageId, "request_pending", currentViewingGroup_109.id);
        return false;
      }
      return handleAction_27(), true;
    }
    if (value_112) {
      const value_121 = (window.imData.friends || []).some(item_123 => String(item_123.id) === String(currentViewingGroup_109.contactId)) ? "added" : "request_accepted",
        value_122 = await handleAction_19(currentViewingGroup_109.sourceFriendId, currentViewingGroup_109.sourceMessageId, value_121, currentViewingGroup_109.id);
      if (!value_122) return false;
    }
    const value_113 = await window.imApp.saveFriendRequests?.(filter_111);
    if (!value_113) {
      if (value_112) await handleAction_19(currentViewingGroup_109.sourceFriendId, currentViewingGroup_109.sourceMessageId, "request_pending", currentViewingGroup_109.id);
      return false;
    }
    const some_114 = (window.imData.friends || []).some(item_124 => String(item_124.id) === String(currentViewingGroup_109.contactId)),
      handleAction_20_115 = handleAction_20(currentViewingGroup_109.profile),
      value_116 = some_114 || (await handleAction_22({
        ...currentViewingGroup_109,
        initialMessages: [handleAction_20_115]
      }));
    if (!value_116) {
      await window.imApp.saveFriendRequests?.(slice_110);
      if (value_112) await handleAction_19(currentViewingGroup_109.sourceFriendId, currentViewingGroup_109.sourceMessageId, "request_pending", currentViewingGroup_109.id);
      return false;
    }
    if (some_114) {
      const value_125 = await window.imApp.appendFriendMessage?.(currentViewingGroup_109.contactId, handleAction_20_115, {
        silent: true
      });
      if (!value_125) {
        await window.imApp.saveFriendRequests?.(slice_110);
        if (value_112) await handleAction_19(currentViewingGroup_109.sourceFriendId, currentViewingGroup_109.sourceMessageId, "request_pending", currentViewingGroup_109.id);
        return false;
      }
    }
    return handleAction_27(), true;
  }
  function handleAction_26(friendAvatarImg, friendAvatarIcon) {
    if (!friendAvatarImg || !friendAvatarIcon) return;
    friendAvatarImg.innerHTML = "";
    const element_128 = document.createElement("div");
    element_128.className = "im-contact-action-avatar";
    if (friendAvatarIcon.avatarUrl) {
      const item_7 = document.createElement("img");
      item_7.src = friendAvatarIcon.avatarUrl;
      item_7.alt = "";
      item_7.addEventListener("error", () => {
        item_7.remove();
        element_128.textContent = friendAvatarIcon.nickname.charAt(0) || "?";
      }, {
        once: true
      });
      element_128.appendChild(item_7);
    } else element_128.textContent = friendAvatarIcon.nickname.charAt(0) || "?";
    const item_8 = document.createElement("div");
    item_8.className = "im-contact-action-copy";
    const element_130 = document.createElement("strong");
    element_130.textContent = friendAvatarIcon.nickname;
    const element_131 = document.createElement("small");
    element_131.textContent = friendAvatarIcon.realName;
    const element_132 = document.createElement("p");
    element_132.textContent = friendAvatarIcon.signature;
    item_8.append(element_130, element_131, element_132);
    const item_9 = document.createElement("div");
    item_9.className = "im-contact-action-persona";
    item_9.textContent = friendAvatarIcon.persona || "暂无简介";
    friendAvatarImg.append(element_128, item_8, item_9);
  }
  function handleAction_27() {
    if (!friendsContent) return;
    const value_135 = new Set((window.imData.friends || []).map(value_137 => String(value_137.id))),
      filter_136 = (window.imData.friendRequests || []).filter(value_138 => !value_135.has(String(value_138.contactId)));
    filter_136.length !== (window.imData.friendRequests || []).length && ((window.imData.friendRequests || []).filter(value_139 => value_135.has(String(value_139.contactId))).forEach(value_140 => handleAction_19(value_140.sourceFriendId, value_140.sourceMessageId, "added", value_140.id)), window.imApp.saveFriendRequests?.(filter_136));
    friendsContent.innerHTML = "";
    if (filter_136.length === 0) {
      const item_10 = document.createElement("div");
      item_10.className = "im-new-friends-empty";
      item_10.textContent = "暂无好友申请";
      friendsContent.appendChild(item_10);
      return;
    }
    filter_136.forEach(value_142 => {
      const item_14 = document.createElement("article");
      item_14.className = "im-friend-request-item";
      const item_11 = document.createElement("div");
      item_11.className = "im-friend-request-avatar";
      item_11.textContent = value_142.profile.nickname.charAt(0) || "?";
      const item_12 = document.createElement("div");
      item_12.className = "im-friend-request-copy";
      const element_146 = document.createElement("strong");
      element_146.textContent = value_142.profile.nickname;
      const element_147 = document.createElement("small");
      element_147.textContent = value_142.profile.realName;
      const element_148 = document.createElement("p");
      element_148.textContent = value_142.profile.signature;
      item_12.append(element_146, element_147, element_148);
      const item_13 = document.createElement("div");
      item_13.className = "im-friend-request-actions";
      const element_150 = document.createElement("button");
      element_150.type = "button";
      element_150.textContent = "拒绝";
      const element_151 = document.createElement("button");
      element_151.type = "button";
      element_151.className = "is-accept";
      element_151.textContent = "接受";
      const value_152 = async value_153 => {
        element_151.disabled = true;
        element_150.disabled = true;
        const value_154 = await handleAction_25(value_142.id, value_153);
        !value_154 ? (element_151.disabled = false, element_150.disabled = false, window.showToast?.("好友申请处理失败，请重试")) : window.showToast?.(value_153 === "accept" ? "已添加 " + value_142.profile.nickname : "已拒绝好友申请");
      };
      element_150.addEventListener("click", () => value_152("reject"));
      element_151.addEventListener("click", () => value_152("accept"));
      item_13.append(element_150, element_151);
      item_14.append(item_11, item_12, item_13);
      friendsContent.appendChild(item_14);
    });
  }
  function openContactCardActionModal_2(value_155, nextSnapshot_4) {
    if (!nextSnapshot_4 || nextSnapshot_4.role !== "assistant" || nextSnapshot_4.type !== "contact_card") return false;
    const handleAction_14_157 = isSameFriendsListSnapshot_2(nextSnapshot_4);
    if (!handleAction_14_157) return false;
    value_5 = {
      sourceFriendId: String(value_155?.id || nextSnapshot_4.contactReferrerId || ""),
      messageId: String(nextSnapshot_4.id || "")
    };
    handleAction_26(contactCardActionProfileElement, handleAction_14_157);
    const some_158 = (window.imData.friends || []).some(item_162 => String(item_162.id) === String(nextSnapshot_4.contactId)),
      value_159 = some_158 ? "added" : String(nextSnapshot_4.contactActionStatus || "idle"),
      textContent_2 = handleAction_15(value_159);
    contactCardActionStatusElement && (contactCardActionStatusElement.hidden = !textContent_2, contactCardActionStatusElement.textContent = textContent_2);
    const value_161 = nextSnapshot_4.contactSource === "generated" && value_159 === "idle";
    return contactCardAddFriendElement && (contactCardAddFriendElement.disabled = !value_161, contactCardAddFriendElement.textContent = some_158 ? "已是好友" : textContent_2 || "加为好友"), contactCardRequestFriendElement && (contactCardRequestFriendElement.disabled = !value_161, contactCardRequestFriendElement.textContent = value_159 === "request_pending" ? "申请中" : "让他加我"), isSameFriendsListSnapshot_3(nextSnapshot_5), true;
  }
  async function handleAction_29(value_163) {
    const value_164 = value_5;
    if (!value_164) return;
    const handleAction_16_165 = handleAction_16(value_164.sourceFriendId, value_164.messageId);
    if (!handleAction_16_165) {
      window.showToast?.("这张名片已不存在");
      isSameFriendsListSnapshot_4(nextSnapshot_5);
      return;
    }
    if (contactCardAddFriendElement) contactCardAddFriendElement.disabled = true;
    if (contactCardRequestFriendElement) contactCardRequestFriendElement.disabled = true;
    const value_166 = value_163 === "add" ? await addContactFromCard_2(value_164.sourceFriendId, handleAction_16_165) : await createFriendRequestFromContactCard_2(value_164.sourceFriendId, handleAction_16_165);
    if (!value_166) {
      window.showToast?.(value_163 === "add" ? "添加好友失败，请重试" : "好友申请保存失败，请重试");
      openContactCardActionModal_2((window.imData.friends || []).find(value_168 => String(value_168.id) === value_164.sourceFriendId), handleAction_16(value_164.sourceFriendId, value_164.messageId) || handleAction_16_165);
      return;
    }
    window.showToast?.(value_163 === "add" ? "已添加 " + handleAction_16_165.contactName : "你收到了一则好友申请");
    const value_167 = handleAction_16(value_164.sourceFriendId, value_164.messageId) || handleAction_16_165;
    openContactCardActionModal_2((window.imData.friends || []).find(value_169 => String(value_169.id) === value_164.sourceFriendId), value_167);
  }
  newFriendsBtn && newFriendsBtn.addEventListener("click", async () => {
    isSameFriendsListSnapshot_4(friendActionsSheet);
    handleAction_27();
    isSameFriendsListSnapshot_3(nextSnapshot_6);
    await handleAction_7();
  });
  newFriendsModalCloseElement?.addEventListener("click", () => isSameFriendsListSnapshot_4(nextSnapshot_6));
  nextSnapshot_6?.addEventListener("click", event => {
    if (event.target === nextSnapshot_6) isSameFriendsListSnapshot_4(nextSnapshot_6);
  });
  contactCardActionCloseElement?.addEventListener("click", () => isSameFriendsListSnapshot_4(nextSnapshot_5));
  nextSnapshot_5?.addEventListener("click", event_170 => {
    if (event_170.target === nextSnapshot_5) isSameFriendsListSnapshot_4(nextSnapshot_5);
  });
  contactCardAddFriendElement?.addEventListener("click", () => handleAction_29("add"));
  contactCardRequestFriendElement?.addEventListener("click", () => handleAction_29("request"));
  window.addEventListener("u2:friend-requests-changed", () => {
    handleAction_27();
    updateFriendRequestIndicators_2();
  });
  window.imApp.openContactCardActionModal = openContactCardActionModal_2;
  window.imApp.getFriendRequests = () => window.imApp.normalizeFriendRequests(window.imData.friendRequests);
  window.imApp.addContactFromCard = addContactFromCard_2;
  window.imApp.createFriendRequestFromContactCard = createFriendRequestFromContactCard_2;
  window.imApp.acceptFriendRequest = value_171 => handleAction_25(value_171, "accept");
  window.imApp.rejectFriendRequest = value_172 => handleAction_25(value_172, "reject");
  window.imApp.updateFriendRequestIndicators = updateFriendRequestIndicators_2;
  friendActionsSheet && friendActionsSheet.addEventListener("click", e => {
    if (e.target === friendActionsSheet) {
      if (typeof window.closeView === "function") window.closeView(friendActionsSheet);else friendActionsSheet.style.display = "none";
    }
  });
  const friendAvatarWrapper = document.getElementById("friend-avatar-wrapper");
  friendAvatarWrapper && friendAvatarWrapper.addEventListener("click", e_2 => {
    if (e_2.target.tagName !== "INPUT") document.getElementById("friend-avatar-upload").click();
  });
  const friendAvatarUpload = document.getElementById("friend-avatar-upload");
  friendAvatarUpload && friendAvatarUpload.addEventListener("change", async e_3 => {
    const file = e_3.target.files[0];
    if (!file) return;
    try {
      const nextAvatar = window.imApp.compressImageFile ? await window.imApp.compressImageFile(file, {
        maxWidth: 256,
        maxHeight: 256,
        mimeType: "image/jpeg",
        quality: 0.8
      }) : await window.imApp.readFileAsDataUrl(file);
      setFriendAvatar(nextAvatar);
    } catch (error_2) {
      console.error("Failed to process friend avatar", error_2);
      if (showToast_2) showToast_2("头像处理失败");
    }
  });
  const friendProfileImportBtn = document.getElementById("friend-profile-import-btn"),
    friendProfileImportInput = document.getElementById("friend-profile-import-input");
  async function readFriendProfileFile(file_2) {
    const lowerName = String(file_2?.name || "").toLowerCase();
    if (lowerName.endsWith(".doc")) throw new Error("暂不支持旧版 DOC，请另存为 DOCX 或 TXT 后导入");
    if (lowerName.endsWith(".docx")) {
      await window.u2LoadVendorLibrary?.("mammoth");
      if (!window.mammoth?.extractRawText) throw new Error("DOCX 解析组件未加载，请检查网络后重试");
      const result_2 = await window.mammoth.extractRawText({
        arrayBuffer: await file_2.arrayBuffer()
      });
      return String(result_2?.value || "").replace(/\u0000/g, "").trim();
    }
    if (!lowerName.endsWith(".txt") && !lowerName.endsWith(".text")) throw new Error("仅支持 TXT 和 DOCX 文件");
    return String(await file_2.text()).replace(/\u0000/g, "").trim();
  }
  friendProfileImportBtn && friendProfileImportInput && (friendProfileImportBtn.addEventListener("click", () => friendProfileImportInput.click()), friendProfileImportInput.addEventListener("change", async () => {
    const file_3 = friendProfileImportInput.files?.[0];
    friendProfileImportInput.value = "";
    if (!file_3) return;
    try {
      const value_4 = await readFriendProfileFile(file_3);
      if (!value_4) throw new Error("文件内容为空");
      const personaInput = document.getElementById("friend-persona-input"),
        nicknameInput = document.getElementById("friend-nickname-input"),
        value_6 = String(file_3.name || "").replace(/\.(?:txt|text|docx)$/i, "").trim();
      if (personaInput) personaInput.value = value_4;
      if (nicknameInput && value_6) nicknameInput.value = value_6;
      if (showToast_2) showToast_2("角色设定已导入，请确认后添加");
    } catch (error_3) {
      console.error("Failed to import friend profile", error_3);
      if (showToast_2) showToast_2(error_3?.message || "角色设定导入失败");
    }
  }));
  function setFriendAvatar(src_2) {
    const friendAvatarImg_2 = document.getElementById("friend-avatar-img"),
      friendAvatarPreview = document.getElementById("friend-avatar-preview"),
      friendAvatarIcon_2 = friendAvatarPreview ? friendAvatarPreview.querySelector("i") : null;
    if (!friendAvatarImg_2 || !friendAvatarIcon_2) return;
    src_2 ? (friendAvatarImg_2.src = src_2, friendAvatarImg_2.style.display = "block", friendAvatarIcon_2.style.display = "none") : (friendAvatarImg_2.style.display = "none", friendAvatarIcon_2.style.display = "block", friendAvatarImg_2.src = "");
  }
  const confirmAddFriendBtn = document.getElementById("confirm-add-friend-btn"),
    confirmAddNpcBtn = document.getElementById("confirm-add-npc-btn");
  let isAddingFriend = false,
    isAddingNpc = false;
  function setAddButtonBusy(button, busy) {
    if (!button) return;
    button.style.pointerEvents = busy ? "none" : "";
    button.style.opacity = busy ? "0.65" : "";
  }
  confirmAddFriendBtn && confirmAddFriendBtn.addEventListener("click", async () => {
    if (isAddingFriend) return;
    isAddingFriend = true;
    setAddButtonBusy(confirmAddFriendBtn, true);
    const friend_2 = window.imApp.normalizeFriendData({
        id: Date.now(),
        type: "char",
        realName: document.getElementById("friend-realname-input") ? document.getElementById("friend-realname-input").value : "",
        nickname: document.getElementById("friend-nickname-input") ? document.getElementById("friend-nickname-input").value || "New Friend" : "New Friend",
        signature: document.getElementById("friend-signature-input") ? document.getElementById("friend-signature-input").value || "No Signature" : "No Signature",
        persona: document.getElementById("friend-persona-input") ? document.getElementById("friend-persona-input").value : "",
        relationship: document.getElementById("friend-relationship-input") ? document.getElementById("friend-relationship-input").value : "",
        avatarUrl: document.getElementById("friend-avatar-img") && document.getElementById("friend-avatar-img").style.display === "block" ? document.getElementById("friend-avatar-img").src : null,
        messages: [],
        chatBg: null,
        customCssEnabled: false,
        customCss: "",
        isPinned: false,
        memory: window.imApp.createDefaultMemory()
      }),
      saved = window.imApp.commitFriendsChange ? await window.imApp.commitFriendsChange(() => {
        window.imData.friends.push(friend_2);
      }, {
        friendId: friend_2.id,
        silent: true
      }) : false;
    if (!saved) {
      isAddingFriend = false;
      setAddButtonBusy(confirmAddFriendBtn, false);
      if (window.showToast) window.showToast("添加 Char 保存失败");
      return;
    }
    renderFriendsList_2();
    isAddingFriend = false;
    setAddButtonBusy(confirmAddFriendBtn, false);
    closeView_2(document.getElementById("add-friend-sheet"));
    if (window.showToast) window.showToast("已添加 Char: " + friend_2.nickname);
  });
  confirmAddNpcBtn && confirmAddNpcBtn.addEventListener("click", async () => {
    if (isAddingNpc) return;
    isAddingNpc = true;
    setAddButtonBusy(confirmAddNpcBtn, true);
    const npc = window.imApp.normalizeFriendData({
        id: Date.now(),
        type: "npc",
        realName: document.getElementById("friend-realname-input") ? document.getElementById("friend-realname-input").value : "",
        nickname: document.getElementById("friend-nickname-input") ? document.getElementById("friend-nickname-input").value || "New NPC" : "New NPC",
        signature: document.getElementById("friend-signature-input") ? document.getElementById("friend-signature-input").value || "No Signature" : "No Signature",
        persona: document.getElementById("friend-persona-input") ? document.getElementById("friend-persona-input").value : "",
        relationship: document.getElementById("friend-relationship-input") ? document.getElementById("friend-relationship-input").value : "",
        avatarUrl: document.getElementById("friend-avatar-img") && document.getElementById("friend-avatar-img").style.display === "block" ? document.getElementById("friend-avatar-img").src : null,
        messages: [],
        chatBg: null,
        customCssEnabled: false,
        customCss: "",
        isPinned: false,
        memory: window.imApp.createDefaultMemory()
      }),
      saved_2 = window.imApp.commitFriendsChange ? await window.imApp.commitFriendsChange(() => {
        window.imData.friends.push(npc);
      }, {
        friendId: npc.id,
        silent: true
      }) : false;
    if (!saved_2) {
      isAddingNpc = false;
      setAddButtonBusy(confirmAddNpcBtn, false);
      if (window.showToast) window.showToast("添加 NPC 保存失败");
      return;
    }
    renderFriendsList_2();
    closeView_2(document.getElementById("add-friend-sheet"));
    if (window.showToast) window.showToast("已添加 NPC: " + npc.nickname);
    isAddingNpc = false;
    setAddButtonBusy(confirmAddNpcBtn, false);
  });
  let lastFriendsListSnapshot = [];
  function getFriendsListRenderSnapshot() {
    return (window.imData.friends || []).filter(value_190 => value_190.type !== "group" && value_190.type !== "official").map(friend_3 => ({
      friend: friend_3,
      id: friend_3.id,
      type: friend_3.type,
      nickname: friend_3.nickname,
      avatarUrl: friend_3.avatarUrl || ""
    }));
  }
  function isSameFriendsListSnapshot(nextSnapshot) {
    return nextSnapshot.length === lastFriendsListSnapshot.length && nextSnapshot.every((row, index) => {
      const previous = lastFriendsListSnapshot[index];
      return previous && previous.friend === row.friend && previous.id === row.id && previous.type === row.type && previous.nickname === row.nickname && previous.avatarUrl === row.avatarUrl;
    });
  }
  function renderFriendsList_2(options_2 = {}) {
    const friendsContent_2 = document.getElementById("friends-content"),
      npcsContent = document.getElementById("npcs-content"),
      nextSnapshot_7 = getFriendsListRenderSnapshot(),
      renderedItemCount = (friendsContent_2?.children.length || 0) + (npcsContent?.children.length || 0),
      isCurrent = renderedItemCount === nextSnapshot_7.length && isSameFriendsListSnapshot(nextSnapshot_7);
    if (!options_2.force && isCurrent) return false;
    if (friendsContent_2) friendsContent_2.innerHTML = "";
    if (npcsContent) npcsContent.innerHTML = "";
    return window.imData.friends.forEach(friend_4 => {
      if (friend_4.type === "group" || friend_4.type === "official") return;
      const item_15 = document.createElement("div");
      item_15.className = "line-list-item";
      const value_198 = friend_4.avatarUrl ? "<img src=\"" + friend_4.avatarUrl + "\" style=\"width:100%;height:100%;object-fit:cover;\">" : friend_4.type === "npc" ? "<i class=\"fas fa-robot\"></i>" : "<i class=\"fas fa-user\"></i>";
      item_15.innerHTML = "\n                <div class=\"line-item-avatar\">" + value_198 + "</div>\n                <div class=\"line-item-text\">" + friend_4.nickname + "</div>\n            ";
      item_15.addEventListener("click", () => {
        if (window.imApp.openChatTab) window.imApp.openChatTab(friend_4);
      });
      if (friend_4.type === "npc") {
        if (npcsContent) npcsContent.appendChild(item_15);
      } else {
        if (friendsContent_2) friendsContent_2.appendChild(item_15);
      }
    }), lastFriendsListSnapshot = nextSnapshot_7, true;
  }
  window.imApp.renderFriendsList = renderFriendsList_2;
  renderFriendsList_2();
  updateFriendRequestIndicators_2();
});
