/* ==========================================================================
   /start/ — the photo slider in the second section.

   The only thing on this page that is not either the live site's own
   component or plain markup. Everything else is driven by kit.js, app.js
   and consult.js, which this page loads unchanged.

   It builds its own dots and thumbnails from the slides in the markup, so
   adding or removing a slide means touching the HTML only.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('[data-slider]');
  if (!root) { return; }

  var track  = root.querySelector('[data-slider-track]');
  var slides = [].slice.call(track.children);
  var dots   = root.querySelector('[data-slider-dots]');
  var thumbs = root.querySelector('[data-slider-thumbs]');
  if (slides.length < 2) { return; }

  var index = 0;
  var dotBtns = [];
  var thumbBtns = [];

  function label(i) {
    var img = slides[i].querySelector('img');
    return (img && img.getAttribute('alt')) || ('Slide ' + (i + 1));
  }

  slides.forEach(function (slide, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', label(i));
    dot.addEventListener('click', function () { go(i); });
    dots.appendChild(dot);
    dotBtns.push(dot);

    var thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.setAttribute('aria-label', label(i));
    var img = slide.querySelector('img');
    if (img) {
      thumb.style.backgroundImage = 'url("' + img.getAttribute('src') + '")';
      /* The slide's own backdrop, so a contained shot keeps its colour
         rather than falling through to the page. */
      thumb.style.backgroundColor = slide.style.backgroundColor || '';
      /* A slide that is contained in the frame is contained in its thumb
         too. The phone shot is tall and mostly pale, so a square centre
         crop of it would read as a blank disc. */
      if (slide.classList.contains('s-slide--contain')) {
        thumb.classList.add('s-slider__thumb--contain');
      }
    }
    thumb.addEventListener('click', function () { go(i); });
    thumbs.appendChild(thumb);
    thumbBtns.push(thumb);
  });

  function paint() {
    track.style.transform = 'translateX(' + (-100 * index) + '%)';
    slides.forEach(function (s, i) {
      /* Off-screen slides are out of the tab order and out of the
         accessibility tree; only the one on show is reachable. */
      s.setAttribute('aria-hidden', String(i !== index));
    });
    [dotBtns, thumbBtns].forEach(function (set) {
      set.forEach(function (b, i) {
        if (i === index) { b.setAttribute('aria-current', 'true'); }
        else { b.removeAttribute('aria-current'); }
      });
    });
  }

  function go(i) {
    index = (i + slides.length) % slides.length;
    paint();
  }

  root.querySelector('[data-slider-prev]').addEventListener('click', function () { go(index - 1); });
  root.querySelector('[data-slider-next]').addEventListener('click', function () { go(index + 1); });

  /* Arrow keys once the slider has focus, the same as the site's other
     tablists. */
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  });

  paint();
})();
