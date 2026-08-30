---
name: new-issue
description: Crea una tarea sencilla en el backlog o prepara un plan completo mediante grilling. Úsala cuando el usuario invoque /new-issue o quiera registrar trabajo nuevo en el gestor local.
disable-model-invocation: true
---

# New Issue

Lee primero [`../references/issue-tracker-contract.md`](../references/issue-tracker-contract.md) y cumple ese contrato.

## Flujo

1. Pregunta si el trabajo es:
   - **Tarea sencilla**: una unidad implementable que se convertirá en issue.
   - **Historia de usuario completa**: una iniciativa amplia que se convertirá únicamente en plan.
2. Pide al usuario que describa la necesidad.
3. Carga y sigue `../grilling/SKILL.md`. No avances hasta vaciar el árbol de decisiones y obtener confirmación de entendimiento compartido.

### Tarea sencilla

4. Pregunta si el alcance es general o de una app concreta. Para una app, descubre y muestra las apps reales del workspace.
5. Infiere `type` y `priority`; no obligues al usuario a clasificarlas manualmente.
6. Sintetiza el Markdown completo según el contrato, incluyendo seams de prueba acordados.
7. Muestra título, alcance, app opcional, tipo, prioridad y especificación. Pide una confirmación única antes de escribir.
8. Tras la aprobación, calcula el siguiente ID de issue y crea exactamente un archivo en `backlog` con `kind: simple-task` y `blockedBy: []`.
9. Valida el artefacto y comunica ID y ruta.

### Historia de usuario completa

4. No crees una issue, ni reserves un ID de issue, ni escribas en ningún directorio de estado.
5. Carga y sigue `../to-plan/SKILL.md` usando toda la conversación ya acordada. `to-plan` no debe volver a entrevistar.
6. Comunica el ID y ruta del plan creado.

## Límites

- No escribas borradores antes de la confirmación final.
- No conviertas automáticamente un plan en issues.
- No inicies implementación ni operaciones Git.
