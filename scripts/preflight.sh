#!/usr/bin/env bash
#
# Pre-push check: runs the same build Vercel runs, so a broken commit never
# reaches the repo. Called by the `edit-site` skill; safe to run by hand too.
#
#   ./scripts/preflight.sh
#
# Exit codes:
#   0  safe to push
#   1  something is broken — do not push
#   2  only a partial check was possible (TinaCloud env vars missing)
#
set -uo pipefail
cd "$(dirname "$0")/.."

step() { printf '\n== %s\n' "$1"; }
ok()   { printf 'OK: %s\n' "$1"; }
bad()  { printf 'FAILED: %s\n' "$1"; }

step 'Installing dependencies'
if ! pnpm install --frozen-lockfile >/tmp/preflight-install.log 2>&1; then
  bad 'pnpm install'
  tail -30 /tmp/preflight-install.log
  echo
  echo 'VERDICT: DO NOT PUSH — dependencies could not be installed.'
  exit 1
fi
ok 'dependencies'

step 'Lint'
if ! pnpm lint >/tmp/preflight-lint.log 2>&1; then
  bad 'biome lint'
  tail -40 /tmp/preflight-lint.log
  echo
  echo 'VERDICT: DO NOT PUSH — lint errors.'
  exit 1
fi
ok 'lint'

# The real gate. Needs the same three TinaCloud vars Vercel has. Without them
# tinacms still validates the schema and then stops on missing credentials —
# that partial run is worth doing, because a bad schema is the single most
# common way this build breaks.
have_creds=1
for v in NEXT_PUBLIC_TINA_CLIENT_ID TINA_TOKEN NEXT_PUBLIC_TINA_BRANCH; do
  [ -n "${!v:-}" ] || have_creds=0
done
[ -f .env ] && have_creds=1

if [ "$have_creds" = 1 ]; then
  step 'Full build (same as Vercel)'
  if ! pnpm build >/tmp/preflight-build.log 2>&1; then
    bad 'pnpm build'
    tail -40 /tmp/preflight-build.log
    echo
    echo 'VERDICT: DO NOT PUSH — this is the error Vercel would show.'
    exit 1
  fi
  ok 'build'
  echo
  echo 'VERDICT: SAFE TO PUSH — full build passed.'
  exit 0
fi

step 'Schema check only (TinaCloud env vars not set)'
npx tinacms build --content=local --skip-cloud-checks --noTelemetry >/tmp/preflight-tina.log 2>&1
if grep -qE 'ERR_MISSING_CLOUD_CREDS|requires branch, clientId, token|Client not configured properly' /tmp/preflight-tina.log; then
  ok 'content schema is valid'
  echo
  echo 'VERDICT: PARTIAL — schema is fine, but the full build could not run here.'
  echo 'Set NEXT_PUBLIC_TINA_CLIENT_ID, TINA_TOKEN and NEXT_PUBLIC_TINA_BRANCH'
  echo 'in this environment to get the complete check.'
  exit 2
fi

bad 'tina schema'
tail -40 /tmp/preflight-tina.log
echo
echo 'VERDICT: DO NOT PUSH — the content schema is invalid.'
exit 1
