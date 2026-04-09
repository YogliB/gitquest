import { STYLE_CONFIGS } from "@/lib/music-engine";
import type { Style } from "@/types";
import { ProgressBar } from "@/components/atoms";
import * as styles from "./LoadingTemplate.css";

interface LoadingTemplateProps {
  style: Style;
  progress: number;
  message: string;
}

export function LoadingTemplate({ style, progress, message }: LoadingTemplateProps) {
  const config = STYLE_CONFIGS[style];
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <span className={`${styles.icon} loading-icon`}>{config.loadingIcon}</span>
        <h2 className={styles.title}>{config.loadingTitle}</h2>
        <ProgressBar value={progress} />
        <p className={styles.fact}>{message}</p>
      </div>
    </div>
  );
}
