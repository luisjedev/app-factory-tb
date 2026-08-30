---
name: to-issues
description: Descompone un plan local en issues implementables, verticales y con bloqueos explícitos. Úsala cuando el usuario invoque /to-issues para convertir posteriormente un plan aprobado en backlog.
disable-model-invocation: true
---

# To Issues

Lee primero [`../references/issue-tracker-contract.md`](../references/issue-tracker-contract.md).

## 1. Seleccionar el plan

- Acepta una ruta o `PLAN-XXXX` como argumento.
- Sin argumento, enumera los planes disponibles y pide elegir uno.
- Lee el plan completo.
- Busca issues existentes con el mismo `sourcePlan`; advierte sobre posibles duplicados antes de continuar.

## 2. Comprender el repositorio

Lee el `AGENTS.md` aplicable, el glosario de dominio y ADRs si existen. Explora las áreas afectadas. Buscar hechos en el repositorio es responsabilidad del agente, no del usuario.

## 3. Proponer tracer bullets

Divide el plan en slices verticales que:

- entreguen comportamiento completo y verificable de extremo a extremo;
- quepan en una sesión fresca de contexto;
- declaren únicamente bloqueos que realmente impidan comenzar;
- mantengan el repositorio verde al terminar cada slice.

Los refactors mecánicos amplios pueden usar una secuencia expandir–migrar–contraer cuando una división vertical no sea viable.

Para cada issue propuesta muestra:

- título;
- alcance y app opcional;
- tipo y prioridad inferidos;
- qué comportamiento entrega;
- criterios de aceptación;
- seams de prueba;
- bloqueadores por título provisional.

Pregunta si la granularidad y los bloqueos son correctos y si debe unirse o dividirse algo. Itera hasta obtener aprobación explícita.

## 4. Publicar

Solo después de la aprobación:

1. Asigna IDs secuenciales en orden de dependencias, bloqueadores primero.
2. Sustituye títulos provisionales por IDs en `blockedBy`.
3. Crea una issue por slice en `backlog`, con `kind: plan-slice` y `sourcePlan` igual al plan seleccionado.
4. Valida que no haya ciclos, bloqueadores desconocidos, IDs duplicados ni metadatos inválidos.
5. No crees una issue padre y no modifiques el plan.
6. Resume las issues creadas en orden de dependencias y señala la frontier inicial disponible.

No implementes ninguna issue durante este comando.
