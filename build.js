/**
 * build.js — turns the readable sources into the files you actually use.
 *
 * Run:  node build.js   (or: npm run build)
 *
 * INPUTS
 *   bookmarklet.src.js   readable bookmarklet source
 *   console-snippet.js   source of the console one-liner
 *   template.html        page layout with __BOOKMARKLET__ / __CONSOLE__ placeholders
 *
 * OUTPUTS
 *   bookmarklet.txt      single-line "javascript:..." URL for a bookmark
 *   index.html           drag-and-drop page with the URL-encoded bookmarklet
 *
 * No dependencies. Note that bookmarklet.src.js may only use BLOCK comments,
 * because line comments would survive the whitespace collapsing below and
 * comment out the rest of the one-liner.
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(root, f), s);

const src = read('bookmarklet.src.js')
  .replace(/\/\*[\s\S]*?\*\//g, ' ') // drop block comments
  .replace(/\s+/g, ' ')
  .trim();
const bookmarklet = 'javascript:' + src;
const encoded = 'javascript:' + encodeURIComponent(src);

write('bookmarklet.txt', bookmarklet + '\n');

const consoleOneLiner = (() => {
  const file = read('console-snippet.js');
  const match = file.match(/\(\(\)=>\{let w=window\.webpackChunkdiscord_app.*?\)\(\)/);
  if (!match) throw new Error('Could not find the console one-liner in console-snippet.js');
  return match[0];
})();

/** Replace a placeholder exactly once, and fail loudly if that is not the case. */
const fill = (template, key, value) => {
  const parts = template.split(key);
  if (parts.length !== 2) {
    throw new Error(`Expected exactly one ${key} in template.html, found ${parts.length - 1}`);
  }
  return parts.join(value);
};

const html = fill(
  fill(read('template.html'), '__BOOKMARKLET__', encoded),
  '__CONSOLE__',
  consoleOneLiner.replace(/&/g, '&amp;').replace(/</g, '&lt;')
);

write('index.html', html);

console.log('Build OK');
console.log('  bookmarklet.txt : %d chars', bookmarklet.length);
console.log('  index.html      : %d chars', fs.statSync(path.join(root, 'index.html')).size);
