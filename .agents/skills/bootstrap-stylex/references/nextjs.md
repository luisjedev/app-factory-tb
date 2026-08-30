# Next.js

Patrón oficial para App Router: Babel transforma TS/JS y PostCSS reemplaza una única directiva `@stylex` por el CSS agregado. Desde Next.js 16.0.3 funciona con Webpack y Turbopack sin modificar `next.config`.

## Lista de implementación

### 1. Dependencias

En la aplicación:

- `dependencies`: `@stylexjs/stylex`
- `devDependencies`: `@stylexjs/babel-plugin`, `@stylexjs/postcss-plugin`, `@stylexjs/eslint-plugin`, `autoprefixer`

Usa las entradas `catalog:` de la raíz.

### 2. Babel

En un paquete ESM (`"type": "module"`), crea o amplía `babel.config.js`:

```js
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default {
  presets: ["next/babel"],
  plugins: [
    [
      "@stylexjs/babel-plugin",
      {
        dev: process.env.NODE_ENV !== "production",
        runtimeInjection: false,
        enableInlinedConditionalMerge: true,
        treeshakeCompensation: true,
        unstable_moduleResolution: {
          type: "commonJS",
          rootDir,
        },
      },
    ],
  ],
};
```

En CommonJS usa `require`, `module.exports` y `__dirname`; no mezcles formatos. Conserva plugins Babel preexistentes y añade `aliases` solo para alias reales del `tsconfig`, con rutas absolutas equivalentes.

`runtimeInjection: false` es obligatorio en esta integración: PostCSS es quien genera el CSS.

### 3. PostCSS y cobertura

Importa la configuración Babel para que ambas fases usen exactamente el mismo plugin. Declara globs para todos los directorios identificados en el inventario, incluidos paquetes del workspace que publican TypeScript fuente:

```js
import babelConfig from "./babel.config.js";

export default {
  plugins: {
    "@stylexjs/postcss-plugin": {
      include: [
        "app/**/*.{js,jsx,ts,tsx}",
        "src/**/*.{js,jsx,ts,tsx}",
        "components/**/*.{js,jsx,ts,tsx}",
        "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
      ],
      babelConfig: {
        babelrc: false,
        parserOpts: {
          plugins: ["typescript", "jsx"],
        },
        plugins: babelConfig.plugins,
      },
      useCSSLayers: {
        before: ["reset"],
        prefix: "stylex",
      },
    },
    autoprefixer: {},
  },
};
```

Elimina de `include` los directorios que no existan y añade los que falten; no copies la lista literalmente. Si no hay capa `reset`, usa `useCSSLayers: true` o elimina `before`. Mantén otros plugins PostCSS y su orden cuando existan.

La autodetección del plugin puede encontrar fuentes y dependencias directas si se omite `include`, pero esta fábrica prefiere una lista explícita cuando consume paquetes del workspace para que la cobertura sea comprobable.

### 4. Único CSS raíz

En el CSS global importado por `app/layout.tsx`, conserva resets/imports y añade una sola directiva:

```css
@import "@repo/ui/reset.css";

@stylex;
```

El layout raíz debe importar ese archivo exactamente una vez:

```tsx
import "./globals.css";
```

No añadas loaders ni cambios a `next.config` para StyleX.

### 5. ESLint

Combina el plugin con el preset Next existente en el bloque que analiza JS/TS:

```js
import stylexPlugin from "@stylexjs/eslint-plugin";

{
  plugins: {
    "@stylexjs": stylexPlugin,
  },
  rules: {
    "@stylexjs/valid-styles": "error",
    "@stylexjs/no-unused": "error",
    "@stylexjs/no-legacy-contextual-styles": "error",
    "@stylexjs/valid-shorthands": "warn",
  },
}
```

Si el repositorio ya exporta estas reglas desde un preset compartido, consume ese preset en lugar de duplicarlas.

### 6. Prueba mínima

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

El build debe reemplazar `@stylex` y generar reglas StyleX dentro de `.next/static/css/*.css`, incluidas las procedentes de cada paquete compartido usado.

## Diagnóstico acotado

- **`@stylex` permanece en el CSS:** confirma que Next cargó `postcss.config.js` y que el archivo global pasa por PostCSS.
- **El JS se transforma pero faltan reglas:** revisa los globs de `include` y que PostCSS reutilice `babelConfig.plugins`.
- **Falla `defineVars`:** confirma `unstable_moduleResolution`, su `rootDir` y la extensión `*.stylex.ts`.
- **Solo fallan estilos de `@repo/ui`:** añade su directorio fuente a `include`; no dupliques componentes ni tokens.

Fuentes oficiales:

- https://stylexjs.com/docs/learn/installation/nextjs
- https://stylexjs.com/docs/api/configuration/postcss-plugin
