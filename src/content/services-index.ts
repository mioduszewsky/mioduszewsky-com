/** Strona „Usługi" — spis tego, co robię, w jednym miejscu.
 *
 * Decyzja Kacpra 17.09.2026, zastępuje odrzucenie hubu z 09.09: podstrony usług były dla
 * klienta niewidoczne (blok na 67% wysokości strony głównej, zero linków w navie), a człowiek,
 * który przyszedł po stronę www, a potrzebuje czegoś innego, zostawał bez niczego.
 *
 * To NIE jest równorzędny front marki — tym była odrzucona wersja z 09.09
 * (src/pages/pl/uslugi/index.astro.rejected w worktree service-landings; nie przywracać).
 * Flagowa oferta broni się proporcją: pozycja 01 zajmuje tyle co pozostałe trzy razem.
 *
 * Kontekst: docs/STRUKTURA-NAWIGACJA.md §3.
 */
export const servicesIndex = {
  pl: {
    title: 'Usługi · mioduszewsky',
    description: 'Kompletna strona internetowa, wdrożenia AI, aplikacje i systemy oraz stała współpraca przy projekcie. Każdy zakres wyceniany osobno.',
    label: 'Usługi',
    h1a: 'Najczęściej zaczyna się od strony.',
    h1b: 'Rzadko na niej kończy.',
    lead: 'Każdy z tych zakresów wyceniam osobno. Jeśli nie wiesz, który jest Twój, umów 15 minut — powiem Ci wprost, czego potrzebujesz, a czego nie.',
    flagNr: '01',
    flagLabel: 'Zacznij tutaj',
    flagName: 'Kompletna strona internetowa',
    flagCta: 'Umów 15 minut',
    flagService: 'Kompletna strona internetowa',
    restLabel: 'Osobne zakresy',
    closingH: 'Nie wiesz, który zakres jest Twój?',
    closingP: 'Opowiedz, co chcesz zrobić. Piętnaście minut wideo, bezpłatnie. Wyjdziesz z tej rozmowy z konkretnym następnym krokiem, nawet jeśli nie będziemy pracować razem.',
    closingCta: 'Umów 15 minut',
    // Krotkie leady pisane pod liste. Meta `description` z services-pl.ts jest pisana pod
    // wyszukiwarke (dluzsza, u Cofoundera konczy sie nazwiskiem) i na liscie czyta sie zle.
    leads: {
      'wdrozenie-ai': 'Konkretny proces zabiera za dużo ręcznej pracy. Rozpisuję go i buduję automatyzację, agenta albo integrację.',
      'aplikacje-i-systemy': 'Pierwsza działająca wersja produktu, aplikacji, dashboardu albo systemu dla firmy.',
      'cofounder-as-a-service': 'Stała współpraca przy Twoim projekcie: kierunek biznesowy, organizacja pracy i technologia.',
    } as Record<string, string>,
  },
  en: {
    title: 'Services · mioduszewsky',
    description: 'A complete website build, AI implementations, apps and systems, and long-term work on your project. Each scope priced on its own.',
    label: 'Services',
    h1a: 'It usually starts with a website.',
    h1b: 'It rarely ends there.',
    lead: 'Each of these is priced on its own. If you are not sure which one is yours, book 15 minutes — I will tell you straight what you need and what you do not.',
    flagNr: '01',
    flagLabel: 'Start here',
    flagName: 'Complete website build',
    flagCta: 'Book a 15-min call',
    flagService: 'Complete website build',
    restLabel: 'Separate scopes',
    closingH: 'Not sure which one is yours?',
    closingP: 'Tell me what you want to do. Fifteen minutes on video, free. You leave that call with a clear next step, even if we never work together.',
    closingCta: 'Book a 15-min call',
    leads: {
      'ai-implementation': 'A specific process eats too much manual work. I map it and build the automation, agent or integration.',
      'apps-and-systems': 'A first working version of a product, application, dashboard or business system.',
      'cofounder-as-a-service': 'A business partner on your project: direction, how the work runs and the technology behind it.',
    } as Record<string, string>,
  },
} as const;
