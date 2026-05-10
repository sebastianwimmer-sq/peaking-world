function App() {
  const [authed, setAuthed] = React.useState(false);
  const [account, setAccount] = React.useState('vegetarianhulk');
  const [screen, setScreen] = React.useState('dashboard'); // 'dashboard' | <moduleId>

  // Seeded sample reels per account (in-memory only)
  const [reelsByAccount, setReelsByAccount] = React.useState({
    vegetarianhulk: [
      { id: 1, title: 'Sunrise Climb · POV', pillar: 'outdoor', views: 2840, date: '2026-05-03' },
      { id: 2, title: 'Push Day · 5x5', pillar: 'gym', views: 1120, date: '2026-05-05' },
      { id: 3, title: 'Why I quit dairy in 30 days', pillar: 'plantbased', views: 4210, date: '2026-05-07' },
      { id: 4, title: '4am wake — no excuses', pillar: 'mindset', views: 980, date: '2026-05-08' },
      { id: 5, title: 'Trail 12km · Plant fuel', pillar: 'outdoor', views: 1640, date: '2026-05-09' },
    ],
    peakingworld: [
      { id: 1, title: 'Building PEAKING in 30 days', pillar: 'bip', views: 620, date: '2026-05-04' },
      { id: 2, title: 'Cursor + Claude · my stack', pillar: 'tools', views: 410, date: '2026-05-06' },
      { id: 3, title: 'Solo-Founder Tag 22', pillar: 'bip', views: 290, date: '2026-05-09' },
    ],
  });

  function addReel(r) {
    setReelsByAccount(prev => ({ ...prev, [account]: [...prev[account], r] }));
  }

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  if (screen === 'tracker') {
    return <Tracker account={account} reels={reelsByAccount[account]} onAdd={addReel} onBack={() => setScreen('dashboard')} />;
  }

  return (
    <Dashboard
      account={account}
      onSwitch={setAccount}
      onLogout={() => setAuthed(false)}
      onOpen={(id) => { if (id === 'tracker') setScreen('tracker'); else flashSoon(id); }}
    />
  );
}

function flashSoon(id) {
  const t = document.createElement('div');
  t.textContent = `🛠️ ${id} · soon`;
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,0.95);color:#fff;padding:10px 18px;border-radius:999px;border:1px solid rgba(255,169,77,0.4);font-size:13px;font-weight:700;z-index:200;box-shadow:0 8px 24px rgba(0,0,0,0.4),0 0 16px rgba(255,169,77,0.2);animation:bounce-toast 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
