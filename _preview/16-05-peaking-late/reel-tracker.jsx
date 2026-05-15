const { useState, useMemo, useRef, useEffect } = React;

/* ───────── DESIGN TOKENS ───────── */
const T = {
  bg: '#0f172a',
  bgDeep: '#0a1120',
  surface: '#162033',
  surfaceHi: '#1c2740',
  line: 'rgba(255,255,255,0.07)',
  lineHi: 'rgba(255,255,255,0.12)',
  text: '#e6edf3',
  textMid: '#94a3b8',
  textDim: '#64748b',
  sun1: '#ff6b6b',
  sun2: '#ffa94d',
  sun3: '#ffd43b',
  sunrise: 'linear-gradient(135deg, #ff6b6b 0%, #ffa94d 55%, #ffd43b 100%)',
  sunriseSoft: 'linear-gradient(180deg, rgba(255,107,107,0.35) 0%, rgba(255,169,77,0.20) 45%, rgba(255,212,59,0.06) 100%)',
  good: '#34d399',
  bad: '#f87171',
};

/* ───────── DATA ───────── */
const REELS = [
  { id: 'r1', brand: 'Peaking',  format: '9:16', hue: 18,  cap: 'Sunrise hike, 5:42 am. Wenn die Crew vor dem Alarm wach ist — dann weisst du, das Projekt lebt. #alwayspeaking',
    plays: 184230, eng: 12.4, watch: 21.3, saves: 4820, posted: '6 std', delta: 38.2,
    spark: [4, 6, 9, 7, 12, 18, 22, 25, 31, 38, 44, 52, 61, 70, 82, 96, 108, 124, 140, 152] },
  { id: 'r2', brand: 'Hulk',     format: '9:16', hue: 142, cap: 'Powerlifting drop day. 220kg auf der Stange, 4 Plates rasieren — und der Camera-Mann hat trotzdem den Sound vergessen.',
    plays: 92140,  eng: 8.7,  watch: 14.8, saves: 1420, posted: '1 t',   delta: 12.1,
    spark: [2, 4, 5, 8, 10, 14, 19, 24, 28, 32, 38, 44, 50, 55, 62, 68, 74, 78, 82, 84] },
  { id: 'r3', brand: 'Smash',    format: '1:1',  hue: 312, cap: 'POV: dein Friday-Night-Smash-Burger ist fertig. Doppelt patty, single regret.',
    plays: 412840, eng: 18.9, watch: 28.7, saves: 12480, posted: '2 t', delta: 92.4,
    spark: [3, 8, 14, 22, 32, 48, 62, 80, 102, 128, 158, 192, 226, 268, 304, 338, 372, 388, 402, 412] },
  { id: 'r4', brand: 'Peaking',  format: '9:16', hue: 38,  cap: 'Studio-Build-Out Day 14. Drywall ist drin, Akustik-Panels kommen Montag. Slow grind > fast hype.',
    plays: 54820,  eng: 9.4,  watch: 18.6, saves: 920,   posted: '3 t', delta: -4.2,
    spark: [8, 12, 18, 22, 28, 34, 38, 42, 46, 48, 50, 51, 52, 53, 54, 54, 54, 55, 55, 55] },
  { id: 'r5', brand: 'Hulk',     format: '1:1',  hue: 162, cap: 'Coach-Reaction zum World-Record-Lift. Diese drei Sekunden waren teurer als der ganze Marketing-Budget.',
    plays: 218400, eng: 14.2, watch: 19.1, saves: 5680, posted: '4 t', delta: 21.8,
    spark: [10, 18, 28, 38, 52, 68, 82, 96, 112, 128, 142, 158, 172, 184, 194, 202, 208, 212, 216, 218] },
  { id: 'r6', brand: 'Smash',    format: '9:16', hue: 28,  cap: 'Drive-Thru-Window meltdown. Friday 11pm, alle wollen den Truffle-Smash. Kitchen-Cam läuft, Kette läuft.',
    plays: 76420,  eng: 11.2, watch: 16.4, saves: 2140, posted: '5 t', delta: 7.4,
    spark: [4, 8, 14, 20, 26, 32, 38, 44, 48, 52, 56, 60, 64, 66, 68, 70, 72, 74, 75, 76] },
];

const BRAND_HUE = { Peaking: 18, Hulk: 142, Smash: 312 };

/* ───────── ATOMS ───────── */
const Eyebrow = ({ children, style }) => (
  <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 500,
    fontSize: 13, letterSpacing: 0.4, color: T.sun2, ...style }}>{children}</div>
);

const Mono = ({ children, style }) => (
  <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", ...style }}>{children}</span>
);

const SunriseText = ({ children, style }) => (
  <span style={{ backgroundImage: T.sunrise, WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent', backgroundClip: 'text', ...style }}>{children}</span>
);

const Pill = ({ children, tone = 'default', style }) => {
  const tones = {
    default: { bg: 'rgba(255,255,255,0.06)', fg: T.text, bd: T.line },
    sunrise: { bg: 'rgba(255,169,77,0.12)', fg: T.sun2, bd: 'rgba(255,169,77,0.30)' },
    good:    { bg: 'rgba(52,211,153,0.12)', fg: T.good, bd: 'rgba(52,211,153,0.28)' },
    bad:     { bg: 'rgba(248,113,113,0.10)', fg: T.bad, bd: 'rgba(248,113,113,0.28)' },
  };
  const t = tones[tone];
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
    background: t.bg, color: t.fg, border: `1px solid ${t.bd}`, letterSpacing: 0.2, ...style }}>{children}</span>;
};

/* ───────── THUMBNAIL (placeholder with brand-tinted vibe) ───────── */
function Thumb({ hue, ratio = '9:16', label, badge }) {
  const isPortrait = ratio === '9:16';
  const isSquare = ratio === '1:1';
  return (
    <div style={{
      position: 'relative', width: '100%',
      aspectRatio: isPortrait ? '9 / 16' : (isSquare ? '1 / 1' : '16 / 9'),
      borderRadius: 14, overflow: 'hidden',
      background: `linear-gradient(160deg,
        oklch(0.28 0.09 ${hue}) 0%,
        oklch(0.18 0.06 ${hue + 12}) 55%,
        oklch(0.12 0.04 ${hue - 20}) 100%)`,
    }}>
      {/* film grain stripes */}
      <div style={{ position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 8px)' }} />
      {/* mountain silhouette */}
      <svg viewBox="0 0 200 120" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '55%', display: 'block' }}>
        <path d="M0,120 L0,80 L28,40 L48,62 L82,18 L118,55 L150,30 L180,58 L200,46 L200,120 Z"
          fill={`oklch(0.10 0.03 ${hue})`} opacity="0.85" />
        <path d="M0,120 L0,95 L40,65 L72,80 L108,52 L140,72 L172,58 L200,72 L200,120 Z"
          fill={`oklch(0.07 0.02 ${hue})`} />
      </svg>
      {/* sunrise glow */}
      <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)',
        width: '46%', aspectRatio: '1', borderRadius: '50%',
        background: T.sunrise, opacity: 0.55, filter: 'blur(18px)' }} />
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '14%', aspectRatio: '1', borderRadius: '50%', background: '#fff8d6', boxShadow: '0 0 24px #ffd43b' }} />
      {/* label */}
      {label && (
        <div style={{ position: 'absolute', left: 12, bottom: 12, right: 12,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.55)',
          letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
      )}
      {badge && (
        <div style={{ position: 'absolute', top: 10, left: 10 }}>{badge}</div>
      )}
      {/* play glyph */}
      <div style={{ position: 'absolute', right: 10, bottom: 10,
        width: 26, height: 26, borderRadius: '50%', background: 'rgba(15,23,42,0.7)',
        display: 'grid', placeItems: 'center', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.18)' }}>
        <div style={{ width: 0, height: 0, marginLeft: 2,
          borderLeft: '7px solid #fff', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
      </div>
    </div>
  );
}

/* ───────── SPARKLINE ───────── */
function Sparkline({ data, width = 120, height = 32, filled = true, strokeW = 1.5 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min || 1)) * height;
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const fill = `${path} L${width},${height} L0,${height} Z`;
  const id = useMemo(() => 'sp' + Math.random().toString(36).slice(2, 8), []);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#ffa94d" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffd43b" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id + 's'} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="55%" stopColor="#ffa94d" />
          <stop offset="100%" stopColor="#ffd43b" />
        </linearGradient>
      </defs>
      {filled && <path d={fill} fill={`url(#${id})`} />}
      <path d={path} fill="none" stroke={`url(#${id}s)`} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r={2.5} fill="#ffd43b" />
    </svg>
  );
}

/* ───────── FORMAT NUMBERS ───────── */
const fmt = (n) => n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(n>=1e4?0:1)+'K' : String(n);
const fmtFull = (n) => n.toLocaleString('de-DE');

/* ───────── REEL CARD ───────── */
function ReelCard({ reel, onClick, highlight }) {
  return (
    <div onClick={onClick} style={{
      background: T.surface, border: `1px solid ${highlight ? 'rgba(255,169,77,0.45)' : T.line}`,
      borderRadius: 18, padding: 14, cursor: 'pointer', position: 'relative',
      boxShadow: highlight ? '0 0 0 1px rgba(255,169,77,0.25), 0 24px 60px -30px rgba(255,107,107,0.4)' : 'none',
      transition: 'transform .2s ease',
    }}>
      <Thumb hue={BRAND_HUE[reel.brand]} ratio={reel.format}
        label={reel.format + ' · ' + reel.posted}
        badge={<Pill tone="sunrise">{reel.brand}</Pill>} />

      {/* sparkline strip */}
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: T.textDim, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600 }}>Plays · 30d</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 2, letterSpacing: -0.5 }}>{fmt(reel.plays)}</div>
        </div>
        <Sparkline data={reel.spark} width={120} height={36} />
      </div>

      {/* caption */}
      <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.45, color: T.textMid,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textWrap: 'pretty' }}>
        {reel.cap}
      </div>

      {/* mini metrics row */}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${T.line}`,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <MiniStat label="ENG" value={reel.eng.toFixed(1) + '%'} />
        <MiniStat label="WATCH" value={reel.watch.toFixed(1) + 's'} />
        <MiniStat label="SAVES" value={fmt(reel.saves)} />
      </div>

      <div style={{ position: 'absolute', top: 14, right: 14 }}>
        <Pill tone={reel.delta >= 0 ? 'good' : 'bad'}>
          {reel.delta >= 0 ? '↑' : '↓'} {Math.abs(reel.delta).toFixed(1)}%
        </Pill>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 0.6, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{value}</div>
    </div>
  );
}

/* ───────── APP CHROME (logo, nav, filter bar) ───────── */
function Logo({ size = 28 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="lg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="50%" stopColor="#ffa94d" />
            <stop offset="100%" stopColor="#ffd43b" />
          </linearGradient>
        </defs>
        <path d="M2 26 L11 12 L17 19 L22 8 L30 26 Z" fill="url(#lg)" />
        <circle cx="22" cy="6" r="2.5" fill="#ffd43b" />
      </svg>
      <div style={{ fontWeight: 900, letterSpacing: 2, fontSize: 14 }}>PEAKING</div>
    </div>
  );
}

function TopBar({ count = 6 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 32px', borderBottom: `1px solid ${T.line}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        <Logo />
        <nav style={{ display: 'flex', alignItems: 'center', gap: 22, fontSize: 13, color: T.textMid, fontWeight: 500 }}>
          <span>Dashboard</span>
          <span style={{ color: T.text, fontWeight: 700, position: 'relative' }}>
            Reel-Tracker
            <span style={{ position: 'absolute', left: 0, right: 0, bottom: -22, height: 2, background: T.sunrise, borderRadius: 2 }} />
          </span>
          <span>Hook-Patterns</span>
          <span>Auto-Tag Lab</span>
          <span>Settings</span>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Pill tone="sunrise"><span style={{ width: 6, height: 6, borderRadius: 999, background: T.sun3, boxShadow: '0 0 8px #ffd43b' }} /> Worker · live</Pill>
        <div style={{ width: 32, height: 32, borderRadius: 999, background: T.sunrise, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12, color: '#1a0a0a' }}>JK</div>
      </div>
    </div>
  );
}

function Header({ count }) {
  return (
    <div style={{ padding: '32px 32px 20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <Eyebrow>Always peaking.</Eyebrow>
        <h1 style={{ margin: '6px 0 0', fontSize: 44, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1 }}>
          Reel-Tracker <SunriseText>V2</SunriseText>
        </h1>
        <div style={{ marginTop: 10, color: T.textMid, fontSize: 14 }}>
          {count} reels tracked across 3 brands · last sync <Mono style={{ color: T.text }}>vor 2 min</Mono>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button style={btnGhost}>＋ Reel-URL einkleben</button>
        <button style={btnPrimary}>Hook-Pattern Lab ↗</button>
      </div>
    </div>
  );
}

const btnPrimary = {
  background: T.sunrise, color: '#1a0a0a', border: 'none', padding: '10px 18px',
  borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
  boxShadow: '0 12px 30px -10px rgba(255,107,107,0.6)',
};
const btnGhost = {
  background: 'transparent', color: T.text, border: `1px solid ${T.lineHi}`, padding: '10px 16px',
  borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
};

function FilterBar({ activeBrand, sortLabel }) {
  const brands = ['Alle', 'Peaking', 'Hulk', 'Smash'];
  return (
    <div style={{ padding: '0 32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6,
        background: T.surface, border: `1px solid ${T.line}`, padding: 4, borderRadius: 12 }}>
        {brands.map(b => {
          const active = b === activeBrand;
          return (
            <div key={b} style={{
              padding: '8px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
              background: active ? T.sunrise : 'transparent',
              color: active ? '#1a0a0a' : T.textMid, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {b}
              {active && <span style={{ background: 'rgba(26,10,10,0.18)', borderRadius: 6, padding: '1px 6px', fontSize: 11 }}>6</span>}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button style={btnGhost}>⌕ Caption durchsuchen</button>
        <div style={{ ...btnGhost, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
          <span style={{ color: T.textDim, fontSize: 12 }}>Sort:</span>
          <span style={{ fontWeight: 700 }}>{sortLabel}</span>
          <span style={{ color: T.textDim }}>▾</span>
        </div>
      </div>
    </div>
  );
}

/* ───────── DRAWER (DESKTOP) ───────── */
function DrawerDesktop({ reel }) {
  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, width: 640, height: '100%',
      background: T.bgDeep, borderLeft: `1px solid ${T.lineHi}`,
      boxShadow: '-40px 0 80px -20px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column',
    }}>
      {/* drawer header */}
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Pill tone="sunrise">{reel.brand}</Pill>
          <span style={{ fontSize: 12, color: T.textDim }}>· Reel · ID <Mono>m_{reel.id}48fa</Mono></span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={iconBtn}>⤓</div>
          <div style={iconBtn}>⋯</div>
          <div style={iconBtn}>✕</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        {/* HERO */}
        <div style={{ display: 'grid', gridTemplateColumns: reel.format === '9:16' ? '200px 1fr' : '1fr', gap: 18 }}>
          <Thumb hue={BRAND_HUE[reel.brand]} ratio={reel.format} />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Eyebrow>Snapshot · 30 Tage</Eyebrow>
              <div style={{ fontSize: 42, fontWeight: 900, marginTop: 6, letterSpacing: -1.5, lineHeight: 1 }}>
                {fmtFull(reel.plays)}
              </div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 4, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600 }}>
                Plays · <span style={{ color: T.good }}>↑ {reel.delta.toFixed(1)}%</span> vs. last 30
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Pill>{reel.format}</Pill>
              <Pill>gepostet vor {reel.posted}</Pill>
            </div>
          </div>
        </div>

        {/* CAPTION */}
        <div style={{ marginTop: 22, padding: 16, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 14 }}>
          <div style={{ fontSize: 11, color: T.textDim, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Caption</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: T.text, textWrap: 'pretty' }}>
            {reel.cap}
            <span style={{ color: T.sun2, fontWeight: 600, marginLeft: 6, cursor: 'pointer' }}>mehr lesen ▾</span>
          </div>
        </div>

        {/* BIG SPARKLINE CHART */}
        <div style={{ marginTop: 18, padding: 18, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: T.textDim, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>Plays-Velocity</div>
              <div style={{ fontSize: 13, color: T.textMid, marginTop: 4 }}>30-Tage-Trajectory · stündliche Worker-Polls</div>
            </div>
            <div style={{ display: 'flex', gap: 4, background: T.bg, padding: 3, borderRadius: 8, border: `1px solid ${T.line}` }}>
              {['7d', '30d', '90d', 'All'].map(r => (
                <div key={r} style={{ padding: '5px 11px', fontSize: 11, fontWeight: 600,
                  color: r === '30d' ? '#1a0a0a' : T.textMid,
                  background: r === '30d' ? T.sunrise : 'transparent', borderRadius: 6 }}>{r}</div>
              ))}
            </div>
          </div>
          <BigSparkline data={reel.spark} />
        </div>

        {/* METRICS BENTO 2x2 */}
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <BentoCell label="Plays" big={fmtFull(reel.plays)} sub={`↑ ${reel.delta.toFixed(1)}% · 30d`} accent />
          <BentoCell label="Engagement-Rate" big={reel.eng.toFixed(1) + '%'} sub={`Branche ⌀ 5.2% · ${reel.eng > 10 ? 'over-index 2.4×' : 'on-pace'}`} />
          <BentoCell label="Avg-Watch-Time" big={reel.watch.toFixed(1) + 's'} sub={`${(reel.watch / 35 * 100).toFixed(0)}% completion`} />
          <BentoCell label="Saves" big={fmtFull(reel.saves)} sub={`${(reel.saves / reel.plays * 100).toFixed(2)}% save-rate`} />
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <ActionBtn icon="↗" label="Auf Insta öffnen" />
          <ActionBtn icon="✦" label="Auto-Tag aktivieren" />
          <ActionBtn icon="◈" label="Hook-Pattern speichern" />
        </div>

        <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,169,77,0.06)',
          border: '1px dashed rgba(255,169,77,0.28)', borderRadius: 12,
          display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 18, color: T.sun2 }}>✦</div>
          <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.5 }}>
            <b style={{ color: T.text }}>Worker-Tipp:</b> Dieser Hook („POV: dein..." / sunrise-hike intro) hat in 4/6 deiner Top-Reels gezogen. <span style={{ color: T.sun2, fontWeight: 600 }}>Pattern speichern →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const iconBtn = {
  width: 32, height: 32, borderRadius: 8, background: T.surface,
  border: `1px solid ${T.line}`, display: 'grid', placeItems: 'center',
  color: T.textMid, fontSize: 14, cursor: 'pointer',
};

function BentoCell({ label, big, sub, accent }) {
  return (
    <div style={{
      padding: 16, borderRadius: 14, position: 'relative', overflow: 'hidden',
      background: accent ? 'linear-gradient(160deg, rgba(255,107,107,0.14), rgba(255,212,59,0.04))' : T.surface,
      border: `1px solid ${accent ? 'rgba(255,169,77,0.30)' : T.line}`,
    }}>
      <div style={{ fontSize: 11, color: T.textDim, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8, letterSpacing: -0.8 }}>
        {accent ? <SunriseText>{big}</SunriseText> : big}
      </div>
      <div style={{ fontSize: 11, color: T.textMid, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function ActionBtn({ icon, label }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12,
      padding: '12px 10px', textAlign: 'center', cursor: 'pointer',
      fontSize: 12, fontWeight: 600, color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    }}>
      <span style={{ color: T.sun2, fontWeight: 700 }}>{icon}</span> {label}
    </div>
  );
}

/* ───────── BIG SPARKLINE WITH AXES AND HOVER ───────── */
function BigSparkline({ data }) {
  const W = 560, H = 180, PT = 20, PB = 28, PL = 36, PR = 16;
  const cw = W - PL - PR, ch = H - PT - PB;
  const max = Math.max(...data), min = 0;
  const pts = data.map((v, i) => {
    const x = PL + (i / (data.length - 1)) * cw;
    const y = PT + ch - ((v - min) / (max - min || 1)) * ch;
    return [x, y, v, i];
  });
  const line = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const area = line + ` L${PL + cw},${PT + ch} L${PL},${PT + ch} Z`;
  const hoverIdx = Math.floor(data.length * 0.72);
  const hp = pts[hoverIdx];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ marginTop: 14, display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="big-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#ffa94d" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffd43b" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="big-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="55%" stopColor="#ffa94d" />
          <stop offset="100%" stopColor="#ffd43b" />
        </linearGradient>
      </defs>
      {/* grid */}
      {[0, 0.25, 0.5, 0.75, 1].map(r => (
        <line key={r} x1={PL} x2={W - PR} y1={PT + ch * r} y2={PT + ch * r}
          stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      {/* y labels */}
      {[1, 0.5, 0].map(r => (
        <text key={r} x={PL - 8} y={PT + ch * r + 4} textAnchor="end"
          fontFamily="JetBrains Mono" fontSize="9" fill={T.textDim}>
          {fmt(Math.round(max * (1 - r)))}
        </text>
      ))}
      {/* x labels */}
      {[0, 7, 14, 21, 29].map(i => (
        <text key={i} x={PL + (i / (data.length - 1)) * cw} y={H - 10}
          textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={T.textDim}>
          {i === 29 ? 'jetzt' : `-${29 - i}t`}
        </text>
      ))}

      <path d={area} fill="url(#big-fill)" />
      <path d={line} fill="none" stroke="url(#big-line)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* hover marker */}
      <line x1={hp[0]} x2={hp[0]} y1={PT} y2={PT + ch} stroke="rgba(255,212,59,0.4)" strokeDasharray="2 3" />
      <circle cx={hp[0]} cy={hp[1]} r="5" fill="#0f172a" stroke="#ffd43b" strokeWidth="2" />

      {/* tooltip */}
      <g transform={`translate(${hp[0] - 70}, ${hp[1] - 56})`}>
        <rect width="140" height="44" rx="8" fill="#0a1120" stroke="rgba(255,169,77,0.35)" />
        <text x="12" y="17" fontFamily="JetBrains Mono" fontSize="9.5" fill={T.textDim} letterSpacing="0.4">
          12.MAI · 14:00
        </text>
        <text x="12" y="34" fontFamily="Inter" fontWeight="800" fontSize="14" fill="#fff">
          {fmtFull(Math.round(hp[2] * 1200))} plays
        </text>
        <text x="86" y="34" fontFamily="Inter" fontWeight="700" fontSize="11" fill="#34d399">
          +18.4%
        </text>
      </g>
    </svg>
  );
}

/* ───────── SCREENS / ARTBOARDS ───────── */
function GridScreen() {
  return (
    <div style={{ width: 1440, background: T.bg, color: T.text, fontFamily: 'Inter, sans-serif' }}>
      <TopBar />
      <Header count={REELS.length} />
      <FilterBar activeBrand="Alle" sortLabel="Most-Plays" />
      <div style={{ padding: '0 32px 40px', display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {REELS.map(r => <ReelCard key={r.id} reel={r} />)}
      </div>
      <BrandFooter />
    </div>
  );
}

function GridWithDrawerScreen() {
  return (
    <div style={{ width: 1440, background: T.bg, color: T.text, fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <TopBar />
      <Header count={REELS.length} />
      <FilterBar activeBrand="Smash" sortLabel="Most-Plays" />
      <div style={{ padding: '0 32px 40px', paddingRight: 640 + 32, display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
        {REELS.slice(0, 4).map((r, i) => <ReelCard key={r.id} reel={r} highlight={i === 2} />)}
      </div>
      {/* dim under drawer */}
      <div style={{ position: 'absolute', top: 0, right: 640, width: 80, height: '100%',
        background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.4))', pointerEvents: 'none' }} />
      <DrawerDesktop reel={REELS[2]} />
    </div>
  );
}

function MobileDrawerScreen() {
  const reel = REELS[2];
  return (
    <div style={{ width: 390, background: T.bg, color: T.text, fontFamily: 'Inter, sans-serif',
      borderRadius: 32, overflow: 'hidden', position: 'relative', height: 844,
      boxShadow: '0 40px 80px -30px rgba(0,0,0,0.8)', border: '8px solid #1a1a1a' }}>
      {/* status bar */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', fontSize: 14, fontWeight: 700 }}>
        <span>9:41</span>
        <span style={{ width: 88, height: 28, background: '#000', borderRadius: 999, position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)' }} />
        <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <span style={{ width: 16, height: 10, background: T.text, borderRadius: 2 }} />
          <span style={{ width: 22, height: 11, border: `1.5px solid ${T.text}`, borderRadius: 3, position: 'relative' }}>
            <span style={{ position: 'absolute', inset: 1.5, background: T.text, borderRadius: 1, width: '70%' }} />
          </span>
        </span>
      </div>

      {/* dimmed background showing grid behind */}
      <div style={{ height: 90, padding: '8px 20px', opacity: 0.35 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size={22} />
          <div style={{ display: 'flex', gap: 8, fontSize: 11, color: T.textDim }}>
            <span>⌕</span>
            <span>⌃</span>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 800, letterSpacing: -0.8 }}>
          Reel-Tracker
        </div>
      </div>
      <div style={{ position: 'absolute', inset: '134px 0 0', background: 'rgba(7,9,15,0.7)', backdropFilter: 'blur(2px)' }} />

      {/* BOTTOM SHEET */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 700,
        background: T.bgDeep, borderTop: `1px solid ${T.lineHi}`,
        borderRadius: '24px 24px 0 0', boxShadow: '0 -20px 60px -10px rgba(0,0,0,0.6)',
        overflow: 'auto', padding: '12px 18px 24px',
      }}>
        {/* handle */}
        <div style={{ width: 44, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.18)',
          margin: '4px auto 12px' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill tone="sunrise">{reel.brand}</Pill>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ ...iconBtn, width: 28, height: 28, fontSize: 12 }}>⤓</div>
            <div style={{ ...iconBtn, width: 28, height: 28, fontSize: 12 }}>✕</div>
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '120px 1fr', gap: 14 }}>
          <Thumb hue={BRAND_HUE[reel.brand]} ratio={reel.format} />
          <div>
            <Eyebrow style={{ fontSize: 11 }}>Snapshot</Eyebrow>
            <div style={{ fontSize: 30, fontWeight: 900, marginTop: 4, letterSpacing: -1, lineHeight: 1 }}>
              {fmt(reel.plays)}
            </div>
            <div style={{ fontSize: 10, color: T.textDim, marginTop: 4, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600 }}>
              Plays · <span style={{ color: T.good }}>↑ {reel.delta.toFixed(1)}%</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              <Pill style={{ fontSize: 10, padding: '3px 8px' }}>{reel.format}</Pill>
              <Pill style={{ fontSize: 10, padding: '3px 8px' }}>vor {reel.posted}</Pill>
            </div>
          </div>
        </div>

        {/* caption */}
        <div style={{ marginTop: 14, padding: 12, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, fontSize: 12, lineHeight: 1.5, color: T.textMid }}>
          {reel.cap.slice(0, 120)}…
          <span style={{ color: T.sun2, fontWeight: 600, marginLeft: 4 }}>mehr ▾</span>
        </div>

        {/* sparkline mini chart */}
        <div style={{ marginTop: 12, padding: 12, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>30-Tage Plays</div>
            <div style={{ fontSize: 10, color: T.sun2, fontWeight: 700 }}>30d ▾</div>
          </div>
          <Sparkline data={reel.spark} width={320} height={60} strokeW={2} />
        </div>

        {/* bento 2x2 */}
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <BentoCell label="Plays" big={fmt(reel.plays)} sub={`↑ ${reel.delta.toFixed(1)}%`} accent />
          <BentoCell label="Engagement" big={reel.eng.toFixed(1) + '%'} sub="2.4× ⌀" />
          <BentoCell label="Watch" big={reel.watch.toFixed(1) + 's'} sub="82% compl." />
          <BentoCell label="Saves" big={fmt(reel.saves)} sub="3.02% save" />
        </div>

        {/* actions */}
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <ActionBtn icon="↗" label="Insta öffnen" />
          <ActionBtn icon="✦" label="Auto-Tag an" />
        </div>
        <div style={{ marginTop: 8 }}>
          <button style={{ ...btnPrimary, width: '100%', padding: '14px' }}>◈ Hook-Pattern speichern</button>
        </div>
      </div>
    </div>
  );
}

function EmptyStateScreen() {
  return (
    <div style={{ width: 1440, background: T.bg, color: T.text, fontFamily: 'Inter, sans-serif' }}>
      <TopBar />
      <div style={{ padding: '32px 32px 0' }}>
        <Eyebrow>Always peaking.</Eyebrow>
        <h1 style={{ margin: '6px 0 0', fontSize: 44, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1 }}>
          Reel-Tracker <SunriseText>V2</SunriseText>
        </h1>
      </div>

      <div style={{ padding: '60px 32px 80px', display: 'grid', placeItems: 'center' }}>
        <div style={{ maxWidth: 720, textAlign: 'center' }}>
          {/* SUNRISE-MOUNTAIN ILLUSTRATION */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto 36px' }}>
            <svg viewBox="0 0 520 280" style={{ width: '100%', display: 'block' }}>
              <defs>
                <linearGradient id="sun-rad" x1="0.5" x2="0.5" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ffd43b" />
                  <stop offset="60%" stopColor="#ffa94d" />
                  <stop offset="100%" stopColor="#ff6b6b" />
                </linearGradient>
                <linearGradient id="m-1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1c2740" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="m-2" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0d1424" />
                  <stop offset="100%" stopColor="#070c18" />
                </linearGradient>
                <radialGradient id="haze" cx="0.5" cy="0.65" r="0.5">
                  <stop offset="0%" stopColor="#ffa94d" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ffa94d" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* sky haze */}
              <rect x="0" y="0" width="520" height="280" fill="url(#haze)" />

              {/* sun */}
              <circle cx="260" cy="170" r="68" fill="url(#sun-rad)" />
              {/* sun rays/dashes */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="60" x2="460" y1={50 + i * 22} y2={50 + i * 22}
                  stroke="#ffa94d" strokeWidth="1" strokeDasharray="2 8" opacity={0.25 - i * 0.04} />
              ))}

              {/* back mountains */}
              <path d="M0,260 L0,180 L60,140 L110,170 L170,110 L240,160 L300,90 L370,150 L430,120 L520,165 L520,280 L0,280 Z"
                fill="url(#m-1)" />
              {/* snow caps */}
              <path d="M170,110 L185,128 L165,128 Z M300,90 L318,114 L286,114 Z M170,110 L155,128 L185,128"
                fill="#e6edf3" opacity="0.85" />
              <path d="M300,90 L286,114 L318,114" fill="#fff" />

              {/* front mountains */}
              <path d="M0,280 L0,220 L80,180 L140,210 L210,160 L290,200 L360,170 L450,200 L520,180 L520,280 Z"
                fill="url(#m-2)" />

              {/* sparkline running across (the tracker metaphor) */}
              <path d="M40,242 L80,236 L120,238 L160,224 L200,228 L240,210 L280,214 L320,196 L360,200 L400,180 L440,184 L480,162"
                fill="none" stroke="#ffd43b" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              {[40, 120, 240, 360, 480].map((x, i) => (
                <circle key={x} cx={x} cy={[242, 238, 210, 200, 162][i]} r="3" fill="#ffd43b" />
              ))}
            </svg>
          </div>

          <Eyebrow style={{ fontSize: 14 }}>Day 0. Sun's up.</Eyebrow>
          <h2 style={{ margin: '12px 0 0', fontSize: 48, fontWeight: 800, letterSpacing: -1.4, lineHeight: 1.05, textWrap: 'balance' }}>
            Track <SunriseText>dein erstes Reel</SunriseText>.
          </h2>
          <p style={{ margin: '18px auto 0', maxWidth: 480, fontSize: 15, color: T.textMid, lineHeight: 1.55, textWrap: 'pretty' }}>
            Kleb eine Reel-URL ein, der Worker pollt stündlich die Insta-API, und ab Minute eins siehst du, wie's klettert. <Mono style={{ color: T.text }}>Always peaking.</Mono>
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
            <button style={{ ...btnPrimary, padding: '14px 26px', fontSize: 14 }}>＋ Reel-URL einkleben</button>
            <button style={{ ...btnGhost, padding: '14px 22px', fontSize: 14 }}>Wie funktioniert der Worker? ↗</button>
          </div>

          {/* small hint row */}
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 640, marginInline: 'auto' }}>
            {[
              { k: '⌁', t: 'Worker-API live', s: 'GET /insta/reel-history' },
              { k: '◈', t: 'Hook-Patterns saved', s: '0 — kommt mit Reel #5' },
              { k: '✦', t: 'Auto-Tag wartet', s: 'aktiviert ab Reel #1' },
            ].map((h) => (
              <div key={h.k} style={{
                padding: '14px 14px', background: T.surface, border: `1px solid ${T.line}`,
                borderRadius: 12, textAlign: 'left',
              }}>
                <div style={{ fontSize: 16, color: T.sun2 }}>{h.k}</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>{h.t}</div>
                <Mono style={{ fontSize: 11, color: T.textDim, marginTop: 2, display: 'block' }}>{h.s}</Mono>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandFooter() {
  return (
    <div style={{ padding: '24px 32px 40px', borderTop: `1px solid ${T.line}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: T.textDim, fontSize: 11 }}>
      <Mono>peaking://reel-tracker · v2.0.3 · last deploy 2026-05-14 09:41 UTC</Mono>
      <div style={{ display: 'flex', gap: 16 }}>
        <span>Worker latency: <span style={{ color: T.good }}>184ms</span></span>
        <span>API quota: <span style={{ color: T.text }}>4 218 / 10 000</span></span>
        <span>Always peaking. ↗</span>
      </div>
    </div>
  );
}

/* ───────── CANVAS ───────── */
function App() {
  return (
    <DesignCanvas title="Reel-Tracker V2" subtitle="Sparkline-Detail-Drawer · PEAKING">
      <DCSection id="grid" title="01 — Desktop Grid View" subtitle="1440 · 3 col">
        <DCArtboard id="grid-1440" label="Reel-Grid · Most-Plays" width={1440} height={1700}>
          <GridScreen />
        </DCArtboard>
      </DCSection>

      <DCSection id="drawer-d" title="02 — Drawer Open · Desktop" subtitle="Slide-from-right · 640px">
        <DCArtboard id="drawer-1440" label="Smash · Friday-Smash · #r3" width={1440} height={1500}>
          <GridWithDrawerScreen />
        </DCArtboard>
      </DCSection>

      <DCSection id="drawer-m" title="03 — Drawer Open · Mobile" subtitle="Bottom-Sheet · 390 × 844">
        <DCArtboard id="drawer-390" label="Mobile bottom-sheet" width={390} height={844}>
          <MobileDrawerScreen />
        </DCArtboard>
      </DCSection>

      <DCSection id="empty" title="04 — Empty State" subtitle="0 reels · day-0 onboarding">
        <DCArtboard id="empty-1440" label="Sunrise-Mountain · Day 0" width={1440} height={1100}>
          <EmptyStateScreen />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
