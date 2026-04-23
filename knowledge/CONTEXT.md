# Verami.Studio — kontekst projektu

> Przeczytaj ten plik na początku każdej sesji nad stroną veramistudio.pl.
> Zawiera wszystko co potrzebujesz do 80% zadań.
> Więcej szczegółów: `ARCHITECTURE.md` (struktura plików, JS/CSS), `PATTERNS.md` (pułapki, styl).

---

## Czym jest projekt

**Verami.Studio** — strona internetowa dwuosobowego studia projektowania wnętrz.
Właściciel: Michał (+ 1 partner). Strona: `https://veramistudio.pl`

Cel SEO: **top 5 Google dla „architekt wnętrz Warszawa"**.
Rynki: Warszawa (główny), Białystok, Siedlce.

Strona jest jednocześnie portfolio studia i głównym narzędziem pozyskiwania klientów.
Aktualny priorytet: przekształcić w case study i pozyskać pierwszego płatnego klienta webowego
pod marką Verami.Studio (usługi web design).

---

## Status projektu (stan na kwiecień 2026)

**Live:** `https://veramistudio.pl` — domena aktywna, HTTPS działa.

**Co działa:** 6 stron HTML, portfolio z 7 projektami, formularz kontaktowy (Formspree),
hosting na GitHub Pages, HTTPS (Let's Encrypt), canonical i OG tagi zaktualizowane.

**Największe luki:** brak polityki prywatności (RODO), brak sitemap.xml,
brak analityki (GA4), brak opinii klientów — patrz OPEN-ITEMS.

---

## Dane techniczne i kontaktowe

| Co | Wartość |
|---|---|
| GitHub | `Mickymau/verami-studio` |
| Hosting | GitHub Pages (branch `main`) |
| Domena | `veramistudio.pl` (DNS w OVH: rekordy A + CNAME) |
| HTTPS | Let's Encrypt przez GitHub Pages ✅ |
| Formspree | ID `xkopbzbw` — aktywne, maile dochodzą ✅ |
| Email kontaktowy | `verami.studio@gmail.com` |
| Tel | +48 791 353 793 |
| Instagram | @verami.studio |
| Facebook | fb.com/share/1Arv1LJ2Z5/ |
| Pinterest | pinterest.com/veramistudio |
| Folder lokalny | `C:\Users\Admin\Desktop\PROJEKTY\strona internetowa verami studio\` |
| Dev lokalnie | VS Code Live Server (`fetch()` nie działa na `file://`) |

---

## Deploy flow

```powershell
# PowerShell — komendy OSOBNO, nie łączyć &&
git add .
git commit -m "opis zmian"
git push
```

GitHub Pages serwuje z brancha `main`. Zmiany widoczne po ~1–2 minutach.

**Dev lokalnie:** VS Code Live Server — `fetch()` nie działa bezpośrednio na `file://`,
więc Live Server jest wymagany do testowania portfolio i formularza.

---

## Styl komunikacji na stronie

- Liczba mnoga pierwsza osoba: „tworzymy", „projektujemy" — dwuosobowy zespół
- Bez em-dashy (—) → używamy półpauzy (–)
- **Zakazane słowa:** „kompleksowy", „profesjonalny", „najwyższa jakość", „pasja", „zaangażowanie"
- Krótkie zdania, konkretne, obrazowe

---

## Gdzie szukać więcej

- Struktura plików, CSS, JS, portfolio workflow, SEO → `knowledge/ARCHITECTURE.md`
- Pułapki techniczne, styl, kolory, konwencje → `knowledge/PATTERNS.md`
- Zasady copywritingu, projekty portfolio, Schema.org → `knowledge/Content-Guide.md`
- Co zrobione, co do zrobienia → `knowledge/OPEN-ITEMS.md`
