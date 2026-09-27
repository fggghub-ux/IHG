(window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(() => {
  const {
    apiConfig: apiConfig_2,
    userState: userState_3
  } = window;
  window.imChat = window.imChat || {};
  const imChat_3 = window.imChat;
  async function commitPaymentFriendChange(friendOrId, value_30, value_31 = {}) {
    if (!window.imApp.commitFriendChange) return false;
    const targetId = typeof friendOrId === "object" && friendOrId !== null ? friendOrId.id : friendOrId;
    return window.imApp.commitFriendChange(targetId, currentActiveFriend_2 => {
      if (!currentActiveFriend_2) return;
      return window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(currentActiveFriend_2.id) && (window.imData.currentActiveFriend = currentActiveFriend_2), value_30(currentActiveFriend_2);
    }, value_31);
  }
  function getGroupMemberFriends_2(group_2) {
    if (!group_2 || group_2.type !== "group" || !Array.isArray(group_2.members)) return [];
    const resolvedIds = new Set();
    return group_2.members.map(memberRef => {
      const normalizedRef = String(memberRef == null ? "" : memberRef).trim();
      if (!normalizedRef) return null;
      return window.imData.friends.find(item => {
        if (!item || item.type !== "char" && item.type !== "npc") return false;
        return String(item.id) === normalizedRef || String(item.nickname || "").trim() === normalizedRef || String(item.realName || "").trim() === normalizedRef;
      }) || null;
    }).filter(value_36 => {
      if (!value_36) return false;
      const memberId_2 = String(value_36.id);
      if (resolvedIds.has(memberId_2)) return false;
      return resolvedIds.add(memberId_2), true;
    });
  }
  function getCanonicalGroupMemberIds_2(group) {
    return getGroupMemberFriends_2(group).map(member => String(member.id));
  }
  function normalizeGroupSpeaker_2(group_3, rawSpeakerName, speakerMemberId_2 = null) {
    if (!group_3 || group_3.type !== "group") return null;
    const groupMembers = window.imChat.getGroupMemberFriends(group_3);
    if (groupMembers.length === 0) return null;
    if (speakerMemberId_2 != null && String(speakerMemberId_2).trim()) {
      const idMatch = groupMembers.find(member_2 => String(member_2.id) === String(speakerMemberId_2));
      if (idMatch) return idMatch;
    }
    const safeName = String(rawSpeakerName || "").trim();
    if (!safeName) return null;
    const exactMatch = groupMembers.find(member_3 => member_3.nickname === safeName || member_3.realName === safeName);
    if (exactMatch) return exactMatch;
    const normalizedTarget = safeName.toLowerCase(),
      fuzzyMatch = groupMembers.find(member_4 => [member_4.nickname, member_4.realName].some(value_2 => String(value_2 || "").trim().toLowerCase() === normalizedTarget));
    return fuzzyMatch || null;
  }
  function getGroupMessageSpeaker_2(group_4, message = {}) {
    if (!message || typeof message !== "object") return null;
    const directMatch = window.imChat.normalizeGroupSpeaker(group_4, message.speaker || message.senderName || "", message.speakerMemberId || message.senderMemberId || null);
    if (directMatch) return directMatch;
    const storedAvatar = String(message.senderAvatarUrl || "").trim();
    if (!storedAvatar) return null;
    const avatarMatches = window.imChat.getGroupMemberFriends(group_4).filter(member_5 => String(member_5?.avatarUrl || "").trim() === storedAvatar);
    return avatarMatches.length === 1 ? avatarMatches[0] : null;
  }
  function getSafeGroupSpeaker_2(group_5, preferredSpeakerName = null, speakerMemberId_3 = null) {
    const normalized = window.imChat.normalizeGroupSpeaker(group_5, preferredSpeakerName, speakerMemberId_3);
    if (normalized) return normalized;
    const members_2 = window.imChat.getGroupMemberFriends(group_5);
    return members_2.length > 0 ? members_2[0] : null;
  }
  function getDisplayNameByMemberId_2(group_6, memberId_3) {
    if (!group_6 || !memberId_3) return "群成员";
    const member_6 = window.imChat.getGroupMemberFriends(group_6).find(item_2 => String(item_2.id) === String(memberId_3));
    return member_6 ? member_6.nickname || member_6.realName || "群成员" : "群成员";
  }
  function getPayUserName() {
    const currentUserState = window.userState || userState_3 || {};
    return currentUserState.name || currentUserState.realName || currentUserState.nickname || "User";
  }
  function getPayFriendName(friend, fallback = "") {
    return fallback || friend?.nickname || friend?.realName || friend?.name || "Char";
  }
  function getPayUserAvatar() {
    const currentUserState_2 = window.userState || userState_3 || {};
    return currentUserState_2.avatarUrl || currentUserState_2.avatar || "";
  }
  function getPayFriendAvatar(friend_2) {
    return friend_2?.avatarUrl || friend_2?.avatar || "";
  }
  function normalizePayTransferMessage_2(msg_2 = {}, friend_3 = null) {
    const payKind_2 = msg_2.payKind || (msg_2.role === "user" ? "user_to_char" : "char_received"),
      userName = getPayUserName(),
      charName_2 = getPayFriendName(friend_3, msg_2.speaker || msg_2.charName || ""),
      targetName_2 = msg_2.targetName || "",
      charToUserKinds = ["char_to_user_pending", "char_to_user_claimed", "user_received_from_char", "user_rejected_from_char"],
      claimedKinds = ["char_received", "char_to_user_claimed", "user_received_from_char"],
      rejectedKinds = ["user_to_char_rejected", "char_to_user_rejected", "user_rejected_from_char"],
      explicitDirection = msg_2.payDirection === "char_to_user" || msg_2.payDirection === "user_to_char" ? msg_2.payDirection : "",
      direction_2 = explicitDirection || (charToUserKinds.includes(payKind_2) ? "char_to_user" : "user_to_char");
    let status_2 = rejectedKinds.includes(payKind_2) ? "rejected" : claimedKinds.includes(payKind_2) ? "claimed" : "pending";
    if (status_2 === "pending" && msg_2.claimed) status_2 = "claimed";
    let payerName_2 = msg_2.payerName || "",
      payeeName_2 = msg_2.payeeName || "";
    direction_2 === "char_to_user" ? (payerName_2 = payerName_2 || msg_2.senderName || targetName_2 || charName_2, payeeName_2 = payeeName_2 || msg_2.receiverName || userName) : (payerName_2 = payerName_2 || msg_2.senderName || userName, payeeName_2 = payeeName_2 || msg_2.receiverName || (targetName_2 && targetName_2 !== userName ? targetName_2 : charName_2));
    const payerType_2 = direction_2 === "user_to_char" ? "user" : "char",
      payeeType_2 = direction_2 === "user_to_char" ? "char" : "user";
    return {
      payKind: payKind_2,
      direction: direction_2,
      status: status_2,
      payerName: payerName_2,
      payeeName: payeeName_2,
      payerType: payerType_2,
      payeeType: payeeType_2,
      payerAvatar: payerType_2 === "user" ? getPayUserAvatar() : getPayFriendAvatar(friend_3),
      payeeAvatar: payeeType_2 === "user" ? getPayUserAvatar() : getPayFriendAvatar(friend_3),
      canCurrentUserClaim: direction_2 === "char_to_user" && status_2 === "pending" && !msg_2.claimed,
      senderName: payerName_2,
      receiverName: payeeName_2,
      senderType: payerType_2,
      receiverType: payeeType_2,
      isUserSender: payerType_2 === "user"
    };
  }
  function resolvePayTransferParties_2(msg = {}, friend_4 = null) {
    return normalizePayTransferMessage_2(msg, friend_4);
  }
  window.imChat.normalizePayTransferMessage = normalizePayTransferMessage_2;
  window.imChat.resolvePayTransferParties = resolvePayTransferParties_2;
  function getAvailableGroupRecipients_2(group_7) {
    return window.imChat.getGroupMemberFriends(group_7).filter(member_7 => member_7 && member_7.type !== "group");
  }
  function getCurrentUserPacketMember_2(group_8) {
    if (window.imApp?.getGroupUserIdentity) {
      const identity = window.imApp.getGroupUserIdentity(group_8);
      return {
        id: "__user__",
        accountId: identity.accountId || null,
        nickname: identity.name,
        realName: identity.name,
        avatarUrl: identity.avatarUrl,
        persona: identity.persona,
        signature: identity.signature,
        type: "user"
      };
    }
    const currentAccountId = typeof window.getCurrentAccountId === "function" ? window.getCurrentAccountId() : null,
      accounts = typeof window.getAccounts === "function" ? window.getAccounts() : [],
      currentAccount = accounts.find(acc => String(acc.id) === String(currentAccountId)) || null,
      override = group_8 && group_8.memory ? group_8.memory.userOverride || null : null,
      fallbackName = userState_3 && (userState_3.name || userState_3.realName) || currentAccount?.name || "你",
      fallbackAvatarUrl = userState_3 && (userState_3.avatarUrl || userState_3.avatar) || currentAccount?.avatarUrl || currentAccount?.avatar || "";
    return {
      id: "__user__",
      accountId: override?.id || currentAccount?.id || null,
      nickname: override?.name || fallbackName,
      realName: override?.name || fallbackName,
      avatarUrl: override?.avatarUrl || override?.avatar || fallbackAvatarUrl,
      persona: override?.persona || currentAccount?.persona || (userState_3 ? userState_3.persona : "") || "",
      signature: override?.signature || currentAccount?.signature || "",
      type: "user"
    };
  }
  function getAllRedPacketParticipants_2(group_9) {
    const members_3 = window.imChat.getAvailableGroupRecipients(group_9).slice();
    return members_3.push(window.imChat.getCurrentUserPacketMember(group_9)), members_3;
  }
  function getPacketSenderDisplayMeta_2(packetMsg_2, group_10, fallbackFriend = null) {
    if (!packetMsg_2) return {
      id: "",
      name: fallbackFriend?.nickname || fallbackFriend?.realName || "发红包的人",
      avatarUrl: fallbackFriend?.avatarUrl || ""
    };
    const senderMemberId_2 = packetMsg_2.senderMemberId;
    if (String(senderMemberId_2) === "__user__") {
      const userMember = window.imChat.getCurrentUserPacketMember(group_10);
      return {
        id: userMember.id,
        name: packetMsg_2.senderName || userMember.nickname,
        avatarUrl: packetMsg_2.senderAvatarUrl || userMember.avatarUrl || ""
      };
    }
    const member_8 = window.imChat.getAllRedPacketParticipants(group_10).find(item_3 => String(item_3.id) === String(senderMemberId_2));
    return {
      id: senderMemberId_2 || "",
      name: packetMsg_2.senderName || member_8?.nickname || member_8?.realName || fallbackFriend?.nickname || fallbackFriend?.realName || "发红包的人",
      avatarUrl: packetMsg_2.senderAvatarUrl || member_8?.avatarUrl || fallbackFriend?.avatarUrl || ""
    };
  }
  function getCurrentUserClaimRecord_2(packetMsg) {
    if (!packetMsg || !Array.isArray(packetMsg.claimRecords)) return null;
    return packetMsg.claimRecords.find(item_4 => String(item_4.memberId) === "__user__") || null;
  }
  function createRedPacketClaimNoticeText_2(value_89, claimRecord_2, senderMeta) {
    if (!claimRecord_2) return "有人领取了红包";
    const claimerName = claimRecord_2.memberName || "有人",
      senderName_2 = senderMeta?.name || "对方";
    if (String(claimRecord_2.memberId) === "__user__") return "你领取了" + senderName_2 + "的红包";
    if (String(claimRecord_2.memberId) === String(senderMeta?.id)) return claimerName + "领取了自己发的红包";
    return claimerName + "领取了" + senderName_2 + "的红包";
  }
  function claimGroupRedPacketForMember_2(group_11, packetMsg_3, memberMeta, options_2 = {}) {
    if (!group_11 || !packetMsg_3 || packetMsg_3.type !== "group_red_packet" || !memberMeta) return null;
    window.imChat.normalizeGroupRedPacketState(packetMsg_3, group_11);
    if (packetMsg_3.isFinished) return null;
    const memberId_4 = String(memberMeta.id),
      value_99 = new Set((packetMsg_3.claimedMemberIds || []).map(String));
    if (value_99.has(memberId_4)) return packetMsg_3.claimRecords.find(item_5 => String(item_5.memberId) === memberId_4) || null;
    const nextIndex = Array.isArray(packetMsg_3.claimRecords) ? packetMsg_3.claimRecords.length : 0,
      amount_2 = Number((packetMsg_3.allocations || [])[nextIndex] || 0);
    if (!amount_2 || amount_2 <= 0) return window.imChat.normalizeGroupRedPacketState(packetMsg_3, group_11), null;
    const claimRecord_3 = {
      memberId: memberMeta.id,
      memberName: memberMeta.nickname || memberMeta.realName || "群成员",
      amount: amount_2,
      claimedAt: options_2.claimedAt || Date.now()
    };
    packetMsg_3.claimRecords.push(claimRecord_3);
    packetMsg_3.claimedMemberIds.push(memberId_4);
    packetMsg_3.deferAutoClaimUntilNextTurn = false;
    window.imChat.normalizeGroupRedPacketState(packetMsg_3, group_11);
    if (String(memberId_4) === "__user__" && typeof window.addPayTransaction === "function" && amount_2 > 0) {
      const senderName_3 = packetMsg_3.senderName || "群成员";
      window.addPayTransaction(amount_2, (packetMsg_3.description || "群红包") + " · 抢到红包 · " + senderName_3, "income");
    }
    if (!options_2.silentNotice) {
      const senderMeta_2 = window.imChat.getPacketSenderDisplayMeta(packetMsg_3, group_11);
      group_11.messages.push({
        id: window.imChat.createMessageId("notice"),
        type: "system_notice",
        noticeKind: "red_packet_claim",
        text: window.imChat.createRedPacketClaimNoticeText(packetMsg_3, claimRecord_3, senderMeta_2),
        relatedPacketId: packetMsg_3.packetId || packetMsg_3.id,
        timestamp: claimRecord_3.claimedAt
      });
    }
    return claimRecord_3;
  }
  function createRedPacketAllocations_2(totalAmount_2, packetCount_2) {
    const centsTotal = Math.round((Number(totalAmount_2) || 0) * 100),
      count_2 = Math.max(1, parseInt(packetCount_2, 10) || 1);
    if (centsTotal < count_2) return [];
    let remaining = centsTotal;
    const allocations_2 = [];
    for (let count = 0; count < count_2; count++) {
      const packetsLeft = count_2 - count;
      if (packetsLeft === 1) {
        allocations_2.push(Number((remaining / 100).toFixed(2)));
        remaining = 0;
        break;
      }
      const minRemainingForOthers = packetsLeft - 1,
        maxForCurrent = remaining - minRemainingForOthers,
        average = Math.floor(remaining / packetsLeft),
        upper = Math.max(1, Math.min(maxForCurrent, average * 2)),
        lower = 1,
        current = Math.max(lower, Math.min(maxForCurrent, Math.floor(Math.random() * upper) + 1));
      allocations_2.push(Number((current / 100).toFixed(2)));
      remaining -= current;
    }
    const diff = Number((Number(totalAmount_2) - allocations_2.reduce((sum, item_6) => sum + Number(item_6 || 0), 0)).toFixed(2));
    return allocations_2.length > 0 && Math.abs(diff) > 0 && (allocations_2[allocations_2.length - 1] = Number((allocations_2[allocations_2.length - 1] + diff).toFixed(2))), allocations_2;
  }
  function getRedPacketLuckiestMemberId_2(packetMsg_4) {
    if (!packetMsg_4 || !Array.isArray(packetMsg_4.claimRecords) || packetMsg_4.claimRecords.length === 0) return null;
    return packetMsg_4.claimRecords.reduce((best, item_7) => {
      if (!best) return item_7;
      return Number(item_7.amount || 0) > Number(best.amount || 0) ? item_7 : best;
    }, null)?.memberId || null;
  }
  function normalizeGroupRedPacketState_2(packetMsg_5, group_12) {
    if (!packetMsg_5 || packetMsg_5.type !== "group_red_packet") return packetMsg_5;
    if (!Array.isArray(packetMsg_5.claimRecords)) packetMsg_5.claimRecords = [];
    if (!Array.isArray(packetMsg_5.claimedMemberIds)) packetMsg_5.claimedMemberIds = [];
    (!Array.isArray(packetMsg_5.allocations) || packetMsg_5.allocations.length === 0) && (packetMsg_5.allocations = window.imChat.createRedPacketAllocations(packetMsg_5.totalAmount, packetMsg_5.packetCount));
    if (!packetMsg_5.senderRole) packetMsg_5.senderRole = packetMsg_5.role === "assistant" ? "assistant" : "user";
    !packetMsg_5.senderMemberId && (packetMsg_5.senderMemberId = packetMsg_5.senderRole === "user" ? "__user__" : packetMsg_5.speakerMemberId || "");
    if (!packetMsg_5.senderName) {
      const senderMeta_3 = window.imChat.getPacketSenderDisplayMeta(packetMsg_5, group_12);
      packetMsg_5.senderName = senderMeta_3.name;
      packetMsg_5.senderAvatarUrl = packetMsg_5.senderAvatarUrl || senderMeta_3.avatarUrl || "";
    }
    packetMsg_5.claimedMemberIds = packetMsg_5.claimRecords.map(item_8 => String(item_8.memberId));
    packetMsg_5.remainingCount = Math.max(0, (parseInt(packetMsg_5.packetCount, 10) || 0) - packetMsg_5.claimRecords.length);
    packetMsg_5.remainingAmount = Number(((Number(packetMsg_5.totalAmount) || 0) - packetMsg_5.claimRecords.reduce((sum_2, item_9) => sum_2 + Number(item_9.amount || 0), 0)).toFixed(2));
    packetMsg_5.luckiestMemberId = window.imChat.getRedPacketLuckiestMemberId(packetMsg_5);
    const participants = window.imChat.getAllRedPacketParticipants(group_12),
      max_122 = Math.max(1, parseInt(packetMsg_5.packetCount, 10) || 1),
      maxClaimable_2 = Math.min(participants.length, max_122);
    packetMsg_5.packetCount = max_122;
    packetMsg_5.maxClaimable = maxClaimable_2;
    packetMsg_5.remainingCount = Math.min(packetMsg_5.remainingCount, Math.max(0, maxClaimable_2 - packetMsg_5.claimRecords.length));
    packetMsg_5.isFinished = packetMsg_5.claimRecords.length >= maxClaimable_2 || packetMsg_5.remainingCount <= 0 || packetMsg_5.remainingAmount <= 0;
    packetMsg_5.statusText = packetMsg_5.isFinished ? "已被抢完" : "待领取";
    const currentUserClaimRecord_2 = window.imChat.getCurrentUserClaimRecord(packetMsg_5);
    return packetMsg_5.currentUserClaimRecord = currentUserClaimRecord_2, packetMsg_5.currentUserClaimed = !!currentUserClaimRecord_2, packetMsg_5.currentUserClaimAmount = currentUserClaimRecord_2 ? Number(currentUserClaimRecord_2.amount || 0) : 0, packetMsg_5;
  }
  function processPendingGroupRedPackets_2(group_13) {
    if (!group_13 || group_13.type !== "group" || !Array.isArray(group_13.messages) || group_13.messages.length === 0) return false;
    const packets = group_13.messages.filter(msg_3 => msg_3 && msg_3.type === "group_red_packet" && !msg_3.isFinished);
    if (packets.length === 0) return false;
    const participants_2 = window.imChat.getAllRedPacketParticipants(group_13).filter(member_9 => String(member_9.id) !== "__user__");
    if (participants_2.length === 0) return false;
    let changed = false;
    return packets.forEach(packetMsg_6 => {
      window.imChat.normalizeGroupRedPacketState(packetMsg_6, group_13);
      if (packetMsg_6.isFinished) return;
      if (packetMsg_6.deferAutoClaimUntilNextTurn) {
        packetMsg_6.deferAutoClaimUntilNextTurn = false;
        changed = true;
        return;
      }
      const alreadyClaimedSet = new Set((packetMsg_6.claimedMemberIds || []).map(String)),
        claimableMembers = participants_2.filter(member_10 => !alreadyClaimedSet.has(String(member_10.id))),
        remainingAllocations = (packetMsg_6.allocations || []).slice(packetMsg_6.claimRecords.length);
      if (claimableMembers.length === 0 || remainingAllocations.length === 0) {
        window.imChat.normalizeGroupRedPacketState(packetMsg_6, group_13);
        return;
      }
      const maxClaimsThisRound = Math.min(remainingAllocations.length, claimableMembers.length, Math.max(1, Math.min(3, claimableMembers.length))),
        shouldClaimCount = Math.max(1, Math.min(maxClaimsThisRound, Math.ceil(Math.random() * maxClaimsThisRound))),
        shuffledMembers = claimableMembers.slice().sort(() => Math.random() - 0.5).slice(0, shouldClaimCount);
      shuffledMembers.forEach((member_11, index) => {
        const claimRecord = window.imChat.claimGroupRedPacketForMember(group_13, packetMsg_6, member_11, {
          claimedAt: Date.now() + index
        });
        if (claimRecord) changed = true;
      });
      window.imChat.normalizeGroupRedPacketState(packetMsg_6, group_13);
    }), changed && group_13.messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)), changed;
  }
  function refreshRedPacketMessageInContainer(page, friend_5, targetMsg_2) {
    if (!page || !friend_5 || !targetMsg_2) return false;
    const insChatMessagesElement = page.querySelector(".ins-chat-messages");
    if (!insChatMessagesElement) return false;
    const targetMessageId = targetMsg_2.id || targetMsg_2.packetId || null,
      targetTimestamp = targetMsg_2.timestamp || null,
      value_146 = targetMessageId ? insChatMessagesElement.querySelector(".chat-row[data-message-id=\"" + targetMessageId + "\"]") : targetTimestamp ? insChatMessagesElement.querySelector(".chat-row[data-timestamp=\"" + targetTimestamp + "\"]") : null;
    if (!value_146) return false;
    const replaceHost = document.createElement("div");
    window.imChat.renderGroupRedPacketBubble(targetMsg_2, friend_5, replaceHost, targetMsg_2.timestamp || Date.now());
    const chatRowElement = replaceHost.querySelector(".chat-row");
    if (!chatRowElement) return false;
    return value_146.replaceWith(chatRowElement), true;
  }
  function ensureRedPacketDetailOverlayForExistingPage_2(page_2, friend_6) {
    if (!page_2 || page_2.querySelector(".group-red-packet-detail-overlay")) return;
    page_2.insertAdjacentHTML("beforeend", "\n            <div class=\"group-red-packet-claim-overlay\" style=\"display:none; position:absolute; inset:0; z-index:1201; background:rgba(0,0,0,0.32); opacity:0; transition:opacity 0.3s ease; align-items:center; justify-content:center; padding:18px; box-sizing:border-box;\">\n                <div class=\"group-red-packet-claim-card\" style=\"width:100%; max-width:320px; border-radius:24px; background:#fff; color:#111;  padding:32px 24px 28px; box-sizing:border-box; text-align:center; position:relative; transform:scale(0.9); opacity:0; transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\">\n                    <button type=\"button\" class=\"group-red-packet-claim-close\" style=\"position:absolute; right:16px; top:16px; width:32px; height:32px; border:none; border-radius:50%; background:#f2f2f7; color:#666; cursor:pointer; transition:background 0.2s;\"><i class=\"fas fa-times\"></i></button>\n                    \n                    <div class=\"group-red-packet-claim-avatar\" style=\"width:64px; height:64px; border-radius:50%; overflow:hidden; margin:0 auto 16px; background:#f2f2f7; display:flex; align-items:center; justify-content:center; font-size:22px; color:#8e8e93;\">\n                        <i class=\"fas fa-user\"></i>\n                    </div>\n                    <div class=\"group-red-packet-claim-sender\" style=\"font-size:18px; font-weight:800; color:#111;\">发红包的人</div>\n                    <div class=\"group-red-packet-claim-desc\" style=\"font-size:14px; color:#8e8e93; margin-top:8px; line-height:1.5;\">恭喜发财</div>\n                    \n                    <div class=\"group-red-packet-claim-action-area\" style=\"margin-top:36px; min-height:110px; display:flex; flex-direction:column; align-items:center;\">\n                        <button type=\"button\" class=\"group-red-packet-claim-action\" style=\"width:90px; height:90px; border:none; border-radius:50%; background:#ff4d4f; color:#fff; display:flex; align-items:center; justify-content:center; font-size:42px; cursor:pointer;  transition:transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);\">\n                            <i class=\"fas fa-envelope-open-text\"></i>\n                        </button>\n                        <div class=\"group-red-packet-claim-empty-text\" style=\"display:none; font-size:24px; font-weight:800; color:#111; margin-bottom:10px;\">手慢了，红包派完了</div>\n                        \n                        <div class=\"group-red-packet-claim-view-detail\" style=\"margin-top:auto; font-size:13px; color:#007aff; cursor:pointer; font-weight:500; display:flex; align-items:center; justify-content:center; gap:4px;\">\n                            查看详情 <i class=\"fas fa-chevron-right\" style=\"font-size:10px;\"></i>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"group-red-packet-detail-overlay\" style=\"display:none; position:absolute; inset:0; z-index:1202; background:rgba(0,0,0,0.28); opacity:0; transition:opacity 0.3s ease; align-items:center; justify-content:center; padding:18px; box-sizing:border-box;\">\n                <div class=\"group-red-packet-detail-card\" style=\"width:100%; max-width:340px; max-height:82%; overflow:hidden; border-radius:30px; background:rgba(255,255,255,0.98);    display:flex; flex-direction:column; transform:translateY(20px); opacity:0; transition:all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\">\n                    <div style=\"position:relative; padding:18px 18px 14px; border-bottom:1px solid rgba(0,0,0,0.06); text-align:center;\">\n                        <div style=\"font-size:18px; font-weight:800; color:#111; text-align:center;\">红包详情</div>\n                        <button type=\"button\" class=\"group-red-packet-detail-close\" style=\"position:absolute; right:18px; top:16px; width:32px; height:32px; border:none; border-radius:50%; background:#f2f2f7; color:#666; cursor:pointer;\"><i class=\"fas fa-times\"></i></button>\n                        <div class=\"group-red-packet-detail-header\" style=\"display:flex; flex-direction:column; align-items:center; justify-content:center; margin-top:14px;\">\n                            <div class=\"group-red-packet-detail-avatar\" style=\"width:58px; height:58px; border-radius:50%; overflow:hidden; background:#e5e5ea; color:#8e8e93; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:10px;\">\n                                <i class=\"fas fa-user\"></i>\n                            </div>\n                            <div class=\"group-red-packet-detail-title\" style=\"font-size:17px; font-weight:700; color:#111; text-align:center;\">发红包的人</div>\n                            <div class=\"group-red-packet-detail-summary\" style=\"font-size:12px; color:#8e8e93; margin-top:6px; text-align:center;\">总金额 ¥0.00 · 恭喜发财</div>\n                            <div class=\"group-red-packet-detail-claim-amount\" style=\"font-size:36px; line-height:1.1; font-weight:800; color:#111; text-align:center; margin-top:14px;\">¥0.00</div>\n                            <div style=\"font-size:12px; color:#8e8e93; margin-top:6px;\">你抢到的金额</div>\n                        </div>\n                    </div>\n                    <div style=\"padding:14px 18px 10px;\">\n                        <div class=\"group-red-packet-detail-progress\" style=\"border-radius:18px; background:#f7f7fa; padding:12px 14px;\">\n                            <div class=\"group-red-packet-detail-progress-text\" style=\"font-size:14px; color:#333; line-height:1.5;\">0/0 人领取</div>\n                            <div class=\"group-red-packet-detail-status\" style=\"font-size:12px; color:#8e8e93; margin-top:4px;\">待领取</div>\n                        </div>\n                    </div>\n                    <div class=\"group-red-packet-detail-list\" style=\"flex:1; overflow-y:auto; padding:0 18px 18px;\"></div>\n                </div>\n            </div>\n        ");
    const claimOverlay = page_2.querySelector(".group-red-packet-claim-overlay"),
      claimCloseBtn = page_2.querySelector(".group-red-packet-claim-close"),
      claimAvatarEl = page_2.querySelector(".group-red-packet-claim-avatar"),
      claimSenderEl = page_2.querySelector(".group-red-packet-claim-sender"),
      claimDescEl = page_2.querySelector(".group-red-packet-claim-desc"),
      groupRedPacketClaimActionElement = page_2.querySelector(".group-red-packet-claim-action"),
      claimOverlay_2 = page_2.querySelector(".group-red-packet-detail-overlay"),
      closeBtn = page_2.querySelector(".group-red-packet-detail-close"),
      titleEl = page_2.querySelector(".group-red-packet-detail-title"),
      summaryEl = page_2.querySelector(".group-red-packet-detail-summary"),
      claimAmountEl = page_2.querySelector(".group-red-packet-detail-claim-amount"),
      progressTextEl = page_2.querySelector(".group-red-packet-detail-progress-text"),
      statusEl = page_2.querySelector(".group-red-packet-detail-status"),
      listEl = page_2.querySelector(".group-red-packet-detail-list"),
      avatarEl = page_2.querySelector(".group-red-packet-detail-avatar");
    let activePacketMsg = null;
    function _closeRedPacketClaimOverlay_2() {
      activePacketMsg = null;
      if (claimOverlay) {
        claimOverlay.style.opacity = "0";
        const claimOverlay_3 = claimOverlay.querySelector(".group-red-packet-claim-card");
        claimOverlay_3 && (claimOverlay_3.style.transform = "scale(0.9)", claimOverlay_3.style.opacity = "0");
        setTimeout(() => {
          claimOverlay.style.display = "none";
        }, 300);
      }
    }
    function _closeRedPacketDetailOverlay_2() {
      activePacketMsg = null;
      if (claimOverlay_2) {
        claimOverlay_2.style.opacity = "0";
        const groupRedPacketDetailCardElement = claimOverlay_2.querySelector(".group-red-packet-detail-card");
        groupRedPacketDetailCardElement && (groupRedPacketDetailCardElement.style.transform = "translateY(20px)", groupRedPacketDetailCardElement.style.opacity = "0");
        setTimeout(() => {
          claimOverlay_2.style.display = "none";
        }, 300);
      }
    }
    function openRedPacketDetailOverlay(targetMsg_3) {
      if (!claimOverlay_2 || !targetMsg_3) return;
      activePacketMsg = targetMsg_3;
      window.imChat.normalizeGroupRedPacketState(targetMsg_3, friend_6);
      const packetSenderDisplayMeta_152 = window.imChat.getPacketSenderDisplayMeta(targetMsg_3, friend_6, friend_6),
        claimRecords_2 = Array.isArray(targetMsg_3.claimRecords) ? targetMsg_3.claimRecords.slice() : [],
        length_154 = claimRecords_2.length,
        packetCount_3 = parseInt(targetMsg_3.packetCount, 10) || 0,
        totalAmount_3 = Number(targetMsg_3.totalAmount) || 0,
        luckiestMemberId_2 = targetMsg_3.luckiestMemberId || window.imChat.getRedPacketLuckiestMemberId(targetMsg_3),
        myAmount = Number(targetMsg_3.currentUserClaimAmount || 0);
      if (titleEl) titleEl.textContent = packetSenderDisplayMeta_152.name || "发红包的人";
      if (summaryEl) summaryEl.textContent = "总金额 ¥" + totalAmount_3.toFixed(2) + " · " + (targetMsg_3.description || "恭喜发财");
      if (claimAmountEl) claimAmountEl.textContent = "¥" + myAmount.toFixed(2);
      if (progressTextEl) progressTextEl.textContent = length_154 + "/" + packetCount_3 + " 人领取";
      if (statusEl) statusEl.textContent = targetMsg_3.isFinished ? "已被抢完" : "剩余 " + (targetMsg_3.remainingCount || 0) + " 个，¥" + Number(targetMsg_3.remainingAmount || 0).toFixed(2);
      const innerHTML_2 = packetSenderDisplayMeta_152.avatarUrl ? "<img src=\"" + packetSenderDisplayMeta_152.avatarUrl + "\" style=\"width:100%; height:100%; object-fit:cover; display:block;\">" : "<span>" + String(packetSenderDisplayMeta_152.name || "群").charAt(0) + "</span>";
      if (avatarEl) avatarEl.innerHTML = innerHTML_2;
      if (listEl) {
        const join_161 = claimRecords_2.map(item_10 => "\n                    <div style=\"display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid rgba(0,0,0,0.05);\">\n                        <div style=\"display:flex; align-items:center; gap:10px; min-width:0;\">\n                            <div style=\"width:36px; height:36px; border-radius:50%; background:#f2f2f7; display:flex; align-items:center; justify-content:center; color:#8e8e93; font-size:15px; flex-shrink:0;\">\n                                " + (item_10.memberName || "群").charAt(0) + "\n                            </div>\n                            <div style=\"min-width:0;\">\n                                <div style=\"font-size:14px; font-weight:600; color:#111; display:flex; align-items:center; gap:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;\">\n                                    <span>" + (item_10.memberName || window.imChat.getDisplayNameByMemberId(friend_6, item_10.memberId)) + "</span>\n                                    " + (String(item_10.memberId) === String(luckiestMemberId_2) ? "<span style=\"display:inline-flex; align-items:center; padding:2px 8px; border-radius:999px; background:#f2f2f7; color:#111; font-size:10px; font-weight:700;\">运气王</span>" : "") + "\n                                </div>\n                                <div style=\"font-size:11px; color:#8e8e93; margin-top:3px;\">" + (window.imApp.formatTime ? window.imApp.formatTime(item_10.claimedAt) : "") + "</div>\n                            </div>\n                        </div>\n                        <div style=\"font-size:16px; font-weight:800; color:#111;\">¥" + Number(item_10.amount || 0).toFixed(2) + "</div>\n                    </div>\n                ").join("");
        listEl.innerHTML = join_161 ? join_161 : "<div style=\"padding:28px 0; text-align:center; color:#8e8e93; font-size:13px;\">还没有人领取红包</div>";
      }
      claimOverlay_2.style.display = "flex";
      claimOverlay_2.offsetHeight;
      claimOverlay_2.style.opacity = "1";
      const groupRedPacketDetailCardElement_160 = claimOverlay_2.querySelector(".group-red-packet-detail-card");
      groupRedPacketDetailCardElement_160 && (groupRedPacketDetailCardElement_160.style.transform = "translateY(0)", groupRedPacketDetailCardElement_160.style.opacity = "1");
    }
    function _openRedPacketClaimOverlay_2(targetMsg_4) {
      if (!claimOverlay || !targetMsg_4) return;
      activePacketMsg = targetMsg_4;
      window.imChat.normalizeGroupRedPacketState(targetMsg_4, friend_6);
      const packetSenderDisplayMeta_164 = window.imChat.getPacketSenderDisplayMeta(targetMsg_4, friend_6, friend_6),
        innerHTML_3 = packetSenderDisplayMeta_164.avatarUrl ? "<img src=\"" + packetSenderDisplayMeta_164.avatarUrl + "\" style=\"width:100%; height:100%; object-fit:cover; display:block;\">" : "<span>" + String(packetSenderDisplayMeta_164.name || "群").charAt(0) + "</span>";
      if (claimAvatarEl) claimAvatarEl.innerHTML = innerHTML_3;
      if (claimSenderEl) claimSenderEl.textContent = packetSenderDisplayMeta_164.name || "发红包的人";
      if (claimDescEl) claimDescEl.textContent = targetMsg_4.description || "恭喜发财";
      const actionBtn = claimOverlay.querySelector(".group-red-packet-claim-action"),
        emptyText = claimOverlay.querySelector(".group-red-packet-claim-empty-text");
      if (targetMsg_4.isFinished) {
        if (actionBtn) actionBtn.style.display = "none";
        if (emptyText) emptyText.style.display = "block";
      } else {
        if (actionBtn) actionBtn.style.display = "flex";
        if (emptyText) emptyText.style.display = "none";
      }
      claimOverlay.style.display = "flex";
      claimOverlay.offsetHeight;
      claimOverlay.style.opacity = "1";
      const claimOverlay_4 = claimOverlay.querySelector(".group-red-packet-claim-card");
      claimOverlay_4 && (claimOverlay_4.style.transform = "scale(1)", claimOverlay_4.style.opacity = "1");
    }
    function _openGroupRedPacketInteraction_2(targetMsg) {
      if (!targetMsg) return;
      window.imChat.normalizeGroupRedPacketState(targetMsg, friend_6);
      if (targetMsg.currentUserClaimed) {
        openRedPacketDetailOverlay(targetMsg);
        return;
      }
      _openRedPacketClaimOverlay_2(targetMsg);
    }
    page_2._openRedPacketDetailOverlay = openRedPacketDetailOverlay;
    page_2._closeRedPacketDetailOverlay = _closeRedPacketDetailOverlay_2;
    page_2._openRedPacketClaimOverlay = _openRedPacketClaimOverlay_2;
    page_2._closeRedPacketClaimOverlay = _closeRedPacketClaimOverlay_2;
    page_2._openGroupRedPacketInteraction = _openGroupRedPacketInteraction_2;
    claimOverlay && claimOverlay.addEventListener("click", event => {
      if (event.target === claimOverlay) _closeRedPacketClaimOverlay_2();
    });
    claimCloseBtn && claimCloseBtn.addEventListener("click", () => {
      _closeRedPacketClaimOverlay_2();
    });
    const viewDetailBtn = page_2.querySelector(".group-red-packet-claim-view-detail");
    viewDetailBtn && viewDetailBtn.addEventListener("click", () => {
      if (!activePacketMsg) return;
      const msg_4 = activePacketMsg;
      _closeRedPacketClaimOverlay_2();
      setTimeout(() => {
        openRedPacketDetailOverlay(msg_4);
      }, 200);
    });
    groupRedPacketClaimActionElement && groupRedPacketClaimActionElement.addEventListener("click", () => {
      if (!activePacketMsg) return;
      groupRedPacketClaimActionElement.style.transform = "scale(0.9)";
      setTimeout(async () => {
        groupRedPacketClaimActionElement.style.transform = "scale(1)";
        const packetId_2 = activePacketMsg.packetId || activePacketMsg.id;
        let claimedPacketMsg = null;
        const saved = await commitPaymentFriendChange(friend_6, targetFriend => {
          const targetPacket = Array.isArray(targetFriend.messages) ? targetFriend.messages.find(item_11 => item_11 && (item_11.packetId === packetId_2 || item_11.id === packetId_2)) : null;
          if (!targetPacket) return;
          const claimRecord_4 = window.imChat.claimGroupRedPacketForMember(targetFriend, targetPacket, window.imChat.getCurrentUserPacketMember(targetFriend));
          if (!claimRecord_4) return;
          claimedPacketMsg = targetPacket;
        }, {
          silent: true
        });
        if (!claimedPacketMsg) {
          if (window.showToast) window.showToast("手慢了，红包派完了");
          _openRedPacketClaimOverlay_2(activePacketMsg);
          return;
        }
        if (!saved) {
          if (window.showToast) window.showToast("红包领取保存失败");
          return;
        }
        const insChatMessagesElement_171 = page_2.querySelector(".ins-chat-messages");
        if (insChatMessagesElement_171) {
          const patched = refreshRedPacketMessageInContainer(page_2, friend_6, claimedPacketMsg);
          !patched && (insChatMessagesElement_171.innerHTML = "", window.imChat.renderChatHistory(friend_6, insChatMessagesElement_171));
          window.imChat.scrollToBottom(insChatMessagesElement_171);
        }
        _closeRedPacketClaimOverlay_2();
        setTimeout(() => {
          openRedPacketDetailOverlay(claimedPacketMsg);
        }, 250);
      }, 150);
    });
    claimOverlay_2 && claimOverlay_2.addEventListener("click", event_175 => {
      if (event_175.target === claimOverlay_2) _closeRedPacketDetailOverlay_2();
    });
    closeBtn && closeBtn.addEventListener("click", () => {
      _closeRedPacketDetailOverlay_2();
    });
  }
  function ensureTransferDetailOverlayForExistingPage_2(page_3, friend_7) {
    if (!page_3) return;
    const existingOverlay = page_3.querySelector(".pay-transfer-detail-overlay"),
      hasManagedOverlay = existingOverlay && page_3._transferDetailOverlayManaged === true && typeof page_3._openTransferDetailOverlay === "function";
    if (hasManagedOverlay) return;
    existingOverlay && (existingOverlay.remove(), page_3._openTransferDetailOverlay = null, page_3._closeTransferDetailOverlay = null, page_3._transferDetailOverlayManaged = false);
    page_3.insertAdjacentHTML("beforeend", "\n                <div class=\"pay-transfer-detail-overlay\" style=\"display:none; position:absolute; inset:0; z-index:1200; background:rgba(0,0,0,0.28); align-items:center; justify-content:center; padding:20px; box-sizing:border-box;\">\n                    <div class=\"pay-transfer-detail-card\" style=\"width:100%; max-width:320px; border-radius:28px; background:rgba(255,255,255,0.96);    padding:20px 18px 16px; box-sizing:border-box;\">\n                        <div style=\"display:flex; align-items:center; gap:12px; margin-bottom:16px;\">\n                            <div class=\"pay-transfer-detail-avatar\" style=\"width:52px; height:52px; border-radius:50%; overflow:hidden; background:#e5e5ea; display:flex; align-items:center; justify-content:center; flex-shrink:0;\">\n                                <i class=\"fas fa-user\" style=\"color:#8e8e93; font-size:20px;\"></i>\n                            </div>\n                            <div style=\"min-width:0;\">\n                                <div class=\"pay-transfer-detail-name\" style=\"font-size:17px; font-weight:700; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;\">付款人</div>\n                                <div class=\"pay-transfer-detail-action-text\" style=\"font-size:12px; color:#8e8e93; margin-top:3px;\">向你转账</div>\n                            </div>\n                        </div>\n                        <div class=\"pay-transfer-detail-amount\" style=\"font-size:34px; line-height:1.1; font-weight:800; color:#111; text-align:center; margin:8px 0 10px;\">¥0.00</div>\n                        <div class=\"pay-transfer-detail-desc\" style=\"font-size:14px; color:#666; text-align:center; line-height:1.5; min-height:21px; margin-bottom:18px;\">转账说明</div>\n                        <div style=\"border-radius:18px; background:#f7f7fa; padding:12px 14px; margin-bottom:16px;\">\n                            <div style=\"font-size:12px; color:#8e8e93; margin-bottom:6px;\">转账详情</div>\n                            <div class=\"pay-transfer-detail-summary\" style=\"font-size:14px; color:#222; line-height:1.5;\">付款人向你转账</div>\n                        </div>\n                        <div style=\"display:flex; gap:10px;\">\n                            <button type=\"button\" class=\"pay-transfer-detail-reject-btn\" style=\"flex:1; height:46px; border:none; border-radius:16px; background:#f2f2f7; color:#666; font-size:16px; font-weight:600; cursor:pointer;\">退回</button>\n                            <button type=\"button\" class=\"pay-transfer-detail-claim-btn\" style=\"flex:1; height:46px; border:none; border-radius:16px; background:#111; color:#fff; font-size:16px; font-weight:700; cursor:pointer;\">收下</button>\n                        </div>\n                    </div>\n                </div>\n        ");
    const transferDetailOverlay = page_3.querySelector(".pay-transfer-detail-overlay"),
      transferDetailAvatar = page_3.querySelector(".pay-transfer-detail-avatar"),
      transferDetailName = page_3.querySelector(".pay-transfer-detail-name"),
      transferDetailAmount = page_3.querySelector(".pay-transfer-detail-amount"),
      transferDetailDesc = page_3.querySelector(".pay-transfer-detail-desc"),
      transferDetailSummary = page_3.querySelector(".pay-transfer-detail-summary"),
      transferDetailRejectBtn = page_3.querySelector(".pay-transfer-detail-reject-btn"),
      transferDetailClaimBtn = page_3.querySelector(".pay-transfer-detail-claim-btn"),
      insChatMessagesElement_179 = page_3.querySelector(".ins-chat-messages");
    let pendingTransferMsg = null;
    function _closeTransferDetailOverlay_2() {
      pendingTransferMsg = null;
      if (transferDetailOverlay) transferDetailOverlay.style.display = "none";
    }
    function _openTransferDetailOverlay_2(targetMsg_5) {
      if (!transferDetailOverlay || !targetMsg_5) return;
      pendingTransferMsg = targetMsg_5;
      const model = normalizePayTransferMessage_2(targetMsg_5, friend_7),
        {
          status: status_3,
          payerName: value_183,
          payeeName: payeeName_3,
          payerAvatar: payerAvatar_2,
          canCurrentUserClaim: canCurrentUserClaim_2
        } = model,
        value_187 = Number(targetMsg_5.amount) || 0,
        textContent_2 = targetMsg_5.description || "转账",
        familyCardText = (targetMsg_5.paymentAction || "") + " " + (targetMsg_5.cardTitle || "") + " " + (targetMsg_5.description || "") + " " + (targetMsg_5.content || ""),
        isFamilyCard = targetMsg_5.paymentAction === "family_card" || targetMsg_5.paymentAction === "family_card_increase" || familyCardText.includes("亲属卡");
      if (transferDetailName) transferDetailName.textContent = value_183;
      if (transferDetailAmount) transferDetailAmount.textContent = "¥" + value_187.toFixed(2);
      if (transferDetailDesc) transferDetailDesc.textContent = textContent_2;
      if (transferDetailSummary) transferDetailSummary.textContent = isFamilyCard ? "备注：" + textContent_2 : value_183 + " 向 " + payeeName_3 + " 转账，备注：" + textContent_2;
      const transferDetailActionText = page_3.querySelector(".pay-transfer-detail-action-text");
      if (transferDetailActionText) {
        if (isFamilyCard) transferDetailActionText.textContent = "";else {
          if (status_3 === "claimed") transferDetailActionText.textContent = payeeName_3 + "已收款";else {
            if (status_3 === "rejected") transferDetailActionText.textContent = "已退还";else canCurrentUserClaim_2 ? transferDetailActionText.textContent = "向你转账" : transferDetailActionText.textContent = "转账给 " + payeeName_3;
          }
        }
      }
      transferDetailAvatar && (payerAvatar_2 ? transferDetailAvatar.innerHTML = "<img src=\"" + payerAvatar_2 + "\" style=\"width:100%; height:100%; object-fit:cover; display:block;\">" : transferDetailAvatar.innerHTML = "<i class=\"fas fa-user\" style=\"color:#8e8e93; font-size:20px;\"></i>");
      const actionsContainer = transferDetailRejectBtn ? transferDetailRejectBtn.parentElement : null;
      if (canCurrentUserClaim_2) {
        if (actionsContainer) actionsContainer.style.display = "flex";
        transferDetailRejectBtn && (transferDetailRejectBtn.style.display = "block", transferDetailRejectBtn.textContent = "退回");
        transferDetailClaimBtn && (transferDetailClaimBtn.style.display = "block", transferDetailClaimBtn.textContent = "收下");
      } else {
        if (actionsContainer) actionsContainer.style.display = "none";
      }
      transferDetailOverlay.style.display = "flex";
    }
    page_3._openTransferDetailOverlay = _openTransferDetailOverlay_2;
    page_3._closeTransferDetailOverlay = _closeTransferDetailOverlay_2;
    page_3._transferDetailOverlayManaged = true;
    window.imChat.ensureRedPacketDetailOverlayForExistingPage(page_3, friend_7);
    insChatMessagesElement_179 && insChatMessagesElement_179.addEventListener("click", e => {
      const row = e.target.closest(".chat-row");
      if (!row) return;
      const messageId = row.getAttribute("data-message-id"),
        ts = row.getAttribute("data-timestamp"),
        liveFriend = window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(friend_7.id) ? window.imData.currentActiveFriend : friend_7;
      if (!messageId && !ts || !liveFriend.messages) return;
      const msg_5 = liveFriend.messages.find(item_12 => {
        if (messageId && String(item_12.id) === String(messageId)) return true;
        return String(item_12.timestamp) === String(ts);
      });
      if (!msg_5 || msg_5.type !== "pay_transfer") return;
      const validKinds = ["user_to_char", "char_to_user_pending", "char_received", "char_to_user_claimed", "user_received_from_char", "user_rejected_from_char", "char_to_user_rejected", "user_to_char_rejected"];
      if (!validKinds.includes(msg_5.payKind)) return;
      const bubble = e.target.closest(".chat-bubble.pay-transfer-bubble, .pay-transfer-card");
      if (!bubble) return;
      e.preventDefault();
      e.stopPropagation();
      _openTransferDetailOverlay_2(msg_5);
    }, true);
    transferDetailOverlay && transferDetailOverlay.addEventListener("click", event_199 => {
      event_199.target === transferDetailOverlay && _closeTransferDetailOverlay_2();
    });
    transferDetailRejectBtn && transferDetailRejectBtn.addEventListener("click", () => {
      const targetMsg_6 = pendingTransferMsg;
      _closeTransferDetailOverlay_2();
      targetMsg_6 && window.imChat.rejectIncomingTransfer && window.imChat.rejectIncomingTransfer(friend_7, targetMsg_6);
    });
    transferDetailClaimBtn && transferDetailClaimBtn.addEventListener("click", () => {
      const targetMsg_7 = pendingTransferMsg;
      _closeTransferDetailOverlay_2();
      targetMsg_7 && window.imChat.claimIncomingTransfer(friend_7, targetMsg_7);
    });
  }
  async function claimIncomingTransfer_2(value_202, message_203, value_204 = {}) {
    if (!value_202 || !message_203 || message_203.claimed) return;
    if (message_203.payKind !== "char_to_user_pending" && message_203.payKind !== "user_to_char") return;
    const amount_3 = Number(message_203.amount) || 0,
      description_2 = message_203.description || "转账",
      payTransferMessage_11_207 = normalizePayTransferMessage_2(message_203, value_202),
      payerName_208 = payTransferMessage_11_207.payerName,
      payeeName_209 = payTransferMessage_11_207.payeeName;
    if (amount_3 <= 0) {
      if (window.showToast) window.showToast("金额无效");
      return;
    }
    const currentActiveFriend_210 = window.imData.currentActiveFriend,
      elementById = document.getElementById("chat-interface-" + value_202.id),
      element_211 = elementById ? elementById.querySelector(".ins-chat-messages") : null,
      value_212 = element_211 && message_203.id ? element_211.querySelector(".chat-row[data-message-id=\"" + message_203.id + "\"]") : null,
      value_213 = message_203.payKind === "char_to_user_pending";
    if (value_213) {
      const incomeSuccess = typeof window.addPayTransaction === "function" ? window.addPayTransaction(amount_3, description_2 + " · " + payerName_208, "income") : false;
      if (!incomeSuccess) {
        if (window.showToast) window.showToast("收款失败");
        return;
      }
    }
    const id_214 = message_203.id,
      rollbackSourceMessage_2 = JSON.parse(JSON.stringify(message_203));
    let updatedMsg = null,
      receiveMsg = null,
      timestamp_2 = Date.now();
    value_213 ? receiveMsg = {
      id: window.imChat.createMessageId("pay"),
      role: "user",
      type: "pay_transfer",
      payKind: "user_received_from_char",
      payDirection: payTransferMessage_11_207.direction,
      amount: amount_3,
      description: description_2,
      payerName: payerName_208,
      payeeName: payeeName_209,
      senderName: payerName_208,
      receiverName: payeeName_209,
      targetName: payerName_208,
      cardTitle: "收款",
      payStatus: "completed",
      content: "[收款] " + description_2 + " ¥" + amount_3.toFixed(2),
      timestamp: timestamp_2,
      apiRunId: value_204.apiRunId || null,
      rollbackSourceMessage: rollbackSourceMessage_2
    } : (receiveMsg = {
      id: window.imChat.createMessageId("pay"),
      role: "assistant",
      type: "pay_transfer",
      payKind: "char_received",
      payDirection: payTransferMessage_11_207.direction,
      amount: amount_3,
      description: description_2,
      payerName: payerName_208,
      payeeName: payeeName_209,
      senderName: payerName_208,
      receiverName: payeeName_209,
      targetName: payerName_208,
      cardTitle: payeeName_209 + "已收款",
      payStatus: "completed",
      content: "[对方已收款] " + description_2 + " ¥" + amount_3.toFixed(2),
      timestamp: timestamp_2,
      apiRunId: value_204.apiRunId || null,
      rollbackSourceMessage: rollbackSourceMessage_2
    }, typeof value_204.cotSummary === "string" && value_204.cotSummary.trim() && (receiveMsg.cotSummary = value_204.cotSummary.trim()));
    window.imApp.captureGroupUserIdentity?.(value_202, receiveMsg);
    let saved_2 = false;
    if (window.imApp.updateFriendMessage && window.imApp.appendFriendMessage) {
      const value_220 = await window.imApp.updateFriendMessage(value_202.id, {
        id: id_214 || null,
        timestamp: message_203.timestamp || null
      }, message_221 => {
        if (!message_221) return;
        message_221.claimed = true;
        value_213 ? (message_221.payKind = "char_to_user_claimed", message_221.payDirection = payTransferMessage_11_207.direction, message_221.cardTitle = payeeName_209 + "已收款", message_221.targetName = payerName_208, message_221.payerName = payerName_208, message_221.payeeName = payeeName_209, message_221.senderName = payerName_208, message_221.receiverName = payeeName_209, message_221.content = "[对方转账已领取] " + description_2 + " ¥" + amount_3.toFixed(2)) : (message_221.payKind = "char_received", message_221.payDirection = payTransferMessage_11_207.direction, message_221.cardTitle = payeeName_209 + "已收款", message_221.targetName = payerName_208, message_221.payerName = payerName_208, message_221.payeeName = payeeName_209, message_221.senderName = payerName_208, message_221.receiverName = payeeName_209, message_221.content = "[对方转账已领取] " + description_2 + " ¥" + amount_3.toFixed(2));
        updatedMsg = message_221;
      }, {
        silent: true
      });
      value_220 && (saved_2 = await window.imApp.appendFriendMessage(value_202.id, receiveMsg, {
        silent: true
      }));
    } else saved_2 = await commitPaymentFriendChange(value_202, value_222 => {
      const message_223 = Array.isArray(value_222.messages) ? value_222.messages.find(value_224 => value_224 && String(value_224.id) === String(id_214)) : null;
      if (!message_223) return;
      message_223.claimed = true;
      value_213 ? (message_223.payKind = "char_to_user_claimed", message_223.payDirection = payTransferMessage_11_207.direction, message_223.cardTitle = payeeName_209 + "已收款", message_223.targetName = payerName_208, message_223.payerName = payerName_208, message_223.payeeName = payeeName_209, message_223.senderName = payerName_208, message_223.receiverName = payeeName_209, message_223.content = "[对方转账已领取] " + description_2 + " ¥" + amount_3.toFixed(2)) : (message_223.payKind = "char_received", message_223.payDirection = payTransferMessage_11_207.direction, message_223.cardTitle = payeeName_209 + "已收款", message_223.targetName = payerName_208, message_223.payerName = payerName_208, message_223.payeeName = payeeName_209, message_223.senderName = payerName_208, message_223.receiverName = payeeName_209, message_223.content = "[对方转账已领取] " + description_2 + " ¥" + amount_3.toFixed(2));
      if (!value_222.messages) value_222.messages = [];
      value_222.messages.push(receiveMsg);
      updatedMsg = message_223;
    }, {
      silent: true
    });
    if (!saved_2 || !updatedMsg || !receiveMsg) {
      if (window.showToast) window.showToast("收款记录保存失败");
      return;
    }
    if (currentActiveFriend_210 && String(currentActiveFriend_210.id) === String(value_202.id) && element_211) {
      if (value_212) {
        const element_225 = document.createElement("div");
        window.imChat.renderPayTransferBubble(updatedMsg, value_202, element_225, updatedMsg.timestamp || timestamp_2);
        const chatRowElement_226 = element_225.querySelector(".chat-row");
        chatRowElement_226 && value_212.replaceWith(chatRowElement_226);
        const element_227 = document.createElement("div"),
          message_228 = value_202.messages.length > 1 ? value_202.messages[value_202.messages.length - 2] : null;
        (!message_228 || timestamp_2 - (message_228.timestamp || 0) > 300000) && window.imChat.renderTimestamp(timestamp_2, element_227);
        window.imChat.renderMessageBubble ? window.imChat.renderMessageBubble(receiveMsg, value_202, element_227, timestamp_2) : window.imChat.renderPayTransferBubble(receiveMsg, value_202, element_227, timestamp_2);
        while (element_227.firstChild) {
          element_211.appendChild(element_227.firstChild);
        }
        window.imChat.scrollToBottom(element_211);
      } else {
        element_211.innerHTML = "";
        window.imChat.renderChatHistory(value_202, element_211);
        window.imChat.scrollToBottom(element_211);
      }
    }
    return true;
  }
  window.imChat.getGroupMemberFriends = getGroupMemberFriends_2;
  window.imChat.getCanonicalGroupMemberIds = getCanonicalGroupMemberIds_2;
  window.imChat.normalizeGroupSpeaker = normalizeGroupSpeaker_2;
  window.imChat.getGroupMessageSpeaker = getGroupMessageSpeaker_2;
  window.imChat.getSafeGroupSpeaker = getSafeGroupSpeaker_2;
  window.imChat.getDisplayNameByMemberId = getDisplayNameByMemberId_2;
  window.imChat.getAvailableGroupRecipients = getAvailableGroupRecipients_2;
  window.imChat.getCurrentUserPacketMember = getCurrentUserPacketMember_2;
  window.imChat.getAllRedPacketParticipants = getAllRedPacketParticipants_2;
  window.imChat.getPacketSenderDisplayMeta = getPacketSenderDisplayMeta_2;
  window.imChat.getCurrentUserClaimRecord = getCurrentUserClaimRecord_2;
  window.imChat.createRedPacketClaimNoticeText = createRedPacketClaimNoticeText_2;
  window.imChat.claimGroupRedPacketForMember = claimGroupRedPacketForMember_2;
  window.imChat.createRedPacketAllocations = createRedPacketAllocations_2;
  window.imChat.getRedPacketLuckiestMemberId = getRedPacketLuckiestMemberId_2;
  window.imChat.normalizeGroupRedPacketState = normalizeGroupRedPacketState_2;
  window.imChat.processPendingGroupRedPackets = processPendingGroupRedPackets_2;
  window.imChat.ensureRedPacketDetailOverlayForExistingPage = ensureRedPacketDetailOverlayForExistingPage_2;
  async function rejectIncomingTransfer_2(value_229, message_230, value_231 = {}) {
    if (!value_229 || !message_230 || message_230.claimed) return;
    if (message_230.payKind !== "char_to_user_pending" && message_230.payKind !== "user_to_char") return;
    const amount_4 = Number(message_230.amount) || 0,
      description_3 = message_230.description || "转账",
      payTransferMessage_11_234 = normalizePayTransferMessage_2(message_230, value_229),
      payerName_235 = payTransferMessage_11_234.payerName,
      payeeName_236 = payTransferMessage_11_234.payeeName,
      value_237 = message_230.payKind === "char_to_user_pending";
    if (amount_4 <= 0) return;
    const currentActiveFriend_238 = window.imData.currentActiveFriend,
      elementById_239 = document.getElementById("chat-interface-" + value_229.id),
      element_240 = elementById_239 ? elementById_239.querySelector(".ins-chat-messages") : null,
      value_241 = element_240 && message_230.id ? element_240.querySelector(".chat-row[data-message-id=\"" + message_230.id + "\"]") : null;
    !value_237 && typeof window.addPayTransaction === "function" && window.addPayTransaction(amount_4, description_3 + " · 转账退还 · " + payeeName_236, "income");
    const id_242 = message_230.id,
      rollbackSourceMessage_3 = JSON.parse(JSON.stringify(message_230));
    let updatedMsg_2 = null,
      rejectMsg = null,
      timestamp_3 = Date.now();
    value_237 ? rejectMsg = {
      id: window.imChat.createMessageId("pay"),
      role: "user",
      type: "pay_transfer",
      payKind: "user_rejected_from_char",
      payDirection: payTransferMessage_11_234.direction,
      amount: amount_4,
      description: description_3,
      payerName: payerName_235,
      payeeName: payeeName_236,
      senderName: payerName_235,
      receiverName: payeeName_236,
      targetName: payerName_235,
      cardTitle: "已退还",
      payStatus: "completed",
      content: "[已退还] " + description_3 + " ¥" + amount_4.toFixed(2),
      timestamp: timestamp_3,
      apiRunId: value_231.apiRunId || null,
      rollbackSourceMessage: rollbackSourceMessage_3
    } : (rejectMsg = {
      id: window.imChat.createMessageId("pay"),
      role: "assistant",
      type: "pay_transfer",
      payKind: "char_to_user_rejected",
      payDirection: payTransferMessage_11_234.direction,
      amount: amount_4,
      description: description_3,
      payerName: payerName_235,
      payeeName: payeeName_236,
      senderName: payerName_235,
      receiverName: payeeName_236,
      targetName: payerName_235,
      cardTitle: "已退还",
      payStatus: "completed",
      content: "[对方已退还] " + description_3 + " ¥" + amount_4.toFixed(2),
      timestamp: timestamp_3,
      apiRunId: value_231.apiRunId || null,
      rollbackSourceMessage: rollbackSourceMessage_3
    }, typeof value_231.cotSummary === "string" && value_231.cotSummary.trim() && (rejectMsg.cotSummary = value_231.cotSummary.trim()));
    window.imApp.captureGroupUserIdentity?.(value_229, rejectMsg);
    let saved_3 = false;
    if (window.imApp.updateFriendMessage && window.imApp.appendFriendMessage) {
      const value_248 = await window.imApp.updateFriendMessage(value_229.id, {
        id: id_242 || null,
        timestamp: message_230.timestamp || null
      }, message_249 => {
        if (!message_249) return;
        message_249.claimed = true;
        value_237 ? (message_249.payKind = "user_rejected_from_char", message_249.payDirection = payTransferMessage_11_234.direction, message_249.cardTitle = "已退还", message_249.targetName = payerName_235, message_249.payerName = payerName_235, message_249.payeeName = payeeName_236, message_249.senderName = payerName_235, message_249.receiverName = payeeName_236, message_249.content = "[转账已退还] " + description_3 + " ¥" + amount_4.toFixed(2)) : (message_249.payKind = "user_to_char_rejected", message_249.payDirection = payTransferMessage_11_234.direction, message_249.cardTitle = "已退还", message_249.targetName = payerName_235, message_249.payerName = payerName_235, message_249.payeeName = payeeName_236, message_249.senderName = payerName_235, message_249.receiverName = payeeName_236, message_249.content = "[转账已退还] " + description_3 + " ¥" + amount_4.toFixed(2));
        updatedMsg_2 = message_249;
      }, {
        silent: true
      });
      value_248 && (saved_3 = await window.imApp.appendFriendMessage(value_229.id, rejectMsg, {
        silent: true
      }));
    } else saved_3 = await commitPaymentFriendChange(value_229, value_250 => {
      const message_251 = Array.isArray(value_250.messages) ? value_250.messages.find(value_252 => value_252 && String(value_252.id) === String(id_242)) : null;
      if (!message_251) return;
      message_251.claimed = true;
      value_237 ? (message_251.payKind = "user_rejected_from_char", message_251.payDirection = payTransferMessage_11_234.direction, message_251.cardTitle = "已退还", message_251.targetName = payerName_235, message_251.payerName = payerName_235, message_251.payeeName = payeeName_236, message_251.senderName = payerName_235, message_251.receiverName = payeeName_236, message_251.content = "[转账已退还] " + description_3 + " ¥" + amount_4.toFixed(2)) : (message_251.payKind = "user_to_char_rejected", message_251.payDirection = payTransferMessage_11_234.direction, message_251.cardTitle = "已退还", message_251.targetName = payerName_235, message_251.payerName = payerName_235, message_251.payeeName = payeeName_236, message_251.senderName = payerName_235, message_251.receiverName = payeeName_236, message_251.content = "[转账已退还] " + description_3 + " ¥" + amount_4.toFixed(2));
      if (!value_250.messages) value_250.messages = [];
      value_250.messages.push(rejectMsg);
      updatedMsg_2 = message_251;
    }, {
      silent: true
    });
    if (!saved_3 || !updatedMsg_2 || !rejectMsg) {
      if (window.showToast) window.showToast("退还记录保存失败");
      return;
    }
    if (currentActiveFriend_238 && String(currentActiveFriend_238.id) === String(value_229.id) && element_240) {
      if (value_241) {
        const element_253 = document.createElement("div");
        window.imChat.renderPayTransferBubble(updatedMsg_2, value_229, element_253, updatedMsg_2.timestamp || timestamp_3);
        const chatRowElement_254 = element_253.querySelector(".chat-row");
        chatRowElement_254 && value_241.replaceWith(chatRowElement_254);
        const element_255 = document.createElement("div"),
          message_256 = value_229.messages.length > 1 ? value_229.messages[value_229.messages.length - 2] : null;
        (!message_256 || timestamp_3 - (message_256.timestamp || 0) > 300000) && window.imChat.renderTimestamp(timestamp_3, element_255);
        window.imChat.renderMessageBubble ? window.imChat.renderMessageBubble(rejectMsg, value_229, element_255, timestamp_3) : window.imChat.renderPayTransferBubble(rejectMsg, value_229, element_255, timestamp_3);
        while (element_255.firstChild) {
          element_240.appendChild(element_255.firstChild);
        }
        window.imChat.scrollToBottom(element_240);
      } else {
        element_240.innerHTML = "";
        window.imChat.renderChatHistory(value_229, element_240);
        window.imChat.scrollToBottom(element_240);
      }
    }
    return true;
  }
  window.imChat.ensureTransferDetailOverlayForExistingPage = ensureTransferDetailOverlayForExistingPage_2;
  window.imChat.claimIncomingTransfer = claimIncomingTransfer_2;
  window.imChat.rejectIncomingTransfer = rejectIncomingTransfer_2;
});
