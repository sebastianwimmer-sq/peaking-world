// PEAKING · Reel Tracker Card
// Two variants: Compact (80px cover) · Detail (120px cover)
// Dark-only glass card, sunrise gradient accents.

const PILLAR_META = {
  outdoor:    { label: 'Outdoor',     color: '#10b981' },
  gym:        { label: 'Gym',         color: '#f59e0b' },
  mindset:    { label: 'Mindset',     color: '#8b5cf6' },
  plantbased: { label: 'Plant-Based', color: '#84cc16' },
  tools:      { label: 'Tools',       color: '#FFA94D' },
  bip:        { label: 'BIP',         color: '#FF6B6B' },
  marketing:  { label: 'Marketing',   color: '#FFD43B' },
  bts:        { label: 'BTS',         color: '#a78bfa' },
};

const fmt = (n) => n.toLocaleString('de-DE');

// Tiny sparkline — 7 data points → SVG polyline + area fill
function Sparkline({ data, w = 60, h = 20 }) {
  if (!data?.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = w / (data.length - 1);
  const pts = data.map((v, i) => `${(i * stepX).toFixed(1)},${(h - ((v - min) / range) * (h - 2) - 1).toFixed(1)}`);
  const line = pts.join(' ');
  const area = `0,${h} ${line} ${w},${h}`;
  const gid = `spark-${Math.random().toString(36).slice(2, 8)}`;
  const aid = `spark-a-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }} aria-label="7-day watch time">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF6B6B"/>
          <stop offset="50%" stopColor="#FFA94D"/>
          <stop offset="100%" stopColor="#FFD43B"/>
        </linearGradient>
        <linearGradient id={aid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFA94D" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#FFA94D" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${aid})`}/>
      <polyline points={line} fill="none" stroke={`url(#${gid})`} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      {/* end dot */}
      <circle cx={(data.length - 1) * stepX} cy={(h - ((data[data.length - 1] - min) / range) * (h - 2) - 1)} r="1.8" fill="#FFD43B"/>
    </svg>
  );
}

// Pillar badge — colored capsule
function PillarBadge({ pillar }) {
  const meta = PILLAR_META[pillar] || PILLAR_META.tools;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px 2px 6px', borderRadius: 999,
      fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase',
      color: meta.color,
      background: `${meta.color}1f`,
      border: `1px solid ${meta.color}55`,
      lineHeight: 1,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 999, background: meta.color, boxShadow: `0 0 6px ${meta.color}` }}/>
      {meta.label}
    </span>
  );
}

// Quick-Action glass pill
function ActionPill({ icon, label, onClick, danger }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '6px 10px', borderRadius: 999,
        fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
        color: danger ? (hover ? '#FF6B6B' : '#94a3b8') : (hover ? '#fff' : '#cbd5e1'),
        background: hover ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hover ? 'rgba(255,169,77,0.35)' : 'rgba(255,255,255,0.08)'}`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'pointer',
        transition: 'background 160ms ease, color 160ms ease, border-color 160ms ease',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 12, lineHeight: 1 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Cover thumbnail — image or pillar-colored placeholder
function Cover({ src, pillar, width }) {
  const meta = PILLAR_META[pillar] || PILLAR_META.tools;
  const [hover, setHover] = React.useState(false);
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const scale = hover && !reduce ? 1.02 : 1;
  const height = Math.round(width * (16 / 9));
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', flexShrink: 0,
        width, height,
        borderRadius: 10, overflow: 'hidden',
        background: src
          ? `linear-gradient(135deg, ${meta.color}33, ${meta.color}10)`
          : `linear-gradient(160deg, ${meta.color}55, ${meta.color}15 60%, rgba(15,23,42,0.6))`,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: hover ? `0 6px 18px ${meta.color}40` : '0 2px 8px rgba(0,0,0,0.4)',
        cursor: 'pointer',
        transition: 'box-shadow 200ms ease',
      }}
    >
      {src && (
        <img
          src={src}
          alt=""
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: `scale(${scale})`,
            transition: 'transform 220ms ease',
          }}
        />
      )}
      {!src && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${scale})`, transition: 'transform 220ms ease',
        }}>
          <svg width={width * 0.4} height={width * 0.4} viewBox="0 0 24 24" fill="none" opacity="0.7">
            <path d="M9 7v10l8-5-8-5z" fill={meta.color}/>
          </svg>
        </div>
      )}
      {/* top-left ratio tag */}
      <div style={{
        position: 'absolute', top: 6, left: 6,
        padding: '2px 6px', borderRadius: 4,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
        fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 700,
        color: '#fff', letterSpacing: '0.05em',
      }}>REEL</div>
      {/* bottom protection gradient */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%',
        background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.55))',
        pointerEvents: 'none',
      }}/>
    </div>
  );
}

// Single stat — label + number (gradient if hot)
function Stat({ label, value, hot, icon, suffix, variant }) {
  const isDetail = variant === 'detail';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
      <span style={{
        fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 600,
        color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase',
        lineHeight: 1,
      }}>{label}</span>
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: isDetail ? 16 : 13,
        fontWeight: 700,
        color: hot ? 'transparent' : '#fff',
        background: hot ? 'linear-gradient(135deg, #FF6B6B 0%, #FFA94D 50%, #FFD43B 100%)' : 'none',
        WebkitBackgroundClip: hot ? 'text' : 'unset',
        backgroundClip: hot ? 'text' : 'unset',
        WebkitTextFillColor: hot ? 'transparent' : '#fff',
        lineHeight: 1.1,
        display: 'inline-flex', alignItems: 'baseline', gap: 3,
      }}>
        {icon && <span style={{ fontSize: isDetail ? 13 : 11, WebkitTextFillColor: 'initial' }}>{icon}</span>}
        {value}
        {suffix && <span style={{ fontSize: isDetail ? 11 : 9, fontWeight: 600 }}>{suffix}</span>}
      </span>
    </div>
  );
}

// === Main card ===
function ReelTrackerCard({
  title = 'Why I quit the gym for outdoor calisthenics',
  pillar = 'outdoor',
  date = 'vor 3 Tagen',
  views = 1240,
  reach = 870,
  er = 5.4,
  saves = 12,
  spark = [120, 180, 260, 220, 340, 290, 410],
  cover = null,
  variant = 'compact', // 'compact' | 'detail'
}) {
  const isDetail = variant === 'detail';
  const coverW = isDetail ? 120 : 80;
  const erHot = er >= 5;

  const [hovered, setHovered] = React.useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        gap: isDetail ? 16 : 12,
        padding: isDetail ? 16 : 12,
        maxWidth: 420,
        borderRadius: 14,
        background: 'rgba(30, 41, 59, 0.60)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${hovered ? 'rgba(255,169,77,0.25)' : 'rgba(255,255,255,0.10)'}`,
        boxShadow: hovered
          ? '0 8px 24px rgba(255,169,77,0.18), 0 0 0 1px rgba(255,169,77,0.06) inset'
          : '0 4px 12px rgba(0,0,0,0.25)',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <Cover src={cover} pillar={pillar} width={coverW}/>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: isDetail ? 10 : 8 }}>
        {/* Header row: pillar + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
          <PillarBadge pillar={pillar}/>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', whiteSpace: 'nowrap' }}>{date}</span>
        </div>

        {/* Title */}
        <h3 style={{
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          fontSize: isDetail ? 15 : 14,
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{title}</h3>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr) auto',
          gap: isDetail ? 12 : 8,
          alignItems: 'end',
        }}>
          <Stat label="Views"  value={fmt(views)} variant={variant}/>
          <Stat label="Reach"  value={fmt(reach)} variant={variant}/>
          <Stat label="ER"     value={er.toFixed(1)} suffix="%" hot={erHot} variant={variant}/>
          <Stat label="Saves"  value={fmt(saves)} icon="💾" variant={variant}/>
          <div style={{ alignSelf: 'end', paddingBottom: 1 }}>
            <Sparkline data={spark} w={isDetail ? 70 : 56} h={isDetail ? 24 : 20}/>
          </div>
        </div>

        {/* Detail-only: divider above actions */}
        {isDetail && (
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)', margin: '2px 0' }}/>
        )}

        {/* Quick actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <ActionPill icon="📝" label="Edit"/>
          <ActionPill icon="📊" label="Insights"/>
          <ActionPill icon="♻️" label={isDetail ? 'Re-Use Idea' : 'Re-Use'}/>
          <ActionPill icon="🗑" label={isDetail ? 'Delete' : ''} danger/>
        </div>
      </div>
    </article>
  );
}

Object.assign(window, { ReelTrackerCard, PILLAR_META });
