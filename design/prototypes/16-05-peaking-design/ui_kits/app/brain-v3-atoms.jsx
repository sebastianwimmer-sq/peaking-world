// PEAKING Brain V3 — shared UI atoms.
const { useState, useEffect, useRef } = React;

function BrandPill({ brand, size = 'sm' }) {
  const meta = BRAND_META[brand]; if (!meta) return null;
  const dot = size === 'sm' ? 5 : 6;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'sm' ? '2px 7px' : '3px 9px', borderRadius: 999,
      fontFamily: 'Inter, sans-serif', fontSize: size === 'sm' ? 10 : 11, fontWeight: 700,
      letterSpacing: '0.04em',
      color: meta.color, background: meta.bg,
      border: `1px solid ${meta.color}38`, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: dot, height: dot, borderRadius: 99, background: meta.color, boxShadow: `0 0 6px ${meta.color}` }}/>
      {meta.label}
    </span>
  );
}

function StatusDot({ status, withLabel = true }) {
  const meta = STATUS_META[status]; if (!meta) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      color: meta.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: meta.color, boxShadow: `0 0 8px ${meta.color}` }}/>
      {withLabel && meta.label}
    </span>
  );
}

function ItalicEyebrow({ children, accent }) {
  return (
    <div style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontStyle: 'italic', fontWeight: 500,
      fontSize: 13, letterSpacing: '0.02em',
      color: accent ? '#FFA94D' : '#94a3b8',
    }}>{children}</div>
  );
}

// Ultra-light markdown → React (## headings, - lists, **bold**, `code`, „quotes")
function renderMarkdown(text) {
  const lines = text.split('\n');
  const blocks = []; let list = [];
  const flush = () => {
    if (!list.length) return;
    blocks.push(<ul key={blocks.length} style={{ margin: '4px 0 12px', paddingLeft: 20, fontFamily: 'Inter, sans-serif', fontSize: 13.5, lineHeight: 1.6, color: '#cbd5e1' }}>
      {list.map((li, i) => <li key={i} style={{ marginBottom: 4 }}>{renderInline(li)}</li>)}
    </ul>);
    list = [];
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    if (line.startsWith('## ')) {
      flush();
      blocks.push(<h3 key={blocks.length} style={{
        margin: '16px 0 6px', fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 14, fontWeight: 500, fontStyle: 'italic',
        color: '#FFA94D', letterSpacing: '0.02em',
      }}>{line.slice(3)}</h3>);
      continue;
    }
    if (line.startsWith('- ') || /^\d+\.\s/.test(line)) { list.push(line.replace(/^- |^\d+\.\s/, '')); continue; }
    flush();
    blocks.push(<p key={blocks.length} style={{
      margin: '0 0 10px', fontFamily: 'Inter, sans-serif',
      fontSize: 13.5, lineHeight: 1.65, color: '#cbd5e1',
    }}>{renderInline(line)}</p>);
  }
  flush();
  return blocks;
}
function renderInline(text) {
  const parts = []; let rest = text; let key = 0;
  while (rest.length) {
    const b = rest.match(/^(.*?)\*\*([^*]+)\*\*(.*)$/);
    const c = rest.match(/^(.*?)`([^`]+)`(.*)$/);
    const m = [b, c].filter(Boolean).sort((x, y) => x[1].length - y[1].length)[0];
    if (!m) { parts.push(rest); break; }
    if (m[1]) parts.push(m[1]);
    if (m === b) parts.push(<strong key={key++} style={{ color: '#fff', fontWeight: 700 }}>{m[2]}</strong>);
    else parts.push(<code key={key++} style={{
      fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 12,
      padding: '1px 5px', borderRadius: 4,
      background: 'rgba(255,169,77,0.10)', color: '#FFA94D',
      border: '1px solid rgba(255,169,77,0.2)',
    }}>{m[2]}</code>);
    rest = m[3];
  }
  return parts;
}

Object.assign(window, { BrandPill, StatusDot, ItalicEyebrow, renderMarkdown });
