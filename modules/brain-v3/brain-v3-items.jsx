// PEAKING Brain V3 — list items (memo card + inbox row) + detail drawer / bottom sheet.

function MemoCard({ memo, onOpen, isMobile }) {
  const { useState } = React;
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => onOpen(memo)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        padding: isMobile ? 14 : 16, borderRadius: 14,
        background: hover
          ? 'linear-gradient(180deg, rgba(255,169,77,0.06), rgba(30,41,59,0.65))'
          : 'rgba(30,41,59,0.55)',
        border: `1px solid ${hover ? 'rgba(255,169,77,0.30)' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        cursor: 'pointer',
        transition: 'border-color 160ms ease, background 160ms ease, transform 160ms ease',
        transform: hover ? 'translateY(-1px)' : 'none',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <BrandPill brand={memo.brand}/>
        <span style={{
          padding: '2px 7px', borderRadius: 999,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
          fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>{memo.kind}</span>
        <span style={{ flex: 1 }}/>
        <span style={{ fontSize: 11, color: '#64748b' }}>{memo.modified}</span>
      </div>
      <h3 style={{
        margin: '0 0 8px', fontFamily: 'Inter, sans-serif',
        fontSize: isMobile ? 15 : 16, fontWeight: 700, letterSpacing: '-0.01em',
        color: '#fff', lineHeight: 1.3,
      }}>{memo.title}</h3>
      <p style={{
        margin: 0, fontSize: 12.5, lineHeight: 1.55, color: '#94a3b8',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>{stripMd(memo.body).slice(0, 180)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#64748b' }}>
          <span>🔗 {memo.refs.length} {memo.refs.length === 1 ? 'link' : 'links'}</span>
          <span style={{ width: 3, height: 3, borderRadius: 99, background: '#475569' }}/>
          <code style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 10 }}>{memo.id}</code>
        </div>
        <span style={{ color: '#FFA94D', fontSize: 13, opacity: hover ? 1 : 0.4, transition: 'opacity 120ms' }}>→</span>
      </div>
    </button>
  );
}

function InboxRow({ item, onTriage, onDiscard, onOpen, isMobile }) {
  const { useState } = React;
  const [hover, setHover] = useState(false);
  const sourceIcon = SOURCE_ICON[item.source] || '📥';
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14,
        padding: isMobile ? 12 : 14, borderRadius: 12,
        background: hover ? 'rgba(255,169,77,0.06)' : 'rgba(14,21,24,0.6)',
        border: `1px solid ${hover ? 'rgba(255,169,77,0.25)' : 'rgba(255,169,77,0.10)'}`,
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        transition: 'border-color 160ms, background 160ms',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Source icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        display: 'grid', placeItems: 'center',
        background: 'rgba(255,169,77,0.10)', border: '1px solid rgba(255,169,77,0.25)',
        fontSize: 16,
      }}>{sourceIcon}</div>

      {/* Content */}
      <button onClick={() => onOpen(item)} style={{
        flex: 1, minWidth: 0, textAlign: 'left',
        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
          <StatusDot status={item.status}/>
          <BrandPill brand={item.brand}/>
          <span style={{ fontSize: 11, color: '#64748b' }}>· {item.source} · {item.modified}</span>
        </div>
        <div style={{
          fontSize: isMobile ? 13 : 13.5, fontWeight: 600, color: '#fff', lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>{item.title}</div>
      </button>

      {/* Quick triage */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button onClick={() => onTriage(item)} title="Triage to memo (✓)" style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.30)',
          color: '#34d399', cursor: 'pointer', fontSize: 14, fontFamily: 'Inter, sans-serif',
          display: 'grid', placeItems: 'center',
          transition: 'background 120ms, transform 120ms',
        }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.20)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
           onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.10)'; e.currentTarget.style.transform = 'none'; }}
        >✓</button>
        <button onClick={() => onDiscard(item)} title="Discard (🗑)" style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)',
          color: '#f87171', cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif',
          display: 'grid', placeItems: 'center',
          transition: 'background 120ms, transform 120ms',
        }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.16)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
           onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.transform = 'none'; }}
        >🗑</button>
      </div>
    </div>
  );
}

function stripMd(s) {
  return String(s || '').replace(/[#*`>-]/g, '').replace(/\s+/g, ' ').trim();
}

function MemoDrawer({ memo, onClose, onOpen, isMobile, allMemos }) {
  const { useEffect } = React;
  useEffect(() => {
    if (!memo) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [memo, onClose]);

  const open = !!memo;

  // Bottom sheet on mobile · right drawer on desktop
  const drawerStyle = isMobile ? {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: '92%', borderRadius: '20px 20px 0 0',
    transform: open ? 'translateY(0)' : 'translateY(100%)',
  } : {
    position: 'absolute', top: 0, right: 0, bottom: 0,
    width: 640, maxWidth: '100%',
    transform: open ? 'translateX(0)' : 'translateX(100%)',
    borderLeft: '1px solid rgba(255,169,77,0.25)',
  };

  // Related memos — exclude the current one, prefer cross-refs, then same brand
  const related = (() => {
    if (!memo) return [];
    const refs = (memo.refs || []).map(id => allMemos.find(m => m.id === id)).filter(Boolean);
    const sameBrand = allMemos.filter(m => m.id !== memo.id && m.brand === memo.brand && !refs.find(r => r.id === m.id));
    return [...refs, ...sameBrand].slice(0, 5);
  })();

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 40,
        background: 'rgba(2,6,17,0.55)', backdropFilter: 'blur(6px)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 200ms ease-out',
      }}/>
      <aside style={{
        zIndex: 50,
        background: 'linear-gradient(180deg, rgba(14,21,24,0.98), rgba(8,12,16,0.98))',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        boxShadow: '-24px 0 60px rgba(0,0,0,0.6)',
        transition: 'transform 200ms ease-out',
        display: 'flex', flexDirection: 'column',
        ...drawerStyle,
      }}>
        {memo && <DrawerInner memo={memo} onClose={onClose} onOpen={onOpen} isMobile={isMobile} related={related}/>}
      </aside>
    </>
  );
}

function DrawerInner({ memo, onClose, onOpen, isMobile, related }) {
  return (
    <>
      {isMobile && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
          <span style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.15)' }}/>
        </div>
      )}
      <header style={{
        padding: isMobile ? '12px 18px 16px' : '22px 26px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <BrandPill brand={memo.brand} size="md"/>
            <StatusDot status={memo.status}/>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8', cursor: 'pointer', fontSize: 16,
            fontFamily: 'Inter, sans-serif', display: 'grid', placeItems: 'center',
          }} title="Close (Esc)">×</button>
        </div>
        <h2 style={{
          margin: 0, fontFamily: 'Inter, sans-serif',
          fontSize: isMobile ? 20 : 24, fontWeight: 800,
          letterSpacing: '-0.02em', lineHeight: 1.2, color: '#fff',
        }}>{memo.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
          <code style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 10.5,
            color: '#94a3b8', padding: '1px 6px', borderRadius: 4,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          }}>{memo.id}</code>
          <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>{memo.modified}</span>
          {memo.kind && <span style={{
            fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.10em',
            padding: '1px 7px', borderRadius: 4,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            fontFamily: 'Inter, sans-serif',
          }}>{memo.kind}</span>}
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px 18px 80px' : '20px 26px 80px' }}>
        {/* Body */}
        <div>{renderMarkdown(memo.body)}</div>

        {/* Related Memos */}
        {related.length > 0 && (
          <section style={{ marginTop: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
            }}>
              <ItalicEyebrow accent>Related memos</ItalicEyebrow>
              <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>· top {related.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {related.map(r => (
                <button key={r.id} onClick={() => onOpen(r)} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%',
                  padding: '10px 12px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  color: '#fff', textAlign: 'left', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'border-color 120ms, background 120ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,169,77,0.3)'; e.currentTarget.style.background = 'rgba(255,169,77,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <span style={{
                    width: 5, height: 5, borderRadius: 99, marginTop: 7, flexShrink: 0,
                    background: BRAND_META[r.brand].color,
                  }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{r.title}</div>
                    <div style={{ fontSize: 10, color: '#64748b', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <code style={{ fontFamily: 'ui-monospace, monospace' }}>{r.id}</code>
                      <span style={{ width: 3, height: 3, borderRadius: 99, background: '#475569' }}/>
                      <span>{BRAND_META[r.brand].label}</span>
                      <span style={{ width: 3, height: 3, borderRadius: 99, background: '#475569' }}/>
                      <span>{r.modified}</span>
                    </div>
                  </div>
                  <span style={{ color: '#FFA94D', fontSize: 12 }}>→</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer style={{
        padding: '12px 18px',
        background: 'rgba(0,0,0,0.35)',
        borderTop: '1px solid rgba(255,169,77,0.18)',
        display: 'flex', gap: 8, flexWrap: 'wrap',
      }}>
        <button style={{
          padding: '10px 18px', borderRadius: 10,
          background: memo.status === 'done' ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #ff6b35, #ffa94d, #ffd43b)',
          color: memo.status === 'done' ? '#64748b' : '#0f172a',
          fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 800,
          border: 'none', cursor: memo.status === 'done' ? 'not-allowed' : 'pointer',
          boxShadow: memo.status === 'done' ? 'none' : '0 6px 20px rgba(255,107,53,0.35)',
        }} disabled={memo.status === 'done'}>✓ Mark Done</button>
        <button style={{
          padding: '10px 14px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: '#cbd5e1', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}>⌘ Open in Cursor</button>
        <button style={{
          padding: '10px 14px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: '#cbd5e1', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}>↗ Share</button>
        <span style={{ flex: 1 }}/>
        <button style={{
          padding: '10px 14px', borderRadius: 10,
          background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
          color: '#94a3b8', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}>🗑 Archive</button>
      </footer>
    </>
  );
}

Object.assign(window, { MemoCard, InboxRow, MemoDrawer });
