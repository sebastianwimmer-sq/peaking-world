# PEAKING Creator App — UI Kit

Hi-fi recreation of the password-protected creator dashboard at peaking.world. Mobile-first, dark-only, sunrise-warm. Click-through prototype demonstrating: login → dashboard (20 module tiles, 5 categories) → Reel-Tracker module → account switching.

## Files
- `index.html` — Mounts the kit. Loads React + Babel + colors_and_type.css + effects.css.
- `App.jsx` — Top-level state machine (auth → dashboard → module).
- `Login.jsx` — Password screen with sunrise logo, error shake.
- `Dashboard.jsx` — 5 categorized sections of module tiles + welcome hero + account switcher.
- `Tracker.jsx` — Reel Tracker module: list, add-modal, pillar balance bars.
- `components.jsx` — Shared: `Header`, `AccountSwitcher`, `GlassCard`, `Pill`, `Btn`, `Icon`.

## Demo flow
1. Login with **any** password — auth is faked (real password: `peaking2026`, but the kit accepts anything).
2. Lands on Dashboard with @vegetarianhulk active. Tap the account pill (top-right) to switch to @peakingworld — pillar tokens, posting plan, and welcome message change.
3. Tap any "🔥 Reel Tracker" tile → enters Tracker module. Add a reel, see it appear in the list and the pillar-balance bars update.
4. Back arrow returns to dashboard.

## Coverage / cuts
- 4 module tiles are interactive (Tracker, Hook Library, Coach, Settings); the other 16 show their styling but log "soon" on tap.
- Storage is in-memory only (resets on reload) — the real app uses account-keyed localStorage via `SmashApp.getData/setData`.
