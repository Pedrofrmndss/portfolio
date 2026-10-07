// Langue du site : celle de l'appareil à la première visite (français sinon anglais),
// puis le choix du visiteur, mémorisé.
// Chaque texte s'écrit à côté de sa traduction : t('Projets', 'Projects').
export type Lang = 'fr' | 'en';

const KEY = 'lang';

// vite.config.ts lit aussi les données : au build, le site reste en français.
export const lang: Lang = (() => {
  // Hors navigateur (build), toujours le français, quelle que soit la machine.
  if (typeof window === 'undefined') return 'fr';
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'fr' || saved === 'en') return saved;
    return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  } catch {}
  return 'fr';
})();

export const t = <T>(fr: T, en: T): T => (lang === 'en' ? en : fr);

export function saveLang(next: Lang) {
  try {
    localStorage.setItem(KEY, next);
  } catch {}
}

// Textes écrits dans le HTML : la version anglaise est dans data-en (contenu)
// ou data-en-<attribut> (ex. data-en-aria-label, data-en-alt, data-en-content).
export function translateStatic(root: ParentNode = document) {
  document.documentElement.lang = lang;
  if (lang === 'fr') return;
  root.querySelectorAll<HTMLElement>('*').forEach((el) => {
    for (const { name, value } of [...el.attributes]) {
      if (name === 'data-en') el.innerHTML = value;
      else if (name.startsWith('data-en-')) el.setAttribute(name.slice(8), value);
    }
  });
}
