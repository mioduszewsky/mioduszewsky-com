// Landing /pl/uslugi/wdrozenie-ai/ „Automatyzacja procesów z AI” (19.11.2026, slawek-strona).
// Koncepcja: zadania/2026-11-17-oferta-ciezar-na-ai/KONCEPCJA-AI-LANDING.md (v2 po recenzji Codexa).
// TEKSTY ROBOCZE z faktów (FAKTY-DO-CV 3, 4, 9a). Teksty końcowe pisze cmo-oferta w limitach z koncepcji.
// Limity w liniach na 390 px: hero.line1 i em+line3 do ok. 14 znaków, nagłówki sekcji do ok. 22,
// offer.h1/h2 do 12, bo dłuższe łamią układ (rozjazdy z 17.11).
export const autoPl = {
  meta: {
    title: 'Automatyzacja procesów z AI · mioduszewsky',
    description: 'Automatyzuję z AI jedną powtarzalną czynność w firmie, na narzędziach, których już używacie. Mapa procesu, budowa, uruchomienie z pomiarem, 30 dni poprawek. Od 4 500 zł.',
  },
  nav: { cta: 'Umów 15 minut', sticky: 'Umów 15 minut', stickyAria: 'Umów 15 minut - rozmowa wideo', services: 'Usługi', cannabis: 'Branża konopna' },
  hero: {
    label: '( Automatyzacja procesów z AI )',
    aria: 'Ręczną robotę zrobi system.',
    line1: 'Ręczną robotę',
    em: 'zrobi',
    line3: 'system',
    sub: 'Automatyzuję z AI jedną powtarzalną czynność w Twojej firmie, na narzędziach, których już używacie.',
    ctaNote: '15 minut o jednej czynności i o tym, czy warto ją automatyzować',
  },
  problem: {
    label: '( Gdzie to siedzi )',
    h1: 'Każda firma ma',
    h2: 'swoje *przepisywanie*.',
    intro: 'Zwykle to jedna z trzech sytuacji:',
    rows: [
      ['Zapytanie trafia w kilka miejsc', 'Klient pisze przez formularz, ktoś przepisuje to do arkusza, potem do oferty i do faktury.'],
      ['Terminy pilnowane w głowie', 'Przeglądy, ubezpieczenia, umowy. Ktoś musi pamiętać, a gdy go nie ma, termin mija.'],
      ['Po płatności zaczyna się papierologia', 'Faktura, wysyłka do KSeF, mail do klienta. Za każdym razem te same kroki.'],
    ],
    close: 'W każdej firmie ta sama sytuacja wygląda trochę inaczej, więc system *buduję pod Wasz proces*. Tak to wygląda na jednym przykładzie.',
  },
  map: {
    label: '( Mapa procesu )',
    h1: 'Jeden proces',
    h2: 'od początku *do końca*.',
    intro: 'Pierwszy krok usługi to mapa: co uruchamia sprawę, co system robi sam i gdzie wchodzi człowiek. Tu faktury w eskapizmie, mojej spółce.',
    sheet: 'Faktura po płatności · eskapizm',
    laneSystem: 'System',
    laneHuman: 'Człowiek',
    stations: [
      ['Klient płaci', 'Płatność online za plan podróży uruchamia cały proces.'],
      ['Konto', 'System zakłada konto klienta albo dopina zamówienie do istniejącego.'],
      ['Faktura', 'Wystawia fakturę w Fakturowni.'],
      ['KSeF', 'Wysyła ją do KSeF i co 15 minut sprawdza, czy jest numer.'],
      ['Mail do klienta', 'Klient dostaje PDF faktury. Nikt w firmie tego nie dotyka.'],
    ],
    human: 'Wchodzi tylko wtedy, gdy coś nie przejdzie.',
    humanNote: 'wtedy alert mailem',
    caption: 'Przykład z mojej spółki. Bez danych klientów.',
  },
  examples: {
    label: '( Inne procesy )',
    h1: 'Inna firma,',
    h2: '*inny* proces.',
    rows: [
      ['Transport', 'Agent prowadzi rejestr 5 zestawów, sprawdza przeglądy i OC w CEPiK i wpisuje przypomnienia 14 i 7 dni przed terminem. Koszty firmy pobiera przez API programu księgowego.', 'Człowiek dostaje przypomnienie w kalendarzu.'],
      ['Sprzedaż i montaż blatów', 'Zapytanie z formularza na stronie samo zakłada zlecenie w panelu i przychodzi mailem do firmy. Zamknięcie miesiąca dołożyłem 4 dni po prośbie zespołu.', 'Zespół prowadzi zlecenie dalej w panelu.'],
    ],
  },
  offer: {
    label: '( Oferta )',
    badge: '30 dni poprawek',
    h1: 'Pierwszy',
    h2: 'proces z AI',
    price: 'od *4 500 zł*',
    say: 'Bierzemy jedną powtarzalną czynność. Rozpisuję ją, buduję system na narzędziach, których już używacie, i uruchamiam go na prawdziwych sprawach.',
    assure: 'Cenę znasz po mapie procesu, przed budową. Jeśli z mapy wyjdzie, że automatyzacja się nie opłaci, powiem Ci to.',
    stepsLabel: 'Jak to przebiega',
    steps: [
      ['Mapa procesu', 'Patrzę, jak robicie to dziś, liczę czas i sprawdzam, czy Wasze programy da się połączyć.'],
      ['Budowa na Waszych narzędziach', 'Poczta, arkusze, CRM, system faktur. Tam, gdzie sprawa idzie do klienta, decyduje człowiek.'],
      ['Uruchomienie i pomiar', 'System pracuje na prawdziwych sprawach. Porównujemy czas przed i po.'],
      ['30 dni poprawek', 'Poprawiam to, co nie działa tak, jak ustaliliśmy.'],
    ],
    care: 'Potem opieka miesięczna, jeśli chcecie.',
    fine: 'Cena dotyczy pierwszego procesu. Opiekę wyceniam po uruchomieniu, bo zależy od skali i tego, ile się w systemie dzieje.',
  },
  who: {
    label: '( Kto to buduje )',
    h1: 'Rozmawiasz z osobą,',
    h2: 'która to *zbuduje*.',
    rulesLabel: '( Zasady )',
    rules: [
      ['Człowiek tam, gdzie decyduje', 'Przed budową ustalamy, co system robi sam, a co czeka na akceptację, na przykład odpowiedź do klienta przygotowana przez AI.'],
      ['Błąd nie przechodzi po cichu', 'Gdy coś nie przejdzie, system sam to zgłasza. W eskapizmie przychodzi wtedy alert mailem.'],
      /* DO POTWIERDZENIA PRZEZ KACPRA: wersja ogólna, jak FAQ 17.11. */
      ['Dostępy zostają u Was', 'Buduję na kontach i narzędziach Twojej firmy. Przed budową ustalamy, jakie dane trafiają do modelu AI i na jakich warunkach dostawcy.'],
    ],
  },
  faq: {
    label: '( Pytania przed startem )',
    items: [
      ['Mamy już swoje programy. Trzeba je zmieniać?', 'Zwykle nie. Buduję na tym, czego już używacie: poczcie, arkuszach, CRM, systemie faktur. Możliwość połączenia sprawdzam na mapie procesu, zanim podam cenę.'],
      ['Mamy ChatGPT. Po co nam to?', 'Czat odpowiada, kiedy ktoś go zapyta. Nie wie, że w skrzynce czeka nowe zapytanie, i sam nie wpisze faktury do systemu. Ja buduję system, który sam odbiera sprawę i prowadzi ją dalej na Waszych narzędziach.'],
      ['Ile kosztuje utrzymanie?', 'Opiekę wyceniam po uruchomieniu, bo zależy od skali i tego, ile się w systemie dzieje. Koszty działania narzędzi i AI znasz przed startem.'],
      ['Ile godzin zaoszczędzimy?', 'Nie obiecuję liczby godzin, zanim nie zmierzę procesu. Pomiar przed i po jest częścią uruchomienia, więc zobaczycie, ile realnie zyskaliście.'],
    ],
  },
  footer: {
    label: '( Pogadajmy )',
    h1: 'Coś robicie ręcznie?',
    h2: 'Sprawdźmy, czy *musicie*.',
    sub: 'Pokaż mi jedną czynność, która się powtarza. Powiem Ci, czy da się ją oddać systemowi i od czego bym zaczął.',
    write: 'albo po prostu napisz',
    contact: 'Kontakt',
    badge: 'Wrocław, Polska · pracuję zdalnie · ',
    top: 'Wróć na początek',
    terms: 'Warunki',
    privacy: 'Prywatność',
  },
} as const;
