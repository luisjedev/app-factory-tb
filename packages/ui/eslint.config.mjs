import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config} */
export default {
  ...config,
  plugins: ["@stylexjs"],
  rules: {
    "@stylexjs/valid-styles": "error",
    "@stylexjs/no-unused": "error",
    "@stylexjs/valid-shorthands": "warn",
    "@stylexjs/sort-keys": "warn",
  },
};
