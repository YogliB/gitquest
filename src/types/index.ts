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

export interface Settings {
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
