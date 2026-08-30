import { unplugin as stylex } from "@stylexjs/unplugin";
import { stylexCssLayers } from "./shared.js";

/** Creates the shared StyleX compiler plugin for Vite applications. */
export function createStylexVitePlugin() {
  return stylex.vite({
    useCSSLayers: stylexCssLayers,
  });
}
