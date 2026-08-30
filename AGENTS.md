# AGENTS.md

## Contexto del repositorio

Este repositorio es un **Turborepo** que funciona como una fábrica de aplicaciones creadas mediante *vibecoding*. Su propósito es permitir construir y evolucionar múltiples aplicaciones con rapidez, sin sacrificar consistencia, mantenibilidad, seguridad ni calidad de ingeniería.

Este archivo contiene las instrucciones globales para cualquier agente que trabaje en el monorepo. Las instrucciones de un `AGENTS.md` ubicado dentro de una aplicación o paquete pueden especializar estas reglas para ese ámbito, pero no deben contradecirlas sin una justificación explícita.

## Estructura general

- `apps/`: aplicaciones ejecutables y desplegables.
- `packages/`: código, componentes y configuraciones compartidas.
- `packages/ui`: sistema de interfaz compartido.
- `packages/eslint-config`: configuración común de ESLint.
- `packages/typescript-config`: configuración común de TypeScript.
- `turbo.json`: definición de tareas y caché del monorepo.
- `pnpm-workspace.yaml`: definición del workspace.

## Principios de trabajo

1. **Entender antes de modificar.** Inspecciona la aplicación, sus dependencias y los patrones existentes antes de escribir código.
2. **Cambios mínimos y enfocados.** Resuelve la petición sin refactorizaciones o dependencias no relacionadas.
3. **Consistencia antes que preferencia personal.** Sigue los patrones existentes mientras sean correctos y seguros.
4. **Reutilización con criterio.** Comparte código cuando exista una necesidad real en más de una aplicación; evita abstracciones prematuras.
5. **Calidad verificable.** No des por terminado un cambio sin ejecutar las comprobaciones relevantes.
6. **Decisiones explícitas.** Documenta supuestos, limitaciones y decisiones arquitectónicas importantes.

## Gestión del monorepo

- Usa exclusivamente **pnpm** para instalar dependencias y ejecutar scripts.
- Ejecuta las tareas globales mediante Turbo desde la raíz siempre que sea posible.
- Usa filtros de pnpm o Turbo para limitar las comprobaciones a los paquetes afectados durante el desarrollo.
- No edites manualmente `pnpm-lock.yaml`; debe actualizarse mediante pnpm.
- No modifiques artefactos generados como `node_modules/`, `.next/`, `dist/`, cobertura o cachés de Turbo.
- Instala una dependencia en el paquete que realmente la utiliza; no la añadas a la raíz por comodidad.
- Mantén las dependencias compartidas y sus versiones coherentes con los catálogos del workspace cuando corresponda.
- Respeta los límites entre aplicaciones: una aplicación no debe importar directamente archivos internos de otra.
- El código compartido debe exponerse mediante un paquete de `packages/` con una API pública clara.

## Arquitectura y organización

- Cada aplicación debe poder desarrollarse, comprobarse, compilarse y desplegarse de forma independiente.
- Separa presentación, lógica de negocio, acceso a datos e integraciones externas cuando la complejidad lo justifique.
- Mantén la lógica de dominio fuera de componentes visuales y controladores de infraestructura.
- Evita módulos globales con estado mutable y dependencias ocultas.
- Prefiere composición sobre jerarquías complejas o abstracciones rígidas.
- No dupliques componentes, utilidades o configuraciones que pertenezcan claramente a un paquete compartido.
- No conviertas código específico de una aplicación en código compartido hasta que su contrato sea estable y reutilizable.
- Conserva APIs públicas pequeñas, explícitas y documentadas.
- Evita dependencias circulares entre paquetes.

## TypeScript

- Todo código nuevo debe usar TypeScript salvo que la herramienta exija otro formato.
- Mantén el modo estricto y no reduzcas las garantías del compilador.
- Evita `any`, aserciones inseguras y `@ts-ignore`. Si son imprescindibles, limita su alcance y documenta el motivo.
- Define tipos en los límites del sistema: entradas, respuestas, variables de entorno, almacenamiento y APIs externas.
- Valida en tiempo de ejecución toda información que provenga de usuarios, red, archivos o servicios externos.
- Prefiere inferencia para detalles internos y tipos explícitos para contratos públicos.
- Modela estados inválidos para que sean difíciles de representar.
- No dupliques manualmente tipos que puedan derivarse de esquemas o fuentes canónicas.

## React y aplicaciones web

- Mantén los componentes pequeños, accesibles y con una responsabilidad clara.
- Prefiere componentes de servidor cuando el framework los soporte; usa código cliente solo cuando necesites interacción, estado o APIs del navegador.
- Evita efectos para datos o cálculos que puedan resolverse declarativamente.
- No almacenes en estado valores que puedan derivarse de props u otro estado.
- Mantén las operaciones sensibles y los secretos exclusivamente en el servidor.
- Usa el sistema de diseño compartido antes de crear variantes locales equivalentes.
- Diseña las interfaces para estados de carga, vacío, error y éxito.
- No introduzcas estilos globales para resolver necesidades locales.

## Diseño y experiencia de usuario

- Las aplicaciones deben conservar una identidad visual coherente mediante tokens, temas y componentes compartidos.
- Evita valores visuales arbitrarios cuando exista un token equivalente.
- Toda interfaz debe ser usable con teclado y tecnologías de asistencia.
- Usa HTML semántico, etiquetas accesibles y un orden de foco predecible.
- Mantén contraste suficiente y no comuniques información únicamente mediante color.
- Diseña primero para pantallas pequeñas y verifica los puntos de ruptura relevantes.
- Evita saltos de diseño, bloqueos innecesarios y animaciones que ignoren preferencias de movimiento reducido.
- Los textos visibles deben ser claros, consistentes y estar preparados para internacionalización cuando el producto la requiera.

## Datos, APIs y seguridad

- Nunca incluyas secretos, credenciales, tokens o datos personales en el repositorio, logs o código cliente.
- Declara las variables de entorno requeridas en un archivo de ejemplo sin valores sensibles.
- Valida y normaliza entradas en el límite de confianza.
- Aplica autorización en el servidor para cada operación protegida; ocultar controles en la interfaz no es autorización.
- Usa consultas parametrizadas y APIs seguras frente a inyección.
- Devuelve errores útiles sin exponer detalles internos o información sensible.
- Añade límites, paginación y control de reintentos cuando una integración pueda consumir recursos sin límite.
- Trata servicios externos como dependencias no confiables: contempla errores, latencia, respuestas incompletas e idempotencia.
- Recopila únicamente los datos necesarios y evita registrar información sensible.

## Rendimiento

- No optimices sin evidencia, pero evita regresiones obvias.
- Reduce JavaScript cliente, dependencias pesadas y trabajo duplicado.
- Carga de forma diferida recursos no críticos cuando sea apropiado.
- Optimiza imágenes, fuentes y recursos estáticos usando las herramientas del framework.
- Evita solicitudes en cascada y consultas repetitivas.
- Usa caché solo con una estrategia explícita de frescura e invalidación.
- Mide el impacto antes de introducir complejidad orientada al rendimiento.

## Pruebas y verificación

- Los cambios de comportamiento deben incluir o actualizar pruebas cuando exista infraestructura de pruebas.
- Para errores, añade una prueba de regresión siempre que sea viable.
- Prioriza pruebas de comportamiento observable sobre detalles internos de implementación.
- No elimines, omitas o debilites pruebas para conseguir que una tarea pase.
- Antes de finalizar, ejecuta las comprobaciones aplicables desde la raíz o con un filtro apropiado:

```bash
pnpm lint
pnpm check-types
pnpm build
```

- Ejecuta también las pruebas específicas del paquete si dispone de un script de pruebas.
- Si una comprobación no puede ejecutarse, informa cuál, por qué y qué riesgo queda pendiente.

## Dependencias

- Antes de añadir una librería, comprueba si la necesidad puede resolverse con la plataforma, el framework o una dependencia existente.
- Justifica dependencias nuevas, especialmente las de ejecución.
- Prefiere paquetes mantenidos, tipados, con licencias compatibles y un impacto razonable en el bundle.
- No cambies versiones mayores ni reemplaces herramientas sin una petición o justificación explícita.
- Elimina dependencias que dejen de utilizarse como consecuencia directa del cambio.

## Documentación

- Actualiza README, ejemplos y archivos de entorno cuando cambien instalación, comandos, configuración o comportamiento público.
- Los comentarios deben explicar decisiones y restricciones, no repetir el código.
- Documenta contratos compartidos y decisiones difíciles cerca de su implementación.
- No mantengas documentación especulativa ni instrucciones que no correspondan al estado real del repositorio.

## Flujo esperado para agentes

1. Lee este archivo y cualquier `AGENTS.md` más cercano a los archivos que vas a modificar.
2. Revisa las skills disponibles en `.agents/skills/` y carga el `SKILL.md` cuya descripción coincida con la tarea. No cargues skills no relacionadas.
3. Revisa `package.json`, configuración y código relacionado antes de proponer cambios.
4. Comprueba el estado del repositorio y respeta el trabajo existente del usuario.
5. Define el alcance mínimo y detecta qué aplicaciones o paquetes resultarán afectados.
6. Implementa siguiendo los patrones y contratos existentes.
7. Añade o actualiza pruebas y documentación cuando corresponda.
8. Ejecuta lint, comprobación de tipos, pruebas y build en el alcance adecuado.
9. Resume los archivos modificados, las decisiones relevantes y las verificaciones realizadas.

## Restricciones

- No sobrescribas ni reviertas cambios del usuario que no formen parte de la petición.
- No ejecutes comandos destructivos, migraciones irreversibles o despliegues sin autorización explícita.
- No realices cambios masivos de formato fuera del alcance solicitado.
- No desactives reglas de lint, TypeScript, seguridad o accesibilidad para ocultar problemas.
- No inventes APIs, variables de entorno, tablas, rutas o capacidades de librerías; verifícalas primero.
- No afirmes que una comprobación pasó si no fue ejecutada correctamente.
- No introduzcas compatibilidad heredada, capas de abstracción o funcionalidades adicionales sin una necesidad concreta.
- No expongas detalles internos del razonamiento; comunica conclusiones, decisiones y resultados comprobables.
