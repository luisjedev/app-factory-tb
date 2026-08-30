import path from "node:path";
import { fileURLToPath } from "node:url";
import { createNextStylexBabelConfig } from "@repo/stylex-config/babel";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default createNextStylexBabelConfig({
  dev: process.env.NODE_ENV !== "production",
  rootDir,
});
