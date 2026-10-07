import { defineConfig, type Plugin } from 'vite';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { projects } from './src/data.ts';

// Le site est servi à la racine de son domaine (Netlify).
const base = '/';

const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Une vraie page par projet : /projets/<id>/ sert le gabarit projet.html.
// En dev via une réécriture d'URL, au build en copiant le gabarit avec le bon titre.
function projectPages(): Plugin {
  let outDir = 'dist';
  const ids = new Set(projects.map((p) => p.id));
  return {
    name: 'project-pages',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const id = req.url?.match(/^\/projets\/([\w-]+)\/?(?:\?.*)?$/)?.[1];
        if (id && ids.has(id)) req.url = '/projet.html';
        next();
      });
    },
    closeBundle() {
      const template = resolve(outDir, 'projet.html');
      const html = readFileSync(template, 'utf8');
      for (const p of projects) {
        const page = html
          .replace(/<title>[^<]*<\/title>/, `<title>${attr(p.title)} · Pedro Firmino</title>`)
          .replace(/(<meta name="description" content=")[^"]*/, `$1${attr(p.summary)}`);
        mkdirSync(resolve(outDir, 'projets', p.id), { recursive: true });
        writeFileSync(resolve(outDir, 'projets', p.id, 'index.html'), page);
      }
      rmSync(template);
    },
  };
}

export default defineConfig({
  base,
  plugins: [projectPages()],
  build: {
    target: 'es2022',
    // Three.js (~650 ko) n'est chargé qu'en différé, sur desktop.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: { main: resolve(import.meta.dirname, 'index.html'), projet: resolve(import.meta.dirname, 'projet.html') },
    },
  },
});
