# social2scale — Brand Specification

> **Tagline:** Social, das skaliert.
> **Sub-Tagline:** Strategie statt Zufall.
> **Credit:** powered by PEAKING
> **Live:** https://peaking.world (DNS propagating) · Mirror: https://smashuniverse.info/insta
> **Repo (primary):** https://github.com/sebastianwimmer-sq/peaking-world
> **Repo (mirror):** https://github.com/sebastianwimmer-sq/smash-universe-hub
> **Source-Repo (lokal):** `~/smash-insta-manager/`

Premium Social-Growth-Tool für Accounts, die planen, messen und skalieren.

> *„Miss, was wirkt. Lass den Rest. Social, das skaliert."*

**Status:** v1.2 (06.05.2026) — s2s Emerald Brand · Multi-Account-Support · Emerald-Glow · powered by PEAKING

---

## 📋 Inhaltsverzeichnis

1. [Brand Foundation](#-brand-foundation)
2. [Colors](#-colors)
3. [Logo](#-logo)
4. [Typography](#-typography)
5. [Voice / Tone](#-voice--tone)
6. [Components](#-components)
7. [Animations](#-animations)
8. [Anti-Patterns](#-anti-patterns)
9. [When to Use This File](#-when-to-use-this-file)

---

## 🎯 Brand Foundation

| Element | Wert |
|---|---|
| **Name** | social2scale (s2s) |
| **Tagline (Haupt)** | „Social, das skaliert." |
| **Tagline (Sub)** | „Strategie statt Zufall." |
| **Credit** | „powered by PEAKING" |
| **Pitch in 1 Satz** | „Das Premium-Tool, mit dem social2scale Accounts plant, misst und skaliert." |
| **Vibe** | Premium · Klar · Datengetrieben · Skalierungs-fokussiert |
| **Vibe-Vergleich** | Notion × Buffer × Loom |
| **Audience** | Solo-Creators 16–30 (Sebi-like) · DACH primary, EN secondary |
| **Domain** | peaking.world (United-Domains) |
| **Insta-Handle** | @peakingworld |

---

## 🎨 Colors

### Emerald-Gradient (Primary Brand — s2s)

| Token | Hex | RGB | Usage |
|---|---|---|---|
| **Emerald** ⭐ | `#00B888` | `rgb(0, 184, 136)` | **Primary single-color accent** (buttons, links, glow, neon-Klasse), Gradient start |
| Emerald Soft | `#1FC998` | `rgb(31, 201, 152)` | Gradient mid/end, highlights |
| Emerald Soft-Bright | `#28C281` | `rgb(40, 194, 129)` | Highlights, gradient bright stop |
| Emerald-Text-Dark | `#04201A` | `rgb(4, 32, 26)` | Text/Icons auf Emerald-Flächen |

**Standard-Emerald-Gradient:**
```css
background: linear-gradient(135deg, #00B888, #1FC998, #28C281);
/* Alt: 2-stop für Buttons */
background: linear-gradient(135deg, #00B888, #1FC998);
```

**Emerald-Glow (Box-Shadow):**
```css
box-shadow: 0 8px 24px rgba(0, 184, 136, 0.35);
/* Strong */
box-shadow: 0 12px 36px rgba(0, 184, 136, 0.55);
```

### Background (Dark-only s2s-Stack)

| Token | Hex / Value | Usage |
|---|---|---|
| BG Deep | `#03080D` | Deepest background, Insta-PB-BG |
| BG Mid | `#0B0F14` | App background top |
| BG Surface | `#11161D` | App background bottom, glass-surface basis |
| Glass Border | `rgba(255, 255, 255, 0.1)` | Card hairlines |
| Surface Strong | `rgba(11, 15, 20, 0.8)` | Modal backgrounds, code blocks |

**Standard-BG-Gradient:**
```css
background: linear-gradient(135deg, #0B0F14 0%, #11161D 100%);
```

### Text

| Token | Hex | Usage |
|---|---|---|
| Text Primary | `#F2F3F1` | Headlines, body |
| Text Secondary | `#A4A6A1` | Subtle copy, labels |
| Text Muted | `#7C7E78` | Footnotes, timestamps |

### State (functional, not brand)

| Token | Hex | Usage |
|---|---|---|
| Success | `#10b981` / `#34d399` | Posted, success-states |
| Warning | `#f59e0b` / `#fbbf24` | Planned, in-progress |
| Danger | `#ef4444` / `#f87171` | Delete, errors |
| Trend-Up | `#34d399` | Positive metric trend |
| Trend-Down | `#f87171` | Negative metric trend |

### Pillar-Colors (separate System — NICHT als Brand-Color verwenden!)

Diese sind **content-categorization tokens**, KEINE Brand-Tokens. Werden in den 4-Säulen-Pills (Idea-Cards, Calendar-Stripes, Pillar-Charts) verwendet:

| Pillar | Hex | Emoji |
|---|---|---|
| Outdoor | `#10b981` | 🏔️ |
| Gym/Fitness | `#f59e0b` | 💪 |
| Mindset | `#8b5cf6` | 🧠 |
| Plant-Based | `#84cc16` | 🌿 |

> ⚠️ **Achtung:** Gym-Pillar (`#f59e0b`) ist ein funktionaler Pillar-Token, KEIN Brand-Token. Im Brand-Context immer Emerald (`#00B888`) nehmen. Im Pillar-Context Pillar-Orange.

---

## ⛰️ Logo

### Files (in `assets/`)

| File | Format | Usage |
|---|---|---|
| `logo.svg` | 64×64 SVG | Triangle-only. Favicon, App-Icon, Splash-Icon, Insta-PB. |
| `logo-wordmark.svg` | 280×320 SVG | Triangle + „social2scale"-Wordmark. Header-Bereich. |
| `logo-preview.html` | HTML | Multi-Size + App-Icon + Insta-PB Mockups. |

### Logo-Concept

**„Peak Triangle mit Emerald-Halo"** — stilisierter Berg-Gipfel als gefülltes Dreieck, Emerald-Gradient von `#00B888` → `#1FC998` auf hellem Facet, dunkler s2s-Stack auf der Schatten-Facet, hinterlegt mit Emerald-Halo. Datei-/Konzept-Name bleibt, Farben sind s2s-Emerald.

### SVG-Source (logo.svg)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <title>social2scale — Social, das skaliert.</title>
  <defs>
    <linearGradient id="emerald" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00B888"/>
      <stop offset="50%" stop-color="#1FC998"/>
      <stop offset="100%" stop-color="#28C281"/>
    </linearGradient>
  </defs>
  <path d="M 32 8 L 58 56 L 6 56 Z" fill="url(#emerald)"/>
</svg>
```

### Usage-Matrix

| Spot | File | Größe | CSS-Klassen |
|---|---|---|---|
| Splash-Icon (Login) | `logo.svg` | 96×96 | `peaking-pulse logo-glow-strong` |
| Dashboard-Header | `logo.svg` | 32–40 | `logo-glow` |
| Favicon | `logo.svg` | Browser handles | — |
| Apple-Touch-Icon | `logo.svg` | 180×180 | — |
| Header-Wordmark | inline `<span>social2scale</span>` | text-3xl bis text-4xl | `text-sunrise font-bold tracking-tight` |
| Insta-PB | `logo.svg` auf Dark-BG | 96×96 | 3px Emerald-Border |

---

## 🅰️ Typography

- **Display-Font:** `'Space Grotesk', 'Inter', -apple-system, sans-serif` (Headlines, Wordmark)
- **Body-Font:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Wordmark „social2scale":**
  - Display-Variante: `text-3xl bis text-5xl font-bold tracking-tight text-sunrise` (font-family Space Grotesk)
  - Lowercase Variante: gleicher Style mit `lowercase` für softeren Vibe (Stripe-Style)
- **Headlines:** `font-bold` (700) bis `font-black` (900)
- **Body:** Tailwind Default (400–600)
- **Captions/Labels:** `text-xs uppercase tracking-wider text-gray-500`

---

## 🗣️ Voice / Tone

### Core Principles
- **Premium** — hochwertig, klar, vertrauenswürdig
- **Datengetrieben** — Entscheidungen aus Metriken, nicht aus Bauchgefühl
- **Klar** — keine Floskeln, kein Hype, präzise
- **Skalierungs-fokussiert** — alles dient dem Wachstum des Accounts

### Sätze die zu social2scale gehören
- „Social, das skaliert."
- „Strategie statt Zufall."
- „Von der Strategie zur Skalierung."
- „Konsequenz wird belohnt."
- „Miss, was wirkt. Lass den Rest."
- „Von den ersten Followern zur echten Reichweite."
- „powered by PEAKING" (als Credit in Footer/Sub-Spots behalten)

### Sätze die NICHT zu social2scale gehören
- „Date your best self." → SMASH only
- „Mach hin." → SMASH only
- „Hulk-Mode an." → SMASH only
- Productivity-Bro-Talk: „Hustle 18h/Tag", „Optimize your daily routine"
- Self-Help-Esoterik: „Manifest your peak"

### Sprache
- **DE primary, EN secondary** (Audience ist DACH-first)
- Englische Tagline + Tool-Labels OK (sind kurz + Kultur-bekannt)
- Lange Erklärungen + Onboarding immer DE

---

## 🧱 Components (CSS-Klassen-Referenz)

### Buttons

| Klasse | Effekt |
|---|---|
| `.btn-primary` | Emerald-Gradient (Emerald→Soft→Soft-Bright) Background, dark text, font-bold |
| `.btn-shimmer` | Hover: White-Shine sweep across (links→rechts) |
| `.btn-glow-strong` | Stärkerer Emerald-Box-Shadow + Inset-Highlight |
| `.press-feedback` | Active: scale(0.96) — taktiles Feedback beim Tap |

### Cards & Surfaces

| Klasse | Effekt |
|---|---|
| `.glass` | Glassmorphism (backdrop-filter blur + halbtransparenter dark BG) |
| `.lift-glow` | Hover: lift up 4px + Emerald-Glow-Shadow + Border-Tint |
| `.gradient-flow` | Animierter Emerald-Background (8s loop) |
| `.bg-depth` | Subtle radiale Emerald-Glows in Ecken (für Body) |

### Pills & Chips

| Klasse | Effekt |
|---|---|
| `.chip` | Pill-shaped Filter-Button, transparent BG |
| `.chip.active` | Emerald-Gradient BG + Glow |
| `.pillar-pill` | Pillar-color BG (functional, nicht brand) |
| `.status-pill` | Success/Warning/Skipped-States für Calendar-Slots |

### Toast & Modals

| Klasse | Effekt |
|---|---|
| `.toast` | Emerald BG, dark text, bouncy entry-animation |
| `.modal-bg` | Backdrop blur + dark overlay |

### Account-Switcher (Dashboard)

| Klasse | Effekt |
|---|---|
| `.account-switch` | Pill mit Emerald-Border + Hover-Glow |
| `.account-menu` | Dropdown mit Emerald-Border + Glow-Shadow |

---

## 🎬 Animations (in `assets/effects.css`)

| Klasse | Trigger | Effekt |
|---|---|---|
| `.peaking-pulse` | always-on (Logo) | 3.5s scale + drop-shadow loop |
| `.float-in` | on-load | opacity 0→1 + translateY 16px→0 |
| `.scale-in` | on-load (modals, splash) | opacity 0→1 + scale 0.94→1 |
| `.fade-in` | on-load | opacity 0→1 |
| `.bounce-toast` | toast.show | bouncy entry mit overshoot |
| `.shimmer-sweep` | always-on (text) | gradient sweep across text |
| `.bg-shift` | always-on (gradient-flow) | gradient position 0%↔100% |
| `.glow-pulse` | always-on (heroes) | box-shadow pulse |
| `.stagger > *` | on-load (lists/grids) | staggered float-in mit 40ms delay-step |

---

## 🚫 Anti-Patterns (NIE machen)

- ❌ **Hulk-Green** (`#39FF14`, `#00ff6a`, `#2ecc71`) verwenden — gehört zu SMASH, klare Brand-Trennung halten
- ❌ Mehr als 3 Stops im Emerald-Gradient (Emerald/Soft/Soft-Bright ist die kanonische Palette)
- ❌ Light-Mode-Variante (PEAKING ist **Dark-Only**)
- ❌ Drop-Shadows ohne Emerald-Tint (sondern grau/schwarz) — wirkt billig
- ❌ Generic Stock-Mountain-Logos statt unser eigenes SVG
- ❌ SMASH-Brand-Voice mischen („Mach hin.", „Hulk-Mode") in PEAKING-Spots
- ❌ Mehr als eine Brand-Voice pro Page
- ❌ Pillar-Color-Token als Brand-Color verwenden (`#10b981` ist Outdoor-Pillar, NICHT „Brand-Grün")
- ❌ Cookie-Banner / DSGVO-Tracking-Pop-Ups (Tool ist passwort-geschützt + Plausible cookieless)

---

## 📋 When to Use This File

| Situation | What to do |
|---|---|
| Logo-/Farb-Fragen | **Zuerst hier nachschauen**, nicht improvisieren |
| Neue Component bauen | Tokens aus diesem File copy-pasten |
| Brand-Drift-Verdacht | Re-Audit gegen diesen File |
| Neuer Helper onboarden (Designer, anderer Claude, Friend-Sebi-User) | Diesen File als ersten Read empfehlen |
| Neue Page / neues Modul | Color-Tokens + Voice-Sätze + Component-Klassen aus hier |
| Update beschließen | Hier ZUERST ändern, dann Code-Files anpassen (SSoT-Workflow) |

---

## 🔗 Related Files

- `assets/logo.svg` — Logo-Source
- `assets/logo-wordmark.svg` — Wordmark-Variante
- `assets/effects.css` — Animations + Glow-Klassen
- `assets/logo-preview.html` — Visual-Preview-Page
- `js/app.js` — `SmashApp.PILLAR_INFO` (pillar-color-tokens)

---

## 📝 Versionierung

- **v1.0** (06.05.2026) — Initial: s2s Emerald Brand-Setup nach Pivot von Hulk-Green
- **v1.1** (06.05.2026) — Logo SVG (Triangle + Emerald-Gradient) added
- **v1.2** (06.05.2026) — Glow + Animations System (`effects.css`) added, Multi-Account dazu

---

*social2scale (powered by PEAKING) ist eine eigenständige Brand. Klare Trennung von SMASH (Hulk-Green-Brand). Beide leben im SMASH-Universe.*
