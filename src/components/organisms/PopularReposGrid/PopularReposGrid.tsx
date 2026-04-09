import { POPULAR_REPOS } from '@/lib/github'
import { RepoCard } from '@/components/molecules'
import * as styles from './PopularReposGrid.css'

interface PopularReposGridProps {
  onSelect: (owner: string, repo: string) => void
}

export function PopularReposGrid({ onSelect }: PopularReposGridProps) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Legendary Repositories</h3>
      <div className={styles.grid}>
        {POPULAR_REPOS.map(repo => (
          <RepoCard key={`${repo.owner}/${repo.repo}`} repo={repo} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
