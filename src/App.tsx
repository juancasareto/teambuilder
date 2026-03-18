// TEAMBUILDER — App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WelcomePage } from './pages/WelcomePage'
import { CatalogPage } from './pages/CatalogPage'
import { TeamPage }    from './pages/TeamPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<WelcomePage />} />
        <Route path="/catalogo"  element={<CatalogPage />} />
        <Route path="/equipo"    element={<TeamPage />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
