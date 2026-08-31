/// <reference types="vite/client" />

declare module "virtual:issues" {
  import type { Issue } from "./issues/types";

  const issues: readonly Issue[];
  export default issues;
}
