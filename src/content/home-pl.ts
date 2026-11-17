export const homePl = {
  /* 17.11.2026: ciężar strony przeniesiony na automatyzację procesów z AI.
     Teksty: cmo-oferta (zadania/2026-11-17-oferta-ciezar-na-ai/TEKSTY-PL.md), układ: slawek-strona.
     Dawna treść o stronach jest na /pl/uslugi/strona-internetowa/ (services-pl.ts). */
  meta: {
    title: 'mioduszewsky · automatyzacja z AI, aplikacje i strony',
    description: 'Automatyzuję z AI powtarzalną pracę biura: mapa procesu, system na narzędziach, których już używasz, pomiar przed i po. Buduję też aplikacje i strony internetowe.',
  },
  nav: { cta: 'Umów 15 minut', sticky: 'Umów 15 minut', stickyAria: 'Umów 15 minut - rozmowa wideo', services: 'Usługi', cannabis: 'Branża konopna' },
  hero: {
    label: '( Automatyzacja · aplikacje · strony )',
    aria: 'Ręczną pracę przejmuje system.',
    line1: 'Ręczną pracę',
    em: 'przejmuje',
    line3: 'system',
    sub: 'Automatyzuję z AI powtarzalną pracę biura, na narzędziach, których już używacie. Buduję też aplikacje i strony internetowe.',
  },
  problem: {
    label: '( Problem )',
    h1: 'Firma rośnie.',
    h2: 'Biuro *przepisuje* coraz więcej.',
    intro: 'Zwykle widać to w jednym z trzech miejsc:',
    rows: [
      ['Te same dane wpisujecie kilka razy', 'Zapytanie z maila trafia do arkusza, z arkusza do oferty, z oferty do faktury. Za każdym razem ktoś przepisuje je ręcznie.'],
      ['Zlecenia żyją w zeszytach i na WhatsAppie', 'Ekipa wie, co ma robić, bo ktoś zadzwonił. Kiedy tej osoby nie ma, reszta dzwoni i pyta.'],
      ['Wszystko wie jedna osoba', 'Zwykle właściciel. Raport na koniec miesiąca składa wieczorem z trzech różnych miejsc.'],
    ],
    close: 'Ta praca się powtarza, więc da się ją oddać systemowi. *Najpierw patrzę, jak sprawa przechodzi przez firmę*, potem buduję to, co przejmie powtarzalną część.',
  },
  work: {
    label: '( Realizacje )',
    h1: 'To nie są zrzuty ekranu.',
    h2: 'To *działające systemy*.',
    intro: 'Strony możesz przewinąć tutaj. Na przykładzie eskapizmu pokazuję też, co system robi z zamówieniem, kiedy nikt go nie dotyka.',
    eskapizm: 'Firma planująca podróże po Azji, którą współprowadzę. Strona, płatności, faktury, aplikacja klienta i narzędzia do obsługi. Całość działa jako jeden system.',
    eskapizmAlt: 'eskapizm.com. Przewiń działającą stronę.',
    /* Przebieg zamiast zrzutu (decyzja slawek-strona + cmo-oferta, 17.11.2026): automatyzacji
       nie widać, więc pokazujemy jedną sprawę od wejścia do wyjścia, jak status przesyłki.
       Sprawdzone w kodzie eskapizmplany 819d2ba: paynow-webhook -> create-invoice -> sync-ksef-status. */
    flowLabel: '( Jedno zamówienie, zero kliknięć )',
    flow: [
      ['Wchodzi', 'Klient płaci online za plan podróży.'],
      ['System robi', 'Zakłada konto, wystawia fakturę i wysyła ją do KSeF. Co 15 minut sprawdza, czy KSeF nadał numer.'],
      /* Bez CRM (decyzja Fincha 17.11.2026): krok jest w kodzie, ale nie przeszedł jeszcze na prawdziwym zamówieniu. */
      ['Wychodzi', 'Klient dostaje fakturę PDF mailem. Nikt w firmie tego nie dotyka.'],
    ],
    liveNote: 'psst, działa.\nprzewiń',
    aigor: 'Strona kolekcji sztuki. Prace, artyści, historia pozyskania dzieł, newsletter i dwie wersje językowe. Całość ułożona tak, żeby prowadzić przez historię kolekcji.',
    aigorAlt: 'igorgrabowski.com. Przewiń działającą stronę.',
    aigorNote: 'to one pager.\ntu klikasz',
    more: 'Więcej realizacji',
    /* Bez nazwy firmy (decyzja Kacpra 17.11.2026). Tylko to, co działa: FAKTY-DO-CV sekcja 9a. */
    fleetName: 'Agent floty, firma transportowa',
    fleet: 'Rejestr pięciu zestawów ciężarowych. Agent sprawdza terminy przeglądów i OC w CEPiK, państwowej ewidencji pojazdów, a przypomnienia wpisuje do kalendarza 14 i 7 dni przed terminem.',
    /* Tylko funkcje potwierdzone w użyciu (FAKTY-DO-CV sekcja 3). Bez DXF, iPada i kalendarza. */
    glassstone: 'Firma od blatów kamiennych i szkła. Zapytanie z formularza zakłada zlecenie w CRM i trafia mailem do biura. Zlecenia mają w panelu etapy i kalendarz. Zamknięcie miesiąca dorobiłem cztery dni po prośbie zespołu.',
    cannversity: 'Landing page dla doradztwa w branży konopnej. Złożona oferta ułożona w prostą strukturę, którą da się szybko zrozumieć.',
    decksName: 'Prezentacje projektowe',
    decks: 'Interaktywne prezentacje i modele finansowe, które zderzają pomysł z realnymi ograniczeniami i decyzją biznesową.',
    disclaimer: 'Te realizacje pokazują, co zbudowałem i co działa. Nie są obietnicą oszczędności, przychodu ani konwersji.',
  },
  manifest: {
    line1: 'Nie chodzi o kolejny program.',
    cross: 'kolejny program',
    line2: 'Chodzi o *mniej przepisywania*.',
    line3: 'System robi swoje.',
    sub: 'Zapytanie z formularza samo zakłada zlecenie. Faktura wychodzi po płatności. Przypomnienie przychodzi przed terminem. Ty zatwierdzasz tylko to, co wymaga decyzji.',
  },
  how: {
    label: '( Jak pracuję )',
    h1: 'Płacisz za jeden proces.',
    h2: 'Masz go z głowy.',
    oldTitle: 'Typowe wdrożenie',
    oldList: ['Kupujesz kolejny program.', 'Ktoś go konfiguruje.', 'Szkolisz zespół.', 'Z resztą się nie łączy.', 'Ty spinasz całość.'],
    oldOut: '',
    newTitle: 'U mnie',
    newList: ['Patrzę, jak pracujecie dziś.', 'Liczę, ile to zajmuje.', 'Buduję na Waszych narzędziach.', 'Testujemy na żywych sprawach.', 'Mierzymy przed i po.'],
    newOut: 'Od pierwszej rozmowy do działającego systemu rozmawiasz z *tą samą osobą*.',
    /* why1-why3 w PL są złożone w w5.astro (podglądy zdjęć na słowach), tu zostaje źródło tekstu. */
    why1: 'Siemka, tu Kacper. Zanim zacząłem budować systemy, pracowałem przy prowadzeniu projektów i startupów: sprzedawałem B2B, układałem pracę zespołów i odpowiadałem za to, żeby firma działała na co dzień.',
    why2: 'Systemy buduję z Claude Code i Codexem, narzędziami AI, które piszą kod pod moim kierunkiem. Ja ustalam, jak sprawa przechodzi przez firmę i co trzeba zbudować, i odpowiadam za to, żeby działało.',
    why3: 'eskapizm to spółka, którą współprowadzę. Płatności, faktury i obsługa klienta działają tam na systemach, które zbudowałem.',
  },
  offer: {
    label: '( Oferta )',
    badge: '30 dni poprawek',
    h1: 'Automatyzacja',
    h2: 'procesów z AI',
    price: 'od *4 500 zł*',
    say: 'Bierzemy jedną powtarzalną pracę, która dziś zjada godziny Twojemu biuru. Rozpisuję ją, buduję system na narzędziach, których już używacie, i uruchamiam go na prawdziwych sprawach.',
    say2: 'Nie musisz wiedzieć, czy to ma być agent, integracja czy panel. Od tego jest pierwsza rozmowa: pokazujesz, jak pracujecie, a ja mówię, co da się oddać systemowi i ile to kosztuje.',
    assure: 'Cena pierwszego procesu jest znana przed startem. Jeśli z mapy procesu wyjdzie, że automatyzacja się nie opłaci, powiem Ci to.',
    includesLabel: 'Co dostajesz',
    includes: [
      'Mapę procesu z policzonym czasem',
      'System zbudowany na Waszych narzędziach',
      'Akceptację człowieka przed wysyłką do klienta',
      'Uruchomienie z pomiarem przed i po',
      'Krótką instrukcję dla zespołu',
      '30 dni poprawek po starcie',
      'Opiekę miesięczną na życzenie, płatną osobno',
    ],
    forWhom: 'Dla firm od 10 do 50 osób, w których biuro przepisuje dane między mailem, arkuszem i fakturami.',
    other: 'Co jeszcze robię',
    otherIntro: 'To osobne zakresy, wyceniane oddzielnie.',
    beyond: [
      { nr: '02', n: 'Aplikacja lub system', p: 'od 11 000 zł', d: 'Pierwsza działająca wersja produktu, aplikacji, dashboardu albo systemu dla firmy.' },
      { nr: '03', n: 'Strona internetowa', p: 'od 3 500 zł', d: 'Treść, projekt, technologia i publikacja w jednych rękach. Ustalamy, czego potrzebuje Twój biznes, a resztę biorę na siebie.' },
      { nr: '04', n: 'Cofounder as a Service', p: 'Porozmawiajmy o współpracy', d: 'Stała współpraca przy Twoim projekcie: kierunek biznesowy, organizacja pracy i technologia.' },
    ],
    fine: 'Cena dotyczy pierwszego procesu. Opiekę miesięczną wyceniam po uruchomieniu, bo zależy od skali i tego, ile się w systemie dzieje.',
  },
  process: {
    label: '( Proces )',
    h1: 'Od pierwszych 15 minut',
    h2: 'do działającego systemu.',
    steps: [
      ['Najpierw rozmawiamy', 'Pokazujesz mi jedną pracę, która zabiera za dużo czasu. Zaczynamy od 15 minut.'],
      ['Mapa procesu', 'Patrzę, jak robicie to dziś, i liczę, ile to zajmuje. Wiesz, co zbuduję, ile to kosztuje i jak sprawdzimy wynik.'],
      ['Rezerwujesz termin', 'Po akceptacji zakresu opłacasz projekt i rezerwuję termin. Mniejsze realizacje płacisz z góry, większe dzielimy na etapy płatne przed startem.'],
      ['Buduję na Waszych narzędziach', 'Poczta, arkusze, CRM albo system faktur. Tam, gdzie sprawa wychodzi do klienta, decyduje człowiek.'],
      ['Uruchamiamy i mierzymy', 'Sprawdzamy system na prawdziwych sprawach. Zespół dostaje krótką instrukcję, a my porównujemy czas przed i po.'],
      ['Potem zależy od skali', 'Masz 30 dni poprawek. Dalej opieka miesięczna albo kolejny proces.'],
    ],
  },
  faq: {
    label: '( Pytania przed startem )',
    items: [
      /* DO POTWIERDZENIA PRZEZ KACPRA: wersja ogólna. Pełna (Anthropic/OpenAI nie trenują na danych z API)
         wchodzi dopiero, gdy Kacper potwierdzi, że wdrożenia łączą się z modelem bezpośrednio przez ich API.
         Źródła: privacy.claude.com/en/articles/7996868, developers.openai.com/api/docs/guides/your-data */
      ['Co z naszymi danymi?', 'Buduję na kontach i narzędziach Twojej firmy, a dostępy zostają u Ciebie. Przed budową ustalamy, jakie dane trafiają do modelu AI i na jakich warunkach dostawcy.'],
      ['Co, jeśli AI się pomyli?', 'Zdarza się, dlatego przed budową ustalamy, gdzie decyduje człowiek. Wszystko, co wychodzi do klienta, może czekać na akceptację. Przez 30 dni poprawiam to, co nie działa tak, jak ustaliliśmy.'],
      ['Mamy już swoje programy. Trzeba je zmieniać?', 'Zwykle nie. Buduję na tym, czego już używacie: poczcie, arkuszach, CRM, systemie faktur. Możliwość połączenia sprawdzam, zanim podam cenę.'],
      ['Mamy ChatGPT. Po co nam to?', 'Czat odpowiada, kiedy ktoś go zapyta. Nie wie, że w skrzynce czeka nowe zapytanie, i sam nie wpisze faktury do systemu. Ja buduję system, który sam odbiera to zapytanie i prowadzi je dalej na Waszych narzędziach.'],
      ['Ile kosztuje utrzymanie?', 'Opiekę wyceniam po uruchomieniu, bo zależy od skali i tego, ile się w systemie dzieje. Koszty działania narzędzi i AI znasz przed startem.'],
      ['Ile godzin zaoszczędzimy?', 'Nie obiecuję liczby godzin, zanim nie zmierzę procesu. Odpowiadam za to, co buduję i co ustaliliśmy w zakresie. Pomiar przed i po pokaże, ile realnie zyskaliście.'],
    ],
  },
  footer: {
    label: '( Pogadajmy )',
    h1: 'Biuro robi coś ręcznie.',
    h2: 'Sprawdźmy, czy *musi*.',
    sub: 'Pokaż mi jedną pracę, którą Twoje biuro robi ręcznie. Powiem Ci, czy da się ją oddać systemowi i od czego bym zaczął.',
    write: 'albo po prostu napisz',
    contact: 'Kontakt',
    badge: 'Wrocław, Polska · pracuję zdalnie · ',
    top: 'Wróć na początek',
    terms: 'Warunki',
    privacy: 'Prywatność',
  },
} as const;
