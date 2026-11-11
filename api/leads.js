module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Invalid form submission.' });
  }

  if (typeof body.name !== 'string' || !body.name.trim()) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }
  if (typeof body.phone !== 'string' || body.phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'Please enter a WhatsApp number we can reach.' });
  }
  if (typeof body.service !== 'string' || !body.service.trim()) {
    return res.status(400).json({ error: 'Please select a website or service type.' });
  }
  if (typeof body.budget !== 'string' || !body.budget.trim()) {
    return res.status(400).json({ error: 'Please select your estimated project budget.' });
  }
  if (body.consent !== true) {
    return res.status(400).json({ error: 'Please agree to be contacted before submitting.' });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('N8N_WEBHOOK_URL is not configured.');
    return res.status(500).json({ error: 'Lead service is not configured. Set N8N_WEBHOOK_URL in Vercel and redeploy.' });
  }

  let destination;
  try {
    destination = new URL(webhookUrl);
  } catch (error) {
    console.error('N8N_WEBHOOK_URL is not a valid URL.');
    return res.status(500).json({ error: 'Lead service configuration is invalid.' });
  }
  if (destination.protocol !== 'https:') {
    console.error('N8N_WEBHOOK_URL must use HTTPS.');
    return res.status(500).json({ error: 'Lead service configuration is invalid.' });
  }

  let response;
  try {
    response = await fetch(destination, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error('Could not reach the n8n webhook:', error);
    return res.status(502).json({ error: 'Could not reach the lead service. Please try again or contact us on WhatsApp.' });
  }

  if (!response.ok) {
    console.error(`The n8n webhook returned HTTP ${response.status}.`);
    return res.status(502).json({
      error: `The n8n webhook returned HTTP ${response.status}. Check the production webhook URL, workflow activation, and latest n8n execution.`,
    });
  }

  return res.status(200).json({ ok: true });
};
