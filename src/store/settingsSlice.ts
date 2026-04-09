import { storage } from "@/lib/storage";
import type { RateLimitStatus } from "@/types";

export interface SettingsSlice {
  aiMode: "local" | "api";
  localModel: string;
  apiBaseUrl: string;
  apiKey: string;
  apiModel: string;
  githubToken: string;
  rateLimit: RateLimitStatus;
  saveSettings: (
    partial: Partial<Omit<SettingsSlice, "rateLimit" | "saveSettings" | "setRateLimit">>,
  ) => void;
  setRateLimit: (rl: RateLimitStatus) => void;
}

function loadInitialSettings() {
  const s = storage.getSettings();
  return {
    aiMode: (s.aiMode || "local") as "local" | "api",
    localModel: s.localModel || "Phi-3-mini-4k-instruct-q4f16_1-MLC",
    apiBaseUrl: s.apiBaseUrl || "https://api.openai.com/v1",
    apiKey: s.apiKey || "",
    apiModel: s.apiModel || "gpt-4o-mini",
    githubToken: s.githubToken || "",
  };
}

export function createSettingsSlice(
  set: (fn: (state: SettingsSlice) => Partial<SettingsSlice>) => void,
): SettingsSlice {
  const initial = loadInitialSettings();
  return {
    ...initial,
    rateLimit: { remaining: null, reset: null },
    saveSettings: (partial) => {
      storage.saveSettings(partial as any);
      set(() => ({ ...partial }));
    },
    setRateLimit: (rl) => set(() => ({ rateLimit: rl })),
  };
}
