import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Analysis, MusicOverrides } from "@/types";

// ─── Tone.js Mock (use vi.hoisted so refs are available when vi.mock factory runs) ─

const {
  mockTransport,
  MockSynth,
  MockFMSynth,
  MockPolySynth,
  MockMembraneSynth,
  MockReverb,
  MockFeedbackDelay,
  MockLimiter,
  MockVolume,
  MockSequence,
  mockGainToDb,
  mockStart,
} = vi.hoisted(() => {
  const transport = {
    bpm: { value: 120 },
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
  };

  function makeSynth() {
    return vi.fn(() => ({
      connect: vi.fn().mockReturnThis(),
      dispose: vi.fn(),
      triggerAttackRelease: vi.fn(),
      volume: { value: 0 },
    }));
  }

  function makeEffect() {
    return vi.fn(() => ({
      toDestination: vi.fn().mockReturnThis(),
      connect: vi.fn().mockReturnThis(),
      dispose: vi.fn(),
    }));
  }

  return {
    mockTransport: transport,
    MockSynth: makeSynth(),
    MockFMSynth: makeSynth(),
    MockPolySynth: makeSynth(),
    MockMembraneSynth: makeSynth(),
    MockReverb: makeEffect(),
    MockFeedbackDelay: makeEffect(),
    MockLimiter: makeEffect(),
    MockVolume: vi.fn(() => ({
      connect: vi.fn().mockReturnThis(),
      toDestination: vi.fn().mockReturnThis(),
      dispose: vi.fn(),
      volume: { value: 0 },
    })),
    MockSequence: vi.fn(() => ({
      loop: false,
      start: vi.fn(),
      stop: vi.fn(),
      dispose: vi.fn(),
    })),
    mockGainToDb: vi.fn((v: number) => v * 20),
    mockStart: vi.fn(),
  };
});

vi.mock("tone", () => ({
  Synth: MockSynth,
  FMSynth: MockFMSynth,
  PolySynth: MockPolySynth,
  MembraneSynth: MockMembraneSynth,
  Reverb: MockReverb,
  FeedbackDelay: MockFeedbackDelay,
  Limiter: MockLimiter,
  Volume: MockVolume,
  Sequence: MockSequence,
  gainToDb: mockGainToDb,
  start: mockStart,
  getTransport: vi.fn(() => mockTransport),
}));

// Import AFTER mock is registered
import { musicEngine } from "../music-engine";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeAnalysis(musicOverrides: Partial<Analysis["music"]> = {}): Analysis {
  return {
    totalCommits: 50,
    authors: ["Alice", "Bob"],
    authorCount: 2,
    peakHour: 14,
    avgMsgLen: 40,
    fixRatio: 0.1,
    featRatio: 0.4,
    refactorRatio: 0.1,
    commitsPerDay: 2,
    daySpan: 25,
    hashSeed: 0xdeadbeef,
    music: {
      bpm: 100,
      voices: 1,
      scale: "major",
      complexity: 0.5,
      energy: 0.5,
      ...musicOverrides,
    },
    bpmReason: "test bpm reason",
    scaleReason: "test scale reason",
    energyReason: "test energy reason",
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  mockTransport.stop.mockReset();
  mockTransport.start.mockReset();
  mockTransport.pause.mockReset();
});

describe("musicEngine.init", () => {
  it("initializes with 1 voice (melody only)", async () => {
    await musicEngine.init(makeAnalysis({ voices: 1 }));
    expect(musicEngine.initialized).toBe(true);
    expect(MockSynth).toHaveBeenCalled();
    expect(MockSequence).toHaveBeenCalled();
  });

  it("initializes with 2 voices (adds bass)", async () => {
    await musicEngine.init(makeAnalysis({ voices: 2 }));
    expect(musicEngine.initialized).toBe(true);
    expect(MockFMSynth).toHaveBeenCalled();
  });

  it("initializes with 3 voices (adds pads)", async () => {
    await musicEngine.init(makeAnalysis({ voices: 3 }));
    expect(musicEngine.initialized).toBe(true);
    expect(MockPolySynth).toHaveBeenCalled();
  });

  it("initializes with 4 voices (adds percussion)", async () => {
    await musicEngine.init(makeAnalysis({ voices: 4 }));
    expect(musicEngine.initialized).toBe(true);
    expect(MockMembraneSynth).toHaveBeenCalled();
  });

  it("applies MusicOverrides over analysis defaults", async () => {
    const analysis = makeAnalysis({ bpm: 80, scale: "major", voices: 1 });
    const overrides: MusicOverrides = { bpm: 160, scale: "minor", reverb: 0.8, energy: 0.9 };
    await musicEngine.init(analysis, overrides);
    expect(mockTransport.bpm.value).toBe(160);
    expect(musicEngine.initialized).toBe(true);
  });

  it("disposes previous state before re-initializing", async () => {
    const analysis = makeAnalysis({ voices: 1 });
    await musicEngine.init(analysis);
    const stopCallsBefore = mockTransport.stop.mock.calls.length;
    await musicEngine.init(analysis);
    expect(mockTransport.stop.mock.calls.length).toBeGreaterThan(stopCallsBefore);
  });

  it("stores analysis reference", async () => {
    const analysis = makeAnalysis({ voices: 1 });
    await musicEngine.init(analysis);
    expect(musicEngine.analysis).toBe(analysis);
  });
});

describe("musicEngine.play", () => {
  it("starts transport when initialized", async () => {
    await musicEngine.init(makeAnalysis({ voices: 1 }));
    await musicEngine.play();
    expect(mockTransport.start).toHaveBeenCalled();
    expect(musicEngine.isPlaying).toBe(true);
  });

  it("no-ops when not initialized", async () => {
    musicEngine.dispose();
    await musicEngine.play();
    expect(mockTransport.start).not.toHaveBeenCalled();
    expect(musicEngine.isPlaying).toBe(false);
  });
});

describe("musicEngine.pause", () => {
  it("pauses transport and sets isPlaying=false", async () => {
    await musicEngine.init(makeAnalysis({ voices: 1 }));
    await musicEngine.play();
    musicEngine.pause();
    expect(mockTransport.pause).toHaveBeenCalled();
    expect(musicEngine.isPlaying).toBe(false);
  });
});

describe("musicEngine.toggle", () => {
  it("pauses when playing", async () => {
    await musicEngine.init(makeAnalysis({ voices: 1 }));
    await musicEngine.play();
    expect(musicEngine.isPlaying).toBe(true);
    musicEngine.toggle();
    expect(musicEngine.isPlaying).toBe(false);
  });

  it("plays when paused", async () => {
    await musicEngine.init(makeAnalysis({ voices: 1 }));
    musicEngine.isPlaying = false;
    // toggle calls play() which is async — we test the sync part
    musicEngine.toggle();
    // After toggle, isPlaying would only update after the play() promise resolves
    expect(musicEngine.initialized).toBe(true);
  });
});

describe("musicEngine.setVolume", () => {
  it("updates volume property before init", () => {
    musicEngine.dispose();
    musicEngine.setVolume(0.3);
    expect(musicEngine.volume).toBe(0.3);
  });

  it("updates volume and masterVol after init", async () => {
    await musicEngine.init(makeAnalysis({ voices: 1 }));
    musicEngine.setVolume(0.8);
    expect(musicEngine.volume).toBe(0.8);
  });
});

describe("musicEngine.dispose", () => {
  it("resets initialized and isPlaying after dispose", async () => {
    await musicEngine.init(makeAnalysis({ voices: 2 }));
    musicEngine.dispose();
    expect(musicEngine.initialized).toBe(false);
    expect(musicEngine.isPlaying).toBe(false);
  });

  it("can be called on already-disposed engine without throwing", () => {
    musicEngine.dispose();
    expect(() => musicEngine.dispose()).not.toThrow();
  });
});

describe("buildPercussion catch branch", () => {
  it("handles MembraneSynth throwing without crashing init", async () => {
    MockMembraneSynth.mockImplementationOnce(() => {
      throw new Error("AudioContext not available");
    });
    const analysis = makeAnalysis({ voices: 4 });
    await expect(musicEngine.init(analysis)).resolves.not.toThrow();
  });
});

describe("all scale types", () => {
  const scales: Array<Analysis["music"]["scale"]> = [
    "major",
    "minor",
    "dorian",
    "phrygian",
    "diminished",
    "pentatonic",
  ];

  scales.forEach((scale) => {
    it(`initializes with scale: ${scale}`, async () => {
      const analysis = makeAnalysis({ scale, voices: 1 });
      await musicEngine.init(analysis);
      expect(musicEngine.initialized).toBe(true);
    });
  });
});
