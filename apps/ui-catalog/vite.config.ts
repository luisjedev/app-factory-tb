import { createStylexVitePlugin } from "@repo/stylex-config/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [createStylexVitePlugin(), react()],
});
