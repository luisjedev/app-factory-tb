import * as stylex from "@stylexjs/stylex";
import { forwardRef, type HTMLAttributes } from "react";
import { colors, effects, radii } from "./tokens.stylex";

const styles = stylex.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: effects.shadowSm,
    color: colors.cardForeground,
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    paddingBlock: "1.5rem",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    paddingInline: "1.5rem",
  },
  title: {
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
  content: {
    paddingInline: "1.5rem",
  },
  footer: {
    alignItems: "center",
    display: "flex",
    paddingInline: "1.5rem",
  },
});

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, ...props },
  ref,
) {
  const styleProps = stylex.props(styles.card);

  return (
    <div
      {...props}
      {...styleProps}
      className={[styleProps.className, className].filter(Boolean).join(" ")}
      data-slot="card"
      ref={ref}
    />
  );
});

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ className, ...props }, ref) {
    const styleProps = stylex.props(styles.header);

    return (
      <div
        {...props}
        {...styleProps}
        className={[styleProps.className, className].filter(Boolean).join(" ")}
        data-slot="card-header"
        ref={ref}
      />
    );
  },
);

export type CardTitleProps = HTMLAttributes<HTMLDivElement>;

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(
  function CardTitle({ className, ...props }, ref) {
    const styleProps = stylex.props(styles.title);

    return (
      <div
        {...props}
        {...styleProps}
        className={[styleProps.className, className].filter(Boolean).join(" ")}
        data-slot="card-title"
        ref={ref}
      />
    );
  },
);

export type CardDescriptionProps = HTMLAttributes<HTMLDivElement>;

export const CardDescription = forwardRef<
  HTMLDivElement,
  CardDescriptionProps
>(function CardDescription({ className, ...props }, ref) {
  const styleProps = stylex.props(styles.description);

  return (
    <div
      {...props}
      {...styleProps}
      className={[styleProps.className, className].filter(Boolean).join(" ")}
      data-slot="card-description"
      ref={ref}
    />
  );
});

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ className, ...props }, ref) {
    const styleProps = stylex.props(styles.content);

    return (
      <div
        {...props}
        {...styleProps}
        className={[styleProps.className, className].filter(Boolean).join(" ")}
        data-slot="card-content"
        ref={ref}
      />
    );
  },
);

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ className, ...props }, ref) {
    const styleProps = stylex.props(styles.footer);

    return (
      <div
        {...props}
        {...styleProps}
        className={[styleProps.className, className].filter(Boolean).join(" ")}
        data-slot="card-footer"
        ref={ref}
      />
    );
  },
);
