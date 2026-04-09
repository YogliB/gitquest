import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/contract.css'
import { pulseGlow } from '@/styles/animations.css'

export const header = style({
  padding: '60px 20px 20px',
  textAlign: 'center',
})

export const wrap = style({
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
})

export const icon = style({
  fontSize: '3rem',
  animation: `${pulseGlow} 3s ease-in-out infinite`,
  display: 'block',
})

export const title = style({
  fontFamily: vars.font.title,
  fontSize: 'clamp(2.5rem, 5vw, 5rem)',
  color: vars.color.accent,
  textShadow: vars.shadow.text,
  lineHeight: '1.1',
})

export const tagline = style({
  fontSize: '1.1rem',
  color: vars.color.textDim,
  fontFamily: vars.font.body,
})
