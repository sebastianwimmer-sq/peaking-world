// 🧠 AI Brain V2 — memo dashboard with detail drawer, inbox cross-link, timeline, mind-map.
// Builder-voice: "Decisions tracked. Brain externalized."

const { useState, useEffect, useMemo, useRef } = React;

// ============================================================
// DATA — memo store + inbox + cross-references
// ============================================================
const STATUS = {
  active:   { label: 'Active',   color: '#FFA94D', dot: '#FFA94D' },
  triaged:  { label: 'Triaged',  color: '#a78bfa', dot: '#a78bfa' },
  done:     { label: 'Done',     color: '#34d399', dot: '#34d399' },
  archived: { label: 'Archived', color: '#64748b', dot: '#64748b' },
};

const BRANDS = {
  peakingworld:   { handle: '@peakingworld',   color: '#FFA94D' },
  vegetarianhulk: { handle: '@vegetarianhulk', color: '#10b981' },
  smashtheapp:    { handle: '@smashtheapp',    color: '#39FF14' },
  shared:         { handle: 'cross-brand',     color: '#94a3b8' },
};

const MEMOS = [
  {
    id: 'm-101',
    title: 'Why we ditched the algo-feed for hand-curated home',
    status: 'done',
    brands: ['peakingworld'],
    tags: ['design', 'feed'],
    modified: '14 May 2026 · 09:14',
    size: '4.8 KB',
    refs: ['m-103', 'm-108', 'm-110'],
    inbox: false,
    body: `## Context
Algo-feed = engagement trap. Builder-creators don't need a TikTok-clone home screen — they need a **decision dashboard**.

## Decision
Replace ML feed with **3 hand-curated stacks**:
1. **Today's cut** — single highest-priority post action
2. **In flight** — 2–4 reels in production right now
3. **Last 7 days** — performance table, no algo curation

## Why
- Cuts cognitive load 4×
- Aligns with the "always peaking" mental model: *today's peak*, not infinite scroll
- Easier to ship — 1 feed query vs. 6 ML services

## Open questions
- Should "Today's cut" auto-rotate at midnight or stay until done?
- Do we need a *forced* archive of "Last 7 days" rows past 14d?

## Source
Decision call · Sebi + Claude · 13 May 2026 16:42.`,
  },
  {
    id: 'm-102',
    title: 'Drop SMASH-green from PEAKING surfaces — incl. sub-brand crossover',
    status: 'done',
    brands: ['shared'],
    tags: ['brand', 'a11y'],
    modified: '13 May 2026 · 22:01',
    size: '2.1 KB',
    refs: ['m-105', 'm-109'],
    inbox: false,
    body: `## Decision
PEAKING is sunrise-only. **SMASH-green (#39FF14) is forbidden** on any peaking.world surface, even when displaying @smashtheapp data.

## Carry-over
- Brand switcher avatar may use #39FF14 inside its own pill
- All UI chrome (buttons, links, headers) stays sunrise

## Why
Two brands × one tool ≠ visual collision. The chrome is PEAKING; the *content* can carry brand colors safely.`,
  },
  {
    id: 'm-103',
    title: 'Hook Library v3 — pattern-tags from cut-level transcripts',
    status: 'active',
    brands: ['peakingworld', 'vegetarianhulk'],
    tags: ['ai', 'reel-edit'],
    modified: '14 May 2026 · 06:48',
    size: '6.2 KB',
    refs: ['m-101', 'm-106'],
    inbox: false,
    body: `## Spec
Every cut produced by Reel-Edit-Assistant emits a **hook-pattern tag** (contrarian-take · stat-reveal · pattern-interrupt · …). These feed the Hook Library.

## Source-of-truth
\`hooks.json\` lives in repo; Whisper-cuts get classified by Claude (Haiku) and the tag is written back.

## Next
- Add **win-rate** column once we have 30+ reels labelled
- Surface "your best-performing pattern" on the @peakingworld home stack`,
  },
  {
    id: 'm-104',
    title: 'Recording light — daylight only. No ring lights.',
    status: 'active',
    brands: ['vegetarianhulk'],
    tags: ['production', 'aesthetic'],
    modified: '12 May 2026 · 18:30',
    size: '1.4 KB',
    refs: ['m-107'],
    inbox: true,
    body: `## Standing rule
@vegetarianhulk content is **outdoor-light only**. No ring lights, no indoor key-light.

## Why
- Brand is outdoor-rooted; the aesthetic falls apart with studio lighting
- 5am — 7am golden hour is the sweet spot; that's "always peaking" visually too`,
  },
  {
    id: 'm-105',
    title: 'Beta-access through DM, not a form',
    status: 'triaged',
    brands: ['peakingworld'],
    tags: ['onboarding', 'gtm'],
    modified: '12 May 2026 · 14:00',
    size: '2.9 KB',
    refs: ['m-102'],
    inbox: false,
    body: `## Decision
No "Apply for beta" form on peaking.world. Beta-access goes through **DM on @peakingworld** only.

## Why
- 1:1 conversation filters tire-kickers
- Builds public-build voice; replies are themselves content
- Form-leads expect a SaaS, we're selling a stack`,
  },
  {
    id: 'm-106',
    title: 'Whisper local vs. cloud — keep local, accept the speed cost',
    status: 'done',
    brands: ['peakingworld'],
    tags: ['ai', 'infra', 'privacy'],
    modified: '11 May 2026 · 11:22',
    size: '3.6 KB',
    refs: ['m-103'],
    inbox: false,
    body: `## Decision
Whisper.cpp runs **locally** on the creator's machine. Cloud transcribe is faster but trades the privacy promise.

## Trade
- ~28s for a 2-min clip locally (M-series Mac)
- Cloud would be ~6s, ~$0.006/clip
- We ship local for v1; revisit if Sebi himself stops using it

## Source
Decision · 10 May 2026.`,
  },
  {
    id: 'm-107',
    title: 'Sunrise stops are non-negotiable — coral 0% → orange 50% → yellow 100%',
    status: 'archived',
    brands: ['shared'],
    tags: ['brand', 'tokens'],
    modified: '08 May 2026 · 13:09',
    size: '0.9 KB',
    refs: ['m-102'],
    inbox: false,
    body: `## Canonical
The sunrise gradient has **three stops at fixed positions**:
- \`#FF6B6B\` at 0%
- \`#FFA94D\` at 50%
- \`#FFD43B\` at 100%
- Angle: **135deg**, always.

No 2-stop sunrise on text. 2-stop is fine on solid buttons (\`#FFA94D → #FF6B6B\`).`,
  },
  {
    id: 'm-108',
    title: 'Inbox vs. memo — inbox = raw, memo = decided',
    status: 'active',
    brands: ['peakingworld'],
    tags: ['workflow', 'ai-brain'],
    modified: '14 May 2026 · 08:02',
    size: '1.8 KB',
    refs: ['m-101'],
    inbox: false,
    body: `## Distinction
**Inbox-Item** = anything raw — Voice memo, Drafts.app note, Slack-to-self, screenshot.
**Memo** = a *decision* with title, body, status. Memos are forever; inbox items are processed.

## Rule
Every inbox item must be either:
1. Triaged into a memo (with title), or
2. Discarded with a one-liner reason.

No item lives in the inbox > 14 days.`,
  },
  {
    id: 'm-109',
    title: 'Pillar-color != brand-color — and the gym/sunrise collision',
    status: 'done',
    brands: ['vegetarianhulk'],
    tags: ['brand', 'tokens'],
    modified: '09 May 2026 · 16:55',
    size: '1.2 KB',
    refs: ['m-102'],
    inbox: false,
    body: `## Reminder
Pillar tokens (Outdoor green / Gym amber / Mindset purple / Plant-based lime) categorize *content*. They are **not brand**.

## Watch
Gym amber #f59e0b is almost identical to Sunrise orange #FFA94D. In branded contexts always reach for the brand token, not the pillar one.`,
  },
  {
    id: 'm-110',
    title: 'Posting cadence: cluster Mo/Mi/Fr — never daily',
    status: 'active',
    brands: ['peakingworld', 'vegetarianhulk'],
    tags: ['cadence', 'gtm'],
    modified: '13 May 2026 · 19:40',
    size: '2.3 KB',
    refs: ['m-101', 'm-105'],
    inbox: false,
    body: `## Cadence
Cluster posting Mon / Wed / Fri (sometimes +Sat for @vegetarianhulk). Daily posting collapses the production loop.

## Why
- 3-day gap lets us watch the metric react before shipping the next reel
- "Always peaking" ≠ "always posting" — that confusion would kill us`,
  },
  {
    id: 'm-111',
    title: 'Voice-memo → memo pipeline (Notes.app + Whisper)',
    status: 'active',
    brands: ['peakingworld'],
    tags: ['workflow', 'ai-brain', 'inbox'],
    modified: '14 May 2026 · 12:15',
    size: '2.4 KB',
    refs: ['m-108'],
    inbox: true,
    body: `## Pipeline
1. Apple Voice Memo at 5am
2. Sync → folder, picked up by watcher
3. Whisper transcribes
4. Lands in Inbox with action: triage to memo or discard

## State
Working in shell. Need UI surface in AI Brain V2.`,
  },
];

// 7 inbox-pending items (in addition to the 2 above with inbox:true)
const INBOX_ITEMS = [
  { id: 'i-1', title: 'Voice 5:02 — "what if cut-score was per-account"', source: 'Voice', age: '2h' },
  { id: 'i-2', title: 'Screenshot — Cursor agent loop debug', source: 'Screen', age: '6h' },
  { id: 'i-3', title: 'Slack-self — "kill the OG metric for ER"', source: 'Slack', age: '8h' },
  { id: 'i-4', title: 'Drafts.app — captions language switch logic', source: 'Drafts', age: '11h' },
  { id: 'i-5', title: 'Voice 18:30 — "ditch the OG analytics"', source: 'Voice', age: '14h' },
  { id: 'i-6', title: 'Web clip — Linear blog post on Sentinel', source: 'Web', age: '1d' },
  { id: 'i-7', title: 'Voice 04:55 — "rec light = morning only"', source: 'Voice', age: '1d' },
];

// ============================================================
// HELPERS
// ============================================================
const daysAgo = (iso) => {
  const d = new Date(iso.replace(/(\d+) (\w+) (\d+) · (\d+):(\d+)/, '$3-05-$1T$4:$5'));
  const diff = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diff;
};
const memoById = (id) => MEMOS.find(m => m.id === id);

// Render very-light markdown → React (handles ## headings, - lists, **bold**, `code`)
function renderMD(text) {
  const lines = text.split('\n');
  const blocks = [];
  let listBuf = [];
  const flushList = () => {
    if (listBuf.length) {
      blocks.push(<ul key={blocks.length} style={{ margin: '6px 0 12px', paddingLeft: 20, color: '#cbd5e1', fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: 1.55 }}>
        {listBuf.map((li, i) => <li key={i} style={{ marginBottom: 4 }}>{renderInline(li)}</li>)}
      </ul>);
      listBuf = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushList(); continue; }
    if (line.startsWith('## ')) {
      flushList();
      blocks.push(<h3 key={blocks.length} style={{
        margin: '14px 0 6px', fontFamily: 'Inter, sans-serif',
        fontSize: 13, fontWeight: 800, color: '#FFA94D',
        letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>{line.slice(3)}</h3>);
      continue;
    }
    if (line.startsWith('- ') || /^\d+\.\s/.test(line)) {
      listBuf.push(line.replace(/^- |^\d+\.\s/, ''));
      continue;
    }
    flushList();
    blocks.push(<p key={blocks.length} style={{
      margin: '0 0 10px', fontFamily: 'Inter, sans-serif',
      fontSize: 13, lineHeight: 1.6, color: '#cbd5e1',
    }}>{renderInline(line)}</p>);
  }
  flushList();
  return blocks;
}
function renderInline(text) {
  // **bold** + `code`
  const parts = [];
  let rest = text;
  let key = 0;
  while (rest.length) {
    const bold = rest.match(/^(.*?)\*\*([^*]+)\*\*(.*)$/);
    const code = rest.match(/^(.*?)`([^`]+)`(.*)$/);
    const first = [bold, code].filter(Boolean).sort((a, b) => a[1].length - b[1].length)[0];
    if (!first) { parts.push(rest); break; }
    if (first === bold) {
      if (bold[1]) parts.push(bold[1]);
      parts.push(<strong key={key++} style={{ color: '#fff', fontWeight: 700 }}>{bold[2]}</strong>);
      rest = bold[3];
    } else {
      if (code[1]) parts.push(code[1]);
      parts.push(<code key={key++} style={{
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: 11.5, padding: '1px 5px', borderRadius: 4,
        background: 'rgba(255,169,77,0.10)', color: '#FFA94D',
        border: '1px solid rgba(255,169,77,0.2)',
      }}>{code[2]}</code>);
      rest = code[3];
    }
  }
  return parts;
}

// ============================================================
// CARD (shared glass)
// ============================================================
function Card({ children, padding = 18, style, hover = false }) {
  return (
    <div style={{
      background: 'rgba(30,41,59,0.6)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      padding,
      ...style,
    }}>{children}</div>
  );
}

// ============================================================
// STATUS PIP
// ============================================================
function StatusPip({ status }) {
  const s = STATUS[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 99,
      fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase',
      color: s.color, background: `${s.color}1f`, border: `1px solid ${s.color}44`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: s.dot, boxShadow: `0 0 6px ${s.dot}` }}/>
      {s.label}
    </span>
  );
}

// ============================================================
// BRAND TAG
// ============================================================
function BrandTag({ brandKey }) {
  const b = BRANDS[brandKey];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '1px 7px', borderRadius: 99,
      fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600,
      color: b.color, background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${b.color}33`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: b.color }}/>
      {b.handle}
    </span>
  );
}

// ============================================================
// INBOX CONNECTOR
// ============================================================
function InboxConnector({ count, onOpen }) {
  return (
    <button onClick={onOpen} style={{
      width: '100%', padding: 0, background: 'transparent', border: 'none', cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        padding: '12px 16px', borderRadius: 12,
        background: 'linear-gradient(135deg, rgba(255,107,107,0.10), rgba(255,169,77,0.14) 50%, rgba(255,212,59,0.10))',
        border: '1px solid rgba(255,169,77,0.30)',
        transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,169,77,0.5)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,169,77,0.18)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,169,77,0.30)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            display: 'grid', placeItems: 'center', position: 'relative',
            background: 'linear-gradient(135deg, #FFA94D, #FF6B6B)',
            boxShadow: '0 6px 16px rgba(255,169,77,0.4)',
            fontSize: 18,
          }}>
            📥
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 16, height: 16, borderRadius: 99,
              background: '#0f172a', border: '2px solid #FFA94D',
              fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 800,
              color: '#FFA94D', display: 'grid', placeItems: 'center',
            }}>{count}</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {count} pending Inbox-Items
            </div>
            <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2 }}>
              Voice · Drafts · Slack · Screen — click to triage
            </div>
          </div>
        </div>
        <span style={{
          padding: '6px 12px', borderRadius: 8,
          background: 'rgba(15,23,42,0.7)',
          border: '1px solid rgba(255,169,77,0.3)',
          fontSize: 11, fontWeight: 700, color: '#FFA94D',
          display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>
          Triage now <span style={{ fontSize: 13 }}>→</span>
        </span>
      </div>
    </button>
  );
}

// ============================================================
// HEADER
// ============================================================
function Header({ view, setView }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: '#FFA94D', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Module · V2</span>
          <span style={{ width: 3, height: 3, borderRadius: 99, background: '#475569' }}/>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#64748b' }}>peaking.world / brain</span>
        </div>
        <h1 style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: 34, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1 }}>🧠 AI Brain</h1>
        <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 13 }}>
          <span style={{ color: '#FFA94D', fontWeight: 600 }}>Decisions tracked. Brain externalized.</span> · 11 memos · {INBOX_ITEMS.length} pending
        </p>
      </div>
      <div style={{ display: 'inline-flex', padding: 3, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, gap: 2 }}>
        {[
          { id: 'list',     label: 'List',     icon: '☰' },
          { id: 'timeline', label: 'Timeline', icon: '┃' },
          { id: 'mindmap',  label: 'Mind-Map', icon: '◌' },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            padding: '6px 14px', borderRadius: 7,
            background: view === t.id ? 'rgba(255,169,77,0.15)' : 'transparent',
            border: view === t.id ? '1px solid rgba(255,169,77,0.3)' : '1px solid transparent',
            color: view === t.id ? '#FFA94D' : '#94a3b8',
            fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', transition: 'all 120ms',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 11, opacity: 0.8 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </header>
  );
}

// ============================================================
// FILTERS BAR
// ============================================================
function Filters({ query, setQuery, status, setStatus, range, setRange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) auto auto', gap: 10, marginBottom: 16, flexWrap: 'wrap' }} className="filters-grid">
      <div style={{
        position: 'relative',
        background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, padding: '0 12px 0 36px',
        display: 'flex', alignItems: 'center',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
          <circle cx="6" cy="6" r="4" stroke="#94a3b8" strokeWidth="1.5" fill="none"/>
          <path d="M9 9l4 4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search memos · titles, tags, body"
          style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 13, padding: '10px 0' }}/>
      </div>

      <PillGroup options={[
        { k: 'all', label: 'All' },
        { k: 'active', label: 'Active' },
        { k: 'triaged', label: 'Triaged' },
        { k: 'done', label: 'Done' },
      ]} value={status} onChange={setStatus}/>

      <PillGroup options={[
        { k: '7d', label: 'Last 7d' },
        { k: '30d', label: '30d' },
        { k: 'all', label: 'All-time' },
      ]} value={range} onChange={setRange}/>
    </div>
  );
}

function PillGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', padding: 3, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, gap: 2 }}>
      {options.map(o => (
        <button key={o.k} onClick={() => onChange(o.k)} style={{
          padding: '7px 12px', borderRadius: 7,
          background: value === o.k ? 'rgba(255,169,77,0.15)' : 'transparent',
          border: value === o.k ? '1px solid rgba(255,169,77,0.3)' : '1px solid transparent',
          color: value === o.k ? '#FFA94D' : '#94a3b8',
          fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700,
          cursor: 'pointer', transition: 'all 120ms',
        }}>{o.label}</button>
      ))}
    </div>
  );
}

// ============================================================
// MEMO ROW
// ============================================================
function MemoRow({ memo, onOpen, active }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => onOpen(memo)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, width: '100%',
        padding: '12px 14px', borderRadius: 10,
        background: active ? 'rgba(255,169,77,0.08)' : (hover ? 'rgba(255,255,255,0.03)' : 'transparent'),
        border: active ? '1px solid rgba(255,169,77,0.3)' : '1px solid transparent',
        textAlign: 'left', cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 120ms, border-color 120ms',
      }}
    >
      <div style={{
        width: 32, height: 32, flexShrink: 0, borderRadius: 8,
        background: `${STATUS[memo.status].color}14`,
        border: `1px solid ${STATUS[memo.status].color}40`,
        display: 'grid', placeItems: 'center', fontSize: 14,
      }}>
        {memo.inbox ? '📥' : memo.status === 'done' ? '✓' : memo.status === 'triaged' ? '◐' : '○'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 5,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{memo.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <StatusPip status={memo.status}/>
          {memo.brands.map(b => <BrandTag key={b} brandKey={b}/>)}
          {memo.tags.slice(0, 2).map(t => (
            <span key={t} style={{
              fontSize: 9, color: '#64748b', padding: '1px 5px', borderRadius: 4,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              fontFamily: 'ui-monospace, monospace',
            }}>#{t}</span>
          ))}
        </div>
      </div>
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums' }}>
          {memo.modified.split(' · ')[0]}
        </div>
        <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
          {memo.refs.length} {memo.refs.length === 1 ? 'link' : 'links'} · {memo.size}
        </div>
      </div>
      <span style={{ color: '#64748b', fontSize: 14, opacity: hover ? 1 : 0.4, transition: 'opacity 120ms' }}>→</span>
    </button>
  );
}

// ============================================================
// TIMELINE VIEW
// ============================================================
function TimelineView({ memos, onOpen, active }) {
  // group memos by date day
  const groups = useMemo(() => {
    const g = {};
    memos.forEach(m => {
      const day = m.modified.split(' · ')[0];
      (g[day] ||= []).push(m);
    });
    return g;
  }, [memos]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.entries(groups).map(([day, items]) => (
        <div key={day} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 100, flexShrink: 0, paddingTop: 14, position: 'sticky', top: 8 }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{day}</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#64748b', marginTop: 2 }}>{items.length} memo{items.length === 1 ? '' : 's'}</div>
          </div>
          <div style={{
            width: 8, flexShrink: 0, position: 'relative',
            display: 'flex', justifyContent: 'center', alignItems: 'stretch',
            paddingTop: 20, paddingBottom: 4,
          }}>
            <div style={{ width: 2, background: 'rgba(255,169,77,0.18)', borderRadius: 99 }}/>
            <span style={{
              position: 'absolute', top: 18, left: 0, width: 8, height: 8,
              borderRadius: 99, background: '#FFA94D',
              boxShadow: '0 0 12px rgba(255,169,77,0.6)',
            }}/>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 8 }}>
            {items.map(m => <MemoRow key={m.id} memo={m} onOpen={onOpen} active={active?.id === m.id}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MIND-MAP VIEW
// ============================================================
function MindMapView({ memos, onOpen, active }) {
  // Layout nodes on radial clusters by status
  const W = 760, H = 480;
  const positions = useMemo(() => {
    const pos = {};
    const byStatus = { active: [], triaged: [], done: [], archived: [] };
    memos.forEach(m => byStatus[m.status]?.push(m));
    // Cluster centers
    const centers = { active: [W * 0.32, H * 0.36], triaged: [W * 0.68, H * 0.32], done: [W * 0.30, H * 0.72], archived: [W * 0.74, H * 0.74] };
    Object.entries(byStatus).forEach(([k, list]) => {
      const [cx, cy] = centers[k];
      list.forEach((m, i) => {
        const angle = (i / Math.max(list.length, 1)) * Math.PI * 2 + (k === 'active' ? 0 : 1);
        const r = 90 + (i % 2) * 22;
        pos[m.id] = { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
      });
    });
    return pos;
  }, [memos]);

  // Build edges
  const edges = useMemo(() => {
    const set = new Set();
    const e = [];
    memos.forEach(m => {
      m.refs.forEach(rid => {
        if (!positions[rid]) return;
        const key = [m.id, rid].sort().join('|');
        if (set.has(key)) return;
        set.add(key);
        e.push({ from: m.id, to: rid });
      });
    });
    return e;
  }, [memos, positions]);

  return (
    <Card padding={0} style={{ overflow: 'hidden', position: 'relative' }}>
      <div style={{
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>Mind-Map · {memos.length} memos · {edges.length} links</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#64748b', marginTop: 2 }}>Clusters by status · click a node to open</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(STATUS).map(([k, s]) => (
            <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: s.color }}/>
              {s.label}
            </span>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ display: 'block', background: 'rgba(15,23,42,0.3)' }}>
        <defs>
          <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFA94D" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#FFD43B" stopOpacity="0.5"/>
          </linearGradient>
          <radialGradient id="halo" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(255,169,77,0.4)"/>
            <stop offset="100%" stopColor="rgba(255,169,77,0)"/>
          </radialGradient>
        </defs>

        {/* Cluster backgrounds */}
        {[
          { x: W * 0.32, y: H * 0.36, c: '#FFA94D' },
          { x: W * 0.68, y: H * 0.32, c: '#a78bfa' },
          { x: W * 0.30, y: H * 0.72, c: '#34d399' },
          { x: W * 0.74, y: H * 0.74, c: '#64748b' },
        ].map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={130} fill={c.c} opacity="0.04"/>
        ))}

        {/* Edges */}
        {edges.map((e, i) => {
          const a = positions[e.from], b = positions[e.to];
          if (!a || !b) return null;
          const isActive = active && (active.id === e.from || active.id === e.to);
          return (
            <line key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isActive ? '#FFA94D' : 'url(#edge)'}
              strokeWidth={isActive ? 1.6 : 1}
              opacity={isActive ? 1 : 0.4}
            />
          );
        })}

        {/* Nodes */}
        {memos.map(m => {
          const p = positions[m.id];
          if (!p) return null;
          const s = STATUS[m.status];
          const isActive = active?.id === m.id;
          const r = 10 + Math.min(m.refs.length * 2.5, 8);
          return (
            <g key={m.id} style={{ cursor: 'pointer' }} onClick={() => onOpen(m)}>
              {isActive && <circle cx={p.x} cy={p.y} r={r + 16} fill="url(#halo)"/>}
              <circle cx={p.x} cy={p.y} r={r} fill={s.color} fillOpacity="0.20" stroke={s.color} strokeWidth={isActive ? 2 : 1}/>
              <circle cx={p.x} cy={p.y} r={r - 4} fill={s.color}/>
              <text
                x={p.x} y={p.y + r + 12} textAnchor="middle"
                fill={isActive ? '#fff' : '#cbd5e1'}
                fontFamily="Inter, sans-serif" fontSize="9.5" fontWeight={isActive ? '700' : '600'}
                style={{ pointerEvents: 'none' }}
              >
                {m.title.length > 28 ? m.title.slice(0, 28) + '…' : m.title}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}

// ============================================================
// MEMO DETAIL DRAWER
// ============================================================
function MemoDrawer({ memo, onClose, onOpen }) {
  // close on Esc
  useEffect(() => {
    if (!memo) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [memo, onClose]);

  const open = !!memo;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(2,6,17,0.45)',
          backdropFilter: 'blur(6px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 220ms ease',
        }}
      />
      {/* Drawer */}
      <aside
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 60,
          width: 'min(60vw, 880px)', maxWidth: '100vw',
          background: 'linear-gradient(180deg, rgba(15,23,42,0.97), rgba(11,16,28,0.97))',
          backdropFilter: 'blur(16px)',
          borderLeft: '1px solid rgba(255,169,77,0.25)',
          boxShadow: '-30px 0 80px rgba(0,0,0,0.6)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 320ms cubic-bezier(0.32, 0.72, 0, 1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {memo && (
          <DrawerContent memo={memo} onClose={onClose} onOpen={onOpen}/>
        )}
      </aside>

      <style>{`
        @media (max-width: 720px) {
          aside.drawer-mobile { width: 100vw !important; }
        }
      `}</style>
    </>
  );
}

function DrawerContent({ memo, onClose, onOpen }) {
  // Body limited to first 2000 chars (per spec)
  const body = memo.body.length > 2000 ? memo.body.slice(0, 2000) + '…' : memo.body;

  return (
    <>
      {/* Header */}
      <header style={{
        padding: '20px 24px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <StatusPip status={memo.status}/>
            {memo.brands.map(b => <BrandTag key={b} brandKey={b}/>)}
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8', cursor: 'pointer', fontSize: 16, fontFamily: 'Inter, sans-serif',
            display: 'grid', placeItems: 'center',
          }} title="Close (Esc)">×</button>
        </div>
        <h2 style={{
          margin: 0, fontFamily: 'Inter, sans-serif',
          fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, color: '#fff',
        }}>{memo.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#64748b' }}>
            <code style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 10.5,
              color: '#94a3b8', padding: '1px 5px', borderRadius: 4,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            }}>{memo.id}</code>
          </span>
          {memo.tags.map(t => (
            <span key={t} style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 10.5, color: '#64748b',
              padding: '1px 6px', borderRadius: 4,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
            }}>#{t}</span>
          ))}
        </div>
      </header>

      {/* Body + sidebar */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 240px', gap: 0, overflow: 'hidden' }} className="drawer-body">
        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '20px 24px 80px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
            fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, color: '#64748b',
            letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>
            <span>Memo · markdown preview</span>
            <span style={{ width: 3, height: 3, borderRadius: 99, background: '#475569' }}/>
            <span>first {Math.min(memo.body.length, 2000)} chars</span>
          </div>
          <div>{renderMD(body)}</div>
        </div>
        {/* Sidebar */}
        <aside style={{ overflowY: 'auto', padding: '20px 18px 80px', background: 'rgba(0,0,0,0.15)' }}>
          {/* Meta block */}
          <SidebarBlock title="Meta">
            <MetaRow label="Modified" value={memo.modified}/>
            <MetaRow label="File size" value={memo.size}/>
            <MetaRow label="Tags" value={`#${memo.tags.join(' · #')}`}/>
            <MetaRow label="Cross-refs" value={`${memo.refs.length} memo${memo.refs.length === 1 ? '' : 's'}`}/>
          </SidebarBlock>

          {/* Cross-refs */}
          <SidebarBlock title="Cross-references">
            {memo.refs.length === 0 && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>No links yet.</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {memo.refs.map(rid => {
                const target = memoById(rid);
                if (!target) return null;
                return (
                  <button key={rid} onClick={() => onOpen(target)} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8, width: '100%',
                    padding: '8px 10px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#fff', textAlign: 'left', cursor: 'pointer',
                    transition: 'border-color 120ms, background 120ms',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,169,77,0.3)'; e.currentTarget.style.background = 'rgba(255,169,77,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  >
                    <span style={{
                      width: 5, height: 5, borderRadius: 99, marginTop: 7, flexShrink: 0,
                      background: STATUS[target.status].dot,
                    }}/>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.35, color: '#fff' }}>{target.title}</div>
                      <div style={{ fontSize: 9, color: '#64748b', marginTop: 3, fontFamily: 'ui-monospace, monospace' }}>{target.id} · {STATUS[target.status].label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </SidebarBlock>

          {/* Backlinks */}
          {(() => {
            const backlinks = MEMOS.filter(m => m.refs.includes(memo.id));
            if (!backlinks.length) return null;
            return (
              <SidebarBlock title={`Linked from (${backlinks.length})`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {backlinks.map(b => (
                    <button key={b.id} onClick={() => onOpen(b)} style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#94a3b8',
                      background: 'transparent', border: 'none', padding: '3px 0', cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FFA94D'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                    >← {b.title.length > 32 ? b.title.slice(0, 32) + '…' : b.title}</button>
                  ))}
                </div>
              </SidebarBlock>
            );
          })()}
        </aside>
      </div>

      {/* Action bar */}
      <footer style={{
        padding: '14px 20px',
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(255,169,77,0.2)',
        display: 'flex', gap: 8, flexWrap: 'wrap',
      }}>
        <ActionBtn icon="✓" label="Mark Done" primary={memo.status !== 'done'} disabled={memo.status === 'done'}/>
        <ActionBtn icon="⟲" label="Re-Triage"/>
        <ActionBtn icon="⌘" label="Open in Cursor"/>
        <div style={{ flex: 1 }}/>
        <ActionBtn icon="🗑" label="Archive" subtle/>
      </footer>
    </>
  );
}

const SidebarBlock = ({ title, children }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{
      fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 800, color: '#64748b',
      letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8,
    }}>{title}</div>
    {children}
  </div>
);

const MetaRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 6, fontFamily: 'Inter, sans-serif', fontSize: 11 }}>
    <span style={{ color: '#64748b', flexShrink: 0 }}>{label}</span>
    <span style={{ color: '#cbd5e1', textAlign: 'right', wordBreak: 'break-word' }}>{value}</span>
  </div>
);

function ActionBtn({ icon, label, primary, disabled, subtle }) {
  if (primary) {
    return (
      <button disabled={disabled} style={{
        padding: '10px 18px', borderRadius: 10,
        background: disabled
          ? 'rgba(255,255,255,0.04)'
          : 'linear-gradient(135deg, #FF6B6B 0%, #FFA94D 50%, #FFD43B 100%)',
        color: disabled ? '#64748b' : '#0f172a',
        fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 800,
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 6px 20px rgba(255,169,77,0.35)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}><span>{icon}</span>{label}</button>
    );
  }
  return (
    <button style={{
      padding: '10px 14px', borderRadius: 10,
      background: 'rgba(255,255,255,0.04)',
      color: subtle ? '#94a3b8' : '#cbd5e1',
      fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700,
      border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}><span>{icon}</span>{label}</button>
  );
}

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const [view, setView] = useState('list');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [range, setRange] = useState('30d');
  const [openMemo, setOpenMemo] = useState(null);

  const filtered = useMemo(() => {
    return MEMOS.filter(m => {
      if (status !== 'all' && m.status !== status) return false;
      if (range !== 'all') {
        const days = range === '7d' ? 7 : 30;
        if (daysAgo(m.modified) > days) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        if (!m.title.toLowerCase().includes(q)
          && !m.tags.some(t => t.includes(q))
          && !m.body.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [query, status, range]);

  return (
    <div style={{ minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '28px 24px 60px' }}>
        <Header view={view} setView={setView}/>

        <div style={{ marginBottom: 16 }}>
          <InboxConnector count={INBOX_ITEMS.length} onOpen={() => {}}/>
        </div>

        <Filters query={query} setQuery={setQuery} status={status} setStatus={setStatus} range={range} setRange={setRange}/>

        {filtered.length === 0 && (
          <Card style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>🧠</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#94a3b8' }}>No memos match your filter.</div>
          </Card>
        )}

        {filtered.length > 0 && view === 'list' && (
          <Card padding={8}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filtered.map(m => <MemoRow key={m.id} memo={m} onOpen={setOpenMemo} active={openMemo?.id === m.id}/>)}
            </div>
          </Card>
        )}

        {filtered.length > 0 && view === 'timeline' && (
          <TimelineView memos={filtered} onOpen={setOpenMemo} active={openMemo}/>
        )}

        {filtered.length > 0 && view === 'mindmap' && (
          <MindMapView memos={filtered} onOpen={setOpenMemo} active={openMemo}/>
        )}

        <div style={{ textAlign: 'center', marginTop: 32, color: '#475569', fontSize: 11 }}>
          ⛰️ <span style={{ color: '#94a3b8' }}>Always peaking.</span> · 11 decisions on file · synced 2 min ago
        </div>
      </div>

      <MemoDrawer memo={openMemo} onClose={() => setOpenMemo(null)} onOpen={setOpenMemo}/>

      <style>{`
        @media (max-width: 720px) {
          .drawer-body { grid-template-columns: minmax(0, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .filters-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
