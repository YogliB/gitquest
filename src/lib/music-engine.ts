import * as Tone from "tone";
import type { Style, Analysis } from "@/types";

// ─── Music Theory Constants ───────────────────────────────────────────────────

const SCALES: Record<string, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  diminished: [0, 2, 3, 5, 6, 8, 9, 11],
  pentatonic: [0, 2, 4, 7, 9],
};

const ROOTS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

interface StyleConfig {
  loadingIcon: string;
  loadingTitle: string;
  primarySynth: string;
  bassSynth: string;
  padSynth: string;
  arpSynth: string;
  reverbWet: number;
  delayWet: number;
  tempoMult: number;
  scalePreference: string[];
  octaveRange: [number, number];
}

export const STYLE_CONFIGS: Record<Style, StyleConfig> = {
  dnd: {
    loadingIcon: "⚔",
    loadingTitle: "Summoning the Chronicles...",
    primarySynth: "pluck",
    bassSynth: "membrane",
    padSynth: "organ",
    arpSynth: "pluck",
    reverbWet: 0.5,
    delayWet: 0.1,
    tempoMult: 0.9,
    scalePreference: ["major", "minor", "dorian"],
    octaveRange: [3, 5],
  },
  scifi: {
    loadingIcon: "🚀",
    loadingTitle: "Initializing Mission Parameters...",
    primarySynth: "synth",
    bassSynth: "fm",
    padSynth: "am",
    arpSynth: "synth",
    reverbWet: 0.3,
    delayWet: 0.4,
    tempoMult: 1.1,
    scalePreference: ["dorian", "phrygian", "minor"],
    octaveRange: [3, 6],
  },
  horror: {
    loadingIcon: "💀",
    loadingTitle: "Awakening the Darkness...",
    primarySynth: "am",
    bassSynth: "fm",
    padSynth: "am",
    arpSynth: "am",
    reverbWet: 0.8,
    delayWet: 0.3,
    tempoMult: 0.7,
    scalePreference: ["diminished", "phrygian", "minor"],
    octaveRange: [2, 4],
  },
};

// ─── Seeded RNG ───────────────────────────────────────────────────────────────

class SeededRNG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed >>> 0;
  }
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 0xffffffff;
  }
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick<T>(arr: T[]): T {
    return arr[this.nextInt(0, arr.length - 1)];
  }
}

// ─── Music Engine ─────────────────────────────────────────────────────────────

class MusicEngine {
  isPlaying = false;
  volume = 0.6;
  style: Style = "dnd";
  analysis: Analysis | null = null;
  private parts: Tone.Sequence[] = [];
  private synths: (
    | Tone.Synth
    | Tone.FMSynth
    | Tone.AMSynth
    | Tone.PluckSynth
    | Tone.MembraneSynth
    | Tone.PolySynth
  )[] = [];
  private effects: Record<string, Tone.ToneAudioNode> = {};
  private masterVol: Tone.Volume | null = null;
  initialized = false;

  async init(style: Style, analysis: Analysis) {
    this.style = style;
    this.analysis = analysis;
    this.dispose();

    const config = STYLE_CONFIGS[style] || STYLE_CONFIGS.dnd;
    const music = analysis.music;
    const rng = new SeededRNG(analysis.hashSeed);

    const rootIdx = analysis.hashSeed % 12;
    const root = ROOTS[rootIdx];
    const scaleName = rng.pick(config.scalePreference);
    const scale = SCALES[scaleName];
    const octave = config.octaveRange[0] + 1;

    const notePool = buildNotePool(root, scale, octave, config.octaveRange);

    const bpm = Math.round(music.bpm * config.tempoMult);
    Tone.getTransport().bpm.value = bpm;

    const reverb = new Tone.Reverb({
      decay: style === "horror" ? 6 : 2.5,
      wet: config.reverbWet,
    }).toDestination();
    const delay = new Tone.FeedbackDelay({
      delayTime: "8n",
      feedback: 0.2,
      wet: config.delayWet,
    }).connect(reverb);
    const limiter = new Tone.Limiter(-3).toDestination();
    this.effects = { reverb, delay, limiter };

    this.masterVol = new Tone.Volume(Tone.gainToDb(this.volume)).connect(limiter);

    const melody = buildMelody(analysis, notePool, rng, style);
    const bassLine = buildBassLine(analysis, root, scale, octave - 1, rng);
    const rhythm = buildRhythm(analysis, style, rng);

    const melodySynth = createSynth(config.primarySynth, style);
    melodySynth.connect(this.masterVol);
    this.synths.push(melodySynth as any);

    const melodyPart = new Tone.Sequence(
      (time, note: any) => {
        if (note) (melodySynth as any).triggerAttackRelease(note.pitch, note.dur, time, note.vel);
      },
      melody,
      "8n",
    );
    melodyPart.loop = true;
    this.parts.push(melodyPart);

    if (music.voices >= 2) {
      const bassSynth = createSynth(config.bassSynth, style, true);
      bassSynth.connect(this.masterVol);
      this.synths.push(bassSynth as any);

      const bassPart = new Tone.Sequence(
        (time, note: any) => {
          if (note)
            (bassSynth as any).triggerAttackRelease(note.pitch, note.dur, time, note.vel * 0.7);
        },
        bassLine,
        "4n",
      );
      bassPart.loop = true;
      this.parts.push(bassPart);
    }

    if (music.voices >= 3 || style === "horror") {
      const padSynth = createPad(style);
      padSynth.connect(reverb);
      this.synths.push(padSynth as any);

      const chords = buildChords(root, scale, octave, rng, style);
      const padPart = new Tone.Sequence(
        (time, chord: any) => {
          if (chord)
            chord.forEach((n: string) =>
              (padSynth as any).triggerAttackRelease(n, "2n", time, 0.3),
            );
        },
        chords,
        "2n",
      );
      padPart.loop = true;
      this.parts.push(padPart);
    }

    if (style !== "horror" || music.energy > 0.5) {
      const percPart = buildPercussion(rhythm, style, this.masterVol);
      if (percPart) this.parts.push(percPart);
    }

    this.initialized = true;
  }

  async play() {
    if (!this.initialized) return;
    await Tone.start();
    this.parts.forEach((p) => p.start(0));
    Tone.getTransport().start();
    this.isPlaying = true;
  }

  pause() {
    Tone.getTransport().pause();
    this.isPlaying = false;
  }

  toggle() {
    if (this.isPlaying) this.pause();
    else this.play();
    return this.isPlaying;
  }

  setVolume(val: number) {
    this.volume = val;
    if (this.masterVol) {
      this.masterVol.volume.value = Tone.gainToDb(val);
    }
  }

  dispose() {
    Tone.getTransport().stop();
    this.parts.forEach((p) => {
      try {
        p.stop();
        p.dispose();
      } catch {}
    });
    this.synths.forEach((s) => {
      try {
        s.dispose();
      } catch {}
    });
    Object.values(this.effects).forEach((e) => {
      try {
        e.dispose();
      } catch {}
    });
    if (this.masterVol) {
      try {
        this.masterVol.dispose();
      } catch {}
    }
    this.parts = [];
    this.synths = [];
    this.effects = {};
    this.initialized = false;
    this.isPlaying = false;
  }
}

// ─── Music Construction Helpers ───────────────────────────────────────────────

function buildNotePool(
  root: string,
  scale: number[],
  baseOctave: number,
  octaveRange: [number, number],
): string[] {
  const rootIdx = ROOTS.indexOf(root);
  const notes: string[] = [];
  for (let oct = octaveRange[0]; oct <= octaveRange[1]; oct++) {
    scale.forEach((interval) => {
      const noteIdx = (rootIdx + interval) % 12;
      notes.push(`${ROOTS[noteIdx]}${oct}`);
    });
  }
  return notes;
}

function buildMelody(analysis: Analysis, notePool: string[], rng: SeededRNG, style: Style) {
  const { music } = analysis;
  const length = 16;
  const melody = [];
  const contourSeed = analysis.hashSeed;
  const rng2 = new SeededRNG(contourSeed);

  for (let i = 0; i < length; i++) {
    if (rng2.next() < analysis.fixRatio * 0.3) {
      melody.push(null);
      continue;
    }
    const noteIdx = Math.floor(Math.abs(Math.sin(i * 0.7 + contourSeed * 0.001)) * notePool.length);
    const pitch = notePool[noteIdx % notePool.length];
    const durOptions = music.energy > 0.6 ? ["16n", "8n", "8n", "4n"] : ["8n", "4n", "4n", "2n"];
    const dur = rng2.pick(durOptions);
    const vel = 0.4 + rng2.next() * 0.5;
    melody.push({ pitch, dur, vel });
  }
  return melody;
}

function buildBassLine(
  analysis: Analysis,
  root: string,
  scale: number[],
  octave: number,
  rng: SeededRNG,
) {
  const rootIdx = ROOTS.indexOf(root);
  const bassNotes = scale.slice(0, 4).map((interval) => {
    const idx = (rootIdx + interval) % 12;
    return `${ROOTS[idx]}${octave}`;
  });
  const pattern = [];
  const length = 8;
  for (let i = 0; i < length; i++) {
    const noteIdx = [0, 0, 2, 0, 1, 0, 3, 0][i];
    pattern.push({ pitch: bassNotes[noteIdx], dur: "4n", vel: 0.6 });
  }
  return pattern;
}

function buildChords(root: string, scale: number[], octave: number, rng: SeededRNG, style: Style) {
  const rootIdx = ROOTS.indexOf(root);
  const chordDegrees = style === "horror" ? [0, 1, 6] : [0, 3, 4, 5];
  const chords = chordDegrees.map((degree) => {
    const intervals = [
      scale[degree],
      scale[(degree + 2) % scale.length],
      scale[(degree + 4) % scale.length],
    ];
    return intervals.map((interval) => {
      const noteIdx = (rootIdx + interval) % 12;
      return `${ROOTS[noteIdx]}${octave}`;
    });
  });
  return [...chords, ...chords];
}

function buildRhythm(analysis: Analysis, style: Style, rng: SeededRNG): number[] {
  const patterns: Record<Style, number[]> = {
    dnd: [1, 0, 0, 0.5, 1, 0, 0.3, 0, 1, 0, 0, 0.5, 1, 0, 0.3, 0],
    scifi: [1, 0, 0.3, 0, 0.8, 0, 0.3, 0.2, 1, 0, 0.3, 0, 0.8, 0.2, 0.5, 0],
    horror: [1, 0, 0, 0, 0, 0, 0, 0, 0.6, 0, 0, 0, 0, 0, 0, 0],
  };
  return patterns[style] || patterns.dnd;
}

function buildPercussion(
  rhythm: number[],
  style: Style,
  destination: Tone.Volume,
): Tone.Sequence | null {
  try {
    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: style === "horror" ? 3 : 6,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
    }).connect(destination);

    const part = new Tone.Sequence(
      (time, vel) => {
        if ((vel as number) > 0) kick.triggerAttackRelease("C1", "8n", time, (vel as number) * 0.8);
      },
      rhythm,
      "8n",
    );
    part.loop = true;
    return part;
  } catch {
    return null;
  }
}

function createSynth(type: string, style: Style, isBass = false) {
  const baseEnv = { attack: 0.02, decay: 0.3, sustain: 0.4, release: 1.2 };
  switch (type) {
    case "pluck":
      return new Tone.PluckSynth({ attackNoise: 1, dampening: 4000, resonance: 0.7 });
    case "fm":
      return new Tone.FMSynth({
        harmonicity: isBass ? 2 : 3,
        modulationIndex: style === "scifi" ? 10 : 5,
        envelope: baseEnv,
        modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 },
      });
    case "am":
      return new Tone.AMSynth({
        harmonicity: style === "horror" ? 1.5 : 2,
        envelope: { ...baseEnv, attack: style === "horror" ? 0.5 : 0.02 },
      });
    case "organ":
      return new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.9, release: 0.5 },
      });
    default:
      return new Tone.Synth({
        oscillator: { type: style === "scifi" ? "sawtooth" : "triangle" },
        envelope: baseEnv,
      });
  }
}

function createPad(style: Style) {
  if (style === "horror") {
    return new Tone.AMSynth({
      harmonicity: 1.5,
      oscillator: { type: "sine" },
      envelope: { attack: 2, decay: 1, sustain: 0.8, release: 3 },
      modulation: { type: "sine" },
      modulationEnvelope: { attack: 2, decay: 1, sustain: 0.8, release: 3 },
    });
  }
  if (style === "scifi") {
    return new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 2 },
    });
  }
  return new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 0.3, decay: 0.5, sustain: 0.7, release: 1.5 },
  });
}

export const musicEngine = new MusicEngine();
