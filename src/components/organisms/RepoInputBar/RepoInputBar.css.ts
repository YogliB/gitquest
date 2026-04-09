import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const section = style({
  marginBottom: "32px",
});

export const title = style({
  fontFamily: vars.font.title,
  fontSize: "1.4rem",
  color: vars.color.textBright,
  marginBottom: "8px",
});

export const subtitle = style({
  color: vars.color.textDim,
  marginBottom: "20px",
  fontSize: "0.95rem",
});

export const inputWrap = style({
  display: "flex",
  alignItems: "center",
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  overflow: "hidden",
  ":focus-within": {
    borderColor: vars.color.accent,
    boxShadow: `0 0 0 2px ${vars.color.accentGlow}`,
  },
});

export const prefix = style({
  padding: "12px 0 12px 20px",
  color: vars.color.textDim,
  fontFamily: vars.font.mono,
  fontSize: "0.9rem",
  whiteSpace: "nowrap",
});

export const input = style({
  flex: 1,
  padding: "12px 8px",
  background: "transparent",
  border: "none",
  outline: "none",
  color: vars.color.textBright,
  fontFamily: vars.font.mono,
  fontSize: "0.95rem",
  "::placeholder": {
    color: vars.color.textDim,
  },
});

export const error = style({
  marginTop: "8px",
  color: "#e05555",
  fontSize: "0.85rem",
});
