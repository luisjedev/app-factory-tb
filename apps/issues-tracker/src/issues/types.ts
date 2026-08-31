export const ISSUE_STATES = [
  "backlog",
  "in-progress",
  "in-review",
  "done",
] as const;

export type IssueState = (typeof ISSUE_STATES)[number];
export type IssueKind = "simple-task" | "plan-slice";
export type IssueType = "feature" | "fix" | "chore";
export type IssuePriority = "high" | "medium" | "low";
export type IssueScope = "general" | "app";

export interface Issue {
  readonly id: string;
  readonly title: string;
  readonly kind: IssueKind;
  readonly type: IssueType;
  readonly priority: IssuePriority;
  readonly scope: IssueScope;
  readonly app?: string;
  readonly createdAt: string;
  readonly sourcePlan?: string;
  readonly blockedBy: readonly string[];
  readonly content: string;
  readonly state: IssueState;
}

export interface IssueSource {
  readonly path: string;
  readonly content: string;
}

export interface IssueIndex {
  readonly issues: readonly Issue[];
  readonly byState: Readonly<Record<IssueState, readonly Issue[]>>;
}
