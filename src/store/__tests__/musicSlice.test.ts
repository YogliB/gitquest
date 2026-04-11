import { describe, it, expect } from "vitest";
import { create } from "zustand";
import { createMusicSlice, type MusicSlice } from "../musicSlice";

function makeStore() {
  return create<MusicSlice>((set) => createMusicSlice(set as any));
}

describe("musicSlice", () => {
  it("has correct initial state", () => {
    const store = makeStore();
    const state = store.getState();
    expect(state.isPlaying).toBe(false);
    expect(state.volume).toBe(0.6);
    expect(state.musicStarted).toBe(false);
  });

  it("setIsPlaying updates isPlaying", () => {
    const store = makeStore();
    store.getState().setIsPlaying(true);
    expect(store.getState().isPlaying).toBe(true);
    store.getState().setIsPlaying(false);
    expect(store.getState().isPlaying).toBe(false);
  });

  it("setVolume updates volume", () => {
    const store = makeStore();
    store.getState().setVolume(0.9);
    expect(store.getState().volume).toBe(0.9);
  });

  it("setMusicStarted updates musicStarted", () => {
    const store = makeStore();
    store.getState().setMusicStarted(true);
    expect(store.getState().musicStarted).toBe(true);
  });
});
