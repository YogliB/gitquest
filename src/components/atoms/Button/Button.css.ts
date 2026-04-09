import { style, styleVariants } from '@vanilla-extract/css'
import { vars } from '@/styles/contract.css'

export const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '10px 22px',
  fontFamily: vars.font.ui,
  fontSize: '0.9rem',
  fontWeight: '600',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  cursor: 'pointer',
  transition: `all ${vars.transition.fast}`,
  whiteSpace: 'nowrap',
  ':focus-visible': {
    outline: `2px solid ${vars.color.accent}`,
    outlineOffset: '2px',
  },
  ':disabled': {
    opacity: '0.5',
    cursor: 'not-allowed',
  },
})

export const variants = styleVariants({
  primary: {
    background: `linear-gradient(135deg, ${vars.color.accent}, color-mix(in srgb, ${vars.color.accent} 70%, black))`,
    color: vars.color.bg,
    borderColor: vars.color.accent,
    boxShadow: `0 0 12px ${vars.color.accentGlow}`,
    ':hover': {
      boxShadow: `0 0 20px ${vars.color.accentGlow}`,
      transform: 'translateY(-1px)',
    },
  },
  secondary: {
    background: vars.color.surface2,
    color: vars.color.text,
    borderColor: vars.color.border,
    ':hover': {
      borderColor: vars.color.accent,
      color: vars.color.accent,
    },
  },
  ghost: {
    background: 'transparent',
    color: vars.color.textDim,
    borderColor: 'transparent',
    ':hover': {
      color: vars.color.text,
      background: `rgba(255,255,255,0.05)`,
    },
  },
  'icon-only': {
    background: 'transparent',
    color: vars.color.textDim,
    borderColor: 'transparent',
    padding: '8px',
    fontSize: '1.2rem',
    ':hover': {
      color: vars.color.text,
    },
  },
  back: {
    background: 'transparent',
    color: vars.color.textDim,
    borderColor: vars.color.border,
    padding: '6px 14px',
    fontSize: '0.85rem',
    ':hover': {
      color: vars.color.text,
      borderColor: vars.color.accent,
    },
  },
  'style-select': {
    width: '100%',
    background: `linear-gradient(135deg, ${vars.color.accent}, color-mix(in srgb, ${vars.color.accent} 70%, black))`,
    color: vars.color.bg,
    borderColor: vars.color.accent,
    marginTop: '12px',
    ':hover': {
      boxShadow: `0 0 20px ${vars.color.accentGlow}`,
      transform: 'translateY(-1px)',
    },
  },
})
