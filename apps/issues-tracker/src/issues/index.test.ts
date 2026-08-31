import { describe, expect, it } from "vitest";
import { indexIssueSources } from "./index";

const issueMarkdown = (metadata: string, body = "Contenido de la issue") =>
  `---\n${metadata}\n---\n\n${body}\n`;

describe("indexIssueSources", () => {
  it("normaliza, ordena y agrupa únicamente issues de directorios canónicos", () => {
    const result = indexIssueSources([
      {
        path: "issues/backlog/ISS-0012--tarea-media.md",
        content: issueMarkdown(`id: ISS-0012
title: Tarea media
kind: simple-task
type: chore
priority: medium
scope: general
createdAt: 2026-08-30
blockedBy: []`),
      },
      {
        path: "issues/backlog/ISS-0010--tarea-alta.md",
        content: issueMarkdown(`id: ISS-0010
title: Tarea alta
kind: plan-slice
type: feature
priority: high
scope: app
app: web
createdAt: 2026-08-29
sourcePlan: PLAN-0001
blockedBy:
  - ISS-0002`),
      },
      {
        path: "issues/done/ISS-0009--terminada.md",
        content: issueMarkdown(`id: ISS-0009
title: Terminada
kind: simple-task
type: fix
priority: low
scope: general
createdAt: 2026-08-20
blockedBy: []`, "Resultado entregado"),
      },
      {
        path: "plans/PLAN-0001--iniciativa.md",
        content: issueMarkdown(`id: ISS-9999
title: No debe aparecer
kind: simple-task
type: feature
priority: high
scope: general
createdAt: 2026-08-01
blockedBy: []`),
      },
    ]);

    expect(result.issues).toEqual([
      {
        id: "ISS-0010",
        title: "Tarea alta",
        kind: "plan-slice",
        type: "feature",
        priority: "high",
        scope: "app",
        app: "web",
        createdAt: "2026-08-29",
        sourcePlan: "PLAN-0001",
        blockedBy: ["ISS-0002"],
        content: "Contenido de la issue",
        state: "backlog",
      },
      {
        id: "ISS-0012",
        title: "Tarea media",
        kind: "simple-task",
        type: "chore",
        priority: "medium",
        scope: "general",
        createdAt: "2026-08-30",
        blockedBy: [],
        content: "Contenido de la issue",
        state: "backlog",
      },
      {
        id: "ISS-0009",
        title: "Terminada",
        kind: "simple-task",
        type: "fix",
        priority: "low",
        scope: "general",
        createdAt: "2026-08-20",
        blockedBy: [],
        content: "Resultado entregado",
        state: "done",
      },
    ]);
    expect(result.byState).toEqual({
      backlog: result.issues.slice(0, 2),
      "in-progress": [],
      "in-review": [],
      done: result.issues.slice(2),
    });
  });
});
