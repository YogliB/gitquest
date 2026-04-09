import type { SaveRecord } from '@/types'
import * as styles from './SaveSlot.css'

interface SaveSlotProps {
  save: SaveRecord
  onLoad: (slot: string) => void
  onDelete: (slot: string) => void
}

export function SaveSlot({ save, onLoad, onDelete }: SaveSlotProps) {
  const date = new Date(save.savedAt).toLocaleDateString()
  return (
    <div className={styles.slot}>
      <div className={styles.info}>
        <div className={styles.name}>{save.repo.owner}/{save.repo.repo}</div>
        <div className={styles.meta}>{save.style} · Ch.{save.chapter} · Lv.{save.level} · {date}</div>
      </div>
      <div className={styles.actions}>
        <button className={styles.loadBtn} onClick={() => onLoad(save.slot)}>Load</button>
        <button className={styles.deleteBtn} onClick={() => onDelete(save.slot)}>✕</button>
      </div>
    </div>
  )
}
