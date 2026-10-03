(function () {
    const modal = document.getElementById('about-info-modal'),
        title_3 = document.getElementById('about-info-modal-title'),
        disclaimerContent = document.getElementById('about-disclaimer-content'),
        changelogContent = document.getElementById('about-changelog-content'),
        changelogListView = document.getElementById('about-changelog-list-view'),
        changelogDetailContent = document.getElementById('about-changelog-list'),
        aboutChangelogMonthTriggerElement = document.getElementById(
            'about-changelog-month-trigger',
        ),
        title_4 = document.getElementById('about-changelog-month-label'),
        changelogContent_2 = document.getElementById('about-changelog-month-picker'),
        changelogDetailContent_3 = document.getElementById('about-changelog-year-options'),
        changelogDetailContent_4 = document.getElementById('about-changelog-month-options'),
        changelogDetailView = document.getElementById('about-changelog-detail-view'),
        aboutChangelogDetailKickerElement = document.getElementById(
            'about-changelog-detail-kicker',
        ),
        changelogDetailDate = document.getElementById('about-changelog-detail-date'),
        changelogDetailContent_5 = document.getElementById('about-changelog-detail-tags'),
        changelogDetailContent_2 = document.getElementById('about-changelog-detail-content'),
        backButton = document.getElementById('about-info-modal-back'),
        closeButton = document.getElementById('about-info-modal-close'),
        confirmButton = document.getElementById('about-info-modal-confirm'),
        CHANGELOG_ENTRIES = [
            {
                id: '2026-09-28',
                year: '2026',
                shortDate: '9.28',
                fullDate: '2026年9月28日',
                sections: [
                    {
                        label: 'ONLINE',
                        title: '线上',
                        items: [
                            '新增 Char 给 User 修改备注，备注可在 CPhone 查看。',
                            '优化点击反馈，修复一些界面问题。',
                            '修复有兔助手生成无效美化的问题。',
                        ],
                    },
                    {
                        label: 'EXPERIENCE',
                        title: '整体体验',
                        items: ['优化整体点击反馈与性能。'],
                    },
                    {
                        label: 'ANDROID',
                        title: 'Android APK',
                        status: 'BETA',
                        items: ['针对部分 OPPO 机型优化顶部全屏兼容。'],
                    },
                    {
                        label: 'NETFLIX',
                        title: 'Netflix',
                        items: ['完善 Netflix。'],
                    },
                    {
                        label: 'LOVES',
                        title: 'Loves',
                        items: ['修复存钱按钮丢失的问题。'],
                    },
                ],
            },
            {
                id: '2026-09-24',
                year: '2026',
                shortDate: '9.24',
                fullDate: '2026年9月24日',
                sections: [
                    {
                        label: 'ONLINE',
                        title: '线上',
                        items: [
                            '优化点击反馈与性能，修复一些问题；朋友圈入口移到主页。',
                            '单独换美化与主题美化合并；反查手机移进 Char 设置。',
                            '新增 Char 邀请 U 一起听、给 Char 赠送亲属卡。',
                            '群聊新增搜索聊天记录；Bstage 与单聊互通。',
                        ],
                    },
                    {
                        label: 'OFFLINE',
                        title: '线下',
                        items: ['优化滑动流畅度。', '新增番外模式，开启后不注入线上记忆。'],
                    },
                    {
                        label: 'CHAR PHONE',
                        title: '查手机',
                        items: [
                            '查手机从 Loves 独立出来。',
                            '重构 Char 短信玩法；Char 与联系人的聊天和单聊互通记忆，可给 Char 建群。',
                        ],
                    },
                    {
                        label: 'BACKUP / NOTIFICATION',
                        title: '数据备份与消息通知',
                        items: ['数据备份新增轻量级备份。', '消息通知兼容 iOS 16.5 以下系统版本。'],
                    },
                    {
                        label: 'UI',
                        title: '操作与界面',
                        items: ['优化了一些手感操作，更新了一些 UI。'],
                    },
                ],
            },
            {
                id: '2026-09-20',
                year: '2026',
                shortDate: '9.20',
                fullDate: '2026年9月20日',
                sections: [
                    {
                        label: 'ONLINE',
                        title: '线上',
                        items: ['优化线上聊天点击反馈。', '修复非中文环境下无法修改翻译的问题。'],
                    },
                    {
                        label: 'API / NOTIFICATION',
                        title: 'API 与消息通知',
                        items: [
                            '优化 API 配置预设。',
                            '开启消息通知后默认关闭内置消息弹窗。',
                            '优化内置消息弹窗，支持上滑取消。',
                            '修复消息提示音不生效的问题。',
                        ],
                    },
                    {
                        label: 'ANDROID',
                        title: 'Android APK',
                        status: 'BETA',
                        items: ['修复 APK 初始化失败的问题。', '增加原生兼容。'],
                    },
                    {
                        label: 'LOVES',
                        title: 'Loves',
                        items: ['反查手机新增提示。', '新增查手机记录。'],
                    },
                    {
                        label: 'AO3',
                        title: 'AO3',
                        items: ['新增快捷填入 Char 人设。'],
                    },
                ],
            },
            {
                id: '2026-09-17',
                year: '2026',
                shortDate: '9.17',
                fullDate: '2026年9月17日',
                sections: [
                    {
                        label: 'ANDROID',
                        title: 'Android APK',
                        status: 'BETA',
                        items: ['修复输入框兼容。', '修复备份兼容。', '优化原生数据存储。'],
                    },
                    {
                        label: 'ONLINE',
                        title: '线上',
                        items: ['新增推名片功能；Char 推荐名片时可自动生成关系网。'],
                    },
                    {
                        label: 'CALL',
                        title: 'Call',
                        items: ['新增匿名短信功能，并与线上聊天上下文和记忆互通。'],
                    },
                    {
                        label: 'LOVES',
                        title: 'Loves',
                        items: ['新增反查手机功能，需手动开启；目前仅支持查询线上聊天记录。'],
                    },
                ],
            },
            {
                id: '2026-09-14',
                year: '2026',
                shortDate: '9.14',
                fullDate: '2026年9月14日',
                sections: [
                    {
                        label: 'ANDROID',
                        title: 'Android APK',
                        status: 'BETA',
                        items: ['修复输入问题。', '隐藏原生顶栏。', '修复界面问题。'],
                    },
                    {
                        label: 'DIARY',
                        title: '日记',
                        items: ['新增日记。'],
                    },
                    {
                        label: 'ONLINE',
                        title: '线上',
                        items: ['修复视口问题。', '优化性能。'],
                    },
                    {
                        label: 'OFFLINE',
                        title: '线下',
                        items: ['新增正则替换字。', '修复视口问题。', '优化性能。'],
                    },
                ],
            },
            {
                id: '2026-09-11',
                year: '2026',
                shortDate: '9.11',
                fullDate: '2026年9月11日',
                sections: [
                    {
                        label: 'ANDROID',
                        title: 'Android APK',
                        status: 'BETA',
                        items: ['Android APK Beta 版上线。'],
                    },
                    {
                        label: 'LIBRARY',
                        title: '网易云音乐',
                        items: ['新增网易云音乐扫码登录。'],
                    },
                    {
                        label: 'MOMENTS',
                        title: '朋友圈',
                        items: ['修复朋友圈评论不显示的问题。'],
                    },
                    {
                        label: 'SYSTEM',
                        title: '系统修复',
                        items: ['修复部分界面问题及组件编译错误问题。'],
                    },
                ],
            },
            {
                id: '2026-09-07',
                year: '2026',
                shortDate: '9.7',
                fullDate: '2026年9月7日',
                sections: [
                    {
                        label: 'SYSTEM',
                        title: '性能优化',
                        items: ['整体优化性能。'],
                    },
                    {
                        label: 'ONLINE',
                        title: '线上聊天',
                        items: ['优化线上单聊/群聊的总结，修复聊天记录搜索问题。'],
                    },
                    {
                        label: 'MCP',
                        title: 'MCP',
                        items: ['修复 MCP 的问题。'],
                    },
                ],
            },
            {
                id: '2026-09-06',
                year: '2026',
                shortDate: '9.6',
                fullDate: '2026年9月6日',
                sections: [
                    {
                        label: 'SYSTEM',
                        title: '系统优化',
                        items: ['修复部分界面问题。', '整体优化运行性能。'],
                    },
                    {
                        label: 'FANFICTION',
                        title: '同人文',
                        items: ['新增同人文功能。'],
                    },
                    {
                        label: 'MCP',
                        title: 'MCP',
                        items: [
                            '新增 MCP 功能：添加 MCP 服务器后，在 Char 设置中开启，即可在聊天中调用。',
                        ],
                    },
                    {
                        label: 'ONLINE',
                        title: '线上聊天',
                        items: ['新增自定义提示词预设，可在 Char 设置中设置。'],
                    },
                ],
            },
            {
                id: '2026-08-30',
                year: '2026',
                shortDate: '8.30',
                fullDate: '2026年8月30日',
                sections: [
                    {
                        label: 'DESKTOP',
                        title: '桌面',
                        items: ['优化桌面拖拽与小组件。'],
                    },
                    {
                        label: 'SINGLE CHAT',
                        title: '单聊',
                        items: ['优化单聊性能与键盘问题。'],
                    },
                    {
                        label: 'APP STORE',
                        title: 'App Store',
                        status: 'BETA',
                        items: [
                            '新增 App Store Beta 版，可复制模板制作小游戏；匿名问答入口已移至此处。',
                        ],
                    },
                    {
                        label: 'GALLERY',
                        title: 'Gallery',
                        status: 'BETA',
                        items: [
                            '新增 Gallery Beta 版：在 Char 相册上传图片后，可在聊天中让其更换头像；如需清理图片，可在图库中直接删除。',
                        ],
                    },
                ],
            },
            {
                id: '2026-08-28',
                year: '2026',
                shortDate: '8.28',
                fullDate: '2026年8月28日',
                sections: [
                    {
                        label: 'INPUT',
                        title: '输入框',
                        items: ['修复某些输入框上移的问题。'],
                    },
                    {
                        label: 'THEME',
                        title: 'Theme',
                        items: ['将线下美化搬到 Theme，避免导入错误美化后无法进入线下聊天。'],
                    },
                    {
                        label: 'OFFICE',
                        title: 'Office 创作助手',
                        status: 'BETA',
                        items: [
                            '新增 Office 创作助手“有兔”Beta 版，可通过 Theme 右侧的图标进入添加。',
                        ],
                    },
                ],
            },
            {
                id: '2026-08-26',
                year: '2026',
                shortDate: '8.26',
                fullDate: '2026年8月26日',
                sections: [
                    {
                        label: 'SINGLE CHAT',
                        title: '单聊',
                        items: ['新增发送位置、定位与时差功能。'],
                    },
                ],
            },
            {
                id: '2026-08-25',
                year: '2026',
                shortDate: '8.25',
                fullDate: '2026年8月25日',
                sections: [
                    {
                        label: 'ONLINE',
                        title: '线上聊天',
                        items: ['优化运行性能。', '优化通话体验，修复重回与界面问题。'],
                    },
                    {
                        label: 'OFFLINE',
                        title: '线下聊天',
                        items: ['优化运行性能。', '修复自定义条目设为 CoT 时仅读取前五条的问题。'],
                    },
                    {
                        label: 'MOMENTS',
                        title: '朋友圈',
                        items: [
                            '优化朋友圈提示词。',
                            '新增朋友圈生图功能。',
                            'Char 发布朋友圈时，新增相关私信与评论串。',
                        ],
                    },
                ],
            },
            {
                id: '2026-08-22',
                year: '2026',
                shortDate: '8.22',
                fullDate: '2026年8月22日',
                sections: [
                    {
                        label: 'OFFLINE',
                        title: '线下聊天',
                        items: ['新增正则 HTML，优化运行性能。'],
                    },
                    {
                        label: 'ONLINE',
                        title: '线上聊天',
                        items: ['修复纯 CSS 的自定义提示词，优化运行性能。', '小幅优化提示词。'],
                    },
                    {
                        label: 'API',
                        title: 'API 配置',
                        items: ['新增可自定义频率惩罚，支持 OpenAI 及 OpenAI 兼容接口。'],
                    },
                ],
            },
            {
                id: '2026-08-21',
                year: '2026',
                shortDate: '8.21',
                fullDate: '2026年8月21日',
                sections: [
                    {
                        label: 'DESKTOP',
                        title: '桌面',
                        items: ['修复桌面图标的小问题。'],
                    },
                    {
                        label: 'OFFLINE',
                        title: '线下生成',
                        items: ['修复线下生成完成后页面跳到中间楼层的问题。'],
                    },
                    {
                        label: 'STATUS BAR',
                        title: '状态栏',
                        items: ['新增 HTML 模板。'],
                    },
                    {
                        label: 'SHOP',
                        title: 'Shop',
                        items: ['修复金额和订单相关问题。'],
                    },
                    {
                        label: 'SINGLE CHAT',
                        title: '单聊',
                        items: ['小幅微调单聊提示词。'],
                    },
                ],
            },
            {
                id: '2026-08-19',
                year: '2026',
                shortDate: '8.19',
                fullDate: '2026年8月19日',
                sections: [
                    {
                        label: 'OFFLINE',
                        title: '线下聊天',
                        items: ['修复线下生图完成后回到中间楼层的问题。', '优化流式生成性能。'],
                    },
                    {
                        label: 'IMAGE',
                        title: '生图',
                        items: ['优化生图提示词。', '图片详情支持自适应显示。'],
                    },
                    {
                        label: 'LOVES',
                        title: 'Loves 查手机',
                        items: ['优化底栏和显示问题。'],
                    },
                    {
                        label: 'ONLINE',
                        title: '线上语音通话',
                        items: [
                            '修复语音通话小窗后刷新，再次通话时错误显示为之前同一联系人的问题。',
                        ],
                    },
                    {
                        label: 'DATA',
                        title: '数据管理',
                        items: ['优化数据管理。', 'App 随机生成的头像支持去重。'],
                    },
                    {
                        label: 'WORLDBOOK',
                        title: '世界书',
                        items: ['修复世界书界面上移问题。'],
                    },
                ],
            },
            {
                id: '2026-08-18',
                year: '2026',
                shortDate: '8.18',
                fullDate: '2026年8月18日',
                sections: [
                    {
                        label: 'OFFLINE',
                        title: '线下聊天',
                        items: [
                            '修复 Edge 中线下生成完成后页面跳至中间位置的问题。',
                            '“仅总结”与“结束见面”均会先生成可视化预览，支持重新总结。',
                            '重回操作新增二次确认。',
                        ],
                    },
                    {
                        label: 'ONLINE',
                        title: '线上聊天',
                        items: [
                            '优化线上总结内置规则，使总结内容更完整。',
                            '新增线上总结预览，确认前可重新总结或取消。',
                            '线上清空聊天记录仅清空聊天记录。',
                        ],
                    },
                    {
                        label: 'DATA',
                        title: '数据管理',
                        items: ['聊天备份支持单独导出，图片资源分开管理。'],
                    },
                    {
                        label: 'LIBRARY',
                        title: 'Library',
                        items: [
                            '新增网易云音乐扫码登录。',
                            '已知问题：当前电脑端可登录，手机端暂无法正常登录，仍需优化。',
                        ],
                    },
                    {
                        label: 'DESKTOP',
                        title: '桌面与小组件',
                        status: 'TESTING',
                        items: [
                            '桌面支持长按拖动。',
                            '小组件新增导入、删除与重置桌面功能，仍处于测试阶段，尚未完善。',
                        ],
                    },
                ],
            },
            {
                id: '2026-08-17',
                year: '2026',
                shortDate: '8.17',
                fullDate: '2026年8月17日',
                sections: [
                    {
                        title: '阅读',
                        items: ['新增长按点评功能。'],
                    },
                    {
                        title: '一起看',
                        items: ['Char 头像支持移动。'],
                    },
                    {
                        title: '单聊',
                        items: ['新增拉黑功能。', '新增“允许角色拉黑 U”开关。'],
                    },
                    {
                        title: '群聊',
                        items: ['支持挂载世界书。'],
                    },
                    {
                        title: 'Loves',
                        items: ['支持解绑功能；发送解绑申请后，Char 会选择同意或拒绝。'],
                    },
                ],
            },
            {
                id: '2026-08-15',
                year: '2026',
                shortDate: '8.15',
                fullDate: '2026年8月15日',
                sections: [
                    {
                        title: 'X',
                        items: ['新增切换账号功能。', '优化运行性能。'],
                    },
                    {
                        title: '数据管理',
                        items: ['新增图片压缩功能。'],
                    },
                    {
                        title: '聊天',
                        items: ['新增自定义 Home 界面 CSS。', '新增转发聊天记录功能。'],
                    },
                    {
                        title: '线上生图',
                        items: ['新增单独重 Roll 功能。'],
                    },
                ],
            },
            {
                id: '2026-08-13',
                year: '2026',
                shortDate: '8.13',
                fullDate: '2026年8月13日',
                sections: [
                    {
                        title: '聊天记忆',
                        items: [
                            '短期记忆和长期记忆均新增“读取条数”设置，可按聊天单独调整 AI 的相关记忆召回数量。',
                            '短期记忆支持多选归纳为一条长期记忆；确认保存后会自动移除已归纳的短期条目。',
                        ],
                    },
                    {
                        title: '单聊与线下模式',
                        items: [
                            '单聊线下设定新增“线下自动生图”开关，开启后沿用线上生图提示词与自动锁脸。',
                            '线下聊天新增全部聊天记录 TXT 导出。',
                        ],
                    },
                    {
                        title: '问题修复',
                        items: [
                            '修复线上自动生图的自动锁脸；已上传角色参考脸时，开启“自动锁脸”即可使用。',
                        ],
                    },
                ],
            },
            {
                id: '2026-08-12',
                year: '2026',
                shortDate: '8.12',
                fullDate: '2026年8月12日',
                sections: [
                    {
                        title: '界面与内容',
                        items: ['优化数据管理与世界书的界面体验。', '表情包贴图支持添加描述。'],
                    },
                    {
                        title: 'Pay 与群聊',
                        items: [
                            'Pay 新增充值功能，亲属卡支持解绑。',
                            '群聊新增“允许角色私聊”与“允许角色和角色好友私聊”开关。',
                        ],
                    },
                    {
                        title: '线下模式',
                        items: ['进行线下性能小优化。'],
                    },
                ],
            },
            {
                id: '2026-08-11',
                year: '2026',
                shortDate: '8.11',
                fullDate: '2026年8月11日',
                sections: [
                    {
                        title: '功能更新',
                        items: [
                            '兼容 iOS 16.4 以下系统无法调用 AI 接口的问题。',
                            '重构 Netflix 玩法，未完善，测试中。',
                            '优化 TTS，增加更多服务商。',
                            '群聊增加 TTS。',
                            'X 和单聊记忆互通，未完善，测试中。',
                        ],
                    },
                    {
                        title: '线下模式',
                        items: [
                            '优化总结，增加总结楼层。',
                            '增加两个由 haru宝宝提供的单楼回顾条目，可在提示词中开启；注意 CoT 也要一并开启。',
                        ],
                    },
                ],
            },
            {
                id: '2026-08-10',
                year: '2026',
                shortDate: '8.10',
                fullDate: '2026年8月10日',
                sections: [
                    {
                        title: '新增功能',
                        items: [
                            '新增识图能力。',
                            '接入 X。',
                            '朋友圈新增“谁可以看见”权限设置。',
                            '角色发布朋友圈后，仅其关系网内的角色可以互动。',
                        ],
                    },
                    {
                        title: '问题修复',
                        items: ['修复上移功能异常的问题。', '修复粤语和自定义语言无法播放的问题。'],
                    },
                ],
            },
            {
                id: '2026-08-07',
                year: '2026',
                shortDate: '8.7',
                fullDate: '2026年8月7日',
                sections: [
                    {
                        title: '功能更新',
                        items: [
                            '优化接口兼容性。',
                            '支持聊天最小/最大气泡条数。',
                            '优化回车兼容性。',
                            '新增自动生图。',
                            '支持外接向量记忆。',
                            '新增中文 UI。',
                        ],
                    },
                ],
            },
            {
                id: '2026-08-04',
                year: '2026',
                shortDate: '8.4',
                fullDate: '2026年8月4日',
                sections: [
                    {
                        title: '性能与翻译',
                        items: ['优化线下模式性能与世界书体验。', '修复 Loves 动态双语翻译。'],
                    },
                    {
                        title: '群聊与美化',
                        items: ['支持群聊 ID 切换。', '新增群聊美化与美化方案导入。'],
                    },
                ],
            },
            {
                id: '2026-08-03',
                year: '2026',
                shortDate: '8.3',
                fullDate: '2026年8月3日',
                sections: [
                    {
                        title: '体验优化',
                        items: ['优化整体运行性能。', '优化备份流程与聊天内容显示。'],
                    },
                ],
            },
            {
                id: '2026-08-02',
                year: '2026',
                shortDate: '8.2',
                fullDate: '2026年8月2日',
                sections: [
                    {
                        title: '性能与体验',
                        items: [
                            '优化整体性能、线上 CoT 与群通话体验。',
                            '聊天页面内不再弹出消息通知。',
                        ],
                    },
                    {
                        title: '新增功能',
                        items: [
                            '新增生图与单次回复条数设置。',
                            '支持默认语言自定义。',
                            '支持群聊翻译自动展开。',
                            '新增匿名问答。',
                        ],
                    },
                ],
            },
            {
                id: '2026-08-01',
                year: '2026',
                shortDate: '8.1',
                fullDate: '2026年8月1日',
                sections: [
                    {
                        title: '性能与兼容',
                        items: [
                            '优化整体性能、登录以及导入导出备份流程。',
                            '修复 YTB 私信问题并提升 Edge 兼容性。',
                        ],
                    },
                    {
                        title: '聊天与模型',
                        items: [
                            '优化线上 CoT、心声自定义与报错处理。',
                            '单聊支持翻译自动展开。',
                            '群聊支持 U 头像。',
                        ],
                    },
                ],
            },
            {
                id: '2026-07-31',
                year: '2026',
                shortDate: '7.31',
                fullDate: '2026年7月31日',
                sections: [
                    {
                        title: '性能与界面',
                        items: ['修复全局字体调整引起的卡顿，并改善界面适配。'],
                    },
                    {
                        title: '问题修复',
                        items: [
                            '修复 Bstage 与聊天记录搜索页面问题。',
                            '修复 U 人设未被读取的问题，并优化心声提示词。',
                        ],
                    },
                    {
                        title: '登录',
                        items: ['账密登录支持多设备同时使用。'],
                    },
                ],
            },
        ],
        LATEST_CHANGELOG_ENTRY_ID = CHANGELOG_ENTRIES[0]?.id || '',
        count = 250,
        ACKNOWLEDGEMENT_DELAY_MS = 3000,
        text = 'u2_changelog_notice_seen:20260928-v1:';
    let returnFocus = null,
        overflow_2 = '',
        value_5 = null,
        autoNoticeTimer = null,
        autoNoticeInFlight = false,
        text_6 = '',
        latestNoticeEligibilityReady = false,
        acknowledgementTimer = null,
        acknowledgementInterval = null,
        dismissalLocked = false,
        text_9 = '',
        count_10 = 0,
        count_11 = 0;
    const seenNoticeKeys = new Set();
    function getChangelogEntry(id_2) {
        return CHANGELOG_ENTRIES.find((entry) => entry.id === id_2) || null;
    }
    function setModalTitle(textContent_2) {
        if (title_3) title_3.textContent = textContent_2;
    }
    function getNoticeStorageKey(username_2) {
        const account =
            String(username_2 || 'local')
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, '_') || 'local';
        return '' + text + LATEST_CHANGELOG_ENTRY_ID + ':' + account;
    }
    async function hasSeenLatestChangelog(storageKey) {
        if (seenNoticeKeys.has(storageKey)) return true;
        try {
            if (window.appStorage?.ready) await window.appStorage.ready;
            const seen = (await window.appStorage?.getSetting?.(storageKey, false)) === true;
            if (seen) seenNoticeKeys.add(storageKey);
            return seen;
        } catch {
            return false;
        }
    }
    async function markLatestChangelogSeen(storageKey_2) {
        if (!storageKey_2) return;
        seenNoticeKeys.add(storageKey_2);
        try {
            if (window.appStorage?.ready) await window.appStorage.ready;
            await window.appStorage?.setSetting?.(storageKey_2, true);
        } catch {}
    }
    function handleAction_12() {
        if (acknowledgementTimer) window.clearTimeout(acknowledgementTimer);
        if (acknowledgementInterval) window.clearInterval(acknowledgementInterval);
        acknowledgementTimer = null;
        acknowledgementInterval = null;
        dismissalLocked = false;
        text_9 = '';
        if (closeButton) closeButton.disabled = false;
        confirmButton && ((confirmButton.disabled = false), (confirmButton.textContent = '知道了'));
    }
    function handleAction_13(value_32) {
        handleAction_12();
        text_9 = value_32;
        dismissalLocked = true;
        if (closeButton) closeButton.disabled = true;
        if (backButton) backButton.hidden = true;
        if (confirmButton) confirmButton.disabled = true;
        const deadline = Date.now() + ACKNOWLEDGEMENT_DELAY_MS,
            updateCountdown = () => {
                const secondsRemaining = Math.ceil(Math.max(0, deadline - Date.now()) / 1000);
                if (confirmButton)
                    confirmButton.textContent =
                        secondsRemaining > 0 ? '知道了（' + secondsRemaining + '秒）' : '知道了';
            };
        updateCountdown();
        acknowledgementInterval = window.setInterval(updateCountdown, 250);
        acknowledgementTimer = window.setTimeout(() => {
            if (acknowledgementInterval) window.clearInterval(acknowledgementInterval);
            acknowledgementInterval = null;
            acknowledgementTimer = null;
            dismissalLocked = false;
            if (closeButton) closeButton.disabled = false;
            confirmButton &&
                ((confirmButton.disabled = false), (confirmButton.textContent = '知道了'));
        }, ACKNOWLEDGEMENT_DELAY_MS);
    }
    function handleAction_14(value_36) {
        const match_37 = String(value_36?.id || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match_37) return null;
        const year_2 = Number(match_37[1]),
            month_2 = Number(match_37[2]),
            day_2 = Number(match_37[3]);
        if (!Number.isInteger(year_2) || month_2 < 1 || month_2 > 12 || day_2 < 1 || day_2 > 31)
            return null;
        return {
            year: year_2,
            month: month_2,
            day: day_2,
        };
    }
    function handleAction_15() {
        return [
            ...new Set(
                CHANGELOG_ENTRIES.map(handleAction_14)
                    .filter(Boolean)
                    .map(({ year: year_3 }) => year_3),
            ),
        ].sort((value_41, value_42) => value_42 - value_41);
    }
    function handleAction_16(value_43, value_44) {
        const value_45 = new Map();
        return (
            CHANGELOG_ENTRIES.forEach((value_46) => {
                const handleAction_14_47 = handleAction_14(value_46);
                if (handleAction_14_47?.year === value_43 && handleAction_14_47.month === value_44)
                    value_45.set(handleAction_14_47.day, value_46);
            }),
            value_45
        );
    }
    function handleAction_17(value_48) {
        if (!changelogContent_2) return;
        const showChangelog = Boolean(value_48);
        changelogContent_2.hidden = !showChangelog;
        aboutChangelogMonthTriggerElement?.setAttribute('aria-expanded', String(showChangelog));
        if (showChangelog) handleAction_19();
    }
    function handleAction_18() {
        const handleAction_14_49 = handleAction_14(CHANGELOG_ENTRIES[0]);
        if (!handleAction_14_49) return;
        count_10 = handleAction_14_49.year;
        count_11 = handleAction_14_49.month;
    }
    function handleAction_19() {
        const handleAction_15_50 = handleAction_15();
        changelogDetailContent_3 &&
            (changelogDetailContent_3.replaceChildren(),
            handleAction_15_50.forEach((value_51) => {
                const element = document.createElement('button');
                element.type = 'button';
                element.className = 'about-changelog-year-option';
                element.textContent = value_51 + '年';
                element.setAttribute('aria-pressed', String(value_51 === count_10));
                if (value_51 === count_10) element.className += ' is-selected';
                element.addEventListener('click', () => {
                    count_10 = value_51;
                    handleAction_19();
                    handleAction_20();
                });
                changelogDetailContent_3.append(element);
            }));
        if (changelogDetailContent_4) {
            changelogDetailContent_4.replaceChildren();
            for (let count_52 = 1; count_52 <= 12; count_52 += 1) {
                const element_53 = document.createElement('button'),
                    value_54 = handleAction_16(count_10, count_52).size > 0;
                element_53.type = 'button';
                element_53.className = 'about-changelog-month-option';
                element_53.textContent = count_52 + '月';
                element_53.setAttribute('aria-pressed', String(count_52 === count_11));
                if (value_54) element_53.className += ' has-updates';
                if (count_52 === count_11) element_53.className += ' is-selected';
                element_53.addEventListener('click', () => {
                    count_11 = count_52;
                    handleAction_20();
                    handleAction_17(false);
                    aboutChangelogMonthTriggerElement?.focus();
                });
                changelogDetailContent_4.append(element_53);
            }
        }
    }
    function handleAction_20() {
        if (!changelogDetailContent || !count_10 || !count_11) return;
        const textContent_3 = count_10 + '年' + count_11 + '月',
            handleAction_16_56 = handleAction_16(count_10, count_11),
            day_57 = new Date(count_10, count_11 - 1, 1).getDay(),
            date = new Date(count_10, count_11, 0).getDate();
        if (title_4) title_4.textContent = textContent_3;
        aboutChangelogMonthTriggerElement?.setAttribute(
            'aria-label',
            '选择年月，当前为' + textContent_3,
        );
        changelogDetailContent.setAttribute('aria-label', textContent_3 + '更新日历');
        changelogDetailContent.replaceChildren();
        for (let count_58 = 0; count_58 < 42; count_58 += 1) {
            const sectionElement = document.createElement('div'),
                value_60 = count_58 - day_57 + 1;
            sectionElement.className = 'about-changelog-calendar-cell';
            sectionElement.setAttribute('role', 'gridcell');
            if (value_60 < 1 || value_60 > date) {
                sectionElement.className += ' is-empty';
                sectionElement.setAttribute('aria-hidden', 'true');
                changelogDetailContent.append(sectionElement);
                continue;
            }
            const entry_2 = handleAction_16_56.get(value_60);
            if (entry_2) {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'about-changelog-calendar-day is-updated';
                item.dataset.changelogId = entry_2.id;
                item.textContent = String(value_60);
                item.setAttribute('aria-label', '查看 ' + entry_2.fullDate + ' 更新内容');
                item.addEventListener('click', () => showChangelogDetail(entry_2.id, item));
                sectionElement.append(item);
            } else {
                const copy = document.createElement('span');
                copy.className = 'about-changelog-calendar-day is-idle';
                copy.textContent = String(value_60);
                copy.setAttribute(
                    'aria-label',
                    count_10 + '年' + count_11 + '月' + value_60 + '日，无更新',
                );
                sectionElement.append(copy);
            }
            changelogDetailContent.append(sectionElement);
        }
    }
    function handleAction_21() {
        handleAction_20();
    }
    function showChangelogList({ restoreFocus = false } = {}) {
        if (changelogListView) changelogListView.hidden = false;
        if (changelogDetailView) changelogDetailView.hidden = true;
        if (backButton) backButton.hidden = true;
        handleAction_17(false);
        setModalTitle('更新日志');
        const focusTarget = value_5;
        value_5 = null;
        if (restoreFocus && focusTarget && document.contains(focusTarget)) focusTarget.focus();
    }
    function showChangelogDetail(value_64, value_65) {
        const entry_3 = getChangelogEntry(value_64);
        if (!entry_3 || !changelogDetailContent_2) return;
        value_5 =
            value_65 ||
            changelogDetailContent?.querySelector('[data-changelog-id="' + value_64 + '"]') ||
            null;
        changelogDetailContent_2.replaceChildren();
        if (aboutChangelogDetailKickerElement)
            aboutChangelogDetailKickerElement.textContent = 'RELEASE_NOTE';
        handleAction_17(false);
        changelogDetailDate &&
            ((changelogDetailDate.textContent = entry_3.shortDate),
            changelogDetailDate.setAttribute('aria-label', entry_3.fullDate));
        if (changelogDetailContent_5) {
            const items_66 = [
                entry_3.id.replaceAll('-', '.'),
                entry_3.id === LATEST_CHANGELOG_ENTRY_ID ? 'LATEST' : 'ARCHIVE',
            ];
            entry_3.sections.forEach((value_67) => {
                if (value_67.status && !items_66.includes(value_67.status))
                    items_66.push(value_67.status);
            });
            changelogDetailContent_5.replaceChildren();
            items_66.forEach((textContent_4) => {
                const element_69 = document.createElement('span');
                element_69.className = 'about-changelog-detail-tag';
                element_69.textContent = textContent_4;
                changelogDetailContent_5.append(element_69);
            });
        }
        entry_3.sections.forEach((section, value_71) => {
            const sectionElement_2 = document.createElement('section'),
                element_73 = document.createElement('div'),
                element_74 = document.createElement('span'),
                heading = document.createElement('h3'),
                list = document.createElement('ul');
            sectionElement_2.className = 'about-changelog-section';
            element_73.className = 'about-changelog-section-header';
            element_74.className = 'about-changelog-section-label';
            element_74.textContent =
                section.label || 'SECTION ' + String(value_71 + 1).padStart(2, '0');
            heading.textContent = section.title;
            section.items.forEach((item_76) => {
                const listItem = document.createElement('li');
                listItem.textContent = item_76;
                list.append(listItem);
            });
            element_73.append(element_74, heading);
            if (section.status) {
                const copy_2 = document.createElement('span');
                copy_2.className = 'about-changelog-section-status';
                copy_2.textContent = section.status;
                element_73.append(copy_2);
            }
            sectionElement_2.append(element_73, list);
            changelogDetailContent_2.append(sectionElement_2);
        });
        if (changelogListView) changelogListView.hidden = true;
        if (changelogDetailView) changelogDetailView.hidden = false;
        if (backButton) backButton.hidden = false;
        setModalTitle(entry_3.fullDate);
        backButton?.focus();
    }
    function open_2(mode = 'disclaimer', options = {}) {
        if (!modal) return false;
        const safeOptions = options && typeof options === 'object' ? options : {},
            showChangelog_2 = mode === 'changelog',
            changelogEntryId_2 = showChangelog_2 ? String(safeOptions.changelogEntryId || '') : '',
            noticeStorageKey_2 = showChangelog_2 ? String(safeOptions.noticeStorageKey || '') : '';
        returnFocus = document.activeElement;
        handleAction_12();
        modal.classList?.toggle('is-changelog-mode', showChangelog_2);
        if (disclaimerContent) disclaimerContent.hidden = showChangelog_2;
        if (changelogContent) changelogContent.hidden = !showChangelog_2;
        if (showChangelog_2) {
            handleAction_18();
            handleAction_21();
            showChangelogList();
            if (changelogEntryId_2) showChangelogDetail(changelogEntryId_2);
        } else {
            if (backButton) backButton.hidden = true;
            setModalTitle('免责声明');
        }
        return (
            (overflow_2 = document.body.style.overflow),
            (modal.hidden = false),
            modal.setAttribute('aria-hidden', 'false'),
            (document.body.style.overflow = 'hidden'),
            noticeStorageKey_2
                ? (handleAction_13(noticeStorageKey_2), changelogDetailView?.focus())
                : closeButton?.focus(),
            true
        );
    }
    function close_2() {
        if (!modal || modal.hidden || dismissalLocked) return false;
        void markLatestChangelogSeen(text_9);
        const activeElement_84 = document.activeElement;
        if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
        return (
            document.activeElement === activeElement_84 &&
                activeElement_84 &&
                typeof activeElement_84.blur === 'function' &&
                activeElement_84.blur(),
            (returnFocus = null),
            handleAction_12(),
            (modal.hidden = true),
            modal.setAttribute('aria-hidden', 'true'),
            modal.classList?.remove('is-changelog-mode'),
            (document.body.style.overflow = overflow_2),
            (overflow_2 = ''),
            true
        );
    }
    async function showLatestChangelogNotice_2(username_3) {
        if (!latestNoticeEligibilityReady || !LATEST_CHANGELOG_ENTRY_ID || !modal || !modal.hidden)
            return false;
        const storageKey_3 = getNoticeStorageKey(username_3);
        if (await hasSeenLatestChangelog(storageKey_3)) return false;
        if (!modal.hidden) return false;
        return open_2('changelog', {
            changelogEntryId: LATEST_CHANGELOG_ENTRY_ID,
            noticeStorageKey: storageKey_3,
        });
    }
    function scheduleLatestChangelogNotice(event_2) {
        text_6 = event_2?.detail?.username || text_6 || '';
        if (
            !latestNoticeEligibilityReady ||
            autoNoticeTimer ||
            autoNoticeInFlight ||
            !modal?.hidden
        )
            return;
        const value_88 = text_6,
            noticeStorageKey_89 = getNoticeStorageKey(value_88);
        autoNoticeInFlight = true;
        hasSeenLatestChangelog(noticeStorageKey_89)
            .then((hasSeen) => {
                if (hasSeen || !modal?.hidden) return;
                autoNoticeTimer = window.setTimeout(() => {
                    autoNoticeTimer = null;
                    showLatestChangelogNotice_2(value_88)['finally'](() => {
                        autoNoticeInFlight = false;
                    });
                }, count);
            })
            ['catch'](() => {})
            ['finally'](() => {
                if (!autoNoticeTimer) autoNoticeInFlight = false;
            });
    }
    function allowLatestChangelogNotice() {
        latestNoticeEligibilityReady = true;
        (text_6 || window.u2Auth?.isLoggedIn?.()) &&
            scheduleLatestChangelogNotice({
                detail: {
                    username: text_6,
                },
            });
    }
    aboutChangelogMonthTriggerElement?.addEventListener('click', () => {
        handleAction_17(changelogContent_2?.hidden !== false);
    });
    closeButton?.addEventListener('click', close_2);
    confirmButton?.addEventListener('click', close_2);
    backButton?.addEventListener('click', () =>
        showChangelogList({
            restoreFocus: true,
        }),
    );
    modal?.addEventListener('click', (event) => {
        if (event.target === modal) close_2();
    });
    document.addEventListener('keydown', (value_91) => {
        if (value_91.key !== 'Escape' || !modal || modal.hidden) return;
        if (changelogContent_2 && !changelogContent_2.hidden) {
            handleAction_17(false);
            aboutChangelogMonthTriggerElement?.focus();
            return;
        }
        close_2();
    });
    window.addEventListener('u2:main-interface-ready', scheduleLatestChangelogNotice);
    window.addEventListener('u2:splash-screen-removed', allowLatestChangelogNotice, {
        once: true,
    });
    if (window.u2SplashScreenRemoved === true) allowLatestChangelogNotice();
    window.u2AboutInfoModal = {
        open: open_2,
        close: close_2,
        showLatestChangelogNotice: showLatestChangelogNotice_2,
    };
})();
