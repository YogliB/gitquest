import { createGlobalTheme, globalStyle } from "@vanilla-extract/css";
import { vars } from "../contract.css";
import { textFlicker, iconFlicker, horrorPulse, floatParticle } from "../animations.css";

createGlobalTheme('[data-theme="horror"]', vars, {
  font: {
    title: '"Creepster", cursive',
    body: '"Special Elite", serif',
    mono: '"Special Elite", serif',
    ui: '"Special Elite", serif',
  },
  color: {
    bg: "#050205",
    surface: "#0d060d",
    surface2: "#150a15",
    border: "#3a1020",
    borderGlow: "#8b0000",
    text: "#c8a8b0",
    textDim: "#5a3a40",
    textBright: "#e8c8d0",
    accent: "#cc1a1a",
    accent2: "#6b006b",
    accentGlow: "rgba(204, 26, 26, 0.2)",
    hp: "#cc1a1a",
    xp: "#4a2a6a",
    choiceBg: "rgba(13, 6, 13, 0.97)",
    choiceHover: "rgba(204, 26, 26, 0.08)",
  },
  radius: { sm: "0px", md: "2px", lg: "4px", xl: "6px" },
  shadow: {
    glow: "0 0 20px rgba(204, 26, 26, 0.2)",
    card: "0 4px 24px rgba(0, 0, 0, 0.9)",
    text: "0 2px 8px rgba(0, 0, 0, 0.9)",
  },
  transition: { fast: "200ms ease", med: "400ms ease", slow: "800ms ease" },
  zIndex: { bg: "0", content: "10", overlay: "100", modal: "200" },
});

// Vignette overlay
globalStyle('[data-theme="horror"]::before', {
  content: '""',
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.7) 100%)",
  pointerEvents: "none",
  zIndex: "9998",
});

// Noise texture overlay
globalStyle('[data-theme="horror"]::after', {
  content: '""',
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
  backgroundRepeat: "repeat",
  backgroundSize: "200px 200px",
  pointerEvents: "none",
  zIndex: "9997",
  opacity: "0.5",
});

// Logo text flicker
globalStyle('[data-theme="horror"] .logo-text', {
  color: "#cc1a1a",
  textShadow: "0 0 10px rgba(204, 26, 26, 0.5)",
  animation: `${textFlicker} 8s linear infinite`,
});

// Loading icon
globalStyle('[data-theme="horror"] .loading-icon', {
  animation: `${horrorPulse} 2s ease-in-out infinite`,
});

// Logo icon
globalStyle('[data-theme="horror"] .logo-icon', {
  animation: `${iconFlicker} 4s ease-in-out infinite`,
});

// Particle as blood drops
globalStyle('[data-theme="horror"] .particle', {
  width: "3px",
  height: "3px",
  background: "radial-gradient(circle, #cc1a1a, #660000)",
  borderRadius: "50% 50% 50% 0",
  animation: `${floatParticle} var(--particle-duration, 10s) ease-in infinite`,
});

// Background gradients
globalStyle(
  '[data-theme="horror"] .landing-bg, [data-theme="horror"] .style-bg, [data-theme="horror"] .game-bg',
  {
    background:
      "radial-gradient(ellipse at 30% 70%, rgba(204, 26, 26, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(107, 0, 107, 0.04) 0%, transparent 50%)",
  },
);

// Choice buttons — no border radius
globalStyle('[data-theme="horror"] .choice-btn', {
  borderRadius: "0",
});

globalStyle('[data-theme="horror"] .choice-btn:hover', {
  boxShadow: "inset 0 0 10px rgba(204, 26, 26, 0.2)",
});

// Primary button
globalStyle('[data-theme="horror"] .btn-primary', {
  background: "linear-gradient(135deg, #cc1a1a, #881010)",
});
