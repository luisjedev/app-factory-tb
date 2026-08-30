# Contrato del gestor local de tareas

Este documento es la fuente compartida para las skills del flujo de issues. Resuelve todas las rutas desde la raíz del repositorio.

## Artefactos

- Issues: `apps/issues-tracker/issues/<estado>/`.
- Estados: `backlog`, `in-progress`, `in-review`, `done`.
- Planes: `apps/issues-tracker/plans/`.
- El directorio de una issue es su único estado canónico. No escribas `status` en el frontmatter.
- Los planes no tienen estado, no aparecen en el tablero y no crean issues por sí solos.

## Identidad y nombres

- Issues: IDs secuenciales `ISS-0001` y archivos `ISS-0001--slug.md`.
- Planes: IDs secuenciales independientes `PLAN-0001` y archivos `PLAN-0001--slug.md`.
- Para asignar un ID, escanea todos los directorios de estado o todos los planes, toma el máximo válido y suma uno. Nunca reutilices huecos.
- El slug usa minúsculas ASCII y guiones; conserva el título humano en el frontmatter.

## Esquema de issue

```yaml
---
id: ISS-0001
title: Título breve
kind: simple-task # simple-task | plan-slice
type: feature # feature | fix | chore
priority: medium # high | medium | low
scope: general # general | app
app: client-demo # obligatorio solo cuando scope es app
createdAt: YYYY-MM-DD
sourcePlan: PLAN-0001 # opcional; solo para plan-slice
blockedBy: # siempre presente; lista vacía si no hay bloqueos
  - ISS-0000
---
```

El cuerpo de una issue contiene:

1. `## Contexto y problema`
2. `## Resultado esperado`
3. `## Requisitos funcionales`
4. `## Criterios de aceptación`
5. `## Decisiones técnicas`
6. `## Estrategia de pruebas`
7. `## Fuera de alcance`
8. `## Notas y dependencias`

Los criterios de aceptación deben ser observables y comprobables. No inventes apps: descubre los paquetes bajo `apps/` leyendo sus `package.json`.

## Esquema de plan

```yaml
---
id: PLAN-0001
title: Título del plan
createdAt: YYYY-MM-DD
---
```

El cuerpo contiene:

1. `## Problem Statement`
2. `## Solution`
3. `## User Stories`
4. `## Implementation Decisions`
5. `## Testing Decisions`
6. `## Out of Scope`
7. `## Further Notes`

Un plan puede producir cero, una o muchas issues únicamente mediante `to-issues`.

## Disponibilidad y transiciones

- Una issue está disponible si está en `backlog` y todas las IDs de `blockedBy` están en `done` en la vista actual de `main`.
- Orden automático: `high`, `medium`, `low`; dentro de la misma prioridad, ID ascendente.
- `new-issue` o `to-issues`: crea en `backlog`.
- `take-issue`: `backlog` → `in-progress`.
- Implementación y revisión satisfactorias: `in-progress` → `in-review`.
- `close-issue` publica la rama y fusiona su PR mientras la issue permanece en `in-review`.
- Solo después de confirmar el código en `origin/main`, `close-issue` realiza en `main` la transición `in-review` → `done` mediante un commit directo y lo sube sin force.
- Mueve el mismo archivo; no copies ni dejes duplicados entre estados.

## Git

- Trabajo nuevo: solo desde `main`, con árbol limpio.
- Ramas: `fix/ISS-XXXX-slug` para `fix`; `feat/ISS-XXXX-slug` para `feature` y `chore`.
- No hagas operaciones remotas sin el consentimiento específico previsto por el flujo.
- La confirmación de `take-issue` o `close-issue` autoriza como una sola operación: push de la rama actual, creación o reutilización de una PR hacia `main`, merge remoto tras checks satisfactorios, sincronización local de `main`, borrado de la rama fusionada y commit y push directo a `main` de la transición a `done`.
- `close-issue` nunca duplica una PR, no elude protecciones y no continúa ante conflictos o checks fallidos.
- La rama de trabajo local y remota se elimina únicamente después de confirmar su PR como fusionada.
- El único commit directo permitido en `main` es el movimiento de la issue recién fusionada desde `in-review` hasta `done`; si el push es rechazado, no eludas la protección.
- No hagas force-push ni despliegues como parte de este flujo.
- La primera versión asume un único agente u operador activo y no implementa locks distribuidos.

## Integridad

Antes de escribir o mover artefactos, valida:

- ID y nombre de archivo coherentes.
- IDs únicos en todos los estados.
- Valores de enum válidos.
- `app` presente solo para alcance de app y correspondiente a una app real.
- `sourcePlan` existente cuando se declara.
- `blockedBy` sin autorreferencias, ciclos ni IDs desconocidas.
- Ninguna escritura antes de la aprobación que exija el flujo.
