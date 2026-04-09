import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const container = style({
  marginBottom: "16px",
});

export const heroInfo = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "12px",
});

export const avatar = style({
  fontSize: "2rem",
});

export const heroName = style({
  fontSize: "0.85rem",
  color: vars.color.textBright,
  fontWeight: "600",
  fontFamily: vars.font.ui,
});

export const level = style({
  fontSize: "0.7rem",
  color: vars.color.accent,
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
});
