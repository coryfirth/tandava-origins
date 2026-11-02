/* Tandava Wellness homepage — the only two interactive pieces on the page. */
(function () {
  'use strict';

  /* Shop by Goal: hover on pointer devices, tap on touch. */
  var shop = document.querySelector('[data-shop]');
  if (shop) {
    var toggle = shop.querySelector('.shop__toggle');
    var hoverable = window.matchMedia('(hover: hover) and (pointer: fine)');

    var open = function (state) {
      shop.dataset.open = state ? 'true' : 'false';
      toggle.setAttribute('aria-expanded', state ? 'true' : 'false');
    };

    shop.addEventListener('mouseenter', function () { if (hoverable.matches) open(true); });
    shop.addEventListener('mouseleave', function () { if (hoverable.matches) open(false); });

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      open(shop.dataset.open !== 'true');
    });

    document.addEventListener('click', function (e) {
      if (!shop.contains(e.target)) open(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') open(false);
    });
  }

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
