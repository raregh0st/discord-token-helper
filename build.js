/**
 * Tiny build script — no dependencies.
 *
 *   node build.js
 *
 * Reads bookmarklet.src.js and emits:
 *   bookmarklet.txt  — the "javascript:..." URL to paste into a bookmark
 *   index.html       — a drag-and-drop page with the encoded bookmarklet
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(root, f), s);

const src = read('bookmarklet.src.js').trim();
const bookmarklet = 'javascript:' + src.replace(/\s+/g, ' ');
const encoded = 'javascript:' + encodeURIComponent(src.replace(/\s+/g, ' '));

write('bookmarklet.txt', bookmarklet + '\n');

const consoleOneLiner = (() => {
  const file = read('console-snippet.js');
  const match = file.match(/\(\(\)=>\{let w=window\.webpackChunkdiscord_app.*?\)\(\)/);
  return match ? match[0] : '';
})();

write(
  'index.html',
  read('template.html')
    .replace('__BOOKMARKLET__', encoded)
    .replace('__CONSOLE__', consoleOneLiner.replace(/&/g, '&amp;').replace(/</g, '&lt;'))
);

console.log('Build OK');
console.log('  bookmarklet.txt : %d chars', bookmarklet.length);
console.log('  index.html      : %d chars', fs.statSync(path.join(root, 'index.html')).size);
