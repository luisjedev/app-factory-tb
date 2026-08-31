import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Badge, type BadgeVariant } from "@repo/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { colors, radii } from "@repo/ui/tokens.stylex";
import * as stylex from "@stylexjs/stylex";
import { mediaQueries } from "../media.stylex";
import {
  ISSUE_STATES,
  type Issue,
  type IssueDiagnostic,
  type IssueState,
} from "../issues/types";

const STATE_LABELS: Readonly<Record<IssueState, string>> = {
  backlog: "Backlog",
  "in-progress": "En progreso",
  "in-review": "En revisión",
  done: "Completado",
};

const EMPTY_STATE_LABELS: Readonly<Record<IssueState, string>> = {
  backlog: "el backlog",
  "in-progress": "progreso",
  "in-review": "revisión",
  done: "completado",
};

const PRIORITY_LABELS = {
  high: "Prioridad alta",
  medium: "Prioridad media",
  low: "Prioridad baja",
} as const;

const TYPE_LABELS = {
  feature: "Feature",
  fix: "Fix",
  chore: "Chore",
} as const;

const PRIORITY_VARIANTS: Readonly<
  Record<Issue["priority"], BadgeVariant>
> = {
  high: "destructive",
  medium: "default",
  low: "secondary",
};

const styles = stylex.create({
  emptyState: {
    marginBlockEnd: "1.5rem",
  },
  diagnosticList: {
    display: "grid",
    gap: "0.5rem",
    marginBlockEnd: 0,
    marginBlockStart: "0.75rem",
    paddingInlineStart: "1.25rem",
  },
  diagnosticItem: {
    display: "grid",
    gap: "0.125rem",
  },
  diagnosticPath: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: "0.75rem",
    overflowWrap: "anywhere",
  },
  board: {
    alignItems: "start",
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [mediaQueries.desktop]: "repeat(4, minmax(0, 1fr))",
    },
  },
  column: {
    backgroundColor: colors.muted,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderStyle: "solid",
    borderWidth: "1px",
    display: "grid",
    gap: "1rem",
    minWidth: 0,
    paddingBlock: "1rem",
    paddingInline: "1rem",
  },
  columnHeader: {
    alignItems: "center",
    display: "flex",
    gap: "0.75rem",
    justifyContent: "space-between",
  },
  columnTitle: {
    fontSize: "0.9375rem",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    margin: 0,
  },
  count: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.xxxxl,
    borderStyle: "solid",
    borderWidth: "1px",
    display: "inline-flex",
    fontSize: "0.75rem",
    fontWeight: 700,
    height: "1.75rem",
    justifyContent: "center",
    minWidth: "1.75rem",
    paddingInline: "0.4rem",
  },
  issueList: {
    display: "grid",
    gap: "0.75rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  issueCard: {
    gap: "1rem",
    paddingBlock: "1rem",
  },
  cardHeader: {
    gap: "0.4rem",
    paddingInline: "1rem",
  },
  cardContent: {
    display: "grid",
    gap: "0.75rem",
    paddingInline: "1rem",
  },
  issueId: {
    color: colors.mutedForeground,
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    lineHeight: 1,
  },
  issueTitle: {
    fontSize: "0.9375rem",
    fontWeight: 650,
    lineHeight: 1.35,
    margin: 0,
  },
  metadata: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
  },
  date: {
    color: colors.mutedForeground,
    fontSize: "0.75rem",
  },
  columnEmpty: {
    color: colors.mutedForeground,
    fontSize: "0.8125rem",
    lineHeight: 1.5,
    margin: 0,
    paddingBlock: {
      default: "1rem",
      [mediaQueries.compact]: "0.5rem",
    },
  },
});

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function IssueCard({ issue }: { readonly issue: Issue }) {
  const label = `${issue.id} ${issue.title}`;

  return (
    <Card aria-label={label} role="article" style={styles.issueCard}>
      <CardHeader style={styles.cardHeader}>
        <span {...stylex.props(styles.issueId)}>{issue.id}</span>
        <CardTitle>
          <h3 {...stylex.props(styles.issueTitle)}>{issue.title}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent style={styles.cardContent}>
        <div {...stylex.props(styles.metadata)}>
          <Badge variant={PRIORITY_VARIANTS[issue.priority]}>
            {PRIORITY_LABELS[issue.priority]}
          </Badge>
          <Badge variant="outline">{TYPE_LABELS[issue.type]}</Badge>
          <Badge variant="secondary">
            {issue.scope === "general" ? "General" : "Aplicación"}
          </Badge>
          {issue.app ? <Badge variant="outline">{issue.app}</Badge> : null}
        </div>
        <time dateTime={issue.createdAt} {...stylex.props(styles.date)}>
          {formatDate(issue.createdAt)}
        </time>
      </CardContent>
    </Card>
  );
}

type IssueBoardProps = {
  readonly diagnostics?: readonly IssueDiagnostic[];
  readonly issues: readonly Issue[];
  readonly loadError?: string;
};

export function IssueBoard({
  diagnostics = [],
  issues,
  loadError,
}: IssueBoardProps) {
  const issuesByState: Record<IssueState, readonly Issue[]> = {
    backlog: issues.filter((issue) => issue.state === "backlog"),
    "in-progress": issues.filter((issue) => issue.state === "in-progress"),
    "in-review": issues.filter((issue) => issue.state === "in-review"),
    done: issues.filter((issue) => issue.state === "done"),
  };

  return (
    <>
      {loadError ? (
        <Alert variant="destructive" style={styles.emptyState}>
          <AlertTitle>No se pudo cargar el repositorio</AlertTitle>
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      ) : null}

      {!loadError && diagnostics.length > 0 && issues.length === 0 ? (
        <Alert variant="destructive" style={styles.emptyState}>
          <AlertTitle>No se pudieron indexar issues</AlertTitle>
          <AlertDescription>
            Corrige las fuentes Markdown indicadas:
            <ul {...stylex.props(styles.diagnosticList)}>
              {diagnostics.map((diagnostic) => (
                <li
                  {...stylex.props(styles.diagnosticItem)}
                  key={`${diagnostic.path}-${diagnostic.code}`}
                >
                  <strong {...stylex.props(styles.diagnosticPath)}>
                    {diagnostic.path}
                  </strong>
                  <span>{diagnostic.message}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      {!loadError && diagnostics.length > 0 && issues.length > 0 ? (
        <Alert role="status" style={styles.emptyState}>
          <AlertTitle>Fuente parcialmente inválida</AlertTitle>
          <AlertDescription>
            Las issues válidas siguen disponibles. Corrige estos archivos:
            <ul {...stylex.props(styles.diagnosticList)}>
              {diagnostics.map((diagnostic) => (
                <li
                  {...stylex.props(styles.diagnosticItem)}
                  key={`${diagnostic.path}-${diagnostic.code}`}
                >
                  <strong {...stylex.props(styles.diagnosticPath)}>
                    {diagnostic.path}
                  </strong>
                  <span>{diagnostic.message}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      {!loadError && diagnostics.length === 0 && issues.length === 0 ? (
        <Alert role="status" style={styles.emptyState}>
          <AlertTitle>Todavía no hay issues en el repositorio</AlertTitle>
          <AlertDescription>
            Añade una issue Markdown a un directorio de estado para verla aquí.
          </AlertDescription>
        </Alert>
      ) : null}

      <div {...stylex.props(styles.board)}>
        {ISSUE_STATES.map((state) => {
          const stateIssues = issuesByState[state];
          const label = STATE_LABELS[state];
          const titleId = `column-${state}`;

          return (
            <section
              {...stylex.props(styles.column)}
              aria-labelledby={titleId}
              key={state}
            >
              <header {...stylex.props(styles.columnHeader)}>
                <h2 {...stylex.props(styles.columnTitle)} id={titleId}>
                  {label}
                </h2>
                <span
                  {...stylex.props(styles.count)}
                  aria-label={`${stateIssues.length} ${stateIssues.length === 1 ? "issue" : "issues"} en ${label}`}
                >
                  {stateIssues.length}
                </span>
              </header>

              {stateIssues.length > 0 ? (
                <ol {...stylex.props(styles.issueList)}>
                  {stateIssues.map((issue) => (
                    <li key={issue.id}>
                      <IssueCard issue={issue} />
                    </li>
                  ))}
                </ol>
              ) : (
                <p {...stylex.props(styles.columnEmpty)}>
                  No hay issues en {EMPTY_STATE_LABELS[state]}.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
