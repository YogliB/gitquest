import type { Style } from "@/types";
import { StyleCard } from "@/components/molecules";
import * as styles from "./StyleSelector.css";

interface StyleSelectorProps {
  onSelect: (style: Style) => void;
}

export function StyleSelector({ onSelect }: StyleSelectorProps) {
  return (
    <main className={styles.main}>
      <h2 className={styles.title}>Choose Your Story</h2>
      <p className={styles.subtitle}>The same commits, three different worlds</p>
      <div className={styles.cards}>
        {(["dnd", "scifi", "horror"] as Style[]).map((style) => (
          <StyleCard key={style} style={style} onSelect={onSelect} />
        ))}
      </div>
    </main>
  );
}
