import { useState, useRef, useEffect } from "react";
import type { Scene } from "@/types";
import { ChoiceButton } from "@/components/molecules/ChoiceButton/ChoiceButton";
import * as styles from "./ChoicesPanel.css";

interface ChoicesPanelProps {
  choices: Scene["choices"];
  disabled?: boolean;
  onChoice: (index: number | string) => void;
}

export function ChoicesPanel({ choices, disabled, onChoice }: ChoicesPanelProps) {
  const [customText, setCustomText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts: 1-3 → choices, 4 → focus custom input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (disabled) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 3 && choices[num - 1]) {
        onChoice(num - 1);
      } else if (e.key === "4") {
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [choices, disabled, onChoice]);

  const handleCustomSubmit = () => {
    const text = customText.trim();
    if (text) {
      onChoice(text);
      setCustomText("");
    }
  };

  return (
    <div className={styles.panel}>
      {choices.map((choice, i) => (
        <ChoiceButton
          key={i}
          index={i}
          text={choice.text}
          disabled={disabled}
          onClick={() => onChoice(i)}
        />
      ))}
      <div className={styles.customContainer}>
        <span className={styles.customLabel}>Or write your own action</span>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            className={styles.customInput}
            type="text"
            placeholder="Describe your action..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCustomSubmit();
            }}
            disabled={disabled}
          />
          <button className={styles.submitBtn} onClick={handleCustomSubmit} disabled={disabled}>
            ↵
          </button>
        </div>
      </div>
    </div>
  );
}
