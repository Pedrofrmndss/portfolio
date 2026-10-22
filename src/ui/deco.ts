import { t } from '../i18n';
import { esc } from './effects';

// Décor, purement visuel (aria-hidden) : étincelles et balises de code autour des grands titres,
// annotations écrites à la main avec une flèche, un curseur nommé façon Figma.

const STAR = '<svg viewBox="0 0 24 24"><path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z"/></svg>';

// Flèches tracées à la main : vers le bas à gauche, vers le bas, vers le bas à droite
const ARROWS = {
  'down-left': '<svg viewBox="0 0 80 60"><path d="M74 6C56 4 30 12 18 46M18 46l-3-15M18 46l13-8"/></svg>',
  down: '<svg viewBox="0 0 60 70"><path d="M40 4C18 14 14 34 26 62M26 62l-11-9M26 62l5-14"/></svg>',
  'down-right': '<svg viewBox="0 0 80 60"><path d="M6 6C24 4 50 12 62 46M62 46l3-15M62 46l-13-8"/></svg>',
};
type Arrow = keyof typeof ARROWS;

const CURSOR = '<svg viewBox="0 0 16 18"><path d="M1.5 1.5l13 6.5-5.6 1.9-2.8 6.2z"/></svg>';

const scribble = (text: string, arrow: Arrow, mod: string) =>
  `<span class="scribble scribble--${mod}" aria-hidden="true"><span class="scribble__text">${esc(text)}</span><span class="scribble__arrow scribble__arrow--${arrow}">${ARROWS[arrow]}</span></span>`;

const cursor = (name: string, mod: string) =>
  `<span class="fcursor fcursor--${mod}" aria-hidden="true">${CURSOR}<span class="fcursor__name">${esc(name)}</span></span>`;

export function mountDeco() {
  // Titres : la balise HTML autour, et trois étincelles en haut à droite
  document.querySelectorAll<HTMLElement>('.title[data-inflate], .phead__title').forEach((title) => {
    title.classList.add('deco-title');
    title.dataset.tag = title.tagName.toLowerCase();
    title.insertAdjacentHTML('beforeend', `<span class="sparkles" aria-hidden="true">${STAR}${STAR}${STAR}</span>`);
  });

  const place = (selector: string, where: InsertPosition, html: string) =>
    document.querySelector(selector)?.insertAdjacentHTML(where, html);

  // Annotations à la main
  place('#work .section__head .title', 'beforeend', scribble(t('le plus récent en premier', 'newest first'), 'down-left', 'work'));
  place('[data-lab]', 'beforebegin', scribble(t('du vrai code, promis !', 'real code, I promise!'), 'down', 'code'));
  place('[data-links]', 'beforebegin', scribble(t('par ici !', 'this way!'), 'down-right', 'contact'));

  // Curseur nommé, comme dans un fichier Figma partagé
  place('#contact', 'beforeend', cursor(t('toi', 'you'), 'contact'));
}
