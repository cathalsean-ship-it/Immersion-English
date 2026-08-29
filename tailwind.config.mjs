/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      // Built from the custom properties in src/styles/global.css rather than
      // repeated here. The palette used to exist as hex in both files, so a
      // contrast fix in one left the other behind — text-brand-green and
      // --green would quietly disagree. The rgb(... / <alpha-value>) form is
      // what keeps modifiers like bg-brand-green/20 working.
      colors: {
        brand: {
          green: 'rgb(var(--green-rgb) / <alpha-value>)',
          'green-on-dark': 'rgb(var(--green-on-dark-rgb) / <alpha-value>)',
          'green-deep': 'rgb(var(--green-deep-rgb) / <alpha-value>)',
          'green-soft': 'rgb(var(--green-soft-rgb) / <alpha-value>)',
          orange: 'rgb(var(--orange-rgb) / <alpha-value>)',
          'orange-deep': 'rgb(var(--orange-deep-rgb) / <alpha-value>)',
        },
        cream: 'rgb(var(--cream-rgb) / <alpha-value>)',
        'off-white': 'rgb(var(--off-white-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        'ink-soft': 'rgb(var(--ink-soft-rgb) / <alpha-value>)',
        line: 'rgb(var(--line-rgb) / <alpha-value>)',
        'line-strong': 'rgb(var(--line-strong-rgb) / <alpha-value>)',
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
