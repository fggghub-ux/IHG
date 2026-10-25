(function initChatFavorites(global) {
    'use strict';

    const imChat_2 = (global.imChat = global.imChat || {});
    function normalizeReason(value_2) {
        return String(value_2 || '').trim();
    }
    function getFavoriteMessageText_2(apk119Value11 = {}) {
  if (!apk119Value11 || apk119Value11.role !== "user") return "";
  if (apk119Value11.type === "file") return global.imChat.formatFileForContext(apk119Value11);
  if (apk119Value11.type === "voice_message") return String(apk119Value11.transcript || apk119Value11.text || "").trim();
  if (apk119Value11.type && apk119Value11.type !== "text") return "";
  return String(apk119Value11.content || apk119Value11.text || "").trim();
}
    function buildFavoriteCandidate_2(apk119Value12, apk119Value13 = {}) {
  if (!apk119Value12 || apk119Value12.type !== "char" || apk119Value13.continueWithoutUser) return null;
  const apk119Value14 = String(apk119Value13.source || "").trim();
  if (apk119Value14 && apk119Value14 !== "regenerate") return null;
  const apk119Value15 = Array.isArray(apk119Value12.messages) ? apk119Value12.messages : [],
    apk119Value16 = apk119Value15.slice().reverse().find(apk119Value20 => apk119Value20 && (apk119Value20.role === "user" || apk119Value20.role === "assistant"));
  if (!apk119Value16 || apk119Value16.role !== "user") return null;
  const apk119Value17 = String(apk119Value16.id || "").trim(),
    apk119Value18 = getFavoriteMessageText_2(apk119Value16);
  if (!apk119Value17 || !apk119Value18) return null;
  const apk119Value19 = global.imApp?.["normalizeFavoriteUserMessages"] ? global.imApp.normalizeFavoriteUserMessages(apk119Value12.favoriteUserMessages) : Array.isArray(apk119Value12.favoriteUserMessages) ? apk119Value12.favoriteUserMessages : [];
  if (apk119Value19.some(apk119Value21 => String(apk119Value21?.["messageId"] || "") === apk119Value17)) return null;
  return {
    messageId: apk119Value17,
    messageText: apk119Value18,
    messageType: apk119Value16.type === "file" ? "file" : apk119Value16.type === "voice_message" ? "voice_message" : "text",
    ...(apk119Value16.type === "file" ? {
      fileData: global.imChat.normalizeFileData(apk119Value16.fileData)
    } : {}),
    messageTimestamp: Math.max(0, Number(apk119Value16.timestamp) || 0)
  };
}
    function parseFavoriteSelection_2(apk119Value22, apk119Value23, apk119Value24, apk119Value25 = Date.now()) {
  if (!apk119Value23 || !apk119Value22) return null;
  let apk119Value26 = apk119Value22;
  if (typeof apk119Value22 === "string") try {
    apk119Value26 = JSON.parse(apk119Value22);
  } catch (apk119Value29) {
    return null;
  }
  if (!apk119Value26 || typeof apk119Value26 !== "object" || Array.isArray(apk119Value26)) return null;
  if (String(apk119Value26.messageId || "").trim() !== String(apk119Value23.messageId || "")) return null;
  const apk119Value27 = normalizeReason(apk119Value26.reason);
  if (!apk119Value27) return null;
  const apk119Value28 = Math.max(0, Number(apk119Value25) || Date.now());
  return {
    id: "favorite-" + apk119Value23.messageId + "-" + apk119Value28,
    messageId: String(apk119Value23.messageId),
    messageText: String(apk119Value23.messageText || "").trim(),
    messageType: apk119Value23.messageType === "file" ? "file" : apk119Value23.messageType === "voice_message" ? "voice_message" : "text",
    ...(apk119Value23.messageType === "file" ? {
      fileData: global.imChat.normalizeFileData(apk119Value23.fileData)
    } : {}),
    messageTimestamp: Math.max(0, Number(apk119Value23.messageTimestamp) || 0),
    reason: apk119Value27,
    createdAt: apk119Value28,
    sourceApiRunId: String(apk119Value24 || "")
  };
}
    async function commitFavoriteUserMessage_2(friendOrId, favorite) {
        if (!favorite || !global.imApp?.commitScopedFriendChange) return false;
        let inserted = false;
        const saved = await global.imApp.commitScopedFriendChange(
            friendOrId,
            (targetFriend) => {
                if (!targetFriend || targetFriend.type !== 'char') return;
                const favorites = global.imApp.normalizeFavoriteUserMessages(
                    targetFriend.favoriteUserMessages,
                );
                if (favorites.some((item_2) => item_2.messageId === favorite.messageId)) return;
                targetFriend.favoriteUserMessages = global.imApp.normalizeFavoriteUserMessages([
                    favorite,
                    ...favorites,
                ]);
                inserted = true;
            },
            {
                syncActive: true,
                syncSettings: true,
                metaOnly: true,
                silent: true,
                immediate: true,
            },
        );
        return !!saved && inserted;
    }
    async function removeFavoriteUserMessage_2(value_26, favoriteId) {
        if (!favoriteId || !global.imApp?.commitScopedFriendChange) return false;
        let removed_2 = false;
        const value_27 = await global.imApp.commitScopedFriendChange(
            value_26,
            (targetFriend_2) => {
                if (!targetFriend_2) return;
                const favorites_3 = global.imApp.normalizeFavoriteUserMessages(
                        targetFriend_2.favoriteUserMessages,
                    ),
                    favoriteUserMessages_2 = favorites_3.filter(
                        (item_3) => String(item_3.id) !== String(favoriteId),
                    );
                removed_2 = favoriteUserMessages_2.length !== favorites_3.length;
                targetFriend_2.favoriteUserMessages = favoriteUserMessages_2;
            },
            {
                syncActive: true,
                syncSettings: true,
                metaOnly: true,
                silent: true,
                immediate: true,
            },
        );
        return !!value_27 && removed_2;
    }
    function showFavoriteSavedNotice_2(friend_3, value_33, sourceApiRunId_2 = '') {
        if (!friend_3 || typeof document === 'undefined') return false;
        const activeFriend = global.imData?.currentActiveFriend;
        if (!activeFriend || String(activeFriend.id) !== String(friend_3.id)) return false;
        const messageContainer =
            value_33 ||
            document.querySelector('#chat-interface-' + friend_3.id + ' .ins-chat-messages');
        if (!messageContainer) return false;
        messageContainer
            .querySelectorAll('.favorite-saved-narration')
            .forEach((row) => row.remove());
        const row_2 = document.createElement('div');
        row_2.className = 'chat-row memory-recall-narration favorite-saved-narration';
        row_2.dataset.friendId = String(friend_3.id);
        row_2.dataset.transient = 'true';
        row_2.dataset.apiRunId = String(sourceApiRunId_2 || '');
        const element_37 = document.createElement('span');
        element_37.className = 'memory-recall-narration-pill favorite-saved-narration-pill';
        element_37.textContent = '收藏了一些话';
        row_2.appendChild(element_37);
        if (
            imChat_2.attachNoticeDeleteButton?.(row_2, friend_3, null, {
                key: 'favorite:' + sourceApiRunId_2,
            }) === false
        )
            return false;
        messageContainer.appendChild(row_2);
        if (global.imChat?.scrollToBottom) global.imChat.scrollToBottom(messageContainer);
        return true;
    }
    imChat_2.normalizeFavoriteReason = normalizeReason;
    imChat_2.getFavoriteMessageText = getFavoriteMessageText_2;
    imChat_2.buildFavoriteCandidate = buildFavoriteCandidate_2;
    imChat_2.parseFavoriteSelection = parseFavoriteSelection_2;
    imChat_2.commitFavoriteUserMessage = commitFavoriteUserMessage_2;
    imChat_2.removeFavoriteUserMessage = removeFavoriteUserMessage_2;
    imChat_2.showFavoriteSavedNotice = showFavoriteSavedNotice_2;
    if (typeof document === 'undefined') return;
    (
        window.u2OnStorageReady ||
        ((callback) => document.addEventListener('DOMContentLoaded', callback))
    )(() => {
        const openButton = document.getElementById('chat-settings-favorites-btn'),
            view = document.getElementById('chat-favorites-view'),
            backButton = document.getElementById('chat-favorites-back'),
            title_2 = document.getElementById('chat-favorites-title'),
            list = document.getElementById('chat-favorites-list');
        if (!openButton || !view || !backButton || !title_2 || !list) return;
        let favoritesFriendId = '';
        function getLiveFriend() {
            if (!favoritesFriendId) return null;
            return global.imApp?.getFriendById
                ? global.imApp.getFriendById(favoritesFriendId)
                : (global.imData?.friends || []).find(
                      (friend) => String(friend.id) === favoritesFriendId,
                  ) || null;
        }
        function formatTime_2(timestamp) {
            const value = Number(timestamp);
            if (!Number.isFinite(value) || value <= 0) return '';
            if (global.imApp?.formatTime_2) return global.imApp.formatTime_2(value);
            return window.imDataUtils?.formatUsDateTime
                ? window.imDataUtils.formatUsDateTime(value)
                : new Date(value).toLocaleString('en-US', { hour12: true });
        }
        function renderFavorites() {
            const friend_4 = getLiveFriend();
            list.replaceChildren();
            if (!friend_4) return;
            const favorites_4 = global.imApp?.normalizeFavoriteUserMessages
                ? global.imApp.normalizeFavoriteUserMessages(friend_4.favoriteUserMessages)
                : [];
            if (favorites_4.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'chat-favorites-empty';
                const icon = document.createElement('i');
                icon.className = 'far fa-star';
                icon.setAttribute('aria-hidden', 'true');
                const text_2 = document.createElement('span');
                text_2.textContent = '还没有收藏的消息';
                empty.append(icon, text_2);
                list.appendChild(empty);
                return;
            }
            const documentFragment = document.createDocumentFragment();
            favorites_4.forEach((favorite_2) => {
                const card = document.createElement('article');
                card.className = 'chat-favorite-card';
                const header = document.createElement('div');
                header.className = 'chat-favorite-card-header';
                const label = document.createElement('strong');
                label.textContent =
                    favorite_2.messageType === 'file' ? 'User 的文件' : favorite_2.messageType === 'voice_message' ? 'User 的语音' : 'User 的消息';
                const element_50 = document.createElement('span');
                element_50.textContent = formatTime_2(favorite_2.messageTimestamp);
                header.append(label, element_50);
                const quote = document.createElement('blockquote');
                quote.className = 'chat-favorite-message';
                quote.textContent = favorite_2.messageText;
                const reason_3 = document.createElement('div');
                reason_3.className = 'chat-favorite-reason';
                const reasonLabel = document.createElement('span');
                reasonLabel.textContent = '收藏原因';
                const reasonText = document.createElement('p');
                reasonText.textContent = favorite_2.reason;
                reason_3.append(reasonLabel, reasonText);
                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.className = 'chat-favorite-remove';
                removeButton.setAttribute('aria-label', '移除这条收藏');
                removeButton.textContent = '×';
                removeButton.addEventListener('click', () => {
                    const onConfirm_2 = async () => {
                        removeButton.disabled = true;
                        const removed = await removeFavoriteUserMessage_2(
                            getLiveFriend() || friend_4,
                            favorite_2.id,
                        );
                        if (!removed && global.showToast) global.showToast('移除收藏失败');
                        renderFavorites();
                    };
                    global.showCustomModal
                        ? global.showCustomModal({
                              title: '移除收藏',
                              message: '只会移除收藏，不会删除原聊天消息。',
                              isDestructive: true,
                              confirmText: '移除',
                              onConfirm: onConfirm_2,
                          })
                        : void onConfirm_2();
                });
                card.append(header, quote, reason_3, removeButton);
                if (favorite_2.messageType === 'file' && favorite_2.fileData) {
                    const fileCard = document.createElement('button');
                    fileCard.type = 'button'; fileCard.className = 'im-file-card';
                    fileCard.innerHTML = global.imChat.buildFileCardHtml(favorite_2);
                    fileCard.addEventListener('click', () => global.imChat.openFileDetail(favorite_2));
                    card.appendChild(fileCard);
                }
                documentFragment.appendChild(card);
            });
            list.appendChild(documentFragment);
        }
        function closeFavorites() {
            if (global.closeView) global.closeView(view);
            else view.classList.remove('active');
            favoritesFriendId = '';
            list.replaceChildren();
        }
        openButton.addEventListener('click', () => {
            const friend_5 = global.imData?.currentSettingsFriend;
            if (!friend_5 || friend_5.type !== 'char') return;
            favoritesFriendId = String(friend_5.id);
            title_2.textContent = (friend_5.nickname || friend_5.realName || 'Char') + ' 的收藏';
            renderFavorites();
            if (global.openView) global.openView(view);
            else view.classList.add('active');
        });
        backButton.addEventListener('click', closeFavorites);
    });
})(typeof window !== 'undefined' ? window : globalThis);
