import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/gitquest/",
  plugins: [vanillaExtractPlugin(), react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  fmt: {
    ignorePatterns: ["CLAUDE.md"],
  },
  staged: {
    "*.{ts,tsx,js,jsx}": "vp check --fix",
  },
});
