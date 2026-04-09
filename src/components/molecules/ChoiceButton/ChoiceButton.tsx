import * as styles from "./ChoiceButton.css";

interface ChoiceButtonProps {
  index: number;
  text: string;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

export function ChoiceButton({
  index,
  text,
  disabled,
  onClick,
  className = "",
}: ChoiceButtonProps) {
  return (
    <button
      className={`${styles.btn} choice-btn ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={styles.number}>{index + 1}</span>
      <span className={styles.text}>{text}</span>
    </button>
  );
}
