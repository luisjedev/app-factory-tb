import * as stylex from "@stylexjs/stylex";

export function Code({
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const styles = stylex.create({
    base: {
      color: "black",
    },
  });
  return <code {...stylex.props(styles.base)}>{children}</code>;
}
