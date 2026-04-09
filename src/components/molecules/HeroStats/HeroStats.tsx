import type { Style } from "@/types";
import { StatBar } from "@/components/atoms";
import * as styles from "./HeroStats.css";

interface HeroStatsProps {
  heroName: string;
  style: Style;
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
}

const AVATARS: Record<Style, string> = { dnd: "🧙", scifi: "👨‍🚀", horror: "🕵️" };

export function HeroStats({ heroName, style, hp, maxHp, xp, level }: HeroStatsProps) {
  const xpThresholds = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];
  const nextLevelXp = xpThresholds[level] || 9999;
  const prevLevelXp = xpThresholds[level - 1] || 0;
  const xpPct = ((xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.heroInfo}>
        <div className={styles.avatar}>{AVATARS[style]}</div>
        <div>
          <div className={styles.heroName}>{heroName}</div>
          <div className={styles.level}>Lv. {level}</div>
        </div>
      </div>
      <StatBar label="HP" current={hp} max={maxHp} variant="hp" />
      <StatBar label="XP" current={xp} max={nextLevelXp} variant="xp" />
    </div>
  );
}
