(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    const { apiConfig: apiConfig_2, userState: userState_2 } = window;
    window.imChat = window.imChat || {};
    const imChat_2 = window.imChat;
    imChat_2.CHAT_IMAGE_PLACEHOLDER_URL = 'assets/imessage/chat-image-placeholder-512.jpg';
    const imageGenerationRuns = new Set();
    function createMessageId_2(value_8 = 'msg') {
        return value_8 + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    }
    function ensureMessageId_2(msg, prefix = 'msg') {
        if (!msg || typeof msg !== 'object') return '';
        if (!msg.id) msg.id = window.imChat.createMessageId(prefix);
        return msg.id;
    }
    async function resolveAutoImageReferenceFace_2(friend, value_10 = {}) {
        if (
            !friend ||
            friend.type !== 'char' ||
            (value_10.force !== true && friend.imagePromptConfig?.autoUseReferenceFace !== true)
        )
            return '';
        const assetId = String(friend.imageFaceReferenceAssetId || '').trim();
        if (assetId && typeof window.appStorage?.getAssetUrl === 'function') {
            const value_13 = await window.appStorage.getAssetUrl(assetId)['catch'](() => '');
            if (value_13) return value_13;
        }
        const directUrl = String(friend.imageFaceReferenceUrl || '').trim();
        if (directUrl) return directUrl;
        throw new Error('自动锁脸已开启，但角色参考脸不可用，请重新上传参考脸后重试');
    }
    window.imChat.createMessageId = createMessageId_2;
    window.imChat.ensureMessageId = ensureMessageId_2;
    window.imChat.resolveAutoImageReferenceFace = resolveAutoImageReferenceFace_2;
    async function generateChatImage_2(value_14, value_15, value_16 = {}) {
        const friendId = value_15?.id,
            runKey = String(friendId ?? '').trim();
        if (!runKey) throw new Error('当前聊天状态已失效，请重新进入聊天');
        if (imageGenerationRuns.has(runKey)) throw new Error('这段聊天已有图片正在生成');
        if (!window.u2ImageGeneration?.generate) throw new Error('生图功能尚未加载，请刷新后重试');
        imageGenerationRuns.add(runKey);
        try {
            return await window.u2ImageGeneration.generate(String(value_14 || '').trim(), {
                referenceImage: value_16.referenceImage || '',
                basePrompt: value_16.basePrompt || '',
                charAppearance: value_16.charAppearance || '',
                userAppearance: value_16.userAppearance || '',
                artistPrompt: value_16.artistPrompt || '',
                negativePrompt: value_16.negativePrompt || '',
                includeCharAppearance: value_16.includeCharAppearance !== false,
                includeUserAppearance: value_16.includeUserAppearance !== false,
            });
        } finally {
            imageGenerationRuns['delete'](runKey);
        }
    }
    imChat_2.generateChatImage = generateChatImage_2;
    imChat_2.isChatImageGenerationRunning = (friendOrId) =>
        imageGenerationRuns.has(
            String(friendOrId && typeof friendOrId === 'object' ? friendOrId.id : friendOrId),
        );
});
