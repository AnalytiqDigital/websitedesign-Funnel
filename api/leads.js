/*
 * Vercel serverless function for your funnel project: /api/leads.js
 * It receives the form from the funnel page and forwards it to your n8n workflow
 * "AnalytIQ 1 - Funnel intake", so the n8n address stays private and there are no browser CORS problems.
 *
 * Setup: in the funnel's Vercel project, Settings, Environment Variables, add
 *   N8N_FUNNEL_WEBHOOK = the Production URL of the "Funnel Form Webhook" node (ends in /webhook/analytiq-funnel)
 * then redeploy.
 *
 * This is the CommonJS version. If your funnel's package.json contains "type": "module",
 * replace the first line with:  export default async function handler(req, res) {
 * and delete the last line (module.exports...).
 */
async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'Method not allowed' }); }
  const url = process.env.N8N_FUNNEL_WEBHOOK;
  if (!url) return res.status(500).json({ ok: false, error: 'The form is not connected yet. Please use WhatsApp instead.' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body && typeof body === 'object' ? body : {};

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || data.ok === false) return res.status(r.status === 422 ? 422 : 502).json({ ok: false, error: data.error || 'We could not save your details. Please try WhatsApp instead.' });
    return res.status(200).json({ ok: true, redirectUrl: data.redirectUrl, ref: data.ref });
  } catch (e) {
    return res.status(504).json({ ok: false, error: 'That took too long. Please try again or use WhatsApp.' });
  } finally {
    clearTimeout(timer);
  }
}
module.exports = handler;
