import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/contract.css'

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.75)',
  backdropFilter: 'blur(4px)',
  zIndex: vars.zIndex.modal,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
})

export const content = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: '32px',
  width: '100%',
  maxWidth: '520px',
  position: 'relative',
  maxHeight: '90vh',
  overflowY: 'auto',
})

export const title = style({
  fontFamily: vars.font.title,
  fontSize: '1.2rem',
  color: vars.color.accent,
  marginBottom: '24px',
})

export const closeBtn = style({
  position: 'absolute',
  top: '16px',
  right: '16px',
  background: 'transparent',
  border: 'none',
  color: vars.color.textDim,
  fontSize: '1.2rem',
  cursor: 'pointer',
  padding: '4px 8px',
  ':hover': {
    color: vars.color.text,
  },
})

export const section = style({
  marginBottom: '24px',
})

export const label = style({
  display: 'block',
  fontSize: '0.8rem',
  color: vars.color.textDim,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  marginBottom: '8px',
  fontFamily: vars.font.ui,
})

export const hint = style({
  fontSize: '0.78rem',
  color: vars.color.textDim,
  marginTop: '6px',
})

export const radioGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const radioOption = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  ':hover': {
    borderColor: vars.color.accent,
  },
})

export const select = style({
  width: '100%',
  padding: '10px 14px',
  background: vars.color.surface2,
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: '0.9rem',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  outline: 'none',
  ':focus': {
    borderColor: vars.color.accent,
  },
})

export const rateLimitStatus = style({
  padding: '10px 14px',
  background: vars.color.surface2,
  borderRadius: vars.radius.md,
  fontSize: '0.82rem',
  color: vars.color.textDim,
  marginTop: '8px',
})
