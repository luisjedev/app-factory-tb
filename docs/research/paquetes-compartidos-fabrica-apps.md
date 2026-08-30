# Investigación: paquetes compartidos para una fábrica de aplicaciones

## Resumen ejecutivo

Para este repositorio no conviene crear de antemano una gran colección de paquetes de negocio. La base más rentable es una **plataforma horizontal** que haga que todas las apps nazcan con el mismo diseño, configuración, pruebas, validación, observabilidad y proceso de generación. Los paquetes de `auth`, `db`, `api`, pagos o colas deben aparecer solo cuando varias apps compartan realmente el mismo backend o contrato de producto.

La recomendación priorizada es:

1. Consolidar los paquetes existentes: `@repo/ui`, `@repo/eslint-config` y `@repo/typescript-config`.
2. Añadir `@repo/stylex-config`, `@repo/testing`, `@repo/env`, `@repo/app-manifest` y `@repo/observability`.
3. Crear generadores en `turbo/generators` para producir apps y paquetes siguiendo ese camino estándar.
4. Incorporar `@repo/contracts` y `@repo/api-client` cuando aparezca el primer backend consumido por más de una app.
5. Añadir `@repo/auth`, `@repo/db`, `@repo/i18n`, `@repo/feature-flags`, etc. solo en función de necesidades comprobadas.

Turborepo trata cada paquete interno como una unidad independiente del workspace y recomienda paquetes con un propósito claro, evitando un gran paquete `shared` que mezcle componentes, utilidades, hooks y API ([paquetes internos](https://turborepo.com/docs/crafting-your-repository/creating-an-internal-package), [guía oficial de paquetes](https://github.com/vercel/turborepo/blob/main/skills/turborepo/references/best-practices/packages.md)).

## Estado actual observado

El workspace tiene seis paquetes:

- Apps: `web` y `docs` con Next.js; `client-demo` con React + Vite.
- Compartidos: `@repo/ui`, `@repo/eslint-config` y `@repo/typescript-config`.

Hallazgos relevantes para priorizar:

- `web` y `docs` duplican sus configuraciones de Babel y PostCSS para StyleX.
- `client-demo` mantiene configuraciones locales de ESLint y TypeScript, y no declara `check-types`; por tanto, el camino compartido todavía no cubre de forma uniforme Next.js y Vite.
- `@repo/ui` ya contiene tokens, temas y componentes. No hace falta separar ahora `design-tokens`; solo tendría sentido si se necesitan consumidores no React o nativos.
- No existe todavía infraestructura común de pruebas, validación de entorno, observabilidad ni generación de apps.

## Principio arquitectónico

Conviene distinguir tres familias:

1. **Tooling horizontal**: configuración de TypeScript, ESLint, StyleX y pruebas. Casi todas las apps deberían usarlo.
2. **Runtime horizontal**: UI, manifiesto de app, validación de entorno y observabilidad. Debe ser independiente del producto y, cuando corresponda, separar entradas de navegador y servidor.
3. **Verticales de producto**: contratos, API, auth, base de datos, pagos o jobs. Solo se comparten entre apps del mismo producto o backend; no entre clientes sin una necesidad real.

Esta separación reduce dos riesgos: que una app sencilla herede dependencias innecesarias y que código de servidor termine en el bundle cliente. El starter oficial `create-t3-turbo` separa `api`, `auth`, `db` y `ui`, y advierte que el código de API de servidor no debe convertirse en dependencia runtime de las apps cliente; los esquemas realmente compartidos deben vivir en un paquete seguro para ambos entornos ([repositorio oficial](https://github.com/t3-oss/create-t3-turbo)).

## Lista priorizada de opciones

| Prioridad | Paquete propuesto | Qué debería contener | Cuándo crearlo |
| --- | --- | --- | --- |
| Existente, reforzar | `@repo/ui` | Componentes, tokens, temas, accesibilidad y estados visuales | Ya; es el núcleo del sistema de diseño |
| Existente, reforzar | `@repo/eslint-config` | Presets base, React, Next y Vite | Ya; falta adoptar el preset compartido en `client-demo` |
| Existente, reforzar | `@repo/typescript-config` | Bases estrictas para librería, Next, Vite/browser y Node | Ya; falta verificar cobertura homogénea |
| Alta | `@repo/stylex-config` | Fábricas de configuración para Babel/PostCSS y Vite, con opciones comunes | Ahora; hay duplicación exacta en las dos apps Next |
| Alta | `@repo/testing` | Presets de Vitest, setup de DOM, render helpers, mocks y fixtures compartidas; exports separados para Node/browser | Antes de añadir comportamiento relevante |
| Alta | `@repo/env` | Helpers y presets de validación; separación `server`/`client`; cada app compone su propio esquema | Antes de incorporar servicios externos o secretos |
| Alta | `@repo/app-manifest` | Esquema de metadatos públicos: nombre, marca, URLs legales, SEO, locales y capacidades | Muy útil si la fábrica genera apps de distintas marcas/clientes |
| Alta | `@repo/observability` | Contratos de logger, correlación, redacción, errores y trazas; adaptadores por runtime/proveedor | Antes del primer despliegue real |
| Alta, pero no es paquete runtime | `turbo/generators` | Plantillas para app Next, app Vite, paquete, componente y feature | Ahora; es una pieza central de una “fábrica” |
| Media | `@repo/contracts` | Esquemas runtime, DTO, errores y tipos derivados; sin acceso a DB ni secretos | Cuando dos runtimes compartan datos o un backend |
| Media | `@repo/api-client` | Cliente HTTP/tRPC generado o tipado, autenticación de transporte, errores y timeouts | Cuando dos apps consuman la misma API |
| Condicional | `@repo/auth` | Configuración server, contratos de sesión, autorización y adaptadores cliente por framework | Cuando haya identidad compartida entre apps |
| Condicional | `@repo/db` | Cliente, esquema, migraciones y repositorios del mismo dominio | Solo para apps que compartan base de datos/backend |
| Condicional | `@repo/i18n` | Catálogos, claves tipadas, formatos y adaptadores por framework | Si varias apps comparten idiomas o copy |
| Condicional | `@repo/analytics` | Taxonomía tipada de eventos, consentimiento y adaptadores de proveedor | Cuando exista analítica de producto común |
| Condicional | `@repo/feature-flags` | Claves tipadas, defaults, contexto y adaptadores | Si se necesitan rollout, experimentos o kill switches |
| Condicional | `@repo/email` | Plantillas, componentes, renderizado y contrato de envío | Si varias apps envían comunicaciones similares |
| Condicional | `@repo/storage` | Contrato de objetos, validación, URLs firmadas y adaptadores | Si se comparten flujos de archivos |
| Condicional | `@repo/jobs` | Contratos de tareas, idempotencia, reintentos y adaptadores de cola | Si aparecen procesos asíncronos comunes |
| Condicional | `@repo/billing` | Catálogo, entitlement, webhooks idempotentes y adaptador del proveedor | Solo para productos con monetización compartida |
| Condicional | `@repo/ai` | Contratos de modelos, prompts versionados, herramientas, límites y telemetría | Solo cuando más de una app comparta capacidades de IA |

## Detalle de los paquetes de primera fase

### 1. `@repo/stylex-config`

Es la extracción más evidente en el estado actual. Debería proporcionar configuraciones comunes, no ocultar por completo las diferencias entre frameworks:

- `@repo/stylex-config/next-babel`
- `@repo/stylex-config/next-postcss`
- `@repo/stylex-config/vite`
- Una única definición de capas CSS, prefijos y opciones de compilación.
- Parámetros explícitos para `cwd`, alias y rutas de cada app.

StyleX usa compilación en build y dispone de integraciones diferentes para Babel/PostCSS y Vite; la documentación oficial recomienda el compilador y documenta ambas rutas ([instalación](https://stylexjs.com/docs/learn/installation), [Vite](https://stylexjs.com/docs/learn/installation/vite), [Babel](https://stylexjs.com/docs/api/configuration/babel-plugin)). Por eso conviene compartir las decisiones, pero mantener adaptadores específicos.

### 2. `@repo/testing`

Contenido recomendado:

- Config base de Vitest para Node y navegador/DOM.
- Testing Library y matchers de accesibilidad donde correspondan.
- MSW para mocks de red reutilizables.
- Builders de datos sin información real de clientes.
- Fixtures de Playwright, dejando los tests E2E dentro de cada app.

Si crece demasiado, dividir en `@repo/test-config`, `@repo/test-utils` y `@repo/e2e-fixtures`. Playwright soporta fixtures reutilizables y proyectos configurables por entorno ([fixtures](https://playwright.dev/docs/test-fixtures), [proyectos](https://playwright.dev/docs/test-projects)). Para `@repo/ui`, Storybook puede funcionar mejor como una app `apps/storybook` que como paquete; su integración con Vitest convierte stories en pruebas de componentes y permite ejecutar también accesibilidad y cobertura ([Storybook + Vitest](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)).

### 3. `@repo/env`

No debería exportar una lista global con todas las variables de todas las apps. El patrón recomendado es:

- Presets comunes y helpers en el paquete.
- Esquema final dentro de cada app.
- Entradas separadas `@repo/env/server` y `@repo/env/client` o composición equivalente.
- Validación al iniciar/build, sin valores secretos en el repositorio.

T3 Env valida variables en runtime, contempla `process.env` e `import.meta.env`, permite presets extensibles para monorepos y advierte sobre separar esquemas cliente/servidor para no enviar información del servidor al cliente ([introducción](https://env.t3.gg/docs/introduction), [core](https://env.t3.gg/docs/core), [customización](https://env.t3.gg/docs/customization)). Opciones de implementación: `@t3-oss/env-core` con Zod, Valibot o cualquier implementación compatible con Standard Schema.

### 4. `@repo/app-manifest`

Este paquete es especialmente útil en una fábrica, aunque no aparezca en starters genéricos. Debe contener el **contrato**, no todos los datos de todos los clientes:

```ts
interface AppManifest {
  id: string;
  displayName: string;
  defaultLocale: string;
  supportedLocales: readonly string[];
  legal: { privacyUrl: string; termsUrl: string };
  capabilities: Readonly<Record<string, boolean>>;
}
```

Cada app suministra y valida su instancia. Puede alimentar metadata, navegación, theming, consentimiento y generadores. No debe contener secretos, credenciales ni lógica de autorización.

### 5. `@repo/observability`

Debe ofrecer una API pequeña y neutral:

- `createLogger` con redacción de secretos y datos personales.
- IDs de correlación.
- Captura normalizada de excepciones.
- Spans/métricas con adaptadores configurados por la app.
- Entradas explícitas `browser`, `node` y, si se usa, `edge`.

OpenTelemetry ofrece APIs/SDK de JavaScript para navegador y Node; actualmente trazas y métricas figuran como estables y logs como en desarrollo ([documentación JS](https://opentelemetry.io/docs/languages/js), [instrumentación](https://opentelemetry.io/docs/languages/js/instrumentation)). Una combinación razonable es contrato propio + OpenTelemetry para trazas/métricas + logger estructurado; Sentry u otro proveedor puede ser un adaptador, no una dependencia visible en toda la base de código.

### 6. Generadores de la fábrica

Aunque no sea un paquete consumido en runtime, probablemente aporta más valor que varios paquetes condicionales. Turborepo permite `turbo gen workspace`, copiar workspaces existentes y crear generadores personalizados en `turbo/generators/config.ts` ([guía oficial](https://turborepo.com/docs/guides/generating-code), [referencia](https://turborepo.com/docs/reference/turbo-gen)).

Generadores sugeridos:

- `app-next`: app Next con UI, StyleX, lint, tipos, test y observabilidad.
- `app-vite`: React + Vite con el mismo baseline.
- `package`: paquete JIT o compilado con exports explícitos.
- `component`: componente UI con story y test.
- `integration`: env + adaptador + mocks para un servicio externo.

## Paquetes de datos y backend: opciones

### `@repo/contracts`

Es preferible a un paquete genérico `@repo/types`: debe contener contratos concretos y validables en runtime. Opciones:

- Zod, Valibot o ArkType para esquemas y tipos derivados.
- tRPC/ts-rest cuando cliente y servidor están controlados por el mismo monorepo.
- OpenAPI cuando el contrato debe ser independiente del lenguaje o consumido externamente.

OpenAPI Generator ofrece clientes TypeScript estables para Fetch y Axios ([TypeScript Fetch](https://openapi-generator.tech/docs/generators/typescript-fetch), [TypeScript Axios](https://openapi-generator.tech/docs/generators/typescript-axios)). El cliente generado debería vivir aislado y regenerarse desde la especificación, no editarse manualmente.

### `@repo/auth`, `@repo/db` y `@repo/api`

El patrón está probado por `create-t3-turbo`, que mantiene paquetes separados para API, auth y DB ([fuente](https://github.com/t3-oss/create-t3-turbo)). Aun así, en una fábrica multi-cliente no deben ser globales por defecto.

Opciones de auth:

- Better Auth: framework-agnostic y TypeScript, apropiado si se quiere controlar el backend ([docs](https://www.better-auth.com/docs)).
- Auth.js: especialmente natural en ecosistemas Next.
- Supabase Auth o un proveedor gestionado: si se prioriza velocidad operacional.

Opciones de datos:

- Drizzle, Prisma o Kysely sobre PostgreSQL.
- Supabase si interesa una plataforma integrada de Postgres, Auth, Storage y Realtime ([docs oficiales](https://supabase.com/docs)).

Reglas de frontera:

- `@repo/db` es solo servidor.
- La autorización se comprueba en el servidor, no en componentes UI.
- El cliente importa `contracts`/`api-client`, nunca repositorios o secretos.
- Si dos clientes tienen dominios distintos, deben tener paquetes DB/API distintos aunque usen la misma tecnología.

## Paquetes operativos condicionales

### `@repo/feature-flags`

Útil para rollouts y kill switches. Conviene exponer claves y defaults propios y adaptar un estándar neutral como OpenFeature; el SDK web define una interfaz de proveedor y su SDK React ofrece hooks y proveedores reemplazables ([Web SDK](https://openfeature.dev/docs/reference/technologies/client/web), [React SDK](https://openfeature.dev/docs/reference/technologies/client/web/react)). No debe usarse como sustituto de autorización.

### `@repo/analytics`

Debe compartir la taxonomía de eventos y consentimiento, no propagar directamente el SDK de un proveedor. Ejemplo de exports: `events`, `track`, `identify`, `setConsent`. Separar browser/server y evitar datos personales por defecto.

### `@repo/email`, `@repo/storage`, `@repo/jobs` y `@repo/billing`

Crear cada uno solo después del segundo consumidor real. Sus APIs deben modelar contratos del dominio y encapsular al proveedor. En jobs y webhooks son imprescindibles claves de idempotencia, reintentos acotados y observabilidad.

## Qué no crearía ahora

- `@repo/shared`: terminaría mezclando responsabilidades.
- `@repo/utils`: salvo que tenga utilidades concretas y estables; es preferible `@repo/money`, `@repo/dates` o mantener la función local.
- `@repo/types`: los tipos deben vivir junto a su contrato canónico; para datos externos se necesitan esquemas runtime, no solo TypeScript.
- `@repo/hooks`: un hook debe vivir con la capacidad que implementa (`ui`, `auth`, `analytics`, etc.).
- Un único `@repo/config` que mezcle ESLint, TypeScript, StyleX, tests y configuración de producto.
- `auth`, `db`, `payments` o `ai` “por si acaso”. Añaden coste, decisiones prematuras y acoplamiento.

## Plan recomendado para este repositorio

### Fase 1: camino estándar de la fábrica

1. Hacer que Next y Vite consuman realmente los presets compartidos de ESLint y TypeScript.
2. Extraer la duplicación StyleX a `@repo/stylex-config`.
3. Añadir `@repo/testing` y scripts `test`/`check-types` uniformes.
4. Crear `apps/storybook` para documentar y probar `@repo/ui`.
5. Añadir `@repo/env`, `@repo/app-manifest` y `@repo/observability` con exports por runtime.
6. Crear generadores `app-next`, `app-vite`, `package` y `component`.

### Fase 2: primer producto real

1. Definir `@repo/contracts`.
2. Elegir `@repo/api-client` generado/tipado.
3. Añadir `@repo/auth` y `@repo/db` solo si el producto lo exige.
4. Incorporar pruebas de integración y E2E por app.

### Fase 3: capacidades reutilizadas

Añadir i18n, analytics, feature flags, email, storage, jobs, billing o AI únicamente cuando haya un contrato estable y al menos dos consumidores previsibles.

## Criterio de extracción

Una pieza debería convertirse en paquete cuando cumpla la mayoría de estas condiciones:

- Tiene al menos dos consumidores reales o es una política transversal obligatoria.
- Posee un contrato público pequeño y estable.
- Puede probarse y versionarse conceptualmente de forma independiente.
- Sus dependencias y runtime están claros.
- Reduce duplicación significativa o evita inconsistencias de seguridad/calidad.

Debe permanecer local cuando solo sirve a una app, cambia al ritmo de una pantalla concreta o necesita importar internals del producto.

## Conclusión

Los siguientes paquetes más valiosos para **esta** fábrica son `@repo/stylex-config`, `@repo/testing`, `@repo/env`, `@repo/app-manifest` y `@repo/observability`, acompañados por generadores de Turbo. `contracts` y `api-client` forman la siguiente capa. Auth, DB y capacidades SaaS deben ser verticales optativas, no parte obligatoria de toda app.

La arquitectura objetivo no es “compartir todo”, sino proporcionar un camino estándar rápido y seguro, con límites que permitan a cada app seguir siendo compilable, comprobable y desplegable de forma independiente.
