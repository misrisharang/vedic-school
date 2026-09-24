# The Vedic School .co.in → .com Redirect Map

> **Status: DRAFT — for review. Nothing here has been implemented.**
> Audit date: 2026-09-23. Evidence and method: [vedic-school-domain-migration-notes.md](./vedic-school-domain-migration-notes.md).
> Agency-facing requirements: [vedic-school-domain-migration-agency-brief.md](./vedic-school-domain-migration-agency-brief.md).

## Migration Overview

| | |
|---|---|
| Old domain | `https://thevedicschool.co.in` (+ `http://`, `www.` variants) |
| New canonical domain | `https://www.thevedicschool.com` |
| Old platform (observed) | Static HTML template on Hostinger (`server: hcdn`, `platform: hostinger`), PHP form handlers. Pages last modified 31 May 2025. |
| New platform | React + Vite, prerendered, hosted on Netlify |
| Old site blog | **None.** The "Blog" nav link points to `blog-single.html`, which returns 404 and has never been captured by the Wayback Machine. The homepage "blog" teaser is unedited template placeholder text (Lorem ipsum). |

## ⚠️ Blocker to resolve before the agency implements: trailing-slash chain on .com

**VERIFIED on 2026-09-23:** every inner page on the .com site answers the canonical (no-slash) URL with a 301 to a trailing-slash URL. The trailing-slash page then declares the **no-slash** URL as its canonical:

```
https://www.thevedicschool.com/about   → 301 → https://www.thevedicschool.com/about/  → 200
https://www.thevedicschool.com/about/  <link rel="canonical" href="https://www.thevedicschool.com/about">
```

The same happens on `/vedic-maths`, `/curriculum-aligned`, `/contact`, `/blog`, every `/blog/*` article, `/authors/meenakshi-koul` and all three legal pages. Only `/` answers 200 directly.

**Cause (INFERRED from the repo):** `scripts/prerender.mjs` writes each route to `<route>/index.html`. Netlify serves directory indexes by redirecting `/route` → `/route/`.

**Effect on this migration:** if the agency redirects `…co.in/about.html → https://www.thevedicschool.com/about` (the canonical URL, as listed in the sitemap), the result is a chain:
`co.in/about.html → 301 → .com/about → 301 → .com/about/ → 200`.
If the agency targets `/about/` instead, there is no chain, but the destination is a URL the .com site itself marks as non-canonical.

**DECISION REQUIRED (The Vedic School, not the agency):** make the .com canonical URLs answer 200 directly, **or** switch the .com canonicals and sitemap to trailing-slash URLs. Once one of those is live, confirm the final destination form to the agency. The table below uses the current sitemap and canonical form (no trailing slash). **Do not hand the table to the agency until this is settled.** This is also an SEO problem on the .com site in its own right, separate from the migration.

## Summary

| Metric | Count | Notes |
|---|---|---|
| Old URLs discovered (non-media) | **17** | 10 live pages (incl. `/index.html` duplicate), 3 linked-but-dead template URLs, 4 utility URLs. Plus ~20 image and many CSS/JS asset URLs, grouped in one row. |
| Recommended for 301 | **7** | `/`, `/index.html`, `/about.html`, `/contact.html`, 3 course pages |
| Requiring review (ambiguous destination) | **0** | All 7 redirects are gated on the trailing-slash decision above. |
| No direct equivalent (decision required) | **3** | `/summercamp.html`, `/indian-schools.html`, `/global-schools.html` |
| Recommended not to redirect | **7** + media | 3 dead template URLs, 2 PHP form handlers, `robots.txt`, `sitemap.xml`, plus static assets |
| Exact mappings | **1** | `/` → `/` (also `/index.html` → `/`). The other 5 are strong, content-verified equivalents with different slugs. |
| Path-preserving opportunities | **0** (root only) | Old paths are `*.html` and new paths have no extension, and no old slug matches a new slug. **A blanket path-preserving wildcard is NOT safe.** |
| Potential redirect chains | **6 of 7** | Every redirect except the homepage, until the trailing-slash issue is fixed. Separately, the old host's own `http→https` 301 must not come before the .com redirect (see Domain Variants). |
| Old blog articles | **0** | No blog ever existed on the old site (VERIFIED: live site + Wayback) |

_Priority is based on each page's role on the site, not on measured traffic or backlinks. No analytics, Search Console or backlink data was available._

## Master Redirect Table

Paths are relative to the old host. Each rule applies to **all four old host variants** (`http`/`https` × apex/`www`). See [Domain Variants](#domain-variants).

| # | Priority | Old URL | New URL | Action | Confidence | Category | Reason | Discovery Source |
|---|---|---|---|---|---|---|---|---|
| 1 | P0 | `https://thevedicschool.co.in/` | `https://www.thevedicschool.com/` | **REDIRECT 301** | HIGH | A. Core | Homepage to homepage. Same brand, same purpose. `/` on .com returns 200 with no chain (VERIFIED). | Live site; Wayback (2023–2025); DuckDuckGo index |
| 2 | P1 | `https://thevedicschool.co.in/index.html` | `https://www.thevedicschool.com/` | **REDIRECT 301** | HIGH | I. Duplicate | Returns the same document as `/` (byte-identical). The old nav's "Home" link points here. | Old nav/footer links; Wayback |
| 3 | P0 | `https://thevedicschool.co.in/course-basic.html` | `https://www.thevedicschool.com/vedic-maths` | **REDIRECT 301** | HIGH | B. Course | The old "Basic Level" topic list (tables, multiplication, division, square/cube roots, squares, cubes, base multiplication) appears almost word for word as Stage 01 "Starting Out" on `/vedic-maths`. ⚠ Chain until the blocker is fixed. | Old nav dropdown; Wayback; DuckDuckGo index |
| 4 | P0 | `https://thevedicschool.co.in/course-intermediate.html` | `https://www.thevedicschool.com/vedic-maths` | **REDIRECT 301** | HIGH | B. Course | The old "Intermediate Level" topics (imperfect square roots, fourth powers/roots, factorisation of quadratics and cubics, simultaneous linear equations, dates and calendars, recurring decimals) appear as Stage 02 "Building Speed" on `/vedic-maths`. ⚠ Chain until fixed. | Old nav dropdown; Wayback |
| 5 | P0 | `https://thevedicschool.co.in/course-advance.html` | `https://www.thevedicschool.com/vedic-maths` | **REDIRECT 301** | HIGH | B. Course | The old "Advance Level" topics (coordinate geometry, quadratic and simultaneous quadratic equations, trigonometry, HCF, determinants, differential calculus) appear as Stage 03 "Exam-Ready" on `/vedic-maths`. `/curriculum-aligned` was considered and rejected because the old page is a Vedic Maths course, not school-curriculum tuition. ⚠ Chain until fixed. | Old nav dropdown; Wayback; DuckDuckGo index |
| 6 | P1 | `https://thevedicschool.co.in/about.html` | `https://www.thevedicschool.com/about` | **REDIRECT 301** | HIGH | A. Core | The old About covers the school's mission plus a "Meet Your Mentor: Meenakshi Koul" section. The new `/about` ("About Meenakshi Koul \| The Vedic School") serves the same purpose. `/authors/meenakshi-koul` is a blog-author profile, which makes it a weaker match. ⚠ Chain until fixed. | Old nav/footer; Wayback |
| 7 | P1 | `https://thevedicschool.co.in/contact.html` | `https://www.thevedicschool.com/contact` | **REDIRECT 301** | HIGH | E. Contact | Enrolment and enquiry contact page to the new contact/demo-booking page. Same purpose. ⚠ Chain until fixed. | Old nav/footer; Wayback; DuckDuckGo index |
| 8 | P2 | `https://thevedicschool.co.in/summercamp.html` | — _(candidate: `/vedic-maths`, MEDIUM-LOW)_ | **NO DIRECT EQUIVALENT — DECISION REQUIRED** | — | B. Program | A 10-day seasonal "Vedic Summer Camp" signup page. The .com site has no camp or short-course offering. | Old top bar + footer; Wayback; DuckDuckGo index |
| 9 | P2 | `https://thevedicschool.co.in/indian-schools.html` | — _(candidate: `/contact`, LOW)_ | **NO DIRECT EQUIVALENT — DECISION REQUIRED** | — | B. Program (B2B) | A "For Schools" page: "run an integrated Vedic Maths course or summer camp in your school campus". The .com site has no school-partnership offering. | Old "For Schools" nav; Wayback; DuckDuckGo index |
| 10 | P2 | `https://thevedicschool.co.in/global-schools.html` | — _(candidate: `/contact`, LOW)_ | **NO DIRECT EQUIVALENT — DECISION REQUIRED** | — | B. Program (B2B) | Byte-identical to `indian-schools.html` (both are headed "Indian Schools"). Same situation as #9. | Old "For Schools" nav; Wayback |
| 11 | P3 | `https://thevedicschool.co.in/courses.html` | — | **DO NOT REDIRECT** (already 404) | HIGH | J. Dead link | Linked from the old "see all" course link but returns 404 today. The Wayback Machine has no capture of it, so it never had content. _Optional:_ 301 to `/vedic-maths` if a backlink is found in GSC. | Old homepage/about links |
| 12 | P3 | `https://thevedicschool.co.in/blog-single.html` | — | **DO NOT REDIRECT** (already 404) | HIGH | J. Dead link | Target of the old "Blog" link. Returns 404 and has no Wayback capture. It is a leftover template link. _Optional:_ 301 to `/blog` if a backlink is found. | Old homepage link |
| 13 | P3 | `https://thevedicschool.co.in/teacher-single.html` | — | **DO NOT REDIRECT** (already 404) | HIGH | J. Dead link | Target of the old "Our Mentor / Learn more" link. Returns 404 and has no Wayback capture. _Optional:_ 301 to `/about` if a backlink is found. | Old homepage/about links |
| 14 | P3 | `https://thevedicschool.co.in/mail_handler.php` | — | **DO NOT REDIRECT** | HIGH | H. Utility | POST form handler used by the old enquiry forms. Not a page. Decommission after cut-over. | Form `action` on every old page |
| 15 | P3 | `https://thevedicschool.co.in/contact.php` | — | **DO NOT REDIRECT** | HIGH | H. Utility | POST form handler used by the contact, schools and summer camp forms. Not a page. Decommission after cut-over. | Form `action` on contact/schools/summercamp |
| 16 | — | `https://thevedicschool.co.in/robots.txt` | — | **DO NOT REDIRECT** | HIGH | H. Utility | Currently 404, which Google treats as "allow all". It must **not** start disallowing crawling, because Google has to crawl the old URLs to see the 301s. See the agency brief. | Direct request; Wayback |
| 17 | — | `https://thevedicschool.co.in/sitemap.xml` | — | **DO NOT REDIRECT** | HIGH | H. Utility | Currently 404. The old site never had a sitemap. | Direct request; Wayback |
| 18 | P3 | `/images/*`, `/css/*`, `/js/*`, `/plugins/*` (≈20 images incl. `images/logo.png`, `images/teachers/teacher-1.jpg`, `images/testi-*.jpg`; theme CSS/JS) | — | **DO NOT REDIRECT** | HIGH | G. Media / H. Asset | Template assets with no counterpart URLs on .com. Let them return 404 or 410 once the redirects are live. | HTML `src`/`href` attributes; Wayback |

## Review Required

No mapping is ambiguous between two destinations. The following items still need a human decision:

1. **Trailing-slash blocker on .com** (above). This affects rows 3–7. The decision is needed before the agency implements.
2. **Rows 11–13 (dead template URLs).** Default: leave them as 404. Revisit only if Search Console or a backlink tool shows external links to them.
3. **Fallback for any unmapped old URL.** DECISION REQUIRED. Recommended: the old host returns **404 (or 410)** for anything not in the table. Do **not** send unmapped URLs to the homepage, and do **not** use a blanket path-preserving wildcard (`/*.html → .com/*`), because no old slug exists on .com and every such request would end in a .com 404.

## No Direct Equivalent

| Old URL | What it was | Options | Recommendation |
|---|---|---|---|
| `/summercamp.html` | 10-day seasonal Vedic Maths summer camp signup | (a) 301 → `/vedic-maths` (same subject, different format); (b) 410; (c) create a camp page on .com and 301 there | **NO DIRECT EQUIVALENT — DECISION REQUIRED.** If camps are no longer run: **consider 410**. If you want to keep a small amount of signal and accept a looser match: (a). DuckDuckGo shows this page as indexed. |
| `/indian-schools.html` | "Integrated Vedic Maths programme for schools" enquiry (B2B) | (a) 301 → `/contact` (enquiry intent kept, topic lost); (b) 410; (c) build a "For Schools" page on .com | **NO DIRECT EQUIVALENT — DECISION REQUIRED.** If school partnerships are discontinued: **consider 410**. DuckDuckGo shows this page as indexed. |
| `/global-schools.html` | Identical copy of `/indian-schools.html` | Same as above | Same decision as `/indian-schools.html` |

## Potentially Obsolete / 410

Candidates only. **Do not implement until a decision has been made.**

| Old URL | Current state | Why |
|---|---|---|
| `/summercamp.html` | 200 | Seasonal program with no counterpart on .com |
| `/indian-schools.html` | 200 | B2B school program with no counterpart on .com |
| `/global-schools.html` | 200 | Duplicate of the above |
| `/courses.html`, `/blog-single.html`, `/teacher-single.html` | 404 already | Never had content. 404 is already a correct signal. 410 is optional. |
| `/mail_handler.php`, `/contact.php` | 200 (blank) | Form endpoints. Remove them with the old site. |

## Domain Variants

**Current behaviour (VERIFIED 2026-09-23):**

| Variant | Response today | Notes |
|---|---|---|
| `http://thevedicschool.co.in/` | 301 → `https://thevedicschool.co.in/` | Host-level http→https |
| `https://thevedicschool.co.in/` | **200** | Serves the old site |
| `http://www.thevedicschool.co.in/` | 301 → `https://www.thevedicschool.co.in/` | Host-level http→https |
| `https://www.thevedicschool.co.in/` | **200** | Serves the **same** site as the apex. No canonical tags anywhere, so www and apex are duplicates today. |

DNS: apex A → `147.79.69.167`, `93.127.173.2`; `www` CNAME → `www.thevedicschool.co.in.cdn.hstgr.net` (Hostinger CDN). Nameservers `ns1/ns2.dns-parking.com` (Hostinger). MX `mx1/mx2.hostinger.in`. TLS: Let's Encrypt, expires 2026-11-17 on both hosts (presumably auto-renewed by the host; this is INFERRED).

**Required behaviour:** all four variants use the **same** path mapping. Every request goes to the final `https://www.thevedicschool.com/…` URL in **one hop**:

```
http://thevedicschool.co.in/about.html        → 301 → https://www.thevedicschool.com/about
https://thevedicschool.co.in/about.html       → 301 → https://www.thevedicschool.com/about
http://www.thevedicschool.co.in/about.html    → 301 → https://www.thevedicschool.com/about
https://www.thevedicschool.co.in/about.html   → 301 → https://www.thevedicschool.com/about
```

⚠ The old host's existing `http → https (same host)` redirect must **not** run before the .com redirect. If it does, every `http://` request becomes a 2-hop chain. The TLS certificates for both old hosts must also stay valid, or `https://` requests will fail before the 301 can be sent.

**.com side (VERIFIED, for reference):** `https://thevedicschool.com/*` → 301 → `https://www.thevedicschool.com/*`. `http://www.thevedicschool.com/*` → 301 → `https://www.…`. The agency must never target the apex `.com` or `http://`, because that would add hops.

## Testing Checklist

Run these after the agency implements the redirects, and again after the trailing-slash fix. Each line must show **exactly one** `301` followed by a `200` on `https://www.thevedicschool.com/…`.

```bash
for host in http://thevedicschool.co.in https://thevedicschool.co.in http://www.thevedicschool.co.in https://www.thevedicschool.co.in; do for p in / /index.html /about.html /contact.html /course-basic.html /course-intermediate.html /course-advance.html; do echo "== $host$p"; curl -sS -o /dev/null -L --max-redirs 5 -w "hops=%{num_redirects} final=%{url_effective} status=%{http_code}\n" "$host$p"; done; done
```

Pass criteria: `hops=1`, `status=200`, and `final` equals the mapped URL exactly.

To see each hop individually (this catches 302s and intermediate hops):

```bash
curl -sSIL https://thevedicschool.co.in/course-basic.html | grep -iE "^(HTTP|location)"
```

Also test:

| Test URL | Expected |
|---|---|
| `https://thevedicschool.co.in/about.html?utm_source=x` | 1 × 301 → mapped URL (query handling as agreed in the brief) |
| `https://thevedicschool.co.in/about.html/` | 404, or 301 to `/about` if the agency normalises it. Never a loop. |
| `https://thevedicschool.co.in/summercamp.html` | Whatever is decided (301 or 410). **Not** the homepage by default. |
| `https://thevedicschool.co.in/does-not-exist.html` | 404 or 410 (not homepage) |
| `https://thevedicschool.co.in/robots.txt` | 404 or allow-all. Never `Disallow: /`. |
| `https://thevedicschool.co.in/images/logo.png` | 404 or 410 (not redirected to a page) |
