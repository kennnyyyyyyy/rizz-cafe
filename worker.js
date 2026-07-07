// Krishna's Rizz Cafe — Cloudflare module Worker (AI proxy)
// Forwards the game's {system, messages} to the OpenAI Chat Completions API,
// keeping the API key server-side. CORS-open so GitHub Pages can call it.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }
    if (request.method !== 'POST') {
      return json({ error: 'POST only' }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'invalid JSON body' }, 400);
    }

    const { system, messages } = body || {};
    if (!system || !Array.isArray(messages)) {
      return json({ error: 'expected { system, messages }' }, 400);
    }
    if (!env.OPENAI_API_KEY) {
      return json({ error: 'OPENAI_API_KEY not configured' }, 500);
    }

    try {
      const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 350,
          response_format: { type: 'json_object' },
          // OpenAI takes the system prompt as a message, not a top-level field.
          messages: [{ role: 'system', content: system }, ...messages],
        }),
      });

      const data = await upstream.json();
      return json(data, upstream.status);
    } catch (err) {
      return json({ error: 'upstream fetch failed', detail: String(err) }, 502);
    }
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', ...CORS },
  });
}
