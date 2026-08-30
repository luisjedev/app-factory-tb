import * as stylex from "@stylexjs/stylex";
import {
  forwardRef,
  type OptionHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";
import { colors, effects, radii } from "./tokens.stylex";

export type NativeSelectSize = "sm" | "default";

export interface NativeSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: NativeSelectSize;
}

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
      default: "pointer",
      ":disabled": "not-allowed",
    },
    fontFamily: "inherit",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    minWidth: 0,
    opacity: {
      default: 1,
      ":disabled": 0.5,
    },
    outline: "none",
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
  sizeDefault: {
    height: "2.25rem",
    paddingBlock: "0.5rem",
  },
  sm: {
    height: "2rem",
    paddingBlock: "0.25rem",
  },
  invalid: {
    borderColor: colors.destructive,
    borderStyle: "dashed",
    boxShadow: {
      default: effects.invalidRing,
      ":focus-visible": effects.invalidFocusRing,
    },
  },
  option: {
    backgroundColor: "Canvas",
    color: "CanvasText",
  },
});

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(
    {
      className,
      size = "default",
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) {
    const styleProps = stylex.props(
      styles.base,
      styles.focus,
      size === "default" && styles.sizeDefault,
      size === "sm" && styles.sm,
      (ariaInvalid === true || ariaInvalid === "true") && styles.invalid,
    );

    return (
      <select
        {...props}
        {...styleProps}
        aria-invalid={ariaInvalid}
        className={[styleProps.className, className].filter(Boolean).join(" ")}
        data-size={size}
        data-slot="native-select"
        ref={ref}
      />
    );
  },
);

export type NativeSelectOptionProps =
  OptionHTMLAttributes<HTMLOptionElement>;

export const NativeSelectOption = forwardRef<
  HTMLOptionElement,
  NativeSelectOptionProps
>(function NativeSelectOption({ className, ...props }, ref) {
  const styleProps = stylex.props(styles.option);

  return (
    <option
      {...props}
      {...styleProps}
      className={[styleProps.className, className].filter(Boolean).join(" ")}
      data-slot="native-select-option"
      ref={ref}
    />
  );
});
