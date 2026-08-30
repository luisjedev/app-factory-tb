---
id: PLAN-0001
title: Gestor de tareas interno del monorepo
createdAt: 2026-04-07
---

# Gestor de tareas interno del monorepo

## Problem Statement

El monorepo no dispone de una fuente de verdad local, versionada y orientada al trabajo con agentes para registrar tareas, preparar planes extensos, visualizar el estado del trabajo y ejecutar un flujo Git consistente. Las tareas y sus especificaciones pueden quedar dispersas en conversaciones, mientras que los agentes carecen de un procedimiento común para crear, seleccionar, implementar, revisar y cerrar trabajo.

También es necesario distinguir dos conceptos que tienen ciclos de vida diferentes:

- Una **issue** es una unidad de trabajo implementable que participa en el tablero y transita entre estados.
- Un **plan** describe una iniciativa o historia de usuario amplia, puede originar muchas issues y no tiene estado propio ni aparece en el tablero.

## Solution

Crear una aplicación interna de React, TypeScript y Vite que represente, en modo de solo lectura, las issues almacenadas como Markdown dentro del repositorio. El tablero tendrá cuatro estados: backlog, en progreso, en revisión y completado. Los directorios de estado serán la fuente canónica del estado de cada issue.

Complementar la aplicación con skills locales y alias de comandos que gobiernen el ciclo de vida completo:

- Crear una tarea sencilla o preparar un plan mediante un proceso de grilling.
- Sintetizar historias amplias como planes independientes.
- Descomponer un plan aprobado en issues verticales y explícitamente bloqueadas.
- Seleccionar la siguiente issue disponible, crear su rama e implementar el trabajo.
- Aplicar TDD en seams acordados y revisar el resultado contra estándares y especificación.
- Cerrar, publicar e integrar una issue en `main` únicamente después de confirmación expresa del usuario.

Todos los artefactos serán locales, legibles, versionables y portables con el repositorio.

## User Stories

1. Como mantenedor del monorepo, quiero consultar un tablero con las issues agrupadas por estado, para conocer rápidamente la situación del trabajo.
2. Como mantenedor, quiero que los Markdown versionados sean la única fuente de verdad, para revisar su historial mediante Git.
3. Como usuario del tablero, quiero ver siempre las columnas backlog, en progreso, en revisión y completado, incluso cuando estén vacías.
4. Como usuario del tablero, quiero ver el número de issues de cada estado, para evaluar la carga de trabajo.
5. Como usuario del tablero, quiero ver en cada tarjeta el ID, título, prioridad, tipo, alcance y fecha, para identificar la tarea sin abrirla.
6. Como usuario del tablero, quiero buscar por ID o título, para localizar una issue rápidamente.
7. Como usuario del tablero, quiero filtrar por aplicación, tipo y prioridad, para reducir el conjunto visible.
8. Como usuario del tablero, quiero abrir el detalle completo de una issue, para consultar su especificación.
9. Como usuario móvil, quiero que los estados se presenten de forma apilada, para usar el tablero en una pantalla estrecha.
10. Como usuario de escritorio, quiero ver las columnas en una distribución horizontal, para comparar estados.
11. Como usuario de teclado o tecnología de asistencia, quiero controles semánticos y un foco predecible, para operar el tablero de forma accesible.
12. Como usuario, quiero recibir un estado vacío claro cuando no existan issues, para distinguirlo de un error de carga.
13. Como usuario, quiero recibir diagnósticos útiles cuando un Markdown sea inválido, para poder corregir la fuente sin fallos silenciosos.
14. Como autor de trabajo, quiero iniciar `/new-issue` y elegir entre una tarea sencilla y una historia de usuario completa, para aplicar el nivel de especificación adecuado.
15. Como autor de una tarea sencilla, quiero indicar si afecta a una aplicación concreta o al monorepo en general, para clasificar correctamente su alcance.
16. Como autor de una tarea para una aplicación, quiero elegir entre las aplicaciones descubiertas en el workspace, para evitar nombres inventados o desactualizados.
17. Como autor, quiero describir la necesidad con lenguaje natural antes del grilling, para partir del problema real.
18. Como autor, quiero que el agente infiera tipo y prioridad y me pida confirmación, para reducir preguntas mecánicas sin perder control.
19. Como autor, quiero que el agente recorra todo el árbol de decisiones mediante grilling, para evitar requisitos implícitos.
20. Como autor de una tarea sencilla, quiero revisar la especificación final antes de guardarla en backlog, para no crear issues incompletas.
21. Como autor de una historia amplia, quiero que el resultado del grilling se convierta en un plan y no en una issue, para no confundir planificación con trabajo implementable.
22. Como autor de un plan, quiero que este tenga un identificador independiente, para referenciarlo sin ocupar IDs de issues.
23. Como autor, quiero invocar `/to-plan` sobre la conversación actual sin repetir la entrevista, para sintetizar decisiones ya acordadas.
24. Como responsable de planificación, quiero invocar `/to-issues` con un plan, para descomponerlo posteriormente cuando decida que está preparado.
25. Como responsable de planificación, quiero que `/to-issues` proponga tracer bullets verticales, para que cada issue entregue comportamiento verificable de extremo a extremo.
26. Como responsable de planificación, quiero revisar la granularidad y los bloqueos antes de publicar issues, para corregir una mala descomposición.
27. Como responsable de planificación, quiero que cada issue generada conserve una referencia al plan de origen, para recuperar su contexto.
28. Como agente implementador, quiero que cada issue declare sus bloqueadores mediante IDs, para conocer cuándo puede comenzar.
29. Como agente implementador, quiero que `/take-issue` omita las issues bloqueadas, para no trabajar sobre dependencias aún ausentes de `main`.
30. Como agente implementador, quiero que la selección automática priorice primero la prioridad y después la antigüedad del ID, para obtener un resultado determinista.
31. Como agente implementador, quiero solicitar una issue por ID o nombre, para trabajar sobre una tarea concreta.
32. Como agente implementador, quiero recibir un resumen antes de modificar el repositorio, para confirmar qué voy a implementar.
33. Como agente implementador, quiero que una tarea nueva solo pueda tomarse desde un `main` limpio, para evitar mezclar trabajo previo.
34. Como agente implementador, quiero que la rama use el tipo, ID y slug de la issue, para reconocer su propósito.
35. Como agente implementador, quiero que la issue pase a en progreso al tomarla, para reflejar su estado dentro de la rama.
36. Como agente implementador, quiero que una issue procedente de un plan cargue también ese plan como contexto, para respetar las decisiones globales.
37. Como agente implementador, quiero reanudar una issue en progreso desde su rama, para recuperarme de interrupciones.
38. Como agente implementador, quiero que un fallo conserve la issue en progreso y muestre instrucciones de recuperación, para no ocultar trabajo parcial.
39. Como agente implementador, quiero acordar los seams de prueba y aplicar ciclos red-verde cuando corresponda, para validar comportamiento observable.
40. Como agente implementador, quiero revisar el cambio contra los estándares del repositorio y la issue, para detectar desviaciones antes de darlo por terminado.
41. Como agente implementador, quiero que una revisión con hallazgos bloqueantes vuelva a la implementación, para no avanzar una issue defectuosa.
42. Como agente implementador, quiero que una implementación revisada pase a en revisión, para indicar que está lista para la decisión del usuario.
43. Como usuario, quiero decidir explícitamente si se publican e integran los cambios, para conservar control sobre operaciones remotas.
44. Como usuario, quiero que rechazar la publicación deje la rama y la issue en revisión de forma local, para poder retomarlas posteriormente.
45. Como usuario, quiero que aceptar la publicación invoque `/close-issue`, para centralizar verificaciones, push, PR, merge a `main`, borrado de rama y cierre canónico.
46. Como usuario, quiero invocar `/close-issue` directamente con un ID o inferirlo desde la rama, para cerrar trabajo pendiente en otra sesión.
47. Como usuario, quiero que `/close-issue` se niegue a cerrar trabajo con verificaciones fallidas, para no publicar una rama defectuosa.
48. Como usuario, quiero que una issue pase a completado únicamente después de fusionar su código en `main`, para que el estado `done` nunca se adelante a la integración real.
49. Como mantenedor, quiero que las skills necesarias viajen dentro del repositorio, para que el flujo no dependa de la configuración global de una máquina.
50. Como usuario de Pi, quiero usar comandos cortos como `/new-issue` y `/take-issue`, para no depender de la sintaxis interna `/skill:<nombre>`.

## Implementation Decisions

- La aplicación será un paquete independiente de React, TypeScript y Vite dentro del workspace y reutilizará las configuraciones compartidas de TypeScript, ESLint y StyleX del monorepo.
- La interfaz será de solo lectura. Crear, editar o mover artefactos seguirá siendo responsabilidad de las skills y de Git.
- La integración de Vite indexará los Markdown durante desarrollo y build, expondrá datos normalizados a React y actualizará el tablero durante el desarrollo cuando cambien los archivos.
- El tablero tendrá exactamente cuatro estados canónicos: `backlog`, `in-progress`, `in-review` y `done`. La ubicación física de la issue será la fuente de verdad; el estado no se duplicará en el frontmatter.
- Los planes se almacenarán fuera de los directorios de estado, no tendrán estado, no aparecerán en el tablero y no generarán issues automáticamente.
- Los IDs de issue seguirán una secuencia `ISS-XXXX`; los IDs de plan tendrán una secuencia independiente `PLAN-XXXX`. Los nombres de archivo combinarán ID y slug legible.
- El frontmatter de una issue incluirá como mínimo ID, título, clase de trabajo, tipo, prioridad, alcance, aplicación opcional, fecha de creación, plan de origen opcional y lista de bloqueadores.
- Las clases de trabajo distinguirán las tareas sencillas creadas directamente de las issues generadas al descomponer un plan.
- Los tipos serán `feature`, `fix` y `chore`. Las prioridades serán `high`, `medium` y `low`.
- El alcance será una aplicación concreta o el monorepo en general. Los cambios sobre paquetes compartidos se considerarán generales en esta primera versión.
- Una issue sencilla contendrá contexto y problema, resultado esperado, requisitos funcionales, criterios de aceptación, decisiones técnicas, estrategia de pruebas, fuera de alcance y notas o dependencias.
- Un plan contendrá problema, solución, una lista extensa de historias de usuario, decisiones de implementación, decisiones de pruebas, fuera de alcance y notas.
- `/new-issue` preguntará primero si el usuario quiere crear una tarea sencilla o una historia de usuario completa. Ambos recorridos ejecutarán `grilling` hasta vaciar el árbol de decisiones.
- Para una tarea sencilla, `/new-issue` preguntará alcance, recibirá la descripción, inferirá tipo y prioridad, confirmará la especificación y publicará una sola issue en backlog.
- Para una historia de usuario, `/new-issue` invocará `/to-plan` después del grilling. El resultado será exclusivamente un plan; no se creará ninguna issue ni entrada de tablero.
- `/to-plan` será una adaptación local y autocontenida de la skill global de síntesis. No entrevistará al usuario, podrá ejecutarse de forma independiente y publicará el plan en el gestor local.
- `/to-issues` será una adaptación local de la skill global de descomposición. Aceptará un plan, explorará el monorepo, propondrá tracer bullets y relaciones de bloqueo, iterará con el usuario y solo publicará las issues después de aprobación.
- `/to-issues` no creará una issue padre ni cambiará el significado o ciclo de vida del plan. Cada issue resultante conservará una referencia al plan fuente.
- Una issue estará disponible cuando permanezca en backlog y todas las IDs de `blockedBy` estén en `done` en la vista de `main`. La selección automática ordenará por prioridad y después por ID ascendente.
- `/take-issue` aceptará ID o nombre. Sin argumento elegirá la siguiente disponible. Una petición explícita de una issue bloqueada será rechazada con la lista de bloqueadores pendientes.
- Tomar trabajo nuevo requerirá estar en `main`, tener el árbol de trabajo limpio y partir de la rama principal. El flujo se detendrá ante cambios locales no relacionados.
- Las ramas usarán `feat/ISS-XXXX-slug` para features y chores orientados a producto, y `fix/ISS-XXXX-slug` para correcciones. La decisión final se derivará del tipo de la issue.
- Después de resumir la issue y crear la rama, `/take-issue` moverá el Markdown a en progreso y ejecutará el flujo local de implementación.
- Si la issue referencia un plan fuente, el agente leerá también el plan antes de implementar, pero la unidad de entrega seguirá siendo únicamente la issue seleccionada.
- Una issue en progreso podrá reanudarse por ID desde su rama. Una issue en revisión remitirá a `/close-issue`; una issue completada no admitirá nuevas modificaciones mediante `/take-issue`.
- El flujo de implementación aplicará TDD en seams previamente acordados, comprobará tipos de manera regular y ejecutará las verificaciones completas al final.
- La revisión separará conformidad con estándares y conformidad con la especificación. Los hallazgos bloqueantes deberán resolverse antes de mover la issue a en revisión.
- La revisión arquitectónica se aplicará únicamente cuando el alcance de la issue tenga consecuencias arquitectónicas reales; no será un paso obligatorio para cambios triviales.
- Tras una revisión satisfactoria se moverá la issue a en revisión, se conservarán commits locales y se presentará el resumen final al usuario.
- `/take-issue` preguntará si el usuario desea publicar la rama, fusionarla, eliminarla y completar la issue en `main`. Una respuesta negativa no ejecutará operaciones remotas y dejará el trabajo local en revisión.
- Una respuesta afirmativa delegará en `/close-issue`. Esta skill validará rama, identidad y estado, ejecutará las comprobaciones acordadas, hará push, creará o reutilizará la PR y la fusionará automáticamente en `main` mientras la issue permanece en revisión.
- `/close-issue` aceptará un ID o nombre y, sin argumentos, inferirá el ID desde la rama actual. Podrá reanudar desde `main` con ID explícito cuando el código ya esté fusionado y falte completar el cierre canónico.
- Después de confirmar el merge remoto, `/close-issue` actualizará `main` mediante fast-forward, eliminará la rama local y remota, moverá la issue de `in-review` a `done` en `main`, creará un commit exclusivo para esa transición y lo subirá directamente sin force.
- El flujo asumirá un único agente u operador tomando trabajo en esta primera versión; no se implementarán bloqueos distribuidos.
- Las skills globales requeridas se copiarán como archivos reales, junto con sus referencias, y se adaptarán para eliminar dependencias de trackers externos, skills ausentes o subagentes no disponibles.
- Las skills locales canónicas serán `new-issue`, `take-issue`, `close-issue`, `to-plan`, `to-issues`, `grilling`, `implement`, `tdd`, `code-review` e `improve-codebase-architecture`.
- Pi expondrá las skills con `/skill:<nombre>`. Plantillas locales ofrecerán los alias `/new-issue`, `/take-issue`, `/close-issue`, `/to-plan` y `/to-issues` solicitados por el usuario.
- El tablero mostrará contadores, tarjetas resumidas, búsqueda, filtros y un detalle expandible de la issue. Los planes no se mostrarán ni se podrán abrir desde la aplicación.
- El diseño será responsive, accesible por teclado, semántico y coherente con los tokens y componentes compartidos del monorepo.
- La carga distinguirá explícitamente estados de éxito, vacío y error. Los metadatos externos al código se validarán en tiempo de ejecución antes de llegar a la interfaz.

## Testing Decisions

- Las pruebas verificarán comportamiento observable a través de interfaces públicas y evitarán acoplarse a detalles internos, clases StyleX o estructura privada de módulos.
- El primer seam será el **índice de issues**: dado un conjunto conocido de Markdown y rutas de estado, devolverá issues validadas, ordenadas y agrupadas, junto con diagnósticos para IDs duplicados, metadatos inválidos, bloqueadores desconocidos o discrepancias entre ruta y contenido.
- El segundo seam será el **tablero renderizado**: dadas issues conocidas, mostrará las cuatro columnas y sus contadores, permitirá buscar y filtrar, abrirá el detalle y representará correctamente estados vacíos y errores.
- El índice se probará con fixtures pequeños y valores esperados independientes de su implementación.
- El tablero se probará desde el punto de vista del usuario mediante roles, nombres accesibles y acciones públicas.
- Se utilizarán Vitest y Testing Library para mantener las pruebas dentro del ecosistema de Vite y React.
- Las skills y plantillas son contratos de instrucciones, no funciones deterministas. Se validarán estructuralmente: frontmatter válido, nombres únicos, referencias locales existentes, alias presentes y directorios de estado esperados.
- Los ciclos TDD serán verticales: una prueba fallida, la implementación mínima y el siguiente comportamiento. No se escribirán lotes de pruebas desacoplados de una entrega observable.
- La verificación final del paquete incluirá lint, comprobación de tipos, pruebas y build. También se comprobará el modo desarrollo y la generación de CSS de StyleX.
- No existe infraestructura previa de pruebas en la aplicación porque será nueva; se reutilizarán los patrones de scripts, TypeScript, ESLint, Vite y StyleX de las aplicaciones existentes del workspace.

## Out of Scope

- Crear, editar, mover o eliminar issues desde la interfaz web.
- Drag-and-drop entre columnas.
- Mostrar, buscar o administrar planes desde el tablero.
- Generar issues automáticamente al crear un plan.
- Crear una issue padre para representar un plan.
- Descomponer planes sin aprobación explícita del usuario.
- Estados, archivado o ciclo de vida propio para planes.
- Coordinación multiagente, locks, reservas remotas o prevención distribuida de selecciones duplicadas.
- Base de datos, servidor persistente o servicio externo de issue tracking.
- Despliegue, force-push o elusión de protecciones.
- Sincronización automática con futuras versiones de las skills globales originales.
- Alcance específico de paquetes como tercera categoría distinta de general y aplicación.
- Subtareas anidadas, épicas, estimaciones, asignados, comentarios o adjuntos.
- Compatibilidad heredada con otros formatos de issues.

## Further Notes

- La ubicación canónica de issues será `apps/issues-tracker/issues/`, con subdirectorios `backlog/`, `in-progress/`, `in-review/` y `done/`.
- La ubicación canónica de planes será `apps/issues-tracker/plans/`.
- Este documento es el primer plan y utiliza el ID `PLAN-0001`. No crea una issue asociada.
- Después de implementar el gestor, este plan podrá descomponerse manualmente mediante `/to-issues`.
- Al añadir las skills locales será necesario recargar o reiniciar Pi para que sus comandos sean descubiertos.
