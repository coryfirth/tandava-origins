/* ==========================================================================
   Tandava Neuro — the How It Works panel.

   Three steps advance on their own once the panel is on screen, and stop the
   moment the reader picks one. The DNA strand is drawn on a canvas; with
   reduced motion it is drawn once and left still.
   ========================================================================== */
(function () {
  'use strict';

  var DUR = 7000;
  var AREAS = [
    ['Sleep & Recovery', '#8FB3D9'],
    ['Nutrition & Supplementation', '#D9A26F'],
    ['Fitness & Movement', '#9DB08A'],
    ['Stress & Emotional Health', '#EDE2C0'],
    ['Performance & Energy', '#D9BE7C']
  ];

  var panel = document.querySelector('[data-terrain]');
  if (!panel) { return; }

  var tabs  = [].slice.call(panel.querySelectorAll('.nu-tab'));
  var views = [].slice.call(panel.querySelectorAll('.nu-view'));
  var still = window.matchMedia('(prefers-reduced-motion: reduce)');

  var at = 0, timer = null, auto = true, seen = false;

  /* On a phone the single panel beside the list has nowhere sensible to sit,
     so each visual moves inside the step it belongs to. One set of nodes,
     moved rather than copied, so there is nothing to keep in sync. */
  var stage = panel.querySelector('.nu-stage');
  var narrow = window.matchMedia('(max-width: 760px)');

  function place() {
    views.forEach(function (v, j) {
      var home = narrow.matches ? tabs[j].querySelector('.nu-tab__body') : stage;
      if (v.parentNode !== home) { home.appendChild(v); }
    });
  }
  narrow.addEventListener('change', place);

  function show(i) {
    at = i;
    tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
    views.forEach(function (v, j) { v.dataset.on = j === i ? 'true' : 'false'; });
    place();
    /* Restart the per-item reveals by re-running the animations. */
    var live = views[i];
    live.querySelectorAll('[style*="--d"]').forEach(function (el) {
      el.style.animationName = 'none';
      void el.offsetWidth;
      el.style.animationName = '';
    });
  }

  function arm() {
    clearTimeout(timer);
    if (!auto || still.matches) { return; }
    panel.dataset.auto = 'true';
    timer = setTimeout(function () { show((at + 1) % tabs.length); arm(); }, DUR);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      auto = false;
      panel.dataset.auto = 'false';
      clearTimeout(timer);
      show(i);
    });
  });

  /* ------------------------------------------------------- the strand -- */
  var canvas = panel.querySelector('canvas');
  var raf = null;

  function strand(now) {
    if (!canvas) { return; }
    var r = canvas.getBoundingClientRect();
    var W = r.width, H = r.height;
    if (!W || !H) { return; }
    var dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    var x = canvas.getContext('2d');
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.clearRect(0, 0, W, H);

    var N = 30, cx = W / 2, A = Math.min(W * .32, 70), top = 8, span = H - 16;
    for (var i = 0; i < N; i++) {
      var y = top + i * span / (N - 1);
      var ph = i * .45 + now / 1100;
      var s = Math.sin(ph), d = Math.cos(ph);
      var col = AREAS[Math.min(4, Math.floor(i / N * 5))][1];
      var x1 = cx + A * s, x2 = cx - A * s;
      x.globalAlpha = .32; x.strokeStyle = col; x.lineWidth = 1.5;
      x.beginPath(); x.moveTo(x1, y); x.lineTo(x2, y); x.stroke();
      x.globalAlpha = .55 + .45 * Math.max(0, d); x.fillStyle = col;
      x.beginPath(); x.arc(x1, y, 3 + 1.8 * Math.max(0, d), 0, 6.2832); x.fill();
      x.globalAlpha = .55 + .45 * Math.max(0, -d); x.fillStyle = '#F6F5F1';
      x.beginPath(); x.arc(x2, y, 3 + 1.8 * Math.max(0, -d), 0, 6.2832); x.fill();
    }
    x.globalAlpha = 1;
  }

  function spin(now) {
    if (at === 1) { strand(now); }
    raf = requestAnimationFrame(spin);
  }

  /* Nothing runs until the panel has been scrolled to. */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting || seen) { return; }
      seen = true;
      show(0);
      arm();
      if (still.matches) { strand(0); } else { raf = requestAnimationFrame(spin); }
      io.disconnect();
    });
  }, { threshold: .3 });
  io.observe(panel);

  window.addEventListener('pagehide', function () {
    cancelAnimationFrame(raf); clearTimeout(timer);
  });
})();
