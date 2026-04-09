export type Style = "dnd" | "scifi" | "horror";

export interface Commit {
  sha: string;
  shortSha: string;
  message: string;
  subject: string;
  body: string;
  author: {
    name: string;
    login: string | null;
    avatar: string | null;
  };
  date: Date;
  hour: number;
  dayOfWeek: number;
  timestamp: number;
  stats: { additions: number; deletions: number; total: number } | null;
}

export interface Scene {
  narrative: string;
  choices: Array<{ label: string; text: string }>;
  isEpilogue?: boolean;
}

export interface MusicParams {
  bpm: number;
  voices: number;
  mode: "major" | "minor";
  complexity: number;
  energy: number;
}

export interface Analysis {
  totalCommits: number;
  authors: string[];
  authorCount: number;
  peakHour: number;
  avgMsgLen: number;
  fixRatio: number;
  featRatio: number;
  refactorRatio: number;
  commitsPerDay: number;
  daySpan: number;
  hashSeed: number;
  music: MusicParams;
}

export interface QuestEntry {
  text: string;
  chapter: number;
}

export interface GameState {
  repo: { owner: string; repo: string };
  style: Style;
  commits: Commit[];
  analysis: Analysis;
  commitIndex: number;
  chapter: number;
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  inventory: string[];
  questLog: QuestEntry[];
  history: Array<{ narrative: string; choice: string; commitSha: string }>;
  currentScene: Scene;
  startedAt: number;
  savedAt: number | null;
}

export interface SaveRecord {
  slot: string;
  repo: { owner: string; repo: string };
  style: Style;
  savedAt: number;
  chapter: number;
  level: number;
}

export interface Settings {
  aiMode: "local" | "api";
  localModel: string;
  apiBaseUrl: string;
  apiKey: string;
  apiModel: string;
  githubToken: string;
  lastStyle: Style;
  volume: number;
}

export interface PopularRepo {
  owner: string;
  repo: string;
  desc: string;
  stars: string;
  lang: string;
}

export interface RateLimitStatus {
  remaining: number | null;
  reset: number | null;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  inventory: string[];
}
