import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/contract.css'

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '20px 40px',
  '@media': {
    'screen and (max-width: 768px)': {
      padding: '16px 20px',
    },
  },
})

export const customContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '4px',
})

export const customLabel = style({
  fontSize: '0.78rem',
  color: vars.color.textDim,
  fontFamily: vars.font.ui,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
})

export const inputWrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: vars.color.choiceBg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: '4px 4px 4px 12px',
  ':focus-within': {
    borderColor: vars.color.accent,
    boxShadow: `0 0 0 2px ${vars.color.accentGlow}`,
  },
})

export const customInput = style({
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: '0.9rem',
  padding: '6px 0',
  '::placeholder': {
    color: vars.color.textDim,
  },
})

export const submitBtn = style({
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: vars.color.accent,
  color: vars.color.bg,
  border: 'none',
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  fontSize: '1rem',
  transition: `opacity ${vars.transition.fast}`,
  ':hover': {
    opacity: '0.85',
  },
})
