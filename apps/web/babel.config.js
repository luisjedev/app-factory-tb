import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  presets: ["next/babel"],
  plugins: [
    [
      "@stylexjs/babel-plugin",
      {
        dev: process.env.NODE_ENV !== "production",
        runtimeInjection: false,
        treeshakeCompensation: true,
        aliases: {
          "@/*": [path.join(__dirname, "*")],
        },
        unstable_moduleResolution: {
          type: "commonJS",
        },
      },
    ],
  ],
};
