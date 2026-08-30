import { globalIgnores } from "eslint/config";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import { config as reactConfig } from "./react-internal.js";

/**
 * Shared ESLint configuration for React applications built with Vite.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const viteConfig = [
  ...reactConfig,
  globalIgnores(["dist/**"]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      ...pluginReactRefresh.configs.vite.rules,
    },
  },
];
