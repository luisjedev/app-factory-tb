import * as stylex from "@stylexjs/stylex";
import { forwardRef, type LabelHTMLAttributes } from "react";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

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
  { className, ...props },
  ref,
) {
  const styleProps = stylex.props(styles.base);

  return (
    <label
      {...props}
      {...styleProps}
      className={[styleProps.className, className].filter(Boolean).join(" ")}
      data-slot="label"
      ref={ref}
    />
  );
});
