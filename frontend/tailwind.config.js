/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0B0B',
        surface: '#141414',
        card: {
          DEFAULT: '#1C1C1C',
          hover: '#242424',
        },
        primary: {
          DEFAULT: '#FF6A00',
          light: '#FF8C1A',
          dark: '#B63A00',
        },
        accent: '#FFD166',
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#A8A8A8',
          muted: '#757575',
        },
        border: {
          DEFAULT: '#2A2A2A',
          light: '#393939',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '22px',
      },
      boxShadow: {
        'sm': '0 4px 12px rgba(0,0,0,.25)',
        'md': '0 10px 30px rgba(0,0,0,.35)',
        'lg': '0 20px 60px rgba(0,0,0,.45)',
        'glow': '0 0 30px rgba(255,106,0,.35)',
        'glow-sm': '0 0 15px rgba(255,106,0,.25)',
        'glow-lg': '0 0 50px rgba(255,106,0,.45)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF5A00 0%, #FF8C00 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0B0B0B, #161616)',
        'gradient-card': 'linear-gradient(135deg, #1C1C1C, #141414)',
        'gradient-glow': 'radial-gradient(circle at center, rgba(255,106,0,.22), rgba(182,58,0,.08), transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,106,0,.2)' },
          '50%': { boxShadow: '0 0 40px rgba(255,106,0,.4)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
