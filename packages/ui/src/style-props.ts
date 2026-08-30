import type { StyleXStyles } from "@stylexjs/stylex";

export type StyleableProps<Props> = Omit<Props, "className" | "style"> & {
  style?: StyleXStyles;
};
