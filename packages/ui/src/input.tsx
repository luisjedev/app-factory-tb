import * as stylex from "@stylexjs/stylex";
import { forwardRef, type InputHTMLAttributes } from "react";
import { colors, effects, radii } from "./tokens.stylex";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const styles = stylex.create({
  base: {
    backgroundColor: "transparent",
    borderColor: colors.input,
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: {
      default: effects.shadowSm,
      ":focus-visible": effects.focusRingShadow,
    },
    color: colors.foreground,
    cursor: {
      default: "text",
      ":disabled": "not-allowed",
    },
    fontFamily: "inherit",
    fontSize: "0.875rem",
    height: "2.25rem",
    lineHeight: "1.25rem",
    minWidth: 0,
    opacity: {
      default: 1,
      ":disabled": 0.5,
    },
    outline: "none",
    paddingBlock: "0.25rem",
    paddingInline: "0.75rem",
    pointerEvents: {
      default: "auto",
      ":disabled": "none",
    },
    transitionDuration: "150ms",
    transitionProperty: "color, border-color, box-shadow, opacity",
    transitionTimingFunction: "ease",
    width: "100%",
  },
  focus: {
    borderColor: {
      default: colors.input,
      ":focus-visible": colors.ring,
    },
  },
  invalid: {
    borderColor: colors.destructive,
    borderStyle: "dashed",
    boxShadow: {
      default: effects.invalidRing,
      ":focus-visible": effects.invalidFocusRing,
    },
  },
});

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type, "aria-invalid": ariaInvalid, ...props },
  ref,
) {
  const styleProps = stylex.props(
    styles.base,
    styles.focus,
    (ariaInvalid === true || ariaInvalid === "true") && styles.invalid,
  );

  return (
    <input
      {...props}
      {...styleProps}
      aria-invalid={ariaInvalid}
      className={[styleProps.className, className].filter(Boolean).join(" ")}
      data-slot="input"
      ref={ref}
      type={type}
    />
  );
});
