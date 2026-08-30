---
name: bootstrap-stylex
description: Bootstrap de StyleX para aplicaciones de la fábrica. Usa la rama React + Vite cuando package.json dependa de vite; usa la rama Next.js cuando dependa de next.
---

# Bootstrap de StyleX

Deja StyleX compilado en build time, cubierto por ESLint y comprobado tanto en desarrollo como en producción. No sustituyas esta integración oficial por plugins comunitarios.

## 1. Inventario

Lee el `AGENTS.md` aplicable, `package.json`, `pnpm-workspace.yaml`, la configuración del bundler, ESLint y el CSS cargado desde la raíz de la aplicación. Identifica también cada paquete del workspace importado por la aplicación que contenga o vaya a contener StyleX.

Elige una sola rama por las dependencias del paquete:

- Si depende de `vite`, lee completa [`references/vite-react.md`](references/vite-react.md).
- Si depende de `next`, lee completa [`references/nextjs.md`](references/nextjs.md).
- Si no coincide con ninguna, detente e informa que esta skill no cubre ese bundler.

**Criterio de finalización:** están identificados el nombre del paquete, el framework, las versiones del catálogo, los scripts de comprobación, el CSS raíz y todos los directorios fuente que pueden crear estilos.

## 2. Bootstrap

Aplica la lista de la rama sin sobrescribir configuración no relacionada.

- Usa `pnpm` y declara cada dependencia en el paquete que la usa.
- Reutiliza entradas `catalog:`. Si falta un paquete de la familia StyleX en el catálogo, añádelo con la misma versión que `@stylexjs/stylex` antes de instalarlo; deja que `pnpm` actualice el lockfile.
- Conserva CSS global solo para reset, fuentes, reglas de documento e integraciones que no puedan expresarse con StyleX.
- Mantén la misma configuración de `useCSSLayers` en toda la rama. Si existe una capa de reset, colócala antes de StyleX y usa `prefix: "stylex"`.
- Configura ESLint en el ámbito donde se escriben los estilos; instalar el plugin sin activar sus reglas no cuenta.
- Añade una aplicación mínima y visible de `stylex.create` + `stylex.props` en el componente raíz o en el primer componente real. No migres el resto de estilos salvo que se solicite.

Para variables compartidas, usa un archivo `*.stylex.ts` que exporte únicamente valores creados con `stylex.defineVars` o `stylex.defineConsts`.

**Criterio de finalización:** todas las dependencias son directas y coherentes, el compilador cubre cada directorio fuente identificado, existe un único punto de entrada CSS y ESLint analiza los archivos StyleX.

## 3. Verificación

Desde la raíz, ejecuta para el paquete afectado:

1. `pnpm --filter <paquete> lint` si existe el script.
2. `pnpm --filter <paquete> check-types` si existe el script.
3. `pnpm --filter <paquete> build`.

Inspecciona el CSS generado en `dist/assets/` o `.next/static/css/`: debe contener reglas StyleX y no debe conservar la directiva `@stylex`. Comprueba además la rama en modo desarrollo sin dejar un proceso persistente abierto.

Si participa un paquete compartido, usa al menos un estilo suyo desde la aplicación y confirma que aparece también en el CSS generado. Corrige la cobertura del compilador; no dupliques el estilo dentro de la aplicación.

**Criterio de finalización:** todas las comprobaciones disponibles pasan, desarrollo y build muestran el estilo mínimo, y el CSS de cada fuente —incluidos paquetes compartidos— está presente. Si algo no puede ejecutarse, informa el comando, el motivo y el riesgo pendiente.
