// Valta.ai motion layer (added 2026-11-21 for Alex's request). Styles live in /motion.css.
// The pages use inline styles only, so this script tags elements by structure. It changes no text or links.
(function () {
  // Hero background: faint circuit lines; green pulses run along them and flash the hub they reach.
  function pulses(hero, bg) {
    var cv = document.createElement('canvas'), cx = cv.getContext('2d');
    if (!cx) return;
    bg.appendChild(cv);
    var G = 48, W, H, dpr, paths = [], live = [], flashes = [], last = 0, next = 0, run = false, raf;
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth; H = hero.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var cols = Math.floor(W / G), rows = Math.floor(H / G), n = Math.round(W * H / 36000);
      paths = [];
      for (var k = 0; k < n; k++) {
        var x = Math.floor(cols * (0.2 + 0.8 * Math.pow(Math.random(), 0.7))), y = 1 + Math.floor(Math.random() * (rows - 1));
        var pts = [[x * G, y * G]], dir = Math.random() < 0.5 ? 0 : 1, segs = 3 + Math.floor(Math.random() * 4);
        for (var s = 0; s < segs; s++) {
          var len = 1 + Math.floor(Math.random() * 4), sign = Math.random() < 0.5 ? -1 : 1;
          if (dir === 0) x = Math.max(0, Math.min(cols, x + sign * len)); else y = Math.max(1, Math.min(rows - 1, y + sign * len));
          var p = [x * G, y * G], q = pts[pts.length - 1];
          if (p[0] !== q[0] || p[1] !== q[1]) pts.push(p);
          dir = 1 - dir;
        }
        if (pts.length < 2) continue;
        var L = 0, acc = [0];
        for (var i = 1; i < pts.length; i++) { L += Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]); acc.push(L); }
        paths.push({ pts: pts, acc: acc, L: L });
      }
    }
    function at(p, d) {
      d = Math.max(0, Math.min(p.L, d));
      for (var i = 1; i < p.pts.length; i++) if (d <= p.acc[i]) {
        var t = (d - p.acc[i - 1]) / (p.acc[i] - p.acc[i - 1] || 1), a = p.pts[i - 1], b = p.pts[i];
        return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      }
      return p.pts[p.pts.length - 1];
    }
    function base() {
      cx.clearRect(0, 0, W, H);
      cx.lineWidth = 1; cx.strokeStyle = 'rgba(61,220,151,.13)'; cx.fillStyle = 'rgba(61,220,151,.35)';
      paths.forEach(function (p) {
        cx.beginPath(); cx.moveTo(p.pts[0][0] + .5, p.pts[0][1] + .5);
        for (var i = 1; i < p.pts.length; i++) cx.lineTo(p.pts[i][0] + .5, p.pts[i][1] + .5);
        cx.stroke();
        var e = p.pts[p.pts.length - 1]; cx.beginPath(); cx.arc(e[0], e[1], 2.5, 0, 6.283); cx.fill();
      });
    }
    function frame(t) {
      var dt = Math.min(50, t - (last || t)); last = t;
      base();
      if (t > next && live.length < 9 && paths.length) {
        live.push({ p: paths[Math.floor(Math.random() * paths.length)], d: 0, v: 0.32 + Math.random() * 0.18 });
        next = t + 180 + Math.random() * 320;
      }
      live = live.filter(function (u) {
        u.d += u.v * dt;
        var h = at(u.p, u.d), g = cx.createRadialGradient(h[0], h[1], 0, h[0], h[1], 14);
        g.addColorStop(0, 'rgba(61,220,151,.45)'); g.addColorStop(1, 'rgba(61,220,151,0)');
        cx.fillStyle = g; cx.beginPath(); cx.arc(h[0], h[1], 14, 0, 6.283); cx.fill();
        for (var k = 0; k < 14; k++) {
          var q = at(u.p, u.d - k * 7), a = (1 - k / 14);
          cx.fillStyle = 'rgba(61,220,151,' + (0.9 * a * a).toFixed(3) + ')';
          cx.beginPath(); cx.arc(q[0], q[1], k ? 2.2 * a + .4 : 3, 0, 6.283); cx.fill();
        }
        if (u.d >= u.p.L) { var e = u.p.pts[u.p.pts.length - 1]; flashes.push({ x: e[0], y: e[1], t: 0 }); return false; }
        return true;
      });
      flashes = flashes.filter(function (f) {
        f.t += dt; var k = f.t / 650; if (k >= 1) return false;
        cx.strokeStyle = 'rgba(61,220,151,' + (0.8 * (1 - k)).toFixed(3) + ')'; cx.lineWidth = 1.5;
        cx.beginPath(); cx.arc(f.x, f.y, 3 + 16 * k, 0, 6.283); cx.stroke();
        cx.fillStyle = 'rgba(160,255,210,' + (1 - k).toFixed(3) + ')'; cx.beginPath(); cx.arc(f.x, f.y, 3.5, 0, 6.283); cx.fill();
        return true;
      });
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!run && !still) { run = true; last = 0; raf = requestAnimationFrame(frame); } }
    function stop() { run = false; cancelAnimationFrame(raf); }
    build(); base();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { build(); base(); }, 150); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }).observe(hero); else start();
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    if (!still) hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

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
    pulses(hero, bg);

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
