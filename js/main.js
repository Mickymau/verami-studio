/* ============================================
   VERAMI.STUDIO — main.js
   Punkt wejscia. Laduje i inicjalizuje
   wszystkie moduly na odpowiednich stronach.
   ============================================ */

'use strict';

/* ------------------------------------------------
   STICKY HEADER
   Nav jest transparentny na gorze strony.
   Po 40px scrolla dostaje klase .is-scrolled
   (CSS dodaje frosted glass i border).
   ------------------------------------------------ */
(function initHeader() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  /* Jesli nav ma juz is-scrolled w HTML (podstrony) — nie ruszamy klasy */
  if (nav.classList.contains('is-scrolled')) return;

  function update() {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); /* Stan przy zaladowaniu (np. odswiezenie w polowie strony) */
})();


/* ------------------------------------------------
   MOBILE MENU
   Hamburger otwiera pelnoekranowe menu.
   Blokuje scroll body kiedy menu jest otwarte.
   Zamyka sie: klik linku, Escape, klik poza.
   ------------------------------------------------ */
(function initMobileMenu() {
  const hamburger  = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (!hamburger || !mobileMenu) return;

  function open() {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    /* Wymusz is-scrolled gdy menu otwarte — logo i X zawsze ciemne */
    nav.classList.add('is-scrolled');
  }

  function close() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    /* Przywroc transparentny nav jesli uzytkownik jest na gorze strony */
    if (window.scrollY <= 40) {
      nav.classList.remove('is-scrolled');
    }
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('is-open') ? close() : open();
  });

  /* Zamknij po kliknieciu linku */
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  /* Zamknij Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();


/* ------------------------------------------------
   ACTIVE NAV LINK
   Podswietla link w nav odpowiadajacy
   aktualnej stronie na podstawie pathname.
   ------------------------------------------------ */
(function initActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const isHome = (page === '' || page === 'index.html') && href === 'index.html';
    if (href === page || isHome) {
      link.classList.add('is-active');
    }
  });
})();


/* ------------------------------------------------
   LAZY IMAGES
   Obrazy z loading="lazy" zaczynaja od opacity:0
   (patrz animations.css). Po zaladowaniu dostaja
   klase .is-loaded, ktora przywraca opacity:1.
   Dziala tez dla zdjec wstrzykiwanych przez JS
   (portfolio, galeria) — ponownie wywolaj
   window.dispatchEvent(new Event('lazyRefresh'))
   po dodaniu nowych obrazow do DOM.
   ------------------------------------------------ */
(function initLazyImages() {
  function observe(imgs) {
    if (!('IntersectionObserver' in window)) {
      imgs.forEach(img => img.classList.add('is-loaded'));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;

        /* Opcjonalny data-src (WebP swap) */
        if (img.dataset.src) img.src = img.dataset.src;

        const done = () => img.classList.add('is-loaded');
        img.complete ? done() : img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });

        obs.unobserve(img);
      });
    }, { rootMargin: '300px 0px' });

    imgs.forEach(img => {
      img.complete ? img.classList.add('is-loaded') : io.observe(img);
    });
  }

  /* Inicjalizacja startowa */
  observe(document.querySelectorAll('img[loading="lazy"]'));

  /* Odswiezenie po dynamicznym dodaniu obrazow */
  window.addEventListener('lazyRefresh', () => {
    const fresh = document.querySelectorAll('img[loading="lazy"]:not(.is-loaded)');
    observe(fresh);
  });

  /* Hero bg (fetchpriority="high", nie lazy) */
  const heroBg = document.querySelector('.hero__bg-img');
  if (heroBg) {
    const done = () => heroBg.classList.add('is-loaded');
    heroBg.complete ? done() : heroBg.addEventListener('load', done, { once: true });
  }
})();
