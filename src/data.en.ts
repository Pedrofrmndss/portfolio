// Version anglaise du contenu de data.ts. Même structure, uniquement les textes :
// tout ce qui manque ici reste en français. Les listes se complètent dans l'ordre
// ({} ou null = élément inchangé).
import type { Project, SkillGroup, Step } from './data';

type Partial2<T> = T extends string | number | boolean
  ? T
  : T extends (infer U)[]
    ? (Partial2<U> | null)[]
    : { [K in keyof T]?: Partial2<T[K]> };

export const projectsEn: Record<string, Partial2<Project>> = {
  suri: {
    kind: 'Agency website',
    date: 'Jan 2026',
    summary:
      'The website of Suri Studio, the web agency I’m getting ready to launch: a showcase that has to prove technical know-how, not just show projects.',
    role: 'UI/UX design & front-end development',
    facts: [{ value: 'Entrepreneurial project' }, { label: 'Year' }, { label: 'Status', value: 'Launch in preparation' }],
    overview: {
      start: 'I’m preparing the launch of Suri Studio, a creative web agency. For an agency, the website is the first proof: it has to show what we can do within seconds.',
      did: 'I designed the identity and the interface, then built the whole front-end: HTML/CSS, navigation between pages without reloading, and animations with GSAP.',
      result: 'A fast, animated website, live at suristudio.fr, that works as a showcase until the agency launches.',
    },
    sectionsTitle: 'The project in detail',
    sections: [
      {
        title: 'The experience',
        text: [
          'I focused on polished micro-interactions, very fast asynchronous navigation and seamless page transitions.',
          'The goal: assert a premium, innovative identity from the very first seconds, without ever slowing the visit down.',
        ],
        media: [{ caption: 'Desktop interface, Projects page' }],
      },
      {
        title: 'Design system',
        text: [
          'A clean, readable look that leaves room for content and animation. Typography and spacing structure the reading, and contrast naturally guides attention.',
          'Rather than a complex design system: simple, consistent graphic rules, applied across the whole site for a clear and coherent experience.',
        ],
        media: [
          { alt: 'Presentation board of the Suri logo', caption: 'Logo presentation' },
          { alt: 'The Suri logo on black, white and green backgrounds', caption: 'Logo variations' },
        ],
      },
      {
        title: 'Performance & code',
        text: [
          'Built entirely in HTML, CSS and JavaScript, with GSAP orchestrating the animations and giving rhythm to the navigation.',
          'The point wasn’t to stack technologies, but to keep full control over rendering and performance. Every interaction stays smooth and light: optimized animations, controlled loading, clean structure.',
        ],
      },
    ],
    gallery: [
      { alt: 'suristudio.fr home page: the Suri logo and the Studio Web title', caption: 'Home' },
      { alt: 'The suristudio.fr home page on a phone', caption: 'Home on a phone' },
      { alt: 'The 7-day method on a phone', caption: 'The method, on a phone' },
      { alt: 'The method: from strategy to launch in 7 days', caption: 'The 7-day method' },
      { alt: 'The studio page, with an illustration', caption: 'The studio page' },
      { alt: 'The pricing page and its offers', caption: 'The pricing page' },
      { alt: 'The contact page and its quote form', caption: 'The contact page' },
    ],
    links: [{ label: 'Visit suristudio.fr' }],
  },
  'overwatch-memory': {
    kind: 'CSS web game',
    date: 'Oct 2026',
    summary:
      'A memory card game with the heroes of Overwatch, playable in the browser. The twist: flipping the cards and checking the pairs is done in CSS, not JavaScript.',
    role: 'Design & development',
    facts: [{ value: 'Personal project' }, { label: 'Year' }, { label: 'Status', value: 'Live' }],
    overview: {
      start: 'I wanted a project that pushes modern CSS to its limits, around one simple question: can a game’s logic run without JavaScript?',
      did: 'I designed and built the whole game: the rules, the card logic in CSS, the board shuffled in JavaScript, the timer, the records and the Overwatch-styled interface.',
      result: 'A game you can play online, in three files, with no framework and no build step. Flipping the cards and recognising the pairs is done entirely in CSS.',
    },
    sectionsTitle: 'How it works',
    sections: [
      {
        title: 'Three states per card',
        text: [
          'Each card holds three <details> elements, and only one is visible at a time: “pick” when it’s turned first, “miss” when it’s turned second and isn’t the pair, “found” when it is the pair.',
          'A <details> is open or closed, so it can keep the state of the game. The “pick” elements share the same name attribute, so only one can be open at a time, like an accordion.',
        ],
        media: [
          {
            caption: 'The CSS reads the game state',
            code: `/* A card is turned: every other card now offers "miss"… */
.board:has(.pick[open]) {
  --show-pick: none;
  --show-miss: block;
}

/* …and the turned card flips over */
.card:has(.pick[open]) {
  --flipped: 1;
}`,
          },
        ],
      },
      {
        title: 'Recognising a pair',
        text: [
          'Each card has a class pair-0, pair-1… When a card is turned, the CSS looks for its twin with :has() and the ~ selector, in both directions: the twin can sit before or after it in the grid.',
          'The twin then shows “found” instead of “miss”: click it, and it’s a pair.',
        ],
        media: [
          {
            caption: 'The rule for one pair (one per pair)',
            code: `/* The twin of the turned card offers "found" */
.pair-0:has(.pick[open]) ~ .pair-0,
.pair-0:has(~ .pair-0 .pick[open]) {
  --show-miss: none;
  --show-found: block;
}`,
          },
        ],
      },
      {
        title: 'What JavaScript does',
        text: [
          'JavaScript doesn’t handle clicks on the cards. It picks heroes at random, builds the shuffled board, starts the timer and listens to a single event: a “found” opening, to count pairs and detect the win.',
        ],
        media: [
          {
            caption: 'Setting up a game (simplified)',
            code: `function startGame(mode) {
  // Random heroes, two copies of each, then shuffle.
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
        title: 'A half-flipped card',
        problem: 'Clicking a second card very quickly while the first one was still flipping could leave a card stuck halfway.',
        solution: 'While a card flips, a CSS animation disables clicks on the whole board (pointer-events: none). No click can land at the wrong moment any more.',
      },
      {
        title: 'A sluggish board',
        problem: 'With many cards, every click made the browser recompute a huge amount of styles: about 160 ms per action, a clearly visible slowdown.',
        solution: 'Each card now has only three controls, and display goes through CSS variables (--show-pick, --show-miss, --show-found). Result: about 9 ms per action.',
      },
      {
        title: 'Play again without reloading',
        problem: 'The “Play again” button reloaded the page with a link. Opened from the computer, without a server, it showed the folder’s file list instead of the game.',
        solution: 'A new game is now started in JavaScript: the board is rebuilt and the timer reset, without leaving the page.',
      },
      {
        title: 'Playable without seeing the screen',
        problem: 'The cards are mostly visual: with a screen reader, there was no way to know which hero had just been turned.',
        solution: 'The card artwork is hidden from screen readers, each button is named (“Card 1”, “Card 2”…) and hidden text announces the hero, then “Not a match” or “It’s a match”.',
      },
    ],
    gallery: [
      { alt: 'Home: rank selection and records', caption: 'Home: rank selection and records' },
      { alt: 'The game’s home page on a phone', caption: 'Home on a phone' },
      { alt: 'A game on a phone', caption: 'A game on a phone' },
      { alt: 'A game in progress on the Silver rank, a few pairs found', caption: 'A game in progress, Silver rank' },
      { alt: 'The victory screen with the time and the record', caption: 'The victory screen' },
      { alt: 'The victory screen on a phone', caption: 'Victory on a phone' },
    ],
    learned: [
      'The :has() selector, which lets an element react to what happens in its children or its siblings.',
      'Using <details> and its name attribute as a small state machine, with no JavaScript.',
      'CSS variables as switches, and their effect on performance.',
      'The limits of CSS: each pair needs its own rules, which wouldn’t scale to a very large board.',
    ],
    improve: [
      'Add sounds: flip, pair, victory.',
      'A local two-player mode, taking turns.',
      'An online leaderboard, which would need a small server.',
    ],
    links: [{ label: 'Play' }, { label: 'View the code' }],
  },
  'insert-coin': {
    kind: 'Unity video game',
    date: '2026 to 2027',
    summary:
      'A first-person exploration and puzzle game, built as a team in Unity. I’m in charge of the first room: the abandoned arcade.',
    role: 'The abandoned room: assets, building it in Unity, coding the doors',
    facts: [{ label: 'Team', value: 'Team project' }, { label: 'Engine' }, { label: 'Platform' }, { label: 'Status', value: 'In development' }],
    overview: {
      start: 'For the “Gamification” course project in the third year of my multimedia bachelor’s, we have to create a Unity video game and all its communication, with a playable demo at the IUT open day.',
      did: 'I’m in charge of the abandoned room, the first room of the game: I look for the assets, build the whole room in Unity and code the doors.',
      result: 'The game is in development. The demo is planned for the IUT open day, on 30 January 2027.',
    },
    sectionsTitle: 'My part: the abandoned room',
    sections: [
      {
        title: 'The story',
        text: [
          'A 13-year-old video game fan explores an arcade abandoned for decades. A light at the end of an air duct leads him into a perfect copy of the room, but in its golden age: everything is switched on, everything shines.',
          'The door locks behind him, with a single message: “INSERT COIN TO ESCAPE”.',
        ],
      },
      {
        title: 'The abandoned room',
        text: [
          'This is where it all begins: an arcade frozen for decades, dark and covered in dust. It has to set the mood straight away, and contrast with the “golden age” room that follows.',
          'My job: find assets that fit this mood, build the whole room in Unity, and code the doors that stay locked or open depending on the player’s progress.',
        ],
      },
      {
        title: 'The puzzles planned for this room',
        text: [
          'At first, every door is locked. The staff room has a padlock: a poster gives the order of the last employees, and you have to find their photos, whose backs hide the digits of the code.',
          'In the staff room, a maintenance cabinet waits for every tool to be put back in its place. Once everything is tidied up, a compartment opens on a screwdriver, used to unscrew the air duct leading to the rest of the game.',
          'The rest of the game is still being discussed within the team.',
        ],
      },
    ],
  },
  portfolio: {
    title: 'This portfolio',
    date: 'Oct 2026',
    summary:
      'The site you’re reading: physics-driven 3D letters in Three.js, a lightweight mobile version, two languages and a generated page per project. No UI framework.',
    role: 'Concept, design, development',
    facts: [{ value: 'Personal project' }, { label: 'Year' }, { label: 'Languages', value: 'French, English' }],
    overview: {
      start: 'My old portfolio mostly showed video and motion design. I wanted a site showing that I’m turning towards development, and that is a coding project in itself.',
      did: 'Everything, from scratch: the design, the 3D letters drawn in code and their physics, the mobile version, the two languages, the navigation and accessibility.',
      result: 'A site with no UI framework, light on mobile, in French and English, where adding a project means adding an object to a file.',
    },
    sectionsTitle: 'How it works',
    sections: [
      {
        title: 'Letters drawn in code',
        text: [
          'No 3D font, no imported model: each letter of PEDRO is an outline traced point by point, with rounded corners, then extruded with a wide bevel.',
          'By smoothing the normals between the face and the bevel, light glides over the shape: that’s what makes it look inflated.',
        ],
        media: [
          {
            caption: 'Extruding and smoothing a letter',
            code: `const geo = new ExtrudeGeometry(shape, {
  depth: 0.12,
  bevelThickness: 0.15, // thick bevel = puffy shape
  bevelSize: 0.07,
  bevelSegments: 10,
});
// Normals smoothed between face and bevel: the "inflated" look.
geo.deleteAttribute('normal');
const smooth = mergeVertices(geo, 1e-4);
smooth.computeVertexNormals();`,
          },
        ],
      },
      {
        title: 'Balloon physics',
        text: [
          'Each letter is a physical body: a soft spring pulls it back into place, a weak damping lets it wobble. You can grab it, throw it, and the letters bump into each other.',
          'The grabbed point pulls the letter like a string: it swings instead of rigidly following the mouse.',
        ],
        media: [
          {
            caption: 'The spring, called every frame',
            code: `const REST_K = 7;   // pull back toward the rest position
const REST_C = 1.6; // damping

const acc = rest.clone().sub(b.pos).multiplyScalar(REST_K)
  .addScaledVector(b.vel, -REST_C);
b.vel.addScaledVector(acc, dt);
b.pos.addScaledVector(b.vel, dt);`,
          },
        ],
      },
      {
        title: 'One page per project',
        text: [
          'All the content lives in a single typed data file. A small Vite plugin generates a real HTML page per project at build time, with its own title and description.',
          'Adding a project means adding an object to an array.',
        ],
        media: [{ caption: 'Generating pages at build time' }],
      },
    ],
    challenges: [
      {
        title: 'Letters cut off by the next section',
        problem: 'When you threw a letter downwards, it disappeared behind the About section: the 3D scene stopped at the edge of the hero.',
        solution: 'The 3D area now extends under the next section, and the camera is offset (setViewOffset) so the hero framing doesn’t move. Letters fly over the background, never in front of the text.',
      },
      {
        title: '3D too heavy on mobile',
        problem: 'On phones, the 3D loaded slowly and added little: throwing letters with a finger isn’t as natural as with a mouse.',
        solution: 'Three.js is never loaded on touch screens. On desktop, it’s loaded separately (dynamic import), after the rest of the page.',
      },
      {
        title: 'Back to exactly where you were',
        problem: 'Coming back from a project page sent you to the top of the home page, and you had to scroll all the way down again.',
        solution: 'The position is saved relative to the current section (sessionStorage), then restored on return, even if the page height changed in the meantime.',
      },
      {
        title: 'Frozen animations',
        problem: 'Some cards stayed stuck in their starting state after their entrance animation.',
        solution: 'The CSS had a transition on the same property GSAP was animating. Now GSAP hands control back to the CSS once the entrance is done (clearProps), and they no longer clash.',
      },
    ],
    learned: [
      'The basics of Three.js: geometries, normals, lights, camera.',
      'Simulating simple physical behaviour with a damped spring, frame by frame.',
      'Writing a small Vite plugin to generate pages at build time.',
      'Handling two languages with no library, with a translation layered over the content.',
    ],
    improve: [
      'Add automated tests on the logic (translations, returning to the right position).',
      'Measure and improve performance with Lighthouse.',
      'Put the site online with automatic deployment on every push.',
    ],
    gallery: [
      { alt: 'The desktop hero: the 3D letters of PEDRO', caption: 'The 3D letters, on desktop' },
      { alt: 'The hero on a phone: Still learning. Still building.', caption: 'On a phone, no 3D' },
      { alt: 'The About section on a phone', caption: 'About, on a phone' },
      { alt: 'The projects carousel', caption: 'The projects carousel' },
      { alt: 'The tools, grouped by purpose', caption: 'The tools' },
      { alt: 'The journey timeline', caption: 'The journey timeline' },
    ],
    links: [{ label: 'See my GitHub' }],
  },
  billetterie: {
    title: 'Ticketing app',
    kind: 'PHP and MySQL web app',
    summary: 'An event ticketing site in PHP and MySQL: create an account, book seats, cancel. An admin area manages the events.',
    role: 'Database and PHP development',
    facts: [{ label: 'Context', value: 'Course project, bachelor’s year 2' }, { label: 'Duration', value: '45 hours' }, { label: 'Year' }],
    overview: {
      start: 'For a second year course project, we had to build a booking site for events, with a real database and two kinds of accounts.',
      did: 'I designed the database (events, users, bookings), then built the whole site in PHP: sign up, log in, booking, cancelling and the admin area.',
      result: 'A complete ticketing app: users book and cancel their seats, an admin adds, edits and deletes events.',
    },
    sectionsTitle: 'How it works',
    sections: [
      {
        title: 'Three linked tables',
        text: [
          'Events, users and bookings are three MySQL tables. A booking links a user to an event, with a number of seats.',
          'Foreign keys keep the database consistent: when an event is deleted, its bookings go with it.',
        ],
        media: [
          { alt: 'The database schema: the event, booking and user tables, linked by their keys', caption: 'The database schema' },
          { caption: 'A booking follows its event' },
        ],
      },
      {
        title: 'Protected accounts',
        text: [
          'Passwords are never stored in plain text: they are hashed with password_hash on sign up, then checked with password_verify on log in.',
          'Every query is prepared with PDO: what the user types cannot change the SQL query.',
        ],
        media: [
          { caption: 'Logging in (simplified)' },
        ],
      },
      {
        title: 'Booking and cancelling',
        text: [
          'Each booking lowers the available seats. Each cancellation gives them back.',
          'A booking can only be cancelled by the person who made it: the query checks both the booking and the logged in user.',
        ],
        media: [
          {
            caption: 'Cancelling a booking (simplified)',
            code: `// The booking must belong to the logged in user
$sql = $db->prepare('SELECT * FROM sae203_reservation
  WHERE id_reservation = ? AND id_utilisateur = ?');
$sql->execute([$id, $_SESSION['id_utilisateur']]);

// Give the seats back to the event
$sql = $db->prepare('UPDATE sae203_evenement
  SET placesdispos = placesdispos + ? WHERE id_evenement = ?');`,
          },
        ],
      },
      {
        title: 'Two roles',
        text: [
          'Each account has a role. An admin also gets the event management: add, edit, delete.',
          'Every admin page checks the role first, and sends other visitors back to the home page.',
        ],
      },
    ],
    gallery: [
      { alt: 'The list of events: open air cinema, concerts, a workshop, a race', caption: 'Events to book' },
      { alt: 'The admin area: the table of events with Delete and Edit', caption: 'The admin area' },
    ],
    learned: [
      'Designing a relational database: tables, primary keys and foreign keys.',
      'Prepared statements with PDO, against SQL injection.',
      'Hashing and checking a password in PHP.',
      'Handling a session, and different rights depending on the role.',
    ],
    improve: [
      'Book inside a transaction, so two people can never take the last seats at the same time.',
      'Move the database credentials out of the code, into a separate config file.',
      'Really validate the account with the code sent by email.',
      'Rework the interface, which stayed very basic.',
    ],
  },
  'dashboard-meteo': {
    title: 'Weather dashboard',
    kind: 'Data visualisation',
    summary: 'A dashboard on the weather in Côtes-d’Armor (Brittany) since 1950: temperature, rain and a map of the stations, from a MySQL database of 35,798 records.',
    role: 'Data, PHP and interface',
    facts: [{ label: 'Context', value: 'Course project, bachelor’s year 2' }, { label: 'Duration', value: '15 hours' }, { label: 'Data', value: '35,798 records' }],
    overview: {
      start: 'For a second year course project, we had to design a weather dashboard for the Côtes-d’Armor department, from real data stored in a MySQL database.',
      did: 'I imported the records into MySQL, wrote the PHP that fetches and processes the data, and designed the interface: two charts, three comparisons and a map of the stations.',
      result: 'A dashboard you can read at a glance, showing how the department’s climate changed over more than 70 years.',
    },
    sectionsTitle: 'How it works',
    sections: [
      {
        title: 'The data',
        text: [
          'The database holds 35,798 monthly records, station by station, from 1950 to 2023: rain, temperatures, number of rainy or hot days.',
          'Each row is one month for one station. To show one value per year for the whole department, the rows have to be grouped.',
        ],
        media: [{ alt: 'The records table in phpMyAdmin: one row per station and per month', caption: 'The raw records, in phpMyAdmin' }],
      },
      {
        title: 'One question, one chart',
        text: [
          'Before coding, I listed what a visitor wants to know first: is it hotter than before? Does it rain more? Where are the stations?',
          'Each question gets its own visual answer: a line for the average maximum temperature, bars for the total rainfall, three rings comparing days at 25 °C or more in 2002, 2012 and 2022, and a map of the stations.',
        ],
        media: [{ alt: 'The whole dashboard: temperature line, rain bars, three rings and the map of the stations', caption: 'The whole dashboard' }],
      },
      {
        title: 'From the server to the screen',
        text: ['PHP queries the MySQL database and prepares the data. The page then draws the charts, and places each station on a Leaflet map.'],
      },
    ],
    gallery: [
      { alt: 'The dashboard: temperature, rain, hot days and the map of the stations', caption: 'The dashboard' },
    ],
    learned: [
      'Exploring a real dataset of tens of thousands of rows.',
      'Picking the right kind of chart for each question.',
      'Passing data from PHP to JavaScript.',
      'Placing geographic points on a map with Leaflet.',
    ],
    improve: ['Add filters to pick a station or a period.', 'Cache the results, so the numbers are not recomputed on every visit.'],
  },
  restaurant: {
    title: 'Restaurant website',
    kind: 'Showcase website',
    summary: 'The showcase site of an Asian buffet near Rouen: the food, the opening hours and the practical info, in a dark and warm mood. A personal project, not commissioned.',
    role: 'Design and front-end development',
    facts: [{ label: 'Type', value: 'Personal project, not commissioned' }, { label: 'Year' }],
    overview: {
      start: 'To practise on a real case, I imagined the website of an actual restaurant near me, the Au Bon Accueil buffet. The project has no link with the restaurant: the logo and photos belong to it.',
      did: 'I designed and built the whole site: the layout, the mobile version, the opening hours, the gallery and the GSAP animations.',
      result: 'A site that puts the food, the opening hours and the practical info first, just as readable on a phone as on a computer.',
    },
    sectionsTitle: 'How it works',
    sections: [
      {
        title: 'Endless strips',
        text: [
          'The services and payment methods scroll in a loop. The script doubles the content of each strip, then works out the animation length from its width: the speed stays the same whatever the screen size.',
          'Every other strip scrolls the other way.',
        ],
        media: [
          { alt: 'The services and payment methods as scrolling strips, then the contact block with the map', caption: 'The strips and the contact block' },
          {
            caption: 'A looping strip (simplified)',
            code: `// Double the content to loop without a gap
track.innerHTML += track.innerHTML;

// Same speed, whatever the width
const duration = halfWidth / speed;
track.style.setProperty('--duration', \`\${duration}s\`);

// Every other strip goes the other way
if (i % 2 === 1) track.style.animationDirection = 'reverse';`,
          },
        ],
      },
      {
        title: 'A paged gallery',
        text: [
          'The gallery shows five photos at a time. The arrows go to the next or previous page, and start over at the end.',
          'The photos of each page appear one after the other, slightly staggered.',
        ],
        media: [
          {
            caption: 'Going to the next page',
            code: `const perPage = 5;

btnNext.addEventListener('click', () => {
  // At the end of the gallery, start over from the first page
  const next = (currentPage + 1) * perPage < images.length
    ? currentPage + 1
    : 0;
  showPage(next);
});`,
          },
        ],
      },
      {
        title: 'Built for phones',
        text: [
          'The top menu only shows up once you start scrolling, leaving the whole screen to the welcome photo. On phones, it folds behind a button.',
          'The opening hours are listed day by day, and the call and directions buttons stay within thumb’s reach.',
        ],
      },
    ],
    gallery: [
      { alt: 'The home of the site: the logo, the title and the buttons', caption: 'The home page' },
      { alt: 'The restaurant introduction on a phone', caption: 'The introduction, on a phone' },
      { alt: 'The buffet on a phone, with a photo of the chef at the wok', caption: 'The buffet, on a phone' },
      { alt: 'The restaurant introduction and its opening hours', caption: 'The introduction and opening hours' },
      { alt: 'The photo gallery of the buffet', caption: 'The gallery' },
      { alt: 'The gallery on a phone', caption: 'The gallery, on a phone' },
      { alt: 'The buffet: wok, sushi, hot dishes and desserts', caption: 'The buffet' },
    ],
    learned: [
      'Animating a page with GSAP and ScrollTrigger.',
      'Building strips that loop by duplicating their content.',
      'Adapting a rich layout to small screens.',
    ],
    improve: [
      'Make the “Open now” badge work: it should read today’s opening hours, but a JavaScript error currently stops it.',
      'Put the site back online.',
      'Add the menu of dishes.',
    ],
  },
  kiss: {
    kind: 'Kinetic typography',
    date: 'Feb 2026',
    summary:
      'Animated typography on a Tyler, The Creator track, timed to the syncopated rhythm rather than the lyrics.',
    role: 'Art direction & animation',
    stack: [null, null, 'JS expressions'],
    facts: [{ label: 'Artist' }, { label: 'Length', value: '0:25' }],
    sections: [
      {
        title: 'The intent',
        text: [
          'Visually translate the saturated nostalgia of the album Flower Boy. The goal: kinetic typography that doesn’t just follow the lyrics, but dances with the syncopated drum rhythm.',
          'I wanted to capture the artist’s duality: the melodic softness of the strings and piano, and a raw energy, all bathed in a sunny, grainy aesthetic.',
        ],
        media: [{ caption: 'Main sequence' }],
      },
      {
        title: 'Art direction',
        text: [
          'To respect the album’s world, a very saturated palette: the burnt orange of the sky, the yellow of the sunflowers, deep green.',
          'A heavy film grain is layered over the digital animation. It breaks the overly clean vector look and feels like a summer memory.',
        ],
        media: [{ alt: 'Visual reference from the Flower Boy universe', caption: 'Reference: the Flower Boy universe' }],
      },
      {
        title: 'The technical challenge',
        text: [
          'The main difficulty: syncing the graphics with the music. Rather than hand-placed keyframes, I used After Effects expressions that read the low frequencies of the audio track and drive the bounces.',
          'The result: an organic responsiveness that manual keyframes struggle to reproduce.',
        ],
      },
    ],
  },
  freelance: {
    title: 'Going freelance',
    kind: 'Explainer motion design',
    date: 'Dec 2025',
    summary: 'An educational motion design piece that demystifies the freelance path for students and young professionals.',
    role: 'Writing, illustration, animation, sound',
    facts: [{ label: 'Context', value: 'Bachelor’s, 2nd year' }, { label: 'Length', value: '2:53' }],
    sections: [
      {
        title: 'The context',
        text: [
          'In the second year of my multimedia bachelor’s, we had to make a motion design piece of up to 4 minutes, on a topic chosen from several options. I picked freelancing: a subject that matters directly to my professional future.',
          'The target audience: young people and students wondering about their path.',
        ],
        media: [{ caption: 'The full video' }],
      },
      {
        title: 'The approach',
        text: [
          'The content is structured in progressive steps, from the initial thinking to actually launching the business.',
          'I chose motion design because it can convey a lot of information in a dynamic, engaging way.',
        ],
      },
      {
        title: 'Art direction',
        text: [
          'Each part comes with simple, explicit illustrations, to make it easier to understand and keep the viewer’s attention to the end.',
        ],
        media: [
          { alt: 'Still from the freelance motion design', caption: 'Still' },
          { alt: 'Still from the freelance motion design', caption: 'Still' },
        ],
      },
      {
        title: 'The edit',
        text: [
          'A smooth, educational pace, in tune with the explanatory tone of the project. Animations, transitions and effects guide the eye and highlight what matters, without overloading the information.',
        ],
      },
    ],
  },
  lhotellier: {
    kind: 'Recruitment video series',
    date: 'Nov 2025',
    summary: 'Job portraits for a recruitment campaign: know-how, human values and life on the ground.',
    role: 'Filming, editing, motion',
    facts: [{}, { value: '6 short clips' }, { label: 'Length', value: '≈ 14 min in total' }],
    sections: [
      {
        title: 'The context',
        text: [
          'Six short videos for a Groupe Lhotellier recruitment campaign. Each one presents a job within the group and highlights know-how, human values and the work environment.',
          'Three of them are shown here.',
        ],
      },
      {
        title: 'The structure',
        text: [
          'Each clip follows three beats: set the context, vary the points of view, end strong.',
          'A short format, designed for the web and social media, where you need to understand the job in a few seconds.',
        ],
      },
      {
        title: 'Three portraits',
        text: [
          'Djilali and Lillian, site managers: the know-how, commitment and rigor needed every day. Geoffrey, Quality, Health, Safety & Environment manager: rigor in setting up safety protocols.',
        ],
        media: [
          { title: 'Djilali, site manager', caption: 'Djilali, site manager' },
          { title: 'Geoffrey, QHSE manager', caption: 'Geoffrey, QHSE manager' },
          { title: 'Lillian, site manager', caption: 'Lillian, site manager' },
        ],
      },
    ],
  },
  mss: {
    kind: 'Multicam interview',
    date: 'Nov 2025',
    summary: 'An interview with the team of the Maison Sport Santé in Elbeuf, showing the value of physical activity.',
    role: 'Lead camera operator & editor',
    facts: [{ value: 'Maison Sport Santé, Elbeuf' }, { label: 'Context', value: 'Bachelor’s, 2nd year' }, { label: 'Length', value: '12:25' }],
    sections: [
      {
        title: 'The project',
        text: [
          'Highlight the importance of physical activity and the organization’s mission, through the testimonies of its team.',
          'A project from the second year of my bachelor’s, covering the whole production chain, from preparation to post-production.',
        ],
        media: [{ title: 'Interview at Maison Sport Santé, Elbeuf', caption: 'The full interview' }],
      },
      {
        title: 'The production',
        text: [
          'Preparing the questions, then a multicamera shoot with varied shot sizes to keep the pace over more than twelve minutes. Sound is recorded separately, then everything is edited in multicam.',
        ],
        media: [
          { alt: 'Close-up of a speaker during the interview', caption: 'Close-up' },
          { alt: 'Wide shot of the Maison Sport Santé room', caption: 'Wide shot' },
        ],
      },
      {
        title: 'The graphics',
        text: [
          'Between each question, animated typographic transitions in the client’s colors give rhythm and make the video recognizable.',
        ],
        media: [
          {
            alt: 'A speaker introduced by a lower third in the Maison Sport Santé colors',
            caption: 'Lower third in the client’s colors',
          },
        ],
      },
    ],
  },
};

export const skillsEn: Partial2<SkillGroup>[] = [
  { title: 'Languages', use: 'to write the logic', note: 'a bit of everything, still learning' },
  { title: 'Front-end', use: 'to build interfaces', note: 'my favourite playground' },
  { title: 'Back-end', use: 'to handle data', note: 'data can be learned!' },
  { title: 'Tools', use: 'to work cleanly', note: 'git commit -m "it works?"' },
];

export const journeyEn: Partial2<Step>[] = [
  {
    kind: 'Origin',
    title: 'High school diploma (STI2D)',
    text: 'A science and technology track: my first foundations in logic and programming.',
    points: ['First foundations in programming logic', 'Technology and digital culture'],
  },
  {
    date: '2024 to 2027',
    kind: 'Degree · 3rd year',
    title: 'Multimedia bachelor’s',
    place: 'IUT de Rouen · Elbeuf campus',
    text: 'A bachelor’s degree in multimedia and internet professions. That’s where I discovered development, and decided to make it my career.',
    points: ['Front-end: HTML, CSS, JavaScript', 'Back-end: PHP, MySQL, WordPress'],
  },
  {
    date: 'Sept to Nov 2025',
    kind: 'Client projects',
    title: 'First commissions',
    text: 'Video projects for real clients: a brief, deadlines and feedback to take on board.',
    points: ['Working with real clients', 'Meeting deadlines and handling feedback'],
  },
  {
    date: 'Apr to Jun 2026',
    kind: 'Internship',
    title: 'Video technician',
    text: 'Two months in a regional TV newsroom, within the technical team.',
    points: ['Control room and camera work', 'Assisting the video technicians', 'Working in a technical team'],
  },
  {
    date: 'Today',
    kind: 'What’s next',
    title: 'Software development apprenticeship',
    place: 'The next step',
    text: 'I’m looking for a work-study position to grow into a software engineer.',
    points: ['Learning TypeScript and Three.js', 'This portfolio, built from scratch'],
    link: { label: 'See the portfolio project' },
  },
];
