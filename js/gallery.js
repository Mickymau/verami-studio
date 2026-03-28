/* ============================================
   VERAMI.STUDIO — gallery.js
   Strona projektu (projekt.html).

   Dzialanie:
   1. Odczytuje ?project=nazwa-folderu z URL
   2. Pobiera meta.json projektu
   3. Wstrzykuje tytul, opis, metadane
   4. Autodetekcja zdjec: 01.webp > 01.jpg > 01.png … az do 404
      (kolejnosc: webp ma pierwszenstwo jako najszybszy format)
   5. Renderuje galerie miniatur
   6. Lightbox z nawigacja klawiatura i swipe
   ============================================ */

'use strict';

(function initGallery() {

  /* Wyjdz jesli nie jestesmy na stronie projektu */
  const galleryEl = document.getElementById('project-gallery');
  if (!galleryEl) return;

  /* ------------------------------------------------
     URL PARAM
     ------------------------------------------------ */
  const folder = new URLSearchParams(location.search).get('project');

  if (!folder) {
    window.location.replace('portfolio.html');
    return;
  }

  /* ------------------------------------------------
     REFERENCJE DO DOM
     ------------------------------------------------ */
  const heroImg      = document.getElementById('project-hero-img');
  const titleEl      = document.getElementById('project-title');
  const categoryEl   = document.getElementById('project-category');
  const locationEl   = document.getElementById('project-location');
  const areaEl       = document.getElementById('project-area');
  const descEl       = document.getElementById('project-description');
  const breadcrumbEl = document.getElementById('project-breadcrumb');
  const loadingEl    = document.getElementById('project-loading');
  const errorEl      = document.getElementById('project-error');

  /* ------------------------------------------------
     NARZEDZIA
     ------------------------------------------------ */

  /* Sprawdz czy obraz sie laduje */
  function probeImage(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload  = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src     = url;
    });
  }

  /* Znajdz cover: webp > jpg > png */
  async function findCover(f) {
    const candidates = [
      `portfolio/${f}/cover.webp`,
      `portfolio/${f}/cover.jpg`,
      `portfolio/${f}/cover.png`,
    ];
    for (const src of candidates) {
      if (await probeImage(src)) return src;
    }
    return candidates[candidates.length - 1]; /* fallback */
  }

  /* Autodetekcja zdjec galerii:
     Sprawdza 01.webp > 01.jpg > 01.png az do pierwszego braku. */
  async function discoverImages(f) {
    const found = [];

    for (let i = 1; i <= 40; i++) {
      const pad  = String(i).padStart(2, '0');
      const exts = ['webp', 'jpg', 'png'];
      let found_this = false;

      for (const ext of exts) {
        const url = `portfolio/${f}/${pad}.${ext}`;
        if (await probeImage(url)) {
          found.push(url);
          found_this = true;
          break;
        }
      }

      if (!found_this) break; /* Przerwij przy pierwszej luce */
    }

    return found;
  }

  /* Ustaw src i klase .is-loaded po zaladowaniu obrazu */
  function loadImg(img, src, alt) {
    img.alt = alt || '';
    img.src = src;
    const done = () => img.classList.add('is-loaded');
    img.complete ? done() : img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  }

  /* ------------------------------------------------
     GLOWNA INICJALIZACJA
     ------------------------------------------------ */
  async function init() {
    try {
      /* 1. Pobierz meta.json */
      const res = await fetch(`portfolio/${folder}/meta.json`);
      if (!res.ok) throw new Error(`meta.json not found (${res.status})`);
      const meta = await res.json();

      /* 2. SEO */
      document.title = `${meta.title || 'Projekt'} \u2014 Verami.Studio`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', (meta.description || '').slice(0, 155));
      }

      /* 3. Hero cover */
      if (heroImg) {
        const coverSrc = await findCover(folder);
        loadImg(heroImg, coverSrc, meta.title);
      }

      /* 4. Pola tekstowe */
      setText(titleEl,      meta.title);
      setText(categoryEl,   meta.category);
      setText(locationEl,   meta.location);
      setText(areaEl,       meta.area);
      setText(descEl,       meta.description);
      setText(breadcrumbEl, meta.title);

      /* 5. Galeria */
      const coverSrc = await findCover(folder);
      const images = await discoverImages(folder);
      renderGallery([coverSrc, ...images]);

    } catch (err) {
      console.error('[gallery.js]', err);
      if (loadingEl) loadingEl.remove();
      if (errorEl)   errorEl.removeAttribute('hidden');
    }
  }

  function setText(el, val) {
    if (el) el.textContent = val || '';
  }

  /* ------------------------------------------------
     RENDEROWANIE GALERII
     ------------------------------------------------ */
  function renderGallery(images) {
    if (loadingEl) loadingEl.remove();

    if (!images.length) {
      galleryEl.innerHTML = `
        <p style="grid-column:1/-1;text-align:center;
                  padding:3rem 0;color:var(--color-dark-40);">
          Brak zdjec galerii.
        </p>`;
      return;
    }

    galleryEl.innerHTML = images
      .map((src, i) => `
        <div class="gallery__item reveal" data-index="${i}">
          <img
            src="${src}"
            alt="Zdjecie ${i + 1} z ${images.length}"
            class="gallery__img"
            loading="lazy"
            decoding="async"
          />
        </div>
      `)
      .join('');

    /* Animacje reveal */
    window.dispatchEvent(new Event('revealRefresh'));

    /* Lazy load */
    window.dispatchEvent(new Event('lazyRefresh'));

    /* Lightbox */
    initLightbox(images);
  }

  /* ------------------------------------------------
     LIGHTBOX
     ------------------------------------------------ */
  function initLightbox(images) {
    const lb      = document.getElementById('lightbox');
    const lbImg   = document.getElementById('lightbox-img');
    const lbClose = document.getElementById('lightbox-close');
    const lbPrev  = document.getElementById('lightbox-prev');
    const lbNext  = document.getElementById('lightbox-next');
    const lbCount = document.getElementById('lightbox-counter');
    if (!lb || !lbImg) return;

    let current = 0;
    const total = images.length;

    function open(index) {
      current = ((index % total) + total) % total;

      lbImg.classList.remove('is-loaded');
      lbImg.src = images[current];
      lbImg.addEventListener('load',  () => lbImg.classList.add('is-loaded'), { once: true });
      lbImg.addEventListener('error', () => lbImg.classList.add('is-loaded'), { once: true });

      if (lbCount) lbCount.textContent = `${current + 1} / ${total}`;

      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      lbClose?.focus();
    }

    function close() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    const prev = () => open(current - 1);
    const next = () => open(current + 1);

    galleryEl.addEventListener('click', e => {
      const item = e.target.closest('.gallery__item[data-index]');
      if (item) open(parseInt(item.dataset.index, 10));
    });

    galleryEl.querySelectorAll('.gallery__item').forEach(item => {
      item.style.cursor = 'zoom-in';
    });

    lbClose?.addEventListener('click', close);
    lbPrev?.addEventListener('click',  prev);
    lbNext?.addEventListener('click',  next);

    lb.addEventListener('click', e => { if (e.target === lb) close(); });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    });

    let touchX = 0;
    lb.addEventListener('touchstart', e => {
      touchX = e.changedTouches[0].clientX;
    }, { passive: true });

    lb.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    }, { passive: true });
  }

  /* Uruchom */
  init();

})();
