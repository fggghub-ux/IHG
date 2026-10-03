(function initChatHistorySearch(global) {
    'use strict';

    const imChat_2 = (global.imChat = global.imChat || {});
    function stripChatSearchHtml_2(value_3) {
        const source = String(value_3 == null ? '' : value_3);
        if (!source) return '';
        if (typeof document !== 'undefined' && document.createElement) {
            const holder = document.createElement('div');
            return (
                (holder.innerHTML = source),
                holder.querySelectorAll('script,style').forEach((node) => node.remove()),
                String(holder.textContent || holder.innerText || '')
                    .replace(/\s+/g, ' ')
                    .trim()
            );
        }
        return source
            .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')
            .replace(/&quot;/gi, '"')
            .replace(/&#0?39;/gi, "'")
            .replace(/\s+/g, ' ')
            .trim();
    }
    function pushText(parts, value_4, options = {}) {
        if (value_4 == null) return;
        const text_2 = options.html
            ? stripChatSearchHtml_2(value_4)
            : String(value_4).replace(/\s+/g, ' ').trim();
        if (!text_2 || parts.includes(text_2)) return;
        parts.push(text_2);
    }
    function pushMessageListText(parts_2, messages_2) {
        if (!Array.isArray(messages_2)) return;
        messages_2.forEach((item) => {
            if (!item || typeof item !== 'object') return;
            pushText(parts_2, item.speaker || item.senderName || item.roleName);
            pushText(parts_2, item.text || item.content);
        });
    }
    function parseMomentText(parts_3, content_2) {
        if (!content_2 || typeof content_2 !== 'string') return;
        try {
            const moment = JSON.parse(content_2);
            if (!moment || typeof moment !== 'object') return;
            pushText(
                parts_3,
                moment.authorName ||
                    moment.nickname ||
                    moment.userName ||
                    moment.author?.name ||
                    moment.author?.nickname,
            );
            pushText(
                parts_3,
                moment.text || moment.caption || moment.description || moment.content,
            );
        } catch (error_2) {}
    }
    function extractSearchableMessageText_2(message_2 = {}) {
        if (!message_2 || typeof message_2 !== 'object') return '';
        const parts_4 = [],
            type_2 = String(message_2.type || '').trim();
        pushText(parts_4, message_2.replyTo);
        pushText(parts_4, message_2.translation);
        switch (type_2) {
            case 'voice_message':
                pushText(parts_4, message_2.transcript || message_2.text);
                break;
            case 'image':
                pushText(parts_4, message_2.text || message_2.description || message_2.caption);
                break;
            case 'location':
                pushText(parts_4, message_2.locationName || message_2.name);
                pushText(parts_4, message_2.locationNameTranslation || message_2.nameTranslation);
                pushText(parts_4, message_2.locationAddress || message_2.address);
                pushText(
                    parts_4,
                    message_2.locationAddressTranslation || message_2.addressTranslation,
                );
                break;
            case 'sticker':
                pushText(parts_4, message_2.stickerName || message_2.text);
                break;
            case 'fake_link':
                pushText(parts_4, message_2.fakeLinkData?.siteName);
                pushText(
                    parts_4,
                    message_2.fakeLinkData?.title || message_2.title || message_2.linkTitle,
                );
                pushText(
                    parts_4,
                    message_2.fakeLinkData?.summary ||
                        message_2.fakeLinkData?.description ||
                        message_2.description ||
                        message_2.linkDescription,
                );
                pushText(parts_4, message_2.fakeLinkData?.bodyText);
                pushText(
                    parts_4,
                    message_2.fakeLinkData?.displayUrl ||
                        message_2.displayUrl ||
                        message_2.domain ||
                        message_2.urlLabel,
                );
                break;
            case 'pay_transfer':
            case 'group_red_packet':
                pushText(parts_4, message_2.paymentAction);
                pushText(parts_4, message_2.cardTitle || message_2.title);
                pushText(parts_4, message_2.description);
                pushText(parts_4, message_2.amount);
                pushText(parts_4, message_2.payerName || message_2.senderName);
                pushText(
                    parts_4,
                    message_2.payeeName || message_2.receiverName || message_2.targetName,
                );
                pushText(parts_4, message_2.statusText);
                if (type_2 === 'group_red_packet') pushText(parts_4, message_2.totalAmount);
                break;
            case 'system_notice':
                pushText(parts_4, message_2.text || message_2.content);
                break;
            case 'voice_call_record':
                pushText(parts_4, message_2.isVideo ? '视频通话' : '语音通话');
                pushText(parts_4, message_2.title);
                pushText(parts_4, message_2.statusText);
                pushText(parts_4, message_2.summary);
                pushMessageListText(parts_4, message_2.messages || message_2.callMessages);
                break;
            case 'offline_meeting_record':
                pushText(parts_4, message_2.title);
                pushText(parts_4, message_2.summary || message_2.rawSummary || message_2.content);
                pushText(parts_4, message_2.dateText);
                pushMessageListText(parts_4, message_2.meetingMessages);
                break;
            case 'moment_forward':
                parseMomentText(parts_4, message_2.content);
                break;
            case 'group_poll':
                pushText(parts_4, message_2.pollQuestion);
                (Array.isArray(message_2.pollOptions) ? message_2.pollOptions : []).forEach(
                    (value_21) => {
                        pushText(parts_4, value_21?.text);
                    },
                );
                break;
            case 'chat_record_forward':
                pushText(parts_4, message_2.record?.title);
                pushText(parts_4, message_2.record?.sourceName);
                (Array.isArray(message_2.record?.entries) ? message_2.record.entries : []).forEach(
                    (message_22) => {
                        pushText(parts_4, message_22?.senderName);
                        pushText(
                            parts_4,
                            message_22?.text || message_22?.preview || message_22?.content,
                        );
                    },
                );
                break;
            case 'contact_card':
                pushText(parts_4, message_2.contactName || message_2.name || message_2.title);
                pushText(parts_4, message_2.contactRealName);
                pushText(
                    parts_4,
                    message_2.contactSignature || message_2.description || message_2.text,
                );
                break;
            case 'together_listening_invite':
                pushText(parts_4, message_2.title || message_2.songName);
                pushText(
                    parts_4,
                    message_2.artist || message_2.artistName || message_2.description,
                );
                break;
            case 'html':
                pushText(parts_4, message_2.content || message_2.text, {
                    html: true,
                });
                break;
            default:
                (message_2.role === 'user' || message_2.role === 'assistant') &&
                    pushText(parts_4, message_2.content || message_2.text);
                break;
        }
        return parts_4.join(' · ');
    }
    function getMessageTypeLabel(message_3 = {}) {
        const labels = {
            voice_message: '语音',
            image: '图片',
            location: '定位',
            sticker: '表情',
            fake_link: '链接',
            pay_transfer: '转账',
            group_red_packet: '红包',
            system_notice: '系统提示',
            voice_call_record: '通话',
            offline_meeting_record: '见面记录',
            moment_forward: '朋友圈',
            group_poll: '群投票',
            chat_record_forward: '聊天记录',
            contact_card: '联系人',
            together_listening_invite: '一起听',
            html: '卡片',
        };
        return labels[message_3.type] || '消息';
    }
    function getSearchSenderName_2(value_25, message_26 = {}) {
        if (message_26.role === 'user') {
            if (value_25?.type === 'group') {
                const messageUserIdentity = global.imApp?.getMessageUserIdentity?.(
                        value_25,
                        message_26,
                    ),
                    value_27 =
                        messageUserIdentity?.name ||
                        messageUserIdentity?.realName ||
                        messageUserIdentity?.nickname;
                return value_27 ? value_27 + '（我）' : '我';
            }
            return '我';
        }
        if (message_26.role !== 'assistant') return '系统';
        if (value_25?.type === 'group') {
            const groupMessageSpeaker = imChat_2.getGroupMessageSpeaker?.(value_25, message_26);
            return (
                groupMessageSpeaker?.nickname ||
                groupMessageSpeaker?.realName ||
                message_26.speaker ||
                message_26.senderName ||
                '群成员'
            );
        }
        return value_25?.nickname || value_25?.realName || 'Char';
    }
    function searchFriendMessages_2(friend_2, query) {
        const keyword = String(query == null ? '' : query).trim();
        if (!friend_2 || !keyword) return [];
        const normalizedKeyword = keyword.toLocaleLowerCase(),
            messages_3 = Array.isArray(friend_2.messages) ? friend_2.messages : [],
            results = [];
        for (let index_2 = messages_3.length - 1; index_2 >= 0; index_2 -= 1) {
            const message_4 = messages_3[index_2],
                text_3 = extractSearchableMessageText_2(message_4);
            if (!text_3) continue;
            const matchIndex_2 = text_3.toLocaleLowerCase().indexOf(normalizedKeyword);
            if (matchIndex_2 < 0) continue;
            results.push({
                message: message_4,
                index: index_2,
                text: text_3,
                matchIndex: matchIndex_2,
                typeLabel: getMessageTypeLabel(message_4),
            });
        }
        return results;
    }
    function resolveSearchMessageIndex_2(friend_3, descriptor = {}) {
        const messages_4 = Array.isArray(friend_3?.messages) ? friend_3.messages : [],
            id_2 = descriptor.id == null ? '' : String(descriptor.id),
            timestamp_2 = descriptor.timestamp == null ? '' : String(descriptor.timestamp);
        if (id_2) {
            const byId = messages_4.findIndex((message_5) => String(message_5?.id || '') === id_2);
            if (byId >= 0) return byId;
        }
        if (timestamp_2) {
            const byTimestamp = messages_4.findIndex(
                (message_6) =>
                    String(message_6?.timestamp || '') === timestamp_2 &&
                    (!descriptor.text ||
                        extractSearchableMessageText_2(message_6) === descriptor.text),
            );
            if (byTimestamp >= 0) return byTimestamp;
        }
        const index_3 = Number(descriptor.index);
        if (Number.isInteger(index_3) && index_3 >= 0 && index_3 < messages_4.length) {
            const candidateText = extractSearchableMessageText_2(messages_4[index_3]);
            if (!descriptor.text || candidateText === descriptor.text) return index_3;
        }
        return -1;
    }
    function findRenderedMessageRow(container, message_7, descriptor_2 = {}) {
        const rows = Array.from(container?.querySelectorAll?.('.chat-row') || []),
            id_3 = String(message_7?.id || descriptor_2.id || ''),
            timestamp_3 = String(message_7?.timestamp || descriptor_2.timestamp || '');
        if (id_3) {
            const byId_2 = rows.find(
                (row_2) => String(row_2.getAttribute('data-message-id') || '') === id_3,
            );
            if (byId_2) return byId_2;
        }
        if (timestamp_3)
            return (
                rows.find(
                    (row_3) => String(row_3.getAttribute('data-timestamp') || '') === timestamp_3,
                ) || null
            );
        return null;
    }
    function centerSearchMessageRow_2(container_2, value_55) {
        if (!container_2 || !value_55) return;
        const containerRect = container_2.getBoundingClientRect(),
            rowRect = value_55.getBoundingClientRect(),
            rowOffsetInsideContainer = rowRect.top - containerRect.top,
            centeredScrollTop =
                container_2.scrollTop +
                rowOffsetInsideContainer -
                Math.max(0, (container_2.clientHeight - rowRect.height) / 2);
        container_2.scrollTop = Math.max(0, centeredScrollTop);
    }
    function revealChatMessage_2(friendOrId, descriptor_3 = {}) {
        const friend_4 = global.imApp?.getFriendById
            ? global.imApp.getFriendById(friendOrId)
            : typeof friendOrId === 'object'
              ? friendOrId
              : null;
        if (!friend_4 || friend_4.type === 'npc' || friend_4.type === 'official')
            return {
                ok: false,
                reason: 'friend',
            };
        const index_4 = resolveSearchMessageIndex_2(friend_4, descriptor_3);
        if (index_4 < 0)
            return {
                ok: false,
                reason: 'missing',
            };
        const page =
                typeof document !== 'undefined'
                    ? document.getElementById('chat-interface-' + friend_4.id)
                    : null,
            container_3 = page?.querySelector('.ins-chat-messages');
        if (!page || !container_3 || typeof imChat_2.renderChatHistory !== 'function')
            return {
                ok: false,
                reason: 'view',
            };
        const previousStartIndex = Number(container_3._imHistoryState?.visibleStartIndex),
            number_65 = Number(container_3._imHistoryState?.visibleEndIndex),
            scrollTop_2 = container_3.scrollTop;
        container_3.innerHTML = '';
        imChat_2.renderChatHistory(friend_4, container_3, {
            startIndex: Math.max(0, index_4 - 4),
            endIndex: Math.min(friend_4.messages.length, index_4 + 61),
            scroll: false,
        });
        const value_67 = friend_4.messages[index_4],
            row_4 = findRenderedMessageRow(container_3, value_67, descriptor_3);
        if (!row_4)
            return (
                (container_3.innerHTML = ''),
                imChat_2.renderChatHistory(friend_4, container_3, {
                    startIndex: Number.isFinite(previousStartIndex)
                        ? previousStartIndex
                        : undefined,
                    endIndex: Number.isFinite(number_65) ? number_65 : undefined,
                    scroll: false,
                }),
                (container_3.scrollTop = scrollTop_2),
                {
                    ok: false,
                    reason: 'row',
                }
            );
        return (
            container_3
                .querySelectorAll('.chat-search-target')
                .forEach((item_2) => item_2.classList.remove('chat-search-target')),
            row_4.classList.add('chat-search-target'),
            centerSearchMessageRow_2(container_3, row_4),
            global.setTimeout(() => row_4.classList.remove('chat-search-target'), 2200),
            {
                ok: true,
                friend: friend_4,
                message: value_67,
                index: index_4,
                row: row_4,
            }
        );
    }
    imChat_2.stripChatSearchHtml = stripChatSearchHtml_2;
    imChat_2.extractSearchableMessageText = extractSearchableMessageText_2;
    imChat_2.searchFriendMessages = searchFriendMessages_2;
    imChat_2.getSearchSenderName = getSearchSenderName_2;
    imChat_2.resolveSearchMessageIndex = resolveSearchMessageIndex_2;
    imChat_2.centerSearchMessageRow = centerSearchMessageRow_2;
    imChat_2.revealChatMessage = revealChatMessage_2;
    if (typeof document === 'undefined') return;
    (
        window.u2OnStorageReady ||
        ((callback) => document.addEventListener('DOMContentLoaded', callback))
    )(() => {
        const searchButton = document.getElementById('chat-settings-search-btn'),
            searchView = document.getElementById('chat-history-search-view'),
            backButton = document.getElementById('chat-history-search-back'),
            title_2 = document.getElementById('chat-history-search-title'),
            input = document.getElementById('chat-history-search-input'),
            status = document.getElementById('chat-history-search-status'),
            resultsEl = document.getElementById('chat-history-search-results'),
            backButton_2 = document.getElementById('chat-history-search-more');
        if (
            !searchButton ||
            !searchView ||
            !backButton ||
            !title_2 ||
            !input ||
            !status ||
            !resultsEl ||
            !backButton_2
        )
            return;
        let searchFriendId = '',
            items_70 = [],
            items_71 = [],
            count = 0,
            query_3 = '',
            text_73 = 'idle',
            count_74 = 0,
            count_75 = 0,
            count_76 = 0,
            enabled = false;
        const count_77 = 250,
            count_78 = 60;
        global.mobileInputCompat?.registerFocusScope?.({
            selector: '#chat-history-search-view',
            preferFocusScope: true,
        });
        function getLiveSearchFriend() {
            if (!searchFriendId) return null;
            return global.imApp?.getFriendById
                ? global.imApp.getFriendById(searchFriendId)
                : (global.imData?.friends || []).find(
                      (friend_5) => String(friend_5.id) === searchFriendId,
                  ) || null;
        }
        function resetSearchView() {
            if (count_76) global.clearTimeout(count_76);
            count_76 = 0;
            count_75 += 1;
            count_74 += 1;
            input.value = '';
            resultsEl.replaceChildren();
            backButton_2.hidden = true;
            status.textContent = '输入关键词，搜索全部聊天记录';
            status.className = 'chat-history-search-status is-empty';
            searchFriendId = '';
            items_70 = [];
            items_71 = [];
            count = 0;
            query_3 = '';
            text_73 = 'idle';
            enabled = false;
            input.disabled = false;
        }
        function closeSearchView() {
            input.blur();
            if (global.closeView) global.closeView(searchView);
            else searchView.classList.remove('active');
            resetSearchView();
        }
        function appendHighlightedText(container_4, value_91, value_92) {
            const source_2 = String(value_91 || ''),
                keyword_2 = String(value_92 || ''),
                normalizedSource = source_2.toLocaleLowerCase(),
                normalizedKeyword_2 = keyword_2.toLocaleLowerCase();
            let cursor = 0,
                matchAt = normalizedSource.indexOf(normalizedKeyword_2);
            while (normalizedKeyword_2 && matchAt >= 0) {
                if (matchAt > cursor)
                    container_4.appendChild(
                        document.createTextNode(source_2.slice(cursor, matchAt)),
                    );
                const mark = document.createElement('mark');
                mark.textContent = source_2.slice(matchAt, matchAt + keyword_2.length);
                container_4.appendChild(mark);
                cursor = matchAt + keyword_2.length;
                matchAt = normalizedSource.indexOf(normalizedKeyword_2, cursor);
            }
            if (cursor < source_2.length)
                container_4.appendChild(document.createTextNode(source_2.slice(cursor)));
        }
        function buildExcerpt(result_2, query_2) {
            const radius = 46,
                start = Math.max(0, result_2.matchIndex - radius),
                end = Math.min(result_2.text.length, result_2.matchIndex + query_2.length + radius);
            return (
                '' +
                (start > 0 ? '…' : '') +
                result_2.text.slice(start, end) +
                (end < result_2.text.length ? '…' : '')
            );
        }
        function formatResultTime(timestamp_4) {
            const value_5 = Number(timestamp_4);
            if (!Number.isFinite(value_5) || value_5 <= 0) return '';
            if (global.imApp?.formatTime) return global.imApp.formatTime(value_5);
            return new Date(value_5).toLocaleString();
        }
        function handleAction_81() {
            return new Promise((value_107) => global.setTimeout(value_107, 0));
        }
        function handleAction_82() {
            return new Promise((value_108) => {
                global.requestAnimationFrame
                    ? global.requestAnimationFrame(() => global.setTimeout(value_108, 0))
                    : global.setTimeout(value_108, 0);
            });
        }
        async function findRenderedMessageRow_2(value_109, result_3, value_111) {
            const message_8 = result_3.message || {},
                descriptor_4 = {
                    id: message_8.id || null,
                    timestamp: message_8.timestamp || null,
                    index: result_3.index,
                    text: result_3.text,
                },
                value_114 = count_74,
                value_115 = count_75;
            input.blur();
            value_111.disabled = true;
            status.textContent = '正在载入并定位这条消息…';
            status.className = 'chat-history-search-status';
            await handleAction_82();
            if (value_114 !== count_74 || value_115 !== count_75) return;
            let value_116 = getLiveSearchFriend() || value_109;
            try {
                global.imApp?.ensureFriendMessagesLoaded &&
                    (await global.imApp.ensureFriendMessagesLoaded(value_116, {
                        requireComplete: true,
                    }));
                if (value_114 !== count_74 || value_115 !== count_75) return;
                value_116 = getLiveSearchFriend() || value_116;
            } catch (value_118) {
                if (value_114 !== count_74 || value_115 !== count_75) return;
                console.error('Failed to load full conversation for search result', value_118);
                value_111.disabled = false;
                status.textContent = '完整聊天记录读取失败，可再次点击结果重试';
                status.className = 'chat-history-search-status is-error';
                global.showToast?.('聊天记录读取失败，请重试');
                return;
            }
            const handleAction_10_117 = revealChatMessage_2(value_116, descriptor_4);
            if (!handleAction_10_117.ok) {
                value_111.disabled = false;
                global.showToast?.(
                    handleAction_10_117.reason === 'missing'
                        ? '这条消息已不存在'
                        : '暂时无法定位这条消息',
                );
                return;
            }
            const settingsSheet = document.getElementById(
                value_109.type === 'group' ? 'group-details-sheet' : 'chat-settings-sheet',
            );
            if (global.closeView) {
                global.closeView(searchView);
                if (settingsSheet) global.closeView(settingsSheet);
            } else {
                searchView.classList.remove('active');
                settingsSheet?.classList.remove('active');
            }
            resetSearchView();
        }
        function handleClick() {
            const container_5 = getLiveSearchFriend();
            if (!container_5 || !query_3) return;
            const min_119 = Math.min(items_71.length, count + count_78),
                fragment = document.createDocumentFragment();
            for (let value_121 = count; value_121 < min_119; value_121 += 1) {
                const result_4 = items_71[value_121],
                    message_9 = result_4.message || {},
                    item_3 = document.createElement('button');
                item_3.type = 'button';
                item_3.className = 'chat-history-search-result';
                item_3.setAttribute('role', 'listitem');
                const heading = document.createElement('div');
                heading.className = 'chat-history-search-result-heading';
                const sender = document.createElement('strong');
                sender.textContent = getSearchSenderName_2(container_5, message_9);
                const meta = document.createElement('span'),
                    time = formatResultTime(message_9.timestamp);
                meta.textContent = '' + result_4.typeLabel + (time ? ' · ' + time : '');
                heading.append(sender, meta);
                const excerpt = document.createElement('div');
                excerpt.className = 'chat-history-search-result-text';
                appendHighlightedText(excerpt, buildExcerpt(result_4, query_3), query_3);
                item_3.append(heading, excerpt);
                item_3.addEventListener(
                    'click',
                    () => void findRenderedMessageRow_2(container_5, result_4, item_3),
                );
                fragment.appendChild(item_3);
            }
            resultsEl.appendChild(fragment);
            count = min_119;
            const value_120 = items_71.length - count;
            backButton_2.hidden = value_120 <= 0;
            if (value_120 > 0)
                backButton_2.textContent = '显示更多结果（剩余 ' + value_120 + ' 条）';
        }
        async function handleAction_85(value_130, value_131) {
            const toLocaleLowerCase_132 = value_131.toLocaleLowerCase(),
                items_133 = [];
            for (let length_134 = items_70.length; length_134 > 0; length_134 -= count_77) {
                if (value_130 !== count_75) return;
                const max_135 = Math.max(0, length_134 - count_77);
                for (let index_5 = length_134 - 1; index_5 >= max_135; index_5 -= 1) {
                    const value_137 = items_70[index_5];
                    if (!value_137) continue;
                    const matchIndex_3 = value_137.lowerText.indexOf(toLocaleLowerCase_132);
                    matchIndex_3 >= 0 &&
                        items_133.push({
                            message: value_137.message,
                            index: index_5,
                            text: value_137.text,
                            matchIndex: matchIndex_3,
                            typeLabel: value_137.typeLabel,
                        });
                }
                if (max_135 > 0) await handleAction_81();
            }
            if (value_130 !== count_75) return;
            items_71 = items_133;
            query_3 = value_131;
            if (items_133.length === 0) {
                status.textContent = '没有找到“' + value_131 + '”';
                status.className = 'chat-history-search-status is-empty';
                return;
            }
            status.textContent = items_133.length + ' 条结果';
            status.className = 'chat-history-search-status';
            handleClick();
        }
        function handleAction_86(value_139 = {}) {
            if (count_76) global.clearTimeout(count_76);
            count_76 = 0;
            const value_140 = ++count_75,
                trim_141 = input.value.trim();
            items_71 = [];
            count = 0;
            query_3 = '';
            resultsEl.replaceChildren();
            resultsEl.scrollTop = 0;
            backButton_2.hidden = true;
            if (!getLiveSearchFriend()) return;
            if (text_73 === 'loading' || text_73 === 'indexing') {
                status.textContent =
                    text_73 === 'loading' ? '正在读取全部聊天记录…' : '正在整理聊天记录…';
                status.className = 'chat-history-search-status';
                return;
            }
            if (text_73 === 'error') {
                status.textContent = '聊天记录读取失败，点此重试';
                status.className = 'chat-history-search-status is-error';
                return;
            }
            if (text_73 !== 'ready') return;
            if (!trim_141) {
                status.textContent = '输入关键词，搜索全部聊天记录';
                status.className = 'chat-history-search-status is-empty';
                return;
            }
            status.textContent = '正在搜索…';
            status.className = 'chat-history-search-status';
            count_76 = global.setTimeout(
                () => {
                    count_76 = 0;
                    void handleAction_85(value_140, trim_141);
                },
                value_139.immediate ? 0 : 120,
            );
        }
        async function handleAction_87() {
            const friend_6 = getLiveSearchFriend();
            if (!friend_6) return false;
            const value_143 = ++count_74;
            text_73 = 'loading';
            input.disabled = true;
            handleAction_86();
            try {
                let friend_7;
                if (global.imStorage?.loadMessageIndexByFriendId)
                    friend_7 = await global.imStorage.loadMessageIndexByFriendId(friend_6.id);
                else {
                    if (global.imApp?.ensureFriendMessagesLoaded) {
                        const messages_6 = await global.imApp.ensureFriendMessagesLoaded(friend_6, {
                            requireComplete: true,
                        });
                        friend_7 = {
                            messages: messages_6,
                            totalCount: messages_6.length,
                        };
                    } else throw new Error('Complete chat history reader is unavailable');
                }
                if (value_143 !== count_74 || String(friend_6.id) !== searchFriendId) return false;
                const messages_5 = Array.isArray(friend_7?.messages) ? friend_7.messages : [],
                    value_146 = new Array(messages_5.length);
                text_73 = 'indexing';
                handleAction_86();
                for (let count_148 = 0; count_148 < messages_5.length; count_148 += count_77) {
                    if (value_143 !== count_74) return false;
                    const min_149 = Math.min(messages_5.length, count_148 + count_77);
                    for (let value_150 = count_148; value_150 < min_149; value_150 += 1) {
                        const message_10 = messages_5[value_150],
                            text_4 = extractSearchableMessageText_2(message_10);
                        if (text_4)
                            value_146[value_150] = {
                                message: message_10,
                                text: text_4,
                                lowerText: text_4.toLocaleLowerCase(),
                                typeLabel: getMessageTypeLabel(message_10),
                            };
                    }
                    if (min_149 < messages_5.length) await handleAction_81();
                }
                if (value_143 !== count_74) return false;
                return (
                    (items_70 = value_146),
                    (text_73 = 'ready'),
                    (input.disabled = false),
                    global.imApp?.repairFriendMessageCount?.(friend_6, friend_7?.totalCount),
                    handleAction_86(),
                    global.setTimeout(() => {
                        if (value_143 === count_74)
                            input.focus({
                                preventScroll: true,
                            });
                    }, 0),
                    true
                );
            } catch (value_153) {
                if (value_143 !== count_74) return false;
                return (
                    console.error('Failed to load complete chat search index', value_153),
                    (text_73 = 'error'),
                    (input.disabled = true),
                    handleAction_86(),
                    false
                );
            }
        }
        function openChatHistorySearch_2(value_154) {
            const id_155 = value_154?.id,
                friend_8 =
                    id_155 == null
                        ? null
                        : global.imApp?.getFriendById?.(id_155) ||
                          (global.imData?.friends || []).find(
                              (value_157) => String(value_157.id) === String(id_155),
                          );
            if (!friend_8 || friend_8.type === 'npc' || friend_8.type === 'official') return false;
            resetSearchView();
            searchFriendId = String(friend_8.id);
            title_2.textContent =
                friend_8.type === 'group'
                    ? '搜索 ' + (friend_8.nickname || friend_8.realName || '群聊') + ' 的聊天记录'
                    : '搜索与 ' + (friend_8.nickname || friend_8.realName || 'Char') + ' 的聊天';
            if (global.openView) global.openView(searchView);
            else searchView.classList.add('active');
            return (void handleAction_87(), true);
        }
        imChat_2.openChatHistorySearch = openChatHistorySearch_2;
        searchButton.addEventListener('click', () => {
            const friend_9 = global.imData?.currentSettingsFriend;
            if (
                !friend_9 ||
                friend_9.type === 'group' ||
                friend_9.type === 'npc' ||
                friend_9.type === 'official'
            )
                return;
            openChatHistorySearch_2(friend_9);
        });
        backButton.addEventListener('click', closeSearchView);
        input.addEventListener('input', () => {
            if (!enabled) handleAction_86();
        });
        input.addEventListener('compositionstart', () => {
            enabled = true;
        });
        input.addEventListener('compositionend', () => {
            enabled = false;
            handleAction_86();
        });
        input.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== 'NumpadEnter' && event.key !== 'Search')
                return;
            if (enabled || event.isComposing || event.keyCode === 229) return;
            event.preventDefault();
            input.blur();
            if (text_73 === 'error') void handleAction_87();
            else
                handleAction_86({
                    immediate: true,
                });
        });
        input.addEventListener('search', () => {
            if (enabled) return;
            if (input.value.trim()) input.blur();
            if (text_73 === 'error') void handleAction_87();
            else
                handleAction_86({
                    immediate: true,
                });
        });
        backButton_2.addEventListener('click', handleClick);
        status.addEventListener('click', () => {
            if (text_73 === 'error') void handleAction_87();
        });
    });
})(typeof window !== 'undefined' ? window : globalThis);
