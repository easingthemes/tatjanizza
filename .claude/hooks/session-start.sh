#!/bin/bash
#
# SessionStart hook.
#
# Two jobs:
#   1. Warn a session that lands directly on `main` that `main` is the published
#      site — a push there deploys to www.tatjanizza.com with no review. stdout
#      from this hook becomes context for the session, so the text below is
#      addressed to Claude, not to a human reading a terminal.
#   2. Warm the dependencies so ./scripts/preflight.sh does not pay for them.
#
# Deliberately never fails the session: every step is tolerant, because a hook
# that blocks startup is worse than a hook that skips a warm-up.
#
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || echo .)}" || exit 0

current=$(git branch --show-current 2>/dev/null || echo '')
[ -z "$current" ] && current='(detached HEAD)'

if [ "$current" = 'main' ]; then
  cat <<'MSG'
[branch check] This session is on 'main'.

'main' is the published site: www.tatjanizza.com is built from it, there is no
CI gate, and a push deploys straight to production. Do not commit here.

Cut a short branch from current 'main' first, push that, and review the change
on its Vercel preview:

    git switch -c short-description
    ./scripts/preflight.sh
    git push -u origin short-description
    # preview: https://tatjanizza-git-<branch>-kaidx.vercel.app

Merging to 'main' is a separate, deliberate decision — do not open a pull
request or merge unless you were asked to.

See CLAUDE.md, "`main` is the site".
MSG
else
  cat <<MSG
[branch check] On '$current'. 'main' is the published site and the base to
branch from; fetch and merge 'main' in if this branch has fallen behind. Run
./scripts/preflight.sh before every push. See CLAUDE.md.
MSG
fi

# Warm-up, remote sessions only. Never blocks and never fails the session.
if [ "${CLAUDE_CODE_REMOTE:-}" = 'true' ] && [ -f package.json ]; then
  if pnpm install --frozen-lockfile >/tmp/session-start-install.log 2>&1; then
    echo '[setup] Dependencies installed. ./scripts/preflight.sh is ready to run.'
  else
    echo '[setup] Dependency install failed; run pnpm install yourself before ./scripts/preflight.sh (log: /tmp/session-start-install.log).'
  fi
fi

exit 0
