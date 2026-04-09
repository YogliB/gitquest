import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

const spin = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export const page = style({
  minHeight: "100vh",
  background: vars.color.bg,
  color: vars.color.text,
  fontFamily: vars.font.body,
  display: "flex",
  flexDirection: "column",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "1.25rem 2rem",
  borderBottom: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
});

export const backBtn = style({
  background: "none",
  border: `1px solid ${vars.color.border}`,
  color: vars.color.textDim,
  padding: "0.4rem 0.8rem",
  borderRadius: vars.radius.sm,
  cursor: "pointer",
  fontFamily: vars.font.ui,
  fontSize: "0.85rem",
  transition: vars.transition.fast,
  flexShrink: 0,
  ":hover": {
    color: vars.color.textBright,
    borderColor: vars.color.accent,
  },
});

export const repoTitle = style({
  fontFamily: vars.font.title,
  fontSize: "1.25rem",
  color: vars.color.textBright,
  margin: 0,
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const commitCount = style({
  fontSize: "0.8rem",
  color: vars.color.textDim,
  fontFamily: vars.font.mono,
  flexShrink: 0,
});

export const main = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2.5rem",
  padding: "3rem 2rem",
  maxWidth: "640px",
  margin: "0 auto",
  width: "100%",
});

// ─── Style Switcher ─────────────────────────────────────────────────────────

export const styleRow = style({
  display: "flex",
  gap: "0.75rem",
});

export const styleBtn = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  color: vars.color.textDim,
  padding: "0.5rem 1.25rem",
  borderRadius: vars.radius.md,
  cursor: "pointer",
  fontFamily: vars.font.ui,
  fontSize: "0.9rem",
  transition: vars.transition.fast,
  ":hover": {
    color: vars.color.textBright,
    borderColor: vars.color.accent,
  },
});

export const styleBtnActive = style({
  background: vars.color.surface2,
  borderColor: vars.color.accent,
  color: vars.color.textBright,
  boxShadow: vars.shadow.glow,
});

// ─── Player Controls ─────────────────────────────────────────────────────────

export const player = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.5rem",
  width: "100%",
});

export const playBtn = style({
  width: "4.5rem",
  height: "4.5rem",
  borderRadius: "50%",
  background: vars.color.accent,
  border: "none",
  color: vars.color.bg,
  fontSize: "1.5rem",
  cursor: "pointer",
  transition: vars.transition.fast,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: vars.shadow.glow,
  ":hover": {
    opacity: 0.85,
    transform: "scale(1.05)",
  },
  ":disabled": {
    opacity: 0.4,
    cursor: "not-allowed",
    transform: "none",
  },
});

export const volumeRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  width: "100%",
  maxWidth: "280px",
});

export const volIcon = style({
  fontSize: "1rem",
  flexShrink: 0,
});

export const volumeSlider = style({
  flex: 1,
  accentColor: vars.color.accent,
  cursor: "pointer",
});

// ─── Analysis Stats ──────────────────────────────────────────────────────────

export const stats = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "1rem",
  width: "100%",
});

export const stat = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.35rem",
});

export const statLabel = style({
  fontSize: "0.7rem",
  color: vars.color.textDim,
  fontFamily: vars.font.mono,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
});

export const statValue = style({
  fontSize: "1.4rem",
  color: vars.color.accent,
  fontFamily: vars.font.title,
});

// ─── Loading / Error States ──────────────────────────────────────────────────

export const loadingWrap = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  color: vars.color.textDim,
  fontFamily: vars.font.body,
});

export const spinner = style({
  width: "2rem",
  height: "2rem",
  border: `3px solid ${vars.color.border}`,
  borderTopColor: vars.color.accent,
  borderRadius: "50%",
  animation: `${spin} 0.8s linear infinite`,
});

export const errorWrap = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1.25rem",
  padding: "2rem",
  color: vars.color.text,
  fontFamily: vars.font.body,
  textAlign: "center",
});
