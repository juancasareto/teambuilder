import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path: /teambuilder/ en GitHub Pages, / en dev local
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/teambuilder/' : '/',
})
