import { t } from '../i18n';
import { families, isFeatured, projects, projectUrl, type Family } from '../data';
import { lenis } from '../core/scroll';
import { coverHtml } from './cover';
import { esc, reducedMotion } from './effects';
import { familyIcon } from './family';

type Filter = Family | 'all';

// Carrousel infini qui défile tout seul. Le scroll de la page l'accélère (et
// inverse son sens quand on remonte), on peut l'attraper et le lancer, et les
// cartes suivent un arc en traversant l'écran.
const BASE_SPEED = 0.9; // px par image

export function mountCarousel() {
  const root = document.querySelector<HTMLElement>('[data-carousel]')!;
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const filters = document.querySelector<HTMLElement>('[data-filters]')!;
  const toggle = root.querySelector<HTMLButtonElement>('[data-toggle]')!;
  const reduced = reducedMotion();

  // Seuls les projets de code tournent dans le carrousel
  const pool = projects.filter(isFeatured);

  // Filtres par famille (sites web, jeux), masqués s'il n'y en a qu'une seule
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

  const cardHtml = (p: (typeof projects)[number], clone: boolean) => `
    <li class="card" ${clone ? 'aria-hidden="true"' : ''}>
      <a class="card__link" href="${projectUrl(p.id)}" draggable="false" ${clone ? 'tabindex="-1"' : ''}>
        <span class="card__media" ${clone ? '' : `style="view-transition-name: cover-${p.id}"`}>
          <span class="card__img">${coverHtml(p.cover, '', p.title)}</span>
        </span>
        <span class="card__title" ${clone ? '' : `style="view-transition-name: title-${p.id}"`}>${esc(p.title)}</span>
        <span class="card__meta">
          ${p.family ? `<span class="fam fam--${p.family}">${familyIcon(p.family)}${families[p.family].one}</span>` : ''}
          <span>${esc(p.kind)}</span>
          <span>${p.year}</span>
        </span>
      </a>
    </li>`;

  // État du défilement
  let cards: HTMLElement[] = [];
  let centers: number[] = [];
  let setWidth = 1;
  let x = 0;
  let vel = 0;
  let boost = 0;
  let dir = 1;
  let paused = reduced;
  let hovering = false;

  // On répète la liste autant de fois qu'il faut pour couvrir deux écrans : la boucle est invisible.
  const build = (filter: Filter) => {
    const list = pool.filter((p) => filter === 'all' || p.family === filter);
    track.innerHTML = list.map((p) => cardHtml(p, false)).join('');
    const first = track.firstElementChild as HTMLElement;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    setWidth = (first.offsetWidth + gap) * list.length;
    const copies = Math.max(2, Math.ceil((root.clientWidth * 2) / setWidth) + 1);
    track.insertAdjacentHTML('beforeend', Array.from({ length: copies - 1 }, () => list.map((p) => cardHtml(p, true)).join('')).join(''));
    // Images chargées tout de suite : le carrousel bouge, une carte vide se verrait.
    track.querySelectorAll('img').forEach((img) => {
      img.draggable = false;
      img.loading = 'eager';
    });
    cards = [...track.querySelectorAll<HTMLElement>('.card')];
    centers = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
    x = 0;
  };

  // Le scroll de la page pousse le carrousel dans son sens
  lenis?.on('scroll', (l: { velocity: number; direction: number }) => {
    boost = Math.max(-25, Math.min(25, l.velocity * 0.6));
    if (l.direction) dir = l.direction;
  });

  // Glisser-lancer (souris et doigt ; le scroll vertical reste libre au doigt)
  let down = false, moved = 0, startX = 0, startPos = 0, lastX = 0, lastT = 0, dragVel = 0;
  track.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    down = true;
    moved = 0;
    startX = lastX = e.clientX;
    lastT = performance.now();
    startPos = x;
    dragVel = 0;
    vel = 0;
    track.classList.add('is-dragging');
  });
  addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    x = startPos - dx;
    const now = performance.now();
    dragVel = ((lastX - e.clientX) / Math.max(1, now - lastT)) * 16;
    lastX = e.clientX;
    lastT = now;
  });
  const release = () => {
    if (!down) return;
    down = false;
    vel = Math.max(-60, Math.min(60, dragVel));
    if (Math.abs(vel) > 1) dir = Math.sign(vel);
    track.classList.remove('is-dragging');
  };
  addEventListener('pointerup', release);
  addEventListener('pointercancel', release);
  track.addEventListener('click', (e) => {
    if (moved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Survol : le carrousel ralentit ; focus clavier : il s'arrête sur la carte
  track.addEventListener('pointerover', (e) => (hovering = e.pointerType === 'mouse'));
  track.addEventListener('pointerleave', () => (hovering = false));
  track.addEventListener('focusin', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.card');
    if (!card) return;
    hovering = true;
    x = centers[cards.indexOf(card)] - root.clientWidth / 2;
  });
  track.addEventListener('focusout', () => (hovering = false));

  // Bouton pause (obligatoire pour un contenu qui bouge tout seul)
  const syncToggle = () => {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute(
      'aria-label',
      paused ? t('Relancer le défilement', 'Resume scrolling') : t('Mettre le défilement en pause', 'Pause scrolling'),
    );
    toggle.innerHTML = paused
      ? '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>'
      : '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>';
  };
  toggle.addEventListener('click', () => {
    paused = !paused;
    syncToggle();
  });
  syncToggle();

  filters.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
    if (!btn) return;
    filters.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    build(btn.dataset.filter as Filter);
    if (!reduced) {
      cards.forEach((card, i) =>
        card.animate([{ opacity: 0, transform: 'translateY(80px) scale(.8)' }, { opacity: 1, transform: 'none' }], {
          duration: 700,
          delay: Math.min(i, 8) * 60,
          easing: 'cubic-bezier(.34,1.56,.64,1)',
          fill: 'backwards',
        }),
      );
    }
  });

  // Boucle d'animation, active seulement quand le carrousel est visible
  let raf = 0;
  let skew = 0;
  let prevX = 0;
  const frame = () => {
    const half = root.clientWidth / 2;
    // Arc plus discret sur petit écran
    const arc = Math.max(0.35, Math.min(1, root.clientWidth / 1100));
    if (!down) {
      const auto = paused ? 0 : BASE_SPEED * dir * (hovering ? 0.15 : 1);
      x += auto + vel + (paused ? 0 : boost);
      vel *= 0.94;
      boost *= 0.9;
    }
    // Vitesse réelle de l'image (avant le bouclage), pour incliner les cartes
    const delta = x - prevX;
    x = ((x % setWidth) + setWidth) % setWidth;
    prevX = x;
    skew += (Math.max(-8, Math.min(8, -delta * 0.35)) - skew) * 0.12;
    track.style.transform = `translate3d(${-x}px, 0, 0)`;
    for (let i = 0; i < cards.length; i++) {
      const p = (centers[i] - x - half) / half; // -1 à gauche, 1 à droite
      if (p < -1.6 || p > 1.6) continue;
      const a = Math.min(Math.abs(p), 1.2);
      const link = cards[i].firstElementChild as HTMLElement;
      link.style.transform = `translateY(${(a * a * 70 * arc).toFixed(1)}px) rotate(${(p * 7 * arc).toFixed(2)}deg) scale(${(1 - a * 0.1).toFixed(3)}) skewX(${skew.toFixed(2)}deg)`;
      cards[i].style.setProperty('--px', `${(-p * 12).toFixed(2)}%`);
    }
    raf = requestAnimationFrame(frame);
  };
  build('all');
  addEventListener('resize', () => {
    const current = filters.querySelector<HTMLElement>('[aria-pressed="true"]')?.dataset.filter as Filter;
    build(current ?? 'all');
  });

  new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(raf);
    if (entry.isIntersecting) raf = requestAnimationFrame(frame);
  }).observe(root);
}
