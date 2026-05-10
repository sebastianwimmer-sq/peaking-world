const MODULES = [
  { cat: 'Daily Drive', items: [
    { id: 'tracker',  emoji: '🔥', name: 'Reel Tracker',  desc: 'Performance + 2026 Algo-Metrics', live: true },
    { id: 'next',     emoji: '🎯', name: 'Nächster Post', desc: 'Empfehlung für heute' },
    { id: 'calendar', emoji: '📅', name: 'Kalender',      desc: 'Cluster Mo/Mi/Fr/Sa' },
  ]},
  { cat: 'Create', items: [
    { id: 'hooks',    emoji: '🪝', name: 'Hook Library', desc: '50+ Patterns · Win-Rate', live: true, hot: true },
    { id: 'captions', emoji: '✍️', name: 'Caption Lab',  desc: 'CTA-Templates · DACH' },
    { id: 'ideas',    emoji: '💡', name: 'Ideen-Inbox',  desc: 'Aus Notes/Voice' },
    { id: 'recorder', emoji: '🎥', name: 'Recorder Setup', desc: 'Light · Audio · POV' },
  ]},
  { cat: 'Analyze', items: [
    { id: 'analytics', emoji: '📊', name: 'Analytics',  desc: 'Säulen + Watch-Time' },
    { id: 'growth',    emoji: '📈', name: 'Growth Center', desc: '2k → 1M Pfad' },
    { id: 'badges',    emoji: '🏆', name: 'Streaks & Badges', desc: 'Gamification' },
  ]},
  { cat: 'Coach', items: [
    { id: 'coach',  emoji: '🧭', name: 'PEAKING Coach', desc: 'AI-Sparring · Daily', live: true, hot: true },
    { id: 'sprints', emoji: '⚡', name: 'Sprints',       desc: '7-Tage Challenges' },
    { id: 'engage',  emoji: '🤝', name: 'Engagement-Plan', desc: 'Reply-Loops' },
  ]},
  { cat: 'Stack', items: [
    { id: 'links',     emoji: '🔗', name: 'Link in Bio', desc: 'Linktree-Style' },
    { id: 'manifest',  emoji: '📜', name: 'Manifesto',   desc: 'Warum PEAKING' },
    { id: 'changelog', emoji: '🛠️', name: 'Changelog',  desc: 'Public Build-Log' },
    { id: 'settings',  emoji: '⚙️', name: 'Settings',    desc: 'Pillars · Profil', live: true },
  ]},
];

function Dashboard({ account, onSwitch, onLogout, onOpen }) {
  const acc = ACCOUNTS[account];
  const pillars = PILLARS_BY_ACCOUNT[account];

  return (
    <div>
      <Header account={account} onSwitch={onSwitch} />
      <main style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 20px 80px' }}>
        {/* Welcome hero */}
        <section className="float-in" style={{ marginBottom: 28 }}>
          <Eyebrow>Welcome back · {acc.handle}</Eyebrow>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', margin: '6px 0 4px', lineHeight: 1.1 }}>
            Du climbst — der Peak <span style={{ background: 'linear-gradient(135deg,#FF6B6B,#FFA94D,#FFD43B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>rewards</span> dich.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>{acc.welcome}</p>
        </section>

        {/* Stats row */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 12, marginBottom: 16 }} className="stagger">
          <StatCard label="Follower" value={account === 'peakingworld' ? '347' : '2.080'} delta="+12 · 7d" />
          <StatCard label="Posts diese Woche" value="3" delta="von 4 geplant" />
          <StatCard label="Streak" value="🔥 12" delta="Tage" />
          <StatCard label="⌀ Views" value={account === 'peakingworld' ? '480' : '1.240'} delta="+18% · 30d" />
        </section>

        {/* Next-post hero card */}
        <GlassCard emphasized className="float-in glow-pulse" style={{
          marginBottom: 28,
          background: 'linear-gradient(120deg, rgba(255,107,107,0.18), rgba(255,169,77,0.18), rgba(255,212,59,0.18))',
          backgroundSize: '300% 100%',
          borderLeft: '4px solid #FFA94D',
          boxShadow: '0 12px 40px rgba(255,169,77,0.12)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <Eyebrow style={{ color: '#FFA94D' }}>🎯 Nächster Post · {todayShort()}</Eyebrow>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>
                {account === 'peakingworld' ? '🛠️ Tools-Reel' : '💪 Gym-Reel'} · Cluster-Day
              </div>
              <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>Empfohlene Zeit: <b>19:00 Uhr</b> · Hook unter 1.2s</div>
            </div>
            <Btn variant="secondary" icon="⚡" onClick={() => onOpen('tracker')}>Zum Recorder →</Btn>
          </div>
        </GlassCard>

        {/* Pillars overview */}
        <section style={{ marginBottom: 32 }}>
          <Eyebrow style={{ marginBottom: 10 }}>Säulen · Balance diese Woche</Eyebrow>
          <GlassCard>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(pillars).map(([k, p]) => (
                <div key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: `${p.color}22`, color: p.color, border: `1px solid ${p.color}55` }}>
                  <span>{p.emoji}</span><span>{p.name}</span><span style={{ opacity: 0.7, fontWeight: 500 }}>· {p.target}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Modules by category */}
        {MODULES.map((cat, ci) => (
          <section key={cat.cat} style={{ marginBottom: 28 }}>
            <Eyebrow style={{ marginBottom: 10 }}>{cat.cat}</Eyebrow>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }} className="stagger">
              {cat.items.map(m => (
                <ModuleTile key={m.id} mod={m} onOpen={() => m.live ? onOpen(m.id) : null} />
              ))}
            </div>
          </section>
        ))}

        <footer style={{ textAlign: 'center', marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', color: '#64748b', fontSize: 11 }}>
          🔐 Geschützter Bereich · ⛰️ The climb is the peak. · <button onClick={onLogout} style={{ background: 'transparent', border: 'none', color: '#FFA94D', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11 }}>Logout</button>
        </footer>
      </main>
    </div>
  );
}

function StatCard({ label, value, delta }) {
  return (
    <GlassCard style={{ padding: 14 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#FFA94D', lineHeight: 1.05, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{delta}</div>
    </GlassCard>
  );
}

function ModuleTile({ mod, onOpen }) {
  return (
    <GlassCard emphasized={mod.hot} onClick={onOpen} style={{ padding: 16, position: 'relative', opacity: mod.live ? 1 : 0.85 }}>
      {mod.hot && <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'linear-gradient(135deg,#FFA94D,#FF6B6B)', color: '#0f172a' }}>HOT</span>}
      {!mod.live && <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(100,116,139,0.2)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>SOON</span>}
      <div style={{ fontSize: 30, marginBottom: 8 }}>{mod.emoji}</div>
      <div style={{ fontWeight: 800, fontSize: 15 }}>{mod.name}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.4 }}>{mod.desc}</div>
    </GlassCard>
  );
}

function todayShort() {
  return new Date().toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' });
}

window.Dashboard = Dashboard;
