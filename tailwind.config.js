/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0A0A0F',
        surface: '#13131A',
        border: '#1E1E2E',
        accent: {
          DEFAULT: '#10B981',
          glow: 'rgba(16,185,129,0.2)',
          muted: 'rgba(16,185,129,0.1)',
        },
        text: {
          primary: '#F8F8FF',
          muted: '#6B7280',
          faint: '#374151',
        },
        category: {
          estrategico: '#6366F1',
          tecnico: '#10B981',
          creativo: '#F59E0B',
          datos: '#8B5CF6',
          social: '#EC4899',
          diseno: '#06B6D4',
          seguridad: '#EF4444',
        },
        agent: {
          listening: '#6B7280',
          raising: '#10B981',
          speaking: '#F8F8FF',
        },
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        ui: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      spacing: {
        sidebar: '280px',
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(16,185,129,0.15)',
        'glow-accent-strong': '0 0 40px rgba(16,185,129,0.25)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.6)',
      },
      animation: {
        'ping-once': 'ping 0.6s cubic-bezier(0, 0, 0.2, 1) 1',
        'fade-up': 'fadeUp 0.4s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
