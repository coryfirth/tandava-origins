/* ==========================================================================
   Tandava Wellness — the site menu, shared by every page.

   THIS LIST IS THE ONLY THING TO EDIT.
     show: true   the item appears in the menu
     show: false  the item is hidden everywhere
     href: null   the item appears but goes nowhere yet
   When a page goes live, give it its href. Nothing else has to change,
   on any page.

   The label column is a note to yourself only: the visible wording lives in
   each page's HTML, so changing it here changes nothing on screen.
   ========================================================================== */
(function () {
  'use strict';

  var MENU = [
    /* key            label                  href                           show  */
    { key: 'complete',  label: 'Complete Lifestyle', href: '/complete-lifestyle-kit/', show: true  },
    { key: 'sleep',     label: 'Sleep',              href: null,                       show: false },
    { key: 'diet',      label: 'Diet',               href: null,                       show: false },
    { key: 'exercise',  label: 'Exercise',           href: null,                       show: false },
    { key: 'programs',  label: 'Programs',           href: '/programs/',               show: true  },
    { key: 'neuro',     label: 'Tandava Neuro',      href: '/programs/tandava-neuro/', show: true  },
    { key: 'science',   label: 'The Science',        href: null,                       show: true  },
    { key: 'solutions', label: 'Partner Solutions',  href: '/solutions/',              show: true  },
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

  /* --------------------------------------------------- dropdown groups -- */
  /* Every [data-shop] group works the same way, so Shop by Goal and Programs
     share this one piece of code and a third would need no new lines. */
  var hoverable = window.matchMedia('(hover: hover) and (pointer: fine)');
  var wide = window.matchMedia('(min-width: 861px)');
  var groups = [].slice.call(topbar.querySelectorAll('[data-shop]'));

  function setOpen(group, state) {
    group.dataset.open = state ? 'true' : 'false';
    var t = group.querySelector('.shop__toggle');
    if (t) { t.setAttribute('aria-expanded', state ? 'true' : 'false'); }
  }

  groups.forEach(function (group) {
    /* A group keeps its place in the menu, but an empty dropdown would be a
       dead end: hide the whole thing until one of its pages has an href. */
    var panel = group.querySelector('.shop__panel');
    if (panel && !panel.querySelector('a[href]:not([hidden])')) {
      group.setAttribute('hidden', '');
      return;
    }

    var toggle = group.querySelector('.shop__toggle');
    if (!toggle) { return; }

    /* Hover to open, but only on a real pointer and only on the wide layout.
       Inside the hamburger the dropdown is always open, so hover is noise. */
    group.addEventListener('mouseenter', function () {
      if (hoverable.matches && wide.matches) { setOpen(group, true); }
    });
    group.addEventListener('mouseleave', function () {
      if (hoverable.matches && wide.matches) { setOpen(group, false); }
    });

    toggle.addEventListener('click', function (e) {
      if (!wide.matches) { return; }           /* expanded already on mobile */

      /* Programs is a page as well as a parent, so its toggle is a link and a
         click should go there. The exception is a wide touch screen, where
         hover never fires: there the first tap opens the list, the second
         follows the link, which is the only way to reach both. */
      if (toggle.hasAttribute('href')) {
        if (hoverable.matches || group.dataset.open === 'true') { return; }
        e.preventDefault();
        setOpen(group, true);
        return;
      }

      e.preventDefault();
      setOpen(group, group.dataset.open !== 'true');
    });
  });

  document.addEventListener('click', function (e) {
    groups.forEach(function (group) {
      if (!group.contains(e.target)) { setOpen(group, false); }
    });
  });

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
    groups.forEach(function (group) { setOpen(group, false); });
    if (burger) {
      topbar.dataset.menu = 'closed';
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();
