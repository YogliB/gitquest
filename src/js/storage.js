/**
 * GitQuest — storage.js
 * LocalStorage wrapper for game state, settings, and save slots
 */

const KEYS = {
  SETTINGS: 'gitquest:settings',
  SAVE_PREFIX: 'gitquest:save:',
  HISTORY: 'gitquest:history',
};

export const storage = {
  // ─── Settings ───────────────────────────────────────────
  getSettings() {
    try {
      const raw = localStorage.getItem(KEYS.SETTINGS);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  },

  saveSettings(settings) {
    const current = this.getSettings();
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }));
  },

  getSetting(key, defaultVal = null) {
    return this.getSettings()[key] ?? defaultVal;
  },

  // ─── Game Saves ─────────────────────────────────────────
  listSaves() {
    const saves = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(KEYS.SAVE_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          saves.push({ slot: key.replace(KEYS.SAVE_PREFIX, ''), ...data });
        } catch { /* skip corrupt saves */ }
      }
    }
    return saves.sort((a, b) => b.savedAt - a.savedAt);
  },

  saveGame(slot, state) {
    const key = KEYS.SAVE_PREFIX + slot;
    localStorage.setItem(key, JSON.stringify({
      ...state,
      savedAt: Date.now(),
    }));
  },

  loadGame(slot) {
    try {
      const raw = localStorage.getItem(KEYS.SAVE_PREFIX + slot);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  deleteGame(slot) {
    localStorage.removeItem(KEYS.SAVE_PREFIX + slot);
  },

  // ─── History ────────────────────────────────────────────
  addToHistory(entry) {
    const history = this.getHistory();
    history.unshift({ ...entry, timestamp: Date.now() });
    // Keep last 20 entries
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history.slice(0, 20)));
  },

  getHistory() {
    try {
      const raw = localStorage.getItem(KEYS.HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },
};
