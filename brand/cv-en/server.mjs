// Sert cv.html et, sous /site/, les fichiers du portfolio (photo, logos).
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SITE = resolve('C:/Users/pedro/Documents/portfolio');
const TYPES = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = p.startsWith('/site/') ? resolve(SITE, '.' + p.slice(5)) : join(here, 'cv.html');
  if ((p.startsWith('/site/') && !file.startsWith(SITE)) || !existsSync(file)) {
    res.statusCode = 404;
    return res.end();
  }
  res.setHeader('Content-Type', TYPES[extname(file)] ?? 'application/octet-stream');
  res.end(readFileSync(file));
}).listen(5197, () => console.log('http://localhost:5197'));
