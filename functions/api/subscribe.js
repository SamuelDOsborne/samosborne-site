/*
  POST /api/subscribe — adds a free-exercise sign-up to MailerLite, which starts the
  "Under-Your-Skin Welcome" email sequence.
  Runs as a Cloudflare Pages Function. Needs two values in Cloudflare:
    Pages project > Settings > Variables and Secrets
      MAILERLITE_API_KEY   (type: Secret)
      MAILERLITE_GROUP_ID  (the ID of the "Under-Your-Skin Exercise" group)
  GET /api/subscribe returns {"configured": true|false} so setup can be checked
  without revealing anything. Nothing is logged or stored here. Formspree and the
  Google Sheet keep receiving every sign-up as before; this only adds MailerLite.
*/

const ALLOWED = [/^https:\/\/(www\.)?samosborne\.net$/, /^https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.pages\.dev$/, /^https:\/\/[a-z0-9-]+\.pages\.dev$/, /^http:\/\/localhost(:\d+)?$/];
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000, max = 10;
  const arr = (hits.get(ip) || []).filter(t => now - t < win);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}

function json(body, status = 200, origin) {
  const h = { 'content-type': 'application/json', 'cache-control': 'no-store' };
  if (origin) { h['access-control-allow-origin'] = origin; h['vary'] = 'origin'; }
  return new Response(JSON.stringify(body), { status, headers: h });
}

function clean(v, n) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n); }

export async function onRequestGet({ env }) {
  return json({ configured: !!(env.MAILERLITE_API_KEY && env.MAILERLITE_GROUP_ID) });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('origin') || '';
  if (origin && !ALLOWED.some(r => r.test(origin))) return json({ ok: false, error: 'origin' }, 403);
  if (!env.MAILERLITE_API_KEY || !env.MAILERLITE_GROUP_ID) return json({ ok: false, error: 'not_configured' }, 503, origin);

  const ip = request.headers.get('cf-connecting-ip') || 'x';
  if (limited(ip)) return json({ ok: false, error: 'rate' }, 429, origin);

  let b = {};
  try {
    const type = request.headers.get('content-type') || '';
    if (type.includes('application/json')) b = await request.json();
    else b = Object.fromEntries(await request.formData());
  } catch (e) { return json({ ok: false, error: 'body' }, 400, origin); }

  if (b._gotcha) return json({ ok: true }, 200, origin); // bot: pretend success
  const email = clean(b.email, 254).toLowerCase();
  if (!EMAIL.test(email)) return json({ ok: false, error: 'email' }, 400, origin);
  const name = clean(b.first_name, 60).split(' ')[0];
  const source = clean(b.source, 60).toLowerCase() || 'website';

  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'authorization': 'Bearer ' + env.MAILERLITE_API_KEY,
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({ email, fields: { name, source }, groups: [String(env.MAILERLITE_GROUP_ID)] })
  }).catch(() => null);

  if (!res || !res.ok) return json({ ok: false, error: 'mailerlite', status: res ? res.status : 0 }, 502, origin);
  return json({ ok: true }, 200, origin);
}
