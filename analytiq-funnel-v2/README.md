# AnalytIQ Funnel v2 (Simple + Agentic)

Clean, practical rebuild of the sales funnel.

## What you get

| Folder | What it is |
|--------|------------|
| `landing-page/` | Simple landing page with form, portfolio (Nigerian Army first), Google link |
| `dashboard/` | Next.js chat/lead management dashboard (deploy to Vercel) |
| `n8n/` | Workflow specification for AI answers, intent detection, handoff & follow-up |
| `docs/` | Architecture + knowledge base |

## Funnel (kept simple)

1. Prospect lands on the page (or WhatsApp)
2. Submits form → n8n webhook
3. AI answers from knowledge base + detects intent
4. Ready buyers are handed off to a human
5. Non-buyers get automatic follow-up later
6. Team manages everything from the dashboard

## Portfolio order
1. **Nigerian Army** – Officers Courses Nomination System (first)
2. Multi-branch Inventory
3. AI Restaurant Ordering
4. Hospital Dashboard

Image placeholders are used. Replace with real screenshots when ready.

## Google link
Added in header, hero and footer.  
Replace the search URL with your exact Google Business Profile link when you have it.

## Next steps (in order)

1. **Landing page**
   - Open `landing-page/index.html`
   - Replace `PASTE_N8N_WEBHOOK_URL_HERE` with your n8n production webhook
   - Host on Vercel / any static host
   - Point ads here

2. **n8n workflow**
   - Follow `n8n/WORKFLOW-SPEC.md`
   - Re-use or update the previous workflow
   - Keep the knowledge base as the only source of truth for answers

3. **Dashboard**
   ```bash
   cd dashboard
   npm install
   npm run dev
   ```
   - Connect to Supabase (or keep the mock data while testing)
   - Deploy to Vercel
   - Add simple auth before going live

4. **Follow-ups**
   - Configure the scheduled follow-up in n8n (Day 2–3 and Day 7)
   - Status changes in the dashboard stop further follow-ups

## Design notes
- Same dark navy + cyan + lime colour system as the main site
- Kept deliberately simple and fast
- Focused on conversion and handoff, not visual complexity

## WhatsApp number
Currently using: **+234 812 431 4217**

All form success states and CTAs push the customer to continue on WhatsApp.
