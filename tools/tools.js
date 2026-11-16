/* ==========================================================================
   Lifestyle Toolkit — shared pieces, and the /tools page
   --------------------------------------------------------------------------
   Two jobs:

   1. TKUI, a couple of helpers both Toolkit pages use. The important one is
      the placeholder: anything still unfilled in tools/content.js renders as
      a dashed amber box that nobody could read as finished copy.
   2. The "More tools on the way" grid on /tools.

   The hero and the featured card on that page are written into the markup,
   so they still read correctly if this file never runs.
   ========================================================================== */

window.TKUI = (function () {
  'use strict';

  var C = window.TK;

  /* Build the dashed amber box for a placeholder that has not been filled in.
     TODO(integration): every one of these disappears by itself once its value
     is set in tools/content.js. Nothing here needs editing. */
  function box(note) {
    var el = document.createElement('span');
    el.className = 'tk-ph';
    var tag = document.createElement('b');
    tag.textContent = 'PLACEHOLDER';
    el.appendChild(tag);
    el.appendChild(document.createTextNode(note));
    return el;
  }

  /* Read a placeholder by key. Returns { filled, value, note }. A value counts
     as filled when it is a non-empty string, or a list with something in it. */
  function ph(key) {
    var p = (C && C.PLACEHOLDER && C.PLACEHOLDER[key]) || null;
    if (!p) { return { filled: false, value: '', note: 'Missing content: ' + key }; }
    var v = p.value;
    var filled = Array.isArray(v) ? v.length > 0 : String(v || '').length > 0;
    return { filled: filled, value: v, note: p.note, fallback: p.fallback };
  }

  /* The tool's name, with "not final yet" marked where it appears. */
  function toolName(host) {
    var p = ph('toolName');
    host.textContent = p.filled ? p.value : (p.fallback || 'Your Lifestyle Assistant');
    if (!p.filled) {
      var chip = document.createElement('span');
      chip.className = 'tk-ph tk-ph--chip';
      var tag = document.createElement('b');
      tag.textContent = 'PLACEHOLDER';
      chip.appendChild(tag);
      chip.appendChild(document.createTextNode('name not final'));
      host.parentNode.appendChild(document.createTextNode(' '));
      host.parentNode.appendChild(chip);
    }
  }

  return { box: box, ph: ph, toolName: toolName };
})();


/* ------------------------------------------------------- the /tools page -- */
(function () {
  'use strict';

  var C = window.TK;
  if (!C) { return; }

  var name = document.querySelector('[data-tk-toolname]');
  if (name) { window.TKUI.toolName(name); }

  var heading = document.querySelector('[data-tk-soonheading]');
  if (heading && C.SOON_HEADING) { heading.textContent = C.SOON_HEADING; }

  /* The eight tools we have not opened yet. Divs, not links: there is nowhere
     for them to go, so they must not look or behave like something to press. */
  var grid = document.querySelector('[data-tk-soon]');
  if (!grid) { return; }

  C.SOON.forEach(function (t) {
    var card = document.createElement('div');
    card.className = 'tk-tool';

    var group = document.createElement('p');
    group.className = 'tk-tool__group';
    group.textContent = t.group;

    var title = document.createElement('h3');
    title.className = 'tk-tool__name';
    title.textContent = t.name;

    var line = document.createElement('p');
    line.className = 'tk-tool__line';
    line.textContent = t.line;

    var tag = document.createElement('p');
    tag.className = 'tk-tool__tag';
    tag.textContent = 'Coming soon';

    card.appendChild(group);
    card.appendChild(title);
    card.appendChild(line);
    card.appendChild(tag);
    grid.appendChild(card);
  });
})();
