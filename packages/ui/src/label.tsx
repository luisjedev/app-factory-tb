import * as stylex from "@stylexjs/stylex";
import { forwardRef, type LabelHTMLAttributes } from "react";
import type { StyleableProps } from "./style-props";

export type LabelProps = StyleableProps<
  LabelHTMLAttributes<HTMLLabelElement>
>;

const styles = stylex.create({
  base: {
    alignItems: "center",
    display: "flex",
    fontSize: "0.875rem",
    fontWeight: 500,
    gap: "0.5rem",
    lineHeight: 1,
    userSelect: "none",
  },
});

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { style, ...props },
  ref,
) {
  const styleProps = stylex.props(styles.base, style);

  return (
    <label
      {...props}
      {...styleProps}
      data-slot="label"
      ref={ref}
    />
  );
});
