import { t } from '../i18n';
import { families, isFeatured, projects, projectUrl, type Family } from '../data';
import { coverHtml } from './cover';
import { esc, reducedMotion } from './effects';
import { familyIcon } from './family';

type Filter = Family | 'all';
type Size = 'big' | 'wide' | 'small' | 'full';

// Taille de chaque case selon le nombre de projets affichés : le premier est mis en avant,
// puis les lignes de 4 colonnes sont toujours remplies, sans trou.
function sizes(n: number): Size[] {
  if (n === 1) return ['full'];
  if (n === 2) return ['big', 'big'];
  if (n === 3) return ['big', 'wide', 'wide'];
  const out: Size[] = ['big', 'wide', 'small', 'small'];
  for (let rest = n - 4; rest > 0; rest -= 3) {
    out.push(...(rest >= 3 ? ['small', 'wide', 'small'] : rest === 2 ? ['wide', 'wide'] : ['full']) as Size[]);
  }
  return out;
}

// Projets de code en grille bento, triables par famille (sites web, jeux).
export function mountProjects() {
  const grid = document.querySelector<HTMLElement>('[data-bento]')!;
  const filters = document.querySelector<HTMLElement>('[data-filters]')!;
  const pool = projects.filter(isFeatured);

  // Filtres par famille, masqués s'il n'y en a qu'une seule
  const counts = pool.reduce<Record<string, number>>((acc, p) => (p.family && (acc[p.family] = (acc[p.family] ?? 0) + 1), acc), {});
  const options: [Filter, string, number][] = [
    ['all', t('Tout', 'All'), pool.length],
    ...(Object.keys(families) as Family[])
      .filter((f) => counts[f])
      .map((f): [Filter, string, number] => [f, families[f].many, counts[f]]),
  ];
  filters.innerHTML = options
    .map(
      ([id, label, n], i) =>
        `<button type="button" class="chip ${id === 'all' ? '' : `fam fam--${id}`}" data-filter="${id}" aria-pressed="${i === 0}">${id === 'all' ? '' : familyIcon(id)}${label}<sup>${n}</sup></button>`,
    )
    .join('');
  filters.hidden = options.length < 3;

  const tileHtml = (p: (typeof projects)[number], size: Size) => `
    <li class="tile tile--${size}">
      <a class="tile__link" href="${projectUrl(p.id)}">
        <span class="tile__media" style="view-transition-name: cover-${p.id}">${coverHtml(p.cover, '', p.title)}</span>
        <span class="tile__body">
          <span class="tile__meta">
            ${p.family ? `<span class="fam fam--${p.family}">${familyIcon(p.family)}${families[p.family].one}</span>` : ''}
            <span>${esc(p.kind)}</span>
            <span>${p.year}</span>
          </span>
          <span class="tile__title" style="view-transition-name: title-${p.id}">${esc(p.title)}</span>
        </span>
        <span class="tile__arrow" aria-hidden="true">↗</span>
      </a>
    </li>`;

  const build = (filter: Filter) => {
    const list = pool.filter((p) => filter === 'all' || p.family === filter);
    const s = sizes(list.length);
    grid.innerHTML = list.map((p, i) => tileHtml(p, s[i])).join('');
  };

  filters.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
    if (!btn) return;
    filters.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    build(btn.dataset.filter as Filter);
    if (reducedMotion()) return;
    grid.querySelectorAll('.tile').forEach((tile, i) =>
      tile.animate([{ opacity: 0, transform: 'translateY(40px) scale(.94)' }, { opacity: 1, transform: 'none' }], {
        duration: 650,
        delay: i * 60,
        easing: 'cubic-bezier(.34,1.56,.64,1)',
        fill: 'backwards',
      }),
    );
  });

  build('all');
}
