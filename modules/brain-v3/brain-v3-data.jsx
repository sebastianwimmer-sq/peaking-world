// PEAKING Brain V3 — data + meta. Mocked endpoints inline.

const BRAND_META = {
  peaking:  { label: 'PEAKING',          color: '#FFA94D', bg: 'rgba(255,169,77,0.10)' },
  smash:    { label: 'SMASH',            color: '#39FF14', bg: 'rgba(57,255,20,0.08)'  },
  hulk:     { label: '@vegetarianhulk',  color: '#22a06b', bg: 'rgba(34,160,107,0.10)' },
  cross:    { label: 'Cross-Brand',      color: '#cbd5e1', bg: 'rgba(255,255,255,0.04)' },
  unsicher: { label: 'Unsicher',         color: '#94a3b8', bg: 'rgba(148,163,184,0.08)' },
};

const STATUS_META = {
  pending:  { label: 'Pending',  color: '#FFA94D' },
  triaged:  { label: 'Triaged',  color: '#a78bfa' },
  archived: { label: 'Archived', color: '#64748b' },
  done:     { label: 'Done',     color: '#34d399' },
};

const SOURCE_ICON = { Voice: '🎙', Slack: '💬', Drafts: '📝', Screen: '🖼', Web: '🌐' };

const SEED_MEMOS = [
  { id: 'm-201', type: 'memo', kind: 'decision',
    title: 'Brain V3 = Unified Hub. V2 wird abgelöst.',
    brand: 'peaking', status: 'done',
    modified: 'vor 14 Min', daysAgo: 0,
    body: `## Decision\nV3 zieht Memos + Inbox in **eine** Liste. Kein zweites Tool, kein Sortier-Overhead.\n\n## Why\nIch will beim Tab-Switch nicht das Hirn wechseln. Eine Liste. Ein Search. Cross-Brand-Tags machen den Rest.\n\n## Carry-over aus V2\n- Detail-Drawer slidet rechts rein\n- Mind-Map kommt zurück sobald die Cross-Links sauber gepflegt sind`,
    refs: ['m-202', 'm-208', 'm-205'] },
  { id: 'm-202', type: 'memo', kind: 'decision',
    title: 'Quick-Capture muss in 2s offen sein — Hotkey ⌘N',
    brand: 'peaking', status: 'done',
    modified: 'vor 2 Std', daysAgo: 0,
    body: `## Rule\nWenn der Memo-Capture länger als 2 Sekunden zum Öffnen braucht, schreibe ich ihn nicht. Punkt.\n\n## Setup\n- ⌘N öffnet das Form ohne Drawer-Animation\n- Body ist *optional*; nur Title + Brand sind Pflicht\n- Enter speichert, Esc verwirft`,
    refs: ['m-201'] },
  { id: 'm-203', type: 'memo', kind: 'note',
    title: 'Outdoor-Light only für @vegetarianhulk',
    brand: 'hulk', status: 'done',
    modified: 'gestern', daysAgo: 1,
    body: `## Standing\nKein Ring-Light. Kein Studio. Sunrise + Trail-Light. Punkt.\n\nWenn ich's indoor drehe, sieht der Reel aus wie alle anderen Outdoor-Creator. Genau das nicht.`,
    refs: ['m-207'] },
  { id: 'm-204', type: 'memo', kind: 'experiment',
    title: 'Cross-Posting SMASH-Reel → PEAKING-Account: nein.',
    brand: 'cross', status: 'done',
    modified: 'vor 2d', daysAgo: 2,
    body: `## Result\n3 Reels gecrossposted. ER auf PEAKING-Account ist gefallen, weil die Audience anders ist.\n\n## Lehre\nBrands haben verschiedene Audiences. Auch wenn ich der gleiche Mensch bin. Cross-posten = killing the funnel.`,
    refs: ['m-205'] },
  { id: 'm-205', type: 'memo', kind: 'decision',
    title: 'SMASH bekommt eigenes IG. Keine Cross-Promos mehr.',
    brand: 'smash', status: 'done',
    modified: 'vor 3d', daysAgo: 3,
    body: `## Decision\n@smashtheapp läuft als eigener Account. Habit-Tracker-Audience ist eine andere Spezies als Builder-Creators.\n\nCross-promos nur über Story-Links, nie über Reels.`,
    refs: ['m-204', 'm-208'] },
  { id: 'm-206', type: 'memo', kind: 'note',
    title: 'Whisper local + Claude Haiku reicht für 90% der Cuts',
    brand: 'peaking', status: 'done',
    modified: 'vor 4d', daysAgo: 4,
    body: `## Stack\nLocal Whisper transcribiert in ~28s pro 2-min Reel. Claude Haiku findet 3 Hook-Cuts pro Take.\n\nKostet praktisch nichts. Privacy-Promise hält.`,
    refs: [] },
  { id: 'm-207', type: 'memo', kind: 'decision',
    title: 'Posting-Cadence: Mo/Mi/Fr — niemals daily.',
    brand: 'hulk', status: 'done',
    modified: 'vor 5d', daysAgo: 5,
    body: `## Cadence\nDaily posting bricht die Produktions-Loop. 3-Tage-Gap heißt: Metric reagiert, ich seh's, nächster Reel ist besser.\n\n„Always peaking" ≠ „always posting".`,
    refs: ['m-203'] },
  { id: 'm-208', type: 'memo', kind: 'decision',
    title: 'Inbox vs. Memo — Inbox ist raw, Memo ist decided.',
    brand: 'cross', status: 'done',
    modified: 'vor 6d', daysAgo: 6,
    body: `## Rule\nInbox = ungetriagter Gedanke. Memo = Decision mit Title, Body, Status.\n\nKein Item bleibt > 14 Tage im Inbox. Entweder triagen oder discarden mit One-Liner-Reason.`,
    refs: ['m-201', 'm-202'] },
];

const SEED_INBOX_PENDING = [
  { id: 'i-301', type: 'inbox', status: 'pending', title: 'Voice 05:02 — „was wenn Hook-Score per-Account misst?"', source: 'Voice',  brand: 'peaking', modified: 'vor 2 Std',  daysAgo: 0 },
  { id: 'i-302', type: 'inbox', status: 'pending', title: 'Slack-self — „kill die Reichweite-Metric, ER ist genug"', source: 'Slack',  brand: 'peaking', modified: 'vor 6 Std',  daysAgo: 0 },
  { id: 'i-303', type: 'inbox', status: 'pending', title: 'Drafts.app — Caption-Sprache Switch per Account?',        source: 'Drafts', brand: 'cross',   modified: 'vor 9 Std',  daysAgo: 0 },
  { id: 'i-304', type: 'inbox', status: 'pending', title: 'Voice 18:30 — „Hulk-Account braucht eigene Captions"',     source: 'Voice',  brand: 'hulk',    modified: 'vor 14 Std', daysAgo: 0 },
  { id: 'i-305', type: 'inbox', status: 'pending', title: 'Screen — Cursor agent loop debug screenshot',             source: 'Screen', brand: 'peaking', modified: 'vor 1d',     daysAgo: 1 },
  { id: 'i-306', type: 'inbox', status: 'pending', title: 'Voice 04:55 — „rec light = morning only, IMMER"',         source: 'Voice',  brand: 'hulk',    modified: 'vor 1d',     daysAgo: 1 },
];

const SEED_INBOX_TRIAGED = [
  { id: 'i-291', type: 'inbox', status: 'triaged', title: 'Web-Clip — Linear blog post on Sentinel',                source: 'Web',   brand: 'unsicher', modified: 'vor 2d', daysAgo: 2 },
  { id: 'i-292', type: 'inbox', status: 'triaged', title: 'Voice 06:14 — „Streak-Anzeige im Dashboard größer"',     source: 'Voice', brand: 'smash',    modified: 'vor 3d', daysAgo: 3 },
];

Object.assign(window, { BRAND_META, STATUS_META, SOURCE_ICON, SEED_MEMOS, SEED_INBOX_PENDING, SEED_INBOX_TRIAGED });
