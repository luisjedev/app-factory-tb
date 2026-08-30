import { createNextStylexPostcssConfig } from "@repo/stylex-config/postcss";
import babelConfig from "./babel.config.js";

export default createNextStylexPostcssConfig({
  babelConfig,
  include: [
    "app/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
});
