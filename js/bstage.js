(window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(() => {
  const bstageView = document.createElement("div");
  bstageView.className = "app-view bstage-view";
  bstageView.id = "bstage-view";
  bstageView.innerHTML = "\n        <!-- Header -->\n        <div class=\"bstage-header\">\n            <div class=\"bstage-logo\" id=\"bstage-back-btn\">b.stage</div>\n            <div class=\"bstage-header-right\">\n                <i class=\"fas fa-search bstage-icon-btn\" id=\"bstage-search-generate-btn\"></i>\n                <i class=\"fas fa-cog bstage-icon-btn\" id=\"bstage-global-settings-btn\"></i>\n                <div class=\"bstage-avatar-placeholder\" id=\"bstage-header-profile-container\"><i class=\"fas fa-user\"></i></div>\n            </div>\n        </div>\n\n        <!-- Following Bar -->\n        <div class=\"bstage-following-bar\" id=\"bstage-following-bar\">\n            <!-- Add Button -->\n            <div class=\"bstage-team-item\" id=\"bstage-create-team-btn\">\n                <div class=\"bstage-create-btn\">\n                    <i class=\"fas fa-plus\"></i>\n                </div>\n                <div class=\"bstage-team-name\">创建</div>\n            </div>\n            <!-- Teams will be injected here -->\n        </div>\n\n        <!-- Content Area -->\n        <div class=\"bstage-content-area\" id=\"bstage-content-area\">\n            <!-- Default Empty State or Team View -->\n            <div style=\"height: 100%; display: flex; justify-content: center; align-items: center; color: #333; font-size: 14px;\">\n                请选择或创建一个团队\n            </div>\n        </div>\n\n        <!-- Floating Bottom Nav (Hidden by default) -->\n        <div class=\"bstage-bottom-nav-container\" id=\"bstage-bottom-nav\" style=\"display: none;\">\n            <div class=\"bstage-bottom-nav\">\n                <div class=\"bstage-nav-indicator\"></div>\n                <div class=\"bstage-nav-item active\" data-tab=\"home\">Home</div>\n                <div class=\"bstage-nav-item\" data-tab=\"content\">Content</div>\n                <div class=\"bstage-nav-item\" data-tab=\"shop\">Shop</div>\n                <div class=\"bstage-nav-item\" data-tab=\"pop\">Pop</div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(bstageView);
  const bstageChatView = document.createElement("div");
  bstageChatView.className = "app-view bstage-chat-view";
  bstageChatView.id = "bstage-chat-view";
  bstageChatView.style.backgroundColor = "#1c1c1e";
  bstageChatView.innerHTML = "\n        <div class=\"bstage-header chat-header\" style=\"background-color: transparent;\">\n            <div class=\"bstage-icon-btn\" id=\"bstage-chat-back-btn\"><i class=\"fas fa-chevron-left\"></i></div>\n            <div class=\"bstage-chat-header-info\">\n                <div class=\"bstage-chat-name\" id=\"bstage-chat-name\">Name</div>\n                <div class=\"bstage-chat-days\" id=\"bstage-chat-days\">已一同 1 天</div>\n            </div>\n            <div class=\"bstage-icon-btn\" id=\"bstage-chat-menu-btn\"><i class=\"fas fa-bars\"></i></div>\n        </div>\n        <div class=\"bstage-chat-content\" id=\"bstage-chat-content\">\n            <!-- Messages go here -->\n        </div>\n        <div class=\"bstage-chat-input-area\">\n            <div class=\"bstage-reply-preview\" id=\"bstage-chat-reply-preview\" style=\"display:none;\">\n                <div class=\"bstage-reply-preview-content\">\n                    <div class=\"bstage-reply-preview-label\">正在回复</div>\n                    <div class=\"bstage-reply-preview-text\" id=\"bstage-chat-reply-preview-text\"></div>\n                </div>\n                <div class=\"bstage-reply-preview-close\" id=\"bstage-chat-reply-cancel-btn\" role=\"button\" tabindex=\"0\" aria-label=\"取消回复\" title=\"取消回复\">\n                    <i class=\"fas fa-times\"></i>\n                </div>\n            </div>\n            <div class=\"bstage-chat-input-wrapper\">\n                <input type=\"text\" id=\"bstage-chat-input\" inputmode=\"text\" enterkeyhint=\"send\" autocomplete=\"off\" autocapitalize=\"sentences\" placeholder=\"Send a message...\" style=\"color: #fff; background-color: transparent; border: none; outline: none;\">\n                <div id=\"bstage-chat-send-btn\" class=\"bstage-chat-action-btn bstage-chat-send-btn\" role=\"button\" tabindex=\"0\" aria-label=\"发送消息\" title=\"发送消息\">\n                    <i class=\"fas fa-paper-plane\"></i>\n                </div>\n                <div id=\"bstage-chat-api-btn\" class=\"bstage-chat-action-btn bstage-chat-api-btn\" role=\"button\" tabindex=\"0\" aria-label=\"调用 API\" title=\"调用 API\">\n                    <i class=\"fas fa-arrow-down\"></i>\n                </div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(bstageChatView);
  const bstageFanChatView = document.createElement("div");
  bstageFanChatView.className = "app-view bstage-chat-view bstage-fan-chat-view";
  bstageFanChatView.id = "bstage-fan-chat-view";
  bstageFanChatView.style.backgroundColor = "#1c1c1e";
  bstageFanChatView.innerHTML = "\n        <div class=\"bstage-header chat-header\" style=\"background-color: transparent;\">\n            <div class=\"bstage-icon-btn\" id=\"bstage-fan-chat-back-btn\"><i class=\"fas fa-chevron-left\"></i></div>\n            <div class=\"bstage-chat-header-info\">\n                <div class=\"bstage-chat-name\" id=\"bstage-fan-chat-name\">粉丝聊天室</div>\n                <div class=\"bstage-chat-days\" id=\"bstage-fan-chat-subtitle\">已订阅 0 人</div>\n            </div>\n            <div class=\"bstage-icon-btn\" id=\"bstage-fan-chat-menu-btn\"><i class=\"fas fa-bars\"></i></div>\n        </div>\n        <div class=\"bstage-chat-content\" id=\"bstage-fan-chat-content\">\n            <!-- Fan messages go here -->\n        </div>\n        <div class=\"bstage-chat-input-area\">\n            <div class=\"bstage-reply-preview\" id=\"bstage-fan-chat-reply-preview\" style=\"display:none;\">\n                <div class=\"bstage-reply-preview-content\">\n                    <div class=\"bstage-reply-preview-label\">正在回复</div>\n                    <div class=\"bstage-reply-preview-text\" id=\"bstage-fan-chat-reply-preview-text\"></div>\n                </div>\n                <div class=\"bstage-reply-preview-close\" id=\"bstage-fan-chat-reply-cancel-btn\" role=\"button\" tabindex=\"0\" aria-label=\"取消回复\" title=\"取消回复\">\n                    <i class=\"fas fa-times\"></i>\n                </div>\n            </div>\n            <div class=\"bstage-chat-input-wrapper\">\n                <input type=\"text\" id=\"bstage-fan-chat-input\" inputmode=\"text\" enterkeyhint=\"send\" autocomplete=\"off\" autocapitalize=\"sentences\" placeholder=\"对粉丝说点什么...\" style=\"color: #fff; background-color: transparent; border: none; outline: none;\">\n                <div id=\"bstage-fan-chat-send-btn\" class=\"bstage-chat-action-btn bstage-chat-send-btn\" role=\"button\" tabindex=\"0\" aria-label=\"发送消息\" title=\"发送消息\">\n                    <i class=\"fas fa-paper-plane\"></i>\n                </div>\n                <div id=\"bstage-fan-chat-api-btn\" class=\"bstage-chat-action-btn bstage-chat-api-btn\" role=\"button\" tabindex=\"0\" aria-label=\"调用 API\" title=\"调用 API\">\n                    <i class=\"fas fa-arrow-down\"></i>\n                </div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(bstageFanChatView);
  const bstageOtherFansModal = document.createElement("div");
  bstageOtherFansModal.className = "bstage-center-modal-overlay";
  bstageOtherFansModal.id = "bstage-other-fans-modal";
  bstageOtherFansModal.innerHTML = "\n        <section class=\"bstage-center-modal-card\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"bstage-other-fans-title\">\n            <div class=\"bstage-center-modal-heading\">\n                <div>\n                    <small>OTHER FANS</small>\n                    <h2 id=\"bstage-other-fans-title\">其他人的消息</h2>\n                </div>\n                <button type=\"button\" class=\"bstage-center-modal-close\" id=\"bstage-other-fans-close-btn\" aria-label=\"关闭\">\n                    <i class=\"fas fa-times\"></i>\n                </button>\n            </div>\n            <div class=\"bstage-other-fans-list\" id=\"bstage-other-fans-list\"></div>\n        </section>\n    ";
  document.getElementById("app").appendChild(bstageOtherFansModal);
  bstageOtherFansModal.addEventListener("click", event_2 => {
    if (event_2.target === bstageOtherFansModal) closeOtherFansModal();
  });
  const otherFansCloseBtn = bstageOtherFansModal.querySelector("#bstage-other-fans-close-btn");
  if (otherFansCloseBtn) otherFansCloseBtn.addEventListener("click", closeOtherFansModal);
  const globalSettingsModal = document.createElement("div");
  globalSettingsModal.className = "bottom-sheet-overlay detail-sheet-overlay";
  globalSettingsModal.id = "bstage-global-settings-modal";
  globalSettingsModal.style.zIndex = "2000";
  globalSettingsModal.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"height: 90%; background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"sheet-title\" style=\"color: #fff;\">CSS 预设管理</div>\n            <div class=\"detail-sheet-content\" style=\"padding-bottom: 20px;\">\n                <div style=\"display: flex; gap: 10px; margin-bottom: 15px;\">\n                    <button class=\"bstage-preset-tab active\" data-type=\"chatCss\" style=\"flex: 1; padding: 8px; background: #fff; color: #000; border-radius: 8px; border: none; font-weight: bold;\">聊天界面</button>\n                    <button class=\"bstage-preset-tab\" data-type=\"avatarFrameCss\" style=\"flex: 1; padding: 8px; background: #2c2c2e; color: #fff; border-radius: 8px; border: none; font-weight: bold;\">头像框</button>\n                    <button class=\"bstage-preset-tab\" data-type=\"bubbleCss\" style=\"flex: 1; padding: 8px; background: #2c2c2e; color: #fff; border-radius: 8px; border: none; font-weight: bold;\">气泡</button>\n                </div>\n                \n                <div id=\"bstage-preset-list\" style=\"display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px; max-height: 200px; overflow-y: auto;\">\n                    <!-- 预设列表将在这里渲染 -->\n                </div>\n                \n                <div class=\"bstage-form-group\" style=\"background-color: #2c2c2e; border-color: #333;\">\n                    <div class=\"bstage-form-item\" style=\"border-bottom-color: #444;\">\n                        <input type=\"text\" id=\"bstage-preset-name-input\" placeholder=\"预设名称\" style=\"color: #fff; background-color: transparent; border: none; outline: none; width: 100%; padding: 8px 0;\">\n                    </div>\n                    <div class=\"bstage-form-item\">\n                        <textarea id=\"bstage-preset-css-input\" placeholder=\"输入 CSS 代码...\" style=\"color: #fff; background-color: transparent; border: none; outline: none; width: 100%; padding: 8px 0; height: 100px;\"></textarea>\n                    </div>\n                </div>\n                <div class=\"sheet-action confirm-action\" id=\"bstage-save-preset-btn\" style=\"background-color: #007aff; color: #fff; margin-top: 15px;\">保存为新预设</div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(globalSettingsModal);
  const searchGenerateModal = document.createElement("div");
  searchGenerateModal.className = "bottom-sheet-overlay detail-sheet-overlay";
  searchGenerateModal.id = "bstage-search-generate-modal";
  searchGenerateModal.style.zIndex = "1200";
  searchGenerateModal.innerHTML = "\n        <div class=\"bottom-sheet bstage-search-generate-sheet\" style=\"background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"sheet-title\" style=\"color: #fff;\">搜索生成团队</div>\n            <div class=\"detail-sheet-content bstage-modal-content\">\n                <div class=\"bstage-search-generate-hint\">输入想搜索的团队或明星，AI 会按内容生成团队资料和成员设定；留空则随机生成。</div>\n                <div class=\"bstage-search-form\">\n                    <label class=\"bstage-search-label\" for=\"bstage-search-query-input\">搜索内容</label>\n                    <input type=\"text\" id=\"bstage-search-query-input\" class=\"bstage-search-input\" placeholder=\"例如：韩系男团、清冷女演员、摇滚乐队；留空随机\">\n                </div>\n                <div class=\"bstage-search-form\">\n                    <label class=\"bstage-search-label\" for=\"bstage-search-member-count\">团队人数</label>\n                    <input type=\"number\" id=\"bstage-search-member-count\" class=\"bstage-search-input\" value=\"1\" min=\"1\" max=\"12\" step=\"1\" inputmode=\"numeric\">\n                </div>\n                <div id=\"bstage-search-loading\" class=\"bstage-search-loading\" style=\"display:none;\">\n                    <i class=\"fas fa-spinner\"></i>\n                    <span>正在生成团队...</span>\n                </div>\n                <div class=\"sheet-action confirm-action bstage-search-confirm-btn\" id=\"bstage-search-confirm-btn\" style=\"background-color: #fff; color: #000;\">生成团队</div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(searchGenerateModal);
  const createTeamSheet = document.createElement("div");
  createTeamSheet.className = "bottom-sheet-overlay detail-sheet-overlay";
  createTeamSheet.id = "bstage-create-sheet";
  createTeamSheet.style.zIndex = "200";
  createTeamSheet.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"height: 80%; background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"sheet-title\" style=\"color: #fff;\">创建团队</div>\n            <div class=\"detail-sheet-content\">\n                <!-- Team Background -->\n                <div class=\"sheet-title\" style=\"margin-top: 0; margin-bottom: 10px; color: #aaa; font-size: 14px;\">主页背景</div>\n                <div class=\"bstage-bg-upload\" id=\"bstage-team-bg-upload\" style=\"background-color: #2c2c2e; border-color: #444; overflow: hidden; position: relative;\">\n                    <span style=\"color: #aaa; font-size: 14px; position: relative; z-index: 1;\">点击上传背景图</span>\n                    <img id=\"bstage-team-bg-preview\" src=\"\" style=\"width: 100%; height: 100%; object-fit: cover; display: none; position: absolute; top: 0; left: 0; z-index: 0;\">\n                    <input type=\"file\" accept=\"image/*\" style=\"display:none;\">\n                </div>\n\n                <!-- Team Avatar -->\n                <div class=\"bstage-avatar-upload\" id=\"bstage-team-avatar-upload\" style=\"background-color: #2c2c2e; margin-top: -60px; position: relative; z-index: 2; border: 4px solid #1c1c1e; overflow: hidden;\">\n                    <i class=\"fas fa-camera\" style=\"color: #aaa; position: relative; z-index: 1;\"></i>\n                    <img id=\"bstage-team-avatar-preview\" src=\"\" style=\"width: 100%; height: 100%; object-fit: cover; display: none; position: absolute; top: 0; left: 0; z-index: 0;\">\n                    <input type=\"file\" accept=\"image/*\" style=\"display:none;\">\n                </div>\n\n                <!-- Team Name & Info -->\n                <div class=\"bstage-form-group\" style=\"background-color: #2c2c2e; border-color: #333;\">\n                    <div class=\"bstage-form-item\" style=\"border-bottom-color: #444;\">\n                        <label style=\"color: #aaa;\">团队名</label>\n                        <input type=\"text\" id=\"bstage-team-name-input\" placeholder=\"输入团队名称\" style=\"color: #fff; background-color: transparent; border: none; outline: none; width: 100%; padding: 4px 0; margin-top: 4px;\">\n                    </div>\n                    <div class=\"bstage-form-item\">\n                        <label style=\"color: #aaa;\">团队信息</label>\n                        <textarea id=\"bstage-team-desc-input\" placeholder=\"输入团队简介...\" style=\"color: #fff; background-color: transparent; border: none; outline: none; width: 100%; padding: 4px 0; margin-top: 4px; min-height: 60px;\"></textarea>\n                    </div>\n                </div>\n\n                <!-- Add Characters -->\n                <div class=\"sheet-title\" style=\"margin-top: 20px; margin-bottom: 10px; color: #fff;\">添加成员</div>\n                <div class=\"bstage-chars-list-preview\" id=\"bstage-chars-preview-list\">\n                    <!-- Preview of added chars -->\n                </div>\n                <div style=\"display: flex; gap: 10px;\">\n                    <div class=\"bstage-add-char-btn\" id=\"bstage-add-char-btn\" style=\"flex: 1; background-color: #2c2c2e; color: #fff; padding: 10px; border-radius: 12px; font-size: 14px;\">+ 手动添加</div>\n                    <div class=\"bstage-add-char-btn\" id=\"bstage-pull-friend-btn\" style=\"flex: 1; background-color: #2c2c2e; color: #fff; padding: 10px; border-radius: 12px; font-size: 14px;\">+ 拉取已有好友</div>\n                </div>\n\n                <div class=\"sheet-action confirm-action\" id=\"bstage-confirm-create-btn\" style=\"background-color: #fff; color: #000; margin-top: 30px;\">完成创建</div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(createTeamSheet);
  const addCharSheet = document.createElement("div");
  addCharSheet.className = "bottom-sheet-overlay detail-sheet-overlay";
  addCharSheet.id = "bstage-add-char-sheet";
  addCharSheet.style.zIndex = "1500";
  addCharSheet.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"sheet-title\" style=\"color: #fff;\">添加成员</div>\n            <div class=\"detail-sheet-content\">\n                <div class=\"bstage-avatar-upload\" id=\"bstage-char-avatar-upload\" style=\"background-color: #2c2c2e; overflow: hidden; position: relative;\">\n                    <i class=\"fas fa-user\" style=\"color: #aaa; position: relative; z-index: 1;\"></i>\n                    <img id=\"bstage-char-avatar-preview\" src=\"\" style=\"width: 100%; height: 100%; object-fit: cover; display: none; position: absolute; top: 0; left: 0; z-index: 0;\">\n                    <input type=\"file\" accept=\"image/*\" style=\"display:none;\">\n                </div>\n                <div class=\"bstage-form-group\" style=\"background-color: #2c2c2e; border-color: #333;\">\n                    <div class=\"bstage-form-item\" style=\"border-bottom-color: #444;\">\n                        <label style=\"color: #aaa;\">名字</label>\n                        <input type=\"text\" id=\"bstage-char-name-input\" placeholder=\"成员名字\" style=\"color: #fff; background-color: transparent; border: none; outline: none; width: 100%; padding: 4px 0; margin-top: 4px;\">\n                    </div>\n                    <div class=\"bstage-form-item\">\n                        <label style=\"color: #aaa;\">人设</label>\n                        <input type=\"text\" id=\"bstage-char-role-input\" placeholder=\"简单的描述\" style=\"color: #fff; background-color: transparent; border: none; outline: none; width: 100%; padding: 4px 0; margin-top: 4px;\">\n                    </div>\n                </div>\n                <div class=\"sheet-action confirm-action\" id=\"bstage-confirm-add-char-btn\" style=\"background-color: #fff; color: #000;\">添加</div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(addCharSheet);
  const pullFriendSheet = document.createElement("div");
  pullFriendSheet.className = "bottom-sheet-overlay detail-sheet-overlay";
  pullFriendSheet.id = "bstage-pull-friend-sheet";
  pullFriendSheet.style.zIndex = "1550";
  pullFriendSheet.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"height: 70%; background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"sheet-title\" style=\"color: #fff;\">选择好友</div>\n            <div class=\"detail-sheet-content\" style=\"flex: 1; overflow-y: auto;\">\n                <div id=\"bstage-friend-list\" style=\"display: flex; flex-direction: column; gap: 10px; padding-bottom: 20px;\">\n                    <!-- Friend items injected here -->\n                </div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(pullFriendSheet);
  const subModal = document.createElement("div");
  subModal.className = "bottom-sheet-overlay detail-sheet-overlay";
  subModal.id = "bstage-sub-modal";
  subModal.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"sheet-title\" style=\"color: #fff;\">MEMBERSHIP</div>\n            <div class=\"detail-sheet-content bstage-modal-content\">\n                <div style=\"text-align: center; margin-bottom: 20px;\">\n                    <h3 style=\"font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #fff;\">加入团队会员</h3>\n                    <p style=\"color: #aaa; font-size: 13px;\">享受独家内容与购物特权</p>\n                </div>\n                \n                <div class=\"bstage-price-options\">\n                    <div class=\"bstage-price-option selected\" data-type=\"year\" style=\"border: 1px solid #fff; border-radius: 12px; margin-bottom: 10px; padding: 15px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background-color: #2c2c2e;\">\n                        <span class=\"bstage-price-title\" style=\"color: #fff; font-weight: 600;\">年卡会员</span>\n                        <span class=\"bstage-price-amount\" style=\"color: #fff; font-weight: 600;\">₩89,000 / 年</span>\n                    </div>\n                    <div class=\"bstage-price-option\" data-type=\"month\" style=\"border: 1px solid transparent; border-radius: 12px; padding: 15px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background-color: #2c2c2e;\">\n                        <span class=\"bstage-price-title\" style=\"color: #fff; font-weight: 600;\">月卡会员</span>\n                        <span class=\"bstage-price-amount\" style=\"color: #fff; font-weight: 600;\">₩8,900 / 月</span>\n                    </div>\n                </div>\n\n                <div class=\"sheet-action confirm-action\" id=\"bstage-confirm-sub-btn\" style=\"background-color: #fff; color: #000; margin-top: 20px; border-radius: 25px;\">立即订阅</div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(subModal);
  const popSubModal = document.createElement("div");
  popSubModal.className = "bottom-sheet-overlay detail-sheet-overlay";
  popSubModal.id = "bstage-pop-sub-modal";
  popSubModal.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"sheet-title\" style=\"color: #fff;\">POP SUBSCRIPTION</div>\n            <div class=\"detail-sheet-content bstage-modal-content\">\n                <div style=\"text-align: center; margin-bottom: 20px;\">\n                    <h3 style=\"font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #fff;\" id=\"pop-sub-char-name\">Subscribe to Character</h3>\n                    <p style=\"color: #aaa; font-size: 13px;\">开启私密聊天之旅</p>\n                </div>\n                \n                <div class=\"bstage-price-options\">\n                    <div class=\"bstage-price-option selected\" style=\"border: 1px solid #fff; border-radius: 12px; padding: 15px; display: flex; justify-content: space-between; align-items: center; background-color: #2c2c2e;\">\n                        <span class=\"bstage-price-title\" style=\"color: #fff; font-weight: 600;\">月度订阅</span>\n                        <span class=\"bstage-price-amount\" style=\"color: #fff; font-weight: 600;\">₩4,500 / 月</span>\n                    </div>\n                </div>\n\n                <div class=\"sheet-action confirm-action\" id=\"bstage-confirm-pop-sub-btn\" style=\"background-color: #fff; color: #000; margin-top: 20px; border-radius: 25px;\">确认支付</div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(popSubModal);
  const userProfileModal = document.createElement("div");
  userProfileModal.className = "bottom-sheet-overlay detail-sheet-overlay";
  userProfileModal.id = "bstage-user-profile-modal";
  userProfileModal.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"detail-sheet-content bstage-modal-content\" style=\"text-align: center;\">\n                <div style=\"width: 80px; height: 80px; border-radius: 50%; background-color: #2c2c2e; margin: 0 auto 15px; display: flex; justify-content: center; align-items: center; overflow: hidden; border: none;\">\n                    <img id=\"bstage-profile-avatar-display\" src=\"\" style=\"width: 100%; height: 100%; object-fit: cover; display: none;\">\n                    <i class=\"fas fa-user\" id=\"bstage-profile-avatar-icon\" style=\"font-size: 30px; color: #aaa;\"></i>\n                </div>\n                <h2 style=\"font-size: 20px; font-weight: 700; margin-bottom: 20px; color: #fff;\" id=\"bstage-profile-name-display\">User Name</h2>\n                \n                <div class=\"bstage-profile-stats-container\">\n                    <div class=\"bstage-profile-stat-bubble\" style=\"background-color: #2c2c2e; color: #fff; border: none;\">\n                        <span class=\"bstage-stat-label\" style=\"color: #aaa;\">POP 订阅</span>\n                        <span class=\"bstage-stat-value\" id=\"bstage-profile-pop-sub-count\" style=\"color: #fff;\">0</span>\n                    </div>\n                    <div class=\"bstage-profile-stat-bubble\" style=\"background-color: #2c2c2e; color: #fff; border: none;\">\n                        <span class=\"bstage-stat-label\" style=\"color: #aaa;\">订阅收益</span>\n                        <span class=\"bstage-stat-value\" id=\"bstage-profile-sub-revenue\" style=\"color: #fff;\">￥0.00</span>\n                    </div>\n                </div>\n\n                <div class=\"bstage-profile-actions\">\n                    <div class=\"bstage-profile-btn\" id=\"bstage-edit-profile-btn\" style=\"background-color: #2c2c2e; color: #fff; border: none;\">\n                        <i class=\"fas fa-pen\"></i> 编辑资料\n                    </div>\n                    <div class=\"bstage-profile-btn\" id=\"bstage-withdraw-revenue-btn\" style=\"background-color: #2c2c2e; color: #fff; border: none;\">\n                        <i class=\"fas fa-wallet\"></i> 提现到 Pay\n                    </div>\n                    <div class=\"bstage-profile-btn\" id=\"bstage-my-orders-btn\" style=\"background-color: #2c2c2e; color: #fff; border: none;\">\n                        <i class=\"fas fa-receipt\"></i> 我的订单\n                    </div>\n                </div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(userProfileModal);
  const ordersModal = document.createElement("div");
  ordersModal.className = "bottom-sheet-overlay detail-sheet-overlay";
  ordersModal.id = "bstage-orders-modal";
  ordersModal.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"height: 70%; background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"sheet-title\" style=\"color: #fff;\">我的订单</div>\n            <div class=\"detail-sheet-content\">\n                <div id=\"bstage-orders-list\" style=\"display: flex; flex-direction: column; gap: 10px; padding: 0 16px 20px;\">\n                    <!-- Orders Injected Here -->\n                </div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(ordersModal);
  const editProfileModal = document.createElement("div");
  editProfileModal.className = "bottom-sheet-overlay detail-sheet-overlay";
  editProfileModal.id = "bstage-edit-profile-modal";
  editProfileModal.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"sheet-title\" style=\"color: #fff;\">编辑资料</div>\n            <div class=\"detail-sheet-content\">\n                <div class=\"bstage-avatar-upload\" id=\"bstage-edit-profile-avatar-upload\" style=\"background-color: #2c2c2e; overflow: hidden; position: relative;\">\n                    <i class=\"fas fa-camera\" style=\"color: #aaa; position: relative; z-index: 1;\"></i>\n                    <img id=\"bstage-edit-profile-avatar-preview\" src=\"\" style=\"width: 100%; height: 100%; object-fit: cover; display: none; position: absolute; top: 0; left: 0; z-index: 0;\">\n                    <input type=\"file\" accept=\"image/*\" style=\"display:none;\">\n                </div>\n                <div class=\"bstage-form-group\" style=\"background-color: #2c2c2e; border-color: #333;\">\n                    <div class=\"bstage-form-item\" style=\"border-bottom-color: #444;\">\n                        <label style=\"color: #aaa;\">昵称</label>\n                        <input type=\"text\" id=\"bstage-edit-profile-name\" placeholder=\"输入昵称\" style=\"color: #fff; background-color: transparent; border: none; outline: none; width: 100%; padding: 4px 0; margin-top: 4px;\">\n                    </div>\n                    <div class=\"bstage-form-item\">\n                        <label style=\"color: #aaa;\">人设</label>\n                        <input type=\"text\" id=\"bstage-edit-profile-persona\" placeholder=\"输入你的粉丝人设\" style=\"color: #fff; background-color: transparent; border: none; outline: none; width: 100%; padding: 4px 0; margin-top: 4px;\">\n                    </div>\n                </div>\n                <div class=\"sheet-action confirm-action\" id=\"bstage-save-profile-btn\" style=\"background-color: #fff; color: #000;\">保存</div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(editProfileModal);
  const generateTypeSheet = document.createElement("div");
  generateTypeSheet.className = "bottom-sheet-overlay detail-sheet-overlay";
  generateTypeSheet.id = "bstage-generate-type-sheet";
  generateTypeSheet.style.zIndex = "2200";
  generateTypeSheet.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"height: auto; max-height: 70%; background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\"></div>\n            <div class=\"sheet-title\" id=\"bstage-generate-type-title\">生成内容</div>\n            <div class=\"detail-sheet-content bstage-modal-content\">\n                <div class=\"bstage-form-group\" style=\"background-color: #2c2c2e; border-color: #333;\">\n                    <div class=\"bstage-form-item\">\n                        <label id=\"bstage-generate-type-label\" style=\"color: #aaa;\">想看什么类型</label>\n                        <input type=\"text\" id=\"bstage-generate-type-input\" placeholder=\"留空则随机生成\" style=\"color: #fff; background-color: transparent; border: none; outline: none; width: 100%; padding: 4px 0; margin-top: 4px;\">\n                    </div>\n                </div>\n                <div class=\"sheet-action confirm-action\" id=\"bstage-generate-type-confirm-btn\" style=\"background-color: #fff; color: #000;\">确认生成</div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(generateTypeSheet);
  const editTeamSheet = document.createElement("div");
  editTeamSheet.className = "bottom-sheet-overlay detail-sheet-overlay";
  editTeamSheet.id = "bstage-edit-team-sheet";
  editTeamSheet.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"height: 80%; background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\"></div>\n            <div class=\"sheet-title\">编辑团队</div>\n            <div class=\"detail-sheet-content\">\n                <!-- Team Avatar -->\n                <div class=\"bstage-avatar-upload\" id=\"bstage-edit-team-avatar-upload\" style=\"background-color: #2c2c2e; overflow: hidden; position: relative;\">\n                    <i class=\"fas fa-camera\" style=\"color: #aaa; position: relative; z-index: 1;\"></i>\n                    <img id=\"bstage-edit-team-avatar-preview\" src=\"\" style=\"width: 100%; height: 100%; object-fit: cover; display: none; position: absolute; top: 0; left: 0; z-index: 0;\">\n                    <input type=\"file\" accept=\"image/*\" style=\"display:none;\">\n                </div>\n\n                <!-- Team Name -->\n                <div class=\"bstage-form-group\" style=\"background-color: #2c2c2e; border-color: #333;\">\n                    <div class=\"bstage-form-item\" style=\"border-bottom-color: #444;\">\n                        <label style=\"color: #aaa;\">团队名</label>\n                        <input type=\"text\" id=\"bstage-edit-team-name-input\" placeholder=\"输入团队名称\" style=\"color: #fff; background-color: transparent; border: none; outline: none; width: 100%; padding: 4px 0; margin-top: 4px;\">\n                    </div>\n                </div>\n\n                <!-- Team Background -->\n                <div class=\"sheet-title\" style=\"margin-top: 20px; margin-bottom: 10px;\">主页背景</div>\n                <div class=\"bstage-bg-upload\" id=\"bstage-edit-team-bg-upload\" style=\"background-color: #2c2c2e; border-color: #444; overflow: hidden; position: relative;\">\n                    <span style=\"color: #888; font-size: 14px; position: relative; z-index: 1;\">点击上传背景图</span>\n                    <img id=\"bstage-edit-team-bg-preview\" src=\"\" style=\"width: 100%; height: 100%; object-fit: cover; display: none; position: absolute; top: 0; left: 0; z-index: 0;\">\n                    <input type=\"file\" accept=\"image/*\" style=\"display:none;\">\n                </div>\n\n                <!-- Manage Members -->\n                <div class=\"sheet-title\" style=\"margin-top: 20px; margin-bottom: 10px; color: #fff;\">成员管理</div>\n                <div class=\"bstage-chars-list-preview\" id=\"bstage-edit-team-members-list\">\n                    <!-- Members Injected Here -->\n                </div>\n                <div style=\"display: flex; gap: 10px;\">\n                    <div class=\"bstage-add-char-btn\" id=\"bstage-edit-team-add-member-btn\" style=\"flex: 1; background-color: #2c2c2e; color: #fff; padding: 10px; border-radius: 12px; font-size: 14px;\">+ 手动添加</div>\n                    <div class=\"bstage-add-char-btn\" id=\"bstage-edit-team-pull-friend-btn\" style=\"flex: 1; background-color: #2c2c2e; color: #fff; padding: 10px; border-radius: 12px; font-size: 14px;\">+ 拉取已有好友</div>\n                </div>\n\n                <div class=\"sheet-action confirm-action\" id=\"bstage-confirm-edit-team-btn\" style=\"background-color: #fff; color: #000; margin-top: 30px;\">保存修改</div>\n                <div class=\"sheet-action\" id=\"bstage-delete-team-btn\" style=\"background-color: #ff3b30; color: #fff; margin-top: 10px;\">删除团队</div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(editTeamSheet);
  const editVideoSheet = document.createElement("div");
  editVideoSheet.className = "bottom-sheet-overlay detail-sheet-overlay";
  editVideoSheet.id = "bstage-edit-video-sheet";
  editVideoSheet.style.zIndex = "1000";
  editVideoSheet.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"height: 85%; background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\"></div>\n            <div class=\"sheet-title\">编辑视频信息</div>\n            <div class=\"detail-sheet-content\">\n                <!-- Cover Upload -->\n                <div class=\"sheet-title\" style=\"margin-top: 0; margin-bottom: 10px; font-size: 14px;\">封面</div>\n                <div class=\"bstage-bg-upload\" id=\"bstage-edit-video-cover-upload\" style=\"height: 120px; overflow: hidden; position: relative;\">\n                    <span style=\"color: #888; font-size: 13px; position: relative; z-index: 1;\">点击上传封面</span>\n                    <img id=\"bstage-edit-video-cover-preview\" src=\"\" style=\"width: 100%; height: 100%; object-fit: cover; display: none; position: absolute; top: 0; left: 0; z-index: 0;\">\n                    <input type=\"file\" accept=\"image/*\" style=\"display:none;\">\n                </div>\n\n                <!-- Info Form -->\n                <div class=\"bstage-form-group\" style=\"background-color: #2c2c2e; border-color: #333;\">\n                    <div class=\"bstage-form-item\" style=\"border-bottom-color: #444;\">\n                        <label style=\"color: #aaa;\">视频标题</label>\n                        <input type=\"text\" id=\"bstage-edit-video-title\" placeholder=\"输入标题\" style=\"color: #fff; background-color: transparent; border: none; outline: none; width: 100%; padding: 4px 0;\">\n                    </div>\n                    <div class=\"bstage-form-item\">\n                        <label style=\"color: #aaa;\">简介</label>\n                        <textarea id=\"bstage-edit-video-desc\" placeholder=\"输入视频简介...\" style=\"height: 80px; color: #fff; background-color: transparent; border: none; outline: none; width: 100%; padding: 4px 0;\"></textarea>\n                    </div>\n                </div>\n\n                <div class=\"sheet-action confirm-action\" id=\"bstage-confirm-edit-video-btn\" style=\"background-color: #000; color: #fff; margin-top: 20px;\">保存</div>\n                <div class=\"sheet-action\" id=\"bstage-delete-video-btn\" style=\"background-color: #ff3b30; color: #fff; margin-top: 10px;\">删除视频</div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(editVideoSheet);
  const chatDetailSheet = document.createElement("div");
  chatDetailSheet.className = "bottom-sheet-overlay detail-sheet-overlay";
  chatDetailSheet.id = "bstage-chat-detail-sheet";
  chatDetailSheet.style.zIndex = "1200";
  chatDetailSheet.innerHTML = "\n        <style>\n            #bstage-chat-detail-sheet .bstage-setting-item { background-color: #2c2c2e !important; color: #fff !important; border-bottom: none !important; }\n            #bstage-chat-detail-sheet .bstage-setting-icon { color: #aaa !important; }\n            #bstage-chat-detail-sheet .bstage-setting-label { color: #fff !important; }\n            #bstage-chat-detail-sheet .bstage-settings-list { background-color: #1c1c1e; }\n        </style>\n        <div class=\"bottom-sheet\" style=\"height: 90%; background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"detail-sheet-content bstage-modal-content\" style=\"padding: 0;\">\n                <!-- Profile Section -->\n                <div style=\"text-align: center; padding: 20px 0;\">\n                    <div id=\"bstage-detail-avatar-container\" style=\"width: 80px; height: 80px; border-radius: 50%; background-color: #1c1c1e; margin: 0 auto 10px; overflow: hidden; border: 1px solid #333; display: flex; justify-content: center; align-items: center;\">\n                        <img id=\"bstage-detail-avatar\" src=\"\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        <div id=\"bstage-detail-avatar-text\" style=\"display:none; color:#fff; font-size:30px;\"></div>\n                    </div>\n                    <h2 style=\"font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 5px;\" id=\"bstage-detail-name\">Name</h2>\n                    <div style=\"font-size: 13px; color: #aaa; display: flex; align-items: center; justify-content: center; gap: 4px;\">\n                        <i class=\"fas fa-heart\" style=\"color: #ff3b30;\"></i>\n                        <span id=\"bstage-detail-days\">已一同 1 天</span>\n                    </div>\n                </div>\n\n                <!-- Locker Section -->\n                <div style=\"padding: 0 20px;\">\n                    <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;\">\n                        <span style=\"font-size: 14px; font-weight: 600; color: #aaa;\">置物柜</span>\n                        <span style=\"font-size: 14px; color: #fff; cursor: pointer;\" id=\"bstage-locker-see-all-btn\">看全部</span>\n                    </div>\n                    <div style=\"display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 20px;\" id=\"bstage-locker-preview-list\">\n                        <!-- Preview Photos -->\n                    </div>\n                </div>\n\n                <!-- Settings List -->\n                <div class=\"bstage-settings-list\">\n                    <div class=\"bstage-setting-item\" id=\"bstage-setting-nickname\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-user\"></i></div>\n                        <div class=\"bstage-setting-label\">昵称设置</div>\n                    </div>\n                    <div class=\"bstage-setting-item\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-image\"></i></div>\n                        <div class=\"bstage-setting-label\" id=\"bstage-setting-bg\" style=\"flex:1;\">背景设定</div>\n                        <div class=\"bstage-setting-right-action\" id=\"bstage-reset-bg-btn\" style=\"color: #aaa;\">重置</div>\n                        <input type=\"file\" id=\"bstage-chat-bg-input\" accept=\"image/*\" style=\"display:none;\">\n                    </div>\n\n                    <!-- CSS Presets Settings -->\n                    <div class=\"bstage-setting-item\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-paint-brush\"></i></div>\n                        <div class=\"bstage-setting-label\" style=\"flex:1;\">界面 CSS</div>\n                        <select id=\"bstage-chat-css-select\" style=\"background: #2c2c2e; color: #fff; border: 1px solid #444; border-radius: 4px; padding: 4px; width: 120px; outline: none;\">\n                            <option value=\"\">默认</option>\n                        </select>\n                    </div>\n                    \n                    <div class=\"bstage-setting-item\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-crop-alt\"></i></div>\n                        <div class=\"bstage-setting-label\" style=\"flex:1;\">头像框 CSS</div>\n                        <select id=\"bstage-frame-css-select\" style=\"background: #2c2c2e; color: #fff; border: 1px solid #444; border-radius: 4px; padding: 4px; width: 120px; outline: none;\">\n                            <option value=\"\">默认</option>\n                        </select>\n                    </div>\n                    \n                    <div class=\"bstage-setting-item\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-comment-dots\"></i></div>\n                        <div class=\"bstage-setting-label\" style=\"flex:1;\">气泡 CSS</div>\n                        <select id=\"bstage-bubble-css-select\" style=\"background: #2c2c2e; color: #fff; border: 1px solid #444; border-radius: 4px; padding: 4px; width: 120px; outline: none;\">\n                            <option value=\"\">默认</option>\n                        </select>\n                    </div>\n\n                    <!-- Context Setting -->\n                    <div class=\"bstage-setting-item\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-history\"></i></div>\n                        <div class=\"bstage-setting-label\" style=\"flex: 1;\">上下文携带</div>\n                        <input type=\"number\" id=\"bstage-context-count\" value=\"50\" style=\"width: 50px; background: transparent; border: 1px solid #444; color: #fff; text-align: center; border-radius: 4px; margin-right: 10px;\">\n                        <div class=\"bstage-switch active\" id=\"bstage-context-switch\">\n                            <div class=\"bstage-switch-knob\"></div>\n                        </div>\n                    </div>\n                    \n                    <!-- Translation Switch -->\n                    <div class=\"bstage-setting-item\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-language\"></i></div>\n                        <div class=\"bstage-setting-label\" style=\"flex: 1;\">实时翻译</div>\n                        <div class=\"bstage-switch\" id=\"bstage-trans-switch\">\n                            <div class=\"bstage-switch-knob\"></div>\n                        </div>\n                    </div>\n\n                    <!-- Other Fans Messages Setting -->\n                    <div class=\"bstage-setting-item\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-comments\"></i></div>\n                        <div class=\"bstage-setting-label\" style=\"flex: 1;\">查看其他人消息</div>\n                        <div class=\"bstage-switch\" id=\"bstage-other-fans-switch\">\n                            <div class=\"bstage-switch-knob\"></div>\n                        </div>\n                    </div>\n\n                    <!-- Auto Activity Setting -->\n                    <div class=\"bstage-setting-item\" style=\"flex-wrap: wrap; padding-top: 10px; padding-bottom: 10px;\">\n                        <div style=\"width: 100%; display: flex; align-items: center;\">\n                            <div class=\"bstage-setting-icon\"><i class=\"fas fa-robot\"></i></div>\n                            <div class=\"bstage-setting-label\" style=\"flex: 1;\">自主活动</div>\n                            <div class=\"bstage-switch\" id=\"bstage-auto-activity-switch\">\n                                <div class=\"bstage-switch-knob\"></div>\n                            </div>\n                        </div>\n                        <div id=\"bstage-auto-activity-options\" style=\"width: 100%; margin-top: 10px; display: none; background: #1c1c1e; padding: 10px; border-radius: 8px; border: 1px solid #333;\">\n                            <div style=\"display: flex; align-items: center; margin-bottom: 10px;\">\n                                <span style=\"font-size: 13px; color: #aaa; width: 70px;\">调用间隔</span>\n                                <input type=\"number\" id=\"bstage-auto-activity-interval\" value=\"60\" style=\"flex: 1; background: #2c2c2e; border: 1px solid #444; color: #fff; border-radius: 4px; padding: 4px 8px; outline: none;\">\n                                <span style=\"font-size: 13px; color: #aaa; margin-left: 8px;\">秒</span>\n                            </div>\n                            <div style=\"display: flex; align-items: center;\">\n                                <span style=\"font-size: 13px; color: #aaa; width: 70px;\">API预设</span>\n                                <select id=\"bstage-auto-activity-preset\" style=\"flex: 1; background: #2c2c2e; color: #fff; border: 1px solid #444; border-radius: 4px; padding: 4px; outline: none;\">\n                                    <option value=\"\">默认全局API</option>\n                                </select>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"bstage-setting-item\" style=\"color: #ff3b30;\" id=\"bstage-chat-exit-btn\">\n                        <div class=\"bstage-setting-icon\" style=\"color: #ff3b30 !important;\"><i class=\"fas fa-sign-out-alt\"></i></div>\n                        <div class=\"bstage-setting-label\" style=\"color: #ff3b30 !important;\">退出</div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(chatDetailSheet);
  const fanChatDetailSheet = document.createElement("div");
  fanChatDetailSheet.className = "bottom-sheet-overlay detail-sheet-overlay";
  fanChatDetailSheet.id = "bstage-fan-chat-detail-sheet";
  fanChatDetailSheet.style.zIndex = "1200";
  fanChatDetailSheet.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"height: 90%; background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"detail-sheet-content bstage-modal-content\" style=\"padding: 0;\">\n                <div style=\"text-align: center; padding: 20px 0;\">\n                    <div id=\"bstage-fan-detail-avatar-container\" style=\"width: 80px; height: 80px; border-radius: 50%; background-color: #2c2c2e; margin: 0 auto 10px; overflow: hidden; border: 1px solid #333; display: flex; justify-content: center; align-items: center;\">\n                        <img id=\"bstage-fan-detail-avatar\" src=\"\" style=\"width: 100%; height: 100%; object-fit: cover; display: none;\">\n                        <i class=\"fas fa-user-friends\" id=\"bstage-fan-detail-avatar-icon\" style=\"font-size: 28px; color: #aaa;\"></i>\n                    </div>\n                    <h2 style=\"font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 5px;\" id=\"bstage-fan-detail-name\">粉丝聊天室</h2>\n                    <div style=\"font-size: 13px; color: #aaa; display: flex; align-items: center; justify-content: center; gap: 4px;\">\n                        <i class=\"fas fa-heart\" style=\"color: #ff3b30;\"></i>\n                        <span id=\"bstage-fan-detail-subscribers\">已订阅 0 人</span>\n                    </div>\n                </div>\n\n                <div class=\"bstage-settings-list\">\n                    <div class=\"bstage-setting-item\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-image\"></i></div>\n                        <div class=\"bstage-setting-label\" id=\"bstage-fan-setting-bg\" style=\"flex:1;\">背景设定</div>\n                        <div class=\"bstage-setting-right-action\" id=\"bstage-fan-reset-bg-btn\" style=\"color: #aaa;\">重置</div>\n                        <input type=\"file\" id=\"bstage-fan-chat-bg-input\" accept=\"image/*\" style=\"display:none;\">\n                    </div>\n\n                    <div class=\"bstage-setting-item\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-paint-brush\"></i></div>\n                        <div class=\"bstage-setting-label\" style=\"flex:1;\">界面 CSS</div>\n                        <select id=\"bstage-fan-chat-css-select\" style=\"background: #2c2c2e; color: #fff; border: 1px solid #444; border-radius: 4px; padding: 4px; width: 120px; outline: none;\">\n                            <option value=\"\">默认</option>\n                        </select>\n                    </div>\n\n                    <div class=\"bstage-setting-item\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-comment-dots\"></i></div>\n                        <div class=\"bstage-setting-label\" style=\"flex:1;\">气泡 CSS</div>\n                        <select id=\"bstage-fan-bubble-css-select\" style=\"background: #2c2c2e; color: #fff; border: 1px solid #444; border-radius: 4px; padding: 4px; width: 120px; outline: none;\">\n                            <option value=\"\">默认</option>\n                        </select>\n                    </div>\n\n                    <div class=\"bstage-setting-item\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-history\"></i></div>\n                        <div class=\"bstage-setting-label\" style=\"flex: 1;\">上下文携带</div>\n                        <input type=\"number\" id=\"bstage-fan-context-count\" value=\"50\" style=\"width: 50px; background: transparent; border: 1px solid #444; color: #fff; text-align: center; border-radius: 4px; margin-right: 10px;\">\n                        <div class=\"bstage-switch active\" id=\"bstage-fan-context-switch\">\n                            <div class=\"bstage-switch-knob\"></div>\n                        </div>\n                    </div>\n\n                    <div class=\"bstage-setting-item\">\n                        <div class=\"bstage-setting-icon\"><i class=\"fas fa-language\"></i></div>\n                        <div class=\"bstage-setting-label\" style=\"flex: 1;\">实时翻译</div>\n                        <div class=\"bstage-switch\" id=\"bstage-fan-trans-switch\">\n                            <div class=\"bstage-switch-knob\"></div>\n                        </div>\n                    </div>\n\n                    <div class=\"bstage-setting-item\" style=\"color: #ff3b30;\" id=\"bstage-fan-chat-clear-btn\">\n                        <div class=\"bstage-setting-icon\" style=\"color: #ff3b30 !important;\"><i class=\"fas fa-trash-alt\"></i></div>\n                        <div class=\"bstage-setting-label\" style=\"color: #ff3b30 !important;\">清空聊天</div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(fanChatDetailSheet);
  const lockerModal = document.createElement("div");
  lockerModal.className = "bottom-sheet-overlay detail-sheet-overlay";
  lockerModal.id = "bstage-locker-modal";
  lockerModal.style.zIndex = "1250";
  lockerModal.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"height: 90%; background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"sheet-title\" style=\"color: #fff;\">置物柜</div>\n            <div class=\"detail-sheet-content bstage-modal-content\">\n                <div class=\"bstage-locker-grid\" id=\"bstage-locker-grid\">\n                    <!-- Photos + Add Button -->\n                </div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(lockerModal);
  const videoDetailModal = document.createElement("div");
  videoDetailModal.className = "bottom-sheet-overlay detail-sheet-overlay";
  videoDetailModal.id = "bstage-video-detail-modal";
  videoDetailModal.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"height: 95%; background: #1c1c1e; color: #fff;\">\n            <div class=\"sheet-handle\"></div>\n            <div class=\"bstage-video-modal-content\">\n                <div class=\"bstage-video-detail-scroll\">\n                    <!-- Video Player Placeholder -->\n                    <div class=\"bstage-video-player-placeholder\">\n                        <i class=\"fas fa-play\" style=\"font-size: 40px; opacity: 0.8;\"></i>\n                    </div>\n\n                    <!-- Info Section -->\n                    <div class=\"bstage-video-info-section\">\n                        <div class=\"bstage-video-detail-title\" id=\"bstage-vid-detail-title\">Title</div>\n                        <div class=\"bstage-video-detail-meta\" id=\"bstage-vid-detail-meta\">Views • Date</div>\n                        \n                        <div class=\"bstage-publisher-row\">\n                            <div class=\"bstage-publisher-avatar\" id=\"bstage-vid-publisher-avatar\"></div>\n                            <div class=\"bstage-publisher-name\" id=\"bstage-vid-publisher-name\">Team Name</div>\n                            <div class=\"bstage-small-magic-btn\" id=\"bstage-video-detail-magic-btn\" style=\"margin-left: auto;\">\n                                <i class=\"fas fa-plus\"></i>\n                            </div>\n                        </div>\n\n                        <div class=\"bstage-video-description\" id=\"bstage-vid-description\">\n                            Description text...\n                        </div>\n                    </div>\n\n                    <!-- Comments Section -->\n                    <div class=\"bstage-comments-section\">\n                        <div class=\"bstage-comments-header\" id=\"bstage-vid-comments-header\">评论 (0)</div>\n                        <div class=\"bstage-comment-list\" id=\"bstage-vid-comments-list\">\n                            <!-- Comments injected here -->\n                        </div>\n                    </div>\n                </div>\n\n                <!-- Comment Input (Sticky Bottom) -->\n                <div class=\"bstage-comment-input-area\" style=\"background-color: #1c1c1e; border-top: 1px solid #333;\">\n                    <div class=\"bstage-comment-reply-preview\" id=\"bstage-vid-comment-reply-preview\" style=\"display:none;\">\n                        <div class=\"bstage-comment-reply-preview-text\" id=\"bstage-vid-comment-reply-preview-text\"></div>\n                        <div class=\"bstage-comment-reply-cancel\" id=\"bstage-vid-comment-reply-cancel-btn\" role=\"button\" tabindex=\"0\" aria-label=\"取消回复\" title=\"取消回复\">\n                            <i class=\"fas fa-times\"></i>\n                        </div>\n                    </div>\n                    <div class=\"bstage-user-avatar-small\" id=\"bstage-comment-user-avatar\"></div>\n                    <input type=\"text\" class=\"bstage-comment-input\" id=\"bstage-vid-comment-input\" inputmode=\"text\" enterkeyhint=\"send\" autocomplete=\"off\" autocapitalize=\"sentences\" placeholder=\"添加评论...\" style=\"color: #fff; background-color: transparent; border: none; outline: none; flex: 1;\">\n                    <i class=\"fas fa-paper-plane bstage-comment-send-btn disabled\" id=\"bstage-vid-comment-send-btn\" style=\"color: #aaa;\"></i>\n                </div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(videoDetailModal);
  const shopDetailModal = document.createElement("div");
  shopDetailModal.className = "bottom-sheet-overlay detail-sheet-overlay";
  shopDetailModal.id = "bstage-shop-detail-modal";
  shopDetailModal.innerHTML = "\n        <div class=\"bottom-sheet\" style=\"height: 90%; background: #1c1c1e; border: 1px solid #333; color: #fff;\">\n            <div class=\"sheet-handle\" style=\"background-color: #444;\"></div>\n            <div class=\"bstage-modal-content\" style=\"padding: 0; display: flex; flex-direction: column; height: 100%; background-color: #000; color: #fff;\">\n                <div class=\"bstage-shop-detail-scroll\" style=\"flex:1; overflow-y:auto; padding-bottom:80px;\">\n                    <!-- Image -->\n                    <div class=\"bstage-shop-detail-img\" id=\"bstage-shop-detail-img\" style=\"width:100%; aspect-ratio:1/1; background-color:#1a1a1a; position:relative; overflow:hidden;\">\n                        <img src=\"\" style=\"width:100%; height:100%; object-fit:cover; display:none;\">\n                        <div class=\"bstage-shop-detail-placeholder\" style=\"width:100%; height:100%; display:flex; justify-content:center; align-items:center; color:#555;\">\n                            <i class=\"fas fa-image\" style=\"font-size:50px;\"></i>\n                        </div>\n                    </div>\n                    \n                    <!-- Info -->\n                    <div class=\"bstage-shop-detail-info\" style=\"padding:20px;\">\n                        <span class=\"bstage-shop-badge\" id=\"bstage-shop-detail-cat\" style=\"margin-bottom:8px;\">Category</span>\n                        <div class=\"bstage-shop-detail-title\" id=\"bstage-shop-detail-title\" style=\"font-size:22px; font-weight:700; margin-bottom:8px; line-height:1.3;\">Title</div>\n                        <div class=\"bstage-shop-detail-price\" id=\"bstage-shop-detail-price\" style=\"font-size:24px; font-weight:800; color:#fff; margin-bottom:24px;\">₩0</div>\n                        \n                        <div style=\"width:100%; height:1px; background-color:#222; margin-bottom:24px;\"></div>\n\n                        <div class=\"bstage-shop-detail-desc-title\" style=\"font-size:16px; font-weight:600; margin-bottom:12px;\">商品详情</div>\n                        <div class=\"bstage-shop-detail-desc\" id=\"bstage-shop-detail-desc\" style=\"font-size:14px; color:#ccc; line-height:1.6; white-space: pre-wrap;\">\n                            Description...\n                        </div>\n                    </div>\n                </div>\n\n                <!-- Buy Bar -->\n                <div class=\"bstage-shop-buy-bar\" style=\"padding:16px 20px; border-top:1px solid #222; background-color:#000;\">\n                    <div class=\"bstage-shop-buy-btn\" style=\"width:100%; background-color:#fff; color:#000; font-weight:700; font-size:16px; height:50px; border-radius:25px; display:flex; justify-content:center; align-items:center; cursor:pointer;\">立即购买</div>\n                </div>\n            </div>\n        </div>\n    ";
  document.getElementById("app").appendChild(shopDetailModal);
  const schemaVersion_2 = 2,
    BSTAGE_POP_MONTHLY_KRW = 4500,
    BSTAGE_KRW_TO_CNY = 0.0052,
    BSTAGE_MAX_SUBSCRIBERS = 9999999;
  let teams_2 = [],
    currentTeam = null,
    tempMembers = [],
    isEditingTeam = false,
    message_14 = null,
    sourceFriendId_2 = "",
    currentPopSubMember = null,
    currentChatMember = null,
    pendingChatReply = null,
    pendingFanReply = null,
    isTranslationEnabled_2 = false,
    isContextEnabled_2 = true,
    contextMessageCount_2 = 50,
    userMsgCountSinceLastReply = 0,
    bstageOrders_2 = [],
    bstageFanChatHistory_2 = [],
    bstageFanChatSettings_2 = {
      chatBg: null,
      chatCssId: "",
      bubbleCssId: ""
    },
    bstageUserTeamState_2 = {
      id: "__bstage_user_team__",
      isUserTeam: true,
      isSubscribed: true
    },
    bstageFanSubscriberCount_2 = null,
    bstageFanSubscriberGrowthTimer = null,
    count_27 = 0,
    bstageHydrationComplete = false,
    bstageRevenueState_2 = {
      withdrawnCny: 0,
      lastWithdrawAt: null
    },
    pendingVideoCommentReply = null,
    currentGenerateTypeAction = null,
    chatPhotos_2 = [],
    value_32 = null,
    bstagePresets_2 = {
      chatCss: [],
      avatarFrameCss: [],
      bubbleCss: []
    },
    currentPresetTab = "chatCss",
    activeCharacterChatInputCleanup = null,
    autoActivityIntervals = {};
  const isBstageAndroid = !!window.mobileInputCompat?.isAndroid || /Android/i.test(navigator.userAgent || ""),
    pendingBstageKeyboardCloses = new WeakSet();
  function isBstageEditableElement(element_14) {
    if (!element_14 || !element_14.matches) return false;
    return element_14.matches("input:not([type=\"file\"]):not([type=\"hidden\"]), textarea, select, [contenteditable=\"true\"]");
  }
  function bindBstageFocusPreservingAction(element_15, value_118) {
    if (!element_15 || typeof value_118 !== "function") return function () {};
    let lastPointerActivationAt = 0;
    const invoke = value_119 => {
        try {
          const value_118_120 = value_118(value_119);
          value_118_120 && typeof value_118_120["catch"] === "function" && value_118_120["catch"](error_2 => console.error("[b.stage] action failed", error_2));
        } catch (value_122) {
          console.error("[b.stage] action failed", value_122);
        }
      },
      handlePointerDown = event_3 => {
        if (!isBstageAndroid || event_3.button !== undefined && event_3.button !== 0) return;
        event_3.preventDefault();
        lastPointerActivationAt = Date.now();
        invoke(event_3);
      },
      handleClick = event_4 => {
        if (isBstageAndroid && Date.now() - lastPointerActivationAt < 700) {
          event_4.preventDefault();
          return;
        }
        invoke(event_4);
      },
      handleKeydown = event_5 => {
        if (event_5.key !== "Enter" && event_5.key !== " ") return;
        event_5.preventDefault();
        invoke(event_5);
      };
    return element_15.addEventListener("pointerdown", handlePointerDown, {
      passive: false
    }), element_15.addEventListener("click", handleClick), element_15.addEventListener("keydown", handleKeydown), () => {
      element_15.removeEventListener("pointerdown", handlePointerDown);
      element_15.removeEventListener("click", handleClick);
      element_15.removeEventListener("keydown", handleKeydown);
    };
  }
  function handleAction_37(value_126, timeout = 460) {
    const activeElement_127 = document.activeElement;
    if (!value_126 || !isBstageAndroid || !activeElement_127 || !value_126.contains(activeElement_127) || !isBstageEditableElement(activeElement_127)) return Promise.resolve();
    activeElement_127.blur();
    const viewport = window.visualViewport;
    if (!viewport) return new Promise(resolve_2 => setTimeout(resolve_2, 280));
    const startedAt = Date.now(),
      startingHeight = Math.round(viewport.height || 0);
    let lastHeight = startingHeight,
      stableFrames = 0;
    return new Promise(resolve_3 => {
      let finished = false;
      const finish = () => {
          if (finished) return;
          finished = true;
          resolve_3();
        },
        hardTimeout = setTimeout(finish, timeout),
        check = () => {
          if (finished) return;
          const height_2 = Math.round(viewport.height || 0);
          stableFrames = Math.abs(height_2 - lastHeight) <= 1 ? stableFrames + 1 : 0;
          lastHeight = height_2;
          const keyboardHasRetreated = height_2 >= startingHeight + 72;
          if (keyboardHasRetreated && stableFrames >= 2 || Date.now() - startedAt >= timeout) {
            clearTimeout(hardTimeout);
            finish();
            return;
          }
          requestAnimationFrame(check);
        };
      requestAnimationFrame(check);
    });
  }
  const value_38 = window.mobileInputCompat?.registerFocusScope?.({
    selector: "#bstage-view, #bstage-chat-view, #bstage-fan-chat-view, .bstage-center-modal-overlay, .bottom-sheet-overlay[id^=\"bstage-\"]",
    "resolveScrollContainer"(target_2, root_2) {
      if (!target_2 || !root_2) return null;
      if (root_2.id === "bstage-chat-view") return document.getElementById("bstage-chat-content");
      if (root_2.id === "bstage-fan-chat-view") return document.getElementById("bstage-fan-chat-content");
      if (root_2.id === "bstage-video-detail-modal" && target_2.id === "bstage-vid-comment-input") return root_2.querySelector(".bstage-video-detail-scroll");
      return null;
    }
  }) || function () {};
  function registerBstageSendInput(input_2, onSend_2, options_2 = {}) {
    if (!input_2 || typeof onSend_2 !== "function") return function () {};
    if (window.mobileInputCompat?.register) return window.mobileInputCompat.register({
      input: input_2,
      root: options_2.root || null,
      scrollContainer: options_2.scrollContainer || null,
      onSend: onSend_2,
      blurAfterSend: false,
      enterKeyHint: "send",
      restoreWindowScroll: false,
      onRestore: options_2.onRestore || null
    });
    const handleKeydown_2 = event_6 => {
      if (event_6.key !== "Enter" || event_6.shiftKey || event_6.ctrlKey || event_6.metaKey || event_6.altKey || event_6.isComposing || event_6.keyCode === 229) return;
      event_6.preventDefault();
      if (!String(input_2.value || "").trim()) return;
      onSend_2({
        event: event_6,
        input: input_2,
        text: input_2.value.trim()
      });
    };
    return input_2.setAttribute("enterkeyhint", "send"), input_2.addEventListener("keydown", handleKeydown_2), () => input_2.removeEventListener("keydown", handleKeydown_2);
  }
  function handleAction_40(value_138) {
    const date_2 = new Date(value_138),
      now_2 = new Date(),
      value_141 = now_2 - date_2,
      floor_142 = Math.floor(value_141 / 86400000),
      value_143 = date_2.getHours().toString().padStart(2, "0") + ":" + date_2.getMinutes().toString().padStart(2, "0"),
      value_144 = date_2.getDate() === now_2.getDate() && date_2.getMonth() === now_2.getMonth() && date_2.getFullYear() === now_2.getFullYear(),
      yesterday = new Date(now_2);
    yesterday.setDate(now_2.getDate() - 1);
    const value_146 = date_2.getDate() === yesterday.getDate() && date_2.getMonth() === yesterday.getMonth() && date_2.getFullYear() === yesterday.getFullYear();
    if (value_144) return "今天 " + value_143;else {
      if (value_146) return "昨天 " + value_143;else {
        const items_147 = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        return floor_142 < 7 ? items_147[date_2.getDay()] + " " + value_143 : date_2.getFullYear() + "年" + (date_2.getMonth() + 1) + "月" + date_2.getDate() + "日 " + value_143;
      }
    }
  }
  function normalizeChatCompletionsEndpoint(endpoint_2) {
    return window.u2Api.resolveChatCompletionsEndpoint(endpoint_2);
  }
  function stripGeneratedText(value_2, fallback = "") {
    return String(value_2 || fallback || "").replace(/[<>]/g, "").trim();
  }
  function escapeHtml(value_3) {
    return String(value_3 || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function handleAction_41(value_151 = "bstage") {
    return encodeURIComponent(value_151 + "-" + Date.now() + "-" + Math.random().toString(36).slice(2));
  }
  const bstageEmojiAvatars = ["😀", "😎", "🥳", "🤩", "😊", "😺", "🌟", "✨", "🎤", "🎧", "🎵", "🎸", "💿", "📀", "🎬", "📸", "🌈", "🔥", "💜", "💙", "🍒", "🍓", "🍑", "🍋", "🍀", "🌙", "☀️", "⭐", "🪩", "🫶"];
  function hashBstageString(value_4) {
    const text_2 = String(value_4 || "bstage");
    let hash = 0;
    for (let i = 0; i < text_2.length; i++) {
      hash = (hash << 5) - hash + text_2.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
  function getStableEmojiAvatar(seed) {
    return bstageEmojiAvatars[hashBstageString(seed) % bstageEmojiAvatars.length];
  }
  function isBstageRandomAvatar(value_5) {
    return /^https:\/\/i\.pravatar\.cc\//.test(String(value_5 || ""));
  }
  function ensureEmojiAvatar(entity, seed_2) {
    if (!entity || typeof entity !== "object") return getStableEmojiAvatar(seed_2);
    if (!entity.avatarEmoji) entity.avatarEmoji = getStableEmojiAvatar(seed_2 || entity.name || entity.id || entity.timestamp || "bstage");
    return entity.avatarEmoji;
  }
  function renderBstageAvatar(contact, value_156 = "User", value_157 = "") {
    const value_158 = contact && contact.avatar ? String(contact.avatar) : "";
    if (value_158 && !isBstageRandomAvatar(value_158)) return "<img class=\"" + escapeHtml(value_157) + "\" src=\"" + escapeHtml(value_158) + "\" alt=\"\">";
    const emojiAvatar = ensureEmojiAvatar(contact, value_156);
    return "<div class=\"" + escapeHtml(value_157) + " bstage-emoji-avatar\" aria-label=\"" + escapeHtml(value_156) + "\">" + escapeHtml(emojiAvatar) + "</div>";
  }
  function renderBstageAvatarContent(entity_2, label_2 = "User") {
    const value_161 = entity_2 && entity_2.avatar ? String(entity_2.avatar) : "";
    if (value_161 && !isBstageRandomAvatar(value_161)) return "<img src=\"" + escapeHtml(value_161) + "\" alt=\"\">";
    return "<span class=\"bstage-emoji-avatar-text\">" + escapeHtml(ensureEmojiAvatar(entity_2, label_2)) + "</span>";
  }
  function isUserTeam_2(team_2) {
    return !!team_2 && (team_2.isUserTeam || team_2.id === "__bstage_user_team__");
  }
  function getBstageUserTeam() {
    const baseUserName = window.userState && window.userState.name ? window.userState.name : "User",
      customName_2 = typeof bstageUserTeamState_2.customName === "string" ? bstageUserTeamState_2.customName.trim() : "",
      name_2 = customName_2 || baseUserName,
      hasCustomAvatar = Object.prototype.hasOwnProperty.call(bstageUserTeamState_2, "customAvatar"),
      avatar_2 = hasCustomAvatar ? bstageUserTeamState_2.customAvatar : window.userState && window.userState.avatarUrl ? window.userState.avatarUrl : null;
    bstageUserTeamState_2.id = "__bstage_user_team__";
    bstageUserTeamState_2.isUserTeam = true;
    bstageUserTeamState_2.isSubscribed = true;
    bstageUserTeamState_2.name = name_2;
    bstageUserTeamState_2.desc = bstageUserTeamState_2.customDesc || (window.userState && window.userState.persona ? window.userState.persona : "User 官方空间");
    bstageUserTeamState_2.avatar = avatar_2;
    Object.prototype.hasOwnProperty.call(bstageUserTeamState_2, "customBg") && (bstageUserTeamState_2.bg = bstageUserTeamState_2.customBg || null);
    bstageUserTeamState_2.avatarEmoji = bstageUserTeamState_2.avatarEmoji || getStableEmojiAvatar("bstage-user-team-" + name_2);
    const extraMembers = Array.isArray(bstageUserTeamState_2.members) ? bstageUserTeamState_2.members.filter(member_2 => member_2 && !member_2.isUserMember && member_2.id !== "__bstage_user_member__") : [];
    return bstageUserTeamState_2.members = [{
      id: "__bstage_user_member__",
      isUserMember: true,
      name: name_2,
      role: window.userState && window.userState.persona ? window.userState.persona : "User",
      avatar: avatar_2,
      avatarEmoji: bstageUserTeamState_2.avatarEmoji,
      isSubscribed: true,
      subStartDate: Date.now()
    }, ...extraMembers], bstageUserTeamState_2;
  }
  function findCanonicalBstageMember(memberId, preferredTeamId = null) {
    if (memberId === undefined || memberId === null) return null;
    const targetId = String(memberId),
      teamId = preferredTeamId === undefined || preferredTeamId === null ? null : String(preferredTeamId),
      userTeam = getBstageUserTeam(),
      candidates = [userTeam, ...teams_2],
      preferred = teamId ? candidates.filter(team_3 => team_3 && String(team_3.id) === teamId) : candidates,
      searchTeams = preferred.length > 0 ? preferred : candidates;
    for (const team_4 of searchTeams) {
      const member_3 = Array.isArray(team_4?.members) ? team_4.members.find(item => item && String(item.id) === targetId) : null;
      if (member_3) return {
        team: team_4,
        member: member_3
      };
    }
    return null;
  }
  function handleAction_45() {
    const selectedTeamId = currentTeam?.id;
    selectedTeamId !== undefined && selectedTeamId !== null && (currentTeam = String(selectedTeamId) === "__bstage_user_team__" ? getBstageUserTeam() : teams_2.find(team_5 => team_5 && String(team_5.id) === String(selectedTeamId)) || null);
    if (!currentChatMember) return false;
    const rebound = findCanonicalBstageMember(currentChatMember.id, currentTeam?.id);
    currentChatMember = rebound ? rebound.member : null;
    if (rebound) currentTeam = rebound.team;
    return !!rebound;
  }
  function ensureBstageHydrated(value_181 = true) {
    if (bstageHydrationComplete) return true;
    return value_181 && typeof window.showToast === "function" && window.showToast("b.stage 数据正在加载，请稍候"), false;
  }
  function handleAction_46(value_182) {
    return "https://picsum.photos/seed/" + encodeURIComponent(value_182) + "/900/1200";
  }
  function handleAction_47(value_183, value_184 = 800, value_185 = 800) {
    return "https://picsum.photos/seed/" + encodeURIComponent(value_183) + "/" + value_184 + "/" + value_185;
  }
  function handleAction_48(team_6) {
    if (!team_6 || typeof team_6 !== "object") return false;
    let changed = false;
    const teamKey = team_6.id || team_6.name || "";
    if (Array.isArray(team_6.shopItems)) {
      const defaultShopNames = new Set([team_6.name + " 2024 Season Greeting", team_6.name + " Official Light Stick", "Fan Meeting: OUR ZONE Ticket", "Video Call Event #3", "Behind Photo Set A"]),
        defaultShopImages = new Set([handleAction_47(teamKey + "-shop-season", 600, 600), handleAction_47(teamKey + "-shop-lightstick", 600, 600), handleAction_47(teamKey + "-shop-ticket", 600, 600), handleAction_47(teamKey + "-shop-videocall", 600, 600), handleAction_47(teamKey + "-shop-photo-set", 600, 600)]),
        before = team_6.shopItems.length;
      team_6.shopItems = team_6.shopItems.filter(item_2 => {
        const itemName = item_2 && item_2.name ? String(item_2.name) : "",
          itemImg = item_2 && item_2.img ? String(item_2.img) : "";
        return !(defaultShopNames.has(itemName) || defaultShopImages.has(itemImg));
      });
      if (team_6.shopItems.length !== before) changed = true;
    }
    if (Array.isArray(team_6.shopCategories) && team_6.shopCategories.length === 5) {
      const defaultCats = ["全部", "周边", "票务", "签售", "其他"];
      defaultCats.every((cat, index) => team_6.shopCategories[index] === cat) && (!team_6.shopItems || team_6.shopItems.length === 0) && (team_6.shopCategories = ["全部"], changed = true);
    }
    if (Array.isArray(team_6.contentPhotos)) {
      const defaultPhotos = new Set([handleAction_47(teamKey + "-content-photo-1", 900, 600), handleAction_47(teamKey + "-content-photo-2", 900, 600), handleAction_47(teamKey + "-content-photo-3", 900, 600)]),
        before_2 = team_6.contentPhotos.length;
      team_6.contentPhotos = team_6.contentPhotos.filter(photo => !defaultPhotos.has(String(photo || "")));
      if (team_6.contentPhotos.length !== before_2) changed = true;
    }
    if (Array.isArray(team_6.videos)) {
      const defaultVideoTitles = new Set(["Behind The Scenes Ep.1", "Dance Practice", "Vlog #5: Day Off"]),
        before_3 = team_6.videos.length;
      team_6.videos = team_6.videos.filter(video => !defaultVideoTitles.has(video && video.title ? String(video.title) : ""));
      if (team_6.videos.length !== before_3) changed = true;
    }
    return Array.isArray(team_6.contentSeries) && team_6.contentSeries.length === 2 && team_6.contentSeries[0] === "全部" && team_6.contentSeries[1] === "vlog" && (!team_6.videos || team_6.videos.length === 0) && (team_6.contentSeries = ["全部"], changed = true), changed;
  }
  function createBstageMessageId(value_198 = "msg") {
    return value_198 + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  }
  function ensureMessageId(msg_2, value_200 = "msg") {
    if (!msg_2 || typeof msg_2 !== "object") return "";
    if (!msg_2.id) msg_2.id = value_200 + "_" + (msg_2.timestamp || Date.now()) + "_" + Math.random().toString(36).slice(2, 8);
    return msg_2.id;
  }
  function getMessageSummary(msg_3) {
    if (!msg_3) return "";
    const raw = msg_3.type === "image" ? "[图片] " + (msg_3.imgDesc || msg_3.description || "") : msg_3.text || "",
      text_3 = stripGeneratedText(raw, msg_3.type === "image" ? "[图片]" : "");
    return text_3.length > 64 ? text_3.slice(0, 64) + "..." : text_3;
  }
  function createReplyMeta(msg, speaker_2) {
    if (!msg) return null;
    return {
      id: ensureMessageId(msg, msg.isUser ? "user" : "ai"),
      speaker: stripGeneratedText(speaker_2, msg.isUser ? "User" : "AI"),
      text: getMessageSummary(msg),
      isUser: !!msg.isUser
    };
  }
  function formatReplyForPrompt_2(replyTo_2) {
    if (!replyTo_2 || !replyTo_2.text) return "";
    return "\n            <div class=\"bstage-reply-quote\">\n                <div class=\"bstage-reply-quote-speaker\">" + escapeHtml(replyTo_2.speaker || "消息") + "</div>\n                <div class=\"bstage-reply-quote-text\">" + escapeHtml(replyTo_2.text) + "</div>\n            </div>\n        ";
  }
  function formatReplyForPrompt(replyTo_3) {
    if (!replyTo_3 || !replyTo_3.id) return "";
    return "；回复 " + (replyTo_3.speaker || "消息") + "(" + replyTo_3.id + ")：「" + (replyTo_3.text || "") + "」";
  }
  function findMessageById(history, id_2, predicate) {
    if (!id_2 || !Array.isArray(history)) return null;
    return history.find(msg_4 => msg_4 && msg_4.id === id_2 && (!predicate || predicate(msg_4))) || null;
  }
  function normalizeOtherFanMessages(rawMessages, value_210 = Date.now()) {
    if (!Array.isArray(rawMessages)) return [];
    return rawMessages.slice(0, 14).map((item_3, value_212) => {
      const name_11 = stripGeneratedText(item_3 && item_3.name, handleAction_102(value_212)),
        text_10 = stripGeneratedText(typeof item_3 === "string" ? item_3 : item_3 && item_3.text),
        trans_4 = stripGeneratedText(item_3 && (item_3.trans || item_3.translationZh || item_3.translation));
      if (!text_10) return null;
      if (handleAction_103(text_10) && !trans_4) return null;
      const id_3 = stripGeneratedText(item_3 && item_3.id, createBstageMessageId("other_fan"));
      return {
        id: id_3,
        name: name_11,
        text: text_10,
        trans: trans_4,
        timestamp: value_210 + value_212,
        avatarEmoji: stripGeneratedText(item_3 && item_3.avatarEmoji) || getStableEmojiAvatar("bstage-other-fan-" + name_11 + "-" + id_3)
      };
    }).filter(Boolean);
  }
  function handleAction_53(msg_5) {
    if (!msg_5 || typeof msg_5 !== "object") return null;
    return ensureMessageId(msg_5, "fan_batch"), msg_5.type = "fan_batch", msg_5.timestamp = msg_5.timestamp || Date.now(), msg_5.fanMessages = normalizeOtherFanMessages(msg_5.fanMessages || msg_5.messages || msg_5.otherFanMessages || [], msg_5.timestamp), msg_5;
  }
  function formatFanBatchForPrompt(value_218) {
    const batch = handleAction_53(value_218);
    if (!batch || batch.fanMessages.length === 0) return "";
    const join_220 = batch.fanMessages.slice(0, 8).map(value_221 => (value_221.name || "粉丝") + "(" + value_221.id + "): " + (value_221.text || "") + (value_221.trans ? " / 中文：" + value_221.trans : "")).join(" | ");
    return "[id:" + batch.id + "] [其他粉丝消息批次]: " + join_220;
  }
  function createOtherFanReplyMeta(fanMessage) {
    if (!fanMessage) return null;
    return {
      id: fanMessage.id,
      speaker: stripGeneratedText(fanMessage.name, "粉丝"),
      text: getMessageSummary({
        type: "text",
        text: fanMessage.text
      }),
      isUser: false,
      isOtherFan: true
    };
  }
  function closeOtherFansModal() {
    if (!bstageOtherFansModal) return;
    bstageOtherFansModal.classList.remove("active");
  }
  function openOtherFansModal(member_4, value_223) {
    const normalizedBatch = handleAction_53(value_223),
      title_2 = document.getElementById("bstage-other-fans-title"),
      list = document.getElementById("bstage-other-fans-list");
    if (!normalizedBatch || !list) return;
    const memberName = member_4 && member_4.name ? member_4.name : "Char";
    if (title_2) title_2.textContent = "其他粉丝给 " + memberName + " 的消息";
    const messages_2 = normalizedBatch.fanMessages || [];
    messages_2.length === 0 ? list.innerHTML = "<div class=\"bstage-other-fans-empty\">本轮没有可查看的其他粉丝消息</div>" : list.innerHTML = messages_2.map(fan_2 => {
      const value_228 = fan_2.trans ? "<div class=\"bstage-other-fan-trans\">" + escapeHtml(fan_2.trans) + "</div>" : "";
      return "\n                    <div class=\"bstage-other-fan-item\">\n                        " + renderBstageAvatar(fan_2, fan_2.name || "粉丝", "bstage-other-fan-avatar") + "\n                        <div class=\"bstage-other-fan-body\">\n                            <div class=\"bstage-other-fan-name\">" + escapeHtml(fan_2.name || "粉丝") + "</div>\n                            <div class=\"bstage-other-fan-text\">" + escapeHtml(fan_2.text || "") + "</div>\n                            " + value_228 + "\n                        </div>\n                    </div>\n                ";
    }).join("");
    bstageOtherFansModal.classList.add("active");
  }
  function openBstageImagePreview(src_2, textContent_2) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    overlay.style.zIndex = "10000";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.cursor = "zoom-out";
    const img_2 = document.createElement("img");
    img_2.src = src_2;
    img_2.style.maxWidth = "90%";
    img_2.style.maxHeight = "80%";
    img_2.style.objectFit = "contain";
    img_2.style.borderRadius = "12px";
    img_2.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
    overlay.appendChild(img_2);
    if (textContent_2) {
      const textDiv = document.createElement("div");
      textDiv.style.color = "#fff";
      textDiv.style.marginTop = "20px";
      textDiv.style.maxWidth = "90%";
      textDiv.style.textAlign = "center";
      textDiv.style.fontSize = "16px";
      textDiv.textContent = textContent_2;
      overlay.appendChild(textDiv);
    }
    document.body.appendChild(overlay);
    overlay.addEventListener("click", () => overlay.remove());
  }
  function attachBstageImagePreview(container) {
    if (!container) return;
    const imgNode = container.querySelector(".bstage-chat-image-clickable");
    if (!imgNode) return;
    imgNode.addEventListener("click", e => {
      e.stopPropagation();
      openBstageImagePreview(imgNode.src, imgNode.getAttribute("data-desc") || "");
    });
  }
  function formatMessageForPrompt(msg_6, value_233) {
    if (!msg_6 || msg_6.type === "date") return "";
    if (msg_6.type === "fan_batch") return formatFanBatchForPrompt(msg_6);
    ensureMessageId(msg_6, msg_6.isUser ? "user" : "ai");
    const messageSummary = getMessageSummary(msg_6),
      replyText = formatReplyForPrompt(msg_6.replyTo);
    return "[id:" + msg_6.id + "] [" + value_233 + "]" + replyText + ": " + messageSummary;
  }
  function setPendingReply(value_235, target_3) {
    const isFan = value_235 === "fan";
    if (isFan) pendingFanReply = target_3;else pendingChatReply = target_3;
    const preview_2 = document.getElementById(isFan ? "bstage-fan-chat-reply-preview" : "bstage-chat-reply-preview"),
      textEl = document.getElementById(isFan ? "bstage-fan-chat-reply-preview-text" : "bstage-chat-reply-preview-text");
    preview_2 && textEl && (target_3 ? (textEl.textContent = target_3.speaker + ": " + target_3.text, preview_2.style.display = "flex", preview_2.classList.add("active")) : (textEl.textContent = "", preview_2.style.display = "none", preview_2.classList.remove("active")));
    const input_3 = document.getElementById(isFan ? "bstage-fan-chat-input" : "bstage-chat-input");
    if (target_3 && input_3) input_3.focus({
      preventScroll: true
    });
  }
  function clearPendingReply(kind) {
    setPendingReply(kind, null);
  }
  function setChatActionLoading(button_2, isLoading) {
    if (!button_2) return;
    button_2.classList.toggle("is-loading", isLoading);
    button_2.setAttribute("aria-disabled", isLoading ? "true" : "false");
    button_2.innerHTML = isLoading ? "<i class=\"fas fa-spinner\"></i>" : "<i class=\"fas fa-arrow-down\"></i>";
  }
  function parseApiJsonContent(rawContent) {
    const cleaned = String(rawContent || "").replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  }
  async function callBstageJsonApi(content_3, content_2 = "You are a JSON generator.", temperature_2 = 0.7) {
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) throw new Error("missing_api_config");
    const configuredTemperature = window.apiConfig.temperature !== undefined ? window.apiConfig.temperature : window.apiConfig.temp,
      value_245 = await fetch(normalizeChatCompletionsEndpoint(window.apiConfig.endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.apiConfig.apiKey
        },
        body: JSON.stringify({
          model: window.apiConfig.model || "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: content_2
          }, {
            role: "user",
            content: content_3
          }],
          temperature: parseFloat(configuredTemperature) || temperature_2
        })
      });
    if (!value_245.ok) throw window.u2Api?.createHttpError?.(value_245, await window.u2Api?.readApiError?.(value_245)) || Object.assign(new Error("HTTP " + value_245.status), {
      status: value_245.status
    });
    const data = await value_245.json();
    return parseApiJsonContent(data && data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "");
  }
  function openGenerateTypeSheet({
    title: title_3,
    label: label_3,
    placeholder: placeholder_2,
    onConfirm: onConfirm_2
  }) {
    currentGenerateTypeAction = typeof onConfirm_2 === "function" ? onConfirm_2 : null;
    const titleEl = document.getElementById("bstage-generate-type-title"),
      labelEl = document.getElementById("bstage-generate-type-label"),
      inputEl = document.getElementById("bstage-generate-type-input"),
      bstageGenerateTypeConfirmBtnElement_252 = document.getElementById("bstage-generate-type-confirm-btn");
    if (titleEl) titleEl.textContent = title_3 || "生成内容";
    if (labelEl) labelEl.textContent = label_3 || "想看什么类型";
    inputEl && (inputEl.value = "", inputEl.placeholder = placeholder_2 || "留空则随机生成");
    bstageGenerateTypeConfirmBtnElement_252 && (bstageGenerateTypeConfirmBtnElement_252.classList.remove("is-loading"), bstageGenerateTypeConfirmBtnElement_252.textContent = "确认生成");
    window.openView(generateTypeSheet);
    setTimeout(() => {
      if (inputEl) inputEl.focus({
        preventScroll: true
      });
    }, 80);
  }
  async function handleAction_57() {
    if (!currentGenerateTypeAction) return;
    const confirmBtn = document.getElementById("bstage-generate-type-confirm-btn"),
      inputEl_2 = document.getElementById("bstage-generate-type-input");
    if (confirmBtn && confirmBtn.classList.contains("is-loading")) return;
    const readOnly_3 = !!inputEl_2?.readOnly;
    confirmBtn && (confirmBtn.classList.add("is-loading"), confirmBtn.textContent = "生成中...");
    inputEl_2 && (inputEl_2.readOnly = true, inputEl_2.setAttribute("aria-busy", "true"));
    try {
      await currentGenerateTypeAction(inputEl_2 ? inputEl_2.value.trim() : "");
      window.closeView(generateTypeSheet);
    } finally {
      inputEl_2 && (inputEl_2.readOnly = readOnly_3, inputEl_2.removeAttribute("aria-busy"));
      confirmBtn && (confirmBtn.classList.remove("is-loading"), confirmBtn.textContent = "确认生成");
    }
  }
  function checkAndAddDateBubble(member_5, contentContainer_2, timestamp_5) {
    if (!member_5.chatHistory) member_5.chatHistory = [];
    let lastMsg = null;
    for (let i_2 = member_5.chatHistory.length - 1; i_2 >= 0; i_2--) {
      if (member_5.chatHistory[i_2].type !== "date") {
        lastMsg = member_5.chatHistory[i_2];
        break;
      }
    }
    const count_260 = 300000;
    if (!lastMsg || !lastMsg.timestamp || timestamp_5 - lastMsg.timestamp > count_260) {
      const textContent_3 = handleAction_40(timestamp_5),
        options_263 = {
          type: "date",
          text: textContent_3,
          timestamp: timestamp_5
        };
      member_5.chatHistory.push(options_263);
      if (contentContainer_2) {
        const dateDiv = document.createElement("div");
        dateDiv.className = "bstage-chat-date";
        dateDiv.textContent = textContent_3;
        contentContainer_2.appendChild(dateDiv);
      }
      return options_263;
    }
    return null;
  }
  function handleAction_59(entity_3, seed_3) {
    if (!entity_3 || typeof entity_3 !== "object") return false;
    let enabled_267 = false;
    return isBstageRandomAvatar(entity_3.avatar) && (entity_3.avatarEmoji = entity_3.avatarEmoji || getStableEmojiAvatar(seed_3 || entity_3.avatar), entity_3.avatar = null, enabled_267 = true), enabled_267;
  }
  function normalizeLoadedBstageData() {
    let changed_2 = false;
    if (bstageFanSubscriberCount_2 != null && Number.isFinite(Number(bstageFanSubscriberCount_2))) {
      const bstageSubscriberCount = normalizeBstageSubscriberCount(bstageFanSubscriberCount_2);
      bstageSubscriberCount !== bstageFanSubscriberCount_2 && (bstageFanSubscriberCount_2 = bstageSubscriberCount, changed_2 = true);
    }
    const value_269 = team_7 => {
      if (!team_7 || !Array.isArray(team_7.videos)) return;
      team_7.videos.forEach(video_2 => {
        if (!video_2 || !Array.isArray(video_2.comments)) return;
        video_2.comments.forEach(comment => {
          if (!comment || typeof comment !== "object") return;
          const id_273 = comment.id;
          ensureMessageId(comment, comment.isUser ? "user_comment" : "video_comment");
          if (!id_273) changed_2 = true;
          !comment.isUser && !comment.avatar && !comment.avatarEmoji && (comment.avatarEmoji = getStableEmojiAvatar("video-comment-" + (comment.name || comment.id)), changed_2 = true);
          !Array.isArray(comment.replies) && (comment.replies = [], changed_2 = true);
          comment.replies.forEach(reply => {
            if (!reply || typeof reply !== "object") return;
            const id_275 = reply.id;
            ensureMessageId(reply, "video_comment_reply");
            if (!id_275) changed_2 = true;
            !reply.avatarEmoji && (reply.avatarEmoji = getStableEmojiAvatar("video-comment-reply-" + (reply.name || reply.id)), changed_2 = true);
          });
        });
      });
    };
    return teams_2.forEach(value_276 => {
      changed_2 = handleAction_48(value_276) || changed_2;
      changed_2 = handleAction_59(value_276, "team-" + (value_276.id || value_276.name)) || changed_2;
      Array.isArray(value_276.members) && value_276.members.forEach(value_277 => {
        changed_2 = handleAction_59(value_277, "member-" + (value_277.id || value_277.name)) || changed_2;
        Array.isArray(value_277.chatHistory) && value_277.chatHistory.forEach(msg_7 => {
          if (!msg_7 || msg_7.type === "date") return;
          if (msg_7.type === "fan_batch") {
            const beforeId = msg_7.id,
              beforeCount = Array.isArray(msg_7.fanMessages) ? msg_7.fanMessages.length : -1;
            handleAction_53(msg_7);
            if (!beforeId || beforeCount !== msg_7.fanMessages.length) changed_2 = true;
            return;
          }
          const id_279 = msg_7.id;
          ensureMessageId(msg_7, msg_7.isUser ? "user" : "char");
          if (!id_279) changed_2 = true;
        });
      });
      value_269(value_276);
    }), changed_2 = handleAction_48(bstageUserTeamState_2) || changed_2, changed_2 = handleAction_59(bstageUserTeamState_2, "team-" + (bstageUserTeamState_2.id || bstageUserTeamState_2.name || "user")) || changed_2, value_269(bstageUserTeamState_2), Array.isArray(bstageFanChatHistory_2) && bstageFanChatHistory_2.forEach(message_282 => {
      if (!message_282 || message_282.type === "date") return;
      const id_283 = message_282.id;
      ensureMessageId(message_282, message_282.isUser ? "user" : "fan");
      if (!id_283) changed_2 = true;
      !message_282.isUser && (changed_2 = handleAction_59(message_282, "fan-" + (message_282.name || message_282.id)) || changed_2, !message_282.avatarEmoji && (message_282.avatarEmoji = getStableEmojiAvatar("fan-" + (message_282.name || message_282.id || message_282.timestamp)), changed_2 = true));
    }), changed_2;
  }
  function saveBstageData(options_3 = {}) {
    if (!bstageHydrationComplete) return false;
    try {
      handleAction_82();
      bstageFanSubscriberCount_2 != null && (bstageFanSubscriberCount_2 = normalizeBstageSubscriberCount(bstageFanSubscriberCount_2));
      const flush_2 = options_3 && options_3.flush === true,
        updatedAt_2 = Date.now();
      count_27 = updatedAt_2;
      const __bstageGlobalState_2 = {
        schemaVersion: schemaVersion_2,
        updatedAt: updatedAt_2,
        teams: teams_2,
        bstageOrders: bstageOrders_2,
        bstageFanChatHistory: bstageFanChatHistory_2,
        bstageFanChatSettings: bstageFanChatSettings_2,
        bstageUserTeamState: bstageUserTeamState_2,
        bstageFanSubscriberCount: bstageFanSubscriberCount_2,
        bstageRevenueState: bstageRevenueState_2,
        chatPhotos: chatPhotos_2,
        bstagePresets: bstagePresets_2,
        isTranslationEnabled: isTranslationEnabled_2,
        isContextEnabled: isContextEnabled_2,
        contextMessageCount: contextMessageCount_2
      };
      window.__bstageGlobalState = __bstageGlobalState_2;
      if (typeof window.setAppState === "function") {
        window.setAppState("bstage", __bstageGlobalState_2);
        if (flush_2 && typeof window.saveGlobalData === "function") return Promise.resolve(window.saveGlobalData()).then(Boolean);
        return true;
      }
      if (window.saveGlobalData) return flush_2 ? Promise.resolve(window.saveGlobalData()).then(Boolean) : window.saveGlobalData();
    } catch (e_2) {
      console.warn("Bstage data save failed (possibly quota exceeded):", e_2);
    }
    return false;
  }
  function loadBstageData(options_4 = {}) {
    const persistNormalized_2 = options_4.persistNormalized !== false;
    let normalized = false;
    try {
      const data_2 = typeof window.getAppState === "function" ? window.getAppState("bstage") : window.__bstageGlobalState;
      window.__bstageGlobalState = data_2 && typeof data_2 === "object" ? data_2 : {};
      if (Array.isArray(window.__bstageGlobalState.teams)) teams_2 = window.__bstageGlobalState.teams;
      if (Array.isArray(window.__bstageGlobalState.bstageOrders)) bstageOrders_2 = window.__bstageGlobalState.bstageOrders;
      if (Array.isArray(window.__bstageGlobalState.bstageFanChatHistory)) bstageFanChatHistory_2 = window.__bstageGlobalState.bstageFanChatHistory;
      window.__bstageGlobalState.bstageFanChatSettings && typeof window.__bstageGlobalState.bstageFanChatSettings === "object" && (bstageFanChatSettings_2 = {
        ...bstageFanChatSettings_2,
        ...window.__bstageGlobalState.bstageFanChatSettings
      });
      window.__bstageGlobalState.bstageUserTeamState && typeof window.__bstageGlobalState.bstageUserTeamState === "object" && (bstageUserTeamState_2 = {
        ...bstageUserTeamState_2,
        ...window.__bstageGlobalState.bstageUserTeamState
      });
      Number.isFinite(Number(window.__bstageGlobalState.bstageFanSubscriberCount)) && (bstageFanSubscriberCount_2 = normalizeBstageSubscriberCount(window.__bstageGlobalState.bstageFanSubscriberCount));
      if (window.__bstageGlobalState.bstageRevenueState && typeof window.__bstageGlobalState.bstageRevenueState === "object") {
        const withdrawnCny_2 = Number(window.__bstageGlobalState.bstageRevenueState.withdrawnCny);
        bstageRevenueState_2 = {
          withdrawnCny: Number.isFinite(withdrawnCny_2) ? Math.max(0, withdrawnCny_2) : 0,
          lastWithdrawAt: window.__bstageGlobalState.bstageRevenueState.lastWithdrawAt || null
        };
      }
      if (Array.isArray(window.__bstageGlobalState.chatPhotos)) chatPhotos_2 = window.__bstageGlobalState.chatPhotos;
      if (window.__bstageGlobalState.bstagePresets) bstagePresets_2 = window.__bstageGlobalState.bstagePresets;
      if (typeof window.__bstageGlobalState.isTranslationEnabled === "boolean") isTranslationEnabled_2 = window.__bstageGlobalState.isTranslationEnabled;
      if (typeof window.__bstageGlobalState.isContextEnabled === "boolean") isContextEnabled_2 = window.__bstageGlobalState.isContextEnabled;
      Number.isFinite(Number(window.__bstageGlobalState.contextMessageCount)) && (contextMessageCount_2 = Math.max(1, parseInt(window.__bstageGlobalState.contextMessageCount, 10) || 50));
      Number.isFinite(Number(window.__bstageGlobalState.updatedAt)) && (count_27 = Number(window.__bstageGlobalState.updatedAt) || 0);
      if (persistNormalized_2) {
        normalized = normalizeLoadedBstageData();
        if (normalized && bstageHydrationComplete) saveBstageData();
      }
    } catch (e_3) {
      console.error("Bstage data load failed:", e_3);
    }
    return normalized;
  }
  loadBstageData({
    persistNormalized: false
  });
  const originalCloseView = window.closeView;
  window.closeView = function (view) {
    if (!originalCloseView) return;
    const activeElement_2 = document.activeElement,
      shouldWaitForKeyboard = !!(view && isBstageAndroid && view.id && view.id.startsWith("bstage-") && activeElement_2 && view.contains(activeElement_2) && isBstageEditableElement(activeElement_2));
    if (!shouldWaitForKeyboard) {
      originalCloseView(view);
      return;
    }
    if (pendingBstageKeyboardCloses.has(view)) return;
    pendingBstageKeyboardCloses.add(view);
    handleAction_37(view)["finally"](() => {
      pendingBstageKeyboardCloses["delete"](view);
      originalCloseView(view);
    });
  };
  function flushBstageDataNow() {
    saveBstageData();
    typeof window.saveGlobalData === "function" && window.saveGlobalData();
  }
  window.addEventListener("pagehide", flushBstageDataNow);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushBstageDataNow();
  });
  const appBtn = document.getElementById("app-bstage-btn");
  appBtn && appBtn.addEventListener("click", () => {
    window.openView(bstageView);
    !bstageHydrationComplete && typeof window.showToast === "function" && window.showToast("b.stage 数据正在加载，请稍候");
  });
  document.getElementById("bstage-back-btn").addEventListener("click", () => {
    window.closeView(bstageView);
  });
  document.getElementById("bstage-chat-back-btn").addEventListener("click", () => {
    window.closeView(bstageChatView);
  });
  document.getElementById("bstage-fan-chat-back-btn").addEventListener("click", () => {
    window.closeView(bstageFanChatView);
  });
  document.getElementById("bstage-fan-chat-menu-btn").addEventListener("click", () => {
    openFanChatDetailSheet();
  });
  const chatReplyCancelBtn = document.getElementById("bstage-chat-reply-cancel-btn");
  chatReplyCancelBtn && (chatReplyCancelBtn.addEventListener("click", () => clearPendingReply("chat")), chatReplyCancelBtn.addEventListener("keydown", event_297 => {
    (event_297.key === "Enter" || event_297.key === " ") && (event_297.preventDefault(), clearPendingReply("chat"));
  }));
  const fanChatReplyCancelBtn = document.getElementById("bstage-fan-chat-reply-cancel-btn");
  fanChatReplyCancelBtn && (fanChatReplyCancelBtn.addEventListener("click", () => clearPendingReply("fan")), fanChatReplyCancelBtn.addEventListener("keydown", event_298 => {
    (event_298.key === "Enter" || event_298.key === " ") && (event_298.preventDefault(), clearPendingReply("fan"));
  }));
  const bstageGenerateTypeConfirmBtnElement = document.getElementById("bstage-generate-type-confirm-btn"),
    bstageGenerateTypeInputElement = document.getElementById("bstage-generate-type-input");
  if (bstageGenerateTypeConfirmBtnElement) bindBstageFocusPreservingAction(bstageGenerateTypeConfirmBtnElement, handleAction_57);
  bstageGenerateTypeInputElement && bstageGenerateTypeInputElement.addEventListener("keydown", event_299 => {
    event_299.key === "Enter" && !event_299.isComposing && event_299.keyCode !== 229 && (event_299.preventDefault(), handleAction_57());
  });
  function startAutoActivity(member_6) {
    if (autoActivityIntervals[member_6.id]) clearInterval(autoActivityIntervals[member_6.id]);
    let intervalSec = member_6.autoActivityInterval || 60;
    autoActivityIntervals[member_6.id] = setInterval(() => {
      if (!ensureBstageHydrated(false)) return;
      const canonical = findCanonicalBstageMember(member_6.id);
      if (!canonical) {
        stopAutoActivity(member_6);
        return;
      }
      member_6 = canonical.member;
      const contentContainer = currentChatMember && currentChatMember.id === member_6.id && bstageChatView.style.display !== "none" ? document.getElementById("bstage-chat-content") : null;
      triggerChatApi(member_6, contentContainer, true);
    }, intervalSec * 1000);
  }
  function stopAutoActivity(value_301) {
    autoActivityIntervals[value_301.id] && (clearInterval(autoActivityIntervals[value_301.id]), delete autoActivityIntervals[value_301.id]);
  }
  function handleAction_63() {
    teams_2.forEach(value_302 => {
      value_302.members && value_302.members.forEach(value_303 => {
        value_303.autoActivityEnabled && startAutoActivity(value_303);
      });
    });
  }
  document.getElementById("bstage-chat-menu-btn").addEventListener("click", () => {
    if (currentChatMember) {
      document.getElementById("bstage-detail-name").textContent = currentChatMember.name;
      const value_304 = Math.floor((Date.now() - currentChatMember.subStartDate) / 86400000) + 1;
      document.getElementById("bstage-detail-days").textContent = "已一同 " + value_304 + " 天";
      const avatar_3 = document.getElementById("bstage-detail-avatar"),
        avatarText = document.getElementById("bstage-detail-avatar-text"),
        avatarContainer = document.getElementById("bstage-detail-avatar-container");
      currentChatMember.avatar ? (avatar_3.src = currentChatMember.avatar, avatar_3.style.display = "block", avatarText.style.display = "none", avatarContainer.style.backgroundColor = "#1c1c1e") : (avatar_3.style.display = "none", avatarText.style.display = "block", avatarText.textContent = currentChatMember.name[0], avatarContainer.style.backgroundColor = "#333");
      const bstageContextSwitchElement = document.getElementById("bstage-context-switch");
      if (isContextEnabled_2) bstageContextSwitchElement.classList.add("active");else bstageContextSwitchElement.classList.remove("active");
      document.getElementById("bstage-context-count").value = contextMessageCount_2;
      const bstageTransSwitchElement = document.getElementById("bstage-trans-switch");
      if (isTranslationEnabled_2) bstageTransSwitchElement.classList.add("active");else bstageTransSwitchElement.classList.remove("active");
      const otherFansSwitch = document.getElementById("bstage-other-fans-switch");
      if (otherFansSwitch) otherFansSwitch.classList.toggle("active", !!currentChatMember.otherFansEnabled);
      renderLockerPreview();
      handleAction_64();
      const autoSwitch = document.getElementById("bstage-auto-activity-switch"),
        bstageAutoActivityOptionsElement = document.getElementById("bstage-auto-activity-options"),
        autoInterval = document.getElementById("bstage-auto-activity-interval"),
        autoPreset = document.getElementById("bstage-auto-activity-preset");
      currentChatMember.autoActivityEnabled ? (autoSwitch.classList.add("active"), bstageAutoActivityOptionsElement.style.display = "block") : (autoSwitch.classList.remove("active"), bstageAutoActivityOptionsElement.style.display = "none");
      autoInterval.value = currentChatMember.autoActivityInterval || 60;
      autoPreset.innerHTML = "<option value=\"\">默认全局API</option>";
      let globalPresets = [];
      try {
        window.StorageManager && (globalPresets = window.StorageManager.load("u2_apiPresets", []));
      } catch (value_306) {}
      globalPresets.forEach(value_307 => {
        autoPreset.innerHTML += "<option value=\"" + value_307.id + "\">" + value_307.name + "</option>";
      });
      currentChatMember.autoActivityPresetId && (autoPreset.value = currentChatMember.autoActivityPresetId);
      window.openView(chatDetailSheet);
    }
  });
  document.getElementById("bstage-auto-activity-switch").addEventListener("click", function () {
    if (!currentChatMember) return;
    currentChatMember.autoActivityEnabled = !currentChatMember.autoActivityEnabled;
    const bstageAutoActivityOptionsElement_308 = document.getElementById("bstage-auto-activity-options");
    currentChatMember.autoActivityEnabled ? (this.classList.add("active"), bstageAutoActivityOptionsElement_308.style.display = "block", startAutoActivity(currentChatMember), window.showToast("自主活动已开启")) : (this.classList.remove("active"), bstageAutoActivityOptionsElement_308.style.display = "none", stopAutoActivity(currentChatMember), window.showToast("自主活动已关闭"));
    saveBstageData();
  });
  document.getElementById("bstage-auto-activity-interval").addEventListener("change", function () {
    if (!currentChatMember) return;
    let int = parseInt(this.value, 10);
    if (isNaN(int) || int < 5) int = 5;
    this.value = int;
    currentChatMember.autoActivityInterval = int;
    currentChatMember.autoActivityEnabled && startAutoActivity(currentChatMember);
    saveBstageData();
  });
  document.getElementById("bstage-auto-activity-preset").addEventListener("change", function () {
    if (!currentChatMember) return;
    currentChatMember.autoActivityPresetId = this.value;
    saveBstageData();
  });
  document.getElementById("bstage-global-settings-btn").addEventListener("click", () => {
    renderPresetList();
    window.openView(globalSettingsModal);
  });
  document.querySelectorAll(".bstage-preset-tab").forEach(tab_2 => {
    tab_2.addEventListener("click", e_4 => {
      document.querySelectorAll(".bstage-preset-tab").forEach(t => {
        t.classList.remove("active");
        t.style.background = "#2c2c2e";
        t.style.color = "#fff";
      });
      e_4.target.classList.add("active");
      e_4.target.style.background = "#fff";
      e_4.target.style.color = "#000";
      currentPresetTab = e_4.target.getAttribute("data-type");
      renderPresetList();
    });
  });
  document.getElementById("bstage-save-preset-btn").addEventListener("click", () => {
    const nameInput = document.getElementById("bstage-preset-name-input"),
      cssInput = document.getElementById("bstage-preset-css-input"),
      name_3 = nameInput.value.trim(),
      css_2 = cssInput.value.trim();
    if (!name_3 || !css_2) {
      window.showToast("请输入预设名称和 CSS 代码");
      return;
    }
    const newPreset = {
      id: "preset_" + Date.now(),
      name: name_3,
      css: css_2
    };
    !bstagePresets_2[currentPresetTab] && (bstagePresets_2[currentPresetTab] = []);
    bstagePresets_2[currentPresetTab].push(newPreset);
    saveBstageData();
    renderPresetList();
    nameInput.value = "";
    cssInput.value = "";
    window.showToast("预设已保存");
  });
  function renderPresetList() {
    const container_2 = document.getElementById("bstage-preset-list");
    container_2.innerHTML = "";
    const list_2 = bstagePresets_2[currentPresetTab] || [];
    if (list_2.length === 0) {
      container_2.innerHTML = "<div style=\"color: #888; text-align: center; padding: 10px;\">暂无预设</div>";
      return;
    }
    list_2.forEach(preset => {
      const item_4 = document.createElement("div");
      item_4.style.cssText = "background: #2c2c2e; padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;";
      item_4.innerHTML = "\n                <div style=\"flex: 1; overflow: hidden;\">\n                    <div style=\"color: #fff; font-weight: bold; margin-bottom: 4px;\">" + preset.name + "</div>\n                    <div style=\"color: #aaa; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">" + preset.css + "</div>\n                </div>\n                <div class=\"bstage-preset-del-btn\" style=\"color: #ff3b30; padding: 5px; cursor: pointer;\"><i class=\"fas fa-trash\"></i></div>\n            ";
      item_4.querySelector(".bstage-preset-del-btn").addEventListener("click", () => {
        bstagePresets_2[currentPresetTab] = bstagePresets_2[currentPresetTab].filter(p => p.id !== preset.id);
        saveBstageData();
        renderPresetList();
      });
      container_2.appendChild(item_4);
    });
  }
  function handleAction_64() {
    const chatSelect = document.getElementById("bstage-chat-css-select"),
      frameSelect = document.getElementById("bstage-frame-css-select"),
      bubbleSelect = document.getElementById("bstage-bubble-css-select");
    chatSelect.innerHTML = "<option value=\"\">默认</option>";
    (bstagePresets_2.chatCss || []).forEach(value_316 => {
      chatSelect.innerHTML += "<option value=\"" + value_316.id + "\">" + value_316.name + "</option>";
    });
    currentChatMember && currentChatMember.chatCssId && (chatSelect.value = currentChatMember.chatCssId);
    frameSelect.innerHTML = "<option value=\"\">默认</option>";
    (bstagePresets_2.avatarFrameCss || []).forEach(value_317 => {
      frameSelect.innerHTML += "<option value=\"" + value_317.id + "\">" + value_317.name + "</option>";
    });
    currentChatMember && currentChatMember.frameCssId && (frameSelect.value = currentChatMember.frameCssId);
    bubbleSelect.innerHTML = "<option value=\"\">默认</option>";
    (bstagePresets_2.bubbleCss || []).forEach(value_318 => {
      bubbleSelect.innerHTML += "<option value=\"" + value_318.id + "\">" + value_318.name + "</option>";
    });
    currentChatMember && currentChatMember.bubbleCssId && (bubbleSelect.value = currentChatMember.bubbleCssId);
  }
  function handleAction_65() {
    const chatSelect_2 = document.getElementById("bstage-fan-chat-css-select"),
      bubbleSelect_2 = document.getElementById("bstage-fan-bubble-css-select");
    if (!chatSelect_2 || !bubbleSelect_2) return;
    chatSelect_2.innerHTML = "<option value=\"\">默认</option>";
    (bstagePresets_2.chatCss || []).forEach(value_319 => {
      chatSelect_2.innerHTML += "<option value=\"" + value_319.id + "\">" + value_319.name + "</option>";
    });
    chatSelect_2.value = bstageFanChatSettings_2.chatCssId || "";
    bubbleSelect_2.innerHTML = "<option value=\"\">默认</option>";
    (bstagePresets_2.bubbleCss || []).forEach(value_320 => {
      bubbleSelect_2.innerHTML += "<option value=\"" + value_320.id + "\">" + value_320.name + "</option>";
    });
    bubbleSelect_2.value = bstageFanChatSettings_2.bubbleCssId || "";
  }
  document.getElementById("bstage-chat-css-select").addEventListener("change", e_5 => {
    if (!currentChatMember) return;
    currentChatMember.chatCssId = e_5.target.value;
    applyDynamicStyles();
    saveBstageData();
  });
  document.getElementById("bstage-frame-css-select").addEventListener("change", e_6 => {
    if (!currentChatMember) return;
    currentChatMember.frameCssId = e_6.target.value;
    applyDynamicStyles();
    saveBstageData();
  });
  document.getElementById("bstage-bubble-css-select").addEventListener("change", e_7 => {
    if (!currentChatMember) return;
    currentChatMember.bubbleCssId = e_7.target.value;
    applyDynamicStyles();
    saveBstageData();
  });
  document.getElementById("bstage-fan-chat-css-select").addEventListener("change", e_8 => {
    bstageFanChatSettings_2.chatCssId = e_8.target.value;
    applyFanChatSettings();
    saveBstageData();
  });
  document.getElementById("bstage-fan-bubble-css-select").addEventListener("change", e_9 => {
    bstageFanChatSettings_2.bubbleCssId = e_9.target.value;
    applyFanChatSettings();
    saveBstageData();
  });
  function applyDynamicStyles() {
    let styleTag = document.getElementById("bstage-dynamic-styles");
    !styleTag && (styleTag = document.createElement("style"), styleTag.id = "bstage-dynamic-styles", document.head.appendChild(styleTag));
    let textContent_9 = "";
    if (currentChatMember && currentChatMember.chatCssId) {
      const result_327 = (bstagePresets_2.chatCss || []).find(value_328 => value_328.id === currentChatMember.chatCssId);
      result_327 && (textContent_9 += "\n                    #bstage-chat-view {\n                        " + result_327.css + "\n                    }\n                ");
    }
    if (currentChatMember && currentChatMember.frameCssId) {
      const preset_2 = (bstagePresets_2.avatarFrameCss || []).find(p_2 => p_2.id === currentChatMember.frameCssId);
      preset_2 && (textContent_9 += "\n                    #bstage-chat-view .bstage-chat-msg.income img {\n                        " + preset_2.css + "\n                    }\n                    #bstage-detail-avatar {\n                        " + preset_2.css + "\n                    }\n                ");
    }
    if (currentChatMember && currentChatMember.bubbleCssId) {
      const result_331 = (bstagePresets_2.bubbleCss || []).find(value_332 => value_332.id === currentChatMember.bubbleCssId);
      result_331 && (textContent_9 += "\n                    #bstage-chat-view .bstage-chat-bubble {\n                        " + result_331.css + "\n                    }\n                ");
    }
    if (bstageFanChatSettings_2.chatCssId) {
      const result_333 = (bstagePresets_2.chatCss || []).find(value_334 => value_334.id === bstageFanChatSettings_2.chatCssId);
      result_333 && (textContent_9 += "\n                    #bstage-fan-chat-view {\n                        " + result_333.css + "\n                    }\n                ");
    }
    if (bstageFanChatSettings_2.bubbleCssId) {
      const result_335 = (bstagePresets_2.bubbleCss || []).find(value_336 => value_336.id === bstageFanChatSettings_2.bubbleCssId);
      result_335 && (textContent_9 += "\n                    #bstage-fan-chat-view .bstage-chat-bubble {\n                        " + result_335.css + "\n                    }\n                ");
    }
    styleTag.textContent = textContent_9;
  }
  document.getElementById("bstage-context-switch").addEventListener("click", function () {
    isContextEnabled_2 = !isContextEnabled_2;
    if (isContextEnabled_2) this.classList.add("active");else this.classList.remove("active");
    const bstageFanContextSwitchElement = document.getElementById("bstage-fan-context-switch");
    if (bstageFanContextSwitchElement) bstageFanContextSwitchElement.classList.toggle("active", isContextEnabled_2);
    saveBstageData();
    window.showToast("上下文携带已" + (isContextEnabled_2 ? "开启" : "关闭"));
  });
  document.getElementById("bstage-context-count").addEventListener("change", function () {
    let val = parseInt(this.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    contextMessageCount_2 = val;
    this.value = val;
    const fanContextCount = document.getElementById("bstage-fan-context-count");
    if (fanContextCount) fanContextCount.value = val;
    saveBstageData();
  });
  document.getElementById("bstage-fan-context-switch").addEventListener("click", function () {
    isContextEnabled_2 = !isContextEnabled_2;
    if (isContextEnabled_2) this.classList.add("active");else this.classList.remove("active");
    const bstageContextSwitchElement_337 = document.getElementById("bstage-context-switch");
    if (bstageContextSwitchElement_337) bstageContextSwitchElement_337.classList.toggle("active", isContextEnabled_2);
    saveBstageData();
    window.showToast("上下文携带已" + (isContextEnabled_2 ? "开启" : "关闭"));
  });
  document.getElementById("bstage-fan-context-count").addEventListener("change", function () {
    let val_2 = parseInt(this.value, 10);
    if (isNaN(val_2) || val_2 < 1) val_2 = 1;
    contextMessageCount_2 = val_2;
    this.value = val_2;
    const charContextCount = document.getElementById("bstage-context-count");
    if (charContextCount) charContextCount.value = val_2;
    saveBstageData();
  });
  const chatClearBtn = document.getElementById("bstage-chat-clear-btn");
  chatClearBtn && chatClearBtn.addEventListener("click", () => {
    if (!currentChatMember) return;
    if (confirm("确定要清空与 " + currentChatMember.name + " 的聊天记录吗？此操作不可恢复。")) {
      currentChatMember.chatHistory = [];
      saveBstageData();
      const bstageChatContentElement = document.getElementById("bstage-chat-content");
      bstageChatContentElement && (bstageChatContentElement.innerHTML = "<div style=\"text-align:center; color:#666; padding:20px; font-size:13px;\">聊天记录已清空</div>");
      window.showToast("聊天记录已清空");
      window.closeView(chatDetailSheet);
    }
  });
  const chatExitBtn = document.getElementById("bstage-chat-exit-btn");
  chatExitBtn && chatExitBtn.addEventListener("click", () => {
    if (!currentChatMember) return;
    if (confirm("确定要清空与 " + currentChatMember.name + " 的聊天记录吗？此操作不可恢复。")) {
      currentChatMember.chatHistory = [];
      saveBstageData();
      const bstageChatContentElement_339 = document.getElementById("bstage-chat-content");
      bstageChatContentElement_339 && (bstageChatContentElement_339.innerHTML = "<div style=\"text-align:center; color:#666; padding:20px; font-size:13px;\">聊天记录已清空</div>");
      window.showToast("聊天记录已清空");
      window.closeView(chatDetailSheet);
    }
  });
  document.getElementById("bstage-trans-switch").addEventListener("click", function () {
    isTranslationEnabled_2 = !isTranslationEnabled_2;
    if (isTranslationEnabled_2) this.classList.add("active");else this.classList.remove("active");
    const bstageChatContentElement_340 = document.getElementById("bstage-chat-content");
    if (bstageChatContentElement_340) {
      if (isTranslationEnabled_2) bstageChatContentElement_340.classList.add("show-trans");else bstageChatContentElement_340.classList.remove("show-trans");
    }
    syncFanChatTranslationState();
    const bstageFanTransSwitchElement = document.getElementById("bstage-fan-trans-switch");
    if (bstageFanTransSwitchElement) bstageFanTransSwitchElement.classList.toggle("active", isTranslationEnabled_2);
    saveBstageData();
    window.showToast("实时翻译已" + (isTranslationEnabled_2 ? "开启" : "关闭"));
  });
  document.getElementById("bstage-fan-trans-switch").addEventListener("click", function () {
    isTranslationEnabled_2 = !isTranslationEnabled_2;
    if (isTranslationEnabled_2) this.classList.add("active");else this.classList.remove("active");
    const bstageChatContentElement_341 = document.getElementById("bstage-chat-content");
    if (bstageChatContentElement_341) {
      if (isTranslationEnabled_2) bstageChatContentElement_341.classList.add("show-trans");else bstageChatContentElement_341.classList.remove("show-trans");
    }
    syncFanChatTranslationState();
    const bstageTransSwitchElement_342 = document.getElementById("bstage-trans-switch");
    if (bstageTransSwitchElement_342) bstageTransSwitchElement_342.classList.toggle("active", isTranslationEnabled_2);
    saveBstageData();
    window.showToast("实时翻译已" + (isTranslationEnabled_2 ? "开启" : "关闭"));
  });
  document.getElementById("bstage-other-fans-switch").addEventListener("click", function () {
    if (!currentChatMember) return;
    currentChatMember.otherFansEnabled = !currentChatMember.otherFansEnabled;
    this.classList.toggle("active", !!currentChatMember.otherFansEnabled);
    saveBstageData();
    window.showToast("查看其他人消息已" + (currentChatMember.otherFansEnabled ? "开启" : "关闭"));
  });
  [searchGenerateModal, generateTypeSheet, createTeamSheet, addCharSheet, pullFriendSheet, subModal, popSubModal, userProfileModal, ordersModal, editProfileModal, editTeamSheet, chatDetailSheet, fanChatDetailSheet, lockerModal, videoDetailModal, editVideoSheet, shopDetailModal].forEach(value_343 => {
    value_343.addEventListener("click", event_344 => {
      event_344.target === value_343 && window.closeView(value_343);
    });
  });
  document.getElementById("bstage-setting-nickname").addEventListener("click", () => {
    if (!currentChatMember) return;
    const newName = prompt("请输入新的备注名:", currentChatMember.name);
    if (newName && newName.trim() !== "") {
      currentChatMember.name = newName.trim();
      document.getElementById("bstage-detail-name").textContent = currentChatMember.name;
      document.getElementById("bstage-chat-name").textContent = currentChatMember.name;
      window.showToast("备注已修改");
      if (currentTeam) renderTeamPop(currentTeam);
    }
  });
  document.getElementById("bstage-setting-bg").addEventListener("click", () => {
    document.getElementById("bstage-chat-bg-input").click();
  });
  document.getElementById("bstage-reset-bg-btn").addEventListener("click", event_345 => {
    event_345.stopPropagation();
    const bstageChatViewElement = document.getElementById("bstage-chat-view");
    bstageChatViewElement.style.backgroundImage = "none";
    currentChatMember && (currentChatMember.chatBg = null);
    window.showToast("背景已重置");
  });
  document.getElementById("bstage-chat-bg-input").addEventListener("change", event_346 => {
    const value_347 = event_346.target.files[0];
    if (value_347) {
      const value_348 = new FileReader();
      value_348.onload = event_349 => {
        const chatBg_2 = event_349.target.result,
          bstageChatViewElement_351 = document.getElementById("bstage-chat-view");
        bstageChatViewElement_351.style.backgroundImage = "url('" + chatBg_2 + "')";
        bstageChatViewElement_351.style.backgroundSize = "cover";
        bstageChatViewElement_351.style.backgroundPosition = "center";
        currentChatMember && (currentChatMember.chatBg = chatBg_2);
        window.showToast("背景已更换");
        window.closeView(chatDetailSheet);
      };
      value_348.readAsDataURL(value_347);
    }
  });
  document.getElementById("bstage-fan-setting-bg").addEventListener("click", () => {
    document.getElementById("bstage-fan-chat-bg-input").click();
  });
  document.getElementById("bstage-fan-reset-bg-btn").addEventListener("click", e_10 => {
    e_10.stopPropagation();
    bstageFanChatSettings_2.chatBg = null;
    applyFanChatSettings();
    saveBstageData();
    window.showToast("背景已重置");
  });
  document.getElementById("bstage-fan-chat-bg-input").addEventListener("change", e_11 => {
    const file = e_11.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = readerEvent => {
      bstageFanChatSettings_2.chatBg = readerEvent.target.result;
      applyFanChatSettings();
      saveBstageData();
      window.showToast("背景已更换");
      window.closeView(fanChatDetailSheet);
    };
    reader.readAsDataURL(file);
  });
  document.getElementById("bstage-fan-chat-clear-btn").addEventListener("click", () => {
    if (!confirm("确定要清空粉丝聊天室记录吗？此操作不可恢复。")) return;
    bstageFanChatHistory_2 = [];
    renderFanChatHistory();
    updateFanSubscriberLabels();
    saveBstageData();
    window.showToast("粉丝聊天室已清空");
    window.closeView(fanChatDetailSheet);
  });
  document.getElementById("bstage-locker-see-all-btn").addEventListener("click", () => {
    renderLockerGrid();
    window.openView(lockerModal);
  });
  function renderLockerGrid() {
    const grid = document.getElementById("bstage-locker-grid");
    grid.innerHTML = "";
    chatPhotos_2.forEach(value_354 => {
      const item_5 = document.createElement("div");
      item_5.className = "bstage-locker-item";
      item_5.innerHTML = "<img src=\"" + value_354 + "\">";
      item_5.title = "查看图片详情";
      item_5.addEventListener("click", () => {
        openBstageImagePreview(value_354, "置物柜照片");
      });
      grid.appendChild(item_5);
    });
    const addBtn = document.createElement("div");
    addBtn.className = "bstage-locker-item add-btn";
    addBtn.innerHTML = "\n            <i class=\"fas fa-plus\"></i>\n            <input type=\"file\" accept=\"image/*\" style=\"display:none;\">\n        ";
    addBtn.addEventListener("click", () => {
      addBtn.querySelector("input").click();
    });
    addBtn.querySelector("input").addEventListener("change", e_12 => {
      const file_2 = e_12.target.files[0];
      if (file_2) {
        const reader_2 = new FileReader();
        reader_2.onload = e_13 => {
          chatPhotos_2.push(e_13.target.result);
          renderLockerGrid();
          renderLockerPreview();
        };
        reader_2.readAsDataURL(file_2);
      }
    });
    grid.appendChild(addBtn);
  }
  function renderLockerPreview() {
    const container_3 = document.getElementById("bstage-locker-preview-list");
    container_3.innerHTML = "";
    chatPhotos_2.slice(0, 4).forEach(value_360 => {
      const item_6 = document.createElement("div");
      item_6.style.cssText = "width: 70px; height: 70px; border-radius: 8px; flex-shrink: 0; overflow: hidden; position: relative; cursor: pointer;";
      item_6.innerHTML = "<img src=\"" + value_360 + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">";
      item_6.title = "查看图片详情";
      item_6.addEventListener("click", () => {
        openBstageImagePreview(value_360, "置物柜照片");
      });
      container_3.appendChild(item_6);
    });
    chatPhotos_2.length === 0 && (container_3.innerHTML = "<div style=\"color: #888; font-size: 13px; padding: 10px 0;\">暂无照片</div>");
  }
  const createBtn = document.getElementById("bstage-create-team-btn");
  createBtn.addEventListener("click", () => {
    isEditingTeam = false;
    document.getElementById("bstage-team-name-input").value = "";
    const descInput = document.getElementById("bstage-team-desc-input");
    if (descInput) descInput.value = "";
    document.getElementById("bstage-team-avatar-preview").src = "";
    document.getElementById("bstage-team-avatar-preview").style.display = "none";
    document.getElementById("bstage-team-bg-preview").src = "";
    document.getElementById("bstage-team-bg-preview").style.display = "none";
    tempMembers = [];
    renderTempMembers();
    window.openView(createTeamSheet);
  });
  function clampSearchMemberCount(value_6) {
    const parsed = parseInt(value_6, 10);
    if (!Number.isFinite(parsed) || parsed < 1) return 1;
    if (parsed > 12) return 12;
    return parsed;
  }
  function handleAction_67(readOnly_2) {
    const confirmBtn_2 = document.getElementById("bstage-search-confirm-btn"),
      loading = document.getElementById("bstage-search-loading"),
      bstageSearchQueryInputElement = document.getElementById("bstage-search-query-input"),
      bstageSearchMemberCountElement = document.getElementById("bstage-search-member-count");
    confirmBtn_2 && (confirmBtn_2.classList.toggle("is-loading", readOnly_2), confirmBtn_2.textContent = readOnly_2 ? "生成中..." : "生成团队");
    if (loading) loading.style.display = readOnly_2 ? "flex" : "none";
    if (bstageSearchQueryInputElement) bstageSearchQueryInputElement.readOnly = readOnly_2;
    if (bstageSearchMemberCountElement) bstageSearchMemberCountElement.readOnly = readOnly_2;
  }
  function handleClick_2() {
    const bstageSearchQueryInputElement_364 = document.getElementById("bstage-search-query-input"),
      countInput = document.getElementById("bstage-search-member-count");
    if (bstageSearchQueryInputElement_364) bstageSearchQueryInputElement_364.value = "";
    if (countInput) countInput.value = "1";
    handleAction_67(false);
    window.openView(searchGenerateModal);
    setTimeout(() => {
      if (bstageSearchQueryInputElement_364) bstageSearchQueryInputElement_364.focus({
        preventScroll: true
      });
    }, 80);
  }
  async function generateTeamFromSearch(query, value_367) {
    const searchQuery = String(query || "").trim(),
      value_369 = !searchQuery,
      value_370 = value_369 ? "用户没有填写搜索内容。请随机生成一个虚构的 b.stage 团队或明星企划，可以自由选择风格、国家地区、成员定位和团队概念。" : "用户填写的搜索内容是「" + searchQuery + "」。必须围绕这个内容生成，团队名、团队信息、成员名字、成员人设都要明显贴合该内容，禁止忽略搜索内容或生成无关的随机团队。",
      prompt_2 = "\n请生成一个适合 b.stage 的虚构团队或明星企划。\n\n" + value_370 + "\n团队人数：" + value_367 + "\n\n要求：\n1. 只返回严格 JSON 对象，不要 markdown，不要解释。\n2. members 数组长度必须严格等于 " + value_367 + "。\n3. name 是团队名或艺名，desc 是团队/明星信息。\n4. 每个成员必须包含 name 和 role，role 是可供 AI 扮演使用的人设。\n5. " + (value_369 ? "因为用户留空，本次可以随机发挥，但仍要保持团队设定完整、统一。" : "因为用户填写了搜索内容，本次不允许随机偏题，所有核心设定必须服务于该搜索内容。") + "\n\n格式：\n{\n  \"name\": \"团队名\",\n  \"desc\": \"团队信息\",\n  \"members\": [\n    { \"name\": \"成员名\", \"role\": \"成员人设\" }\n  ]\n}\n",
      generated = await callBstageJsonApi(prompt_2, "You generate strict JSON for fictional idol/team profiles.", 0.8);
    if (!generated || typeof generated !== "object" || Array.isArray(generated)) throw new Error("invalid_team_payload");
    const name_4 = stripGeneratedText(generated.name),
      desc_2 = stripGeneratedText(generated.desc || generated.info || generated.description),
      items_375 = Array.isArray(generated.members) ? generated.members : [];
    if (!name_4 || !desc_2 || items_375.length !== value_367) throw new Error("invalid_team_payload");
    const members_3 = items_375.map((member_7, index_2) => {
        const name_5 = stripGeneratedText(member_7 && member_7.name, "成员" + (index_2 + 1)),
          role_2 = stripGeneratedText(member_7 && (member_7.role || member_7.persona || member_7.desc));
        if (!name_5 || !role_2) throw new Error("invalid_member_payload");
        const seed_4 = handleAction_41("bstage-member-" + name_4 + "-" + name_5 + "-" + index_2);
        return {
          id: Date.now() + index_2 + Math.random(),
          name: name_5,
          role: role_2,
          avatar: null,
          avatarEmoji: getStableEmojiAvatar(seed_4),
          isSubscribed: false,
          subStartDate: null
        };
      }),
      handleAction_41_377 = handleAction_41("bstage-team-" + name_4);
    return {
      id: Date.now(),
      name: name_4,
      desc: desc_2,
      avatar: null,
      avatarEmoji: getStableEmojiAvatar(handleAction_41_377 + "-avatar"),
      bg: handleAction_46(handleAction_41_377 + "-bg"),
      members: members_3,
      isSubscribed: false
    };
  }
  async function confirmSearchGenerate() {
    const bstageSearchConfirmBtnElement_383 = document.getElementById("bstage-search-confirm-btn");
    if (bstageSearchConfirmBtnElement_383 && bstageSearchConfirmBtnElement_383.classList.contains("is-loading")) return;
    const queryInput = document.getElementById("bstage-search-query-input"),
      countInput_2 = document.getElementById("bstage-search-member-count"),
      query_2 = queryInput ? queryInput.value.trim() : "",
      memberCount = clampSearchMemberCount(countInput_2 ? countInput_2.value : 1);
    if (countInput_2) countInput_2.value = String(memberCount);
    handleAction_67(true);
    try {
      const generatedTeam = await generateTeamFromSearch(query_2, memberCount);
      teams_2.push(generatedTeam);
      saveBstageData();
      handleAction_73();
      window.closeView(searchGenerateModal);
      handleAction_74(generatedTeam);
      window.showToast("团队已生成");
    } catch (error_3) {
      console.error("Bstage search generate failed:", error_3);
      if (window.u2Api?.isRequestError?.(error_3) && window.u2Api.reportError(error_3, {
        operation: "团队生成"
      })) {} else {
        if (error_3 && error_3.message === "missing_api_config") window.showToast("请先在系统设置中配置 API");else error_3 && /member|payload/.test(error_3.message || "") ? window.showToast("生成结果格式或人数不匹配") : window.showToast("生成团队失败");
      }
    } finally {
      handleAction_67(false);
    }
  }
  document.getElementById("bstage-search-generate-btn").addEventListener("click", handleClick_2);
  bindBstageFocusPreservingAction(document.getElementById("bstage-search-confirm-btn"), confirmSearchGenerate);
  ["bstage-search-query-input", "bstage-search-member-count"].forEach(value_390 => {
    const elementById_391 = document.getElementById(value_390);
    if (!elementById_391) return;
    elementById_391.addEventListener("keydown", event_392 => {
      event_392.key === "Enter" && !event_392.isComposing && event_392.keyCode !== 229 && (event_392.preventDefault(), confirmSearchGenerate());
    });
  });
  function setupFileUpload(value_393, value_394, value_395) {
    const trigger = document.getElementById(value_393),
      inputElement = trigger.querySelector("input"),
      elementById_397 = document.getElementById(value_395);
    if (!trigger || !inputElement) return;
    trigger.addEventListener("click", () => inputElement.click());
    inputElement.addEventListener("change", event_398 => {
      const value_399 = event_398.target.files[0];
      if (value_399) {
        const value_400 = new FileReader();
        value_400.onload = event_401 => {
          elementById_397 && (elementById_397.src = event_401.target.result, elementById_397.style.display = "block");
        };
        value_400.readAsDataURL(value_399);
      }
    });
  }
  setupFileUpload("bstage-team-avatar-upload", "input", "bstage-team-avatar-preview");
  setupFileUpload("bstage-team-bg-upload", "input", "bstage-team-bg-preview");
  setupFileUpload("bstage-char-avatar-upload", "input", "bstage-char-avatar-preview");
  setupFileUpload("bstage-edit-team-avatar-upload", "input", "bstage-edit-team-avatar-preview");
  setupFileUpload("bstage-edit-team-bg-upload", "input", "bstage-edit-team-bg-preview");
  setupFileUpload("bstage-edit-video-cover-upload", "input", "bstage-edit-video-cover-preview");
  const handleClick_3 = async () => {
    const listContainer = document.getElementById("bstage-friend-list");
    listContainer.innerHTML = "<div style=\"text-align:center; padding:20px; color:#aaa;\">加载中...</div>";
    window.openView(pullFriendSheet);
    try {
      let friends_2 = [];
      if (window.imStorage && window.imStorage.loadFriends) friends_2 = await window.imStorage.loadFriends();else {
        if (window.getAppState) {
          const data_3 = window.getAppState("imessage");
          if (data_3 && data_3.friends) friends_2 = data_3.friends;
        }
      }
      const validFriends = friends_2.filter(f => {
        if (!f) return false;
        return f.type === "char";
      });
      if (validFriends.length === 0) {
        listContainer.innerHTML = "<div style=\"text-align:center; padding:20px; color:#aaa;\">暂无可拉取的好友</div>";
        return;
      }
      listContainer.innerHTML = "";
      validFriends.forEach(f_2 => {
        const item_7 = document.createElement("div");
        item_7.className = "bstage-friend-item";
        item_7.style.cssText = "display: flex; align-items: center; gap: 12px; padding: 12px; background-color: #2c2c2e; border-radius: 12px; cursor: pointer;";
        const src_3 = f_2.avatar || (f_2.avatarDataUrl ? f_2.avatarDataUrl : ""),
          value_7 = f_2.realName || f_2.originalName || f_2.name || "",
          value_408 = src_3 ? "<img src=\"" + src_3 + "\" style=\"width: 40px; height: 40px; border-radius: 50%; object-fit: cover;\">" : "<div style=\"width: 40px; height: 40px; border-radius: 50%; background-color: #444; display: flex; justify-content: center; align-items: center; color: #fff;\">" + (value_7 ? value_7[0] : "U") + "</div>",
          value_8 = f_2.persona || f_2.signature || f_2.desc || f_2.role || "";
        item_7.innerHTML = "\n                    " + value_408 + "\n                    <div style=\"flex: 1; overflow: hidden;\">\n                        <div style=\"font-size: 16px; color: #fff; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">" + value_7 + "</div>\n                        <div style=\"font-size: 13px; color: #aaa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">" + value_8 + "</div>\n                    </div>\n                    <i class=\"fas fa-plus-circle\" style=\"color: #007aff; font-size: 20px;\"></i>\n                ";
        item_7.addEventListener("click", () => {
          message_14 = null;
          sourceFriendId_2 = String(f_2.id);
          document.getElementById("bstage-char-name-input").value = value_7;
          document.getElementById("bstage-char-role-input").value = value_8;
          const avatarDisplay = document.getElementById("bstage-char-avatar-preview");
          src_3 ? (avatarDisplay.src = src_3, avatarDisplay.style.display = "block") : (avatarDisplay.src = "", avatarDisplay.style.display = "none");
          const title_4 = document.querySelector("#bstage-add-char-sheet .sheet-title");
          if (title_4) title_4.textContent = "确认成员信息";
          const bstageConfirmAddCharBtnElement = document.getElementById("bstage-confirm-add-char-btn");
          if (bstageConfirmAddCharBtnElement) bstageConfirmAddCharBtnElement.textContent = "添加";
          window.closeView(pullFriendSheet);
          window.openView(addCharSheet);
        });
        listContainer.appendChild(item_7);
      });
    } catch (e_14) {
      console.error("Failed to pull friends", e_14);
      listContainer.innerHTML = "<div style=\"text-align:center; padding:20px; color:#ff3b30;\">拉取好友失败</div>";
    }
  };
  document.getElementById("bstage-pull-friend-btn").addEventListener("click", handleClick_3);
  document.getElementById("bstage-add-char-btn").addEventListener("click", () => {
    message_14 = null;
    sourceFriendId_2 = "";
    document.getElementById("bstage-char-name-input").value = "";
    document.getElementById("bstage-char-role-input").value = "";
    document.getElementById("bstage-char-avatar-preview").style.display = "none";
    const bstageAddCharSheetSheetTitleElement_411 = document.querySelector("#bstage-add-char-sheet .sheet-title");
    if (bstageAddCharSheetSheetTitleElement_411) bstageAddCharSheetSheetTitleElement_411.textContent = "添加成员";
    const bstageConfirmAddCharBtnElement_412 = document.getElementById("bstage-confirm-add-char-btn");
    if (bstageConfirmAddCharBtnElement_412) bstageConfirmAddCharBtnElement_412.textContent = "添加";
    window.openView(addCharSheet);
  });
  document.getElementById("bstage-confirm-add-char-btn").addEventListener("click", () => {
    const name_6 = document.getElementById("bstage-char-name-input").value,
      role_3 = document.getElementById("bstage-char-role-input").value,
      avatar_4 = document.getElementById("bstage-char-avatar-preview").src,
      hasAvatar = document.getElementById("bstage-char-avatar-preview").style.display !== "none";
    if (name_6) {
      if (message_14) {
        message_14.name = name_6;
        message_14.role = role_3;
        message_14.avatar = hasAvatar ? avatar_4 : null;
        message_14.avatarEmoji = hasAvatar ? null : message_14.avatarEmoji || getStableEmojiAvatar("member-" + (message_14.id || name_6));
        isEditingTeam && currentTeam ? (renderEditTeamMembers(), saveBstageData(), document.querySelector(".bstage-nav-item[data-tab=\"pop\"]").classList.contains("active") && renderTeamPop(currentTeam)) : renderTempMembers();
        window.showToast("已更新成员: " + name_6);
        message_14 = null;
      } else {
        const newChar = {
          id: Date.now(),
          sourceFriendId: sourceFriendId_2,
          name: name_6,
          role: role_3,
          avatar: hasAvatar ? avatar_4 : null,
          avatarEmoji: hasAvatar ? null : getStableEmojiAvatar("member-" + name_6 + "-" + Date.now()),
          isSubscribed: false,
          subStartDate: null
        };
        sourceFriendId_2 = "";
        isEditingTeam && currentTeam ? (currentTeam.members.push(newChar), renderEditTeamMembers(), saveBstageData(), document.querySelector(".bstage-nav-item[data-tab=\"pop\"]").classList.contains("active") && renderTeamPop(currentTeam), window.showToast("已添加成员: " + name_6)) : (tempMembers.push(newChar), renderTempMembers());
      }
      window.closeView(addCharSheet);
    }
  });
  function renderTempMembers() {
    const container_4 = document.getElementById("bstage-chars-preview-list");
    container_4.innerHTML = "";
    tempMembers.forEach(message_418 => {
      const element_419 = document.createElement("div");
      element_419.className = "bstage-char-preview-item";
      element_419.style.cursor = "pointer";
      element_419.innerHTML = "\n                " + renderBstageAvatar(message_418, message_418.name, "bstage-char-preview-avatar") + "\n                <div class=\"bstage-char-preview-name\">" + escapeHtml(message_418.name) + "</div>\n            ";
      element_419.addEventListener("click", () => {
        message_14 = message_418;
        document.getElementById("bstage-char-name-input").value = message_418.name;
        document.getElementById("bstage-char-role-input").value = message_418.role || "";
        const bstageCharAvatarPreviewElement_420 = document.getElementById("bstage-char-avatar-preview");
        message_418.avatar ? (bstageCharAvatarPreviewElement_420.src = message_418.avatar, bstageCharAvatarPreviewElement_420.style.display = "block") : (bstageCharAvatarPreviewElement_420.src = "", bstageCharAvatarPreviewElement_420.style.display = "none");
        const bstageAddCharSheetSheetTitleElement_421 = document.querySelector("#bstage-add-char-sheet .sheet-title");
        if (bstageAddCharSheetSheetTitleElement_421) bstageAddCharSheetSheetTitleElement_421.textContent = "编辑成员";
        const bstageConfirmAddCharBtnElement_422 = document.getElementById("bstage-confirm-add-char-btn");
        if (bstageConfirmAddCharBtnElement_422) bstageConfirmAddCharBtnElement_422.textContent = "保存";
        window.openView(addCharSheet);
      });
      container_4.appendChild(element_419);
    });
  }
  document.getElementById("bstage-confirm-create-btn").addEventListener("click", () => {
    const name_7 = document.getElementById("bstage-team-name-input").value,
      bstageTeamDescInputElement = document.getElementById("bstage-team-desc-input"),
      desc_3 = bstageTeamDescInputElement ? bstageTeamDescInputElement.value : "",
      avatar_5 = document.getElementById("bstage-team-avatar-preview").src,
      hasAvatar_2 = document.getElementById("bstage-team-avatar-preview").style.display !== "none",
      bg_2 = document.getElementById("bstage-team-bg-preview").src,
      hasBg = document.getElementById("bstage-team-bg-preview").style.display !== "none";
    if (!name_7) {
      window.showToast("请输入团队名称");
      return;
    }
    const options_429 = {
      id: Date.now(),
      name: name_7,
      desc: desc_3,
      avatar: hasAvatar_2 ? avatar_5 : null,
      avatarEmoji: hasAvatar_2 ? null : getStableEmojiAvatar("team-" + name_7 + "-" + Date.now()),
      bg: hasBg ? bg_2 : null,
      members: [...tempMembers],
      isSubscribed: false
    };
    teams_2.push(options_429);
    saveBstageData();
    handleAction_73();
    window.closeView(createTeamSheet);
    handleAction_74(options_429);
  });
  function handleAction_73() {
    const container_5 = document.getElementById("bstage-following-bar"),
      createBtn_2 = container_5.firstElementChild;
    container_5.innerHTML = "";
    container_5.appendChild(createBtn_2);
    [getBstageUserTeam(), ...teams_2].forEach(team_8 => {
      const item_8 = document.createElement("div");
      item_8.className = "bstage-team-item";
      if (currentTeam && currentTeam.id === team_8.id) item_8.classList.add("active");
      item_8.innerHTML = "\n                <div class=\"bstage-team-avatar\">\n                    " + renderBstageAvatarContent(team_8, team_8.name) + "\n                </div>\n                <div class=\"bstage-team-name\">" + escapeHtml(team_8.name) + "</div>\n            ";
      item_8.addEventListener("click", () => {
        currentTeam && currentTeam.id === team_8.id ? openEditTeamModal(team_8) : handleAction_74(team_8);
      });
      container_5.appendChild(item_8);
    });
  }
  function openEditTeamModal(team_9) {
    if (isUserTeam_2(team_9)) team_9 = getBstageUserTeam();
    currentTeam = team_9;
    isEditingTeam = true;
    editTeamSheet.classList.toggle("bstage-user-team-editing", isUserTeam_2(team_9));
    const deleteBtn = document.getElementById("bstage-delete-team-btn");
    if (deleteBtn) deleteBtn.style.display = isUserTeam_2(team_9) ? "none" : "";
    document.getElementById("bstage-edit-team-name-input").value = team_9.name;
    const avatarPreview = document.getElementById("bstage-edit-team-avatar-preview");
    if (team_9.avatar) {
      avatarPreview.src = team_9.avatar;
      avatarPreview.style.display = "block";
      if (avatarPreview.previousElementSibling) avatarPreview.previousElementSibling.style.opacity = "0";
    } else {
      avatarPreview.src = "";
      avatarPreview.style.display = "none";
      if (avatarPreview.previousElementSibling) avatarPreview.previousElementSibling.style.opacity = "1";
    }
    const bgPreview = document.getElementById("bstage-edit-team-bg-preview");
    if (team_9.bg) {
      bgPreview.src = team_9.bg;
      bgPreview.style.display = "block";
      if (bgPreview.previousElementSibling) bgPreview.previousElementSibling.style.opacity = "0";
    } else {
      bgPreview.src = "";
      bgPreview.style.display = "none";
      if (bgPreview.previousElementSibling) bgPreview.previousElementSibling.style.opacity = "1";
    }
    renderEditTeamMembers();
    window.openView(editTeamSheet);
  }
  function renderEditTeamMembers() {
    const container_6 = document.getElementById("bstage-edit-team-members-list");
    if (!container_6 || !currentTeam) return;
    container_6.innerHTML = "";
    currentTeam.members.forEach(m_2 => {
      const element_435 = document.createElement("div");
      element_435.className = "bstage-char-preview-item";
      element_435.innerHTML = "\n                " + renderBstageAvatar(m_2, m_2.name, "bstage-char-preview-avatar") + "\n                <div class=\"bstage-char-preview-name\">" + escapeHtml(m_2.name) + "</div>\n            ";
      element_435.addEventListener("click", () => {
        if (isUserTeam_2(currentTeam) && m_2.isUserMember) return;
        message_14 = m_2;
        document.getElementById("bstage-char-name-input").value = m_2.name;
        document.getElementById("bstage-char-role-input").value = m_2.role || "";
        const bstageCharAvatarPreviewElement_436 = document.getElementById("bstage-char-avatar-preview");
        m_2.avatar ? (bstageCharAvatarPreviewElement_436.src = m_2.avatar, bstageCharAvatarPreviewElement_436.style.display = "block") : (bstageCharAvatarPreviewElement_436.src = "", bstageCharAvatarPreviewElement_436.style.display = "none");
        const bstageAddCharSheetSheetTitleElement_437 = document.querySelector("#bstage-add-char-sheet .sheet-title");
        if (bstageAddCharSheetSheetTitleElement_437) bstageAddCharSheetSheetTitleElement_437.textContent = "编辑成员";
        const bstageConfirmAddCharBtnElement_438 = document.getElementById("bstage-confirm-add-char-btn");
        if (bstageConfirmAddCharBtnElement_438) bstageConfirmAddCharBtnElement_438.textContent = "保存";
        window.openView(addCharSheet);
      });
      container_6.appendChild(element_435);
    });
  }
  document.getElementById("bstage-edit-team-sheet").addEventListener("click", event_439 => {
    if (event_439.target.id === "bstage-edit-team-add-member-btn") {
      message_14 = null;
      sourceFriendId_2 = "";
      document.getElementById("bstage-char-name-input").value = "";
      document.getElementById("bstage-char-role-input").value = "";
      document.getElementById("bstage-char-avatar-preview").style.display = "none";
      const bstageAddCharSheetSheetTitleElement_440 = document.querySelector("#bstage-add-char-sheet .sheet-title");
      if (bstageAddCharSheetSheetTitleElement_440) bstageAddCharSheetSheetTitleElement_440.textContent = "添加成员";
      const bstageConfirmAddCharBtnElement_441 = document.getElementById("bstage-confirm-add-char-btn");
      if (bstageConfirmAddCharBtnElement_441) bstageConfirmAddCharBtnElement_441.textContent = "添加";
      window.openView(addCharSheet);
    } else event_439.target.id === "bstage-edit-team-pull-friend-btn" && handleClick_3();
  });
  document.getElementById("bstage-confirm-edit-team-btn").addEventListener("click", () => {
    if (!currentTeam) return;
    const name_8 = document.getElementById("bstage-edit-team-name-input").value,
      avatar_6 = document.getElementById("bstage-edit-team-avatar-preview").src,
      hasAvatar_3 = document.getElementById("bstage-edit-team-avatar-preview").style.display !== "none",
      bg_3 = document.getElementById("bstage-edit-team-bg-preview").src,
      hasBg_2 = document.getElementById("bstage-edit-team-bg-preview").style.display !== "none";
    name_8 && (isUserTeam_2(currentTeam) ? (bstageUserTeamState_2.customName = name_8, bstageUserTeamState_2.customAvatar = hasAvatar_3 ? avatar_6 : null, bstageUserTeamState_2.customBg = hasBg_2 ? bg_3 : null, bstageUserTeamState_2.avatarEmoji = hasAvatar_3 ? null : bstageUserTeamState_2.avatarEmoji || getStableEmojiAvatar("team-" + (currentTeam.id || name_8)), currentTeam = getBstageUserTeam()) : (currentTeam.name = name_8, currentTeam.avatar = hasAvatar_3 ? avatar_6 : null, currentTeam.avatarEmoji = hasAvatar_3 ? null : currentTeam.avatarEmoji || getStableEmojiAvatar("team-" + (currentTeam.id || name_8)), currentTeam.bg = hasBg_2 ? bg_3 : null), saveBstageData(), handleAction_73(), document.querySelector(".bstage-nav-item[data-tab=\"home\"]").classList.contains("active") && handleAction_85(currentTeam), isEditingTeam = false, window.closeView(editTeamSheet), window.showToast("团队信息已更新"));
  });
  document.getElementById("bstage-delete-team-btn").addEventListener("click", () => {
    if (!currentTeam) return;
    if (isUserTeam_2(currentTeam)) {
      window.showToast("User 团队为固定团队，不能删除");
      return;
    }
    confirm("确定要删除这个团队吗？") && (teams_2 = teams_2.filter(t_2 => t_2.id !== currentTeam.id), currentTeam = null, saveBstageData(), handleAction_73(), document.getElementById("bstage-bottom-nav").style.display = "none", document.getElementById("bstage-content-area").innerHTML = "\n                <div style=\"height: 100%; display: flex; justify-content: center; align-items: center; color: #333; font-size: 14px;\">\n                    请选择或创建一个团队\n                </div>\n            ", isEditingTeam = false, window.closeView(editTeamSheet), window.showToast("团队已删除"));
  });
  editTeamSheet.querySelector(".sheet-handle").addEventListener("click", () => {
    isEditingTeam = false;
  });
  function handleAction_74(value_448) {
    if (value_78 !== null && value_78 !== String(value_448.id)) value_75.clear();
    currentTeam = value_448;
    handleAction_73();
    document.getElementById("bstage-bottom-nav").style.display = "block";
    handleAction_84("home", {
      immediate: true,
      force: true
    });
  }
  const contentArea = document.getElementById("bstage-content-area"),
    value_75 = new Map();
  let count_76 = 0,
    value_77 = null,
    value_78 = null,
    value_79 = -1,
    value_80 = null,
    count_81 = 0;
  function handleAction_82() {
    count_76 += 1;
    value_75.clear();
  }
  function handleAction_83(tab_3, currentTeam_2) {
    if ((tab_3 === "content" || tab_3 === "shop") && !currentTeam_2.isSubscribed && !isUserTeam_2(currentTeam_2)) handleAction_98(tab_3);else {
      if (tab_3 === "home") handleAction_85(currentTeam_2);else {
        if (tab_3 === "pop") renderTeamPop(currentTeam_2);else {
          if (tab_3 === "content") handleAction_89(currentTeam_2);else {
            if (tab_3 === "shop") renderShop(currentTeam_2);
          }
        }
      }
    }
  }
  function handleAction_84(value_451, value_452 = {}) {
    if (!currentTeam || !["home", "content", "shop", "pop"].includes(value_451)) return;
    const member_8 = currentTeam,
      canonical_2 = String(member_8.id);
    if (!value_452.force && value_80 === value_451 && value_78 === canonical_2) return;
    value_80 = value_451;
    const value_455 = ++count_81,
      querySelector_456 = document.querySelector(".bstage-nav-item[data-tab=\"" + value_451 + "\"]");
    document.querySelectorAll(".bstage-nav-item").forEach(element_458 => element_458.classList.toggle("active", element_458 === querySelector_456));
    handleAction_97(querySelector_456);
    const homeTab = () => {
      if (value_455 !== count_81 || currentTeam !== member_8) return;
      if (value_77 === value_451 && value_78 === canonical_2 && value_79 === count_76) return;
      value_32 && (clearInterval(value_32), value_32 = null);
      if (value_77 && value_78 === canonical_2 && value_79 === count_76) {
        const documentFragment = document.createDocumentFragment();
        while (contentArea.firstChild) documentFragment.appendChild(contentArea.firstChild);
        value_75.set(canonical_2 + ":" + value_77, documentFragment);
      }
      const result_459 = value_75.get(canonical_2 + ":" + value_451);
      if (result_459) {
        contentArea.replaceChildren(result_459);
        value_75["delete"](canonical_2 + ":" + value_451);
        if (value_451 === "content") handleAction_90();
      } else handleAction_83(value_451, member_8);
      value_77 = value_451;
      value_78 = canonical_2;
      value_79 = count_76;
    };
    value_452.immediate ? homeTab() : requestAnimationFrame(() => requestAnimationFrame(homeTab));
  }
  function handleAction_85(value_460) {
    const value_461 = value_460.bg ? "background-image: url('" + value_460.bg + "')" : "background-color: #111",
      isUserTeam_44_462 = isUserTeam_2(value_460);
    contentArea.innerHTML = "\n            <div class=\"bstage-team-home\" style=\"" + value_461 + "\">\n                <div class=\"bstage-home-content\">\n                    <div class=\"bstage-home-title\">" + value_460.name + "</div>\n                    \n                    <div class=\"bstage-social-icons\">\n                        <i class=\"fab fa-instagram bstage-social-icon\"></i>\n                        <i class=\"fab fa-twitter bstage-social-icon\"></i> <!-- X icon usually fontawesome twitter -->\n                        <i class=\"fab fa-youtube bstage-social-icon\"></i>\n                        <i class=\"fab fa-tiktok bstage-social-icon\"></i>\n                        <i class=\"fab fa-facebook bstage-social-icon\"></i>\n                    </div>\n\n                    <div class=\"bstage-sub-bubble\" id=\"bstage-home-sub-btn\">\n                        <span>" + (isUserTeam_44_462 ? "User Space" : value_460.isSubscribed ? "会员已订阅" : "订阅会员") + "</span>\n                        <i class=\"fas fa-chevron-right\" style=\"font-size: 12px;\"></i>\n                    </div>\n                </div>\n            </div>\n        ";
    !isUserTeam_44_462 && document.getElementById("bstage-home-sub-btn").addEventListener("click", openSubModal);
  }
  function renderTeamPop(team_10) {
    const isFixedUserTeam = isUserTeam_2(team_10),
      popTeam = isFixedUserTeam ? getBstageUserTeam() : team_10;
    if (isFixedUserTeam) currentTeam = popTeam;
    contentArea.innerHTML = "\n            <div class=\"bstage-pop-view\">\n                <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;\">\n                    <h2 style=\"font-size:20px; font-weight:700;\">" + (isFixedUserTeam ? "User POP" : "Star") + "</h2>\n                </div>\n                <div class=\"bstage-pop-list\" id=\"bstage-pop-list-container\">\n                    <!-- Members -->\n                </div>\n            </div>\n        ";
    const container_7 = document.getElementById("bstage-pop-list-container");
    popTeam.members && popTeam.members.length > 0 ? popTeam.members.forEach(m => {
      const item_9 = document.createElement("div");
      item_9.className = "bstage-pop-item";
      const isUserSelfMember = isFixedUserTeam && m.isUserMember;
      let enabled_468 = false,
        enabled_469 = false;
      if (!isUserSelfMember && m.isSubscribed && m.subExpiryDate) {
        const now_473 = Date.now(),
          value_474 = m.subExpiryDate + 259200000;
        if (now_473 > value_474) {
          enabled_468 = true;
          m.isSubscribed = false;
          m.subStartDate = null;
          m.subExpiryDate = null;
          saveBstageData();
        } else now_473 > m.subExpiryDate && (enabled_469 = true);
      }
      let text_470 = "";
      if (isUserSelfMember) text_470 = handleAction_105();else {
        if (m.isSubscribed && m.subStartDate) {
          const value_475 = Math.floor((Date.now() - m.subStartDate) / 86400000) + 1;
          text_470 = "已一同 " + value_475 + " 天";
        }
      }
      let actionHtml = "";
      if (isUserSelfMember) actionHtml = "<div class=\"bstage-pop-status\">粉丝聊天室 <i class=\"fas fa-chevron-right\"></i></div>";else m.isSubscribed ? enabled_469 ? actionHtml = "<div class=\"bstage-pop-sub-btn renew\" style=\"background-color: #ffcc00; color: #000;\">续费(缓冲)</div>" : actionHtml = "<div class=\"bstage-pop-status\">订阅中 <i class=\"fas fa-chevron-right\"></i></div>" : actionHtml = "<div class=\"bstage-pop-sub-btn\">订阅</div>";
      const roleClass = isUserSelfMember ? "bstage-pop-role bstage-fan-subscriber-label" : "bstage-pop-role";
      item_9.innerHTML = "\n                    <div class=\"bstage-pop-info\">\n                        " + renderBstageAvatar(m, m.name, "bstage-pop-avatar") + "\n                        <div class=\"bstage-pop-name-wrap\">\n                            <div class=\"bstage-pop-name\">\n                                " + escapeHtml(m.name) + " \n                                <i class=\"fas fa-check-circle bstage-verified-icon\"></i>\n                            </div>\n                            " + (text_470 ? "<div class=\"" + roleClass + "\">" + text_470 + "</div>" : "") + "\n                        </div>\n                    </div>\n                    <div class=\"bstage-pop-action\">\n                        " + actionHtml + "\n                    </div>\n                ";
      if (isUserSelfMember) item_9.addEventListener("click", openFanChat);else {
        if (m.isSubscribed && !enabled_469) item_9.addEventListener("click", () => openChat(m));else {
          if (m.isSubscribed && enabled_469) {
            const renewBtn = item_9.querySelector(".renew");
            renewBtn && renewBtn.addEventListener("click", event_476 => {
              event_476.stopPropagation();
              currentPopSubMember = m;
              document.getElementById("pop-sub-char-name").textContent = "续订 " + m.name;
              window.openView(popSubModal);
            });
            item_9.addEventListener("click", e_15 => {
              if (e_15.target !== renewBtn) openChat(m);
            });
          } else {
            const subBtn = item_9.querySelector(".bstage-pop-sub-btn");
            subBtn && subBtn.addEventListener("click", event_478 => {
              event_478.stopPropagation();
              currentPopSubMember = m;
              document.getElementById("pop-sub-char-name").textContent = "订阅 " + m.name;
              window.openView(popSubModal);
            });
          }
        }
      }
      container_7.appendChild(item_9);
    }) : container_7.innerHTML = "<div style=\"text-align:center; color:#666; padding:20px;\">暂无成员</div>";
  }
  document.getElementById("bstage-confirm-pop-sub-btn").addEventListener("click", () => {
    if (currentPopSubMember) {
      const subStartDate_2 = Date.now(),
        subExpiryDate_2 = 2592000000;
      currentPopSubMember.isSubscribed && currentPopSubMember.subExpiryDate && subStartDate_2 > currentPopSubMember.subExpiryDate ? (currentPopSubMember.subExpiryDate += subExpiryDate_2, window.showToast("成功续订 " + currentPopSubMember.name + "！")) : (currentPopSubMember.isSubscribed = true, currentPopSubMember.subStartDate = subStartDate_2, currentPopSubMember.subExpiryDate = subStartDate_2 + subExpiryDate_2, window.showToast("成功订阅 " + currentPopSubMember.name + "！"));
      const priceEl = popSubModal.querySelector(".selected .bstage-price-amount");
      bstageOrders_2.unshift({
        id: Date.now(),
        title: "订阅 " + currentPopSubMember.name,
        price: priceEl ? priceEl.textContent : "₩4,500 / 月",
        date: new Date().toLocaleDateString(),
        type: "POP"
      });
      if (currentTeam) renderTeamPop(currentTeam);
      saveBstageData();
      window.showToast("成功订阅 " + currentPopSubMember.name + "！");
      window.closeView(popSubModal);
    }
  });
  function appendCharChatMessage(member_9, msg_8, element_483) {
    if (!member_9 || !msg_8 || !element_483) return;
    if (msg_8.type === "date") {
      const element_486 = document.createElement("div");
      element_486.className = "bstage-chat-date";
      element_486.textContent = msg_8.text;
      element_483.appendChild(element_486);
      return;
    }
    if (msg_8.type === "fan_batch") {
      handleAction_53(msg_8);
      const trigger_2 = document.createElement("button");
      trigger_2.type = "button";
      trigger_2.className = "bstage-other-fans-trigger";
      const count_2 = Array.isArray(msg_8.fanMessages) ? msg_8.fanMessages.length : 0;
      trigger_2.innerHTML = "<i class=\"fas fa-comments\"></i><span>查看其他人的消息" + (count_2 ? "（" + count_2 + "）" : "") + "</span>";
      trigger_2.addEventListener("click", () => openOtherFansModal(member_9, msg_8));
      element_483.appendChild(trigger_2);
      return;
    }
    ensureMessageId(msg_8, msg_8.isUser ? "user" : "char");
    if (msg_8.isUser) {
      const element_489 = document.createElement("div");
      element_489.className = "bstage-chat-msg outgoing";
      element_489.dataset.msgId = msg_8.id;
      element_489.innerHTML = "\n                <div class=\"bstage-msg-status\">\n                    <div class=\"bstage-msg-status-text\">" + escapeHtml(msg_8.status || "已读") + "</div>\n                    <div class=\"bstage-msg-time\">" + escapeHtml(msg_8.time || getCurrentChatTimeText(msg_8.timestamp)) + "</div>\n                </div>\n                <div class=\"bstage-chat-bubble\">\n                    " + formatReplyForPrompt_2(msg_8.replyTo) + "\n                    <div class=\"bstage-msg-text\">" + escapeHtml(msg_8.text) + "</div>\n                </div>\n            ";
      element_483.appendChild(element_489);
      return;
    }
    const element_484 = document.createElement("div");
    element_484.className = "bstage-chat-msg income";
    element_484.dataset.msgId = msg_8.id;
    let text_485 = "";
    msg_8.type === "image" ? text_485 = "\n                " + formatReplyForPrompt_2(msg_8.replyTo) + "\n                <div class=\"bstage-msg-text\" style=\"padding: 0; background: transparent;\">\n                    <img class=\"bstage-chat-image-clickable\" src=\"" + escapeHtml(msg_8.imgUrl || "assets/imessage/chat-image-placeholder-512.jpg") + "\" data-desc=\"" + escapeHtml(msg_8.imgDesc || "") + "\" loading=\"lazy\" decoding=\"async\" style=\"max-width: 250px; width: 100%; border-radius: 12px; display: block; object-fit: cover; cursor: zoom-in; border: 1px solid #333;\">\n                </div>\n            " : text_485 = "\n                " + formatReplyForPrompt_2(msg_8.replyTo) + "\n                <div class=\"bstage-msg-text\">" + escapeHtml(msg_8.text) + "</div>\n                " + (msg_8.trans && msg_8.trans.trim() !== "" ? "<div class=\"bstage-trans-text\">" + escapeHtml(msg_8.trans) + "</div>" : "") + "\n            ";
    element_484.innerHTML = "\n            " + renderBstageAvatar(member_9, member_9.name, "bstage-chat-avatar") + "\n            <div class=\"bstage-chat-bubble\" style=\"" + (msg_8.type === "image" && !msg_8.replyTo ? "background: transparent; padding: 0;" : "") + "\">" + text_485 + "</div>\n            <button class=\"bstage-msg-reply-btn\" type=\"button\" aria-label=\"回复消息\" title=\"回复消息\">\n                <i class=\"fas fa-reply\"></i>\n            </button>\n        ";
    const replyBtn = element_484.querySelector(".bstage-msg-reply-btn");
    replyBtn && replyBtn.addEventListener("click", e_16 => {
      e_16.stopPropagation();
      setPendingReply("chat", createReplyMeta(msg_8, member_9.name));
    });
    attachBstageImagePreview(element_484);
    element_483.appendChild(element_484);
  }
  function openChat(member_10) {
    if (!ensureBstageHydrated()) return;
    const canonical_3 = findCanonicalBstageMember(member_10?.id, currentTeam?.id);
    if (!canonical_3) {
      if (typeof window.showToast === "function") window.showToast("该角色已不存在，无法打开聊天");
      return;
    }
    currentTeam = canonical_3.team;
    member_10 = canonical_3.member;
    currentChatMember = member_10;
    document.getElementById("bstage-chat-name").textContent = member_10.name;
    const value_493 = Math.floor((Date.now() - member_10.subStartDate) / 86400000) + 1;
    document.getElementById("bstage-chat-days").textContent = "已一同 " + value_493 + " 天";
    const bstageChatViewElement_494 = document.getElementById("bstage-chat-view");
    member_10.chatBg ? bstageChatViewElement_494.style.backgroundImage = "url('" + member_10.chatBg + "')" : (bstageChatViewElement_494.style.backgroundImage = "none", bstageChatViewElement_494.style.backgroundColor = "#1c1c1e");
    applyDynamicStyles();
    userMsgCountSinceLastReply = 0;
    const content_4 = document.getElementById("bstage-chat-content");
    if (isTranslationEnabled_2) content_4.classList.add("show-trans");else content_4.classList.remove("show-trans");
    (!member_10.chatHistory || !Array.isArray(member_10.chatHistory)) && (member_10.chatHistory = [{
      type: "date",
      text: handleAction_40(Date.now()),
      timestamp: Date.now()
    }, {
      isUser: false,
      type: "text",
      text: "Hello! I'm " + member_10.name + ".",
      trans: "你好！我是" + member_10.name + "。",
      timestamp: Date.now()
    }, {
      isUser: false,
      type: "text",
      text: "Thanks for subscribing!",
      trans: "谢谢你的订阅！",
      timestamp: Date.now() + 100
    }], saveBstageData());
    content_4.innerHTML = "";
    member_10.chatHistory.forEach(msg_9 => appendCharChatMessage(member_10, msg_9, content_4));
    clearPendingReply("chat");
    setTimeout(() => {
      content_4.scrollTop = content_4.scrollHeight;
    }, 100);
    const inputArea = document.getElementById("bstage-chat-input"),
      sendBtn = document.getElementById("bstage-chat-send-btn"),
      apiBtn = document.getElementById("bstage-chat-api-btn");
    if (!inputArea || !sendBtn || !apiBtn) return;
    const cloneNode_496 = sendBtn.cloneNode(true);
    sendBtn.parentNode.replaceChild(cloneNode_496, sendBtn);
    const newApiBtn = apiBtn.cloneNode(true);
    apiBtn.parentNode.replaceChild(newApiBtn, apiBtn);
    const value_497 = () => {
        const now_500 = Date.now();
        return typeof window.formatChatBubbleTime === "function" ? window.formatChatBubbleTime(now_500) : (() => {
          const value_501 = new Date();
          return value_501.getHours() + ":" + value_501.getMinutes().toString().padStart(2, "0");
        })();
      },
      sendMsg = () => {
        if (!ensureBstageHydrated()) return;
        const canonical_4 = findCanonicalBstageMember(member_10?.id, currentTeam?.id);
        if (!canonical_4) {
          if (typeof window.showToast === "function") window.showToast("该角色已不存在，无法发送消息");
          return;
        }
        currentTeam = canonical_4.team;
        member_10 = canonical_4.member;
        currentChatMember = member_10;
        const text_4 = inputArea.value.trim();
        if (!text_4) return;
        if (userMsgCountSinceLastReply >= 3) {
          const noticeDiv = document.createElement("div");
          noticeDiv.className = "bstage-system-notice";
          noticeDiv.textContent = "请等待 " + currentChatMember.name + " 的回复";
          content_4.appendChild(noticeDiv);
          inputArea.value = "";
          content_4.scrollTop = content_4.scrollHeight;
          return;
        }
        userMsgCountSinceLastReply++;
        const time_2 = value_497(),
          timestamp_2 = Date.now();
        checkAndAddDateBubble(member_10, content_4, timestamp_2);
        if (!member_10.chatHistory) member_10.chatHistory = [];
        const msg_10 = {
          id: createBstageMessageId("user"),
          isUser: true,
          type: "text",
          text: text_4,
          time: time_2,
          timestamp: timestamp_2,
          status: "未读",
          replyTo: pendingChatReply ? {
            ...pendingChatReply
          } : null
        };
        member_10.chatHistory.push(msg_10);
        appendCharChatMessage(member_10, msg_10, content_4);
        saveBstageData();
        inputArea.value = "";
        clearPendingReply("chat");
        content_4.scrollTop = content_4.scrollHeight;
      };
    bindBstageFocusPreservingAction(cloneNode_496, sendMsg);
    bindBstageFocusPreservingAction(newApiBtn, async () => {
      if (newApiBtn.classList.contains("is-loading")) return;
      setChatActionLoading(newApiBtn, true);
      const wasReadOnly = inputArea.readOnly;
      inputArea.readOnly = true;
      inputArea.setAttribute("aria-busy", "true");
      try {
        await triggerChatApi(member_10, content_4);
      } finally {
        inputArea.readOnly = wasReadOnly;
        inputArea.removeAttribute("aria-busy");
        setChatActionLoading(newApiBtn, false);
      }
    });
    if (activeCharacterChatInputCleanup) activeCharacterChatInputCleanup();
    activeCharacterChatInputCleanup = registerBstageSendInput(inputArea, sendMsg, {
      root: bstageChatView,
      scrollContainer: content_4
    });
    window.openView(document.getElementById("bstage-chat-view"));
  }
  async function triggerChatApi(member_11, contentContainer_3, isAuto = false) {
    if (!ensureBstageHydrated(!isAuto)) return false;
    const initialCanonical = findCanonicalBstageMember(member_11?.id, currentTeam?.id);
    if (!initialCanonical) {
      if (!isAuto && typeof window.showToast === "function") window.showToast("该角色已不存在，无法生成回复");
      return false;
    }
    currentTeam = initialCanonical.team;
    member_11 = initialCanonical.member;
    currentChatMember && String(currentChatMember.id) === String(member_11.id) && (currentChatMember = member_11);
    let resolvedApiConfig = window.apiConfig;
    if (member_11.autoActivityPresetId) try {
      let globalPresets_2 = window.StorageManager ? window.StorageManager.load("u2_apiPresets", []) : [];
      const preset_3 = globalPresets_2.find(p_3 => String(p_3.id) === String(member_11.autoActivityPresetId));
      preset_3 && (resolvedApiConfig = {
        provider: preset_3.provider || "openai-compatible",
        endpoint: preset_3.endpoint,
        apiKey: preset_3.apiKey,
        model: preset_3.model,
        temperature: preset_3.temp !== undefined ? preset_3.temp : 0.7,
        frequencyPenalty: preset_3.frequencyPenalty ?? 0
      });
    } catch (e_17) {
      console.warn("Failed to load preset config", e_17);
    }
    if (!resolvedApiConfig || !resolvedApiConfig.endpoint || !resolvedApiConfig.apiKey) {
      if (!isAuto) window.showToast("请先在系统设置中配置 API 或检查预设");
      return;
    }
    if (!isAuto) window.showToast(member_11.name + " 正在输入...");
    if (!member_11.chatHistory || !Array.isArray(member_11.chatHistory)) member_11.chatHistory = [];
    let fetchCount = isContextEnabled_2 ? contextMessageCount_2 : 1;
    const promptMessages = member_11.chatHistory.filter(msg_11 => msg_11 && msg_11.type !== "date").slice(-fetchCount);
    let history_2 = "聊天记录（每条都有 id，replyTo 表示正在引用/翻牌某条消息）:\n";
    promptMessages.length === 0 ? history_2 += "暂无聊天记录。\n" : promptMessages.forEach(msg_12 => {
      const speaker_3 = msg_12.isUser ? "当前粉丝" : member_11.name,
        handleAction_55_538 = formatMessageForPrompt(msg_12, speaker_3);
      if (handleAction_55_538) history_2 += handleAction_55_538 + "\n";
    });
    const validUserReplyIds = promptMessages.filter(msg_13 => msg_13 && msg_13.isUser && msg_13.id).map(msg_14 => msg_14.id);
    let text_517 = "";
    if (window.imApp?.buildImessageCharActivityForBstage && currentTeam?.id != null) try {
      text_517 = await window.imApp.buildImessageCharActivityForBstage(currentTeam.id, member_11.id);
    } catch (value_541) {
      console.warn("Bstage iMessage activity unavailable:", value_541);
    }
    const mountedProfileName = window.userState && window.userState.name ? window.userState.name : "未命名人物",
      value_519 = window.userState && window.userState.persona ? window.userState.persona : "",
      value_520 = "聊天室挂载资料 / 可讨论人物资料（注意：这不是当前发言的 User 本人）：\n名称：" + mountedProfileName + "\n人设/资料：" + (value_519 || "未填写") + "\n说明：当前粉丝可以提到、讨论或询问这个资料里的人物，但当前粉丝发来的消息在 " + member_11.name + " 眼里只是普通粉丝消息，不能把当前粉丝当成该人物本人。\n",
      value_521 = window.getGlobalWorldBookContextByPosition ? window.getGlobalWorldBookContextByPosition("system_depth") : "",
      value_522 = window.getGlobalWorldBookContextByPosition ? window.getGlobalWorldBookContextByPosition("before_role") : "",
      value_523 = window.getGlobalWorldBookContextByPosition ? window.getGlobalWorldBookContextByPosition("after_role") : "",
      value_524 = new Date(),
      items_525 = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      value_526 = value_524.getFullYear() + "年" + (value_524.getMonth() + 1) + "月" + value_524.getDate() + "日 " + items_525[value_524.getDay()] + " " + value_524.getHours() + ":" + String(value_524.getMinutes()).padStart(2, "0"),
      otherFansEnabled_2 = !!member_11.otherFansEnabled,
      value_528 = otherFansEnabled_2 ? "\n\n其他粉丝消息功能已开启：\n- 你必须先生成本轮 otherFanMessages，再生成你的回复 charMessages。\n- otherFanMessages 不少于 10 条，最多 14 条，来自不同粉丝。\n- otherFanMessages 必须是这些粉丝直接发给你（" + member_11.name + "）的消息：他们在和你说话、向你提问、对你应援、催你营业、请你翻牌或向你提到某个话题。\n- 禁止写成其他粉丝在和当前粉丝/User聊天，禁止让其他粉丝对当前粉丝/User发问、打招呼或回复。\n- 其他粉丝可以向你提到聊天室挂载资料里的可讨论人物/设定，但表达方式必须是“对你说”：例如问你怎么看、你和对方什么关系、你能不能聊聊，而不是粉丝之间互相讨论。\n- 你可以回复本轮 otherFanMessages 里的某条其他粉丝消息；如需回复，请在 charMessages 对象中填写 replyToFanId，值只能来自你本次生成的 otherFanMessages.id。\n" : "",
      value_529 = otherFansEnabled_2 ? "\n必须返回严格 JSON 对象，不要 markdown，不要解释：\n{\n  \"otherFanMessages\": [\n    {\"id\": \"fan_1\", \"name\": \"粉丝昵称\", \"text\": \"直接发给 " + member_11.name + " 的原文消息\", \"trans\": \"非中文消息的中文翻译，中文消息则为空字符串\"}\n  ],\n  \"charMessages\": [\n    {\"type\": \"text\", \"text\": \"气泡1原文\", \"trans\": \"气泡1中文翻译\", \"replyToUserId\": \"可选的当前粉丝消息 id\", \"replyToFanId\": \"可选的其他粉丝消息 id\"},\n    {\"type\": \"image\", \"description\": \"一张帅气偶像的自拍，面带微笑，后台背景，明亮的灯光\", \"replyToUserId\": \"可选\", \"replyToFanId\": \"可选\"}\n  ]\n}\n" : "\n必须返回严格 JSON 数组，不要 markdown，不要解释：\n[\n  {\"type\": \"text\", \"text\": \"气泡1原文\", \"trans\": \"气泡1中文翻译\", \"replyToUserId\": \"可选的当前粉丝消息 id\"},\n  {\"type\": \"image\", \"description\": \"一张帅气偶像的自拍，面带微笑，后台背景，明亮的灯光\", \"replyToUserId\": \"可选\"}\n]\n",
      content_5 = "\n" + (value_521 ? "System Depth Rules:\n" + value_521 + "\n\n" : "") + (value_522 ? "Before Role Rules:\n" + value_522 + "\n\n" : "") + "你现在的身份是：" + member_11.name + "\n你的人设是：" + (member_11.role || "爱豆/明星/gong") + "\n你所在的团队名称是：" + (currentTeam ? currentTeam.name : "Unknown Team") + "\n你所在的团队信息是：" + (currentTeam && currentTeam.desc ? currentTeam.desc : "无") + (value_523 ? "\n\nAfter Role Rules:\n" + value_523 : "") + "\n当前真实时间是 " + value_526 + "。\n\n请扮演该角色，与当前粉丝进行沉浸式对话。\n视角说明：当前粉丝在界面上看到的是与你的单聊；但从你的视角，你正在面对很多粉丝/订阅者的实时消息，当前粉丝只是其中一个可能被你看见的人。聊天室挂载资料不是当前粉丝本人，只是一个可被讨论的人物/设定。\n\n要求：\n1. 根据char的人设进行一次日常消息的营业，根据你的人设选择输出什么语言，例如你是韩国人，输出韩语。\n2. 一句一发，将你想说的话拆分成 3 到 6 条简短的气泡回复。\n3. 从你的视角看会有很多很多粉丝的消息，你不一定能看见当前粉丝发的消息，禁止每一条都回复当前粉丝，禁止顺着当前粉丝的话机械往下说，请按真实一对多的逻辑回复。\n4. 如果某条当前粉丝消息带有 replyTo，说明当前粉丝在引用/翻牌你的某条营业消息；你可以注意到，也可以像真实营业一样不一定回应。\n5. 所有 text 都要包含原文和中文翻译字段 trans；如果原文是中文则 trans 为空字符串；如果原文不是纯中文，trans 必须是自然中文翻译。\n6. 你可以回复某条当前粉丝消息；如需回复，请在消息对象中填写 replyToUserId，值只能从这些当前粉丝消息 id 中选择：" + (validUserReplyIds.length ? validUserReplyIds.join(", ") : "无") + "。不回复则省略或填空。\n7. 你可以发送普通文本气泡，也可以发送图片，但发图片的概率很低，禁止每一条都发图片，比如有很多粉丝希望你发图片再发。\n8. 如果是图片，请使用 \"type\": \"image\" 并在 \"description\" 字段中写明画面的详细提示词描述（必须是中文描述）。\n" + value_528 + "\n" + value_529 + "\n\n" + value_520 + "\n" + text_517 + "\n" + history_2 + "\n";
    try {
      const endpoint_3 = window.u2Api.resolveChatCompletionsEndpoint(resolvedApiConfig.endpoint),
        value_542 = await fetch(endpoint_3, {
          method: "POST",
          headers: window.u2Api?.buildApiHeaders ? window.u2Api.buildApiHeaders(resolvedApiConfig) : {
            "Content-Type": "application/json",
            Authorization: "Bearer " + resolvedApiConfig.apiKey
          },
          body: JSON.stringify({
            model: resolvedApiConfig.model || "gpt-3.5-turbo",
            messages: [{
              role: "system",
              content: "You generate strict JSON objects for immersive b.stage character fan interactions."
            }, {
              role: "user",
              content: content_5
            }],
            temperature: parseFloat(resolvedApiConfig.temperature) || 0.8
          })
        });
      if (!value_542.ok) throw window.u2Api?.createHttpError?.(value_542, await window.u2Api?.readApiError?.(value_542)) || Object.assign(new Error("HTTP " + value_542.status), {
        status: value_542.status
      });
      const value_543 = await value_542.json(),
        canonicalBstageMember_544 = findCanonicalBstageMember(member_11.id, currentTeam?.id);
      if (!canonicalBstageMember_544) throw new Error("chat_member_removed");
      currentTeam = canonicalBstageMember_544.team;
      member_11 = canonicalBstageMember_544.member;
      currentChatMember && String(currentChatMember.id) === String(member_11.id) && (currentChatMember = member_11);
      let aiReply = value_543.choices[0].message.content;
      aiReply = aiReply.replace(/```json/g, "").replace(/```/g, "").trim();
      let parsedMsgs = [],
        otherFanMessages_2 = [];
      try {
        const parsedPayload = JSON.parse(aiReply);
        if (Array.isArray(parsedPayload)) parsedMsgs = parsedPayload;else parsedPayload && typeof parsedPayload === "object" ? (parsedMsgs = Array.isArray(parsedPayload.charMessages) ? parsedPayload.charMessages : Array.isArray(parsedPayload.messages) ? parsedPayload.messages : [], otherFansEnabled_2 && (otherFanMessages_2 = normalizeOtherFanMessages(parsedPayload.otherFanMessages || parsedPayload.fanMessages || parsedPayload.other_fan_messages || [], Date.now()))) : parsedMsgs = [aiReply];
      } catch (value_556) {
        const lines = aiReply.split("\n").filter(s => s.trim().length > 0);
        parsedMsgs = lines.map(l => ({
          text: l,
          trans: "翻译失败"
        }));
      }
      if (otherFansEnabled_2 && otherFanMessages_2.length < 10) throw new Error("too_few_other_fans");
      if (contentContainer_3) {
        userMsgCountSinceLastReply = 0;
        const statusTexts = contentContainer_3.querySelectorAll(".bstage-msg-status-text");
        statusTexts.forEach(el => {
          if (el.innerHTML === "未读") el.innerHTML = "已读";
        });
      }
      member_11.chatHistory && member_11.chatHistory.forEach(h => {
        if (h.isUser && h.status === "未读") h.status = "已读";
      });
      function openImagePreview(src_4, textContent_4) {
        const overlay_2 = document.createElement("div");
        overlay_2.style.position = "fixed";
        overlay_2.style.top = "0";
        overlay_2.style.left = "0";
        overlay_2.style.width = "100vw";
        overlay_2.style.height = "100vh";
        overlay_2.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
        overlay_2.style.zIndex = "10000";
        overlay_2.style.display = "flex";
        overlay_2.style.flexDirection = "column";
        overlay_2.style.justifyContent = "center";
        overlay_2.style.alignItems = "center";
        overlay_2.style.cursor = "zoom-out";
        const img_3 = document.createElement("img");
        img_3.src = src_4;
        img_3.style.maxWidth = "90%";
        img_3.style.maxHeight = "80%";
        img_3.style.objectFit = "contain";
        img_3.style.borderRadius = "12px";
        img_3.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
        overlay_2.appendChild(img_3);
        if (textContent_4) {
          const textDiv_2 = document.createElement("div");
          textDiv_2.style.color = "#fff";
          textDiv_2.style.marginTop = "20px";
          textDiv_2.style.maxWidth = "90%";
          textDiv_2.style.textAlign = "center";
          textDiv_2.style.fontSize = "16px";
          textDiv_2.textContent = textContent_4;
          overlay_2.appendChild(textDiv_2);
        }
        document.body.appendChild(overlay_2);
        overlay_2.addEventListener("click", () => {
          overlay_2.remove();
        });
      }
      const generationStartedAt = Date.now(),
        playbackItems = [],
        dateMessage = parsedMsgs.length > 0 || otherFanMessages_2.length > 0 ? checkAndAddDateBubble(member_11, null, generationStartedAt) : null;
      let delay_2 = 0;
      const otherFanMessageById = new Map(otherFanMessages_2.map(fan => [String(fan.id), fan]));
      parsedMsgs.forEach(msgItem => {
        let text_5 = "",
          trans_2 = "",
          type_2 = "text",
          imgDesc_2 = "",
          replyToUserId_2 = "",
          replyToFanId_2 = "";
        typeof msgItem === "string" ? text_5 = stripGeneratedText(msgItem) : (type_2 = msgItem.type || "text", text_5 = stripGeneratedText(msgItem.text || ""), trans_2 = stripGeneratedText(msgItem.trans || msgItem.translation || msgItem.translationZh || ""), imgDesc_2 = stripGeneratedText(msgItem.description || ""), replyToUserId_2 = stripGeneratedText(msgItem.replyToUserId || msgItem.reply_to_user_id || msgItem.replyToId || msgItem.reply_to_id || ""), replyToFanId_2 = stripGeneratedText(msgItem.replyToFanId || msgItem.reply_to_fan_id || ""));
        if (type_2 !== "image" && !text_5) return;
        const fanReplySource = replyToFanId_2 ? otherFanMessageById.get(String(replyToFanId_2)) : null,
          userReplySource = findMessageById(member_11.chatHistory, replyToUserId_2, msg_15 => msg_15 && msg_15.isUser),
          replyTo_4 = fanReplySource ? createOtherFanReplyMeta(fanReplySource) : userReplySource ? createReplyMeta(userReplySource, "当前粉丝") : null,
          savedMsg = type_2 === "image" ? {
            id: createBstageMessageId("char"),
            isUser: false,
            type: "image",
            imgUrl: "assets/imessage/chat-image-placeholder-512.jpg",
            imgDesc: imgDesc_2,
            timestamp: generationStartedAt + delay_2,
            replyTo: replyTo_4,
            isUnread: !contentContainer_3
          } : {
            id: createBstageMessageId("char"),
            isUser: false,
            type: "text",
            text: text_5,
            trans: trans_2,
            timestamp: generationStartedAt + delay_2,
            replyTo: replyTo_4,
            isUnread: !contentContainer_3
          };
        if (!member_11.chatHistory) member_11.chatHistory = [];
        member_11.chatHistory.push(savedMsg);
        if (type_2 === "image") chatPhotos_2.push(savedMsg.imgUrl);
        playbackItems.push({
          delay: delay_2,
          message: savedMsg
        });
        delay_2 += 1500 + Math.random() * 1000;
      });
      if (otherFanMessages_2.length > 0) {
        const fanBatchMsg = {
          id: createBstageMessageId("fan_batch"),
          type: "fan_batch",
          timestamp: generationStartedAt + delay_2,
          fanMessages: otherFanMessages_2
        };
        if (!member_11.chatHistory) member_11.chatHistory = [];
        member_11.chatHistory.push(fanBatchMsg);
        playbackItems.push({
          delay: delay_2 + (parsedMsgs.length > 0 ? 250 : 0),
          message: fanBatchMsg
        });
      }
      if (playbackItems.length === 0 && !dateMessage) return;
      const persisted = await saveBstageData({
        flush: true
      });
      if (!persisted) throw new Error("storage_write_failed");
      if (!contentContainer_3) {
        if (isAuto && playbackItems.length > 0) {
          const firstMessage = playbackItems[0].message;
          if (window.showBannerNotification) window.showBannerNotification({
            nickname: member_11.name,
            avatarUrl: member_11.avatar,
            id: member_11.id,
            sourceApp: "bstage"
          }, firstMessage.type === "image" ? "[图片]" : firstMessage.text);else window.showToast && window.showToast("收到来自 " + member_11.name + " 的新消息");
        }
        return;
      }
      if (dateMessage) appendCharChatMessage(member_11, dateMessage, contentContainer_3);
      let previousDelay = 0;
      for (const item_10 of playbackItems) {
        const waitMs = Math.max(0, item_10.delay - previousDelay);
        if (waitMs > 0) await new Promise(resolve_4 => setTimeout(resolve_4, waitMs));
        previousDelay = item_10.delay;
        if (item_10.message.type === "image") {
          const previewList = document.getElementById("bstage-locker-preview-list");
          if (previewList && chatDetailSheet.style.display === "block") renderLockerPreview();
        }
        appendCharChatMessage(member_11, item_10.message, contentContainer_3);
        contentContainer_3.scrollTop = contentContainer_3.scrollHeight;
      }
    } catch (error_4) {
      console.error(error_4);
      if (!isAuto && (!window.u2Api?.isRequestError?.(error_4) || !window.u2Api.reportError(error_4, {
        operation: "粉丝聊天回复"
      }))) window.showToast(error_4 && error_4.message === "too_few_other_fans" ? "其他人消息少于 10 条，请重试" : "生成回复失败");
    }
  }
  function renderShop(team_11) {
    if (handleAction_48(team_11)) saveBstageData();
    !Array.isArray(team_11.shopItems) && (team_11.shopItems = []);
    (!Array.isArray(team_11.shopCategories) || team_11.shopCategories.length === 0) && (team_11.shopCategories = ["全部"]);
    let activeCategory = "全部";
    const value_582 = activeCategory_2 => {
        let gridHtml = "";
        const items_585 = activeCategory_2 === "全部" ? team_11.shopItems : team_11.shopItems.filter(i_3 => i_3.category === activeCategory_2);
        return items_585.length === 0 ? gridHtml = "<div style=\"grid-column:span 2;text-align:center;padding:20px;color:#666;\">暂无商品</div>" : items_585.forEach(value_587 => {
          const img_4 = value_587.img || handleAction_47((team_11.id || team_11.name) + "-shop-" + (value_587.id || value_587.name), 600, 600);
          value_587.img = img_4;
          gridHtml += "\n                        <div class=\"bstage-shop-item\" data-shop-id=\"" + value_587.id + "\">\n                            <div class=\"bstage-shop-img\">\n                                <img src=\"" + escapeHtml(img_4) + "\" alt=\"\">\n                            </div>\n                            <div class=\"bstage-shop-info\">\n                                <span class=\"bstage-shop-badge\">" + escapeHtml(value_587.category) + "</span>\n                                <div class=\"bstage-shop-name\">" + escapeHtml(value_587.name) + "</div>\n                                <div class=\"bstage-shop-price\">" + escapeHtml(value_587.price) + "</div>\n                            </div>\n                        </div>\n                    ";
        }), gridHtml;
      },
      renderView = () => {
        let text_589 = "";
        team_11.shopCategories.forEach(value_593 => {
          const value_594 = value_593 === activeCategory ? "active" : "";
          text_589 += "<div class=\"bstage-shop-cat-item " + value_594 + "\" data-cat=\"" + value_593 + "\">" + value_593 + "</div>";
        });
        const text_590 = "\n                <div class=\"bstage-small-magic-btn\" id=\"bstage-shop-magic-btn\" style=\"margin-left: 5px; flex-shrink: 0;\">\n                    <i class=\"fas fa-plus\"></i>\n                </div>\n            ",
          value_591 = team_11.shopBanner ? "background-image: url('" + team_11.shopBanner + "');" : "background-color:#222;",
          value_592 = team_11.shopBanner ? "" : "\n                <div style=\"width:100%;height:100%;background-color:#222;display:flex;justify-content:center;align-items:center;opacity:0.5;\">\n                    <i class=\"fas fa-star\" style=\"font-size:40px;color:#444;\"></i>\n                </div>\n            ";
        contentArea.innerHTML = "\n                <div class=\"bstage-shop-view\">\n                    <div class=\"bstage-shop-banner\" id=\"bstage-shop-banner-edit\" style=\"" + value_591 + "; cursor: pointer; position: relative;\">\n                        " + value_592 + "\n                        <div class=\"bstage-shop-banner-text\">OFFICIAL SHOP</div>\n                        <input type=\"file\" id=\"bstage-shop-banner-input\" accept=\"image/*\" style=\"display:none;\">\n                    </div>\n                    \n                    <div style=\"display: flex; align-items: center; margin-bottom: 5px;\">\n                        <div class=\"bstage-shop-category-bar\" style=\"flex: 1; margin-bottom: 0;\">\n                            " + text_589 + "\n                        </div>\n                        " + text_590 + "\n                    </div>\n\n                    <div class=\"bstage-shop-section-title\">" + (activeCategory === "全部" ? "ALL ITEMS" : activeCategory) + "</div>\n                    <div class=\"bstage-shop-grid\" id=\"bstage-shop-grid-container\">\n                        " + value_582(activeCategory) + "\n                    </div>\n                </div>\n            ";
        contentArea.querySelectorAll(".bstage-shop-cat-item").forEach(el_2 => {
          el_2.addEventListener("click", () => {
            activeCategory = el_2.getAttribute("data-cat");
            renderView();
          });
        });
        const bannerEdit = document.getElementById("bstage-shop-banner-edit"),
          bannerInput = document.getElementById("bstage-shop-banner-input");
        bannerEdit && bannerInput && (bannerEdit.addEventListener("click", e_18 => {
          bannerInput.click();
        }), bannerInput.addEventListener("change", e_19 => {
          const file_3 = e_19.target.files[0];
          if (file_3) {
            const reader_3 = new FileReader();
            reader_3.onload = ev => {
              team_11.shopBanner = ev.target.result;
              renderView();
              window.showToast("Shop 背景已更新");
            };
            reader_3.readAsDataURL(file_3);
          }
          e_19.stopPropagation();
        }), bannerInput.addEventListener("click", e_20 => e_20.stopPropagation()));
        const magicBtn = document.getElementById("bstage-shop-magic-btn");
        magicBtn && magicBtn.addEventListener("click", () => {
          openGenerateTypeSheet({
            title: "生成商品",
            label: "想看什么类型的商品",
            placeholder: "例如：应援棒、签售周边、冬季套装；留空则随机",
            onConfirm: request => triggerShopApi(team_11, activeCategory, request)
          });
        });
        contentArea.querySelectorAll(".bstage-shop-item").forEach((value_601, value_602) => {
          value_601.addEventListener("click", () => {
            const value_603 = activeCategory === "全部" ? team_11.shopItems : team_11.shopItems.filter(i_4 => i_4.category === activeCategory);
            value_603[value_602] && handleAction_88(value_603[value_602]);
          });
        });
      };
    renderView();
  }
  function handleAction_88(item_11) {
    document.getElementById("bstage-shop-detail-title").textContent = item_11.name;
    document.getElementById("bstage-shop-detail-price").textContent = item_11.price;
    document.getElementById("bstage-shop-detail-cat").textContent = item_11.category;
    const textContent_5 = item_11.desc || currentTeam.name + " 官方正品周边。\n\n[商品信息]\n品名: " + item_11.name + "\n材质: Detailed on package\n尺寸: Free Size\n制造国: Korea";
    document.getElementById("bstage-shop-detail-desc").textContent = textContent_5;
    const imgEl = document.querySelector("#bstage-shop-detail-img img"),
      placeholder_3 = document.querySelector("#bstage-shop-detail-img .bstage-shop-detail-placeholder");
    item_11.img ? (imgEl.src = item_11.img, imgEl.style.display = "block", placeholder_3.style.display = "none") : (imgEl.style.display = "none", placeholder_3.style.display = "flex");
    window.openView(document.getElementById("bstage-shop-detail-modal"));
  }
  async function triggerShopApi(team_12, category_2, requestType = "") {
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
      window.showToast("请先在系统设置中配置 API");
      return;
    }
    if (!Array.isArray(team_12.shopItems)) team_12.shopItems = [];
    if (!Array.isArray(team_12.shopCategories)) team_12.shopCategories = ["全部"];
    window.showToast("正在生成商品...");
    let text_610 = "团队成员:\n";
    team_12.members && team_12.members.forEach(message_612 => {
      text_610 += "- " + message_612.name + " (" + message_612.role + ")\n";
    });
    const content_9 = "\n你是一个周边商品策划。\n请根据以下团队信息和角色人设，以及商品分类，生成2-3个相关的商品。\n团队名称: " + team_12.name + "\n" + text_610 + "\n商品分类: " + category_2 + "\n用户想看的类型: " + (requestType || "留空，随机生成适合该团队/账号的商品") + "\n\n要求：\n1. 如果用户填写了想看的类型，商品必须围绕该类型生成；如果留空，则随机生成有吸引力的商品。\n2. 价格要合理（韩元），格式如 \"₩45,000\"。\n3. category 应该使用已有分类或根据用户想看的类型给出自然分类。\n4. desc 是商品详情简介。\n5. 返回严格的 JSON 数组格式，不要 markdown 标记。\n格式示例:\n[\n  {\"name\": \"商品名称1\", \"price\": \"₩35,000\", \"category\": \"周边\", \"desc\": \"商品详情\"},\n  {\"name\": \"商品名称2\", \"price\": \"₩12,000\", \"category\": \"其他\", \"desc\": \"商品详情\"}\n]\n";
    try {
      const chatCompletionsEndpoint_613 = window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint),
        value_614 = await fetch(chatCompletionsEndpoint_613, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.apiConfig.apiKey
          },
          body: JSON.stringify({
            model: window.apiConfig.model || "gpt-3.5-turbo",
            messages: [{
              role: "system",
              content: "You are a JSON generator."
            }, {
              role: "user",
              content: content_9
            }],
            temperature: 0.7
          })
        });
      if (!value_614.ok) throw window.u2Api?.createHttpError?.(value_614, await window.u2Api?.readApiError?.(value_614)) || Object.assign(new Error("HTTP " + value_614.status), {
        status: value_614.status
      });
      const value_615 = await value_614.json();
      let content_616 = value_615.choices[0].message.content;
      content_616 = content_616.replace(/```json/g, "").replace(/```/g, "").trim();
      const result_617 = JSON.parse(content_616);
      Array.isArray(result_617) && (result_617.forEach(item_12 => {
        const name_9 = stripGeneratedText(item_12 && item_12.name, "New Item"),
          itemCategory = stripGeneratedText(item_12 && item_12.category, category_2 === "全部" ? requestType || "周边" : category_2);
        if (itemCategory && !team_12.shopCategories.includes(itemCategory)) team_12.shopCategories.push(itemCategory);
        team_12.shopItems.unshift({
          id: Date.now() + Math.random(),
          name: name_9,
          price: stripGeneratedText(item_12 && item_12.price, "₩35,000"),
          img: handleAction_47((team_12.id || team_12.name) + "-shop-" + name_9 + "-" + Date.now(), 600, 600),
          category: itemCategory,
          desc: stripGeneratedText(item_12 && item_12.desc)
        });
      }), saveBstageData(), renderShop(team_12), window.showToast("已生成 " + result_617.length + " 个商品"));
    } catch (value_621) {
      console.error(value_621);
      if (!window.u2Api?.isRequestError?.(value_621) || !window.u2Api.reportError(value_621, {
        operation: "商品生成"
      })) window.showToast("生成失败");
    }
  }
  function handleAction_89(team_13) {
    if (handleAction_48(team_13)) saveBstageData();
    !Array.isArray(team_13.contentPhotos) && (team_13.contentPhotos = []);
    if (!Array.isArray(team_13.videos)) team_13.videos = [];
    (!Array.isArray(team_13.contentSeries) || team_13.contentSeries.length === 0) && (team_13.contentSeries = ["全部"]);
    let activeSeries = "全部";
    const renderView_2 = () => {
      let text_624 = "";
      team_13.contentPhotos.forEach(value_629 => {
        text_624 += "<div class=\"bstage-carousel-item\"><img src=\"" + value_629 + "\"></div>";
      });
      text_624 += "\n                <div class=\"bstage-add-photo-btn\" id=\"bstage-add-content-photo-btn\">\n                    <i class=\"fas fa-plus\"></i>\n                    <input type=\"file\" accept=\"image/*\" style=\"display:none;\">\n                </div>\n            ";
      let text_625 = "";
      team_13.contentSeries.forEach(value_630 => {
        const value_631 = value_630 === activeSeries ? "active" : "";
        let text_632 = "";
        value_630 !== "全部" && (text_632 = "<div class=\"bstage-cat-delete\" data-del-series=\"" + value_630 + "\"><i class=\"fas fa-times\"></i></div>");
        text_625 += "<div class=\"bstage-shop-cat-item " + value_631 + "\" data-series=\"" + value_630 + "\">" + value_630 + text_632 + "</div>";
      });
      text_625 += "\n                <div class=\"bstage-shop-cat-item\" id=\"bstage-add-series-btn\">\n                    <i class=\"fas fa-plus\"></i>\n                </div>\n            ";
      const text_626 = "\n                <div class=\"bstage-small-magic-btn\" id=\"bstage-content-magic-btn\" style=\"margin-left: 5px; flex-shrink: 0;\">\n                    <i class=\"fas fa-plus\"></i>\n                </div>\n            ";
      let videosHtml = "";
      const filteredVideos = activeSeries === "全部" ? team_13.videos : team_13.videos.filter(v => v.series === activeSeries || !v.series && activeSeries === "全部");
      filteredVideos.length === 0 ? videosHtml = "<div style=\"text-align:center; color:#666; padding:20px;\">暂无视频</div>" : filteredVideos.forEach(value_633 => {
        if (!value_633.thumb) value_633.thumb = handleAction_47((team_13.id || team_13.name) + "-video-" + (value_633.title || Date.now()), 800, 450);
        const value_634 = value_633.thumb ? "background-image: url('" + value_633.thumb + "'); background-size: cover; background-position: center;" : "",
          value_635 = value_633.thumb ? "" : "\n                        <div style=\"width:100%;height:100%;display:flex;justify-content:center;align-items:center;color:#555;\">\n                            <i class=\"fas fa-play\" style=\"font-size:30px;\"></i>\n                        </div>";
        videosHtml += "\n                        <div class=\"bstage-video-card\">\n                            <div class=\"bstage-video-thumb\" style=\"" + value_634 + "\">\n                                " + value_635 + "\n                                <div class=\"bstage-video-duration\">" + value_633.duration + "</div>\n                            </div>\n                            <div class=\"bstage-video-info\">\n                                <div class=\"bstage-video-title\">" + value_633.title + "</div>\n                                <div class=\"bstage-video-meta\">" + value_633.views + " • " + value_633.date + "</div>\n                            </div>\n                        </div>\n                    ";
      });
      contentArea.innerHTML = "\n                <div class=\"bstage-content-view\">\n                    <div class=\"bstage-top-carousel\" id=\"bstage-carousel-container\">\n                        " + text_624 + "\n                    </div>\n                    \n                    <div class=\"bstage-video-section\">\n                        <div style=\"display: flex; align-items: center; margin-bottom: 5px;\">\n                            <div class=\"bstage-shop-category-bar\" style=\"flex: 1; margin-bottom: 0;\">\n                                " + text_625 + "\n                            </div>\n                            " + text_626 + "\n                        </div>\n                        \n                        <div class=\"bstage-section-header\">" + (activeSeries === "全部" ? "All Videos" : activeSeries) + "</div>\n                        <div class=\"bstage-video-list\">\n                            " + videosHtml + "\n                        </div>\n                    </div>\n                </div>\n            ";
      contentArea.querySelectorAll(".bstage-video-card").forEach((value_636, value_637) => {
        value_636.addEventListener("click", () => {
          filteredVideos[value_637] && handleAction_91(filteredVideos[value_637]);
        });
      });
      const addBtn_2 = document.getElementById("bstage-add-content-photo-btn");
      if (addBtn_2) {
        const input_4 = addBtn_2.querySelector("input");
        addBtn_2.addEventListener("click", () => input_4.click());
        input_4.addEventListener("change", e_21 => {
          const file_4 = e_21.target.files[0];
          if (file_4) {
            const reader_4 = new FileReader();
            reader_4.onload = e_22 => {
              team_13.contentPhotos.unshift(e_22.target.result);
              renderView_2();
            };
            reader_4.readAsDataURL(file_4);
          }
        });
      }
      contentArea.querySelectorAll(".bstage-shop-cat-item").forEach(el_3 => {
        if (el_3.id === "bstage-add-series-btn") el_3.addEventListener("click", () => {
          const newSeries = prompt("请输入新的系列名称:");
          newSeries && newSeries.trim() && (team_13.contentSeries.push(newSeries.trim()), activeSeries = newSeries.trim(), renderView_2());
        });else {
          const delBtn = el_3.querySelector(".bstage-cat-delete");
          delBtn && delBtn.addEventListener("click", event_645 => {
            event_645.stopPropagation();
            const s_2 = delBtn.getAttribute("data-del-series");
            if (confirm("确定要删除系列 \"" + s_2 + "\" 吗？")) {
              team_13.contentSeries = team_13.contentSeries.filter(x => x !== s_2);
              if (activeSeries === s_2) activeSeries = "全部";
              renderView_2();
            }
          });
          el_3.addEventListener("click", ev_2 => {
            if (ev_2.target.closest(".bstage-cat-delete")) return;
            activeSeries = el_3.getAttribute("data-series");
            renderView_2();
          });
        }
      });
      const magicBtn_2 = document.getElementById("bstage-content-magic-btn");
      magicBtn_2 && magicBtn_2.addEventListener("click", () => {
        openGenerateTypeSheet({
          title: "生成视频内容",
          label: "想看什么类型的视频内容",
          placeholder: "例如：练习室、旅行 vlog、后台花絮；留空则随机",
          onConfirm: request_2 => triggerContentApi(team_13, activeSeries, request_2)
        });
      });
      handleAction_90();
    };
    renderView_2();
  }
  function handleAction_90() {
    if (value_32) clearInterval(value_32);
    const container_8 = document.getElementById("bstage-carousel-container");
    if (!container_8) return;
    value_32 = setInterval(() => {
      if (!container_8) return;
      const left_2 = 290;
      container_8.scrollLeft + container_8.clientWidth >= container_8.scrollWidth - 10 ? container_8.scrollTo({
        left: 0,
        behavior: "smooth"
      }) : container_8.scrollBy({
        left: left_2,
        behavior: "smooth"
      });
    }, 3000);
  }
  let currentVideo = null;
  function handleAction_91(video_3) {
    currentVideo = video_3;
    setPendingVideoCommentReply(null);
    document.getElementById("bstage-vid-detail-title").textContent = video_3.title;
    document.getElementById("bstage-vid-detail-meta").textContent = video_3.views + " • " + video_3.date;
    document.getElementById("bstage-vid-publisher-name").textContent = currentTeam.name;
    const pubAvatar = document.getElementById("bstage-vid-publisher-avatar");
    if (pubAvatar) pubAvatar.innerHTML = renderBstageAvatarContent(currentTeam, currentTeam.name);
    const playerPlaceholder = videoDetailModal.querySelector(".bstage-video-player-placeholder");
    video_3.thumb ? (playerPlaceholder.style.backgroundImage = "url('" + video_3.thumb + "')", playerPlaceholder.style.backgroundSize = "cover", playerPlaceholder.style.backgroundPosition = "center", playerPlaceholder.classList.add("has-cover")) : (playerPlaceholder.style.backgroundImage = "", playerPlaceholder.classList.remove("has-cover"));
    playerPlaceholder.innerHTML = "";
    !video_3.generatedContent || video_3.generatedContent.length === 0 ? !video_3.thumb && (playerPlaceholder.innerHTML = "<i class=\"fas fa-play\" style=\"font-size: 40px; opacity: 0.8; align-self: center; margin-top: auto; margin-bottom: auto;\"></i>") : video_3.generatedContent.forEach(text_652 => {
      const bubble = document.createElement("div");
      bubble.className = "bstage-video-content-bubble";
      bubble.textContent = text_652;
      playerPlaceholder.appendChild(bubble);
    });
    const textContent_6 = video_3.description || "这是 " + currentTeam.name + " 的精彩视频内容。\n请大家多多支持，不要忘记点赞评论哦！";
    document.getElementById("bstage-vid-description").textContent = textContent_6;
    !video_3.comments && (video_3.comments = [{
      id: 1,
      name: "User123",
      text: "太棒了！😍",
      time: "1m ago",
      avatar: null,
      avatarEmoji: getStableEmojiAvatar("video-comment-User123")
    }, {
      id: 2,
      name: "K-Pop Fan",
      text: "Love this team!!!",
      time: "5m ago",
      avatar: null,
      avatarEmoji: getStableEmojiAvatar("video-comment-K-Pop Fan")
    }, {
      id: 3,
      name: "Stan",
      text: "❤️❤️❤️",
      time: "1h ago",
      avatar: null,
      avatarEmoji: getStableEmojiAvatar("video-comment-Stan")
    }]);
    renderVideoComments();
    const userAvatarDiv = document.getElementById("bstage-comment-user-avatar");
    window.userState && window.userState.avatarUrl ? userAvatarDiv.innerHTML = "<img src=\"" + window.userState.avatarUrl + "\" style=\"width:100%;height:100%;object-fit:cover;border-radius:50%;\">" : userAvatarDiv.innerHTML = "<i class=\"fas fa-user\" style=\"color:#888;font-size:16px;display:flex;justify-content:center;align-items:center;height:100%;\"></i>";
    window.openView(videoDetailModal);
  }
  videoDetailModal.querySelector(".bstage-video-player-placeholder").addEventListener("click", value_653 => {
    currentVideo && openEditVideoSheet(currentVideo);
  });
  function openEditVideoSheet(video_4) {
    document.getElementById("bstage-edit-video-title").value = video_4.title;
    const desc_655 = video_4.description || "";
    document.getElementById("bstage-edit-video-desc").value = desc_655;
    const preview = document.getElementById("bstage-edit-video-cover-preview");
    if (video_4.thumb) {
      preview.src = video_4.thumb;
      preview.style.display = "block";
      if (preview.previousElementSibling) preview.previousElementSibling.style.opacity = "0";
    } else {
      preview.src = "";
      preview.style.display = "none";
      if (preview.previousElementSibling) preview.previousElementSibling.style.opacity = "1";
    }
    window.openView(document.getElementById("bstage-edit-video-sheet"));
  }
  document.getElementById("bstage-confirm-edit-video-btn").addEventListener("click", () => {
    if (currentVideo) {
      const value_656 = document.getElementById("bstage-edit-video-title").value,
        description_2 = document.getElementById("bstage-edit-video-desc").value,
        newCover = document.getElementById("bstage-edit-video-cover-preview").src,
        hasCover = document.getElementById("bstage-edit-video-cover-preview").style.display !== "none";
      if (value_656) {
        currentVideo.title = value_656;
        currentVideo.description = description_2;
        currentVideo.thumb = hasCover ? newCover : null;
        document.getElementById("bstage-vid-detail-title").textContent = value_656;
        document.getElementById("bstage-vid-description").textContent = description_2 || "这是 " + currentTeam.name + " 的精彩视频内容...";
        const bstageVideoPlayerPlaceholderElement = videoDetailModal.querySelector(".bstage-video-player-placeholder");
        currentVideo.thumb ? (bstageVideoPlayerPlaceholderElement.style.backgroundImage = "url('" + currentVideo.thumb + "')", bstageVideoPlayerPlaceholderElement.style.backgroundSize = "cover", bstageVideoPlayerPlaceholderElement.style.backgroundPosition = "center", bstageVideoPlayerPlaceholderElement.classList.add("has-cover"), !bstageVideoPlayerPlaceholderElement.querySelector(".bstage-video-content-bubble") && (bstageVideoPlayerPlaceholderElement.innerHTML = "")) : (bstageVideoPlayerPlaceholderElement.style.backgroundImage = "", bstageVideoPlayerPlaceholderElement.classList.remove("has-cover"), !bstageVideoPlayerPlaceholderElement.querySelector(".bstage-video-content-bubble") && (bstageVideoPlayerPlaceholderElement.innerHTML = "<i class=\"fas fa-play\" style=\"font-size: 40px; opacity: 0.8; align-self: center; margin-top: auto; margin-bottom: auto;\"></i>"));
        currentTeam && handleAction_89(currentTeam);
        window.closeView(document.getElementById("bstage-edit-video-sheet"));
        window.showToast("视频信息已更新");
      }
    }
  });
  document.getElementById("bstage-delete-video-btn").addEventListener("click", () => {
    if (!currentTeam || !currentVideo || !Array.isArray(currentTeam.videos)) return;
    if (!confirm("确定要删除这个视频吗？")) return;
    const target_4 = currentVideo,
      before_4 = currentTeam.videos.length;
    currentTeam.videos = currentTeam.videos.filter(video_5 => {
      if (video_5 === target_4) return false;
      if (video_5.id && target_4.id) return video_5.id !== target_4.id;
      return !(video_5.title === target_4.title && video_5.duration === target_4.duration && video_5.date === target_4.date);
    });
    if (currentTeam.videos.length === before_4) {
      window.showToast("未找到要删除的视频");
      return;
    }
    saveBstageData();
    handleAction_89(currentTeam);
    currentVideo = null;
    window.closeView(document.getElementById("bstage-edit-video-sheet"));
    window.closeView(videoDetailModal);
    window.showToast("视频已删除");
  });
  document.getElementById("bstage-video-detail-magic-btn").addEventListener("click", () => {
    currentVideo && openGenerateTypeSheet({
      title: "生成视频详情",
      label: "想看什么类型的视频细节",
      placeholder: "例如：后台互动、开箱、舞台花絮；留空则随机",
      onConfirm: request_3 => triggerVideoDetailApi(currentVideo, request_3)
    });
  });
  async function triggerVideoDetailApi(video_6, value_665 = "") {
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
      window.showToast("请先在系统设置中配置 API");
      return;
    }
    window.showToast("正在生成内容...");
    let text_666 = "团队成员:\n";
    currentTeam.members && currentTeam.members.forEach(message_668 => {
      text_666 += "- " + message_668.name + " (" + message_668.role + ")\n";
    });
    const content_10 = "\n你是一个偶像视频内容生成器。\n请根据以下信息，生成视频简介、视频画面的内容描述（分镜/字幕），以及几条粉丝评论。\n团队: " + currentTeam.name + "\n" + text_666 + "\n视频标题: " + video_6.title + "\n视频简介: " + (video_6.description || "无") + "\n用户想看的类型: " + (value_665 || "留空，随机生成适合该视频的细节") + "\n\n要求：\n1. \"description\": 生成一段自然的视频简介，贴合团队/账号和用户想看的类型。\n2. \"content\": 生成 5 到 10 条简短的视频画面描述或字幕文本，用于逐条显示在视频画面上。内容要有趣，符合人设。\n3. \"comments\": 生成 2 到 3 条粉丝评论，包含 name、text、trans。非中文 text 必须提供自然中文翻译，中文 text 的 trans 为空字符串。\n4. 返回严格的 JSON 格式，不要 markdown 标记。\n格式示例:\n{\n  \"description\": \"视频简介\",\n  \"content\": [\"成员A正在大笑\", \"字幕: 今天天气真好\", \"成员B突然闯入镜头\"],\n  \"comments\": [\n    {\"name\": \"Fan1\", \"text\": \"太可爱了！\", \"trans\": \"\"},\n    {\"name\": \"Fan2\", \"text\": \"Love this!\", \"trans\": \"太喜欢了！\"}\n  ]\n}\n";
    try {
      const chatCompletionsEndpoint_669 = window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint),
        value_670 = await fetch(chatCompletionsEndpoint_669, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.apiConfig.apiKey
          },
          body: JSON.stringify({
            model: window.apiConfig.model || "gpt-3.5-turbo",
            messages: [{
              role: "system",
              content: "You are a JSON generator."
            }, {
              role: "user",
              content: content_10
            }],
            temperature: 0.7
          })
        });
      if (!value_670.ok) throw window.u2Api?.createHttpError?.(value_670, await window.u2Api?.readApiError?.(value_670)) || Object.assign(new Error("HTTP " + value_670.status), {
        status: value_670.status
      });
      const value_671 = await value_670.json();
      let content_672 = value_671.choices[0].message.content;
      content_672 = content_672.replace(/```json/g, "").replace(/```/g, "").trim();
      const result_2 = JSON.parse(content_672);
      if (result_2.description) {
        video_6.description = stripGeneratedText(result_2.description);
        const descEl = document.getElementById("bstage-vid-description");
        if (descEl) descEl.textContent = video_6.description;
      }
      if (result_2.content && Array.isArray(result_2.content)) {
        video_6.generatedContent = result_2.content;
        const playerPlaceholder_2 = videoDetailModal.querySelector(".bstage-video-player-placeholder");
        playerPlaceholder_2.innerHTML = "";
        let delay_3 = 0;
        result_2.content.forEach(text_6 => {
          setTimeout(() => {
            const bubble_2 = document.createElement("div");
            bubble_2.className = "bstage-video-content-bubble";
            bubble_2.textContent = text_6;
            playerPlaceholder_2.appendChild(bubble_2);
            playerPlaceholder_2.scrollTop = playerPlaceholder_2.scrollHeight;
          }, delay_3);
          delay_3 += 800;
        });
      }
      result_2.comments && Array.isArray(result_2.comments) && (result_2.comments.forEach(c_2 => {
        const name_10 = stripGeneratedText(c_2 && c_2.name, "Fan");
        video_6.comments.unshift({
          id: Date.now() + Math.random(),
          name: name_10,
          text: stripGeneratedText(c_2 && c_2.text),
          trans: stripGeneratedText(c_2 && (c_2.trans || c_2.translationZh || c_2.translation)),
          time: "Just now",
          avatar: null,
          avatarEmoji: getStableEmojiAvatar("video-comment-" + name_10 + "-" + Date.now() + "-" + Math.random()),
          replies: []
        });
      }), renderVideoComments());
      saveBstageData();
      window.showToast("内容生成完成");
    } catch (value_680) {
      console.error(value_680);
      if (!window.u2Api?.isRequestError?.(value_680) || !window.u2Api.reportError(value_680, {
        operation: "内容生成"
      })) window.showToast("生成失败");
    }
  }
  function setPendingVideoCommentReply(comment_2) {
    pendingVideoCommentReply = comment_2 || null;
    const preview_3 = document.getElementById("bstage-vid-comment-reply-preview"),
      textEl_2 = document.getElementById("bstage-vid-comment-reply-preview-text");
    preview_3 && textEl_2 && (comment_2 ? (textEl_2.textContent = "回复 " + comment_2.name + ": " + getMessageSummary(comment_2), preview_3.style.display = "flex") : (textEl_2.textContent = "", preview_3.style.display = "none"));
    const bstageVidCommentInputElement = document.getElementById("bstage-vid-comment-input");
    if (comment_2 && bstageVidCommentInputElement) bstageVidCommentInputElement.focus({
      preventScroll: true
    });
  }
  function handleAction_93(value_682) {
    const stripGeneratedText_683 = stripGeneratedText(value_682 && (value_682.trans || value_682.translationZh || value_682.translation));
    if (!stripGeneratedText_683) return "";
    return "\n            <button class=\"bstage-comment-trans-btn\" type=\"button\">翻译</button>\n            <div class=\"bstage-comment-trans-text\" style=\"display:none;\">" + escapeHtml(stripGeneratedText_683) + "</div>\n        ";
  }
  function handleAction_94(comment_3) {
    if (!comment_3 || !comment_3.replyTo) return "";
    const speaker_4 = stripGeneratedText(comment_3.replyTo.name || comment_3.replyTo.speaker, "评论"),
      text_7 = getMessageSummary({
        text: comment_3.replyTo.text || ""
      });
    return "\n            <div class=\"bstage-comment-reply-quote\">\n                <span>回复 " + escapeHtml(speaker_4) + "</span>\n                <div>" + escapeHtml(text_7) + "</div>\n            </div>\n        ";
  }
  function handleAction_95(comment_4) {
    if (!comment_4 || !Array.isArray(comment_4.replies) || comment_4.replies.length === 0) return "";
    return "\n            <div class=\"bstage-comment-replies\">\n                " + comment_4.replies.map(value_688 => "\n                    <div class=\"bstage-comment-reply-item\">\n                        <div class=\"bstage-comment-reply-author\">" + escapeHtml(value_688.name || "Fan") + "</div>\n                        <div class=\"bstage-comment-reply-text\">" + escapeHtml(value_688.text || "") + "</div>\n                        " + handleAction_93(value_688) + "\n                    </div>\n                ").join("") + "\n            </div>\n        ";
  }
  function renderVideoComments() {
    if (!currentVideo) return;
    const list_3 = document.getElementById("bstage-vid-comments-list"),
      count_3 = currentVideo.comments.length;
    document.getElementById("bstage-vid-comments-header").textContent = "评论 (" + count_3 + ")";
    list_3.innerHTML = "";
    currentVideo.comments.forEach(c => {
      const item_13 = document.createElement("div");
      item_13.className = "bstage-comment-item";
      const commentName = stripGeneratedText(c && c.name, "User"),
        value_692 = c.avatar ? "<img src=\"" + escapeHtml(c.avatar) + "\" style=\"width:100%;height:100%;object-fit:cover;border-radius:50%;\">" : "<div style=\"width:100%;height:100%;background:#333;border-radius:50%;display:flex;justify-content:center;align-items:center;color:#fff;\">" + escapeHtml(c.avatarEmoji || (c.isUser ? commentName.slice(0, 1) || "U" : getStableEmojiAvatar("video-comment-" + commentName + "-" + (c.id || "")))) + "</div>";
      item_13.innerHTML = "\n                <div class=\"bstage-comment-avatar\">" + value_692 + "</div>\n                <div class=\"bstage-comment-content\">\n                    <div class=\"bstage-comment-header\">\n                        <span class=\"bstage-comment-author\">" + escapeHtml(commentName) + "</span>\n                        <span class=\"bstage-comment-time\">" + escapeHtml(c.time || "") + "</span>\n                    </div>\n                    " + handleAction_94(c) + "\n                    <div class=\"bstage-comment-text\">" + escapeHtml(c.text || "") + "</div>\n                    " + handleAction_93(c) + "\n                    " + handleAction_95(c) + "\n                </div>\n            ";
      item_13.addEventListener("click", e_23 => {
        if (e_23.target.closest(".bstage-comment-trans-btn") || e_23.target.closest(".bstage-comment-replies")) return;
        setPendingVideoCommentReply(c);
      });
      item_13.querySelectorAll(".bstage-comment-trans-btn").forEach(btn => {
        btn.addEventListener("click", e_24 => {
          e_24.stopPropagation();
          const trans_3 = btn.nextElementSibling;
          if (!trans_3) return;
          const isHidden = trans_3.style.display === "none";
          trans_3.style.display = isHidden ? "block" : "none";
          btn.textContent = isHidden ? "收起翻译" : "翻译";
        });
      });
      list_3.appendChild(item_13);
    });
  }
  const vidInput = document.getElementById("bstage-vid-comment-input"),
    vidSendBtn = document.getElementById("bstage-vid-comment-send-btn"),
    vidReplyCancelBtn = document.getElementById("bstage-vid-comment-reply-cancel-btn");
  vidReplyCancelBtn && (vidReplyCancelBtn.addEventListener("click", () => setPendingVideoCommentReply(null)), vidReplyCancelBtn.addEventListener("keydown", event_696 => {
    (event_696.key === "Enter" || event_696.key === " ") && (event_696.preventDefault(), setPendingVideoCommentReply(null));
  }));
  if (vidInput && vidSendBtn) {
    vidInput.addEventListener("input", () => {
      vidInput.value.trim().length > 0 ? vidSendBtn.classList.remove("disabled") : vidSendBtn.classList.add("disabled");
    });
    const sendVideoComment = () => {
      if (vidSendBtn.classList.contains("disabled")) return;
      const text_8 = vidInput.value.trim();
      if (text_8 && currentVideo) {
        const newComment = {
          id: Date.now(),
          name: window.userState ? window.userState.name : "User",
          avatar: window.userState ? window.userState.avatarUrl : null,
          text: text_8,
          time: "Just now",
          isUser: true,
          replyTo: pendingVideoCommentReply ? {
            id: pendingVideoCommentReply.id,
            name: pendingVideoCommentReply.name,
            text: pendingVideoCommentReply.text
          } : null,
          replies: []
        };
        currentVideo.comments.unshift(newComment);
        renderVideoComments();
        vidInput.value = "";
        vidSendBtn.classList.add("disabled");
        setPendingVideoCommentReply(null);
        triggerVideoCommentReplyApi(currentVideo, newComment);
      }
    };
    bindBstageFocusPreservingAction(vidSendBtn, sendVideoComment);
    registerBstageSendInput(vidInput, sendVideoComment, {
      root: videoDetailModal,
      scrollContainer: videoDetailModal.querySelector(".bstage-video-detail-scroll")
    });
  }
  async function triggerVideoCommentReplyApi(value_699, userComment) {
    if (!value_699 || !userComment) return;
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
      window.showToast("请先在系统设置中配置 API");
      return;
    }
    let text_701 = "团队成员:\n";
    currentTeam && currentTeam.members && currentTeam.members.forEach(message_703 => {
      text_701 += "- " + message_703.name + " (" + message_703.role + ")\n";
    });
    const prompt_3 = "\n你正在模拟 b.stage 视频评论区。\n团队/账号：" + (currentTeam ? currentTeam.name : "User") + "\n" + text_701 + "\n视频标题：" + (value_699.title || "未命名视频") + "\n视频简介：" + (value_699.description || "无") + "\nUser 评论：" + userComment.text + "\n" + (userComment.replyTo ? "User 正在回复评论：" + userComment.replyTo.name + ": " + userComment.replyTo.text : "") + "\n\n要求：\n1. 生成不少于 10 条、最多 14 条来自粉丝/观众的回复，围绕 User 的评论自然互动。\n2. 可以有人赞同、补充、提问、羡慕或讨论视频内容。\n3. b.stage 是国际化应用，text 可以是中文或外文；非中文 text 必须提供自然中文翻译 trans，中文则 trans 为空字符串。\n4. 只返回严格 JSON 数组，不要 markdown。\n格式：\n[\n  { \"name\": \"评论者\", \"text\": \"原文\", \"trans\": \"中文翻译或空\" }\n]\n";
    try {
      const replies_2 = await callBstageJsonApi(prompt_3, "You generate strict JSON arrays for b.stage video comment replies.", 0.85);
      if (!Array.isArray(replies_2)) throw new Error("invalid_comment_replies");
      const replies_3 = replies_2.slice(0, 14).map((value_706, value_707) => {
        const name_12 = stripGeneratedText(value_706 && value_706.name, handleAction_102(value_707)),
          text_11 = stripGeneratedText(typeof value_706 === "string" ? value_706 : value_706 && value_706.text),
          trans_5 = stripGeneratedText(value_706 && (value_706.trans || value_706.translationZh || value_706.translation));
        if (!text_11) return null;
        if (handleAction_103(text_11) && !trans_5) return null;
        return {
          id: Date.now() + Math.random(),
          name: name_12,
          text: text_11,
          trans: trans_5,
          avatarEmoji: getStableEmojiAvatar("video-comment-reply-" + name_12 + "-" + value_707 + "-" + Date.now()),
          time: "Just now"
        };
      }).filter(Boolean);
      if (replies_3.length < 10) throw new Error("too_few_comment_replies");
      userComment.replies = replies_3;
      saveBstageData();
      renderVideoComments();
    } catch (e_25) {
      console.error("Bstage video comment reply API failed:", e_25);
      window.showToast("生成评论回复失败");
    }
  }
  async function triggerContentApi(team_14, series_2, requestType_2 = "") {
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
      window.showToast("请先在系统设置中配置 API");
      return;
    }
    if (!Array.isArray(team_14.videos)) team_14.videos = [];
    if (!Array.isArray(team_14.contentSeries)) team_14.contentSeries = ["全部"];
    window.showToast("正在生成视频物料...");
    let text_715 = "团队成员:\n";
    Array.isArray(team_14.members) && team_14.members.length > 0 ? team_14.members.forEach(message_717 => {
      text_715 += "- " + message_717.name + " (" + message_717.role + ")\n";
    }) : text_715 += "- 暂无成员\n";
    const content_11 = "\n你是一个偶像团体的内容策划。\n请根据以下团队信息和角色人设，以及系列主题，生成2-3个相关的视频物料。\n团队名称: " + team_14.name + "\n团队简介: " + (team_14.desc || "无") + "\n" + text_715 + "\n系列主题: " + series_2 + "\n用户想看的类型: " + (requestType_2 || "留空，随机生成适合该团队/账号的视频内容") + "\n\n要求：\n1. 如果用户填写了想看的类型，视频必须围绕该类型生成；如果留空，则随机生成有吸引力的视频内容。\n2. 生成虚拟的时长(如 12:30)、观看量(如 1.2M)、发布日期(如 2 days ago)。\n3. series 可以沿用当前系列，也可以根据用户想看的类型给出新系列名。\n4. 返回严格的 JSON 数组格式，不要 markdown 标记。\n格式示例:\n[\n  {\"title\": \"Video Title 1\", \"duration\": \"10:05\", \"views\": \"500K\", \"date\": \"1 day ago\", \"series\": \"vlog\"},\n  {\"title\": \"Video Title 2\", \"duration\": \"03:20\", \"views\": \"1.2M\", \"date\": \"3 days ago\", \"series\": \"behind\"}\n]\n";
    try {
      const chatCompletionsEndpoint_718 = window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint),
        value_719 = await fetch(chatCompletionsEndpoint_718, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.apiConfig.apiKey
          },
          body: JSON.stringify({
            model: window.apiConfig.model || "gpt-3.5-turbo",
            messages: [{
              role: "system",
              content: "You are a JSON generator."
            }, {
              role: "user",
              content: content_11
            }],
            temperature: 0.7
          })
        });
      if (!value_719.ok) throw window.u2Api?.createHttpError?.(value_719, await window.u2Api?.readApiError?.(value_719)) || Object.assign(new Error("HTTP " + value_719.status), {
        status: value_719.status
      });
      const value_720 = await value_719.json();
      let content_721 = value_720.choices[0].message.content;
      content_721 = content_721.replace(/```json/g, "").replace(/```/g, "").trim();
      const result_722 = JSON.parse(content_721);
      Array.isArray(result_722) && (result_722.forEach(item_14 => {
        const title_5 = stripGeneratedText(item_14 && item_14.title, "New Video"),
          itemSeries = stripGeneratedText(item_14 && item_14.series, series_2 === "全部" ? requestType_2 || "vlog" : series_2);
        if (itemSeries && !team_14.contentSeries.includes(itemSeries)) team_14.contentSeries.push(itemSeries);
        team_14.videos.unshift({
          title: title_5,
          duration: stripGeneratedText(item_14 && item_14.duration, "10:05"),
          views: stripGeneratedText(item_14 && item_14.views, "500K"),
          date: stripGeneratedText(item_14 && item_14.date, "Just now"),
          thumb: handleAction_47((team_14.id || team_14.name) + "-content-" + title_5 + "-" + Date.now(), 800, 450),
          series: itemSeries
        });
      }), saveBstageData(), handleAction_89(team_14), window.showToast("已生成 " + result_722.length + " 个视频"));
    } catch (value_726) {
      console.error(value_726);
      if (!window.u2Api?.isRequestError?.(value_726) || !window.u2Api.reportError(value_726, {
        operation: "视频生成"
      })) window.showToast("生成失败");
    }
  }
  function handleAction_96(value_727) {
    contentArea.innerHTML = "\n            <div style=\"height: 100%; display: flex; justify-content: center; align-items: center; color: #666; background-color: #000;\">\n                " + value_727 + " 功能暂空\n            </div>\n        ";
  }
  function handleAction_97(activeEl) {
    const indicator = document.querySelector(".bstage-nav-indicator"),
      bstageBottomNavElement = document.querySelector(".bstage-bottom-nav");
    if (!indicator || !activeEl || !bstageBottomNavElement) return;
    const navRect = bstageBottomNavElement.getBoundingClientRect(),
      activeRect = activeEl.getBoundingClientRect(),
      offsetLeft = activeRect.left - navRect.left - 5;
    indicator.style.width = activeRect.width + "px";
    indicator.style.transform = "translateX(" + offsetLeft + "px)";
  }
  document.querySelectorAll(".bstage-nav-item").forEach(value_731 => {
    value_731.addEventListener("click", () => handleAction_84(value_731.dataset.tab));
  });
  function handleAction_98(value_732) {
    contentArea.innerHTML = "\n            <div style=\"height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #666; background-color: #000; gap: 20px;\">\n                <i class=\"fas fa-lock\" style=\"font-size: 40px; opacity: 0.5;\"></i>\n                <div>需要订阅会员才能查看 " + value_732 + "</div>\n                <div class=\"bstage-pop-sub-btn\" id=\"bstage-locked-sub-btn\" style=\"background-color: #007aff; color: #fff; padding: 10px 24px;\">去订阅</div>\n            </div>\n        ";
    document.getElementById("bstage-locked-sub-btn").addEventListener("click", openSubModal);
  }
  function openSubModal() {
    window.openView(subModal);
  }
  document.querySelectorAll(".bstage-price-option").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".bstage-price-option").forEach(o => {
        o.classList.remove("selected");
        o.style.borderColor = "#333";
      });
      opt.classList.add("selected");
      opt.style.borderColor = "#fff";
    });
  });
  document.getElementById("bstage-confirm-sub-btn").addEventListener("click", () => {
    if (currentTeam) {
      currentTeam.isSubscribed = true;
      const selectedOpt = subModal.querySelector(".bstage-price-option.selected"),
        title_6 = selectedOpt.querySelector(".bstage-price-title").textContent,
        price_2 = selectedOpt.querySelector(".bstage-price-amount").textContent;
      bstageOrders_2.unshift({
        id: Date.now(),
        title: currentTeam.name + " - " + title_6,
        price: price_2,
        date: new Date().toLocaleDateString(),
        type: "Membership"
      });
      window.showToast("订阅成功！您现在可以访问 Content 和 Shop。");
      document.querySelector(".bstage-nav-item[data-tab=\"home\"]").classList.contains("active") && handleAction_85(currentTeam);
    }
    window.closeView(subModal);
  });
  const profileBtn = bstageView.querySelector(".bstage-avatar-placeholder");
  profileBtn.addEventListener("click", () => {
    const textContent_7 = window.userState ? window.userState.name : "User",
      src_5 = window.userState ? window.userState.avatarUrl : null;
    document.getElementById("bstage-profile-name-display").textContent = textContent_7;
    const avatarDisplay_2 = document.getElementById("bstage-profile-avatar-display"),
      avatarIcon = document.getElementById("bstage-profile-avatar-icon");
    src_5 ? (avatarDisplay_2.src = src_5, avatarDisplay_2.style.display = "block", avatarIcon.style.display = "none") : (avatarDisplay_2.style.display = "none", avatarIcon.style.display = "block");
    updateBstageProfileStats();
    window.openView(userProfileModal);
  });
  document.getElementById("bstage-edit-profile-btn").addEventListener("click", () => {
    const value_9 = window.userState ? window.userState.name : "",
      src_6 = window.userState ? window.userState.avatarUrl : "",
      value_14 = window.userState && window.userState.persona ? window.userState.persona : "";
    document.getElementById("bstage-edit-profile-name").value = value_9;
    const bstageEditProfilePersonaElement = document.getElementById("bstage-edit-profile-persona");
    if (bstageEditProfilePersonaElement) bstageEditProfilePersonaElement.value = value_14;
    const bstageEditProfileAvatarPreviewElement = document.getElementById("bstage-edit-profile-avatar-preview"),
      uploadIcon = document.querySelector("#bstage-edit-profile-avatar-upload i");
    src_6 ? (bstageEditProfileAvatarPreviewElement.src = src_6, bstageEditProfileAvatarPreviewElement.style.display = "block", uploadIcon.style.display = "none") : (bstageEditProfileAvatarPreviewElement.src = "", bstageEditProfileAvatarPreviewElement.style.display = "none", uploadIcon.style.display = "block");
    window.openView(editProfileModal);
  });
  setupFileUpload("bstage-edit-profile-avatar-upload", "input", "bstage-edit-profile-avatar-preview");
  document.querySelector("#bstage-edit-profile-avatar-upload input").addEventListener("change", event_740 => {
    event_740.target.files && event_740.target.files[0] && (document.querySelector("#bstage-edit-profile-avatar-upload i").style.display = "none");
  });
  document.getElementById("bstage-save-profile-btn").addEventListener("click", () => {
    const value_741 = document.getElementById("bstage-edit-profile-name").value,
      src_742 = document.getElementById("bstage-edit-profile-avatar-preview").src,
      hasAvatar_4 = document.getElementById("bstage-edit-profile-avatar-preview").style.display !== "none",
      bstageEditProfilePersonaElement_744 = document.getElementById("bstage-edit-profile-persona"),
      persona_2 = bstageEditProfilePersonaElement_744 ? bstageEditProfilePersonaElement_744.value : "";
    if (window.userState) {
      window.userState.name = value_741;
      if (hasAvatar_4) window.userState.avatarUrl = src_742;
      window.userState.persona = persona_2;
      if (window.syncUIs) window.syncUIs();
      if (window.saveGlobalData) window.saveGlobalData();
      document.getElementById("bstage-profile-name-display").textContent = value_741;
      hasAvatar_4 && (document.getElementById("bstage-profile-avatar-display").src = src_742, document.getElementById("bstage-profile-avatar-display").style.display = "block", document.getElementById("bstage-profile-avatar-icon").style.display = "none");
      handleAction_73();
      isUserTeam_2(currentTeam) && (currentTeam = getBstageUserTeam());
    }
    window.closeView(editProfileModal);
    window.showToast("资料已更新");
  });
  document.getElementById("bstage-my-orders-btn").addEventListener("click", () => {
    renderOrders();
    window.openView(ordersModal);
  });
  function withdrawBstageRevenueToPay() {
    const amount = Number(getBstageAvailableRevenueCny().toFixed(2));
    if (!Number.isFinite(amount) || amount <= 0) {
      window.showToast("暂无可提现收益");
      updateBstageProfileStats();
      return;
    }
    if (typeof window.addPayTransaction !== "function") {
      window.showToast("Pay 暂不可用，请稍后重试");
      return;
    }
    const success = window.addPayTransaction(amount, "b.stage POP 订阅收益", "income");
    if (!success) {
      window.showToast("提现失败，请稍后重试");
      return;
    }
    bstageRevenueState_2.withdrawnCny = getBstageWithdrawnRevenueCny() + amount;
    bstageRevenueState_2.lastWithdrawAt = Date.now();
    saveBstageData();
    updateBstageProfileStats();
  }
  document.getElementById("bstage-withdraw-revenue-btn").addEventListener("click", withdrawBstageRevenueToPay);
  ordersModal.addEventListener("click", e_26 => {
    if (e_26.target === ordersModal) window.closeView(ordersModal);
  });
  function renderOrders() {
    const container_9 = document.getElementById("bstage-orders-list");
    container_9.innerHTML = "";
    if (bstageOrders_2.length === 0) {
      container_9.innerHTML = "<div style=\"text-align: center; color: #888; padding: 20px;\">暂无订单记录</div>";
      return;
    }
    bstageOrders_2.forEach(value_747 => {
      const item_15 = document.createElement("div");
      item_15.style.cssText = "background: #2c2c2e; padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;";
      item_15.innerHTML = "\n                <div>\n                    <div style=\"font-weight: 600; color: #fff; font-size: 15px;\">" + value_747.title + "</div>\n                    <div style=\"font-size: 12px; color: #aaa; margin-top: 4px;\">" + value_747.date + " • " + value_747.type + "</div>\n                </div>\n                <div style=\"font-weight: 700; color: #fff;\">" + value_747.price + "</div>\n            ";
      container_9.appendChild(item_15);
    });
  }
  const fallbackFanNames = ["Starry", "Mina", "Joon", "Luna", "BlueFan", "Ari", "Momo", "Nabi", "Echo", "Summer"];
  function getCurrentChatTimeText(timestamp_3 = Date.now()) {
    if (typeof window.formatChatBubbleTime === "function") return window.formatChatBubbleTime(timestamp_3);
    const value_750 = new Date(timestamp_3);
    return value_750.getHours() + ":" + value_750.getMinutes().toString().padStart(2, "0");
  }
  function handleAction_102(value_751 = 0) {
    return fallbackFanNames[Math.floor(Math.random() * fallbackFanNames.length)] || "Fan" + (value_751 + 1);
  }
  function handleAction_103(value_752) {
    const value_10 = String(value_752 || ""),
      hasChinese = /[\u3400-\u9fff]/.test(value_10),
      hasForeignScript = /[A-Za-z\u3040-\u30ff\uac00-\ud7af\u0400-\u04ff]/.test(value_10);
    return hasForeignScript && !hasChinese;
  }
  function normalizeBstageSubscriberCount(value_11) {
    const numeric = parseInt(value_11, 10);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(BSTAGE_MAX_SUBSCRIBERS, numeric));
  }
  function getFanSubscriberCount() {
    return (bstageFanSubscriberCount_2 == null || !Number.isFinite(Number(bstageFanSubscriberCount_2))) && (bstageFanSubscriberCount_2 = Math.floor(800 + Math.random() * 9200), saveBstageData()), bstageFanSubscriberCount_2 = normalizeBstageSubscriberCount(bstageFanSubscriberCount_2), bstageFanSubscriberCount_2;
  }
  function formatBstageSubscriberCount(value_757) {
    const count_4 = normalizeBstageSubscriberCount(value_757);
    if (count_4 >= 1000000) {
      const millions = Math.floor(count_4 / 10000) / 100;
      return millions + "M";
    }
    if (count_4 >= 1000) {
      const thousands = Math.floor(count_4 / 100) / 10;
      return thousands + "K";
    }
    return String(count_4);
  }
  function handleAction_105() {
    return "已订阅 " + formatBstageSubscriberCount(getFanSubscriberCount()) + " 人";
  }
  function getBstageTotalRevenueCny() {
    return getFanSubscriberCount() * BSTAGE_POP_MONTHLY_KRW * BSTAGE_KRW_TO_CNY;
  }
  function getBstageWithdrawnRevenueCny() {
    const value_12 = Number(bstageRevenueState_2 && bstageRevenueState_2.withdrawnCny);
    return Number.isFinite(value_12) ? Math.max(0, value_12) : 0;
  }
  function getBstageAvailableRevenueCny() {
    return Math.max(0, getBstageTotalRevenueCny() - getBstageWithdrawnRevenueCny());
  }
  function handleAction_106(value_13) {
    return "￥" + Math.max(0, Number(value_13) || 0).toFixed(2);
  }
  function updateBstageProfileStats() {
    const subCountEl = document.getElementById("bstage-profile-pop-sub-count"),
      revenueEl = document.getElementById("bstage-profile-sub-revenue"),
      withdrawBtn = document.getElementById("bstage-withdraw-revenue-btn"),
      fanSubscriberCount = getFanSubscriberCount(),
      available = getBstageAvailableRevenueCny();
    if (subCountEl) subCountEl.textContent = formatBstageSubscriberCount(fanSubscriberCount);
    if (revenueEl) revenueEl.textContent = handleAction_106(available);
    withdrawBtn && (withdrawBtn.style.opacity = available > 0 ? "1" : "0.55", withdrawBtn.setAttribute("aria-disabled", available > 0 ? "false" : "true"), withdrawBtn.title = available > 0 ? "可提现 " + handleAction_106(available) : "暂无可提现收益");
  }
  function getFanSubscriberGrowthDelta(value_763 = false) {
    if (value_763) return 1 + Math.floor(Math.random() * 5);
    const weightedDeltas = [0, 0, 1, 1, 2];
    return weightedDeltas[Math.floor(Math.random() * weightedDeltas.length)] || 0;
  }
  function growFanSubscriberCount(burst = false) {
    const currentCount = getFanSubscriberCount();
    if (currentCount >= BSTAGE_MAX_SUBSCRIBERS) {
      updateFanSubscriberLabels();
      return;
    }
    const delta = getFanSubscriberGrowthDelta(burst);
    if (delta <= 0) {
      updateFanSubscriberLabels();
      return;
    }
    bstageFanSubscriberCount_2 = normalizeBstageSubscriberCount(currentCount + delta);
    updateFanSubscriberLabels();
    saveBstageData();
  }
  function randomizeFanSubscriberCount() {
    growFanSubscriberCount(true);
  }
  function scheduleFanSubscriberGrowth() {
    bstageFanSubscriberGrowthTimer && clearTimeout(bstageFanSubscriberGrowthTimer);
    bstageFanSubscriberGrowthTimer = null;
    if (getFanSubscriberCount() >= BSTAGE_MAX_SUBSCRIBERS) return;
    const delay_4 = 30000 + Math.floor(Math.random() * 60000);
    bstageFanSubscriberGrowthTimer = setTimeout(() => {
      growFanSubscriberCount(false);
      scheduleFanSubscriberGrowth();
    }, delay_4);
  }
  function handleAction_107() {
    getFanSubscriberCount();
    updateFanSubscriberLabels();
    !bstageFanSubscriberGrowthTimer && scheduleFanSubscriberGrowth();
  }
  function updateFanSubscriberLabels() {
    const textContent_8 = handleAction_105(),
      subtitle = document.getElementById("bstage-fan-chat-subtitle"),
      detailSubscribers = document.getElementById("bstage-fan-detail-subscribers");
    if (subtitle) subtitle.textContent = textContent_8;
    if (detailSubscribers) detailSubscribers.textContent = textContent_8;
    document.querySelectorAll(".bstage-fan-subscriber-label").forEach(el_4 => {
      el_4.textContent = textContent_8;
    });
    updateBstageProfileStats();
  }
  function syncFanChatTranslationState() {
    const content_6 = document.getElementById("bstage-fan-chat-content");
    if (!content_6) return;
    content_6.classList.toggle("show-trans", isTranslationEnabled_2);
  }
  function applyFanChatSettings() {
    const fanView = document.getElementById("bstage-fan-chat-view");
    fanView && (bstageFanChatSettings_2.chatBg ? (fanView.style.backgroundImage = "url('" + bstageFanChatSettings_2.chatBg + "')", fanView.style.backgroundSize = "cover", fanView.style.backgroundPosition = "center") : (fanView.style.backgroundImage = "none", fanView.style.backgroundColor = "#1c1c1e"));
    applyDynamicStyles();
    syncFanChatTranslationState();
  }
  function openFanChatDetailSheet() {
    updateFanSubscriberLabels();
    handleAction_65();
    applyFanChatSettings();
    const value_769 = window.userState && window.userState.name ? window.userState.name : "User",
      src_7 = window.userState && window.userState.avatarUrl ? window.userState.avatarUrl : "",
      detailName = document.getElementById("bstage-fan-detail-name"),
      bstageFanDetailAvatarElement = document.getElementById("bstage-fan-detail-avatar"),
      avatarIcon_2 = document.getElementById("bstage-fan-detail-avatar-icon");
    if (detailName) detailName.textContent = value_769 + " 的粉丝聊天室";
    bstageFanDetailAvatarElement && avatarIcon_2 && (src_7 ? (bstageFanDetailAvatarElement.src = src_7, bstageFanDetailAvatarElement.style.display = "block", avatarIcon_2.style.display = "none") : (bstageFanDetailAvatarElement.src = "", bstageFanDetailAvatarElement.style.display = "none", avatarIcon_2.style.display = "block"));
    const bstageFanContextSwitchElement_771 = document.getElementById("bstage-fan-context-switch"),
      bstageFanContextCountElement = document.getElementById("bstage-fan-context-count"),
      bstageFanTransSwitchElement_772 = document.getElementById("bstage-fan-trans-switch");
    if (bstageFanContextSwitchElement_771) bstageFanContextSwitchElement_771.classList.toggle("active", isContextEnabled_2);
    if (bstageFanContextCountElement) bstageFanContextCountElement.value = contextMessageCount_2;
    if (bstageFanTransSwitchElement_772) bstageFanTransSwitchElement_772.classList.toggle("active", isTranslationEnabled_2);
    window.openView(fanChatDetailSheet);
  }
  function handleAction_108() {
    const userTeam_2 = getBstageUserTeam(),
      items_774 = Array.isArray(userTeam_2.members) ? userTeam_2.members : [],
      videos_2 = Array.isArray(userTeam_2.videos) ? userTeam_2.videos.slice(0, 8) : [],
      items_2 = Array.isArray(userTeam_2.shopItems) ? userTeam_2.shopItems.slice(0, 8) : [],
      value_777 = items_774.length ? items_774.map(message_780 => "- " + (message_780.name || "未命名成员") + "：" + (message_780.role || "暂无人设")).join("\n") : "暂无团队成员。",
      value_778 = videos_2.length ? videos_2.map(value_781 => "- " + (value_781.title || "未命名视频") + (value_781.description ? "：" + value_781.description : "")).join("\n") : "暂无视频物料。",
      value_779 = items_2.length ? items_2.map(value_782 => "- " + (value_782.name || "未命名商品") + "（" + (value_782.category || "商品") + "，" + (value_782.price || "未定价") + "）" + (value_782.desc ? "：" + value_782.desc : "")).join("\n") : "暂无周边商品。";
    return "User 团队资料：\n团队名：" + (userTeam_2.name || "User") + "\n团队简介：" + (userTeam_2.desc || "无") + "\n\nUser 团队成员：\n" + value_777 + "\n\nUser 团队 Content 视频物料：\n" + value_778 + "\n\nUser 团队 Shop 周边商品：\n" + value_779;
  }
  function handleAction_109(value_783, timestamp_6) {
    let lastMsg_2 = null;
    for (let i_5 = bstageFanChatHistory_2.length - 1; i_5 >= 0; i_5--) {
      if (bstageFanChatHistory_2[i_5].type !== "date") {
        lastMsg_2 = bstageFanChatHistory_2[i_5];
        break;
      }
    }
    const count_786 = 300000;
    if (!lastMsg_2 || !lastMsg_2.timestamp || timestamp_6 - lastMsg_2.timestamp > count_786) {
      const text_12 = handleAction_40(timestamp_6),
        options_789 = {
          type: "date",
          text: text_12,
          timestamp: timestamp_6
        };
      bstageFanChatHistory_2.push(options_789);
      if (value_783) appendFanChatMessage(options_789, value_783);
    }
  }
  function appendFanChatMessage(msg_16, element_791) {
    if (!element_791 || !msg_16) return;
    if (msg_16.type === "date") {
      const element_795 = document.createElement("div");
      element_795.className = "bstage-chat-date";
      element_795.textContent = msg_16.text;
      element_791.appendChild(element_795);
      return;
    }
    ensureMessageId(msg_16, msg_16.isUser ? "user" : "fan");
    if (msg_16.isUser) {
      const element_796 = document.createElement("div");
      element_796.className = "bstage-chat-msg outgoing";
      element_796.dataset.msgId = msg_16.id;
      element_796.innerHTML = "\n                <div class=\"bstage-msg-status\">\n                    <div class=\"bstage-msg-status-text\">已发送</div>\n                    <div class=\"bstage-msg-time\">" + escapeHtml(msg_16.time || getCurrentChatTimeText(msg_16.timestamp)) + "</div>\n                </div>\n                <div class=\"bstage-chat-bubble\">\n                    " + formatReplyForPrompt_2(msg_16.replyTo) + "\n                    <div class=\"bstage-msg-text\">" + escapeHtml(msg_16.text) + "</div>\n                </div>\n            ";
      element_791.appendChild(element_796);
      return;
    }
    const fanName = stripGeneratedText(msg_16.name, "粉丝");
    msg_16.avatarEmoji = msg_16.avatarEmoji || getStableEmojiAvatar("bstage-fan-" + fanName + "-" + (msg_16.id || msg_16.timestamp || ""));
    const transText = stripGeneratedText(msg_16.trans),
      element_793 = document.createElement("div");
    element_793.className = "bstage-chat-msg income";
    element_793.dataset.msgId = msg_16.id;
    element_793.innerHTML = "\n            " + renderBstageAvatar(msg_16, fanName, "bstage-chat-avatar") + "\n            <div class=\"bstage-chat-bubble\">\n                " + formatReplyForPrompt_2(msg_16.replyTo) + "\n                <div class=\"bstage-fan-chat-sender\">" + escapeHtml(fanName) + "</div>\n                <div class=\"bstage-msg-text\">" + escapeHtml(msg_16.text) + "</div>\n                " + (transText ? "<div class=\"bstage-trans-text\">" + escapeHtml(transText) + "</div>" : "") + "\n            </div>\n            <button class=\"bstage-msg-reply-btn\" type=\"button\" aria-label=\"回复消息\" title=\"回复消息\">\n                <i class=\"fas fa-reply\"></i>\n            </button>\n        ";
    const replyBtn_2 = element_793.querySelector(".bstage-msg-reply-btn");
    replyBtn_2 && replyBtn_2.addEventListener("click", e_27 => {
      e_27.stopPropagation();
      setPendingReply("fan", createReplyMeta(msg_16, fanName));
    });
    element_791.appendChild(element_793);
  }
  function renderFanChatHistory() {
    const content_7 = document.getElementById("bstage-fan-chat-content");
    if (!content_7) return;
    content_7.innerHTML = "";
    syncFanChatTranslationState();
    if (!Array.isArray(bstageFanChatHistory_2)) bstageFanChatHistory_2 = [];
    bstageFanChatHistory_2.length === 0 ? content_7.innerHTML = "<div class=\"bstage-system-notice\">粉丝聊天室已开启</div>" : bstageFanChatHistory_2.forEach(msg_17 => appendFanChatMessage(msg_17, content_7));
    updateFanSubscriberLabels();
    setTimeout(() => {
      content_7.scrollTop = content_7.scrollHeight;
    }, 50);
  }
  function openFanChat() {
    applyFanChatSettings();
    renderFanChatHistory();
    clearPendingReply("fan");
    window.openView(bstageFanChatView);
    const input_5 = document.getElementById("bstage-fan-chat-input");
    setTimeout(() => {
      if (input_5) input_5.focus({
        preventScroll: true
      });
    }, 80);
  }
  function sendFanChatMessage() {
    const bstageFanChatInputElement_800 = document.getElementById("bstage-fan-chat-input"),
      bstageFanChatContentElement_801 = document.getElementById("bstage-fan-chat-content");
    if (!bstageFanChatInputElement_800 || !bstageFanChatContentElement_801) return;
    const text_9 = bstageFanChatInputElement_800.value.trim();
    if (!text_9) return;
    bstageFanChatContentElement_801.querySelector(".bstage-system-notice") && bstageFanChatHistory_2.length === 0 && (bstageFanChatContentElement_801.innerHTML = "");
    const timestamp_4 = Date.now();
    handleAction_109(bstageFanChatContentElement_801, timestamp_4);
    const msg_18 = {
      id: createBstageMessageId("user"),
      isUser: true,
      type: "text",
      text: text_9,
      time: getCurrentChatTimeText(timestamp_4),
      timestamp: timestamp_4,
      replyTo: pendingFanReply ? {
        ...pendingFanReply
      } : null
    };
    bstageFanChatHistory_2.push(msg_18);
    appendFanChatMessage(msg_18, bstageFanChatContentElement_801);
    saveBstageData();
    bstageFanChatInputElement_800.value = "";
    clearPendingReply("fan");
    bstageFanChatContentElement_801.scrollTop = bstageFanChatContentElement_801.scrollHeight;
  }
  async function handleAction_111() {
    const apiBtn_2 = document.getElementById("bstage-fan-chat-api-btn"),
      bstageFanChatInputElement_806 = document.getElementById("bstage-fan-chat-input"),
      content_8 = document.getElementById("bstage-fan-chat-content");
    if (!content_8 || !apiBtn_2 || apiBtn_2.classList.contains("is-loading")) return;
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
      window.showToast("请先在系统设置中配置 API");
      return;
    }
    const userName = window.userState && window.userState.name ? window.userState.name : "User",
      value_809 = window.userState && window.userState.persona ? window.userState.persona : "",
      value_810 = currentTeam ? "当前 b.stage 团队：" + currentTeam.name + "\n团队信息：" + (currentTeam.desc || "无") : "当前没有选中的 b.stage 团队。",
      handleAction_108_811 = handleAction_108(),
      fetchCount_2 = isContextEnabled_2 ? contextMessageCount_2 : 1;
    bstageFanChatHistory_2.forEach(msg_19 => {
      if (msg_19 && msg_19.type !== "date") ensureMessageId(msg_19, msg_19.isUser ? "user" : "fan");
    });
    const userMessages = bstageFanChatHistory_2.filter(msg_20 => msg_20 && msg_20.type === "text" && msg_20.isUser && msg_20.text).slice(-fetchCount_2),
      history_3 = userMessages.length ? userMessages.map(msg_21 => formatMessageForPrompt(msg_21, userName)).join("\n") : "暂无 User 发言。",
      validUserReplyIds_2 = userMessages.map(msg_22 => msg_22.id).filter(Boolean),
      value_816 = window.getGlobalWorldBookContextByPosition ? window.getGlobalWorldBookContextByPosition("system_depth") : "",
      value_817 = window.getGlobalWorldBookContextByPosition ? window.getGlobalWorldBookContextByPosition("before_role") : "",
      value_818 = window.getGlobalWorldBookContextByPosition ? window.getGlobalWorldBookContextByPosition("after_role") : "",
      value_819 = new Date(),
      items_820 = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      value_821 = value_819.getFullYear() + "年" + (value_819.getMonth() + 1) + "月" + value_819.getDate() + "日 " + items_820[value_819.getDay()] + " " + value_819.getHours() + ":" + String(value_819.getMinutes()).padStart(2, "0"),
      prompt_4 = "\n" + (value_816 ? "System Depth Rules:\n" + value_816 + "\n\n" : "") + (value_817 ? "Before Role Rules:\n" + value_817 + "\n\n" : "") + "你正在模拟 b.stage 的粉丝聊天室。b.stage 是国际化粉丝互动应用。\n\n当前账号 / User：" + userName + "\nUser 的人设：" + (value_809 || "未填写") + "\n" + value_810 + "\n" + handleAction_108_811 + "\n当前真实时间：" + value_821 + "\n" + (value_818 ? "\nAfter Role Rules:\n" + value_818 + "\n" : "") + "\n\n上下文只包含 User 自己发过的消息，不包含任何粉丝历史消息。每条都有 id，replyTo 表示 User 正在引用/翻牌某条粉丝消息：\n" + history_3 + "\n\n要求：\n1. 你现在扮演的是 " + userName + " 的粉丝或订阅者群体，不是 " + userName + " 本人，也不是单一角色。\n2. 这不是真正的群聊：每个粉丝从自己的视角像是在和 " + userName + " 单聊；只有 " + userName + " 的界面把很多粉丝消息汇总成聊天室。\n3. 如果 User 的某条消息带有 replyTo，说明 User 翻牌/回复了某位粉丝；其他粉丝可能猜测被翻牌的是谁、羡慕、起哄、提出翻牌请求，但不要写成所有粉丝都知道完整群聊上下文。\n4. 一次生成不少于 10 条、最多 14 条来自不同粉丝/订阅者的实时聊天室消息。\n5. 消息要像真实国际化粉丝互动：可以应援、闲聊、提问、刷屏、玩梗、跨语言互动，不要每条都机械回复 User 上一句话。\n6. 可以自然评价 User 的视频物料、讨论已上架周边、期待新物料或询问下一次更新。\n7. 粉丝知道 User 团队的名字、简介和成员，可以自然询问 " + userName + " 本人的近况、和其他队友的关系/合作/互动，也可以向 " + userName + " 提到或追问别的队友。\n8. 可以使用中文、英文、韩文、日文或其他符合语境的语言；如果 text 不是纯中文，必须在 trans 中提供自然中文翻译。text 是中文时 trans 为空字符串。\n9. 你可以回复某条 User 消息；如需回复，请在该对象中填写 replyToId，值只能从这些 User 消息 id 中选择：" + (validUserReplyIds_2.length ? validUserReplyIds_2.join(", ") : "无") + "。不回复则省略或填空。\n10. 返回严格 JSON 数组，不要 markdown，不要解释，不要外层对象。\n11. 每条必须包含 name、text、trans。\n\n格式：\n[\n  { \"name\": \"粉丝昵称\", \"text\": \"原文消息\", \"trans\": \"非中文消息的中文翻译，中文消息则为空字符串\", \"replyToId\": \"可选的 User 消息 id\" }\n]\n";
    setChatActionLoading(apiBtn_2, true);
    const readOnly_4 = !!bstageFanChatInputElement_806?.readOnly;
    bstageFanChatInputElement_806 && (bstageFanChatInputElement_806.readOnly = true, bstageFanChatInputElement_806.setAttribute("aria-busy", "true"));
    try {
      const generated_2 = await callBstageJsonApi(prompt_4, "You generate strict JSON arrays for live fan chat messages.", 0.85);
      if (!Array.isArray(generated_2)) throw new Error("invalid_fan_chat_payload");
      const now_829 = Date.now(),
        messages_3 = generated_2.slice(0, 14).map((item_16, value_832) => {
          const name_13 = stripGeneratedText(item_16 && item_16.name, handleAction_102(value_832)),
            text_13 = stripGeneratedText(typeof item_16 === "string" ? item_16 : item_16 && item_16.text),
            trans_6 = stripGeneratedText(item_16 && (item_16.trans || item_16.translationZh || item_16.translation)),
            replyToId_2 = stripGeneratedText(item_16 && (item_16.replyToId || item_16.reply_to_id)),
            replySource = findMessageById(bstageFanChatHistory_2, replyToId_2, msg_23 => msg_23 && msg_23.isUser);
          if (!text_13) return null;
          if (handleAction_103(text_13) && !trans_6) return null;
          return {
            id: createBstageMessageId("fan"),
            isUser: false,
            type: "text",
            name: name_13,
            avatar: null,
            avatarEmoji: getStableEmojiAvatar("bstage-fan-" + name_13 + "-" + value_832),
            text: text_13,
            trans: trans_6,
            timestamp: now_829 + value_832,
            replyTo: replySource ? createReplyMeta(replySource, userName) : null
          };
        }).filter(Boolean);
      if (messages_3.length < 10) throw new Error("too_few_fan_chat_payload");
      content_8.querySelector(".bstage-system-notice") && bstageFanChatHistory_2.length === 0 && (content_8.innerHTML = "");
      handleAction_109(content_8, now_829);
      randomizeFanSubscriberCount();
      messages_3.forEach((msg_24, index_3) => {
        setTimeout(() => {
          bstageFanChatHistory_2.push(msg_24);
          appendFanChatMessage(msg_24, content_8);
          updateFanSubscriberLabels();
          saveBstageData();
          content_8.scrollTop = content_8.scrollHeight;
        }, index_3 * 650);
      });
    } catch (error_5) {
      console.error("Bstage fan chat API failed:", error_5);
      if (!window.u2Api?.isRequestError?.(error_5) || !window.u2Api.reportError(error_5, {
        operation: "粉丝消息生成"
      })) window.showToast(error_5 && error_5.message === "missing_api_config" ? "请先在系统设置中配置 API" : "生成粉丝消息失败");
    } finally {
      bstageFanChatInputElement_806 && (bstageFanChatInputElement_806.readOnly = readOnly_4, bstageFanChatInputElement_806.removeAttribute("aria-busy"));
      setChatActionLoading(apiBtn_2, false);
    }
  }
  const fanChatInput = document.getElementById("bstage-fan-chat-input"),
    fanChatSendBtn = document.getElementById("bstage-fan-chat-send-btn"),
    bstageFanChatApiBtnElement = document.getElementById("bstage-fan-chat-api-btn");
  fanChatInput && registerBstageSendInput(fanChatInput, sendFanChatMessage, {
    root: bstageFanChatView,
    scrollContainer: document.getElementById("bstage-fan-chat-content")
  });
  fanChatSendBtn && bindBstageFocusPreservingAction(fanChatSendBtn, sendFanChatMessage);
  bstageFanChatApiBtnElement && bindBstageFocusPreservingAction(bstageFanChatApiBtnElement, handleAction_111);
  const chatRoomBtn = document.getElementById("bstage-my-chatroom-btn");
  chatRoomBtn && chatRoomBtn.addEventListener("click", () => {
    window.closeView(userProfileModal);
    openFanChat();
  });
  function updateHeaderAvatar() {
    const container_10 = document.getElementById("bstage-header-profile-container");
    if (!container_10) return;
    const value_842 = window.userState ? window.userState.avatarUrl : null;
    value_842 ? (container_10.innerHTML = "<img src=\"" + value_842 + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">", container_10.style.overflow = "hidden", container_10.style.border = "none") : (container_10.innerHTML = "<i class=\"fas fa-user\"></i>", container_10.style.overflow = "", container_10.style.border = "");
  }
  updateHeaderAvatar();
  const originalSaveProfile = document.getElementById("bstage-save-profile-btn").onclick;
  document.getElementById("bstage-save-profile-btn").addEventListener("click", () => {
    setTimeout(updateHeaderAvatar, 50);
  });
  function handleAction_113() {
    const userTeam_3 = getBstageUserTeam(),
      getMemberChatHistoryCounts = members_2 => Array.isArray(members_2) ? members_2.map(member_12 => Array.isArray(member_12?.chatHistory) ? member_12.chatHistory.length : 0) : [];
    return JSON.stringify({
      updatedAt: count_27,
      teams: teams_2.map(team_15 => team_15 && team_15.id),
      teamMemberCounts: teams_2.map(team_16 => Array.isArray(team_16 && team_16.members) ? team_16.members.length : 0),
      teamChatHistoryCounts: teams_2.map(team_17 => getMemberChatHistoryCounts(team_17?.members)),
      userTeamMembers: Array.isArray(userTeam_3.members) ? userTeam_3.members.length : 0,
      userTeamChatHistoryCounts: getMemberChatHistoryCounts(userTeam_3.members),
      fanHistoryCount: Array.isArray(bstageFanChatHistory_2) ? bstageFanChatHistory_2.length : 0
    });
  }
  function handleAction_114() {
    handleAction_73();
    setTimeout(() => {
      const currentTeamId = currentTeam && currentTeam.id,
        nextTeam = currentTeamId && !isUserTeam_2(currentTeam) ? teams_2.find(team_18 => String(team_18.id) === String(currentTeamId)) || getBstageUserTeam() : getBstageUserTeam();
      handleAction_74(nextTeam);
    }, 50);
  }
  handleAction_114();
  if (window.globalDataReadyPromise && typeof window.globalDataReadyPromise.then === "function") {
    const handleAction_113_851 = handleAction_113();
    window.bstageDataReadyPromise = window.globalDataReadyPromise.then(async () => {
      const normalized_2 = loadBstageData({
        persistNormalized: true
      });
      handleAction_82();
      bstageHydrationComplete = true;
      if (normalized_2) await saveBstageData({
        flush: true
      });
      const chatWasOpen = !!currentChatMember && bstageChatView.style.display !== "none",
        chatRebound = handleAction_45();
      handleAction_107();
      handleAction_63();
      const handleAction_113_855 = handleAction_113();
      handleAction_113_855 !== handleAction_113_851 && handleAction_114();
      if (chatWasOpen && chatRebound) openChat(currentChatMember);
      return true;
    })["catch"](error_6 => {
      return console.warn("Bstage global data recovery failed:", error_6), bstageHydrationComplete = true, handleAction_107(), handleAction_63(), false;
    });
  } else {
    bstageHydrationComplete = true;
    handleAction_107();
    handleAction_63();
    window.bstageDataReadyPromise = Promise.resolve(true);
  }
});
