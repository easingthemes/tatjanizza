# tatjanizza.com

Personal site for **Tatjanizza** — a musician who records in ancient and modern languages
(Akkadian, Phoenician, Old Norse, Sanskrit, Old Greek, Hebrew, Welsh, Serbian). Portfolio and blog,
with all content editable through a visual CMS rather than by editing code.

| | |
|---|---|
| Production | https://www.tatjanizza.com |
| Content editing | https://www.tatjanizza.com/admin |
| Music | [Spotify](https://open.spotify.com/artist/09tBWDb9mvGH9ls4c2ovDr) |

> [!IMPORTANT]
> **The site currently shows a temporary "coming soon" splash.** `app/page.tsx` renders
> `components/coming-soon.tsx` and deliberately bypasses the site layout; `<Header>` and `<Footer>`
> are commented out site-wide in `components/layout/layout.tsx`. The real Tina-driven home page is
> commented out in `app/page.tsx`, ready to restore. See [CONTRIBUTING.md](./CONTRIBUTING.md#restoring-the-real-site).

## Stack

- **[Next.js 15](https://nextjs.org)** App Router, React 18, TypeScript
- **[TinaCMS](https://tina.io)** — content lives as Markdown/MDX/JSON in `content/`, queried through
  Tina's generated GraphQL client. There is no database.
- **Tailwind CSS v4** configured entirely in `styles.css` (no `tailwind.config.js`), with
  [shadcn/ui](https://ui.shadcn.com) primitives in `components/ui/`
- **Biome** for lint and formatting
- **Vercel** for hosting

## Quick start

Requires Node 22 (see `.nvmrc`) and pnpm.

```bash
pnpm install
cp .env.example .env   # then fill in the values below
pnpm dev
```

`.env` needs credentials from your [TinaCloud](https://app.tina.io) project:

```
NEXT_PUBLIC_TINA_CLIENT_ID=
TINA_TOKEN=
NEXT_PUBLIC_TINA_BRANCH=main
```

### Local URLs

| URL | |
|---|---|
| http://localhost:3000 | the site |
| http://localhost:3000/admin | visual editing |
| http://localhost:3000/exit-admin | log out of TinaCloud |
| http://localhost:4001/altair/ | GraphQL playground for the content API |

## Documentation

| Document | For |
|---|---|
| [CONTRIBUTING.md](./CONTRIBUTING.md) | developing: commands, adding blocks, conventions, gotchas |
| [docs/editing-content.md](./docs/editing-content.md) | editing the site's words and images — no code |
| [CLAUDE.md](./CLAUDE.md) | architecture notes, also read by AI coding assistants |

## Deployment

Hosted on **Vercel**, deployed automatically from the `main` branch of
[easingthemes/tatjanizza](https://github.com/easingthemes/tatjanizza). Pushing to `main` triggers a
production deploy — there is no CI workflow in this repo and no manual step.

| | |
|---|---|
| Production | https://www.tatjanizza.com |
| Apex | `tatjanizza.com` — 308-redirects to `www` |
| Vercel alias | https://tatjanizza.vercel.app |
| Vercel project | `tatjanizza`, in the team **kaidx** (*vebkurs-5678's projects*) |

A push is not instant: Vercel needs roughly **one to three minutes** to build before the new version
is served. Every branch gets its own preview deployment — see
[CONTRIBUTING.md](./CONTRIBUTING.md#previews) for the URL pattern.

DNS stays at **DreamHost** (nameservers `ns1`–`ns3.dreamhost.com`) rather than moving to Vercel's,
using an `A` record on the apex and a `CNAME` on `www` pointing at the project's Vercel target.

> [!IMPORTANT]
> If these records ever need re-creating, read the values from the relevant row under Vercel →
> Settings → Domains → *DNS configuration*. Vercel issues a **per-project** CNAME target for
> subdomains, so do not use the generic legacy values (`cname.vercel-dns.com`, `76.76.21.21`), and
> never add both an `A` and a `CNAME` for the same hostname.

`NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN` and `NEXT_PUBLIC_TINA_BRANCH` must also be set in the
Vercel project (Settings → Environment Variables), not only in local `.env`.

> [!NOTE]
> Vercel is a deliberate choice over GitHub Pages. Static export (`output: 'export'`) would work —
> this app has no API routes, middleware, or server actions — but it would disable `next/image`
> optimization, drop ISR in favour of a full rebuild on every content save, and silently ignore the
> `rewrites()` and `headers()` config in `next.config.ts`. Don't convert to a static export without
> revisiting those tradeoffs.

## Credits & licence

Built from the [Tina Cloud Starter](https://github.com/tinacms/tina-cloud-starter) by SSW. The
inherited starter code is under the [Apache 2.0 licence](./LICENSE); see [NOTICE](./NOTICE) for the
original attribution, which Apache 2.0 requires be kept.

Site content — writing, images, artwork and music — is **not** covered by that licence and remains
© Tatjanizza, all rights reserved.

### Useful references

- [TinaCMS documentation](https://tina.io/docs/)
- [VS Code GraphQL extension](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)
  for autocompletion against the generated schema
