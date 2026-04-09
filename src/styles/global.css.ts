import { globalStyle } from '@vanilla-extract/css'
import { vars } from './contract.css'

// ─── Reset ────────────────────────────────────────────────────────────────────

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
})

globalStyle('html', {
  height: '100%',
  scrollBehavior: 'smooth',
})

globalStyle('body', {
  minHeight: '100%',
  background: vars.color.bg,
  color: vars.color.text,
  fontFamily: vars.font.body,
  lineHeight: '1.6',
  overflowX: 'hidden',
})

globalStyle('#root', {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
})

// ─── Typography base ──────────────────────────────────────────────────────────

globalStyle('button', {
  cursor: 'pointer',
  fontFamily: 'inherit',
  border: 'none',
  background: 'none',
})

globalStyle('input, select, textarea', {
  fontFamily: 'inherit',
})

globalStyle('a', {
  color: vars.color.accent,
  textDecoration: 'none',
})

globalStyle('a:hover', {
  opacity: '0.8',
})
