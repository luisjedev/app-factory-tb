import * as stylex from "@stylexjs/stylex";

export const mediaQueries = stylex.defineConsts({
  compact: "@media (max-width: 48rem)",
  narrow: "@media (max-width: 40rem)",
  reducedMotion: "@media (prefers-reduced-motion: reduce)",
});
