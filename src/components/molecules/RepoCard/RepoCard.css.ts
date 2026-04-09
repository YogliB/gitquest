import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const card = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: "14px",
  cursor: "pointer",
  transition: `all ${vars.transition.fast}`,
  ":hover": {
    borderColor: vars.color.accent,
    boxShadow: `0 4px 16px ${vars.color.accentGlow}`,
    transform: "translateY(-2px)",
  },
});

export const name = style({
  fontFamily: vars.font.title,
  fontSize: "0.9rem",
  fontWeight: "600",
  color: vars.color.accent,
  marginBottom: "2px",
});

export const owner = style({
  fontSize: "0.75rem",
  color: vars.color.textDim,
  marginBottom: "6px",
});

export const desc = style({
  fontSize: "0.78rem",
  color: vars.color.textDim,
  lineHeight: "1.4",
  marginBottom: "8px",
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

export const stats = style({
  display: "flex",
  gap: "10px",
  fontSize: "0.72rem",
  color: vars.color.textDim,
});
