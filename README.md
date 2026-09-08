# Tina Starter 🦙 .

![tina-nextjs-starter-demo](https://user-images.githubusercontent.com/103008/130587027-995ccc45-a852-4f90-b658-13e8e0517339.gif)

This Next.js starter is powered by [TinaCMS](https://app.tina.io) for you and your team to visually live edit the structured content of your website. ✨

The content is managed through Markdown and JSON files stored in your GitHub repository, and queried through Tina GraphQL API.

### Features

- [Tina Headless CMS](https://app.tina.io) for authentication, content modeling, visual editing and team management.
- [Vercel](https://vercel.com) deployment to visually edit your site from the `/admin` route.
- Local development workflow from the filesystem with a local GraqhQL server.

## Requirements

- Git, [Node.js Active LTS](https://nodejs.org/en/about/releases/), pnpm installed for local development.
- A [TinaCMS](https://app.tina.io) account for live editing.

## Local Development

Install the project's dependencies:

> [!NOTE]  
> [Do you know the best package manager for Node.js?](https://www.ssw.com.au/rules/best-package-manager-for-node/) Using the right package manager can greatly enhance your development workflow. We recommend using pnpm for its speed and efficient handling of dependencies. Learn more about why pnpm might be the best choice for your projects by checking out this rule from SSW.


```
pnpm install
```

Run the project locally:

```
pnpm dev
```

### Local URLs

- http://localhost:3000 : browse the website
- http://localhost:3000/admin : connect to Tina Cloud and go in edit mode
- http://localhost:3000/exit-admin : log out of Tina Cloud
- http://localhost:4001/altair/ : GraphQL playground to test queries and browse the API documentation

## Deployment

This site is hosted on **Vercel**, deployed automatically from the `main` branch of
[easingthemes/tatjanizza](https://github.com/easingthemes/tatjanizza). Pushing to `main` triggers a
production deploy; no manual step and no CI workflow in this repo.

| | |
|---|---|
| Live now | https://tatjanizza.vercel.app |
| Intended production | `www.tatjanizza.com` — added in Vercel, DNS not yet pointing at it |
| Apex | `tatjanizza.com` — 308-redirects to `www`; needs an `A` record |

DNS is at **DreamHost** (nameservers `ns1`–`ns3.dreamhost.com`). To finish the custom domain, two
records are needed in the DreamHost zone, which currently holds only its `NS` records:

| Type | Host | Points to |
|---|---|---|
| `A` | *(blank — apex)* | `216.198.79.1` |
| `CNAME` | `www` | the project's unique target, e.g. `<hash>.vercel-dns-0XX.com` |

> [!IMPORTANT]
> Do not use the generic legacy targets (`cname.vercel-dns.com`, `76.76.21.21`). Vercel issues a
> **per-project** CNAME target for subdomains — read the exact value from the `www.tatjanizza.com`
> row under Vercel → Settings → Domains → *DNS configuration*. Never add both an `A` and a `CNAME`
> for the same hostname.

The following environment variables must be set in the Vercel project (Settings → Environment
Variables), not just in local `.env`:

- `NEXT_PUBLIC_TINA_CLIENT_ID`
- `TINA_TOKEN`
- `NEXT_PUBLIC_TINA_BRANCH`

You get the first two from your TinaCloud project at [app.tina.io](https://app.tina.io).

> [!NOTE]
> Vercel is a deliberate choice over GitHub Pages. Static export (`output: 'export'`) would work —
> this app has no API routes, middleware, or server actions — but it would disable `next/image`
> optimization, drop ISR in favour of a full rebuild on every content save, and silently ignore the
> `rewrites()` and `headers()` config in `next.config.ts`. Don't convert to a static export without
> revisiting those tradeoffs.

### Building the Starter Locally (Using the hosted content API)

Replace the `.env.example`, with `.env`

```
NEXT_PUBLIC_TINA_CLIENT_ID=<get this from the project you create at app.tina.io>
TINA_TOKEN=<get this from the project you create at app.tina.io>
NEXT_PUBLIC_TINA_BRANCH=<Specify the branch with Tina configured>
```

Build the project:

```bash
pnpm build
```

## Getting Help

To get help with any TinaCMS challenges you may have:

- Visit the [documentation](https://tina.io/docs/) to learn about Tina.
- [Join our Discord](https://discord.gg/zumN63Ybpf) to share feedback.
- Visit the [community forum](https://community.tinacms.org/) to ask questions.
- Get support through the chat widget on the TinaCMS Dashboard
- [Email us](mailto:support@tina.io) to schedule a call with our team and share more about your context and what you're trying to achieve.
- [Search or open an issue](https://github.com/tinacms/tinacms/issues) if something is not working.
- Reach out on Twitter at [@tina_cms](https://twitter.com/tina_cms).

## Development tips

### Visual Studio Code GraphQL extension

[Install the GraphQL extension](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) to benefit from type auto-completion.

### Typescript

A good way to ensure your components match the shape of your data is to leverage the auto-generated TypeScript types.
These are rebuilt when your `tina` config changes.

## LICENSE

Licensed under the [Apache 2.0 license](./LICENSE).


# Repository cleaned of LFS content
# Repository cleaned of LFS content - Wed Sep 17 15:00:42 AEST 2025

