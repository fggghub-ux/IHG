(function () {
  'use strict';

  const text_2 = "cphone:selected-char-id",
    value_3 = value_9 => "cphone:groups:" + value_9,
    value_4 = value_10 => value_10 && value_10.excludedFromContext !== true && value_10.noticeKind !== "group_private_to_user" && value_10.noticeKind !== "group_friend_private_chat",
    value_5 = value_11 => value_11?.nickname || value_11?.realName || value_11?.realname || "Char",
    value_6 = value_12 => value_12 + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10),
    value_7 = value_13 => (window.imData?.friends || []).find(value_14 => String(value_14?.id) === String(value_13)) || null,
    value_8 = message_15 => Number(message_15?.timestamp || message_15?.updatedAt || message_15?.generatedAt) || 0,
    cphoneApp_2 = {
      initialized: false,
      selectedId: "",
      activeThread: null,
      activeContact: null,
      tab: "threads",
      rows: new Map(),
      searchRows: null,
      searchTimer: null,
      renderedThreadKey: "",
      renderedMessageCount: 0,
      renderedSignatures: [],
      renderedLastSpeakerKey: "",
      renderedLastTime: 0,
      migration: null,
      groupMigration: null,
      groupsByChar: new Map(),
      groupLoads: new Map(),
      groupWrites: new Map(),
      progressing: false,
      clearing: false,
      creatingGroup: false,
      "getFriends"() {
        return (window.imData?.friends || []).filter(value_16 => value_16?.type === "char");
      },
      "getSelectedFriend"() {
        return this.getFriends().find(value_17 => String(value_17.id) === this.selectedId) || null;
      },
      async "readSelection"() {
        try {
          return String((await window.appStorage?.getMeta?.(text_2)) || "");
        } catch (value_18) {
          return "";
        }
      },
      "saveSelection"(value_19) {
        this.selectedId = String(value_19 || "");
        window.appStorage?.setMeta && window.appStorage.setMeta(text_2, this.selectedId)["catch"](value_20 => console.warn("[Cphone] Failed to save selected Char", value_20));
      },
      "init"() {
        if (this.initialized) return;
        this.phoneView = document.getElementById("lovers-friend-phone-view");
        this.emptyView = document.getElementById("cphone-view");
        this.smsView = document.getElementById("friend-imessage-view");
        if (!this.phoneView || !this.emptyView || !this.smsView) return;
        window.mobileInputCompat?.registerFocusScope?.({
          selector: "#friend-imessage-view.active",
          priority: 40,
          preferFocusScope: true,
          followViewportOrigin: true,
          resolveScrollContainer: value_21 => value_21.closest(".cphone-create-group-card") || this.smsView.querySelector(".cphone-sms-scroll"),
          scrollBehavior: "focus"
        });
        document.getElementById("cphone-back-btn")?.addEventListener("click", () => this.closeEmpty());
        document.getElementById("cphone-owner-button")?.addEventListener("click", () => this.showSwitcher());
        document.getElementById("cphone-switch-close")?.addEventListener("click", () => this.hideSwitcher());
        document.getElementById("cphone-switcher")?.addEventListener("click", event => {
          if (event.target.id === "cphone-switcher") this.hideSwitcher();
          const closest_22 = event.target.closest("[data-cphone-friend-id]");
          if (closest_22) void this.openFriend(closest_22.dataset.cphoneFriendId);
        });
        document.getElementById("friend-imsg-back-btn")?.addEventListener("click", () => this.closeMessages());
        document.getElementById("cphone-create-group-open")?.addEventListener("click", () => this.openCreateGroup());
        document.getElementById("cphone-create-group-close")?.addEventListener("click", () => this.closeCreateGroup());
        document.getElementById("cphone-create-group-sheet")?.addEventListener("click", event_23 => {
          if (event_23.target.id === "cphone-create-group-sheet") this.closeCreateGroup();
        });
        document.getElementById("cphone-create-group-form")?.addEventListener("submit", event_24 => {
          event_24.preventDefault();
          void this.createGroup();
        });
        ["cphone-sms-search", "cphone-create-group-form", "cphone-progress-form"].forEach(value_25 => {
          document.getElementById(value_25)?.addEventListener("keydown", value_26 => this.handleInputEnter(value_26));
        });
        document.addEventListener("keydown", value_27 => {
          if (value_27.key === "Escape" && !document.getElementById("cphone-create-group-sheet")?.hidden) this.closeCreateGroup();
          if (value_27.key === "Escape" && !document.getElementById("cphone-progress-sheet")?.hidden) this.closeProgress();
          if (value_27.key === "Escape" && !document.getElementById("cphone-switcher")?.hidden) this.hideSwitcher();
        });
        document.getElementById("cphone-thread-back")?.addEventListener("click", () => this.closeThread());
        document.getElementById("cphone-progress-open")?.addEventListener("click", () => this.openProgress());
        document.getElementById("cphone-clear-chat")?.addEventListener("click", () => {
          void this.clearThread();
        });
        document.getElementById("cphone-progress-close")?.addEventListener("click", () => this.closeProgress());
        document.getElementById("cphone-progress-sheet")?.addEventListener("click", event_28 => {
          if (event_28.target.id === "cphone-progress-sheet") this.closeProgress();
        });
        document.getElementById("cphone-progress-form")?.addEventListener("submit", event_29 => {
          event_29.preventDefault();
          void this.progressThread();
        });
        document.getElementById("cphone-sms-search")?.addEventListener("input", () => {
          if (this.searchTimer) clearTimeout(this.searchTimer);
          this.searchTimer = setTimeout(() => {
            this.searchTimer = null;
            this.renderList(true);
          }, 80);
        });
        document.getElementById("cphone-sms-tabs")?.addEventListener("click", event_30 => {
          const closest_31 = event_30.target.closest("[data-cphone-tab]");
          closest_31 && (this.tab = closest_31.dataset.cphoneTab, this.renderList());
        });
        document.getElementById("cphone-sms-list")?.addEventListener("click", event_32 => {
          const closest_33 = event_32.target.closest("[data-cphone-row]"),
            value_34 = closest_33 && this.rows.get(closest_33.dataset.cphoneRow);
          if (value_34) this.tab === "contacts" ? this.openContact(value_34) : void this.openThread(value_34);
        });
        document.getElementById("cphone-contact-close")?.addEventListener("click", () => this.closeContact());
        document.getElementById("cphone-contact-sheet")?.addEventListener("click", event_35 => {
          if (event_35.target.id === "cphone-contact-sheet") this.closeContact();
        });
        document.getElementById("cphone-contact-send")?.addEventListener("click", () => {
          const activeContact_36 = this.activeContact;
          this.closeContact();
          if (activeContact_36) void this.openThread(activeContact_36);
        });
        document.getElementById("cphone-sms-messages")?.addEventListener("click", event_37 => {
          const closest_38 = event_37.target.closest?.(".group-private-chat-detail-bubble.has-translation");
          if (closest_38) this.toggleBubbleTranslation(closest_38);
        });
        window.addEventListener("u2:linked-accounts-changed", value_39 => {
          if (String(value_39.detail?.friendId || "") === this.selectedId && (!this.activeThread || this.activeThread.kind === "linked")) this.refreshMessages();
        });
        window.addEventListener("u2:friend-message-appended", value_40 => {
          const string = String(value_40.detail?.friendId || "");
          if (this.activeThread) {
            if (this.activeThread.kind === "user" && string === this.selectedId || this.activeThread.kind === "group" && string === String(this.activeThread.groupId)) this.refreshMessages();
          } else {
            if (string === this.selectedId || this.getGroupsForChar(this.getSelectedFriend()).some(value_41 => String(value_41.id) === string)) this.refreshMessages();
          }
        });
        window.addEventListener("u2:friend-removed", () => {
          if (!this.getSelectedFriend()) void this.open();
        });
        this.initialized = true;
        void this.migrateLegacyGroups();
      },
      "handleInputEnter"(event_42) {
        const value_43 = window.mobileInputCompat?.isSendEnter?.(event_42) ?? (event_42?.key === "Enter" && !event_42.isComposing && event_42.keyCode !== 229 && !event_42.shiftKey && !event_42.ctrlKey && !event_42.metaKey && !event_42.altKey);
        if (!value_43) return;
        const value_44 = {
          "cphone-create-group-name": "cphone-create-group-count",
          "cphone-create-group-count": "cphone-create-group-purpose",
          "cphone-progress-rounds": "cphone-progress-direction"
        }[event_42.target?.id];
        if (event_42.target?.id === "cphone-sms-search") {
          event_42.preventDefault();
          event_42.target.blur?.();
        } else value_44 && (event_42.preventDefault(), document.getElementById(value_44)?.focus?.());
      },
      "blurActiveWithin"(value_45) {
        const activeElement_46 = document.activeElement;
        if (activeElement_46 && value_45?.contains?.(activeElement_46)) activeElement_46.blur?.();
      },
      async "cleanupLegacySms"() {
        if (this.migration) return this.migration;
        return this.migration = (async () => {
          const filter_47 = this.getFriends().filter(value_48 => Object.prototype.hasOwnProperty.call(value_48, "imessageData") || value_48.phoneGenApps?.includes("imessage") || Object.prototype.hasOwnProperty.call(value_48.phoneGenCounts || {}, "imessageMain") || Object.prototype.hasOwnProperty.call(value_48.phoneGenCounts || {}, "imessageAlt"));
          for (const value_49 of filter_47) {
            if (!window.imApp?.commitFriendChange) break;
            try {
              const value_50 = await window.imApp.commitFriendChange(value_49.id, value_51 => {
                delete value_51.imessageData;
                if (Array.isArray(value_51.phoneGenApps)) value_51.phoneGenApps = value_51.phoneGenApps.filter(value_52 => value_52 !== "imessage");
                value_51.phoneGenCounts && (delete value_51.phoneGenCounts.imessageMain, delete value_51.phoneGenCounts.imessageAlt);
              }, {
                silent: true
              });
              if (!value_50) window.showToast?.("旧短信记录清理失败");
            } catch (value_53) {
              console.warn("[Cphone] Failed to remove legacy SMS data", value_53);
              window.showToast?.("旧短信记录清理失败");
            }
          }
        })()["finally"](() => {
          this.migration = null;
        }), this.migration;
      },
      "getCphoneGroups"(value_54) {
        return this.groupsByChar.get(String(value_54?.id || "")) || [];
      },
      async "loadCphoneGroups"(value_55) {
        const string_56 = String(value_55 || "");
        if (this.groupsByChar.has(string_56)) return this.groupsByChar.get(string_56);
        if (this.groupLoads.has(string_56)) return this.groupLoads.get(string_56);
        const value_57 = (async () => {
          const value_58 = await window.appStorage?.getMeta?.(value_3(string_56)),
            value_59 = Array.isArray(value_58) ? value_58 : [];
          return this.groupsByChar.set(string_56, value_59), value_59;
        })()["finally"](() => this.groupLoads["delete"](string_56));
        return this.groupLoads.set(string_56, value_57), value_57;
      },
      "saveCphoneGroups"(value_60, value_61) {
        const string_62 = String(value_60 || ""),
          value_63 = this.groupWrites.get(string_62) || Promise.resolve(),
          then_64 = value_63["catch"](() => {}).then(async () => {
            const value_65 = await this.loadCphoneGroups(string_62),
              result = JSON.parse(JSON.stringify(value_65));
            value_61(result);
            if (!window.appStorage?.setMeta) throw new Error("Cphone 存储不可用");
            return await window.appStorage.setMeta(value_3(string_62), result), this.groupsByChar.set(string_62, result), result;
          });
        return this.groupWrites.set(string_62, then_64), void then_64["finally"](() => {
          if (this.groupWrites.get(string_62) === then_64) this.groupWrites["delete"](string_62);
        })["catch"](() => {}), then_64;
      },
      "migrateLegacyGroups"() {
        if (this.groupMigration) return this.groupMigration;
        return this.groupMigration = (async () => {
          await this.cleanupLegacySms();
          const filter_66 = (window.imData?.friends || []).filter(value_72 => value_72?.type === "group" && String(value_72.id || "").startsWith("cphone-group-"));
          if (!filter_66.length || !window.imApp?.commitFriendsChange) return;
          for (const value_73 of filter_66) {
            await window.imApp.ensureFriendMessagesLoaded?.(value_73);
          }
          const map_67 = filter_66.map(group_2 => {
              const owner_2 = (window.imData?.friends || []).find(value_76 => value_76?.type === "char" && (group_2.members || []).some(value_77 => String(value_77) === String(value_76.id)));
              return {
                group: group_2,
                owner: owner_2,
                local: {
                  id: String(group_2.id),
                  title: value_5(group_2),
                  displayCount: Number(group_2.cphoneDisplayMemberCount) || 0,
                  purpose: String(group_2.cphoneGroupPurpose || ""),
                  members: Array.isArray(group_2.cphoneStrangers) ? group_2.cphoneStrangers.map(value_78 => ({
                    ...value_78
                  })) : [],
                  messages: Array.isArray(group_2.messages) ? group_2.messages.map(value_79 => ({
                    ...value_79
                  })) : [],
                  createdAt: Number(group_2.leftGroupAt) || value_8(group_2.messages?.[0]) || Date.now(),
                  updatedAt: value_8(group_2.messages?.at(-1)) || Date.now()
                }
              };
            }),
            map_68 = map_67.filter(value_80 => !value_80.owner).map(value_81 => value_81.local);
          if (map_68.length) {
            if (!window.appStorage?.setMeta) throw new Error("无法保存无主 Cphone 群");
            const value_82 = await window.appStorage.getMeta?.("cphone:orphan-groups"),
              items_83 = Array.isArray(value_82) ? [...value_82] : [];
            map_68.forEach(value_84 => {
              if (!items_83.some(value_85 => String(value_85.id) === value_84.id)) items_83.push(value_84);
            });
            await window.appStorage.setMeta("cphone:orphan-groups", items_83);
          }
          const value_69 = new Set(map_67.map(value_86 => String(value_86.group.id))),
            value_70 = new Map();
          map_67.forEach(({
            owner: owner_3,
            local: local_2
          }) => {
            if (!owner_3) return;
            const string_89 = String(owner_3.id);
            if (!value_70.has(string_89)) value_70.set(string_89, []);
            value_70.get(string_89).push(local_2);
          });
          const value_71 = new Map();
          try {
            for (const [value_91, items_92] of value_70) {
              value_71.set(value_91, JSON.parse(JSON.stringify(await this.loadCphoneGroups(value_91))));
              await this.saveCphoneGroups(value_91, items_93 => {
                items_92.forEach(value_94 => {
                  if (!items_93.some(value_95 => String(value_95.id) === value_94.id)) items_93.push(value_94);
                });
              });
            }
            const value_90 = await window.imApp.commitFriendsChange(() => {
              window.imData.friends = window.imData.friends.filter(value_96 => !value_69.has(String(value_96.id)));
            }, {
              deletedFriendIds: [...value_69],
              silent: true
            });
            if (!value_90) throw new Error("Cphone 群迁移保存失败");
          } catch (value_97) {
            for (const [value_98, value_99] of value_71) {
              try {
                await this.saveCphoneGroups(value_98, value_100 => {
                  value_100.splice(0, value_100.length, ...value_99);
                });
              } catch (value_101) {
                console.error("[Cphone] Failed to restore group storage", value_101);
              }
            }
            throw value_97;
          }
          if (value_69.has(String(window.imData.currentActiveFriend?.id || ""))) window.imData.currentActiveFriend = null;
          window.imApp.renderGroupsList?.({
            force: true
          });
          window.imApp.requestChatsListRefresh?.();
          this.refreshMessages();
        })()["catch"](value_102 => {
          console.warn("[Cphone] Failed to migrate Cphone groups", value_102);
          window.showToast?.("Cphone 群迁移失败，请重新打开 Cphone 重试");
        })["finally"](() => {
          this.groupMigration = null;
        }), this.groupMigration;
      },
      async "open"() {
        this.init();
        await this.migrateLegacyGroups();
        const friends_103 = this.getFriends(),
          value_104 = this.getSelectedFriend()?.id || (await this.readSelection()),
          value_105 = friends_103.find(value_106 => String(value_106.id) === String(value_104)) || friends_103[0];
        if (!value_105) {
          this.closeMessages();
          window.closeView?.(this.phoneView);
          this.phoneView.classList.remove("active");
          this.emptyView.inert = false;
          this.emptyView.setAttribute("aria-hidden", "false");
          window.openView?.(this.emptyView);
          this.emptyView.classList.add("active");
          return;
        }
        return this.openFriend(value_105.id);
      },
      async "openFriend"(value_107) {
        this.init();
        const result_108 = this.getFriends().find(value_109 => String(value_109.id) === String(value_107));
        if (!result_108 || !window.lovesApp?.openFriendPhone) return false;
        await this.loadCphoneGroups(result_108.id);
        if (!window.lovesApp.initialized) window.lovesApp.init();
        return this.closeContact(), this.closeMessages(), this.hideSwitcher(), this.closeEmpty(), this.saveSelection(result_108.id), this.searchRows = null, this.renderedThreadKey = "", window.lovesApp.openFriendPhone(result_108), this.renderDesktop(result_108), true;
      },
      "closeEmpty"() {
        if (!this.emptyView) return;
        window.closeView?.(this.emptyView);
        this.emptyView.classList.remove("active");
        this.emptyView.inert = true;
        this.emptyView.setAttribute("aria-hidden", "true");
      },
      "fillAvatar"(element, src_2, value_111) {
        if (!element) return;
        element.replaceChildren();
        if (src_2) {
          const element_112 = document.createElement("img");
          element_112.src = src_2;
          element_112.alt = "";
          element.appendChild(element_112);
        } else {
          const element_113 = document.createElement("span");
          element_113.textContent = String(value_111 || "?").trim().charAt(0) || "?";
          element.appendChild(element_113);
        }
      },
      "renderDesktop"(value_114) {
        const cphoneOwnerButtonElement = document.getElementById("cphone-owner-button");
        if (cphoneOwnerButtonElement) cphoneOwnerButtonElement.setAttribute("aria-label", "当前 " + value_5(value_114) + "，切换 Char");
        const cphoneOwnerNameElement = document.getElementById("cphone-owner-name");
        if (cphoneOwnerNameElement) cphoneOwnerNameElement.textContent = value_5(value_114);
        this.fillAvatar(document.getElementById("cphone-owner-avatar"), value_114.avatarUrl, value_5(value_114));
      },
      "showSwitcher"() {
        const cphoneSwitcherElement = document.getElementById("cphone-switcher"),
          cphoneSwitchListElement = document.getElementById("cphone-switch-list");
        if (!cphoneSwitcherElement || !cphoneSwitchListElement) return;
        cphoneSwitchListElement.replaceChildren();
        const friends_115 = this.getFriends();
        friends_115.forEach(value_116 => {
          const element_117 = document.createElement("button");
          element_117.type = "button";
          element_117.className = "cphone-switch-row";
          element_117.dataset.cphoneFriendId = String(value_116.id);
          const element_118 = document.createElement("span");
          element_118.className = "cphone-avatar";
          this.fillAvatar(element_118, value_116.avatarUrl, value_5(value_116));
          const element_119 = document.createElement("strong");
          element_119.textContent = value_5(value_116);
          const element_120 = document.createElement("i");
          element_120.className = String(value_116.id) === this.selectedId ? "fas fa-check" : "fas fa-chevron-right";
          element_120.setAttribute("aria-hidden", "true");
          element_117.append(element_118, element_119, element_120);
          cphoneSwitchListElement.appendChild(element_117);
        });
        if (!friends_115.length) cphoneSwitchListElement.textContent = "还没有 Char，请先在 iMessage 添加。";
        cphoneSwitcherElement.inert = false;
        cphoneSwitcherElement.hidden = false;
        (cphoneSwitchListElement.querySelector?.("button") || document.getElementById("cphone-switch-close"))?.focus?.({
          preventScroll: true
        });
      },
      "hideSwitcher"() {
        const cphoneSwitcherElement_121 = document.getElementById("cphone-switcher");
        if (!cphoneSwitcherElement_121) return;
        const activeElement_122 = document.activeElement;
        if (activeElement_122 && cphoneSwitcherElement_121.contains(activeElement_122)) {
          document.getElementById("cphone-owner-button")?.focus?.({
            preventScroll: true
          });
          if (cphoneSwitcherElement_121.contains(document.activeElement)) activeElement_122.blur?.();
        }
        cphoneSwitcherElement_121.inert = true;
        cphoneSwitcherElement_121.hidden = true;
      },
      async "openMessages"() {
        await this.migrateLegacyGroups();
        const selectedFriend = this.getSelectedFriend();
        if (!selectedFriend) return;
        await this.loadCphoneGroups(selectedFriend.id);
        await window.imApp?.ensureFriendMessagesLoaded?.(selectedFriend);
        this.activeThread = null;
        this.tab = "threads";
        const cphoneSmsSearchElement = document.getElementById("cphone-sms-search");
        if (cphoneSmsSearchElement) cphoneSmsSearchElement.value = "";
        window.openView?.(this.smsView);
        this.smsView.classList.add("active");
        this.renderList();
      },
      "closeMessages"() {
        if (!this.smsView) return;
        if (this.searchTimer) clearTimeout(this.searchTimer);
        this.searchTimer = null;
        this.blurActiveWithin(this.smsView);
        this.activeThread = null;
        this.searchRows = null;
        this.renderedThreadKey = "";
        this.closeContact();
        this.closeCreateGroup();
        this.closeProgress(true);
        window.closeView?.(this.smsView);
        this.smsView.classList.remove("active");
      },
      "closeThread"() {
        this.closeProgress(true);
        this.activeThread = null;
        this.renderedThreadKey = "";
        this.renderList();
      },
      "getGroupsForChar"(value_123) {
        if (!value_123) return [];
        return (window.imData?.friends || []).filter(value_124 => {
          if (value_124?.type !== "group") return false;
          if (String(value_124.id || "").startsWith("cphone-group-")) return false;
          if (typeof window.imChat?.getGroupMemberFriends === "function") return window.imChat.getGroupMemberFriends(value_124).some(value_125 => String(value_125.id) === String(value_123.id));
          return (value_124.members || []).some(value_126 => String(value_126) === String(value_123.id));
        });
      },
      "getLinkedChats"(value_127) {
        return window.imApp?.normalizeLinkedAccountChats ? window.imApp.normalizeLinkedAccountChats(value_127?.linkedAccountChats) : Array.isArray(value_127?.linkedAccountChats) ? value_127.linkedAccountChats : [];
      },
      "getRelationships"(value_128) {
        return (Array.isArray(value_128?.memory?.relationships) ? value_128.memory.relationships : []).map(relation_2 => ({
          relation: relation_2,
          target: value_7(relation_2?.targetId ?? relation_2?.npcId)
        })).filter(event_130 => event_130.target && (event_130.target.type === "char" || event_130.target.type === "npc"));
      },
      "findLinkedForTarget"(value_131, value_132, items_133 = this.getLinkedChats(value_131)) {
        const result_134 = items_133.find(value_137 => String(value_137.sourceNpcId || "") === String(value_132.id));
        if (result_134) return result_134;
        const value_135 = new Set([value_132.nickname, value_132.realName, value_132.realname].filter(Boolean).map(value_138 => String(value_138).trim().toLowerCase())),
          filter_136 = items_133.filter(value_139 => !value_139.sourceNpcId && [value_139.name, value_139.remark, value_139.realName].some(value_140 => value_135.has(String(value_140 || "").trim().toLowerCase())));
        return filter_136.length === 1 ? filter_136[0] : null;
      },
      "getThreadRows"(value_141) {
        if (!value_141) return [];
        const items_142 = [],
          messages_2 = Array.isArray(value_141.messages) ? value_141.messages : [];
        if (messages_2.length) items_142.push({
          kind: "user",
          key: "user",
          title: window.imData?.profile?.name || "User",
          avatarUrl: window.userState?.avatarUrl || window.imData?.profile?.avatarUrl || "",
          messages: messages_2,
          timestamp: value_8(messages_2.at(-1))
        });
        return this.getGroupsForChar(value_141).forEach(value_144 => {
          const messages_3 = (Array.isArray(value_144.messages) ? value_144.messages : []).filter(value_4);
          items_142.push({
            kind: "group",
            key: "group:" + value_144.id,
            groupId: String(value_144.id),
            title: value_5(value_144),
            avatarUrl: value_144.avatarUrl || "",
            messages: messages_3,
            previewText: messages_3.length ? "" : String(value_144.lastMessagePreview || ""),
            timestamp: value_8(messages_3.at(-1)) || Number(value_144.lastMessageTimestamp) || 0
          });
        }), this.getCphoneGroups(value_141).forEach(value_146 => {
          const messages_4 = Array.isArray(value_146.messages) ? value_146.messages : [];
          items_142.push({
            kind: "cphoneGroup",
            key: "cphone-group:" + value_146.id,
            groupId: String(value_146.id),
            title: value_146.title || "群聊",
            avatarUrl: value_146.avatarUrl || "",
            displayCount: Number(value_146.displayCount) || 0,
            messages: messages_4,
            timestamp: value_8(messages_4.at(-1)) || Number(value_146.updatedAt) || 0
          });
        }), this.getLinkedChats(value_141).forEach(contact => {
          if (!contact.messages?.length) return;
          const value_148 = contact.sourceNpcId ? value_7(contact.sourceNpcId) : null;
          items_142.push({
            kind: "linked",
            key: "linked:" + contact.id,
            chatId: String(contact.id),
            targetId: value_148?.id ? String(value_148.id) : "",
            title: contact.remark || contact.name || contact.realName || "联系人",
            avatarUrl: value_148?.avatarUrl || "",
            relationship: contact.relationship || "",
            persona: contact.persona || "",
            messages: contact.messages,
            timestamp: Number(contact.updatedAt) || value_8(contact.messages.at(-1))
          });
        }), items_142.sort((message_149, message_150) => message_150.timestamp - message_149.timestamp || message_149.title.localeCompare(message_150.title));
      },
      "getContactRows"(value_151) {
        if (!value_151) return [];
        const items_152 = [{
            kind: "user",
            key: "user",
            title: window.imData?.profile?.name || "User",
            avatarUrl: window.userState?.avatarUrl || window.imData?.profile?.avatarUrl || "",
            relationship: value_151.relationship || "",
            persona: window.userState?.persona || ""
          }],
          value_153 = new Set(),
          linkedChats = this.getLinkedChats(value_151);
        return this.getRelationships(value_151).forEach(({
          relation: relation_3,
          target: target_2
        }) => {
          const linkedForTarget = this.findLinkedForTarget(value_151, target_2, linkedChats);
          if (linkedForTarget) value_153.add(String(linkedForTarget.id));
          items_152.push({
            kind: "linked",
            key: "contact:" + target_2.id,
            targetId: String(target_2.id),
            chatId: linkedForTarget ? String(linkedForTarget.id) : "",
            title: linkedForTarget?.remark || value_5(target_2),
            avatarUrl: target_2.avatarUrl || "",
            relationship: relation_3.relation || linkedForTarget?.relationship || "",
            persona: linkedForTarget?.persona || target_2.signature || ""
          });
        }), linkedChats.forEach(contact_156 => {
          if (value_153.has(String(contact_156.id))) return;
          const value_157 = contact_156.sourceNpcId ? value_7(contact_156.sourceNpcId) : null;
          items_152.push({
            kind: "linked",
            key: "contact-linked:" + contact_156.id,
            chatId: String(contact_156.id),
            targetId: value_157?.id ? String(value_157.id) : "",
            title: contact_156.remark || contact_156.name || contact_156.realName || "联系人",
            avatarUrl: value_157?.avatarUrl || "",
            relationship: contact_156.relationship || "",
            persona: contact_156.persona || ""
          });
        }), items_152;
      },
      "messageText"(message_158) {
        const options_159 = {
            image: "[图片]",
            sticker: "[表情]",
            voice: "[语音]",
            voice_message: "[语音]",
            video: "[视频]",
            file: "[文件]",
            location: "[位置]",
            payment: "[转账]",
            transfer: "[转账]",
            group_red_packet: "[红包]",
            group_poll: "[投票]"
          },
          string_160 = String(message_158?.type || "");
        if (options_159[string_160]) {
          const trim_161 = String(message_158?.description || message_158?.text || "").trim();
          return "" + options_159[string_160] + (trim_161 ? " " + trim_161 : "");
        }
        return [message_158?.text, message_158?.content, message_158?.transcript].map(value_162 => String(value_162 ?? "").trim()).find(Boolean) || "[消息]";
      },
      "messageTime"(value_163) {
        if (!value_163) return "";
        const value_164 = new Date(value_163);
        if (Number.isNaN(value_164.getTime())) return "";
        const value_165 = value_167 => String(value_167).padStart(2, "0"),
          value_166 = value_165(value_164.getHours()) + ":" + value_165(value_164.getMinutes());
        return value_164.toDateString() === new Date().toDateString() ? value_166 : value_164.getMonth() + 1 + "/" + value_164.getDate() + " " + value_166;
      },
      "messageChipTime"(value_168) {
        const value_169 = new Date(Number(value_168) || 0);
        if (!value_168 || Number.isNaN(value_169.getTime())) return "";
        const value_170 = value_171 => String(value_171).padStart(2, "0");
        return value_169.getMonth() + 1 + "/" + value_169.getDate() + " " + value_170(value_169.getHours()) + ":" + value_170(value_169.getMinutes());
      },
      "renderList"(value_172 = false) {
        if (!this.smsView?.classList.contains("active") || this.activeThread) return;
        !value_172 && this.searchTimer && (clearTimeout(this.searchTimer), this.searchTimer = null);
        const selectedFriend_173 = this.getSelectedFriend();
        document.getElementById("cphone-sms-list-page").hidden = false;
        document.getElementById("cphone-sms-detail").hidden = true;
        document.getElementById("cphone-sms-owner").textContent = value_5(selectedFriend_173) + " 的账号";
        document.querySelectorAll("#cphone-sms-tabs [data-cphone-tab]").forEach(element_177 => {
          const value_178 = element_177.dataset.cphoneTab === this.tab;
          element_177.classList.toggle("active", value_178);
          element_177.setAttribute("aria-selected", String(value_178));
        });
        const toLowerCase_174 = String(document.getElementById("cphone-sms-search")?.value || "").trim().toLowerCase();
        if (!value_172 || !this.searchRows || this.searchRows.ownerId !== String(selectedFriend_173?.id || "") || this.searchRows.tab !== this.tab) {
          const items_179 = this.tab === "contacts" ? this.getContactRows(selectedFriend_173) : this.getThreadRows(selectedFriend_173);
          this.searchRows = {
            ownerId: String(selectedFriend_173?.id || ""),
            tab: this.tab,
            items: items_179.map(row_2 => ({
              row: row_2,
              searchText: [row_2.title, row_2.relationship, this.messageText(row_2.messages?.at(-1))].map(value_181 => String(value_181 || "").toLowerCase()).join("\n")
            }))
          };
        }
        const map_175 = this.searchRows.items.filter(value_182 => !toLowerCase_174 || value_182.searchText.includes(toLowerCase_174)).map(value_183 => value_183.row),
          cphoneSmsListElement = document.getElementById("cphone-sms-list");
        this.rows.clear();
        cphoneSmsListElement.replaceChildren();
        document.getElementById("cphone-sms-count").textContent = map_175.length + " " + (this.tab === "contacts" ? "位联系人" : "个会话");
        if (!map_175.length) {
          const element_184 = document.createElement("div");
          element_184.className = "cphone-sms-empty";
          element_184.textContent = toLowerCase_174 ? "没有找到匹配结果" : this.tab === "contacts" ? "还没有联系人" : "还没有会话";
          cphoneSmsListElement.appendChild(element_184);
          return;
        }
        const documentFragment = document.createDocumentFragment?.(),
          element_176 = documentFragment || cphoneSmsListElement;
        map_175.forEach((message_185, value_186) => {
          const element_187 = document.createElement("button");
          element_187.type = "button";
          element_187.className = "cphone-sms-row";
          element_187.dataset.cphoneRow = String(value_186);
          this.rows.set(String(value_186), message_185);
          const element_188 = document.createElement("span");
          element_188.className = "cphone-avatar" + (message_185.kind === "group" ? " is-group" : "");
          this.fillAvatar(element_188, message_185.avatarUrl, message_185.title);
          const element_189 = document.createElement("span");
          element_189.className = "cphone-sms-row-body";
          const element_190 = document.createElement("span");
          element_190.className = "cphone-sms-row-top";
          const element_191 = document.createElement("strong");
          element_191.textContent = message_185.title;
          const element_192 = document.createElement("small");
          element_192.textContent = this.tab === "contacts" ? "" : this.messageTime(message_185.timestamp);
          element_190.append(element_191, element_192);
          const element_193 = document.createElement("span");
          element_193.className = "cphone-sms-preview";
          element_193.textContent = this.tab === "contacts" ? message_185.relationship || (message_185.kind === "user" ? "与你的聊天" : "联系人") : message_185.messages?.length ? this.messageText(message_185.messages.at(-1)) : message_185.previewText || "暂无消息";
          element_189.append(element_190, element_193);
          element_187.append(element_188, element_189);
          element_176.appendChild(element_187);
        });
        if (documentFragment) cphoneSmsListElement.appendChild(documentFragment);
      },
      "openContact"(activeContact_2) {
        this.activeContact = activeContact_2;
        const cphoneContactSheetElement = document.getElementById("cphone-contact-sheet");
        document.getElementById("cphone-contact-name").textContent = activeContact_2.title;
        document.getElementById("cphone-contact-relationship").textContent = activeContact_2.relationship || "联系人";
        document.getElementById("cphone-contact-persona").textContent = activeContact_2.persona || "";
        this.fillAvatar(document.getElementById("cphone-contact-avatar"), activeContact_2.avatarUrl, activeContact_2.title);
        cphoneContactSheetElement.hidden = false;
      },
      "closeContact"() {
        this.activeContact = null;
        const cphoneContactSheetElement_195 = document.getElementById("cphone-contact-sheet");
        if (cphoneContactSheetElement_195) cphoneContactSheetElement_195.hidden = true;
      },
      async "openThread"(value_196) {
        const selectedFriend_197 = this.getSelectedFriend();
        if (!selectedFriend_197 || !value_196) return;
        if (this.searchTimer) clearTimeout(this.searchTimer);
        this.searchTimer = null;
        if (value_196.kind === "user") await window.imApp?.ensureFriendMessagesLoaded?.(selectedFriend_197);
        if (value_196.kind === "group") {
          const value_7_199 = value_7(value_196.groupId);
          if (!value_7_199 || !this.getGroupsForChar(selectedFriend_197).some(value_200 => String(value_200.id) === String(value_7_199.id))) return;
          await window.imApp?.ensureFriendMessagesLoaded?.(value_7_199);
        }
        if (value_196.kind === "cphoneGroup" && !this.getCphoneGroups(selectedFriend_197).some(value_201 => String(value_201.id) === String(value_196.groupId))) return;
        this.activeThread = {
          ...value_196
        };
        this.renderedThreadKey = "";
        document.getElementById("cphone-sms-list-page").hidden = true;
        document.getElementById("cphone-sms-detail").hidden = false;
        document.getElementById("cphone-thread-title").textContent = value_196.title;
        document.getElementById("cphone-thread-subtitle").textContent = value_196.kind === "group" || value_196.kind === "cphoneGroup" ? value_196.displayCount ? "群聊 · " + value_196.displayCount + " 人" : "群聊" : value_196.relationship || (value_196.kind === "user" ? "与 User 的聊天" : "关联好友");
        const value_198 = value_196.kind === "cphoneGroup" || value_196.kind === "linked";
        document.getElementById("cphone-progress-open").hidden = !value_198;
        document.getElementById("cphone-clear-chat").hidden = !value_198;
        this.fillAvatar(document.getElementById("cphone-thread-avatar"), value_196.avatarUrl, value_196.title);
        this.renderThread();
      },
      "currentMessages"() {
        const activeThread_202 = this.activeThread,
          selectedFriend_203 = this.getSelectedFriend();
        if (!activeThread_202 || !selectedFriend_203) return [];
        if (activeThread_202.kind === "user") return Array.isArray(selectedFriend_203.messages) ? selectedFriend_203.messages : [];
        if (activeThread_202.kind === "group") return (Array.isArray(value_7(activeThread_202.groupId)?.messages) ? value_7(activeThread_202.groupId).messages : []).filter(value_4);
        if (activeThread_202.kind === "cphoneGroup") return this.getCphoneGroups(selectedFriend_203).find(value_206 => String(value_206.id) === String(activeThread_202.groupId))?.messages || [];
        const linkedChats_204 = this.getLinkedChats(selectedFriend_203),
          value_205 = linkedChats_204.find(value_207 => String(value_207.id) === String(activeThread_202.chatId)) || linkedChats_204.find(value_208 => activeThread_202.targetId && String(value_208.sourceNpcId) === String(activeThread_202.targetId));
        return Array.isArray(value_205?.messages) ? value_205.messages : [];
      },
      "isOwnMessage"(message_209, value_210, value_211, value_212) {
        if (value_210.kind === "user") return message_209?.role === "assistant" || message_209?.sender === "char";
        if (value_210.kind === "linked") return message_209?.role === "char";
        if (value_210.kind === "cphoneGroup") return String(message_209?.speakerMemberId || message_209?.senderMemberId || "") === String(value_211.id);
        if (message_209?.role !== "assistant") return false;
        if (String(message_209.speakerMemberId || message_209.senderMemberId || "") === String(value_211.id)) return true;
        const groupSpeaker = window.imChat?.normalizeGroupSpeaker?.(value_212?.group || value_7(value_210.groupId), message_209.speaker || message_209.senderName || "", message_209.speakerMemberId || message_209.senderMemberId || "");
        return String(groupSpeaker?.id || "") === String(value_211.id);
      },
      "messageSpeaker"(message_213, value_214, value_215, value_216, value_217) {
        if (value_214.kind === "user") return value_216 ? {
          key: "char:" + value_215.id,
          name: value_5(value_215)
        } : {
          key: "user",
          name: window.imData?.profile?.name || "User"
        };
        if (value_214.kind === "linked") return value_216 ? {
          key: "char:" + value_215.id,
          name: value_5(value_215)
        } : {
          key: "account:" + (value_214.targetId || value_214.chatId || value_214.title),
          name: value_214.title || "联系人"
        };
        if (message_213?.role === "user") return {
          key: "user",
          name: window.imData?.profile?.name || "User"
        };
        if (value_216) return {
          key: "char:" + value_215.id,
          name: value_5(value_215)
        };
        const string_218 = String(message_213?.speakerMemberId || message_213?.senderMemberId || ""),
          value_219 = value_217?.memberNames?.get(string_218) || (!value_217 ? (() => {
            const value_221 = value_214.kind === "cphoneGroup" ? this.getCphoneGroups(value_215).find(value_223 => String(value_223.id) === String(value_214.groupId)) : value_7(value_214.groupId),
              result_222 = (value_221?.members || []).find(value_224 => String(value_224?.id || value_224) === string_218);
            return typeof result_222 === "object" ? result_222?.nickname || result_222?.name : "";
          })() : ""),
          name_2 = message_213?.speaker || message_213?.senderName || value_219 || value_217?.friendNames?.get(string_218) || value_7(string_218)?.nickname || "群成员";
        return {
          key: string_218 ? "member:" + string_218 : "speaker:" + name_2,
          name: name_2
        };
      },
      "toggleBubbleTranslation"(element_225) {
        const groupPrivateChatDetailTranslationElement = element_225?.querySelector(".group-private-chat-detail-translation");
        if (!groupPrivateChatDetailTranslationElement) return;
        const hidden_226 = groupPrivateChatDetailTranslationElement.hidden;
        groupPrivateChatDetailTranslationElement.hidden = !hidden_226;
        element_225.classList.toggle("is-expanded", hidden_226);
        element_225.setAttribute("aria-expanded", String(hidden_226));
        element_225.title = hidden_226 ? "点击收起翻译" : "点击展开翻译";
      },
      "messageRenderSignature"(message_227) {
        return JSON.stringify([message_227?.id, message_227?.role, message_227?.sender, message_227?.type, message_227?.description, message_227?.text, message_227?.content, message_227?.transcript, message_227?.translation, message_227?.translationZh, message_227?.trans, message_227?.textTranslationZh, message_227?.speaker, message_227?.senderName, message_227?.speakerMemberId, message_227?.senderMemberId, value_8(message_227)]);
      },
      "renderThread"() {
        const cphoneSmsMessagesElement = document.getElementById("cphone-sms-messages"),
          activeThread_228 = this.activeThread,
          selectedFriend_229 = this.getSelectedFriend();
        if (!cphoneSmsMessagesElement || !activeThread_228 || !selectedFriend_229) return;
        const currentMessages_230 = this.currentMessages(),
          cphoneClearChatElement = document.getElementById("cphone-clear-chat");
        if (cphoneClearChatElement) cphoneClearChatElement.disabled = !currentMessages_230.length || this.clearing || this.progressing;
        const items_231 = currentMessages_230.every((value_244, value_245) => !value_245 || value_8(currentMessages_230[value_245 - 1]) <= value_8(value_244)) ? currentMessages_230 : [...currentMessages_230].sort((value_246, value_247) => value_8(value_246) - value_8(value_247)),
          renderedThreadKey_2 = this.selectedId + ":" + this.progressKey(activeThread_228),
          renderedMessageCount_233 = this.renderedMessageCount,
          renderedSignatures_2 = items_231.map(value_248 => this.messageRenderSignature(value_248)),
          value_235 = renderedThreadKey_2 === this.renderedThreadKey && renderedMessageCount_233 > 0 && items_231.length > renderedMessageCount_233 && this.renderedSignatures.every((value_249, value_250) => value_249 === renderedSignatures_2[value_250]),
          scrollTop_2 = cphoneSmsMessagesElement.scrollTop,
          value_237 = renderedThreadKey_2 !== this.renderedThreadKey || !Number.isFinite(cphoneSmsMessagesElement.clientHeight) || cphoneSmsMessagesElement.scrollHeight - cphoneSmsMessagesElement.scrollTop - cphoneSmsMessagesElement.clientHeight < 80;
        if (!value_235) cphoneSmsMessagesElement.replaceChildren();
        const documentFragment_238 = document.createDocumentFragment?.(),
          element_239 = documentFragment_238 || cphoneSmsMessagesElement;
        if (!currentMessages_230.length) {
          const element_251 = document.createElement("div");
          element_251.className = "cphone-sms-empty";
          element_251.textContent = activeThread_228.kind === "cphoneGroup" || activeThread_228.kind === "linked" ? "还没有消息，点击右上角推进聊天" : "还没有消息";
          element_239.appendChild(element_251);
        }
        const group_3 = activeThread_228.kind === "cphoneGroup" ? this.getCphoneGroups(selectedFriend_229).find(value_252 => String(value_252.id) === String(activeThread_228.groupId)) : activeThread_228.kind === "group" ? value_7(activeThread_228.groupId) : null,
          value_241 = group_3 ? {
            group: group_3,
            memberNames: new Map((group_3.members || []).map(value_253 => [String(value_253?.id || value_253), typeof value_253 === "object" ? value_253.nickname || value_253.name || "" : ""])),
            friendNames: new Map((window.imData?.friends || []).map(value_254 => [String(value_254.id), value_254.nickname || ""]))
          } : null;
        let renderedLastSpeakerKey_2 = value_235 ? this.renderedLastSpeakerKey : "",
          renderedLastTime_2 = value_235 ? this.renderedLastTime : 0;
        for (let value_255 = value_235 ? renderedMessageCount_233 : 0; value_255 < items_231.length; value_255++) {
          const value_256 = items_231[value_255],
            isOwnMessage_257 = this.isOwnMessage(value_256, activeThread_228, selectedFriend_229, value_241),
            messageSpeaker_258 = this.messageSpeaker(value_256, activeThread_228, selectedFriend_229, isOwnMessage_257, value_241),
            value_8_259 = value_8(value_256);
          if (value_8_259 && (value_255 === 0 || renderedLastTime_2 && value_8_259 - renderedLastTime_2 > 300000)) {
            const element_265 = document.createElement("div");
            element_265.className = "group-private-chat-detail-time-chip";
            element_265.textContent = this.messageChipTime(value_8_259);
            element_239.appendChild(element_265);
          }
          const value_260 = value_255 === 0 || renderedLastSpeakerKey_2 !== messageSpeaker_258.key,
            element_261 = document.createElement("div");
          element_261.className = "group-private-chat-detail-row" + (isOwnMessage_257 ? " is-sender" : "") + (value_260 ? " is-group-start" : "");
          if (value_260) {
            const element_266 = document.createElement("small");
            element_266.className = "group-private-chat-detail-name";
            element_266.textContent = messageSpeaker_258.name;
            element_261.appendChild(element_266);
          }
          const textContent_2 = String(value_256.translation || value_256.translationZh || value_256.trans || value_256.textTranslationZh || "").trim(),
            element_263 = document.createElement(textContent_2 ? "button" : "div");
          element_263.className = "group-private-chat-detail-bubble" + (textContent_2 ? " has-translation" : "");
          textContent_2 && (element_263.type = "button", element_263.setAttribute("aria-expanded", "false"), element_263.title = "点击展开翻译");
          const element_264 = document.createElement("span");
          element_264.className = "group-private-chat-detail-original";
          element_264.textContent = this.messageText(value_256);
          element_263.appendChild(element_264);
          if (textContent_2) {
            const element_267 = document.createElement("span");
            element_267.className = "group-private-chat-detail-translation";
            element_267.textContent = textContent_2;
            element_267.hidden = true;
            element_263.appendChild(element_267);
          }
          element_261.appendChild(element_263);
          element_239.appendChild(element_261);
          renderedLastSpeakerKey_2 = messageSpeaker_258.key;
          renderedLastTime_2 = value_8_259;
        }
        if (documentFragment_238) cphoneSmsMessagesElement.appendChild(documentFragment_238);
        this.renderedThreadKey = renderedThreadKey_2;
        this.renderedMessageCount = items_231.length;
        this.renderedSignatures = renderedSignatures_2;
        this.renderedLastSpeakerKey = renderedLastSpeakerKey_2;
        this.renderedLastTime = renderedLastTime_2;
        if (value_237) cphoneSmsMessagesElement.scrollTop = cphoneSmsMessagesElement.scrollHeight;else {
          if (!value_235) cphoneSmsMessagesElement.scrollTop = scrollTop_2;
        }
      },
      "refreshMessages"() {
        if (!this.smsView?.classList.contains("active")) return;
        if (this.activeThread) this.renderThread();else this.renderList();
      },
      "openCreateGroup"() {
        if (!this.getSelectedFriend() || this.creatingGroup) return;
        const cphoneCreateGroupFormElement = document.getElementById("cphone-create-group-form"),
          cphoneCreateGroupSheetElement = document.getElementById("cphone-create-group-sheet");
        if (!cphoneCreateGroupFormElement || !cphoneCreateGroupSheetElement) return;
        cphoneCreateGroupFormElement.reset();
        const cphoneCreateGroupErrorElement = document.getElementById("cphone-create-group-error");
        cphoneCreateGroupErrorElement && (cphoneCreateGroupErrorElement.textContent = "", cphoneCreateGroupErrorElement.hidden = true);
        cphoneCreateGroupSheetElement.hidden = false;
        document.getElementById("cphone-create-group-name")?.focus();
      },
      "closeCreateGroup"() {
        if (this.creatingGroup) return;
        const cphoneCreateGroupSheetElement_268 = document.getElementById("cphone-create-group-sheet");
        this.blurActiveWithin(cphoneCreateGroupSheetElement_268);
        if (cphoneCreateGroupSheetElement_268) cphoneCreateGroupSheetElement_268.hidden = true;
      },
      "buildGroupGenerationPrompt"(contact_269, value_270, value_271) {
        return "你要为 " + value_5(contact_269) + " 创建一个真实自然的私人群聊。群名：" + value_270 + "。群聊用途（只给 AI 看，不要写进聊天消息）：" + value_271 + "。\n当前 Char 的人设：" + String(contact_269.persona || contact_269.signature || "未设置").slice(0, 5000) + "。\nUser 从未加入这个群，不能发言，也不能被当作群成员。群里除当前 Char 外，创造 2 到 8 名身份各异的陌生成员；他们与 Char 可以认识，但不要把他们创建为 Char 的通讯录好友。语言以 Char 的 " + (contact_269.language || "zh") + " 设置为主，非中文消息填写自然中文 translation。\n请一次性写出准确 10 轮连续群聊。每轮是一个承接上轮的对话单元，包含 2 到 5 条不同成员接话的短消息；每轮至少两位不同成员发言，当前 Char 至少发言一次。避免整齐轮流、重复话题和旁白。\n只返回合法 JSON，不要 Markdown 或说明。格式：{\"members\":[{\"slot\":\"s1\",\"name\":\"姓名\",\"persona\":\"性格和与群的关系\"}],\"rounds\":[[{\"speaker\":\"char\",\"text\":\"消息\",\"translation\":\"\"},{\"speaker\":\"s1\",\"text\":\"消息\",\"translation\":\"\"}]]}。members 必须 2-8 项，slot 按 s1、s2 递增；rounds 必须恰好 10 项；speaker 只能是 char 或 members 中的 slot。";
      },
      async "requestGroupGeneration"(value_272, value_273, value_274) {
        return this.requestJsonGeneration(this.buildGroupGenerationPrompt(value_272, value_273, value_274));
      },
      async "requestJsonGeneration"(content_2) {
        const value_276 = window.getApiConfig?.() || window.apiConfig || {};
        if (!value_276.endpoint || !value_276.apiKey) throw new Error("请先在系统设置中配置 API");
        const chatCompletionsEndpoint = window.u2Api?.resolveChatCompletionsEndpoint?.(value_276.endpoint);
        if (!chatCompletionsEndpoint) throw new Error("API 地址无效");
        const value_277 = await fetch(chatCompletionsEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + value_276.apiKey
          },
          body: JSON.stringify({
            model: value_276.model || "gpt-3.5-turbo",
            messages: [{
              role: "system",
              content: "你是群聊数据生成助手。只输出严格合法的 JSON。"
            }, {
              role: "user",
              content: content_2
            }],
            temperature: 0.85
          })
        });
        if (!value_277.ok) {
          const value_281 = await window.u2Api?.readApiError?.(value_277);
          throw window.u2Api?.createHttpError?.(value_277, value_281) || Object.assign(new Error("生成失败（HTTP " + value_277.status + "）"), {
            status: value_277.status
          });
        }
        const value_278 = await value_277.json(),
          content_279 = value_278?.choices?.[0]?.message?.content;
        if (typeof content_279 !== "string") throw new Error("API 未返回聊天内容");
        const replace_280 = content_279.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
        try {
          return JSON.parse(replace_280);
        } catch (value_282) {
          throw new Error("AI 返回的聊天格式无效，请重试");
        }
      },
      "normalizeGroupGeneration"(value_283, value_284, value_285) {
        const members_286 = value_283?.members,
          rounds_287 = value_283?.rounds;
        if (!Array.isArray(members_286) || members_286.length < 2 || members_286.length > 8 || !Array.isArray(rounds_287) || rounds_287.length !== 10) throw new Error("AI 未生成 2–8 名成员和准确 10 轮聊天，请重试");
        const value_288 = value_294 => String(value_294 || "").replace(/[<>&"'`\u0000-\u001f]/g, "").trim(),
          value_289 = new Map([["char", {
            id: String(value_284.id),
            nickname: value_5(value_284),
            avatarUrl: value_284.avatarUrl || ""
          }]]),
          members_2 = members_286.map((contact_295, value_296) => {
            const value_288_297 = value_288(contact_295?.slot),
              nickname_2 = value_288(contact_295?.name).slice(0, 40);
            if (value_288_297 !== "s" + (value_296 + 1) || !nickname_2 || nickname_2 === value_5(value_284) || [...value_289.values()].some(value_300 => value_300.nickname === nickname_2)) throw new Error("AI 生成的群成员资料无效，请重试");
            const options_299 = {
              id: value_285 + "-member-" + (value_296 + 1),
              nickname: nickname_2,
              persona: value_288(contact_295?.persona).slice(0, 800),
              language: value_284.language || "zh",
              avatarUrl: ""
            };
            return value_289.set(value_288_297, options_299), options_299;
          }),
          messages_5 = [];
        let enabled = false;
        const value_292 = new Set();
        rounds_287.forEach((items_301, value_302) => {
          if (!Array.isArray(items_301) || items_301.length < 2 || items_301.length > 5) throw new Error("AI 生成的对话轮次无效，请重试");
          const value_303 = new Set();
          items_301.forEach(value_304 => {
            const value_288_305 = value_288(value_304?.speaker),
              result_306 = value_289.get(value_288_305),
              content_3 = String(value_304?.text || "").replace(/[<>\u0000-\u001f]/g, "").trim();
            if (!result_306 || !content_3 || content_3.length > 1000) throw new Error("AI 生成的消息无效，请重试");
            value_303.add(value_288_305);
            value_292.add(value_288_305);
            if (value_288_305 === "char") enabled = true;
            const options_308 = {
                id: value_6("cphone-group-msg"),
                role: "assistant",
                type: "text",
                content: content_3,
                timestamp: 0,
                round: value_302 + 1,
                speakerMemberId: result_306.id,
                speaker: result_306.nickname,
                senderName: result_306.nickname,
                senderAvatarUrl: result_306.avatarUrl || "",
                source: "cphone_generated_group"
              },
              trim_309 = String(value_304?.translation || "").replace(/[<>\u0000-\u001f]/g, "").trim();
            if (trim_309) options_308.translation = trim_309.slice(0, 2000);
            messages_5.push(options_308);
          });
          if (value_303.size < 2) throw new Error("每轮群聊需要不同成员接话，请重试");
        });
        if (!enabled) throw new Error("生成的群聊缺少当前 Char 发言，请重试");
        if (members_2.some((value_310, value_311) => !value_292.has("s" + (value_311 + 1)))) throw new Error("生成的群聊存在未发言成员，请重试");
        const createdAt_2 = Date.now() - messages_5.length * 1000;
        return messages_5.forEach((message_312, value_313) => {
          message_312.timestamp = createdAt_2 + value_313 * 1000;
        }), {
          members: members_2,
          messages: messages_5,
          createdAt: createdAt_2
        };
      },
      async "createGroup"() {
        if (this.creatingGroup) return false;
        const selectedFriend_314 = this.getSelectedFriend(),
          trim_315 = String(document.getElementById("cphone-create-group-name")?.value || "").trim(),
          title_2 = trim_315.replace(/[<>&"'`]/g, "").trim(),
          purpose_2 = String(document.getElementById("cphone-create-group-purpose")?.value || "").trim(),
          trim_318 = String(document.getElementById("cphone-create-group-count")?.value || "").trim(),
          displayCount_2 = Number(trim_318),
          cphoneCreateGroupErrorElement_319 = document.getElementById("cphone-create-group-error"),
          cphoneCreateGroupSubmitElement = document.getElementById("cphone-create-group-submit");
        if (!selectedFriend_314 || !title_2 || title_2 !== trim_315 || title_2.length > 40 || !purpose_2 || purpose_2.length > 2000 || !trim_318 || !Number.isInteger(displayCount_2) || displayCount_2 < 1 || displayCount_2 > 9999) return cphoneCreateGroupErrorElement_319 && (cphoneCreateGroupErrorElement_319.textContent = "请填写有效群名（不含 HTML 符号）、1–9999 的展示人数和用途", cphoneCreateGroupErrorElement_319.hidden = false), false;
        this.creatingGroup = true;
        cphoneCreateGroupSubmitElement && (cphoneCreateGroupSubmitElement.disabled = true, cphoneCreateGroupSubmitElement.textContent = "正在生成群聊…");
        cphoneCreateGroupErrorElement_319 && (cphoneCreateGroupErrorElement_319.textContent = "", cphoneCreateGroupErrorElement_319.hidden = true);
        try {
          const value_320 = await this.requestGroupGeneration(selectedFriend_314, title_2, purpose_2),
            id_2 = value_6("cphone-group"),
            groupGeneration = this.normalizeGroupGeneration(value_320, selectedFriend_314, id_2);
          if (!value_7(selectedFriend_314.id) || this.selectedId !== String(selectedFriend_314.id)) throw new Error("当前 Char 已变化，请重试");
          const options_322 = {
            id: id_2,
            title: title_2,
            displayCount: displayCount_2,
            purpose: purpose_2,
            members: groupGeneration.members,
            messages: groupGeneration.messages,
            createdAt: groupGeneration.createdAt,
            updatedAt: value_8(groupGeneration.messages.at(-1))
          };
          await this.saveCphoneGroups(selectedFriend_314.id, items_324 => {
            if (!value_7(selectedFriend_314.id) || this.selectedId !== String(selectedFriend_314.id)) throw new Error("当前 Char 已变化，请重试");
            items_324.push(options_322);
          });
          this.creatingGroup = false;
          this.closeCreateGroup();
          this.tab = "threads";
          this.renderList();
          const result_323 = this.getThreadRows(this.getSelectedFriend()).find(value_325 => value_325.kind === "cphoneGroup" && value_325.groupId === String(options_322.id));
          if (result_323) await this.openThread(result_323);
          return true;
        } catch (value_326) {
          if (window.u2Api?.isRequestError?.(value_326) && window.u2Api.reportError(value_326, {
            operation: "群聊生成"
          })) {
            if (cphoneCreateGroupErrorElement_319) cphoneCreateGroupErrorElement_319.hidden = true;
          } else cphoneCreateGroupErrorElement_319 && (cphoneCreateGroupErrorElement_319.textContent = value_326?.message || "群聊生成失败，请重试", cphoneCreateGroupErrorElement_319.hidden = false);
          return false;
        } finally {
          this.creatingGroup = false;
          cphoneCreateGroupSubmitElement && (cphoneCreateGroupSubmitElement.disabled = false, cphoneCreateGroupSubmitElement.textContent = "生成 10 轮群聊");
        }
      },
      "progressKey"(value_327) {
        return (value_327?.kind || "") + ":" + (value_327?.groupId || value_327?.chatId || value_327?.targetId || value_327?.title || "");
      },
      "progressMarker"(value_328) {
        const value_329 = Array.isArray(value_328) ? value_328 : [],
          at_330 = value_329.at(-1);
        return value_329.length + ":" + (at_330?.id || "") + ":" + value_8(at_330) + ":" + this.messageText(at_330);
      },
      "openProgress"() {
        const activeThread_331 = this.activeThread;
        if (this.progressing || this.clearing || !activeThread_331 || activeThread_331.kind !== "cphoneGroup" && activeThread_331.kind !== "linked") return;
        const cphoneProgressFormElement = document.getElementById("cphone-progress-form"),
          cphoneProgressSheetElement = document.getElementById("cphone-progress-sheet");
        if (!cphoneProgressFormElement || !cphoneProgressSheetElement) return;
        cphoneProgressFormElement.reset();
        const cphoneProgressRoundsElement = document.getElementById("cphone-progress-rounds");
        if (cphoneProgressRoundsElement) cphoneProgressRoundsElement.value = "10";
        const cphoneProgressErrorElement = document.getElementById("cphone-progress-error");
        cphoneProgressErrorElement && (cphoneProgressErrorElement.hidden = true, cphoneProgressErrorElement.textContent = "");
        cphoneProgressSheetElement.hidden = false;
        cphoneProgressRoundsElement?.focus();
      },
      "closeProgress"(value_332 = false) {
        if (this.progressing && !value_332) return;
        const cphoneProgressSheetElement_333 = document.getElementById("cphone-progress-sheet");
        this.blurActiveWithin(cphoneProgressSheetElement_333);
        if (cphoneProgressSheetElement_333) cphoneProgressSheetElement_333.hidden = true;
      },
      "getProgressCharacters"(value_334, value_335, value_336, value_337) {
        const items_338 = [value_334];
        if (value_335.kind === "cphoneGroup") (value_336.members || []).forEach(value_339 => {
          const value_7_340 = value_7(value_339?.id);
          if (value_7_340?.type === "char" && String(value_7_340.id) !== String(value_334.id)) items_338.push(value_7_340);
        });else value_337?.type === "char" && String(value_337.id) !== String(value_334.id) && items_338.push(value_337);
        return [...new Map(items_338.map(value_341 => [String(value_341.id), value_341])).values()];
      },
      "getCharUserMemory"(value_342) {
        return (Array.isArray(value_342.messages) ? value_342.messages : []).filter(message_343 => (message_343?.role === "user" || message_343?.role === "assistant") && message_343.excludedFromContext !== true && !message_343.noticeKind && this.messageText(message_343) !== "[消息]").slice(-20).map(message_344 => ({
          speaker: message_344.role === "user" ? "User" : value_5(value_342),
          text: this.messageText(message_344).slice(0, 2000),
          translation: String(message_344.translation || "").slice(0, 1000)
        }));
      },
      "getProgressWorldBooks"(items_345, value_346, value_347) {
        const items_348 = ["system_depth", "before_role", "after_role"];
        return items_348.map(value_349 => {
          const items_350 = [],
            globalWorldBookContextByPosition = window.getGlobalWorldBookContextByPosition?.(value_349, value_346);
          if (globalWorldBookContextByPosition) items_350.push("【共用世界书 · " + value_349 + "】\n" + globalWorldBookContextByPosition);
          return items_345.forEach(value_351 => {
            const value_352 = value_346 + "\n" + (value_347.get(String(value_351.id)) || []).map(value_353 => value_353.text).join("\n"),
              worldBookContextForFriendByPosition = window.imApp?.getWorldBookContextForFriendByPosition?.(value_349, value_351, value_352, {
                includeGlobal: false
              });
            if (worldBookContextForFriendByPosition) items_350.push("【" + value_5(value_351) + "（" + value_351.id + "）绑定世界书 · " + value_349 + "｜仅该 Char 可知】\n" + worldBookContextForFriendByPosition);
          }), items_350.join("\n\n");
        }).filter(Boolean).join("\n\n");
      },
      "buildProgressPrompt"(value_354, contact_355, value_356, contact_357, value_358, value_359, value_360, items_361 = [value_354]) {
        const value_362 = new Map(items_361.map(value_368 => [String(value_368.id), this.getCharUserMemory(value_368)])),
          map_363 = (Array.isArray(value_360) ? value_360 : []).slice(-20).map(message_369 => ({
            speaker: contact_355.kind === "cphoneGroup" ? String(message_369.speakerMemberId || message_369.speaker || "") : message_369.role === "char" ? "char" : "account",
            text: this.messageText(message_369).slice(0, 2000),
            translation: String(message_369.translation || "").slice(0, 1000)
          })),
          join_364 = [value_359, contact_355.title, value_356?.purpose, ...map_363.map(value_370 => value_370.text)].filter(Boolean).join("\n"),
          progressWorldBooks = this.getProgressWorldBooks(items_361, join_364, value_362),
          map_365 = items_361.map(contact_371 => ({
            id: String(contact_371.id),
            name: value_5(contact_371),
            persona: String(contact_371.persona || contact_371.signature || "未设置").slice(0, 5000)
          })),
          map_366 = items_361.map(value_372 => ({
            charId: String(value_372.id),
            charName: value_5(value_372),
            userChat: value_362.get(String(value_372.id))
          })),
          value_367 = "你要续写 " + value_5(value_354) + " 手机里的真实聊天。只返回严格合法 JSON，不要说明或 Markdown。准确生成 " + value_358 + " 轮。聊天方向：" + (value_359 || "自行选择自然的发展方向") + "。\n参与的 Char 人设：" + JSON.stringify(map_365) + "。\n以下每位 Char 与 User 的最近 20 条私聊、以及其绑定世界书，分别只属于标注的 Char 的私人记忆；其他角色默认不知道内容，除非该 Char 在当前会话中自然透露。不得让 User 参与当前会话或代 User 发言。\n各 Char 私人记忆：" + JSON.stringify(map_366) + "\n世界书：" + (progressWorldBooks || "无") + "\n当前会话最近消息：" + JSON.stringify(map_363) + "\n非中文消息请提供自然中文 translation；中文消息的 translation 留空。每条消息 text 不超过 1000 字。";
        if (contact_355.kind === "cphoneGroup") {
          const map_373 = (value_356.members || []).map((contact_374, value_375) => ({
            slot: "m" + (value_375 + 1),
            id: contact_374.id,
            name: contact_374.nickname,
            persona: contact_374.persona || ""
          }));
          return value_367 + "\n群名：" + value_356.title + "。群聊用途（只供 AI 参考，不写入消息）：" + (value_356.purpose || "未设置") + "。成员：" + JSON.stringify([{
            slot: "char",
            id: value_354.id,
            name: value_5(value_354)
          }, ...map_373]) + "。沿用这些成员，不得新增成员。每轮 2 到 5 条消息，至少两位不同成员发言，整批至少包含一次 Char 发言。\n格式：{\"rounds\":[[{\"speaker\":\"char\",\"text\":\"原文\",\"translation\":\"\"},{\"speaker\":\"m1\",\"text\":\"原文\",\"translation\":\"\"}]]}。speaker 只能为 char 或列出的 m 序号，rounds 必须恰好 " + value_358 + " 项。";
        }
        return value_367 + "\n联系人：" + JSON.stringify({
          name: contact_355.title,
          relationship: contact_355.relationship || contact_357?.relationship || "",
          persona: contact_355.persona || contact_357?.persona || ""
        }) + "。每轮 2 到 5 条消息，Char 与联系人双方都必须发言，顺序自然。\n格式：{\"rounds\":[[{\"speaker\":\"char\",\"text\":\"原文\",\"translation\":\"\"},{\"speaker\":\"account\",\"text\":\"原文\",\"translation\":\"\"}]]}。speaker 只能为 char 或 account，rounds 必须恰好 " + value_358 + " 项。";
      },
      "normalizeProgressRounds"(value_376, value_377, value_378, value_379) {
        if (!Array.isArray(value_376?.rounds) || value_376.rounds.length !== value_379) throw new Error("AI 未生成准确 " + value_379 + " 轮聊天，请重试");
        const value_380 = value_377.kind === "cphoneGroup" ? new Set(["char", ...(value_378.members || []).map((value_384, value_385) => "m" + (value_385 + 1))]) : new Set(["char", "account"]);
        let enabled_381 = false;
        const value_382 = value_386 => String(value_386 || "").replace(/[<>\u0000-\u001f]/g, "").trim(),
          map_383 = value_376.rounds.map((items_387, value_388) => {
            if (!Array.isArray(items_387) || items_387.length < 2 || items_387.length > 5) throw new Error("AI 返回的对话轮次无效，请重试");
            const value_389 = new Set(),
              map_390 = items_387.map(value_391 => {
                const speaker_2 = String(value_391?.speaker || "").trim(),
                  text_3 = value_382(value_391?.text);
                if (!value_380.has(speaker_2) || !text_3 || text_3.length > 1000) throw new Error("AI 返回的消息或发送者无效，请重试");
                value_389.add(speaker_2);
                if (speaker_2 === "char") enabled_381 = true;
                return {
                  speaker: speaker_2,
                  text: text_3,
                  translation: value_382(value_391?.translation).slice(0, 2000),
                  round: value_388 + 1
                };
              });
            if (value_377.kind === "cphoneGroup" ? value_389.size < 2 : !value_389.has("char") || !value_389.has("account")) throw new Error("每轮需要不同成员接话，请重试");
            return map_390;
          });
        if (!enabled_381) throw new Error("生成内容缺少 Char 发言，请重试");
        return map_383.flat();
      },
      "materializeProgress"(items_394, value_395, value_396, value_397, value_398) {
        const value_399 = Array.isArray(value_395) ? value_395 : [],
          reduce_400 = value_399.reduce((value_402, value_403) => Math.max(value_402, Number(value_403.round) || 0), 0),
          max_401 = Math.max(Date.now(), value_8(value_399.at(-1)) + 1);
        return items_394.map((value_404, value_405) => {
          const options_406 = {
            id: value_6("cphone-progress-msg"),
            timestamp: max_401 + value_405,
            round: reduce_400 + value_404.round,
            translation: value_404.translation
          };
          if (value_396.kind === "cphoneGroup") {
            const value_407 = value_404.speaker === "char" ? value_397 : value_398.members[Number(value_404.speaker.slice(1)) - 1];
            return {
              ...options_406,
              role: "assistant",
              type: "text",
              content: value_404.text,
              speakerMemberId: value_407.id,
              speaker: value_5(value_407),
              senderName: value_5(value_407),
              source: "cphone_progress"
            };
          }
          return {
            ...options_406,
            role: value_404.speaker === "char" ? "char" : "account",
            text: value_404.text
          };
        });
      },
      "appendLinkedProgress"(value_408, value_409, contact_410, items_411, value_412 = false) {
        value_408.linkedAccountChats = window.imApp?.normalizeLinkedAccountChats ? window.imApp.normalizeLinkedAccountChats(value_408.linkedAccountChats) : Array.isArray(value_408.linkedAccountChats) ? value_408.linkedAccountChats : [];
        const sourceNpcId_2 = String(value_409?.id || contact_410.targetId || "");
        let result_414 = value_408.linkedAccountChats.find(value_415 => contact_410.chatId && String(value_415.id) === String(contact_410.chatId));
        if (!result_414 && sourceNpcId_2) result_414 = value_408.linkedAccountChats.find(value_416 => String(value_416.sourceNpcId || "") === sourceNpcId_2);
        if (!result_414) {
          const value_417 = value_409 ? value_5(value_409) : contact_410.title;
          result_414 = {
            id: value_6("linked-chat"),
            name: value_417,
            realName: value_409?.realName || value_417,
            remark: value_417,
            relationship: contact_410.relationship || "",
            persona: contact_410.persona || "",
            sourceNpcId: sourceNpcId_2,
            messages: [],
            createdAt: items_411[0].timestamp,
            updatedAt: items_411.at(-1).timestamp,
            readAt: 0
          };
          value_408.linkedAccountChats.unshift(result_414);
        }
        if (sourceNpcId_2 && !result_414.sourceNpcId) result_414.sourceNpcId = sourceNpcId_2;
        return result_414.messages = Array.isArray(result_414.messages) ? result_414.messages : [], result_414.messages.push(...items_411.map(message_418 => ({
          ...message_418,
          role: value_412 ? message_418.role === "char" ? "account" : "char" : message_418.role
        }))), result_414.updatedAt = items_411.at(-1).timestamp, result_414.id;
      },
      async "saveLinkedProgress"(value_419, value_420, value_421, value_422, value_423 = "") {
        const result_424 = this.getLinkedChats(value_419).find(value_429 => String(value_429.id) === String(value_420.chatId)),
          value_425 = value_420.targetId || result_424?.sourceNpcId || "",
          value_426 = value_425 ? value_7(value_425) : null;
        let chatId_2 = "";
        if (value_426?.type === "char" && String(value_426.id) !== String(value_419.id)) {
          const value_430 = await window.imApp?.commitFriendsChange?.(() => {
            const value_7_431 = value_7(value_419.id),
              value_7_432 = value_7(value_426.id);
            if (!value_7_431 || !value_7_432) throw new Error("角色不存在");
            if (this.selectedId !== String(value_419.id) || this.progressKey(this.activeThread) !== this.progressKey(value_420)) throw new Error("当前 Char 或会话已变化");
            const value_433 = this.getLinkedChats(value_7_431).find(value_437 => String(value_437.id) === String(value_420.chatId)) || this.getLinkedChats(value_7_431).find(value_438 => value_425 && String(value_438.sourceNpcId) === String(value_425));
            if (this.progressMarker(value_433?.messages) !== value_422) throw new Error("会话已更新，请重试");
            const result_434 = this.getLinkedChats(value_7_432).find(value_439 => String(value_439.sourceNpcId || "") === String(value_7_431.id));
            if (this.progressMarker(result_434?.messages) !== value_423) throw new Error("对方会话已更新，请重试");
            const sort_435 = [...(value_433?.messages || []), ...(result_434?.messages || [])].sort((value_440, value_441) => value_8(value_440) - value_8(value_441)),
              materializeProgress_436 = this.materializeProgress(value_421, sort_435, value_420, value_7_431);
            chatId_2 = this.appendLinkedProgress(value_7_431, value_7_432, value_420, materializeProgress_436);
            this.appendLinkedProgress(value_7_432, value_7_431, {
              title: value_5(value_7_431),
              targetId: String(value_7_431.id)
            }, materializeProgress_436, true);
          }, {
            friendIds: [value_419.id, value_426.id],
            silent: true
          });
          if (!value_430) return false;
          window.dispatchEvent(new CustomEvent("u2:linked-accounts-changed", {
            detail: {
              friendId: String(value_426.id),
              changedCount: value_421.length
            }
          }));
        } else {
          const value_442 = await window.imApp?.commitFriendChange?.(value_419.id, value_443 => {
            if (!value_443) throw new Error("角色不存在");
            if (this.selectedId !== String(value_419.id) || this.progressKey(this.activeThread) !== this.progressKey(value_420)) throw new Error("当前 Char 或会话已变化");
            const value_444 = this.getLinkedChats(value_443).find(value_446 => String(value_446.id) === String(value_420.chatId)) || this.getLinkedChats(value_443).find(value_447 => value_425 && String(value_447.sourceNpcId) === String(value_425));
            if (this.progressMarker(value_444?.messages) !== value_422) throw new Error("会话已更新，请重试");
            const materializeProgress_445 = this.materializeProgress(value_421, value_444?.messages, value_420, value_443);
            chatId_2 = this.appendLinkedProgress(value_443, value_426, value_420, materializeProgress_445);
          }, {
            silent: true,
            metaOnly: true
          });
          if (!value_442) return false;
        }
        const progressKey_428 = this.progressKey(value_420);
        value_420.chatId = chatId_2;
        if (this.activeThread && this.progressKey(this.activeThread) === progressKey_428) this.activeThread.chatId = chatId_2;
        return window.dispatchEvent(new CustomEvent("u2:linked-accounts-changed", {
          detail: {
            friendId: String(value_419.id),
            changedCount: value_421.length
          }
        })), window.imApp?.requestChatsListRefresh?.(), true;
      },
      async "clearThread"() {
        if (this.clearing || this.progressing || !this.activeThread) return false;
        const selectedFriend_448 = this.getSelectedFriend(),
          options_449 = {
            ...this.activeThread
          };
        if (!selectedFriend_448 || options_449.kind !== "cphoneGroup" && options_449.kind !== "linked" || !this.currentMessages().length) return false;
        const value_450 = options_449.kind === "linked" ? this.getLinkedChats(selectedFriend_448).find(value_455 => String(value_455.id) === String(options_449.chatId)) : null,
          value_451 = options_449.targetId || value_450?.sourceNpcId || "",
          value_452 = value_451 ? value_7(value_451) : null,
          value_453 = value_452?.type === "char" && String(value_452.id) !== String(selectedFriend_448.id) ? "确定清空当前聊天记录吗？对方 Char 手机中的对应聊天也会清空，此操作无法撤销。" : "确定清空当前聊天记录吗？此操作无法撤销。";
        if (typeof window.confirm !== "function" || !window.confirm(value_453)) return false;
        this.clearing = true;
        const cphoneClearChatElement_454 = document.getElementById("cphone-clear-chat"),
          cphoneProgressOpenElement = document.getElementById("cphone-progress-open");
        if (cphoneClearChatElement_454) cphoneClearChatElement_454.disabled = true;
        if (cphoneProgressOpenElement) cphoneProgressOpenElement.disabled = true;
        try {
          const value_456 = () => this.selectedId === String(selectedFriend_448.id) && this.progressKey(this.activeThread) === this.progressKey(options_449);
          if (options_449.kind === "cphoneGroup") await this.saveCphoneGroups(selectedFriend_448.id, value_457 => {
            if (!value_456()) throw new Error("当前 Char 或会话已变化");
            const result_458 = value_457.find(value_459 => String(value_459.id) === String(options_449.groupId));
            if (!result_458) throw new Error("群聊不存在");
            result_458.messages = [];
            result_458.updatedAt = Date.now();
          });else {
            if (value_452?.type === "char" && String(value_452.id) !== String(selectedFriend_448.id)) {
              const value_460 = await window.imApp?.commitFriendsChange?.(() => {
                if (!value_456()) throw new Error("当前 Char 或会话已变化");
                const value_7_461 = value_7(selectedFriend_448.id),
                  value_7_462 = value_7(value_452.id);
                if (!value_7_461 || !value_7_462) throw new Error("角色不存在");
                value_7_461.linkedAccountChats = this.getLinkedChats(value_7_461);
                const value_463 = value_7_461.linkedAccountChats.find(value_465 => String(value_465.id) === String(options_449.chatId)) || value_7_461.linkedAccountChats.find(value_466 => String(value_466.sourceNpcId || "") === String(value_452.id));
                if (!value_463) throw new Error("会话不存在");
                value_463.messages = [];
                value_463.updatedAt = Date.now();
                value_7_462.linkedAccountChats = this.getLinkedChats(value_7_462);
                const result_464 = value_7_462.linkedAccountChats.find(value_467 => String(value_467.sourceNpcId || "") === String(value_7_461.id));
                result_464 && (result_464.messages = [], result_464.updatedAt = value_463.updatedAt);
              }, {
                friendIds: [selectedFriend_448.id, value_452.id],
                silent: true
              });
              if (!value_460) throw new Error("清空失败，聊天记录已恢复");
              window.dispatchEvent(new CustomEvent("u2:linked-accounts-changed", {
                detail: {
                  friendId: String(value_452.id),
                  changedCount: 1
                }
              }));
            } else {
              const value_468 = await window.imApp?.commitFriendChange?.(selectedFriend_448.id, value_469 => {
                if (!value_456() || !value_469) throw new Error("当前 Char 或会话已变化");
                value_469.linkedAccountChats = this.getLinkedChats(value_469);
                const value_470 = value_469.linkedAccountChats.find(value_471 => String(value_471.id) === String(options_449.chatId)) || value_469.linkedAccountChats.find(value_472 => value_451 && String(value_472.sourceNpcId || "") === String(value_451));
                if (!value_470) throw new Error("会话不存在");
                value_470.messages = [];
                value_470.updatedAt = Date.now();
              }, {
                silent: true,
                metaOnly: true
              });
              if (!value_468) throw new Error("清空失败，聊天记录已恢复");
            }
          }
          options_449.kind === "linked" && (window.dispatchEvent(new CustomEvent("u2:linked-accounts-changed", {
            detail: {
              friendId: String(selectedFriend_448.id),
              changedCount: 1
            }
          })), window.imApp?.requestChatsListRefresh?.());
          if (value_456()) this.renderThread();
          return true;
        } catch (value_473) {
          return window.showToast?.(value_473?.message || "清空失败，聊天记录已恢复"), false;
        } finally {
          this.clearing = false;
          if (cphoneProgressOpenElement) cphoneProgressOpenElement.disabled = false;
          if (cphoneClearChatElement_454) cphoneClearChatElement_454.disabled = !this.currentMessages().length;
        }
      },
      async "progressThread"() {
        if (this.progressing || this.clearing || !this.activeThread) return false;
        const selectedFriend_474 = this.getSelectedFriend(),
          options_475 = {
            ...this.activeThread
          };
        if (!selectedFriend_474 || options_475.kind !== "cphoneGroup" && options_475.kind !== "linked") return false;
        const trim_476 = String(document.getElementById("cphone-progress-rounds")?.value || "").trim(),
          number_477 = Number(trim_476),
          trim_478 = String(document.getElementById("cphone-progress-direction")?.value || "").trim(),
          cphoneProgressErrorElement_479 = document.getElementById("cphone-progress-error"),
          cphoneProgressSubmitElement = document.getElementById("cphone-progress-submit");
        if (!trim_476 || !Number.isInteger(number_477) || number_477 < 1 || number_477 > 20 || trim_478.length > 1000) return cphoneProgressErrorElement_479 && (cphoneProgressErrorElement_479.textContent = "请选择 1–20 轮，聊天方向不超过 1000 字", cphoneProgressErrorElement_479.hidden = false), false;
        this.progressing = true;
        cphoneProgressSubmitElement && (cphoneProgressSubmitElement.disabled = true, cphoneProgressSubmitElement.textContent = "正在推进…");
        cphoneProgressErrorElement_479 && (cphoneProgressErrorElement_479.hidden = true, cphoneProgressErrorElement_479.textContent = "");
        try {
          await window.imApp?.ensureFriendMessagesLoaded?.(selectedFriend_474);
          if (this.selectedId !== String(selectedFriend_474.id) || this.progressKey(this.activeThread) !== this.progressKey(options_475)) throw new Error("当前 Char 或会话已变化，请重试");
          const value_480 = options_475.kind === "cphoneGroup" ? this.getCphoneGroups(selectedFriend_474).find(value_488 => String(value_488.id) === String(options_475.groupId)) : null;
          if (options_475.kind === "cphoneGroup" && !value_480) throw new Error("群聊不存在");
          const value_481 = options_475.kind === "linked" ? this.getLinkedChats(selectedFriend_474).find(value_489 => String(value_489.id) === String(options_475.chatId)) : null,
            value_482 = options_475.targetId || value_481?.sourceNpcId || "",
            value_483 = options_475.kind === "linked" && value_482 ? value_7(value_482) : null,
            progressCharacters = this.getProgressCharacters(selectedFriend_474, options_475, value_480, value_483);
          for (const value_490 of progressCharacters) {
            if (String(value_490.id) !== String(selectedFriend_474.id)) await window.imApp?.ensureFriendMessagesLoaded?.(value_490);
          }
          const currentMessages_484 = this.currentMessages(),
            progressMarker_485 = this.progressMarker(currentMessages_484),
            value_486 = value_483?.type === "char" ? this.progressMarker(this.getLinkedChats(value_483).find(value_491 => String(value_491.sourceNpcId || "") === String(selectedFriend_474.id))?.messages) : "",
            value_487 = await this.requestJsonGeneration(this.buildProgressPrompt(selectedFriend_474, options_475, value_480, value_483, number_477, trim_478, currentMessages_484, progressCharacters)),
            progressRounds = this.normalizeProgressRounds(value_487, options_475, value_480, number_477);
          if (this.selectedId !== String(selectedFriend_474.id) || !value_7(selectedFriend_474.id) || this.progressKey(this.activeThread) !== this.progressKey(options_475)) throw new Error("当前 Char 或会话已变化，请重试");
          if (options_475.kind === "cphoneGroup") await this.saveCphoneGroups(selectedFriend_474.id, value_492 => {
            if (this.selectedId !== String(selectedFriend_474.id) || this.progressKey(this.activeThread) !== this.progressKey(options_475)) throw new Error("当前 Char 或会话已变化");
            const result_493 = value_492.find(value_495 => String(value_495.id) === String(options_475.groupId));
            if (!result_493 || this.progressMarker(result_493.messages) !== progressMarker_485) throw new Error("群聊已更新，请重试");
            const materializeProgress_494 = this.materializeProgress(progressRounds, result_493.messages, options_475, selectedFriend_474, result_493);
            result_493.messages = Array.isArray(result_493.messages) ? result_493.messages : [];
            result_493.messages.push(...materializeProgress_494);
            result_493.updatedAt = materializeProgress_494.at(-1).timestamp;
          });else {
            if (!(await this.saveLinkedProgress(selectedFriend_474, options_475, progressRounds, progressMarker_485, value_486))) throw new Error("聊天保存失败，已撤销本次推进");
          }
          this.progressing = false;
          this.closeProgress();
          if (this.activeThread && this.selectedId === String(selectedFriend_474.id)) this.renderThread();
          return true;
        } catch (value_496) {
          if (window.u2Api?.isRequestError?.(value_496) && window.u2Api.reportError(value_496, {
            operation: "聊天推进"
          })) {
            if (cphoneProgressErrorElement_479) cphoneProgressErrorElement_479.hidden = true;
          } else cphoneProgressErrorElement_479 && (cphoneProgressErrorElement_479.textContent = value_496?.message || "聊天推进失败，请重试", cphoneProgressErrorElement_479.hidden = false);
          return false;
        } finally {
          this.progressing = false;
          cphoneProgressSubmitElement && (cphoneProgressSubmitElement.disabled = false, cphoneProgressSubmitElement.textContent = "生成聊天");
        }
      }
    };
  window.cphoneApp = cphoneApp_2;
  (window.u2OnStorageReady || (handleDOMContentLoaded => document.addEventListener("DOMContentLoaded", handleDOMContentLoaded)))(() => cphoneApp_2.init());
})();
