import { themeStyles } from "@repo/ui/theme-styles";
import { colors } from "@repo/ui/tokens.stylex";
import * as stylex from "@stylexjs/stylex";
import issues from "virtual:issues";
import { IssueBoard } from "./board/IssueBoard";
import { mediaQueries } from "./media.stylex";

const styles = stylex.create({
  root: {
    backgroundColor: colors.background,
    backgroundImage: `linear-gradient(180deg, ${colors.muted} 0, ${colors.background} 22rem)`,
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    paddingBlock: {
      default: "3.5rem",
      [mediaQueries.compact]: "2rem",
    },
    paddingInline: {
      default: "2rem",
      [mediaQueries.compact]: "1rem",
    },
  },
  page: {
    display: "grid",
    gap: "2rem",
    marginInline: "auto",
    maxWidth: "100rem",
    width: "100%",
  },
  introduction: {
    display: "grid",
    gap: "0.75rem",
    maxWidth: "46rem",
  },
  eyebrow: {
    color: colors.mutedForeground,
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    margin: 0,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: {
      default: "3rem",
      [mediaQueries.compact]: "2.25rem",
    },
    fontWeight: 750,
    letterSpacing: "-0.05em",
    lineHeight: 1,
    margin: 0,
  },
  summary: {
    color: colors.mutedForeground,
    fontSize: "1rem",
    lineHeight: 1.6,
    margin: 0,
  },
  total: {
    color: colors.foreground,
    fontWeight: 650,
  },
});

export function App() {
  return (
    <main {...stylex.props(themeStyles.root, styles.root)}>
      <div {...stylex.props(styles.page)}>
        <header {...stylex.props(styles.introduction)}>
          <p {...stylex.props(styles.eyebrow)}>App Factory</p>
          <h1 {...stylex.props(styles.heading)}>Issues</h1>
          <p {...stylex.props(styles.summary)}>
            Tablero de solo lectura alimentado por los Markdown del repositorio.{" "}
            <span {...stylex.props(styles.total)}>
              {issues.length} {issues.length === 1 ? "issue" : "issues"} en total.
            </span>
          </p>
        </header>

        <IssueBoard issues={issues} />
      </div>
    </main>
  );
}
