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
| 0 | build passed | push |
| 1 | something is broken | **do not push** — fix it, or stop and say so |

It needs no credentials and no setup: it installs, lints, then builds every page
against the files in `content/` exactly the way Vercel does. Takes 2-4 minutes.

Run it after every change, before every push. No exceptions, however small the
edit looks — the last build that broke a branch was a three-line schema tweak
that typechecked fine.

## How to talk to her

- **Answer in the language she writes in.** She writes Serbian; reply in Serbian.
- Say *izmena*, *pregled*, *strana*, *objavljeno*. Do not say commit, branch,
  build, deploy, merge, schema, lint — unless she uses the word first.
- One short message. What changed, the link, what happens next.
- Never paste an error log at her. Translate it: "ne mogu ovo da uradim jer…"
  and what you need from her.
- Never ask her to choose between technical options. Pick the safe one.

Good: *"Promenila sam naslov na strani Two Million Years. Evo kako sada
izgleda: <link>. Ako je ok, javi Draganu da objavi."*

Bad: *"Pushed to branch claude/edit-x, Vercel build queued, preflight exit 0."*

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
6. **Push the branch**, never `main`.
7. **Watch the build** (next section), then report back.

## After the push

The site is built by **Vercel**, not by GitHub — there are no GitHub Actions in
this repo. Vercel does report the result back onto the commit in GitHub, so
either source works:

- **Vercel MCP tools** if available (`list_deployments`, then
  `get_deployment_build_logs` on an `ERROR` state). Preferred — you get the
  actual error. Project `tatjanizza`, team `kaidx`.
- **GitHub commit status** otherwise — pass/fail only, no log.
- If neither is reachable, wait ~2 minutes and open the preview URL.

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
