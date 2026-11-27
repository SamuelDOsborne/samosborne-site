/* SPOTLIGHT: dresses an existing page in the homepage's look (see /css/spotlight.css).
   It reads what each element looks like now and tags it, so one stylesheet can
   restyle pages that were each built differently:
   light backgrounds go dark, dark text goes light, blue/teal accents go gold,
   rounded cards become square gold-edged cards, photos get a gold frame,
   and the first screen and the sections below get the homepage's soft motion. */
(function () {
  var body = document.body;
  if (!body || !body.classList.contains('spotlight')) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rgba(s) { var m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return null; var p = m[1].split(/[ ,\/]+/).filter(Boolean).map(parseFloat); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
  function lum(c) { return (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255; }
  function hsl(c) { var r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0, l = (mx + mn) / 2, s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360; } return { h: h, s: s, l: l }; }
  function isGold(c) { var x = hsl(c); return x.s > 0.25 && x.h >= 20 && x.h <= 55 && x.l > 0.35; }
  function isCool(c) { var x = hsl(c); return x.s > 0.18 && x.h >= 170 && x.h <= 260; }
  function ownText(el) { for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) return true; return false; }
  var BTN = '.btn-primary,.cta-primary,.reel-btn,button,input,select,textarea,.btn-secondary,.btn-ghost,.cta-secondary,.sitenav';
  var SKIP = { IMG: 1, VIDEO: 1, IFRAME: 1, SVG: 1, PATH: 1, SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, SOURCE: 1, BR: 1, CANVAS: 1, PICTURE: 1 };

  /* 1. stages: the outermost sections become dark, lit from above (unless they hold a photo background) */
  var stages = [], alt = false;
  Array.prototype.forEach.call(document.querySelectorAll('section, header, footer, main > div, body > div'), function (el) {
    if (el.closest('.sitenav') || el.tagName === 'FOOTER') return;
    var p = el.parentElement && el.parentElement.closest('section, header');
    if (p && p !== el) return;
    if (el.offsetHeight < 60) return;
    var cs = getComputedStyle(el);
    if (cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage)) return;
    if (cs.position === 'fixed') return;
    var bg = rgba(cs.backgroundColor);
    if (bg && bg.a > 0.5 && isCool(bg) && hsl(bg).l < 0.3) { /* keep deliberately coloured bands but darken */ }
    el.classList.add('sp-stage'); stages.push(el);
  });

  /* 2. every element: work out what it was, decide what it becomes */
  var all = body.querySelectorAll('*'), tags = [], bigSet = [];
  for (var i = 0; i < all.length; i++) {
    var el = all[i]; if (SKIP[el.tagName.toUpperCase()] || el.closest('svg') || el.closest('.sitenav')) continue;
    var cs = getComputedStyle(el), add = [];
    var inBtn = !!el.closest(BTN);
    var bg = rgba(cs.backgroundColor), col = rgba(cs.color);
    var radius = parseFloat(cs.borderTopLeftRadius) || 0, bw = parseFloat(cs.borderTopWidth) || 0, bc = rgba(cs.borderTopColor);
    var w = el.offsetWidth, h = el.offsetHeight;
    var isStage = el.classList.contains('sp-stage');
    var hasBgImg = cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage);

    if (!inBtn && !isStage && !hasBgImg) {
      var lightBg = bg && bg.a > 0.5 && lum(bg) > 0.55 && hsl(bg).s < 0.4;
      var panel = (bg && bg.a > 0.02) || (bw > 0 && bc && bc.a > 0.05);
      var short = (el.textContent || '').trim().length < 60;
      if (radius >= 12 && h > 0 && h < 46 && panel && short && w < 420) add.push('sp-pill');
      else if (panel && radius >= 5 && w > 140 && h > 70 && el.tagName !== 'A' && el.tagName !== 'SUMMARY') add.push('sp-card');
      else if (lightBg) add.push(w > 140 && h > 50 ? 'sp-card' : 'sp-dark');
      else if (bg && bg.a > 0.5 && isCool(bg) && w > 300) add.push('sp-dark');
    }
    if (!inBtn && add.indexOf('sp-card') < 0 && add.indexOf('sp-pill') < 0) ['Top', 'Right', 'Bottom', 'Left'].some(function (side) {
      var sw = parseFloat(cs['border' + side + 'Width']) || 0, sc = rgba(cs['border' + side + 'Color']);
      if (sw > 0 && sc && sc.a > 0.2 && (isCool(sc) || lum(sc) > 0.6 || lum(sc) < 0.3)) { add.push(isCool(sc) && sw >= 2 ? 'sp-line-gold' : 'sp-line'); return true; }
    });

    if (!inBtn && col && ownText(el)) {
      var head = /^H[1-6]$/.test(el.tagName), fs = parseFloat(cs.fontSize);
      /* big statement lines that are not headings get the headline serif too */
      var big = !head && (fs >= 25 || (fs >= 19 && parseInt(cs.fontWeight, 10) >= 600 && el.textContent.trim().length < 140 && !/^(A|LABEL|STRONG|B)$/.test(el.tagName))) && el.textContent.trim().length > 0 && !el.closest('h1,h2,h3');
      var bigAncestor = null; for (var q = el.parentElement; q && q !== body; q = q.parentElement) if (bigSet.indexOf(q) >= 0) { bigAncestor = q; break; }
      if (big && !bigAncestor) { bigSet.push(el); add.push('sp-display'); }
      var inHead = el.closest('h1,h2') || bigAncestor;
      if (inHead && !head && (isGold(col) || isCool(col)) && /^(SPAN|EM|I|STRONG|B|MARK)$/.test(el.tagName)) add.push('sp-goldword');
      else if (big && isGold(col)) add.push('sp-goldword');
      else if (isCool(col)) add.push('sp-accent');
      else if (col.a > 0.4 && lum(col) < 0.5 && !isGold(col)) add.push(head || big || el.closest('h1,h2,h3,h4') ? 'sp-text-head' : (lum(col) < 0.2 ? 'sp-text' : 'sp-text-muted'));
      if (cs.textTransform === 'uppercase' && parseFloat(cs.fontSize) <= 14 && parseFloat(cs.letterSpacing) > 0.5 && (isGold(col) || isCool(col)) && el.textContent.trim().length < 70 && add.indexOf('sp-pill') < 0) add.push('sp-eyebrow');
    }
    if (!inBtn) ['before', 'after'].forEach(function (w) {
      var ps = getComputedStyle(el, '::' + w); if (!ps || ps.content === 'none' || ps.content === 'normal') return;
      var pb = rgba(ps.backgroundColor), pc = rgba(ps.color), pbc = rgba(ps.borderTopColor);
      if (pb && pb.a > 0.3 && isCool(pb)) add.push('sp-' + w + '-goldbg');
      if ((pc && isCool(pc)) || (pbc && parseFloat(ps.borderTopWidth) > 0 && isCool(pbc))) add.push('sp-' + w + '-gold');
      else if (pb && pb.a > 0.5 && lum(pb) > 0.6 && hsl(pb).s < 0.4) add.push('sp-' + w + '-dark');
    });
    if (add.length) tags.push([el, add]);
  }
  tags.forEach(function (t) { t[0].classList.add.apply(t[0].classList, t[1]); });
  /* a gold word inside a headline: make sure the headline itself is white */
  Array.prototype.forEach.call(document.querySelectorAll('h1 .sp-accent, h2 .sp-accent'), function (el) { el.classList.remove('sp-accent'); el.classList.add('sp-goldword'); });

  /* 3. photos: square, with a thin gold frame set off the picture */
  Array.prototype.forEach.call(document.querySelectorAll('img'), function (img) {
    if (img.closest('.sitenav, .sp-card, .sp-pill, a.btn-primary, footer, [class*="logo"], [class*="Logo"]')) return;
    if (/logo|icon|badge|seal/i.test((img.getAttribute('src') || '') + ' ' + (img.className || '') + ' ' + (img.alt || ''))) return;
    var cs = getComputedStyle(img); if (cs.position === 'absolute' || cs.position === 'fixed') return;
    var r = img.getBoundingClientRect(); if (r.width < 180 || r.height < 140) return;
    var stage = img.closest('.sp-stage'); if (stage && r.width > stage.offsetWidth * 0.9) return; /* full-bleed pictures stay full-bleed */
    var target = img, p = img.parentElement;
    if (p && getComputedStyle(p).overflow !== 'visible' && Math.abs(p.offsetWidth - r.width) < 8 && Math.abs(p.offsetHeight - r.height) < 12) { target = p; img.classList.add('sp-photo-box'); }
    target.classList.add('sp-photo');
  });

  if (reduce) return;

  /* 4. the first screen: headline, lines and buttons arrive one after another */
  var vh = window.innerHeight, first = stages[0];
  if (first && first.getBoundingClientRect().top < vh) {
    var bits = [], d = 0.25;
    Array.prototype.forEach.call(first.querySelectorAll('h1, h1 ~ p, .eyebrow, h1 ~ div > p, [class*="eyebrow"], [class*="kicker"], [class*="sub"], .btn-primary, .btn-secondary, .btn-ghost, .cta-primary, .cta-secondary'), function (el) {
      if (bits.indexOf(el) >= 0 || el.closest('.reveal, .reveal-stagger') || bits.some(function (b) { return b.contains(el) || el.contains(b); })) return;
      if (el.getBoundingClientRect().top > vh || el.offsetHeight === 0) return;
      bits.push(el);
    });
    bits.sort(function (a, b) { return a.compareDocumentPosition(b) & 4 ? -1 : 1; });
    bits.slice(0, 9).forEach(function (el) { el.style.animationDelay = d.toFixed(2) + 's'; el.classList.add('sp-hero-in'); d += /^H1$/.test(el.tagName) ? 0.45 : 0.28; });
  }

  if (!('IntersectionObserver' in window)) { Array.prototype.forEach.call(document.querySelectorAll('.reveal,.reveal-stagger'), function (el) { el.classList.add('visible'); }); return; }

  /* 5. the page's own reveals: a second watcher that also catches very tall blocks
        (the page's watcher needs 12% of a block on screen, which a tall block on a phone never reaches) */
  var own = document.querySelectorAll('.reveal, .reveal-stagger');
  var ownIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); ownIO.unobserve(e.target); } }); }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
  Array.prototype.forEach.call(own, function (el) { ownIO.observe(el); });

  /* 6. pages with no scroll motion of their own get the homepage's */
  var marked = [];
  if (!own.length) {
    body.classList.add('sp-rv-on');
    var sel = 'h2, .sp-eyebrow, .sp-card, .sp-photo, p, ul, ol, blockquote, .btn-row, figure';
    stages.forEach(function (s, si) {
      if (si === 0 && s.getBoundingClientRect().top < vh) return;
      Array.prototype.forEach.call(s.querySelectorAll(sel), function (el) {
        if (el.closest('.sp-rv') || el.closest('.sp-hero-in') || el.getBoundingClientRect().top < vh * 0.9) return;
        el.classList.add('sp-rv'); if (el.tagName === 'H2') el.classList.add('sp-rv-x'); marked.push(el);
      });
    });
    function done(el) { el.addEventListener('transitionend', function f(e) { if (e.target !== el) return; el.removeEventListener('transitionend', f); el.classList.remove('sp-rv', 'sp-rv-x', 'sp-in'); el.style.transitionDelay = ''; }); }
    function show(el, k) { el.style.transitionDelay = (Math.min(k, 6) * 0.12) + 's'; el.classList.add('sp-in'); done(el); }
    var io = new IntersectionObserver(function (es) { var k = 0; es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); show(e.target, k++); } }); }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    marked.forEach(function (el) { io.observe(el); });
  }

  /* 7. safety net: nothing that has been scrolled past may stay hidden (e.g. after a jump link) */
  var t = null;
  function sweep() {
    t = null;
    Array.prototype.forEach.call(document.querySelectorAll('.reveal:not(.visible), .reveal-stagger:not(.visible)'), function (el) { if (el.getBoundingClientRect().top < vh) el.classList.add('visible'); });
    Array.prototype.forEach.call(document.querySelectorAll('.sp-rv:not(.sp-in)'), function (el) { if (el.getBoundingClientRect().top < vh) el.classList.add('sp-in'); });
  }
  window.addEventListener('scroll', function () { if (!t) t = setTimeout(sweep, 400); }, { passive: true });
  window.addEventListener('resize', function () { vh = window.innerHeight; }, { passive: true });
  window.addEventListener('load', function () { setTimeout(sweep, 600); });
})();
