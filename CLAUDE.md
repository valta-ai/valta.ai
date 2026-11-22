# valta.ai — rules for any person or AI working in this repo

Read `README.md` (what the site is), `CHANGELOG.md` (site changes) and `DNS-LOG.md` (DNS/Cloudflare changes) first.

## Change-log rule (Howard, 2026-11-21; Jing's rules 2026-11-21)
The team must never depend on one person to know what changed or how to undo it.
1. **Before** any change: save the current state (git tag for code; full record list incl. comments/TTL/proxy into `dns-snapshots/` for DNS).
2. Make the change. Every Cloudflare DNS record you add or edit gets a comment in Jing's format: `Edited by <requester> <Mon D YYYY> (via <who did it>): <what/why>`.
3. Never touch records or settings you were not asked to change (Jing: "pay attention to whether AI rewrite DNS"). Email records (MX, SPF, DKIM, google-site-verification, _dnsauth) are Jing's.
4. **After:** add an entry to `CHANGELOG.md` or `DNS-LOG.md`: what, who asked, who approved, who did it, test proof, and exact undo steps. Commit and push so the whole team can see it.
5. If a change needs authority you don't have (e.g. Jing's approval on DNS), stop and ask; flag conflicts with earlier instructions instead of guessing.

Deploy: push to `main`; Cloudflare Pages (contact@valta.ai account, project `valta-ai`) publishes automatically. Test locally first; local previews must block analytics (GTM).
