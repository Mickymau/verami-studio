/* ============================================
   VERAMI.STUDIO — form.js
   Formularz kontaktowy (kontakt.html).

   Wysylanie:
   - Formspree (priorytet) — wymaga ustawienia
     FORMSPREE_ID ponizej po rejestracji
   - Mailto fallback — otwiera klienta poczty

   Rejestracja Formspree (bezplatne, 50 msg/mc):
   1. Wejdz na https://formspree.io
   2. Stworz nowy formularz z adresem verami.studio@gmail.com
   3. Skopiuj ID (np. "xaybcdef")
   4. Wklej jako wartosc FORMSPREE_ID ponizej

   Walidacja:
   - Imie: wymagane, min. 2 znaki
   - Email: wymagany, poprawny format
   - Tresc: wymagana, min. 10 znakow
   ============================================ */

'use strict';

(function initForm() {

  const form = document.getElementById('contact-form');
  if (!form) return;

  /* ------------------------------------------------
     KONFIGURACJA — zmien tylko te wartosci
     ------------------------------------------------ */

  /* ID formularza z Formspree.io — wklej po rejestracji */
  const FORMSPREE_ID = 'xkopbzbw';

  /* Adres e-mail dla fallbacku mailto */
  const CONTACT_EMAIL = 'verami.studio@gmail.com';

  /* ------------------------------------------------
     REFERENCJE DO DOM
     ------------------------------------------------ */
  const nameInput    = form.querySelector('#field-name');
  const emailInput   = form.querySelector('#field-email');
  const messageInput = form.querySelector('#field-message');
  const submitBtn    = form.querySelector('[type="submit"]');
  const statusEl     = document.getElementById('form-status');

  const ORIGINAL_BTN_TEXT = submitBtn?.textContent || 'Wyslij';

  /* ------------------------------------------------
     WALIDACJA
     Zwraca { valid: true } lub { valid: false, field, msg }
     ------------------------------------------------ */
  function validate(name, email, message) {
    if (!name || name.trim().length < 2) {
      return { valid: false, field: nameInput, msg: 'Podaj imie (min. 2 znaki).' };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email.trim())) {
      return { valid: false, field: emailInput, msg: 'Podaj poprawny adres e-mail.' };
    }

    if (!message || message.trim().length < 10) {
      return { valid: false, field: messageInput, msg: 'Wiadomosc musi miec min. 10 znakow.' };
    }

    return { valid: true };
  }

  /* ------------------------------------------------
     KOMUNIKATY STATUSU
     type: 'success' | 'error' | 'loading' | 'reset'
     ------------------------------------------------ */
  function showStatus(type, msg) {
    if (!statusEl) return;

    /* Usun wszystkie stany */
    statusEl.classList.remove('is-success', 'is-error', 'is-loading');
    statusEl.removeAttribute('role');
    statusEl.textContent = '';

    if (type === 'reset') return;

    statusEl.classList.add(`is-${type}`);
    statusEl.setAttribute('role', 'alert');
    statusEl.textContent = msg;

    /* Scrolluj do komunikatu */
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    /* Auto-ukryj sukces po 8 sekundach */
    if (type === 'success') {
      setTimeout(() => showStatus('reset'), 8000);
    }
  }

  /* ------------------------------------------------
     PODSWIETLENIE BLEDNEGO POLA
     ------------------------------------------------ */
  function highlightField(field) {
    if (!field) return;
    field.classList.add('is-invalid');
    field.focus();
    field.addEventListener('input', () => field.classList.remove('is-invalid'), { once: true });
  }

  /* ------------------------------------------------
     WYSYLANIE
     ------------------------------------------------ */
  async function sendViaFormspree(name, email, message) {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method:  'POST',
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _replyto: email, /* Formspree: reply-to ustawiony na nadawce */
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `HTTP ${res.status}`);
    }
  }

  function sendViaMailto(name, email, message) {
    const subject = encodeURIComponent(`Zapytanie od ${name}`);
    const body    = encodeURIComponent(
      `Imie: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  /* ------------------------------------------------
     HANDLER SUBMIT
     ------------------------------------------------ */
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = nameInput?.value.trim()    || '';
    const email   = emailInput?.value.trim()   || '';
    const message = messageInput?.value.trim() || '';

    /* Walidacja */
    const check = validate(name, email, message);
    if (!check.valid) {
      showStatus('error', check.msg);
      highlightField(check.field);
      return;
    }

    /* Stan ladowania */
    if (submitBtn) {
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Wysylam\u2026';
    }
    showStatus('loading', 'Wysylam wiadomosc\u2026');

    /* Wyslij */
    try {
      if (FORMSPREE_ID) {
        await sendViaFormspree(name, email, message);
        form.reset();
        showStatus('success', 'Wiadomosc wyslana! Odezwe sie wkrotce \u2014 zwykle w ciagu 24h.');
      } else {
        /* Brak Formspree ID — fallback na mailto */
        sendViaMailto(name, email, message);
        showStatus('success', 'Otwieram klienta pocztowego z gotowa wiadomoscia\u2026');
      }
    } catch (err) {
      console.error('[form.js]', err);
      /* Przy bledzie Formspree sprobuj mailto jako ratunek */
      try {
        sendViaMailto(name, email, message);
        showStatus('success', 'Otwieram klienta pocztowego (plan B)\u2026');
      } catch {
        showStatus('error', 'Wystapil blad. Napisz bezposrednio na: ' + CONTACT_EMAIL);
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled    = false;
        submitBtn.textContent = ORIGINAL_BTN_TEXT;
      }
    }
  });

  /* ------------------------------------------------
     WALIDACJA NA ZYWO (podswietlenie w czasie pisania)
     ------------------------------------------------ */
  [nameInput, emailInput, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener('blur', () => {
      input.classList.remove('is-invalid');
      /* Sprawdz tylko to jedno pole przy opuszczeniu */
      const val = input.value.trim();
      if (input === emailInput && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        input.classList.add('is-invalid');
      }
      if ((input === nameInput    && val.length > 0 && val.length < 2)  ||
          (input === messageInput && val.length > 0 && val.length < 10)) {
        input.classList.add('is-invalid');
      }
    });
  });

})();
