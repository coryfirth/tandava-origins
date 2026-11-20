/* ==========================================================================
   Lifestyle Library — /tool-kit-NEW/

   The CONFIG block below is the library. Everything under it draws the
   page from that block and nothing else, so adding, removing or reordering
   a video or a whole row is an edit to one list and nothing more.

   `id` is the eleven characters after "v=" in a YouTube link. `img` is the
   picture on the card, `time` its length as the player shows it, and `img`
   is the reason this list exists in this shape:
   a YouTube thumbnail arrives wearing somebody else's branding, their face,
   their typeface, their channel's colours. Every card here carries a plain
   photograph instead, so the shelf reads as one library rather than twenty
   channels. Leave `img` off and the card falls back to YouTube's own
   thumbnail, which is a usable stopgap and not where a card should end up.
   Leave `time` off and the card simply goes without its pill. Every one
   below was read from the video itself rather than guessed, and no pill
   at all beats a wrong one.

   The pictures live in /assets/tool-kit/ and came from Unsplash under its
   free licence, which asks for no attribution. The exact source of each is
   written down in that folder's CREDITS.txt.

   The page itself has no way to add a video on purpose: the library is
   edited here, in the file, not by whoever happens to be reading it.
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    /* The big one at the top. */
    featured: {
      id: '5MuIMqhT8DM',
      img: '/assets/tool-kit/hero-sleep.jpg',
      time: '19:18',
      eyebrow: 'Featured · Sleep',
      title: 'Sleep is your superpower',
      blurb: 'Start here. Sleep scientist Matt Walker on why sleep is the foundation every other habit is built on.'
    },

    /* One row each, in this order. */
    categories: [
      { name: 'Sleep', note: 'Wind down and wake up better', videos: [
        { id: '5MuIMqhT8DM', img: '/assets/tool-kit/sleep-superpower.jpg', time: '19:18',
          title: 'Sleep Is Your Superpower | Matt Walker | TED' },
        { id: 'h2aWYjSA1Jc', img: '/assets/tool-kit/sleep-clock.jpg', time: '1:41:54',
          title: 'Sleep Toolkit: Tools for Optimizing Sleep & Sleep-Wake Timing' },
        { id: 'nm1TxQj9IsQ', img: '/assets/tool-kit/sleep-morning-window.jpg', time: '1:22:05',
          title: 'Master Your Sleep & Be More Alert When Awake' },
        { id: 'fk-_SwHhLLc', img: '/assets/tool-kit/sleep-linen.jpg', time: '7:40',
          title: 'Sleep Hygiene: Train Your Brain to Fall Asleep and Sleep Better' },
        { id: 'BiWDsfZ3zbo', img: '/assets/tool-kit/sleep-evening-yoga.jpg', time: '12:03',
          title: 'Wind Down Yoga | 12-Minute Bedtime Yoga' }
      ]},
      { name: 'Diet & Nutrition', note: 'Eat for energy and longevity', videos: [
        { id: '1sISguPDlhY', img: '/assets/tool-kit/food-yogurt.jpg', time: '5:09',
          title: 'How the food you eat affects your gut — Shilpa Ravella' },
        { id: 'xyQY8a-ng6g', img: '/assets/tool-kit/food-nuts.jpg', time: '4:52',
          title: 'How the food you eat affects your brain — Mia Nacamulli' },
        { id: '0z03xkwFbw4', img: '/assets/tool-kit/food-spread.jpg', time: '19:12',
          title: 'What is the best diet for humans? | Eran Segal' },
        { id: 'zpNoYgccmR0', img: '/assets/tool-kit/food-market.jpg', time: '13:28',
          title: 'Unlock the science of nutrition | Dr. Federica Amati' },
        { id: 'jpBuzAJCOl4', img: '/assets/tool-kit/food-pastries.jpg', time: '3:53',
          title: 'What is a glucose spike? | Dr. Casey Means' },
        { id: 'Q4yUlJV31Rk', img: '/assets/tool-kit/food-chopping.jpg', time: '9:18',
          title: 'How to make healthy eating unbelievably easy | Luke Durward' },
        { id: '3dqXHHCc5lA', img: '/assets/tool-kit/food-salad.jpg', time: '17:43',
          title: 'The role of nutrition in mental health | Julia Rucklidge' }
      ]},
      { name: 'Movement', note: 'Gentle ways to get moving', videos: [
        { id: 'v7AYKMP6rOE', img: '/assets/tool-kit/move-yoga-home.jpg', time: '23:45',
          title: 'Yoga For Complete Beginners — 20 Minute Home Yoga' },
        { id: 'g_tea8ZNk5A', img: '/assets/tool-kit/move-stretch.jpg', time: '16:32',
          title: '15 Min. Full Body Stretch | Flexibility, Mobility & Relaxation' },
        { id: 'Nw2oBIrQGLo', img: '/assets/tool-kit/move-childs-pose.jpg', time: '15:04',
          title: '15 Minute Calming Yoga for Stress Relief and Anxiety' }
      ]},
      { name: 'Mind & Breath', note: 'Short practices for calm and focus', videos: [
        { id: 'inpok4MKVLM', img: '/assets/tool-kit/mind-meditate-outside.jpg', time: '5:17',
          title: '5-Minute Meditation You Can Do Anywhere' },
        { id: 'O-6f5wQXSu8', img: '/assets/tool-kit/mind-eyes-closed.jpg', time: '10:20',
          title: '10-Minute Meditation For Anxiety' },
        { id: 'ZToicYcHIOU', img: '/assets/tool-kit/mind-lake.jpg', time: '10:30',
          title: 'Daily Calm | 10 Minute Mindfulness' },
        { id: 'aXItOY0sLRY', img: '/assets/tool-kit/mind-clouds.jpg', time: '10:00',
          title: 'Relax and Breathe: Do Nothing for 10 Minutes' },
        { id: 'tybOi4hjZFQ', img: '/assets/tool-kit/mind-cold-water.jpg', time: '11:00',
          title: 'Guided Wim Hof Method Breathing' }
      ]}
    ]
  };
  /* ===================== end of the library ===================== */

  var $ = function (s) { return document.querySelector(s); };

  var hero = $('#hero');
  var rows = $('#rows');
  if (!hero || !rows) { return; }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
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

  function allVideos() {
    var map = {};
    CONFIG.categories.forEach(function (c) {
      c.videos.forEach(function (v) { map[v.id] = v; });
    });
    return map;
  }

  var PLAY_ICON = '<svg aria-hidden="true" width="15" height="15" viewBox="0 0 20 20"><path d="M6 4l10 6-10 6z" fill="currentColor"/></svg>';
  var ARROW_L = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6-6 6 6 6"/></svg>';
  var ARROW_R = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m10 6 6 6-6 6"/></svg>';

  /* The card's picture: the one named in the list, or, failing that,
     YouTube's own with its sizes to fall back through. */
  function picture(v, lazy) {
    var load = lazy ? ' loading="lazy"' : ' fetchpriority="high"';
    if (v.img) {
      return '<img' + load + ' src="' + v.img + '" alt="" width="800" height="450" decoding="async">';
    }
    return '<img' + load + ' src="' + thumb(v.id) + '"' +
      ' data-next="' + thumb(v.id, 'mqdefault') + '"' +
      ' alt="" width="1280" height="720" decoding="async">';
  }

  /* The play badge sits on the picture at rest rather than waiting for a
     hover: on a phone there is no hover, and a still photograph with
     nothing on it does not say "video". */
  function cardHTML(v) {
    return '<div class="lb-card">' +
      '<button class="lb-card__open" type="button" data-play="' + v.id + '">' +
        '<span class="lb-thumb">' +
          picture(v, true) +
          '<span class="lb-thumb__veil" aria-hidden="true"></span>' +
          '<span class="lb-thumb__play" aria-hidden="true">' + PLAY_ICON + '</span>' +
          (v.time ? '<span class="lb-thumb__time">' + esc(v.time) + '</span>' : '') +
        '</span>' +
        '<span class="lb-card__title">' + esc(v.title) + '</span>' +
      '</button>' +
    '</div>';
  }

  function rowHTML(name, note, vids) {
    return '<section class="lb-row">' +
      '<div class="lb-row__head">' +
        '<h2 class="lb-row__title">' + esc(name) + '</h2>' +
        (note ? '<span class="lb-row__note">' + esc(note) + '</span>' : '') +
      '</div>' +
      '<div class="lb-track-wrap">' +
        '<button class="lb-arrow lb-arrow--l" type="button" data-scroll="-1" aria-label="Scroll left">' + ARROW_L + '</button>' +
        '<div class="lb-track">' + vids.map(cardHTML).join('') + '</div>' +
        '<button class="lb-arrow lb-arrow--r" type="button" data-scroll="1" aria-label="Scroll right">' + ARROW_R + '</button>' +
      '</div>' +
    '</section>';
  }

  function renderHero() {
    var f = CONFIG.featured;
    var bg = f.img
      ? '<img class="lb-hero__bg" src="' + f.img + '" alt="" width="1800" height="1013"' +
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
      html += CONFIG.categories.map(function (c) { return rowHTML(c.name, c.note, c.videos); }).join('');
    }
    rows.innerHTML = html;
    watchAll(rows);
    /* While a search is running the featured video is beside the point. */
    hero.hidden = !!query;
  }

  function render() { renderHero(); renderRows(); }

  /* --------------------------------------------------------- the player -- */
  var playerDlg = $('#playerDlg');

  function play(id) {
    var v = allVideos()[id] || { title: CONFIG.featured.title };
    $('#playerTitle').textContent = v.title;
    /* youtube-nocookie keeps the embed from writing advertising cookies. */
    $('#player').innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
      '?autoplay=1&rel=0" title="' + esc(v.title) + '"' +
      ' allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    if (playerDlg.showModal) { playerDlg.showModal(); } else { playerDlg.setAttribute('open', ''); }
  }

  /* ------------------------------------------------------------- events -- */
  document.addEventListener('click', function (e) {
    var p = e.target.closest('[data-play]');
    if (p) { play(p.getAttribute('data-play')); return; }

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
  /* Stop the audio the moment it closes, by whichever of the three ways. */
  playerDlg.addEventListener('close', function () { $('#player').innerHTML = ''; });

  $('#search').addEventListener('input', function (e) {
    query = e.target.value.trim();
    renderRows();
  });

  render();
}());
