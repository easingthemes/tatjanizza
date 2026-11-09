# AGENTS.md

Instructions for coding agents that read `AGENTS.md` (OpenAI Codex and others). Claude Code reads [CLAUDE.md](./CLAUDE.md) instead — the two say the same thing, and **CLAUDE.md is the fuller, canonical copy**. Read it before working on code. Keep this file in step with it.

## What this repo is

The website www.tatjanizza.com: TinaCMS + Next.js 15 (App Router), hosted on Vercel. Content lives as Markdown/MDX/JSON in `content/` — there is no database. Package manager is **pnpm**, Node 22.

## Content edits for Tatjanizza

If the person is asking for a content change — a page, a heading, a paragraph, an image, a track listing, a post — **read [.claude/skills/edit-site/SKILL.md](./.claude/skills/edit-site/SKILL.md) and follow it.** The site's owner edits it herself, usually from a phone, and is not a developer. That file has the rules: reply in the language she writes in (Serbian), no technical words, one short message with the preview link, and what is out of scope.

Two differences when you are not Claude Code:

- The commit trailer `Changed-by: $CLAUDE_CODE_USER_EMAIL` — that variable is not set here. Use `Changed-by: codex` instead.
- You may not have Vercel tools. Use the GitHub commit status on your commit to see whether the Vercel build passed. If you can not check it, say so and give the link anyway.

## `main` is the live site

`main` deploys straight to production with no CI gate. **Never commit or push to `main`.**

Workflow: short branch from current `main` → push → Vercel preview → pull request → `main` (merged by Dragan after review).

Every branch gets a public preview at `https://tatjanizza-git-<branch>-kaidx.vercel.app` (`/` and other non-alphanumerics in the branch name become `-`).

## Never push a broken build

Run before every push, on any branch:

```bash
./scripts/preflight.sh   # 0 = safe, 1 = the change is broken, 2 = the machine is dirty
```

- **0** — push.
- **1** — do not push. Fix it, or stop and say what is broken.
- **2** — the check could not run here (port, disk, network). Says nothing about the change. Do not push on a 2; nothing was verified.

It installs deps, lints and runs the full build with `tinacms build --local`. No TinaCloud credentials are needed. If it updates `tina/tina-lock.json`, commit that file with your change.

## Other people push at the same time

- `git fetch` and merge before you start and again before you push.
- **Never rebase or force-push a shared branch.** A merge commit is the right answer.
- After merging, re-run `./scripts/preflight.sh` — the merged tree is not the tree you checked.

## Code conventions (short)

- Routes are split into `page.tsx` (server, fetches with `@/tina/__generated__/client`) and `client-page.tsx` (`useTina`).
- Adding a block: `components/blocks/<name>.tsx` (component + schema), register in `tina/collection/page.ts`, add a `case` in `components/blocks/index.tsx`.
- Every editable element needs `data-tina-field={tinaField(parent, 'field')}`.
- Never edit `tina/__generated__/`.
- Biome: single quotes, 2 spaces, line width 160, semicolons. Tailwind v4 lives in `styles.css`, there is no `tailwind.config.js`.
- No test framework. Verify with `./scripts/preflight.sh`.

## Codex environment setup

In the Codex environment settings for this repo, use Node 22 and this setup script, so the check can run offline during the task:

```bash
corepack enable && pnpm install --frozen-lockfile
```
