# Discord Token Helper

**by [raregh0st](https://github.com/raregh0st)** · **[Open the live page →](https://raregh0st.github.io/discord-token-helper/)**

Get the auth token of **the Discord account you are already logged in as**, straight from your
own browser session. There are two ways to do it: a one-click bookmarklet, or a snippet you
paste into the DevTools console.

Everything lives in one file — [`index.html`](./index.html): the interface, the instructions,
and both commands. No install, no build step, no dependencies.

<!-- raregh0st -->

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

<p align="right"><sub>raregh0st</sub></p>

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

<p align="right"><sub>raregh0st</sub></p>

---

## Method 1 — Bookmarklet

The full command, for reference or for pasting into a bookmark manually:

```javascript
javascript:(()=>{const n=v=>typeof v==='string'?v:(v&&(v.token||v.value||v.accessToken||v.access_token||v.authToken))||'';const cp=v=>{try{navigator.clipboard.writeText(v).catch(()=>{})}catch(e){const a=document.createElement('textarea');a.value=v;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(_){}a.remove()}};const show=m=>{const b=document.createElement('div');b.style.cssText='position:fixed;inset:10% 15%;z-index:2147483647;background:#0b0d12;color:#57f287;border:2px solid #5865f2;border-radius:10px;padding:24px;font:14px/1.5 monospace;white-space:pre-wrap;word-break:break-all;overflow:auto;box-shadow:0 10px 40px #000a;cursor:pointer';b.textContent=m;b.onclick=()=>b.remove();document.body.appendChild(b)};let t='';try{const r=localStorage.getItem('token');if(r){try{t=n(JSON.parse(r))}catch(e){t=n(r)}}}catch(e){}if(!t){try{window.webpackChunkdiscord_app.push([[Symbol()],{},q=>{const mods=Object.values(q.c);const pick=s=>{for(const m of mods){try{const e=m&&m.exports;if(!e)continue;const x=s?(e.setToken?e:e.default&&e.default.setToken?e.default:null):e;const f=x&&x.getToken;if(typeof f==='function'){const v=n(f());if(v)return v}}catch(_){}}return''};t=pick(true)||pick(false)}])}catch(e){}}if(t){cp(t);show('Your token has been copied to your clipboard.\n\n'+t+'\n\n(click anywhere in this box to close)\n\n- github.com/raregh0st')}else{show('No token found.\n\nMake sure you are logged in at https://discord.com/app and try again.\n\n- github.com/raregh0st')}})()
```

<p align="right"><sub>raregh0st</sub></p>

## Method 2 — DevTools console

The full command, for pasting into the DevTools console on `discord.com/app`:

```js
/* raregh0st */ (()=>{const n=v=>typeof v==='string'?v:(v&&(v.token||v.value||v.accessToken||v.access_token||v.authToken))||'';let w=window.webpackChunkdiscord_app,t;w.push([[Symbol()],{},o=>{const mods=Object.values(o.c);const pick=s=>{for(const m of mods){try{const e=m&&m.exports;if(!e)continue;const x=s?(e.setToken?e:e.default&&e.default.setToken?e.default:null):e;const f=x&&x.getToken;if(typeof f==='function'){const v=n(f());if(v)return v}}catch{}}return''};t=pick(true)||pick(false)}]);return t})()
```

<p align="right"><sub>raregh0st</sub></p>

---

## On a phone

Bookmarklets work in **iPhone Safari**, but **Chrome for Android blocks `javascript:` URLs**. Use one
of these instead.

### iPhone / iPad — Safari (works)

1. On the page, tap **Copy** under the bookmarklet code.
2. In Safari, bookmark any page: **Share → Add Bookmark**.
3. Open **Bookmarks → Edit**, tap the new bookmark, replace its address with the copied code, and
   name it *Discord Token*.
4. Open <https://discord.com/app>, log in, switch to the desktop site
   (**aA → Request Desktop Website**), then tap the bookmark.

### Android — Firefox

Chrome for Android will not run the bookmarklet. Install Firefox and sync the bookmark from a Firefox
account, or add it in Firefox's bookmark manager with the copied code as the URL. Then open
<https://discord.com/app> in Firefox (desktop site) and open the bookmark.

### No bookmarklets — remote debugging

- **Android:** enable USB debugging, connect to a computer, open `chrome://inspect` in desktop
  Chrome, open `discord.com/app` on the phone, and run the console snippet in the remote DevTools
  console.
- **iPhone:** enable **Settings → Safari → Advanced → Web Inspector**, connect to a Mac, and use
  **Safari → Develop** to run the snippet.

**Simplest option:** a token belongs to the account, not the device. If you have a computer, log in
there once, grab the token with Method 1 or 2, and use it wherever you need it. It stays valid until
you log out, change your password, or change 2FA.

<p align="right"><sub>raregh0st</sub></p>

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

<p align="right"><sub>raregh0st</sub></p>

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
`exports.default.getToken`), and calls it. The result is normalized to a string: if
`getToken()` returns an object, its `token` / `value` / `accessToken` field is used, so you get
the token itself and never `[object Object]`. As a fast path it first checks
`localStorage.getItem("token")`, where the web client keeps the same value as a JSON string.

The older bookmarklet that used an `<iframe>` + `document.write` broke because:

- it called `location.reload()` first, which unloads the page before the rest of the script can
  finish, and
- `document.write()` called after load wipes the whole Discord UI.

This version renders a normal element on top of the page instead, so nothing is destroyed.

<p align="right"><sub>raregh0st</sub></p>

---

## License

MIT — see [LICENSE](LICENSE).

Not affiliated with Discord Inc. "Discord" is a trademark of Discord Inc.

---

<sub>Made by [raregh0st](https://github.com/raregh0st) · [raregh0st.github.io/discord-token-helper](https://raregh0st.github.io/discord-token-helper/)</sub>
