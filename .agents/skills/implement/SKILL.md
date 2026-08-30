---
name: implement
description: Implementa trabajo definido por una issue o plan local siguiendo los estándares del monorepo, TDD acordado, verificaciones y revisión final.
disable-model-invocation: true
---

# Implement

Implementa únicamente el alcance descrito por la especificación recibida.

## Proceso

1. Lee la issue completa, su plan fuente si existe, los `AGENTS.md` aplicables y las skills que coincidan con la tecnología afectada.
2. Comprueba el estado del repositorio y conserva cambios del usuario no relacionados.
3. Identifica el slice mínimo que satisface los criterios de aceptación.
4. Usa [`../tdd/SKILL.md`](../tdd/SKILL.md) donde sea viable y solo en seams previamente acordados.
5. Trabaja en slices verticales: prueba roja, implementación mínima, siguiente comportamiento.
6. Ejecuta comprobación de tipos y pruebas enfocadas regularmente.
7. Ejecuta al final lint, tipos, pruebas y build en el alcance afectado.
8. Usa [`../code-review/SKILL.md`](../code-review/SKILL.md) para revisar estándares y especificación; corrige hallazgos bloqueantes.
9. Crea commits locales cohesionados cuando el flujo invocante lo requiera. Nunca hagas push por tu cuenta.

No amplíes alcance, no debilites reglas ni pruebas y no afirmes que una comprobación pasó si no se ejecutó correctamente.
