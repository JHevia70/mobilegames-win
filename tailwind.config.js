/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'headline': ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        gaming: {
          red: '#dc191b',
          'dark-blue': '#22374e',
          'dark-teal': '#0f1618',
          gold: '#FFD700',
          purple: '#8B5CF6',
          pink: '#EC4899',
          cyan: '#06B6D4',
          orange: '#F97316',
          green: '#10B981',
          'light-gray': '#ededed',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%': { opacity: 0, transform: 'rotate(0deg) scale(0)' },
          '50%': { opacity: 1, transform: 'rotate(180deg) scale(1)' },
          '100%': { opacity: 0, transform: 'rotate(360deg) scale(0)' },
        },
        'sparkle-rotate': {
          '0%': { transform: 'rotate(0deg) scale(1)', opacity: 1 },
          '50%': { transform: 'rotate(180deg) scale(1.2)', opacity: 0.8 },
          '100%': { transform: 'rotate(360deg) scale(1)', opacity: 1 },
        },
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        'treasure-bounce': {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.1)' },
        },
        'float-particle': {
          '0%': { transform: 'translateY(20px) rotate(0deg)', opacity: 0 },
          '10%': { opacity: 1 },
          '50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(20px) rotate(360deg)', opacity: 0 },
        },
        'fall-down': {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: 0 },
        },
        'prize-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.5)',
            transform: 'scale(1.05)'
          },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: 1 },
          '2%': { opacity: 0.8 },
          '4%': { opacity: 1 },
          '6%': { opacity: 0.9 },
          '8%': { opacity: 1 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        glow: 'glow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        sparkle: 'sparkle 3s ease-in-out infinite',
        'sparkle-rotate': 'sparkle-rotate 2s infinite',
        shine: 'shine 2s infinite',
        'treasure-bounce': 'treasure-bounce 1.5s infinite',
        'float-particle': 'float-particle 6s infinite ease-in-out',
        'fall-down': 'fall-down 3s infinite linear',
        'prize-pulse': 'prize-pulse 2s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 3s infinite',
      },
    },
  },
  plugins: [],
};