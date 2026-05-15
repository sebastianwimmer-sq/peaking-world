// Insta Insights — deep stats per reel + per brand.
// Self-contained: brand switcher · 4 KPIs · per-reel grid · demographics · 7×24 heatmap.

const { useState, useMemo } = React;

// ============================================================
// DATA — three brands, deterministic seeded numbers
// ============================================================
const BRANDS = [
  {
    key: 'peakingworld',
    handle: '@peakingworld',
    emoji: '🚀',
    desc: 'AI + Creator Tools · BIP',
    color: '#FFA94D',
    pillars: { tools: '#FFA94D', bip: '#FF6B6B', marketing: '#FFD43B', bts: '#a78bfa' },
    kpis: { reach: 14820, er: 7.4, savesPct: 4.8, visits: 142, deltas: [+38, +1.2, +0.6, +21] },
    reels: [
      { caption: "Day 23 · I shipped 20 modules solo. Here's the stack.", pillar: 'bip',       plays: 8420, reach: 6210, saves: 312, shares: 184, days: 1 },
      { caption: "The 'Hook Library' I built has 50+ patterns now",     pillar: 'tools',     plays: 5180, reach: 3940, saves: 248, shares: 96,  days: 3 },
      { caption: 'Why I quit Notion and built my own tracker',          pillar: 'bip',       plays: 4220, reach: 3110, saves: 198, shares: 87,  days: 5 },
      { caption: 'Cursor + Claude · the only stack I need',             pillar: 'tools',     plays: 3680, reach: 2470, saves: 142, shares: 64,  days: 7 },
      { caption: 'BTS · my desk setup at 5am',                          pillar: 'bts',       plays: 2140, reach: 1580, saves: 71,  shares: 38,  days: 9 },
      { caption: 'Building peaking.world in 30 days · public log',      pillar: 'marketing', plays: 1820, reach: 1340, saves: 58,  shares: 31,  days: 12 },
    ],
    demo: {
      age:    [{ label: '18–24', pct: 18 }, { label: '25–34', pct: 47 }, { label: '35–44', pct: 24 }, { label: '45+', pct: 11 }],
      cities: [{ name: 'Berlin', pct: 18 }, { name: 'Wien', pct: 14 }, { name: 'Zürich', pct: 11 }, { name: 'München', pct: 9 }, { name: 'Hamburg', pct: 7 }],
      gender: { f: 32, m: 64, o: 4 },
    },
    heatmap: [
      [0,0,0,0,0,0,0,1,2,3,2,2,3,3,2,3,4,5,7,8,6,4,2,1],
      [0,0,0,0,0,0,1,2,3,3,3,3,4,4,3,4,5,7,9,9,7,4,2,1],
      [0,0,0,0,0,1,1,2,3,3,3,3,4,4,3,4,5,7,8,9,6,3,2,1],
      [0,0,0,0,0,0,1,2,3,3,3,3,4,4,3,4,5,7,9,9,7,5,3,1],
      [0,0,0,0,0,0,1,2,3,3,3,4,4,5,4,5,6,8,9,9,8,6,4,2],
      [0,0,0,0,0,0,1,1,2,3,3,3,4,5,5,5,6,7,8,9,8,7,5,3],
      [1,0,0,0,0,0,0,1,2,2,3,3,4,4,4,5,5,6,7,7,7,5,3,2],
    ],
  },
  {
    key: 'vegetarianhulk',
    handle: '@vegetarianhulk',
    emoji: '🏔️',
    desc: 'Outdoor · Plant-Based · Mindset',
    color: '#10b981',
    pillars: { outdoor: '#10b981', gym: '#f59e0b', mindset: '#8b5cf6', plantbased: '#84cc16' },
    kpis: { reach: 48210, er: 5.9, savesPct: 6.2, visits: 287, deltas: [+12, +0.4, +0.9, +8] },
    reels: [
      { caption: '5 plant-based breakfasts I eat every week',           pillar: 'plantbased', plays: 18420, reach: 14210, saves: 892, shares: 412, days: 2 },
      { caption: 'Squat depth fix in 30 seconds',                       pillar: 'gym',        plays: 12180, reach: 8740,  saves: 612, shares: 248, days: 4 },
      { caption: 'Why I quit the gym for outdoor calisthenics',         pillar: 'outdoor',    plays: 9420,  reach: 6810,  saves: 482, shares: 196, days: 6 },
      { caption: 'The 4 AM mindset shift that changed my year',         pillar: 'mindset',    plays: 6280,  reach: 4570,  saves: 318, shares: 142, days: 8 },
      { caption: 'Wild garlic foraging in Bavaria',                     pillar: 'outdoor',    plays: 4940,  reach: 3580,  saves: 264, shares: 118, days: 10 },
      { caption: 'My 1-bowl high-protein vegan dinner',                 pillar: 'plantbased', plays: 4220,  reach: 3110,  saves: 198, shares: 87,  days: 13 },
    ],
    demo: {
      age:    [{ label: '18–24', pct: 24 }, { label: '25–34', pct: 41 }, { label: '35–44', pct: 22 }, { label: '45+', pct: 13 }],
      cities: [{ name: 'München', pct: 15 }, { name: 'Berlin', pct: 12 }, { name: 'Wien', pct: 10 }, { name: 'Hamburg', pct: 8 }, { name: 'Köln', pct: 6 }],
      gender: { f: 48, m: 49, o: 3 },
    },
    heatmap: [
      [0,0,0,0,0,1,2,3,4,4,3,3,3,3,2,3,4,5,6,7,7,5,3,1],
      [0,0,0,0,0,1,2,4,5,5,4,3,3,3,2,3,5,7,8,8,7,5,3,1],
      [0,0,0,0,0,1,2,3,5,5,4,3,3,3,3,4,6,8,9,9,7,5,3,1],
      [0,0,0,0,0,1,2,4,5,5,4,4,4,3,3,4,6,7,8,9,7,5,3,1],
      [0,0,0,0,0,1,2,4,6,6,5,4,4,4,3,5,7,8,9,9,8,6,4,2],
      [0,0,0,0,0,0,1,2,3,4,5,5,6,6,5,6,7,8,9,9,9,8,5,3],
      [1,0,0,0,0,0,1,2,3,4,5,5,5,6,5,6,6,7,7,8,7,5,3,2],
    ],
  },
  {
    key: 'smashtheapp',
    handle: '@smashtheapp',
    emoji: '💚',
    desc: 'Habit-Tracker · Hulk-Green',
    color: '#39FF14',
    pillars: { habit: '#39FF14', routine: '#10b981', wins: '#34d399', mindset: '#8b5cf6' },
    kpis: { reach: 7240, er: 4.1, savesPct: 3.4, visits: 84, deltas: [+8, -0.3, +0.2, +14] },
    reels: [
      { caption: 'Date your best self · the 30-day rule',     pillar: 'habit',   plays: 2840, reach: 2120, saves: 84,  shares: 42, days: 2 },
      { caption: 'Streak Day 100 — what changed',             pillar: 'wins',    plays: 1840, reach: 1380, saves: 62,  shares: 28, days: 5 },
      { caption: 'Mach hin. · morning ritual breakdown',      pillar: 'routine', plays: 1420, reach: 1080, saves: 48,  shares: 21, days: 8 },
      { caption: 'Hulk-Mode an · why I track everything',     pillar: 'habit',   plays: 980,  reach: 720,  saves: 32,  shares: 14, days: 11 },
      { caption: 'The mindset shift behind 100 days',         pillar: 'mindset', plays: 720,  reach: 540,  saves: 24,  shares: 9,  days: 14 },
      { caption: '3 habits that survived the 90-day mark',    pillar: 'wins',    plays: 580,  reach: 420,  saves: 18,  shares: 7,  days: 17 },
    ],
    demo: {
      age:    [{ label: '18–24', pct: 28 }, { label: '25–34', pct: 44 }, { label: '35–44', pct: 19 }, { label: '45+', pct: 9 }],
      cities: [{ name: 'Berlin', pct: 16 }, { name: 'Wien', pct: 11 }, { name: 'Hamburg', pct: 8 }, { name: 'Zürich', pct: 7 }, { name: 'Köln', pct: 5 }],
      gender: { f: 38, m: 58, o: 4 },
    },
    heatmap: [
      [0,0,0,0,0,1,2,4,5,4,3,2,2,2,2,3,3,4,5,6,5,4,2,1],
      [0,0,0,0,0,1,3,5,6,5,3,2,2,2,2,3,4,5,6,7,6,4,2,1],
      [0,0,0,0,0,1,2,5,7,6,4,3,2,2,3,3,4,5,7,8,6,4,3,1],
      [0,0,0,0,0,1,3,5,7,6,4,3,3,2,2,3,4,5,7,7,6,4,2,1],
      [0,0,0,0,0,1,3,5,7,7,5,4,3,3,3,4,5,6,8,8,7,5,3,1],
      [0,0,0,0,0,0,1,2,3,4,4,5,5,5,5,6,6,7,7,8,7,5,3,2],
      [0,0,0,0,0,0,1,1,2,3,4,4,5,5,4,5,5,5,5,5,4,3,2,1],
    ],
  },
];

const PILLAR_LABELS = {
  tools: 'Tools', bip: 'BIP', marketing: 'Marketing', bts: 'BTS',
  outdoor: 'Outdoor', gym: 'Gym', mindset: 'Mindset', plantbased: 'Plant-Based',
  habit: 'Habit', routine: 'Routine', wins: 'Wins',
};

const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'K' : String(n);
const fmtFull = (n) => n.toLocaleString('de-DE');
const daysAgo = (d) => d === 0 ? 'heute' : d === 1 ? 'gestern' : `vor ${d}d`;

// ============================================================
// BRAND SWITCHER
// ============================================================
function BrandSwitcher({ brand, onSwitch }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 14px 8px 10px', borderRadius: 12,
          background: 'rgba(15,23,42,0.7)',
          border: `1px solid ${open ? 'rgba(255,169,77,0.4)' : 'rgba(255,255,255,0.10)'}`,
          color: '#fff', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
          transition: 'border-color 160ms ease, background 160ms ease',
          minWidth: 220,
        }}
      >
        <span style={{
          width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center',
          background: `${brand.color}22`, border: `1px solid ${brand.color}55`, fontSize: 14,
        }}>{brand.emoji}</span>
        <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>{brand.handle}</div>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, marginTop: 1 }}>{brand.desc}</div>
        </div>
        <svg width="10" height="6" viewBox="0 0 10 6" style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms' }}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: 'rgba(15,23,42,0.96)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,169,77,0.2)', borderRadius: 12,
          boxShadow: '0 16px 40px rgba(0,0,0,0.5), 0 0 24px rgba(255,169,77,0.1)',
          padding: 6, zIndex: 50,
        }}>
          {BRANDS.map(b => {
            const active = b.key === brand.key;
            return (
              <button
                key={b.key}
                onClick={() => { onSwitch(b); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '8px 10px', borderRadius: 8,
                  background: active ? 'rgba(255,169,77,0.10)' : 'transparent',
                  border: active ? '1px solid rgba(255,169,77,0.3)' : '1px solid transparent',
                  color: '#fff', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 120ms',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center',
                  background: `${b.color}22`, border: `1px solid ${b.color}55`, fontSize: 14,
                }}>{b.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{b.handle}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{b.desc}</div>
                </div>
                {active && <span style={{ color: '#FFA94D', fontSize: 12 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// CARD (shared glass surface)
// ============================================================
function Card({ children, padding = 20, style }) {
  return (
    <div style={{
      background: 'rgba(30,41,59,0.6)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding,
      ...style,
    }}>{children}</div>
  );
}

// ============================================================
// KPI CARD
// ============================================================
function KpiCard({ label, value, unit, delta, deltaUnit, accent }) {
  const positive = delta >= 0;
  return (
    <Card padding={18}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
          color: '#94a3b8', letterSpacing: '0.10em', textTransform: 'uppercase',
        }}>{label}</span>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
          padding: '3px 7px', borderRadius: 999, whiteSpace: 'nowrap',
          color: positive ? '#34d399' : '#f87171',
          background: positive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
          border: positive ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
        }}>
          {positive ? '↑' : '↓'} {Math.abs(delta).toLocaleString('de-DE')}{deltaUnit || ''}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 10 }}>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em',
          background: accent ? 'linear-gradient(135deg, #FF6B6B 0%, #FFA94D 50%, #FFD43B 100%)' : 'none',
          WebkitBackgroundClip: accent ? 'text' : 'unset',
          backgroundClip: accent ? 'text' : 'unset',
          WebkitTextFillColor: accent ? 'transparent' : '#fff',
          color: accent ? 'transparent' : '#fff',
          lineHeight: 1,
        }}>{value}</span>
        {unit && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, color: '#94a3b8' }}>{unit}</span>}
      </div>
      <div style={{
        marginTop: 4, fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#64748b',
      }}>vs. letzte 7 Tage</div>
    </Card>
  );
}

// ============================================================
// REEL ROW (in grid)
// ============================================================
function ReelRow({ reel, brand, onClick, active }) {
  const pillarColor = brand.pillars[reel.pillar] || brand.color;
  const er = ((reel.saves + reel.shares) / reel.reach * 100).toFixed(1);
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => onClick(reel)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '52px 1fr repeat(4, 60px) 16px',
        gap: 14, alignItems: 'center', width: '100%',
        padding: '10px 12px', borderRadius: 10,
        background: active ? 'rgba(255,169,77,0.08)' : (hover ? 'rgba(255,255,255,0.03)' : 'transparent'),
        border: active ? '1px solid rgba(255,169,77,0.3)' : '1px solid transparent',
        color: '#fff', fontFamily: 'Inter, sans-serif',
        textAlign: 'left', cursor: 'pointer',
        transition: 'background 120ms, border-color 120ms',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: 52, height: 70, borderRadius: 6, flexShrink: 0,
        background: `linear-gradient(160deg, ${pillarColor}55, ${pillarColor}15 60%, rgba(15,23,42,0.7))`,
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'grid', placeItems: 'center', position: 'relative',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" opacity="0.85">
          <path d="M9 7v10l8-5-8-5z" fill={pillarColor}/>
        </svg>
        <div style={{
          position: 'absolute', bottom: 3, right: 3,
          padding: '1px 4px', borderRadius: 3,
          background: 'rgba(0,0,0,0.6)', fontSize: 8, fontWeight: 700,
          color: '#fff', letterSpacing: '0.04em',
        }}>{daysAgo(reel.days)}</div>
      </div>

      {/* Caption + pillar */}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#fff',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          marginBottom: 4,
        }}>{reel.caption}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '1px 6px', borderRadius: 999,
            fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
            color: pillarColor, background: `${pillarColor}1f`, border: `1px solid ${pillarColor}44`,
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 4, height: 4, borderRadius: 999, background: pillarColor }}/>
            {PILLAR_LABELS[reel.pillar] || reel.pillar}
          </span>
          <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>ER {er}%</span>
        </div>
      </div>

      {/* Numeric columns */}
      <Stat n={reel.plays}/>
      <Stat n={reel.reach}/>
      <Stat n={reel.saves} hot={reel.saves / reel.reach > 0.04}/>
      <Stat n={reel.shares}/>

      <span style={{ color: '#64748b', fontSize: 14, opacity: hover ? 1 : 0.4, transition: 'opacity 120ms' }}>→</span>
    </button>
  );
}
const Stat = ({ n, hot }) => (
  <div style={{
    fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700,
    color: hot ? 'transparent' : '#fff',
    background: hot ? 'linear-gradient(135deg, #FFA94D, #FFD43B)' : 'none',
    WebkitBackgroundClip: hot ? 'text' : 'unset', backgroundClip: hot ? 'text' : 'unset',
    WebkitTextFillColor: hot ? 'transparent' : '#fff',
    textAlign: 'right', fontVariantNumeric: 'tabular-nums',
  }}>{fmt(n)}</div>
);

// ============================================================
// AGE PIE (SVG donut)
// ============================================================
function AgePie({ data }) {
  const total = data.reduce((s, d) => s + d.pct, 0);
  const colors = ['#FF6B6B', '#FFA94D', '#FFD43B', '#a78bfa'];
  let acc = 0;
  const cx = 60, cy = 60, r = 46, sw = 12;
  const segs = data.map((d, i) => {
    const start = acc / total * 2 * Math.PI - Math.PI / 2;
    acc += d.pct;
    const end = acc / total * 2 * Math.PI - Math.PI / 2;
    const len = (d.pct / total) * 2 * Math.PI * r;
    const gap = 3;
    return { ...d, start, end, len, color: colors[i % colors.length] };
  });
  const circ = 2 * Math.PI * r;
  let offsetAcc = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw}/>
        {segs.map((s, i) => {
          const dash = (s.pct / total) * circ - 2;
          const offset = -offsetAcc + circ / 4;
          offsetAcc += (s.pct / total) * circ;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth={sw}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })}
        <text x={cx} y={cy - 2} textAnchor="middle" fill="#fff" fontFamily="Inter" fontSize="11" fontWeight="700" letterSpacing="0.04em">CORE</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#FFA94D" fontFamily="Inter" fontSize="14" fontWeight="800">25–34</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'Inter, sans-serif', flex: 1 }}>
        {segs.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }}/>
            <span style={{ color: '#cbd5e1', flex: 1 }}>{s.label}</span>
            <span style={{ color: '#fff', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// TOP CITIES BAR
// ============================================================
function CitiesBar({ data }) {
  const max = Math.max(...data.map(d => d.pct));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'Inter, sans-serif' }}>
      {data.map((c, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
            <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{c.name}</span>
            <span style={{ color: '#fff', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{c.pct}%</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${(c.pct / max) * 100}%`,
              background: i === 0
                ? 'linear-gradient(90deg, #FF6B6B, #FFA94D, #FFD43B)'
                : 'linear-gradient(90deg, rgba(255,169,77,0.5), rgba(255,212,59,0.5))',
              borderRadius: 99,
              boxShadow: i === 0 ? '0 0 12px rgba(255,169,77,0.3)' : 'none',
            }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// GENDER SPLIT
// ============================================================
function GenderSplit({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
        <div style={{ width: `${data.f}%`, background: 'linear-gradient(90deg, #FF6B6B, #FFA94D)' }}/>
        <div style={{ width: `${data.m}%`, background: 'linear-gradient(90deg, #a78bfa, #818cf8)' }}/>
        <div style={{ width: `${data.o}%`, background: '#94a3b8' }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <GenderItem label="Frauen"  color="#FFA94D" pct={data.f}/>
        <GenderItem label="Männer"  color="#a78bfa" pct={data.m}/>
        <GenderItem label="Andere"  color="#94a3b8" pct={data.o}/>
      </div>
    </div>
  );
}
const GenderItem = ({ label, color, pct }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif' }}>
    <span style={{ width: 6, height: 6, borderRadius: 99, background: color }}/>
    <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
    <span style={{ fontSize: 13, color: '#fff', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
  </div>
);

// ============================================================
// 7×24 HEATMAP
// ============================================================
function Heatmap({ data }) {
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const max = 9;
  // find peak
  let peak = { d: 0, h: 0, v: 0 };
  data.forEach((row, d) => row.forEach((v, h) => { if (v > peak.v) peak = { d, h, v }; }));

  const cellColor = (v) => {
    if (v === 0) return 'rgba(255,255,255,0.03)';
    const t = v / max;
    // ramp from coral → orange → yellow
    if (t < 0.4) return `rgba(255, 107, 107, ${0.15 + t * 0.8})`;
    if (t < 0.75) return `rgba(255, 169, 77, ${0.3 + t * 0.6})`;
    return `rgba(255, 212, 59, ${0.5 + t * 0.5})`;
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '28px repeat(24, 1fr)', gap: 2, marginBottom: 4 }}>
        <div/>
        {Array.from({ length: 24 }).map((_, h) => (
          <div key={h} style={{
            fontSize: 9, color: '#64748b', textAlign: 'center',
            opacity: h % 3 === 0 ? 1 : 0,
          }}>{h.toString().padStart(2, '0')}</div>
        ))}
      </div>
      {data.map((row, d) => (
        <div key={d} style={{ display: 'grid', gridTemplateColumns: '28px repeat(24, 1fr)', gap: 2, marginBottom: 2 }}>
          <div style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', fontWeight: 600 }}>{days[d]}</div>
          {row.map((v, h) => {
            const isPeak = d === peak.d && h === peak.h;
            return (
              <div
                key={h}
                title={`${days[d]} ${h}:00 · Score ${v}`}
                style={{
                  aspectRatio: '1', borderRadius: 3,
                  background: cellColor(v),
                  border: isPeak ? '1px solid rgba(255,212,59,0.9)' : '1px solid transparent',
                  boxShadow: isPeak ? '0 0 8px rgba(255,212,59,0.6)' : 'none',
                  position: 'relative',
                }}
              >
                {isPeak && (
                  <div style={{
                    position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                    fontSize: 9, fontWeight: 800, color: '#FFD43B',
                    background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,212,59,0.4)',
                    padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', zIndex: 2,
                  }}>peak · {String(h).padStart(2,'0')}:00 {days[d]}</div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 10, color: '#64748b' }}>
        <span>weniger</span>
        {[0, 2, 4, 6, 8].map(v => <div key={v} style={{ width: 12, height: 12, borderRadius: 3, background: cellColor(v) }}/>)}
        <span>mehr</span>
      </div>
    </div>
  );
}

// ============================================================
// REEL DETAIL DRAWER
// ============================================================
function ReelDetail({ reel, brand, onClose }) {
  if (!reel) return null;
  const pillarColor = brand.pillars[reel.pillar] || brand.color;
  const er = ((reel.saves + reel.shares) / reel.reach * 100).toFixed(1);
  const reachPct = ((reel.reach / reel.plays) * 100).toFixed(0);
  const savesPct = ((reel.saves / reel.reach) * 100).toFixed(1);

  return (
    <Card style={{ position: 'sticky', top: 24, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
          color: '#FFA94D', letterSpacing: '0.16em', textTransform: 'uppercase',
        }}>Reel · Detail</span>
        <button
          onClick={onClose}
          style={{
            width: 24, height: 24, borderRadius: 6,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8', cursor: 'pointer', display: 'grid', placeItems: 'center',
            fontFamily: 'Inter, sans-serif', fontSize: 14,
          }}>×</button>
      </div>

      {/* Thumbnail + caption */}
      <div style={{
        height: 200, borderRadius: 10, marginBottom: 14, position: 'relative',
        background: `linear-gradient(160deg, ${pillarColor}55, ${pillarColor}15 60%, rgba(15,23,42,0.7))`,
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'grid', placeItems: 'center', overflow: 'hidden',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" opacity="0.85">
          <path d="M9 7v10l8-5-8-5z" fill={pillarColor}/>
        </svg>
        <div style={{
          position: 'absolute', top: 8, left: 8,
          padding: '3px 8px', borderRadius: 4,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
          fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.05em',
          fontFamily: 'Inter, sans-serif',
        }}>REEL · {daysAgo(reel.days)}</div>
      </div>

      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.4, marginBottom: 16 }}>
        „{reel.caption}"
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <DetailStat label="Plays"        value={fmtFull(reel.plays)}/>
        <DetailStat label="Reach"        value={fmtFull(reel.reach)} sub={`${reachPct}% Plays`}/>
        <DetailStat label="Saves"        value={fmtFull(reel.saves)} sub={`${savesPct}% Reach`} accent={parseFloat(savesPct) > 4}/>
        <DetailStat label="Shares"       value={fmtFull(reel.shares)}/>
      </div>

      {/* ER hero */}
      <div style={{
        padding: 14, borderRadius: 10,
        background: 'linear-gradient(135deg, rgba(255,107,107,0.10), rgba(255,169,77,0.14), rgba(255,212,59,0.10))',
        border: '1px solid rgba(255,169,77,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, color: '#FFA94D', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Engagement Rate</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FFA94D 50%, #FFD43B 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>{er}%</span>
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#cbd5e1', lineHeight: 1.45 }}>
          {parseFloat(er) >= 6
            ? `Über deinem Schnitt. Recyclen — gleiche Hook, neuer Take innerhalb 14 Tagen.`
            : parseFloat(er) >= 4
            ? `Solide. Hook funktioniert, CTA testen für +1–2 pts.`
            : `Unter Schnitt. Hook in den ersten 2s schwach — neu schneiden.`}
        </div>
      </div>
    </Card>
  );
}
const DetailStat = ({ label, value, sub, accent }) => (
  <div style={{
    padding: 10, borderRadius: 8,
    background: 'rgba(15,23,42,0.5)',
    border: '1px solid rgba(255,255,255,0.05)',
  }}>
    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.10em', textTransform: 'uppercase' }}>{label}</div>
    <div style={{
      fontFamily: 'Inter, sans-serif', fontSize: 18, fontWeight: 800, marginTop: 3, letterSpacing: '-0.02em',
      color: accent ? 'transparent' : '#fff',
      background: accent ? 'linear-gradient(135deg, #FFA94D, #FFD43B)' : 'none',
      WebkitBackgroundClip: accent ? 'text' : 'unset', WebkitTextFillColor: accent ? 'transparent' : '#fff',
      fontVariantNumeric: 'tabular-nums',
    }}>{value}</div>
    {sub && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
  </div>
);

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const [brand, setBrand] = useState(BRANDS[0]);
  const [selectedReel, setSelectedReel] = useState(null);
  const peakReel = useMemo(() => brand.reels.reduce((a, b) => b.plays > a.plays ? b : a, brand.reels[0]), [brand]);

  React.useEffect(() => { setSelectedReel(peakReel); }, [brand]);

  const { kpis } = brand;
  return (
    <div style={{ minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '28px 24px 60px' }}>

        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#FFA94D', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Module</span>
              <span style={{ width: 3, height: 3, borderRadius: 99, background: '#475569' }}/>
              <span style={{ fontSize: 11, color: '#64748b' }}>peaking.world / dashboard</span>
            </div>
            <h1 style={{
              margin: 0, fontFamily: 'Inter, sans-serif',
              fontSize: 36, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1,
            }}>📊 Insta Insights</h1>
            <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 13 }}>Deep stats per reel + per brand · letzte 7 Tage</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <PeriodPicker/>
            <BrandSwitcher brand={brand} onSwitch={setBrand}/>
          </div>
        </header>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
          <KpiCard label="Total Reach"          value={fmt(kpis.reach)} delta={kpis.deltas[0]} deltaUnit="%" accent/>
          <KpiCard label="Avg Engagement Rate"  value={kpis.er.toFixed(1)} unit="%" delta={kpis.deltas[1]} deltaUnit="pp"/>
          <KpiCard label="Saves / Reach"        value={kpis.savesPct.toFixed(1)} unit="%" delta={kpis.deltas[2]} deltaUnit="pp"/>
          <KpiCard label="Profile Visits / Tag" value={fmt(kpis.visits)} delta={kpis.deltas[3]} deltaUnit="%"/>
        </div>

        {/* Per-reel grid + detail drawer */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 16, marginBottom: 24, alignItems: 'flex-start' }} className="reel-row-grid">
          <Card padding={16}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{
                margin: 0, fontFamily: 'Inter, sans-serif',
                fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em',
              }}>Reels · letzte 14 Tage</h2>
              <span style={{ fontSize: 11, color: '#64748b' }}>{brand.reels.length} reels · sortiert nach Plays</span>
            </div>
            {/* Header row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '52px 1fr repeat(4, 60px) 16px',
              gap: 14, padding: '6px 12px', marginBottom: 4,
              fontSize: 9, fontWeight: 700, color: '#64748b',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              <div/>
              <div>Caption · Pillar</div>
              <div style={{ textAlign: 'right' }}>Plays</div>
              <div style={{ textAlign: 'right' }}>Reach</div>
              <div style={{ textAlign: 'right' }}>Saves</div>
              <div style={{ textAlign: 'right' }}>Shares</div>
              <div/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {brand.reels.map((r, i) => (
                <ReelRow key={i} reel={r} brand={brand} onClick={setSelectedReel} active={selectedReel === r}/>
              ))}
            </div>
          </Card>
          <ReelDetail reel={selectedReel} brand={brand} onClose={() => setSelectedReel(null)}/>
        </div>

        {/* Demographics row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
          <Card>
            <SectionTitle title="Age" sub="Wer hört zu"/>
            <AgePie data={brand.demo.age}/>
          </Card>
          <Card>
            <SectionTitle title="Top Cities" sub="DACH-focus"/>
            <CitiesBar data={brand.demo.cities}/>
          </Card>
          <Card>
            <SectionTitle title="Gender" sub="Self-reported"/>
            <GenderSplit data={brand.demo.gender}/>
          </Card>
        </div>

        {/* Heatmap */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
            <SectionTitle title="Audience activity · 7×24" sub="Wann deine Audience scrollt"/>
            <span style={{
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(255,212,59,0.10)', border: '1px solid rgba(255,212,59,0.3)',
              fontSize: 11, fontWeight: 700, color: '#FFD43B',
            }}>💡 Post {(() => {
              let peak = { d: 0, h: 0, v: 0 };
              brand.heatmap.forEach((row, d) => row.forEach((v, h) => { if (v > peak.v) peak = { d, h, v }; }));
              return `${['Mo','Di','Mi','Do','Fr','Sa','So'][peak.d]} · ${String(peak.h).padStart(2, '0')}:00`;
            })()}</span>
          </div>
          <Heatmap data={brand.heatmap}/>
        </Card>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32, color: '#475569', fontSize: 11 }}>
          ⛰️ <span style={{ color: '#94a3b8' }}>Always peaking.</span> · The climb is the peak. · v1.2 · gerade gesynct
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .reel-row-grid { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom: 14 }}>
    <h3 style={{
      margin: 0, fontFamily: 'Inter, sans-serif',
      fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', color: '#fff',
    }}>{title}</h3>
    {sub && <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>{sub}</p>}
  </div>
);

function PeriodPicker() {
  const [active, setActive] = useState('7d');
  return (
    <div style={{ display: 'inline-flex', padding: 3, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, gap: 2 }}>
      {['24h', '7d', '30d', '90d'].map(p => (
        <button
          key={p}
          onClick={() => setActive(p)}
          style={{
            padding: '5px 12px', borderRadius: 7,
            background: active === p ? 'rgba(255,169,77,0.15)' : 'transparent',
            border: active === p ? '1px solid rgba(255,169,77,0.3)' : '1px solid transparent',
            color: active === p ? '#FFA94D' : '#94a3b8',
            fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700,
            cursor: 'pointer', transition: 'all 120ms',
          }}
        >{p}</button>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
