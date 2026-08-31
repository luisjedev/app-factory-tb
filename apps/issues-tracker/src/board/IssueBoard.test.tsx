import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    sourcePlan: "PLAN-0001",
    blockedBy: ["ISS-0001"],
    content: "## Resultado esperado\n\nEspecificación completa.",
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

const filterIssues: readonly Issue[] = [
  ...issues,
  {
    id: "ISS-0003",
    title: "Corregir fuentes Markdown",
    kind: "simple-task",
    type: "fix",
    priority: "low",
    scope: "app",
    app: "issues-tracker",
    createdAt: "2026-08-31",
    blockedBy: [],
    content: "## Resultado esperado\n\nMostrar diagnósticos.",
    state: "done",
  },
  {
    id: "ISS-0004",
    title: "Validar las skills locales",
    kind: "simple-task",
    type: "chore",
    priority: "medium",
    scope: "general",
    createdAt: "2026-09-01",
    blockedBy: [],
    content: "## Resultado esperado\n\nValidar contratos.",
    state: "backlog",
  },
];

describe("IssueBoard", () => {
  it("busca por ID o título sin distinguir mayúsculas y minúsculas", () => {
    render(<IssueBoard issues={issues} />);

    const search = screen.getByRole("searchbox", { name: "Buscar issues" });

    fireEvent.change(search, { target: { value: "AMPLIAR" } });

    expect(
      screen.getByRole("article", {
        name: "ISS-0001 Ampliar la interfaz compartida",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("article", {
        name: "ISS-0002 Crear el tablero base",
      }),
    ).not.toBeInTheDocument();
    expect(
      within(screen.getByRole("region", { name: "Completado" })).getByLabelText(
        "1 issue en Completado",
      ),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("region", { name: "En progreso" })).getByLabelText(
        "0 issues en En progreso",
      ),
    ).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "iss-0002" } });

    expect(
      screen.getByRole("article", {
        name: "ISS-0002 Crear el tablero base",
      }),
    ).toBeInTheDocument();
  });

  it("combina filtros y permite restablecer todos los criterios", () => {
    render(<IssueBoard issues={filterIssues} />);

    const appFilter = screen.getByRole("combobox", { name: "Aplicación" });
    const typeFilter = screen.getByRole("combobox", { name: "Tipo" });
    const priorityFilter = screen.getByRole("combobox", { name: "Prioridad" });

    fireEvent.change(appFilter, { target: { value: "issues-tracker" } });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Corregir fuentes Markdown")).toBeInTheDocument();

    fireEvent.change(appFilter, { target: { value: "" } });
    fireEvent.change(typeFilter, { target: { value: "chore" } });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Validar las skills locales")).toBeInTheDocument();

    fireEvent.change(typeFilter, { target: { value: "" } });
    fireEvent.change(priorityFilter, { target: { value: "medium" } });
    expect(screen.getAllByRole("article")).toHaveLength(2);

    fireEvent.change(appFilter, { target: { value: "ui-catalog" } });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Ampliar la interfaz compartida")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar issues" }), {
      target: { value: "sin coincidencia" },
    });
    expect(screen.queryAllByRole("article")).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: "Restablecer filtros" }));

    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(appFilter).toHaveValue("");
    expect(typeFilter).toHaveValue("");
    expect(priorityFilter).toHaveValue("");
    expect(
      screen.getByRole("searchbox", { name: "Buscar issues" }),
    ).toHaveValue("");
  });

  it("distingue una consulta sin resultados del repositorio vacío", () => {
    render(<IssueBoard issues={issues} />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar issues" }), {
      target: { value: "no existe" },
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      "No hay issues que coincidan con los criterios activos",
    );
    expect(
      screen.queryByText("Todavía no hay issues en el repositorio"),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("0", { selector: "span" })).toHaveLength(4);
  });

  it("abre y cierra el detalle completo con teclado y foco predecible", async () => {
    const user = userEvent.setup();
    render(<IssueBoard issues={issues} />);

    const openButton = screen.getByRole("button", {
      name: "Ver detalle de ISS-0002",
    });
    const focusOrder = [
      screen.getByRole("searchbox", { name: "Buscar issues" }),
      screen.getByRole("combobox", { name: "Aplicación" }),
      screen.getByRole("combobox", { name: "Tipo" }),
      screen.getByRole("combobox", { name: "Prioridad" }),
      screen.getByRole("button", { name: "Restablecer filtros" }),
      openButton,
    ];

    for (const control of focusOrder) {
      await user.tab();
      expect(control).toHaveFocus();
    }

    expect(openButton).toHaveAttribute("aria-expanded", "false");

    await user.keyboard("{Enter}");

    const detail = screen.getByRole("region", {
      name: "Detalle de ISS-0002",
    });
    expect(openButton).toHaveFocus();
    expect(openButton).toHaveAttribute("aria-expanded", "true");
    expect(
      within(detail).getByRole("heading", { name: "Resultado esperado" }),
    ).toBeInTheDocument();
    expect(detail).toHaveTextContent("Especificación completa.");
    expect(detail).toHaveTextContent("Clase Parte de plan");
    expect(detail).toHaveTextContent("Tipo Feature");
    expect(detail).toHaveTextContent("Prioridad alta");
    expect(within(detail).getByText("30 ago 2026")).toBeInTheDocument();
    expect(detail).toHaveTextContent("Plan de origen PLAN-0001");
    expect(detail).toHaveTextContent("Bloqueada por ISS-0001");

    const closeButton = screen.getByRole("button", {
      name: "Ocultar detalle de ISS-0002",
    });
    await user.keyboard("{Enter}");

    expect(closeButton).toHaveFocus();
    expect(closeButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("region", { name: "Detalle de ISS-0002" }),
    ).not.toBeInTheDocument();
  });

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
