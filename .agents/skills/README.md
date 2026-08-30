# Skills locales del repositorio

Este directorio contiene skills específicas de la fábrica de aplicaciones. Los agentes compatibles deben descubrirlas y cargar sus instrucciones bajo demanda cuando la descripción de una skill coincida con la tarea solicitada.

## Estructura

Cada skill debe vivir en su propio directorio y contener un archivo `SKILL.md`:

```text
.agents/skills/
└── nombre-de-la-skill/
    ├── SKILL.md
    ├── scripts/       # Opcional
    ├── references/    # Opcional
    └── assets/        # Opcional
```

## Plantilla mínima

```md
---
name: nombre-de-la-skill
description: Explica qué hace y en qué situaciones debe cargarse.
---

# Nombre de la skill

## Objetivo

Describe el resultado esperado.

## Flujo de trabajo

1. Inspecciona el contexto necesario.
2. Ejecuta los pasos de la skill.
3. Valida el resultado.
```

## Convenciones

- Usa nombres en minúsculas, con números o guiones, de un máximo de 64 caracteres.
- Haz que el nombre del directorio coincida con el campo `name`.
- Escribe una `description` específica: determina cuándo el agente cargará la skill.
- Mantén `SKILL.md` conciso y mueve documentación extensa a `references/`.
- Usa rutas relativas al directorio de la skill para scripts, referencias y recursos.
- No incluyas secretos ni credenciales.
- Revisa cualquier script antes de ejecutarlo y documenta sus requisitos y efectos.
- Evita duplicar reglas globales de `AGENTS.md`; referencia ese archivo cuando sea necesario.

Una skill no será detectable hasta que exista su correspondiente `SKILL.md` con frontmatter válido.
