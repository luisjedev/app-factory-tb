import * as stylex from "@stylexjs/stylex";
import { colors, typography } from "./tokens.stylex";

/** Shared document-level styles for applications consuming the UI package. */
export const themeStyles = stylex.create({
  root: {
    backgroundColor: colors.background,
    color: colors.foreground,
    fontFamily: typography.sans,
    minHeight: "100vh",
  },
});
