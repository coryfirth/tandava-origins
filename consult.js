/* ==========================================================================
   Consult modal — opens the GoHighLevel booking form in place.

   Every "Book a free consult" link on the site still points at Calendly in
   the HTML. This file intercepts the click and opens the form instead, so
   the Calendly URL survives as the no-JavaScript fallback rather than
   leaving a dead button. Replace the hrefs only once GHL is the sole route.
   ========================================================================== */
(function () {
  'use strict';

  var FORM_ID = 'xEfgaa9tVCIV310jv77r';   /* Consult Call Form - TVW Website */
  var FORM_SRC = 'https://api.leadconnectorhq.com/widget/form/' + FORM_ID;
  var EMBED_JS = 'https://link.msgsndr.com/js/form_embed.js';

  var modal = null, frame = null, lastFocus = null, loaded = false;

  function build() {
    modal = document.createElement('div');
    modal.className = 'cmodal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'cmodal-title');
    modal.dataset.open = 'false';

    modal.innerHTML =
      '<div class="cmodal__card">' +
        '<button class="cmodal__close" type="button" aria-label="Close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
          'stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        '</button>' +
        '<p class="cmodal__eyebrow">Free, no obligation</p>' +
        '<h2 class="cmodal__title" id="cmodal-title">Book your consult</h2>' +
        '<p class="cmodal__lede">Tell us where to reach you and we’ll get you booked ' +
          'in with a practitioner.</p>' +
        '<iframe class="cmodal__frame" title="Consult Call Form - TVW Website" ' +
          'id="inline-' + FORM_ID + '" ' +
          'data-layout="{\'id\':\'INLINE\'}" ' +
          'data-trigger-type="alwaysShow" data-trigger-value="" ' +
          'data-activation-type="alwaysActivated" data-activation-value="" ' +
          'data-deactivation-type="neverDeactivate" data-deactivation-value="" ' +
          'data-form-id="' + FORM_ID + '" ' +
          'data-form-name="Consult Call Form - TVW Website" ' +
          'data-height="420" ' +
          'data-layout-iframe-id="inline-' + FORM_ID + '" ' +
          'scrolling="no"></iframe>' +
        '<p class="cmodal__fallback">Trouble with the form? ' +
          '<a href="mailto:" data-consult-fallback>Book here instead</a>.</p>' +
      '</div>';

    document.body.appendChild(modal);
    frame = modal.querySelector('.cmodal__frame');

    modal.querySelector('.cmodal__close').addEventListener('click', close);
    /* A click on the backdrop closes; a click inside the card must not. */
    modal.addEventListener('click', function (e) { if (e.target === modal) { close(); } });
  }

  /* The form and its script are fetched on first open only. Six of the seven
     pages that carry this file never open the modal at all. */
  function load(fallbackHref) {
    var link = modal.querySelector('[data-consult-fallback]');
    if (link && fallbackHref) {
      link.setAttribute('href', fallbackHref);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    }
    if (loaded) { return; }
    loaded = true;
    frame.setAttribute('src', FORM_SRC);
    watchHeight();

    /* /partnerships/ already carries form_embed.js for its Request Info
       form. A second copy would start a second resizer over the same
       frames, and the two would argue about the height. One per page. */
    if (document.querySelector('script[src*="form_embed.js"]')) { return; }

    var s = document.createElement('script');
    s.src = EMBED_JS;
    /* Cookiebot's auto-blocking would otherwise gag this by filename and the
       form would never size itself. The form is the service the visitor
       asked for, not tracking, so it is exempt rather than gated. */
    s.setAttribute('data-cookieconsent', 'ignore');
    document.body.appendChild(s);
  }

  /* GHL's form page carries min-height: 100%, and form_embed.js measures it
     with document.body.offsetHeight, so the frame's height can only ever
     ratchet upwards: once tall, it stays tall. The form itself reports its
     real height as ["highlevel.setHeight", {height, id}], which
     form_embed.js ignores. Listening for it keeps the card the size of the
     form rather than the size of the tallest thing the form has ever been.
     Only shrinks over 40px are acted on; growing stays form_embed.js's job. */
  function watchHeight() {
    window.addEventListener('message', function (event) {
      if (!frame || event.source !== frame.contentWindow) { return; }

      var data = event.data;
      if (!data || data[0] !== 'highlevel.setHeight') { return; }

      var payload = data[1] || {};
      if (payload.id && String(payload.id) !== frame.id) { return; }

      var reported = Number(payload.height);
      if (!(reported > 0)) { return; }
      if (frame.getBoundingClientRect().height - reported < 40) { return; }

      /* The 8px covers the difference between the two ways of measuring, so
         a shrink can never crop the last line of what it shrinks to. */
      frame.style.height = (reported + 8) + 'px';
    });
  }

  function open(fallbackHref) {
    if (!modal) { build(); }
    load(fallbackHref);
    lastFocus = document.activeElement;
    modal.dataset.open = 'true';
    document.body.classList.add('cmodal-open');
    modal.querySelector('.cmodal__close').focus({ preventScroll: true });
  }

  function close() {
    if (!modal) { return; }
    modal.dataset.open = 'false';
    document.body.classList.remove('cmodal-open');
    if (lastFocus && lastFocus.focus) { lastFocus.focus({ preventScroll: true }); }
  }

  /* Delegated, so it covers links nav.js writes in after this file runs. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) { return; }
    var href = a.getAttribute('href') || '';
    /* data-direct opts a link out of the modal and sends it straight to the
       booking page. The Tandava Neuro buttons use it: that programme books
       with Manesh, and the form in here feeds the practitioner pipeline. */
    if (a.hasAttribute('data-direct')) { return; }
    if (href.indexOf('calendly.com') === -1 && !a.hasAttribute('data-consult')) { return; }
    if (a.hasAttribute('data-consult-fallback')) { return; }   /* the escape hatch */
    e.preventDefault();
    open(href.indexOf('calendly.com') !== -1 ? href : null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.dataset.open === 'true') { close(); }
  });
})();
