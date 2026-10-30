(function () {
  const apk120Value1 = (apk120Value9, apk120Value10 = 'invalid_stream') => Object["assign"](new Error(apk120Value9), {
      'name': "ApiResponseError",
      'code': apk120Value10
    }),
    apk120Value2 = () => new DOMException("API request cancelled", "AbortError"),
    apk120Value3 = apk120Value11 => ({
      'STOP': "stop",
      'END_TURN': "stop",
      'TOOL_USE': "tool_calls",
      'FUNCTION_CALL': "tool_calls",
      'MAX_TOKENS': 'length',
      'MAX_TOKENS_REACHED': "length",
      'SAFETY': "content_filter"
    })[String(apk120Value11 || '')["toUpperCase"]()] || String(apk120Value11 || '').toLowerCase();
  async function* apk120Value4(apk120Value12, apk120Value13) {
    const apk120Value14 = apk120Value12["body"]["getReader"](),
      apk120Value15 = new TextDecoder();
    let apk120Value16 = '';
    const apk120Value17 = () => {
      apk120Value14["cancel"]()["catch"](() => {});
    };
    apk120Value13?.addEventListener('abort', apk120Value17, {
      'once': !![]
    });
    const apk120Value18 = apk120Value19 => {
      const apk120Value20 = apk120Value19["split"](/\r\n|\n|\r/);
      return apk120Value20["filter"](apk120Value21 => apk120Value21["startsWith"]("data:"))["map"](apk120Value22 => apk120Value22.slice(0x5).replace(/^ /, ''))["join"]('\x0a');
    };
    try {
      while (!![]) {
        if (apk120Value13?.["aborted"]) throw apk120Value2();
        const {
          done: apk120Value23,
          value: apk120Value24
        } = await apk120Value14.read();
        if (apk120Value13?.["aborted"]) throw apk120Value2();
        apk120Value16 += apk120Value23 ? apk120Value15["decode"]() : apk120Value15["decode"](apk120Value24, {
          'stream': !![]
        });
        let apk120Value25;
        while (apk120Value25 = /\r\n\r\n|\n\n|\r\r/.exec(apk120Value16)) {
          const apk120Value26 = apk120Value18(apk120Value16["slice"](0x0, apk120Value25["index"]));
          apk120Value16 = apk120Value16.slice(apk120Value25["index"] + apk120Value25[0x0].length);
          if (apk120Value26) yield apk120Value26;
        }
        if (apk120Value23) {
          const apk120Value27 = apk120Value18(apk120Value16);
          if (apk120Value27) yield apk120Value27;
          break;
        }
      }
    } finally {
      apk120Value13?.removeEventListener('abort', apk120Value17), await apk120Value14["cancel"]()['catch'](() => {}), apk120Value14["releaseLock"]();
    }
  }
  async function* apk120Value5(apk120Value28, {
    provider: apk120Value29,
    model: apk120Value30,
    signal: apk120Value31
  }) {
    let apk120Value32 = ![],
      apk120Value33 = (apk120Value29 || 'chat') + '-' + Date["now"](),
      apk120Value34 = apk120Value30 || '',
      apk120Value35 = 0x0;
    const apk120Value36 = new Map(),
      apk120Value37 = (apk120Value38 = {}, apk120Value39 = null, apk120Value40) => ({
        'id': apk120Value33,
        'object': "chat.completion.chunk",
        'created': Math["floor"](Date["now"]() / 0x3e8),
        'model': apk120Value34,
        'choices': [{
          'index': 0x0,
          'delta': apk120Value38,
          'finish_reason': apk120Value39
        }],
        ...(apk120Value40 ? {
          'usage': apk120Value40
        } : {})
      });
    for await (const apk120Value41 of apk120Value4(apk120Value28, apk120Value31)) {
      if (apk120Value41 === "[DONE]") {
        apk120Value32 = !![];
        break;
      }
      let apk120Value42;
      try {
        apk120Value42 = JSON["parse"](apk120Value41);
      } catch (apk120Value43) {
        throw apk120Value1('API\x20returned\x20an\x20invalid\x20SSE\x20event');
      }
      if (apk120Value42.error || apk120Value42["type"] === "error") throw apk120Value1(String(apk120Value42["error"]?.["message"] || apk120Value42["message"] || "API stream failed"), "stream_error");
      if (apk120Value29 === "gemini") {
        const apk120Value44 = apk120Value42["candidates"]?.[0x0];
        for (const apk120Value46 of apk120Value44?.["content"]?.["parts"] || []) {
          if (typeof apk120Value46.text === 'string') yield apk120Value37({
            [apk120Value46["thought"] ? "reasoning_content" : "content"]: apk120Value46.text
          });
          if (apk120Value46["functionCall"]?.["name"]) {
            const apk120Value47 = apk120Value46["functionCall"],
              apk120Value48 = apk120Value47.id || apk120Value36["size"] + ':' + apk120Value47["name"],
              apk120Value49 = apk120Value36["has"](apk120Value48) ? apk120Value36["get"](apk120Value48) : apk120Value36["size"];
            apk120Value36["set"](apk120Value48, apk120Value49), yield apk120Value37({
              'tool_calls': [{
                'index': apk120Value49,
                'id': apk120Value47.id || "gemini-call-" + apk120Value49,
                'type': 'function',
                'function': {
                  'name': apk120Value47.name,
                  'arguments': JSON["stringify"](apk120Value47.args || {})
                }
              }]
            });
          }
        }
        if (apk120Value44?.["finishReason"]) apk120Value32 = !![];
        const apk120Value45 = apk120Value42["usageMetadata"];
        if (apk120Value44?.finishReason || apk120Value45) yield apk120Value37({}, apk120Value44?.["finishReason"] ? apk120Value36["size"] ? "tool_calls" : apk120Value3(apk120Value44.finishReason) : null, apk120Value45 ? {
          'prompt_tokens': Number(apk120Value45["promptTokenCount"]) || 0x0,
          'completion_tokens': Number(apk120Value45["candidatesTokenCount"]) || 0x0,
          'total_tokens': Number(apk120Value45["totalTokenCount"]) || 0x0
        } : undefined);
      } else {
        if (apk120Value29 === "anthropic") {
          const apk120Value50 = Number(apk120Value42["index"]) || 0x0;
          if (apk120Value42["type"] === "message_start") apk120Value33 = apk120Value42["message"]?.id || apk120Value33, apk120Value34 = apk120Value42["message"]?.model || apk120Value34, apk120Value35 = Number(apk120Value42["message"]?.usage?.["input_tokens"]) || 0x0, yield apk120Value37({}, null, {
            'prompt_tokens': apk120Value35
          });else {
            if (apk120Value42["type"] === "content_block_start") {
              const apk120Value51 = apk120Value42["content_block"] || {};
              if (apk120Value51["type"] === "text" && apk120Value51["text"]) yield apk120Value37({
                'content': apk120Value51["text"]
              });
              if (apk120Value51["type"] === "thinking" && apk120Value51["thinking"]) yield apk120Value37({
                'reasoning_content': apk120Value51["thinking"]
              });
              if (apk120Value51.type === "tool_use") yield apk120Value37({
                'tool_calls': [{
                  'index': apk120Value50,
                  'id': apk120Value51.id,
                  'type': 'function',
                  'function': {
                    'name': apk120Value51.name,
                    'arguments': apk120Value51.input && Object["keys"](apk120Value51["input"])["length"] ? JSON["stringify"](apk120Value51["input"]) : ''
                  }
                }]
              });
            } else {
              if (apk120Value42["type"] === "content_block_delta") {
                const apk120Value52 = apk120Value42.delta || {};
                if (apk120Value52["type"] === 'text_delta') yield apk120Value37({
                  'content': apk120Value52["text"] || ''
                });
                if (apk120Value52.type === "thinking_delta") yield apk120Value37({
                  'reasoning_content': apk120Value52.thinking || ''
                });
                if (apk120Value52["type"] === "input_json_delta") yield apk120Value37({
                  'tool_calls': [{
                    'index': apk120Value50,
                    'function': {
                      'arguments': apk120Value52.partial_json || ''
                    }
                  }]
                });
              } else {
                if (apk120Value42["type"] === "message_delta") {
                  const apk120Value53 = Number(apk120Value42.usage?.["output_tokens"]) || 0x0;
                  yield apk120Value37({}, apk120Value3(apk120Value42["delta"]?.["stop_reason"]) || null, {
                    'prompt_tokens': apk120Value35,
                    'completion_tokens': apk120Value53,
                    'total_tokens': apk120Value35 + apk120Value53
                  });
                } else {
                  if (apk120Value42["type"] === 'message_stop') apk120Value32 = !![];
                }
              }
            }
          }
        } else {
          if (apk120Value42["choices"]?.["some"](apk120Value54 => apk120Value54["finish_reason"])) apk120Value32 = !![];
          yield apk120Value42;
        }
      }
    }
    if (!apk120Value32) throw apk120Value1("API stream ended before completion", 'stream_truncated');
  }
  function apk120Value6(apk120Value55, apk120Value56) {
    const apk120Value57 = new Headers(apk120Value55["headers"]);
    return apk120Value57["set"]("Content-Type", apk120Value56), apk120Value57["delete"]("Content-Length"), apk120Value57["delete"]("Content-Encoding"), apk120Value57;
  }
  async function apk120Value7(apk120Value58, apk120Value59) {
    const apk120Value60 = new Map();
    let apk120Value61 = {},
      apk120Value62 = {};
    for await (const apk120Value64 of apk120Value58) {
      for (const apk120Value65 of ['id', "model", "created", "system_fingerprint", "service_tier"]) {
        if (apk120Value64[apk120Value65] !== undefined) apk120Value61[apk120Value65] = apk120Value64[apk120Value65];
      }
      if (apk120Value64["usage"]) apk120Value62 = {
        ...apk120Value62,
        ...apk120Value64["usage"]
      };
      for (const apk120Value66 of apk120Value64["choices"] || []) {
        const apk120Value67 = Number(apk120Value66["index"]) || 0x0;
        if (!apk120Value60["has"](apk120Value67)) apk120Value60["set"](apk120Value67, {
          'index': apk120Value67,
          'message': {
            'role': "assistant",
            'content': ''
          },
          'finish_reason': null,
          'calls': new Map()
        });
        const apk120Value68 = apk120Value60["get"](apk120Value67),
          apk120Value69 = apk120Value66["delta"] || apk120Value66["message"] || {};
        if (typeof apk120Value69.content === "string") apk120Value68["message"].content += apk120Value69.content;
        const apk120Value70 = apk120Value69["reasoning_content"] ?? apk120Value69.reasoning;
        if (typeof apk120Value70 === "string") apk120Value68["message"]["reasoning_content"] = (apk120Value68.message["reasoning_content"] || '') + apk120Value70;
        if (Array["isArray"](apk120Value69.reasoning_details)) apk120Value68.message["reasoning_details"] = [...(apk120Value68["message"]["reasoning_details"] || []), ...apk120Value69.reasoning_details];
        if (apk120Value69["refusal"]) apk120Value68["message"]["refusal"] = (apk120Value68.message["refusal"] || '') + apk120Value69["refusal"];
        for (const apk120Value71 of apk120Value69["tool_calls"] || []) {
          const apk120Value72 = Number(apk120Value71["index"]) || 0x0;
          if (!apk120Value68["calls"]["has"](apk120Value72)) apk120Value68["calls"].set(apk120Value72, {
            'id': '',
            'type': 'function',
            'function': {
              'name': '',
              'arguments': ''
            }
          });
          const apk120Value73 = apk120Value68["calls"]["get"](apk120Value72);
          if (apk120Value71.id) apk120Value73.id = apk120Value71.id;
          if (apk120Value71["type"]) apk120Value73.type = apk120Value71["type"];
          if (apk120Value71['function']?.name) apk120Value73["function"].name += apk120Value71['function']["name"];
          if (apk120Value71["function"]?.arguments) apk120Value73["function"]["arguments"] += apk120Value71['function']["arguments"];
        }
        if (apk120Value69["function_call"]) {
          const apk120Value74 = apk120Value68["message"]["function_call"] ||= {
            'name': '',
            'arguments': ''
          };
          apk120Value74["name"] += apk120Value69.function_call["name"] || '', apk120Value74["arguments"] += apk120Value69["function_call"].arguments || '';
        }
        if (apk120Value66.finish_reason) apk120Value68["finish_reason"] = apk120Value66.finish_reason;
      }
    }
    const apk120Value63 = [...apk120Value60["values"]()]["sort"]((apk120Value75, apk120Value76) => apk120Value75["index"] - apk120Value76["index"])["map"](({
      calls: apk120Value77,
      ...apk120Value78
    }) => {
      if (apk120Value77.size) apk120Value78["message"]["tool_calls"] = [...apk120Value77["entries"]()]["sort"]((apk120Value79, apk120Value80) => apk120Value79[0x0] - apk120Value80[0x0])["map"](([, apk120Value81]) => {
        if (!apk120Value81["function"]["arguments"]) apk120Value81["function"].arguments = '{}';
        return apk120Value81;
      });
      return apk120Value78;
    });
    return new Response(JSON["stringify"]({
      ...apk120Value61,
      'object': 'chat.completion',
      'choices': apk120Value63,
      ...(Object["keys"](apk120Value62)["length"] ? {
        'usage': apk120Value62
      } : {})
    }), {
      'status': apk120Value59.status,
      'statusText': apk120Value59.statusText,
      'headers': apk120Value6(apk120Value59, "application/json")
    });
  }
  async function apk120Value8(apk120Value82, apk120Value83 = {}) {
    if (!/text\/event-stream/i.test(apk120Value82.headers.get('Content-Type') || '')) return apk120Value82;
    if (apk120Value83.responseStream && !["gemini", "anthropic"]["includes"](apk120Value83["provider"])) return apk120Value82;
    if (!apk120Value83["responseStream"]) return apk120Value7(apk120Value5(apk120Value82, apk120Value83), apk120Value82);
    const apk120Value84 = new AbortController(),
      apk120Value85 = () => apk120Value84["abort"]();
    if (apk120Value83["signal"]?.["aborted"]) apk120Value84.abort();else apk120Value83["signal"]?.["addEventListener"]("abort", apk120Value85, {
      'once': !![]
    });
    const apk120Value86 = apk120Value5(apk120Value82, {
        ...apk120Value83,
        'signal': apk120Value84.signal
      }),
      apk120Value87 = new TextEncoder(),
      apk120Value88 = () => apk120Value83["signal"]?.removeEventListener("abort", apk120Value85),
      apk120Value89 = new ReadableStream({
        async 'pull'(apk120Value90) {
          try {
            const {
              value: apk120Value91,
              done: apk120Value92
            } = await apk120Value86["next"]();
            if (apk120Value92) apk120Value90["enqueue"](apk120Value87.encode('data:\x20[DONE]\x0a\x0a')), apk120Value90["close"](), apk120Value88();else apk120Value90["enqueue"](apk120Value87["encode"]('data:\x20' + JSON["stringify"](apk120Value91) + '\x0a\x0a'));
          } catch (apk120Value93) {
            apk120Value90["error"](apk120Value93), apk120Value88();
          }
        },
        async 'cancel'() {
          apk120Value84["abort"](), await apk120Value86["return"](), apk120Value88();
        }
      });
    return new Response(apk120Value89, {
      'status': apk120Value82.status,
      'statusText': apk120Value82["statusText"],
      'headers': apk120Value6(apk120Value82, 'text/event-stream;\x20charset=utf-8')
    });
  }
  window["u2ApiStream"] = Object["freeze"]({
    'adaptResponse': apk120Value8
  });
})();