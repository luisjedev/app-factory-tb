import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { validateSkillContracts } from "./skill-contracts.js";

const REQUIRED_SKILLS = [
  "new-issue",
  "take-issue",
  "close-issue",
  "to-plan",
  "to-issues",
] as const;
const fixtureRoots: string[] = [];

async function writeFixtureFile(
  repositoryRoot: string,
  relativePath: string,
  content: string,
) {
  const filePath = path.join(repositoryRoot, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

async function createValidFixture() {
  const repositoryRoot = await mkdtemp(
    path.join(tmpdir(), "issues-tracker-skill-contracts-"),
  );
  fixtureRoots.push(repositoryRoot);

  for (const skill of REQUIRED_SKILLS) {
    await writeFixtureFile(
      repositoryRoot,
      `.agents/skills/${skill}/SKILL.md`,
      `---\nname: ${skill}\ndescription: Skill ${skill}\n---\n`,
    );
    await writeFixtureFile(
      repositoryRoot,
      `.pi/prompts/${skill}.md`,
      `Carga la skill local \`.agents/skills/${skill}/SKILL.md\`.\n`,
    );
  }

  for (const state of ["backlog", "in-progress", "in-review", "done"]) {
    await mkdir(
      path.join(repositoryRoot, "apps/issues-tracker/issues", state),
      { recursive: true },
    );
  }
  await mkdir(path.join(repositoryRoot, "apps/issues-tracker/plans"), {
    recursive: true,
  });

  return repositoryRoot;
}

afterEach(async () => {
  await Promise.all(
    fixtureRoots.splice(0).map((fixtureRoot) =>
      rm(fixtureRoot, { recursive: true, force: true }),
    ),
  );
});

describe("validateSkillContracts", () => {
  it("valida el árbol estructural real del repositorio", async () => {
    const repositoryRoot = path.resolve(process.cwd(), "../..");

    await expect(validateSkillContracts(repositoryRoot)).resolves.toEqual([]);
  });

  it("diagnostica el frontmatter ilegible identificando la skill", async () => {
    const repositoryRoot = await createValidFixture();
    await writeFixtureFile(
      repositoryRoot,
      ".agents/skills/invalida/SKILL.md",
      "---\nname: [sin cerrar\n---\n",
    );

    await expect(validateSkillContracts(repositoryRoot)).resolves.toEqual([
      {
        code: "invalid-skill-frontmatter",
        path: ".agents/skills/invalida/SKILL.md",
        message: "El frontmatter de la skill no contiene YAML válido.",
      },
    ]);
  });

  it("valida el nombre y la descripción declarados por cada skill", async () => {
    const repositoryRoot = await createValidFixture();
    await writeFixtureFile(
      repositoryRoot,
      ".agents/skills/invalida/SKILL.md",
      "---\nname: Nombre inválido\ndescription: \"\"\n---\n",
    );

    await expect(validateSkillContracts(repositoryRoot)).resolves.toEqual([
      {
        code: "invalid-skill-name",
        path: ".agents/skills/invalida/SKILL.md",
        message: "El nombre de la skill debe usar minúsculas, números y guiones.",
      },
      {
        code: "invalid-skill-description",
        path: ".agents/skills/invalida/SKILL.md",
        message: "La descripción de la skill debe ser texto no vacío.",
      },
    ]);
  });

  it("detecta nombres de skill duplicados", async () => {
    const repositoryRoot = await createValidFixture();
    await writeFixtureFile(
      repositoryRoot,
      ".agents/skills/duplicada/SKILL.md",
      "---\nname: new-issue\ndescription: Duplicada\n---\n",
    );

    await expect(validateSkillContracts(repositoryRoot)).resolves.toEqual([
      {
        code: "duplicate-skill-name",
        path: ".agents/skills/duplicada/SKILL.md",
        message: 'El nombre de skill "new-issue" está duplicado.',
      },
      {
        code: "duplicate-skill-name",
        path: ".agents/skills/new-issue/SKILL.md",
        message: 'El nombre de skill "new-issue" está duplicado.',
      },
    ]);
  });

  it("detecta referencias Markdown locales inexistentes", async () => {
    const repositoryRoot = await createValidFixture();
    await writeFixtureFile(
      repositoryRoot,
      ".agents/skills/new-issue/SKILL.md",
      "---\nname: new-issue\ndescription: Nueva issue\n---\n\nLee [el contrato](missing.md).\n",
    );

    await expect(validateSkillContracts(repositoryRoot)).resolves.toEqual([
      {
        code: "missing-skill-reference",
        path: ".agents/skills/new-issue/SKILL.md",
        message: 'La referencia local "missing.md" no existe.',
      },
    ]);
  });

  it("detecta alias ausentes o dirigidos a otra skill", async () => {
    const repositoryRoot = await createValidFixture();
    await rm(path.join(repositoryRoot, ".pi/prompts/to-plan.md"));
    await writeFixtureFile(
      repositoryRoot,
      ".pi/prompts/take-issue.md",
      "Carga la skill local `.agents/skills/new-issue/SKILL.md`.\n",
    );

    await expect(validateSkillContracts(repositoryRoot)).resolves.toEqual([
      {
        code: "invalid-skill-alias",
        path: ".pi/prompts/take-issue.md",
        message:
          'El alias debe cargar la skill ".agents/skills/take-issue/SKILL.md".',
      },
      {
        code: "missing-skill-alias",
        path: ".pi/prompts/to-plan.md",
        message: 'Falta el alias público "/to-plan".',
      },
    ]);
  });

  it("detecta directorios canónicos ausentes", async () => {
    const repositoryRoot = await createValidFixture();
    await rm(path.join(repositoryRoot, "apps/issues-tracker/issues/backlog"), {
      recursive: true,
    });
    await rm(path.join(repositoryRoot, "apps/issues-tracker/plans"), {
      recursive: true,
    });

    await expect(validateSkillContracts(repositoryRoot)).resolves.toEqual([
      {
        code: "missing-canonical-directory",
        path: "apps/issues-tracker/issues/backlog",
        message: 'Falta el directorio canónico de estado "backlog".',
      },
      {
        code: "missing-canonical-directory",
        path: "apps/issues-tracker/plans",
        message: "Falta el directorio canónico de planes.",
      },
    ]);
  });
});
