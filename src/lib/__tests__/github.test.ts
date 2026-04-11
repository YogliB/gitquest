import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Commit } from "@/types";

// Mock localStorage so the real storage module works without browser
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
  vi.stubGlobal("window", { dispatchEvent: vi.fn() });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

import { parseRepoInput, analyzeCommits, fetchCommits } from "../github";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCommit(overrides: Partial<Commit> = {}): Commit {
  const sha = (overrides.sha as string) ?? "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";
  const ts = overrides.timestamp ?? Date.now() - 86400000;
  const date = new Date(ts);
  return {
    sha,
    shortSha: sha.slice(0, 7),
    message: overrides.message ?? "feat: something",
    subject: overrides.subject ?? "feat: something",
    body: "",
    author: overrides.author ?? { name: "Alice", login: "alice", avatar: null },
    date,
    hour: overrides.hour ?? date.getHours(),
    dayOfWeek: date.getDay(),
    timestamp: ts,
    stats: null,
    ...overrides,
  };
}

function makeCommits(subjects: string[], hourOverride?: number): Commit[] {
  const base = Date.now();
  return subjects.map((subject, i) => {
    const ts = base - i * 86400000;
    return makeCommit({
      sha: `${"0".repeat(32)}${i.toString(16).padStart(8, "0")}`,
      subject,
      message: subject,
      timestamp: ts,
      hour: hourOverride ?? new Date(ts).getHours(),
    });
  });
}

// ─── parseRepoInput ───────────────────────────────────────────────────────────

describe("parseRepoInput", () => {
  it("parses a full GitHub URL", () => {
    expect(parseRepoInput("https://github.com/facebook/react")).toEqual({
      owner: "facebook",
      repo: "react",
    });
  });

  it("strips trailing slash from URL", () => {
    expect(parseRepoInput("https://github.com/facebook/react/")).toEqual({
      owner: "facebook",
      repo: "react",
    });
  });

  it("parses owner/repo shorthand", () => {
    expect(parseRepoInput("owner/repo")).toEqual({ owner: "owner", repo: "repo" });
  });

  it("trims leading and trailing whitespace", () => {
    expect(parseRepoInput("  owner/repo  ")).toEqual({ owner: "owner", repo: "repo" });
  });

  it("returns null for a bare word (no slash)", () => {
    expect(parseRepoInput("notarepo")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseRepoInput("")).toBeNull();
  });
});

// ─── analyzeCommits ───────────────────────────────────────────────────────────

describe("analyzeCommits — scale selection", () => {
  it("selects minor scale when fixRatio > 0.4", () => {
    const commits = makeCommits([
      "fix: bug A",
      "fix: bug B",
      "fix: bug C",
      "fix: bug D",
      "fix: bug E",
      "feat: feature 1",
      "feat: feature 2",
      "chore: stuff",
      "docs: update",
      "build: configure",
    ]);
    const analysis = analyzeCommits(commits);
    expect(analysis.music.scale).toBe("minor");
    expect(analysis.scaleReason).toContain("minor");
  });

  it("selects dorian scale when refactorRatio > 0.3 and fixRatio <= 0.4", () => {
    const commits = makeCommits([
      "refactor: clean up A",
      "refactor: improve B",
      "refactor: update C",
      "refactor: improve D",
      "feat: feature 1",
      "feat: feature 2",
      "docs: update",
      "build: configure",
      "chore: stuff",
      "chore: more",
    ]);
    const analysis = analyzeCommits(commits);
    expect(analysis.music.scale).toBe("dorian");
    expect(analysis.scaleReason).toContain("Dorian");
  });

  it("selects phrygian scale when peak hour < 6", () => {
    const commits = makeCommits(["feat: night owl A", "feat: night owl B", "feat: night owl C"], 3);
    const analysis = analyzeCommits(commits);
    expect(analysis.music.scale).toBe("phrygian");
    expect(analysis.scaleReason).toContain("Phrygian");
  });

  it("selects phrygian scale when peak hour > 22", () => {
    const commits = makeCommits(["feat: late night A", "feat: late night B"], 23);
    const analysis = analyzeCommits(commits);
    expect(analysis.music.scale).toBe("phrygian");
  });

  it("selects pentatonic scale when commitsPerDay > 5", () => {
    const base = Date.now();
    const commits = Array.from({ length: 12 }, (_, i) =>
      makeCommit({
        sha: `${"0".repeat(32)}${i.toString(16).padStart(8, "0")}`,
        subject: `feat: rapid ${i}`,
        timestamp: base - i * 3600000,
        hour: 10,
      }),
    );
    const analysis = analyzeCommits(commits);
    expect(analysis.music.scale).toBe("pentatonic");
    expect(analysis.scaleReason).toContain("Pentatonic");
  });

  it("selects major scale by default (balanced repo)", () => {
    const commits = makeCommits(["feat: add X", "feat: add Y", "docs: readme", "build: ci"], 14);
    const analysis = analyzeCommits(commits);
    expect(analysis.music.scale).toBe("major");
    expect(analysis.scaleReason).toContain("Major");
  });
});

describe("analyzeCommits — output shape", () => {
  it("populates all required fields", () => {
    const commits = makeCommits(["feat: A", "fix: B", "chore: C"]);
    const analysis = analyzeCommits(commits);
    expect(analysis.totalCommits).toBe(3);
    expect(analysis.authors).toBeInstanceOf(Array);
    expect(analysis.authorCount).toBeGreaterThan(0);
    expect(typeof analysis.bpmReason).toBe("string");
    expect(analysis.bpmReason.length).toBeGreaterThan(0);
    expect(typeof analysis.energyReason).toBe("string");
    expect(analysis.energyReason.length).toBeGreaterThan(0);
    expect(analysis.music.bpm).toBeGreaterThanOrEqual(60);
    expect(analysis.music.bpm).toBeLessThanOrEqual(140);
    expect(analysis.music.energy).toBeGreaterThanOrEqual(0);
    expect(analysis.music.energy).toBeLessThanOrEqual(1);
    expect(analysis.music.voices).toBeGreaterThanOrEqual(1);
    expect(analysis.music.voices).toBeLessThanOrEqual(4);
  });

  it("deduplicates authors correctly", () => {
    const commits = [
      makeCommit({ author: { name: "Alice", login: "alice", avatar: null } }),
      makeCommit({ author: { name: "Alice", login: "alice", avatar: null } }),
      makeCommit({ author: { name: "Bob", login: "bob", avatar: null } }),
    ];
    const analysis = analyzeCommits(commits);
    expect(analysis.authorCount).toBe(2);
    expect(analysis.authors).toContain("Alice");
    expect(analysis.authors).toContain("Bob");
  });
});

// ─── fetchCommits ─────────────────────────────────────────────────────────────

function makeRawCommit(i = 0) {
  return {
    sha: `${"a".repeat(32)}${i.toString(16).padStart(8, "0")}`,
    commit: {
      message: `feat: commit ${i}`,
      author: { date: new Date(Date.now() - i * 86400000).toISOString(), name: "Dev" },
    },
    author: { login: "dev", avatar_url: "https://example.com/avatar.png" },
  };
}

function makeFetchResponse(opts: { ok: boolean; status: number; data?: unknown }) {
  return {
    ok: opts.ok,
    status: opts.status,
    headers: { get: vi.fn().mockReturnValue(null) },
    json: vi.fn().mockResolvedValue(opts.data ?? []),
  };
}

describe("fetchCommits", () => {
  it("returns cached commits when cache is hit", async () => {
    // Populate localStorage with a valid cache entry
    const cachedCommit = makeCommit({ timestamp: Date.now() });
    const cacheEntry = {
      value: [{ ...cachedCommit, date: cachedCommit.date.toISOString() }],
      expires: Date.now() + 60000,
    };
    lsMock.store["gitquest:cache:commits:owner/repo:100"] = JSON.stringify(cacheEntry);

    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await fetchCommits("owner", "repo");
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it("fetches commits successfully and caches them", async () => {
    const raw = [makeRawCommit(0), makeRawCommit(1)];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeFetchResponse({ ok: true, status: 200, data: raw })),
    );

    const result = await fetchCommits("owner", "repo");
    expect(result).toHaveLength(2);
    expect(result[0].sha).toBe(raw[0].sha);
    // Verify cache was written
    expect(lsMock.setItem).toHaveBeenCalledWith(
      expect.stringContaining("gitquest:cache:"),
      expect.any(String),
    );
  });

  it("parses commit with missing author fields gracefully", async () => {
    const rawMinimal = {
      sha: "b".repeat(40),
      commit: {
        message: "fix: minimal\n\nbody line",
        author: { date: new Date().toISOString() },
      },
      author: null,
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeFetchResponse({ ok: true, status: 200, data: [rawMinimal] })),
    );

    const result = await fetchCommits("owner", "repo");
    expect(result[0].author.name).toBe("Unknown");
    expect(result[0].author.login).toBeNull();
    expect(result[0].author.avatar).toBeNull();
    expect(result[0].body).toBe("body line");
  });

  it("breaks loop on 409 (empty repo)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeFetchResponse({ ok: false, status: 409 })),
    );
    const result = await fetchCommits("owner", "repo");
    expect(result).toHaveLength(0);
  });

  it("throws on 403 (rate limit)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeFetchResponse({ ok: false, status: 403 })),
    );
    await expect(fetchCommits("owner", "repo")).rejects.toThrow("rate limit");
  });

  it("throws on generic non-ok status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeFetchResponse({ ok: false, status: 500 })),
    );
    await expect(fetchCommits("owner", "repo")).rejects.toThrow("500");
  });

  it("breaks when API returns empty array", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeFetchResponse({ ok: true, status: 200, data: [] })),
    );
    const result = await fetchCommits("owner", "repo");
    expect(result).toHaveLength(0);
  });

  it("sends Authorization header when token provided", async () => {
    const raw = [makeRawCommit(0)];
    const mockFetch = vi
      .fn()
      .mockResolvedValue(makeFetchResponse({ ok: true, status: 200, data: raw }));
    vi.stubGlobal("fetch", mockFetch);
    await fetchCommits("owner", "repo", "mytoken");
    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers["Authorization"]).toBe("Bearer mytoken");
  });
});
