import stylexPlugin from "@stylexjs/eslint-plugin";

/**
 * Shared StyleX rules for every workspace that authors styles.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const stylexConfig = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@stylexjs": stylexPlugin,
    },
    rules: {
      "@stylexjs/valid-styles": "error",
      "@stylexjs/no-unused": "error",
      "@stylexjs/no-legacy-contextual-styles": "error",
      "@stylexjs/valid-shorthands": "warn",
    },
  },
];
