import type { Commit } from "@/types";
import * as styles from "./CommitLore.css";

interface CommitLoreProps {
  commit: Commit | null;
}

export function CommitLore({ commit }: CommitLoreProps) {
  if (!commit) return null;
  return (
    <div className={styles.container}>
      <div className={styles.hash}>{commit.shortSha}</div>
      <div className={styles.message}>{commit.subject}</div>
      <div className={styles.author}>— {commit.author.name}</div>
    </div>
  );
}
