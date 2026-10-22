import { t } from '../i18n';
import '../styles/main.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from '../data';
import { bindAnchors } from '../core/scroll';
import { bindCvLinks, mountChrome } from '../core/chrome';
import { mountReveals } from '../core/reveal';
import { mountDeco } from '../ui/deco';
import { mountLab } from '../ui/lab';
import { mountSkills } from '../ui/skills';
import { mountJourney } from '../ui/journey';
import { mountProjects } from '../ui/bento';
import { esc, reducedMotion } from '../ui/effects';

mountChrome({ isHome: true });
bindAnchors();

// Hero : lettres 3D à la souris sur ordinateur ; ailleurs, une simple phrase.
const hint = document.querySelector<HTMLElement>('[data-hero-hint]')!;
const canvas = document.querySelector<HTMLCanvasElement>('.hero__canvas')!;
// La bulle s'efface dès qu'on attrape une lettre, et revient après 8 s sans y toucher.
const HINT_BACK_MS = 8000;
let hintTimer = 0;
const onPlay = (grabbing: boolean) => {
  clearTimeout(hintTimer);
  hint.classList.add('is-done');
  if (!grabbing) hintTimer = window.setTimeout(() => hint.classList.remove('is-done'), HINT_BACK_MS);
};
const useStatic = () => {
  document.documentElement.classList.add('hero-static');
  if (!reducedMotion()) gsap.from('.hero__title', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'all' });
};

if (matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)').matches) {
  // Three.js est chargé dans un fichier séparé : le reste de la page n'attend pas la 3D.
  import('../hero/BalloonLetters')
    .then(({ BalloonLetters }) => new BalloonLetters(canvas, onPlay).init())
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
mountProjects();
mountSkills();
mountLab();
mountJourney();

// Contact : de gros liens typographiques, rien d'autre
const ext = 'target="_blank" rel="noopener"';
const bigLinks = [
  { label: 'GitHub', desc: t('Mon code et mes projets', 'My code and projects'), href: profile.github, attrs: ext },
  { label: 'LinkedIn', desc: t('Mon parcours, et pour m’écrire', 'My background, and a way to reach me'), href: profile.linkedin, attrs: ext },
  { label: t('CV', 'Resume'), desc: t('Mon CV, en PDF', 'My resume, as a PDF'), href: profile.cv, attrs: ext },
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
mountDeco();
if (!reducedMotion()) {
  gsap.from('.bento .tile', {
    y: 60,
    opacity: 0,
    scale: 0.96,
    duration: 0.9,
    stagger: 0.07,
    ease: 'power3.out',
    clearProps: 'all',
    scrollTrigger: { trigger: '.bento', start: 'top 85%', once: true },
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

// Portrait : en noir et blanc, il reprend ses couleurs quand on arrive sur la section (et les perd en remontant)
const portrait = document.querySelector<HTMLElement>('[data-portrait]');
if (portrait) {
  if (reducedMotion()) portrait.classList.add('is-color');
  else ScrollTrigger.create({ trigger: portrait, start: 'top 60%', end: 'max', toggleClass: { targets: portrait, className: 'is-color' } });
}
