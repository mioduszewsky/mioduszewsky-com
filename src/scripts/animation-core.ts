import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const lenis = new Lenis({
  duration: 1.15,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: !prefersReducedMotion,
  wheelMultiplier: 1,
  touchMultiplier: 1.2,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time: number) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

declare global {
  interface Window {
    __lenis?: Lenis;
    __gsap?: typeof gsap;
  }
}
window.__lenis = lenis;
window.__gsap = gsap;

export { lenis, gsap, ScrollTrigger };
