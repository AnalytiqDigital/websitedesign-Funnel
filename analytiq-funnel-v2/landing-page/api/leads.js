export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Lead service is not configured' });
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });

  if (!response.ok) {
    return res.status(502).json({ error: 'Lead service request failed' });
  }

  return res.status(200).json({ ok: true });
}