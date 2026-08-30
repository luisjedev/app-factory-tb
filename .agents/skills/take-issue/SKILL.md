---
name: take-issue
description: Selecciona o reanuda una issue del gestor local, crea su rama y ejecuta implementación, pruebas y revisión. Úsala cuando el usuario invoque /take-issue.
disable-model-invocation: true
---

# Take Issue

Lee primero [`../references/issue-tracker-contract.md`](../references/issue-tracker-contract.md).

## 1. Resolver la issue

- Con argumento, busca coincidencia exacta por ID y después inequívoca por título o slug.
- Sin argumento, considera solo backlog no bloqueado; ordena por prioridad (`high`, `medium`, `low`) y luego por ID ascendente.
- Si una issue pedida está bloqueada, detente y enumera sus bloqueadores no completados.
- Si está en `done`, no hagas cambios. Si está en `in-review`, indica que corresponde `close-issue`.
- Si está en `in-progress`, localiza la rama coincidente y ofrece reanudarla. No crees una segunda rama.
- Antes de tratar una issue de backlog como nueva, comprueba si ya existe una rama local o remota con su ID; si existe, detente y ofrece reanudar para evitar duplicados.

Lee la issue completa y, si declara `sourcePlan`, lee también ese plan. Resume al usuario problema, entrega, aceptación, bloqueos y alcance.

## 2. Preparar Git

Para trabajo nuevo:

1. Verifica que la rama actual sea `main` y que el árbol esté limpio. No ocultes, sobrescribas ni guardes cambios ajenos.
2. Verifica que la issue siga disponible en la vista actual de `main`.
3. Crea `fix/ISS-XXXX-slug` para fixes o `feat/ISS-XXXX-slug` para features y chores.
4. Mueve el Markdown de `backlog` a `in-progress` sin cambiar su nombre.

Para reanudación, exige árbol limpio y rama coincidente antes de continuar.

## 3. Implementar

1. Carga y sigue `../implement/SKILL.md`, usando la issue como especificación y el plan fuente solo como contexto adicional.
2. Carga `../tdd/SKILL.md` donde sea viable. Usa los seams ya acordados; si no existen, acuerda los seams antes de escribir pruebas.
3. Carga otras skills locales que coincidan con la tecnología afectada.
4. Usa `../improve-codebase-architecture/SKILL.md` únicamente si la issue contiene una decisión o cambio arquitectónico real.
5. Ejecuta comprobaciones enfocadas durante el trabajo y las comprobaciones completas aplicables al final.

Ante un fallo o interrupción, conserva `in-progress`, no hagas rollback destructivo y explica cómo reanudar.

## 4. Revisar y entregar

1. Carga y sigue `../code-review/SKILL.md` con `main` como punto fijo y la issue como especificación.
2. Corrige hallazgos bloqueantes y repite las comprobaciones necesarias.
3. Cuando implementación, pruebas y revisión sean satisfactorias, mueve la issue de `in-progress` a `in-review`.
4. Crea commits locales cohesionados. No hagas push todavía.
5. Resume archivos, comportamiento, decisiones y verificaciones.
6. Pregunta: **¿Quieres subir los cambios?**
   - Si no: deja la rama local y la issue en `in-review`.
   - Si sí: carga y sigue `../close-issue/SKILL.md`; la confirmación ya dada autoriza el push de esa rama.

No crees PR, no hagas merge y no elimines ramas.
