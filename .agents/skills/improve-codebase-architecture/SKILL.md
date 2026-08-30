---
name: improve-codebase-architecture
description: Explora fricción arquitectónica, presenta oportunidades de profundización en un informe HTML y usa grilling para la opción elegida. Aplícala solo cuando una issue tenga alcance arquitectónico real.
disable-model-invocation: true
---

# Improve Codebase Architecture

Esta adaptación es autocontenida y no requiere subagentes ni otras skills arquitectónicas globales.

## Vocabulario

- **module**: código y datos encapsulados tras una interfaz.
- **interface**: superficie que otros módulos deben comprender.
- **implementation**: complejidad oculta por la interfaz.
- **depth**: diferencia entre una interfaz pequeña y una implementación capaz.
- **deep / shallow**: módulo con mucha o poca complejidad ocultada.
- **seam**: interfaz pública donde puede observarse y probarse comportamiento.
- **adapter**: traducción entre un seam y una dependencia concreta.
- **leverage**: beneficio multiplicado de una interfaz pequeña para muchos consumidores.
- **locality**: decisiones relacionadas concentradas en un mismo módulo.

Aplica el **deletion test**: eliminar un módulo profundo concentra complejidad; eliminar uno shallow suele limitarse a moverla.

## 1. Explorar

Lee `CONTEXT.md` y ADRs si existen. Recorre directamente el código afectado y detecta:

- comprensión que obliga a saltar entre muchos módulos shallow;
- interfaces casi tan complejas como sus implementaciones;
- lógica extraída solo para probar mientras los fallos viven en su integración;
- filtraciones entre seams;
- áreas difíciles de probar por su interfaz actual.

No propongas arquitectura por rutina ni fuera del alcance de la issue.

## 2. Informe

Usa [HTML-REPORT.md](HTML-REPORT.md) como referencia. Escribe un HTML autocontenido en el directorio temporal del sistema, nunca en el repositorio. Para cada candidato incluye archivos, problema, solución, beneficios de locality y leverage, diagrama before/after y fuerza `Strong`, `Worth exploring` o `Speculative`.

Marca conflictos con ADRs. Termina con una recomendación principal. Comunica la ruta absoluta del informe y pregunta qué candidato quiere explorar el usuario; no cambies código todavía.

## 3. Grilling

Tras elegir un candidato, carga [`../grilling/SKILL.md`](../grilling/SKILL.md). Recorre restricciones, dependencias, interfaz del módulo profundizado, implementación oculta y seams de prueba. Solo modifica código cuando el usuario confirme el diseño y la issue autorice ese alcance.
