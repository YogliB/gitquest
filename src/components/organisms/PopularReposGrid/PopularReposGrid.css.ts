import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const section = style({
  marginTop: "40px",
});

export const title = style({
  fontFamily: vars.font.title,
  fontSize: "1.1rem",
  color: vars.color.textDim,
  marginBottom: "16px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "14px",
  "@media": {
    "screen and (max-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    },
  },
});
