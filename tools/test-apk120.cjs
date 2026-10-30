// Isolated browser integration checks; no paid API calls.
const {
    chromium
  } = require('playwright'),
  fs = require('fs'),
  path = require('path'),
  http = require('http'),
  assert = require('assert/strict');
(async () => {
  const root = path.resolve(__dirname, '..'),
    errors = [],
    passed = [];
  const server = http.createServer((req, res) => {
    try {
      let f = path.join(root, decodeURIComponent(new URL(req.url, 'http://local').pathname));
      if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
      res.setHeader('Content-Type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.css') ? 'text/css' : 'text/html');
      let b = fs.readFileSync(f);
      if (f.endsWith('/js/xapp.js')) b = b.toString().replace('    apk119Value2.addEventListener("click", apk119Value606);', '    window.__xReady=true; apk119Value2.addEventListener("click", apk119Value606);');
      if (f.endsWith('/js/library.js')) b = b.toString().replace(/\}\)\(\);\s*$/, `window.__library120={state,hydrate:handleAction_38,openPlaylist,openPlaylistCover120,savePlaylistCover120};})();`);
      if (f.endsWith('/js/imessage/4_chat_sheet.js')) b = b.toString().replace('function resolveOfflineApiConfig120(', 'window.__installOffline120=installOfflineApiPreset120;window.__resolveOffline120=resolveOfflineApiConfig120;function resolveOfflineApiConfig120(').replace('installOfflineApiPreset120(activeFriend_46, listEl);', 'window.__requestOffline120=value_297;installOfflineApiPreset120(activeFriend_46, listEl);');
      if (f.endsWith('/js/imessage/4_chat_bubbles.js')) b = b.toString().replace('const imageGenerationJobs120 = new Set();', 'window.__image120={reroll:rerollGeneratedChatImage,openPrompt:openChatImagePrompt120,openDetail:openChatImageDetail};const imageGenerationJobs120 = new Set();');
      res.end(b);
    } catch {
      res.statusCode = 404;
      res.end();
    }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  try {
    const page = await browser.newPage({
      viewport: {
        width: 390,
        height: 844
      },
      isMobile: true,
      hasTouch: true
    });
    page.on('pageerror', e => {
      errors.push(e.message);
      console.log('PAGEERROR', e.message);
    });
    await page.route('**/*', r => r.request().url().includes('127.0.0.1') ? r.continue() : r.abort());
    await page.addInitScript(() => {
      const realFetch = window.fetch;
      window.fetch = async (...args) => {
        if (window.__mockApi && String(args[0]).includes('test.invalid')) return window.__mockApi(...args);
        return realFetch(...args);
      };
    });
    await page.goto('http://127.0.0.1:' + server.address().port);
    await page.waitForFunction(() => window.__image120 && window.__library120?.state.ready && window.imChat?.handleAiReply && window.__xReady);
    await page.evaluate(async () => {
      await window.globalDataReadyPromise;
      document.getElementById('u2-login-screen')?.remove();
      document.body.classList.remove('u2-login-locked');
    });
    const check = async (name, fn, arg) => {
      const v = await page.evaluate(fn, arg);
      assert.equal(v, true, name + ': ' + JSON.stringify(v));
      passed.push(name);
      console.log('PASS', name);
    };
    await check('API stream defaults and preset-independent request/response modes across three providers', async () => {
      const api = window.u2Api;
      const sanitize = api.sanitizeApiConfig || api.normalizeApiConfig;
      let seen = [];
      window.__mockApi = async (url, opt) => {
        seen.push({
          url,
          body: JSON.parse(opt.body),
          headers: [...new Headers(opt.headers)]
        });
        const provider = url.includes('anthropic') ? 'anthropic' : url.includes('gemini') ? 'gemini' : 'openai';
        const events = provider === 'gemini' ? [{
          candidates: [{
            content: {
              parts: [{
                text: 'hello'
              }]
            },
            finishReason: 'STOP'
          }],
          usageMetadata: {
            promptTokenCount: 2,
            candidatesTokenCount: 1,
            totalTokenCount: 3
          }
        }] : provider === 'anthropic' ? [{
          type: 'message_start',
          message: {
            id: 'a',
            model: 'test',
            usage: {
              input_tokens: 2
            }
          }
        }, {
          type: 'content_block_delta',
          index: 0,
          delta: {
            type: 'text_delta',
            text: 'hello'
          }
        }, {
          type: 'message_delta',
          delta: {
            stop_reason: 'end_turn'
          },
          usage: {
            output_tokens: 1
          }
        }, {
          type: 'message_stop'
        }] : [{
          id: 'a',
          choices: [{
            index: 0,
            delta: {
              content: 'hello'
            },
            finish_reason: 'stop'
          }],
          usage: {
            prompt_tokens: 2,
            completion_tokens: 1,
            total_tokens: 3
          }
        }];
        return new Response(events.map(x => 'data: ' + JSON.stringify(x) + '\n\n').join('') + 'data: [DONE]\n\n', {
          headers: {
            'content-type': 'text/event-stream'
          }
        });
      };
      for (const provider of ['openai-compatible', 'gemini', 'anthropic']) {
        const cfg = {
          provider,
          endpoint: 'https://' + (provider === 'openai-compatible' ? 'openai' : provider) + '.test.invalid',
          apiKey: 'test',
          model: 'test',
          temperature: .7,
          streamEnabled: true
        };
        let response = await api.fetchChatCompletion(api.resolveChatCompletionsEndpoint(cfg.endpoint, provider), {
          method: 'POST',
          apiConfig: cfg,
          body: {
            model: 'test',
            messages: [{
              role: 'user',
              content: 'Hi'
            }],
            stream: false
          }
        });
        let data = await response.json();
        if (data.choices?.[0]?.message?.content !== 'hello') return {
          provider,
          data
        };
        if (!seen.at(-1).body.stream && provider !== 'gemini') return seen.at(-1);
        if (seen.at(-1).headers.some(([k]) => k.startsWith('x-u2-'))) return seen.at(-1);
        response = await api.fetchChatCompletion(api.resolveChatCompletionsEndpoint(cfg.endpoint, provider), {
          method: 'POST',
          apiConfig: {
            ...cfg,
            streamEnabled: false
          },
          streamOverride: true,
          body: {
            model: 'test',
            messages: [{
              role: 'user',
              content: 'Hi'
            }],
            stream: true
          }
        });
        if (!(await response.text()).includes('hello')) return 'stream output';
      }
      window.__mockApi = null;
      return true;
    });
    await check('Stream adapter rejects malformed/truncated SSE and propagates abort', async () => {
      for (const data of ['data: nope\n\n', 'data: ' + JSON.stringify({
        choices: [{
          index: 0,
          delta: {
            content: 'partial'
          }
        }]
      }) + '\n\n']) {
        let failed = false;
        try {
          await window.u2ApiStream.adaptResponse(new Response(data, {
            headers: {
              'content-type': 'text/event-stream'
            }
          }), {});
        } catch {
          failed = true;
        }
        if (!failed) return data;
      }
      const c = new AbortController();
      c.abort();
      try {
        await window.u2ApiStream.adaptResponse(new Response('data: [DONE]\n\n', {
          headers: {
            'content-type': 'text/event-stream'
          }
        }), {
          signal: c.signal
        });
        return false;
      } catch (e) {
        return e.name === 'AbortError';
      }
    });
    await check('All requested tutorial entrances open and X search is responsive', async () => {
      let seen = [];
      document.getElementById('app-x-btn').click();
      await new Promise(r => setTimeout(r, 700));
      const old = window.openAppGuideModal;
      window.openAppGuideModal = x => seen.push(x);
      try {
        for (const id of ['call-help-btn', 'yt-main-help-btn', 'x-home-guide-btn', 'bstage-help-btn', 'cphone-settings-help-btn']) {
          const b = document.getElementById(id);
          if (!b) return id;
          b.click();
        }
        const gear = [...document.querySelectorAll('button')].find(x => x.onclick?.toString().includes('Settings clicked'));
        if (gear) return 'old gear';
        window.imData.currentSettingsFriend = {
          id: 'tutorial',
          type: 'char'
        };
        document.getElementById('chat-settings-moments-btn').click();
        if (seen.length !== 6) return seen.map(x => x.title);
        document.querySelector('.line-header-right .fa-cog').click();
        if (!seen.at(-1).sections?.length) return false;
        if (document.querySelectorAll('#cphone-settings-help-btn').length !== 1 || document.querySelector('#friend-phone-home-guide-btn')) return false;
        document.getElementById('x-search-generate-btn').click();
        return document.getElementById('x-search-generate-sheet').classList.contains('active');
      } finally {
        window.openAppGuideModal = old;
      }
    });
    await check('Home tutorial action opens the branch add-character sheet', async () => {
      const old = window.openAppGuideModal;
      let guide;
      window.openAppGuideModal = x => guide = x;
      window.openImessageTutorial120();
      window.openAppGuideModal = old;
      const actions = guide.sections.map(x => x.action).filter(Boolean);
      if (actions.length !== 8) return actions.length;
      actions[0].onClick();
      await new Promise(r => setTimeout(r, 30));
      return document.getElementById('add-friend-sheet').classList.contains('active') && ['#nav-moments-btn', '#imessage-themes-btn', '#imessage-official-accounts-btn', '[data-imessage-service="stickers"]'].every(s => !!document.querySelector(s));
    });
    await check('Offline API selection validates configuration and preserves an independent stream setting', async () => {
      const old = window.getApiPresets,
        oldCfg = window.getApiConfig;
      window.getApiPresets = () => [{
        id: 'off',
        name: 'Offline',
        provider: 'openai-compatible',
        endpoint: 'https://off.test.invalid',
        apiKey: 'offline-key',
        model: 'offline-model',
        streamEnabled: false
      }, {
        id: 'bad',
        endpoint: '',
        apiKey: '',
        model: ''
      }];
      window.getApiConfig = () => ({
        endpoint: 'https://global.test.invalid',
        apiKey: 'global-key',
        model: 'global-model',
        streamEnabled: true
      });
      try {
        const a = window.__resolveOffline120({
          offlineApiPresetId: 'off',
          offlineStreamEnabled: true
        });
        if (a.apiKey !== 'offline-key' || a.streamEnabled !== false) return a;
        try {
          window.__resolveOffline120({
            offlineApiPresetId: 'bad'
          });
          return false;
        } catch {}
        return window.__resolveOffline120({}).model === 'global-model';
      } finally {
        window.getApiPresets = old;
        window.getApiConfig = oldCfg;
      }
    });
    await check('Playlist cover URL saves via real UI/storage and survives resync, reset and missing-record race', async () => {
      const a = window.appStorage,
        d = window.__library120;
      await a.saveLibraryPlaylistBundle({
        id: '120-list',
        name: 'Test',
        source: 'netease',
        coverUrl: 'https://test.invalid/default.jpg',
        trackIds: []
      }, []);
      await d.hydrate();
      d.openPlaylist(d.state.playlists.find(x => x.id === '120-list'));
      document.getElementById('library-playlist-cover-edit').click();
      const input = document.getElementById('library-playlist-cover-url');
      input.value = 'https://test.invalid/custom.jpg';
      await d.savePlaylistCover120({
        preventDefault() {}
      });
      let list = (await a.loadLibraryPlaylists()).find(x => x.id === '120-list');
      if (list.customCoverUrl !== input.value) return list;
      await a.saveLibraryPlaylistBundle({
        ...list,
        name: 'Synced',
        customCoverUrl: '',
        coverUrl: 'https://test.invalid/new.jpg'
      }, [], {
        replaceTracks: true,
        preserveCustomCover: true
      });
      list = (await a.loadLibraryPlaylists()).find(x => x.id === '120-list');
      if (list.customCoverUrl !== 'https://test.invalid/custom.jpg') return list;
      await d.hydrate();
      d.openPlaylist(list);
      d.openPlaylistCover120();
      await d.savePlaylistCover120({
        preventDefault() {}
      }, true);
      list = (await a.loadLibraryPlaylists()).find(x => x.id === '120-list');
      if (list.customCoverUrl) return list;
      let missing = false;
      try {
        await a.saveLibraryPlaylistBundle({
          id: 'missing',
          customCoverUrl: 'https://test.invalid/test'
        }, [], {
          patchPlaylist: true
        });
      } catch {
        missing = true;
      }
      return missing;
    });
    await check('Image placeholder opens prompt editor with subjects/reference options and rejects empty prompt', async () => {
      await window.imApp.commitFriendsChange(() => window.imData.friends.push(window.imApp.normalizeFriendData({
        id: '120-char',
        nickname: 'Test',
        type: 'char',
        language: 'en',
        messageCountMin: 1,
        messageCountMax: 1,
        timeAware: false,
        autoReplyEnabled: false,
        messages: []
      })), {
        silent: true
      });
      const f = window.imApp.getFriendById('120-char');
      await window.imApp.appendFriendMessage(f.id, {
        id: '120-image',
        type: 'image',
        role: 'assistant',
        content: window.imChat.CHAT_IMAGE_PLACEHOLDER_URL,
        timestamp: Date.now()
      }, {
        silent: true
      });
      await window.imApp.ensureFriendMessagesLoaded(f);
      const live = window.imApp.getFriendById(f.id),
        m = live.messages.find(x => x.id === '120-image');
      window.__image120.openPrompt(m, live, m.timestamp);
      const group = document.getElementById('modal-generation-subjects');
      if (group.hidden || !group.querySelectorAll('input').length) return group.outerHTML;
      try {
        await window.__image120.reroll(m, live, {
          prompt: '',
          config: {}
        });
        return false;
      } catch (e) {
        return e.message.includes('提示词');
      }
    });
    await check('Image reroll updates original message, validates reference flags and rejects deleted messages', async () => {
      const f = window.imApp.getFriendById('120-char'),
        m = f.messages.find(x => x.id === '120-image'),
        old = window.imChat.generateChatImage,
        faces = window.imChat.resolveImageReferenceFaces;
      let opts;
      window.imChat.resolveImageReferenceFaces = async () => [];
      window.imChat.generateChatImage = async (p, f, o) => (opts = o, {
        imageUrl: 'data:image/png;base64,iVBORw0KGgo=',
        compiledPrompt: p,
        provider: 'mock'
      });
      try {
        const x = await window.__image120.reroll(m, f, {
          prompt: 'Test scene',
          config: {
            includeCharAppearance: false,
            includeUserAppearance: false,
            useCharReferenceFace: true,
            useUserReferenceFace: true
          }
        });
        if (x.updatedMessage.imageRerollCount !== 1 || opts.includeCharAppearance !== false || x.updatedMessage.imageGenerationConfig.useCharReferenceFace !== false) return {
          x,
          opts
        };
        try {
          await window.__image120.reroll({
            ...m,
            id: 'deleted'
          }, f, {
            prompt: 'Test',
            config: {}
          });
          return false;
        } catch (e) {
          return e.message.includes('删除');
        }
      } finally {
        window.imChat.generateChatImage = old;
        window.imChat.resolveImageReferenceFaces = faces;
        document.getElementById('custom-modal-overlay')?.classList.remove('active');
      }
    });
    await check('Char model output displays invitation immediately and decline persists', async () => {
      document.getElementById('imessage-view').classList.add('active');
      const f = window.imApp.getFriendById('120-char');
      await window.imChat.openChatTab(f);
      const old = window.getApiConfig,
        u = window.u2Api;
      window.getApiConfig = () => ({
        endpoint: 'https://test.invalid/v1',
        apiKey: 'test',
        model: 'test'
      });
      let hasPrompt = false;
      window.u2Api = {
        ...u,
        fetchChatCompletion: async (url, o) => {
          hasPrompt = JSON.stringify(o.body).includes('线下邀请卡片');
          return new Response(JSON.stringify({
            choices: [{
              message: {
                content: '<chat_json>' + JSON.stringify([{
                  type: 'text',
                  text: 'Let us meet.',
                  translation: '我们见面吧。'
                }, {
                  type: 'offline_invite',
                  title: 'Coffee',
                  message: 'Meet at cafe?',
                  place: 'Cafe'
                }]) + '</chat_json>'
              }
            }]
          }), {
            headers: {
              'content-type': 'application/json'
            }
          });
        }
      };
      try {
        await window.imChat.handleAiReply(f, document.querySelector('#chat-interface-120-char .ins-chat-messages'), null, {
          source: 'manual',
          silent: true
        });
        const card = document.querySelector('#chat-interface-120-char .offline-invite-card');
        if (!card || !hasPrompt) return {
          card: !!card,
          hasPrompt
        };
        card.click();
        document.querySelector('[data-offline-invite-action="decline"]').click();
        for (let n = 0; n < 50; n++) {
          await new Promise(r => setTimeout(r, 20));
          if (window.imApp.getFriendById(f.id).messages.find(x => x.type === 'offline_invite')?.inviteStatus === 'declined') return true;
        }
        return window.imApp.getFriendById(f.id).messages.filter(x => x.type === 'offline_invite');
      } finally {
        window.getApiConfig = old;
        window.u2Api = u;
      }
    });
    await check('Invitation accept opens offline session, selector saves and refreshes when presets change', async () => {
      const id = '120-char',
        m = {
          id: '120-accept',
          type: 'offline_invite',
          role: 'assistant',
          title: 'Walk',
          invitationText: 'Meet at park',
          place: 'Park',
          inviteStatus: 'pending',
          timestamp: Date.now()
        };
      await window.imApp.appendFriendMessage(id, m, {
        silent: true
      });
      const ok = await window.imChat.acceptOfflineInvitation(id, m.id);
      const f = window.imApp.getFriendById(id);
      if (!ok || !f.offlineMeetingActive || f.messages.find(x => x.id === m.id)?.inviteStatus !== 'accepted') return {
        ok,
        f
      };
      const old = window.getApiPresets;
      window.getApiPresets = () => [{
        id: '120-off',
        name: 'Offline test',
        endpoint: 'https://test.invalid',
        apiKey: 'key',
        model: 'model',
        streamEnabled: false
      }];
      try {
        const host = document.createElement('div');
        document.body.appendChild(host);
        window.__installOffline120(f, host);
        const sel = host.querySelector('select');
        sel.value = '120-off';
        sel.dispatchEvent(new Event('change'));
        for (let n = 0; n < 50; n++) {
          await new Promise(r => setTimeout(r, 20));
          if (!sel.disabled) break;
        }
        if (window.imApp.getFriendById(id).offlineApiPresetId !== '120-off') return false;
        window.dispatchEvent(new Event('u2:api-presets-updated'));
        if (sel.value !== '120-off') return false;
        host.remove();
        return true;
      } finally {
        window.getApiPresets = old;
      }
    });
    await check('API stream switch saves through settings UI and reopens with the saved value', async () => {
      document.getElementById('api-config-btn').click();
      const input = (id, val) => {
        document.getElementById(id).value = val;
      };
      input('api-endpoint-input', 'https://test.invalid/v1');
      input('api-key-input', 'test');
      const model = document.getElementById('api-model-select');
      model.value = 'test';
      document.getElementById('api-stream-enabled').checked = true;
      document.getElementById('confirm-api-btn').click();
      for (let n = 0; n < 50; n++) {
        await new Promise(r => setTimeout(r, 20));
        if (window.getApiConfig().streamEnabled === true && !document.getElementById('confirm-api-btn').classList.contains('is-busy')) break;
      }
      document.getElementById('api-config-btn').click();
      return window.getApiConfig().streamEnabled === true && document.getElementById('api-stream-enabled').checked === true;
    });
    await check('NetEase QR uses iOS native gateway and preserves the returned QR', async () => {
      const old = window.u2NativeBridge;
      let requests = [];
      window.u2NativeBridge = {
        ...old,
        isNativeAndroid: () => false,
        isNativeIOS: () => true,
        requestNetEaseGateway: async r => {
          requests.push(r);
          return {
            status: 200,
            data: {
              key: '120-qr',
              qrImage: 'data:image/png;base64,iVBORw0KGgo=',
              expiresAt: Date.now() + 240000
            }
          };
        }
      };
      try {
        await window.libraryApp.startNetEaseQrLogin();
        const state = window.__library120.state;
        const valid = state.neteaseQrKey === '120-qr' && !!document.querySelector('#library-netease-qr img') && requests[0].method === 'POST';
        document.querySelector('#library-netease-login-modal [data-close-library-modal]').click();
        return valid;
      } finally {
        window.u2NativeBridge = old;
      }
    });
    await check('Custom modal retains iPad anti-stretch and branch background isolation', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad)',
        configurable: true
      });
      window.showCustomModal({
        type: 'prompt',
        generationPrompt: {
          showSubjects: true
        },
        isolateChatBackground: true
      });
      const el = document.getElementById('custom-modal-overlay');
      return el.classList.contains('is-ipad-image-generation') && el.dataset.keepBackground === 'true';
    });
    await page.reload();
    await page.evaluate(() => window.globalDataReadyPromise);
    await page.waitForFunction(() => window.__xReady && window.imApp?.getFriendById('120-char'));
    await page.waitForFunction(() => window.getApiConfig().model === 'test');
    await check('Invitation outcomes, offline preset and stream configuration survive reload', async () => {
      let f = window.imApp.getFriendById('120-char');
      await window.imApp.ensureFriendMessagesLoaded(f);
      f = window.imApp.getFriendById('120-char');
      return f.messages.some(x => x.type === 'offline_invite' && x.inviteStatus === 'declined') && f.messages.some(x => x.id === '120-accept' && x.inviteStatus === 'accepted') && f.offlineApiPresetId === '120-off' && window.getApiConfig().streamEnabled === true ? true : {
        messages: f.messages.map(x => ({
          type: x.type,
          status: x.inviteStatus
        })),
        preset: f.offlineApiPresetId,
        stream: window.getApiConfig().streamEnabled,
        stored: (await window.appStorage.readDomain('settings', {})).apiConfig
      };
    });
    assert.deepEqual(errors, []);
    console.log('RESULT', JSON.stringify({
      passed,
      errors
    }, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(e => {
  console.error(e.stack);
  process.exitCode = 1;
});
