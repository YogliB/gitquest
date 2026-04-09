import type { PopularRepo } from "@/types";
import * as styles from "./RepoCard.css";

interface RepoCardProps {
  repo: PopularRepo;
  onSelect: (owner: string, repo: string) => void;
}

export function RepoCard({ repo, onSelect }: RepoCardProps) {
  return (
    <div className={styles.card} onClick={() => onSelect(repo.owner, repo.repo)}>
      <div className={styles.name}>{repo.repo}</div>
      <div className={styles.owner}>{repo.owner}</div>
      <div className={styles.desc}>{repo.desc}</div>
      <div className={styles.stats}>
        <span>⭐ {repo.stars}</span>
        <span>{repo.lang}</span>
      </div>
    </div>
  );
}
