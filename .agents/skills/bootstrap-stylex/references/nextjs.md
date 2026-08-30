# Next.js

Patrón de la fábrica para App Router: `@repo/stylex-config/babel` configura la transformación y `@repo/stylex-config/postcss` reemplaza una única directiva `@stylex` por el CSS agregado. Las opciones comunes del compilador y las capas CSS no se definen en la app.

## Lista de implementación

### 1. Dependencias

En la aplicación:

- `dependencies`: `@stylexjs/stylex` y los paquetes runtime que use, como `@repo/ui`.
- `devDependencies`: `@repo/stylex-config`, `@repo/eslint-config`, `@repo/typescript-config`, `@stylexjs/babel-plugin`, `@stylexjs/postcss-plugin`, `autoprefixer`, `eslint` y `typescript`.

Usa `workspace:*` para paquetes internos y `catalog:` para las herramientas catalogadas. No añadas `@stylexjs/unplugin` ni `@stylexjs/eslint-plugin`:

- Babel y PostCSS son los compiladores de esta rama y siguen siendo dependencias directas de la app que los ejecuta.
- `@repo/eslint-config` declara y activa el plugin ESLint de StyleX.

### 2. Babel

Las apps de la fábrica son ESM. Consume la fábrica compartida y calcula únicamente el directorio propio:

```js
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createNextStylexBabelConfig } from "@repo/stylex-config/babel";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default createNextStylexBabelConfig({
  dev: process.env.NODE_ENV !== "production",
  rootDir,
});
```

La fábrica compartida mantiene `runtimeInjection: false`, compensación de tree shaking, merge condicional y resolución de módulos. No copies esas opciones en la app.

Añade `aliases` a la llamada solo cuando existan alias reales en TypeScript/bundler y usa rutas absolutas equivalentes. Si la app tiene otros plugins Babel, amplía el resultado de forma explícita sin sustituir la configuración StyleX.

### 3. PostCSS y cobertura

Reutiliza exactamente el objeto Babel anterior y declara de forma explícita los directorios que realmente pueden producir estilos:

```js
import { createNextStylexPostcssConfig } from "@repo/stylex-config/postcss";
import babelConfig from "./babel.config.js";

export default createNextStylexPostcssConfig({
  babelConfig,
  include: [
    "app/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
});
```

Añade `src` o `components` solo si esos directorios existen. Añade cada paquete fuente del workspace que escriba StyleX y que la app consuma. No copies parser options, plugins PostCSS, Autoprefixer ni `useCSSLayers`: `@repo/stylex-config/postcss` ya los define.

La lista explícita hace comprobable la cobertura de paquetes internos. Si faltan estilos, corrige `include` o los exports/dependencias del paquete; no dupliques componentes o tokens dentro de la app.

### 4. TypeScript

Extiende el preset Next compartido y conserva localmente solo includes, excludes y overrides específicos:

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "next-env.d.ts",
    "next.config.js",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

No repitas `strict`, el plugin Next, JSX, resolución Bundler ni `noEmit`: ya viven en los presets compartidos.

### 5. ESLint

Consume el preset Next compartido:

```js
import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    files: ["babel.config.js"],
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
    rules: {
      "turbo/no-undeclared-env-vars": "off",
    },
  },
];
```

El preset ya combina base, React, hooks, reglas Next/Core Web Vitals y StyleX. Añade únicamente bloques locales necesarios para archivos de configuración; no registres de nuevo `@stylexjs/eslint-plugin` ni copies sus reglas.

### 6. Único CSS raíz

En el CSS global importado por `app/layout.tsx`, conserva resets/imports y una sola directiva:

```css
@import "@repo/ui/reset.css";

@stylex;
```

El layout raíz debe importar ese archivo exactamente una vez:

```tsx
import "./globals.css";
```

No añadas loaders ni cambios a `next.config` para StyleX.

### 7. Prueba mínima

Los Server Components pueden usar StyleX sin `"use client"`:

```tsx
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  root: {
    minHeight: "100dvh",
  },
});

export default function Page() {
  return <main {...stylex.props(styles.root)}>…</main>;
}
```

Si la app consume `@repo/ui`, renderiza también al menos un componente o estilo suyo para validar la cobertura del workspace.

### 8. Verificación

Desde la raíz:

```sh
pnpm --filter <paquete> lint
pnpm --filter <paquete> check-types
pnpm --filter <paquete> build
```

Comprueba que:

- Next detecta el `babel.config.js` externo.
- `.next/static/**/*.css` contiene reglas de la app y de los paquetes compartidos usados.
- No queda ninguna directiva `@stylex` en el CSS generado.
- El servidor Next responde en desarrollo y se detiene al finalizar la prueba.

No asumas que el CSS de producción estará en `.next/static/css`; Next puede emitirlo en `.next/static/chunks`.

## Diagnóstico acotado

- **`@stylex` permanece en el CSS:** confirma que Next cargó `postcss.config.js`, que el CSS global se importa una vez y que el archivo usa la fábrica compartida.
- **El JS se transforma pero faltan reglas:** revisa los globs de `include` y que PostCSS reciba el mismo `babelConfig` exportado por Babel.
- **Falla `defineVars`:** confirma `rootDir`, la extensión `*.stylex.ts` y que no se sustituyó la configuración compartida de resolución.
- **Solo fallan estilos de `@repo/ui`:** añade su directorio fuente a `include` y confirma su dependencia directa de `@stylexjs/stylex`.
- **ESLint no reconoce StyleX:** confirma que se usa `@repo/eslint-config/next-js`; no añadas reglas locales como parche.
- **TypeScript repite opciones de Next:** reduce el archivo a `extends`, `include`, `exclude` y overrides realmente específicos.

Fuentes oficiales:

- https://stylexjs.com/docs/learn/installation/nextjs
- https://stylexjs.com/docs/api/configuration/postcss-plugin
