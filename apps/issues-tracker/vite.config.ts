import { createStylexVitePlugin } from "@repo/stylex-config/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { issuesPlugin } from "./vite/issues-plugin.js";

export default defineConfig({
  plugins: [createStylexVitePlugin(), issuesPlugin(), react()],
  server: {
    port: 3002,
    strictPort: true,
  },
  preview: {
    port: 3002,
    strictPort: true,
  },
});
