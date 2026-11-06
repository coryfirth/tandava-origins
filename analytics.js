/* ==========================================================================
   Tandava — Google Analytics 4, shared by every page.

   One file, loaded by every page, so the ID lives in exactly one place.
   Paste a new Measurement ID below and the whole site follows.
   ========================================================================== */
(function () {
  'use strict';

  var MEASUREMENT_ID = 'G-Z2RTJ86VBV';

  /* Only the live site reports. Local previews and anything served from a
     branch or a file:// path stay out of the data, so the numbers in GA are
     always real visitors and never us testing. */
  var LIVE_HOSTS = ['tandavawellness.com', 'www.tandavawellness.com'];
  if (LIVE_HOSTS.indexOf(window.location.hostname) === -1) { return; }

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);
})();
