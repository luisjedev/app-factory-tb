# Mission: Evaluar y dominar StyleX en el monorepo

## Why
Decidir con evidencia si StyleX puede sostener el sistema visual compartido entre `packages/ui` y aplicaciones React construidas con Next.js o Vite, y poder mantener esa integración sin copiar configuraciones sin entenderlas.

## Success looks like
- Explicar el recorrido completo desde `stylex.create()` hasta el CSS que recibe el navegador.
- Elegir el adaptador de StyleX apropiado para Next.js, Vite y otros builds.
- Decidir correctamente en qué `package.json` debe declararse cada dependencia.
- Identificar por la forma de un error qué etapa de la pipeline está fallando.
- Añadir una app consumidora y validar su compatibilidad con UI, tokens y temas.
- Estimar el coste de mantenimiento antes de adoptar una nueva tecnología.

## Constraints
- Aprender en español y sobre la configuración real de este repositorio.
- Usar lecciones breves, visuales y con recuperación activa.
- Priorizar documentación oficial y ejemplos verificables.

## Out of scope
- Escribir plugins personalizados de Babel o PostCSS.
- Estudiar la implementación interna completa de Turbopack.
- Diseñar por ahora una librería `@repo/ui` publicable fuera del monorepo.
- Garantizar compatibilidad con frameworks no React sin una prueba específica.
