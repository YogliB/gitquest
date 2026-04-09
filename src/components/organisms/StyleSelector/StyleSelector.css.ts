import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/contract.css'

export const main = style({
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '40px 24px',
  width: '100%',
})

export const title = style({
  fontFamily: vars.font.title,
  fontSize: 'clamp(1.8rem, 3vw, 3rem)',
  color: vars.color.accent,
  textAlign: 'center',
  marginBottom: '8px',
})

export const subtitle = style({
  textAlign: 'center',
  color: vars.color.textDim,
  marginBottom: '40px',
})

export const cards = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '24px',
  '@media': {
    'screen and (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
})
