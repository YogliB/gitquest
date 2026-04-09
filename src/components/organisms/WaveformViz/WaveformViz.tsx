import type { Analysis } from "@/types";

class SeededRNG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed >>> 0;
  }
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 0xffffffff;
  }
}

interface WaveformVizProps {
  analysis: Analysis;
  isPlaying: boolean;
  effectiveBpm: number;
}

export function WaveformViz({ analysis, isPlaying, effectiveBpm }: WaveformVizProps) {
  const rng = new SeededRNG(analysis.hashSeed ^ 0xdeadbeef);
  const bars = Array.from({ length: 32 }, () => 15 + Math.round(rng.next() * 85));
  const beatMs = Math.round((60 / effectiveBpm) * 1000);

  return (
    <div className="flex items-end justify-center gap-0.5 h-28 w-full px-4 py-2">
      {bars.map((height, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm origin-bottom"
          style={{
            height: `${height}%`,
            background: "linear-gradient(to top, var(--color-primary), var(--color-secondary))",
            opacity: isPlaying ? 0.85 : 0.45,
            animationName: "waveformBounce",
            animationDuration: `${beatMs}ms`,
            animationDelay: `${Math.round((i / 32) * beatMs)}ms`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationPlayState: isPlaying ? "running" : "paused",
          }}
        />
      ))}
    </div>
  );
}
