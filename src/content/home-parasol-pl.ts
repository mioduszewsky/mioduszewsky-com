// Strona główna jako marka osobista (podgląd /pl/podglad-strony-glownej/, 19.11.2026, slawek-strona).
// Zlecenie: zadania/2026-11-17-oferta-ciezar-na-ai/ZLECENIE-HOME-BUDOWA.md (zastępuje etapy z ZLECENIE-HOME-PARASOL.md).
// Tekst pierwszego ekranu i sekcji „Kto to buduje”: HOME-PIERWSZY-EKRAN.md sekcje 1 i 2 (Ghost, bramka Fincha),
// wpięty dosłownie. Kolejność jak u Szufla: pierwszy ekran, usługi, kto to buduje, działa dziś, kontakt.
// Nad sekcjami tylko etykiety w nawiasach, bez haseł. Opisy kart i zdanie kontaktu: tamże §8.
import { autoPl } from './automatyzacja-pl';

export const parasolPl = {
  meta: {
    title: 'mioduszewsky · Kacper Mioduszewski',
    description: 'Jestem człowiekiem od biznesu, który sam buduje systemy, automatyzacje, aplikacje i strony.',
  },
  nav: autoPl.nav,
  hero: {
    label: '( Kacper Mioduszewski, Wrocław )',
    /* Nagłówek dosłownie; kropkę na końcu zdania rysuje czerwona kropka marki (jak w hero landingów).
       Zakreślone jedno słowo: „sam” (w nim siedzi różnica, HOME-PIERWSZY-EKRAN.md §4). */
    before: 'Jestem człowiekiem od biznesu, który ',
    em: 'sam',
    after: ' buduje systemy, automatyzacje, aplikacje i strony',
    aria: 'Jestem człowiekiem od biznesu, który sam buduje systemy, automatyzacje, aplikacje i strony.',
    sub: 'Ostatnie pięć, sześć lat głównie zarządzałem spółkami, budowałem zespoły i stawiałem operacje. Możesz więc przyjść do mnie z własną firmą, ale też z działem albo zespołem, który prowadzisz w większej organizacji.',
  },
  services: {
    label: '( Usługi )',
    button: 'Zobacz usługę',
    /* Kolejność jak na landingach (decyzja 17.11), bez cen. Opisy kart: HOME-PIERWSZY-EKRAN.md §8 (przyjęte
       przez Fincha), dosłownie. Nazwa czwartej karty zostaje (zmiana to decyzja Kacpra). */
    items: [
      { slug: 'wdrozenie-ai', lead: 'Pokazujesz mi jedną czynność z poczty, arkuszy albo programu do faktur, a ja buduję system, który ją przejmuje na Waszych narzędziach.' },
      { slug: 'aplikacje-i-systemy', lead: 'Wystarczy pomysł na aplikację dla klientów albo na narzędzie dla zespołu, na przykład panel zleceń.' },
      { slug: 'strona-internetowa', lead: 'Przychodzisz ze starą stroną, szkicem albo bez niczego, a teksty, projekt i publikację biorę na siebie.' },
      { slug: 'cofounder-as-a-service', lead: 'Gdy masz projekt do uruchomienia albo firmę, w której kolejne pomysły konkurują z codzienną pracą, dołączam na stałe do decyzji i do wykonania.' },
    ],
  },
  who: {
    label: '( Kto to buduje )',
    photoAlt: 'Kacper Mioduszewski',
    text: 'Od 2018 roku buduję biznesy od zera do jeden i część z nich zamknąłem sam, bo liczby się nie spinały. Jestem generalistą i przez lata była to moja frustracja, dzisiaj z AI jest moim lewarem: to, co ustalimy, projektuję, buduję w Claude Code i Codexie i uruchamiam. Jeśli jednoosobowej firmie wystarczy zwykła subskrypcja narzędzia AI, nie namawiam jej na nic droższego.',
  },
  facts: {
    label: '( Działa dziś )',
    rows: [
      ['Faktura do KSeF bez człowieka', 'eskapizm, moja spółka: po płatności faktura sama trafia do KSeF i mailem do klienta.'],
      ['Zapytanie od razu jako zlecenie', 'Sprzedaż i montaż blatów: zapytanie ze strony samo zakłada zlecenie w panelu.'],
      ['Przeglądy i OC floty pod kontrolą', 'Transport: agent sprawdza terminy w CEPiK i przypomina przed każdym z nich.'],
    ],
  },
  footer: {
    label: '( Kontakt )',
    /* Zdanie kontaktu: HOME-PIERWSZY-EKRAN.md §8, dosłownie. */
    sub: 'Opowiedz mi, jak dziś pracuje Twoja firma albo Twój dział, a w 15 minut powiem Ci, od której z tych czterech rzeczy bym zaczął i czy w ogóle trzeba coś budować.',
    h1: '',
    h2: '',
    write: 'albo po prostu napisz',
    contact: 'Kontakt',
    badge: 'Wrocław, Polska · pracuję zdalnie · ',
    top: 'Wróć na początek',
    terms: 'Warunki',
    privacy: 'Prywatność',
  },
};
