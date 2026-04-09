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
  className: "style-bg",
});

export const content = style({
  position: "relative",
  zIndex: vars.zIndex.content,
  display: "flex",
  flexDirection: "column",
  flex: 1,
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 24px",
  background: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const repoBadge = style({
  fontFamily: vars.font.mono,
  fontSize: "0.88rem",
  color: vars.color.text,
  padding: "6px 12px",
  background: vars.color.surface2,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
});
