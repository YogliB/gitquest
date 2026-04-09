import * as styles from "./Badge.css";

type Variant = "repo" | "style" | "inventory";

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "repo", children, className = "" }: BadgeProps) {
  return (
    <span className={`${styles.base} ${styles.variants[variant]} ${className}`}>{children}</span>
  );
}
