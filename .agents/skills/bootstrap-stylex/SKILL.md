---
name: bootstrap-stylex
description: Bootstrap o mantenimiento de StyleX en aplicaciones de la fábrica. Usa la rama React + Vite cuando package.json dependa de vite; usa la rama Next.js cuando dependa de next. Reutiliza obligatoriamente los paquetes compartidos de configuración del monorepo.
---

# Bootstrap de StyleX

Deja StyleX compilado en build time, cubierto por ESLint y comprobado tanto en desarrollo como en producción. La fábrica ya centraliza su configuración: no recrees en cada app las opciones del compilador, las capas CSS, las reglas de ESLint ni los presets TypeScript.

## 1. Inventario

Lee el `AGENTS.md` aplicable y, antes de editar una app, inspecciona:

- Su `package.json`, configuración del bundler, ESLint, TypeScript y CSS raíz.
- `pnpm-workspace.yaml` y las versiones del catálogo.
- `packages/stylex-config/package.json` y el export correspondiente al framework.
- `packages/eslint-config/package.json` y sus presets React, Next y Vite.
- `packages/typescript-config/package.json` y sus presets Next, Vite y Node.
- Cada paquete del workspace importado por la aplicación que contenga o vaya a contener StyleX.

Elige una sola rama por las dependencias de la aplicación:

- Si depende de `vite`, lee completa [`references/vite-react.md`](references/vite-react.md).
- Si depende de `next`, lee completa [`references/nextjs.md`](references/nextjs.md).
- Si no coincide con ninguna, detente e informa que esta skill no cubre ese bundler.

**Criterio de finalización:** están identificados el nombre del paquete, framework, versiones del catálogo, scripts de comprobación, CSS raíz y todos los directorios fuente que pueden crear estilos.

## 2. Baseline compartido obligatorio

Aplica la rama correspondiente sin sobrescribir configuración no relacionada y siguiendo estas reglas:

- Usa `pnpm` y declara cada dependencia en el paquete que realmente la ejecuta.
- Reutiliza entradas `catalog:`. Si falta un paquete de la familia StyleX, añádelo al catálogo con la misma versión que `@stylexjs/stylex` antes de instalar; deja que `pnpm` actualice el lockfile.
- La aplicación consume `@repo/stylex-config`, `@repo/eslint-config` y `@repo/typescript-config` mediante `workspace:*`.
- Vite consume `@repo/stylex-config/vite`; Next consume `@repo/stylex-config/babel` y `@repo/stylex-config/postcss`.
- Vite consume `@repo/eslint-config/vite`; Next consume `@repo/eslint-config/next-js`. Estos presets ya activan las reglas compartidas de StyleX: no vuelvas a importar `@stylexjs/eslint-plugin` ni copies sus reglas en la app.
- Vite extiende `@repo/typescript-config/vite.json` para código de aplicación y `@repo/typescript-config/node.json` para su configuración. Next extiende `@repo/typescript-config/nextjs.json`.
- La definición canónica de `useCSSLayers` vive en `@repo/stylex-config`. No la dupliques en archivos de aplicación.
- Si una capacidad transversal falta, corrige primero el paquete compartido adecuado y después consúmelo desde la app; no introduzcas una variante local divergente.
- Conserva CSS global solo para reset, fuentes, reglas de documento e integraciones que no puedan expresarse con StyleX.
- Añade una aplicación mínima y visible de `stylex.create` + `stylex.props` en el componente raíz o primer componente real. No migres otros estilos salvo petición expresa.

Para variables compartidas, usa un archivo `*.stylex.ts` que exporte únicamente valores creados con `stylex.defineVars` o `stylex.defineConsts`.

Un paquete compartido que escriba StyleX debe:

- Declarar `@stylexjs/stylex` directamente.
- Consumir un preset ESLint compartido que incluya las reglas StyleX, como `@repo/eslint-config/react-internal`.
- Publicar su fuente mediante exports explícitos.
- Exportar `./package.json` para que los adaptadores puedan descubrir que declara StyleX sin conocer su ubicación física.
- Estar cubierto por el compilador de cada aplicación consumidora. No necesita una integración de bundler propia salvo que se compile independientemente.

**Criterio de finalización:** dependencias coherentes, presets compartidos consumidos, compilador cubriendo todas las fuentes, un único CSS raíz y ESLint analizando StyleX sin reglas duplicadas.

## 3. Verificación

Desde la raíz, ejecuta para cada paquete afectado:

1. `pnpm --filter <paquete> lint`.
2. `pnpm --filter <paquete> check-types`.
3. `pnpm --filter <paquete> build`.

Si falta alguno de estos scripts en una app generada, añádelo siguiendo el patrón de la rama. Ejecuta también las comprobaciones globales aplicables cuando el cambio afecte paquetes compartidos.

Inspecciona el CSS generado:

- Vite: `dist/assets/**/*.css`.
- Next.js: `.next/static/**/*.css`; no asumas que Next crea un directorio `.next/static/css`.

El CSS debe contener reglas StyleX y no conservar la directiva `@stylex`. Comprueba además el modo desarrollo con una petición HTTP y detén el proceso iniciado para la prueba.

Si participa un paquete compartido, usa al menos uno de sus estilos desde la aplicación y confirma que aparece en el CSS generado. Corrige la cobertura del compilador; no dupliques el estilo dentro de la app.

**Criterio de finalización:** lint, tipos y build pasan; desarrollo responde; el CSS de la app y de sus paquetes compartidos está presente; no quedan directivas `@stylex`; no queda ningún servidor de prueba abierto.
