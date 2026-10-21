// Pętla „Następna realizacja” (decyzja Kacpra 20.10.2026), jedno źródło dla wszystkich czterech case'ów.
// PL i EN: eskapizm → Cannversity → Igor Grabowski → eskapizm.
// GlassStone zdjęty z pętli i z kart do czasu przebudowy jego strony i systemu (Kacper, 21.10.2026); strona case'u zostaje
// pod swoim adresem z noindex, a jej „Następna realizacja” prowadzi na pierwszy case z listy. Powrót = jeden wiersz niżej.
// Przy publikacji 21.10 strona GlassStone jest poza buildem (plik _glassstone.astro); powrót = zmiana nazwy bez podkreślnika.
// Ta sama kolejność kart na stronie zbiorczej (CaseIndex czyta caseOrder).
import type { Locale } from '../i18n/site';

// bez obrazu: wiersz „Następna realizacja” to sam tekst (runda 3, 20.10)
type Case = { slug: string; name: string; locales: Locale[] };
export const caseOrder: Case[] = [
  { slug: 'eskapizm', name: 'eskapizm', locales: ['pl', 'en'] },
  { slug: 'cannversity', name: 'Cannversity', locales: ['pl', 'en'] },
  { slug: 'igor-grabowski', name: 'Igor Grabowski', locales: ['pl', 'en'] },
];

export const caseHref = (slug: string, locale: Locale) => (locale === 'pl' ? `/pl/realizacje/${slug}/` : `/work/${slug}/`);

// Pętla bierze tylko case'y, których strona istnieje w danym języku (ten sam filtr co CaseIndex), więc „następny” nie da 404,
// gdy case'y trafią na produkcję w innej kolejności niż w pętli.
// bez plików z podkreślnikiem (strona poza buildem), inaczej glob ciągnie ich CSS na każdą stronę case'u
const pages = { pl: import.meta.glob(['../pages/pl/realizacje/*.astro', '!../pages/pl/realizacje/_*.astro']), en: import.meta.glob(['../pages/work/*.astro', '!../pages/work/_*.astro']) };
const hasPage = (slug: string, locale: Locale) => `../pages/${locale === 'pl' ? 'pl/realizacje' : 'work'}/${slug}.astro` in pages[locale];

/** następna realizacja w pętli dla danego języka (pomija case'y bez strony w tym języku; case spoza listy dostaje pierwszy z listy) */
export const nextCase = (slug: string, locale: Locale) => {
  const list = caseOrder.filter((c) => c.locales.includes(locale) && (c.slug === slug || hasPage(c.slug, locale)));
  const next = list[(list.findIndex((c) => c.slug === slug) + 1) % list.length];
  return { ...next, href: caseHref(next.slug, locale) };
};
