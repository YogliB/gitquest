import { useState } from "react";
import type { Style } from "@/types";
import { Button } from "@/components/atoms";
import { StyleSelector, AISettingsModal } from "@/components/organisms";
import * as styles from "./StyleTemplate.css";

interface StyleTemplateProps {
  owner: string;
  repo: string;
  onBack: () => void;
  onSelect: (style: Style) => void;
}

export function StyleTemplate({ owner, repo, onBack, onSelect }: StyleTemplateProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={`${styles.bg} style-bg`} />
      <div className={styles.content}>
        <header className={styles.header}>
          <Button variant="back" onClick={onBack}>
            ← Back
          </Button>
          <div className={styles.repoBadge}>
            {owner}/{repo}
          </div>
          <Button variant="ghost" onClick={() => setSettingsOpen(true)} title="AI Settings">
            ⚙
          </Button>
        </header>

        <StyleSelector onSelect={onSelect} />
      </div>

      {settingsOpen && <AISettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
