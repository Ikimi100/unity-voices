# Unity Voices – choir landing page

Recruitment landing page for **Unity Voices**, the choir of Unity Worship Centre, Utako, Abuja.

Plain static site (HTML, CSS, JS) – no build step. Deploys to Vercel as-is.

## Edit the common things

| What | Where |
| --- | --- |
| WhatsApp group link | `index.html` (search for `chat.whatsapp.com`) – appears in several buttons and at the bottom in `window.UV_GROUP` |
| Phone number | `index.html` (search for `0803 786 9734` / `2348037869734`) and `assets/js/main.js` (`DIRECT`) |
| Open roles text | `index.html` (`.role-tab` buttons) and `assets/js/main.js` (`ROLES`) |
| Abuja areas | `.area` buttons and the `#f-area` select in `index.html` |
| Gallery photos | `assets/img/*-md.jpg` (grid) and `*-lg.jpg` (full view), listed in the `.masonry` block |

## Local preview

Open `index.html` in a browser, or run `npx serve .` in this folder.
