import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { storage } from "../storage";

// ─── LocalStorage Mock ────────────────────────────────────────────────────────

function makeLocalStorageMock() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((k: string) => store[k] ?? null),
    setItem: vi.fn((k: string, v: string) => {
      store[k] = v;
    }),
    removeItem: vi.fn((k: string) => {
      delete store[k];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((k) => delete store[k]);
    }),
    store,
  };
}

let lsMock: ReturnType<typeof makeLocalStorageMock>;

beforeEach(() => {
  lsMock = makeLocalStorageMock();
  vi.stubGlobal("localStorage", lsMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ─── Settings ─────────────────────────────────────────────────────────────────

describe("getSettings", () => {
  it("returns parsed object when key exists", () => {
    lsMock.store["gitquest:settings"] = JSON.stringify({ githubToken: "tok" });
    expect(storage.getSettings()).toEqual({ githubToken: "tok" });
  });

  it("returns empty object when key is missing", () => {
    expect(storage.getSettings()).toEqual({});
  });

  it("returns empty object on invalid JSON", () => {
    lsMock.store["gitquest:settings"] = "not-json{{{";
    expect(storage.getSettings()).toEqual({});
  });
});

describe("saveSettings", () => {
  it("merges new values with existing settings", () => {
    lsMock.store["gitquest:settings"] = JSON.stringify({ githubToken: "old" });
    storage.saveSettings({ colorTheme: "dark" });
    const saved = JSON.parse(lsMock.setItem.mock.calls.at(-1)![1]);
    expect(saved).toEqual({ githubToken: "old", colorTheme: "dark" });
  });

  it("saves when no previous settings exist", () => {
    storage.saveSettings({ githubToken: "new" });
    const saved = JSON.parse(lsMock.setItem.mock.calls.at(-1)![1]);
    expect(saved).toEqual({ githubToken: "new" });
  });
});

describe("getSetting", () => {
  it("returns the specific key value", () => {
    lsMock.store["gitquest:settings"] = JSON.stringify({ githubToken: "abc" });
    expect(storage.getSetting("githubToken")).toBe("abc");
  });

  it("returns defaultVal when key is missing", () => {
    expect(storage.getSetting("githubToken", "fallback")).toBe("fallback");
  });

  it("returns null when key missing and no default", () => {
    expect(storage.getSetting("githubToken")).toBeNull();
  });
});

// ─── History ──────────────────────────────────────────────────────────────────

describe("addToHistory", () => {
  it("prepends entry with a timestamp", () => {
    storage.addToHistory({ owner: "a", repo: "b" });
    const saved = JSON.parse(lsMock.setItem.mock.calls.at(-1)![1]);
    expect(saved[0]).toMatchObject({ owner: "a", repo: "b" });
    expect(typeof saved[0].timestamp).toBe("number");
  });

  it("keeps at most 20 entries", () => {
    const existing = Array.from({ length: 20 }, (_, i) => ({ id: i }));
    lsMock.store["gitquest:history"] = JSON.stringify(existing);
    storage.addToHistory({ id: 99 });
    const saved = JSON.parse(lsMock.setItem.mock.calls.at(-1)![1]);
    expect(saved).toHaveLength(20);
    expect(saved[0]).toMatchObject({ id: 99 });
  });
});

describe("getHistory", () => {
  it("returns parsed history", () => {
    lsMock.store["gitquest:history"] = JSON.stringify([{ id: 1 }]);
    expect(storage.getHistory()).toEqual([{ id: 1 }]);
  });

  it("returns empty array when key missing", () => {
    expect(storage.getHistory()).toEqual([]);
  });

  it("returns empty array on invalid JSON", () => {
    lsMock.store["gitquest:history"] = "{{bad";
    expect(storage.getHistory()).toEqual([]);
  });
});

// ─── Cache ────────────────────────────────────────────────────────────────────

describe("getCache", () => {
  it("returns value when not expired", () => {
    const entry = { value: { foo: 1 }, expires: Date.now() + 60000 };
    lsMock.store["gitquest:cache:mykey"] = JSON.stringify(entry);
    expect(storage.getCache("mykey")).toEqual({ foo: 1 });
  });

  it("returns null when key missing", () => {
    expect(storage.getCache("missing")).toBeNull();
  });

  it("returns null and deletes when expired", () => {
    const entry = { value: { foo: 1 }, expires: Date.now() - 1 };
    lsMock.store["gitquest:cache:mykey"] = JSON.stringify(entry);
    lsMock.store["gitquest:cache_index"] = JSON.stringify(["mykey"]);
    const result = storage.getCache("mykey");
    expect(result).toBeNull();
    expect(lsMock.removeItem).toHaveBeenCalledWith("gitquest:cache:mykey");
  });

  it("returns null on invalid JSON", () => {
    lsMock.store["gitquest:cache:badkey"] = "not-json";
    expect(storage.getCache("badkey")).toBeNull();
  });
});

describe("setCache", () => {
  it("stores value with expiry and updates index", () => {
    storage.setCache("k1", { data: 42 });
    expect(lsMock.setItem).toHaveBeenCalledWith(
      "gitquest:cache:k1",
      expect.stringContaining('"data":42'),
    );
  });

  it("calls clearAllCache when setItem throws", () => {
    // First call (for the cache entry) throws; subsequent calls (index) succeed
    lsMock.setItem.mockImplementationOnce(() => {
      throw new Error("QuotaExceededError");
    });
    lsMock.store["gitquest:cache_index"] = JSON.stringify(["old"]);
    lsMock.store["gitquest:cache:old"] = "{}";
    // Should not throw
    expect(() => storage.setCache("failing", "value")).not.toThrow();
    expect(lsMock.removeItem).toHaveBeenCalledWith("gitquest:cache:old");
  });
});

describe("deleteCache", () => {
  it("removes the cache entry and updates index", () => {
    lsMock.store["gitquest:cache_index"] = JSON.stringify(["k1", "k2"]);
    storage.deleteCache("k1");
    expect(lsMock.removeItem).toHaveBeenCalledWith("gitquest:cache:k1");
    const idx = JSON.parse(lsMock.setItem.mock.calls.at(-1)![1]);
    expect(idx).toEqual(["k2"]);
  });
});

describe("clearAllCache", () => {
  it("removes all cached entries and the index key", () => {
    lsMock.store["gitquest:cache_index"] = JSON.stringify(["a", "b"]);
    lsMock.store["gitquest:cache:a"] = "1";
    lsMock.store["gitquest:cache:b"] = "2";
    storage.clearAllCache();
    expect(lsMock.removeItem).toHaveBeenCalledWith("gitquest:cache:a");
    expect(lsMock.removeItem).toHaveBeenCalledWith("gitquest:cache:b");
    expect(lsMock.removeItem).toHaveBeenCalledWith("gitquest:cache_index");
  });
});

describe("_updateCacheIndex", () => {
  it("deduplicates an existing key and prepends it", () => {
    lsMock.store["gitquest:cache_index"] = JSON.stringify(["k2", "k1"]);
    storage._updateCacheIndex("k1");
    const idx = JSON.parse(lsMock.setItem.mock.calls.at(-1)![1]);
    expect(idx[0]).toBe("k1");
    expect(idx.filter((k: string) => k === "k1")).toHaveLength(1);
  });

  it("evicts oldest entries when index exceeds 10", () => {
    const existing = Array.from({ length: 10 }, (_, i) => `k${i}`);
    lsMock.store["gitquest:cache_index"] = JSON.stringify(existing);
    // pre-populate those cache entries so removeItem can be called
    existing.forEach((k) => {
      lsMock.store[`gitquest:cache:${k}`] = "{}";
    });
    storage._updateCacheIndex("new");
    // The oldest key (k9) should have been evicted
    expect(lsMock.removeItem).toHaveBeenCalledWith("gitquest:cache:k9");
    const idx = JSON.parse(lsMock.setItem.mock.calls.at(-1)![1]);
    expect(idx).toHaveLength(10);
    expect(idx[0]).toBe("new");
  });
});

describe("_removeFromCacheIndex", () => {
  it("filters the key from the index", () => {
    lsMock.store["gitquest:cache_index"] = JSON.stringify(["a", "b", "c"]);
    storage._removeFromCacheIndex("b");
    const idx = JSON.parse(lsMock.setItem.mock.calls.at(-1)![1]);
    expect(idx).toEqual(["a", "c"]);
  });
});
