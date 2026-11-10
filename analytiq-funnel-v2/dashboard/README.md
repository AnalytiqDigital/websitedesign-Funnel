# AnalytIQ Chat & Lead Dashboard

Simple internal dashboard for managing leads and WhatsApp conversations.

Deploy to Vercel.

## Features

- View all leads / chats
- See customer phone numbers
- Filter by labels (Hot, Warm, Follow-up, Closed, Won, Lost…)
- Close a chat
- Mark as responded / take over from AI handoff
- Quick “Reply on WhatsApp” button
- Search by name or phone
- Basic stats (new today, hot open, follow-ups due)

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase (recommended) or any Postgres
- Deploy on Vercel

## Quick start

```bash
cd dashboard
npm install
cp .env.example .env.local
# Add your Supabase / database URL and service key
npm run dev
```

## Environment

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Database table (suggested)

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text unique,
  email text,
  service text,
  message text,
  intent text,
  score int,
  status text default 'new',
  label text default 'new',
  source text,
  summary text,
  last_message text,
  owner text,
  follow_up_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## Security

This is an internal tool. Protect it with:
- Vercel Authentication / Password protection, or
- Simple login (NextAuth / Supabase Auth)

Do not expose the dashboard publicly without auth.
