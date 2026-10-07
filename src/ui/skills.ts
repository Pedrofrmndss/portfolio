import { gsap } from 'gsap';
import { skills } from '../data';
import { esc, reducedMotion } from './effects';

// Logos : Devicon (MIT) et Simple Icons (CC0). Vite ne copie que ceux importés ici.
import javascript from 'devicon/icons/javascript/javascript-original.svg?url';
import typescript from 'devicon/icons/typescript/typescript-original.svg?url';
import html from 'devicon/icons/html5/html5-original.svg?url';
import css from 'devicon/icons/css3/css3-original.svg?url';
import php from 'devicon/icons/php/php-original.svg?url';
import mysql from 'devicon/icons/mysql/mysql-original.svg?url';
import wordpress from 'devicon/icons/wordpress/wordpress-original.svg?url';
import threejs from 'devicon/icons/threejs/threejs-original.svg?url';
import figma from 'devicon/icons/figma/figma-original.svg?url';
import csharp from 'devicon/icons/csharp/csharp-original.svg?url';
import git from 'devicon/icons/git/git-original.svg?url';
import github from 'devicon/icons/github/github-original.svg?url';
import nodejs from 'devicon/icons/nodejs/nodejs-original.svg?url';
import vscode from 'devicon/icons/vscode/vscode-original.svg?url';
import unity from 'devicon/icons/unity/unity-original.svg?url';

const img = (src: string) => `<img src="${src}" alt="" loading="lazy" decoding="async" />`;
const LOGOS: Record<string, string> = {
  JavaScript: img(javascript),
  TypeScript: img(typescript),
  HTML: img(html),
  CSS: img(css),
  PHP: img(php),
  MySQL: img(mysql),
  WordPress: img(wordpress),
  'Three.js': img(threejs),
  Figma: img(figma),
  'C#': img(csharp),
  Git: img(git),
  GitHub: img(github),
  'Node.js': img(nodejs),
  'VS Code': img(vscode),
  Unity: img(unity),
};

// Pas de logo libre pour certains outils : un monogramme sobre aux couleurs du site.
const monogram = (name: string) =>
  `<span class="sticker__mono">${esc(name.replace(/[^A-Za-zÀ-ÿ]/g, '').slice(0, 2))}</span>`;

// Petites inclinaisons fixes, comme des autocollants posés à la main.
const TILTS = [-6, 4, -3, 7, -5, 3, -7, 5];

// Un post-it par carte, avec un mot écrit à la main (rose et menthe en alternance).
const NOTE_TILTS = [4, -5, 3, -4];
const noteHtml = (text: string, i: number) =>
  `<p class="note ${i % 2 ? 'note--mint' : 'note--pink'} postit" style="--tilt: ${NOTE_TILTS[i % 4]}deg">${esc(text)}</p>`;


// Outils : quatre cartes, des logos façon autocollants qu'on peut attraper et lancer.
export function mountSkills() {
  const root = document.querySelector<HTMLElement>('[data-skills]')!;
  let k = 0;
  const cards = skills.map(
      (g, i) => `
      <article class="family family--${i}" style="--grow: ${g.items.length}">
        <span class="washi ${i % 2 ? 'washi--green' : ''} tape tape--${i % 4}" aria-hidden="true"></span>
        ${noteHtml(g.note, i)}
        <header class="family__head">
          <h3 class="family__title">${esc(g.title)}</h3>
          <p class="family__use">${esc(g.use)}</p>
        </header>
        <ul class="family__list">
          ${g.items
            .map(
              (s) => `
            <li class="sticker">
              <span class="sticker__card" style="--tilt: ${TILTS[k++ % TILTS.length]}deg">
                <span class="sticker__logo">${LOGOS[s.name] ?? monogram(s.name)}</span>
              </span>
              <span class="sticker__name">${esc(s.name)}</span>
            </li>`,
            )
            .join('')}
        </ul>
      </article>`,
  );
  // Les cartes vont par deux ; dans chaque paire, la largeur suit la place que prennent les autocollants.
  root.innerHTML = cards
    .map((card, i) => (i % 2 ? '' : `<div class="skills__row">${card}${cards[i + 1] ?? ''}</div>`))
    .join('');

  if (reducedMotion()) return;
  root.querySelectorAll<HTMLElement>('.sticker__card').forEach(makeThrowable);
  root.querySelectorAll<HTMLElement>('.family').forEach((card) => {
    gsap.from(card.querySelectorAll('.sticker'), {
      y: 30,
      scale: 0.6,
      rotate: -20,
      opacity: 0,
      duration: 0.9,
      ease: 'back.out(1.8)',
      stagger: 0.07,
      scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      // Rend la main au CSS (inclinaison et survol) une fois l'entrée terminée.
      clearProps: 'all',
    });
  });
}

// Un autocollant suit le doigt ou la souris, penche selon la vitesse, puis revient à sa place
// avec un rebond élastique, comme les lettres du haut de page.
function makeThrowable(card: HTMLElement) {
  card.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    card.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startY = e.clientY;
    let lastX = startX;
    gsap.killTweensOf(card);
    card.classList.add('is-grabbed');

    const move = (ev: PointerEvent) => {
      const vx = ev.clientX - lastX;
      lastX = ev.clientX;
      gsap.to(card, { x: ev.clientX - startX, y: ev.clientY - startY, rotation: gsap.utils.clamp(-35, 35, vx * 2.5), duration: 0.15, overwrite: true });
    };
    const release = () => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerup', release);
      card.removeEventListener('pointercancel', release);
      card.classList.remove('is-grabbed');
      gsap.to(card, { x: 0, y: 0, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.35)', overwrite: true });
    };
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);
  });
}
