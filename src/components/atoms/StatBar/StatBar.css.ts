import { style, styleVariants } from '@vanilla-extract/css'
import { vars } from '@/styles/contract.css'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '6px',
})

export const label = style({
  fontSize: '0.7rem',
  fontFamily: vars.font.ui,
  color: vars.color.textDim,
  width: '20px',
  textTransform: 'uppercase',
})

export const track = style({
  flex: 1,
  height: '6px',
  background: vars.color.surface2,
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
})

export const fillVariants = styleVariants({
  hp: {
    height: '100%',
    background: `linear-gradient(90deg, ${vars.color.hp}, color-mix(in srgb, ${vars.color.hp} 60%, white))`,
    transition: `width ${vars.transition.med}`,
  },
  xp: {
    height: '100%',
    background: `linear-gradient(90deg, ${vars.color.xp}, color-mix(in srgb, ${vars.color.xp} 60%, white))`,
    transition: `width ${vars.transition.med}`,
  },
})

export const value = style({
  fontSize: '0.7rem',
  color: vars.color.textDim,
  width: '28px',
  textAlign: 'right',
})
