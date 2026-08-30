# React + Vite

Patrón de la fábrica: `@repo/stylex-config/vite` encapsula la integración oficial de `@stylexjs/unplugin`, mantiene las capas CSS comunes y coloca StyleX antes del plugin React.

## Lista de implementación

### 1. Dependencias

En la aplicación:

- `dependencies`: `@stylexjs/stylex` y los paquetes runtime que use, como `@repo/ui`.
- `devDependencies`: `@repo/stylex-config`, `@repo/eslint-config`, `@repo/typescript-config`, `@stylexjs/unplugin`, `eslint` y `typescript`.

Usa `workspace:*` para paquetes internos y `catalog:` para StyleX, ESLint y TypeScript. No añadas Babel, PostCSS, Autoprefixer ni `@stylexjs/eslint-plugin` en esta rama:

- La app declara `@stylexjs/unplugin` porque Vite ejecuta ese compilador.
- `@repo/stylex-config` lo declara como peer opcional y lo usa como dependencia de desarrollo para comprobar sus tipos.
- `@repo/eslint-config` es quien declara y configura el plugin ESLint de StyleX.

### 2. Vite

Consume la fábrica compartida y conserva los demás plugins/opciones de la app:

```ts
import { createStylexVitePlugin } from "@repo/stylex-config/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [createStylexVitePlugin(), react()],
});
```

No importes `@stylexjs/unplugin` directamente en `vite.config.ts` ni repitas `useCSSLayers`: esa política vive en `packages/stylex-config`.

El unplugin autodetecta dependencias instaladas que usan StyleX. Cada paquete compartido debe declarar `@stylexjs/stylex` directamente para que la detección sea fiable. Si faltan estilos compartidos, confirma primero esa dependencia, los exports fuente y el CSS raíz. Solo añade cobertura manual si la API y los tipos de la versión fijada lo soportan; no trasplantes opciones de otra versión ni cambies a PostCSS.

### 3. TypeScript

Mantén el archivo raíz de referencias de Vite y extiende los presets compartidos.

`tsconfig.app.json`:

```json
{
  "extends": "@repo/typescript-config/vite.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo"
  },
  "include": ["src"]
}
```

`tsconfig.node.json`:

```json
{
  "extends": "@repo/typescript-config/node.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo"
  },
  "include": ["vite.config.ts"]
}
```

Conserva overrides específicos justificados, pero elimina opciones ya definidas por los presets. La app debe exponer como mínimo:

```json
{
  "scripts": {
    "check-types": "tsc -b"
  }
}
```

### 4. ESLint

Consume el preset Vite compartido:

```js
import { viteConfig } from "@repo/eslint-config/vite";

export default viteConfig;
```

El preset ya combina base, React, hooks, React Refresh y las reglas StyleX. Si la app necesita reglas adicionales, exporta un array con `...viteConfig` y bloques locales pequeños; no copies el preset ni vuelvas a registrar sus plugins.

### 5. Asset CSS raíz

Asegura que el entrypoint de React importe exactamente un CSS global:

```ts
import "./index.css";
```

Si se usa el sistema de diseño, el CSS puede contener únicamente:

```css
@import "@repo/ui/reset.css";
```

Si no hay reset ni otra regla global, conserva un marcador CSS válido para que Vite emita el asset. No añadas `@stylex`: esa directiva pertenece a la integración PostCSS de Next.js.

### 6. Prueba mínima

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

Si la app consume `@repo/ui`, renderiza también al menos un componente suyo para comprobar la compilación de fuentes del workspace.

### 7. Verificación

Desde la raíz:

```sh
pnpm --filter <paquete> lint
pnpm --filter <paquete> check-types
pnpm --filter <paquete> build
```

Comprueba que:

- `createStylexVitePlugin()` aparece antes de `react()`.
- El CSS raíz sigue importado.
- `dist/assets/*.css` contiene reglas de la app y de los paquetes compartidos usados.
- No aparece `@stylex` en el CSS generado.
- El servidor Vite responde en desarrollo y se detiene al finalizar la prueba.

## Diagnóstico acotado

- **Hay clases pero no CSS:** confirma el import del CSS raíz y que Vite emite un asset CSS.
- **Faltan estilos de un paquete compartido:** confirma su dependencia directa de `@stylexjs/stylex`, sus exports fuente y que realmente se usa desde la app.
- **ESLint no reconoce StyleX:** confirma que la app usa `@repo/eslint-config/vite`; no instales reglas locales como parche.
- **TypeScript duplica muchas opciones:** confirma que `tsconfig.app.json` y `tsconfig.node.json` extienden los presets compartidos.
- **Producción funciona pero HMR no:** confirma primero el orden de plugins. Consulta los módulos virtuales del unplugin solo si sigue fallando; no los añadas preventivamente.

Fuentes oficiales:

- https://stylexjs.com/docs/learn/installation/vite/vite-react
- https://stylexjs.com/docs/api/configuration/unplugin
