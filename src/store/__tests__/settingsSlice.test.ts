import { describe, it, expect, vi, beforeEach } from "vitest";
import { create } from "zustand";

const mockStorage = vi.hoisted(() => ({
  getSettings: vi.fn(() => ({})),
  saveSettings: vi.fn(),
}));

vi.mock("@/lib/storage", () => ({ storage: mockStorage }));

import { createSettingsSlice, type SettingsSlice } from "../settingsSlice";

function makeStore() {
  return create<SettingsSlice>((set) => createSettingsSlice(set as any));
}

describe("settingsSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getSettings.mockReturnValue({});
  });

  it("has correct initial state when storage is empty", () => {
    const store = makeStore();
    const s = store.getState();
    expect(s.githubToken).toBe("");
    expect(s.colorTheme).toBe("system");
    expect(s.rateLimit).toEqual({ remaining: null, reset: null });
  });

  it("reads initial values from storage", () => {
    mockStorage.getSettings.mockReturnValue({ githubToken: "tok123", colorTheme: "dark" });
    const store = makeStore();
    expect(store.getState().githubToken).toBe("tok123");
    expect(store.getState().colorTheme).toBe("dark");
  });

  it("saveSettings updates state and persists", () => {
    const store = makeStore();
    store.getState().saveSettings({ githubToken: "newtoken" });
    expect(store.getState().githubToken).toBe("newtoken");
    expect(mockStorage.saveSettings).toHaveBeenCalledWith({ githubToken: "newtoken" });
  });

  it("setColorTheme updates colorTheme and persists", () => {
    const store = makeStore();
    store.getState().setColorTheme("dark");
    expect(store.getState().colorTheme).toBe("dark");
    expect(mockStorage.saveSettings).toHaveBeenCalledWith({ colorTheme: "dark" });
  });

  it("setColorTheme can set light theme", () => {
    const store = makeStore();
    store.getState().setColorTheme("light");
    expect(store.getState().colorTheme).toBe("light");
  });

  it("setRateLimit updates rateLimit state", () => {
    const store = makeStore();
    store.getState().setRateLimit({ remaining: 42, reset: 9999 });
    expect(store.getState().rateLimit).toEqual({ remaining: 42, reset: 9999 });
  });
});
