/** Case study Cannversity, pierwsza realizacja opisana na własnej domenie (ClickUp 869f3n2n0).
 * Skład: ServiceLanding.astro, ten sam co podstrony usług. EN pisane po angielsku, fakty 1:1.
 *
 * Źródła faktów (każde zdanie o tym, co Kacper zrobił):
 * - projekty/cannversity/STATUS.md (21.09.2026): copy na „ja”, FAQ prawne, osobny HTML /en
 *   z title/description/OG/canonical/hreflang, hosting Vercel, domena i certyfikat;
 * - repo ~/cannversity: sekcje strony (src/pages/Index.tsx), kalendarz Google (BOOKING_URL),
 *   formularz web3forms z honeypotem, newsletter, regulamin i polityka, /en; CHANGELOG.md;
 * - kontekst/osobiste/Historia.md: marka Cannversity postawiona w 2025;
 * - src/content/home-pl.ts: opis realizacji i disclaimer zatwierdzone na głównej;
 * - src/pages/w5.astro (EN): Cannversity to własny projekt, nie zlecenie klienta.
 * Bez liczb wyników: żadnych danych o ruchu ani konwersji nie ma, więc ich nie podajemy. */
import type { Service } from './services-pl';
import { cannabisHref } from './cannabis';

export const caseCannversityPl: Service = {
  slug: 'realizacja-cannversity',
  name: 'Cannversity',
  label: 'Realizacja: Cannversity',
  title: 'Doradztwo dla branży konopnej ułożone w jedną czytelną stronę.',
  accent: 'jedną czytelną stronę',
  altPath: '/work/cannversity/',
  lead: 'Cannversity to mój własny projekt, dlatego mogę pokazać go w całości. Zaprojektowałem i zbudowałem stronę w wersji polskiej i angielskiej, która tłumaczy ofertę doradczą dla branży konopnej i prowadzi do bezpłatnej, 30-minutowej rozmowy.',
  description: 'Case study Cannversity: strona doradztwa dla branży konopnej w wersji polskiej i angielskiej. Co było do zrobienia, co powstało i co poprawiłem po starcie.',
  live: {
    href: cannabisHref('realizacje', 'pl'),
    cta: 'Otwórz cannversity.com',
    note: 'Strona otworzy się w nowej karcie.',
  },
  cta: 'Porozmawiajmy o Twojej stronie',
  contactHref: '/pl/kontakt/#ctForm',
  price: '',
  consultation: false,
  emphasis: ['trzy części', 'jednego kroku: bezpłatnej rozmowy', 'prosto z kalendarza Google', 'stoję za nim ja', 'treść, projekt, technologię i publikację'],
  sections: [
    {
      title: 'Co było do zrobienia',
      paragraphs: [
        'Oferta ma trzy części: strategię i roadmapę, budowę MVP oraz doradztwo dla firm, które już działają. Odbiorcy to founderzy i marki z branży konopnej. Zadanie polegało na tym, żeby złożoną ofertę ułożyć w strukturę, którą da się szybko zrozumieć, i doprowadzić czytelnika do jednego kroku: bezpłatnej rozmowy.',
      ],
    },
    {
      title: 'Co powstało',
      paragraphs: [
        'Jedna strona z pełną ścieżką: sytuacje, od których zwykle zaczyna się współpraca, trzy filary oferty, proces w trzech krokach, sekcja o mnie, FAQ i kontakt. Rozmowę można umówić prosto z kalendarza Google. Jest też formularz kontaktowy z ochroną przed spamem i zapis na newsletter.',
        'Do tego regulamin, polityka prywatności i pełna wersja angielska pod adresem cannversity.com/en.',
      ],
    },
    {
      title: 'Co poprawiłem po starcie',
      paragraphs: [
        'We wrześniu 2026 przepisałem treść. Sekcja o projekcie mówi wprost, że stoję za nim ja, a wiedzę praktyków od importu, wprowadzania produktu na rynek i regulacji włączam tam, gdzie wymaga tego decyzja klienta. FAQ o kwestiach prawnych jasno pokazuje, gdzie kończy się moja odpowiedzialność.',
        'Wersja angielska dostała własny tytuł, opis i podgląd linku, więc wysłana komuś z zagranicy od razu wygląda po angielsku. Stronę przeniosłem na nowy hosting, pod własną domenę cannversity.com z szyfrowanym połączeniem HTTPS.',
      ],
    },
    {
      title: 'Chcesz takiej strony dla swojej firmy?',
      paragraphs: [
        'Przy stronach dla klientów pracuję tak samo. Ustalamy, czego potrzebuje Twój biznes, a potem biorę na siebie treść, projekt, technologię i publikację.',
        'Ta realizacja pokazuje zakres i rodzaj wykonanej pracy. Nie jest obietnicą przychodu, konwersji ani oszczędności.',
      ],
    },
  ],
};

export const caseCannversityEn: Service = {
  slug: 'case-cannversity',
  name: 'Cannversity',
  label: 'Case study: Cannversity',
  title: 'A cannabis consultancy, explained on one clear page.',
  accent: 'one clear page',
  altPath: '/pl/realizacje/cannversity/',
  lead: "Cannversity is my own project, which is why I can show all of it. I designed and built a Polish and English site that explains an advisory offer for the cannabis industry and leads to a free 30-minute call.",
  description: 'Cannversity case study: a Polish and English site for a cannabis industry advisory. What the job was, what got built and what I changed after launch.',
  live: {
    href: cannabisHref('realizacje', 'en'),
    cta: 'Open cannversity.com',
    note: 'Opens in a new tab.',
  },
  cta: "Let's talk about your website",
  contactHref: '/contact/#ctForm',
  price: '',
  consultation: false,
  emphasis: ['three parts', 'one step: a free call', 'straight from Google Calendar', "I'm the one behind it", 'the copy, design, tech and publishing'],
  sections: [
    {
      title: 'What the job was',
      paragraphs: [
        "The offer has three parts: strategy and a roadmap, building an MVP, and advisory for companies that are already running. It's aimed at founders and brands in the cannabis industry. The job was to lay a complex offer out so it's quick to grasp, and to lead the reader to one step: a free call.",
      ],
    },
    {
      title: 'What got built',
      paragraphs: [
        'One page that covers the whole path: the situations people usually come in with, the three pillars of the offer, a three-step process, an about section, FAQ and contact. Visitors book the call straight from Google Calendar. There is also a contact form with spam protection and a newsletter sign-up.',
        'Terms of service, a privacy policy and a full English version at cannversity.com/en come with it.',
      ],
    },
    {
      title: 'What I changed after launch',
      paragraphs: [
        "In September 2026 I rewrote the copy. The about section now says plainly that I'm the one behind it, and that I bring in people who know import, product launches and regulation when a client's decision needs them. The legal FAQ makes it clear where my responsibility ends.",
        "The English version got its own title, description and link preview, so it shows up in English when you send it to someone abroad. I moved the site to new hosting on its own domain, cannversity.com, over HTTPS.",
      ],
    },
    {
      title: 'Want a site like this for your company?',
      paragraphs: [
        'I work the same way on client sites. We agree on what your business needs, then I take on the copy, design, tech and publishing.',
        "This case shows the scope and kind of work I did. It isn't a promise of revenue, conversions or savings.",
      ],
    },
  ],
};
