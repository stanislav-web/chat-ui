/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  corePlugins: {
    float: true,
    objectFit: true,
    objectPosition: true
  },
  theme: {
    themeVariants: ['dark'],
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans]
      },
      spacing: {
        128: '32rem',
        144: '36rem'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  variants: {
    backgroundColor: ['responsive', 'dark'],
    textColor: ['responsive', 'dark']
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ]
};
