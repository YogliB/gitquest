import { describe, it, expect } from "vitest";
import { create } from "zustand";
import { createRepoSlice, type RepoSlice } from "../repoSlice";
import type { Commit, Analysis, MusicOverrides } from "@/types";

function makeStore() {
  return create<RepoSlice>((set) => createRepoSlice(set as any));
}

const mockCommit: Commit = {
  sha: "abc123",
  shortSha: "abc123",
  message: "feat: test",
  subject: "feat: test",
  body: "",
  author: { name: "Dev", login: "dev", avatar: null },
  date: new Date(),
  hour: 10,
  dayOfWeek: 1,
  timestamp: Date.now(),
  stats: null,
};

const mockAnalysis: Analysis = {
  totalCommits: 1,
  authors: ["Dev"],
  authorCount: 1,
  peakHour: 10,
  avgMsgLen: 10,
  fixRatio: 0,
  featRatio: 1,
  refactorRatio: 0,
  commitsPerDay: 1,
  daySpan: 1,
  hashSeed: 12345,
  music: { bpm: 100, voices: 1, scale: "major", complexity: 0.5, energy: 0.5 },
  bpmReason: "reason",
  scaleReason: "reason",
  energyReason: "reason",
};

describe("repoSlice", () => {
  it("has correct initial state", () => {
    const store = makeStore();
    const s = store.getState();
    expect(s.commits).toEqual([]);
    expect(s.analysis).toBeNull();
    expect(s.overrides).toEqual({});
    expect(s.urlError).toBeNull();
    expect(s.isLoading).toBe(false);
    expect(s.loadError).toBeNull();
  });

  it("setCommits updates commits", () => {
    const store = makeStore();
    store.getState().setCommits([mockCommit]);
    expect(store.getState().commits).toHaveLength(1);
    expect(store.getState().commits[0].sha).toBe("abc123");
  });

  it("setAnalysis updates analysis", () => {
    const store = makeStore();
    store.getState().setAnalysis(mockAnalysis);
    expect(store.getState().analysis).toEqual(mockAnalysis);
  });

  it("setOverrides updates overrides", () => {
    const store = makeStore();
    const overrides: MusicOverrides = { bpm: 120, scale: "minor" };
    store.getState().setOverrides(overrides);
    expect(store.getState().overrides).toEqual(overrides);
  });

  it("resetOverrides clears overrides", () => {
    const store = makeStore();
    store.getState().setOverrides({ bpm: 120 });
    store.getState().resetOverrides();
    expect(store.getState().overrides).toEqual({});
  });

  it("setUrlError updates urlError", () => {
    const store = makeStore();
    store.getState().setUrlError("bad URL");
    expect(store.getState().urlError).toBe("bad URL");
    store.getState().setUrlError(null);
    expect(store.getState().urlError).toBeNull();
  });

  it("setIsLoading updates isLoading", () => {
    const store = makeStore();
    store.getState().setIsLoading(true);
    expect(store.getState().isLoading).toBe(true);
    store.getState().setIsLoading(false);
    expect(store.getState().isLoading).toBe(false);
  });

  it("setLoadError updates loadError", () => {
    const store = makeStore();
    store.getState().setLoadError("fetch failed");
    expect(store.getState().loadError).toBe("fetch failed");
    store.getState().setLoadError(null);
    expect(store.getState().loadError).toBeNull();
  });
});
