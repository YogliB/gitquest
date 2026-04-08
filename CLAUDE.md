# CLAUDE.md — GitQuest

## Project Overview

**GitQuest** is a browser-based single-page application that transforms any GitHub repository's commit history into an immersive text adventure RPG. Users enter a GitHub repo URL, pick a narrative style (D&D fantasy, sci-fi, or horror), and experience the repo's history as an interactive story where commits become quests, bug fixes are battles, and contributors are heroes.

**Live deployment**: GitHub Pages (auto-deployed from `main` via `.github/workflows/deploy.yml`).

---

## Repository Structure

```
gitquest/
├── index.html              # Single HTML entry point; loads all JS/CSS modules
├── src/
│   ├── css/
│   │   ├── base.css        # Design tokens, shared layout, component styles
│   │   └── themes/
│   │       ├── dnd.css     # D&D fantasy theme overrides
│   │       ├── scifi.css   # Sci-fi cyberpunk theme overrides
│   │       └── horror.css  # Psychological horror theme overrides
│   └── js/
│       ├── app.js          # Main controller: routing, init, screen navigation
│       ├── story-engine.js # Game state machine, commit-to-scene logic
│       ├── ai-engine.js    # AI narrative generation (local WebLLM or remote API)
│       ├── github.js       # GitHub API integration, caching, rate-limit handling
│       ├── ui.js           # DOM rendering, typewriter effect, theme switching
│       ├── storage.js      # LocalStorage abstraction (saves, settings, cache)
│       └── music-engine.js # Deterministic algorithmic music via Tone.js
├── package.json            # Minimal: only defines dev/start scripts
├── README.md
└── .github/workflows/deploy.yml
```

---

## Tech Stack

- **Vanilla JavaScript (ES6 modules)** — no bundler, no transpilation, no framework
- **CSS3 custom properties** — theming and design tokens
- **Tone.js v14.8.49** — browser audio synthesis (loaded via CDN in `index.html`)
- **WebLLM** — optional in-browser LLM inference (dynamic import from `esm.run`)
- **GitHub API v3** — commit history and repo metadata
- **OpenAI-compatible API** — optional remote AI (Gemini, Ollama, etc.)

There is **no build step**. The app is served as static files.

---

## Development Workflow

### Running Locally

```bash
npm run dev    # or: npm start
```

Starts `npx serve . --single --listen 3000`. Open `http://localhost:3000`.

### No Tests or Linting

There are no configured test runners (Jest, Vitest) or linters (ESLint, Prettier). Maintain code quality manually. Do not add test infrastructure unless explicitly requested.

### Deployment

Push to `main` → GitHub Actions deploys automatically to GitHub Pages.

---

## Architecture & Data Flow

```
User Input (repo URL + style)
       ↓
github.js  →  fetch commits, analyze patterns, cache in localStorage
       ↓
story-engine.js  →  map commits to narrative scenes, manage game state
       ↓
ai-engine.js  →  generate scene text + choices (local LLM or remote API)
       ↓
music-engine.js  →  synthesize soundtrack deterministically from commit hashes
       ↓
ui.js  →  render scene, typewriter effect, stats, choices
       ↓
Player choice  →  back to story-engine.js
```

### Key Patterns

| Pattern | Usage |
|---|---|
| **Singleton exports** | Each module exports a single instance (`export const storyEngine = new StoryEngine()`) |
| **Callbacks** | `storyEngine.onSceneReady`, `onStatsUpdate`, `onQuestUpdate`, `onGameOver` for UI updates |
| **Custom events** | `github-ratelimit-update`, `skipTypewriter` dispatched on `document` |
| **Screen toggling** | Fullscreen `.screen` divs toggled with `.active` class |
| **Theme switching** | `.theme-dnd`, `.theme-scifi`, `.theme-horror` on root element |
| **URL routing** | Path format `/<owner>/<repo>/<style>` with `pushState` |

---

## Code Conventions

### Naming
- Variables and functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `GITHUB_API`, `STYLE_CONFIGS`)
- HTML ids and CSS classes: `kebab-case`
- File names: `kebab-case.js` / `kebab-case.css`

### JavaScript Style
- Comment section dividers use `───` (em-dashes)
- Config/mapping data lives in object literals at module top (e.g., `SYSTEM_PROMPTS`, `STYLE_CONFIGS`)
- Prefer early returns over deeply nested conditionals
- No TypeScript — plain JS throughout

### CSS Style
- All design tokens as CSS custom properties in `:root` in `base.css`
- Theme files only override `--color-*`, `--font-*`, and structural properties under `.theme-[name]`
- Component styles follow BEM-inspired naming (`.screen`, `.screen-content`, `.choice-btn`)

---

## Key Data Structures

### Commit object (from `github.js`)
```js
{
  sha, shortSha, message, subject, body,
  author: { name, login, avatar },
  date, hour, dayOfWeek, timestamp,
  stats: { additions, deletions, total }
}
```

### Scene object (from `ai-engine.js`)
```js
{
  narrative: string,           // story text rendered with typewriter effect
  choices: Array<{ label, text }>,  // A/B/C player choices
  isEpilogue?: boolean
}
```

### Game state (in `story-engine.js`)
```js
{
  repo, style, commits, analysis,
  commitIndex, chapter,
  hp, maxHp, xp, level,
  inventory, questLog,
  history: [{ narrative, choice, commitSha }],
  currentScene, startedAt, savedAt
}
```

---

## localStorage Keys

| Key pattern | Contents |
|---|---|
| `gitquest:settings` | User preferences (AI mode, API keys, last style) |
| `gitquest:save:<id>` | Serialized game state |
| `gitquest:history` | Recently played repos list |
| `gitquest:cache:<owner>/<repo>:info` | Cached repo metadata (1-hour TTL) |
| `gitquest:cache:<owner>/<repo>:commits` | Cached commit list (1-hour TTL) |

---

## GitHub API Integration (`github.js`)

- Fetches up to 80 commits per repo
- Caches API responses in localStorage for 1 hour
- Tracks rate-limit headers and emits `github-ratelimit-update` events
- Supports a GitHub Personal Access Token (stored in settings) for higher limits
- Token stored in `gitquest:settings.githubToken`

---

## AI Engine Modes (`ai-engine.js`)

| Mode | Description |
|---|---|
| `local` | WebLLM (in-browser LLM, no API key needed, large model download) |
| `api` | OpenAI-compatible REST API (Gemini, Ollama, OpenAI, etc.) |
| Fallback | Deterministic template-based generation when AI unavailable |

AI output is parsed by regex to extract narrative text and `[A]`/`[B]`/`[C]` labeled choices.
System prompts are style-specific and defined in `SYSTEM_PROMPTS` in `ai-engine.js`.

---

## Music Engine (`music-engine.js`)

- Fully deterministic: seeded RNG derived from commit SHA hashes
- No network calls — pure client-side synthesis via Tone.js Web Audio API
- Analyzes commit patterns (frequency, time-of-day, author count) to set BPM, scales, and intensity
- Each theme has distinct instrument configs (pluck for D&D, synth pads for sci-fi, dissonant strings for horror)

---

## Theme System

Three visual themes, each with a dedicated CSS file and a matching AI personality:

| Theme class | Tone | Key fonts |
|---|---|---|
| `.theme-dnd` | Medieval fantasy, parchment colors | Cinzel, MedievalSharp |
| `.theme-scifi` | Cyberpunk neon, tech UI | Orbitron, Share Tech Mono |
| `.theme-horror` | Dark, atmospheric, unsettling | Creepster, Special Elite |

---

## Branch & Commit Conventions

- **Default branch**: `main` (auto-deploys to GitHub Pages)
- **Feature branches**: `<type>/<description>-<suffix>` (e.g., `claude/add-claude-documentation-6ivZS`)
- **Commit message format**: `<type>: <description>` with types `feat`, `fix`, `refactor`, `docs`, `ci`

---

## What NOT to Do

- Do not introduce a bundler (webpack, vite, rollup) unless explicitly requested
- Do not add TypeScript, JSX, or a framework (React, Vue, etc.) unless explicitly requested
- Do not create test or lint configuration unless asked
- Do not add error handling for impossible scenarios — trust browser API guarantees
- Do not abstract one-off logic into shared utilities
- Do not add comments to code that is already self-evident
