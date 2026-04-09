import { storage } from "@/lib/storage";
import type { RateLimitStatus } from "@/types";

export interface SettingsSlice {
  githubToken: string;
  rateLimit: RateLimitStatus;
  saveSettings: (partial: { githubToken?: string }) => void;
  setRateLimit: (rl: RateLimitStatus) => void;
}

export function createSettingsSlice(
  set: (fn: (state: SettingsSlice) => Partial<SettingsSlice>) => void,
): SettingsSlice {
  const s = storage.getSettings();
  return {
    githubToken: s.githubToken || "",
    rateLimit: { remaining: null, reset: null },
    saveSettings: (partial) => {
      storage.saveSettings(partial);
      set(() => ({ ...partial }));
    },
    setRateLimit: (rl) => set(() => ({ rateLimit: rl })),
  };
}
