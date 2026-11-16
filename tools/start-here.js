/* ==========================================================================
   Lifestyle Toolkit — the Start here walkthrough
   --------------------------------------------------------------------------
   Five steps, one on screen at a time. Every word comes from
   /tools/content.js; the prompt itself is fetched from the .txt file named
   there, so swapping that file is the whole job of changing the prompt.

   Nothing is stored and nothing is sent anywhere. The checkboxes in step 2
   are for the reader's own tracking and never gate the Next button.
   ========================================================================== */

(function () {
  'use strict';

  var C = window.TK;
  var UI = window.TKUI;
  var track = document.querySelector('[data-tk-track]');
  if (!C || !UI || !track) { return; }

  var view   = document.querySelector('[data-tk-view]');
  var bars   = document.querySelector('[data-tk-bars]');
  var count  = document.querySelector('[data-tk-count]');
  var back   = document.querySelector('[data-tk-back]');
  var next   = document.querySelector('[data-tk-next]');

  var steps  = C.STEPS;
  var n      = steps.length;
  var at     = 0;
  var supportsInert = 'inert' in HTMLElement.prototype;

  /* ------------------------------------------------------------ helpers -- */

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (text != null) { e.textContent = text; }
    return e;
  }

  /* A placeholder either renders its value or renders the amber box. */
  function fill(host, key, render) {
    var p = UI.ph(key);
    if (p.filled) { render(host, p.value); }
    else { host.appendChild(UI.box(p.note)); }
  }

  /* --------------------------------------------------------- the blocks -- */

  /* Step 2. Three files, each with a checkbox. Ticking tracks nothing but the
     reader's own progress: it is deliberately not wired to the Next button. */
  function blockFiles() {
    var list = el('div', 'tk-files');

    C.FILES.forEach(function (f) {
      var row = el('label', 'tk-file');

      var box = document.createElement('input');
      box.type = 'checkbox';
      box.className = 'tk-file__check';
      row.appendChild(box);

      var copy = el('span', 'tk-file__copy');
      copy.appendChild(el('b', 'tk-file__name', f.name));
      copy.appendChild(el('span', 'tk-file__line', f.line));

      /* The genetics report line carries the portal and reset links. Both are
         placeholders until they are filled in. */
      if (f.links) {
        var links = el('span', 'tk-file__links');
        f.links.forEach(function (l) {
          fill(links, l.placeholder, function (host, url) {
            var a = el('a', 'tk-file__link', l.label);
            a.href = url;
            a.target = '_blank';
            a.rel = 'noopener';
            host.appendChild(a);
          });
        });
        copy.appendChild(links);
      }

      row.appendChild(copy);
      list.appendChild(row);
    });

    return list;
  }

  /* Step 3. One tab per AI, each holding that AI's opt-out steps. Real
     buttons in a tablist, so arrow keys and a screen reader both work. */
  function blockTabs() {
    var wrap = el('div', 'tk-opt');

    var strip = el('div', 'tk-opt__tabs');
    strip.setAttribute('role', 'tablist');
    strip.setAttribute('aria-label', 'Choose your AI');

    var panel = el('div', 'tk-opt__panel');
    panel.id = 'tk-opt-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('tabindex', '0');

    var buttons = [];

    function open(i) {
      buttons.forEach(function (b, j) {
        var on = i === j;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      panel.setAttribute('aria-label', C.OPT_OUT[i].name + ': how to turn off training');
      panel.textContent = '';
      fill(panel, C.OPT_OUT[i].placeholder, function (host, lines) {
        var ol = el('ol', 'tk-opt__steps');
        lines.forEach(function (line) { ol.appendChild(el('li', null, line)); });
        host.appendChild(ol);
      });
    }

    C.OPT_OUT.forEach(function (o, i) {
      var b = el('button', 'tk-opt__tab', o.name);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', 'tk-opt-panel');
      b.addEventListener('click', function () { open(i); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) { return; }
        e.preventDefault();
        var j = (i + d + buttons.length) % buttons.length;
        open(j);
        buttons[j].focus();
      });
      buttons.push(b);
      strip.appendChild(b);
    });

    wrap.appendChild(strip);
    wrap.appendChild(panel);
    open(0);
    return wrap;
  }

  /* Step 4. The prompt, loaded from the .txt file, plus a Copy button.
     If the clipboard is unavailable or refuses, the text is selected instead
     and the button says so. */
  function blockPrompt() {
    var wrap = el('div', 'tk-prompt');

    var copy = el('button', 'btn btn--forest btn--sm tk-prompt__copy', 'Copy');
    copy.type = 'button';
    copy.disabled = true;

    var pre = el('pre', 'tk-prompt__text', 'Loading your prompt…');
    pre.tabIndex = 0;
    pre.setAttribute('aria-label', 'Your prompt');

    var said = el('p', 'tk-prompt__said');
    said.setAttribute('aria-live', 'polite');

    wrap.appendChild(copy);
    wrap.appendChild(pre);
    wrap.appendChild(said);

    fetch(C.PROMPT_URL, { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) { throw new Error(r.status); }
        return r.text();
      })
      .then(function (text) {
        pre.textContent = text.replace(/\s+$/, '');
        copy.disabled = false;
      })
      .catch(function () {
        /* Say what happened rather than show an empty box. */
        pre.textContent = '';
        var p = el('span', null, 'The prompt could not load. ');
        var a = el('a', null, 'Open it in a new tab');
        a.href = C.PROMPT_URL;
        a.target = '_blank';
        a.rel = 'noopener';
        pre.appendChild(p);
        pre.appendChild(a);
        pre.appendChild(document.createTextNode(' and copy it from there.'));
      });

    function flash(msg) {
      said.textContent = msg;
      copy.textContent = msg === 'Copied' ? 'Copied' : 'Copy';
      window.setTimeout(function () {
        said.textContent = '';
        copy.textContent = 'Copy';
      }, 2200);
    }

    function selectText() {
      try {
        var r = document.createRange();
        r.selectNodeContents(pre);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
        pre.focus();
        return true;
      } catch (e) { return false; }
    }

    copy.addEventListener('click', function () {
      var text = pre.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { flash('Copied'); },
          function () { selectText(); flash('Selected: press Ctrl or Cmd and C to copy'); }
        );
        return;
      }
      selectText();
      flash('Selected: press Ctrl or Cmd and C to copy');
    });

    return wrap;
  }

  /* Step 5. Three ways out, each opening in a new tab. */
  function blockLaunch() {
    var wrap = el('div', 'tk-launch');
    var row = el('div', 'tk-launch__row');

    C.LAUNCH.forEach(function (a) {
      var link = el('a', 'tk-launch__ai');
      link.href = a.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.appendChild(el('b', null, a.name));
      link.appendChild(el('span', null, 'Open'));
      row.appendChild(link);
    });

    wrap.appendChild(row);
    wrap.appendChild(el('p', 'tk-launch__note', C.LAUNCH_NOTE));
    return wrap;
  }

  var BLOCKS = { files: blockFiles, tabs: blockTabs, prompt: blockPrompt, launch: blockLaunch };

  /* ---------------------------------------------------------- the build -- */

  var slides = [];

  steps.forEach(function (s, i) {
    var slide = el('section', 'tk-slide');
    slide.id = 'step-' + (i + 1);

    slide.appendChild(el('p', 'eyebrow', s.eyebrow));

    var h = el('h1', 'serif-title tk-slide__title');
    h.tabIndex = -1;
    h.appendChild(document.createTextNode(s.title));
    h.appendChild(el('span', 'accent', s.titleAccent));
    slide.appendChild(h);

    (s.body || []).forEach(function (p) { slide.appendChild(el('p', 'tk-slide__p', p)); });

    if (s.block && BLOCKS[s.block]) { slide.appendChild(BLOCKS[s.block]()); }

    track.appendChild(slide);
    slides.push(slide);
  });

  /* The progress bar: one segment per step. */
  for (var b = 0; b < n; b++) { bars.appendChild(el('i', 'tk-jr__bar')); }
  var segs = bars.querySelectorAll('.tk-jr__bar');

  /* ------------------------------------------------------------- moving -- */

  function show(i, moved) {
    at = Math.max(0, Math.min(n - 1, i));

    track.style.transform = 'translateX(-' + (at * 100) + '%)';

    slides.forEach(function (s, j) {
      var on = j === at;
      s.classList.toggle('is-on', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (supportsInert) {
        s.inert = !on;
      } else {
        /* Older browsers: keep the hidden slides out of the tab order by hand,
           remembering each control's own tabindex so the tab strip's roving
           one survives the round trip. */
        [].forEach.call(s.querySelectorAll('a, button, input'), function (f) {
          if (on) {
            if (!f.hasAttribute('data-tk-tab')) { return; }
            var was = f.getAttribute('data-tk-tab');
            if (was === '') { f.removeAttribute('tabindex'); }
            else { f.setAttribute('tabindex', was); }
            f.removeAttribute('data-tk-tab');
          } else if (!f.hasAttribute('data-tk-tab')) {
            f.setAttribute('data-tk-tab', f.getAttribute('tabindex') || '');
            f.setAttribute('tabindex', '-1');
          }
        });
      }
    });

    [].forEach.call(segs, function (s, j) { s.classList.toggle('is-on', j <= at); });

    size();

    count.textContent = 'Step ' + (at + 1) + ' of ' + n + ': ' + (C.STEP_NAMES[at] || '');

    back.disabled = at === 0;
    next.textContent = at === 0 ? 'Begin' : (at === n - 1 ? 'Start over' : 'Next');

    /* Reflect the step in the URL so a refresh or a shared link lands in the
       same place. replaceState, not a real hash change: that keeps the
       browser's own Back button pointed at the page the reader came from,
       rather than making them press it five times to leave. */
    try { history.replaceState(null, '', '#step-' + (at + 1)); } catch (e) { /* file:// */ }

    /* Only pull focus when the reader asked to move, never on first paint.
       preventScroll matters: focusing something inside a clipped box makes
       the browser scroll that box to reveal it, which drags the whole track
       sideways and leaves the wrong step on screen. The two lines after it
       undo that in the browsers that ignore the option. */
    if (moved) {
      slides[at].querySelector('.tk-slide__title').focus({ preventScroll: true });
    }
    if (view) { view.scrollLeft = 0; view.scrollTop = 0; }
  }

  /* Without this the window would stay as tall as step 4, the longest, and
     every shorter step would sit above a pile of empty space. */
  function size() {
    if (view) { view.style.height = slides[at].offsetHeight + 'px'; }
  }

  if (window.ResizeObserver) {
    var ro = new ResizeObserver(size);
    slides.forEach(function (s) { ro.observe(s); });
  } else {
    window.addEventListener('resize', size);
  }

  next.addEventListener('click', function () { show(at === n - 1 ? 0 : at + 1, true); });
  back.addEventListener('click', function () { show(at - 1, true); });

  /* Somebody edited the hash, or followed a link to another step. */
  window.addEventListener('hashchange', function () {
    var want = fromHash();
    if (want !== at) { show(want, true); }
  });

  function fromHash() {
    var m = /^#step-(\d+)$/.exec(window.location.hash || '');
    if (!m) { return at; }
    var i = parseInt(m[1], 10) - 1;
    return (i >= 0 && i < n) ? i : at;
  }

  show(fromHash(), false);
  track.classList.add('is-ready');   /* animate only from here on */
})();
