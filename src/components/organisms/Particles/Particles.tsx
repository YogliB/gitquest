import { useEffect, useRef } from 'react'
import * as styles from './Particles.css'

interface ParticlesProps {
  count?: number
}

export function Particles({ count = 35 }: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.innerHTML = ''
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div')
      p.className = `${styles.particle} particle`
      p.style.left = `${Math.random() * 100}%`
      p.style.bottom = `${Math.random() * 20}%`
      const duration = 6 + Math.random() * 8
      p.style.setProperty('--duration', `${duration}s`)
      p.style.animationDelay = `${Math.random() * duration}s`
      container.appendChild(p)
    }
  }, [count])

  return <div ref={containerRef} className={styles.container} />
}
