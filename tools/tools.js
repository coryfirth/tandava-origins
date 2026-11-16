/* ==========================================================================
   Lifestyle Toolkit — shared pieces, and the /tools page
   --------------------------------------------------------------------------
   Two jobs:

   1. TKUI, the few helpers both Toolkit pages share: the tool's name, and
      the row of AI logos.
   2. The "More tools on the way" grid on /tools.

   The hero and the featured card on that page are written into the markup,
   so they still read correctly if this file never runs.
   ========================================================================== */

window.TKUI = (function () {
  'use strict';

  var C = window.TK;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (text != null) { e.textContent = text; }
    return e;
  }

  /* One assistant's mark. `which` picks the version: 'ink' for the faded
     row under the hero, 'colour' for the launch buttons. With no file named
     the name is set in our own type instead, so nothing is ever missing. */
  function aiMark(ai, cls, which) {
    var src = ai[which];
    if (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = ai.name;
      img.loading = 'lazy';
      img.className = cls + ' ' + cls + '--img';
      return img;
    }
    return el('span', cls + ' ' + cls + '--type', ai.name);
  }

  return { el: el, aiMark: aiMark, C: C };
})();


/* ------------------------------------------------------- the /tools page -- */
(function () {
  'use strict';

  var C = window.TK;
  var UI = window.TKUI;
  if (!C || !UI) { return; }

  /* The tool's name, wherever it is marked in the markup. */
  [].forEach.call(document.querySelectorAll('[data-tk-toolname]'), function (n) {
    n.textContent = C.TOOL_NAME;
  });

  /* The three assistants, under the hero. Not links: this row says what the
     toolkit works with, and the buttons that go anywhere are further down. */
  var row = document.querySelector('[data-tk-ai]');
  if (row) {
    var marks = el2('div', 'tk-ai__row');
    C.AI.forEach(function (ai) { marks.appendChild(UI.aiMark(ai, 'tk-ai__mark', 'ink')); });
    row.appendChild(marks);
  }

  var heading = document.querySelector('[data-tk-soonheading]');
  if (heading && C.SOON_HEADING) { heading.textContent = C.SOON_HEADING; }

  /* The eight tools we have not opened yet. Divs, not links: there is nowhere
     for them to go, so they must not look or behave like something to press. */
  var grid = document.querySelector('[data-tk-soon]');
  if (!grid) { return; }

  C.SOON.forEach(function (t) {
    var card = el2('div', 'tk-tool');
    card.appendChild(el2('p', 'tk-tool__group', t.group));
    card.appendChild(el2('h3', 'tk-tool__name', t.name));
    card.appendChild(el2('p', 'tk-tool__line', t.line));
    card.appendChild(el2('p', 'tk-tool__tag', 'Coming soon'));
    grid.appendChild(card);
  });

  function el2(tag, cls, text) { return UI.el(tag, cls, text); }
})();
