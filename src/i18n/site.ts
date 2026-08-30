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
      text: 'Cookies show me how you use the site and whether my ads work. Basic statistics work without them. Details in the',
      privacy: 'privacy policy',
      reject: 'Reject',
      accept: 'Accept',
    },
  },
  pl: {
    defaultDescription: 'Landing page’e, strony firmowe, wdrożenia AI i aplikacje webowe. Od pomysłu do uruchomienia — strategia, treść, design i kod po jednej stronie.',
    areaServed: 'Polska i zagranica',
    cookie: {
      text: 'Ciasteczka pokazują mi, jak korzystasz ze strony i czy reklamy działają. Podstawowe statystyki działają bez nich. Szczegóły w',
      privacy: 'polityce prywatności',
      reject: 'Odrzuć',
      accept: 'Akceptuję',
    },
  },
} as const;
