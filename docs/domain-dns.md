# Domain and DNS

How `tatjanizza.com` reaches the site on Vercel, what lives where, and what to touch if it breaks.

> [!IMPORTANT]
> **DreamHost is the registrar only. It does not serve DNS for this domain.**
> The nameservers were pointed at Vercel, so the whole zone — every A, CNAME, TXT, MX record — is
> managed in the Vercel dashboard. Editing DNS in the DreamHost panel has **no effect**: that zone
> is still there, but nothing on the internet asks it anything.

## Current state

Verified 2026-09-14 against public DNS and the registry.

| | |
|---|---|
| Registrar | DreamHost, LLC — registered 2026-09-08, expires 2027-09-08 |
| Nameservers | `ns1.vercel-dns.com`, `ns2.vercel-dns.com` |
| DNS zone hosted by | **Vercel** (their DNS runs on NS1 — the SOA reads `hostmaster.nsone.net`) |
| Site hosted by | Vercel, project `tatjanizza`, team `kaidx` |
| Production URL | https://www.tatjanizza.com |
| Apex | `tatjanizza.com` → 308 redirect to `www` |

Records as they resolve today:

| Name | Type | Value | Who set it |
|---|---|---|---|
| `tatjanizza.com` | A | `216.198.79.1`, `64.29.17.65` | Vercel, automatically |
| `www.tatjanizza.com` | A | `216.198.79.1`, `64.29.17.65` | Vercel, automatically |
| `tatjanizza.com` | CAA | `pki.goog`, `sectigo.com`, `letsencrypt.org` | Vercel, automatically |

No MX, no TXT, no CNAME. There is no email on this domain.

> [!WARNING]
> Those IPs are Vercel's shared anycast addresses and **they change**. Never copy them into a config
> file, a script, or another domain's zone. If you ever need the right value, read it from Vercel →
> Settings → Domains → *DNS configuration*, or run `vercel domains inspect tatjanizza.com`. The old
> public values you will find by googling (`76.76.21.21`, `cname.vercel-dns.com`) are legacy and
> wrong for this project.

## What was actually changed in DreamHost

Exactly one thing, once:

**DreamHost panel → Domains → Registrations → (tatjanizza.com) → DNS / Nameservers → "Use custom
nameservers"**, set to:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

That's it. No records were created in DreamHost, and none need to be. Everything else — the A
records, the CAA records, the TLS certificate, the apex→www redirect — Vercel did on its own after
the delegation took effect.

The other half of the setup happened on the Vercel side, not at DreamHost: both `tatjanizza.com` and
`www.tatjanizza.com` were added under project **Settings → Domains**, with the apex set to redirect
to `www` (308).

## If this ever has to be redone

Order matters — add the domain in Vercel first, so it is ready when the delegation lands.

1. **Vercel** → project `tatjanizza` → Settings → Domains → add `www.tatjanizza.com` and
   `tatjanizza.com`, set the apex to redirect to `www`.
2. **DreamHost** → Registrations → custom nameservers → `ns1.vercel-dns.com`, `ns2.vercel-dns.com`.
3. Wait. Nameserver changes propagate in hours, not minutes. Vercel issues the certificate by itself
   once it sees the delegation; do not keep re-adding the domain.
4. Recreate any non-web records (mail, verification TXT) **in Vercel DNS**, not DreamHost.

## Could this be automated?

Not the part that matters. DreamHost stripped their public API down to DNS commands (`dns-*`) plus
API metacommands — every account, domain, mail and registration command was removed. A nameserver
change is a *registrar* operation, so it is panel-only, by hand.

And the surviving `dns-*` commands are useless for this domain anyway, because DreamHost no longer
answers for the zone. See [CONTRIBUTING.md](../CONTRIBUTING.md) — no scripts in this repo touch DNS,
deliberately.

## Things that will bite you

- **Adding email later.** MX records go in **Vercel** DNS. Adding them in the DreamHost panel looks
  like it worked and does nothing.
- **No CNAME on an apex.** `tatjanizza.com` must stay an A (or Vercel's own ALIAS) — DNS does not
  allow a CNAME at a zone apex alongside the SOA/NS.
- **Never both an A and a CNAME on the same hostname.** Resolvers treat that as broken.
- **Renewal is still DreamHost's.** The domain expires 2027-09-08. If it lapses, the Vercel setup is
  irrelevant — the delegation dies with the registration.
- **Changing the production domain** means editing `metadataBase` in `app/layout.tsx` too, or every
  OpenGraph image URL breaks.

## Checking it yourself

No special tools needed:

```bash
# who is authoritative for the zone
curl -s -H 'accept: application/dns-json' 'https://dns.google/resolve?name=tatjanizza.com&type=NS'

# where the site points
curl -s -H 'accept: application/dns-json' 'https://dns.google/resolve?name=www.tatjanizza.com&type=A'

# apex should answer 308 to www, www should answer 200
curl -sS -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://tatjanizza.com/
curl -sS -o /dev/null -w '%{http_code}\n' https://www.tatjanizza.com/
```

If the NS answer ever comes back as `ns1.dreamhost.com` and friends, the delegation was reverted and
the site will go down as soon as caches expire.
