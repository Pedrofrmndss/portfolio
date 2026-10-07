# Portfolio de Pedro Firmino

Portfolio de développeur. Vite + TypeScript + Three.js, sans framework UI.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # vérifie les types puis génère dist/
npm run preview  # sert dist/ comme en production
```

## Où modifier quoi

| Je veux changer…                                  | Fichier                                   |
| ------------------------------------------------- | ----------------------------------------- |
| Projets (textes, étapes, médias), outils, parcours | `src/data.ts`                         |
| Version anglaise de ces textes                   | `src/data.en.ts`                |
| Textes de l’interface et du HTML (FR / EN)        | `t('fr', 'en')` dans le code, `data-en` dans le HTML |
| Mon email (bouton « copier »)                     | `src/data.ts` → `profile.email`           |
| Texte « À propos », hero, contact                 | `index.html`                              |
| Couleurs, typos, mise en page                     | `src/styles/main.css` (tokens en haut)    |
| Physique des lettres 3D                           | `src/hero/BalloonLetters.ts`              |

Ajouter un projet = ajouter une entrée dans `projects` (`src/data.ts`). Sa page
`/projets/<id>/` est créée automatiquement.

## Structure

```
index.html                accueil
projet.html               gabarit des pages projet
vite.config.ts            plugin qui génère /projets/<id>/ (dev et build)
src/
  data.ts                 tout le contenu, typé (en français)
  data.en.ts              sa version anglaise, posée par-dessus
  i18n.ts                 langue choisie (FR par défaut), t(fr, en), textes data-en du HTML
  pages/home.ts           point d'entrée de l'accueil
  pages/project.ts        point d'entrée d'une page projet
  core/chrome.ts          barre du haut, sommaire, footer (communs)
  core/scroll.ts          scroll fluide, ancres
  core/reveal.ts          animations d'apparition
  hero/BalloonLetters.ts  desktop : scène Three.js + physique (ressorts, lancer, collisions)
  hero/letters.ts         formes des lettres P, E, D, R, O
  ui/carousel.ts          carrousel infini des projets de code (défilement auto, scroll, glisser-lancer)
  ui/skills.ts            section Outils : logos Devicon (MIT) et Simple Icons (CC0)
  ui/lab.ts               « Le code du site » : fenêtre de code à onglets
  ui/code.ts              coloration syntaxique des extraits
  ui/journey.ts           parcours en frise horizontale épinglée au scroll
```

## Le hero selon l'appareil

- **Souris + écran ≥ 900 px** : lettres 3D physiques. Three.js est chargé à part,
  le reste de la page ne l'attend pas.
- **Tactile ou petit écran** : pas de lettres, une phrase (« Still learning. Still
  building. ») à la place. Aucun WebGL chargé.

## Déploiement (Netlify)

Netlify construit et publie le site à chaque push sur `main`. Les réglages sont dans
`netlify.toml` : commande `npm run build`, dossier publié `dist`, Node 22.

## Avant de mettre en ligne

- [ ] Renseigner `profile.email` dans `src/data.ts` (ou le laisser vide pour masquer le bouton).
- [ ] Ajouter de vraies captures d’INSERT COIN TO ESCAPE (galerie du projet dans `src/data.ts`).
- [ ] Mettre le lien du dépôt de ce portfolio dans le projet « Ce portfolio ».
