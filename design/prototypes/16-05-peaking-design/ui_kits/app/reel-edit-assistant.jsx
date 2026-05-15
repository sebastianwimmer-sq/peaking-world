// ✂️  Reel-Edit-Assistant — raw video → 3 cuts + subtitles + music genre.
// State machine: 'idle' → 'uploading' → 'analyzing' → 'done'.
// Click "Demo upload" to walk through states. Always lands on Step 2/3 with results.

const { useState, useEffect, useMemo, useRef } = React;

// ============================================================
// BRANDS (mirrors Insta Insights, simplified)
// ============================================================
const BRANDS = [
  { key: 'peakingworld',   handle: '@peakingworld',   emoji: '🚀', desc: 'AI + Creator Tools',         color: '#FFA94D', voice: 'builder' },
  { key: 'vegetarianhulk', handle: '@vegetarianhulk', emoji: '🏔️', desc: 'Outdoor · Plant-Based',     color: '#10b981', voice: 'outdoor' },
  { key: 'smashtheapp',    handle: '@smashtheapp',    emoji: '💚', desc: 'Habit-Tracker · Hulk',       color: '#39FF14', voice: 'hulk' },
];

// ============================================================
// MOCK ANALYSIS DATA — what Whisper+Claude "returned"
// ============================================================
const ANALYSIS_BY_BRAND = {
  peakingworld: {
    sourceTitle: 'raw-recording-2026-05-14-bip-day23.mp4',
    sourceDuration: '2:14',
    sourceSize: '48.2 MB',
    cuts: [
      {
        from: '0:08', to: '0:18', dur: 10, score: 5, hookPattern: 'Contrarian-Take',
        hue: 18,
        transcript: [
          { t: '0:08', txt: '20 modules in 23 days. Solo.' },
          { t: '0:11', txt: 'And no, I didn\'t use a no-code tool.' },
          { t: '0:14', txt: 'Here\'s why that matters for solo-creators.' },
        ],
      },
      {
        from: '0:42', to: '0:54', dur: 12, score: 4, hookPattern: 'Stat-Reveal',
        hue: 38,
        transcript: [
          { t: '0:42', txt: '80% of solo-builders abandon the project at week 3.' },
          { t: '0:46', txt: 'I almost did. The fix wasn\'t motivation —' },
          { t: '0:50', txt: 'it was a 25-min daily commitment. That\'s it.' },
        ],
      },
      {
        from: '1:32', to: '1:39', dur: 7, score: 4, hookPattern: 'Listicle-Promise',
        hue: 52,
        transcript: [
          { t: '1:32', txt: 'Three things I\'d change if I started over:' },
          { t: '1:35', txt: 'One — pick the metric before the stack.' },
          { t: '1:37', txt: 'Two — ship public on day one.' },
        ],
      },
    ],
    musicSuggestions: [
      { genre: 'lo-fi calm',       reason: 'matches deliberate, builder-pace narration',  bpm: 72, primary: true },
      { genre: 'minimal techno',   reason: 'works if you cut for the "stat-reveal" loop', bpm: 118 },
      { genre: 'uplifting beats',  reason: 'good fallback for high-energy edit',         bpm: 108 },
    ],
    captionStyles: [
      { id: 'sunrise',  name: 'Sunrise Bold',    sample: 'BUILD IT.',          bg: 'gradient', size: 'XL' },
      { id: 'punch',    name: 'Punch · 1 line',  sample: 'one word per cut',   bg: 'dark',     size: 'L' },
      { id: 'subline',  name: 'Sub-line',        sample: 'multi-line karaoke', bg: 'soft',     size: 'M' },
      { id: 'wordpop',  name: 'Word-Pop',        sample: 'word.by.word',       bg: 'yellow',   size: 'L' },
      { id: 'cleansub', name: 'Clean · SRT',     sample: 'standard subtitles', bg: 'white',    size: 'S' },
    ],
  },
  vegetarianhulk: {
    sourceTitle: 'raw-trail-morning-2026-05-14.mp4',
    sourceDuration: '1:47',
    sourceSize: '36.1 MB',
    cuts: [
      {
        from: '0:05', to: '0:13', dur: 8, score: 5, hookPattern: 'Pattern-Interrupt',
        hue: 18,
        transcript: [
          { t: '0:05', txt: 'I quit the gym 14 months ago.' },
          { t: '0:08', txt: 'My back is stronger than ever.' },
          { t: '0:11', txt: 'Outdoor calisthenics is the cheat code.' },
        ],
      },
      {
        from: '0:33', to: '0:43', dur: 10, score: 4, hookPattern: 'POV-Reveal',
        hue: 38,
        transcript: [
          { t: '0:33', txt: '5 AM. 4 degrees. Sunrise hits the ridge.' },
          { t: '0:37', txt: 'This is the rep I show up for.' },
          { t: '0:40', txt: 'No gym membership. No commute. Just this.' },
        ],
      },
      {
        from: '1:12', to: '1:19', dur: 7, score: 3, hookPattern: 'Question-Hook',
        hue: 52,
        transcript: [
          { t: '1:12', txt: 'Would you train here every morning?' },
          { t: '1:15', txt: 'I\'ll show you my 3-move circuit.' },
          { t: '1:17', txt: 'Pull. Push. Carry. That\'s it.' },
        ],
      },
    ],
    musicSuggestions: [
      { genre: 'ambient acoustic', reason: 'matches outdoor-morning visual rhythm',     bpm: 86, primary: true },
      { genre: 'cinematic build',  reason: 'works for the sunrise reveal at 0:37',     bpm: 92 },
      { genre: 'lo-fi calm',       reason: 'safe fallback if voice carries the reel',  bpm: 72 },
    ],
    captionStyles: [
      { id: 'sunrise',  name: 'Sunrise Bold',    sample: 'TRAIL DAY.',         bg: 'gradient', size: 'XL' },
      { id: 'punch',    name: 'Punch · 1 line',  sample: 'one word per cut',   bg: 'dark',     size: 'L' },
      { id: 'subline',  name: 'Sub-line',        sample: 'multi-line karaoke', bg: 'soft',     size: 'M' },
      { id: 'wordpop',  name: 'Word-Pop',        sample: 'word.by.word',       bg: 'yellow',   size: 'L' },
      { id: 'cleansub', name: 'Clean · SRT',     sample: 'standard subtitles', bg: 'white',    size: 'S' },
    ],
  },
  smashtheapp: {
    sourceTitle: 'streak-day-100-raw.mp4',
    sourceDuration: '1:52',
    sourceSize: '39.7 MB',
    cuts: [
      {
        from: '0:04', to: '0:11', dur: 7, score: 5, hookPattern: 'Number-Drop',
        hue: 18,
        transcript: [
          { t: '0:04', txt: '100 days. No miss. Receipts in the app.' },
          { t: '0:07', txt: 'Here\'s what actually changed.' },
          { t: '0:09', txt: 'Spoiler: it wasn\'t the habit.' },
        ],
      },
      {
        from: '0:48', to: '0:58', dur: 10, score: 4, hookPattern: 'Confession',
        hue: 38,
        transcript: [
          { t: '0:48', txt: 'I broke the streak twice in week 3.' },
          { t: '0:52', txt: 'Restarted same-day. That\'s the only rule.' },
          { t: '0:55', txt: 'Mach hin. Even when you don\'t want to.' },
        ],
      },
      {
        from: '1:24', to: '1:31', dur: 7, score: 4, hookPattern: 'Mini-System',
        hue: 52,
        transcript: [
          { t: '1:24', txt: 'My 3-step morning chain:' },
          { t: '1:27', txt: 'Water. Push-ups. Open the app.' },
          { t: '1:29', txt: 'Two minutes. Compound it.' },
        ],
      },
    ],
    musicSuggestions: [
      { genre: 'minimal techno',   reason: 'matches Hulk-Mode tempo',                   bpm: 122, primary: true },
      { genre: 'uplifting beats',  reason: 'good for the streak-reveal at 0:04',        bpm: 108 },
      { genre: 'lo-fi calm',       reason: 'use only if you cut to a confession-only edit', bpm: 72 },
    ],
    captionStyles: [
      { id: 'sunrise',  name: 'Sunrise Bold',    sample: 'MACH HIN.',          bg: 'gradient', size: 'XL' },
      { id: 'punch',    name: 'Punch · 1 line',  sample: 'one word per cut',   bg: 'dark',     size: 'L' },
      { id: 'subline',  name: 'Sub-line',        sample: 'multi-line karaoke', bg: 'soft',     size: 'M' },
      { id: 'wordpop',  name: 'Word-Pop',        sample: 'word.by.word',       bg: 'yellow',   size: 'L' },
      { id: 'cleansub', name: 'Clean · SRT',     sample: 'standard subtitles', bg: 'white',    size: 'S' },
    ],
  },
};

// ============================================================
// Atomic UI
// ============================================================
function Card({ children, padding = 20, style, emphasized }) {
  return (
    <div style={{
      background: 'rgba(30,41,59,0.6)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: `1px solid ${emphasized ? 'rgba(255,169,77,0.3)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 18,
      padding,
      ...style,
    }}>{children}</div>
  );
}

function Stars({ n, max = 5 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 12 12" style={{ display: 'block' }}>
          <defs>
            <linearGradient id={`star-${i}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF6B6B"/>
              <stop offset="50%" stopColor="#FFA94D"/>
              <stop offset="100%" stopColor="#FFD43B"/>
            </linearGradient>
          </defs>
          <path
            d="M6 1l1.7 3.5 3.8.55-2.75 2.7.65 3.8L6 9.7l-3.4 1.85.65-3.8L.5 5.05l3.8-.55L6 1z"
            fill={i < n ? `url(#star-${i})` : 'rgba(255,255,255,0.08)'}
            stroke={i < n ? 'none' : 'rgba(255,255,255,0.12)'}
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </span>
  );
}

// ============================================================
// BRAND SWITCHER (reused pattern, simplified)
// ============================================================
function BrandSwitcher({ brand, onSwitch }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 14px 8px 10px', borderRadius: 12,
        background: 'rgba(15,23,42,0.7)',
        border: `1px solid ${open ? 'rgba(255,169,77,0.4)' : 'rgba(255,255,255,0.10)'}`,
        color: '#fff', fontFamily: 'Inter, sans-serif', cursor: 'pointer', minWidth: 220,
      }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center', background: `${brand.color}22`, border: `1px solid ${brand.color}55`, fontSize: 14 }}>{brand.emoji}</span>
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
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)', padding: 6, zIndex: 50,
        }}>
          {BRANDS.map(b => {
            const active = b.key === brand.key;
            return (
              <button key={b.key} onClick={() => { onSwitch(b); setOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '8px 10px', borderRadius: 8,
                background: active ? 'rgba(255,169,77,0.10)' : 'transparent',
                border: active ? '1px solid rgba(255,169,77,0.3)' : '1px solid transparent',
                color: '#fff', fontFamily: 'Inter, sans-serif', cursor: 'pointer', textAlign: 'left',
              }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center', background: `${b.color}22`, border: `1px solid ${b.color}55`, fontSize: 14 }}>{b.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{b.handle}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{b.desc}</div>
                </div>
                {active && <span style={{ color: '#FFA94D' }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// STEPPER (top of page)
// ============================================================
function Stepper({ phase }) {
  const steps = [
    { key: 'upload',  label: 'Upload',       icon: '📥' },
    { key: 'analyze', label: 'Analyse',      icon: '🤖' },
    { key: 'cuts',    label: 'Pick a Cut',   icon: '✂️' },
    { key: 'export',  label: 'Export',       icon: '🚀' },
  ];
  // active step
  const order = { idle: 0, uploading: 0, analyzing: 1, done: 2 };
  const active = order[phase] ?? 2;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '4px 14px', borderRadius: 999, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Inter, sans-serif' }}>
      {steps.map((s, i) => {
        const isActive = i === active;
        const isDone = i < active;
        const color = isActive ? '#FFA94D' : isDone ? '#34d399' : '#64748b';
        return (
          <React.Fragment key={s.key}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 8px',
              opacity: isActive || isDone ? 1 : 0.6,
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 99, display: 'grid', placeItems: 'center',
                background: isActive ? 'rgba(255,169,77,0.15)' : isDone ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isActive ? 'rgba(255,169,77,0.4)' : isDone ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.08)'}`,
                fontSize: 11, color,
              }}>{isDone ? '✓' : i + 1}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.10)' }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============================================================
// STEP 1: DROP ZONE
// ============================================================
function DropZone({ phase, fileName, fileSize, fileDuration, progress, onDemo, onReset }) {
  if (phase === 'idle') {
    return (
      <Card padding={32}>
        <div
          style={{
            border: '2px dashed rgba(255,169,77,0.3)',
            borderRadius: 14,
            padding: '40px 24px',
            textAlign: 'center',
            background: 'rgba(255,169,77,0.03)',
            transition: 'background 160ms, border-color 160ms',
            cursor: 'pointer',
          }}
          onClick={onDemo}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,169,77,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,169,77,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,169,77,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,169,77,0.3)'; }}
        >
          <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 16px', display: 'grid', placeItems: 'center',
            background: 'linear-gradient(135deg, rgba(255,107,107,0.15), rgba(255,169,77,0.18), rgba(255,212,59,0.15))',
            border: '1px solid rgba(255,169,77,0.3)',
            boxShadow: '0 8px 24px rgba(255,169,77,0.18)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v12m0-12l-4 4m4-4l4 4M4 18h16" stroke="#FFA94D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 6 }}>
            Drop raw video here
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
            mp4 / mov · max 5 min · processed local + via Whisper
          </div>
          <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <button onClick={(e) => { e.stopPropagation(); onDemo(); }} style={btnPrimary}>📥 Choose file</button>
            <span style={{ fontSize: 11, color: '#64748b' }}>or paste a Drive URL ↵</span>
          </div>
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#64748b', display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span>🔒 Local Whisper</span>
            <span>⚡ ~28s for 2 min</span>
            <span>🇪🇺 No retention</span>
          </div>
        </div>
      </Card>
    );
  }

  // uploading / analyzing / done — show file pill + progress
  const stages = [
    { key: 'uploading',  label: 'Hochladen…',            pct: progress?.upload ?? 0 },
    { key: 'analyzing',  label: 'Whisper transkribiert', pct: progress?.transcribe ?? 0 },
    { key: 'analyzing',  label: 'Claude findet Hooks…',  pct: progress?.analyze ?? 0 },
  ];

  return (
    <Card padding={20}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: phase === 'done' ? 0 : 16 }}>
        {/* video thumbnail */}
        <div style={{
          width: 88, height: 52, flexShrink: 0,
          borderRadius: 8, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(255,107,107,0.4), rgba(255,169,77,0.25) 60%, rgba(15,23,42,0.7))',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'grid', placeItems: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M9 7v10l8-5-8-5z" fill="#fff" fillOpacity="0.85"/></svg>
          <div style={{ position: 'absolute', bottom: 2, right: 3, fontSize: 9, fontWeight: 700, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{fileDuration}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{fileName}</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 11, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
            <span>{fileSize}</span>
            <span style={{ width: 3, height: 3, borderRadius: 99, background: '#475569' }}/>
            <span>{fileDuration}</span>
            <span style={{ width: 3, height: 3, borderRadius: 99, background: '#475569' }}/>
            <span style={{
              padding: '2px 7px', borderRadius: 99,
              background: phase === 'done' ? 'rgba(52,211,153,0.12)' : 'rgba(255,169,77,0.12)',
              color: phase === 'done' ? '#34d399' : '#FFA94D',
              border: phase === 'done' ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(255,169,77,0.3)',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>{phase === 'done' ? '✓ Analyzed' : phase === 'uploading' ? 'Uploading' : 'Analyzing'}</span>
          </div>
        </div>
        <button onClick={onReset} style={{
          padding: '7px 12px', borderRadius: 8,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: '#94a3b8', fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, cursor: 'pointer',
        }}>Replace</button>
      </div>

      {phase !== 'done' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          {stages.map((st, i) => {
            const done = st.pct >= 100;
            const active = !done && st.pct > 0;
            const muted = st.pct === 0;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Inter, sans-serif' }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 99, display: 'grid', placeItems: 'center', flexShrink: 0,
                  background: done ? 'rgba(52,211,153,0.15)' : active ? 'rgba(255,169,77,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${done ? 'rgba(52,211,153,0.4)' : active ? 'rgba(255,169,77,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  fontSize: 9, color: done ? '#34d399' : active ? '#FFA94D' : '#64748b',
                }}>{done ? '✓' : i + 1}</span>
                <span style={{ fontSize: 11, color: muted ? '#64748b' : '#cbd5e1', minWidth: 180, fontWeight: 600 }}>{st.label}</span>
                <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${st.pct}%`,
                    background: done ? '#34d399' : 'linear-gradient(90deg, #FF6B6B, #FFA94D, #FFD43B)',
                    borderRadius: 99,
                    transition: 'width 200ms ease-out',
                    boxShadow: active ? '0 0 12px rgba(255,169,77,0.4)' : 'none',
                  }}/>
                </div>
                <span style={{ fontSize: 10, color: '#64748b', minWidth: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round(st.pct)}%</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

const btnPrimary = {
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FFA94D 50%, #FFD43B 100%)',
  color: '#0f172a', fontWeight: 800, fontFamily: 'Inter, sans-serif', fontSize: 13,
  padding: '10px 18px', border: 'none', borderRadius: 10, cursor: 'pointer',
  boxShadow: '0 6px 20px rgba(255,169,77,0.3)',
  display: 'inline-flex', alignItems: 'center', gap: 6,
};

// ============================================================
// VIDEO FRAME PREVIEW (stylized)
// ============================================================
function VideoFrame({ hue, label, time, isSelected }) {
  // 9:16 ratio mini frame with sunrise gradient + horizon
  return (
    <div style={{
      aspectRatio: '9 / 16', width: '100%',
      borderRadius: 10, overflow: 'hidden', position: 'relative',
      border: isSelected ? '1.5px solid rgba(255,169,77,0.7)' : '1px solid rgba(255,255,255,0.08)',
      boxShadow: isSelected ? '0 0 24px rgba(255,169,77,0.3)' : '0 4px 12px rgba(0,0,0,0.4)',
      background: `linear-gradient(180deg, hsl(${hue + 200}, 30%, 18%) 0%, hsl(${hue + 220}, 40%, 10%) 100%)`,
    }}>
      {/* horizon glow */}
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0, height: '50%',
        background: `radial-gradient(ellipse at 50% 0%, hsla(${hue}, 100%, 70%, 0.5), transparent 60%)`,
      }}/>
      {/* peak silhouette */}
      <svg viewBox="0 0 100 178" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <polygon points="0,178 0,140 30,90 55,110 75,75 100,100 100,178" fill="rgba(15,23,42,0.85)"/>
      </svg>
      {/* caption box (mock) */}
      <div style={{
        position: 'absolute', left: 6, right: 6, bottom: '22%',
        padding: '4px 6px', borderRadius: 4,
        background: 'linear-gradient(135deg, #FFA94D, #FFD43B)',
        color: '#0f172a',
        fontFamily: 'Inter, sans-serif', fontSize: 7.5, fontWeight: 900,
        textAlign: 'center', letterSpacing: '0.04em',
        textTransform: 'uppercase',
        textShadow: '0 1px 0 rgba(255,255,255,0.2)',
      }}>{label}</div>
      {/* time pill */}
      <div style={{
        position: 'absolute', top: 6, right: 6,
        padding: '2px 6px', borderRadius: 99,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
        fontFamily: 'Inter, sans-serif', fontSize: 8, fontWeight: 700, color: '#fff',
        letterSpacing: '0.04em',
      }}>{time}</div>
      {/* play overlay */}
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div style={{
          width: 30, height: 30, borderRadius: 99,
          background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'grid', placeItems: 'center',
        }}>
          <svg width="10" height="10" viewBox="0 0 12 12"><path d="M3 2v8l7-4-7-4z" fill="#fff"/></svg>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CUT SUGGESTION CARD
// ============================================================
function CutCard({ cut, index, brand, isPicked, onUse }) {
  const previewLabel = cut.transcript[0].txt.split(/\s+/).slice(0, 2).join(' ').toUpperCase();
  return (
    <Card padding={14} emphasized={isPicked} style={{
      position: 'relative',
      background: isPicked
        ? 'linear-gradient(180deg, rgba(255,169,77,0.10), rgba(30,41,59,0.6))'
        : 'rgba(30,41,59,0.6)',
      transition: 'background 200ms',
    }}>
      <div style={{ display: 'flex', gap: 14 }}>
        {/* video frame */}
        <div style={{ width: 84, flexShrink: 0 }}>
          <VideoFrame hue={cut.hue} label={previewLabel} time={cut.from} isSelected={isPicked}/>
        </div>

        {/* meta */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* header line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {isPicked ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 8px', borderRadius: 99,
                  background: 'linear-gradient(135deg, #FFA94D, #FF6B6B)',
                  color: '#0f172a', fontFamily: 'Inter, sans-serif',
                  fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(255,169,77,0.4)',
                }}>★ Cut {index + 1} · Picked</span>
              ) : (
                <span style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 800, color: '#64748b',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>Cut {index + 1}</span>
              )}
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#fff',
                fontVariantNumeric: 'tabular-nums',
              }}>{cut.from}–{cut.to}</span>
              <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>· {cut.dur}s</span>
            </div>
            <Stars n={cut.score}/>
          </div>

          {/* hook pattern pill */}
          <div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 9px', borderRadius: 99,
              fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#FFA94D',
              background: 'rgba(255,169,77,0.10)',
              border: '1px solid rgba(255,169,77,0.3)',
            }}>
              🪝 {cut.hookPattern}
            </span>
          </div>

          {/* transcript preview */}
          <div style={{
            padding: '8px 10px', borderRadius: 8,
            background: 'rgba(15,23,42,0.5)',
            border: '1px solid rgba(255,255,255,0.05)',
            fontFamily: 'Inter, sans-serif', fontSize: 11, lineHeight: 1.45,
            display: 'flex', flexDirection: 'column', gap: 3,
          }}>
            {cut.transcript.map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: '#FFA94D', fontWeight: 700, minWidth: 28, fontVariantNumeric: 'tabular-nums' }}>{line.t}</span>
                <span style={{ color: '#cbd5e1' }}>{line.txt}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button onClick={() => onUse(index)} style={isPicked ? btnGhost : btnPrimary}>
            {isPicked ? '✓ This cut · selected' : '✂️ Use this cut'}
          </button>
        </div>
      </div>
    </Card>
  );
}

const btnGhost = {
  background: 'rgba(255,255,255,0.04)',
  color: '#cbd5e1', fontWeight: 700, fontFamily: 'Inter, sans-serif', fontSize: 13,
  padding: '10px 18px', border: '1px solid rgba(255,169,77,0.25)', borderRadius: 10, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6,
};

// ============================================================
// STEP 3: OUTPUT PANEL
// ============================================================
function OutputPanel({ analysis, picked, brand }) {
  const [music, setMusic] = useState(analysis.musicSuggestions[0].genre);
  const [captionStyle, setCaptionStyle] = useState('sunrise');
  const cut = analysis.cuts[picked];
  const pickedStyle = analysis.captionStyles.find(s => s.id === captionStyle);

  // Build a tiny SRT preview
  const srtPreview = useMemo(() => cut.transcript.slice(0, 3).map((line, i) => {
    const start = msToSrt(toMs(line.t) - toMs(cut.from));
    const next = cut.transcript[i + 1];
    const end = next ? msToSrt(toMs(next.t) - toMs(cut.from)) : msToSrt(cut.dur * 1000);
    return `${i + 1}\n${start} --> ${end}\n${line.txt}`;
  }).join('\n\n'), [cut]);

  return (
    <Card padding={18}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 800, color: '#FFA94D', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Step 3 · Export</div>
          <h2 style={{ margin: '4px 0 0', fontFamily: 'Inter, sans-serif', fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em' }}>Cut {picked + 1} ready for DaVinci</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.6)' }}/>
          Synced · Cut faster, post more.
        </div>
      </div>

      {/* 2-col layout: SRT/timestamps + music+caption */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 14 }} className="output-grid">
        {/* SRT preview */}
        <div>
          <Subsection title="SRT · Subtitles" right={<span style={{ fontSize: 10, color: '#64748b' }}>{cut.transcript.length} lines · {cut.dur}s</span>}/>
          <pre style={{
            margin: 0, padding: 12, borderRadius: 8,
            background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.05)',
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 10.5, lineHeight: 1.55, color: '#cbd5e1',
            overflow: 'hidden', maxHeight: 168,
            whiteSpace: 'pre-wrap',
          }}>{srtPreview}</pre>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button style={btnPrimary}>📥 Download .srt</button>
            <button style={btnGhost}>📋 Copy timestamps</button>
          </div>
        </div>

        {/* Music genre + caption style */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <Subsection title="Music genre" right={<span style={{ fontSize: 10, color: '#64748b' }}>Tipps · keine Audio-Auswahl</span>}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {analysis.musicSuggestions.map(m => {
                const sel = music === m.genre;
                return (
                  <button key={m.genre} onClick={() => setMusic(m.genre)} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 8,
                    background: sel ? 'rgba(255,169,77,0.08)' : 'rgba(15,23,42,0.5)',
                    border: `1px solid ${sel ? 'rgba(255,169,77,0.4)' : 'rgba(255,255,255,0.05)'}`,
                    color: '#fff', fontFamily: 'Inter, sans-serif', cursor: 'pointer', textAlign: 'left',
                    transition: 'border-color 120ms, background 120ms',
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 6, display: 'grid', placeItems: 'center', flexShrink: 0,
                      background: sel ? 'linear-gradient(135deg, #FFA94D, #FF6B6B)' : 'rgba(255,255,255,0.05)',
                      color: sel ? '#0f172a' : '#94a3b8', fontSize: 10, fontWeight: 800,
                    }}>{sel ? '♪' : ' '}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: sel ? '#FFA94D' : '#fff' }}>{m.genre}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{m.reason}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{m.bpm} bpm</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Subsection title="Caption style" right={<span style={{ fontSize: 10, color: '#64748b' }}>5 brand-styles</span>}/>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
              {analysis.captionStyles.map(s => (
                <CaptionStyleChip key={s.id} style={s} selected={captionStyle === s.id} onClick={() => setCaptionStyle(s.id)}/>
              ))}
            </div>
            <div style={{
              marginTop: 8, padding: '8px 10px', borderRadius: 8,
              background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.05)',
              fontSize: 11, color: '#94a3b8', fontFamily: 'Inter, sans-serif',
            }}>
              <span style={{ color: '#FFA94D', fontWeight: 700 }}>{pickedStyle.name}</span>
              {' '}— ‚{pickedStyle.sample}', size {pickedStyle.size}
            </div>
          </div>
        </div>
      </div>

      {/* Final export bar */}
      <div style={{
        marginTop: 18, padding: 14, borderRadius: 12,
        background: 'linear-gradient(135deg, rgba(255,107,107,0.08), rgba(255,169,77,0.12), rgba(255,212,59,0.08))',
        border: '1px solid rgba(255,169,77,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 800, color: '#FFA94D', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Final · Hand-off</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, color: '#fff', marginTop: 4 }}>
            Includes cut markers · SRT · music notes · caption preset
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btnGhost}>📦 Copy bundle</button>
          <button style={{ ...btnPrimary, padding: '12px 22px', fontSize: 14, boxShadow: '0 8px 28px rgba(255,169,77,0.5)' }}>🚀 Export to DaVinci</button>
        </div>
      </div>
    </Card>
  );
}

const Subsection = ({ title, right }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
    <h3 style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '-0.01em', color: '#fff' }}>{title}</h3>
    {right}
  </div>
);

function CaptionStyleChip({ style, selected, onClick }) {
  // mini visual for the style
  const bgs = {
    gradient: { bg: 'linear-gradient(135deg, #FFA94D, #FFD43B)', fg: '#0f172a', border: 'none' },
    dark:     { bg: 'rgba(15,23,42,0.95)',                       fg: '#fff',    border: '1px solid rgba(255,255,255,0.2)' },
    soft:     { bg: 'rgba(255,255,255,0.1)',                     fg: '#fff',    border: '1px solid rgba(255,255,255,0.15)' },
    yellow:   { bg: '#FFD43B',                                   fg: '#0f172a', border: 'none' },
    white:    { bg: '#f8fafc',                                   fg: '#0f172a', border: 'none' },
  };
  const v = bgs[style.bg];
  return (
    <button onClick={onClick} style={{
      aspectRatio: '9/16', borderRadius: 8, padding: 0, position: 'relative',
      background: 'rgba(15,23,42,0.6)',
      border: `1.5px solid ${selected ? 'rgba(255,169,77,0.6)' : 'rgba(255,255,255,0.08)'}`,
      cursor: 'pointer', overflow: 'hidden',
      boxShadow: selected ? '0 0 16px rgba(255,169,77,0.25)' : 'none',
      transition: 'border-color 120ms, box-shadow 120ms',
    }}>
      {/* fake video frame */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, hsla(220, 30%, 18%, 1), hsla(220, 40%, 10%, 1))',
      }}/>
      {/* caption bar */}
      <div style={{
        position: 'absolute', left: 4, right: 4, top: '38%',
        padding: '2px 4px', borderRadius: 3,
        background: v.bg, color: v.fg, border: v.border,
        fontFamily: 'Inter, sans-serif', fontSize: 6.5, fontWeight: 900,
        textAlign: 'center', letterSpacing: '0.04em', textTransform: 'uppercase',
        lineHeight: 1.1, overflow: 'hidden',
      }}>{style.sample.slice(0, 14)}</div>
      {/* label */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '4px 4px 5px', background: 'rgba(0,0,0,0.4)', fontFamily: 'Inter, sans-serif', fontSize: 8.5, fontWeight: 700, color: selected ? '#FFA94D' : '#cbd5e1', textAlign: 'center', lineHeight: 1.1 }}>{style.name}</div>
    </button>
  );
}

const toMs = (t) => { const [m, s] = t.split(':').map(Number); return (m * 60 + s) * 1000; };
const msToSrt = (ms) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  const millis = ms % 1000;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(millis).padStart(3,'0')}`;
};

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const [brand, setBrand] = useState(BRANDS[0]);
  const [phase, setPhase] = useState('done'); // 'idle' | 'uploading' | 'analyzing' | 'done'
  const [progress, setProgress] = useState({ upload: 100, transcribe: 100, analyze: 100 });
  const [pickedCut, setPickedCut] = useState(0);

  const analysis = ANALYSIS_BY_BRAND[brand.key];

  function startDemo() {
    setPhase('uploading');
    setProgress({ upload: 0, transcribe: 0, analyze: 0 });
    // upload
    let t1 = setInterval(() => {
      setProgress(p => {
        const next = Math.min(100, p.upload + 16);
        if (next >= 100) {
          clearInterval(t1);
          setPhase('analyzing');
          // transcribe
          let t2 = setInterval(() => {
            setProgress(p => {
              const ttx = Math.min(100, p.transcribe + 9);
              if (ttx >= 100) {
                clearInterval(t2);
                // analyze
                let t3 = setInterval(() => {
                  setProgress(p => {
                    const an = Math.min(100, p.analyze + 12);
                    if (an >= 100) {
                      clearInterval(t3);
                      setTimeout(() => setPhase('done'), 250);
                    }
                    return { ...p, analyze: an };
                  });
                }, 140);
              }
              return { ...p, transcribe: ttx };
            });
          }, 160);
        }
        return { ...p, upload: next };
      });
    }, 120);
  }

  function reset() {
    setPhase('idle');
    setProgress({ upload: 0, transcribe: 0, analyze: 0 });
  }

  // when brand changes, reset cut pick
  useEffect(() => { setPickedCut(0); }, [brand]);

  return (
    <div style={{ minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 60px' }}>

        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#FFA94D', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Module</span>
              <span style={{ width: 3, height: 3, borderRadius: 99, background: '#475569' }}/>
              <span style={{ fontSize: 11, color: '#64748b' }}>peaking.world / create</span>
            </div>
            <h1 style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: 34, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1 }}>
              ✂️ Reel-Edit-Assistant
            </h1>
            <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 13 }}>
              Raw video → 3 cuts + subtitles + music. <span style={{ color: '#FFA94D', fontWeight: 600 }}>Cut faster, post more.</span>
            </p>
          </div>
          <BrandSwitcher brand={brand} onSwitch={setBrand}/>
        </header>

        {/* Stepper */}
        <div style={{ marginBottom: 18, overflowX: 'auto' }}>
          <Stepper phase={phase}/>
        </div>

        {/* Step 1 */}
        <div style={{ marginBottom: 18 }}>
          <DropZone
            phase={phase}
            fileName={analysis.sourceTitle}
            fileSize={analysis.sourceSize}
            fileDuration={analysis.sourceDuration}
            progress={progress}
            onDemo={startDemo}
            onReset={reset}
          />
        </div>

        {/* Step 2 */}
        {(phase === 'done' || phase === 'analyzing') && (
          <div style={{ marginBottom: 18, opacity: phase === 'done' ? 1 : 0.5, transition: 'opacity 200ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 800, color: '#FFA94D', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Step 2 · Pick a cut</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#64748b' }}>3 suggestions · sorted by hook strength</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
              {analysis.cuts.map((cut, i) => (
                <CutCard key={i} cut={cut} index={i} brand={brand} isPicked={pickedCut === i} onUse={setPickedCut}/>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {phase === 'done' && (
          <OutputPanel analysis={analysis} picked={pickedCut} brand={brand}/>
        )}

        {/* Footer hint */}
        <div style={{ textAlign: 'center', marginTop: 28, color: '#475569', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>
          ⛰️ <span style={{ color: '#94a3b8' }}>Always peaking.</span> · Whisper local · Claude (Haiku) for hook detection · No retention.
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .output-grid { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
