/**
 * console-snippet.js — the recommended method.
 *
 * WHAT THIS FILE IS
 *   A self-contained snippet you paste into the DevTools console on
 *   https://discord.com/app. It finds the auth token of the account you are
 *   logged in as, logs it, copies it, and returns it. Nothing is sent anywhere.
 *
 * Get the auth token of the Discord account you are currently logged in as.
 *
 * HOW TO USE
 *   1. Open https://discord.com/app and log in.
 *   2. Open DevTools (F12) -> Console.
 *   3. Paste this whole file and press Enter.
 *   4. The token is printed, copied to your clipboard and returned.
 *
 * Works in current desktop/web Discord builds. If it returns undefined,
 * reload the page and run it again (modules are loaded lazily).
 *
 * This only works for YOUR OWN session. It cannot get a token for any
 * other account, and it does not bypass login or 2FA.
 */
(() => {
  let token = null;

  // 1) Fast path: Discord keeps the token in localStorage under "token".
  //    The stored value is JSON, so it usually comes back wrapped in quotes.
  try {
    const raw = localStorage.getItem('token');
    if (raw) {
      try {
        token = JSON.parse(raw); // '"abc.def.ghi"' -> 'abc.def.ghi'
      } catch {
        token = raw;
      }
    }
  } catch {
    /* localStorage can be blocked, ignore and fall through */
  }

  // 2) Fallback: read it straight out of Discord's webpack module cache.
  if (!token) {
    try {
      // webpackChunkdiscord_app is Discord's webpack chunk registry.
      // Pushing a fake chunk makes webpack hand us a require() function.
      window.webpackChunkdiscord_app.push([
        [Symbol()],
        {},
        (req) => {
          for (const mod of Object.values(req.c)) {
            try {
              const exp = mod && mod.exports;
              if (!exp) continue;

              // Different builds export the token helpers in different shapes.
              const getToken =
                typeof exp.getToken === 'function'
                  ? exp.getToken
                  : typeof exp.default?.getToken === 'function'
                    ? exp.default.getToken
                    : null;

              if (getToken) {
                token = getToken();
                break;
              }
            } catch {
              /* some modules throw when touched, skip them */
            }
          }
        },
      ]);
    } catch {
      /* not on Discord, or the registry was renamed */
    }
  }

  if (!token) {
    console.warn(
      'Token not found. Make sure you are logged in at https://discord.com/app, then reload and try again.'
    );
    return undefined;
  }

  console.log(token);
  try {
    copy(token); // Chrome/Edge console helper
    console.log('(copied to clipboard)');
  } catch {
    /* copy() is not available in every browser */
  }

  return token;
})();

/*
 * One-line version (same logic, convenient for the console):
 *
 * (()=>{let w=window.webpackChunkdiscord_app,t;w.push([[Symbol()],{},o=>{for(const m of Object.values(o.c)){try{const e=m&&m.exports;if(!e)continue;const f=e.getToken||(e.default&&e.default.getToken);if(typeof f==='function'){t=f();break}}catch{}}}]);return t})()
 */
