import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/contract.css'

export const sidebar = style({
  width: '240px',
  background: vars.color.surface,
  borderLeft: `1px solid ${vars.color.border}`,
  overflowY: 'auto',
  padding: '16px',
  flexShrink: 0,
  '@media': {
    'screen and (max-width: 768px)': {
      display: 'none',
    },
  },
})

export const section = style({
  marginBottom: '20px',
})

export const sectionTitle = style({
  fontSize: '0.7rem',
  fontFamily: vars.font.ui,
  color: vars.color.textDim,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  marginBottom: '10px',
  paddingBottom: '6px',
  borderBottom: `1px solid ${vars.color.border}`,
})

export const inventoryList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
})

export const emptyInventory = style({
  fontSize: '0.78rem',
  color: vars.color.textDim,
  fontStyle: 'italic',
})

export const questLog = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const questEntry = style({
  fontSize: '0.78rem',
  color: vars.color.textDim,
  lineHeight: '1.4',
  borderLeft: `2px solid ${vars.color.accent}`,
  paddingLeft: '8px',
})
