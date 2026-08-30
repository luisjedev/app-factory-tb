import * as stylex from "@stylexjs/stylex";
import { forwardRef, type HTMLAttributes } from "react";
import { colors, radii } from "./tokens.stylex";

export type AlertVariant = "default" | "destructive";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

const styles = stylex.create({
  base: {
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderStyle: "solid",
    borderWidth: "1px",
    display: "grid",
    fontSize: "0.875rem",
    gap: "0.25rem",
    lineHeight: "1.25rem",
    paddingBlock: "0.75rem",
    paddingInline: "1rem",
    width: "100%",
  },
  variantDefault: {
    backgroundColor: colors.card,
    color: colors.cardForeground,
  },
  destructive: {
    backgroundColor: colors.card,
    borderColor: colors.destructive,
    borderStyle: "dashed",
    color: colors.destructive,
  },
  title: {
    fontWeight: 500,
    letterSpacing: "-0.01em",
  },
  description: {
    color: "inherit",
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
});

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, role = "alert", variant = "default", ...props },
  ref,
) {
  const styleProps = stylex.props(
    styles.base,
    variant === "default" && styles.variantDefault,
    variant === "destructive" && styles.destructive,
  );

  return (
    <div
      {...props}
      {...styleProps}
      className={[styleProps.className, className].filter(Boolean).join(" ")}
      data-slot="alert"
      data-variant={variant}
      ref={ref}
      role={role}
    />
  );
});

export type AlertTitleProps = HTMLAttributes<HTMLDivElement>;

export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(
  function AlertTitle({ className, ...props }, ref) {
    const styleProps = stylex.props(styles.title);

    return (
      <div
        {...props}
        {...styleProps}
        className={[styleProps.className, className].filter(Boolean).join(" ")}
        data-slot="alert-title"
        ref={ref}
      />
    );
  },
);

export type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>;

export const AlertDescription = forwardRef<
  HTMLDivElement,
  AlertDescriptionProps
>(function AlertDescription({ className, ...props }, ref) {
  const styleProps = stylex.props(styles.description);

  return (
    <div
      {...props}
      {...styleProps}
      className={[styleProps.className, className].filter(Boolean).join(" ")}
      data-slot="alert-description"
      ref={ref}
    />
  );
});
