import { createNextStylexBabelConfig } from "@repo/stylex-config/babel";

export default createNextStylexBabelConfig({
  configFileUrl: import.meta.url,
});
