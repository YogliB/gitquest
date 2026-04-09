import { createGlobalTheme, globalStyle } from '@vanilla-extract/css'
import { vars } from '../contract.css'
import { glitchPulse, rotateRing, floatParticle, blinkCursor } from '../animations.css'

createGlobalTheme('[data-theme="scifi"]', vars, {
  font: {
    title: '"Orbitron", sans-serif',
    body: '"Share Tech Mono", monospace',
    mono: '"Share Tech Mono", monospace',
    ui: '"Orbitron", sans-serif',
  },
  color: {
    bg: '#020810',
    surface: '#060f1a',
    surface2: '#0a1825',
    border: '#0d3a5c',
    borderGlow: '#00d4ff',
    text: '#a8d8f0',
    textDim: '#3a6a8a',
    textBright: '#e0f4ff',
    accent: '#00d4ff',
    accent2: '#9b30ff',
    accentGlow: 'rgba(0, 212, 255, 0.2)',
    hp: '#ff3a6e',
    xp: '#00ff9b',
    choiceBg: 'rgba(6, 15, 26, 0.95)',
    choiceHover: 'rgba(0, 212, 255, 0.08)',
  },
  radius: { sm: '2px', md: '4px', lg: '8px', xl: '12px' },
  shadow: {
    glow: '0 0 20px rgba(0, 212, 255, 0.2)',
    card: '0 4px 24px rgba(0, 0, 0, 0.8)',
    text: '0 0 10px rgba(0, 212, 255, 0.5)',
  },
  transition: { fast: '100ms ease', med: '200ms ease', slow: '400ms ease' },
  zIndex: { bg: '0', content: '10', overlay: '100', modal: '200' },
})

// Scanline overlay
globalStyle('[data-theme="scifi"]::before', {
  content: '""',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.015) 2px, rgba(0, 212, 255, 0.015) 4px)',
  pointerEvents: 'none',
  zIndex: '9999',
})

// Grid background
globalStyle('[data-theme="scifi"] .landing-bg, [data-theme="scifi"] .style-bg, [data-theme="scifi"] .game-bg', {
  backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
})

// Logo text neon glow
globalStyle('[data-theme="scifi"] .logo-text', {
  textShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 40px #00d4ff',
  letterSpacing: '0.15em',
  animation: `${glitchPulse} 3s ease-in-out infinite`,
})

// Loading icon rotation
globalStyle('[data-theme="scifi"] .loading-icon', {
  animation: `${rotateRing} 2s linear infinite`,
})

// Particle as vertical lines
globalStyle('[data-theme="scifi"] .particle', {
  width: '1px',
  height: '20px',
  background: 'linear-gradient(to top, #00d4ff, transparent)',
  animation: `${floatParticle} var(--particle-duration, 6s) linear infinite`,
})

// Story text typewriter cursor
globalStyle('[data-theme="scifi"] .story-text::after', {
  content: '"▊"',
  color: '#00d4ff',
  animation: `${blinkCursor} 1s step-end infinite`,
})

// Terminal-style choice buttons
globalStyle('[data-theme="scifi"] .choice-btn::before', {
  content: '"> "',
  color: '#00d4ff',
})

// Primary button override
globalStyle('[data-theme="scifi"] .btn-primary', {
  background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
  color: '#020810',
})
