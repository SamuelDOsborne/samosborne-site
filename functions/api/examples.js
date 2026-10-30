/*
  POST /api/examples — writes examples for the Under-Your-Skin exercise from what the person typed.
  Runs as a Cloudflare Pages Function. Needs one secret in Cloudflare:
    Pages project > Settings > Variables and Secrets > ANTHROPIC_API_KEY (Production, type: Secret)
  Optional: AI_MODEL (defaults to claude-haiku-5-5).
  Nothing is logged or stored here. If the key is missing or the AI fails, the page keeps its built-in examples.
*/

const MODEL = 'claude-haiku-5-5';
const MAX_FIELD = 600;
const ALLOWED = [/^https:\/\/(www\.)?samosborne\.net$/, /^https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.pages\.dev$/, /^https:\/\/[a-z0-9-]+\.pages\.dev$/, /^http:\/\/localhost(:\d+)?$/];
const AREA_KEYS = ['spiritual', 'mental', 'vocational', 'financial', 'family', 'social', 'physical'];

// best-effort limit per visitor, per server instance
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000, max = 40;
  const arr = (hits.get(ip) || []).filter(t => now - t < win);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}

const SYSTEM = `You write short examples for a self-reflection exercise based on the Demartini Method. A person is working on one other person whose behaviour gets under their skin. Your examples sit behind a "See examples" link and show the person what a good answer looks like for their own situation. They are prompts, never verdicts.

Rules for every example (except where the task says the examples must be labels or verdicts):
- Concrete and observable: something a camera could record (words said, a body doing something). No judgment words (manipulative, rude, selfish, narcissist, controlling, toxic, unfair), no scale words (always, never, constantly), no effect-on-me language (made me feel, hurt me).
- Plain, warm, everyday English. Relatable to professionals, partners and families. Mix settings where it makes sense.
- Never diagnose anyone, never take sides, never tell the person what they feel, never give advice about the relationship.
- Keep each example under 22 words.
- If the input is empty, nonsense, or not about a person's behaviour, return the JSON shape with general, universal examples.
- If the input mentions self-harm, abuse, violence or crisis, return the JSON shape with gentle general examples and nothing that touches those details.
- Output only valid JSON in the exact shape asked for. No markdown, no commentary.`;

function clip(v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, MAX_FIELD); }

function context(b) {
  const lines = [];
  if (b.kind) lines.push(`Relationship: ${b.kind}`);
  if (b.name) lines.push(`What's going on (their words): ${b.name}`);
  if (b.words) lines.push(`What the other person did, in their own words: ${b.words}`);
  if (b.literal) lines.push(`The literal line (what was said or done): ${b.literal}`);
  if (b.sting) lines.push(`The part that still stings: ${b.sting}`);
  if (b.mf) lines.push(`Their Motor Function (the action in 3-4 words): ${b.mf}`);
  return lines.length ? lines.join('\n') : '(nothing typed yet)';
}

const TASKS = {
  words: {
    need: b => b.name || b.kind,
    ask: `This step invites the person to vent: to say what the other person did using the labels and verdicts they really think, before the exercise strips those labels away. Write 3 examples of how someone in a situation like this might put it, using a LABEL or VERDICT about the other person (e.g. "She's so bossy.", "He treats me like a child.", "My boss is a liar."). Do NOT restate or paraphrase the person's own sentence, and do not describe the literal action; the examples must be judgments, not facts. Vary the labels. Under 8 words each, first person, plain everyday speech.
Shape: {"items":["...","...","..."]}`,
    check: r => Array.isArray(r.items) && r.items.length ? { items: r.items.slice(0, 4).map(clip) } : null
  },
  literal: {
    need: b => b.words,
    ask: `Take the labels and verdicts in what they wrote ("in their own words") and, for each of up to 3 of them, show what a camera might have caught instead: a plausible literal line or action that fits their situation. Use their label as "label" (short, in quotes-free form, e.g. "Bossy"). The "literal" is one sentence, past tense, e.g. She said, "Put that down and do this first."
Shape: {"pairs":[{"label":"...","literal":"..."}]}`,
    check: r => Array.isArray(r.pairs) && r.pairs.length ? { pairs: r.pairs.slice(0, 4).filter(p => p && p.label && p.literal).map(p => ({ label: clip(p.label), literal: clip(p.literal) })) } : null
  },
  sting: {
    need: b => b.literal,
    ask: `Write one sentence that shows where the charge might sit inside their literal line, naming 2-3 specific parts of it, in this form: In "<short quote from their line>," the charge might sit in <part>, <part>, or <part>.
Shape: {"text":"..."}`,
    check: r => r.text ? { text: clip(r.text) } : null
  },
  mf: {
    need: b => b.words || b.literal,
    ask: `For their situation, write 3 or 4 Motor Functions: the action under each label, in 3-4 words, starting with a physical verb a camera could record (e.g. "Looks away while I speak", "Promises what isn't delivered", "Tells me what not-to-do"). Use their label as "label" where they gave one.
Shape: {"pairs":[{"label":"...","mf":"..."}]}`,
    check: r => Array.isArray(r.pairs) && r.pairs.length ? { pairs: r.pairs.slice(0, 4).filter(p => p && p.label && p.mf).map(p => ({ label: clip(p.label), mf: clip(p.mf) })) } : null
  },
  mirror: {
    need: b => b.mf,
    ask: `The person is now looking for where THEY have done the same action as their Motor Function, in any form, at any scale. For each of the seven areas of life, give 2 short places to look, written as prompts in the second person past tense (e.g. Told your partner "This weekend I'll fix it," then didn't). These are places to look, not conclusions about the person. Match the action in the Motor Function as closely as possible.
Areas: spiritual, mental, vocational (work/career), financial, family (family and partner), social, physical (body/health).
Shape: {"areas":{"spiritual":["...","..."],"mental":[...],"vocational":[...],"financial":[...],"family":[...],"social":[...],"physical":[...]}}`,
    check: areas
  },
  benefits: {
    need: b => b.mf,
    ask: `The person is now looking for how the other person's action (their Motor Function) has served them since it happened. For each of the seven areas of life, give 2 short, concrete, believable ways this could have helped someone in their situation (e.g. Negotiated harder on your next offer). Second person, past or present tense. Be specific to their situation where you can.
Areas: spiritual, mental, vocational (work/career), financial, family (family and partner), social, physical (body/health).
Shape: {"areas":{"spiritual":["...","..."],"mental":[...],"vocational":[...],"financial":[...],"family":[...],"social":[...],"physical":[...]}}`,
    check: areas
  }
};

function areas(r) {
  if (!r || !r.areas) return null;
  const out = {}; let n = 0;
  AREA_KEYS.forEach(k => { const a = Array.isArray(r.areas[k]) ? r.areas[k].slice(0, 3).map(clip).filter(Boolean) : []; out[k] = a; n += a.length; });
  return n ? { areas: out } : null;
}


async function runTask(step, input, env) {
  const task = TASKS[step];
  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: env.AI_MODEL || MODEL,
        max_tokens: 900,
        system: SYSTEM,
        messages: [{ role: 'user', content: `What the person has typed so far:\n${context(input)}\n\nTask:\n${task.ask}` }]
      })
    });
  } catch (e) { return { error: 'ai unreachable', detail: e.message }; }
  if (!res.ok) {
    let detail = '';
    try { const e = await res.json(); detail = (e.error && (e.error.type + ': ' + e.error.message)) || ''; } catch (e) {}
    console.log('examples: AI error', res.status, detail);
    return { error: 'ai error', status: res.status, detail };
  }

  let out = null, text = '';
  try {
    const data = await res.json();
    text = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
    const raw = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
    out = task.check(JSON.parse(raw));
  } catch (e) { out = null; }
  if (!out) { console.log('examples: unreadable AI reply', step, text.slice(0, 500)); return { error: 'unreadable', detail: text.slice(0, 500) }; }
  return { out };
}

function json(obj, status = 200, origin = '') {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(origin ? { 'access-control-allow-origin': origin, 'vary': 'origin' } : {})
    }
  });
}

// GET /api/examples          -> is it set up?
// GET /api/examples?test=1   -> also sends a tiny test request to the AI and reports the result
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url), model = env.AI_MODEL || MODEL;
  const out = { function: 'running', key: env.ANTHROPIC_API_KEY ? 'found' : 'MISSING', model };
  if (url.searchParams.get('test') && env.ANTHROPIC_API_KEY) {
    if (limited(request.headers.get('cf-connecting-ip') || 'x')) return json({ ...out, test: 'slow down' }, 429);
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model, max_tokens: 5, messages: [{ role: 'user', content: 'Say OK.' }] })
      });
      let body = {}; try { body = await r.json(); } catch (e) {}
      out.test = r.ok ? 'AI replied OK' : ('AI error ' + r.status + (body.error ? ' ' + body.error.type + ': ' + body.error.message : ''));
    } catch (e) { out.test = 'could not reach the AI: ' + e.message; }
  }
  const step = url.searchParams.get('test');
  if (step && TASKS[step] && env.ANTHROPIC_API_KEY) {
    const sample = { kind: 'A family member', name: 'My sister told me not to talk to the bar staff', words: 'She was bossy and a narcissist',
      literal: 'She said, "Please don\'t be like Dad and talk to the female bar staff."', sting: 'be like Dad', mf: 'Tells me what not-to-do' };
    const r = await runTask(step, sample, env);
    out.sample = r.error ? r : r.out;
  }
  return json(out);
}

export async function onRequestOptions({ request }) {
  const origin = request.headers.get('origin') || '';
  if (!ALLOWED.some(rx => rx.test(origin))) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'POST', 'access-control-allow-headers': 'content-type', 'access-control-max-age': '86400' } });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('origin') || '';
  if (origin && !ALLOWED.some(rx => rx.test(origin))) return json({ error: 'origin' }, 403);
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'not configured' }, 503, origin);
  const ip = request.headers.get('cf-connecting-ip') || 'x';
  if (limited(ip)) return json({ error: 'slow down' }, 429, origin);

  let b;
  try { b = await request.json(); } catch (e) { return json({ error: 'bad request' }, 400, origin); }
  const step = String(b.step || '');
  const task = TASKS[step];
  if (!task) return json({ error: 'unknown step' }, 400, origin);
  const input = {
    kind: clip(b.kind), name: clip(b.name), words: clip(b.words), literal: clip(b.literal),
    sting: clip(Array.isArray(b.sting) ? b.sting.join(' / ') : b.sting), mf: clip(b.mf)
  };
  if (!task.need(input)) return json({ error: 'nothing to work from' }, 422, origin);

  const r = await runTask(step, input, env);
  if (r.error) return json(r, 502, origin);
  return json({ step, ...r.out }, 200, origin);
}

