// Strona główna jako marka osobista (podgląd /pl/podglad-strony-glownej/, 19.11.2026, slawek-strona).
// Zlecenie: zadania/2026-11-17-oferta-ciezar-na-ai/ZLECENIE-HOME-PARASOL.md (etap 2).
// Teksty: HOME-PARASOL-TEKSTY.md (cmo-oferta). Etap 4: hasło i nagłówki sekcji czekają na teksty według nowej
// metody (strategia marki, bank cytatów, test wyróżnialności); do tego czasu neutralne znaczniki [w przygotowaniu].
// Zostają: fakty w „Działa dziś”, karty usług (cmo-oferta, zaakceptowane na /parasol/), wstawka Kacpra.
import { autoPl } from './automatyzacja-pl';

export const parasolPl = {
  meta: {
    title: 'mioduszewsky · Kacper Mioduszewski',
    description: '[opis w przygotowaniu]',
  },
  nav: autoPl.nav,
  hero: {
    label: '( Kacper Mioduszewski )',
    /* Etap 4 (19.11 ok. 13:05): hasła z etapów 2 i 3 odrzucone, zmiana metody (strategia marki,
       bank cytatów, test wyróżnialności). Do meldunku cmo-oferta stoi neutralny znacznik; układ
       hero dopasuję do zdania, nie zdanie do układu. */
    placeholder: true,
    aria: 'Hasło w przygotowaniu',
    line1: '[hasło w przygotowaniu]',
    sub: '[podtytuł w przygotowaniu]',
    versions: [] as string[][],
  },
  problem: {
    label: '( Działa dziś )',
    /* Nagłówek sekcji czeka na teksty według nowej metody (etap 4). */
    h1: '[nagłówek',
    h2: 'w przygotowaniu]',
    intro: 'Trzy przykłady z różnych firm, bez danych klientów.',
    rows: [
      ['Faktura do KSeF bez człowieka', 'eskapizm, moja spółka: po płatności faktura sama trafia do KSeF i mailem do klienta.', ''],
      ['Zapytanie od razu jako zlecenie', 'Sprzedaż i montaż blatów: zapytanie ze strony samo zakłada zlecenie w panelu.', ''],
      ['Przeglądy i OC floty pod kontrolą', 'Transport: agent sprawdza terminy w CEPiK i przypomina przed każdym z nich.', ''],
    ],
    close: '',
  },
  services: {
    label: '( Usługi )',
    h1: '[nagłówek',
    h2: 'w przygotowaniu]',
    button: 'Zobacz usługę',
    /* Kolejność jak na landingach (decyzja 17.11), bez cen (decyzja Kacpra 19.11, etap 2). */
    items: [
      { slug: 'wdrozenie-ai', lead: 'Pracę, którą ktoś u Was powtarza co tydzień, przejmuje system szyty pod Waszą firmę.' },
      { slug: 'aplikacje-i-systemy', lead: 'Pomysł na aplikację, panel albo system zamieniam w pierwszą wersję, która działa na prawdziwych danych.' },
      { slug: 'strona-internetowa', lead: 'Treść, projekt i publikacja w jednych rękach. Zaczynamy od tego, czego potrzebuje Twój biznes.' },
      { slug: 'cofounder-as-a-service', lead: 'Stała współpraca przy Twoim projekcie: kierunek biznesowy, organizacja pracy i technologia.' },
    ],
  },
  who: {
    label: '( O mnie )',
    h1: '[nagłówek',
    h2: 'w przygotowaniu]',
    photoAlt: 'Kacper Mioduszewski',
    why1: autoPl.who.why1,
    why2: autoPl.who.why2,
  },
  footer: {
    label: '( Pogadajmy )',
    h1: '[nagłówek',
    h2: 'w przygotowaniu]',
    sub: '[podtytuł w przygotowaniu]',
    write: 'albo po prostu napisz',
    contact: 'Kontakt',
    badge: 'Wrocław, Polska · pracuję zdalnie · ',
    top: 'Wróć na początek',
    terms: 'Warunki',
    privacy: 'Prywatność',
  },
};
