# Discord Token Helper

Get the auth token of **the Discord account you are currently logged in as**, straight
from your own browser session. Two ways: a one-click bookmarklet, or a snippet you paste
into the DevTools console.

> Inspired by [MarvNC's gist](https://gist.github.com/MarvNC/e601f3603df22f36ebd3102c501116c6)
> and the classic `webpackChunkdiscord_app` one-liner, cleaned up so it actually works on
> current Discord builds.

---

## ⚠️ Read this first

- **Your token is your account.** Anyone who has it can log in as you and bypass your
  password and 2FA. Never paste it into a site, a bot, a "token checker", or a screenshot.
- **Self-bots are against Discord's Terms of Service.** Using a user token to automate an
  account can get it permanently terminated. This project is for education, debugging and
  security research on **your own** account.
- This only reads a token that is **already** in your browser. It cannot log in, cannot
  bypass 2FA, and cannot get a token for anybody else.

If a token ever leaks, change your password and enable 2FA — that invalidates all sessions.

---

## Method 1 — Bookmarklet (one click)

Create a bookmark and paste this **entire line** as its URL (it must stay on one line):

<!-- BOOKMARKLET:START -->
```javascript
javascript:(()=>{const show=m=>{const b=document.createElement('div');b.style.cssText='position:fixed;inset:10% 15%;z-index:2147483647;background:#0b0d12;color:#57f287;border:2px solid #5865f2;border-radius:10px;padding:24px;font:14px/1.5 monospace;white-space:pre-wrap;word-break:break-all;overflow:auto;box-shadow:0 10px 40px #000a;cursor:pointer';b.textContent=m;b.onclick=()=>b.remove();document.body.appendChild(b)};let t=null;try{const r=localStorage.getItem('token');if(r){try{t=JSON.parse(r)}catch{t=r}}}catch(e){}if(!t){try{window.webpackChunkdiscord_app.push([[Symbol()],{},q=>{for(const m of Object.values(q.c)){try{const e=m&&m.exports;if(!e)continue;const f=e.getToken||(e.default&&e.default.getToken);if(typeof f==='function'){t=f();break}}catch(_){}}}])}catch(e){}}if(t){try{navigator.clipboard.writeText(t)}catch(e){}show('Your token has been copied to your clipboard.\n\n'+t+'\n\n(click anywhere in this box to close)')}else{show('No token found.\n\nMake sure you are logged in at https://discord.com/app and try again.')}})()
```
<!-- BOOKMARKLET:END -->

Then open <https://discord.com/app>, make sure you are logged in, and click the bookmark.
An overlay shows your token and copies it to your clipboard — click it to close.

Prefer drag-and-drop? Open [`index.html`](index.html) and drag the **Get Discord Token**
button to your bookmarks bar instead.

## Method 2 — DevTools console

1. Open <https://discord.com/app> and log in.
2. Press `F12` (or `Ctrl`+`Shift`+`I`) and open the **Console** tab.
3. Paste this and press Enter:

```js
(()=>{let w=window.webpackChunkdiscord_app,t;w.push([[Symbol()],{},o=>{for(const m of Object.values(o.c)){try{const e=m&&m.exports;if(!e)continue;const f=e.getToken||(e.default&&e.default.getToken);if(typeof f==='function'){t=f();break}}catch{}}}]);return t})()
```

The full, commented version is in [`console-snippet.js`](console-snippet.js). It prints the
token, copies it to your clipboard, and returns it.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `undefined` / "No token found" | Make sure you are on `discord.com/app` **and logged in**, then reload the page and try again. Modules load lazily. |
| Nothing happens when clicking the bookmark | Some browsers strip `javascript:` from pasted URLs. Re-add it manually, or use the console method. |
| Token is wrapped in quotes | Discord stores it as JSON. The scripts already strip the quotes with `JSON.parse`. |
| It worked before, not anymore | Discord changes its internals regularly. Open an issue with your Discord build (web/desktop) and the error. |

The console is your friend: if the snippet returns `undefined`, check for red errors above
your input line.

---

## How it works

Discord is a webpack app. Webpack keeps a global chunk registry called
`webpackChunkdiscord_app`, and pushing a fake chunk into it makes webpack call your callback
with a `require` function:

```js
window.webpackChunkdiscord_app.push([
  [Symbol()], // fake chunk id
  {},         // no new modules
  (req) => {
    // req.c is the module cache: { [moduleId]: { exports } }
  },
]);
```

Discord's auth store exports `getToken()` / `setToken()`. The script walks the module cache,
finds the module that exposes `getToken` (sometimes as `exports.getToken`, sometimes as
`exports.default.getToken`), and calls it. As a fast path it first checks
`localStorage.getItem("token")`, where the web client keeps the same value as a JSON string.

The older bookmarklet that used an `<iframe>` + `document.write` broke because:

- it called `location.reload()` first, which unloads the page before the rest of the script
  can finish, and
- `document.write()` called after load wipes the whole Discord UI.

This version renders a normal element on top of the page instead, so nothing is destroyed.

---

## Build

[`index.html`](index.html) is generated from `template.html` + `bookmarklet.src.js`. The same
build also refreshes the bookmarklet command shown in Method 1, between the
`BOOKMARKLET:START` / `BOOKMARKLET:END` markers:

```bash
node build.js
```

## What each file does

### Use these

**`console-snippet.js`** — The recommended method. A single self-contained snippet
to paste into the DevTools console on `discord.com/app`. It first checks
`localStorage.token` (fast path), then walks Discord's webpack module cache for a
module exporting `getToken()` / `setToken()`. It logs the token, copies it with the
console's `copy()` helper, and returns it. Nothing is sent over the network. The
minified one-liner is included at the bottom of the file as a comment.

**The bookmarklet command itself** lives in this README, under
[Method 1](#method-1--bookmarklet-one-click). It is exactly `javascript:`
followed by the one-line body, with no comments or line breaks, so you can paste
it straight into a bookmark's URL field. There is no separate `.txt` file for it:
`build.js` writes the line into the README between the `BOOKMARKLET:START` and
`BOOKMARKLET:END` markers, so the page you are reading always shows the current
version.

### Edit these

**`bookmarklet.src.js`** — The readable source of the bookmarklet. Same two-step
lookup as the console snippet, but instead of logging it renders an overlay
`<div>` on the Discord page, copies the token to the clipboard, and closes when
clicked. It deliberately avoids `location.reload()` and `document.write()`, which
is what broke the older iframe bookmarklet. Edit it, then run `node build.js`.

**`template.html`** — The layout and wording for the drag-and-drop page: styles,
the warning box, and the step-by-step instructions. It contains two placeholders
that `build.js` fills in: `__BOOKMARKLET__` (the URL-encoded bookmarklet in the
button's `href`) and `__CONSOLE__` (the console one-liner shown in the code
block).

**`build.js`** — A dependency-free Node script that turns the sources into what
you see. It strips block comments from `bookmarklet.src.js`, collapses it to one
line, writes that line into the README markers, URL-encodes it for
`index.html`, extracts the one-liner out of `console-snippet.js`, and substitutes
both values into `template.html`. Run it with `node build.js` (or `npm run build`).

**`package.json`** — Metadata only: name, description, repository link, MIT
license, and the `build` / `test` shortcuts. There are no dependencies, so
`npm install` does nothing.

**`.gitignore`** — Keeps `node_modules/`, local `.env`/`*.local` overrides (so a
real token can never be committed by accident), and OS/editor junk out of git.

**`README.md`** — The document you are reading: usage, warnings, troubleshooting,
how the webpack trick works, and this file map.

### Generated — do not edit by hand

**`index.html`** — Produced by `build.js` from `template.html`. Open this file
locally in a browser, then drag the **Get Discord Token** button to your bookmarks
bar. The button's `href` is the URL-encoded bookmarklet, so clicking the bookmark
later runs it on Discord. Note: GitHub shows this file as source, not as a live
page, unless GitHub Pages is enabled.

**`LICENSE`** — The standard MIT license text (copyright 2026 rare_gh0st). It
grants permission to use, copy, and modify the code while disclaiming warranty.
It is not code and does not affect how the scripts behave.

## License

MIT — see [LICENSE](LICENSE).

Not affiliated with Discord Inc. "Discord" is a trademark of Discord Inc.
