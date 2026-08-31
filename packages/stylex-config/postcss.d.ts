export interface NextStylexPostcssOptions {
  configFileUrl: string | URL;
}

export function createNextStylexPostcssConfig(
  options: NextStylexPostcssOptions,
): Record<string, unknown>;
