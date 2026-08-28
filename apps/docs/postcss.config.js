import babelConfig from "./babel.config.js";

export default {
  plugins: {
    "@stylexjs/postcss-plugin": {
      include: [
        "app/**/*.{js,jsx,ts,tsx}",
        "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
      ],
      babelConfig: {
        babelrc: false,
        parserOpts: {
          plugins: ["typescript", "jsx"],
        },
        plugins: babelConfig.plugins,
      },
      useCSSLayers: {
        before: ["reset"],
        prefix: "stylex",
      },
    },
    autoprefixer: {},
  },
};
