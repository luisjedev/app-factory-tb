# React + Vite

Patrón oficial: `@stylexjs/unplugin` transforma TS/JS y agrega las reglas a un asset CSS emitido por Vite.

## Lista de implementación

### 1. Dependencias

En la aplicación:

- `dependencies`: `@stylexjs/stylex`
- `devDependencies`: `@stylexjs/unplugin`, `@stylexjs/eslint-plugin`

Usa las entradas `catalog:` de la raíz. No añadas Babel ni PostCSS para esta rama.

### 2. Vite

Integra StyleX antes del plugin de React para conservar Fast Refresh:

```ts
import stylex from "@stylexjs/unplugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: {
        before: ["reset"],
        prefix: "stylex",
      },
    }),
    react(),
  ],
});
```

Si no existe una capa `reset`, usa `useCSSLayers: true` o elimina `before`; no declares una capa inexistente por inercia. Conserva las demás opciones de Vite.

El unplugin autodetecta dependencias instaladas que usan StyleX. Cada paquete compartido debe declarar `@stylexjs/stylex` directamente para que esa detección sea fiable. Si la comprobación demuestra una omisión, revisa la API y los tipos de la versión fijada antes de añadir una opción manual de cobertura; no trasplantes opciones de otra versión ni cambies esta rama a PostCSS.

### 3. Asset CSS raíz

Asegura que el entrypoint de React importe un CSS global, aunque solo contenga el reset o un marcador válido:

```ts
import "./index.css";
```

```css
/* Garantiza que Vite emita un asset donde StyleX agregará sus reglas. */
:root {
  --stylex-injection: 0;
}
```

No añadas `@stylex` en Vite: esa directiva pertenece a la integración PostCSS.

### 4. ESLint flat config

Combina, sin reemplazar las reglas existentes, el plugin y como mínimo estas reglas en los archivos TS/TSX:

```js
import stylexPlugin from "@stylexjs/eslint-plugin";

// Dentro del bloque aplicable a **/*.{ts,tsx}
plugins: {
  "@stylexjs": stylexPlugin,
},
rules: {
  "@stylexjs/valid-styles": "error",
  "@stylexjs/no-unused": "error",
  "@stylexjs/no-legacy-contextual-styles": "error",
  "@stylexjs/valid-shorthands": "warn",
},
```

Configura `languageOptions.parserOptions.tsconfigRootDir` cuando la configuración TypeScript de ESLint lo necesite. Si el repositorio ya exporta estas reglas desde un preset compartido, consume ese preset en lugar de duplicarlas.

### 5. Prueba mínima

```tsx
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  root: {
    minHeight: "100dvh",
  },
});

export function App() {
  return <main {...stylex.props(styles.root)}>…</main>;
}
```

El plugin debe aparecer antes de React, el CSS raíz debe seguir importado y el build debe generar reglas StyleX dentro de `dist/assets/*.css`.

## Diagnóstico acotado

- **Hay clases pero no CSS:** confirma el import del CSS raíz y que Vite emite el asset.
- **Faltan estilos de un paquete compartido:** confirma que ese paquete declara `@stylexjs/stylex`, que Vite recibe su código fuente y que la solución manual elegida existe en los tipos de la versión fijada.
- **Producción funciona pero HMR no:** confirma primero el orden de plugins. Consulta los módulos virtuales del unplugin únicamente si sigue fallando; no los añadas de forma preventiva.

Fuentes oficiales:

- https://stylexjs.com/docs/learn/installation/vite/vite-react
- https://stylexjs.com/docs/api/configuration/unplugin
