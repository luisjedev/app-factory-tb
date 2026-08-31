# UI Catalog

Catálogo visual de los componentes exportados por `@repo/ui`.

## Responsabilidad

- Mostrar la interface pública y las variantes disponibles de cada componente.
- Validar la integración real de `@repo/ui` y StyleX desde una aplicación Vite.
- Servir como referencia visual para las aplicaciones del monorepo.

`ui-catalog` es una sección nativa independiente. El panel `web` proporcionará acceso a ella, pero no debe importar sus archivos internos.

## Desarrollo

Desde la raíz:

```bash
pnpm --filter ui-catalog dev
```

## Verificación

```bash
pnpm --filter ui-catalog lint
pnpm --filter ui-catalog check-types
pnpm --filter ui-catalog build
```
