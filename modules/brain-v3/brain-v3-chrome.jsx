// PEAKING Brain V3 — Header (wordmark + tabs), Quick Capture, Toolbar (search + sort).

function BrainHeader({ tab, setTab, isMobile, counts }) {
  const tabs = [
    { id: 'all',     label: 'All',     count: counts.all },
    { id: 'memos',   label: 'Memos',   count: counts.memos },
    { id: 'inbox',   label: 'Inbox',   count: counts.inbox },
    { id: 'triaged', label: 'Triaged', count: counts.triaged },
  ];
  return (
    <header style={{
      padding: isMobile ? '16px 16px 0' : '24px 32px 0',
      borderBottom: '1px solid rgba(255,169,77,0.10)',
      position: 'sticky', top: 0, zIndex: 10,
      background: 'linear-gradient(180deg, rgba(14,21,24,0.96), rgba(14,21,24,0.85))',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 14 : 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width={isMobile ? 26 : 32} height={isMobile ? 26 : 32} viewBox="0 0 64 64" style={{ filter: 'drop-shadow(0 0 14px rgba(255,107,53,0.55))' }}>
            <defs>
              <linearGradient id={`tri-${isMobile ? 'm' : 'd'}`} x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff6b35"/><stop offset="50%" stopColor="#ffa94d"/><stop offset="100%" stopColor="#ffd43b"/>
              </linearGradient>
            </defs>
            <path d="M32 6 L58 54 L6 54 Z" fill={`url(#tri-${isMobile ? 'm' : 'd'})`}/>
          </svg>
          <div>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: isMobile ? 20 : 24,
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1,
              background: 'linear-gradient(135deg, #ff6b35, #ffa94d, #ffd43b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>peaking</div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic',
              fontSize: 11, color: '#FFA94D', marginTop: 3, letterSpacing: '0.02em',
            }}>brain · v3 unified hub</div>
          </div>
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              padding: '6px 12px', borderRadius: 8,
              background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)',
              fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: '#34d399',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: 99, background: '#34d399', boxShadow: '0 0 8px #34d399' }}/>
              Worker · synced 14s
            </span>
            <span style={{
              padding: '6px 10px', borderRadius: 8,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 11, color: '#94a3b8', letterSpacing: '0.04em',
            }}>⌘N · neu</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 2, overflowX: 'auto', marginBottom: -1 }}>
        {tabs.map(t => {
          const active = t.id === tab;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: isMobile ? '10px 14px' : '12px 18px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              borderBottom: `2px solid ${active ? '#FFA94D' : 'transparent'}`,
              color: active ? '#fff' : '#64748b',
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700,
              letterSpacing: '-0.01em', whiteSpace: 'nowrap',
              display: 'inline-flex', alignItems: 'center', gap: 7,
              transition: 'color 160ms',
            }}>
              {t.label}
              <span style={{
                padding: '1px 7px', borderRadius: 99,
                background: active ? 'rgba(255,169,77,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#FFA94D' : '#64748b', fontSize: 10, fontWeight: 700,
                border: active ? '1px solid rgba(255,169,77,0.3)' : '1px solid rgba(255,255,255,0.05)',
              }}>{t.count}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

function QuickCapture({ onSubmit, isMobile }) {
  const { useState } = React;
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [brand, setBrand] = useState('peaking');
  function reset() { setTitle(''); setBody(''); setBrand('peaking'); setExpanded(false); }
  function submit(e) { e?.preventDefault(); if (!title.trim()) return; onSubmit({ title: title.trim(), body: body.trim(), brand }); reset(); }
  function handleKey(e) { if (e.key === 'Escape') reset(); if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(); }
  const canSubmit = !!title.trim();
  return (
    <form onSubmit={submit} onKeyDown={handleKey} style={{
      margin: isMobile ? '14px 16px 0' : '20px 32px 0',
      padding: 12, borderRadius: 12,
      background: 'linear-gradient(180deg, rgba(255,169,77,0.06), rgba(14,21,24,0.5))',
      border: `1px solid ${expanded ? 'rgba(255,169,77,0.35)' : 'rgba(255,255,255,0.08)'}`,
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      boxShadow: expanded ? '0 12px 28px rgba(255,107,53,0.15)' : 'none',
      transition: 'border-color 200ms, box-shadow 200ms',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          display: 'grid', placeItems: 'center',
          background: 'linear-gradient(135deg, #ff6b35, #ffa94d, #ffd43b)',
          fontSize: 14, color: '#0f172a', boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
        }}>＋</span>
        <input
          value={title} onChange={e => setTitle(e.target.value)} onFocus={() => setExpanded(true)}
          placeholder="Quick capture — Titel oder Gedanke…"
          style={{
            flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
            color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500,
          }}/>
        {!expanded && !isMobile && (
          <span style={{
            padding: '3px 8px', borderRadius: 6,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 10, color: '#64748b', letterSpacing: '0.04em',
          }}>⌘N</span>
        )}
        {expanded && (
          <button type="submit" disabled={!canSubmit} style={{
            padding: '7px 14px', borderRadius: 8,
            background: canSubmit ? 'linear-gradient(135deg, #ff6b35, #ffa94d, #ffd43b)' : 'rgba(255,255,255,0.05)',
            color: canSubmit ? '#0f172a' : '#64748b',
            fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 800,
            border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
            boxShadow: canSubmit ? '0 4px 12px rgba(255,107,53,0.3)' : 'none',
          }}>Capture ↵</button>
        )}
      </div>
      {expanded && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            placeholder="Body (optional) — markdown ok"
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(14,21,24,0.6)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8, padding: 10,
              color: '#cbd5e1', fontFamily: 'Inter, sans-serif',
              fontSize: 12.5, lineHeight: 1.55, resize: 'vertical', outline: 'none',
            }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.10em', textTransform: 'uppercase' }}>Brand</span>
              {['peaking', 'smash', 'hulk', 'cross', 'unsicher'].map(b => (
                <button key={b} type="button" onClick={() => setBrand(b)} style={{
                  padding: '3px 9px', borderRadius: 999,
                  background: brand === b ? BRAND_META[b].bg : 'transparent',
                  border: `1px solid ${brand === b ? BRAND_META[b].color : 'rgba(255,255,255,0.08)'}`,
                  color: brand === b ? BRAND_META[b].color : '#94a3b8',
                  fontFamily: 'Inter, sans-serif', fontSize: 10.5, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 120ms',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: 99, background: BRAND_META[b].color }}/>
                  {BRAND_META[b].label}
                </button>
              ))}
            </div>
            <span style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 10, color: '#64748b', letterSpacing: '0.04em',
            }}>⌘↵ save · Esc cancel</span>
          </div>
        </div>
      )}
    </form>
  );
}

function Toolbar({ query, setQuery, sort, setSort, isMobile, resultCount }) {
  return (
    <div style={{
      margin: isMobile ? '14px 16px 4px' : '20px 32px 8px',
      display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
    }}>
      <div style={{
        flex: '1 1 240px', minWidth: 0, position: 'relative',
        background: 'rgba(14,21,24,0.7)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, padding: '0 12px 0 36px',
        display: 'flex', alignItems: 'center',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>
          <circle cx="6" cy="6" r="4" stroke="#FFA94D" strokeWidth="1.5" fill="none"/>
          <path d="M9 9l4 4" stroke="#FFA94D" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search · titel, body, brand, source…"
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            color: '#fff', fontFamily: 'Inter, sans-serif',
            fontSize: 13, padding: '10px 0',
          }}/>
        {query && (
          <button onClick={() => setQuery('')} type="button" style={{
            background: 'transparent', border: 'none', color: '#64748b',
            cursor: 'pointer', fontSize: 16, padding: 4, lineHeight: 1, fontFamily: 'Inter',
          }}>×</button>
        )}
      </div>
      <div style={{ display: 'inline-flex', padding: 3, background: 'rgba(14,21,24,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, gap: 2 }}>
        {[{ k: 'latest', label: 'Latest' }, { k: 'brand', label: 'Brand' }, { k: 'status', label: 'Status' }].map(o => (
          <button key={o.k} onClick={() => setSort(o.k)} style={{
            padding: '7px 12px', borderRadius: 7,
            background: sort === o.k ? 'rgba(255,169,77,0.15)' : 'transparent',
            border: sort === o.k ? '1px solid rgba(255,169,77,0.3)' : '1px solid transparent',
            color: sort === o.k ? '#FFA94D' : '#94a3b8',
            fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700,
            cursor: 'pointer', transition: 'all 120ms',
          }}>{o.label}</button>
        ))}
      </div>
      {query && (
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#64748b' }}>{resultCount} treffer</span>
      )}
    </div>
  );
}

Object.assign(window, { BrainHeader, QuickCapture, Toolbar });
