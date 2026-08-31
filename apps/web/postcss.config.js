import { createNextStylexPostcssConfig } from "@repo/stylex-config/postcss";

export default createNextStylexPostcssConfig({
  configFileUrl: import.meta.url,
});
