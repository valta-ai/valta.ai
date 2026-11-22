# valta.ai DNS change log

Zone valta.ai sits in Lu.donglin@gmail.com's Cloudflare account; contact@valta.ai has Domain Administrator access to this zone only (Jing, 2026-11-21).
Jing's rule (WeChat, 2026-11-21): every DNS edit gets a comment as an edit log, and watch that AI never rewrites DNS records it was not asked to touch.
Email records (MX smtp.google.com, send.valta.ai MX, SPF, google/resend DKIM, google-site-verification, _dnsauth) are Jing's: never edit them.

## Before 2026-11-21 (Claude) — records that caused "Error 1000: DNS points to prohibited IP"
| Name | Type | Content | Proxy |
|---|---|---|---|
| valta.ai | A | 104.21.73.178 | Proxied |
| valta.ai | A | 172.67.147.92 | Proxied |
| valta.ai | AAAA | 2606:4700:3034::ac43:935c | Proxied |
| valta.ai | AAAA | 2606:4700:3033::6815:49b2 | Proxied |
| www.valta.ai | A | 104.21.73.178 | Proxied |
| www.valta.ai | A | 172.67.147.92 | Proxied |
| www.valta.ai | AAAA | 2606:4700:3034::ac43:935c | Proxied |
| www.valta.ai | AAAA | 2606:4700:3033::6815:49b2 | Proxied |
| app.valta.ai | A | 104.21.73.178 / 172.67.147.92 | Proxied (not touched) |

These are Cloudflare's own edge IPs (left over from the old setup), which Cloudflare refuses as an origin.

## Change 2026-11-21 (Claude, for Howard)
Every record and rule below carries a comment naming Claude, Howard and the date.
- Deleted the 4 www A/AAAA records above. Added `www` CNAME `valta-ai.pages.dev`, proxied. Comment: "Added by Claude for Howard Nov 21 2026: www to Pages site; replaced old A/AAAA (Error 1000)".
- Deleted apex A 172.67.147.92 and both apex AAAA. Edited apex A to `192.0.2.1`, proxied (placeholder only; the redirect rule answers first). Comment: "Edited by Claude for Howard Nov 21 2026: placeholder for redirect to www; old IPs gave Error 1000".
- Redirect Rule "valta.ai to www (Claude for Howard, Nov 21 2026)": `http*://valta.ai/*` -> `https://www.valta.ai/${2}`, 301, query string kept.
- Contact account: Pages project valta-ai, custom domain www.valta.ai, "Check DNS records" run; domain now verified.
- Not touched: every email record, app.valta.ai (still on the old IPs; returns 403).

Verified 2026-11-21 with curl: http and https valta.ai (with path and query) -> 301 https://www.valta.ai/...; https://www.valta.ai -> 200; http://www -> 301 https; MX smtp.google.com and SPF unchanged.
