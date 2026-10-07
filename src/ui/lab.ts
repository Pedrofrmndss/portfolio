import { t } from '../i18n';
import { codeLines } from './code';
import { reducedMotion } from './effects';

// « Sous le capot » : une fenêtre d'éditeur avec trois fichiers (simplifiés) du site.
const files = [
  {
    file: t('ressort.ts', 'spring.ts'),
    code: t(`// Les lettres du haut de page : un ressort mou les ramène
// à leur place, un amortissement faible les laisse osciller.
const k = 7;    // raideur : la force du retour
const c = 1.6;  // amortissement : le frein

function step(b: Ballon, dt: number) {
  const force = (b.repos - b.pos) * k
              - b.vitesse * c;
  b.vitesse += force * dt;
  b.pos += b.vitesse * dt;
}`, `// The letters at the top: a soft spring pulls them back
// into place, a weak damping lets them wobble.
const k = 7;    // stiffness: how hard it pulls back
const c = 1.6;  // damping: the brake

function step(b: Balloon, dt: number) {
  const force = (b.rest - b.pos) * k
              - b.velocity * c;
  b.velocity += force * dt;
  b.pos += b.velocity * dt;
}`),
  },
  {
    file: t('gonfler.ts', 'inflate.ts'),
    code: t(`// Les titres « gonflent » lettre par lettre.
// Tout le caractère vient de la courbe élastique.
const lettres = splitLetters(titre);

gsap.from(lettres, {
  scale: 0.2,
  yPercent: 40,
  opacity: 0,
  ease: 'elastic.out(1, 0.45)',
  stagger: 0.04,
});`, `// Titles "inflate" letter by letter.
// All the character comes from the elastic curve.
const letters = splitLetters(title);

gsap.from(letters, {
  scale: 0.2,
  yPercent: 40,
  opacity: 0,
  ease: 'elastic.out(1, 0.45)',
  stagger: 0.04,
});`),
  },
  {
    file: t('traduction.ts', 'translation.ts'),
    code: t(`// Le site en anglais : la traduction se pose sur le
// français, champ par champ. Ce qui manque reste en français.
function superposer<T>(base: T, trad: unknown): T {
  if (trad == null) return base;
  if (Array.isArray(base))
    return base.map((x, i) => superposer(x, (trad as unknown[])[i])) as T;
  if (base && typeof base === 'object') {
    const out = { ...base } as Record<string, unknown>;
    for (const [k, v] of Object.entries(trad)) out[k] = superposer(out[k], v);
    return out as T;
  }
  return trad as T;
}`, `// The English site: the translation is laid over the
// French, field by field. Anything missing stays in French.
function overlay<T>(base: T, patch: unknown): T {
  if (patch == null) return base;
  if (Array.isArray(base))
    return base.map((x, i) => overlay(x, (patch as unknown[])[i])) as T;
  if (base && typeof base === 'object') {
    const out = { ...base } as Record<string, unknown>;
    for (const [k, v] of Object.entries(patch)) out[k] = overlay(out[k], v);
    return out as T;
  }
  return patch as T;
}`),
  },
];

export function mountLab() {
  const root = document.querySelector<HTMLElement>('[data-lab]')!;
  root.innerHTML = `
    <div class="editor editor--lab">
      <div class="editor__bar">
        <span class="editor__dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <div class="editor__tabs" role="tablist" aria-label="${t('Fichiers', 'Files')}">
          ${files
            .map(
              (f, i) =>
                `<button type="button" role="tab" class="editor__tab" id="file-${i}" aria-controls="file-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${f.file}</button>`,
            )
            .join('')}
        </div>
        <span class="editor__lang">TypeScript</span>
      </div>
      <pre class="editor__code" id="file-panel" role="tabpanel" aria-labelledby="file-0" tabindex="0"></pre>
    </div>`;

  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const pre = root.querySelector<HTMLElement>('pre')!;
  let current = 0;

  const show = (i: number, focus = false) => {
    current = i;
    tabs.forEach((t, j) => {
      t.setAttribute('aria-selected', String(j === i));
      t.tabIndex = j === i ? 0 : -1;
    });
    pre.setAttribute('aria-labelledby', `file-${i}`);
    pre.innerHTML = codeLines(files[i].code);
    // Les lignes réapparaissent une à une, comme tapées
    pre.classList.remove('is-typed');
    if (!reducedMotion()) void pre.offsetWidth;
    pre.classList.add('is-typed');
    if (focus) tabs[i].focus();
  };

  tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
  root.addEventListener('keydown', (e) => {
    if (!(e.target as HTMLElement).matches('[role="tab"]')) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    show((current + (e.key === 'ArrowRight' ? 1 : -1) + files.length) % files.length, true);
  });

  pre.innerHTML = codeLines(files[0].code);
  new IntersectionObserver(
    ([entry], obs) => {
      if (!entry.isIntersecting) return;
      pre.classList.add('is-typed');
      obs.disconnect();
    },
    { threshold: 0.3 },
  ).observe(pre);
}
