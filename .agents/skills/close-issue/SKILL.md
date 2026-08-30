---
name: close-issue
description: Publica una issue en revisión, fusiona su PR en main, elimina su rama y solo entonces marca la issue como completada en main. Úsala tras la confirmación de publicación de take-issue o al invocar /close-issue directamente.
compatibility: Requiere git, GitHub CLI (gh) autenticada y un remoto origin alojado en GitHub.
disable-model-invocation: true
---

# Close Issue

Lee primero [`../references/issue-tracker-contract.md`](../references/issue-tracker-contract.md).

## Identificación

- Acepta ID o nombre. Sin argumento, extrae una única ID `ISS-XXXX` de la rama actual.
- Para un cierre nuevo, exige una rama distinta de `main` que contenga el ID y una issue en `in-review`.
- Antes de reanudar, actualiza `origin/main` y consulta en todos los estados la PR de la rama sin escribir en el remoto.
- Permite reanudar en la rama coincidente mientras su PR no esté fusionada o cuando el merge ya ocurrió pero todavía falta cambiar a `main` y eliminar la rama. Omite siempre los pasos remotos ya completados para no recrear una rama borrada.
- Permite reanudar desde `main` únicamente con un ID explícito cuando la PR de código ya está fusionada y falta mover la issue de `in-review` a `done`, subir el commit de cierre o verificarlo en `origin/main`.
- Si la issue ya está en `done` en `origin/main` y la rama de trabajo ya no existe local ni remotamente, informa que el cierre terminó y no repitas operaciones.
- Rechaza otros estados, coincidencias ambiguas y árboles con cambios ajenos a la issue.

## Cierre

1. Lee la issue y determina los paquetes afectados.
2. Ejecuta sus pruebas y las comprobaciones aplicables de lint, tipos y build. No continúes si alguna falla.
3. Confirma que la revisión final no tenga hallazgos bloqueantes pendientes.
4. Si se invoca directamente, pregunta: **¿Quieres publicar la rama, fusionar su PR en `main`, eliminar la rama y marcar la issue como `done` en `main`?** Esta confirmación autoriza el push de la rama, la creación o reutilización de la PR, el merge remoto, el borrado de la rama local y remota, y el commit y push directo a `main` que mueve la issue a `done`. Si `take-issue` acaba de recibir esa confirmación para la misma issue, no repitas la pregunta.
5. Conserva el nombre de la rama de trabajo antes de cambiar a `main`. No muevas todavía la issue a `done` y no incluyas esa transición en la PR de código.
6. Ejecuta `git push -u origin <rama-trabajo>`.
7. Con GitHub CLI, busca en todos los estados una PR para la misma rama y base `main`. Si está abierta, reutilízala; si ya está fusionada, verifica su commit en `origin/main` y omite los pasos remotos completados; si está cerrada sin merge, detente e informa; y solo si no existe crea una PR con título, resumen y verificaciones reales. Nunca crees una segunda PR para la misma rama.
8. Para una PR abierta, espera a que GitHub determine el estado de merge y finalicen los checks requeridos. No continúes si hay conflictos, checks fallidos o protecciones pendientes, y no eludas protecciones de rama.
9. Fusiona la PR abierta automáticamente en `main` con merge commit mediante `gh pr merge --merge`. Confirma que GitHub devuelve estado `MERGED`. Si el repositorio no permite ese método, detente e informa; no elijas silenciosamente otra estrategia.
10. Ejecuta `git fetch origin main`, verifica que `origin/main` contiene el commit de merge, cambia a `main` y actualízala exclusivamente mediante `git merge --ff-only origin/main`.
11. Solo después del merge confirmado, elimina la rama remota con `git push origin --delete <rama-trabajo>` y después la local con `git branch -d <rama-trabajo>`. Si alguna ya no existe, trátalo como un paso completado. Nunca elimines una rama cuya PR no esté fusionada.
12. Verifica que la issue integrada siga en `in-review`, mueve el mismo Markdown a `done` y crea en `main` un commit que contenga únicamente esa transición.
13. Ejecuta `git push origin main` sin force. Si una protección rechaza el push directo, conserva el commit local en `main`, detente e informa; no eludas la protección ni muevas la transición a una rama alternativa.
14. Actualiza `origin/main` y confirma que contiene el commit de cierre, que la issue está en `done` y que la rama de trabajo no existe local ni remotamente.
15. Informa URL de la PR, commit de merge, commit de cierre, ramas eliminadas, verificaciones y sincronización final de `main`.

Ante una interrupción, continúa desde el primer paso pendiente sin duplicar PRs, merges ni commits. Antes del merge, la issue debe permanecer en `in-review`. Si el código ya fue fusionado pero el commit directo de cierre sigue pendiente, reanuda desde `main` con el ID explícito. No reescribas historia ni hagas rollback destructivo.

## Límites

No hagas force-push, no eludas protecciones y no despliegues. El único commit directo permitido en `main` es la transición exacta de la issue fusionada de `in-review` a `done`. Elimina únicamente la rama de trabajo cuya PR esté confirmada como fusionada y no marques otras issues como completadas.
