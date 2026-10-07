import { esc } from './effects';

/** Image de couverture d'un projet, ou tuile typographique à son nom s'il n'y en a pas. */
export const coverHtml = (cover: string, alt = '', label = 'Pedro') =>
  cover
    ? `<img src="${cover}" alt="${esc(alt)}" loading="lazy" decoding="async" />`
    : `<span class="cover-text" aria-hidden="true">${esc(label)}</span>`;
