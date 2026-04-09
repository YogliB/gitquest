import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { storage } from "@/lib/storage";
import { storyEngine } from "@/lib/story-engine";
import { Button } from "@/components/atoms";
import { SaveSlot } from "@/components/molecules";
import * as styles from "./GameMenuModal.css";

interface GameMenuModalProps {
  onClose: () => void;
  onSave: () => void;
  onLoadGame: () => void;
}

export function GameMenuModal({ onClose, onSave, onLoadGame }: GameMenuModalProps) {
  const navigate = useNavigate();
  const { gameState, setGameState } = useStore();
  const saves = storage.listSaves();

  const handleLoad = (slot: string) => {
    try {
      const loaded = storyEngine.loadGame(slot);
      setGameState(loaded);
      onLoadGame();
      onClose();
    } catch (e) {
      console.error("Load failed:", e);
    }
  };

  const handleDelete = (slot: string) => {
    storage.deleteGame(slot);
    // Force re-render by closing and reopening — simple approach
    onClose();
  };

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>⚔ Quest Menu</h3>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.menuButtons}>
          <Button
            variant="primary"
            onClick={() => {
              onSave();
              onClose();
            }}
          >
            💾 Save Quest
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            🔄 Change Style
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")}>
            🏠 New Repository
          </Button>
        </div>

        <div className={styles.saveSlots}>
          {saves.length === 0 ? (
            <div className={styles.noSaves}>No saved quests yet</div>
          ) : (
            saves.map((save) => (
              <SaveSlot key={save.slot} save={save} onLoad={handleLoad} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
