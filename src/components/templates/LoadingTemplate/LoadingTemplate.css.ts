import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";
import { spinPulse } from "@/styles/animations.css";

export const page = style({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
});

export const content = style({
  textAlign: "center",
  maxWidth: "400px",
  padding: "40px 24px",
});

export const icon = style({
  fontSize: "4rem",
  display: "block",
  marginBottom: "20px",
  animation: `${spinPulse} 2s ease-in-out infinite`,
  className: "loading-icon",
});

export const title = style({
  fontFamily: vars.font.title,
  fontSize: "1.4rem",
  color: vars.color.accent,
  marginBottom: "24px",
});

export const fact = style({
  marginTop: "16px",
  fontStyle: "italic",
  color: vars.color.textDim,
  fontSize: "0.9rem",
  minHeight: "2.5em",
  transition: `opacity ${vars.transition.med}`,
});
