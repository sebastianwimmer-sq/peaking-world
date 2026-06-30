/**
 * PEAKING AI Profiles — Brand-DNA Storage + Auto-Prompt-Builder
 *
 * Solo-Phase: localStorage. Phase B: ersetzt durch Firestore-Sync.
 * Schema versioniert für später-Migration ohne Refactor-Hölle.
 *
 * Public API:
 *   AIProfiles.get(brandId) → profile object
 *   AIProfiles.save(brandId, profile)
 *   AIProfiles.list() → ['peaking','smash','vegetarianhulk','custom']
 *   AIProfiles.buildPrompt(brandId, idea, format) → string
 *   AIProfiles.exportAll() → JSON-string (Backup)
 *   AIProfiles.importAll(json)
 */

(function (global) {
  const SCHEMA_VERSION = 1;
  const STORAGE_KEY = 'peaking:ai_profiles:v1';

  // Default-Profile pro Brand (Sebi's Foundation)
  const DEFAULTS = {
    peaking: {
      schemaVersion: SCHEMA_VERSION,
      brandId: 'peaking',
      brandName: 'social2scale',
      tagline: 'System statt Zufall.',
      aiSubHeadline: 'SYSTEM STATT ZUFALL',
      voice: ['premium', 'done-for-you', 'klar', 'concrete-over-abstract'],
      audience: 'Coaches, Experten & B2B (DACH)',
      palette: ['#03080D', '#0B0F14', '#00B888', '#1FC998', '#28C281'],
      paletteHint: 'dark base + emerald gradient (#00B888 → #1FC998 → #28C281)',
      visualStyle: 'cinematic editorial magazine, photorealistic, premium dark-luxury aesthetic',
      typography: 'bold sans-serif, large headlines, magazine layout',
      pillars: ['Expertise', 'Transformation', 'Persönlichkeit', 'Behind-the-Scenes'],
      signaturePhrases: ['System statt Zufall.', 'Done-for-you.', 'Planbar skalieren.', 'Premium statt Zufall.'],
      bannedWords: ['revolutionary', 'game-changer', 'AI changes everything', 'mind-blowing'],
      languageHint: 'EN headlines preferred (Recraft can render DE but EN cleaner). German body OK.',
    },
    smash: {
      schemaVersion: SCHEMA_VERSION,
      brandId: 'smash',
      brandName: 'SMASH',
      tagline: 'Date your best self.',
      aiSubHeadline: 'DATE YOUR BEST SELF',
      voice: ['brutalist', 'minimal', 'edgy', 'imperative'],
      audience: 'DACH 16-30, fitness + habit-builders',
      palette: ['#000000', '#10b981', '#FFFFFF'],
      paletteHint: 'pure black base + single neon hulk-green accent stripe',
      visualStyle: 'brutalist minimal editorial photography, high contrast monochrome, architectural depth',
      typography: 'condensed sans-serif, all-caps headlines, brutalist',
      pillars: ['Disziplin', 'Routine', 'Anti-Coach-Bro', 'Real-Stats'],
      signaturePhrases: ['Mach hin.', 'Date your best self.', 'Streak > Talent.'],
      bannedWords: ['easy', 'hack', 'one weird trick', 'plant-based hype'],
      languageHint: 'DE imperative headlines preferred. Short, direct.',
    },
    vegetarianhulk: {
      schemaVersion: SCHEMA_VERSION,
      brandId: 'vegetarianhulk',
      brandName: 'vegetarianhulk',
      tagline: 'Disziplin ist kein Talent. Sie ist ein Ritual.',
      aiSubHeadline: 'DISZIPLIN ALS RITUAL',
      voice: ['raw', 'vulnerable', '1st-person', 'christlich-emotional', 'warm'],
      audience: 'DACH 25-40, disziplin-suchende mit Faith-Touch, vegetarisch-stark',
      palette: ['#F5EFE6', '#3D5A3A', '#1a1a1a'],
      paletteHint: 'warm vanilla beige + subtle forest green plant accents',
      visualStyle: 'editorial magazine, warm cinematic lighting, photorealistic, Playfair Display aesthetic',
      typography: 'Playfair Display serif for headlines, soft elegance',
      pillars: ['Disziplin als Ritual', 'Faith + Stoa', 'Vegetarisch + Stark', '10-Jahre-Story'],
      signaturePhrases: [
        'Disziplin ist kein Talent. Sie ist ein Ritual.',
        '10 Jahre vegetarisch. 8 Jahre Gym.',
        'Tribe > Coach.',
      ],
      bannedWords: ['sexy', 'clickbait', 'plastic', 'coach-bro', 'hack'],
      languageHint: 'DE headlines OK (Recraft kann). Warm, persönlich, niemals Imperativ.',
    },
    custom: {
      schemaVersion: SCHEMA_VERSION,
      brandId: 'custom',
      brandName: 'Custom',
      tagline: '',
      voice: [],
      audience: '',
      palette: [],
      paletteHint: '',
      visualStyle: '',
      typography: '',
      pillars: [],
      signaturePhrases: [],
      bannedWords: [],
      languageHint: 'free-form, no brand-overlay',
    },
  };

  function load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return { ...DEFAULTS };
      const parsed = JSON.parse(stored);
      // Schema-Migration-Check
      for (const brandId of Object.keys(DEFAULTS)) {
        if (!parsed[brandId] || parsed[brandId].schemaVersion !== SCHEMA_VERSION) {
          parsed[brandId] = { ...DEFAULTS[brandId], ...(parsed[brandId] || {}), schemaVersion: SCHEMA_VERSION };
        }
      }
      return parsed;
    } catch (e) {
      console.warn('[AIProfiles] load failed, using defaults:', e);
      return { ...DEFAULTS };
    }
  }

  function persist(profiles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }

  const cache = load();

  const AIProfiles = {
    get(brandId) {
      return cache[brandId] || cache.custom;
    },
    save(brandId, profile) {
      cache[brandId] = { ...profile, schemaVersion: SCHEMA_VERSION };
      persist(cache);
    },
    list() {
      return Object.keys(cache);
    },
    resetToDefault(brandId) {
      cache[brandId] = { ...DEFAULTS[brandId] };
      persist(cache);
    },
    exportAll() {
      return JSON.stringify(cache, null, 2);
    },
    importAll(json) {
      try {
        const parsed = JSON.parse(json);
        Object.assign(cache, parsed);
        persist(cache);
        return true;
      } catch (e) {
        return false;
      }
    },

    /**
     * Auto-Prompt-Builder: Sebi tippt Idee → fertiger Recraft-Prompt mit Brand-DNA
     *
     * @param {string} brandId - peaking | smash | vegetarianhulk | custom
     * @param {string} idea - Rohinput von User (z.B. "Day 6 beta launch")
     * @param {string} format - 1:1 | 4:5 | 9:16 | 16:9
     * @returns {string} Vollständiger Prompt für Recraft/Ideogram
     */
    buildPrompt(brandId, idea, format = '4:5') {
      const p = this.get(brandId);
      if (brandId === 'custom' || !p.visualStyle) {
        return idea;
      }

      // Auto-Detect: Soll Text im Bild sein?
      const hasHeadlineHint = /day \d|launch|beta|live|update|new|coming|featured|story|reset|tag \d/i.test(idea);
      const subText = p.aiSubHeadline || p.tagline || '';
      const headlinePart = hasHeadlineHint
        ? `Large bold headline reading: "${extractHeadline(idea, p)}", subline reading: "${subText}".`
        : '';

      const ideaPart = `Concept: ${idea}.`;
      const stylePart = `Visual style: ${p.visualStyle}.`;
      const paletteParte = p.paletteHint ? `Color palette: ${p.paletteHint}.` : '';
      const typoPart = p.typography ? `Typography: ${p.typography}.` : '';
      const avoidPart = p.bannedWords.length
        ? `Avoid clichés like: ${p.bannedWords.join(', ')}.`
        : '';
      const formatPart = `Format: ${format} aspect ratio. Editorial magazine cover quality, no AI-plastic look.`;

      return [ideaPart, headlinePart, stylePart, paletteParte, typoPart, avoidPart, formatPart]
        .filter(Boolean)
        .join(' ');
    },
  };

  // Helper: Extract sensible headline from raw idea
  function extractHeadline(idea, profile) {
    // Falls Idea explizit "headline: X" enthält
    const explicitMatch = idea.match(/headline[:\s]+([^.]+)/i);
    if (explicitMatch) return explicitMatch[1].trim().toUpperCase();

    // Day/Tag-Pattern: "day 6", "Tag 12 update"
    const dayMatch = idea.match(/(day|tag)\s*(\d+)/i);
    if (dayMatch) return `DAY ${dayMatch[2]}`.toUpperCase();

    // Default: erste 3-5 Worte uppercase
    const words = idea.split(/\s+/).slice(0, 4).join(' ');
    return words.toUpperCase();
  }

  global.AIProfiles = AIProfiles;
})(window);
