/* ==========================================================================
   Lifestyle Toolkit — the walkthrough
   --------------------------------------------------------------------------
   Four steps, one on screen at a time, living on /tools under the hero.
   The green button in the hero hands over to this: the hero is hidden, the
   steps take its place, and nobody leaves the page. Back on step 1 hands it
   the other way.

   Every word comes from /tools/content.js; the prompt itself is fetched from
   the .txt file named there, so swapping that file is the whole job of
   changing the prompt.

   Nothing is stored and nothing is sent anywhere. The checkboxes in step 2
   are for the reader's own tracking and never gate the Next button.
   ========================================================================== */

(function () {
  'use strict';

  var C = window.TK;
  var UI = window.TKUI;
  var track = document.querySelector('[data-tk-track]');
  if (!C || !UI || !track) { return; }
  var el = UI.el;

  var view   = document.querySelector('[data-tk-view]');
  var bars   = document.querySelector('[data-tk-bars]');
  var count  = document.querySelector('[data-tk-count]');
  var back   = document.querySelector('[data-tk-back]');
  var next   = document.querySelector('[data-tk-next]');

  /* The hero, the section holding the steps, and the button between them. */
  var hero    = document.querySelector('[data-tk-top]');
  var journey = document.querySelector('[data-tk-journey]');
  var starter = document.querySelector('[data-tk-start]');

  var steps  = C.STEPS;
  var n      = steps.length;
  var at     = 0;
  var supportsInert = 'inert' in HTMLElement.prototype;

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

      /* The genetics report line carries the way in to the portal. It opens
         in its own tab so the reader does not lose their place here. */
      if (f.action) {
        var go = el('a', 'btn btn--outline btn--sm tk-file__btn', f.action.label);
        go.href = f.action.url;
        go.target = '_blank';
        go.rel = 'noopener';
        copy.appendChild(go);
        if (f.action.note) { copy.appendChild(el('span', 'tk-file__note', f.action.note)); }
      }

      row.appendChild(copy);
      list.appendChild(row);
    });

    return list;
  }

  /* Step 3. The prompt, loaded from the .txt file, plus a Copy button.
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

  /* Step 4. Three ways out, each opening in a new tab. */
  function blockLaunch() {
    var wrap = el('div', 'tk-launch');
    var row = el('div', 'tk-launch__row');

    C.AI.forEach(function (a) {
      var link = el('a', 'tk-launch__ai');
      link.href = a.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.appendChild(UI.aiMark(a, 'tk-launch__mark', 'colour'));
      link.appendChild(el('span', 'tk-launch__open', 'Open'));
      row.appendChild(link);
    });

    wrap.appendChild(row);
    wrap.appendChild(el('p', 'tk-launch__note', C.LAUNCH_NOTE));
    return wrap;
  }

  var BLOCKS = { files: blockFiles, prompt: blockPrompt, launch: blockLaunch };

  /* ---------------------------------------------------------- the build -- */

  var slides = [];

  steps.forEach(function (s, i) {
    var slide = el('section', 'tk-slide');
    slide.id = 'step-' + (i + 1);

    slide.appendChild(el('p', 'eyebrow', s.eyebrow));

    /* One colour, all the way across: the clay half came off these at
       Cory's ask, so the headline is a single string in content.js. */
    var h = el('h1', 'serif-title tk-slide__title', s.title);
    h.tabIndex = -1;
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

    /* Back on step 1 returns to the hero, so it is only ever dead on a page
       that has no hero to return to. */
    back.disabled = at === 0 && !hero;
    next.textContent = at === n - 1 ? 'Start over' : 'Next';

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

  /* --------------------------------------------------- open and close -- */

  var animating = false;

  /* Put the steps where the hero was. */
  function open(i, moved) {
    if (journey) { journey.hidden = false; }
    if (hero) { hero.hidden = true; }
    show(i, moved);
    /* The slide transition is switched on only after the first step is
       placed, so opening on a deep link does not fly through the others. */
    if (!animating) {
      animating = true;
      window.requestAnimationFrame(function () { track.classList.add('is-ready'); });
    }
  }

  /* And back again. The step is dropped from the URL so a refresh here
     lands on the hero, which is where the reader just asked to be. */
  function close() {
    if (!journey || !hero) { return; }
    journey.hidden = true;
    hero.hidden = false;
    try { history.replaceState(null, '', window.location.pathname); } catch (e) { /* file:// */ }
    window.scrollTo(0, 0);
    if (starter) { starter.focus({ preventScroll: true }); }
  }

  if (starter) {
    starter.addEventListener('click', function () {
      open(0, true);
      window.scrollTo(0, 0);
    });
  }

  next.addEventListener('click', function () { show(at === n - 1 ? 0 : at + 1, true); });
  back.addEventListener('click', function () {
    if (at === 0) { close(); } else { show(at - 1, true); }
  });

  /* Somebody edited the hash, or followed a link to a step. */
  window.addEventListener('hashchange', function () {
    var want = fromHash();
    if (want < 0) { return; }
    if (journey && journey.hidden) { open(want, true); }
    else if (want !== at) { show(want, true); }
  });

  /* -1 means the URL is not asking for a step. */
  function fromHash() {
    var m = /^#step-(\d+)$/.exec(window.location.hash || '');
    if (!m) { return -1; }
    var i = parseInt(m[1], 10) - 1;
    return (i >= 0 && i < n) ? i : -1;
  }

  /* On arrival: the hero, unless the link asked for a step. A page with no
     hero has nothing else to show, so it opens straight away. */
  var landing = fromHash();
  if (landing >= 0) { open(landing, false); }
  else if (!hero) { open(0, false); }
})();
