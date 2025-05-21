/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AIxponential primary colors
        aixblue: {
          50: '#f0f7ff',
          100: '#e0eefe',
          200: '#bae0fd',
          300: '#81c8fb',
          400: '#42aaf7',
          500: '#1a8eed',
          600: '#0870cc',
          700: '#0959a6',
          800: '#0b4d89',
          900: '#0e4072',
          950: '#0a2847',
        },
        aixindigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            maxWidth: '100%',
            code: {
              color: theme('colors.aixblue.600'),
              backgroundColor: theme('colors.gray.100'),
              borderRadius: '0.25rem',
              padding: '0.2em 0.4em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.100'),
              overflow: 'auto',
              padding: '1rem',
              borderRadius: '0.375rem',
              border: '1px solid ' + theme('colors.gray.700'),
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              fontSize: '0.875rem',
              lineHeight: '1.7142857',
              padding: '0',
            },
          },
        },
      }),
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 