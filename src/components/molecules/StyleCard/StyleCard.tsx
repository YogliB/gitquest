import type { Style } from "@/types";
import { Button } from "@/components/atoms";
import * as styles from "./StyleCard.css";

interface StyleCardData {
  style: Style;
  icon: string;
  title: string;
  desc: string;
  preview: string;
  cta: string;
}

const CARD_DATA: StyleCardData[] = [
  {
    style: "dnd",
    icon: "⚔️",
    title: "Classic D&D",
    desc: "Brave heroes, ancient dungeons, and magical artifacts. Your commits become quests, bugs become monsters, and releases are legendary victories.",
    preview: '"The ancient tome speaks of a great refactoring..."',
    cta: "Enter the Realm",
  },
  {
    style: "scifi",
    icon: "🚀",
    title: "Sci-Fi",
    desc: "Starships, AI uprisings, and interstellar missions. Your commits are mission logs, contributors are crew members, and the codebase is a living ship.",
    preview: '"Captain\'s log: Stardate 2.4.1. The core systems have been upgraded..."',
    cta: "Launch Mission",
  },
  {
    style: "horror",
    icon: "💀",
    title: "Horror",
    desc: "Dark corridors, unspeakable bugs, and the terror of legacy code. Every commit hides a secret. Not all contributors made it out alive.",
    preview: '"The merge conflict had been there for three years. No one spoke of it..."',
    cta: "Face the Darkness",
  },
];

interface StyleCardProps {
  style: Style;
  onSelect: (style: Style) => void;
}

export function StyleCard({ style, onSelect }: StyleCardProps) {
  const data = CARD_DATA.find((d) => d.style === style)!;
  return (
    <div className={styles.card} onClick={() => onSelect(style)}>
      <div className={styles.glow} />
      <div className={styles.icon}>{data.icon}</div>
      <h3 className={styles.title}>{data.title}</h3>
      <p className={styles.desc}>{data.desc}</p>
      <div className={styles.preview}>
        <span className={styles.previewText}>{data.preview}</span>
      </div>
      <Button
        variant="style-select"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(style);
        }}
      >
        {data.cta}
      </Button>
    </div>
  );
}
