"use client";

import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

interface ButtonProps {
  children: ReactNode;
  appName: string;
}

export const Button = ({ children, appName }: ButtonProps) => {
  const styles = stylex.create({
    base: {
      backgroundColor: "red",
    },
  });

  return (
    <button
      {...stylex.props(styles.base)}
      type="button"
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
