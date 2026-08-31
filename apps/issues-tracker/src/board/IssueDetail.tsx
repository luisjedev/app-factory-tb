import { colors } from "@repo/ui/tokens.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Issue } from "../issues/types";
import {
  KIND_LABELS,
  PRIORITY_LABELS,
  STATE_LABELS,
  TYPE_LABELS,
} from "./issue-labels";

type IssueContentBlock =
  | { readonly type: "heading"; readonly text: string }
  | { readonly type: "list"; readonly items: readonly string[] }
  | { readonly type: "paragraph"; readonly text: string };

type IssueDetailProps = {
  readonly id: string;
  readonly issue: Issue;
  readonly issues: readonly Issue[];
};

const styles = stylex.create({
  detail: {
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: "1px",
    display: "grid",
    gap: "1rem",
    overflowWrap: "anywhere",
    paddingBlockStart: "1rem",
  },
  metadata: {
    display: "grid",
    gap: "0.5rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  metadataItem: {
    color: colors.mutedForeground,
    fontSize: "0.75rem",
    lineHeight: 1.5,
  },
  content: {
    display: "grid",
    gap: "0.75rem",
  },
  heading: {
    fontSize: "0.875rem",
    lineHeight: 1.4,
    margin: 0,
  },
  paragraph: {
    fontSize: "0.8125rem",
    lineHeight: 1.6,
    margin: 0,
  },
  list: {
    display: "grid",
    fontSize: "0.8125rem",
    gap: "0.35rem",
    lineHeight: 1.5,
    margin: 0,
    paddingInlineStart: "1.25rem",
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
    <div {...stylex.props(styles.content)}>
      {parseIssueContent(content).map((block, index) => {
        if (block.type === "heading") {
          return (
            <h4 {...stylex.props(styles.heading)} key={index}>
              {block.text}
            </h4>
          );
        }

        if (block.type === "list") {
          return (
            <ul {...stylex.props(styles.list)} key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={`${itemIndex}-${item}`}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p {...stylex.props(styles.paragraph)} key={index}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

export function IssueDetail({ id, issue, issues }: IssueDetailProps) {
  const blockingIssues = issues
    .filter((candidate) => candidate.blockedBy.includes(issue.id))
    .map((candidate) => candidate.id);

  return (
    <section
      {...stylex.props(styles.detail)}
      aria-label={`Detalle de ${issue.id}`}
      id={id}
    >
      <ul {...stylex.props(styles.metadata)}>
        <li {...stylex.props(styles.metadataItem)}>
          Identificador <strong>{issue.id}</strong>
        </li>
        <li {...stylex.props(styles.metadataItem)}>
          Estado <strong>{STATE_LABELS[issue.state]}</strong>
        </li>
        <li {...stylex.props(styles.metadataItem)}>
          Clase <strong>{KIND_LABELS[issue.kind]}</strong>
        </li>
        <li {...stylex.props(styles.metadataItem)}>
          Tipo <strong>{TYPE_LABELS[issue.type]}</strong>
        </li>
        <li {...stylex.props(styles.metadataItem)}>
          <strong>{PRIORITY_LABELS[issue.priority]}</strong>
        </li>
        <li {...stylex.props(styles.metadataItem)}>
          Creada el{" "}
          <time dateTime={issue.createdAt}>{formatDate(issue.createdAt)}</time>
        </li>
        <li {...stylex.props(styles.metadataItem)}>
          Alcance{" "}
          <strong>{issue.scope === "general" ? "General" : issue.app}</strong>
        </li>
        {issue.sourcePlan ? (
          <li {...stylex.props(styles.metadataItem)}>
            Plan de origen <strong>{issue.sourcePlan}</strong>
          </li>
        ) : null}
        {issue.blockedBy.length > 0 ? (
          <li {...stylex.props(styles.metadataItem)}>
            Bloqueada por <strong>{issue.blockedBy.join(", ")}</strong>
          </li>
        ) : null}
        {blockingIssues.length > 0 ? (
          <li {...stylex.props(styles.metadataItem)}>
            Bloquea a <strong>{blockingIssues.join(", ")}</strong>
          </li>
        ) : null}
        {issue.blockedBy.length === 0 && blockingIssues.length === 0 ? (
          <li {...stylex.props(styles.metadataItem)}>
            Sin relaciones de bloqueo
          </li>
        ) : null}
      </ul>
      <IssueContent content={issue.content} />
    </section>
  );
}
