import { resolveConfigDirectory, stylexCssLayers } from "./shared.js";

/**
 * @typedef {object} NextStylexPostcssOptions
 * @property {string | URL} configFileUrl
 */

/**
 * Creates the PostCSS configuration for a Next.js application.
 * StyleX discovers the app sources and direct source-package dependencies.
 *
 * @param {NextStylexPostcssOptions} options
 */
export function createNextStylexPostcssConfig({ configFileUrl }) {
  return {
    plugins: {
      "@stylexjs/postcss-plugin": {
        cwd: resolveConfigDirectory(configFileUrl),
        useCSSLayers: stylexCssLayers,
      },
      autoprefixer: {},
    },
  };
}
