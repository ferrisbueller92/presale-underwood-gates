/* Underwood Fencing & Gates — nav scroll state, mobile drawer, scroll-reveal. */
(function () {
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('navDrawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () { drawer.classList.toggle('open'); });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { drawer.classList.remove('open'); });
    });
  }

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
})();


/* Hero video — force muted autoplay. Safari (macOS + iOS) ignores the `autoplay` attribute
   and shows a paused frame + play button. WebKit blocks play() during page load but allows
   it once the load event fires, so we kick it off then and retry; a first-interaction
   fallback covers iOS Low Power Mode / "Auto-Play: Never". */
(function () {
  var v = document.querySelector('.hero-media video, .hero video, video[autoplay], video');
  if (!v) return;
  v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '');
  v.playsInline = true; v.setAttribute('playsinline', '');
  var play = function () { try { var p = v.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} };
  var tries = 0;
  var pump = function () { play(); if (v.paused && ++tries < 10) setTimeout(pump, 300); };
  if (document.readyState === 'complete') pump();
  else window.addEventListener('load', pump, { once: true });
  ['touchstart', 'pointerdown', 'click', 'scroll', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, play, { passive: true, once: true });
  });
})();
