---
id: ISS-0006
title: Renombrar web y crear dashboard local de App Factory
kind: simple-task
type: feature
priority: medium
scope: general
createdAt: 2026-08-31
blockedBy: []
---

## Contexto y problema

`apps/web` conserva la portada inicial de Next.js y su nombre ya no representa su función. La fábrica necesita un dashboard local que actúe como entrada al monorepo y facilite el acceso a sus módulos principales.

## Resultado esperado

La aplicación pasa a llamarse técnicamente `dashboard`, permanece disponible en `http://localhost:3000` y presenta información básica de App Factory junto con accesos al sistema de diseño y al gestor de tareas.

## Requisitos funcionales

- Renombrar completamente `apps/web` a `apps/dashboard`.
- Cambiar el nombre del paquete de `web` a `dashboard`.
- Actualizar referencias, documentación, fixtures y lockfile mediante pnpm.
- No conservar alias ni compatibilidad con el nombre `web`.
- Sustituir completamente la portada generada por Next.js.
- Mostrar en español:
  - Bienvenida a App Factory.
  - Propósito del monorepo.
  - Stack principal: Turborepo, pnpm, TypeScript, React y Next.js.
  - Resumen de `dashboard`, `ui-catalog` e `issues-tracker`.
- Incorporar dos tarjetas o accesos destacados:
  - Sistema de diseño → `http://localhost:3001`.
  - Gestor de tareas → `http://localhost:3002`.
- Navegar en la misma pestaña.
- Fijar `ui-catalog` en el puerto `3001`.
- Fijar `issues-tracker` en el puerto `3002`.
- Actualizar los metadatos de `dashboard`.
- Eliminar recursos de la plantilla inicial que queden sin uso.

## Criterios de aceptación

- No queda una aplicación ni un paquete llamado `web`.
- Los filtros de pnpm funcionan con `dashboard`.
- El lockfile y las referencias del repositorio reflejan `apps/dashboard`.
- `dashboard`, `ui-catalog` e `issues-tracker` responden respectivamente en los puertos `3000`, `3001` y `3002`.
- La portada muestra en español la bienvenida, el propósito, el stack y el resumen de las aplicaciones.
- Los dos accesos tienen destinos correctos y funcionan mediante navegación normal en la misma pestaña.
- Todos los controles son utilizables con teclado y tienen nombres accesibles.
- La interfaz se adapta a pantallas pequeñas y grandes sin desbordamiento horizontal.
- El documento presenta título y descripción propios de App Factory.
- No permanece contenido visible ni código utilizado exclusivamente por la plantilla inicial.
- La ausencia de un módulo no activa comprobaciones ni estados especiales; el navegador gestiona el error de conexión.

## Decisiones técnicas

- Implementar la portada en el App Router de Next.js.
- Reutilizar componentes, tokens y temas de `@repo/ui`.
- Escribir estilos con StyleX y la configuración compartida.
- Mantener el contenido y los enlaces como información estática local.
- Configurar puertos deterministas en las aplicaciones Vite.
- No importar archivos internos entre aplicaciones.
- No añadir dependencias nuevas ni compatibilidad heredada.
- Actualizar mediante pnpm cualquier cambio necesario en `pnpm-lock.yaml`.

## Estrategia de pruebas

Seams observables acordados:

- Identidad de la aplicación en el workspace y funcionamiento de los filtros de pnpm.
- Contenido y jerarquía semántica de la portada.
- Destinos y comportamiento de los enlaces.
- Navegación mediante teclado.
- Presentación responsive.
- Metadatos del documento.
- Puertos efectivos de las tres aplicaciones.

Comprobaciones:

- Ejecutar `lint`, `check-types` y `build` para `dashboard`, `ui-catalog` e `issues-tracker`.
- Actualizar y ejecutar los tests existentes de `issues-tracker` para que reconozcan `dashboard`.
- Verificar manualmente en navegador los textos, enlaces, teclado y puntos de ruptura relevantes.
- No introducir infraestructura nueva de tests.

## Fuera de alcance

- URLs configurables para otros entornos.
- Despliegue o soporte de producción.
- Alias o compatibilidad para `web`.
- Comprobaciones de disponibilidad de módulos.
- Métricas, estado en tiempo real, autenticación o contenido dinámico.
- Nuevos módulos o navegación interna adicional.

## Notas y dependencias

- La tarea afecta coordinadamente a las tres aplicaciones existentes.
- Depende únicamente de paquetes y configuración ya presentes en el workspace.
- No tiene bloqueos conocidos.
