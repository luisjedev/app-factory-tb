import type { NextStylexBabelConfig } from "./babel.js";

export interface NextStylexPostcssOptions {
  babelConfig: NextStylexBabelConfig;
  include: string[];
}

export function createNextStylexPostcssConfig(
  options: NextStylexPostcssOptions,
): Record<string, unknown>;
