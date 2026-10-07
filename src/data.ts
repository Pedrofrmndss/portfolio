// Tout le contenu du site vit ici : modifie ce fichier, pas le HTML.
// La version anglaise des textes est dans data.en.ts.
import { lang, t } from './i18n';
import { journeyEn, projectsEn, skillsEn } from './data.en';

export const profile = {
  name: 'Pedro Firmino',
  city: 'Rouen, FR',
  // Laisse vide pour masquer le bouton « Copier l'email ».
  email: '',
  linkedin: 'https://www.linkedin.com/in/pedro-firmino-764508344/',
  github: 'https://github.com/Pedrofrmndss',
  cv: `${import.meta.env?.BASE_URL ?? '/'}media/cv/cv-pedro-firmino.pdf`,
};

// Images et vidéos des projets : dans public/media (reprises de l'ancien portfolio).
// Couvertures des projets de code (cover-*.webp) : photos Unsplash (licence Unsplash), même léger étalonnage vert.
// Suri : Pebri Ramadhan Mas. Overwatch Memory : welcome. (@capturedmoments193). INSERT COIN : Dillon Kydd.
// Portfolio : Arnold Francisca. Billetterie : Brad Rucker. Dashboard météo : Marcus Woodbridge.
// Site de restaurant : Austin (@austin_7792).
const MEDIA = `${import.meta.env?.BASE_URL ?? '/'}media/`;
const IMG = MEDIA + 'images/';
const VID = MEDIA + 'videos/';
const YT = (id: string, frame: string) => `https://i.ytimg.com/vi/${id}/${frame}.jpg`;

export type Category = 'dev' | 'motion' | 'video';
/** Famille d'un projet de code, pour trier le carrousel. */
export type Family = 'web' | 'game';

export type Media =
  | {
      type: 'image';
      src: string;
      alt: string;
      caption?: string;
      /** Recadre l'image (ex. '16 / 9'). */
      ratio?: string;
      /** Capture d'écran : affichée dans un cadre de navigateur ou de téléphone. */
      device?: 'desktop' | 'mobile';
    }
  | { type: 'video'; src: string; poster?: string; caption?: string }
  | { type: 'youtube'; id: string; title: string; caption?: string; vertical?: boolean }
  | { type: 'code'; file: string; code: string; caption?: string };

export interface Section {
  title: string;
  text: string[];
  media?: Media[];
}

export interface Project {
  id: string;
  title: string;
  category: Category;
  family?: Family;
  kind: string;
  date: string;
  year: number;
  /** Image de couverture ; vide = tuile typographique. */
  cover: string;
  /** false : la couverture n'apparaît pas en haut de la page du projet. */
  heroCover?: boolean;
  summary: string;
  role: string;
  stack: string[];
  facts: { label: string; value: string }[];
  /** « En bref » : le point de départ, ce que j'ai fait, le résultat. */
  overview?: { start: string; did: string; result: string };
  /** Titre du bloc des chapitres (par défaut « Le projet »). */
  sectionsTitle?: string;
  sections: Section[];
  /** Les problèmes rencontrés et comment je les ai réglés. */
  challenges?: { title: string; problem: string; solution: string }[];
  gallery?: Media[];
  learned?: string[];
  /** Ce que j'améliorerais ensuite. */
  improve?: string[];
  links: { label: string; href: string }[];
}

/** Les projets de code sont mis en avant ; les autres restent en archives. */
export const isFeatured = (p: Project) => p.category === 'dev';

export const families: Record<Family, { one: string; many: string }> = {
  web: { one: t('Site web', 'Website'), many: t('Sites web', 'Websites') },
  game: { one: t('Jeu', 'Game'), many: t('Jeux', 'Games') },
};

export const categories: Record<Category, string> = {
  dev: 'Dev',
  motion: 'Motion',
  video: t('Vidéo', 'Video'),
};

const projectsFr: Project[] = [
  {
    id: 'suri',
    title: 'Suri Studio',
    category: 'dev',
    family: 'web',
    kind: 'Site d’agence',
    date: 'Janv. 2026',
    year: 2026,
    cover: IMG + 'cover-suri.webp',
    summary:
      'Le site de Suri Studio, l’agence web que je prépare : une vitrine qui doit prouver le savoir-faire technique, pas seulement montrer des projets.',
    role: 'UI/UX design & développement front-end',
    stack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    facts: [
      { label: 'Type', value: 'Projet entrepreneurial' },
      { label: 'Année', value: '2026' },
      { label: 'Statut', value: 'Lancement en préparation' },
    ],
    overview: {
      start:
        'Je prépare le lancement de Suri Studio, une agence web créative. Pour une agence, le site est la première preuve : il doit montrer ce qu’on sait faire dès les premières secondes.',
      did: 'J’ai conçu l’identité et l’interface, puis développé tout le front-end : intégration HTML/CSS, navigation entre les pages sans rechargement et animations avec GSAP.',
      result: 'Un site rapide et animé, en ligne sur suristudio.fr, qui sert de vitrine en attendant le lancement de l’agence.',
    },
    sectionsTitle: 'Le projet en détail',
    sections: [
      {
        title: 'L’expérience',
        text: [
          'J’ai misé sur des micro-interactions soignées, une navigation asynchrone très rapide et des transitions de page sans coupure.',
          'L’objectif : affirmer une identité premium et innovante dès les premières secondes, sans jamais ralentir la visite.',
        ],
        media: [{ type: 'video', src: VID + 'suri.mp4', poster: IMG + 'suri-home-d.webp', caption: 'Interface desktop, page Projets' }],
      },
      {
        title: 'Design system',
        text: [
          'Une esthétique sobre et lisible, qui laisse la place au contenu et aux animations. La typographie et les espacements structurent la lecture, les contrastes guident naturellement l’attention.',
          'Plutôt qu’un design system complexe, des règles graphiques simples et cohérentes, appliquées sur tout le site pour une expérience claire et homogène.',
        ],
        media: [
          { type: 'image', src: IMG + 'suri1.png', alt: 'Planche de présentation du logo Suri', caption: 'Présentation du logo' },
          { type: 'image', src: IMG + 'suri2.png', alt: 'Le logo Suri décliné sur fond noir, blanc et vert', caption: 'Déclinaisons du logo' },
        ],
      },
      {
        title: 'Performance & code',
        text: [
          'Entièrement développé en HTML, CSS et JavaScript, avec GSAP pour orchestrer les animations et donner du rythme à la navigation.',
          'Le but n’était pas d’empiler les technologies, mais de garder un contrôle total sur le rendu et les performances. Chaque interaction reste fluide et légère : animations optimisées, chargements maîtrisés, structure propre.',
        ],
      },
    ],
    gallery: [
      { type: 'image', device: 'desktop', src: IMG + 'suri-home-d.webp', alt: 'Accueil de suristudio.fr : le logo Suri et le titre Studio Web', caption: 'L’accueil' },
      { type: 'image', device: 'mobile', src: IMG + 'suri-home-m.webp', alt: 'L’accueil de suristudio.fr sur téléphone', caption: 'L’accueil sur téléphone' },
      { type: 'image', device: 'mobile', src: IMG + 'suri-scroll1-m.webp', alt: 'La méthode en 7 jours sur téléphone', caption: 'La méthode, sur téléphone' },
      { type: 'image', device: 'desktop', src: IMG + 'suri-scroll1-d.webp', alt: 'La méthode : de la stratégie à la mise en ligne en 7 jours', caption: 'La méthode en 7 jours' },
      { type: 'image', device: 'desktop', src: IMG + 'suri-about-d.webp', alt: 'La page Le studio, avec une illustration', caption: 'La page Le studio' },
      { type: 'image', device: 'desktop', src: IMG + 'suri-tarifs-d.webp', alt: 'La page Tarifs et ses offres', caption: 'La page Tarifs' },
      { type: 'image', device: 'desktop', src: IMG + 'suri-contact-d.webp', alt: 'La page Contact et son formulaire de devis', caption: 'La page Contact' },
    ],
    links: [{ label: 'Visiter suristudio.fr', href: 'http://suristudio.fr/' }],
  },
  {
    id: 'overwatch-memory',
    title: 'Overwatch Memory',
    category: 'dev',
    family: 'game',
    kind: 'Jeu web en CSS',
    date: 'Oct. 2026',
    year: 2026,
    cover: IMG + 'cover-overwatch.webp',
    summary:
      'Un jeu de memory avec les héros d’Overwatch, jouable dans le navigateur. Particularité : retourner les cartes et vérifier les paires se fait en CSS, pas en JavaScript.',
    role: 'Conception & développement',
    stack: ['HTML', 'CSS', 'JavaScript'],
    facts: [
      { label: 'Type', value: 'Projet personnel' },
      { label: 'Année', value: '2026' },
      { label: 'Statut', value: 'En ligne' },
    ],
    overview: {
      start: 'Je voulais un projet qui pousse le CSS moderne au bout, avec une question simple : peut-on faire tourner la logique d’un jeu sans JavaScript ?',
      did: 'J’ai conçu et développé tout le jeu : les règles, la logique des cartes en CSS, le plateau mélangé en JavaScript, le chrono, les records et l’interface aux couleurs d’Overwatch.',
      result: 'Un jeu jouable en ligne, en trois fichiers, sans framework ni build. Retourner les cartes et reconnaître les paires se fait entièrement en CSS.',
    },
    sectionsTitle: 'Comment ça marche',
    sections: [
      {
        title: 'Trois états par carte',
        text: [
          'Chaque carte contient trois éléments <details>, dont un seul est visible à la fois : « pick » quand elle est retournée en premier, « miss » quand elle est retournée en second et que ce n’est pas la paire, « found » quand c’est la paire.',
          'Un <details> est ouvert ou fermé : il garde donc l’état de la partie. Les « pick » partagent le même attribut name, donc un seul peut être ouvert à la fois, comme dans un accordéon.',
        ],
        media: [
          {
            type: 'code',
            file: 'style.css',
            caption: 'Le CSS lit l’état de la partie',
            code: `/* Une carte est retournée : les autres proposent « miss »… */
.board:has(.pick[open]) {
  --show-pick: none;
  --show-miss: block;
}

/* …et la carte retournée pivote */
.card:has(.pick[open]) {
  --flipped: 1;
}`,
          },
        ],
      },
      {
        title: 'Reconnaître une paire',
        text: [
          'Chaque carte porte une classe pair-0, pair-1… Quand une carte est retournée, le CSS cherche sa jumelle avec :has() et le sélecteur ~, dans les deux sens : la jumelle peut être placée avant ou après dans la grille.',
          'La jumelle affiche alors « found » au lieu de « miss » : si on clique dessus, c’est une paire.',
        ],
        media: [
          {
            type: 'code',
            file: 'style.css',
            caption: 'La règle d’une paire (une par paire)',
            code: `/* La jumelle de la carte retournée propose « found » */
.pair-0:has(.pick[open]) ~ .pair-0,
.pair-0:has(~ .pair-0 .pick[open]) {
  --show-miss: none;
  --show-found: block;
}`,
          },
        ],
      },
      {
        title: 'Le rôle du JavaScript',
        text: [
          'Le JavaScript ne gère pas les clics sur les cartes. Il tire les héros au hasard, construit le plateau mélangé, lance le chrono et n’écoute qu’un seul événement : l’ouverture d’un « found », pour compter les paires et détecter la victoire.',
        ],
        media: [
          {
            type: 'code',
            file: 'script.js',
            caption: 'Préparer une partie (simplifié)',
            code: `function startGame(mode) {
  // Des héros au hasard, chacun en deux exemplaires, puis on mélange.
  const heroes = shuffle(HEROES).slice(0, mode / 2);
  const cards = shuffle([...heroes.entries(), ...heroes.entries()]);
  board.innerHTML = cards
    .map(([pair, hero], position) => createCard(hero, pair, position))
    .join('');
  startTimer();
}`,
          },
        ],
      },
    ],
    challenges: [
      {
        title: 'Une carte à moitié retournée',
        problem: 'En cliquant très vite sur une deuxième carte pendant que la première pivotait encore, une carte pouvait rester bloquée à moitié retournée.',
        solution: 'Pendant le retournement, une animation CSS désactive les clics sur tout le plateau (pointer-events: none). Plus aucun clic ne peut arriver au mauvais moment.',
      },
      {
        title: 'Un plateau qui ramait',
        problem: 'Avec beaucoup de cartes, chaque clic obligeait le navigateur à recalculer énormément de styles : environ 160 ms par action, un ralentissement bien visible.',
        solution: 'Chaque carte n’a plus que trois contrôles, et l’affichage passe par des variables CSS (--show-pick, --show-miss, --show-found). Résultat : environ 9 ms par action.',
      },
      {
        title: 'Rejouer sans recharger',
        problem: 'Le bouton « Rejouer » rechargeait la page avec un lien. Ouvert depuis l’ordinateur, sans serveur, il affichait la liste des fichiers du dossier au lieu du jeu.',
        solution: 'La nouvelle partie est maintenant relancée en JavaScript : le plateau est reconstruit et le chrono remis à zéro, sans quitter la page.',
      },
      {
        title: 'Un jeu jouable sans voir l’écran',
        problem: 'Les cartes sont surtout visuelles : avec un lecteur d’écran, impossible de savoir quel héros venait d’être retourné.',
        solution: 'Le décor de la carte est masqué aux lecteurs d’écran, chaque bouton est nommé (« Card 1 », « Card 2 »…) et un texte caché annonce le héros, puis « Not a match » ou « It’s a match ».',
      },
    ],
    gallery: [
      { type: 'image', device: 'desktop', src: IMG + 'ow-home-d.webp', alt: 'L’accueil : choix du rang et records', caption: 'L’accueil : choix du rang et records' },
      { type: 'image', device: 'mobile', src: IMG + 'ow-home-m.webp', alt: 'L’accueil du jeu sur téléphone', caption: 'L’accueil sur téléphone' },
      { type: 'image', device: 'mobile', src: IMG + 'ow-game-m.webp', alt: 'Une partie sur téléphone', caption: 'Une partie sur téléphone' },
      { type: 'image', device: 'desktop', src: IMG + 'ow-game-d.webp', alt: 'Une partie en cours au rang Argent, quelques paires trouvées', caption: 'Une partie en cours, rang Argent' },
      { type: 'image', device: 'desktop', src: IMG + 'ow-victory-d.webp', alt: 'L’écran de victoire avec le temps et le record', caption: 'L’écran de victoire' },
      { type: 'image', device: 'mobile', src: IMG + 'ow-victory-m.webp', alt: 'L’écran de victoire sur téléphone', caption: 'La victoire sur téléphone' },
    ],
    learned: [
      'Le sélecteur :has(), qui permet à un élément de réagir à ce qui se passe dans ses enfants ou chez ses voisins.',
      'Utiliser <details> et son attribut name comme une petite machine à états, sans JavaScript.',
      'Les variables CSS comme interrupteurs, et leur effet sur les performances.',
      'Les limites du CSS : chaque paire a besoin de ses propres règles, ce qui ne passerait pas à l’échelle sur un très grand plateau.',
    ],
    improve: [
      'Ajouter des sons : retournement, paire, victoire.',
      'Un mode deux joueurs en local, chacun son tour.',
      'Un classement en ligne, ce qui demanderait un petit serveur.',
    ],
    links: [
      { label: 'Jouer', href: 'https://pedrofrmndss.github.io/css-overwatch-memory-game/' },
      { label: 'Voir le code', href: 'https://github.com/Pedrofrmndss/css-overwatch-memory-game' },
    ],
  },
  {
    id: 'insert-coin',
    title: 'INSERT COIN TO ESCAPE',
    category: 'dev',
    family: 'game',
    kind: 'Jeu vidéo Unity',
    date: '2026 à 2027',
    year: 2026,
    cover: IMG + 'cover-insert-coin.webp',
    // Une photo d'ambiance, pas une capture du jeu : seulement dans le carrousel, pas en haut de la page.
    heroCover: false,
    summary:
      'Un jeu d’exploration et d’énigmes à la première personne, développé en groupe sous Unity. Je m’occupe de la première salle : la salle d’arcade abandonnée.',
    role: 'La salle abandonnée : assets, construction dans Unity, code des portes',
    stack: ['Unity', 'C#'],
    facts: [
      { label: 'Équipe', value: 'Projet de groupe' },
      { label: 'Moteur', value: 'Unity 2022.3' },
      { label: 'Plateforme', value: 'PC Windows' },
      { label: 'Statut', value: 'En développement' },
    ],
    overview: {
      start: 'Pour la SAE 5 « Gamification » de BUT MMI 3, on doit créer un jeu vidéo sous Unity et toute la communication autour, avec une démo jouable aux portes ouvertes de l’IUT.',
      did: 'Je m’occupe de la salle abandonnée, la première salle du jeu : je cherche les assets, je construis toute la salle dans Unity et je code les portes.',
      result: 'Le jeu est en cours de développement. La démo est prévue aux portes ouvertes de l’IUT, le 30 janvier 2027.',
    },
    sectionsTitle: 'Ma partie : la salle abandonnée',
    sections: [
      {
        title: 'L’histoire',
        text: [
          'Un garçon de 13 ans, fan de jeux vidéo, explore une salle d’arcade abandonnée depuis des décennies. Une lumière au fond d’un conduit d’aération le mène dans une copie parfaite de la salle, mais à son âge d’or : tout est allumé, tout brille.',
          'La porte se verrouille derrière lui, avec un seul message : « INSERT COIN TO ESCAPE ».',
        ],
      },
      {
        title: 'La salle abandonnée',
        text: [
          'C’est là que tout commence : une salle d’arcade figée depuis des décennies, sombre et couverte de poussière. Elle doit poser l’ambiance tout de suite, et contraster avec la salle « âge d’or » qui suit.',
          'Mon travail : trouver des assets qui collent à cette ambiance, construire toute la salle dans Unity, et coder les portes qui restent verrouillées ou s’ouvrent selon la progression du joueur.',
        ],
      },
      {
        title: 'Les énigmes imaginées pour cette salle',
        text: [
          'Au départ, toutes les portes sont fermées. Celle de la salle du personnel a un cadenas : une affiche indique l’ordre des derniers employés, et il faut retrouver leurs photos, dont le dos cache les chiffres du code.',
          'Dans la salle du personnel, une armoire de maintenance attend qu’on remette chaque outil à sa place. Une fois tout rangé, un compartiment s’ouvre sur un tournevis, qui sert à dévisser le conduit d’aération vers la suite du jeu.',
          'La suite du jeu est encore en discussion dans l’équipe.',
        ],
      },
    ],
    // Pas encore de galerie : à ajouter avec de vraies captures du jeu.
    links: [],
  },
  {
    id: 'portfolio',
    title: 'Ce portfolio',
    category: 'dev',
    family: 'web',
    kind: 'WebGL & TypeScript',
    date: 'Oct. 2026',
    year: 2026,
    cover: IMG + 'cover-portfolio.webp',
    summary:
      'Le site que tu lis : des lettres 3D physiques en Three.js, une version légère sur mobile, deux langues et une page générée par projet. Sans framework d’interface.',
    role: 'Conception, design, développement',
    stack: ['TypeScript', 'Three.js', 'GSAP', 'Vite'],
    facts: [
      { label: 'Type', value: 'Projet personnel' },
      { label: 'Année', value: '2026' },
      { label: 'Langues', value: 'Français, anglais' },
    ],
    overview: {
      start: 'Mon ancien portfolio montrait surtout de la vidéo et du motion design. Je voulais un site qui montre que je me tourne vers le développement, et qui soit lui-même un projet de code.',
      did: 'Tout, de zéro : le design, les lettres 3D dessinées en code et leur physique, la version mobile, les deux langues, la navigation et l’accessibilité.',
      result: 'Un site sans framework d’interface, léger sur mobile, en français et en anglais, où ajouter un projet revient à ajouter un objet dans un fichier.',
    },
    sectionsTitle: 'Comment ça marche',
    sections: [
      {
        title: 'Des lettres dessinées en code',
        text: [
          'Pas de police 3D ni de modèle importé : chaque lettre de PEDRO est un contour tracé point par point, avec des angles arrondis, puis extrudé avec un large biseau.',
          'En lissant les normales entre la face et le biseau, la lumière glisse sur la forme : c’est ce qui donne l’effet gonflé.',
        ],
        media: [
          {
            type: 'code',
            file: 'hero/letters.ts',
            caption: 'Extrusion et lissage d’une lettre',
            code: `const geo = new ExtrudeGeometry(shape, {
  depth: 0.12,
  bevelThickness: 0.15, // biseau épais = forme bombée
  bevelSize: 0.07,
  bevelSegments: 10,
});
// Normales lissées entre face et biseau : l'effet « gonflé ».
geo.deleteAttribute('normal');
const smooth = mergeVertices(geo, 1e-4);
smooth.computeVertexNormals();`,
          },
        ],
      },
      {
        title: 'Une physique de ballon',
        text: [
          'Chaque lettre est un corps physique : un ressort mou la ramène à sa place, un amortissement faible la laisse osciller. On peut l’attraper, la lancer, et les lettres se cognent entre elles.',
          'Le point saisi tire la lettre comme un fil : elle se balance au lieu de suivre la souris de façon rigide.',
        ],
        media: [
          {
            type: 'code',
            file: 'hero/BalloonLetters.ts',
            caption: 'Le ressort, appelé à chaque image',
            code: `const REST_K = 7;   // rappel vers la position de repos
const REST_C = 1.6; // amortissement

const acc = rest.clone().sub(b.pos).multiplyScalar(REST_K)
  .addScaledVector(b.vel, -REST_C);
b.vel.addScaledVector(acc, dt);
b.pos.addScaledVector(b.vel, dt);`,
          },
        ],
      },
      {
        title: 'Une page par projet',
        text: [
          'Tout le contenu vit dans un seul fichier de données typé. Un petit plugin Vite génère une vraie page HTML par projet au moment du build, avec son titre et sa description.',
          'Ajouter un projet, c’est ajouter un objet dans un tableau.',
        ],
        media: [
          {
            type: 'code',
            file: 'vite.config.ts',
            caption: 'Génération des pages au build',
            code: `closeBundle() {
  const html = readFileSync(template, 'utf8');
  for (const p of projects) {
    const page = html.replace(/<title>[^<]*<\\/title>/,
      \`<title>\${p.title} · Pedro Firmino</title>\`);
    mkdirSync(resolve(outDir, 'projets', p.id), { recursive: true });
    writeFileSync(resolve(outDir, 'projets', p.id, 'index.html'), page);
  }
}`,
          },
        ],
      },
    ],
    challenges: [
      {
        title: 'Des lettres coupées par la section suivante',
        problem: 'Quand on lançait une lettre vers le bas, elle disparaissait derrière la section « À propos » : la scène 3D s’arrêtait au bord du haut de page.',
        solution: 'La zone 3D déborde maintenant sous la section suivante, et la caméra est décalée (setViewOffset) pour que le cadrage du haut de page ne bouge pas. Les lettres passent par-dessus le fond, jamais devant les textes.',
      },
      {
        title: 'La 3D trop lourde sur mobile',
        problem: 'Sur téléphone, la 3D chargeait lentement et apportait peu : on ne lance pas des lettres au doigt aussi facilement qu’à la souris.',
        solution: 'Three.js n’est jamais chargé sur les écrans tactiles. Sur ordinateur, il est chargé à part (import dynamique), après le reste de la page.',
      },
      {
        title: 'Revenir exactement où on était',
        problem: 'En revenant d’une page projet, on retombait en haut de l’accueil, et il fallait tout redescendre.',
        solution: 'La position est enregistrée par rapport à la section en cours (sessionStorage), puis restaurée au retour, même si la hauteur de la page a changé entre-temps.',
      },
      {
        title: 'Des animations figées',
        problem: 'Certaines cartes restaient bloquées dans leur état de départ après leur animation d’entrée.',
        solution: 'Le CSS avait une transition sur la même propriété que GSAP. Désormais, GSAP rend la main au CSS une fois l’entrée terminée (clearProps), et les deux ne se marchent plus dessus.',
      },
    ],
    learned: [
      'Les bases de Three.js : géométries, normales, lumières, caméra.',
      'Simuler un comportement physique simple avec un ressort amorti, image par image.',
      'Écrire un petit plugin Vite pour générer des pages au build.',
      'Gérer deux langues sans bibliothèque, avec une traduction qui se superpose au contenu.',
    ],
    improve: [
      'Ajouter des tests automatiques sur les parties logiques (traductions, retour à la bonne position).',
      'Mesurer et améliorer les performances avec Lighthouse.',
      'Mettre le site en ligne avec un déploiement automatique à chaque push.',
    ],
    gallery: [
      { type: 'image', device: 'desktop', src: IMG + 'pf-hero-d.webp', alt: 'Le haut de page sur ordinateur : les lettres 3D de PEDRO', caption: 'Les lettres 3D, sur ordinateur' },
      { type: 'image', device: 'mobile', src: IMG + 'pf-hero-m.webp', alt: 'Le haut de page sur téléphone : Still learning. Still building.', caption: 'Sur téléphone, sans 3D' },
      { type: 'image', device: 'mobile', src: IMG + 'pf-about-m.webp', alt: 'La section À propos sur téléphone', caption: 'À propos, sur téléphone' },
      { type: 'image', device: 'desktop', src: IMG + 'pf-work-d.webp', alt: 'Le carrousel des projets', caption: 'Le carrousel des projets' },
      { type: 'image', device: 'desktop', src: IMG + 'pf-skills-d.webp', alt: 'Les outils, rangés par usage', caption: 'Les outils' },
      { type: 'image', device: 'desktop', src: IMG + 'pf-journey-d.webp', alt: 'La frise du parcours', caption: 'La frise du parcours' },
    ],
    links: [{ label: 'Voir mon GitHub', href: 'https://github.com/Pedrofrmndss' }],
  },
  {
    id: 'billetterie',
    title: 'Billetterie',
    category: 'dev',
    family: 'web',
    kind: 'Appli web PHP et MySQL',
    date: '2025',
    year: 2025,
    cover: IMG + 'cover-billet.webp',
    summary:
      'Une billetterie d’événements en PHP et MySQL : on crée un compte, on réserve des places, on annule. Un espace administrateur gère les événements.',
    role: 'Base de données et développement PHP',
    stack: ['PHP', 'MySQL', 'HTML', 'CSS'],
    facts: [
      { label: 'Cadre', value: 'SAÉ, BUT MMI 2e année' },
      { label: 'Durée', value: '45 heures' },
      { label: 'Année', value: '2025' },
    ],
    overview: {
      start: 'Pour une SAÉ de deuxième année, il fallait créer un site de réservation pour des événements, avec une vraie base de données et deux types de comptes.',
      did: 'J’ai conçu la base de données (événements, utilisateurs, réservations), puis développé tout le site en PHP : inscription, connexion, réservation, annulation et espace administrateur.',
      result: 'Une billetterie complète : un utilisateur réserve et annule ses places, un administrateur ajoute, modifie et supprime les événements.',
    },
    sectionsTitle: 'Comment ça marche',
    sections: [
      {
        title: 'Trois tables reliées',
        text: [
          'Les événements, les utilisateurs et les réservations sont trois tables MySQL. Une réservation relie un utilisateur à un événement, avec un nombre de places.',
          'Les clés étrangères gardent la base cohérente : si un événement est supprimé, ses réservations disparaissent avec lui.',
        ],
        media: [
          { type: 'image', src: IMG + 'billet-schema.webp', alt: 'Le schéma de la base : les tables événement, réservation et utilisateur, reliées par leurs clés', caption: 'Le schéma de la base' },
          {
            type: 'code',
            file: 'billetterie.sql',
            caption: 'Une réservation suit son événement',
            code: `ALTER TABLE sae203_reservation
  ADD CONSTRAINT fk_evenement
    FOREIGN KEY (id_evenement)
    REFERENCES sae203_evenement (id_evenement)
    ON DELETE CASCADE;`,
          },
        ],
      },
      {
        title: 'Des comptes protégés',
        text: [
          'Les mots de passe ne sont jamais enregistrés en clair : ils sont hachés avec password_hash à l’inscription, puis vérifiés avec password_verify à la connexion.',
          'Toutes les requêtes sont préparées avec PDO : ce que tape l’utilisateur ne peut pas modifier la requête SQL.',
        ],
        media: [
          {
            type: 'code',
            file: 'connexion.php',
            caption: 'La connexion (simplifiée)',
            code: `$sql = $db->prepare(
  'SELECT * FROM sae203_utilisateur WHERE email = ?'
);
$sql->execute([$email]);
$user = $sql->fetch();

if ($user && password_verify($mdp, $user['mdp'])) {
  $_SESSION['id'] = $user['id_utilisateur'];
  $_SESSION['role'] = $user['role'];
}`,
          },
        ],
      },
      {
        title: 'Réserver et annuler',
        text: [
          'À chaque réservation, les places disponibles baissent. À chaque annulation, elles reviennent.',
          'Une réservation ne peut être annulée que par la personne qui l’a faite : la requête vérifie à la fois la réservation et l’utilisateur connecté.',
        ],
        media: [
          {
            type: 'code',
            file: 'annuler.php',
            caption: 'Annuler une réservation (simplifié)',
            code: `// La réservation doit appartenir à l'utilisateur connecté
$sql = $db->prepare('SELECT * FROM sae203_reservation
  WHERE id_reservation = ? AND id_utilisateur = ?');
$sql->execute([$id, $_SESSION['id_utilisateur']]);

// On rend ses places à l'événement
$sql = $db->prepare('UPDATE sae203_evenement
  SET placesdispos = placesdispos + ? WHERE id_evenement = ?');`,
          },
        ],
      },
      {
        title: 'Deux rôles',
        text: [
          'Chaque compte a un rôle. Un administrateur a accès en plus à la gestion des événements : ajouter, modifier, supprimer.',
          'Chaque page d’administration vérifie le rôle avant tout, et renvoie les autres visiteurs vers l’accueil.',
        ],
      },
    ],
    gallery: [
      { type: 'image', device: 'desktop', src: IMG + 'billet-events-d.webp', alt: 'La liste des événements : cinéma en plein air, concerts, atelier, course', caption: 'Les événements à réserver' },
      { type: 'image', device: 'desktop', src: IMG + 'billet-admin-d.webp', alt: 'L’espace administrateur : le tableau des événements avec Supprimer et Modifier', caption: 'L’espace administrateur' },
    ],
    learned: [
      'Concevoir une base relationnelle : tables, clés primaires et clés étrangères.',
      'Les requêtes préparées avec PDO, contre les injections SQL.',
      'Hacher et vérifier un mot de passe en PHP.',
      'Gérer une session, et des droits différents selon le rôle.',
    ],
    improve: [
      'Réserver dans une transaction, pour que deux personnes ne puissent pas prendre les dernières places en même temps.',
      'Sortir les identifiants de la base du code, dans un fichier de configuration à part.',
      'Valider vraiment le compte avec le code envoyé par mail.',
      'Retravailler l’interface, restée très simple.',
    ],
    links: [],
  },
  {
    id: 'dashboard-meteo',
    title: 'Dashboard météo',
    category: 'dev',
    family: 'web',
    kind: 'Visualisation de données',
    date: '2025',
    year: 2025,
    cover: IMG + 'cover-meteo.webp',
    summary:
      'Un tableau de bord sur la météo des Côtes-d’Armor depuis 1950 : températures, pluie et carte des stations, à partir d’une base MySQL de 35 798 relevés.',
    role: 'Données, PHP et interface',
    stack: ['PHP', 'MySQL', 'JavaScript', 'Leaflet'],
    facts: [
      { label: 'Cadre', value: 'SAÉ, BUT MMI 2e année' },
      { label: 'Durée', value: '15 heures' },
      { label: 'Données', value: '35 798 relevés' },
    ],
    overview: {
      start: 'Pour une SAÉ de deuxième année, il fallait concevoir un dashboard météo pour le département des Côtes-d’Armor, à partir de vraies données stockées dans une base MySQL.',
      did: 'J’ai importé les relevés dans MySQL, écrit en PHP la récupération et le traitement des données, et conçu l’interface : deux graphiques, trois comparaisons et une carte des stations.',
      result: 'Un dashboard qui se lit en un coup d’œil, et qui montre l’évolution du climat du département sur plus de 70 ans.',
    },
    sectionsTitle: 'Comment ça marche',
    sections: [
      {
        title: 'Les données',
        text: [
          'La base contient 35 798 relevés mensuels, station par station, de 1950 à 2023 : pluie, températures, nombre de jours de pluie ou de chaleur.',
          'Chaque ligne correspond à un mois pour une station. Pour afficher une valeur par année sur tout le département, il faut donc regrouper les lignes.',
        ],
        media: [{ type: 'image', src: IMG + 'meteo-data-d.webp', alt: 'La table des relevés dans phpMyAdmin : une ligne par station et par mois', caption: 'Les relevés bruts, dans phpMyAdmin' }],
      },
      {
        title: 'Une question, un graphique',
        text: [
          'Avant de coder, j’ai listé ce qu’un visiteur veut savoir en premier : comment la chaleur évolue, comment la pluie évolue, et où se trouvent les stations.',
          'Chaque question a sa réponse visuelle : une courbe pour la température maximale moyenne, des barres pour le cumul de pluie, trois anneaux pour comparer les jours à 25 °C ou plus en 2002, 2012 et 2022, et une carte des stations.',
        ],
        media: [{ type: 'image', src: IMG + 'meteo-dashboard.webp', alt: 'Le dashboard en entier : courbe des températures, barres de pluie, trois anneaux et carte des stations', caption: 'Le dashboard en entier' }],
      },
      {
        title: 'Du serveur à l’écran',
        text: [
          'PHP interroge la base MySQL et prépare les données. La page les affiche ensuite en graphiques, et place chaque station sur une carte Leaflet.',
        ],
      },
    ],
    gallery: [
      { type: 'image', device: 'desktop', src: IMG + 'meteo-dashboard-d.webp', alt: 'Le dashboard : température, pluie, jours de chaleur et carte des stations', caption: 'Le dashboard' },
    ],
    learned: [
      'Explorer un vrai jeu de données de plusieurs dizaines de milliers de lignes.',
      'Choisir le bon type de graphique selon la question posée.',
      'Faire passer des données de PHP à JavaScript.',
      'Placer des points géographiques sur une carte avec Leaflet.',
    ],
    improve: [
      'Ajouter des filtres pour choisir une station ou une période.',
      'Garder les résultats en cache, pour ne pas refaire les calculs à chaque visite.',
    ],
    links: [],
  },
  {
    id: 'restaurant',
    title: 'Site de restaurant',
    category: 'dev',
    family: 'web',
    kind: 'Site vitrine',
    date: '2025',
    year: 2025,
    cover: IMG + 'cover-resto.webp',
    summary:
      'Le site vitrine d’un buffet asiatique du Petit-Quevilly : les plats, les horaires et les infos pratiques, dans une ambiance sombre et chaleureuse. Un projet personnel, non commandé.',
    role: 'Design et développement front-end',
    stack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    facts: [
      { label: 'Type', value: 'Projet personnel, non commandé' },
      { label: 'Année', value: '2025' },
    ],
    overview: {
      start: 'Pour m’entraîner sur un cas concret, j’ai imaginé le site d’un vrai restaurant près de chez moi, le buffet Au Bon Accueil. Le projet n’a aucun lien avec l’établissement : le logo et les photos lui appartiennent.',
      did: 'J’ai conçu et développé tout le site : la mise en page, la version mobile, les horaires, la galerie et les animations avec GSAP.',
      result: 'Un site qui met en avant les plats, les horaires et les infos pratiques, aussi lisible sur téléphone que sur ordinateur.',
    },
    sectionsTitle: 'Comment ça marche',
    sections: [
      {
        title: 'Des bandeaux sans fin',
        text: [
          'Les services et les moyens de paiement défilent en boucle. Le script double le contenu de chaque bandeau, puis calcule la durée de l’animation selon sa largeur : la vitesse reste la même quelle que soit la taille de l’écran.',
          'Un bandeau sur deux défile dans l’autre sens.',
        ],
        media: [
          { type: 'image', src: IMG + 'resto-services-d.webp', alt: 'Les services et les moyens de paiement en bandeaux, puis le bloc contact avec la carte', caption: 'Les bandeaux et le contact' },
          {
            type: 'code',
            file: 'app.js',
            caption: 'Un bandeau qui boucle (simplifié)',
            code: `// On double le contenu pour boucler sans trou
track.innerHTML += track.innerHTML;

// Même vitesse, quelle que soit la largeur
const duration = halfWidth / speed;
track.style.setProperty('--duration', \`\${duration}s\`);

// Un bandeau sur deux dans l'autre sens
if (i % 2 === 1) track.style.animationDirection = 'reverse';`,
          },
        ],
      },
      {
        title: 'Une galerie par pages',
        text: [
          'La galerie montre cinq photos à la fois. Les flèches passent à la page suivante ou précédente, et repartent du début une fois au bout.',
          'Les photos de la page apparaissent les unes après les autres, avec un léger décalage.',
        ],
        media: [
          {
            type: 'code',
            file: 'app.js',
            caption: 'Passer à la page suivante',
            code: `const perPage = 5;

btnNext.addEventListener('click', () => {
  // Au bout de la galerie, on repart de la première page
  const next = (currentPage + 1) * perPage < images.length
    ? currentPage + 1
    : 0;
  showPage(next);
});`,
          },
        ],
      },
      {
        title: 'Pensé pour le téléphone',
        text: [
          'Le menu du haut n’apparaît qu’une fois qu’on a commencé à défiler, pour laisser toute la place à la photo d’accueil. Sur téléphone, il se replie derrière un bouton.',
          'Les horaires sont présentés jour par jour, et les boutons d’appel et d’itinéraire restent à portée de pouce.',
        ],
      },
    ],
    gallery: [
      { type: 'image', device: 'desktop', src: IMG + 'resto-hero-d.webp', alt: 'L’accueil du site : le logo, le titre Buffet asiatique à volonté et les boutons', caption: 'L’accueil' },
      { type: 'image', device: 'mobile', src: IMG + 'resto-about-m.webp', alt: 'La présentation du restaurant sur téléphone', caption: 'La présentation, sur téléphone' },
      { type: 'image', device: 'mobile', src: IMG + 'resto-buffet-m.webp', alt: 'Le buffet sur téléphone, avec une photo du chef au wok', caption: 'Le buffet, sur téléphone' },
      { type: 'image', device: 'desktop', src: IMG + 'resto-hours-d.webp', alt: 'La présentation du restaurant et ses horaires d’ouverture', caption: 'La présentation et les horaires' },
      { type: 'image', device: 'desktop', src: IMG + 'resto-gallery-d.webp', alt: 'La galerie de photos du buffet', caption: 'La galerie' },
      { type: 'image', device: 'mobile', src: IMG + 'resto-gallery-m.webp', alt: 'La galerie sur téléphone', caption: 'La galerie, sur téléphone' },
      { type: 'image', device: 'desktop', src: IMG + 'resto-buffet-d.webp', alt: 'Le buffet : wok, sushis, plats chauds et desserts', caption: 'Le buffet' },
    ],
    learned: [
      'Animer une page avec GSAP et ScrollTrigger.',
      'Construire des bandeaux qui bouclent en dupliquant leur contenu.',
      'Adapter une mise en page riche aux petits écrans.',
    ],
    improve: [
      'Faire fonctionner le badge « Ouvert maintenant » : il doit lire les horaires du jour, mais une erreur JavaScript l’en empêche aujourd’hui.',
      'Remettre le site en ligne.',
      'Ajouter la carte des plats.',
    ],
    links: [],
  },
  {
    id: 'kiss',
    title: 'Can I get a kiss?',
    category: 'motion',
    kind: 'Typographie cinétique',
    date: 'Févr. 2026',
    year: 2026,
    cover: IMG + 'tyler.jpg',
    summary:
      'Typographie animée sur un morceau de Tyler, The Creator, calée sur le rythme syncopé plutôt que sur les paroles.',
    role: 'Direction artistique & animation',
    stack: ['After Effects', 'Illustrator', 'Expressions JS'],
    facts: [
      { label: 'Artiste', value: 'Tyler, The Creator feat. Kali Uchis' },
      { label: 'Durée', value: '0 min 25' },
    ],
    sections: [
      {
        title: 'L’intention',
        text: [
          'Traduire visuellement la nostalgie saturée de l’album Flower Boy. L’objectif : une typographie cinétique qui ne se contente pas de suivre les paroles, mais qui danse avec la rythmique syncopée de la batterie.',
          'Je voulais capturer la dualité de l’artiste : la douceur mélodique des cordes et du piano, et une énergie brute, le tout baigné dans une esthétique solaire et granuleuse.',
        ],
        media: [{ type: 'video', src: VID + 'tylerbonson.mp4', poster: IMG + 'tyler.jpg', caption: 'Séquence principale' }],
      },
      {
        title: 'Direction artistique',
        text: [
          'Pour respecter l’univers de l’album, une palette très saturée : l’orange brûlé du ciel, le jaune des tournesols, le vert profond.',
          'Un fort grain argentique est superposé à l’animation numérique. Il casse l’aspect trop propre du vectoriel et donne une sensation de souvenir d’été.',
        ],
        media: [{ type: 'image', src: IMG + 'tyler-the-creator.jpg', alt: 'Référence visuelle de l’univers de Flower Boy', caption: 'Référence : l’univers de Flower Boy' }],
      },
      {
        title: 'Le défi technique',
        text: [
          'La principale difficulté : synchroniser les éléments graphiques avec la musique. Plutôt que des images clés posées à la main, j’ai utilisé des expressions After Effects qui lisent les basses fréquences de la piste audio et pilotent les rebonds.',
          'Résultat : une réactivité organique que les images clés manuelles peinent à reproduire.',
        ],
      },
    ],
    links: [],
  },
  {
    id: 'freelance',
    title: 'Se lancer en freelance',
    category: 'motion',
    kind: 'Motion explicatif',
    date: 'Déc. 2025',
    year: 2025,
    cover: IMG + 'levoyagepaysage.jpg',
    summary:
      'Un motion design pédagogique qui démystifie le parcours freelance pour les étudiants et jeunes actifs.',
    role: 'Écriture, illustration, animation, son',
    stack: ['After Effects', 'Illustrator', 'Audition'],
    facts: [
      { label: 'Cadre', value: 'BUT MMI, 2e année' },
      { label: 'Durée', value: '2 min 53' },
    ],
    sections: [
      {
        title: 'Le contexte',
        text: [
          'En deuxième année de BUT MMI, nous devions réaliser un motion design de 4 minutes maximum, sur un thème choisi parmi plusieurs propositions. J’ai pris le freelance : un sujet qui m’intéresse directement pour mon avenir professionnel.',
          'Le public visé : des jeunes et des étudiants qui s’interrogent sur leur parcours.',
        ],
        media: [{ type: 'video', src: VID + 'PPP_versionfinale.mp4', poster: IMG + 'levoyagepaysage.jpg', caption: 'La vidéo complète' }],
      },
      {
        title: 'Le parti pris',
        text: [
          'Le contenu est structuré en étapes progressives, de la réflexion initiale jusqu’au lancement concret de l’activité.',
          'J’ai choisi le motion design parce qu’il permet de transmettre beaucoup d’informations de manière dynamique et engageante.',
        ],
      },
      {
        title: 'Direction artistique',
        text: [
          'Chaque partie est accompagnée d’illustrations simples et explicites, pour faciliter la compréhension et garder l’attention du spectateur jusqu’au bout.',
        ],
        media: [
          { type: 'image', src: IMG + 'free1.jpg', alt: 'Extrait du motion design sur le freelance', caption: 'Extrait' },
          { type: 'image', src: IMG + 'free2.jpg', alt: 'Extrait du motion design sur le freelance', caption: 'Extrait' },
        ],
      },
      {
        title: 'Le montage',
        text: [
          'Un rythme fluide et pédagogique, accordé au ton explicatif du projet. Les animations, transitions et effets servent à guider le regard et à souligner l’essentiel, sans surcharger l’information.',
        ],
      },
    ],
    links: [],
  },
  {
    id: 'lhotellier',
    title: 'Groupe Lhotellier',
    category: 'video',
    kind: 'Série vidéo recrutement',
    date: 'Nov. 2025',
    year: 2025,
    cover: IMG + 'lhotelier.jpg',
    summary:
      'Des portraits métiers pour une campagne de recrutement : savoir-faire, valeurs humaines et réalité du terrain.',
    role: 'Tournage, montage, motion',
    stack: ['Premiere Pro', 'After Effects'],
    facts: [
      { label: 'Client', value: 'Groupe Lhotellier' },
      { label: 'Format', value: '6 capsules courtes' },
      { label: 'Durée', value: '≈ 14 min au total' },
    ],
    sections: [
      {
        title: 'Le contexte',
        text: [
          'Six vidéos courtes pour une campagne de recrutement du Groupe Lhotellier. Chacune présente un métier du groupe et met en avant le savoir-faire, les valeurs humaines et l’environnement de travail.',
          'Trois d’entre elles sont présentées ici.',
        ],
      },
      {
        title: 'La structure',
        text: [
          'Chaque capsule suit trois temps : poser le contexte, varier les points de vue, conclure fort.',
          'Un format court, pensé pour le web et les réseaux sociaux, où l’on doit comprendre le métier en quelques secondes.',
        ],
      },
      {
        title: 'Trois portraits',
        text: [
          'Djilali et Lillian, chefs de chantier : le savoir-faire, l’engagement et la rigueur nécessaires au quotidien. Geoffrey, responsable Qualité Sécurité Environnement : la rigueur dans la mise en place des protocoles de sécurité.',
        ],
        media: [
          { type: 'youtube', id: 'vGsctNLL5h4', title: 'Djilali, chef de chantier', caption: 'Djilali, chef de chantier', vertical: true },
          { type: 'youtube', id: 'eZ8rmQpBkzY', title: 'Geoffrey, responsable QSE', caption: 'Geoffrey, responsable QSE', vertical: true },
          { type: 'youtube', id: 'qZgqanxvhRs', title: 'Lillian, chef de chantier', caption: 'Lillian, chef de chantier', vertical: true },
        ],
      },
    ],
    links: [],
  },
  {
    id: 'mss',
    title: 'Maison Sport Santé',
    category: 'video',
    kind: 'Interview multicam',
    date: 'Nov. 2025',
    year: 2025,
    cover: IMG + 'cyclcist-1920x1080.jpg',
    summary:
      'Une interview de l’équipe de la Maison Sport Santé d’Elbeuf pour montrer l’intérêt de l’activité physique.',
    role: 'Cadreur principal & monteur',
    stack: ['Premiere Pro', 'After Effects'],
    facts: [
      { label: 'Client', value: 'Maison Sport Santé d’Elbeuf' },
      { label: 'Cadre', value: 'BUT MMI, 2e année' },
      { label: 'Durée', value: '12 min 25' },
    ],
    sections: [
      {
        title: 'Le projet',
        text: [
          'Mettre en avant l’importance de l’activité physique et la mission de la structure, à travers les témoignages de son équipe.',
          'Un projet de BUT MMI 2 mené sur toute la chaîne de production, de la préparation à la post-production.',
        ],
        media: [{ type: 'youtube', id: 'eFxrhJmWqzo', title: 'Interview à la Maison Sport Santé d’Elbeuf', caption: 'L’interview complète' }],
      },
      {
        title: 'La production',
        text: [
          'Préparation des questions, puis captation multicaméra avec des valeurs de plan variées pour garder le rythme sur plus de douze minutes. Le son est enregistré à part, puis le tout est monté en multicam.',
        ],
        media: [
          { type: 'image', src: YT('eFxrhJmWqzo', 'hq1'), alt: 'Plan rapproché d’une intervenante pendant l’interview', caption: 'Plan rapproché', ratio: '16 / 9' },
          { type: 'image', src: YT('eFxrhJmWqzo', 'hq3'), alt: 'Plan large dans la salle de la Maison Sport Santé', caption: 'Plan large', ratio: '16 / 9' },
        ],
      },
      {
        title: 'L’habillage',
        text: [
          'Entre chaque question, des transitions typographiques animées aux couleurs du client donnent du rythme et rendent la vidéo identifiable.',
        ],
        media: [{ type: 'image', src: IMG + 'mss-2.png', alt: 'Une intervenante présentée par un bandeau titre aux couleurs de la Maison Sport Santé', caption: 'Bandeau de présentation aux couleurs du client' }],
      },
    ],
    links: [],
  },
];

// import.meta.env n'existe pas quand vite.config.ts lit ce fichier : on retombe sur '/'.
export const projectUrl = (id: string) => `${import.meta.env?.BASE_URL ?? '/'}projets/${id}/`;

// Logiciels et langages, par usage.
export interface SkillGroup {
  title: string;
  use: string;
  /** Petit mot écrit à la main sur le post-it de la carte. */
  note: string;
  items: { name: string }[];
}

const skillsFr: SkillGroup[] = [
  {
    title: 'Langages',
    use: 'pour écrire la logique',
    note: 'un peu de tout, et j’apprends encore',
    items: [{ name: 'JavaScript' }, { name: 'TypeScript' }, { name: 'PHP' }, { name: 'C#' }],
  },
  {
    title: 'Front-end',
    use: 'pour construire les interfaces',
    note: 'mon terrain de jeu préféré',
    items: [{ name: 'HTML' }, { name: 'CSS' }, { name: 'Three.js' }],
  },
  {
    title: 'Back-end',
    use: 'pour gérer les données',
    note: 'les données, ça s’apprend !',
    items: [{ name: 'Node.js' }, { name: 'MySQL' }, { name: 'WordPress' }],
  },
  {
    title: 'Outils',
    use: 'pour travailler proprement',
    note: 'git commit -m "ça marche ?"',
    items: [{ name: 'Git' }, { name: 'GitHub' }, { name: 'VS Code' }, { name: 'Unity' }, { name: 'Figma' }],
  },
];

// Parcours, dans l'ordre chronologique (frise horizontale).
export interface Step {
  year: string;
  /** Période affichée sur la carte (dates reprises de l'ancien site et des projets). */
  date: string;
  kind: string;
  title: string;
  place: string;
  /** Logo de l'établissement ou de l'entreprise ; vide = pictogramme code. */
  logo: string;
  text: string;
  points: string[];
  link?: { label: string; href: string };
}

const journeyFr: Step[] = [
  {
    year: '2024',
    date: '2024',
    kind: 'Origine',
    title: 'Baccalauréat STI2D',
    place: 'Lycée Blaise Pascal, Rouen',
    logo: IMG + 'bp.jpg',
    text: 'Sciences et technologies de l’industrie : mes premières bases en logique et en programmation.',
    points: ['Premières bases de logique de programmation', 'Culture technologique et numérique'],
  },
  {
    year: '2024',
    date: '2024 à 2027',
    kind: 'Formation · 3ᵉ année',
    title: 'BUT MMI',
    place: 'IUT de Rouen · site d’Elbeuf',
    logo: IMG + 'iut.png',
    text: 'Métiers du multimédia et de l’internet. C’est là que j’ai découvert le développement, et décidé d’en faire mon métier.',
    points: ['Front-end : HTML, CSS, JavaScript', 'Back-end : PHP, MySQL, WordPress'],
  },
  {
    year: '2025',
    date: 'Sept. à nov. 2025',
    kind: 'Projets clients',
    title: 'Premières commandes',
    place: 'Maison Sport Santé · Groupe Lhotellier',
    logo: IMG + 'logo-lhot.jpg',
    text: 'Des projets vidéo pour de vrais clients : un cahier des charges, des délais et des retours à intégrer.',
    points: ['Travail avec des clients réels', 'Respect des délais et des retours'],
  },
  {
    year: '2026',
    date: 'Avr. à juin 2026',
    kind: 'Stage',
    title: 'Technicien vidéo',
    place: 'France 3 Normandie',
    logo: IMG + 'f3.svg',
    text: 'Deux mois dans une rédaction régionale de télévision, au sein de l’équipe technique.',
    points: ['Régie et prise de vue', 'Assistance aux techniciens vidéo', 'Travail en équipe technique'],
  },
  {
    year: '2026',
    date: 'Aujourd’hui',
    kind: 'Et maintenant',
    title: 'Alternance en développement',
    place: 'La prochaine étape',
    logo: '',
    text: 'Je cherche une alternance pour progresser vers le métier de software engineer.',
    points: ['TypeScript et Three.js en cours d’apprentissage', 'Ce portfolio, codé de zéro'],
    link: { label: 'Voir le projet portfolio', href: projectUrl('portfolio') },
  },
];

// Langue : la version anglaise vient se poser sur le français, champ par champ.
// Un texte absent de data.en.ts reste simplement en français.
function overlay<T>(base: T, patch: unknown): T {
  if (patch === undefined || patch === null) return base;
  if (Array.isArray(base)) {
    const list = patch as unknown[];
    return base.map((item, i) => overlay(item, list[i])) as T;
  }
  if (base && typeof base === 'object') {
    const out = { ...base } as Record<string, unknown>;
    for (const [k, v] of Object.entries(patch as object)) out[k] = overlay(out[k], v);
    return out as T;
  }
  return patch as T;
}

const en = lang === 'en';
export const projects: Project[] = en ? projectsFr.map((p) => overlay(p, projectsEn[p.id])) : projectsFr;
export const skills: SkillGroup[] = en ? overlay(skillsFr, skillsEn) : skillsFr;
export const journey: Step[] = en ? overlay(journeyFr, journeyEn) : journeyFr;
