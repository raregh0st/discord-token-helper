# Discord Token Helper

**by [raregh0st](https://github.com/raregh0st)** · **[Open the live page →](https://raregh0st.github.io/discord-token-helper/)**

Get the auth token of **the Discord account you are already logged in as**, straight from your
own browser session. There are two ways to do it: a one-click bookmarklet, or a snippet you
paste into the DevTools console.

Everything lives in one file — [`index.html`](./index.html): the interface, the instructions,
and both commands. No install, no build step, no dependencies.

> Inspired by [MarvNC's gist](https://gist.github.com/MarvNC/e601f3603df22f36ebd3102c501116c6)
> and the classic `webpackChunkdiscord_app` one-liner, cleaned up so it actually works on current
> Discord builds.

---

## ⚠️ Read this first

- **Your token is your account.** Anyone who has it can log in as you and bypass your password
  and 2FA. Never paste it into a site, a bot, a "token checker", or a screenshot.
- **Self-bots are against Discord's Terms of Service.** Using a user token to automate an
  account can get it permanently terminated. This project is for education, debugging and
  security research on **your own** account.
- This only reads a token that is **already** in your browser. It cannot log in, cannot bypass
  2FA, and cannot get a token for anybody else.

If a token ever leaks, change your password and enable 2FA — that invalidates all sessions.

---

## How to use `index.html`

`index.html` **is** the whole tool. Use it in either of these two ways:

**Option A — the hosted page (easiest).** Open
<https://raregh0st.github.io/discord-token-helper/>. Nothing to download.

**Option B — locally.** Download or clone the repo and double-click `index.html`. It opens in
your browser and works offline, because the only JavaScript on the page builds the bookmarklet
link and powers the Copy buttons. Opening the file directly is fine.

Once the page is open, pick one of the two methods below.

### 1. Bookmarklet — the purple button

1. **Drag** the purple **Get Discord Token** button onto your bookmarks bar.
2. Go to <https://discord.com/app> and make sure you are logged in.
3. Click the bookmark. A dark overlay shows your token and it is copied to your clipboard.
   Click the overlay to close it.

Do not want to drag? Click **Copy** on the code block, create a bookmark manually, and paste the
line as its URL. It must stay on one line.

### 2. Console snippet — the second code block

1. Open <https://discord.com/app> and log in.
2. Press `F12` (or `Ctrl`+`Shift`+`I`) and open the **Console** tab.
3. Click **Copy** next to the second code block (or select the text manually), paste it into the
   console, and press Enter.
4. The token is printed in the console and copied to your clipboard.

### What the page's own JavaScript does

Only two things: it turns the text in the bookmarklet code block into a draggable `javascript:`
link, and it powers the two **Copy** buttons. It never reads, stores or sends your token. The
token work happens entirely on `discord.com` when you click the bookmark or run the snippet.

---

## Method 1 — Bookmarklet

The full command, for reference or for pasting into a bookmark manually:

```javascript
javascript:(()=>{const show=m=>{const b=document.createElement('div');b.style.cssText='position:fixed;inset:10% 15%;z-index:2147483647;background:#0b0d12;color:#57f287;border:2px solid #5865f2;border-radius:10px;padding:24px;font:14px/1.5 monospace;white-space:pre-wrap;word-break:break-all;overflow:auto;box-shadow:0 10px 40px #000a;cursor:pointer';b.textContent=m;b.onclick=()=>b.remove();document.body.appendChild(b)};let t=null;try{const r=localStorage.getItem('token');if(r){try{t=JSON.parse(r)}catch{t=r}}}catch(e){}if(!t){try{window.webpackChunkdiscord_app.push([[Symbol()],{},q=>{for(const m of Object.values(q.c)){try{const e=m&&m.exports;if(!e)continue;const f=e.getToken||(e.default&&e.default.getToken);if(typeof f==='function'){t=f();break}}catch(_){}}}])}catch(e){}}if(t){try{navigator.clipboard.writeText(t)}catch(e){}show('Your token has been copied to your clipboard.\n\n'+t+'\n\n(click anywhere in this box to close)\n\n- github.com/raregh0st')}else{show('No token found.\n\nMake sure you are logged in at https://discord.com/app and try again.\n\n- github.com/raregh0st')}})()
```

## Method 2 — DevTools console

The full command, for pasting into the DevTools console on `discord.com/app`:

```js
/* raregh0st */ (()=>{let w=window.webpackChunkdiscord_app,t;w.push([[Symbol()],{},o=>{for(const m of Object.values(o.c)){try{const e=m&&m.exports;if(!e)continue;const f=e.getToken||(e.default&&e.default.getToken);if(typeof f==='function'){t=f();break}}catch{}}}]);return t})()
```

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `undefined` / "No token found" | Make sure you are on `discord.com/app` **and logged in**, then reload the page and try again. Modules load lazily. |
| Nothing happens when clicking the bookmark | Some browsers strip `javascript:` from pasted URLs. Re-add it manually, or use the console method. |
| Token is wrapped in quotes | Discord stores it as JSON. Both commands strip the quotes with `JSON.parse`. |
| It worked before, not anymore | Discord changes its internals regularly. Open an issue with your Discord build (web/desktop) and the error. |

The console is your friend: if the snippet returns `undefined`, check for red errors above your
input line.

---

## How it works

Discord is a webpack app. Webpack keeps a global chunk registry called
`webpackChunkdiscord_app`, and pushing a fake chunk into it makes webpack call your callback with
a `require` function:

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

- it called `location.reload()` first, which unloads the page before the rest of the script can
  finish, and
- `document.write()` called after load wipes the whole Discord UI.

This version renders a normal element on top of the page instead, so nothing is destroyed.

---

## What each file does

**`index.html`** — The entire tool in one self-contained file (about 17 KB): page layout and
styles, the warning, the draggable bookmarklet button, both commands with Copy buttons,
troubleshooting, the explanation above, and your GitHub branding. There is no build step — the
JavaScript inside builds the drag link from the code block and wires up the Copy buttons.

**`README.md`** — This guide. It is not used by the page; it exists so the repository is
readable on GitHub.

**`LICENSE`** — Standard MIT license text (copyright 2026 raregh0st). Not code; it does not
affect how the scripts behave.

---

## License

MIT — see [LICENSE](LICENSE).

Not affiliated with Discord Inc. "Discord" is a trademark of Discord Inc.

---

<sub>Made by [raregh0st](https://github.com/raregh0st) · [raregh0st.github.io/discord-token-helper](https://raregh0st.github.io/discord-token-helper/)</sub>
