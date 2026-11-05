/* ==========================================================================
   Tandava Wellness — the site menu, shared by every page.

   THIS LIST IS THE ONLY THING TO EDIT.
     show: true   the item appears in the menu
     show: false  the item is hidden everywhere
     href: null   the item appears but goes nowhere yet
   When a page goes live, give it its href. Nothing else has to change,
   on any page.
   ========================================================================== */
(function () {
  'use strict';

  var MENU = [
    /* key            label                  href                           show  */
    { key: 'complete',  label: 'Complete Lifestyle', href: '/complete-lifestyle-kit/', show: true  },
    { key: 'sleep',     label: 'Sleep',              href: null,                       show: false },
    { key: 'diet',      label: 'Diet',               href: null,                       show: false },
    { key: 'exercise',  label: 'Exercise',           href: null,                       show: false },
    { key: 'science',   label: 'The Science',        href: null,                       show: true  },
    { key: 'solutions', label: 'Solutions',          href: '/solutions/',              show: true  },
    { key: 'about',     label: 'About',              href: null,                       show: false }
  ];

  /* ------------------------------------------------------- apply the list -- */
  MENU.forEach(function (item) {
    var nodes = document.querySelectorAll('[data-nav="' + item.key + '"]');
    [].forEach.call(nodes, function (el) {
      if (item.show) { el.removeAttribute('hidden'); } else { el.setAttribute('hidden', ''); }
      if (item.href) { el.setAttribute('href', item.href); }
      else { el.removeAttribute('href'); }   /* no destination yet, so no link */
    });
  });

  var topbar = document.querySelector('.topbar');
  if (!topbar) { return; }

  /* Mark the page you are on, if it is in the menu. */
  var here = window.location.pathname.replace(/index\.html$/, '');
  MENU.forEach(function (item) {
    if (!item.href || item.href !== here) { return; }
    [].forEach.call(document.querySelectorAll('[data-nav="' + item.key + '"]'), function (el) {
      el.setAttribute('aria-current', 'page');
    });
  });

  /* Shop by Goal keeps its place in the menu, but an empty dropdown would be
     a dead end. */
  var panel = topbar.querySelector('.shop__panel');
  if (panel && !panel.querySelector('a:not([hidden])')) {
    var group = topbar.querySelector('.shop');
    if (group) { group.setAttribute('hidden', ''); }
  }

  /* ------------------------------------------------------- Shop by Goal -- */
  var shopEl = topbar.querySelector('[data-shop]');
  if (shopEl) {
    var toggle = shopEl.querySelector('.shop__toggle');
    var hoverable = window.matchMedia('(hover: hover) and (pointer: fine)');
    var wide = window.matchMedia('(min-width: 861px)');

    var openShop = function (state) {
      shopEl.dataset.open = state ? 'true' : 'false';
      toggle.setAttribute('aria-expanded', state ? 'true' : 'false');
    };

    /* Hover to open, but only on a real pointer and only on the wide layout.
       Inside the hamburger the dropdown is always open, so hover is noise. */
    shopEl.addEventListener('mouseenter', function () {
      if (hoverable.matches && wide.matches) { openShop(true); }
    });
    shopEl.addEventListener('mouseleave', function () {
      if (hoverable.matches && wide.matches) { openShop(false); }
    });

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      if (!wide.matches) { return; }           /* expanded already on mobile */
      openShop(shopEl.dataset.open !== 'true');
    });

    document.addEventListener('click', function (e) {
      if (!shopEl.contains(e.target)) { openShop(false); }
    });
  }

  /* --------------------------------------------------------- hamburger -- */
  var burger = topbar.querySelector('.navtoggle');
  if (burger) {
    var openMenu = function (state) {
      topbar.dataset.menu = state ? 'open' : 'closed';
      burger.setAttribute('aria-expanded', state ? 'true' : 'false');
    };

    burger.addEventListener('click', function () {
      openMenu(topbar.dataset.menu !== 'open');
    });

    /* Tapping a link inside the panel navigates; close so the page behind is
       not left under an open menu when the target is an anchor on this page. */
    topbar.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.nav a[href]')) { openMenu(false); }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) { openMenu(false); }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    if (shopEl) {
      shopEl.dataset.open = 'false';
      shopEl.querySelector('.shop__toggle').setAttribute('aria-expanded', 'false');
    }
    if (burger) {
      topbar.dataset.menu = 'closed';
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();
