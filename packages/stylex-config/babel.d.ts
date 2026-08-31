export interface NextStylexBabelOptions {
  configFileUrl: string | URL;
  dev?: boolean;
  aliases?: Record<string, string | string[]>;
}

export interface NextStylexBabelConfig {
  presets: string[];
  plugins: Array<[string, Record<string, unknown>]>;
}

export function createNextStylexBabelConfig(
  options: NextStylexBabelOptions,
): NextStylexBabelConfig;
