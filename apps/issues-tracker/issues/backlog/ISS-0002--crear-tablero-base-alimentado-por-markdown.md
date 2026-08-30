---
id: ISS-0002
title: Crear el tablero base alimentado por Markdown
kind: plan-slice
type: feature
priority: high
scope: general
createdAt: 2026-08-30
sourcePlan: PLAN-0001
blockedBy:
  - ISS-0001
---

## Contexto y problema

Las issues del gestor local viven como Markdown versionado, pero todavía no existe una aplicación que las indexe y presente su estado. El directorio `apps/issues-tracker` contiene únicamente el plan y no es aún un paquete ejecutable del workspace.

## Resultado esperado

Existe una aplicación independiente de React, TypeScript y Vite llamada `issues-tracker` que carga issues Markdown válidas durante desarrollo y build y las presenta en un tablero de solo lectura con los cuatro estados canónicos.

## Requisitos funcionales

- Crear el paquete Vite dentro de `apps/issues-tracker` y registrarlo mediante la configuración existente del workspace.
- Crear o conservar los directorios canónicos `backlog`, `in-progress`, `in-review` y `done` bajo `apps/issues-tracker/issues`.
- Indexar únicamente archivos de issue ubicados en los directorios de estado.
- Derivar el estado de cada issue de su ubicación física y no de un campo duplicado en el frontmatter.
- Excluir siempre los planes del índice y de la interfaz.
- Exponer a React datos normalizados durante desarrollo y build.
- Actualizar el índice visible durante desarrollo cuando cambien los Markdown.
- Mostrar siempre las columnas backlog, en progreso, en revisión y completado.
- Mostrar en cada columna el número de issues visibles.
- Mostrar en cada tarjeta ID, título, prioridad, tipo, alcance, aplicación opcional y fecha.
- Mostrar un estado vacío explícito cuando no exista ninguna issue.
- Apilar los estados en pantallas estrechas y distribuirlos horizontalmente en escritorio.

## Criterios de aceptación

- `apps/issues-tracker/package.json` declara scripts de desarrollo, pruebas, lint, tipos y build coherentes con el monorepo.
- La aplicación reutiliza `@repo/stylex-config`, `@repo/eslint-config`, `@repo/typescript-config` y los componentes de `@repo/ui`.
- El plugin compartido de StyleX aparece antes del plugin React en Vite.
- Un conjunto conocido de Markdown válidos produce issues normalizadas, ordenadas y agrupadas por su directorio.
- Las cuatro columnas aparecen incluso cuando están vacías.
- Los contadores y las tarjetas corresponden a los datos indexados.
- Ningún archivo de `plans/` aparece en el tablero.
- El estado vacío se diferencia visual y semánticamente de una carga con contenido.
- Los cambios de Markdown se reflejan durante desarrollo sin reiniciar manualmente la aplicación.
- El tablero es usable en una pantalla estrecha y permite comparar columnas en escritorio.
- Pasan las pruebas enfocadas, lint, comprobación de tipos y build del paquete.
- El CSS de producción contiene estilos de la aplicación y de `@repo/ui`, sin directivas `@stylex`.

## Decisiones técnicas

- Integrar el índice mediante Vite para que el filesystem siga siendo la única fuente de verdad tanto en desarrollo como en build.
- Mantener el seam de indexación separado de React: rutas y contenido Markdown entran; datos normalizados y agrupados salen.
- Usar Vitest para el índice y Vitest con Testing Library para comportamiento observable del tablero.
- Consumir las primitivas compartidas creadas en `ISS-0001` en lugar de crear equivalentes locales.
- Mantener CSS global únicamente para el reset y reglas de documento que no puedan expresarse con StyleX.

## Estrategia de pruebas

- Probar el índice con fixtures pequeños de issues válidas y resultados literales independientes de la implementación.
- Probar el tablero mediante roles y nombres accesibles, verificando columnas, contadores, tarjetas y estado vacío.
- Ejecutar los ciclos TDD de forma vertical: fixture, índice mínimo y representación visible correspondiente.
- Ejecutar `pnpm --filter issues-tracker lint`, `check-types`, pruebas y build.
- Arrancar el modo desarrollo, verificar una respuesta HTTP y una actualización de Markdown, y detener el servidor.
- Inspeccionar los assets CSS generados por Vite.

## Fuera de alcance

- Diagnósticos completos para Markdown inválido, que corresponden a otra issue.
- Búsqueda, filtros y detalle expandible.
- Crear, editar o mover issues desde la interfaz.
- Mostrar o administrar planes.
- Drag-and-drop y persistencia externa.

## Notas y dependencias

- Bloqueada por `ISS-0001`, porque el tablero debe construirse con las primitivas compartidas aprobadas.
- La issue tiene alcance general porque `issues-tracker` todavía no es una aplicación real con `package.json` en el momento de publicar el backlog.
