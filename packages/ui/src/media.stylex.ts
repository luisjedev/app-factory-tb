import * as stylex from "@stylexjs/stylex";

export const colorSchemes = stylex.defineConsts({
  dark: "@media (prefers-color-scheme: dark)",
});

export const mediaQueries = stylex.defineConsts({
  wide: "@media (min-width: 640px)",
});
