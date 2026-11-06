/* ==========================================================================
   Tandava Origins — page behaviour.
   One job: the "Before you go" add-on pop-up behind every Get my kit button.
   Mirrors the pop-up on the Complete Lifestyle Kit page.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     CHECKOUT LINKS — the only two URLs on this page. Paste new Stripe
     payment links here and nothing else needs to change. These are the
     same two links the Complete Lifestyle Kit page uses.
     ====================================================================== */
  var CHECKOUT_KIT_FULL    = 'https://buy.stripe.com/dRmcMY3mnc2r0ON3YX8Vi08'; /* Kit only, $549 USD */
  var CHECKOUT_BUNDLE_FULL = 'https://buy.stripe.com/dRmdR2f555E3btr3YX8Vi09'; /* Kit + 6-Week Redesign, $795 USD */

  [].forEach.call(document.querySelectorAll('[data-checkout="kit"]'), function (a) {
    a.href = CHECKOUT_KIT_FULL;
  });
  [].forEach.call(document.querySelectorAll('[data-checkout="bundle"]'), function (a) {
    a.href = CHECKOUT_BUNDLE_FULL;
  });

  /* ====================================================== add-on pop-up -- */
  var upsell = document.querySelector('[data-upsell]');
  var upsellCard = upsell && upsell.querySelector('.o-upsell__card');
  var returnTo = null;

  function openUpsell(e) {
    if (!upsell) { return; }
    returnTo = (e && e.currentTarget) || document.activeElement;
    document.body.style.overflow = 'hidden';
    upsell.hidden = false;
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
})();
