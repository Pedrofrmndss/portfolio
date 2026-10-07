import { t } from '../i18n';
export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let toastTimer = 0;
export function toast(message: string) {
  const el = document.querySelector<HTMLElement>('[data-toast]')!;
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-visible'), 2200);
}

export function currentTheme(): 'light' | 'dark' {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0D1310' : '#F1F4F0');
  try {
    localStorage.setItem('theme', next);
  } catch {}
  toast(next === 'dark' ? t('Thème sombre', 'Dark theme') : t('Thème clair', 'Light theme'));
}

// Découpe un titre en lettres individuelles pour les faire « gonfler ».
// Les lettres sont regroupées par mot pour que le retour à la ligne ne coupe jamais un mot.
export function splitLetters(el: HTMLElement) {
  const text = (el.textContent ?? '').trim();
  el.setAttribute('aria-label', text);
  el.innerHTML = text
    .split(/\s+/)
    .map(
      (word) =>
        `<span class="word" aria-hidden="true">${[...word]
          .map((ch) => `<span class="char"><span class="char__in">${esc(ch)}</span></span>`)
          .join('')}</span>`,
    )
    .join(' ');
  return [...el.querySelectorAll<HTMLElement>('.char')];
}

// Petit hash déterministe, pour les identifiants façon commit git.
export function shortHash(input: string) {
  let h = 0x811c9dc5;
  for (const c of input) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}
