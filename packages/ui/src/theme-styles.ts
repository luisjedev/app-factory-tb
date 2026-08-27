import * as stylex from "@stylexjs/stylex";
import { colors } from "./tokens.stylex";

/** Shared document-level styles for applications consuming the UI package. */
export const themeStyles = stylex.create({
  root: {
    backgroundColor: colors.background,
    color: colors.foreground,
    minHeight: "100vh",
  },
});
