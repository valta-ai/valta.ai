# valta.ai

Static 2-page site (Home, Preferred vendors) from Jing's design, hosted on Cloudflare Pages in the Valta AI (contact@valta.ai) account.

- `index.html`, `preferred-vendors.html`: static HTML rendered from the design file (no build step).
- `form.js`: the "Get onboarded" form posts to a Brevo hosted form (`BREVO_FORM_URL`): Brevo form "contact valta ai", list "Valta AI".
- `_redirects`: old Next.js URLs point to the new pages.
- Deploy: push to `main`; Cloudflare Pages publishes it (no build step). Custom domain www.valta.ai (CNAME www -> valta-ai.pages.dev in the valta.ai zone, Lu account); the bare valta.ai redirects to www, same as valtagc.com.
- Analytics: GTM-PLZ36C9Q (GA4 property 542193110).
