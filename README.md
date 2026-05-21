# 🚀 Data & ML Engineer Portfolio

A terminal-inspired, AI-powered portfolio with live AI chat — built with Node.js + Express + Groq API.

---

## Features

- **Hero terminal** — animated typewriter sequence on load
- **Projects** — 6 showcase cards with metrics and tech tags
- **Skills** — JSON-syntax display + animated proficiency bars
- **AI Chat** — powered by Groq (`llama-3.3-70b-versatile`) — extremely fast responses
- **Contact** — links section
- Terminal / phosphor-green CRT aesthetic throughout

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in your API key
cp .env.example .env
# edit .env → set GROQ_API_KEY=gsk_...

# 3. Start dev server (with hot reload)
npm run dev

# Open http://localhost:3000
```

Get a free Groq API key at → https://console.groq.com

---

## Deploy to Railway

### Option A — GitHub (recommended)

1. Push this folder to a GitHub repo
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Select your repo — Railway auto-detects Node.js and runs `npm start`
4. In Railway dashboard → **Variables**, add:
   ```
   GROQ_API_KEY = gsk_xxxxxxxxxxxxxxxxxxxxxxxx
   ```
5. Your site goes live on a `*.railway.app` URL instantly

### Option B — Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway variables set GROQ_API_KEY=gsk_...
```

---

## Change the AI model

In `server.js`, update the `model` field to any Groq-supported model:

| Model                        | Speed     | Notes                        |
|------------------------------|-----------|------------------------------|
| `llama-3.3-70b-versatile`    | Fast      | Default — best quality       |
| `llama-3.1-8b-instant`       | Very fast | Lightweight, great for chat  |
| `mixtral-8x7b-32768`         | Fast      | Good for long contexts       |
| `gemma2-9b-it`               | Fast      | Google's Gemma 2             |

---

## Customise

| What                     | Where                                          |
|--------------------------|------------------------------------------------|
| Your name / role         | `public/index.html` — hero typewriter sequence |
| Stats (projects, years…) | `public/index.html` — `.stat-card` elements    |
| Projects                 | `public/index.html` — `.project-card` articles |
| Skills / proficiency     | `public/index.html` — `.skill-bar-row` items   |
| AI system prompt         | `server.js` — `systemMessage.content`          |
| Contact links            | `public/index.html` — `.contact-links` section |
| Colors / fonts           | `public/style.css` — `:root` CSS variables     |

---

## Stack

- **Runtime**: Node.js 18+
- **Server**: Express 4
- **AI**: Groq API (`llama-3.3-70b-versatile`)
- **Frontend**: Vanilla HTML/CSS/JS — no framework, no build step
- **Fonts**: JetBrains Mono + Space Grotesk (Google Fonts)
- **Deploy**: Railway

---

## Environment variables

| Variable       | Required | Description                               |
|----------------|----------|-------------------------------------------|
| `GROQ_API_KEY` | ✅ Yes   | Your Groq API key (free at console.groq.com) |
| `PORT`         | No       | Port (Railway sets this automatically)    |
