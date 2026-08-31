# UI Catalog

A living, framework-agnostic catalog for the components exported by `@repo/ui`.
It shows the public variants of each component and acts as the visual reference
for applications in this monorepo.

## Development

From the repository root:

```bash
pnpm --filter ui-catalog dev
```

## Checks

```bash
pnpm --filter ui-catalog lint
pnpm --filter ui-catalog check-types
pnpm --filter ui-catalog build
```
