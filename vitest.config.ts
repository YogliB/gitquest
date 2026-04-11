import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts", "src/store/**/*.ts"],
      exclude: ["src/**/*.css.ts", "src/types/**", "src/main.tsx"],
      thresholds: {
        perFile: true,
        statements: 80,
        lines: 80,
        functions: 80,
        branches: 80,
      },
    },
  },
});
