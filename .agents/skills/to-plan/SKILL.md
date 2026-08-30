---
name: to-plan
description: Convierte decisiones ya discutidas en un plan local completo sin volver a entrevistar. Úsala desde new-issue para historias amplias o al invocar /to-plan sobre la conversación actual.
disable-model-invocation: true
---

# To Plan

Lee primero [`../references/issue-tracker-contract.md`](../references/issue-tracker-contract.md).

## Propósito

Sintetiza el contexto existente en un plan. Un plan no es una issue, no tiene estado y puede contener trabajo para muchas issues futuras.

## Proceso

1. Revisa la conversación, el `AGENTS.md` aplicable, el plan de origen si existe y el código relevante ya explorado.
2. No entrevistes ni abras un nuevo grilling. Si falta información imprescindible, indica exactamente qué impide una síntesis honesta y detente sin escribir.
3. Identifica los seams de prueba ya acordados. No inventes seams que contradigan la conversación.
4. Calcula el siguiente `PLAN-XXXX` escaneando todos los planes existentes.
5. Redacta el plan con el esquema canónico:
   - Problem Statement desde la perspectiva del usuario.
   - Solution desde la perspectiva del usuario.
   - Lista larga y numerada de User Stories.
   - Implementation Decisions con las decisiones acordadas, sin convertirlas en código especulativo.
   - Testing Decisions centradas en comportamiento observable.
   - Out of Scope.
   - Further Notes.
6. Escribe un único Markdown en el directorio de planes con ID y slug coherentes.
7. Relee y valida frontmatter, secciones y ausencia de cualquier issue generada como efecto secundario.
8. Devuelve únicamente un resumen y la ruta del plan. No devuelvas datos para crear una issue.

## Ejecución independiente

Cuando se invoque `/to-plan` directamente, trabaja sobre la conversación actual. El comando presupone que las decisiones necesarias ya se han tomado.
