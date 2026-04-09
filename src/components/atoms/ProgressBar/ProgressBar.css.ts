import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/contract.css'

export const track = style({
  width: '100%',
  height: '6px',
  background: vars.color.surface2,
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
})

export const fill = style({
  height: '100%',
  background: `linear-gradient(90deg, ${vars.color.accent}, color-mix(in srgb, ${vars.color.accent} 70%, white))`,
  borderRadius: vars.radius.sm,
  transition: `width ${vars.transition.med}`,
})
