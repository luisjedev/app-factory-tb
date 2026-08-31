import process from "node:process";
import { resolveConfigDirectory } from "./shared.js";

/**
 * @typedef {object} NextStylexBabelOptions
 * @property {string | URL} configFileUrl
 * @property {boolean} [dev]
 * @property {Record<string, string | string[]>} [aliases]
 */

/**
 * Creates the Babel configuration used by Next.js and the StyleX PostCSS pass.
 *
 * @param {NextStylexBabelOptions} options
 */
export function createNextStylexBabelConfig({
  configFileUrl,
  dev = process.env.NODE_ENV !== "production",
  aliases,
}) {
  const rootDir = resolveConfigDirectory(configFileUrl);
  return {
    presets: ["next/babel"],
    plugins: [
      [
        "@stylexjs/babel-plugin",
        {
          dev,
          runtimeInjection: false,
          enableInlinedConditionalMerge: true,
          treeshakeCompensation: true,
          ...(aliases ? { aliases } : {}),
          unstable_moduleResolution: {
            type: "commonJS",
            rootDir,
          },
        },
      ],
    ],
  };
}
