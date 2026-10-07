import { profile } from '../data';
import { currentTheme, toast, toggleTheme } from '../ui/effects';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenis } from './scroll';
import { lang, saveLang, t, translateStatic } from '../i18n';

const HOME = import.meta.env.BASE_URL;

const NAV = [
  { id: 'work', label: t('Projets', 'Projects') },
  { id: 'skills', label: t('Outils', 'Skills') },
  { id: 'code', label: 'Code' },
  { id: 'parcours', label: t('Parcours', 'Journey') },
  { id: 'contact', label: 'Contact' },
];

// Sommaire de l'accueil : « À propos » en plus des sections du menu.
const RAIL = [{ id: 'about', label: t('À propos', 'About') }, ...NAV];

const SUN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
// Drapeaux en SVG : les émojis drapeaux ne s'affichent pas sous Windows.
const FLAG_FR =
  '<svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="1" height="2" fill="#0055A4"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#EF4135"/></svg>';
const FLAG_UK =
  '<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><clipPath id="uk-t"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30m0-30L0 30" clip-path="url(#uk-t)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>';
const ARROW_LEFT =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M19 12H5m0 0 6-6m-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="currentColor"/></svg>';

// Barre de navigation, sommaire, boutons de langue et de thème, footer : communs à toutes les pages, injectés ici.
export function mountChrome({ isHome }: { isHome: boolean }) {
  // Les textes du HTML passent en anglais avant que les titres soient découpés en lettres.
  translateStatic();
  const href = (id: string) => (isHome ? `#${id}` : `${HOME}#${id}`);

  // Accueil : un mini sommaire sur la droite. Page projet : une barre avec le retour aux projets.
  const rail = isHome
    ? `<nav class="rail" aria-label="${t('Sommaire', 'Contents')}" data-rail>
        ${RAIL.map((n) => `<a class="rail__link" href="${href(n.id)}" data-section="${n.id}"><span class="rail__label">${n.label}</span><i aria-hidden="true"></i></a>`).join('')}
      </nav>`
    : '';

  // Réglages de langue et de thème : dans le coin sur ordinateur, dans le footer au doigt.
  const prefs = `
      <button class="lang-toggle" type="button" data-lang-toggle lang="${lang === 'fr' ? 'en' : 'fr'}"
        aria-label="${t('Read in English', 'Lire en français')}" title="${t('English version', 'Version française')}">
        <span class="flag ${lang === 'fr' ? 'is-on' : ''}">${FLAG_FR}</span><span class="flag ${lang === 'en' ? 'is-on' : ''}">${FLAG_UK}</span>
      </button>
      <button class="theme-toggle" type="button" data-theme-toggle></button>`;

  // Page projet : un simple lien de retour en haut à gauche ; langue et thème dans le coin, comme sur l'accueil.
  const header = isHome
    ? `<header class="nav nav--home" data-nav>
        <nav class="topnav" aria-label="${t('Navigation principale', 'Main navigation')}">
          ${NAV.map((n) => `<a class="topnav__link" href="${href(n.id)}">${n.label}</a>`).join('')}
        </nav>
      </header>${rail}`
    : `<header class="ptop" data-nav>
        <a class="ptop__back" href="${HOME}#work" data-back><span class="ptop__arrow" aria-hidden="true">${ARROW_LEFT}</span>${t('Projets', 'Projects')}</a>
      </header>`;
  const top = `${header}
    <div class="corner" data-corner>${prefs}
    </div>`;

  document.body.insertAdjacentHTML(
    'afterbegin',
    `<a class="skip" href="#main">${t('Aller au contenu', 'Skip to content')}</a>
    ${top}`,
  );
  restoreAfterLangSwitch(isHome);
  if (isHome) rememberHomeScroll();
  else bindBack();

  document.body.insertAdjacentHTML(
    'beforeend',
    `<footer class="footer">
      <p>© ${new Date().getFullYear()} Pedro Firmino · Rouen</p>
      <div class="footer__prefs">${prefs}
      </div>
      <a class="footer__btn" href="#top">${t('Haut de page', 'Back to top')} <span aria-hidden="true">↑</span></a>
    </footer>
    <div class="toast" role="status" aria-live="polite" data-toast></div>`,
  );


  // Thème : un bouton rond, seul dans son coin
  document.querySelectorAll('[data-lang-toggle]').forEach((b) => b.addEventListener('click', () => switchLang(isHome)));
  const themeBtns = [...document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')];
  const syncTheme = () => {
    const dark = currentTheme() === 'dark';
    for (const btn of themeBtns) {
      btn.innerHTML = dark ? SUN : MOON;
      btn.setAttribute(
        'aria-label',
        dark ? t('Passer en thème clair', 'Switch to light theme') : t('Passer en thème sombre', 'Switch to dark theme'),
      );
    }
  };
  syncTheme();
  themeBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
      toggleTheme();
      syncTheme();
    }),
  );

  const nav = document.querySelector<HTMLElement>('[data-nav]')!;
  const corner = document.querySelector<HTMLElement>('[data-corner]');
  const progress = nav.querySelector<HTMLElement>('.nav__progress');
  const railEl = document.querySelector<HTMLElement>('[data-rail]');
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-section]')];
  if (isHome) document.documentElement.classList.add('has-rail');

  // La section en cours s'allume dans le sommaire ; il n'apparaît qu'après le haut de page.
  let activeId = '';
  const setActive = (id: string) => {
    if (id === activeId) return;
    activeId = id;
    links.forEach((l) => (l.dataset.section === id ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current')));
    railEl?.classList.toggle('is-visible', id !== '');
    railEl?.classList.toggle('is-on-band', id === 'work' || id === 'code');
    // Accueil : la barre du haut laisse la place au sommaire de droite dès qu'on quitte le haut de page
    if (isHome) nav.classList.toggle('is-hidden', id !== '');
  };

  if (isHome) {
    const sections = RAIL.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const update = () => {
      // getBoundingClientRect et pas offsetTop : la frise épinglée change le parent de décalage.
      const probe = innerHeight * 0.35;
      const current = sections.filter((s) => s.getBoundingClientRect().top <= probe).pop();
      setActive(current?.id ?? '');
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  // Le retour aux projets et les boutons du coin se cachent quand on descend, et reviennent dès qu'on remonte.
  // (Sur l'accueil, la barre du haut suit le sommaire, voir setActive.)
  const bars = (isHome ? [corner] : [nav, corner]).filter((el): el is HTMLElement => !!el);
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    const hasFocus = bars.some((b) => b.contains(document.activeElement));
    if (goingDown && y > 240 && !hasFocus) bars.forEach((b) => b.classList.add('is-hidden'));
    else if (goingUp || y < 240) bars.forEach((b) => b.classList.remove('is-hidden'));
    if (Math.abs(y - lastY) > 4) lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  bars.forEach((el) => el.addEventListener('focusin', () => bars.forEach((b) => b.classList.remove('is-hidden'))));
  onScroll();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast(t('Email copié', 'Email copied'));
    } catch {
      location.href = `mailto:${profile.email}`;
    }
  };

  return { copyEmail };
}

// Changement de langue : on recharge la page au même endroit
const LANG_Y = 'lang:y';

function switchLang(isHome: boolean) {
  saveLang(lang === 'fr' ? 'en' : 'fr');
  // L'accueil sait déjà revenir à sa position ; une page projet note simplement la sienne.
  if (isHome) store.set(RETURN_KEY, '1');
  else store.set(LANG_Y, JSON.stringify({ path: location.pathname, y: scrollY }));
  location.reload();
}

function restoreAfterLangSwitch(isHome: boolean) {
  if (isHome) return;
  const raw = store.get(LANG_Y);
  if (!raw) return;
  store.remove(LANG_Y);
  const { path, y } = JSON.parse(raw) as { path: string; y: number };
  if (path !== location.pathname) return;
  history.scrollRestoration = 'manual';
  document.fonts.ready.then(() =>
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    }),
  );
}

// Retour à l'accueil, à l'endroit exact où on l'avait quitté
const SCROLL_KEY = 'home:y';
const RETURN_KEY = 'home:return';
const store = {
  get: (k: string) => {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      sessionStorage.setItem(k, v);
    } catch {}
  },
  remove: (k: string) => {
    try {
      sessionStorage.removeItem(k);
    } catch {}
  },
};

// La position est notée par rapport à la section en cours (et pas en pixels
// absolus) : si une image au-dessus change de taille au rechargement, on retombe
// quand même au même endroit.
const ANCHORS = ['about', 'work', 'skills', 'code', 'parcours', 'contact'];
// Une section épinglée est fixe pendant la frise : on mesure son conteneur à la place.
const pageTop = (el: HTMLElement) => {
  const box = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
  return box.getBoundingClientRect().top + scrollY;
};

function rememberHomeScroll() {
  addEventListener('pagehide', () => {
    const y = scrollY;
    const anchor = ANCHORS.map((id) => document.getElementById(id)!)
      .filter((el) => el && pageTop(el) <= y + 1)
      .pop();
    store.set(SCROLL_KEY, JSON.stringify(anchor ? { id: anchor.id, dy: y - pageTop(anchor) } : { id: '', dy: y }));
  });
  // Page ressortie du cache du navigateur : elle est déjà au bon endroit.
  addEventListener('pageshow', (e) => e.persisted && store.remove(RETURN_KEY));

  if (!store.get(RETURN_KEY)) return;
  store.remove(RETURN_KEY);
  let saved: { id: string; dy: number };
  try {
    saved = JSON.parse(store.get(SCROLL_KEY) ?? '');
  } catch {
    return;
  }
  const target = () => {
    const el = saved.id ? document.getElementById(saved.id) : null;
    return (el ? pageTop(el) : 0) + saved.dy;
  };
  const jump = () => {
    ScrollTrigger.refresh();
    lenis?.resize();
    if (lenis) lenis.scrollTo(target(), { immediate: true, force: true });
    else window.scrollTo(0, target());
  };

  // La page est rechargée : on attend que la mise en page soit posée (polices,
  // frise épinglée) avant de sauter à la position, masquée le temps du saut.
  history.scrollRestoration = 'manual';
  const root = document.documentElement;
  root.classList.add('is-restoring');
  const reveal = () => root.classList.remove('is-restoring');
  const fallback = setTimeout(reveal, 1500);
  document.fonts.ready.then(() =>
    requestAnimationFrame(() => {
      jump();
      clearTimeout(fallback);
      requestAnimationFrame(reveal);
    }),
  );
  // Les images finissent parfois de charger après : on recale une fois, sauf si
  // le visiteur a déjà recommencé à faire défiler.
  let touched = false;
  const stop = () => (touched = true);
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => addEventListener(t, stop, { once: true, passive: true }));
  const settle = () => !touched && requestAnimationFrame(jump);
  if (document.readyState === 'complete') settle();
  else addEventListener('load', settle, { once: true });
}

function bindBack() {
  const fromHome = (() => {
    try {
      const ref = new URL(document.referrer);
      return ref.origin === location.origin && (ref.pathname === HOME || ref.pathname === `${HOME}index.html`);
    } catch {
      return false;
    }
  })();

  document.querySelector<HTMLAnchorElement>('[data-back]')!.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    // Sans position connue (arrivée directe sur le projet), le lien mène aux projets.
    if (!store.get(SCROLL_KEY)) return;
    e.preventDefault();
    store.set(RETURN_KEY, '1');
    // Venu de l'accueil : un simple « précédent » retrouve la page telle quelle.
    if (fromHome && history.length > 1) history.back();
    else location.href = HOME;
  });
}

// Tous les liens « CV » du site pointent vers le même fichier.
export function bindCvLinks() {
  document.querySelectorAll<HTMLAnchorElement>('[data-cv]').forEach((a) => (a.href = profile.cv));
}
