import { parse } from "yaml";
import {
  ISSUE_STATES,
  type Issue,
  type IssueDiagnostic,
  type IssueIndex,
  type IssueIndexContext,
  type IssuePriority,
  type IssueSource,
  type IssueState,
} from "./types.js";

const ISSUE_KINDS = ["simple-task", "plan-slice"] as const;
const ISSUE_TYPES = ["feature", "fix", "chore"] as const;
const ISSUE_PRIORITIES = ["high", "medium", "low"] as const;
const ISSUE_SCOPES = ["general", "app"] as const;
const ISSUE_METADATA_FIELDS = new Set([
  "id",
  "title",
  "kind",
  "type",
  "priority",
  "scope",
  "app",
  "createdAt",
  "sourcePlan",
  "blockedBy",
]);
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

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function parseIssueSource(
  source: IssueSource,
  diagnostics: IssueDiagnostic[],
): Issue | null {
  const normalizedPath = source.path.replaceAll("\\", "/");
  const pathMatch = ISSUE_PATH.exec(normalizedPath);

  if (!pathMatch) {
    diagnostics.push({
      code: "invalid-path",
      path: normalizedPath,
      message: "La ruta debe seguir issues/<estado>/ISS-XXXX--slug.md.",
    });
    return null;
  }

  const frontmatterMatch =
    /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(source.content);

  if (!frontmatterMatch) {
    diagnostics.push({
      code: "invalid-frontmatter",
      path: normalizedPath,
      message: "El archivo debe comenzar con frontmatter delimitado por ---.",
    });
    return null;
  }

  let metadata: unknown;

  try {
    metadata = parse(frontmatterMatch[1] ?? "");
  } catch {
    diagnostics.push({
      code: "invalid-frontmatter",
      path: normalizedPath,
      message: "El frontmatter no contiene YAML válido.",
    });
    return null;
  }

  if (!isRecord(metadata)) {
    diagnostics.push({
      code: "invalid-frontmatter",
      path: normalizedPath,
      message: "El frontmatter debe contener un objeto de metadatos.",
    });
    return null;
  }

  const state = pathMatch[1];
  const filename = pathMatch[2];
  const requiredMetadata = [
    "id",
    "title",
    "kind",
    "type",
    "priority",
    "scope",
    "createdAt",
    "blockedBy",
  ] as const;
  const missingMetadata = requiredMetadata.find((field) => !(field in metadata));

  if (missingMetadata) {
    diagnostics.push({
      code: "missing-metadata",
      path: normalizedPath,
      message: `Falta el metadato obligatorio "${missingMetadata}".`,
    });
    return null;
  }

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

  const invalidMetadata = (message: string) => {
    diagnostics.push({
      code: "invalid-metadata",
      path: normalizedPath,
      message,
    });
    return null;
  };
  const unknownMetadata = Object.keys(metadata).find(
    (field) => !ISSUE_METADATA_FIELDS.has(field),
  );

  if (unknownMetadata) {
    return invalidMetadata(
      `El metadato "${unknownMetadata}" no forma parte del esquema de issues.`,
    );
  }

  if (typeof id !== "string" || !/^ISS-\d{4}$/.test(id)) {
    return invalidMetadata('El metadato "id" debe seguir el formato ISS-XXXX.');
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    return invalidMetadata('El metadato "title" debe ser texto no vacío.');
  }

  if (!isOneOf(kind, ISSUE_KINDS)) {
    return invalidMetadata(
      'El metadato "kind" debe ser uno de: simple-task, plan-slice.',
    );
  }

  if (!isOneOf(type, ISSUE_TYPES)) {
    return invalidMetadata(
      'El metadato "type" debe ser uno de: feature, fix, chore.',
    );
  }

  if (!isOneOf(priority, ISSUE_PRIORITIES)) {
    return invalidMetadata(
      'El metadato "priority" debe ser uno de: high, medium, low.',
    );
  }

  if (!isOneOf(scope, ISSUE_SCOPES)) {
    return invalidMetadata(
      'El metadato "scope" debe ser uno de: general, app.',
    );
  }

  if (scope === "app" && (typeof app !== "string" || app.length === 0)) {
    return invalidMetadata(
      'El metadato "app" es obligatorio cuando "scope" es "app".',
    );
  }

  if (scope === "general" && app !== undefined) {
    return invalidMetadata(
      'El metadato "app" solo puede declararse cuando "scope" es "app".',
    );
  }

  if (!isValidDate(createdAt)) {
    return invalidMetadata(
      'El metadato "createdAt" debe ser una fecha válida YYYY-MM-DD.',
    );
  }

  if (
    sourcePlan !== undefined &&
    (typeof sourcePlan !== "string" || !/^PLAN-\d{4}$/.test(sourcePlan))
  ) {
    return invalidMetadata(
      'El metadato "sourcePlan" debe seguir el formato PLAN-XXXX.',
    );
  }

  if (
    !Array.isArray(blockedBy) ||
    !blockedBy.every(
      (blockedIssue) =>
        typeof blockedIssue === "string" && /^ISS-\d{4}$/.test(blockedIssue),
    )
  ) {
    return invalidMetadata(
      'El metadato "blockedBy" debe ser una lista de IDs ISS-XXXX.',
    );
  }

  if (!isOneOf(state, ISSUE_STATES) || typeof filename !== "string") {
    return null;
  }

  if (!filename.startsWith(`${id}--`)) {
    diagnostics.push({
      code: "id-filename-mismatch",
      path: normalizedPath,
      message: `El ID "${id}" no coincide con el nombre "${filename}".`,
    });
    return null;
  }

  return {
    id,
    title,
    kind,
    type,
    priority,
    scope,
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

type IssueCandidate = {
  readonly issue: Issue;
  readonly path: string;
};

function findBlockingCycles(
  candidates: readonly IssueCandidate[],
): readonly (readonly string[])[] {
  const issuesById = new Map(
    candidates.map((candidate) => [candidate.issue.id, candidate.issue]),
  );
  const indices = new Map<string, number>();
  const lowLinks = new Map<string, number>();
  const stack: string[] = [];
  const onStack = new Set<string>();
  const cycles: string[][] = [];
  let nextIndex = 0;

  const visit = (id: string) => {
    indices.set(id, nextIndex);
    lowLinks.set(id, nextIndex);
    nextIndex += 1;
    stack.push(id);
    onStack.add(id);

    for (const blockerId of issuesById.get(id)?.blockedBy ?? []) {
      if (!issuesById.has(blockerId)) {
        continue;
      }

      if (!indices.has(blockerId)) {
        visit(blockerId);
        lowLinks.set(
          id,
          Math.min(lowLinks.get(id) ?? 0, lowLinks.get(blockerId) ?? 0),
        );
      } else if (onStack.has(blockerId)) {
        lowLinks.set(
          id,
          Math.min(lowLinks.get(id) ?? 0, indices.get(blockerId) ?? 0),
        );
      }
    }

    if (lowLinks.get(id) !== indices.get(id)) {
      return;
    }

    const component: string[] = [];
    let member: string | undefined;

    do {
      member = stack.pop();

      if (member) {
        onStack.delete(member);
        component.push(member);
      }
    } while (member !== id);

    if (component.length > 1) {
      cycles.push(component.sort());
    }
  };

  for (const { issue } of candidates) {
    if (!indices.has(issue.id)) {
      visit(issue.id);
    }
  }

  return cycles;
}

export function indexIssueSources(
  sources: readonly IssueSource[],
  context: IssueIndexContext,
): IssueIndex {
  const diagnostics: IssueDiagnostic[] = [];
  const candidates: IssueCandidate[] = [];
  const byState: Record<IssueState, Issue[]> = {
    backlog: [],
    "in-progress": [],
    "in-review": [],
    done: [],
  };

  for (const source of sources) {
    const issue = parseIssueSource(source, diagnostics);

    if (issue) {
      candidates.push({
        issue,
        path: source.path.replaceAll("\\", "/"),
      });
    }
  }

  const idCounts = new Map<string, number>();

  for (const { issue } of candidates) {
    idCounts.set(issue.id, (idCounts.get(issue.id) ?? 0) + 1);
  }

  const uniqueCandidates: IssueCandidate[] = [];

  for (const candidate of candidates) {
    const count = idCounts.get(candidate.issue.id) ?? 0;

    if (count > 1) {
      diagnostics.push({
        code: "duplicate-id",
        path: candidate.path,
        message: `El ID "${candidate.issue.id}" está duplicado en ${count} archivos.`,
      });
    } else {
      uniqueCandidates.push(candidate);
    }
  }

  const knownIssueIds = new Set(
    uniqueCandidates.map((candidate) => candidate.issue.id),
  );
  const referenceValidCandidates: IssueCandidate[] = [];

  for (const candidate of uniqueCandidates) {
    const { issue } = candidate;

    if (
      issue.scope === "app" &&
      issue.app !== undefined &&
      !context.knownApps.includes(issue.app)
    ) {
      diagnostics.push({
        code: "unknown-app",
        path: candidate.path,
        message: `La app "${issue.app}" no existe en apps/.`,
      });
      continue;
    }

    if (
      issue.sourcePlan !== undefined &&
      !context.knownPlans.includes(issue.sourcePlan)
    ) {
      diagnostics.push({
        code: "unknown-source-plan",
        path: candidate.path,
        message: `El plan "${issue.sourcePlan}" no existe en plans/.`,
      });
      continue;
    }

    const unknownBlocker = issue.blockedBy.find(
      (blockerId) => !knownIssueIds.has(blockerId),
    );

    if (unknownBlocker) {
      diagnostics.push({
        code: "unknown-blocker",
        path: candidate.path,
        message: `El bloqueador "${unknownBlocker}" no referencia una issue existente.`,
      });
      continue;
    }

    if (issue.blockedBy.includes(issue.id)) {
      diagnostics.push({
        code: "self-blocker",
        path: candidate.path,
        message: `La issue "${issue.id}" no puede bloquearse a sí misma.`,
      });
      continue;
    }

    referenceValidCandidates.push(candidate);
  }

  const cycleByIssueId = new Map<string, readonly string[]>();

  for (const cycle of findBlockingCycles(referenceValidCandidates)) {
    for (const issueId of cycle) {
      cycleByIssueId.set(issueId, cycle);
    }
  }

  for (const candidate of referenceValidCandidates) {
    const cycle = cycleByIssueId.get(candidate.issue.id);

    if (cycle) {
      diagnostics.push({
        code: "blocking-cycle",
        path: candidate.path,
        message: `La relación "blockedBy" forma un ciclo entre ${cycle.join(", ")}.`,
      });
    } else {
      byState[candidate.issue.state].push(candidate.issue);
    }
  }

  for (const state of ISSUE_STATES) {
    byState[state].sort(compareIssues);
  }

  return {
    issues: ISSUE_STATES.flatMap((state) => byState[state]),
    byState,
    diagnostics,
  };
}
