import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const base = style({
  width: "100%",
  padding: "10px 14px",
  background: vars.color.surface,
  color: vars.color.textBright,
  fontFamily: vars.font.body,
  fontSize: "0.9rem",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  outline: "none",
  transition: `border-color ${vars.transition.fast}`,
  ":focus": {
    borderColor: vars.color.accent,
    boxShadow: `0 0 0 2px ${vars.color.accentGlow}`,
  },
  "::placeholder": {
    color: vars.color.textDim,
  },
});

export const variants = styleVariants({
  default: {},
  password: { letterSpacing: "0.1em" },
});
