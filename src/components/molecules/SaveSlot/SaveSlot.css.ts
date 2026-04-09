import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const slot = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 14px",
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  gap: "10px",
});

export const info = style({
  flex: 1,
  minWidth: 0,
});

export const name = style({
  fontWeight: "600",
  color: vars.color.text,
  fontSize: "0.85rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const meta = style({
  fontSize: "0.72rem",
  color: vars.color.textDim,
  marginTop: "2px",
});

export const actions = style({
  display: "flex",
  gap: "6px",
});

export const btn = style({
  padding: "4px 10px",
  fontSize: "0.78rem",
  fontFamily: vars.font.ui,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border}`,
  cursor: "pointer",
  transition: `all ${vars.transition.fast}`,
});

export const loadBtn = style([
  btn,
  {
    background: vars.color.accent,
    color: vars.color.bg,
    borderColor: vars.color.accent,
  },
]);

export const deleteBtn = style([
  btn,
  {
    background: "transparent",
    color: vars.color.textDim,
    ":hover": {
      color: vars.color.accent2,
      borderColor: vars.color.accent2,
    },
  },
]);
