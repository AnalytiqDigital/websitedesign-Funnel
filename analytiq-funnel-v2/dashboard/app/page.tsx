'use client';

import { useMemo, useState } from 'react';

type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  intent?: string;
  score?: number;
  status: string;
  label: string;
  source?: string;
  summary?: string;
  created_at: string;
  follow_up_at?: string;
};

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Ada Okoro',
    phone: '+2348031234567',
    email: 'ada@example.com',
    service: 'AI automation',
    message: 'We run three shops and still count stock by hand.',
    intent: 'ready_to_buy',
    score: 82,
    status: 'open',
    label: 'hot',
    source: 'landing',
    summary: 'Multi-shop inventory pain. Ready for quote.',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Chinedu Bello',
    phone: '+2348124314999',
    service: 'Website',
    message: 'Need a new site for our clinic.',
    intent: 'needs_info',
    score: 55,
    status: 'open',
    label: 'warm',
    source: 'whatsapp',
    summary: 'Clinic website enquiry.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    follow_up_at: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: '3',
    name: 'Ngozi Eze',
    phone: '+2347012345678',
    service: 'Custom software',
    intent: 'price_check',
    score: 40,
    status: 'open',
    label: 'follow_up',
    source: 'landing',
    summary: 'Asked about custom software pricing.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

const LABELS = ['all', 'hot', 'warm', 'follow_up', 'in_conversation', 'closed', 'won', 'lost'];

const labelStyle: Record<string, string> = {
  hot: 'bg-red-500/20 text-red-300 border-red-500/40',
  warm: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  follow_up: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  in_conversation: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  closed: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
  won: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  lost: 'bg-zinc-600/20 text-zinc-400 border-zinc-600/40',
  new: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchLabel = filter === 'all' || l.label === filter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.email || '').toLowerCase().includes(q);
      return matchLabel && matchSearch;
    });
  }, [leads, filter, search]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      hot: leads.filter((l) => l.label === 'hot').length,
      followUps: leads.filter((l) => l.label === 'follow_up').length,
      open: leads.filter((l) => l.status === 'open').length,
    };
  }, [leads]);

  function updateLead(id: string, patch: Partial<Lead>) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    if (selected?.id === id) setSelected((s) => (s ? { ...s, ...patch } : s));
  }

  function closeChat(id: string) {
    updateLead(id, { status: 'closed', label: 'closed' });
  }

  function markResponded(id: string) {
    updateLead(id, { status: 'open', label: 'in_conversation' });
  }

  function markWon(id: string) {
    updateLead(id, { status: 'closed', label: 'won' });
  }

  return (
    <div className="min-h-screen bg-[#070914] text-[#f7f8ff]">
      {/* Header */}
      <header className="border-b border-[#2a3150] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">AnalytIQ · Chat Desk</h1>
          <p className="text-sm text-[#aeb6d3]">Manage leads, handoffs and follow-ups</p>
        </div>
        <div className="flex gap-3 text-sm">
          <span className="px-3 py-1 rounded bg-[#101426] border border-[#2a3150]">
            Open: <strong>{stats.open}</strong>
          </span>
          <span className="px-3 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-300">
            Hot: <strong>{stats.hot}</strong>
          </span>
          <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300">
            Follow-ups: <strong>{stats.followUps}</strong>
          </span>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar filters */}
        <aside className="w-56 border-r border-[#2a3150] p-4 space-y-4">
          <div>
            <label className="text-xs text-[#aeb6d3] uppercase tracking-wider">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or phone"
              className="mt-1 w-full rounded border border-[#2a3150] bg-[#101426] px-3 py-2 text-sm outline-none focus:border-[#30e7ff]"
            />
          </div>
          <div>
            <p className="text-xs text-[#aeb6d3] uppercase tracking-wider mb-2">Labels</p>
            <div className="space-y-1">
              {LABELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setFilter(l)}
                  className={`w-full text-left px-3 py-1.5 rounded text-sm capitalize transition ${
                    filter === l
                      ? 'bg-[#30e7ff]/15 text-[#30e7ff] border border-[#30e7ff]/40'
                      : 'text-[#aeb6d3] hover:bg-[#101426]'
                  }`}
                >
                  {l.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Lead list */}
        <main className="flex-1 overflow-y-auto">
          <div className="divide-y divide-[#2a3150]">
            {filtered.length === 0 && (
              <p className="p-8 text-[#aeb6d3] text-sm">No leads match this filter.</p>
            )}
            {filtered.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setSelected(lead)}
                className={`w-full text-left px-6 py-4 hover:bg-[#101426] transition flex items-start gap-4 ${
                  selected?.id === lead.id ? 'bg-[#101426]' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold truncate">{lead.name}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded border capitalize ${
                        labelStyle[lead.label] || labelStyle.new
                      }`}
                    >
                      {lead.label.replace('_', ' ')}
                    </span>
                    {lead.score !== undefined && (
                      <span className="text-[11px] text-[#aeb6d3]">Score {lead.score}</span>
                    )}
                  </div>
                  <p className="text-sm text-[#aeb6d3] truncate">{lead.phone}</p>
                  <p className="text-sm text-[#dfe3f5] truncate mt-0.5">
                    {lead.summary || lead.message || '—'}
                  </p>
                </div>
                <div className="text-xs text-[#aeb6d3] whitespace-nowrap">
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </main>

        {/* Detail panel */}
        <aside className="w-[380px] border-l border-[#2a3150] p-5 overflow-y-auto">
          {!selected ? (
            <p className="text-[#aeb6d3] text-sm">Select a lead to view details and act.</p>
          ) : (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold">{selected.name}</h2>
                <p className="text-[#30e7ff] font-mono text-sm mt-1">{selected.phone}</p>
                {selected.email && (
                  <p className="text-sm text-[#aeb6d3]">{selected.email}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded border capitalize ${
                    labelStyle[selected.label] || labelStyle.new
                  }`}
                >
                  {selected.label.replace('_', ' ')}
                </span>
                {selected.intent && (
                  <span className="text-xs px-2 py-1 rounded border border-[#2a3150] text-[#aeb6d3]">
                    {selected.intent}
                  </span>
                )}
                {selected.score !== undefined && (
                  <span className="text-xs px-2 py-1 rounded border border-[#2a3150] text-[#aeb6d3]">
                    Score {selected.score}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-[#aeb6d3]">Service: </span>
                  {selected.service || '—'}
                </p>
                <p>
                  <span className="text-[#aeb6d3]">Source: </span>
                  {selected.source || '—'}
                </p>
                <p>
                  <span className="text-[#aeb6d3]">Summary: </span>
                  {selected.summary || '—'}
                </p>
              </div>

              {selected.message && (
                <div className="rounded border border-[#2a3150] bg-[#101426] p-3 text-sm">
                  <p className="text-[#aeb6d3] text-xs mb-1">Customer message</p>
                  {selected.message}
                </div>
              )}

              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/${selected.phone.replace('+', '')}?text=${encodeURIComponent(
                    `Hi ${selected.name}, this is AnalytIQ following up on your enquiry.`
                  )}`}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center gap-2 w-full rounded bg-[#25d366] text-[#04210f] font-semibold py-2.5 text-sm hover:opacity-90"
                >
                  Reply on WhatsApp
                </a>

                <button
                  onClick={() => markResponded(selected.id)}
                  className="w-full rounded border border-[#30e7ff]/50 text-[#30e7ff] py-2 text-sm hover:bg-[#30e7ff]/10"
                >
                  Mark as responded / take over
                </button>

                <button
                  onClick={() => closeChat(selected.id)}
                  className="w-full rounded border border-[#2a3150] text-[#aeb6d3] py-2 text-sm hover:bg-[#101426]"
                >
                  Close chat
                </button>

                <button
                  onClick={() => markWon(selected.id)}
                  className="w-full rounded border border-emerald-500/40 text-emerald-300 py-2 text-sm hover:bg-emerald-500/10"
                >
                  Mark as Won
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
