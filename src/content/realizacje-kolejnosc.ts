// Kolejność realizacji i pętla „Następna realizacja” (decyzja Kacpra 20.10.2026), jedno miejsce dla case'ów.
// Ta sama kolejność co karty na stronie zbiorczej (CaseIndex). PL: GlassStone → eskapizm → Igor Grabowski → Cannversity → GlassStone.
// EN bez GlassStone (strona tylko po polsku): eskapizm → Igor → Cannversity → eskapizm.
import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/site';
import heroGlassstone from '../assets/realizacje/hero-glassstone.webp';
import heroEskapizm from '../assets/realizacje/hero-eskapizm.webp';
import heroIgor from '../assets/realizacje/hero-igor.webp';
import heroCannversity from '../assets/realizacje/hero-cannversity.webp';

type Case = { slug: string; name: string; img: ImageMetadata; locales: Locale[] };
export const caseOrder: Case[] = [
  { slug: 'glassstone', name: 'GlassStone', img: heroGlassstone, locales: ['pl'] },
  { slug: 'eskapizm', name: 'eskapizm', img: heroEskapizm, locales: ['pl', 'en'] },
  { slug: 'igor-grabowski', name: 'Igor Grabowski', img: heroIgor, locales: ['pl', 'en'] },
  { slug: 'cannversity', name: 'Cannversity', img: heroCannversity, locales: ['pl', 'en'] },
];

export const caseHref = (slug: string, locale: Locale) => (locale === 'pl' ? `/pl/realizacje/${slug}/` : `/work/${slug}/`);

// Pętla bierze tylko case'y, których strona istnieje w danym języku (jak CaseIndex), więc „następny” nie da 404,
// gdy case'y trafią na produkcję w innej kolejności niż w pętli.
const pages = { pl: import.meta.glob('../pages/pl/realizacje/*.astro'), en: import.meta.glob('../pages/work/*.astro') };
const hasPage = (slug: string, locale: Locale) => `../pages/${locale === 'pl' ? 'pl/realizacje' : 'work'}/${slug}.astro` in pages[locale];

/** następna realizacja w pętli dla danego języka (pomija case'y bez strony w tym języku) */
export const nextCase = (slug: string, locale: Locale) => {
  const list = caseOrder.filter((c) => c.locales.includes(locale) && (c.slug === slug || hasPage(c.slug, locale)));
  const next = list[(list.findIndex((c) => c.slug === slug) + 1) % list.length];
  return { ...next, href: caseHref(next.slug, locale) };
};
