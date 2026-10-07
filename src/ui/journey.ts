import { t } from '../i18n';
import { gsap } from 'gsap';
import { journey } from '../data';
import { esc, reducedMotion } from './effects';

// Parcours en frise horizontale : la section se fige et le scroll fait défiler
// les étapes de gauche à droite. Sur mobile, une simple liste verticale.
export function mountJourney() {
  const section = document.querySelector<HTMLElement>('[data-journey]')!;
  const track = section.querySelector<HTMLElement>('[data-journey-track]')!;
  const fill = section.querySelector<HTMLElement>('[data-journey-fill]')!;
  const list = section.querySelector<HTMLElement>('[data-journey-list]')!;

  list.insertAdjacentHTML(
    'beforeend',
    journey
      .map(
        (s, i) => `
        <li class="step ${i === journey.length - 1 ? 'step--now' : ''}">
          <span class="step__year">${s.year}</span>
          <span class="step__dot" aria-hidden="true"></span>
          <article class="step__card">
            <time class="step__date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>${esc(s.date)}</time>
            <header class="step__head">
              <span class="step__logo">${
                s.logo
                  ? `<img src="${s.logo}" alt="${esc(s.place)}" loading="lazy" decoding="async" />`
                  : '<span class="step__code" aria-hidden="true">&lt;/&gt;</span>'
              }</span>
              <span>
                <span class="step__kind">${esc(s.kind)}</span>
                <h3 class="step__title">${esc(s.title)}</h3>
                <span class="step__place">${esc(s.place)}</span>
              </span>
            </header>
            <p class="step__text">${esc(s.text)}</p>
            <ul class="step__points">${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
            ${i === journey.length - 1 ? `<p class="note note--pink step__note">${t('Et si la suite, c’était chez vous ?', 'What if the next step is with you?')}</p>` : ''}
            ${s.link ? `<a class="step__link" href="${s.link.href}">${esc(s.link.label)} <span aria-hidden="true">→</span></a>` : ''}
          </article>
        </li>`,
      )
      .join(''),
  );

  const steps = [...track.querySelectorAll<HTMLElement>('.step')];
  if (reducedMotion()) {
    steps.forEach((s) => s.classList.add('is-active'));
    fill.style.transform = 'none';
    return;
  }

  const mm = gsap.matchMedia();

  mm.add('(min-width: 800px)', () => {
    const distance = () => track.scrollWidth - section.querySelector<HTMLElement>('.journey__viewport')!.clientWidth;
    const slide = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (st) => (fill.style.transform = `scaleX(${st.progress})`),
      },
    });
    // Chaque étape s'allume quand elle passe le milieu de l'écran
    steps.forEach((step) =>
      gsap.to(step, {
        scrollTrigger: {
          trigger: step,
          containerAnimation: slide,
          start: 'left 65%',
          toggleClass: 'is-active',
        },
      }),
    );
  });

  mm.add('(max-width: 799px)', () => {
    fill.style.transform = 'none';
    steps.forEach((step) =>
      gsap.to(step, { scrollTrigger: { trigger: step, start: 'top 75%', toggleClass: 'is-active' } }),
    );
  });
}
