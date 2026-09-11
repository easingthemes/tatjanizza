---
name: edit-site
description: Change the text, images or pages of the tatjanizza.com website on someone's behalf, then get the change onto a preview link safely. Use for any request to edit, add, remove or reword site content — a page, a heading, a paragraph, a photo, a track listing, a blog post — especially when the person asking is not a developer and is working from a phone. Covers the required pre-push build check and what to report back afterwards.
---

# Editing the Tatjanizza site

This site belongs to Tatjanizza, a musician. She edits it herself through Claude
Code, often on a phone, and she is **not a technical person**. Dragan
(`vebkurs@gmail.com`) is the developer.

Your job is to make the change she asks for, prove it doesn't break the site,
put it on a preview link, and tell her what to click. Nothing else.

## The one rule that matters

**Never push a commit that breaks the build.** The check is one command:

```bash
./scripts/preflight.sh
```

| exit | meaning | what you do |
|---|---|---|
| 0 | it works | push |
| 1 | **the change is broken** | do not push — fix it, or stop and say so |
| 2 | **the machine is dirty** | says nothing about the change. Never report this as her mistake. |

It needs no credentials and no setup: it installs, lints, then builds every page
against the files in `content/` exactly the way the server does. Takes 2-4 minutes.

Run it after every change, before every push. No exceptions, however small the
edit looks — the last change that broke things was a three-line tweak that
looked perfectly fine.

**Exit 2 is not a failure of her edit.** It means something on this machine got
in the way — a leftover process holding a port, a full disk. Say so in those
terms: *"Nesto na mom kraju je zapelo, nije do tvoje izmene. Pokusavam ponovo."*
Then run it again. If it happens twice, hand over to Dragan. Never push on a 2 —
you have not actually checked anything.

## How to talk to her

**Answer in the language she writes in.** She writes Serbian; reply in Serbian.

**These words must never appear in a message to her.** Not explained, not in
parentheses, not "in simple terms" — just absent:

> Vercel, port, build, deploy, commit, branch, push, merge, git, GitHub, schema,
> lint, log, server, localhost, npm, pnpm, cache, exit code, timeout, API,
> repo, PR, environment, CI, error code, stack trace, and any file path.

Say the thing that happened to *her site* instead:

| instead of | say |
|---|---|
| pushed to a branch / deployed | *sacuvala sam izmenu* |
| the build is running | *sprema se, potraja minut-dva* |
| the build passed / preview is ready | *evo kako izgleda: <link>* |
| the build failed | *izmena ne radi kako treba, popravljam* |
| exit 2, port in use, environment error | *nesto na mom kraju je zapelo, nije do tebe* |
| merge to main / publish to production | *da bude na pravom sajtu, javi Draganu* |
| I need to check the logs | (say nothing — just do it) |

Other rules:

- **One short message.** What changed, the link, what happens next. Three
  sentences is usually too many.
- **Never paste an error at her**, not even one line of it. Say what it means
  for her site and what you are doing about it.
- **Never ask her to choose between technical options.** Pick the safe one.
- **Never make her feel at fault.** If something broke, it broke — do not
  explain that her text, her image or her wording caused it.
- **Do not narrate your work.** She wants the result, not the steps.

Good: *"Promenila sam naslov na strani Two Million Years. Evo kako sada
izgleda: <link>. Ako je ok, javi Draganu da to ide na pravi sajt."*

Good: *"Nesto na mom kraju je zapelo, nije do tvoje izmene. Probam ponovo."*

Bad: *"Pushed to branch claude/edit-x, Vercel build queued, preflight exit 0."*

Bad: *"Build je pao zbog zauzetog porta 4001, pokusacu na drugom portu."*

## Workflow

1. **Understand what she wants.** If it's ambiguous, ask one plain question.
   If she sends a photo or text, use it as-is — don't rewrite her words.
2. **Make the change.** Content lives in `content/` as Markdown/MDX/JSON:
   - `content/pages/*.mdx` — the site's pages (blocks: hero, prose, timeline,
     tracks, credits, …)
   - `content/posts/*.mdx` — blog posts
   - `content/global/index.json` — site name, header, footer, social links
   - `public/uploads/` — images
3. **Never work on `main`.** Create a branch: `tz/<kratak-opis>`. If she is
   already on one from an earlier session, keep using it.
4. **Run `./scripts/preflight.sh`.** Do not skip it. Do not push on exit 1.
5. **Commit** with a plain first line describing the change in English, and
   this trailer so it's clear later who asked for it:

   ```
   Changed-by: $CLAUDE_CODE_USER_EMAIL
   ```

   Read that variable from the environment — it is the email of the Claude
   account that started the session. Without it every commit looks identical,
   because the git author is always `Claude <noreply@anthropic.com>`.
6. **Push the branch**, never `main`. Other people work on this repo at the
   same time — a rejected push usually means someone else pushed while you were
   working, not that anything is wrong. See *Other people are working too*.
7. **Watch the build** (next section), then report back.

## After the push

The site is built by **Vercel**, not by GitHub — there are no GitHub Actions in
this repo. Vercel does report the result back onto the commit in GitHub, so
either source works:

- **Vercel MCP tools** if available. `get_deployment` on the branch alias, and
  read its `state` field: `QUEUED`/`BUILDING` means wait, `READY` means done,
  `ERROR` means read `get_deployment_build_logs`. Project `tatjanizza`, team
  `kaidx`.
- **GitHub commit status** otherwise — pass/fail only, no log.
- If neither is reachable, say you could not verify the build, and give her the
  link anyway with that caveat.

**Do not use the URL itself as the signal.** A Vercel deployment hostname
answers `200` while it is still building, so "the page loads" proves nothing
about whether your change is on it. Only the `state` field, or the GitHub
status, tells you the build finished.

The preview link for a branch is:

```
https://tatjanizza-git-<branch>-kaidx.vercel.app
```

with `/` and other non-alphanumerics in the branch name replaced by `-`. Long
names get truncated with a hash, so take the exact link from the deployment if
the guessed one 404s. The preview is public — no login needed, she can just
open it on her phone.

A build takes 1–3 minutes. Do not tell her it's ready before it is.

**If the build fails after you pushed:** fix it and push again. Two attempts.
If it's still red, stop, tell her plainly that it needs Dragan, and say what
is broken. Don't keep pushing.

## Out of scope — stop and hand over

Tell her this needs Dragan, and do not attempt it:

- a new *kind* of section that doesn't exist yet (adding block types means code
  in three places — see CLAUDE.md)
- design, colours, fonts, layout
- anything touching `tina/`, `components/`, `app/`, `next.config.ts`,
  `package.json`
- merging to `main` / publishing to www.tatjanizza.com
- domains, DNS, Vercel settings, environment variables

She can *ask* for these — just don't build them in a session that was meant to
be a content edit.

## Other people are working too

Dragan and other Claude sessions push to the same branches while you work. This
is normal. Expect it, and never treat it as an error to report to her.

- **Before you start**, and again **before you push**: `git fetch` and merge the
  remote branch in. Do not rebase or force-push — someone else may have that
  branch checked out.
- **If a push is rejected**, fetch, merge, re-run `./scripts/preflight.sh`
  (the merged tree is not the tree you checked), then push again.
- **If the merge touches files you just edited**, read both sides. Keep both
  changes unless they genuinely contradict; if they do, keep theirs and say so
  to Dragan — not to her.
- **The branch may have moved in ways you did not expect** — content deleted,
  files renamed. Re-run the check rather than assuming your last green result
  still holds.

## Things that will bite you

- `tina/__generated__/` is not in git and is not editable. It is regenerated by
  the build. Never hand-edit it, never commit it.
- A `string` field with `isTitle: true` **must** also have `required: true`, or
  the whole Tina config fails to load and the build dies before Next.js even
  starts. This has already broken one branch.
- Every editable element needs `data-tina-field={tinaField(parent, 'field')}`.
  A missing one doesn't fail the build — it silently makes that element
  un-clickable in `/admin`.
- Pushing to `main` deploys straight to www.tatjanizza.com. There is no staging
  and no CI gate. That is exactly why step 3 exists.
