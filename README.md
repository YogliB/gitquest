# GitSound

Transform any GitHub repository's commit history into generative algorithmic music.

**Live demo**: [yoglib.github.io/gitquest](https://yoglib.github.io/gitquest/)

## Features

- **Commit-driven music**: BPM, scale, voices, and energy are derived deterministically from your repo's commit patterns, fix ratios, and contributor activity — the same repo always sounds the same.
- **Tone.js synthesis**: Up to 4 layered voices (melody, bass, pad chords, kick drum) synthesized entirely in the browser.
- **Manual overrides**: Tune BPM, scale, reverb, voices, and energy on top of the computed defaults without leaving the page.
- **Light / dark / system themes**: Two custom OkLch purple themes that follow your OS preference or a manual toggle.
- **GitHub token support**: Add a Personal Access Token in settings for higher API rate limits.
- **No backend**: Fully static — runs on GitHub Pages with no server.

## Tech Stack

| Layer              | Library / Tool              |
| ------------------ | --------------------------- |
| UI                 | React 18, TypeScript 5.6    |
| Routing            | React Router 6 (hash-based) |
| State              | Zustand 5                   |
| Audio              | Tone.js 14                  |
| Styling            | Tailwind CSS v4, DaisyUI v5 |
| Build              | Vite 8, vite-plus           |
| Testing            | Vitest 3, V8 coverage       |
| Component Explorer | Storybook 10                |

## Getting Started

```bash
git clone https://github.com/YogliB/gitquest.git
cd gitquest
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Script                    | Description                                   |
| ------------------------- | --------------------------------------------- |
| `npm run dev`             | Start the Vite dev server                     |
| `npm run build`           | Production build to `dist/`                   |
| `npm run preview`         | Preview the production build                  |
| `npm test`                | Run unit tests with Vitest                    |
| `npm run test:coverage`   | Run tests with V8 coverage (80% threshold)    |
| `npm run knip`            | Detect unused exports and dependencies        |
| `npm run jscpd`           | Detect duplicated code blocks                 |
| `npm run storybook`       | Start Storybook dev server at port 6006       |
| `npm run build-storybook` | Build static Storybook to `storybook-static/` |

## How It Works

1. **Enter a GitHub repo URL** on the landing page.
2. **Commits are fetched** via the GitHub API (up to 100, cached for 1 hour).
3. **Analysis** computes commit patterns: fix ratio, feature ratio, commits per day, peak hour, author count, etc.
4. **Music parameters** (BPM, scale, voices, energy, reverb) are derived deterministically from the analysis using a seeded RNG.
5. **Tone.js** builds the synthesis graph — melody, bass, pads, and drums — and plays it in the browser.

## License

MIT
