---
name: close-issue
description: Verifica, marca como completada y sube una issue que está en revisión. Úsala tras la confirmación de push de take-issue o al invocar /close-issue directamente.
disable-model-invocation: true
---

# Close Issue

Lee primero [`../references/issue-tracker-contract.md`](../references/issue-tracker-contract.md).

## Identificación

- Acepta ID o nombre. Sin argumento, extrae una única ID `ISS-XXXX` de la rama actual.
- Exige que la issue exista en `in-review` y que la rama actual contenga su ID.
- Rechaza `main`, estados distintos de `in-review`, coincidencias ambiguas y árboles con cambios ajenos a la issue.

## Cierre

1. Lee la issue y determina los paquetes afectados.
2. Ejecuta sus pruebas y las comprobaciones aplicables de lint, tipos y build. No cierres si alguna falla.
3. Confirma que la revisión final no tenga hallazgos bloqueantes pendientes.
4. Si se invoca directamente, pide confirmación explícita antes de cualquier push. Si `take-issue` acaba de recibir un “sí” para subir esta misma rama, no repitas la pregunta.
5. Mueve el Markdown de `in-review` a `done`.
6. Crea un commit final de cierre si el movimiento no está ya incluido en un commit adecuado.
7. Ejecuta `git push -u origin <rama-actual>`.
8. Informa rama, commit, verificaciones y resultado del push.

Si el push falla, conserva el commit y estado local, no reescribas historia ni reviertas de forma destructiva, y explica cómo reintentarlo.

## Límites

No crees PR, no hagas merge, no cambies `main`, no elimines ramas y no marques otras issues como completadas.
