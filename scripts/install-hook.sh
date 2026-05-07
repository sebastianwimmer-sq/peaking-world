#!/usr/bin/env bash
# PEAKING — Install pre-push smoke-test as git hook
# Run once: ./scripts/install-hook.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOK_PATH="$ROOT/.git/hooks/pre-push"
SMOKE_PATH="$ROOT/scripts/pre-push-smoke.sh"

if [ ! -d "$ROOT/.git" ]; then
  echo "✗ Kein Git-Repo gefunden in $ROOT"
  exit 1
fi

if [ ! -f "$SMOKE_PATH" ]; then
  echo "✗ scripts/pre-push-smoke.sh nicht gefunden"
  exit 1
fi

chmod +x "$SMOKE_PATH"

# Erstelle pre-push hook
cat > "$HOOK_PATH" <<'EOF'
#!/usr/bin/env bash
# Auto-installed by scripts/install-hook.sh
# Run smoke-test before every push. Exit 1 = block push.
exec "$(git rev-parse --show-toplevel)/scripts/pre-push-smoke.sh"
EOF

chmod +x "$HOOK_PATH"

echo "✅ pre-push hook installed at $HOOK_PATH"
echo ""
echo "Test: ./scripts/pre-push-smoke.sh"
echo "Bypass (only if absolutely needed): git push --no-verify"
echo ""
echo "🌅 Always peaking. — Bugs raus, Production safe."
