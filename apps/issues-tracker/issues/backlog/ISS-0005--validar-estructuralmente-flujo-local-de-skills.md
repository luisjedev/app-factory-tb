---
id: ISS-0005
title: Validar estructuralmente el flujo local de skills
kind: plan-slice
type: chore
priority: medium
scope: general
createdAt: 2026-08-30
sourcePlan: PLAN-0001
blockedBy:
  - ISS-0002
---

## Contexto y problema

Las skills y plantillas del gestor local ya existen y serán ejecutadas manualmente por un usuario contra un agente de IA. No son funciones deterministas de la aplicación, pero pueden degradarse por errores estructurales como frontmatter inválido, nombres duplicados, referencias rotas, alias ausentes o directorios canónicos inexistentes.

## Resultado esperado

La infraestructura de pruebas de `issues-tracker` incluye una comprobación estructural determinista de los artefactos locales del flujo, sin intentar simular conversaciones, decisiones del agente ni operaciones remotas.

## Requisitos funcionales

- Descubrir las skills locales canónicas bajo `.agents/skills`.
- Validar que cada `SKILL.md` declarado tiene frontmatter legible, nombre válido y descripción no vacía.
- Detectar nombres de skill duplicados.
- Comprobar que las referencias Markdown locales usadas por las skills resuelven a archivos existentes.
- Comprobar la presencia de los alias `/new-issue`, `/take-issue`, `/close-issue`, `/to-plan` y `/to-issues` bajo `.pi/prompts`.
- Comprobar que cada alias carga la skill local correspondiente.
- Comprobar la existencia de los directorios canónicos de estados y planes.
- Emitir diagnósticos que identifiquen el artefacto y la regla estructural incumplida.
- Integrar la comprobación en el script de pruebas del paquete.

## Criterios de aceptación

- El árbol actual de skills, referencias y plantillas supera la validación estructural.
- Un fixture o caso controlado con frontmatter inválido produce un fallo comprensible.
- Una referencia local inexistente y un alias ausente se detectan de forma determinista.
- Los cinco alias públicos apuntan a sus respectivas skills canónicas.
- La comprobación valida los cuatro directorios de estado y el directorio de planes.
- No se prueba ni afirma que un modelo seguirá correctamente instrucciones en lenguaje natural.
- No se ejecutan ramas, commits, pushes, merges ni otras operaciones Git como parte de estas pruebas.
- Las skills existentes solo se modifican si la validación revela un defecto estructural real.
- Pasan pruebas, lint, comprobación de tipos y build de `issues-tracker`.

## Decisiones técnicas

- Tratar skills y plantillas como contratos de archivos, no como código de aplicación ni como una API determinista del modelo.
- Reutilizar Vitest y la infraestructura establecida por `ISS-0002`.
- Mantener fixtures aislados para probar fallos sin alterar los artefactos canónicos durante la ejecución.
- Resolver referencias desde la ubicación real de cada Markdown, igual que las interpreta el agente.

## Estrategia de pruebas

- Usar el árbol real del repositorio para el caso satisfactorio.
- Usar fixtures temporales pequeños para frontmatter, colisiones, referencias y alias inválidos.
- Comparar diagnósticos concretos sin ejecutar el contenido instructivo de las skills.
- Ejecutar las comprobaciones completas del paquete después de la suite estructural.

## Fuera de alcance

- Probar la calidad de las respuestas de un LLM.
- Automatizar `/new-issue`, `/take-issue`, `/close-issue`, `/to-plan` o `/to-issues`.
- Simular confirmaciones de usuario o recorridos conversacionales.
- Ejecutar operaciones Git o de red.
- Reescribir las skills por motivos estilísticos no detectados por el validador.

## Notas y dependencias

- Bloqueada por `ISS-0002` para reutilizar el paquete, Vitest y sus scripts de comprobación.
- La validación protege la portabilidad del flujo local sin convertir las skills en funcionalidad de la interfaz.
