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
#
# No TinaCloud credentials needed. `tinacms build --local` starts a GraphQL
# server against the files in content/ and generates a client pointed at it,
# which is enough for `next build` to typecheck and prerender every page. The
# files it writes (tina/__generated__/, public/admin/index.html) are all
# gitignored, so this leaves the working tree clean.
#
# NODE_ENV must be set explicitly: without it Next falls back to the dev pages
# runtime while prerendering /404 and dies on "<Html> should not be imported
# outside of pages/_document" — a failure that says nothing about your change.
#
set -uo pipefail
cd "$(dirname "$0")/.."

step() { printf '\n== %s\n' "$1"; }

step 'Installing dependencies'
if ! pnpm install --frozen-lockfile >/tmp/preflight-install.log 2>&1; then
  echo 'FAILED: pnpm install'
  tail -30 /tmp/preflight-install.log
  echo
  echo 'VERDICT: DO NOT PUSH — dependencies could not be installed.'
  exit 1
fi
echo 'OK: dependencies'

step 'Lint'
if ! pnpm lint >/tmp/preflight-lint.log 2>&1; then
  echo 'FAILED: biome lint'
  tail -40 /tmp/preflight-lint.log
  echo
  echo 'VERDICT: DO NOT PUSH — lint errors.'
  exit 1
fi
echo 'OK: lint'

step 'Build (schema, types and every page — same as Vercel)'
if ! NODE_ENV=production npx tinacms build --local --skip-cloud-checks --noTelemetry \
     -c "next build" >/tmp/preflight-build.log 2>&1; then
  echo 'FAILED: build'
  echo
  grep -iE 'error|failed|invalid|cannot|unable' /tmp/preflight-build.log | head -20
  echo
  echo '--- last 30 lines ---'
  tail -30 /tmp/preflight-build.log
  echo
  echo 'VERDICT: DO NOT PUSH — this is the error Vercel would show.'
  echo 'Full log: /tmp/preflight-build.log'
  exit 1
fi
echo 'OK: build'

echo
echo 'VERDICT: SAFE TO PUSH — build passed.'
exit 0
