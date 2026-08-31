"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleableProps } from "./style-props";
import { colors, effects, radii } from "./tokens.stylex";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export type ButtonSize =
  | "default"
  | "sm"
  | "lg"
  | "icon"
  | "icon-sm"
  | "icon-lg";

export type ButtonProps = StyleableProps<
  ButtonHTMLAttributes<HTMLButtonElement>
> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const styles = stylex.create({
  base: {
    borderColor: "transparent",
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: "1px",
    gap: "0.5rem",
    outline: "none",
    textDecoration: "none",
    alignItems: "center",
    appearance: "none",
    boxShadow: {
      default: "none",
      ":focus-visible": `0 0 0 3px ${effects.focusRing}`,
    },
    boxSizing: "border-box",
    cursor: {
      default: "pointer",
      ":disabled": "not-allowed",
    },
    display: "inline-flex",
    flexShrink: 0,
    fontFamily: "inherit",
    fontSize: "0.875rem",
    fontWeight: 500,
    justifyContent: "center",
    lineHeight: "1.25rem",
    opacity: {
      default: 1,
      ":disabled": 0.5,
    },
    pointerEvents: {
      default: "auto",
      ":disabled": "none",
    },
    transitionDuration: "150ms",
    transitionProperty:
      "color, background-color, border-color, box-shadow, opacity",
    transitionTimingFunction: "ease",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  invalid: {
    borderColor: colors.destructive,
  },
  variantDefault: {
    backgroundColor: {
      default: colors.primary,
      ":hover": effects.primaryHover,
    },
    color: colors.primaryForeground,
  },
  destructive: {
    backgroundColor: {
      default: colors.destructive,
      ":hover": effects.destructiveHover,
    },
    color: colors.destructiveForeground,
  },
  outline: {
    borderColor: colors.border,
    backgroundColor: {
      default: colors.background,
      ":hover": colors.accent,
    },
    color: {
      default: colors.foreground,
      ":hover": colors.accentForeground,
    },
  },
  secondary: {
    backgroundColor: {
      default: colors.secondary,
      ":hover": effects.secondaryHover,
    },
    color: colors.secondaryForeground,
  },
  ghost: {
    backgroundColor: {
      default: "transparent",
      ":hover": colors.accent,
    },
    color: {
      default: colors.foreground,
      ":hover": colors.accentForeground,
    },
  },
  link: {
    backgroundColor: "transparent",
    color: colors.primary,
    textDecorationLine: {
      default: "none",
      ":hover": "underline",
    },
    textUnderlineOffset: "4px",
  },
  sizeDefault: {
    paddingBlock: "0.5rem",
    paddingInline: "1rem",
    height: "2.25rem",
  },
  sm: {
    gap: "0.375rem",
    paddingInline: "0.75rem",
    height: "2rem",
  },
  lg: {
    paddingInline: "1.5rem",
    height: "2.5rem",
  },
  icon: {
    padding: 0,
    height: "2.25rem",
    width: "2.25rem",
  },
  iconSm: {
    padding: 0,
    height: "2rem",
    width: "2rem",
  },
  iconLg: {
    padding: 0,
    height: "2.5rem",
    width: "2.5rem",
  },
});

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      style,
      size = "default",
      type = "button",
      variant = "default",
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) {
    const styleProps = stylex.props(
      styles.base,
      variant === "default" && styles.variantDefault,
      variant === "destructive" && styles.destructive,
      variant === "outline" && styles.outline,
      variant === "secondary" && styles.secondary,
      variant === "ghost" && styles.ghost,
      variant === "link" && styles.link,
      size === "default" && styles.sizeDefault,
      size === "sm" && styles.sm,
      size === "lg" && styles.lg,
      size === "icon" && styles.icon,
      size === "icon-sm" && styles.iconSm,
      size === "icon-lg" && styles.iconLg,
      (ariaInvalid === true || ariaInvalid === "true") && styles.invalid,
      style,
    );

    return (
      <button
        {...props}
        {...styleProps}
        aria-invalid={ariaInvalid}
        data-slot="button"
        data-size={size}
        data-variant={variant}
        ref={ref}
        type={type}
      >
        {children}
      </button>
    );
  },
);
