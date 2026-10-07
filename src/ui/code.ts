import { esc } from './effects';

// Coloration syntaxique minimale (TS/JS, PHP, mots-clés SQL en majuscules), ligne par ligne :
// commentaires, chaînes, nombres, mots-clés. Suffisant pour des extraits courts, sans dépendance.
const TOKENS =
  /(\/\/.*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`?)|\b(\d+(?:\.\d+)?(?:e-?\d+)?)\b|\b(const|let|function|return|for|of|in|new|import|export|from|type|default|if|else|satisfies|interface|await|async|true|false|null|SELECT|FROM|WHERE|AND|INSERT|INTO|VALUES|UPDATE|SET|DELETE|ALTER|TABLE|ADD|CONSTRAINT|FOREIGN|KEY|REFERENCES|ON|CASCADE)\b/g;

export function highlightLine(line: string) {
  let out = '';
  let last = 0;
  for (const m of line.matchAll(TOKENS)) {
    out += esc(line.slice(last, m.index));
    const cls = m[1] ? 't-com' : m[2] ? 't-str' : m[3] ? 't-num' : 't-kw';
    out += `<span class="${cls}">${esc(m[0])}</span>`;
    last = m.index! + m[0].length;
  }
  return out + esc(line.slice(last));
}

/** Lignes numérotées ; `lineHtml` permet d'injecter du HTML déjà préparé (valeurs vivantes). */
export function codeLines(code: string, lineHtml: (line: string) => string = highlightLine) {
  return code
    .split('\n')
    .map(
      (l, i) =>
        `<span class="line" style="--i:${i}"><span class="ln" aria-hidden="true">${i + 1}</span><code>${lineHtml(l) || ' '}</code></span>`,
    )
    .join('');
}

export function editorHtml(file: string, code: string, attrs = '') {
  return `<div class="editor">
    <div class="editor__bar">
      <span class="editor__dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="editor__tab">${esc(file)}</span>
    </div>
    <pre class="editor__code is-typed" tabindex="0" ${attrs}>${codeLines(code)}</pre>
  </div>`;
}
