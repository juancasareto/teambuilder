# Arquitectura de Información — TeamBuilder v0.1
**Isabella · Information Architect**

---

## Mapa de Navegación

```
/                         → Bienvenida (FORGE / SCOUT)
├── /forge                → Catálogo directo (modo FORGE)
├── /scout                → Diagnóstico 5 preguntas
│   └── /scout/propuesta  → Equipo recomendado
├── /catalogo             → Catálogo + Banco (un flujo)
│   └── /catalogo/:id     → Perfil de agente
├── /equipo               → Mi Equipo
│   └── /equipo/chat      → Deck principal (chat)
└── /planes               → Planes y upgrade

```

---

## Jerarquía por Pantalla

### 1. BIENVENIDA `/`
```
H1: Titular ("Tu proyecto está sin equipo.")
H2: Subtítulo ("Construyámoslo.")
─────────────────
[FORGE card]          [SCOUT card]
  Título                Título
  Tagline               Tagline
  Descripción           Descripción
  CTA primario          CTA primario
```
**Primario:** Elección de modo
**Secundario:** Entender la diferencia entre modos

---

### 2. DIAGNÓSTICO `/scout`
```
Progress bar (pregunta X de 5)
─────────────────
H2: Pregunta actual
Grid de opciones (2x2)
  [Opción A]  [Opción B]
  [Opción C]  [No lo sé aún]
─────────────────
[Anterior]        [Siguiente →]
```
**Primario:** Responder la pregunta
**Secundario:** Ver progreso, volver atrás

---

### 3. PROPUESTA `/scout/propuesta`
```
H1: "Tu equipo recomendado"
H2: Subtítulo explicativo
─────────────────
Grid de AgentCards recomendadas (con % match)
─────────────────
[Armar este equipo]  [Personalizar]  [Ver todos]
```
**Primario:** Aceptar el equipo
**Secundario:** Personalizar o explorar

---

### 4. CATÁLOGO `/catalogo`
```
H1: "Todos los agentes"
Filtros de categoría (tabs horizontales)
─────────────────
Grid de AgentCards (activos — color normal)

── Separador: "Agentes durmiendo" ──────────────

Grid de AgentCards (banco — opacidad reducida, blur sutil)
─────────────────
```
**Primario:** Explorar y agregar agentes
**Secundario:** Filtrar por categoría, ver banco

**Nota Isabella:** Los agentes del banco no están en otra pantalla
— están en el mismo flujo, visualmente diferenciados.

---

### 5. PERFIL DE AGENTE `/catalogo/:id`
```
← Volver al catálogo
─────────────────
[Avatar grande]
Emoji + Nombre
Rol / Categoría (badge)
Descripción completa
─────────────────
"Voz del agente"
[Frase 1]  [Frase 2]  [Frase 3]
─────────────────
"Invocar con"
@Nombre · "Pasame con Nombre"
─────────────────
"Ejemplos de uso"
1. Caso → qué hace
2. Caso → qué hace
─────────────────
"Skills instalados"
[skill 1 — npx skillsadd...]  [copiar]
[skill 2 — npx skillsadd...]  [copiar]
[Copiar todos los comandos]
─────────────────
[Agregar al equipo]  /  [Quitar del equipo]
```
**Primario:** Agregar/quitar del equipo
**Secundario:** Entender el agente, copiar skills

---

### 6. MI EQUIPO `/equipo`
```
H1: Nombre del equipo generado
─────────────────
Grid de AgentCards del equipo (compactas)
  Rodrigo siempre primero
─────────────────
[Convocar al equipo →]  [Editar equipo]

── Estado vacío ──────────────────────────────
"Tu equipo todavía no existe."
"Elegí al menos un agente para empezar."
[Explorar agentes]
```
**Primario:** Ir al chat / convocar
**Secundario:** Editar composición del equipo

---

### 7. DECK PRINCIPAL `/equipo/chat`
```
┌──────────────────────────────────────────────┐
│ PANEL IZQUIERDO (280px)   │  ÁREA DE CHAT    │
│                           │                  │
│ [Logo · Nombre proyecto]  │  [mensajes]      │
│                           │                  │
│ Rodrigo  ● blanco         │  [👍 3] [👎 0]   │
│ Facundo  ● gris           │                  │
│ Matías   ● verde ✋        │  [mensajes]      │
│ Santiago ● gris           │                  │
│ Lucía    ● gris           │  [👍 1] [👎 0]   │
│                           │                  │
│ [+ Agregar agente]        │  ──────────────  │
│                           │  [input mensaje] │
│ ────────────────          │  [enviar]        │
│ [⚡ Convocar reunión]     │                  │
│ [📋 Mi equipo]            │                  │
│ [👤 Planes]               │                  │
└──────────────────────────────────────────────┘
```
**Primario:** Escribir y leer mensajes del chat
**Secundario:** Gestionar equipo, convocar reunión

---

## Flujos de Navegación

### Flujo FORGE
```
/ → selecciona FORGE → /catalogo → /catalogo/:id → /equipo → /equipo/chat
```

### Flujo SCOUT
```
/ → selecciona SCOUT → /scout → /scout/propuesta → /equipo → /equipo/chat
```

### Flujo de Upgrade
```
[Cualquier pantalla] → trigger de límite → modal de upgrade → /planes → vuelta al flujo
```

---

## Notas de Navegación

- **Rodrigo siempre en el panel izquierdo** — no se puede quitar del panel, solo excluir temporalmente del chat
- **Back navigation:** cada pantalla tiene ruta de vuelta clara
- **Estado persistente:** el equipo se mantiene entre sesiones (memoria localStorage)
- **Modal vs. página:** el perfil de agente puede ser modal (overlay) o página — Santiago decide según performance
