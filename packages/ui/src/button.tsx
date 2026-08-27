"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import * as stylex from "@stylexjs/stylex";

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

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Conservado por compatibilidad con los ejemplos del monorepo. */
  appName?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const styles = stylex.create({
  base: {
    alignItems: "center",
    appearance: "none",
    borderColor: "transparent",
    borderRadius: "0.375rem",
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: {
      default: "none",
      ":focus-visible":
        "0 0 0 3px color-mix(in srgb, var(--ring, #71717a) 50%, transparent)",
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
    gap: "0.5rem",
    justifyContent: "center",
    lineHeight: "1.25rem",
    opacity: {
      default: 1,
      ":disabled": 0.5,
    },
    outline: "none",
    pointerEvents: {
      default: "auto",
      ":disabled": "none",
    },
    textDecoration: "none",
    transitionDuration: "150ms",
    transitionProperty:
      "color, background-color, border-color, box-shadow, opacity",
    transitionTimingFunction: "ease",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  invalid: {
    borderColor: "var(--destructive, #dc2626)",
  },
  variantDefault: {
    backgroundColor: {
      default: "var(--primary, #18181b)",
      ":hover":
        "color-mix(in srgb, var(--primary, #18181b) 90%, transparent)",
    },
    color: "var(--primary-foreground, #fafafa)",
  },
  destructive: {
    backgroundColor: {
      default: "var(--destructive, #dc2626)",
      ":hover":
        "color-mix(in srgb, var(--destructive, #dc2626) 90%, transparent)",
    },
    color: "var(--destructive-foreground, #ffffff)",
  },
  outline: {
    backgroundColor: {
      default: "var(--background, transparent)",
      ":hover": "var(--accent, #f4f4f5)",
    },
    borderColor: "var(--border, #e4e4e7)",
    color: {
      default: "var(--foreground, #18181b)",
      ":hover": "var(--accent-foreground, #18181b)",
    },
  },
  secondary: {
    backgroundColor: {
      default: "var(--secondary, #f4f4f5)",
      ":hover":
        "color-mix(in srgb, var(--secondary, #f4f4f5) 80%, transparent)",
    },
    color: "var(--secondary-foreground, #18181b)",
  },
  ghost: {
    backgroundColor: {
      default: "transparent",
      ":hover": "var(--accent, #f4f4f5)",
    },
    color: {
      default: "var(--foreground, #18181b)",
      ":hover": "var(--accent-foreground, #18181b)",
    },
  },
  link: {
    backgroundColor: "transparent",
    color: "var(--primary, #18181b)",
    textDecorationLine: {
      default: "none",
      ":hover": "underline",
    },
    textUnderlineOffset: "4px",
  },
  sizeDefault: {
    height: "2.25rem",
    paddingBlock: "0.5rem",
    paddingInline: "1rem",
  },
  sm: {
    gap: "0.375rem",
    height: "2rem",
    paddingInline: "0.75rem",
  },
  lg: {
    height: "2.5rem",
    paddingInline: "1.5rem",
  },
  icon: {
    height: "2.25rem",
    padding: 0,
    width: "2.25rem",
  },
  iconSm: {
    height: "2rem",
    padding: 0,
    width: "2rem",
  },
  iconLg: {
    height: "2.5rem",
    padding: 0,
    width: "2.5rem",
  },
});

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    appName,
    children,
    className,
    onClick,
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
  );

  return (
    <button
      {...props}
      {...styleProps}
      aria-invalid={ariaInvalid}
      className={[styleProps.className, className].filter(Boolean).join(" ")}
      data-slot="button"
      data-size={size}
      data-variant={variant}
      ref={ref}
      type={type}
      onClick={(event) => {
        onClick?.(event);

        if (appName && !event.defaultPrevented) {
          alert(`Hello from your ${appName} app!`);
        }
      }}
    >
      {children}
    </button>
  );
});
