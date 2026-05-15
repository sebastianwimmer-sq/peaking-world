// Reel Tracker module: list of tracked reels, add modal, pillar-balance bars.
function Tracker({ account, onBack, reels, onAdd }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const pillars = PILLARS_BY_ACCOUNT[account];

  // Pillar stats for current account
  const total = reels.length;
  const stats = Object.fromEntries(Object.entries(pillars).map(([k, p]) => {
    const count = reels.filter(r => r.pillar === k).length;
    return [k, { ...p, count, pct: total ? Math.round(count / total * 100) : 0 }];
  }));

  return (
    <div>
      <Header account={account} onSwitch={() => {}} onBack={onBack} title="🔥 Reel Tracker" />
      <main style={{ maxWidth: 880, margin: '0 auto', padding: '20px 20px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.01em', margin: 0 }}>Deine Reels</h2>
            <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{total} getrackt · ⌀ {total ? Math.round(reels.reduce((a, r) => a + r.views, 0) / total).toLocaleString('de-DE') : 0} Views</div>
          </div>
          <Btn variant="primary" icon="+" onClick={() => setModalOpen(true)}>Reel hinzufügen</Btn>
        </div>

        {/* Pillar balance bars */}
        <GlassCard style={{ marginBottom: 20 }}>
          <Eyebrow style={{ marginBottom: 10 }}>Säulen-Balance</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(stats).map(([k, s]) => (
              <div key={k}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span><b>{s.emoji} {s.name}</b> · {s.count} ({s.pct}%)</span>
                  <span style={{ color: '#94a3b8' }}>Ziel: {s.target}% {s.pct > s.target ? '✅' : s.pct >= s.target - 5 ? '✅' : '⬆️'}</span>
                </div>
                <div style={{ height: 8, background: 'rgba(51,65,85,0.5)', borderRadius: 999, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 999, transition: 'width 0.5s ease-out' }} />
                  <div style={{ position: 'absolute', top: -2, left: `${s.target}%`, height: 12, width: 2, background: 'rgba(255,255,255,0.5)' }} title={`Ziel ${s.target}%`} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Reel list */}
        <Eyebrow style={{ marginBottom: 10 }}>Verlauf</Eyebrow>
        {reels.length === 0 ? (
          <GlassCard style={{ textAlign: 'center', padding: 36 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎬</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Noch keine Reels getrackt.</div>
            <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4, marginBottom: 16 }}>Trag dein erstes Reel ein, dann gibt's hier Insights! 🚀</div>
            <Btn variant="secondary" onClick={() => setModalOpen(true)}>Jetzt starten →</Btn>
          </GlassCard>
        ) : (
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reels.slice().reverse().map(r => <ReelRow key={r.id} reel={r} pillar={pillars[r.pillar]} />)}
          </div>
        )}
      </main>

      {modalOpen && <AddModal pillars={pillars} onClose={() => setModalOpen(false)} onSave={(r) => { onAdd(r); setModalOpen(false); }} />}
    </div>
  );
}

function ReelRow({ reel, pillar }) {
  return (
    <GlassCard style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${pillar.color}22`, border: `1px solid ${pillar.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
        {pillar.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reel.title}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
          {new Date(reel.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })} · {pillar.name}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#FFA94D' }}>{reel.views.toLocaleString('de-DE')}</div>
        <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Views</div>
      </div>
    </GlassCard>
  );
}

function AddModal({ pillars, onClose, onSave }) {
  const [title, setTitle] = React.useState('');
  const [pillar, setPillar] = React.useState(Object.keys(pillars)[0]);
  const [views, setViews] = React.useState('');
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = React.useState(today);

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ id: Date.now(), title: title.trim(), pillar, views: parseInt(views, 10) || 0, date });
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 100 }} onClick={onClose}>
      <form onSubmit={submit} onClick={e => e.stopPropagation()} className="float-in" style={{ background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,169,77,0.3)', borderRadius: 20, padding: 22, maxWidth: 440, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,169,77,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>🎬 Reel hinzufügen</h3>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', fontFamily: 'inherit' }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Reel-Titel / Hook"><input value={title} onChange={e => setTitle(e.target.value)} className="pinp" placeholder='z.B. „She left."' autoFocus /></Field>
          <Field label="Content-Säule">
            <select value={pillar} onChange={e => setPillar(e.target.value)} className="pinp">
              {Object.entries(pillars).map(([k, p]) => <option key={k} value={k}>{p.emoji} {p.name} ({p.target}%)</option>)}
            </select>
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Datum"><input type="date" value={date} onChange={e => setDate(e.target.value)} className="pinp" /></Field>
            <Field label="Views"><input type="number" value={views} onChange={e => setViews(e.target.value)} className="pinp" placeholder="0" /></Field>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Btn variant="quiet" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Abbrechen</Btn>
            <Btn variant="primary" type="submit" style={{ flex: 1, justifyContent: 'center' }} icon="✓">Speichern</Btn>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return <label style={{ display: 'block' }}><span style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>{label}</span>{children}</label>;
}

window.Tracker = Tracker;
