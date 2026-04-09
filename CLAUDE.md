# CLAUDE.md — GitQuest

## Project Overview

**GitQuest** is a browser-based single-page application that transforms any GitHub repository's commit history into an immersive text adventure RPG. Users enter a GitHub repo URL, pick a narrative style (D&D fantasy, sci-fi, or horror), and experience the repo's history as an interactive story where commits become quests, bug fixes are battles, and contributors are heroes.

**Live deployment**: GitHub Pages (auto-deployed from `main` via `.github/workflows/deploy.yml`).

---

## Repository Structure

```
gitquest/
├── index.html                     # HTML entry; preloads fonts, applies theme before React mounts
├── src/
│   ├── main.tsx                   # React DOM entry point
│   ├── App.tsx                    # Root component; manages data-theme attribute on <html>
│   ├── router.tsx                 # Hash-based React Router with 3 routes
│   ├── types/
│   │   └── index.ts               # All TypeScript interfaces and type aliases
│   ├── lib/                       # Core business logic (framework-agnostic singletons)
│   │   ├── github.ts              # GitHub API integration, caching, rate-limit handling
│   │   ├── story-engine.ts        # Game state machine, commit-to-scene logic
│   │   ├── ai-engine.ts           # AI narrative generation (local WebLLM or remote API)
│   │   ├── music-engine.ts        # Deterministic algorithmic music via Tone.js
│   │   └── storage.ts             # LocalStorage abstraction (saves, settings, cache)
│   ├── store/                     # Zustand state management
│   │   ├── index.ts               # Combined store (useStore hook)
│   │   ├── appSlice.ts            # currentStyle, urlError
│   │   ├── gameSlice.ts           # gameState, commits, analysis, isGenerating
│   │   ├── settingsSlice.ts       # AI config, GitHub token, rateLimit (persisted)
│   │   └── musicSlice.ts          # isPlaying, volume, musicStarted
│   ├── components/                # Atomic design hierarchy
│   │   ├── atoms/                 # Button, Input, ProgressBar, StatBar, Badge
│   │   ├── molecules/             # ChoiceButton, ChoicesPanel, CommitLore, HeroStats, RepoCard, SaveSlot, StyleCard
│   │   ├── organisms/             # AISettingsModal, GameHeader, GameMenuModal, GameSidebar, LandingHeader, Particles, PopularReposGrid, RepoInputBar, StoryPanel, StyleSelector
│   │   ├── templates/             # GameTemplate, LandingTemplate, LoadingTemplate, StyleTemplate
│   │   └── pages/                 # GamePage, LandingPage, StylePage
│   └── styles/                    # Vanilla Extract CSS-in-JS
│       ├── contract.css.ts        # Design token contract (vars)
│       ├── global.css.ts          # Global resets and defaults
│       ├── animations.css.ts      # Shared + style-specific keyframe animations
│       └── themes/
│           ├── dnd.css.ts         # D&D fantasy theme
│           ├── scifi.css.ts       # Sci-fi cyberpunk theme
│           └── horror.css.ts      # Psychological horror theme
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript config; path alias @/* → src/*
├── vite.config.ts                 # Vite build config; base path /gitquest/
└── .github/workflows/
    ├── ci.yml                     # Type-check + build on PRs and main pushes
    └── deploy.yml                 # Build and deploy to GitHub Pages on main push
```

---

## Tech Stack

- **React 18** + **TypeScript 5.6** — UI framework with full type safety
- **React Router DOM 6** — Hash-based routing (`createHashRouter`) for GitHub Pages compatibility
- **Zustand 5** — Lightweight slice-based state management
- **Vanilla Extract 1.16** — Zero-runtime CSS-in-JS with design token contracts (`.css.ts` files)
- **Tone.js 14.8.49** — Browser audio synthesis (npm dependency)
- **Vite 8** + **vite-plus** — Build tooling; `vp` CLI wraps Vite with pre-commit hooks
- **WebLLM** — Optional in-browser LLM inference (dynamic import from `esm.run` at runtime)
- **GitHub API v3** — Commit history and repo metadata

There is a **build step**: `npm run build` → Vite outputs to `dist/`.

---

## Development Workflow

### Running Locally

```bash
npm run dev       # starts Vite dev server (via vp dev)
npm run build     # production build to dist/
npm run preview   # preview production build
```

### Type Checking / Linting

```bash
npx vp check       # runs TypeScript type check + any pre-commit checks
npx vp check --fix # also applies auto-fixable issues
```

CI runs `npx vp check` and `npm run build` on every PR and push to `main`.

### No Test Runner

There are no configured test runners (Jest, Vitest). Do not add test infrastructure unless explicitly requested.

### Deployment

Push to `main` → GitHub Actions builds with Vite and deploys to GitHub Pages with base path `/gitquest/`.

---

## Architecture & Data Flow

```
User Input (repo URL + style)
       ↓
LandingPage / StylePage  →  navigate to /:owner/:repo/:style
       ↓
GamePage initialization
  ├─ fetchCommits() → github.ts → localStorage cache
  ├─ analyzeCommits() → Analysis + MusicParams
  ├─ musicEngine.start() → Tone.js procedural synthesis
  └─ storyEngine.startGame() → initial GameState
       ↓
Game Loop:
  StoryPanel renders currentScene
  ├─ Player clicks choice
  ├─ storyEngine.makeChoice()
  │   ├─ applyChoiceConsequences() → HP/XP/inventory/questLog
  │   ├─ commitIndex++, chapter = floor(commitIndex / 10) + 1
  │   └─ aiEngine.generateScene() or generateFallbackScene()
  ├─ Zustand store updated → React re-render
  └─ Repeat until last commit → generateEpilogue()
```

### Key Patterns

| Pattern                | Usage                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| **Singleton exports**  | `lib/` modules export a single instance (`export const storyEngine = new StoryEngine()`)                 |
| **Zustand slices**     | Store composed from 4 slices; components select with `useStore(s => s.field)`                            |
| **Atomic design**      | `atoms → molecules → organisms → templates → pages` with barrel `index.ts` at each level                 |
| **Hash routing**       | `/#/:owner/:repo/:style` — required for static hosting on GitHub Pages                                   |
| **Theme via attribute** | `data-theme="dnd|scifi|horror"` set on `<html>` by `App.tsx`; early script in `index.html` prevents flash |
| **Vanilla Extract**    | Each component has a sibling `.css.ts` file; design tokens via `vars` from `contract.css.ts`             |
| **Custom event**       | `github-ratelimit-update` dispatched on `window` when rate-limit headers update                          |

---

## Code Conventions

### Naming

- React components: `PascalCase` (e.g., `ChoiceButton`, `GamePage`)
- Component files: match component name (`ChoiceButton.tsx`, `ChoiceButton.css.ts`)
- Variables and functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `GITHUB_API`, `STYLE_CONFIGS`, `SYSTEM_PROMPTS`)
- HTML ids and CSS classes: `kebab-case`
- File names: `kebab-case.ts` / `PascalCase.tsx` / `PascalCase.css.ts`

### TypeScript Style

- All types defined in `src/types/index.ts`; import as `import type { Foo } from "@/types"`
- Path alias `@/` maps to `src/` — always use it for non-relative imports
- Comment section dividers use `─── Title ───` (em-dashes)
- Config/mapping data lives in object literals at module top (e.g., `SYSTEM_PROMPTS`, `STYLE_CONFIGS`)
- Prefer early returns over deeply nested conditionals

### CSS / Vanilla Extract Style

- Design tokens defined as a contract in `src/styles/contract.css.ts` (`vars`)
- Theme files in `src/styles/themes/` implement all contract tokens under a `data-theme` selector
- Component `.css.ts` files import `vars` for all design token values — never hardcode colors/fonts
- Shared animations in `animations.css.ts`; style-specific animations go in their respective theme file

---

## Key Data Structures (`src/types/index.ts`)

### `Commit` (from `github.ts`)

```ts
{
  sha, shortSha, message, subject, body,
  author: { name, login: string | null, avatar: string | null },
  date: Date, hour, dayOfWeek, timestamp,
  stats: { additions, deletions, total } | null
}
```

### `Analysis` (from `github.ts`)

```ts
{
  totalCommits, authors, authorCount, peakHour, avgMsgLen,
  fixRatio, featRatio, refactorRatio, commitsPerDay, daySpan,
  hashSeed,
  music: { bpm, voices, mode: "major"|"minor", complexity, energy }
}
```

### `Scene` (from `ai-engine.ts`)

```ts
{
  narrative: string,
  choices: Array<{ label: string, text: string }>,  // A/B/C
  isEpilogue?: boolean
}
```

### `GameState` (in `story-engine.ts`)

```ts
{
  repo: { owner, repo }, style, commits, analysis,
  commitIndex, chapter,
  hp, maxHp, xp, level,
  inventory: string[], questLog: QuestEntry[],
  history: Array<{ narrative, choice, commitSha }>,
  currentScene, startedAt, savedAt: number | null
}
```

### `Settings` (in `storage.ts`)

```ts
{
  aiMode: "local" | "api", localModel, apiBaseUrl, apiKey, apiModel,
  githubToken, lastStyle: Style, volume: number
}
```

---

## Zustand Store (`src/store/`)

Single `useStore` hook composed from 4 slices:

| Slice            | State fields                                                    | Key actions                                    |
| ---------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| `appSlice`       | `currentStyle`, `urlError`                                      | `setCurrentStyle`, `setUrlError`               |
| `gameSlice`      | `gameState`, `commits`, `analysis`, `isGenerating`              | `setGameState`, `updateGameState`, `setCommits` |
| `settingsSlice`  | `aiMode`, `apiKey`, `apiModel`, `apiBaseUrl`, `localModel`, `githubToken`, `rateLimit` | `saveSettings`, `setRateLimit` |
| `musicSlice`     | `isPlaying`, `volume`, `musicStarted`                           | (setters per field)                            |

Settings slice reads initial values from `storage.getSettings()` on store creation and persists via `saveSettings`.

---

## localStorage Keys

| Key pattern                           | Contents                                          |
| ------------------------------------- | ------------------------------------------------- |
| `gitquest:settings`                   | Serialized `Settings` object                      |
| `gitquest:save:<slot>`                | Serialized `GameState`                            |
| `gitquest:history`                    | Array of recently played repos (max 20)           |
| `gitquest:cache:<key>`                | `{ value, expires }` — keyed by `repo:owner/repo` or `commits:owner/repo:N` |
| `gitquest:cache_index`                | Array of active cache keys (max 10; auto-evicts oldest) |

---

## GitHub API Integration (`src/lib/github.ts`)

- Fetches up to 100 commits per repo (configurable via `maxCommits` arg)
- Caches responses in localStorage for 1 hour (TTL = 3600000ms)
- Tracks rate-limit headers and dispatches `github-ratelimit-update` on `window`
- Supports a GitHub Personal Access Token (from `gitquest:settings.githubToken`) for higher limits
- `parseRepoInput()` accepts full GitHub URLs or `owner/repo` shorthand
- `POPULAR_REPOS` — hardcoded list of 12 notable repos for the landing page grid
- `analyzeCommits()` computes `Analysis` including `music` params (BPM, voices, mode, complexity, energy) derived from commit patterns

---

## AI Engine Modes (`src/lib/ai-engine.ts`)

| Mode     | Description                                                         |
| -------- | ------------------------------------------------------------------- |
| `local`  | WebLLM (in-browser LLM, dynamic import from `esm.run`, large model download) |
| `api`    | OpenAI-compatible REST API (Gemini, Ollama, OpenAI, etc.)           |
| Fallback | `generateFallbackScene()` — deterministic template-based generation |

- Default local model: `Phi-3-mini-4k-instruct-q4f16_1-MLC`
- Default API endpoint: `https://api.openai.com/v1`, model `gpt-4o-mini`
- AI requests: `temperature: 0.85`, `max_tokens: 400`
- `parseAIResponse()` extracts narrative text and `[A]`/`[B]`/`[C]` choices via regex
- System prompts per style defined in `SYSTEM_PROMPTS` at the top of `ai-engine.ts`
- Fallback uses `pickClass()` to assign D&D class based on commit subject keywords

---

## Music Engine (`src/lib/music-engine.ts`)

- Fully deterministic: `SeededRNG` seeded from XOR of first 5 commit SHAs (`hashSeed`)
- No network calls — pure client-side synthesis via Tone.js
- Effects chain: Reverb → Delay → Limiter → Master Volume
- 6 musical scales: `major`, `minor`, `dorian`, `phrygian`, `diminished`, `pentatonic`
- Synthesis layers: melody (8n), bass (4n, voices ≥ 2), pads (2n, voices ≥ 3 or horror), kick drum

`STYLE_CONFIGS` (exported) drives per-theme audio behavior:

| Style   | Primary synth | Tempo mult | Scale preference          | Reverb wet |
| ------- | ------------- | ---------- | ------------------------- | ---------- |
| `dnd`   | pluck         | 0.9×       | major, minor, dorian      | 0.5        |
| `scifi` | synth         | 1.1×       | dorian, phrygian, minor   | 0.3        |
| `horror`| am            | 0.7×       | diminished, phrygian, minor | 0.8      |

---

## Theme System

Three visual themes applied via `data-theme` attribute on `<html>`. Each has a `.css.ts` theme file implementing the `vars` contract and a matching AI personality in `SYSTEM_PROMPTS`.

| `data-theme` | Tone                               | Key fonts                   |
| ------------ | ---------------------------------- | --------------------------- |
| `dnd`        | Medieval fantasy, parchment colors | Cinzel, MedievalSharp       |
| `scifi`      | Cyberpunk neon, tech UI            | Orbitron, Share Tech Mono   |
| `horror`     | Dark, atmospheric, unsettling      | Creepster, Special Elite    |

`index.html` includes an inline script that reads `gitquest:settings.lastStyle` from localStorage and sets `data-theme` before React mounts, preventing a flash of unstyled content.

---

## Game Mechanics

- **Levels**: 10 levels with XP thresholds `[0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200]`
- **XP gain**: 20–50 per choice
- **Level-up**: `maxHp += 10`, `hp = min(hp + 20, maxHp)`, quest log entry added
- **HP effects**: bug-fix commits cause HP changes based on choice label (A: -10, C: +5)
- **Inventory**: feature commits have 40% chance to drop a themed item; max 8 items
- **Quest log**: max 10 entries; significant commit keywords trigger auto-entries
- **Chapters**: 1 chapter per 10 commits (`chapter = floor(commitIndex / 10) + 1`)
- **Choice shuffle**: choices are Fisher-Yates shuffled after AI generation to prevent pattern recognition
- **Epilogue**: triggered when `commitIndex >= commits.length - 1` and `history.length > 1`

---

## Branch & Commit Conventions

- **Default branch**: `main` (auto-deploys to GitHub Pages)
- **Feature branches**: `<type>/<description>-<suffix>` (e.g., `claude/add-feature-6ivZS`)
- **Commit message format**: `<type>: <description>` with types `feat`, `fix`, `refactor`, `docs`, `ci`

---

## Pull Request Template

`.github/pull_request_template.md` **must be followed strictly** for every PR. Do not omit or reorder sections. Fill in every section; leave the placeholder comment only when the field genuinely does not apply.

```markdown
## Description

<!-- Briefly explain what this PR does and why it's needed -->

## Type of Change

<!-- Mark the relevant option with an X -->

- [ ] `feat` — New feature
- [ ] `fix` — Bug fix
- [ ] `refactor` — Code refactoring (no functional changes)
- [ ] `docs` — Documentation update
- [ ] `ci` — CI/CD pipeline change

## Related Issue

<!-- Link to the issue this PR addresses (if any) -->

Closes #

## Testing

<!-- Describe how you tested this change. Include steps to reproduce. -->

- [ ] Tested locally with `npm run dev`
- [ ] Verified theme switching works (D&D, sci-fi, horror)
- [ ] Tested with different GitHub repos
- [ ] Tested on desktop and mobile (if UI changes)

## Checklist

- [ ] Code follows the project conventions (camelCase, kebab-case for files/classes)
- [ ] No unnecessary dependencies added
- [ ] No console errors or warnings
- [ ] Changes work with the current deployment pipeline
- [ ] PR title follows `<type>: <description>` format

## Screenshots (if applicable)

<!-- Add screenshots or GIFs for UI changes -->
```

**Rules:**
- PR title must follow `<type>: <description>` (e.g., `docs: update CLAUDE.md`)
- Check the correct `Type of Change` box with `[x]`
- Check each `Checklist` item that applies; leave unchecked only if genuinely not applicable with an inline note
- Do not create a PR without explicit user request

---

## What NOT to Do

- Do not revert to vanilla JS — the codebase is React + TypeScript
- Do not introduce a different bundler (webpack, rollup) — use Vite/vite-plus as configured
- Do not add a different state management library — Zustand is the standard here
- Do not use plain `.css` files for new component styles — use Vanilla Extract `.css.ts`
- Do not hardcode colors or fonts in `.css.ts` files — always use `vars` from `contract.css.ts`
- Do not add test or lint configuration unless explicitly asked
- Do not add error handling for impossible scenarios — trust browser API guarantees
- Do not abstract one-off logic into shared utilities
- Do not add comments to code that is already self-evident
