import { useState } from "react";
import type { GameState } from "@/types";
import { GameHeader, GameSidebar, StoryPanel, GameMenuModal } from "@/components/organisms";
import * as styles from "./GameTemplate.css";

interface GameTemplateProps {
  owner: string;
  repo: string;
  gameState: GameState;
  heroName: string;
  isGenerating: boolean;
  isPlaying: boolean;
  volume: number;
  onChoice: (index: number) => void;
  onCustomChoice: (text: string) => void;
  onSave: () => void;
  onLoadGame: () => void;
  onMusicToggle: () => void;
  onVolumeChange: (v: number) => void;
}

export function GameTemplate({
  owner,
  repo,
  gameState,
  heroName,
  isGenerating,
  isPlaying,
  volume,
  onChoice,
  onCustomChoice,
  onSave,
  onLoadGame,
  onMusicToggle,
  onVolumeChange,
}: GameTemplateProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={`${styles.bg} style-bg`} />

      <GameHeader
        owner={owner}
        repo={repo}
        style={gameState.style}
        chapter={gameState.chapter}
        isPlaying={isPlaying}
        volume={volume}
        onMenuOpen={() => setMenuOpen(true)}
        onMusicToggle={onMusicToggle}
        onVolumeChange={onVolumeChange}
      />

      <div className={styles.layout}>
        <GameSidebar gameState={gameState} heroName={heroName} />
        <main className={styles.main}>
          <StoryPanel
            gameState={gameState}
            isGenerating={isGenerating}
            onChoice={onChoice}
            onCustomChoice={onCustomChoice}
          />
        </main>
      </div>

      {menuOpen && (
        <GameMenuModal onClose={() => setMenuOpen(false)} onSave={onSave} onLoadGame={onLoadGame} />
      )}
    </div>
  );
}
