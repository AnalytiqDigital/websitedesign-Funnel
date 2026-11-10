# n8n Workflow Spec — AnalytIQ Lead + Intent + Follow-up

## Purpose
Receive form / chat data → answer from knowledge base → detect intent → qualify ready buyers → hand off → schedule follow-up if they do not convert.

## Webhook payload (from landing page)

```json
{
  "name": "Ada Okoro",
  "phone": "0803 123 4567",
  "email": "ada@example.com",
  "service": "AI automation or WhatsApp assistant",
  "message": "We run three shops...",
  "consent": true,
  "channel": "landing",
  "utm_source": "meta",
  "utm_campaign": "..."
}
```

## Core nodes (keep it simple)

1. **Webhook** (POST `/analytiq-lead`)
2. **Clean & Validate** (Code)
   - Normalise phone to +234...
   - Basic spam check (honeypot, disposable email patterns)
3. **AI: Answer + Classify** (Anthropic / OpenAI)
   - System prompt = knowledge base + rules
   - Output structured JSON:
     ```json
     {
       "reply": "Helpful answer based only on knowledge base...",
       "intent": "ready_to_buy | needs_info | price_check | support | spam | other",
       "score": 0-100,
       "service": "website | ai_automation | custom_software | erp | other",
       "urgency": "high | medium | low",
       "summary": "One sentence summary"
     }
     ```
4. **Apply Rules** (Code)
   - Hot if: score ≥ 70 OR intent = ready_to_buy OR explicit “send quote / call me / ready to start”
   - Warm if: contact details present + score 40–69
   - Cold otherwise
5. **Save / Update Lead** (Google Sheet or better: Supabase / Postgres)
   - One row per phone number
   - Columns: name, phone, email, service, message, intent, score, status, label, source, last_message, created_at, updated_at, follow_up_at, owner
6. **Handoff** (IF Hot)
   - Send email / WhatsApp notification to team
   - Include one-click “Reply on WhatsApp” link
   - Set label = `handoff` or `hot`
7. **Reply to customer** (optional in Phase 1)
   - Return the AI `reply` in the webhook response so the landing page can show it, or
   - In Phase 2: send the reply via WhatsApp Business API
8. **Follow-up Scheduler**
   - After 48–72 hours, if status is still not Won / Lost / Closed → trigger a polite follow-up message (or create a task in the dashboard)
   - Second follow-up after 7 days if still silent

## Labels the dashboard will use

- `new`
- `hot` / `handoff`
- `warm`
- `follow_up`
- `in_conversation`
- `closed`
- `won`
- `lost`
- `not_a_fit`

## Follow-up behaviour

If the customer did **not** patronise (status not Won / Closed after X days):
- Day 2–3: Soft follow-up (“Just checking if you still need help with…”)
- Day 7: Final check-in
- Then mark as `follow_up_done` or move to cold nurture

All follow-ups should be visible and controllable from the dashboard.

## Knowledge base
Keep using `docs/analytiq-knowledge-base.md`.  
Paste the content into the AI system message. Never let the AI invent prices or promises.

## Recommended data store
For the dashboard, prefer **Supabase** (Postgres) over Google Sheets once you go live. Sheets is fine for testing.
