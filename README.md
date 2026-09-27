## 目录

- `index.html`：APK 最新的页面结构。
- `css/`：各 App 的最新样式；`style.css` 为根目录样式。
- `js/`：已反混淆、格式化并恢复部分命名的最新版功能代码。
- `js/imessage/`、`js/storage/`、`js/tiktok/`、`js/youtube/`：保留原来的模块划分。
- `assets/`：图片、字体和前端必要资源。
- `templates/`：App Store 使用的自定义 App 模板。
- `notification-sw.js`：网页版通知相关代码。
- `docs/`：恢复范围、来源清单和功能定位。
- `tools/`、`package.json`：为本次重建新写的本地启动与检查工具，不是找回的原构建配置。

保留了 APK 中的登录、激活、API 配置、服务地址与权限逻辑。实际联网功能仍依赖其原有服务与用户配置。本包不包含 Android 原生工程；原生存储、原生文件保存和系统通知等能力在普通网页中取决于代码已有的 Web 回退支持。

检查结论与边界见 [恢复说明](docs/recovery-notes.md)。按功能找文件可看 [功能定位](docs/feature-map.md)。
