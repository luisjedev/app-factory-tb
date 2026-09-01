# Dashboard

Entrada local al monorepo App Factory, implementada con Next.js y App Router.

## Responsabilidad

- Presentar el propósito y el stack principal de App Factory.
- Resumir las aplicaciones nativas del monorepo.
- Enlazar el sistema de diseño y el gestor de tareas mediante navegación normal.

## Desarrollo

Desde la raíz:

```bash
pnpm --filter dashboard dev
```

La aplicación responde en <http://localhost:3000>.

Los accesos locales esperan:

- `ui-catalog` en <http://localhost:3001>.
- `issues-tracker` en <http://localhost:3002>.

## Verificación

```bash
pnpm --filter dashboard lint
pnpm --filter dashboard check-types
pnpm --filter dashboard build
```

## Arquitectura

- Framework: Next.js con App Router.
- UI compartida: `@repo/ui`.
- Estilos: StyleX mediante `@repo/stylex-config`.
- ESLint y TypeScript: presets compartidos del workspace.

La aplicación no importa archivos internos de otras aplicaciones. Cada acceso se realiza mediante su URL local.
