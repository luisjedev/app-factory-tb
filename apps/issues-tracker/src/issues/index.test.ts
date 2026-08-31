import { describe, expect, it } from "vitest";
import { indexIssueSources as indexIssueSourcesWithContext } from "./index";
import type { IssueIndexContext, IssueSource } from "./types";

const DEFAULT_CONTEXT: IssueIndexContext = {
  knownApps: ["issues-tracker", "ui-catalog", "web"],
  knownPlans: ["PLAN-0001"],
};

const indexIssueSources = (
  sources: readonly IssueSource[],
  context: IssueIndexContext = DEFAULT_CONTEXT,
) => indexIssueSourcesWithContext(sources, context);

const issueMarkdown = (metadata: string, body = "Contenido de la issue") =>
  `---\n${metadata}\n---\n\n${body}\n`;

const validMetadata = (id: string, title: string, extra = "") => `id: ${id}
title: ${title}
kind: simple-task
type: feature
priority: high
scope: general
createdAt: 2026-08-30
${extra}blockedBy: []`;

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
blockedBy: []`),
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
        blockedBy: [],
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

  it("rechaza rutas, nombres e IDs duplicados que rompen la identidad canónica", () => {
    const result = indexIssueSources([
      {
        path: "issues/backlog/tarea-sin-id.md",
        content: issueMarkdown(validMetadata("ISS-0040", "Ruta inválida")),
      },
      {
        path: "issues/backlog/ISS-0040--id-distinto.md",
        content: issueMarkdown(validMetadata("ISS-0041", "ID distinto")),
      },
      {
        path: "issues/backlog/ISS-0042--duplicada-a.md",
        content: issueMarkdown(validMetadata("ISS-0042", "Duplicada A")),
      },
      {
        path: "issues/done/ISS-0042--duplicada-b.md",
        content: issueMarkdown(validMetadata("ISS-0042", "Duplicada B")),
      },
    ]);

    expect(result.issues).toEqual([]);
    expect(result.diagnostics).toEqual([
      {
        code: "invalid-path",
        path: "issues/backlog/tarea-sin-id.md",
        message: "La ruta debe seguir issues/<estado>/ISS-XXXX--slug.md.",
      },
      {
        code: "id-filename-mismatch",
        path: "issues/backlog/ISS-0040--id-distinto.md",
        message:
          'El ID "ISS-0041" no coincide con el nombre "ISS-0040--id-distinto.md".',
      },
      {
        code: "duplicate-id",
        path: "issues/backlog/ISS-0042--duplicada-a.md",
        message: 'El ID "ISS-0042" está duplicado en 2 archivos.',
      },
      {
        code: "duplicate-id",
        path: "issues/done/ISS-0042--duplicada-b.md",
        message: 'El ID "ISS-0042" está duplicado en 2 archivos.',
      },
    ]);
  });

  it("diagnostica frontmatter ausente, ilegible o sin un objeto de metadatos", () => {
    const result = indexIssueSources([
      {
        path: "issues/backlog/ISS-0010--yaml-invalido.md",
        content: "---\ntitle: [sin cerrar\n---\n\nContenido\n",
      },
      {
        path: "issues/backlog/ISS-0011--sin-frontmatter.md",
        content: "Contenido sin frontmatter",
      },
      {
        path: "issues/backlog/ISS-0012--frontmatter-escalar.md",
        content: "---\ntexto\n---\n\nContenido\n",
      },
    ]);

    expect(result.diagnostics).toEqual([
      {
        code: "invalid-frontmatter",
        path: "issues/backlog/ISS-0010--yaml-invalido.md",
        message: "El frontmatter no contiene YAML válido.",
      },
      {
        code: "invalid-frontmatter",
        path: "issues/backlog/ISS-0011--sin-frontmatter.md",
        message: "El archivo debe comenzar con frontmatter delimitado por ---.",
      },
      {
        code: "invalid-frontmatter",
        path: "issues/backlog/ISS-0012--frontmatter-escalar.md",
        message: "El frontmatter debe contener un objeto de metadatos.",
      },
    ]);
  });

  it("diagnostica enums y combinaciones de scope y app inválidos", () => {
    const result = indexIssueSources([
      {
        path: "issues/backlog/ISS-0020--prioridad-invalida.md",
        content: issueMarkdown(`id: ISS-0020
title: Prioridad inválida
kind: simple-task
type: feature
priority: urgent
scope: general
createdAt: 2026-08-30
blockedBy: []`),
      },
      {
        path: "issues/backlog/ISS-0021--app-ausente.md",
        content: issueMarkdown(`id: ISS-0021
title: App ausente
kind: simple-task
type: feature
priority: high
scope: app
createdAt: 2026-08-30
blockedBy: []`),
      },
      {
        path: "issues/backlog/ISS-0022--app-inesperada.md",
        content: issueMarkdown(`id: ISS-0022
title: App inesperada
kind: simple-task
type: feature
priority: high
scope: general
app: web
createdAt: 2026-08-30
blockedBy: []`),
      },
    ]);

    expect(result.diagnostics).toEqual([
      {
        code: "invalid-metadata",
        path: "issues/backlog/ISS-0020--prioridad-invalida.md",
        message:
          'El metadato "priority" debe ser uno de: high, medium, low.',
      },
      {
        code: "invalid-metadata",
        path: "issues/backlog/ISS-0021--app-ausente.md",
        message:
          'El metadato "app" es obligatorio cuando "scope" es "app".',
      },
      {
        code: "invalid-metadata",
        path: "issues/backlog/ISS-0022--app-inesperada.md",
        message:
          'El metadato "app" solo puede declararse cuando "scope" es "app".',
      },
    ]);
  });

  it("valida cada campo del esquema con diagnósticos específicos", () => {
    const invalidMetadataCases = [
      [
        `id: issue-30\ntitle: Inválida\nkind: simple-task\ntype: feature\npriority: high\nscope: general\ncreatedAt: 2026-08-30\nblockedBy: []`,
        'El metadato "id" debe seguir el formato ISS-XXXX.',
      ],
      [
        `id: ISS-0030\ntitle: ""\nkind: simple-task\ntype: feature\npriority: high\nscope: general\ncreatedAt: 2026-08-30\nblockedBy: []`,
        'El metadato "title" debe ser texto no vacío.',
      ],
      [
        `id: ISS-0030\ntitle: Inválida\nkind: task\ntype: feature\npriority: high\nscope: general\ncreatedAt: 2026-08-30\nblockedBy: []`,
        'El metadato "kind" debe ser uno de: simple-task, plan-slice.',
      ],
      [
        `id: ISS-0030\ntitle: Inválida\nkind: simple-task\ntype: bug\npriority: high\nscope: general\ncreatedAt: 2026-08-30\nblockedBy: []`,
        'El metadato "type" debe ser uno de: feature, fix, chore.',
      ],
      [
        `id: ISS-0030\ntitle: Inválida\nkind: simple-task\ntype: feature\npriority: high\nscope: workspace\ncreatedAt: 2026-08-30\nblockedBy: []`,
        'El metadato "scope" debe ser uno de: general, app.',
      ],
      [
        `id: ISS-0030\ntitle: Inválida\nkind: simple-task\ntype: feature\npriority: high\nscope: general\ncreatedAt: 2026-02-30\nblockedBy: []`,
        'El metadato "createdAt" debe ser una fecha válida YYYY-MM-DD.',
      ],
      [
        `id: ISS-0030\ntitle: Inválida\nkind: simple-task\ntype: feature\npriority: high\nscope: general\ncreatedAt: 2026-08-30\nsourcePlan: plan-1\nblockedBy: []`,
        'El metadato "sourcePlan" debe seguir el formato PLAN-XXXX.',
      ],
      [
        `id: ISS-0030\ntitle: Inválida\nkind: simple-task\ntype: feature\npriority: high\nscope: general\ncreatedAt: 2026-08-30\nblockedBy:\n  - issue-1`,
        'El metadato "blockedBy" debe ser una lista de IDs ISS-XXXX.',
      ],
      [
        `id: ISS-0030\ntitle: Inválida\nkind: simple-task\ntype: feature\npriority: high\nscope: general\ncreatedAt: 2026-08-30\nblockedBy: []\nstatus: backlog`,
        'El metadato "status" no forma parte del esquema de issues.',
      ],
    ] as const;

    for (const [metadata, message] of invalidMetadataCases) {
      const result = indexIssueSources([
        {
          path: "issues/backlog/ISS-0030--invalida.md",
          content: issueMarkdown(metadata),
        },
      ]);

      expect(result.diagnostics).toEqual([
        {
          code: "invalid-metadata",
          path: "issues/backlog/ISS-0030--invalida.md",
          message,
        },
      ]);
    }
  });

  it("valida apps, planes y el grafo de bloqueos sin perder fuentes sanas", () => {
    const result = indexIssueSources(
      [
        {
          path: "issues/backlog/ISS-0050--valida.md",
          content: issueMarkdown(validMetadata("ISS-0050", "Válida")),
        },
        {
          path: "issues/backlog/ISS-0051--app-desconocida.md",
          content: issueMarkdown(`id: ISS-0051
title: App desconocida
kind: simple-task
type: feature
priority: high
scope: app
app: fantasma
createdAt: 2026-08-30
blockedBy: []`),
        },
        {
          path: "issues/backlog/ISS-0052--plan-desconocido.md",
          content: issueMarkdown(
            validMetadata(
              "ISS-0052",
              "Plan desconocido",
              "sourcePlan: PLAN-9999\n",
            ),
          ),
        },
        {
          path: "issues/backlog/ISS-0053--bloqueador-desconocido.md",
          content: issueMarkdown(`id: ISS-0053
title: Bloqueador desconocido
kind: simple-task
type: feature
priority: high
scope: general
createdAt: 2026-08-30
blockedBy:
  - ISS-9999`),
        },
        {
          path: "issues/backlog/ISS-0054--autorreferencia.md",
          content: issueMarkdown(`id: ISS-0054
title: Autorreferencia
kind: simple-task
type: feature
priority: high
scope: general
createdAt: 2026-08-30
blockedBy:
  - ISS-0054`),
        },
        {
          path: "issues/backlog/ISS-0055--ciclo-a.md",
          content: issueMarkdown(`id: ISS-0055
title: Ciclo A
kind: simple-task
type: feature
priority: high
scope: general
createdAt: 2026-08-30
blockedBy:
  - ISS-0056`),
        },
        {
          path: "issues/backlog/ISS-0056--ciclo-b.md",
          content: issueMarkdown(`id: ISS-0056
title: Ciclo B
kind: simple-task
type: feature
priority: high
scope: general
createdAt: 2026-08-30
blockedBy:
  - ISS-0055`),
        },
      ],
      { knownApps: ["web"], knownPlans: ["PLAN-0001"] },
    );

    expect(result.issues.map((issue) => issue.id)).toEqual(["ISS-0050"]);
    expect(result.diagnostics).toEqual([
      {
        code: "unknown-app",
        path: "issues/backlog/ISS-0051--app-desconocida.md",
        message: 'La app "fantasma" no existe en apps/.',
      },
      {
        code: "unknown-source-plan",
        path: "issues/backlog/ISS-0052--plan-desconocido.md",
        message: 'El plan "PLAN-9999" no existe en plans/.',
      },
      {
        code: "unknown-blocker",
        path: "issues/backlog/ISS-0053--bloqueador-desconocido.md",
        message:
          'El bloqueador "ISS-9999" no referencia una issue existente.',
      },
      {
        code: "self-blocker",
        path: "issues/backlog/ISS-0054--autorreferencia.md",
        message: 'La issue "ISS-0054" no puede bloquearse a sí misma.',
      },
      {
        code: "blocking-cycle",
        path: "issues/backlog/ISS-0055--ciclo-a.md",
        message:
          'La relación "blockedBy" forma un ciclo entre ISS-0055, ISS-0056.',
      },
      {
        code: "blocking-cycle",
        path: "issues/backlog/ISS-0056--ciclo-b.md",
        message:
          'La relación "blockedBy" forma un ciclo entre ISS-0055, ISS-0056.',
      },
    ]);
  });

  it("diagnostica metadatos ausentes sin ocultar las issues válidas", () => {
    const result = indexIssueSources([
      {
        path: "issues/backlog/ISS-0010--valida.md",
        content: issueMarkdown(`id: ISS-0010
title: Issue válida
kind: simple-task
type: feature
priority: high
scope: general
createdAt: 2026-08-30
blockedBy: []`),
      },
      {
        path: "issues/backlog/ISS-0011--sin-titulo.md",
        content: issueMarkdown(`id: ISS-0011
kind: simple-task
type: feature
priority: high
scope: general
createdAt: 2026-08-30
blockedBy: []`),
      },
    ]);

    expect(result.issues.map((issue) => issue.id)).toEqual(["ISS-0010"]);
    expect(result.diagnostics).toEqual([
      {
        code: "missing-metadata",
        path: "issues/backlog/ISS-0011--sin-titulo.md",
        message: 'Falta el metadato obligatorio "title".',
      },
    ]);
  });
});
