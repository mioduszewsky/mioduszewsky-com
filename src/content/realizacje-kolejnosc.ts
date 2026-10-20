// Pętla „Następna realizacja” (decyzja Kacpra 20.10.2026), jedno źródło dla wszystkich czterech case'ów.
// PL: eskapizm → Cannversity → Igor Grabowski → GlassStone → eskapizm.
// EN bez GlassStone (strona tylko po polsku): eskapizm → Cannversity → Igor → eskapizm.
// Kolejność kart na stronie zbiorczej (CaseIndex) jest ustawiona osobno i nie wynika z tego pliku.
import type { Locale } from '../i18n/site';

// bez obrazu: wiersz „Następna realizacja” to sam tekst (runda 3, 20.10)
type Case = { slug: string; name: string; locales: Locale[] };
export const caseOrder: Case[] = [
  { slug: 'eskapizm', name: 'eskapizm', locales: ['pl', 'en'] },
  { slug: 'cannversity', name: 'Cannversity', locales: ['pl', 'en'] },
  { slug: 'igor-grabowski', name: 'Igor Grabowski', locales: ['pl', 'en'] },
  { slug: 'glassstone', name: 'GlassStone', locales: ['pl'] },
];

export const caseHref = (slug: string, locale: Locale) => (locale === 'pl' ? `/pl/realizacje/${slug}/` : `/work/${slug}/`);

// Pętla bierze tylko case'y, których strona istnieje w danym języku (ten sam filtr co CaseIndex), więc „następny” nie da 404,
// gdy case'y trafią na produkcję w innej kolejności niż w pętli.
const pages = { pl: import.meta.glob('../pages/pl/realizacje/*.astro'), en: import.meta.glob('../pages/work/*.astro') };
const hasPage = (slug: string, locale: Locale) => `../pages/${locale === 'pl' ? 'pl/realizacje' : 'work'}/${slug}.astro` in pages[locale];

/** następna realizacja w pętli dla danego języka (pomija case'y bez strony w tym języku) */
export const nextCase = (slug: string, locale: Locale) => {
  const list = caseOrder.filter((c) => c.locales.includes(locale) && (c.slug === slug || hasPage(c.slug, locale)));
  const next = list[(list.findIndex((c) => c.slug === slug) + 1) % list.length];
  return { ...next, href: caseHref(next.slug, locale) };
};
