import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const btn = style({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  width: "100%",
  padding: "12px 16px",
  background: vars.color.choiceBg,
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: "0.92rem",
  lineHeight: "1.5",
  textAlign: "left",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  cursor: "pointer",
  transition: `all ${vars.transition.fast}`,
  ":hover": {
    borderColor: vars.color.accent,
    background: vars.color.choiceHover,
    boxShadow: `inset 0 0 0 1px ${vars.color.accent}`,
  },
  ":disabled": {
    opacity: "0.5",
    cursor: "not-allowed",
  },
});

export const number = style({
  fontFamily: vars.font.title,
  color: vars.color.accent,
  fontSize: "0.85rem",
  minWidth: "16px",
  paddingTop: "1px",
});

export const text = style({
  flex: 1,
});
