import { createGlobalTheme, globalStyle } from '@vanilla-extract/css'
import { vars } from '../contract.css'
import { candleFlicker, floatParticle } from '../animations.css'

createGlobalTheme('[data-theme="dnd"]', vars, {
  font: {
    title: '"Cinzel Decorative", serif',
    body: '"Cinzel", serif',
    mono: '"Special Elite", serif',
    ui: '"Cinzel", serif',
  },
  color: {
    bg: '#0f0b06',
    surface: '#1e1509',
    surface2: '#2d1f0d',
    border: '#5a3e18',
    borderGlow: '#c8922a',
    text: '#e8d5a3',
    textDim: '#8a7050',
    textBright: '#f5e6c0',
    accent: '#c8922a',
    accent2: '#8b3a3a',
    accentGlow: 'rgba(200, 146, 42, 0.25)',
    hp: '#8b3a3a',
    xp: '#3a7a3a',
    choiceBg: 'rgba(30, 21, 9, 0.95)',
    choiceHover: 'rgba(200, 146, 42, 0.12)',
  },
  radius: { sm: '4px', md: '8px', lg: '16px', xl: '24px' },
  shadow: {
    glow: '0 0 20px rgba(200, 146, 42, 0.25)',
    card: '0 4px 24px rgba(0, 0, 0, 0.6)',
    text: '0 2px 8px rgba(0, 0, 0, 0.8)',
  },
  transition: { fast: '150ms ease', med: '300ms ease', slow: '600ms ease' },
  zIndex: { bg: '0', content: '10', overlay: '100', modal: '200' },
})

// D&D specific overrides
globalStyle('[data-theme="dnd"] .scene-location::before', {
  content: '"— "',
  color: 'var(--color-accent)',
})

globalStyle('[data-theme="dnd"] .scene-location::after', {
  content: '" —"',
  color: 'var(--color-accent)',
})

globalStyle('[data-theme="dnd"] .loading-icon', {
  animation: `${candleFlicker} 1.5s ease-in-out infinite`,
})

globalStyle('[data-theme="dnd"] .particle', {
  background: 'radial-gradient(circle, #f0c060, #c8922a)',
  animation: `${floatParticle} var(--particle-duration, 8s) ease-in infinite`,
})

globalStyle('[data-theme="dnd"] .game-bg', {
  background: 'radial-gradient(ellipse at 20% 80%, rgba(139, 58, 58, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(200, 146, 42, 0.08) 0%, transparent 50%)',
})

globalStyle('[data-theme="dnd"] .landing-bg, [data-theme="dnd"] .style-bg', {
  background: 'radial-gradient(ellipse at 50% 50%, rgba(200, 146, 42, 0.05) 0%, transparent 70%)',
})
