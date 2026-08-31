import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Component tests observe semantics; production builds verify StyleX compilation.
    alias: {
      "@stylexjs/stylex": fileURLToPath(
        new URL("./src/test/stylex.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
