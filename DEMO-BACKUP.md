# demo-backup — what this branch is

**This branch is a frozen reference, not a line of development. Do not merge it
into `main`, do not build on it, do not push to it.**

It is `main` at `7f0a6cc`, the last commit that still contained the TinaCMS
starter content. That content was removed from the working branch in `31fb48b`
("chore: remove the TinaCMS starter content") because none of it belongs on
Tatjanizza's site — it was llamas, Napoleon and lorem about blogging.

The removal was right. But the starter content was also the only worked example
in the repo of *how the content layer is shaped*: what a post's frontmatter
looks like, how an author is referenced, how a nested folder becomes a URL,
which custom MDX templates exist and how they are written. There are no tests
here and no other fixtures, so deleting it left nothing to copy from.

Hence this branch. When a future session needs to know "what does a valid X
look like", the answer is here.

## How to use it without merging it

Read a single file straight out of the branch — no checkout, no merge:

```bash
git show demo-backup:content/posts/learning-about-components.mdx
git show demo-backup:content/authors/lucy.md
```

List everything it has that the current branch does not:

```bash
git diff --stat main...demo-backup
```

Copy one file back into the working tree, if you genuinely need it as a
starting point (then rewrite it — never ship starter prose):

```bash
git checkout demo-backup -- content/posts/learning-about-markdown.mdx
```

## What is in here

### Posts — `content/posts/`

| file | what it is worth reading for |
|---|---|
| `learning-about-components.mdx` | the three custom MDX templates in use: `<BlockQuote>`, `<DateTime format="local" />`, `<NewsletterSignup>`. Also a `graphql` code fence. This is the file to copy from when adding a new rich-text template. |
| `learning-about-markdown.mdx` | the full range of markdown the renderer handles — headings, lists, tables, images, links, and `js` / `markdown` / `mermaid` code fences |
| `learning-about-mermaid.mdx` | mermaid diagrams, which are routed through `code_block` with `lang: 'mermaid'` to `components/blocks/mermaid.tsx` |
| `learning-about-tinacms.mdx` | plain prose post, minimal — the smallest valid shape |
| `learning-to-blog.mdx` | plain prose post |
| `june/learning-about-tinacloud.mdx` | **the only example of a post in a subfolder**, which becomes `/posts/june/learning-about-tinacloud`. Also the only one using `tags`. |

Post frontmatter, as the collection expects it:

```yaml
---
title: Learning about components
heroImg: /uploads/posts/learning-about-components.webp
excerpt: >
  Folded block scalar, two-space indented.
author: content/authors/napoleon.md    # a path, not a name
date: 2021-07-15T07:00:00.000Z
tags:                                   # optional
  - content/tags/mermaid.mdx
---
```

Note `author` and `tags` are **file paths into `content/`**, not slugs. That is
how Tina reference fields serialise, and getting it wrong fails at query time,
not at save time.

### Authors — `content/authors/` (4 files, `.md` not `.mdx`)

```yaml
---
name: Lucy
avatar: /uploads/authors/lucy.webp
---
```

### Tags — `content/tags/` (3 files)

```yaml
---
name: mermaid
---
```

### Pages — `content/pages/`

`home.mdx` on this branch is the **starter** home page, before it was replaced
with Tatjanizza's. It is the only place every stock block appears together in
one working page: `hero`, `callout`, `features`, `stats`, `testimonial`, `cta`.
When you need to know what fields a stock block actually takes in a real
document — rather than reading its schema — read this.

`about.mdx` is a single `content` block.

### Images — `public/uploads/`

Author portraits, post hero images, and ten testimonial avatars. All starter
assets, all safe to delete. **`public/uploads/posts/main.jpg` is not in that
group** — it is Tatjanizza's own image, it was never part of the starter, and
it was correctly left alone by the removal.

## Keeping it honest

This is a snapshot of one commit. It will drift from `main` and that is fine —
it is here to answer "what did the starter do", not "what does the site do now".
If the content schema in `tina/collection/` changes in a way that makes these
examples wrong, the examples are wrong, not the schema. Check the schema first.
