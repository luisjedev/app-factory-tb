import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  base: {
    color: "black",
  },
});

export function Code({
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <code {...stylex.props(styles.base)}>{children}</code>;
}
