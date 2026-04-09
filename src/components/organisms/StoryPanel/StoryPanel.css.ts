import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";
import { dotBounce } from "@/styles/animations.css";

export const panel = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

export const scene = style({
  flex: 1,
  overflowY: "auto",
  padding: "32px 40px",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "20px",
    },
  },
});

export const location = style({
  fontSize: "0.75rem",
  fontFamily: vars.font.ui,
  color: vars.color.accent,
  textTransform: "uppercase" as const,
  letterSpacing: "0.12em",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  className: "scene-location",
});

export const storyText = style({
  fontSize: "1.05rem",
  lineHeight: "1.9",
  color: vars.color.text,
  maxWidth: "72ch",
  fontFamily: vars.font.body,
  className: "story-text",
});

export const generatingIndicator = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "16px 40px",
  color: vars.color.textDim,
  fontSize: "0.85rem",
  fontStyle: "italic",
});

export const dots = style({
  display: "flex",
  gap: "4px",
});

export const dot = style({
  display: "inline-block",
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: vars.color.accent,
});

export const dot1 = style([dot, { animation: `${dotBounce} 1.2s ease-in-out infinite` }]);
export const dot2 = style([dot, { animation: `${dotBounce} 1.2s ease-in-out 0.2s infinite` }]);
export const dot3 = style([dot, { animation: `${dotBounce} 1.2s ease-in-out 0.4s infinite` }]);
