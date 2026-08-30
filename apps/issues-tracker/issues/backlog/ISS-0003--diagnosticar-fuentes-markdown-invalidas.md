---
id: ISS-0003
title: Diagnosticar fuentes Markdown inválidas
kind: plan-slice
type: feature
priority: high
scope: general
createdAt: 2026-08-30
sourcePlan: PLAN-0001
blockedBy:
  - ISS-0002
---

## Contexto y problema

El tablero depende de archivos editables por personas y agentes. Un frontmatter incorrecto, una identidad duplicada o una relación de bloqueo inválida no debe producir datos ambiguos, una pantalla en blanco ni un fallo silencioso difícil de corregir.

## Resultado esperado

El índice valida toda información externa antes de entregarla a React, conserva separadamente las issues válidas y devuelve diagnósticos accionables que la interfaz representa de manera distinta a los estados vacío y satisfactorio.

## Requisitos funcionales

- Validar el esquema completo del frontmatter de cada issue.
- Comprobar la coherencia entre ID, nombre del archivo y ubicación canónica.
- Detectar IDs duplicados en cualquier estado.
- Comprobar que una app declarada corresponde a una aplicación real del workspace.
- Comprobar que `sourcePlan`, cuando exista, referencia un plan real.
- Detectar bloqueadores desconocidos, autorreferencias y ciclos.
- Identificar el archivo y la causa concreta en cada diagnóstico.
- Entregar issues válidas y diagnósticos como partes explícitas del resultado del índice.
- Mostrar en la interfaz una representación útil de los diagnósticos.
- Diferenciar claramente fuente inválida, error de carga, repositorio vacío y carga satisfactoria.

## Criterios de aceptación

- Un metadato ausente, un enum desconocido o una combinación inválida de `scope` y `app` produce un diagnóstico específico.
- IDs duplicados, discrepancias entre ID y filename, planes inexistentes y bloqueadores desconocidos se detectan con fixtures independientes.
- Las autorreferencias y ciclos de bloqueo no se aceptan como índices válidos.
- Cada diagnóstico permite localizar el archivo afectado sin exponer una traza interna innecesaria.
- Una issue inválida no provoca que el tablero falle silenciosamente.
- Las issues válidas permanecen disponibles en el resultado aunque existan diagnósticos en otros archivos, siempre que la interfaz deje claro que la fuente está parcialmente dañada.
- El estado de error es semánticamente distinguible del estado vacío.
- Pasan pruebas, lint, comprobación de tipos y build de `issues-tracker`.

## Decisiones técnicas

- Realizar validación en tiempo de ejecución en el límite del filesystem; los tipos TypeScript no sustituyen esta validación.
- Mantener un formato de diagnóstico tipado y estable para desacoplar el índice de su presentación.
- No duplicar el estado dentro del frontmatter: la ubicación física sigue siendo canónica.
- No corregir ni reescribir automáticamente archivos inválidos desde la aplicación.

## Estrategia de pruebas

- Crear fixtures mínimos para cada clase de error y comparar contra diagnósticos literales conocidos.
- Probar combinaciones de archivos para duplicados, bloqueadores y ciclos sin recalcular los resultados esperados con la lógica de producción.
- Probar la interfaz mediante roles accesibles para los estados de éxito, vacío, error y fuente parcialmente inválida.
- Ejecutar las comprobaciones completas del paquete después de las pruebas enfocadas.

## Fuera de alcance

- Editar o reparar Markdown desde el navegador.
- Cambiar el esquema canónico del contrato local.
- Validar el comportamiento conversacional de las skills.
- Añadir telemetría o enviar diagnósticos a un servicio externo.

## Notas y dependencias

- Bloqueada por `ISS-0002`, que establece el índice público y los estados base de la interfaz.
- Los mensajes deben ayudar a corregir la fuente sin filtrar rutas o detalles irrelevantes fuera del repositorio.
