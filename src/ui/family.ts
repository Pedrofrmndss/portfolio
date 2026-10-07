import type { Family } from '../data';

// Une icône par famille de projet : une fenêtre de navigateur pour les sites, une manette pour les jeux.
const ICONS: Record<Family, string> = {
  web: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="3" y="4.5" width="18" height="15" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 9h18" stroke="currentColor" stroke-width="2"/><circle cx="6.5" cy="6.8" r="0.9" fill="currentColor"/><circle cx="9.3" cy="6.8" r="0.9" fill="currentColor"/></svg>',
  game: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7.5 7h9a5 5 0 0 1 4.9 6l-.8 3.6a2.4 2.4 0 0 1-4.1 1.1L14.6 16H9.4l-1.9 1.7a2.4 2.4 0 0 1-4.1-1.1L2.6 13a5 5 0 0 1 4.9-6Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 10v3M6.5 11.5h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="15.5" cy="10.6" r="1" fill="currentColor"/><circle cx="17.3" cy="12.6" r="1" fill="currentColor"/></svg>',
};

export const familyIcon = (f: Family) => ICONS[f];
