// ============================================================
// TEAMBUILDER — App.tsx
// Santiago · v0.1
// React Router + rutas base
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WelcomePage }  from './pages/WelcomePage'
import { ScoutPage }    from './pages/ScoutPage'
import { ProposalPage } from './pages/ProposalPage'
import { CatalogPage }  from './pages/CatalogPage'
import { TeamPage }     from './pages/TeamPage'
import { ChatPage }     from './pages/ChatPage'
import { PlansPage }    from './pages/PlansPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<WelcomePage />} />
        <Route path="/scout"               element={<ScoutPage />} />
        <Route path="/scout/propuesta"     element={<ProposalPage />} />
        <Route path="/catalogo"            element={<CatalogPage />} />
        <Route path="/catalogo/:agentId"   element={<CatalogPage />} />
        <Route path="/equipo"              element={<TeamPage />} />
        <Route path="/equipo/chat"         element={<ChatPage />} />
        <Route path="/planes"              element={<PlansPage />} />
        <Route path="*"                    element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
