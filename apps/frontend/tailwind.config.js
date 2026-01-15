/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        'reaction-muted': 'hsl(var(--reaction-muted))',
        'text-white': 'hsl(var(--text-white))',
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        montserrat: {
          regular: ['"montserrat-Regular"', 'sans-serif'],
          medium: ['"montserrat-Medium"', 'sans-serif'],
          semibold: ['"montserrat-SemiBold"', 'sans-serif'],
          bold: ['"montserrat-Bold"', 'sans-serif'],
        },
        poppins: {
          regular: ['"poppins-Regular"', 'sans-serif'],
          medium: ['"poppins-Medium"', 'sans-serif'],
          semibold: ['"poppins-SemiBold"', 'sans-serif'],
          bold: ['"poppins-Bold"', 'sans-serif'],
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
