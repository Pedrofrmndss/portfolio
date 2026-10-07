import { t } from '../i18n';
import '../styles/main.css';
import { gsap } from 'gsap';
import { categories, families, isFeatured, projects, projectUrl, type Media, type Project, type Section } from '../data';
import { bindAnchors } from '../core/scroll';
import { mountChrome } from '../core/chrome';
import { mountReveals } from '../core/reveal';
import { coverHtml } from '../ui/cover';
import { editorHtml } from '../ui/code';
import { familyIcon } from '../ui/family';
import { esc, reducedMotion } from '../ui/effects';

mountChrome({ isHome: false });

const id = location.pathname.match(/projets\/([\w-]+)/)?.[1] ?? new URLSearchParams(location.search).get('id');
const index = projects.findIndex((p) => p.id === id);
const main = document.querySelector<HTMLElement>('#main')!;
const HOME = import.meta.env.BASE_URL;

const ZOOM = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

type Shot = Extract<Media, { type: 'image' }>;
function zoomHtml(m: Shot) {
  return `
  <button type="button" class="media__zoom" data-zoom aria-label="${t('Agrandir l’image', 'Enlarge image')} : ${esc(m.alt)}">
    <img src="${m.src}" alt="${esc(m.alt)}" loading="lazy" decoding="async" />
    <span class="media__zoom-icon" aria-hidden="true">${ZOOM}</span>
  </button>`;
}

// Les images s'agrandissent au clic ; les vidéos YouTube ne sont chargées qu'au clic.
const mediaHtml = (m: Media) => {
  const caption = m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : '';
  if (m.type === 'image') {
    const frame = m.ratio ? `class="media__frame media__frame--crop" style="aspect-ratio: ${m.ratio}"` : 'class="media__frame"';
    return `<figure class="media"><div ${frame}>${zoomHtml(m)}</div>${caption}</figure>`;
  }
  if (m.type === 'video') {
    return `<figure class="media"><div class="media__frame media__frame--video"><video controls playsinline preload="none" ${m.poster ? `poster="${m.poster}"` : ''}><source src="${m.src}" type="video/mp4" /></video></div>${caption}</figure>`;
  }
  if (m.type === 'code') {
    return `<figure class="media media--code">${editorHtml(m.file, m.code)}${caption}</figure>`;
  }
  return `<figure class="media media--yt ${m.vertical ? 'media--vertical' : ''}">
    <div class="media__frame">
      <button type="button" class="yt" data-yt="${m.id}" data-title="${esc(m.title)}" aria-label="${t('Lire la vidéo', 'Play video')}: ${esc(m.title)}">
        <img src="https://i.ytimg.com/vi/${m.id}/${m.vertical ? 'hqdefault' : 'maxresdefault'}.jpg" alt="" loading="lazy" decoding="async" />
        <span class="yt__play" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>
      </button>
    </div>${caption}</figure>`;
};

// Mockups : un ordinateur portable et un téléphone dessinés en CSS, la capture dans l'écran.
const caption = (m: Shot) => (m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : '');
const laptopHtml = (m: Shot) => `
  <figure class="device laptop">
    <div class="laptop__lid"><div class="laptop__screen">${zoomHtml(m)}</div></div>
    <div class="laptop__base" aria-hidden="true"></div>
    ${caption(m)}
  </figure>`;
const phoneHtml = (m: Shot) => `
  <figure class="device phone">
    <div class="phone__body"><div class="phone__screen">${zoomHtml(m)}</div></div>
    ${caption(m)}
  </figure>`;
const deviceHtml = (m: Shot) => (m.device === 'mobile' ? phoneHtml(m) : laptopHtml(m));

function shotsOf(p: Project) {
  const gallery = p.gallery ?? [];
  const shots = gallery.filter((m): m is Shot => m.type === 'image' && !!m.device);
  return {
    desk: shots.filter((m) => m.device === 'desktop'),
    mob: shots.filter((m) => m.device === 'mobile'),
    others: gallery.filter((m) => !shots.includes(m as Shot)),
  };
}

// Le haut de page montre l'ordinateur et le téléphone côte à côte ; sans capture, l'image du projet ; sans image, rien.
function heroVisual(p: Project) {
  const { desk, mob } = shotsOf(p);
  if (!desk.length && !mob.length) {
    if (!p.cover || p.heroCover === false) return '';
    return `<figure class="phead__cover" style="view-transition-name: cover-${p.id}">${coverHtml(p.cover, t(`Visuel du projet ${p.title}`, `${p.title} project visual`), p.title)}</figure>`;
  }
  return `<div class="hdev ${desk.length ? '' : 'hdev--phone'}">
    ${desk[0] ? `<div class="hdev__laptop">${laptopHtml(desk[0])}</div>` : ''}
    ${mob[0] ? `<div class="hdev__phone">${phoneHtml(mob[0])}</div>` : ''}
  </div>`;
}

// La galerie qui défile à l'horizontale : toutes les autres captures, ordinateurs et téléphones alternés.
function galleryHtml(p: Project) {
  const { desk, mob, others } = shotsOf(p);
  const rest: Shot[] = [];
  const d = desk.slice(1);
  const m = mob.slice(1);
  while (d.length || m.length) {
    if (d.length) rest.push(d.shift()!);
    if (m.length) rest.push(m.shift()!);
  }
  if (!rest.length && !others.length) return '';
  return `
    <section class="pgal" id="images" aria-labelledby="images-title">
      <div class="pgal__head wrap"><h2 class="psec__title" id="images-title">${t('En images', 'In pictures')}</h2></div>
      <div class="pgal__viewport">
        <div class="pgal__track">
          ${rest.map((s) => `<div class="pgal__item pgal__item--${s.device}">${deviceHtml(s)}</div>`).join('')}
          ${others.map((o) => `<div class="pgal__item">${mediaHtml(o)}</div>`).join('')}
        </div>
      </div>
    </section>`;
}

// Les parties du texte. Une partie sans contenu n'est simplement pas affichée.
const chapterHtml = (s: Section, i: number) => {
  const split = s.media?.length === 1 && s.media[0].type !== 'youtube';
  return `
  <div class="chapter ${split ? 'chapter--split' : ''} ${split && i % 2 ? 'chapter--flip' : ''}">
    <div class="chapter__copy">
      <h3 class="chapter__title">${esc(s.title)}</h3>
      ${s.text.map((p) => `<p>${esc(p)}</p>`).join('')}
    </div>
    ${s.media?.length ? `<div class="chapter__media chapter__media--${Math.min(s.media.length, 3)}">${s.media.map(mediaHtml).join('')}</div>` : ''}
  </div>`;
};

const head = (title: string, id: string) => `<h2 class="psec__title" id="${id}-title">${esc(title)}</h2>`;

const introHtml = (p: Project) =>
  p.overview
    ? `<section class="psec psec--intro wrap" id="projet" aria-labelledby="projet-title">
        <div class="pintro">
          ${head(t('Le projet', 'The project'), 'projet')}
          <div class="pintro__text">
            <p>${esc(p.overview.start)}</p>
            <p>${esc(p.overview.did)}</p>
          </div>
        </div>
        <p class="pintro__lede">${esc(p.overview.result)}</p>
      </section>`
    : '';

const detailsHtml = (p: Project) =>
  p.sections.length
    ? `<section class="psec wrap" id="details" aria-labelledby="details-title">
        ${head(p.sectionsTitle ?? t('En détail', 'In detail'), 'details')}
        <div class="chapters">${p.sections.map(chapterHtml).join('')}</div>
      </section>`
    : '';

const challengesHtml = (p: Project) =>
  p.challenges?.length
    ? `<section class="psec wrap" id="defis" aria-labelledby="defis-title">
        ${head(t('Défis et solutions', 'Challenges and solutions'), 'defis')}
        <ol class="challenges">${p.challenges
          .map(
            (c) => `<li class="challenge">
              <h3 class="challenge__title">${esc(c.title)}</h3>
              <div class="challenge__body">
                <p class="challenge__problem">${esc(c.problem)}</p>
                <p class="challenge__solution"><span class="challenge__label">${t('Solution', 'Solution')}</span> ${esc(c.solution)}</p>
              </div>
            </li>`,
          )
          .join('')}</ol>
      </section>`
    : '';

const takeawaysHtml = (p: Project) => {
  if (!p.learned?.length && !p.improve?.length) return '';
  const list = (title: string, items?: string[]) =>
    items?.length ? `<div class="takeaways__col"><h3 class="takeaways__title">${title}</h3><ul>${items.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>` : '';
  return `<section class="psec wrap" id="bilan" aria-labelledby="bilan-title">
    ${head(t('Ce que j’en retiens', 'Takeaways'), 'bilan')}
    <div class="takeaways">${list(t('J’ai appris', 'I learned'), p.learned)}${list(t('Pour la suite', 'Next steps'), p.improve)}</div>
  </section>`;
};

const linkHtml = (l: Project['links'][number], primary: boolean) =>
  `<a class="btn ${primary ? 'btn--primary' : ''}" href="${l.href}" target="_blank" rel="noopener">${esc(l.label)} <span aria-hidden="true">↗</span></a>`;

if (index === -1) {
  document.title = 'Projet introuvable · Pedro Firmino';
  main.innerHTML = `
    <section class="project-missing">
      <h1 class="title" data-inflate>${t('Oups', 'Oops')}</h1>
      <p>${t('Ce projet n’existe pas, ou son adresse a changé.', 'This project doesn’t exist, or its address has changed.')}</p>
      <a class="btn btn--primary" href="${HOME}#work">${t('Voir tous les projets', 'See all projects')}</a>
    </section>`;
} else {
  const p = projects[index];
  const pool = projects.filter((q) => isFeatured(q) === isFeatured(p));
  const next = pool[(pool.indexOf(p) + 1) % pool.length];
  document.title = `${p.title} · Pedro Firmino`;
  const facts = [{ label: t('Rôle', 'Role'), value: p.role }, ...p.facts, { label: t('Outils', 'Tools'), value: p.stack.join(', ') }];

  main.innerHTML = `
    <article class="project">
      <header class="phead wrap ${heroVisual(p) ? '' : 'phead--text'}" id="intro">
        <div class="phead__text">
          <p class="phead__meta">${p.family ? `<span class="fam fam--${p.family}">${familyIcon(p.family)}${families[p.family].one}</span>` : `<span>${categories[p.category]}</span>`}<span>${esc(p.kind)}</span><span>${esc(p.date)}</span></p>
          <h1 class="phead__title" style="view-transition-name: title-${p.id}">${esc(p.title)}</h1>
          <p class="phead__summary">${esc(p.summary)}</p>
          ${p.links.length ? `<div class="phead__links">${p.links.map((l, i) => linkHtml(l, i === 0)).join('')}</div>` : ''}
        </div>
        ${heroVisual(p) ? `<div class="phead__visual">${heroVisual(p)}</div>` : ''}
        <dl class="phead__facts">${facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>
      </header>

      ${introHtml(p)}
      ${galleryHtml(p)}
      ${detailsHtml(p)}
      ${challengesHtml(p)}
      ${takeawaysHtml(p)}

      <nav class="next is-band" id="suivant" aria-label="${t('Projet suivant', 'Next project')}">
        <a class="next__link wrap" href="${projectUrl(next.id)}">
          <span class="next__label">${t('Projet suivant', 'Next project')} <span aria-hidden="true">→</span></span>
          <span class="next__title">${esc(next.title)}</span>
          <span class="next__kind">${esc(next.kind)} · ${next.year}</span>
          <span class="next__thumb">${coverHtml(next.cover, '', next.title)}</span>
        </a>
      </nav>
    </article>
    <dialog class="lightbox" data-lightbox aria-label="${t('Image agrandie', 'Enlarged image')}">
      <form method="dialog"><button class="lightbox__close" aria-label="${t('Fermer', 'Close')}">✕</button></form>
      <img alt="" data-lightbox-img />
      <p class="lightbox__caption" data-lightbox-caption></p>
    </dialog>`;
}

// Bandes vertes : en remontant depuis « Projet suivant » (toujours en bande), une section sur deux.
// Deux bandes ne se touchent jamais, quel que soit le nombre de parties du projet.
[...main.querySelectorAll<HTMLElement>('.project > .psec, .project > .pgal')]
  .reverse()
  .forEach((s, i) => s.classList.toggle('is-band', i % 2 === 1));

// Agrandir une image : une boîte de dialogue native (Échap et clic hors de l'image ferment).
const lightbox = document.querySelector<HTMLDialogElement>('[data-lightbox]');
main.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const zoom = target.closest<HTMLButtonElement>('[data-zoom]');
  if (zoom && lightbox) {
    const img = zoom.querySelector('img')!;
    const lbImg = lightbox.querySelector<HTMLImageElement>('[data-lightbox-img]')!;
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lightbox.querySelector('[data-lightbox-caption]')!.textContent = zoom.closest('figure')?.querySelector('figcaption')?.textContent ?? '';
    lightbox.showModal();
    return;
  }
  const btn = target.closest<HTMLButtonElement>('[data-yt]');
  if (!btn) return;
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&playsinline=1&rel=0`;
  iframe.title = btn.dataset.title ?? t('Vidéo YouTube', 'YouTube video');
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  btn.replaceWith(iframe);
  iframe.focus();
});
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.close();
});

bindAnchors();
mountReveals();

// Animations. Tout est désactivé si l'utilisateur demande moins de mouvement.
// Les titres montent mot par mot : chaque mot est enveloppé dans un masque.
function splitWords(el: HTMLElement) {
  const words = (el.textContent ?? '').trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="word"><span class="word__in">${esc(w)}</span></span>`).join(' ');
  return el.querySelectorAll<HTMLElement>('.word__in');
}

if (!reducedMotion() && index !== -1) {
  // Entrée : le titre mot par mot, puis le texte ; l'ordinateur monte, le téléphone arrive en tournant
  gsap
    .timeline({ defaults: { ease: 'power4.out' }, delay: 0.05 })
    .from(splitWords(document.querySelector<HTMLElement>('.phead__title')!), { yPercent: 110, duration: 1, stagger: 0.07, clearProps: 'all' })
    .from('.phead__meta, .phead__summary, .phead__links', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'all' }, 0.2)
    .from('.hdev__laptop, .phead__cover', { y: 90, opacity: 0, duration: 1.2, clearProps: 'opacity,transform' }, 0.15)
    .from('.hdev__phone', { y: 140, rotate: 14, opacity: 0, duration: 1.3, ease: 'back.out(1.4)', clearProps: 'opacity,transform' }, 0.4)
    .from('.phead__facts > div', { y: 16, opacity: 0, duration: 0.6, stagger: 0.05, clearProps: 'all' }, 0.6);

  // Le téléphone flotte doucement, et les appareils s'inclinent vers la souris
  gsap.to('.hdev__phone .phone', { y: -14, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });
  const hdev = document.querySelector<HTMLElement>('.hdev');
  if (hdev && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    gsap.set(hdev, { transformPerspective: 1200 });
    const rx = gsap.quickTo(hdev, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    const ry = gsap.quickTo(hdev, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    addEventListener('pointermove', (e) => {
      ry((e.clientX / innerWidth - 0.5) * 10);
      rx(-(e.clientY / innerHeight - 0.5) * 6);
    });
  }
  // En descendant, le téléphone remonte plus vite que l'ordinateur
  gsap.to('.hdev__phone', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.phead', start: 'top top', end: 'bottom top', scrub: 0.6 } });

  // Titres des parties : mot par mot
  gsap.utils.toArray<HTMLElement>('.psec__title').forEach((el) =>
    gsap.from(splitWords(el), { yPercent: 110, duration: 0.9, stagger: 0.06, ease: 'power4.out', clearProps: 'all', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
  );

  // Textes : une légère montée
  gsap.utils.toArray<HTMLElement>('.pintro__text p, .pintro__lede, .chapter__copy, .challenge, .takeaways__col').forEach((el) =>
    gsap.from(el, { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }),
  );
  gsap.utils.toArray<HTMLElement>('.chapter .media').forEach((el) =>
    gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }),
  );

  // La galerie : sur ordinateur, la section s'épingle et les appareils défilent à l'horizontale
  const gal = document.querySelector<HTMLElement>('.pgal');
  if (gal) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const tr = gal.querySelector<HTMLElement>('.pgal__track')!;
      const vp = gal.querySelector<HTMLElement>('.pgal__viewport')!;
      const distance = () => Math.max(tr.scrollWidth - vp.clientWidth, 0);
      const slide = gsap.to(tr, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: gal, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
      // Chaque appareil se redresse en entrant dans l'écran
      gal.querySelectorAll<HTMLElement>('.pgal__item').forEach((item, i) =>
        gsap.fromTo(
          item.firstElementChild,
          { rotate: i % 2 ? 6 : -4, y: 50, scale: 0.92 },
          { rotate: 0, y: 0, scale: 1, ease: 'power2.out', scrollTrigger: { trigger: item, containerAnimation: slide, start: 'left 95%', end: 'left 45%', scrub: true } },
        ),
      );
    });
  }

  // Projet suivant : la vignette glisse en parallaxe
  const thumb = document.querySelector('.next__thumb');
  if (thumb) gsap.fromTo(thumb, { y: 60 }, { y: -30, ease: 'none', scrollTrigger: { trigger: '.next', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
}
