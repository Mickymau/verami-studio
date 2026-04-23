# Verami.Studio — wzorce, konwencje, pułapki

> Czytaj zanim zaczniesz edytować kod lub pisać treści.

---

## Praca z plikami — pułapki

### `edit_file` wymaga dokładnego dopasowania tekstu
`Filesystem:edit_file` szuka `old_str` dosłownie — z białymi znakami i wcięciami.
Zawsze re-read plik tuż przed edycją. Jeśli plik był edytowany wcześniej
w tej sesji, stary odczyt jest nieaktualny.

**Przy dużych zmianach:** `write_file` jest bezpieczniejszy — nadpisuje cały plik.
`read_multiple_files` jest efektywny przy batch-read wszystkich HTML naraz.

### Pliki binarne
Obrazy (webp, jpg) tylko przez lokalny skrypt `konwertuj.py`.
Nie próbować pisać plików binarnych przez Filesystem MCP — to nie zadziała.

### Karty na `index.html` są hardkodowane
Karty projektów na stronie głównej (`index.html`) są wpisane ręcznie w HTML.
Zmiana w `portfolio/projects.json` nie odświeży ich automatycznie.
Jeśli dodajesz projekt który ma być na stronie głównej — musisz edytować `index.html`.

---

## CSS — pułapki

### `.btn` może nadpisywać nav styles
Klasa `.btn` w `components.css` jest generyczna i może kolizować z nawigacją.
Jeśli styl przycisku w nav nie wygląda jak powinien — sprawdź specificity
lub użyj `!important` jako ostateczność.

### `initHeader()` nadpisuje klasy przy ładowaniu
`main.js` przy każdym załadowaniu strony wywołuje `initHeader()`, które nadpisuje
klasy HTML na `<header>`. Jeśli header wygląda inaczej niż oczekujesz —
sprawdź czy `initHeader()` ma early-return dla Twojego przypadku.

### `is-scrolled` jest dynamiczna
Klasa `is-scrolled` na `<header>` jest dodawana przez JS przy scrollu.
Nie stylizuj nav zakładając że klasy są statyczne.

---

## JS — pułapki

### `ł/Ł` w filtrze portfolio
`portfolio.js` ma bug fix dla polskiej litery `ł/Ł` — przed normalizacją NFD
musi być jawna zamiana na `l`. Bez tego filtr kategorii „Łazienka" nie działa.
**Nie usuwać tej zamiany przy żadnym refaktorze.**

### `fetch()` na `file://`
`fetch()` nie działa przy otwieraniu pliku bezpośrednio w przeglądarce (`file://`).
Do lokalnego testowania portfolio i formularza wymagany jest Live Server w VS Code.

---

## Kolory i typografia

```css
--color-brown: #523A34    /* brąz — główny kolor marki */
--color-cream: #F1F2ED    /* krem — tło */
/* Font: Inter */
```

Nie wprowadzać nowych kolorów bez powodu. Paleta jest celowo ograniczona.

---

## Styl komunikacji — reguły

**Forma gramatyczna:** liczba mnoga pierwsza osoba — „tworzymy", „projektujemy".
Studio jest dwuosobowe — nie pisać „ja" ani „tworzę".

**Interpunkcja:** półpauza (–) zamiast em-dash (—). Nigdy em-dash w treściach strony.

**Zakazane słowa (nigdy nie używać):**
- kompleksowy / kompleksowo
- profesjonalny / profesjonalizm
- najwyższa jakość
- pasja
- zaangażowanie

**Styl zdań:** krótkie, konkretne, z obrazem w głowie. Unikać ogólników.
„40 m² salonu zamieniliśmy w przestrzeń z charakterem" — tak.
„Kompleksowo zajmujemy się projektowaniem wnętrz" — nie.

---

## Deploy — PowerShell caveat

```powershell
# DOBRZE — komendy osobno
git add .
git commit -m "opis"
git push

# ŹLE — w PowerShell && nie działa jak w bash
git add . && git commit -m "opis" && git push
```
