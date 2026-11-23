// Added 2026-11-22 (requested by Howard Huang, made via Claude). See CHANGELOG.md.
// Visits to the bare preview address valta-ai.pages.dev go to www.valta.ai (same path and query),
// so preview traffic does not mix into Google Analytics and search engines see one copy of the site.
// Undo: delete this file (or the whole functions/ folder) and push.
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === 'valta-ai.pages.dev') {
    return Response.redirect('https://www.valta.ai' + url.pathname + url.search, 301);
  }
  return next();
}
