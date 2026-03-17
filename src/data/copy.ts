// ============================================================
// TEAMBUILDER — Copy completo de la app
// Ramiro + Lucía · v0.1
// Narrativa: 3 actos — Problema · Convocatoria · Resolución
// ============================================================

export const copy = {

  // ── PANTALLA 1: BIENVENIDA ────────────────────────────────
  welcome: {
    headline: 'Tu proyecto está sin equipo.',
    subheadline: 'Construyámoslo.',
    description: 'Cada proyecto necesita el equipo correcto.\nEl tuyo todavía no existe.',
    modes: {
      forge: {
        title: 'FORGE',
        tagline: 'Elegís vos, cada agente. Luego nos contás el proyecto.',
        description: 'Para quienes ya saben lo que necesitan.',
        cta: 'Armar mi equipo',
      },
      scout: {
        title: 'SCOUT',
        tagline: 'Contanos el proyecto. Nosotros armamos el equipo.',
        description: 'Para quienes quieren que el sistema los guíe.',
        cta: 'Empezar diagnóstico',
      },
    },
  },

  // ── PANTALLA 2: DIAGNÓSTICO (SCOUT) ──────────────────────
  diagnostic: {
    headline: 'Contanos el proyecto',
    subheadline: 'Cinco preguntas. Sin presión.',
    unknownOption: 'No lo sé aún',
    progress: (current: number, total: number) => `${current} de ${total}`,
    cta: 'Ver mi equipo recomendado',
    questions: [
      {
        id: 'q1',
        question: '¿Qué querés lograr con este proyecto?',
        options: [
          'Lanzar un producto o servicio',
          'Hacer crecer algo que ya existe',
          'Resolver un problema interno',
          'Explorar una idea nueva',
        ],
        tags: ['producto', 'growth', 'interno', 'exploracion'],
      },
      {
        id: 'q2',
        question: '¿Cuál es el mayor obstáculo que enfrentás hoy?',
        options: [
          'No sé por dónde empezar',
          'Falta de tiempo o recursos',
          'Problema técnico complejo',
          'Necesito llegar a más gente',
        ],
        tags: ['estrategia', 'recursos', 'tecnico', 'marketing'],
      },
      {
        id: 'q3',
        question: '¿En qué etapa está el proyecto?',
        options: [
          'Es solo una idea todavía',
          'Tengo algo básico funcionando',
          'Ya hay usuarios pero quiero escalar',
          'Es un proyecto establecido',
        ],
        tags: ['idea', 'mvp', 'escala', 'establecido'],
      },
      {
        id: 'q4',
        question: '¿Qué área necesita más atención ahora mismo?',
        options: [
          'El producto / tecnología',
          'El diseño / experiencia',
          'El marketing / comunicación',
          'La estrategia / planificación',
        ],
        tags: ['tecnico', 'diseno', 'marketing', 'estrategia'],
      },
      {
        id: 'q5',
        question: '¿Cómo te gustaría trabajar con el equipo?',
        options: [
          'Que me guíen paso a paso',
          'Que ejecuten y yo reviso',
          'Que debatamos juntos las decisiones',
          'Que sean un sounding board',
        ],
        tags: ['guia', 'ejecucion', 'colaboracion', 'consulta'],
      },
    ],
  },

  // ── PANTALLA 3: PROPUESTA ─────────────────────────────────
  proposal: {
    headline: 'Tu equipo recomendado',
    subheadline: 'Basado en lo que nos contaste, estos son los agentes indicados.',
    matchLabel: 'match',
    cta: {
      accept: 'Armar este equipo',
      customize: 'Personalizar',
      explore: 'Ver todos los agentes',
    },
  },

  // ── PANTALLA 4: CATÁLOGO ──────────────────────────────────
  catalog: {
    headline: 'Todos los agentes',
    subheadline: 'Encontrá el perfil que necesita tu proyecto.',
    filters: {
      all: 'Todos',
      estrategico: 'Estratégicos',
      tecnico: 'Técnicos',
      creativo: 'Creativos',
      datos: 'Datos',
      social: 'Social',
      diseno: 'Diseño',
      seguridad: 'Seguridad',
    },
    emptyState: {
      title: 'No hay agentes en esta categoría',
      description: 'Probá con otro filtro.',
    },
    bankSection: 'Agentes durmiendo',
    bankDescription: 'Están disponibles, pero necesitás despertarlos.',
  },

  // ── PANTALLA 5: EL BANCO ──────────────────────────────────
  bank: {
    headline: 'El Banco',
    subheadline: 'Agentes dormidos. Cada uno tiene lo que tu proyecto puede necesitar.',
    activatePrompt: '¿Por qué necesitás a este agente?',
    activatePlaceholder: 'Una línea es suficiente...',
    activateCta: 'Despertar agente',
    activateCancel: 'Cancelar',
    sleepingLabel: 'Durmiendo',
  },

  // ── PANTALLA 6: PERFIL DE AGENTE ─────────────────────────
  agentProfile: {
    skillsTitle: 'Skills instalados',
    copyAllCta: 'Copiar todos los comandos',
    copiedFeedback: 'Copiado ✓',
    addToTeamCta: 'Agregar al equipo',
    removeFromTeamCta: 'Quitar del equipo',
    invokeLabel: 'Invocar con',
    examplesLabel: 'Ejemplos de uso',
    voiceLabel: 'Voz del agente',
  },

  // ── PANTALLA 7: MI EQUIPO ─────────────────────────────────
  myTeam: {
    emptyState: {
      title: 'Tu equipo todavía no existe.',
      description: 'Elegí al menos un agente para empezar.',
      cta: 'Explorar agentes',
    },
    teamReady: '¿Listo para arrancar?',
    startCta: 'Convocar al equipo',
    editCta: 'Editar equipo',
    maxAgentsReached: (max: number) => `Tu plan permite hasta ${max} agentes simultáneos.`,
  },

  // ── DECK PRINCIPAL — CHAT ─────────────────────────────────
  chat: {
    defaultPlaceholder: 'Escribile a Rodrigo...',
    mentionPlaceholder: (name: string) => `Mencionaste a ${name}. Escribí tu mensaje...`,
    meetingPlaceholder: 'Reunión en curso. Todos están escuchando...',
    convokeCta: 'Convocar reunión',
    convokeActive: 'Reunión activa',
    dismissMeeting: 'Terminar reunión',
    raisingHandLabel: 'tiene algo para decir',
    likeLabel: 'Me sirve',
    dislikeLabel: 'No me convence',
    pmAlwaysActive: 'Rodrigo siempre está. Podés excluirlo si querés hablar con el equipo.',
    excludePM: 'Excluir a Rodrigo',
    includePM: 'Incluir a Rodrigo',
  },

  // ── ESTADOS DE ERROR ─────────────────────────────────────
  errors: {
    apiTimeout: 'El agente tardó demasiado. Reintentando...',
    apiError: 'Algo salió mal. Rodrigo lo está revisando.',
    noConnection: 'Perdiste la conexión. Los agentes esperan que vuelvas.',
    storageError: 'No pudimos guardar tu sesión. Tu progreso puede perderse.',
    sessionExpired: 'Tu sesión expiró. Volvé a entrar para continuar.',
    generic: 'Algo no funcionó. Intentá de nuevo.',
  },

  // ── LÍMITES Y UPGRADE ─────────────────────────────────────
  upgrade: {
    maxAgents: (max: number) =>
      `Tu plan free permite hasta ${max} agentes. Con PRO podés convocar hasta 12.`,
    maxMessages: `Te quedan 2 mensajes en esta sesión. PRO tiene sesiones ilimitadas.`,
    maxSessions: (minutes: number) =>
      `Usaste tus 3 sesiones de esta ventana. Próximo reset en ${minutes} min.`,
    audioLocked: `Las voces de los agentes son una función PRO.`,
    meetingLocked: `Las reuniones grupales completas son PRO.`,
    multiProject: `Múltiples proyectos simultáneos son función Enterprise.`,
    cta: 'Ver planes',
    ctaUpgrade: 'Upgradear ahora',
  },

  // ── PLANES ───────────────────────────────────────────────
  plans: {
    headline: 'Elegí tu plan',
    subheadline: 'Empezá gratis. Escalá cuando lo necesitás.',
    mockPayment: {
      headline: 'Activar plan',
      cardLabel: 'Número de tarjeta',
      cardPlaceholder: '4242 4242 4242 4242',
      cta: 'Activar ahora',
      success: '¡Plan activado! El equipo completo está disponible.',
      disclaimer: 'Esto es una demo. No se procesa ningún pago real.',
    },
  },

  // ── NOMBRES DE EQUIPO ─────────────────────────────────────
  teamNames: {
    prefixes: [
      'El', 'La', 'Los', 'Equipo', 'Comando', 'Fuerza', 'Célula', 'Núcleo'
    ],
    combinations: [
      ['Rodrigo', 'Facundo'] ,
      ['Matías', 'Santiago'],
      ['Bautista', 'Ramiro'],
    ],
    fallback: 'Mi Equipo',
  },
}

export type CopyKeys = typeof copy
