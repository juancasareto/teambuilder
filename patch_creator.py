#!/usr/bin/env python3
"""
Agrega pantalla CREAR AGENTE al artifact HTML.
- [3] CREAR en boot screen
- Form: nombre, rol, descripción libre
- Matching contra 80 skills catalogados
- Output: perfil del agente + skills recomendadas + copiar prompt
"""

import re

ARTIFACT = '/Users/juanchi/Desktop/CODE/TeamBuilder/teambuilder-artifact.html'

# ── 1. SKILLS CATALOG compacto (80 skills con tags para matching) ──────────────
SKILLS_JS = r"""
// ─── SKILLS CATALOG (para CREAR AGENTE) ────────────────────────────────────────
const SKILLS_CAT=[
  {name:"writing-plans",cmd:"npx skillsadd obra/superpowers/writing-plans",desc:"Estructura planes de acción con objetivos, pasos y criterios de éxito",tags:["plan","estrategia","objetivos","gestion","roadmap","pm","proyecto"]},
  {name:"executing-plans",cmd:"npx skillsadd obra/superpowers/executing-plans",desc:"Ejecuta planes paso a paso con seguimiento de progreso",tags:["ejecucion","plan","seguimiento","progreso","tareas","gestion"]},
  {name:"task-planning",cmd:"npx skillsadd supercent-io/skills-template/task-planning",desc:"Descompone objetivos en tareas concretas con prioridades",tags:["tareas","planificacion","prioridades","gestion","backlog","sprint"]},
  {name:"prd",cmd:"npx skillsadd github/awesome-copilot/prd",desc:"Genera Product Requirements Documents completos",tags:["producto","requerimientos","prd","spec","documento","producto"]},
  {name:"subagent-driven-development",cmd:"npx skillsadd obra/superpowers/subagent-driven-development",desc:"Orquesta múltiples subagentes en paralelo",tags:["agentes","orquestacion","multiagente","ia","coordinacion"]},
  {name:"find-skills",cmd:"npx skillsadd vercel-labs/skills/find-skills",desc:"Busca y descubre skills relevantes para cualquier tarea",tags:["skills","busqueda","discovery","herramientas","ecosistema"]},
  {name:"architecture-patterns",cmd:"npx skillsadd wshobson/agents/architecture-patterns",desc:"SOLID, DDD, Clean Architecture, Hexagonal",tags:["arquitectura","patrones","solid","ddd","clean","backend","estructura"]},
  {name:"api-design-principles",cmd:"npx skillsadd wshobson/agents/api-design-principles",desc:"APIs consistentes, versionadas y documentadas",tags:["api","rest","diseño","backend","endpoints","http","contrato"]},
  {name:"database-schema-design",cmd:"npx skillsadd supercent-io/skills-template/database-schema-design",desc:"Diseño de esquemas con normalización, índices y relaciones",tags:["base de datos","sql","schema","relaciones","indices","postgres","mysql"]},
  {name:"technical-writing",cmd:"npx skillsadd supercent-io/skills-template/technical-writing",desc:"Documenta decisiones técnicas, ADRs y arquitectura",tags:["documentacion","tecnica","adr","arquitectura","escritura"]},
  {name:"framework-selection",cmd:"npx skillsadd langchain-ai/langchain-skills",desc:"Compara frameworks y recomienda el correcto",tags:["framework","tecnologia","seleccion","stack","comparacion","evaluacion"]},
  {name:"multi-agent-patterns",cmd:"npx skillsadd muratcankoylan/Agent-Skills-for-Context-Engineering",desc:"Arquitecturas multi-agente: orquestador, peer-to-peer, jerárquico",tags:["multiagente","agentes","orquestacion","ia","arquitectura","patron"]},
  {name:"memory-systems",cmd:"npx skillsadd muratcankoylan/Agent-Skills-for-Context-Engineering",desc:"Diseña sistemas de memoria para agentes IA",tags:["memoria","agentes","ia","contexto","persistencia","long-term"]},
  {name:"nodejs-backend-patterns",cmd:"npx skillsadd wshobson/agents/nodejs-backend-patterns",desc:"Patrones Node.js: middleware, error handling, estructura",tags:["nodejs","backend","javascript","middleware","servidor","api"]},
  {name:"api-design",cmd:"npx skillsadd supercent-io/skills-template/api-design",desc:"APIs REST con validación, errores y contratos claros",tags:["api","rest","backend","validacion","errores","http"]},
  {name:"backend-testing",cmd:"npx skillsadd supercent-io/skills-template/backend-testing",desc:"Unit, integration y contract tests para APIs",tags:["testing","backend","unit","integracion","api","test","qa"]},
  {name:"security-best-practices",cmd:"npx skillsadd supercent-io/skills-template/security-best-practices",desc:"OWASP, autenticación segura, manejo de secretos",tags:["seguridad","owasp","auth","secretos","vulnerabilidades","security"]},
  {name:"langchain-fundamentals",cmd:"npx skillsadd langchain-ai/langchain-skills",desc:"Agentes con LangChain: tools, structured output",tags:["langchain","ia","agentes","llm","python","herramientas"]},
  {name:"langgraph-fundamentals",cmd:"npx skillsadd langchain-ai/langchain-skills",desc:"StateGraph, nodos, edges con LangGraph",tags:["langgraph","ia","grafo","estado","agentes","python"]},
  {name:"langchain-rag",cmd:"npx skillsadd langchain-ai/langchain-skills",desc:"Pipeline RAG: embeddings, vector stores",tags:["rag","embeddings","vectores","ia","documentos","busqueda","langchain"]},
  {name:"frontend-design",cmd:"npx skillsadd anthropics/skills/frontend-design",desc:"Interfaces visuales: tipografía, color, motion, jerarquía",tags:["frontend","diseño","ui","visual","color","tipografia","interfaz"]},
  {name:"vercel-react-best-practices",cmd:"npx skillsadd vercel-labs/agent-skills/vercel-react-best-practices",desc:"57 reglas React/Next.js: bundle, performance, waterfalls",tags:["react","nextjs","frontend","performance","javascript","typescript","vercel"]},
  {name:"tailwind-design-system",cmd:"npx skillsadd wshobson/agents/tailwind-design-system",desc:"Sistema de diseño con Tailwind: tokens, componentes",tags:["tailwind","css","diseño","frontend","componentes","tokens","sistema"]},
  {name:"web-accessibility",cmd:"npx skillsadd supercent-io/skills-template/web-accessibility",desc:"WCAG 2.1: contraste, teclado, ARIA, semántica",tags:["accesibilidad","wcag","aria","frontend","html","teclado","inclusividad"]},
  {name:"shadcn",cmd:"npx skillsadd shadcn/ui/shadcn",desc:"Componentes shadcn/ui: instalación y personalización",tags:["shadcn","ui","componentes","react","frontend","biblioteca"]},
  {name:"composition-patterns",cmd:"npx skillsadd vercel-labs/agent-skills/composition-patterns",desc:"Compound components, context providers, variantes",tags:["react","composicion","patrones","frontend","componentes","typescript"]},
  {name:"react-native-skills",cmd:"npx skillsadd vercel-labs/agent-skills/react-native-skills",desc:"Animaciones y UI en React Native",tags:["react native","mobile","ios","android","animaciones","frontend"]},
  {name:"zustand-stores",cmd:"npx skillsadd microsoft/skills",desc:"Stores Zustand: slices, middleware, persistencia",tags:["zustand","estado","react","frontend","store","javascript"]},
  {name:"react-flow-nodes",cmd:"npx skillsadd microsoft/skills",desc:"Diagramas interactivos con React Flow",tags:["react flow","diagramas","visualizacion","frontend","nodos","grafo"]},
  {name:"test-driven-development",cmd:"npx skillsadd obra/superpowers/test-driven-development",desc:"TDD: red-green-refactor, diseño desde tests",tags:["tdd","testing","tests","qa","calidad","desarrollo"]},
  {name:"webapp-testing",cmd:"npx skillsadd anthropics/skills/webapp-testing",desc:"Testing completo: unit, integration, E2E",tags:["testing","e2e","webapp","qa","selenium","playwright","calidad"]},
  {name:"playwright-best-practices",cmd:"npx skillsadd currents-dev/playwright-best-practices-skill/playwright-best-practices",desc:"E2E con Playwright: selectores, fixtures, CI",tags:["playwright","e2e","testing","automatizacion","ci","qa"]},
  {name:"systematic-debugging",cmd:"npx skillsadd obra/superpowers/systematic-debugging",desc:"Debugging: hipótesis, aislamiento, reproducción mínima",tags:["debugging","errores","bug","qa","diagnostico","testing"]},
  {name:"evaluation",cmd:"npx skillsadd muratcankoylan/Agent-Skills-for-Context-Engineering",desc:"Frameworks de evaluación para sistemas de agentes IA",tags:["evaluacion","agentes","ia","metricas","benchmark","ml"]},
  {name:"ui-ux-pro-max",cmd:"npx skillsadd nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max",desc:"50 estilos UI, 97 paletas, guías para 9 tech stacks",tags:["ui","ux","diseño","paletas","estilos","interfaces","visual"]},
  {name:"canvas-design",cmd:"npx skillsadd anthropics/skills/canvas-design",desc:"Composición visual, espaciado, ritmo tipográfico",tags:["diseño","canvas","composicion","tipografia","visual","arte"]},
  {name:"interface-design",cmd:"npx skillsadd dammyjay93/interface-design/interface-design",desc:"Navegación, formularios, estados vacíos, feedback",tags:["ui","interfaz","ux","navegacion","formularios","feedback","diseño"]},
  {name:"web-design-guidelines",cmd:"npx skillsadd vercel-labs/agent-skills/web-design-guidelines",desc:"100+ reglas de accesibilidad, UX y HTML semántico",tags:["diseño web","reglas","ux","accesibilidad","html","guidelines"]},
  {name:"bencium-innovative-ux-designer",cmd:"npx skillsadd bencium/bencium-claude-code-design-skill/bencium-innovative-ux-designer",desc:"28K+ caracteres UX: design thinking, responsive, motion",tags:["ux","diseño","motion","responsive","design thinking","usuario"]},
  {name:"remotion-best-practices",cmd:"npx skillsadd remotion-dev/skills/remotion-best-practices",desc:"Videos y animaciones con React y Remotion",tags:["video","animacion","remotion","react","multimedia","motion"]},
  {name:"accesslint",cmd:"npx skillsadd accesslint/claude-marketplace",desc:"WCAG 2.1: contraste, refactoring de accesibilidad",tags:["accesibilidad","wcag","contraste","screen reader","inclusividad"]},
  {name:"dark-ui-design",cmd:"npx skillsadd microsoft/skills",desc:"Dark mode: colores, elevación, opacidad",tags:["dark mode","ui","diseño","colores","temas","frontend"]},
  {name:"mcp-builder",cmd:"npx skillsadd anthropics/skills/mcp-builder",desc:"Construye MCP servers para conectar Claude con APIs",tags:["mcp","integracion","api","claude","servidor","herramientas","claude code"]},
  {name:"better-auth-best-practices",cmd:"npx skillsadd better-auth/skills/better-auth-best-practices",desc:"OAuth, JWT, sesiones, refresh tokens",tags:["auth","autenticacion","oauth","jwt","seguridad","sesiones","login"]},
  {name:"ai-sdk",cmd:"npx skillsadd vercel/ai/ai-sdk",desc:"Vercel AI SDK: streaming, tool calling, embeddings",tags:["ia","sdk","vercel","streaming","tools","api","embedding"]},
  {name:"langchain-middleware",cmd:"npx skillsadd langchain-ai/langchain-skills",desc:"Human-in-the-loop y middleware con LangChain",tags:["langchain","middleware","ia","agentes","human-in-the-loop"]},
  {name:"deep-agents-orchestration",cmd:"npx skillsadd langchain-ai/langchain-skills",desc:"Subagentes, task planning y human-in-the-loop",tags:["agentes","orquestacion","ia","subagentes","planificacion"]},
  {name:"tool-design",cmd:"npx skillsadd muratcankoylan/Agent-Skills-for-Context-Engineering",desc:"Diseña herramientas que los agentes IA pueden usar",tags:["herramientas","agentes","ia","tools","diseño","api"]},
  {name:"azure-ai",cmd:"npx skillsadd microsoft/github-copilot-for-azure/azure-ai",desc:"Azure AI: OpenAI, Document Intelligence, Vision",tags:["azure","ia","cloud","microsoft","openai","vision","documento"]},
  {name:"brainstorming",cmd:"npx skillsadd obra/superpowers/brainstorming",desc:"Pensamiento lateral, conexiones inesperadas, ideas",tags:["ideas","creatividad","brainstorm","innovacion","pensamiento","lateral"]},
  {name:"marketing-ideas",cmd:"npx skillsadd coreyhaines31/marketingskills/marketing-ideas",desc:"Ideas de marketing para productos digitales",tags:["marketing","ideas","producto","digital","campana","growth"]},
  {name:"free-tool-strategy",cmd:"npx skillsadd coreyhaines31/marketingskills/free-tool-strategy",desc:"Herramientas gratuitas como canal de adquisición",tags:["marketing","growth","herramientas","freemium","adquisicion","saas"]},
  {name:"content-strategy",cmd:"npx skillsadd coreyhaines31/marketingskills/content-strategy",desc:"Planificación de contenido: audiencia, canales, métricas",tags:["contenido","estrategia","audiencia","canales","calendario","marketing"]},
  {name:"copywriting",cmd:"npx skillsadd coreyhaines31/marketingskills/copywriting",desc:"Textos que convierten: headlines, CTAs, landing pages",tags:["copy","escritura","conversion","landing","cta","ventas","persuasion"]},
  {name:"writing-skills",cmd:"npx skillsadd obra/superpowers/writing-skills",desc:"Escritura clara y persuasiva para cualquier formato",tags:["escritura","redaccion","contenido","comunicacion","texto","narrativa"]},
  {name:"seo-audit",cmd:"npx skillsadd coreyhaines31/marketingskills/seo-audit",desc:"SEO: keywords, estructura, backlinks, técnico",tags:["seo","busqueda","google","keywords","trafico","organico","web"]},
  {name:"marketing-psychology",cmd:"npx skillsadd coreyhaines31/marketingskills/marketing-psychology",desc:"Escasez, reciprocidad, prueba social aplicados al marketing",tags:["psicologia","marketing","persuasion","comportamiento","conversion","ventas"]},
  {name:"email-sequence",cmd:"npx skillsadd coreyhaines31/marketingskills/email-sequence",desc:"Secuencias de email: onboarding, re-engagement, conversión",tags:["email","newsletter","secuencia","marketing","automatizacion","leads"]},
  {name:"launch-strategy",cmd:"npx skillsadd coreyhaines31/marketingskills/launch-strategy",desc:"Pre-launch, launch day y post-launch de producto",tags:["lanzamiento","producto","estrategia","marketing","go-to-market","saas"]},
  {name:"analytics-tracking",cmd:"npx skillsadd coreyhaines31/marketingskills/analytics-tracking",desc:"Tracking de eventos, funnels y KPIs",tags:["analytics","metricas","kpi","funnel","datos","tracking","eventos"]},
  {name:"data-analysis",cmd:"npx skillsadd supercent-io/skills-template/data-analysis",desc:"Limpieza, exploración, visualización e insights de datos",tags:["datos","analisis","visualizacion","insights","estadistica","python","ml"]},
  {name:"supabase-postgres-best-practices",cmd:"npx skillsadd supabase/agent-skills/supabase-postgres-best-practices",desc:"Supabase + Postgres: RLS, funciones, índices",tags:["supabase","postgres","sql","base de datos","backend","rls","auth"]},
  {name:"neon-postgres",cmd:"npx skillsadd neondatabase/agent-skills/neon-postgres",desc:"Postgres serverless con Neon: branching y pooling",tags:["neon","postgres","serverless","base de datos","sql","cloud"]},
  {name:"performance-optimization",cmd:"npx skillsadd supercent-io/skills-template/performance-optimization",desc:"Profiling, bottleneck detection y optimización",tags:["performance","optimizacion","velocidad","carga","profiling","backend"]},
  {name:"deployment-automation",cmd:"npx skillsadd supercent-io/skills-template/deployment-automation",desc:"CI/CD: GitHub Actions, builds automáticos, deploys",tags:["devops","ci","cd","github actions","deploy","automatizacion","pipeline"]},
  {name:"git-workflow",cmd:"npx skillsadd supercent-io/skills-template/git-workflow",desc:"Branching, PR reviews, convenciones de commits",tags:["git","workflow","branching","commits","pr","version control"]},
  {name:"vercel-deploy",cmd:"npx skillsadd supercent-io/skills-template/vercel-deploy",desc:"Deploy en Vercel: preview, env vars, dominios",tags:["vercel","deploy","hosting","frontend","nextjs","preview"]},
  {name:"using-git-worktrees",cmd:"npx skillsadd obra/superpowers/using-git-worktrees",desc:"Worktrees para múltiples features simultáneas",tags:["git","worktrees","paralelo","features","workflow","branches"]},
  {name:"harden",cmd:"npx skillsadd pbakaus/impeccable/harden",desc:"Hardening: headers, CSP, rate limiting, protecciones",tags:["seguridad","hardening","csp","headers","proteccion","backend"]},
  {name:"code-review",cmd:"npx skillsadd supercent-io/skills-template/code-review",desc:"Code review: seguridad, calidad, maintainability",tags:["code review","calidad","seguridad","refactor","revision","buenas practicas"]},
  {name:"ai-image-generation",cmd:"npx skillsadd inferen-sh/skills/ai-image-generation",desc:"Imágenes con IA: prompting, estilos, iteración",tags:["imagen","ia","generacion","prompting","arte","visual","diffusion"]},
  {name:"brand-guidelines",cmd:"npx skillsadd anthropics/skills/brand-guidelines",desc:"Guías de marca: logo, color, tipografía, voz",tags:["marca","branding","logo","identidad","color","tipografia","visual"]},
  {name:"algorithmic-art",cmd:"npx skillsadd anthropics/skills/algorithmic-art",desc:"Arte generativo con p5.js: partículas, flow fields",tags:["arte","generativo","p5js","creativo","algoritmo","visual","canvas"]},
  {name:"search",cmd:"npx skillsadd tavily-ai/skills/search",desc:"Búsqueda web avanzada con Tavily",tags:["busqueda","web","investigacion","research","informacion","tavily"]},
  {name:"firecrawl",cmd:"npx skillsadd firecrawl/cli/firecrawl",desc:"Scraping y crawling para extracción de datos",tags:["scraping","crawling","datos","web","extraccion","automatizacion"]},
  {name:"agent-browser",cmd:"npx skillsadd vercel-labs/agent-browser/agent-browser",desc:"Automatización de browser: navegación, extracción",tags:["browser","automatizacion","web","navegacion","scraping","testing"]},
  {name:"programmatic-seo",cmd:"npx skillsadd coreyhaines31/marketingskills/programmatic-seo",desc:"SEO programático: páginas a escala, long-tail",tags:["seo","programatico","keywords","contenido","escala","trafico"]},
  {name:"pptx",cmd:"npx skillsadd anthropics/skills/pptx",desc:"Crea y edita presentaciones PowerPoint",tags:["presentacion","pptx","slides","powerpoint","deck","documento"]},
  {name:"pdf",cmd:"npx skillsadd anthropics/skills/pdf",desc:"Lee, extrae, combina y genera PDFs",tags:["pdf","documento","extraccion","combinar","reporte","archivo"]},
  {name:"product-marketing-context",cmd:"npx skillsadd coreyhaines31/marketingskills/product-marketing-context",desc:"Posicionamiento, ICP, messaging y diferenciación",tags:["producto","marketing","posicionamiento","icp","mensaje","diferenciacion"]}
];

function matchSkills(name, role, desc) {
  const input = (name + ' ' + role + ' ' + desc).toLowerCase();
  const words = input.split(/\s+/).filter(w => w.length > 2);
  return SKILLS_CAT.map(s => {
    let score = 0;
    const haystack = (s.name + ' ' + s.desc + ' ' + s.tags.join(' ')).toLowerCase();
    words.forEach(w => { if(haystack.includes(w)) score++; });
    // bonus por match exacto en name o tags
    s.tags.forEach(t => { if(input.includes(t)) score += 2; });
    return {...s, score};
  }).filter(s => s.score > 0).sort((a,b) => b.score - a.score).slice(0, 8);
}
"""

# ── 2. renderCreator() ─────────────────────────────────────────────────────────
RENDER_CREATOR = r"""
// ─── CREATOR SCREEN ────────────────────────────────────────────────────────────
function renderCreator(){
  app.innerHTML=`
<div style="max-width:640px;margin:0 auto">
  <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
    <button id="nav-home" class="g" style="background:none;border:none;cursor:pointer;font-family:inherit;font-size:11px;letter-spacing:.08em">← HOME</button>
    <span class="d" style="font-size:11px">─────────────────────────</span>
    <span class="g" style="font-size:11px;letter-spacing:.1em;font-weight:700">CREAR AGENTE</span>
  </div>

  <div class="term-box" style="margin-bottom:1rem">
    <div class="d" style="font-size:10px;margin-bottom:.75rem;letter-spacing:.08em">▸ DEFINÍ TU AGENTE — te recomendamos las mejores skills</div>

    <div style="margin-bottom:.75rem">
      <label class="m" style="font-size:10px;display:block;margin-bottom:.3rem;letter-spacing:.08em">NOMBRE</label>
      <input id="cr-name" type="text" placeholder="ej: Elena, DataBot, Guardian..." style="width:100%;box-sizing:border-box;background:#0f0f0f;border:1px solid #2a2a2a;color:#E0E0E0;font-family:'Geist Mono',monospace;font-size:12px;padding:.5rem .75rem;outline:none;border-radius:2px" />
    </div>

    <div style="margin-bottom:.75rem">
      <label class="m" style="font-size:10px;display:block;margin-bottom:.3rem;letter-spacing:.08em">ROL / FUNCIÓN PRINCIPAL</label>
      <input id="cr-role" type="text" placeholder="ej: Analista de datos, DevOps, Copywriter, Agente de seguridad..." style="width:100%;box-sizing:border-box;background:#0f0f0f;border:1px solid #2a2a2a;color:#E0E0E0;font-family:'Geist Mono',monospace;font-size:12px;padding:.5rem .75rem;outline:none;border-radius:2px" />
    </div>

    <div style="margin-bottom:1rem">
      <label class="m" style="font-size:10px;display:block;margin-bottom:.3rem;letter-spacing:.08em">DESCRIPCIÓN — ¿qué hace? ¿en qué proyectos?</label>
      <textarea id="cr-desc" rows="4" placeholder="ej: Revisa código en busca de vulnerabilidades, implementa autenticación, gestiona permisos y audita APIs antes de producción..." style="width:100%;box-sizing:border-box;background:#0f0f0f;border:1px solid #2a2a2a;color:#E0E0E0;font-family:'Geist Mono',monospace;font-size:12px;padding:.5rem .75rem;outline:none;border-radius:2px;resize:vertical"></textarea>
    </div>

    <button id="btn-match" class="g" style="background:none;border:1px solid #00FF41;color:#00FF41;font-family:'Geist Mono',monospace;font-size:11px;padding:.5rem 1.25rem;cursor:pointer;letter-spacing:.1em;width:100%;transition:all .15s" onmouseenter="this.style.background='#00FF41';this.style.color='#080808'" onmouseleave="this.style.background='none';this.style.color='#00FF41'">
      → RECOMENDAR SKILLS
    </button>
  </div>

  <div id="cr-results" style="display:none"></div>
</div>`;

  document.getElementById('nav-home').addEventListener('click',()=>{S.screen='boot';render()});

  document.getElementById('btn-match').addEventListener('click',()=>{
    const name = document.getElementById('cr-name').value.trim();
    const role = document.getElementById('cr-role').value.trim();
    const desc = document.getElementById('cr-desc').value.trim();

    if(!role && !desc){ alert('Completá al menos el rol o la descripción.'); return; }

    const matched = matchSkills(name, role, desc);
    const agentName = name || 'Mi Agente';
    const resultsEl = document.getElementById('cr-results');

    if(matched.length === 0){
      resultsEl.style.display='block';
      resultsEl.innerHTML=`<div class="term-box d" style="font-size:11px">No encontramos matches. Probá con palabras clave más específicas o explorá skills en <a href="https://skills.sh" target="_blank" class="g">skills.sh →</a></div>`;
      return;
    }

    const installCmds = matched.map(s => s.cmd).join('\n');
    const profilePrompt = buildPromptCreator(agentName, role, desc, matched);

    resultsEl.style.display='block';
    resultsEl.innerHTML=`
<div class="term-box" style="margin-bottom:1rem">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <span class="g" style="font-size:11px;letter-spacing:.1em;font-weight:700">▸ SKILLS RECOMENDADAS — ${agentName.toUpperCase()}</span>
    <a href="https://skills.sh" target="_blank" class="d" style="font-size:10px;text-decoration:none;letter-spacing:.06em">+ explorar skills.sh →</a>
  </div>
  <div id="cr-skills-list">
    ${matched.map((s,i)=>`
    <div style="margin-bottom:.75rem;padding:.6rem .75rem;background:#0f0f0f;border-left:2px solid #00FF41">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;margin-bottom:.25rem">
        <span class="g" style="font-size:11px;font-weight:700">${String(i+1).padStart(2,'0')}. ${s.name}</span>
        <button class="cp-skill d" data-cmd="${s.cmd.replace(/"/g,'&quot;')}" style="background:none;border:none;cursor:pointer;font-family:inherit;font-size:9px;letter-spacing:.08em;padding:0;white-space:nowrap" title="Copiar comando">[copiar]</button>
      </div>
      <div class="m" style="font-size:10px;margin-bottom:.4rem">${s.desc}</div>
      <code style="font-size:9px;color:#444;display:block;word-break:break-all">${s.cmd}</code>
    </div>`).join('')}
  </div>
</div>

<div class="term-box" style="margin-bottom:1rem">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem">
    <span class="g" style="font-size:11px;letter-spacing:.1em;font-weight:700">▸ PROMPT DEL AGENTE</span>
    <div style="display:flex;gap:.75rem">
      <button id="btn-cp-install" class="d" style="background:none;border:none;cursor:pointer;font-family:inherit;font-size:10px;letter-spacing:.08em">[copiar install]</button>
      <button id="btn-cp-profile" class="g" style="background:none;border:none;cursor:pointer;font-family:inherit;font-size:10px;letter-spacing:.08em">[copiar prompt]</button>
    </div>
  </div>
  <pre style="font-size:10px;color:#666;white-space:pre-wrap;word-break:break-word;max-height:260px;overflow-y:auto;margin:0">${escHtml(profilePrompt)}</pre>
</div>`;

    // copy individual skill
    resultsEl.querySelectorAll('.cp-skill').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.cmd);
        const orig = btn.textContent;
        btn.textContent='[copiado]'; btn.style.color='#00FF41';
        setTimeout(()=>{ btn.textContent=orig; btn.style.color=''; },1500);
      });
    });

    document.getElementById('btn-cp-install').addEventListener('click',()=>{
      navigator.clipboard.writeText(installCmds);
      const b=document.getElementById('btn-cp-install');
      b.textContent='[copiado!]'; b.style.color='#00FF41';
      setTimeout(()=>{ b.textContent='[copiar install]'; b.style.color=''; },1500);
    });

    document.getElementById('btn-cp-profile').addEventListener('click',()=>{
      navigator.clipboard.writeText(profilePrompt);
      const b=document.getElementById('btn-cp-profile');
      b.textContent='[copiado!]';
      setTimeout(()=>{ b.textContent='[copiar prompt]'; },1500);
    });
  });
}

function escHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function buildPromptCreator(name, role, desc, skills){
  const skillNames = skills.map(s=>s.name).join(', ');
  const installLines = skills.map(s=>`  ${s.cmd}`).join('\n');
  return `# AGENTE: ${name.toUpperCase()}

## ROL
${role || 'Agente especializado'}

## DESCRIPCIÓN
${desc || 'Sin descripción.'}

## PERSONALIDAD
[Definí aquí la voz y estilo de ${name}: cómo habla, cómo piensa, qué prioriza]

## EXPERTISE
${skillNames}

## REGLAS
- Respondé siempre desde tu especialidad
- Si algo escapa a tu dominio, decilo explícitamente
- Usá la primera persona

## SKILLS — INSTALÁ ANTES DE RESPONDER
\`\`\`
${installLines}
\`\`\`

## ARRANQUE
1. Instalá los skills listados arriba
2. Adoptá el rol de ${name}
3. Saludá brevemente e indicá en qué podés ayudar`;
}
"""

# ── 3. Boot screen: agregar [3] CREAR ─────────────────────────────────────────
OLD_BOOT_BUTTONS = """      <button id="btn-equipo" class="term-box" style="text-align:left;cursor:pointer;transition:border-color .15s" onmouseenter="this.style.borderColor='#00FF41'" onmouseleave="this.style.borderColor='#1A1A1A'">
        <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.4rem">
          <span class="g" style="font-weight:700;letter-spacing:.1em">[2] EQUIPO</span>
          <span class="d" style="font-size:11px">─── múltiples agentes</span>
        </div>
        <div class="m" style="font-size:11px;padding-left:1rem">
          Armás un equipo coordinado por Rodrigo (PM).<br>
          Output: prompt con roles, banco y handoff.
        </div>
        <div style="margin-top:.6rem;font-size:11px;color:#444">&gt; Armar equipo →</div>
      </button>"""

NEW_BOOT_BUTTONS = """      <button id="btn-equipo" class="term-box" style="text-align:left;cursor:pointer;transition:border-color .15s" onmouseenter="this.style.borderColor='#00FF41'" onmouseleave="this.style.borderColor='#1A1A1A'">
        <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.4rem">
          <span class="g" style="font-weight:700;letter-spacing:.1em">[2] EQUIPO</span>
          <span class="d" style="font-size:11px">─── múltiples agentes</span>
        </div>
        <div class="m" style="font-size:11px;padding-left:1rem">
          Armás un equipo coordinado por Rodrigo (PM).<br>
          Output: prompt con roles, banco y handoff.
        </div>
        <div style="margin-top:.6rem;font-size:11px;color:#444">&gt; Armar equipo →</div>
      </button>
      <button id="btn-crear" class="term-box" style="text-align:left;cursor:pointer;transition:border-color .15s" onmouseenter="this.style.borderColor='#00FF41'" onmouseleave="this.style.borderColor='#1A1A1A'">
        <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.4rem">
          <span class="g" style="font-weight:700;letter-spacing:.1em">[3] CREAR AGENTE</span>
          <span class="d" style="font-size:11px">─── agente personalizado</span>
        </div>
        <div class="m" style="font-size:11px;padding-left:1rem">
          Describís las características del agente.<br>
          Output: skills recomendadas + prompt listo para usar.
        </div>
        <div style="margin-top:.6rem;font-size:11px;color:#444">&gt; Diseñar agente →</div>
      </button>"""

# ── 4. Boot listeners: agregar btn-crear ──────────────────────────────────────
OLD_BOOT_LISTENERS = """          document.getElementById('btn-equipo').addEventListener('click',()=>{
            S.mode='equipo'; S.team=['rodrigo']; S.screen='catalog'; render();
          });"""

NEW_BOOT_LISTENERS = """          document.getElementById('btn-equipo').addEventListener('click',()=>{
            S.mode='equipo'; S.team=['rodrigo']; S.screen='catalog'; render();
          });
          document.getElementById('btn-crear').addEventListener('click',()=>{
            S.mode='crear'; S.screen='creator'; render();
          });"""

# ── 5. render(): agregar creator branch ───────────────────────────────────────
OLD_RENDER = """function render(){
  if(S.screen==='boot') renderBoot();
  else if(S.screen==='catalog') renderCatalog();
  else if(S.screen==='team') renderTeam();"""

NEW_RENDER = """function render(){
  if(S.screen==='boot') renderBoot();
  else if(S.screen==='creator') renderCreator();
  else if(S.screen==='catalog') renderCatalog();
  else if(S.screen==='team') renderTeam();"""

# ── 6. S state: agregar mode 'crear' ─────────────────────────────────────────
OLD_STATE = "S.mode='equipo'; S.team=['rodrigo']; S.screen='catalog'; render();"
# (ya cubierto arriba en listeners)

# ── APPLY PATCHES ─────────────────────────────────────────────────────────────
def patch():
    with open(ARTIFACT, 'r', encoding='utf-8') as f:
        html = f.read()

    original_len = len(html)

    # 1. Insertar SKILLS_CAT + matchSkills antes de "// ─── CATALOG SCREEN"
    CATALOG_MARKER = '// ─── CATALOG SCREEN ────────────────────────────────────────────────────────────'
    if CATALOG_MARKER not in html:
        print('ERROR: CATALOG_MARKER not found')
        return False
    html = html.replace(CATALOG_MARKER, SKILLS_JS + '\n' + CATALOG_MARKER)

    # 2. Insertar renderCreator() antes de "// ─── CATALOG SCREEN"
    # (ahora el marker está después de SKILLS_JS, así que volvemos a buscar)
    html = html.replace(CATALOG_MARKER, RENDER_CREATOR + '\n' + CATALOG_MARKER)

    # 3. Boot buttons: agregar [3] CREAR
    if OLD_BOOT_BUTTONS not in html:
        print('ERROR: OLD_BOOT_BUTTONS not found')
        return False
    html = html.replace(OLD_BOOT_BUTTONS, NEW_BOOT_BUTTONS)

    # 4. Boot listeners: agregar btn-crear
    if OLD_BOOT_LISTENERS not in html:
        print('ERROR: OLD_BOOT_LISTENERS not found')
        return False
    html = html.replace(OLD_BOOT_LISTENERS, NEW_BOOT_LISTENERS)

    # 5. render(): agregar creator branch
    if OLD_RENDER not in html:
        print('ERROR: OLD_RENDER not found')
        return False
    html = html.replace(OLD_RENDER, NEW_RENDER)

    with open(ARTIFACT, 'w', encoding='utf-8') as f:
        f.write(html)

    new_len = len(html)
    print(f'OK — {original_len:,} → {new_len:,} bytes (+{new_len-original_len:,})')
    return True

if __name__ == '__main__':
    if patch():
        print('Artifact actualizado con CREAR AGENTE.')
    else:
        print('Patch fallido.')
