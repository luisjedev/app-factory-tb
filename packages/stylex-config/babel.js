/**
 * @typedef {object} NextStylexBabelOptions
 * @property {boolean} dev
 * @property {string} rootDir
 * @property {Record<string, string | string[]>} [aliases]
 */

/**
 * Creates the Babel configuration used by Next.js and the StyleX PostCSS pass.
 *
 * @param {NextStylexBabelOptions} options
 */
export function createNextStylexBabelConfig({ dev, rootDir, aliases }) {
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
