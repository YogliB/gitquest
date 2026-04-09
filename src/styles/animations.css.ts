import { keyframes } from "@vanilla-extract/css";

export const pulseGlow = keyframes({
  "0%, 100%": { filter: "drop-shadow(0 0 8px currentColor)", transform: "scale(1)" },
  "50%": { filter: "drop-shadow(0 0 20px currentColor)", transform: "scale(1.05)" },
});

export const floatParticle = keyframes({
  "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
  "10%": { opacity: "1" },
  "90%": { opacity: "0.5" },
  "100%": { transform: "translateY(-100vh) translateX(20px)", opacity: "0" },
});

export const spinPulse = keyframes({
  "0%": { transform: "rotate(0deg) scale(1)" },
  "50%": { transform: "rotate(180deg) scale(1.1)" },
  "100%": { transform: "rotate(360deg) scale(1)" },
});

export const dotBounce = keyframes({
  "0%, 80%, 100%": { transform: "scale(0)", opacity: "0" },
  "40%": { transform: "scale(1)", opacity: "1" },
});

export const slideInRight = keyframes({
  from: { transform: "translateX(100%)", opacity: "0" },
  to: { transform: "translateX(0)", opacity: "1" },
});

// D&D specific
export const candleFlicker = keyframes({
  "0%, 100%": { filter: "drop-shadow(0 0 6px #c8922a)", transform: "scale(1)" },
  "25%": { filter: "drop-shadow(0 0 12px #e8a830)", transform: "scale(1.08)" },
  "50%": { filter: "drop-shadow(0 0 4px #a07020)", transform: "scale(0.96)" },
  "75%": { filter: "drop-shadow(0 0 16px #c8922a)", transform: "scale(1.04)" },
});

// Sci-Fi specific
export const glitchPulse = keyframes({
  "0%, 100%": { textShadow: "0 0 10px #00d4ff, 0 0 20px #00d4ff" },
  "25%": { textShadow: "-2px 0 #9b30ff, 2px 0 #00d4ff, 0 0 20px #00d4ff" },
  "50%": { textShadow: "2px 0 #9b30ff, -2px 0 #00d4ff, 0 0 30px #00d4ff" },
  "75%": { textShadow: "0 0 10px #00d4ff, 0 0 20px #9b30ff" },
});

export const blinkCursor = keyframes({
  "0%, 100%": { opacity: "1" },
  "50%": { opacity: "0" },
});

export const rotateRing = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

// Horror specific
export const textFlicker = keyframes({
  "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
  "20%, 24%, 55%": { opacity: "0.8" },
  "22%": { opacity: "0.4" },
});

export const iconFlicker = keyframes({
  "0%, 100%": { filter: "drop-shadow(0 0 8px #cc1a1a)", opacity: "1" },
  "50%": { filter: "drop-shadow(0 0 2px #660000)", opacity: "0.7" },
  "75%": { filter: "drop-shadow(0 0 15px #cc1a1a)", opacity: "0.9" },
});

export const horrorPulse = keyframes({
  "0%, 100%": { filter: "drop-shadow(0 0 6px #cc1a1a)", transform: "scale(1)" },
  "50%": { filter: "drop-shadow(0 0 20px #cc1a1a)", transform: "scale(1.08)" },
});
