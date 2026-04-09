import * as styles from "./ProgressBar.css";

interface ProgressBarProps {
  value: number; // 0-100
}

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className={styles.track}>
      <div className={styles.fill} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
