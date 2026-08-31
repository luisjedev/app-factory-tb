import { access, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

const REQUIRED_ALIASES = [
  "new-issue",
  "take-issue",
  "close-issue",
  "to-plan",
  "to-issues",
] as const;
const ISSUE_STATES = ["backlog", "in-progress", "in-review", "done"] as const;

export type SkillContractDiagnostic = {
  readonly code: string;
  readonly path: string;
  readonly message: string;
};

type SkillDeclaration = {
  readonly name: string;
  readonly path: string;
};

const relativePath = (repositoryRoot: string, filePath: string) =>
  path.relative(repositoryRoot, filePath).split(path.sep).join("/");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export async function validateSkillContracts(
  repositoryRoot: string,
): Promise<readonly SkillContractDiagnostic[]> {
  const diagnostics: SkillContractDiagnostic[] = [];
  const declarations: SkillDeclaration[] = [];
  const skillsRoot = path.join(repositoryRoot, ".agents/skills");
  const skillDirectories = await readdir(skillsRoot, { withFileTypes: true });

  for (const directory of skillDirectories.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    if (!directory.isDirectory()) {
      continue;
    }

    const skillPath = path.join(skillsRoot, directory.name, "SKILL.md");
    let content: string;

    try {
      content = await readFile(skillPath, "utf8");
    } catch {
      continue;
    }

    const artifactPath = relativePath(repositoryRoot, skillPath);
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content);

    if (!frontmatter) {
      diagnostics.push({
        code: "invalid-skill-frontmatter",
        path: artifactPath,
        message: "La skill debe comenzar con frontmatter delimitado por ---.",
      });
      continue;
    }

    let metadata: unknown;

    try {
      metadata = parse(frontmatter[1] ?? "");
    } catch {
      diagnostics.push({
        code: "invalid-skill-frontmatter",
        path: artifactPath,
        message: "El frontmatter de la skill no contiene YAML válido.",
      });
      continue;
    }

    const name = isRecord(metadata) ? metadata.name : undefined;
    const description = isRecord(metadata) ? metadata.description : undefined;

    if (
      typeof name !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)
    ) {
      diagnostics.push({
        code: "invalid-skill-name",
        path: artifactPath,
        message: "El nombre de la skill debe usar minúsculas, números y guiones.",
      });
    } else {
      declarations.push({ name, path: artifactPath });
    }

    if (typeof description !== "string" || description.trim().length === 0) {
      diagnostics.push({
        code: "invalid-skill-description",
        path: artifactPath,
        message: "La descripción de la skill debe ser texto no vacío.",
      });
    }

    const markdownLink = /\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g;

    for (const match of content.matchAll(markdownLink)) {
      const destination = match[1];

      if (
        !destination ||
        destination.startsWith("#") ||
        /^[a-z][a-z0-9+.-]*:/i.test(destination)
      ) {
        continue;
      }

      const localPath = destination.split("#", 1)[0];

      if (!localPath?.toLowerCase().endsWith(".md")) {
        continue;
      }

      try {
        await access(path.resolve(path.dirname(skillPath), localPath));
      } catch {
        diagnostics.push({
          code: "missing-skill-reference",
          path: artifactPath,
          message: `La referencia local "${destination}" no existe.`,
        });
      }
    }
  }

  const nameCounts = new Map<string, number>();

  for (const declaration of declarations) {
    nameCounts.set(
      declaration.name,
      (nameCounts.get(declaration.name) ?? 0) + 1,
    );
  }

  for (const declaration of declarations) {
    if ((nameCounts.get(declaration.name) ?? 0) > 1) {
      diagnostics.push({
        code: "duplicate-skill-name",
        path: declaration.path,
        message: `El nombre de skill "${declaration.name}" está duplicado.`,
      });
    }
  }

  for (const alias of REQUIRED_ALIASES) {
    const aliasPath = path.join(repositoryRoot, `.pi/prompts/${alias}.md`);
    const artifactPath = `.pi/prompts/${alias}.md`;
    let content: string;

    try {
      content = await readFile(aliasPath, "utf8");
    } catch {
      diagnostics.push({
        code: "missing-skill-alias",
        path: artifactPath,
        message: `Falta el alias público "/${alias}".`,
      });
      continue;
    }

    const expectedSkill = `.agents/skills/${alias}/SKILL.md`;

    if (!content.includes(expectedSkill)) {
      diagnostics.push({
        code: "invalid-skill-alias",
        path: artifactPath,
        message: `El alias debe cargar la skill "${expectedSkill}".`,
      });
    }
  }

  for (const state of ISSUE_STATES) {
    const artifactPath = `apps/issues-tracker/issues/${state}`;

    try {
      if (!(await stat(path.join(repositoryRoot, artifactPath))).isDirectory()) {
        throw new Error("Not a directory");
      }
    } catch {
      diagnostics.push({
        code: "missing-canonical-directory",
        path: artifactPath,
        message: `Falta el directorio canónico de estado "${state}".`,
      });
    }
  }

  const plansPath = "apps/issues-tracker/plans";

  try {
    if (!(await stat(path.join(repositoryRoot, plansPath))).isDirectory()) {
      throw new Error("Not a directory");
    }
  } catch {
    diagnostics.push({
      code: "missing-canonical-directory",
      path: plansPath,
      message: "Falta el directorio canónico de planes.",
    });
  }

  return diagnostics;
}
