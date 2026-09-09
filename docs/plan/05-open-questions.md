# Open questions & next steps

Sources: [00-raw-messages.md](./00-raw-messages.md) msgs 1–4, [06-site-copy.md](./06-site-copy.md).

Msg 4 answered the first three. The rest are explicitly deferred by Tatjanizza —
„Ostalo ćemo popravljati usput.“ — so nothing here blocks a first build.

## Content gaps in the delivered copy

- [x] ~~Truncated sentence~~ → *"It arrived inside it."* (msg 4)
- [x] ~~Akkadian has no track~~ → it exists, the English-titled *Two Million Years* (msg 4)
- [x] ~~Release date for *Tačna kao kod*~~ → **6 July 2026** (msg 4)
- [x] ~~Is the Akkadian track in Akkadian?~~ → No. Song is **English**, Akkadian appears
      as parts inside it. Title on Spotify: *Two Million Years (Akkadian)* (msg 5)
- [ ] **Fix `SELECTED WORKS` language labels.** The `Title — Language` form implies the
      song is in that language. It is not — see [06-site-copy.md](./06-site-copy.md) for
      three suggested fixes. **This is the one real accuracy problem in the copy.**
- [ ] **Add *Two Million Years (Akkadian)*** to SELECTED WORKS, and its release date.
- [ ] Confirm the song language of tracks 1–5 (inferred as Serbian from the titles).
- [ ] **Full catalogue** — msg 3 is "selected works", msg 2 said "including".
- [ ] **"Later languages"** are never named. Name them, or leave deliberately open?
- [x] ~~album / EP / singles?~~ → **album** *Two Million Years* (2026), per the Spotify
      screenshot in msg 5. The msg-1 wish for "concept album" findability is now easy to
      satisfy honestly — decide where to say it.
- [ ] **Prisustvo link.** Where was it published on 8 Sep 2025? That URL is provenance.

## Verification (msg 1's blocker — still open)

- [ ] Confirm 18 May 2026 as the exact first public release date against DistroKid
- [ ] Export the full DistroKid release list — every track, every date
- [ ] Confirm which track was genuinely first if they did not all drop together

## Design / build

- [ ] Home image / cover
- [ ] Project page URL — `/two-million-years`?
- [ ] Serbian version of the page? Msg 2 is English but titles are bilingual
- [ ] Tina blocks needed: prose block + dated-timeline block for ORIGINS

## Settled

- Domain `tatjanizza.com`, artist-scoped ✅ (live as `www.tatjanizza.com`)
- Platform: Next.js + TinaCMS on Vercel — supersedes Carrd/Squarespace/WordPress
- Site copy written (msg 2) — see [06-site-copy.md](./06-site-copy.md)
- Chronology 2025→2026 established — see [04-provenance.md](./04-provenance.md)
- Release form: **album** *Two Million Years* (2026)
- Language model: songs in Serbian/English, ancient languages as parts inside them (msg 5)
