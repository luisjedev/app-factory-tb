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
- [StyleX: instalación con Vite](https://stylexjs.com/docs/learn/installation/vite)
  Fuente principal para integrar StyleX mediante `@stylexjs/unplugin`, emitir CSS y habilitar HMR.
- [StyleX: configuración de unplugin](https://stylexjs.com/docs/api/configuration/unplugin)
  Matriz oficial de adaptadores para Vite, Rollup, Webpack, Rspack, esbuild y Bun; usar para opciones compartidas y paquetes externos.
- [StyleX: “Introducing StyleX”](https://stylexjs.com/blog/introducing-stylex)
  Explicación del equipo de StyleX sobre el plugin Babel como compilador central y sobre cómo las integraciones agregan el CSS.
- [Código fuente: manifest de `@stylexjs/unplugin`](https://github.com/facebook/stylex/blob/main/packages/@stylexjs/unplugin/package.json)
  Evidencia primaria de que el unplugin oficial depende de `@babel/core` y `@stylexjs/babel-plugin`; evita confundir adaptador con compilador Babel-free.
- [Babel: guía de uso](https://babeljs.io/docs/usage)
  Fuente primaria sobre Babel como compilador y los plugins como transformaciones del código fuente.
- [PostCSS: arquitectura](https://postcss.org/docs/postcss-architecture)
  Fuente primaria sobre parsing de CSS, AST y transformaciones mediante plugins.
- [Next.js: Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)
  Aclara que Turbopack es el bundler predeterminado, detecta Babel desde Next.js 16 y procesa PostCSS.
- [Vite: por qué Vite](https://vite.dev/guide/why)
  Fuente oficial para separar el build general de Vite y su toolchain de los plugins especializados como StyleX.
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
- [stylex-swc-plugin](https://github.com/Dwlad90/stylex-swc-plugin)
  Implementación comunitaria Babel-free para explorar, no fuente de compatibilidad oficial; usar para evaluar el coste de abandonar el compilador mantenido por Meta.
