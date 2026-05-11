import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F2',
        ink: '#1A1815',
        mute: '#6B665E',
        hairline: '#E5DDD0',
        accent: '#B5803B',
        'accent-soft': '#F4EDDF',
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      letterSpacing: {
        meta: '0.12em',
      },
    },
  },
  plugins: [],
};

export default config;
