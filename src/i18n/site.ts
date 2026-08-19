export type Locale = 'en' | 'pl';

export const routes = {
  en: {
    home: '/',
    contact: '/contact/',
    privacy: '/privacy/',
    terms: '/terms/',
  },
  pl: {
    home: '/pl/',
    contact: '/pl/kontakt/',
    privacy: '/pl/polityka-prywatnosci/',
    terms: '/pl/regulamin/',
  },
} as const;

export const localeNames = {
  en: 'English',
  pl: 'Polski',
} as const;

export const alternateLocale = (locale: Locale): Locale => (locale === 'pl' ? 'en' : 'pl');

export const layoutCopy = {
  en: {
    defaultDescription: 'Landing pages, company websites, AI implementations and web apps, built by one person from idea to launch.',
    areaServed: 'Worldwide',
    cookie: {
      text: 'I use analytics (PostHog) and, for paid campaigns, Google and Meta conversion tracking to see what is working — including how visitors move through the site. No data is sold or shared beyond that. Read the',
      privacy: 'privacy policy',
      reject: 'Reject',
      accept: 'Accept',
    },
  },
  pl: {
    defaultDescription: 'Landing page’e, strony firmowe, wdrożenia AI i aplikacje webowe. Od pomysłu do uruchomienia — strategia, treść, design i kod po jednej stronie.',
    areaServed: 'Polska i zagranica',
    cookie: {
      text: 'Używam PostHog oraz — przy kampaniach — pomiaru Google i Meta, żeby sprawdzać, co działa. Nie sprzedaję danych. Szczegóły znajdziesz w',
      privacy: 'polityce prywatności',
      reject: 'Odrzuć',
      accept: 'Akceptuję',
    },
  },
} as const;
