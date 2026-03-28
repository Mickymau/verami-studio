/* ============================================
   VERAMI.STUDIO — animations.js
   Fade-in elementow przy scrollu.
   Uzywa IntersectionObserver — zero jQuery,
   zero bibliotek, zero reflow na scroll.

   Jak uzywac w HTML:
     class="reveal"              — fade up (domyslny)
     class="reveal reveal-delay-1" — opoznienie 0.1s
     class="reveal reveal-delay-2" — opoznienie 0.2s
     class="reveal reveal-delay-3" — opoznienie 0.32s
     class="reveal reveal-delay-4" — opoznienie 0.45s

   CSS (.reveal, .reveal.is-visible) musi byc
   zdefiniowany w animations.css.
   ============================================ */

'use strict';

(function initReveal() {

  const SELECTOR     = '.reveal';
  const ACTIVE_CLASS = 'is-visible';

  /* Jesli przeglądarka nie wspiera IO — pokaz wszystko od razu */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(SELECTOR).forEach(el => el.classList.add(ACTIVE_CLASS));
    return;
  }

  /* Opcje obserwatora:
     threshold  — ile elementu musi byc widoczne (10%)
     rootMargin — element odpala sie 40px przed wejsciem w viewport */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(ACTIVE_CLASS);
        observer.unobserve(entry.target); /* Obserwuj tylko raz */
      });
    },
    {
      threshold:  0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  /* Obserwuj wszystkie elementy obecne w DOM przy starcie */
  function observeAll() {
    document.querySelectorAll(`${SELECTOR}:not(.${ACTIVE_CLASS})`).forEach(el => {
      observer.observe(el);
    });
  }

  observeAll();

  /* Ponowna obserwacja po dynamicznym wstrzykniecia elementow
     (np. karty portfolio generowane przez portfolio.js).
     Wywolaj: window.dispatchEvent(new Event('revealRefresh')) */
  window.addEventListener('revealRefresh', observeAll);

})();
