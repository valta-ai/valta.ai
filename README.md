# valta.ai

Static 2-page site (Home, Preferred vendors) from Jing's design, hosted on Cloudflare Pages in the Valta AI (contact@valta.ai) account.

- `index.html`, `preferred-vendors.html`: static HTML rendered from the design file (no build step).
- `form.js`: the "Get onboarded" form posts to a Brevo hosted form (`BREVO_FORM_URL`): Brevo form "contact valta ai", list "Valta AI".
- `_redirects`: old Next.js URLs point to the new pages.
- Deploy: push to `main`; Cloudflare Pages publishes it (build command: none, output directory: `/`).
- Analytics: GTM-PLZ36C9Q (GA4 property 542193110).
