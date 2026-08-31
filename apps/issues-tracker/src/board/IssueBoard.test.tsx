import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IssueBoard } from "./IssueBoard";
import type { Issue, IssueDiagnostic } from "../issues/types";

const diagnostics: readonly IssueDiagnostic[] = [
  {
    code: "unknown-blocker",
    path: "issues/backlog/ISS-0003--invalida.md",
    message: 'El bloqueador "ISS-9999" no referencia una issue existente.',
  },
];

const issues: readonly Issue[] = [
  {
    id: "ISS-0002",
    title: "Crear el tablero base",
    kind: "plan-slice",
    type: "feature",
    priority: "high",
    scope: "general",
    createdAt: "2026-08-30",
    blockedBy: ["ISS-0001"],
    content: "Especificación",
    state: "in-progress",
  },
  {
    id: "ISS-0001",
    title: "Ampliar la interfaz compartida",
    kind: "plan-slice",
    type: "feature",
    priority: "medium",
    scope: "app",
    app: "ui-catalog",
    createdAt: "2026-08-20",
    blockedBy: [],
    content: "Especificación",
    state: "done",
  },
];

describe("IssueBoard", () => {
  it("muestra siempre las cuatro columnas con sus contadores y tarjetas", () => {
    render(<IssueBoard issues={issues} />);

    const expectedColumns = [
      ["Backlog", "0"],
      ["En progreso", "1"],
      ["En revisión", "0"],
      ["Completado", "1"],
    ] as const;

    for (const [name, count] of expectedColumns) {
      const column = screen.getByRole("region", { name });
      const issueLabel = count === "1" ? "issue" : "issues";
      expect(
        within(column).getByLabelText(`${count} ${issueLabel} en ${name}`),
      ).toBeInTheDocument();
    }

    const activeIssue = screen.getByRole("article", {
      name: "ISS-0002 Crear el tablero base",
    });
    expect(within(activeIssue).getByText("Prioridad alta")).toBeInTheDocument();
    expect(within(activeIssue).getByText("Feature")).toBeInTheDocument();
    expect(within(activeIssue).getByText("General")).toBeInTheDocument();
    expect(within(activeIssue).getByText("30 ago 2026")).toBeInTheDocument();

    const appIssue = screen.getByRole("article", {
      name: "ISS-0001 Ampliar la interfaz compartida",
    });
    expect(within(appIssue).getByText("ui-catalog")).toBeInTheDocument();
  });

  it("muestra diagnósticos parciales sin ocultar las issues válidas", () => {
    render(<IssueBoard diagnostics={diagnostics} issues={issues} />);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Fuente parcialmente inválida");
    expect(status).toHaveTextContent(
      "issues/backlog/ISS-0003--invalida.md",
    );
    expect(status).toHaveTextContent(
      'El bloqueador "ISS-9999" no referencia una issue existente.',
    );
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("distingue una fuente inválida y un fallo de carga del repositorio vacío", () => {
    const { rerender } = render(
      <IssueBoard diagnostics={diagnostics} issues={[]} />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No se pudieron indexar issues",
    );
    expect(
      screen.queryByText("Todavía no hay issues en el repositorio"),
    ).not.toBeInTheDocument();

    rerender(
      <IssueBoard
        issues={[]}
        loadError="No se pudieron leer las fuentes Markdown."
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No se pudo cargar el repositorio",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No se pudieron leer las fuentes Markdown.",
    );
    expect(
      screen.queryByText("Todavía no hay issues en el repositorio"),
    ).not.toBeInTheDocument();
  });

  it("distingue un repositorio vacío y conserva las cuatro columnas", () => {
    render(<IssueBoard issues={[]} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Todavía no hay issues en el repositorio",
    );
    expect(screen.getAllByRole("region")).toHaveLength(4);
  });
});
