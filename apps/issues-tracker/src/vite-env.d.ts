/// <reference types="vite/client" />

declare module "virtual:issues" {
  import type { IssueRepositoryData } from "./issues/types";

  const issueRepository: IssueRepositoryData;
  export default issueRepository;
}
