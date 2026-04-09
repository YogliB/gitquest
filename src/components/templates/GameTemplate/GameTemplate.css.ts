import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/contract.css";

export const page = style({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
});

export const bg = style({
  position: "fixed",
  inset: 0,
  zIndex: vars.zIndex.bg,
});

export const layout = style({
  position: "relative",
  zIndex: vars.zIndex.content,
  display: "flex",
  flex: 1,
  overflow: "hidden",
  height: "calc(100vh - 56px)",
});

export const main = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});
