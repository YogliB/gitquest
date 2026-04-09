import type { GameState } from "@/types";
import { Badge } from "@/components/atoms";
import { HeroStats, CommitLore } from "@/components/molecules";
import * as styles from "./GameSidebar.css";

interface GameSidebarProps {
  gameState: GameState;
  heroName: string;
}

export function GameSidebar({ gameState, heroName }: GameSidebarProps) {
  const { style, hp, maxHp, xp, level, inventory, questLog } = gameState;
  const commit = gameState.commits[gameState.commitIndex] || null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Hero</h4>
        <HeroStats heroName={heroName} style={style} hp={hp} maxHp={maxHp} xp={xp} level={level} />
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Inventory</h4>
        <div className={styles.inventoryList}>
          {inventory.length === 0 ? (
            <span className={styles.emptyInventory}>Empty</span>
          ) : (
            inventory.map((item) => (
              <Badge key={item} variant="inventory">
                {item}
              </Badge>
            ))
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Quest Log</h4>
        <div className={styles.questLog}>
          {questLog.slice(0, 5).map((q, i) => (
            <div key={i} className={styles.questEntry}>
              {q.text}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Commit Lore</h4>
        <CommitLore commit={commit} />
      </div>
    </aside>
  );
}
