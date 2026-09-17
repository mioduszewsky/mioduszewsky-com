/** Wejście dla branży konopnej.
 *
 * Decyzja Kacpra 17.09.2026: podpis prowadzi WPROST na cannversity.com, bez podstrony
 * pośredniej na mioduszewsky.com. Cannversity to gotowa, zniszowana marka dla tej branży
 * i to ona ma zrobić wrażenie po kliknięciu. Nie budować tu landinga konopnego.
 *
 * Nikt nie trafia na cannversity.com z zewnątrz (marka nie jest promowana), więc ten link
 * jest jej jedynym kanałem dystrybucji — i dlatego MUSI nieść UTM od pierwszego dnia.
 * Kliknięcia w link wychodzący nie widać ani w formularzu, ani w GA4, a danych nie da się
 * odzyskać wstecz.
 *
 * Kontekst i uzasadnienie: docs/STRUKTURA-NAWIGACJA.md §4.
 */
const BASE = 'https://www.cannversity.com/';

/** medium rozróżnia miejsce kliknięcia: nav | uslugi | home */
export const cannabisHref = (medium: 'nav' | 'uslugi' | 'home') =>
  `${BASE}?utm_source=mioduszewsky&utm_medium=${medium}&utm_campaign=branza-konopna`;

export const cannabisCopy = {
  pl: {
    nav: 'Branża konopna',
    navShort: 'Konopie',
    navAria: 'Branża konopna — przejdź do Cannversity (nowa karta)',
    q: 'Jesteś z branży konopnej?',
    a: 'Mam dla Ciebie osobne miejsce.',
    brand: 'Cannversity',
  },
  en: {
    nav: 'Cannabis industry',
    navShort: 'Cannabis',
    navAria: 'Cannabis industry — go to Cannversity (opens in a new tab)',
    q: 'Working in the cannabis industry?',
    a: 'I built a separate place for that.',
    brand: 'Cannversity',
  },
} as const;
