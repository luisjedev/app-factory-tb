---
name: code-review
description: "Revisa un diff desde un punto fijo en dos ejes separados: estándares del repositorio y cumplimiento de la issue o plan local."
---

# Code Review

Revisa el diff entre `HEAD` y un punto fijo sin depender de trackers externos ni subagentes.

## 1. Fijar comparación

- Usa el punto indicado por el flujo; para `take-issue`, usa `main`.
- Verifica que resuelva con Git.
- Captura una vez `git diff <punto>...HEAD` y `git log <punto>..HEAD --oneline`.
- Si el diff está vacío o el ref no existe, detente con un diagnóstico claro.

## 2. Localizar especificación y estándares

- Usa la issue suministrada como especificación. Si declara `sourcePlan`, úsalo como contexto, pero no amplíes el alcance de la issue.
- Si no se suministra, busca el ID de la rama en todos los estados. Si sigue sin aparecer, pregunta por la especificación.
- Lee los `AGENTS.md`, `CONTRIBUTING.md`, ADRs y demás estándares aplicables a los archivos modificados.

## 3. Eje Standards

Revisa cada hunk contra los estándares documentados. Además, aplica como heurísticas —no violaciones automáticas— estos olores:

- **Mysterious Name**: el nombre no revela propósito.
- **Duplicated Code**: se repite la misma forma lógica.
- **Feature Envy**: un módulo manipula principalmente datos ajenos.
- **Data Clumps**: los mismos campos viajan siempre juntos.
- **Primitive Obsession**: un primitivo representa un concepto de dominio.
- **Repeated Switches**: se repite la misma bifurcación de tipo.
- **Shotgun Surgery**: un cambio lógico exige ediciones dispersas.
- **Divergent Change**: un módulo cambia por razones no relacionadas.
- **Speculative Generality**: existe abstracción sin necesidad presente.
- **Message Chains**: el llamador navega una cadena que debería ocultarse.
- **Middle Man**: un módulo casi solo delega.
- **Refused Bequest**: una implementación ignora gran parte del contrato heredado.

Los estándares del repositorio prevalecen. Omite cuestiones ya impuestas mecánicamente por tooling. Cita archivo, hunk y regla para cada hallazgo; distingue violación de juicio heurístico.

## 4. Eje Spec

En una pasada separada, compara el mismo diff con la issue:

- requisitos ausentes o parciales;
- comportamiento no solicitado;
- requisitos aparentemente implementados de forma incorrecta;
- criterios de aceptación sin evidencia verificable.

Cita el requisito correspondiente. No mezcles calidad interna con cumplimiento funcional.

## 5. Resultado

Presenta `## Standards` y `## Spec` por separado. Ordena dentro de cada eje por severidad, indica bloqueantes y termina con el total de hallazgos por eje. No ocultes un eje porque el otro pase.
