import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import { indexIssueSources } from "../src/issues/index.js";
import { ISSUE_STATES, type IssueSource } from "../src/issues/types.js";

const VIRTUAL_MODULE_ID = "virtual:issues";
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;
const ISSUE_FILE = /^(backlog|in-progress|in-review|done)\/[^/]+\.md$/;
const PLAN_FILE = /^(PLAN-\d{4})--[a-z0-9-]+\.md$/;

async function readIssueSources(issuesRoot: string) {
  const sources: IssueSource[] = [];

  for (const state of ISSUE_STATES) {
    const stateRoot = path.join(issuesRoot, state);
    const entries = await readdir(stateRoot, { withFileTypes: true });

    for (const entry of entries.sort((left, right) =>
      left.name.localeCompare(right.name),
    )) {
      if (!entry.isFile() || !entry.name.endsWith(".md")) {
        continue;
      }

      sources.push({
        path: `issues/${state}/${entry.name}`,
        content: await readFile(path.join(stateRoot, entry.name), "utf8"),
      });
    }
  }

  return sources;
}

async function readKnownApps(appsRoot: string) {
  const entries = await readdir(appsRoot, { withFileTypes: true });
  const apps: string[] = [];

  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    if (!entry.isDirectory()) {
      continue;
    }

    const directoryEntries = await readdir(path.join(appsRoot, entry.name));

    if (!directoryEntries.includes("package.json")) {
      continue;
    }

    const packageJson: unknown = JSON.parse(
      await readFile(path.join(appsRoot, entry.name, "package.json"), "utf8"),
    );

    if (
      typeof packageJson === "object" &&
      packageJson !== null &&
      "name" in packageJson &&
      typeof packageJson.name === "string"
    ) {
      apps.push(entry.name);
    }
  }

  return apps;
}

async function readKnownPlans(plansRoot: string) {
  const entries = await readdir(plansRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .flatMap((entry) => PLAN_FILE.exec(entry.name)?.[1] ?? []);
}

function watchesIssue(issuesRoot: string, file: string) {
  const relativePath = path.relative(issuesRoot, file).split(path.sep).join("/");
  return ISSUE_FILE.test(relativePath);
}

function refreshIssues(server: ViteDevServer) {
  const module = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);

  if (module) {
    server.moduleGraph.invalidateModule(module);
  }

  server.ws.send({ type: "full-reload", path: "*" });
}

export function issuesPlugin(): Plugin {
  let appsRoot = "";
  let issuesRoot = "";
  let plansRoot = "";

  return {
    name: "issues-markdown-index",
    enforce: "pre",
    configResolved(config) {
      const workspaceRoot = path.resolve(config.root, "../..");
      appsRoot = path.join(workspaceRoot, "apps");
      issuesRoot = path.resolve(config.root, "issues");
      plansRoot = path.resolve(config.root, "plans");
    },
    resolveId(id) {
      return id === VIRTUAL_MODULE_ID ? RESOLVED_VIRTUAL_MODULE_ID : null;
    },
    async load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) {
        return null;
      }

      try {
        const [sources, knownApps, knownPlans] = await Promise.all([
          readIssueSources(issuesRoot),
          readKnownApps(appsRoot),
          readKnownPlans(plansRoot),
        ]);
        const index = indexIssueSources(sources, { knownApps, knownPlans });
        return `export default ${JSON.stringify(index)};`;
      } catch {
        return `export default ${JSON.stringify({
          issues: [],
          byState: {
            backlog: [],
            "in-progress": [],
            "in-review": [],
            done: [],
          },
          diagnostics: [],
          loadError: "No se pudieron leer las fuentes Markdown.",
        })};`;
      }
    },
    configureServer(server) {
      server.watcher.add([appsRoot, issuesRoot, plansRoot]);

      const handleChange = (file: string) => {
        const normalizedFile = file.split(path.sep).join("/");
        const relativeAppPath = path
          .relative(appsRoot, file)
          .split(path.sep)
          .join("/");
        const relativePlanPath = path
          .relative(plansRoot, file)
          .split(path.sep)
          .join("/");

        if (
          watchesIssue(issuesRoot, file) ||
          /^[^/]+\/package\.json$/.test(relativeAppPath) ||
          PLAN_FILE.test(path.basename(normalizedFile)) &&
            !relativePlanPath.startsWith("../")
        ) {
          refreshIssues(server);
        }
      };

      server.watcher.on("add", handleChange);
      server.watcher.on("change", handleChange);
      server.watcher.on("unlink", handleChange);
      server.httpServer?.once("close", () => {
        server.watcher.off("add", handleChange);
        server.watcher.off("change", handleChange);
        server.watcher.off("unlink", handleChange);
      });
    },
  };
}
