/* ==========================================================================
   Lifestyle Design — the four pieces of motion on this page.
   Each one starts when it is scrolled to, and each one has a still final
   state for anyone who asks for reduced motion.
   The two sliders are the kit page's, and are driven by kit.js.
   ========================================================================== */
(function () {
  'use strict';

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function whenSeen(el, run, threshold) {
    if (!el) { return; }
    var io = new IntersectionObserver(function (es) {
      if (!es.some(function (e) { return e.isIntersecting; })) { return; }
      io.disconnect();
      run();
    }, { threshold: threshold || .3 });
    io.observe(el);
  }

  /* ------------------------------------------------------- the day dial -- */
  /* Five blocks, scattered at first, then laid out as a designed day. */
  var DIAL = [
    { n: 'Sleep',     hrs: '~8 hrs',                 c: '#34442E', ink: '#F6F5F0', D: [0, 0, 38, 100],   S: [6, 10, 30, 30, -9] },
    { n: 'Energy',    hrs: '~8 hrs of work & focus', c: '#BC7A48', ink: '#FFFFFF', D: [38, 0, 62, 56],   S: [58, 4, 30, 30, 7] },
    { n: 'Stress',    hrs: '~4 hrs',                 c: '#5E7FA0', ink: '#FFFFFF', D: [38, 56, 34, 44],  S: [14, 58, 30, 30, 11] },
    { n: 'Nutrition', hrs: '~2 hrs',                 c: '#E3C977', ink: '#212C28', D: [72, 56, 28, 28],  S: [40, 36, 30, 30, -5] },
    { n: 'Movement',  hrs: '~1 hr',                  c: '#93A988', ink: '#212C28', D: [72, 84, 28, 16],  S: [62, 62, 30, 30, -13] }
  ];

  var dial = document.querySelector('[data-day-dial]');
  if (dial) {
    DIAL.forEach(function (b, i) {
      var box = document.createElement('div');
      box.className = 'ld-dial__b';
      box.innerHTML = '<div style="background:' + b.c + ';color:' + b.ink + '">' +
        '<span class="ld-dial__n">' + b.n + '</span>' +
        '<span class="ld-dial__h">' + b.hrs + '</span></div>';
      place(box, b.S, 5 - i);
      dial.appendChild(box);
      b.el = box;
    });
    var design = function () { DIAL.forEach(function (b) { place(b.el, b.D.concat([0]), 1); }); };
    if (still) { design(); } else { setTimeout(design, 900); }
  }

  function place(el, v, z) {
    el.style.left = v[0] + '%';
    el.style.top = v[1] + '%';
    el.style.width = v[2] + '%';
    el.style.height = v[3] + '%';
    el.style.transform = 'rotate(' + (v[4] || 0) + 'deg)';
    el.style.zIndex = z;
  }

  /* ----------------------------------------------------- the gene blocks -- */
  var AREAS = [['Sleep', '#6E8A62'], ['Energy', '#BC7A48'], ['Nutrition', '#E3C977'],
               ['Movement', '#93A988'], ['Stress', '#5E7FA0']];

  var gene = document.querySelector('[data-gene-blocks]');
  if (gene) {
    var areaBox = gene.querySelector('.ld-gene__areas');
    AREAS.forEach(function (a, i) {
      var row = document.createElement('div');
      row.style.transitionDelay = (i * 140) + 'ms';
      row.innerHTML = '<span class="ld-gene__rule" style="background:' + a[1] + '"></span>' +
        '<span class="ld-gene__chip"><span class="ld-gene__dot" style="background:' + a[1] + '"></span>' +
        '<span>' + a[0] + '</span></span>';
      areaBox.appendChild(row);
    });
    whenSeen(gene, function () { gene.dataset.on = 'true'; });
    strandLoop(gene.querySelector('canvas'));
  }

  /* The same double strand the Neuro page draws, in this page's palette. */
  function strandLoop(canvas) {
    if (!canvas) { return; }
    function draw(now) {
      var r = canvas.getBoundingClientRect(), W = r.width, H = r.height;
      if (!W || !H) { return; }
      var dpr = window.devicePixelRatio || 1;
      if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      }
      var x = canvas.getContext('2d');
      x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
      var N = 30, cx = W / 2, A = Math.min(W * .32, 70), top = 8, span = H - 16;
      for (var i = 0; i < N; i++) {
        var y = top + i * span / (N - 1), ph = i * .45 + now / 1100;
        var s = Math.sin(ph), d = Math.cos(ph), col = AREAS[Math.min(4, Math.floor(i / N * 5))][1];
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
    if (still) { draw(0); return; }
    (function spin(now) { draw(now); requestAnimationFrame(spin); })(0);
  }

  /* ---------------------------------------------------- lifestyle layer -- */
  var layer = document.querySelector('[data-layer]');
  if (layer) {
    var grid = layer.querySelector('.ld-layer__grid');
    var num = layer.querySelector('[data-layer-count]');
    for (var i = 0; i < 100; i++) {
      var dot = document.createElement('span');
      if (i < 40) { dot.setAttribute('data-lit', ''); dot.style.transitionDelay = (i * 40) + 'ms'; }
      else { dot.style.transitionDelay = (1700 + (i - 40) * 4) + 'ms'; }
      grid.appendChild(dot);
    }
    var settle = function (n) { num.textContent = n; };
    if (still) { layer.dataset.on = 'true'; settle(40); }
    else {
      whenSeen(layer, function () {
        layer.dataset.on = 'true';
        var t0 = performance.now(), D = 1800;
        (function tick(now) {
          var p = Math.min(1, (now - t0) / D);
          settle(Math.round(40 * (1 - Math.pow(1 - p, 3))));
          if (p < 1) { requestAnimationFrame(tick); }
        })(t0);
      }, .4);
    }
  }

  /* ------------------------------------------------- same plan, two people -- */
  /* Particles leave one plan on the left, split into two lanes, twist through
     the genes in the middle, and land in two bars of very different lengths.
     FILL is the whole point: the same input, two different results. */
  var viz = document.querySelector('[data-two-people]');
  if (viz) {
    var cv = viz.querySelector('canvas');
    var P = [], n = 2600;
    for (var k = 0; k < n; k++) {
      P.push({ u: Math.random(), sp: .05 + Math.random() * .018,
               b: Math.random() < .5 ? 0 : 1,
               j: (Math.random() + Math.random() + Math.random() - 1.5) / 1.5,
               fx: Math.sqrt(Math.random()), fy: Math.random(),
               st: Math.random() < .5 ? 0 : 1, s: .8 + Math.random() * 1.1 });
    }
    var W = 0, H = 0, t0 = performance.now(), live = false;

    var size = function () {
      var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(r.width * d));
      cv.height = Math.max(1, Math.round(r.height * d));
      W = r.width; H = r.height;
      cv.getContext('2d').setTransform(d, 0, 0, d, 0, 0);
    };
    size();
    if (window.ResizeObserver) { new ResizeObserver(size).observe(viz); }

    var frame = function (now) {
      var x = cv.getContext('2d');
      var t = still ? 12 : (now - t0) / 1000;
      var ease = function (v) { return v < .5 ? 4*v*v*v : 1 - Math.pow(-2*v + 2, 3) / 2; };
      var COL = [[203,136,86], [140,172,188]], SAND = [237,226,192];
      var FILL = [.86, .32], laneY = [H * .32, H * .72], cy = H * .52;
      var hx0 = W * .34, hx1 = W * .56, bx0 = W * .66, bw = W * .29;
      var bh = Math.max(20, H * .075), hr = H * .07;

      x.clearRect(0, 0, W, H);
      x.lineWidth = 1;
      for (var q = 0; q < 2; q++) {
        var yy = laneY[q] - bh / 2, rr = bh / 2;
        x.strokeStyle = 'rgba(246,245,240,.16)';
        x.beginPath();
        if (x.roundRect) { x.roundRect(bx0 - 6, yy - 6, bw + 12, bh + 12, rr + 6); }
        else { x.rect(bx0 - 6, yy - 6, bw + 12, bh + 12); }
        x.stroke();
      }

      x.globalCompositeOperation = 'lighter';
      for (var pi = 0; pi < P.length; pi++) {
        var p = P[pi];
        if (!still) {
          p.u += p.sp / 60;
          if (p.u >= 1) {
            p.u -= 1; p.b = Math.random() < .5 ? 0 : 1;
            p.fx = Math.sqrt(Math.random()); p.fy = Math.random();
          }
        }
        var u = p.u, ly = laneY[p.b], lc = COL[p.b];
        var px, py, z = 0, col = SAND, al = .6, kk;
        if (u < .2) {
          kk = u / .2; px = W * .03 + (W * .2 - W * .03) * kk;
          py = cy + Math.sin(kk * 4 + t * .9) * H * .02 + p.j * H * .03;
          al = .2 + .5 * Math.min(1, kk * 3);
        } else if (u < .32) {
          kk = ease((u - .2) / .12); px = W * .2 + (hx0 - W * .2) * kk;
          py = cy + (ly - cy) * kk + p.j * H * .03 * (1 - kk); al = .7;
          col = SAND.map(function (v, i2) { return v + (lc[i2] - v) * kk * .4; });
        } else if (u < .58) {
          kk = (u - .32) / .26; px = hx0 + (hx1 - hx0) * kk;
          var th = kk * Math.PI * 4 + t * 1.3 + p.st * Math.PI;
          var env = Math.pow(Math.sin(Math.PI * Math.min(1, kk)), .6);
          py = ly + Math.cos(th) * hr * env + p.j * 2; z = Math.sin(th);
          col = SAND.map(function (v, i2) { return v + (lc[i2] - v) * Math.min(1, .4 + kk); });
          al = .3 + .6 * (z * .5 + .5);
        } else if (u < .7) {
          kk = ease((u - .58) / .12);
          var tx = bx0 + p.fx * bw * FILL[p.b], ty = ly + (p.fy - .5) * (bh - 4);
          px = hx1 + (tx - hx1) * kk; py = ly + (ty - ly) * kk; col = lc; al = .85;
        } else {
          kk = (u - .7) / .3;
          px = bx0 + p.fx * bw * FILL[p.b] + Math.sin(t * 2 + p.fy * 9) * .8;
          py = ly + (p.fy - .5) * (bh - 4); col = lc;
          al = .9 * (kk > .88 ? (1 - kk) / .12 : 1);
        }
        var sz = p.s * (1 + z * .35);
        x.fillStyle = 'rgba(' + (col[0] | 0) + ',' + (col[1] | 0) + ',' + (col[2] | 0) + ',' +
                      Math.max(0, al * .62).toFixed(3) + ')';
        x.fillRect(px - sz / 2, py - sz / 2, sz, sz);
        p.lx = px; p.ly = py;
      }
      x.globalCompositeOperation = 'source-over';
      if (!still && live) { requestAnimationFrame(frame); }
    };

    if (still) { frame(performance.now()); }
    else {
      /* Only burn frames while it is actually on screen. */
      new IntersectionObserver(function (es) {
        var on = es.some(function (e) { return e.isIntersecting; });
        if (on && !live) { live = true; requestAnimationFrame(frame); }
        else if (!on) { live = false; }
      }, { threshold: .05 }).observe(viz);
    }
  }
})();
