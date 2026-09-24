# The Vedic School .co.in → .com Domain Migration
## Technical Redirect Requirements for Existing Website Agency

> **Status: DRAFT.** Please do not start implementation until The Vedic School confirms the final destination URLs (see §6.1). Please send questions and confirmations to The Vedic School before you change any live configuration.

---

## 1. Background

The Vedic School has moved its website from `thevedicschool.co.in` to a new site at `https://www.thevedicschool.com`. Your agency currently manages the old .co.in website. The new site is managed separately and is hosted on Netlify.

We have **no backend access** to the old site. Everything below comes from publicly visible behaviour. Our observations (2026-09-23) suggest the old site is a static HTML site on **Hostinger**, using the Hostinger CDN (`hcdn`) and PHP form handlers. Please correct anything that is wrong.

## 2. Objective

Permanently move all search and user traffic from each old .co.in page to its **equivalent** page on the new .com site in **one** permanent server-side redirect. This keeps rankings and links working and avoids errors, irrelevant redirects and redirect chains.

## 3. Domains

| | |
|---|---|
| **Old domain** | `thevedicschool.co.in` (apex and `www`, over both HTTP and HTTPS) |
| **New domain** | `thevedicschool.com` |
| **Canonical domain (every redirect target)** | `https://www.thevedicschool.com` (HTTPS, with `www`) |

## 4. Redirect Type

- Use a **permanent, server-side HTTP `301`** redirect.
- **Do not use:** JavaScript redirects, `<meta http-equiv="refresh">`, temporary `302`/`307` redirects, iframes or framing, or any other client-side method.
- Implement the redirects at the web-server or CDN level. On Hostinger this is usually `.htaccess` (LiteSpeed/Apache rewrite rules) or the hPanel redirect tool. **If you use the hPanel redirect tool, please confirm it issues a `301`, not a `302`, and that it supports per-path rules.**

## 5. Domain Variants to Cover

All four variants must follow the **same** path mapping:

- `http://thevedicschool.co.in`
- `https://thevedicschool.co.in`
- `http://www.thevedicschool.co.in`
- `https://www.thevedicschool.co.in`

### 5.1 HTTPS requirements
- Keep a **valid TLS certificate** for both `thevedicschool.co.in` and `www.thevedicschool.co.in` for as long as the redirects are live. The current Let's Encrypt certificate expires 2026-11-17, so please confirm it auto-renews. Without a valid certificate, `https://` visitors and Googlebot get an error instead of the 301.
- The redirect **target** must always be `https://` (never `http://`).

### 5.2 www / non-www requirements
- The redirect **target** must always use `www.thevedicschool.com`. Never target the apex `thevedicschool.com`: it redirects to `www`, which would add a hop.
- Today both the `www` and apex old hosts serve the full site (duplicate content). After the change, **neither** may serve old-site content.

## 6. Exact URL Mapping Requirements

Map each old path to its exact new URL. **Do not send every old page to the homepage.** A blanket rule such as "everything → homepage" or "`/*` → `https://www.thevedicschool.com/*`" is **not acceptable**. The old and new URL structures are different (`.html` pages vs. extensionless paths), so a path-preserving wildcard would send users to 404 pages.

### 6.1 ⚠ Final target form to be confirmed

The table below uses the new site's canonical URLs (no trailing slash). The Vedic School is fixing a trailing-slash behaviour on the new site. **Before you implement, we will confirm in writing whether targets end in `/` or not.** The paths themselves will not change.

### 6.2 Redirect mapping (applies to all four host variants)

| # | Old path | Redirect to (301) |
|---|---|---|
| 1 | `/` | `https://www.thevedicschool.com/` |
| 2 | `/index.html` | `https://www.thevedicschool.com/` |
| 3 | `/about.html` | `https://www.thevedicschool.com/about` |
| 4 | `/contact.html` | `https://www.thevedicschool.com/contact` |
| 5 | `/course-basic.html` | `https://www.thevedicschool.com/vedic-maths` |
| 6 | `/course-intermediate.html` | `https://www.thevedicschool.com/vedic-maths` |
| 7 | `/course-advance.html` | `https://www.thevedicschool.com/vedic-maths` |

### 6.3 Pending decision (do **not** implement until confirmed)

| Old path | Status |
|---|---|
| `/summercamp.html` | Awaiting decision: 301 to a specific page **or** 410 Gone |
| `/indian-schools.html` | Awaiting decision: 301 to a specific page **or** 410 Gone |
| `/global-schools.html` | Awaiting decision: 301 to a specific page **or** 410 Gone |

Until we confirm, **leave these pages as they are** (still serving 200). Do not send them to the homepage.

### 6.4 Do not redirect

| Old path | Required handling |
|---|---|
| `/courses.html`, `/blog-single.html`, `/teacher-single.html` | Already 404. Leave as 404 unless we tell you otherwise. |
| `/mail_handler.php`, `/contact.php` | Form handlers. Remove or disable them when the site is retired. Do not redirect. |
| `/images/*`, `/css/*`, `/js/*`, `/plugins/*` and other static assets | Do not redirect to pages. 404 or 410 is fine. |
| `/robots.txt` | See §12 |
| `/sitemap.xml` | See §11 |

### 6.5 Existing URL preservation
If your records show **any other** public URL on the old site (past pages, landing pages, campaign pages, PDFs), please send it to us **before** implementation so we can map it. **Do not guess a destination.**

## 7. No Redirect Chains

Each old URL must go to its final `https://www.thevedicschool.com/...` URL in **one** hop.

✅ `http://thevedicschool.co.in/about.html → 301 → https://www.thevedicschool.com/about → 200`

❌ `http://thevedicschool.co.in/about.html → 301 → https://thevedicschool.co.in/about.html → 301 → https://www.thevedicschool.com/about`
_(The existing http→https-on-same-host redirect must not run first. If it comes from a hosting/CDN "Force HTTPS" setting rather than `.htaccess`, it may run before your rules. Please check this and adjust.)_

❌ `…co.in/about.html → 301 → https://thevedicschool.com/about → 301 → https://www.thevedicschool.com/about`

❌ Any `302`, `307` or `meta refresh` anywhere in the path.

## 8. Query Parameter Handling

- The old site is static and uses no meaningful query parameters.
- **Default: drop query strings** on redirect so that duplicate URLs are not created.
- **Exception:** you may preserve `utm_*` campaign parameters **only if** we ask for this. Please tell us whether your implementation can do this selectively.
- Trailing-slash and case variants of old paths (for example `/about.html/`) should either 404 or 301 to the same mapped target. They must **never** loop.

## 9. 404 / 410 Handling

- Any old URL **not** listed in §6.2 or confirmed later must return **404** (or **410** where we confirm the page is permanently gone).
- **Do not** redirect unmapped URLs to the homepage. Google treats that as a "soft 404", and it confuses users.
- Mapped URLs must **never** return 404.

## 10. Canonical Requirements

- Once redirects are live, no old page should be served, so no `rel=canonical` is needed on the old domain.
- **Do not** set up any interim state where old pages keep serving 200 with a canonical pointing to .com **instead of** redirecting. We need real 301s.

## 11. Sitemap Handling

- The old site has no sitemap (`/sitemap.xml` returns 404). **Do not create one** that lists old URLs.
- Do not redirect the old `/sitemap.xml` to the new sitemap. The Vedic School will submit the new sitemap (`https://www.thevedicschool.com/sitemap.xml`) in Google Search Console.

## 12. robots.txt Handling

- The old site has no robots.txt (404, which Google treats as "allow all").
- **Critical:** do **not** add `Disallow: /` or any other rule that blocks crawling of the old domain. Google has to crawl the old URLs to discover and process the 301s.
- Acceptable options: leave it as 404, **or** serve a plain `User-agent: *` / `Allow: /` file.

## 13. Google Search Console Coordination

- Please tell us whether the old domain is verified in any Google Search Console account, and who owns that account (see §17).
- If you verify it on our behalf, please verify it as a **Domain property** (DNS TXT record) and add The Vedic School's Google account as an **Owner**.
- **Do not** submit a Change of Address yourselves. The Vedic School will do this after the redirects are verified.

## 14. DNS & Email Caution

- The old domain currently has **MX records on Hostinger mail** (`mx1/mx2.hostinger.in`) and an SPF record. If any `@thevedicschool.co.in` mailbox is in use, **any DNS change must keep MX, SPF and other mail records intact.** Please confirm with us before changing nameservers or DNS.
- Do not change DNS for `thevedicschool.com`. That domain is not in scope for your agency.

## 15. Testing Requirements

Before telling us the work is complete, please test **every mapped URL on all four host variants** (7 paths × 4 variants = 28 checks), plus:

- homepage (`/` and `/index.html`)
- trailing-slash variants of mapped paths (`/about.html/`)
- one unmapped URL (must be 404/410, not homepage)
- a mapped URL with a query string

For every mapped URL the expected result is:

```
HTTP 301  →  Location: <exact target from §6.2>  →  target returns HTTP 200
```

These results are failures:
- `301 → 301 → 200` (chain)
- any `302` / `307`
- `404` for a mapped URL
- redirect loop
- redirect to the homepage for a non-homepage path (unless mapped that way)

Example command:

```bash
curl -sSIL http://www.thevedicschool.co.in/course-basic.html | grep -iE "^(HTTP|location)"
```

Please send the output (or an equivalent spreadsheet) as the **redirect test report**.

## 16. Retention Period

- Keep the redirects active for **at least 12 months**, and **preferably indefinitely**.
- This requires the **domain registration**, **DNS** and the **redirecting host (with valid TLS)** to stay active. Please note the domain's current registry expiry date is **2027-04-27**. Please confirm who is responsible for renewing it.
- Please tell us before cancelling any hosting plan, DNS zone or certificate linked to `thevedicschool.co.in`.

## 17. What We Need From You

Please reply with:

1. **Complete existing URL inventory**: every public URL on the old site, including any not linked from the navigation.
2. **Current sitemap**, or confirmation that none exists.
3. **Confirmation of registrar.** Public WHOIS shows *Hosting Concepts B.V. dba Openprovider*. Which account is it registered under, and who holds the login?
4. **Confirmation of DNS provider.** The nameservers are `ns1/ns2.dns-parking.com` (Hostinger). Who has access?
5. **Confirmation of hosting provider.** Is it Hostinger, and whose account and plan?
6. **Confirmation of server/platform.** Is it a static HTML upload? Which web server (LiteSpeed/Apache)? Is `.htaccess` supported?
7. **Redirect implementation method.** `.htaccess`, hPanel redirects, CDN rules or something else. Please confirm it produces a single-hop 301 on all four variants.
8. **Final redirect mapping.** Please confirm back to us exactly what you implemented, as a table.
9. **Test results** (per §15).
10. **Written confirmation that the redirects will remain active** for at least 12 months, plus who is responsible for domain renewal, DNS, hosting and TLS during that time.

Also please tell us:
- Whether any `@thevedicschool.co.in` email addresses are in use.
- Whether the old domain is in Google Search Console or Google Analytics, and under which account.
- Whether the domain can be transferred into The Vedic School's own registrar account, and what that involves.

## 18. Agency Access Checklist

| Question | Agency answer |
|---|---|
| [ ] Who controls the .co.in **registrar** account? | |
| [ ] Who controls .co.in **DNS**? | |
| [ ] Who controls .co.in **hosting**? | |
| [ ] What server/platform hosts the old site? | |
| [ ] Can the agency implement **server-side 301** redirects? | |
| [ ] Can you provide the **old sitemap**? | |
| [ ] Can you provide the **complete old URL list**? | |
| [ ] Can you export current CMS URLs (if a CMS exists)? | |
| [ ] Can you provide **Google Search Console** access for the old domain? | |
| [ ] Can you provide existing **analytics/search data**, if available? | |
| [ ] Can you **maintain redirects for at least 12 months**? | |
| [ ] Can you provide a **redirect test report**? | |
| [ ] Are any **@thevedicschool.co.in email** accounts in use? | |
| [ ] Who renews the domain before **2027-04-27**? | |

## 19. Delivery Checklist

- [ ] Final target form (trailing slash or not) received from The Vedic School
- [ ] Decisions on `/summercamp.html`, `/indian-schools.html`, `/global-schools.html` received
- [ ] 301 rules implemented for all paths in §6.2
- [ ] All four host variants covered, single hop, HTTPS targets on `www.thevedicschool.com`
- [ ] Unmapped URLs return 404/410 (not homepage)
- [ ] robots.txt does not block crawling
- [ ] TLS valid on both old hosts, and auto-renewal confirmed
- [ ] MX/SPF records unchanged (if email is in use)
- [ ] Test report delivered
- [ ] Access/ownership answers (§17–18) delivered
- [ ] Retention commitment confirmed in writing

---

### Appendix: illustrative `.htaccess` (for reference only — agency to adapt and test)

This assumes Apache/LiteSpeed with `mod_rewrite` and **no trailing slash** on targets (see §6.1). The trailing `?` drops the query string. The rules must come **before** any existing http→https rule.

```apache
RewriteEngine On
# Only act on the old domain (apex and www, http and https)
RewriteCond %{HTTP_HOST} ^(www\.)?thevedicschool\.co\.in$ [NC]
RewriteRule ^(index\.html)?$            https://www.thevedicschool.com/?            [R=301,L]
RewriteCond %{HTTP_HOST} ^(www\.)?thevedicschool\.co\.in$ [NC]
RewriteRule ^about\.html$                https://www.thevedicschool.com/about?       [R=301,L]
RewriteCond %{HTTP_HOST} ^(www\.)?thevedicschool\.co\.in$ [NC]
RewriteRule ^contact\.html$              https://www.thevedicschool.com/contact?     [R=301,L]
RewriteCond %{HTTP_HOST} ^(www\.)?thevedicschool\.co\.in$ [NC]
RewriteRule ^course-(basic|intermediate|advance)\.html$ https://www.thevedicschool.com/vedic-maths? [R=301,L]
# Pending decision rows (summercamp / schools) intentionally NOT included.
# Unmapped URLs fall through to the normal 404 handler.
```
