(function(){
window.openCallTutorial120 = function () {
  window["openAppGuideModal"]?.({
    'eyebrow': "CALL / GUIDE",
    'title': "call 使用教程",
    'intro': '用匿名号码给\x20Char\x20或\x20NPC\x20发短信，体验对方不知道发送者身份时的回应。',
    'sections': [{
      'label': "01 / START",
      'title': '选择联系人',
      'items': [{
        'title': "找到角色",
        'text': "先在 iMessage 添加 Char 或 NPC，再到 call 底部的“联络人”选择对方。已有短信会出现在“通话记录”，两个页面都可以搜索。"
      }]
    }, {
      'label': '02\x20/\x20MESSAGE',
      'title': "发送匿名短信",
      'items': [{
        'title': "发消息",
        'text': "打开会话，在输入框写短信并按发送键；点输入框旁的麦克风图标，让角色生成回复。生成前需在系统设置中配置 API。"
      }, {
        'title': "匿名身份",
        'text': '角色知道自己收到了匿名短信，但不会自动认定发送者就是\x20iMessage\x20单聊里的\x20User。角色也可能按情境拉黑当前号码。'
      }]
    }, {
      'label': "03 / NUMBERS",
      'title': "切换号码与查看历史",
      'items': [{
        'title': "旧号码",
        'text': '进入会话后点顶部时钟图标查看旧号码；未被拉黑的旧号码可以继续聊天。'
      }, {
        'title': "新号码",
        'text': "点输入框左侧的“＋”→“使用新号码”，即可从新号码开始。被拉黑后也可以换号继续。"
      }]
    }, {
      'label': '04\x20/\x20MEMORY',
      'title': '记忆与会话管理',
      'items': [{
        'title': "单聊记忆互通",
        'text': "call 会参考该角色的 iMessage 单聊记忆和最近聊天；iMessage 单聊也能参考该角色尚未删除的 call 记录。两边的会话和身份仍然分开。"
      }, {
        'title': "清空或删除",
        'text': "点“＋”可清空本次会话，或删除本次号码会话。删除的 call 会话不会进入后续生成的上下文；删除最新号码会自动启用新号码。"
      }]
    }]
  });
};
window.openYoutubeTutorial120 = apk120Value93 => {
  apk120Value93["stopPropagation"](), window["openAppGuideModal"]?.({
    'eyebrow': "YOUTUBE / GUIDE",
    'title': "YouTube 使用教程",
    'intro': "从创建 Char 频道、订阅观看，到直播互动和经营自己的频道。按下面的入口开始玩。",
    'sections': [{
      'label': "01 / CHAR",
      'title': '创建或关联\x20Char\x20频道',
      'items': [{
        'title': "创建入口",
        'text': "点顶部放大镜打开“自定义频道角色”。可以选择已有的 iMessage Char，也可以填写频道名称、账号、简介或人设，并设置头像和封面。"
      }, {
        'title': '生成内容',
        'text': "点“生成频道并开播”创建频道；进入频道后，切换“直播／往期／社群”，再点右上角生成按钮，为当前分类生成直播、往期视频或帖子。"
      }]
    }, {
      'label': '02\x20/\x20EXPLORE',
      'title': '浏览、订阅与榜单',
      'items': [{
        'title': '订阅页',
        'text': "底部“订阅”显示已订阅频道和直播；可用“正在直播”筛选，点频道头像进入频道，或点“全部”查看订阅列表。"
      }, {
        'title': "发现频道",
        'text': '底部“榜单”可切换直播榜和订阅榜。点右上角魔法棒生成榜单，再点感兴趣的频道进入主页并订阅。'
      }]
    }, {
      'label': "03 / WATCH",
      'title': "观看视频与参与直播",
      'items': [{
        'title': "看内容",
        'text': "在频道里切换“直播／往期／社群”，点直播、视频或帖子打开详情；在视频和帖子下可以查看或发表互动内容。"
      }, {
        'title': "进入直播间",
        'text': "直播间可以发消息、调用生成回复、请求连线；出现抽奖时可选择参与，礼物入口可发送 Super Chat。"
      }]
    }, {
      'label': "04 / CREATE",
      'title': "经营自己的频道",
      'items': [{
        'title': "发布内容",
        'text': "点底部中央的“＋”，选择“开始直播”“发布贴文”或“创建社群”。开播前可设置标题、主题、背景和嘉宾。"
      }, {
        'title': "推进直播",
        'text': "自己的直播间可以发言、生成观众互动、连线和发起抽奖；结束后查看总结，并可保存录播。"
      }]
    }, {
      'label': "05 / MESSAGES",
      'title': "消息与社群",
      'items': [{
        'title': "切换消息",
        'text': "底部“消息”按“私信／社群／商务”分类。点会话查看和回复；私信或商务页右上角的魔法棒可生成新消息。"
      }, {
        'title': "社群互动",
        'text': '在自己创建的社群中查看成员和帖子；发布贴文后，可打开详情查看评论并继续回复。'
      }]
    }, {
      'label': "06 / PROFILE",
      'title': '个人频道与设置',
      'items': [{
        'title': "我的频道",
        'text': "底部“我的”可编辑频道资料，并切换直播、往期和社群内容。点“数据中心”查看观看、订阅与收益，符合条件时可提现到 Pay。"
      }, {
        'title': "世界书",
        'text': "顶部齿轮打开 YouTube 设置；“绑定世界书”可选择生成内容使用的设定。"
      }]
    }],
    'note': {
      'title': "生成前先配置 API",
      'text': "Char 直播、视频与帖子、榜单、观众互动和新消息等生成玩法，需要先在系统设置中配置可用的 API。"
    }
  });
};

window.openBstageTutorial120 = () => {
  window["openAppGuideModal"]?.({
    'eyebrow': 'B.STAGE\x20/\x20GUIDE',
    'title': "b.stage 使用教程",
    'intro': "先创建或生成团队，再从 Home、Content、Shop 和 Pop 体验会员内容、周边和聊天。",
    'sections': [{
      'label': "01 / START",
      'title': "创建或生成团队",
      'items': [{
        'title': "手动创建",
        'text': "点顶部团队栏的“＋”创建团队，填写团队名和简介；成员可手动添加，也可从已有 iMessage 好友拉取，最后点“完成创建”。"
      }, {
        'title': '搜索生成',
        'text': '点顶部放大镜，输入想看的团队或明星类型并选择人数，再点“生成团队”；搜索内容留空会随机生成。'
      }]
    }, {
      'label': "02 / HOME",
      'title': "进入团队与订阅会员",
      'items': [{
        'title': "切换团队",
        'text': '点顶部团队头像进入不同团队。Home\x20展示团队主页，点“订阅会员”可选择月卡或年卡。'
      }, {
        'title': '解锁内容',
        'text': "其他团队的 Content 和 Shop 需要先订阅团队会员；自己创建的团队可直接管理内容。"
      }]
    }, {
      'label': "03 / CONTENT",
      'title': "看视频与参与评论",
      'items': [{
        'title': "浏览与生成",
        'text': '在\x20Content\x20查看轮播图片和视频；可按系列筛选或新增系列，点分类栏右侧的“＋”填写方向并生成视频。'
      }, {
        'title': "视频详情",
        'text': '点视频查看内容和评论，输入自己的评论；详情中的生成按钮可补充视频内容及粉丝评论。'
      }]
    }, {
      'label': "04 / SHOP",
      'title': '逛周边商店',
      'items': [{
        'title': "商品与分类",
        'text': '在\x20Shop\x20按分类浏览商品，点商品查看介绍和价格；分类栏右侧的“＋”可按想要的类型生成新周边。'
      }, {
        'title': "订单记录",
        'text': "点商品可查看详情；从顶部头像进入“我的订单”，可查看团队会员和 POP 订阅记录。"
      }]
    }, {
      'label': "05 / POP",
      'title': "订阅成员并聊天",
      'items': [{
        'title': "开启私聊",
        'text': "在 Pop 选择成员并订阅，之后点成员进入聊天。输入消息点纸飞机发送，向下箭头用于调用 API 获取回复。"
      }, {
        'title': '聊天玩法',
        'text': "可回复成员的某条消息；聊天菜单可调整背景、翻译和上下文等设置。生成的其他粉丝消息也能点开查看。"
      }]
    }, {
      'label': "06 / ME",
      'title': "经营自己的空间",
      'items': [{
        'title': "个人资料",
        'text': "点顶部头像编辑昵称和粉丝人设，查看 POP 订阅、收益及订单；自己的粉丝聊天室也可从这里进入。"
      }, {
        'title': "界面美化",
        'text': "顶部齿轮打开 CSS 预设管理，可保存和切换聊天界面、头像框及气泡样式。"
      }]
    }],
    'note': {
      'title': "生成前先配置 API",
      'text': '搜索生成团队、生成视频或商品，以及聊天回复等功能，需要先在系统设置中配置可用的\x20API。'
    }
  });
};
window.openImessageTutorial120 = () => {
  window["imApp"].closeFriendQuickMenu?.(), window.openAppGuideModal?.({
    'eyebrow': "IMESSAGE / GUIDE",
    'title': "iMessage 使用教程",
    'intro': '先创建角色或群聊，再用聊天、表情包、朋友圈和主题美化扩展玩法。下面按入口介绍，读完一节就能直接打开对应页面。',
    'sections': [{
      'label': '01\x20/\x20CHAR',
      'title': "添加 Char 与处理新朋友",
      'items': [{
        'title': '创建角色',
        'text': "点底栏右侧的＋，选择“添加朋友”。填写真实姓名、备注、签名、关系和人设后，点“添加新朋友”；同一表单也能添加 NPC。"
      }, {
        'title': "好友申请",
        'text': "点＋展开的“新朋友”可查看和处理收到的申请。加号上的红点表示还有未查看的申请。"
      }],
      'action': apk120Value1665("去添加 Char", "add-char")
    }, {
      'label': "02 / PERSONA",
      'title': "把人设写成可互动的角色",
      'items': [{
        'title': '写什么',
        'text': "写清身份与经历、性格和习惯、说话方式、在意的事，以及和 User 的关系。具体行为比只写“温柔”“高冷”更容易表现出来。"
      }, {
        'title': "写在哪里",
        'text': "创建 Char 时填在角色设定栏；关系另填“Char 认为你们的关系”。已有 Char 可进入聊天设置的 Info 编辑角色资料。"
      }, {
        'title': '一个简短示例',
        'text': "“摄影社成员，慢热但观察细致；熟悉后会主动分享当天拍到的东西，说话简短，不喜欢突然被催促。”"
      }],
      'action': apk120Value1665('去填写人设', "persona")
    }, {
      'label': "03 / GROUP",
      'title': '创建群聊与旁观聊天',
      'items': [{
        'title': '创建群聊',
        'text': "在首页 Groups 点“Create group”，从已有联系人中选成员，填写群名后创建；至少选一位成员。"
      }, {
        'title': "我在群里",
        'text': "开启时你可以参与聊天；关闭后会建立旁观群聊，你不能发言，但群成员可以继续聊天。创建后从 Groups 或 Chats 进入。"
      }],
      'action': apk120Value1665("去创建群聊", 'groups')
    }, {
      'label': "04 / STICKERS",
      'title': '添加和使用表情包',
      'items': [{
        'title': '入口',
        'text': "首页 Services → Stickers → 右上角＋。先写分类名称，再选择多张本地图片或填写网络图片链接。"
      }, {
        'title': "让 Char 使用",
        'text': "打开已有分类可使用“绑定角色”。分类与贴图名称会帮助角色在聊天中选择合适的表情。"
      }],
      'action': apk120Value1665('打开\x20Stickers', 'stickers')
    }, {
      'label': "05 / FORMAT",
      'title': '网络表情包清单格式',
      'items': [{
        'title': "一行一张",
        'text': "每行写“贴图名称 + 图片 URL”，例如：开心 https://example.com/happy.png。URL 放在行末，以 http:// 或 https:// 开头；名称和链接之间可用空格或冒号等分隔。"
      }, {
        'title': "其他导入方式",
        'text': "可导入同样格式的 TXT / DOCX 清单，也可直接选择多张本地图片；本地图片不需要写 URL。"
      }],
      'action': apk120Value1665("去添加表情包", "stickers")
    }, {
      'label': "06 / THEME",
      'title': '美化界面',
      'items': [{
        'title': '入口',
        'text': "首页 Services → Themes。可按主页、单聊、气泡、群聊、状态栏和线下页面分别调整。"
      }, {
        'title': "保存与复用",
        'text': "满意后保存为预设，之后可再次载入；修改前先确认当前编辑的是你想美化的界面。"
      }],
      'action': apk120Value1665("打开 Themes", "themes")
    }, {
      'label': "07 / MOMENTS",
      'title': "朋友圈",
      'items': [{
        'title': '入口',
        'text': "首页 Services → Moments。这里能查看动态和互动，右上角相机可发布自己的朋友圈。"
      }, {
        'title': '角色动态',
        'text': "Char 发布的朋友圈也会出现在这里；点开动态可查看详情和评论。"
      }],
      'action': apk120Value1665("打开 Moments", "moments")
    }, {
      'label': '08\x20/\x20YOUTU',
      'title': "有兔创作助手",
      'items': [{
        'title': '找到有兔',
        'text': "首页 Services → Official Accounts → 有兔。第一次点“添加”，之后可从这里或 Chats 进入会话。"
      }, {
        'title': '可以怎么玩',
        'text': "告诉有兔你想要的主题、世界书或 Char / User 人设。生成作品会先显示预览，选择目标并确认后才会写入；生成前要在有兔设置里选好 API 预设。"
      }],
      'action': apk120Value1665("找到有兔", "youtu")
    }]
  });
};
window.openChatTutorial120 = () => {
  if (window.imData["currentSettingsFriend"]?.["type"] !== 'char') return;
  window["openAppGuideModal"]?.({
    'eyebrow': "IMESSAGE / CHAT GUIDE",
    'title': "单聊与 Chat Settings 教程",
    'intro': "这里汇总普通 Char 单聊和聊天设置的功能。按主题阅读即可；关闭后仍停留在当前设置页面。",
    'sections': [{
      'label': '01\x20/\x20CHAT',
      'title': "聊天与角色状态",
      'items': [{
        'title': "角色资料与状态",
        'text': "点聊天顶部的头像或姓名可看角色状态卡；状态支持查看历史，适用时可编辑或删除。右上角的电话按钮可选择语音或视频通话。"
      }, {
        'title': "发送与生成",
        'text': "纸飞机发送你输入的消息；向下箭头让 Char 接着回复。聊天记录较长时，可用回到最新消息按钮跳到末尾。"
      }, {
        'title': '引用回复',
        'text': "对一条消息使用“回复”后，输入框会显示引用预览；发送的内容会带上这条引用，点预览上的关闭按钮可取消。"
      }]
    }, {
      'label': "02 / MESSAGES",
      'title': '长按消息怎么玩',
      'items': [{
        'title': "快捷互动",
        'text': "长按消息可选表态，也能回复、复制、展开或收起已有翻译；已配置语音服务时可朗读可用的消息。"
      }, {
        'title': "更多操作",
        'text': '“More...”中可编辑消息及已有翻译、撤回允许撤回的消息、转发或删除；“选择”可批量转发或删除。不同类型的消息会隐藏不适用的操作。'
      }]
    }, {
      'label': "03 / ATTACHMENTS",
      'title': "图片、好友、定位与表情包",
      'items': [{
        'title': '图片',
        'text': "相册图片可上传本地图片，也可填写图片内容；生成图片可按提示词制作并发送。"
      }, {
        'title': "关联好友",
        'text': "可开启关联好友会话，并设置自动调用的间隔，让角色之间产生互动。"
      }, {
        'title': "定位与表情包",
        'text': '定位消息可填写地点名和详细地址；表情包按分类选择发送，已有贴图也可能在输入时给出建议。'
      }]
    }, {
      'label': "04 / MORE",
      'title': '更多单聊玩法',
      'items': [{
        'title': "重回与 Pay",
        'text': '重回会重新生成最近一次\x20Char\x20回复，可直接重回或附加要求；Pay\x20可发送转账，收取或退回会显示在转账卡片中。'
      }, {
        'title': '名片与线下',
        'text': "名片可把已有 Char 或 NPC 介绍给当前 Char；线下可展开独立的见面聊天与记录。名片仅在 Char 单聊显示。"
      }, {
        'title': "Voice 与一起听",
        'text': "Voice 可用输入的文字发送语音气泡；一起听可与 Char 共享音乐，正在播放时聊天底部会出现播放器。一起听仅在支持的 Char 聊天中显示。"
      }, {
        'title': "链接、旁白与动描",
        'text': '链接可发送带自定义显示文字的链接；旁白可补充场景叙述；动描是当前聊天的动态动作描写开关。'
      }]
    }, {
      'label': "05 / INFO",
      'title': 'Chat\x20Settings\x20·\x20Info',
      'items': [{
        'title': '收藏与搜索',
        'text': "顶部星标汇总该角色的收藏内容；放大镜可搜索完整聊天记录。"
      }, {
        'title': '角色与背景设定',
        'text': '可编辑角色资料，绑定\x20ID\x20和世界书，设置默认语言或自定义语言、一次回复的消息条数，以及时间感知和角色定位。反查手机仅对符合条件的\x20Char\x20显示。'
      }, {
        'title': "互动权限",
        'text': "可允许角色撤回或使用拉黑功能；自动展开翻译控制已有翻译是否直接显示。"
      }, {
        'title': 'AI\x20与语音',
        'text': "MCP 工具调用需要先有可用服务器，启用后还能选择是否显示工具调用；自定义提示词、COT 思考和 TTS 分别控制回复指令、思考相关设置与语音朗读。TTS 可设置音色 ID 和语速。"
      }, {
        'title': "关系网",
        'text': '可维护角色与其他人物的关系，供后续互动使用。'
      }, {
        'title': "清理与拉黑",
        'text': "拉黑后对方普通消息会发送失败，可再解除；清空聊天记录会删除线上消息但保留上下文、记忆和状态栏；删除好友会移除该角色。清空与删除均不可恢复。"
      }]
    }, {
      'label': '06\x20/\x20THEME',
      'title': "Chat Settings · Theme",
      'items': [{
        'title': '画面',
        'text': "可上传或重置聊天背景，选择单条或每条消息显示头像，并调整连续气泡的呈现。"
      }, {
        'title': '排版',
        'text': "可决定回复样式是在气泡内还是气泡外；时间戳可开关并选择显示位置。"
      }]
    }, {
      'label': "07 / MEMORY",
      'title': 'Chat\x20Settings\x20·\x20Memory',
      'items': [{
        'title': "上下文与总结",
        'text': "总览显示记忆状态；上下文可设置聊天记录参与回复的条数和开关。总结对话可手动整理记忆，也可配置自动总结。"
      }, {
        'title': '自主活动',
        'text': "可设置 Char 主动发消息和自动发朋友圈的开关及时间间隔。"
      }, {
        'title': '记忆来源',
        'text': "群聊记忆、短期记忆、长期记忆和社交帐号分别管理不同来源的内容；日程作息用于管理角色的日常安排，具体可用功能以当前页面显示为准。"
      }]
    }]
  });
};
window.openCphoneTutorial120 = function () {
  window.openAppGuideModal?.({
    'eyebrow': "CPHONE / GUIDE",
    'title': "Cphone 使用教程",
    'intro': "从 Char 的手机查看短信和应用数据。短信可以生成联系人或群聊，Call 可以生成通话记录；其他应用数据从手机设置生成。",
    'sections': [{
      'label': "01 / START",
      'title': "先进入 Char 的手机",
      'items': [{
        'title': "添加 Char",
        'text': "先在 iMessage 添加 Char，再打开 Cphone。没有 Char 时，手机会显示空状态。"
      }, {
        'title': "切换 Char",
        'text': "点击手机桌面顶部的角色卡片，选择想查看的 Char。"
      }]
    }, {
      'label': "02 / SMS",
      'title': "查看短信",
      'items': [{
        'title': "打开信息",
        'text': "点手机桌面底栏的绿色短信图标。在底部切换“会话”和“联系人”，顶部搜索框可查找联系人或消息。"
      }, {
        'title': "消息从哪里来",
        'text': "Char 与 User 的已有聊天，以及 Char 参与的 iMessage 群聊，会出现在会话中。点会话可查看消息；有翻译的气泡可点击切换译文。"
      }, {
        'title': "查看模式",
        'text': "Cphone 短信不能直接发送消息。"
      }]
    }, {
      'label': '03\x20/\x20CREATE',
      'title': "生成联系人和群聊",
      'items': [{
        'title': "生成联系人",
        'text': "在短信列表右上角点“＋”→“生成联系人”，填写联系人数量、每人对话轮数和对话内容方向，再点“生成联系人和对话”。"
      }, {
        'title': "生成群聊",
        'text': '同一个“＋”菜单里选择“生成群聊”，填写群聊名字、展示人数和群聊用途，再点“生成\x2010\x20轮群聊”。'
      }]
    }, {
      'label': "04 / CONTINUE",
      'title': "推进短信聊天",
      'items': [{
        'title': '续写会话',
        'text': '打开支持推进的联系人或\x20Cphone\x20群聊，点右上角的快进箭头，填写推进轮数；聊天方向可以留空，再点“生成聊天”。'
      }, {
        'title': "哪些会话可推进",
        'text': "只有显示快进按钮的会话可以推进；与 User 的聊天和原有 iMessage 群聊只供查看。"
      }]
    }, {
      'label': "05 / APPS",
      'title': "生成其他应用数据",
      'items': [{
        'title': "选择应用",
        'text': "点手机桌面底栏的“设置”→“生成应用数据”，勾选音乐、健康、钱包、游戏、通话、浏览器、微博或文件；有数量选项的应用可先调整数量。"
      }, {
        'title': "开始生成",
        'text': "先在系统设置配置 API，再点“生成选中的应用数据”。其他应用重新生成会覆盖本次选中应用的旧数据，通话则追加保留原记录。"
      }, {
        'title': "更换背景",
        'text': "手机设置中的“桌面背景”可以粘贴图片 URL 并应用，也可以恢复默认背景。"
      }, {
        'title': "Call 通话",
        'text': 'Call\x20的联系人同步关系网和当前\x20User，右上角“＋”默认新增\x205\x20条，可改为\x201–20\x20条。熟人可保存在\x20Call\x20通讯录，陌生电话只留在记录中；点记录查看事由、摘要和完整通话内容。'
      }]
    }]
  });
};
function apk120Value1664(apk120Value1906) {
  if (apk120Value1906 === "add-char" || apk120Value1906 === 'persona') document.getElementById("open-add-friend-sheet-btn")?.click();else {
    if (apk120Value1906 === "groups") window.imApp["openCreateGroupSheet"]?.();else {
      const apk120Value1907 = {
          'stickers': '[data-imessage-service=\x22stickers\x22]',
          'themes': '#imessage-themes-btn',
          'moments': "#nav-moments-btn",
          'youtu': "#imessage-official-accounts-btn"
        },
        apk120Value1908 = apk120Value1907[apk120Value1906];
      if (apk120Value1908) document["querySelector"](apk120Value1908)?.["click"]();
    }
  }
}
const apk120Value1665=(label,route)=>({label,onClick:()=>apk120Value1664(route)});
document.addEventListener('click',event=>{const routes={'call-help-btn':'Call','yt-main-help-btn':'Youtube','bstage-help-btn':'Bstage','cphone-settings-help-btn':'Cphone'};const target=event.target.closest('[id]');const name=routes[target?.id];if(name)window['open'+name+'Tutorial120'](event);});
})();
