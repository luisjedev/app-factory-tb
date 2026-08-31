import { fileURLToPath, URL } from "node:url";

export const stylexCssLayers = {
  before: ["reset"],
  prefix: "stylex",
};

/**
 * Resolves an application root from one of its root config files.
 *
 * @param {string | URL} configFileUrl
 */
export function resolveConfigDirectory(configFileUrl) {
  return fileURLToPath(new URL(".", configFileUrl));
}
