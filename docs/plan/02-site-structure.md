# Site structure

Sources: [00-raw-messages.md](./00-raw-messages.md) msg 1, [06-site-copy.md](./06-site-copy.md) msg 2.

## Home `/`

Deliberately minimal (msg 1): name, one good image/cover, one sentence, the music.

Copy is written (msg 2, HOME section):

- **TATJANIZZA**
- Tagline: *Music, language, deep time, artificial intelligence.*
- One-sentence bio: *writer and conceptual artist working with language, generative AI and music*
- One paragraph pointing to the project
- CTA: **Listen on Spotify →**

## Project page — *Two Million Years*

The real document. Section order as delivered in msg 2:

| # | Section | Purpose |
| --- | --- | --- |
| 1 | **TWO MILLION YEARS** | Premise + one-paragraph factual summary (AI-native, 2025 writing, May 2026 music) |
| 2 | **THE IDEA** | How it started — writing, not generative music |
| 3 | **ORIGINS** | Dated timeline, May 2025 → 18 May 2026 |
| 4 | **LANGUAGE AS TIME** | Why the languages are dramaturgy, not translation |
| 5 | **WHEN THE WORK FOUND ITS MEDIUM** | The recursion; AI as presence/subject/addressee/medium |
| 6 | **ABOUT TATJANIZZA** | Berlin-based bio |
| 7 | **Provenance footer** | Credits block — see [04-provenance.md](./04-provenance.md) |

The msg-1 idea of a separate "Project history — Berlin, 2026" section is now absorbed
into **ORIGINS** + **ABOUT TATJANIZZA**. No separate section needed.

## Implementation notes

Site runs on TinaCMS + Next.js on Vercel at `www.tatjanizza.com` (see [CLAUDE.md](../../CLAUDE.md)),
so the msg-1 platform options (Carrd / Squarespace / WordPress.com) are superseded.

Blocks needed for the project page: a prose/rich-text block and a dated-timeline block.
ORIGINS is the only section that is not plain prose.
