/* Gemeinsame Navigation – Menü mobil, Untermenü „Tools“, Scroll-Zustand der Startseite */
(function () {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;

  var burger = nav.querySelector('.hamburger');
  var links = nav.querySelector('.nav-links');
  var subs = Array.prototype.slice.call(nav.querySelectorAll('.nav-sub'));

  function setMenu(open) {
    if (!links || !burger) return;
    links.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function closeSubs(except) {
    subs.forEach(function (li) {
      if (li === except) return;
      li.classList.remove('open');
      var b = li.querySelector('.nav-sub-toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(!links.classList.contains('open'));
    });
  }
  if (links) {
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); closeSubs(); });
    });
  }

  subs.forEach(function (li) {
    var btn = li.querySelector('.nav-sub-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = !li.classList.contains('open');
      closeSubs(li);
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    li.addEventListener('focusout', function (e) {
      if (!li.contains(e.relatedTarget)) {
        li.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.nav-sub')) closeSubs();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openSub = subs.filter(function (li) { return li.classList.contains('open'); })[0];
    closeSubs();
    if (openSub) openSub.querySelector('.nav-sub-toggle').focus();
    if (links && links.classList.contains('open')) { setMenu(false); burger.focus(); }
  });

  if (window.matchMedia) {
    var mq = window.matchMedia('(min-width: 901px)');
    var onChange = function (e) { if (e.matches) setMenu(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }

  if (nav.classList.contains('nav--hero')) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 60); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
