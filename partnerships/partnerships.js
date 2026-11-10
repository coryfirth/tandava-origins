/* ==========================================================================
   Partnerships — the Request Info form.

   READ THIS BEFORE THIS PAGE GOES LIVE.
   ENDPOINT below is empty, which is how the approved design behaves: the
   form swaps to "Thank You." and the answers go nowhere. Anyone who fills
   it in believes they have reached you, and they have not.

   Put the GoHighLevel form's POST url in ENDPOINT and the lead is delivered
   before the thank-you shows. Until then this page should not be published.
   ========================================================================== */
(function () {
  'use strict';

  var ENDPOINT = '';   /* e.g. https://services.leadconnectorhq.com/... */

  var card = document.querySelector('[data-partner-form]');
  if (!card) { return; }
  var form = card.querySelector('form');
  var button = card.querySelector('.pr__submit');

  function done() { card.dataset.sent = 'true'; card.scrollIntoView({ block: 'nearest' }); }

  function stranded() {
    var note = form.querySelector('[data-error]');
    if (!note) {
      note = document.createElement('p');
      note.setAttribute('data-error', '');
      note.setAttribute('role', 'status');
      note.style.cssText = 'margin:0;font-size:15px;line-height:1.5;color:#9A3B2F';
      form.insertBefore(note, button);
    }
    note.innerHTML = 'This form is not connected yet. Please email ' +
      '<a href="mailto:cory@tandavaretreats.com?subject=Partnership%20enquiry">cory@tandavaretreats.com</a>' +
      ' and we will come straight back to you.';
    note.scrollIntoView({ block: 'nearest' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* The browser's own validation, asked for rather than left to the
       default, so the message appears on the first offending field. */
    if (!form.checkValidity()) { form.reportValidity(); return; }

    /* Nothing is collecting these yet. Rather than show "Thank You." and drop
       the answers, hand the visitor a route that actually reaches a person.
       Delete this block the day ENDPOINT is filled in. */
    if (!ENDPOINT) { stranded(); return; }

    button.disabled = true;
    var original = button.textContent;
    button.textContent = 'Sending…';

    fetch(ENDPOINT, { method: 'POST', body: new FormData(form) })
      .then(function (r) {
        if (!r.ok) { throw new Error(r.status); }
        done();
      })
      .catch(function () {
        /* Never pretend it arrived. Hand the visitor a way through instead. */
        button.disabled = false;
        button.textContent = original;
        var note = form.querySelector('[data-error]');
        if (!note) {
          note = document.createElement('p');
          note.setAttribute('data-error', '');
          note.style.cssText = 'margin:0;font-size:15px;line-height:1.5;color:#9A3B2F';
          form.insertBefore(note, button);
        }
        note.textContent = 'That did not send. Please email cory@tandavaretreats.com and we will pick it up from there.';
      });
  });
})();
