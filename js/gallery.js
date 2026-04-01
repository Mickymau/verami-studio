/* ============================================
   VERAMI.STUDIO — gallery.js
   Strona projektu (projekt.html).
   ============================================ */

'use strict';

(function initGallery() {

  const galleryEl = document.getElementById('project-gallery');
  if (!galleryEl) return;

  const folder = new URLSearchParams(location.search).get('project');
  if (!folder) {
    window.location.replace('portfolio.html');
    return;
  }

  /* ------------------------------------------------
     REFERENCJE DOM
     ------------------------------------------------ */
  const sliderEl    = document.getElementById('hero-slider');
  const sliderTrack = document.getElementById('hero-slider-track');
  const sliderPrev  = document.getElementById('hero-slider-prev');
  const sliderNext  = document.getElementById('hero-slider-next');
  const sliderDots  = document.getElementById('hero-slider-dots');
  const titleEl     = document.getElementById('project-title');
  const categoryEl  = document.getElementById('project-category');
  const locationEl  = document.getElementById('project-location');
  const areaEl      = document.getElementById('project-area');
  const descEl      = document.getElementById('project-description');
  const breadcrumbEl = document.getElementById('project-breadcrumb');
  const loadingEl   = document.getElementById('project-loading');
  const errorEl     = document.getElementById('project-error');

  /* ------------------------------------------------
     NARZEDZIA
     ------------------------------------------------ */
  function probeImage(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload  = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  async function findCover(f) {
    for (const ext of ['webp', 'jpg', 'png']) {
      const url = `portfolio/${f}/cover.${ext}`;
      if (await probeImage(url)) return url;
    }
    return `portfolio/${f}/cover.webp`;
  }

  async function discoverImages(f) {
    const found = [];
    const BATCH = 5;
    for (let i = 1; i <= 40; i += BATCH) {
      const results = await Promise.all(
        Array.from({ length: Math.min(BATCH, 41 - i) }, (_, k) => {
          const pad = String(i + k).padStart(2, '0');
          return (async () => {
            for (const ext of ['webp', 'jpg', 'png']) {
              const url = `portfolio/${f}/${pad}.${ext}`;
              if (await probeImage(url)) return url;
            }
            return null;
          })();
        })
      );
      let gap = false;
      for (const url of results) {
        if (!url) { gap = true; break; }
        found.push(url);
      }
      if (gap) break;
    }
    return found;
  }

  function setText(el, val) {
    if (el) el.textContent = val || '';
  }

  /* ------------------------------------------------
     GLOWNA INICJALIZACJA
     ------------------------------------------------ */
  async function init() {
    try {
      const res = await fetch(`portfolio/${folder}/meta.json`);
      if (!res.ok) throw new Error(`meta.json not found (${res.status})`);
      const meta = await res.json();

      /* SEO */
      document.title = `${meta.title || 'Projekt'} \u2014 Verami.Studio`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', (meta.description || '').slice(0, 155));

      /* Teksty */
      setText(titleEl,      meta.title);
      setText(categoryEl,   meta.category);
      setText(locationEl,   meta.location);
      setText(areaEl,       meta.area);
      setText(descEl,       meta.description);
      setText(breadcrumbEl, meta.title);

      /* Cover natychmiast */
      const coverSrc = await findCover(folder);
      initSlider([coverSrc], meta.title);

      /* Reszta zdjec w tle */
      const rest = await discoverImages(folder);
      const allImages = [coverSrc, ...rest];
      if (rest.length > 0) {
        initSlider(allImages, meta.title);
      }
      renderGallery(allImages);

    } catch (err) {
      console.error('[gallery.js]', err);
      if (loadingEl) loadingEl.remove();
      if (errorEl) errorEl.removeAttribute('hidden');
    }
  }

  /* ------------------------------------------------
     SLIDER
     Prosta architektura: jeden obiekt stanu,
     jeden zestaw listenerow (podpinany tylko raz).
     Infinite loop przez klony na krawędziach.

     Struktura track: [klon-ostatni][0][1]...[n-1][klon-pierwszy]
     Pozycja w tracku = realIndex + 1
     ------------------------------------------------ */

  /* Stan globalny slidera */
  const S = {
    images:   [],   /* aktualna lista zdjec */
    idx:      0,    /* aktualny realIndex (0..n-1) */
    animating: false,
    booted:   false /* czy listenery juz podpiete */
  };

  function sliderSetPosition(trackPos, animate) {
    if (!sliderTrack) return;
    sliderTrack.style.transition = animate ? 'transform 0.5s ease' : 'none';
    sliderTrack.style.transform  = `translateX(-${trackPos * 100}%)`;
  }

  function sliderUpdateDots() {
    if (!sliderDots) return;
    sliderDots.querySelectorAll('.hero-slider__dot')
      .forEach((d, i) => d.classList.toggle('is-active', i === S.idx));
  }

  function sliderGo(direction) {
    /* direction: +1 (next) lub -1 (prev) */
    if (S.animating || S.images.length <= 1) return;
    S.animating = true;

    S.idx = ((S.idx + direction + S.images.length) % S.images.length);
    sliderSetPosition(S.idx + 1, true);
    sliderUpdateDots();
  }

  function initSlider(images, title) {
    if (!sliderEl || !sliderTrack) return;

    S.images = images;
    S.idx    = 0;
    S.animating = false;

    const n = images.length;

    /* Buduj DOM */
    const makeSlide = (src, i) => `
      <div class="hero-slider__slide">
        <img
          src="${src}"
          alt="${title || ''} \u2014 zdj\u0119cie ${i + 1}"
          ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
          decoding="async"
          width="1600" height="900"
        />
      </div>`;

    /* [klon-ostatni] + wszystkie slajdy + [klon-pierwszego] */
    sliderTrack.innerHTML =
      makeSlide(images[n - 1], n - 1) +
      images.map((src, i) => makeSlide(src, i)).join('') +
      makeSlide(images[0], 0);

    /* Ustaw na slajd 0 bez animacji */
    sliderSetPosition(1, false);

    /* Kropki */
    if (sliderDots) {
      sliderDots.innerHTML = images.map((_, i) =>
        `<button class="hero-slider__dot${i === 0 ? ' is-active' : ''}" aria-label="Zdj\u0119cie ${i + 1}"></button>`
      ).join('');
      sliderDots.querySelectorAll('.hero-slider__dot').forEach((dot, i) => {
        dot.onclick = () => {
          if (S.animating) return;
          S.animating = true;
          S.idx = i;
          sliderSetPosition(i + 1, true);
          sliderUpdateDots();
        };
      });
    }

    /* Ukryj strzalki i kropki gdy 1 zdjecie */
    sliderEl.classList.toggle('hero-slider--single', n <= 1);

    /* Listenery podpinamy tylko raz przy pierwszym wywolaniu */
    if (S.booted) return;
    S.booted = true;

    /* Po animacji: jesli jestesmy na klonie — skocz na oryginał */
    sliderTrack.addEventListener('transitionend', () => {
      S.animating = false;
      const trackPos = S.idx + 1;
      const n2 = S.images.length;

      /* Przyszlismy na klon pierwszego (za ostatnim slajdem) */
      if (trackPos > n2) {
        S.idx = 0;
        sliderSetPosition(1, false);
        sliderUpdateDots();
      }
      /* Przyszlismy na klon ostatniego (przed pierwszym slajdem) */
      else if (trackPos < 1) {
        S.idx = n2 - 1;
        sliderSetPosition(n2, false);
        sliderUpdateDots();
      }
    });

    /* Strzalki */
    sliderPrev?.addEventListener('click', () => sliderGo(-1));
    sliderNext?.addEventListener('click', () => sliderGo(+1));

    /* Swipe */
    let touchX = 0;
    sliderEl.addEventListener('touchstart', e => {
      touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    sliderEl.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) sliderGo(dx < 0 ? +1 : -1);
    }, { passive: true });

    /* Klawiatura */
    sliderEl.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  sliderGo(-1);
      if (e.key === 'ArrowRight') sliderGo(+1);
    });

    /* ---- Auto-hide kontrolek ---- */
    let hideTimer = null;

    function showControls() {
      sliderEl.classList.add('controls-visible');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => sliderEl.classList.remove('controls-visible'), 3000);
    }

    function hideControls() {
      clearTimeout(hideTimer);
      sliderEl.classList.remove('controls-visible');
    }

    /* Pokaz przy wejsciu na strone */
    showControls();

    /* Reset timera przy kazdej interakcji */
    sliderEl.addEventListener('touchstart', showControls, { passive: true });
    sliderPrev?.addEventListener('mouseenter', showControls);
    sliderNext?.addEventListener('mouseenter', showControls);

    /* Desktop: pokaz przy najechaniu mysza, ukryj po zjechaniu */
    sliderEl.addEventListener('mouseenter', showControls);
    sliderEl.addEventListener('mouseleave', hideControls);
  }

  /* ------------------------------------------------
     GALERIA MINIATUR
     ------------------------------------------------ */
  function renderGallery(images) {
    if (loadingEl) loadingEl.remove();

    if (!images.length) {
      galleryEl.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--color-dark-40);">Brak zdjec galerii.</p>`;
      return;
    }

    galleryEl.innerHTML = images.map((src, i) => `
      <div class="gallery__item reveal" data-index="${i}">
        <img
          src="${src}"
          alt="Zdjecie ${i + 1} z ${images.length}"
          class="gallery__img"
          loading="lazy"
          decoding="async"
        />
      </div>
    `).join('');

    window.dispatchEvent(new Event('revealRefresh'));
    window.dispatchEvent(new Event('lazyRefresh'));
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

    galleryEl.addEventListener('click', e => {
      const item = e.target.closest('.gallery__item[data-index]');
      if (item) open(parseInt(item.dataset.index, 10));
    });
    galleryEl.querySelectorAll('.gallery__item').forEach(item => {
      item.style.cursor = 'zoom-in';
    });

    lbClose?.addEventListener('click', close);
    lbPrev?.addEventListener('click',  () => open(current - 1));
    lbNext?.addEventListener('click',  () => open(current + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  open(current - 1);
      if (e.key === 'ArrowRight') open(current + 1);
    });

    let touchX = 0;
    lb.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) dx < 0 ? open(current + 1) : open(current - 1);
    }, { passive: true });
  }

  /* Uruchom */
  init();

})();
