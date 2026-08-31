import { parse } from "yaml";
import {
  ISSUE_STATES,
  type Issue,
  type IssueIndex,
  type IssueKind,
  type IssuePriority,
  type IssueScope,
  type IssueSource,
  type IssueState,
  type IssueType,
} from "./types.js";

const ISSUE_KINDS = ["simple-task", "plan-slice"] as const;
const ISSUE_TYPES = ["feature", "fix", "chore"] as const;
const ISSUE_PRIORITIES = ["high", "medium", "low"] as const;
const ISSUE_SCOPES = ["general", "app"] as const;
const PRIORITY_ORDER: Readonly<Record<IssuePriority, number>> = {
  high: 0,
  medium: 1,
  low: 2,
};
const ISSUE_PATH = new RegExp(
  String.raw`(?:^|/)issues/(backlog|in-progress|in-review|done)/(ISS-\d{4}--[a-z0-9-]+\.md)$`,
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOneOf<const Value extends string>(
  value: unknown,
  allowed: readonly Value[],
): value is Value {
  return typeof value === "string" && allowed.includes(value as Value);
}

function parseIssueSource(source: IssueSource): Issue | null {
  const normalizedPath = source.path.replaceAll("\\", "/");
  const pathMatch = ISSUE_PATH.exec(normalizedPath);

  if (!pathMatch) {
    return null;
  }

  const frontmatterMatch =
    /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(source.content);

  if (!frontmatterMatch) {
    return null;
  }

  let metadata: unknown;

  try {
    metadata = parse(frontmatterMatch[1] ?? "");
  } catch {
    return null;
  }

  if (!isRecord(metadata)) {
    return null;
  }

  const state = pathMatch[1];
  const filename = pathMatch[2];
  const {
    id,
    title,
    kind,
    type,
    priority,
    scope,
    app,
    createdAt,
    sourcePlan,
    blockedBy,
  } = metadata;

  if (
    !isOneOf(state, ISSUE_STATES) ||
    typeof filename !== "string" ||
    typeof id !== "string" ||
    !/^ISS-\d{4}$/.test(id) ||
    !filename.startsWith(`${id}--`) ||
    typeof title !== "string" ||
    title.trim().length === 0 ||
    !isOneOf(kind, ISSUE_KINDS) ||
    !isOneOf(type, ISSUE_TYPES) ||
    !isOneOf(priority, ISSUE_PRIORITIES) ||
    !isOneOf(scope, ISSUE_SCOPES) ||
    typeof createdAt !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(createdAt) ||
    !Array.isArray(blockedBy) ||
    !blockedBy.every(
      (blockedIssue) =>
        typeof blockedIssue === "string" && /^ISS-\d{4}$/.test(blockedIssue),
    ) ||
    (scope === "app" && (typeof app !== "string" || app.length === 0)) ||
    (scope === "general" && app !== undefined) ||
    (sourcePlan !== undefined &&
      (typeof sourcePlan !== "string" || !/^PLAN-\d{4}$/.test(sourcePlan)))
  ) {
    return null;
  }

  return {
    id,
    title,
    kind: kind as IssueKind,
    type: type as IssueType,
    priority: priority as IssuePriority,
    scope: scope as IssueScope,
    ...(typeof app === "string" ? { app } : {}),
    createdAt,
    ...(typeof sourcePlan === "string" ? { sourcePlan } : {}),
    blockedBy,
    content: (frontmatterMatch[2] ?? "").trim(),
    state,
  };
}

function compareIssues(left: Issue, right: Issue) {
  return (
    PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority] ||
    left.id.localeCompare(right.id)
  );
}

export function indexIssueSources(sources: readonly IssueSource[]): IssueIndex {
  const byState: Record<IssueState, Issue[]> = {
    backlog: [],
    "in-progress": [],
    "in-review": [],
    done: [],
  };

  for (const source of sources) {
    const issue = parseIssueSource(source);

    if (issue) {
      byState[issue.state].push(issue);
    }
  }

  for (const state of ISSUE_STATES) {
    byState[state].sort(compareIssues);
  }

  return {
    issues: ISSUE_STATES.flatMap((state) => byState[state]),
    byState,
  };
}
