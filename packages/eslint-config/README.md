# `@repo/eslint-config`

Presets internos de ESLint para los workspaces de App Factory.

## Entradas públicas

- `@repo/eslint-config/base`: reglas comunes para JavaScript y TypeScript.
- `@repo/eslint-config/react-internal`: React, hooks y StyleX.
- `@repo/eslint-config/next-js`: aplicaciones Next.js.
- `@repo/eslint-config/vite`: aplicaciones React con Vite.

Cada workspace debe consumir el preset más específico y mantener localmente solo las excepciones justificadas por su runtime o configuración.
