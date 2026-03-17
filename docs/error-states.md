# Estados de Error — TeamBuilder v0.1
**Tomás · QA Engineer**

Cada error tiene: mensaje con personalidad, acción disponible y severidad.

---

## 1. ERRORES DE API / MODELO

### API Timeout (> 10 segundos sin respuesta)
```
Severidad: Media
Mensaje:   "El agente tardó demasiado. Reintentando..."
Acción:    Auto-retry x3 con backoff exponencial (1s, 2s, 4s)
UI:        Spinner en el avatar del agente activo
Post-retry: Si falla → mostrar error de API genérico
```

### API Error (500, 503)
```
Severidad: Alta
Mensaje:   "Algo salió mal. Rodrigo lo está revisando."
Acción:    Botón "Reintentar" + botón "Reportar problema"
UI:        Card de error en el chat, avatar de Rodrigo parpadeando
```

### Rate Limit (429)
```
Severidad: Media
Mensaje:   "Demasiadas consultas seguidas. Esperá un momento."
Acción:    Countdown automático + retry cuando libera
UI:        Barra de progreso del cooldown
```

### Sin API Key
```
Severidad: Crítica
Mensaje:   "No hay clave de API configurada."
Acción:    Redirect a configuración / onboarding de BYOK
UI:        Modal bloqueante
```

---

## 2. ERRORES DE CONEXIÓN

### Sin internet
```
Severidad: Alta
Mensaje:   "Perdiste la conexión. Los agentes esperan que vuelvas."
Acción:    Auto-reconexión cada 5 segundos
UI:        Banner superior persistente + indicador en avatares
Post-reconexión: "De vuelta online. El equipo está listo." (auto-dismiss 3s)
```

### Conexión inestable
```
Severidad: Baja
Mensaje:   "Conexión inestable. Los mensajes pueden tardar."
Acción:    Ninguna requerida — informativo
UI:        Indicador sutil en el input
```

---

## 3. LÍMITES DE PLAN

### Límite de agentes (free: 5)
```
Severidad: Baja (esperado)
Trigger:   Al intentar agregar el agente 6
Mensaje:   "Tu plan free permite hasta 5 agentes.
            Con PRO podés convocar hasta 12."
Acción:    [Upgradear] [Cerrar]
UI:        Modal centrado con preview del plan PRO
```

### Límite de mensajes (free: 20/sesión)
```
Severidad: Baja — warning progresivo
Trigger 1: Mensaje 17 → "Te quedan 3 mensajes en esta sesión."
Trigger 2: Mensaje 19 → "Último mensaje disponible. PRO es ilimitado."
Trigger 3: Mensaje 21 → Input bloqueado + modal de upgrade
UI:        Contador visible en el input
```

### Límite de sesiones (free: 3 cada 30 min)
```
Severidad: Media
Trigger:   Al intentar abrir sesión 4 antes del reset
Mensaje:   "Usaste tus 3 sesiones de esta ventana.
            Próximo reset en XX:XX ⏱
            O pasate a PRO y olvidate del límite."
Acción:    [Upgradear] [Esperar — countdown visible]
UI:        Modal con countdown en tiempo real
```

### Audio bloqueado (free)
```
Severidad: Baja
Trigger:   Al activar voces
Mensaje:   "Las voces de los agentes son función PRO."
Acción:    [Ver planes] [Cerrar]
```

### Reunión grupal bloqueada (free: máx 3 agentes)
```
Severidad: Baja
Trigger:   Al convocar reunión con +3 agentes en free
Mensaje:   "Las reuniones completas son función PRO."
Acción:    [Ver planes] [Reunión con 3 agentes]
```

---

## 4. ERRORES DE STORAGE

### localStorage lleno
```
Severidad: Alta
Mensaje:   "No pudimos guardar tu sesión. Tu progreso puede perderse."
Acción:    [Limpiar memoria antigua] [Continuar sin guardar]
UI:        Banner naranja (warning, no rojo — no es un error fatal)
```

### Memoria corrupta
```
Severidad: Alta
Mensaje:   "Encontramos un problema con tu memoria guardada.
            Podemos resetearla sin perder tu equipo."
Acción:    [Resetear memoria] [Exportar datos primero]
UI:        Modal bloqueante con opciones claras
```

### Sesión expirada
```
Severidad: Media
Trigger:   Token de sesión inválido
Mensaje:   "Tu sesión expiró. Volvé a entrar para continuar."
Acción:    [Volver a entrar] → flujo de login/onboarding
UI:        Modal centrado
```

---

## 5. ESTADOS VACÍOS (no son errores, pero los documento acá)

### Mi Equipo vacío
```
Título:      "Tu equipo todavía no existe."
Descripción: "Elegí al menos un agente para empezar."
Acción:      [Explorar agentes]
Ilustración: Avatar placeholder con signo de pregunta
```

### Chat sin mensajes
```
Título:      "El equipo está listo. Vos arrancás."
Descripción: "Escribile a Rodrigo o invocá a quien necesites con @Nombre."
Acción:      Ninguna — placeholder en input
```

### Catálogo sin resultados (filtro sin match)
```
Título:      "No hay agentes en esta categoría."
Descripción: "Probá con otro filtro."
Acción:      [Ver todos]
```

### Banco vacío (todos activados)
```
Título:      "El banco está vacío — todos están activos."
Descripción: "Eso significa que armaste un equipo muy completo."
Acción:      Ninguna
```

---

## 6. ERRORES DE FORMULARIO (modo SCOUT)

### Diagnóstico sin completar
```
Trigger:   Intentar continuar sin responder
Mensaje:   "Elegí una opción o seleccioná 'No lo sé aún'."
UI:        Highlight sutil en la pregunta sin responder
```

### Banco — justificación vacía
```
Trigger:   Intentar activar agente sin escribir justificación
Mensaje:   "Una línea es suficiente. ¿Por qué lo necesitás?"
UI:        Input con borde rojo + mensaje debajo
```

---

## Reglas Generales

1. **Nunca mostrar códigos de error al usuario** (no "Error 500" — sí "Algo salió mal")
2. **Siempre ofrecer una acción** — el usuario nunca queda bloqueado sin salida
3. **Errores graves = modal** · **Errores leves = inline o banner**
4. **Tono de voz consistente** — los errores son de Ramiro, no del sistema
5. **Auto-dismiss** solo en mensajes informativos (3 segundos) — nunca en errores graves
