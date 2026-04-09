import { style } from '@vanilla-extract/css'
import { floatParticle } from '@/styles/animations.css'

export const container = style({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
})

export const particle = style({
  position: 'absolute',
  width: '2px',
  height: '2px',
  borderRadius: '50%',
  animation: `${floatParticle} var(--duration, 8s) ease-in infinite`,
  className: 'particle',
})
