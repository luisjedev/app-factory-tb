import type { Issue, IssueState } from "../issues/types";

export const STATE_LABELS: Readonly<Record<IssueState, string>> = {
  backlog: "Backlog",
  "in-progress": "En progreso",
  "in-review": "En revisión",
  done: "Completado",
};

export const PRIORITY_LABELS: Readonly<Record<Issue["priority"], string>> = {
  high: "Prioridad alta",
  medium: "Prioridad media",
  low: "Prioridad baja",
};

export const TYPE_LABELS: Readonly<Record<Issue["type"], string>> = {
  feature: "Feature",
  fix: "Fix",
  chore: "Chore",
};

export const KIND_LABELS: Readonly<Record<Issue["kind"], string>> = {
  "simple-task": "Tarea sencilla",
  "plan-slice": "Parte de plan",
};
