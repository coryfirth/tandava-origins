/* ==========================================================================
   Why Neuroscience — the three steps and their canvas.

   The drawing is ported from the approved design: a seeded background net so
   it looks the same every load, a new pathway that strengthens, an old one
   that gets revised, and repetition that makes the new one the default.
   Every label sits in a navy pill and is clamped inside the panel, so a label
   can never land on top of a line.
   ========================================================================== */
(function () {
  'use strict';

  var DUR = 7000;
  var STEPS = [
    { caption: 'A new pathway, strengthened each time you return to it',
      aria: 'A faint new pathway between neurons grows stronger with each pulse.' },
    { caption: 'The old pathway is brought up, then revised',
      aria: 'An old copper pathway lights up, meets new evidence, and bends into a new blue route.' },
    { caption: 'Repetition makes the new pathway the default',
      aria: 'Repeated pulses thicken the new pathway while the old one fades.' }
  ];

  var sec = document.querySelector('[data-why]');
  if (!sec) { return; }

  var tabs    = [].slice.call(sec.querySelectorAll('.nu-why__step'));
  var canvas  = sec.querySelector('canvas');
  var capText = sec.querySelector('[data-why-caption]');
  var still   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var step = 0, t0 = 0, paused = false, inView = false, raf = null;

  /* ------------------------------------------------- the background net -- */
  /* One seeded generator, so the net is identical on every visit. */
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  var bg = [], i, j;
  for (i = 0; i < 38; i++) { bg.push([0.06 + rnd() * 0.88, 0.1 + rnd() * 0.74]); }

  var bgEdges = [];
  bg.forEach(function (p, idx) {
    var near = bg.map(function (q, k) { return [k, Math.hypot(p[0] - q[0], p[1] - q[1])]; })
                 .filter(function (e) { return e[0] !== idx; })
                 .sort(function (a, b) { return a[1] - b[1]; });
    near.slice(0, 2).forEach(function (e) { if (idx < e[0]) { bgEdges.push([idx, e[0]]); } });
  });

  var newP = [[.12, .56], [.3, .42], [.48, .5], [.66, .34], [.88, .4]];
  var oldP = [[.12, .56], [.28, .7], [.48, .66], [.68, .76], [.88, .62]];

  /* --------------------------------------------------------- the steps -- */
  function show(i, manual) {
    if (manual) { paused = true; }
    step = i;
    t0 = performance.now();
    tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    capText.textContent = STEPS[i].caption;
    canvas.setAttribute('aria-label', STEPS[i].aria);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(i, true); });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') { return; }
      e.preventDefault();
      show(i, true);
    });
  });

  /* --------------------------------------------------------- the canvas -- */
  function lerp(a, b, k) { return a + (b - a) * k; }
  function ease(x) { x = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - x, 3); }

  function at(path, f) {
    var L = [], tot = 0, k;
    for (k = 1; k < path.length; k++) {
      var l = Math.hypot(path[k][0] - path[k-1][0], path[k][1] - path[k-1][1]);
      L.push(l); tot += l;
    }
    var d = f * tot;
    for (k = 0; k < L.length; k++) {
      if (d <= L[k]) {
        var r = d / L[k];
        return [lerp(path[k][0], path[k+1][0], r), lerp(path[k][1], path[k+1][1], r)];
      }
      d -= L[k];
    }
    return path[path.length - 1];
  }

  function draw(now) {
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth, H = canvas.clientHeight;
    if (!W) { return; }
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    }
    var x = canvas.getContext('2d');
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.clearRect(0, 0, W, H);

    var t = inView ? now - t0 : 0;
    if (still) { t = DUR; }
    if (!still && inView && !paused && t > DUR) { show((step + 1) % 3, false); t = 0; }

    var bar = tabs[step].querySelector('.nu-why__bar');
    if (bar) { bar.style.width = (paused ? 100 : Math.min(100, t / DUR * 100)) + '%'; }

    var BLUE = '#7FB0DE', LIGHT = '#DCE8F5', CLAY = '#C99A72';
    function P(p) { return [p[0] * W, p[1] * H]; }
    function line(pts, color, w, a) {
      x.globalAlpha = a; x.strokeStyle = color; x.lineWidth = w;
      x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
      pts.forEach(function (p, k) { var q = P(p); if (k) { x.lineTo(q[0], q[1]); } else { x.moveTo(q[0], q[1]); } });
      x.stroke(); x.globalAlpha = 1;
    }
    function dot(p, r, color, a) {
      var q = P(p); x.globalAlpha = a; x.fillStyle = color;
      x.beginPath(); x.arc(q[0], q[1], r, 0, Math.PI * 2); x.fill(); x.globalAlpha = 1;
    }
    function glow(p, r, color, a) {
      var q = P(p);
      var g = x.createRadialGradient(q[0], q[1], 0, q[0], q[1], r);
      g.addColorStop(0, color); g.addColorStop(1, 'rgba(127,176,222,0)');
      x.globalAlpha = a; x.fillStyle = g;
      x.beginPath(); x.arc(q[0], q[1], r, 0, Math.PI * 2); x.fill(); x.globalAlpha = 1;
    }
    /* A pill behind every label: the line can run anywhere and the words stay
       readable. The x is clamped so a pill never hangs off the panel, and the
       top guard keeps it clear of the caption, which wraps to two lines on a
       narrow panel and would otherwise be written over. */
    var guard = capText ? capText.getBoundingClientRect().bottom -
                          canvas.getBoundingClientRect().top + 10 : 44;
    function label(p, txt, color, dy) {
      var q = P(p);
      x.font = "500 13px 'Hanken Grotesk', system-ui, sans-serif";
      var w = x.measureText(txt).width + 18, hh = 24;
      var cx = Math.max(w / 2 + 8, Math.min(W - w / 2 - 8, q[0]));
      var top = Math.max(hh / 2 + 8, guard + hh / 2);
      var cy = Math.max(top, Math.min(H - hh / 2 - 8, q[1] + dy - 4));
      x.fillStyle = '#0E243B'; x.strokeStyle = 'rgba(180,205,230,.28)'; x.lineWidth = 1;
      x.beginPath();
      if (x.roundRect) { x.roundRect(cx - w/2, cy - hh/2, w, hh, 12); }
      else { x.rect(cx - w/2, cy - hh/2, w, hh); }
      x.fill(); x.stroke();
      x.fillStyle = color; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText(txt, cx, cy + .5);
      x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    }
    function pulse(path, f, color, r) { var p = at(path, f); glow(p, r * 4, color, .55); dot(p, r, LIGHT, 1); }

    bgEdges.forEach(function (e) { line([bg[e[0]], bg[e[1]]], '#B4CDE6', 1, .12); });
    bg.forEach(function (p, k) { dot(p, 2 + (k % 3) * .6, '#B4CDE6', .35); });

    if (step === 0) {
      var n = Math.floor(t / 1500), f0 = (t % 1500) / 1500;
      var s0 = Math.min(1, .12 + n * .22 + (still ? 1 : 0));
      line(newP, BLUE, 1 + 4 * s0, .2 + .8 * s0);
      newP.forEach(function (p) { dot(p, 4 + 3 * s0, BLUE, .5 + .5 * s0); });
      if (!still && s0 < 1) { pulse(newP, ease(f0), BLUE, 4); }
      label(newP[0], 'Insight', '#B4CDE6', 32);
      if (s0 >= 1) { glow(newP[4], 46, BLUE, .5); label(newP[4], 'Encoded', LIGHT, 34); }
    }

    if (step === 1) {
      var k1 = ease((t - 1800) / 1800);
      var path = oldP.map(function (p, idx) {
        return idx === 0 ? p : [lerp(p[0], newP[idx][0], k1), lerp(p[1], newP[idx][1], k1)];
      });
      var col = k1 < .5 ? CLAY : BLUE;
      line(path, col, 4, .9);
      path.forEach(function (p) { dot(p, 6, col, 1); });
      if (t < 1800 && !still) { pulse(oldP, ease(t / 1800), CLAY, 4); }
      var ev = [.5, .16];
      if (t > 1200) {
        var e1 = ease((t - 1200) / 700);
        line([ev, [lerp(ev[0], path[2][0], e1), lerp(ev[1], path[2][1], e1)]], LIGHT, 2, .8);
        dot(ev, 6, LIGHT, 1);
        label(ev, 'New evidence', LIGHT, -22);
      }
      if (k1 > 0 && k1 < 1) { glow(path[2], 60 * k1, BLUE, .6 * (1 - k1)); }
      label(path[0], k1 < .5 ? 'Old belief' : 'Revised', k1 < .5 ? '#E8CBAE' : '#B4CDE6', k1 < .5 ? -22 : 32);
    }

    if (step === 2) {
      var reps = still ? 6 : Math.floor(t / 1000), f2 = (t % 1000) / 1000;
      var s2 = Math.min(1, reps / 6);
      line(oldP, CLAY, Math.max(.6, 4 - 3.4 * s2), .85 - .7 * s2);
      oldP.slice(1).forEach(function (p) { dot(p, 5 - 3 * s2, CLAY, .85 - .7 * s2); });
      line(newP, BLUE, 2 + 5 * s2, .55 + .45 * s2);
      newP.forEach(function (p) { dot(p, 5 + 2 * s2, BLUE, 1); });
      if (!still) { pulse(newP, ease(f2), BLUE, 4 + 2 * s2); }
      label(newP[4], 'New default', LIGHT, -24);
      label(oldP[4], 'Old pattern', 'rgba(232,203,174,' + (.9 - .6 * s2) + ')', 40);
      x.font = "500 15px 'Outfit', system-ui, sans-serif";
      x.fillStyle = '#B4CDE6'; x.textAlign = 'right';
      x.fillText('Repetition ×' + Math.min(reps + 1, 99), W - 22, H - 22);
      x.textAlign = 'left';
    }
  }

  function loop(now) { draw(now); raf = requestAnimationFrame(loop); }

  new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting && !inView) { inView = true; t0 = performance.now(); }
    });
  }, { threshold: .3 }).observe(canvas);

  show(0, false);
  if (still) { inView = true; draw(performance.now()); }
  else { raf = requestAnimationFrame(loop); }

  window.addEventListener('pagehide', function () { cancelAnimationFrame(raf); });
})();
