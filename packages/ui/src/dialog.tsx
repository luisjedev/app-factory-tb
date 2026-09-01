"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as stylex from "@stylexjs/stylex";
import { X } from "lucide-react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
} from "react";
import { mediaQueries } from "./media.stylex";
import type { StyleableProps } from "./style-props";
import { colors, effects, radii, typography } from "./tokens.stylex";

const overlayIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const contentIn = stylex.keyframes({
  from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.95)" },
  to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const styles = stylex.create({
  overlay: {
    animationDuration: "200ms",
    animationName: overlayIn,
    animationTimingFunction: "ease-out",
    backgroundColor: "rgb(0 0 0 / 0.5)",
    bottom: 0,
    left: 0,
    position: "fixed",
    right: 0,
    top: 0,
    zIndex: 50,
  },
  content: {
    animationDuration: "200ms",
    animationName: contentIn,
    animationTimingFunction: "ease-out",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: "0 16px 48px rgb(0 0 0 / 0.18)",
    color: colors.foreground,
    display: "grid",
    fontFamily: typography.sans,
    gap: "1rem",
    left: "50%",
    maxHeight: "calc(100dvh - 2rem)",
    maxWidth: "calc(100% - 2rem)",
    outline: "none",
    overflowY: "auto",
    padding: "1.5rem",
    position: "fixed",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "32rem",
    zIndex: 50,
  },
  close: {
    alignItems: "center",
    appearance: "none",
    backgroundColor: {
      default: "transparent",
      ":hover": colors.accent,
    },
    borderColor: "transparent",
    borderRadius: radii.sm,
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: {
      default: "none",
      ":focus-visible": effects.focusRingShadow,
    },
    color: colors.mutedForeground,
    cursor: "pointer",
    display: "inline-flex",
    height: "2rem",
    justifyContent: "center",
    opacity: {
      default: 0.7,
      ":hover": 1,
      ":focus-visible": 1,
    },
    outline: "none",
    padding: 0,
    position: "absolute",
    right: "1rem",
    top: "1rem",
    transitionDuration: "150ms",
    transitionProperty: "background-color, box-shadow, opacity",
    transitionTimingFunction: "ease",
    width: "2rem",
  },
  closeIcon: {
    height: "1rem",
    pointerEvents: "none",
    width: "1rem",
  },
  visuallyHidden: {
    borderWidth: 0,
    clip: "rect(0, 0, 0, 0)",
    height: "1px",
    margin: "-1px",
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    whiteSpace: "nowrap",
    width: "1px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    paddingInlineEnd: "2.5rem",
    textAlign: {
      default: "center",
      [mediaQueries.wide]: "left",
    },
  },
  footer: {
    display: "flex",
    flexDirection: {
      default: "column-reverse",
      [mediaQueries.wide]: "row",
    },
    gap: "0.5rem",
    justifyContent: {
      default: "normal",
      [mediaQueries.wide]: "flex-end",
    },
  },
  title: {
    fontSize: "1.125rem",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    lineHeight: 1,
    margin: 0,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: "0.875rem",
    lineHeight: 1.4,
    margin: 0,
  },
});

export function Dialog(
  props: ComponentPropsWithoutRef<typeof DialogPrimitive.Root>,
) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

export const DialogTrigger = forwardRef<
  ComponentRef<typeof DialogPrimitive.Trigger>,
  StyleableProps<ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>>
>(function DialogTrigger({ style, ...props }, ref) {
  return (
    <DialogPrimitive.Trigger
      {...props}
      {...stylex.props(style)}
      data-slot="dialog-trigger"
      ref={ref}
    />
  );
});

export function DialogPortal(
  props: ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>,
) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

export const DialogClose = forwardRef<
  ComponentRef<typeof DialogPrimitive.Close>,
  StyleableProps<ComponentPropsWithoutRef<typeof DialogPrimitive.Close>>
>(function DialogClose({ style, ...props }, ref) {
  return (
    <DialogPrimitive.Close
      {...props}
      {...stylex.props(style)}
      data-slot="dialog-close"
      ref={ref}
    />
  );
});

export const DialogOverlay = forwardRef<
  ComponentRef<typeof DialogPrimitive.Overlay>,
  StyleableProps<ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>
>(function DialogOverlay({ style, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      {...props}
      {...stylex.props(styles.overlay, style)}
      data-slot="dialog-overlay"
      ref={ref}
    />
  );
});

export type DialogContentProps = StyleableProps<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
> & {
  readonly showCloseButton?: boolean;
};

export const DialogContent = forwardRef<
  ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent(
  { children, showCloseButton = true, style, ...props },
  ref,
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        {...props}
        {...stylex.props(styles.content, style)}
        data-slot="dialog-content"
        ref={ref}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            {...stylex.props(styles.close)}
            aria-label="Cerrar"
            data-slot="dialog-close"
          >
            <X {...stylex.props(styles.closeIcon)} aria-hidden="true" />
            <span {...stylex.props(styles.visuallyHidden)}>Cerrar</span>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

export type DialogHeaderProps = StyleableProps<HTMLAttributes<HTMLDivElement>>;

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  function DialogHeader({ style, ...props }, ref) {
    return (
      <div
        {...props}
        {...stylex.props(styles.header, style)}
        data-slot="dialog-header"
        ref={ref}
      />
    );
  },
);

export type DialogFooterProps = StyleableProps<HTMLAttributes<HTMLDivElement>>;

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  function DialogFooter({ style, ...props }, ref) {
    return (
      <div
        {...props}
        {...stylex.props(styles.footer, style)}
        data-slot="dialog-footer"
        ref={ref}
      />
    );
  },
);

export const DialogTitle = forwardRef<
  ComponentRef<typeof DialogPrimitive.Title>,
  StyleableProps<ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>
>(function DialogTitle({ style, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      {...props}
      {...stylex.props(styles.title, style)}
      data-slot="dialog-title"
      ref={ref}
    />
  );
});

export const DialogDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  StyleableProps<ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>
>(function DialogDescription({ style, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      {...props}
      {...stylex.props(styles.description, style)}
      data-slot="dialog-description"
      ref={ref}
    />
  );
});
