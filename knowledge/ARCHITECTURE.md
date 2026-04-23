# Verami.Studio — architektura techniczna

> Szczegółowa dokumentacja plików, CSS, JS i portfolio workflow.
> Czytaj gdy potrzebujesz edytować konkretny plik lub rozumieć jak coś działa.
> Nie musisz tego czytać przy każdej sesji.

---

## Stack

HTML/CSS/JS vanilla — bez frameworków, bez bundlera.
Kolory: `#523A34` (brąz) / `#F1F2ED` (krem). Font: Inter. Język: polski.

---

## Struktura plików

```
strona internetowa verami studio/
├── index.html              ← strona główna
├── o-mnie.html             ← strona o nas/mnie
├── portfolio.html          ← siatka projektów (karty z JSON)
├── projekt.html            ← podstrona projektu (slider + lightbox)
├── uslugi.html             ← usługi + FAQPage schema
├── kontakt.html            ← kontakt + formularz Formspree
├── BACKLOG.md              ← lokalna kopia backlogu (zdublowana w OPEN-ITEMS)
├── FORMSPREE-INSTRUKCJA.txt
├── css/
│   ├── tokens.css          ← ŁADOWAĆ PIERWSZE: zmienne CSS (kolory, spacing, typografia)
│   ├── base.css            ← reset, elementy globalne
│   ├── layout.css          ← siatki, kontenery, sekcje
│   ├── components.css      ← karty, przyciski, nav, footer
│   ├── animations.css      ← reveal, transitions
│   └── responsive.css      ← ŁADOWAĆ OSTATNIE: media queries
├── js/
│   ├── main.js             ← initHeader(), hamburger
│   ├── animations.js       ← IntersectionObserver, reveal
│   ├── portfolio.js        ← fetch projects.json → karty, filtrowanie
│   ├── gallery.js          ← slider, lightbox, dynamiczny title/meta
│   └── form.js             ← walidacja, Formspree, mailto fallback
├── portfolio/
│   ├── projects.json       ← master lista projektów
│   ├── salon-z-aneksem/    ← cover.webp + meta.json + 01-N.webp
│   ├── sypialnia/
│   ├── lazienka/
│   ├── lazienka1/
│   ├── pokoj-dziecka/
│   ├── pokoj-gamingowy/
│   └── wiatrolap/
└── assets/
    ├── hero-bg.jpg
    ├── about-photo.jpg
    ├── og-image.jpg        ← 1200×630px (sprawdzić czy istnieje — TODO)
    ├── favicon.ico
    ├── favicon.svg
    └── apple-touch-icon.png
```

---

## CSS — architektura i kolejność ładowania

**Kolejność jest krytyczna — nie zmieniać bez powodu:**

```
tokens.css → base.css → layout.css → components.css → animations.css → responsive.css
```

`tokens.css` definiuje zmienne CSS używane przez wszystkie pozostałe pliki:
`--color-dark`, `--color-brown: #523A34`, `--color-cream: #F1F2ED`,
spacing (`--space-*`), typografia (`--text-*`), breakpointy.

**Znane konflikty:**
- `.btn` w `components.css` może nadpisywać nav-specific styles
  → użyj `!important` lub bardziej specyficznego selektora jeśli coś się psuje
- Klasa `is-scrolled` na `<header>` dodawana dynamicznie przez `main.js`
  → nie zakładaj statycznego wyglądu nav przy pisaniu CSS

---

## JS — moduły (co robi każdy plik)

### `main.js`
- `initHeader()` — dodaje/usuwa klasę `is-scrolled` przy scrollu + `aria-expanded` na hamburgerze
- Inicjalizuje hamburger menu (toggle `nav__mobile`)
- **⚠️ Uwaga:** `initHeader()` nadpisuje klasy HTML elementów przy każdym ładowaniu strony.
  Jeśli coś dziwnie zachowuje się przy ładowaniu — sprawdź early-return w `initHeader()`.

### `animations.js`
- IntersectionObserver na elementach z klasą `.reveal`
- Dodaje klasę `is-visible` → wyzwala animację wejścia (zdefiniowaną w `animations.css`)

### `portfolio.js`
- Fetch `portfolio/projects.json` → renderuje karty do `#portfolio-grid`
- Filtrowanie przez przyciski `.filter-btn[data-filter]`
- **⚠️ Bug fix który już jest w kodzie:** `ł/Ł` w nazwie kategorii wymaga jawnej zamiany
  na `l` przed normalizacją NFD — bez tego filtr „Łazienka" nie działa.
  Nie usuwać tej zamiany przy refaktorze.

### `gallery.js`
- Czyta `?project=SLUG` z URL
- Fetch `portfolio/SLUG/meta.json` → uzupełnia `<title>`, opis, meta dynamicznie
- Auto-wykrywa obrazy `01–40` w formatach: `webp → jpg → png`
- Slider hero + dots + prev/next
- Lightbox z klawiaturą (Escape, strzałki lewo/prawo)

### `form.js`
- Walidacja live (blur events) + walidacja przy submit
- Formspree ID: `xkopbzbw` — aktywne ✅
- Fallback: `mailto:` jeśli Formspree zawiedzie

---

## Portfolio — jak dodać nowy projekt

1. Stwórz folder `portfolio/SLUG/` (slug bez polskich znaków, małe litery, myślniki)
2. Dodaj `cover.webp` (proporcje 4:5, max 200KB)
3. Dodaj `meta.json`:
   ```json
   {
     "title": "Salon z aneksem w domu",
     "category": "Salon",
     "location": "Warszawa",
     "area": "40 m²",
     "description": "..."
   }
   ```
4. Dodaj zdjęcia: `01.webp`, `02.webp`... (max 40 zdjęć)
5. Dodaj wpis do `portfolio/projects.json`
6. **Jeśli projekt ma być na stronie głównej** — dodaj hardkodowaną kartę w `index.html`
   (karty na stronie głównej są hardkodowane, nie generowane z JSON)
7. Deploy: `git add .` + `git commit` + `git push`

**Pliki binarne (obrazy):** tylko przez lokalny skrypt `konwertuj.py` — nie pisać
binarnych plików przez Filesystem MCP.

---

## projekt.html — SEO caveat

`<title>` i `<link rel="canonical">` na `projekt.html` są uzupełniane przez `gallery.js`
po załadowaniu strony (dynamicznie przez JavaScript). Google może indeksować wersję
domyślną (bez tytułu projektu) zamiast dynamicznej.

Monitorować w Search Console po uruchomieniu. Ewentualne rozwiązanie: statyczne
podstrony per projekt — ale to duża zmiana architektury, nie robić bez potrzeby.

---

## Deployment i hosting

GitHub Pages serwuje z brancha `main`. HTTPS aktywne (Let's Encrypt). DNS w OVH.

```powershell
git add .
git commit -m "opis zmian"
git push
# Zmiany widoczne po ~1–2 minutach
```
