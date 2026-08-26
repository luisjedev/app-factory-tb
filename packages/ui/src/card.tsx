import * as stylex from "@stylexjs/stylex";

export function Card({
  title,
  children,
  href,
}: {
  title: string;
  children: React.ReactNode;
  href: string;
}) {
  const styles = stylex.create({
    base: {
      color: "yellow",
    },
  });
  return (
    <a
      {...stylex.props(styles.base)}
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2>
        {title} <span>-&gt;</span>
      </h2>
      <p>{children}</p>
    </a>
  );
}
