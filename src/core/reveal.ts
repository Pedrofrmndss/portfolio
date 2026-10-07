import { gsap } from 'gsap';
import { reducedMotion, splitLetters } from '../ui/effects';

// Animations d'apparition communes. `once` : une fois jouées, elles ne sont plus recalculées.
export function mountReveals() {
  const titles = [...document.querySelectorAll<HTMLElement>('[data-inflate]')];
  const reduced = reducedMotion();

  titles.forEach((t) => {
    const chars = splitLetters(t);
    if (reduced) return;
    // Les titres « gonflent » lettre par lettre, comme les ballons du hero.
    gsap.from(chars, {
      scale: 0.2,
      yPercent: 40,
      opacity: 0,
      duration: 1.1,
      ease: 'elastic.out(1, 0.45)',
      stagger: 0.04,
      scrollTrigger: { trigger: t, start: 'top 88%', once: true },
    });
  });

  const reveals = gsap.utils.toArray<HTMLElement>('.reveal');
  if (reduced) {
    reveals.forEach((el) => el.classList.add('is-in'));
    return;
  }
  reveals.forEach((el) => {
    gsap.from(el, {
      y: 32,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true, onEnter: () => el.classList.add('is-in') },
    });
  });
}
