import * as styles from './LandingHeader.css'

export function LandingHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.wrap}>
        <div className={`${styles.icon} logo-icon`}>⚔</div>
        <h1 className={`${styles.title} logo-text`}>GitQuest</h1>
        <p className={styles.tagline}>Your Code, Your Legend</p>
      </div>
    </header>
  )
}
