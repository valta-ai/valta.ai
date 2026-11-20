// Forwarder for the valta.ai domain (same pattern as valtagc.com).
// The valta.ai zone lives in the domain account; the site lives on Cloudflare
// Pages in the contact@valta.ai account (project "valta-ai"). A Pages site on a
// root domain must be in the zone's account, so this Worker, deployed in the
// domain account, passes valta.ai traffic through to the Pages site.
const ORIGIN = 'valta-ai.pages.dev';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname === 'www.valta.ai') {
      url.hostname = 'valta.ai';
      return Response.redirect(url.toString(), 301);
    }
    url.hostname = ORIGIN;
    const res = await fetch(new Request(url.toString(), request), { redirect: 'manual' });
    // Keep redirects on valta.ai, not pages.dev.
    const loc = res.headers.get('location');
    if (loc && loc.includes(ORIGIN)) {
      const h = new Headers(res.headers);
      h.set('location', loc.replace(ORIGIN, 'valta.ai'));
      return new Response(res.body, { status: res.status, headers: h });
    }
    return res;
  },
};
