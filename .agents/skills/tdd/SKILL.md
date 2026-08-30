---
name: tdd
description: Desarrollo dirigido por pruebas para features y fixes mediante ciclos red-green en seams públicos acordados.
---

# Test-Driven Development

TDD es el ciclo red → green. Lee [tests.md](tests.md) para ejemplos y [mocking.md](mocking.md) para las reglas de mocking.

Si existe `CONTEXT.md`, usa su vocabulario. Respeta los ADRs del área afectada.

## Qué probar

Prueba comportamiento observable a través de interfaces públicas, no detalles de implementación. Una prueba debe leerse como especificación y sobrevivir a refactors internos.

## Seams

Un **seam** es la interfaz pública donde se observa el comportamiento. Prueba solo seams acordados antes de escribir la primera prueba. Si la issue no los declara, pregunta: “¿Cuál es la interfaz pública y qué seams debemos probar?”.

No intentes probarlo todo. Prioriza caminos críticos y lógica compleja en el seam más alto posible.

## Antipatrones

- **Acoplada a implementación**: mockea colaboradores internos, prueba privados o observa por una vía lateral.
- **Tautológica**: recalcula el esperado con la misma lógica que la implementación.
- **Slice horizontal**: escribe todas las pruebas y después toda la implementación.

## Reglas del ciclo

- **Red antes de green**: escribe una prueba que falle por el comportamiento ausente.
- **Un slice cada vez**: un seam, una prueba y la implementación mínima.
- **Tracer bullets verticales**: cada ciclo entrega comportamiento observable completo.
- **Sin anticipación**: no implementes casos futuros antes de su prueba.
- El refactor no forma parte del ciclo red-green; evalúalo en la revisión posterior.
