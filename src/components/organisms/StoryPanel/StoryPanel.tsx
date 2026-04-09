import { useEffect, useRef, useState } from 'react'
import type { GameState, Style } from '@/types'
import { ChoicesPanel } from '@/components/molecules'
import * as styles from './StoryPanel.css'

const LOCATION_NAMES: Record<Style, string[]> = {
  dnd: ['The Entrance Hall', 'The Dark Forest', 'The Ancient Library', "The Dragon's Lair", 'The Final Chamber'],
  scifi: ['Docking Bay', 'Engine Room', 'Command Bridge', 'Deep Space', 'The Anomaly'],
  horror: ['The Front Door', 'The Basement', 'The Attic', 'The Hidden Room', 'The Abyss'],
}

interface StoryPanelProps {
  gameState: GameState
  isGenerating: boolean
  onChoice: (index: number) => void
  onCustomChoice: (text: string) => void
}

function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  const textRef = useRef(text)
  const indexRef = useRef(0)

  useEffect(() => {
    if (text === textRef.current) return
    textRef.current = text
    indexRef.current = 0
    setDisplayed('')
  }, [text])

  useEffect(() => {
    if (!text) return
    indexRef.current = 0
    setDisplayed('')

    const interval = setInterval(() => {
      indexRef.current++
      setDisplayed(text.slice(0, indexRef.current))
      if (indexRef.current >= text.length) clearInterval(interval)
    }, speed)

    const skipHandler = () => {
      setDisplayed(text)
      indexRef.current = text.length
    }
    document.addEventListener('skipTypewriter', skipHandler)

    return () => {
      clearInterval(interval)
      document.removeEventListener('skipTypewriter', skipHandler)
    }
  }, [text, speed])

  return displayed
}

export function StoryPanel({ gameState, isGenerating, onChoice, onCustomChoice }: StoryPanelProps) {
  const { currentScene, style, commits, commitIndex } = gameState
  const narrative = currentScene?.narrative || ''
  const displayed = useTypewriter(narrative)
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    sceneRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [narrative])

  const locations = LOCATION_NAMES[style] || LOCATION_NAMES.dnd
  const progress = commits.length > 0 ? commitIndex / (commits.length - 1) : 0
  const locIdx = Math.min(Math.floor(progress * (locations.length - 1)), locations.length - 1)
  const commit = commits[commitIndex] || null
  const locationLabel = currentScene?.isEpilogue ? '✦ Epilogue ✦' : (commit ? locations[locIdx] : '')

  const handleChoice = (indexOrText: number | string) => {
    if (typeof indexOrText === 'number') {
      onChoice(indexOrText)
    } else {
      onCustomChoice(indexOrText)
    }
  }

  return (
    <div className={styles.panel}>
      <div className={`${styles.scene} scene-location-wrapper`} ref={sceneRef}>
        {locationLabel && (
          <div className={`${styles.location} scene-location`}>{locationLabel}</div>
        )}
        <div className={`${styles.storyText} story-text`}>
          {displayed.split('\n').map((line, i) => (
            <p key={i} style={{ marginBottom: line ? '1.2em' : '0' }}>{line}</p>
          ))}
        </div>
      </div>

      {isGenerating ? (
        <div className={styles.generatingIndicator}>
          <div className={styles.dots}>
            <span className={styles.dot1} />
            <span className={styles.dot2} />
            <span className={styles.dot3} />
          </div>
          <span>The oracle weaves your fate...</span>
        </div>
      ) : (
        currentScene && (
          <ChoicesPanel
            choices={currentScene.choices}
            disabled={isGenerating}
            onChoice={handleChoice}
          />
        )
      )}
    </div>
  )
}
