import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/contract.css'

export const container = style({
  fontSize: '0.75rem',
  color: vars.color.textDim,
  lineHeight: '1.5',
})

export const hash = style({
  color: vars.color.accent,
  fontFamily: vars.font.mono,
  letterSpacing: '0.05em',
})

export const message = style({
  fontStyle: 'italic',
  marginTop: '4px',
})

export const author = style({
  marginTop: '4px',
  color: vars.color.textDim,
})
