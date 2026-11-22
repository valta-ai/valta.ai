# valta.ai site change log

Every change to this site gets an entry here: what changed, who asked, who approved, who did it, and how to undo it.
DNS and Cloudflare changes are logged separately in `DNS-LOG.md` (with before-snapshots in `dns-snapshots/`).
Anyone on the team can undo a change from this file alone; nobody needs to ask Howard first.

## How to undo any site change
- **Fastest (no code):** Cloudflare dashboard, contact@valta.ai account → Workers & Pages → `valta-ai` → Deployments → pick the deployment before the change → "Rollback to this deployment".
- **In git:** every change has a rollback tag. `git checkout main && git revert <commit>` (or reset main to the tag) and push; Pages redeploys main automatically.

---

## 2026-11-21 — Motion layer (animations, hover, hero background)
- **Asked by:** Alex (WeChat, Valta.AI Products, 11/21): "add a little bit dynamics, animation effects… hover… a background image on the top… with some animations".
- **Approved by:** Howard Huang, 11/21 ("Animations look fine. Let's go ahead and deploy it").
- **Done by:** Claude (Howard's AI assistant), built and tested locally first (branch `motion-2026-11-21`).
- **What changed:**
  - New files: `motion.css`, `motion.js`, `hero-bg.svg`.
  - `index.html` and `preferred-vendors.html`: one `<link href="/motion.css">` line in `<head>` and one `<script src="/motion.js" defer>` line before `</body>`. No text, links, form or tracking changed.
  - Effects: slowly drifting green grid + glow behind the top section; staggered entrance of hero text, buttons, cards and task pills; hover lift on cards and buttons; nav underline on hover; sections fade in on scroll. Motion is off for visitors who set "reduce motion" on their device.
- **Tested:** headless Chromium + WebKit, desktop 1440px and phone 390px: no script errors, no sideways scroll, nothing left hidden after scrolling; analytics blocked during tests.
- **Rollback tag:** `pre-motion-2026-11-21` (site exactly as before).
- **Undo options:** (1) Pages rollback to the deployment before this one; (2) `git revert` the motion commits; (3) delete the two include lines from both HTML pages (the three new files then do nothing).

## 2026-11-20 — New site launched
- Jing's 2-page design (Home, Preferred vendors) on Cloudflare Pages project `valta-ai`; "Get onboarded" form → Brevo form "contact valta ai" (list Valta AI) + automation "Valta AI lead alert" → contact@valtahomes.com. Domain hookup: see `DNS-LOG.md`.
