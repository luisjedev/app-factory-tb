import { colors, radii } from "@repo/ui/tokens.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
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
    display: "grid",
    gap: "2rem",
    minHeight: 0,
    overflowWrap: "anywhere",
    overflowY: "auto",
    paddingBlockEnd: "0.5rem",
    paddingInlineEnd: "0.5rem",
  },
  detailSection: {
    display: "grid",
    gap: "1rem",
  },
  sectionHeading: {
    fontSize: "1.125rem",
    fontWeight: 650,
    letterSpacing: "-0.02em",
    lineHeight: 1.3,
    margin: 0,
  },
  metadata: {
    display: "grid",
    gap: "0.75rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  metadataItem: {
    backgroundColor: colors.muted,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderStyle: "solid",
    borderWidth: "1px",
    display: "grid",
    gap: "0.35rem",
    minHeight: "5rem",
    paddingBlock: "1rem",
    paddingInline: "1rem",
  },
  metadataLabel: {
    color: colors.mutedForeground,
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.07em",
    lineHeight: 1.3,
    textTransform: "uppercase",
  },
  metadataValue: {
    color: colors.foreground,
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  descriptionSection: {
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: "1px",
    display: "grid",
    gap: "1.25rem",
    paddingBlockStart: "1.5rem",
  },
  content: {
    display: "grid",
    gap: "1rem",
    maxWidth: "75rem",
  },
  heading: {
    fontSize: "1.125rem",
    fontWeight: 650,
    lineHeight: 1.4,
    margin: 0,
  },
  paragraph: {
    fontSize: "1rem",
    lineHeight: 1.75,
    margin: 0,
  },
  list: {
    display: "grid",
    fontSize: "1rem",
    gap: "0.6rem",
    lineHeight: 1.65,
    margin: 0,
    paddingInlineStart: "1.5rem",
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

function formatPriority(priority: Issue["priority"]) {
  const value = PRIORITY_LABELS[priority].replace("Prioridad ", "");
  return `${value.charAt(0).toLocaleUpperCase("es")}${value.slice(1)}`;
}

function MetadataItem({
  children,
  label,
}: {
  readonly children: ReactNode;
  readonly label: string;
}) {
  return (
    <li {...stylex.props(styles.metadataItem)}>
      <span {...stylex.props(styles.metadataLabel)}>{label}</span>
      <span {...stylex.props(styles.metadataValue)}>{children}</span>
    </li>
  );
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

      if (
        !nextLine ||
        /^#{1,6}\s+/.test(nextLine) ||
        nextLine.startsWith("- ")
      ) {
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
      <div {...stylex.props(styles.detailSection)}>
        <h3 {...stylex.props(styles.sectionHeading)}>Datos de la issue</h3>
        <ul {...stylex.props(styles.metadata)}>
          <MetadataItem label="Identificador">{issue.id}</MetadataItem>
          <MetadataItem label="Estado">
            {STATE_LABELS[issue.state]}
          </MetadataItem>
          <MetadataItem label="Clase">{KIND_LABELS[issue.kind]}</MetadataItem>
          <MetadataItem label="Tipo">{TYPE_LABELS[issue.type]}</MetadataItem>
          <MetadataItem label="Prioridad">
            {formatPriority(issue.priority)}
          </MetadataItem>
          <MetadataItem label="Fecha de creación">
            <time dateTime={issue.createdAt}>
              {formatDate(issue.createdAt)}
            </time>
          </MetadataItem>
          <MetadataItem label="Alcance">
            {issue.scope === "general" ? "General" : issue.app}
          </MetadataItem>
          {issue.sourcePlan ? (
            <MetadataItem label="Plan de origen">
              {issue.sourcePlan}
            </MetadataItem>
          ) : null}
          {issue.blockedBy.length > 0 ? (
            <MetadataItem label="Bloqueada por">
              {issue.blockedBy.join(", ")}
            </MetadataItem>
          ) : null}
          {blockingIssues.length > 0 ? (
            <MetadataItem label="Bloquea a">
              {blockingIssues.join(", ")}
            </MetadataItem>
          ) : null}
          {issue.blockedBy.length === 0 && blockingIssues.length === 0 ? (
            <MetadataItem label="Relaciones">Sin bloqueos</MetadataItem>
          ) : null}
        </ul>
      </div>
      <div {...stylex.props(styles.descriptionSection)}>
        <h3 {...stylex.props(styles.sectionHeading)}>Descripción</h3>
        <IssueContent content={issue.content} />
      </div>
    </section>
  );
}
