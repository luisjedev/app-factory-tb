# `@repo/stylex-config`

Adaptadores compartidos para compilar StyleX en las aplicaciones de App Factory.

## Next.js

```js
// babel.config.js
import { createNextStylexBabelConfig } from "@repo/stylex-config/babel";

export default createNextStylexBabelConfig({
  configFileUrl: import.meta.url,
});
```

```js
// postcss.config.js
import { createNextStylexPostcssConfig } from "@repo/stylex-config/postcss";

export default createNextStylexPostcssConfig({
  configFileUrl: import.meta.url,
});
```

El adaptador deriva el directorio y el modo de compilación. PostCSS descubre automáticamente las fuentes de la aplicación y las dependencias directas que declaran StyleX, por lo que la app no mantiene globs con rutas internas del workspace.

## Vite

```ts
import { createStylexVitePlugin } from "@repo/stylex-config/vite";

export default {
  plugins: [createStylexVitePlugin()],
};
```

Las capas CSS y las opciones comunes del compilador pertenecen a este paquete y no deben duplicarse en consumidores.
