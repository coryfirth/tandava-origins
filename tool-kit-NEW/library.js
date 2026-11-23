/* ==========================================================================
   Lifestyle Library — /tool-kit-NEW/

   The library itself lives in library-data.js, which loads first and is
   the only file to edit to add, remove or reorder a video or a row. This
   one is the machinery: it draws the shelves, runs the player, and knows
   nothing about any particular video.
   ========================================================================== */
(function () {
  'use strict';

  /* The list, as library-data.js left it. A page that loses that file
     shows its menu and its footer and no shelves, rather than an error. */
  var CONFIG = window.TANDAVA_LIBRARY;
  if (!CONFIG) { return; }

  var $ = function (s) { return document.querySelector(s); };

  var hero = $('#hero');
  var rows = $('#rows');
  if (!hero || !rows) { return; }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* Our own photograph, by basename: the folder and the extension are the
     same for all of them, so the list carries neither. */
  function ours(name) { return '/assets/tool-kit/' + name + '.jpg'; }

  /* An Unsplash cover is hotlinked from their CDN, which their API licence
     requires, and asked for at the size the card paints. */
  function unsplash(url, w, h) {
    return url + (url.indexOf('?') === -1 ? '?' : '&') +
      'w=' + w + '&h=' + h + '&fit=crop&crop=entropy&q=72&fm=jpg';
  }

  /* YouTube keeps several sizes per video and not every one exists for
     every video, so each <img> below names a size and falls back once.
       hq720        1280x720, true widescreen  — missing on older uploads
       mqdefault     320x180, true widescreen  — always there
       hqdefault     480x360, 4:3 with black bars top and bottom
       maxresdefault up to 1920x1080           — missing on older uploads
     The 4:3 one is avoided on purpose: cropping it to a card's shape
     either keeps a black band or eats into the picture. */
  function thumb(id, size) {
    return 'https://i.ytimg.com/vi/' + id + '/' + (size || 'hq720') + '.jpg';
  }
  /* Asked for a size it does not have, YouTube answers with a 404 AND a
     grey 120x90 placeholder. The body is a real JPEG, so the browser calls
     that a successful load and onerror never fires. Measuring the picture
     is the only way to tell, which is what this does: each <img> carries
     the sizes still worth trying, and every load is checked. */
  function watch(img) {
    var check = function () {
      if (img.naturalWidth > 120) { return; }          /* a real one arrived */
      var left = (img.getAttribute('data-next') || '').split(' ').filter(Boolean);
      if (!left.length) { return; }                    /* nothing left to try */
      img.setAttribute('data-next', left.slice(1).join(' '));
      img.src = left[0];
    };
    img.addEventListener('load', check);
    img.addEventListener('error', check);
    if (img.complete) { check(); }
  }
  function watchAll(root) {
    [].forEach.call(root.querySelectorAll('img[data-next]'), watch);
  }

  var query = '';
  /* renderRows runs once before the helpers below exist. */
  var ready = false;

  /* Each video's address on this page. The list carries it, so a title
     can be reworded without breaking a link somebody has already sent. */
  function slugOf(v) { return v.slug || v.id; }
  var idBySlug = {}, slugById = {};
  (function () {
    CONFIG.rows.forEach(function (c) {
      c.videos.forEach(function (v) {
        var slug = slugOf(v);
        idBySlug[slug] = v.id;
        slugById[v.id] = slug;
      });
    });
  }());

  function allVideos() {
    var map = {};
    CONFIG.rows.forEach(function (c) {
      c.videos.forEach(function (v) { map[v.id] = v; });
    });
    return map;
  }

  var PLAY_ICON = '<svg aria-hidden="true" width="15" height="15" viewBox="0 0 20 20"><path d="M6 4l10 6-10 6z" fill="currentColor"/></svg>';
  var ARROW_L = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6-6 6 6 6"/></svg>';
  var ARROW_R = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m10 6 6 6-6 6"/></svg>';

  /* The card's picture: the one named in the list, or, failing that,
     YouTube's own with its sizes to fall back through. */
  function hasPicture(v) { return !!(v.img || (v.cover && v.cover.url)); }

  function picture(v, lazy) {
    var load = lazy ? ' loading="lazy"' : ' fetchpriority="high"';
    if (v.img) {
      return '<img' + load + ' src="' + ours(v.img) + '" alt="" width="800" height="450" decoding="async">';
    }
    if (v.cover && v.cover.url) {
      return '<img' + load + ' src="' + unsplash(v.cover.url, 800, 450) + '"' +
        ' alt="" width="800" height="450" decoding="async">';
    }
    /* No photograph yet. A cover of our own rather than the channel's:
       nothing is painted here at all, and the CSS fills the frame with the
       row's own colours. See .lb-thumb--brand. */
    if (!SHOW_YT) { return ''; }
    return '<img' + load + ' src="' + thumb(v.id) + '"' +
      ' data-next="' + thumb(v.id, 'mqdefault') + '"' +
      ' alt="" width="1280" height="720" decoding="async">';
  }

  /* The play badge sits on the picture at rest rather than waiting for a
     hover: on a phone there is no hover, and a still photograph with
     nothing on it does not say "video". */
  /* Set to true to go back to borrowing YouTube's thumbnail for a video
     with no photograph of its own. Off, because a thumbnail arrives
     wearing somebody else's branding, which is the thing this library
     exists to get away from. */
  var SHOW_YT = false;

  function cardHTML(v, i) {
    /* The index rides along as a custom property so each card can come in a
       beat after the one before it. */
    return '<div class="lb-card" style="--i:' + (i || 0) + '">' +
      '<button class="lb-card__open" type="button" data-play="' + v.id + '">' +
        '<span class="lb-thumb' + (hasPicture(v) ? '' : ' lb-thumb--brand') + '">' +
          picture(v, true) +
          '<span class="lb-thumb__veil" aria-hidden="true"></span>' +
          '<span class="lb-thumb__play" aria-hidden="true">' + PLAY_ICON + '</span>' +
          (v.time ? '<span class="lb-thumb__time">' + esc(v.time) + '</span>' : '') +
        '</span>' +
        '<span class="lb-card__title">' + esc(v.title) + '</span>' +
        (v.by ? '<span class="lb-card__by">' + esc(v.by) + '</span>' : '') +
        (v.note ? '<span class="lb-card__note">' + esc(v.note) + '</span>' : '') +
      '</button>' +
    '</div>';
  }

  /* "5 videos \u00b7 2h 14m", added up from the lengths already in the list.
     A row whose videos have no lengths simply says how many there are. */
  function runtime(vids) {
    var total = 0, known = 0;
    vids.forEach(function (v) {
      if (!v.time) { return; }
      var part = v.time.split(':').map(Number);
      while (part.length < 3) { part.unshift(0); }
      total += part[0] * 3600 + part[1] * 60 + part[2];
      known++;
    });
    var count = vids.length + (vids.length === 1 ? ' video' : ' videos');
    if (!known || known !== vids.length) { return count; }
    var h = Math.floor(total / 3600), m = Math.round((total % 3600) / 60);
    if (m === 60) { h++; m = 0; }
    return count + ' \u00b7 ' + (h ? h + 'h ' + (m ? m + 'm' : '') : m + ' min').trim();
  }

  function rowHTML(name, note, vids, tone) {
    return '<section class="lb-row lb-row--' + (tone || 0) + '">' +
      '<div class="lb-row__head">' +
        '<div class="lb-row__id">' +
          '<h2 class="lb-row__title">' + esc(name) + '</h2>' +
          (note ? '<span class="lb-row__note">' + esc(note) + '</span>' : '') +
        '</div>' +
        '<span class="lb-row__meta">' + runtime(vids) + '</span>' +
      '</div>' +
      '<div class="lb-track-wrap is-at-start" data-wrap>' +
        '<span class="lb-fade lb-fade--l" aria-hidden="true"></span>' +
        '<span class="lb-fade lb-fade--r" aria-hidden="true"></span>' +
        '<button class="lb-arrow lb-arrow--l" type="button" data-scroll="-1" aria-label="Scroll left">' + ARROW_L + '</button>' +
        '<div class="lb-track">' + vids.map(cardHTML).join('') + '</div>' +
        '<button class="lb-arrow lb-arrow--r" type="button" data-scroll="1" aria-label="Scroll right">' + ARROW_R + '</button>' +
      '</div>' +
    '</section>';
  }

  function renderHero() {
    var f = CONFIG.featured;
    var bg = f.img
      ? '<img class="lb-hero__bg" src="' + ours(f.img) + '" alt="" width="1800" height="1013"' +
          ' fetchpriority="high" decoding="async">'
      : '<img class="lb-hero__bg" src="' + thumb(f.id, 'maxresdefault') + '" alt=""' +
          ' data-next="' + thumb(f.id, 'hq720') + ' ' + thumb(f.id, 'mqdefault') + '"' +
          ' fetchpriority="high" decoding="async">';
    hero.innerHTML = bg +
      '<div class="lb-hero__scrim" aria-hidden="true"></div>' +
      '<div class="lb-hero__copy"><div class="lb-hero__inner">' +
        '<span class="eyebrow">' + esc(f.eyebrow) +
          (f.time ? ' · ' + esc(f.time) : '') + '</span>' +
        '<h1 class="lb-hero__title" id="hero-title">' + esc(f.title) + '</h1>' +
        '<p class="lb-hero__lead">' + esc(f.blurb) + '</p>' +
        '<div class="lb-hero__actions">' +
          '<button class="btn lb-btn-paper" type="button" data-play="' + f.id + '">' +
            PLAY_ICON + ' Play' +
          '</button>' +
        '</div>' +
      '</div></div>';
    watchAll(hero);
  }

  function renderRows() {
    var html = '';
    if (query) {
      var q = query.toLowerCase();
      var all = allVideos();
      var hits = Object.keys(all).map(function (k) { return all[k]; })
        .filter(function (v) { return v.title.toLowerCase().indexOf(q) !== -1; });
      html = hits.length
        ? rowHTML('Results for “' + query + '”', hits.length + (hits.length > 1 ? ' videos' : ' video'), hits)
        : '<p class="lb-empty">Nothing in the library matches “' + esc(query) + '”.</p>';
    } else {
      html += CONFIG.rows.map(function (c, i) {
        return rowHTML(c.name, c.note, c.videos, i);
      }).join('');
    }
    rows.innerHTML = html;
    watchAll(rows);
    if (ready) { watchTracks(); reveal(); }
    /* While a search is running the featured video is beside the point. */
    hero.hidden = !!query;
  }

  function render() { renderHero(); renderRows(); }

  /* --------------------------------------------------------- the player -- */
  var playerDlg = $('#playerDlg');

  /* True while the history is doing the driving, so the handlers below do
     not answer each other in a circle. */
  var steering = false;

  /* The address is rewritten, never stacked. An earlier version pushed an
     entry for each video so that Back closed the player, and that turned
     out to be built on a false assumption: the embed is a frame, and every
     related video a reader clicks inside it navigates that frame, which
     adds a history entry of its own. Closing then walked back through all
     of them one press at a time. Depth we do not control is depth we
     cannot count on, so the player no longer uses any: the link stays
     share-able, the close button closes, and Back means what it meant
     before, which is leave the page. */
  function address(hash) {
    if (!window.history || !history.replaceState) { return; }
    history.replaceState(null, '', hash
      ? '#' + hash
      : location.pathname + location.search);
  }

  function play(id, fromHistory) {
    var v = allVideos()[id] || CONFIG.featured;
    if (!fromHistory) { address(slugById[id]); }
    $('#playerTitle').textContent = v.title;
    /* Who made it and how long it runs, the same two facts the card
       carries, so the dialog is not a step backwards from the shelf. */
    $('#playerMeta').textContent = [v.by, v.time].filter(Boolean).join(' \u00b7 ');
    /* Unsplash asks that the photographer be credited wherever their photo
       is used. The card has no room for it; this does. */
    var credit = $('#playerCredit');
    if (v.cover && v.cover.by) {
      credit.innerHTML = 'Cover photo: <a href="' + esc(v.cover.profile) +
        '?utm_source=tandava_wellness&utm_medium=referral" target="_blank" rel="noopener">' +
        esc(v.cover.by) + '</a> on <a href="https://unsplash.com/?utm_source=tandava_wellness' +
        '&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>';
    } else {
      credit.textContent = '';
    }
    /* youtube-nocookie keeps the embed from writing advertising cookies. */
    /* rel=0 keeps the end screen to the same channel, modestbranding and
       iv_load_policy=3 drop the logo and the annotations, and playsinline
       stops an iPhone throwing the video into its own fullscreen player,
       which would leave this dialog open behind it. */
    $('#player').innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
      '?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3"' +
      ' title="' + esc(v.title) + '"' +
      ' allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    if (playerDlg.showModal) { playerDlg.showModal(); } else { playerDlg.setAttribute('open', ''); }
  }

  /* ------------------------------------------------------------- events -- */
  document.addEventListener('click', function (e) {
    var p = e.target.closest('[data-play]');
    if (p) { play(p.getAttribute('data-play'), false); return; }

    var a = e.target.closest('[data-scroll]');
    if (a) {
      var t = a.parentElement.querySelector('.lb-track');
      t.scrollBy({ left: Number(a.getAttribute('data-scroll')) * t.clientWidth * 0.85, behavior: 'smooth' });
      return;
    }

    var x = e.target.closest('[data-close]');
    if (x) { x.closest('dialog').close(); }
  });

  /* A click on the backdrop lands on the dialog itself, never on the card
     inside it, so this closes on a click outside the video. */
  playerDlg.addEventListener('click', function (e) {
    if (e.target === playerDlg) { playerDlg.close(); }
  });
  /* Stop the audio the moment it closes, by whichever of the three ways,
     and put the address back to the library so the two never disagree. */
  playerDlg.addEventListener('close', function () {
    $('#player').innerHTML = '';
    if (!steering && idBySlug[location.hash.slice(1)]) { address(''); }
  });

  /* The address bar is the other way in: a link to #mind-lake opens that
     video on arrival, and a reader who edits the hash by hand is followed
     rather than ignored. */
  function fromHash() {
    var id = idBySlug[location.hash.slice(1)];
    if (id) { play(id, true); return; }
    if (playerDlg.open) {
      steering = true;
      playerDlg.close();
      steering = false;
    }
  }
  window.addEventListener('popstate', fromHash);

  $('#search').addEventListener('input', function (e) {
    query = e.target.value.trim();
    renderRows();
  });

  /* --------------------------------------------- the ends of each row -- */
  /* Which end a row is sitting at decides whether its fade and its arrow
     are there at all: an arrow pointing at nothing is worse than none. */
  function markEnds(wrap) {
    var t = wrap.querySelector('.lb-track');
    var room = t.scrollWidth - t.clientWidth;
    wrap.classList.toggle('is-at-start', t.scrollLeft <= 2);
    wrap.classList.toggle('is-at-end', t.scrollLeft >= room - 2);
    wrap.classList.toggle('is-still', room <= 2);   /* nothing to scroll */
  }
  function watchTracks() {
    [].forEach.call(rows.querySelectorAll('[data-wrap]'), function (wrap) {
      markEnds(wrap);
      wrap.querySelector('.lb-track').addEventListener('scroll', function () {
        markEnds(wrap);
      }, { passive: true });
    });
  }
  /* A window that grows, or a phone turned on its side, changes what is
     above the fold without anybody scrolling. Both of the things that
     depend on the fold are re-measured here. */
  window.addEventListener('resize', function () {
    [].forEach.call(rows.querySelectorAll('[data-wrap]'), markEnds);
    sweep();
  });

  /* ------------------------------------------------ rows easing in -- */
  /* Only ever switched on when it can also be switched off: the hidden
     state below lives under a class this adds, so a reader who has asked
     for less motion gets the page already in place rather than a page that
     has to animate before it exists. */
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CAN_REVEAL = !still;

  /* Deliberately a scroll sweep rather than an IntersectionObserver. The
     observer reports what was on screen at a frame boundary, so a fling, a
     jump to an anchor or a restored scroll position can carry a row past
     the window between two frames: it never intersects, never fires, and
     stays invisible for the rest of the visit. Measured on every scroll
     instead, a row that is anywhere at or above the fold is shown, and
     there is no sequence of scrolling that can leave content hidden. */
  var sweeping = false;

  function sweep() {
    sweeping = false;
    var fold = window.innerHeight * 0.92;
    var waiting = 0;
    [].forEach.call(rows.querySelectorAll('.lb-row:not(.is-in)'), function (row) {
      if (row.getBoundingClientRect().top < fold) { row.classList.add('is-in'); }
      else { waiting++; }
    });
    /* Nothing left below the fold: stop listening. */
    if (!waiting) { window.removeEventListener('scroll', onScroll); }
  }
  function onScroll() {
    if (sweeping) { return; }
    sweeping = true;
    requestAnimationFrame(sweep);
  }

  function reveal() {
    if (!CAN_REVEAL) { return; }
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    sweep();
  }

  if (CAN_REVEAL) { rows.classList.add('lb-rows--reveal'); }

  render();
  ready = true;
  watchTracks();
  reveal();
  fromHash();
}());
