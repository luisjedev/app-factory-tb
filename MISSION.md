# Mission: Dominar la pipeline de StyleX en el monorepo

## Why
Poder mantener, ampliar y diagnosticar de forma autónoma la integración de StyleX entre `packages/ui` y las aplicaciones Next.js, sin depender de copiar configuraciones sin entenderlas.

## Success looks like
- Explicar el recorrido completo desde `stylex.create()` hasta el CSS que recibe el navegador.
- Decidir correctamente en qué `package.json` debe declararse cada dependencia.
- Identificar por la forma de un error qué etapa de la pipeline está fallando.
- Replicar la integración en una nueva app del monorepo con criterio propio.

## Constraints
- Aprender en español y sobre la configuración real de este repositorio.
- Usar lecciones breves, visuales y con recuperación activa.
- Priorizar documentación oficial y ejemplos verificables.

## Out of scope
- Escribir plugins personalizados de Babel o PostCSS.
- Estudiar la implementación interna completa de Turbopack.
- Diseñar por ahora una librería `@repo/ui` publicable fuera del monorepo.
