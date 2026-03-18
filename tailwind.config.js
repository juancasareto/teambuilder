/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#080808',
        surface: '#0E0E0E',
        'surface-2': '#141414',
        border: '#1A1A1A',
        'border-bright': '#2A2A2A',
        accent: {
          DEFAULT: '#00FF41',
          dim: '#00AA2A',
          glow: 'rgba(0,255,65,0.15)',
          muted: 'rgba(0,255,65,0.06)',
        },
        amber: {
          DEFAULT: '#FFB000',
          glow: 'rgba(255,176,0,0.15)',
        },
        cyan: {
          DEFAULT: '#00E5FF',
          glow: 'rgba(0,229,255,0.15)',
        },
        'term-red': {
          DEFAULT: '#FF3B3B',
          glow: 'rgba(255,59,59,0.15)',
        },
        text: {
          primary: '#E0E0E0',
          muted: '#555555',
          faint: '#2A2A2A',
          green: '#00FF41',
          amber: '#FFB000',
          cyan: '#00E5FF',
        },
        category: {
          estrategico: '#A855F7',
          tecnico: '#00FF41',
          creativo: '#FFB000',
          datos: '#C084FC',
          social: '#FF6EB4',
          diseno: '#00E5FF',
          seguridad: '#FF3B3B',
        },
        agent: {
          listening: '#333333',
          raising: '#00FF41',
          speaking: '#E0E0E0',
        },
      },
      fontFamily: {
        display: ['Geist Mono', 'monospace'],
        ui: ['Geist Mono', 'monospace'],
        mono: ['Geist Mono', 'monospace'],
      },
      spacing: {
        sidebar: '280px',
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '1px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
      },
      boxShadow: {
        'glow-green': '0 0 12px rgba(0,255,65,0.5), 0 0 40px rgba(0,255,65,0.15)',
        'glow-green-sm': '0 0 6px rgba(0,255,65,0.35)',
        'glow-amber': '0 0 12px rgba(255,176,0,0.5), 0 0 40px rgba(255,176,0,0.15)',
        'glow-cyan': '0 0 12px rgba(0,229,255,0.5), 0 0 40px rgba(0,229,255,0.15)',
        'glow-red': '0 0 12px rgba(255,59,59,0.5)',
        card: '0 0 0 1px #1A1A1A',
        'card-hover': '0 0 0 1px #00FF41, 0 0 20px rgba(0,255,65,0.1)',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'blink-fast': 'blink 0.4s step-end infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'glow-pulse-amber': 'glowPulseAmber 2.5s ease-in-out infinite',
        'glow-pulse-cyan': 'glowPulseCyan 2.5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'scan': 'scan 6s linear infinite',
        'flicker': 'flicker 8s infinite',
        'ping-once': 'ping 0.6s cubic-bezier(0, 0, 0.2, 1) 1',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { textShadow: '0 0 6px rgba(0,255,65,0.6)' },
          '50%': { textShadow: '0 0 18px rgba(0,255,65,1), 0 0 35px rgba(0,255,65,0.4)' },
        },
        glowPulseAmber: {
          '0%, 100%': { textShadow: '0 0 6px rgba(255,176,0,0.6)' },
          '50%': { textShadow: '0 0 18px rgba(255,176,0,1), 0 0 35px rgba(255,176,0,0.4)' },
        },
        glowPulseCyan: {
          '0%, 100%': { textShadow: '0 0 6px rgba(0,229,255,0.6)' },
          '50%': { textShadow: '0 0 18px rgba(0,229,255,1), 0 0 35px rgba(0,229,255,0.4)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 95%, 100%': { opacity: '1' },
          '96%': { opacity: '0.92' },
          '97%': { opacity: '1' },
          '98%': { opacity: '0.94' },
          '99%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
