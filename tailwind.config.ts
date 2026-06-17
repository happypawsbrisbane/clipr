import type { Config } from 'tailwindcss';

// Premium, calm palette aimed at a concierge / boutique feel.
const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep eucalyptus green — trustworthy, distinctly Australian.
        brand: {
          50: '#f0f7f4',
          100: '#dcebe4',
          200: '#bcd8cb',
          300: '#8fbda9',
          400: '#5d9b81',
          500: '#3d7f64',
          600: '#2d6450',
          700: '#255042',
          800: '#204036',
          900: '#1c352e',
        },
        sand: '#f7f5f1',
        ink: '#1b1b1a',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
