# StyleX Build Pipeline Resources

## Knowledge

- [StyleX: instalación con Next.js](https://stylexjs.com/docs/learn/installation/nextjs)
  Fuente principal para la integración Babel + PostCSS, el archivo global con `@stylex` y el funcionamiento con Next.js 16.
- [StyleX: instalación con PostCSS](https://stylexjs.com/docs/learn/installation/postcss)
  Explica por qué se separan la transformación del JavaScript y la generación del CSS, y cómo se integra con Turbopack.
- [StyleX: configuración del plugin de Babel](https://stylexjs.com/docs/api/configuration/babel-plugin)
  Referencia para `runtimeInjection`, resolución de módulos y las transformaciones de StyleX.
- [StyleX: configuración del plugin de PostCSS](https://stylexjs.com/docs/api/configuration/postcss-plugin)
  Referencia para `include`, `babelConfig`, descubrimiento de archivos y depuración.
- [Babel: guía de uso](https://babeljs.io/docs/usage)
  Fuente primaria sobre Babel como compilador y los plugins como transformaciones del código fuente.
- [PostCSS: arquitectura](https://postcss.org/docs/postcss-architecture)
  Fuente primaria sobre parsing de CSS, AST y transformaciones mediante plugins.
- [Next.js: Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)
  Aclara que Turbopack es el bundler predeterminado, detecta Babel desde Next.js 16 y procesa PostCSS.
- [pnpm: workspaces](https://pnpm.io/workspaces)
  Explica enlaces de paquetes locales, el protocolo `workspace:` y el aislamiento de dependencias por paquete.
- [Turborepo: configuración de tareas](https://turborepo.com/docs/crafting-your-repository/configuring-tasks)
  Fuente primaria para distinguir la coordinación y caché de tareas de la compilación que hace Next.js.
- [Autoprefixer](https://github.com/postcss/autoprefixer)
  Referencia del plugin opcional que añade prefijos de navegador según datos de compatibilidad.

## Wisdom (Communities)

- [StyleX Discussions](https://github.com/facebook/stylex/discussions)
  Para contrastar decisiones de integración y casos límite de monorepos con mantenedores y usuarios.
- [Next.js Discussions](https://github.com/vercel/next.js/discussions)
  Para problemas específicos de Babel, PostCSS y Turbopack que dependan de la versión de Next.js.
