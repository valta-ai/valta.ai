// Valta.ai motion layer (added 2026-11-21 for Alex's request). Styles live in /motion.css.
// The pages use inline styles only, so this script tags elements by structure. It changes no text or links.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var st = function (el) { return el.getAttribute('style') || ''; };

  // Hero = first section after the header
  var hero = document.querySelector('header ~ section');
  if (hero) {
    hero.classList.add('vm-hero');
    var bg = document.createElement('div');
    bg.className = 'vm-hero-bg';
    bg.setAttribute('aria-hidden', 'true');
    hero.insertBefore(bg, hero.firstChild);

    var cols = hero.querySelectorAll(':scope > div:not(.vm-hero-bg) > div');
    var d = 0;
    cols.forEach(function (col) {
      Array.prototype.forEach.call(col.children, function (el) {
        el.classList.add('vm-in');
        el.style.setProperty('--vm-d', d.toFixed(2) + 's');
        d += 0.12;
      });
    });
    var p = 0.5;
    hero.querySelectorAll('span').forEach(function (s) {
      if (st(s).indexOf('999px') > -1) { s.classList.add('vm-pill'); s.style.setProperty('--vm-d', p.toFixed(2) + 's'); p += 0.06; }
    });
    var arrow = hero.querySelector('svg');
    if (arrow) arrow.classList.add('vm-flow');
  }

  // Buttons (links styled as buttons) and nav links
  document.querySelectorAll('a').forEach(function (a) {
    var s = st(a);
    if (s.indexOf('border-radius') > -1 && (s.indexOf('background') > -1 || s.indexOf('border:') > -1)) a.classList.add('vm-btn');
    else if (a.closest('nav')) a.classList.add('vm-nav');
  });
  document.querySelectorAll('button[type="submit"], form button').forEach(function (b) { b.classList.add('vm-btn'); });

  // Cards and scroll reveal in every section except the hero
  var sections = Array.prototype.filter.call(document.querySelectorAll('section'), function (s) { return s !== hero; });
  var revealed = [];
  sections.forEach(function (sec) {
    sec.querySelectorAll('div').forEach(function (div) {
      var s = st(div);
      if (s.indexOf('border-radius') > -1 && (s.indexOf('border:') > -1 || s.indexOf('background') > -1) && div.querySelector('h3, p') && !div.querySelector('form')) {
        div.classList.add('vm-card');
      }
    });
    var heads = sec.querySelectorAll('h2');
    heads.forEach(function (h) { revealed.push([h, 0]); });
    var i = 0;
    sec.querySelectorAll('.vm-card').forEach(function (c) {
      if (!c.parentElement.closest('.vm-card')) { revealed.push([c, Math.min(i, 5) * 0.08]); i++; }
    });
  });

  if (reduce || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('vm-show'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  revealed.forEach(function (r) {
    var el = r[0];
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) return; // already on screen at load: leave as is
    el.classList.add('vm-reveal');
    el.style.setProperty('--vm-d', r[1] + 's');
    io.observe(el);
  });
})();
