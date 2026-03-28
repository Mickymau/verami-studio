/* ============================================
   VERAMI.STUDIO — portfolio.js
   Generator gridu portfolio.

   Dzialanie:
   1. Pobiera projects.json — liste folderow
   2. Dla kazdego folderu pobiera meta.json
   3. Generuje karty HTML i wstrzykuje do gridu
   4. Obsluguje filtry kategorii (bez przeladowania)

   Struktura folderu projektu:
     /portfolio/nazwa-projektu/
       cover.webp (lub cover.jpg, cover.png)
       meta.json  { title, category, location, area, description }

   Aby dodac nowy projekt:
     1. Stworz folder w /portfolio/
     2. Dodaj cover.webp (lub cover.jpg) i meta.json
     3. Dodaj nazwe folderu do projects.json
   ============================================ */

'use strict';

(function initPortfolio() {

  /* Wyjdz jesli brak gridu (strona nie jest portfolio.html) */
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  /* ------------------------------------------------
     KONFIGURACJA
     ------------------------------------------------ */
  const MANIFEST = 'projects.json'; /* Lista folderow projektow */

  /* ------------------------------------------------
     STAN
     ------------------------------------------------ */
  let allProjects  = []; /* Wszystkie projekty po zaladowaniu */
  let activeFilter = 'all';

  /* ------------------------------------------------
     NARZEDZIA
     ------------------------------------------------ */

  /* Normalizacja do porownywania — usuwa polskie znaki,
     dzieki temu filtr "Lazienka" trafia w kategorie "Lazienka" */
  function norm(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[łĺļľ]/g, 'l')
      .replace(/[øőõôóò]/g, 'o')
      .replace(/[ðď]/g, 'd')
      .replace(/[ßþ]/g, 's')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /* Sprawdz czy plik obrazu istnieje (przez HTMLImageElement) */
  function imageExists(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload  = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src     = url;
    });
  }

  /* Znajdz cover: webp > jpg > png (webp ma pierwszenstwo jako najszybszy format) */
  async function findCover(folder) {
    const candidates = [
      `portfolio/${folder}/cover.webp`,
      `portfolio/${folder}/cover.jpg`,
      `portfolio/${folder}/cover.png`,
    ];
    for (const src of candidates) {
      if (await imageExists(src)) return src;
    }
    return candidates[candidates.length - 1]; /* fallback */
  }

  /* ------------------------------------------------
     INICJALIZACJA — pobierz i wyrenderuj projekty
     ------------------------------------------------ */
  async function init() {
    /* Pokaz skeleton loader w czasie ladowania */
    showSkeleton();

    try {
      /* 1. Pobierz liste folderow */
      const res = await fetch(MANIFEST);
      if (!res.ok) throw new Error(`Brak ${MANIFEST}`);
      const folders = await res.json();

      /* 2. Pobierz meta.json kazdego projektu rownolegle */
      const results = await Promise.all(
        folders.map(folder => loadProject(folder))
      );

      /* 3. Odsiej nulle (projekty z bledami) */
      allProjects = results.filter(Boolean);

      /* 4. Wyrenderuj */
      render(allProjects);

    } catch (err) {
      grid.innerHTML = '<p class="portfolio-empty">Nie udalo sie zaladowac projektow.</p>';
      console.error('[portfolio.js]', err);
    }
  }

  /* Pobierz dane jednego projektu */
  async function loadProject(folder) {
    try {
      const r = await fetch(`portfolio/${folder}/meta.json`);
      if (!r.ok) throw new Error(`Brak meta.json w ${folder}`);
      const meta  = await r.json();
      const cover = await findCover(folder);
      return { folder, cover, ...meta };
    } catch (err) {
      console.warn('[portfolio.js]', err.message);
      return null;
    }
  }

  /* ------------------------------------------------
     SKELETON LOADER
     Placeholder zanim dane sie zaladuja
     ------------------------------------------------ */
  function showSkeleton() {
    grid.innerHTML = Array.from({ length: 6 }, () => `
      <div class="project-card project-card--skeleton" aria-hidden="true">
        <div class="project-card__image-wrap skeleton"></div>
      </div>
    `).join('');
  }

  /* ------------------------------------------------
     RENDEROWANIE KART
     ------------------------------------------------ */
  function render(projects) {
    if (!projects.length) {
      grid.innerHTML = '<p class="portfolio-empty">Brak projektow w tej kategorii.</p>';
      return;
    }

    grid.innerHTML = projects.map((p, i) => buildCard(p, i)).join('');

    /* Wyzwol reveal animacje dla nowych kart */
    window.dispatchEvent(new Event('revealRefresh'));

    /* Wyzwol lazy load dla nowych obrazow */
    window.dispatchEvent(new Event('lazyRefresh'));
  }

  /* Zbuduj HTML karty projektu */
  function buildCard(project, index) {
    /* Kaskadowe opoznienie animacji (cykl 0–2) */
    const delays = ['', ' reveal-delay-1', ' reveal-delay-2'];
    const delay  = delays[index % 3];

    /* Escape wartosci wstawianych do HTML */
    const title    = esc(project.title    || 'Projekt');
    const location = esc(project.location || '');
    const area     = esc(project.area     || '');
    const category = esc(project.category || '');
    const folder   = encodeURIComponent(project.folder);

    return `
<a href="projekt.html?project=${folder}"
   class="project-card reveal${delay}"
   aria-label="Zobacz projekt: ${title}">

  <div class="project-card__image-wrap">
    <img
      src="${project.cover}"
      alt="${title}"
      class="project-card__image"
      loading="lazy"
      decoding="async"
    />
    <div class="project-card__overlay" aria-hidden="true">
      <p class="project-card__title">${title}</p>
      <p class="project-card__meta">${location}${location && area ? ' &middot; ' : ''}${area}</p>
    </div>
  </div>

  <div class="project-card__info">
    <p class="project-card__info-title">${title}</p>
    <p class="project-card__info-meta">${category}${category && area ? ' &middot; ' : ''}${area}</p>
  </div>

</a>`.trim();
  }

  /* Prosty escape HTML (zabezpieczenie przed XSS w meta.json) */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ------------------------------------------------
     FILTRY KATEGORII
     Filtry sa definiowane w HTML jako:
       <button class="filter-btn" data-filter="all">Wszystkie</button>
       <button class="filter-btn" data-filter="Lazienka">Lazienki</button>
     data-filter porownywany jest z polem category
     w meta.json (ignorujac polskie znaki).
     ------------------------------------------------ */
  function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    if (!buttons.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        /* Zaktualizuj aktywny przycisk */
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        activeFilter = btn.dataset.filter || 'all';

        /* Filtruj i wyrenderuj */
        const filtered = activeFilter === 'all'
          ? allProjects
          : allProjects.filter(p =>
              norm(p.category).startsWith(norm(activeFilter))
            );

        render(filtered);
      });
    });
  }

  /* Uruchom */
  initFilters();
  init();

})();
