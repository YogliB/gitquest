import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const base = style({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: vars.radius.md,
  fontSize: "0.75rem",
  fontFamily: vars.font.ui,
  border: `1px solid ${vars.color.border}`,
});

export const variants = styleVariants({
  repo: {
    background: vars.color.surface2,
    color: vars.color.text,
  },
  style: {
    background: "transparent",
    color: vars.color.accent,
    borderColor: vars.color.accent,
    fontSize: "0.7rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
  inventory: {
    background: vars.color.surface2,
    color: vars.color.text,
    fontSize: "0.75rem",
    padding: "3px 8px",
  },
});
