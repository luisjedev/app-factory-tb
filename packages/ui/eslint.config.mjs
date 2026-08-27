import stylexPlugin from "@stylexjs/eslint-plugin";
import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    files: [".babelrc.js"],
    languageOptions: {
      globals: {
        module: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "turbo/no-undeclared-env-vars": "off",
    },
  },
  {
    plugins: {
      "@stylexjs": stylexPlugin,
    },
    rules: {
      "@stylexjs/valid-styles": "error",
      "@stylexjs/no-unused": "error",
      "@stylexjs/valid-shorthands": "warn",
      "@stylexjs/sort-keys": "warn",
    },
  },
];
