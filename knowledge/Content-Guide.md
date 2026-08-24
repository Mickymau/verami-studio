# Verami.Studio — przewodnik po treściach i SEO

> Zasady copywritingu, lista projektów portfolio, Schema.org i SEO.
> Czytaj gdy piszesz lub edytujesz treści na stronie.

---

## Projekty w portfolio

Aktualnie 7 projektów (stan kwiecień 2026):

| Slug | Tytuł | Kategoria | Lokalizacja |
|---|---|---|---|
| `salon-z-aneksem` | Salon z aneksem | Salon | Warszawa |
| `sypialnia` | Sypialnia | Pokój | — |
| `lazienka` | Łazienka | Łazienka | — |
| `lazienka1` | Łazienka (2) | Łazienka | — |
| `pokoj-dziecka` | Pokój dziecka | Pokój | — |
| `pokoj-gamingowy` | Pokój gamingowy | Pokój | — |
| `wiatrolap` | Wiatrołap | Korytarz | — |

**Kategorie filtrowania** (używane w `portfolio.js` jako `data-filter`):
`Lazienka`, `Pokoj`, `Salon`, `Korytarz`

⚠️ W kodzie kategoria to `Lazienka` (bez ogonka) — z powodu buga z normalizacją NFD.
W wyświetlanej etykiecie może być „Łazienka", ale w `data-filter` musi być `Lazienka`.

---

## Schema.org — typy użyte per strona

| Strona | Typ Schema.org | Stan |
|---|---|---|
| `index.html` | `LocalBusiness` + `WebSite` | ✅ |
| `uslugi.html` | `Service` + `FAQPage` (4 pytania z cenami) | ✅ |
| `kontakt.html` | `ContactPage` | ✅ |
| `portfolio.html` | `CollectionPage` | ✅ |
| `projekt.html` | `BreadcrumbList` (dynamiczny przez gallery.js) | ✅ |
| `o-mnie.html` | `Organization` | ⚠️ TODO: zmienić na `LocalBusiness` |

---

## SEO — meta tagi (stan aktualny)

Wszystkie 6 stron mają: `canonical`, `og:*`, `twitter:card`, `robots`, `theme-color`
— ustawione na `veramistudio.pl`. ✅

**Wyjątek — `projekt.html`:** `<title>` i `<link rel="canonical">` uzupełniane
dynamicznie przez `gallery.js` po załadowaniu. Google może indeksować wersję
domyślną. Monitorować w Search Console.

---

## Zasady copywritingu

### Forma gramatyczna
Liczba mnoga pierwsza osoba — studio jest dwuosobowe:
- ✅ „tworzymy", „projektujemy", „prowadzimy", „podchodzimy"
- ❌ „tworzę", „projektuję", „moje studio"

### Interpunkcja
- Półpauza (–) zamiast em-dash (—) — zawsze
- Bez wielkich liter w środku zdania dla „efektu"

### Zakazane słowa
`kompleksowy` · `profesjonalny` · `najwyższa jakość` · `pasja` · `zaangażowanie`

### Wzorzec dobrego zdania
Krótkie, konkretne, z obrazem lub liczbą:
- ✅ „40 m² salonu z otwartą kuchnią — jeden spójny projekt od koncepcji po realizację"
- ✅ „Pracujemy w Warszawie, Białymstoku i Siedlcach"
- ❌ „Kompleksowo zajmujemy się profesjonalnym projektowaniem wnętrz z pasją"

---

## `uslugi.html` — FAQ Schema

Strona usług ma `FAQPage` Schema z 4 pytaniami i cenami.
Przy aktualizacji cennika zaktualizować Schema w `<script type="application/ld+json">` —
inaczej Google pokaże stare ceny w rich snippets.

---

## `o-mnie.html` — TODO Schema

Strona używa `@type: Organization` — do zmiany na `LocalBusiness` z pełnymi danymi
(adres, telefon, godziny). Nie robiono tego żeby nie zaśmiecać kodu połowiczną daną.
Zrobić gdy będą aktualne dane kontaktowe.
