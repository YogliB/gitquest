import type { Analysis, Commit, MusicOverrides, PopularRepo } from "@/types";

// ─── Analysis ───────────────────────────────────────────────────────────────

export const mockAnalysis: Analysis = {
  totalCommits: 142,
  authors: ["alice", "bob", "carol"],
  authorCount: 3,
  peakHour: 14,
  avgMsgLen: 52,
  fixRatio: 0.28,
  featRatio: 0.35,
  refactorRatio: 0.12,
  commitsPerDay: 2.4,
  daySpan: 59,
  hashSeed: 0xdeadbeef,
  music: {
    bpm: 120,
    voices: 3,
    scale: "major",
    complexity: 0.6,
    energy: 0.65,
  },
  bpmReason: "Active repo with 2.4 commits/day and 3 contributors → upbeat 120 BPM",
  scaleReason: "High feature ratio (35%) and positive commit tone → major scale",
  energyReason: "Balanced fix/feat ratio and steady cadence → medium-high energy",
};

export const mockAnalysisMinor: Analysis = {
  ...mockAnalysis,
  fixRatio: 0.62,
  featRatio: 0.1,
  music: { ...mockAnalysis.music, scale: "minor", bpm: 80, energy: 0.35 },
  bpmReason: "Mostly bug-fix work with slow cadence → slow 80 BPM",
  scaleReason: "High fix ratio (62%) → minor scale",
  energyReason: "Low feature activity → low energy",
};

// ─── Commits ─────────────────────────────────────────────────────────────────

const now = Date.now();
const day = 86_400_000;

export const mockCommits: Commit[] = [
  {
    sha: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    shortSha: "a1b2c3d",
    message: "feat: add waveform visualizer with BPM sync",
    subject: "feat: add waveform visualizer with BPM sync",
    body: "",
    author: { name: "Alice Kim", login: "alicekim", avatar: null },
    date: new Date(now - 2 * day),
    hour: 10,
    dayOfWeek: 1,
    timestamp: now - 2 * day,
    stats: { additions: 142, deletions: 8, total: 150 },
  },
  {
    sha: "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6b2c3d4",
    shortSha: "b2c3d4e",
    message: "fix: correct BPM calculation for sparse repos",
    subject: "fix: correct BPM calculation for sparse repos",
    body: "Off-by-one in daySpan calculation caused BPM to be too high.",
    author: { name: "Bob Chen", login: "bobchen", avatar: null },
    date: new Date(now - 3 * day),
    hour: 16,
    dayOfWeek: 2,
    timestamp: now - 3 * day,
    stats: { additions: 5, deletions: 3, total: 8 },
  },
  {
    sha: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6c3d4e5f6",
    shortSha: "c3d4e5f",
    message: "refactor: extract SeededRNG into shared utility",
    subject: "refactor: extract SeededRNG into shared utility",
    body: "",
    author: { name: "Carol Ortiz", login: "carolortiz", avatar: null },
    date: new Date(now - 5 * day),
    hour: 9,
    dayOfWeek: 0,
    timestamp: now - 5 * day,
    stats: { additions: 60, deletions: 55, total: 115 },
  },
  {
    sha: "d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6d4e5f6a1b2",
    shortSha: "d4e5f6a",
    message: "docs: update README with music engine overview",
    subject: "docs: update README with music engine overview",
    body: "",
    author: { name: "Alice Kim", login: "alicekim", avatar: null },
    date: new Date(now - 7 * day),
    hour: 11,
    dayOfWeek: 3,
    timestamp: now - 7 * day,
    stats: null,
  },
  {
    sha: "e5f6a1b2c3d4e5f6a1b2c3d4e5f6e5f6a1b2c3d4",
    shortSha: "e5f6a1b",
    message: "feat: implement GitHub token support for higher rate limits",
    subject: "feat: implement GitHub token support for higher rate limits",
    body: "",
    author: { name: "Bob Chen", login: "bobchen", avatar: null },
    date: new Date(now - 9 * day),
    hour: 14,
    dayOfWeek: 4,
    timestamp: now - 9 * day,
    stats: { additions: 88, deletions: 12, total: 100 },
  },
  {
    sha: "f6a1b2c3d4e5f6a1b2c3d4e5f6f6a1b2c3d4e5f6",
    shortSha: "f6a1b2c",
    message: "fix: prevent flash of unstyled content on theme load",
    subject: "fix: prevent flash of unstyled content on theme load",
    body: "",
    author: { name: "Carol Ortiz", login: "carolortiz", avatar: null },
    date: new Date(now - 12 * day),
    hour: 17,
    dayOfWeek: 5,
    timestamp: now - 12 * day,
    stats: { additions: 15, deletions: 4, total: 19 },
  },
  {
    sha: "a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3",
    shortSha: "a2b3c4d",
    message: "ci: add Vitest coverage thresholds to CI pipeline",
    subject: "ci: add Vitest coverage thresholds to CI pipeline",
    body: "",
    author: { name: "Alice Kim", login: "alicekim", avatar: null },
    date: new Date(now - 15 * day),
    hour: 13,
    dayOfWeek: 1,
    timestamp: now - 15 * day,
    stats: { additions: 22, deletions: 1, total: 23 },
  },
  {
    sha: "b3c4d5e6f7a2b3c4d5e6f7b3c4d5e6f7a2b3c4d5",
    shortSha: "b3c4d5e",
    message: "test: add unit tests for analyzeCommits",
    subject: "test: add unit tests for analyzeCommits",
    body: "",
    author: { name: "Bob Chen", login: "bobchen", avatar: null },
    date: new Date(now - 18 * day),
    hour: 15,
    dayOfWeek: 3,
    timestamp: now - 18 * day,
    stats: { additions: 180, deletions: 0, total: 180 },
  },
  {
    sha: "c4d5e6f7a2b3c4d5e6f7c4d5e6f7a2b3c4d5e6f7",
    shortSha: "c4d5e6f",
    message: "feat: add TuneMusicPanel with live override controls",
    subject: "feat: add TuneMusicPanel with live override controls",
    body: "",
    author: { name: "Carol Ortiz", login: "carolortiz", avatar: null },
    date: new Date(now - 22 * day),
    hour: 10,
    dayOfWeek: 2,
    timestamp: now - 22 * day,
    stats: { additions: 210, deletions: 5, total: 215 },
  },
  {
    sha: "d5e6f7a2b3c4d5e6f7d5e6f7a2b3c4d5e6f7a2b3",
    shortSha: "d5e6f7a",
    message: "chore: initial project setup with Vite and React",
    subject: "chore: initial project setup with Vite and React",
    body: "",
    author: { name: "Alice Kim", login: "alicekim", avatar: null },
    date: new Date(now - 60 * day),
    hour: 9,
    dayOfWeek: 1,
    timestamp: now - 60 * day,
    stats: { additions: 1200, deletions: 0, total: 1200 },
  },
];

// ─── MusicOverrides ───────────────────────────────────────────────────────────

export const mockOverridesEmpty: MusicOverrides = {};

export const mockOverridesPartial: MusicOverrides = {
  bpm: 160,
  scale: "minor",
};

export const mockOverridesFull: MusicOverrides = {
  bpm: 90,
  scale: "pentatonic",
  reverb: 0.7,
  voices: 4,
  energy: 0.8,
};

// ─── PopularRepo ──────────────────────────────────────────────────────────────

export const mockPopularRepo: PopularRepo = {
  owner: "facebook",
  repo: "react",
  desc: "The library for web and native user interfaces",
  stars: "230k",
  lang: "JavaScript",
};
