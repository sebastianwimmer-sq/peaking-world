// Three hero variants for peaking.world. Each is a 414×900 mobile hero.
const { useState } = React;

// --- Shared atoms ---
const Wordmark = ({ size = 64 }) => (
  <div style={{
    fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: size,
    letterSpacing: '-0.03em', lineHeight: 1,
    background: 'linear-gradient(135deg, #FF6B6B 0%, #FFA94D 50%, #FFD43B 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  }}>PEAKING</div>
);

const Tagline = () => (
  <div style={{
    fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 500, fontSize: 18,
    color: '#FFA94D', letterSpacing: '0.02em', marginTop: 8,
  }}>Always peaking.</div>
);

const SubHook = () => (
  <p style={{
    fontFamily: 'Inter, sans-serif', color: '#cbd5e1', fontSize: 15, lineHeight: 1.55,
    maxWidth: 320, margin: '20px auto 0', fontWeight: 400,
  }}>AI-native Solo-Creator-Stack.<br/>Built solo. Public progress.</p>
);

const Pills = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 22 }}>
    {['🔥 Reel-Tracking', '🪝 Hook-Generator', '📊 Posting-Intel'].map(t => (
      <span key={t} style={{
        padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
        color: '#FFA94D', background: 'rgba(255,169,77,0.12)',
        border: '1px solid rgba(255,169,77,0.3)', fontFamily: 'Inter, sans-serif',
        letterSpacing: '0.02em',
      }}>{t}</span>
    ))}
  </div>
);

const CTAs = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginTop: 30, width: '100%' }}>
    <button style={{
      background: 'linear-gradient(135deg, #FFD43B 0%, #FFA94D 50%, #FF6B6B 100%)',
      color: '#0f172a', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 15,
      padding: '15px 32px', border: 'none', borderRadius: 14, cursor: 'pointer',
      boxShadow: '0 8px 24px rgba(255,169,77,0.45), 0 0 0 1px rgba(255,212,59,0.2) inset',
      letterSpacing: '0.01em', minWidth: 260,
    }}>📩 Beta-Access via DM</button>
    <a style={{
      color: '#94a3b8', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500,
      textDecoration: 'none', borderBottom: '1px dashed rgba(148,163,184,0.4)',
      padding: '2px 0',
    }}>peaking.world</a>
  </div>
);

const ScrollHint = () => (
  <div style={{
    position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
    fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#64748b',
    letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
    textAlign: 'center', animation: 'bob 2.4s ease-in-out infinite',
  }}>
    <div>scroll</div>
    <div style={{ fontSize: 14, marginTop: 4 }}>↓</div>
  </div>
);

// Mountain silhouette — multi-layer SVG, sunrise glow behind
const Mountains = ({ height = 280 }) => (
  <svg viewBox="0 0 414 280" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height, display: 'block' }}>
    <defs>
      <radialGradient id="sun" cx="50%" cy="85%" r="40%">
        <stop offset="0%" stopColor="#FFD43B" stopOpacity="0.55"/>
        <stop offset="35%" stopColor="#FFA94D" stopOpacity="0.35"/>
        <stop offset="70%" stopColor="#FF6B6B" stopOpacity="0.12"/>
        <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e293b"/>
        <stop offset="100%" stopColor="#0f172a"/>
      </linearGradient>
      <linearGradient id="mid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0b1322"/>
        <stop offset="100%" stopColor="#050a14"/>
      </linearGradient>
    </defs>
    {/* Sun glow halo */}
    <rect x="0" y="0" width="414" height="280" fill="url(#sun)"/>
    {/* Far range — pale */}
    <path d="M0,180 L40,150 L90,170 L140,130 L200,160 L260,120 L320,150 L380,135 L414,160 L414,280 L0,280 Z" fill="url(#far)" opacity="0.75"/>
    {/* Mid range — darker */}
    <path d="M0,220 L50,195 L110,210 L170,170 L230,200 L290,165 L360,195 L414,180 L414,280 L0,280 Z" fill="url(#mid)" opacity="0.92"/>
    {/* Front range — solid */}
    <path d="M0,260 L60,230 L120,250 L190,210 L260,245 L330,215 L400,240 L414,235 L414,280 L0,280 Z" fill="#020611"/>
    {/* Crest line accents (sunrise rim) */}
    <path d="M170,170 L260,120 L290,165 L360,195" fill="none" stroke="#FFA94D" strokeWidth="1" opacity="0.5"/>
  </svg>
);

// Solid base frame, used by all variants
const Frame = ({ children, bg }) => (
  <div style={{
    position: 'relative', width: 414, height: 900,
    background: bg || 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    overflow: 'hidden', fontFamily: 'Inter, sans-serif', color: '#fff',
  }}>{children}</div>
);

// --- Variant A: no mountain, just radial glow ---
function VariantClean() {
  return (
    <Frame>
      {/* warm radial glows */}
      <div style={{ position: 'absolute', inset: 0, background:
        'radial-gradient(circle at 50% 12%, rgba(255,212,59,0.18), transparent 45%),'
        + 'radial-gradient(circle at 18% 60%, rgba(255,107,107,0.10), transparent 38%),'
        + 'radial-gradient(circle at 82% 78%, rgba(255,169,77,0.10), transparent 36%)',
      }}/>
      <div style={{ position: 'absolute', inset: 0, padding: '60px 24px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 2 }}>
        {/* triangle mark */}
        <svg width="40" height="40" viewBox="0 0 64 64" style={{ filter: 'drop-shadow(0 0 18px rgba(255,169,77,0.55))', marginBottom: 20 }}>
          <defs><linearGradient id="tA" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#FF6B6B"/><stop offset="50%" stopColor="#FFA94D"/><stop offset="100%" stopColor="#FFD43B"/></linearGradient></defs>
          <path d="M32 6 L58 54 L6 54 Z" fill="url(#tA)"/>
        </svg>
        <Wordmark size={56}/>
        <Tagline/>
        <SubHook/>
        <Pills/>
        <div style={{ flex: 1 }}/>
        <CTAs/>
      </div>
      <ScrollHint/>
    </Frame>
  );
}

// --- Variant B: cinematic mountain silhouette ---
function VariantMountain() {
  return (
    <Frame bg="linear-gradient(180deg, #0f172a 0%, #1a1a2e 55%, #2a1f1a 100%)">
      {/* top-of-frame sunrise wash */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 460, background:
        'radial-gradient(ellipse at 50% 95%, rgba(255,212,59,0.25), transparent 55%),'
        + 'radial-gradient(ellipse at 50% 100%, rgba(255,107,107,0.20), transparent 60%)' }}/>
      <Mountains height={320}/>
      <div style={{ position: 'absolute', inset: 0, padding: '70px 24px 110px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 2 }}>
        <svg width="40" height="40" viewBox="0 0 64 64" style={{ filter: 'drop-shadow(0 0 22px rgba(255,169,77,0.65))', marginBottom: 18 }}>
          <defs><linearGradient id="tB" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#FF6B6B"/><stop offset="50%" stopColor="#FFA94D"/><stop offset="100%" stopColor="#FFD43B"/></linearGradient></defs>
          <path d="M32 6 L58 54 L6 54 Z" fill="url(#tB)"/>
        </svg>
        <Wordmark size={56}/>
        <Tagline/>
        <SubHook/>
        <Pills/>
        <div style={{ flex: 1 }}/>
        <CTAs/>
      </div>
      <ScrollHint/>
    </Frame>
  );
}

// --- Variant C: Sebi photo (placeholder portrait at top, fade-to-dark) ---
function VariantPortrait() {
  return (
    <Frame>
      {/* Top 45% — portrait placeholder. Sunrise-tinted, fades into dark gradient */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 420, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(255,169,77,0.5) 0%, rgba(255,107,107,0.35) 30%, rgba(15,23,42,0.0) 65%),'
            + 'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0) 60%, rgba(15,23,42,1) 100%)',
        }}/>
        {/* Silhouette of a person — rough head/shoulder shape */}
        <svg width="100%" height="420" viewBox="0 0 414 420" preserveAspectRatio="xMidYMin slice" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <radialGradient id="skin" cx="50%" cy="40%" r="40%">
              <stop offset="0%" stopColor="#3a2a1f"/>
              <stop offset="60%" stopColor="#1a1410"/>
              <stop offset="100%" stopColor="#0f172a"/>
            </radialGradient>
            <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0"/>
              <stop offset="40%" stopColor="#FFA94D" stopOpacity="0.7"/>
              <stop offset="60%" stopColor="#FFD43B" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* Shoulder/torso silhouette */}
          <path d="M50,420 C60,330 130,290 207,290 C284,290 354,330 364,420 Z" fill="url(#skin)"/>
          {/* Head silhouette */}
          <ellipse cx="207" cy="210" rx="62" ry="78" fill="url(#skin)"/>
          {/* Rim light along edge */}
          <path d="M145,160 C140,200 142,250 160,285" stroke="url(#rim)" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M269,160 C274,200 272,250 254,285" stroke="url(#rim)" strokeWidth="2" fill="none" opacity="0.8"/>
        </svg>
        {/* "Sebi" tag */}
        <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: '#FFA94D', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.7 }}>
          [ photo of Sebi · placeholder ]
        </div>
      </div>

      {/* Content overlay */}
      <div style={{ position: 'absolute', top: 380, left: 0, right: 0, bottom: 0, padding: '0 24px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 2 }}>
        <Wordmark size={56}/>
        <Tagline/>
        <SubHook/>
        <Pills/>
        <div style={{ flex: 1, minHeight: 12 }}/>
        <CTAs/>
      </div>
      <ScrollHint/>
    </Frame>
  );
}

// --- Canvas mount ---
const sections = [{
  id: 'hero', title: 'peaking.world · Hero Variants',
  artboards: [
    { id: 'clean',    label: 'A · Clean (no mountain)',    width: 414, height: 900, render: VariantClean },
    { id: 'mountain', label: 'B · Cinematic Mountain',     width: 414, height: 900, render: VariantMountain },
    { id: 'portrait', label: 'C · Sebi Portrait',          width: 414, height: 900, render: VariantPortrait },
  ],
}];

function App() {
  const [data] = useState(sections);
  return (
    <DesignCanvas>
      {data.map(s => (
        <DCSection key={s.id} id={s.id} title={s.title}>
          {s.artboards.map(a => (
            <DCArtboard key={a.id} id={a.id} label={a.label} width={a.width} height={a.height}>
              {React.createElement(a.render)}
            </DCArtboard>
          ))}
        </DCSection>
      ))}
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
