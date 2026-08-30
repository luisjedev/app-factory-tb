import { stylexCssLayers } from "./shared.js";

/**
 * @typedef {object} NextStylexPostcssOptions
 * @property {{ plugins?: unknown[] }} babelConfig
 * @property {string[]} include
 */

/**
 * Creates the PostCSS configuration for a Next.js application.
 *
 * @param {NextStylexPostcssOptions} options
 */
export function createNextStylexPostcssConfig({ babelConfig, include }) {
  return {
    plugins: {
      "@stylexjs/postcss-plugin": {
        include,
        babelConfig: {
          babelrc: false,
          parserOpts: {
            plugins: ["typescript", "jsx"],
          },
          plugins: babelConfig.plugins ?? [],
        },
        useCSSLayers: stylexCssLayers,
      },
      autoprefixer: {},
    },
  };
}
