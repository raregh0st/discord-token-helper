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

1. Open [`index.html`](index.html) (or the raw [`bookmarklet.txt`](bookmarklet.txt)).
2. Drag the **Get Discord Token** button to your bookmarks bar.
3. Go to <https://discord.com/app> and make sure you are logged in.
4. Click the bookmark.

An overlay appears with your token, and it is copied to your clipboard automatically.
Click the overlay to close it.

If dragging the button does not work, create a bookmark manually and paste the contents of
[`bookmarklet.txt`](bookmarklet.txt) as its URL.

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

The bookmarklet and `index.html` are generated from `bookmarklet.src.js` and `template.html`:

```bash
node build.js
```

## Files

| File | What it is |
| --- | --- |
| `console-snippet.js` | Commented console snippet (recommended) |
| `bookmarklet.src.js` | Source of the bookmarklet |
| `bookmarklet.txt` | Ready-to-use `javascript:` bookmark URL |
| `index.html` | Drag-and-drop page |
| `build.js` | Regenerates the two generated files |

## License

MIT — see [LICENSE](LICENSE).

Not affiliated with Discord Inc. "Discord" is a trademark of Discord Inc.
