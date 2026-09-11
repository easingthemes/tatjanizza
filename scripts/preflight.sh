#!/usr/bin/env bash
#
# Pre-push check: runs the same build Vercel runs, so a broken commit never
# reaches the repo. Called by the `edit-site` skill; safe to run by hand too.
#
#   ./scripts/preflight.sh
#
# Exit codes:
#   0  safe to push
#   1  the change is broken — do not push
#   2  the check could not run on this machine — says nothing about the change
#
# No TinaCloud credentials needed. `tinacms build --local` starts a GraphQL
# server over the files in content/ and generates a client pointed at it, which
# is enough for `next build` to typecheck and prerender every page. The files it
# writes (tina/__generated__/, public/admin/index.html) are all gitignored, so
# this leaves the working tree clean.
#
# Two things this script does that the bare command does not:
#
#   * Picks free ports. The default 4001 is also what `pnpm dev` uses, and when
#     it is already taken Tina does NOT fail with "address in use" — it prints
#     "server listening" anyway, the generated client then talks to whatever is
#     squatting there, and the build dies with `HeadersTimeoutError` and
#     "Failed to collect page data". Nothing in that names a port.
#
#   * Separates a broken change from a dirty machine. The failure above, a full
#     disk, a killed process — none of those would happen on Vercel, and calling
#     them "the error Vercel would show" is wrong exactly when someone is most
#     likely to believe it.
#
# NODE_ENV must be set explicitly: without it Next falls back to the dev pages
# runtime while prerendering /404 and dies on "<Html> should not be imported
# outside of pages/_document" — a failure that says nothing about your change.
#
set -uo pipefail
cd "$(dirname "$0")/.."

step() { printf '\n== %s\n' "$1"; }

# Ask the OS for a port nobody is using, rather than hoping 4001 is free.
free_port() {
  node -e 'const s=require("net").createServer();s.listen(0,"127.0.0.1",()=>{const p=s.address().port;s.close(()=>console.log(p))})' 2>/dev/null
}

# Failures that mean "this machine", not "this change". None of these can happen
# on a fresh Vercel builder.
ENV_PATTERNS='EADDRINUSE|already in use|busy on port|HeadersTimeoutError|fetch failed|ECONNREFUSED|ENOSPC|no space left|EACCES|ENOMEM|JavaScript heap out of memory|Killed'

machine_problem() {
  echo
  echo "CANNOT CHECK — something on this machine stopped the build."
  echo "This says nothing about your change; it would not happen on the server."
  echo
  echo "$1"
  echo
  echo "Full log: $2"
  exit 2
}

step 'Installing dependencies'
if ! pnpm install --frozen-lockfile >/tmp/preflight-install.log 2>&1; then
  if grep -qE "$ENV_PATTERNS|ERR_SOCKET|ETIMEDOUT|ENOTFOUND|registry" /tmp/preflight-install.log; then
    machine_problem 'Dependencies could not be fetched — network or disk.' /tmp/preflight-install.log
  fi
  echo 'FAILED: pnpm install'
  tail -30 /tmp/preflight-install.log
  echo
  echo 'VERDICT: DO NOT PUSH — the lockfile and package.json disagree.'
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

PORT=$(free_port)
DLPORT=$(free_port)
if [ -z "${PORT:-}" ] || [ -z "${DLPORT:-}" ]; then
  machine_problem 'Could not find a free port to run the content server on.' /dev/null
fi

step "Build (schema, types and every page — same as Vercel; port $PORT)"
if ! NODE_ENV=production npx tinacms build --local --skip-cloud-checks --noTelemetry \
     -p "$PORT" --datalayer-port "$DLPORT" \
     -c "next build" >/tmp/preflight-build.log 2>&1; then

  if grep -qE "$ENV_PATTERNS" /tmp/preflight-build.log; then
    machine_problem "$(grep -oE "$ENV_PATTERNS" /tmp/preflight-build.log | sort -u | head -5)" /tmp/preflight-build.log
  fi

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
