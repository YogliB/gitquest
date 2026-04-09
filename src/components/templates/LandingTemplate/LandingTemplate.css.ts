import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const page = style({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  position: "relative",
});

export const bg = style({
  position: "fixed",
  inset: 0,
  zIndex: vars.zIndex.bg,
  className: "landing-bg",
});

export const content = style({
  position: "relative",
  zIndex: vars.zIndex.content,
  display: "flex",
  flexDirection: "column",
  flex: 1,
});

export const main = style({
  maxWidth: "960px",
  margin: "0 auto",
  padding: "0 24px 40px",
  width: "100%",
});

export const footer = style({
  padding: "24px",
  textAlign: "center",
  color: vars.color.textDim,
  fontSize: "0.85rem",
  marginTop: "auto",
});

export const footerLinks = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  marginTop: "8px",
});

export const footerLink = style({
  color: vars.color.accent,
  textDecoration: "none",
  ":hover": { opacity: "0.8" },
});
