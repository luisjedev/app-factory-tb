---
id: ISS-0001
title: Ampliar @repo/ui con componentes básicos para el tablero
kind: plan-slice
type: feature
priority: high
scope: general
createdAt: 2026-08-30
sourcePlan: PLAN-0001
blockedBy: []
---

## Contexto y problema

El paquete compartido `@repo/ui` solo ofrece un botón completo y un `card.tsx` de demostración que no sirve como primitiva componible. El tablero del gestor de tareas necesita controles y contenedores coherentes, accesibles y reutilizables, sin introducir Tailwind ni duplicar estilos dentro de la nueva aplicación.

## Resultado esperado

`@repo/ui` expone el conjunto mínimo de componentes basado en shadcn/ui que necesita el gestor de tareas, con su presentación migrada a StyleX y siguiendo el patrón público de `button.tsx`. Una aplicación Vite existente demuestra que los estilos del paquete compartido se compilan correctamente.

## Requisitos funcionales

- Sustituir el `Card` de demostración por las primitivas componibles `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` y `CardFooter`.
- Añadir `Badge` con las variantes visuales necesarias para metadatos de issues.
- Añadir `Input` conservando las propiedades nativas del elemento.
- Añadir `Label` con asociación accesible a su control.
- Añadir `NativeSelect` y `NativeSelectOption` para filtros sencillos.
- Añadir `Alert`, `AlertTitle` y `AlertDescription` para mensajes y diagnósticos.
- Conservar refs, atributos nativos, estado deshabilitado, foco visible e indicación de invalidez cuando correspondan.
- Publicar cada componente mediante la API pública de `@repo/ui`.
- Consumir una muestra representativa de los nuevos componentes desde `client-demo` para comprobar su integración real.

## Criterios de aceptación

- Las APIs y la semántica toman como referencia los componentes oficiales de shadcn/ui vigentes al implementar la issue.
- Todos los estilos de los componentes nuevos se expresan mediante `stylex.create` y `stylex.props`.
- No se incorporan Tailwind, CVA ni utilidades de composición de clases para reproducir el estilo original.
- Los colores, radios y efectos reutilizan los tokens compartidos existentes o extensiones justificadas de esos tokens.
- `card.tsx` deja de contener el enlace de demostración actual y expone una tarjeta componible.
- Los componentes admiten un prop `style` tipado con `StyleXStyles`, compuesto al final de `stylex.props`, y conservan las props nativas compatibles.
- Los estados de foco, invalidez y deshabilitado son perceptibles y no dependen únicamente del color.
- `client-demo` renderiza una muestra representativa y su build genera CSS para estilos procedentes de `@repo/ui`.
- El CSS generado no contiene directivas `@stylex`.
- Pasan lint y comprobación de tipos de `@repo/ui`, además de lint, tipos y build de `client-demo`.

## Decisiones técnicas

- Usar componentes nativos siempre que cubran el comportamiento requerido; en particular, preferir `NativeSelect` para no añadir una dependencia de primitivas complejas.
- Mantener `forwardRef`, props explícitas y composición oficial mediante `stylex.props(estilosLocales, style)` para que el último estilo gane de forma determinista.
- El paquete compartido seguirá publicando código fuente TypeScript y StyleX mediante exports explícitos.
- La configuración del compilador y las reglas StyleX seguirán centralizadas en los paquetes compartidos existentes.

## Estrategia de pruebas

- Usar la API pública de los componentes como seam principal y comprobar su renderizado semántico, atributos y estados observables.
- Ejecutar `pnpm --filter @repo/ui lint` y `pnpm --filter @repo/ui check-types`.
- Ejecutar lint, comprobación de tipos y build de `client-demo` como consumidor Vite.
- Inspeccionar el CSS de producción para confirmar que contiene reglas de los componentes compartidos y no conserva `@stylex`.
- Verificar el modo desarrollo de `client-demo` y detener el proceso al terminar.

## Fuera de alcance

- Añadir todos los componentes disponibles en shadcn/ui.
- Incorporar `Dialog`, selectores complejos, tablas de datos, formularios o componentes que el tablero no necesita.
- Crear la aplicación `issues-tracker` en esta issue.
- Introducir Tailwind o cambiar la estrategia compartida de StyleX.

## Notas y dependencias

- No tiene bloqueadores y debe abordarse antes que el tablero base.
- El `Card` actual no tiene consumidores detectados, por lo que puede reemplazarse sin una migración de usos existentes.
- Referencias oficiales: `https://ui.shadcn.com/docs/components`, `https://ui.shadcn.com/docs/components/radix/card` y `https://ui.shadcn.com/docs/components/radix/native-select`.
