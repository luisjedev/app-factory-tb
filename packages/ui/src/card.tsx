import * as stylex from "@stylexjs/stylex";
import { forwardRef, type HTMLAttributes } from "react";
import type { StyleableProps } from "./style-props";
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

export type CardProps = StyleableProps<HTMLAttributes<HTMLDivElement>>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { style, ...props },
  ref,
) {
  const styleProps = stylex.props(styles.card, style);

  return (
    <div
      {...props}
      {...styleProps}
      data-slot="card"
      ref={ref}
    />
  );
});

export type CardHeaderProps = StyleableProps<HTMLAttributes<HTMLDivElement>>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ style, ...props }, ref) {
    const styleProps = stylex.props(styles.header, style);

    return (
      <div
        {...props}
        {...styleProps}
        data-slot="card-header"
        ref={ref}
      />
    );
  },
);

export type CardTitleProps = StyleableProps<HTMLAttributes<HTMLDivElement>>;

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(
  function CardTitle({ style, ...props }, ref) {
    const styleProps = stylex.props(styles.title, style);

    return (
      <div
        {...props}
        {...styleProps}
        data-slot="card-title"
        ref={ref}
      />
    );
  },
);

export type CardDescriptionProps = StyleableProps<
  HTMLAttributes<HTMLDivElement>
>;

export const CardDescription = forwardRef<
  HTMLDivElement,
  CardDescriptionProps
>(function CardDescription({ style, ...props }, ref) {
  const styleProps = stylex.props(styles.description, style);

  return (
    <div
      {...props}
      {...styleProps}
      data-slot="card-description"
      ref={ref}
    />
  );
});

export type CardContentProps = StyleableProps<HTMLAttributes<HTMLDivElement>>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ style, ...props }, ref) {
    const styleProps = stylex.props(styles.content, style);

    return (
      <div
        {...props}
        {...styleProps}
        data-slot="card-content"
        ref={ref}
      />
    );
  },
);

export type CardFooterProps = StyleableProps<HTMLAttributes<HTMLDivElement>>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ style, ...props }, ref) {
    const styleProps = stylex.props(styles.footer, style);

    return (
      <div
        {...props}
        {...styleProps}
        data-slot="card-footer"
        ref={ref}
      />
    );
  },
);
