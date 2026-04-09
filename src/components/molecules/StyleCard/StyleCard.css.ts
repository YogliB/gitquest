import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const card = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: "28px",
  cursor: "pointer",
  transition: `all ${vars.transition.med}`,
  position: "relative",
  overflow: "hidden",
  ":hover": {
    borderColor: vars.color.accent,
    boxShadow: vars.shadow.glow,
    transform: "translateY(-4px)",
  },
});

export const glow = style({
  position: "absolute",
  inset: 0,
  background: `radial-gradient(ellipse at 50% 0%, ${vars.color.accentGlow} 0%, transparent 70%)`,
  opacity: 0,
  transition: `opacity ${vars.transition.med}`,
  selectors: {
    [`${card}:hover &`]: {
      opacity: 1,
    },
  },
});

export const icon = style({
  fontSize: "2.5rem",
  marginBottom: "12px",
});

export const title = style({
  fontFamily: vars.font.title,
  fontSize: "1.3rem",
  color: vars.color.textBright,
  marginBottom: "10px",
});

export const desc = style({
  fontSize: "0.88rem",
  color: vars.color.textDim,
  lineHeight: "1.6",
  marginBottom: "16px",
});

export const preview = style({
  background: vars.color.surface2,
  borderLeft: `3px solid ${vars.color.accent}`,
  padding: "10px 14px",
  borderRadius: `0 ${vars.radius.sm} ${vars.radius.sm} 0`,
  marginBottom: "16px",
});

export const previewText = style({
  fontSize: "0.82rem",
  color: vars.color.textDim,
  fontStyle: "italic",
});
