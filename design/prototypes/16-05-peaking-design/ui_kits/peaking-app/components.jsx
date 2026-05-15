// Shared atoms for the PEAKING creator-app UI kit.
// All components export to `window` so other Babel scripts can use them.

const { useState, useEffect, useRef } = React;

// Account definitions mirror js/app.js → SmashApp.ACCOUNTS
const ACCOUNTS = {
  vegetarianhulk: {
    key: 'vegetarianhulk',
    handle: '@vegetarianhulk',
    emoji: '🏔️',
    label: 'Outdoor + Plant-Based',
    color: '#10b981',
    welcome: 'Outdoor + Plant-Based · DACH',
  },
  peakingworld: {
    key: 'peakingworld',
    handle: '@peakingworld',
    emoji: '🚀',
    label: 'AI + Creator Tools (BIP)',
    color: '#FFA94D',
    welcome: 'Building in Public · AI + Creator Tools',
  },
};

const PILLARS_BY_ACCOUNT = {
  vegetarianhulk: {
    outdoor:    { emoji: '🏔️', name: 'Outdoor',     color: '#10b981', target: 40 },
    gym:        { emoji: '💪', name: 'Gym',         color: '#f59e0b', target: 25 },
    mindset:    { emoji: '🧠', name: 'Mindset',     color: '#8b5cf6', target: 20 },
    plantbased: { emoji: '🌿', name: 'Plant-Based', color: '#84cc16', target: 15 },
  },
  peakingworld: {
    tools:     { emoji: '🛠️', name: 'Tools',     color: '#FFA94D', target: 35 },
    bip:       { emoji: '📊', name: 'BIP',       color: '#FF6B6B', target: 30 },
    marketing: { emoji: '🧠', name: 'Marketing', color: '#FFD43B', target: 25 },
    bts:       { emoji: '🚀', name: 'BTS',       color: '#a78bfa', target: 10 },
  },
};

// --- Atoms ---
function Btn({ variant = 'primary', children, onClick, disabled, style, type = 'button', icon }) {
  const styles = {
    primary: { background: 'linear-gradient(135deg,#FFD43B,#FFA94D,#FF6B6B)', color: '#0f172a', boxShadow: '0 8px 24px rgba(255,169,77,0.35)', fontWeight: 800 },
    secondary: { background: 'linear-gradient(135deg,#FFA94D,#FF6B6B)', color: '#0f172a', boxShadow: '0 8px 20px rgba(255,169,77,0.3)', fontWeight: 800 },
    ghost: { background: 'rgba(15,23,42,0.6)', color: '#fff', border: '1px solid rgba(255,169,77,0.3)', fontWeight: 600 },
    quiet: { background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600 },
    danger: { background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontWeight: 700 },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="press-feedback btn-shimmer"
      style={{
        padding: '12px 22px',
        borderRadius: 14,
        border: 'none',
        fontSize: 14,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        transition: 'transform 0.12s cubic-bezier(0.34,1.56,0.64,1)',
        ...styles[variant],
        ...style,
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

function GlassCard({ children, emphasized, style, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`peaking-card ${className}`}
      style={{
        background: 'rgba(30,41,59,0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${emphasized ? 'rgba(255,169,77,0.3)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 24,
        padding: 18,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), border-color 0.25s, box-shadow 0.25s',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, active, tone, onClick }) {
  const base = {
    padding: '5px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'transparent',
    color: '#cbd5e1',
    cursor: onClick ? 'pointer' : 'default',
    fontFamily: 'inherit',
    display: 'inline-flex', alignItems: 'center', gap: 4,
  };
  if (active) {
    Object.assign(base, {
      background: 'linear-gradient(135deg,#FFA94D,#FF6B6B)',
      color: '#0f172a',
      border: 'none',
      boxShadow: '0 6px 20px rgba(255,169,77,0.35)',
    });
  }
  if (tone) {
    const tones = {
      success: { color: '#34d399', background: 'rgba(16,185,129,0.18)', borderColor: 'rgba(16,185,129,0.35)' },
      warning: { color: '#fbbf24', background: 'rgba(245,158,11,0.18)', borderColor: 'rgba(245,158,11,0.35)' },
      danger:  { color: '#f87171', background: 'rgba(239,68,68,0.18)',  borderColor: 'rgba(239,68,68,0.35)' },
    };
    Object.assign(base, tones[tone]);
  }
  return <button style={base} onClick={onClick}>{children}</button>;
}

function Eyebrow({ children, style }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', ...style }}>{children}</div>;
}

function Header({ account, onSwitch, onBack, title }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', fontFamily: 'inherit' }}>←</button>
        )}
        <img src="../../assets/logo.svg" alt="" style={{ width: 32, height: 32, filter: 'drop-shadow(0 0 10px rgba(255,169,77,0.45))' }} className="peaking-pulse" />
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em' }}>
            {title || <span style={{ background: 'linear-gradient(135deg,#FF6B6B,#FFA94D,#FFD43B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>peaking</span>}
          </div>
          {!title && <div style={{ fontSize: 10, color: '#64748b', letterSpacing: '0.08em' }}>The climb is the peak.</div>}
        </div>
      </div>
      <AccountSwitcher current={account} onSwitch={onSwitch} />
    </header>
  );
}

function AccountSwitcher({ current, onSwitch }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const acc = ACCOUNTS[current];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'rgba(15,23,42,0.8)',
          border: '1px solid rgba(255,169,77,0.3)',
          color: '#fff', padding: '8px 14px', borderRadius: 999,
          fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 4px 16px rgba(255,169,77,0.2)',
        }}
      >
        <span style={{ fontSize: 16 }}>{acc.emoji}</span>
        <span>{acc.handle}</span>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 260,
          background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,169,77,0.3)', borderRadius: 14, padding: 6,
          boxShadow: '0 12px 32px rgba(0,0,0,0.4), 0 0 24px rgba(255,169,77,0.15)',
          zIndex: 30,
        }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748b', padding: '6px 12px' }}>Account wechseln</div>
          {Object.values(ACCOUNTS).map(a => {
            const active = a.key === current;
            return (
              <button key={a.key} onClick={() => { onSwitch(a.key); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 12px', borderRadius: 10, textAlign: 'left',
                  color: '#fff', fontFamily: 'inherit', fontSize: 14, marginTop: 2,
                  background: active ? 'rgba(255,169,77,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(255,169,77,0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                }}>
                <span style={{ fontSize: 18 }}>{a.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{a.handle}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{a.label}</div>
                </div>
                {active && <span style={{ color: '#FFA94D', fontWeight: 'bold' }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ACCOUNTS, PILLARS_BY_ACCOUNT, Btn, GlassCard, Pill, Eyebrow, Header, AccountSwitcher });
