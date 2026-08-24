# Verami.Studio — kontekst dla AI

Pełny kontekst projektu: [`knowledge/CONTEXT.md`](knowledge/CONTEXT.md)

---

## Najważniejsze zasady pracy

**Stack:** HTML/CSS/JS vanilla, GitHub Pages, Formspree. Bez frameworków, bez bundlera.

**Zanim napiszesz cokolwiek:**
- Re-read każdy plik tuż przed edycją — `edit_file` wymaga dokładnego dopasowania tekstu
- `write_file` jest bezpieczniejszy przy dużych zmianach
- `fetch()` nie działa na `file://` — do testowania potrzebny Live Server

**Kolejność ładowania CSS jest krytyczna:**
```
tokens.css → base.css → layout.css → components.css → animations.css → responsive.css
```
Nie zmieniać kolejności bez powodu.

**Karty na `index.html` są hardkodowane** — zmiana w `projects.json` ich nie odświeży.

**Filtr portfolio — `ł/Ł` wymaga jawnej zamiany na `l`** przed NFD. Nie usuwać tego fix-a.

**Deploy w PowerShell — komendy osobno, nigdy z `&&`.**

**Styl komunikacji:**
- Liczba mnoga 1. osoba: „tworzymy", „projektujemy"
- Półpauza (–) zamiast em-dash (—)
- Zakazane słowa: „kompleksowy", „profesjonalny", „najwyższa jakość", „pasja", „zaangażowanie"

---

## Gdzie szukać

| Pytanie | Plik |
|---|---|
| Cel SEO, status, dane, deploy | `knowledge/CONTEXT.md` |
| Struktura plików, CSS, JS, portfolio workflow | `knowledge/ARCHITECTURE.md` |
| Pułapki, styl, kolory | `knowledge/PATTERNS.md` |
| Copywriting, Schema.org, lista projektów | `knowledge/Content-Guide.md` |
| Co zrobione, co do zrobienia | `knowledge/OPEN-ITEMS.md` |
