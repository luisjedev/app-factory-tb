import { config } from "@repo/eslint-config/base";

export default [
  ...config,
  {
    files: ["babel.js"],
    rules: {
      // NODE_ENV is supplied by Next.js rather than by an app-owned env file.
      "turbo/no-undeclared-env-vars": "off",
    },
  },
];
