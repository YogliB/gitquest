import { LandingHeader, PopularReposGrid, RepoInputBar, Particles } from "@/components/organisms";
import * as styles from "./LandingTemplate.css";

interface LandingTemplateProps {
  error: string | null;
  onSubmit: (value: string) => void;
  onRepoSelect: (owner: string, repo: string) => void;
}

export function LandingTemplate({ error, onSubmit, onRepoSelect }: LandingTemplateProps) {
  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <Particles count={35} />
      </div>
      <div className={styles.content}>
        <LandingHeader />
        <main className={styles.main}>
          <RepoInputBar error={error} onSubmit={onSubmit} />
          <PopularReposGrid onSelect={onRepoSelect} />
        </main>
        <footer className={styles.footer}>
          <p>No backend. No tracking. All magic happens in your browser.</p>
          <div className={styles.footerLinks}>
            <a
              href="https://github.com/YogliB/gitquest"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              github repository
            </a>
            <span>|</span>
            <span>Released under the MIT License</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
