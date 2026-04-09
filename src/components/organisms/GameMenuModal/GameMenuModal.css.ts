import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const backdrop = style({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  backdropFilter: "blur(4px)",
  zIndex: vars.zIndex.modal,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
});

export const content = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: "32px",
  width: "100%",
  maxWidth: "380px",
  position: "relative",
  maxHeight: "90vh",
  overflowY: "auto",
});

export const title = style({
  fontFamily: vars.font.title,
  fontSize: "1.2rem",
  color: vars.color.accent,
  marginBottom: "20px",
});

export const closeBtn = style({
  position: "absolute",
  top: "16px",
  right: "16px",
  background: "transparent",
  border: "none",
  color: vars.color.textDim,
  fontSize: "1.2rem",
  cursor: "pointer",
  ":hover": { color: vars.color.text },
});

export const menuButtons = style({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "20px",
});

export const saveSlots = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const noSaves = style({
  fontSize: "0.85rem",
  color: vars.color.textDim,
  fontStyle: "italic",
  textAlign: "center",
  padding: "12px",
});
