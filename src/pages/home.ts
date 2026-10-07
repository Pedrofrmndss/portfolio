import { t } from '../i18n';
import '../styles/main.css';
import { gsap } from 'gsap';
import { profile } from '../data';
import { bindAnchors } from '../core/scroll';
import { bindCvLinks, mountChrome } from '../core/chrome';
import { mountReveals } from '../core/reveal';
import { mountLab } from '../ui/lab';
import { mountSkills } from '../ui/skills';
import { mountJourney } from '../ui/journey';
import { mountCarousel } from '../ui/carousel';
import { esc, reducedMotion } from '../ui/effects';

mountChrome({ isHome: true });
bindAnchors();

// Hero : lettres 3D à la souris sur ordinateur ; ailleurs, une simple phrase.
const hint = document.querySelector<HTMLElement>('[data-hero-hint]')!;
const canvas = document.querySelector<HTMLCanvasElement>('.hero__canvas')!;
const done = () => hint.classList.add('is-done');
const useStatic = () => {
  document.documentElement.classList.add('hero-static');
  if (!reducedMotion()) gsap.from('.hero__title', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'all' });
};

if (matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)').matches) {
  // Three.js est chargé dans un fichier séparé : le reste de la page n'attend pas la 3D.
  import('../hero/BalloonLetters')
    .then(({ BalloonLetters }) => new BalloonLetters(canvas, done).init())
    .catch(useStatic);
} else {
  useStatic();
}

// La flèche de scroll s'efface dès qu'on commence à descendre
const arrow = document.querySelector<HTMLElement>('[data-scroll-arrow]');
const syncArrow = () => arrow?.classList.toggle('is-gone', scrollY > 40);
addEventListener('scroll', syncArrow, { passive: true });
syncArrow();

// Sections
mountCarousel();
mountSkills();
mountLab();
mountJourney();

// Contact : de gros liens typographiques, rien d'autre
const ext = 'target="_blank" rel="noopener"';
const bigLinks = [
  { label: 'GitHub', desc: t('Mon code et mes projets', 'My code and projects'), href: profile.github, attrs: ext },
  { label: 'LinkedIn', desc: t('Mon parcours, et pour m’écrire', 'My background, and a way to reach me'), href: profile.linkedin, attrs: ext },
  { label: t('CV', 'Résumé'), desc: t('Le résumé, en PDF', 'My résumé, as a PDF'), href: profile.cv, attrs: ext },
  ...(profile.email ? [{ label: 'Email', desc: profile.email, href: `mailto:${profile.email}`, attrs: '' }] : []),
];
document.querySelector<HTMLElement>('[data-links]')!.innerHTML = bigLinks
  .map(
    (l) => `<li><a class="biglink" href="${l.href}" ${l.attrs}>
      <span class="biglink__label">${esc(l.label)}</span>
      <span class="biglink__desc">${esc(l.desc)}</span>
      <span class="biglink__arrow" aria-hidden="true">↗</span>
    </a></li>`,
  )
  .join('');
bindCvLinks();
document.querySelectorAll<HTMLAnchorElement>('[data-github]').forEach((a) => (a.href = profile.github));

mountReveals();
if (!reducedMotion()) {
  gsap.from('.card', {
    x: 120,
    opacity: 0,
    rotate: 3,
    duration: 1,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.carousel', start: 'top 85%', once: true },
  });
  gsap.from('.biglink', {
    y: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.biglinks', start: 'top 85%', once: true },
  });
  gsap.from('.hero__meta', { y: 20, opacity: 0, duration: 1, delay: 0.6, ease: 'power3.out' });

  // Portrait : l'arche se gonfle à l'arrivée, la photo glisse doucement au scroll
  gsap.from('.portrait', {
    scale: 0.82,
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'elastic.out(1, 0.6)',
    clearProps: 'all',
    scrollTrigger: { trigger: '.about', start: 'top 98%', once: true },
  });
  gsap.fromTo(
    '.portrait__frame img',
    { yPercent: -6 },
    { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.portrait', start: 'top bottom', end: 'bottom top', scrub: true } },
  );
}
