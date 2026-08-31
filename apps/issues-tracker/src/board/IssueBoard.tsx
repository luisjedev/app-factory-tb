import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Badge, type BadgeVariant } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@repo/ui/native-select";
import { colors, radii } from "@repo/ui/tokens.stylex";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
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
  controls: {
    alignItems: "end",
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [mediaQueries.desktop]: "minmax(16rem, 2fr) repeat(3, minmax(9rem, 1fr)) auto",
    },
    marginBlockEnd: "1.5rem",
  },
  controlField: {
    display: "grid",
    gap: "0.5rem",
    minWidth: 0,
  },
  resetButton: {
    width: {
      default: "100%",
      [mediaQueries.desktop]: "auto",
    },
  },
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
  detailButton: {
    width: "100%",
  },
  detail: {
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: "1px",
    display: "grid",
    gap: "1rem",
    overflowWrap: "anywhere",
    paddingBlockStart: "1rem",
  },
  detailMetadata: {
    display: "grid",
    gap: "0.5rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  detailMetadataItem: {
    color: colors.mutedForeground,
    fontSize: "0.75rem",
    lineHeight: 1.5,
  },
  detailContent: {
    display: "grid",
    gap: "0.75rem",
  },
  detailHeading: {
    fontSize: "0.875rem",
    lineHeight: 1.4,
    margin: 0,
  },
  detailParagraph: {
    fontSize: "0.8125rem",
    lineHeight: 1.6,
    margin: 0,
  },
  detailList: {
    display: "grid",
    fontSize: "0.8125rem",
    gap: "0.35rem",
    lineHeight: 1.5,
    margin: 0,
    paddingInlineStart: "1.25rem",
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

function isIssueType(value: string): value is Issue["type"] {
  return value === "feature" || value === "fix" || value === "chore";
}

function isIssuePriority(value: string): value is Issue["priority"] {
  return value === "high" || value === "medium" || value === "low";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function DiagnosticList({
  diagnostics,
}: {
  readonly diagnostics: readonly IssueDiagnostic[];
}) {
  return (
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
  );
}

type IssueContentBlock =
  | { readonly type: "heading"; readonly text: string }
  | { readonly type: "list"; readonly items: readonly string[] }
  | { readonly type: "paragraph"; readonly text: string };

function parseIssueContent(content: string): readonly IssueContentBlock[] {
  const lines = content.split(/\r?\n/);
  const blocks: IssueContentBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trim() ?? "";

    if (!line) {
      index += 1;
      continue;
    }

    const heading = /^#{1,6}\s+(.+)$/.exec(line);

    if (heading?.[1]) {
      blocks.push({ type: "heading", text: heading[1] });
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];

      while ((lines[index]?.trim() ?? "").startsWith("- ")) {
        items.push((lines[index]?.trim() ?? "").slice(2));
        index += 1;
      }

      blocks.push({ type: "list", items });
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;

    while (index < lines.length) {
      const nextLine = lines[index]?.trim() ?? "";

      if (!nextLine || /^#{1,6}\s+/.test(nextLine) || nextLine.startsWith("- ")) {
        break;
      }

      paragraph.push(nextLine);
      index += 1;
    }

    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function IssueContent({ content }: { readonly content: string }) {
  return (
    <div {...stylex.props(styles.detailContent)}>
      {parseIssueContent(content).map((block, index) => {
        if (block.type === "heading") {
          return (
            <h4 {...stylex.props(styles.detailHeading)} key={index}>
              {block.text}
            </h4>
          );
        }

        if (block.type === "list") {
          return (
            <ul {...stylex.props(styles.detailList)} key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={`${itemIndex}-${item}`}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p {...stylex.props(styles.detailParagraph)} key={index}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

function IssueCard({
  expanded,
  issue,
  issues,
  onToggle,
}: {
  readonly expanded: boolean;
  readonly issue: Issue;
  readonly issues: readonly Issue[];
  readonly onToggle: () => void;
}) {
  const label = `${issue.id} ${issue.title}`;
  const detailId = `detail-${issue.id}`;
  const blockedIssues = issue.blockedBy;
  const blockingIssues = issues
    .filter((candidate) => candidate.blockedBy.includes(issue.id))
    .map((candidate) => candidate.id);

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
        <Button
          aria-controls={detailId}
          aria-expanded={expanded}
          onClick={onToggle}
          size="sm"
          style={styles.detailButton}
          variant="outline"
        >
          {expanded ? "Ocultar" : "Ver"} detalle de {issue.id}
        </Button>
        {expanded ? (
          <section
            {...stylex.props(styles.detail)}
            aria-label={`Detalle de ${issue.id}`}
            id={detailId}
          >
            <ul {...stylex.props(styles.detailMetadata)}>
              <li {...stylex.props(styles.detailMetadataItem)}>
                Estado <strong>{STATE_LABELS[issue.state]}</strong>
              </li>
              <li {...stylex.props(styles.detailMetadataItem)}>
                Alcance{" "}
                <strong>
                  {issue.scope === "general" ? "General" : issue.app}
                </strong>
              </li>
              {issue.sourcePlan ? (
                <li {...stylex.props(styles.detailMetadataItem)}>
                  Plan de origen <strong>{issue.sourcePlan}</strong>
                </li>
              ) : null}
              {blockedIssues.length > 0 ? (
                <li {...stylex.props(styles.detailMetadataItem)}>
                  Bloqueada por <strong>{blockedIssues.join(", ")}</strong>
                </li>
              ) : null}
              {blockingIssues.length > 0 ? (
                <li {...stylex.props(styles.detailMetadataItem)}>
                  Bloquea a <strong>{blockingIssues.join(", ")}</strong>
                </li>
              ) : null}
              {blockedIssues.length === 0 && blockingIssues.length === 0 ? (
                <li {...stylex.props(styles.detailMetadataItem)}>
                  Sin relaciones de bloqueo
                </li>
              ) : null}
            </ul>
            <IssueContent content={issue.content} />
          </section>
        ) : null}
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
  const [query, setQuery] = useState("");
  const [appFilter, setAppFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<Issue["type"] | "">("");
  const [priorityFilter, setPriorityFilter] = useState<
    Issue["priority"] | ""
  >("");
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase("es");
  const appOptions = Array.from(
    new Set(issues.flatMap((issue) => (issue.app ? [issue.app] : []))),
  ).sort((left, right) => left.localeCompare(right, "es"));
  const visibleIssues = issues.filter(
    (issue) =>
      (!normalizedQuery ||
        `${issue.id} ${issue.title}`
          .toLocaleLowerCase("es")
          .includes(normalizedQuery)) &&
      (!appFilter || issue.app === appFilter) &&
      (!typeFilter || issue.type === typeFilter) &&
      (!priorityFilter || issue.priority === priorityFilter),
  );
  const issuesByState: Record<IssueState, readonly Issue[]> = {
    backlog: visibleIssues.filter((issue) => issue.state === "backlog"),
    "in-progress": visibleIssues.filter(
      (issue) => issue.state === "in-progress",
    ),
    "in-review": visibleIssues.filter((issue) => issue.state === "in-review"),
    done: visibleIssues.filter((issue) => issue.state === "done"),
  };

  return (
    <>
      {issues.length > 0 ? (
        <div {...stylex.props(styles.controls)}>
          <div {...stylex.props(styles.controlField)}>
            <Label htmlFor="issue-search">Buscar issues</Label>
            <Input
              id="issue-search"
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="ID o título"
              type="search"
              value={query}
            />
          </div>
          <div {...stylex.props(styles.controlField)}>
            <Label htmlFor="app-filter">Aplicación</Label>
            <NativeSelect
              id="app-filter"
              onChange={(event) => setAppFilter(event.currentTarget.value)}
              value={appFilter}
            >
              <NativeSelectOption value="">Todas</NativeSelectOption>
              {appOptions.map((app) => (
                <NativeSelectOption key={app} value={app}>
                  {app}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div {...stylex.props(styles.controlField)}>
            <Label htmlFor="type-filter">Tipo</Label>
            <NativeSelect
              id="type-filter"
              onChange={(event) => {
                const value = event.currentTarget.value;
                setTypeFilter(isIssueType(value) ? value : "");
              }}
              value={typeFilter}
            >
              <NativeSelectOption value="">Todos</NativeSelectOption>
              <NativeSelectOption value="feature">Feature</NativeSelectOption>
              <NativeSelectOption value="fix">Fix</NativeSelectOption>
              <NativeSelectOption value="chore">Chore</NativeSelectOption>
            </NativeSelect>
          </div>
          <div {...stylex.props(styles.controlField)}>
            <Label htmlFor="priority-filter">Prioridad</Label>
            <NativeSelect
              id="priority-filter"
              onChange={(event) => {
                const value = event.currentTarget.value;
                setPriorityFilter(isIssuePriority(value) ? value : "");
              }}
              value={priorityFilter}
            >
              <NativeSelectOption value="">Todas</NativeSelectOption>
              <NativeSelectOption value="high">Alta</NativeSelectOption>
              <NativeSelectOption value="medium">Media</NativeSelectOption>
              <NativeSelectOption value="low">Baja</NativeSelectOption>
            </NativeSelect>
          </div>
          <Button
            onClick={() => {
              setQuery("");
              setAppFilter("");
              setTypeFilter("");
              setPriorityFilter("");
            }}
            style={styles.resetButton}
            variant="outline"
          >
            Restablecer filtros
          </Button>
        </div>
      ) : null}

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
            <DiagnosticList diagnostics={diagnostics} />
          </AlertDescription>
        </Alert>
      ) : null}

      {!loadError && diagnostics.length > 0 && issues.length > 0 ? (
        <Alert role="status" style={styles.emptyState}>
          <AlertTitle>Fuente parcialmente inválida</AlertTitle>
          <AlertDescription>
            Las issues válidas siguen disponibles. Corrige estos archivos:
            <DiagnosticList diagnostics={diagnostics} />
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

      {!loadError && issues.length > 0 && visibleIssues.length === 0 ? (
        <Alert role="status" style={styles.emptyState}>
          <AlertTitle>
            No hay issues que coincidan con los criterios activos
          </AlertTitle>
          <AlertDescription>
            Modifica la búsqueda o restablece los filtros para recuperar el
            tablero completo.
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
                      <IssueCard
                        expanded={expandedIssueId === issue.id}
                        issue={issue}
                        issues={issues}
                        onToggle={() =>
                          setExpandedIssueId((currentId) =>
                            currentId === issue.id ? null : issue.id,
                          )
                        }
                      />
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
