# App Factory

Monorepo basado en Turborepo para crear y evolucionar aplicaciones con una base común de TypeScript, React, StyleX, calidad y accesibilidad.

## Aplicaciones

- [`apps/dashboard`](apps/dashboard): entrada local a App Factory y punto de acceso a sus aplicaciones nativas.
- [`apps/ui-catalog`](apps/ui-catalog): catálogo visual de la interfaz pública de `@repo/ui`, disponible en el puerto `3001`.
- [`apps/issues-tracker`](apps/issues-tracker): tablero de consulta para las issues y planes Markdown, disponible en el puerto `3002`.

Cada aplicación ejecutable debe poder desarrollarse, comprobarse, compilarse y desplegarse de forma independiente.

## Paquetes compartidos

- [`@repo/ui`](packages/ui): componentes, tokens, temas y reset visual compartidos.
- [`@repo/stylex-config`](packages/stylex-config): adaptadores de compilación StyleX para Next.js y Vite.
- [`@repo/eslint-config`](packages/eslint-config): presets comunes de ESLint.
- [`@repo/typescript-config`](packages/typescript-config): presets estrictos de TypeScript.

Las aplicaciones consumen únicamente las interfaces públicas de estos paquetes. No deben importar archivos internos de otra aplicación.

## Requisitos

- Node.js `>=24.11.0 <25` (consulta [`.nvmrc`](.nvmrc)).
- pnpm `11.24.0`.

```bash
pnpm install
```

El repositorio usa exclusivamente pnpm.

## Desarrollo

Desde la raíz:

```bash
pnpm dev
```

Para trabajar en una sola aplicación:

```bash
pnpm --filter dashboard dev
pnpm --filter ui-catalog dev
pnpm --filter issues-tracker dev
```

## Verificación

```bash
pnpm lint
pnpm check-types
pnpm build
```

Turbo ejecuta cada tarea únicamente en los workspaces que la declaran y respeta sus dependencias internas.

## StyleX

La configuración común vive en `@repo/stylex-config`:

- Next.js consume los adaptadores `babel` y `postcss`.
- Vite consume el adaptador `vite`.
- PostCSS descubre automáticamente el código de la aplicación y sus dependencias directas que publican fuente StyleX.
- Los paquetes compartidos que escriben StyleX deben declarar `@stylexjs/stylex` y publicar su `package.json` para permitir ese descubrimiento.

Las aplicaciones no deben duplicar opciones del compilador, capas CSS ni rutas físicas internas de paquetes compartidos.

## Gestión local del trabajo

La fuente de verdad está versionada dentro de `apps/issues-tracker`:

- `issues/backlog`
- `issues/in-progress`
- `issues/in-review`
- `issues/done`
- `plans`

Las skills locales de `.agents/skills` gobiernan la creación, implementación, revisión y cierre de trabajo.
