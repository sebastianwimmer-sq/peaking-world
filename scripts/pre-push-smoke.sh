#!/usr/bin/env bash
# PEAKING — Pre-Push Smoke-Test
# Fängt ~70% typischer Bugs vor dem Push ab.
# Run: ./scripts/pre-push-smoke.sh ODER als git pre-push-hook (siehe scripts/install-hook.sh)
#
# Sebi-Mantra: PEAKING != SMASH. Brand-Trennung wird hart geprüft (NIE Hulk-Green!).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
ORANGE='\033[0;38;5;208m'  # Sunrise-Vibe
BOLD='\033[1m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

print_section() { echo -e "\n${ORANGE}${BOLD}▶ $1${NC}"; }
print_ok()      { echo -e "  ${GREEN}✓${NC} $1"; }
print_err()     { echo -e "  ${RED}✗${NC} $1"; ERRORS=$((ERRORS+1)); }
print_warn()    { echo -e "  ${YELLOW}⚠${NC} $1"; WARNINGS=$((WARNINGS+1)); }

echo -e "${ORANGE}${BOLD}🌅 PEAKING Pre-Push Smoke-Test${NC}"
echo -e "${ORANGE}Always peaking. — Brand-Trennung hart, Bugs raus.${NC}\n"

# ============ 1. CRITICAL PATH FILE EXISTENCE ============
print_section "Critical-Path Files"
CRITICAL=(
  "index.html"
  "dashboard.html"
  "manifest.json"
  "sw.js"
  "CNAME"
  "js/app.js"
  "assets/logo.svg"
  "assets/effects.css"
  "assets/BRAND.md"
  "data/seed-ideas.json"
  "welcome.html"
  "privacy.html"
  "terms.html"
  "links.html"
  "manifest-page.html"
)
for f in "${CRITICAL[@]}"; do
  if [ -f "$f" ]; then
    print_ok "$f"
  else
    print_err "$f FEHLT"
  fi
done

# Module-Files (alle 14 erwartet)
print_section "Module-Files (14 erwartet)"
MOD_COUNT=$(find modules -maxdepth 1 -name "*.html" -type f 2>/dev/null | wc -l | tr -d ' ')
if [ "$MOD_COUNT" -ge 14 ]; then
  print_ok "modules/: $MOD_COUNT files"
else
  print_warn "modules/: nur $MOD_COUNT files (erwartet >=14)"
fi

# ============ 2. BRAND-TRENNUNG (CRITICAL!) ============
print_section "Brand-Trennung: KEIN Hulk-Green in PEAKING-Production-Code!"
# Production-Files: index/dashboard/welcome/privacy/terms/links/manifest-page + modules + js
# Excludes: BRAND.md (referenziert als Anti-Pattern), assets/logo-preview.html + logo-v2-* (Dev-Utilities, nicht user-facing)
HULK_HITS=$(grep -rl --include="*.html" --include="*.js" --include="*.css" --include="*.svg" -E "#39FF14|#00ff6a|#2ecc71" \
  index.html dashboard.html welcome.html privacy.html terms.html links.html manifest-page.html \
  js/ modules/ 2>/dev/null || true)
if [ -z "$HULK_HITS" ]; then
  print_ok "Keine Hulk-Green-Pattern in Production-Files"
else
  print_err "Hulk-Green gefunden in PRODUCTION-Files:"
  echo "$HULK_HITS" | sed 's/^/    /'
fi
# Info: dev-utilities check (warn-only)
DEV_HULK=$(grep -rl --include="*.html" --include="*.svg" -E "#39FF14|#00ff6a|#2ecc71" assets/ 2>/dev/null | grep -v "BRAND.md" || true)
if [ -n "$DEV_HULK" ]; then
  echo "    (Info: Dev-Utility-Files mit Hulk-Green — OK weil nicht user-facing: $DEV_HULK)"
fi

# Sunrise-Verifizierung
print_section "Sunrise-Brand-Tokens präsent?"
if grep -q "#FFA94D" js/app.js modules/*.html welcome.html 2>/dev/null; then
  print_ok "Sunrise-Orange #FFA94D aktiv"
else
  print_err "Sunrise-Orange fehlt — Brand-Drift!"
fi

# ============ 3. SHA-256-HASH-SYNC (LOGIN) ============
print_section "SHA-256-Hash-Sync (kritisch!)"
EXPECTED_HASH=$(echo -n "SMW1508!" | shasum -a 256 | awk '{print $1}')
ACTUAL_HASH=$(grep "PASSWORD_HASH" js/app.js | grep -oE '[a-f0-9]{64}' | head -1 || echo "MISSING")
if [ "$ACTUAL_HASH" = "$EXPECTED_HASH" ]; then
  print_ok "PASSWORD_HASH stimmt für SMW1508!"
else
  print_err "PASSWORD_HASH mismatch!"
  echo "    Expected: $EXPECTED_HASH"
  echo "    Actual:   $ACTUAL_HASH"
fi

# Pure-JS-SHA-256-Fallback vorhanden?
if grep -q "sha256Pure" js/app.js; then
  print_ok "Pure-JS-SHA-256-Fallback eingebaut (HTTP-tauglich)"
else
  print_err "sha256Pure fehlt — Login bricht auf HTTP!"
fi

# ============ 4. SW-CACHE-VERSIONING ============
print_section "Service-Worker Cache-Versioning"
SW_VERSION=$(grep "CACHE_NAME" sw.js | grep -oE "peaking-v[0-9]+" | head -1 || echo "MISSING")
if [ -n "$SW_VERSION" ] && [ "$SW_VERSION" != "MISSING" ]; then
  print_ok "SW-CACHE_NAME = $SW_VERSION"
else
  print_err "SW-CACHE_NAME fehlt oder Format falsch (erwartet: peaking-vN)"
fi

# Alle module-Files in SW-Cache-Liste?
SW_MODULES=$(grep -oE "'\./modules/[a-z-]+\.html'" sw.js | wc -l | tr -d ' ')
ACTUAL_MODULES=$(find modules -maxdepth 1 -name "*.html" -type f | wc -l | tr -d ' ')
if [ "$SW_MODULES" -ge "$ACTUAL_MODULES" ]; then
  print_ok "SW cached alle $ACTUAL_MODULES Module-Files"
else
  print_warn "SW cached $SW_MODULES von $ACTUAL_MODULES Modulen — bitte sw.js ASSETS aktualisieren"
fi

# ============ 5. ACCOUNT-AWARE STORAGE PATTERN ============
print_section "Multi-Account Storage Pattern"
# settings.html ist legitime Ausnahme (Backup/Restore writes raw cross-account-keys)
DIRECT_STORAGE=$(grep -rE "localStorage\.(get|set|remove)Item\([\"']smash:" modules/ js/app.js 2>/dev/null \
  | grep -v "_storageKey\|_migrateLegacyData\|migrationV2Done\|currentAccount\|GLOBAL_KEYS\|modules/settings.html" || true)
if [ -z "$DIRECT_STORAGE" ]; then
  print_ok "Module nutzen SmashApp.getData/setData (settings.html als legitime Backup-Ausnahme)"
else
  print_warn "Direkt-localStorage-Calls außerhalb erlaubter Whitelist:"
  echo "$DIRECT_STORAGE" | head -3 | sed 's/^/    /'
fi

# ============ 6. EMAIL-ADRESSE KONSISTENT ============
print_section "Email-Adressen (info@peaking.world auf Public-Pages)"
for f in privacy.html terms.html links.html; do
  if grep -q "info@peaking.world" "$f" 2>/dev/null; then
    print_ok "$f hat info@peaking.world"
  else
    print_err "$f hat KEIN info@peaking.world (alte smashuniverse.info noch drin?)"
  fi
done

# Anti-Pattern: alte smashuniverse.info Mail
SMASHUNI_MAIL=$(grep -rl "hello@smashuniverse" *.html 2>/dev/null || true)
if [ -n "$SMASHUNI_MAIL" ]; then
  print_warn "Alte smashuniverse-Mail noch in: $SMASHUNI_MAIL"
fi

# ============ 7. HTML-BALANCE (basic) ============
print_section "HTML-Balance (basic Tag-Counter)"
for f in index.html dashboard.html welcome.html privacy.html terms.html links.html manifest-page.html modules/*.html; do
  [ -f "$f" ] || continue
  OPEN=$(grep -oE "<div" "$f" | wc -l | tr -d ' ')
  CLOSE=$(grep -oE "</div>" "$f" | wc -l | tr -d ' ')
  if [ "$OPEN" -ne "$CLOSE" ]; then
    print_warn "$f: <div> $OPEN vs </div> $CLOSE"
  fi
done
# Wenn keine Warnings, OK
HTML_OK=true
for f in index.html dashboard.html welcome.html; do
  [ -f "$f" ] || continue
  if ! grep -q "</html>" "$f"; then
    print_err "$f: kein </html> closing-Tag"
    HTML_OK=false
  fi
done
$HTML_OK && print_ok "HTML-Closing-Tags OK"

# ============ 7b. SMASH-CROSS-BRAND CHECK (Sebi-Decision 07.05.2026 spät: PEAKING-only) ============
print_section "SMASH-Cross-Brand Check (PEAKING-only Pages)"
# Public-User-Facing-Pages dürfen KEINE smashtheapp/smashuniverse-Links + 'Founder, SMASH' Strings haben
# changelog.html ist Build-Log und darf SMASH historisch erwähnen (Schwester-Brand, Naming-Pivot, etc.)
SMASH_HITS=$(grep -lE "smashtheapp\.de|smashuniverse\.info|Founder, SMASH \+ PEAKING|SMASH \+ PEAKING" \
  welcome.html links.html privacy.html terms.html manifest-page.html index.html \
  modules/replies.html modules/growth.html 2>/dev/null || true)
if [ -z "$SMASH_HITS" ]; then
  print_ok "Keine SMASH-Cross-Brand-Strings in PEAKING-Public-Pages"
else
  print_warn "SMASH-Cross-Brand-Strings gefunden — Sebi will PEAKING-only:"
  echo "$SMASH_HITS" | sed 's/^/    /'
fi
# changelog.html ist whitelisted (historisch + Build-Log)

# ============ 8. CNAME-FILE NOT REMOVED ============
print_section "CNAME-Trap (GH-Pages CNAME-File)"
if [ -f "CNAME" ] && grep -q "peaking.world" CNAME; then
  print_ok "CNAME-File enthält peaking.world"
else
  print_err "CNAME fehlt oder hat falschen Inhalt — Custom-Domain stirbt!"
fi

# ============ 9. CONSOLE.LOG/DEBUGGER-RESTE ============
print_section "Debug-Reste (console.log, debugger statement)"
# console.error in catch-Blocks ist OK. Scan nur nach console.log + debugger statements.
DEBUG_HITS=$(grep -rE "console\.log|^[^/]*debugger" modules/ js/ 2>/dev/null | grep -v "//.*console.log" || true)
if [ -z "$DEBUG_HITS" ]; then
  print_ok "Keine debugger/console.log Reste"
else
  print_warn "Debug-Reste gefunden:"
  echo "$DEBUG_HITS" | head -3 | sed 's/^/    /'
fi

# ============ FINAL ============
echo ""
echo -e "${ORANGE}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo -e "${GREEN}${BOLD}✓ ALL GREEN — Push ist safe${NC}"
  echo -e "${ORANGE}🌅 Always peaking.${NC}"
  exit 0
elif [ "$ERRORS" -eq 0 ]; then
  echo -e "${YELLOW}${BOLD}⚠ $WARNINGS Warnings — Push erlaubt aber prüfen${NC}"
  exit 0
else
  echo -e "${RED}${BOLD}✗ $ERRORS Errors + $WARNINGS Warnings — PUSH BLOCKED${NC}"
  echo -e "${RED}Fix die Errors zuerst, dann nochmal.${NC}"
  exit 1
fi
