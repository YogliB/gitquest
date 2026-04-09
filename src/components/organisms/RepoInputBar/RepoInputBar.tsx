import { useState } from 'react'
import { Button } from '@/components/atoms'
import * as styles from './RepoInputBar.css'

interface RepoInputBarProps {
  error: string | null
  onSubmit: (value: string) => void
  defaultValue?: string
}

export function RepoInputBar({ error, onSubmit, defaultValue = '' }: RepoInputBarProps) {
  const [value, setValue] = useState(defaultValue)

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim())
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Choose Your Repository</h2>
      <p className={styles.subtitle}>Enter a GitHub URL or pick a legendary codebase below</p>
      <div className={styles.inputWrap}>
        <span className={styles.prefix}>github.com/</span>
        <input
          className={styles.input}
          type="text"
          placeholder="facebook/react"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
        />
        <Button variant="primary" onClick={handleSubmit} style={{ margin: '6px', borderRadius: '10px' }}>
          <span>⚔</span> Begin Quest
        </Button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </section>
  )
}
