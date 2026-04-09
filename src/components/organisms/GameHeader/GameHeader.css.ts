import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  height: "56px",
  background: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
  flexShrink: 0,
  gap: "12px",
});

export const left = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  minWidth: 0,
});

export const center = style({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
});

export const right = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const repoInfo = style({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
});

export const repoName = style({
  fontSize: "0.8rem",
  color: vars.color.textDim,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const styleBadge = style({
  fontSize: "0.7rem",
  color: vars.color.accent,
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
});

export const chapterInfo = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const chapterLabel = style({
  fontSize: "0.65rem",
  color: vars.color.textDim,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
});

export const chapterNum = style({
  fontFamily: vars.font.title,
  fontSize: "1.2rem",
  color: vars.color.accent,
  lineHeight: "1",
});

export const menuBtn = style({
  fontSize: "1.3rem",
  padding: "6px",
  background: "transparent",
  border: "none",
  color: vars.color.textDim,
  cursor: "pointer",
  ":hover": { color: vars.color.text },
});

export const volumeSlider = style({
  width: "80px",
  accentColor: vars.color.accent,
});
