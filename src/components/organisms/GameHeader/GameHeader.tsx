import type { Style } from "@/types";
import * as styles from "./GameHeader.css";

const STYLE_LABELS: Record<Style, string> = {
  dnd: "⚔ D&D",
  scifi: "🚀 Sci-Fi",
  horror: "💀 Horror",
};

interface GameHeaderProps {
  owner: string;
  repo: string;
  style: Style;
  chapter: number;
  isPlaying: boolean;
  volume: number;
  onMenuOpen: () => void;
  onMusicToggle: () => void;
  onVolumeChange: (v: number) => void;
}

export function GameHeader({
  owner,
  repo,
  style,
  chapter,
  isPlaying,
  volume,
  onMenuOpen,
  onMusicToggle,
  onVolumeChange,
}: GameHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} title="Menu" onClick={onMenuOpen}>
          ☰
        </button>
        <div className={styles.repoInfo}>
          <span className={styles.repoName}>
            {owner}/{repo}
          </span>
          <span className={styles.styleBadge}>{STYLE_LABELS[style]}</span>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.chapterInfo}>
          <span className={styles.chapterLabel}>Chapter</span>
          <span className={styles.chapterNum}>{chapter}</span>
        </div>
      </div>

      <div className={styles.right}>
        <button
          className={styles.menuBtn}
          title={isPlaying ? "Mute Music" : "Play Music"}
          onClick={onMusicToggle}
        >
          {isPlaying ? "🎵" : "🔇"}
        </button>
        <input
          type="range"
          className={styles.volumeSlider}
          min={0}
          max={100}
          value={Math.round(volume * 100)}
          onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
          title="Volume"
        />
      </div>
    </header>
  );
}
