/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#008037',
          'green-deep': '#006a2d',
          'green-soft': '#e8f1ea',
          orange: '#FF914D',
          'orange-deep': '#e87a36',
        },
        cream: '#FAF8F3',
        'off-white': '#FEFFFE',
        ink: '#14201a',
        'ink-soft': '#4a5750',
        line: '#e6e2d8',
        'line-strong': '#d4cebf',
      },
      fontFamily: {
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '14px',
        lg: '22px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(20,32,26,0.04), 0 2px 8px rgba(20,32,26,0.04)',
        lift: '0 4px 14px rgba(20,32,26,0.06), 0 16px 40px rgba(20,32,26,0.06)',
      },
      maxWidth: {
        page: '1280px',
      },
    },
  },
  plugins: [],
};
