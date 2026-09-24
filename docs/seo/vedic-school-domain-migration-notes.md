# The Vedic School .co.in → .com Migration: Audit Notes

> Audit date: 2026-09-23. This is analysis and documentation only. No code, DNS, Netlify, GSC, Supabase or old-site configuration was changed.
> Labels: **VERIFIED** = observed directly during this audit. **INFERRED** = reasoned from evidence but not confirmed. **UNKNOWN** = could not be determined without access we do not have.

## 1. Sources Consulted

| Source | What it gave us |
|---|---|
| Local repo `vedic-school` (`main` @ `e6f0346`, remote `git@github.com:misrisharang/vedic-school.git`) | Routes (`artifacts/vedic-school/src/App.tsx`), `netlify.toml`, `public/_redirects`, `public/sitemap.xml`, `public/robots.txt`, edge function `netlify/edge-functions/blog-slug-validator.ts`, prerender script, page components |
| Live `https://www.thevedicschool.com` | Status codes, redirects, canonicals, titles, live `sitemap.xml`, `robots.txt` (curl) |
| Live `thevedicschool.co.in`, all 4 variants | Status codes, headers, HTML, links, forms (curl) |
| Recursive crawl of old-site internal links | Full old-site page set |
| Probes of common paths (`/robots.txt`, `/sitemap.xml`, `/sitemap_index.xml`, `/wp-sitemap.xml`, `/blog`, `/courses.html`, template defaults such as `teacher.html`/`events.html`, extensionless and trailing-slash variants) | Confirmed nothing else responds |
| Internet Archive CDX API (`matchType=domain`) plus archived homepage snapshots (2024-03-07, 2024-07-22) | Historical URL list. Confirmed the structure has not changed since at least March 2024. |
| DuckDuckGo `site:thevedicschool.co.in` | Publicly indexed old URLs |
| Bing `site:` query | Returned no parseable results (probably blocked by bot protection). Not used. |
| Google `site:` query | **Not accessible** from this environment. Not used. |
| DNS (`dig`), WHOIS, TLS certificate | Registrar, nameservers, MX/SPF, hosting IPs, cert expiry |

## 2. Old Site Accessibility

- **VERIFIED:** the old site is publicly reachable. The apex and `www` hosts both return **200** over HTTPS with byte-identical HTML. HTTP on each host 301s to HTTPS on the **same** host.
- **VERIFIED:** it is a static HTML theme (Bootstrap/jQuery "Educenter"-style template) with no `<link rel=canonical>`, no meta description, and `<title>The Vedic School</title>` on every page. Headers `platform: hostinger`, `panel: hpanel`, `server: hcdn`. All HTML `last-modified` dates fall on **2025-05-31**.
- **VERIFIED:** no `robots.txt` (404) and no sitemap at any common path (404).
- **VERIFIED:** no analytics or tag-manager code and no `google-site-verification` meta tag in the old site's own HTML. (The Google Analytics code seen on 404 responses belongs to Hostinger's default error page, not to the site.)
- **VERIFIED:** DNS apex TXT contains only SPF (`include:_spf.mail.hostinger.com`). There is no Google verification TXT at the apex.

### 2.1 Complete old URL inventory

| Old path | Live status | Category | Discovery source(s) |
|---|---|---|---|
| `/` | 200 | A. Core | Live; Wayback; DuckDuckGo |
| `/index.html` | 200 (same as `/`) | I. Duplicate | Nav/footer links; Wayback |
| `/about.html` | 200 | A. Core | Nav/footer; Wayback |
| `/contact.html` | 200 | E. Contact | Nav/footer; Wayback; DuckDuckGo |
| `/course-basic.html` | 200 | B. Course | Nav dropdown; Wayback; DuckDuckGo |
| `/course-intermediate.html` | 200 | B. Course | Nav dropdown; Wayback |
| `/course-advance.html` | 200 | B. Course | Nav dropdown; Wayback; DuckDuckGo |
| `/summercamp.html` | 200 | B. Program | Top bar/footer; Wayback; DuckDuckGo |
| `/indian-schools.html` | 200 | B. Program (B2B) | "For Schools" nav; Wayback; DuckDuckGo |
| `/global-schools.html` | 200 (identical to indian-schools) | B. Program (B2B) | "For Schools" nav; Wayback |
| `/courses.html` | **404** | J. Dead link | Homepage/about "see all" link |
| `/blog-single.html` | **404** | J. Dead link | Homepage "Blog" link |
| `/teacher-single.html` | **404** | J. Dead link | Homepage/about "Our Mentor" link |
| `/mail_handler.php` | 200 (empty body) | H. Utility | Form `action` |
| `/contact.php` | 200 (empty body) | H. Utility | Form `action` |
| `/robots.txt` | 404 | H. Utility | Probe; Wayback |
| `/sitemap.xml` | 404 | H. Utility | Probe; Wayback |
| `/images/*`, `/css/*`, `/js/*`, `/plugins/*` | 200 | G/H. Media and assets | HTML src/href; Wayback (39 asset captures) |

Wayback also lists bot probes (`/.well-known/*`, `/ads.txt`, `/app-ads.txt`), all 404. These are crawler noise, not site URLs, and are excluded from the counts.

## 3. New Site Routes (VERIFIED)

| URL (canonical, per sitemap and `<link rel=canonical>`) | Source | Live behaviour |
|---|---|---|
| `/` | App.tsx, sitemap | 200 |
| `/vedic-maths` | App.tsx, sitemap | **301 → `/vedic-maths/`** → 200 |
| `/curriculum-aligned` | App.tsx, sitemap | 301 → `/…/` → 200 |
| `/about` | App.tsx, sitemap | 301 → `/about/` → 200 |
| `/contact` | App.tsx, sitemap | 301 → `/contact/` → 200 |
| `/blog` | App.tsx, sitemap | 301 → `/blog/` → 200 |
| `/blog/vedic-maths-vs-abacus` | sitemap | 301 → `/…/` → 200 |
| `/blog/is-vedic-maths-useful` | sitemap | 301 → `/…/` → 200 |
| `/blog/best-vedic-maths-online-classes-for-kids` | sitemap | 301 → `/…/` → 200 |
| `/blog/does-vedic-maths-actually-help` | **live sitemap only** | 301 → `/…/` → 200 |
| `/authors/meenakshi-koul` | App.tsx (`/authors/:slug`), sitemap | 301 → `/…/` → 200 |
| `/privacy-policy`, `/terms-of-service`, `/cookie-policy` | App.tsx, sitemap | 301 → `/…/` → 200 |
| `/admin`, `/admin/*` | App.tsx | Private. `Disallow` in robots.txt. Out of scope. |

Existing redirects (`netlify.toml`): `the-vedic-school.netlify.app/*` → www (301), apex `.com` → www (301), `/sitemap` and `/sitemap_index.xml` → `/sitemap.xml` (301), catch-all 404. **VERIFIED: there is no .co.in or legacy-URL handling on the .com site.** (Requests for `.co.in` paths such as `/about.html` on .com return 404.)

Blog posts come from Supabase. The `blog-slug-validator` edge function returns 404 for unpublished or unknown slugs. The live sitemap has **14** URLs, while the committed `public/sitemap.xml` has **13** (it is missing `/blog/does-vedic-maths-actually-help`). **INFERRED:** the live sitemap is regenerated at build time (`scripts/generate-discovery-files.mjs`), so the committed file is stale. This does not affect the migration.

## 4. Key Findings

1. **VERIFIED: the old site never had a blog, articles, author pages, tags, categories, pagination or legal pages.** The blog link and blog teaser are unedited template leftovers. No old URLs map to `/blog/*`, `/authors/*`, `/privacy-policy`, `/terms-of-service`, `/cookie-policy` or `/curriculum-aligned`.
2. **VERIFIED: the old course content lives on `/vedic-maths`.** The three stage lists on `/vedic-maths` (Starting Out / Building Speed / Exam-Ready) closely match the old Basic / Intermediate / Advance topic lists. This supports HIGH-confidence mappings of all three course pages to `/vedic-maths`.
3. **VERIFIED: path structures are incompatible.** Old pages end in `.html` and new pages have no extension. No old slug exists on .com. A blanket path-preserving wildcard would produce 404s, so explicit mappings are required.
4. **VERIFIED, pre-existing .com issue: trailing-slash redirect vs. canonical conflict.** Canonical and sitemap URLs have no trailing slash but 301 to trailing-slash URLs, and those pages canonicalise back to the no-slash form. **INFERRED cause:** `scripts/prerender.mjs` writes `route/index.html`, and Netlify redirects directory requests to add the slash. This turns every non-homepage .co.in redirect into a 2-hop chain. It has to be resolved on the .com side before the agency implements.
5. **VERIFIED: www and apex old hosts both serve 200 today.** They are duplicates with no canonical.

## 5. Assumptions (all INFERRED, stated explicitly)

- The hosting is Hostinger shared or CDN hosting that supports `.htaccess`. This is based on headers, the CDN hostname, the nameservers and MX records.
- Openprovider (the registrar of record) is used by Hostinger as its registrar backend, so the domain was **probably** bought through a Hostinger account. **This is not confirmed.** Registrar control may not sit with the agency.
- The Let's Encrypt certificate (expires 2026-11-17) is auto-renewed by Hostinger.
- The DuckDuckGo index approximates what Google has indexed. Google's actual index is **UNKNOWN**.
- "Priority" is based on each page's role on the site, **not** on measured traffic or backlinks.

## 6. Limitations

- There is no backend, CMS, hosting, DNS or registrar access, so server-side files, orphan pages not linked anywhere, and past URLs that never reached the Wayback Machine may be missing.
- No Google Search Console or Analytics data exists for the old domain in anything we can access. Traffic and backlinks are **UNKNOWN**.
- Google `site:` results could not be retrieved. Bing results were not parseable.
- There is no backlink data (Ahrefs/Semrush/GSC Links), so we cannot tell whether dead URLs (`courses.html` and others) have external links.
- Content similarity was judged by comparing old HTML text with the new page components and live pages. It was not measured automatically.

## 7. Unresolved Questions

| # | Question | Owner |
|---|---|---|
| 1 | Should the .com site serve canonical URLs without a trailing slash as a direct 200, or switch canonicals and sitemap to trailing slash? | The Vedic School (dev) |
| 2 | Summer camp: is it discontinued (→ 410), or should it 301 to `/vedic-maths`? Or should a camp page be built? | The Vedic School |
| 3 | School partnerships (`indian-schools` / `global-schools`): discontinued (→ 410), 301 to `/contact`, or build a "For Schools" page? | The Vedic School |
| 4 | Who controls the registrar account, DNS and hosting for `.co.in`? Who renews before **2027-04-27**? | Agency |
| 5 | Is any `@thevedicschool.co.in` mailbox in use? MX points to Hostinger mail. | Agency / The Vedic School |
| 6 | Is `.co.in` verified in any GSC account, and whose? | Agency |
| 7 | Are there old URLs not publicly discoverable (ad landing pages, PDFs, QR-code targets, print materials)? | Agency / The Vedic School |
| 8 | Should `utm_*` parameters be preserved through redirects? | The Vedic School |

## 8. Pages Requiring Human Review

- `/summercamp.html`: NO DIRECT EQUIVALENT, DECISION REQUIRED (indexed on DuckDuckGo)
- `/indian-schools.html`: NO DIRECT EQUIVALENT, DECISION REQUIRED (indexed on DuckDuckGo)
- `/global-schools.html`: NO DIRECT EQUIVALENT, DECISION REQUIRED (duplicate of the above)
- `/courses.html`, `/blog-single.html`, `/teacher-single.html`: default is to leave as 404; revisit if backlinks appear

## 9. Could Not Be Verified (needs backend or account access)

| Item | System | Status |
|---|---|---|
| Who owns and can log in to the registrar account | DOMAIN REGISTRAR (Openprovider, per WHOIS) | UNKNOWN |
| Who manages DNS | DNS (Hostinger `dns-parking.com` nameservers) | UNKNOWN (provider is VERIFIED, account owner is not) |
| Hosting account owner, plan and renewal | HOSTING (Hostinger, per headers) | UNKNOWN |
| Web server type and `.htaccess` support | HOSTING / server config | INFERRED |
| Unlinked files on the server | WEBSITE / file system | UNKNOWN |
| Whether "Force HTTPS" is a panel setting (which could pre-empt `.htaccess` rules and cause a chain) | HOSTING / CDN | UNKNOWN |
| GSC verification and ownership for `.co.in` | GOOGLE SEARCH CONSOLE | UNKNOWN (no meta or DNS-TXT verification found, but an HTML-file or other method could exist) |
| Historical traffic, queries, backlinks | GSC / Analytics | UNKNOWN (no analytics tag on the old site) |
| Email use on `.co.in` | DNS / Hostinger Mail | UNKNOWN (MX exists) |

## 10. Post-Implementation Steps (for The Vedic School, after the agency's work is live and verified)

The migration is **not complete** until all of these are done:

1. Fix the trailing-slash issue on .com **first**, and confirm the target form to the agency.
2. After the agency implements, re-run the test commands in the redirect map (all 4 variants × mapped paths: `hops=1`, final status 200).
3. Verify ownership of the old `.co.in` property in GSC (Domain property via DNS TXT, which needs DNS access, or URL-prefix via file/meta while the old host still serves). Confirm the `.com` property is verified (a `google697e33484b225252.html` verification file exists on .com).
4. Use URL Inspection on a few old URLs to confirm Google sees the 301 to the correct .com URL.
5. Submit **Change of Address** from the `.co.in` property to `https://www.thevedicschool.com`. This requires the homepage 301 to be live. **Do not do this before the redirects are verified.**
6. Submit or re-verify `https://www.thevedicschool.com/sitemap.xml` in the .com property.
7. Monitor the Page indexing report ("Page with redirect", "Not found", "Alternate page with proper canonical"), crawl errors and Performance for both properties for at least 3–6 months.
8. Update external profiles that still link to `.co.in` (Instagram, YouTube, Google Business Profile, directories) to point directly at `.com`.
9. Keep the `.co.in` domain, DNS, hosting/redirect service and TLS alive and renewed (registry expiry **2027-04-27**) for at least 12 months, and preferably permanently.

## 11. Working Tree Note

Before this audit, the repo working tree already had **12 modified, uncommitted files** (prerender script, several pages, `schema.ts`, `published-articles.ts`, and others). This audit **did not touch them**. The only change made is the new untracked `docs/seo/` folder with these three documents. Nothing was committed, pushed or deployed.
