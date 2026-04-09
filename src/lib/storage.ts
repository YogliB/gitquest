import type { Settings, GameState, SaveRecord } from "@/types";

const KEYS = {
  SETTINGS: "gitquest:settings",
  SAVE_PREFIX: "gitquest:save:",
  HISTORY: "gitquest:history",
  CACHE_PREFIX: "gitquest:cache:",
  CACHE_INDEX: "gitquest:cache_index",
};

export const storage = {
  // ─── Settings ───────────────────────────────────────────────────────────

  getSettings(): Partial<Settings> {
    try {
      const raw = localStorage.getItem(KEYS.SETTINGS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  saveSettings(settings: Partial<Settings>) {
    const current = this.getSettings();
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }));
  },

  getSetting<K extends keyof Settings>(
    key: K,
    defaultVal: Settings[K] | null = null,
  ): Settings[K] | null {
    return (this.getSettings()[key] as Settings[K]) ?? defaultVal;
  },

  // ─── Game Saves ──────────────────────────────────────────────────────────

  listSaves(): SaveRecord[] {
    const saves: SaveRecord[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(KEYS.SAVE_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key)!);
          saves.push({ slot: key.replace(KEYS.SAVE_PREFIX, ""), ...data });
        } catch {
          // skip corrupt saves
        }
      }
    }
    return saves.sort((a, b) => b.savedAt - a.savedAt);
  },

  saveGame(slot: string, state: GameState) {
    const key = KEYS.SAVE_PREFIX + slot;
    localStorage.setItem(key, JSON.stringify({ ...state, savedAt: Date.now() }));
  },

  loadGame(slot: string): GameState | null {
    try {
      const raw = localStorage.getItem(KEYS.SAVE_PREFIX + slot);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  deleteGame(slot: string) {
    localStorage.removeItem(KEYS.SAVE_PREFIX + slot);
  },

  // ─── History ──────────────────────────────────────────────────────────────

  addToHistory(entry: object) {
    const history = this.getHistory();
    history.unshift({ ...entry, timestamp: Date.now() });
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history.slice(0, 20)));
  },

  getHistory(): object[] {
    try {
      const raw = localStorage.getItem(KEYS.HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  // ─── Caching ──────────────────────────────────────────────────────────────

  getCache<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(KEYS.CACHE_PREFIX + key);
      if (!raw) return null;
      const { value, expires } = JSON.parse(raw);
      if (Date.now() > expires) {
        this.deleteCache(key);
        return null;
      }
      return value as T;
    } catch {
      return null;
    }
  },

  setCache<T>(key: string, value: T, ttlMs = 3600000) {
    try {
      const expires = Date.now() + ttlMs;
      localStorage.setItem(KEYS.CACHE_PREFIX + key, JSON.stringify({ value, expires }));
      this._updateCacheIndex(key);
    } catch (e) {
      console.warn("Storage failed (likely full), clearing cache...", e);
      this.clearAllCache();
    }
  },

  deleteCache(key: string) {
    localStorage.removeItem(KEYS.CACHE_PREFIX + key);
    this._removeFromCacheIndex(key);
  },

  clearAllCache() {
    const keys = this._getCacheIndex();
    keys.forEach((k) => localStorage.removeItem(KEYS.CACHE_PREFIX + k));
    localStorage.removeItem(KEYS.CACHE_INDEX);
  },

  _getCacheIndex(): string[] {
    try {
      const raw = localStorage.getItem(KEYS.CACHE_INDEX);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  _updateCacheIndex(key: string) {
    let index = this._getCacheIndex().filter((k) => k !== key);
    index.unshift(key);
    const MAX_CACHE = 10;
    if (index.length > MAX_CACHE) {
      const toRemove = index.splice(MAX_CACHE);
      toRemove.forEach((k) => localStorage.removeItem(KEYS.CACHE_PREFIX + k));
    }
    localStorage.setItem(KEYS.CACHE_INDEX, JSON.stringify(index));
  },

  _removeFromCacheIndex(key: string) {
    const index = this._getCacheIndex().filter((k) => k !== key);
    localStorage.setItem(KEYS.CACHE_INDEX, JSON.stringify(index));
  },
};
