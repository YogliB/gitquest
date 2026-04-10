# CLAUDE.md — GitSound (GitQuest)

## Project Overview

**GitSound** (package name: `gitquest`) is a browser-based single-page application that transforms any GitHub repository's commit history into generative algorithmic music. Users enter a GitHub repo URL and hear their project as a unique soundscape — commit patterns, bug-fix ratios, and contributor activity drive BPM, scale, voices, and energy of the Tone.js synthesis engine. Users can also tune the music manually via override controls.

**Live deployment**: GitHub Pages (auto-deployed from `main` via `.github/workflows/deploy.yml`).

---

## Repository Structure

```
gitquest/
├── index.html                     # HTML entry; preloads fonts, applies color theme before React mounts
├── .storybook/
│   ├── main.ts                    # Storybook config; Vite framework with Tailwind plugin + @/ alias
│   ├── preview.tsx                # Global decorator for DaisyUI theme toolbar + CSS import
│   └── preview-head.html          # Google Fonts preload for Storybook
├── src/
│   ├── main.tsx                   # React DOM entry point
│   ├── App.tsx                    # Root component; manages data-theme attribute on <html>
│   ├── router.tsx                 # Hash-based React Router with 2 routes
│   ├── types/
│   │   └── index.ts               # All TypeScript interfaces and type aliases
│   ├── lib/                       # Core business logic (framework-agnostic singletons)
│   │   ├── github.ts              # GitHub API integration, caching, rate-limit handling
│   │   ├── music-engine.ts        # Deterministic algorithmic music via Tone.js
│   │   └── storage.ts             # LocalStorage abstraction (settings, history, cache)
│   ├── store/                     # Zustand state management
│   │   ├── index.ts               # Combined store (useStore hook)
│   │   ├── repoSlice.ts           # commits, analysis, overrides, urlError, isLoading, loadError
│   │   ├── settingsSlice.ts       # githubToken, colorTheme, rateLimit (persisted)
│   │   └── musicSlice.ts          # isPlaying, volume, musicStarted
│   ├── stories/
│   │   └── mockData.ts            # Shared mock fixtures (Analysis, Commit[], PopularRepo, etc.)
│   ├── components/                # Atomic design hierarchy (no atoms level)
│   │   ├── molecules/             # RepoCard/
│   │   ├── organisms/             # CommitFeed/, FromYourCodePanel/, LandingHeader/,
│   │   │                          #   PlaybackControls/, PlayerHeader/, PopularReposGrid/,
│   │   │                          #   RepoInputBar/, ThemeToggle/, TuneMusicPanel/, WaveformViz/
│   │   ├── templates/             # LandingTemplate/, PlayerTemplate/
│   │   └── pages/                 # LandingPage/, PlayerPage/
│   └── styles/
│       └── global.css             # Tailwind v4 import, DaisyUI plugin, two custom themes, global resets
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript config; path alias @/* → src/*
├── vite.config.ts                 # Vite build config; base path /gitquest/, staged hook
├── vitest.config.ts               # Vitest config; V8 coverage, 80% thresholds
├── knip.json                      # Knip config for unused export detection
├── oxlint.config.ts               # oxlint config (used by vp check)
└── .github/workflows/
    ├── ci.yml                     # vp check, knip, jscpd, coverage, build on PRs and main
    └── deploy.yml                 # Build and deploy to GitHub Pages on main push
```

---

## Tech Stack

- **React 18** + **TypeScript 5.6** — UI framework with full type safety
- **React Router DOM 6** — Hash-based routing (`createHashRouter`) for GitHub Pages compatibility
- **Zustand 5** — Lightweight slice-based state management
- **Tailwind CSS v4** + **DaisyUI v5** — Utility-first CSS with component layer; two custom OkLch themes
- **Tone.js 14.8.49** — Browser audio synthesis (npm dependency)
- **Vite 8** + **vite-plus** — Build tooling; `vp` CLI wraps Vite with formatting, staged hooks, and pre-commit checks
- **Vitest 3** — Unit test runner; V8 coverage provider with 80% per-file thresholds
- **Storybook 10** — Component explorer; each component has a colocated `.stories.tsx` file
- **Knip 5** — Detects unused exports and dependencies
- **jscpd** — Detects duplicate code blocks
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
npx vp check       # runs TypeScript type check + oxlint
npx vp check --fix # also applies auto-fixable issues
```

Staged files automatically run `vp check --fix` on commit (configured via `staged` in `vite.config.ts`).

### Testing

```bash
npm test              # run all tests (vitest)
npm run test:coverage # run with V8 coverage; requires 80% statements/lines/functions/branches per file
```

Vitest excludes `*.css.ts`, `src/types/**`, and `src/main.tsx` from coverage. Test files should be colocated or in a `__tests__/` sibling.

### Storybook

```bash
npm run storybook       # start Storybook dev server at http://localhost:6006
npm run build-storybook # build static Storybook to storybook-static/
```

Every component has a colocated `ComponentName.stories.tsx` file. Shared mock fixtures live in `src/stories/mockData.ts`. The DaisyUI theme is switchable via the paintbrush toolbar in Storybook.

### Code Quality

```bash
npm run knip   # find unused exports and dependencies
npm run jscpd  # find duplicated code blocks
```

### Deployment

Push to `main` → GitHub Actions builds with Vite and deploys to GitHub Pages with base path `/gitquest/`.

---

## CI Pipeline (`ci.yml`)

Five parallel/sequential jobs on every PR and push to `main`:

| Job       | Command                  | Purpose                              |
| --------- | ------------------------ | ------------------------------------ |
| `check`   | `npx vp check`           | TypeScript + oxlint                  |
| `knip`    | `npm run knip`           | Unused exports/dependencies          |
| `dedup`   | `npm run jscpd`          | Duplicate code detection             |
| `coverage`| `npm run test:coverage`  | Unit tests with 80% coverage gate    |
| `build`   | `npm run build`          | Vite production build validation     |

`knip` depends on `check` completing first. All jobs use Node 22.

---

## Architecture & Data Flow

```
User Input (repo URL)
       ↓
LandingPage  →  navigate to /:owner/:repo
       ↓
PlayerPage initialization
  ├─ fetchCommits() → github.ts → localStorage cache
  ├─ analyzeCommits() → Analysis (including MusicParams)
  └─ musicEngine.init(analysis, overrides) → Tone.js synthesis setup
       ↓
Player UI:
  PlaybackControls → musicEngine.play() / .pause()
  TuneMusicPanel  → user edits MusicOverrides → musicEngine.init(analysis, overrides)
  WaveformViz     → animated visualization while playing
  CommitFeed      → scrollable list of commits
  FromYourCodePanel → displays bpmReason, scaleReason, energyReason
```

### Key Patterns

| Pattern                | Usage                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| **Singleton exports**  | `lib/` modules export a single instance (`export const musicEngine = new MusicEngine()`)                 |
| **Zustand slices**     | Store composed from 3 slices; components select with `useStore(s => s.field)`                            |
| **Atomic design**      | `molecules → organisms → templates → pages` with barrel `index.ts` at each level (no atoms level)       |
| **Hash routing**       | `/#/:owner/:repo` — required for static hosting on GitHub Pages                                          |
| **Theme via attribute** | `data-theme="gitquest-light|gitquest-dark"` set on `<html>` by `App.tsx`; early script in `index.html` prevents flash |
| **Tailwind + DaisyUI** | Utility classes in JSX; DaisyUI components (btn, input, badge, etc.) for consistent UI primitives       |
| **Custom event**       | `github-ratelimit-update` dispatched on `window` when rate-limit headers update                          |

---

## Code Conventions

### Naming

- React components: `PascalCase` (e.g., `RepoCard`, `PlayerPage`)
- Component files: match component name (`RepoCard.tsx`)
- Variables and functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `GITHUB_API`, `POPULAR_REPOS`, `ENGINE_CONFIG`)
- HTML ids and CSS classes: `kebab-case`
- File names: `kebab-case.ts` / `PascalCase.tsx`
- Story files: `PascalCase.stories.tsx` colocated in the same folder as the component

### TypeScript Style

- All types defined in `src/types/index.ts`; import as `import type { Foo } from "@/types"`
- Path alias `@/` maps to `src/` — always use it for non-relative imports
- Comment section dividers use `─── Title ───` (em-dashes)
- Config/mapping data lives in object literals at module top (e.g., `SCALES`, `ENGINE_CONFIG`, `POPULAR_REPOS`)
- Prefer early returns over deeply nested conditionals
- `strict: false` in `tsconfig.json` — do not enable strict mode

### CSS / Tailwind Style

- Use Tailwind utility classes in JSX for layout, spacing, typography
- Use DaisyUI component classes (`btn`, `btn-primary`, `input`, `badge`, `card`, etc.) for interactive elements
- DaisyUI semantic color tokens (`primary`, `secondary`, `accent`, `base-100`, etc.) apply automatically from the active theme — never hardcode colors
- Global styles and custom animations only in `src/styles/global.css`
- No component-level `.css` or `.css.ts` files — all styling via Tailwind classes in JSX

---

## Key Data Structures (`src/types/index.ts`)

### `ColorTheme`

```ts
"light" | "dark" | "system"
```

### `Scale`

```ts
"major" | "minor" | "dorian" | "phrygian" | "diminished" | "pentatonic"
```

### `MusicOverrides`

```ts
{
  bpm?: number;      // 40–200
  scale?: Scale;
  reverb?: number;   // 0–1
  voices?: number;   // 1–4
  energy?: number;   // 0–1
}
```

### `Commit` (from `github.ts`)

```ts
{
  sha, shortSha, message, subject, body,
  author: { name, login: string | null, avatar: string | null },
  date: Date, hour, dayOfWeek, timestamp,
  stats: { additions, deletions, total } | null
}
```

### `MusicParams`

```ts
{
  bpm: number,
  voices: number,
  scale: Scale,
  complexity: number,
  energy: number
}
```

### `Analysis` (from `github.ts`)

```ts
{
  totalCommits, authors, authorCount, peakHour, avgMsgLen,
  fixRatio, featRatio, refactorRatio, commitsPerDay, daySpan,
  hashSeed,
  music: MusicParams,
  bpmReason: string,   // human-readable explanation of BPM choice
  scaleReason: string, // human-readable explanation of scale choice
  energyReason: string // human-readable explanation of energy level
}
```

### `Settings` (in `storage.ts`)

```ts
{
  githubToken: string,
  colorTheme: ColorTheme,
  volume: number
}
```

### `PopularRepo`

```ts
{
  owner, repo, desc, stars, lang: string
}
```

### `RateLimitStatus`

```ts
{
  remaining: number | null,
  reset: number | null
}
```

---

## Zustand Store (`src/store/`)

Single `useStore` hook composed from 3 slices:

| Slice            | State fields                                                          | Key actions                                              |
| ---------------- | --------------------------------------------------------------------- | -------------------------------------------------------- |
| `repoSlice`      | `commits`, `analysis`, `overrides`, `urlError`, `isLoading`, `loadError` | `setCommits`, `setAnalysis`, `setOverrides`, `resetOverrides`, `setUrlError`, `setIsLoading`, `setLoadError` |
| `settingsSlice`  | `githubToken`, `colorTheme`, `rateLimit`                              | `saveSettings`, `setColorTheme`, `setRateLimit`          |
| `musicSlice`     | `isPlaying`, `volume`, `musicStarted`                                 | `setIsPlaying`, `setVolume`, `setMusicStarted`           |

Settings slice reads initial values from `storage.getSettings()` on store creation and persists via `saveSettings` / `setColorTheme`.

---

## localStorage Keys

| Key pattern                           | Contents                                          |
| ------------------------------------- | ------------------------------------------------- |
| `gitquest:settings`                   | Serialized `Settings` object                      |
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
- `analyzeCommits()` computes `Analysis` including `MusicParams` and human-readable reason strings (BPM, scale, energy)

---

## Music Engine (`src/lib/music-engine.ts`)

The core feature of the application. Fully deterministic synthesis driven by commit analysis.

- `SeededRNG` seeded from `analysis.hashSeed` (XOR of first commit SHAs) — same repo always produces the same music
- No network calls — pure client-side synthesis via Tone.js
- Effects chain: Reverb → Delay → Limiter → Master Volume
- 6 musical scales: `major`, `minor`, `dorian`, `phrygian`, `diminished`, `pentatonic`
- Root note derived from `hashSeed % 12` (chromatic index into C…B)

### Synthesis layers (controlled by `voices` parameter):

| Voices | Layer added                           | Synth type      |
| ------ | ------------------------------------- | --------------- |
| ≥ 1    | Melody (16-step sequence, `8n`)       | `Tone.Synth` (triangle oscillator) |
| ≥ 2    | Bass line (8-step pattern, `4n`)      | `Tone.FMSynth`  |
| ≥ 3    | Pad chords (8-chord sequence, `2n`)   | `Tone.PolySynth` (sine oscillator) |
| ≥ 4    | Kick drum (16-step rhythm, `8n`)      | `Tone.MembraneSynth` |

### Public API:

```ts
musicEngine.init(analysis, overrides?)  // build synthesis graph; call when repo loads or overrides change
musicEngine.play()                      // async; starts Tone.js transport
musicEngine.pause()                     // pauses transport
musicEngine.toggle()                    // play/pause; returns new isPlaying state
musicEngine.setVolume(0–1)              // updates master volume live
musicEngine.dispose()                   // tear down all nodes; called before re-init
```

`MusicOverrides` (from `repoSlice.overrides`) let users tune BPM, scale, reverb, voices, and energy on top of the computed defaults.

---

## Theme System

Two visual themes applied via `data-theme` attribute on `<html>`. Both use OkLch color space via DaisyUI's theme plugin.

| `data-theme`    | Appearance          | DaisyUI theme name  |
| --------------- | ------------------- | ------------------- |
| `gitquest-light` | Light purple/violet | `gitquest-light`   |
| `gitquest-dark`  | Dark purple/violet  | `gitquest-dark`    |

- `colorTheme` setting: `"light"` | `"dark"` | `"system"` — `"system"` follows `prefers-color-scheme`
- `App.tsx` subscribes to `colorTheme` and system media query to apply the correct `data-theme`
- `index.html` includes an inline script that reads `gitquest:settings.colorTheme` from localStorage and sets `data-theme` before React mounts, preventing a flash of unstyled content
- `ThemeToggle` organism handles UI for switching between light/dark/system

### Fonts

- **Body**: Inter (400, 500, 600, 700)
- **Monospace**: JetBrains Mono (400, 500) — applied via `.font-mono` / `.mono` / `code` selectors
- Both loaded via Google Fonts in `index.html`

---

## Routing (`src/router.tsx`)

Hash-based router required for GitHub Pages static hosting:

| Path             | Component      | Purpose                                  |
| ---------------- | -------------- | ---------------------------------------- |
| `/`              | `LandingPage`  | Repo URL input + popular repos grid      |
| `/:owner/:repo`  | `PlayerPage`   | Music player for the specified repo      |

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
- [ ] Verified light/dark theme switching works
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
- Do not use plain `.css` files for component styles — use Tailwind utility classes in JSX
- Do not use Vanilla Extract — it has been removed; use Tailwind + DaisyUI
- Do not hardcode colors — use DaisyUI semantic tokens (`primary`, `base-100`, etc.)
- Do not add error handling for impossible scenarios — trust browser API guarantees
- Do not abstract one-off logic into shared utilities
- Do not add comments to code that is already self-evident
- Do not add an atoms component level — the hierarchy starts at molecules
- Do not add AI/LLM narrative generation — this is a music app, not an RPG
- Do not add game state, game mechanics, or story engine logic — those do not exist in this codebase
