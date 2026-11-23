# valta.ai site change log

Every change to this site gets an entry here: what changed, who asked, who approved, who did it, and how to undo it.
DNS and Cloudflare changes are logged separately in `DNS-LOG.md` (with before-snapshots in `dns-snapshots/`).
Anyone on the team can undo a change from this file alone; nobody needs to ask Howard first.

## How to undo any site change
- **Fastest (no code):** Cloudflare dashboard, contact@valta.ai account → Workers & Pages → `valta-ai` → Deployments → pick the deployment before the change → "Rollback to this deployment".
- **In git:** every change has a rollback tag. `git checkout main && git revert <commit>` (or reset main to the tag) and push; Pages redeploys main automatically.

---

## 2026-11-22 — Version number on the animation file links (so browsers load the new hero)
- **Why:** browsers keep `motion.js`/`motion.css` for up to 4 hours (`cache-control: max-age=14400`), so people who visited before the hero change still saw the old slow grid.
- **Asked and approved by:** Howard Huang, 11/22 ("you haven't deployed the new animations yet?").
- **Change made by:** Howard Huang (via Claude, his AI assistant).
- **What changed:** in `index.html` and `preferred-vendors.html`, `/motion.css` → `/motion.css?v=2` and `/motion.js` → `/motion.js?v=2`. Nothing else. Next time the motion files change, raise the number (v=3, …).
- **Rollback tag:** `pre-motion-cachebust-2026-11-22`.
- **Undo options:** (1) Cloudflare Pages rollback to the deployment before this one; (2) remove `?v=2` from the two lines in both pages and push; (3) reset main to the tag and push.

## 2026-11-22 — Preview address valta-ai.pages.dev now forwards to www.valta.ai
- **Why:** Google Analytics (property "Valta.ai") counted visits from the preview address `valta-ai.pages.dev` (16 on 11/20, 6 on 11/22) mixed in with the real site. Two addresses with the same pages also split search results.
- **Asked and approved by:** Howard Huang, 11/22 ("sure, go ahead and do that").
- **Change made by:** Howard Huang (via Claude, his AI assistant).
- **Why not a Tag Manager filter:** the available tools cannot edit an existing GTM tag (only delete and recreate), and the live GA4 tag was not put at risk. The GTM container GTM-PLZ36C9Q was **not changed**.
- **What changed:** new file `functions/_middleware.js` (Cloudflare Pages Function). Requests whose host is exactly `valta-ai.pages.dev` get a 301 to `https://www.valta.ai` + same path and query. www.valta.ai, valta.ai, the old-path redirects in `_redirects`, the form and tracking are unchanged. Per-deployment preview links (`<hash>.valta-ai.pages.dev`) still work for reviewing changes.
- **Tested:** unit test of the function (pages.dev → 301 with path and query kept; www, valta.ai and hash previews served normally); live check after deploy.
- **Rollback tag:** `pre-pagesdev-redirect-2026-11-22` (site exactly as before this change).
- **Undo options:** (1) Cloudflare Pages rollback to the deployment before this one; (2) delete `functions/_middleware.js` and push; (3) reset main to tag `pre-pagesdev-redirect-2026-11-22` and push.

## 2026-11-22 — Hero background replaced (faster circuit pulses)
- **Asked by:** Alex (WeChat, Valta.AI Products, 11/22 00:11): "the effects looks good on the site in general. my only recommendation is to modify the background animation for the top part … it moves too slowly and not very attractive".
- **Approved by:** Howard Huang, 11/22, after reviewing local preview videos ("I think we're fine. Let's go ahead and deploy.").
- **Change made by:** Howard Huang (via Claude, his AI assistant). Built and tested locally first on branch `hero-pulse-2026-11-22`.
- **What changed (top section background only):**
  - `motion.js`: new function `pulses()` draws faint circuit lines on a canvas; green pulses run along them (a new one every 0.2–0.5 s) and flash the hub they reach. It stops when the section is off screen or the tab is hidden; visitors with "reduce motion" see still lines only.
  - `motion.css`: removed the 60-second drifting grid and the timed glow; added the canvas styles (lines fade under the headline) and a glow that follows the pointer.
  - Deleted `hero-bg.svg` (only the old grid used it).
  - No HTML, text, links, form or tracking changed. Hover, entrance and scroll effects from 11/21 are unchanged.
- **Tested:** headless Chromium + WebKit, desktop 1440px and phone 390px, analytics blocked: canvas present, no script errors.
- **Rollback tag:** `pre-hero-pulse-2026-11-22` (site exactly as before this change, = commit f258e4d).
- **Undo options:** (1) Cloudflare Pages rollback to the deployment before this one; (2) `git revert` the hero-pulse commits and push; (3) reset main to tag `pre-hero-pulse-2026-11-22` and push.

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
