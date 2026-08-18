/* ============================================================
   HUIYIJIA — Premium Effects Engine
   React Bits · Aceternity UI · Uiverse.io
   ============================================================ */
(function () {
  'use strict';

  /* — 1. COUNT UP (React Bits) — Animated number counter — */
  function initCountUp() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = el.getAttribute('data-count');
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var isText = isNaN(parseInt(target));

        if (isText) {
          el.textContent = prefix + target + suffix;
          observer.unobserve(el);
          return;
        }

        var end = parseFloat(target);
        var duration = 1800;
        var start = null;
        el.classList.add('counting');

        function animate(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = end * eased;

          if (end >= 10000) {
            el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
          } else if (end % 1 !== 0) {
            el.textContent = prefix + current.toFixed(1) + suffix;
          } else {
            el.textContent = prefix + Math.round(current) + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = prefix + target + suffix;
            el.classList.remove('counting');
          }
        }
        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });

    nums.forEach(function (n) { observer.observe(n); });
  }

  /* — 2. TEXT GENERATE (Aceternity UI) — Word-by-word blur reveal — */
  function initTextGenerate() {
    var els = document.querySelectorAll('.text-generate');
    if (!els.length) return;

    els.forEach(function (el) {
      if (el.dataset.split) return;
      var text = el.textContent.trim();
      var words = text.split(/\s+/);
      el.innerHTML = words.map(function (w) {
        return '<span class="gen-word">' + w + '</span>';
      }).join(' ');
      el.dataset.split = '1';

      var wordEls = el.querySelectorAll('.gen-word');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          wordEls.forEach(function (w, i) {
            w.style.transitionDelay = (i * 80) + 'ms';
          });
          el.classList.add('gen-visible');
          observer.unobserve(el);
        });
      }, { threshold: 0.3 });
      observer.observe(el);
    });
  }

  /* — 3. CARD SPOTLIGHT (Aceternity UI) — Mouse-following radial glow — */
  function initCardSpotlight() {
    var cards = document.querySelectorAll('.card-spotlight');
    if (!cards.length) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
      });
    });
  }

  /* — 4. GLARE CARD (Aceternity UI) — Cursor-following sheen — */
  function initGlareCard() {
    var cards = document.querySelectorAll('.glare-card');
    if (!cards.length) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var cx = e.clientX - (rect.left + rect.width / 2);
        var cy = e.clientY - (rect.top + rect.height / 2);
        var angle = Math.atan2(cy, cx) * 180 / Math.PI;
        card.style.setProperty('--glare-angle', (angle + 45) + 'deg');
      });
    });
  }

  /* — 5. TRACING BEAM (Aceternity UI) — Scroll-drawn SVG path — */
  function initTracingBeam() {
    var wrappers = document.querySelectorAll('.tracing-beam-wrapper');
    if (!wrappers.length) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    wrappers.forEach(function (wrapper) {
      var svg = wrapper.querySelector('.tracing-beam-svg');
      var path = wrapper.querySelector('.tracing-beam-path');
      if (!path) return;

      var totalHeight = wrapper.scrollHeight;
      var pathLen = 0;

      function setup() {
        totalHeight = wrapper.scrollHeight;
        path.setAttribute('d', 'M 0.5 0 L 0.5 ' + totalHeight);
        pathLen = path.getTotalLength();
        path.style.strokeDasharray = pathLen;
        path.style.strokeDashoffset = pathLen;
      }

      function update() {
        var rect = wrapper.getBoundingClientRect();
        var start = rect.top + window.innerHeight * 0.3;
        var end = rect.bottom - window.innerHeight * 0.3;
        var range = end - start;
        if (range <= 0) return;

        var progress = Math.max(0, Math.min(1, (window.innerHeight * 0.5 - start) / range));
        path.style.strokeDashoffset = pathLen * (1 - progress);
      }

      setup();
      update();
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            update();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
      window.addEventListener('resize', setup);
    });
  }

  /* — 6. MAGNETIC BUTTON — Subtle pull toward cursor — */
  function initMagnetic() {
    var els = document.querySelectorAll('.magnetic');
    if (!els.length) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    els.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - (rect.left + rect.width / 2);
        var y = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = 'translate(' + (x * 0.2) + 'px,' + (y * 0.2) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* — 7. TILT CARD — 3D perspective tilt on hover — */
  function initTilt() {
    var els = document.querySelectorAll('.tilt-card');
    if (!els.length) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    els.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = 'perspective(800px) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 8) + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
      });
    });
  }

  /* — 8. RIPPLE BUTTON (Uiverse) — Material ripple on click — */
  function initRipple() {
    var els = document.querySelectorAll('.ripple-btn');
    if (!els.length) return;

    els.forEach(function (el) {
      el.addEventListener('click', function (e) {
        var rect = el.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var x = e.clientX - rect.left - size / 2;
        var y = e.clientY - rect.top - size / 2;
        var span = document.createElement('span');
        span.className = 'ripple-span';
        span.style.width = span.style.height = size + 'px';
        span.style.left = x + 'px';
        span.style.top = y + 'px';
        el.appendChild(span);
        setTimeout(function () { span.remove(); }, 600);
      });
    });
  }

  /* — 9. FADE-UP / SCROLL-TOP / HERO SLIDER — handled by i18n.js, no duplicates — */

  /* — INIT ALL — */
  function init() {
    initCountUp();
    initTextGenerate();
    initCardSpotlight();
    initGlareCard();
    initTracingBeam();
    initMagnetic();
    initTilt();
    initRipple();
  }

  /* — Re-split text-generate after language change — */
  window.addEventListener('load', function () {
    if (typeof setLang === 'function') {
      var origSetLang = window.setLang;
      window.setLang = function (l) {
        origSetLang(l);
        document.querySelectorAll('.text-generate').forEach(function (el) {
          el.removeAttribute('data-split');
          el.classList.remove('gen-visible');
        });
        setTimeout(initTextGenerate, 50);
      };
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
