// Strona główna jako marka osobista (podgląd /pl/podglad-strony-glownej/, 19.11.2026, slawek-strona).
// Zlecenie: zadania/2026-11-17-oferta-ciezar-na-ai/ZLECENIE-HOME-BUDOWA.md (zastępuje etapy z ZLECENIE-HOME-PARASOL.md).
// Tekst pierwszego ekranu, „Kto to buduje” i kontaktu: HOME-PIERWSZY-EKRAN.md runda 2, §12-14 (ghost-home),
// wpięty dosłownie. Kolejność jak u Szufla: pierwszy ekran, usługi, kto to buduje, działa dziś, kontakt.
// Nad sekcjami tylko etykiety w nawiasach, bez haseł. Opisy kart i zdanie kontaktu: tamże §8.
import { autoPl } from './automatyzacja-pl';

export const parasolPl = {
  meta: {
    title: 'mioduszewsky · Kacper Mioduszewski',
    description: 'Opowiedz, jak pracuje Twoja firma albo Twój dział. Powiem Ci, czy w ogóle trzeba coś budować i co: system, automatyzację, aplikację czy stronę, a potem sam to zbuduję.',
  },
  nav: autoPl.nav,
  hero: {
    label: '( Kacper Mioduszewski, Wrocław )',
    /* Runda 2 (Kacper 19.11 ok. 13:50: „za długi”, „nie wiadomo, co możesz od niego potrzebować”):
       HOME-PIERWSZY-EKRAN.md §12, dosłownie. Kropkę na końcu rysuje czerwona kropka marki.
       Zakreślone jedno słowo: „pracuje” (sens nagłówka: zaczynamy od tego, jak pracuje firma). */
    before: 'Opowiedz, jak ',
    em: 'pracuje',
    after: ' Twoja firma albo Twój dział',
    aria: 'Opowiedz, jak pracuje Twoja firma albo Twój dział.',
    sub: 'Powiem Ci, czy w ogóle trzeba coś budować i co: system, automatyzację, aplikację czy stronę, a potem sam to zbuduję.',
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
    /* Runda 2: HOME-PIERWSZY-EKRAN.md §13, zdanie 1 wg poprawki ghost-home w logu 13:50 („projekty”). */
    text: 'Jestem człowiekiem od biznesu: od 2018 roku rozkręcam projekty od zera do jeden, a ostatnie pięć, sześć lat głównie zarządzałem spółkami i zespołami oraz stawiałem operacje. Część rzeczy zamknąłem sam, bo liczby się nie spinały. Jestem generalistą i przez lata była to moja frustracja, dzisiaj z AI jest moim lewarem: to, co ustalimy, projektuję, buduję w Claude Code i Codexie i uruchamiam. Jeśli jednoosobowej firmie wystarczy zwykła subskrypcja narzędzia AI, nie namawiam jej na nic droższego.',
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
    /* Runda 2: HOME-PIERWSZY-EKRAN.md §14 (stare zdanie przeszło na pierwszy ekran). */
    sub: 'Usługi nie musisz wybierać przed rozmową: strona jest najczęstszym wejściem, ale rozmowa zwykle schodzi na to, co jeszcze da się w firmie uprościć.',
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
