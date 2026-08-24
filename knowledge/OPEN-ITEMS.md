# Verami.Studio — open items

> Stan na kwiecień 2026. Aktualizuj po każdej sesji.

---

## 🔴 Pilne — prawne i techniczne minimum

- [ ] **Polityka prywatności / RODO** — stworzyć `polityka-prywatnosci.html`,
  dodać link przy formularzu kontaktowym i w stopce na wszystkich stronach.
  Prawnie wymagane przy zbieraniu danych przez formularz.
- [ ] **Sitemap.xml** — wygenerować plik z 6 URLami, dodać do root repo,
  zgłosić w Google Search Console.
- [ ] **Robots.txt** — sprawdzić czy istnieje w root repo; jeśli nie — stworzyć.
- [ ] **Google Search Console** — zgłosić domenę `veramistudio.pl`, wgrać sitemap.

---

## 🟡 Ważne — wizerunek i analityka

- [ ] **Opinie klientów / testimonialy** — dodać sekcję z 2–3 cytatami
  na `index.html` i `o-mnie.html`. To największa luka wizerunkowa vs konkurencja
  w segmencie architektów wnętrz.
- [ ] **Zdjęcie zespołu** — upewnić się że `assets/about-photo.jpg` pokazuje osoby,
  nie wnętrze. Zdjęcie „twarzą marki" buduje zaufanie.
- [ ] **GA4 lub Plausible** — wdrożyć analitykę. Minimum: kliknięcia CTA + tel/email.
  Bez analityki nie wiadomo skąd przychodzą klienci.
- [ ] **og-image.jpg** — sprawdzić czy plik istnieje w `/assets/` i ma wymiary 1200×630px.
  Bez tego social media pokazuje brzydkie preview.
- [ ] **Thank-you page** — stworzyć `dziekujemy.html`, przekierować po wysłaniu
  formularza. Umożliwi śledzenie konwersji (cel w GA4).
- [ ] **projekt.html — dynamiczny title** — `<title>` uzupełniany przez JS;
  sprawdzić jak Google faktycznie indeksuje lub rozważyć statyczne podstrony per projekt.
- [ ] **Google Business Profile** — założyć profil, zebrać pierwsze recenzje.
  Priorytet SEO #1 dla lokalnego biznesu usługowego.

---

## 🟢 Do zrobienia kiedy czas

- [ ] **Social media w stopce** — dodać linki Instagram/Pinterest/Facebook
  do stopki na wszystkich stronach (kontakt.html już je ma).
- [ ] **Schema.org `o-mnie.html`** — zmienić `@type: Organization` na `LocalBusiness`
  z pełnymi danymi (adres, telefon, godziny).
- [ ] **Houzz.pl** — założyć bezpłatny profil, dodać wybrane projekty.
  Darmowy link zewnętrzny, pozytywny sygnał SEO.
- [ ] **Cookie banner** — wymagany po wdrożeniu GA4; zaplanować razem z analityką.
- [ ] **Blog** — 5 tematów już zaplanowanych; zaczynać dopiero po zakończeniu SEO faza 1
  (sitemap, Search Console, GBP).

---

## ✅ Zrealizowane

- [x] Rejestracja domeny `veramistudio.pl`
- [x] Konfiguracja DNS w OVH (rekordy A + CNAME)
- [x] Podpięcie domeny w GitHub Pages
- [x] HTTPS / Let's Encrypt — aktywne
- [x] Canonical i OG — zaktualizowane na `veramistudio.pl` na wszystkich 6 stronach
- [x] Formspree — aktywne, ID `xkopbzbw`, maile dochodzą ✅
- [x] Naprawa „O mnie" → „O nas" w `projekt.html` (nav + stopka)
- [x] Naprawa zepsutego zdjęcia `lazienka1/01.webp`
- [x] Audyt strony (kwiecień 2026)
