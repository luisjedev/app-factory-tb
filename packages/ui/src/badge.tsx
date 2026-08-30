import * as stylex from "@stylexjs/stylex";
import { forwardRef, type HTMLAttributes } from "react";
import { colors, effects, radii } from "./tokens.stylex";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const styles = stylex.create({
  base: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: radii.xxxxl,
    borderStyle: "solid",
    borderWidth: "1px",
    display: "inline-flex",
    flexShrink: 0,
    fontSize: "0.75rem",
    fontWeight: 500,
    gap: "0.25rem",
    justifyContent: "center",
    lineHeight: "1rem",
    outlineColor: {
      default: "transparent",
      ":focus-visible": colors.ring,
    },
    outlineOffset: "2px",
    outlineStyle: "solid",
    outlineWidth: "2px",
    overflow: "hidden",
    paddingBlock: "0.125rem",
    paddingInline: "0.5rem",
    transitionDuration: "150ms",
    transitionProperty: "color, background-color, border-color, box-shadow",
    transitionTimingFunction: "ease",
    whiteSpace: "nowrap",
    width: "fit-content",
  },
  invalid: {
    borderColor: colors.destructive,
    borderStyle: "dashed",
    boxShadow: effects.invalidRing,
  },
  variantDefault: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground,
  },
  destructive: {
    backgroundColor: colors.destructive,
    color: colors.destructiveForeground,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: colors.border,
    color: colors.foreground,
  },
});

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    className,
    variant = "default",
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref,
) {
  const styleProps = stylex.props(
    styles.base,
    variant === "default" && styles.variantDefault,
    variant === "secondary" && styles.secondary,
    variant === "destructive" && styles.destructive,
    variant === "outline" && styles.outline,
    (ariaInvalid === true || ariaInvalid === "true") && styles.invalid,
  );

  return (
    <span
      {...props}
      {...styleProps}
      aria-invalid={ariaInvalid}
      className={[styleProps.className, className].filter(Boolean).join(" ")}
      data-slot="badge"
      data-variant={variant}
      ref={ref}
    />
  );
});
