---
name: grilling
description: Entrevista al usuario por rondas para recorrer todo el árbol de decisiones de un plan, una issue o una idea antes de actuar.
---

# Grilling

Entrevista al usuario sin dejar supuestos silenciosos hasta alcanzar un entendimiento compartido. Modela la conversación como un **árbol de diseño**: cada decisión desbloquea decisiones dependientes.

## Rondas y frontier

La **frontier** contiene todas las decisiones cuyos prerrequisitos ya están resueltos. En cada ronda:

1. Recalcula la frontier.
2. Pregunta todas sus decisiones en un único mensaje.
3. Numera cada pregunta y ofrece una recomendación concreta.
4. Espera las respuestas antes de abrir ramas dependientes.

Usa este formato:

```md
❓ **Q1** - **<título>**: <pregunta, contexto y opciones>

➡️ <recomendación>

---

❓ **Q2** - **<título>**: <pregunta>

➡️ <recomendación>
```

Una pregunta cuya respuesta dependa de otra todavía abierta pertenece a una ronda posterior.

## Responsabilidades

- Buscar hechos es responsabilidad del agente. Inspecciona filesystem, Git, configuración, documentación y herramientas disponibles; no preguntes al usuario algo verificable.
- Las decisiones pertenecen al usuario. No conviertas una recomendación en decisión sin su aceptación.
- Cada respuesta puede cambiar el árbol: vuelve a calcular la frontier, no continúes con una lista prefabricada.
- Si aparece una contradicción, hazla explícita y resuélvela antes de avanzar.

La sesión termina solo cuando la frontier está vacía. Resume el entendimiento compartido y solicita confirmación final. No implementes ni escribas el artefacto resultante antes de esa confirmación.
