(function (value) {
    const value_1 = (value.imApp = value.imApp || {}),
        text_2 = '群主',
        text_3 = '管理员',
        count = 20;
    function handleAction(value_15) {
        return String(value_15 == null ? '' : value_15)
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, count);
    }
    function handleAction_4(value_16) {
        const trim_17 = String(value_16 == null ? '' : value_16).trim();
        return trim_17 && !['__user__', '__proto__', 'constructor', 'prototype'].includes(trim_17)
            ? trim_17
            : '';
    }
    function handleAction_5(value_18) {
        if (!value_18 || value_18.type !== 'group') return value_18;
        value_18.showGroupTitles = value_18.showGroupTitles !== false;
        value_18.ownerTitle = handleAction(value_18.ownerTitle) || text_2;
        const value_19 = new Set();
        value_18.adminMemberIds = (
            Array.isArray(value_18.adminMemberIds) ? value_18.adminMemberIds : []
        )
            .map(handleAction_4)
            .filter((value_21) => value_21 && !value_19.has(value_21) && value_19.add(value_21));
        const options = {},
            value_20 =
                value_18.memberTitles &&
                typeof value_18.memberTitles === 'object' &&
                !Array.isArray(value_18.memberTitles)
                    ? value_18.memberTitles
                    : {};
        return (
            Object.entries(value_20).forEach(([value_22, value_23]) => {
                const handleAction_4_24 = handleAction_4(value_22),
                    handleAction_25 = handleAction(value_23);
                if (handleAction_4_24 && handleAction_25)
                    options[handleAction_4_24] = handleAction_25;
            }),
            (value_18.memberTitles = options),
            value_18
        );
    }
    function handleAction_6(value_26) {
        return handleAction(value_26?.ownerTitle) || text_2;
    }
    function handleAction_7(value_27) {
        return value_27?.type === 'group' && value_27.showGroupTitles !== false;
    }
    function handleAction_8(value_28, value_29) {
        const message = value_29 || {},
            string = String(message.text || message.content || '');
        if (!value_28 || value_28.type !== 'group' || handleAction_7(value_28)) return string;
        if (message.noticeKind === 'group_title_changed') return '';
        const trim_30 = String(message.titleFreeText || '').trim();
        if (trim_30 && ['group_admin_promoted', 'group_admin_removed'].includes(message.noticeKind))
            return trim_30;
        if (message.noticeKind === 'group_admin_promoted') return '群成员已成为管理员';
        if (message.noticeKind === 'group_admin_removed') return '群成员已不再是管理员';
        return string;
    }
    function handleAction_9(value_31, value_32) {
        const handleAction_4_33 = handleAction_4(value_32);
        return handleAction_4_33
            ? handleAction(value_31?.memberTitles?.[handleAction_4_33]) ||
                  (handleAction_10(value_31, handleAction_4_33) ? text_3 : '')
            : '';
    }
    function handleAction_10(value_34, value_35) {
        const handleAction_4_36 = handleAction_4(value_35);
        return (
            !!handleAction_4_36 &&
            Array.isArray(value_34?.adminMemberIds) &&
            value_34.adminMemberIds.some((value_37) => String(value_37) === handleAction_4_36)
        );
    }
    function handleAction_11(value_38, value_39, value_40) {
        const handleAction_4_41 = handleAction_4(value_39);
        if (!handleAction_7(value_38) || !handleAction_4_41) return false;
        handleAction_5(value_38);
        const handleAction_42 = handleAction(value_40);
        if (handleAction_42) value_38.memberTitles[handleAction_4_41] = handleAction_42;
        else delete value_38.memberTitles[handleAction_4_41];
        return true;
    }
    function handleAction_12(value_43, value_44, value_45) {
        const handleAction_4_46 = handleAction_4(value_44);
        if (!value_43 || value_43.type !== 'group' || !handleAction_4_46) return false;
        handleAction_5(value_43);
        if (value_45) {
            if (!handleAction_10(value_43, handleAction_4_46))
                value_43.adminMemberIds.push(handleAction_4_46);
            value_43.memberTitles[handleAction_4_46] = text_3;
        } else {
            value_43.adminMemberIds = value_43.adminMemberIds.filter(
                (value_47) => value_47 !== handleAction_4_46,
            );
            if (handleAction_9(value_43, handleAction_4_46) === text_3)
                delete value_43.memberTitles[handleAction_4_46];
        }
        return true;
    }
    function handleAction_13(value_48, value_49, value_50, value_51, value_52) {
        const handleAction_4_53 = handleAction_4(value_49),
            handleAction_4_54 = handleAction_4(value_50),
            handleAction_55 = handleAction(value_51),
            value_56 = new Set(
                (Array.isArray(value_52) ? value_52 : []).map(handleAction_4).filter(Boolean),
            );
        if (
            !handleAction_7(value_48) ||
            !handleAction_4_53 ||
            !handleAction_4_54 ||
            !handleAction_55 ||
            String(value_51).trim().length > count ||
            !value_56.has(handleAction_4_53) ||
            !value_56.has(handleAction_4_54) ||
            !handleAction_10(value_48, handleAction_4_53) ||
            (handleAction_4_54 !== handleAction_4_53 &&
                handleAction_10(value_48, handleAction_4_54))
        )
            return false;
        return handleAction_11(value_48, handleAction_4_54, handleAction_55);
    }
    async function handleAction_14(value_57, value_58, value_59, value_60 = {}) {
        if (
            !value_57 ||
            value_57.type !== 'group' ||
            !value_57.id ||
            !['group_admin_promoted', 'group_admin_removed', 'group_title_changed'].includes(
                value_58,
            ) ||
            !value_59 ||
            typeof value_1.appendFriendMessage !== 'function'
        )
            return false;
        const options_61 = {
            ...value_60,
            id:
                value.imChat?.createMessageId?.('notice') ||
                'group-notice-' + Date.now() + '-' + Math.random().toString(36).slice(2),
            role: 'system',
            type: 'system_notice',
            noticeKind: value_58,
            content: String(value_59),
            text: String(value_59),
            timestamp: Date.now(),
        };
        return value_1.appendFriendMessage(value_57.id, options_61, {
            silent: true,
        });
    }
    value_1.GROUP_OWNER_TITLE = text_2;
    value_1.GROUP_ADMIN_TITLE = text_3;
    value_1.GROUP_TITLE_MAX_LENGTH = count;
    value_1.normalizeGroupTitleData = handleAction_5;
    value_1.areGroupTitlesEnabled = handleAction_7;
    value_1.getGroupManagementNoticeText = handleAction_8;
    value_1.getGroupOwnerTitle = handleAction_6;
    value_1.getGroupMemberTitle = handleAction_9;
    value_1.isGroupAdmin = handleAction_10;
    value_1.setGroupMemberTitle = handleAction_11;
    value_1.setGroupAdmin = handleAction_12;
    value_1.applyAdminTitleChange = handleAction_13;
    value_1.appendGroupManagementNotice = handleAction_14;
})(typeof window !== 'undefined' ? window : globalThis);
