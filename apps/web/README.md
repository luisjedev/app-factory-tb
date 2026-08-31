# Web

Aplicación Next.js de bienvenida y panel de control de App Factory.

## Responsabilidad

`web` es la entrada principal al monorepo. Su evolución debe concentrar:

- Información general y estado de la fábrica.
- Acceso al catálogo visual `ui-catalog`.
- Acceso al gestor interno de tareas.
- Acceso futuro a otras secciones nativas del monorepo.

La interfaz actual sigue siendo una base inicial; las secciones se incorporarán conforme se implementen sus aplicaciones.

## Desarrollo

Desde la raíz:

```bash
pnpm --filter web dev
```

La aplicación responde por defecto en <http://localhost:3000>.

## Verificación

```bash
pnpm --filter web lint
pnpm --filter web check-types
pnpm --filter web build
```

## Arquitectura

- Framework: Next.js con App Router.
- UI compartida: `@repo/ui`.
- Estilos: StyleX mediante `@repo/stylex-config`.
- ESLint y TypeScript: presets compartidos del workspace.

La aplicación no debe importar internals de otras aplicaciones. El acceso a cada sección debe realizarse mediante navegación o interfaces públicas apropiadas.
