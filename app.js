/* Tandava Wellness homepage. The site menu lives in nav.js, shared by every
   page; this file is just the How it works accordion. */
(function () {
  'use strict';

  /* How it works: one piece of state, the active step. Step 2 on load. */
  var steps = [].slice.call(document.querySelectorAll('.step'));
  var panels = [].slice.call(document.querySelectorAll('.how__panel'));

  function select(i) {
    steps.forEach(function (s) { s.setAttribute('aria-selected', String(+s.dataset.step === i)); });
    panels.forEach(function (p) {
      if (+p.dataset.panel === i) { p.setAttribute('data-active', 'true'); }
      else { p.removeAttribute('data-active'); }
    });
  }

  steps.forEach(function (s) {
    s.addEventListener('click', function () { select(+s.dataset.step); });
    s.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      var next = (+s.dataset.step + (e.key === 'ArrowDown' ? 1 : -1) + steps.length) % steps.length;
      steps[next].focus();
      select(next);
    });
  });
})();
