import * as stylex from "@stylexjs/stylex";
import { forwardRef, type HTMLAttributes } from "react";
import type { StyleableProps } from "./style-props";

export type CodeProps = StyleableProps<HTMLAttributes<HTMLElement>>;

const styles = stylex.create({
  base: {
    color: "black",
  },
});

export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { style, ...props },
  ref,
) {
  return (
    <code
      {...props}
      {...stylex.props(styles.base, style)}
      data-slot="code"
      ref={ref}
    />
  );
});
