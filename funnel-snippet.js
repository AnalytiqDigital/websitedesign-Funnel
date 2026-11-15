/*
 * Connect your sales funnel (https://websitedesignfunnel.vercel.app/) to the AnalytIQ workflow.
 *
 * What it does: when the visitor submits the funnel form, it sends their details to your n8n
 * "Funnel intake" webhook, which saves them to Google Sheets and replies with a WhatsApp link
 * that already contains their name, the service they chose and a reference code. The visitor
 * is then sent straight to your AI assistant on WhatsApp.
 *
 * HOW TO USE (plain HTML / any framework):
 * 1. Replace FUNNEL_WEBHOOK below with the Production URL of workflow "AnalytIQ 1 - Funnel intake".
 * 2. Make sure your form has fields named (or with ids): name, phone (WhatsApp number), email,
 *    service (the option they pick), and optionally business, message, budget, timeline.
 *    Other common names such as full_name, whatsapp, service_needed also work.
 * 3. Add this script before </body>, or paste the submitFunnel() function into your own submit handler.
 */
var FUNNEL_WEBHOOK = 'PASTE_N8N_FUNNEL_WEBHOOK_URL_HERE';

function submitFunnel(data) {
  // data = plain object of the form fields, e.g. { name, phone, email, service, message }
  var p = new URLSearchParams(location.search), utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) { if (p.get(k)) utm[k] = p.get(k); });
  var payload = Object.assign({}, data, utm, { page: location.href, website_url: '' });
  return fetch(FUNNEL_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    .then(function (r) { return r.json(); })
    .then(function (res) {
      if (!res.ok) throw new Error(res.error || 'Something went wrong. Please try again.');
      try { if (window.fbq) fbq('track', 'Lead'); if (window.gtag) gtag('event', 'generate_lead'); } catch (e) {}
      window.location.href = res.redirectUrl; // opens WhatsApp with the message pre-filled
    });
}

/* Optional: automatic hook for a normal <form>. Delete this block if you call submitFunnel() yourself. */
document.addEventListener('submit', function (e) {
  var form = e.target;
  if (!form || form.dataset.aqSkip) return;
  e.preventDefault();
  var data = {};
  new FormData(form).forEach(function (v, k) { data[k] = v; });
  var btn = form.querySelector('[type=submit]'); if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = 'Opening WhatsApp...'; }
  submitFunnel(data).catch(function (err) {
    if (btn) { btn.disabled = false; btn.textContent = btn.dataset.t || 'Submit'; }
    alert(err.message);
  });
});

/*
 * REACT / NEXT.JS example:
 *   async function onSubmit(e) {
 *     e.preventDefault();
 *     const res = await fetch(process.env.NEXT_PUBLIC_FUNNEL_WEBHOOK, {
 *       method: 'POST', headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ name, phone, email, service, message, page: location.href }),
 *     }).then(r => r.json());
 *     if (res.ok) window.location.href = res.redirectUrl; else setError(res.error);
 *   }
 */
