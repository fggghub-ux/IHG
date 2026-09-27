# 新版功能定位

| 模块 / 更新方向 | 最新代码位置 |
| --- | --- |
| App Store / 自定义 App | `js/appstore.js`、`js/custom_app_runtime.js`、`js/custom_app_template_source.js`、`css/appstore.css`、`templates/u2-custom-app-template.html` |
| Gallery / 角色相册 | `js/gallery.js`、`js/gallery_data.js`、`css/gallery.css` |
| Diary | `js/diary.js`、`css/diary.css` |
| Call / 匿名短信 | `js/call.js`、`css/call.css`、`css/call_optimizations.css` |
| Cphone 独立查手机 | `js/cphone.js`、`css/cphone.css`；`js/loves.js` 与 `css/loves.css` 仍独立保留 |
| 反查用户手机 | `js/imessage/user_phone_access_ui.js`、`css/imessage_user_phone_access.css`，及联系人、聊天和 Cphone 代码中的调用 |
| MCP | `js/mcp.js`、`js/mcp_relay_config.js`、`js/imessage/mcp_integration.js`、`js/imessage/mcp_chat_config.js`、`js/vendor/mcp_client_sdk.js`、`css/mcp.css` |
| AO3 / 同人文 | `js/ao3.js`、`css/ao3.css` |
| 创作助手 / 公众号 | `js/imessage/official_accounts.js` |
| 线上提示词及预设 | `js/imessage/online_prompts.js`、`js/imessage/online_prompt_settings.js`、`css/online_prompts.css` |
| 线上单聊 / 群聊 / 搜索 / 名片 / 拉黑 / 定位 / 赠送亲属卡等 | `js/imessage/2_core.js`、`3_contacts.js`、`3_groups.js`、`4_chat_ai.js`、`4_chat_main.js`、`4_chat_bubbles.js`、`4_chat_payment.js`、`chat_search.js` 等；这些更新跨文件协作 |
| 线下 / 总结 / 番外 / 正则 | `js/imessage/4_chat_sheet.js`、`offline_reasoning.js`、`offline_regex.js`、`offline_summary_errors.js` |
| 朋友圈 | `js/imessage/6_moments.js` 和最新版 `index.html` |
| Library / 音乐 / 阅读 / 一起听 | `js/library.js`、`js/library_book_worker.js`、`css/library.css` |
| 桌面拖动 / 新小组件 | `js/home_desktop.js`、`js/home_widget_panel_enhance.js`、`css/home.css` |
| Bstage 与聊天交互 | `js/bstage.js` 及 `js/imessage/` 中的对应调用 |
| 数据备份 / 数据管理 | `js/settings.js`、`js/export_file.js`、`js/storage/`、`storage.js` |
| 消息通知 / 输入兼容 | `js/system_notifications.js`、`notification-sw.js`、`js/mobile_input_compat.js` |
| 原生与 Web 兼容桥 | `js/vendor/native_bridge.js`，保留入口加载关系 |

新增 App 继续使用与旧仓库一致的 `js/<app>.js`、`css/<app>.css` 风格。没有为了制造新目录而把最新版模块强行拆散或合回旧版 Loves。
