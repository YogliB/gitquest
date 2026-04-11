import { describe, it, expect, vi, beforeEach } from "vitest";

const mockStorage = vi.hoisted(() => ({
  getSettings: vi.fn(() => ({})),
  saveSettings: vi.fn(),
}));

vi.mock("@/lib/storage", () => ({ storage: mockStorage }));

import { useStore } from "../index";

describe("useStore (combined store)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exposes repoSlice fields", () => {
    const state = useStore.getState();
    expect(state.commits).toEqual([]);
    expect(state.analysis).toBeNull();
    expect(state.overrides).toEqual({});
    expect(state.urlError).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.loadError).toBeNull();
    expect(typeof state.setCommits).toBe("function");
    expect(typeof state.setAnalysis).toBe("function");
    expect(typeof state.resetOverrides).toBe("function");
  });

  it("exposes settingsSlice fields", () => {
    const state = useStore.getState();
    expect(typeof state.githubToken).toBe("string");
    expect(["light", "dark", "system"]).toContain(state.colorTheme);
    expect(state.rateLimit).toHaveProperty("remaining");
    expect(typeof state.saveSettings).toBe("function");
    expect(typeof state.setColorTheme).toBe("function");
    expect(typeof state.setRateLimit).toBe("function");
  });

  it("exposes musicSlice fields", () => {
    const state = useStore.getState();
    expect(state.isPlaying).toBe(false);
    expect(typeof state.volume).toBe("number");
    expect(state.musicStarted).toBe(false);
    expect(typeof state.setIsPlaying).toBe("function");
    expect(typeof state.setVolume).toBe("function");
    expect(typeof state.setMusicStarted).toBe("function");
  });

  it("setIsPlaying mutates state", () => {
    useStore.getState().setIsPlaying(true);
    expect(useStore.getState().isPlaying).toBe(true);
    useStore.getState().setIsPlaying(false);
    expect(useStore.getState().isPlaying).toBe(false);
  });

  it("setIsLoading mutates state", () => {
    useStore.getState().setIsLoading(true);
    expect(useStore.getState().isLoading).toBe(true);
    useStore.getState().setIsLoading(false);
    expect(useStore.getState().isLoading).toBe(false);
  });
});
