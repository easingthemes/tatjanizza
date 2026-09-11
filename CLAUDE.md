# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Companion docs: [CONTRIBUTING.md](./CONTRIBUTING.md) for the human dev workflow (setup, commit conventions, how to restore the real home page) and [docs/editing-content.md](./docs/editing-content.md) for the non-technical content-editing guide. Keep this file and CONTRIBUTING.md in step — they intentionally overlap on the block-adding pattern and Biome settings.

> [!IMPORTANT]
> **If the person you are talking to is asking for a content change — a page, a heading, a paragraph, an image, a track listing, a post — invoke the `edit-site` skill and follow it.** The site's owner edits it herself through Claude Code, usually from a phone, and is not a developer. That skill carries the rules for those sessions: plain language, work on a branch never `main`, and the mandatory `./scripts/preflight.sh` check before every push. This file is for working on the code.

## Never push a broken build

`main` deploys straight to production and there is no CI gate, so the only thing standing between a bad commit and a red deploy is a local check. Run it before every push, on any branch:

```bash
./scripts/preflight.sh   # 0 = safe to push, 1 = do not push
```

It installs deps, lints, then runs the same build Vercel runs — schema validation, typecheck and a prerender of every page. **No TinaCloud credentials are needed**: `tinacms build --local` starts a GraphQL server over `content/` and generates a client pointed at it, which is enough for `next build`. Everything it writes (`tina/__generated__/`, `public/admin/index.html`) is gitignored, so the working tree stays clean. `NODE_ENV=production` is set explicitly inside the script — without it Next prerenders `/404` with the dev pages runtime and dies on `<Html> should not be imported outside of pages/_document`, an error that has nothing to do with your change.

## Commands

Package manager is **pnpm** (Node v22, see `.nvmrc`).

```bash
pnpm install
pnpm dev          # tinacms dev (GraphQL server on :4001) + next dev --turbopack on :3000
pnpm build        # tinacms build (cloud) + next build — needs valid TinaCloud env vars
pnpm build-local  # build against local filesystem content, skips cloud checks
pnpm lint         # biome lint
pnpm dev:build    # next build only, skips the tinacms codegen step
npx tsc --noEmit  # typecheck
```

There is no test framework in this repo. "Verifying a change" means typecheck + lint + loading the affected route and, for editable content, checking click-to-edit in `/admin`.

Local URLs: `/` site, `/admin` Tina edit mode, `/exit-admin` log out, `http://localhost:4001/altair/` GraphQL playground.

Env vars (copy `.env.example` → `.env`): `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, `NEXT_PUBLIC_TINA_BRANCH`.

## Architecture

TinaCMS + Next.js 15 App Router. Content lives as **Markdown/MDX/JSON files in `content/`** and is read through Tina's generated GraphQL client — there is no database.

### Server/client split (every route)

Routes are split into `page.tsx` (server) and `client-page.tsx` (client):

- `page.tsx` — `await client.queries.X()` from `@/tina/__generated__/client`, wraps in `<Layout rawPageData={data}>`, spreads the whole query result into the client page (`<ClientPage {...data} />`). Also exports `revalidate = 300` and `generateStaticParams()` (which pages through `xConnection` cursors to enumerate all content files).
- `client-page.tsx` — `"use client"`, calls `useTina({ query, data, variables })` and renders. `useTina` returns only `data` (no loading/error state), so all error handling (`notFound()`) belongs in the server component.

Note the import path: the Tina client is `@/tina/__generated__/client` (default export), **not** `@/tina/client`.

### Block-based pages

`content/pages/*.mdx` holds a `blocks` array; `components/blocks/index.tsx` switches on `block.__typename` (`PageBlocksHero`, `PageBlocksCta`, …) to pick the component. Adding a block type means touching three places:

1. Create `components/blocks/<name>.tsx` exporting **both** the component and its `Template` schema (e.g. `heroBlockSchema`) from the same file. Include `sectionBlockSchemaField as any` in `fields` for the shared background option.
2. Register the schema in `tina/collection/page.ts` `templates: [...]`.
3. Add a `case` to the `Block` switch in `components/blocks/index.tsx`.

Schema co-location is the core convention here: Tina schemas import from `components/`, not the other way around. `tina/collection/*.ts` files are thin — they import block schemas and custom field UIs.

### Layout and global settings

`components/layout/layout.tsx` is an async server component that fetches the `global` collection (`content/global/index.json`, revalidate 60) and feeds `LayoutProvider`. Client components read `globalSettings` and `theme` via `useLayout()` from `components/layout/layout-context.tsx` — that hook returns hard-coded defaults when no provider is present, so it never throws but can silently render default theming.

### Custom Tina field UIs

`tina/fields/icon.tsx` and `tina/fields/color.tsx` are sidebar widgets built with `wrapFieldsWithMeta`. `iconSchema` is reused across collections and blocks. The icon set is the `IconOptions` map in `components/icon.tsx` (react-icons + an inline Tina logo).

### Rich text

`components/mdx-components.tsx` exports a single `components` object passed to every `<TinaMarkdown>`. It maps custom MDX templates (`BlockQuote`, `DateTime`, `NewsletterSignup`, `video`) and overrides `code_block` (Prism, with `lang: 'mermaid'` routed to `components/blocks/mermaid.tsx`) and `img`. Any new MDX template needs an entry here *and* a `templates` entry on the `rich-text` field in the collection schema.

### Collections

`page` (`content/pages`, mdx, blocks-only), `post` (`content/posts`, mdx, references `author`/`tag`), `author`, `tag`, `global` (json, `ui.global: true`). Each collection's `ui.router` maps a document to its URL — `page` special-cases `home` → `/`.

## Conventions

- Styling is **Tailwind v4** configured entirely in `styles.css` via `@theme inline` + CSS custom properties (oklch). There is no `tailwind.config.js`. shadcn/ui ("new-york", lucide icons) is set up in `components.json`; primitives live in `components/ui/`.
- Import alias is `@/*` → repo root.
- Biome handles lint and format: single quotes, single-quoted JSX attributes, 2-space indent, **line width 160**, semicolons always, ES5 trailing commas. `noExplicitAny` and `noUnusedVariables` are off.
- Files kebab-case; components PascalCase; generated types are `<Collection>Query` / `<Collection>ConnectionQuery` from `@/tina/__generated__/types`.
- **Never edit `tina/__generated__/`** — it is regenerated by `tinacms dev`/`tinacms build` when the schema changes. Restart `pnpm dev` after schema edits so types and the GraphQL client update.
- Every user-editable DOM element needs `data-tina-field={tinaField(parentObject, 'fieldName')}` — pass the parent object and a field name, never a string literal or computed value. A missing attribute means editors can't click-to-edit that element.
- `public/admin/` is the built Tina admin bundle; `public/uploads/` is the media store root.

## Deployment

Hosted on **Vercel**, auto-deployed from `main` in [easingthemes/tatjanizza](https://github.com/easingthemes/tatjanizza). There is no `.github/workflows/` directory and none is needed — Vercel builds on push. The project is `tatjanizza` in the Vercel team `kaidx` (Hobby plan); a build takes ~1–3 min, so a pushed change is not live immediately.

Every branch gets a public preview at `https://tatjanizza-git-<branch>-kaidx.vercel.app` (slashes in the branch name become dashes; long names are truncated with a hash). Deployment protection is off — previews need no Vercel login. See [CONTRIBUTING.md](./CONTRIBUTING.md#previews).

Production is `www.tatjanizza.com`; the apex `tatjanizza.com` 308-redirects to it, and `tatjanizza.vercel.app` remains as an alias. DNS is at DreamHost, not Vercel's nameservers.

`app/layout.tsx` hardcodes `metadataBase` to `https://www.tatjanizza.com` so OpenGraph image paths resolve absolutely — update it there if the production domain ever changes.

`NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, and `NEXT_PUBLIC_TINA_BRANCH` must exist in the Vercel project settings, not only in local `.env`.

**Vercel was chosen deliberately over GitHub Pages — do not propose a static-export conversion unless asked.** Static export is technically feasible (no API routes, middleware, server actions, or `searchParams` anywhere), but it would disable `next/image` optimization, replace ISR with a full rebuild on every content save, and silently ignore `rewrites()` and `headers()`. Four things in the codebase depend on having a server and would break or go inert:

- `export const revalidate = 300` in all four route files (`app/page.tsx`, `app/[...urlSegments]/page.tsx`, `app/posts/page.tsx`, `app/posts/[...urlSegments]/page.tsx`)
- the `rewrites()` mapping `/admin` → `/admin/index.html` in `next.config.ts`
- the `headers()` CSP — `X-Frame-Options: SAMEORIGIN` plus `frame-ancestors 'self'`, also duplicated in the root layout
- optimized `next/image`, which allowlists `assets.tina.io` and `res.cloudinary.com`

`.github/copilot-instructions.md` contains a long TinaCMS pattern guide. It is broadly correct on the server/client split, `useTina`, and `tinaField` usage, but its file-layout examples (`src/`, `@/tina/client`, `utils/tina-client.ts`) do not match this repo — prefer the actual code in `app/` and `components/`.
