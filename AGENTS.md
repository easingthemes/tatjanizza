# AGENTS.md

Instructions for coding agents that read `AGENTS.md` (OpenAI Codex and others). Claude Code reads [CLAUDE.md](./CLAUDE.md) instead — the two say the same thing, and **CLAUDE.md is the fuller, canonical copy**. Read it before working on code. Keep this file in step with it.

## What this repo is

The website www.tatjanizza.com: TinaCMS + Next.js 15 (App Router), hosted on Vercel. Content lives as Markdown/MDX/JSON in `content/` — there is no database. Package manager is **pnpm**, Node 22.

## Content edits for Tatjanizza

If the person is asking for a content change — a page, a heading, a paragraph, an image, a track listing, a post — **read [.claude/skills/edit-site/SKILL.md](./.claude/skills/edit-site/SKILL.md) and follow it.** The site's owner edits it herself, usually from a phone, and is not a developer. That file has the rules: reply in the language she writes in (Serbian), no technical words, one short message with the preview link, and what is out of scope.

Differences when you are not Claude Code:

- The commit trailer `Changed-by: $CLAUDE_CODE_USER_EMAIL` — that variable is not set here. Use `Changed-by: codex` instead.
- You may not have Vercel tools. Use the GitHub commit status on your commit to see whether the Vercel build passed. If you can not check it, say so and give the link anyway.
- **In Codex, she may publish her own change** when she is happy with it. This replaces the "publishing is Dragan's call" rule in the skill file. See the next section.

## Working with Tatjanizza in Codex

She is not a developer. She should never need to know what a branch, a merge or a pull request is. Give her two ideas only:

1. **Probna verzija** — every change first goes to a temporary test copy of the site, with its own link. Only she sees it there (and anyone she sends the link to). The real site is not touched. The test copy is thrown away later; that is normal.
2. **Objavi** — when she likes the test copy, she says so, and the change goes onto the real site www.tatjanizza.com.

### Words to use with her

| don't say | say |
|---|---|
| branch, preview, deployment | *probna verzija*, *link za probnu verziju* |
| merge, publish to production, merge to main | *objaviti*, *staviti na pravi sajt* |
| pull request, PR | *zahtev za objavu* (only if she has to tap something — see below) |
| build is running / deploy queued | *sprema se, potraje minut-dva* |
| build passed | *evo kako izgleda: <link>* |
| merge conflict, build failed | *nesto je zapelo, nije do tebe — javicu Draganu* |

The rest of the vocabulary rules in the skill file still apply: no technical words, no file paths, no error text, one short message.

### The flow

1. **First message of a new edit** — make the change on a fresh branch from current `main`, run `./scripts/preflight.sh`, push. Then tell her in one message: what changed, the test link, and how to publish. Example:

   > *Promenila sam naslov na strani Two Million Years. Ovo je probna verzija, pravi sajt jos nije promenjen: <link>. Pogledaj na telefonu — ako je sve ok, napisi mi "objavi" i stavicu to na pravi sajt. Ako nesto treba drugacije, samo mi reci sta.*

2. **She wants more changes** — keep working on the same branch, so she keeps one link. Push, wait for the build, give her the same link again: *"Ispravila sam, osvezi stranicu: <link>"*.

3. **She says "objavi" / "moze" / "super, stavi to"** — publish:
   - `git fetch`, merge current `origin/main` into the branch, re-run `./scripts/preflight.sh`. Exit 0 only.
   - Open a pull request into `main` if there is none, and merge it (merge commit, no squash, no force).
   - Wait for the production deployment of `main` to finish (Vercel state `READY`, or the GitHub status on the merge commit).
   - Tell her: *"Objavljeno. Izmena je sada na pravom sajtu: https://www.tatjanizza.com/<page>. Ponekad treba par minuta i osvezavanje stranice da se vidi."*

4. **If you can not push or merge yourself** (some Codex setups only give her a button), tell her exactly which button to tap, using the text written on it, one step at a time. For example: *"Pritisni dugme **Create PR** gore desno. Posle toga mi napisi 'gotovo' i dacu ti link."* For publishing on GitHub: *"Otvori ovaj link: <PR link>. Na dnu pritisni zeleno dugme **Merge pull request**, pa **Confirm merge**."* Never more than two taps per message.

### When not to publish — stop and tell her it waits for Dragan

- the merge with `main` has conflicts, or `./scripts/preflight.sh` is not 0 after the merge
- the change touches anything outside `content/` and `public/uploads/` (code, design, settings)
- she did not clearly say yes to *this* test copy — "lepo je" about one part is not a yes for the whole change
- the production build after publishing fails — then tell her right away: *"Nesto je zapelo pri objavi, pravi sajt je i dalje ok, javljam Draganu."* (A failed Vercel build does not replace the live site; the previous version stays up.)

## `main` is the live site

`main` deploys straight to production with no CI gate. **Never commit or push directly to `main`.** The only way a change reaches `main` is a pull request merged after a green `./scripts/preflight.sh` — by Dragan, or by Tatjanizza through the flow above.

Workflow: short branch from current `main` → push → Vercel preview → pull request → `main` (merged by Dragan, or by Tatjanizza when she says "objavi").

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
