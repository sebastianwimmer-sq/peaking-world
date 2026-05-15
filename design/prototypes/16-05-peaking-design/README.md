# PEAKING — Design System

> **Always peaking.** · *The climb is the peak.*

PEAKING is a **personal Instagram-tracking tool for solo creators** built solo by Sebi (@vegetarianhulk / @peakingworld) with Claude Code. Live at **[peaking.world](https://peaking.world)** (mirror: smashuniverse.info/insta). 20 modules · multi-account · dark-only · sunrise-warm.

The brand pivoted on 06.05.2026 from "Smash IG Manager" / Hulk-Green → **PEAKING / Sunrise Hustle**. SMASH is the sibling brand (Hulk-Green habit tracker); PEAKING is the standalone Sunrise-gradient creator stack. **Never mix.**

---

## Index

| File | What's inside |
|---|---|
| `README.md` | This file — context, content + visual foundations, iconography, manifest. |
| `colors_and_type.css` | All design tokens: sunrise palette, surfaces, type scale, radii, shadows, motion. |
| `assets/BRAND.md` | Original single-source-of-truth from the codebase (mirrored). |
| `assets/effects.css` | Animation + glow keyframes (peaking-pulse, lift-glow, shimmer, gradient-flow). |
| `assets/logo.svg` · `logo-wordmark.svg` · `logo-insta-pb.svg` | Logo variants. |
| `assets/banner-insta-*.svg` | Instagram square + story banners. |
| `js/app.js` | Multi-account auth + storage + pillar definitions from the live app. |
| `preview/` | Design-system tab cards (palette, type, components, brand). |
| `ui_kits/peaking-app/` | Hi-fi recreation of the password-protected creator dashboard. |
| `SKILL.md` | Agent-Skills entry point. |

---

## Sources

- **Repo (primary):** `github.com/sebastianwimmer-sq/peaking-world` (branch `main`)
- **Repo (mirror):** `github.com/sebastianwimmer-sq/smash-universe-hub` (subpath `/insta/`)
- **Brand SSoT in repo:** `assets/BRAND.md`
- **Tech context in repo:** `CLAUDE.md`
- **Live:** https://peaking.world · https://smashuniverse.info/insta
- **Insta:** @peakingworld (BIP / AI + creator tools) · @vegetarianhulk (outdoor/plant-based)

---

## Products represented

The system serves **one product surface** today — the password-protected creator app at peaking.world — plus a small set of **public marketing pages** that live in the same repo and reuse the same chrome.

1. **PEAKING Creator App** (`/`, `/dashboard.html`, `/modules/*.html`) — Login → Dashboard (5 categories, 19 module tiles) → individual modules (Tracker, Hooks, Captions, Calendar, Analytics, Growth Center, Coach, etc.). Mobile-first, Tailwind via CDN, vanilla JS, localStorage.
2. **PEAKING Public Pages** (`welcome.html`, `links.html`, `manifest-page.html`, `changelog.html`, `privacy.html`, `terms.html`) — Linktree-style + about pages reusing dashboard chrome.

The UI kit in this design system covers the creator app since the marketing pages reuse identical components.

---

## Content Fundamentals

**Language.** German primary, English secondary. The audience is DACH solo-creators (16–30, "Sebi-like"). Short English taglines and tool labels are fine and frequent ("Always peaking.", "From climb to peak.", "Hook Library", "Building in Public"); long-form explanations + onboarding are always German. Code-switches mid-sentence are common and on-brand: *„Solo-Founder. Outdoor-Creator. Indie-Builder."*

**Voice.** Four words: **Hopeful · Energetic · Inspiring · Honest**. Optimism without bro-hustle. The metaphor is the climb — every reel is a step, every day's a peak you're moving toward. *„Always peaking."* explicitly **does not** mean "become" — it means "move toward your peak today."

**Tone & casing.** Mixed-case lowercase wordmark is common (Stripe-style soft "peaking"). UPPERCASE eyebrows for section labels (`THE STACK`, `BUILT BY`, `WHY PEAKING`). Title-case for headings; sentence-case for body. German nouns capitalized as normal (`Reel`, `Hook`, `Säule`).

**Pronouns.** Direct **"du"** address ("Tag dein erstes Reel ein", "Du climbst — der Peak rewards dich"). Never "Sie". Sebi sometimes uses "wir" when referring to the build ("Wir bauen für Solo-Creators die ehrlich growen wollen") but the product talks to a single creator.

**Sentences PEAKING owns:**
- „Always peaking."
- „The climb is the peak."
- „From climb to peak."
- „You're climbing — the peak rewards you."
- „Track was hooked. Skip the rest."
- „From 2k to 1M. Always peaking."

**Sentences PEAKING never says** (these belong to sibling brand SMASH):
- „Date your best self." · „Mach hin." · „Hulk-Mode an."
- Productivity-bro talk: „Hustle 18h/Tag", „Optimize your daily routine"
- Self-help esoterik: „Manifest your peak"

**Emoji.** **Used liberally and on purpose** as functional icons — every module tile, status pill, pillar pip, and section eyebrow leads with one. The canonical set: ⛰️ (brand/outdoor), 🌅 (sunrise/welcome), 🪝 (hooks), 📊 (analytics/BIP), 📈 (growth), 🎯 (next post), 🔥 (streak), ✅/⬆️/⬇️ (status), 🏔️ 💪 🧠 🌿 (vegetarianhulk pillars), 🛠️ 📊 🧠 🚀 (peakingworld pillars), 🚀 (peakingworld/launch), 🤖 (AI), 🧭 (coach), 💡 (ideas), 📅 (calendar), 🎥 (recorder), 🎨 (create), ⚡ (energy/setup), 🔒 (auth), 🤝 (engage), ⚙️ (admin). Emoji **carries** UI here — they aren't decoration, they're the iconography system.

**Examples in the wild:**
- Login button: `🔓 Login` · footer: `🔐 Geschützter Bereich` · `⛰️ The climb is the peak.`
- Empty state: *„Noch keine Reels getrackt. [Jetzt starten →]"*
- Insight card: *„🏆 **🏔️ Outdoor** performt am besten mit ⌀ 1.240 Views"*
- Toast: *„⚠️ Watch-Time bei nur 42% — Hooks stärker machen oder Reels kürzen!"*
- Manifesto: *„The climb **is** the peak."* (italicized "is", sunrise gradient on the verb)

---

## Visual Foundations

**Mode.** Dark-only. No light variant exists, ever. Light-mode is an explicit anti-pattern in `BRAND.md`.

**Background.** A flat 135° slate gradient (`#0f172a → #1e293b`) covers the whole viewport. On top sits an optional `.bg-depth` layer — three fixed radial sunrise glows in corners at very low alpha (`0.025–0.07`) that warm the page subtly. **Never** full-bleed photography, never repeating patterns, never noise/grain.

**Colors.** One brand color: **Sunrise Orange `#FFA94D`**. One brand gradient: Coral → Orange → Yellow at 135°. State colors (success/warning/danger) are functional only, never branded. Pillar colors are content-categorization tokens (Outdoor green, Gym amber, Mindset purple, Plant-Based lime for @vegetarianhulk; Sunrise variants for @peakingworld) and **must not** stand in for brand color — especially Gym-amber `#f59e0b` which is dangerously close to Sunrise-orange.

**Typography.** Native system stack (`-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI'`). No web font files exist in the repo; metrics target Inter as the substitute (so we list it second in the stack). Weights run 400 (body) → 700 (bold) → 900 (hero wordmark). Headlines use `tracking-tight` (-0.02em); eyebrows use `tracking-wider` (0.04em) UPPERCASE.

> ⚠️ **Font substitution flag:** the codebase relies on system fonts via the native stack. We added Inter to the stack to keep metrics consistent in this design system. **If you want a true webfont (e.g. Inter, Geist, Satoshi) shipped with the brand, send the .ttf/.woff2 files** and we'll drop them into `fonts/` and update `colors_and_type.css`.

**Cards.** Glassmorphism is the default: `.glass` = `rgba(30,41,59,0.6)` background + `backdrop-filter: blur(10px)` + 1px `rgba(255,255,255,0.10)` hairline border. Radii cluster around `1rem–1.75rem` (`rounded-2xl` / `rounded-3xl`). Brand-emphasized cards get a `rgba(255,169,77,0.2–0.4)` border instead of white.

**Shadows.** Two systems:
1. **Neutral elevation** for menus + modals — black with no tint (`0 12px 32px rgba(0,0,0,0.40)`).
2. **Sunrise glow** for branded surfaces — `0 8–18px 24–36px rgba(255,169,77,0.18–0.55)`. Critically, drop-shadows are **always sunrise-tinted, never grey/black**, on branded elements (logos, primary buttons, hover-lifted cards). Grey shadows on brand elements are an explicit anti-pattern ("wirkt billig").

**Hover.** Cards lift `-4px` translateY + gain sunrise-tinted box-shadow + border shifts to `rgba(255,169,77,0.3–0.5)`. Buttons add a left-to-right white shimmer sweep (`.btn-shimmer::after`) over 600ms. Links: subtle underline or `neon`-color shift.

**Press.** Buttons + interactive tiles get `transform: scale(0.96)` via `.press-feedback`. No color change, no opacity.

**Borders.** 1px hairlines, always semi-transparent (white at 8–15% for neutral, sunrise-orange at 20–40% for brand-emphasized). 4px left-border accent on the "next post" hero card uses sunrise — this is the **one** acceptable use of the left-border-accent pattern in PEAKING.

**Animation.** Influencer-glow, not 2003 MySpace.
- `peaking-pulse` 3.5s loop on the logo (scale 1↔1.04 + drop-shadow breathe).
- `float-in` 0.55s ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`) for content entry.
- `stagger > *` with 40ms delay-step for grids/lists.
- `gradient-flow` 8s bg-shift on hero cards (very subtle, alpha 0.18).
- `bounce-toast` 0.5s `cubic-bezier(0.34, 1.56, 0.64, 1)` overshoot.
- `glow-pulse` 2.4s loop on hero/CTA elements.
- `shake` 0.4s on auth errors.

**No-no's:** parallax, scroll-jacking, anything mimicking the loading bar, anything pulsing more than 1Hz. ("Max 1 Pulse-Loop, epileptische Anfälle vermeiden.")

**Transparency & blur.** `backdrop-filter: blur(10–12px)` is liberal — every glass card has it, every modal overlay has it. The bg-depth radial glows live at `z-index: 0` behind everything (`fixed; inset: 0; pointer-events: none`). Mobile fallback is graceful — the solid `--glass-surface` rgba still reads as a card.

**Imagery.** Almost none. The brand is **emoji + SVG-only**. No photography in the codebase. When imagery does land it should be warm-toned outdoor/sunrise (matching the climb metaphor), never cool/clinical, never grain/noise overlays.

**Layout.** Mobile-first, `max-w-5xl` (or `6xl` on dashboard) container, generous padding (`p-4 md:p-6` or `p-5`). Grid is Tailwind's `grid-cols-2 md:grid-cols-3` for module tiles, `grid-cols-2 md:grid-cols-4` for stat cards. **Modals scrollable to `90vh`** is a hard rule.

**Status pills.** Pill-shaped (`rounded-full`), `8–14px` horizontal padding, `11–13px` font, 700 weight, UPPERCASE letter-spaced eyebrow inside. Active state: sunrise gradient bg + sunrise glow shadow.

---

## Iconography

PEAKING does **not** ship a custom icon font, sprite, or PNG icon set. The iconography system is **emoji + custom SVGs** — and that's a deliberate brand decision, not a shortcut.

**Emoji as primary iconography.** Every module tile, dashboard stat, pillar pip, status indicator, button, and inline label leads with an emoji. They're not decoration — they're the iconography. Canonical set documented above in *Content Fundamentals → Emoji*. Use Apple/native emoji rendering; do not try to substitute with custom SVGs or Twemoji.

**Brand SVGs.** Three logo SVGs ship with the system, all using the same Sunrise-gradient triangle metaphor:
- `assets/logo.svg` — 64×64, triangle-only. Favicon, app icon, splash, header (32–96px scaled).
- `assets/logo-wordmark.svg` — 280×64, triangle + "peaking" wordmark. Use for header rows on landing/welcome pages.
- `assets/logo-insta-pb.svg` — Instagram profile picture treatment, 3px sunrise border on black background.

Plus banner SVGs for cross-promotion:
- `assets/banner-insta-square.svg` — square IG post.
- `assets/banner-insta-story.svg` — 9:16 IG story.

**Unicode glyphs.** Used for arrow markers (`→`, `←`, `▼`, `✓`, `⌀`) — these are textual, not graphical.

**No custom SVG icons.** If a tile or button needs an "icon", reach for an emoji first. Only fall back to inline SVG when the shape is genuinely brand-distinctive (the peak triangle, gradient bars). Do not hand-roll geometric SVG icons for things like "settings", "search", "chevron" — emoji handles those (`⚙️`, `🔍`, no chevron needed; native textarrows where required).

**No icon-font CDN.** No Lucide, Heroicons, Phosphor, Font Awesome. Adding one would dilute the emoji-first identity. If a future surface genuinely needs structured icons (e.g. a print export where emoji render inconsistently), flag and discuss before pulling one in.

---

## Caveats & substitutions

- **Fonts:** no webfont files in the repo. System stack with Inter added as graceful upgrade. **Send TTF/WOFF2 if you want a real custom face.**
- **Photography:** no brand imagery to reference. The UI kit uses emoji + gradient placeholders. If you have shot material from @vegetarianhulk you'd like in the system, drop them in `assets/photography/`.
- **Marketing pages (`welcome.html`, `links.html`)** reuse dashboard chrome, so the UI kit covers them implicitly. A dedicated marketing kit could be added if you want pixel-perfect public-page mocks.
- **Sibling brand SMASH** is referenced but explicitly out-of-scope. Hulk-Green is a hard anti-pattern.
