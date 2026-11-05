/* ==========================================================================
   Complete Lifestyle Kit — page behaviour.
   Ported from the design source: the Six Ways slider, the 296-marker canvas,
   the FAQ, the sticky buy bars and the add-on pop-up.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     CHECKOUT LINKS — the only two URLs on this page. Paste new Stripe
     payment links here and nothing else needs to change.
     ====================================================================== */
  var CHECKOUT_KIT_FULL    = 'https://buy.stripe.com/dRmcMY3mnc2r0ON3YX8Vi08'; /* Kit only, $549 USD */
  var CHECKOUT_BUNDLE_FULL = 'https://buy.stripe.com/dRmdR2f555E3btr3YX8Vi09'; /* Kit + 6-Week Redesign, $795 USD */

  [].forEach.call(document.querySelectorAll('[data-checkout="kit"]'), function (a) {
    a.href = CHECKOUT_KIT_FULL;
  });
  [].forEach.call(document.querySelectorAll('[data-checkout="bundle"]'), function (a) {
    a.href = CHECKOUT_BUNDLE_FULL;
  });

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ==================================================== Six Ways slider -- */
  var SIX = [
    ['Sleep', 'Finally Wake Up Feeling Rested', 'Learn how to sleep and recover based on your own genetics, so you can build the kind of rest that restores you and carries your energy through the day.', 'YOUR SLEEP PROFILE', [['Sleep depth', 12, '#BC7A48'], ['Wake time', 9, '#8B9A7B'], ['Caffeine clearance', 6, '#E3C77C'], ['Recovery', 10, '#BC7A48']], 'sun'],
    ['Nutrition', 'Know What To Eat & What Supplements To Take', 'Learn how to eat for the way your body absorbs and processes food, so you can fuel steady energy without cycling through another trend diet.', 'HOW YOU PROCESS FOOD', [['Carb response', 8, '#BC7A48'], ['Fat metabolism', 13, '#8B9A7B'], ['Vitamin D', 5, '#E3C77C'], ['Omega-3 use', 10, '#BC7A48']], 'flame'],
    ['Fitness', 'Exercise The Way Your Body Is Designed', 'Learn how to be active in the way your body responds to fitness & movement, so you can put in effort that actually pays off, and recover in a way that makes it stick.', 'HOW YOU RESPOND TO TRAINING', [['Power', 15, '#BC7A48'], ['Endurance', 10, '#8B9A7B'], ['Recovery', 8, '#E3C77C'], ['Injury risk', 6, '#BC7A48']], 'pulse'],
    ['Stress', 'Get To The Root Of What Drains You', 'Learn what sets your stress response off and which levers settle it, so you can catch it early before it spills into your sleep, food, relationships and focus.', 'WHAT DRAINS YOU', [['Stress response', 14, '#BC7A48'], ['Calm-down speed', 6, '#8B9A7B'], ['Focus under load', 9, '#E3C77C'], ['Emotional recovery', 11, '#BC7A48']], 'waves'],
    ['Performance', 'Create More Energy For What Matters', 'Learn which small changes carry the most weight for your biology, so you can play the long game with a clear path to mind-body function instead of constant guesswork.', 'WHAT CARRIES THE MOST WEIGHT', [['Daily energy', 11, '#BC7A48'], ['Inflammation', 7, '#8B9A7B'], ['Cellular repair', 12, '#E3C77C'], ['Heart health', 9, '#BC7A48']], 'heart'],
    ['Alignment', 'Design A More Aligned Lifestyle', "You're not a machine to force into peak performance, you're a body with its own design. Learn to work with that design, so the changes you make hold through alignment, not force.", 'HOW YOUR LIFE LINES UP', [['Sleep', 14, '#BC7A48'], ['Nutrition', 12, '#8B9A7B'], ['Fitness', 15, '#E3C77C'], ['Stress', 11, '#BC7A48'], ['Energy', 13, '#8B9A7B']], 'target']
  ];

  var ICON_PATHS = {
    sun: ['M12 2v8', 'm4.93 10.93 1.41 1.41', 'M2 18h2', 'M20 18h2', 'm19.07 10.93-1.41 1.41', 'M22 22H2', 'm8 6 4-4 4 4', 'M16 18a4 4 0 0 0-8 0'],
    flame: ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'],
    pulse: ['M22 12h-4l-3 9L9 3l-3 9H2'],
    waves: ['M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1', 'M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1', 'M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1'],
    heart: ['M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z']
  };
  var SVGNS = 'http://www.w3.org/2000/svg';

  function iconEl(kind) {
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.7');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    if (kind === 'target') {
      [10, 6, 2].forEach(function (r) {
        var c = document.createElementNS(SVGNS, 'circle');
        c.setAttribute('cx', '12'); c.setAttribute('cy', '12'); c.setAttribute('r', String(r));
        svg.appendChild(c);
      });
    } else {
      ICON_PATHS[kind].forEach(function (d) {
        var p = document.createElementNS(SVGNS, 'path');
        p.setAttribute('d', d);
        svg.appendChild(p);
      });
    }
    return svg;
  }

  var six = document.querySelector('[data-six]');
  if (six) {
    var sixTabsEl = six.querySelector('.k-six__tabs');
    var sixNum = six.querySelector('[data-six-num]');
    var sixTitle = six.querySelector('[data-six-title]');
    var sixBody = six.querySelector('[data-six-body]');
    var sixProg = six.querySelector('[data-six-prog]');
    var sixEyebrow = six.querySelector('[data-six-eyebrow]');
    var sixRows = six.querySelector('[data-six-rows]');
    var sixIndex = 0;
    var sixTabs = [];
    var sixPaused = false;

    SIX.forEach(function (entry, j) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'k-six__tab';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', j === 0 ? 'true' : 'false');
      var box = document.createElement('span');
      box.className = 'k-six__tabicon';
      box.appendChild(iconEl(entry[5]));
      var label = document.createElement('span');
      label.textContent = entry[0];
      b.appendChild(box);
      b.appendChild(label);
      b.addEventListener('click', function () { sixPaused = true; sixDwell = 0; setSix(j); });
      sixTabsEl.appendChild(b);
      sixTabs.push(b);
    });

    /* Three identical rows of 19 dots, the first `n` of each row filled. */
    function buildRows(rows) {
      sixRows.textContent = '';
      rows.forEach(function (row) {
        var label = row[0], n = row[1], colour = row[2];
        var wrap = document.createElement('div');
        wrap.className = 'k-six__row';
        var lab = document.createElement('span');
        lab.className = 'k-six__rowlabel';
        lab.textContent = label;
        var grid = document.createElement('div');
        grid.className = 'k-six__dots';
        grid.setAttribute('role', 'img');
        grid.setAttribute('aria-label', label + ': ' + n + ' of 19');
        for (var r = 0; r < 3; r++) {
          for (var k = 0; k < 19; k++) {
            var dot = document.createElement('span');
            dot.className = 'k-six__dot';
            if (k < n) { dot.style.background = colour; }
            dot.style.transitionDelay = (k * 18) + 'ms';
            grid.appendChild(dot);
          }
        }
        wrap.appendChild(lab);
        wrap.appendChild(grid);
        sixRows.appendChild(wrap);
      });
    }

    function setSix(i) {
      sixIndex = (i + 6) % 6;
      var s = SIX[sixIndex];
      sixTabs.forEach(function (b, j) { b.setAttribute('aria-selected', j === sixIndex ? 'true' : 'false'); });
      sixNum.textContent = '0' + (sixIndex + 1);
      sixTitle.textContent = s[1];
      sixBody.textContent = s[2];
      sixEyebrow.textContent = s[3];
      sixProg.style.width = ((sixIndex + 1) / 6 * 100) + '%';
      buildRows(s[4]);
    }

    six.querySelector('[data-six-prev]').addEventListener('click', function () { sixPaused = true; sixDwell = 0; setSix(sixIndex - 1); });
    six.querySelector('[data-six-next]').addEventListener('click', function () { sixPaused = true; sixDwell = 0; setSix(sixIndex + 1); });

    /* Autoplay, as a heartbeat rather than a timer that can get stranded.
       Every second it asks one question: has the slider been on screen,
       in this tab, un-clicked, for six seconds running? Scrolling away or
       leaving the tab resets the count, clicking a step ends it for good.
       An IntersectionObserver would be tidier, but it only reports while the
       page is painting, so a backgrounded or throttled tab can leave the
       autoplay switched off with nothing to switch it back on. */
    var sixDwell = 0;

    function sixOnScreen() {
      var r = six.getBoundingClientRect();
      var h = window.innerHeight || document.documentElement.clientHeight;
      return r.top < h * 0.85 && r.bottom > h * 0.15;
    }

    function sixCanRun() {
      return !sixPaused && !reduced.matches && !document.hidden && sixOnScreen();
    }

    setSix(0);

    window.setInterval(function () {
      if (!sixCanRun()) { sixDwell = 0; return; }
      sixDwell += 1;
      if (sixDwell >= 6) { sixDwell = 0; setSix(sixIndex + 1); }
    }, 1000);
  }

  /* ================================================ how it works / dots -- */
  var HOW = [
    ['296 markers', 'We read 296 markers', 'Your cheek swab goes to our accredited lab partner, which reads 296 genetic markers tied to how you sleep, eat, move, recover and handle stress.'],
    ['5 areas', 'Across 5 key lifestyle areas', 'Every marker belongs to one of five areas: sleep, diet, stress, performance, exercise. We teach you how to read them together, because they affect each other. '],
    ['Your life', 'Together with how you actually live', 'We help you build healthy lifestyle habits that are aligned to your genetics.'],
    ['1 focus', 'We identify one clear focus', 'Where your genes and your habits pull furthest apart is where a small change goes furthest. That becomes your focus, with your key levers beside it.'],
    ['4 habits', 'You start with four habits, smallest first', 'Last coffee before 1pm. Your genes say caffeine stays with you; your intake says sleep is where you’re struggling.'],
    ['You', 'A plan shaped around you', 'Every marker ends up as plain-language advice for one person: how you sleep, eat, move, recover and handle stress, starting with the habits that matter most for you.']
  ];

  var how = document.querySelector('[data-how]');
  if (how) {
    var N = 296;
    var headSet = null;

    function phyl(cx, cy, n, R) {
      var o = [];
      for (var k = 0; k < n; k++) {
        var r = R * Math.sqrt((k + .5) / n), a = k * 2.39996;
        o.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
      }
      return o;
    }
    function layoutGrid() {
      var o = [], cols = 19, rows = Math.ceil(N / cols);
      for (var i = 0; i < N; i++) {
        var c = i % cols, r = Math.floor(i / cols);
        o.push({ x: .14 + c * (.72 / (cols - 1)), y: .12 + r * (.64 / (rows - 1)) });
      }
      return o;
    }
    function layoutClusters() {
      var c = [[.5, .2], [.8, .42], [.68, .72], [.32, .72], [.2, .42]], g = [[], [], [], [], []];
      for (var i = 0; i < N; i++) { g[i % 5].push(i); }
      var o = [];
      g.forEach(function (ids, k) {
        var pts = phyl(c[k][0], c[k][1], ids.length, .13);
        ids.forEach(function (id, j) { o[id] = pts[j]; });
      });
      return o;
    }
    function layoutVenn() {
      var L = [], R = [];
      for (var i = 0; i < N; i++) { (i % 2 ? R : L).push(i); }
      var o = [], a = phyl(.37, .44, L.length, .25), b = phyl(.63, .44, R.length, .25);
      L.forEach(function (id, j) { o[id] = a[j]; });
      R.forEach(function (id, j) { o[id] = b[j]; });
      return o;
    }
    function layoutRings() {
      var o = [], rs = [[.06, 16], [.15, 44], [.25, 80], [.36, 156]], id = 0;
      rs.forEach(function (pair) {
        var r = pair[0], n = pair[1];
        for (var k = 0; k < n && id < N; k++, id++) {
          var a = k / n * Math.PI * 2 + r * 9;
          o[id] = { x: .5 + r * Math.cos(a), y: .44 + r * Math.sin(a) };
        }
      });
      while (id < N) { o[id++] = { x: .5, y: .44 }; }
      return o;
    }
    function layoutStack() {
      var o = [], per = 74, cols = 37;
      for (var i = 0; i < N; i++) {
        var row = Math.floor(i / per), k = i % per, c = k % cols, r = Math.floor(k / cols);
        o.push({ x: .16 + row * .04 + c * (.6 / (cols - 1)), y: .2 + row * .15 + r * .035 });
      }
      return o;
    }
    function inFig(x, y, cx, dress) {
      var ax = Math.abs(x - cx);
      var rr = function (x0, x1, y0, y1, r) {
        if (ax < x0 || ax > x1 || y < y0 || y > y1) { return false; }
        var qx = ax < x0 + r ? x0 + r : ax > x1 - r ? x1 - r : ax,
            qy = y < y0 + r ? y0 + r : y > y1 - r ? y1 - r : y;
        return Math.hypot(ax - qx, y - qy) <= r;
      };
      if (y > .25 && y < .292) { return ax < .026; }
      if (rr(.122, .166, .305, .575, .022)) { return true; }
      if (dress) {
        if (y >= .3 && y <= .66) {
          var w = .092 + (y - .3) / .36 * .07;
          return y < .33 ? ax < w - (.33 - y) * 1.2 : ax < w;
        }
        return rr(.024, .072, .64, .89, .022);
      }
      return rr(0, .092, .3, .64, .04) || rr(.022, .092, .6, .89, .028);
    }
    function layoutPerson() {
      var scan = function (d) {
        var p = [], cx = .5, hr = .072, hy = .165;
        p.push({ x: cx, y: hy, h: 1 });
        for (var rr = d; rr <= hr + 1e-6; rr += d) {
          var n = Math.round(2 * Math.PI * rr / d);
          for (var k = 0; k < n; k++) {
            var a = k / n * 2 * Math.PI + rr * 7;
            p.push({ x: cx + rr * Math.cos(a), y: hy + rr * Math.sin(a), h: 1 });
          }
        }
        var row = 0;
        for (var y = .25; y < .9; y += d * .87, row++) {
          var off = row % 2 ? d / 2 : 0;
          for (var k2 = -16; k2 <= 16; k2++) {
            var x = cx + k2 * d + off;
            if (inFig(x, y, cx, false)) { p.push({ x: x, y: y }); }
          }
        }
        return p;
      };
      var lo = .01, hi = .06;
      for (var it = 0; it < 30; it++) {
        var d = (lo + hi) / 2;
        if (scan(d).length >= N) { lo = d; } else { hi = d; }
      }
      var keep = scan(hi);
      if (keep.length > N) { keep = scan(hi * 1.02); }
      var o = [];
      for (var i = 0; i < N; i++) { o.push(keep[i % keep.length]); }
      headSet = {};
      o.forEach(function (q, i) { if (q.h) { headSet[i] = true; } });
      return o;
    }

    /* Recentre each layout inside the square, as the design does. */
    var T = [layoutGrid(), layoutClusters(), layoutVenn(), layoutRings(), layoutStack(), layoutPerson()].map(function (t) {
      var x0 = 1, x1 = 0, y0 = 1, y1 = 0;
      t.forEach(function (q) { x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); y0 = Math.min(y0, q.y); y1 = Math.max(y1, q.y); });
      var dx = .5 - (x0 + x1) / 2, dy = .5 - (y0 + y1) / 2;
      return t.map(function (q) { return { x: q.x + dx, y: q.y + dy, h: q.h }; });
    });

    function dotColour(i, step) {
      if (step === 0) { return i % 7 === 0 ? '#BC7A48' : (i % 3 ? '#EDE2C0' : '#8B9A7B'); }
      if (step === 1) { return ['#EDE2C0', '#8B9A7B', '#BC7A48', '#D9BE7C', '#C9CFC0'][i % 5]; }
      if (step === 2) { return i % 2 ? '#BC7A48' : '#8B9A7B'; }
      if (step === 3) { return i < 16 ? '#BC7A48' : (i < 60 ? '#D9BE7C' : 'rgba(237,226,192,.55)'); }
      if (step === 4) { return i < 74 ? '#BC7A48' : 'rgba(237,226,192,' + (.75 - Math.floor(i / 74) * .15) + ')'; }
      return headSet && headSet[i] ? '#BC7A48' : '#EDE2C0';
    }

    var canvas = how.querySelector('[data-how-canvas]');
    var ctx = canvas.getContext('2d');
    var P = T[0].map(function (q) { return { x: q.x, y: q.y }; });
    var from = P.map(function (q) { return { x: q.x, y: q.y }; });
    var cur = 0, t0 = performance.now(), raf = null;

    function draw(now) {
      var rect = canvas.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1, W = rect.width, H = rect.height;
      if (W) {
        if (canvas.width !== Math.round(W * dpr)) {
          canvas.width = Math.round(W * dpr);
          canvas.height = Math.round(H * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        var tgt = T[cur], el = (now - t0) / 1000, rad = Math.max(2.4, Math.min(W, H) * .0075);
        for (var i = 0; i < N; i++) {
          var d = cur === 5 ? (1 - tgt[i].y) * 1.1 : (i % 37) / 37 * .35;
          var t = Math.min(1, Math.max(0, (el - d) / .9));
          var k = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          if (reduced.matches) { k = 1; }      /* snap straight to the shape */
          var f = from[i], g = tgt[i];
          var px = f.x + (g.x - f.x) * k, py = f.y + (g.y - f.y) * k;
          P[i].x = px; P[i].y = py;
          var bob = (cur === 5 && !reduced.matches) ? Math.sin(now / 900 + i) * .0015 : 0;
          ctx.fillStyle = dotColour(i, cur);
          ctx.beginPath();
          ctx.arc(px * W, (py + bob) * H, rad, 0, 6.2832);
          ctx.fill();
        }
      }
      raf = window.requestAnimationFrame(draw);
    }

    /* The canvas only paints while it is on screen. */
    function startCanvas() { if (!raf) { raf = window.requestAnimationFrame(draw); } }
    function stopCanvas() { if (raf) { window.cancelAnimationFrame(raf); raf = null; } }

    var howTabsEl = how.querySelector('[data-how-tabs]');
    var howKicker = how.querySelector('[data-how-kicker]');
    var howTitle = how.querySelector('[data-how-title]');
    var howBody = how.querySelector('[data-how-body]');
    var howCount = how.querySelector('[data-how-count]');
    var howPrev = how.querySelector('[data-how-prev]');
    var howNext = how.querySelector('[data-how-next]');
    var howDots = how.querySelector('[data-how-dots]');
    var howBars = how.querySelector('[data-how-bars]');
    var howVenn = how.querySelector('[data-how-venn]');
    var howTabs = [];
    var step = 0;

    HOW.forEach(function (entry, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'k-how__tab';
      var bar = document.createElement('span');
      bar.className = 'k-how__tabbar';
      var text = document.createElement('span');
      text.className = 'k-how__tabtext';
      var n = document.createElement('span');
      n.className = 'k-how__tabn';
      n.textContent = '0' + (i + 1);
      var label = document.createElement('span');
      label.className = 'k-how__tablabel';
      label.textContent = entry[0];
      text.appendChild(n);
      text.appendChild(label);
      b.appendChild(bar);
      b.appendChild(text);
      b.addEventListener('click', function () { setStep(i); });
      howTabsEl.appendChild(b);
      howTabs.push(b);
    });

    function setStep(i) {
      step = Math.max(0, Math.min(HOW.length - 1, i));
      var s = HOW[step];
      howTabs.forEach(function (b, j) {
        b.setAttribute('data-done', j <= step ? 'true' : 'false');
        if (j === step) { b.setAttribute('aria-current', 'step'); }
        else { b.removeAttribute('aria-current'); }
      });
      howKicker.textContent = 'STEP 0' + (step + 1) + ' OF 0' + HOW.length;
      howTitle.textContent = s[1];
      howBody.textContent = s[2];
      howCount.textContent = (step + 1) + ' of ' + HOW.length;
      howPrev.setAttribute('data-dim', step === 0 ? 'true' : 'false');
      howNext.setAttribute('data-dim', step === HOW.length - 1 ? 'true' : 'false');

      howDots.style.opacity = (step === 1 || step === 2) ? '0' : '1';
      howBars.setAttribute('data-on', step === 1 ? 'true' : 'false');
      howVenn.setAttribute('data-on', step === 2 ? 'true' : 'false');

      if (step !== cur) {
        from = P.map(function (q) { return { x: q.x, y: q.y }; });
        t0 = performance.now();
        cur = step;
      }
    }

    howPrev.addEventListener('click', function () { setStep(step - 1); });
    howNext.addEventListener('click', function () { setStep(step + 1); });

    setStep(0);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { startCanvas(); } else { stopCanvas(); } });
      }, { threshold: 0.05 }).observe(how.querySelector('.k-how__stage'));
    } else {
      startCanvas();
    }
  }

  /* ================================================================ FAQ -- */
  var faq = document.querySelector('[data-faq]');
  if (faq) {
    var questions = [].slice.call(faq.querySelectorAll('.k-faq__q'));
    questions.forEach(function (q) {
      q.addEventListener('click', function () {
        var wasOpen = q.getAttribute('aria-expanded') === 'true';
        questions.forEach(function (other) { other.setAttribute('aria-expanded', 'false'); });
        q.setAttribute('aria-expanded', wasOpen ? 'false' : 'true');
      });
    });
  }

  /* ====================================================== add-on pop-up -- */
  var upsell = document.querySelector('[data-upsell]');
  var upsellCard = upsell && upsell.querySelector('.k-upsell__card');
  var returnTo = null;

  function openUpsell(e) {
    if (!upsell) { return; }
    returnTo = (e && e.currentTarget) || document.activeElement;
    document.body.style.overflow = 'hidden';
    upsell.hidden = false;
    syncSticky();
    upsellCard.scrollTop = 0;
    window.setTimeout(function () {
      var first = upsellCard.querySelector('[data-first]');
      /* Focus the primary action without scrolling the sheet past its heading. */
      (first || upsellCard).focus({ preventScroll: true });
    }, 40);
  }
  function closeUpsell() {
    if (!upsell || upsell.hidden) { return; }
    document.body.style.overflow = '';
    upsell.hidden = true;
    syncSticky();
    if (returnTo && returnTo.focus) { returnTo.focus(); }
  }

  [].forEach.call(document.querySelectorAll('[data-open-upsell]'), function (b) {
    b.addEventListener('click', openUpsell);
  });
  if (upsell) {
    [].forEach.call(upsell.querySelectorAll('[data-upsell-close]'), function (b) {
      b.addEventListener('click', closeUpsell);
    });
    /* Both checkout links close the pop-up on the way out. */
    [].forEach.call(upsell.querySelectorAll('[data-checkout]'), function (a) {
      a.addEventListener('click', function () { document.body.style.overflow = ''; });
    });

    document.addEventListener('keydown', function (e) {
      if (upsell.hidden) { return; }
      if (e.key === 'Escape') { e.preventDefault(); closeUpsell(); return; }
      if (e.key !== 'Tab') { return; }
      var f = [].slice.call(upsellCard.querySelectorAll('button, a[href]'));
      if (!f.length) { return; }
      var a = f[0], z = f[f.length - 1], active = document.activeElement;
      if (!upsellCard.contains(active)) { e.preventDefault(); a.focus(); }
      else if (e.shiftKey && active === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && active === z) { e.preventDefault(); a.focus(); }
    });
  }

  /* ===================================================== sticky buy bar -- */
  var buybox = document.getElementById('buybox');
  var stickyTop = document.querySelector('[data-sticky-top]');
  var stickyBottom = document.querySelector('[data-sticky-bottom]');
  var narrow = window.matchMedia('(max-width: 759px)');
  var past = false;

  function syncSticky() {
    var show = past && (!upsell || upsell.hidden);
    if (stickyTop) { stickyTop.hidden = !(show && !narrow.matches); }
    if (stickyBottom) { stickyBottom.hidden = !(show && narrow.matches); }
  }

  if (buybox && (stickyTop || stickyBottom)) {
    var onScroll = function () {
      var next = buybox.getBoundingClientRect().bottom < 0;
      if (next !== past) { past = next; syncSticky(); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncSticky);
    onScroll();
  }
})();
