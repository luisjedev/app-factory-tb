---
id: ISS-0004
title: Buscar, filtrar y consultar issues
kind: plan-slice
type: feature
priority: medium
scope: general
createdAt: 2026-08-30
sourcePlan: PLAN-0001
blockedBy:
  - ISS-0002
---

## Contexto y problema

El tablero base permite conocer el estado general, pero será difícil localizar trabajo concreto cuando aumente el número de issues. Las tarjetas resumidas tampoco permiten consultar por sí solas la especificación completa que necesitan mantenedores y agentes.

## Resultado esperado

El usuario puede buscar, combinar filtros y abrir el detalle completo de una issue mediante controles semánticos, accesibles por teclado y adaptados tanto a móvil como a escritorio.

## Requisitos funcionales

- Buscar issues por ID o título sin distinguir mayúsculas y minúsculas.
- Filtrar por aplicación, tipo y prioridad.
- Permitir que búsqueda y filtros actúen conjuntamente.
- Ofrecer una forma clara de restablecer los criterios activos.
- Actualizar columnas y contadores para reflejar el conjunto visible.
- Mostrar un estado sin coincidencias distinto del repositorio global vacío.
- Permitir abrir y cerrar el detalle completo de cada issue.
- Presentar en el detalle sus metadatos, contenido y relaciones de bloqueo disponibles.
- Mantener un orden de foco predecible al operar controles y detalle.
- Conservar la distribución apilada móvil y horizontal de escritorio.

## Criterios de aceptación

- Buscar un ID completo o un fragmento de título muestra únicamente las coincidencias esperadas.
- Los filtros de aplicación, tipo y prioridad funcionan individualmente y combinados.
- Restablecer filtros recupera el conjunto completo sin recargar la página.
- Los contadores indican el número de tarjetas actualmente visibles en cada columna.
- Una consulta sin resultados muestra un mensaje específico y no el estado vacío global.
- El detalle puede abrirse y cerrarse con teclado y expone la especificación completa en un orden comprensible.
- Los controles poseen etiquetas y nombres accesibles; la información no se comunica solo mediante color.
- El foco visible y sus transiciones son predecibles.
- Las animaciones respetan `prefers-reduced-motion`.
- Las pruebas observan roles, nombres y acciones públicas, no clases StyleX ni estructura privada.
- Pasan pruebas, lint, comprobación de tipos y build del paquete.

## Decisiones técnicas

- Mantener búsqueda y filtros como estado de presentación derivado de los datos indexados; no persistirlos en los Markdown.
- Usar `Input`, `Label`, `NativeSelect`, `Badge`, `Card` y `Button` de `@repo/ui` cuando corresponda.
- Implementar el detalle con semántica accesible acorde a una expansión de contenido; no introducir un modal si no aporta una necesidad real.
- Derivar resultados y contadores en lugar de duplicarlos como estados independientes.

## Estrategia de pruebas

- Renderizar el tablero con un conjunto pequeño que cubra varias apps, tipos, prioridades y estados.
- Interactuar mediante Testing Library usando roles, etiquetas y nombres accesibles.
- Probar búsqueda, cada filtro, combinaciones, restablecimiento, ausencia de coincidencias y detalle.
- Verificar navegación por teclado y comportamiento del foco en los recorridos críticos.
- Comprobar visualmente los puntos de ruptura móvil y escritorio sin basar las pruebas de comportamiento en clases CSS.

## Fuera de alcance

- Editar issues desde el detalle.
- Persistir búsqueda o filtros entre sesiones.
- Buscar dentro de planes o mostrar planes.
- Ordenación configurable, paginación o vistas alternativas.
- Añadir un sistema modal genérico a `@repo/ui`.

## Notas y dependencias

- Bloqueada por `ISS-0002`, que proporciona el tablero y el seam renderizado sobre el que se añaden estas interacciones.
- Puede desarrollarse en paralelo con `ISS-0003` después de integrar el tablero base.
