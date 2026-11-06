/* ==========================================================================
   Tandava — consent, then Google Analytics 4. Shared by every page.

   Order matters here. Consent defaults are declared before anything else,
   Google Analytics is not fetched at all until the visitor has allowed
   statistics, and Cookiebot decides when that is.
   ========================================================================== */
(function () {
  'use strict';

  var MEASUREMENT_ID = 'G-Z2RTJ86VBV';

  /* The footer "Cookie settings" link, wired before the host check below so
     it still works wherever the page is served. */
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('[data-cookie-settings]') : null;
    if (!link) { return; }
    e.preventDefault();
    if (window.Cookiebot && window.Cookiebot.renew) { window.Cookiebot.renew(); }
  });

  /* Only the live site reports. Local previews and file:// stay out, so the
     numbers in GA are visitors rather than us testing. */
  var LIVE_HOSTS = ['tandavawellness.com', 'www.tandavawellness.com'];
  if (LIVE_HOSTS.indexOf(window.location.hostname) === -1) { return; }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  /* Consent Mode v2. Queued now, so it applies the moment any Google tag
     loads rather than after it. The ad_* signals are declared even though
     only analytics is in use today: when ad tags are added they will read
     consent correctly with no change to this file. */
  gtag('consent', 'default', {
    ad_storage:              'denied',
    ad_user_data:            'denied',
    ad_personalization:      'denied',
    analytics_storage:       'denied',
    functionality_storage:   'denied',
    personalization_storage: 'denied',
    security_storage:        'granted',
    wait_for_update: 500
  });

  var loaded = false;
  function loadAnalytics() {
    if (loaded) { return; }
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID);
  }

  /* Cookiebot's four categories map onto the consent signals. A decline is
     pushed too, so refusal is recorded as an explicit denial rather than
     left sitting at the default. */
  function syncConsent() {
    var c = window.Cookiebot && window.Cookiebot.consent;
    if (!c) { return; }
    gtag('consent', 'update', {
      ad_storage:              c.marketing   ? 'granted' : 'denied',
      ad_user_data:            c.marketing   ? 'granted' : 'denied',
      ad_personalization:      c.marketing   ? 'granted' : 'denied',
      analytics_storage:       c.statistics  ? 'granted' : 'denied',
      functionality_storage:   c.preferences ? 'granted' : 'denied',
      personalization_storage: c.preferences ? 'granted' : 'denied'
    });
    /* Nothing is fetched from Google until this is true, so a visitor who
       declines never contacts Google at all. */
    if (c.statistics) { loadAnalytics(); }
  }

  /* Accept and Decline fire on a fresh choice; ConsentReady also fires for a
     returning visitor whose choice is already stored. */
  window.addEventListener('CookiebotOnAccept', syncConsent);
  window.addEventListener('CookiebotOnDecline', syncConsent);
  window.addEventListener('CookiebotOnConsentReady', syncConsent);
})();
