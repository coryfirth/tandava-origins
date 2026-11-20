/* ==========================================================================
   Lifestyle Library — /tool-kit-NEW/

   The CONFIG block below is the library. Everything under it draws the
   page from that block and nothing else, so adding, removing or reordering
   a video or a whole row is an edit to one list.

   The "Add a video" panel on the page writes to the visitor's own browser
   only, and hands back a block to paste over `categories` here. That paste
   is what makes a video permanent for everyone.
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    /* The big one at the top. `id` is the part after "v=" in a YouTube link. */
    featured: {
      id: '5MuIMqhT8DM',
      eyebrow: 'Featured · Sleep',
      title: 'Sleep is your superpower',
      blurb: 'Start here. Sleep scientist Matt Walker on why sleep is the foundation every other habit is built on.'
    },

    /* One row each, in this order. */
    categories: [
      { name: 'Sleep', note: 'Wind down and wake up better', videos: [
        { id: '5MuIMqhT8DM', title: 'Sleep Is Your Superpower | Matt Walker | TED' },
        { id: 'h2aWYjSA1Jc', title: 'Sleep Toolkit: Tools for Optimizing Sleep & Sleep-Wake Timing' },
        { id: 'nm1TxQj9IsQ', title: 'Master Your Sleep & Be More Alert When Awake' },
        { id: 'fk-_SwHhLLc', title: 'Sleep Hygiene: Train Your Brain to Fall Asleep and Sleep Better' },
        { id: 'BiWDsfZ3zbo', title: 'Wind Down Yoga | 12-Minute Bedtime Yoga' }
      ]},
      { name: 'Diet & Nutrition', note: 'Eat for energy and longevity', videos: [
        { id: '1sISguPDlhY', title: 'How the food you eat affects your gut — Shilpa Ravella' },
        { id: 'xyQY8a-ng6g', title: 'How the food you eat affects your brain — Mia Nacamulli' },
        { id: '0z03xkwFbw4', title: 'What is the best diet for humans? | Eran Segal' },
        { id: 'zpNoYgccmR0', title: 'Unlock the science of nutrition | Dr. Federica Amati' },
        { id: 'jpBuzAJCOl4', title: 'What is a glucose spike? | Dr. Casey Means' },
        { id: 'Q4yUlJV31Rk', title: 'How to make healthy eating unbelievably easy | Luke Durward' },
        { id: '3dqXHHCc5lA', title: 'The role of nutrition in mental health | Julia Rucklidge' }
      ]},
      { name: 'Movement', note: 'Gentle ways to get moving', videos: [
        { id: 'v7AYKMP6rOE', title: 'Yoga For Complete Beginners — 20 Minute Home Yoga' },
        { id: 'g_tea8ZNk5A', title: '15 Min. Full Body Stretch | Flexibility, Mobility & Relaxation' },
        { id: 'Nw2oBIrQGLo', title: '15 Minute Calming Yoga for Stress Relief and Anxiety' }
      ]},
      { name: 'Mind & Breath', note: 'Short practices for calm and focus', videos: [
        { id: 'inpok4MKVLM', title: '5-Minute Meditation You Can Do Anywhere' },
        { id: 'O-6f5wQXSu8', title: '10-Minute Meditation For Anxiety' },
        { id: 'ZToicYcHIOU', title: 'Daily Calm | 10 Minute Mindfulness' },
        { id: 'aXItOY0sLRY', title: 'Relax and Breathe: Do Nothing for 10 Minutes' },
        { id: 'tybOi4hjZFQ', title: 'Guided Wim Hof Method Breathing' }
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

  var store = {
    get: function (k, d) {
      try { var v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; }
      catch (e) { return d; }
    },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  var added = store.get('lb-added', []);   /* [{cat, id, title}] this browser */
  var saved = store.get('lb-saved', []);   /* [id] this browser              */
  var query = '';

  /* The library as it stands: the block above, plus whatever this browser
     has added, without touching CONFIG itself. */
  function library() {
    var cats = CONFIG.categories.map(function (c) {
      return { name: c.name, note: c.note, videos: c.videos.slice() };
    });
    added.forEach(function (a) {
      var c = cats.filter(function (c) { return c.name === a.cat; })[0];
      var here = c && c.videos.some(function (v) { return v.id === a.id; });
      if (c && !here) { c.videos.push({ id: a.id, title: a.title }); }
    });
    return cats;
  }
  function allVideos() {
    var map = {};
    library().forEach(function (c) {
      c.videos.forEach(function (v) { map[v.id] = v; });
    });
    return map;
  }
  function parseId(url) {
    var s = String(url).trim();
    var m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/) || s.match(/^([\w-]{11})$/);
    return m ? m[1] : null;
  }

  var PLAY_ICON = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20"><path d="M6 4l10 6-10 6z" fill="#212C28"/></svg>';
  var ARROW_L = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6-6 6 6 6"/></svg>';
  var ARROW_R = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m10 6 6 6-6 6"/></svg>';
  var TICK = '<svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';
  var PLUS = '<svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';

  function isSaved(id) { return saved.indexOf(id) !== -1; }

  function cardHTML(v) {
    var on = isSaved(v.id);
    return '<div class="lb-card">' +
      '<button class="lb-card__open" type="button" data-play="' + v.id + '">' +
        '<span class="lb-thumb">' +
          '<img loading="lazy" src="' + thumb(v.id) + '" data-next="' + thumb(v.id, 'mqdefault') + '"' +
            ' alt="" width="1280" height="720">' +
          '<span class="lb-thumb__play"><span>' + PLAY_ICON + '</span></span>' +
        '</span>' +
        '<span class="lb-card__title">' + esc(v.title) + '</span>' +
      '</button>' +
      '<button class="lb-save' + (on ? ' lb-save--on' : '') + '" type="button" data-save="' + v.id + '"' +
        ' aria-pressed="' + on + '" aria-label="' + (on ? 'Remove from' : 'Add to') + ' my list">' +
        (on ? TICK : PLUS) +
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
    var on = isSaved(f.id);
    hero.innerHTML =
      '<img class="lb-hero__bg" src="' + thumb(f.id, 'maxresdefault') + '" alt=""' +
        ' data-next="' + thumb(f.id, 'hq720') + ' ' + thumb(f.id, 'mqdefault') + '"' +
        ' fetchpriority="high" decoding="async">' +
      '<div class="lb-hero__scrim" aria-hidden="true"></div>' +
      '<div class="lb-hero__copy"><div class="lb-hero__inner">' +
        '<span class="eyebrow">' + esc(f.eyebrow) + '</span>' +
        '<h1 class="lb-hero__title" id="hero-title">' + esc(f.title) + '</h1>' +
        '<p class="lb-hero__lead">' + esc(f.blurb) + '</p>' +
        '<div class="lb-hero__actions">' +
          '<button class="btn lb-btn-paper" type="button" data-play="' + f.id + '">Play</button>' +
          '<button class="btn lb-btn-ghost" type="button" data-save="' + f.id + '">' +
            (on ? 'In my list' : 'Add to my list') +
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
      var lib = allVideos();
      var mine = saved.map(function (id) { return lib[id]; })
                      .filter(function (v) { return !!v; });
      if (mine.length) { html += rowHTML('My list', 'Saved on this device', mine); }
      html += library().map(function (c) { return rowHTML(c.name, c.note, c.videos); }).join('');
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

  function toggleSave(id) {
    saved = isSaved(id) ? saved.filter(function (x) { return x !== id; }) : saved.concat([id]);
    store.set('lb-saved', saved);
    render();
  }

  /* ------------------------------------------------------------- events -- */
  document.addEventListener('click', function (e) {
    var p = e.target.closest('[data-play]');
    if (p) { play(p.getAttribute('data-play')); return; }

    var s = e.target.closest('[data-save]');
    if (s) { toggleSave(s.getAttribute('data-save')); return; }

    var a = e.target.closest('[data-scroll]');
    if (a) {
      var t = a.parentElement.querySelector('.lb-track');
      t.scrollBy({ left: Number(a.getAttribute('data-scroll')) * t.clientWidth * 0.85, behavior: 'smooth' });
      return;
    }

    var x = e.target.closest('[data-close]');
    if (x) { x.closest('dialog').close(); }
  });

  /* A click on the backdrop lands on the dialog itself, never on its card. */
  [].forEach.call(document.querySelectorAll('dialog'), function (d) {
    d.addEventListener('click', function (e) { if (e.target === d) { d.close(); } });
  });
  /* Stop the audio the moment the dialog closes, however it was closed. */
  playerDlg.addEventListener('close', function () { $('#player').innerHTML = ''; });

  $('#search').addEventListener('input', function (e) {
    query = e.target.value.trim();
    renderRows();
  });

  /* ------------------------------------------------- the editing panel -- */
  var addDlg = $('#addDlg');
  var addMsg = $('#addMsg');
  var DEFAULT_MSG = addMsg ? addMsg.innerHTML : '';

  function refreshExport() {
    $('#exportBox').value = JSON.stringify(library(), null, 2);
  }

  $('#openAdd').addEventListener('click', function () {
    $('#addCat').innerHTML = CONFIG.categories.map(function (c) {
      return '<option>' + esc(c.name) + '</option>';
    }).join('');
    addMsg.innerHTML = DEFAULT_MSG;
    refreshExport();
    addDlg.showModal();
  });

  $('#addForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var id = parseId($('#addUrl').value);
    if (!id) {
      addMsg.textContent = 'That does not look like a YouTube link. Try one like https://www.youtube.com/watch?v=…';
      return;
    }
    added = added.concat([{ cat: $('#addCat').value, id: id, title: $('#addTitle').value.trim() }]);
    store.set('lb-added', added);
    $('#addUrl').value = '';
    $('#addTitle').value = '';
    addMsg.textContent = 'Added. It is at the end of its row now, in this browser.';
    refreshExport();
    render();
  });

  $('#copyBtn').addEventListener('click', function () {
    var btn = this;
    var done = function () { btn.textContent = 'Copied'; };
    var fallback = function () { $('#exportBox').select(); btn.textContent = 'Press ⌘C'; };
    if (navigator.clipboard) {
      navigator.clipboard.writeText($('#exportBox').value).then(done, fallback);
    } else { fallback(); }
  });

  $('#resetBtn').addEventListener('click', function () {
    added = [];
    store.set('lb-added', added);
    addMsg.textContent = 'Your added videos are gone. The library is back to what library.js says.';
    refreshExport();
    render();
  });

  render();
}());
