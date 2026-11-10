# AnalytIQ Funnel v2 — Simple Architecture

## Goal
Keep the funnel simple, answer customers with the knowledge base, detect intent, qualify ready buyers, hand them off to a human, follow up non-buyers, and give the team a clean dashboard to manage everything.

## Flow (simple)

```
1. Ad / Website / Google
        │
        ▼
2. Landing page form  ──────►  n8n Webhook
   (or direct WhatsApp)              │
                                     ▼
3. n8n workflow
   • Clean phone/email
   • AI answers from knowledge base
   • Detect intent + score
   • Save / update lead
   • If ready buyer → Handoff (alert + label)
   • Schedule follow-up if no conversion
        │
        ▼
4. WhatsApp number (business)
   Customer continues conversation here.
   AI can reply (Phase 2) or human takes over after handoff.
        │
        ▼
5. Dashboard (Vercel)
   • See all chats / leads
   • Filter by label (Hot, Warm, Follow-up, Closed…)
   • Close chats
   • Respond to AI handoffs
   • View customer numbers
```

## Key pieces

| Piece | Status in this package | Notes |
|-------|------------------------|-------|
| Landing page | Ready | Simple, portfolio with Nigerian Army first, Google link, form |
| Knowledge base | Copied from previous package | Keep updated |
| n8n workflow | Needs update | See `n8n/WORKFLOW-SPEC.md` |
| Chat / Lead Dashboard | Scaffold ready | Next.js → deploy to Vercel |
| Follow-up automation | Specified | n8n scheduled + status checks |

## WhatsApp strategy (practical)

**Phase 1 (now – simplest):**
- Form submits → n8n → AI classifies + saves lead → sends handoff email/SMS + pre-filled WhatsApp link for the team.
- Customer is told “We will reply on WhatsApp”.
- Team replies manually from the business WhatsApp number.
- Dashboard shows the leads so nothing is lost.

**Phase 2 (when ready):**
- Connect WhatsApp Business Platform (Cloud API) to n8n.
- AI can auto-reply using the same knowledge base.
- Ready buyers are still handed off to human.
- Dashboard becomes the place to take over AI conversations.

## Portfolio order (as requested)
1. Nigerian Army – Officers Courses Nomination System (first)
2. Multi-branch Inventory
3. AI Restaurant Ordering
4. Hospital Dashboard

Use image placeholders until real assets are ready.

## Google link
Added in header, hero, and footer pointing to Google search for “AnalytIQ Digital Solutions Abuja”.
Replace with your exact Google Business Profile link when you have it.
