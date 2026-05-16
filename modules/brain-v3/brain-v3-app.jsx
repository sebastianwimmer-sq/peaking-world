// PEAKING Brain V3 — main App, mounted twice (desktop + mobile) via canvas frames.

const { useState, useEffect, useMemo, useRef } = React;

function BrainApp({ isMobile }) {
  const STORAGE_KEY = 'peaking.brain.v3.tab';

  const [tab, setTabRaw] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || 'all'; } catch { return 'all'; }
  });
  function setTab(v) { setTabRaw(v); try { localStorage.setItem(STORAGE_KEY, v); } catch {} }

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('latest');
  const [openItem, setOpenItem] = useState(null);

  // Local copies so quick-actions feel real
  const [memos, setMemos] = useState(SEED_MEMOS);
  const [inboxPending, setInboxPending] = useState(SEED_INBOX_PENDING);
  const [inboxTriaged, setInboxTriaged] = useState(SEED_INBOX_TRIAGED);

  function handleCapture({ title, body, brand }) {
    const id = 'i-' + (310 + inboxPending.length + Math.floor(Math.random() * 80));
    const item = {
      id, type: 'inbox', status: 'pending', title, body,
      source: 'Drafts', brand, modified: 'gerade eben', daysAgo: 0,
    };
    setInboxPending([item, ...inboxPending]);
  }
  function triageItem(item) {
    setInboxPending(inboxPending.filter(i => i.id !== item.id));
    setInboxTriaged([{ ...item, status: 'triaged', modified: 'gerade eben' }, ...inboxTriaged]);
  }
  function discardItem(item) {
    setInboxPending(inboxPending.filter(i => i.id !== item.id));
  }

  // Build unified item list
  const items = useMemo(() => {
    let list = [];
    if (tab === 'all') list = [...inboxPending, ...memos, ...inboxTriaged];
    else if (tab === 'memos') list = memos;
    else if (tab === 'inbox') list = inboxPending;
    else if (tab === 'triaged') list = inboxTriaged;

    // Filter (live, <100ms easy for 14 items)
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(it =>
        it.title.toLowerCase().includes(q) ||
        (it.body || '').toLowerCase().includes(q) ||
        BRAND_META[it.brand]?.label.toLowerCase().includes(q) ||
        (it.source || '').toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === 'latest') {
      list = [...list].sort((a, b) => a.daysAgo - b.daysAgo);
    } else if (sort === 'brand') {
      const order = ['peaking', 'smash', 'hulk', 'cross', 'unsicher'];
      list = [...list].sort((a, b) => order.indexOf(a.brand) - order.indexOf(b.brand));
    } else if (sort === 'status') {
      const order = ['pending', 'triaged', 'done', 'archived'];
      list = [...list].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
    }
    return list;
  }, [tab, query, sort, memos, inboxPending, inboxTriaged]);

  const counts = {
    all: inboxPending.length + memos.length + inboxTriaged.length,
    memos: memos.length,
    inbox: inboxPending.length,
    triaged: inboxTriaged.length,
  };

  const emptyMessages = {
    all:     'Brain leer — bau dir was.',
    memos:   'Noch keine Memos. Erste Decision festhalten?',
    inbox:   'Inbox leer — bau dir was.',
    triaged: 'Nichts triagiert. Ein Item bewegt sich, sobald du ✓ klickst.',
  };

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: '#0e1518',
      color: '#fff', fontFamily: 'Inter, sans-serif',
    }}>
      {/* Mountain silhouette + sunrise wash — premium-magazine hero */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320, background:
          'radial-gradient(ellipse at 12% 0%, rgba(255,107,53,0.16), transparent 50%),'
          + 'radial-gradient(ellipse at 88% 0%, rgba(255,212,59,0.08), transparent 55%)' }}/>
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" style={{ position: 'absolute', top: 60, left: 0, right: 0, width: '100%', height: 220, opacity: 0.45 }}>
          <defs>
            <linearGradient id={`peak-${isMobile ? 'm' : 'd'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a2228"/>
              <stop offset="100%" stopColor="#0e1518"/>
            </linearGradient>
          </defs>
          <path d="M0,220 L0,180 L180,140 L320,160 L480,90 L640,140 L820,80 L1000,130 L1180,100 L1320,140 L1440,120 L1440,220 Z" fill={`url(#peak-${isMobile ? 'm' : 'd'})`}/>
        </svg>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(14,21,24,0.85) 60%, #0e1518 100%)' }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1, height: '100%', overflowY: 'auto' }}>
        <BrainHeader tab={tab} setTab={setTab} isMobile={isMobile} counts={counts}/>
        <QuickCapture onSubmit={handleCapture} isMobile={isMobile}/>
        <Toolbar query={query} setQuery={setQuery} sort={sort} setSort={setSort} isMobile={isMobile} resultCount={items.length}/>

        {/* Hero strip — visible at top of All view */}
        {tab === 'all' && !query && (
          <section style={{ margin: isMobile ? '12px 16px 0' : '20px 32px 0' }}>
            <div style={{
              padding: isMobile ? 14 : 18,
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(255,107,53,0.10), rgba(255,212,59,0.05))',
              border: '1px solid rgba(255,169,77,0.22)',
              display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 16, flexWrap: 'wrap',
            }}>
              <div style={{
                width: isMobile ? 42 : 52, height: isMobile ? 42 : 52, borderRadius: 12, flexShrink: 0,
                display: 'grid', placeItems: 'center',
                background: 'rgba(14,21,24,0.7)',
                border: '1px solid rgba(255,169,77,0.3)',
                fontSize: isMobile ? 20 : 24,
              }}>📥</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <ItalicEyebrow accent>Inbox-status</ItalicEyebrow>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: isMobile ? 15 : 16, fontWeight: 700,
                  color: '#fff', marginTop: 2, letterSpacing: '-0.01em',
                }}>
                  {inboxPending.length} pending · {inboxTriaged.length} triaged · always peaking.
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11.5, color: '#94a3b8', marginTop: 3 }}>
                  Triage hits ✓ oder 🗑 inline. Memos öffnen den Drawer.
                </div>
              </div>
              {!isMobile && (
                <button onClick={() => setTab('inbox')} style={{
                  padding: '10px 16px', borderRadius: 10,
                  background: 'rgba(14,21,24,0.7)', border: '1px solid rgba(255,169,77,0.35)',
                  color: '#FFA94D', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>Triage now →</button>
              )}
            </div>
          </section>
        )}

        {/* Main list */}
        <section style={{ padding: isMobile ? '14px 16px 40px' : '16px 32px 60px' }}>
          {items.length === 0 ? (
            <div style={{
              padding: '64px 24px', textAlign: 'center', borderRadius: 14,
              background: 'rgba(30,41,59,0.4)', border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: 'Inter, sans-serif',
            }}>
              <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.5 }}>⛰️</div>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: 'italic', fontSize: 16, color: '#FFA94D', marginBottom: 4,
              }}>{emptyMessages[tab]}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Always peaking. — Sebi</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(it => (
                it.type === 'inbox' ? (
                  <InboxRow key={it.id} item={it} onTriage={triageItem} onDiscard={discardItem} onOpen={setOpenItem} isMobile={isMobile}/>
                ) : (
                  <MemoCard key={it.id} memo={it} onOpen={setOpenItem} isMobile={isMobile}/>
                )
              ))}
            </div>
          )}
        </section>

        {/* Footer sign-off */}
        <footer style={{
          padding: '20px 24px 28px', textAlign: 'center',
          fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#475569',
        }}>
          ⛰️ <span style={{ color: '#94a3b8' }}>Always peaking.</span> · v3 · {counts.all} items
        </footer>
      </div>

      <MemoDrawer
        memo={openItem && openItem.type === 'memo' ? openItem : (openItem && openItem.type === 'inbox' ? openItem : null)}
        onClose={() => setOpenItem(null)}
        onOpen={setOpenItem}
        isMobile={isMobile}
        allMemos={memos}
      />
    </div>
  );
}

// ============================================================
// PRODUCTION MOUNT — responsive, full-viewport, real device.
// ============================================================
function ProdApp() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
  );
  useEffect(() => {
    function onResize() { setIsMobile(window.innerWidth < 768); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return (
    <div style={{
      position: 'fixed', inset: 0, width: '100vw', height: '100dvh',
      background: '#0e1518', overflow: 'hidden',
    }}>
      <BrainApp isMobile={isMobile}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ProdApp/>);
