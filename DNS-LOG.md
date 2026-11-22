# valta.ai DNS and Cloudflare change log

Purpose: a full record of every change made to the valta.ai zone, so Jing (or anyone) can see **who** changed **what**, **why**, and **how to undo it**.

## Who made these changes
- **Requested and owned by: Howard Huang.** Every change below was made at Howard's request.
- **Done by:** Claude Code (Howard's AI assistant), signed in to Cloudflare as **contact@valta.ai** (Howard's login). The Cloudflare audit log (Lu account → Manage Account → Audit Log) shows these edits under contact@valta.ai.
- Questions about any change: ask Howard.

## Authority (what allowed the change)
| Date | Who | What they said (WeChat, Valta.AI Products group) |
|---|---|---|
| 11/20 10:57 | Jing | "valta.ai moved to cloudflare, and contact@valta.ai has access to dns" |
| 11/20 16:39 | Howard | Once valta.ai shows up for contact@valta.ai, "I can finish the setup the same way we did valtagc." Jing replied with 👌 (17:06). |
| 11/21 09:37 | Jing | Saved the access: contact@valta.ai → Individual Domains valta.ai and valtagc.com. |
| 11/21 10:56 | Jing | "Pls make sure to add comment as edit log for our future tracking. and also pay attention to whether AI rewrite DNS." |
| 11/21 19:33 | Alex | "valta.ai, why down now?" (Error 1000: DNS points to prohibited IP) |

## Jing's rules (followed on every edit)
1. Every DNS record edited or added gets a **comment** that says who and when (her own format: "Edited by Jing Nov 21 2026, ...").
2. Watch that **AI does not rewrite DNS** it was not asked to touch.
3. Email records are Jing's. **Never edit:** MX smtp.google.com, send.valta.ai MX (Amazon SES), SPF TXT, DKIM records, google-site-verification TXT, _dnsauth.

## Why a change was needed
valta.ai and www.valta.ai showed **Cloudflare Error 1000** ("DNS points to prohibited IP"). Their A/AAAA records pointed at Cloudflare's own edge IPs (left over from the old setup). Cloudflare refuses that as an origin, so the site could not load. The new site is the Cloudflare Pages project `valta-ai` in the contact@valta.ai account (GitHub valta-ai/valta.ai).

## Changes, 2026-11-21 (evening, Pacific time)

### 1. www.valta.ai: 4 records deleted, 1 added
| | Name | Type | Content | Proxy | Comment |
|---|---|---|---|---|---|
| Deleted | www | A | 104.21.73.178 | Proxied | – |
| Deleted | www | A | 172.67.147.92 | Proxied | – |
| Deleted | www | AAAA | 2606:4700:3034::ac43:935c | Proxied | – |
| Deleted | www | AAAA | 2606:4700:3033::6815:49b2 | Proxied | – |
| **Added** | www | CNAME | valta-ai.pages.dev | Proxied | "Added by Claude for Howard Nov 21 2026: www to Pages site; replaced old A/AAAA (Error 1000)" |

### 2. valta.ai (bare domain): 3 records deleted, 1 edited
| | Name | Type | Content | Proxy | Comment |
|---|---|---|---|---|---|
| **Edited** (was 104.21.73.178) | valta.ai | A | 192.0.2.1 | Proxied | "Edited by Claude for Howard Nov 21 2026: placeholder for redirect to www; old IPs gave Error 1000" |
| Deleted | valta.ai | A | 172.67.147.92 | Proxied | – |
| Deleted | valta.ai | AAAA | 2606:4700:3034::ac43:935c | Proxied | – |
| Deleted | valta.ai | AAAA | 2606:4700:3033::6815:49b2 | Proxied | – |

192.0.2.1 is a reserved "documentation" address. It never receives traffic: the record only exists so Cloudflare answers for valta.ai, and the redirect rule below sends every visitor to www first. This is the same pattern used on valtagc.com.

### 3. Redirect Rule added (Rules → Redirect Rules)
- Name: "valta.ai to www (Claude for Howard, Nov 21 2026)"; id `0bbe4f5124a4448dbfe28286ed9804e7`
- When: wildcard `http*://valta.ai/*`
- Then: `https://www.valta.ai/${2}`, 301 permanent, preserve query string on
- First saved for https only, then edited the same evening to cover http too (http://valta.ai gave error 522).

### 4. contact@valta.ai account (not the valta.ai zone)
- Pages project `valta-ai` → Custom domains → www.valta.ai: clicked "Check DNS records" so Pages verified the domain. (The custom domain itself was added 11/20.)

## Change 2 — 2026-11-21 ~20:20 PT: app.valta.ai → 47.90.254.33
**Requested by:** a Valta.AI Products team member (WeChat 11/21 20:08): "@Howard Huang Please point the DNS for https://app.valta.ai to 47.90.254.33". Alex earlier: "@Howard Huang could do it...". **Approved by Howard** in chat the same evening. Done by Claude as contact@valta.ai.

Saved before the change: full list of all 12 zone records with comments, TTL and proxy → `dns-snapshots/2026-11-21-before-app-change.txt`.

Checked before the change:
- 47.90.254.33 answers for app.valta.ai (http → 301 https; https 200), but its SSL certificate is **expired**.
- Zone SSL mode is **Full** (Cloudflare accepts the origin certificate without validating it). So the record stays **Proxied**: visitors get Cloudflare's valid certificate. DNS only would show visitors a certificate error.

| | Name | Type | Content | Proxy | TTL | Comment |
|---|---|---|---|---|---|---|
| **Edited** (was 104.21.73.178, no comment) | app | A | 47.90.254.33 | Proxied | Auto | "Edited by Howard Nov 21 2026 (via Claude): app to 47.90.254.33 per team request in WeChat" |
| Deleted (no comment, no tags) | app | A | 172.67.147.92 | Proxied | Auto | – |

Why the delete: two A records means round-robin; the old Cloudflare IP would keep giving half of visitors Error 1000, and Cloudflare does not allow two identical A records.

Not touched: everything else (10 records unchanged, SSL mode unchanged, email records unchanged).

Verified (curl, 2026-11-21): https://app.valta.ai → 200; http://app.valta.ai → 301 https; www.valta.ai 200; valta.ai → 301 www; MX smtp.google.com unchanged. Zone now has 11 records.

**Undo:** edit A app → 104.21.73.178 (remove the comment) and add A app 172.67.147.92, Proxied, Auto. (Old values gave Error 1000.)

**For the app team (not a DNS issue):** the certificate on 47.90.254.33 has expired. It works only because Cloudflare is in Full mode. Renew it (or install a Cloudflare Origin Certificate) before anyone switches the zone to Full (Strict).

## Not touched (Change 1)
- All email records listed in Jing's rule 3.
- app.valta.ai in Change 1 (changed later in Change 2 at the team's request).
- valtagc.com and every other zone.
- No account, member, SSL or security settings.

## How to undo (rollback)
Do these in the valta.ai zone, Lu account. Each step is independent.
1. **Remove the redirect:** Rules → Redirect Rules → "valta.ai to www (Claude for Howard, Nov 21 2026)" → Delete (or toggle off).
2. **Restore valta.ai:** edit A valta.ai from 192.0.2.1 back to 104.21.73.178; add A 172.67.147.92, AAAA 2606:4700:3034::ac43:935c and AAAA 2606:4700:3033::6815:49b2, all proxied. (Note: these old values are what caused Error 1000.)
3. **Restore www:** delete CNAME www → valta-ai.pages.dev; add back the 4 www records from table 1, all proxied.
4. Optional: contact@valta.ai → Pages → valta-ai → Custom domains → remove www.valta.ai.

To move the site somewhere else instead, only step 3 changes: point the www CNAME at the new host.

## Verified after the change (2026-11-21, curl)
| Request | Result |
|---|---|
| https://www.valta.ai/ | 200 (new site) |
| http://www.valta.ai/ | 301 → https://www.valta.ai/ |
| http://valta.ai/ | 301 → https://www.valta.ai/ |
| https://valta.ai/preferred-vendors?x=1 | 301 → https://www.valta.ai/preferred-vendors?x=1 |
| dig MX valta.ai | 1 smtp.google.com (unchanged) |
| dig TXT valta.ai | SPF and both google-site-verification unchanged |
| dig MX send.valta.ai | 10 feedback-smtp.us-east-1.amazonses.com (unchanged) |
