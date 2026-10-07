import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from '../ui/effects';

gsap.registerPlugin(ScrollTrigger);

// Scroll fluide (désactivé si l'utilisateur préfère moins d'animations)
export const lenis = reducedMotion() ? null : new Lenis({ lerp: 0.12 });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

export const scrollTo = (target: HTMLElement | number) => {
  if (lenis) lenis.scrollTo(target, { duration: 1.2 });
  else if (typeof target === 'number') window.scrollTo({ top: target });
  else target.scrollIntoView();
};

// Les liens vers une ancre de la page courante défilent en douceur ;
// ceux vers une autre page (ex. « /#work » depuis un projet) naviguent normalement.
export function bindAnchors() {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const url = new URL(a.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = url.hash === '#top' ? document.body : document.querySelector<HTMLElement>(url.hash);
    if (!target) return;
    e.preventDefault();
    scrollTo(url.hash === '#top' ? 0 : target);
    history.replaceState(null, '', url.hash === '#top' ? location.pathname : url.hash);
    if (target !== document.body) target.focus({ preventScroll: true });
  });

  // Arrivée depuis une autre page avec une ancre : on attend la mise en page puis on y va.
  if (location.hash.length > 1) {
    const target = document.querySelector<HTMLElement>(location.hash);
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  }
}
