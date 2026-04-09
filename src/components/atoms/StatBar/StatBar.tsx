import * as styles from "./StatBar.css";

interface StatBarProps {
  label: string;
  current: number;
  max: number;
  variant: "hp" | "xp";
}

export function StatBar({ label, current, max, variant }: StatBarProps) {
  const pct = max > 0 ? (current / max) * 100 : 0;
  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <div className={styles.track}>
        <div className={styles.fillVariants[variant]} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
      <span className={styles.value}>{current}</span>
    </div>
  );
}
