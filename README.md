# ☕ Krishna's Rizz Cafe

A cozy 8-bit / pixel-art charm game. You sit across from a stranger in a warm little
cafe and try to win them over with **wit, confidence, kindness and curiosity** — while
ordering them food for bonus vibe. (Psst: the onion bhaji is elite. 🧅)

Everything is one self-contained `index.html` — vanilla JS, `<canvas>`, and CSS. All
pixel art is authored in code (no image files), so it runs straight off GitHub Pages
with **zero build step**.

- **Offline mode (default):** works fully with no setup — a built-in heuristic "judge"
  scores your lines in character.
- **Live-AI mode (optional):** point it at a Cloudflare Worker to have OpenAI's
  `gpt-4o-mini` role-play your date. Both paths are always kept working.

Strictly PG / wholesome by design: crude, creepy or desperate lines get shut down
*in character* with a negative score.

---

## 1. Play it — GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages** → *Build and deployment* → **Source: Deploy from a branch**.
3. Select branch **`main`**, folder **`/ (root)`**, and **Save**.
4. Wait ~1 minute, then open `https://<your-username>.github.io/<repo>/`.

That's it — the game is fully playable in offline mode.

---

## 2. (Optional) Enable live AI via Cloudflare Worker

The Worker keeps your OpenAI API key server-side and proxies requests from the game.

```bash
# install the Cloudflare CLI if you don't have it
npm i -g wrangler

wrangler login                       # authenticate with Cloudflare
wrangler secret put OPENAI_API_KEY   # paste your OpenAI API key when prompted
wrangler deploy                      # deploy worker.js
```

`wrangler deploy` prints your Worker URL, e.g.
`https://rizz-cafe.<your-subdomain>.workers.dev`.

Then wire it into the game:

1. Open `index.html`, find this line near the top of the `<script>`:
   ```js
   const WORKER_URL = "";
   ```
2. Paste your Worker URL:
   ```js
   const WORKER_URL = "https://rizz-cafe.<your-subdomain>.workers.dev";
   ```
3. Commit & push:
   ```bash
   git add index.html
   git commit -m "chore: enable live AI worker"
   git push
   ```

The game auto-detects the URL and switches to live-AI mode. If any request fails, it
transparently falls back to the offline judge, so it never breaks.

---

## Files

| File            | Purpose                                                        |
|-----------------|---------------------------------------------------------------|
| `index.html`    | The entire game — self-contained, no build step.              |
| `worker.js`     | Cloudflare module Worker that proxies to the OpenAI API (`gpt-4o-mini`). |
| `wrangler.toml` | Worker config (`name`, `main`, `compatibility_date`).         |
| `README.md`     | This file.                                                    |

## How to play

- Type lines to charm your date; each line moves the **vibe meter** (0–100).
- **Twice per date** you order food for them — good picks add bonus vibe.
- **Max the meter to win.** Being crude/creepy tanks it instantly.
- After each date, **pass the device** — top the in-memory leaderboard.

Built for a school AI club. Keep it classy, keep it wholesome. 💛
