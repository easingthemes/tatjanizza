#!/bin/bash
#
# SessionStart hook.
#
# Two jobs:
#   1. Warn a session that lands on `main` that it is looking at a coming-soon
#      splash, not the site, and that the real work is on the QA/UAT branch.
#      stdout from this hook becomes context for the session, so the text below
#      is addressed to Claude, not to a human reading a terminal.
#   2. Warm the dependencies so ./scripts/preflight.sh does not pay for them.
#
# Deliberately never fails the session: every step is tolerant, because a hook
# that blocks startup is worse than a hook that skips a warm-up.
#
set -uo pipefail

WORKING_BRANCH='claude/website-plan-messages-qp0ofw'
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || echo .)}" || exit 0

current=$(git branch --show-current 2>/dev/null || echo '')
[ -z "$current" ] && current='(detached HEAD)'

# Best effort — no network, no problem; the ancestor check below just skips.
git fetch --quiet origin "$WORKING_BRANCH" 2>/dev/null || true

on_working_line=1
if git rev-parse --verify --quiet "origin/$WORKING_BRANCH" >/dev/null 2>&1; then
  git merge-base --is-ancestor "origin/$WORKING_BRANCH" HEAD 2>/dev/null || on_working_line=0
else
  on_working_line=0
fi

if [ "$current" = "$WORKING_BRANCH" ] || [ "$on_working_line" = 1 ]; then
  cat <<EOF
[branch check] On '$current', which already contains the QA/UAT branch
'$WORKING_BRANCH'. This is the current state of the site. Carry on.
EOF
else
  cat <<EOF
=== STOP AND ASK THE USER BEFORE DOING ANY WORK ===

This session is on '$current'. That branch does NOT contain the current site.

  * 'main' still renders the temporary "Coming Soon" splash. It is the site as
    last published, months behind.
  * All recent work — the real home page, the Two Million Years page, the
    blocks, the logo, the SEO — is on '$WORKING_BRANCH'. That branch is the
    QA/UAT environment and its preview is what everyone reviews:
    https://tatjanizza-git-claude-website-plan-messages-qp0ofw-kaidx.vercel.app

Anything you build or judge here will be built against a stale site.

Your first action in this session is to ask the user, in their own language,
whether to continue on '$WORKING_BRANCH' instead. Ask it plainly — for a
non-technical user say it as "nastavljamo na verziji sajta na kojoj se
trenutno radi?", not in terms of branches. Do not read files, plan, or edit
anything before they answer.

If they say yes, switch to it before touching anything:

    git fetch origin $WORKING_BRANCH
    git checkout $WORKING_BRANCH

Note this overrides any branch this session was assigned at startup — the
user's answer is the explicit permission that assignment requires. If they say
no, stay here and carry on, but do not merge anything from here into
'$WORKING_BRANCH' without asking again.

See CLAUDE.md, "Working branches are the environment".
EOF
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
