/* ==========================================================================
   Lifestyle Toolkit — shared pieces, and the top of /tools
   --------------------------------------------------------------------------
   Two jobs:

   1. TKUI, the helpers the page shares with the walkthrough in
      start-here.js: el() and the AI marks.
   2. The top of /tools: the tool's name and the row of AI logos under the
      hero.

   The hero's own words are written into the markup, so they still read
   correctly if this file never runs.
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


/* -------------------------------------------------- the top of /tools -- */
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
     toolkit works with. The button below it is the thing to press. */
  var row = document.querySelector('[data-tk-ai]');
  if (row) {
    var marks = UI.el('div', 'tk-ai__row');
    C.AI.forEach(function (ai) { marks.appendChild(UI.aiMark(ai, 'tk-ai__mark', 'ink')); });
    row.appendChild(marks);
  }

  /* The green button's words. start-here.js owns what it does. */
  var cta = document.querySelector('[data-tk-start]');
  if (cta && C.CTA_LABEL) { cta.textContent = C.CTA_LABEL; }
})();
