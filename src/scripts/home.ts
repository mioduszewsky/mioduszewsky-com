import { gsap, ScrollTrigger } from './animation-core';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Generic reveals: IntersectionObserver + WAAPI (flayks pattern, zero ScrollTriggerów) ── */
const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (prefersReducedMotion) {
  revealEls.forEach((el) => (el.style.opacity = '1'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        (e.target as HTMLElement).animate(
          [
            { opacity: 0, transform: 'translateY(36px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 850, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }
        );
        io.unobserve(e.target);
      });
    },
    { threshold: 0.18 }
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ── Hero: wejście ──────────────────────────────────────────────── */
if (!prefersReducedMotion) {
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .fromTo(
      '.hero-line > span',
      // CSS trzyma start w translateY(110%) — animujemy TEN SAM komponent `y`
      // (yPercent to w GSAP osobna składowa i bazowy offset z CSS by został)
      { y: '110%' },
      { y: 0, duration: 1.1, stagger: 0.14 },
      0.15
    )
    .fromTo(
      '[data-hero-cards] .hero-card',
      { opacity: 0, scale: 0.85, yPercent: 8 },
      { opacity: 1, scale: 1, yPercent: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.4)' },
      0.55
    )
    .fromTo(
      '[data-hero-eyebrow], [data-hero-sub], [data-hero-bar]',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
      0.9
    );

  /* Hero: parallax stacka kart na scrollu (ST #1) */
  gsap.to('[data-hero-cards]', {
    yPercent: -14,
    rotate: -2,
    ease: 'none',
    scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: 0.6 },
  });

  /* Hero: outro — typografia odjeżdża wolniej niż scroll (ST #2) */
  gsap.to('[data-hero] h1', {
    yPercent: 18,
    opacity: 0.25,
    ease: 'none',
    scrollTrigger: { trigger: '[data-hero]', start: '55% top', end: 'bottom top', scrub: 0.6 },
  });
}

/* ── Oferta: PIN + scrub stack (Bon pattern) — desktop only ─────── */
if (!prefersReducedMotion) {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-service-card]');
    gsap.set(cards, { yPercent: 110, autoAlpha: 0 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '[data-services-stage]',
        start: 'top top',
        end: '+=1100', // 3 karty × ~366px scrollu w miejscu (ST #3)
        pin: true,
        scrub: 0.8,
      },
    });
    cards.forEach((card, i) => {
      tl.to(card, { yPercent: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, i * 0.85);
    });
  });

  mm.add('(max-width: 767px)', () => {
    gsap.utils.toArray<HTMLElement>('[data-service-card]').forEach((card) => {
      gsap.fromTo(
        card,
        { y: 48, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 82%' }, // ST #4-6 (mobile)
        }
      );
    });
  });
}

/* ── Footer: scroll-linked theme switch noir → creme (Bon 1:1, ST #7) ── */
ScrollTrigger.create({
  trigger: '[data-footer]',
  start: 'top 45%',
  end: '+=1',
  scrub: true,
  onEnter: () => document.documentElement.classList.add('theme-creme'),
  onLeaveBack: () => document.documentElement.classList.remove('theme-creme'),
});

export {};
