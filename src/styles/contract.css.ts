import { createThemeContract } from "@vanilla-extract/css";

export const vars = createThemeContract({
  font: {
    title: null,
    body: null,
    mono: null,
    ui: null,
  },
  color: {
    bg: null,
    surface: null,
    surface2: null,
    border: null,
    borderGlow: null,
    text: null,
    textDim: null,
    textBright: null,
    accent: null,
    accent2: null,
    accentGlow: null,
    hp: null,
    xp: null,
    choiceBg: null,
    choiceHover: null,
  },
  radius: {
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
  shadow: {
    glow: null,
    card: null,
    text: null,
  },
  transition: {
    fast: null,
    med: null,
    slow: null,
  },
  zIndex: {
    bg: null,
    content: null,
    overlay: null,
    modal: null,
  },
});
