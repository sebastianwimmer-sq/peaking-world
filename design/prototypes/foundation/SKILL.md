---
name: peaking-design
description: Use this skill to generate well-branded interfaces and assets for PEAKING (peaking.world) — Sebastian Wimmer's solo-built Instagram-tracking creator stack — either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, sunrise palette, type, fonts, assets, and UI kit components for prototyping. Brand sibling is SMASH; PEAKING is sunrise-warm, dark-only, emoji-first.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files. Start there — it contains the full content fundamentals, visual foundations, iconography rules, and a manifest pointing at every other file.

Essentials at a glance:
- **One brand color:** Sunrise Orange `#FFA94D`. **One brand gradient:** Coral → Orange → Yellow at 135° (`#FF6B6B → #FFA94D → #FFD43B`).
- **Dark-only.** Background is a flat 135° slate gradient (`#0f172a → #1e293b`). Light mode does not exist.
- **Glassmorphism cards.** `rgba(30,41,59,0.6)` + 10px backdrop-blur + 1px white-10% hairline. Radii cluster `1rem–1.75rem`.
- **Shadows.** Neutral elevation = pure black. Branded elements = **sunrise-tinted glow**, never grey/black drops.
- **Typography.** System stack (Inter as web fallback). Hero weights 800–900 with `tracking-tight`; eyebrows UPPERCASE 0.12em.
- **Voice.** German primary, short English taglines secondary. Direct "du". Hopeful · Energetic · Inspiring · Honest. The climb metaphor is canonical.
- **Iconography is emoji-first.** No icon font, no Lucide, no Heroicons. Canonical emoji set documented in README.
- **Two accounts in the product:** `@vegetarianhulk` (Outdoor + Plant-Based, green) and `@peakingworld` (BIP + Tools, sunrise). Pillar tokens are categorization only — never substitute for the brand color.
- **Never mix with SMASH** (Hulk-Green sibling brand). „Date your best self." / „Mach hin." / „Hulk-Mode" are off-brand for PEAKING.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out of `assets/` and create static HTML files for the user to view, linking `colors_and_type.css` + `assets/effects.css`. Reach for the `ui_kits/peaking-app/` components first instead of rebuilding glass cards / module tiles / account switchers from scratch.

If working on production code, copy assets and treat the rules in `README.md` as load-bearing. The live codebase is at `github.com/sebastianwimmer-sq/peaking-world` and uses Tailwind via CDN + vanilla JS + the `SmashApp` IIFE (mirrored at `js/app.js` here).

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions (audience, surface, German vs English, single account vs both, whether they want variations), and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
