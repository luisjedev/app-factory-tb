import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import { indexIssueSources } from "../src/issues/index.js";
import { ISSUE_STATES, type IssueSource } from "../src/issues/types.js";

const VIRTUAL_MODULE_ID = "virtual:issues";
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;
const ISSUE_FILE = /^(backlog|in-progress|in-review|done)\/ISS-\d{4}--[a-z0-9-]+\.md$/;

async function readIssueSources(issuesRoot: string) {
  const sources: IssueSource[] = [];

  for (const state of ISSUE_STATES) {
    const stateRoot = path.join(issuesRoot, state);
    const entries = await readdir(stateRoot, { withFileTypes: true });

    for (const entry of entries.sort((left, right) =>
      left.name.localeCompare(right.name),
    )) {
      if (!entry.isFile() || !/^ISS-\d{4}--[a-z0-9-]+\.md$/.test(entry.name)) {
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
  let issuesRoot = "";

  return {
    name: "issues-markdown-index",
    enforce: "pre",
    configResolved(config) {
      issuesRoot = path.resolve(config.root, "issues");
    },
    resolveId(id) {
      return id === VIRTUAL_MODULE_ID ? RESOLVED_VIRTUAL_MODULE_ID : null;
    },
    async load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) {
        return null;
      }

      const index = indexIssueSources(await readIssueSources(issuesRoot));
      return `export default ${JSON.stringify(index.issues)};`;
    },
    configureServer(server) {
      server.watcher.add(issuesRoot);

      const handleChange = (file: string) => {
        if (watchesIssue(issuesRoot, file)) {
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
