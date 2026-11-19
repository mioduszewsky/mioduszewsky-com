// Landing /pl/uslugi/wdrozenie-ai/ „Automatyzacja procesów z AI” (19.11.2026, slawek-strona).
// Koncepcja: zadania/2026-11-17-oferta-ciezar-na-ai/KONCEPCJA-AI-LANDING.md (v2 po recenzji Codexa).
// Teksty końcowe: TEKSTY-AI-LANDING.md (cmo-oferta, 19.11 08:43, poprawki 10:10 wg ODPOWIEDZI-KACPRA-2026-11-19). Odstępstwa od pliku CMO, po recenzji
// Codexa (runda 2): offer.steps[1] i faq[1] bez obietnicy, której mapa przeczy (faktura idzie sama);
// tor człowieka na mapie rozpisany na ścieżkę wyjątkową (map.humanFlow).
// Limity w liniach na 390 px: hero.line1 i em+line3 do 351 px, offer.h1/h2 do 12 znaków.
export const autoPl = {
  meta: {
    title: 'Automatyzacja procesów z AI · mioduszewsky',
    description: 'Biorę jedną powtarzalną pracę w Twojej firmie i buduję system na narzędziach, których już używacie. Pierwszy proces od 4 500 zł.',
  },
  nav: { cta: 'Umów 15 minut', sticky: 'Umów 15 minut', stickyAria: 'Umów 15 minut - rozmowa wideo', services: 'Usługi', cannabis: 'Branża konopna' },
  hero: {
    label: '( Automatyzacja procesów z AI )',
    aria: 'System szyty na miarę firmy.',
    line1: 'System szyty',
    em: 'na miarę',
    line3: 'firmy',
    sub: 'Pracę, którą ktoś u Was robi ręcznie co tydzień, przejmuje system zbudowany na Waszych narzędziach.',
    ctaNote: '15 minut o jednej czynności: czy warto ją automatyzować i od czego zacząć.',
  },
  problem: {
    label: '( Gdzie to widać )',
    h1: 'Ta sama robota,',
    h2: 'co tydzień *od nowa*.',
    intro: 'To przykłady sytuacji, nie opisy klientów.',
    // [tytuł, opis, branża]
    rows: [
      ['Wyceny składane po godzinach', 'Każdą wycenę właściciel składa z tych samych pozycji. Robi to wieczorem, bo w dzień nie ma kiedy.', 'Usługi projektowe'],
      ['Te same pytania każdego dnia', 'Gdzie jest paczka, jak oddać towar, kiedy dostawa. Ktoś odpisuje na to ręcznie, zamiast zająć się sprzedażą.', 'Sklep internetowy'],
      ['Raporty z budów na WhatsAppie', 'Kierownicy wysyłają zdjęcia i notatki na czacie, a potem ktoś przepisuje je do arkusza.', 'Budownictwo'],
    ],
    close: '',
  },
  map: {
    label: '( Mapa procesu )',
    h1: 'Po płatności',
    h2: 'faktura *wychodzi sama*.',
    intro: 'Tak wygląda mapa procesu, od której zaczyna się każde wdrożenie. Przykład z eskapizmu, spółki, którą współprowadzę. Działa tak od pierwszego zamówienia.',
    /* Bez skreśleń: faktury w eskapizmie nigdy nie były ręczne (Kacper 19.11). */
    sheet: 'Faktura po płatności · eskapizm',
    laneSystem: 'System',
    laneHuman: 'Człowiek',
    stations: [
      ['Klient płaci', 'Płatność online za plan podróży uruchamia cały proces.'],
      ['Konto', 'System sam zakłada klientowi konto.'],
      ['Faktura', 'System wystawia fakturę w Fakturowni.'],
      ['KSeF', 'Faktura idzie do KSeF. Co 15 minut system sprawdza, czy ma numer.'],
      ['Faktura u klienta', 'Klient dostaje fakturę PDF mailem. Nikt w firmie tego nie dotyka.'],
    ],
    /* Ścieżka wyjątkowa (recenzja Codexa, runda 2): od błędu do człowieka, nie osobny podpis.
       Treść z map.errorNote CMO: „Coś nie przejdzie? Wtedy alert mailem.” */
    humanNote: 'tylko przy błędzie',
    humanFlow: ['Coś nie przejdzie', 'Alert mailem', 'Człowiek sprawdza sprawę'],
    caption: 'Przykład z mojej spółki. Bez danych klientów.',
  },
  examples: {
    label: '( Inne procesy )',
    h1: 'Inna firma,',
    h2: '*inny* proces.',
    rows: [
      ['Transport', 'Agent prowadzi rejestr pięciu zestawów ciężarowych, sprawdza przeglądy i OC w CEPiK i przypomina 14 i 7 dni przed terminem. Koszty bierze z programu księgowego.', 'Człowiek: przypomnienie trafia do kalendarza, a przegląd umawia właściciel.'],
      ['Sprzedaż i montaż blatów', 'Zapytanie z formularza na stronie samo zakłada zlecenie w panelu i przychodzi mailem do firmy. Zamknięcie miesiąca dorobiłem na prośbę zespołu.', 'Człowiek: zespół prowadzi zlecenie dalej w panelu.'],
    ],
  },
  offer: {
    label: '( Oferta )',
    badge: '30 dni poprawek',
    h1: 'Jeden proces',
    h2: 'na start',
    price: 'od *4 500 zł*',
    say: 'Mapa procesu z policzonym czasem, system na Waszych narzędziach, uruchomienie na prawdziwych sprawach, krótka instrukcja dla zespołu i 30 dni poprawek.',
    assure: 'Dokładną cenę, czas i koszty działania narzędzi znasz po mapie procesu, przed budową. Jeśli automatyzacja się nie opłaci, powiem Ci to.',
    stepsLabel: 'Jak to przebiega',
    steps: [
      ['Mapa procesu', 'Pokazujesz, jak robicie to dziś. Liczę czas i sprawdzam, czego używacie i co da się połączyć.'],
      ['Budowa na Waszych narzędziach', 'Poczta, arkusze, CRM albo system faktur. Przed budową ustalamy, które kroki czekają na decyzję człowieka.'],
      ['Uruchomienie z pomiarem', 'Sprawdzamy system na sprawach z bieżącej pracy i porównujemy czas przed i po.'],
      ['30 dni poprawek', 'Poprawiam wszystko, co nie działa tak, jak ustaliliśmy.'],
    ],
    care: 'Potem opieka miesięczna, wyceniana po uruchomieniu, albo kolejny proces.',
    fine: '',
  },
  who: {
    label: '( Kto to buduje )',
    h1: 'Kto to buduje',
    h2: 'i na jakich *zasadach*.',
    photoAlt: 'Kacper Mioduszewski',
    why1: 'Siemka, tu Kacper. Zanim zacząłem budować systemy, sprzedawałem B2B i układałem pracę zespołów. Dlatego najpierw patrzę, jak sprawa przechodzi przez firmę.',
    why2: 'Buduję z Claude Code i Codexem. Sam pracuję na swoim asystencie: pilnuje moich zadań i kalendarza, a maile szkicuje do mojej akceptacji.',
    rulesLabel: '( Zasady )',
    rules: [
      ['Człowiek przed klientem', 'Wszystko, co wychodzi do klienta, może czekać na akceptację. Ustalamy to przed budową.'],
      ['Ktoś wie o błędzie', 'Przed budową ustalamy, kto dostaje alert, gdy coś nie przejdzie.'],
      /* Kacper 19.11: model i dostęp dobierane pod firmę, automatyzacja działa bez człowieka; bez zdania o trenowaniu modeli. */
      ['Dane i dostępy u Ciebie', 'Model AI dobieram pod firmę. Buduję na Waszych kontach, więc system działa dalej beze mnie.'],
    ],
  },
  faq: {
    label: '( Pytania przed startem )',
    items: [
      ['Nasza firma działa po swojemu. Da się to zautomatyzować?', 'Dlatego zaczynam od mapy procesu, a nie od gotowego narzędzia. Liczę czas i sprawdzam, czego używacie. Jeśli z mapy wyjdzie, że automatyzacja się nie opłaci, powiem Ci to, zanim cokolwiek zbudujemy.'],
      ['Co z naszymi danymi? Jakiego AI użyjesz?', 'Model i sposób dostępu dobieram pod Waszą firmę: zwykła subskrypcja, API dostawcy, OpenRouter (jedno konto i jedna płatność za wiele modeli) albo AWS. Buduję na kontach Twojej firmy, dostępy zostają u Ciebie. Przed budową ustalamy, jakie dane trafiają do modelu.'],
      ['Mamy ChatGPT. Po co nam to?', 'Czat odpowiada, kiedy ktoś go zapyta. Bez połączenia z Waszymi programami nie wie, że w skrzynce czeka nowe zapytanie, i nie wpisze faktury do systemu. Buduję system, który sam odbiera to zapytanie i prowadzi je dalej na Waszych narzędziach.'],
      ['Ile kosztuje utrzymanie?', 'Opiekę wyceniam po uruchomieniu, bo zależy od tego, ile się w systemie dzieje. Koszty działania narzędzi i AI znasz przed budową.'],
      ['Ile godzin zaoszczędzimy?', 'Nie obiecuję liczby godzin, zanim nie zmierzę procesu. Pomiar przed i po pokaże, ile realnie zyskaliście.'],
    ],
  },
  footer: {
    label: '( Pogadajmy )',
    h1: 'Robicie coś ręcznie?',
    h2: 'Sprawdźmy, czy *musi*.',
    sub: 'Pokaż mi jedną pracę, którą ktoś u Was powtarza co tydzień. Powiem Ci, czy da się ją oddać systemowi i od czego bym zaczął.',
    write: 'albo po prostu napisz',
    contact: 'Kontakt',
    badge: 'Wrocław, Polska · pracuję zdalnie · ',
    top: 'Wróć na początek',
    terms: 'Warunki',
    privacy: 'Prywatność',
  },
} as const;
